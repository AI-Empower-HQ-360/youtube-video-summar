# YouTube Video Summarizer - GCP Infrastructure
# Main Terraform configuration file

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "compute.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
  ])

  service            = each.key
  disable_on_destroy = false
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "app_repo" {
  location      = var.region
  repository_id = "youtube-summarizer"
  description   = "Container registry for YouTube video summarizer application"
  format        = "DOCKER"

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "container-registry"
  }

  depends_on = [google_project_service.required_apis]
}

# Cloud Storage bucket for static assets
resource "google_storage_bucket" "static_assets" {
  name          = "${var.project_id}-youtube-summarizer-assets"
  location      = var.region
  force_destroy = var.environment != "production"

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "storage"
  }
}

# Make bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.static_assets.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloud Run service for backend API
resource "google_cloud_run_v2_service" "api_service" {
  name     = "youtube-summarizer-api"
  location = var.region

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app_repo.repository_id}/api:latest"

      ports {
        container_port = 3000
      }

      env {
        name  = "NODE_ENV"
        value = var.environment
      }

      env {
        name  = "YOUTUBE_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.youtube_api_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "OPENAI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.openai_api_key.secret_id
            version = "latest"
          }
        }
      }

      resources {
        limits = {
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    labels = {
      app         = "youtube-video-summarizer"
      environment = var.environment
      managed-by  = "terraform"
      component   = "api-backend"
    }
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "api-backend"
  }

  depends_on = [google_project_service.required_apis]
}

# Cloud Run IAM - Allow public access
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.api_service.location
  service  = google_cloud_run_v2_service.api_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Secret Manager for API keys
resource "google_secret_manager_secret" "youtube_api_key" {
  secret_id = "youtube-api-key"

  replication {
    auto {}
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "secrets"
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret" "openai_api_key" {
  secret_id = "openai-api-key"

  replication {
    auto {}
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "secrets"
  }

  depends_on = [google_project_service.required_apis]
}

# Grant Cloud Run service account access to secrets
resource "google_secret_manager_secret_iam_member" "youtube_key_access" {
  secret_id = google_secret_manager_secret.youtube_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_cloud_run_v2_service.api_service.template[0].service_account}"
}

resource "google_secret_manager_secret_iam_member" "openai_key_access" {
  secret_id = google_secret_manager_secret.openai_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_cloud_run_v2_service.api_service.template[0].service_account}"
}

# Cloud Build trigger for CI/CD
resource "google_cloudbuild_trigger" "deploy_trigger" {
  name        = "youtube-summarizer-deploy"
  description = "Deploy YouTube video summarizer on push to main"

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  filename = "infrastructure/gcp/cloudbuild.yaml"

  substitutions = {
    _REGION      = var.region
    _ENVIRONMENT = var.environment
  }

  tags = ["youtube-summarizer", "deploy", var.environment]

  depends_on = [google_project_service.required_apis]
}

# ============================================
# MONITORING & ALERTING
# ============================================

# Notification channel for alerts
resource "google_monitoring_notification_channel" "email" {
  count        = var.alert_email != "" ? 1 : 0
  display_name = "Email Notification Channel"
  type         = "email"
  labels = {
    email_address = var.alert_email
  }
  enabled = true
}

# Alert policy for high error rate
resource "google_monitoring_alert_policy" "error_rate" {
  count        = var.enable_monitoring ? 1 : 0
  display_name = "High Error Rate - ${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "Error rate above threshold"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${google_cloud_run_v2_service.api_service.name}\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.05
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }

  notification_channels = var.alert_email != "" ? [google_monitoring_notification_channel.email[0].id] : []

  alert_strategy {
    auto_close = "604800s" # 7 days
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    severity    = "critical"
  }
}

# Alert policy for high latency
resource "google_monitoring_alert_policy" "latency" {
  count        = var.enable_monitoring ? 1 : 0
  display_name = "High Latency - ${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "Request latency above threshold"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${google_cloud_run_v2_service.api_service.name}\" AND metric.type = \"run.googleapis.com/request_latencies\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 5000 # 5 seconds
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_DELTA"
      }
    }
  }

  notification_channels = var.alert_email != "" ? [google_monitoring_notification_channel.email[0].id] : []

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    severity    = "warning"
  }
}

# ============================================
# CDN & LOAD BALANCER
# ============================================

# Reserve external IP for load balancer
resource "google_compute_global_address" "frontend_ip" {
  count = var.enable_cdn ? 1 : 0
  name  = "youtube-summarizer-frontend-ip"
}

# Backend bucket for CDN
resource "google_compute_backend_bucket" "frontend_backend" {
  count       = var.enable_cdn ? 1 : 0
  name        = "youtube-summarizer-frontend-backend"
  bucket_name = google_storage_bucket.static_assets.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    client_ttl        = 3600
    default_ttl       = 3600
    max_ttl           = 86400
    negative_caching  = true
    serve_while_stale = 86400
  }
}

# URL map for load balancer
resource "google_compute_url_map" "frontend_lb" {
  count           = var.enable_cdn ? 1 : 0
  name            = "youtube-summarizer-frontend-lb"
  default_service = google_compute_backend_bucket.frontend_backend[0].id
}

# HTTP proxy
resource "google_compute_target_http_proxy" "frontend_proxy" {
  count   = var.enable_cdn ? 1 : 0
  name    = "youtube-summarizer-http-proxy"
  url_map = google_compute_url_map.frontend_lb[0].id
}

# Global forwarding rule
resource "google_compute_global_forwarding_rule" "frontend_forwarding_rule" {
  count      = var.enable_cdn ? 1 : 0
  name       = "youtube-summarizer-forwarding-rule"
  target     = google_compute_target_http_proxy.frontend_proxy[0].id
  port_range = "80"
  ip_address = google_compute_global_address.frontend_ip[0].address
}

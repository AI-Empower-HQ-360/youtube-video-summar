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
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = var.environment == "production" ? 1 : 0
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
    owner = "AI-Empower-HQ-360"
    name  = "youtube-video-summar"
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

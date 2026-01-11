# ==============================================
# Cost Control Configuration
# ==============================================
# Resource limits and quotas to prevent unexpected costs

# Cloud Run resource limits
locals {
  # Environment-specific resource limits
  resource_limits = {
    dev = {
      cpu              = "1"
      memory           = "512Mi"
      max_instances    = 5
      min_instances    = 0
      timeout_seconds  = 60
      concurrency      = 80
    }
    staging = {
      cpu              = "2"
      memory           = "1Gi"
      max_instances    = 10
      min_instances    = 0
      timeout_seconds  = 120
      concurrency      = 100
    }
    production = {
      cpu              = "2"
      memory           = "2Gi"
      max_instances    = 20
      min_instances    = 1
      timeout_seconds  = 300
      concurrency      = 100
    }
  }
  
  # Cost-effective storage settings
  storage_settings = {
    dev = {
      storage_class = "STANDARD"
      lifecycle_age = 30  # Delete after 30 days
    }
    staging = {
      storage_class = "STANDARD"
      lifecycle_age = 60
    }
    production = {
      storage_class = "STANDARD"
      lifecycle_age = 180
    }
  }
}

# Apply resource limits to Cloud Run
resource "google_cloud_run_service" "api_with_limits" {
  name     = "youtube-summarizer-api-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = local.resource_limits[var.environment].max_instances
        "autoscaling.knative.dev/minScale" = local.resource_limits[var.environment].min_instances
        "run.googleapis.com/startup-cpu-boost" = "false"  # Save costs
      }
    }

    spec {
      container_concurrency = local.resource_limits[var.environment].concurrency
      timeout_seconds      = local.resource_limits[var.environment].timeout_seconds

      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/youtube-summarizer/api:latest"

        resources {
          limits = {
            cpu    = local.resource_limits[var.environment].cpu
            memory = local.resource_limits[var.environment].memory
          }
        }

        env {
          name  = "NODE_ENV"
          value = var.environment
        }

        env {
          name  = "GCP_PROJECT_ID"
          value = var.project_id
        }

        # Cost-saving: Use Secret Manager only for sensitive data
        env {
          name = "OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.openai_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "YOUTUBE_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.youtube_api_key.secret_id
              key  = "latest"
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      template[0].metadata[0].annotations["run.googleapis.com/client-name"],
      template[0].metadata[0].annotations["run.googleapis.com/client-version"],
    ]
  }
}

# Storage lifecycle policy to reduce costs
resource "google_storage_bucket" "static_assets_with_lifecycle" {
  name          = "${var.project_id}-${var.environment}-static-assets"
  location      = var.region
  project       = var.project_id
  storage_class = local.storage_settings[var.environment].storage_class
  
  uniform_bucket_level_access = true

  # Cost-saving lifecycle rules
  lifecycle_rule {
    condition {
      age = local.storage_settings[var.environment].lifecycle_age
    }
    action {
      type = "Delete"
    }
  }

  # Move to cheaper storage class after 30 days (production only)
  dynamic "lifecycle_rule" {
    for_each = var.environment == "production" ? [1] : []
    content {
      condition {
        age = 30
      }
      action {
        type          = "SetStorageClass"
        storage_class = "NEARLINE"
      }
    }
  }

  # Enable versioning but delete old versions
  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 3
    }
    action {
      type = "Delete"
    }
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "storage"
  }
}

# Artifact Registry with cleanup policies
resource "google_artifact_registry_repository" "docker_with_cleanup" {
  location      = var.region
  repository_id = "youtube-summarizer-${var.environment}"
  description   = "Docker repository for YouTube Summarizer (${var.environment})"
  format        = "DOCKER"
  project       = var.project_id

  # Cost-saving: Clean up old images
  cleanup_policies {
    id     = "delete-old-images"
    action = "DELETE"
    condition {
      older_than = "2592000s"  # 30 days
    }
  }

  cleanup_policies {
    id     = "keep-recent-images"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10  # Keep last 10 versions
    }
  }

  labels = {
    app         = "youtube-video-summarizer"
    environment = var.environment
    managed-by  = "terraform"
    component   = "container-registry"
  }
}

# Monitoring and alerting for cost anomalies
resource "google_monitoring_alert_policy" "high_cost_alert" {
  display_name = "High Cost Alert - ${var.environment}"
  project      = var.project_id
  combiner     = "OR"

  conditions {
    display_name = "Cloud Run Request Count Spike"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = var.environment == "production" ? 10000 : 1000
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }

  notification_channels = var.alert_notification_channels

  alert_strategy {
    auto_close = "1800s"
  }

  documentation {
    content = <<-EOT
      Unusual spike in Cloud Run requests detected.
      This may result in unexpected costs.
      
      Environment: ${var.environment}
      
      Actions:
      1. Check for DDoS or abuse
      2. Review application logs
      3. Consider enabling rate limiting
      4. Check budget alerts
    EOT
  }
}

# Output cost control information
output "cost_controls" {
  description = "Cost control settings applied"
  value = {
    environment      = var.environment
    max_instances    = local.resource_limits[var.environment].max_instances
    min_instances    = local.resource_limits[var.environment].min_instances
    cpu_limit        = local.resource_limits[var.environment].cpu
    memory_limit     = local.resource_limits[var.environment].memory
    storage_lifecycle = local.storage_settings[var.environment].lifecycle_age
  }
}

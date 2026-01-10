# Output values for GCP infrastructure

output "api_url" {
  description = "URL of the deployed Cloud Run API service"
  value       = google_cloud_run_v2_service.api_service.uri
}

output "static_bucket_url" {
  description = "URL of the static assets bucket"
  value       = "https://storage.googleapis.com/${google_storage_bucket.static_assets.name}"
}

output "artifact_registry_url" {
  description = "URL of the Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app_repo.repository_id}"
}

output "youtube_secret_name" {
  description = "Name of the YouTube API key secret"
  value       = google_secret_manager_secret.youtube_api_key.secret_id
}

output "openai_secret_name" {
  description = "Name of the OpenAI API key secret"
  value       = google_secret_manager_secret.openai_api_key.secret_id
}

output "frontend_cdn_ip" {
  description = "IP address of the frontend CDN load balancer"
  value       = var.enable_cdn ? google_compute_global_address.frontend_ip[0].address : "CDN not enabled"
}

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

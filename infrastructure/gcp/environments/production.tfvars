# Production Environment Configuration

project_id    = "your-gcp-project-id-prod"
region        = "us-central1"
environment   = "production"

# Scaling configuration
min_instances = 2   # Always keep 2 instances for HA
max_instances = 50  # Scale up to 50 for high traffic

# Resource limits
cpu_limit    = "2000m"
memory_limit = "2Gi"

# Monitoring
enable_monitoring = true
alert_email       = "ops-team@example.com"

# CDN (enabled for production)
enable_cdn = true

# GitHub configuration
github_owner = "AI-Empower-HQ-360"
github_repo  = "youtube-video-summar"

# Custom domain (update with your actual domain)
# domain_name = "app.yourdomain.com"

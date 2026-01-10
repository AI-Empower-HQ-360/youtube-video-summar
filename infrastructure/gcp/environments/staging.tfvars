# Staging Environment Configuration

project_id    = "your-gcp-project-id-staging"
region        = "us-central1"
environment   = "staging"

# Scaling configuration
min_instances = 1  # Keep 1 instance warm
max_instances = 10

# Resource limits
cpu_limit    = "2000m"
memory_limit = "1Gi"

# Monitoring
enable_monitoring = true
alert_email       = "your-email@example.com"

# CDN (enabled for staging testing)
enable_cdn = true

# GitHub configuration
github_owner = "AI-Empower-HQ-360"
github_repo  = "youtube-video-summar"

# Optional: Custom domain
# domain_name = "staging.yourdomain.com"

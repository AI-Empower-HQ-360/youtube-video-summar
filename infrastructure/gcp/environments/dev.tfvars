# Development Environment Configuration

project_id    = "your-gcp-project-id-dev"
region        = "us-central1"
environment   = "dev"

# Scaling configuration
min_instances = 0  # Scale to zero in dev
max_instances = 5

# Resource limits
cpu_limit    = "1000m"
memory_limit = "512Mi"

# Monitoring
enable_monitoring = true
alert_email       = "your-email@example.com"

# CDN (disabled for dev to save costs)
enable_cdn = false

# GitHub configuration
github_owner = "AI-Empower-HQ-360"
github_repo  = "youtube-video-summar"

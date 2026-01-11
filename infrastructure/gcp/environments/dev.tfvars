# ==============================================
# Development Environment Configuration
# ==============================================
# Cost-optimized for FREE tier (1 month)
# Estimated Cost: $0-15/month (covered by $300 credit)
# Budget: $15 USD/month

project_id    = "youtube-video-summary-483906"
region        = "us-central1"
environment   = "dev"

# Scaling configuration (cost-optimized)
min_instances = 0  # Scale to zero when idle (FREE)
max_instances = 3  # Limit max scaling

# Resource limits (minimal for dev)
cpu_limit    = "1000m"   # 1 vCPU
memory_limit = "512Mi"   # 512MB RAM

# Monitoring
enable_monitoring = true
alert_email       = ""   # Set via ./budget-alerts.sh

# CDN (disabled for dev to save costs)
enable_cdn = false

# GitHub configuration
github_owner = "AI-Empower-HQ-360"
github_repo  = "youtube-video-summar"

# Cost control labels
labels = {
  budget      = "15-usd-per-month"
  cost-center = "free-tier"
}

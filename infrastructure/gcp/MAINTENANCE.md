# GCP Infrastructure Maintenance Guide

## 🔧 Routine Maintenance Tasks

### Daily Tasks

#### Monitor Application Health
```bash
# Check Cloud Run service status
gcloud run services describe youtube-summarizer-api \
  --region us-central1 \
  --format="value(status.conditions)"

# View recent logs
gcloud run services logs read youtube-summarizer-api \
  --region us-central1 \
  --limit 20
```

#### Check Error Rates
```bash
# Open monitoring dashboard
gcloud monitoring dashboards list

# Or visit:
# https://console.cloud.google.com/monitoring
```

### Weekly Tasks

#### Review Costs
```bash
# Check current month costs
gcloud billing accounts list
gcloud billing projects describe PROJECT_ID

# Or visit:
# https://console.cloud.google.com/billing
```

#### Update Dependencies
```bash
# Check for outdated npm packages
cd ../../
npm outdated

# Update non-breaking changes
npm update

# Rebuild and deploy
cd infrastructure/gcp
./deploy-enhanced.sh build
```

### Monthly Tasks

#### Rotate API Keys
```bash
# Update secrets
./deploy-enhanced.sh secrets

# Verify rotation
gcloud secrets versions list youtube-api-key
gcloud secrets versions list openai-api-key
```

#### Review and Clean Up
```bash
# List old container images
gcloud artifacts docker images list \
  us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api

# Delete old images (keep last 10)
gcloud artifacts docker images list \
  us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api \
  --format="get(version)" | tail -n +11 | \
  xargs -I {} gcloud artifacts docker images delete \
  us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api:{}
```

#### Security Audit
```bash
# Check IAM permissions
gcloud projects get-iam-policy PROJECT_ID

# Review service account permissions
gcloud iam service-accounts list

# Check for security vulnerabilities
gcloud scc findings list
```

## 🚨 Troubleshooting

### Service Not Responding

**Symptoms**: HTTP 502/503 errors, timeouts

**Diagnosis**:
```bash
# Check service status
gcloud run services describe youtube-summarizer-api \
  --region us-central1

# View error logs
gcloud run services logs read youtube-summarizer-api \
  --region us-central1 \
  --limit 100 | grep ERROR

# Check resource usage
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/container/memory/utilizations"'
```

**Solutions**:
1. **Increase Resources**:
   ```bash
   # Edit environments/ENV.tfvars
   cpu_limit    = "2000m"
   memory_limit = "2Gi"
   
   # Redeploy
   ./deploy-enhanced.sh deploy ENV
   ```

2. **Scale Up Instances**:
   ```bash
   # Edit environments/ENV.tfvars
   min_instances = 2
   max_instances = 20
   
   # Redeploy
   ./deploy-enhanced.sh deploy ENV
   ```

3. **Check Secrets**:
   ```bash
   # Verify secrets exist
   gcloud secrets versions access latest --secret=youtube-api-key
   gcloud secrets versions access latest --secret=openai-api-key
   ```

### High Latency

**Symptoms**: Slow response times, timeouts

**Diagnosis**:
```bash
# Check latency metrics
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_latencies"'

# View slow requests in logs
gcloud run services logs read youtube-summarizer-api \
  --region us-central1 \
  --limit 100 | grep "duration>"
```

**Solutions**:
1. **Enable CDN** (for frontend):
   ```bash
   # Edit environments/ENV.tfvars
   enable_cdn = true
   
   # Redeploy
   ./deploy-enhanced.sh deploy ENV
   ```

2. **Optimize API Calls**:
   - Add caching in application code
   - Reduce YouTube/OpenAI API timeouts
   - Implement request queuing

3. **Increase Instance Resources**:
   ```bash
   # More CPU/memory per instance
   cpu_limit    = "2000m"
   memory_limit = "2Gi"
   ```

### Cost Spike

**Symptoms**: Unexpected high bills

**Diagnosis**:
```bash
# Check resource usage
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/container/billable_instance_time"'

# Review Cloud Build jobs
gcloud builds list --limit=20

# Check egress traffic
gcloud monitoring time-series list \
  --filter='metric.type="compute.googleapis.com/network/sent_bytes_count"'
```

**Solutions**:
1. **Review Instance Configuration**:
   ```bash
   # Check if production scaled up unexpectedly
   gcloud run services describe youtube-summarizer-api \
     --region us-central1 \
     --format="value(spec.template.spec.containers.resources)"
   ```

2. **Implement Rate Limiting**:
   - Add rate limits to API endpoints
   - Use Cloud Armor for DDoS protection

3. **Scale Down Non-Prod**:
   ```bash
   # Dev/staging scale to zero
   # Edit environments/dev.tfvars
   min_instances = 0
   max_instances = 3
   ```

### Build Failures

**Symptoms**: Cloud Build fails, deployment doesn't update

**Diagnosis**:
```bash
# View recent builds
gcloud builds list --limit=5

# Check specific build logs
gcloud builds log BUILD_ID
```

**Solutions**:
1. **Fix Code Issues**:
   - Check build logs for errors
   - Test build locally:
   ```bash
   cd ../../server
   docker build -t test:latest .
   ```

2. **Update Build Config**:
   ```bash
   # Edit cloudbuild.yaml
   # Increase timeout if needed
   timeout: '3600s'
   ```

3. **Manual Deployment**:
   ```bash
   # Build and push manually
   ./deploy-enhanced.sh build
   ```

### Monitoring Alerts Not Working

**Diagnosis**:
```bash
# Check notification channels
gcloud alpha monitoring channels list

# Check alert policies
gcloud alpha monitoring policies list
```

**Solutions**:
1. **Verify Email**:
   ```bash
   # Test notification channel
   gcloud alpha monitoring channels describe CHANNEL_ID
   ```

2. **Update Alert Email**:
   ```bash
   # Edit environments/ENV.tfvars
   alert_email = "your-verified-email@example.com"
   
   # Redeploy
   ./deploy-enhanced.sh deploy ENV
   ```

## 📊 Performance Tuning

### Cloud Run Optimization

#### Cold Start Reduction
```bash
# Keep minimum instances warm
min_instances = 1  # Production
min_instances = 0  # Dev (cost savings)
```

#### Concurrency Tuning
```bash
# Adjust max concurrent requests per instance
gcloud run services update youtube-summarizer-api \
  --region us-central1 \
  --concurrency 80  # Default: 80, Max: 1000
```

#### CPU Always Allocated
```bash
# Reduce latency (increases cost)
gcloud run services update youtube-summarizer-api \
  --region us-central1 \
  --cpu-throttling \
  --no-cpu-throttling  # Always allocate CPU
```

### CDN Optimization

#### Increase Cache TTL
```terraform
# Edit main.tf
cdn_policy {
  cache_mode        = "CACHE_ALL_STATIC"
  default_ttl       = 7200   # 2 hours
  max_ttl           = 86400  # 24 hours
}
```

#### Cache Invalidation
```bash
# Invalidate CDN cache after deployment
gcloud compute url-maps invalidate-cdn-cache \
  youtube-summarizer-frontend-lb \
  --path "/*"
```

## 🔄 Backup & Recovery

### Manual Backup

#### Export Terraform State
```bash
# Download current state
gsutil cp gs://PROJECT_ID-terraform-state/terraform/state/default.tfstate \
  backups/terraform-state-$(date +%Y%m%d).tfstate
```

#### Backup Secrets
```bash
# Export secrets (store securely!)
gcloud secrets versions access latest \
  --secret=youtube-api-key > backups/youtube-api-key.txt
  
gcloud secrets versions access latest \
  --secret=openai-api-key > backups/openai-api-key.txt

# Encrypt backups
gpg -c backups/*.txt
rm backups/*.txt
```

#### Export Configuration
```bash
# Export Cloud Run configuration
gcloud run services describe youtube-summarizer-api \
  --region us-central1 \
  --format=yaml > backups/cloud-run-config.yaml
```

### Disaster Recovery

#### Rollback Deployment
```bash
# List previous revisions
gcloud run revisions list \
  --service youtube-summarizer-api \
  --region us-central1

# Route traffic to previous revision
gcloud run services update-traffic youtube-summarizer-api \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

#### Restore from Backup
```bash
# Restore Terraform state
gsutil cp backups/terraform-state-YYYYMMDD.tfstate \
  gs://PROJECT_ID-terraform-state/terraform/state/default.tfstate

# Reimport infrastructure
terraform init
terraform plan  # Verify no changes needed
```

#### Complete Rebuild
```bash
# If infrastructure is corrupted
cd infrastructure/gcp

# Destroy everything
./deploy-enhanced.sh destroy ENV

# Recreate from scratch
./deploy-enhanced.sh setup
./deploy-enhanced.sh secrets
./deploy-enhanced.sh deploy ENV
```

## 📈 Scaling Strategies

### Vertical Scaling (More Resources)
```hcl
# environments/production.tfvars
cpu_limit    = "4000m"  # 4 CPUs
memory_limit = "4Gi"    # 4 GB RAM
```

### Horizontal Scaling (More Instances)
```hcl
# environments/production.tfvars
min_instances = 5
max_instances = 100
```

### Geographic Distribution
```bash
# Deploy to multiple regions
# 1. Duplicate main.tf for each region
# 2. Use Cloud Load Balancer for routing
# 3. Consider Cloud CDN for static assets
```

## 🔒 Security Hardening

### Enable VPC Connector
```terraform
# Add to main.tf
resource "google_vpc_access_connector" "connector" {
  name          = "youtube-summarizer-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
}

# Update Cloud Run to use VPC
resource "google_cloud_run_v2_service" "api_service" {
  # ... existing config ...
  
  template {
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }
}
```

### Enable Cloud Armor
```bash
# Create security policy
gcloud compute security-policies create youtube-summarizer-policy \
  --description "DDoS and bot protection"

# Add rate limiting rule
gcloud compute security-policies rules create 1000 \
  --security-policy youtube-summarizer-policy \
  --expression "true" \
  --action "rate-based-ban" \
  --rate-limit-threshold-count 100 \
  --rate-limit-threshold-interval-sec 60
```

### Regular Security Scans
```bash
# Enable Security Command Center
gcloud services enable securitycenter.googleapis.com

# Run vulnerability scan
gcloud alpha container images scan \
  us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api:latest
```

## 📞 Support Contacts

- **GCP Support**: https://cloud.google.com/support
- **Terraform Issues**: https://github.com/hashicorp/terraform/issues
- **Project Repository**: https://github.com/AI-Empower-HQ-360/youtube-video-summar

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)
- [GCP Cost Optimization](https://cloud.google.com/cost-management/docs/best-practices)
- [Security Best Practices](https://cloud.google.com/security/best-practices)

---

**Last Updated**: January 2026
**Maintained By**: DevOps Team

# YouTube Video Summarizer - GCP Infrastructure Quick Start

## 🚀 Quick Deployment Guide

This guide walks you through deploying the YouTube Video Summarizer to Google Cloud Platform in **under 10 minutes**.

## Prerequisites

- Google Cloud Platform account
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed
- [Terraform](https://www.terraform.io/downloads) v1.0+
- [Docker](https://docs.docker.com/get-docker/) v20.0+
- YouTube API key ([Get one here](https://console.cloud.google.com/apis/credentials))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Step-by-Step Deployment

### 1️⃣ Initial Setup

```bash
# Navigate to infrastructure directory
cd infrastructure/gcp

# Make deployment script executable
chmod +x deploy-enhanced.sh

# Authenticate with GCP
gcloud auth login
gcloud auth application-default login

# Run initial setup
./deploy-enhanced.sh setup
```

This will:
- Prompt for your GCP Project ID
- Create a GCS bucket for Terraform state
- Initialize Terraform backend
- Enable required GCP APIs

### 2️⃣ Configure Environment

Choose your environment and edit the configuration:

```bash
# For development
nano environments/dev.tfvars

# For staging
nano environments/staging.tfvars

# For production
nano environments/production.tfvars
```

**Update these values:**
- `project_id`: Your actual GCP project ID
- `alert_email`: Your email for monitoring alerts
- `region`: GCP region (default: us-central1)

### 3️⃣ Set Up API Secrets

```bash
./deploy-enhanced.sh secrets
```

Enter your API keys when prompted:
- YouTube API Key
- OpenAI API Key

### 4️⃣ Deploy Infrastructure

```bash
# Deploy to development
./deploy-enhanced.sh deploy dev

# Or deploy to production
./deploy-enhanced.sh deploy production
```

Review the Terraform plan and type `yes` to confirm.

### 5️⃣ Build and Deploy Application

```bash
# Build Docker image and push to Artifact Registry
./deploy-enhanced.sh build

# The Cloud Run service will automatically use the new image
```

### 6️⃣ Verify Deployment

```bash
# Get deployment outputs
terraform output

# Test API endpoint
curl $(terraform output -raw api_url)/health
```

## 🎯 What Gets Deployed?

### Core Services
- ✅ **Cloud Run**: Backend API service (auto-scaling)
- ✅ **Artifact Registry**: Docker container storage
- ✅ **Cloud Storage**: Static frontend assets
- ✅ **Secret Manager**: Secure API key storage

### Optional Services (configurable)
- 🔍 **Cloud Monitoring**: Error rate & latency alerts
- 🌐 **CDN & Load Balancer**: Global content delivery
- 🔄 **Cloud Build**: Automated CI/CD pipeline

## 📊 Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │ (on push to main)
       ↓
┌─────────────┐
│ Cloud Build │ ← Automated CI/CD
└──────┬──────┘
       ↓
┌─────────────────────────────────┐
│    Artifact Registry            │
│  (Docker Images)                │
└──────┬──────────────────────────┘
       ↓
┌─────────────────────────────────┐
│    Cloud Run (API Backend)      │
│  • Auto-scaling                 │
│  • HTTPS endpoints              │
│  • Secret Manager integration   │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Cloud Storage (Frontend)       │
│  • Static assets                │
│  • CDN-enabled (optional)       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Cloud Monitoring & Alerting    │
│  • Error tracking               │
│  • Latency monitoring           │
│  • Email notifications          │
└─────────────────────────────────┘
```

## 💰 Cost Estimate

**Development Environment** (with scale-to-zero):
- ~$0-5/month (mostly API costs)

**Production Environment** (2 min instances):
- Cloud Run: ~$20-40/month
- Cloud Storage: ~$1-5/month
- Artifact Registry: ~$0.10/GB/month
- **Total: ~$25-50/month** (varies with traffic)

> 💡 **Tip**: Use the dev environment for testing to minimize costs.

## 🔧 Common Operations

### Update Application Code

```bash
# 1. Build new image
./deploy-enhanced.sh build

# 2. Cloud Run automatically deploys the new image
# Or manually trigger with:
gcloud run services update youtube-summarizer-api \
  --region us-central1 \
  --image us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api:latest
```

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read youtube-summarizer-api \
  --region us-central1 \
  --limit 50

# Or view in console:
# https://console.cloud.google.com/run
```

### Scale Configuration

Edit `environments/ENV.tfvars`:

```hcl
min_instances = 2   # Minimum instances (0 = scale to zero)
max_instances = 50  # Maximum instances
cpu_limit    = "2000m"
memory_limit = "2Gi"
```

Then redeploy:
```bash
./deploy-enhanced.sh deploy ENV
```

### Enable CDN

Edit your environment file:
```hcl
enable_cdn = true
```

Then redeploy:
```bash
./deploy-enhanced.sh deploy ENV
```

### Update API Secrets

```bash
./deploy-enhanced.sh secrets
```

### Monitor Application

```bash
# Open Cloud Monitoring
./deploy-enhanced.sh monitor

# Or visit directly:
# https://console.cloud.google.com/monitoring
```

## 🔄 CI/CD Pipeline

The Cloud Build trigger automatically:
1. Builds Docker images on push to `main` branch
2. Pushes images to Artifact Registry
3. Deploys to Cloud Run
4. Updates frontend in Cloud Storage

**View builds:**
```bash
gcloud builds list --limit=5
```

## 🚨 Monitoring & Alerts

Alerts are configured for:
- **Error Rate**: Triggers if >5% requests fail
- **High Latency**: Triggers if response time >5 seconds

Notifications go to the email specified in `alert_email`.

**View alerts:**
- Console: https://console.cloud.google.com/monitoring/alerting

## 🧹 Cleanup

### Destroy Specific Environment

```bash
./deploy-enhanced.sh destroy dev
```

### Complete Cleanup

```bash
# Destroy all resources
./deploy-enhanced.sh destroy dev
./deploy-enhanced.sh destroy staging
./deploy-enhanced.sh destroy production

# Delete state bucket (optional)
gsutil rm -r gs://PROJECT_ID-terraform-state

# Delete secrets
gcloud secrets delete youtube-api-key
gcloud secrets delete openai-api-key
```

## 🐛 Troubleshooting

### Terraform Init Fails

```bash
# Reset Terraform state
rm -rf .terraform .terraform.lock.hcl
./deploy-enhanced.sh init
```

### Permission Errors

```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login

# Ensure you have the required roles:
# - Cloud Run Admin
# - Artifact Registry Admin
# - Storage Admin
# - Secret Manager Admin
```

### Cloud Run Service Won't Start

```bash
# Check logs
gcloud run services logs read youtube-summarizer-api \
  --region us-central1 \
  --limit 100

# Verify secrets are set
gcloud secrets list
```

### Docker Build Fails

```bash
# Check Docker is running
docker ps

# Re-authenticate
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## 📚 Additional Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Project README](../../README.md)

## 🆘 Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting) above
2. Review [Cloud Run logs](#view-logs)
3. Open an issue on [GitHub](https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues)

---

**Need help?** Contact the team or open an issue on GitHub.

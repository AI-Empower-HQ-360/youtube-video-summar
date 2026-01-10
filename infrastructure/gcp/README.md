# YouTube Video Summarizer - GCP Infrastructure

This directory contains the complete Google Cloud Platform (GCP) infrastructure configuration for the YouTube Video Summarizer application, managed with Terraform.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 10-minute deployment guide (START HERE!)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture and components
- **[MAINTENANCE.md](MAINTENANCE.md)** - Operations, troubleshooting, and maintenance
- **This README** - Overview and reference

## 🏗️ Infrastructure Overview

The application is deployed using the following GCP services:

- **Cloud Run**: Hosts the backend API service
- **Artifact Registry**: Stores Docker container images
- **Cloud Storage**: Serves static frontend assets
- **Secret Manager**: Securely stores API keys
- **Cloud Build**: Automates CI/CD pipeline

## Labels and Resource Tagging

All GCP resources are tagged with the following labels for organization and cost tracking:

### Standard Labels

| Label | Description | Example Values |
|-------|-------------|----------------|
| `app` | Application name | `youtube-video-summarizer` |
| `environment` | Deployment environment | `dev`, `staging`, `production` |
| `managed-by` | Infrastructure management tool | `terraform` |
| `component` | Service component type | `api-backend`, `storage`, `container-registry`, `secrets` |

### Additional Labels

- `deployed-by`: Set by Cloud Build to track deployment source
- `commit-sha`: Git commit SHA for version tracking

## 🚀 Quick Start

### Prerequisites

1. **GCP Account**: Active Google Cloud Platform account
2. **GCP Project**: Create a new project or use existing one
3. **Tools**:
   - [gcloud CLI](https://cloud.google.com/sdk/docs/install) - v400.0.0+
   - [Terraform](https://www.terraform.io/downloads) - v1.0.0+
   - [Docker](https://docs.docker.com/get-docker/) - v20.0.0+

4. **API Keys**:
   - YouTube API key ([Get one here](https://console.cloud.google.com/apis/credentials))
   - OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

5. **Permissions**: Your GCP user/service account needs:
   - Cloud Run Admin
   - Artifact Registry Admin
   - Storage Admin
   - Secret Manager Admin
   - Cloud Build Editor
   - Service Usage Admin

### Deployment (3 Commands)

```bash
# 1. Initial setup
./deploy-enhanced.sh setup

# 2. Configure secrets
./deploy-enhanced.sh secrets

# 3. Deploy to dev
./deploy-enhanced.sh deploy dev
```

For detailed step-by-step instructions, see **[QUICKSTART.md](QUICKSTART.md)**.

## 📁 File Structure

```
infrastructure/gcp/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── backend.tf                 # Terraform backend config (GCS)
├── cloudbuild.yaml            # CI/CD pipeline config
├── deploy.sh                  # Original deployment script
├── deploy-enhanced.sh         # Enhanced deployment script (recommended)
├── lifecycle.json             # GCS bucket lifecycle policy
├── terraform.tfvars.example   # Example variables file
├── environments/              # Environment-specific configs
│   ├── dev.tfvars            # Development environment
│   ├── staging.tfvars        # Staging environment
│   └── production.tfvars     # Production environment
├── README.md                  # This file
├── QUICKSTART.md             # Quick deployment guide
├── ARCHITECTURE.md           # System architecture docs
└── MAINTENANCE.md            # Operations guide
```

## 🎯 What Gets Deployed

### Core Services (Always)
./deploy.sh build

# Destroy infrastructure
./deploy.sh destroy
```

## Manual Deployment Steps

### 1. Initialize Terraform

```bash
terraform init
```

### 2. Plan Deployment

```bash
terraform plan -var="environment=dev" -out=tfplan
```

### 3. Apply Changes

```bash
terraform apply tfplan
```

### 4. Build and Push Docker Image

```bash
# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build image
cd ../../server
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/youtube-summarizer/api:latest .

# Push image
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/youtube-summarizer/api:latest
```

## Configuration Files

### terraform.tfvars

Create this file with your environment-specific values:

```hcl
project_id    = "your-gcp-project-id"
region        = "us-central1"
environment   = "dev"
max_instances = 10
```

## CI/CD with Cloud Build

The infrastructure includes a Cloud Build trigger that automatically deploys on push to the main branch.

### Manual Trigger

```bash
gcloud builds submit \
  --config=infrastructure/gcp/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=dev,_REGION=us-central1
```

## Outputs

After deployment, Terraform provides these outputs:

- `api_url`: URL of the deployed Cloud Run service
- `static_bucket_url`: URL for static assets
- `artifact_registry_url`: Docker registry URL
- `youtube_secret_name`: Secret Manager secret name for YouTube API
- `openai_secret_name`: Secret Manager secret name for OpenAI API

View outputs:

```bash
terraform output
```

## Resource Naming Convention

Resources follow this naming pattern:

- Cloud Run Service: `youtube-summarizer-api`
- Artifact Registry: `youtube-summarizer`
- Storage Bucket: `{project-id}-youtube-summarizer-assets`
- Secrets: `youtube-api-key`, `openai-api-key`

## Cost Management

### Development Environment

- Cloud Run: Minimal (pay-per-use, 0 min instances)
- Storage: ~$0.02/GB/month
- Artifact Registry: ~$0.10/GB/month
- Secret Manager: ~$0.06/secret/month

### Production Environment

- Cloud Run: Estimated $10-50/month (1 min instance)
- Storage: Based on usage
- Artifact Registry: Based on image size
- Secret Manager: Fixed cost per secret

### Cost Optimization

1. Use labels to track costs by environment and component
2. Set appropriate min_instances (0 for dev, 1+ for production)
3. Enable Cloud Storage lifecycle policies
4. Monitor with Cloud Billing budgets and alerts

## Monitoring and Logging

### View Logs

```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=youtube-summarizer-api" --limit 50

# Cloud Build logs
gcloud logging read "resource.type=build" --limit 50
```

### Metrics

Access metrics in Cloud Console:
- Cloud Run: CPU, Memory, Request count, Latency
- Cloud Storage: Request count, Bandwidth
- Cloud Build: Build duration, Success rate

## Security

### Best Practices

1. **API Keys**: Always stored in Secret Manager, never in code
2. **IAM**: Principle of least privilege
3. **Network**: Cloud Run with ingress controls
4. **Secrets**: Automatic rotation recommended
5. **Authentication**: Consider adding Cloud Armor for DDoS protection

### Update Secrets

```bash
# Update YouTube API key
echo -n "new-api-key" | gcloud secrets versions add youtube-api-key --data-file=-

# Update OpenAI API key
echo -n "new-api-key" | gcloud secrets versions add openai-api-key --data-file=-
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="user:YOUR_EMAIL" \
     --role="roles/editor"
   ```

2. **API Not Enabled**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

3. **Docker Push Fails**
   ```bash
   gcloud auth configure-docker us-central1-docker.pkg.dev
   gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
   ```

### Debug Cloud Run

```bash
# Get service details
gcloud run services describe youtube-summarizer-api --region=us-central1

# View recent revisions
gcloud run revisions list --service=youtube-summarizer-api --region=us-central1

# Stream logs
gcloud run services logs tail youtube-summarizer-api --region=us-central1
```

## Cleanup

To remove all infrastructure:

```bash
./deploy.sh destroy
```

Or manually:

```bash
terraform destroy
```

**Note**: This will delete all resources including stored data!

## Support

For issues and questions:
- GCP Documentation: https://cloud.google.com/docs
- Terraform GCP Provider: https://registry.terraform.io/providers/hashicorp/google/latest/docs
- Project Issues: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues

## License

See [LICENSE](../../LICENSE) file in the root directory.

# CI/CD Setup Guide

Complete guide to configure GitHub Actions for automated GCP deployments.

## Overview

This repository includes three GitHub Actions workflows:

1. **GCP Deploy** - Automated deployment to Cloud Run
2. **Terraform Validation** - Infrastructure validation on PRs
3. **Infrastructure Drift Detection** - Daily checks for configuration drift

## Prerequisites

- GCP Project with billing enabled
- GitHub repository with admin access
- Terraform state bucket created in GCP

## 🔐 Required Secrets

Configure these in GitHub Settings → Secrets and variables → Actions:

### GCP Authentication

```bash
# 1. Create a service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 2. Grant necessary permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.admin"

# 3. Set up Workload Identity Federation (Recommended)
gcloud iam workload-identity-pools create "github" \
  --location="global" \
  --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# 4. Get the Workload Identity Provider name
gcloud iam workload-identity-pools providers describe "github-provider" \
  --location="global" \
  --workload-identity-pool="github" \
  --format="value(name)"
```

### GitHub Secrets to Configure

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `my-project-12345` |
| `GCP_REGION` | Deployment region | `us-central1` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Provider | `projects/123/locations/global/...` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `github-actions@PROJECT.iam.gserviceaccount.com` |
| `GCP_TERRAFORM_STATE_BUCKET` | Terraform state bucket | `my-project-terraform-state` |
| `SLACK_WEBHOOK_URL` | (Optional) Slack notifications | `https://hooks.slack.com/...` |

### Quick Setup Script

```bash
#!/bin/bash
# setup-github-secrets.sh

PROJECT_ID="your-project-id"
REPO="AI-Empower-HQ-360/youtube-video-summar"

# Set secrets using GitHub CLI
gh secret set GCP_PROJECT_ID --body "$PROJECT_ID" --repo "$REPO"
gh secret set GCP_REGION --body "us-central1" --repo "$REPO"
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --body "$(gcloud iam workload-identity-pools providers describe github-provider --location=global --workload-identity-pool=github --format='value(name)')" --repo "$REPO"
gh secret set GCP_SERVICE_ACCOUNT --body "github-actions@$PROJECT_ID.iam.gserviceaccount.com" --repo "$REPO"
gh secret set GCP_TERRAFORM_STATE_BUCKET --body "$PROJECT_ID-terraform-state" --repo "$REPO"

echo "✅ Secrets configured!"
```

## 📋 Workflow Details

### 1. GCP Deploy Workflow

**File:** `.github/workflows/gcp-deploy.yml`

**Triggers:**
- Push to `main` branch (infrastructure or code changes)
- Manual dispatch with environment selection

**Steps:**
1. Authenticate to GCP via Workload Identity
2. Run Terraform plan and apply
3. Build and push Docker image to Artifact Registry
4. Deploy backend to Cloud Run
5. Build and deploy frontend to Cloud Storage
6. Run health checks

**Usage:**
```bash
# Automatic: Just push to main
git push origin main

# Manual: Via GitHub UI
Actions → Deploy to GCP → Run workflow → Select environment
```

### 2. Terraform Validation Workflow

**File:** `.github/workflows/terraform-validate.yml`

**Triggers:**
- Pull requests touching infrastructure files
- Push to `main` with infrastructure changes

**Steps:**
1. Format check (`terraform fmt`)
2. Validate Terraform syntax
3. Run tflint for best practices
4. Run Checkov for security scanning
5. Run Trivy for vulnerability detection
6. Post results as PR comment
7. Estimate monthly costs

**Example PR Comment:**
```
#### Terraform Format and Style 🖌 `success`
#### Terraform Validation 🤖 `success`
#### TFLint 🔍 `success`

💰 Estimated Monthly Costs: $5-20 for dev environment
```

### 3. Infrastructure Drift Detection

**File:** `.github/workflows/infrastructure-drift.yml`

**Triggers:**
- Daily at 9 AM UTC (scheduled)
- Manual dispatch

**Steps:**
1. Run `terraform plan` against live infrastructure
2. Detect differences between code and actual state
3. Create GitHub issue if drift detected
4. Send Slack notification (if configured)

**When Drift Detected:**
- GitHub issue created with label `drift-detection`
- Issue includes full Terraform plan output
- Slack notification sent to team

## 🎯 Environment Strategy

### Development
- Auto-deploy on merge to `main`
- Low resource limits
- Public access allowed

### Staging
- Manual deployment via workflow_dispatch
- Production-like configuration
- Used for pre-release testing

### Production
- Manual deployment only
- Requires approval
- High availability configuration

### Setting Up Environments

```bash
# In GitHub repository settings
Settings → Environments → New environment

# Configure for each: dev, staging, production
# Add protection rules for production:
✓ Required reviewers (2)
✓ Wait timer (5 minutes)
✓ Deployment branches: main only
```

## 🚀 Deployment Process

### Standard Deployment (Dev)

```bash
# 1. Create feature branch
git checkout -b feat/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: Add new feature"

# 3. Push and create PR
git push origin feat/my-feature
gh pr create --fill

# 4. Terraform validation runs automatically
# Wait for checks to pass

# 5. Merge PR (deploys to dev automatically)
gh pr merge --squash
```

### Production Deployment

```bash
# 1. Go to GitHub Actions
Actions → Deploy to GCP

# 2. Click "Run workflow"
- Select branch: main
- Select environment: production
- Click "Run workflow"

# 3. Approve deployment
- Review terraform plan in logs
- Approve in GitHub UI

# 4. Monitor deployment
- Watch action logs
- Check health endpoint
- Verify frontend loads
```

## 🔍 Monitoring Deployments

### View Deployment Status

```bash
# List recent deployments
gh api repos/AI-Empower-HQ-360/youtube-video-summar/deployments | jq '.[0:5]'

# Check workflow runs
gh run list --workflow=gcp-deploy.yml

# View specific run logs
gh run view 12345678 --log
```

### Health Checks

```bash
# Backend health
curl https://YOUR-CLOUD-RUN-URL/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-10T00:00:00.000Z",
  "version": "1.0.0"
}

# Frontend check
curl -I https://storage.googleapis.com/youtube-summar-frontend-dev/index.html
```

## 🛠 Troubleshooting

### Deployment Fails at Terraform Apply

**Issue:** Permission denied errors

**Solution:**
```bash
# Verify service account permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@*"

# Add missing permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/REQUIRED_ROLE"
```

### Docker Build Fails

**Issue:** Authentication error pushing to Artifact Registry

**Solution:**
```bash
# Verify Artifact Registry exists
gcloud artifacts repositories list --location=us-central1

# Create if missing
gcloud artifacts repositories create youtube-summar \
  --repository-format=docker \
  --location=us-central1

# Grant service account access
gcloud artifacts repositories add-iam-policy-binding youtube-summar \
  --location=us-central1 \
  --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### Health Check Fails

**Issue:** Service deployed but health check returns 404

**Solution:**
```bash
# Check Cloud Run logs
gcloud run services logs read youtube-summar-backend-dev \
  --region=us-central1 \
  --limit=50

# Verify secrets are set
gcloud secrets list

# Test locally
docker run -p 3001:3001 \
  -e OPENAI_API_KEY=sk-... \
  YOUR_IMAGE

curl http://localhost:3001/api/health
```

### Drift Detection False Positives

**Issue:** Drift detected but no actual changes

**Solution:**
```bash
# Refresh Terraform state
cd infrastructure/gcp
terraform init
terraform refresh -var-file=environments/dev.tfvars

# Commit state changes if needed
git add terraform.tfstate
git commit -m "chore: Update Terraform state"
```

## 🔒 Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets or GCP Secret Manager
2. **Use Workload Identity** - Avoid service account keys
3. **Limit permissions** - Grant only required IAM roles
4. **Enable branch protection** - Require PR reviews for main
5. **Scan for vulnerabilities** - Trivy and Checkov run automatically
6. **Rotate credentials** - Service account keys (if used) every 90 days
7. **Monitor access** - Review Cloud Audit Logs regularly

## 📊 Cost Management

### Workflow Costs

- **GitHub Actions:** 2,000 free minutes/month (Linux runners)
- **Estimated usage:** ~10 minutes per deployment = 200 deployments/month
- **Overage cost:** $0.008/minute

### GCP Costs

- **Cloud Build:** $0.003/build-minute (120 free minutes/day)
- **Artifact Registry:** $0.10/GB stored
- **Cloud Run:** Pay per request + CPU time
- **Cloud Storage:** $0.020/GB/month

### Cost Optimization Tips

```bash
# Clean up old images
gcloud artifacts docker images list us-central1-docker.pkg.dev/PROJECT/youtube-summar/backend \
  --filter="createTime<$(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%S'Z')" \
  --format="get(package)" | while read img; do
  gcloud artifacts docker images delete "$img" --quiet
done

# Set lifecycle policies on Cloud Storage
gsutil lifecycle set infrastructure/gcp/lifecycle.json gs://your-bucket

# Use committed use discounts for production
# Can save up to 57% on Cloud Run costs
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GCP Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Terraform CI/CD Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)
- [Cloud Run Deployment](https://cloud.google.com/run/docs/deploying)

## 🆘 Getting Help

If you encounter issues:

1. Check workflow logs in GitHub Actions tab
2. Review GCP Cloud Console logs
3. Run `./infrastructure/gcp/verify.sh` locally
4. Check [MAINTENANCE.md](../infrastructure/gcp/MAINTENANCE.md)
5. Create an issue with logs and error messages

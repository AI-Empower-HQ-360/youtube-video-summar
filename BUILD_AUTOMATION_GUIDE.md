# Build Automation & Deployment to GCP

## Overview

Your project now has **3 ways to build and deploy** to GCP:

1. **GitHub Actions** (Automatic) - Builds on every push
2. **Cloud Build** (Automatic) - Triggered via webhook
3. **Manual Scripts** (On-demand) - For local testing

---

## Option 1: GitHub Actions (Recommended)

### Setup (One-time)

1. **Enable Workload Identity Federation**:
   ```bash
   cd infrastructure/gcp
   bash setup-build-automation.sh
   ```

2. **Add GitHub Secrets**:
   - Go to: https://github.com/AI-Empower-HQ-360/youtube-video-summar/settings/secrets/actions
   - Add these secrets:
     ```
     GCP_PROJECT_ID = project-fc16459b-fb23-4965-874
     GAR_LOCATION = us-central1
     WIF_PROVIDER = [output from setup script]
     WIF_SERVICE_ACCOUNT = [output from setup script]
     ```

3. **Push code to trigger build**:
   ```bash
   git push origin main
   ```

### How It Works

- Every time you push to `main` or `develop`:
  1. ✅ Runs tests and linting
  2. ✅ Builds Docker image
  3. ✅ Pushes to Artifact Registry
  4. ✅ Deploys to Cloud Run (optional)

### Monitor Build:
- Go to: https://github.com/AI-Empower-HQ-360/youtube-video-summar/actions

---

## Option 2: Cloud Build

### Setup

1. **Link GitHub Repository** (if not already done):
   ```bash
   gcloud builds connect --region=us-central1
   ```

2. **Connect the repository** via the GCP Console

3. **Cloud Build will automatically**:
   - Watch your GitHub repo
   - Build on every commit
   - Push to Artifact Registry

### Monitor Builds:
```bash
gcloud builds log --stream=true
```

---

## Option 3: Manual Build & Deploy

### Build and Deploy to VM

```bash
# Make scripts executable
chmod +x infrastructure/gcp/build-and-deploy.sh
chmod +x infrastructure/gcp/deploy-to-vm.sh

# Build and deploy
cd infrastructure/gcp
bash build-and-deploy.sh
```

**What it does**:
1. Builds Docker image locally
2. Pushes to Artifact Registry
3. Deploys to your VM
4. Restarts the application

### Requirements:
- Docker installed locally
- gcloud CLI authenticated
- VM must be running

---

## Docker Build Process

### Multi-Stage Build (Optimized)

The `Dockerfile.prod` includes:
- **Stage 1**: Frontend build (Vite compilation)
- **Stage 2**: Backend dependencies (Node modules)
- **Stage 3**: Production image (minimal)

### Final Image Features:
- ✅ Non-root user for security
- ✅ Health checks enabled
- ✅ Proper signal handling with dumb-init
- ✅ ~150MB final size

---

## Deployment Architectures

### Architecture A: Cloud Run (Serverless)
```
GitHub Push → Cloud Build → Artifact Registry → Cloud Run Service
```
**Pros**: Auto-scaling, no VM management, pay-per-use
**Cons**: Cold starts, streaming limitations

### Architecture B: Compute Engine VM (Current)
```
GitHub Push → Cloud Build → Artifact Registry → SSH to VM → Docker pull & run
```
**Pros**: Full control, persistent, lower latency
**Cons**: Always-on costs, manual scaling

### Architecture C: Hybrid (Recommended)
```
GitHub Push → Cloud Build → Artifact Registry
  ├→ Cloud Run (production)
  └→ VM (dev/testing)
```

---

## Build Status & Monitoring

### GitHub Actions
```
https://github.com/AI-Empower-HQ-360/youtube-video-summar/actions
```

### Cloud Build
```bash
gcloud builds list
gcloud builds log BUILD_ID
```

### Artifact Registry
```bash
gcloud artifacts docker images list us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer
```

### Running Services
```bash
# Cloud Run services
gcloud run services list

# VMs
gcloud compute instances list

# Docker containers on VM
gcloud compute ssh youtube-summarizer-dev --command="docker ps"
```

---

## Environment Variables for Builds

### GitHub Actions
Add to `.github/workflows/build-deploy.yml`:
```yaml
env:
  NODE_ENV: production
  VITE_API_BASE_URL: https://your-api.example.com
```

### Cloud Build
Add to `infrastructure/gcp/cloudbuild.yaml`:
```yaml
substitutions:
  _NODE_ENV: 'production'
  _API_BASE_URL: 'https://api.example.com'
```

### Docker/VM
Set in `deploy-to-vm.sh`:
```bash
-e NODE_ENV=production \
-e VITE_API_BASE_URL=https://api.example.com \
```

---

## Cost Optimization

### GitHub Actions
- ✅ **Free** for public repos
- ✅ 2000 minutes/month for private repos

### Cloud Build
- ✅ **Free**: 120 build-minutes per day
- Overflow: $0.003 per build-minute

### Artifact Registry Storage
- ~$0.10 per GB/month
- Images deleted after 90 days

### VM Deployment
- **e2-micro**: $3-5/month (eligible for free tier)
- Network egress: Covered in free tier

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails on tests** | Run `npm run test` locally to debug |
| **Image push fails** | Check Artifact Registry exists: `gcloud artifacts repositories list` |
| **VM deployment hangs** | SSH into VM and check Docker: `docker logs youtube-summarizer-app` |
| **Authentication errors** | Run `gcloud auth configure-docker` |
| **Workload Identity fails** | Ensure secrets are set correctly in GitHub |

---

## Next Steps

1. **Choose deployment method** (GitHub Actions or Cloud Build)
2. **Run setup script** for your chosen method
3. **Make a test commit** to trigger the build
4. **Monitor the build** and verify deployment
5. **Access your app** at the VM's external IP

---

## Quick Commands

```bash
# Setup build automation
bash infrastructure/gcp/setup-build-automation.sh

# Manual build and deploy
bash infrastructure/gcp/build-and-deploy.sh

# View build logs
gcloud builds log --stream=true

# SSH into VM
gcloud compute ssh youtube-summarizer-dev --zone=us-central1-a

# View container logs on VM
docker logs -f youtube-summarizer-app

# Manually pull latest image
gcloud compute ssh youtube-summarizer-dev --command="docker pull us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/youtube-summarizer-app:latest"
```

---

## Security Best Practices

✅ Use Workload Identity (not service account keys)
✅ Run containers as non-root user
✅ Scan images for vulnerabilities: `gcloud container images scan IMAGE_URL`
✅ Use private Artifact Registry
✅ Enable VPC service controls
✅ Rotate credentials regularly
✅ Use IAM roles with least privilege

---

For detailed setup instructions, see:
- [GCP_SETUP_GUIDE.md](GCP_SETUP_GUIDE.md) - VM and billing setup
- [TERRAFORM_VM_GUIDE.md](TERRAFORM_VM_GUIDE.md) - Infrastructure as code

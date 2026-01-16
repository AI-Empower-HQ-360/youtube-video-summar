# Deploy to Google Cloud Run - Step by Step Guide

## Prerequisites

- ✅ Docker image built locally (`youtube-summarizer:latest`)
- ✅ gcloud CLI installed on your local machine
- ✅ Authenticated with: `gcloud auth login`
- ✅ Project ID: `project-fc16459b-fb23-4965-874`

---

## Step 1: Install gcloud CLI (if needed)

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

---

## Step 2: Authenticate with GCP

```bash
gcloud auth login
gcloud config set project project-fc16459b-fb23-4965-874
```

Verify:
```bash
gcloud config get-value project
```

---

## Step 3: Use the Deployment Script

Run the automated deployment script from your local machine:

```bash
cd youtube-video-summar
chmod +x infrastructure/gcp/deploy-to-cloud-run.sh
bash infrastructure/gcp/deploy-to-cloud-run.sh
```

This script will:
1. ✅ Create Artifact Registry (if needed)
2. ✅ Authenticate Docker
3. ✅ Tag your image
4. ✅ Push to Artifact Registry
5. ✅ Deploy to Cloud Run
6. ✅ Test the service
7. ✅ Output the service URL

---

## Step 4: Manual Deployment (Alternative)

If you prefer to do it step-by-step:

### 4.1 Authenticate Docker
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 4.2 Create Artifact Registry (one-time)
```bash
gcloud artifacts repositories create youtube-summarizer \
  --repository-format=docker \
  --location=us-central1 \
  --project=project-fc16459b-fb23-4965-874
```

### 4.3 Tag Image
```bash
docker tag youtube-summarizer:latest \
  us-central1-docker.pkg.dev/project-fc16459b-fb23-4965-874/youtube-summarizer/youtube-summarizer:latest
```

### 4.4 Push to Artifact Registry
```bash
docker push \
  us-central1-docker.pkg.dev/project-fc16459b-fb23-4965-874/youtube-summarizer/youtube-summarizer:latest
```

### 4.5 Deploy to Cloud Run
```bash
gcloud run deploy youtube-summarizer-api \
  --image=us-central1-docker.pkg.dev/project-fc16459b-fb23-4965-874/youtube-summarizer/youtube-summarizer:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=3001 \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=10 \
  --set-env-vars="NODE_ENV=production"
```

### 4.6 Get Service URL
```bash
gcloud run services describe youtube-summarizer-api \
  --region=us-central1 \
  --format='value(status.url)'
```

---

## Step 5: Test the Deployment

Once deployed, you'll get a URL like:
```
https://youtube-summarizer-api-xxxxx-uc.a.run.app
```

### Test Health Endpoint
```bash
curl https://youtube-summarizer-api-xxxxx-uc.a.run.app/health
```

Expected response:
```json
{"status": "ok"}
```

### Test API Documentation
```
https://youtube-summarizer-api-xxxxx-uc.a.run.app/api/docs
```

---

## Step 6: Monitor Logs

### View recent logs
```bash
gcloud run logs read youtube-summarizer-api --limit=50
```

### Stream logs in real-time
```bash
gcloud run logs read youtube-summarizer-api --follow
```

### View service details
```bash
gcloud run services describe youtube-summarizer-api --region=us-central1
```

---

## Testing the Endpoints

### Health Check
```bash
curl https://SERVICE_URL/health
```

### Get API Docs
```bash
curl https://SERVICE_URL/api/docs
```

### Summarize Video (example)
```bash
curl -X POST https://SERVICE_URL/api/videos/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "targetLanguage": "en"
  }'
```

---

## Cost Estimates

| Component | Cost | Notes |
|-----------|------|-------|
| Cloud Run | Free for first 2M requests/month | $0.40/1M after |
| Artifact Registry | ~$0.10/GB/month | Image storage |
| Network egress | **Free** for free tier | First 1GB/month |
| **Total** | **$0.10/month** | Minimal usage |

---

## Troubleshooting

### Issue: "Image not found"
```bash
# Check if image was pushed
gcloud artifacts docker images list us-central1-docker.pkg.dev/project-fc16459b-fb23-4965-874/youtube-summarizer
```

### Issue: "Service deployed but returns 500"
```bash
# Check logs
gcloud run logs read youtube-summarizer-api --follow
```

### Issue: "Authentication failed"
```bash
# Re-authenticate
gcloud auth application-default login
```

### Issue: "Port not exposed"
Make sure your Node.js server listens on port 3001 (configured in server/src/index.js)

---

## Next Steps

1. ✅ Run deployment script on local machine
2. ✅ Get the Cloud Run service URL
3. ✅ Test endpoints
4. ✅ Monitor logs
5. ✅ Scale as needed

---

## Useful Commands

```bash
# List all services
gcloud run services list

# Update service (re-deploy)
gcloud run deploy youtube-summarizer-api \
  --image=us-central1-docker.pkg.dev/project-fc16459b-fb23-4965-874/youtube-summarizer/youtube-summarizer:latest

# Delete service
gcloud run services delete youtube-summarizer-api --region=us-central1

# View service URL
gcloud run services describe youtube-summarizer-api --format='value(status.url)'

# Set traffic to specific revision
gcloud run services update-traffic youtube-summarizer-api --to-revisions LATEST=100

# View all revisions
gcloud run revisions list --service=youtube-summarizer-api
```

---

**Need help?** Run the script with your local gcloud CLI and it will handle everything! 🚀

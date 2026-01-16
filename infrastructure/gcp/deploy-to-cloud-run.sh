#!/bin/bash

# ==============================================
# Deploy to Google Cloud Run
# ==============================================

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-project-fc16459b-fb23-4965-874}"
REGION="us-central1"
SERVICE_NAME="youtube-summarizer-api"
IMAGE_NAME="youtube-summarizer"
REGISTRY="${REGION}-docker.pkg.dev"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Deploy to Google Cloud Run${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Step 1: Check if artifact registry exists
echo -e "${BLUE}Step 1: Checking Artifact Registry...${NC}"
REPO_EXISTS=$(gcloud artifacts repositories list \
  --project=$PROJECT_ID \
  --filter="name:youtube-summarizer" \
  --format="value(name)" 2>/dev/null || true)

if [ -z "$REPO_EXISTS" ]; then
  echo -e "${YELLOW}Creating Artifact Registry repository...${NC}"
  gcloud artifacts repositories create youtube-summarizer \
    --repository-format=docker \
    --location=$REGION \
    --project=$PROJECT_ID
  echo -e "${GREEN}✓ Repository created${NC}"
else
  echo -e "${GREEN}✓ Repository exists${NC}"
fi
echo ""

# Step 2: Authenticate Docker
echo -e "${BLUE}Step 2: Authenticating Docker with GCP...${NC}"
gcloud auth configure-docker ${REGISTRY} --quiet --project=$PROJECT_ID
echo -e "${GREEN}✓ Docker authenticated${NC}"
echo ""

# Step 3: Tag and push image
echo -e "${BLUE}Step 3: Tagging Docker image...${NC}"
docker tag youtube-summarizer:latest ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest
docker tag youtube-summarizer:latest ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)
echo -e "${GREEN}✓ Image tagged${NC}"
echo ""

echo -e "${BLUE}Step 4: Pushing to Artifact Registry...${NC}"
docker push ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest
echo -e "${GREEN}✓ Image pushed${NC}"
echo ""

# Step 5: Deploy to Cloud Run
echo -e "${BLUE}Step 5: Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image=${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --port=3001 \
  --memory=1Gi \
  --cpu=1 \
  --timeout=3600 \
  --max-instances=10 \
  --min-instances=0 \
  --set-env-vars="NODE_ENV=production" \
  --project=$PROJECT_ID \
  --quiet

echo -e "${GREEN}✓ Deployed to Cloud Run${NC}"
echo ""

# Step 6: Get service URL
echo -e "${BLUE}Step 6: Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format='value(status.url)' \
  --project=$PROJECT_ID)

echo -e "${GREEN}✓ Service deployed!${NC}"
echo ""
echo -e "${YELLOW}Service URL: ${SERVICE_URL}${NC}"
echo ""

# Step 7: Test the service
echo -e "${BLUE}Step 7: Testing service health...${NC}"
sleep 3
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health" 2>/dev/null || echo "000")

if [ "$HEALTH_RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${YELLOW}⚠ Health check returned: ${HEALTH_RESPONSE}${NC}"
fi
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Deployment Summary${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "Service Name: ${SERVICE_NAME}"
echo "Region: ${REGION}"
echo "URL: ${SERVICE_URL}"
echo "Image: ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest"
echo ""
echo "Useful Commands:"
echo "  - View logs: gcloud run logs read ${SERVICE_NAME} --region=${REGION} --limit=50"
echo "  - View service: gcloud run services describe ${SERVICE_NAME} --region=${REGION}"
echo "  - Stream logs: gcloud run logs read ${SERVICE_NAME} --region=${REGION} --follow"
echo ""

# Save URL to file for reference
echo "${SERVICE_URL}" > /tmp/cloud-run-url.txt
echo -e "${YELLOW}Service URL saved to /tmp/cloud-run-url.txt${NC}"

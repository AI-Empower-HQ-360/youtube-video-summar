#!/bin/bash

# ==============================================
# Manual Build and Deploy Script
# ==============================================
# Builds Docker image and deploys to GCP VM

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Build and Deploy to GCP VM${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="us-central1"
ZONE="us-central1-a"
VM_NAME="${VM_NAME:-youtube-summarizer-dev}"
IMAGE_NAME="youtube-summarizer-app"
REGISTRY="${REGION}-docker.pkg.dev"

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}Error: No GCP project set${NC}"
  exit 1
fi

echo -e "${GREEN}Project: ${PROJECT_ID}${NC}"
echo -e "${GREEN}VM Name: ${VM_NAME}${NC}"
echo ""

# Step 1: Build Docker image
echo -e "${BLUE}Step 1: Building Docker image...${NC}"
docker build \
  -t ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest \
  -t ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S) \
  -f Dockerfile .

echo -e "${GREEN}✓ Docker image built${NC}"
echo ""

# Step 2: Authenticate Docker for GCP
echo -e "${BLUE}Step 2: Authenticating with GCP...${NC}"
gcloud auth configure-docker ${REGISTRY} --project=${PROJECT_ID}
echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Step 3: Push image to Artifact Registry
echo -e "${BLUE}Step 3: Pushing image to Artifact Registry...${NC}"
docker push ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest
echo -e "${GREEN}✓ Image pushed${NC}"
echo ""

# Step 4: Deploy to VM
echo -e "${BLUE}Step 4: Deploying to VM...${NC}"
echo "Connecting to ${VM_NAME} in ${ZONE}..."

# Copy deployment script to VM
gcloud compute scp infrastructure/gcp/deploy-to-vm.sh \
  ${VM_NAME}:~/deploy.sh \
  --zone=${ZONE} \
  --project=${PROJECT_ID}

# Execute deployment on VM
gcloud compute ssh ${VM_NAME} \
  --zone=${ZONE} \
  --project=${PROJECT_ID} \
  --command="bash ~/deploy.sh ${REGISTRY} ${PROJECT_ID} ${IMAGE_NAME}"

echo -e "${GREEN}✓ Deployed to VM${NC}"
echo ""

# Get VM info
echo -e "${BLUE}VM Information:${NC}"
EXTERNAL_IP=$(gcloud compute instances describe ${VM_NAME} \
  --zone=${ZONE} \
  --project=${PROJECT_ID} \
  --format='value(networkInterfaces[0].accessConfigs[0].natIp)')

echo "External IP: ${EXTERNAL_IP}"
echo "Access at: http://${EXTERNAL_IP}:5173"
echo ""

echo -e "${GREEN}Deployment Complete!${NC}"

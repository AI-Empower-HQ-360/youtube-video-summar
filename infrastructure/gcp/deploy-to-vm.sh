#!/bin/bash

# ==============================================
# Deploy Script for VM
# ==============================================
# This script runs on the VM to deploy the application

REGISTRY=$1
PROJECT_ID=$2
IMAGE_NAME=$3

if [ -z "$REGISTRY" ] || [ -z "$PROJECT_ID" ] || [ -z "$IMAGE_NAME" ]; then
  echo "Usage: ./deploy-to-vm.sh <registry> <project-id> <image-name>"
  exit 1
fi

echo "Deploying ${IMAGE_NAME}..."

# Configure Docker authentication
gcloud auth configure-docker ${REGISTRY} --quiet

# Pull the latest image
docker pull ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest

# Stop existing container
docker stop youtube-summarizer-app 2>/dev/null || true
docker rm youtube-summarizer-app 2>/dev/null || true

# Run new container
docker run -d \
  --name youtube-summarizer-app \
  --restart always \
  -p 5173:5173 \
  -p 3001:3001 \
  -e NODE_ENV=production \
  ${REGISTRY}/${PROJECT_ID}/youtube-summarizer/${IMAGE_NAME}:latest

echo "✓ Container deployed and running"
docker ps | grep youtube-summarizer-app

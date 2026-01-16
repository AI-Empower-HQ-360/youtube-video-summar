#!/bin/bash

# ==============================================
# Build Automation Setup Script
# ==============================================
# Sets up automated building and deployment to GCP

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Build Automation Setup for GCP${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Get project ID
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"

if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}Enter your GCP Project ID:${NC}"
  read -r PROJECT_ID
fi

echo -e "${GREEN}Project ID: ${PROJECT_ID}${NC}"
echo ""

# Create Artifact Registry repository
echo -e "${BLUE}Creating Artifact Registry Repository...${NC}"
gcloud artifacts repositories create youtube-summarizer \
  --repository-format=docker \
  --location=us-central1 \
  --project=$PROJECT_ID \
  --quiet 2>/dev/null || echo -e "${YELLOW}Repository may already exist${NC}"

echo -e "${GREEN}✓ Artifact Registry repository ready${NC}"
echo ""

# Enable Cloud Build API
echo -e "${BLUE}Enabling Cloud Build API...${NC}"
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
echo -e "${GREEN}✓ Cloud Build API enabled${NC}"
echo ""

# Create Cloud Build service account
echo -e "${BLUE}Setting up Cloud Build permissions...${NC}"

# Get the Cloud Build service account
BUILD_SA="$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${BUILD_SA}" \
  --role="roles/artifactregistry.writer" \
  --quiet 2>/dev/null || true

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${BUILD_SA}" \
  --role="roles/run.developer" \
  --quiet 2>/dev/null || true

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${BUILD_SA}" \
  --role="roles/compute.instanceAdmin.v1" \
  --quiet 2>/dev/null || true

echo -e "${GREEN}✓ Cloud Build permissions configured${NC}"
echo ""

# Create GitHub Actions secrets file template
echo -e "${BLUE}Generating GitHub Actions Secrets...${NC}"

cat > /tmp/github-secrets-setup.sh <<EOF
#!/bin/bash
# GitHub Actions Secrets Setup

# Add these secrets to your GitHub repository:
# 1. Go to: https://github.com/AI-Empower-HQ-360/youtube-video-summar/settings/secrets/actions

# Required Secrets:
echo "Secret: GCP_PROJECT_ID = ${PROJECT_ID}"
echo "Secret: GAR_LOCATION = us-central1"
echo "Secret: WIF_PROVIDER = projects/${PROJECT_ID}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
echo "Secret: WIF_SERVICE_ACCOUNT = github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

EOF

chmod +x /tmp/github-secrets-setup.sh

echo -e "${YELLOW}GitHub Actions Secrets needed:${NC}"
echo "  1. GCP_PROJECT_ID = ${PROJECT_ID}"
echo "  2. GAR_LOCATION = us-central1"
echo ""

# Trigger first build
echo -e "${BLUE}Ready to trigger builds!${NC}"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Add GitHub Actions Secrets:"
echo "   - Go to: https://github.com/AI-Empower-HQ-360/youtube-video-summar/settings/secrets/actions"
echo "   - Add GCP_PROJECT_ID = ${PROJECT_ID}"
echo ""
echo "2. Push code to trigger automatic build:"
echo "   git push origin main"
echo ""
echo "3. Monitor build progress:"
echo "   gcloud builds log --stream=true --project=${PROJECT_ID}"
echo ""
echo "4. View deployed services:"
echo "   gcloud run services list --project=${PROJECT_ID}"
echo ""

echo -e "${GREEN}Done!${NC}"

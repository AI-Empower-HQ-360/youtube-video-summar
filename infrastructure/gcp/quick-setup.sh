#!/bin/bash

# ==============================================
# Quick Setup for 1-Month FREE Development
# ==============================================
# Budget: $15 USD (covered by $300 free credit)
# Duration: 1 month

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  YouTube Video Summarizer${NC}"
echo -e "${BLUE}  1-Month FREE Development Setup${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if gcloud is available
if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}Loading Google Cloud SDK...${NC}"
    source ~/google-cloud-sdk/path.bash.inc 2>/dev/null || {
        echo -e "${RED}Google Cloud SDK not found. Installing...${NC}"
        curl -sSL https://sdk.cloud.google.com | bash -s -- --disable-prompts --install-dir=$HOME
        source ~/google-cloud-sdk/path.bash.inc
    }
fi

PROJECT_ID="${GCP_PROJECT_ID:-youtube-video-summary-483906}"
REGION="${GCP_REGION:-us-central1}"
BUDGET=15

echo -e "${CYAN}Configuration:${NC}"
echo -e "  Project ID: ${GREEN}${PROJECT_ID}${NC}"
echo -e "  Region: ${GREEN}${REGION}${NC}"
echo -e "  Monthly Budget: ${GREEN}\$${BUDGET}${NC}"
echo -e "  Duration: ${GREEN}1 month FREE${NC}"
echo ""

# Step 1: Authenticate
echo -e "${BLUE}Step 1: Authentication${NC}"
echo -e "─────────────────────────────────────────"
echo ""

if gcloud auth list 2>/dev/null | grep -q "ACTIVE"; then
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
    echo -e "${GREEN}✓ Already authenticated as: ${ACCOUNT}${NC}"
else
    echo -e "${YELLOW}Please authenticate with Google Cloud:${NC}"
    echo ""
    gcloud auth login --no-launch-browser
fi

echo ""

# Step 2: Set project
echo -e "${BLUE}Step 2: Project Configuration${NC}"
echo -e "─────────────────────────────────────────"
gcloud config set project "$PROJECT_ID" 2>/dev/null
echo -e "${GREEN}✓ Project set to: ${PROJECT_ID}${NC}"
echo ""

# Step 3: Enable required APIs
echo -e "${BLUE}Step 3: Enabling Required APIs${NC}"
echo -e "─────────────────────────────────────────"
echo ""

APIS=(
    "run.googleapis.com"
    "artifactregistry.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
    "aiplatform.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo -n "  Enabling $api... "
    gcloud services enable "$api" --project="$PROJECT_ID" 2>/dev/null && \
        echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}(already enabled)${NC}"
done

echo ""

# Step 4: Set up budget alert
echo -e "${BLUE}Step 4: Budget Alert (\$${BUDGET}/month)${NC}"
echo -e "─────────────────────────────────────────"
echo ""

echo -e "${YELLOW}Enter your email for budget alerts:${NC}"
read -r ALERT_EMAIL

if [ -n "$ALERT_EMAIL" ]; then
    # Get billing account
    BILLING_ACCOUNT=$(gcloud billing projects describe "$PROJECT_ID" \
        --format="value(billingAccountName)" 2>/dev/null | sed 's/.*\///')
    
    if [ -n "$BILLING_ACCOUNT" ]; then
        echo -n "  Creating \$${BUDGET} budget alert... "
        gcloud billing budgets create \
            --billing-account="$BILLING_ACCOUNT" \
            --display-name="Dev Budget - 1 Month" \
            --budget-amount="${BUDGET}USD" \
            --threshold-rule=percent=50 \
            --threshold-rule=percent=80 \
            --threshold-rule=percent=100 \
            --filter-projects="projects/${PROJECT_ID}" 2>/dev/null && \
            echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}(may already exist)${NC}"
    else
        echo -e "${YELLOW}⚠ No billing account linked. Set up billing first.${NC}"
        echo -e "  Visit: https://console.cloud.google.com/billing?project=${PROJECT_ID}"
    fi
else
    echo -e "${YELLOW}Skipping budget alert (no email provided)${NC}"
fi

echo ""

# Step 5: Create Terraform state bucket
echo -e "${BLUE}Step 5: Terraform State Bucket${NC}"
echo -e "─────────────────────────────────────────"
echo ""

BUCKET_NAME="${PROJECT_ID}-terraform-state"
echo -n "  Creating bucket ${BUCKET_NAME}... "
gsutil mb -p "$PROJECT_ID" -l "$REGION" "gs://${BUCKET_NAME}" 2>/dev/null && \
    echo -e "${GREEN}✓${NC}" || echo -e "${YELLOW}(already exists)${NC}"

echo ""

# Summary
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${CYAN}Your FREE Development Environment:${NC}"
echo -e "  ✅ Project: ${PROJECT_ID}"
echo -e "  ✅ Region: ${REGION}"
echo -e "  ✅ Budget: \$${BUDGET}/month"
echo -e "  ✅ APIs enabled"
echo -e "  ✅ Terraform state bucket ready"
echo ""
echo -e "${CYAN}Cost Estimate for 1 Month:${NC}"
echo -e "  Cloud Run (API):        \$0-3 (scales to zero)"
echo -e "  Vertex AI (Gemini):     \$5-8 (100 summaries/day)"
echo -e "  Storage + Registry:     \$0-2"
echo -e "  ─────────────────────────────────────"
echo -e "  ${GREEN}TOTAL: \$5-15 (covered by \$300 credit)${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo -e "  1. Deploy to GCP:"
echo -e "     ${CYAN}./deploy-enhanced.sh deploy dev${NC}"
echo ""
echo -e "  2. Or run locally first:"
echo -e "     ${CYAN}cd ../.. && npm run dev${NC}"
echo ""
echo -e "${BLUE}View your spending:${NC}"
echo -e "  https://console.cloud.google.com/billing?project=${PROJECT_ID}"
echo ""

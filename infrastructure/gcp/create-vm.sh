#!/bin/bash

# ==============================================
# GCP VM Creation Script
# ==============================================
# Creates an e2-micro Ubuntu VM for YouTube Summarizer
# Run this script from your local machine with gcloud CLI installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  GCP VM Creation Script${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo -e "${RED}gcloud CLI is not installed${NC}"
  echo "Install from: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

# Get project ID
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"

if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}Enter your GCP Project ID:${NC}"
  read -r PROJECT_ID
  gcloud config set project "$PROJECT_ID"
fi

echo -e "${GREEN}Using Project: ${PROJECT_ID}${NC}"
echo ""

# Check if billing is enabled
echo -e "${BLUE}Checking billing status...${NC}"
BILLING_ACCOUNT=$(gcloud billing projects describe "$PROJECT_ID" \
  --format="value(billingAccountName)" 2>/dev/null || echo "")

if [ -z "$BILLING_ACCOUNT" ]; then
  echo -e "${RED}❌ Billing account not linked${NC}"
  echo -e "${YELLOW}Please link billing account at:${NC}"
  echo "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
  exit 1
fi

echo -e "${GREEN}✓ Billing account linked: ${BILLING_ACCOUNT}${NC}"
echo ""

# Enable Compute Engine API
echo -e "${BLUE}Enabling Compute Engine API...${NC}"
gcloud services enable compute.googleapis.com --project="$PROJECT_ID" || true
echo -e "${GREEN}✓ Compute Engine API enabled${NC}"
echo ""

# VM Configuration
VM_NAME="${VM_NAME:-youtube-summarizer-dev}"
ZONE="${ZONE:-us-central1-a}"
REGION="${REGION:-us-central1}"
MACHINE_TYPE="e2-micro"
IMAGE_FAMILY="ubuntu-2404-lts"
IMAGE_PROJECT="ubuntu-os-cloud"
BOOT_DISK_SIZE="10GB"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  VM Configuration${NC}"
echo -e "${BLUE}=========================================${NC}"
echo "Name: ${VM_NAME}"
echo "Zone: ${ZONE}"
echo "Machine Type: ${MACHINE_TYPE}"
echo "OS: Ubuntu 24.04 LTS"
echo "Boot Disk: ${BOOT_DISK_SIZE}"
echo ""

# Confirm creation
echo -e "${YELLOW}Proceed with VM creation? (yes/no)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo -e "${RED}Cancelled${NC}"
  exit 0
fi

echo ""
echo -e "${BLUE}Creating VM instance...${NC}"

# Create the VM
gcloud compute instances create "$VM_NAME" \
  --project="$PROJECT_ID" \
  --zone="$ZONE" \
  --machine-type="$MACHINE_TYPE" \
  --image-family="$IMAGE_FAMILY" \
  --image-project="$IMAGE_PROJECT" \
  --boot-disk-size="$BOOT_DISK_SIZE" \
  --boot-disk-type=pd-standard \
  --allow-http \
  --allow-https \
  --metadata=enable-oslogin=true \
  --create-disk=auto-delete=yes,boot=yes,device-name="$VM_NAME",image-project=ubuntu-os-cloud,image-family=ubuntu-2404-lts,size=10

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ VM created successfully!${NC}"
  echo ""
  echo -e "${BLUE}Next Steps:${NC}"
  echo "1. Connect via browser SSH:"
  echo "   gcloud compute ssh $VM_NAME --zone=$ZONE"
  echo ""
  echo "2. Or use GCP Console:"
  echo "   https://console.cloud.google.com/compute/instances"
  echo ""
  echo "3. Setup application:"
  echo "   git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git"
  echo "   cd youtube-video-summar && npm install && ./start.sh"
  echo ""
else
  echo -e "${RED}✗ VM creation failed${NC}"
  exit 1
fi

echo -e "${GREEN}Done!${NC}"

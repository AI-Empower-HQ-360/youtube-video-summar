#!/bin/bash
# Pre-deployment verification script
# Checks that all prerequisites are met before deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Pre-Deployment Verification${NC}"
echo -e "${BLUE}========================================${NC}\n"

ERRORS=0
WARNINGS=0

# Check 1: Required tools
echo -e "${BLUE}[1/8]${NC} Checking required tools..."
for tool in gcloud terraform docker git; do
    if command -v $tool &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} $tool installed"
    else
        echo -e "  ${RED}✗${NC} $tool NOT installed"
        ((ERRORS++))
    fi
done

# Check 2: gcloud authentication
echo -e "\n${BLUE}[2/8]${NC} Checking gcloud authentication..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1)
    echo -e "  ${GREEN}✓${NC} Authenticated as: $ACCOUNT"
else
    echo -e "  ${RED}✗${NC} Not authenticated. Run: gcloud auth login"
    ((ERRORS++))
fi

# Check 3: GCP project set
echo -e "\n${BLUE}[3/8]${NC} Checking GCP project..."
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")
if [ -n "$PROJECT_ID" ]; then
    echo -e "  ${GREEN}✓${NC} Active project: $PROJECT_ID"
else
    echo -e "  ${RED}✗${NC} No project set. Run: gcloud config set project PROJECT_ID"
    ((ERRORS++))
fi

# Check 4: Required APIs
echo -e "\n${BLUE}[4/8]${NC} Checking required APIs..."
if [ -n "$PROJECT_ID" ]; then
    REQUIRED_APIS=(
        "run.googleapis.com"
        "cloudbuild.googleapis.com"
        "artifactregistry.googleapis.com"
        "secretmanager.googleapis.com"
    )
    
    for api in "${REQUIRED_APIS[@]}"; do
        if gcloud services list --enabled --filter="name:$api" --format="value(name)" 2>/dev/null | grep -q "$api"; then
            echo -e "  ${GREEN}✓${NC} $api enabled"
        else
            echo -e "  ${YELLOW}!${NC} $api not enabled (will be enabled during deployment)"
            ((WARNINGS++))
        fi
    done
else
    echo -e "  ${YELLOW}!${NC} Skipping (no project set)"
    ((WARNINGS++))
fi

# Check 5: Environment configuration files
echo -e "\n${BLUE}[5/8]${NC} Checking environment configuration..."
for env in dev staging production; do
    if [ -f "$SCRIPT_DIR/environments/$env.tfvars" ]; then
        # Check if PROJECT_ID is still placeholder
        if grep -q "your-gcp-project-id" "$SCRIPT_DIR/environments/$env.tfvars"; then
            echo -e "  ${YELLOW}!${NC} $env.tfvars contains placeholder values"
            ((WARNINGS++))
        else
            echo -e "  ${GREEN}✓${NC} $env.tfvars configured"
        fi
    else
        echo -e "  ${RED}✗${NC} $env.tfvars missing"
        ((ERRORS++))
    fi
done

# Check 6: Backend configuration
echo -e "\n${BLUE}[6/8]${NC} Checking Terraform backend..."
if [ -f "$SCRIPT_DIR/backend.tf" ]; then
    if grep -q "YOUR_PROJECT_ID" "$SCRIPT_DIR/backend.tf"; then
        echo -e "  ${YELLOW}!${NC} Backend not configured (will be set during setup)"
        ((WARNINGS++))
    else
        echo -e "  ${GREEN}✓${NC} Backend configured"
    fi
else
    echo -e "  ${RED}✗${NC} backend.tf missing"
    ((ERRORS++))
fi

# Check 7: Docker daemon
echo -e "\n${BLUE}[7/8]${NC} Checking Docker daemon..."
if docker ps &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker daemon running"
else
    echo -e "  ${RED}✗${NC} Docker daemon not running"
    ((ERRORS++))
fi

# Check 8: Git repository
echo -e "\n${BLUE}[8/8]${NC} Checking Git repository..."
if git rev-parse --git-dir &> /dev/null; then
    BRANCH=$(git branch --show-current)
    echo -e "  ${GREEN}✓${NC} Git repository (branch: $BRANCH)"
else
    echo -e "  ${YELLOW}!${NC} Not in a Git repository"
    ((WARNINGS++))
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}========================================${NC}\n"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "\nYou're ready to deploy. Run:"
    echo -e "  ${BLUE}./deploy-enhanced.sh setup${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}! $WARNINGS warning(s) found${NC}"
    echo -e "\nYou can proceed with deployment, but review warnings above."
    echo -e "Run: ${BLUE}./deploy-enhanced.sh setup${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}! $WARNINGS warning(s) found${NC}"
    echo -e "\nPlease fix errors before deploying."
    exit 1
fi

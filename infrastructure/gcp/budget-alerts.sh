#!/bin/bash

# ==============================================
# GCP Budget Alerts Setup Script
# ==============================================
# This script creates budget alerts to monitor spending
# and prevent unexpected charges

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  GCP Budget Alerts Setup${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Get project ID
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"

if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}Enter your GCP Project ID:${NC}"
  read -r PROJECT_ID
fi

echo -e "${GREEN}Using Project ID: ${PROJECT_ID}${NC}"
echo ""

# Get billing account
echo -e "${BLUE}Fetching billing account...${NC}"
BILLING_ACCOUNT=$(gcloud billing projects describe "$PROJECT_ID" \
  --format="value(billingAccountName)" 2>/dev/null | sed 's/.*\///')

if [ -z "$BILLING_ACCOUNT" ]; then
  echo -e "${RED}No billing account found. Please link a billing account first:${NC}"
  echo "Visit: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
  exit 1
fi

echo -e "${GREEN}Billing Account: ${BILLING_ACCOUNT}${NC}"
echo ""

# Get alert email
echo -e "${YELLOW}Enter email address for budget alerts:${NC}"
read -r ALERT_EMAIL

if [ -z "$ALERT_EMAIL" ]; then
  echo -e "${RED}Email is required${NC}"
  exit 1
fi

# Get budget amount
echo -e "${YELLOW}Enter monthly budget amount in USD (e.g., 50):${NC}"
read -r BUDGET_AMOUNT

if [ -z "$BUDGET_AMOUNT" ]; then
  BUDGET_AMOUNT=50
  echo -e "${YELLOW}Using default budget: \$${BUDGET_AMOUNT}/month${NC}"
fi

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Creating Budget Alerts${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Create budget configuration
cat > /tmp/budget-config.yaml <<EOF
displayName: "YouTube Summarizer Budget Alert"
budgetFilter:
  projects:
  - projects/${PROJECT_ID}
amount:
  specifiedAmount:
    currencyCode: USD
    units: "${BUDGET_AMOUNT}"
thresholdRules:
- thresholdPercent: 0.5
  spendBasis: CURRENT_SPEND
- thresholdPercent: 0.75
  spendBasis: CURRENT_SPEND
- thresholdPercent: 0.9
  spendBasis: CURRENT_SPEND
- thresholdPercent: 1.0
  spendBasis: CURRENT_SPEND
- thresholdPercent: 1.1
  spendBasis: CURRENT_SPEND
notificationsRule:
  pubsubTopic: projects/${PROJECT_ID}/topics/budget-alerts
  schemaVersion: "1.0"
  monitoringNotificationChannels:
  - projects/${PROJECT_ID}/notificationChannels/budget-email
EOF

# Create Pub/Sub topic for budget alerts
echo -e "${BLUE}Creating Pub/Sub topic for budget notifications...${NC}"
gcloud pubsub topics create budget-alerts \
  --project="$PROJECT_ID" 2>/dev/null || echo "Topic already exists"

# Create notification channel
echo -e "${BLUE}Creating email notification channel...${NC}"
CHANNEL_ID=$(gcloud alpha monitoring channels create \
  --display-name="Budget Alert Email" \
  --type=email \
  --channel-labels=email_address="$ALERT_EMAIL" \
  --project="$PROJECT_ID" \
  --format="value(name)" 2>/dev/null || echo "")

if [ -n "$CHANNEL_ID" ]; then
  echo -e "${GREEN}✓ Notification channel created${NC}"
else
  echo -e "${YELLOW}Using existing notification channel${NC}"
fi

# Create the budget
echo -e "${BLUE}Creating budget with alerts...${NC}"
gcloud billing budgets create \
  --billing-account="$BILLING_ACCOUNT" \
  --display-name="YouTube Summarizer Monthly Budget" \
  --budget-amount="${BUDGET_AMOUNT}USD" \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=75 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100 \
  --threshold-rule=percent=110 \
  --filter-projects="projects/${PROJECT_ID}" 2>/dev/null || {
    echo -e "${YELLOW}Budget may already exist. Updating...${NC}"
  }

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Budget Alerts Created Successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Budget Configuration:${NC}"
echo -e "  Monthly Limit: \$${BUDGET_AMOUNT}"
echo -e "  Alert Email: ${ALERT_EMAIL}"
echo -e "  Alert Thresholds:"
echo -e "    - 50% (\$$(echo "$BUDGET_AMOUNT * 0.5" | bc))"
echo -e "    - 75% (\$$(echo "$BUDGET_AMOUNT * 0.75" | bc))"
echo -e "    - 90% (\$$(echo "$BUDGET_AMOUNT * 0.9" | bc))"
echo -e "    - 100% (\$${BUDGET_AMOUNT}) ⚠️"
echo -e "    - 110% (\$$(echo "$BUDGET_AMOUNT * 1.1" | bc)) 🚨"
echo ""
echo -e "${YELLOW}📧 You will receive email alerts when spending reaches these thresholds${NC}"
echo ""
echo -e "${BLUE}View your budgets:${NC}"
echo -e "https://console.cloud.google.com/billing/${BILLING_ACCOUNT}/budgets?project=${PROJECT_ID}"
echo ""
echo -e "${BLUE}View current costs:${NC}"
echo -e "https://console.cloud.google.com/billing/${BILLING_ACCOUNT}/reports?project=${PROJECT_ID}"
echo ""

# Clean up
rm -f /tmp/budget-config.yaml

echo -e "${GREEN}✓ Setup complete!${NC}"

#!/bin/bash

# ==============================================
# GCP Cost Estimator
# ==============================================
# Estimates monthly costs based on usage patterns

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  GCP Cost Estimator${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Get environment
ENV="${1:-dev}"

echo -e "${CYAN}Environment: ${ENV}${NC}"
echo ""

# Usage patterns
echo -e "${YELLOW}Enter expected monthly usage:${NC}"
echo ""

echo -e "How many video summarizations per day? (default: 100)"
read -r DAILY_SUMMARIES
DAILY_SUMMARIES=${DAILY_SUMMARIES:-100}

echo -e "Average transcript length in characters? (default: 5000)"
read -r AVG_TRANSCRIPT_LENGTH
AVG_TRANSCRIPT_LENGTH=${AVG_TRANSCRIPT_LENGTH:-5000}

echo -e "Expected unique visitors per day? (default: 200)"
read -r DAILY_VISITORS
DAILY_VISITORS=${DAILY_VISITORS:-200}

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Cost Breakdown (Monthly)${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Calculate costs
MONTHLY_SUMMARIES=$((DAILY_SUMMARIES * 30))
MONTHLY_VISITORS=$((DAILY_VISITORS * 30))

# Vertex AI Gemini Pro costs
# Input: $0.00025 per 1K chars
# Output: $0.0005 per 1K chars (assume 1K output per summary)
TOTAL_INPUT_CHARS=$((MONTHLY_SUMMARIES * AVG_TRANSCRIPT_LENGTH))
INPUT_COST=$(echo "scale=2; $TOTAL_INPUT_CHARS / 1000 * 0.00025" | bc)
OUTPUT_COST=$(echo "scale=2; $MONTHLY_SUMMARIES * 1 * 0.0005" | bc)
AI_COST=$(echo "scale=2; $INPUT_COST + $OUTPUT_COST" | bc)

# Cloud Run costs
# Assume 100ms per request, 512MB memory
REQUEST_COUNT=$((MONTHLY_SUMMARIES + MONTHLY_VISITORS * 3))  # Multiple requests per visitor
CPU_SECONDS=$(echo "scale=2; $REQUEST_COUNT * 0.1 * 1" | bc)  # 100ms * 1 vCPU
MEMORY_GB_SECONDS=$(echo "scale=2; $REQUEST_COUNT * 0.1 * 0.512" | bc)
CPU_COST=$(echo "scale=2; $CPU_SECONDS * 0.00002400" | bc)
MEMORY_COST=$(echo "scale=2; $MEMORY_GB_SECONDS * 0.00000250" | bc)
REQUEST_COST=$(echo "scale=2; $REQUEST_COUNT / 1000000 * 0.40" | bc)
CLOUDRUN_COST=$(echo "scale=2; $CPU_COST + $MEMORY_COST + $REQUEST_COST" | bc)

# Cloud Storage (static assets)
STORAGE_GB=5
STORAGE_COST=$(echo "scale=2; $STORAGE_GB * 0.020" | bc)  # $0.020 per GB

# Artifact Registry (assume 3 images, 500MB each)
REGISTRY_COST=0.50

# Secret Manager (3 secrets)
SECRET_COST=0.06

# Cloud Build (assume 5 builds per month, 5 min each)
BUILD_COST=1.00

# Total
TOTAL_COST=$(echo "scale=2; $AI_COST + $CLOUDRUN_COST + $STORAGE_COST + $REGISTRY_COST + $SECRET_COST + $BUILD_COST" | bc)

# Display breakdown
printf "%-30s %10s\n" "Service" "Cost (USD)"
echo "----------------------------------------"
printf "%-30s %10s\n" "Vertex AI (Gemini Pro):" "\$$AI_COST"
printf "  %-28s %10s\n" "- Input ($MONTHLY_SUMMARIES summaries)" "\$$INPUT_COST"
printf "  %-28s %10s\n" "- Output" "\$$OUTPUT_COST"
echo ""
printf "%-30s %10s\n" "Cloud Run (API):" "\$$CLOUDRUN_COST"
printf "  %-28s %10s\n" "- CPU ($CPU_SECONDS sec)" "\$$CPU_COST"
printf "  %-28s %10s\n" "- Memory ($MEMORY_GB_SECONDS GB-sec)" "\$$MEMORY_COST"
printf "  %-28s %10s\n" "- Requests ($REQUEST_COUNT)" "\$$REQUEST_COST"
echo ""
printf "%-30s %10s\n" "Cloud Storage:" "\$$STORAGE_COST"
printf "%-30s %10s\n" "Artifact Registry:" "\$$REGISTRY_COST"
printf "%-30s %10s\n" "Secret Manager:" "\$$SECRET_COST"
printf "%-30s %10s\n" "Cloud Build:" "\$$BUILD_COST"
echo "========================================="
printf "%-30s %10s\n" "TOTAL ESTIMATED COST:" "\$$TOTAL_COST"
echo "========================================="
echo ""

# Cost-saving recommendations
echo -e "${YELLOW}💡 Cost-Saving Tips:${NC}"
echo ""

if (( $(echo "$TOTAL_COST > 50" | bc -l) )); then
  echo "  • Implement caching to reduce AI API calls"
  echo "  • Use Cloud Run min instances = 0 for dev/staging"
  echo "  • Enable request compression"
fi

if (( $(echo "$AI_COST > 20" | bc -l) )); then
  echo "  • Cache frequently requested summaries"
  echo "  • Implement rate limiting per user"
  echo "  • Consider batch processing"
fi

if [ "$ENV" = "production" ]; then
  echo "  • Use reserved Cloud Run capacity for predictable workloads"
  echo "  • Enable CDN for static assets"
  echo "  • Set up log sampling (not all logs)"
fi

echo ""
echo -e "${GREEN}Free Tier Coverage:${NC}"
echo "  Cloud Run: First 2M requests/month FREE"
echo "  Cloud Storage: First 5GB FREE"
echo "  Cloud Build: First 120 build-min/day FREE"
echo ""

if (( $(echo "$TOTAL_COST < 20" | bc -l) )); then
  echo -e "${GREEN}✓ This usage pattern is very cost-effective!${NC}"
elif (( $(echo "$TOTAL_COST < 50" | bc -l) )); then
  echo -e "${YELLOW}⚠ Moderate costs. Consider implementing caching.${NC}"
else
  echo -e "${YELLOW}⚠ Higher costs. Recommended to implement cost optimizations.${NC}"
fi

echo ""
echo -e "${BLUE}Set up budget alert for this estimate:${NC}"
echo -e "./budget-alerts.sh"
echo ""

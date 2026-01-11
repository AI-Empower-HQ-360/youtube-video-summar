# 💰 GCP Cost Management Guide

Complete guide to understanding and managing costs for the YouTube Video Summarizer application.

## 🎁 Free Tier Benefits

### **New Account Credits**

- **$300 USD free credit** valid for 90 days
- Applies to all GCP services
- Perfect for development and testing

### **Always Free Tier** (No Expiration)

| Service | Free Tier |
|---------|-----------|
| **Cloud Run** | 2M requests/month<br>360,000 GB-seconds compute<br>180,000 vCPU-seconds |
| **Cloud Storage** | 5 GB standard storage<br>5,000 Class A operations<br>50,000 Class B operations |
| **Secret Manager** | 6 active secret versions |
| **Cloud Build** | 120 build-minutes/day |
| **Artifact Registry** | 500 MB storage |
| **Vertex AI** | Limited free usage (varies by model) |

## 📊 Cost Breakdown by Environment

### Development ($5-15/month)

```
Service                    Monthly Cost
─────────────────────────────────────
Vertex AI (Gemini Pro)     $3-8
  • ~100 summaries/day
  • ~5,000 chars per summary
  
Cloud Run (API)            $1-3
  • ~3,000 requests/month
  • 512MB memory, 1 vCPU
  
Cloud Storage              $0.50
  • <5GB static assets
  
Artifact Registry          $0.25
  • ~1-2 Docker images
  
Secret Manager             $0.06
  • 3 secrets
  
Cloud Build                $0-1
  • ~5 builds/month
  
TOTAL: ~$5-15/month
```

### Staging ($15-30/month)

```
Service                    Monthly Cost
─────────────────────────────────────
Vertex AI (Gemini Pro)     $8-15
  • ~300 summaries/day
  
Cloud Run (API)            $3-8
  • ~10,000 requests/month
  
Cloud Storage              $1-2
Cloud Artifact Registry    $0.50
Secret Manager             $0.06
Cloud Build                $1-2

TOTAL: ~$15-30/month
```

### Production ($50-200/month)

```
Service                    Monthly Cost
─────────────────────────────────────
Vertex AI (Gemini Pro)     $20-100
  • ~1,000+ summaries/day
  • Cache hit ratio affects cost
  
Cloud Run (API)            $20-80
  • ~50,000+ requests/month
  • Auto-scaling instances
  
Cloud Storage              $2-5
  • Static assets + logs
  
Load Balancer              $5-10
  • If using global LB
  
Artifact Registry          $1-2
Secret Manager             $0.10
Cloud Build                $2-5

TOTAL: ~$50-200/month
```

## 💵 Detailed Service Pricing

### Vertex AI (Gemini Pro)

**Input Pricing**: $0.00025 per 1,000 characters  
**Output Pricing**: $0.0005 per 1,000 characters

**Example**:

- Video transcript: 5,000 characters
- Summary output: 1,000 characters
- Cost per summary: $0.00175 (~0.2¢)
- 1,000 summaries: ~$1.75

**Monthly Estimate**:

```
Summaries/Day   Monthly Cost
100             $5.25
500             $26.25
1,000           $52.50
5,000           $262.50
```

### Cloud Run

**Pricing Components**:

- CPU: $0.00002400 per vCPU-second
- Memory: $0.00000250 per GiB-second
- Requests: $0.40 per million requests

**Example** (100ms request, 512MB, 1 vCPU):

- CPU cost: 0.1 sec × $0.00002400 = $0.0000024
- Memory cost: 0.1 sec × 0.5 GB × $0.00000250 = $0.000000125
- Request cost: $0.40 ÷ 1,000,000 = $0.0000004
- **Total per request**: ~$0.0000029 (0.0003¢)

### Cloud Storage

**Standard Storage**: $0.020 per GB/month  
**Nearline Storage**: $0.010 per GB/month (for archival)

**Operations**:

- Class A (write): $0.05 per 10,000 operations
- Class B (read): $0.004 per 10,000 operations

### Cloud Build

**Pricing**: $0.003 per build-minute  
**First 120 minutes/day**: FREE

**Example**:

- 5-minute build
- 10 builds/month
- Total: 50 minutes
- Cost: FREE (under daily limit)

## 🛡️ Cost Protection Setup

### 1. Set Up Budget Alerts

```bash
cd infrastructure/gcp
./budget-alerts.sh
```

You'll be prompted for:

- Email address for alerts
- Monthly budget amount
- Alert thresholds (50%, 75%, 90%, 100%, 110%)

### 2. Estimate Your Costs

```bash
./cost-estimator.sh dev
```

Enter your expected usage:

- Summaries per day
- Average transcript length
- Daily visitors

### 3. Apply Cost Controls

Cost controls are automatically applied via Terraform:

**Development**:

- Max 5 Cloud Run instances
- 512MB memory limit
- 60-second timeout

**Production**:

- Max 20 Cloud Run instances
- 2GB memory limit
- 5-minute timeout

### 4. Monitor Spending

**View Current Costs**:

```bash
gcloud billing projects describe $(gcloud config get-value project) \
  --format="table(billingAccountName)"
```

**Check Budget Status**:

```bash
gcloud billing budgets list \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

**View Cost Breakdown**:

1. Go to [GCP Console](https://console.cloud.google.com/billing)
2. Select your project
3. Navigate to "Reports" for detailed breakdown

## 💡 Cost Optimization Strategies

### 1. Implement Response Caching

**Backend Caching** (`server/src/services/summary.service.js`):

```javascript
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

export async function generateSummary(transcript, options = {}) {
  const cacheKey = hashTranscript(transcript);
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.summary;
    }
  }
  
  const summary = await callVertexAI(transcript, options);
  cache.set(cacheKey, { summary, timestamp: Date.now() });
  
  return summary;
}
```

**Potential Savings**: 30-50% reduction in AI API calls

### 2. Use Cloud Run Efficiently

**Set Minimum Instances to 0** (dev/staging):

```hcl
autoscaling.knative.dev/minScale = "0"
```

**Increase Concurrency**:

```hcl
container_concurrency = 100  # Handle more requests per instance
```

**Potential Savings**: 40-60% on compute costs

### 3. Implement Rate Limiting

Already configured in `server/src/middleware/rateLimiter.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
```

**Prevents**: Abuse and unexpected API costs

### 4. Storage Lifecycle Policies

Automatically applied via Terraform:

- Delete artifacts >30 days old
- Move cold data to Nearline storage
- Delete old object versions

**Potential Savings**: 20-30% on storage costs

### 5. Use Request Batching

For bulk operations:

```javascript
// Instead of 100 individual calls
for (const video of videos) {
  await summarize(video);
}

// Use batch processing
await summarizeBatch(videos);
```

**Potential Savings**: Reduced per-request overhead

### 6. Monitor and Optimize

**Weekly Review**:

```bash
# Check top services by cost
gcloud billing accounts get-cost-by-service \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --start-date=2026-01-01 \
  --end-date=2026-01-31
```

**Monthly Optimization**:

1. Review cost reports
2. Identify expensive services
3. Implement targeted optimizations
4. Adjust resource limits

## 📈 Scaling Cost Estimates

### Growth Scenarios

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Daily Summaries | 100 | 1,000 | 10,000 |
| Monthly Visitors | 3,000 | 30,000 | 300,000 |
| **Estimated Cost** | **$10-20** | **$50-100** | **$200-500** |

### Cost per User

- **Casual User** (1-5 summaries/month): $0.01-0.05
- **Regular User** (20-50 summaries/month): $0.20-0.50
- **Power User** (100+ summaries/month): $1-2

### Break-Even Analysis

If charging users:

- **Free Tier**: Up to 5 summaries/month (profitable)
- **Pro Tier** ($5/month): Up to 200 summaries (profitable at $0.025/summary)
- **Enterprise** ($50/month): Up to 2,000 summaries (profitable)

## 🚨 Cost Alerts Checklist

✅ Budget alert set at $50/month  
✅ Email notifications enabled  
✅ Alert thresholds: 50%, 75%, 90%, 100%  
✅ Daily cost monitoring dashboard  
✅ Resource limits applied via Terraform  
✅ Lifecycle policies for storage  
✅ Rate limiting enabled  
✅ Caching strategy implemented  

## 🔗 Useful Links

- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cost Management Best Practices](https://cloud.google.com/cost-management/docs/best-practices)
- [Your Billing Dashboard](https://console.cloud.google.com/billing)

## 📞 Support

If costs exceed expectations:

1. Check budget alerts dashboard
2. Review [MAINTENANCE.md](infrastructure/gcp/MAINTENANCE.md) for troubleshooting
3. Run cost estimator: `./cost-estimator.sh`
4. Contact GCP Support if unusual charges detected

---

**Last Updated**: January 11, 2026  
**Project**: YouTube Video Summarizer  
**GCP Project ID**: youtube-video-summary-483906

# YouTube Video Summarizer - GCP Architecture

## 🏗️ Complete Infrastructure Overview

This document describes the complete Google Cloud Platform architecture for the YouTube Video Summarizer application.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER / CLIENT                                  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ↓
              ┌──────────────────────────┐
              │   Cloud Load Balancer    │  (Optional - when CDN enabled)
              │   • Global HTTP(S) LB    │
              │   • SSL Termination      │
              │   • CDN Caching          │
              └─────────┬────────────────┘
                        │
          ┌─────────────┴──────────────┐
          │                            │
          ↓                            ↓
┌─────────────────────┐      ┌─────────────────────┐
│  Cloud Storage      │      │   Cloud Run API     │
│  (Frontend Assets)  │      │   (Backend Service) │
│                     │      │                     │
│  • React SPA        │      │  • Node.js/Express  │
│  • Static files     │      │  • Auto-scaling     │
│  • CDN enabled      │      │  • HTTPS only       │
│  • CORS configured  │      │  • Port 3001        │
└─────────────────────┘      └──────────┬──────────┘
                                        │
                    ┌───────────────────┼────────────────┐
                    │                   │                │
                    ↓                   ↓                ↓
         ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
         │ Secret Manager │  │   YouTube    │  │    OpenAI    │
         │                │  │     API      │  │     API      │
         │ • API Keys     │  │              │  │              │
         │ • Encrypted    │  │ • Transcript │  │ • LLM Model  │
         │ • Versioned    │  │ • Metadata   │  │ • Summarize  │
         └────────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     MANAGEMENT & CI/CD                                │
├───────────────┬──────────────────┬──────────────────┬───────────────┤
│  Cloud Build  │ Artifact Registry│ Cloud Monitoring │  Secret Mgr   │
│               │                  │                  │               │
│ • Auto build  │ • Docker images  │ • Logs           │ • Key storage │
│ • Auto deploy │ • Versioning     │ • Metrics        │ • IAM access  │
│ • On git push │ • Private repos  │ • Alerts         │ • Rotation    │
└───────────────┴──────────────────┴──────────────────┴───────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE AS CODE                             │
│                         Terraform                                     │
│  • State in GCS                                                       │
│  • Version controlled                                                 │
│  • Environment-specific configs                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Cloud Storage + CDN)

**Purpose**: Serve React application static assets globally

**Configuration**:
- **Storage Bucket**: Hosts compiled React app (from `npm run build`)
- **Website Hosting**: Enabled with index.html as main page
- **CORS**: Configured for API communication
- **CDN** (optional): Cloud CDN for global caching
- **Load Balancer** (optional): HTTPS load balancer for custom domains

**Access**:
- Direct: `https://storage.googleapis.com/PROJECT_ID-youtube-summarizer-assets/`
- With CDN: `http://LOAD_BALANCER_IP/`

**Cost**: ~$0.026/GB/month storage + $0.08-0.12/GB egress

### 2. Backend API (Cloud Run)

**Purpose**: RESTful API for video summarization

**Configuration**:
- **Runtime**: Node.js 18+ with Express
- **Container**: Docker image from Artifact Registry
- **Scaling**: 
  - Dev: 0-5 instances (scale to zero)
  - Staging: 1-10 instances
  - Production: 2-50 instances
- **Resources**:
  - Dev: 1 CPU, 512Mi RAM
  - Prod: 2 CPU, 2Gi RAM
- **Networking**: 
  - HTTPS only (auto-provisioned SSL)
  - Public access with IAM
- **Environment Variables**:
  - `NODE_ENV`: dev/staging/production
  - `YOUTUBE_API_KEY`: From Secret Manager
  - `OPENAI_API_KEY`: From Secret Manager

**Endpoints**:
- `GET /health` - Health check
- `POST /api/summarize` - Generate video summary
- `GET /api/youtube/info/:videoId` - Video metadata
- `POST /api/chat` - Interactive Q&A

**Cost**: $0.00002400/vCPU-second + $0.00000250/GiB-second

### 3. Artifact Registry

**Purpose**: Store and version Docker container images

**Configuration**:
- **Format**: Docker
- **Location**: Same region as Cloud Run
- **Repository**: `youtube-summarizer`
- **Images**:
  - `api:latest` - Latest stable build
  - `api:COMMIT_SHA` - Git commit-specific builds

**Cost**: $0.10/GB/month

### 4. Secret Manager

**Purpose**: Securely store API keys and sensitive configuration

**Configuration**:
- **Secrets**:
  - `youtube-api-key` - YouTube Data API v3 key
  - `openai-api-key` - OpenAI API key
- **Replication**: Automatic (multi-region)
- **Versioning**: Enabled
- **Access**: Cloud Run service account only

**Cost**: $0.06 per 10,000 access operations

### 5. Cloud Build (CI/CD)

**Purpose**: Automated build and deployment pipeline

**Trigger**: Push to `main` branch on GitHub

**Steps**:
1. **Build Backend**:
   ```bash
   docker build -t api:$COMMIT_SHA ./server
   ```

2. **Push to Registry**:
   ```bash
   docker push api:$COMMIT_SHA
   docker push api:latest
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy --image=api:$COMMIT_SHA
   ```

4. **Build Frontend**:
   ```bash
   npm install && npm run build
   ```

5. **Deploy to Storage**:
   ```bash
   gsutil rsync -r dist/ gs://BUCKET/
   ```

**Cost**: $0.003/build-minute (first 120 minutes/day free)

### 6. Cloud Monitoring

**Purpose**: Application monitoring and alerting

**Configuration**:
- **Metrics Collected**:
  - Request count/rate
  - Response latency (p50, p95, p99)
  - Error rate
  - CPU and memory usage
  - Container instance count

- **Alert Policies**:
  - High error rate (>5%)
  - High latency (>5 seconds)
  - Service down

- **Notifications**: Email alerts to specified address

**Cost**: First 150 MiB/month of logs free

### 7. Cloud CDN & Load Balancer (Optional)

**Purpose**: Global content delivery and custom domain support

**Configuration**:
- **Load Balancer**: Global HTTP(S) load balancer
- **Backend Bucket**: Serves from Cloud Storage
- **CDN Policy**:
  - Cache static assets
  - TTL: 3600s (1 hour)
  - Negative caching enabled
- **SSL**: Auto-provisioned for custom domains

**Cost**: ~$18/month base + $0.08-0.12/GB egress

## Data Flow

### 1. User Requests Summary

```
User → Frontend (React) → Backend API (Cloud Run)
                              ↓
                    YouTube Transcript API
                              ↓
                         OpenAI API
                              ↓
                    Return Summary JSON
                              ↓
                    Frontend Displays Result
```

### 2. Deployment Flow

```
Developer pushes to GitHub main branch
              ↓
      Cloud Build Trigger
              ↓
   ┌──────────┴──────────┐
   ↓                     ↓
Build Backend        Build Frontend
Docker Image         npm build
   ↓                     ↓
Push to              Upload to
Artifact Registry    Cloud Storage
   ↓                     ↓
Deploy to            Serve via
Cloud Run            CDN (optional)
```

## Security

### Authentication & Authorization
- **Cloud Run**: Service account with minimal permissions
- **Secret Manager**: IAM-based access control
- **API Keys**: Never exposed in code or logs
- **HTTPS**: Enforced for all communication

### Network Security
- **Cloud Run**: No direct internet access required
- **VPC Connector**: Optional for private resources
- **Firewall**: Managed by Google Cloud
- **DDoS Protection**: Automatic with Cloud Load Balancer

### Data Protection
- **Secrets**: Encrypted at rest and in transit
- **Logs**: Retention policy enforced
- **State Files**: Encrypted in GCS

## Scalability

### Horizontal Scaling
- **Cloud Run**: Automatically scales based on load
  - Dev: 0-5 instances
  - Production: 2-50 instances
- **Request handling**: Up to 1000 concurrent requests/instance

### Performance Optimizations
- **CDN Caching**: Reduces origin load for static assets
- **Cloud Run Cold Start**: <500ms with proper configuration
- **Database Caching**: TanStack Query on frontend

## Cost Optimization

### Development Environment
- **Scale to zero**: Pay only when using
- **Small instances**: Minimal resource allocation
- **No CDN**: Direct storage access

**Estimated Cost**: $0-10/month

### Production Environment
- **Min 2 instances**: High availability
- **Larger resources**: Better performance
- **CDN enabled**: Global distribution

**Estimated Cost**: $25-100/month (based on traffic)

### Cost Breakdown (Production)
| Service | Monthly Cost |
|---------|--------------|
| Cloud Run | $20-60 |
| Cloud Storage | $1-5 |
| Artifact Registry | $0.10 |
| Secret Manager | $0.06 |
| Cloud Build | Free tier |
| Monitoring | Free tier |
| CDN (optional) | $18-40 |
| **Total** | **$25-100** |

## Disaster Recovery

### Backup Strategy
- **Terraform State**: Versioned in GCS
- **Container Images**: Retained in Artifact Registry
- **Secrets**: Version history in Secret Manager
- **Static Assets**: Can be rebuilt from source

### Recovery Procedures
1. **State Corruption**: Restore from GCS version
2. **Bad Deployment**: Rollback to previous image tag
3. **Secret Leak**: Rotate secret, update version
4. **Region Failure**: Deploy to different region (manual)

## Monitoring & Observability

### Key Metrics
- **Availability**: 99.9% uptime SLA
- **Latency**: p95 < 2 seconds
- **Error Rate**: < 1%
- **Request Volume**: Per-minute tracking

### Logging
- **Cloud Run Logs**: stdout/stderr from containers
- **Access Logs**: All HTTP requests
- **Build Logs**: CI/CD pipeline execution
- **Audit Logs**: IAM and resource changes

### Dashboards
Access via Cloud Console:
- https://console.cloud.google.com/monitoring
- Custom dashboards for application metrics
- Pre-built Cloud Run service dashboard

## Compliance & Best Practices

✅ **Infrastructure as Code**: All resources managed by Terraform
✅ **Version Control**: State and configs in Git
✅ **Immutable Infrastructure**: Container-based deployments
✅ **Least Privilege**: Minimal IAM permissions
✅ **Encryption**: At rest and in transit
✅ **Monitoring**: Comprehensive alerting
✅ **Documentation**: Architecture and runbooks
✅ **CI/CD**: Automated deployments
✅ **Cost Tracking**: Resource labeling

## Labels & Tagging

All resources include:
```hcl
labels = {
  app         = "youtube-video-summarizer"
  environment = "dev|staging|production"
  managed-by  = "terraform"
  component   = "api-backend|storage|etc"
}
```

Use for:
- Cost allocation
- Resource grouping
- Access control
- Automated cleanup

## Next Steps

1. **Review** [QUICKSTART.md](QUICKSTART.md) for deployment instructions
2. **Configure** environment-specific variables in `environments/`
3. **Deploy** using `deploy-enhanced.sh`
4. **Monitor** using Cloud Console dashboards
5. **Optimize** costs based on usage patterns

---

For detailed deployment instructions, see [QUICKSTART.md](QUICKSTART.md).
For Terraform documentation, see [README.md](README.md).

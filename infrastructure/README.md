# 🚀 Google Cloud Infrastructure

## Complete Production-Ready GCP Setup

This directory contains a **comprehensive, production-ready Google Cloud Platform infrastructure** for the YouTube Video Summarizer, built with Terraform and featuring automated CI/CD, monitoring, and multi-environment support.

## ✨ What's Included

### 🏗️ Infrastructure Components
- **Cloud Run**: Auto-scaling serverless API backend
- **Cloud Storage**: Static frontend hosting with CDN
- **Artifact Registry**: Private Docker image repository
- **Secret Manager**: Encrypted API key storage
- **Cloud Build**: Automated CI/CD pipeline
- **Cloud Monitoring**: Alerts and dashboards
- **Load Balancer**: Optional global CDN

### 📝 Complete Documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Deploy in 10 minutes ⚡
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design & components
- **[MAINTENANCE.md](MAINTENANCE.md)** - Operations & troubleshooting
- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Feature overview

### 🔧 Deployment Automation
- **[deploy-enhanced.sh](deploy-enhanced.sh)** - Full-featured deployment script
- **[verify.sh](verify.sh)** - Pre-flight checks
- **[environments/](environments/)** - Environment-specific configs
  - `dev.tfvars` - Development (scale-to-zero)
  - `staging.tfvars` - Staging (1 min instance)
  - `production.tfvars` - Production (2+ min instances)

## 🎯 Quick Start

```bash
# 1. Verify prerequisites
./verify.sh

# 2. Initial setup
./deploy-enhanced.sh setup

# 3. Configure secrets
./deploy-enhanced.sh secrets

# 4. Deploy
./deploy-enhanced.sh deploy dev

# 5. Build app
./deploy-enhanced.sh build
```

For detailed instructions, see **[QUICKSTART.md](QUICKSTART.md)**.

## 💰 Cost Estimates

| Environment | Monthly Cost | Features |
|-------------|--------------|----------|
| **Development** | $0-10 | Scale-to-zero, no CDN |
| **Staging** | $15-25 | 1 min instance, CDN enabled |
| **Production** | $25-100 | 2+ min instances, full monitoring |

*Costs vary based on traffic and usage*

## 📊 Architecture

```
Users → Load Balancer → [Cloud Storage (Frontend) | Cloud Run (API)]
                                ↓
                         [Secret Manager] → [YouTube API, OpenAI API]
                                ↓
                    [Cloud Monitoring & Alerting]
```

For detailed architecture diagrams, see **[ARCHITECTURE.md](ARCHITECTURE.md)**.

## 🔐 Security Features

✅ Encrypted secrets in Secret Manager  
✅ HTTPS-only communication  
✅ Private container registry  
✅ IAM-based access control  
✅ Automated security scanning  
✅ Audit logging

## 🔄 CI/CD Pipeline

Automated deployment on push to `main`:
1. Build Docker images
2. Push to Artifact Registry
3. Deploy to Cloud Run
4. Update frontend in Cloud Storage
5. Run health checks

View builds: `gcloud builds list`

## 📈 Monitoring

Automatic alerts for:
- High error rate (>5%)
- High latency (>5 seconds)
- Service downtime

Dashboard: https://console.cloud.google.com/monitoring

## 🛠️ Common Operations

```bash
# View logs
gcloud run services logs read youtube-summarizer-api --region us-central1

# Update application
./deploy-enhanced.sh build

# Scale service
# Edit environments/ENV.tfvars, then:
./deploy-enhanced.sh deploy ENV

# Monitor resources
./deploy-enhanced.sh monitor

# Update secrets
./deploy-enhanced.sh secrets
```

## 🧹 Cleanup

```bash
# Destroy specific environment
./deploy-enhanced.sh destroy dev

# Complete cleanup
./deploy-enhanced.sh destroy dev
./deploy-enhanced.sh destroy staging
./deploy-enhanced.sh destroy production
```

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [QUICKSTART.md](QUICKSTART.md) | Fast deployment | First-time setup |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | Understanding infrastructure |
| [MAINTENANCE.md](MAINTENANCE.md) | Operations guide | Daily operations |
| [SETUP_SUMMARY.md](SETUP_SUMMARY.md) | Feature overview | After setup |
| [README.md](README.md) | Main reference | Ongoing reference |

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Terraform init fails | `rm -rf .terraform && ./deploy-enhanced.sh init` |
| Permission errors | `gcloud auth login && gcloud auth application-default login` |
| Build failures | Check logs: `gcloud builds log BUILD_ID` |
| Service not starting | Check logs: `gcloud run services logs read youtube-summarizer-api` |

For more, see **[MAINTENANCE.md](MAINTENANCE.md#-troubleshooting)**.

## 🎓 Prerequisites

Before deploying, ensure you have:

- ✅ GCP account with billing enabled
- ✅ [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed
- ✅ [Terraform](https://www.terraform.io/downloads) v1.0+
- ✅ [Docker](https://docs.docker.com/get-docker/) installed
- ✅ YouTube Data API v3 key
- ✅ OpenAI API key

Run `./verify.sh` to check all prerequisites.

## 🔗 External Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Project Repository](https://github.com/AI-Empower-HQ-360/youtube-video-summar)

## 📞 Support

- **GCP Support**: https://cloud.google.com/support
- **Issues**: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues
- **Discussions**: https://github.com/AI-Empower-HQ-360/youtube-video-summar/discussions

## 🌟 Features Highlights

- ✅ **Auto-scaling**: 0 to 50+ instances based on load
- ✅ **Multi-region**: Deploy to any GCP region
- ✅ **Zero-downtime**: Rolling deployments
- ✅ **Cost-optimized**: Pay only for what you use
- ✅ **Secure by default**: Encrypted secrets, HTTPS only
- ✅ **Production-ready**: Monitoring, alerts, backups
- ✅ **Infrastructure as Code**: Version-controlled, reproducible

## 📅 Maintenance Schedule

- **Daily**: Monitor dashboards and alerts
- **Weekly**: Review costs and logs
- **Monthly**: Update dependencies, rotate secrets
- **Quarterly**: Security audit, optimize costs

See **[MAINTENANCE.md](MAINTENANCE.md)** for detailed procedures.

---

**Status**: Production-Ready ✅  
**Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: DevOps Team

Ready to deploy? Start with: `./verify.sh`

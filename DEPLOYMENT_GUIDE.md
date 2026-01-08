# Deployment Guide - YouTube Video Summarizer

Complete guide for deploying the YouTube Video Summarizer to various platforms.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Process](#build-process)
3. [Platform-Specific Guides](#platform-specific-guides)
   - [Google Cloud Platform (GCP)](#google-cloud-platform-gcp)
   - [Vercel (Frontend)](#vercel-frontend)
   - [Heroku (Backend)](#heroku-backend)
   - [AWS](#aws)
   - [Docker](#docker)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment](#post-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] All tests passing: `npm test`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables configured
- [ ] API keys secured (not in code)
- [ ] CORS settings configured for production domains
- [ ] Rate limiting enabled
- [ ] Error handling tested

### Security

- [ ] All dependencies updated: `npm update`
- [ ] Security audit clean: `npm audit`
- [ ] API keys stored in secrets manager
- [ ] HTTPS enabled
- [ ] Security headers configured (Helmet.js)
- [ ] Input validation implemented
- [ ] SQL injection prevention (if using database)
- [ ] XSS protection enabled

### Performance

- [ ] Assets optimized (images, fonts)
- [ ] Code splitting implemented
- [ ] Lazy loading configured
- [ ] Caching strategy defined
- [ ] CDN configured for static assets
- [ ] Bundle size optimized
- [ ] Lighthouse score > 90

---

## Build Process

### Frontend Build

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run type-check

# Build for production
npm run build

# Preview build locally
npm run preview
```

**Output:** `dist/` directory with optimized static files

### Backend Build

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Run tests (if available)
npm test

# For Docker deployment, build image
docker build -t youtube-summarizer-api .
```

---

## Platform-Specific Guides

### Google Cloud Platform (GCP)

Complete Terraform-based deployment.

#### Prerequisites

- GCP account with billing enabled
- `gcloud` CLI installed
- Terraform installed
- Docker installed

#### Quick Deploy

```bash
# Navigate to infrastructure directory
cd infrastructure/gcp

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Edit with your values

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh deploy production
```

#### Manual Steps

1. **Initialize Terraform:**
   ```bash
   terraform init
   ```

2. **Configure Secrets:**
   ```bash
   # Set YouTube API key
   echo -n "YOUR_KEY" | gcloud secrets create youtube-api-key --data-file=-

   # Set OpenAI API key
   echo -n "YOUR_KEY" | gcloud secrets create openai-api-key --data-file=-
   ```

3. **Deploy Infrastructure:**
   ```bash
   terraform plan -var="environment=production"
   terraform apply
   ```

4. **Build and Push Docker Image:**
   ```bash
   # Configure Docker
   gcloud auth configure-docker us-central1-docker.pkg.dev

   # Build and push
   cd ../.. /server
   docker build -t us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api:latest .
   docker push us-central1-docker.pkg.dev/PROJECT_ID/youtube-summarizer/api:latest
   ```

5. **Deploy Frontend to Cloud Storage:**
   ```bash
   cd ..
   npm run build
   gsutil -m rsync -r -d dist/ gs://PROJECT_ID-youtube-summarizer-assets/
   ```

#### Access Your Deployment

```bash
# Get Cloud Run URL
terraform output api_url

# Get Static Site URL
terraform output static_bucket_url
```

**See:** [infrastructure/gcp/README.md](infrastructure/gcp/README.md) for detailed GCP guide

---

### Vercel (Frontend)

Deploy frontend to Vercel's edge network.

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Via GitHub Integration

1. **Connect Repository:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `youtube-video-summar`

2. **Configure Build:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   VITE_APP_NAME=YouTube Video Summarizer
   VITE_API_BASE_URL=https://your-backend-api.com/api
   VITE_OPENAI_API_KEY=your_key_here
   VITE_OPENAI_MODEL=gpt-4-turbo-preview
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Access via provided URL

#### Custom Domain

```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: www.yourdomain.com -> cname.vercel-dns.com
# Add A record: yourdomain.com -> 76.76.21.21
```

---

### Heroku (Backend)

Deploy backend API to Heroku.

#### Setup

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create youtube-summarizer-api

# Add Node.js buildpack
heroku buildpacks:set heroku/nodejs
```

#### Configure

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3001
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set ALLOWED_ORIGINS=https://your-frontend.com
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
```

#### Deploy

```bash
# From server directory
cd server

# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a youtube-summarizer-api

# Deploy
git push heroku main

# Open app
heroku open

# View logs
heroku logs --tail
```

#### Procfile

Create `server/Procfile`:
```
web: node src/index.js
```

---

### AWS

Deploy using AWS services.

#### Frontend - S3 + CloudFront

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://youtube-summarizer-app

# Configure for static website
aws s3 website s3://youtube-summarizer-app \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync dist/ s3://youtube-summarizer-app

# Create CloudFront distribution (recommended for HTTPS)
aws cloudfront create-distribution \
  --origin-domain-name youtube-summarizer-app.s3.amazonaws.com
```

#### Backend - Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd server
eb init

# Create environment
eb create youtube-summarizer-prod

# Set environment variables
eb setenv NODE_ENV=production \
  OPENAI_API_KEY=your_key_here \
  ALLOWED_ORIGINS=https://your-domain.com

# Deploy
eb deploy

# Open app
eb open
```

---

### Docker

Deploy using Docker and Docker Compose.

#### Build Images

```bash
# Backend
cd server
docker build -t youtube-summarizer-api:latest .

# Frontend (create Dockerfile)
cd ..
docker build -f Dockerfile.frontend -t youtube-summarizer-frontend:latest .
```

#### Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: youtube-summarizer-api:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ALLOWED_ORIGINS=https://your-domain.com
    restart: unless-stopped

  frontend:
    image: youtube-summarizer-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### Deploy

```bash
# Load environment variables
export OPENAI_API_KEY=your_key_here

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Environment Configuration

### Production Environment Variables

#### Frontend (.env.production)

```dotenv
VITE_APP_NAME=YouTube Video Summarizer
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_OPENAI_API_KEY=  # Leave empty - use backend
VITE_OPENAI_MODEL=gpt-4-turbo-preview
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Backend (.env.production)

```dotenv
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
YOUTUBE_API_KEY=your_youtube_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Post-Deployment

### Verification Checklist

- [ ] Health endpoint responds: `curl https://api.yourdomain.com/health`
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] CORS configured properly
- [ ] HTTPS working
- [ ] Rate limiting active
- [ ] Error pages display correctly
- [ ] Analytics tracking (if enabled)
- [ ] Performance acceptable (Lighthouse score)

### DNS Configuration

```
# Example DNS records
yourdomain.com.        A      76.76.21.21
www.yourdomain.com.    CNAME  cname.vercel-dns.com
api.yourdomain.com.    CNAME  youtube-summarizer-api.run.app
```

### SSL/TLS Setup

Most platforms (Vercel, Heroku, GCP Cloud Run) provide automatic SSL certificates.

For custom setups:
```bash
# Using Let's Encrypt with Certbot
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Monitoring and Maintenance

### Monitoring Setup

#### Google Cloud Monitoring

```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime create my-uptime-check \
  --host=api.yourdomain.com \
  --path=/health \
  --port=443
```

#### Application Monitoring

**Install Sentry (Error Tracking):**

```bash
npm install @sentry/react @sentry/node
```

**Configure:**

```javascript
// Frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});

// Backend
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### Health Checks

```bash
# API health
curl https://api.yourdomain.com/health

# Frontend health
curl -I https://yourdomain.com
```

### Logging

```bash
# GCP Cloud Run
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Heroku
heroku logs --tail --app youtube-summarizer-api

# Docker
docker logs -f container_name
```

### Backup Strategy

```bash
# Backup environment configuration
# Store .env files securely (encrypted)

# Backup database (if added later)
# Implement regular automated backups

# Backup codebase
# Ensure GitHub repository is up to date
```

### Update Process

```bash
# 1. Test locally
npm test
npm run build

# 2. Deploy to staging (if available)
# Test all functionality

# 3. Deploy to production
# Use platform-specific deployment commands

# 4. Verify deployment
curl https://api.yourdomain.com/health

# 5. Monitor for errors
# Check logs and error tracking
```

---

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Heroku

```bash
# List releases
heroku releases

# Rollback to previous release
heroku rollback
```

### GCP Cloud Run

```bash
# List revisions
gcloud run revisions list --service=youtube-summarizer-api

# Rollback to specific revision
gcloud run services update-traffic youtube-summarizer-api \
  --to-revisions=revision-name=100
```

---

## Cost Optimization

### Tips

1. **Use appropriate instance sizes**
2. **Enable autoscaling with min=0 for dev**
3. **Implement caching**
4. **Use CDN for static assets**
5. **Monitor API usage**
6. **Set budget alerts**
7. **Review and remove unused resources**

### Estimated Costs (Monthly)

| Platform | Service | Estimated Cost |
|----------|---------|----------------|
| GCP | Cloud Run (minimal traffic) | $5-20 |
| GCP | Cloud Storage | $1-5 |
| Vercel | Hobby (personal) | Free |
| Vercel | Pro | $20 |
| Heroku | Eco Dynos | $5 |
| OpenAI | API usage | Variable |

---

## Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check Node.js version
   - Clear cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **API Not Accessible:**
   - Check firewall rules
   - Verify CORS settings
   - Check environment variables

3. **High Latency:**
   - Enable CDN
   - Optimize database queries
   - Implement caching
   - Use connection pooling

4. **Rate Limiting Issues:**
   - Adjust limits in .env
   - Implement request queuing
   - Use caching to reduce requests

---

## Support

For deployment assistance:
- GitHub Issues: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues
- Email: aiempowerhq@gmail.com

---

## Additional Resources

- [Setup Guide](SETUP_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [GCP Infrastructure Guide](infrastructure/gcp/README.md)
- [Testing Guide](TESTING_GUIDE.md)

---

## License

See [LICENSE](LICENSE) file for details.

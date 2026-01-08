# YouTube Video Summarizer - Complete Setup Guide

This comprehensive guide will walk you through setting up the entire YouTube Video Summarizer application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Frontend Setup](#frontend-setup)
5. [Backend Setup](#backend-setup)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | v18.0.0+ | Runtime environment |
| npm | v9.0.0+ | Package manager |
| Git | v2.30.0+ | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| Docker | Containerization |
| Terraform | Infrastructure as Code |
| gcloud CLI | GCP deployment |

### API Keys Required

1. **OpenAI API Key** (Required for AI features)
   - Sign up at: https://platform.openai.com/
   - Navigate to: https://platform.openai.com/api-keys
   - Create new key and save securely

2. **YouTube API Key** (Optional - for enhanced features)
   - Go to: https://console.cloud.google.com/
   - Create project and enable YouTube Data API v3
   - Create credentials (API Key)

3. **GitHub Token** (Optional - for GitHub features)
   - Navigate to: https://github.com/settings/tokens
   - Generate new token (classic) with repo permissions

## Project Structure

```
youtube-video-summar/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── services/                # API service layer
│   ├── types/                   # TypeScript definitions
│   └── test/                    # Frontend tests
├── server/                       # Backend source code
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utilities
│   ├── Dockerfile               # Docker configuration
│   └── .env.example             # Environment template
├── infrastructure/              # Infrastructure configs
│   └── gcp/                     # Google Cloud Platform
│       ├── main.tf              # Terraform main config
│       ├── variables.tf         # Terraform variables
│       └── deploy.sh            # Deployment script
└── docs/                        # Documentation

```

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git
cd youtube-video-summar
```

### 2. Frontend Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

#### Frontend `.env.local` Configuration

```dotenv
# Application Settings
VITE_APP_NAME=YouTube Video Summarizer
VITE_APP_VERSION=1.0.0

# Backend API
VITE_API_BASE_URL=http://localhost:3001/api

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-4-turbo-preview

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### 3. Backend Environment Configuration

```bash
# Navigate to server directory
cd server

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

#### Backend `.env` Configuration

```dotenv
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# API Keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
YOUTUBE_API_KEY=your_youtube_api_key_here
GITHUB_TOKEN=your_github_token_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Verify Installation

```bash
# Check for vulnerabilities
npm audit

# Update if needed
npm update
```

### 3. Development Build

```bash
# Start development server with hot reload
npm run dev

# Server will run at: http://localhost:5173
```

### 4. Production Build

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Backend Setup

### 1. Install Dependencies

```bash
# Navigate to server directory
cd server

# Install packages
npm install
```

### 2. Verify Installation

```bash
# Check installed packages
npm list --depth=0

# Run audit
npm audit fix
```

### 3. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Server will run at: http://localhost:3001
```

### 4. Start Production Server

```bash
# Production mode
npm start
```

## Running the Application

### Development Mode (Recommended for Development)

#### Option 1: Two Terminals

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Using Docker Compose (Coming Soon)

```bash
docker-compose up
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| Backend API | http://localhost:3001 | API endpoints |
| API Docs | http://localhost:3001/api/docs | API documentation |
| Health Check | http://localhost:3001/health | Server status |

## Testing

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/utils/__tests__/validators.test.ts
```

### Backend Tests

```bash
cd server

# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] YouTube URL input accepts valid URLs
- [ ] Video information displays correctly
- [ ] Summary generation works
- [ ] Key points extraction works
- [ ] Error messages display appropriately
- [ ] Rate limiting functions properly
- [ ] API responses are properly formatted

## Deployment

### Local Production Build

```bash
# Build frontend
npm run build

# Build backend (if using Docker)
cd server
docker build -t youtube-summarizer-api .
```

### Deploy to GCP (Google Cloud Platform)

```bash
# Navigate to infrastructure directory
cd infrastructure/gcp

# Configure GCP project
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project details

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh deploy production
```

### Deploy to Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Heroku (Backend)

```bash
# Login to Heroku
heroku login

# Create new app
heroku create youtube-summarizer-api

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

#### 2. Module Not Found

**Problem:** `Error: Cannot find module '...'`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if issue persists
npm cache clean --force
```

#### 3. CORS Errors

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Check `ALLOWED_ORIGINS` in server `.env`
- Ensure frontend URL is included in allowed origins
- Restart backend server after changes

#### 4. API Key Issues

**Problem:** `401 Unauthorized` or `Invalid API Key`

**Solution:**
- Verify API key is correctly set in `.env`
- Check for extra spaces or quotes around key
- Ensure `.env` file is in correct directory
- Restart server after changing `.env`

#### 5. Build Failures

**Problem:** `Build failed with errors`

**Solution:**
```bash
# Check TypeScript errors
npm run type-check

# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### Getting Help

1. **Check Documentation:**
   - [README.md](README.md) - Project overview
   - [PRD.md](PRD.md) - Product requirements
   - [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing guide

2. **Check Logs:**
   ```bash
   # Frontend (browser console)
   # Press F12 in browser

   # Backend
   # Check terminal output where server is running
   ```

3. **GitHub Issues:**
   - Search existing issues: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues
   - Create new issue if needed

4. **Community:**
   - Check project discussions
   - Review pull requests for similar fixes

## Next Steps

After completing setup:

1. **Explore the Application:**
   - Test with different YouTube videos
   - Try various video lengths and topics
   - Explore all features

2. **Read Documentation:**
   - Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
   - Check [ENVIRONMENT.md](ENVIRONMENT.md)
   - Explore [infrastructure/gcp/README.md](infrastructure/gcp/README.md)

3. **Contribute:**
   - Check open issues
   - Submit bug reports
   - Propose new features

4. **Customize:**
   - Modify AI prompts in service files
   - Customize UI components
   - Add new features

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting in production
- [ ] Use HTTPS in production
- [ ] Regularly update dependencies
- [ ] Review security audits: `npm audit`
- [ ] Implement proper authentication (if needed)
- [ ] Monitor API usage and costs

## Performance Optimization

- [ ] Enable caching for API responses
- [ ] Optimize images and assets
- [ ] Minimize bundle size
- [ ] Use code splitting
- [ ] Implement lazy loading
- [ ] Monitor with Lighthouse
- [ ] Set up CDN for static assets

## Monitoring and Maintenance

### Development
- Monitor console for errors
- Check network tab for API calls
- Use React DevTools for component debugging

### Production
- Set up error tracking (e.g., Sentry)
- Monitor API usage and costs
- Set up uptime monitoring
- Review logs regularly
- Monitor performance metrics

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Email: aiempowerhq@gmail.com
- GitHub: https://github.com/AI-Empower-HQ-360/youtube-video-summar
- Issues: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues

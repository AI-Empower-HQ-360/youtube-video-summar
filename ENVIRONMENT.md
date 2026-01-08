# Environment Configuration Guide

## Overview

This project uses environment variables to configure different aspects of the application across various deployment environments (development, staging, production, testing).

## Environment Files

| File | Purpose | Committed to Git |
|------|---------|------------------|
| `.env.example` | Template showing all available variables | ✅ Yes |
| `.env.development` | Development environment defaults | ✅ Yes |
| `.env.staging` | Staging environment configuration | ✅ Yes |
| `.env.production` | Production environment configuration | ✅ Yes |
| `.env.test` | Test environment configuration | ✅ Yes |
| `.env.local` | Local overrides (your personal config) | ❌ No |
| `.env` | Generic environment file | ❌ No |

## Quick Start

### 1. Create Local Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### 2. Fill in Required Values

At minimum, set these variables:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

```bash
# Development mode (uses .env.development + .env.local)
npm run dev

# Production build (uses .env.production + .env.local)
npm run build

# Preview production build
npm run preview
```

## Available Environment Variables

### Application Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_APP_NAME` | Application name | YouTube Video Summarizer | ❌ |
| `VITE_APP_VERSION` | Application version | 1.0.0 | ❌ |
| `VITE_APP_DESCRIPTION` | Application description | - | ❌ |

### API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:3001/api | ✅ |
| `VITE_API_TIMEOUT` | API request timeout (ms) | 30000 | ❌ |

### AI Services

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_OPENAI_API_KEY` | OpenAI API key | - | ✅ (for AI features) |
| `VITE_OPENAI_MODEL` | OpenAI model to use | gpt-4-turbo-preview | ❌ |

### GitHub Integration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token | - | ❌ |

### Feature Flags

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | false | ❌ |
| `VITE_ENABLE_DEBUG` | Enable debug mode | false | ❌ |
| `VITE_ENABLE_OFFLINE_MODE` | Enable offline capabilities | false | ❌ |
| `VITE_ENABLE_EXPERIMENTAL_FEATURES` | Enable experimental features | false | ❌ |

### Analytics

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | - | ❌ |
| `VITE_POSTHOG_KEY` | PostHog API key | - | ❌ |

### Storage

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_STORAGE_PREFIX` | LocalStorage key prefix | youtube_summarizer_ | ❌ |

### Security

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_HTTPS` | Use HTTPS in development | false | ❌ |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | - | ❌ |

### Development

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_SHOW_ERROR_DETAILS` | Show detailed error messages | true | ❌ |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | false | ❌ |

### Payments

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - | ❌ |

## Environment-Specific Configuration

### Development

**File:** `.env.development`

- Debug mode enabled
- Detailed error messages
- Mock data allowed
- All experimental features enabled

```bash
npm run dev
```

### Staging

**File:** `.env.staging`

- Analytics enabled
- Debug mode enabled
- Production-like data
- Testing experimental features

```bash
npm run build -- --mode staging
npm run preview
```

### Production

**File:** `.env.production`

- Analytics enabled
- Debug mode disabled
- Live data only
- Stable features only

```bash
npm run build
npm run preview
```

### Testing

**File:** `.env.test`

- Mock services
- Test data only
- Fast timeouts
- All features enabled for testing

```bash
npm test
```

## Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add to `.env.local`:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```

### GitHub Token

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select required scopes (repo, read:user)
4. Generate and copy the token
5. Add to `.env.local`:
   ```env
   VITE_GITHUB_TOKEN=ghp_...
   ```

## Usage in Code

### Accessing Environment Variables

```typescript
import env from '@/config/env'

// Use environment variables
console.log(env.API_BASE_URL)
console.log(env.OPENAI_MODEL)

// Check environment
if (env.IS_DEV) {
  console.log('Running in development mode')
}

// Use feature flags
if (env.ENABLE_DEBUG) {
  console.debug('Debug information')
}
```

### Validation

```typescript
import { validateEnv } from '@/config/env'

// Validate environment on app start
validateEnv()
```

### Helper Functions

```typescript
import { 
  getEnvironmentName, 
  isDevelopment, 
  isProduction,
  logEnvironmentInfo 
} from '@/config/env'

// Get environment name
console.log(getEnvironmentName()) // "Development" | "Staging" | "Production"

// Check environment
if (isDevelopment()) {
  // Development-only code
}

// Log environment info (respects debug flag)
logEnvironmentInfo()
```

## Environment Loading Order

Vite loads environment files in this order (later files override earlier):

1. `.env` - Loaded in all environments
2. `.env.local` - Loaded in all environments, ignored by git
3. `.env.[mode]` - Loaded based on mode (development/staging/production)
4. `.env.[mode].local` - Local overrides, ignored by git

## Security Best Practices

### ✅ DO

- Store secrets in `.env.local` (not committed)
- Use different keys for each environment
- Rotate API keys regularly
- Use environment-specific keys
- Validate required variables on startup
- Document all environment variables

### ❌ DON'T

- Commit `.env.local` or `.env` to git
- Share API keys in public repositories
- Use production keys in development
- Hardcode sensitive values in code
- Expose API keys in client-side code
- Use same keys across environments

## CI/CD Configuration

### GitHub Actions

Set environment secrets in repository settings:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VITE_OPENAI_API_KEY`
   - `VITE_GITHUB_TOKEN`
   - etc.

### Example GitHub Actions Workflow

```yaml
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      
      - name: Create .env file
        run: |
          echo "VITE_API_BASE_URL=${{ secrets.API_BASE_URL }}" >> .env.production
          echo "VITE_OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}" >> .env.production
      
      - name: Build
        run: npm run build
```

## Troubleshooting

### Variables Not Loading

1. Check file naming (must start with `.env`)
2. Ensure variables start with `VITE_`
3. Restart dev server after changes
4. Check `.gitignore` doesn't exclude your files

### CORS Errors

Update `VITE_API_BASE_URL` to match your backend URL:

```env
# Development
VITE_API_BASE_URL=http://localhost:3001/api

# Production
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Missing API Keys

Check if required keys are set:

```bash
# Print environment variables (be careful not to expose secrets)
npm run dev -- --debug
```

## Examples

### Local Development Setup

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3001/api
VITE_OPENAI_API_KEY=sk-test-123...
VITE_GITHUB_TOKEN=ghp_test123...
VITE_ENABLE_DEBUG=true
VITE_ENABLE_EXPERIMENTAL_FEATURES=true
```

### Production Deployment

```env
# .env.production (set in hosting platform)
VITE_API_BASE_URL=https://api.example.com/api
VITE_OPENAI_API_KEY=sk-prod-xyz...
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://...
```

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

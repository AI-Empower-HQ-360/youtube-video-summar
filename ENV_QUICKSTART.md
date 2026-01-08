# Environment Quick Reference

## 🚀 Quick Start

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Add your API keys
nano .env.local

# 3. Run development server
npm run dev
```

## 📁 Environment Files

- **`.env.example`** - Template (commit to git)
- **`.env.local`** - Your local config (never commit)
- **`.env.development`** - Dev defaults
- **`.env.staging`** - Staging config
- **`.env.production`** - Production config
- **`.env.test`** - Test config

## 🔑 Required Variables

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_OPENAI_API_KEY=sk-...
```

## 📜 Available Scripts

```bash
# Development
npm run dev                 # Development mode
npm run dev:staging         # Staging mode
npm run dev:prod           # Production mode

# Build
npm run build              # Production build
npm run build:staging      # Staging build
npm run build:prod         # Production build (explicit)

# Preview
npm run preview            # Preview production build
npm run preview:staging    # Preview staging build
npm run preview:prod       # Preview production build

# Environment utilities
npm run env:validate       # Validate environment
npm run env:info          # Display environment info
```

## 🎯 Common Use Cases

### Local Development
```bash
npm run dev
```

### Test Production Build Locally
```bash
npm run build
npm run preview
```

### Deploy to Staging
```bash
npm run build:staging
# Upload dist/ to staging server
```

### Deploy to Production
```bash
npm run build:prod
# Upload dist/ to production server
```

## 🔧 Usage in Code

```typescript
import env from '@/config/env'

// Access variables
console.log(env.API_BASE_URL)
console.log(env.OPENAI_MODEL)

// Check environment
if (env.IS_DEV) {
  // Development only
}

// Feature flags
if (env.ENABLE_DEBUG) {
  console.debug('Debug mode')
}
```

## 📚 Full Documentation

See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete documentation.

## 🆘 Troubleshooting

**Variables not loading?**
- Restart dev server after changing `.env` files
- Ensure variables start with `VITE_`
- Check file is named correctly (`.env.local`)

**API not connecting?**
- Check `VITE_API_BASE_URL` is correct
- Ensure backend server is running
- Check for CORS issues

**Missing API keys?**
- Copy `.env.example` to `.env.local`
- Fill in actual API keys
- Never commit `.env.local`

## 🔒 Security Reminders

- ✅ Use `.env.local` for secrets
- ✅ Different keys per environment
- ❌ Never commit API keys
- ❌ Don't use production keys in dev

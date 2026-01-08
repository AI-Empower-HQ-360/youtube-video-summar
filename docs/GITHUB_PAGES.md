# GitHub Pages Deployment Guide

## 🌐 Live Demo
**URL:** https://youtube-video-summar--ai-empower-hq-360.github.app/

## 📋 Prerequisites

1. GitHub repository with Pages enabled
2. GitHub Actions enabled
3. Proper branch protection rules configured

## 🚀 Automatic Deployment

This site automatically deploys to GitHub Pages on every push to `main` branch.

### Workflow File
`.github/workflows/deploy.yml`

### Build Process
1. Install dependencies
2. Build production bundle with Vite
3. Upload artifact to GitHub Pages
4. Deploy to GitHub Pages environment

## 🔧 Configuration

### Base Path
The app is configured with base path `/youtube-video-summar/` in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/youtube-video-summar/',
  // ...
});
```

### Environment Variables
GitHub Pages uses `.env.production` for environment configuration.

**Important:** API keys should NOT be exposed in client-side code. For production:
- Use backend API for sensitive operations
- Keep API keys on server side
- Use environment variables in GitHub Actions secrets

## 📁 Important Files

- `public/.nojekyll` - Prevents Jekyll processing
- `public/404.html` - Custom 404 page with SPA routing
- `public/CNAME` - Custom domain configuration (optional)

## 🔒 GitHub Pages Settings

### Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Source: **GitHub Actions**
3. No need to select a branch manually

### Branch Protection (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass
   - Require pull request reviews
   - Restrict who can push

## 🎯 Custom Domain (Optional)

### Setup Steps
1. Purchase a domain
2. Add DNS records:
   ```
   Type  Name  Value
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   ai-empower-hq-360.github.io
   ```
3. Update `public/CNAME` with your domain:
   ```
   yourdomain.com
   ```
4. In GitHub Settings → Pages, add custom domain
5. Enable "Enforce HTTPS"

## 🧪 Test Deployment Locally

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Open browser to http://localhost:4173/youtube-video-summar/
```

## 🐛 Troubleshooting

### Deployment Fails
- Check GitHub Actions logs
- Ensure all actions are pinned to commit SHA
- Verify Pages is enabled in repo settings

### 404 Errors
- Ensure `base` path in `vite.config.ts` matches repo name
- Check `.nojekyll` file exists in `public/`
- Verify `404.html` has correct redirect path

### Assets Not Loading
- Check browser console for CORS errors
- Verify base path is correct
- Check that assets are in `dist/` folder after build

### White Screen
- Check browser console for errors
- Verify all environment variables are set
- Test build locally with `npm run preview`

## 📊 Monitoring

### GitHub Actions
View deployment status: https://github.com/AI-Empower-HQ-360/youtube-video-summar/actions

### Performance
Use Lighthouse in Chrome DevTools:
1. Open deployed site
2. Press F12 → Lighthouse tab
3. Generate report

Target metrics:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 🔄 Manual Deployment

If needed, deploy manually:

```bash
# Build
npm run build

# Deploy using gh-pages package
npm run deploy
```

Or using GitHub CLI:

```bash
# Trigger workflow manually
gh workflow run deploy.yml
```

## 📝 Updating Content

### Update App
1. Make changes in `src/`
2. Commit and push to `main`
3. GitHub Actions will automatically deploy

### Update Environment
1. Edit `.env.production`
2. For secrets, use GitHub repository secrets
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## 🌟 Production Checklist

Before going live:
- [ ] Test all features
- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test on different browsers
- [ ] Check SEO meta tags
- [ ] Verify analytics (if enabled)
- [ ] Test 404 page
- [ ] Check HTTPS
- [ ] Review security headers

## 📞 Support

Issues with deployment?
1. Check [GitHub Pages documentation](https://docs.github.com/pages)
2. Review [workflow logs](https://github.com/AI-Empower-HQ-360/youtube-video-summar/actions)
3. Check [main README](../README.md)
4. Contact: aiempowerhq@gmail.com

---

**Last Updated:** January 8, 2026  
**Status:** ✅ Active

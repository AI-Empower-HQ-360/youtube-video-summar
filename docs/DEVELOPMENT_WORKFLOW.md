# Development Workflow Guide

Complete guide to developing features, managing issues, and working with the VidNote automation system.

## 🚀 Quick Start Workflow

### 1. Setup Your Environment

```bash
# Clone repository
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git
cd youtube-video-summar

# Run setup script
./setup.sh

# Start development servers
./start.sh
```

### 2. Create an Issue

```bash
# Via GitHub CLI
gh issue create \
  --title "Add dark mode support" \
  --body "Implement dark mode toggle for better UX" \
  --label "type: feature,priority: high"

# Or via GitHub UI
# https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues/new
```

### 3. Start Development

```bash
# Add 'ready' label to auto-create branch
gh issue edit 17 --add-label "ready"

# Or manually create branch
git checkout -b feature/17-add-dark-mode

# Make changes
# ... code here ...

# Commit with conventional commits
git add .
git commit -m "feat: add dark mode toggle component"
git push
```

### 4. Auto-PR Creation

When you push to a feature branch, a PR is automatically created with:
- ✅ Linked to issue
- ✅ Auto-assigned to you
- ✅ Smart labels applied
- ✅ Automated analysis

### 5. Review & Merge

```bash
# Enable auto-merge (optional)
gh pr edit --add-label "auto-merge"

# Or manually merge after review
gh pr merge --squash
```

## 📋 Automated Workflows

### Issue Workflow

```mermaid
Issue Created
    ↓
Auto-assigned to Creator
    ↓
Auto-added to Project (Todo)
    ↓
'ready' label added
    ↓
Branch Auto-created
    ↓
Issue moved to "In Progress"
```

### PR Workflow

```mermaid
Code Pushed to Feature Branch
    ↓
PR Auto-created
    ↓
Auto-assigned + Labeled
    ↓
Automated Analysis Comment
    ↓
CI Checks Run
    ↓
'auto-merge' label? → Auto-merge when pass
    ↓
Branch Auto-deleted
    ↓
Issue Auto-closed
    ↓
Project moved to "Done"
```

## 🏷️ Labeling System

### Priority Labels
Use these to set priority in GitHub Project:

| Label | Project Priority | Use When |
|-------|-----------------|----------|
| `priority: high` | ⬆️ High | Critical features, major bugs |
| `priority: medium` | ➡️ Medium | Regular features, minor bugs |
| `priority: low` | ⬇️ Low | Nice-to-have, minor improvements |

### Type Labels
Categorize the nature of work:

| Label | Use When |
|-------|----------|
| `type: feature` | Adding new functionality |
| `type: bug` | Fixing broken behavior |
| `type: enhancement` | Improving existing features |

### Size Labels
Auto-applied based on PR changes:

| Label | Lines Changed |
|-------|---------------|
| `size: small` | < 100 lines |
| `size: medium` | 100-500 lines |
| `size: large` | > 500 lines |

### Automation Labels

| Label | Effect |
|-------|--------|
| `ready` | Auto-creates branch from issue |
| `auto-merge` | Auto-merges PR when checks pass |
| `dependencies` | Marks dependency updates (Dependabot) |

## 🌿 Branch Naming Convention

Branches are auto-created using this format:

```
{prefix}/{issue-number}-{title-slug}
```

### Prefixes

| Prefix | Use When | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/17-add-dark-mode` |
| `fix/` | Bug fixes | `fix/18-mobile-layout-bug` |
| `hotfix/` | Critical bugs | `hotfix/19-security-patch` |

### Manual Branch Creation

```bash
# Feature branch
git checkout -b feature/20-user-authentication

# Bug fix branch
git checkout -b fix/21-video-loading-error

# Hotfix branch
git checkout -b hotfix/22-api-timeout
```

## 💬 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add dark mode toggle` |
| `fix` | Bug fix | `fix: resolve mobile layout issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Code style changes | `style: format with prettier` |
| `refactor` | Code refactoring | `refactor: optimize summary service` |
| `test` | Add/update tests | `test: add unit tests for API` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize video loading` |
| `ci` | CI/CD changes | `ci: update deployment workflow` |

### Examples

```bash
# Simple feature
git commit -m "feat: add video thumbnail preview"

# Bug fix with scope
git commit -m "fix(api): handle timeout errors gracefully"

# Feature with body
git commit -m "feat: implement user authentication

- Add login/signup forms
- Integrate JWT tokens
- Add protected routes
- Update user context

Closes #17"

# Breaking change
git commit -m "feat!: redesign API response format

BREAKING CHANGE: API now returns { data, error } instead of direct response"
```

## 🔄 Development Cycle

### Complete Feature Development Example

```bash
# 1. Create Issue
gh issue create \
  --title "Add video download feature" \
  --body "Users should be able to download video summaries as PDF" \
  --label "type: feature,priority: medium,ready"
# → Issue #23 created
# → Branch feature/23-add-video-download created

# 2. Checkout Branch
git fetch origin
git checkout feature/23-add-video-download

# 3. Develop Feature
# Create component
cat > src/components/features/DownloadButton.tsx << 'EOF'
export const DownloadButton = () => {
  // Component code
}
EOF

# Add service method
cat >> src/services/download.service.ts << 'EOF'
export const downloadPDF = async (summary) => {
  // Download logic
}
EOF

# 4. Test Locally
npm test
npm run lint

# 5. Commit Changes
git add .
git commit -m "feat: add PDF download functionality

- Create DownloadButton component
- Implement PDF generation service
- Add download icon to summary display
- Update tests

Closes #23"

# 6. Push (auto-creates PR)
git push
# → PR #24 auto-created
# → Auto-assigned to you
# → Labels applied: type: feature, size: medium

# 7. Check PR
gh pr view 24
# Review automated analysis

# 8. Enable Auto-merge
gh pr edit 24 --add-label "auto-merge"

# 9. Wait for CI
# → Tests pass
# → PR auto-merged
# → Branch auto-deleted
# → Issue #23 auto-closed
# → Project updated to "Done"

# Done! 🎉
```

## 🧪 Testing Workflow

### Before Committing

```bash
# Run unit tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### Before Merging

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Check coverage
npm run test:coverage

# Build production
npm run build
```

### Continuous Integration

All PRs automatically run:
- ✅ Frontend CI (unit tests, linting, build)
- ✅ Backend CI (API tests, linting)
- ✅ E2E tests (Playwright)
- ✅ Code quality checks (Snyk, ESLint)
- ✅ Docker builds

## 🔍 Code Review Process

### Automated Review

Every PR gets an automated analysis comment with:
- Files changed count
- Lines added/deleted
- Test coverage status
- Documentation status
- Size classification
- Recommendations

### Manual Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Error handling is proper
- [ ] Performance is acceptable
- [ ] Security best practices followed
- [ ] Breaking changes documented

## 🚨 Handling Issues

### Bug Reports

```bash
# Create bug report
gh issue create \
  --title "Video loading fails on mobile" \
  --body "**Steps to Reproduce:**
1. Open app on mobile
2. Enter YouTube URL
3. Click submit

**Expected:** Video loads
**Actual:** Error message shown

**Environment:**
- Device: iPhone 12
- Browser: Safari 15
- OS: iOS 15" \
  --label "type: bug,priority: high"
```

### Feature Requests

```bash
gh issue create \
  --title "Add video bookmarking" \
  --body "**Feature Description:**
Allow users to bookmark videos for later

**Use Case:**
Save interesting videos to watch later

**Acceptance Criteria:**
- Bookmark button on video card
- Bookmarks page to view saved videos
- Remove bookmark functionality" \
  --label "type: feature,priority: medium"
```

## 📊 Project Board Usage

Issues automatically move through project stages:

### Statuses

| Status | When | Trigger |
|--------|------|---------|
| 📝 Todo | Issue created | Auto |
| ⏳ In Progress | Issue assigned or branch created | Auto |
| ✅ Done | Issue closed or PR merged | Auto |

### Priority Field

Auto-set based on labels:
- `priority: high` → ⬆️ High
- `priority: medium` → ➡️ Medium
- `priority: low` → ⬇️ Low

## 🛠️ Troubleshooting

### PR Not Auto-Created

Check:
1. Branch name format (not `main` or `develop`)
2. Push was successful
3. Workflow permissions in repo settings

### Auto-Merge Not Working

Check:
1. `auto-merge` label is applied
2. All CI checks are passing
3. PR is not in draft mode
4. Branch is up to date with main

### Branch Not Auto-Created

Check:
1. `ready` label is applied to issue
2. Issue title is valid (no special characters causing issues)
3. Workflow has proper permissions

## 📚 Additional Resources

- [Contributing Guide](../CONTRIBUTING.md)
- [Automation System](../.github/AUTOMATION.md)
- [Testing Guide](TESTING_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

## 🎯 Best Practices

### DO ✅
- Use descriptive commit messages
- Write tests for new features
- Update documentation
- Keep PRs focused and small
- Use `auto-merge` for routine updates
- Add appropriate labels
- Link issues in PR descriptions

### DON'T ❌
- Commit directly to main
- Skip tests
- Leave commented code
- Merge without CI passing
- Create PRs without descriptions
- Mix unrelated changes
- Push sensitive data

---

**Last Updated**: January 9, 2026  
**Questions?** Open an issue or discussion!

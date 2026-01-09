# 🤖 VidNote Automation System

Complete GitHub Actions automation for seamless development workflow.

## 📋 Features

### 🎯 Issue Management
- **Auto-assign issues** to creator when opened
- **Auto-add to project** when issue is created
- **Auto-create branch** when `ready` label is added
- **Auto-update project status** based on issue state

### 🔀 Pull Request Automation
- **Auto-create PR** when pushing to feature branches
- **Smart PR analysis** with automated comments
- **Auto-merge** when checks pass (with `auto-merge` label)
- **Auto-assign** PR to creator
- **Auto-label** based on changes (size, type)
- **Auto-delete branch** after merge

### 📊 Project Sync
- **Auto-update status** (Todo → In Progress → Done)
- **Auto-set priority** based on labels
- **Real-time sync** with GitHub Project

## 🚀 Usage Guide

### Creating a New Feature

1. **Create an issue:**
   ```bash
   gh issue create --title "Add dark mode" --label "type: feature,priority: high"
   ```

2. **Start work:**
   - Add the `ready` label → Branch auto-created
   - OR manually: `git checkout -b feature/16-add-dark-mode`

3. **Make commits:**
   ```bash
   git add .
   git commit -m "feat: implement dark mode toggle"
   git push origin feature/16-add-dark-mode
   ```

4. **PR auto-created with:**
   - Title: "Fix #16: Add Dark Mode"
   - Linked to issue
   - Auto-assigned to you
   - Smart labels applied

5. **Auto-merge:**
   - Add `auto-merge` label
   - When CI passes → Auto-merged!
   - Branch auto-deleted

### Quick Workflow

```bash
# 1. Create issue (via GitHub UI or gh cli)
gh issue create --title "Fix mobile layout" --label "type: bug,priority: high"

# 2. Label as ready (auto-creates branch)
gh issue edit 17 --add-label "ready"

# 3. Checkout and work
git fetch origin
git checkout fix/17-fix-mobile-layout

# 4. Commit and push (auto-creates PR)
git add .
git commit -m "fix: mobile responsive issues"
git push

# 5. Enable auto-merge
gh pr edit 18 --add-label "auto-merge"

# Done! 🎉 Everything else is automatic
```

## 🏷️ Smart Labels

### Priority Labels
- `priority: high` → 🔴 High priority (auto-set Priority field)
- `priority: medium` → 🟡 Medium priority
- `priority: low` → 🟢 Low priority

### Type Labels
- `type: feature` → New functionality
- `type: bug` → Bug fixes
- `type: enhancement` → Improvements

### Size Labels (Auto-applied)
- `size: small` → < 100 lines changed
- `size: medium` → 100-500 lines
- `size: large` → > 500 lines

### Automation Labels
- `ready` → Auto-create branch from issue
- `auto-merge` → Enable automatic merging
- `dependencies` → Dependabot PRs auto-merge

## 📊 Project Status Automation

Issues and PRs automatically move through project stages:

```
📝 Todo → ⏳ In Progress → ✅ Done
```

**Triggers:**
- **Opened/Created** → Todo
- **Assigned** → In Progress
- **Closed/Merged** → Done
- **Draft PR** → Todo
- **Ready for Review** → In Progress

## 🔧 Workflows

### 1. Auto Assign Issues (`auto-assign-issues.yml`)
- **Trigger:** Issue opened/labeled
- **Actions:**
  - Assign to creator
  - Add to project

### 2. Auto Create Branch (`auto-create-branch.yml`)
- **Trigger:** `ready` label added
- **Actions:**
  - Create feature/fix branch
  - Comment with checkout instructions

### 3. Auto Create PR (`auto-create-pr.yml`)
- **Trigger:** Push to non-main branch
- **Actions:**
  - Create PR with smart title
  - Link to issue (if branch has number)
  - Auto-assign creator
  - Apply type labels

### 4. Auto PR Review (`auto-pr-review.yml`)
- **Trigger:** PR opened/updated
- **Actions:**
  - Analyze changes
  - Post detailed comment
  - Add size labels
  - Checklist for reviewer

### 5. Auto Merge PR (`auto-merge-pr.yml`)
- **Trigger:** Checks complete
- **Conditions:**
  - Has `auto-merge` label OR is from bot
  - All checks passed
  - Has approval (for human PRs)
- **Actions:**
  - Squash merge
  - Delete branch

### 6. Sync Project Status (`sync-project-status.yml`)
- **Trigger:** Issue/PR state changes
- **Actions:**
  - Update Status field
  - Update Priority field

## 🔐 Required Secrets

Add this GitHub Personal Access Token to repository secrets:

```bash
# Name: PROJECT_TOKEN
# Scopes: repo, workflow, project
# Used by: sync-project-status.yml, auto-assign-issues.yml
```

### Creating the Token

1. Go to: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with scopes:
   - `repo` (Full control)
   - `workflow` (Update workflows)
   - `project` (Project access)
3. Copy token
4. Go to repository → Settings → Secrets and variables → Actions
5. New repository secret → Name: `PROJECT_TOKEN` → Paste token

## 📈 Benefits

✅ **Zero Manual Work** - Everything automated  
✅ **Fast Iteration** - From issue to merge in minutes  
✅ **Consistent Process** - No missed steps  
✅ **Better Organization** - Auto-labeled and tracked  
✅ **Reduced Errors** - Automated checks and reviews  
✅ **Real-time Sync** - Project always up-to-date  

## 🎯 Branch Naming Convention

Branches are auto-created with this format:

```
{prefix}/{issue-number}-{title}
```

**Prefixes:**
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - High priority bugs

**Examples:**
- `feature/9-multi-language-support`
- `fix/15-mobile-responsive-issues`
- `hotfix/20-critical-security-fix`

## 🔄 Workflow Examples

### Example 1: Feature Development

```bash
# Issue #9: Multi-language support
gh issue edit 9 --add-label "ready"
# → Branch created: feature/9-multi-language-support

git checkout feature/9-multi-language-support
# ... make changes ...
git commit -m "feat: add multi-language support"
git push
# → PR #21 auto-created, auto-assigned, linked to #9

gh pr edit 21 --add-label "auto-merge"
# → After CI passes: Auto-merged, branch deleted, issue closed
```

### Example 2: Bug Fix

```bash
# Issue #15: Mobile layout broken
gh issue create --title "Mobile layout broken" --label "type: bug,priority: high,ready"
# → Branch auto-created: fix/15-mobile-layout-broken

git fetch && git checkout fix/15-mobile-layout-broken
# ... fix the bug ...
git commit -m "fix: mobile responsive issues"
git push
# → PR auto-created with analysis

# Review the automated analysis, add auto-merge label
gh pr edit --add-label "auto-merge"
# → Auto-merged when CI passes
```

## 📝 Notes

- **Draft PRs** don't auto-merge (convert to ready when done)
- **Large PRs** (>500 lines) get flagged for review
- **Missing tests** are highlighted in automated comments
- **All workflows** use SHA-pinned actions for security

## 🛠️ Customization

Edit workflow files in `.github/workflows/` to customize:

- **Auto-merge conditions** → `auto-merge-pr.yml`
- **Label rules** → `auto-pr-review.yml`
- **Project field IDs** → `sync-project-status.yml`
- **Branch prefixes** → `auto-create-branch.yml`

## 🎉 Get Started

Everything is already set up! Just:

1. Create issues with labels
2. Add `ready` label when you want to start
3. Push code to auto-created branches
4. Add `auto-merge` label for automatic merging

The automation handles everything else! 🚀

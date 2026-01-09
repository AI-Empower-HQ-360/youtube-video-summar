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

## 📚 Documentation Updates

### Update Existing Documentation

All documentation supports easy updates via PRs using the same automation:

1. **Make changes to docs:**
   ```bash
   # Checkout a branch
   git checkout -b docs/update-api-guide
   
   # Edit documentation files
   vim docs/API_DOCUMENTATION.md
   
   # Commit with conventional commits
   git commit -m "docs: update API authentication section"
   git push
   ```

2. **Auto-PR created:**
   - PR automatically created
   - Labeled with `type: enhancement`
   - Assigned to you

3. **Enable auto-merge:**
   ```bash
   gh pr edit --add-label "auto-merge"
   ```

### Create New Documentation

When adding specialized guides:

1. **Create the document:**
   ```bash
   # Create new guide
   cat > docs/NEW_FEATURE_GUIDE.md << 'EOF'
   # New Feature Guide
   
   Complete guide for...
   EOF
   ```

2. **Update the index:**
   ```bash
   # Add to docs/README.md
   vim docs/README.md
   # Add link in appropriate section
   ```

3. **Commit and push:**
   ```bash
   git add docs/
   git commit -m "docs: add new feature implementation guide"
   git push
   ```

### Documentation Standards

#### File Structure
- Place general docs in `docs/` folder
- Place workflow-specific docs in `.github/`
- Use clear, descriptive filenames
- Follow existing naming conventions

#### Content Guidelines
- **Use clear headings** with emoji icons for visual hierarchy
- **Include code examples** for all procedures
- **Add cross-references** to related documents
- **Keep it updated** - docs should match current code
- **Test all commands** before documenting
- **Use tables** for structured information
- **Add navigation** with table of contents for long docs

#### Markdown Best Practices
```markdown
# Main Title (H1 - one per document)

## Section (H2)

### Subsection (H3)

- Bullet points for lists
- Use **bold** for emphasis
- Use `code` for commands/files
- Use ```bash for code blocks
```

#### Required Sections
Every major documentation file should include:

1. **Title and description**
2. **Table of contents** (for docs > 100 lines)
3. **Prerequisites** (if any)
4. **Step-by-step instructions**
5. **Examples**
6. **Troubleshooting** (if applicable)
7. **Related links**
8. **Last updated date**

### Documentation Workflow

#### Quick Update
```bash
# For small fixes
git checkout -b docs/fix-typo
# Make changes
git commit -m "docs: fix typo in setup guide"
git push
# Auto-PR, add auto-merge label
```

#### Major Documentation
```bash
# For new guides or major rewrites
gh issue create \
  --title "Add deployment troubleshooting guide" \
  --label "type: enhancement,priority: medium,ready"

# Branch auto-created, checkout and work
git fetch && git checkout docs/XX-deployment-troubleshooting

# Create comprehensive guide
vim docs/DEPLOYMENT_TROUBLESHOOTING.md

# Update index
vim docs/README.md

# Commit
git commit -m "docs: add comprehensive deployment troubleshooting guide

- Common deployment errors
- Step-by-step solutions
- Environment-specific issues
- Quick reference table

Closes #XX"

git push
# Auto-PR created, review, merge
```

### Documentation Templates

#### Feature Guide Template
```markdown
# Feature Name Guide

Brief description of the feature and why it exists.

## 📋 Overview

What this feature does and who should use it.

## 🚀 Quick Start

Minimal steps to get started:
1. Step one
2. Step two
3. Step three

## 📚 Detailed Guide

### Prerequisites
- Requirement 1
- Requirement 2

### Setup
Step-by-step setup instructions...

### Usage
How to use the feature...

### Examples
Real-world examples...

## 🔧 Configuration

Configuration options...

## 🐛 Troubleshooting

Common issues and solutions...

## 📖 Related Documentation

- [Link to related doc](path/to/doc.md)

---

**Last Updated**: YYYY-MM-DD
```

#### API Documentation Template
```markdown
# API Endpoint Name

## Endpoint
\`\`\`
METHOD /api/endpoint
\`\`\`

## Description
What this endpoint does.

## Request

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | Description |

### Example Request
\`\`\`bash
curl -X POST http://api.example.com/endpoint \\
  -H "Content-Type: application/json" \\
  -d '{"param1": "value"}'
\`\`\`

## Response

### Success Response
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": "Error message"
}
\`\`\`

## Error Codes
| Code | Message | Solution |
|------|---------|----------|
| 400 | Bad Request | Check parameters |
```

### Maintaining Documentation

#### Regular Updates
Set up quarterly reviews:

```bash
# Create maintenance issue
gh issue create \
  --title "Q1 2026 Documentation Review" \
  --body "Review and update all documentation:
- [ ] Check for outdated information
- [ ] Update screenshots
- [ ] Verify all links work
- [ ] Test all code examples
- [ ] Update version numbers
- [ ] Add new features
- [ ] Remove deprecated content" \
  --label "type: enhancement,priority: medium"
```

#### Documentation Checklist
Before merging documentation PRs:

- [ ] All links work
- [ ] Code examples tested
- [ ] Screenshots are current
- [ ] Index updated (if new doc)
- [ ] Cross-references added
- [ ] Spelling/grammar checked
- [ ] Follows markdown standards
- [ ] Mobile-friendly formatting
- [ ] Last updated date current

### Documentation Automation

The system automatically handles:

✅ **PR Creation** - Automatic for all doc branches  
✅ **Labeling** - Auto-labeled as `type: enhancement`  
✅ **Review Comments** - Automated analysis of changes  
✅ **Merging** - Auto-merge with `auto-merge` label  
✅ **Branch Cleanup** - Auto-delete after merge  

### Getting Help

Questions about documentation?

- **Check existing docs**: [docs/README.md](../docs/README.md)
- **Open an issue**: Tag with `type: documentation`
- **Ask in discussions**: GitHub Discussions
- **Review style guide**: This section!

---

**Documentation is code!** Keep it clean, tested, and up-to-date. 📚✨

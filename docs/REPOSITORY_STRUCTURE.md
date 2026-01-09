# Repository Structure

Complete guide to the VidNote repository organization and file structure.

## 📁 Root Directory

```
youtube-video-summar/
├── .github/              # GitHub configuration and workflows
├── coverage/            # Test coverage reports
├── docs/                # Documentation files
├── e2e/                 # End-to-end tests
├── infrastructure/      # Infrastructure as code
├── public/              # Static assets
├── server/              # Backend application
├── src/                 # Frontend application
├── test-results/        # Test execution results
└── [config files]       # Various configuration files
```

## 🔧 Configuration Files

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies and scripts |
| `vite.config.ts` | Vite build configuration |
| `vitest.config.ts` | Vitest test configuration |
| `playwright.config.ts` | Playwright E2E test config |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS configuration |
| `components.json` | Shadcn UI components config |
| `docker-compose.yml` | Docker services orchestration |
| `Dockerfile` | Frontend Docker image |
| `.env.example` | Environment variables template |

### Setup Scripts

| File | Purpose |
|------|---------|
| `setup.sh` | Initial project setup |
| `start.sh` | Start both frontend and backend |
| `deploy.sh` | Deployment automation |

## 🎯 Frontend Structure (`src/`)

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives (Shadcn)
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── config/             # Configuration files
│   └── env.ts          # Environment variables access
├── constants/          # Application constants
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
│   └── useAISummary.ts # Main summarization hook
├── lib/                # Utility libraries
│   ├── utils.ts        # General utilities
│   └── youtube.ts      # YouTube-specific utilities
├── services/           # API services
│   ├── api.service.ts  # Base API client
│   └── summary.api.ts  # Summary API endpoints
├── styles/             # Global styles
├── test/               # Test utilities
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
│   ├── formatters.ts   # Data formatters
│   └── validators.ts   # Input validators
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Component Organization

#### UI Components (`src/components/ui/`)
Shadcn-style reusable primitives:
- `button.tsx` - Button component
- `card.tsx` - Card layout
- `input.tsx` - Input fields
- `dialog.tsx` - Modal dialogs
- `toast.tsx` - Toast notifications
- And more...

#### Layout Components (`src/components/layout/`)
- `Header.tsx` - Application header
- `Footer.tsx` - Application footer
- `Navigation.tsx` - Navigation menu
- `Sidebar.tsx` - Side navigation

#### Feature Components (`src/components/features/`)
- `VideoInput.tsx` - Video URL input
- `SummaryDisplay.tsx` - Summary results
- `LanguageSelector.tsx` - Language picker
- `ErrorBoundary.tsx` - Error handling

### Key Files

#### `src/main.tsx`
Application entry point with:
- React StrictMode
- Router setup
- Global providers
- Analytics initialization

#### `src/App.tsx`
Main application component:
- Route configuration
- Layout structure
- Global state
- Error boundaries

#### `src/hooks/useAISummary.ts`
Core summarization logic:
- Video processing
- API integration
- State management
- Error handling

#### `src/services/api.service.ts`
Base API client:
- HTTP client configuration
- Request/response interceptors
- Error handling
- Type safety

## 🖥️ Backend Structure (`server/`)

```
server/
├── src/
│   ├── controllers/    # Route controllers
│   │   └── summary.controller.js
│   ├── routes/         # API routes
│   │   └── summary.routes.js
│   ├── services/       # Business logic
│   │   ├── summary.service.js
│   │   └── youtube.service.js
│   ├── utils/          # Helper utilities
│   │   ├── ApiError.js
│   │   └── logger.js
│   ├── middleware/     # Express middleware
│   │   ├── errorHandler.js
│   │   └── validate.js
│   └── index.js        # Server entry point
├── tests/              # Backend tests
├── package.json        # Backend dependencies
└── Dockerfile          # Backend Docker image
```

### Backend Architecture

#### Controllers (`server/src/controllers/`)
Handle HTTP requests and responses:
```javascript
// summary.controller.js
- createSummary()      // POST /api/summary
- getSummary()         // GET /api/summary/:id
- listSummaries()      // GET /api/summaries
```

#### Services (`server/src/services/`)
Business logic implementation:
```javascript
// summary.service.js
- generateSummary()    // AI summarization
- processTranscript()  // Text processing
- formatOutput()       // Response formatting

// youtube.service.js
- extractTranscript()  // Get video transcript
- getVideoMetadata()   // Fetch video info
- validateVideoId()    // Video ID validation
```

#### Routes (`server/src/routes/`)
API endpoint definitions:
- RESTful route structure
- Request validation
- Authentication (future)
- Rate limiting (future)

#### Utils (`server/src/utils/`)
- `ApiError.js` - Custom error class
- `logger.js` - Logging utility
- `validators.js` - Input validation

## 🧪 Testing Structure

### Unit Tests
```
src/test/              # Frontend unit tests
server/tests/          # Backend unit tests
```

### E2E Tests (`e2e/`)
```
e2e/
├── accessibility.spec.ts      # Accessibility tests
├── customer-chat.spec.ts      # Chat widget tests
├── home.spec.ts              # Home page tests
├── mobile-responsive.spec.ts # Mobile tests
├── multi-language.spec.ts    # i18n tests
├── performance.spec.ts       # Performance tests
└── video-summarization.spec.ts # Core feature tests
```

### Test Reports
```
coverage/              # Coverage reports
test-results/          # Test execution results
playwright-report/     # Playwright HTML reports
```

## ⚙️ GitHub Configuration (`.github/`)

```
.github/
├── workflows/         # GitHub Actions workflows
│   ├── ci.yml                    # Frontend CI
│   ├── backend-ci.yml            # Backend CI
│   ├── e2e-tests.yml             # E2E tests
│   ├── code-quality.yml          # Code quality checks
│   ├── docker.yml                # Docker builds
│   ├── gcp-deploy.yml            # GCP deployment
│   ├── auto-assign-issues.yml    # Auto-assign
│   ├── auto-create-branch.yml    # Auto-branch
│   ├── auto-create-pr.yml        # Auto-PR
│   ├── auto-merge-pr.yml         # Auto-merge
│   ├── auto-pr-review.yml        # PR analysis
│   └── sync-project-status.yml   # Project sync
├── AUTOMATION.md      # Automation guide
└── copilot-instructions.md # AI agent instructions
```

## 🏗️ Infrastructure (`infrastructure/`)

```
infrastructure/
└── gcp/
    ├── terraform/     # Terraform configurations
    ├── scripts/       # Deployment scripts
    └── deploy.sh      # Main deployment script
```

## 📚 Documentation (`docs/`)

```
docs/
├── PROJECT_OVERVIEW.md    # This file
├── REPOSITORY_STRUCTURE.md # Current file
├── API_DOCUMENTATION.md   # API reference
├── SETUP_GUIDE.md        # Setup instructions
├── DEPLOYMENT_GUIDE.md   # Deployment guide
├── TESTING_GUIDE.md      # Testing guide
├── CONTRIBUTING.md       # Contribution guide
└── GITHUB_PAGES.md       # GitHub Pages setup
```

## 📦 Static Assets (`public/`)

```
public/
├── index.html         # HTML template
├── favicon.ico        # Favicon
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
└── assets/           # Images, icons, etc.
```

## 🔑 Important Files by Task

### Adding a New Feature

**Frontend:**
1. Create component in `src/components/features/`
2. Add service in `src/services/`
3. Create hook in `src/hooks/`
4. Add route in `src/App.tsx`
5. Add tests in `src/test/`

**Backend:**
1. Create service in `server/src/services/`
2. Add controller in `server/src/controllers/`
3. Define route in `server/src/routes/`
4. Add tests in `server/tests/`

### Modifying Configuration

| Task | File |
|------|------|
| Build settings | `vite.config.ts` |
| TypeScript | `tsconfig.json` |
| Styling | `tailwind.config.js` |
| Testing | `vitest.config.ts`, `playwright.config.ts` |
| Docker | `Dockerfile`, `docker-compose.yml` |
| CI/CD | `.github/workflows/*.yml` |

### Environment Variables

**Frontend**: Access via `src/config/env.ts`
**Backend**: Access via `process.env`
**Setup**: Copy `.env.example` to `.env`

## 📊 File Naming Conventions

### Frontend
- **Components**: PascalCase (`VideoInput.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAISummary.ts`)
- **Utilities**: camelCase (`formatters.ts`)
- **Types**: PascalCase (`VideoData.ts`)
- **Tests**: Match filename + `.test.ts` (`VideoInput.test.tsx`)

### Backend
- **Files**: camelCase (`.controller.js`, `.service.js`)
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Tests
- **Unit tests**: `*.test.ts` or `*.spec.ts`
- **E2E tests**: `*.spec.ts` in `e2e/`

## 🎯 Quick Reference

### Start Development
```bash
# Root: Frontend dev server (port 5173)
npm run dev

# Backend dev server (port 3001)
cd server && npm run dev

# Or use start script
./start.sh
```

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Build Production
```bash
# Frontend
npm run build

# Backend
cd server && npm run build

# Docker
docker-compose build
```

## 📝 Notes

- All workflow files use SHA-pinned actions for security
- Frontend serves on port 5173 (dev) / 80 (prod)
- Backend serves on port 3001
- Environment variables are required (see `.env.example`)
- Documentation should be updated with code changes

---

**Last Updated**: January 9, 2026

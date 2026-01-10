# YouTube Video Summarizer - AI Agent Instructions

## 🏗 Architecture Overview

### Fullstack Structure (React 19 + Express + TypeScript)
**Frontend** (Port 5173): React 19 + Vite + TypeScript (ESM)
- State: React hooks + TanStack Query (server state caching/refetch)
- API: **ALWAYS** import and use `apiClient` from [src/services/api.service.ts](src/services/api.service.ts) with axios interceptors (auth injection, 401 handling)
- UI: Radix primitives ([src/components/ui/](src/components/ui/)) + Tailwind CSS v4 + Framer Motion
- Config: Access env **ONLY** via [src/config/env.ts](src/config/env.ts) typed object (e.g., `env.OPENAI_API_KEY`) - **NEVER** `import.meta.env.VITE_*` directly
- Path Alias: `@/` always maps to `src/` (configured in vite.config.ts and tsconfig.json)

**Backend** (Port 3001): Node.js Express (ESM modules)
- Pattern: Thin routes → Services (business logic) → Utils
- Error Handling: Throw `ApiError(statusCode, message, details)` in services → caught by [errorHandler.js](server/src/middleware/errorHandler.js)
- Routes: [server/src/routes/](server/src/routes/) (youtube, summary, chat, health) → [index.js](server/src/routes/index.js) router
- Services: [server/src/services/](server/src/services/) (youtube.service.js, summary.service.js)

### Data Flow: YouTube → AI Summary
1. **Frontend**: URL validation in component → [useAISummary](src/hooks/useAISummary.ts) hook
2. **Orchestration**: [src/lib/youtube-ai.ts](src/lib/youtube-ai.ts) coordinates agents
3. **Backend**: [youtube.service.js](server/src/services/youtube.service.js) extracts transcript via `youtube-transcript` or `youtubei.js` fallback
4. **AI Processing**: GitHub Spark LLM (`window.spark.llm()`) or OpenAI (via `env.OPENAI_API_KEY`)
5. **Response**: `{ videoId, title, summary, keyPoints, themes, sentiment, qaPairs, recommendations, metadata }`

### Why This Separation
- **Thin Routes**: Reusable service logic for testing; routes only handle HTTP concerns
- **Interceptors**: Auth token + error handling centralized in `apiClient` (no per-route repetition)
- **Agent Framework**: [src/lib/agents/](src/lib/agents/) orchestrates specialized agents (Summarization, Analysis, Q&A) with Parallel/Pipeline/Workflow modes

## 🚀 Critical Workflows

### First-Time Setup
```bash
./setup.sh          # Installs deps, generates .env.local and server/.env
# Edit both .env files with API keys (OPENAI_API_KEY, GITHUB_TOKEN, etc.)
./start.sh          # Starts both servers (auto-checks ports with lsof)
```

### Essential Commands
```bash
# Development
npm run dev                   # Frontend dev (5173)
cd server && npm run dev      # Backend dev (3001)
./start.sh                    # Start both servers

# Build & Quality
npm run build                 # TypeScript compile + Vite build
npm run lint:fix              # Auto-fix ESLint errors
npm run type-check            # Full TypeScript validation
npm run env:validate          # Verify required env vars exist

# Testing
npm run test                  # Unit tests (Vitest, watch mode)
npm run test:coverage         # Unit tests with coverage
npm run test:e2e              # E2E tests (Playwright)
npm run test:e2e:debug        # E2E step-through debugging
npm run test:ui               # Vitest UI mode

# Deployment
npm run deploy                # Build + deploy to GitHub Pages
```

### Port Management
- **Ports**: Frontend 5173, Backend 3001
- **Stuck Process**: `lsof -i :3001` then `kill -9 <PID>`
- **Auto-Check**: `start.sh` verifies ports before starting

### Testing Strategy
- **Unit Tests**: Vitest + jsdom ([src/test/setup.ts](src/test/setup.ts)), `@/` alias → `src/`
  - Run: `npm run test` (watch mode) or `npm run test:run` (single run)
  - Coverage: `npm run test:coverage` (generates HTML report in coverage/)
  - UI Mode: `npm run test:ui` for interactive debugging
- **E2E Tests**: Playwright ([e2e/](e2e/)), runs against build or localhost:5173
  - Run: `npm run test:e2e` (headless) or `npm run test:e2e:headed` (with browser)
  - Debug: `npm run test:e2e:debug` for interactive step-through debugging
  - Report: `npm run test:e2e:report` to view last test run
  - Coverage: 100+ tests across 8 suites (accessibility, multi-language, performance, etc.)

## 🛠 Project Conventions

### Code Documentation (Mandatory)
- **JSDoc Tags**: Use `@label` and `@description` for ALL exports:
  ```typescript
  /**
   * @label Validate YouTube URL
   * @description Check if URL is a valid YouTube URL
   */
  export function validateYouTubeUrl(url: string): boolean { ... }
  ```
- **Section Grouping**: Use `// ============================================` with clear headings (TYPES, SERVICE, HOOKS, etc.)
- **80-char limit** for comments (code can be longer for readability)

### Component Structure Pattern
- **Page Components**: [src/components/*Page.tsx](src/components/) handle routing and high-level state
- **Feature Components**: Composed of smaller UI primitives from [src/components/ui/](src/components/ui/)
- **Custom Hooks**: Extracted business logic lives in [src/hooks/](src/hooks/) (e.g., `useAISummary`, `useQuery`)
- **State Management**: Use React hooks + TanStack Query for remote state; avoid Redux
- **Styling**: Tailwind classes directly in JSX; no CSS modules (project-wide consistency via `@/styles`)

### API Client Pattern (Critical!)
- **Always** use `apiClient` from [src/services/api.service.ts](src/services/api.service.ts) for backend calls
- Interceptors automatically handle: auth token injection, 401 error handling, request logging
- **Never** bypass with direct `axios.post()` calls—breaks auth flow and error handling
- Example:
  ```typescript
  import { apiClient } from '@/services/api.service';
  const response = await apiClient.post('/summarize', { url });  // ✅ CORRECT
  // ❌ WRONG: axios.post('http://localhost:3001/api/...')
  // ❌ WRONG: import { apiService } from '@/services/api.service'; // Named export doesn't exist
  ```

### Environment Variables
- **Frontend**: Access ONLY via [src/config/env.ts](src/config/env.ts) typed object (e.g., `env.OPENAI_API_KEY`)
- **Backend**: Use `dotenv` in [server/src/index.js](server/src/index.js), access via `process.env`
- **Never** use `import.meta.env.VITE_*` directly in components/services (breaks if env name changes)

### Error Handling
- **Frontend**: Try/catch in hooks/components → display via toast (from `sonner`)
- **Backend**: Throw `ApiError(statusCode, message, details)` in services → caught by [errorHandler.js](server/src/middleware/errorHandler.js)
- **Response Format**: `{ statusCode, message, details, timestamp }` for all errors

### Multi-Language & RTL Support
- **50+ Languages**: Supported (see [MULTI_LANGUAGE_GUIDE.md](MULTI_LANGUAGE_GUIDE.md))
- **Component**: [LanguageSelector.tsx](src/components/LanguageSelector.tsx) handles language switching
- **RTL Auto**: Arabic, Hebrew, Persian automatically get `text-direction: rtl`
- **Cross-language**: Summarize in language X, output in language Y (via `sourceLanguage`, `targetLanguage` options)

### GitHub Spark Integration (Important!)
- **AI Access**: [src/lib/ai.ts](src/lib/ai.ts) uses `window.spark.llm()` for LLM calls (not OpenAI client)
- **Data Storage**: `useKV()` hook from `@github/spark/hooks` for persistent key-value storage
- **How It Works**: Spark provides model inference + secure KV storage; used in [src/App.tsx](src/App.tsx) and chat features
- **Example**: `const spark = window.spark; const result = await spark.llm(prompt, 'gpt-4o-mini', true)`
- **Note**: This is GitHub's edge-hosted LLM—configure via `GITHUB_TOKEN`, not `OPENAI_API_KEY`

## 🤖 Integration Points

### YouTube Transcript Extraction
- **Libraries**: `youtube-transcript` (primary) and `youtubei.js` (fallback)
- **Location**: [server/src/services/youtube.service.js](server/src/services/youtube.service.js) (`getVideoTranscript()`, `getVideoInfo()`)
- **Frontend Client**: [src/lib/youtube.ts](src/lib/youtube.ts) for client-side validation and info fetching
- **Handles**: Public videos with captions, multiple language tracks, various URL formats

### AI Summarization (Pluggable Architecture)
- **Current**: Placeholder implementation in [server/src/services/summary.service.js](server/src/services/summary.service.js)
- **Integration Point**: Inject OpenAI/Spark LLM via env vars (`OPENAI_API_KEY`, `OPENAI_MODEL`)
- **Agent Framework**: Advanced orchestration in [src/lib/agents/](src/lib/agents/)
  - `BaseAgent` ([base.ts](src/lib/agents/base.ts)): Abstract agent class
  - `AgentManager` ([manager.ts](src/lib/agents/manager.ts)): Registers and executes agents
  - Specialized agents: Summarization, Analysis, Q&A in [specialized-agents.ts](src/lib/agents/specialized-agents.ts)
  - Orchestrator ([orchestrator.ts](src/lib/agents/orchestrator.ts)): Parallel, Pipeline, Workflow modes

### Response Structure (Guaranteed Contract)
```typescript
// VideoSummaryResult from src/lib/youtube-ai.ts
{
  videoId: string
  title: string
  summary: string
  keyPoints: string[]           // Bullet-point insights
  themes: string[]              // Main topics covered
  sentiment: string             // 'positive' | 'neutral' | 'negative'
  qaPairs: [{ question, answer }]
  recommendations: string[]
  detectedLanguage?: string     // Source language
  targetLanguage?: string       // Output language
  metadata: {
    processingTime: number      // ms
    timestamp: string           // ISO 8601
    model: string              // e.g., 'gpt-4-turbo-preview'
    tokensUsed: number
  }
}
```

### Analytics & Monitoring
- **Google Analytics**: `GA_MEASUREMENT_ID` in [src/config/env.ts](src/config/env.ts)
- **PostHog**: `POSTHOG_KEY` for product analytics
- **Sentry**: Error tracking via `SENTRY_DSN`

## 📍 Key Entry Points

### When Adding Features
- **Frontend**: Start at [src/App.tsx](src/App.tsx) (routing) → Create component in [src/components/](src/components/)
- **Backend**: Add route in [server/src/routes/](server/src/routes/) → Business logic in [server/src/services/](server/src/services/)
- **AI Logic**: Extend [src/hooks/useAISummary.ts](src/hooks/useAISummary.ts) or add agent in [src/lib/agents/](src/lib/agents/)

### When Debugging
1. Check [src/ErrorFallback.tsx](src/ErrorFallback.tsx) for frontend error boundary
2. Backend logs: Express middleware in [server/src/middleware/](server/src/middleware/)
3. Network: Axios interceptors in [src/services/api.service.ts](src/services/api.service.ts) log requests in dev mode

### Essential Files (Architecture Reference)
- **Frontend Entry**: [src/main.tsx](src/main.tsx) → [src/App.tsx](src/App.tsx)
- **Backend Entry**: [server/src/index.js](server/src/index.js) → [server/src/routes/index.js](server/src/routes/index.js)
- **Main Hook**: [src/hooks/useAISummary.ts](src/hooks/useAISummary.ts)
- **AI Orchestration**: [src/lib/youtube-ai.ts](src/lib/youtube-ai.ts)
- **Agent Base Class**: [src/lib/agents/base.ts](src/lib/agents/base.ts)

## 📦 Deployment

### GitHub Pages (Frontend Only)
- Auto-deploy: `.github/workflows/deploy.yml` on push to `main`
- Build: `npm run build` → `dist/` folder
- Base path: `/youtube-video-summar` (configured in [vite.config.ts](vite.config.ts))

### Full Stack (GCP Recommended)
- Terraform configs: [infrastructure/gcp/](infrastructure/gcp/)
- Cloud Run: API backend, Artifact Registry: Docker images
- Secrets: Cloud Secret Manager for API keys
- Deploy: `./infrastructure/gcp/deploy.sh` (requires GCP credentials)

### Docker
```bash
docker-compose up       # Frontend + Backend + Nginx
```

## 🔍 Common Tasks

### Add New API Endpoint
1. Create route in [server/src/routes/](server/src/routes/)
2. Add service function in [server/src/services/](server/src/services/)
3. Create frontend API wrapper in [src/services/*.api.ts](src/services/)
4. Use in component via TanStack Query or custom hook

### Add New Language
- Update language list in [MULTI_LANGUAGE_GUIDE.md](MULTI_LANGUAGE_GUIDE.md)
- Add to `LanguageSelector` component options
- Backend automatically supports all YouTube transcript languages

### Update AI Model
- Change `OPENAI_MODEL` in [src/config/env.ts](src/config/env.ts)
- Modify prompt in [server/src/services/summary.service.js](server/src/services/summary.service.js)
- Test with different video lengths and languages

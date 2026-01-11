# VidNote AI Agent Instructions

## 🏗 Architecture Overview

**Fullstack monorepo**: React 19 + Vite frontend (port 5173) with Node.js Express backend (port 3001).

### Service Layer Pattern
- **Frontend services** ([src/services/](src/services/)): Centralized API communication via `apiClient` from [api.service.ts](src/services/api.service.ts). Domain-specific APIs in [summary.api.ts](src/services/summary.api.ts), [youtube.api.ts](src/services/youtube.api.ts).
- **Backend services** ([server/src/services/](server/src/services/)): Business logic separated from controllers. AI summarization in [summary.service.js](server/src/services/summary.service.js) (currently placeholder - awaits OpenAI/Spark integration).
- **Controllers** ([server/src/controllers/](server/src/controllers/)): Thin request/response handlers. Always return `{ success: boolean, data?: any, error?: string }`.

### Data Flow
YouTube URL → [youtube.ts](src/lib/youtube.ts) (transcript extraction) → Backend API → [summary.service.js](server/src/services/summary.service.js) → Frontend via [useAISummary.ts](src/hooks/useAISummary.ts) hook (TanStack Query).

### UI Component System
Shadcn/UI-style components in [src/components/ui/](src/components/ui/) using Radix UI primitives + Tailwind CSS + Framer Motion. Feature components at [src/components/](src/components/) root (e.g., `LanguageSelector.tsx`, `CustomerServiceChat.tsx`).

## 🚀 Critical Development Commands

**Quick start**: `./start.sh` (runs both frontend and backend concurrently)  
**Full setup**: `./setup.sh` (installs deps, generates env files)

### Build & Deploy
- `npm run build:prod` - Production build with `VITE_` env vars  
- `npm run preview:prod` - Test production build locally  
- `npm run deploy` - GitHub Pages deployment (via `gh-pages`)

### Testing Strategy
- **Unit**: `npm run test` (Vitest with jsdom, coverage via v8)  
- **E2E**: `npm run test:e2e` (Playwright against [baseURL](https://ai-empower-hq-360.github.io/youtube-video-summar/))  
- Test files: `**/__tests__/**/*.test.{ts,tsx}` and `e2e/*.spec.ts`

### Validation
- `npm run env:validate` - Verify required env vars (minimal: `VITE_API_BASE_URL`)  
- `npm run type-check` - TypeScript validation without emitting  
- `npm run lint:fix` - Auto-fix ESLint issues

## 🛠 Project-Specific Conventions

### Documentation Standard
All exports use JSDoc with `@label` and `@description`:
```typescript
/**
 * @label API Service
 * @description HTTP client for backend API communication
 */
```
Section dividers: `// ============================================`

### Environment Variables
**Frontend**: ONLY access via [src/config/env.ts](src/config/env.ts) typed config object. Never use `import.meta.env` directly in components.  
**Backend**: Server reads from `.env` via `dotenv` at startup.  
**Modes**: Support `staging` and `production` via `--mode` flag (e.g., `npm run dev:staging`).

### Error Handling Pattern
- Backend: Throw [ApiError](server/src/utils/ApiError.js) instances with statusCode (centralized via [errorHandler.js](server/src/middleware/errorHandler.js))  
- Frontend: Use React Error Boundary ([ErrorFallback.tsx](src/ErrorFallback.tsx)) for component errors. Service errors return standardized response format.

### API Response Format
```typescript
// Success
{ success: true, data: { ... } }
// Error
{ success: false, error: "Message", details?: {} }
```

### Path Aliases
`@/` resolves to `src/` (configured in [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)).

## 🌐 Multi-Language Support (50+ Languages)

Implementation in [src/lib/youtube-ai.ts](src/lib/youtube-ai.ts) and backend services.  
- **Language selector**: [LanguageSelector.tsx](src/components/LanguageSelector.tsx) with search, regional grouping, RTL support  
- **Options**: `{ sourceLanguage: 'auto' | ISO639, targetLanguage: ISO639 }`  
- **See**: [MULTI_LANGUAGE_GUIDE.md](MULTI_LANGUAGE_GUIDE.md) for full API

## 🤖 AI Integration Points

**Current state**: Placeholder implementations in [server/src/services/summary.service.js](server/src/services/summary.service.js)  
**Target integrations**: OpenAI GPT-4, GitHub Spark LLM, Azure OpenAI  
**Frontend hook**: [useAISummary.ts](src/hooks/useAISummary.ts) provides `processVideo`, `quickSummary`, `extractKeyPoints`, `askQuestion`

### YouTube Processing
- Transcript extraction: [src/lib/youtube.ts](src/lib/youtube.ts) via caption XML parsing (regex-based)  
- Supports formats: `youtube.com/watch?v=`, `youtu.be/`, `/embed/`, `/v/`  
- Requires video captions enabled

## 📦 Infrastructure & Deployment

### Docker Setup
`docker-compose.yml`: Frontend (nginx on :80) + Backend (:3001)  
Health checks: Backend `/health` endpoint, frontend nginx availability

### GCP (Terraform)
[infrastructure/gcp/main.tf](infrastructure/gcp/main.tf): Cloud Run (API) + Artifact Registry + Cloud Storage + Secret Manager  
Deploy: `cd infrastructure/gcp && ./deploy.sh`  
All resources tagged: `app: youtube-video-summarizer`, `environment: {dev|staging|production}`, `managed-by: terraform`

### GitHub Pages
Workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)  
Base path: `/youtube-video-summar/` (configured in [vite.config.ts](vite.config.ts))

## 📍 Key File References

**Entry points**:  
- Frontend: [src/main.tsx](src/main.tsx) → [src/App.tsx](src/App.tsx) (620 lines, includes all page routing/state)  
- Backend: [server/src/index.js](server/src/index.js) → [server/src/routes/](server/src/routes/)

**State management**: React hooks + TanStack Query (no Redux/Zustand)  
**Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin  
**Build optimization**: Manual chunks in [vite.config.ts](vite.config.ts) for vendors

## 🔒 Security & Rate Limiting

Backend: Helmet.js headers + express-rate-limit middleware ([rateLimiter.js](server/src/middleware/rateLimiter.js))  
Frontend: Input validation via [youtube.ts](src/lib/youtube.ts) `isValidYouTubeUrl()`  
Secrets: GCP Secret Manager for production, `.env` files for local dev

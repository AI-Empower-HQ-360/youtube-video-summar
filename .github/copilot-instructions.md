# VidNote AI Agent Instructions

## 🏗 Architecture & Patterns
- Fullstack Structure: React 19 + Vite (Frontend) and Node.js Express (Backend).
- Service-Oriented:
  - Frontend: API logic in [src/services/](src/services/) (e.g., [src/services/api.service.ts](src/services/api.service.ts), [src/services/summary.api.ts](src/services/summary.api.ts)). Use TanStack Query for data fetching.
  - Backend: Logic in [server/src/services/](server/src/services/). Controllers in [server/src/controllers/](server/src/controllers/) handle request/response.
- AI Core: Main summarization logic is in [server/src/services/summary.service.js](server/src/services/summary.service.js). Integrated with Spark LLM and YouTube Transcript APIs.
- UI Components: Built with Tailwind CSS + Radix UI + Framer Motion. UI primitives are in [src/components/ui/](src/components/ui/) (Shadcn style).

## 🚀 Critical Workflows
- Launch App: Use [start.sh](start.sh) to run frontend (5173) and backend (3001) concurrently.
- Initialize: Use [setup.sh](setup.sh) for dependency installation and env file generation.
- Validation:
  - npm run env:validate: Check for missing environment variables.
  - npm run lint: Linting via ESLint.
- Testing:
  - npm run test: Vitest for unit tests.
  - npm run test:e2e: Playwright for end-to-end tests.

## 🛠 Project Conventions
- Naming & Docs: Use @label and @description JSDoc tags for exports. Use // ============================================ for section grouping.
- Environment: Access frontend variables via [src/config/env.ts](src/config/env.ts) only.
- API Standards:
  - Client: Use apiClient from [src/services/api.service.ts](src/services/api.service.ts).
  - Responses: Backend returns { success: boolean, data?: any, error?: string }.
  - Errors: Use [server/src/utils/ApiError.js](server/src/utils/ApiError.js) for consistent backend error handling.
- Multi-Language: Supports 50+ languages; see [MULTI_LANGUAGE_GUIDE.md](MULTI_LANGUAGE_GUIDE.md) for specs.

## 🤖 Integration Points
- YouTube: Transcript extraction via youtube-transcript.
- AI: Currently uses placeholder logic in [server/src/services/summary.service.js](server/src/services/summary.service.js); target integration is OpenAI/Spark LLM.
- Analytics: Configured for GA4 and PostHog in [src/config/env.ts](src/config/env.ts).

## 📍 Key Entry Points
- Frontend: [src/main.tsx](src/main.tsx) (Entry), [src/App.tsx](src/App.tsx) (Routing/Layout).
- Backend: [server/src/index.js](server/src/index.js) (Server setup), [server/src/routes/](server/src/routes/) (API Routes).
- Logic: [src/hooks/useAISummary.ts](src/hooks/useAISummary.ts) (Main summarization hook).

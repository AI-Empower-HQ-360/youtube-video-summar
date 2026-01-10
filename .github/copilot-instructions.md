# VidNote AI Agent Instructions

## Big Picture
- Fullstack: React 19 + Vite frontend and Node.js Express backend. Dark UI with Tailwind, Shadcn primitives, Framer Motion; multi-language UX (50+). Front entry in [src/main.tsx](src/main.tsx), layout/routing in [src/App.tsx](src/App.tsx).
- Services split: frontend API clients live in [src/services](src/services) using TanStack Query (see [src/services/api.service.ts](src/services/api.service.ts), [src/services/summary.api.ts](src/services/summary.api.ts)); backend business logic in [server/src/services](server/src/services) with controllers in [server/src/controllers](server/src/controllers) and routes in [server/src/routes](server/src/routes).
- AI flow: YouTube URL → transcript via youtube-transcript → summary/keypoints/QA via Spark LLM placeholder in [server/src/services/summary.service.js](server/src/services/summary.service.js). Main client hook is [src/hooks/useAISummary.ts](src/hooks/useAISummary.ts).
- API contract: JSON `{ success: boolean, data?, error? }`; centralized errors via [server/src/utils/ApiError.js](server/src/utils/ApiError.js).

## Core Workflows
- Bootstrap: run [setup.sh](setup.sh) for deps/env generation. Start both apps with [start.sh](start.sh) (frontend 5173, backend 3001) or individual `npm run dev` in root and server.
- Env: read frontend config only through [src/config/env.ts](src/config/env.ts); backend sample in [server/.env.example](server/.env.example).
- Validation & quality: `npm run env:validate`, `npm run lint`. Use `npm run type-check` when changing TS types.
- Testing: Vitest `npm run test`, coverage `npm run test:coverage`, UI mode `npm run test:ui`; Playwright E2E `npm run test:e2e`, debug `npm run test:e2e:debug`, report `npm run test:e2e:report` (see [E2E_TESTING_GUIDE.md](E2E_TESTING_GUIDE.md)).

## Frontend Patterns
- Data fetching via TanStack Query wrappers in services; keep side effects there, components consume hooks/state.
- UI primitives in [src/components/ui](src/components/ui) (Shadcn). Tailwind v4; follow existing design tokens in [theme.json](theme.json) and styles in [index.css](index.css).
- Section grouping uses `// ============================================` and exports carry `@label` and `@description` JSDoc tags.

## Backend Patterns
- Express layering: routes → controllers → services → utils. Controllers labeled; see [server/src/controllers/youtube.controller.js](server/src/controllers/youtube.controller.js) for URL handling and [server/src/controllers/summary.controller.js](server/src/controllers/summary.controller.js) for summary endpoints.
- Middleware: logging, validation, rate limiting in [server/src/middleware](server/src/middleware); reuse ApiError for consistent responses.
- Health and status endpoints under `/api/health*` plus `/health` root (see [server/src/routes](server/src/routes)).

## Deployment
- Local dev via Vite + Express; production uses GCP: Cloud Run for API, Cloud Storage for static, Artifact Registry, Secret Manager, Cloud Build. Deployment helper script in [infrastructure/gcp/deploy.sh](infrastructure/gcp/deploy.sh) with targets `deploy dev|staging|production`, `secrets`, `build`, `destroy` (see [infrastructure/gcp/README.md](infrastructure/gcp/README.md)).

## Integration Notes
- YouTube: transcript/metadata endpoints in [server/src/services/youtube.service.js](server/src/services/youtube.service.js) and exposed via [server/src/routes/youtube.routes.js](server/src/routes/youtube.routes.js).
- Analytics: GA4 and PostHog configured in [src/config/env.ts](src/config/env.ts).
- Multi-language support documented in [MULTI_LANGUAGE_GUIDE.md](MULTI_LANGUAGE_GUIDE.md); keep locale additions consistent.

## When Contributing
- Prefer extending services/hooks instead of embedding fetch logic in components. Respect API response shape and error patterns.
- Keep docs labels and section dividers; new exports should include `@label` and `@description`.
- Align new tests with existing Vitest/Playwright setup and sample specs in [e2e](e2e).

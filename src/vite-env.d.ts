/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string

  // API
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // AI Services
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_MODEL: string

  // GitHub
  readonly VITE_GITHUB_TOKEN: string

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_EXPERIMENTAL_FEATURES: string

  // Analytics
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_POSTHOG_KEY: string

  // Storage
  readonly VITE_STORAGE_PREFIX: string

  // Security
  readonly VITE_HTTPS: string
  readonly VITE_SENTRY_DSN: string

  // Development
  readonly VITE_SHOW_ERROR_DETAILS: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string

  // Payments
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

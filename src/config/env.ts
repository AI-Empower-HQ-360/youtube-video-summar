/**
 * @label Environment Configuration
 * @description Environment variables and configuration
 */

// ============================================
// ENVIRONMENT VARIABLES
// ============================================

/**
 * @label Environment Config
 * @description Typed environment configuration
 */
export const env = {
  // Application Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'YouTube Video Summarizer',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'AI-powered YouTube video summarization tool',

  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  // Environment Mode
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  IS_TEST: import.meta.env.MODE === 'test',

  // AI Services
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',

  // GitHub Integration
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_EXPERIMENTAL_FEATURES: import.meta.env.VITE_ENABLE_EXPERIMENTAL_FEATURES === 'true',

  // Analytics
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
  POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,

  // Storage
  STORAGE_PREFIX: import.meta.env.VITE_STORAGE_PREFIX || 'youtube_summarizer_',

  // Security
  HTTPS: import.meta.env.VITE_HTTPS === 'true',

  // Error Tracking
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,

  // Development
  SHOW_ERROR_DETAILS: import.meta.env.VITE_SHOW_ERROR_DETAILS !== 'false',
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',

  // Payments
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
} as const;

// ============================================
// VALIDATION
// ============================================

/**
 * @label Validate Environment
 * @description Validate required environment variables
 */
export function validateEnv(): void {
  const required: string[] = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0 && env.IS_PROD) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate API key in production
  if (env.IS_PROD && !env.OPENAI_API_KEY) {
    console.warn('VITE_OPENAI_API_KEY is not set. AI features may not work.');
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * @label Get Environment Name
 * @description Get human-readable environment name
 */
export function getEnvironmentName(): string {
  if (env.IS_PROD) return 'Production';
  if (env.IS_TEST) return 'Test';
  if (env.MODE === 'staging') return 'Staging';
  return 'Development';
}

/**
 * @label Is Development Environment
 * @description Check if running in any development environment
 */
export function isDevelopment(): boolean {
  return env.IS_DEV || env.MODE === 'development';
}

/**
 * @label Is Production Environment
 * @description Check if running in production
 */
export function isProduction(): boolean {
  return env.IS_PROD || env.MODE === 'production';
}

/**
 * @label Log Environment Info
 * @description Log environment configuration (non-sensitive data)
 */
export function logEnvironmentInfo(): void {
  if (env.ENABLE_DEBUG) {
    console.log('🌍 Environment:', getEnvironmentName());
    console.log('📦 Version:', env.APP_VERSION);
    console.log('🔧 Mode:', env.MODE);
    console.log('🚀 API URL:', env.API_BASE_URL);
    console.log('🎯 Features:', {
      analytics: env.ENABLE_ANALYTICS,
      debug: env.ENABLE_DEBUG,
      offline: env.ENABLE_OFFLINE_MODE,
      experimental: env.ENABLE_EXPERIMENTAL_FEATURES,
    });
  }
}

// ============================================
// EXPORT
// ============================================

export default env;

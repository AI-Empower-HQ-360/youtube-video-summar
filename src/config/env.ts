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
  /**
   * @label API Base URL
   */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',

  /**
   * @label Environment Mode
   */
  MODE: import.meta.env.MODE || 'development',

  /**
   * @label Is Development
   */
  IS_DEV: import.meta.env.DEV,

  /**
   * @label Is Production
   */
  IS_PROD: import.meta.env.PROD,

  /**
   * @label App Version
   */
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  /**
   * @label GitHub Token
   */
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,

  /**
   * @label OpenAI API Key
   */
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,

  /**
   * @label Enable Analytics
   */
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  /**
   * @label Enable Debug Mode
   */
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
} as const;

// ============================================
// VALIDATION
// ============================================

/**
 * @label Validate Environment
 * @description Validate required environment variables
 */
export function validateEnv(): void {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0 && env.IS_PROD) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}

// ============================================
// EXPORT
// ============================================

export default env;

/**
 * @label Application Constants
 * @description Centralized constants and configuration
 */

// ============================================
// API CONSTANTS
// ============================================

/**
 * @label API Configuration
 * @description API endpoint and timeout settings
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// ============================================
// STORAGE KEYS
// ============================================

/**
 * @label Local Storage Keys
 * @description Keys for localStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_VIDEOS: 'recent_videos',
  THEME: 'theme',
} as const;

// ============================================
// ROUTES
// ============================================

/**
 * @label Application Routes
 * @description Route paths
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
  FEATURES: '/features',
  PRICING: '/pricing',
  DOCS: '/documentation',
  API_REFERENCE: '/api-reference',
  GUIDES: '/guides',
  CHANGELOG: '/changelog',
  BLOG: '/blog',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
} as const;

// ============================================
// UI CONSTANTS
// ============================================

/**
 * @label UI Configuration
 * @description UI-related constants
 */
export const UI_CONFIG = {
  MAX_TRANSCRIPT_LENGTH: 50000,
  MAX_SUMMARY_LENGTH: 5000,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
} as const;

// ============================================
// YOUTUBE CONSTANTS
// ============================================

/**
 * @label YouTube Configuration
 * @description YouTube-related constants
 */
export const YOUTUBE_CONFIG = {
  VIDEO_ID_LENGTH: 11,
  MAX_URL_LENGTH: 500,
  THUMBNAIL_QUALITIES: ['default', 'hqdefault', 'mqdefault', 'sddefault', 'maxresdefault'],
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

/**
 * @label Error Messages
 * @description Standardized error messages
 */
export const ERROR_MESSAGES = {
  INVALID_URL: 'Please enter a valid YouTube URL',
  NO_TRANSCRIPT: 'No transcript available for this video',
  NETWORK_ERROR: 'Network error. Please check your connection',
  RATE_LIMIT: 'Too many requests. Please try again later',
  SERVER_ERROR: 'Server error. Please try again later',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

/**
 * @label Success Messages
 * @description Standardized success messages
 */
export const SUCCESS_MESSAGES = {
  TRANSCRIPT_LOADED: 'Transcript loaded successfully',
  SUMMARY_GENERATED: 'Summary generated successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  SAVED: 'Saved successfully',
} as const;

// ============================================
// REGEX PATTERNS
// ============================================

/**
 * @label Regex Patterns
 * @description Common regex patterns
 */
export const REGEX_PATTERNS = {
  YOUTUBE_URL: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
} as const;

// ============================================
// EXPORT ALL
// ============================================

export default {
  API_CONFIG,
  STORAGE_KEYS,
  ROUTES,
  UI_CONFIG,
  YOUTUBE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
};

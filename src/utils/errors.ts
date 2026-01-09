/**
 * @label Error Utilities
 * @description Error handling and parsing utilities
 */

// ============================================
// ERROR TYPES
// ============================================

/**
 * @label App Error Class
 * @description Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ============================================
// ERROR PARSERS
// ============================================

/**
 * @label Parse API Error
 * @description Extract error message from API response
 */
export function parseApiError(error: unknown): string {
  const err = error as Record<string, any>;
  // Axios error with response
  if (err.response?.data?.error?.message) {
    return String(err.response.data.error.message);
  }

  // Axios error with message
  if (err.response?.data?.message) {
    return String(err.response.data.message);
  }

  // Network error
  if (err.request && !err.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Generic error
  if (err.message) {
    return String(err.message);
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * @label Get Error Code
 * @description Extract error code from error object
 */
export function getErrorCode(error: unknown): string {
  const err = error as Record<string, any>;
  if (err.response?.status) {
    return `HTTP_${err.response.status}`;
  }
  if (err.code) {
    return String(err.code);
  }
  return 'UNKNOWN_ERROR';
}

/**
 * @label Is Network Error
 * @description Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const err = error as Record<string, any>;
  return !!(err.request && !err.response);
}

/**
 * @label Is Timeout Error
 * @description Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  const err = error as Record<string, any>;
  return err.code === 'ECONNABORTED' || String(err.message || '').toLowerCase().includes('timeout');
}

/**
 * @label Is Rate Limit Error
 * @description Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  const err = error as Record<string, any>;
  return err.response?.status === 429;
}

// ============================================
// ERROR HANDLERS
// ============================================

/**
 * @label Handle Error
 * @description Centralized error handling
 */
export function handleError(error: unknown, defaultMessage?: string): string {
  console.error('Error occurred:', error);

  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection.';
  }

  if (isTimeoutError(error)) {
    return 'Request timed out. Please try again.';
  }

  if (isRateLimitError(error)) {
    return 'Rate limit exceeded. Please wait a moment and try again.';
  }

  return parseApiError(error) || defaultMessage || 'An error occurred';
}

// ============================================
// EXPORT ALL
// ============================================

export const errorUtils = {
  AppError,
  parseApiError,
  getErrorCode,
  isNetworkError,
  isTimeoutError,
  isRateLimitError,
  handleError,
};

export default errorUtils;

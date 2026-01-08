/**
 * @label API Error Class
 * @description Custom error class for API errors
 */

// ============================================
// CUSTOM ERROR CLASS
// ============================================

/**
 * @label ApiError
 * @description Custom error class with status code
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

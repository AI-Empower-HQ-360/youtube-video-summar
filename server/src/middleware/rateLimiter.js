/**
 * @label Rate Limiter Middleware
 * @description Prevents abuse by limiting request rate
 */

import rateLimit from 'express-rate-limit';

// ============================================
// RATE LIMITER CONFIGURATION
// ============================================

/**
 * @label API Rate Limiter
 * @description Limits requests per IP address
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * @label Strict Rate Limiter
 * @description More restrictive rate limiter for resource-intensive operations
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Rate limit exceeded for this resource. Please try again later.',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

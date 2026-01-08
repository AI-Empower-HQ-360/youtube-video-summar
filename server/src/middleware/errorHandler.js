/**
 * @label Error Handler Middleware
 * @description Centralized error handling for the API
 */

import { ApiError } from '../utils/ApiError.js';

// ============================================
// ERROR HANDLER
// ============================================

/**
 * @label Global Error Handler
 * @description Catches and formats all errors
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError errors to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message);
  }

  // Log error details
  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

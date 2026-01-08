/**
 * @label Validator Middleware
 * @description Request validation using express-validator
 */

import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * @label Validate Request
 * @description Checks validation results and returns errors if any
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));
    
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  
  next();
};

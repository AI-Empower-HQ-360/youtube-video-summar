/**
 * @label Summary Routes
 * @description Routes for AI-powered content summarization
 */

import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import * as summaryController from '../controllers/summary.controller.js';

const router = express.Router();

// ============================================
// SUMMARY GENERATION ENDPOINTS
// ============================================

/**
 * @label Generate Summary
 * @route POST /api/summary/generate
 * @description Generate AI summary from transcript
 */
router.post('/generate',
  rateLimiter,
  [
    body('transcript')
      .isString()
      .notEmpty()
      .withMessage('Transcript is required')
      .isLength({ min: 100 })
      .withMessage('Transcript must be at least 100 characters')
  ],
  validateRequest,
  summaryController.generateSummary
);

/**
 * @label Generate Key Points
 * @route POST /api/summary/keypoints
 * @description Extract key points from transcript
 */
router.post('/keypoints',
  rateLimiter,
  [
    body('transcript')
      .isString()
      .notEmpty()
      .withMessage('Transcript is required')
  ],
  validateRequest,
  summaryController.generateKeyPoints
);

/**
 * @label Generate Q&A Pairs
 * @route POST /api/summary/qa
 * @description Generate question-answer pairs from transcript
 */
router.post('/qa',
  rateLimiter,
  [
    body('transcript')
      .isString()
      .notEmpty()
      .withMessage('Transcript is required')
  ],
  validateRequest,
  summaryController.generateQA
);

/**
 * @label Complete Analysis
 * @route POST /api/summary/complete
 * @description Generate summary, key points, and Q&A in one request
 */
router.post('/complete',
  rateLimiter,
  [
    body('transcript')
      .isString()
      .notEmpty()
      .withMessage('Transcript is required')
  ],
  validateRequest,
  summaryController.generateComplete
);

export default router;

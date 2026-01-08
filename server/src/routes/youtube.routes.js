/**
 * @label YouTube Routes
 * @description Routes for YouTube video operations
 */

import express from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import * as youtubeController from '../controllers/youtube.controller.js';

const router = express.Router();

// ============================================
// YOUTUBE VIDEO ENDPOINTS
// ============================================

/**
 * @label Extract Video ID
 * @route POST /api/youtube/extract
 * @description Extract video ID from YouTube URL
 */
router.post('/extract',
  rateLimiter,
  [
    body('url')
      .isString()
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Must be a valid URL')
  ],
  validateRequest,
  youtubeController.extractVideoId
);

/**
 * @label Get Video Transcript
 * @route GET /api/youtube/transcript/:videoId
 * @description Fetch transcript for a YouTube video
 */
router.get('/transcript/:videoId',
  rateLimiter,
  [
    param('videoId')
      .isString()
      .isLength({ min: 11, max: 11 })
      .withMessage('Invalid video ID format')
  ],
  validateRequest,
  youtubeController.getTranscript
);

/**
 * @label Get Video Metadata
 * @route GET /api/youtube/metadata/:videoId
 * @description Fetch metadata for a YouTube video
 */
router.get('/metadata/:videoId',
  rateLimiter,
  [
    param('videoId')
      .isString()
      .isLength({ min: 11, max: 11 })
      .withMessage('Invalid video ID format')
  ],
  validateRequest,
  youtubeController.getMetadata
);

/**
 * @label Validate YouTube URL
 * @route POST /api/youtube/validate
 * @description Check if a URL is a valid YouTube URL
 */
router.post('/validate',
  rateLimiter,
  [
    body('url')
      .isString()
      .notEmpty()
      .withMessage('URL is required')
  ],
  validateRequest,
  youtubeController.validateUrl
);

export default router;

/**
 * @label API Routes Index
 * @description Central router for all API endpoints
 */

import express from 'express';
import youtubeRoutes from './youtube.routes.js';
import summaryRoutes from './summary.routes.js';
import healthRoutes from './health.routes.js';
import chatRoutes from './chat.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

// ============================================
// ROUTE MODULES
// ============================================

/**
 * @label Auth Routes
 * @path /api/auth
 */
router.use('/auth', authRoutes);

/**
 * @label YouTube Routes
 * @path /api/youtube
 */
router.use('/youtube', youtubeRoutes);

/**
 * @label Summary Routes  
 * @path /api/summary
 */
router.use('/summary', summaryRoutes);

/**
 * @label Health Check Routes
 * @path /api/health
 */
router.use('/health', healthRoutes);

/**
 * @label Chat Routes
 * @path /api/chat
 */
router.use('/chat', chatRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/send-verification': 'Send email verification code',
        'POST /api/auth/verify-email': 'Verify email with OTP code',
        'POST /api/auth/resend-verification': 'Resend verification code',
        'GET /api/auth/verification-status/:email': 'Check email verification status'
      },
      youtube: {
        'POST /api/youtube/extract': 'Extract video ID from YouTube URL',
        'GET /api/youtube/transcript/:videoId': 'Get video transcript',
        'GET /api/youtube/metadata/:videoId': 'Get video metadata'
      },
      summary: {
        'POST /api/summary/generate': 'Generate AI summary from transcript',
        'POST /api/summary/keypoints': 'Extract key points',
        'POST /api/summary/qa': 'Generate Q&A pairs'
      },
      health: {
        'GET /api/health': 'Service health status',
        'GET /api/health/stats': 'Service statistics'
      }
    }
  });
});

export default router;

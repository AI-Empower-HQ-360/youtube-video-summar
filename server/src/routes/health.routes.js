/**
 * @label Health Check Routes
 * @description Routes for service health monitoring
 */

import express from 'express';
import * as healthController from '../controllers/health.controller.js';

const router = express.Router();

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

/**
 * @label Basic Health Check
 * @route GET /api/health
 * @description Check if service is running
 */
router.get('/', healthController.healthCheck);

/**
 * @label Service Statistics
 * @route GET /api/health/stats
 * @description Get detailed service statistics
 */
router.get('/stats', healthController.getStats);

/**
 * @label Readiness Check
 * @route GET /api/health/ready
 * @description Check if service is ready to accept requests
 */
router.get('/ready', healthController.readinessCheck);

/**
 * @label Liveness Check
 * @route GET /api/health/live
 * @description Check if service is alive
 */
router.get('/live', healthController.livenessCheck);

export default router;

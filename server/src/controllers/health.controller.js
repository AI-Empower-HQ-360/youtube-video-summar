/**
 * @label Health Controller
 * @description Handles service health check operations
 */

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

/**
 * @label Health Check Controller
 * @description Basic health status
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'youtube-video-summarizer-api'
  });
};

/**
 * @label Statistics Controller
 * @description Detailed service statistics
 */
export const getStats = (req, res) => {
  const stats = {
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: stats
  });
};

/**
 * @label Readiness Check Controller
 * @description Check if service is ready
 */
export const readinessCheck = (req, res) => {
  // Add checks for external dependencies here (database, APIs, etc.)
  const isReady = true;

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * @label Liveness Check Controller
 * @description Check if service is alive
 */
export const livenessCheck = (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
};

/**
 * @label Logger Middleware
 * @description Request logging middleware
 */

// ============================================
// REQUEST LOGGER
// ============================================

/**
 * @label Request Logger
 * @description Logs incoming requests
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ` +
      `${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

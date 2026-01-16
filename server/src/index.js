/**
 * @label Main Server Entry Point
 * @description Express server initialization and configuration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import apiRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration - allow all origins in development for Codespace compatibility
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.ALLOWED_ORIGINS?.split(',') 
  : true; // Allow all origins in development

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// ============================================
// STATIC FILES (Frontend)
// ============================================

// Serve static files from the public directory
const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', apiRoutes);

// Serve index.html for all non-API routes (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
      });
    }
  });
});

// 404 handler (if above doesn't catch it)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
  console.log(`
  ✅ Server is running!
  🚀 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📝 API Docs: http://localhost:${PORT}/api/docs
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

export default app;

# YouTube Video Summarizer Backend API

## 📋 Overview

RESTful API backend for the YouTube Video Summarizer application. Provides endpoints for video transcript extraction and AI-powered content summarization.

## 🏗️ Project Structure

```
server/
├── src/
│   ├── controllers/        # Request handlers (labeled)
│   │   ├── youtube.controller.js
│   │   ├── summary.controller.js
│   │   └── health.controller.js
│   │
│   ├── routes/            # API route definitions (labeled)
│   │   ├── index.js
│   │   ├── youtube.routes.js
│   │   ├── summary.routes.js
│   │   └── health.routes.js
│   │
│   ├── services/          # Business logic (labeled)
│   │   ├── youtube.service.js
│   │   └── summary.service.js
│   │
│   ├── middleware/        # Express middleware (labeled)
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   │
│   ├── utils/            # Utility functions (labeled)
│   │   └── ApiError.js
│   │
│   └── index.js          # Server entry point (labeled)
│
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## 📡 API Endpoints

### Health Checks

- `GET /health` - Basic health check
- `GET /api/health` - Service health status
- `GET /api/health/stats` - Detailed statistics
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

### YouTube Operations

- `POST /api/youtube/extract` - Extract video ID from URL
- `GET /api/youtube/transcript/:videoId` - Get video transcript
- `GET /api/youtube/metadata/:videoId` - Get video metadata
- `POST /api/youtube/validate` - Validate YouTube URL

### Summary Generation

- `POST /api/summary/generate` - Generate AI summary
- `POST /api/summary/keypoints` - Extract key points
- `POST /api/summary/qa` - Generate Q&A pairs
- `POST /api/summary/complete` - Generate all analyses

### Documentation

- `GET /api/docs` - API documentation

## 🔐 Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# API Keys
OPENAI_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📝 Labels Guide

All files contain descriptive labels:
- `@label` - Function/module purpose
- `@description` - Detailed explanation
- `@route` - API endpoint path
- `@note` - Important notes

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🔄 Development Workflow

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contain business logic
3. **Routes** - Define API endpoints
4. **Middleware** - Process requests (auth, validation, logging)
5. **Utils** - Shared utility functions

## 🛡️ Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Request validation
- **axios** - HTTP client
- **dotenv** - Environment variables

## 🚧 TODO

- [ ] Integrate actual AI service (OpenAI, GitHub Copilot)
- [ ] Add database support
- [ ] Implement authentication
- [ ] Add comprehensive tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add logging service (Winston, Pino)
- [ ] Implement caching (Redis)

## 📄 License

MIT

## 👥 Author

AI-Empower-HQ-360

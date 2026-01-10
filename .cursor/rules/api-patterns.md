# API & Backend Patterns

## API Client Usage (CRITICAL!)

### ✅ CORRECT - Always use apiClient

```typescript
import { apiClient } from '@/services/api.service';

// POST request
const response = await apiClient.post('/summarize', { url });

// GET request
const video = await apiClient.get(`/youtube/info/${videoId}`);

// PUT/DELETE
await apiClient.put('/user/preferences', { theme: 'dark' });
await apiClient.delete(`/videos/${id}`);
```

### ❌ WRONG - Never use direct axios

```typescript
// Breaks auth interceptors and error handling!
import axios from 'axios';
await axios.post('http://localhost:3001/api/summarize', ...);
```

## Backend Route Structure

### Route Creation Pattern

File: `server/src/routes/feature.routes.js`

```javascript
/**
 * @label Feature Routes
 * @description Routes for feature endpoints
 */

import express from 'express';
import { featureService } from '../services/feature.service.js';
import { validateInput } from '../middleware/validation.js';

const router = express.Router();

/**
 * @label Get Feature Data
 * @description Retrieve feature data
 */
router.get('/:id', async (req, res, next) => {
  try {
    const data = await featureService.getData(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error); // Pass to errorHandler middleware
  }
});

export default router;
```

## Service Layer

### Service Pattern

File: `server/src/services/feature.service.js`

```javascript
/**
 * @label Feature Service
 * @description Business logic for feature
 */

import { ApiError } from '../utils/ApiError.js';

/**
 * @label Get Feature Data
 * @description Retrieve and process feature data
 */
export async function getData(id) {
  if (!id) {
    throw new ApiError(400, 'ID is required', { field: 'id' });
  }

  try {
    const data = await someDataSource.fetch(id);
    if (!data) {
      throw new ApiError(404, 'Feature not found');
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Internal server error', { originalError: error.message });
  }
}
```

## Error Handling

### Error Response Format

All errors follow this contract:

```json
{
  "statusCode": 400,
  "message": "User input validation failed",
  "details": {
    "field": "url",
    "reason": "Invalid YouTube URL format"
  },
  "timestamp": "2026-01-10T12:34:56.789Z"
}
```

### Throwing ApiError

```javascript
// In services - throw ApiError with details
throw new ApiError(
  400,                              // HTTP status
  'Validation failed',              // User-friendly message
  { field: 'email', value: 'bad' } // Optional details
);
```

### Catching in Frontend

```typescript
try {
  const result = await apiClient.post('/api/endpoint', data);
} catch (error) {
  // axios converts ApiError response to AxiosError
  const { response } = error as AxiosError;
  const { data } = response as { data: { message: string; details: any } };
  
  toast.error(data.message);
  console.error('Details:', data.details);
}
```

## Environment Configuration

### Backend Environment Access

File: `server/src/index.js`

```javascript
import dotenv from 'dotenv';
dotenv.config();

// Access via process.env
const PORT = process.env.PORT || 3001;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',');
```

### Frontend Environment Access

File: `src/config/env.ts`

```typescript
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
};

// In components
import { env } from '@/config/env';
const baseUrl = env.API_BASE_URL; // ✅ CORRECT
```

## CORS & Security

### Backend CORS Configuration

File: `server/src/index.js`

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
}));

// Security headers via helmet
app.use(helmet());

// Body size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

## Authentication (Auth Token Interceptor)

### Frontend Interceptor

File: `src/services/api.service.ts`

```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle logout
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

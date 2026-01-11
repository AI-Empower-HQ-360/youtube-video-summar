# VidNote Troubleshooting Guide

## Current Issue: YouTube Video Processing Not Working

### Root Cause Analysis

The application has **three different AI processing methods** and needs proper configuration:

1. **Google Cloud Vertex AI** (API-based, used in `services/summary.api.ts`)
   - Requires GCP project and API keys
   - Status: ✅ Package installed (`@google-cloud/vertexai`)
   - Status: ✅ Imported in `src/main.tsx`
   - Needs: GitHub token in environment

2. **Backend API** (Placeholder implementation)
   - Located in `server/src/services/summary.service.js`
   - Status: ⚠️ Currently returns placeholder text
   - Needs: OpenAI API key implementation

3. **Frontend API Service** (Calls backend)
   - Located in `src/services/summary.api.ts`
   - Status: ✅ Configured
   - Issue: Backend returns placeholder

### Quick Fix: Test with YouTube Video

**Video**: <https://www.youtube.com/watch?v=fgp-t5SqQmM>M>
**Video ID**: fgp-t5SqQmM

### Steps to Fix

#### Option 1: Use Google Cloud Vertex AI (Recommended)

1. Add GitHub token to environment:

```bash
# Edit .env.local
VITE_GITHUB_TOKEN=your_github_token_here
```

1

1. Restart frontend:

```bash
npm run dev
```

#### Option 2: Implement Backend AI (Recommended for Production)

1. Add OpenAI key to backend:

```bash
# Edit server/.env
1PENAI_API_KEY=your_openai_key_here
2``

1. Update `server/src/services/summary.service.js` with real OpenAI calls
2. Restart backend

### Testing the Fix

```bash
# Test URL extraction
curl http://localhost:3001/api/youtube/extract \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=fgp-t5SqQmM"}'

# Test transcript (if backend implemented)
curl http://localhost:3001/api/youtube/transcript/fgp-t5SqQmM

# Test summary generation
curl http://localhost:3001/api/summary/generate \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Test transcript text here"}'
```

### Current Environment Status

✅ YouTube API Key: Configured  
✅ Backend Server: Running on port 3001  
✅ Frontend Server: Running on port 5173  
⚠️ Google Cloud API Key: Not configured  
⚠️ OpenAI API: Not implemented (placeholder)  

### Next Steps

1. Choose AI provider (GCP Vertex AI or OpenAI)
2. Add required API key
3. Implement or configure AI service
4. Test with YouTube video
5. Verify summary generation works

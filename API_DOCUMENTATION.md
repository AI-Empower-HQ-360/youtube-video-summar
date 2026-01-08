# API Documentation - YouTube Video Summarizer

## Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-domain.com/api`

## Authentication

Currently, no authentication is required. API keys are managed server-side through environment variables.

## Rate Limiting

| Endpoint Type | Requests | Time Window |
|--------------|----------|-------------|
| Standard | 100 | 15 minutes |
| Strict (AI operations) | 20 | 15 minutes |

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": [] // Optional validation errors
  }
}
```

## Endpoints

### Health Check

Check API server status.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T10:30:00.000Z",
  "uptime": 3600
}
```

---

### API Documentation

Get comprehensive API documentation.

**Endpoint:** `GET /api/docs`

**Response:**
```json
{
  "version": "1.0.0",
  "endpoints": {
    "youtube": { /* YouTube endpoints */ },
    "summary": { /* Summary endpoints */ },
    "health": { /* Health endpoints */ }
  }
}
```

---

## YouTube Endpoints

### Extract Video ID

Extract YouTube video ID from URL.

**Endpoint:** `POST /api/youtube/extract`

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
}
```

**Validation:**
- `url` (required): Valid YouTube URL string

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`

---

### Get Video Transcript

Fetch transcript/captions for a YouTube video.

**Endpoint:** `GET /api/youtube/transcript/:videoId`

**Parameters:**
- `videoId` (path): YouTube video ID (11 characters)

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "transcript": "Full video transcript text here...",
    "wordCount": 1234
  }
}
```

**Error Cases:**
- `400`: Invalid video ID format
- `404`: Video not found or no captions available
- `500`: Failed to fetch transcript

---

### Get Video Metadata

Fetch metadata for a YouTube video.

**Endpoint:** `GET /api/youtube/metadata/:videoId`

**Parameters:**
- `videoId` (path): YouTube video ID

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Video Title",
    "description": "Video description...",
    "channelTitle": "Channel Name",
    "duration": "PT3M33S",
    "viewCount": 1000000,
    "publishedAt": "2009-10-25T06:57:33Z"
  }
}
```

---

## Summary Endpoints

### Generate Summary

Generate AI-powered summary from transcript.

**Endpoint:** `POST /api/summary/generate`

**Request Body:**
```json
{
  "transcript": "Full transcript text to summarize..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary of the video content..."
  }
}
```

**Validation:**
- `transcript` (required): String, min 50 characters, max 100,000 characters

**Rate Limit:** Strict (20 requests / 15 minutes)

---

### Generate Key Points

Extract key points from transcript.

**Endpoint:** `POST /api/summary/keypoints`

**Request Body:**
```json
{
  "transcript": "Full transcript text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keyPoints": [
      "First key point",
      "Second key point",
      "Third key point"
    ]
  }
}
```

**Rate Limit:** Strict (20 requests / 15 minutes)

---

### Generate Q&A

Generate question-answer pairs from transcript.

**Endpoint:** `POST /api/summary/qa`

**Request Body:**
```json
{
  "transcript": "Full transcript text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qaPairs": [
      {
        "question": "What is the main topic?",
        "answer": "The main topic is..."
      },
      {
        "question": "Why is this important?",
        "answer": "This is important because..."
      }
    ]
  }
}
```

**Rate Limit:** Strict (20 requests / 15 minutes)

---

### Generate Complete Analysis

Generate all analysis types (summary, key points, Q&A) in one request.

**Endpoint:** `POST /api/summary/complete`

**Request Body:**
```json
{
  "transcript": "Full transcript text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary...",
    "keyPoints": [
      "Point 1",
      "Point 2",
      "Point 3"
    ],
    "qaPairs": [
      {
        "question": "Question 1?",
        "answer": "Answer 1"
      }
    ]
  }
}
```

**Rate Limit:** Strict (20 requests / 15 minutes)

---

## Error Codes

| Status Code | Meaning | Common Causes |
|------------|---------|---------------|
| 400 | Bad Request | Invalid input, validation failed |
| 404 | Not Found | Resource not found, route doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error, external API failure |
| 503 | Service Unavailable | Server overloaded or maintenance |

---

## Example Usage

### JavaScript (Fetch)

```javascript
// Extract video ID
const extractVideoId = async (url) => {
  const response = await fetch('http://localhost:3001/api/youtube/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  });
  
  const data = await response.json();
  return data.data.videoId;
};

// Get transcript
const getTranscript = async (videoId) => {
  const response = await fetch(
    `http://localhost:3001/api/youtube/transcript/${videoId}`
  );
  
  const data = await response.json();
  return data.data.transcript;
};

// Generate summary
const generateSummary = async (transcript) => {
  const response = await fetch('http://localhost:3001/api/summary/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript })
  });
  
  const data = await response.json();
  return data.data.summary;
};
```

### cURL

```bash
# Extract video ID
curl -X POST http://localhost:3001/api/youtube/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Get transcript
curl http://localhost:3001/api/youtube/transcript/dQw4w9WgXcQ

# Generate summary
curl -X POST http://localhost:3001/api/summary/generate \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Your transcript text here..."}'
```

### Python (Requests)

```python
import requests

BASE_URL = "http://localhost:3001/api"

# Extract video ID
response = requests.post(
    f"{BASE_URL}/youtube/extract",
    json={"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
)
video_id = response.json()["data"]["videoId"]

# Get transcript
response = requests.get(f"{BASE_URL}/youtube/transcript/{video_id}")
transcript = response.json()["data"]["transcript"]

# Generate summary
response = requests.post(
    f"{BASE_URL}/summary/generate",
    json={"transcript": transcript}
)
summary = response.json()["data"]["summary"]
```

---

## Best Practices

1. **Handle Rate Limits:**
   - Check `RateLimit-Remaining` header
   - Implement exponential backoff for retries
   - Cache responses when possible

2. **Error Handling:**
   - Always check `success` field in response
   - Handle all error status codes appropriately
   - Display user-friendly error messages

3. **Performance:**
   - Use `/api/summary/complete` for multiple analysis types
   - Cache video metadata and transcripts
   - Implement request debouncing on frontend

4. **Security:**
   - Never expose API keys in client-side code
   - Use HTTPS in production
   - Validate all user input
   - Implement CSRF protection if adding authentication

5. **Monitoring:**
   - Log all API errors
   - Track response times
   - Monitor rate limit usage
   - Set up alerts for failures

---

## Changelog

### v1.0.0 (2026-01-08)
- Initial API release
- YouTube video extraction
- Transcript fetching
- AI-powered summarization
- Key points extraction
- Q&A generation

---

## Support

For API issues or questions:
- GitHub Issues: https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues
- Email: aiempowerhq@gmail.com

---

## License

See [LICENSE](../LICENSE) file for details.

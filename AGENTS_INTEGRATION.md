# AI Agents Integration Guide

## Overview

The YouTube Video Summarizer now includes a comprehensive AI agents framework that enhances video analysis capabilities with intelligent, multi-agent processing.

## Architecture

```
┌─────────────────────────────────────────────┐
│        YouTube Video Summarizer              │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼───────┐  ┌────▼─────────┐
│  Legacy AI   │  │ Agent-Based  │
│   Services   │  │   Services   │
│              │  │              │
│ • ai.ts      │  │ • youtube-ai │
│ • summary API│  │ • agents/*   │
└──────────────┘  └──────────────┘
```

## New Features

### 1. Enhanced YouTube AI Service (`src/lib/youtube-ai.ts`)

Provides agent-based video processing with:
- **Comprehensive Analysis**: Full video analysis with summary, themes, sentiment, Q&A, recommendations
- **Quick Operations**: Fast summary and key point extraction
- **Interactive Q&A**: Ask questions about video content
- **Multi-language Support**: Translate summaries
- **Video Comparison**: Compare multiple videos

### 2. Enhanced Hook (`src/hooks/useAISummary.ts`)

React hook for agent-based operations:
- `processVideo()` - Full analysis with all features
- `quickSummary()` - Fast summary generation
- `extractKeyPoints()` - Key points extraction
- `askQuestion()` - Interactive Q&A
- Auto state management and error handling

### 3. Example Component (`src/components/EnhancedVideoSummary.tsx`)

Demonstrates full integration with:
- Video URL input
- Multiple analysis options
- Real-time Q&A
- Beautiful result display
- Error handling

## Usage Examples

### Quick Summary

```typescript
import { useAISummary } from '@/hooks/useAISummary'

function MyComponent() {
  const { summary, quickSummary, isProcessing } = useAISummary()
  
  const handleSummary = async () => {
    await quickSummary('https://youtube.com/watch?v=...')
  }
  
  return (
    <div>
      <button onClick={handleSummary} disabled={isProcessing}>
        Summarize
      </button>
      <p>{summary}</p>
    </div>
  )
}
```

### Full Analysis

```typescript
import { useAISummary } from '@/hooks/useAISummary'

function DetailedAnalysis() {
  const { result, processVideo, isProcessing } = useAISummary()
  
  const handleAnalysis = async () => {
    await processVideo('https://youtube.com/watch?v=...', {
      includeKeyPoints: true,
      includeThemes: true,
      includeSentiment: true,
      includeQA: true,
      includeRecommendations: true,
      summaryLength: 'medium',
      summaryFormat: 'structured'
    })
  }
  
  return (
    <div>
      <button onClick={handleAnalysis}>Analyze</button>
      {result && (
        <div>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
          <ul>
            {result.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Interactive Q&A

```typescript
import { useAISummary } from '@/hooks/useAISummary'

function VideoQA() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const { askQuestion } = useAISummary()
  
  const handleAsk = async () => {
    const response = await askQuestion(videoUrl, question)
    setAnswer(response)
  }
  
  return (
    <div>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleAsk}>Ask</button>
      <p>{answer}</p>
    </div>
  )
}
```

### Direct API Usage

```typescript
import {
  processYouTubeVideo,
  quickYouTubeSummary,
  generateVideoKeyPoints,
  analyzeVideoSentiment,
  askVideoQuestion,
  translateVideoSummary,
  compareVideos
} from '@/lib/youtube-ai'

// Full analysis
const result = await processYouTubeVideo(url, {
  includeKeyPoints: true,
  summaryLength: 'medium'
})

// Quick summary
const summary = await quickYouTubeSummary(url)

// Extract key points
const points = await generateVideoKeyPoints(url)

// Sentiment analysis
const sentiment = await analyzeVideoSentiment(url)

// Q&A
const answer = await askVideoQuestion(url, 'What is the main topic?')

// Translation
const translated = await translateVideoSummary(url, 'Spanish')

// Compare videos
const comparison = await compareVideos([url1, url2, url3])
```

## Migration Guide

### From Legacy AI Service

**Before (Legacy):**
```typescript
import { generateSummary, generateKeyPoints } from '@/lib/ai'

const summary = await generateSummary(transcript)
const points = await generateKeyPoints(transcript)
```

**After (Agent-Based):**
```typescript
import { quickYouTubeSummary, generateVideoKeyPoints } from '@/lib/youtube-ai'

const summary = await quickYouTubeSummary(videoUrl)
const points = await generateVideoKeyPoints(videoUrl)
```

### From useSummary Hook

**Before (Legacy):**
```typescript
import { useSummary } from '@/hooks/useSummary'

const { summary, generateSummary, isGenerating } = useSummary()
await generateSummary(transcript)
```

**After (Agent-Based):**
```typescript
import { useAISummary } from '@/hooks/useAISummary'

const { summary, quickSummary, isProcessing } = useAISummary()
await quickSummary(videoUrl)
```

## Benefits of Agent-Based Approach

### 1. **Better Quality**
- Specialized agents optimized for specific tasks
- More accurate and contextual responses
- Better handling of edge cases

### 2. **More Features**
- Theme extraction
- Sentiment analysis
- Interactive Q&A
- Multi-language support
- Video comparison

### 3. **Better Performance**
- Parallel processing where possible
- Efficient token usage
- Rate limiting and retry logic
- Cost tracking

### 4. **Easier to Extend**
- Add new agents easily
- Compose agents for complex workflows
- Reusable across the application

### 5. **Better Maintainability**
- Modular architecture
- Clear separation of concerns
- Comprehensive testing
- Well-documented

## Configuration

### Environment Variables

Required for agent functionality:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4-turbo-preview
VITE_ENABLE_DEBUG=false
```

### Agent Manager Initialization

Agents are automatically initialized in the application. Access via:

```typescript
import { getAgentManager } from '@/lib/agents'

const manager = getAgentManager()
const summarizer = manager.getSummarizer()
const analyzer = manager.getAnalyzer()
```

## Testing

### Unit Tests

All agents have comprehensive test coverage:

```bash
# Run agent tests
npm test src/lib/agents/__tests__/

# Run specific test file
npm test src/lib/agents/__tests__/base.test.ts

# Run with coverage
npm run test:coverage
```

### Integration Tests

Test the YouTube AI integration:

```typescript
import { processYouTubeVideo } from '@/lib/youtube-ai'
import { describe, it, expect } from 'vitest'

describe('YouTube AI Integration', () => {
  it('should process video with agents', async () => {
    const result = await processYouTubeVideo(testUrl)
    expect(result.summary).toBeDefined()
    expect(result.keyPoints.length).toBeGreaterThan(0)
  })
})
```

## Performance Optimization

### 1. Parallel Processing

Multiple agents run in parallel when independent:

```typescript
// These run in parallel automatically
const result = await processYouTubeVideo(url, {
  includeKeyPoints: true,  // Parallel
  includeThemes: true,     // Parallel
  includeSentiment: true   // Parallel
})
```

### 2. Caching

Consider caching results for frequently accessed videos:

```typescript
const cache = new Map()

async function getCachedSummary(url: string) {
  if (cache.has(url)) {
    return cache.get(url)
  }
  
  const summary = await quickYouTubeSummary(url)
  cache.set(url, summary)
  return summary
}
```

### 3. Token Optimization

Use appropriate summary lengths:

```typescript
// Short for quick previews (lower cost)
await processVideo(url, { summaryLength: 'short' })

// Medium for balanced results (default)
await processVideo(url, { summaryLength: 'medium' })

// Long for detailed analysis (higher cost)
await processVideo(url, { summaryLength: 'long' })
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Set `VITE_OPENAI_API_KEY` in `.env` file
   - Restart development server

2. **"Agents not initialized"**
   - Ensure agent manager is initialized
   - Check console for initialization errors

3. **Rate Limiting**
   - Built-in rate limiter handles this automatically
   - Adjust limits in agent configuration if needed

4. **High Token Usage**
   - Use shorter summary lengths
   - Disable optional features you don't need
   - Monitor costs with `estimateCost()` utility

### Debug Mode

Enable detailed logging:

```typescript
import { env } from '@/config/env'

// Set in .env
VITE_ENABLE_DEBUG=true

// Agents will log detailed information
```

## Roadmap

Future enhancements planned:

- [ ] Agent orchestration UI
- [ ] Custom agent creation interface
- [ ] Batch video processing
- [ ] Real-time streaming UI
- [ ] Advanced caching strategies
- [ ] Cost analytics dashboard
- [ ] More specialized agents (categorization, tagging, etc.)
- [ ] Multi-provider support (Anthropic, Google, etc.)

## Support

For issues, questions, or contributions:

1. Check [AGENTS_FRAMEWORK.md](./AGENTS_FRAMEWORK.md) for agent documentation
2. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing help
3. See examples in `src/components/EnhancedVideoSummary.tsx`
4. Open an issue on GitHub

## License

MIT - Same as main project

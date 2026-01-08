# AI Agents Framework

## Overview

A comprehensive, extensible AI agents framework for building intelligent applications with OpenAI. Features specialized agents, orchestration, memory management, and advanced utilities.

## Architecture

```
┌─────────────────────────────────────────┐
│         Agent Manager                    │
│  (Singleton, manages all agents)        │
└─────────────┬───────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
┌─────▼────┐    ┌─────▼──────┐
│  Agents  │    │Orchestrator│
│          │    │            │
│ • Base   │    │ • Workflow │
│ • OpenAI │    │ • Parallel │
│ • Custom │    │ • Pipeline │
└──────────┘    └────────────┘
```

## Quick Start

### Basic Usage

```typescript
import { getAgentManager, summarize } from '@/lib/agents'

// Simple summarization
const summary = await summarize(longText, {
  length: 'medium',
  format: 'bullets'
})

// Using agent manager
const manager = getAgentManager()
const analyzer = manager.getAnalyzer()
const analysis = await analyzer.analyze(content, ['themes', 'sentiment'])
```

### Creating Custom Agent

```typescript
import { AgentManager } from '@/lib/agents'

const manager = AgentManager.getInstance()

manager.createCustomAgent('reviewer', {
  name: 'Code Reviewer',
  description: 'Reviews code for quality and best practices',
  systemPrompt: 'You are an expert code reviewer...',
  temperature: 0.3,
  maxTokens: 1500
})

const reviewer = manager.getAgent('reviewer')
const review = await reviewer.process(codeSnippet)
```

## Agents

### Specialized Agents

#### 1. Summarization Agent

Condenses content while preserving key information.

```typescript
import { SummarizationAgent } from '@/lib/agents'

const agent = new SummarizationAgent()

// Basic summary
const summary = await agent.summarize(content)

// With options
const summary = await agent.summarize(content, {
  length: 'short', // 'short' | 'medium' | 'long'
  format: 'bullets' // 'paragraph' | 'bullets' | 'structured'
})
```

#### 2. Analysis Agent

Analyzes content and extracts insights.

```typescript
import { AnalysisAgent } from '@/lib/agents'

const agent = new AnalysisAgent()

const analysis = await agent.analyze(content, [
  'sentiment',
  'key themes',
  'audience'
])
```

#### 3. Content Generation Agent

Creates original content based on prompts.

```typescript
import { ContentGenerationAgent } from '@/lib/agents'

const agent = new ContentGenerationAgent()

const content = await agent.generate('Write a blog post about AI', {
  tone: 'professional',
  style: 'informative',
  length: 500
})
```

#### 4. Extraction Agent

Extracts structured data from content.

```typescript
import { ExtractionAgent } from '@/lib/agents'

const agent = new ExtractionAgent()

const data = await agent.extract(content, [
  'title',
  'author',
  'date',
  'key points'
])
// Returns: { title: "...", author: "...", ... }
```

#### 5. Q&A Agent

Answers questions based on context.

```typescript
import { QAAgent } from '@/lib/agents'

const agent = new QAAgent()

const answer = await agent.answer(
  'What is the main topic?',
  contextText
)
```

#### 6. Translation Agent

Translates content between languages.

```typescript
import { TranslationAgent } from '@/lib/agents'

const agent = new TranslationAgent()

const translated = await agent.translate(
  text,
  'Spanish',
  'English' // optional
)
```

## Orchestration

### Sequential Workflow

```typescript
import { AgentOrchestrator } from '@/lib/agents'

const orchestrator = new AgentOrchestrator()

// Register agents
orchestrator.registerAgent('summarizer', new SummarizationAgent())
orchestrator.registerAgent('analyzer', new AnalysisAgent())

// Create plan
const plan = {
  tasks: [
    {
      id: 'summary',
      agentId: 'summarizer',
      input: longText
    },
    {
      id: 'analysis',
      agentId: 'analyzer',
      input: 'Analyze the summary',
      dependencies: ['summary'] // Waits for summary
    }
  ]
}

const results = await orchestrator.executePlan(plan)
```

### Parallel Execution

```typescript
const results = await orchestrator.executeParallel([
  { agentId: 'summarizer', input: text1 },
  { agentId: 'analyzer', input: text2 },
  { agentId: 'generator', input: prompt }
], (results) => {
  // Combine results
  return results.join('\n\n')
})
```

### Workflow Pipeline

```typescript
// Process through multiple agents
const result = await orchestrator.executeWorkflow(
  ['summarizer', 'analyzer', 'generator'],
  initialInput,
  [
    (output) => `Summarize: ${output}`,
    (output) => `Analyze: ${output}`,
    (output) => `Generate based on: ${output}`
  ]
)
```

## Utilities

### Retry Logic

```typescript
import { withRetry } from '@/lib/agents'

const result = await withRetry(
  async () => agent.process(input),
  {
    maxRetries: 3,
    initialDelay: 1000,
    backoffFactor: 2
  }
)
```

### Rate Limiting

```typescript
import { RateLimiter } from '@/lib/agents'

const limiter = new RateLimiter(3, 1000) // 3 concurrent, 1s interval

const result = await limiter.execute(
  async () => agent.process(input)
)
```

### Token Management

```typescript
import { estimateTokens, truncateToTokenLimit } from '@/lib/agents'

const tokens = estimateTokens(text) // Estimate token count

const truncated = truncateToTokenLimit(text, 1000) // Limit to 1000 tokens
```

### Response Parsing

```typescript
import { extractJSON, extractCodeBlocks, extractList } from '@/lib/agents'

// Extract JSON
const data = extractJSON(response.content)

// Extract code blocks
const blocks = extractCodeBlocks(response.content)
// Returns: [{ language: 'python', code: '...' }]

// Extract list items
const items = extractList(response.content)
```

### Prompt Templates

```typescript
import { PromptTemplate } from '@/lib/agents'

const template = new PromptTemplate(`
Summarize the following {{type}} in {{length}} words:

{{content}}
`)

const prompt = template.format({
  type: 'article',
  length: '200',
  content: articleText
})
```

### Cost Estimation

```typescript
import { estimateCost } from '@/lib/agents'

const cost = estimateCost(
  { promptTokens: 500, completionTokens: 300 },
  'gpt-4-turbo-preview'
)
console.log(`Cost: $${cost.toFixed(4)}`)
```

## Memory Management

### Conversation History

```typescript
const agent = new OpenAIAgent({
  name: 'Assistant',
  description: 'Helpful assistant'
})

// Messages are automatically stored
await agent.process('Hello')
await agent.process('Tell me about AI')

// Access history
const history = agent.getHistory()

// Clear memory
agent.clearMemory()
```

### Context Management

```typescript
// Set context
agent.setContext('user_preferences', { tone: 'casual' })
agent.setContext('previous_topic', 'machine learning')

// Get context
const prefs = agent.getContext('user_preferences')

// Context is automatically passed to processing
await agent.process('Continue from where we left off')
```

## Streaming Responses

```typescript
const agent = new OpenAIAgent(config)

for await (const chunk of agent.processStream(input)) {
  console.log(chunk) // Stream each token
  // Update UI in real-time
}
```

## Advanced Patterns

### Multi-Agent Collaboration

```typescript
const manager = getAgentManager()
const orchestrator = manager.getOrchestrator()

// Step 1: Extract key points
// Step 2: Analyze each point
// Step 3: Generate recommendations
const plan = {
  tasks: [
    {
      id: 'extract',
      agentId: 'extractor',
      input: document
    },
    {
      id: 'analyze',
      agentId: 'analyzer',
      input: 'Analyze extracted points',
      dependencies: ['extract']
    },
    {
      id: 'recommend',
      agentId: 'generator',
      input: 'Generate recommendations',
      dependencies: ['analyze']
    }
  ]
}

const results = await orchestrator.executePlan(plan)
```

### Agent Chaining

```typescript
// Summarize → Translate → Analyze
const summary = await summarizer.summarize(longText)
const translated = await translator.translate(summary, 'Spanish')
const analysis = await analyzer.analyze(translated)
```

### Error Handling

```typescript
try {
  const result = await agent.process(input)
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle authentication error
  } else if (error.message.includes('rate limit')) {
    // Handle rate limit
    await withRetry(() => agent.process(input))
  } else {
    // Handle other errors
  }
}
```

## Configuration

### Environment Variables

```env
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4-turbo-preview
VITE_ENABLE_DEBUG=true
```

### Agent Configuration

```typescript
const agent = new OpenAIAgent({
  name: 'Custom Agent',
  description: 'Does custom things',
  model: 'gpt-4-turbo-preview',
  temperature: 0.7, // 0 = deterministic, 1 = creative
  maxTokens: 2000,
  systemPrompt: 'You are a helpful assistant...',
  tools: [] // Optional tools
})
```

## Best Practices

1. **Use Specialized Agents** - Use pre-built agents for common tasks
2. **Clear Memory** - Clear agent memory between unrelated conversations
3. **Handle Errors** - Always wrap agent calls in try-catch
4. **Estimate Costs** - Monitor token usage and costs
5. **Rate Limit** - Use rate limiter for batch processing
6. **Validate Responses** - Validate agent outputs match requirements
7. **Use Context** - Pass relevant context to improve responses
8. **Monitor Performance** - Track response times and success rates

## Examples

### YouTube Video Summary with Analysis

```typescript
import { getAgentManager } from '@/lib/agents'

async function processVideo(transcript: string) {
  const manager = getAgentManager()
  
  // Summarize
  const summary = await manager.getSummarizer()?.summarize(transcript, {
    length: 'medium',
    format: 'structured'
  })
  
  // Analyze
  const analysis = await manager.getAnalyzer()?.analyze(summary, [
    'main themes',
    'target audience',
    'key takeaways'
  ])
  
  // Generate title ideas
  const titles = await manager.getGenerator()?.generate(
    `Generate 5 engaging video titles based on this summary: ${summary}`,
    { tone: 'engaging' }
  )
  
  return { summary, analysis, titles }
}
```

## API Reference

See individual module documentation:
- [Base Agent](./base.ts)
- [OpenAI Agent](./openai-agent.ts)
- [Specialized Agents](./specialized-agents.ts)
- [Orchestrator](./orchestrator.ts)
- [Manager](./manager.ts)
- [Utilities](./utils.ts)

## Testing

Agents can be tested using the standard testing framework:

```typescript
import { SummarizationAgent } from '@/lib/agents'
import { describe, it, expect } from 'vitest'

describe('SummarizationAgent', () => {
  it('should summarize content', async () => {
    const agent = new SummarizationAgent()
    const result = await agent.summarize('Long content...')
    expect(result).toBeDefined()
    expect(result.length).toBeLessThan(500)
  })
})
```

## License

MIT

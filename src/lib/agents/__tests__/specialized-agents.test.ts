import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  SummarizationAgent,
  AnalysisAgent,
  ContentGenerationAgent,
  ExtractionAgent,
  QAAgent,
  TranslationAgent
} from '../specialized-agents'

// Mock OpenAIAgent
vi.mock('../openai-agent', () => ({
  OpenAIAgent: class MockOpenAIAgent {
    config: any
    
    constructor(config: any) {
      this.config = config
    }
    
    async process(input: string) {
      return {
        content: `Mocked response for: ${input.substring(0, 50)}...`,
        metadata: {
          model: this.config.model || 'gpt-4-turbo-preview',
          tokensUsed: { prompt: 10, completion: 20, total: 30 },
          timestamp: new Date().toISOString()
        }
      }
    }
    
    addToMemory() {}
    clearMemory() {}
    getHistory() { return [] }
    setContext() {}
    getContext() { return undefined }
  }
}))

describe('SummarizationAgent', () => {
  let agent: SummarizationAgent

  beforeEach(() => {
    agent = new SummarizationAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Summarization Agent')
    expect(agent.config.temperature).toBe(0.3)
  })

  it('should summarize content', async () => {
    const content = 'This is a long piece of content that needs to be summarized.'
    const result = await agent.summarize(content)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should accept length option', async () => {
    const content = 'Content to summarize'
    
    await agent.summarize(content, { length: 'short' })
    await agent.summarize(content, { length: 'medium' })
    await agent.summarize(content, { length: 'long' })
    
    // Should not throw
    expect(true).toBe(true)
  })

  it('should accept format option', async () => {
    const content = 'Content to summarize'
    
    await agent.summarize(content, { format: 'paragraph' })
    await agent.summarize(content, { format: 'bullets' })
    await agent.summarize(content, { format: 'structured' })
    
    // Should not throw
    expect(true).toBe(true)
  })

  it('should handle both options together', async () => {
    const content = 'Content to summarize'
    const result = await agent.summarize(content, {
      length: 'medium',
      format: 'bullets'
    })
    
    expect(result).toBeDefined()
  })
})

describe('AnalysisAgent', () => {
  let agent: AnalysisAgent

  beforeEach(() => {
    agent = new AnalysisAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Analysis Agent')
    expect(agent.config.temperature).toBe(0.5)
  })

  it('should analyze content', async () => {
    const content = 'Content to analyze'
    const result = await agent.analyze(content)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should accept aspect list', async () => {
    const content = 'Content to analyze'
    const aspects = ['sentiment', 'themes', 'audience']
    
    const result = await agent.analyze(content, aspects)
    
    expect(result).toBeDefined()
  })

  it('should handle empty aspect list', async () => {
    const content = 'Content to analyze'
    const result = await agent.analyze(content, [])
    
    expect(result).toBeDefined()
  })
})

describe('ContentGenerationAgent', () => {
  let agent: ContentGenerationAgent

  beforeEach(() => {
    agent = new ContentGenerationAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Content Generation Agent')
    expect(agent.config.temperature).toBe(0.8)
  })

  it('should generate content from prompt', async () => {
    const prompt = 'Write a short story about AI'
    const result = await agent.generate(prompt)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should accept generation options', async () => {
    const prompt = 'Write content'
    const options = {
      tone: 'professional',
      style: 'informative',
      length: 500
    }
    
    const result = await agent.generate(prompt, options)
    
    expect(result).toBeDefined()
  })

  it('should handle minimal options', async () => {
    const prompt = 'Write content'
    const result = await agent.generate(prompt, { tone: 'casual' })
    
    expect(result).toBeDefined()
  })
})

describe('ExtractionAgent', () => {
  let agent: ExtractionAgent

  beforeEach(() => {
    agent = new ExtractionAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Extraction Agent')
    expect(agent.config.temperature).toBe(0.1)
  })

  it('should extract fields from content', async () => {
    const content = 'John Doe wrote an article on January 1, 2024 about AI'
    const fields = ['author', 'date', 'topic']
    
    const result = await agent.extract(content, fields)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })

  it('should return object with extracted data', async () => {
    const content = 'Sample content'
    const fields = ['field1', 'field2']
    
    const result = await agent.extract(content, fields)
    
    expect(result).toBeInstanceOf(Object)
  })

  it('should handle empty fields list', async () => {
    const content = 'Sample content'
    
    const result = await agent.extract(content, [])
    
    expect(result).toBeDefined()
  })
})

describe('QAAgent', () => {
  let agent: QAAgent

  beforeEach(() => {
    agent = new QAAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Q&A Agent')
    expect(agent.config.temperature).toBe(0.4)
  })

  it('should answer question with context', async () => {
    const question = 'What is the main topic?'
    const context = 'The main topic is artificial intelligence and machine learning.'
    
    const result = await agent.answer(question, context)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should handle question without context', async () => {
    const question = 'What is AI?'
    
    const result = await agent.answer(question)
    
    expect(result).toBeDefined()
  })

  it('should handle empty context', async () => {
    const question = 'What is the topic?'
    const result = await agent.answer(question, '')
    
    expect(result).toBeDefined()
  })
})

describe('TranslationAgent', () => {
  let agent: TranslationAgent

  beforeEach(() => {
    agent = new TranslationAgent()
  })

  it('should create with default config', () => {
    expect(agent.config.name).toBe('Translation Agent')
    expect(agent.config.temperature).toBe(0.3)
  })

  it('should translate to target language', async () => {
    const text = 'Hello, how are you?'
    const targetLang = 'Spanish'
    
    const result = await agent.translate(text, targetLang)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should translate with source language specified', async () => {
    const text = 'Bonjour'
    const targetLang = 'English'
    const sourceLang = 'French'
    
    const result = await agent.translate(text, targetLang, sourceLang)
    
    expect(result).toBeDefined()
  })

  it('should auto-detect source language when not specified', async () => {
    const text = 'Hello'
    const targetLang = 'Spanish'
    
    const result = await agent.translate(text, targetLang)
    
    expect(result).toBeDefined()
  })
})

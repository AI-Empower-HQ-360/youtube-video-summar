import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  withRetry,
  RateLimiter,
  estimateTokens,
  truncateToTokenLimit,
  PromptTemplate,
  extractJSON,
  extractCodeBlocks,
  extractList,
  validateResponse,
  estimateCost
} from '../utils'

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    
    const result = await withRetry(fn)
    
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should retry on failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Failure 1'))
      .mockRejectedValueOnce(new Error('Failure 2'))
      .mockResolvedValue('success')
    
    const promise = withRetry(fn, { maxRetries: 3, initialDelay: 100 })
    
    // Fast-forward through retries
    await vi.runAllTimersAsync()
    
    const result = await promise
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should throw after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Always fails'))
    
    const promise = withRetry(fn, { maxRetries: 2, initialDelay: 10 })
    
    await vi.runAllTimersAsync()
    
    await expect(promise).rejects.toThrow('Always fails')
    expect(fn).toHaveBeenCalledTimes(3) // initial + 2 retries
  })

  it('should use exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success')
    
    const promise = withRetry(fn, {
      maxRetries: 2,
      initialDelay: 100,
      backoffFactor: 2
    })
    
    await vi.runAllTimersAsync()
    await promise
    
    expect(fn).toHaveBeenCalledTimes(3)
  })
})

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should execute function immediately when under limit', async () => {
    const limiter = new RateLimiter(2, 1000)
    const fn = vi.fn().mockResolvedValue('result')
    
    const result = await limiter.execute(fn)
    
    expect(result).toBe('result')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should queue when at concurrent limit', async () => {
    const limiter = new RateLimiter(1, 1000)
    const fn1 = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('r1'), 500)))
    const fn2 = vi.fn().mockResolvedValue('r2')
    
    const p1 = limiter.execute(fn1)
    const p2 = limiter.execute(fn2)
    
    expect(fn1).toHaveBeenCalled()
    expect(fn2).not.toHaveBeenCalled()
    
    await vi.runAllTimersAsync()
    await Promise.all([p1, p2])
    
    expect(fn2).toHaveBeenCalled()
  })

  it('should respect time interval', async () => {
    const limiter = new RateLimiter(1, 1000)
    const fn = vi.fn().mockResolvedValue('result')
    
    await limiter.execute(fn)
    
    const promise = limiter.execute(fn)
    expect(fn).toHaveBeenCalledTimes(1) // Second not called yet
    
    await vi.advanceTimersByTimeAsync(1000)
    await promise
    
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('estimateTokens', () => {
  it('should estimate tokens for text', () => {
    const text = 'Hello world'
    const tokens = estimateTokens(text)
    
    expect(tokens).toBeGreaterThan(0)
    expect(tokens).toBeLessThan(10)
  })

  it('should estimate more tokens for longer text', () => {
    const short = 'Hi'
    const long = 'This is a much longer piece of text that should have more tokens'
    
    expect(estimateTokens(long)).toBeGreaterThan(estimateTokens(short))
  })

  it('should handle empty string', () => {
    expect(estimateTokens('')).toBe(0)
  })

  it('should approximate ~4 chars per token', () => {
    const text = 'a'.repeat(400) // 400 chars
    const tokens = estimateTokens(text)
    
    expect(tokens).toBeGreaterThan(80)
    expect(tokens).toBeLessThan(120)
  })
})

describe('truncateToTokenLimit', () => {
  it('should not truncate text under limit', () => {
    const text = 'Short text'
    const result = truncateToTokenLimit(text, 100)
    
    expect(result).toBe(text)
  })

  it('should truncate text over limit', () => {
    const text = 'a'.repeat(1000)
    const result = truncateToTokenLimit(text, 10)
    
    expect(result.length).toBeLessThan(text.length)
    expect(estimateTokens(result)).toBeLessThanOrEqual(10)
  })

  it('should handle empty string', () => {
    expect(truncateToTokenLimit('', 100)).toBe('')
  })
})

describe('PromptTemplate', () => {
  it('should format template with variables', () => {
    const template = new PromptTemplate('Hello {{name}}, you are {{age}} years old')
    const result = template.format({ name: 'John', age: '30' })
    
    expect(result).toBe('Hello John, you are 30 years old')
  })

  it('should handle multiple occurrences of same variable', () => {
    const template = new PromptTemplate('{{x}} + {{x}} = {{result}}')
    const result = template.format({ x: '5', result: '10' })
    
    expect(result).toBe('5 + 5 = 10')
  })

  it('should leave missing variables as is', () => {
    const template = new PromptTemplate('Hello {{name}}')
    const result = template.format({})
    
    expect(result).toBe('Hello {{name}}')
  })

  it('should handle complex multi-line templates', () => {
    const template = new PromptTemplate(`
Task: {{task}}
Context: {{context}}
Output format: {{format}}
    `.trim())
    
    const result = template.format({
      task: 'Summarize',
      context: 'Article text',
      format: 'Bullets'
    })
    
    expect(result).toContain('Task: Summarize')
    expect(result).toContain('Context: Article text')
  })
})

describe('extractJSON', () => {
  it('should extract JSON object', () => {
    const text = 'Here is the data: {"name": "John", "age": 30}'
    const result = extractJSON(text)
    
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  it('should extract JSON from markdown code block', () => {
    const text = '```json\n{"key": "value"}\n```'
    const result = extractJSON(text)
    
    expect(result).toEqual({ key: 'value' })
  })

  it('should return null for invalid JSON', () => {
    const text = 'This is not JSON'
    const result = extractJSON(text)
    
    expect(result).toBeNull()
  })

  it('should handle nested JSON', () => {
    const text = '{"user": {"name": "John", "address": {"city": "NYC"}}}'
    const result = extractJSON(text)
    
    expect(result).toEqual({
      user: {
        name: 'John',
        address: { city: 'NYC' }
      }
    })
  })
})

describe('extractCodeBlocks', () => {
  it('should extract code blocks', () => {
    const text = '```python\nprint("hello")\n```'
    const blocks = extractCodeBlocks(text)
    
    expect(blocks).toHaveLength(1)
    expect(blocks[0].language).toBe('python')
    expect(blocks[0].code).toBe('print("hello")')
  })

  it('should extract multiple code blocks', () => {
    const text = '```js\nconsole.log()\n```\nText\n```python\nprint()\n```'
    const blocks = extractCodeBlocks(text)
    
    expect(blocks).toHaveLength(2)
    expect(blocks[0].language).toBe('js')
    expect(blocks[1].language).toBe('python')
  })

  it('should handle blocks without language', () => {
    const text = '```\ncode here\n```'
    const blocks = extractCodeBlocks(text)
    
    expect(blocks).toHaveLength(1)
    expect(blocks[0].language).toBe('')
  })

  it('should return empty array when no blocks', () => {
    const text = 'No code blocks here'
    const blocks = extractCodeBlocks(text)
    
    expect(blocks).toEqual([])
  })
})

describe('extractList', () => {
  it('should extract numbered list', () => {
    const text = '1. First\n2. Second\n3. Third'
    const items = extractList(text)
    
    expect(items).toEqual(['First', 'Second', 'Third'])
  })

  it('should extract bulleted list', () => {
    const text = '- Item A\n- Item B\n- Item C'
    const items = extractList(text)
    
    expect(items).toEqual(['Item A', 'Item B', 'Item C'])
  })

  it('should extract asterisk list', () => {
    const text = '* First\n* Second'
    const items = extractList(text)
    
    expect(items).toEqual(['First', 'Second'])
  })

  it('should return empty array for non-list text', () => {
    const text = 'This is just a paragraph'
    const items = extractList(text)
    
    expect(items).toEqual([])
  })
})

describe('validateResponse', () => {
  it('should validate response meets criteria', () => {
    const response = {
      content: 'This is a valid response',
      metadata: {
        model: 'gpt-4',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
        timestamp: new Date().toISOString()
      }
    }
    
    const result = validateResponse(response, {
      minLength: 10,
      maxLength: 100
    })
    
    expect(result).toBe(true)
  })

  it('should fail if content too short', () => {
    const response = {
      content: 'Short',
      metadata: {
        model: 'gpt-4',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
        timestamp: new Date().toISOString()
      }
    }
    
    const result = validateResponse(response, { minLength: 20 })
    
    expect(result).toBe(false)
  })

  it('should fail if content too long', () => {
    const response = {
      content: 'a'.repeat(200),
      metadata: {
        model: 'gpt-4',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
        timestamp: new Date().toISOString()
      }
    }
    
    const result = validateResponse(response, { maxLength: 100 })
    
    expect(result).toBe(false)
  })

  it('should validate required patterns', () => {
    const response = {
      content: 'The answer is 42',
      metadata: {
        model: 'gpt-4',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
        timestamp: new Date().toISOString()
      }
    }
    
    const result = validateResponse(response, {
      requiredPatterns: [/answer/, /\d+/]
    })
    
    expect(result).toBe(true)
  })
})

describe('estimateCost', () => {
  it('should estimate cost for GPT-4 Turbo', () => {
    const usage = { prompt: 1000, completion: 500, total: 1500 }
    const cost = estimateCost(usage, 'gpt-4-turbo-preview')
    
    expect(cost).toBeGreaterThan(0)
    expect(cost).toBeLessThan(1) // Should be cents, not dollars
  })

  it('should estimate cost for GPT-3.5', () => {
    const usage = { prompt: 1000, completion: 500, total: 1500 }
    const cost = estimateCost(usage, 'gpt-3.5-turbo')
    
    expect(cost).toBeGreaterThan(0)
    expect(cost).toBeLessThan(estimateCost(usage, 'gpt-4-turbo-preview'))
  })

  it('should return 0 for unknown model', () => {
    const usage = { prompt: 1000, completion: 500, total: 1500 }
    const cost = estimateCost(usage, 'unknown-model')
    
    expect(cost).toBe(0)
  })

  it('should calculate different costs for prompt vs completion', () => {
    const promptOnly = { prompt: 1000, completion: 0, total: 1000 }
    const completionOnly = { prompt: 0, completion: 1000, total: 1000 }
    
    const cost1 = estimateCost(promptOnly, 'gpt-4-turbo-preview')
    const cost2 = estimateCost(completionOnly, 'gpt-4-turbo-preview')
    
    expect(cost1).not.toBe(cost2)
  })
})

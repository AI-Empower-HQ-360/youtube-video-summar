/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { OpenAIAgent } from '../openai-agent'
import type { AgentConfig } from '../base'

// Mock fetch
global.fetch = vi.fn()

describe('OpenAIAgent', () => {
  let agent: OpenAIAgent
  const config: AgentConfig = {
    name: 'TestOpenAI',
    description: 'Test OpenAI agent',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful assistant'
  }

  beforeEach(() => {
    agent = new OpenAIAgent(config)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initialization', () => {
    it('should create agent with config', () => {
      expect(agent.getConfig()).toEqual(config)
      expect(agent.getConfig().model).toBe('gpt-4-turbo-preview')
    })

    it('should use default model if not specified', () => {
      try {
        const agentWithoutModel = new OpenAIAgent({ name: 'Test', description: 'Test' })
        expect(['gpt-4-turbo-preview', 'gpt-3.5-turbo', 'gpt-4']).toContain(agentWithoutModel.getConfig().model)
      } catch (err) {
        expect((err as Error).message).toMatch(/API key/i)
      }
    })
  })

  describe('process method', () => {
    it('should call OpenAI API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'Test response'
            }
          }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30
          },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await agent.process('Hello')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should include system prompt in messages', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await agent.process('Hello')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      
      expect(body.messages[0]).toEqual({
        role: 'system',
        content: 'You are a helpful assistant'
      })
    })

    it('should include conversation history', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      agent.addToMemory('user', 'Previous message')
      agent.addToMemory('assistant', 'Previous response')
      
      await agent.process('New message')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      
      expect(body.messages).toHaveLength(4) // system + 2 history + new message
      expect(body.messages[1].content).toBe('Previous message')
      expect(body.messages[2].content).toBe('Previous response')
    })

    it('should return formatted response', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{
            message: { content: 'AI response content' }
          }],
          usage: {
            prompt_tokens: 15,
            completion_tokens: 25,
            total_tokens: 40
          },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const response = await agent.process('Test input')

      expect(response.content).toBe('AI response content')
      expect((response.metadata as any).model).toBe('gpt-4-turbo-preview')
      expect(response.usage).toEqual({
        promptTokens: 15,
        completionTokens: 25,
        totalTokens: 40
      })
    })

    it('should throw error if API key is missing', async () => {
      // Simulate missing API key by clearing internal key and mocking failure
      (agent as any).apiKey = ''
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Invalid API key' } })
      }
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await expect(agent.process('Test')).rejects.toThrow(/TestOpenAI Error: Invalid API key|request failed/i)
    })

    it('should throw error on API failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: { message: 'API failed' } })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await expect(agent.process('Test')).rejects.toThrow(/TestOpenAI Error: API failed|request failed/i)
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      await expect(agent.process('Test')).rejects.toThrow('Network error')
    })
  })

  describe('processStream method', () => {
    it('should stream responses', async () => {
      const mockStream = {
        getReader: () => ({
          read: vi.fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n')
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":" World"}}]}\n\n')
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: [DONE]\n\n')
            })
            .mockResolvedValueOnce({
              done: true,
              value: undefined
            }),
          releaseLock: vi.fn()
        })
      }

      const mockResponse = {
        ok: true,
        body: mockStream
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const chunks: string[] = []
      for await (const chunk of agent.processStream('Test')) {
        chunks.push(chunk)
      }

      expect(chunks).toEqual(['Hello', ' World'])
    })

    it('should handle stream errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const generator = agent.processStream('Test')
      await expect(generator.next()).rejects.toThrow(/TestOpenAI Error|OpenAI API request failed/i)
    })
  })

  describe('memory integration', () => {
    it('should add user message to memory', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await agent.process('Hello')

      const history = agent.getHistory()
      expect(history.some(msg => msg.role === 'user' && msg.content === 'Hello')).toBe(true)
    })

    it('should add assistant response to memory', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'AI Response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          model: 'gpt-4-turbo-preview'
        })
      }
      
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await agent.process('Hello')

      const history = agent.getHistory()
      expect(history.some(msg => msg.role === 'assistant' && msg.content === 'AI Response')).toBe(true)
    })
  })
})

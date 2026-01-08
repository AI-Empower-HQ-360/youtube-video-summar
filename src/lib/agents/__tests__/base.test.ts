import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BaseAgent, AgentFactory } from '../base'
import type { AgentConfig, AgentResponse } from '../base'

// Mock implementation for testing
class TestAgent extends BaseAgent {
  async process(input: string): Promise<AgentResponse> {
    return {
      content: `Processed: ${input}`,
      metadata: {
        model: this.config.model || 'test-model',
        tokensUsed: {
          prompt: 10,
          completion: 20,
          total: 30
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}

describe('BaseAgent', () => {
  let agent: TestAgent
  const config: AgentConfig = {
    name: 'TestAgent',
    description: 'A test agent',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 1000
  }

  beforeEach(() => {
    agent = new TestAgent(config)
  })

  describe('initialization', () => {
    it('should create agent with config', () => {
      expect(agent.config).toEqual(config)
      expect(agent.config.name).toBe('TestAgent')
      expect(agent.config.temperature).toBe(0.7)
    })

    it('should initialize empty memory', () => {
      expect(agent.getHistory()).toEqual([])
    })
  })

  describe('memory management', () => {
    it('should add message to short-term memory', () => {
      agent.addToMemory('user', 'Hello')
      const history = agent.getHistory()
      
      expect(history).toHaveLength(1)
      expect(history[0]).toMatchObject({
        role: 'user',
        content: 'Hello'
      })
      expect(history[0].timestamp).toBeDefined()
    })

    it('should add multiple messages', () => {
      agent.addToMemory('user', 'Hello')
      agent.addToMemory('assistant', 'Hi there')
      agent.addToMemory('user', 'How are you?')
      
      const history = agent.getHistory()
      expect(history).toHaveLength(3)
      expect(history[0].role).toBe('user')
      expect(history[1].role).toBe('assistant')
      expect(history[2].role).toBe('user')
    })

    it('should clear memory', () => {
      agent.addToMemory('user', 'Message 1')
      agent.addToMemory('user', 'Message 2')
      expect(agent.getHistory()).toHaveLength(2)
      
      agent.clearMemory()
      expect(agent.getHistory()).toEqual([])
    })

    it('should clear only short-term memory', () => {
      agent.addToMemory('user', 'Short term')
      agent.setContext('key', 'value')
      
      agent.clearMemory('shortTerm')
      
      expect(agent.getHistory()).toEqual([])
      expect(agent.getContext('key')).toBe('value')
    })

    it('should clear only long-term memory', () => {
      agent.addToMemory('user', 'Message')
      agent.setContext('key', 'value')
      
      agent.clearMemory('longTerm')
      
      expect(agent.getHistory()).toHaveLength(1)
      expect(agent.getContext('key')).toBeUndefined()
    })
  })

  describe('context management', () => {
    it('should set and get context', () => {
      agent.setContext('user_name', 'John')
      expect(agent.getContext('user_name')).toBe('John')
    })

    it('should handle complex context values', () => {
      const complexValue = {
        preferences: { theme: 'dark' },
        history: [1, 2, 3]
      }
      
      agent.setContext('settings', complexValue)
      expect(agent.getContext('settings')).toEqual(complexValue)
    })

    it('should return undefined for non-existent context', () => {
      expect(agent.getContext('nonexistent')).toBeUndefined()
    })

    it('should overwrite existing context', () => {
      agent.setContext('key', 'value1')
      agent.setContext('key', 'value2')
      expect(agent.getContext('key')).toBe('value2')
    })
  })

  describe('process method', () => {
    it('should process input and return response', async () => {
      const response = await agent.process('test input')
      
      expect(response).toBeDefined()
      expect(response.content).toBe('Processed: test input')
      expect(response.metadata).toBeDefined()
      expect(response.metadata.tokensUsed).toBeDefined()
    })

    it('should include token usage in response', async () => {
      const response = await agent.process('test')
      
      expect(response.metadata.tokensUsed).toEqual({
        prompt: 10,
        completion: 20,
        total: 30
      })
    })

    it('should include timestamp in response', async () => {
      const response = await agent.process('test')
      
      expect(response.metadata.timestamp).toBeDefined()
      expect(new Date(response.metadata.timestamp).getTime()).toBeLessThanOrEqual(Date.now())
    })
  })
})

describe('AgentFactory', () => {
  beforeEach(() => {
    // Get factory instance and clear any existing agents
    const factory = AgentFactory.getInstance()
    // Clear by creating new instance (reset singleton for testing)
    vi.clearAllMocks()
  })

  it('should be a singleton', () => {
    const factory1 = AgentFactory.getInstance()
    const factory2 = AgentFactory.getInstance()
    
    expect(factory1).toBe(factory2)
  })

  it('should register agent', () => {
    const factory = AgentFactory.getInstance()
    const agent = new TestAgent({
      name: 'TestAgent',
      description: 'Test'
    })
    
    factory.registerAgent('test', agent)
    expect(factory.getAgent('test')).toBe(agent)
  })

  it('should return undefined for unregistered agent', () => {
    const factory = AgentFactory.getInstance()
    expect(factory.getAgent('nonexistent')).toBeUndefined()
  })

  it('should list all registered agent IDs', () => {
    const factory = AgentFactory.getInstance()
    const agent1 = new TestAgent({ name: 'Agent1', description: 'Test 1' })
    const agent2 = new TestAgent({ name: 'Agent2', description: 'Test 2' })
    
    factory.registerAgent('agent1', agent1)
    factory.registerAgent('agent2', agent2)
    
    const agents = factory.listAgents()
    expect(agents).toContain('agent1')
    expect(agents).toContain('agent2')
  })

  it('should overwrite existing agent on re-registration', () => {
    const factory = AgentFactory.getInstance()
    const agent1 = new TestAgent({ name: 'Agent1', description: 'Test 1' })
    const agent2 = new TestAgent({ name: 'Agent2', description: 'Test 2' })
    
    factory.registerAgent('test', agent1)
    factory.registerAgent('test', agent2)
    
    expect(factory.getAgent('test')).toBe(agent2)
  })
})

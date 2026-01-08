/**
 * @label AI Agent Base Class
 * @description Base class for all AI agents with common functionality
 */

import { env } from '@/config/env'

// ============================================
// TYPES
// ============================================

export interface AgentConfig {
  name: string
  description: string
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  tools?: AgentTool[]
}

export interface AgentTool {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (params: any) => Promise<any>
}

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface AgentResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  metadata?: Record<string, any>
}

export interface AgentMemory {
  shortTerm: AgentMessage[]
  longTerm?: any[]
  context?: Record<string, any>
}

// ============================================
// BASE AGENT CLASS
// ============================================

export abstract class BaseAgent {
  protected config: AgentConfig
  protected memory: AgentMemory
  protected isProcessing: boolean = false

  constructor(config: AgentConfig) {
    this.config = {
      model: env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    }

    this.memory = {
      shortTerm: [],
      longTerm: [],
      context: {},
    }

    if (this.config.systemPrompt) {
      this.addMessage('system', this.config.systemPrompt)
    }
  }

  // ============================================
  // ABSTRACT METHODS
  // ============================================

  /**
   * Process a user request
   */
  abstract process(input: string, context?: any): Promise<AgentResponse>

  // ============================================
  // MEMORY MANAGEMENT
  // ============================================

  /**
   * Add a message to memory
   */
  protected addMessage(role: AgentMessage['role'], content: string): void {
    this.memory.shortTerm.push({
      role,
      content,
      timestamp: new Date(),
    })
  }

  /**
   * Get conversation history
   */
  protected getHistory(): AgentMessage[] {
    return this.memory.shortTerm
  }

  /**
   * Clear short-term memory
   */
  public clearMemory(): void {
    this.memory.shortTerm = this.config.systemPrompt
      ? [{ role: 'system', content: this.config.systemPrompt, timestamp: new Date() }]
      : []
  }

  /**
   * Update context
   */
  public setContext(key: string, value: any): void {
    this.memory.context[key] = value
  }

  /**
   * Get context
   */
  public getContext(key: string): any {
    return this.memory.context[key]
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get agent info
   */
  public getInfo(): { name: string; description: string; model: string } {
    return {
      name: this.config.name,
      description: this.config.description,
      model: this.config.model || 'default',
    }
  }

  /**
   * Check if agent is processing
   */
  public getIsProcessing(): boolean {
    return this.isProcessing
  }

  /**
   * Log agent activity
   */
  protected log(message: string, data?: any): void {
    if (env.ENABLE_DEBUG) {
      console.log(`[${this.config.name}]`, message, data || '')
    }
  }

  /**
   * Handle errors
   */
  protected handleError(error: Error): never {
    this.isProcessing = false
    this.log('Error:', error.message)
    throw new Error(`${this.config.name} Error: ${error.message}`)
  }
}

// ============================================
// AGENT FACTORY
// ============================================

export class AgentFactory {
  private static agents = new Map<string, BaseAgent>()

  /**
   * Register an agent
   */
  static register(id: string, agent: BaseAgent): void {
    this.agents.set(id, agent)
  }

  /**
   * Get an agent by ID
   */
  static get(id: string): BaseAgent | undefined {
    return this.agents.get(id)
  }

  /**
   * List all agents
   */
  static list(): Array<{ id: string; info: ReturnType<BaseAgent['getInfo']> }> {
    return Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      info: agent.getInfo(),
    }))
  }

  /**
   * Clear all agents
   */
  static clear(): void {
    this.agents.clear()
  }
}

export default BaseAgent

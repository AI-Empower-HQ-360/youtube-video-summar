/**
 * @label Agent Manager
 * @description Central manager for creating and managing AI agents
 */

import { BaseAgent } from './base'
import { OpenAIAgent } from './openai-agent'
import {
  SummarizationAgent,
  AnalysisAgent,
  ContentGenerationAgent,
  ExtractionAgent,
  QAAgent,
  TranslationAgent,
} from './specialized-agents'
import { AgentOrchestrator } from './orchestrator'

// ============================================
// AGENT MANAGER
// ============================================

export class AgentManager {
  private static instance: AgentManager
  private agents: Map<string, BaseAgent>
  private orchestrator: AgentOrchestrator

  private constructor() {
    this.agents = new Map()
    this.orchestrator = new AgentOrchestrator()
    this.initializeDefaultAgents()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager()
    }
    return AgentManager.instance
  }

  /**
   * Initialize default agents
   */
  private initializeDefaultAgents(): void {
    try {
      // Summarization
      const summarizer = new SummarizationAgent()
      this.registerAgent('summarizer', summarizer)

      // Analysis
      const analyzer = new AnalysisAgent()
      this.registerAgent('analyzer', analyzer)

      // Content Generation
      const generator = new ContentGenerationAgent()
      this.registerAgent('generator', generator)

      // Extraction
      const extractor = new ExtractionAgent()
      this.registerAgent('extractor', extractor)

      // Q&A
      const qa = new QAAgent()
      this.registerAgent('qa', qa)

      // Translation
      const translator = new TranslationAgent()
      this.registerAgent('translator', translator)
    } catch (error) {
      console.warn('Some agents could not be initialized:', error)
    }
  }

  /**
   * Register an agent
   */
  registerAgent(id: string, agent: BaseAgent): void {
    this.agents.set(id, agent)
    this.orchestrator.registerAgent(id, agent)
  }

  /**
   * Get an agent
   */
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id)
  }

  /**
   * Get orchestrator
   */
  getOrchestrator(): AgentOrchestrator {
    return this.orchestrator
  }

  /**
   * Get summarization agent
   */
  getSummarizer(): SummarizationAgent | undefined {
    return this.agents.get('summarizer') as SummarizationAgent
  }

  /**
   * Get analysis agent
   */
  getAnalyzer(): AnalysisAgent | undefined {
    return this.agents.get('analyzer') as AnalysisAgent
  }

  /**
   * Get content generation agent
   */
  getGenerator(): ContentGenerationAgent | undefined {
    return this.agents.get('generator') as ContentGenerationAgent
  }

  /**
   * Get extraction agent
   */
  getExtractor(): ExtractionAgent | undefined {
    return this.agents.get('extractor') as ExtractionAgent
  }

  /**
   * Get Q&A agent
   */
  getQA(): QAAgent | undefined {
    return this.agents.get('qa') as QAAgent
  }

  /**
   * Get translation agent
   */
  getTranslator(): TranslationAgent | undefined {
    return this.agents.get('translator') as TranslationAgent
  }

  /**
   * Create a custom agent
   */
  createCustomAgent(id: string, config: {
    name: string
    description: string
    systemPrompt: string
    temperature?: number
    maxTokens?: number
  }): void {
    const agent = new OpenAIAgent(config)
    this.registerAgent(id, agent)
  }

  /**
   * List all agents
   */
  listAgents(): Array<{ id: string; info: ReturnType<BaseAgent['getInfo']> }> {
    return Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      info: agent.getInfo(),
    }))
  }

  /**
   * Remove an agent
   */
  removeAgent(id: string): boolean {
    this.orchestrator.unregisterAgent(id)
    return this.agents.delete(id)
  }

  /**
   * Clear all memories
   */
  clearAllMemories(): void {
    this.agents.forEach(agent => agent.clearMemory())
  }

  /**
   * Get agent status
   */
  getStatus(): {
    totalAgents: number
    activeAgents: number
    agents: Array<{ id: string; name: string; processing: boolean }>
  } {
    const agentStatus = Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      name: agent.getInfo().name,
      processing: agent.getIsProcessing(),
    }))

    return {
      totalAgents: this.agents.size,
      activeAgents: agentStatus.filter(a => a.processing).length,
      agents: agentStatus,
    }
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Get the global agent manager instance
 */
export function getAgentManager(): AgentManager {
  return AgentManager.getInstance()
}

/**
 * Quick access to summarization
 */
export async function summarize(
  content: string,
  options?: Parameters<SummarizationAgent['summarize']>[1]
): Promise<string> {
  const manager = getAgentManager()
  const agent = manager.getSummarizer()
  if (!agent) throw new Error('Summarization agent not available')
  return agent.summarize(content, options)
}

/**
 * Quick access to analysis
 */
export async function analyze(
  content: string,
  focusAreas?: string[]
): Promise<string> {
  const manager = getAgentManager()
  const agent = manager.getAnalyzer()
  if (!agent) throw new Error('Analysis agent not available')
  return agent.analyze(content, focusAreas)
}

/**
 * Quick access to content generation
 */
export async function generate(
  prompt: string,
  options?: Parameters<ContentGenerationAgent['generate']>[1]
): Promise<string> {
  const manager = getAgentManager()
  const agent = manager.getGenerator()
  if (!agent) throw new Error('Content generation agent not available')
  return agent.generate(prompt, options)
}

/**
 * Quick access to Q&A
 */
export async function askQuestion(
  question: string,
  context?: string
): Promise<string> {
  const manager = getAgentManager()
  const agent = manager.getQA()
  if (!agent) throw new Error('Q&A agent not available')
  return agent.answer(question, context)
}

// ============================================
// EXPORTS
// ============================================

export default AgentManager

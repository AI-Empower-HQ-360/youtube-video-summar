/**
 * @label AI Agents Main Export
 * @description Central export for all agent-related functionality
 */

// Base classes
export { BaseAgent, AgentFactory } from './base'
export type { AgentConfig, AgentTool, AgentMessage, AgentResponse, AgentMemory } from './base'

// OpenAI Agent
export { OpenAIAgent } from './openai-agent'

// Specialized Agents
export {
  SummarizationAgent,
  AnalysisAgent,
  ContentGenerationAgent,
  ExtractionAgent,
  QAAgent,
  TranslationAgent,
  agents as specializedAgents,
} from './specialized-agents'

// Orchestration
export { AgentOrchestrator } from './orchestrator'
export type {
  OrchestrationTask,
  OrchestrationResult,
  OrchestrationPlan,
} from './orchestrator'

// Agent Manager
export {
  AgentManager,
  getAgentManager,
  summarize,
  analyze,
  generate,
  askQuestion,
} from './manager'

// Utilities
export {
  withRetry,
  RateLimiter,
  estimateTokens,
  validateTokenLimit,
  truncateToTokenLimit,
  extractCodeBlocks,
  extractJSON,
  extractList,
  PromptTemplate,
  validateResponse,
  estimateCost,
  utils as agentUtils,
} from './utils'
export type { RetryOptions } from './utils'

// Default export
export { getAgentManager as default } from './manager'

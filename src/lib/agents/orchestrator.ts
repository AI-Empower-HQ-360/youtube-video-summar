/**
 * @label Agent Orchestrator
 * @description Coordinates multiple agents for complex tasks
 */

import { BaseAgent, AgentResponse } from './base'

// ============================================
// TYPES
// ============================================

export interface OrchestrationTask {
  id: string
  agentId: string
  input: string
  dependencies?: string[]
  context?: Record<string, unknown>
}

export interface OrchestrationResult {
  taskId: string
  success: boolean
  response?: AgentResponse
  error?: string
  duration: number
}

export interface OrchestrationPlan {
  tasks: OrchestrationTask[]
  parallel?: boolean
}

// ============================================
// AGENT ORCHESTRATOR
// ============================================

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>
  private results: Map<string, OrchestrationResult>

  constructor() {
    this.agents = new Map()
    this.results = new Map()
  }

  /**
   * Register an agent
   */
  registerAgent(id: string, agent: BaseAgent): void {
    this.agents.set(id, agent)
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(id: string): void {
    this.agents.delete(id)
  }

  /**
   * Get an agent
   */
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id)
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: OrchestrationTask): Promise<OrchestrationResult> {
    const startTime = Date.now()

    try {
      const agent = this.agents.get(task.agentId)
      if (!agent) {
        throw new Error(`Agent '${task.agentId}' not found`)
      }

      // Check dependencies
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          const depResult = this.results.get(depId)
          if (!depResult || !depResult.success) {
            throw new Error(`Dependency '${depId}' failed or not completed`)
          }
        }
      }

      // Build context from dependencies
      const context = { ...task.context }
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          const depResult = this.results.get(depId)
          if (depResult?.response) {
            context[depId] = depResult.response.content
          }
        }
      }

      const response = await agent.process(task.input, context)

      return {
        taskId: task.id,
        success: true,
        response,
        duration: Date.now() - startTime,
      }
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: (error as Error).message,
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Execute orchestration plan
   */
  async executePlan(plan: OrchestrationPlan): Promise<Map<string, OrchestrationResult>> {
    this.results.clear()

    if (plan.parallel) {
      // Execute all tasks in parallel
      const promises = plan.tasks.map(task => this.executeTask(task))
      const results = await Promise.all(promises)
      
      results.forEach(result => {
        this.results.set(result.taskId, result)
      })
    } else {
      // Execute tasks sequentially, respecting dependencies
      const completed = new Set<string>()
      const queue = [...plan.tasks]

      while (queue.length > 0) {
        const task = queue.shift()!

        // Check if dependencies are met
        const depsReady = !task.dependencies || 
          task.dependencies.every(dep => completed.has(dep))

        if (depsReady) {
          const result = await this.executeTask(task)
          this.results.set(result.taskId, result)
          completed.add(task.id)
        } else {
          // Dependencies not ready, push back to queue
          queue.push(task)
        }
      }
    }

    return this.results
  }

  /**
   * Execute a workflow of agents
   */
  async executeWorkflow(
    agentIds: string[],
    input: string,
    transformers?: Array<(output: string, index: number) => string>
  ): Promise<string> {
    let currentInput = input

    for (let i = 0; i < agentIds.length; i++) {
      const agentId = agentIds[i]
      const agent = this.agents.get(agentId)

      if (!agent) {
        throw new Error(`Agent '${agentId}' not found in workflow`)
      }

      const response = await agent.process(currentInput)
      currentInput = response.content

      // Apply transformer if provided
      if (transformers && transformers[i]) {
        currentInput = transformers[i](currentInput, i)
      }
    }

    return currentInput
  }

  /**
   * Execute agents in parallel and combine results
   */
  async executeParallel(
    tasks: Array<{ agentId: string; input: string; context?: Record<string, unknown> }>,
    combiner?: (results: string[]) => string
  ): Promise<string> {
    const promises = tasks.map(async task => {
      const agent = this.agents.get(task.agentId)
      if (!agent) {
        throw new Error(`Agent '${task.agentId}' not found`)
      }
      const response = await agent.process(task.input, task.context)
      return response.content
    })

    const results = await Promise.all(promises)

    if (combiner) {
      return combiner(results)
    }

    return results.join('\n\n---\n\n')
  }

  /**
   * Get orchestration results
   */
  getResults(): Map<string, OrchestrationResult> {
    return new Map(this.results)
  }

  /**
   * Clear results
   */
  clearResults(): void {
    this.results.clear()
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalTasks: number
    successfulTasks: number
    failedTasks: number
    totalDuration: number
    averageDuration: number
  } {
    const results = Array.from(this.results.values())
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    return {
      totalTasks: results.length,
      successfulTasks: successful,
      failedTasks: failed,
      totalDuration,
      averageDuration: results.length > 0 ? totalDuration / results.length : 0,
    }
  }
}

export default AgentOrchestrator

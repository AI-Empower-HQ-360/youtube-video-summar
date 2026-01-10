/**
 * @label Agent Utilities
 * @description Utility functions and helpers for AI agents
 */

import { AgentResponse } from './base'

// ============================================
// RETRY LOGIC
// ============================================

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options

  let lastError: Error | undefined
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay))
        delay = Math.min(delay * backoffFactor, maxDelay)
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

// ============================================
// RATE LIMITING
// ============================================

export class RateLimiter {
  private queue: Array<() => void> = []
  private processing = 0

  constructor(
    private maxConcurrent: number = 3,
    private minInterval: number = 1000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.processing >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(() => resolve()))
    }

    this.processing++

    try {
      const result = await fn()
      await new Promise(resolve => setTimeout(resolve, this.minInterval))
      return result
    } finally {
      this.processing--
      const next = this.queue.shift()
      if (next) next()
    }
  }
}

// ============================================
// TOKEN ESTIMATION
// ============================================

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
}

export function validateTokenLimit(text: string, maxTokens: number): boolean {
  return estimateTokens(text) <= maxTokens
}

export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text)
  
  if (estimatedTokens <= maxTokens) {
    return text
  }

  const ratio = maxTokens / estimatedTokens
  // Account for the ellipsis adding extra characters (~1 token)
  const targetLength = Math.max(0, Math.floor(text.length * ratio) - 3)
  
  const truncated = text.substring(0, targetLength)
  return truncated.endsWith('...') ? truncated : truncated + '...'
}

// ============================================
// RESPONSE PARSING
// ============================================

export function extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
  const regex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: Array<{ language: string; code: string }> = []
  let match

  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }

  return blocks
}

export function extractJSON<T = unknown>(content: string): T | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // Failed to parse
  }
  return null
}

export function extractList(content: string): string[] {
  const lines = content.split('\n')
  const listItems: string[] = []

  for (const line of lines) {
    const matchBullet = line.match(/^[\s]*[-*•]\s*(.+)$/)
    const matchNumber = line.match(/^[\s]*\d+\.\s*(.+)$/)
    const match = matchBullet || matchNumber
    if (match) {
      listItems.push(match[1].trim())
    }
  }

  return listItems
}

// ============================================
// PROMPT TEMPLATES
// ============================================

export class PromptTemplate {
  constructor(private template: string) {}

  format(variables: Record<string, unknown>): string {
    let result = this.template

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      result = result.replace(placeholder, String(value))
    }

    return result
  }

  static create(template: string): PromptTemplate {
    return new PromptTemplate(template)
  }
}

// ============================================
// RESPONSE VALIDATORS
// ============================================

export function validateResponse(response: AgentResponse, requirements: {
  minLength?: number
  maxLength?: number
  requiredWords?: string[]
  forbiddenWords?: string[]
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const content = response.content

  if (requirements.minLength && content.length < requirements.minLength) {
    errors.push(`Response too short (${content.length} < ${requirements.minLength})`)
  }

  if (requirements.maxLength && content.length > requirements.maxLength) {
    errors.push(`Response too long (${content.length} > ${requirements.maxLength})`)
  }

  if (requirements.requiredWords) {
    const missingWords = requirements.requiredWords.filter(
      word => !content.toLowerCase().includes(word.toLowerCase())
    )
    if (missingWords.length > 0) {
      errors.push(`Missing required words: ${missingWords.join(', ')}`)
    }
  }

  if (requirements.forbiddenWords) {
    const foundForbidden = requirements.forbiddenWords.filter(
      word => content.toLowerCase().includes(word.toLowerCase())
    )
    if (foundForbidden.length > 0) {
      errors.push(`Contains forbidden words: ${foundForbidden.join(', ')}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============================================
// COST ESTIMATION
// ============================================

export function estimateCost(
  usage: { promptTokens: number; completionTokens: number },
  model: string
): number {
  // Pricing per 1K tokens (approximate, update with current rates)
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  }

  const modelPricing = pricing[model] || pricing['gpt-3.5-turbo']
  const inputCost = (usage.promptTokens / 1000) * modelPricing.input
  const outputCost = (usage.completionTokens / 1000) * modelPricing.output

  return inputCost + outputCost
}

// ============================================
// EXPORTS
// ============================================

export const utils = {
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
}

export default utils

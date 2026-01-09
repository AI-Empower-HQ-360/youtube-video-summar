/**
 * @label OpenAI Agent Implementation
 * @description Agent implementation using OpenAI API
 */

import { BaseAgent, AgentConfig, AgentResponse } from './base'
import { env } from '@/config/env'

// ============================================
// OPENAI AGENT
// ============================================

export class OpenAIAgent extends BaseAgent {
  private apiKey: string

  constructor(config: AgentConfig) {
    super(config)
    this.apiKey = env.OPENAI_API_KEY || ''

    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured')
    }
  }

  /**
   * Process user input using OpenAI API
   */
  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    if (this.isProcessing) {
      throw new Error('Agent is already processing a request')
    }

    this.isProcessing = true
    this.log('Processing input:', input.substring(0, 100))

    try {
      // Add user message to memory
      this.addMessage('user', input)

      // Add context if provided
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          this.setContext(key, value)
        })
      }

      // Prepare messages for API
      const messages = this.getHistory().map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'OpenAI API request failed')
      }

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      // Add assistant response to memory
      this.addMessage('assistant', assistantMessage)

      this.isProcessing = false
      this.log('Processing complete')

      return {
        content: assistantMessage,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        metadata: {
          model: data.model,
          finishReason: data.choices[0].finish_reason,
        },
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * Stream response from OpenAI
   */
  async *processStream(
    input: string,
    context?: Record<string, unknown>
  ): AsyncGenerator<string, void, unknown> {
    this.addMessage('user', input)

    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        this.setContext(key, value)
      })
    }

    const messages = this.getHistory().map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) {
                fullContent += content
                yield content
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    this.addMessage('assistant', fullContent)
  }
}

export default OpenAIAgent

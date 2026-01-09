/**
 * @label Specialized Agents
 * @description Pre-configured agents for specific tasks
 */

import { OpenAIAgent } from './openai-agent'
import { AgentConfig } from './base'

// ============================================
// SUMMARIZATION AGENT
// ============================================

export class SummarizationAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Summarization Agent',
      description: 'Specializes in creating concise summaries of content',
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: `You are a professional content summarization expert. Your role is to:
- Create clear, concise summaries that capture key points
- Organize information in a logical structure
- Highlight important facts and insights
- Use bullet points when appropriate
- Maintain objectivity and accuracy
- Keep summaries between 200-500 words unless specified otherwise`,
      ...config,
    })
  }

  async summarize(content: string, options?: {
    length?: 'short' | 'medium' | 'long'
    format?: 'paragraph' | 'bullets' | 'structured'
    sourceLanguage?: string
    targetLanguage?: string
  }): Promise<string> {
    const lengthGuide = {
      short: '100-200 words',
      medium: '300-500 words',
      long: '600-1000 words',
    }

    const formatGuide = {
      paragraph: 'as flowing paragraphs',
      bullets: 'as bullet points',
      structured: 'with clear sections and headings',
    }

    let prompt = `Please summarize the following content in ${lengthGuide[options?.length || 'medium']} ${formatGuide[options?.format || 'paragraph']}`

    // Add language instructions
    if (options?.targetLanguage) {
      const { formatLanguageForPrompt } = await import('../language-support')
      const targetLangName = formatLanguageForPrompt(options.targetLanguage)
      
      if (options.sourceLanguage && options.sourceLanguage !== options.targetLanguage) {
        const sourceLangName = formatLanguageForPrompt(options.sourceLanguage)
        prompt += `.\n\nThe content is in ${sourceLangName}. Please provide the summary in ${targetLangName}, translating from the source language.`
      } else {
        prompt += `.\n\nPlease provide the summary in ${targetLangName}.`
      }
      
      prompt += `\n\nIMPORTANT: Your entire response must be in ${targetLangName}. All text, headings, bullet points, and explanations should be written in ${targetLangName}.`
    }

    prompt += `\n\nContent:\n${content}`

    const response = await this.process(prompt)
    return response.content
  }
}

// ============================================
// ANALYSIS AGENT
// ============================================

export class AnalysisAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Analysis Agent',
      description: 'Analyzes content and provides insights',
      temperature: 0.5,
      maxTokens: 1500,
      systemPrompt: `You are an expert content analyst. Your role is to:
- Identify key themes and patterns
- Extract actionable insights
- Highlight strengths and weaknesses
- Provide data-driven observations
- Suggest improvements or opportunities
- Present analysis in a structured format`,
      ...config,
    })
  }

  async analyze(content: string, focusAreas?: string[]): Promise<string> {
    let prompt = `Please analyze the following content:`

    if (focusAreas && focusAreas.length > 0) {
      prompt += `\n\nFocus on these areas: ${focusAreas.join(', ')}`
    }

    prompt += `\n\n${content}`

    const response = await this.process(prompt)
    return response.content
  }
}

// ============================================
// CONTENT GENERATION AGENT
// ============================================

export class ContentGenerationAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Content Generation Agent',
      description: 'Creates original content based on prompts',
      temperature: 0.8,
      maxTokens: 2000,
      systemPrompt: `You are a creative content writer. Your role is to:
- Generate original, engaging content
- Match the requested tone and style
- Ensure coherence and flow
- Use vivid language and compelling narratives
- Adapt to different content types (articles, scripts, descriptions, etc.)
- Maintain consistency throughout the piece`,
      ...config,
    })
  }

  async generate(prompt: string, options?: {
    tone?: 'professional' | 'casual' | 'formal' | 'friendly'
    style?: string
    length?: number
  }): Promise<string> {
    let enhancedPrompt = prompt

    if (options?.tone) {
      enhancedPrompt += `\n\nTone: ${options.tone}`
    }

    if (options?.style) {
      enhancedPrompt += `\nStyle: ${options.style}`
    }

    if (options?.length) {
      enhancedPrompt += `\nTarget length: approximately ${options.length} words`
    }

    const response = await this.process(enhancedPrompt)
    return response.content
  }
}

// ============================================
// EXTRACTION AGENT
// ============================================

export class ExtractionAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Extraction Agent',
      description: 'Extracts specific information from content',
      temperature: 0.2,
      maxTokens: 1000,
      systemPrompt: `You are a data extraction specialist. Your role is to:
- Accurately identify and extract requested information
- Present extracted data in structured format (JSON, lists, tables)
- Maintain precision and completeness
- Handle various content types
- Validate extracted information
- Provide null/empty values when information is not found`,
      ...config,
    })
  }

  async extract(content: string, fields: string[]): Promise<Record<string, unknown>> {
    const prompt = `Extract the following information from the content:

Fields to extract: ${fields.join(', ')}

Content:
${content}

Provide the extracted information in JSON format.`

    const response = await this.process(prompt)
    
    try {
      // Try to parse JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      this.log('Failed to parse JSON response', e)
    }

    return { raw: response.content }
  }
}

// ============================================
// Q&A AGENT
// ============================================

export class QAAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Q&A Agent',
      description: 'Answers questions based on provided context',
      temperature: 0.3,
      maxTokens: 800,
      systemPrompt: `You are a knowledgeable assistant that answers questions accurately. Your role is to:
- Provide clear, direct answers to questions
- Base answers on the provided context
- Admit when you don't know something
- Ask for clarification when questions are ambiguous
- Cite relevant information from the context
- Keep answers concise but complete`,
      ...config,
    })
  }

  async answer(question: string, context?: string): Promise<string> {
    let prompt = question

    if (context) {
      prompt = `Context:\n${context}\n\nQuestion: ${question}`
    }

    const response = await this.process(prompt)
    return response.content
  }
}

// ============================================
// TRANSLATION AGENT
// ============================================

export class TranslationAgent extends OpenAIAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      name: 'Translation Agent',
      description: 'Translates content between languages',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: `You are a professional translator. Your role is to:
- Provide accurate translations between languages
- Maintain the original meaning and tone
- Adapt idiomatic expressions appropriately
- Preserve formatting and structure
- Consider cultural context
- Ensure natural-sounding output in the target language`,
      ...config,
    })
  }

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    const prompt = sourceLanguage
      ? `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
      : `Translate the following text to ${targetLanguage}:\n\n${text}`

    const response = await this.process(prompt)
    return response.content
  }
}

// ============================================
// EXPORTS
// ============================================

export const agents = {
  SummarizationAgent,
  AnalysisAgent,
  ContentGenerationAgent,
  ExtractionAgent,
  QAAgent,
  TranslationAgent,
}

export default agents

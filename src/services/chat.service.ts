import { apiService } from './api.service';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'suggestion';
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  quickReplies?: Array<{ text: string; action: string }>;
  metadata?: Record<string, any>;
}

class ChatService {
  private sessionId: string | null = null;
  private messageHistory: ChatMessage[] = [];

  /**
   * Initialize a new chat session
   */
  async startSession(userId?: string): Promise<ChatSession> {
    try {
      const response = await apiService.post<ChatSession>('/chat/session', {
        userId,
      });

      this.sessionId = response.id;
      this.messageHistory = [];

      return response;
    } catch (error) {
      console.error('Failed to start chat session:', error);
      // Fallback to local session
      const session: ChatSession = {
        id: `local-${Date.now()}`,
        messages: [],
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sessionId = session.id;
      return session;
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(message: string): Promise<AIResponse> {
    if (!this.sessionId) {
      await this.startSession();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messageHistory.push(userMessage);

    try {
      const response = await apiService.post<AIResponse>('/chat/message', {
        sessionId: this.sessionId,
        message,
        history: this.messageHistory.slice(-10), // Last 10 messages for context
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        metadata: response.metadata,
      };

      this.messageHistory.push(botMessage);

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback to rule-based response
      return this.getRuleBasedResponse(message);
    }
  }

  /**
   * Get AI-powered response using OpenAI
   */
  async getAIResponse(message: string, context: string[] = []): Promise<string> {
    try {
      const response = await apiService.post<{ response: string }>('/chat/ai-response', {
        message,
        context,
        sessionId: this.sessionId,
      });

      return response.response;
    } catch (error) {
      console.error('Failed to get AI response:', error);
      return this.getRuleBasedResponse(message).text;
    }
  }

  /**
   * Get chat history
   */
  getHistory(): ChatMessage[] {
    return this.messageHistory;
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * End the current session
   */
  async endSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await apiService.post('/chat/session/end', {
        sessionId: this.sessionId,
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      this.sessionId = null;
      this.messageHistory = [];
    }
  }

  /**
   * Get suggested questions based on context
   */
  async getSuggestions(context?: string): Promise<string[]> {
    try {
      const response = await apiService.post<{ suggestions: string[] }>(
        '/chat/suggestions',
        { context }
      );
      return response.suggestions;
    } catch {
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Rule-based response fallback
   */
  private getRuleBasedResponse(message: string): AIResponse {
    const lowerMessage = message.toLowerCase();

    // Help with summarization
    if (lowerMessage.includes('summarize') || lowerMessage.includes('how to')) {
      return {
        text: "To summarize a video:\n\n1. Paste the YouTube URL in the input field\n2. Click 'Summarize' button\n3. Wait for AI to generate the summary\n4. Review and export your summary!\n\nNeed more help?",
        quickReplies: [
          { text: 'What formats are supported?', action: 'help-formats' },
          { text: 'How to export?', action: 'help-export' },
        ],
      };
    }

    // Supported formats
    if (lowerMessage.includes('format') || lowerMessage.includes('support')) {
      return {
        text: "We support all YouTube video formats:\n\n✅ Regular YouTube videos\n✅ YouTube Shorts\n✅ Live streams (recorded)\n✅ Playlists\n\nJust paste any YouTube URL and we'll handle the rest!",
      };
    }

    // Export options
    if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      return {
        text: "You can export summaries in multiple formats:\n\n📄 PDF - Professional document\n📝 Markdown - For developers\n📧 Email - Send to yourself\n🔗 Share link - Share with others\n\nClick the 'Export' button after generating a summary!",
      };
    }

    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pay')) {
      return {
        text: "Our pricing plans:\n\n🆓 Free: 5 summaries/day\n💼 Pro: $9.99/month - Unlimited summaries\n🏢 Team: $29.99/month - Multiple users\n\nAll plans include AI-powered summaries and exports!",
        quickReplies: [
          { text: 'See all features', action: 'features' },
          { text: 'Contact sales', action: 'contact' },
        ],
      };
    }

    // Default response
    return {
      text: "I'm here to help! I can assist with:\n\n• How to use the summarizer\n• Supported formats\n• Export options\n• Pricing plans\n• Technical support\n\nWhat would you like to know?",
      suggestions: [
        'How do I summarize a video?',
        'What video formats are supported?',
        'Can I export summaries?',
        'Pricing information',
      ],
    };
  }

  /**
   * Get default suggestions
   */
  private getDefaultSuggestions(): string[] {
    return [
      'How do I summarize a video?',
      'What video formats are supported?',
      'Can I export summaries?',
      'Pricing information',
      'API documentation',
      'Contact support',
    ];
  }

  /**
   * Save feedback for a bot response
   */
  async saveFeedback(
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ): Promise<void> {
    try {
      await apiService.post('/chat/feedback', {
        sessionId: this.sessionId,
        messageId,
        feedback,
        comment,
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
    }
  }
}

export const chatService = new ChatService();

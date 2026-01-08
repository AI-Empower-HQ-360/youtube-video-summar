/**
 * Chat Controller
 * Handles customer service chat functionality with AI responses
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage for chat sessions (use database in production)
const chatSessions = new Map();
const messageHistory = new Map();

/**
 * Start a new chat session
 */
exports.startSession = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    
    chatSessions.set(sessionId, session);
    messageHistory.set(sessionId, []);
    
    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start chat session',
    });
  }
};

/**
 * Send a message and get AI response
 */
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, message, history } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and message are required',
      });
    }
    
    // Get or create session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      };
      chatSessions.set(sessionId, session);
      messageHistory.set(sessionId, []);
    }
    
    // Store user message
    const userMessage = {
      id: uuidv4(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const sessionMessages = messageHistory.get(sessionId);
    sessionMessages.push(userMessage);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, sessionMessages);
    
    // Store bot message
    const botMessage = {
      id: uuidv4(),
      text: aiResponse.text,
      sender: 'bot',
      timestamp: new Date(),
      metadata: aiResponse.metadata,
    };
    
    sessionMessages.push(botMessage);
    session.updatedAt = new Date();
    
    res.json({
      success: true,
      ...aiResponse,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};

/**
 * Get AI-powered response using OpenAI (if configured)
 */
exports.getAIResponse = async (req, res) => {
  try {
    const { message, context, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }
    
    // Check if OpenAI is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey || openaiKey.includes('your_')) {
      // Fallback to rule-based response
      const response = getRuleBasedResponse(message);
      return res.json({
        success: true,
        response: response.text,
      });
    }
    
    // TODO: Integrate with OpenAI API for advanced responses
    // For now, use rule-based responses
    const response = getRuleBasedResponse(message);
    
    res.json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error('Error getting AI response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
    });
  }
};

/**
 * Get suggested questions
 */
exports.getSuggestions = async (req, res) => {
  try {
    const { context } = req.body;
    
    const suggestions = [
      'How do I summarize a video?',
      'What video formats are supported?',
      'Can I export summaries?',
      'How much does it cost?',
      'Do you have an API?',
      'How accurate are the summaries?',
    ];
    
    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions',
    });
  }
};

/**
 * End a chat session
 */
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required',
      });
    }
    
    // Archive session (in production, save to database)
    const session = chatSessions.get(sessionId);
    if (session) {
      session.endedAt = new Date();
    }
    
    // Clean up
    chatSessions.delete(sessionId);
    messageHistory.delete(sessionId);
    
    res.json({
      success: true,
      message: 'Session ended successfully',
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end session',
    });
  }
};

/**
 * Save user feedback
 */
exports.saveFeedback = async (req, res) => {
  try {
    const { sessionId, messageId, feedback, comment } = req.body;
    
    // In production, save to database for analytics
    console.log('Feedback received:', {
      sessionId,
      messageId,
      feedback,
      comment,
      timestamp: new Date(),
    });
    
    res.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save feedback',
    });
  }
};

/**
 * Generate AI response based on user message
 */
async function generateAIResponse(message, history) {
  const response = getRuleBasedResponse(message);
  
  return {
    text: response.text,
    suggestions: response.suggestions,
    quickReplies: response.quickReplies,
    metadata: {
      intent: detectIntent(message),
      timestamp: new Date(),
    },
  };
}

/**
 * Rule-based response generator
 */
function getRuleBasedResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return {
      text: "👋 Hello! I'm your AI assistant for YouTube Video Summarizer. How can I help you today?",
      quickReplies: [
        { text: 'How do I summarize a video?', action: 'help-summarize' },
        { text: 'Pricing information', action: 'help-pricing' },
      ],
    };
  }
  
  // Help with summarization
  if (lowerMessage.includes('summarize') || lowerMessage.includes('how to') || lowerMessage.includes('use')) {
    return {
      text: "To summarize a video:\n\n1. 📝 Paste the YouTube URL in the input field\n2. 🎯 Click 'Summarize' button\n3. ⏳ Wait for AI to analyze the video\n4. 📊 Review your generated summary\n5. 💾 Export in your preferred format\n\nNeed help with a specific step?",
      suggestions: ['What formats are supported?', 'How to export summaries?'],
    };
  }
  
  // Supported formats
  if (lowerMessage.includes('format') || lowerMessage.includes('support') || lowerMessage.includes('type')) {
    return {
      text: "We support all YouTube content:\n\n✅ Regular YouTube videos\n✅ YouTube Shorts\n✅ Live streams (recorded)\n✅ YouTube playlists\n✅ Videos with subtitles\n✅ Videos in 50+ languages\n\nJust paste any YouTube URL!",
    };
  }
  
  // Export options
  if (lowerMessage.includes('export') || lowerMessage.includes('download') || lowerMessage.includes('save')) {
    return {
      text: "Export your summaries in multiple formats:\n\n📄 PDF - Professional document\n📝 Markdown - Developer-friendly\n📧 Email - Send to yourself\n🔗 Share Link - Share with anyone\n📋 Copy to Clipboard - Quick copy\n\nClick the 'Export' button after generating!",
    };
  }
  
  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pay') || lowerMessage.includes('plan')) {
    return {
      text: "Our pricing plans:\n\n🆓 **Free Plan**\n- 5 summaries/day\n- Basic exports\n- Email support\n\n💼 **Pro Plan** - $9.99/month\n- Unlimited summaries\n- All export formats\n- Priority support\n- API access\n\n🏢 **Team Plan** - $29.99/month\n- Everything in Pro\n- Multiple team members\n- Admin dashboard\n- Dedicated support",
      quickReplies: [
        { text: 'Start free trial', action: 'trial' },
        { text: 'Compare plans', action: 'compare' },
      ],
    };
  }
  
  // API
  if (lowerMessage.includes('api') || lowerMessage.includes('integrate') || lowerMessage.includes('developer')) {
    return {
      text: "Yes! We offer a powerful REST API:\n\n🔑 API Key in your Dashboard\n📚 Full documentation available\n🚀 Rate limits based on plan\n💻 SDKs for popular languages\n🔒 Secure authentication\n\nPerfect for integrating into your apps!",
      quickReplies: [
        { text: 'View API docs', action: 'api-docs' },
        { text: 'Get API key', action: 'api-key' },
      ],
    };
  }
  
  // Accuracy
  if (lowerMessage.includes('accurate') || lowerMessage.includes('quality') || lowerMessage.includes('reliable')) {
    return {
      text: "Our AI delivers high accuracy:\n\n✅ 95%+ accuracy for clear audio\n✅ Advanced language models (GPT-4)\n✅ Context-aware summarization\n✅ Key point extraction\n✅ Timestamp identification\n✅ Multi-language support\n\nWe continuously improve our AI!",
    };
  }
  
  // Language support
  if (lowerMessage.includes('language') || lowerMessage.includes('translate')) {
    return {
      text: "We support 50+ languages:\n\n🌍 European: English, Spanish, French, German, Italian, Portuguese, Russian\n🌏 Asian: Chinese, Japanese, Korean, Hindi, Arabic\n🌎 And many more!\n\nSummaries can be:\n✅ Generated in video's language\n✅ Translated to your language\n✅ Available with timestamps",
    };
  }
  
  // Troubleshooting
  if (lowerMessage.includes('error') || lowerMessage.includes('not work') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    return {
      text: "Let me help troubleshoot:\n\n1. ✅ Verify YouTube URL is valid\n2. ✅ Ensure video is public (not private)\n3. ✅ Check your internet connection\n4. ✅ Try refreshing the page\n5. ✅ Clear browser cache\n\nStill having issues? Share:\n- The YouTube URL\n- Error message\n- Browser you're using",
    };
  }
  
  // Contact/Support
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return {
      text: "We're here to help!\n\n📧 Email: aiempowerhq@gmail.com\n💬 Live Chat: Right here!\n📚 Documentation: /documentation\n🐛 Report Bug: GitHub Issues\n⏰ Support Hours: 24/7\n\nHow else can I assist you?",
    };
  }
  
  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return {
      text: "You're welcome! 😊\n\nIs there anything else I can help you with?\n\nIf you're happy with our service, we'd love a review!",
    };
  }
  
  // Goodbye
  if (lowerMessage.match(/(bye|goodbye|see you|exit|quit)/)) {
    return {
      text: "Thanks for chatting! 👋\n\nFeel free to come back anytime. We're always here to help!\n\nHave a great day! 🌟",
    };
  }
  
  // Default response
  return {
    text: "I'm your AI assistant for YouTube Video Summarizer! 🤖\n\nI can help with:\n\n• 📹 How to use the summarizer\n• 📁 Supported video formats\n• 💾 Export and save options\n• 💰 Pricing and plans\n• 🔧 Technical support\n• 🌍 Language support\n• 🔑 API integration\n\nWhat would you like to know?",
    suggestions: [
      'How do I summarize a video?',
      'What formats are supported?',
      'Pricing information',
      'API documentation',
    ],
  };
}

/**
 * Detect user intent from message
 */
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return 'pricing';
  if (lowerMessage.includes('how') || lowerMessage.includes('use')) return 'help';
  if (lowerMessage.includes('format') || lowerMessage.includes('support')) return 'features';
  if (lowerMessage.includes('api')) return 'api';
  if (lowerMessage.includes('error') || lowerMessage.includes('problem')) return 'troubleshooting';
  if (lowerMessage.includes('contact')) return 'contact';
  
  return 'general';
}

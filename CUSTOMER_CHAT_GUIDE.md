# 💬 Customer Service Chat System

## Overview

The YouTube Video Summarizer now includes a comprehensive AI-powered customer service chat system that provides 24/7 support to users.

## Features

### 🤖 AI-Powered Responses
- Intelligent response generation based on user queries
- Context-aware conversations
- Pre-configured knowledge base about the application
- Rule-based fallback for reliable responses

### 💬 Real-Time Chat Interface
- Floating chat widget with minimize/maximize functionality
- Unread message counter
- Typing indicators
- Message history persistence
- Beautiful, modern UI with dark mode support

### 🎯 Quick Replies
- Pre-configured quick action buttons
- Common questions readily available
- One-click access to frequently asked topics

### 📊 Chat Features
- Session management
- Message history tracking
- User feedback collection
- Response analytics

## Components

### Frontend Components

#### `CustomerServiceChat.tsx`
Main chat component with full UI implementation.

**Features:**
- Floating chat button
- Expandable/collapsible chat window
- Message bubbles for user and bot
- Quick reply buttons
- Typing indicator
- Copy-to-clipboard functionality
- Responsive design

**Usage:**
```tsx
import { CustomerServiceChat } from '@/components/CustomerServiceChat';

function App() {
  return (
    <>
      {/* Your app content */}
      <CustomerServiceChat />
    </>
  );
}
```

### Backend API

#### Chat Controller (`chat.controller.js`)
Handles all chat-related logic and AI responses.

**Endpoints:**
- `POST /api/chat/session` - Start new chat session
- `POST /api/chat/message` - Send message and get response
- `POST /api/chat/ai-response` - Get AI-powered response
- `POST /api/chat/suggestions` - Get suggested questions
- `POST /api/chat/session/end` - End chat session
- `POST /api/chat/feedback` - Save user feedback

#### Chat Routes (`chat.routes.js`)
Express router configuration for chat endpoints.

### Services

#### `chat.service.ts`
TypeScript service for managing chat operations.

**Key Methods:**
- `startSession()` - Initialize new chat session
- `sendMessage()` - Send message and get response
- `getAIResponse()` - Get AI-powered response
- `getHistory()` - Retrieve chat history
- `clearHistory()` - Clear chat history
- `endSession()` - End current session
- `getSuggestions()` - Get suggested questions
- `saveFeedback()` - Save user feedback

## Supported Topics

The AI assistant can help with:

### ✅ How to Use
- Video summarization process
- Step-by-step instructions
- Feature explanations
- Best practices

### 📁 Supported Formats
- YouTube video types
- URL formats
- Content compatibility
- Language support

### 💾 Export Options
- Available export formats (PDF, Markdown, Email, etc.)
- How to export summaries
- Sharing capabilities

### 💰 Pricing & Plans
- Free plan details
- Pro plan features
- Team plan benefits
- Billing information

### 🔑 API Integration
- API documentation
- Authentication
- Rate limits
- SDK information

### 🎯 Accuracy & Quality
- AI model details
- Accuracy statistics
- Quality assurance
- Continuous improvements

### 🌍 Language Support
- Supported languages (50+)
- Translation capabilities
- Multi-language summaries

### 🐛 Troubleshooting
- Common issues
- Error resolution
- Browser compatibility
- Connectivity problems

### 📧 Contact & Support
- Support channels
- Response times
- Bug reporting
- Feature requests

## API Examples

### Start a Chat Session

```typescript
import { chatService } from '@/services/chat.service';

// Start session
const session = await chatService.startSession('user-123');
console.log('Session ID:', session.id);
```

### Send a Message

```typescript
// Send message
const response = await chatService.sendMessage('How do I summarize a video?');
console.log('Bot response:', response.text);
console.log('Suggestions:', response.suggestions);
```

### Get AI Response

```typescript
// Get AI response with context
const context = ['previous message 1', 'previous message 2'];
const aiResponse = await chatService.getAIResponse(
  'What formats are supported?',
  context
);
console.log(aiResponse);
```

### Save Feedback

```typescript
// Save user feedback
await chatService.saveFeedback(
  'message-id-123',
  'positive',
  'Very helpful response!'
);
```

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Optional: OpenAI API key for advanced responses
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Chat session timeout (default: 24h)
CHAT_SESSION_TIMEOUT=86400000
```

### Customization

#### Customize Quick Replies

Edit `CustomerServiceChat.tsx`:

```tsx
const quickReplies: QuickReply[] = [
  { text: "Your custom question 1", action: "custom-action-1" },
  { text: "Your custom question 2", action: "custom-action-2" },
  // Add more...
];
```

#### Customize AI Responses

Edit `chat.controller.js`:

```javascript
function getRuleBasedResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Add your custom logic
  if (lowerMessage.includes('your-keyword')) {
    return {
      text: 'Your custom response',
      quickReplies: [/* ... */],
    };
  }
  
  // ...existing logic
}
```

## UI Customization

### Colors and Styling

The chat component uses Tailwind CSS and respects your theme:

```tsx
// Gradient colors
className="bg-gradient-to-r from-blue-500 to-purple-600"

// Dark mode support
className="bg-white dark:bg-gray-800"

// Custom colors
className="text-accent" // Uses your theme accent color
```

### Position

Change chat position in `CustomerServiceChat.tsx`:

```tsx
// Default: bottom-right
<div className="fixed bottom-6 right-6 z-50">

// Change to bottom-left
<div className="fixed bottom-6 left-6 z-50">
```

## Best Practices

### 1. Session Management
- Always start a session before sending messages
- End sessions when user navigates away
- Clean up session storage periodically

### 2. Error Handling
- Implement fallback responses for network errors
- Log errors for debugging
- Show user-friendly error messages

### 3. Performance
- Limit message history to last 10-20 messages
- Implement message throttling
- Use debouncing for typing indicators

### 4. User Experience
- Show typing indicators for better UX
- Provide quick replies for common questions
- Keep responses concise and actionable
- Use emoji for visual appeal

### 5. Analytics
- Track common questions
- Monitor response satisfaction
- Identify areas for improvement
- Analyze user intent patterns

## Future Enhancements

### Planned Features
- [ ] Advanced OpenAI integration
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File attachment support
- [ ] Screen sharing for support
- [ ] Live agent handoff
- [ ] Chat history export
- [ ] Sentiment analysis
- [ ] Automated follow-ups
- [ ] Integration with ticketing system

### Advanced OpenAI Integration

To enable advanced AI responses:

1. Add OpenAI API key to `.env`:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

2. Update `chat.controller.js`:
```javascript
// Install OpenAI SDK: npm install openai
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIResponse(message, history) {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant for YouTube Video Summarizer...'
    },
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    {
      role: 'user',
      content: message
    }
  ];
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    max_tokens: 500
  });
  
  return {
    text: completion.choices[0].message.content,
    metadata: { model: 'gpt-4' }
  };
}
```

## Testing

### Manual Testing

1. Open the application
2. Click the chat button (bottom-right)
3. Try these test messages:
   - "How do I summarize a video?"
   - "What formats are supported?"
   - "Pricing information"
   - "Contact support"

### Automated Testing

```typescript
// Example Jest test
import { chatService } from '@/services/chat.service';

describe('Chat Service', () => {
  it('should start a new session', async () => {
    const session = await chatService.startSession();
    expect(session).toHaveProperty('id');
  });
  
  it('should send a message and get response', async () => {
    await chatService.startSession();
    const response = await chatService.sendMessage('Hello');
    expect(response).toHaveProperty('text');
  });
});
```

## Troubleshooting

### Chat Not Appearing

1. Check if `CustomerServiceChat` is imported in App.tsx
2. Verify z-index is high enough (z-50 or higher)
3. Check for CSS conflicts

### API Errors

1. Verify backend server is running
2. Check CORS configuration
3. Ensure routes are properly registered
4. Check browser console for errors

### Styling Issues

1. Ensure Tailwind CSS is configured
2. Check dark mode settings
3. Verify icon library is installed (lucide-react)

## Support

For issues or questions:

- 📧 Email: aiempowerhq@gmail.com
- 🐛 GitHub Issues: [Open an issue](https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues)
- 📚 Documentation: See AGENTS_README.md

---

**Status:** ✅ Active and Ready  
**Last Updated:** January 8, 2026  
**Version:** 1.0.0

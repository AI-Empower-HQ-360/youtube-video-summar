import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'suggestion';
}

interface QuickReply {
  text: string;
  action: string;
}

export function CustomerServiceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const quickReplies: QuickReply[] = [
    { text: "How do I summarize a video?", action: "help-summarize" },
    { text: "What video formats are supported?", action: "help-formats" },
    { text: "Can I export summaries?", action: "help-export" },
    { text: "Pricing information", action: "help-pricing" },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(
          "👋 Hi! I'm your AI assistant. How can I help you today?",
          'text'
        );
      }, 500);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, type: 'text' | 'quick-reply' | 'suggestion' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type,
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (!isOpen || isMinimized) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    addUserMessage(messageText);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(messageText);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Help with summarization
    if (lowerMessage.includes('summarize') || lowerMessage.includes('how to')) {
      return "To summarize a video:\n\n1. Paste the YouTube URL in the input field\n2. Click 'Summarize' button\n3. Wait for AI to generate the summary\n4. Review and export your summary!\n\nNeed more help?";
    }

    // Supported formats
    if (lowerMessage.includes('format') || lowerMessage.includes('support')) {
      return "We support all YouTube video formats:\n\n✅ Regular YouTube videos\n✅ YouTube Shorts\n✅ Live streams (recorded)\n✅ Playlists\n\nJust paste any YouTube URL and we'll handle the rest!";
    }

    // Export options
    if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      return "You can export summaries in multiple formats:\n\n📄 PDF - Professional document\n📝 Markdown - For developers\n📧 Email - Send to yourself\n🔗 Share link - Share with others\n\nClick the 'Export' button after generating a summary!";
    }

    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pay')) {
      return "Our pricing plans:\n\n🆓 Free: 5 summaries/day\n💼 Pro: $9.99/month - Unlimited summaries\n🏢 Team: $29.99/month - Multiple users\n\nAll plans include AI-powered summaries and exports!";
    }

    // API usage
    if (lowerMessage.includes('api') || lowerMessage.includes('integrate')) {
      return "Yes! We offer a REST API for developers:\n\n🔑 Get API key from Dashboard\n📚 Full documentation available\n🚀 Rate limits based on your plan\n\nWant to see the API docs?";
    }

    // Accuracy
    if (lowerMessage.includes('accurate') || lowerMessage.includes('quality')) {
      return "Our AI uses advanced language models to:\n\n✅ Extract key points accurately\n✅ Maintain context and meaning\n✅ Identify important timestamps\n✅ Summarize in multiple languages\n\nAccuracy: ~95% for clear audio!";
    }

    // Language support
    if (lowerMessage.includes('language')) {
      return "We support 50+ languages:\n\n🌍 English, Spanish, French, German\n🌏 Chinese, Japanese, Korean\n🌎 Portuguese, Italian, Russian\n...and many more!\n\nSummaries can be translated too!";
    }

    // Troubleshooting
    if (lowerMessage.includes('error') || lowerMessage.includes('not work') || lowerMessage.includes('problem')) {
      return "Let me help troubleshoot:\n\n1. Check if the YouTube URL is valid\n2. Ensure the video is public\n3. Try refreshing the page\n4. Check your internet connection\n\nStill having issues? Share the error message!";
    }

    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return "Need more assistance?\n\n📧 Email: aiempowerhq@gmail.com\n💬 Live chat: Right here!\n📚 Docs: /documentation\n🐛 Report bug: GitHub Issues\n\nHow else can I help?";
    }

    // Default response
    return "I'm here to help! I can assist with:\n\n• How to use the summarizer\n• Supported formats\n• Export options\n• Pricing plans\n• Technical support\n\nWhat would you like to know?";
  };

  const handleQuickReply = (action: string) => {
    const quickReply = quickReplies.find(qr => qr.action === action);
    if (quickReply) {
      handleSendMessage(quickReply.text);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 relative"
          aria-label="Open customer service chat"
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[600px]'
        } w-[380px] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-blue-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      message.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.action}
                      onClick={() => handleQuickReply(reply.action)}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Available 24/7
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

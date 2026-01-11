/**
 * Test Fixtures: Mock Data for E2E Tests
 * Provides consistent test data across all E2E and functional tests
 */

export const TEST_USERS = {
  free: {
    email: 'freeuser@example.com',
    name: 'Free User',
    password: 'FreePass123!',
    subscription: 'free',
  },
  pro: {
    email: 'prouser@example.com',
    name: 'Pro User',
    password: 'ProPass123!',
    subscription: 'pro',
  },
  premium: {
    email: 'premiumuser@example.com',
    name: 'Premium User',
    password: 'PremiumPass123!',
    subscription: 'premium',
  },
  enterprise: {
    email: 'enterpriseuser@example.com',
    name: 'Enterprise User',
    password: 'EnterprisePass123!',
    subscription: 'enterprise',
  },
  new: {
    email: 'newuser@example.com',
    name: 'New User',
    password: 'NewPass123!',
    subscription: null,
  },
};

export const TEST_VIDEOS = {
  valid: [
    {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      duration: '3:33',
      views: '1.4B',
    },
    {
      url: 'https://youtu.be/9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      duration: '4:13',
      views: '4.6B',
    },
    {
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      title: 'Me at the zoo',
      duration: '0:19',
      views: '287M',
    },
  ],
  invalid: [
    'not-a-url',
    'https://www.google.com',
    'https://vimeo.com/123456',
    'youtube.com',
    'www.youtube.com/watch?v=',
    'https://www.youtube.com/watch?v=INVALID_ID',
  ],
  formats: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLAYLIST',
  ],
};

export const MOCK_SUMMARIES = {
  quick: {
    type: 'quick',
    title: 'Quick Summary',
    content: `This video discusses key concepts in artificial intelligence and machine learning. 
The presenter covers neural networks, deep learning, and their real-world applications. 
Main topics include data preprocessing, model training, and evaluation metrics.`,
  },
  full: {
    type: 'full',
    title: 'Full Analysis',
    content: `# Full Video Analysis

## Overview
This comprehensive video explores the fundamentals of artificial intelligence and machine learning, 
providing viewers with a deep understanding of core concepts and practical applications.

## Key Topics
1. Introduction to AI and ML
2. Neural Network Architecture
3. Deep Learning Techniques
4. Training and Optimization
5. Real-world Applications

## Detailed Summary
The video begins with an introduction to artificial intelligence...
(Full detailed analysis of the video content)

## Conclusion
The presenter concludes with practical tips for implementing these concepts.`,
  },
  keyPoints: {
    type: 'keypoints',
    title: 'Key Points',
    content: `• Introduction to AI fundamentals
• Neural networks and their architecture
• Deep learning techniques and best practices
• Model training and optimization strategies
• Evaluation metrics and performance analysis
• Real-world applications and case studies
• Common pitfalls and how to avoid them
• Future trends in AI and ML`,
  },
};

export const TEST_PRICING_PLANS = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'month',
    features: [
      '5 summaries per month',
      'Basic summary features',
      'Email support',
      'Community access',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    features: [
      '100 summaries per month',
      'All summary types',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Export options',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    features: [
      'Unlimited summaries',
      'All pro features',
      'Custom branding',
      '24/7 phone support',
      'Dedicated account manager',
      'Advanced API access',
      'White-label options',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'month',
    features: [
      'Everything in Premium',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Custom training',
      'Volume discounts',
    ],
  },
};

export const PAYMENT_TEST_CARDS = {
  valid: {
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123',
    zip: '12345',
  },
  declined: {
    number: '4000 0000 0000 0002',
    expiry: '12/25',
    cvc: '123',
    zip: '12345',
  },
  insufficient: {
    number: '4000 0000 0000 9995',
    expiry: '12/25',
    cvc: '123',
    zip: '12345',
  },
  expired: {
    number: '4000 0000 0000 0069',
    expiry: '12/20',
    cvc: '123',
    zip: '12345',
  },
};

export const MOCK_API_RESPONSES = {
  success: {
    status: 'success',
    data: {
      summary: MOCK_SUMMARIES.quick.content,
      videoInfo: {
        title: 'Test Video Title',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:33',
        views: '1.4B',
      },
    },
  },
  error: {
    status: 'error',
    message: 'Failed to generate summary',
    code: 'GENERATION_FAILED',
  },
  unauthorized: {
    status: 'error',
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED',
  },
  rateLimit: {
    status: 'error',
    message: 'Rate limit exceeded',
    code: 'RATE_LIMIT_EXCEEDED',
  },
};

export const TEST_VIEWPORT_SIZES = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
  },
  desktop: {
    width: 1920,
    height: 1080,
    name: 'Desktop HD',
  },
  largeDesktop: {
    width: 2560,
    height: 1440,
    name: 'Desktop 2K',
  },
};

export const TEST_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export const ERROR_MESSAGES = {
  invalidUrl: /invalid url|not a valid|please enter a valid/i,
  networkError: /network error|connection failed|offline/i,
  unauthorized: /unauthorized|not authorized|please sign in/i,
  rateLimit: /rate limit|too many requests|try again later/i,
  videoUnavailable: /unavailable|not found|cannot access|private/i,
  timeout: /timeout|taking too long|timed out/i,
  invalidEmail: /invalid email|valid email address/i,
  weakPassword: /weak|password too short|at least 8 characters/i,
  requiredField: /required|please fill|this field is required/i,
  invalidCard: /invalid card|card number invalid/i,
};

export const SUCCESS_MESSAGES = {
  signUp: /success|welcome|account created|signed up/i,
  signIn: /success|welcome back|signed in/i,
  signOut: /signed out|goodbye/i,
  copied: /copied|copy successful/i,
  paymentSuccess: /success|thank you|payment received|subscription activated/i,
  summaryGenerated: /summary generated|analysis complete|ready/i,
};

export const LOADING_STATES = {
  processing: /processing|analyzing|generating|loading/i,
  saving: /saving|updating/i,
  loading: /loading|please wait/i,
};

export const PAGE_TITLES = {
  home: /youtube|video summarizer|transform/i,
  features: /features|capabilities|what we offer/i,
  pricing: /pricing|plans|choose your plan/i,
  documentation: /documentation|getting started|guides/i,
  api: /api reference|api documentation|endpoints/i,
  blog: /blog|articles|posts/i,
  dashboard: /dashboard|my summaries|usage/i,
  checkout: /checkout|payment|order summary/i,
  privacy: /privacy policy|data collection/i,
  terms: /terms of service|agreement/i,
  contact: /contact|get in touch/i,
};

export const TEST_TIMEOUTS = {
  short: 3000,
  medium: 5000,
  long: 10000,
  veryLong: 30000,
  api: 15000,
  animation: 1000,
};

export const NETWORK_CONDITIONS = {
  fast: {
    downloadThroughput: (50 * 1024 * 1024) / 8,
    uploadThroughput: (20 * 1024 * 1024) / 8,
    latency: 20,
  },
  slow: {
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 200,
  },
  offline: null,
};

/**
 * Generate random test data
 */
export const generateTestData = {
  email: (prefix: string = 'test') => 
    `${prefix}.${Date.now()}@example.com`,
  
  name: (prefix: string = 'Test User') => 
    `${prefix} ${Math.floor(Math.random() * 10000)}`,
  
  password: () => 
    `Pass${Math.random().toString(36).substring(2, 10)}!`,
  
  videoUrl: () => 
    `https://www.youtube.com/watch?v=${Math.random().toString(36).substring(2, 13)}`,
};

/**
 * Assertion helpers
 */
export const assertions = {
  isValidEmail: (email: string) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  isValidYouTubeUrl: (url: string) => 
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}/.test(url),
  
  isValidPassword: (password: string) => 
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
};

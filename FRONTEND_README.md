# Frontend Framework Documentation

## 📋 Overview

Complete React + TypeScript frontend framework for the YouTube Video Summarizer application with comprehensive labeling and type safety.

## 🏗️ Project Structure

```
src/
├── contexts/              # React Context (labeled)
│   ├── AppContext.tsx
│   └── SummaryContext.tsx
│
├── services/             # API Services (labeled)
│   ├── api.service.ts
│   ├── youtube.api.ts
│   └── summary.api.ts
│
├── hooks/                # Custom Hooks (labeled)
│   ├── useYouTube.ts
│   ├── useSummary.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── utils/                # Utility Functions (labeled)
│   ├── validators.ts
│   ├── formatters.ts
│   └── errors.ts
│
├── types/                # TypeScript Types (labeled)
│   └── index.ts
│
├── constants/            # Constants (labeled)
│   └── index.ts
│
├── config/               # Configuration (labeled)
│   └── env.ts
│
├── components/           # React Components (existing)
│   ├── ui/              # Shadcn UI components
│   └── [pages]          # Page components
│
└── lib/                 # Existing utilities
    ├── ai.ts
    ├── utils.ts
    └── youtube.ts
```

## 📝 Labels Guide

Every file includes descriptive labels:

```typescript
/**
 * @label Component/Function Name
 * @description Detailed explanation of purpose
 */
```

## 🎯 Core Features

### **1. Context Management**
- ✅ `AppContext` - Global app state
- ✅ `SummaryContext` - Summary data state
- Custom hooks for easy access

### **2. API Services**
- ✅ `api.service.ts` - HTTP client with interceptors
- ✅ `youtube.api.ts` - YouTube operations
- ✅ `summary.api.ts` - AI summarization
- Type-safe responses

### **3. Custom Hooks**
- ✅ `useYouTube` - YouTube operations
- ✅ `useSummary` - AI summarization
- ✅ `useLocalStorage` - Persist state
- ✅ `useDebounce` - Debounce values

### **4. Utilities**
- ✅ **Validators** - Input validation
- ✅ **Formatters** - Data formatting
- ✅ **Errors** - Error handling
- All with clear labels

### **5. Type System**
- ✅ Comprehensive TypeScript types
- ✅ API response types
- ✅ Component prop types
- ✅ Utility types

### **6. Constants**
- ✅ API configuration
- ✅ Storage keys
- ✅ Routes
- ✅ Error/success messages
- ✅ Regex patterns

## 🚀 Usage Examples

### Using Context

```typescript
import { useAppContext } from '@/contexts/AppContext';

function MyComponent() {
  const { videoUrl, setVideoUrl, isLoading } = useAppContext();
  
  return <div>{/* Your component */}</div>;
}
```

### Using Hooks

```typescript
import { useYouTube } from '@/hooks/useYouTube';

function VideoProcessor() {
  const { fetchTranscript, transcript, isLoading } = useYouTube();
  
  const handleFetch = async (videoId: string) => {
    await fetchTranscript(videoId);
  };
  
  return <div>{/* Your component */}</div>;
}
```

### Using API Services

```typescript
import { youtubeApi } from '@/services/youtube.api';

async function getVideoData(videoId: string) {
  const transcript = await youtubeApi.getTranscript(videoId);
  const metadata = await youtubeApi.getMetadata(videoId);
  return { transcript, metadata };
}
```

### Using Validators

```typescript
import { validators } from '@/utils/validators';

function validateInput(url: string) {
  if (!validators.isValidYouTubeUrl(url)) {
    throw new Error('Invalid YouTube URL');
  }
}
```

### Using Formatters

```typescript
import { formatters } from '@/utils/formatters';

function displayDuration(seconds: number) {
  return formatters.formatDuration(seconds); // "1:23:45"
}

function displayViews(count: number) {
  return formatters.formatCompactNumber(count); // "1.2M"
}
```

## 🔧 Environment Setup

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_VERSION=1.0.0
VITE_GITHUB_TOKEN=your_token_here
VITE_OPENAI_API_KEY=your_key_here
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 🎨 Integration with App.tsx

Wrap your app with providers:

```typescript
import { AppProvider } from '@/contexts/AppContext';
import { SummaryProvider } from '@/contexts/SummaryContext';

function App() {
  return (
    <AppProvider>
      <SummaryProvider>
        {/* Your app components */}
      </SummaryProvider>
    </AppProvider>
  );
}
```

## 📦 Type Safety

All services return typed responses:

```typescript
// Automatic type inference
const transcript = await youtubeApi.getTranscript(videoId);
// transcript is typed as string

const metadata = await youtubeApi.getMetadata(videoId);
// metadata is typed as VideoMetadata
```

## 🛡️ Error Handling

Centralized error handling:

```typescript
import { errorUtils } from '@/utils/errors';

try {
  await youtubeApi.getTranscript(videoId);
} catch (error) {
  const message = errorUtils.handleError(error);
  console.error(message);
}
```

## 🔍 Available Utilities

### Validators
- `isValidYouTubeUrl()`
- `isValidUrl()`
- `isEmpty()`
- `hasMinLength()`
- `hasMaxLength()`
- `isValidEmail()`

### Formatters
- `formatDuration()`
- `formatDate()`
- `formatRelativeTime()`
- `formatNumber()`
- `formatCompactNumber()`
- `truncateText()`
- `capitalizeFirst()`
- `toTitleCase()`

### Error Utilities
- `parseApiError()`
- `getErrorCode()`
- `isNetworkError()`
- `isTimeoutError()`
- `isRateLimitError()`
- `handleError()`

## 📚 Constants

Access via imports:

```typescript
import { 
  API_CONFIG, 
  ROUTES, 
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} from '@/constants';

// Usage
const apiUrl = API_CONFIG.BASE_URL;
const errorMsg = ERROR_MESSAGES.INVALID_URL;
```

## ✅ Benefits

1. **Type Safety** - Full TypeScript coverage
2. **Reusability** - Shared hooks and utilities
3. **Maintainability** - Clear labels and structure
4. **Consistency** - Standardized patterns
5. **Testability** - Isolated, testable units
6. **Documentation** - Self-documenting code

## 🚀 Next Steps

1. Import providers in your App.tsx
2. Replace direct API calls with service methods
3. Use custom hooks in components
4. Add `.env.local` with your configuration
5. Leverage TypeScript for type safety

## 📄 License

MIT

# 🎉 Multi-Language Support - Quick Start

## What's New?

VidNote AI now supports **50+ languages** for video summarization!

## Quick Usage

### 1. Basic Multi-Language Summarization

```typescript
// Spanish video, English summary
const result = await processYouTubeVideo('https://youtube.com/watch?v=VIDEO_ID', {
  sourceLanguage: 'es',
  targetLanguage: 'en'
});

// Auto-detect and summarize
const result = await processYouTubeVideo('https://youtube.com/watch?v=VIDEO_ID');
```

### 2. Using Language Selector UI

```tsx
import { LanguageSelectorPair } from '@/components/LanguageSelector';

function MyComponent() {
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');

  return (
    <LanguageSelectorPair
      sourceLanguage={sourceLanguage}
      targetLanguage={targetLanguage}
      onSourceChange={setSourceLanguage}
      onTargetChange={setTargetLanguage}
    />
  );
}
```

## Supported Languages (50+)

### Popular (12)
🇬🇧 English • 🇪🇸 Spanish • 🇫🇷 French • 🇩🇪 German • 🇮🇹 Italian • 🇵🇹 Portuguese • 🇷🇺 Russian • 🇯🇵 Japanese • 🇰🇷 Korean • 🇨🇳 Chinese • 🇸🇦 Arabic • 🇮🇳 Hindi

### European (22)
Dutch, Polish, Turkish, Swedish, Danish, Norwegian, Finnish, Czech, Greek, Hungarian, Romanian, Ukrainian, Catalan, Croatian, Serbian, Slovak, Slovenian, Bulgarian, Lithuanian, Latvian, Estonian, Icelandic

### Asian (14)
Bengali, Tamil, Telugu, Marathi, Thai, Vietnamese, Indonesian, Malay, Filipino

### Middle Eastern (4)
Hebrew, Persian, Urdu

### African (2)
Swahili, Afrikaans

## Key Features

✅ **Auto-Detect** - Automatically identifies video language  
✅ **Cross-Language** - Summarize in any language, get results in another  
✅ **Native Scripts** - Full support for Arabic, Chinese, Japanese, etc.  
✅ **RTL Support** - Right-to-left languages (Arabic, Hebrew, Persian)  
✅ **Beautiful UI** - Search, filter, and select languages easily  
✅ **Dark Mode** - All components support dark mode  
✅ **Mobile Ready** - Responsive design for all devices  

## API Endpoints

### POST /api/summary/generate

```json
{
  "transcript": "Video transcript...",
  "sourceLanguage": "es",
  "targetLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Summary in English...",
    "detectedLanguage": "es",
    "targetLanguage": "en"
  }
}
```

## Components

### LanguageSelector
Single language dropdown with search and tabs

### LanguageSelectorPair
Dual selector for source and target languages

## Documentation

📚 **Full Guide:** [MULTI_LANGUAGE_GUIDE.md](./MULTI_LANGUAGE_GUIDE.md)  
📖 **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
🎯 **Main README:** [README.md](./README.md)

## Examples

### Example 1: Spanish to English
```typescript
const result = await processYouTubeVideo(
  'https://youtube.com/watch?v=VIDEO_ID',
  { sourceLanguage: 'es', targetLanguage: 'en' }
);
```

### Example 2: Auto-Detect Japanese
```typescript
const result = await processYouTubeVideo(
  'https://youtube.com/watch?v=VIDEO_ID',
  { targetLanguage: 'en' } // Auto-detect source
);
```

### Example 3: Arabic (RTL) to French
```typescript
const result = await processYouTubeVideo(
  'https://youtube.com/watch?v=VIDEO_ID',
  { sourceLanguage: 'ar', targetLanguage: 'fr' }
);
```

## Files Changed

### New Files
- `src/lib/language-support.ts` - 50+ language definitions and utilities
- `src/components/LanguageSelector.tsx` - Language selection UI components
- `MULTI_LANGUAGE_GUIDE.md` - Comprehensive documentation

### Updated Files
- `src/lib/youtube-ai.ts` - Multi-language video processing
- `src/lib/agents/specialized-agents.ts` - Multi-language AI agents
- `src/components/EnhancedVideoSummary.tsx` - Language selector integration
- `src/types/index.ts` - Language-aware types
- `server/src/services/summary.service.js` - Backend language support
- `server/src/controllers/summary.controller.js` - API language parameters

## Quick Test

1. Open the app
2. Paste a YouTube URL (any language)
3. Select "Video Language" (or leave as Auto-detect)
4. Select "Summary Language" (your preferred language)
5. Click "Full Analysis" or "Quick Summary"
6. See results in your chosen language!

## Support

📧 Email: aiempowerhq@gmail.com  
🐛 Issues: [GitHub Issues](https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues)

---

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** January 8, 2026

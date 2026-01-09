# ✨ VidNote

![Last Updated](https://img.shields.io/badge/Updated-2026-01-08-blue) ![Languages](https://img.shields.io/badge/Languages-50+-green) ![AI Powered](https://img.shields.io/badge/AI-Powered-purple) ![GitHub Pages Deploy](https://github.com/AI-Empower-HQ-360/youtube-video-summar/actions/workflows/deploy.yml/badge.svg) [![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-green)](https://ai-empower-hq-360.github.io/youtube-video-summar/) - Turn YouTube Videos Into Instant Knowledge

**VidNote** is an AI-powered web application that transforms any YouTube video into digestible summaries, key points, and Q&A in seconds. **Now with support for 50+ languages!** Perfect for students, professionals, and anyone who wants to learn faster.

## 🌐 Live Demo

**Try it now:** [https://ai-empower-hq-360.github.io/youtube-video-summar/](https://ai-empower-hq-360.github.io/youtube-video-summar/)

---

## �🌟 What Does VidNote Do?

VidNote helps you save time and learn more efficiently by:

- **📝 Generating Summaries** - Get a clear, concise overview of any video's content
- **🎯 Extracting Key Points** - Receive 5-8 essential takeaways as bullet points
- **❓ Creating Q&A** - Auto-generate study questions with detailed answers
- **📋 Easy Copying** - Copy any section to clipboard with one click

Simply paste a YouTube URL, click Generate, and watch as AI transforms hours of video into minutes of focused learning.

---

## 💡 Why Use VidNote?

### ⚡ Time Saving
Turn a 30-minute video into a 2-minute read. Focus on knowledge, not time.

### 🧠 Learning-Friendly
Get structured content: summaries for overview, bullet points for quick reference, Q&A for testing understanding.

### 🎓 Zero Effort
No signup required initially. Just paste a link and get instant results.

### 🤖 AI-Powered
Uses advanced language models to ensure summaries are accurate, coherent, and human-like.

---

## 👥 Who Is It For?

- **📚 Students** - Convert lecture videos into study notes and exam prep material
- **💼 Professionals** - Quickly understand tech talks, tutorials, and training videos
- **🎯 Interview Prep** - Generate questions and answers for interview practice
- **✍️ Content Creators** - Repurpose video content into blog posts or newsletters
- **🧠 Lifelong Learners** - Explore new topics without watching full videos

---

## 🚀 Features

### Core Functions

1. **YouTube URL Input**
   - Paste any public YouTube video link
   - Real-time URL validation
   - One-click "Generate" button

2. **Auto Transcript Extraction**
   - Automatically reads video captions
   - Works with any video that has subtitles enabled
   - Supports multiple languages

3. **AI Summary Generation**
   - 3-5 paragraph overview of video content
   - Written in clear, human-like language
   - Completed in seconds

4. **Key Points Extraction**
   - 5-8 most important takeaways
   - Numbered for easy reference
   - Perfect for notes and revision

5. **Q&A Generation**
   - 5-7 meaningful questions based on content
   - Comprehensive answers for each question
   - Great for self-testing and study prep

6. **Copy to Clipboard**
   - One-click copy for each section
   - Instant feedback with toast notifications
   - Share or save content easily

---

## 💰 Pricing

VidNote offers three simple pricing tiers:

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/forever | 1 video per day, videos up to 30 min, all core features |
| **Basic** | $22/month | 50 videos/month, videos up to 2 hours, history & priority processing |
| **Pro** | $45/month | Unlimited videos, videos up to 5 hours, PDF export, advanced features |

All plans include:
- Summary generation
- Key points extraction
- Q&A creation
- Copy to clipboard
- Secure & private processing

---

## 🎨 Design & Experience

VidNote features a modern, dark-themed interface with:
- **Deep blue & violet color palette** for intelligence and trust
- **Space Grotesk & Inter fonts** for modern readability
- **Smooth animations** that guide you through the generation process
- **Mobile-responsive** design that works on any device

---

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Shadcn UI** components
- **Spark AI Runtime** for LLM processing
- **YouTube Transcript API** for caption extraction
- **Framer Motion** for animations

---

## 🧩 How It Works

1. User pastes a YouTube video URL
2. VidNote validates the URL and extracts the video ID
3. System fetches the video transcript/captions
4. AI processes the transcript to generate:
   - A comprehensive summary
   - Key bullet points
   - Q&A pairs
5. Results display in organized, copyable sections
6. User can copy any section to clipboard

---

## 🧪 Testing

VidNote has comprehensive test coverage:

### Unit & Integration Tests (Vitest)
```bash
npm run test              # Run all unit tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run with interactive UI
npm run test:e2e:debug    # Debug mode
npm run test:e2e:report   # View test report
```

### Test Coverage
- ✅ **100+ E2E test cases** across 8 test suites
- ✅ **7 browser configurations** (Chrome, Firefox, Safari, Edge, Mobile)
- ✅ **WCAG 2.1 AA accessibility** compliance
- ✅ **50+ languages** validated
- ✅ **Mobile responsiveness** tested on iPhone & iPad
- ✅ **Performance benchmarks** (LCP, FID, load times)

For detailed testing information, see:
- [E2E Testing Guide](E2E_TESTING_GUIDE.md)
- [Testing Documentation](TESTING.md)
- [Testing Guide](TESTING_GUIDE.md)

---

## 🔒 Privacy & Security

- No user data is stored permanently (unless you have an account)
- Video transcripts are processed in real-time
- All AI processing happens securely
- Your data is never shared with third parties

---

## 🚦 Getting Started

This is a Spark application. To run locally:

1. Open in a Spark-enabled Codespace
2. Dependencies are pre-installed
3. The app runs automatically via Vite dev server
4. Visit the local URL to start using VidNote

---

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

## 🌟 One-Line Value Proposition

> **"Turn any YouTube video into instant notes, key points, and Q&A."**

---

Built with 💜 using Spark AI Runtime

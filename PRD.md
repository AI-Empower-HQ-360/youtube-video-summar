# Planning Guide

A web application that transforms any YouTube video into instant, digestible knowledge through AI-powered summaries, key points extraction, and intelligent Q&A generation.

**Experience Qualities**:
1. **Effortless** - Single input, one click, instant results with zero friction or complexity
2. **Empowering** - Transforms hours of video content into minutes of focused learning, making users feel productive
3. **Intelligent** - AI-generated insights feel remarkably human and contextually aware, building trust through quality

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with clear inputs and outputs - paste link, generate summary, view/copy results. State management is straightforward (input URL, loading states, generated content), with multiple feature sections (summary, bullets, Q&A) that work together cohesively.

## Essential Features

### User Authentication (Sign In/Sign Up)
- **Functionality**: Complete authentication system with sign in, sign up, and user session management
- **Purpose**: Enable personalized features, usage tracking, and premium tier access control
- **Trigger**: User clicks "Sign In" button in the header navigation
- **Progression**: Click Sign In → Navigate to auth page → Choose sign in or sign up tab → Fill form → Submit → Return to home with authenticated state
- **Success criteria**: Persistent user sessions using KV storage, form validation (email format, password strength, matching passwords), error handling for duplicate emails and invalid credentials, visual feedback on success, dropdown menu showing user name and sign out option

### What is VidNote Section
- **Functionality**: Informational section that explains the product value proposition, core benefits, and target users
- **Purpose**: Immediately communicate what VidNote does and why users should care before they try it
- **Trigger**: Displays automatically on page load, positioned prominently after hero section
- **Progression**: User reads hero → Views "What is VidNote" explanation → Understands value → Proceeds to use the tool
- **Success criteria**: Clear value proposition in simple language, visual breakdown of key benefits (save time, learn smarter, zero effort), target audience tags that users can relate to, visually appealing with icons and structured layout

### YouTube URL Input & Validation
- **Functionality**: Single input field accepts YouTube video URLs, validates format, extracts video ID
- **Purpose**: Gateway to the entire experience - must be dead simple and foolproof
- **Trigger**: User pastes or types a YouTube URL
- **Progression**: User pastes URL → Real-time validation feedback → "Generate" button becomes active → Click to process
- **Success criteria**: Correctly identifies valid YouTube URLs (youtube.com/watch, youtu.be), shows clear error states for invalid inputs, extracts video ID reliably

### Transcript Extraction & Processing
- **Functionality**: Fetches video captions/subtitles from YouTube, processes text for AI analysis
- **Purpose**: Foundation for all AI features - needs to work reliably across different video types
- **Trigger**: User clicks "Generate" button with valid URL
- **Progression**: Valid URL submitted → Show loading state → Fetch transcript via API → Process text → Pass to AI analysis
- **Success criteria**: Successfully retrieves transcripts for public videos with captions, handles videos without captions gracefully, processes multi-language support

### AI Summary Generation
- **Functionality**: Uses Spark LLM API to generate concise, human-readable summary of video content
- **Purpose**: Primary time-saving feature - gives users instant understanding without watching
- **Trigger**: Transcript successfully extracted
- **Progression**: Transcript ready → Send to LLM with summary prompt → Receive 3-5 paragraph summary → Display in dedicated section
- **Success criteria**: Summaries are coherent, accurate to video content, written in natural language, completed within 10 seconds

### Key Points Extraction
- **Functionality**: AI identifies and extracts 5-8 most important takeaways as bullet points
- **Purpose**: Perfect for note-taking, revision, and quick reference
- **Trigger**: Runs in parallel with summary generation
- **Progression**: Transcript ready → Send to LLM with bullet extraction prompt → Receive structured list → Display with visual hierarchy
- **Success criteria**: Points are distinct and actionable, capture core concepts, formatted consistently, prioritized by importance

### Question & Answer Generation
- **Functionality**: Creates 5-7 meaningful questions with comprehensive answers based on video content
- **Purpose**: Enables self-testing, interview prep, and deeper understanding verification
- **Trigger**: Runs after summary and bullets complete
- **Progression**: Content analysis ready → Generate contextual questions → Create detailed answers → Display in Q&A format
- **Success criteria**: Questions test understanding at different levels, answers are complete and accurate, useful for study and preparation

### Copy to Clipboard
- **Functionality**: One-click copy for each section (summary, bullets, Q&A) or entire output
- **Purpose**: Users need to save and share their generated content easily
- **Trigger**: User clicks copy button on any section
- **Progression**: User clicks copy icon → Content copied to clipboard → Visual confirmation (toast notification) → User can paste elsewhere
- **Success criteria**: Copies formatted text properly, provides immediate feedback, works across all major browsers

### Pricing Display
- **Functionality**: Clear three-tier pricing structure (Free, Basic, Pro) with feature comparison and checkout integration
- **Purpose**: Transparent monetization and value communication for users considering upgrades
- **Trigger**: User scrolls to pricing section or navigates directly
- **Progression**: View pricing cards → Compare features → Select plan → Navigate to checkout page (for paid plans)
- **Success criteria**: Plans clearly differentiate value tiers, popular plan is visually highlighted, features are benefit-focused, mobile-responsive card layout, seamless transition to checkout

### Payment & Checkout
- **Functionality**: Complete payment form with credit/debit card details and billing address collection
- **Purpose**: Enable users to upgrade to paid plans with secure payment processing
- **Trigger**: User clicks on a paid plan button (Basic or Pro) from pricing section
- **Progression**: Select plan → Navigate to checkout → Fill card details → Enter billing address → Review order summary → Submit payment → Success confirmation
- **Success criteria**: Card number formatting with spaces, CVV masking, expiry date dropdowns, comprehensive address fields (line 1, line 2, city, state, ZIP, country), real-time validation with clear error messages, order summary sidebar showing selected plan details, secure payment indicators (lock icons, encryption messaging)

## Edge Case Handling

- **Checkout - Invalid Card Number**: Real-time validation showing error when card number is incomplete or invalid format
- **Checkout - Card Number Formatting**: Automatically formats card number with spaces (1234 5678 9012 3456) as user types
- **Checkout - Expired Card**: Validation to prevent selection of past expiry dates, clear error messaging
- **Checkout - CVV Validation**: Enforces 3-4 digit CVV with masking, shows error for incomplete CVV
- **Checkout - Missing Required Fields**: Highlights all empty required fields with red borders and error messages
- **Checkout - Invalid Email Format**: Real-time email validation with clear error messaging
- **Checkout - Free Plan Selection**: Shows success toast indicating user is already on free plan instead of navigating to checkout
- **Checkout - Payment Processing**: Loading state during payment with disabled submit button, simulated processing delay
- **Checkout - Payment Success**: Success toast notification and automatic redirect back to home page
- **Checkout - Form Persistence**: Form clears on successful payment, maintains values during validation errors
- **Duplicate Email Registration**: Clear error message that email is already registered, prompt to sign in instead
- **Invalid Login Credentials**: Generic error message for security (don't reveal if email exists), suggest password reset
- **Empty Form Fields**: Inline validation preventing submission, highlight empty required fields
- **Password Mismatch**: Real-time validation showing mismatch before submission
- **Weak Passwords**: Minimum 6 character requirement with clear error message
- **Session Persistence**: User stays logged in across page refreshes using KV storage
- **Invalid URLs**: Clear error message with example format, input field highlights in error state
- **Videos Without Captions**: Friendly message explaining captions are required, suggest enabling auto-generated captions
- **Private/Restricted Videos**: Error state explaining video must be public, privacy icon indicator
- **Very Long Videos (2+ hours)**: Warning that processing may take longer, progress indicator, potential truncation notice
- **Non-English Videos**: Support via transcript if available, note about language limitations
- **API Failures**: Graceful degradation with retry option, clear error messaging without technical jargon
- **Network Issues**: Timeout handling with friendly message, ability to retry without re-entering URL
- **Rapid Requests**: Basic rate limiting feedback, queue system for multiple requests

## Design Direction

The design should evoke **clarity, intelligence, and speed** - users should feel they're using a sophisticated tool that respects their time. The interface should feel modern and fresh with a knowledge/education aesthetic that's approachable, not academic. Visual hierarchy should guide users effortlessly from input to results, with generated content feeling premium and trustworthy. The overall mood is focused, efficient, and slightly futuristic without being cold.

## Color Selection

A vibrant, knowledge-focused palette that feels energetic yet professional, balancing approachability with intelligence.

- **Primary Color**: Deep Electric Blue (oklch(0.50 0.18 250)) - Represents intelligence, trust, and digital innovation. Used for primary actions and key interactive elements.
- **Secondary Colors**: 
  - Soft Slate (oklch(0.45 0.02 250)) - Supporting color for secondary UI elements and less prominent actions
  - Light Cloud (oklch(0.96 0.01 250)) - Subtle backgrounds that don't compete with content
- **Accent Color**: Vivid Violet (oklch(0.60 0.22 300)) - Eye-catching highlight for CTAs, success states, and important generated content markers
- **Foreground/Background Pairings**:
  - Primary Blue (oklch(0.50 0.18 250)): White text (oklch(0.99 0 0)) - Ratio 8.2:1 ✓
  - Accent Violet (oklch(0.60 0.22 300)): White text (oklch(0.99 0 0)) - Ratio 5.8:1 ✓
  - Background White (oklch(0.99 0 0)): Slate text (oklch(0.25 0.02 250)) - Ratio 12.1:1 ✓
  - Muted Gray (oklch(0.96 0.01 250)): Dark Gray text (oklch(0.35 0.02 250)) - Ratio 9.4:1 ✓

## Font Selection

Typography should communicate modern intelligence with excellent readability for both UI and content-heavy generated sections.

- **Display/Headings**: Space Grotesk (Bold) - Contemporary geometric sans with technical sophistication, perfect for the app title and section headers
- **Body/Interface**: Inter (Regular/Medium) - Highly readable at all sizes, professional without being boring, excellent for both UI controls and generated content

**Typographic Hierarchy**:
- H1 (App Title): Space Grotesk Bold / 36px / tight tracking (-0.02em)
- H2 (Section Headers): Space Grotesk Bold / 24px / tight tracking (-0.01em)
- H3 (Subsections): Inter SemiBold / 18px / normal tracking
- Body (Generated Content): Inter Regular / 16px / relaxed line-height (1.7)
- UI Labels: Inter Medium / 14px / normal tracking
- Captions: Inter Regular / 12px / slight letter-spacing (0.01em)

## Animations

Animations should emphasize the AI processing magic and guide attention through the content generation flow. Use purposeful motion to communicate progress and success. Key moments: (1) Smooth loading states during AI generation with pulsing effects that feel computational, (2) Content reveal animations that cascade in as each section completes - summary first, then bullets, then Q&A, (3) Subtle hover states on interactive elements that feel responsive and precise, (4) Success confirmation when copying content with a gentle bounce. Keep all transitions under 300ms except for content reveals which can be 400-500ms to feel substantial.

## Component Selection

- **Components**:
  - Input: Shadcn Input with custom validation states and icon prefix (YouTube logo)
  - Button: Shadcn Button with loading spinner integration for "Generate" action
  - Card: Shadcn Card for each content section (summary, bullets, Q&A) with header actions
  - Separator: Radix Separator between major sections for visual breathing room
  - ScrollArea: Shadcn ScrollArea for generated content sections that may overflow
  - Toast: Sonner for copy confirmations and error messages
  - Skeleton: Shadcn Skeleton for loading states during AI generation
  
- **Customizations**:
  - Custom YouTube URL validator with regex pattern matching
  - Animated gradient background using CSS (mesh gradient with primary/accent colors)
  - Custom copy button component with Phosphor icon and success state animation
  - Numbered bullet list component with custom styling for key points
  - Accordion-style Q&A component (using Shadcn Accordion) for space efficiency
  - Hero section with gradient text effect for value proposition

- **States**:
  - Input: default (with placeholder), focused (accent ring), error (red border + message), valid (subtle green indicator)
  - Generate Button: default, hover (slight scale + brightness), loading (spinner + disabled), disabled (muted)
  - Content Cards: loading (skeleton), populated (fade-in animation), empty state (helpful message)
  - Copy Buttons: default, hover (color shift), active (scale down), success (checkmark + toast)

- **Icon Selection**:
  - YouTube logo (custom or Phosphor) for input prefix
  - Sparkles (Phosphor) for AI-generated content indicators
  - Copy (Phosphor) for clipboard actions, transforms to Check after success
  - ArrowRight (Phosphor) for Generate button
  - Lightning (Phosphor) for speed/instant value messaging
  - Question (Phosphor) for Q&A section header
  - ListBullets (Phosphor) for key points section
  - Article (Phosphor) for summary section

- **Spacing**:
  - Page padding: px-6 md:px-12 (mobile responsive)
  - Section gaps: gap-8 (major sections), gap-4 (within sections)
  - Card padding: p-6
  - Content line height: leading-relaxed (1.7) for readability
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout throughout (no sidebars)
  - Full-width input and button on mobile
  - Stack all content sections vertically with consistent gap
  - Sticky header on scroll showing app name and current video title
  - Touch-friendly button sizes (minimum 44px height)
  - Collapsible Q&A accordion for space efficiency on small screens
  - Bottom padding to ensure content clears mobile browser chrome

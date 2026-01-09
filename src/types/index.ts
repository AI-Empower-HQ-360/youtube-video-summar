/**
 * @label Type Definitions
 * @description Centralized TypeScript type definitions
 */

// ============================================
// API TYPES
// ============================================

/**
 * @label API Response
 * @description Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
  };
}

/**
 * @label Paginated Response
 * @description Response structure for paginated data
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// VIDEO TYPES
// ============================================

/**
 * @label Video Metadata
 * @description YouTube video metadata
 */
export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  duration: number;
  viewCount: number;
  url: string;
  thumbnail: string;
  author?: string;
  publishedAt?: string;
}

/**
 * @label Video Transcript
 * @description Video transcript data
 */
export interface VideoTranscript {
  videoId: string;
  transcript: string;
  language?: string;        // ISO 639-1 language code (e.g., 'en', 'es', 'fr')
  detectedLanguage?: string; // Auto-detected language
  length: number;
}

// ============================================
// SUMMARY TYPES
// ============================================

/**
 * @label Summary Data
 * @description AI-generated summary
 */
export interface SummaryData {
  summary: string;
  keyPoints: string[];
  qaPairs: QAPair[];
  generatedAt: Date;
}

/**
 * @label Q&A Pair
 * @description Question and answer pair
 */
export interface QAPair {
  question: string;
  answer: string;
}

/**
 * @label Generation Options
 * @description Options for content generation
 */
export interface GenerationOptions {
  model?: string;
  temperature?: number;
  sourceLanguage?: string;  // Source content language
  targetLanguage?: string;  // Desired output language
  maxTokens?: number;
  language?: string;
}

// ============================================
// USER TYPES
// ============================================

/**
 * @label User
 * @description User account information
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

/**
 * @label User Preferences
 * @description User settings and preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  notifications: boolean;
}

// ============================================
// STATE TYPES
// ============================================

/**
 * @label Loading State
 * @description Loading state with error handling
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * @label Async State
 * @description Async operation state
 */
export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * @label Form State
 * @description Generic form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

/**
 * @label Video Input Form
 * @description Form for video URL input
 */
export interface VideoInputForm {
  url: string;
}

// ============================================
// COMPONENT PROPS
// ============================================

/**
 * @label Base Component Props
 * @description Common props for all components
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * @label Button Props
 * @description Props for button components
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * @label Optional Fields
 * @description Make specific fields optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * @label Required Fields
 * @description Make specific fields required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * @label Nullable
 * @description Make all fields nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Types are exported individually above
};

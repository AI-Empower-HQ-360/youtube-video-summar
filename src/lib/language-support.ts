/**
 * @label Language Support Utility
 * @description Multi-language detection and support for video summarization
 */

// ============================================
// SUPPORTED LANGUAGES
// ============================================

export interface Language {
  code: string;      // ISO 639-1 code
  name: string;      // English name
  nativeName: string; // Native name
  rtl?: boolean;     // Right-to-left script
}

export const SUPPORTED_LANGUAGES: Language[] = [
  // Most Common Languages
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  
  // European Languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  
  // Asian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  
  // Middle Eastern Languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  
  // Other Languages
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
];

// ============================================
// LANGUAGE UTILITIES
// ============================================

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => 
    lang.code.toLowerCase() === code.toLowerCase()
  );
}

/**
 * Get language name by code
 */
export function getLanguageName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.name : code;
}

/**
 * Get native language name by code
 */
export function getNativeLanguageName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.nativeName : code;
}

/**
 * Check if language uses RTL script
 */
export function isRTL(code: string): boolean {
  const lang = getLanguageByCode(code);
  return lang?.rtl === true;
}

/**
 * Detect language from text (basic heuristic)
 */
export function detectLanguage(text: string): string {
  // Simple language detection based on character patterns
  const sample = text.slice(0, 500); // Use first 500 chars
  
  // Check for specific scripts
  if (/[\u0600-\u06FF]/.test(sample)) return 'ar'; // Arabic
  if (/[\u0590-\u05FF]/.test(sample)) return 'he'; // Hebrew
  if (/[\u4E00-\u9FFF]/.test(sample)) return 'zh'; // Chinese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(sample)) return 'ja'; // Japanese
  if (/[\uAC00-\uD7AF]/.test(sample)) return 'ko'; // Korean
  if (/[\u0E00-\u0E7F]/.test(sample)) return 'th'; // Thai
  if (/[\u0900-\u097F]/.test(sample)) return 'hi'; // Hindi
  if (/[\u0980-\u09FF]/.test(sample)) return 'bn'; // Bengali
  if (/[\u0C80-\u0CFF]/.test(sample)) return 'te'; // Telugu
  if (/[\u0B80-\u0BFF]/.test(sample)) return 'ta'; // Tamil
  if (/[\u0400-\u04FF]/.test(sample)) return 'ru'; // Cyrillic (Russian)
  
  // For Latin-script languages, default to English
  // (In a production app, you'd use a proper language detection library)
  return 'en';
}

/**
 * Format language for AI prompt
 */
export function formatLanguageForPrompt(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.name : code;
}

/**
 * Get popular languages for quick selection
 */
export function getPopularLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang =>
    ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'].includes(lang.code)
  );
}

/**
 * Group languages by region
 */
export function getLanguagesByRegion(): Record<string, Language[]> {
  return {
    'Popular': getPopularLanguages(),
    'European': SUPPORTED_LANGUAGES.filter(lang =>
      ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'tr', 'sv', 'da', 'no', 'fi', 'cs', 'el', 'hu', 'ro', 'uk'].includes(lang.code)
    ),
    'Asian': SUPPORTED_LANGUAGES.filter(lang =>
      ['ja', 'ko', 'zh', 'zh-TW', 'hi', 'bn', 'ta', 'te', 'mr', 'th', 'vi', 'id', 'ms', 'tl'].includes(lang.code)
    ),
    'Middle Eastern': SUPPORTED_LANGUAGES.filter(lang =>
      ['ar', 'he', 'fa', 'ur'].includes(lang.code)
    ),
    'Other': SUPPORTED_LANGUAGES.filter(lang =>
      !['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl', 'pl', 'tr', 'sv', 'da', 'no', 'fi', 'cs', 'el', 'hu', 'ro', 'uk', 'ja', 'ko', 'zh', 'zh-TW', 'hi', 'bn', 'ta', 'te', 'mr', 'th', 'vi', 'id', 'ms', 'tl', 'ar', 'he', 'fa', 'ur'].includes(lang.code)
    ),
  };
}

// ============================================
// AI PROMPT HELPERS
// ============================================

/**
 * Generate language instruction for AI
 */
export function generateLanguageInstruction(
  sourceLanguage?: string,
  targetLanguage?: string
): string {
  if (!sourceLanguage && !targetLanguage) {
    return '';
  }

  const parts: string[] = [];

  if (sourceLanguage) {
    const sourceLangName = formatLanguageForPrompt(sourceLanguage);
    parts.push(`The source content is in ${sourceLangName}.`);
  }

  if (targetLanguage) {
    const targetLangName = formatLanguageForPrompt(targetLanguage);
    if (sourceLanguage && sourceLanguage !== targetLanguage) {
      parts.push(`Please provide the summary in ${targetLangName}, translating from the source language.`);
    } else {
      parts.push(`Please provide the summary in ${targetLangName}.`);
    }
  }

  return parts.join(' ');
}

/**
 * Generate multi-language summary prompt
 */
export function generateMultiLanguagePrompt(
  content: string,
  task: string,
  sourceLanguage?: string,
  targetLanguage?: string
): string {
  const languageInstruction = generateLanguageInstruction(sourceLanguage, targetLanguage);
  
  let prompt = task;
  
  if (languageInstruction) {
    prompt += `\n\n${languageInstruction}`;
  }
  
  if (targetLanguage) {
    const targetLangName = formatLanguageForPrompt(targetLanguage);
    prompt += `\n\nIMPORTANT: Your entire response must be in ${targetLangName}. All text, headings, bullet points, and explanations should be written in ${targetLangName}.`;
  }
  
  prompt += `\n\nContent:\n${content}`;
  
  return prompt;
}

// ============================================
// EXPORTS
// ============================================

export default {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  getLanguageName,
  getNativeLanguageName,
  isRTL,
  detectLanguage,
  formatLanguageForPrompt,
  getPopularLanguages,
  getLanguagesByRegion,
  generateLanguageInstruction,
  generateMultiLanguagePrompt,
};

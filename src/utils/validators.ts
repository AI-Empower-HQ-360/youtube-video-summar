/**
 * @label Validators
 * @description Input validation utilities
 */

// ============================================
// URL VALIDATORS
// ============================================

/**
 * @label Validate YouTube URL
 * @description Check if URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)[a-zA-Z0-9_-]{11}/,
    /^(https?:\/\/)?(www\.)?(youtu\.be\/)[a-zA-Z0-9_-]{11}/,
    /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/,
    /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)[a-zA-Z0-9_-]{11}/,
  ];

  return patterns.some(pattern => pattern.test(url));
}

/**
 * @label Validate URL Format
 * @description Check if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// STRING VALIDATORS
// ============================================

/**
 * @label Is Empty
 * @description Check if string is empty or whitespace
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * @label Has Min Length
 * @description Check if string meets minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return Boolean(value && value.trim().length >= minLength);
}

/**
 * @label Has Max Length
 * @description Check if string is within maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return Boolean(value && value.trim().length <= maxLength);
}

// ============================================
// EMAIL VALIDATORS
// ============================================

/**
 * @label Validate Email
 * @description Check if string is a valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// EXPORT ALL
// ============================================

export const validators = {
  isValidYouTubeUrl,
  isValidUrl,
  isEmpty,
  hasMinLength,
  hasMaxLength,
  isValidEmail,
};

export default validators;

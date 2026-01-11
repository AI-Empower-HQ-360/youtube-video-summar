/**
 * @label Validation Utilities
 * @description Input validation and checking utilities
 */

/**
 * @label Is Email
 * @description Validate email address format
 */
export function isEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * @label Is URL
 * @description Validate URL format (http/https)
 */
export function isUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * @label Is Phone Number
 * @description Validate phone number format (US format)
 */
export function isPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Check if remaining string is 10-11 digits
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(cleaned);
}

/**
 * @label Is Empty
 * @description Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * @label Is Alphanumeric
 * @description Check if string contains only letters and numbers
 */
export function isAlphanumeric(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(text);
}

/**
 * @label Is Numeric
 * @description Check if value is numeric
 */
export function isNumeric(value: any): boolean {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value !== 'string') return false;
  
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

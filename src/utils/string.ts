/**
 * @label String Utilities
 * @description String manipulation and transformation utilities
 */

/**
 * @label Truncate
 * @description Truncate string to specified length
 */
export function truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * @label Slugify
 * @description Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @label Capitalize
 * @description Capitalize first letter of string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @label To Camel Case
 * @description Convert string to camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * @label To Kebab Case
 * @description Convert string to kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * @label To Title Case
 * @description Convert string to Title Case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

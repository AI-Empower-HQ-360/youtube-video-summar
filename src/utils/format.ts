/**
 * @label Format Utilities
 * @description Number and currency formatting utilities
 */

/**
 * @label Format Number
 * @description Format number with thousands separators
 */
export function formatNumber(num: number, decimals?: number): string {
  if (decimals !== undefined) {
    num = Number(num.toFixed(decimals));
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * @label Format Bytes
 * @description Convert bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  // Remove unnecessary decimals for whole numbers
  const formatted = Number(value.toFixed(dm));
  
  return `${formatted} ${sizes[i]}`;
}

/**
 * @label Format Percentage
 * @description Convert decimal to percentage string
 */
export function formatPercentage(decimal: number, decimals: number = 0): string {
  const percentage = decimal * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * @label Format Currency
 * @description Format number as currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  
  const symbol = currencySymbols[currency] || '$';
  const formatted = Math.abs(amount).toFixed(2);
  const withCommas = Number(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return amount < 0 ? `-${symbol}${withCommas}` : `${symbol}${withCommas}`;
}

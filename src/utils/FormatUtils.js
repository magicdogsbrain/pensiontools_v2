/**
 * Formatting Utilities
 */

/**
 * Formats a number as GBP currency
 * @param {number} value - Value to format
 * @param {boolean} showPence - Whether to show pence (default: false for large values)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, showPence = null) {
  const absValue = Math.abs(value);
  const showDecimal = showPence !== null ? showPence : absValue < 100;

  const formatted = Math.abs(value).toLocaleString('en-GB', {
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0
  });

  return value < 0 ? `-£${formatted}` : `£${formatted}`;
}

/**
 * Formats a percentage
 * @param {number} value - Value as decimal (0.05 = 5%)
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted percentage
 */
export function formatPercent(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a date as a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (e.g., "15 Jan 2024")
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

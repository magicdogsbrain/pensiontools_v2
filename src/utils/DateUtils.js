/**
 * Date and Tax Year Utilities
 */

import { TAX_YEAR } from '../constants.js';

/**
 * Determines the tax year for a given date
 * UK tax year runs April 6 to April 5
 * @param {Date|string} date - Date to check
 * @returns {string} Tax year in format 'YY/YY' (e.g., '24/25')
 */
export function getTaxYear(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-indexed
  const day = d.getDate();

  // Before April 6 = previous tax year
  if (month < TAX_YEAR.START_MONTH ||
      (month === TAX_YEAR.START_MONTH && day < TAX_YEAR.START_DAY)) {
    const startYear = year - 1;
    return `${String(startYear).slice(-2)}/${String(year).slice(-2)}`;
  }

  // April 6 onwards = current tax year
  return `${String(year).slice(-2)}/${String(year + 1).slice(-2)}`;
}

/**
 * Gets the start date of a tax year
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Date} Start date (April 6)
 */
export function getTaxYearStart(taxYear) {
  const startYearShort = parseInt(taxYear.split('/')[0]);
  const startYear = startYearShort < 50 ? 2000 + startYearShort : 1900 + startYearShort;
  return new Date(startYear, TAX_YEAR.START_MONTH - 1, TAX_YEAR.START_DAY);
}

/**
 * Gets the end date of a tax year
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Date} End date (April 5)
 */
export function getTaxYearEnd(taxYear) {
  const endYearShort = parseInt(taxYear.split('/')[1]);
  const endYear = endYearShort < 50 ? 2000 + endYearShort : 1900 + endYearShort;
  return new Date(endYear, TAX_YEAR.START_MONTH - 1, TAX_YEAR.START_DAY - 1);
}

/**
 * Calculates months elapsed since a start date
 * @param {Date|string} startDate - Start date
 * @param {Date|string} currentDate - Current date
 * @returns {number} Months elapsed (can be fractional)
 */
export function getMonthsElapsed(startDate, currentDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const current = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;

  const years = current.getFullYear() - start.getFullYear();
  const months = current.getMonth() - start.getMonth();
  const days = current.getDate() - start.getDate();

  return years * 12 + months + (days / 30);
}

/**
 * Gets the current month in YYYY-MM format
 * @returns {string} Current month
 */
export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Parses a YYYY-MM string to a Date (15th of month)
 * Uses day 15 to avoid edge cases with UK tax year (which starts April 6)
 * @param {string} monthStr - Month in YYYY-MM format
 * @returns {Date} Date object
 */
export function parseMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  // Use day 15 to avoid edge case where April 1-5 is in previous tax year
  return new Date(year, month - 1, 15);
}

/**
 * Gets remaining months in the current tax year
 * @param {Date|string} currentDate - Current date
 * @returns {number} Remaining months (1-12)
 */
export function getRemainingTaxYearMonths(currentDate) {
  const d = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;
  const month = d.getMonth() + 1; // 1-indexed

  // Tax year runs April (4) to March (3)
  if (month >= TAX_YEAR.START_MONTH) {
    // April onwards: remaining = 12 - (month - 4) = 16 - month
    return 12 - (month - TAX_YEAR.START_MONTH);
  } else {
    // Jan-March: remaining = 4 - month
    return TAX_YEAR.START_MONTH - month;
  }
}

/**
 * Gets elapsed months in the current tax year
 * @param {Date|string} currentDate - Current date
 * @returns {number} Elapsed months (0-11)
 */
export function getElapsedTaxYearMonths(currentDate) {
  return 12 - getRemainingTaxYearMonths(currentDate);
}

/**
 * Calculates the year number since a reference start date
 * @param {Date|string} startDate - Reference start date
 * @param {Date|string} currentDate - Current date
 * @returns {number} Year number (0-indexed)
 */
export function getYearNumber(startDate, currentDate) {
  const months = getMonthsElapsed(startDate, currentDate);
  return Math.floor(months / 12);
}

/**
 * UK State Pension Utilities
 *
 * Handles State Pension calculations based on HMRC forecast data.
 * Uses the actual SP start date and weekly amount from the user's forecast.
 */

import { getTaxYear, getTaxYearStart, getTaxYearEnd } from './DateUtils.js';

/**
 * Parses a date string in various formats
 * Accepts: "21 April 2037", "2037-04-21", "21/04/2037"
 *
 * @param {string} dateStr - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseStatePensionDate(dateStr) {
  if (!dateStr) return null;

  const months = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11
  };

  // Normalize: trim and collapse whitespace
  const s = dateStr.trim().replace(/\s+/g, ' ');

  // Try ISO format (2037-04-21)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }

  // Try UK format with slashes (21/04/2037 or 21/4/2037)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [day, month, year] = s.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Try UK format with dashes (21-04-2037 or 21-4-2037)
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
    const [day, month, year] = s.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Try "21 April 2037" or "21 Apr 2037"
  let match = s.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);
  if (match) {
    const day = parseInt(match[1]);
    const month = months[match[2].toLowerCase()];
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // Try "April 21 2037" or "Apr 21 2037"
  match = s.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i);
  if (match) {
    const month = months[match[1].toLowerCase()];
    const day = parseInt(match[2]);
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // Try "April 21st 2037", "April 21st, 2037", "21st April 2037" etc.
  match = s.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i);
  if (match) {
    const month = months[match[1].toLowerCase()];
    const day = parseInt(match[2]);
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  match = s.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i);
  if (match) {
    const day = parseInt(match[1]);
    const month = months[match[2].toLowerCase()];
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/**
 * Formats a State Pension start date for display
 *
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date like "21 April 2037"
 */
export function formatStatePensionDate(date) {
  const d = typeof date === 'string' ? parseStatePensionDate(date) : date;
  if (!d || isNaN(d.getTime())) return '';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Calculates the annual State Pension amount from weekly
 *
 * Note: SP is paid every 4 weeks (13 times/year), not monthly.
 * Annual = Weekly × 52
 *
 * @param {number} weeklyAmount - Weekly State Pension amount
 * @returns {number} Annual amount
 */
export function weeklyToAnnual(weeklyAmount) {
  return weeklyAmount * 52;
}

/**
 * Calculates the monthly average State Pension amount
 *
 * For budgeting purposes, we use annual ÷ 12 even though
 * actual payments are 4-weekly (some months have 2 payments).
 *
 * @param {number} weeklyAmount - Weekly State Pension amount
 * @returns {number} Monthly average amount
 */
export function weeklyToMonthlyAverage(weeklyAmount) {
  return (weeklyAmount * 52) / 12;
}

/**
 * Calculates State Pension for a specific tax year
 *
 * Handles:
 * - Years before SP starts: returns 0
 * - First year: pro-rata based on start date
 * - Subsequent years: full amount, inflated by CPI
 *
 * @param {object} params - Calculation parameters
 * @param {string} params.taxYear - Tax year to calculate for ('YY/YY' format)
 * @param {Date|string} params.spStartDate - State Pension start date
 * @param {number} params.weeklyAmount - Weekly SP amount (today's money)
 * @param {object} params.taxYearConfigs - All tax year configs (for CPI data)
 * @returns {object} { annual, monthly, isReceiving, isFirstYear, weeksInYear, startDate }
 */
export function calculateStatePensionForTaxYear(params) {
  const {
    taxYear,
    spStartDate,
    weeklyAmount,
    taxYearConfigs = {}
  } = params;

  if (!spStartDate || !weeklyAmount || weeklyAmount <= 0) {
    return {
      annual: 0,
      monthly: 0,
      isReceiving: false,
      isFirstYear: false,
      weeksInYear: 0,
      startDate: null
    };
  }

  const startDate = typeof spStartDate === 'string'
    ? parseStatePensionDate(spStartDate)
    : spStartDate;

  if (!startDate || isNaN(startDate.getTime())) {
    return {
      annual: 0,
      monthly: 0,
      isReceiving: false,
      isFirstYear: false,
      weeksInYear: 0,
      startDate: null
    };
  }

  const spStartTaxYear = getTaxYear(startDate);
  const taxYearStart = getTaxYearStart(taxYear);
  const taxYearEnd = getTaxYearEnd(taxYear);

  // Compare tax years CHRONOLOGICALLY, not lexicographically.
  // Tax years are 'YY/YY' strings; a plain string sort places e.g. '70/71'
  // after '26/27', which would wrongly treat a 1970 date as the year 2070.
  // getTaxYearStart resolves the real calendar year, so sort by that.
  const sortedYears = [...new Set([spStartTaxYear, taxYear, ...Object.keys(taxYearConfigs)])]
    .sort((a, b) => getTaxYearStart(a).getTime() - getTaxYearStart(b).getTime());
  const spStartIndex = sortedYears.indexOf(spStartTaxYear);
  const currentIndex = sortedYears.indexOf(taxYear);

  // Before SP starts
  if (currentIndex < spStartIndex) {
    return {
      annual: 0,
      monthly: 0,
      isReceiving: false,
      isFirstYear: false,
      weeksInYear: 0,
      startDate: formatStatePensionDate(startDate)
    };
  }

  // Calculate cumulative CPI inflation from SP start year
  let cumulativeInflation = 1;
  for (let i = spStartIndex; i < currentIndex; i++) {
    const yr = sortedYears[i];
    const config = taxYearConfigs[yr];
    const cpi = config?.cpi || 0.025; // Default 2.5% if no CPI data
    cumulativeInflation *= (1 + cpi);
  }

  const inflatedWeekly = weeklyAmount * cumulativeInflation;

  // First year - pro-rata
  const isFirstYear = taxYear === spStartTaxYear;

  if (isFirstYear) {
    // Calculate weeks from SP start to end of tax year
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksInYear = Math.max(0, (taxYearEnd.getTime() - startDate.getTime()) / msPerWeek);
    const proRataAnnual = inflatedWeekly * weeksInYear;

    return {
      annual: proRataAnnual,
      monthly: proRataAnnual / 12,
      isReceiving: true,
      isFirstYear: true,
      weeksInYear: Math.round(weeksInYear * 10) / 10,
      startDate: formatStatePensionDate(startDate)
    };
  }

  // Full year
  const fullAnnual = inflatedWeekly * 52;

  return {
    annual: fullAnnual,
    monthly: fullAnnual / 12,
    isReceiving: true,
    isFirstYear: false,
    weeksInYear: 52,
    startDate: formatStatePensionDate(startDate)
  };
}

/**
 * Calculates years/months until State Pension starts
 *
 * @param {Date|string} spStartDate - State Pension start date
 * @param {Date} fromDate - Calculate from this date (defaults to now)
 * @returns {object} { years, months, totalMonths, isPast }
 */
export function getTimeUntilStatePension(spStartDate, fromDate = new Date()) {
  const startDate = typeof spStartDate === 'string'
    ? parseStatePensionDate(spStartDate)
    : spStartDate;

  if (!startDate || isNaN(startDate.getTime())) {
    return { years: 0, months: 0, totalMonths: 0, isPast: false };
  }

  const diffMs = startDate.getTime() - fromDate.getTime();
  const isPast = diffMs <= 0;

  if (isPast) {
    return { years: 0, months: 0, totalMonths: 0, isPast: true };
  }

  const totalMonths = Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths, isPast };
}

/**
 * Earliest plausible State Pension start date.
 * The current ("new") State Pension began 6 April 2016, so any start date
 * before this is almost certainly a date of birth or a typo.
 */
export const MIN_SP_START_YEAR = 2016;

/**
 * Validates a State Pension start date entered by the user.
 *
 * Guards against the common mistake of entering a date of birth instead of
 * the State Pension start date (which silently distorts every projection).
 *
 * @param {string} dateStr - Raw value from the input field
 * @param {object} [opts]
 * @param {Date} [opts.now] - Reference "today" (for testing); defaults to now
 * @returns {{ valid: boolean, error: string|null, warning: string|null, date: Date|null }}
 */
export function validateStatePensionDate(dateStr, { now = new Date() } = {}) {
  // Empty is allowed — State Pension is optional (weekly amount of 0 = not set).
  if (!dateStr || !String(dateStr).trim()) {
    return { valid: true, error: null, warning: null, date: null };
  }

  const date = parseStatePensionDate(dateStr);
  if (!date || isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'Could not read that date. Try a format like "6 May 2040".',
      warning: null,
      date: null
    };
  }

  const year = date.getFullYear();
  if (year < MIN_SP_START_YEAR) {
    return {
      valid: false,
      error: `That looks like a date of birth (${year}), not a State Pension start date. `
        + 'Enter the date your State Pension begins — check gov.uk/check-your-state-pension.',
      warning: null,
      date
    };
  }

  if (date.getTime() < now.getTime()) {
    return {
      valid: true,
      error: null,
      warning: `This date is in the past — State Pension will be treated as already `
        + `in payment from ${year}.`,
      date
    };
  }

  return { valid: true, error: null, warning: null, date };
}

/**
 * Derives the simulation-grid State Pension config ({spStartYear, spWeeklyAmount,
 * spFirstYearRatio}) from date-based settings, or null when no date/amount is set (callers
 * fall back to the legacy statePension/statePensionYear fields). Shared by the Stress config
 * builder and the deterministic Drawdown schedule so every projection sees the SAME start
 * year and first-year pro-rata. `now` is injectable for tests.
 */
/** Age today, aged forward from the date it was recorded (`currentAgeAsOf`) so a stored age does not go stale. */
export function currentAgeNow(settings, now = new Date()) {
  const a = +settings.currentAge || 0;
  if (!a) return 0;
  if (settings.currentAgeAsOf) { const t = Date.parse(settings.currentAgeAsOf); if (Number.isFinite(t)) return a + Math.max(0, (now.getTime() - t) / (365.25 * 24 * 3600 * 1000)); }
  return a;
}

export function spSimConfigFromSettings(settings, now = new Date()) {
  if (!settings.spStartDate || !settings.spWeeklyAmount) return null;
  const spDate = parseStatePensionDate(settings.spStartDate);
  if (!spDate) return null;
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  // Plan year 0 is the income-start age (retirement). For someone still working, that is
  // (shapeAgeNow − currentAge) years away, so the SP arrives that many plan years EARLIER than
  // "years from today". Without both ages the plan is assumed to start now (the old behaviour).
  let spStartYear;
  if (settings.shapeAgeNow > 0 && settings.currentAge > 0 && settings.shapeAgeNow > Math.floor(currentAgeNow(settings, now)) && spDate.getTime() > now.getTime()) {
    // Not yet retired: plan year 0 starts on the birthday the income begins, so count birthdays.
    // The State Pension date IS a birthday (State Pension age is reached on the birthday), so the age
    // at that date is today's age plus the number of birthdays between now and then — counted on the
    // SP date's own month/day. Plan year 0 is the birthday the income starts (shapeAgeNow), so the SP
    // starts in plan year (age at SP − start age). No birth date needed, no drift within the year.
    let birthdays = 0;
    for (let y = now.getFullYear(); y <= spDate.getFullYear(); y++) {
      const bd = new Date(y, spDate.getMonth(), spDate.getDate());
      if (bd.getTime() > now.getTime() && bd.getTime() <= spDate.getTime()) birthdays++;
    }
    const ageAtSp = Math.floor(currentAgeNow(settings, now)) + birthdays;
    spStartYear = Math.max(0, ageAtSp - settings.shapeAgeNow);
  } else {
    const yearsToStart = (settings.shapeAgeNow > 0 && settings.currentAge > 0) ? Math.max(0, settings.shapeAgeNow - currentAgeNow(settings, now)) : 0;
    const yearsUntilSp = Math.max(0, (spDate.getTime() - now.getTime()) / msPerYear - yearsToStart);
    spStartYear = Math.floor((Math.round(yearsUntilSp * 12) + 1) / 12);
  }
  const daysInYear = 365;
  const dayOfYear = Math.floor((spDate - new Date(spDate.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
  const firstYearRatio = (daysInYear - dayOfYear) / daysInYear;
  return { spStartYear, spWeeklyAmount: settings.spWeeklyAmount, spFirstYearRatio: firstYearRatio };
}


/**
 * Decision-side SP config: the Decision tool's plan years are UK TAX years (6 April), so the
 * State Pension starts in the plan year whose tax year contains the SP date — not floor(calendar
 * years from today). Returns { spStartYear, spWeeklyAmount, spFirstYearRatio } like the sim config.
 */
export function spTaxYearConfigFromSettings(settings, now = new Date()) {
  if (!settings.spStartDate || !settings.spWeeklyAmount) return null;
  const spDate = parseStatePensionDate(settings.spStartDate);
  if (!spDate) return null;
  const tyStart = (d) => (d.getMonth() > 3 || (d.getMonth() === 3 && d.getDate() >= 6)) ? d.getFullYear() : d.getFullYear() - 1;
  const spStartYear = Math.max(0, tyStart(spDate) - tyStart(now));
  const yStart = new Date(tyStart(spDate), 3, 6), yEnd = new Date(tyStart(spDate) + 1, 3, 6);
  const spFirstYearRatio = Math.max(0, Math.min(1, (yEnd - spDate) / (yEnd - yStart)));
  return { spStartYear, spWeeklyAmount: settings.spWeeklyAmount, spFirstYearRatio };
}

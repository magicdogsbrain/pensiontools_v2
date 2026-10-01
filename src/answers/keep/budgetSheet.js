/**
 * The budget sheet (research/v7/budget-step.md; save-as-plan.md Contract C.5). Pure: no clock (the date comes in), no
 * storage, no screen. It reuses today's budget model (src/services/BudgetModel.js) for the catalogue of lines, the
 * typical amounts and the amount parser, so the figures and the saved shape stay one.
 *
 * THE RULE: the budget is a guide. Nothing here, and nothing that reads it, decides the figure an answer uses — that
 * is always the one figure in the "What you would spend" box. The answers (src/answers/{a,b,c,shared}) never import
 * this file (tests/v7/boundaries.test.js).
 *
 *   HEADINGS, HEADING_OF                 the eight headings, and the heading of every catalogue line
 *   starterSheet()                       a new sheet: the catalogue's lines and one-off costs, amounts blank
 *   nextLineId(sheet), nextOneOffId(sheet)  the id an added line or one-off cost gets
 *   parseAmount(text)                    what was typed → { value } | { empty: true } | { problem }
 *   checkSheet(sheet, { household, level, today })   the sheet checked: rows for the screen, usable lines, totals, problems
 *   guideLevels(household)               the national guide levels (Retirement Living Standards), £ a month, whole
 *   whereAgainstLevels(monthly, household)  where a monthly total sits against them
 *   figureAgainstBudget(total, figure)   "your budget now adds up to … this uses …"
 *   carefulAgainstBudget(careful, total) question C's line: this gives £X a month less / more / about the same
 *   sheetForSeed(checked)                the checked sheet as the plan seed carries it (lines above £0 only), or null
 */
import { BUDGET_CATEGORIES, STARTER_ONEOFFS, typicalMonthlyFor, evalAmountExpr } from '../../services/BudgetModel.js';
import { spendLevelAMonth } from '../shared/schemaParts.js';

export const HEADINGS = Object.freeze(['home', 'bills', 'food', 'gettingAbout', 'holidays', 'health', 'family', 'other']);

/** Every line of BudgetModel's catalogue, by its label letter for letter, under the heading V7 shows it in. */
export const HEADING_OF = Object.freeze({
  'Rent / mortgage': 'home',
  'Council tax': 'home',
  'Home insurance': 'home',
  'Home upkeep': 'home',
  'Boiler service': 'home',
  'Home furnishings & décor': 'home',
  'Home technology': 'home',
  'Gas': 'bills',
  'Electricity': 'bills',
  'Water': 'bills',
  'Broadband': 'bills',
  'Mobile phones': 'bills',
  'TV licence': 'bills',
  'Premier banking / account fees': 'bills',
  'Streaming & entertainment': 'bills',
  'Digital subscriptions': 'bills',
  'Groceries & household': 'food',
  'Eating out & takeaways': 'food',
  'Car insurance': 'gettingAbout',
  'Car tax': 'gettingAbout',
  'Petrol / fuel': 'gettingAbout',
  'Car servicing & maintenance': 'gettingAbout',
  'Main holiday': 'holidays',
  'UK breaks': 'holidays',
  'Day trips': 'holidays',
  'Personal health': 'health',
  'Gym & fitness': 'health',
  'Kids / dependents': 'family',
  'Gifts & family': 'family',
  'Charity': 'family',
  'Pets': 'family',
  'Clothes': 'other',
  'Sports & equipment': 'other',
  'Sports clothes': 'other',
  'Hobbies & leisure': 'other',
  'Personal spending money': 'other',
  'Emergency buffer': 'other'
});

/** The limits of a sheet: how many lines, how long a label, how large an amount. */
export const SHEET_LIMITS = Object.freeze({
  lines: 150, oneOffs: 40, label: 60, text: 40,
  amountMax: 1_000_000,            // one line, a month or a year
  oneOffMax: 10_000_000,
  everyMax: 50,
  yearsAhead: 60
});

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const blank = (v) => v === undefined || v === null || String(v).trim() === '';

/** A new sheet: the catalogue's lines, heading by heading, then its one-off costs — every amount blank. */
export function starterSheet() {
  const catalogue = [
    ...BUDGET_CATEGORIES.essential.map((c) => ({ ...c, essential: true })),
    ...BUDGET_CATEGORIES.discretionary.map((c) => ({ ...c, essential: false }))
  ];
  const lines = [];
  for (const heading of HEADINGS) {
    for (const c of catalogue) {
      if (HEADING_OF[c.label] !== heading) continue;
      lines.push({ id: `l${lines.length + 1}`, heading, label: c.label, amount: '', period: c.period === 'yr' ? 'yr' : 'mo', essential: c.essential, starter: true });
    }
  }
  const oneOffs = STARTER_ONEOFFS.map((o, i) => ({ id: `o${i + 1}`, label: o.label, amount: '', year: '', everyYears: isNum(o.everyYears) ? String(o.everyYears) : '' }));
  return { version: 1, lines, oneOffs, touched: [] };
}

const nextId = (list, prefix) => {
  let max = 0;
  for (const x of list || []) { const m = new RegExp(`^${prefix}(\\d+)$`).exec(x && x.id); if (m) max = Math.max(max, Number(m[1])); }
  return `${prefix}${max + 1}`;
};
export const nextLineId = (sheet) => nextId(sheet && sheet.lines, 'l');
export const nextOneOffId = (sheet) => nextId(sheet && sheet.oneOffs, 'o');

/**
 * An amount as typed: "£1,200", "150", "11.99 + 8.99" (a sum is allowed, as on today's budget page). Blank is empty,
 * not nought. → { value } (pounds, to the penny) | { empty: true } | { problem: 'notANumber' | 'tooLow' | 'tooHigh' }
 */
export function parseAmount(text, max = SHEET_LIMITS.amountMax) {
  if (blank(text)) return { empty: true };
  const t = String(text).replace(/[£\s]/g, '');
  if (t.length > SHEET_LIMITS.text) return { problem: 'notANumber' };
  const v = evalAmountExpr(t);
  if (!isNum(v)) return { problem: 'notANumber' };
  if (v < 0) return { problem: 'tooLow' };
  if (v > max) return { problem: 'tooHigh' };
  return { value: v };
}

/** A year as typed: blank, or a whole year from this year to 60 years on. */
function parseYear(text, today) {
  if (blank(text)) return { empty: true };
  const t = String(text).trim();
  if (!/^\d{4}$/.test(t)) return { problem: 'notAYear' };
  const now = Number(String(today || '').slice(0, 4));
  const y = Number(t);
  if (isNum(now) && now > 0 && (y < now || y > now + SHEET_LIMITS.yearsAhead)) return { problem: 'yearOutOfRange' };
  return { value: y };
}

/** "Every … years" as typed: blank is once; else a whole number from 1 to 50. */
function parseEvery(text) {
  if (blank(text)) return { value: null };
  const t = String(text).trim();
  if (!/^\d{1,2}$/.test(t) || Number(t) < 1 || Number(t) > SHEET_LIMITS.everyMax) return { problem: 'notAnEvery' };
  return { value: Number(t) };
}

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * The sheet checked. Never throws, whatever the sheet holds.
 * @param {object|null} sheet          state.budget: { version, lines, oneOffs, touched }
 * @param {object} [o]
 * @param {'single'|'couple'} [o.household]   a couple's budget is the household's: typical amounts for two
 * @param {'minimum'|'moderate'|'comfortable'} [o.level]   which national guide level the typical amounts are for
 * @param {string} [o.today]           'YYYY-MM-DD', for the years of one-off costs
 * @returns {{ rows, lines, oneOffRows, oneOffs, totals: { monthly, yearly, essentialMonthly }, headings, problems, plsaTier, household, exists }}
 */
export function checkSheet(sheet, { household = 'single', level = 'moderate', today = null } = {}) {
  const couple = household === 'couple';
  const plsaTier = ['minimum', 'moderate', 'comfortable'].includes(level) ? level : 'moderate';
  const typical = { plsaTier, sharedWithPartner: couple };
  const rows = [];
  const lines = [];
  const problems = [];
  const headings = Object.fromEntries(HEADINGS.map((h) => [h, { monthly: 0, count: 0 }]));
  let yearly = 0;
  let essentialYearly = 0;
  const list = sheet && Array.isArray(sheet.lines) ? sheet.lines : [];
  for (const l of list) {
    if (!l || typeof l !== 'object') continue;
    const heading = HEADINGS.includes(l.heading) ? l.heading : 'other';
    const label = typeof l.label === 'string' ? l.label : '';
    const period = l.period === 'yr' ? 'yr' : 'mo';
    const essential = l.essential === true;
    const parsed = parseAmount(l.amount);
    const labelProblem = [...label].length > SHEET_LIMITS.label ? 'tooLong' : null;
    const annual = isNum(parsed.value) ? round2(period === 'mo' ? parsed.value * 12 : parsed.value) : null;
    const hint = l.starter ? typicalMonthlyFor(label, typical) : null;
    rows.push({ id: String(l.id), heading, label, amount: typeof l.amount === 'string' ? l.amount : '', period, essential, starter: l.starter === true,
      annual, problem: parsed.problem || null, labelProblem, hint: isNum(hint) ? hint : null });
    if (parsed.problem) problems.push({ id: String(l.id), field: 'amount', problem: parsed.problem });
    if (labelProblem) problems.push({ id: String(l.id), field: 'label', problem: labelProblem });
    headings[heading].count += 1;
    if (annual !== null && annual > 0) {
      lines.push({ id: String(l.id), heading, label: label.trim() || 'Other', annual, period, essential });
      yearly += annual;
      if (essential) essentialYearly += annual;
      headings[heading].monthly += annual / 12;
    }
  }
  const oneOffRows = [];
  const oneOffs = [];
  for (const o of sheet && Array.isArray(sheet.oneOffs) ? sheet.oneOffs : []) {
    if (!o || typeof o !== 'object') continue;
    const label = typeof o.label === 'string' ? o.label : '';
    const amount = parseAmount(o.amount, SHEET_LIMITS.oneOffMax);
    const year = parseYear(o.year, today);
    const every = parseEvery(o.everyYears);
    const p = {
      amount: amount.problem || null,
      year: year.problem || (isNum(amount.value) && amount.value > 0 && year.empty ? 'yearNeeded' : null),
      everyYears: every.problem || null,
      label: [...label].length > SHEET_LIMITS.label ? 'tooLong' : null
    };
    oneOffRows.push({ id: String(o.id), label, amount: typeof o.amount === 'string' ? o.amount : '', year: typeof o.year === 'string' ? o.year : '',
      everyYears: typeof o.everyYears === 'string' ? o.everyYears : '', problems: p });
    for (const [field, problem] of Object.entries(p)) if (problem) problems.push({ id: String(o.id), field, problem });
    if (isNum(amount.value) && amount.value > 0 && isNum(year.value) && !p.everyYears) {
      oneOffs.push({ id: String(o.id), label: label.trim() || 'One-off cost', amount: amount.value, year: year.value, everyYears: every.value });
    }
  }
  for (const h of HEADINGS) headings[h].monthly = round2(headings[h].monthly);
  return {
    exists: !!sheet,
    household: couple ? 'couple' : 'single',
    plsaTier,
    rows, lines, oneOffRows, oneOffs, problems, headings,
    // One-off costs are listed beside the total, never added to it.
    totals: { monthly: round2(yearly / 12), yearly: round2(yearly), essentialMonthly: round2(essentialYearly / 12) }
  };
}

/** A budget "exists" once at least one line holds an amount above £0. */
export const hasBudget = (checked) => !!checked && checked.totals.monthly > 0;

/** The national guide levels for one person or a couple, £ a month to the pound (the figures question A and B test). */
export function guideLevels(household) {
  const h = household === 'couple' ? 'couple' : 'single';
  return { minimum: spendLevelAMonth(h, 'minimum'), moderate: spendLevelAMonth(h, 'moderate'), comfortable: spendLevelAMonth(h, 'comfortable') };
}

/** Where a monthly total sits: 'belowMinimum' | 'minimumToModerate' | 'moderateToComfortable' | 'aboveComfortable'. */
export function whereAgainstLevels(monthly, household) {
  const g = guideLevels(household);
  if (!(monthly >= g.minimum)) return 'belowMinimum';
  if (monthly < g.moderate) return 'minimumToModerate';
  if (monthly < g.comfortable) return 'moderateToComfortable';
  return 'aboveComfortable';
}

/**
 * The budget's total against the figure in use, both to the pound. `differs` is what decides "Your budget now adds up
 * to £2,500 a month; this uses £2,340" — it never changes the figure.
 */
export function figureAgainstBudget(totalMonthly, figure) {
  const total = Math.round(Number(totalMonthly) || 0);
  const used = isNum(figure) ? Math.round(figure) : null;
  return { total, figure: used, differs: used !== null && used !== total };
}

/**
 * Question C's line: what the careful amount gives against the budget's total. `diff` is whole pounds; within £10
 * the two read as about the same.
 */
export function carefulAgainstBudget(careful, totalMonthly) {
  const total = Math.round(Number(totalMonthly) || 0);
  const gap = Math.round(Number(careful) || 0) - total;
  const direction = Math.abs(gap) < 10 ? 'same' : gap < 0 ? 'less' : 'more';
  return { total, diff: Math.abs(gap), direction };
}

/** The checked sheet as the plan seed carries it: lines above £0 only, the totals, the level; null with no budget. */
export function sheetForSeed(checked) {
  if (!hasBudget(checked)) return null;
  return {
    lines: checked.lines.map(({ heading, label, annual, period, essential }) => ({ heading, label, annual, period, essential })),
    oneOffs: checked.oneOffs.map(({ label, amount, year, everyYears }) => ({ label, amount, year, everyYears })),
    totals: { ...checked.totals },
    plsaTier: checked.plsaTier
  };
}

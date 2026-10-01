/**
 * The budget sheet (research/v7/budget-step.md "The budget sheet"; save-as-plan.md Contract C.5): the starter lines
 * are BudgetModel's catalogue letter for letter; monthly and yearly lines; the essentials sub-total; one-off costs
 * listed and never added; a couple's budget is the household's; the national guide levels; nothing ever throws.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  HEADINGS, HEADING_OF, SHEET_LIMITS, starterSheet, nextLineId, nextOneOffId, parseAmount, checkSheet, hasBudget, guideLevels,
  whereAgainstLevels, figureAgainstBudget, carefulAgainstBudget, sheetForSeed
} from '../../../src/answers/keep/budgetSheet.js';
import { BUDGET_CATEGORIES, STARTER_ONEOFFS, typicalMonthlyFor, annualNetAtAge, defaultBudget } from '../../../src/services/BudgetModel.js';
import { spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';

const TODAY = '2026-10-01';
const catalogue = [...BUDGET_CATEGORIES.essential.map((c) => ({ ...c, tier: 'essential' })), ...BUDGET_CATEGORIES.discretionary.map((c) => ({ ...c, tier: 'discretionary' }))];
const withAmounts = (sheet, amounts) => ({ ...sheet, lines: sheet.lines.map((l) => (l.label in amounts ? { ...l, ...(typeof amounts[l.label] === 'object' ? amounts[l.label] : { amount: amounts[l.label] }) } : l)) });

describe('the starter sheet is today\'s catalogue', () => {
  it('every catalogue line has a heading, and nothing else does', () => {
    expect(Object.keys(HEADING_OF).sort()).toEqual(catalogue.map((c) => c.label).sort());
    for (const h of Object.values(HEADING_OF)) expect(HEADINGS).toContain(h);
  });
  it('every line once, heading by heading, amounts blank, the catalogue\'s period and tier', () => {
    const s = starterSheet();
    expect(s.version).toBe(1);
    expect(s.lines.map((l) => l.label).sort()).toEqual(catalogue.map((c) => c.label).sort());
    expect(s.lines.map((l) => l.id)).toEqual(s.lines.map((_, i) => `l${i + 1}`));
    const order = s.lines.map((l) => HEADINGS.indexOf(l.heading));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const l of s.lines) {
      const c = catalogue.find((x) => x.label === l.label);
      expect(l.amount).toBe('');
      expect(l.starter).toBe(true);
      expect(l.essential).toBe(c.tier === 'essential');
      expect(l.period).toBe(c.period === 'yr' ? 'yr' : 'mo');
      expect(l.heading).toBe(HEADING_OF[l.label]);
    }
    expect(s.oneOffs.map((o) => o.label)).toEqual(STARTER_ONEOFFS.map((o) => o.label));
    expect(s.oneOffs.map((o) => o.everyYears)).toEqual(STARTER_ONEOFFS.map((o) => (o.everyYears ? String(o.everyYears) : '')));
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
  it('an added line or one-off cost takes the next free id', () => {
    const s = starterSheet();
    expect(nextLineId(s)).toBe(`l${s.lines.length + 1}`);
    expect(nextOneOffId(s)).toBe(`o${s.oneOffs.length + 1}`);
    expect(nextLineId({ lines: [{ id: 'l3' }, { id: 'x' }, { id: 'l10' }] })).toBe('l11');
    expect(nextLineId(null)).toBe('l1');
  });
});

describe('an amount as typed', () => {
  it('reads pounds, commas, pence and a sum; blank is empty, not nought', () => {
    expect(parseAmount('150')).toEqual({ value: 150 });
    expect(parseAmount('£1,200')).toEqual({ value: 1200 });
    expect(parseAmount(' 11.99 + 8.99 ')).toEqual({ value: 20.98 });
    expect(parseAmount('0')).toEqual({ value: 0 });
    expect(parseAmount('')).toEqual({ empty: true });
    expect(parseAmount('   ')).toEqual({ empty: true });
    expect(parseAmount(undefined)).toEqual({ empty: true });
  });
  it('says what is wrong', () => {
    expect(parseAmount('lots')).toEqual({ problem: 'notANumber' });
    expect(parseAmount('12k')).toEqual({ problem: 'notANumber' });
    expect(parseAmount('-5')).toEqual({ problem: 'tooLow' });
    expect(parseAmount('2,000,000')).toEqual({ problem: 'tooHigh' });
    expect(parseAmount('1'.repeat(41))).toEqual({ problem: 'notANumber' });
  });
});

describe('the sheet checked', () => {
  const sheet = withAmounts(starterSheet(), {
    'Council tax': '150', 'Groceries & household': '400', 'TV licence': '174.50',
    'Main holiday': { amount: '3,000', period: 'yr' }, 'Eating out & takeaways': 'lots', 'Gas': ''
  });
  const c = checkSheet(sheet, { household: 'single', today: TODAY });

  it('monthly lines × 12 and yearly lines as they are; the total a month is the year ÷ 12', () => {
    const by = Object.fromEntries(c.lines.map((l) => [l.label, l.annual]));
    expect(by).toEqual({ 'Council tax': 1800, 'Groceries & household': 4800, 'TV licence': 174.5, 'Main holiday': 3000 });
    expect(c.totals.yearly).toBe(9774.5);
    expect(c.totals.monthly).toBe(Math.round((9774.5 / 12) * 100) / 100);
  });
  it('the essentials sub-total is the essential lines only', () => {
    // Council tax, groceries and the TV licence are essential in the catalogue; the main holiday is not
    expect(c.totals.essentialMonthly).toBe(Math.round(((1800 + 4800 + 174.5) / 12) * 100) / 100);
    const flipped = checkSheet({ ...sheet, lines: sheet.lines.map((l) => (l.label === 'Main holiday' ? { ...l, essential: true } : l)) }, { today: TODAY });
    expect(flipped.totals.essentialMonthly).toBe(c.totals.monthly);
    expect(flipped.totals.monthly).toBe(c.totals.monthly);
  });
  it('a line that cannot be read is a problem, never a figure; blank is nothing', () => {
    expect(c.problems).toEqual([{ id: sheet.lines.find((l) => l.label === 'Eating out & takeaways').id, field: 'amount', problem: 'notANumber' }]);
    expect(c.rows.find((r) => r.label === 'Gas')).toMatchObject({ annual: null, problem: null });
  });
  it('one-off costs are listed with their year and never added to the total', () => {
    const s = { ...sheet, oneOffs: [{ id: 'o1', label: 'New car', amount: '18,000', year: '2031', everyYears: '8' }, { id: 'o2', label: 'Roof', amount: '9,000', year: '2029', everyYears: '' }] };
    const k = checkSheet(s, { today: TODAY });
    expect(k.totals).toEqual(c.totals);
    expect(k.oneOffs).toEqual([{ id: 'o1', label: 'New car', amount: 18000, year: 2031, everyYears: 8 }, { id: 'o2', label: 'Roof', amount: 9000, year: 2029, everyYears: null }]);
  });
  it('a one-off cost with an amount needs a year in range, and "every" from 1 to 50', () => {
    const k = checkSheet({ lines: [], oneOffs: [
      { id: 'o1', label: 'A', amount: '1,000', year: '', everyYears: '' },
      { id: 'o2', label: 'B', amount: '1,000', year: '2020', everyYears: '' },
      { id: 'o3', label: 'C', amount: '1,000', year: '2030', everyYears: '0' },
      { id: 'o4', label: 'D', amount: '', year: '', everyYears: '' }
    ] }, { today: TODAY });
    expect(k.problems).toEqual([
      { id: 'o1', field: 'year', problem: 'yearNeeded' }, { id: 'o2', field: 'year', problem: 'yearOutOfRange' }, { id: 'o3', field: 'everyYears', problem: 'notAnEvery' }
    ]);
    expect(k.oneOffs).toEqual([]);
  });
  it('subtotals by heading add up to the total', () => {
    const sum = HEADINGS.reduce((s, h) => s + c.headings[h].monthly, 0);
    expect(Math.abs(sum - c.totals.monthly)).toBeLessThan(0.05);
  });
  it('a couple\'s budget is the household\'s: the same total, the typical amounts for two', () => {
    const two = checkSheet(sheet, { household: 'couple', today: TODAY });
    expect(two.totals).toEqual(c.totals);
    const row = (k) => k.rows.find((r) => r.label === 'Council tax');
    expect(row(c).hint).toBe(typicalMonthlyFor('Council tax', { plsaTier: 'moderate', sharedWithPartner: false }));
    expect(row(two).hint).toBe(typicalMonthlyFor('Council tax', { plsaTier: 'moderate', sharedWithPartner: true }));
    expect(row(two).hint).toBeGreaterThan(row(c).hint);
    expect(checkSheet(sheet, { level: 'comfortable' }).rows.find((r) => r.label === 'Council tax').hint)
      .toBe(typicalMonthlyFor('Council tax', { plsaTier: 'comfortable', sharedWithPartner: false }));
  });
  it('the typical amounts are hints only: never in the amounts, never in the total', () => {
    const blank = checkSheet(starterSheet(), { today: TODAY });
    expect(blank.totals).toEqual({ monthly: 0, yearly: 0, essentialMonthly: 0 });
    expect(hasBudget(blank)).toBe(false);
    expect(blank.rows.filter((r) => r.hint !== null).length).toBeGreaterThan(20);
    expect(hasBudget(c)).toBe(true);
  });
  it('never throws, whatever the sheet holds, and the total is the sum of what could be read', () => {
    fc.assert(fc.property(fc.anything(), (junk) => {
      const k = checkSheet(junk, { today: TODAY });
      expect(Number.isFinite(k.totals.monthly)).toBe(true);
    }), { numRuns: 300 });
    const amount = fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 5000 }).map(String), fc.string({ maxLength: 6 }));
    fc.assert(fc.property(fc.array(fc.record({ amount, period: fc.constantFrom('mo', 'yr'), essential: fc.boolean() }), { maxLength: 30 }), (rows) => {
      const s = { lines: rows.map((r, i) => ({ id: `l${i + 1}`, heading: 'other', label: `x${i}`, starter: false, ...r })), oneOffs: [] };
      const k = checkSheet(s, { today: TODAY });
      let yearly = 0;
      for (const r of s.lines) { const p = parseAmount(r.amount); if (Number.isFinite(p.value)) yearly += r.period === 'mo' ? p.value * 12 : p.value; }
      expect(Math.abs(k.totals.yearly - yearly)).toBeLessThan(0.01);
    }), { numRuns: 200 });
  });
});

describe('the guides beside the total', () => {
  it('the national guide levels are the levels A and B test, a month', () => {
    for (const h of ['single', 'couple']) for (const l of ['minimum', 'moderate', 'comfortable']) expect(guideLevels(h)[l]).toBe(spendLevelAMonth(h, l));
  });
  it('where a total sits against them', () => {
    const g = guideLevels('single');
    expect(whereAgainstLevels(0, 'single')).toBe('belowMinimum');
    expect(whereAgainstLevels(g.minimum - 1, 'single')).toBe('belowMinimum');
    expect(whereAgainstLevels(g.minimum, 'single')).toBe('minimumToModerate');
    expect(whereAgainstLevels(g.moderate, 'single')).toBe('moderateToComfortable');
    expect(whereAgainstLevels(g.comfortable, 'single')).toBe('aboveComfortable');
    expect(whereAgainstLevels(g.moderate, 'couple')).toBe('minimumToModerate');
  });
  it('the total against the figure in use, to the pound', () => {
    expect(figureAgainstBudget(2500.4, 2340)).toEqual({ total: 2500, figure: 2340, differs: true });
    expect(figureAgainstBudget(2340.2, 2340)).toEqual({ total: 2340, figure: 2340, differs: false });
    expect(figureAgainstBudget(2340, null)).toEqual({ total: 2340, figure: null, differs: false });
  });
  it('question C\'s line: less, more, or about the same within £10', () => {
    expect(carefulAgainstBudget(1850, 2340)).toEqual({ total: 2340, diff: 490, direction: 'less' });
    expect(carefulAgainstBudget(2400, 2340.4)).toEqual({ total: 2340, diff: 60, direction: 'more' });
    expect(carefulAgainstBudget(2350, 2341)).toEqual({ total: 2341, diff: 9, direction: 'same' });
  });
});

describe('the sheet as the plan carries it', () => {
  it('lines above £0 only, the totals, the level; null with no budget', () => {
    const s = withAmounts(starterSheet(), { 'Council tax': '150', Gas: '0', Water: '' });
    const seed = sheetForSeed(checkSheet(s, { level: 'comfortable', today: TODAY }));
    expect(seed.lines).toEqual([{ heading: 'home', label: 'Council tax', annual: 1800, period: 'mo', essential: true }]);
    expect(seed.totals).toEqual({ monthly: 150, yearly: 1800, essentialMonthly: 150 });
    expect(seed.plsaTier).toBe('comfortable');
    expect(sheetForSeed(checkSheet(starterSheet(), { today: TODAY }))).toBe(null);
    expect(sheetForSeed(checkSheet(null))).toBe(null);
  });
  it('round trip: today\'s budget model, given the same lines, adds up to the same total a month (Contract C.5)', () => {
    const s = withAmounts(starterSheet(), { 'Council tax': '150', 'Groceries & household': '420.55', 'Main holiday': { amount: '3,100', period: 'yr' }, Pets: '35' });
    const k = checkSheet(s, { today: TODAY });
    const seed = sheetForSeed(k);
    const budget = { ...defaultBudget(58, 60, 95), lines: seed.lines.map((l) => ({ label: l.label, tier: l.essential ? 'essential' : 'discretionary', annual: l.annual, period: l.period, fromAge: null, toAge: null, hint: '', heading: l.heading })) };
    expect(Math.round((annualNetAtAge(budget, 60) / 12) * 100) / 100).toBe(k.totals.monthly);
    expect(Math.round((annualNetAtAge(budget, 60, 'essential') / 12) * 100) / 100).toBe(k.totals.essentialMonthly);
  });
  it('limits are what the screen says', () => {
    expect(SHEET_LIMITS.label).toBe(60);
    const long = checkSheet({ lines: [{ id: 'l1', heading: 'other', label: 'x'.repeat(61), amount: '5', period: 'mo' }] });
    expect(long.problems).toEqual([{ id: 'l1', field: 'label', problem: 'tooLong' }]);
  });
});

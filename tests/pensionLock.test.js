/**
 * No pension draw before the minimum pension age (7.4.1, services/PensionLock.js). A defined-contribution pension cannot
 * be drawn in a plan year its holder is younger than their access age (55, or 57 for anyone not 55 by 6 April 2028: the one
 * rule, services/PensionAge.js). Every engine that draws a pension year by year leaves it untouched in those years and pays
 * them from the money outside it; what that money cannot pay is income cut, and the plan says by how much.
 *
 * Fictional people only: Alex stopped work at 50, Sam is the partner. Every figure here is made up for the test.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PENSION_ACCESS, accessAgeOn } from '../src/services/PensionAge.js';
import { pensionLockOf, payClosedYears, closedYearsWords, closedYearsShort, pensionPotOf } from '../src/services/PensionLock.js';
import { accessAgeOf, earlyPensionDrawOf, earlyPensionDrawWords, ageInTaxYear } from '../src/services/PlanTiming.js';
import { RULES } from '../src/answers/shared/rules.js';
import { ACCUMULATION_RULES } from '../src/services/AccumulationEngine.js';
import { PENSION_AGE_CHANGE, householdDrawSplit } from '../src/services/HouseholdDraw.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { simulate } from '../src/services/SimulationEngine.js';
import { planFromSettings, stressTestStrategy, pensionLockForSettings, STRATEGY_NAMES } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { getRtr, getCpi, annualNominal } from '../src/strategies/ladderEngine.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';
import { monthInputsOf, decideMonth } from '../src/services/MonthDecision.js';
import { defaultTaxYearConfig } from '../src/models/TaxYear.js';
import { getTaxYearFromDate } from '../src/services/legacyDecision.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { startSummaryHtml } from '../src/ui/startingPotsWords.js';
import { verdictOf } from '../src/answers/plan/lasts.js';
import { closedOf } from '../src/answers/plan/lastsRun.js';
import { LASTS } from '../src/v7/copy/lasts.js';
import { HOME } from '../src/v7/copy/home.js';
import { bannedHits } from './v7/render/checkScreen.js';
import { fastEligible } from '../src/answers/shared/fastEngine.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const NOW = new Date(2026, 10, 6, 12);   // 6 November 2026: tax year 2026/27
const SCOPES = ['all', 'first', 'retired'];   // the plan's screens (checkScreen scopesFor), for a person who has stopped work
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));

/**
 * Alex: 50 on 1 June 2026, stopped work that month, the plan running from this tax year. Built on the corpus's own complete
 * Stress settings (fixture 02, a fictional plan) so every engine has every field it reads; only the person and pots differ.
 */
const ALEX = Object.freeze({
  ...read('02-pnv-draft').stressTool.settings,
  currentAge: 50, currentAgeAsOf: '2026-06-01', retired: true, stoppedWork: '2026-06', firstTaxYear: 2026, shapeAgeNow: 51,
  spStartDate: '1 June 2044', spWeeklyAmount: 230, incomeShape: 'level', incomeSteps: [], targetSchedule: null,
  baseSalary: 30000, equityMin: 300000, bondMin: 150000, cashTarget: 40000, isaBalance: 150000, duration: 40, strategyParams: {}
});
const alex = (over = {}) => ({ ...ALEX, ...over });
const planOf = (s, now = NOW) => planFromSettings(s, simulationConfigFromSettings({}, s, now), { now, startAge: +s.shapeAgeNow || 57 });

describe('the one rule', () => {
  it('lives in one place: the answers, the saving years and the household read it', () => {
    expect(PENSION_ACCESS).toEqual({ before: 55, from: 57, changesOn: '2028-04-06' });
    expect(RULES.pensionAccess).toBe(PENSION_ACCESS);
    expect(ACCUMULATION_RULES.NMPA_NEW).toBe(PENSION_ACCESS.from);
    expect(ACCUMULATION_RULES.NMPA_CHANGE_DATE).toBe(PENSION_ACCESS.changesOn);
    expect(PENSION_AGE_CHANGE).toBe(PENSION_ACCESS.changesOn);
    expect(accessAgeOn('2028-04-05')).toBe(55);
    expect(accessAgeOn('2028-04-06')).toBe(57);
  });
  it('a person’s own access age: 55 when they are 55 on 5 April 2028, 57 for anyone reaching 55 on or after 6 April 2028', () => {
    // a birthday on 5 April (no State Pension date: the day the age was given is the birthday)
    expect(accessAgeOf({ currentAge: 53, currentAgeAsOf: '2026-04-05' }, NOW)).toBe(55);
    // a birthday on 6 April: 55 on 6 April 2028, the first day of the new rule
    expect(accessAgeOf({ currentAge: 53, currentAgeAsOf: '2026-04-06' }, NOW)).toBe(57);
    expect(accessAgeOf({ currentAge: 50, currentAgeAsOf: '2026-06-01' }, NOW)).toBe(57);
    expect(accessAgeOf({ currentAge: 61, currentAgeAsOf: '2026-06-01' }, NOW)).toBe(55);
    expect(accessAgeOf({}, NOW)).toBeNull();
  });
});

describe('pensionLockOf: the closed years of one person’s plan', () => {
  it('Alex, 50 and stopped: closed until the tax year 57 is reached', () => {
    const lock = pensionLockOf(ALEX, { now: NOW });
    const ageY0 = ageInTaxYear(ALEX, 2026, NOW);
    expect(lock).toEqual({ accessAge: 57, years: 57 - ageY0, fromTaxYear: 2026, opensTaxYear: 2026 + 57 - ageY0 });
    expect(ageInTaxYear(ALEX, lock.opensTaxYear, NOW)).toBe(57);
    expect(ageInTaxYear(ALEX, lock.opensTaxYear - 1, NOW)).toBe(56);
  });
  it('counted from the tax year a run starts in', () => {
    const lock = pensionLockOf(ALEX, { now: NOW, fromTaxYear: 2029 });
    expect(lock.fromTaxYear).toBe(2029);
    expect(lock.opensTaxYear).toBe(pensionLockOf(ALEX, { now: NOW }).opensTaxYear);
  });
  it('one turning 55 mid-plan: before 6 April 2028 the pension opens at 55, after it at 57', () => {
    const before = pensionLockOf(alex({ currentAge: 53, currentAgeAsOf: '2026-04-05', spStartDate: null }), { now: NOW });
    const after = pensionLockOf(alex({ currentAge: 53, currentAgeAsOf: '2026-04-06', spStartDate: null }), { now: NOW });
    expect(before.accessAge).toBe(55);
    expect(after.accessAge).toBe(57);
    expect(before.years).toBe(55 - ageInTaxYear(alex({ currentAge: 53, currentAgeAsOf: '2026-04-05', spStartDate: null }), 2026, NOW));
    expect(after.years).toBe(57 - ageInTaxYear(alex({ currentAge: 53, currentAgeAsOf: '2026-04-06', spStartDate: null }), 2026, NOW));
  });
  it('null at or past the access age, with no pension, without an age, and for a plan with no age (legacy)', () => {
    expect(pensionLockOf(alex({ currentAge: 57 }), { now: NOW })).toBeNull();
    expect(pensionLockOf(alex({ currentAge: 62 }), { now: NOW })).toBeNull();
    expect(pensionLockOf(alex({ equityMin: 0, bondMin: 0, cashTarget: 0, diversifierStart: 0 }), { now: NOW })).toBeNull();
    expect(pensionLockOf(alex(), { now: NOW, pensionPot: 0 })).toBeNull();
    expect(pensionLockOf(alex({ currentAge: null }), { now: NOW })).toBeNull();
    expect(pensionLockOf({ equityMin: 100000 }, { now: NOW })).toBeNull();
  });
  it('a saver stopping at 52 is closed from the tax year they stop', () => {
    const saver = alex({ currentAge: 48, retired: false, retireAge: 52, stoppedWork: null, firstTaxYear: null });
    const lock = pensionLockOf(saver, { now: NOW });
    expect(lock.accessAge).toBe(57);
    expect(lock.years).toBe(57 - ageInTaxYear(saver, lock.fromTaxYear, NOW));
    expect(pensionLockOf({ ...saver, retireAge: 60 }, { now: NOW })).toBeNull();
  });
  it('a couple: each plan by its own holder (Alex closed, Sam at 61 not)', () => {
    const sam = alex({ currentAge: 61, currentAgeAsOf: '2026-03-01', spStartDate: '1 March 2032' });
    expect(pensionLockOf(ALEX, { now: NOW })).not.toBeNull();
    expect(pensionLockOf(sam, { now: NOW })).toBeNull();
    expect(planOf(ALEX).pensionLock).toBeTruthy();
    expect(planOf(sam).pensionLock).toBeUndefined();
  });
});

describe('payClosedYears and the words', () => {
  it('pays the years in order; a year the money cannot pay is cut to what it can', () => {
    expect(payClosedYears([10, 10, 10], 3, 25)).toEqual({ paid: [10, 10, 5], unpaid: [0, 0, 5], spent: [10, 10, 5], used: 25, left: 0 });
    expect(payClosedYears([10, 10], 2, 50)).toEqual({ paid: [10, 10], unpaid: [0, 0], spent: [10, 10], used: 20, left: 30 });
    // tax-free money pays only what the pension's pounds would have left after tax
    const r = payClosedYears([100, 100], 2, 150, { costOf: (y, g) => g * 0.8, grossFor: (y, m) => m / 0.8 });
    expect(r.paid).toEqual([100, 87.5]);
    expect(r.spent).toEqual([80, 70]);
  });
  it('enough: what the plan does; not enough: by about how much a year, and when', () => {
    expect(closedYearsWords({ accessAge: 57, fromTaxYear: 2026, unpaid: [0, 0, 0] })).toBe('Before 57, this plan pays you from your other savings, not your pension.');
    expect(closedYearsWords({ accessAge: 57, fromTaxYear: 2026, unpaid: [0, 12340, 30000] })).toBe('Before 57 your plan can’t take money from your pension. Your other savings run short by about £21,200 a year in 2027/28 to 2028/29.');
    expect(closedYearsWords({ accessAge: 55, fromTaxYear: 2026, unpaid: [0, 0, 9000] })).toBe('Before 55 your plan can’t take money from your pension. Your other savings run short by about £9,000 a year in 2028/29.');
    expect(closedYearsShort({ fromTaxYear: 2026, unpaid: [0, 0.5] })).toBeNull();
    expect(earlyPensionDrawWords({ age: 57 })).toBe('Before 57, this plan pays you from your other savings, not your pension.');
  });
  it('the words pass the banned list in both apps', () => {
    for (const t of [HOME.pensionAccess, LASTS.pensionAccess, LASTS.pensionShort]) {
      expect(bannedHits(fill(t, { age: '57', amount: '£12,300', years: '2027/28 to 2029/30' }), SCOPES), t).toEqual([]);
    }
    expect(bannedHits(closedYearsWords({ accessAge: 57, fromTaxYear: 2026, unpaid: [0, 5000] }), SCOPES)).toEqual([]);
  });
});

describe('Pots & Valves and Buckets: the engine takes nothing from the pension in a closed month', () => {
  const cfg = simulationConfigFromSettings({}, ALEX, NOW);
  const L = pensionLockOf(ALEX, { now: NOW }).years;
  const returns = annualNominal(getRtr(), getCpi(), 600, 40);
  it('the config carries the closed months; a plan that can already draw carries none', () => {
    expect(cfg.pensionLockedMonths).toBe(L * 12);
    expect('pensionLockedMonths' in simulationConfigFromSettings({}, alex({ currentAge: 60 }), NOW)).toBe(false);
    expect(fastEligible({ ...cfg, pensionLockedMonths: 12 })).toBe(false);
  });
  it('no pension draw while closed; the ISA pays; the pension grows untouched', () => {
    const r = simulate({ ...cfg, years: 40, trace: true }, returns, 1);
    const open = simulate({ ...cfg, pensionLockedMonths: 0, years: 40, trace: true }, returns, 1);
    for (let m = 0; m < L * 12; m++) expect(r.trace[m].effectiveSipp, 'month ' + m).toBe(0);
    expect(r.trace[0].effectiveIsa).toBeGreaterThan(0);
    // the pension's pots at the month it opens: more than the run that drew from them all along
    const pots = (t) => t.equityStart + t.bondStart + t.cashStart;
    expect(pots(r.trace[L * 12])).toBeGreaterThan(pots(open.trace[L * 12]));
    expect(r.trace[L * 12].effectiveSipp).toBeGreaterThan(0);   // it opens
  });
  it('0 closed months is the run it always was, to the bit', () => {
    const a = simulate({ ...cfg, pensionLockedMonths: undefined, years: 40 }, returns, 3);
    const b = simulate({ ...cfg, pensionLockedMonths: 0, years: 40 }, returns, 3);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
  });
  it('the ISA runs out before the pension opens: the income is cut, never a run out', () => {
    const r = simulate({ ...cfg, isaBalance: 20000, years: 40, trace: true }, returns, 1);
    expect(r.failed).toBe(false);
    expect(r.cutYears).toBeGreaterThan(0);
    for (let m = 0; m < L * 12; m++) expect(r.trace[m].effectiveSipp).toBe(0);
  });
});

describe('the bought strategies buy nothing from the pension for the closed years', () => {
  it('the plan: the closed years’ need is other income paid from the ISA; the schedule is nothing in them', () => {
    const p = planOf(ALEX);
    const L = p.pensionLock.years;
    expect(p.pnvCfg.pensionLockedMonths).toBe(L * 12);
    for (let y = 0; y < L; y++) expect(p.targetSchedule[y]).toBe(0);
    expect(p.targetSchedule[L]).toBeGreaterThan(0);
    expect(p.isa).toBeLessThan(ALEX.isaBalance);
    expect(p.pensionLock.paid.every((v, y) => Math.abs(v + p.pensionLock.unpaid[y] - p.needByYear[y]) < 1e-6)).toBe(true);
  });
  it('enough other savings: every closed year paid in full; the words say what the plan does', () => {
    const rich = alex({ isaBalance: 400000 });
    const p = planOf(rich);
    expect(p.pensionLock.unpaid.every((v) => v === 0)).toBe(true);
    expect(closedYearsWords(pensionLockForSettings(rich, NOW))).toBe('Before 57, this plan pays you from your other savings, not your pension.');
    expect(closedOf(p)).toEqual({ age: 57, short: null });
  });
  it('not enough: the words say by about how much and when, in both apps', () => {
    const poor = alex({ isaBalance: 40000 });
    const lock = pensionLockForSettings(poor, NOW);
    const short = closedYearsShort(lock);
    expect(short).not.toBeNull();
    const words = closedYearsWords(lock);
    expect(words).toMatch(/^Before 57 your plan can’t take money from your pension\. Your other savings run short by about £[\d,]+ a year in \d{4}\/\d{2}( to \d{4}\/\d{2})?\.$/);
    // the classic run summary
    expect(startSummaryHtml(poor)).toContain(words);
    expect(startSummaryHtml(alex({ isaBalance: 400000 }))).toContain('Before 57, this plan pays you from your other savings, not your pension.');
    expect(startSummaryHtml(alex({ currentAge: 60 }))).not.toContain('pension-access');
    // the new app's answer
    const v = verdictOf({ strategyId: 'pots-and-valves', a: { share: 0.9, chancePct: 90, years: 40, typicalLeft: 1, badCaseLeft: 1, goodCaseLeft: 1, futures: 1000, histories: 900, histRanOutN: 0 }, closed: closedOf(planOf(poor)) }, { endAge: 90 });
    expect(fill(LASTS.pensionShort, v.closedShort)).toBe(words.replace('by about £', 'by £'));   // the new app's plan pages say no 'about'
  });
  it('each bought strategy: the closed years’ income is what the ISA pays, never a rung or the sleeve', () => {
    const p = { ...planOf(alex({ isaBalance: 60000, equityMin: 900000 })), mcRuns: 40 };
    const L = p.pensionLock.years;
    const configs = deriveCompareConfigs(p);
    expect(configs.ff.closedYears).toBe(L);
    for (let k = 1; k <= L; k++) expect(configs.ff.floorDraw(k)).toBe(0);
    for (const id of ['ladder-and-ratchet', 'bridge-and-engine', 'floor-and-flex', 'floor-the-schedule', 'floor-to-age', 'full-il-gilt', 'gilt-rotation']) {
      const r = stressTestStrategy(id, p, configs);
      if (!r.affordable) continue;
      for (let y = 0; y < L; y++) expect(r.cones.income.p90[y], id + ' year ' + y).toBeCloseTo(p.otherIncomeByYear[y], 6);
      if (r.plan && r.plan.years) for (const yr of r.plan.years.slice(0, L)) expect(yr.need, id).toBe(0);
    }
  });
  it('Floor & Flex: the sleeve pays no treats in a closed year', () => {
    const p = { ...planOf(alex({ equityMin: 900000 })), mcRuns: 20 };
    const L = p.pensionLock.years;
    const r = stressTestStrategy('floor-and-flex', p);
    expect(r.signature.treatsCone.slice(0, L).every((b) => b.p90 === 0)).toBe(true);
    expect(r.signature.treatsCone[L].p50).toBeGreaterThan(0);
  });
  it('a plan whose holder can already draw is the plan it always was', () => {
    const p = planOf(alex({ currentAge: 60 }));
    expect(p.pensionLock).toBeUndefined();
    expect('pensionLockedMonths' in p.pnvCfg).toBe(false);
    expect(p.isa).toBe(ALEX.isaBalance);
  });
});

describe('the year-by-year table and the month', () => {
  it('the drawdown table draws nothing from the pension in a closed year; the ISA pays as far as it can', () => {
    const L = pensionLockOf(ALEX, { now: NOW }).years;
    const rows = generateDrawdownSchedule(ALEX, 40, 0.025, NOW);
    for (let y = 0; y < L; y++) expect(rows[y].sippDraw, 'year ' + y).toBe(0);
    expect(rows[0].isaDraw).toBeGreaterThan(0);
    expect(rows[L].sippDraw).toBeGreaterThan(0);
    const poor = generateDrawdownSchedule(alex({ isaBalance: 10000 }), 40, 0.025, NOW);
    expect(poor[1].isaDraw + poor[0].isaDraw).toBeCloseTo(10000, 6);
    expect(poor[2].sippDraw).toBe(0);
  });
  it('the month: no pension draw before the access age; the ISA pays; a shortfall is said', () => {
    const raw = read('02-pnv-draft');
    Object.assign(raw.stressTool.settings, { currentAge: 50, currentAgeAsOf: '2026-06-01', stoppedWork: '2026-06', firstTaxYear: 2026, shapeAgeNow: 51, spStartDate: '1 June 2044' });
    Object.assign(raw.budgetTool.settings, { currentAge: 50, currentAgeAsOf: '2026-06-01' });   // the age the plan reads
    const plan = upgradeScenario(raw, { now: NOW }).scenario;
    const I = monthInputsOf(plan, { now: NOW });
    const taxYears = { [getTaxYearFromDate('2026-11')]: defaultTaxYearConfig() };
    const d = decideMonth(I, '2026-11', { equity: 400000, bond: 200000, cash: 60000, isa: 45000 }, { taxYears });
    expect(d.sippDraw).toBe(0);
    expect(d.isaDraw).toBeGreaterThan(0);
    expect(d.pensionClosed.accessAge).toBe(57);
    expect(d.alerts.some((a) => a.type === 'pension-closed' && a.message === 'Before 57, this plan pays you from your other savings, not your pension.')).toBe(true);
    const short = decideMonth(I, '2026-11', { equity: 400000, bond: 200000, cash: 60000, isa: 100 }, { taxYears });
    expect(short.sippDraw).toBe(0);
    expect(short.pensionClosed.shortMonthly).toBeGreaterThan(0);
    expect(short.alerts.find((a) => a.type === 'pension-closed').message).toMatch(/^Before 57 your plan can’t take money from your pension\. Your other savings are about £[\d,]+ short this month\.$/);
    // at the access age the month draws as it always did
    const raw60 = read('02-pnv-draft');
    const I60 = monthInputsOf(upgradeScenario(raw60, { now: NOW }).scenario, { now: NOW });
    const d60 = decideMonth(I60, '2026-11', { equity: 400000, bond: 200000, cash: 60000, isa: 45000 }, { taxYears });
    expect(d60.sippDraw).toBeGreaterThan(0);
    expect('pensionClosed' in d60).toBe(false);
  });
  it('the household split: a closed pension pays nothing, to its own plan or the other’s', () => {
    const sam = alex({ currentAge: 60, currentAgeAsOf: '2026-03-01', spStartDate: '1 March 2033', equityMin: 100000, bondMin: 50000, cashTarget: 10000, isaBalance: 20000 });
    const split = householdDrawSplit({ settings: ALEX, name: 'Alex' }, { settings: sam, name: 'Sam' }, { now: NOW, limit: { kind: 'none' } });
    const L = pensionLockOf(ALEX, { now: NOW }).years;
    const closedRows = split.rows.filter((r) => r.activeA && r.year < L);
    expect(closedRows.length).toBeGreaterThan(0);
    for (const r of closedRows) { expect(r.own.drawA).toBe(0); expect(r.together.drawA).toBe(0); }
    expect(split.rows.some((r) => r.year >= L && r.together.drawA > 0)).toBe(true);
  });
});

describe('property: no engine ever draws a pension in a year its holder is under the access age', () => {
  const returns = annualNominal(getRtr(), getCpi(), 300, 45);
  const person = fc.record({
    age: fc.integer({ min: 40, max: 62 }),
    asOf: fc.constantFrom('2026-01-15', '2026-04-05', '2026-04-06', '2026-08-20'),
    isa: fc.integer({ min: 0, max: 300000 }),
    pot: fc.integer({ min: 50000, max: 1500000 }),
    want: fc.integer({ min: 10000, max: 60000 })
  });
  const settingsOf = (x) => alex({ currentAge: x.age, currentAgeAsOf: x.asOf, spStartDate: null, shapeAgeNow: null, isaBalance: x.isa, baseSalary: x.want, equityMin: x.pot * 0.6, bondMin: x.pot * 0.3, cashTarget: x.pot * 0.1, duration: 35 });
  it('Pots & Valves, the table and the bought plan', () => {
    fc.assert(fc.property(person, (x) => {
      const s = settingsOf(x);
      const access = accessAgeOf(s, NOW);
      const closed = Math.max(0, access - ageInTaxYear(s, 2026, NOW));
      const cfg = simulationConfigFromSettings({}, s, NOW);
      expect(cfg.pensionLockedMonths || 0).toBe(closed * 12);
      const r = simulate({ ...cfg, years: 35, trace: true }, returns, 7);
      for (let m = 0; m < Math.min(closed * 12, r.trace.length); m++) if (r.trace[m].effectiveSipp !== 0) return false;
      const rows = generateDrawdownSchedule(s, 35, 0.025, NOW);
      for (let y = 0; y < closed; y++) if (rows[y].sippDraw !== 0) return false;
      const p = planOf(s);
      for (let y = 0; y < closed; y++) if ((p.targetSchedule ? p.targetSchedule[y] : p.targetAnnual) !== 0) return false;
      return closed > 0 ? p.pensionLock.years === closed : p.pensionLock === undefined;
    }), { numRuns: 40 });
  });
});

describe('the pension the run starts from', () => {
  it('is its pots, the diversifiers sleeve included', () => {
    expect(pensionPotOf({ equityStart: 1, bondStart: 2, cashStart: 3, diversifierStart: 4 })).toBe(10);
    expect(pensionPotOf(null)).toBe(0);
  });
  it('earlyPensionDrawOf still says when the plan starts before the age (the fact the home shows)', () => {
    expect(earlyPensionDrawOf(ALEX, NOW)).toEqual({ age: 57, taxYear: 2026 });
    expect(Object.keys(STRATEGY_NAMES)).toHaveLength(9);
  });
});

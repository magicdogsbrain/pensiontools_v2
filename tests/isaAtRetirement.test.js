/**
 * The ISA a plan that retires later starts its runs from (review of 6.22.0, 2 Oct 2026). Three faults the reviewers found,
 * each held here:
 *
 *  1. No ISA today, money going into one: the Timing block and the age spin counted the pay-ins, but every run started
 *     with an ISA of £0 — the pots-at-retirement scale can only scale an ISA above £0. Now, with no ISA today, the ISA at
 *     retirement (potAtRetirement.isa) is the ISA the runs start from (PlanTiming.isaAtRetirementOf), in the config, the
 *     strategies' plan, the spin's runs and the line above the runs. A plan without the ISA choice (locked before it)
 *     keeps its figures.
 *  2. A plan made from a V7 answer with no savings today wrote V7's savings at the stop into isaBalance as a stand-in for
 *     today's ISA, and 6.22.0's new readers (the Timing projection, the spin, the Accumulation column, the saving path) then
 *     added the pay-ins again. Now the seed writes the true £0 today and V7's savings at the stop as the ISA at retirement;
 *     the runs start from the same figure as before.
 *  3. An ISA made of the ISA funds in the list of funds to test: the runs follow those funds and the choice is hidden behind
 *     their line, but the projections to retirement used the hidden "Mostly cash". Now they keep the line used before the
 *     choice (pay-ins counted), and a saver's path follows the funds' own mix.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { projectedPotAtRetirement, isaAtRetirementOf, deriveTiming, potScaleOf } from '../src/services/PlanTiming.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { isaAtAge, sweepPlanAt } from '../src/services/RetireSweep.js';
import { startSummaryHtml, startsScaled } from '../src/ui/startingPotsWords.js';
import { isaGrowthRunLine, accumulationIsaNote, isaGrowthFieldState } from '../src/ui/isaGrowthSetting.js';
import { isaLineRows, accumulationTableHtml } from '../src/ui/accumulationProjection.js';
import { buildSavingPath } from '../src/services/SavingPath.js';
import { saverReading } from '../src/services/SaverReading.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { savingPathV3Html } from '../src/ui/components/PlanDocumentView.js';
import { seedToScenario } from '../src/services/PlanSeed.js';
import { buildPlanSeed } from '../src/answers/keep/planSeed.js';
import { deriveIsaMix } from '../src/storage/StressRepository.js';
import { isaFundsDecide, isaFundsSavingMix } from '../src/services/IsaFunds.js';
import { savingPlan, savingYearsByLife } from '../src/answers/shared/saving.js';
import { livesList } from '../src/answers/shared/lives.js';
import { migrateScenario } from '../src/storage/migrations.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';
import { allowanceNudge } from '../src/services/HouseholdService.js';
import { isaTodayOrAtRetirement } from '../src/services/PotsAtRetirement.js';
import * as frozenPlanner from './v7/keep/seed.v1/plannerSeed.js';
import * as frozenV7 from './v7/keep/seed.v1/v7Seed.js';

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
const NOW = new Date('2026-10-02T12:00:00Z');

// ---------------------------------------------------------------------------------------------------------------------
describe('1. no ISA today, money going into one: the runs start from the ISA at retirement', () => {
  const s0 = { currentAge: 50, currentAgeAsOf: '2026-10-02', retired: false, retireAge: 60, equityMin: 240000, bondMin: 120000, cashTarget: 40000, isaBalance: 0, chargesPct: 0.5, isaGrowth: 'cash', duration: 30, baseSalary: 30000 };
  const acc = { potNow: 400000, netMonthly: 0, isaMonthly: 500, escalationPct: 0 };
  const par = projectedPotAtRetirement(s0, acc, NOW);
  const saved = { ...s0, potAtRetirement: { sipp: par.sipp, isa: par.isa, source: 'accumulation' } };

  it('the Timing block counts the pay-ins (the reviewers\' £49,244)', () => {
    expect(par.isa).toBeGreaterThan(45000);
    expect(par.isa).toBeLessThan(55000);
  });
  it('the config, the strategies\' plan and the Pots & Valves config start from it', () => {
    expect(isaAtRetirementOf(saved)).toBe(par.isa);
    const cfg = createSimulationConfigFromSettings({}, saved);
    expect(cfg.isaBalance).toBe(par.isa);
    const p = planFromSettings(saved, cfg, { now: NOW });
    expect(p.isa).toBe(par.isa);
    expect(p.pnvCfg.isaBalance).toBe(par.isa);
  });
  it('the same plan with £1 in the ISA today gives within £1 of it: £0 no longer drops the pay-ins', () => {
    const one = { ...saved, isaBalance: 1, potAtRetirement: { ...saved.potAtRetirement, isa: projectedPotAtRetirement({ ...s0, isaBalance: 1 }, acc, NOW).isa } };
    expect(Math.abs(createSimulationConfigFromSettings({}, one).isaBalance - createSimulationConfigFromSettings({}, saved).isaBalance)).toBeLessThanOrEqual(1);
  });
  it('with an ISA today, the scale as before, figure for figure', () => {
    const withIsa = { ...saved, isaBalance: 20000, potAtRetirement: { ...saved.potAtRetirement, isa: 70000 } };
    expect(createSimulationConfigFromSettings({}, withIsa).isaBalance).toBe(20000 * potScaleOf(withIsa).isa);
    expect(isaAtRetirementOf(withIsa)).toBe(20000 * potScaleOf(withIsa).isa);
  });
  it('already retired, or no ISA at retirement: nothing is invented', () => {
    expect(isaAtRetirementOf({ ...saved, retired: true, retireAge: null })).toBe(0);
    expect(isaAtRetirementOf({ ...saved, potAtRetirement: { sipp: par.sipp, isa: null } })).toBe(0);
    expect(isaAtRetirementOf({ ...saved, potAtRetirement: null })).toBe(0);
  });
  it('a plan locked before the ISA choice keeps its figures: no ISA today stays no ISA in the runs', () => {
    const { isaGrowth, ...locked } = saved;
    void isaGrowth;
    const typed = { ...locked, potAtRetirement: { sipp: par.sipp, isa: 30000, source: 'override' } };
    expect(isaAtRetirementOf(typed)).toBe(0);
    expect(createSimulationConfigFromSettings({}, typed).isaBalance).toBe(0);
  });
  it('a strategy with a pinned "Total in your SIPP" and no ISA total: the ISA at retirement when there is no ISA today; a pinned £0 beside an ISA today stays £0', () => {
    const pinned = { ...saved, strategyId: 'gilt-ladder', strategyParams: { sippTotal: 400000 } };
    expect(planFromSettings(pinned, createSimulationConfigFromSettings({}, pinned), { now: NOW }).isa).toBe(par.isa);
    const isaToday = { ...pinned, isaBalance: 20000, potAtRetirement: { ...pinned.potAtRetirement, isa: 70000 }, strategyParams: { sippTotal: 400000, isaTotal: 0 } };
    expect(planFromSettings(isaToday, createSimulationConfigFromSettings({}, isaToday), { now: NOW }).isa).toBe(0);
    const pinnedIsa = { ...isaToday, strategyParams: { sippTotal: 400000, isaTotal: 10000 } };
    expect(planFromSettings(pinnedIsa, createSimulationConfigFromSettings({}, pinnedIsa), { now: NOW }).isa).toBe(10000 * potScaleOf(pinnedIsa).isa);
  });
  it('the age spin\'s runs start from its ISA at that age', () => {
    const t = deriveTiming(s0, NOW);
    const { s, isa } = sweepPlanAt({ settings: s0, accumulation: acc, currentAge: t.currentAge, age: 60, timing: t });
    expect(isa).toBe(isaAtAge({ settings: s0, accumulation: acc, currentAge: t.currentAge, age: 60 }).isa);
    expect(isa).toBeGreaterThan(45000);
    expect(createSimulationConfigFromSettings({}, s).isaBalance).toBe(isa);
  });
  it('the line above the runs says the ISA the runs start from, and how it grows', () => {
    expect(startsScaled(saved)).toBe(true);
    const t = plain(startSummaryHtml(saved));
    expect(t).toContain('ISA £' + par.isa.toLocaleString('en-GB') + '.');
    expect(t).toContain('ISA £0 today) scaled to the pots at retirement in the Timing block, with the ISA at retirement taken as the Timing block gives it (there is no ISA today to scale).');
    expect(isaGrowthRunLine(saved)).toMatch(/grows like cash/);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('2. a plan made from a V7 answer with no savings today: today\'s £0 is kept, the savings at the stop are the ISA at retirement', () => {
  const state = JSON.parse(readFileSync(resolve(__dirname, 'v7/states/b/answer-B4-before-57.json'), 'utf8'));
  const seed = buildPlanSeed({ source: 'b', result: state.answers.b.result, env: { today: '2026-09-30', appVersion: '6.22.0' }, name: { chosen: 'My try' }, createdAt: '2026-09-30T14:03:22.511Z' });
  const day = new Date(2026, 8, 30, 15, 0);
  const { yours } = seedToScenario(seed, day);
  const S = yours.stressTool.settings, A = yours.accumulationTool.settings;
  const p = seed.people[0];
  const v7AtStop = p.savings.atStop.middling;

  it('the answer: no savings today, £300 a month going in, savings at the stop of about £71,000', () => {
    expect(p.savings.today).toBe(0);
    expect(A.isaMonthly).toBe(300);
    expect(v7AtStop).toBeGreaterThan(60000);
  });
  it('the plan: ISA £0 today, the ISA at retirement V7\'s middling savings at the stop; the runs start from the same figure as before', () => {
    expect(S.isaBalance).toBe(0);
    expect(S.potAtRetirement).toMatchObject({ isa: v7AtStop, source: 'override' });
    expect(createSimulationConfigFromSettings({}, S).isaBalance).toBe(v7AtStop);
  });
  it('the age spin and the Timing projection count the pay-ins once: close to V7\'s figure, not 42% above it', () => {
    const t = deriveTiming(S, day);
    const spin = isaAtAge({ settings: S, accumulation: A, currentAge: t.currentAge, age: S.retireAge }).isa;
    const timing = projectedPotAtRetirement(S, A, day).isa;
    for (const v of [spin, timing]) {
      expect(v).toBeLessThan(v7AtStop * 1.1);
      expect(v).toBeGreaterThan(v7AtStop * 0.6);
    }
    expect(spin).toBe(timing);
  });
  it('the Accumulation planner\'s column starts at £0', () => {
    const rows = isaLineRows(S, { currentAge: A.currentAge, retirementAge: A.retirementAge, isaMonthly: A.isaMonthly });
    expect(rows[0].potMid).toBe(0);
    expect(rows[rows.length - 1].potMid).toBeGreaterThan(0);
  });
  it('the saving path drawn on locking starts the ISA at £0; a year on, a pension on its middle line and a year\'s savings read in the middle, not below the bad line', () => {
    const t = deriveTiming(S, day);
    const path = buildSavingPath({ settings: S, timing: t, accumulation: A, now: day, lives: 200 });
    expect(path.isaNow).toBe(0);
    expect(path.path[0].isa.middling).toBe(0);
    const doc = { createdAt: day.toISOString(), lockedAt: day.toISOString(), timing: { mode: 'future' }, accumulation: path };
    const r = saverReading(doc, { at: '2027-09', pension: path.path[1].pension.middling, isa: 300 * 12 });
    expect(r.band).not.toBe('below p10');
    expect(Math.abs(r.compared / r.expected - 1)).toBeLessThan(0.05);
  });
  it('the Drawdown table and the couples\' allowance nudge still start from the savings at the stop, as with the old stand-in', () => {
    const asBefore = { ...S, isaBalance: v7AtStop };   // what the seed wrote until the review of 6.22.0
    expect(isaTodayOrAtRetirement(S)).toBe(v7AtStop);
    expect(generateDrawdownSchedule(S, 12, 0.025, day)).toEqual(generateDrawdownSchedule(asBefore, 12, 0.025, day));
    expect(allowanceNudge(S, S, 'You', 'Partner', day)).toEqual(allowanceNudge(asBefore, asBefore, 'You', 'Partner', day));
    // an ISA today, or a plan without the ISA choice: today's ISA as it always was
    expect(isaTodayOrAtRetirement({ ...S, isaBalance: 5000 })).toBe(5000);
    const { isaGrowth, ...noChoice } = S;
    void isaGrowth;
    expect(isaTodayOrAtRetirement(noChoice)).toBe(0);
    expect(isaTodayOrAtRetirement({})).toBe(0);
  });
  it('savings today above £0 are written as they are (unchanged)', () => {
    const withSavings = JSON.parse(JSON.stringify(seed));
    withSavings.people[0].savings.today = 12000;
    const S2 = seedToScenario(withSavings, day).yours.stressTool.settings;
    expect(S2.isaBalance).toBe(12000);
    expect(createSimulationConfigFromSettings({}, S2).isaBalance).toBeCloseTo(v7AtStop, 6);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('2b. a plan saved from a V7 answer before 6.22.0 with no savings today: the move to version 3 writes today\'s £0 (unlocked plans only)', () => {
  const state = JSON.parse(readFileSync(resolve(__dirname, 'v7/states/b/answer-B4-before-57.json'), 'utf8'));
  const day = new Date(2026, 8, 30, 15, 0);
  const v1 = frozenV7.buildPlanSeed({ source: 'b', result: state.answers.b.result, env: { today: '2026-09-30', appVersion: '6.19.0' }, name: { chosen: 'My try' }, createdAt: '2026-09-30T14:03:22.511Z' });
  const made = frozenPlanner.seedToScenario(v1, day).yours;
  /** As a 6.19.0–6.21.x app saved it: version 2, no ISA choice, the savings at the stop standing in for today's. */
  const asSaved = (over = (c) => c) => { const c = JSON.parse(JSON.stringify(made)); c.schemaVersion = 2; delete c.stressTool.settings.isaGrowth; return over(c); };
  const atStop = v1.people[0].savings.atStop.middling;
  const bytes = (v) => JSON.stringify(v);

  it('the plan as saved: ISA today = the savings at the stop = the ISA at retirement; the answer had £0 today', () => {
    const S = asSaved().stressTool.settings;
    expect(v1.people[0].savings.today).toBe(0);
    expect([S.isaBalance, S.potAtRetirement.isa, S.potAtRetirement.source]).toEqual([atStop, atStop, 'override']);
  });
  it('unlocked: today\'s £0 is written with "Mostly cash"; the runs start from the very same ISA; nothing else moves', () => {
    const before = asSaved();
    const m = migrateScenario(before, { now: day });
    expect(m.error).toBeNull();
    const S = m.scenario.stressTool.settings;
    expect([S.isaBalance, S.isaGrowth, S.potAtRetirement.isa]).toEqual([0, 'cash', atStop]);
    expect(createSimulationConfigFromSettings({}, S).isaBalance).toBe(createSimulationConfigFromSettings({}, before.stressTool.settings).isaBalance);
    const { isaBalance: a, isaGrowth: b, ...rest } = S;
    const { isaBalance: c, ...was } = before.stressTool.settings;
    void a; void b; void c;
    expect(bytes(rest)).toBe(bytes(was));
    const { schemaVersion: v, stressTool: x, ...root } = m.scenario;
    const { schemaVersion: w, stressTool: y, ...rootWas } = before;
    void v; void w; void x; void y;
    expect(bytes(root)).toBe(bytes(rootWas));
    // a saver's path drawn on locking now starts the ISA at £0, as the saver holds
    const path = buildSavingPath({ settings: S, timing: deriveTiming(S, day), accumulation: m.scenario.accumulationTool.settings, now: day, lives: 100 });
    expect(path.isaNow).toBe(0);
  });
  it('locked: not touched at all', () => {
    const locked = asSaved((c) => { c.decisionTool.settings.locked = true; return c; });
    const m = migrateScenario(locked, { now: day });
    expect(m.error).toBeNull();
    expect(bytes(m.scenario.stressTool.settings)).toBe(bytes(locked.stressTool.settings));
  });
  it('changed since (the ISA box, the Timing block, the answer\'s own savings): left as it is but for the choice', () => {
    const cases = [
      (c) => { c.stressTool.settings.isaBalance = 30000; return c; },
      (c) => { c.stressTool.settings.potAtRetirement = { ...c.stressTool.settings.potAtRetirement, source: 'accumulation' }; return c; },
      (c) => { c.stressTool.settings.potAtRetirement = { ...c.stressTool.settings.potAtRetirement, isa: atStop + 1 }; return c; },
      (c) => { c.fromAnswer.people[0].savings.today = 1000; return c; },
      (c) => { delete c.fromAnswer; return c; },
      (c) => { c.stressTool.settings.retired = true; return c; }
    ];
    for (const [i, f] of cases.entries()) {
      const before = asSaved(f);
      const S = migrateScenario(before, { now: day }).scenario.stressTool.settings;
      expect(S.isaBalance, 'case ' + i).toBe(before.stressTool.settings.isaBalance);
      expect(S.isaGrowth, 'case ' + i).toBe('cash');
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('3. an ISA held in the ISA funds of the list of funds to test: the projections never use the hidden choice', () => {
  const funds = [{ ticker: 'VWRP', value: 100000, wrapper: 'ISA', ocf: 0.22 }, { ticker: 'VWRP', value: 400000, wrapper: 'SIPP', ocf: 0.22 }];
  const before = { currentAge: 50, currentAgeAsOf: '2026-10-02', retired: false, retireAge: 62, equityMin: 240000, bondMin: 120000, cashTarget: 40000, isaBalance: 100000, chargesPct: 0.5, taggedFunds: funds };   // as 6.21.0 held it
  const migrated = { ...before, isaGrowth: 'cash' };   // what the schemaVersion 3 migration writes into it
  const acc = { potNow: 400000, netMonthly: 0, escalationPct: 0 };

  it('the funds decide: the setting shows their line, the runs follow them', () => {
    expect(isaFundsDecide(migrated)).toBe(true);
    expect(isaGrowthFieldState(migrated).mode).toBe('isa-funds');
    expect(createSimulationConfigFromSettings({}, migrated).isaMix).toEqual(deriveIsaMix(funds));
  });
  it('the Timing block: 6.21.0\'s figure (the middle band), not the hidden cash line', () => {
    const was = projectedPotAtRetirement(before, acc, NOW).isa;
    expect(projectedPotAtRetirement(migrated, acc, NOW).isa).toBe(was);
    expect(projectedPotAtRetirement({ ...migrated, isaGrowth: 'invested' }, acc, NOW).isa).toBe(was);
    expect(was).toBeGreaterThan(120000);   // the reviewers' £127,417 (6.22.0 before this fix: £83,711)
  });
  it('the age spin: 6.21.0\'s figure (2% a year after prices)', () => {
    const was = isaAtAge({ settings: before, accumulation: acc, currentAge: 50, age: 62 });
    expect(isaAtAge({ settings: migrated, accumulation: acc, currentAge: 50, age: 62 })).toEqual(was);
  });
  it('the Accumulation planner\'s column: the Timing block\'s line, row for row, and its words name the funds', () => {
    const inputs = { currentAge: 50, retirementAge: 62 };
    expect(isaLineRows(migrated, inputs)).toEqual(isaLineRows(before, inputs));
    const html = plain(accumulationTableHtml({ rows: [{ age: 50, potLow: 1, potMid: 1, potHigh: 1, contributedToDate: 0 }], stress: migrated, inputs }));
    expect(html).toMatch(/ISA funds in your list of funds to test/);
    expect(accumulationIsaNote('funds', 250)).toMatch(/£250 a month going in/);
  });
  it('what goes into ISAs each month is paid in, on the same line', () => {
    const paying = { ...acc, isaMonthly: 400 };
    expect(projectedPotAtRetirement(migrated, paying, NOW).isa).toBeGreaterThan(projectedPotAtRetirement(migrated, acc, NOW).isa + 400 * 12 * 12 * 0.8);
    const spin = isaAtAge({ settings: migrated, accumulation: paying, currentAge: 50, age: 62 }).isa;
    expect(spin).toBeGreaterThan(isaAtAge({ settings: migrated, accumulation: acc, currentAge: 50, age: 62 }).isa + 400 * 12 * 12 * 0.8);
    // a plan without the choice (locked before it) still pays nothing in, as before
    expect(isaAtAge({ settings: before, accumulation: paying, currentAge: 50, age: 62 })).toEqual(isaAtAge({ settings: before, accumulation: acc, currentAge: 50, age: 62 }));
  });
  it('the funds\' mix for the saving years: shares : bonds and diversifiers : cash, as shares of 1; none without ISA funds', () => {
    expect(isaFundsSavingMix(migrated)).toEqual({ equity: 1, bond: 0, cash: 0 });
    expect(isaFundsSavingMix({ ...migrated, taggedFunds: funds.filter((f) => f.wrapper !== 'ISA') })).toBeNull();
    expect(isaFundsSavingMix({})).toBeNull();
  });
  it('V7\'s saving-years engine: a savings mix equal to the pension\'s own gives the savings the pension\'s factors, bit for bit; it wins over "Mostly cash"', () => {
    const mix = { equity: 0.6, bond: 0.3, cash: 0.1 };
    const household = { people: [{ who: 'you', age: 0, pots: { pension: 100000, isa: 50000 }, saving: { payIn: { total: 500 }, savingsIn: 200 } }], chargesPct: 0.5, isaGrowth: 'invested', portfolio: { kind: 'risk', level: 'balanced' } };
    const lives = livesList(40, 11, { seed: 0 });
    const plan = savingPlan(household, 10, { mix, savingMix: mix });
    const a = savingYearsByLife(plan, 0, lives, {});
    const b = savingYearsByLife(plan, 0, lives, { savingsMix: mix });
    expect(Array.from(b.savings)).toEqual(Array.from(a.savings));
    expect(Array.from(b.pension)).toEqual(Array.from(a.pension));
    const cash = savingPlan({ ...household, isaGrowth: 'cash' }, 10, { mix, savingMix: mix });
    expect(Array.from(savingYearsByLife(cash, 0, lives, { savingsMix: mix }).savings)).toEqual(Array.from(a.savings));
    expect(Array.from(savingYearsByLife(cash, 0, lives, {}).savings)).not.toEqual(Array.from(a.savings));
    expect(Array.from(savingYearsByLife(cash, 0, lives, { savingsMix: { equity: -1, bond: 0, cash: 0 } }).savings)).toEqual(Array.from(savingYearsByLife(cash, 0, lives, {}).savings));   // a nonsense mix: ignored
  });
  it('a saver\'s path follows the funds\' own mix (all shares here), not cash, and says so', () => {
    const t = deriveTiming(migrated, NOW);
    const path = buildSavingPath({ settings: migrated, timing: t, accumulation: acc, now: NOW, lives: 200 });
    expect(path.isaFromFunds).toBe(true);
    expect(path.isaMix).toEqual({ equity: 1, bond: 0, cash: 0 });
    const cash = buildSavingPath({ settings: { ...migrated, taggedFunds: funds.filter((f) => f.wrapper !== 'ISA') }, timing: t, accumulation: acc, now: NOW, lives: 200 });
    expect(cash.isaFromFunds).toBeUndefined();
    const last = path.path.length - 1;
    expect(path.path[last].isa.real).toBeGreaterThan(cash.path[last].isa.real * 1.2);
    // shares move: the ISA's own spread is wide, so the bad and good lines of the whole pot part further than with cash
    const width = (pp) => pp.path[last].nominal.good - pp.path[last].nominal.careful;
    expect(width(path)).toBeGreaterThan(width(cash));
    const doc = buildPlanDocument({ settings: migrated, accumulation: acc, lockedAt: NOW.toISOString(), now: NOW, savingPath: path });
    expect(plain(savingPathV3Html(doc))).toMatch(/The ISA follows the ISA funds in your list of funds to test/);
  });
});

/**
 * Bug replays — the residuals: what was still wrong after September's fixes (research/bug-replay-catalogue.md,
 * "Findings — wrong today", and G2's "45 when the Budget was never set up"). Fixed in 6.13.5.
 *
 *   G2-residual     a plan with no age of its own was treated as a 45-year-old (the blank Budget's placeholder).
 *   R6.12.5-c       a pasted gilt kept a stray "CGT" as its ticker and swallowed the real Capital Gearing Trust line.
 *   R6.13.0-b       a Pots & Valves plan still carrying a deselected ladder's pot total is planned on that pot
 *                   (planFromSettings now reads a Pots & Valves plan's params clean; a what-if names its strategy).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The repository under test reads the active plan through ScenarioRepository: hand it a plan directly.
const store = vi.hoisted(() => ({ stress: null, budget: null }));
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => true, isLoggedIn: () => true }));
vi.mock('../../src/storage/ScenarioRepository.js', () => ({
  getActiveStressSettings: async () => (store.stress ? JSON.parse(JSON.stringify(store.stress)) : null),
  getActiveBudget: async () => (store.budget ? JSON.parse(JSON.stringify(store.budget)) : null),
  saveActiveStressSettings: async () => {},
  invalidateScenarioCache: () => {},
  // 6.20.2: the settings as stored (the lock guard's yardstick, and what the timing pin is written onto)
  storedActiveSettings: async (kind) => (kind === 'stress' && store.stress ? JSON.parse(JSON.stringify(store.stress)) : undefined),
  activePlanLocked: async () => false
}));

import { loadStressDBAsync, invalidateStressCache, createSimulationConfigFromSettings } from '../../src/storage/StressRepository.js';
import { defaultBudget, budgetAgesKnown, budgetAgeToday, budgetRetirementAge, markBudgetAgesSet, DEFAULT_BUDGET_AGES } from '../../src/services/BudgetModel.js';
import { deriveTiming } from '../../src/services/PlanTiming.js';
import { budgetIncomeShapePatch } from '../../src/services/BudgetToPlan.js';
import { matchRows, mergeLedger, isGiltCode } from '../../src/services/HoldingsPaste.js';
import { planFromSettings } from '../../src/strategies/stressTest.js';
import { SEPT_2026, frozenAt } from './_replay.js';

beforeEach(() => { invalidateStressCache(); store.stress = null; store.budget = null; });

/** A cold load of the active plan's Stress settings, as the app does it, on the September walk-through day. */
const load = (stress, budget) => frozenAt(SEPT_2026, async () => { store.stress = stress; store.budget = budget; invalidateStressCache(); return (await loadStressDBAsync()).settings; });

// A plan created and never given an age: the Stress settings as ScenarioRepository writes them (age null).
const NO_AGE = { equityMin: 250000, bondMin: 200000, cashTarget: 50000, duration: 35, baseSalary: 30000, currentAge: null, currentAgeAsOf: null, retired: null, retireAge: null, firstTaxYear: null };

describe('nothing invents an age (G2 residual — "45 when the Budget was never set up")', () => {
  it('G2-residual — a plan with no age and a Budget nobody opened stays age-unknown; it is not planned as a 45-year-old', async () => {
    const s = await load(NO_AGE, defaultBudget());
    expect(s.currentAge).toBeNull();                               // was 45
    expect(s.currentAgeAsOf).toBeNull();
    expect(s.retired).toBeNull();                                  // was false ("retiring later")
    expect(s.firstTaxYear).toBeNull();                             // was 2038: twelve years of saving nobody asked for
    const t = await frozenAt(SEPT_2026, () => deriveTiming(s));
    expect(t.mode).toBe('legacy');                                 // was 'future'
    expect(t.currentAge).toBeNull();                               // the consumers' "unknown — ask"
    expect(t.firstTaxYear).toBe(2027);                             // next April, as for any plan with no age
    expect(t.potScale).toEqual({ sipp: 1, isa: 1 });               // the pots are not grown for 12 invented years
  });

  it('G2-residual — the same holds for a budget saved with the 45 / 60 placeholders and lines filled in', async () => {
    // Opened the Budget page, typed spending, never touched the two age boxes: saved merged over the defaults.
    const budget = { ...defaultBudget(), lines: [{ id: 'a', label: 'Food', tier: 'essential', annual: 4800 }], derived: {} };
    expect((await load(NO_AGE, budget)).currentAge).toBeNull();
    expect((await load(NO_AGE, { ...budget, agesSetByUser: false })).currentAge).toBeNull();   // an explicit false is still "not marked"
  });

  it('G2-residual — an age a person gave still reaches the Stress settings, and a newer Budget age still wins', async () => {
    // Saved before the marker existed, ages changed on the Budget page: counts as set.
    expect((await load(NO_AGE, { ...defaultBudget(), currentAge: 52, retirementAge: 60 })).currentAge).toBe(52);
    expect((await load(NO_AGE, { ...defaultBudget(), currentAge: 45, retirementAge: 63 })).currentAge).toBe(45);
    // Really 45 and retiring at 60: the marker (Budget edit / setup wizard) or the Timing block's date says so.
    expect((await load(NO_AGE, markBudgetAgesSet(defaultBudget()))).currentAge).toBe(45);
    expect((await load(NO_AGE, { ...defaultBudget(), currentAgeAsOf: '2026-09-10', retired: false })).currentAge).toBe(45);
    // The reason the fold exists: the Stress copy went stale at a birthday.
    const stale = await load({ ...NO_AGE, currentAge: 61, currentAgeAsOf: '2025-09-01', retired: true, firstTaxYear: 2026 }, { ...defaultBudget(), currentAge: 62, retirementAge: 60, currentAgeAsOf: '2026-09-02' });
    expect([stale.currentAge, stale.currentAgeAsOf]).toEqual([62, '2026-09-02']);
    // A placeholder 45 never lowers or replaces an age the plan has.
    expect((await load({ ...NO_AGE, currentAge: 38, currentAgeAsOf: '2026-09-01' }, defaultBudget())).currentAge).toBe(38);
  });

  it('G2-residual — the blank budget says its ages are placeholders; consumers read "unknown"', () => {
    const b = defaultBudget();
    expect([b.currentAge, b.retirementAge]).toEqual([DEFAULT_BUDGET_AGES.currentAge, DEFAULT_BUDGET_AGES.retirementAge]);   // the Budget page's boxes still show 45 / 60
    expect(b.agesSetByUser).toBeUndefined();                       // no marker on a blank budget, so nothing new is written into a saved one
    expect(budgetAgesKnown(b)).toBe(false);
    expect(budgetAgeToday(b)).toBeNull();
    expect(budgetRetirementAge(b)).toBeNull();
    expect(budgetAgesKnown(null)).toBe(false);
    expect(budgetAgesKnown({ currentAge: 0, retirementAge: 0, agesSetByUser: true })).toBe(false);   // a cleared box is not an age
    const given = defaultBudget(58, 62);                           // built WITH ages: they are the user's
    expect(given.agesSetByUser).toBe(true);
    expect([budgetAgeToday(given), budgetRetirementAge(given)]).toEqual([58, 62]);
    expect(budgetAgeToday(markBudgetAgesSet(defaultBudget()))).toBe(45);
  });
});

describe('pasting a statement — the rest of R6.12.5-c', () => {
  const gilt = { ticker: 'CGT', name: '0 1/8% Index-linked Treasury Gilt 2031', value: 20000, units: 18000 };   // "CGT" is the statement's column heading
  const trust = { ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000 };

  it('R6.12.5-c — a gilt recognised by its name does not keep a stray code as its ticker', () => {
    const m = matchRows([gilt, trust, { ticker: 'PNL', name: 'Treasury 4.25% 2040', value: 1000 }, { ticker: 'CGT', name: 'UK Gilt (no year)', value: 1 }]);
    expect(m[0].match).toMatchObject({ kind: 'gilt', ticker: 'T31', confidence: 'name-only' });   // was 'CGT'
    expect(m[1].match).toMatchObject({ kind: 'catalogue', ticker: 'CGT' });                        // the real trust is untouched
    expect(m[2].match.ticker).toBe('T40');                                                        // was 'PNL'
    expect(m[3].match).toMatchObject({ kind: 'gilt', ticker: '' });                               // no year to derive from: no ticker, not the stray one
    // A real gilt code in the ticker column is still kept.
    expect(matchRows([{ ticker: 'TR31', name: 'Treasury 0.125% I/L 2031', value: 1 }])[0].match.ticker).toBe('TR31');
    expect(['T31', 'TR31', 'TG54', 'TN28', 'T26A'].every(isGiltCode)).toBe(true);
    expect(['CGT', 'PNL', 'VWRP', 'CSH2', '', null].some(isGiltCode)).toBe(false);
  });

  it('R6.12.5-c — pasted together, the gilt and the trust are two lines and no money disappears', () => {
    const r = mergeLedger([], matchRows([gilt, trust]), { wrapper: 'SIPP' });
    expect(r.ledger.length).toBe(2);                               // was 1
    expect(r.ledger.reduce((t, l) => t + l.value, 0)).toBe(25000);   // was 5,000: the gilt's £20,000 had gone
    const cgt = r.ledger.find((l) => l.ticker === 'CGT');
    expect(cgt).toMatchObject({ name: 'Capital Gearing Trust', value: 5000 });
    expect(cgt.kind).toBeUndefined();                              // was 'gilt'
    expect(cgt.units).toBeNull();                                  // was the gilt's 18,000
  });

  it('R6.12.5-c — mergeLedger never merges a gilt with a fund, even handed a match that shares the fund\'s ticker or SEDOL', () => {
    // The shape matchRows produced before the fix (and any caller could still build): a gilt whose ticker is "CGT".
    const strayGilt = { ...gilt, sedol: null, match: { kind: 'gilt', ticker: 'CGT', name: gilt.name, sedol: null, confidence: 'name-only', subClass: 'indexLinked' } };
    const ledger = [{ ticker: 'CGT', name: 'Capital Gearing Trust', value: 5000, units: 120, wrapper: 'SIPP' }];
    const r = mergeLedger(ledger, [strayGilt], { wrapper: 'SIPP' });
    expect(r.ledger.length).toBe(2);
    expect(r.ledger[0]).toEqual(ledger[0]);                        // the trust: not renamed, not revalued, not marked a gilt
    expect(r.ledger[1]).toMatchObject({ kind: 'gilt', value: 20000, units: 18000 });
    expect(r.updated).toEqual([]);
    expect(r.unseen.map((l) => l.ticker)).toEqual(['CGT']);        // the trust was not in this paste, and the preview says so
    // The other way round: a fund row never updates a gilt line that shares its SEDOL.
    const giltLine = [{ ticker: 'TR31', name: 'Index-linked Treasury 2031', kind: 'gilt', sedol: 'B3Y1JG8', value: 38584, units: 35000, wrapper: 'SIPP' }];
    const fundRow = { name: 'Capital Gearing Trust', ticker: 'CGT', sedol: 'B3Y1JG8', value: 5000, units: null, match: { kind: 'catalogue', ticker: 'CGT', name: 'Capital Gearing Trust', subClass: 'multiAsset', confidence: 'ticker' } };
    const r2 = mergeLedger(giltLine, [fundRow], { wrapper: 'SIPP' });
    expect(r2.ledger.length).toBe(2);
    expect(r2.ledger[0]).toEqual(giltLine[0]);
    // A conventional gilt line saved before `kind` was kept (no kind, sub-class "longGilts") is a gilt too.
    const oldGilt = [{ ticker: 'TG54', name: 'Treasury 1 5/8% 2054', subClass: 'longGilts', sedol: 'B3Y1JG8', value: 9000, units: 10000, wrapper: 'SIPP' }];
    const r3 = mergeLedger(oldGilt, [fundRow], { wrapper: 'SIPP' });
    expect(r3.ledger.length).toBe(2);                              // before: one line, the £9,000 gilt gone
    expect(r3.ledger[0]).toEqual(oldGilt[0]);
  });

  it('R6.12.5-c — lines of the same kind still merge: a re-pasted gilt updates its line, a fund its fund', () => {
    const ledger = [
      { ticker: 'TR31', name: 'hand-typed rung', value: 30000, wrapper: 'SIPP' },                 // no kind: typed by hand
      { ticker: 'T40', name: 'Treasury 4.25% 2040', kind: 'gilt', value: 900, wrapper: 'SIPP' },
      { ticker: 'CGT', name: 'Capital Gearing Trust', value: 4000, wrapper: 'SIPP' }
    ];
    const r = mergeLedger(ledger, matchRows([{ ticker: 'TR31', name: 'Treasury 0.125% I/L 2031', value: 38584 }, { ticker: 'PNL', name: 'Treasury 4.25% 2040', value: 1000 }, trust]), { wrapper: 'SIPP' });
    expect(r.ledger.length).toBe(3);
    expect(r.ledger.map((l) => l.value)).toEqual([38584, 1000, 5000]);
    expect(r.added).toEqual([]);
  });
});

describe('G2-residual — the app page reads the Budget\'s age only through "did a person give it?"', () => {
  // index.html is DOM-bound and not importable, so these are checks of its source: the three places that used to read
  // the Budget's 45 / 60 straight off the object, and the places that must say "a person gave this age".
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  it('G2-residual — the Timing block, the Accumulation form and "send the budget to the plan" do not read a placeholder age', () => {
    expect(html).toContain('age = budgetAgeToday(b) || 0;');
    expect(html).not.toContain('age = +b?.currentAge || 0;');
    expect(html).toContain("set('acAge', saved.currentAge ?? budgetAgeToday(budget));");
    expect(html).toContain("set('acRetireAge', saved.retirementAge ?? budgetRetirementAge(budget));");
    // "Send the budget to the plan" moved to src/services/BudgetToPlan.js in 6.20.2 (the inline script may only shrink):
    // the same rule there, and the page hands it the Budget it edits.
    expect(readFileSync(join(process.cwd(), 'src', 'services', 'BudgetToPlan.js'), 'utf8')).toContain('Math.max(budgetRetirementAge(budget) || 0, budgetAgeToday(budget) || 0) || 57');
    expect(html).toContain('budgetIncomeShapePatch(window._budget, await getStressSettingsAsync(), gross, todayIso())');
    // …and it does what it says: a Budget nobody gave ages to starts the shape at 57, not at its 60 placeholder.
    expect(budgetIncomeShapePatch(defaultBudget(), { duration: 30 }, 30000, '2026-10-02').patch.shapeAgeNow).toBe(57);
    expect(budgetIncomeShapePatch(markBudgetAgesSet(defaultBudget(50, 62)), { duration: 30 }, 30000, '2026-10-02').patch.shapeAgeNow).toBe(62);
  });
  it('G2-residual — an age typed on the Budget page, in the setup wizard or for a partner is marked as given', () => {
    expect(html).toContain('if (window._budget.currentAge !== a0 || window._budget.retirementAge !== r0) markBudgetAgesSet(window._budget);');
    expect(html).toContain('if (parseInt(wizardData.currentAge) > 0) markBudgetAgesSet(b);');
    expect(html).toContain('if (+mine.partnerAge > 0) markBudgetAgesSet(theirs);');
    // …and the mark is what makes a real 45 / 60 known
    const b = defaultBudget();
    expect(budgetAgeToday(b)).toBeNull();
    expect(budgetAgeToday(markBudgetAgesSet({ ...b }))).toBe(45);
  });
});

describe('each strategy keeps its own inputs — the rest of R6.13.0-b', () => {
  // A Pots & Valves plan saved before 6.13.0 and never re-saved (a locked one cannot be): its one flat bag still
  // holds the ladder it tried first. The allocation is £300,000 with £80,000 in the ISA.
  const settings = {
    strategyId: 'pots-and-valves', equityMin: 150000, bondMin: 100000, cashTarget: 50000, isaBalance: 80000, duration: 30, baseSalary: 18000,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', protectionMult: 0.8, consecutiveLimit: 3,
    currentAge: 60, currentAgeAsOf: '2026-09-10', retired: true, firstTaxYear: 2027, shapeAgeNow: 61, spStartDate: '10 September 2033', spWeeklyAmount: 230,
    strategyParams: { sippTotal: 1179422, isaTotal: 0, floorToAge: 80, cashYears: 3, essentialsAnnual: 40000 }
  };
  const plan = () => planFromSettings(settings, createSimulationConfigFromSettings({}, settings), { yieldForYear: () => 0.01, startAge: 61, now: SEPT_2026 });

  // Fixed in 6.13.5 (src/strategies/stressTest.js, planFromSettings): a plan whose strategy is Pots & Valves reads
  // StrategyState.activeParams(settings) — nothing. Before: pot = 1,179,422, isa = 0, essentialsAnnual = 40,000 and
  // params carried floorToAge and cashYears. NOT cleaned for bought strategies: three of them (bridge-and-engine,
  // floor-the-schedule, floor-to-age) read dials StrategyState files under another strategy.
  it('R6.13.0-b — a Pots & Valves plan is sized on its own allocation, not on a deselected ladder\'s "Total in your SIPP"', () => {
    const p = plan();
    expect(p.pot).toBe(300000);                                    // live today: 1,179,422
    expect(p.isa).toBe(80000);                                     // live today: 0
    expect(p.params).toEqual({});                                  // Pots & Valves owns no dials
    expect(p.essentialsAnnual).toBe(Math.round(18000 * 0.55));     // live today: the Floor-and-flex dial, 40,000
  });

  // The "Try a strategy" pages run a what-if for ANOTHER strategy on the saved plan: index.html builds
  // `over = { ...settings, strategyId: <the page's strategy>, strategyParams: <that strategy's dials> }`. Without the
  // strategyId the plan would still say Pots & Valves, and the line above would throw the dials away.
  it('R6.13.0-b — a what-if for another strategy on a Pots & Valves plan keeps its dials, because it names its strategy', () => {
    const over = { ...settings, strategyId: 'floor-to-age', strategyParams: { floorToAge: 85 } };
    const p = planFromSettings(over, createSimulationConfigFromSettings({}, over), { yieldForYear: () => 0.01, startAge: 61, now: SEPT_2026 });
    expect(p.params.floorToAge).toBe(85);
    expect(p.pot).toBe(300000);   // no sippTotal among the what-if's dials: the allocation
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain("const over = { ...settings, strategyId: 'full-il-gilt', strategyParams:");
    expect(html).toContain("const over = { ...settings, strategyId: 'floor-to-age', strategyParams:");
    expect(html).toContain('let over = { ...settings, strategyId: id, strategyParams: prm };');
  });

  it('R6.13.0-b — a bought strategy still gets its own dials and the shared pot totals', () => {
    const p = planFromSettings({ ...settings, strategyId: 'floor-to-age' }, createSimulationConfigFromSettings({}, { ...settings, strategyId: 'floor-to-age' }), { yieldForYear: () => 0.01, startAge: 61, now: SEPT_2026 });
    expect(p.pot).toBe(1179422);
    expect(p.params.floorToAge).toBe(80);
  });
});

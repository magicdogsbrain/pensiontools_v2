/**
 * Today's app receives a plan seed from V7 (research/v7/save-as-plan.md, Contract C.2–C.5): src/services/PlanSeed.js.
 *
 * Covered here, without a browser:
 *  - reading the seed: a day's life, a version check, anything unreadable or misshapen deleted on the spot;
 *  - every row of the mapping table (C.3) and the budget sheet (C.5), for one person and a couple, stopping later and
 *    taking money now, before the pension opens with savings, £0 paid in, £0 in a pension today;
 *  - the six "must hold" rules of C.3, using today's own functions (grossUpAnnual / grossToNet, upgradeScenario,
 *    pinTiming / timingPinPatch, createSimulationConfigFromSettings);
 *  - the name rules (C.4) and the create path (partner first, yours active, a failed save undone);
 *  - the confirm step: "Not now" deletes the seed, a failed save keeps it.
 * The plan corpus checks run on the made plans in tests/planSeed.corpus.slow.test.js; the Firestore and guest stores
 * in tests/integration/planSeed*.test.js; the browser walk in tests/integration/newPlanFromSeed.browser.mjs; V7's own
 * seeds in tests/planSeed.v7.test.js.
 *
 * Time zone: PlanTiming reads `currentAgeAsOf` ('YYYY-MM-DD') as a LOCAL day since 1 Oct 2026 (it read midnight UTC,
 * the evening before west of Greenwich, and a seed's birthday is that very day, so every plan made from a seed there
 * started a tax year early). The same plans in seven time zones: tests/planSeed.timezone.test.js.
 *
 * Also here (review of 1 Oct 2026): the receipts the planner leaves for V7 ('made' only when a plan was made), the
 * compare-and-delete of a used seed, the re-read before a save, the words that say why the planner's figures differ
 * (with the quick answer's own), a couple's line, B's pay-in on the confirm step, and the Budget page's words.
 */
import { describe, it, expect, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import {
  SEED_KEY, SEED_VERSION, SEED_VERSIONS, SEED_MAX_AGE_MS, SEED_WORDS, NEW_PLAN_HASH, householdStartWords,
  checkSeed, readSeed, clearSeed, takeSeedEntry, seedToScenario, cleanPlanName, checkPlanName, uniqueName,
  createPlansFromSeed, confirmAndCreate, seedSummary, seedConfirmText, seedSavedNote, questionHref, localDate, targetAtAge,
  RECEIPT_KEY, writeReceipt, dropSeed, seedStillWaiting, answerLastedWords, budgetSummaryWords
} from '../src/services/PlanSeed.js';
import { RECEIPT_KEY as V7_RECEIPT_KEY, SEED_KEY as V7_SEED_KEY } from '../src/answers/keep/planSeed.js';
import { grossUpAnnual, DEFAULT_TAX_BANDS, defaultBudget, annualNetAtAge, summariseBudget } from '../src/services/BudgetModel.js';
import { grossToNet } from '../src/services/TaxCalculator.js';
import { deriveTiming, pinTiming, timingPinPatch, taxYearStartOf, potScaleOf } from '../src/services/PlanTiming.js';
import { scheduleFromSteps } from '../src/services/IncomeSchedule.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { getDefaultDecisionSettings } from '../src/storage/ScenarioRepository.js';
import { SCHEMA_VERSION } from '../src/storage/schema.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { migrateScenario } from '../src/storage/migrations.js';
import { ENGINE_VERSION } from '../src/strategies/version.js';
import { BANDS } from '../src/answers/shared/toEngine.js';
import {
  TODAY, CREATED_AT, NOW_MS, BUDGET_SHEET, ALL_SEEDS, memoryStorage,
  seedA, seedCNow, seedBCouple, seedEarly, seedZeroPot, seedCoupleZeroLater, seedPartTime
} from './integration/fixtures/planSeeds.js';
import * as frozen from './v7/keep/seed.v1/plannerSeed.js';

const SAVED_ON = new Date(2026, 9, 2, 9, 30);   // the plan is made the day after the answer (Q20: dates come from seed.today)
const T = localDate(TODAY);
const make = (seed, opts) => seedToScenario(seed, SAVED_ON, opts);
const stored = (seed) => memoryStorage({ [SEED_KEY]: JSON.stringify(seed) });

/** Firestore takes plain data: no undefined, no NaN or Infinity, no functions or Dates, no arrays inside arrays. */
function firestoreProblems(v, path = '', inArray = false, out = []) {
  if (v === undefined) out.push(path + ' is undefined');
  else if (typeof v === 'number' && !Number.isFinite(v)) out.push(path + ' is ' + v);
  else if (typeof v === 'function' || v instanceof Date) out.push(path + ' is not plain data');
  else if (Array.isArray(v)) { if (inArray) out.push(path + ' is an array inside an array'); v.forEach((x, i) => firestoreProblems(x, path + '[' + i + ']', true, out)); }
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) firestoreProblems(x, path ? path + '.' + k : k, false, out);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------
describe('reading the seed (C.2): one day, one version, never a bad one kept', () => {
  it('a good seed is read and left in place until it is used', () => {
    const s = stored(seedA());
    const r = readSeed(s, NOW_MS);
    expect(r.seed.name.chosen).toBe('Stop at 60 · £1,800 a month');
    expect(s.has(SEED_KEY)).toBe(true);
  });
  it('nothing kept → "none", and nothing is touched', () => {
    const s = memoryStorage();
    expect(readSeed(s, NOW_MS)).toEqual({ problem: 'none' });
  });
  it('at most a day old: exactly 24 hours is read, a millisecond more is deleted', () => {
    const created = Date.parse(CREATED_AT);
    expect(readSeed(stored(seedA()), created + SEED_MAX_AGE_MS).seed).toBeTruthy();
    const s = stored(seedA());
    expect(readSeed(s, created + SEED_MAX_AGE_MS + 1)).toEqual({ problem: 'expired', createdAt: CREATED_AT });
    expect(s.has(SEED_KEY)).toBe(false);
  });
  it('dated more than five minutes ahead of this clock is deleted; four minutes is not', () => {
    const created = Date.parse(CREATED_AT);
    expect(readSeed(stored(seedA()), created - 4 * 60 * 1000).seed).toBeTruthy();
    const s = stored(seedA());
    expect(readSeed(s, created - 6 * 60 * 1000)).toEqual({ problem: 'future', createdAt: CREATED_AT });
    expect(s.has(SEED_KEY)).toBe(false);
  });
  it('a version this code does not know is deleted (old or new); 1 and 2 are read', () => {
    for (const v of [0, 3, '1', '2', 1.5, undefined]) {
      const s = stored({ ...seedA(), seedVersion: v });
      expect(readSeed(s, NOW_MS).problem).toBe('version');
      expect(s.has(SEED_KEY)).toBe(false);
    }
    expect(SEED_VERSION).toBe(2);
    expect(SEED_VERSIONS).toEqual([1, 2]);
    expect(readSeed(stored(seedA()), NOW_MS).seed.seedVersion).toBe(1);
    expect(readSeed(stored(seedApart()), NOW_MS).seed.seedVersion).toBe(2);
  });
  it('unreadable text, a non-object or a bad date is deleted', () => {
    for (const text of ['{not json', '"a string"', '[1,2]', 'null', JSON.stringify({ ...seedA(), createdAt: 'yesterday' })]) {
      const s = memoryStorage({ [SEED_KEY]: text });
      expect(readSeed(s, NOW_MS).problem).toBe('unreadable');
      expect(s.has(SEED_KEY)).toBe(false);
    }
  });
  it('a seed missing a field the mapping reads is deleted ("shape"), naming the field', () => {
    const cases = [
      (x) => { delete x.people[0].takeHome; },
      (x) => { x.people[0].pension.atStop.middling = -1; },
      (x) => { x.people[0].statePension.fromDate = '2037-02-30'; },
      (x) => { x.risk = 'wild'; },
      (x) => { x.household = 'couple'; },              // a couple needs two people
      (x) => { x.today = '1 Oct 2026'; },
      (x) => { x.people[0].finalSalary.increases = 'rpi'; },
      (x) => { x.budget = { lines: [{ label: 'Council tax', annual: '150', essential: true }] }; },
      (x) => { x.people[0].takeHome = [{ fromAge: 60, perMonth: 900 }, { fromAge: 60, perMonth: 800 }]; }
    ];
    for (const change of cases) {
      const seed = seedA(); change(seed);
      const s = stored(seed);
      const r = readSeed(s, NOW_MS);
      expect(r.problem, JSON.stringify(seed).slice(0, 80)).toBe('shape');
      expect(s.has(SEED_KEY)).toBe(false);
      expect(checkSeed(seed, NOW_MS).detail).toBeTruthy();
    }
  });
  it('every fixture is a good seed', () => {
    for (const [name, f] of Object.entries(ALL_SEEDS)) expect(checkSeed(f(), NOW_MS), name).toEqual({ ok: true });
  });
  it('a browser that refuses storage is reported, not thrown', () => {
    const broken = { getItem: () => { throw new Error('denied'); }, removeItem: () => { throw new Error('denied'); } };
    expect(readSeed(broken, NOW_MS)).toEqual({ problem: 'storage' });
    expect(() => clearSeed(broken)).not.toThrow();
  });
  it('at start-up: #new-plan offers it and clears the hash; any other address leaves a good seed alone and still deletes a bad one', () => {
    const drop = vi.fn();
    const s = stored(seedA());
    const e = takeSeedEntry(s, NOW_MS, NEW_PLAN_HASH, drop);
    expect(e.wanted).toBe(true);
    expect(e.seed.source).toBe('a');
    expect(drop).toHaveBeenCalledTimes(1);

    const drop2 = vi.fn();
    const s2 = stored(seedA());
    const e2 = takeSeedEntry(s2, NOW_MS, '', drop2);
    expect(e2).toEqual({ wanted: false, seed: null, problem: null });
    expect(drop2).not.toHaveBeenCalled();
    expect(s2.has(SEED_KEY)).toBe(true);

    const s3 = stored(seedA());
    expect(takeSeedEntry(s3, Date.parse(CREATED_AT) + SEED_MAX_AGE_MS + 1, '#/stress', null).problem).toBe('expired');
    expect(s3.has(SEED_KEY)).toBe(false);

    const e4 = takeSeedEntry(memoryStorage(), NOW_MS, NEW_PLAN_HASH, () => {});
    expect(e4).toEqual({ wanted: true, seed: null, problem: 'none' });
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('the names (C.4)', () => {
  it('cleans what was typed: NFC, control characters and line breaks out, spaces made one, ends trimmed', () => {
    expect(cleanPlanName('  Stop   at 60 \n· £1,800 ')).toBe('Stop at 60 · £1,800');
    expect(cleanPlanName('a\tb')).toBe('ab');   // a tab is a control character: removed, as V7 removes it
    expect(cleanPlanName('Cafe\u0301')).toBe('Café');
    expect(cleanPlanName('a\u0007b\u2028c')).toBe('abc');
  });
  it('refuses an empty name and one over 60 characters, with a plain message; allows "My plan" when typed', () => {
    expect(checkPlanName('   ')).toEqual({ ok: false, problem: 'empty', message: 'Give the plan a name.' });
    expect(checkPlanName('x'.repeat(61))).toMatchObject({ ok: false, problem: 'tooLong', message: 'Keep the name to 60 characters or fewer.' });
    expect(checkPlanName('£'.repeat(60))).toEqual({ ok: true, name: '£'.repeat(60) });       // characters, not bytes
    expect(checkPlanName('😀'.repeat(60)).ok).toBe(true);                                     // not UTF-16 units either
    expect(checkPlanName('My plan')).toEqual({ ok: true, name: 'My plan' });
  });
  it('a name already used gets the lowest free " (n)", ignoring case and spacing', () => {
    expect(uniqueName('Stop at 60', [])).toBe('Stop at 60');
    expect(uniqueName('Stop at 60', ['stop  at 60'])).toBe('Stop at 60 (2)');
    expect(uniqueName('Stop at 60', ['Stop at 60', 'Stop at 60 (2)', 'Stop at 60 (4)'])).toBe('Stop at 60 (3)');
    expect(uniqueName(' Plan ', ['Other'])).toBe('Plan');
  });
  it('agrees with V7\'s own name rules (src/answers/shared/planName.js) wherever that file is present', async () => {
    const path = resolve(__dirname, '../src/answers/shared/planName.js');
    if (!existsSync(path)) return;   // V7's side not built yet: nothing to compare with
    const v7 = await import('../src/answers/shared/planName.js');
    const texts = ['  Stop  at\t60 ', 'Cafe\u0301', '', ' ', 'x'.repeat(61), '£'.repeat(60), 'a\u0007b\u2028c\u2029d', 'My plan'];
    for (const t of texts) {
      const mine = checkPlanName(t);
      const theirs = v7.checkPlanName(t);
      expect({ ok: mine.ok, problem: mine.problem, name: mine.name }, JSON.stringify(t)).toEqual({ ok: theirs.ok, problem: theirs.problem, name: theirs.name });
    }
    const taken = ['Stop at 60', 'stop at 60 (2)', 'Other'];
    for (const n of ['Stop at 60', 'Other', 'New', ' other ']) expect(uniqueName(n, taken)).toBe(v7.withDuplicateSuffix(n, taken));
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('one person stopping later (question A): every row of the mapping table (C.3)', () => {
  const seed = seedA();
  const { yours, partner } = make(seed);
  const S = yours.stressTool.settings;
  const p = seed.people[0];

  it('makes one plan, not active, born at today\'s schema version, with no id', () => {
    expect(partner).toBeNull();
    expect(yours.isActive).toBe(false);
    expect(yours.schemaVersion).toBe(SCHEMA_VERSION);
    expect(yours).not.toHaveProperty('id');
  });
  it('planDetails: the chosen name and the two-line description', () => {
    expect(yours.planDetails.name).toBe('Stop at 60 · £1,800 a month');
    const [first, second] = yours.planDetails.description.split('\n');
    expect(first).toBe("From 'When can I afford to stop work?' on 1 Oct 2026: a pension of about £341,000 and savings of about £23,000 at 60 in a middling case, £268,000 and £21,000 in a bad case (the worst 1 in 10).");
    expect(second).toBe('This plan starts from the middling pot at 60 and does not vary the years before you stop, so its tests can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 (93%).');
    expect(yours.planDetails.description.split('\n').length).toBe(2);   // one person: no couple's line
  });
  it('enabledTools, strategy: the five tools and the one way of taking money V7 runs', () => {
    expect(yours.enabledTools).toEqual(['budget', 'stress', 'decision', 'accumulation', 'household']);
    expect(yours.strategy).toEqual({ id: 'pots-and-valves', params: {}, lockedAt: SAVED_ON.toISOString(), engineVersion: ENGINE_VERSION });
    expect(S.strategyId).toBe('pots-and-valves');
    expect(S.strategyParams).toEqual({});
    expect(S.configured).toBe(true);
  });
  it('the age today, dated; stopping later at 60', () => {
    expect([S.currentAge, S.currentAgeAsOf, S.retired, S.retireAge]).toEqual([56, '2026-10-01', false, 60]);
  });
  it('the first tax year and start age are deriveTiming\'s, from seed.today', () => {
    const t = deriveTiming(S, T);
    expect(t.mode).toBe('future');
    expect(S.firstTaxYear).toBe(t.firstTaxYear);
    expect(S.firstTaxYear).toBe(2030);
    expect(S.shapeAgeNow).toBe(t.shapeAgeNow);
    expect(S.shapeAgeNow).toBe(60);
    expect(S.duration).toBe(35);
  });
  it('the pots today split by the risk level (the intended mix — no funds, no holdings)', () => {
    expect([S.equityMin, S.bondMin, S.cashTarget]).toEqual([125000, 100000, 25000]);
    expect([S.allocMode, S.taggedFunds, S.diversifierStart, S.equityGlideEnabled]).toEqual(['risk', [], 0, false]);
    expect(yours).not.toHaveProperty('holdings');
  });
  it('the middling pots at the stop are the pots at retirement (override); the bad case stays in the record', () => {
    expect(S.potAtRetirement).toEqual({ sipp: 341000, isa: 23000, source: 'override' });
    expect(S.isaBalance).toBe(20000);
    expect([S.isaDrawdownStrategy, S.isaReturn]).toEqual(['minimiseEarlyTax', 0.03]);
    expect(yours.fromAnswer.people[0].pension.atStop.careful).toBe(268000);
  });
  it('the target: the chosen £1,800 a month grossed up by today\'s own sum, level', () => {
    expect(S.baseSalary).toBe(Math.round(grossUpAnnual(1800 * 12)));
    expect(S.incomeShape).toBe('level');
    expect(S.incomeSteps).toEqual([{ fromAge: 60, amount: S.baseSalary }]);
    expect(S).not.toHaveProperty('targetSchedule');
  });
  it('State Pension: yearly, from its date, weekly to the penny', () => {
    expect([S.statePension, S.spStartDate, S.spWeeklyAmount]).toEqual([12547.6, '2037-10-01', 241.3]);
  });
  it('final-salary pension: amount, plan year it starts, rises capped at 5% (lpi5)', () => {
    expect([S.dbAmount, S.dbStartYear, S.dbIndexation]).toEqual([9000, 0, 'lpi5']);
    expect(S.extraIncomes).toEqual([]);
  });
  it('V7\'s assumptions carried: a quarter of each withdrawal tax-free, cuts off, today\'s bands', () => {
    expect([S.accessMethod, S.ufplsYears, S.disableProtection, S.hodlEnabled]).toEqual(['ufpls', null, true, false]);
    expect([S.pa, S.brl, S.hrl, S.taxMode, S.other]).toEqual([12570, 50270, 125140, 'inflates', 0]);
  });
  it('Month by month: the wizard\'s two fields, nothing recorded, not configured, not locked', () => {
    expect(yours.decisionTool.settings).toEqual({ ...getDefaultDecisionSettings(), duration: 35, firstTaxYear: 2030 });
    expect(yours.decisionTool.history).toEqual([]);
    expect(yours.decisionTool.taxYears).toEqual({});
    expect(yours.decisionTool.settings.locked).toBeFalsy();
    expect(yours.decisionTool.settings.configured).toBeFalsy();
  });
  it('the saving section: own pay-in net of the 20% added at source, employer as it is', () => {
    expect(yours.accumulationTool.settings).toEqual({
      currentAge: 56, retirementAge: 60, potNow: 250000, salary: 0, schemeType: 'ras', netMonthly: 400, employerMonthly: 300, escalationPct: 0
    });
  });
  it('the budget with no sheet: the ages only, no lines (the Budget page adds its starters)', () => {
    expect(yours.budgetTool.settings).toEqual({
      ...defaultBudget(56, 60, 95), currentAgeAsOf: '2026-10-01', agesSetByUser: true, retired: false,
      plsaTier: 'moderate', sharedWithPartner: false, mySharePct: 50, lines: [], oneOffs: []
    });
  });
  it('fromAnswer: the seed less the budget, this person only, with who and the day it was made', () => {
    const { budget, people, ...rest } = seed;
    expect(yours.fromAnswer).toEqual({ ...JSON.parse(JSON.stringify(rest)), people: [p], who: 'you', savedOn: '2026-10-02' });
    expect(yours.fromAnswer).not.toHaveProperty('budget');
  });
  it('no lock, no records, no plan document, no holdings, no journey (must hold 5)', () => {
    for (const k of ['planDocument', 'planDocumentArchive', 'holdings', 'journey', 'transition', 'household']) expect(yours, k).not.toHaveProperty(k);
    expect(yours.decisionTool.planOfRecord).toBeUndefined();
  });
  it('is plain data Firestore takes as it is', () => {
    expect(firestoreProblems(yours)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('the six "must hold" rules (C.3)', () => {
  const every = Object.entries(ALL_SEEDS).flatMap(([name, f]) => {
    const seed = f();
    const { yours, partner } = make(seed);
    return [[name + ' (yours)', seed, yours, seed.people[0]], ...(partner ? [[name + ' (partner)', seed, partner, seed.people[1]]] : [])];
  });

  it('1. each row grossed up nets back to its take-home within 50p a month; DEFAULT_TAX_BANDS are V7\'s bands', () => {
    expect(DEFAULT_TAX_BANDS).toEqual(BANDS);
    const net = (g) => grossToNet(g, DEFAULT_TAX_BANDS.pa, DEFAULT_TAX_BANDS.brl, DEFAULT_TAX_BANDS.hrl) / 12;
    for (const [name, , plan, p] of every) {
      const S = plan.stressTool.settings;
      for (const row of p.takeHome) {
        const age = row.fromAge === p.takeHome[0].fromAge ? S.shapeAgeNow : row.fromAge;
        expect(Math.abs(net(targetAtAge(S, age)) - row.perMonth), name + ' at ' + age).toBeLessThanOrEqual(0.5);
      }
    }
    // and across the tax bands, the personal allowance taper included
    for (const perMonth of [0, 500, 1047.5, 1800, 3500, 6000, 7000, 9000, 15000]) {
      const g = Math.round(grossUpAnnual(perMonth * 12));
      expect(Math.abs(net(g) - perMonth), String(perMonth)).toBeLessThanOrEqual(0.5);
    }
    // one person's base target nets back to the chosen figure
    const a = make(seedA()).yours.stressTool.settings;
    expect(Math.abs(net(a.baseSalary) - 1800)).toBeLessThanOrEqual(0.5);
  });

  it('2. nothing is written when the plan is first opened: no upgrade, no migration, no timing pin', () => {
    for (const [name, seed, plan] of every) {
      expect(upgradeScenario(plan).write, name).toBe(false);
      expect(migrateScenario(plan).changed, name).toBe(false);
      const S = plan.stressTool.settings;
      expect(timingPinPatch(S, pinTiming(S, plan.budgetTool.settings, localDate(seed.today))), name).toBeNull();
      // …nor a year later (the age is dated, the start year saved)
      expect(timingPinPatch(S, pinTiming(S, plan.budgetTool.settings, new Date(2027, 9, 15))), name + ' a year on').toBeNull();
    }
  });

  it('3. the planner starts from the middling pot at the stop (later) or today\'s pot (now), to within £3', () => {
    for (const [name, seed, plan, p] of every) {
      const S = plan.stressTool.settings;
      const cfg = createSimulationConfigFromSettings({}, S);
      const later = seed.stop.kind === 'later';
      const pensionStart = later ? p.pension.atStop.middling : p.pension.today;
      const savingsStart = later ? p.savings.atStop.middling : p.savings.today;
      expect(Math.abs(cfg.equityStart + cfg.bondStart + cfg.cashStart - pensionStart), name).toBeLessThanOrEqual(3);
      expect(Math.abs(cfg.isaBalance - savingsStart), name).toBeLessThanOrEqual(3);
      expect(cfg.years, name).toBe(seed.years);
    }
  });

  it('4. the budget sets nothing outside the Budget tool — no essentials floor, no headroom, no total', () => {
    for (const f of [seedA, seedBCouple, seedCNow]) {
      const withSheet = f(); withSheet.budget = JSON.parse(JSON.stringify(BUDGET_SHEET));
      const other = f(); other.budget = { ...JSON.parse(JSON.stringify(BUDGET_SHEET)), lines: [{ heading: 'home', label: 'Council tax', annual: 99999, period: 'yr', essential: true }], totals: { monthly: 8333.25, yearly: 99999, essentialMonthly: 8333.25 } };
      const none = f(); none.budget = null;
      const strip = (plan) => { const { budgetTool, ...rest } = plan; return rest; };
      const a = make(withSheet), b = make(other), c = make(none);
      expect(strip(a.yours)).toEqual(strip(b.yours));
      expect(strip(a.yours)).toEqual(strip(c.yours));
      if (a.partner) expect(a.partner).toEqual(b.partner);
      for (const plan of [a.yours, a.partner].filter(Boolean)) {
        const S = plan.stressTool.settings;
        for (const k of ['essentialsAnnual', 'targetHeadroomMonthly', 'floorAnnual', 'targetSchedule']) if (f !== seedCoupleZeroLater) expect(S, k).not.toHaveProperty(k);
      }
    }
  });

  it('5. no plan comes out locked, with records, a plan document or holdings; taggedFunds is []', () => {
    for (const [name, , plan] of every) {
      expect(plan.decisionTool.settings.locked, name).toBeFalsy();
      expect(plan.decisionTool.history, name).toEqual([]);
      expect(plan.decisionTool.taxYears, name).toEqual({});
      expect(plan.planDocument, name).toBeUndefined();
      expect(plan.holdings, name).toBeUndefined();
      expect(plan.stressTool.settings.taggedFunds, name).toEqual([]);
      expect(firestoreProblems(plan), name).toEqual([]);
    }
  });

  it('6. a couple: the two take-home rows add up to the chosen figure in every stretch where guaranteed income is below it', () => {
    for (const f of [seedBCouple, seedCoupleZeroLater]) {
      const seed = f();
      const [you, partner] = seed.people;
      const gap = you.ageToday - partner.ageToday;
      const rowAt = (rows, age) => rows.filter((r) => r.fromAge <= age).pop();
      const { yours, partner: theirs } = make(seed);
      for (let y = 0; y < seed.years; y++) {
        const ya = you.ageAtStop + y, pa = ya - gap;
        const sum = rowAt(you.takeHome, ya).perMonth + rowAt(partner.takeHome, pa).perMonth;
        if (sum <= seed.spend.perMonth + 0.5 || f === seedBCouple) expect(Math.abs(sum - seed.spend.perMonth), f.name + ' year ' + y).toBeLessThanOrEqual(1);
        // and the two plans' targets carry those rows, grossed up per person (tax is per person)
        const net = (g) => grossToNet(g, 12570, 50270, 125140) / 12;
        expect(Math.abs(net(targetAtAge(yours.stressTool.settings, ya)) - rowAt(you.takeHome, ya).perMonth), 'yours ' + ya).toBeLessThanOrEqual(0.5);
        expect(Math.abs(net(targetAtAge(theirs.stressTool.settings, pa)) - rowAt(partner.takeHome, pa).perMonth), 'partner ' + pa).toBeLessThanOrEqual(0.5);
      }
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('the cases (C.3)', () => {
  it('taking money now (C): retired from this tax year, today\'s pots, no pots at retirement, no saving section', () => {
    const seed = seedCNow();
    const S = make(seed).yours.stressTool.settings;
    expect([S.retired, S.retireAge, S.firstTaxYear, S.shapeAgeNow]).toEqual([true, null, taxYearStartOf(T), 62]);
    expect(S.firstTaxYear).toBe(2026);
    expect(S.potAtRetirement).toBeNull();
    expect([S.equityMin, S.bondMin, S.cashTarget, S.isaBalance]).toEqual([125000, 100000, 25000, 0]);
    expect(potScaleOf(S)).toEqual({ sipp: 1, isa: 1 });
    expect(make(seed).yours.accumulationTool).toBeUndefined();
    expect(make(seed).yours.planDetails.description).toBe("From 'What is that a month?' on 1 Oct 2026.\nThe planner runs its own test, so its figures can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 (90%).");
    // a seed that says "now" with a pay-in still gets no saving section
    const paying = seedCNow(); paying.people[0].payIn = { kind: 'total', total: 300, savingsIn: 0 };
    expect(make(paying).yours.accumulationTool).toBeUndefined();
  });

  it('stopping at 54 with savings, before the pension opens at 57: mapped as it is, and the plan says so', () => {
    const plan = make(seedEarly()).yours;
    const S = plan.stressTool.settings;
    expect(S.isaBalance).toBe(80000);
    expect(S.potAtRetirement).toEqual({ sipp: 280000, isa: 90000, source: 'override' });
    expect([S.retireAge, S.equityMin + S.bondMin + S.cashTarget]).toEqual([54, 200000]);
    expect([S.equityMin, S.bondMin, S.cashTarget]).toEqual([140000, 50000, 10000]);   // adventurous: 70 / 25 / 5
    expect(plan.planDetails.description).toMatch(/Your pension cannot be touched until 57; this planner does not hold it closed\.$/);
    // not said when the pension is open at the stop
    expect(make(seedA()).yours.planDetails.description).not.toMatch(/cannot be touched/);
  });

  it('nothing paid in: no saving section', () => {
    const none = seedA(); none.people[0].payIn = null;
    expect(make(none).yours.accumulationTool).toBeUndefined();
    const zero = seedA(); zero.people[0].payIn = { kind: 'split', total: 0, own: 0, employer: 0, savingsIn: 250 };
    expect(make(zero).yours.accumulationTool).toBeUndefined();
    expect(make(zero).yours.fromAnswer.people[0].payIn.savingsIn).toBe(250);   // kept in the record only (Q10)
  });

  it('a pay-in given as one total: all of it is the person\'s own, nothing from an employer', () => {
    const acc = make(seedBCouple()).yours.accumulationTool.settings;
    expect([acc.netMonthly, acc.employerMonthly, acc.potNow]).toEqual([760, 0, 300000]);
    expect(make(seedBCouple()).partner.accumulationTool).toBeUndefined();
  });

  it('£0 in a pension today with money going in: the middling pot at the stop stands in, so nothing is scaled (Q10)', () => {
    const seed = seedZeroPot();
    const plan = make(seed).yours;
    const S = plan.stressTool.settings;
    expect([S.equityMin, S.bondMin, S.cashTarget]).toEqual([30000, 24000, 6000]);
    expect(S.potAtRetirement).toEqual({ sipp: 60000, isa: null, source: 'override' });
    expect(S.isaBalance).toBe(0);
    expect(potScaleOf(S)).toEqual({ sipp: 1, isa: 1 });
    expect(plan.accumulationTool.settings.potNow).toBe(0);                   // the true £0
    expect(plan.fromAnswer.people[0].pension.today).toBe(0);
    expect(plan.planDetails.description.split('\n')[0]).toBe("From 'Am I saving enough?' on 1 Oct 2026: a pension of about £60,000 at 60 in a middling case, £45,000 in a bad case (the worst 1 in 10).");
  });

  it('part-time work after stopping (A): an income for those years only', () => {
    const S = make(seedPartTime()).yours.stressTool.settings;
    expect(S.extraIncomes).toEqual([{ label: 'Part-time work', startYear: 0, endYear: 2, annual: 15000, indexation: 'cpi' }]);
  });

  it('final-salary rises map onto the planner\'s three (prices → cpi, capped → lpi5, none → level); a later start counts plan years', () => {
    for (const [inc, want] of [['prices', 'cpi'], ['pricesCapped5', 'lpi5'], ['none', 'level']]) {
      const s = seedA(); s.people[0].finalSalary = { yearly: 6000, fromAge: 65, increases: inc };
      const S = make(s).yours.stressTool.settings;
      expect([S.dbIndexation, S.dbStartYear], inc).toEqual([want, 5]);
    }
    const S = make(seedCNow()).yours.stressTool.settings;
    expect([S.dbAmount, S.dbStartYear]).toEqual([0, 0]);
  });

  it('no State Pension: 0, never the planner\'s default £12,000', () => {
    const s = seedA(); s.people[0].statePension = null;
    const S = make(s).yours.stressTool.settings;
    expect([S.statePension, S.spStartDate, S.spWeeklyAmount]).toEqual([0, null, 0]);
    expect(createSimulationConfigFromSettings({}, S).statePension).toBe(0);
  });

  it('no tax-free quarter: taken as ordinary drawdown', () => {
    const s = seedA(); s.people[0].taxFreeQuarter = false;
    expect(make(s).yours.stressTool.settings.accessMethod).toBe('drawdown');
  });

  it('the risk level picks the split of the pots', () => {
    for (const [risk, want] of [['cautious', [75000, 112500, 62500]], ['balanced', [125000, 100000, 25000]], ['adventurous', [175000, 62500, 12500]]]) {
      const s = seedA(); s.risk = risk;
      const S = make(s).yours.stressTool.settings;
      expect([S.equityMin, S.bondMin, S.cashTarget], risk).toEqual(want);
    }
  });

  it('the day it is made does not move any figure: every date comes from seed.today (Q20)', () => {
    const a = seedToScenario(seedA(), new Date(2026, 9, 1, 23, 59));
    const b = seedToScenario(seedA(), new Date(2027, 3, 7, 0, 1));    // after midnight AND across 6 April
    const strip = (pl) => { const c = JSON.parse(JSON.stringify(pl)); delete c.fromAnswer.savedOn; delete c.strategy.lockedAt; return c; };
    expect(strip(b.yours)).toEqual(strip(a.yours));
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('a couple (B): two linked plans, as the Household tab holds them', () => {
  const seed = seedBCouple();
  const { yours, partner } = make(seed);
  const S = yours.stressTool.settings, P = partner.stressTool.settings;

  it('the partner\'s plan is named "{name} · partner"; the link is made at save time', () => {
    expect(partner.planDetails.name).toBe(seed.name.chosen + ' · partner');
    expect(yours.household).toBeUndefined();
    expect(partner.household).toBeUndefined();
  });
  it('each plan holds its own person: ages, pots, State Pension; both run the same years from the same tax year', () => {
    expect([S.currentAge, S.retireAge, P.currentAge, P.retireAge]).toEqual([55, 60, 53, 58]);
    expect([S.duration, P.duration]).toEqual([37, 37]);
    expect(S.firstTaxYear).toBe(P.firstTaxYear);
    expect(S.firstTaxYear).toBe(2031);
    expect([S.shapeAgeNow, P.shapeAgeNow]).toEqual([60, 58]);
    expect(S.potAtRetirement).toEqual({ sipp: 410000, isa: 17000, source: 'override' });
    expect(P.potAtRetirement).toEqual({ sipp: 120000, isa: 17000, source: 'override' });
    expect([S.equityMin, S.bondMin, S.cashTarget]).toEqual([90000, 135000, 75000]);   // cautious: 30 / 45 / 25
    expect([P.spStartDate, S.spStartDate]).toEqual(['2040-10-01', '2038-10-01']);
  });
  it('each target is that person\'s own rows, in phases from the plan\'s start age', () => {
    expect(S.incomeShape).toBe('phases');
    expect(S.incomeSteps).toEqual([{ fromAge: 60, amount: Math.round(grossUpAnnual(24000)) }, { fromAge: 67, amount: Math.round(grossUpAnnual(25200)) }]);
    expect(S.baseSalary).toBe(S.incomeSteps[0].amount);
    expect(P.incomeSteps).toEqual([{ fromAge: 58, amount: Math.round(grossUpAnnual(18000)) }, { fromAge: 65, amount: Math.round(grossUpAnnual(16800)) }]);
    const sched = scheduleFromSteps(S);
    expect([sched[0], sched[6], sched[7]]).toEqual([S.incomeSteps[0].amount, S.incomeSteps[0].amount, S.incomeSteps[1].amount]);
  });
  it('the budget sheet goes on YOUR plan, line for line, shared; the partner\'s has the ages and no lines', () => {
    const b = yours.budgetTool.settings;
    expect(b.lines).toEqual(BUDGET_SHEET.lines.map((l) => ({
      label: l.label, tier: l.essential ? 'essential' : 'discretionary', annual: l.annual, period: l.period, fromAge: null, toAge: null,
      hint: l.label === 'Council tax' ? '' : l.label === 'Groceries & household' ? 'Food and everyday household items' : l.label === 'Main holiday' ? 'Your big annual holiday' : l.label === 'Personal health' ? 'Prescriptions, dental, optical, health cover' : '',
      heading: l.heading, paidBy: 'shared'
    })));
    expect(b.oneOffs).toEqual([
      { label: 'New car', tier: 'essential', hint: '', amount: 18000, atAge: 60, everyYears: 8 },
      { label: 'Roof', tier: 'essential', hint: '', amount: 9000, atAge: 58, everyYears: null }
    ]);
    expect([b.sharedWithPartner, b.mySharePct, b.partnerAge, b.partnerRetirementAge, b.partnerRetired]).toEqual([true, 57, 53, 58, false]);
    expect([b.currentAge, b.retirementAge, b.endAge, b.plsaTier]).toEqual([55, 60, 97, 'moderate']);
    const pb = partner.budgetTool.settings;
    expect([pb.lines, pb.oneOffs]).toEqual([[], []]);
    expect([pb.sharedWithPartner, pb.mySharePct, pb.partnerAge, pb.partnerRetirementAge, pb.currentAge, pb.retirementAge, pb.endAge]).toEqual([true, 43, 55, 60, 53, 58, 95]);
  });
  it('the household total is the sheet\'s total; the plan\'s target is still the chosen figure, not the budget', () => {
    expect(annualNetAtAge(yours.budgetTool.settings, 60) / 12).toBeCloseTo(BUDGET_SHEET.totals.monthly, 9);
    expect(seed.spend.perMonth).not.toBe(BUDGET_SHEET.totals.monthly);
  });
});

describe('the budget sheet round trip (C.5)', () => {
  it('one person: the lines equal the sheet\'s, and the total a month at the stop equals totals.monthly', () => {
    const seed = seedA(); seed.budget = JSON.parse(JSON.stringify(BUDGET_SHEET));
    const b = make(seed).yours.budgetTool.settings;
    expect(b.lines.map((l) => [l.label, l.tier === 'essential', l.annual, l.period, l.heading])).toEqual(BUDGET_SHEET.lines.map((l) => [l.label, l.essential, l.annual, l.period, l.heading]));
    expect(b.lines.every((l) => l.paidBy === undefined)).toBe(true);
    expect(annualNetAtAge(b, 60) / 12).toBeCloseTo(BUDGET_SHEET.totals.monthly, 9);
    expect(annualNetAtAge(b, 60, 'essential') / 12).toBeCloseTo(BUDGET_SHEET.totals.essentialMonthly, 9);
    // today's page adds the yearly average of repeating one-offs to its own total (Q14): a guide either way
    expect(summariseBudget(b).allInComfortableMonthly).toBeCloseTo(BUDGET_SHEET.totals.monthly + 18000 / 8 / 12, 6);
  });
  it('lines of £0 are left out; a level picked in V7 becomes the tier', () => {
    const seed = seedA();
    seed.budget = { ...JSON.parse(JSON.stringify(BUDGET_SHEET)), lines: [...BUDGET_SHEET.lines, { heading: 'bills', label: 'Water', annual: 0, period: 'mo', essential: true }] };
    seed.spend = { perMonth: 2608, from: 'level', level: 'moderate', budgetSkipped: false };
    expect(make(seed).yours.budgetTool.settings.lines.map((l) => l.label)).not.toContain('Water');
    seed.spend.level = 'comfortable';
    expect(make(seed).yours.budgetTool.settings.plsaTier).toBe('comfortable');
  });
});

describe('a couple whose guaranteed income covers everything later (the partner\'s share falls to £0)', () => {
  it('the planner cannot hold a £0 step, so that plan alone carries the per-year schedule; the other plan does not', () => {
    const { yours, partner } = make(seedCoupleZeroLater());
    const P = partner.stressTool.settings;
    expect(P.incomeShape).toBe('phases');
    expect(P.incomeSteps).toEqual([{ fromAge: 58, amount: 10800 }, { fromAge: 60, amount: 0 }]);
    expect(P.targetSchedule.length).toBe(38);
    expect(scheduleFromSteps(P).slice(0, 3)).toEqual([10800, 10800, 0]);
    expect(Math.max(...scheduleFromSteps(P).slice(2))).toBe(0);
    expect(yours.stressTool.settings).not.toHaveProperty('targetSchedule');
    expect(P.statePension).toBe(0);
    expect(partner.planDetails.description).toBe("From 'What is that a month?' on 1 Oct 2026.\n"
      + 'The planner runs its own test, so its figures can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 (90%).\n'
      + 'This plan holds your partner\'s part of the £2,500 a month (£900 from 58, £0 from 60); your part is in ‘From 60 and 58 · £2,500 a month’. Savings are split evenly between you. The Household tab checks the two plans together.');
  });
  it('leading £0 rows: no target until the first row above £0', () => {
    const s = seedCoupleZeroLater();
    s.people[1].takeHome = [{ fromAge: 58, perMonth: 0 }, { fromAge: 62, perMonth: 300 }];
    const P = make(s).partner.stressTool.settings;
    expect(P.baseSalary).toBe(0);
    expect(P.incomeSteps).toEqual([{ fromAge: 62, amount: 3600 }]);
    expect(scheduleFromSteps(P).slice(0, 6)).toEqual([0, 0, 0, 0, 3600, 3600]);
    const all0 = seedCoupleZeroLater(); all0.people[1].takeHome = [{ fromAge: 58, perMonth: 0 }];
    expect(make(all0).partner.stressTool.settings).toMatchObject({ incomeShape: 'level', baseSalary: 0 });
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('creating the plans (C.2 step 7)', () => {
  function fakeStore({ failOn = null, failActive = false } = {}) {
    const docs = new Map([['old-1', { planDetails: { name: 'Stop at 60 · £1,800 a month' }, isActive: true }]]);
    const calls = [];
    let n = 0;
    return {
      docs, calls,
      create: async (plan) => { calls.push(['create', plan.planDetails.name, plan.isActive]); n++; if (failOn === n) throw new Error('offline'); const id = 'new-' + n; docs.set(id, JSON.parse(JSON.stringify(plan))); return id; },
      setActive: async (id) => { calls.push(['setActive', id]); if (failActive) throw new Error('slow'); for (const [k, d] of docs) d.isActive = k === id; },
      remove: async (id) => { calls.push(['remove', id]); docs.delete(id); }
    };
  }

  it('one person: one new plan, a free name, made active', async () => {
    const store = fakeStore();
    const made = await createPlansFromSeed({ seed: seedA(), name: 'Stop at 60 · £1,800 a month', today: SAVED_ON, takenNames: ['Stop at 60 · £1,800 a month'] }, store);
    expect(made).toEqual({ yours: { id: 'new-1', name: 'Stop at 60 · £1,800 a month (2)' }, partner: null, activeError: null });
    expect(store.calls).toEqual([['create', 'Stop at 60 · £1,800 a month (2)', false], ['setActive', 'new-1']]);
    expect(store.docs.get('new-1').isActive).toBe(true);
    expect(store.docs.get('old-1').isActive).toBe(false);
  });

  it('a couple: the partner\'s plan first (not active), then yours linked to it, then yours made active', async () => {
    const store = fakeStore();
    const seed = seedBCouple();
    const made = await createPlansFromSeed({ seed, name: 'Our try', today: SAVED_ON, takenNames: ['Our try · partner'] }, store);
    expect(made.partner).toEqual({ id: 'new-1', name: 'Our try · partner (2)' });
    expect(made.yours).toEqual({ id: 'new-2', name: 'Our try' });
    expect(store.calls).toEqual([['create', 'Our try · partner (2)', false], ['create', 'Our try', false], ['setActive', 'new-2']]);
    expect(store.docs.get('new-2').household).toEqual({ partnerScenarioId: 'new-1' });
    expect(store.docs.get('new-1').household).toBeUndefined();
    expect(store.docs.get('new-2').isActive).toBe(true);
    expect(store.docs.get('new-1').isActive).toBe(false);
  });

  it('your plan fails to save: the partner plan just made is deleted again, and the error comes back', async () => {
    const store = fakeStore({ failOn: 2 });
    await expect(createPlansFromSeed({ seed: seedBCouple(), name: 'Our try', today: SAVED_ON }, store)).rejects.toThrow('offline');
    expect(store.calls.map((c) => c[0])).toEqual(['create', 'create', 'remove']);
    expect([...store.docs.keys()]).toEqual(['old-1']);
    expect(store.docs.get('old-1').isActive).toBe(true);
  });

  it('a failure to make it active leaves the plans made and says so (saving again would only copy them)', async () => {
    const store = fakeStore({ failActive: true });
    const made = await createPlansFromSeed({ seed: seedA(), name: 'X', today: SAVED_ON }, store);
    expect(made.activeError.message).toBe('slow');
    expect(store.docs.has('new-1')).toBe(true);
    expect(seedSavedNote(made)).toMatch(/choose it from the plan menu/);
  });

  it('a refused name never reaches the store', async () => {
    const store = fakeStore();
    await expect(createPlansFromSeed({ seed: seedA(), name: '  ', today: SAVED_ON }, store)).rejects.toThrow('Give the plan a name.');
    expect(store.calls).toEqual([]);
  });
});

describe('the confirm step (C.2 steps 6–9)', () => {
  function app(answers, { failFirst = false, names = ['Old plan'] } = {}) {
    const storage = stored(seedA());
    const asked = [], warned = [];
    let creates = 0;
    return {
      storage, asked, warned,
      listNames: async () => names,
      ask: async (text, name) => { asked.push([text, name]); return answers.shift(); },
      warn: (m) => warned.push(m),
      now: () => SAVED_ON,
      create: async () => { creates++; if (failFirst && creates === 1) throw new Error('offline'); return 'id-' + creates; },
      setActive: async () => {},
      remove: async () => {}
    };
  }

  it('shows the one line and the chosen name; "Save" makes the plan and deletes the seed', async () => {
    const a = app(['Stop at 60 · £1,800 a month']);
    const r = await confirmAndCreate(seedA(), a);
    expect(r).toMatchObject({ outcome: 'made', hadPlans: true, made: { yours: { id: 'id-1', name: 'Stop at 60 · £1,800 a month' } } });
    expect(a.asked).toEqual([[seedConfirmText(seedA()), 'Stop at 60 · £1,800 a month']]);
    expect(a.storage.has(SEED_KEY)).toBe(false);
  });
  it('"Not now" deletes the seed and makes nothing', async () => {
    const a = app([null]);
    expect(await confirmAndCreate(seedA(), a)).toEqual({ outcome: 'notNow' });
    expect(a.storage.has(SEED_KEY)).toBe(false);
  });
  it('an empty name is refused in plain words and asked again, keeping what was typed', async () => {
    const a = app(['  ', 'x'.repeat(61), 'Mine']);
    const r = await confirmAndCreate(seedA(), a);
    expect(r.made.yours.name).toBe('Mine');
    expect(a.warned).toEqual(['Give the plan a name.', 'Keep the name to 60 characters or fewer.']);
    expect(a.asked.map((x) => x[1])).toEqual(['Stop at 60 · £1,800 a month', '  ', 'x'.repeat(61)]);
  });
  it('a failed save keeps the seed, says so, and asks again', async () => {
    const a = app(['Mine', null], { failFirst: true });
    expect(await confirmAndCreate(seedA(), a)).toEqual({ outcome: 'notNow' });
    expect(a.warned).toEqual(['Could not save the plan: offline. Your figures are still waiting; try again.']);
    expect(a.asked.length).toBe(2);
  });
  it('a failed save, then a good one: the seed goes only when the plan is made', async () => {
    const a = app(['Mine', 'Mine'], { failFirst: true });
    const storage = a.storage;
    const original = a.ask;
    a.ask = async (t, n) => { if (a.asked.length === 1) expect(storage.has(SEED_KEY)).toBe(true); return original(t, n); };
    const r = await confirmAndCreate(seedA(), a);
    expect(r.outcome).toBe('made');
    expect(storage.has(SEED_KEY)).toBe(false);
  });
  it('a brand-new account (no plans yet) is told apart, so the app sets the release marker quietly', async () => {
    const a = app(['Mine'], { names: [] });
    expect((await confirmAndCreate(seedA(), a)).hadPlans).toBe(false);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('the words', () => {
  it('one line on what is in the plan — with the money still going in, and for B the pay-in the answer worked out', () => {
    expect(seedSummary(seedA())).toBe('Stop at 60, £1,800 a month, paying in £800 a month, a pension of about £341,000 then');
    expect(seedSummary(seedCNow())).toBe('From 62, £1,400 a month, a pension of £250,000');
    expect(seedSummary(seedBCouple())).toBe('Stop at 60 and 58, £3,500 a month, paying in £950 a month as now, pensions of about £410,000 and £120,000 then');
    const savingsOnly = seedA(); savingsOnly.people[0].pension = { today: 0, atStop: { careful: 0, middling: 0 } }; savingsOnly.people[0].payIn = null;
    expect(seedSummary(savingsOnly)).toBe('Stop at 60, £1,800 a month');
    // B, paying in less than the answer says it takes (found 1 Oct 2026: the confirm step named only the name box's pay-in)
    const short = seedBCouple(); short.people[0].payIn = { kind: 'total', total: 1050, savingsIn: 0 }; short.answer.payInNeeded = 4657.4;
    expect(seedSummary(short)).toBe('Stop at 60 and 58, £3,500 a month, paying in £1,050 a month as now (the answer suggested about £4,660), pensions of about £410,000 and £120,000 then');
    const none = seedBCouple(); none.people[0].payIn = null; none.answer.payInNeeded = 600;
    expect(seedSummary(none)).toMatch(/^Stop at 60 and 58, £3,500 a month, paying in nothing now \(the answer suggested about £600 a month\), /);
  });
  it('the confirm line says why the planner\'s own test differs, and gives the quick answer\'s own figure', () => {
    expect(seedConfirmText(seedA())).toBe('A new plan from your quick answer: Stop at 60, £1,800 a month, paying in £800 a month, a pension of about £341,000 then. '
      + 'This plan starts from the middling pot at 60 and does not vary the years before you stop, so its tests can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 (93%). Name the plan:');
    expect(seedConfirmText(seedCNow())).toBe('A new plan from your quick answer: From 62, £1,400 a month, a pension of £250,000. '
      + 'The planner runs its own test, so its figures can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 (90%). Name the plan:');
    expect(seedConfirmText(seedA())).not.toMatch(/a little/);
  });
  it('the quick answer\'s own figure, counted as the language guide counts (3.4), with the share the planner states', () => {
    const at = (lasted, household = 'single') => answerLastedWords({ ...seedA(), household, answer: { ...seedA().answer, lasted } });
    expect(at(1)).toBe('the money lasted to 95 in every future it tried (100%)');
    expect(at(0.97)).toBe('the money lasted to 95 in more than 9 futures out of 10 (97%)');
    expect(at(0.43)).toBe('the money lasted to 95 in 4 futures out of 10 (43%)');
    expect(at(0.1)).toBe('the money lasted to 95 in only 1 future out of 10 (10%)');
    expect(at(0.02)).toBe('the money lasted to 95 in fewer than 1 future out of 10 (2%)');
    expect(at(0)).toBe('the money lasted to 95 in none of the futures it tried (0%)');
    expect(at(0.2, 'couple')).toBe('the money lasted until the younger of you was 95 in 2 futures out of 10 (20%)');
    expect(at(null)).toBe('');
  });
  it('the note the planner opens with: the names, why its figures differ (with the answer\'s own), and for a couple whose part is where', () => {
    expect(seedSavedNote({ yours: { name: 'A' }, partner: null, activeError: null })).toBe('Made from your quick answer: saved as ‘A’. The planner runs its own test, so its figures can differ from the quick answer.');
    expect(seedSavedNote({ yours: { name: 'A' }, partner: null, activeError: null }, seedA())).toBe('Made from your quick answer: saved as ‘A’. '
      + 'This plan starts from the middling pot at 60 and does not vary the years before you stop, so its tests can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 (93%).');
    expect(seedSavedNote({ yours: { name: 'Us' }, partner: { name: 'Us · partner (2)' }, activeError: null }, seedBCouple())).toBe('Made from your quick answer: saved as ‘Us’ and ‘Us · partner (2)’ for your partner. '
      + 'This plan starts from the middling pot at 60 and does not vary the years before you stop, so its tests can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 (91%). '
      + 'This plan holds your part of the £3,500 a month (£2,000 from 60, £2,100 from 67); your partner\'s part is in ‘Us · partner (2)’. Savings are split evenly between you. The Household tab checks the two plans together.');
  });
  it('a couple\'s two plans each say whose part they hold, naming the other plan by its FINAL name (after " (2)")', async () => {
    const docs = [];
    const store = { create: async (p) => { docs.push(p); return 'id-' + docs.length; }, setActive: async () => {}, remove: async () => {} };
    await createPlansFromSeed({ seed: seedBCouple(), name: 'Us', today: SAVED_ON, takenNames: ['Us', 'Us · partner'] }, store);
    const [partnerPlan, yourPlan] = docs;
    expect(yourPlan.planDetails.name).toBe('Us (2)');
    expect(partnerPlan.planDetails.name).toBe('Us · partner (2)');
    expect(yourPlan.planDetails.description.split('\n')[2]).toBe('This plan holds your part of the £3,500 a month (£2,000 from 60, £2,100 from 67); your partner\'s part is in ‘Us · partner (2)’. Savings are split evenly between you. The Household tab checks the two plans together.');
    expect(partnerPlan.planDetails.description.split('\n')[2]).toBe('This plan holds your partner\'s part of the £3,500 a month (£1,500 from 58, £1,400 from 65); your part is in ‘Us (2)’. Savings are split evenly between you. The Household tab checks the two plans together.');
  });
  it('the way back to the question carries no figure', () => {
    expect(questionHref('a')).toBe('v7/#/a/answer');
    expect(questionHref('b')).toBe('v7/#/b/answer');
    expect(questionHref('zzz')).toBe('v7/#/c/answer');
  });
  it('plain words only: no "scenario", "accumulation", "decumulation", "bridge", "FIRE", "guest", and never "My plan" put there by the app', () => {
    const texts = [
      ...Object.values(SEED_WORDS).map((w) => (typeof w === 'function' ? w('offline') : w)),
      ...Object.values(ALL_SEEDS).flatMap((f) => { const s = f(); const { yours, partner } = make(s); return [seedConfirmText(s), yours.planDetails.description, partner && partner.planDetails.description].filter(Boolean); }),
      seedSavedNote({ yours: { name: 'A' }, partner: { name: 'B' }, activeError: new Error('x') })
    ];
    for (const t of texts) {
      expect(t).not.toMatch(/scenario|accumulat|decumulat|\bbridg|\bFIRE\b|\bguest\b|My plan|undefined|NaN|\bnull\b/i);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('what became of a seed: the receipt V7 reads on coming Back (review, 1 Oct 2026)', () => {
  const receipts = (session) => JSON.parse(session.getItem(RECEIPT_KEY) || 'null');
  function app(answers, { storage = stored(seedA()), session = memoryStorage(), failFirst = false } = {}) {
    let creates = 0;
    const warned = [];
    return {
      storage, session, warned,
      listNames: async () => [], ask: async () => answers.shift(), warn: (m) => warned.push(m), now: () => SAVED_ON,
      create: async () => { creates++; if (failFirst && creates === 1) throw new Error('offline'); return 'id-' + creates; },
      setActive: async () => {}, remove: async () => {}
    };
  }

  it('both sides name the same keys', () => {
    expect(RECEIPT_KEY).toBe('pt_v7_plan_receipt');
    expect(V7_RECEIPT_KEY).toBe(RECEIPT_KEY);
    expect(V7_SEED_KEY).toBe(SEED_KEY);
  });
  it('made: the seed goes, and the receipt says "made" with the FINAL name (it may have been changed, or given " (2)")', async () => {
    const a = app(['Renamed']);
    const r = await confirmAndCreate(seedA(), a);
    expect(r.outcome).toBe('made');
    expect(a.storage.has(SEED_KEY)).toBe(false);
    expect(receipts(a.session)).toEqual({ [CREATED_AT]: { outcome: 'made', name: 'Renamed' } });
  });
  it('"Not now" (or the box closed): the seed goes, and the receipt says "declined" — never "made"', async () => {
    const a = app([null]);
    expect(await confirmAndCreate(seedA(), a)).toEqual({ outcome: 'notNow' });
    expect(a.storage.has(SEED_KEY)).toBe(false);
    expect(receipts(a.session)).toEqual({ [CREATED_AT]: { outcome: 'declined' } });
  });
  it('a failed save leaves no receipt (the seed is still waiting)', async () => {
    const a = app(['Mine', null], { failFirst: true });
    await confirmAndCreate(seedA(), a);
    expect(receipts(a.session)).toEqual({ [CREATED_AT]: { outcome: 'declined' } });   // only the "Not now" that followed
  });
  it('the seed replaced while the box was open (a later Save, another window): nothing made, said plainly, "refused"', async () => {
    const newer = { ...seedA(), createdAt: '2026-10-01T15:00:00.000Z' };
    const a = app(['Mine'], { storage: stored(newer) });
    expect(await confirmAndCreate(seedA(), a)).toEqual({ outcome: 'gone' });
    expect(a.warned).toEqual([SEED_WORDS.usedElsewhere]);
    expect(JSON.parse(a.storage.getItem(SEED_KEY)).createdAt).toBe(newer.createdAt);   // the newer seed is left alone
    expect(receipts(a.session)).toEqual({ [CREATED_AT]: { outcome: 'refused' } });
  });
  it('"Not now" on an older seed never deletes a newer one written meanwhile (compare-and-delete)', async () => {
    const newer = { ...seedA(), createdAt: '2026-10-01T15:00:00.000Z' };
    const a = app([null], { storage: stored(newer) });
    await confirmAndCreate(seedA(), a);
    expect(a.storage.has(SEED_KEY)).toBe(true);
    clearSeed(a.storage, CREATED_AT);
    expect(a.storage.has(SEED_KEY)).toBe(true);
    clearSeed(a.storage, newer.createdAt);
    expect(a.storage.has(SEED_KEY)).toBe(false);
    const s = stored(seedA()); clearSeed(s); expect(s.has(SEED_KEY)).toBe(false);   // no time given: whatever is there
  });
  it('seedStillWaiting: true only for the very seed read at start', () => {
    expect(seedStillWaiting(stored(seedA()), CREATED_AT)).toBe(true);
    expect(seedStillWaiting(stored({ ...seedA(), createdAt: 'x' }), CREATED_AT)).toBe(false);
    expect(seedStillWaiting(memoryStorage(), CREATED_AT)).toBe(false);
    expect(seedStillWaiting(memoryStorage({ [SEED_KEY]: '{oops' }), CREATED_AT)).toBe(false);
    expect(seedStillWaiting({ getItem: () => { throw new Error('denied'); } }, CREATED_AT)).toBe(false);
  });
  it('a seed the start-up read refuses (too old, another version) leaves a "refused" receipt in this tab', () => {
    const session = memoryStorage();
    takeSeedEntry(stored(seedA()), Date.parse(CREATED_AT) + SEED_MAX_AGE_MS + 1, NEW_PLAN_HASH, () => {}, session);
    expect(receipts(session)).toEqual({ [CREATED_AT]: { outcome: 'refused' } });
    const none = memoryStorage();
    takeSeedEntry(memoryStorage({ [SEED_KEY]: '{oops' }), NOW_MS, NEW_PLAN_HASH, () => {}, none);
    expect(none.getItem(RECEIPT_KEY)).toBe(null);                                     // no time to key it by
  });
  it('sign-out: the seed goes whatever it is, with a "cleared" receipt', () => {
    const s = stored(seedA()), session = memoryStorage();
    dropSeed(s, session);
    expect(s.has(SEED_KEY)).toBe(false);
    expect(receipts(session)).toEqual({ [CREATED_AT]: { outcome: 'cleared' } });
    expect(() => dropSeed({ getItem: () => { throw new Error('x'); }, removeItem: () => { throw new Error('x'); } }, null)).not.toThrow();
  });
  it('receipts carry no figure: the time, the outcome, the name only when made; the last eight only; never throw', () => {
    const session = memoryStorage();
    for (let i = 0; i < 12; i++) writeReceipt(session, '2026-10-01T10:00:0' + (i % 10) + '.' + String(i).padStart(3, '0') + 'Z', i % 2 ? 'made' : 'declined', 'Plan ' + i);
    const all = receipts(session);
    expect(Object.keys(all).length).toBe(8);
    for (const r of Object.values(all)) expect(Object.keys(r).every((k) => k === 'outcome' || k === 'name')).toBe(true);
    expect(Object.values(all).filter((r) => r.outcome === 'declined').every((r) => !('name' in r))).toBe(true);
    expect(writeReceipt(session, CREATED_AT, 'nonsense')).toBe(false);
    expect(writeReceipt(null, CREATED_AT, 'made')).toBe(false);
    expect(writeReceipt({ getItem: () => '[1]', setItem: () => { throw new Error('full'); } }, CREATED_AT, 'made')).toBe(false);
    const junk = memoryStorage({ [RECEIPT_KEY]: '{oops' });
    expect(writeReceipt(junk, CREATED_AT, 'declined')).toBe(true);
    expect(receipts(junk)).toEqual({ [CREATED_AT]: { outcome: 'declined' } });
  });
});

describe('the Budget page\'s words about the target (review, 1 Oct 2026: the budget is a guide)', () => {
  const money = (n) => '£' + Math.round(n).toLocaleString('en-GB');
  const f = { allInMonthly: 2837.33, allInAnnual: 34048, periodicMonthly: 187.5, headroomMonthly: 0, targetGrossAnnual: 39417, shared: false };
  it('a plan made in the planner: today\'s words, exactly as they were', () => {
    const w = budgetSummaryWords(f, null, money);
    expect(w.allInCaption).toBe('£34,048/yr — what your plan funds');
    expect(w.handoff).toBe('Your all-in take-home of <strong>£2,837/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.');
    expect(w.targetLine).toBe('Plan target: <strong>£2,837/mo take-home</strong> <span style="color:var(--text-muted);">(≈ £39,417/yr before tax)</span>');
    expect(budgetSummaryWords({ ...f, headroomMonthly: 100 }, null, money).targetLine).toBe('Plan target: <strong>£2,937/mo take-home</strong> <span style="color:var(--text-muted);">(≈ £39,417/yr before tax — budget + £100/mo headroom)</span>');
  });
  it('a plan made from a V7 answer: the budget is a guide beside the target chosen — never "what your plan funds" or "the target"', () => {
    const w = budgetSummaryWords(f, { monthly: 2650.2, grossAnnual: 36608, steps: false }, money);
    expect(w.allInCaption).toBe('£34,048/yr — a guide; this plan’s target is £2,650/mo');
    expect(w.handoff).toBe('Your budget adds up to <strong>£2,837/mo</strong>, including £188/mo set aside for one-offs. This plan’s target is <strong>£2,650/mo</strong> take-home, the figure you chose. The budget is a guide to it: it does not change the target.');
    expect(w.targetLine).toBe('Plan target: <strong>£2,650/mo take-home</strong> <span style="color:var(--text-muted);">(≈ £36,608/yr before tax) — the figure you chose; it is set in Stress tester → Settings → Your income shape.</span>');
    for (const t of Object.values(w)) expect(t).not.toMatch(/what your plan funds|becomes the|£2,837\/mo take-home/);
    const couple = budgetSummaryWords({ ...f, shared: true, periodicMonthly: 0 }, { monthly: 1896, grossAnnual: 25300, steps: true }, money);
    expect(couple.allInCaption).toBe('£34,048/yr — a guide; this plan’s target (your part) is £1,896/mo');
    expect(couple.handoff).toBe('Your share of the budget adds up to <strong>£2,837/mo</strong>. This plan’s target (your part) is <strong>£1,896/mo</strong> take-home to start with, the figure you chose. The budget is a guide to it: it does not change the target.');
    expect(couple.targetLine).toMatch(/^Plan target: <strong>£1,896\/mo take-home<\/strong> to start with /);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Seed version 2: each person at their own stop (research/v7/couples-different-years.md 6, 9.6 K1–K5; package P4).

/** A version 1 seed as version 2 writes the same answer: each person at the household's stop, no pay line. */
function toV2(seed) {
  const out = JSON.parse(JSON.stringify(seed));
  out.seedVersion = 2;
  const { budget, ...rest } = out;
  const v2 = {};
  for (const [k, v] of Object.entries(rest)) { v2[k] = v; if (k === 'years') v2.untilBothStop = null; }
  v2.budget = budget;
  for (const p of v2.people) { p.stop = { ...v2.stop }; p.years = v2.years; }
  return v2;
}

/**
 * The generic case of the design (made-up figures): you (58) stopped some time ago and draw now; your partner (55) still
 * works, stops next year at 56, and until then their pay covers half of what you spend. Seed version 2.
 */
function seedApart() {
  return {
    seedVersion: 2, createdAt: CREATED_AT, today: TODAY,
    v7: { appVersion: '6.20.0', engineVersion: '6.19.0', historyEnd: '2023-06' },
    source: 'a',
    name: { suggested: 'Partner stops at 56 · £3,200 a month', chosen: 'Us' },
    inputs: { household: 'couple', you: { age: 58, pot: 180000, taxFreeTaken: true }, stop: { kind: 'already' }, partner: { age: 55, pot: 420000, stop: { kind: 'age', age: 56 } }, savings: 40000, untilBothStop: 'half', charge: 0.5 },
    household: 'couple',
    stop: { kind: 'now', yearsFromNow: 0 },
    endAge: 95,
    years: 40,
    untilBothStop: { payCovers: 0.5 },
    risk: 'balanced',
    spend: { perMonth: 3200, from: 'typed', level: null, budgetSkipped: true },
    people: [
      {
        who: 'you', ageToday: 58, ageAtStop: 58, pensionOpensAge: 55,
        pension: { today: 180000, atStop: { careful: 180000, middling: 180000 } },
        savings: { today: 40000, atStop: { careful: 40000, middling: 40000 } },
        payIn: null, alreadyDrawing: false,
        statePension: { yearly: 12547.6, fromAge: 67, fromDate: '2035-10-01' },
        finalSalary: null, taxFreeQuarter: false, partTime: null,
        takeHome: [{ fromAge: 58, perMonth: 1600 }, { fromAge: 59, perMonth: 900 }, { fromAge: 67, perMonth: 1200 }, { fromAge: 70, perMonth: 1500 }],
        stop: { kind: 'now', yearsFromNow: 0 }, years: 40
      },
      {
        who: 'partner', ageToday: 55, ageAtStop: 56, pensionOpensAge: 55,
        pension: { today: 420000, atStop: { careful: 389555, middling: 441948 } },
        savings: { today: 0, atStop: { careful: 0, middling: 0 } },
        payIn: { kind: 'total', total: 600, own: null, employer: null, savingsIn: 0 }, alreadyDrawing: false,
        statePension: { yearly: 12547.6, fromAge: 67, fromDate: '2038-10-01' },
        finalSalary: null, taxFreeQuarter: true, partTime: null,
        takeHome: [{ fromAge: 56, perMonth: 2300 }, { fromAge: 64, perMonth: 2000 }, { fromAge: 67, perMonth: 1700 }],
        stop: { kind: 'later', yearsFromNow: 1 }, years: 39
      }
    ],
    answer: { monthly: { careful: 3350, middling: 3800, good: 4400 }, lasted: 0.91, runOutAge: 95, verdict: 'yes', potAtStop: null, number: null, payInNeeded: null },
    budget: null
  };
}
/** The same couple with both still working: you stop in four years at 62, your partner a year later at 60; All of it. */
function seedBothLater() {
  const s = seedApart();
  s.name = { suggested: 'Stop at 62 and 60 · £3,200 a month', chosen: 'Both' };
  s.stop = { kind: 'later', yearsFromNow: 4 };
  s.years = 36;
  s.untilBothStop = { payCovers: 1 };
  const [you, partner] = s.people;
  Object.assign(you, { ageAtStop: 62, pension: { today: 180000, atStop: { careful: 170000, middling: 205000 } }, savings: { today: 40000, atStop: { careful: 38000, middling: 44000 } },
    payIn: { kind: 'total', total: 300, own: null, employer: null, savingsIn: 0 }, taxFreeQuarter: true,
    takeHome: [{ fromAge: 62, perMonth: 0 }, { fromAge: 63, perMonth: 1400 }, { fromAge: 67, perMonth: 1500 }], stop: { kind: 'later', yearsFromNow: 4 }, years: 36 });
  Object.assign(partner, { ageAtStop: 60, takeHome: [{ fromAge: 60, perMonth: 1800 }, { fromAge: 64, perMonth: 1700 }], stop: { kind: 'later', yearsFromNow: 5 }, years: 35 });
  return s;
}

describe('version 1 is still read, and makes exactly the plans 6.19.0 made (K1; frozen tests/v7/keep/seed.v1/)', () => {
  const variants = Object.entries(ALL_SEEDS).flatMap(([name, f]) => {
    const withSheet = f(); withSheet.budget = JSON.parse(JSON.stringify(BUDGET_SHEET));
    return [[name, f()], [name + ' with a sheet', withSheet]];
  });
  it.each(variants)('%s: every plan byte for byte, the words word for word', (name, seed) => {
    expect(checkSeed(seed, NOW_MS)).toEqual(frozen.checkSeed(seed, NOW_MS));
    for (const opts of [{}, { name: 'Ours', partnerName: 'Ours · partner (2)' }]) {
      const now = seedToScenario(seed, SAVED_ON, opts), then = frozen.seedToScenario(seed, SAVED_ON, opts);
      expect(JSON.stringify(now)).toBe(JSON.stringify(then));
    }
    expect(seedSummary(seed)).toBe(frozen.seedSummary(seed));
    expect(seedConfirmText(seed)).toBe(frozen.seedConfirmText(seed));
    const made = { yours: { name: 'A' }, partner: seed.household === 'couple' ? { name: 'A · partner' } : null, activeError: null };
    expect(seedSavedNote(made, seed)).toBe(frozen.seedSavedNote(made, seed));
    expect(answerLastedWords(seed)).toBe(frozen.answerLastedWords(seed));
  });
  it('a misshapen version 1 seed is refused as before, naming the same field', () => {
    const cases = [
      (x) => { delete x.people[0].takeHome; }, (x) => { x.people[0].pension.atStop.middling = -1; }, (x) => { x.risk = 'wild'; },
      (x) => { x.people[0].ageAtStop = 61; x.stop.kind = 'now'; }, (x) => { x.years = 0; }, (x) => { x.household = 'couple'; }
    ];
    for (const change of cases) { const seed = seedA(); change(seed); expect(checkSeed(seed, NOW_MS)).toEqual(frozen.checkSeed(seed, NOW_MS)); }
  });
  it('the same seed written as version 2 (one stop for both) makes the same plans; only the record of the seed differs', () => {
    for (const [name, f] of Object.entries(ALL_SEEDS)) {
      const v1 = f(), v2 = toV2(v1);
      expect(checkSeed(v2, NOW_MS), name).toEqual({ ok: true });
      const a = seedToScenario(v1, SAVED_ON), b = seedToScenario(v2, SAVED_ON);
      for (const k of ['yours', 'partner']) {
        if (!a[k]) { expect(b[k]).toBeNull(); continue; }
        const { fromAnswer: fa, ...ra } = a[k];
        const { fromAnswer: fb, ...rb } = b[k];
        expect(JSON.stringify(rb), name + ' ' + k).toBe(JSON.stringify(ra));
        const { budget, people, ...rest } = v2;
        expect(fb).toEqual({ ...rest, people: [people[k === 'yours' ? 0 : 1]], who: k === 'yours' ? 'you' : 'partner', savedOn: '2026-10-02' });
      }
      expect(seedSummary(v2)).toBe(seedSummary(v1));
      expect(seedConfirmText(v2)).toBe(seedConfirmText(v1));
    }
  });
});

describe('version 2: checking a seed whose people stop on their own dates (K1, K4)', () => {
  it('the two hand-written couples are good seeds, and plain data', () => {
    expect(checkSeed(seedApart(), NOW_MS)).toEqual({ ok: true });
    expect(checkSeed(seedBothLater(), NOW_MS)).toEqual({ ok: true });
    expect(JSON.parse(JSON.stringify(seedApart()))).toEqual(seedApart());
  });
  it('"taking money now" is checked per person: a partner still working may be older at their stop than today (K4)', () => {
    const s = seedApart();
    expect(s.stop.kind).toBe('now');
    expect(s.people[1].ageAtStop).not.toBe(s.people[1].ageToday);
    expect(checkSeed(s, NOW_MS).ok).toBe(true);
    const bad = seedApart(); bad.people[0].ageAtStop = 59;
    expect(checkSeed(bad, NOW_MS)).toMatchObject({ ok: false, problem: 'shape', detail: expect.stringMatching(/^people\.0\.ageAtStop/) });
  });
  it('refuses a version 2 seed whose stops, years or pay line do not agree, naming the field', () => {
    const cases = [
      [(x) => { delete x.people[1].stop; }, /^people\.1\.stop$/],
      [(x) => { x.people[1].stop.kind = 'soon'; }, /^people\.1\.stop$/],
      [(x) => { x.people[1].stop.yearsFromNow = 2; }, /^people\.1\.ageAtStop/],
      [(x) => { x.people[1].stop = { kind: 'later', yearsFromNow: 0 }; x.people[1].ageAtStop = 55; }, /^people\.1\.stop$/],
      [(x) => { x.people[1].years = 40; }, /^people\.1\.years/],
      [(x) => { delete x.people[0].years; }, /^people\.0\.years$/],
      [(x) => { x.stop = { kind: 'later', yearsFromNow: 1 }; }, /^stop/],
      [(x) => { x.untilBothStop = null; }, /^untilBothStop$/],
      [(x) => { x.untilBothStop = { payCovers: 0.25 }; }, /^untilBothStop$/],
      [(x) => { x.people[1].stop = { kind: 'now', yearsFromNow: 0 }; x.people[1].ageAtStop = 55; x.people[1].years = 40; }, /^untilBothStop$/]   // the same year, with a pay line
    ];
    for (const [change, detail] of cases) {
      const seed = seedApart(); change(seed);
      const c = checkSeed(seed, NOW_MS);
      expect(c, JSON.stringify(seed.people[1].stop)).toMatchObject({ ok: false, problem: 'shape' });
      expect(c.detail).toMatch(detail);
    }
  });
});

describe('version 2: two plans, each starting at its own stop and ending in the same tax year (K2, K3, K5)', () => {
  const seed = seedApart();
  const { yours, partner } = make(seed);
  const S = yours.stressTool.settings, P = partner.stressTool.settings;

  it('you have stopped: taking money from this tax year; your partner\'s plan starts at their own stop, a year on (K2)', () => {
    expect([S.retired, S.retireAge, S.firstTaxYear, S.duration]).toEqual([true, null, 2026, 40]);
    expect([P.retired, P.retireAge, P.firstTaxYear, P.duration]).toEqual([false, 56, 2027, 39]);
    expect(deriveTiming(P, T).firstTaxYear).toBe(2027);
    expect(S.firstTaxYear + S.duration).toBe(P.firstTaxYear + P.duration);
    expect([yours.decisionTool.settings.duration, partner.decisionTool.settings.duration]).toEqual([40, 39]);
    expect([S.shapeAgeNow, P.shapeAgeNow]).toEqual([58, 56]);
  });
  it('the one still working gets the middling pots at their own stop and the saving section until then; whoever has stopped, today\'s and none', () => {
    expect(S.potAtRetirement).toBeNull();
    expect(yours.accumulationTool).toBeUndefined();
    expect(P.potAtRetirement).toEqual({ sipp: 441948, isa: null, source: 'override' });
    expect(partner.accumulationTool.settings).toMatchObject({ currentAge: 55, retirementAge: 56, potNow: 420000, netMonthly: 480 });
    expect([S.equityMin + S.bondMin + S.cashTarget, P.equityMin + P.bondMin + P.cashTarget]).toEqual([180000, 420000]);
  });
  it('the savings between you are in the plan of whoever stopped first; together they are split evenly (K5)', () => {
    expect([S.isaBalance, P.isaBalance]).toEqual([40000, 0]);
    const t = make(seedBCouple());
    expect([t.yours.stressTool.settings.isaBalance, t.partner.stressTool.settings.isaBalance]).toEqual([15000, 15000]);
  });
  it('each plan\'s target is its own person\'s rows: the first to stop pays their part of the years apart; the other\'s starts at their stop', () => {
    expect(S.incomeShape).toBe('phases');
    expect(S.incomeSteps.map((x) => x.fromAge)).toEqual([58, 59, 67, 70]);
    expect(Math.abs(grossToNet(targetAtAge(S, 58), 12570, 50270, 125140) / 12 - 1600)).toBeLessThanOrEqual(0.5);
    expect(P.incomeSteps.map((x) => x.fromAge)).toEqual([56, 64, 67]);
    expect(Math.abs(grossToNet(targetAtAge(P, 56), 12570, 50270, 125140) / 12 - 2300)).toBeLessThanOrEqual(0.5);
    // "All of it": no target for the first to stop until the second stop
    const both = make(seedBothLater()).yours.stressTool.settings;
    expect(both.baseSalary).toBe(0);
    expect(scheduleFromSteps(both).slice(0, 2)).toEqual([0, Math.round(grossUpAnnual(1400 * 12))]);
  });
  it('the tax-free part: taken → ordinary drawdown for that person only', () => {
    expect([S.accessMethod, P.accessMethod]).toEqual(['drawdown', 'ufpls']);
  });
  it('the budget flags are per person (K3)', () => {
    const b = yours.budgetTool.settings, pb = partner.budgetTool.settings;
    expect([b.retired, b.partnerRetired, b.partnerRetirementAge, b.retirementAge]).toEqual([true, false, 56, 58]);
    expect([pb.retired, pb.partnerRetired, pb.partnerRetirementAge, pb.retirementAge]).toEqual([false, true, 58, 56]);
  });
  it('both later on different dates: each from its own tax year, the same last year', () => {
    const { yours: y, partner: p } = make(seedBothLater());
    const a = y.stressTool.settings, c = p.stressTool.settings;
    expect([a.retireAge, a.firstTaxYear, a.duration, c.retireAge, c.firstTaxYear, c.duration]).toEqual([62, 2030, 36, 60, 2031, 35]);
    expect(a.firstTaxYear + a.duration).toBe(c.firstTaxYear + c.duration);
    expect([y.budgetTool.settings.partnerRetired, p.budgetTool.settings.partnerRetired]).toEqual([false, false]);
  });
  it('the "must hold" rules hold for both plans: no write on first open, the start pots, plain data, nothing locked', () => {
    for (const [plan, p] of [[yours, seed.people[0]], [partner, seed.people[1]]]) {
      const st = plan.stressTool.settings;
      expect(upgradeScenario(plan).write).toBe(false);
      expect(migrateScenario(plan).changed).toBe(false);
      expect(timingPinPatch(st, pinTiming(st, plan.budgetTool.settings, T))).toBeNull();
      const cfg = createSimulationConfigFromSettings({}, st);
      const later = p.stop.kind === 'later';
      expect(Math.abs(cfg.equityStart + cfg.bondStart + cfg.cashStart - (later ? p.pension.atStop.middling : p.pension.today))).toBeLessThanOrEqual(3);
      expect(cfg.years).toBe(p.years);
      expect(firestoreProblems(plan)).toEqual([]);
      expect(plan.decisionTool.settings.locked).toBeFalsy();
    }
  });
  it('the record of the seed: the seed less the budget, this person only — their own stop and years among it', () => {
    const { budget, people, ...rest } = seed;
    expect(partner.fromAnswer).toEqual({ ...rest, people: [people[1]], who: 'partner', savedOn: '2026-10-02' });
  });
});

describe('version 2: the words', () => {
  it('each plan says when it begins, who pays until then, and where the savings between you are', () => {
    const [d1, d2, d3] = make(seedApart(), { name: 'Us', partnerName: 'Us · partner' }).yours.planDetails.description.split('\n');
    expect(d1).toBe("From 'When can I afford to stop work?' on 1 Oct 2026.");
    expect(d2).toBe('The planner runs its own test, so its figures can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 (91%).');
    expect(d3).toBe('This plan holds your part of the £3,200 a month (£1,600 from 58, £900 from 59, £1,200 from 67, £1,500 from 70); your partner\'s part is in ‘Us · partner’. '
      + 'Until your partner stops at 56, this plan pays half of what you spend and their pay covers the rest. Their plan begins when they stop. '
      + 'Your savings between you are in this plan, because you stopped first. The Household tab checks the two plans together.');
    const [p1, p2, p3] = make(seedApart(), { name: 'Us', partnerName: 'Us · partner' }).partner.planDetails.description.split('\n');
    expect(p1).toBe("From 'When can I afford to stop work?' on 1 Oct 2026: a pension of about £442,000 at 56 in a middling case, £390,000 in a bad case (the worst 1 in 10).");
    expect(p2).toBe('This plan starts from the middling pot at 56 and does not vary the years before your partner stops, so its tests can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 (91%).');
    expect(p3).toBe('This plan holds your partner\'s part of the £3,200 a month (£2,300 from 56, £2,000 from 64, £1,700 from 67); your part is in ‘Us’. '
      + 'This plan begins when your partner stops at 56. Until then their pay covers half of what you spend and ‘Us’ pays the rest. '
      + 'Your savings between you are in ‘Us’, because you stopped first. The Household tab checks the two plans together.');
  });
  it('All of it and None of it have their own sentences; you as the one still working', () => {
    const all = make(seedBothLater(), { name: 'B', partnerName: 'B · partner' });
    expect(all.yours.planDetails.description.split('\n')[2]).toContain('Until your partner stops at 60, their pay covers all of what you spend and this plan\'s money is left alone. Their plan begins when they stop. Your savings between you are in this plan, because you stop first.');
    expect(all.partner.planDetails.description.split('\n')[2]).toContain('This plan begins when your partner stops at 60. Until then their pay covers all of what you spend.');
    const none = seedApart(); none.untilBothStop = { payCovers: 0 };
    const n = make(none, { name: 'N', partnerName: 'N · partner' });
    expect(n.yours.planDetails.description.split('\n')[2]).toContain('Until your partner stops at 56, this plan pays all of what you spend. Their plan begins when they stop.');
    expect(n.partner.planDetails.description.split('\n')[2]).toContain('This plan begins when your partner stops at 56. Until then ‘N’ pays all of what you spend.');
    // the other way round: your partner stopped first, you still work
    const swapped = seedApart();
    swapped.people = swapped.people.map((p) => ({ ...p, who: p.who === 'you' ? 'partner' : 'you' })).reverse();
    expect(checkSeed(swapped, NOW_MS)).toEqual({ ok: true });
    const w = make(swapped, { name: 'W', partnerName: 'W · partner' });
    expect(w.yours.planDetails.description.split('\n')[2]).toContain('This plan begins when you stop at 56. Until then your pay covers half of what you spend and ‘W · partner’ pays the rest. Your savings between you are in ‘W · partner’, because your partner stopped first.');
    expect(w.partner.planDetails.description.split('\n')[2]).toContain('Until you stop at 56, this plan pays half of what you spend and your pay covers the rest. Your plan begins when you stop.');
    expect(w.yours.planDetails.description.split('\n')[1]).toBe('This plan starts from the middling pot at 56 and does not vary the years before you stop, so its tests can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 (91%).');
  });
  it('the one line on the confirm step names each person\'s own stop, and "once you\'ve both stopped"', () => {
    expect(seedSummary(seedApart())).toBe('You from now and your partner from 56, £3,200 a month once you\'ve both stopped, paying in £600 a month, your pension £180,000 now and your partner\'s about £442,000 at 56');
    expect(seedSummary(seedBothLater())).toBe('You stop at 62 and your partner at 60, £3,200 a month once you\'ve both stopped, paying in £900 a month, pensions of about £205,000 at 62 and £442,000 at 60');
    expect(seedConfirmText(seedApart())).toMatch(/^A new plan from your quick answer: You from now and your partner from 56, .* The planner runs its own test, so its figures can differ from the quick answer, where the money lasted until the younger of you was 95 in 9 futures out of 10 \(91%\)\. Name the plan:$/);
    const note = seedSavedNote({ yours: { name: 'Us' }, partner: { name: 'Us · partner' }, activeError: null }, seedApart());
    expect(note).toContain('Until your partner stops at 56, this plan pays half of what you spend and their pay covers the rest.');
  });
  it('plain words only, and nothing broken, in every version 2 text', () => {
    const texts = [seedApart(), seedBothLater()].flatMap((s) => { const { yours, partner } = make(s); return [seedConfirmText(s), yours.planDetails.description, partner.planDetails.description]; });
    for (const t of texts) expect(t).not.toMatch(/scenario|accumulat|decumulat|\bbridg|\bFIRE\b|\bguest\b|My plan|undefined|NaN|\bnull\b|\bretire\b/i);
  });
});

/**
 * 7.4.2: the machinery for months "before the plan" is gone from the engines and the code.
 *
 * Since 7.4.0 a retired person's plan starts in the tax year they stopped work, or the one they pick it up from — never
 * later. What was built for the months before a later start (a gilt ladder's extra cash beside its cash years, the flag that
 * said a run's pots had spent it, a placing of its own, months stamped as before the start, the cash target for them, the
 * band's add-on, the setup wizard's suggestion for them) is removed. Covered here:
 *  - R1, R2, R3, three plans the old rules got wrong, now right: a retired draft in its year 0 with no stop month added the
 *    extra cash to its ladder; so did a saver's ladder; and a locked saver's cash target held it while still working;
 *  - an older ladder's extra cash is read by nothing: the ladder, the run and a new document are the same with or without it;
 *  - `pots.asOfPlanYear: 0` is written exactly when it was (the old flag's own test), on every committed plan at every clock;
 *  - a grep gate: nothing in the code writes the old fields or produces the old placing; the readers of old stored fields
 *    that stay are listed, file by file, with why.
 *
 * Every person and figure is fictional (Alex, Sam).
 */
import { describe, it, expect, vi, afterAll } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { buildPlanDocument, potsInYear0 } from '../src/services/PlanDocument.js';
import { targetHoldings } from '../src/services/TransitionPlanner.js';
import { deriveTiming } from '../src/services/PlanTiming.js';
import { deriveStage, STAGES } from '../src/services/LifeStage.js';
import { setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';

const ROOT = process.cwd();
const PLANS = join(ROOT, 'tests', 'fixtures', 'plans');
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const NOW = new Date('2026-10-02T11:00:00.000Z');   // 2026/27

afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

/** Run at a clock, with the corpus's frozen market data. */
function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  setEquityOverride(EQUITY);
  try { return fn(); } finally { vi.useRealTimers(); }
}

// Sam (fictional): 64, a full gilt ladder of £640,000 with two cash years, £34,000 a year, a State Pension from 2029.
const SAM = {
  configured: true, currentAge: 64, currentAgeAsOf: '2026-06-12', retired: true, firstTaxYear: 2026, shapeAgeNow: 64,
  spStartDate: '14 March 2029', spWeeklyAmount: 230.25, duration: 21, baseSalary: 34000, incomeShape: 'flat', incomeSteps: [],
  equityMin: 180000, bondMin: 400000, cashTarget: 60000, isaBalance: 35000, isaDrawdownStrategy: 'minimiseEarlyTax',
  strategyId: 'full-il-gilt', strategyParams: { sippTotal: 640000, isaTotal: 35000, cashYears: 2 }
};
const ladderOf = (settings, now = NOW) => at(now, () => {
  const cfg = simulationConfigFromSettings({}, settings, now);
  const p = planFromSettings(settings, cfg, { startAge: +settings.shapeAgeNow || 57, now });
  return { p, r: stressTestStrategy('full-il-gilt', { ...p, mcRuns: 60, stride: 12 }) };
});
const withExtra = (s, v = 20000) => ({ ...s, strategyParams: { ...s.strategyParams, bridgeCash: v } });
const cashYearsCost = (plan) => plan.cashYears.reduce((t, c) => t + c.cost, 0);

describe('R1, R2, R3: the plans the old rules got wrong', () => {
  it('R1 — a retired draft in this tax year with no stop month: its ladder holds the cash years only (it added the extra cash)', () => {
    expect(deriveTiming(SAM, NOW)).toMatchObject({ mode: 'retired', firstTaxYear: 2026, planYearNow: 0 });
    const plain = ladderOf(SAM).r, extra = ladderOf(withExtra(SAM)).r;
    expect(extra.affordable).toBe(true);
    expect(extra.plan.cash).toBe(plain.plan.cash);
    expect(extra.plan.cash).toBeCloseTo(cashYearsCost(extra.plan), 6);
    expect(extra.plan.spare).toBe(plain.plan.spare);   // the £20,000 the old rule took out of the spare is back in it
    expect(extra.signature).toEqual(plain.signature);
  });
  it('R2 — a saver\'s ladder: the cash years only (it added the extra cash, whatever the run\'s pots)', () => {
    const saver = { ...SAM, currentAge: 58, currentAgeAsOf: '2026-06-12', retired: false, retireAge: 63, firstTaxYear: null, potAtRetirement: null };
    expect(deriveTiming(saver, NOW).mode).toBe('future');
    const plain = ladderOf(saver).r, extra = ladderOf(withExtra(saver)).r;
    expect(extra.plan.cash).toBe(plain.plan.cash);
    expect(extra.plan.spare).toBe(plain.plan.spare);
  });
  it('R3 — a locked saver\'s plan document with extra cash: the cash to hold is the cash years\' money, never months while still working', () => {
    const doc = {
      timing: { mode: 'future', firstTaxYear: 2031, startMonth: '2031-09' }, assumptions: { bridgeCash: 20000 },
      timeline: [{ y: 0, taxYear: '2031/32', gross: 34000, sp: 0, other: 0 }],
      strategy: { contract: true, params: { bridgeCash: 20000 }, r: { plan: { firstTaxYear: 2031, cash: 88000, cashYears: [{ Y: 2031, cost: 34000 }, { Y: 2032, cost: 34000 }], orders: [] } } }
    };
    const t = targetHoldings(doc, { today: NOW });
    expect(t.cash.value).toBe(68000);
    expect(t.cash.breakdown.map((b) => b.amount)).toEqual([34000, 34000]);
    expect('runUp' in t.cash || 'bridgeCash' in t.cash).toBe(false);
    expect(t.note).not.toMatch(/month|extra cash/);
  });
});

describe('an older ladder\'s extra cash is read by nothing', () => {
  it('the run is never handed it, and a new document records neither it nor a count of months before the start', () => {
    const { p, r } = ladderOf(withExtra(SAM));
    expect(p.params.bridgeCash).toBeUndefined();
    expect('runUpSpent' in p).toBe(false);
    const doc = at(NOW, () => buildPlanDocument({ planName: 'Sam', settings: withExtra(SAM), p, r, now: NOW }));
    expect(doc.strategy.params.bridgeCash).toBe(20000);   // the plan's settings as they are: kept, as stored
    for (const k of ['bridgeCash', 'bridgeMonths']) expect(k in doc.assumptions).toBe(false);
    expect('bridgeMonths' in doc.decisionRun || 'bridgeMonths' in doc.timing || 'runUpSpent' in doc.strategy.p).toBe(false);
  });
  it('a saver\'s months to their stop are `monthsToStop`; a retiree has none, and no placing before the start exists', () => {
    const saver = deriveTiming({ ...SAM, retired: false, retireAge: 66, firstTaxYear: null }, NOW);
    expect(saver.monthsToStop).toBeGreaterThan(0);
    expect('bridgeMonths' in saver).toBe(false);
    const retired = deriveTiming({ ...SAM, firstTaxYear: 2027 }, NOW);   // stored the old way, a year later
    expect('monthsToStop' in retired || 'bridgeMonths' in retired).toBe(false);
    expect(STAGES.bridge).toBeUndefined();
    const locked = { stressTool: { settings: { ...SAM, firstTaxYear: 2027 } }, decisionTool: { settings: { locked: true } } };
    expect(deriveStage(locked, NOW)).toMatchObject({ key: 'running', beforeStart: false });
  });
});

/** The old flag's test (PlanFromToday.runUpCashSpent until 7.4.2), on the same settings and timing. */
const oldFlag = (s, t) => !!t && t.mode !== 'future' && (!!s.potsAsOf && typeof s.potsAsOf === 'object' ? true : s.potsAsOf === 'today' && t.planYearNow >= 0);

describe('pots.asOfPlanYear 0 is written exactly when it was', () => {
  const names = readdirSync(PLANS).filter((f) => /^\d\d-.*\.json$/.test(f)).sort();
  const CLOCKS = [new Date('2026-09-30T11:00:00.000Z'), new Date('2027-04-05T11:00:00.000Z'), new Date('2027-05-01T11:00:00.000Z'), new Date('2025-11-15T11:00:00.000Z')];
  it('on every committed plan at four clocks: "its pots are set and it is not a saver" is the old flag', () => {
    let marked = 0;
    for (const f of names) {
      const raw = JSON.parse(readFileSync(join(PLANS, f), 'utf8'));
      for (const now of CLOCKS) {
        const s = effectiveStressSettings(upgradeScenario(raw, { now }).scenario, { now });
        const t = deriveTiming(s, now);
        if (t.elapsedYears > 0) continue;   // a year lived: asOfPlanYear is that year, by another rule
        expect(potsInYear0(s, t), f + ' at ' + now.toISOString()).toBe(oldFlag(s, t));
        if (oldFlag(s, t)) marked++;
      }
    }
    expect(marked).toBeGreaterThan(0);   // the rule is exercised, not only its absence
  });
  it('the document writes it from the same test: a plan that says when work stopped, in its year 0', () => {
    const stopped = { ...SAM, stoppedWork: '2026-06', potsAsOf: 'today' };
    const { p, r } = ladderOf(stopped);
    expect(at(NOW, () => buildPlanDocument({ planName: 'Sam', settings: stopped, p, r, now: NOW })).pots.asOfPlanYear).toBe(0);
    const { potsAsOf, ...waiting } = stopped;
    const q = ladderOf(waiting);
    expect('asOfPlanYear' in at(NOW, () => buildPlanDocument({ planName: 'Sam', settings: waiting, p: q.p, r: q.r, now: NOW })).pots).toBe(false);
  });
});

// ---- The grep gate ---------------------------------------------------------------------------------------------------------

/** Every source file of both apps. */
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx|mjs)$/.test(f)) out.push(p.slice(ROOT.length + 1));
  }
  return out;
}
const TOKENS = { runUp: /\brunUp[A-Za-z]*/g, bridgeCash: /\bbridgeCash\b/g, bridgeMonths: /\bbridgeMonths\b/g, bridgeYear: /\bbridgeYear\b/g, "'bridge'": /'bridge'/g };
/**
 * What may still name them, and why: readers of fields an older plan, record or document may hold (never written again),
 * and the other things called "bridge" that were never the months before a plan. Exact counts: a new one fails here.
 */
const ALLOWED = {
  'src/services/StrategyState.js': { bridgeCash: 3 },   // kept as a key of the ladders' own (as stored), so a locked plan's settings never change on load
  'src/services/TransitionPlanner.js': { bridgeCash: 3 },   // an older document's plan.cash holds its extra cash: taken off when the cash years carry no costs
  'src/answers/plan/read.js': { bridgeCash: 2 },   // an older ladder's stored extra cash is not listed as a dial
  'src/ui/components/PlanDocumentView.js': { bridgeCash: 2, bridgeMonths: 1, "'bridge'": 1 },   // an older document's assumptions as committed; its journey's old placing read as "Retired"
  'src/v7/screens/plan/PlanScreen.jsx': { "'bridge'": 2 },   // an old journey entry's placing read as "Retired"
  'src/services/PlanMove.js': { bridgeYear: 7 },   // the move of an older plan's start: reads the old mark and drops it
  'src/ui/planStartUi.js': { bridgeYear: 1 },   // an older record's stamped words, never shown once its month is a plan month
  'src/models/Decision.js': { bridgeYear: 1 },   // the comment saying nothing writes it
  'index.html': { "'bridge'": 1 },   // an older try's ISA policy value, read as "drawn"
  'src/answers/plan/lasts.js': { "'bridge'": 1 },   // the comment on the ISA value it no longer writes
  'src/answers/plan/lastsRun.js': { "'bridge'": 1 },   // the same
  'src/v7/copy/banned.js': { "'bridge'": 1 }   // the ban's own id
};

describe('the grep gate: nothing writes the old fields or produces the old placing', () => {
  const files = ['index.html', ...walk(join(ROOT, 'src'))];
  const found = {};
  for (const f of files) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    for (const [name, re] of Object.entries(TOKENS)) {
      const n = (text.match(re) || []).length;
      if (n) (found[f] = found[f] || {})[name] = n;
    }
  }
  it('every file that names one is listed, with exactly that many', () => {
    expect(found).toEqual(ALLOWED);
  });
  it('no code produces the placing, stamps a record, or puts the extra cash, its months or its flag on anything it writes', () => {
    for (const f of files) {
      const text = readFileSync(join(ROOT, f), 'utf8');
      expect(text, f).not.toMatch(/key:\s*'bridge'|[^=!]=\s*'bridge'\s*[;:?]|bridgeYear:\s*true|bridgeMonths:\s*[^,}\s]|runUpSpent:\s*true|bridgeCash:\s*[^,}\s]/);
    }
  });
});

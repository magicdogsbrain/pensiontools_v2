/**
 * A gilt ladder's money left over, in shares (strategyParams.spareGrowth, 6.35.0). The full ladder and the ladder +
 * rotation buy every year's income; what is left after buying it is kept, holding its value — or, with the setting, put
 * in a world-equity fund on the test's own histories and futures, charged like the rotation's sleeve. On the full ladder
 * it is never drawn for income, so the income, the chance of lasting and year 0 are the same either way; only what is
 * left moves. On the ladder + rotation it also fills a year the rotated block cannot pay before that year counts as cut —
 * in shares from 6.36.0, kept from 6.37.0 (until then kept money was never drawn). Absent = kept.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { spareGrowthPath, rotationPathsCtx, runRotationPath } from '../src/strategies/GiltRotation.js';
import { bootstrapPaths } from '../src/strategies/ladderEngine.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';
import { allowedKeys, cleanParams } from '../src/services/StrategyState.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { namedStartRows } from '../src/services/NamedStarts.js';
import { historyTabHtml, scenariosTabHtml } from '../src/ui/oneAnswerView.js';
import { startRow } from '../src/answers/plan/lasts.js';
import { LASTS } from '../src/v7/copy/lasts.js';
import { oneAnswer } from '../src/services/OneAnswer.js';

const N = 30;
const P = { pot: 1500000, isa: 60000, isaHold: true, startAge: 60, durationYears: N, targetAnnual: 50000, targetSchedule: Array.from({ length: N + 1 }, () => 50000),
  spAnnual: 12000, spStartYear: 7, spFirstYearRatioTaxYear: 1, firstTaxYear: 2027, todayIso: '2026-10-20', chargesPct: 0.25, otherIncomeByYear: [], mcRuns: 60, stride: 12, pnvCfg: {} };
const run = (id, params) => stressTestStrategy(id, { ...P, params });

describe('spareGrowthPath: the money left over, at the start of each plan year', () => {
  it('flat prices: only the charge moves it; a rising market: spare × the rise, less the charge', () => {
    const flat = Array.from({ length: 12 * 12 }, () => 100);
    const c = monthlyChargeFactor(0.5);
    const f = spareGrowthPath(flat, 0, 10, 100000, c);
    expect(f[0]).toBe(100000);
    for (let y = 0; y <= 10; y++) expect(f[y]).toBeCloseTo(100000 * c ** (12 * y), 6);
    const up = Array.from({ length: 12 * 12 }, (_, i) => 100 * 1.01 ** i);
    const g = spareGrowthPath(up, 0, 10, 100000, 1);
    for (let y = 0; y <= 10; y++) expect(g[y]).toBeCloseTo(100000 * 1.01 ** (12 * y), 4);
  });
});

describe.each(['full-il-gilt', 'gilt-rotation'])('%s with the money left over in shares', (id) => {
  const kept = run(id, {}), grown = run(id, { spareGrowth: true });
  it('a plan without the setting (or with it off) reads exactly as before', () => {
    const off = run(id, { spareGrowth: false });
    expect(off.cones).toEqual(kept.cones);
    expect(off.terminal).toEqual(kept.terminal);
    expect(off.ruin).toEqual(kept.ruin);
    expect(kept.signature.spareGrowth || false).toBe(false);
  });
  it(id === 'full-il-gilt' ? 'the income, the chance of lasting and year 0 are the same; what is left now rides the market'
    : 'year 0 is the same; either way the money left over fills cut years (the label says which); what is left rides the market', () => {
    expect(grown.affordable).toBe(true);
    expect(grown.signature.spareGrowth).toBe(true);
    expect(grown.signature.spare).toBeGreaterThan(100000);
    if (id === 'full-il-gilt') {
      expect(grown.cones.income).toEqual(kept.cones.income);
      expect(grown.ruin).toEqual(kept.ruin);
      expect(grown.worst12).toEqual(kept.worst12);
    } else {
      // Kept money fills at its value; in shares it fills at what the market left it — so neither is always ahead (6.37.0).
      expect(grown.ruinLabel).toMatch(/once the money left over in shares is spent/);
      expect(kept.ruinLabel).toMatch(/once the money left over is spent/);
      expect(kept.ruinLabel).not.toMatch(/in shares/);
    }
    for (const k of ['p10', 'p50', 'p90']) expect(grown.cones.wealth[k][0]).toBeCloseTo(kept.cones.wealth.p50[0], 6);   // year 0: what was spent + the spare
    expect(grown.cones.wealth.p90[N]).toBeGreaterThan(grown.cones.wealth.p10[N]);
    expect(grown.terminal.p50).toBeGreaterThan(kept.terminal.p50);
    expect(grown.n.mc).toBe(P.mcRuns);
    expect(grown.wealthLabel).toMatch(/money left over in shares/);
  });
  if (id === 'full-il-gilt') it('each future is the kept ladder with the spare replaced by its own path in shares (future 0, to the penny)', () => {
    const sp = grown.signature.spare;
    const path = spareGrowthPath(bootstrapPaths(3, (N + 1) * 12 + 1, 60).rtr, 0, N, sp, monthlyChargeFactor(P.chargesPct));
    const keptW = kept.cones.wealth.p50;
    expect(grown.futuresMc.terminal[0]).toBeCloseTo(keptW[N] - sp + path[N], 6);
    expect(grown.survivedMc.every(Boolean)).toBe(true);
  });
});

describe('ladder + rotation: the money left over fills a year the rotated block cannot pay (shares 6.36.0, kept 6.37.0)', () => {
  // Flat for two years, then a 50% crash that never recovers: the trigger fires at month 24, the sleeve (the block sold at
  // its accreted value, then flat) falls short of the rotated years, and the spare in shares is worth exactly half of
  // itself. `none` is the same plan with nothing left over to draw — what kept money did until 6.37.0.
  const Q = { ...P, chargesPct: 0 };
  const plan = stressTestStrategy('gilt-rotation', { ...Q, params: {} }).plan;
  const crash = Array.from({ length: 12 * (N + 2) }, (_, m) => (m < 24 ? 100 : 50));
  const ctxOf = (params) => rotationPathsCtx(plan, { ...Q, params }, { cutAge: 75, trigger: 0.3 });
  const none = runRotationPath(crash, 0, { ...ctxOf({}), spare: 0 });
  const kept = runRotationPath(crash, 0, ctxOf({})), grown = runRotationPath(crash, 0, ctxOf({ spareGrowth: true }));
  const sum = (r) => r.income.slice(0, N).reduce((a, b) => a + b, 0);   // the plan's N years (point N repeats the last)
  it('the crash fires the trigger and, with nothing left over to draw, the plan is cut', () => {
    expect(none.triggeredYear).toBe(2);
    expect(none.failAge).not.toBeNull();
    expect(none.paidShort).toBeGreaterThan(0);
  });
  it('kept money pays the cut years pound for pound at its value', () => {
    expect(kept.triggeredYear).toBe(2);
    expect(kept.paidShort).toBeCloseTo(Math.max(0, none.paidShort - plan.spare), 4);
    expect(sum(kept) - sum(none)).toBeCloseTo(Math.min(plan.spare, none.paidShort), 4);
    kept.income.forEach((v, y) => expect(v, 'year ' + y).toBeGreaterThanOrEqual(none.income[y] - 1e-6));
    if (none.paidShort > plan.spare) expect(kept.failAge).toBeGreaterThan(none.failAge); else expect(kept.failAge).toBeNull();
  });
  it('the shares pay what the market left them, pound for pound; the floor years are unchanged', () => {
    const half = plan.spare / 2;
    expect(grown.triggeredYear).toBe(2);
    expect(grown.paidShort).toBeCloseTo(Math.max(0, none.paidShort - half), 4);
    grown.income.forEach((v, y) => expect(v, 'year ' + y).toBeGreaterThanOrEqual(none.income[y] - 1e-6));
    expect(sum(grown) - sum(none)).toBeCloseTo(Math.min(half, none.paidShort), 4);
    if (none.paidShort > half) expect(grown.failAge).toBeGreaterThan(none.failAge);
    else expect(grown.failAge).toBeNull();
  });
  it('nothing is drawn past the plan\'s last bought year: the cut years are the plan\'s own, and point N repeats the last year', () => {
    const rotatedYears = N - (75 - P.startAge) - 1;   // ages 76 … startAge + N − 1
    expect(none.owed).toBeCloseTo(rotatedYears * plan.years[N - 1].need, 4);
    expect(none.income[N]).toBeCloseTo(none.income[N - 1], 6);
    expect(none.failAge).toBeLessThan(P.startAge + N);
  });
  it('what is left falls by what the money left over paid out', () => {
    expect(kept.wealth[N]).toBeCloseTo(none.wealth[N] - Math.min(plan.spare, none.paidShort), 4);
    expect(grown.wealth[N]).toBeCloseTo(none.wealth[N] - plan.spare + Math.max(0, plan.spare / 2 - none.paidShort), 4);
  });
});

describe('ladder + rotation: only the years the sold block paid for are the sleeve\'s (6.36.0)', () => {
  // Cut at 73 with two cash years: a gilt paying ages 73 and 74 straddles the cut, so it is kept (splitLadderAtAge never
  // splits one gilt's job) and age 74 is still paid by contract. Until 6.36.0 the sleeve paid age 74 as well.
  const Q = { ...P, chargesPct: 0 };
  const plan = stressTestStrategy('gilt-rotation', { ...Q, params: { cashYears: 2 } }).plan;
  const ctx = rotationPathsCtx(plan, { ...Q, params: { cashYears: 2 } }, { cutAge: 73, trigger: 0.3 });
  const crash = Array.from({ length: 12 * (N + 2) }, (_, m) => (m < 24 ? 100 : 50));
  it('the case bites: a year above the cut age is paid by a kept gilt', () => {
    const above = plan.years.filter((yr) => yr.age > 73 && yr.from !== 'cash' && yr.from !== 'none');
    expect(above.some((yr) => !ctx.soldAges.has(yr.age))).toBe(true);
  });
  it('after a rotation the sleeve owes exactly the sold years\' income; the kept gilt\'s year is paid in full', () => {
    const r = runRotationPath(crash, 0, ctx);
    expect(r.triggeredYear).toBe(2);
    expect(r.owed).toBeCloseTo(ctx.split.soldIncomeTotal, 4);
    for (const yr of plan.years) if (yr.age > 73 && !ctx.soldAges.has(yr.age)) expect(r.income[yr.age - P.startAge]).toBeGreaterThanOrEqual(yr.need - 1e-6);
  });
});

describe('ladder + rotation: each future says the year it was first cut and what it left unpaid (the couples check reads both)', () => {
  // Kept, the £518,811 left over now covers every cut year of this plan (6.37.0), so the kept case is the same plan
  // bought with £1,000 to spare; in shares it is still cut about 1 future in 100.
  const total = Math.ceil(stressTestStrategy('gilt-rotation', { ...P, params: {} }).plan.total);
  for (const [label, Q, params] of [['little left over, kept', { ...P, pot: total + 1000 }, {}], ['money left over in shares', { ...P, mcRuns: 400 }, { spareGrowth: true }]]) it(label, () => {
    const r = stressTestStrategy('gilt-rotation', { ...Q, params });
    const cut = r.survivedMc.map((ok, i) => (ok ? null : i)).filter((i) => i != null);
    expect(cut.length).toBeGreaterThan(0);
    for (const i of cut) {
      expect(r.futuresMc.failYear[i]).not.toBeNull();
      expect(P.startAge + r.futuresMc.failYear[i]).toBeGreaterThan(75);
      expect(r.futuresMc.unpaid[i]).toBeGreaterThan(1);
    }
    r.survivedMc.forEach((ok, i) => { if (ok) { expect(r.futuresMc.failYear[i]).toBeNull(); expect(r.futuresMc.unpaid[i]).toBeNull(); } });
  });
  it('kept, the money left over covers this plan\'s cut years: none is cut', () => {
    const r = stressTestStrategy('gilt-rotation', { ...P, mcRuns: 400, params: {} });
    expect(r.signature.spare).toBeGreaterThan(500000);
    expect(r.ruin.mc).toBe(0);
    expect(r.ruin.hist).toBe(0);
  });
});

describe('History: a bought income with its money left over in shares', () => {
  it('says the start year changes only what that money is worth (both versions); without it, as before', () => {
    const rows = namedStartRows('full-il-gilt', { ...P, params: { spareGrowth: true } });
    expect(rows.every((x) => x.kind === 'contract' && x.spareGrowth)).toBe(true);
    const r = run('full-il-gilt', { spareGrowth: true });
    const t = historyTabHtml({ strategyId: 'full-il-gilt', name: 'Full gilt ladder', a: oneAnswer(r, P), rows, worst: [] });
    expect(t).toContain('the start year changes only what the money left over in shares is worth');
    expect(t).not.toContain('changes nothing but the pounds');
    expect(LASTS.history.rows[startRow(rows[0]).id]).toContain('money left over in shares');
    expect(t).toContain('a month apart');   // the ladder's histories start every month, not two apart
    expect(oneAnswer({ ...r, strategyId: 'pots-and-valves' }, { ...P, stride: 2 }).histStrideMonths).toBe(2);
    const sc = scenariosTabHtml({ strategyId: 'full-il-gilt', name: 'Full gilt ladder', a: oneAnswer(r, P), r, p: P, rows, scenarios: {}, startYears: {}, worst: [] });
    expect(sc).toContain('a crash does cut what you would have left, never the income');
    const plain = namedStartRows('full-il-gilt', { ...P, params: {} });
    expect(plain[0].spareGrowth).toBeUndefined();
    expect(startRow(plain[0]).id).toBe('hist.contract');
  });
});

describe('where the setting lives', () => {
  it('the plan the pages build from saved settings carries it to the test (and leaves it out when absent)', () => {
    const settings = { configured: true, retired: true, currentAge: 60, shapeAgeNow: 60, duration: 25, baseSalary: 45000, strategyId: 'full-il-gilt', strategyParams: { sippTotal: 1400000, isaTotal: 0, spareGrowth: true } };
    const cfg = createSimulationConfigFromSettings({}, settings);
    const now = new Date('2026-10-20T10:00:00Z');
    const p = planFromSettings(settings, cfg, { startAge: 60, now });
    expect(p.params.spareGrowth).toBe(true);
    const r = stressTestStrategy('full-il-gilt', { ...p, mcRuns: 40 });
    expect(r.affordable).toBe(true);
    expect(r.signature.spareGrowth).toBe(true);
    const off = planFromSettings({ ...settings, strategyParams: { sippTotal: 1400000, isaTotal: 0 } }, cfg, { startAge: 60, now });
    expect(off.params.spareGrowth).toBeUndefined();
  });
  it('both gilt ladders keep it; no other strategy does', () => {
    expect(allowedKeys('full-il-gilt')).toContain('spareGrowth');
    expect(allowedKeys('gilt-rotation')).toContain('spareGrowth');
    expect(allowedKeys('floor-to-age')).not.toContain('spareGrowth');
    expect(cleanParams('pots-and-valves', { spareGrowth: true }).spareGrowth).toBeUndefined();
  });
  it('the planner writes it only when chosen, and removes it otherwise (absent = kept)', () => {
    const src = readFileSync('index.html', 'utf8');
    expect(src).toContain('<select id="giltSpare"');
    expect(src).toContain("if (document.getElementById('giltSpare')?.value === 'growth') out.spareGrowth = true; else delete out.spareGrowth;");
    expect(src).toContain("if (sp) sp.value = p.spareGrowth ? 'growth' : 'held';");
  });
  it('a plan locked with it says so in its document; an older document reads as kept', () => {
    const settings = { strategyId: 'full-il-gilt', strategyParams: { sippTotal: 1500000, cashYears: 2, spareGrowth: true }, duration: N };
    const r = run('full-il-gilt', { spareGrowth: true });
    const d = buildPlanDocument({ settings, p: { ...P }, r, now: new Date('2026-10-20T10:00:00Z') });
    expect(d.assumptions.spareGrowth).toBe(true);
    expect(d.decisionRun.monthlyAsks).toContain('The money left over in shares (as equity)');
    const html = planDocumentHtml(d);
    expect(html).toContain('Money left over');
    expect(html).toContain('invested in shares (a growth part)');
    const old = buildPlanDocument({ settings: { ...settings, strategyParams: { sippTotal: 1500000, cashYears: 2 } }, p: { ...P }, r: kept0(), now: new Date('2026-10-20T10:00:00Z') });
    expect('spareGrowth' in old.assumptions).toBe(false);
    expect(planDocumentHtml(old)).not.toContain('Money left over');   // a document without the setting reads exactly as before
    expect(html).toContain('never drawn for income');
    expect('spareFillsCuts' in d.assumptions).toBe(false);
  });
  it('a ladder + rotation locked with it says the shares pay a rotated year first; one locked under 6.35.0 reads as it was locked', () => {
    const settings = { strategyId: 'gilt-rotation', strategyParams: { sippTotal: 1500000, cashYears: 2, spareGrowth: true }, duration: N };
    const r = run('gilt-rotation', { spareGrowth: true });
    const d = buildPlanDocument({ settings, p: { ...P }, r, now: new Date('2026-10-20T10:00:00Z') });
    expect(d.assumptions.spareFillsCuts).toBe(true);
    expect(planDocumentHtml(d)).toContain('it pays a rotated year the sleeve cannot, before that year counts as cut');
    const locked635 = { ...d, assumptions: { ...d.assumptions } };
    delete locked635.assumptions.spareFillsCuts;   // what a 6.35.0 document holds
    expect(planDocumentHtml(locked635)).toContain('never drawn for income');
  });
  it('a ladder + rotation locked with its money left over kept says it pays a rotated year (6.37.0); an earlier one has no row', () => {
    const settings = { strategyId: 'gilt-rotation', strategyParams: { sippTotal: 1500000, cashYears: 2 }, duration: N };
    const d = buildPlanDocument({ settings, p: { ...P }, r: run('gilt-rotation', {}), now: new Date('2026-10-20T10:00:00Z') });
    expect(d.assumptions.spareFillsCuts).toBe(true);
    expect(d.assumptions.spareGrowth).toBeUndefined();
    expect(planDocumentHtml(d)).toContain('kept, holding its value; it pays a rotated year the sleeve cannot, before that year counts as cut');
    const earlier = { ...d, assumptions: { ...d.assumptions } };
    delete earlier.assumptions.spareFillsCuts;   // what a document locked before 6.37.0 holds
    expect(planDocumentHtml(earlier)).not.toContain('Money left over');
    const full = buildPlanDocument({ settings: { ...settings, strategyId: 'full-il-gilt' }, p: { ...P }, r: run('full-il-gilt', {}), now: new Date('2026-10-20T10:00:00Z') });
    expect(full.assumptions.spareFillsCuts).toBeUndefined();   // the full ladder never draws it
  });
});
function kept0() { return run('full-il-gilt', {}); }

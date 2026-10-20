/**
 * A gilt ladder's money left over, in shares (strategyParams.spareGrowth, 6.35.0). The full ladder and the ladder +
 * rotation buy every year's income; what is left after buying it is kept, holding its value — or, with the setting, put
 * in a world-equity fund on the test's own histories and futures, charged like the rotation's sleeve. It is never drawn
 * for income, so the income, the chance of lasting and year 0 are the same either way; only what is left moves.
 * Absent = kept: a plan without the key reads exactly as before.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { spareGrowthPath } from '../src/strategies/GiltRotation.js';
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
  it('the income, the chance of lasting and year 0 are the same; what is left now rides the market', () => {
    expect(grown.affordable).toBe(true);
    expect(grown.signature.spareGrowth).toBe(true);
    expect(grown.signature.spare).toBeGreaterThan(100000);
    expect(grown.cones.income).toEqual(kept.cones.income);
    expect(grown.ruin).toEqual(kept.ruin);
    expect(grown.worst12).toEqual(kept.worst12);
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
  });
});
function kept0() { return run('full-il-gilt', {}); }

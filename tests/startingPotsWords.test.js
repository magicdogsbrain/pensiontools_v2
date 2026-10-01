/**
 * What the Stress tester says about the pots a run starts from (review of "save this as a plan", 1 Oct 2026):
 *  - retiring later with pots at retirement set, Monte Carlo / History / Scenarios start from the SCALED pots
 *    (createSimulationConfigFromSettings, potScaleOf) — the line said today's;
 *  - the Timing block's line: with pots at retirement in the boxes, those are what the strategies are priced on and the
 *    planner's own projection is for comparison — it said the projection was;
 *  - a plan made from a V7 answer: the quick answer's own figure beside the planner's, and why they can differ.
 * Already retired, or no pots at retirement: the words are today's, unchanged.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { startSummaryHtml, potsAtRetirementLine, startsScaled } from '../src/ui/startingPotsWords.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { seedToScenario } from '../src/services/PlanSeed.js';
import { seedA, seedCNow } from './integration/fixtures/planSeeds.js';

const plain = (html) => html.replace(/<[^>]+>/g, '');
const fmt = (n) => '£' + Math.round(n).toLocaleString('en-GB');

describe('the line above the runs', () => {
  it('a plan made from a V7 answer, stopping later: the pots at retirement the runs start from — the engine\'s own', () => {
    const plan = seedToScenario(seedA(), new Date(2026, 9, 1, 15)).yours;
    const S = plan.stressTool.settings;
    expect(startsScaled(S)).toBe(true);
    const cfg = createSimulationConfigFromSettings({}, S);
    const text = plain(startSummaryHtml(S, { fromAnswer: plan.fromAnswer }));
    expect(text).toContain(`Starting balances at retirement (age 60), as every run uses them: Equity ${fmt(cfg.equityStart)} · Bond ${fmt(cfg.bondStart)} · Cash ${fmt(cfg.cashStart)} (pension £341,000) · ISA ${fmt(cfg.isaBalance)}.`);
    expect(text).toContain('These are your Settings pots today (pension £250,000, ISA £20,000) scaled to the pots at retirement in the Timing block.');
    expect(text).toContain('This plan was made from a quick answer, where the money lasted to 95 in 9 futures out of 10 (93%). These runs start from the middling pot at retirement and do not vary the years before it, so they can differ.');
    expect(text).not.toMatch(/Fund Minimums/);
  });
  it('already retired (or no pots at retirement): today\'s words, unchanged', () => {
    const plan = seedToScenario(seedCNow(), new Date(2026, 9, 1, 15)).yours;
    const S = plan.stressTool.settings;
    expect(startsScaled(S)).toBe(false);
    // 6.19.0: a plan made from an answer carries the answer's fund and platform charge (0.5% here), and the line says so.
    expect(plain(startSummaryHtml({ ...S, spWeeklyAmount: 241.3, spStartDate: '2031-10-01' }))).toBe('Starting balances come from your Settings (Fund Minimums): Equity £125,000 · Bond £100,000 · Cash £25,000. Edit them in the Settings tab. Fund and platform charges of 0.5% a year come off every month (change it in Settings); not off gilts held directly, annuities, final-salary or State Pensions.');
    expect(plain(startSummaryHtml({ equityMin: 1, bondMin: 2, cashTarget: 3 }))).toBe('Starting balances come from your Settings (Fund Minimums): Equity £1 · Bond £2 · Cash £3. Edit them in the Settings tab.');
    expect(plain(startSummaryHtml({ ...S, spWeeklyAmount: 241.3, spStartDate: '2031-10-01' }, { fromAnswer: plan.fromAnswer }))).toContain('These runs are the planner\'s own test, so they can differ.');
  });
  it('the State Pension note is kept as it was', () => {
    expect(plain(startSummaryHtml({ equityMin: 1, bondMin: 2, cashTarget: 3, statePension: 12000, spStartDate: null, shapeAgeNow: 60 }))).toMatch(/State Pension not entered — assuming £12,000\/yr from age 67 \(plan year 7\)/);
  });
});

describe('the Timing block\'s line', () => {
  const p = { sipp: 473935, isa: 36702, low: 378650, high: 594021, hasContributions: true };
  it('pots at retirement in the boxes: THOSE price every strategy; the projection is for comparison', () => {
    const t = plain(potsAtRetirementLine(p, { sipp: 493164, isa: 37694 }));
    expect(t).toBe('Every strategy is priced on the pots at retirement in the boxes below: SIPP £493,164 · ISA £37,694 (today\'s money). For comparison, the planner\'s own projection, middle band with your Accumulation planner contributions: SIPP £473,935 (cautious £378,650, strong £594,021) · ISA £36,702. The pots below are what the strategy is tested on — record what you hold on the Transition tab.');
    expect(plain(potsAtRetirementLine(p, { sipp: 493164, isa: 0 }))).toMatch(/^Every strategy is priced on the pots at retirement in the boxes below: SIPP £493,164 \(today's money\)\./);
  });
  it('no boxes filled: today\'s words, unchanged', () => {
    expect(potsAtRetirementLine(p, {})).toBe('Pots at retirement in today\'s money, middle band with your Accumulation planner contributions: SIPP <strong>£473,935</strong> (cautious £378,650, strong £594,021) · ISA <strong>£36,702</strong>. Every strategy is priced on these; the pots below are what the strategy is tested on — record what you hold on the Transition tab.');
    expect(potsAtRetirementLine({ ...p, hasContributions: false })).toMatch(/middle band \(growth only — no contributions saved on the Accumulation tab\):/);
  });
});

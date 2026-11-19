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
import { unmarked } from '../src/reading/mark.js';   // the marks are markup only (lead4.md G1): the words are read without them

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
    // (step F1, lead4.md D4) the reading's pot at the stop, to £1,000 and marked, and its pension today — never a sum of the
    // pots to the pound beside it; nothing said until the reading is in
    const at = { middle: cfg.equityStart + cfg.bondStart + cfg.cashStart, low: null, high: null, isa: cfg.isaBalance, age: 60, source: 'worked', from: { pot: 250000, monthly: 900 } };
    const html = startSummaryHtml(S, { fromAnswer: plan.fromAnswer, atStop: at });
    const text = plain(html);
    expect(text).toContain(`Starting balances at retirement (age 60), as every run uses them: your Settings split of shares, bonds and cash, grown to the middling case (pension £341,000) · ISA £${(Math.round(cfg.isaBalance / 1000) * 1000).toLocaleString('en-GB')}.`);
    expect(text).toContain('Worked out from your pension today (£250,000) and £900 a month going in. Change what goes in on the Accumulation tab.');
    expect(html).toContain('data-fact="pot.atStop">£341,000<');
    expect(html).toContain('data-fact="pot.today">£250,000<');
    expect(text).not.toContain(fmt(cfg.equityStart));
    expect(plain(startSummaryHtml(S, { fromAnswer: plan.fromAnswer }))).toContain('as every run uses them: your pots when you stop, from the Timing block.');
    // (7.12.0) a plan still saving: "Will it last?" leads with the saving chance worked out now, so the kept answer's is not said
    expect(text).not.toContain('This plan was made from a quick answer');
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

describe('the Timing block\'s line (step F1: the reading\'s pot at the stop, never the boxes)', () => {
  const worked = { middle: 473935, low: 378650, high: 594021, isa: 36702, age: 62, source: 'worked', from: { pot: 250000, monthly: 900 } };
  it('worked out: the middle to £1,000 with its bad and good cases, from the pension today and what goes in', () => {
    expect(plain(potsAtRetirementLine(worked))).toBe('Pots when you stop, in today\'s money: pension £474,000 in a middling case (£379,000 at the low end, £594,000 at the high end) · ISAs and savings £37,000. Worked out from your pension today (£250,000) and £900 a month going in, to age 62, over the same futures as every test. Every strategy is priced on these; they follow what you pay in, on the Accumulation tab.');
  });
  it('locked: the pots it was locked with, with the day, and nothing worked out today beside them', () => {
    expect(plain(potsAtRetirementLine({ middle: 603941, isa: 54126, source: 'locked', lockedAt: '2026-10-01T09:00:00.000Z' }))).toBe('Your plan was locked with £604,000 in your pension and £54,000 in ISAs and savings when you stop work (the middling case then, on 1 October 2026). Every strategy is priced on these.');
    expect(potsAtRetirementLine(null)).toBe('');
  });
});

// Reported 18 Oct 2026: a gilt ladder + rotation plan was told "Starting balances come from your Settings (Fund
// Minimums): Equity · Bond · Cash" and "Your ISA grows as the ISA funds in your list of funds to test" — neither is
// what the ladder test does. The ladder is bought from one pension total (+ the ISA unless it is held back).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { ladderPotsOf } from '../src/ui/startingPotsWords.js';

describe('a gilt-ladder plan: the line says what the ladder is bought from', () => {
  const corpus = (f) => JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', f), 'utf8'));
  const NOW = new Date('2026-09-30T08:00:00Z');
  const cases = [];
  for (const f of ['20-locked-start-after-stop.json', '07-pre-6.13-flat-params.json']) {
    const S = corpus(f).stressTool.settings;
    cases.push([f + ' as saved', S]);
    cases.push([f + ' unpinned, ISA used', { ...S, strategyParams: { ...(S.strategyParams || {}), sippTotal: 0, isaTotal: 0 }, isaDrawdownStrategy: 'efficient' }]);
    cases.push([f + ' as full ladder', { ...S, strategyId: 'full-il-gilt' }]);
    cases.push([f + ' as rotation', { ...S, strategyId: 'gilt-rotation' }]);
  }
  for (const [name, S] of cases) {
    it(`${name}: the pension and ISA named are planFromSettings' own`, () => {
      const cfg = createSimulationConfigFromSettings({}, S);
      const p = planFromSettings(S, cfg, { now: NOW });
      const L = ladderPotsOf(S);
      expect(Math.round(L.pension)).toBe(Math.round(p.pot));
      expect(Math.round(L.isa)).toBe(Math.round(p.isa || 0));
      const text = plain(startSummaryHtml(S, { locked: true }));
      expect(text).not.toContain('Fund Minimums');
      expect(text).not.toContain('ISA funds in your list');
      expect(text).toContain(`buys the ladder from ${fmt(L.pension + (S.isaDrawdownStrategy === 'hold' ? 0 : L.isa))}`);
      expect(text).toContain('does not apply to the gilts');
      expect(text).toContain('not grown');
      // kept, it still pays a rotated year the sleeve cannot (6.37.0); the full ladder never draws it
      if (S.strategyId === 'gilt-rotation') expect(text).toContain('not grown; it pays a rotated year the sleeve cannot, before that year counts as cut.');
      else expect(text).not.toContain('rotated year');
      if (L.isa > 0 && S.isaDrawdownStrategy === 'hold') expect(text).toContain('held back and never buys rungs');
      if (!('chargesPct' in S)) expect(text).toContain('locked before charges were added');
    });
  }
  it('with the money left over in shares, the line says so (not "not grown"), and that the charges come off it; the rotation adds that it fills a cut year', () => {
    const S0 = { ...corpus('20-locked-start-after-stop.json').stressTool.settings, chargesPct: 0.25 };
    for (const id of ['full-il-gilt', 'gilt-rotation']) {
      const S = { ...S0, strategyId: id, strategyParams: { ...(S0.strategyParams || {}), spareGrowth: true } };
      const text = plain(startSummaryHtml(S, {}));
      expect(text).not.toContain('not grown');
      expect(text).toContain('invested in shares (your Money left over setting), so what you would have left rides the market');
      expect(text).toContain('the money left over in shares');
      if (id === 'gilt-rotation') expect(text).toContain('it pays a rotated year the sleeve cannot, before that year counts as cut');
      else expect(text).not.toContain('rotated year');
    }
  });
  it('a growth strategy keeps its own line', () => {
    const S = { ...corpus('20-locked-start-after-stop.json').stressTool.settings, strategyId: 'pots-and-valves' };
    expect(plain(startSummaryHtml(S, {}))).toContain('Starting balances come from your Settings (Fund Minimums)');
  });
});

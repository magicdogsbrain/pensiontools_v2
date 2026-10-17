/**
 * The plan document's words follow the way of drawing (v6 usability audit, problem 5 "wrong in the document", item 10 of
 * the Oct 2026 batch): a ladder plan's document must not describe Pots & Valves mechanics, and a Pots & Valves plan's
 * must not mention "the ladder's rungs". The document itself is not rewritten — only the words drawn from it.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { decisionRunWords, runUpWords, mixWords, runUpCashWords } from '../src/services/StrategyWords.js';
import { STRATEGY_IDS } from '../src/strategies/registry.js';
import { buildPlanDocument, whereAmI } from '../src/services/PlanDocument.js';
import { planDocumentHtml, whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';

const S = STRATEGY_IDS;
const ids = Object.values(S);

describe('the words by strategy', () => {
  it('every strategy has its own sentence for the monthly recommendation and the run-up', () => {
    for (const id of ids) { expect(decisionRunWords(id), id).toBeTruthy(); expect(runUpWords(id), id).toBeTruthy(); }
    expect(new Set(ids.map(decisionRunWords)).size).toBeGreaterThanOrEqual(8);
  });
  it('Pots & Valves speaks of pots, tracks and protection; a ladder speaks of rungs, never of pot floors', () => {
    expect(decisionRunWords(S.POTS_AND_VALVES)).toContain('glidepath tracks');
    expect(decisionRunWords(S.POTS_AND_VALVES)).toContain('protection in a downturn');
    for (const id of [S.FULL_IL_GILT, S.GILT_ROTATION, S.FLOOR_THE_SCHEDULE, S.FLOOR_TO_AGE, S.BRIDGE_AND_ENGINE, S.LADDER_AND_RATCHET, S.FLOOR_AND_FLEX]) {
      expect(decisionRunWords(id), id).not.toContain('glidepath');
      expect(decisionRunWords(id), id).toMatch(/[Pp]ot floors (and rebalancing )?do not apply/);
    }
    expect(runUpWords(S.POTS_AND_VALVES)).not.toContain('rung');
    expect(runUpWords(S.POTS_AND_VALVES)).toContain('rules for cutting income');
    expect(runUpWords(S.FULL_IL_GILT)).toContain('rungs begin at year 0');
    expect(runUpWords(S.BUCKETS_IN_ORDER)).toContain('buckets');
    expect(decisionRunWords('nonsense')).toBe(decisionRunWords(S.POTS_AND_VALVES));   // a document without an id reads as it always did
  });
  it('the mix sentence and the run-up cash bracket', () => {
    expect(mixWords(S.POTS_AND_VALVES)).toBe('Cash is held flat; shares and bonds glide inside the growth sleeve.');
    expect(mixWords(S.POTS_AND_VALVES, { allocMode: 'funds' })).toContain('The funds below set the starting split.');
    expect(mixWords(S.BUCKETS_IN_ORDER)).toContain('no rebalancing');
    expect(mixWords(S.LADDER_AND_RATCHET)).toContain('ratchet');
    expect(runUpCashWords({ cashYears: 3 })).toContain('the money-market fund the cash years also use');
    expect(runUpCashWords({ cashYears: null })).not.toContain('cash years');
    expect(runUpCashWords({})).toBe('Months before it are the run-up: paid from your SIPP cash; nothing is sold.');
  });
});

describe('the document and the strip, drawn for each strategy', () => {
  const NOW = new Date(2026, 8, 9);
  const base = {
    currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57, duration: 30,
    spStartDate: '17 April 2037', spWeeklyAmount: 230, baseSalary: 40000, incomeShape: 'level', incomeSteps: [{ fromAge: 57, amount: 40000 }],
    equityMin: 300000, bondMin: 500000, cashTarget: 100000, isaBalance: 60000, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates'
  };
  const docFor = (strategyId, params = {}) => {
    const settings = { ...base, strategyId, strategyParams: params };
    const p = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), { now: NOW });
    const r = { strategyId, name: strategyId, affordable: true, ruin: { hist: 1, mc: 2 }, guaranteedToAge: 'x', cones: { wealth: null, income: null } };
    return buildPlanDocument({ planName: 'P', settings, p, r, lockedAt: '2026-09-09T18:00:00.000Z', now: NOW });
  };
  it('a Pots & Valves plan: no rungs in the strip\'s run-up month, pots and protection in section 4', () => {
    const doc = docFor(S.POTS_AND_VALVES);
    const w = whereAmI(doc, { today: new Date(2026, 9, 17) });
    expect(w.bridge).toBe(true);
    expect(w.strategyId).toBe(S.POTS_AND_VALVES);
    const strip = whereAmIHtml(w);
    expect(strip).toContain('Run-up month');
    expect(strip).not.toContain('rung');
    expect(strip).toContain('rules for cutting income begin at year 0');
    const html = planDocumentHtml(doc);
    expect(html).toContain('keeps the pots on their glidepath tracks and applies protection in a downturn');
    expect(html).not.toContain('the money-market fund the cash years also use');
    expect(html).toContain('Cash is held flat; shares and bonds glide inside the growth sleeve.');
  });
  it('a full gilt ladder: rungs and cash years, never pot floors or glidepath tracks', () => {
    const doc = docFor(S.FULL_IL_GILT, { sippTotal: 900000, isaTotal: 60000, cashYears: 2, bridgeCash: 0 });
    const w = whereAmI(doc, { today: new Date(2026, 9, 17) });
    expect(whereAmIHtml(w)).toContain('cash years and rungs begin at year 0');   // (the apostrophe is escaped)
    const html = planDocumentHtml(doc);
    expect(html).not.toContain('glidepath tracks');
    expect(html).toContain('the money-market fund the cash years also use');
    expect(html).toContain('Nothing is sold; pot floors and rebalancing do not apply.');
  });
  it('Buckets in order and Ladder & Ratchet get their own words (neither is a contract strategy)', () => {
    const b = planDocumentHtml(docFor(S.BUCKETS_IN_ORDER));
    expect(b).toContain('takes the month from the buckets in order');
    expect(b).not.toContain('glidepath tracks');
    const l = planDocumentHtml(docFor(S.LADDER_AND_RATCHET, { sippTotal: 900000, isaTotal: 60000, ladderYears: 10 }));
    expect(l).toContain('the ratchet buys the next rung');
    expect(l).not.toContain('glidepath tracks');
  });
  it('an older document with no strategy id reads as Pots & Valves, as it always did', () => {
    const doc = docFor(S.POTS_AND_VALVES);
    const old = { ...doc, strategy: { ...doc.strategy, id: undefined } };
    expect(planDocumentHtml(old)).toContain('glidepath tracks');
    expect(whereAmIHtml(whereAmI(old, { today: new Date(2026, 9, 17) }))).not.toContain('rung');
  });
});

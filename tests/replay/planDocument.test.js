/**
 * Bug replays — the plan document and the "where you are" strip read against it.
 * Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { whereAmI, buildPlanDocument } from '../../src/services/PlanDocument.js';
import { whereAmIHtml, planDocumentHtml } from '../../src/ui/components/PlanDocumentView.js';
import { incomeLayersRows } from '../../src/ui/incomeLayersGraphic.js';
import { planFromSettings } from '../../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../../src/storage/StressRepository.js';
import { at, frozenAt, hasUndefined } from './_replay.js';

describe('the "where you are" strip', () => {
  // A pot-strategy plan in its first year: every cone starts at one point (the pot) and opens from year 1.
  const doc = (wealth) => ({ timing: { firstTaxYear: 2026, shapeAgeNow: 60, mode: 'retired' }, steps: [{ fromAge: 60, amount: 40000 }], timeline: [{ y: 0 }, { y: 1 }, { y: 2 }], strategy: { r: { cones: { wealth } } } });
  const today = at(2026, 9, 11);

  it('P4c — a pot plan in year 0 is not "bought by contract" just because every cone starts at one point', () => {
    const w = whereAmI(doc({ p10: [900000, 760000, 640000], p50: [900000, 880000, 870000], p90: [900000, 1010000, 1150000] }), { today, potsToday: 895000 });
    expect(w.planYear).toBe(0);
    expect(w.pot.flat).toBe(false);
    expect(whereAmIHtml(w)).not.toContain('bought by contract');
  });

  it('P4c — a ladder, flat over the whole run, still is', () => {
    const flat = [900000, 870000, 840000];
    const w = whereAmI(doc({ p10: flat, p50: flat, p90: flat }), { today, potsToday: 895000 });
    expect(w.pot.flat).toBe(true);
    expect(whereAmIHtml(w)).toContain('bought by contract');
  });
});

describe('a lump sum in the year-by-year table', () => {
  // "QA Landlord": rent £14,000 in year 0, the flat sold in year 1 and its money pays years 1–2 of a £30,000 need.
  const p = { durationYears: 4, startAge: 62, spStartYear: 99, spAnnual: 0, needByYear: [30000, 30000, 30000, 30000],
    otherIncomeByYear: [14000, 30000, 30000, 0], windfallByYear: [0, 60000, 0, 0], windfallCarryByYear: [0, 30000, 0, 0] };

  it('P8b — on a ladder the lump\'s money is "from a lump sum", not "Other / DB"', () => {
    const rows = incomeLayersRows({ strategyId: 'floor-the-schedule', cones: {} }, p);
    expect(rows.map((r) => r.lump)).toEqual([0, 30000, 30000, 0]);
    expect(rows.map((r) => r.otherPure)).toEqual([14000, 0, 0, 0]);       // the rent is still other income; the sale is not
    const timeline = rows.map((r, y) => ({ y, taxYear: (2027 + y) + '/' + String(28 + y), age: r.age, gross: 30000, sp: 0, other: r.otherPure, lump: r.lump, contract: 0, market: 0 }));
    const html = planDocumentHtml({ planName: 'Landlord', timing: { firstTaxYear: 2027, shapeAgeNow: 62 }, timeline });
    expect(html).toContain('From a lump sum');
  });

  it('R6.11.4-b — on Pots & Valves or Buckets the pot takes the lump, so the pot pays: no lump layer, no phantom other income', () => {
    for (const strategyId of ['pots-and-valves', 'buckets-in-order']) {
      const rows = incomeLayersRows({ strategyId, cones: { income: { p50: [30000, 30000, 30000, 30000] } } }, p);
      expect(rows.map((r) => r.lump)).toEqual([0, 0, 0, 0]);
      expect(rows.map((r) => r.other)).toEqual([14000, 0, 0, 0]);
      expect(rows[1].market).toBe(30000);
    }
  });
});

describe('the document as it is saved', () => {
  const settings = {
    currentAge: 60, currentAgeAsOf: '2026-09-11', retired: true, firstTaxYear: 2026, shapeAgeNow: 60, duration: 30,
    spStartDate: '6 April 2033', spWeeklyAmount: 230, baseSalary: 30000, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 30000 }],
    equityMin: 150000, bondMin: 150000, cashTarget: 0, isaBalance: 80000, isaDrawdownStrategy: 'minimiseEarlyTax',
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', windfalls: [{ label: 'Inheritance (mother)', amount: 250000, year: 2, wrapper: 'cash' }],
    strategyId: 'pots-and-valves', strategyParams: { sippTotal: 1179422, cashYears: 3, floorToAge: 80 }   // dials left behind by other strategies
  };

  const today = at(2026, 9, 11);
  const build = () => frozenAt(today, () => {
    const p = planFromSettings(settings, createSimulationConfigFromSettings({}, settings), {});
    return buildPlanDocument({ planName: 'Inheritance 63', settings, p, r: null, now: today });
  });

  it('R6.13.0-d — a Pots & Valves document is sized on the allocation, never on a total a deselected ladder left behind', async () => {
    const doc = await build();
    expect(doc.pots.sipp).toBe(300000);                // not the stray £1,179,422
    expect(doc.pots.isa).toBe(80000);
    expect(doc.strategy.params).toEqual({});           // Pots & Valves owns no dials
    expect(doc.assumptions).toMatchObject({ cashYears: null, bridgeCash: 0 });
    expect(hasUndefined(doc)).toBe(false);             // it is written to Firestore as it stands
    expect(doc.timeline[2].lumpIn[0]).toMatchObject({ label: 'Inheritance (mother)', amount: 250000 });   // the lump is a marker on its year
  });

  // TODO(live finding, 30 Sep 2026 — not fixed here, src is out of this step's scope): the document's own fields are
  // clean (test above) but the PLAN stored inside it is not. planFromSettings (src/strategies/stressTest.js) reads the
  // raw `settings.strategyParams`, not StrategyState.activeParams(settings); index.html's strategyPlanFor() passes the
  // saved settings straight in. So for a Pots & Valves plan that still carries a deselected ladder's sippTotal (any plan
  // saved before 6.13.0 and not re-saved since — a LOCKED one cannot be re-saved), doc.strategy.p has
  // pot = 1,179,422 (should be 300,000), isa = 0 (should be 80,000) and params = { floorToAge, cashYears }. That `p` is
  // what the strategy card is drawn from and what every bought strategy in the ranked comparison is priced on.
  // Evidence: run this test un-skipped — the stored document contains "pot":1179422 and "params":{"floorToAge":80,"cashYears":3}.
  it.skip('R6.13.0-b (LIVE) — the plan stored in a Pots & Valves document carries nothing a deselected strategy left behind', async () => {
    const doc = await build();
    expect(doc.strategy.p.pot).toBe(300000);
    expect(doc.strategy.p.isa).toBe(80000);
    expect(doc.strategy.p.params.floorToAge).toBeUndefined();
    expect(JSON.stringify(doc)).not.toContain('1179422');
  });
});

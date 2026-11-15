/**
 * 7.11.1 — a rung held below its target is never a sale, and a rung held above it is bought.
 *
 * The move reads a rung "more than the rung needs" only when the units it counts against the rung are more than the rung's
 * units. Before 7.11.1 that could happen while the person held less than the order sheet asks: a rung whose order carried no
 * units was a target of none (every unit held was "more"), and a rung matched by its year alone took every other gilt of that
 * year too (a linker outside the plan maturing the same year). And a rung held above its target was "not yet" bought on the
 * order sheet beside the move that listed its excess. Fictional lines on the corpus's locked ladder (03).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { targetHoldings, diffHoldings, driftOf } from '../../../src/services/TransitionPlanner.js';
import { orderSheetRows } from '../../../src/strategies/GiltLadderPlan.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { entryOf, noon } from './_plans.js';

const TODAY = '2026-11-15';
const RAW = JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', '03-gilt-ladder-locked.json'), 'utf8'));
const doc = RAW.planDocument;
const today = noon(TODAY);
const IL = (o) => ({ wrapper: 'SIPP', ticker: null, name: null, sedol: null, units: null, value: null, kind: 'gilt', ...o });

describe('a rung held below its target is never a sale', () => {
  it('a linker outside the plan maturing in a rung\'s year is never read as that rung', () => {
    // the 2035 rung (16,000), part bought and typed by its name only; the 2% index-linked stock of 2035 is not a rung
    const lines = [IL({ name: 'Index-linked Treasury 2035', units: 2000, value: 2300 }), IL({ name: '2% Index-linked Treasury Stock 2035', units: 20000, value: 60000 })];
    const d = diffHoldings(lines, targetHoldings(doc, { today }), { today });
    expect(d.sell.filter((s) => s.ticker === 'TR35')).toEqual([]);
    expect(d.buy.find((b) => b.ticker === 'TR35')).toMatchObject({ units: 16000 - 2000, heldUnits: 2000 });
    expect(d.sell.map((s) => s.label)).toContain('2% Index-linked Treasury Stock 2035');
    // a line whose name is the rung's own maturity date is still the rung
    const own = diffHoldings([IL({ name: 'Treasury 1.125% I/L 22/09/2035', units: 16000, value: 18000 })], targetHoldings(doc, { today }), { today });
    expect(own.hold.map((h) => h.ticker)).toContain('TR35');
  });

  it('a rung whose order carries no units is sized from what it pays, or read by its cost — never "more than the rung needs"', () => {
    const noNominal = JSON.parse(JSON.stringify(doc));
    noNominal.strategy.r.plan.orders.find((o) => o.tidm === 'T32').nominal = null;
    const held = [IL({ ticker: 'T32', name: '1¼% Index-linked Treasury Gilt 2032', units: 500, value: 1000 })];
    const d = diffHoldings(held, targetHoldings(noNominal, { today }), { today });
    expect(d.sell).toEqual([]);
    expect(d.buy.find((b) => b.ticker === 'T32')).toMatchObject({ units: 8900 - 500, heldUnits: 500 });
    noNominal.strategy.r.plan.orders.find((o) => o.tidm === 'T32').indexRatio = null;
    const e = diffHoldings(held, targetHoldings(noNominal, { today }), { today });
    expect(e.sell).toEqual([]);
    expect(e.buy.find((b) => b.ticker === 'T32')).toMatchObject({ units: null, heldUnits: 500 });
    expect(e.buy.find((b) => b.ticker === 'T32').amount).toBeGreaterThan(0);
    // and with nothing held it is to buy, never a sale of nothing
    const f = diffHoldings([], targetHoldings(noNominal, { today }), { today });
    expect(f.sell).toEqual([]);
    expect(f.buy.map((b) => b.ticker)).toContain('T32');
  });

  it('every rung held below its target, whatever its lines, is to buy; at it, held; above it, the excess', () => {
    const t = targetHoldings(doc, { today });
    for (const r of t.lines) for (const share of [0.01, 0.5, 0.97, 1, 1.5]) {
      const d = diffHoldings([IL({ ticker: r.ticker, name: r.label, units: Math.round(r.units * share), value: 1 })], t, { today });
      const where = d.hold.some((x) => x.key === r.key) ? 'hold' : d.buy.some((x) => x.key === r.key) ? 'buy' : d.sell.some((x) => x.key === r.key) ? 'sell' : 'none';
      expect(where, r.ticker + ' at ' + share).toBe(share < 0.98 ? 'buy' : share > 1.02 ? 'sell' : 'hold');
    }
  });
});

describe('a rung held above its target is bought', () => {
  it('the order sheet says bought (it said "not yet"), and the move and the home count it as held', () => {
    // the corpus ladder holds 25,000 of the 2027 linker, whose rung needs 15,500
    const plan = entryOf(RAW, TODAY).plan;
    const m = moveInputs(plan, { now: today });
    expect(m.diff.sell.find((s) => s.ticker === 'T27')).toMatchObject({ why: 'more than the rung needs', units: 9500, heldUnits: 25000 });
    expect(orderSheetRows(plan.planDocument, plan.holdings.lines, { today }).find((r) => r.tidm === 'T27').bought).toBe('bought');
    expect(m.diff.rungs.held).toBe(m.diff.hold.filter((x) => Array.isArray(x.taxYears)).length + 1);
    expect(driftOf(m.diff).rungs).toEqual(m.diff.rungs);
    expect(moveOf([{ plan }], plan.id, { today: TODAY }).rungs.bought).toBe(String(m.diff.rungs.held));
  });
});

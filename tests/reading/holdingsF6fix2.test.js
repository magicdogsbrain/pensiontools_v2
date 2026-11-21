/**
 * Step F6, fix round 2 (lead4.md D19): the two faults the second check found.
 *  1. On a gilt ladder the review's "Not held yet" years are the move page's: a gilt of the plan held in part is never listed as
 *     not held (one reader, src/reading/holdings.js ladderGapsOf), before or after "This is how I want to hold it".
 *  2. A gilt held by its code alone (no kind, no sub-class: the full view's editable row stores one, and older records have them)
 *     is bonds in the one held-mix reader, as What you hold and the ladder's count read it.
 * Fictional figures only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradedList } from '../../src/v7/effects/planSource.js';
import { planPage } from '../../src/answers/plan/read.js';
import { reviewOf } from '../../src/answers/plan/review.js';
import { moveOf, heldMixSettings } from '../../src/answers/plan/move.js';
import { moveReadingOf, ladderGapsOf, heldMixOf, heldMixPartsOf } from '../../src/reading/holdings.js';
import { countedAs } from '../../src/answers/plan/hold.js';
import { proportions, placedLines } from '../../src/services/Holdings.js';
import { normaliseHoldings, holdingsWith } from '../../src/services/HoldingsRecord.js';
import { isGiltLine } from '../../src/services/HoldingsPaste.js';
import { taxYearLabel } from '../../src/services/PlanTiming.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const entriesOf = (key) => upgradedList(FIXTURES.find((f) => f.key === key).plans(), NOW);
const subjectOf = (key) => FIXTURES.find((f) => f.key === key).subject;

describe('the review\'s ladder years are the move page\'s (fault 1)', () => {
  const key = 'retired-locked-ladder';
  const setUp = () => {
    const entries = entriesOf(key), id = subjectOf(key);
    const plan = entries.find((e) => e.plan.id === id).plan;
    // a second of the plan's gilts held in part (half its units): fictional, made for this test
    plan.holdings = { ...plan.holdings, lines: [...plan.holdings.lines, { wrapper: 'SIPP', ticker: 'T29', name: '0 1/8% Index-linked Treasury Gilt 2029', units: 16500, value: 21000, kind: 'gilt' }] };
    return { entries, id, plan };
  };
  for (const agreed of [null, { at: '2026-11-10T09:00:00.000Z' }]) {
    it(`a gilt held in part is never "not held yet" (${agreed ? 'after' : 'before'} the agreement)`, () => {
      const { entries, id, plan } = setUp();
      const pg = planPage(entries, id, null, { today: PARITY_DAY });
      const life = { ...(pg.life || {}), key: 'moving', agreed };
      const R = reviewOf(entries, id, { today: PARITY_DAY, page: { ...pg, life } });
      const { m } = moveReadingOf(plan, { now: NOW, life, fromSettings: true });
      const g = ladderGapsOf(m.target, m.diff);
      expect(g.parts.length).toBeGreaterThan(0);
      const partYears = g.parts.flatMap((b) => (b.taxYears || []).map((y) => taxYearLabel(+y)));
      expect(partYears.length).toBeGreaterThan(0);
      for (const y of partYears) expect(R.moving.ladder.years).not.toContain(y);
      expect(R.moving.ladder.years).toEqual(g.uncovered.map((y) => taxYearLabel(y)));
      // the part-held gilt is said as held in part, with its years
      expect(R.moving.ladder.parts).toEqual(g.parts.map((b) => (b.taxYears || []).map((y) => taxYearLabel(+y)).join(', ')));
      expect(R.moving.ladder.partAgreed).toBe(!!agreed);
    });
  }
  it('the move page reads the same years (one reader)', () => {
    const { entries, id, plan } = setUp();
    const pg = planPage(entries, id, null, { today: PARITY_DAY });
    const life = { ...(pg.life || {}), key: 'moving', agreed: null };
    const V = moveOf(entries, id, { today: PARITY_DAY, page: { ...pg, life } });
    const R = reviewOf(entries, id, { today: PARITY_DAY, page: { ...pg, life } });
    expect(Array.isArray(V.cost.uncovered)).toBe(true);
    expect(R.moving.ladder.years).toEqual(V.cost.uncovered);
    for (const f of ['src/answers/plan/move.js', 'src/answers/plan/review.js']) {
      const src = readFileSync(f, 'utf8');
      expect(src, f).toMatch(/ladderGapsOf\(/);
      expect(src, f).not.toMatch(/num\(b\.heldUnits\) > 0/);
    }
    void plan;
  });
});

describe('a gilt held by its code alone is bonds in the held mix (fault 2)', () => {
  const lines = [
    { wrapper: 'SIPP', name: '0 1/8% Index-linked Treasury Gilt 2029', ticker: 'T29', units: 30000, value: 50000 },
    { wrapper: 'SIPP', name: 'Global equity index fund', ticker: 'VWRL', value: 100000 }
  ];
  it('one rule says a line is a gilt: What you hold, the proportions and the held mix agree', () => {
    const rec = normaliseHoldings({ lines });
    expect(isGiltLine(rec.lines[0])).toBe(true);
    expect(isGiltLine(rec.lines[1])).toBe(false);
    // a line that says what it is stays that, whatever its code looks like
    expect(isGiltLine({ wrapper: 'SIPP', ticker: 'T29', kind: 'fund' })).toBe(false);
    expect(isGiltLine({ wrapper: 'SIPP', ticker: 'T29', kind: 'gilt', subClass: 'longGilts' })).toBe(true);
    expect(countedAs(rec.lines[0]).bucket).toBe('bonds');
    const p = proportions(rec);
    expect(p.untagged.map((u) => u.ticker)).not.toContain('T29');
    expect(Math.round(p.buckets.bonds * 300)).toBe(100);
    expect(heldMixOf({ holdings: rec })).toEqual({ shares: 67, bonds: 33, diversifiers: 0, cash: 0 });
    expect(heldMixPartsOf({ holdings: rec }, { pension: true }).parts.bonds).toBeCloseTo(1 / 3, 6);
    // each placed line's bucket is the bucket What you hold says it is counted as
    for (const l of placedLines(rec.lines)) expect(countedAs(l).bucket).toBe(countedAs(rec.lines.find((x) => x.ticker === l.ticker)).bucket);
  });
  it('a line the full view\'s editable row stores (a code typed, kind left empty) is a gilt in the mix', () => {
    const today = new Date(2026, 10, 16);
    let d = normaliseHoldings({ lines: [{ wrapper: 'SIPP', ticker: 'VWRL', name: 'fund', value: 100000 }, { wrapper: 'SIPP', ticker: 'ZZZ', name: 'x', value: 1000 }] });
    d = holdingsWith(d, { kind: 'edit', index: 1, field: 'ticker', value: 'T29' }, { today });
    d = holdingsWith(d, { kind: 'edit', index: 1, field: 'value', value: '50000' }, { today });
    expect(d.lines[1].kind).toBeFalsy();
    expect(heldMixOf({ holdings: d })).toEqual({ shares: 67, bonds: 33, diversifiers: 0, cash: 0 });
    // the held-mix test runs on that split, and its words say it
    const h = heldMixSettings({ holdings: d }, { today: '2026-11-16' });
    expect(h.pcts.bonds).toBe(33);
  });
  it('money in the bank with a code like a gilt\'s stays bank cash, outside the mix, in both readers', () => {
    const rec = normaliseHoldings({ lines: [{ wrapper: 'CASH', ticker: 'T29', name: 'Savings', value: 5000 }, { wrapper: 'SIPP', ticker: 'VWRL', value: 10000 }] });
    expect(countedAs(rec.lines[0]).kind).toBe('bankCash');
    expect(isGiltLine(rec.lines[0])).toBe(false);
    expect(heldMixOf({ holdings: rec })).toEqual({ shares: 100, bonds: 0, diversifiers: 0, cash: 0 });
  });
});

/**
 * Ruling Z3: a gilt of the plan is "held" when any of it is held. The count on Your plan's mix (both views) and on the home
 * says so: "2 of 23 of your plan's gilts are held: 1 in full, 1 below the plan's units. 21 are not held." (home: "2 of 23
 * gilts held"). Nothing is a sale; once what is held was accepted a gilt held in part is still held as chosen.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradedList } from '../../src/v7/effects/planSource.js';
import { giltsCountOf } from '../../src/reading/holdings.js';
import { heldLadder, heldLadderView, sayHeld } from '../../src/answers/plan/held.js';
import { HELD } from '../../src/v7/copy/held.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);

describe('the one count: a gilt held in part is held', () => {
  const T = { kind: 'ladder', lines: [{ key: 'gilt:A' }, { key: 'gilt:B' }, { key: 'gilt:C' }] };
  const D = { rungs: { held: 1, needed: 3 }, buy: [{ kind: 'gilt', key: 'gilt:B', heldUnits: 400, units: 600 }, { kind: 'gilt', key: 'gilt:C', heldUnits: 0, units: 900 }], hold: [] };
  it('2 of 3 held (1 in full, 1 in part), with or without the agreement', () => {
    expect(giltsCountOf(T, D)).toEqual({ held: 1, part: 1, total: 3, counted: 2 });
    expect(giltsCountOf(T, D, { agreed: true })).toEqual({ held: 1, part: 1, total: 3, counted: 2 });
  });
});

describe('Your plan\'s mix, living on a ladder: the count and its words', () => {
  const key = 'retired-locked-ladder';
  const f = FIXTURES.find((x) => x.key === key);
  const entries = upgradedList(f.plans(), NOW);
  const plan = entries.find((e) => e.plan.id === f.subject).plan;
  // a second of the plan's gilts held in part (fewer units than the plan's): fictional, made for this test
  plan.holdings = { ...plan.holdings, lines: [...plan.holdings.lines, { wrapper: 'SIPP', ticker: 'T29', name: '0 1/8% Index-linked Treasury Gilt 2029', units: 16500, value: 21000, kind: 'gilt' }] };
  const h = heldLadder(plan, { today: PARITY_DAY, life: { key: 'drawing' } });
  const v = heldLadderView(h);
  const said = v.figure.map((s) => sayHeld(s, HELD)).join(' ');
  it('says how many are held, how many in full and below the plan\'s units, and how many not held', () => {
    const g = h.gilts;
    const under = g.rows.filter((r) => r.state === 'under').length;
    const same = g.rows.filter((r) => r.state === 'same').length, over = g.rows.filter((r) => r.state === 'over').length;
    const full = same + over;
    const none = g.rows.filter((r) => r.state === 'none').length;
    expect(under).toBeGreaterThan(0);
    expect(g.held).toBe(full + under);
    // held in the plan's units ("in full"), above them, below them: each said when there is one
    const parts = [same + ' in full', over + ' above the plan’s units', under + ' below the plan’s units'].filter((x) => !/^0 /.test(x)).join(', ');
    expect(said).toBe(`${g.held} of ${g.total} of your plan’s gilts are held: ${parts}. ${none} ${none === 1 ? 'is' : 'are'} not held.`);
  });
  it('the one line at the top carries the same count', () => {
    expect(sayHeld(v.summary, HELD)).toContain(`${h.gilts.held} of ${h.gilts.total} of your plan’s gilts are held`);
  });
});

/**
 * Step F6, fix round 3 (lead4.md D19, D2): the three faults the third check found.
 *  1. The home's ladder line never says a gilt held in part is not held: it reads the one diff of the page (moveReadingOf) and
 *     the one reading of the ladder's gaps (ladderGapsOf), as the move page does.
 *  2. "Shares are {held}% of your pension; your plan moves to {plan}%": one held mix (heldMixOf with `pension`) and one plan's
 *     mix (planMixOf) on every page that says it — the home, the review, the move page held as it is, and the agreement's
 *     stored mix — through one reader (mixAgainstPlanOf); never each bucket of the diff rounded alone.
 *  3. A plan with no age given: its State Pension line on the plan page says the age the runs assume (the one State Pension
 *     reader), never a tax year built from a default age, never an empty age.
 * Fictional figures only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { FIXTURES } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { homeOf } from '../../src/answers/plan/home.js';
import { moveOf } from '../../src/answers/plan/move.js';
import { reviewOf } from '../../src/answers/plan/review.js';
import { howOf } from '../../src/answers/plan/agree.js';
import { planPage } from '../../src/answers/plan/read.js';
import { moveReadingOf, ladderGapsOf, heldMixOf, planMixOf, mixAgainstPlanOf } from '../../src/reading/holdings.js';
import { statePensionOf } from '../../src/reading/statePension.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const clone = (o) => JSON.parse(JSON.stringify(o));

describe('the home\'s ladder line reads the one gaps reading (fault 1)', () => {
  const day = '2027-05-10', now = noon(day);
  const base = () => {
    const p = JSON.parse(readFileSync('tests/fixtures/plans/13-stopped-drawing-since.json', 'utf8'));
    delete p.household; p.id = 'X';
    return upgradeScenario(p, { now }).scenario;
  };
  // the plan's gilt for next tax year, from the page's own diff
  const soonRung = (p) => {
    const m = moveReadingOf(p, { now, fromSettings: true }).m;
    const ty = +m.target.thisTaxYear;
    return m.target.lines.find((l) => (l.taxYears || []).some((y) => +y === ty || +y === ty + 1));
  };
  const withRung = (p, units) => {
    const r = soonRung(p);
    const q = clone(p);
    q.holdings.lines = q.holdings.lines.filter((l) => String(l.ticker).toUpperCase() !== String(r.ticker).toUpperCase());
    if (units > 0) q.holdings.lines.push({ wrapper: 'SIPP', ticker: r.ticker, name: r.label, kind: 'gilt', units, value: 10000 });
    return { q, r };
  };

  it('a gilt held in part is not "not yet held" on the home', () => {
    const p = base();
    const { q, r } = withRung(p, Math.round(r0(soonRung(p).units) / 2));
    const m = moveReadingOf(q, { now, fromSettings: true }).m;
    const gaps = ladderGapsOf(m.target, m.diff);
    expect(gaps.parts.map((b) => b.key)).toContain(r.key);
    const h = homeOf([{ plan: q }], 'X', { today: day });
    expect(h.drift && h.drift.kind === 'ladder' ? h.drift.year : null).toBe(null);
  });

  it('a gilt not held at all is still said', () => {
    const p = base();
    const { q } = withRung(p, 0);
    const h = homeOf([{ plan: q }], 'X', { today: day });
    expect(h.drift && h.drift.kind).toBe('ladder');
    expect(h.drift.year).toMatch(/^\d{4}\/\d{2}$/);
  });
});

function r0(v) { return Math.round(+v || 0); }

/** Every { bucket, held, plan } inside a page's reading. */
function bucketRows(o, out = []) {
  if (Array.isArray(o)) { for (const x of o) bucketRows(x, out); return out; }
  if (!o || typeof o !== 'object') return out;
  if (typeof o.bucket === 'string' && 'held' in o && 'plan' in o) out.push(o);
  for (const v of Object.values(o)) bucketRows(v, out);
  return out;
}

describe('one held mix and one plan\'s mix wherever a bucket is said (fault 2)', () => {
  const key = 'saver-locked-pots';
  const lines = [
    { wrapper: 'SIPP', ticker: 'HMWO', kind: 'fund', subClass: 'worldGrowth', value: 114360 },
    { wrapper: 'SIPP', ticker: 'VAGS', kind: 'fund', subClass: 'globalAggHedged', value: 14970 },
    { wrapper: 'SIPP', ticker: 'CSH2', kind: 'fund', subClass: 'moneyMarket', value: 6015 }];
  const planOn = (day, holdLines = lines) => {
    const f = FIXTURES.find((x) => x.key === key);
    const p = upgradeScenario(clone(f.plans()[0]), { now: noon(day) }).scenario;
    p.holdings = { lines: clone(holdLines), updatedAt: day };
    return p;
  };

  it('the reader: the held mix is heldMixOf with `pension`, the plan\'s is planMixOf, the drift their difference', () => {
    const day = '2036-06-01', now = noon(day), p = planOn(day);
    const m = moveReadingOf(p, { now, fromSettings: true }).m;
    const x = mixAgainstPlanOf(p, m, { now });
    const held = heldMixOf(p, { pension: true }), plan = planMixOf(p, { now });
    expect(held.shares).toBe(85);   // 84.49% rounded so the four add to 100
    for (const row of x.buckets) {
      expect(row.held).toBe(held[row.bucket]);
      expect(row.plan).toBe(plan[row.bucket] || 0);
      expect(x.drift[row.bucket]).toBe(row.held - row.plan);
    }
    expect(x.maxDrift).toBe(Math.max(...Object.values(x.drift).map(Math.abs)));
  });

  for (const day of ['2036-06-01', '2038-06-01']) {
    it(`the home, the review and the move page say the one mix (${day})`, () => {
      const now = noon(day), p = planOn(day);
      const held = heldMixOf(p, { pension: true }), plan = planMixOf(p, { now });
      const h = homeOf([{ plan: p }], p.id, { today: day });
      expect(h.drift && h.drift.kind).toBe('buckets');
      const rows = [h.drift, ...bucketRows(reviewOf([{ plan: p }], p.id, { today: day })), ...bucketRows(moveOf([{ plan: p }], p.id, { today: day }))];
      expect(rows.length).toBeGreaterThan(1);
      for (const row of rows) {
        expect(String(row.held)).toBe(String(held[row.bucket]));
        expect(String(row.plan)).toBe(String(plan[row.bucket] || 0));
      }
    });
  }

  it('the agreement stores the one held mix', () => {
    const day = '2036-06-01', p = planOn(day);
    expect(howOf(p, { today: day }).heldMix).toEqual(heldMixOf(p, { pension: true }));
  });

  it('a pension line nothing places is counted as the held mix counts it, and said so', () => {
    const day = '2038-06-01', now = noon(day);
    const p = planOn(day, [{ wrapper: 'SIPP', ticker: 'VAGS', kind: 'fund', subClass: 'globalAggHedged', value: 50000 }, { wrapper: 'SIPP', ticker: 'ZZQX', name: 'A fund we do not know', value: 50000 }]);
    const m = moveReadingOf(p, { now, fromSettings: true }).m;
    const x = mixAgainstPlanOf(p, m, { now });
    expect(x.buckets.find((b) => b.bucket === 'shares').held).toBe(50);
    expect(x.assumed).toEqual(['A fund we do not know']);
  });
});

describe('a State Pension start nobody gave (fault 3)', () => {
  const today = '2026-11-22', now = noon(today);
  const lineOf = (p) => {
    const s = JSON.stringify(planPage([{ plan: p }], p.id, null, { today }));
    const m = /"id":"(pots\.statePensionOld[A-Za-z]*)","slots":(\{[^}]*\})/.exec(s);
    return m ? { id: m[1], slots: JSON.parse(m[2]) } : null;
  };

  it('a partner\'s plan with nothing typed: the age the runs assume, no tax year', () => {
    const p = upgradeScenario({ id: 'P2', name: 'Sam', stressTool: { settings: { chargesPct: 0.5, isaGrowth: 'cash' } }, household: { partnerScenarioId: 'X' } }, { now }).scenario;
    const sp = statePensionOf(p, { now, today });
    const l = lineOf(p);
    expect(l.id).toBe('pots.statePensionOldAge');
    expect(l.slots).toEqual({ age: String(sp.startAge) });
  });

  it('a plan with an age: the age and the tax year are the one reader\'s', () => {
    const f = FIXTURES.find((x) => x.key === 'age-only');
    const p = upgradeScenario(clone(f.plans()[0]), { now }).scenario;
    const sp = statePensionOf(p, { now, today });
    const l = lineOf(p);
    expect(l.id).toBe('pots.statePensionOld');
    expect(l.slots.age).toBe(String(sp.startAge));
    expect(l.slots.year).toBe(sp.taxYear + '/' + String((sp.taxYear + 1) % 100).padStart(2, '0'));
  });
});

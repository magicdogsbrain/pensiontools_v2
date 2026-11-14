/**
 * 7.9.0 the guardrail reading in "Where you are" (research/v7/replan-nov-2026.md §5; the build spec's §4): what the plan takes
 * from the pots this year as a share of what they hold now, beside the share it took when the plan as locked began; a fifth
 * above or below that is the line, a tenth less or more what would bring it back. No engine, no write: services/PlanDocument.js
 * guardrailOf reads the document and whereAmI's output and leaves both as they are; both apps say the same words
 * (src/v7/copy/stressPanel.js STRESS.guardrail). Made-up documents and fictional plans only.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { whereAmI, guardrailOf } from '../../../src/services/PlanDocument.js';
import { whereAmIHtml } from '../../../src/ui/components/PlanDocumentView.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { STRESS as STRESS_ON } from '../../../src/answers/shared/rules.js';
import { STRESS } from '../../../src/v7/copy/stressPanel.js';
import { bannedHits } from '../render/checkScreen.js';
import { corpus, entryOf } from './_plans.js';

const at = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0, 0);
const series = (n, f) => Array.from({ length: n }, (_, y) => f(y));
const deepFreeze = (o) => { if (o && typeof o === 'object') { Object.freeze(o); Object.values(o).forEach(deepFreeze); } return o; };
/** A pot in plan-start prices → the pounds of a month two years into the plan, at the plan's own 4% a year. */
const inf2 = (v) => Math.round(v * 1.04 ** 2);
const fill = (t, s) => t.replace(/\{(\w+)\}/g, (m, k) => (s[k] != null ? s[k] : m));

/** A made-up locked document (only what the reading needs): plan year 0 = 2026/27, age 60, 10 years, £40,000 a year from the pots. */
function makeDoc({ id = 'pots-and-valves', timeline = null, asOfPlanYear = undefined, events = undefined, cutsOn = false, contract = false } = {}) {
  return {
    version: 2, lockedAt: '2026-04-01T10:00:00.000Z', createdAt: '2026-04-01T10:00:00.000Z',
    timing: { firstTaxYear: 2026, shapeAgeNow: 60, mode: 'retired', bridgeMonths: 0 },
    steps: [{ fromAge: 60, amount: 40000, taxYear: '2026/27' }],
    timeline: timeline || series(10, (y) => ({ y, age: 60 + y, gross: 40000, sp: 0, other: 0, lumpIn: [], lumpOut: [] })),
    pots: { sipp: 700000, isa: 0, gia: 0, allocation: { equityMin: 420000, bondMin: 210000, cashTarget: 70000 }, ...(asOfPlanYear != null ? { asOfPlanYear } : {}) },
    layers: { events: events || [] },
    strategy: { id, contract, r: { cones: { wealth: { p10: series(11, (y) => 700000 - 25000 * y), p50: series(11, (y) => 700000 - 10000 * y), p90: series(11, (y) => 700000 + 5000 * y) } }, signature: { protection: { enabled: cutsOn, cutPct: 20, limit: 3 } } } },
    assumptions: { duration: 10, firstTaxYear: 2026, cpiDecision: 0.04 },
    holdingsAtLock: { updatedAt: '2026-03-20', source: 'typed', lines: [] }
  };
}
/** "Where you are" in May 2028 (plan year 2) with the pension worth `real` in plan-start prices. */
const whereWith = (doc, real) => whereAmI(doc, { today: at(2028, 5, 10), history: [{ date: '2028-04', taxYear: '28/29', equity: inf2(real * 0.6), bond: inf2(real * 0.3), cash: inf2(real * 0.1), sipp: 3000, other: 0, state: 0 }] });

describe('the reading', () => {
  it('within: £40,000 from £700,000 — the same share as at the start; the line a fifth above', () => {
    const doc = makeDoc();
    const w = whereWith(doc, 700000);
    const g = guardrailOf(doc, w);
    expect(g).toMatchObject({ state: 'within', draw: 40000, startTaxYear: 2026, cutsOn: false });
    expect(g.rate).toBeCloseTo(40000 / w.pot.real, 12);
    expect(g.startRate).toBeCloseTo(40000 / 700000, 12);
    expect(g.upper).toBeCloseTo(1.2 * g.startRate, 12);
    expect(g.lower).toBeCloseTo(0.8 * g.startRate, 12);
    expect(fill(STRESS.guardrail.within, g.slots)).toBe('This year your plan takes £40,000 from your pots: 5.7% of what they hold now. In 2026 to 2027, when the plan as locked began, it took 5.7% of what they held. If it reaches 6.9% of what they hold (a fifth above that), taking a tenth less would bring it back under that line.');
  });
  it('above: more than a fifth above the start\'s share — a tenth less said with its share', () => {
    const doc = makeDoc();
    const g = guardrailOf(doc, whereWith(doc, 500000));
    expect(g.state).toBe('above');
    expect(fill(STRESS.guardrail.above, g.slots)).toBe('This year your plan takes £40,000 from your pots: 8.0% of what they hold now, more than a fifth above the 5.7% it took in 2026 to 2027, when the plan as locked began. Taking a tenth less, £36,000, would make it 7.2% of what they hold.');
  });
  it('below: more than a fifth below — a tenth more said with its share', () => {
    const doc = makeDoc();
    const g = guardrailOf(doc, whereWith(doc, 1000000));
    expect(g.state).toBe('below');
    expect(fill(STRESS.guardrail.below, g.slots)).toBe('This year your plan takes £40,000 from your pots: 4.0% of what they hold now, more than a fifth below the 5.7% it took in 2026 to 2027, when the plan as locked began. You could take a tenth more, £44,000, and it would be 4.4% of what they hold.');
  });
  it('every sentence of the reading passes the banned words, gives every % of a named thing and leaves no slot unfilled', () => {
    const doc = makeDoc();
    for (const real of [500000, 700000, 1000000]) {
      const g = guardrailOf(doc, whereWith(doc, real));
      const t = fill(STRESS.guardrail[g.state], g.slots) + ' ' + STRESS.guardrail.cuts;
      expect(bannedHits(t, ['all', 'result', 'record'])).toEqual([]);
      expect(t).not.toMatch(/\{\w+\}|NaN|undefined/);
      expect(t).not.toMatch(/\d+\.\d%(?! of what they h(old|eld)| it took)/);
    }
  });
  it('a document locked in its plan year 3 reads its start from row 3, and this year\'s from the plan year', () => {
    const tl = series(10, (y) => ({ y, age: 60 + y, gross: y < 3 ? 60000 : 42000, sp: 0, other: 0, lumpIn: [], lumpOut: [] }));
    const doc = makeDoc({ timeline: tl, asOfPlanYear: 3 });
    const w = whereAmI(doc, { today: at(2030, 5, 10), history: [{ date: '2030-04', taxYear: '30/31', equity: 600000, bond: 300000, cash: 100000, sipp: 3000, other: 0, state: 0 }] });
    const g = guardrailOf(doc, w);
    expect(w.planYear).toBe(4);
    expect(g.startRate).toBeCloseTo(42000 / 700000, 12);
    expect(g.draw).toBe(42000);
    expect(g.startTaxYear).toBe(2029);
    expect(g.slots.startYear).toBe('2029 to 2030');
  });
  it('a one-off spend in this year never moves the reading', () => {
    const plain = makeDoc();
    const tl = series(10, (y) => ({ y, age: 60 + y, gross: y === 2 ? 52000 : 40000, sp: 0, other: 0, lumpIn: [], lumpOut: y === 2 ? [{ label: 'New roof', amount: 12000 }] : [] }));
    const spend = makeDoc({ timeline: tl, events: [{ age: 62, amount: 12000, label: 'New roof', kind: 'out', years: 1 }] });
    const a = guardrailOf(plain, whereWith(plain, 700000)), b = guardrailOf(spend, whereWith(spend, 700000));
    expect(b.draw).toBe(a.draw);
    expect(b.state).toBe(a.state);
    // spread over two years, each year's gross carries the whole amount: still never moved
    const tl2 = series(10, (y) => ({ y, age: 60 + y, gross: y === 2 || y === 3 ? 52000 : 40000, sp: 0, other: 0, lumpIn: [], lumpOut: y === 2 || y === 3 ? [{ label: 'Care', amount: 6000 }] : [] }));
    const two = makeDoc({ timeline: tl2, events: [{ age: 62, amount: 12000, label: 'Care', kind: 'out', years: 2 }] });
    expect(guardrailOf(two, whereWith(two, 700000)).draw).toBe(a.draw);
  });
  it('the State Pension and the other income that come in anyway are not drawn from the pots', () => {
    const tl = series(10, (y) => ({ y, age: 60 + y, gross: 40000, sp: y >= 2 ? 11000 : 0, other: y >= 2 ? 4000 : 0, lumpIn: [], lumpOut: [] }));
    const doc = makeDoc({ timeline: tl });
    expect(guardrailOf(doc, whereWith(doc, 700000)).draw).toBe(25000);
  });
  it('with cuts on: the plan\'s own rule is said to be above', () => {
    const doc = makeDoc({ cutsOn: true });
    const w = whereWith(doc, 700000);
    const g = guardrailOf(doc, w);
    expect(g.cutsOn).toBe(true);
    expect(whereAmIHtml(w, g)).toContain(STRESS.guardrail.cuts);
  });
});

describe('when it is not shown', () => {
  it('before drawing starts, on a contract or bought way, with a pot not complete, when the ISA is left out, with nothing drawn', () => {
    const doc = makeDoc();
    expect(guardrailOf(doc, whereAmI(doc, { today: at(2026, 2, 10), history: [] }))).toBe(null);   // before 2026/27
    for (const id of ['full-il-gilt', 'ladder-and-ratchet', 'gilt-rotation', 'floor-and-flex']) {
      const d = makeDoc({ id, contract: id === 'full-il-gilt' });
      expect(guardrailOf(d, whereWith(d, 700000)), id).toBe(null);
    }
    const w = whereWith(doc, 700000);
    expect(guardrailOf(doc, { ...w, pot: { ...w.pot, missing: ['isa'] } })).toBe(null);
    expect(guardrailOf(doc, { ...w, pot: { ...w.pot, real: null } })).toBe(null);
    expect(guardrailOf(doc, { ...w, pot: { ...w.pot, isaLeftOut: true } })).toBe(null);
    const none = makeDoc({ timeline: series(10, (y) => ({ y, age: 60 + y, gross: 12000, sp: 12000, other: 0, lumpIn: [], lumpOut: [] })) });
    expect(guardrailOf(none, whereWith(none, 700000))).toBe(null);
    expect(guardrailOf(null, w)).toBe(null);
    expect(guardrailOf(doc, null)).toBe(null);
  });
  it('whereAmI is left as it was: its output and the document are never changed', () => {
    const doc = deepFreeze(makeDoc());
    const w = whereWith(doc, 700000);
    const before = JSON.stringify(w);
    deepFreeze(w);
    guardrailOf(doc, w);
    expect(JSON.stringify(w)).toBe(before);
    expect(Object.keys(w)).not.toContain('guardrail');
  });
});

describe('both apps say it', () => {
  it('classic: one more line in "Where you are", only when the page passes the reading', () => {
    const doc = makeDoc();
    const w = whereWith(doc, 500000);
    const g = guardrailOf(doc, w);
    expect(whereAmIHtml(w)).not.toContain('planDocGuardrail');
    const html = whereAmIHtml(w, g);
    expect(html).toContain('data-guardrail="above"');
    expect(html.replace(/<[^>]+>/g, '')).toContain(fill(STRESS.guardrail.above, g.slots));
    // the page's whole "Where you are" is today's with the line added
    expect(html.replace(/<p class="hint" id="planDocGuardrail"[^>]*>.*?<\/p>/, '')).toBe(whereAmIHtml(w));
  });
  it('V7: the "Where you are" step carries it once drawing has started; the switch off hides it in both apps', () => {
    const C = corpus();
    const e = entryOf(JSON.parse(JSON.stringify(C['04-buckets-running'])), '2026-10-02');
    const step = () => planPage([e], e.plan.id, 'where', { today: '2026-10-02' }).steps.find((s) => s.id === 'where');
    const st = step();
    expect(st.guardrail).toMatchObject({ state: expect.stringMatching(/^(within|above|below)$/), cuts: true });
    expect(fill(STRESS.guardrail[st.guardrail.state], st.guardrail.slots)).not.toMatch(/\{\w+\}/);
    STRESS_ON.guardrail = false;
    try {
      expect(step().guardrail).toBeUndefined();
      const doc = makeDoc();
      const w = whereWith(doc, 500000);
      expect(whereAmIHtml(w, guardrailOf(doc, w))).toBe(whereAmIHtml(w));
    } finally { STRESS_ON.guardrail = true; }
  });
});

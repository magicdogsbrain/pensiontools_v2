/**
 * draft/carry (step 4 brief 4.11, conflict 45; screens-A-B.md 5): one question's figures carried into another's draft.
 *
 * It copies exactly the declared map (state/carry.js) and nothing else, as text; marks what it carried touched; sets
 * carriedFrom; never touches the source draft or any answer; reads a figure from the source's answer at the moment of
 * carrying; and opens the place CARRY_OPENS names. The reducer never runs an answer.
 *
 * One test everywhere (step 4 brief section 10): a hand-over carries the INPUTS — each pot as it is today, what goes in
 * each month, the savings, the age — never a pot the answer worked out (A → C and B → C once carried a projected pot).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { CARRY, CARRY_OPENS, CARRY_YOU_STOPPED, CARRY_YOU_STOPPED_OPENS, CARRY_C_YOU_STOPPED, CARRY_C_YOU_STOPPED_OPENS, cAnswerYouStopped, carryFor, carryKey } from '../../../src/v7/state/carry.js';
import { SCHEMAS, parsedDraft } from '../../../src/v7/state/select.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { format } from '../../../src/v7/router/routes.js';
import { loadDraft, saveDraft } from '../../../src/v7/effects/draftStore.js';
import { fresh, run, set, route, at, typedA, typedB, typedC, resultA, resultB, answered, carriedBy, TODAY } from './_open.js';
import { fakeStorage } from './_shell.js';
import { APART } from '../../../src/answers/shared/household.js';

const carry = (from, to) => ({ type: A.DRAFT_CARRY, from, to });
const PAIRS = Object.keys(CARRY).map((k) => k.split('→'));

/** C with every carried field typed, as a couple. */
const fullC = () => run(typedC(fresh(), '250,000', '58'),
  set('c', 'household', 'couple'), set('c', 'partner.age', '56'), set('c', 'partner.pot', '90,000'),
  set('c', 'you.statePension.kind', 'forecast'), set('c', 'you.statePension.yearly', '10,000'),
  set('c', 'you.finalSalary.has', true), set('c', 'you.finalSalary.yearly', '6,000'), set('c', 'you.finalSalary.fromAge', '60'),
  set('c', 'savings', '40,000'), set('c', 'risk', 'cautious'), set('c', 'endAge', '100'),
  set('c', 'start.kind', 'age'), set('c', 'start.age', '60'), set('c', 'take', '2,000'));

/** What the map says the target should hold, worked out from the map itself (typed, fixed, and the answer's figures). */
const expectedFrom = (state, from, to) => carriedBy(CARRY[carryKey(from, to)], state, from).values;

describe('the map', () => {
  it('every entry names a field of the source list (or a result key, or a fixed value) and a field of the target list', () => {
    for (const [from, to] of PAIRS) {
      const fromPaths = new Set(SCHEMAS[from].fields.map((f) => f.path));
      const toPaths = new Set(SCHEMAS[to].fields.map((f) => f.path));
      for (const [src, toPath] of CARRY[carryKey(from, to)]) {
        expect(toPaths.has(toPath), `${from}→${to}: ${toPath}`).toBe(true);
        if (typeof src === 'string') expect(fromPaths.has(src), `${from}→${to}: ${src}`).toBe(true);
        else expect('result' in src || 'fixed' in src).toBe(true);
      }
    }
  });
  it('every carry has a place to open, and it is an address that is understood', () => {
    for (const k of Object.keys(CARRY)) {
      const o = CARRY_OPENS[k];
      expect(o, k).toBeTruthy();
      expect(format(route('step', o.q, o.step, o.focus))).not.toBe('#/not-found');
    }
  });
});

describe('draft/carry copies exactly the map', () => {
  it('C → A: the household, the "from age" as the stop age, the amount as the spending; nothing else', () => {
    const s = reduce(fullC(), carry('c', 'a'));
    expect(s.draft.a.values).toEqual(expectedFrom(fullC(), 'c', 'a'));
    expect(s.draft.a.values).toMatchObject({
      household: 'couple', 'you.age': '58', 'you.pot': '250,000', 'partner.age': '56', 'partner.pot': '90,000',
      'you.finalSalary.has': true, savings: '40,000', risk: 'cautious', endAge: '100',
      'stop.age': '60', 'stop.kind': 'age', 'spend.amount': '2,000', 'spend.kind': 'amount'
    });
    expect('take' in s.draft.a.values).toBe(false);
    expect('start.age' in s.draft.a.values).toBe(false);
  });
  it('C → B: the same household, and nothing A has (with no answer to read, nothing is paid in)', () => {
    const s = reduce(fullC(), carry('c', 'b'));
    expect(s.draft.b.values).toEqual(expectedFrom(fullC(), 'c', 'b'));
    expect(s.draft.b.values['stop.age']).toBe('60');
    expect('you.payIn.total' in s.draft.b.values).toBe(false);
  });
  it('A → B and B → A carry the saver fields both ways; B\'s stop age is the age A\'s answer shows', () => {
    // (a charge with one figure after the point, so the draft parses and the answer is for what is typed)
    const a = answered(run(typedA(), set('a', 'you.payIn.total', '600'), set('a', 'savingsIn', '200'), set('a', 'savingRisk', 'adventurous'), set('a', 'charge', '0.7')), 'a', resultA());
    const b = reduce(a, carry('a', 'b'));
    expect(b.draft.b.values).toEqual(expectedFrom(a, 'a', 'b'));
    expect(b.draft.b.values).toMatchObject({ 'you.payIn.total': '600', 'stop.age': '60', 'spend.amount': '2,000', savingsIn: '200', savingRisk: 'adventurous', charge: '0.7' });
    const back = reduce(typedB(), carry('b', 'a'));
    expect(back.draft.a.values).toEqual(expectedFrom(typedB(), 'b', 'a'));
    expect(back.draft.a.values['stop.kind']).toBe('age');
  });
  it('a field not in the map is left as it was in the target; a field in the map is replaced', () => {
    const before = run(fullC(), set('a', 'savingsIn', '200'), set('a', 'partTime.has', true), set('a', 'you.pot', '1'));
    const s = reduce(before, carry('c', 'a'));
    expect(s.draft.a.values.savingsIn).toBe('200');
    expect(s.draft.a.values['partTime.has']).toBe(true);
    expect(s.draft.a.values['you.pot']).toBe('250,000');
  });
  it('a source field with nothing typed carries nothing: the target keeps its own, and it is not marked', () => {
    const before = run(typedC(), set('a', 'stop.age', '62'));             // C has no "from age"
    const s = reduce(before, carry('c', 'a'));
    expect(s.draft.a.values['stop.age']).toBe('62');
    expect(s.draft.a.touched).not.toContain('stop.age');
  });
});

describe('draft/carry marks, labels and leaves alone', () => {
  it('every carried field is marked touched, once (a figure of the answer too, even when there was none to read)', () => {
    const s = run(fullC(), carry('c', 'a'), carry('c', 'a'));
    const map = CARRY[carryKey('c', 'a')];
    const typedNothing = map.filter(([src]) => typeof src === 'string' && fullC().draft.c.values[src] === undefined).map(([, to]) => to);
    expect([...s.draft.a.touched].sort()).toEqual(carriedBy(map, fullC(), 'c').touched.filter((p) => !typedNothing.includes(p)).sort());
  });
  it('the target says where the figures came from', () => {
    expect(reduce(fullC(), carry('c', 'a')).draft.a.carriedFrom).toBe('c');
    expect(reduce(typedA(), carry('a', 'b')).draft.b.carriedFrom).toBe('a');
    expect(reduce(typedB(), carry('b', 'a')).draft.a.carriedFrom).toBe('b');
  });
  it('the source draft and every answer are untouched; nothing is run', () => {
    const before = answered(typedA(), 'a', resultA());
    const s = reduce(before, carry('a', 'b'));
    expect(s.draft.a).toBe(before.draft.a);
    expect(s.answers).toBe(before.answers);
    expect(s.draft.c).toBe(before.draft.c);
  });
  it('the carried-from note goes once a box is changed, and stays when the same value is set again', () => {
    const s = reduce(fullC(), carry('c', 'a'));
    expect(reduce(s, set('a', 'you.age', '58')).draft.a.carriedFrom).toBe('c');
    expect(reduce(s, set('a', 'you.age', '59')).draft.a.carriedFrom).toBe(null);
    expect(reduce(s, set('a', 'you.payIn.total', '100')).draft.a.carriedFrom).toBe(null);
  });
  it('draft/reset empties it', () => {
    const s = run(fullC(), carry('c', 'a'), { type: A.DRAFT_RESET, q: 'a' });
    expect(s.draft.a).toEqual({ values: {}, touched: [], asked: false, revealed: [], carriedFrom: null, spendHow: null, skipNoted: false });
  });
});

describe('a figure from an answer, carried as text — the inputs, never a pot worked out', () => {
  it('A → C: each pot as typed, the age the answer shows as C\'s "from age", the spending as the amount, what goes in as "still paying in"', () => {
    const a = answered(typedA(), 'a', resultA({ middling: 480000, payIn: 600 }));
    const s = reduce(a, carry('a', 'c'));
    expect(s.draft.c.values).toEqual(expectedFrom(a, 'a', 'c'));
    expect(s.draft.c.values).toMatchObject({ 'you.pot': '250,000', 'start.age': '60', 'start.kind': 'age', take: '2,000', 'you.payIn.has': 'yes', 'you.payIn.kind': 'total', 'you.payIn.total': '600' });
    expect(Object.values(s.draft.c.values)).not.toContain('480,000');            // never the middling pot at the stop
    const p = parsedDraft(s, 'c');
    expect(p.ok).toBe(true);
    expect(p.inputs.you.pot).toBe(250000);
    expect(p.inputs.start).toEqual({ kind: 'age', age: 60 });
    expect(p.inputs.take).toBe(2000);
  });
  it('A → C after "show me ages": C\'s "from age" is the age the answer shows (the stop box is empty)', () => {
    const ages = run(typedA(), set('a', 'stop.kind', 'ages'), set('a', 'stop.age', ''));
    const a = answered(ages, 'a', resultA({ kind: 'earliest', age: 63 }));
    expect(reduce(a, carry('a', 'c')).draft.c.values['start.age']).toBe('63');
  });
  it('B → C: the pot as typed, the stop age as C\'s "from age", what goes in as "still paying in" — never the number', () => {
    const b = answered(typedB(), 'b', resultB({ careful: 1_470_000, payIn: 700 }));
    const s = reduce(b, carry('b', 'c'));
    expect(s.draft.c.values).toEqual(expectedFrom(b, 'b', 'c'));
    expect(s.draft.c.values['you.pot']).toBe('180,000');
    expect(s.draft.c.values['start.age']).toBe('60');
    expect(s.draft.c.values['you.payIn.total']).toBe('700');
    expect(Object.values(s.draft.c.values)).not.toContain('1,470,000');
    expect(parsedDraft(s, 'c').ok).toBe(true);
  });
  it('a first figure is read too', () => {
    const a = answered(typedA(), 'a', resultA({ payIn: 750 }), A.ANSWER_FIRST);
    expect(reduce(a, carry('a', 'c')).draft.c.values['you.payIn.total']).toBe('750');
  });
  it('no figure to read (no answer, an answer for other figures, a failed run, a missing key): the box is emptied and marked, never left holding an old figure', () => {
    const cases = [
      run(typedA(typedC()), set('c', 'you.payIn.total', '999')),
      reduce(answered(run(typedA(typedC()), set('c', 'you.payIn.total', '999')), 'a', resultA()), set('a', 'you.pot', '300,000')),
      run(typedA(typedC()), set('c', 'you.payIn.total', '999'), { type: A.ANSWER_WORKING, q: 'a', inputsKey: 'K' }, { type: A.ANSWER_FAILED, q: 'a', inputsKey: 'K' }),
      answered(run(typedA(typedC()), set('c', 'you.payIn.total', '999')), 'a', { ...resultA(), saving: [] })
    ];
    for (const before of cases) {
      expect(before.draft.c.values['you.payIn.total']).toBe('999');
      const s = reduce(before, carry('a', 'c'));
      expect('you.payIn.total' in s.draft.c.values).toBe(false);
      expect(s.draft.c.touched).toContain('you.payIn.total');
    }
  });
});

/*
 * Fund and platform charges (6.19.0): ONE charge, asked in C, A and B alike, carried every way with the household — so a
 * hand-over shows the same figure (research/charges-setting.md T12).
 */
describe('the charge is carried every way, as typed', () => {
  it.each(Object.keys(CARRY))('%s carries the charge', (k) => {
    const [from, to] = k.split('→');
    const typed = from === 'a' ? typedA() : from === 'b' ? typedB() : typedC();
    const withCharge = run(typed, set(from, 'charge', '1.25'));
    const base = from === 'a' ? answered(withCharge, 'a', resultA()) : from === 'b' ? answered(withCharge, 'b', resultB()) : withCharge;
    const s = reduce(base, carry(from, to));
    expect(s.draft[to].values.charge, k).toBe('1.25');
    expect(s.draft[to].touched, k).toContain('charge');
    expect(CARRY[k].filter(([src, toPath]) => src === 'charge' && toPath === 'charge'), k).toHaveLength(1);
  });
  it('a charge left alone carries nothing: the target keeps its own (or its default)', () => {
    const s = reduce(run(typedC(), set('a', 'charge', '0.3')), carry('c', 'a'));
    expect(s.draft.a.values.charge).toBe('0.3');
  });
  it('C → A → C keeps 0.05 as 0.05', () => {
    const c = run(fullC(), set('c', 'charge', '0.05'));
    const a = reduce(c, carry('c', 'a'));
    expect(parsedDraft(a, 'a').values.charge).toBe(0.05);
    const back = reduce(answered(a, 'a', resultA()), carry('a', 'c'));
    expect(back.draft.c.values.charge).toBe('0.05');
    expect(parsedDraft(back, 'c').values.charge).toBe(0.05);
    expect(parsedDraft(back, 'c').errors.charge).toBeUndefined();
  });
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.4, X4): the partner's own stop, the
 * pay line and the tax-free part are the household's, asked in C, A and B alike — carried every way, as typed. Not typed,
 * nothing is carried: a same-year draft is carried exactly as before, key for key.
 */
describe('the partner\'s stop, the pay line and the tax-free part are carried every way, as typed', () => {
  const NEW = ['partner.stop.kind', 'partner.stop.age', 'untilBothStop', 'partner.taxFreeTaken', ...(APART.askAboutPartner ? ['you.taxFreeTaken'] : [])];
  it.each(Object.keys(CARRY))('%s carries them', (k) => {
    for (const p of NEW) expect(CARRY[k], `${k}: ${p}`).toContainEqual([p, p]);
  });
  it('C → A → C keeps the partner\'s own stop, the pay line and the partner\'s tax-free answer', () => {
    const c = run(fullC(), set('c', 'partner.stop.kind', 'age'), set('c', 'partner.stop.age', '60'), set('c', 'untilBothStop', 'all'), set('c', 'partner.taxFreeTaken', true));
    const a = reduce(c, carry('c', 'a'));
    expect(a.draft.a.values).toEqual(expectedFrom(c, 'c', 'a'));
    expect(a.draft.a.values).toMatchObject({ 'partner.stop.kind': 'age', 'partner.stop.age': '60', untilBothStop: 'all', 'partner.taxFreeTaken': true });
    expect(parsedDraft(a, 'a').values).toMatchObject({ 'partner.stop.kind': 'age', 'partner.stop.age': 60, untilBothStop: 'all' });
    const back = reduce(answered(a, 'a', resultA()), carry('a', 'c'));
    expect(back.draft.c.values).toMatchObject({ 'partner.stop.kind': 'age', 'partner.stop.age': '60', untilBothStop: 'all', 'partner.taxFreeTaken': true });
  });
  it('"they already have" goes with the household from B to A and on to C', () => {
    const b = run(typedB(), set('b', 'household', 'couple'), set('b', 'partner.age', '58'), set('b', 'partner.stop.kind', 'already'), set('b', 'partner.taxFreeTaken', false));
    const a = reduce(b, carry('b', 'a'));
    expect(a.draft.a.values).toMatchObject({ 'partner.stop.kind': 'already', 'partner.taxFreeTaken': false });
    expect(a.draft.a.touched).toContain('partner.stop.kind');
  });
  it('not typed, nothing is carried: a same-year draft is carried exactly as before (no new key, nothing more marked)', () => {
    for (const k of Object.keys(CARRY)) {
      const [from, to] = k.split('→');
      const base = from === 'a' ? answered(typedA(), 'a', resultA()) : from === 'b' ? answered(typedB(), 'b', resultB()) : fullC();
      const s = reduce(base, carry(from, to));
      for (const p of NEW) {
        expect(p in s.draft[to].values, `${k}: ${p}`).toBe(false);
        expect(s.draft[to].touched, `${k}: ${p}`).not.toContain(p);
      }
    }
  });
});

/*
 * "I've already stopped" (couples-different-years.md 2.2, 5.4; the owner's switch 3): A's and B's answer is about your
 * partner. Its hand-overs have maps of their own (CARRY_YOU_STOPPED), picked from what is typed in the source — into C,
 * "from now" with your partner stopping at the age the answer is about; into the other saver question, "I've already
 * stopped" again. Every entry is one of the three plain kinds. tests/v7/cross/handOver.test.js runs them on real answers.
 */
describe('"I\'ve already stopped": maps of its own, picked from what is typed', () => {
  const KEYS = Object.keys(CARRY_YOU_STOPPED);
  const youStoppedA = () => run(fresh(), ...Object.entries({ household: 'couple', 'you.age': '56', 'you.pot': '500,000', 'stop.kind': 'already',
    'spend.amount': '3,500', savings: '60,000', 'partner.age': '55', 'partner.pot': '450,000', 'partner.payIn.total': '850', 'partner.stop.kind': 'ages',
    untilBothStop: 'none', 'you.taxFreeTaken': true }).map(([p, v]) => set('a', p, v)));
  const partnerResult = (age) => ({ ...resultA({ kind: 'earliest', age }), askedAbout: 'partner',
    saving: [{ who: 'you', payIn: { total: 0 } }, { who: 'partner', payIn: { total: 850 } }] });

  it('there is one for each hand-over A and B make, while the switch offers "I\'ve already stopped"', () => {
    expect(KEYS.sort()).toEqual(APART.askAboutPartner ? ['a→b', 'a→c', 'b→a', 'b→c'] : []);
    for (const k of KEYS) expect(CARRY_YOU_STOPPED_OPENS[k], k).toBeTruthy();
  });
  it('every entry names a field of the source list (or a result key, or a fixed value) and a field of the target list, once', () => {
    for (const k of KEYS) {
      const [from, to] = k.split('→');
      const fromPaths = new Set(SCHEMAS[from].fields.map((f) => f.path));
      const target = new Map(SCHEMAS[to].fields.map((f) => [f.path, f]));
      const seen = new Set();
      for (const [src, toPath] of CARRY_YOU_STOPPED[k]) {
        expect(target.has(toPath), `${k}: ${toPath}`).toBe(true);
        expect(seen.has(toPath), `${k}: ${toPath} twice`).toBe(false);
        seen.add(toPath);
        if (typeof src === 'string') expect(fromPaths.has(src), `${k}: ${src}`).toBe(true);
        else if ('fixed' in src) { const f = target.get(toPath); expect(f.type === 'choice' ? f.options.includes(src.fixed) : f.type === 'yesNo' || typeof src.fixed === 'string', `${k}: ${toPath} = ${src.fixed}`).toBe(true); }
        else expect('result' in src, `${k}: ${JSON.stringify(src)}`).toBe(true);
      }
      expect(format(route('step', CARRY_YOU_STOPPED_OPENS[k].q, CARRY_YOU_STOPPED_OPENS[k].step, CARRY_YOU_STOPPED_OPENS[k].focus))).not.toBe('#/not-found');
    }
  });
  it('carryFor picks them only for a couple whose source says "I\'ve already stopped"; otherwise the plain map and place', () => {
    for (const k of Object.keys(CARRY)) {
      const [from, to] = k.split('→');
      expect(carryFor(from, to, {}), k).toEqual({ map: CARRY[k], opens: CARRY_OPENS[k] });
      expect(carryFor(from, to, { household: 'single', 'stop.kind': 'already' }), k).toEqual({ map: CARRY[k], opens: CARRY_OPENS[k] });
      expect(carryFor(from, to, { household: 'couple', 'stop.kind': 'age' }), k).toEqual({ map: CARRY[k], opens: CARRY_OPENS[k] });
      const picked = carryFor(from, to, { household: 'couple', 'stop.kind': 'already' });
      expect(picked, k).toEqual(KEYS.includes(k) ? { map: CARRY_YOU_STOPPED[k], opens: CARRY_YOU_STOPPED_OPENS[k] } : { map: CARRY[k], opens: CARRY_OPENS[k] });
    }
    expect(carryFor('a', 'x', { household: 'couple', 'stop.kind': 'already' })).toEqual({ map: null, opens: null });
  });
  it.runIf(APART.askAboutPartner)('A → C: from now; your partner at the age the answer shows; nothing more into your pension; the pay line and tax-free answer as typed', () => {
    const a = answered(youStoppedA(), 'a', partnerResult(57));
    const s = reduce(a, carry('a', 'c'));
    expect(s.draft.c.values).toEqual(carriedBy(CARRY_YOU_STOPPED['a→c'], a, 'a').values);
    expect(s.draft.c.values).toMatchObject({ 'start.kind': 'now', 'partner.stop.kind': 'age', 'partner.stop.age': '57', 'you.payIn.has': 'no',
      'partner.payIn.has': 'yes', 'partner.payIn.kind': 'total', 'partner.payIn.total': '850', take: '3,500', untilBothStop: 'none', 'you.taxFreeTaken': true });
    expect('start.age' in s.draft.c.values).toBe(false);
    expect(s.route).toMatchObject({ q: 'c', step: 'answer' });
    const p = parsedDraft(s, 'c');
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    expect(p.inputs.start).toEqual({ kind: 'now' });
    expect(p.inputs.partner.stop).toEqual({ kind: 'age', age: 57 });
  });
  it.runIf(APART.askAboutPartner)('A → B: "I\'ve already stopped" again, your partner at the age shown; B opens with nothing more it must have', () => {
    const a = answered(youStoppedA(), 'a', partnerResult(57));
    const s = reduce(a, carry('a', 'b'));
    expect(s.draft.b.values).toEqual(carriedBy(CARRY_YOU_STOPPED['a→b'], a, 'a').values);
    expect(s.draft.b.values).toMatchObject({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '57' });
    expect(s.route).toMatchObject({ q: 'b', step: 'numbers', focus: null });
    expect(parsedDraft(s, 'b').ok, JSON.stringify(parsedDraft(s, 'b').errors)).toBe(true);
  });
  it.runIf(APART.askAboutPartner)('no answer to read: the partner\'s stop age is emptied and marked, never left holding an old figure', () => {
    const s = reduce(run(youStoppedA(), set('c', 'partner.stop.age', '70')), carry('a', 'c'));
    expect('partner.stop.age' in s.draft.c.values).toBe(false);
    expect(s.draft.c.touched).toContain('partner.stop.age');
  });
});

/*
 * The other way (the reviewers' finding, 2 Oct 2026): C "from now" with your partner stopping at an age says you have
 * stopped and they have not — into A and B as "I've already stopped", your partner at that age, opening on the numbers
 * with nothing more to fill. Before, A opened as if you were still saving: the stop age empty and focused, your pay-in £0.
 */
describe('C "from now" with your partner stopping later: into A and B as "I\'ve already stopped"', () => {
  const KEYS = Object.keys(CARRY_C_YOU_STOPPED);
  const youStoppedC = (more = {}) => run(fresh(), ...Object.entries({ household: 'couple', 'you.age': '62', 'you.pot': '400,000', savings: '30,000', take: '2,800',
    'partner.age': '55', 'partner.pot': '260,000', 'partner.payIn.has': 'yes', 'partner.payIn.kind': 'total', 'partner.payIn.total': '700',
    'partner.stop.kind': 'age', 'partner.stop.age': '57', untilBothStop: 'all', ...more }).map(([p, v]) => set('c', p, v)));
  const APART_STOPS = { first: 'you', years: 2, stops: { you: { age: 62, already: true }, partner: { age: 57, already: false } }, payCovers: 1, coversGap: true, coverUsed: null };
  const cResult = (apart = APART_STOPS, start = { kind: 'now' }) => ({ status: 'ok', inputs: { household: 'couple', start }, monthly: { careful: 2800, middling: 3200, good: 3700 },
    payIn: { total: 700, byPerson: [{ who: 'you', total: 0 }, { who: 'partner', total: 700 }] }, ...(apart ? { apart } : {}) });

  it('there is one for C → A and C → B while the switch offers "I\'ve already stopped"; every entry names real fields', () => {
    expect(KEYS.sort()).toEqual(APART.askAboutPartner ? ['c→a', 'c→b'] : []);
    for (const k of KEYS) {
      const [from, to] = k.split('→');
      const fromPaths = new Set(SCHEMAS[from].fields.map((f) => f.path));
      const target = new Map(SCHEMAS[to].fields.map((f) => [f.path, f]));
      const seen = new Set();
      for (const [src, toPath] of CARRY_C_YOU_STOPPED[k]) {
        expect(target.has(toPath), `${k}: ${toPath}`).toBe(true);
        expect(seen.has(toPath), `${k}: ${toPath} twice`).toBe(false);
        seen.add(toPath);
        if (typeof src === 'string') expect(fromPaths.has(src), `${k}: ${src}`).toBe(true);
        else if ('fixed' in src) { const f = target.get(toPath); expect(f.type === 'choice' ? f.options.includes(src.fixed) : true, `${k}: ${toPath} = ${src.fixed}`).toBe(true); }
        else expect('result' in src).toBe(true);
      }
      expect(CARRY_C_YOU_STOPPED_OPENS[k]).toEqual({ q: to, step: 'numbers', focus: null });
    }
  });
  it('carryFor picks it only when C\'s answer says so: from now, you already stopped, your partner stopping later (the words of C\'s "What next?" read the same)', () => {
    for (const k of KEYS) {
      const [from, to] = k.split('→');
      expect(carryFor(from, to, {}, cResult())).toEqual({ map: CARRY_C_YOU_STOPPED[k], opens: CARRY_C_YOU_STOPPED_OPENS[k] });
      expect(cAnswerYouStopped(cResult())).toBe(true);
      const nots = [
        null,                                                                               // no answer for what is typed
        cResult(null),                                                                      // the two of you stop together
        cResult(APART_STOPS, { kind: 'age', age: 63 }),                                     // C from an age: you have not stopped
        // "from now" moved to the day a pension opens (you still paying in): you start later, not now
        cResult({ ...APART_STOPS, first: 'partner', stops: { you: { age: 57, already: false }, partner: { age: 55, already: true } } }),
        cResult({ ...APART_STOPS, stops: { you: { age: 62, already: true }, partner: { age: 55, already: true } } }),
        { ...cResult(), status: 'invalid' }
      ];
      for (const not of nots) {
        expect(carryFor(from, to, {}, not), JSON.stringify(not && not.apart)).toEqual({ map: CARRY[k], opens: CARRY_OPENS[k] });
        expect(cAnswerYouStopped(not)).toBe(false);
      }
    }
    expect(carryFor('a', 'b', {}, cResult())).toEqual({ map: CARRY['a→b'], opens: CARRY_OPENS['a→b'] });
  });
  it.runIf(APART.askAboutPartner)('C → A: "I\'ve already stopped", your partner at their age, their pay-in, the amount as the spending; opens with no box focused', () => {
    const c = answered(youStoppedC(), 'c', cResult());
    expect(parsedDraft(c, 'c').values['start.kind']).toBe('now');                 // a default: nothing typed for it
    const s = reduce(c, carry('c', 'a'));
    expect(s.draft.a.values).toEqual(carriedBy(CARRY_C_YOU_STOPPED['c→a'], c, 'c').values);
    expect(s.draft.a.values).toMatchObject({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '57', 'partner.payIn.kind': 'total',
      'partner.payIn.total': '700', 'spend.amount': '2,800', 'spend.kind': 'amount', untilBothStop: 'all' });
    expect('stop.age' in s.draft.a.values).toBe(false);
    expect(s.route).toMatchObject({ q: 'a', step: 'numbers', focus: null });
    const p = parsedDraft(s, 'a');
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    expect(p.inputs.stop).toEqual({ kind: 'already' });
    expect(p.inputs.partner.stop).toEqual({ kind: 'age', age: 57 });
  });
  it.runIf(APART.askAboutPartner)('C → B: the same; B opens with nothing more it must have', () => {
    const s = reduce(answered(youStoppedC(), 'c', cResult()), carry('c', 'b'));
    expect(s.draft.b.values).toMatchObject({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '57', 'partner.payIn.total': '700' });
    expect(s.route).toMatchObject({ q: 'b', step: 'numbers', focus: null });
    expect(parsedDraft(s, 'b').ok, JSON.stringify(parsedDraft(s, 'b').errors)).toBe(true);
  });
  it('C at an age, the two of you together, or no answer for what is typed: carried as before', () => {
    const atAge = reduce(answered(youStoppedC({ 'start.kind': 'age', 'start.age': '63' }), 'c', cResult(APART_STOPS, { kind: 'age', age: 63 })), carry('c', 'a'));
    expect(atAge.draft.a.values['stop.kind']).toBe('age');
    expect(atAge.route).toMatchObject({ q: 'a', step: 'numbers', focus: 'stop.age' });
    const together = reduce(answered(run(youStoppedC(), set('c', 'partner.stop.kind', '')), 'c', cResult(null)), carry('c', 'a'));
    expect(together.draft.a.values['stop.kind']).toBe('age');
    // an answer for other figures (typed since) is not read: the plain map
    const stale = reduce(run(answered(youStoppedC(), 'c', cResult()), set('c', 'you.pot', '410,000')), carry('c', 'a'));
    expect(stale.draft.a.values['stop.kind']).toBe('age');
  });
});

describe('where a carry opens', () => {
  it.each(Object.keys(CARRY))('%s', (k) => {
    const [from, to] = k.split('→');
    const base = from === 'a' ? answered(typedA(), 'a', resultA()) : from === 'b' ? answered(typedB(), 'b', resultB()) : fullC();
    const s = reduce(run(base, { type: A.UI_RAIL, open: true }), carry(from, to));
    const o = CARRY_OPENS[k];
    expect(s.route).toEqual(route('step', o.q, o.step, o.focus));
    expect(s.ui.railOpen).toBe(false);
  });
  it('C → A opens A\'s numbers at the stop age; A → C opens C\'s answer, which then runs from a complete draft', () => {
    expect(format(reduce(fullC(), carry('c', 'a')).route)).toBe('#/a/numbers?focus=stop.age');
    expect(format(reduce(answered(typedA(), 'a', resultA()), carry('a', 'c')).route)).toBe('#/c/answer');
  });
});

describe('refused', () => {
  it('a carry that is not in the map, or to or from a question with no draft, throws in the test build and is ignored when published', () => {
    for (const [from, to] of [['c', 'c'], ['a', 'd'], ['d', 'a'], ['z', 'c'], [undefined, 'a']]) {
      expect(() => reduce(fullC(), carry(from, to)), `${from}→${to}`).toThrow();
      const prod = initialState({ today: TODAY });
      expect(reduce(prod, carry(from, to))).toBe(prod);
    }
  });
});

describe('it lasts', () => {
  it('the state survives JSON after a carry', () => {
    const s = run(answered(typedA(fullC()), 'a', resultA()), carry('c', 'a'), carry('a', 'b'), carry('a', 'c'));
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
  it('a reload keeps the carried figures (the tab\'s draft store) and where they came from (the state\'s own copy)', () => {
    const s = reduce(fullC(), carry('c', 'a'));
    const storage = fakeStorage();
    expect(saveDraft(storage, s.draft)).toBe(true);
    const reloaded = initialState({ today: TODAY, build: 'test', draft: loadDraft(storage) });
    expect(reloaded.draft.a.values).toEqual(s.draft.a.values);
    expect(reloaded.draft.a.touched).toEqual(s.draft.a.touched);
    expect(reloaded.draft.a.carriedFrom).toBe('c');                    // the "brought over" line survives the reload too
    expect(loadDraft(fakeStorage({ pt_v7_draft: JSON.stringify({ a: { values: {}, carriedFrom: 'a' }, b: { values: {}, carriedFrom: 'x' } }) }))).toMatchObject({ a: { carriedFrom: null }, b: { carriedFrom: null } });
    const kept = initialState({ today: TODAY, build: 'test', draft: JSON.parse(JSON.stringify(s.draft)) });
    expect(kept.draft.a.carriedFrom).toBe('c');
    expect(at(kept, 'a', 'numbers').draft.a.values['stop.age']).toBe('60');
  });
});

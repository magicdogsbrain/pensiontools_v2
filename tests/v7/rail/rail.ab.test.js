/**
 * The rail over the three questions (step 4 brief 4.12; test plan A-B 10.4): L1–L8 as C with A and B open, plus
 *   L9  a hand-over is one action that carries the household across (every mapped path, nothing else)
 *   L10 an optional step opened with figures but no answer is in its working form, never blank
 *   L11 the short results: A's verdict and age, B's number and age, the numbers as typed
 * and random walks that cross questions. C's own rail is pinned in rail.test.js (with only C open, as the tree is
 * until joining up); here questions.js is stood in for with A, B and C open, as the joined-up branch will have it.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import fc from 'fast-check';
import { railFor, frontDoor, NEXT, NEXT_RULES, NEXT_ORDER, carryButton } from '../../../src/v7/rail/index.js';
import { BUILT } from '../../../src/v7/rail/questions.js';
import { NEXT_A } from '../../../src/v7/rail/a.js';
import { NEXT_B } from '../../../src/v7/rail/b.js';
import { NEXT_C } from '../../../src/v7/rail/c.js';
import { parse, format, href, screenName } from '../../../src/v7/router/routes.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { currentKey, parsedDraft, SCHEMAS, SPEND_STEP, isSpendPath } from '../../../src/v7/state/select.js';
import { A, ACTION_TYPES } from '../../../src/v7/state/actions.js';
import { CARRY } from '../../../src/v7/state/carry.js';
import { partsText, money, pot } from '../../../src/answers/shared/format.js';
import { ANSWERS } from '../../../src/answers/index.js';
import { fresh, run, set, route, at, typedA, typedB, typedC, resultA, resultB, answered, carriedBy, TODAY } from '../shell/_open.js';

const Q = ['a', 'b', 'c'];
const SCREENS = ['front', 'soon', 'notBuilt', ...Q.flatMap((q) => BUILT[q].steps.filter((s) => s.built).map((s) => `${q}.${s.id}`))];
const goTo = (state, address) => reduce(state, { type: A.ROUTE_SET, route: parse(address) });
const text = (step) => partsText(step.result.parts, step.source);
const next = (s) => railFor(s).next.id;

function linksFrom(state) {
  const r = state.route;
  if (r.screen === 'front' || r.screen === 'notFound') return frontDoor().map((q) => q.href);
  if (r.screen === 'soon') return [href.front()];
  const rail = railFor(state);
  const links = [href.front(), ...rail.steps.map((s) => s.href)];
  if (rail.next.button && rail.next.button.href) links.push(rail.next.button.href);
  return links;
}

describe('the tables', () => {
  it('each question\'s next sentences are tried in its own order, and each has a rule', () => {
    expect(NEXT_ORDER).toEqual({ a: NEXT_A, b: NEXT_B, c: NEXT_C });
    for (const q of Q) expect(Object.keys(NEXT_RULES[q]).sort()).toEqual([...NEXT_ORDER[q]].sort());
    expect(NEXT_RULES.c).toBe(NEXT);
  });
  it('every "needs" names a field of the question\'s list, or the answer', () => {
    for (const q of Q) {
      const paths = new Set(SCHEMAS[q].fields.map((f) => f.path));
      for (const s of BUILT[q].steps) for (const n of s.needs) expect(n === 'answer' || paths.has(n), `${q}: ${n}`).toBe(true);
    }
  });
  it('the front door leads A and B to their numbers step', () => {
    expect(frontDoor().filter((q) => q.built).map((q) => [q.id, q.href])).toEqual([['a', '#/a/numbers'], ['b', '#/b/numbers'], ['c', '#/c/numbers']]);
  });
});

describe('L1 — every step of every question can be reached from the front door', () => {
  it('a search over the declared links', () => {
    const seen = new Set();
    const queue = [href.front()];
    while (queue.length) {
      const address = queue.shift();
      if (seen.has(address)) continue;
      seen.add(address);
      for (const link of linksFrom(goTo(fresh(), address))) queue.push(link);
    }
    const wanted = [href.front(), ...Q.flatMap((q) => BUILT[q].steps.map((s) => href.step(q, s.id))), ...['d', 'e', 'f'].map((q) => href.soon(q))];
    expect([...seen].sort()).toEqual(wanted.sort());
  });
});

describe('L2, L3 — no dead ends, and every link and button points somewhere', () => {
  const places = [...Q.flatMap((q) => BUILT[q].steps.map((s) => href.step(q, s.id)))];
  const bases = () => [fresh(), typedA(typedB(typedC())), answered(answered(typedA(typedB()), 'a', resultA()), 'b', resultB())];
  it('every step has a way back to the front door and a link to every step of its question', () => {
    for (const base of bases()) for (const address of places) {
      const links = linksFrom(goTo(base, address));
      expect(links, address).toContain(href.front());
      const q = parse(address).q;
      for (const s of BUILT[q].steps) expect(links).toContain(href.step(q, s.id));
    }
  });
  it('every link is understood and draws a screen that exists; every button is a link or an action the reducer takes', () => {
    for (const base of bases()) for (const address of places) {
      const s = goTo(base, address);
      for (const link of linksFrom(s)) {
        expect(parse(link).screen, link).not.toBe('notFound');
        expect(format(parse(link))).toBe(link);
        expect(SCREENS).toContain(screenName(parse(link)));
      }
      const b = railFor(s).next.button;
      if (!b) continue;
      expect(typeof b.labelId).toBe('string');
      expect(('href' in b) !== ('action' in b)).toBe(true);
      if (b.action) {
        expect(ACTION_TYPES).toContain(b.action.type);
        expect(() => reduce(s, b.action)).not.toThrow();
      }
    }
  });
});

describe('L5 — nothing demands another tool first', () => {
  for (const q of ['a', 'b']) {
    it.each(['numbers', 'spend', 'answer', q === 'a' ? 'ages' : 'choices', 'keep'])(`#/${q}/%s opened with nothing entered asks for the figures`, (step) => {
      const s = goTo(fresh(), href.step(q, step));
      expect(s.route).toEqual(route('step', q, step));
      const rail = railFor(s);
      expect(rail.question).toBe(q);
      expect(rail.steps.filter((x) => x.state === 'current').map((x) => x.id)).toEqual([step]);
      expect(rail.next).toEqual({ id: `${q}.blank`, button: null });
      expect(rail.steps.every((x) => x.result === null)).toBe(true);
      expect(rail.position).toEqual({ n: BUILT[q].steps.findIndex((x) => x.id === step) + 1, of: 5 });
    });
  }
});

describe('the next sentence, state by state (first match wins)', () => {
  it('A', () => {
    expect(next(at(fresh(), 'a', 'numbers'))).toBe('a.blank');
    // the budget step: the numbers are all there, the spending is not — "what would you spend?"
    expect(next(at(typedA(fresh(), { spend: '' }), 'a', 'numbers'))).toBe('a.spend');
    expect(next(at(typedA(fresh(), { spend: '' }), 'a', 'spend'))).toBe('a.spend');
    expect(next(at(typedA(fresh(), { spend: '', pot: '' }), 'a', 'numbers'))).toBe('a.blank');       // the numbers' own blanks first
    expect(next(at(typedA(fresh(), { spend: '', stop: '45' }), 'a', 'numbers'))).toBe('a.fix');      // a figure wrong on the numbers step
    expect(next(at(typedA(), 'a', 'spend'))).toBe('a.ready');
    expect(next(at(run(typedA(fresh(), { stop: '' }), set('a', 'stop.kind', 'ages')), 'a', 'numbers'))).toBe('a.ready');   // no age needed for "show me ages"
    expect(next(at(run(typedA(fresh(), { spend: '' }), set('a', 'spend.kind', 'level'), set('a', 'spend.level', 'moderate')), 'a', 'numbers'))).toBe('a.ready');
    expect(next(at(typedA(fresh(), { stop: '45' }), 'a', 'numbers'))).toBe('a.fix');          // before today's age
    expect(next(at(typedA(), 'a', 'numbers'))).toBe('a.ready');
    expect(next(at(typedA(), 'a', 'answer'))).toBe('a.working');
    const s = at(typedA(), 'a', 'answer');
    expect(next(answered(s, 'a', resultA(), A.ANSWER_FIRST))).toBe('a.working');
    expect(next(answered(s, 'a', resultA({ verdict: 'no' })))).toBe('a.no');
    expect(next(answered(s, 'a', resultA({ verdict: 'close' })))).toBe('a.close');
    expect(next(answered(s, 'a', resultA({ verdict: 'yes' })))).toBe('a.yes');
    expect(next(answered(s, 'a', resultA({ kind: 'earliest', verdict: 'yes', age: 61 })))).toBe('a.ages');
    expect(next(answered(s, 'a', resultA({ kind: 'noneWorked', verdict: 'no', age: 75, earliestYes: null })))).toBe('a.ages.none');
    const key = currentKey(s, 'a');
    expect(next(run(s, { type: A.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: A.ANSWER_FAILED, q: 'a', inputsKey: key }))).toBe('a.failed');
    expect(next(at(typedA(fresh(), { age: '70', stop: '70' }), 'a', 'answer'))).toBe('a.retired');
    expect(next(at(reduce(answered(s, 'a', resultA()), set('a', 'you.pot', '1')), 'a', 'numbers'))).toBe('a.ready');
  });
  it('B', () => {
    expect(next(at(fresh(), 'b', 'numbers'))).toBe('b.blank');
    expect(next(at(typedB(fresh(), { payIn: '' }), 'b', 'numbers'))).toBe('b.blank');
    expect(next(at(typedB(fresh(), { spend: '' }), 'b', 'numbers'))).toBe('b.spend');
    expect(next(at(typedB(fresh(), { spend: '', payIn: '' }), 'b', 'numbers'))).toBe('b.blank');
    expect(next(at(run(typedB(fresh(), { payIn: '' }), set('b', 'you.payIn.kind', 'split'), set('b', 'you.payIn.own', '500'), set('b', 'you.payIn.employer', '200')), 'b', 'numbers'))).toBe('b.ready');
    expect(next(at(typedB(fresh(), { stop: '45' }), 'b', 'numbers'))).toBe('b.fix');
    expect(next(at(typedB(), 'b', 'numbers'))).toBe('b.ready');
    const s = at(typedB(), 'b', 'answer');
    expect(next(s)).toBe('b.working');
    expect(next(answered(s, 'b', resultB({ status: 'out-of-reach', careful: null })))).toBe('b.none');
    expect(next(answered(s, 'b', resultB({ onCourse: false })))).toBe('b.short');
    expect(next(answered(s, 'b', resultB({ onCourse: true })))).toBe('b.onCourse');
    expect(next(at(typedB(fresh(), { age: '70', stop: '70' }), 'b', 'answer'))).toBe('b.retired');
  });
  it('the buttons', () => {
    const s = at(typedA(), 'a', 'answer');
    expect(railFor(at(typedA(), 'a', 'numbers')).next.button).toEqual({ labelId: 'a.action.show', action: { type: A.DRAFT_ASK, q: 'a' } });
    expect(railFor(answered(s, 'a', resultA({ verdict: 'no' }))).next.button).toEqual({ labelId: 'a.action.seeAges', href: '#/a/ages' });
    expect(railFor(answered(s, 'a', resultA({ verdict: 'close' }))).next.button).toBe(null);
    expect(railFor(answered(s, 'a', resultA({ verdict: 'yes' }))).next.button).toEqual({ labelId: 'a.action.keep', href: '#/a/keep' });
    expect(railFor(answered(s, 'a', resultA({ kind: 'noneWorked', verdict: 'no', earliestYes: null }))).next.button).toEqual({ labelId: 'a.next.c', action: { type: A.DRAFT_CARRY, from: 'a', to: 'c' } });
    expect(railFor(at(typedA(fresh(), { age: '70', stop: '70' }), 'a', 'answer')).next.button).toEqual({ labelId: 'a.action.willItLast', href: '#/soon/d' });
    const key = currentKey(s, 'a');
    expect(railFor(run(s, { type: A.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: A.ANSWER_FAILED, q: 'a', inputsKey: key })).next.button)
      .toEqual({ labelId: 'a.action.retry', action: { type: A.ANSWER_RETRY, q: 'a' } });
    const b = at(typedB(), 'b', 'answer');
    expect(railFor(at(typedB(), 'b', 'numbers')).next.button).toEqual({ labelId: 'b.action.show', action: { type: A.DRAFT_ASK, q: 'b' } });
    expect(railFor(answered(b, 'b', resultB())).next.button).toEqual({ labelId: 'b.action.together', href: '#/b/choices' });
    expect(railFor(answered(b, 'b', resultB({ onCourse: true }))).next.button).toEqual({ labelId: 'b.action.keep', href: '#/b/keep' });
    expect(railFor(at(typedB(fresh(), { age: '70', stop: '70' }), 'b', 'answer')).next.button).toEqual({ labelId: 'b.action.willItLast', href: '#/soon/d' });
    // On the keep step itself: name it and save — no button to the step on screen; an answer that cannot be saved
    // (the stand-in results here have no inputs) leads back to it.
    expect(railFor(at(answered(b, 'b', resultB({ onCourse: true })), 'b', 'keep')).next).toEqual({ id: 'b.keep', button: { labelId: 'b.action.back', href: '#/b/answer' } });
    // The budget step: from the numbers step a link to it; on it, none.
    expect(railFor(at(typedA(fresh(), { spend: '' }), 'a', 'numbers')).next.button).toEqual({ labelId: 'a.action.spend', href: '#/a/spend' });
    expect(railFor(at(typedA(fresh(), { spend: '' }), 'a', 'spend')).next.button).toBe(null);
    expect(railFor(at(typedB(fresh(), { spend: '' }), 'b', 'answer')).next.button).toEqual({ labelId: 'b.action.spend', href: '#/b/spend' });
    // Pressing "Show if it works" does what it says.
    expect(reduce(at(typedA(), 'a', 'numbers'), railFor(at(typedA(), 'a', 'numbers')).next.button.action).route).toEqual(route('step', 'a', 'answer'));
  });
});

describe('L9 — a hand-over is one action that carries the household across', () => {
  const answeredA = () => answered(at(run(typedA(), set('a', 'you.payIn.total', '600')), 'a', 'answer'), 'a', resultA());
  const answeredB = () => answered(at(typedB(), 'b', 'answer'), 'b', resultB());
  const mapped = (state, from, to) => carriedBy(CARRY[`${from}→${to}`], state, from).values;
  it('from any A answer, "Am I saving enough?": B\'s draft is A\'s shared paths, nothing else', () => {
    const s = answeredA();
    const button = carryButton('a', 'b');
    expect(button).toEqual({ labelId: 'a.next.b', action: { type: A.DRAFT_CARRY, from: 'a', to: 'b' } });
    const t = reduce(s, button.action);
    expect(t.draft.b.values).toEqual(mapped(s, 'a', 'b'));
    for (const p of ['you.age', 'you.pot', 'you.payIn.total', 'stop.age', 'spend.amount']) expect(t.draft.b.values[p]).toBe(s.draft.a.values[p]);
    expect(format(t.route)).toBe('#/b/numbers?focus=you.payIn.total');
    expect(parsedDraft(t, 'b').ok).toBe(true);                          // A's pay-in came too: B can answer at once
  });
  it('from any B answer, "When could I stop?": the other way', () => {
    const s = answeredB();
    const t = reduce(s, carryButton('b', 'a').action);
    expect(t.draft.a.values).toEqual(mapped(s, 'b', 'a'));
    expect(format(t.route)).toBe('#/a/numbers');
    expect(parsedDraft(t, 'a').ok).toBe(true);
  });
  it('from C, the household and the amount; and back to C with the pot as typed — never a pot the answer worked out', () => {
    const c = run(typedC(fresh(), '250,000', '55'), set('c', 'start.kind', 'age'), set('c', 'start.age', '60'), set('c', 'take', '1,800'));
    const toA = reduce(c, carryButton('c', 'a').action);
    expect(toA.draft.a.values).toEqual(mapped(c, 'c', 'a'));
    const toC = reduce(answered(at(toA, 'a', 'answer'), 'a', resultA({ middling: 480000 })), carryButton('a', 'c').action);
    expect(toC.draft.c.values['you.pot']).toBe('250,000');
    expect(toC.route).toEqual(route('step', 'c', 'answer'));
  });
});

describe('L10 — an optional step opened with figures but no answer is working, never blank', () => {
  it('#/a/ages', () => {
    const s = goTo(typedA(), '#/a/ages');
    const rail = railFor(s);
    expect(rail.next.id).toBe('a.working');
    expect(rail.steps.map((x) => [x.id, x.state])).toEqual([['numbers', 'done'], ['spend', 'done'], ['answer', 'open'], ['ages', 'current'], ['keep', 'open']]);
  });
  it('#/a/ages while the extra pass runs, and once it has landed', () => {
    const s = answered(goTo(typedA(), '#/a/ages'), 'a', resultA());
    expect(next(s)).toBe('a.working');
    const ext = reduce(s, { type: A.ANSWER_EXTEND, q: 'a', inputsKey: currentKey(s, 'a') });
    expect(next(ext)).toBe('a.working');
    const done = reduce(ext, { type: A.ANSWER_FINAL, q: 'a', inputsKey: currentKey(s, 'a'), result: resultA({ detail: 'all' }) });
    // On the every-age step the next thing is to press an age in the table — never "see every age" (review, 1 Oct 2026).
    expect(next(done)).toBe('a.ages');
    expect(JSON.stringify(railFor(done).next.button || {})).not.toContain('a.action.seeAges');
    expect(next(at(done, 'a', 'answer'))).toBe('a.close');
    expect(railFor(done).steps.find((x) => x.id === 'ages').state).toBe('current');
  });
  it('#/b/choices once the grid is in: press a cell — never "try two together", the step on screen', () => {
    const s = answered(goTo(typedB(), '#/b/choices'), 'b', resultB({ detail: 'grid' }));
    expect(next(s)).toBe('b.choices');
    expect(railFor(s).next.button).toEqual({ labelId: 'b.action.back', href: '#/b/answer' });
    expect(next(at(s, 'b', 'answer'))).toBe('b.short');
  });
  it('#/b/choices: working with no answer; on course, the grid step\'s own sentence (the on-course one on the answer step)', () => {
    expect(next(goTo(typedB(), '#/b/choices'))).toBe('b.working');
    const s = answered(goTo(typedB(), '#/b/choices'), 'b', resultB({ onCourse: true }));
    const ext = reduce(s, { type: A.ANSWER_EXTEND, q: 'b', inputsKey: currentKey(s, 'b') });
    const done = reduce(ext, { type: A.ANSWER_FINAL, q: 'b', inputsKey: currentKey(s, 'b'), result: resultB({ onCourse: true, detail: 'grid' }) });
    expect(next(done)).toBe('b.choices');
    expect(next(at(done, 'b', 'answer'))).toBe('b.onCourse');
  });
});

describe('L11 — the short results', () => {
  it('A\'s numbers: pot, age, the stop — as typed (the spending is the spend step\'s)', () => {
    const step = railFor(at(typedA(), 'a', 'answer')).steps[0];
    expect(step.result.text).toBe('£250,000, age 50, stop at 60');
    expect(step.result.id).toBe('a.rail.numbers');
    expect(text(step)).toBe(step.result.text);
    const couple = railFor(at(run(typedA(), set('a', 'household', 'couple'), set('a', 'partner.age', '52')), 'a', 'answer')).steps[0];
    expect(couple.result.text).toBe('£250,000, age 50, stop at 60 and a partner');
    const ages = railFor(at(run(typedA(), set('a', 'stop.kind', 'ages')), 'a', 'answer')).steps[0];
    expect(ages.result.text).toBe('£250,000, age 50');
    const level = railFor(at(run(typedA(), set('a', 'spend.kind', 'level'), set('a', 'spend.level', 'moderate')), 'a', 'answer')).steps[0];
    expect(level.result.text).toBe('£250,000, age 50, stop at 60');
    expect(railFor(at(typedA(fresh(), { pot: 'abc' }), 'a', 'answer')).steps[0].result).toBe(null);
    // the numbers are done — and say so — before the spending is given
    const noSpend = railFor(at(typedA(fresh(), { spend: '' }), 'a', 'numbers'));
    expect(noSpend.steps[0].result.text).toBe('£250,000, age 50, stop at 60');
    expect(noSpend.steps.map((x) => [x.id, x.state])[1]).toEqual(['spend', 'open']);
  });
  it('the spend step: the one figure the answer uses, as typed — or the level\'s figure', () => {
    const step = railFor(at(typedA(), 'a', 'answer')).steps[1];
    expect(step.id).toBe('spend');
    expect(step.state).toBe('done');
    expect(step.result.text).toBe('£2,000 a month');
    expect(step.result.id).toBe('a.rail.spend');
    expect(text(step)).toBe(step.result.text);
    const level = railFor(at(run(typedA(), set('a', 'spend.kind', 'level'), set('a', 'spend.level', 'moderate')), 'a', 'answer')).steps[1];
    expect(level.result.text).toBe(`Moderate level: ${money(2608)} a month`);
    expect(railFor(at(typedA(fresh(), { spend: '' }), 'a', 'answer')).steps[1].result).toBe(null);
    expect(railFor(at(typedB(), 'b', 'answer')).steps[1].result.text).toBe('£2,000 a month');
  });
  it('B\'s numbers: pot, age, what goes in, the stop', () => {
    const step = railFor(at(typedB(), 'b', 'answer')).steps[0];
    expect(step.result.text).toBe('£180,000, age 45, £700 a month in, stop at 60');
    expect(text(step)).toBe(step.result.text);
    const split = railFor(at(run(typedB(fresh(), { payIn: '' }), set('b', 'you.payIn.kind', 'split'), set('b', 'you.payIn.own', '500'), set('b', 'you.payIn.employer', '200')), 'b', 'answer')).steps[0];
    expect(split.result.text).toBe('£180,000, age 45, stop at 60');
  });
  it('A\'s answer: the verdict and the age', () => {
    const s = at(typedA(), 'a', 'answer');
    const words = (r) => railFor(answered(s, 'a', r)).steps[2].result.text;
    expect(words(resultA({ verdict: 'yes' }))).toBe('Yes at 60');
    expect(words(resultA({ verdict: 'close' }))).toBe('Close at 60');
    expect(words(resultA({ verdict: 'no' }))).toBe('Not at 60');
    expect(words(resultA({ kind: 'earliest', verdict: 'yes', age: 61 }))).toBe('Earliest that worked: 61');
    for (const r of [resultA({ verdict: 'yes' }), resultA({ kind: 'earliest', verdict: 'yes', age: 61 })]) {
      const step = railFor(answered(s, 'a', r)).steps[2];
      expect(text(step)).toBe(step.result.text);
      expect(step.result.id).toBe('a.rail.answer');
    }
    expect(railFor(answered(s, 'a', resultA({ status: 'none', kind: 'nothing' }))).steps[2].result).toBe(null);
    expect(railFor(reduce(answered(s, 'a', resultA()), set('a', 'you.pot', '1'))).steps[2].result).toBe(null);
  });
  it('A\'s ages step: the earliest age that worked, once every age is there', () => {
    const s = answered(at(typedA(), 'a', 'ages'), 'a', resultA());
    expect(railFor(s).steps[3].result).toBe(null);
    const ext = reduce(s, { type: A.ANSWER_EXTEND, q: 'a', inputsKey: currentKey(s, 'a') });
    const done = reduce(ext, { type: A.ANSWER_FINAL, q: 'a', inputsKey: currentKey(s, 'a'), result: resultA({ detail: 'all', earliestYes: 62 }) });
    const step = railFor(done).steps[3];
    expect(step.result.text).toBe('Earliest that worked: 62');
    expect(text(step)).toBe(step.result.text);
    expect(railFor(reduce(ext, { type: A.ANSWER_FINAL, q: 'a', inputsKey: currentKey(s, 'a'), result: resultA({ detail: 'all', earliestYes: null }) })).steps[3].result).toBe(null);
  });
  it('B\'s answer: what to pay in (the answer), or on course; the number by the age only when there is no pay-in to name', () => {
    const s = at(typedB(), 'b', 'answer');
    const step = railFor(answered(s, 'b', resultB({ careful: 470000 }))).steps[2];
    expect(step.result.text).toBe('About £1,050 a month in');
    expect(step.result.parts).toEqual(['About ', { key: 'payIn.needed', kind: 'money' }, ' a month in']);
    expect(text(step)).toBe(step.result.text);
    const noPayIn = { ...resultB({ careful: 470000 }), payIn: { now: 700, needed: null } };
    expect(railFor(answered(s, 'b', noPayIn)).steps[2].result.text).toBe('About £470,000 by 60');
    expect(railFor(answered(s, 'b', resultB({ onCourse: true }))).steps[2].result.text).toBe('On course for 60');
    expect(railFor(answered(s, 'b', { ...resultB({ status: 'out-of-reach', careful: null }), payIn: { now: 700, needed: null } })).steps[2].result).toBe(null);
  });
  it('with the stub answers\' own results', () => {
    for (const [q, s] of [['a', at(typedA(), 'a', 'answer')], ['b', at(typedB(), 'b', 'answer')]]) {
      const real = ANSWERS[q].answer(parsedDraft(s, q).inputs, { today: TODAY, futures: 40, seed: 0, trace: false });
      const step = railFor(answered(s, q, real)).steps[2];
      expect(step.result, q).not.toBe(null);
      expect(text(step)).toBe(step.result.text);
    }
  });
  it('the local formatters agree with format.js', () => {
    for (const n of [0, 1, 999, 1000, 30000, 250000, 1073100, 10000000]) {
      expect(railFor(at(typedA(fresh(), { pot: String(n) }), 'a', 'answer')).steps[0].result.text.startsWith(`${money(n)}, age 50`)).toBe(true);
    }
    for (const n of [499, 500, 1000, 468250, 470000, 4999999]) {
      const step = railFor(answered(at(typedB(), 'b', 'answer'), 'b', { ...resultB({ careful: n }), payIn: { now: 700, needed: null } })).steps[2];
      expect(step.result.text).toBe(`About ${pot(n)} by 60`);
    }
    for (const n of [1, 999, 1000, 1050, 12345]) {
      const step = railFor(answered(at(typedB(), 'b', 'answer'), 'b', { ...resultB(), payIn: { now: 700, needed: n } })).steps[2];
      expect(step.result.text).toBe(`About ${money(n)} a month in`);
    }
  });
});

// ---- L8, generated states and walks across the three questions ---------------------------------------------------

const RETIRED_BANNED = [/\bstop(ping)? work/i, /\bretire/i, /\bto go\b/i, /\b\d+\s+(months?|years?)\b/i, /\bbridge\b/i, /\bstop at\b/i, /\buntil you\b/i, /\bwhen you stop\b/i];
const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;

describe('L8 — the wrong person is never sent the wrong way', () => {
  it('a retired person: the retired sentence first, no stop-work words on the rail, a way to D', () => {
    for (const q of ['a', 'b']) {
      for (const age of ['67', '70', '75']) {
        const s = (q === 'a' ? typedA : typedB)(fresh(), { age, stop: age });
        for (const step of BUILT[q].steps) {
          const rail = railFor(at(s, q, step.id));
          expect(rail.next.id).toBe(`${q}.retired`);
          for (const x of rail.steps) if (x.result) for (const re of RETIRED_BANNED) expect(re.test(x.result.text), `"${x.result.text}" ${re}`).toBe(false);
        }
      }
    }
  });
  it('no countdown anywhere on A\'s or B\'s rail', () => {
    const states = [answered(at(typedA(), 'a', 'answer'), 'a', resultA()), answered(at(typedB(), 'b', 'answer'), 'b', resultB({ onCourse: true }))];
    for (const s of states) expect(JSON.stringify(railFor(s))).not.toMatch(COUNTDOWN);
  });
});

const ADDRESSES = ['#/', '#/a/numbers', '#/a/spend', '#/a/answer', '#/a/ages', '#/a/keep', '#/b/numbers', '#/b/spend', '#/b/answer', '#/b/choices', '#/b/keep',
  '#/c/numbers', '#/c/answer', '#/c/keep', '#/soon/d', '#/soon/a', '#/nowhere'];
const typedValue = fc.oneof(fc.constantFrom('', '250,000', 'abc', '45', '50', '60', '70', '17', '700', '2,000', 'couple', 'single', 'ages', 'age', 'level', 'moderate', 'split'), fc.boolean());
const fieldOf = fc.constantFrom(...Q).chain((q) => fc.constantFrom(...SCHEMAS[q].fields.map((f) => f.path)).map((p) => [q, p]));
const RESULTS = {
  a: [resultA({ verdict: 'yes' }), resultA({ verdict: 'close' }), resultA({ verdict: 'no' }), resultA({ kind: 'earliest', verdict: 'yes', age: 61 }),
    resultA({ kind: 'noneWorked', verdict: 'no', age: 75, earliestYes: null }), resultA({ detail: 'all' })],
  b: [resultB(), resultB({ onCourse: true }), resultB({ status: 'out-of-reach', careful: null }), resultB({ detail: 'grid' })],
  c: [{ status: 'ok', monthly: { careful: 1380 }, basis: {} }]
};
const stateAction = fc.oneof(
  { weight: 3, arbitrary: fc.constantFrom('fillA', 'fillB', 'fillC', 'retiredA', 'retiredB', 'spendlessA', 'spendlessB') },
  // the budget step: on to it, how the spending is chosen, the budget's total into the box
  fc.tuple(fc.constantFrom('a', 'b'), fc.constantFrom('onward', 'lines', 'one', 'use')).map(([q, what]) => (what === 'onward' ? { type: A.DRAFT_ONWARD, q }
    : what === 'use' ? { type: A.BUDGET_USE, q } : { type: A.SPEND_HOW, q, how: what })),
  // B's grid step with its grid in (the step's own next sentence), which a walk otherwise reaches only by a long chance
  { weight: 1, arbitrary: fc.constant('gridB') },
  // "Save this as a plan?" with an answer for what is typed (its own next sentence)
  { weight: 1, arbitrary: fc.constantFrom('keepA', 'keepB') },
  { weight: 2, arbitrary: fc.constantFrom('a', 'b').map((q) => ({ q, what: 'workThenFail', i: 0 })) },
  { weight: 3, arbitrary: fc.tuple(fc.constantFrom('a', 'b'), fc.nat(5)).map(([q, i]) => ({ q, what: 'answerWith', i })) },
  fc.constantFrom(...ADDRESSES).map((address) => ({ type: A.ROUTE_SET, route: parse(address) })),
  fc.tuple(fieldOf, typedValue).map(([[q, path], value]) => set(q, path, value)),
  fc.constantFrom(...Q).map((q) => ({ type: A.DRAFT_ASK, q })),
  fc.constantFrom(...Object.keys(CARRY)).map((k) => ({ type: A.DRAFT_CARRY, from: k[0], to: k[2] })),
  fc.tuple(fc.constantFrom(...Q), fc.constantFrom('working', 'first', 'final', 'failed', 'extend', 'retry', 'workThenFail'), fc.nat(5)).map(([q, what, i]) => ({ q, what, i }))
);
function apply(state, a) {
  if (a === 'fillA') return typedA(state);
  if (a === 'fillB') return typedB(state);
  if (a === 'fillC') return typedC(state);
  if (a === 'retiredA') return typedA(state, { age: '70', stop: '70' });
  if (a === 'retiredB') return typedB(state, { age: '70', stop: '70' });
  if (a === 'spendlessA') return typedA(state, { spend: '' });
  if (a === 'spendlessB') return typedB(state, { spend: '' });
  if (a === 'keepA' || a === 'keepB') {
    const q = a === 'keepA' ? 'a' : 'b';
    const there = reduce(state, { type: A.ROUTE_SET, route: parse(`#/${q}/keep`) });
    const key = currentKey(there, q);
    return key ? run(there, { type: A.ANSWER_WORKING, q, inputsKey: key }, { type: A.ANSWER_FINAL, q, inputsKey: key, result: RESULTS[q][0] }) : there;
  }
  if (a === 'gridB') {
    const there = reduce(state, { type: A.ROUTE_SET, route: parse('#/b/choices') });
    const key = currentKey(there, 'b');
    return key ? run(there, { type: A.ANSWER_WORKING, q: 'b', inputsKey: key }, { type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: resultB({ detail: 'grid' }) }) : there;
  }
  if (!a.what) return reduce(state, a);
  const { q, what, i } = a;
  const key = currentKey(state, q);
  const k = state.answers[q].inputsKey;
  const r = RESULTS[q][i % RESULTS[q].length];
  if (what === 'working') return key ? reduce(state, { type: A.ANSWER_WORKING, q, inputsKey: key }) : state;
  if (what === 'first') return reduce(state, { type: A.ANSWER_FIRST, q, inputsKey: k, result: r });
  if (what === 'final') return reduce(state, { type: A.ANSWER_FINAL, q, inputsKey: k, result: r });
  if (what === 'failed') return reduce(state, { type: A.ANSWER_FAILED, q, inputsKey: k });
  if (what === 'answerWith') return key ? run(state, { type: A.ANSWER_WORKING, q, inputsKey: key }, { type: A.ANSWER_FINAL, q, inputsKey: key, result: r }) : state;
  if (what === 'workThenFail') return key ? run(state, { type: A.ANSWER_WORKING, q, inputsKey: key }, { type: A.ANSWER_FAILED, q, inputsKey: key }) : state;
  if (what === 'extend') return q === 'c' ? state : reduce(state, { type: A.ANSWER_EXTEND, q, inputsKey: k });
  return reduce(state, { type: A.ANSWER_RETRY, q });
}

function checkRail(state) {
  const rail = railFor(state);
  if (state.route.screen !== 'step') {
    expect(rail).toEqual({ question: null, steps: [], position: null, next: null });
    return;
  }
  const q = state.route.q;
  expect(rail.question).toBe(q);
  const current = rail.steps.filter((s) => s.state === 'current');
  expect(current.map((s) => s.id)).toEqual([state.route.step]);
  expect(rail.position).toEqual({ n: BUILT[q].steps.findIndex((s) => s.id === state.route.step) + 1, of: BUILT[q].steps.length });
  expect(NEXT_ORDER[q].filter((id) => NEXT_RULES[q][id](state))[0]).toBe(rail.next.id);
  for (const s of rail.steps) {
    expect(parse(s.href)).toEqual(route('step', q, s.id));
    if (s.result) expect(s.result.text).toBe(partsText(s.result.parts, s.source));
  }
  if (q !== 'c') expect(JSON.stringify(rail)).not.toMatch(COUNTDOWN);
  expect(JSON.parse(JSON.stringify(rail))).toEqual(rail);
}

describe('every generated state, across the three questions', () => {
  it('has exactly one current step and exactly one next sentence, the first that matches', () => {
    fc.assert(fc.property(fc.array(stateAction, { maxLength: 25 }), (actions) => {
      let s = fresh();
      for (const a of actions) { s = apply(s, a); checkRail(s); expect(SCREENS).toContain(screenName(s.route)); }
    }), { numRuns: 400 });
  });
  it('every next sentence of A and B is reached by some state', () => {
    const seen = new Set();
    fc.assert(fc.property(fc.constantFrom('a', 'b'), fc.array(stateAction, { maxLength: 25 }), (q, actions) => {
      let s = at(fresh(), q, 'numbers');
      for (const a of actions) {
        s = apply(s, a);
        if (s.route.screen !== 'step' || s.route.q !== q) s = at(s, q, 'answer');
        seen.add(railFor(s).next.id);
      }
    }), { numRuns: 1500, seed: 20261001 });                             // a fixed seed: coverage, not luck
    for (const id of [...NEXT_A, ...NEXT_B]) expect(seen.has(id), id).toBe(true);
  });
});

describe('L7 — random walks that cross questions', () => {
  // Found by CI's random walk on 2 Oct 2026 (seed -1339068766): from A's spend step with the spending right but a
  // figure still missing from the numbers, "ask" opens the answer step (rule R3). The walk's model now knows the rule;
  // this exact walk is kept as a fixed case.
  const FOUND = [{ move: 'type', q: 'c', path: 'take', value: '60' }, { move: 'carry', from: 'c', to: 'a' }, { move: 'follow', n: 2 }, { move: 'ask', q: 'a' }, { move: 'follow', n: 0 }];
  const move = fc.oneof(
    fc.constantFrom(...ADDRESSES).map((address) => ({ move: 'open', address })),
    fc.nat(20).map((n) => ({ move: 'follow', n })),
    fc.constant({ move: 'back' }),
    fc.constantFrom(...Object.keys(CARRY)).map((k) => ({ move: 'carry', from: k[0], to: k[2] })),
    fc.tuple(fieldOf, typedValue).map(([[q, path], value]) => ({ move: 'type', q, path, value })),
    fc.constantFrom(...Q).map((q) => ({ move: 'ask', q })),
    fc.constant({ move: 'reload' })
  );
  const tidy = (address) => format(parse(address));

  it('the address names the current step; the rail holds; reload keeps every draft', () => {
    fc.assert(fc.property(fc.array(move, { minLength: 1, maxLength: 8 }), (moves) => {
      const pile = ['#/'];
      let state = fresh();
      const open = (address) => { state = goTo(state, address); pile.push(tidy(address)); };
      for (const m of moves) {
        if (m.move === 'open') open(m.address);
        else if (m.move === 'follow') { const links = linksFrom(state); open(links[m.n % links.length]); }
        else if (m.move === 'back') { if (pile.length > 1) { pile.pop(); state = goTo(state, pile[pile.length - 1]); } }
        else if (m.move === 'carry') {
          state = reduce(state, { type: A.DRAFT_CARRY, from: m.from, to: m.to });
          if (format(state.route) !== pile[pile.length - 1]) pile.push(format(state.route));
        } else if (m.move === 'type') state = reduce(state, set(m.q, m.path, m.value));
        else if (m.move === 'ask') {
          // Rule R3 (reduce.js DRAFT_ASK): on A's or B's spend step, a spending with nothing wrong opens the answer step,
          // which then asks for anything else still missing — never a bounce back to the numbers step.
          const parsed = parsedDraft(state, m.q);
          const onSpend = SPEND_STEP[m.q] && state.route.screen === 'step' && state.route.q === m.q && state.route.step === 'spend';
          const ok = parsed.ok || (onSpend && !Object.keys(parsed.errors).some(isSpendPath));
          state = reduce(state, { type: A.DRAFT_ASK, q: m.q });
          const there = href.step(m.q, 'answer');
          if (ok && pile[pile.length - 1] !== there) pile.push(there);
        } else if (m.move === 'reload') {
          const kept = JSON.parse(JSON.stringify(state.draft));
          const again = goTo(initialState({ today: TODAY, build: 'test', draft: kept }), pile[pile.length - 1]);
          expect(again.draft).toEqual(state.draft);
          for (const q of Q) expect(again.answers[q].status).toBe('idle');
          state = again;
        }
        expect(format(state.route)).toBe(pile[pile.length - 1]);
        expect(format(state.route).replace(/\?focus=[A-Za-z.]+$/, '')).not.toMatch(/\d/);
        expect(SCREENS).toContain(screenName(state.route));
        checkRail(state);
      }
    }), { numRuns: 500, examples: [[FOUND]] });
  });
});

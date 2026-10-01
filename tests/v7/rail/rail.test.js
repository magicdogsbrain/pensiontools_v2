/**
 * The rail, tested as data (test plan section 6, L1–L8, as the build brief 4.7 and section 6 amend them).
 *
 *  L1 every step can be reached            L5 nothing demands another tool first
 *  L2 no dead ends                          L6 questions not built yet are honest
 *  L3 links point somewhere                 L7 random walks of 8 moves
 *  L4 addresses work both ways              L8 the wrong person is never sent the wrong way
 *
 * Labels are words and live in src/v7/copy/ (package 4); the checks on them are in tests/v7/wording/. Here the rail
 * is checked as data: the steps, their states, their links, and the one next sentence.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { railFor, frontDoor, NEXT } from '../../../src/v7/rail/index.js';
import { QUESTIONS, BUILT } from '../../../src/v7/rail/questions.js';
import { QUESTION_C, NEXT_C } from '../../../src/v7/rail/c.js';
import { parse, format, href, screenName } from '../../../src/v7/router/routes.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { currentKey, parsedDraft } from '../../../src/v7/state/select.js';
import { A, ACTION_TYPES } from '../../../src/v7/state/actions.js';
import { partsText, money } from '../../../src/answers/shared/format.js';
import { SCHEMA_C, answerC, TEST_ENV } from '../c/_c.js';
import { fresh, run, set, typed, route, result, onAnswer, TODAY } from '../shell/_shell.js';

const at = (state, step) => reduce(state, { type: A.ROUTE_SET, route: route('step', 'c', step) });
const answered = (s, kind = A.ANSWER_FINAL, r = result()) => {
  const key = currentKey(s, 'c');
  return run(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key }, { type: kind, q: 'c', inputsKey: key, result: r });
};
const STEP_IDS = QUESTION_C.steps.map((s) => s.id);
const SCREENS = ['front', 'c.numbers', 'c.answer', 'soon', 'notBuilt', 'a.numbers', 'a.answer', 'a.ages', 'b.numbers', 'b.answer', 'b.choices'];
/** Joined up (step 4): A, B and C are open; D, E and F are "not in the preview yet". A's and B's rails are checked in rail.ab.test.js. */
const SOON = ['d', 'e', 'f'];
const STEPS_OF = (q) => BUILT[q].steps.map((s) => href.step(q, s.id));

/** The declared links out of a place: what the screens draw as ordinary links. */
function linksFrom(state) {
  const r = state.route;
  if (r.screen === 'front' || r.screen === 'notFound') return frontDoor().map((q) => q.href);
  if (r.screen === 'soon') return [href.front()];
  const rail = railFor(state);
  const links = [href.front(), ...rail.steps.map((s) => s.href)];
  if (rail.next.button && rail.next.button.href) links.push(rail.next.button.href);
  return links;
}
const goTo = (state, address) => reduce(state, { type: A.ROUTE_SET, route: parse(address) });

describe('the tables', () => {
  it('question C has the four steps of the brief, in order', () => {
    expect(STEP_IDS).toEqual(['numbers', 'answer', 'ways', 'keep']);
    expect(QUESTION_C.steps.map((s) => s.optional)).toEqual([false, false, true, true]);
    expect(QUESTION_C.steps.map((s) => s.built)).toEqual([true, true, false, false]);
  });
  it('the front door has six questions, and A, B and C are built', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(QUESTIONS.filter((q) => q.built).map((q) => q.id)).toEqual(['a', 'b', 'c']);
    expect(Object.keys(BUILT)).toEqual(['a', 'b', 'c']);
  });
  it('every "needs" names a field of the input list, or the answer', () => {
    const paths = new Set(SCHEMA_C.fields.map((f) => f.path));
    for (const s of QUESTION_C.steps) for (const n of s.needs) expect(n === 'answer' || paths.has(n), n).toBe(true);
  });
  it('the next sentences are tried in the order of the brief', () => {
    expect(NEXT_C).toEqual(['c.failed', 'c.working', 'c.blank', 'c.fix', 'c.ready', 'c.answered']);
    expect(Object.keys(NEXT).sort()).toEqual([...NEXT_C].sort());
  });
});

describe('L1 — every step can be reached from the front door', () => {
  it('a search over the declared links visits every step of every built question and every "soon" screen', () => {
    const seen = new Set();
    const queue = [href.front()];
    while (queue.length) {
      const address = queue.shift();
      if (seen.has(address)) continue;
      seen.add(address);
      for (const link of linksFrom(goTo(fresh(), address))) queue.push(link);
    }
    const wanted = [href.front(), ...STEPS_OF('a'), ...STEPS_OF('b'), ...STEPS_OF('c'), ...SOON.map((q) => href.soon(q))];
    expect([...seen].sort()).toEqual(wanted.sort());
  });
});

describe('L2 — no dead ends', () => {
  it('every step is the end of its question or has a next step; exactly the last is the end', () => {
    QUESTION_C.steps.forEach((s, i) => expect(s.end).toBe(i === QUESTION_C.steps.length - 1));
  });
  it('every place has a way on, and a way back to the front door', () => {
    const places = [href.front(), '#/not-found', ...STEP_IDS.map((s) => href.step('c', s)), ...SOON.map((q) => href.soon(q))];
    for (const address of places) {
      const links = linksFrom(goTo(fresh(), address));
      expect(links.length, address).toBeGreaterThan(0);
      if (parse(address).screen === 'step' || parse(address).screen === 'soon') expect(links, address).toContain(href.front());
    }
  });
});

describe('L3 — links point somewhere', () => {
  it('every link is an address that is understood, and draws a screen that exists', () => {
    const states = [fresh(), typed(), answered(onAnswer(typed()))];
    for (const base of states) {
      for (const address of [href.front(), ...STEP_IDS.map((s) => href.step('c', s)), href.soon('d')]) {
        for (const link of linksFrom(goTo(base, address))) {
          const r = parse(link);
          expect(r.screen, link).not.toBe('notFound');
          expect(format(r)).toBe(link);
          expect(SCREENS).toContain(screenName(r));
        }
      }
    }
  });
  it('a button on the next sentence is a link or an action the reducer knows', () => {
    const states = [at(fresh(), 'numbers'), at(typed(), 'numbers'), answered(onAnswer(typed())),
      run(onAnswer(typed()), { type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' }, { type: A.ANSWER_FAILED, q: 'c', inputsKey: 'K' })];
    const withButton = states.map((s) => railFor(s).next.button).filter(Boolean);
    expect(withButton.length).toBe(3);
    for (const b of withButton) {
      expect(typeof b.labelId).toBe('string');
      expect(('href' in b) !== ('action' in b)).toBe(true);
      if (b.action) expect(ACTION_TYPES).toContain(b.action.type);
    }
  });
});

describe('L4 — addresses work both ways', () => {
  it('for every step', () => {
    for (const s of QUESTION_C.steps) {
      const r = route('step', 'c', s.id);
      expect(parse(format(r))).toEqual(r);
      expect(format(parse(format(r)))).toBe(format(r));
    }
  });
  it('the address of a saved plan is reserved: it resolves to the front door', () => {
    for (const s of STEP_IDS) {
      expect(parse(`#/plan/abc/c/${s}`).screen).toBe('notFound');
      expect(screenName(parse(`#/plan/abc/c/${s}`))).toBe('front');
    }
    expect(format({ ...route('step', 'c', 'answer'), planId: 'abc' })).toBe('#/c/answer');
  });
  it('no figure in any step link, whatever has been typed', () => {
    const s = answered(onAnswer(run(typed('1234567', '61'), set('household', 'couple'), set('partner.age', '59'), set('partner.pot', '7654321'))));
    const rail = railFor(s);
    for (const step of rail.steps) expect(step.href).not.toMatch(/\d/);
    if (rail.next.button && rail.next.button.href) expect(rail.next.button.href).not.toMatch(/\d/);
  });
});

describe('L5 — nothing demands another tool first', () => {
  it.each(STEP_IDS)('#/c/%s opened with nothing entered is that step, with the sentence that asks for two numbers', (step) => {
    const s = goTo(fresh(), href.step('c', step));
    expect(s.route).toEqual(route('step', 'c', step));
    const rail = railFor(s);
    expect(rail.steps.find((x) => x.state === 'current').id).toBe(step);
    expect(rail.next.id).toBe('c.blank');
    expect(rail.next.button).toBe(null);
    expect(rail.steps.every((x) => x.result === null)).toBe(true);
  });
  it('no step is ever blocked: every step has a link in every state', () => {
    for (const s of [fresh(), at(fresh(), 'numbers'), at(typed('abc', ''), 'answer'), answered(onAnswer(typed()))]) {
      const rail = railFor(at(s, 'numbers'));
      expect(rail.steps.map((x) => x.href)).toEqual(STEP_IDS.map((id) => href.step('c', id)));
      for (const x of rail.steps) expect(['current', 'done', 'open']).toContain(x.state);
    }
  });
});

describe('L6 — questions not built yet are honest', () => {
  it('D, E and F lead to the "not in the preview yet" screen, which has a way on', () => {
    const door = frontDoor();
    expect(door.map((q) => q.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    for (const q of door.filter((x) => !x.built)) {
      expect(q.href).toBe(`#/soon/${q.id}`);
      const s = goTo(fresh(), q.href);
      expect(s.route).toEqual(route('soon', q.id));
      expect(screenName(s.route)).toBe('soon');
      expect(linksFrom(s)).toContain(href.front());
    }
    expect(door.filter((x) => !x.built).length).toBe(3);
  });
  it('C leads to its first step', () => {
    expect(frontDoor().find((q) => q.id === 'c')).toEqual({ id: 'c', built: true, href: '#/c/numbers' });
  });
  it('an unbuilt step of C opens the "not in the preview yet" screen and keeps its place on the rail', () => {
    for (const step of ['ways', 'keep']) {
      const s = goTo(answered(onAnswer(typed())), href.step('c', step));
      expect(screenName(s.route)).toBe('notBuilt');
      const rail = railFor(s);
      expect(rail.steps.find((x) => x.state === 'current').id).toBe(step);
      expect(rail.steps.find((x) => x.id === 'answer').href).toBe('#/c/answer');     // the link back to the answer
    }
  });
});

describe('railFor — the shape of 4.7', () => {
  it('away from a question there is no rail', () => {
    for (const r of [route('front'), route('soon', 'a'), route('notFound')]) {
      const rail = railFor(reduce(typed(), { type: A.ROUTE_SET, route: r }));
      expect(rail).toEqual({ question: null, steps: [], position: null, next: null });
    }
  });
  it('nothing entered, on the numbers step', () => {
    const rail = railFor(at(fresh(), 'numbers'));
    expect(rail.question).toBe('c');
    expect(rail.position).toEqual({ n: 1, of: 4 });
    expect(rail.steps.map((s) => [s.id, s.state, s.optional, s.built, s.href])).toEqual([
      ['numbers', 'current', false, true, '#/c/numbers'],
      ['answer', 'open', false, true, '#/c/answer'],
      ['ways', 'open', true, false, '#/c/ways'],
      ['keep', 'open', true, false, '#/c/keep']
    ]);
    expect(rail.next).toEqual({ id: 'c.blank', button: null });
  });
  it('the next sentence, state by state (first match wins)', () => {
    const next = (s) => railFor(s).next.id;
    expect(next(at(fresh(), 'numbers'))).toBe('c.blank');
    expect(next(at(typed('250000', ''), 'numbers'))).toBe('c.blank');
    expect(next(at(typed('', '58'), 'numbers'))).toBe('c.blank');
    expect(next(at(typed('abc', '58'), 'numbers'))).toBe('c.fix');
    expect(next(at(typed('250000', '17'), 'numbers'))).toBe('c.fix');
    expect(next(at(run(typed(), set('household', 'couple')), 'numbers'))).toBe('c.fix');      // the partner's age is missing
    expect(next(at(typed(), 'numbers'))).toBe('c.ready');
    expect(next(onAnswer(typed()))).toBe('c.working');                                          // a run is on its way
    const key = currentKey(typed(), 'c');
    const w = reduce(onAnswer(typed()), { type: A.ANSWER_WORKING, q: 'c', inputsKey: key });
    expect(next(w)).toBe('c.working');
    const f = reduce(w, { type: A.ANSWER_FIRST, q: 'c', inputsKey: key, result: result() });
    expect(next(f)).toBe('c.working');                                                          // the final pass is still running
    expect(next(reduce(f, { type: A.ANSWER_FINAL, q: 'c', inputsKey: key, result: result() }))).toBe('c.answered');
    expect(next(reduce(w, { type: A.ANSWER_FAILED, q: 'c', inputsKey: key }))).toBe('c.failed');
    // An answer for other figures is not "answered".
    expect(next(at(reduce(answered(onAnswer(typed())), set('you.pot', '300000')), 'numbers'))).toBe('c.ready');
  });
  it('the buttons', () => {
    expect(railFor(at(typed(), 'numbers')).next.button).toEqual({ labelId: 'c.action.show', action: { type: A.DRAFT_ASK, q: 'c' } });
    const failed = run(onAnswer(typed()), { type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' }, { type: A.ANSWER_FAILED, q: 'c', inputsKey: 'K' });
    expect(railFor(failed).next.button).toEqual({ labelId: 'c.action.retry', action: { type: A.ANSWER_RETRY, q: 'c' } });
    expect(railFor(answered(onAnswer(typed()))).next.button).toEqual({ labelId: 'c.action.keep', href: '#/c/keep' });
    // Pressing the button does what the sentence says.
    const pressed = reduce(at(typed(), 'numbers'), railFor(at(typed(), 'numbers')).next.button.action);
    expect(pressed.route.step).toBe('answer');
  });
  it('position follows the step', () => {
    STEP_IDS.forEach((id, i) => expect(railFor(at(fresh(), id)).position).toEqual({ n: i + 1, of: 4 }));
  });
});

describe('the short results — the person\'s own numbers, and only numbers the answer produced (rule R8)', () => {
  const text = (step) => partsText(step.result.parts, step.source);

  it('numbers: what was typed', () => {
    const step = railFor(at(typed('£250,000', '58'), 'answer')).steps[0];
    expect(step.state).toBe('done');
    expect(step.result.text).toBe('£250,000, age 58');
    expect(step.result.id).toBe('c.rail.numbers');
    expect(step.result.parts).toEqual([{ key: 'inputs.you.pot', kind: 'money' }, ', age ', { key: 'inputs.you.age', kind: 'age' }]);
    expect(text(step)).toBe(step.result.text);
  });
  it('numbers, for two', () => {
    const s = at(run(typed('250000', '62'), set('household', 'couple'), set('partner.age', '60')), 'answer');
    const step = railFor(s).steps[0];
    expect(step.result.text).toBe('£250,000, age 62 and a partner');
    expect(text(step)).toBe(step.result.text);
  });
  it('numbers, still paying in: what goes in each month, as typed (the two parts, or one figure)', () => {
    const split = at(run(typed('275000', '55'), set('you.payIn.has', 'yes'), set('you.payIn.own', '500'), set('you.payIn.employer', '300')), 'answer');
    const step = railFor(split).steps[0];
    expect(step.result.text).toBe('£275,000, age 55, £500 + £300 a month in');
    expect(text(step)).toBe(step.result.text);
    const one = at(run(typed('275000', '55'), set('you.payIn.has', 'yes'), set('you.payIn.kind', 'total'), set('you.payIn.total', '800')), 'answer');
    expect(railFor(one).steps[0].result.text).toBe('£275,000, age 55, £800 a month in');
    const no = at(run(typed('275000', '55'), set('you.payIn.has', 'no')), 'answer');
    expect(railFor(no).steps[0].result.text).toBe('£275,000, age 55');
  });
  it('numbers: nothing while the figures cannot be used', () => {
    expect(railFor(at(typed('abc', '58'), 'answer')).steps[0].result).toBe(null);
    expect(railFor(at(fresh(), 'answer')).steps[0].result).toBe(null);
  });
  it('answer: the careful amount, from the result', () => {
    const step = railFor(answered(onAnswer(typed()), A.ANSWER_FINAL, result(1380))).steps[1];
    expect(step.result.text).toBe('about £1,380 a month');
    expect(step.result.id).toBe('c.rail.answer');
    expect(step.result.parts).toEqual(['about ', { key: 'monthly.careful', kind: 'money' }, ' a month']);
    expect(text(step)).toBe(step.result.text);
    expect(step.source.monthly.careful).toBe(1380);
  });
  it('answer: with the answer function\'s own result (the stub until the real one lands)', () => {
    const s = onAnswer(typed());
    const real = answerC(parsedDraft(s, 'c').inputs, { ...TEST_ENV, today: TODAY });
    const step = railFor(answered(s, A.ANSWER_FINAL, real)).steps[1];
    expect(step.result.text).toBe(`about ${money(real.monthly.careful)} a month`);
    expect(text(step)).toBe(step.result.text);
  });
  it('answer: a first figure is shown, but the step is not done until it is final', () => {
    const s = at(answered(onAnswer(typed()), A.ANSWER_FIRST, result(1370)), 'numbers');
    const step = railFor(s).steps[1];
    expect(step.state).toBe('open');
    expect(step.result.text).toBe('about £1,370 a month');
  });
  it('answer: never a figure for other inputs, a failed run, or no amount at all', () => {
    const done = answered(onAnswer(typed()));
    expect(railFor(reduce(done, set('you.pot', '300000'))).steps[1].result).toBe(null);
    const key = currentKey(typed(), 'c');
    const failed = run(done, { type: A.ANSWER_RETRY, q: 'c' }, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key }, { type: A.ANSWER_FAILED, q: 'c', inputsKey: key });
    expect(railFor(failed).steps[1].result).toBe(null);
    expect(railFor(answered(onAnswer(typed()), A.ANSWER_FINAL, { status: 'none' })).steps[1].result).toBe(null);
    expect(railFor(reduce(onAnswer(typed()), { type: A.ANSWER_WORKING, q: 'c', inputsKey: key })).steps[1].result).toBe(null);
  });
  it('the local formatter agrees with format.js for every size of pot', () => {
    for (const pot of [0, 1, 999, 1000, 30000, 250000, 1073100, 10000000]) {
      const step = railFor(at(typed(String(pot), '58'), 'answer')).steps[0];
      expect(step.result.text).toBe(`${money(pot)}, age 58`);
      expect(text(step)).toBe(step.result.text);
    }
  });
});

// ---- generated states and random walks --------------------------------------------------------------------------

const paths = SCHEMA_C.fields.map((f) => f.path);
const typedValue = fc.oneof(fc.constantFrom('', '250,000', '£1', 'abc', '58', '67', '0', '30000', '17', '101', 'couple', 'single', 'forecast', 'age', 'now', 'none'), fc.boolean());
const ADDRESSES = ['#/', '', '#/c/numbers', '#/c/answer', '#/c/ways', '#/c/keep', '#/soon/a', '#/soon/f', '#/c/numbers?focus=you.age',
  '#/plan/abc/c/answer', '#/soon/c', '#/nowhere'];

/** Checks that hold in every state. */
function checkRail(state) {
  const rail = railFor(state);
  if (state.route.screen !== 'step') {
    expect(rail).toEqual({ question: null, steps: [], position: null, next: null });
    return;
  }
  expect(rail.question).toBe(state.route.q);
  if (state.route.q !== 'c') return;                                 // A's and B's rails: rail.ab.test.js
  const current = rail.steps.filter((s) => s.state === 'current');
  expect(current.length).toBe(1);                                   // exactly one "you are here"
  expect(current[0].id).toBe(state.route.step);
  expect(current[0].href).toBe(format({ ...state.route, focus: null }));
  expect(rail.position).toEqual({ n: STEP_IDS.indexOf(state.route.step) + 1, of: STEP_IDS.length });
  expect(NEXT_C.filter((id) => id === rail.next.id).length).toBe(1);   // exactly one next sentence
  expect(NEXT_C.filter((id) => NEXT[id](state)).indexOf(rail.next.id)).toBe(0);   // and it is the first that matches
  for (const s of rail.steps) {
    expect(['current', 'done', 'open']).toContain(s.state);
    expect(parse(s.href)).toEqual(route('step', 'c', s.id));
    if (s.result) {
      expect(s.result.text).toBe(partsText(s.result.parts, s.source));
      expect(typeof s.result.id).toBe('string');
    }
  }
  expect(JSON.parse(JSON.stringify(rail))).toEqual(rail);           // plain data
}

const stateAction = fc.oneof(
  { weight: 3, arbitrary: fc.constant('fill') },                     // the two figures, typed properly
  fc.constantFrom(...ADDRESSES).map((address) => ({ type: A.ROUTE_SET, route: parse(address) })),
  fc.tuple(fc.constantFrom(...paths), typedValue).map(([path, value]) => set(path, value)),
  fc.constant({ type: A.DRAFT_ASK, q: 'c' }),
  fc.constant({ type: A.DRAFT_RESET, q: 'c' }),
  fc.constant('working'), fc.constant('first'), fc.constant('final'), fc.constant('failed'),
  fc.constant({ type: A.ANSWER_RETRY, q: 'c' })
);
/** 'working' and friends use the key of what is typed at that moment, as the runner would. */
function apply(state, a) {
  if (typeof a !== 'string') return reduce(state, a);
  if (a === 'fill') return run(state, set('you.pot', '250,000'), set('you.age', '58'), set('household', 'single'));
  const key = currentKey(state, 'c');
  if (a === 'working') return key ? reduce(state, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key }) : state;
  const k = state.answers.c.inputsKey;
  if (a === 'first') return reduce(state, { type: A.ANSWER_FIRST, q: 'c', inputsKey: k, result: result(1370) });
  if (a === 'final') return reduce(state, { type: A.ANSWER_FINAL, q: 'c', inputsKey: k, result: result(1380) });
  return reduce(state, { type: A.ANSWER_FAILED, q: 'c', inputsKey: k });
}

describe('every generated state', () => {
  it('has exactly one current step and exactly one next sentence', () => {
    fc.assert(fc.property(fc.array(stateAction, { maxLength: 25 }), (actions) => {
      let s = fresh();
      for (const a of actions) { s = apply(s, a); checkRail(s); }
    }), { numRuns: 400 });
  });
  it('every next sentence is reached by some state', () => {
    const seen = new Set();
    fc.assert(fc.property(fc.array(stateAction, { maxLength: 25 }), (actions) => {
      let s = at(fresh(), 'numbers');
      for (const a of actions) { s = apply(s, a); const rail = railFor(s); if (rail.next) seen.add(rail.next.id); }
    }), { numRuns: 400 });
    expect([...seen].sort()).toEqual([...NEXT_C].sort());
  });
});

describe('L7 — random walks of 8 moves, against a model of where you should be', () => {
  // The moves a person can make.
  const move = fc.oneof(
    fc.constantFrom(...ADDRESSES).map((address) => ({ move: 'open', address })),
    fc.nat(20).map((n) => ({ move: 'follow', n })),
    fc.constant({ move: 'back' }),
    fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f').map((q) => ({ move: 'question', q })),
    fc.tuple(fc.constantFrom('you.pot', 'you.age', 'household', 'partner.age', 'endAge', 'take'), typedValue).map(([path, value]) => ({ move: 'type', path, value })),
    fc.constant({ move: 'ask' }),
    fc.constant({ move: 'reload' })
  );
  const tidy = (address) => format(parse(address));

  it('the address names the current step, and exactly one step says "you are here"', () => {
    fc.assert(fc.property(fc.array(move, { minLength: 1, maxLength: 8 }), (moves) => {
      // The model: the pile of addresses the back button walks, and what has been typed.
      const model = { pile: ['#/'], typed: {} };
      let state = fresh();
      const open = (address) => {
        state = goTo(state, address);
        // An unknown address is tidied in place; a known one is a new entry.
        model.pile.push(tidy(address));
      };
      for (const m of moves) {
        if (m.move === 'open') open(m.address);
        else if (m.move === 'follow') { const links = linksFrom(state); open(links[m.n % links.length]); }
        else if (m.move === 'back') {
          if (model.pile.length > 1) { model.pile.pop(); state = goTo(state, model.pile[model.pile.length - 1]); }
        } else if (m.move === 'question') {
          state = goTo(state, href.front());
          model.pile.push('#/');
          open(frontDoor().find((q) => q.id === m.q).href);
        } else if (m.move === 'type') {
          state = reduce(state, set(m.path, m.value));
          model.typed[m.path] = m.value;
        } else if (m.move === 'ask') {
          const ok = parsedDraft(state, 'c').ok;
          state = reduce(state, { type: A.DRAFT_ASK, q: 'c' });
          if (ok && model.pile[model.pile.length - 1] !== '#/c/answer') model.pile.push('#/c/answer');
        } else if (m.move === 'reload') {
          // What the tab keeps is the draft; the address is still in the bar; the answer is gone.
          const kept = JSON.parse(JSON.stringify(state.draft));
          state = goTo(initialState({ today: TODAY, build: 'test', draft: kept }), model.pile[model.pile.length - 1]);
          expect(state.answers.c.status).toBe('idle');
        }
        // After every move:
        expect(format(state.route)).toBe(model.pile[model.pile.length - 1]);
        expect(state.draft.c.values).toEqual(model.typed);
        expect(SCREENS).toContain(screenName(state.route));
        checkRail(state);
        expect(format(state.route)).not.toMatch(/\d/);
      }
    }), { numRuns: 500 });
  });
});

describe('L8 — the wrong person is never sent the wrong way', () => {
  // The rules for someone already taking money (language guide 3.2, retired scope): no stop-work words, no length
  // of time still to wait, and none of the old app's names. Checked over every string the rail itself writes, in
  // every state; the labels in src/v7/copy/ are checked by the wording test.
  const RETIRED_BANNED = [/\bstop(ping)? work/i, /\bretire/i, /\bto go\b/i, /\b\d+\s+(months?|years?)\b/i, /\bbridge\b/i, /\brun-up\b/i,
    /\bplan year\b/i, /\bplan starts?\b/i, /decumulation/i, /\bguaranteed\b/i, /stress test/i, /decision tool/i, /\buntil you\b/i, /\bwhen you stop\b/i];

  const strings = (rail) => rail.steps.filter((s) => s.result).map((s) => s.result.text);

  it('no string on the rail is on the retired banned list, whatever the ages and start', () => {
    const seen = new Set();
    for (const age of ['18', '54', '57', '66', '68', '90', '100']) {
      for (const kind of ['now', 'age']) {
        for (const household of ['single', 'couple']) {
          let s = run(typed('250000', age), set('start.kind', kind), set('start.age', String(Math.min(100, Number(age) + 3))), set('household', household), set('partner.age', '70'));
          s = onAnswer(s);
          if (parsedDraft(s, 'c').ok) s = answered(s);
          for (const step of STEP_IDS) for (const t of strings(railFor(at(s, step)))) seen.add(t);
        }
      }
    }
    expect(seen.size).toBeGreaterThan(5);
    for (const t of seen) for (const re of RETIRED_BANNED) expect(re.test(t), `"${t}" matches ${re}`).toBe(false);
  });
  it('the rail never counts down: no step, in any state, carries a length of time', () => {
    const rail = railFor(answered(onAnswer(typed('250000', '68'))));
    expect(JSON.stringify(rail)).not.toMatch(/months? to go|years? to go|countdown/i);
  });
  it('the rail does not call the life-stage words of the old app (rule R9)', async () => {
    const { readFileSync, readdirSync } = await import('node:fs');
    for (const name of readdirSync('src/v7/rail')) {
      const src = readFileSync(`src/v7/rail/${name}`, 'utf8');
      expect(src, name).not.toMatch(/LifeStage|deriveStage|decisionEntryAllowed/);
    }
  });
});

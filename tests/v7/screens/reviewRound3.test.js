/**
 * The screens' side of the reviewers' findings after "still paying in" and one test everywhere were joined (1 Oct 2026);
 * the answers' side is tests/v7/cross/reviewRound3.test.js. Every screen here is held to checkScreen's rules too.
 *
 *   S2   C's answer when the years before a closed pension opens set the amount: the words of their own, no "About £190 a
 *        month" headline, and no figure in the rail; the form names the per-person rule in its own words for two people
 *   S6   C's first form, still paying in, "Start taking it" left alone: "From age" with the State Pension age, and a line
 *        that says why (the owner's most likely person)
 *   S13  C's form: a start past 75 while still paying in is refused on the start age, in words
 *   S17  C's dead end: "Make it last to age" before the start, the error inside "Add more detail" — pressing the button
 *        opens it and puts the keyboard in that box, with its sentence
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { renderScreen, answerC, SCHEMA_C } from '../c/_c.js';
import { checkScreen, visibleText } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { inputsKey } from '../../../src/v7/state/inputsKey.js';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { formView, errorText } from '../../../src/v7/components/Field.jsx';
import { C } from '../../../src/v7/copy/c.js';

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), `tests/v7/states/c/${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);

/** A C numbers state with these values typed. */
function numbers(values, { asked = false } = {}) {
  const state = load('numbers-blank');
  state.draft.c.values = { ...values };
  state.draft.c.asked = asked;
  return state;
}

/** A C answer state with the real answer worked out for what is typed (40 futures). */
function answered(values) {
  const state = load('answer-F1');
  state.draft.c.values = { ...values };
  const parsed = parseDraft(SCHEMA_C, state.draft.c.values, state.env);
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  const result = answerC(parsed.inputs, { today: state.env.today, futures: 40, seed: 0, trace: false });
  state.answers.c = { status: 'final', inputsKey: inputsKey(parsed.inputs, state.env), result, before: null, progress: null, slow: false };
  return state;
}

/** A live page: the real store and reducer, redrawn after every action, in the document (so focus works). */
function live(state) {
  const store = createStore({ ...state, env: { ...state.env, build: 'test' } }, reduce);
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  const dispatch = (a) => store.dispatch(a);
  const drawIt = (s) => act(() => { render(h(App, { state: s, dispatch }), root); });
  store.subscribe(drawIt);
  drawIt(store.getState());
  return { root, store, done: () => { render(null, root); root.remove(); } };
}

describe('S2 — the closed years set the amount', () => {
  const SMALL = { 'you.pot': '300,000', 'you.age': '50', savings: '5,000', 'start.kind': 'age', 'start.age': '55' };

  it('the answer is the words of their own, with both figures; no headline figure, no "pot used up"', () => {
    const state = answered(SMALL);
    const r = state.answers.c.result;
    expect(r.closedYears).toBeTruthy();
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-headline]')).toBe(null);
    const answer = visibleText(root.querySelector('[data-region="answer"]'));
    expect(answer).toContain(r.sentences.none.text);
    expect(answer).not.toContain(r.sentences.head.text);           // "About £190 a month" is not a headline here
    expect(root.querySelector('[data-warning-id="pot-used-before-state-pension"]')).toBe(null);
  });

  it('the rail carries no "about £190 a month" for it', () => {
    const state = answered(SMALL);
    const step = railFor(state).steps.find((s) => s.id === 'answer');
    expect(step.result).toBeFalsy();
  });

  it('two people, no pension open at the start and no savings: the form says so in words for two, naming your age then', () => {
    const state = numbers({ household: 'couple', 'you.pot': '0', 'you.age': '60', 'partner.age': '50', 'partner.pot': '300,000', 'start.kind': 'age', 'start.age': '62' }, { asked: true });
    const form = formView(state);
    expect(form.parsed.errors['start.age']).toBe('start-not-before-access');
    const f = SCHEMA_C.fields.find((x) => x.path === 'start.age');
    expect(errorText(form, f, 'start-not-before-access')).toBe('Your pensions cannot be touched before you are 67, and there are no savings to live on until then. Choose 67 or later, or add your savings under "Add more detail".');
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-error-for="c.start.age"]').textContent).toContain('before you are 67');
    // one person: the words as they were
    const single = formView(numbers({ 'you.pot': '250,000', 'you.age': '50', 'start.kind': 'age', 'start.age': '53' }, { asked: true }));
    expect(errorText(single, f, 'start-not-before-access')).toBe('You cannot normally take a pension before 57. Choose 57 or later.');
  });
});

describe('S6 — still paying in, "Start taking it" left alone', () => {
  it('55, £275,000, "Yes", £500 + £300: "From age" is chosen, the age box shows 67, and a line says why', () => {
    const state = numbers({ 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300' });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'c.start.kind.age').checked).toBe(true);
    expect(one(root, 'c.start.kind.now').checked).toBe(false);
    expect(one(root, 'c.start.age').getAttribute('placeholder')).toBe('67');
    expect(one(root, 'c.start.picked').textContent).toBe('As you are still paying in, we have started at your State Pension age, 67. Change it to the age you will stop paying in.');
  });

  it('the named state answer-paying-in-default: the same person, the start never touched, answered from 67', () => {
    const state = load('answer-paying-in-default');
    expect(state.draft.c.values['start.kind']).toBeUndefined();
    expect(state.draft.c.values['start.age']).toBeUndefined();
    const r = state.answers.c.result;
    expect(r.inputs.start).toEqual({ kind: 'age', age: 67 });
    expect(r.basis.startAge).toBe(67);
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-headline="monthly.careful"]')).not.toBe(null);
    expect(one(root, 'c.answer.payIn').textContent).toBe(r.sentences.payIn.text);
    // the same figure as the state with 67 typed
    expect(r.monthly).toEqual(load('answer-paying-in').answers.c.result.monthly);
  });

  it('not paying in, under the pension age: the line is the one it always was', () => {
    const state = numbers({ 'you.pot': '250,000', 'you.age': '50' });
    const root = renderScreen(state);
    expect(one(root, 'c.start.picked').textContent).toBe(C.numbers.tooYoung.replace(/\{age\}/g, '57'));
  });
});

describe('S13 — paying in is counted until 75', () => {
  it('74, paying in, from 85: the start age says why, in words', () => {
    const state = numbers({ 'you.pot': '100,000', 'you.age': '74', 'you.payIn.has': 'yes', 'you.payIn.own': '1,000', 'you.payIn.employer': '0', 'start.kind': 'age', 'start.age': '85' }, { asked: true });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-error-for="c.start.age"]').textContent).toBe(C.fields['start.age'].errors['pay-in-past-75']);
    expect(C.fields['start.age'].errors['pay-in-past-75']).toMatch(/until 75/);
    expect(C.fields['start.age'].errors['pay-in-past-75-partner']).toMatch(/Your partner would be over 75/);
  });
});

describe('S17 — "Make it last to age" before the start: never a dead end', () => {
  it('pressing "Show what it pays" opens "Add more detail" and puts the keyboard in the box, with its sentence', () => {
    const state = numbers({ 'you.pot': '100,000', 'you.age': '70', 'start.kind': 'age', 'start.age': '96' });
    state.route = { ...state.route, screen: 'step', q: 'c', step: 'numbers', focus: null };
    const page = live(state);
    try {
      expect(page.root.querySelector('#more-detail')).toBe(null);
      act(() => { one(page.root, 'c.action.show').click(); });
      expect(page.store.getState().ui.open).toContain('more');
      const box = one(page.root, 'c.endAge');
      expect(box).not.toBe(null);
      expect(document.activeElement).toBe(box);
      expect(page.root.querySelector('[data-error-for="c.endAge"]').textContent).toBe(C.fields.endAge.errors['end-after-start']);
      expect(one(page.root, 'c.action.moreDetail').getAttribute('aria-expanded')).toBe('true');
    } finally { page.done(); }
  });

  it('the reducer: asked with a problem inside more detail, the block opens; with none there, it stays as it was', () => {
    const bad = numbers({ 'you.pot': '100,000', 'you.age': '70', 'start.kind': 'age', 'start.age': '96' });
    expect(reduce(bad, { type: 'draft/ask', q: 'c' }).ui.open).toContain('more');
    const elsewhere = numbers({ 'you.pot': '100,000' });
    expect(reduce(elsewhere, { type: 'draft/ask', q: 'c' }).ui.open).not.toContain('more');
  });
});

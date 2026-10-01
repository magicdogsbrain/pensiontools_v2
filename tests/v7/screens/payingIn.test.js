/**
 * Question C gains "still paying in" on its first form (the owner's report, 1 Oct 2026: "tried a 55 year old testing
 * how much monthly income a £275,000 pot would produce at 67 — there is no way to add ongoing pension contributions.
 * This is the most likely situation!").
 *
 *   1  the form: per person, "Are you still paying into this pension?" on the first form (never under more detail);
 *      "Yes" opens "Your part, a month" and "Your employer's part, a month" inside it, the help saying the tax the
 *      government adds back is included; a couple's partner has their own
 *   2  what is typed reads back, and parses
 *   3  the owner's 55-year-old — £275,000, from 67, £500 + £300 a month — reaches a monthly figure from 67, and the
 *      answer says plainly what it assumed about the paying in
 *
 * The input list's paths are the answers' (SCHEMA_C: you.payIn.has / .own / .employer and partner.*); the screens draw
 * whatever the list holds, and every screen is held to checkScreen's rules.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, answerC, SCHEMA_C } from '../c/_c.js';
import { checkScreen, visibleText, expectedInputs, draw } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { inputsKey } from '../../../src/v7/state/inputsKey.js';
import { C } from '../../../src/v7/copy/c.js';

const load = (name) => JSON.parse(readFileSync(join(process.cwd(), `tests/v7/states/c/${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const field = (path) => SCHEMA_C.fields.find((f) => f.path === path);

/** The owner's 55-year-old, as typed: £275,000, money from 67, £500 of their own and £300 from the employer a month. */
const OWNER = {
  'you.pot': '275,000', 'you.age': '55', 'start.kind': 'age', 'start.age': '67',
  'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300'
};

/** A C numbers state with these values typed. */
function numbers(values) {
  const state = load('numbers-blank');
  state.draft.c.values = { ...values };
  return state;
}

/** A C answer state with the real answer worked out for what is typed (40 futures: quick, and the same rules). */
function answered(values, futures = 40) {
  const state = load('answer-F1');
  state.draft.c.values = { ...values };
  const parsed = parseDraft(SCHEMA_C, state.draft.c.values, state.env);
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  const result = answerC(parsed.inputs, { today: state.env.today, futures, seed: 0, trace: false });
  state.answers.c = { status: 'final', inputsKey: inputsKey(parsed.inputs, state.env), result, before: null, progress: null, slow: false };
  return state;
}

describe('1 — the input list has "still paying in" for each person (the answers\' paths)', () => {
  it('you.payIn.has is a no / yes question in your group, on the first form; your part and your employer\'s part are money inside "Yes"', () => {
    const has = field('you.payIn.has');
    expect(has).toBeTruthy();
    expect(has.type).toBe('choice');
    expect(has.options).toEqual(['no', 'yes']);
    expect(has.group).toBe('you');                               // never 'more': it is the most likely situation
    for (const p of ['you.payIn.own', 'you.payIn.employer']) {
      const f = field(p);
      expect(f, p).toBeTruthy();
      expect(f.type).toBe('money');
      expect(f.when['you.payIn.has'], p).toBe('yes');
    }
    for (const p of ['partner.payIn.has', 'partner.payIn.own', 'partner.payIn.employer']) {
      expect(field(p), p).toBeTruthy();
      expect(field(p).when.household, p).toBe('couple');
    }
  });
  it('every one of them has its words', () => {
    for (const p of ['you.payIn.has', 'you.payIn.own', 'you.payIn.employer', 'partner.payIn.has', 'partner.payIn.own', 'partner.payIn.employer']) {
      expect(C.fields[p] && C.fields[p].label, p).toBeTruthy();
    }
    expect(C.fields['you.payIn.own'].help).toMatch(/the tax the government adds back/);
    expect(C.fields['partner.payIn.own'].help).toMatch(/the tax the government adds back/);
  });
});

describe('2 — the first form', () => {
  it('nothing typed: the question is on the form, not yet answered (not answered is "not paying in"), no boxes for the amounts', () => {
    const state = numbers({});
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'c.you.payIn.has.no').checked).toBe(false);
    expect(one(root, 'c.you.payIn.has.yes').checked).toBe(false);
    expect(one(root, 'c.you.payIn.own')).toBe(null);
    expect(one(root, 'c.you.payIn.employer')).toBe(null);
    // on the short form's own form, not behind "Add more detail"
    expect(root.querySelector('#more-detail [data-field="you.payIn.has"]')).toBe(null);
    expect(root.querySelector('.person-you [data-field="you.payIn.has"]')).not.toBe(null);
  });

  it('"Yes": your part and your employer\'s part open inside the "Yes" option, each with its help', () => {
    const state = numbers({ 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes' });
    const root = renderScreen(state);
    clean(root, state);
    const yes = one(root, 'c.you.payIn.has.yes').closest('.option');
    for (const id of ['c.you.payIn.own', 'c.you.payIn.employer']) {
      const box = one(root, id);
      expect(box, id).not.toBe(null);
      expect(yes.contains(box), `${id} sits inside "Yes"`).toBe(true);
      expect(root.querySelector(`label[for="${id}"]`).textContent).toBe(C.fields[id.slice(2)].label);
    }
    expect(visibleText(root)).toContain(C.fields['you.payIn.own'].help);
    // each box appears once
    expect(root.querySelectorAll('[data-testid="c.you.payIn.own"]').length).toBe(1);
  });

  it('the boxes are exactly the ones the input list says apply (R7), and what is typed reads back (R8)', () => {
    const state = numbers(OWNER);
    const root = renderScreen(state);
    clean(root, state);
    expect(expectedInputs(state)).toContain('c.you.payIn.own');
    expect(one(root, 'c.you.payIn.own').value).toBe('500');
    expect(one(root, 'c.you.payIn.employer').value).toBe('300');
    expect(parseDraft(SCHEMA_C, state.draft.c.values, state.env).ok).toBe(true);
  });

  it('a couple: the partner has their own question and, on "Yes", their own two boxes', () => {
    const state = numbers({ ...OWNER, household: 'couple', 'partner.age': '53', 'partner.payIn.has': 'yes' });
    const root = renderScreen(state);
    clean(root, state);
    const partner = root.querySelector('.person-partner');
    for (const id of ['c.partner.payIn.has.yes', 'c.partner.payIn.own', 'c.partner.payIn.employer']) expect(partner.querySelector(`[data-testid="${id}"]`), id).not.toBe(null);
  });

  it('"Yes" with nothing typed, once asked: the box says what to type, in words', () => {
    const state = numbers({ 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes' });
    state.draft.c.asked = true;
    const root = renderScreen(state);
    clean(root, state);
    const errors = parseDraft(SCHEMA_C, state.draft.c.values, state.env).errors;
    for (const path of Object.keys(errors).filter((p) => p.startsWith('you.payIn.'))) {
      const shown = root.querySelector(`[data-error-for="c.${path}"]`);
      expect(shown, path).not.toBe(null);
      expect(shown.textContent).not.toMatch(/undefined|\{/);
    }
  });
});

describe('the named states of still paying in (tests/v7/states/c, at 1,000 futures as published)', () => {
  it('numbers-paying-in: the form with "Yes" open and the two parts typed', () => {
    const state = load('numbers-paying-in');
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'c.you.payIn.has.yes').checked).toBe(true);
    expect(one(root, 'c.you.payIn.own').value).toBe('500');
    expect(one(root, 'c.you.payIn.employer').value).toBe('300');
  });
  it('answer-paying-in: the monthly figure from 67, and what goes in until then said under it', () => {
    const state = load('answer-paying-in');
    const r = state.answers.c.result;
    const root = renderScreen(state);
    clean(root, state);
    expect(r.inputs.start).toEqual({ kind: 'age', age: 67 });
    expect(r.sentences.payIn.text).toMatch(/£800 a month/);
    expect(one(root, 'c.answer.payIn').textContent).toBe(r.sentences.payIn.text);
  });
});

describe('3 — the owner\'s 55-year-old reaches a monthly figure from 67', () => {
  it('the answer is the monthly figure from 67, with its sentence, and says what it assumed about the paying in', () => {
    const state = answered(OWNER);
    const r = state.answers.c.result;
    expect(r.status).toBe('ok');
    const root = renderScreen(state);
    clean(root, state);
    const head = root.querySelector('[data-headline="monthly.careful"]');
    expect(head).not.toBe(null);
    expect(head.querySelector('[data-key="monthly.careful"]').getAttribute('data-value')).toBe(String(r.monthly.careful));
    const answerText = visibleText(root.querySelector('[data-region="answer"]'));
    // what was assumed about the paying in is said plainly, on the answer: £800 a month, until 67, rising with prices
    expect(answerText).toContain('£800');
    expect(answerText).toMatch(/67/);
    expect(answerText).toMatch(/prices/);
    // never the old note that leaves out anything paid in between now and then
    expect(answerText).not.toMatch(/leaves out any growth, and anything you pay in/i);
  });

  it('what goes in until 67 is said in the headline, straight under the sentence; the pot by 67 after it', () => {
    const state = answered(OWNER);
    const r = state.answers.c.result;
    const root = renderScreen(state);
    const head = root.querySelector('[data-headline="monthly.careful"]');
    const pay = one(root, 'c.answer.payIn');
    expect(pay).not.toBe(null);
    expect(head.contains(pay)).toBe(true);
    expect(head.querySelector('[data-sentence="monthly.careful"]').nextElementSibling).toBe(pay);
    expect(pay.textContent).toBe(r.sentences.payIn.text);
    if (r.sentences.pot) expect(one(root, 'c.answer.pot').textContent).toBe(r.sentences.pot.text);
  });

  it('money from now (nothing to pay in before it starts): no paying-in line', () => {
    const root = renderScreen(load('answer-F1'));
    expect(one(root, 'c.answer.payIn')).toBe(null);
  });

  it('paying in raises what it pays from 67, against the same person paying nothing in', () => {
    const paying = answered(OWNER).answers.c.result;
    const none = answered({ ...OWNER, 'you.payIn.has': 'no' }).answers.c.result;
    expect(paying.monthly.careful).toBeGreaterThan(none.monthly.careful);
  });

  it('"Try a change" moves what goes in, £50 at a time (your part, the employer\'s left as typed); the button rests while worked out', () => {
    const state = answered(OWNER);
    const { root, actions } = draw(state);
    expect(one(root, 'c.try.payIn.up')).not.toBe(null);
    expect(root.querySelector('[data-typed="you.payIn.own"]').textContent).toBe('£500');
    one(root, 'c.try.payIn.up').click();
    one(root, 'c.try.payIn.down').click();
    expect(actions).toEqual([{ type: 'draft/set', q: 'c', path: 'you.payIn.own', value: '550' }, { type: 'draft/set', q: 'c', path: 'you.payIn.own', value: '450' }]);
    clean(root, state);
    // not paying in, or the money from now: no such row
    expect(one(renderScreen(load('answer-F1')), 'c.try.payIn.up')).toBe(null);
  });

  it('the hand-overs from C still open A and B', () => {
    const root = renderScreen(answered(OWNER));
    expect(one(root, 'c.next.a')).not.toBe(null);
    expect(one(root, 'c.next.b')).not.toBe(null);
  });
});

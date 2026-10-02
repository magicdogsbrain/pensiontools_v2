/**
 * Every named state drawn in jsdom and held to checkScreen's rules (test plan section 5; build brief section 6, P4),
 * then what each screen must show, what each control sends, the keyboard order, and the labels.
 *
 * The states are tests/v7/states/c/*.json, written by tests/v7/states/build-states.mjs.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, answerC, SCHEMA_C, get } from './_c.js';
import { checkScreen, draw, visibleText, expectedInputs } from '../render/checkScreen.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { money } from '../../../src/answers/shared/format.js';
import { ADVICE_SHORT, ADVICE_FULL, FRONT, SOON, NOT_BUILT } from '../../../src/v7/copy/common.js';
import { C } from '../../../src/v7/copy/c.js';
import { currentKey } from '../../../src/v7/state/select.js';

const DIR = join(process.cwd(), 'tests/v7/states/c');
const NAMES = [
  'front-door', 'numbers-blank', 'numbers-half-typed-with-an-error', 'numbers-couple-open', 'numbers-more-open',
  'answer-nothing-entered', 'answer-working', 'answer-first', 'answer-F1', 'answer-F2', 'answer-F3', 'answer-updating',
  'answer-take', 'answer-small-pot', 'answer-pensions-only', 'answer-pensions-only-later', 'answer-nothing', 'answer-assumed-open', 'answer-failed',
  'soon-d', 'not-built-ways', 'not-found',
  // still paying in (the owner's 55-year-old, 1 Oct 2026); the same with the start left alone; the closed years
  'numbers-paying-in', 'answer-paying-in', 'answer-paying-in-default', 'answer-closed-years',
  // a couple who stop work in different years: one stopped, from now; the other stopping next year (6.20.0, B1)
  'numbers-apart', 'answer-apart'
];
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const MADE = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/made-with.json'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type, init = {}) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true, ...init }));
const type = (el, text) => { el.value = text; fire(el, 'input'); };

/** C's "What next?" hand-over links to A and B (step 4 brief, conflict 46; CARRY_OPENS). */
const A_LINK = '#/a/numbers?focus=stop.age';
const B_LINK = '#/b/numbers?focus=you.payIn.total';

describe('the named states', () => {
  it('are exactly the ones the brief names', () => {
    expect(readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s survives JSON and is a whole state', (name) => {
    const s = load(name);
    expect(Object.keys(s).sort()).toEqual(['answers', 'draft', 'env', 'plan', 'route', 'session', 'ui']);
    expect(s.plan).toBe(null);
    expect(s.session).toEqual({ kind: 'none' });
    expect(s.env.today).toBe('2026-09-30');
  });

  it.each(NAMES)('%s passes every rule of checkScreen', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    expect(checkScreen(root, state)).toEqual([]);
  });

  it.each(NAMES)('%s: drawing it changes nothing in the state', (name) => {
    const state = load(name);
    const before = JSON.stringify(state);
    renderScreen(state);
    expect(JSON.stringify(state)).toBe(before);
  });

  it.each(NAMES)('%s: every number on screen carries the answer\'s own value', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    for (const el of root.querySelectorAll('[data-value]')) {
      const key = el.getAttribute('data-key');
      const from = key.startsWith('before.') ? state.answers.c : state.answers.c.result;
      expect(Number(el.getAttribute('data-value')), key).toBe(get(from, key));
    }
    expect(visibleText(root)).not.toMatch(/undefined|NaN|-£0|−£0/);
  });
});

describe('the states hold what the answer function gives today', () => {
  const pinned = NAMES.filter((n) => load(n).answers.c.result && !MADE.patched.includes(n));
  it('there are pinned answers to check', () => expect(pinned.length).toBeGreaterThan(3));
  it.each(pinned)('%s', (name) => {
    const state = load(name);
    const result = state.answers.c.result;
    // The answer on screen belongs to the inputs it was worked out from (answer-updating shows the one before).
    const fresh = answerC(result.inputs, { today: state.env.today, futures: result.basis.futures, seed: result.basis.seed, trace: false });
    expect(fresh, 'run tests/v7/states/build-states.mjs again').toEqual(result);
  }, 120000);
});

describe('the front door', () => {
  const state = load('front-door');
  const root = renderScreen(state);

  it('asks the one question and shows the six, in order, in the visitor\'s words', () => {
    expect(root.querySelector('h1').textContent).toBe(FRONT.title);
    const ids = [...root.querySelectorAll('[data-testid^="front.q."]')].map((el) => el.getAttribute('data-testid'));
    expect(ids).toEqual(['front.q.a', 'front.q.b', 'front.q.c', 'front.q.d', 'front.q.e', 'front.q.f']);
    for (const q of FRONT.questions) expect(one(root, `front.q.${q.id}`).textContent).toContain(q.ask);
  });
  it('A and B open their numbers step (step 4 joining up)', () => {
    for (const id of ['a', 'b']) {
      const el = one(root, `front.q.${id}`);
      const link = el.tagName === 'A' ? el : el.querySelector('a');
      expect(link.getAttribute('href')).toBe(`#/${id}/numbers`);
      expect(el.textContent).not.toContain(FRONT.notYet);
    }
  });
  it('the three that are not built are honest links to "not in the preview yet"', () => {
    for (const id of ['d', 'e', 'f']) {
      const el = one(root, `front.q.${id}`);
      const link = el.tagName === 'A' ? el : el.querySelector('a');
      expect(link.getAttribute('href')).toBe(`#/soon/${id}`);
      expect(el.textContent).toContain(FRONT.notYet);
    }
  });
  it('question C takes its first number here and goes on to the age', () => {
    const pot = one(root, 'front.c.pot');
    expect(pot.tagName).toBe('INPUT');
    expect(one(root, 'front.c.show').getAttribute('href')).toBe('#/c/numbers?focus=you.age');
    const { root: r2, actions } = draw(state);
    type(one(r2, 'front.c.pot'), '250,000');
    expect(actions).toEqual([{ type: 'draft/set', q: 'c', path: 'you.pot', value: '250,000' }]);
  });
  it('shows a pot already typed', () => {
    const s = clone(state);
    s.draft.c.values['you.pot'] = '300,000';
    expect(one(renderScreen(s), 'front.c.pot').value).toBe('300,000');
  });
  it('has no rail, no sign-up and no figure', () => {
    expect(root.querySelector('[data-region="rail"]')).toBe(null);
    expect(visibleText(root)).not.toMatch(/sign up|create an account|log in/i);
    expect(root.querySelector('[data-value]')).toBe(null);
  });
  it('carries the short advice line and who runs it in the footer, and the preview line', () => {
    const footer = root.querySelector('[data-region="footer"]').textContent;
    expect(footer).toContain(ADVICE_SHORT);
    expect(footer).toContain('Usefulish Ltd');
    expect(root.textContent).toContain('Preview of the next version.');
  });
  it('an unknown address shows the front door with one line saying so', () => {
    const r = renderScreen(load('not-found'));
    expect(r.querySelector('[data-screen]').getAttribute('data-screen')).toBe('front');
    expect(r.textContent).toContain(FRONT.notFound);
    expect(root.textContent).not.toContain(FRONT.notFound);
  });
});

describe('what have you got? (the numbers step)', () => {
  it('blank: two boxes to type in, three settings that start sensible, and a button that is never greyed out', () => {
    const state = load('numbers-blank');
    const root = renderScreen(state);
    expect(root.querySelector('h1').textContent).toBe(C.steps.numbers.label);
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['c.you.pot', 'c.you.age']);
    expect(one(root, 'c.start.kind.now').checked).toBe(true);
    expect(one(root, 'c.you.statePension.kind.full').checked).toBe(true);
    expect(one(root, 'c.you.finalSalary.has.no').checked).toBe(true);
    const show = one(root, 'c.action.show');
    expect(show.textContent).toBe(C.buttons.show);
    expect(show.disabled).toBe(false);
    expect(root.querySelector('[data-error-for]')).toBe(null);
    expect(one(root, 'c.action.addPartner')).not.toBe(null);
    expect(one(root, 'c.action.moreDetail').getAttribute('aria-expanded')).toBe('false');
    expect(one(root, 'c.action.fullDetail').getAttribute('href')).toBe('#/soon/e');
    expect(root.textContent).toContain(C.numbers.stays);
  });

  it('money boxes are text with a number keypad; ages the same', () => {
    const root = renderScreen(load('numbers-blank'));
    expect(one(root, 'c.you.pot').getAttribute('inputmode')).toBe('decimal');
    expect(one(root, 'c.you.age').getAttribute('inputmode')).toBe('numeric');
    expect(one(root, 'c.you.pot').type).toBe('text');
  });

  it('half typed with an error: the sentence sits under the box, joined to it, in the guide\'s words', () => {
    const state = load('numbers-half-typed-with-an-error');
    const root = renderScreen(state);
    const pot = one(root, 'c.you.pot');
    expect(pot.value).toBe('250,00o');                           // what was typed is never reformatted
    const err = root.querySelector('[data-error-for="c.you.pot"]');
    expect(err.textContent).toBe(C.fields['you.pot'].errors.notANumber);
    expect(pot.getAttribute('aria-invalid')).toBe('true');
    expect(pot.getAttribute('aria-describedby').split(' ')).toContain(err.id);
    expect(root.querySelector('[data-error-for="c.you.age"]').textContent).toBe(C.fields['you.age'].errors.required);
    expect(one(root, 'c.action.show').disabled).toBe(false);
  });

  it('an untouched empty box shows no error until the button has been pressed', () => {
    const s = load('numbers-blank');
    expect(renderScreen(s).querySelector('[data-error-for]')).toBe(null);
    s.draft.c.asked = true;
    const root = renderScreen(s);
    expect(root.querySelector('[data-error-for="c.you.pot"]').textContent).toBe(C.fields['you.pot'].errors.required);
    expect(root.querySelector('[data-error-for="c.you.age"]').textContent).toBe(C.fields['you.age'].errors.required);
  });

  it('couple: the partner block opens on the same step with its five settings and a way to remove it', () => {
    const state = load('numbers-couple-open');
    const root = renderScreen(state);
    for (const id of ['c.partner.age', 'c.partner.pot', 'c.partner.statePension.kind.full', 'c.partner.finalSalary.has.no']) expect(one(root, id), id).not.toBe(null);
    expect(one(root, 'c.action.removePartner').textContent).toBe(C.buttons.removePartner);
    expect(one(root, 'c.action.addPartner')).toBe(null);
    expect(one(root, 'c.you.finalSalary.yearly').value).toBe('9,000');
    expect(one(root, 'c.you.finalSalary.fromAge').value).toBe('65');
    expect(root.textContent).toContain(C.numbers.partnerDone);
    expect(one(root, 'c.action.fullDetail').textContent).toBe(C.buttons.fullDetailCouple);
  });

  it('more detail: four optional settings, each showing the value it starts from', () => {
    const root = renderScreen(load('numbers-more-open'));
    expect(one(root, 'c.savings').value).toBe('');
    expect(one(root, 'c.risk.balanced').checked).toBe(true);
    // the one charge (6.19.0), as A and B ask it: a percent box starting from 0.5
    const charge = one(root, 'c.charge');
    expect(charge.value).toBe('');
    expect(charge.getAttribute('inputmode')).toBe('decimal');
    expect(charge.getAttribute('placeholder')).toBe('0.5');
    expect(charge.closest('.box').querySelector('.suffix').textContent).toBe('%');
    expect(root.querySelector('label[for="c.charge"]').textContent).toBe(C.fields.charge.label);
    expect(one(root, 'c.endAge').value).toBe('');
    expect(one(root, 'c.endAge').getAttribute('placeholder')).toBe('95');
    expect(one(root, 'c.action.moreDetail').getAttribute('aria-expanded')).toBe('true');
    expect(one(root, 'c.take')).toBe(null);                      // "take" is never on the numbers step
  });

  it('a field named in the address opens its block', () => {
    const s = load('numbers-blank');
    s.route.focus = 'endAge';
    expect(one(renderScreen(s), 'c.endAge')).not.toBe(null);
    s.route.focus = 'charge';                                  // "Change" on the charges line
    expect(one(renderScreen(s), 'c.charge')).not.toBe(null);
  });

  it('a charge that is not on the 0.05 steps, or over 3%, is said in plain words', () => {
    const s = load('numbers-more-open');
    s.draft.c.values = { ...s.draft.c.values, charge: '0.07' };
    s.draft.c.touched = ['charge'];
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-error-for="c.charge"]').textContent).toBe(C.errors.percent.notANumber);
    s.draft.c.values = { ...s.draft.c.values, charge: '3.5' };
    expect(renderScreen(s).querySelector('[data-error-for="c.charge"]').textContent).toBe('Type a figure from 0% to 3%.');
  });

  it('under the earliest pension age: starts from that age, and says so', () => {
    const s = load('numbers-blank');
    s.draft.c.values = { 'you.pot': '100,000', 'you.age': '50' };
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(one(root, 'c.start.kind.age').checked).toBe(true);
    expect(one(root, 'c.start.age').getAttribute('placeholder')).toBe('57');
    expect(root.textContent).toContain('You cannot normally take a pension before 57. We have started at 57.');
  });

  it('a start age before the earliest pension age names the age in its error', () => {
    const s = load('numbers-blank');
    s.draft.c.values = { 'you.pot': '100,000', 'you.age': '50', 'start.kind': 'age', 'start.age': '52' };
    s.draft.c.touched = ['start.age'];
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-error-for="c.start.age"]').textContent).toBe('You cannot normally take a pension before 57. Choose 57 or later.');
  });

  it('every box says what it is: typing, leaving, choosing and the buttons each send one plain action', () => {
    const state = load('numbers-couple-open');
    const { root, actions } = draw(state);
    type(one(root, 'c.you.pot'), '£410,000');
    fire(one(root, 'c.you.pot'), 'blur');
    one(root, 'c.you.statePension.kind.forecast').click();
    one(root, 'c.partner.finalSalary.has.yes').click();
    one(root, 'c.action.removePartner').click();
    one(root, 'c.action.moreDetail').click();
    expect(actions).toEqual([
      { type: 'draft/set', q: 'c', path: 'you.pot', value: '£410,000' },
      { type: 'draft/touch', q: 'c', path: 'you.pot' },
      { type: 'draft/set', q: 'c', path: 'you.statePension.kind', value: 'forecast' },
      { type: 'draft/set', q: 'c', path: 'partner.finalSalary.has', value: true },
      { type: 'draft/set', q: 'c', path: 'household', value: 'single' },
      { type: 'ui/toggle', id: 'more' }
    ]);
    const blank = draw(load('numbers-blank'));
    one(blank.root, 'c.action.addPartner').click();
    expect(blank.actions).toEqual([{ type: 'draft/set', q: 'c', path: 'household', value: 'couple' }]);
  });

  it('"Show what it pays" asks — by the button and by Enter — and with something missing goes to the first box that needs attention', () => {
    const state = load('numbers-blank');
    const { root, actions } = draw(state);
    document.body.appendChild(root);
    try {
      const show = one(root, 'c.action.show');
      expect(show.getAttribute('type')).toBe('submit');
      fire(show.closest('form'), 'submit');
      expect(actions).toEqual([{ type: 'draft/ask', q: 'c' }]);
      expect(document.activeElement.id).toBe('c.you.pot');
    } finally { root.remove(); }
  });
});

describe('keyboard order and labels', () => {
  const states = ['numbers-blank', 'numbers-couple-open', 'numbers-more-open', 'numbers-half-typed-with-an-error'];
  it.each(states)('%s: Tab meets the boxes in the order of the input list, then the button', (name) => {
    const state = load(name);
    if (name === 'numbers-couple-open') state.ui.open = ['more'];
    const root = renderScreen(state);
    const stops = [...root.querySelectorAll('input, button, a[href], select, textarea')].filter((el) => el.getAttribute('tabindex') !== '-1');
    const boxes = stops.filter((el) => el.tagName === 'INPUT').map((el) => el.getAttribute('data-testid'));
    expect(boxes).toEqual(expectedInputs(state));            // expectedInputs is in the order of SCHEMA_C
    const lastBox = stops.map((el) => el.tagName).lastIndexOf('INPUT');
    expect(stops.findIndex((el) => el.getAttribute('data-testid') === 'c.action.show')).toBeGreaterThan(lastBox);
    expect(root.querySelector('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).toBe(null);
  });

  it.each(NAMES)('%s: every box has a label, every group a legend, every button words', (name) => {
    const root = renderScreen(load(name));
    for (const el of root.querySelectorAll('input')) {
      const label = root.querySelector(`label[for="${el.id}"]`);
      expect(label && label.textContent.trim(), `label for ${el.id}`).toBeTruthy();
      if (el.type === 'radio') expect(el.closest('fieldset').querySelector('legend').textContent.trim(), el.id).toBeTruthy();
    }
    for (const b of root.querySelectorAll('button')) expect((b.textContent.trim() || b.getAttribute('aria-label')), 'a button').toBeTruthy();
    expect(root.querySelector('h1').getAttribute('tabindex')).toBe('-1');   // the heading takes focus after a move
  });

  it('every field of the input list has its words', () => {
    for (const f of SCHEMA_C.fields) {
      const words = C.fields[f.path];
      expect(words && words.label, f.path).toBeTruthy();
      if (f.type === 'choice') for (const o of f.options) expect(words.options[o], `${f.path}.${o}`).toBeTruthy();
      if (f.type === 'yesNo') { expect(words.options.yes).toBeTruthy(); expect(words.options.no).toBeTruthy(); }
    }
  });
});

describe('what does it pay a month? (the answer step)', () => {
  it('nothing entered: the step asks for the two numbers itself — no error, no bounce', () => {
    const state = load('answer-nothing-entered');
    const root = renderScreen(state);
    expect(root.querySelector('[data-screen]').getAttribute('data-screen')).toBe('c.answer');
    expect(root.querySelector('h1').textContent).toBe(C.steps.answer.label);
    expect([...root.querySelectorAll('input')].map((el) => el.id)).toEqual(['c.you.pot', 'c.you.age']);
    expect(root.textContent).toContain(C.answer.needTwo);
    expect(root.textContent).toContain(C.answer.sensible);
    expect(root.querySelector('[data-headline]')).toBe(null);
    expect(root.querySelector('[data-error-for]')).toBe(null);
    expect(one(root, 'c.action.show')).not.toBe(null);
  });

  it('a figure that is wrong elsewhere is asked for on this step too', () => {
    const s = load('answer-nothing-entered');
    s.draft.c.values = { 'you.pot': '250,000', 'you.age': '58', 'you.statePension.kind': 'forecast', 'you.statePension.yearly': 'lots' };
    s.draft.c.asked = true;
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['c.you.pot', 'c.you.age', 'c.you.statePension.yearly']);
    expect(root.querySelector('[data-error-for="c.you.statePension.yearly"]').textContent).toBe('Use figures only, for example 9,000.');
  });

  it('working: says so at once, shows how far it has got, and adds the second sentence only when slow', () => {
    const state = load('answer-working');
    const root = renderScreen(state);
    expect(root.textContent).toContain(C.answer.working);
    expect(root.textContent).toContain(C.answer.trying);
    expect(root.textContent).not.toContain(C.answer.slow);
    const bar = root.querySelector('progress');
    expect(bar.getAttribute('value')).toBe('40');
    expect(bar.getAttribute('max')).toBe('100');
    expect(root.querySelector('[data-headline]')).toBe(null);
    state.answers.c.slow = true;
    expect(renderScreen(state).textContent).toContain(C.answer.slow);
  });

  it('a valid draft with no run started yet shows working, not an empty screen', () => {
    const s = load('answer-working');
    s.answers.c = { status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false };
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.textContent).toContain(C.answer.working);
  });

  it('first figure: the answer is shown and marked as a first figure', () => {
    const root = renderScreen(load('answer-first'));
    expect(root.querySelector('[data-headline="monthly.careful"]')).not.toBe(null);
    expect(root.textContent).toContain(C.answer.first);
    expect(renderScreen(load('answer-F1')).textContent).not.toContain(C.answer.first);
  });

  describe.each(['answer-F1', 'answer-F2', 'answer-F3', 'answer-assumed-open'])('%s', (name) => {
    const state = load(name);
    const result = state.answers.c.result;
    const root = renderScreen(state);
    const head = root.querySelector('[data-headline="monthly.careful"]');

    it('the headline is the careful amount, with its sentence, the bad-case line and the short advice line', () => {
      const number = head.querySelector('[data-key="monthly.careful"]');
      expect(number.getAttribute('data-value')).toBe(String(result.monthly.careful));
      expect(number.textContent).toBe(money(result.monthly.careful));
      expect(head.textContent).toContain(result.sentences.head.text);
      expect(head.textContent).toContain(result.sentences.sub.text);
      expect(head.querySelector('[data-sentence="monthly.careful"]').textContent).toBe(result.sentences.line.text);
      expect(head.textContent).toContain(result.sentences.bad.text);
      expect(head.textContent).toContain(ADVICE_SHORT);
      expect(head.textContent.indexOf(result.sentences.bad.text)).toBeLessThan(head.textContent.indexOf(ADVICE_SHORT));
    });
    it('says nothing the brief dropped: no "from your pot" headline, no "in all" line, no charges, no spending', () => {
      // (6.19.0: the one charge is said under what was assumed, with Change — that list sits in this block, and is the
      // only place the charges line belongs; the headline itself still carries no charges line)
      const bare = head.cloneNode(true);
      for (const el of bare.querySelectorAll('[data-assumed]')) el.remove();
      expect(bare.textContent).not.toMatch(/a month from your pot\b|in all once|Charges of|What you expect to spend|Way of taking it/);
      const assumed = head.querySelector('[data-assumed-id="charges"]');
      expect(assumed && assumed.textContent).toContain('Charges of 0.5% a year come off the money in funds and cash, while saving and while drawing; not off State Pension or final-salary pension.');
      expect(assumed.querySelector('[data-testid="assumed.charges.change"]').getAttribute('href')).toBe('#/c/numbers?focus=charge');
    });
    it('what it is made of: one line for each stretch of years, then the three amounts', () => {
      for (const s of result.sentences.madeOf) expect(root.textContent).toContain(s.text);
      expect(root.textContent).toContain(result.sentences.range.text);
      expect(root.textContent).toContain(C.answer.madeOfTitle);
    });
    it('what we assumed: one line for each thing the answer assumed — no more, no fewer', () => {
      const lines = [...root.querySelectorAll('[data-assumed] [data-assumed-id]')];
      expect(lines.map((l) => l.getAttribute('data-assumed-id'))).toEqual(result.assumed.map((a) => a.id));
      const changeable = result.assumed.filter((a) => a.field);
      expect(root.querySelectorAll('[data-testid^="assumed."]').length).toBe(changeable.length);
    });
    it('warnings the answer gave are shown in its words', () => {
      for (const w of result.warnings) expect(root.querySelector(`[data-warning-id="${w.id}"]`).textContent).toContain(w.text);
    });
    it('try a change, what next, and the full advice line are there', () => {
      for (const id of ['c.try.pot.down', 'c.try.pot.up', 'c.try.start.down', 'c.try.start.up', 'c.try.risk.cautious', 'c.try.risk.balanced',
        'c.try.risk.adventurous', 'c.take', 'c.try.take', 'c.action.fullDetail']) expect(one(root, id), id).not.toBe(null);
      const next = root.querySelector('[data-region="next"]');
      // "Already stopped?" leads for someone taking the money now with the State Pension already paid (F3); "Still working?" otherwise.
      const stopped = result.inputs.start.kind === 'now' && result.phases[0].statePension > 0;
      expect([...next.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(stopped ? ['#/soon/d', A_LINK, B_LINK] : [A_LINK, B_LINK, '#/soon/d']);
      // "Save this as a plan" follows "What next?", at the foot of the answer, with the name filled in (save-as-plan.md)
      const keep = root.querySelector('[data-region="keep"]');
      expect(keep.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
      expect(one(root, 'c.keep.name').value).toMatch(/^(From|Stop at) \d+/);
      expect(one(root, 'c.action.save').getAttribute('type')).toBe('submit');
      // Step 4: the A and B links are hand-overs (they carry C's figures and open the numbers step).
      expect(one(root, 'c.next.a')).not.toBe(null);
      expect(one(root, 'c.next.b')).not.toBe(null);
      expect(one(root, 'c.action.fullDetail').getAttribute('href')).toBe('#/soon/e');
      expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_FULL);
      expect(root.querySelector('[data-region="answer"]').getAttribute('aria-live')).toBe('polite');
    });
    it('is not marked as updating', () => {
      expect(root.textContent).not.toContain(C.answer.updating);
      expect(root.querySelector('[data-region="answer"]').getAttribute('aria-busy')).toBe('false');
    });
  });

  it('what we assumed and what it is made of open and close from the state', () => {
    const closed = renderScreen(load('answer-F1'));
    const open = renderScreen(load('answer-assumed-open'));
    expect(one(closed, 'c.toggle.assumed').getAttribute('aria-expanded')).toBe('false');
    expect(one(open, 'c.toggle.assumed').getAttribute('aria-expanded')).toBe('true');
    expect(one(open, 'c.toggle.madeOf').getAttribute('aria-expanded')).toBe('true');
    const { root, actions } = draw(load('answer-F1'));
    one(root, 'c.toggle.assumed').click();
    one(root, 'c.toggle.madeOf').click();
    one(root, 'c.toggle.allAssumed').click();
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'assumed' }, { type: 'ui/toggle', id: 'madeOf' }, { type: 'ui/toggle', id: 'allAssumed' }]);
  });

  it('updating: the old answer stays, greyed and marked, with the amount from before kept beside it', () => {
    const state = load('answer-updating');
    const root = renderScreen(state);
    const region = root.querySelector('[data-region="answer"]');
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('is-stale');
    expect(region.textContent).toContain(C.answer.updating);
    expect(root.querySelector('[data-headline="monthly.careful"]')).not.toBe(null);
    const before = root.querySelector('[data-key="before.monthly.careful"]');
    expect(before.getAttribute('data-value')).toBe(String(state.answers.c.before.monthly.careful));
  });

  it('a final answer for other figures than those typed is never shown as current', () => {
    const s = load('answer-F1');
    s.draft.c.values['you.pot'] = '300,000';
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-region="answer"]').getAttribute('aria-busy')).toBe('true');
    expect(root.textContent).toContain(C.answer.updating);
  });

  it('take: the sentence for the amount named is shown, and the box holds what was typed', () => {
    const state = load('answer-take');
    const root = renderScreen(state);
    expect(root.querySelector('[data-region="answer"]').textContent).toContain(state.answers.c.result.sentences.take.text);
    expect(one(root, 'c.take').value).toBe('1,500');
    expect(root.querySelector('[data-key="take.perMonth"]').getAttribute('data-value')).toBe('1500');
  });

  it('small pot: the sentence sits under the headline with the way on to "ways to take it"', () => {
    const state = load('answer-small-pot');
    const root = renderScreen(state);
    expect(root.textContent).toContain(state.answers.c.result.sentences.small.text);
    expect(one(root, 'c.action.ways').getAttribute('href')).toBe('#/c/ways');
  });

  it.each(['answer-pensions-only', 'answer-pensions-only-later', 'answer-nothing'])('%s: a plain sentence in place of the headline', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    expect(root.querySelector('[data-headline]')).toBe(null);
    expect(root.querySelector('[data-region="answer"]').textContent).toContain(state.answers.c.result.sentences.nothing.text);
    expect(root.textContent).toContain(ADVICE_FULL);
  });

  it('"no amount lasts" takes the place of the headline', () => {
    const s = load('answer-F1');
    const r = s.answers.c.result;
    r.sentences = { madeOf: [], none: { id: 'c.none', text: 'With these figures there is no monthly amount that lasts to 95. Try a later start age or a shorter time.',
      parts: ['With these figures there is no monthly amount that lasts to ', { key: 'inputs.endAge', kind: 'age' }, '. Try a later start age or a shorter time.'] } };
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-headline]')).toBe(null);
    expect(root.textContent).toContain(r.sentences.none.text);
  });

  it('failed: no technical words, the numbers shown to be still here, and two ways on', () => {
    const state = load('answer-failed');
    const { root, actions } = draw(state);
    expect(root.textContent).toContain(C.answer.failedTitle);
    expect(root.textContent).toContain(C.answer.failedBody);
    expect(root.textContent).toContain('£250,000');
    expect(root.textContent).not.toMatch(/error|failed|invalid|exception/i);
    expect(one(root, 'c.action.change').getAttribute('href')).toBe('#/c/numbers');
    one(root, 'c.action.retry').click();
    expect(actions).toEqual([{ type: 'answer/retry', q: 'c' }]);
    expect(root.querySelector('[data-headline]')).toBe(null);
  });

  it('an answer that came back as not usable is shown as a failure, never as figures', () => {
    const s = load('answer-F1');
    s.answers.c.result = { status: 'invalid', problems: [{ field: 'you.pot', messageId: 'required' }] };
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.textContent).toContain(C.answer.failedTitle);
  });
});

describe('try a change', () => {
  const press = (state, id) => { const { root, actions } = draw(state); one(root, id).click(); return actions; };
  const set = (path, value) => ({ type: 'draft/set', q: 'c', path, value });

  it('the pot steps by £25,000 from £100,000 up and by £5,000 below', () => {
    expect(press(load('answer-F1'), 'c.try.pot.up')).toEqual([set('you.pot', '275,000')]);
    expect(press(load('answer-F1'), 'c.try.pot.down')).toEqual([set('you.pot', '225,000')]);
    expect(press(load('answer-small-pot'), 'c.try.pot.up')).toEqual([set('you.pot', '17,000')]);
    const root = renderScreen(load('answer-F1'));
    expect(one(root, 'c.try.pot.up').textContent).toContain('£25,000');
    expect(root.querySelector('[data-region="form"] [data-key="inputs.you.pot"]').getAttribute('data-value')).toBe('250000');
  });
  it('the pot cannot go below nothing', () => {
    expect(one(renderScreen(load('answer-pensions-only')), 'c.try.pot.down').disabled).toBe(true);
  });
  it('the start age moves a year at a time and stops at today\'s age', () => {
    const f1 = load('answer-F1');
    expect(press(f1, 'c.try.start.up')).toEqual([set('start.kind', 'age'), set('start.age', '59')]);
    expect(one(renderScreen(f1), 'c.try.start.down').disabled).toBe(true);
    // An answer held for the figures as typed (the stepper rests while an answer is pending or being worked out).
    const startingAt = (age) => { const s = load('answer-F1'); s.draft.c.values = { ...s.draft.c.values, 'start.kind': 'age', 'start.age': age }; s.answers.c.inputsKey = currentKey(s, 'c'); return s; };
    expect(press(startingAt('60'), 'c.try.start.down')).toEqual([set('start.kind', 'age'), set('start.age', '59')]);
    expect(press(startingAt('59'), 'c.try.start.down')).toEqual([set('start.kind', 'now'), set('start.age', '')]);
  });
  it('the risk level is three buttons, the chosen one marked', () => {
    const root = renderScreen(load('answer-F1'));
    expect(one(root, 'c.try.risk.balanced').getAttribute('aria-pressed')).toBe('true');
    expect(one(root, 'c.try.risk.cautious').getAttribute('aria-pressed')).toBe('false');
    expect(press(load('answer-F1'), 'c.try.risk.adventurous')).toEqual([set('risk', 'adventurous')]);
  });
  it('take: typing sets the amount as typed; the button asks at once', () => {
    const { root, actions } = draw(load('answer-F1'));
    type(one(root, 'c.take'), '1,500');
    one(root, 'c.try.take').click();
    expect(actions).toEqual([set('take', '1,500'), { type: 'draft/ask', q: 'c' }]);
  });
  it('before and now: nothing before the first change, then the amount from before', () => {
    expect(renderScreen(load('answer-F1')).querySelector('[data-key="before.monthly.careful"]')).toBe(null);
    const s = load('answer-F1');
    s.answers.c.before = { monthly: { careful: 1290 } };
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-key="before.monthly.careful"]').textContent).toBe('£1,290');
  });
});

describe('not built yet', () => {
  it('soon: one sentence, a link to the current version, and a way back', () => {
    const state = load('soon-d');
    const root = renderScreen(state);
    expect(root.querySelector('[data-screen]').getAttribute('data-screen')).toBe('soon');
    expect(root.querySelector('h1').textContent).toBe(FRONT.questions.find((q) => q.id === 'd').ask);
    expect(root.textContent).toContain(SOON.line);
    const links = [...root.querySelector('main').querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['../', '#/']);
  });
  it.each(['e', 'f'])('soon/%s draws too', (q) => {
    const s = load('soon-d');
    s.route.q = q;
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.textContent).toContain(SOON.line);
  });
  it('a step that is on the rail but not built says so and leads back to the answer', () => {
    const state = load('not-built-ways');
    const root = renderScreen(state);
    expect(root.querySelector('[data-screen]').getAttribute('data-screen')).toBe('notBuilt');
    expect(root.querySelector('h1').textContent).toBe(C.steps.ways.label);
    expect(root.textContent).toContain(NOT_BUILT.line);
    expect([...root.querySelector('main').querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['#/c/answer']);
    const keep = load('not-built-ways');
    keep.route.step = 'keep';
    expect(checkScreen(renderScreen(keep), keep)).toEqual([]);
  });
});

describe('the rail, the header and being offline', () => {
  it('the rail lists the four steps as questions, says which are optional, and gives one next sentence', () => {
    const root = renderScreen(load('numbers-blank'));
    const rail = root.querySelector('[data-region="rail"]');
    expect(rail.tagName).toBe('NAV');
    expect(rail.getAttribute('aria-label')).toBe(C.rail.nav);
    for (const step of ['numbers', 'answer', 'ways', 'keep']) expect(one(rail, `rail.c.${step}`).textContent).toContain(C.steps[step].label);
    expect(one(rail, 'rail.c.ways').closest('li').textContent).toContain(C.rail.optional);
    expect(one(rail, 'rail.c.numbers').closest('li').textContent).not.toContain(C.rail.optional);
    expect(Object.values(C.next)).toContain(one(rail, 'rail.next').querySelector('[data-next]').textContent);
    expect(rail.querySelector('ol')).not.toBe(null);
  });
  it('on a phone the rail is one line that opens', () => {
    const state = load('answer-F1');
    const { root, actions } = draw(state);
    const line = one(root, 'rail.line');
    expect(line.textContent).toContain('Step 2 of 4');
    expect(line.textContent).toContain(C.steps.answer.short);
    expect(line.getAttribute('aria-expanded')).toBe('false');
    line.click();
    expect(actions).toEqual([{ type: 'ui/rail', open: true }]);
    state.ui.railOpen = true;
    const open = renderScreen(state);
    expect(one(open, 'rail.line').getAttribute('aria-expanded')).toBe('true');
    expect(checkScreen(open, state)).toEqual([]);
  });
  it('Escape closes the opened rail', () => {
    const state = load('answer-F1');
    state.ui.railOpen = true;
    const { root, actions } = draw(state);
    root.querySelector('[data-region="rail"]').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(actions).toEqual([{ type: 'ui/rail', open: false }]);
  });
  it('the header leads back to all the questions and the page says it is a preview', () => {
    const root = renderScreen(load('answer-F1'));
    expect(root.querySelector('header a[href="#/"]')).not.toBe(null);
    expect(root.querySelector('a[href="../"]').textContent).toBe('The current version is here.');
    expect(root.querySelector('a[href="../privacy.html"]')).not.toBe(null);
  });
  it('offline is one plain line', () => {
    const s = load('answer-F1');
    expect(renderScreen(s).textContent).not.toContain('You are offline.');
    s.ui.online = false;
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.textContent).toContain('You are offline. You can still work things out. Keeping a plan needs a connection.');
  });
});

describe('any answer the function can give is drawn by the same rules', () => {
  const cases = [
    { 'you.pot': '250000', 'you.age': '58' },
    { 'you.pot': '£1,073,100', 'you.age': '67', risk: 'adventurous', endAge: '100' },
    { household: 'couple', 'you.pot': '90,000', 'you.age': '70', 'partner.age': '62', 'partner.pot': '0', savings: '150,000' },
    { 'you.pot': '30,000', 'you.age': '55', 'you.statePension.kind': 'none', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '12,570', 'you.finalSalary.fromAge': '60' }
  ];
  it.each(cases.map((c, i) => [i, c]))('case %i', (_i, values) => {
    const s = load('answer-F1');
    s.draft.c.values = values;
    const parsed = parseDraft(SCHEMA_C, values, s.env);
    expect(parsed.ok).toBe(true);
    s.answers.c.result = answerC(parsed.inputs, { today: s.env.today, futures: 40, seed: 0, trace: false });
    // Whether it counts as current is the shell's business; the rules hold either way.
    expect(checkScreen(renderScreen(s), s)).toEqual([]);
  }, 120000);
});

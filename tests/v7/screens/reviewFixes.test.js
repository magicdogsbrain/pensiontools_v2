/**
 * The screen-side fixes from the first review of the question-C slice (Wendy; the forum guest and the retired
 * man), each held to checkScreen's rules as well:
 *
 *   1  "+ Add a partner" after a first answer: the partner's age box is not red before anything is typed, and the
 *      keyboard goes to it
 *   2  "Show how long that lasts": the sentence is drawn under the button, and Before / Now speaks about the amount tried
 *   3  the start-age stepper shows the figure typed at once, and rests while an answer is being worked out
 *   4  nothing pushes "keep this plan" while it is not built: the next line, the What-next button, the rail's button,
 *      and the not-built steps' own next line back to the answer
 *   5  "What we assumed" says who the answer is for, with the way to add a partner
 *   6  the risk buttons show what moves with the level
 *   7  the key under the three amounts
 *   8  the phone chrome: a short preview line, the next line inside the sheet
 *   9  the front door on a phone: the built question first, the others one line each (styles)
 *  10  the rail at 1024 px and up: four steps on one row (styles)
 *  11  "Hide more detail" when open; thousands separators when a money box is left
 *  12  "What next?" leads with "Already stopped?" for someone already drawing their State Pension
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { renderScreen } from '../c/_c.js';
import { checkScreen, draw, visibleText } from '../render/checkScreen.js';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { C } from '../../../src/v7/copy/c.js';
import { COMMON, NOT_BUILT } from '../../../src/v7/copy/common.js';

const DIR = join(process.cwd(), 'tests/v7/states/c');
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const type = (el, text) => { el.value = text; fire(el, 'input'); };
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);

/** A live page: the real store and reducer, redrawn after every action, in the document (so focus works). */
function live(state) {
  const store = createStore({ ...state, env: { ...state.env, build: 'test' } }, reduce);
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  const dispatch = (a) => store.dispatch(a);
  const drawIt = (s) => act(() => { render(h(App, { state: s, dispatch }), root); });   // act: the Shell's focus effect runs before we look
  store.subscribe(drawIt);
  drawIt(store.getState());
  return { root, store, done: () => { render(null, root); root.remove(); } };
}

describe('1 — "+ Add a partner" after a first answer', () => {
  it('opens the partner block with no red box, and puts the keyboard in the partner\'s age box', () => {
    const state = load('answer-F1');
    state.route = { screen: 'step', q: 'c', step: 'numbers', planId: null, focus: null };
    state.draft.c.asked = true;
    const page = live(state);
    try {
      expect(one(page.root, 'c.partner.age')).toBe(null);
      one(page.root, 'c.action.addPartner').click();
      const box = one(page.root, 'c.partner.age');
      expect(box).not.toBe(null);
      expect(page.root.querySelector('[data-error-for="c.partner.age"]')).toBe(null);
      expect(box.getAttribute('aria-invalid')).toBe(null);
      expect(document.activeElement).toBe(box);
      clean(page.root, page.store.getState());
      // The rail does not say "check the figure marked below" either: nothing is marked. It asks for the box to be filled in.
      expect(one(page.root, 'rail.next').textContent).not.toContain(C.next['c.fix']);
      expect(one(page.root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next['c.fix.unmarked']);
      // Leaving the box empty shows its sentence.
      fire(box, 'blur');
      expect(page.root.querySelector('[data-error-for="c.partner.age"]').textContent).toBe(C.fields['partner.age'].errors.required);
      expect(one(page.root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next['c.fix']);
      clean(page.root, page.store.getState());
    } finally { page.done(); }
  });
  it('an empty partner age that was on the form when "Show what it pays" was pressed is marked at once', () => {
    const state = load('numbers-couple-open');
    state.draft.c.values['partner.age'] = '';
    state.draft.c.asked = true;
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-error-for="c.partner.age"]')).not.toBe(null);
  });
});

describe('2 — "Show how long that lasts"', () => {
  it('draws the sentence for the amount named under the button, and keeps it in the answer card', () => {
    const state = load('answer-take');
    const root = renderScreen(state);
    clean(root, state);
    const text = state.answers.c.result.sentences.take.text;
    const under = one(root, 'c.try.take.result');
    expect(under.textContent).toBe(text);
    expect(under.closest('.try')).not.toBe(null);
    expect(root.querySelector('[data-region="answer"]').textContent).toContain(text);
    // It sits after the button in reading order.
    const order = [...root.querySelectorAll('[data-testid="c.try.take"], [data-testid="c.try.take.result"]')].map((el) => el.getAttribute('data-testid'));
    expect(order).toEqual(['c.try.take', 'c.try.take.result']);
  });
  it('"Now" speaks about the amount tried, not the headline; "Before" about what was tried before', () => {
    const state = load('answer-take');
    const r = state.answers.c.result;
    state.answers.c.before = { monthly: { careful: 1290 }, take: null };
    let root = renderScreen(state);
    clean(root, state);
    let line = root.querySelector('.before-now');
    expect(line.querySelector('.before').textContent).toContain('£1,290 a month');
    expect(line.querySelector('.now [data-key="take.perMonth"]').textContent).toBe('£1,500');
    expect(line.querySelector('.now [data-key="take.runOutAge"]').getAttribute('data-value')).toBe(String(r.take.runOutAge));
    expect(line.querySelector('.now').textContent).toContain(r.take.covered ? C.answer.takeLastsTo : C.answer.takeRunsOut);
    expect(line.querySelector('.now [data-key="monthly.careful"]')).toBe(null);
    // A second try: the one before was a tried amount too.
    state.answers.c.before = { monthly: { careful: 1380 }, take: { perMonth: 1800, runOutAge: 84, covered: false } };
    root = renderScreen(state);
    clean(root, state);
    line = root.querySelector('.before-now');
    expect(line.querySelector('.before [data-key="before.take.perMonth"]').textContent).toBe('£1,800');
    expect(line.querySelector('.before [data-key="before.take.runOutAge"]').textContent).toBe('84');
    expect(line.querySelector('.before').textContent).toContain(C.answer.takeRunsOut);
    // …and one that lasted.
    state.answers.c.before = { monthly: { careful: 1380 }, take: { perMonth: 1200, runOutAge: 95, covered: true } };
    root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('.before-now .before').textContent).toContain(`${C.answer.takeLastsTo} 95 ${C.answer.takeEvenBad}`);
  });
  it('with no amount named, Before / Now is the careful amount as before', () => {
    const state = load('answer-F1');
    state.answers.c.before = { monthly: { careful: 1290 }, take: null };
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('.before-now .now [data-key="monthly.careful"]')).not.toBe(null);
    expect(root.querySelector('.before-now .before [data-key="before.monthly.careful"]').textContent).toBe('£1,290');
  });
});

describe('3 — the start-age stepper', () => {
  it('shows the figure typed the moment it changes, before the answer catches up', () => {
    const state = load('answer-F1');
    state.draft.c.values = { ...state.draft.c.values, 'start.kind': 'age', 'start.age': '59' };
    const root = renderScreen(state);                        // the answer on screen is still for 58
    clean(root, state);
    expect(root.querySelector('[data-typed="start.age"]').textContent).toBe('59');
    const now = renderScreen(load('answer-F1'));
    expect(now.querySelector('[data-typed="start.age"]').textContent).toBe(`${C.answer.tryStartNow} (58)`);
  });
  it('rests while an answer is pending or being worked out, so a double tap cannot step twice', () => {
    // Resting is aria-disabled with the press ignored, never `disabled`: a greyed-out button drops the keyboard's
    // place to the page (the review of A and B, 1 Oct 2026; tests/v7/screens/abFixes.test.js 2).
    const pending = load('answer-F1');
    pending.draft.c.values = { ...pending.draft.c.values, 'start.kind': 'age', 'start.age': '59' };
    for (const s of [pending, load('answer-updating'), load('answer-first')]) {
      const root = renderScreen(s);
      for (const id of ['c.try.start.up', 'c.try.start.down', 'c.try.pot.up', 'c.try.pot.down']) expect(one(root, id).getAttribute('aria-disabled'), id).toBe('true');
    }
    const final = renderScreen(load('answer-F1'));
    expect(one(final, 'c.try.start.up').disabled).toBe(false);
    expect(one(final, 'c.try.pot.up').disabled).toBe(false);
    expect(one(final, 'c.try.start.up').getAttribute('aria-disabled')).toBe(null);
    expect(one(final, 'c.try.pot.up').getAttribute('aria-disabled')).toBe(null);
  });
  it('on a live page a press moves the figure at once and the buttons rest until the answer is final', () => {
    const page = live(load('answer-F1'));
    try {
      one(page.root, 'c.try.start.up').click();
      expect(page.root.querySelector('[data-typed="start.age"]').textContent).toBe('59');
      expect(one(page.root, 'c.try.start.up').getAttribute('aria-disabled')).toBe('true');
      one(page.root, 'c.try.start.up').click();                // a second tap does nothing
      expect(page.store.getState().draft.c.values['start.age']).toBe('59');
      expect(page.root.querySelector('[data-typed="you.pot"]')).toBe(null);   // the pot is still the answer's
      clean(page.root, page.store.getState());
    } finally { page.done(); }
  });
  it('the pot shows the figure typed once a button moves it', () => {
    const state = load('answer-F1');
    state.draft.c.values = { ...state.draft.c.values, 'you.pot': '275,000' };
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-typed="you.pot"]').textContent).toBe('£275,000');
    expect(root.querySelector('[data-region="form"] [data-key="inputs.you.pot"]')).toBe(null);
  });
});

describe('4 — "Save this as a plan" now that it is built (save-as-plan.md); "ways" still says it is not', () => {
  it('the answered next line does not push saving the plan', () => {
    expect(C.next['c.answered']).not.toMatch(/keep|save/i);
    const root = renderScreen(load('answer-F1'));
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next['c.answered']);
  });
  it('"What next?" holds no saving link; the panel follows it, its button the form\'s own', () => {
    const root = renderScreen(load('answer-F1'));
    expect(one(root, 'c.action.keep')).toBe(null);
    expect(root.querySelector('[data-region="next"] .btn-primary')).toBe(null);
    const save = one(root, 'c.action.save');
    expect(save.getAttribute('type')).toBe('submit');
    expect(save.closest('[data-region="keep"]')).not.toBe(null);
  });
  it('the rail\'s button leads to the step, and says what it is', () => {
    const root = renderScreen(load('answer-F1'));
    const b = one(root, 'rail.next.button');
    expect(b.getAttribute('href')).toBe('#/c/keep');
    expect(b.textContent).toBe(C.buttons.keep);
  });
  it('#/c/keep with an answer: the name box, and the next line says to check it; no button back to itself', () => {
    const state = load('answer-F1');
    state.route = { screen: 'step', q: 'c', step: 'keep', planId: null, focus: null };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next['c.keep']);
    expect(one(root, 'rail.next.button')).toBe(null);
    expect(one(root, 'c.keep.name').value).toBe('From 58 · £1,380 a month');
    expect(root.textContent).not.toContain(NOT_BUILT.line);
  });
  it.each(['ways'])('#/c/%s has its own next line and button back to the answer', (step) => {
    const state = load('answer-F1');
    state.route = { screen: 'step', q: 'c', step, planId: null, focus: null };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next.unbuilt);
    expect(one(root, 'rail.next').textContent).not.toMatch(/keep this plan|try a change/i);
    const b = one(root, 'rail.next.button');
    expect(b.getAttribute('href')).toBe('#/c/answer');
    expect(b.textContent).toBe(C.buttons.back);
    expect(railFor(state).next.button).toEqual({ labelId: 'c.action.back', href: '#/c/answer' });
    // No link on the rail loops back to the page the person is on.
    for (const a of root.querySelectorAll('[data-region="rail"] [data-testid="rail.next"] a')) expect(a.getAttribute('href')).not.toBe(`#/c/${step}`);
    expect(root.textContent).toContain(NOT_BUILT.line);
  });
  it('with nothing typed, a not-built step has the next line but no button', () => {
    const state = load('not-built-ways');
    state.draft.c = { values: {}, touched: [], asked: false, revealed: [] };
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe(C.next.unbuilt);
    expect(one(root, 'rail.next.button')).toBe(null);
  });
});

describe('5 — who the answer is for', () => {
  it('one person: "Worked out for you alone." with the way to add a partner', () => {
    const state = load('answer-F1');
    const root = renderScreen(state);
    clean(root, state);
    const row = root.querySelector('[data-assumed] [data-assumed-household="single"]');
    expect(row.textContent).toContain(C.answer.assumedSingle);
    const link = row.querySelector('a');
    expect(link.textContent).toBe(C.answer.assumedChange);
    expect(link.getAttribute('href')).toBe('#/c/numbers?focus=household');
    expect(link.getAttribute('data-testid')).toBe('c.action.household');
    expect(row.hasAttribute('data-assumed-id')).toBe(false);   // not one of the answer's own assumptions
    expect(row.hidden).toBe(false);
  });
  it('two people: "Worked out for the two of you."', () => {
    const state = load('answer-F2');
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-assumed] [data-assumed-household="couple"]').textContent).toContain(C.answer.assumedCouple);
  });
  it('the link lands on the control that adds or removes a partner', () => {
    const single = load('numbers-blank');
    single.route.focus = 'household';
    const page = live(single);
    try { expect(document.activeElement).toBe(one(page.root, 'c.action.addPartner')); } finally { page.done(); }
    const couple = load('numbers-couple-open');
    couple.route.focus = 'household';
    const page2 = live(couple);
    try { expect(document.activeElement).toBe(one(page2.root, 'c.action.removePartner')); } finally { page2.done(); }
  });
});

describe('6 — what moves with the risk level', () => {
  it('shows the middling and good amounts and the bad-case run-out age at the middling amount, from the answer', () => {
    const state = load('answer-F1');
    const r = state.answers.c.result;
    const root = renderScreen(state);
    clean(root, state);
    const moves = one(root, 'c.try.risk.moves');
    expect(moves.closest('.try-risk')).not.toBe(null);
    expect(moves.querySelector('[data-key="monthly.middling"]').getAttribute('data-value')).toBe(String(r.monthly.middling));
    expect(moves.querySelector('[data-key="monthly.good"]').getAttribute('data-value')).toBe(String(r.monthly.good));
    expect(moves.querySelector('[data-key="runOutAge.middling"]').getAttribute('data-value')).toBe(String(r.runOutAge.middling));
    expect(moves.textContent).toContain('the worst 1 in 10');
  });
  it('is not drawn when the answer has no such figures', () => {
    const root = renderScreen(load('answer-nothing'));
    expect(one(root, 'c.try.risk.moves')).toBe(null);
  });
});

describe('7 — the key under the three amounts', () => {
  it('names what careful, middling and good mean, with every count marked as the answer\'s own', () => {
    const state = load('answer-F1');
    const root = renderScreen(state);
    clean(root, state);
    const key = one(root, 'c.madeOf.key');
    expect(key.textContent).toBe(C.answer.rangeKey);
    expect(key.textContent).toMatch(/careful = .*9.*out of 10.*middling = 5 out of 10.*good = the best 1 in 10/);
    expect([...key.querySelectorAll('[data-fixed]')].map((el) => el.textContent)).toEqual(['9', '10', '5', '10', '1', '10']);
    // Under the three amounts, inside "what it is made of".
    expect(key.previousElementSibling.classList.contains('range')).toBe(true);
    expect(key.closest('.made-of')).not.toBe(null);
  });
});

describe('8 — the phone chrome', () => {
  it('the preview line has a short form for a phone and the full sentence for wider screens', () => {
    const root = renderScreen(load('answer-F1'));
    const line = root.querySelector('.preview-line');
    expect(line.querySelector('.preview-long').textContent).toBe(`${COMMON.preview.text} ${COMMON.preview.link}`);
    expect(line.querySelector('.preview-short').textContent).toBe(`${COMMON.preview.shortText} ${COMMON.preview.shortLink}`);
    for (const a of line.querySelectorAll('a')) expect(a.getAttribute('href')).toBe(COMMON.links.current);
    expect(COMMON.preview.shortText.length + COMMON.preview.shortLink.length).toBeLessThanOrEqual(46);   // one line at 390 px
  });
  it('the next line sits inside the sheet, after the steps', () => {
    const root = renderScreen(load('answer-F1'));
    const sheet = root.querySelector('#rail-sheet');
    const next = one(root, 'rail.next');
    expect(sheet.contains(next)).toBe(true);
    expect(sheet.querySelector('.rail-steps').compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(next.compareDocumentPosition(sheet.querySelector('.rail-another')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it('pressing a step or the next button in the open sheet closes it', () => {
    const state = load('answer-F1');
    state.ui.railOpen = true;
    const { root, actions } = draw(state);
    one(root, 'rail.next.button').click();
    expect(actions).toEqual([{ type: 'ui/rail', open: false }]);
  });
});

describe('9, 10 — the styles', () => {
  const css = readFileSync(join(process.cwd(), 'src/v7/styles/components.css'), 'utf8');
  const block = (query) => { const at = css.indexOf(query); expect(at, query).toBeGreaterThan(-1); return css.slice(at, css.indexOf('\n}', at)); };
  it('on a phone the built question comes first and the others are one line each', () => {
    const phone = block('@media (max-width: 699px) {\n  .question-c');
    expect(phone).toMatch(/\.question-c \{ order: -1; \}/);
    expect(phone).toMatch(/\.question-more \{ display: none; \}/);
  });
  it('at 1024 px and up every step shares one row (four for C, five for A and B with the budget step)', () => {
    const wide = block('@media (min-width: 1024px) {\n  .rail > *');
    expect(wide).toMatch(/grid-auto-flow: column; grid-auto-columns: minmax\(0, 1fr\)/);
  });
  it('the preview line is one short line on a phone', () => {
    expect(css).toMatch(/\.preview-short \{ display: none; \}/);
    expect(block('@media (max-width: 699px) {\n  .preview-line')).toMatch(/\.preview-long \{ display: none; \}[\s\S]*\.preview-short \{ display: inline; \}/);
  });
});

describe('11 — more detail, and money boxes', () => {
  it('the button reads "Hide more detail" while the block is open', () => {
    const closed = renderScreen(load('numbers-blank'));
    expect(one(closed, 'c.action.moreDetail').textContent).toBe(`+ ${C.buttons.moreDetail}`);
    const open = renderScreen(load('numbers-more-open'));
    expect(one(open, 'c.action.moreDetail').textContent).toBe(C.buttons.hideDetail);
    expect(one(open, 'c.action.moreDetail').getAttribute('aria-expanded')).toBe('true');
  });
  it('leaving a money box writes whole pounds with their commas; ages and anything else are left as typed', () => {
    const page = live(load('numbers-blank'));
    try {
      const pot = one(page.root, 'c.you.pot');
      type(pot, '310000');
      expect(pot.value).toBe('310000');                         // nothing reformats while typing
      fire(pot, 'blur');
      expect(pot.value).toBe('310,000');
      expect(page.store.getState().draft.c.values['you.pot']).toBe('310,000');
      expect(page.store.getState().draft.c.touched).toContain('you.pot');
      type(pot, '£310,000');
      fire(pot, 'blur');
      expect(pot.value).toBe('310,000');
      type(pot, '250,00o');
      fire(pot, 'blur');
      expect(pot.value).toBe('250,00o');                        // not a figure: shown as typed, with its sentence
      type(pot, '1234.5');
      fire(pot, 'blur');
      expect(pot.value).toBe('1234.5');                         // pence are not rounded away by the screen
      const age = one(page.root, 'c.you.age');
      type(age, '58');
      fire(age, 'blur');
      expect(age.value).toBe('58');
      clean(page.root, page.store.getState());
    } finally { page.done(); }
  });
  it('the front door\'s pot box tidies too, and the figure carries over', () => {
    const page = live(load('front-door'));
    try {
      const pot = one(page.root, 'front.c.pot');
      type(pot, '250000');
      fire(pot, 'blur');
      expect(pot.value).toBe('250,000');
      expect(page.store.getState().draft.c.values['you.pot']).toBe('250,000');
    } finally { page.done(); }
  });
  it('a box that already reads that way sends nothing extra on leaving', () => {
    const { root, actions } = draw(load('answer-F1'));
    const state = load('numbers-couple-open');
    const page = draw(state);
    fire(one(page.root, 'c.you.pot'), 'blur');
    expect(page.actions).toEqual([{ type: 'draft/touch', q: 'c', path: 'you.pot' }]);
    expect(root && actions).toBeTruthy();
  });
});

describe('12 — "What next?" for someone already drawing their State Pension', () => {
  it('leads with "Already stopped?" for the retired man (F3), and with "Still working?" for the forum guest (F1)', () => {
    const f3 = renderScreen(load('answer-F3'));
    const groups3 = [...f3.querySelectorAll('[data-region="next"] .next-group')].map((el) => el.getAttribute('data-testid'));
    expect(groups3).toEqual(['c.next.stopped', 'c.next.working']);
    const f1 = renderScreen(load('answer-F1'));
    const groups1 = [...f1.querySelectorAll('[data-region="next"] .next-group')].map((el) => el.getAttribute('data-testid'));
    expect(groups1).toEqual(['c.next.working', 'c.next.stopped']);
    // Every question is still offered, whichever comes first.
    for (const root of [f1, f3]) expect([...root.querySelectorAll('[data-region="next"] a')].map((a) => a.getAttribute('href')).sort()).toEqual(['#/a/numbers?focus=stop.age', '#/b/numbers?focus=you.payIn.total', '#/soon/d']);
  });
  it('reads the answer, never the age alone: a start later than now keeps "Still working?" first', () => {
    const state = load('answer-F3');
    state.answers.c.result.inputs.start = { kind: 'age', age: 70 };
    const root = renderScreen(state);
    expect(root.querySelector('[data-region="next"] .next-group').getAttribute('data-testid')).toBe('c.next.working');
  });
});

describe('every fixed screen still keeps the rules', () => {
  it.each(['answer-F1', 'answer-F2', 'answer-F3', 'answer-take', 'answer-updating', 'answer-first', 'answer-assumed-open', 'answer-small-pot', 'answer-pensions-only', 'answer-nothing',
    'numbers-blank', 'numbers-couple-open', 'numbers-more-open', 'front-door', 'not-built-ways'])('%s', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    clean(root, state);
    expect(visibleText(root)).not.toMatch(/undefined|NaN|\{|\}/);
  });
  it('a pending start-age change on the answer step draws by the rules too', () => {
    const state = load('answer-F1');
    state.draft.c.values = { ...state.draft.c.values, 'start.kind': 'age', 'start.age': '60' };
    state.answers.c.inputsKey = currentKey(state, 'c');
    clean(renderScreen(state), state);
  });
});

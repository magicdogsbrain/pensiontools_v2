/**
 * Couples who stop work in different years — the screens, the words and the shell (research/v7/couples-different-years.md
 * 2, 3.1, 5.2–5.4; package P3). Every state here is drawn in jsdom and held to checkScreen's rules (R1–R16 and the scope
 * rules), then:
 *
 *   1  "When does your partner stop work?" in the partner block of C, A and B: after the partner's age and pot, before
 *      their pay-in; nothing ticked; "They already have" hides the pay-in; an age opens its box; the pay line with Change;
 *      the three settings once Change is pressed (or the line is answered)
 *   2  "I've already stopped" (A and B, a couple only): the pay-in (and A's part-time work) hidden, the partner's question
 *      turned to the one the answer is about; one person is told C is their question; both stopped is the retired view
 *   3  "Already had the tax-free part?" under more detail, for someone who has stopped only, nothing ticked
 *   4  the answer: A's second headline line, the chart's axis, the step's own name; hand-overs in words about the partner
 *   5  every new sentence the screens draw is the design's, word for word (section 2), and passes the banned list
 *   6  the keyboard: the order of the boxes, and "Change" putting the keyboard in the three settings
 *   7  today, byte for byte: every named state draws exactly what it drew before this work (tests/v7/screens/today.hashes.json,
 *      the screens of 6.19.0), the new questions themselves apart
 *
 * The answer's own fields for two stops (`apart`, `askedAbout`) are the contract's (src/answers/shared/contract.js); until
 * the answers fill them, the answer states here carry them by hand, on a real answer.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { renderScreen } from '../c/_c.js';
import { checkScreen, visibleText, expectedInputs, draw, bannedHits, scopesFor } from '../render/checkScreen.js';
import { focusField } from '../../../src/v7/components/Field.jsx';
import { changedLine } from '../../../src/v7/components/TryAChange.jsx';
import { leverActions } from '../../../src/v7/components/Levers.jsx';
import { currentKey } from '../../../src/v7/state/select.js';
import { APART } from '../../../src/answers/shared/household.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { C } from '../../../src/v7/copy/c.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const COPY = { a: A, b: B, c: C };
const SCHEMA = { a: SCHEMA_A, b: SCHEMA_B, c: SCHEMA_C };
const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), `tests/v7/states/${q}/${name}.json`), 'utf8'));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
/** Straight quotes, as the design writes them (the copy of A and B uses the curly ’). */
const plain = (s) => String(s).replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
const ids = (root, prefix) => [...root.querySelectorAll('input')].map((el) => el.getAttribute('data-testid')).filter((id) => id.startsWith(prefix));
/** The options a choice draws: its own radios (an option's row may hold a box too). */
const radios = (group) => [...group.querySelectorAll(`input[type="radio"][name="${group.querySelector('input[type="radio"]').name}"]`)];

/** A couple's numbers, by question: you still working, made-up round figures (none is anyone's). */
const COUPLE = {
  c: { 'you.pot': '250,000', 'you.age': '58', household: 'couple', 'partner.age': '56', 'partner.pot': '90,000' },
  a: { 'you.age': '55', 'you.pot': '420,000', 'stop.age': '60', household: 'couple', 'partner.age': '56', 'partner.pot': '180,000' },
  b: { 'you.age': '55', 'you.pot': '420,000', 'you.payIn.total': '600', 'stop.age': '60', household: 'couple', 'partner.age': '56', 'partner.pot': '180,000' }
};
const PAY_IN = { c: 'partner.payIn.has', a: 'partner.payIn.kind', b: 'partner.payIn.kind' };

const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
/** A live page: the real store and reducer, redrawn after every action, in the document (so focus works). */
function livePage(state) {
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

/** A numbers state of question q with these values typed. */
function numbers(q, values, { open = [], focus = null, asked = false, touched = [] } = {}) {
  const s = load(q, 'numbers-blank');
  s.draft[q].values = { ...values };
  s.draft[q].asked = asked;
  s.draft[q].touched = [...touched];
  s.ui.open = [...open];
  s.route = { ...s.route, focus };
  return s;
}

describe('1 — "When does your partner stop work?" (C, A and B)', () => {
  it.each(['c', 'a', 'b'])('%s: in the partner block, after their age and pot and before their pay-in; nothing ticked; no age box and no pay line yet', (q) => {
    const state = numbers(q, COUPLE[q]);
    const root = renderScreen(state);
    clean(root, state);
    const words = COPY[q].fields['partner.stop.kind'];
    const group = root.querySelector('[data-field="partner.stop.kind"]');
    expect(group.closest('section.partner'), 'inside the partner block').not.toBe(null);
    expect(plain(group.querySelector('legend').textContent)).toBe('When does your partner stop work?');
    const order = ids(root, `${q}.partner.`);
    const at = (id) => order.indexOf(`${q}.${id}`);
    expect(at('partner.stop.kind.same')).toBeGreaterThan(at('partner.pot'));
    expect(at('partner.stop.kind.same')).toBeGreaterThan(at('partner.age'));
    expect(at('partner.stop.kind.same')).toBeLessThan(order.findIndex((id) => id.startsWith(`${q}.${PAY_IN[q]}`)));
    // while you are still working: when you do, they already have, an age — never "show me ages"
    expect(radios(group).map((el) => el.value)).toEqual(['same', 'already', 'age']);
    expect(radios(group).some((el) => el.checked)).toBe(false);
    expect(plain(group.querySelector(`label[for="${q}.partner.stop.kind.same"]`).textContent)).toBe(q === 'c' ? 'When you start taking money' : 'When you do');
    expect(plain(words.options.already)).toBe('They already have');
    expect(plain(words.options.age)).toBe('At an age');
    expect(one(root, `${q}.partner.stop.age`)).toBe(null);
    expect(one(root, `${q}.untilBothStop.line`)).toBe(null);
  });

  it.each(['c', 'a', 'b'])('%s: "They already have" hides their pay-in, and shows the pay line with Change', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector(`[data-field="${PAY_IN[q]}"]`), 'their pay-in').toBe(null);
    const line = one(root, `${q}.untilBothStop.line`);
    expect(plain(line.textContent)).toContain("Until you've both stopped, the one still working covers half of what you spend from their pay, and keeps paying in.");
    const change = one(root, `${q}.untilBothStop.change`);
    expect(change.textContent).toBe('Change');
    expect(change.getAttribute('href')).toBe(`#/${q}/numbers?focus=untilBothStop`);
    expect(root.querySelector('[data-field="untilBothStop"]')).toBe(null);          // the three settings wait for Change
  });

  it.each(['c', 'a', 'b'])('%s: "At an age" opens its box inside the option, and the pay line', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'age', 'partner.stop.age': '57' });
    const root = renderScreen(state);
    clean(root, state);
    const box = one(root, `${q}.partner.stop.age`);
    expect(box.value).toBe('57');
    expect(box.closest('.option').querySelector(`[data-testid="${q}.partner.stop.kind.age"]`)).not.toBe(null);
    expect(root.querySelector(`label[for="${q}.partner.stop.age"]`).textContent.trim()).toBeTruthy();
    expect(one(root, `${q}.untilBothStop.line`)).not.toBe(null);
    expect(root.querySelector(`[data-field="${PAY_IN[q]}"]`), 'still working: their pay-in stays').not.toBe(null);
  });

  it.each(['c', 'a', 'b'])('%s: Change opens the three settings in place of the line — the design\'s words, nothing ticked', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' }, { focus: 'untilBothStop' });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, `${q}.untilBothStop.line`)).toBe(null);
    const group = root.querySelector('[data-field="untilBothStop"]');
    expect(plain(group.querySelector('legend').textContent)).toBe("Until you've both stopped, their pay covers:");
    expect([...group.querySelectorAll('label')].map((l) => l.textContent)).toEqual(['Half of what you spend', 'All of it', 'None of it']);
    expect(plain(group.querySelector('.help').textContent)).toBe("Whatever their pay doesn't cover comes from the money of the one who has stopped.");
    expect(radios(group).some((el) => el.checked)).toBe(false);
    // drawn under the partner's question, not inside one of its options
    expect(group.closest('[data-field="partner.stop.kind"]')).toBe(null);
    expect(group.closest('section.partner')).not.toBe(null);
  });

  it.each(['c', 'a', 'b'])('%s: answered, the settings stay open with the answer ticked; it reads back', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'age', 'partner.stop.age': '60', untilBothStop: 'all' });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, `${q}.untilBothStop.all`).checked).toBe(true);
    expect(one(root, `${q}.untilBothStop.line`)).toBe(null);
  });

  it.each(['c', 'a', 'b'])('%s: the line says what not answering means — the owner\'s one switch (APART.payCoversDefault)', (q) => {
    const line = COPY[q].fields.untilBothStop.line;
    expect(Object.keys(line).sort()).toEqual(['all', 'half', 'none']);
    const root = renderScreen(numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' }));
    expect(one(root, `${q}.untilBothStop.line`).textContent).toContain(line[APART.payCoversDefault]);
    expect(plain(line.all)).toBe("Until you've both stopped, the one still working covers all of what you spend from their pay, and keeps paying in.");
  });

  it.each(['c', 'a', 'b'])('%s: an age younger than theirs today is said in words, under the box', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'age', 'partner.stop.age': '50' }, { touched: ['partner.stop.age'] });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector(`[data-error-for="${q}.partner.stop.age"]`).textContent).toBe(COPY[q].fields['partner.stop.age'].errors['partner-stop-not-before-now']);
    expect(plain(COPY[q].fields['partner.stop.age'].errors['partner-stop-not-before-now'])).toMatch(/younger than your partner is now/);
  });

  it.each(['c', 'a', 'b'])('%s: one person sees none of it', (q) => {
    const state = numbers(q, { ...COUPLE[q], household: 'single', 'partner.stop.kind': 'age', 'partner.stop.age': '60' });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-field="partner.stop.kind"]')).toBe(null);
    expect(one(root, `${q}.untilBothStop.line`)).toBe(null);
  });
});

describe('2 — "I\'ve already stopped" (A and B, a couple only)', () => {
  it('one person: A offers an age or "show me ages" only, and B asks only the age — as before', () => {
    const a = numbers('a', { 'you.age': '55', 'you.pot': '420,000', 'stop.age': '60' });
    const ra = renderScreen(a);
    clean(ra, a);
    expect(radios(ra.querySelector('[data-field="stop.kind"]')).map((el) => el.value)).toEqual(['age', 'ages']);
    const b = numbers('b', { 'you.age': '55', 'you.pot': '420,000', 'you.payIn.total': '600', 'stop.age': '60' });
    const rb = renderScreen(b);
    clean(rb, b);
    expect(rb.querySelector('[data-field="stop.kind"]')).toBe(null);
    expect(rb.querySelector('label[for="b.stop.age"]').textContent).toBe(B.fields['stop.age'].label);
  });

  it('a couple: A\'s stop question gains a third option; B\'s age gains the same choice, the box inside "At an age"', () => {
    const a = numbers('a', COUPLE.a);
    const ra = renderScreen(a);
    clean(ra, a);
    expect(radios(ra.querySelector('[data-field="stop.kind"]')).map((el) => el.value)).toEqual(['age', 'ages', 'already']);
    expect(plain(A.fields['stop.kind'].options.already)).toBe("I've already stopped");
    const b = numbers('b', COUPLE.b);
    const rb = renderScreen(b);
    clean(rb, b);
    const kind = rb.querySelector('[data-field="stop.kind"]');
    expect(radios(kind).map((el) => el.value)).toEqual(['age', 'already']);
    expect(plain(B.fields['stop.kind'].options.already)).toBe("I've already stopped");
    expect(one(rb, 'b.stop.age').closest('.option').querySelector('[data-testid="b.stop.kind.age"]')).not.toBe(null);
  });

  it.each(['a', 'b'])('%s: chosen, your pay-in goes (and A\'s part-time work); the partner\'s question becomes the one the answer is about', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '58' });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-field="you.payIn.kind"]')).toBe(null);
    expect(root.querySelector('[data-field="stop.age"]')).toBe(null);
    if (q === 'a') expect(root.querySelector('[data-field="partTime.has"]')).toBe(null);
    const group = root.querySelector('[data-field="partner.stop.kind"]');
    expect(plain(group.querySelector('legend').textContent)).toBe('When would your partner like to stop work?');
    expect(radios(group).map((el) => el.value)).toEqual(q === 'a' ? ['age', 'ages'] : ['age']);
    expect(group.querySelector(`label[for="${q}.partner.stop.kind.age"]`).textContent).toBe('An age');
    if (q === 'a') expect(plain(group.querySelector('label[for="a.partner.stop.kind.ages"]').textContent)).toBe('No age in mind — show me ages');
    expect(root.querySelector('[data-field="partner.payIn.kind"]'), 'the partner still pays in').not.toBe(null);
    // the person at the keyboard has stopped: the retired rules of the banned list hold on this screen too
    expect(scopesFor(state)).toContain('retired');
  });

  it.each(['a', 'b'])('%s: the partner\'s stop not given yet, once asked: said in words', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'stop.kind': 'already' }, { asked: true });
    const root = renderScreen(state);
    clean(root, state);
    const error = root.querySelector(`[data-error-for="${q}.partner.stop.kind"]`).textContent;
    expect(error).toBe(COPY[q].fields['partner.stop.kind'].errors['partner-stop-fits']);
    if (q === 'a') expect(plain(error)).toBe('Choose when your partner would like to stop, or "show me ages".');
  });

  it.each(['a', 'b'])('%s: one person with "I\'ve already stopped" (left over from a couple): it stays ticked, with the way to C', (q) => {
    const state = numbers(q, { ...COUPLE[q], household: 'single', 'stop.kind': 'already' }, { touched: ['stop.kind'] });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, `${q}.stop.kind.already`).checked).toBe(true);
    const error = root.querySelector(`[data-error-for="${q}.stop.kind"]`).textContent;
    expect(plain(error)).toBe('If you have stopped, "What is that a month?" is the question for you.');
  });

  it('A: "show me ages" for the partner while you are still working is said in words (and stays ticked)', () => {
    const state = numbers('a', { ...COUPLE.a, 'partner.stop.kind': 'ages' }, { touched: ['partner.stop.kind'] });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.partner.stop.kind.ages').checked).toBe(true);
    expect(plain(root.querySelector('[data-error-for="a.partner.stop.kind"]').textContent))
      .toBe('"Show me ages" works for one of you at a time: give your partner\'s age, or choose "When you do".');
  });

  it('B: the partner must still be working, said in B\'s words', () => {
    const state = numbers('b', { ...COUPLE.b, 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '56' }, { touched: ['partner.stop.age'] });
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-error-for="b.partner.stop.age"]').textContent).toBe(B.fields['partner.stop.age'].errors['partner-stop-after-now']);
  });

  it.each(['a', 'b'])('%s: both stopped is the retired view, pointing to "What is that a month?"', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'stop.kind': 'already', 'partner.stop.kind': 'already' });
    const { root, actions } = draw(state);
    clean(root, state);
    expect(root.querySelector('main').getAttribute('data-view')).toBe('retired');
    expect(plain(one(root, `${q}.retired.both`).textContent)).toBe('You have both stopped. "What is that a month?" answers what your money could pay.');
    expect(one(root, `${q}.action.toC`).getAttribute('href')).toBe('#/c/numbers');
    expect(root.querySelector('input')).toBe(null);
    one(root, `${q}.action.imWorking`).click();
    expect(actions).toEqual([{ type: 'draft/set', q, path: 'stop.kind', value: 'age' }, { type: 'draft/set', q, path: 'stop.age', value: '' }]);
  });

  it('A: pressing "I\'ve already stopped" while the empty stop-age box has the keyboard chooses it at once — no sentence, nothing moves', () => {
    // (the reviewers' finding, 2 Oct 2026: the box's blur drew "Type the age you have in mind…" between the press and its
    // release, the options moved, and the first click chose nothing). The press comes first, then the blur, then the click.
    const state = numbers('a', { ...COUPLE.a, 'stop.age': '' }, { focus: 'stop.age' });
    const page = livePage(state);
    try {
      const box = one(page.root, 'a.stop.age');
      box.focus();
      const already = one(page.root, 'a.stop.kind.already');
      const rowBefore = already.closest('.option-row');
      fire(already, 'pointerdown'); fire(already, 'mousedown');
      fire(box, 'blur');
      expect(page.root.querySelector('[data-error-for="a.stop.age"]')).toBe(null);
      expect(page.store.getState().draft.a.touched).not.toContain('stop.age');
      expect(one(page.root, 'a.stop.kind.already').closest('.option-row')).toBe(rowBefore);       // nothing redrawn under the press
      one(page.root, 'a.stop.kind.already').click();
      expect(page.store.getState().draft.a.values['stop.kind']).toBe('already');
      expect(page.root.querySelector('fieldset[data-choosing]')).toBe(null);
      // leaving the empty box any other way still shows its sentence, as before
      const again = livePage(numbers('a', { ...COUPLE.a, 'stop.age': '' }, { focus: 'stop.age' }));
      try {
        fire(one(again.root, 'a.stop.age'), 'blur');
        expect(again.root.querySelector('[data-error-for="a.stop.age"]')).not.toBe(null);
      } finally { again.done(); }
    } finally { page.done(); }
  });

  it('one person who has stopped keeps today\'s retired view, word for word', () => {
    const state = load('a', 'answer-retired');
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.retired.both')).toBe(null);
    expect(one(root, 'a.action.willItLast')).not.toBe(null);
  });

  it('B\'s stop age: "Your age when you both stop work" while the partner question is not answered (today); "The age you would stop work" once their stop is their own', () => {
    const together = renderScreen(numbers('b', COUPLE.b));
    expect(together.querySelector('label[for="b.stop.age"]').textContent).toBe(B.fields['stop.age'].labelCouple);
    const apart = renderScreen(numbers('b', { ...COUPLE.b, 'partner.stop.kind': 'age', 'partner.stop.age': '60' }));
    expect(apart.querySelector('label[for="b.stop.age"]').textContent).toBe('The age you would stop work');
  });

  it.each(['a', 'b'])('%s: "You both stop in the same year" is said only while it is so', (q) => {
    const together = renderScreen(numbers(q, COUPLE[q]));
    expect(visibleText(together)).toContain(COPY[q].numbers.partnerDone);
    expect(COPY[q].numbers.partnerDone).toMatch(/same year/);
    const apart = visibleText(renderScreen(numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' })));
    expect(apart).not.toMatch(/same year/);
    expect(apart).toContain(COPY[q].numbers.partnerDoneApart);
    // you have stopped and their stop is not given yet: still not "the same year"
    expect(visibleText(renderScreen(numbers(q, { ...COUPLE[q], 'stop.kind': 'already' })))).not.toMatch(/same year/);
  });
});

describe('3 — "Already had the tax-free part?" (more detail, for someone who has stopped)', () => {
  const TAX_HELP = 'Usually a quarter of the pot. If it has gone, everything taken out is taxed.';

  it('C from now: yours under more detail, never inside "Now"; nothing ticked; the partner\'s once they "already have"', () => {
    const state = numbers('c', { ...COUPLE.c, 'start.kind': 'now', 'partner.stop.kind': 'already' }, { open: ['more'] });
    const root = renderScreen(state);
    clean(root, state);
    const mine = root.querySelector('[data-field="you.taxFreeTaken"]');
    expect(mine.closest('#more-detail')).not.toBe(null);
    expect(plain(mine.querySelector('legend').textContent)).toBe('Already had the tax-free part of your pension?');
    expect(mine.querySelector('.help').textContent).toBe(TAX_HELP);
    expect(radios(mine).some((el) => el.checked)).toBe(false);
    const theirs = root.querySelector('[data-field="partner.taxFreeTaken"]');
    expect(plain(theirs.querySelector('legend').textContent)).toBe("Already had the tax-free part of your partner's pension?");
    expect(root.querySelector('[data-field="start.kind"] [data-field="you.taxFreeTaken"]')).toBe(null);
  });

  it('C from an age: not asked; more detail closed: not drawn', () => {
    const later = numbers('c', { ...COUPLE.c, household: 'single', 'start.kind': 'age', 'start.age': '60' }, { open: ['more'] });
    const root = renderScreen(later);
    clean(root, later);
    expect(root.querySelector('[data-field="you.taxFreeTaken"]')).toBe(null);
    const closed = numbers('c', { ...COUPLE.c, 'start.kind': 'now' });
    expect(renderScreen(closed).querySelector('[data-field="you.taxFreeTaken"]')).toBe(null);
  });

  it.each(['a', 'b'])('%s: with "I\'ve already stopped", yours under more detail; answered yes, it reads back ticked', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '58', 'you.taxFreeTaken': true }, { open: ['more'] });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, `${q}.you.taxFreeTaken.yes`).checked).toBe(true);
    expect(root.querySelector('[data-field="you.taxFreeTaken"]').closest('#more-detail')).not.toBe(null);
    expect(root.querySelector('[data-field="stop.kind"] [data-field="you.taxFreeTaken"]')).toBe(null);
  });
});

/** A's couple answer (a real answer, from the named state) with the contract's fields for two stops written in. */
function answerA({ apart = null, askedAbout = null, partnerStop = null, values = null } = {}) {
  const s = load('a', 'answer-A2-couple');
  const r = s.answers.a.result;
  if (apart) r.apart = apart;
  if (askedAbout) r.askedAbout = askedAbout;
  if (partnerStop) r.inputs.partner.stop = partnerStop;
  if (values) s.draft.a.values = { ...s.draft.a.values, ...values };
  return s;
}
const APART_62 = { first: 'you', years: 4, stops: { you: { age: 56, already: false }, partner: { age: 58, already: false } }, payCovers: 0.5, coversGap: true, coverUsed: null };

describe('4 — the answer', () => {
  it('A, the same year: no second line, and the chart reads as today', () => {
    const state = answerA();
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.answer.second')).toBe(null);
    expect(root.querySelector('[data-chart="ages"] thead th').textContent).toBe(A.answer.chartAgeCouple);
  });

  it('A, your partner at their own age: "Your partner stops at 58, as you said." on its own line, the age the answer\'s', () => {
    const state = answerA({ apart: APART_62, partnerStop: { kind: 'age', age: 58 } });
    const root = renderScreen(state);
    clean(root, state);
    const line = one(root, 'a.answer.second');
    expect(plain(line.textContent)).toBe('Your partner stops at 58, as you said.');
    expect(line.querySelector('[data-key="apart.stops.partner.age"]').getAttribute('data-value')).toBe('58');
    expect(line.closest('[data-headline="verdict"]')).not.toBe(null);
    // each row is your stop; your partner's is fixed, so no bracket, and the axis says whose it is
    expect(root.querySelector('[data-chart="ages"] thead th').textContent).toBe(A.answer.chartAgeOwn);
    expect(root.querySelector('[data-chart="ages"] .partner-age')).toBe(null);
  });

  it('A, your partner already stopped: "Your partner has already stopped."', () => {
    const apart = { ...APART_62, first: 'partner', stops: { you: { age: 56, already: false }, partner: { age: 53, already: true } } };
    const state = answerA({ apart, partnerStop: { kind: 'already' } });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.answer.second').textContent).toBe('Your partner has already stopped.');
  });

  it('A, about your partner: "You have already stopped."; the axis is theirs; the step is named for them; the hand-overs speak of them', () => {
    const apart = { ...APART_62, first: 'you', stops: { you: { age: 55, already: true }, partner: { age: 56, already: false } } };
    const state = answerA({ apart, askedAbout: 'partner', partnerStop: { kind: 'age', age: 56 },
      values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'age', 'partner.stop.age': '56' } });
    const root = renderScreen(state);
    clean(root, state);
    expect(one(root, 'a.answer.second').textContent).toBe('You have already stopped.');
    expect(plain(root.querySelector('[data-chart="ages"] thead th').textContent)).toBe("Your partner's stop age");
    expect(root.querySelector('[data-chart="ages"] .partner-age')).toBe(null);
    expect(root.querySelector('h1').textContent).toBe('Could your partner stop at 56?');
    // the hand-overs carry "I've already stopped" (state/carry.js carryFor), so they are offered, in words about your partner
    expect(plain(one(root, 'a.next.b').textContent)).toBe('Is my partner saving enough for this?');
    expect(plain(one(root, 'a.next.c').textContent)).toBe(`What could we spend a month once my partner stops at ${state.answers.a.result.shown.age}?`);
  });

  it('A, about your partner shown stopping now (their age today): "Is my partner saving enough?" is not offered — B refuses it — and C still is', () => {
    // (the reviewers' finding, 2 Oct 2026: the link opened B already showing "Choose an age later than your partner is now")
    const state = answerA({ askedAbout: 'partner', values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'age' } });
    const r = state.answers.a.result;
    r.shown.age = r.inputs.partner.age;
    r.inputs.partner.stop = { kind: 'age', age: r.inputs.partner.age };
    state.draft.a.values['partner.stop.age'] = String(r.inputs.partner.age);
    const root = renderScreen(state);
    expect(one(root, 'a.next.b')).toBe(null);
    expect(one(root, 'a.next.c')).not.toBe(null);
    // a year on, both are offered
    const later = answerA({ askedAbout: 'partner', values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'age' } });
    later.answers.a.result.shown.age = later.answers.a.result.inputs.partner.age + 1;
    later.draft.a.values['partner.stop.age'] = String(later.answers.a.result.shown.age);
    const lroot = renderScreen(later);
    expect(one(lroot, 'a.next.c')).not.toBe(null);
    expect(one(lroot, 'a.next.b')).not.toBe(null);
    // about you, as today: offered whatever the age shown
    const mine = answerA();
    mine.answers.a.result.shown.age = mine.answers.a.result.inputs.you.age;
    expect(one(renderScreen(mine), 'a.next.b')).not.toBe(null);
  });

  it('C from now, you stopped and your partner stopping later: "What next?" asks about your partner, and the links open with no box focused', () => {
    const s = load('c', 'answer-apart');
    const r = s.answers.c.result;
    expect(r.apart.stops.you.already).toBe(true);
    const root = renderScreen(s);
    clean(root, s);
    const group = one(root, 'c.next.working');
    expect(plain(group.querySelector('.next-prompt').textContent)).toBe('Your partner still working?');
    expect(plain(one(root, 'c.next.a').textContent)).toBe('When could my partner afford to stop?');
    expect(plain(one(root, 'c.next.b').textContent)).toBe('Is my partner saving enough for this?');
    expect(one(root, 'c.next.a').getAttribute('href')).toBe('#/a/numbers');
    expect(one(root, 'c.next.b').getAttribute('href')).toBe('#/b/numbers');
    // a couple who stop together keep today's words and places
    const today = load('c', 'answer-F2');
    const troot = renderScreen(today);
    expect(plain(one(troot, 'c.next.working').querySelector('.next-prompt').textContent)).toBe(C.answer.stillWorking);
    expect(one(troot, 'c.next.a').getAttribute('href')).toBe('#/a/numbers?focus=stop.age');
  });

  it('A, about your partner with "show me ages" for them: the step is named for them', () => {
    const state = answerA({ askedAbout: 'partner', values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'ages' } });
    const root = renderScreen(state);
    expect(root.querySelector('h1').textContent).toBe(A.steps.answer.labelPartnerAges);
    expect(A.steps.answer.labelPartnerAges).toBe('Which ages could your partner stop at?');
  });

  it('B, about your partner: the hand-overs speak of them', () => {
    const s = load('b', 'answer-B5-couple');
    s.answers.b.result.askedAbout = 'partner';
    const root = renderScreen(s);
    clean(root, s);
    expect(plain(one(root, 'b.next.a').textContent)).toBe('When could my partner afford to stop?');
    expect(plain(one(root, 'b.next.c').textContent)).toBe(`What could we spend a month once my partner stops at ${s.answers.b.result.stop.age}?`);
  });

  it('B\'s grid step, a couple apart: the spending is "once you have both stopped" (2.4)', () => {
    const s = load('b', 'choices-B1');
    s.answers.b.result.inputs.household = 'couple';
    s.answers.b.result.apart = APART_62;
    const root = renderScreen(s);
    clean(root, s);
    const lead = plain(root.querySelector('[data-region="answer"] .lead').textContent);
    expect(lead).toContain(plain(B.choices.spendingEndApart));
    expect(lead).not.toContain('from the age you both stop');
  });

  it('the same couple answered about you keeps both hand-overs', () => {
    const root = renderScreen(load('b', 'answer-B5-couple'));
    expect(one(root, 'b.next.a')).not.toBe(null);
  });

  it('A, about your partner: "Try a change" offers no part-time work — it is yours, and you have stopped (3.4)', () => {
    const state = answerA({ askedAbout: 'partner', values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'age', 'partner.stop.age': '56' } });
    state.answers.a.inputsKey = currentKey(state, 'a');
    const root = renderScreen(state);
    clean(root, state);
    expect(root.querySelector('[data-testid^="a.try.partTime"]')).toBe(null);
    expect(root.querySelector('#try-partTime')).toBe(null);
    // about you, it is there as before
    const mine = answerA();
    mine.answers.a.inputsKey = currentKey(mine, 'a');
    expect(renderScreen(mine).querySelector('[data-testid^="a.try.partTime"]')).not.toBe(null);
  });

  it('A, about your partner: "Try a change" moves their stop, never yours (which would undo "I\'ve already stopped")', () => {
    const state = answerA({ askedAbout: 'partner', values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'age', 'partner.stop.age': '56' } });
    state.answers.a.inputsKey = currentKey(state, 'a');                // the answer is for what is typed: the levers are live
    const { root, actions } = draw(state);
    clean(root, state);
    expect(plain(root.querySelector('#try-stop').textContent)).toBe("Partner's stop age");
    one(root, 'a.try.stop.up').click();
    expect(actions).toEqual([{ type: 'draft/set', q: 'a', path: 'partner.stop.age', value: '57' }, { type: 'draft/set', q: 'a', path: 'partner.stop.kind', value: 'age' }]);
    expect(changedLine('a', A, { partner: { stop: { kind: 'age', age: 56 } } }, { partner: { stop: { kind: 'age', age: 57 } } }))
      .toBe('You changed your partner’s stop age from 56 to 57.');
    // the same year: nothing new is named
    expect(changedLine('a', A, { stop: { age: 60 } }, { stop: { age: 61 } })).toBe('You changed the stop age from 60 to 61.');
  });

  it('A, about your partner: picking an age in the table picks their stop', () => {
    const state = answerA({ askedAbout: 'partner', partnerStop: { kind: 'ages' }, values: { 'stop.kind': 'already', 'stop.age': '', 'partner.stop.kind': 'ages' } });
    state.route = { ...state.route, step: 'ages' };
    const { root, actions } = draw(state);
    const pick = root.querySelector('[data-testid^="a.ages.pick."]');
    pick.click();
    const age = pick.getAttribute('data-testid').split('.').pop();
    expect(actions).toEqual([{ type: 'draft/set', q: 'a', path: 'partner.stop.age', value: age }, { type: 'draft/set', q: 'a', path: 'partner.stop.kind', value: 'age' }]);
  });

  it('B, about your partner: nothing of yours to pay in is offered, and "Stop later" moves their stop', () => {
    const s = load('b', 'answer-B5-couple');
    s.answers.b.result.askedAbout = 'partner';
    s.draft.b.values = { ...s.draft.b.values, 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '58' };
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'b.try.payIn.up')).toBe(null);
    expect(one(root, 'b.try.partnerPayIn.up')).not.toBe(null);
    const r = { ...s.answers.b.result, levers: { stopLater: { age: 60 } } };
    expect(leverActions('stopLater', r)).toEqual([{ type: 'draft/set', q: 'b', path: 'partner.stop.age', value: '60' }]);
    expect(leverActions('stopLater', { ...r, askedAbout: undefined })).toEqual([{ type: 'draft/set', q: 'b', path: 'stop.age', value: '60' }]);
  });
});

describe('5 — the words', () => {
  it('every new field has its words in all three questions, the rules their own sentences', () => {
    for (const q of ['c', 'a', 'b']) {
      for (const p of ['partner.stop.kind', 'partner.stop.age', 'untilBothStop', 'partner.taxFreeTaken', ...(APART.askAboutPartner ? ['you.taxFreeTaken'] : [])]) {
        expect(COPY[q].fields[p] && COPY[q].fields[p].label, `${q} ${p}`).toBeTruthy();
      }
      for (const rule of SCHEMA[q].rules) expect(COPY[q].fields[rule.fields[0]].errors[rule.id], `${q} ${rule.id}`).toBeTruthy();
    }
  });

  it('the design\'s sentences, word for word (section 2)', () => {
    for (const q of ['c', 'a', 'b']) {
      const f = COPY[q].fields;
      expect(plain(f.untilBothStop.line.half)).toBe("Until you've both stopped, the one still working covers half of what you spend from their pay, and keeps paying in.");
      expect(plain(f.untilBothStop.label)).toBe("Until you've both stopped, their pay covers:");
      expect(f.untilBothStop.options).toEqual({ half: 'Half of what you spend', all: 'All of it', none: 'None of it' });
      expect(plain(f.untilBothStop.help)).toBe("Whatever their pay doesn't cover comes from the money of the one who has stopped.");
      expect(plain(f['partner.taxFreeTaken'].label)).toBe("Already had the tax-free part of your partner's pension?");
      expect(f['partner.taxFreeTaken'].help).toBe('Usually a quarter of the pot. If it has gone, everything taken out is taxed.');
    }
    expect(C.fields['partner.stop.kind'].options).toEqual({ same: 'When you start taking money', already: 'They already have', age: 'At an age' });
    for (const words of [A, B]) {
      expect(plain(words.fields['partner.stop.kind'].labelAsked)).toBe('When would your partner like to stop work?');
      expect(plain(words.fields['stop.kind'].errors['already-needs-partner'])).toBe('If you have stopped, "What is that a month?" is the question for you.');
      expect(plain(words.retired.both.body)).toBe('You have both stopped. "What is that a month?" answers what your money could pay.');
    }
    expect(plain(A.fields['partner.stop.kind'].errors['partner-stop-fits'])).toBe('Choose when your partner would like to stop, or "show me ages".');
    expect(A.answer.second.partnerAlready).toBe('Your partner has already stopped.');
    expect(A.answer.second.youAlready).toBe('You have already stopped.');
    expect(plain(A.answer.chartAgePartner)).toBe("Your partner's stop age");
    expect(B.fields['stop.age'].label).toBe('The age you would stop work');
  });

  it('C, read by people who have stopped, says "stops", never "stop work at 56"; nothing new in C has a slot', () => {
    const all = (o) => (typeof o === 'string' ? [o] : Object.values(o).flatMap(all));
    const strings = all([C.fields['partner.stop.kind'], C.fields['partner.stop.age'], C.fields.untilBothStop, C.fields['you.taxFreeTaken'], C.fields['partner.taxFreeTaken']]);
    expect(strings.length).toBeGreaterThan(10);
    for (const t of strings) expect(t).not.toMatch(/stop work at|\{/);
  });

  it('every new screen holds no banned word, by its scope', () => {
    const states = [
      ...['c', 'a', 'b'].flatMap((q) => [
        numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' }),
        numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'age', 'partner.stop.age': '60' }, { focus: 'untilBothStop', open: ['more'] })
      ]),
      ...['a', 'b'].map((q) => numbers(q, { ...COUPLE[q], 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '58' }, { open: ['more'] })),
      ...['a', 'b'].map((q) => numbers(q, { ...COUPLE[q], 'stop.kind': 'already', 'partner.stop.kind': 'already' })),
      answerA({ apart: APART_62, partnerStop: { kind: 'age', age: 58 } })
    ];
    for (const state of states) {
      const root = renderScreen(state);
      expect(bannedHits(visibleText(root), scopesFor(state))).toEqual([]);
      clean(root, state);
    }
  });
});

describe('6 — the keyboard', () => {
  it('A, a couple: the boxes in the drawn order — their stop, its age right after "At an age", then their pay-in', () => {
    const state = numbers('a', { ...COUPLE.a, 'partner.stop.kind': 'age', 'partner.stop.age': '58' });
    const root = renderScreen(state);
    const order = ids(root, 'a.partner.');
    expect(order.slice(0, 7)).toEqual(['a.partner.age', 'a.partner.pot', 'a.partner.stop.kind.same', 'a.partner.stop.kind.already', 'a.partner.stop.kind.age',
      'a.partner.stop.age', 'a.partner.payIn.kind.total']);
    expect([...order].sort()).toEqual(expectedInputs(state).filter((id) => id.startsWith('a.partner.')).sort());
  });

  it.each(['c', 'a', 'b'])('%s: Change is a link with words; the address it opens puts the keyboard in the three settings', (q) => {
    const state = numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'already' }, { focus: 'untilBothStop' });
    const { root } = draw(state);
    document.body.appendChild(root);
    try {
      expect(focusField(root, 'untilBothStop', q)).toBe(true);
      expect(document.activeElement.getAttribute('data-testid')).toBe(`${q}.untilBothStop.half`);
    } finally { root.remove(); }
  });

  it('every new box has a label, every group a legend, and no tab order of its own', () => {
    for (const q of ['c', 'a', 'b']) {
      const root = renderScreen(numbers(q, { ...COUPLE[q], 'partner.stop.kind': 'age', 'partner.stop.age': '60', untilBothStop: 'half' }, { open: ['more'] }));
      for (const el of root.querySelectorAll('input')) {
        expect(root.querySelector(`label[for="${el.id}"]`)?.textContent.trim(), el.id).toBeTruthy();
        if (el.type === 'radio') expect(el.closest('fieldset').querySelector('legend').textContent.trim(), el.id).toBeTruthy();
      }
      expect(root.querySelector('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).toBe(null);
    }
  });
});

describe('7 — today, byte for byte', () => {
  /**
   * The hash of every named state as 6.19.0 drew it (before this work began). Every state draws exactly that — but a
   * couple's numbers step, which gains the partner's stop question (and A's "I've already stopped"), and C's more detail
   * from now, which gains the tax-free question: taken out, those screens are today's byte for byte too.
   */
  const TODAY = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/screens/today.hashes.json'), 'utf8'));
  // …and the spending shape's block under C's more detail (research/v7/spending-shape.md 4.1), closed: taken out, today's
  // …and the 2028 drawdown note, now for everyone it applies to (owner, 2 Oct 2026): a/answer-A2-couple (you 55, stopping at 56)
  // gains it; taken out, today's (tests/v7/shared/answers.flat.test.js holds who it is said to)
  const NEW = ['[data-field="partner.stop.kind"]', '[data-field="you.taxFreeTaken"]', '[data-field="partner.taxFreeTaken"]', '[data-region="shape"]',
    '[data-warning-id="drawdown-2028"]'];
  const hash = (html) => createHash('sha256').update(html).digest('hex').slice(0, 32);

  it.each(Object.keys(TODAY))('%s', (name) => {
    const [q, file] = name.split('/');
    const root = renderScreen(load(q, file));
    for (const sel of NEW) for (const el of root.querySelectorAll(sel)) el.remove();
    const already = root.querySelector('[data-testid$=".stop.kind.already"]');
    if (already) already.closest('.option').remove();
    expect(hash(root.innerHTML)).toBe(TODAY[name]);
  });
});

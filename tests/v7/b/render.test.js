/**
 * Question B's screens (step 4 brief 6, P5; test plan 10): every named state drawn in jsdom and held to checkScreen's
 * rules (R1–R16 and the scope rules), then what each screen must show, what each control sends, the keyboard order
 * and the labels. The states are tests/v7/states/b/*.json, written by build-states.mjs --question b.
 *
 * A and B are open on the joined-up branch only; these tests open them the same way (questions.js with all three
 * open) — nothing else is mocked.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, SCHEMA_B, get } from './_b.js';
import { checkScreen, draw, visibleText, expectedInputs, scopesFor, bannedHits } from '../render/checkScreen.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { money, pot, outOfTen } from '../../../src/answers/shared/format.js';
import { gridToShow, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { ADVICE_SHORT, ADVICE_FULL } from '../../../src/v7/copy/common.js';
import { B } from '../../../src/v7/copy/b.js';
import { CARRY_OPENS } from '../../../src/v7/state/carry.js';
import { LAYOUT_B } from '../../../src/v7/screens/b/NumbersScreen.jsx';
import { LEVERS } from '../../../src/v7/components/Levers.jsx';
import { VERSION } from '../../../src/constants.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const DIR = join(process.cwd(), 'tests/v7/states/b');
/** The brief's named states for B (4.13). */
const NAMES = [
  'numbers-blank', 'numbers-split-open', 'numbers-level', 'answer-nothing-entered', 'answer-working', 'answer-first', 'answer-B1',
  'answer-B2-on-course', 'answer-B4-before-57', 'answer-out-of-reach', 'answer-have', 'answer-B5-couple', 'answer-failed', 'answer-retired',
  'choices-B1', 'choices-on-course'
];
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const type = (el, text) => { el.value = text; fire(el, 'input'); };
const set = (path, value) => ({ type: 'draft/set', q: 'b', path, value });
const withResult = NAMES.filter((n) => load(n).answers.b.result);
const answers = NAMES.filter((n) => n.startsWith('answer-') && load(n).answers.b.result && load(n).answers.b.status !== 'failed');


describe('B: the named states', () => {
  it('are exactly the ones the brief names', () => {
    expect(readdirSync(DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s survives JSON and is a whole state with B open', (name) => {
    const s = load(name);
    expect(Object.keys(s).sort()).toEqual(['answers', 'draft', 'env', 'plan', 'route', 'session', 'ui']);
    expect(Object.keys(s.draft).sort()).toEqual(['a', 'b', 'c']);
    expect(s.route).toMatchObject({ screen: 'step', q: 'b' });
    expect(s.env.today).toBe('2026-09-30');
  });

  it.each(NAMES)('%s passes every rule of checkScreen', (name) => {
    const state = load(name);
    expect(checkScreen(renderScreen(state), state)).toEqual([]);
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
      expect(Number(el.getAttribute('data-value')), key).toBe(get(state.answers.b.result, key));
    }
    expect(visibleText(root)).not.toMatch(/undefined|NaN|-£0|−£0/);
  });

  it.each(NAMES)('%s: no countdown anywhere, and the banned list by scope', (name) => {
    const state = load(name);
    const text = visibleText(renderScreen(state));
    expect(text).not.toMatch(/\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i);
    expect(text).not.toMatch(/\bin \d+ (years|months)\b/i);
    expect(bannedHits(text, scopesFor(state))).toEqual([]);
  });

  it('every answer in a state is the real answerB — nothing is hand-made (re-run in tests/v7/states/states.slow.test.js)', () => {
    expect(MADE.answer).toBe('src/answers/b/answer.js');
    expect(MADE.patched).toEqual([]);
    for (const name of withResult) expect(load(name).answers.b.result.basis.futures, name).toBeGreaterThan(0);
  });
});

describe('B, step 1: what have you saved, and what are you paying in?', () => {
  it('blank: four boxes to type in, in the order of the drawing — the spending is the next step\'s; the button is never greyed out', () => {
    const root = renderScreen(load('numbers-blank'));
    expect(root.querySelector('h1').textContent).toBe(B.steps.numbers.label);
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['b.you.age', 'b.you.pot', 'b.you.payIn.total', 'b.stop.age']);
    expect(root.querySelector('[data-field^="spend."]')).toBe(null);
    expect(one(root, 'b.you.payIn.kind.total').checked).toBe(true);
    expect(one(root, 'b.you.payIn.total').getAttribute('placeholder')).toBe(null);   // required on B: nothing assumed
    expect(one(root, 'b.action.onward').textContent).toBe(B.buttons.onward);
    expect(one(root, 'b.action.onward').disabled).toBe(false);
    expect(one(root, 'b.savings')).toBe(null);                       // savings are under "more detail" on B
  });

  it('a single person types five things (age, pot, what goes in, the age in mind, spending); four with a level', () => {
    const required = (values) => SCHEMA_B.fields.filter((f) => f.required && Object.entries(f.when || {}).every(([p, w]) => (values[p] ?? SCHEMA_B.fields.find((x) => x.path === p).default) === w));
    expect(required({}).map((f) => f.path)).toEqual(['you.pot', 'you.age', 'you.payIn.total', 'stop.age', 'spend.amount']);
    expect(required({ 'spend.kind': 'level' }).length).toBe(5);       // the level is required too — but it is a choice, not typed
  });

  it('the layout draws every field of the list exactly once: at the top, or inside the choice it depends on (the spending on the spend step)', () => {
    const top = [...LAYOUT_B.you, ...LAYOUT_B.partner, ...LAYOUT_B.more, ...LAYOUT_B.spend];
    expect(new Set(top).size).toBe(top.length);
    for (const f of SCHEMA_B.fields) {
      if (f.path === 'household') continue;
      const parents = Object.keys(f.when || {}).filter((p) => p !== 'household');
      if (parents.length === 0) expect(top, f.path).toContain(f.path);
      else for (const p of parents) expect(top, `${f.path} under ${p}`).toContain(p);
    }
  });

  it('split it up: your part and your employer\'s inside the option, and no total box', () => {
    const root = renderScreen(load('numbers-split-open'));
    const split = one(root, 'b.you.payIn.kind.split');
    expect(split.checked).toBe(true);
    const option = split.closest('.option');
    expect(option.querySelector('[data-testid="b.you.payIn.own"]').value).toBe('450');
    expect(option.querySelector('[data-testid="b.you.payIn.employer"]').value).toBe('250');
    expect(one(root, 'b.you.payIn.total')).toBe(null);
  });

  it('a level: its monthly figure, the rule\'s, named under the choice', () => {
    for (const household of ['single', 'couple']) for (const level of ['minimum', 'moderate', 'comfortable']) expect(B.levels[household][level]).toBe(money(spendLevelAMonth(household, level)));
    const s = load('numbers-level');
    s.route = { ...s.route, step: 'spend' };                                             // the spending is on the spend step
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(one(root, 'b.spend.levelIs').textContent).toBe('Moderate: £2,608 a month for one person (Retirement Living Standards).');
    expect(one(root, 'b.spend.amount')).toBe(null);
  });

  it('more detail: savings, the two risk levels, the charge, the end age, and how often it should get there', () => {
    const s = load('numbers-blank');
    s.ui.open = ['more'];
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    for (const id of ['b.savings', 'b.savingsIn', 'b.savingRisk.balanced', 'b.risk.balanced', 'b.charge', 'b.endAge', 'b.confidence.nineInTen', 'b.you.alreadyDrawing.no']) expect(one(root, id), id).not.toBe(null);
    expect(one(root, 'b.confidence.nineInTen').checked).toBe(true);
  });

  it('the age in mind must be later than today\'s age, said with the way to "Will it last?"', () => {
    const s = load('numbers-blank');
    s.draft.b.values = { 'you.age': '50', 'stop.age': '50' };
    s.draft.b.touched = ['stop.age'];
    expect(renderScreen(s).querySelector('[data-error-for="b.stop.age"]').textContent).toBe(B.fields['stop.age'].errors['stop-after-now']);
  });

  it('typing and choosing send plain actions for B; the first box on screen that needs attention takes focus', () => {
    const { root, actions } = draw(load('numbers-blank'));
    type(one(root, 'b.you.payIn.total'), '700');
    one(root, 'b.you.payIn.kind.split').click();
    expect(actions).toEqual([set('you.payIn.total', '700'), set('you.payIn.kind', 'split')]);
    const again = draw(load('numbers-blank'));
    document.body.appendChild(again.root);
    try {
      fire(one(again.root, 'b.action.onward').closest('form'), 'submit');
      expect(again.actions).toEqual([{ type: 'draft/onward', q: 'b' }]);
      expect(document.activeElement.id).toBe('b.you.age');
    } finally { again.root.remove(); }
  });

  it.each(NAMES)('%s: every box has a label, every group a legend, every button words', (name) => {
    const root = renderScreen(load(name));
    for (const el of root.querySelectorAll('input')) {
      expect(root.querySelector(`label[for="${el.id}"]`)?.textContent.trim(), `label for ${el.id}`).toBeTruthy();
      if (el.type === 'radio') expect(el.closest('fieldset').querySelector('legend').textContent.trim(), el.id).toBeTruthy();
    }
    for (const b of root.querySelectorAll('button')) expect((b.textContent.trim() || b.getAttribute('aria-label')), 'a button').toBeTruthy();
    expect(root.querySelector('h1').getAttribute('tabindex')).toBe('-1');
  });

  it.each(['numbers-blank', 'numbers-split-open', 'numbers-level'])('%s: the boxes in the drawn order, then the button', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    const stops = [...root.querySelectorAll('input, button, a[href]')];
    const boxes = stops.filter((el) => el.tagName === 'INPUT').map((el) => el.getAttribute('data-testid'));
    expect([...boxes].sort()).toEqual([...expectedInputs(state)].sort());
    expect(boxes.slice(0, 2)).toEqual(['b.you.age', 'b.you.pot']);
    expect(stops.findIndex((el) => el.getAttribute('data-testid') === 'b.action.onward')).toBeGreaterThan(stops.map((el) => el.tagName).lastIndexOf('INPUT'));
  });
});

describe('B, step 2: am I on course, and what should I pay in?', () => {
  it('nothing entered: the step asks for its five things itself', () => {
    const root = renderScreen(load('answer-nothing-entered'));
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['b.you.age', 'b.you.pot', 'b.you.payIn.total', 'b.stop.age', 'b.spend.amount']);
    expect(root.textContent).toContain(B.answer.needFive);
    expect(root.querySelector('[data-headline]')).toBe(null);
  });

  it.each(answers)('%s: one headline, with its sentence and its bad-case line; when short the pay-in, and the number a guide under it', (name) => {
    const state = load(name);
    const r = state.answers.b.result;
    const root = renderScreen(state);
    const heads = [...root.querySelectorAll('[data-headline]')].map((h) => h.getAttribute('data-headline'));
    // no number at all (more than £5,000,000): no headline, the b.none.pot sentence in its place
    // (a number of £0 — no pension pot needed — is said in words, with no number headline; when short, the pay-in — B's
    // answer — is the one headline, and the number, a guide, follows in a smaller block that is not a headline: the
    // reviewers' finding, 1 Oct 2026 — two headline cards invited a sum that contradicted the answer)
    const pay = !r.onCourse && r.payIn && typeof r.payIn.needed === 'number' && !!r.sentences.payInHead;
    const num = r.number !== null && r.number.careful > 0;
    const want = pay ? ['payIn.needed'] : num ? ['number.careful'] : [];
    expect(heads).toEqual(want);
    const guide = root.querySelector('[data-guide="number.careful"]');
    expect(!!guide, 'the number as a guide').toBe(pay && num);
    if (guide) {
      expect(guide.classList.contains('headline')).toBe(false);
      expect(guide.querySelector('.figure')).toBe(null);
      expect(guide.querySelector('[data-sentence="number.careful"]').textContent).toBe(r.sentences.line.text);
      expect(guide.textContent).toContain(r.sentences.guide.text);
    }
    if (num) expect(root.textContent).toContain(r.sentences.guide.text);
    for (const h of root.querySelectorAll('[data-headline]')) {
      expect(h.querySelector(`[data-sentence="${h.getAttribute('data-headline')}"]`).textContent.trim()).toBeTruthy();
      expect(h.textContent).toMatch(/the worst 1 in 10/);
      expect(h.textContent).toContain(ADVICE_SHORT);
    }
    expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_FULL);
  });

  it('short (B1): the pay-in that gets there, with the employer\'s part named, then the number', () => {
    const state = load('answer-B1');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    const number = root.querySelector('[data-guide="number.careful"]');
    expect(number.querySelector('[data-key="number.careful"]').textContent).toBe(pot(r.number.careful));
    expect(number.querySelector('[data-sentence="number.careful"]').textContent).toBe(r.sentences.line.text);
    expect(number.textContent).toContain(r.sentences.bad.text);
    const payIn = root.querySelector('[data-headline="payIn.needed"]');
    expect(payIn.querySelector('[data-key="payIn.needed"]').textContent).toBe(money(r.payIn.needed));
    expect(payIn.textContent).toContain(r.sentences.payInSub.text);
    expect(payIn.querySelector('[data-sentence="payIn.needed"]').textContent).toBe(r.sentences.payInLine.text);
    const pots = root.querySelector('[data-pots]');
    expect(pots.textContent).toContain(r.sentences.potsNow.text);
    expect(pots.textContent).toContain(r.sentences.potsNeeded.text);
    expect(pots.querySelector('[data-key="potAtStop.now.careful"]').getAttribute('data-kind')).toBe('pot');
    expect(root.textContent).toContain(r.sentences.wholeLife.text);
  });

  it('the levers: one card each, side by side, in the brief\'s order; "Try" on each but accept', () => {
    const state = load('answer-B1');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    const cards = [...root.querySelectorAll('[data-levers] [data-lever]')];
    expect(cards.map((c) => c.getAttribute('data-lever'))).toEqual(LEVERS.filter((id) => r.levers[id]));
    for (const c of cards) {
      const id = c.getAttribute('data-lever');
      expect(c.textContent).toContain(B.answer.lever[id]);
      expect(c.textContent).toContain(r.sentences.lever[id].text);
      // no "Try" on accept, nor on more risk while saving that does not help (its sentence says so)
      expect(!!c.querySelector(`[data-testid="b.lever.${id}.try"]`), id).toBe(id !== 'accept' && !(id === 'moreRisk' && r.levers.moreRisk.helps === false));
    }
    expect(one(root, 'b.action.choices').getAttribute('href')).toBe('#/b/choices');
  });

  it('"Try" puts that lever\'s value in the boxes; a lever the answer could not find has no button', () => {
    const wants = {
      stopLater: (r) => [set('stop.age', String(r.levers.stopLater.age))],
      // with the savings a month the years before a pension opens need, when the lever names them
      payMore: (r) => [set('you.payIn.total', money(r.levers.payMore.payIn).slice(1)), set('you.payIn.kind', 'total'),
        ...(typeof r.levers.payMore.savingsIn === 'number' ? [set('savingsIn', money(r.levers.payMore.savingsIn).slice(1))] : [])],
      spendLess: (r) => [set('spend.amount', money(r.levers.spendLess.spend).slice(1)), set('spend.kind', 'amount')],
      moreRisk: (r) => [set('savingRisk', r.levers.moreRisk.level)]
    };
    const seen = new Set();
    for (const name of answers.filter((n) => load(n).answers.b.result.inputs.household !== 'couple')) {
      const r = load(name).answers.b.result;
      for (const id of Object.keys(wants)) {
        const { root, actions } = draw(load(name));
        const button = one(root, `b.lever.${id}.try`);
        if (!r.levers || !r.levers[id] || r.onCourse) { expect(button, `${name} ${id}`).toBe(null); continue; }
        if (id === 'moreRisk' && r.levers.moreRisk.helps === false) continue;
        button.click();
        expect(actions, `${name} ${id}`).toEqual(wants[id](r));
        seen.add(id);
      }
    }
    expect([...seen]).toEqual(expect.arrayContaining(['payMore', 'spendLess']));
    // stop later: the first state that finds one; its button carries the age the same way
    const later = answers.map(load).find((st) => st.answers.b.result.levers && st.answers.b.result.levers.stopLater && !st.answers.b.result.onCourse);
    expect(later, 'some state finds a later age').toBeTruthy();
    const { root, actions } = draw(later);
    one(root, 'b.lever.stopLater.try').click();
    expect(actions).toEqual(wants.stopLater(later.answers.b.result));
  });

  it('on course: one headline, no levers, and how little could still get there', () => {
    const state = load('answer-B2-on-course');
    const root = renderScreen(state);
    expect(root.querySelector('[data-levers]')).toBe(null);
    expect(root.querySelector('[data-headline="number.careful"]').textContent).toContain(state.answers.b.result.sentences.bad.text);
  });

  it('before the pension opens: the part outside the pension is named under the number', () => {
    const state = load('answer-B4-before-57');
    const root = renderScreen(state);
    expect(root.querySelector('[data-headline="number.careful"], [data-guide="number.careful"]').textContent).toContain(state.answers.b.result.sentences.outside.text);
    expect(root.querySelector('[data-warning-id="pension-closed"]')).not.toBe(null);
  });

  it('out of reach: no pay-in headline; the plain sentence in its place', () => {
    const state = load('answer-out-of-reach');
    const root = renderScreen(state);
    expect(root.querySelector('[data-headline="payIn.needed"]')).toBe(null);
    expect(root.textContent).toContain(state.answers.b.result.sentences.none.text);
    expect(root.querySelector('[data-lever="payMore"]')).toBe(null);
  });

  it('already there: says so, with every future', () => {
    const state = load('answer-have');
    expect(renderScreen(state).textContent).toContain(state.answers.b.result.sentences.have.text);
  });

  it('a couple: the number between you; the household pay-in has no one box, so "Pay in more" has no "Try"', () => {
    const state = load('answer-B5-couple');
    const root = renderScreen(state);
    // short, so the pay-in is the headline and the number a guide below it, between you
    const r = state.answers.b.result;
    expect(root.querySelector(r.onCourse ? '#answer-figure' : '[data-guide="number.careful"] .guide-figure').textContent).toBe(r.sentences.head.text);
    expect(one(root, 'b.lever.payMore.try')).toBe(null);
    expect(one(root, 'b.lever.stopLater.try')).not.toBe(null);
    expect(root.querySelector('[aria-labelledby="try-payIn"] .try-label').textContent).toBe(B.answer.tryPayInCouple);
  });

  it('what next carries B\'s figures: one action each, no figure in an address', () => {
    const { root, actions } = draw(load('answer-B1'));
    one(root, 'b.next.a').click();
    one(root, 'b.next.c').click();
    expect(actions).toEqual([{ type: 'draft/carry', from: 'b', to: 'a' }, { type: 'draft/carry', from: 'b', to: 'c' }]);
    expect(one(root, 'b.next.a').getAttribute('href')).toBe(`#/${CARRY_OPENS['b→a'].q}/${CARRY_OPENS['b→a'].step}`);
    expect(one(root, 'b.next.c').getAttribute('href')).toBe(`#/${CARRY_OPENS['b→c'].q}/${CARRY_OPENS['b→c'].step}`);
  });

  it('failed: the numbers shown to be still here, with what goes in', () => {
    const { root, actions } = draw(load('answer-failed'));
    expect(root.querySelector('.problem-figures').textContent).toBe('Pot £120,000, age 50, stop at 60, £2,000 a month');
    one(root, 'b.action.retry').click();
    expect(actions).toEqual([{ type: 'answer/retry', q: 'b' }]);
  });

  it('retired: for people still paying in — the view and nothing else', () => {
    const { root, actions } = draw(load('answer-retired'));
    expect(root.querySelector('main').getAttribute('data-view')).toBe('retired');
    expect(root.querySelector('h1').textContent).toBe(B.retired.title);
    expect(root.querySelector('input')).toBe(null);
    one(root, 'b.action.imWorking').click();
    expect(actions).toEqual([set('stop.age', '')]);
  });
});

describe('B, try a change', () => {
  const press = (state, id) => { const { root, actions } = draw(state); one(root, id).click(); return actions; };
  it('what goes in by £50 — your two parts added up as typed, then one figure', () => {
    // the figure first, then the choice it belongs to: no step in between is a draft that does not parse
    expect(press(load('answer-B1'), 'b.try.payIn.up')).toEqual([set('you.payIn.total', '750'), set('you.payIn.kind', 'total')]);
    expect(press(load('answer-B1'), 'b.try.payIn.down')).toEqual([set('you.payIn.total', '650'), set('you.payIn.kind', 'total')]);
  });
  it('the stop age never reaches today\'s age; the spending by £100; the risk while saving; how often', () => {
    expect(press(load('answer-B1'), 'b.try.stop.down')).toEqual([set('stop.age', '59')]);
    const s = load('answer-B1');
    s.draft.b.values = { ...s.draft.b.values, 'stop.age': '51' };
    expect(one(renderScreen(s), 'b.try.stop.down').disabled).toBe(true);
    expect(press(load('answer-B1'), 'b.try.spend.up')).toEqual([set('spend.amount', '2,100'), set('spend.kind', 'amount')]);
    expect(press(load('answer-B1'), 'b.try.savingRisk.cautious')).toEqual([set('savingRisk', 'cautious')]);
    expect(press(load('answer-B1'), 'b.try.confidence.threeInFour')).toEqual([set('confidence', 'threeInFour')]);
    expect(one(renderScreen(load('answer-B1')), 'b.try.confidence.nineInTen').getAttribute('aria-pressed')).toBe('true');
  });
  it('before / now: the answer\'s own b.change for now', () => {
    const state = load('answer-B1');
    expect(renderScreen(state).querySelector('.before-now').textContent).toContain(state.answers.b.result.sentences.change.text);
  });
});

describe('B, step 3: stop later, pay in more, or both', () => {
  it('the grid\'s rows and columns are the input list\'s rule (gridToShow); each cell the answer\'s count', () => {
    const state = load('choices-B1');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    expect(root.querySelector('h1').textContent).toBe(B.steps.choices.label);
    const grid = root.querySelector('[data-grid]');
    // the grid is built around the answer: the stop-later age and the pay-in that gets there (one test everywhere)
    const rule = gridToShow(r.inputs, { today: state.env.today }, { stopLater: r.levers.stopLater ? r.levers.stopLater.age : null, needed: r.payIn.needed });
    expect([...grid.querySelectorAll('tbody tr')].map((tr) => Number(tr.getAttribute('data-age')))).toEqual(rule.ages);
    expect(r.grid.payIns).toEqual(rule.payIns);
    r.grid.ages.forEach((row, k) => row.cells.forEach((cell, j) => {
      const td = grid.querySelector(`[data-cell="${row.age}:${cell.payIn}"]`);
      expect(td.getAttribute('data-key')).toBe(`grid.ages.${k}.cells.${j}.lasted`);
      expect(td.className.includes('is-careful')).toBe(typeof cell.verdict === 'string' ? cell.verdict === 'yes' : !outOfTen(cell.lasted).only);
    }));
    expect(grid.querySelector('[aria-current="true"]').getAttribute('data-age')).toBe(String(r.stop.age));
  });
  it('pressing a cell puts that stop age and pay-in in the numbers and goes back to the answer', () => {
    const state = load('choices-B1');
    const g = state.answers.b.result.grid;
    const age = g.ages[Math.min(2, g.ages.length - 1)].age;
    const payIn = g.payIns[Math.min(1, g.payIns.length - 1)];
    const { root, actions } = draw(state);
    const cell = one(root, `b.grid.${age}.${payIn}`);
    expect(cell.getAttribute('href')).toBe('#/b/answer');
    cell.click();
    expect(actions).toEqual([set('stop.age', String(age)), set('you.payIn.total', money(payIn).slice(1)), set('you.payIn.kind', 'total')]);
    expect(one(root, 'b.action.back').getAttribute('href')).toBe('#/b/answer');
  });
  it('on course: it says so first', () => {
    const root = renderScreen(load('choices-on-course'));
    expect(one(root, 'b.choices.onCourse').textContent).toBe(B.choices.onCourse);
    expect(root.querySelector('[data-grid]')).not.toBe(null);
  });
  it('the grid not here yet (the step\'s pass under way): says it is working, never a blank table', () => {
    const s = load('answer-B1');
    s.route.step = 'choices';
    s.answers.b.extending = true;
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-grid]')).toBe(null);
    expect(root.textContent).toContain(B.choices.working);
  });
});

describe('B: the words and the input list agree', () => {
  it('every field path has a label; every choice has words for each option', () => {
    for (const f of SCHEMA_B.fields) {
      expect(B.fields[f.path]?.label, f.path).toBeTruthy();
      for (const o of f.options || []) expect(B.fields[f.path].options[o], `${f.path}: ${o}`).toBeTruthy();
      if (f.type === 'yesNo') expect(B.fields[f.path].options.yes && B.fields[f.path].options.no, f.path).toBeTruthy();
    }
    expect(Object.keys(B.fields).sort()).toEqual(SCHEMA_B.fields.map((f) => f.path).sort());
  });
  it('every message a field can get has a sentence; every rule its own', () => {
    for (const f of SCHEMA_B.fields.filter((x) => ['money', 'age', 'percent', 'count'].includes(x.type))) {
      for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(B.fields[f.path].errors?.[id] || B.errors[f.type][id], `${f.path} ${id}`).toBeTruthy();
    }
    for (const rule of SCHEMA_B.rules) expect(B.fields[rule.fields[0]].errors[rule.id], rule.id).toBeTruthy();
  });
  it('every step and every next sentence of the rail has its words', async () => {
    const { QUESTION_B, NEXT_B } = await import('../../../src/v7/rail/b.js');
    for (const s of QUESTION_B.steps) { expect(B.steps[s.id].label, s.id).toBeTruthy(); expect(B.steps[s.id].short, s.id).toBeTruthy(); }
    for (const id of NEXT_B) expect(B.next[id], id).toBeTruthy();
  });
});

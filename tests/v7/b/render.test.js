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
import { renderScreen, SCHEMA_B, get, answerB, TEST_ENV } from './_b.js';
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
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const DIR = join(process.cwd(), 'tests/v7/states/b');
/** The brief's named states for B (4.13). */
const NAMES = [
  'numbers-blank', 'numbers-split-open', 'numbers-level', 'answer-nothing-entered', 'answer-working', 'answer-first', 'answer-B1',
  'answer-B2-on-course', 'answer-B4-before-57', 'answer-out-of-reach', 'answer-have', 'answer-B5-couple', 'answer-failed', 'answer-retired',
  'choices-B1', 'choices-on-course',
  // a share of pay, said and tried as a share (research/saving-enough-and-check-in.md 3, release step R1): Sam, fictional
  'answer-share', 'choices-share'
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

  it('a share of your pay (6.46.0): the pay, your part and your employer\'s part as percentages inside the option, what lands under them', () => {
    const state = clone(load('numbers-split-open'));
    state.draft.b.values = { ...state.draft.b.values, 'you.payIn.kind': 'share', 'you.payIn.pay': '40,000', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3' };
    const root = renderScreen(state);
    expect(checkScreen(root, state)).toEqual([]);
    const share = one(root, 'b.you.payIn.kind.share');
    expect(share.checked).toBe(true);
    const option = share.closest('.option');
    expect(option.querySelector('[data-testid="b.you.payIn.pay"]').value).toBe('40,000');
    expect(option.querySelector('[data-testid="b.you.payIn.ownPct"]').value).toBe('5');
    expect(option.querySelector('[data-testid="b.you.payIn.employerPct"]').value).toBe('3');
    expect(option.querySelector('[data-testid="b.you.payIn.lands"]').textContent).toBe('£167 a month from you and £100 from your employer.');
    for (const id of ['b.you.payIn.total', 'b.you.payIn.own', 'b.you.payIn.employer']) expect(one(root, id), id).toBe(null);
    expect(expectedInputs(state).filter((id) => id.startsWith('b.you.payIn.')).sort()).toEqual(['b.you.payIn.employerPct', 'b.you.payIn.kind.share', 'b.you.payIn.kind.split', 'b.you.payIn.kind.total', 'b.you.payIn.ownPct', 'b.you.payIn.pay']);
    // a box blank: no line yet (a fresh draft: the parsed draft is remembered by the values object)
    const blank = clone(state);
    blank.draft.b.values = { ...state.draft.b.values, 'you.payIn.pay': '' };
    expect(one(renderScreen(blank), 'b.you.payIn.lands')).toBe(null);
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
    for (const id of ['b.savings', 'b.savingsIn', 'b.savingRisk.balanced', 'b.risk.balanced', 'b.charge', 'b.endAge', 'b.confidence.balanced', 'b.you.alreadyDrawing.no']) expect(one(root, id), id).not.toBe(null);
    expect(one(root, 'b.confidence.balanced').checked).toBe(true);
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

  it.each(answers)('%s: one headline, the verdict said straight; what would be enough under it; the number a guide below', (name) => {
    const state = load(name);
    const r = state.answers.b.result;
    const root = renderScreen(state);
    const heads = [...root.querySelectorAll('[data-headline]')].map((h) => h.getAttribute('data-headline'));
    // the verdict is the one headline (saving-enough-and-check-in.md 2.2–2.3): its band in words, the first sentence that
    // says how it stands and what would be enough, what you could spend from the stop and the gap, the bad case at the aim.
    // The number, a guide, follows in a smaller block that is not a headline (the reviewers' finding, 1 Oct 2026 — two
    // headline cards invited a sum that contradicted the answer); "the State Pension covers it" has a headline in words
    const verdict = r.status !== 'guaranteed-only';
    const num = r.number !== null && r.levels.balanced.pot > 0;
    expect(heads).toEqual(verdict ? ['verdict'] : []);
    if (verdict) {
      const v = root.querySelector('[data-headline="verdict"]');
      expect(v.querySelector('[data-verdict]').getAttribute('data-verdict')).toBe(r.verdict.band);
      expect(v.querySelector('#answer-figure').textContent).toBe(r.sentences.verdictHead.text);
      expect(v.querySelector('[data-sentence="verdict"]').textContent).toBe(r.sentences.verdictLine.text);
      expect(v.textContent).toContain(r.sentences.income.text);
      expect(v.textContent).toContain(r.sentences.atAim.text);
      if (r.verdict.band === 'close') expect(v.textContent).toContain(r.sentences.verdictFour.text);
    }
    const guide = root.querySelector('[data-guide="levels.balanced.pot"]');
    expect(!!guide, 'the number as a guide').toBe(verdict && num);
    if (guide) {
      expect(guide.classList.contains('headline')).toBe(false);
      expect(guide.querySelector('.figure')).toBe(null);
      expect(guide.querySelector('[data-sentence="levels.balanced.pot"]').textContent).toBe(r.sentences.line.text);
      expect(guide.textContent).toContain(r.sentences.guide.text);
    }
    if (num) expect(root.textContent).toContain(r.sentences.guide.text);
    // the screen's order (R1): the verdict, then what would be enough and the other ways, then the guide number
    const at = (sel) => root.querySelector(sel);
    const before = (a, b) => !a || !b || Boolean(a.compareDocumentPosition(b) & window.Node.DOCUMENT_POSITION_FOLLOWING);
    expect(before(at('[data-headline="verdict"]'), at('[data-enough]')), 'the verdict before what would be enough').toBe(true);
    expect(before(at('[data-enough]'), at('[data-levers]')), 'what would be enough before the other ways').toBe(true);
    expect(before(at('[data-levers]'), at('[data-guide]')), 'the other ways before the guide number').toBe(true);
    expect(before(at('[data-headline="verdict"]'), at('[data-guide]')), 'the verdict before the guide number').toBe(true);
    for (const h of root.querySelectorAll('[data-headline]')) {
      expect(h.querySelector(`[data-sentence="${h.getAttribute('data-headline')}"]`).textContent.trim()).toBeTruthy();
      expect(h.textContent).toMatch(/the worst 1 in 10/);
      expect(h.textContent).toContain(ADVICE_SHORT);
    }
    expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_FULL);
  });

  it('short (B1): not on course, and what would be on course in the first sentence; then what would be enough, with the employer\'s part named; then the number', () => {
    const state = load('answer-B1');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    const v = root.querySelector('[data-headline="verdict"]');
    expect(r.verdict.band).toBe('no');
    expect(v.querySelector('#answer-figure').textContent).toBe(`Not on course for ${money(r.spend.perMonth)} a month from ${r.stop.age}`);
    // the first sentence: as now (the employer's part named), then the figure that would be on course, and for 3 in 4
    const first = v.querySelector('[data-sentence="verdict"]');
    expect(first.textContent).toContain(`Paying in ${money(r.payIn.now)} a month as now (your employer's ${money(r.payIn.employer)} included)`);
    expect(first.textContent).toContain(`${money(r.enough.atLevel.payIn)} a month (you ${money(r.enough.atLevel.own)}, your employer's ${money(r.enough.atLevel.employer)} as now) would put you on course, which is Balanced: 18 times in 20`);
    expect(first.querySelector('[data-key="enough.atLevel.payIn"]').getAttribute('data-value')).toBe(String(r.enough.atLevel.payIn));
    // the two incomes and the gap a year, with the State Pension named
    const income = v.querySelector('[data-testid="b.verdict.income"]');
    expect(income.textContent).toContain(`you could spend ${money(r.income.bad)} a month from ${r.stop.age}, with`);   // (7.8.0: the middling income left)
    expect(income.textContent).toMatch(/State Pension from \d+ \(the full amount, as assumed\)/);
    expect(income.textContent).toContain(`${money(r.gap.month)} a month (${money(r.gap.year)} a year) less than you want`);
    // what would be enough, straight under it
    const enough = root.querySelector('[data-enough]');
    expect(enough.getAttribute('data-enough')).toBe('pounds');
    expect(enough.querySelector('h2').textContent).toBe(r.sentences.enoughHead.text);
    expect(enough.textContent).toContain(r.sentences.enoughLine.text);
    expect(r.sentences.enoughFour).toBeUndefined();                    // (7.8.0: one figure, at the level)
    expect(enough.textContent).toContain(r.sentences.enoughMatch.text);
    const number = root.querySelector('[data-guide="levels.balanced.pot"]');
    expect(number.querySelector('[data-key="levels.balanced.pot"]').textContent).toBe(pot(r.levels.balanced.pot));
    expect(number.querySelector('[data-sentence="levels.balanced.pot"]').textContent).toBe(r.sentences.line.text);
    expect(number.textContent).toContain(r.sentences.bad.text);
    // B's own whole-£10 figure is no longer a headline of its own: what would be enough says it
    expect(root.querySelector('[data-headline="payIn.needed"]')).toBe(null);
    const pots = root.querySelector('[data-pots]');
    expect(pots.textContent).toContain(r.sentences.potsNow.text);
    expect(pots.textContent).toContain(r.sentences.potsNeeded.text);
    expect(pots.querySelector('[data-key="potAtStop.now.careful"]').getAttribute('data-kind')).toBe('pot');
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
      // with the savings a month the years before a pension opens need, when the lever names them; a pay-in entered as your
      // part and your employer's keeps the employer's part — your part is the rest of the lever's figure (2 Nov 2026)
      payMore: (r) => {
        const p = r.inputs.you.payIn;
        // a share of pay keeps its kind: the lever's own share is written (saving-enough-and-check-in.md 3.6)
        if (p.kind === 'share') return [set('you.payIn.ownPct', String(r.levers.payMore.ownPct)), set('you.payIn.kind', 'share')];
        const split = p.kind === 'split';
        return [
          split ? set('you.payIn.own', money(r.levers.payMore.payIn - (p.employer || 0)).slice(1)) : set('you.payIn.total', money(r.levers.payMore.payIn).slice(1)),
          set('you.payIn.kind', split ? 'split' : 'total'),
          ...(typeof r.levers.payMore.savingsIn === 'number' ? [set('savingsIn', money(r.levers.payMore.savingsIn).slice(1))] : [])
        ];
      },
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

  it('on course: one headline, no levers, nothing more "to be on course", and how little could still get there', () => {
    const state = load('answer-B2-on-course');
    const r = state.answers.b.result;
    const root = renderScreen(state);
    expect(root.querySelector('[data-levers]')).toBe(null);
    expect(root.querySelector('[data-enough]')).toBe(null);
    const v = root.querySelector('[data-headline="verdict"]');
    expect(v.querySelector('[data-verdict]').getAttribute('data-verdict')).toBe('yes');
    expect(v.querySelector('#answer-figure').textContent).toBe(`On course for ${money(r.spend.perMonth)} a month from ${r.stop.age}`);
    expect(r.enough.atLevel.payIn).toBeLessThan(r.payIn.now);
    expect(v.querySelector('[data-sentence="verdict"]').textContent).toContain(`You could pay in as little as ${money(r.enough.atLevel.payIn)} a month and still be on course.`);
    expect(root.querySelector('[data-guide="levels.balanced.pot"]').textContent).toContain(r.sentences.bad.text);
  });

  it('before the pension opens: the part outside the pension is named under the number', () => {
    const state = load('answer-B4-before-57');
    const root = renderScreen(state);
    expect(root.querySelector('[data-headline="levels.balanced.pot"], [data-guide="levels.balanced.pot"]').textContent).toContain(state.answers.b.result.sentences.outside.text);
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
    // the verdict is the headline, the number a guide below it, between you
    const r = state.answers.b.result;
    expect(root.querySelector('[data-guide="levels.balanced.pot"] .guide-figure').textContent).toBe(r.sentences.head.text);
    expect(root.querySelector('#answer-figure').textContent).toBe(r.sentences.verdictHead.text);
    expect(r.sentences.verdictHead.text).toContain(' a month between you from when you are ');
    expect(one(root, 'b.lever.payMore.try')).toBe(null);
    expect(one(root, 'b.lever.stopLater.try')).not.toBe(null);
    expect(root.querySelector('[aria-labelledby="try-payIn"] .try-label').textContent).toBe(B.answer.tryPayInCouple);
  });

  it('a share of pay (Sam): what would be enough said as a share, in the first sentence and in its block; "Try" writes the share and keeps the kind', () => {
    const state = load('answer-share');
    const r = state.answers.b.result;
    const { root, actions } = draw(state);
    const nine = r.enough.atLevel;
    expect(r.enough.how).toBe('share');
    const first = root.querySelector('[data-sentence="verdict"]');
    expect(first.textContent).toContain(`Paying in ${r.enough.now.totalPct}% of your pay as now (${money(r.payIn.now)} a month, your employer's 4% included)`);
    expect(first.textContent).toContain(`${nine.totalPct}% of your pay in all (you ${nine.ownPct}%, ${money(nine.payIn)} a month) would put you on course, which is Balanced: 18 times in 20`);
    expect(first.querySelector('[data-key="enough.atLevel.totalPct"]').getAttribute('data-kind')).toBe('pct');
    expect(root.querySelector('[data-enough="share"] h2').textContent).toBe(`To be on course: ${nine.totalPct}% of your pay in all`);
    one(root, 'b.lever.payMore.try').click();
    expect(actions).toEqual([set('you.payIn.ownPct', String(nine.ownPct)), set('you.payIn.kind', 'share')]);
  });

  it('no sentence is said twice on the answer: every named answer, and the Close band (where today\'s pay-in already lasts in 3 futures out of 4) at either chance', () => {
    const repeats = (root) => {
      const seen = new Map();
      for (const el of root.querySelectorAll('[data-region="answer"] [data-sentence-id]')) {
        const t = el.textContent.trim();
        if (t) seen.set(t, (seen.get(t) || 0) + 1);
      }
      return [...seen].filter(([, k]) => k > 1).map(([t]) => t);
    };
    for (const name of answers) expect(repeats(renderScreen(load(name))), name).toEqual([]);
    // Sam paying 24% in all (20% and the employer's 4%): Close at Balanced (7.8.0: weighed by how long people live, the level,
    // typed or not; 22% in all is no longer close)
    for (const confidence of ['balanced']) {
      const state = clone(load('answer-share'));
      const inputs = { ...state.answers.b.result.inputs, you: { ...state.answers.b.result.inputs.you, payIn: { ...state.answers.b.result.inputs.you.payIn, ownPct: 20 } }, confidence };
      const r = answerB(inputs, { ...TEST_ENV, futures: state.answers.b.result.basis.futures });
      expect(r.verdict.band).toBe('close');
      state.answers.b.result = r;
      const root = renderScreen(state);
      expect(root.querySelector('[data-testid="b.verdict.four"]')).toBe(null);           // (the "3 in 4" line left with its figure)
      expect(repeats(root), confidence).toEqual([]);
    }
  });

  it('the grid in shares (Sam): the columns are shares of pay with the pounds each lands; the share that would be enough is marked; a cell writes its share', () => {
    const state = load('choices-share');
    const r = state.answers.b.result;
    const { root, actions } = draw(state);
    const heads = [...root.querySelectorAll('[data-grid] thead th[data-share]')];
    expect(heads.map((h) => Number(h.getAttribute('data-share')))).toEqual(r.grid.shares);
    expect(heads.map((h) => h.querySelector('[data-key^="grid.shares."]').textContent)).toEqual(r.grid.shares.map((x) => `${x}%`));
    expect(heads.map((h) => h.querySelector('[data-key^="grid.payIns."]').textContent)).toEqual(r.grid.payIns.map((x) => money(x)));
    expect(root.querySelector(`[data-grid] th[data-share="${r.enough.atLevel.totalPct}"]`).hasAttribute('data-col-needed')).toBe(true);
    expect(one(root, 'b.grid.shareKey').textContent).toBe(B.choices.shareKey);
    const age = r.grid.ages[0].age;
    const j = r.grid.shares.length - 1;
    one(root, `b.grid.${age}.${r.grid.payIns[j]}`).click();
    expect(actions).toEqual([set('stop.age', String(age)), set('you.payIn.ownPct', String(r.grid.shares[j] - 4)), set('you.payIn.kind', 'share')]);
  });

  it('what next carries B\'s figures: one action each, no figure in an address', () => {
    const { root, actions } = draw(load('answer-B1'));
    one(root, 'b.next.a').click();
    one(root, 'b.next.c').click();
    expect(actions).toEqual([{ type: 'draft/carry', from: 'b', to: 'a' }, { type: 'draft/carry', from: 'b', to: 'c' }]);
    expect(one(root, 'b.next.a').getAttribute('href')).toBe(`#/${CARRY_OPENS['b→a'].q}/${CARRY_OPENS['b→a'].step}`);
    expect(one(root, 'b.next.c').getAttribute('href')).toBe(`#/${CARRY_OPENS['b→c'].q}/${CARRY_OPENS['b→c'].step}`);
  });

  it('failed: the numbers shown to be still here, with what goes in (the two parts added up, as one figure would be: 6.46.0)', () => {
    const { root, actions } = draw(load('answer-failed'));
    expect(root.querySelector('.problem-figures').textContent).toBe('Pot £120,000, age 50, £700 a month in, stop at 60, £2,000 a month');
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
  it('what goes in by £50 — the whole figure stepped; a split entry moves your part and keeps the employer\'s (2 Nov 2026); one figure stays one', () => {
    // the figure first, then the choice it belongs to: no step in between is a draft that does not parse. B1 is entered as
    // £450 from you and £250 from the employer: £700 shown, +£50 is £500 from you (before, one figure of £750 — and the kept
    // plan then read "£0 from your employer")
    expect(press(load('answer-B1'), 'b.try.payIn.up')).toEqual([set('you.payIn.own', '500'), set('you.payIn.kind', 'split')]);
    expect(press(load('answer-B1'), 'b.try.payIn.down')).toEqual([set('you.payIn.own', '400'), set('you.payIn.kind', 'split')]);
    // one figure (B4: £400 typed as one figure) stays one figure
    expect(load('answer-B4-before-57').draft.b.values['you.payIn.total']).toBe('400');
    expect(press(load('answer-B4-before-57'), 'b.try.payIn.up')).toEqual([set('you.payIn.total', '450'), set('you.payIn.kind', 'total')]);
    expect(press(load('answer-B4-before-57'), 'b.try.payIn.down')).toEqual([set('you.payIn.total', '350'), set('you.payIn.kind', 'total')]);
    // nothing of yours left to take off: "− £50" is not offered (the employer's part is not yours to cut)
    const none = clone(load('answer-B1'));
    none.draft.b.values = { ...none.draft.b.values, 'you.payIn.own': '0' };
    const { root } = draw(none);
    expect(one(root, 'b.try.payIn.down').disabled).toBe(true);
    expect(one(root, 'b.try.payIn.up').disabled).toBe(false);
  });
  it('the stop age never reaches today\'s age; the spending by £100; the risk while saving; how often', () => {
    expect(press(load('answer-B1'), 'b.try.stop.down')).toEqual([set('stop.age', '59')]);
    const s = load('answer-B1');
    s.draft.b.values = { ...s.draft.b.values, 'stop.age': '51' };
    expect(one(renderScreen(s), 'b.try.stop.down').disabled).toBe(true);
    expect(press(load('answer-B1'), 'b.try.spend.up')).toEqual([set('spend.amount', '2,100'), set('spend.kind', 'amount')]);
    expect(press(load('answer-B1'), 'b.try.savingRisk.cautious')).toEqual([set('savingRisk', 'cautious')]);
    expect(press(load('answer-B1'), 'b.try.confidence.bold')).toEqual([set('confidence', 'bold')]);
    expect(one(renderScreen(load('answer-B1')), 'b.try.confidence.balanced').getAttribute('aria-pressed')).toBe('true');
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
  it('pressing a cell puts that stop age and pay-in in the numbers and goes back to the answer; a split entry keeps the employer\'s part (2 Nov 2026)', () => {
    const state = load('choices-B1');
    const g = state.answers.b.result.grid;
    const age = g.ages[Math.min(2, g.ages.length - 1)].age;
    const payIn = g.payIns[Math.min(1, g.payIns.length - 1)];
    const { root, actions } = draw(state);
    const cell = one(root, `b.grid.${age}.${payIn}`);
    expect(cell.getAttribute('href')).toBe('#/b/answer');
    cell.click();
    // B1's pay-in is £450 from you and £250 from the employer: the cell's figure less the employer's part becomes yours
    expect(state.answers.b.result.inputs.you.payIn).toEqual({ kind: 'split', own: 450, employer: 250 });
    expect(actions).toEqual([set('stop.age', String(age)), set('you.payIn.own', money(payIn - 250).slice(1)), set('you.payIn.kind', 'split')]);
    expect(one(root, 'b.action.back').getAttribute('href')).toBe('#/b/answer');
    // one figure: the cell's figure as one figure, as before
    const one1 = clone(state);
    one1.answers.b.result.inputs.you.payIn = { total: 700 };
    const pressed = draw(one1);
    one(pressed.root, `b.grid.${age}.${payIn}`).click();
    expect(pressed.actions).toEqual([set('stop.age', String(age)), set('you.payIn.total', money(payIn).slice(1)), set('you.payIn.kind', 'total')]);
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

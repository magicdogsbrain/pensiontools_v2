/**
 * Question A's screens (step 4 brief 6, P5; test plan 10): every named state drawn in jsdom and held to checkScreen's
 * rules (R1–R16 and the scope rules), then what each screen must show, what each control sends, the keyboard order
 * and the labels. The states are tests/v7/states/a/*.json, written by build-states.mjs --question a.
 *
 * A and B are open on the joined-up branch only (rail/questions.js OPEN); these tests open them the same way, by
 * standing in for questions.js with all three open — nothing else is mocked.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen, SCHEMA_A, get } from './_a.js';
import { checkScreen, draw, visibleText, expectedInputs, scopesFor, bannedHits } from '../render/checkScreen.js';
import { parseDraft, checkInputs } from '../../../src/answers/shared/validate.js';
import { money, pot, outOfTen, partsText } from '../../../src/answers/shared/format.js';
import { verdictOf } from '../../../src/answers/shared/rules.js';
import { agesToShow, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { ADVICE_SHORT, ADVICE_FULL, NOT_BUILT } from '../../../src/v7/copy/common.js';
import { A } from '../../../src/v7/copy/a.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { CARRY_OPENS } from '../../../src/v7/state/carry.js';
import { LAYOUT_A } from '../../../src/v7/screens/a/NumbersScreen.jsx';
import { VERSION } from '../../../src/constants.js';

vi.mock('../../../src/v7/rail/questions.js', async () => {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c']);
  return { ...real, OPEN, QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]])) };
});

const DIR = join(process.cwd(), 'tests/v7/states/a');
/** The brief's named states for A (4.13). */
const NAMES = [
  'numbers-blank', 'numbers-carried-from-c', 'numbers-part-time-open', 'numbers-couple-open', 'numbers-more-open',
  'answer-nothing-entered', 'answer-working', 'answer-first', 'answer-A1', 'answer-yes', 'answer-no', 'answer-ages', 'answer-ages-none',
  'answer-A4', 'answer-A3-part-time', 'answer-A2-couple', 'answer-stop-now', 'answer-updating', 'answer-partial', 'answer-failed',
  'answer-retired', 'ages-A1', 'keep-no-answer'
];
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const type = (el, text) => { el.value = text; fire(el, 'input'); };
const set = (path, value) => ({ type: 'draft/set', q: 'a', path, value });
const withResult = NAMES.filter((n) => load(n).answers.a.result);
const F = (n) => ({ fixed: String(n) });


describe('A: the named states', () => {
  it('are exactly the ones the brief names', () => {
    expect(readdirSync(DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s survives JSON and is a whole state with A open', (name) => {
    const s = load(name);
    expect(Object.keys(s).sort()).toEqual(['answers', 'draft', 'env', 'plan', 'route', 'session', 'ui']);
    expect(Object.keys(s.draft).sort()).toEqual(['a', 'b', 'c']);
    expect(s.route).toMatchObject({ screen: 'step', q: 'a' });
    expect(s.plan).toBe(null);
    expect(s.env.today).toBe('2026-09-30');
    expect('carriedFrom' in s.draft.a && 'extending' in s.answers.a && 'detail' in s.answers.a).toBe(true);
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
      expect(Number(el.getAttribute('data-value')), key).toBe(get(state.answers.a.result, key));
    }
    expect(visibleText(root)).not.toMatch(/undefined|NaN|-£0|−£0/);
  });

  it.each(NAMES)('%s: no countdown, and the retired rules where the stop is now', (name) => {
    const state = load(name);
    const text = visibleText(renderScreen(state));
    expect(text).not.toMatch(/\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i);
    expect(text).not.toMatch(/\bin \d+ (years|months)\b/i);
    expect(bannedHits(text, scopesFor(state))).toEqual([]);
  });

  it('every answer in a state is the real answerA — nothing is hand-made (re-run in tests/v7/states/states.slow.test.js)', () => {
    expect(MADE.answer).toBe('src/answers/a/answer.js');
    expect(MADE.patched).toEqual([]);
    for (const name of withResult) expect(load(name).answers.a.result.basis.futures, name).toBeGreaterThan(0);
  });
});

describe('A: what each answer shows is the answer\'s, by its own rules', () => {
  it.each(withResult)('%s: the verdict on screen is the rule on the count, never the screen\'s', (name) => {
    const state = load(name);
    const r = state.answers.a.result;
    const root = renderScreen(state);
    const band = root.querySelector('[data-headline="verdict"] [data-verdict]');
    if (!band) return;
    const n = r.basis.futures;
    expect(band.getAttribute('data-verdict')).toBe(verdictOf(Math.round((1 - r.headline.lasted) * n), n));
    expect(band.getAttribute('data-verdict')).toBe(r.headline.verdict);
    expect(band.querySelector('#answer-figure').textContent).toBe(r.sentences.head.text);
  });

  it.each(withResult)('%s: the chart\'s ages are the input list\'s rule (agesToShow), in order', (name) => {
    const state = load(name);
    const r = state.answers.a.result;
    const root = renderScreen(state);
    const table = root.querySelector('[data-chart="ages"], [data-table="ages"]');
    if (!table) return;
    const detail = table.hasAttribute('data-table') ? 'all' : 'chart';
    const want = agesToShow(r.inputs, { today: state.env.today }, detail, r.earliest.yes);
    expect([...table.querySelectorAll('[data-age]')].map((el) => Number(el.getAttribute('data-age')))).toEqual(want);
  });

  it.each(withResult)('%s: each bar has ten cells, round(lasted × 10) filled, labelled with the count in words', (name) => {
    const state = load(name);
    const r = state.answers.a.result;
    const root = renderScreen(state);
    for (const bar of root.querySelectorAll('[data-kind="outOfTen"]')) {
      const share = get(r, bar.getAttribute('data-key'));
      expect(bar.querySelectorAll('.bar-cell').length).toBe(10);
      expect(bar.querySelectorAll('.bar-cell.is-on').length).toBe(Math.round(share * 10));
      expect(bar.getAttribute('aria-label')).toBe(outOfTen(share).words);
      expect(bar.getAttribute('role')).toBe('img');
    }
  });
});

describe('A, step 1: what have you got, and when would you stop?', () => {
  it('blank: three boxes to type in, in the order of the drawing; settings start sensible; the button is never greyed out', () => {
    const state = load('numbers-blank');
    const root = renderScreen(state);
    expect(root.querySelector('h1').textContent).toBe(A.steps.numbers.label);
    // the spending is the next step's (the budget step): never on this one
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['a.you.age', 'a.you.pot', 'a.you.payIn.total', 'a.savings', 'a.stop.age']);
    expect(root.querySelector('[data-field^="spend."]')).toBe(null);
    for (const id of ['a.you.payIn.kind.total', 'a.stop.kind.age', 'a.partTime.has.no', 'a.you.statePension.kind.full', 'a.you.finalSalary.has.no']) {
      expect(one(root, id).checked, id).toBe(true);
    }
    expect(one(root, 'a.action.show')).toBe(null);
    const show = one(root, 'a.action.onward');
    expect(show.textContent).toBe(A.buttons.onward);
    expect(show.getAttribute('type')).toBe('submit');
    expect(show.disabled).toBe(false);
    expect(root.querySelector('[data-error-for]')).toBe(null);
    expect(one(root, 'a.action.addPartner')).not.toBe(null);
    expect(one(root, 'a.action.moreDetail').getAttribute('aria-expanded')).toBe('false');
    expect(one(root, 'a.action.fullDetail').getAttribute('href')).toBe('#/soon/e');
    expect(root.textContent).toContain(A.numbers.stays);
    expect(one(root, 'a.you.payIn.total').getAttribute('placeholder')).toBe('0');
    expect(one(root, 'a.savings').getAttribute('placeholder')).toBe('0');
  });

  it('a single person types four things (A: age, pot, the age in mind, spending); a couple adds the partner\'s age', () => {
    const required = (values) => SCHEMA_A.fields.filter((f) => f.required && Object.entries(f.when || {}).every(([p, w]) => (values[p] ?? SCHEMA_A.fields.find((x) => x.path === p).default) === w));
    expect(required({}).map((f) => f.path)).toEqual(['you.pot', 'you.age', 'stop.age', 'spend.amount']);
    expect(required({ 'spend.kind': 'level' }).length).toBe(4);           // the level is a choice, not something typed
  });

  it('the layout draws every field of the list exactly once: at the top, or inside the choice it depends on (the spending on the spend step)', () => {
    const top = [...LAYOUT_A.you, ...LAYOUT_A.partner, ...LAYOUT_A.more, ...LAYOUT_A.spend];
    expect(new Set(top).size).toBe(top.length);
    for (const f of SCHEMA_A.fields) {
      if (f.path === 'household') continue;
      const parents = Object.keys(f.when || {}).filter((p) => p !== 'household');
      if (parents.length === 0) expect(top, f.path).toContain(f.path);
      else { expect(top, f.path).not.toContain(f.path); for (const p of parents) expect(top, `${f.path} under ${p}`).toContain(p); }
    }
  });

  it('carried from C: says where the figures came from, and the form says so too', () => {
    const state = load('numbers-carried-from-c');
    const root = renderScreen(state);
    expect(one(root, 'a.carried').textContent).toBe(A.carried['c→a']);
    expect(root.querySelector('form').getAttribute('data-carried-from')).toBe('c');
    expect(one(root, 'a.you.pot').value).toBe('250,000');
    expect(state.route.focus).toBe(CARRY_OPENS['c→a'].focus);
    const s = load('numbers-blank');
    expect(one(renderScreen(s), 'a.carried')).toBe(null);
    expect(renderScreen(s).querySelector('form').hasAttribute('data-carried-from')).toBe(false);
  });

  it('carried from B with an age and an amount: names them; with a level: the plain line', () => {
    const s = load('numbers-more-open');
    s.draft.a.carriedFrom = 'b';
    expect(one(renderScreen(s), 'a.carried').textContent).toBe('We have brought your figures over from "Am I saving enough?". Check them: the age in mind is 60 and the spending £1,900 a month.');
    s.draft.a.values = { ...s.draft.a.values, 'spend.kind': 'level', 'spend.level': 'moderate' };     // a new object, as the reducer makes
    expect(one(renderScreen(s), 'a.carried').textContent).toBe(A.carried['b→a.plain']);
  });

  it('part-time work: the yearly amount and the years open inside "Yes"', () => {
    const state = load('numbers-part-time-open');
    const root = renderScreen(state);
    const yes = one(root, 'a.partTime.has.yes').closest('.option');
    expect(yes.querySelector('[data-testid="a.partTime.yearly"]').value).toBe('12,000');
    expect(yes.querySelector('[data-testid="a.partTime.years"]').value).toBe('3');
    expect(one(root, 'a.partTime.years').getAttribute('inputmode')).toBe('numeric');
  });

  it('a level picked: its monthly figure is named under the choice — and the words are the rule\'s figure', () => {
    for (const household of ['single', 'couple']) {
      for (const level of ['minimum', 'moderate', 'comfortable']) {
        expect(A.levels[household][level], `${household} ${level}`).toBe(money(spendLevelAMonth(household, level)));
      }
    }
    const s = load('numbers-blank');
    s.draft.a.values = { 'spend.kind': 'level', 'spend.level': 'moderate' };
    s.route = { ...s.route, step: 'spend' };                                             // the spending is on the spend step
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(one(root, 'a.spend.levelIs').textContent).toBe('Moderate: £2,608 a month for one person (Retirement Living Standards).');
    expect(one(root, 'a.spend.amount')).toBe(null);
  });

  it('couple: the partner block opens on the same step, with their pay-in, and a way to remove it', () => {
    const root = renderScreen(load('numbers-couple-open'));
    for (const id of ['a.partner.age', 'a.partner.pot', 'a.partner.payIn.total', 'a.partner.statePension.kind.full', 'a.partner.finalSalary.has.no']) expect(one(root, id), id).not.toBe(null);
    expect(one(root, 'a.action.removePartner').textContent).toBe(A.buttons.removePartner);
    expect(one(root, 'a.action.addPartner')).toBe(null);
    expect(root.textContent).toContain(A.numbers.partnerDone);
    expect(one(root, 'a.action.fullDetail').textContent).toBe(A.buttons.fullDetailCouple);
  });

  it('more detail: the two risk levels, the charge as a percent box, savings in, and the end age', () => {
    const root = renderScreen(load('numbers-more-open'));
    expect(one(root, 'a.savingRisk.balanced').checked).toBe(true);
    expect(one(root, 'a.risk.balanced').checked).toBe(true);
    expect(one(root, 'a.you.alreadyDrawing.no').checked).toBe(true);
    const charge = one(root, 'a.charge');
    expect(charge.getAttribute('inputmode')).toBe('decimal');
    expect(charge.getAttribute('placeholder')).toBe('0.5');
    expect(charge.closest('.box').querySelector('.suffix').textContent).toBe('%');
    expect(one(root, 'a.endAge').getAttribute('placeholder')).toBe('95');
    expect(one(root, 'a.savingsIn')).not.toBe(null);
    expect(one(root, 'a.action.moreDetail').getAttribute('aria-expanded')).toBe('true');
  });

  it('a percent that is not one is said in plain words', () => {
    const s = load('numbers-more-open');
    s.draft.a.values = { ...s.draft.a.values, charge: 'lots' };
    s.draft.a.touched = ['charge'];
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('[data-error-for="a.charge"]').textContent).toBe(A.errors.percent.notANumber);
    s.draft.a.values = { ...s.draft.a.values, charge: '3.5' };
    expect(renderScreen(s).querySelector('[data-error-for="a.charge"]').textContent).toBe('Type a figure from 0% to 3%.');
    s.draft.a.values = { ...s.draft.a.values, charge: '0.07' };
    expect(renderScreen(s).querySelector('[data-error-for="a.charge"]').textContent).toBe(A.errors.percent.notANumber);
  });

  it('the age in mind before today\'s age is said in the guide\'s words', () => {
    const s = load('numbers-blank');
    s.draft.a.values = { 'you.age': '50', 'stop.age': '45' };
    s.draft.a.touched = ['stop.age'];
    expect(renderScreen(s).querySelector('[data-error-for="a.stop.age"]').textContent).toBe(A.fields['stop.age'].errors['stop-not-before-now']);
  });

  it('every box says what it is: typing, leaving, choosing and the buttons each send one plain action for A', () => {
    const { root, actions } = draw(load('numbers-couple-open'));
    type(one(root, 'a.you.pot'), '£410,000');
    fire(one(root, 'a.you.pot'), 'blur');
    one(root, 'a.stop.kind.ages').click();
    one(root, 'a.partner.payIn.kind.split').click();
    one(root, 'a.action.removePartner').click();
    one(root, 'a.action.moreDetail').click();
    expect(actions).toEqual([
      set('you.pot', '£410,000'), { type: 'draft/touch', q: 'a', path: 'you.pot' }, set('stop.kind', 'ages'), set('partner.payIn.kind', 'split'),
      set('household', 'single'), { type: 'ui/toggle', id: 'more' }
    ]);
    const blank = draw(load('numbers-blank'));
    one(blank.root, 'a.action.addPartner').click();
    expect(blank.actions).toEqual([set('household', 'couple')]);
  });

  it('"Next: what you would spend" goes on — by the button and by Enter — and with something missing goes to the first box on screen that needs attention', () => {
    const { root, actions } = draw(load('numbers-blank'));
    document.body.appendChild(root);
    try {
      fire(one(root, 'a.action.onward').closest('form'), 'submit');
      expect(actions).toEqual([{ type: 'draft/onward', q: 'a' }]);
      expect(document.activeElement.id).toBe('a.you.age');
    } finally { root.remove(); }
  });
});

describe('A: keyboard order and labels', () => {
  /** The boxes in the order the layout draws them: each top field's options, then what is inside each option. */
  function layoutOrder(state) {
    const ids = expectedInputs(state);
    const order = [];
    const parsed = parseDraft(SCHEMA_A, state.draft.a.values, state.env);
    const more = state.ui.open.includes('more') || Object.keys(state.draft.a.values).some((p) => LAYOUT_A.more.includes(p) || p === 'savingsIn');
    const tops = [...LAYOUT_A.you, ...(parsed.values.household === 'couple' || state.draft.a.values.household === 'couple' ? LAYOUT_A.partner : []), ...(more ? LAYOUT_A.more : [])];
    for (const top of tops) {
      const f = SCHEMA_A.fields.find((x) => x.path === top);
      const options = f.type === 'choice' ? f.options : f.type === 'yesNo' ? ['no', 'yes'] : [null];
      for (const o of options) {
        const own = o === null ? `a.${top}` : `a.${top}.${o}`;
        if (ids.includes(own)) order.push(own);
        if (o === null) continue;
        const want = f.type === 'yesNo' ? o === 'yes' : o;
        for (const g of SCHEMA_A.fields.filter((x) => x.when && x.when[top] === want)) if (ids.includes(`a.${g.path}`)) order.push(`a.${g.path}`);
        for (const g of SCHEMA_A.fields.filter((x) => x.when && x.when[top] === want && x.type === 'choice')) for (const p of g.options) if (ids.includes(`a.${g.path}.${p}`) && !order.includes(`a.${g.path}.${p}`)) order.push(`a.${g.path}.${p}`);
      }
    }
    return order;
  }

  it.each(['numbers-blank', 'numbers-couple-open', 'numbers-more-open', 'numbers-part-time-open'])('%s: Tab meets the boxes in the drawn order, then the button', (name) => {
    const state = load(name);
    const root = renderScreen(state);
    const stops = [...root.querySelectorAll('input, button, a[href]')].filter((el) => el.getAttribute('tabindex') !== '-1');
    const boxes = stops.filter((el) => el.tagName === 'INPUT').map((el) => el.getAttribute('data-testid'));
    expect([...boxes].sort()).toEqual([...expectedInputs(state)].sort());
    expect(boxes).toEqual(layoutOrder(state));
    expect(stops.findIndex((el) => el.getAttribute('data-testid') === 'a.action.onward')).toBeGreaterThan(stops.map((el) => el.tagName).lastIndexOf('INPUT'));
  });

  it.each(NAMES)('%s: every box has a label, every group a legend, every button words, the heading takes focus', (name) => {
    const root = renderScreen(load(name));
    for (const el of root.querySelectorAll('input')) {
      expect(root.querySelector(`label[for="${el.id}"]`)?.textContent.trim(), `label for ${el.id}`).toBeTruthy();
      if (el.type === 'radio') expect(el.closest('fieldset').querySelector('legend').textContent.trim(), el.id).toBeTruthy();
    }
    for (const b of root.querySelectorAll('button')) expect((b.textContent.trim() || b.getAttribute('aria-label')), 'a button').toBeTruthy();
    expect(root.querySelector('h1').getAttribute('tabindex')).toBe('-1');
  });
});

describe('A, step 2: could I stop at 60?', () => {
  it('nothing entered: the step asks for its four things itself — no error, no bounce', () => {
    const root = renderScreen(load('answer-nothing-entered'));
    expect(root.querySelector('[data-screen]').getAttribute('data-screen')).toBe('a.answer');
    expect(root.querySelector('h1').textContent).toBe(A.steps.answer.labelNone);
    expect([...root.querySelectorAll('input[type="text"]')].map((el) => el.id)).toEqual(['a.you.age', 'a.you.pot', 'a.stop.age', 'a.spend.amount']);
    expect(root.textContent).toContain(A.answer.needFour);
    expect(root.querySelector('[data-headline]')).toBe(null);
    expect(root.querySelector('[data-error-for]')).toBe(null);
  });

  it('working: says so; first figure: the chart says the other ages are still being worked out', () => {
    expect(renderScreen(load('answer-working')).textContent).toContain('Working out your answer');
    const root = renderScreen(load('answer-first'));
    expect(root.textContent).toContain(A.answer.first);
    expect(root.querySelector('[data-chart="ages"]')).toBe(null);
    expect(root.textContent).toContain(A.answer.chartWorking);
  });

  describe.each(['answer-A1', 'answer-yes', 'answer-no', 'answer-A4', 'answer-A3-part-time', 'answer-A2-couple', 'answer-stop-now'])('%s', (name) => {
    const state = load(name);
    const r = state.answers.a.result;
    const root = renderScreen(state);
    const head = root.querySelector('[data-headline="verdict"]');

    it('the headline is the verdict in words, the sentence, the bad-case line, then the short advice line', () => {
      expect(root.querySelector('h1').textContent).toBe(`Could I stop at ${r.inputs.stop.age}?`);
      expect(head.querySelector('[data-verdict]').textContent).toBe(r.sentences.head.text + r.sentences.sub.text);
      expect(head.querySelector('[data-sentence="verdict"]').textContent).toBe(r.sentences.line.text);
      expect(head.textContent).toContain(r.sentences.bad.text);
      expect(head.textContent.indexOf(r.sentences.bad.text)).toBeLessThan(head.textContent.indexOf(ADVICE_SHORT));
      expect(root.querySelector('[data-region="footer"]').textContent).toContain(ADVICE_FULL);
    });
    it('what you could spend from the stop age, and the pot by then', () => {
      const pots = root.querySelector('[data-pots]');
      expect(pots.textContent).toContain(r.sentences.range.text);
      expect(pots.textContent).toContain(r.sentences.pot.text);
      // a pot worked out for later is rounded to £1,000 (kind 'pot'); stopping now, it is the figures typed, to the pound
      expect(pots.querySelector('[data-key="shown.potAtStop.middling"]').getAttribute('data-kind')).toBe(r.stop.age === r.inputs.you.age ? 'money' : 'pot');
    });
    it('the years before the State Pension: one line a stretch of years', () => {
      for (const s of r.sentences.pays) expect(root.textContent).toContain(s.text);
      expect(one(root, 'a.toggle.madeOf').textContent).toBe(A.answer.yearsTitle);
    });
    it('the ages side by side: the shown age marked, and the way to every age', () => {
      const chart = root.querySelector('[data-chart="ages"]');
      expect(chart.querySelector('[aria-current="true"]').getAttribute('data-age')).toBe(String(r.shown.age));
      expect(one(root, 'a.action.seeAges').getAttribute('href')).toBe('#/a/ages');
      r.ages.forEach((row, k) => {
        const tr = chart.querySelector(`[data-age="${row.age}"]`);
        expect(tr.querySelector(`[data-key="ages.${k}.monthly.careful"]`).textContent).toBe(money(row.monthly.careful));
        expect(tr.querySelector('[data-verdict]').textContent).toBe(A.answer.verdictWord[row.verdict]);
      });
    });
    it('what was assumed: one line for each, no more, no fewer', () => {
      expect([...root.querySelectorAll('[data-assumed] [data-assumed-id]')].map((l) => l.getAttribute('data-assumed-id'))).toEqual(r.assumed.map((a) => a.id));
    });
    it('warnings the answer gave are shown in its words', () => {
      for (const w of r.warnings) expect(root.querySelector(`[data-warning-id="${w.id}"]`).textContent).toContain(w.text);
    });
    it('try a change and what next are there', () => {
      // Risk while saving only with saving years (review of 1 Oct 2026); the hand-over to C only from an age a pension can be touched.
      const saving = r.shown.yearsSaving > 0;
      const toC = r.handOver && r.handOver.c ? r.handOver.c.ok : r.shown.age >= r.pensionOpens.you;
      for (const id of ['a.try.stop.down', 'a.try.stop.up', 'a.try.pot.down', 'a.try.pot.up', 'a.try.spend.down', 'a.try.spend.up', 'a.try.partTime.down', 'a.try.partTime.up',
        'a.try.partTime.yearly', ...(saving ? ['a.try.savingRisk.cautious', 'a.try.savingRisk.balanced', 'a.try.savingRisk.adventurous'] : []), 'a.try.risk.cautious', 'a.try.risk.adventurous',
        'a.next.b', ...(toC ? ['a.next.c'] : []), 'a.action.fullDetail']) expect(one(root, id), id).not.toBe(null);
      if (!saving) expect(one(root, 'a.try.savingRisk.balanced')).toBe(null);
      expect(one(root, 'a.next.b').getAttribute('href')).toBe('#/b/numbers?focus=you.payIn.total');
      if (!toC) { expect(one(root, 'a.next.c')).toBe(null); return; }
      expect(one(root, 'a.next.c').getAttribute('href')).toBe('#/c/answer');
      expect(one(root, 'a.next.c').querySelector('[data-key="shown.age"]').textContent).toBe(String(r.shown.age));
    });
  });

  it('close: the one more year says what working on buys', () => {
    const state = load('answer-A1');
    const root = renderScreen(state);
    const block = root.querySelector('.one-more');
    expect(block.textContent).toContain(state.answers.a.result.sentences.oneMore.text);
    expect(block.textContent).toContain(state.answers.a.result.sentences.oneMoreMoves.text);
  });

  it('show me ages: the earliest that worked leads, every age in the chart is a link to it in full', () => {
    const state = load('answer-ages');
    const r = state.answers.a.result;
    const { root, actions } = draw(state);
    expect(root.querySelector('h1').textContent).toBe(A.steps.answer.labelAges);
    expect(root.querySelector('[data-verdict]').textContent).toContain(r.sentences.head.text);
    expect(root.querySelector('.chart h2').textContent).toBe(A.answer.chartTitleAges);
    expect(root.querySelector(`[data-age="${r.inputs.you.age}"]`).textContent).toContain(A.answer.chartNow);
    one(root, 'a.ages.pick.60').click();
    expect(actions).toEqual([set('stop.age', '60'), set('stop.kind', 'age')]);
    expect(one(root, 'a.ages.pick.60').getAttribute('href')).toBe('#/a/answer');
  });

  it('show me ages, none worked: says so in place of a verdict (Screens 3.3), then the sentence and bad case for the last age', () => {
    const state = load('answer-ages-none');
    const root = renderScreen(state);
    const r = state.answers.a.result;
    expect(root.querySelector('[data-verdict]').getAttribute('data-verdict')).toBe('no');
    expect(r.sentences.head.text).toBe('No age up to 75 worked on these figures');
    expect(root.querySelector('[data-verdict]').textContent).toContain(r.sentences.head.text);
    expect(root.textContent).toContain(r.sentences.line.text);
    expect(root.textContent).toContain(r.sentences.bad.text);
  });

  it('stopping before the pension opens: the savings pay, the pension is closed, and the savings needed are named', () => {
    const state = load('answer-A4');
    const root = renderScreen(state);
    const r = state.answers.a.result;
    expect(root.textContent).toContain(r.sentences.savingsNeeded.text);
    expect(root.querySelector('[data-warning-id="pension-closed"]').className).toContain('is-important');
    expect(r.sentences.pays.map((s) => s.id)).toContain('a.pays.locked');
  });

  it('part-time work: one line under the sentence says what the work did', () => {
    const state = load('answer-A3-part-time');
    const head = renderScreen(state).querySelector('[data-headline="verdict"]');
    expect(head.textContent).toContain(state.answers.a.result.sentences.partTime.text);
  });

  it('a couple: the partner\'s age beside each age in the chart', () => {
    const state = load('answer-A2-couple');
    const root = renderScreen(state);
    expect(root.querySelector('[data-chart="ages"] [data-key="ages.1.ages.partner"]').textContent).toBe('54');
    expect(root.textContent).toContain(A.answer.assumedCouple);
  });

  it('updating: the old answer stays, greyed and marked', () => {
    const root = renderScreen(load('answer-updating'));
    const region = root.querySelector('[data-region="answer"]');
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('is-stale');
    expect(region.textContent).toContain(A.answer.updating);
  });

  it('failed: no technical words, the numbers shown to be still here, two ways on', () => {
    const { root, actions } = draw(load('answer-failed'));
    expect(root.textContent).toContain(A.answer.failedTitle);
    expect(root.querySelector('.problem-figures').textContent).toBe('Pot £250,000, age 50, stop at 60, £1,900 a month, £600 in');
    expect(root.textContent).not.toMatch(/error|failed|invalid|exception/i);
    expect(one(root, 'a.action.change').getAttribute('href')).toBe('#/a/numbers');
    one(root, 'a.action.retry').click();
    expect(actions).toEqual([{ type: 'answer/retry', q: 'a' }]);
  });

  it('retired: for people still working — the view and nothing else, with its two ways on', () => {
    const state = load('answer-retired');
    const { root, actions } = draw(state);
    expect(root.querySelector('main').getAttribute('data-view')).toBe('retired');
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('a.answer');
    expect(root.querySelector('h1').textContent).toBe(A.retired.title);
    expect(root.querySelector('input')).toBe(null);
    expect(root.querySelector('[data-headline]')).toBe(null);
    expect(one(root, 'a.action.willItLast').getAttribute('href')).toBe('#/soon/d');
    expect(one(root, 'a.action.imWorking').getAttribute('href')).toBe('#/a/numbers?focus=stop.age');
    one(root, 'a.action.imWorking').click();
    expect(actions).toEqual([set('stop.kind', 'age'), set('stop.age', '')]);
    for (const step of ['numbers', 'ages']) {
      const s = clone(state);
      s.route.step = step;
      const r = renderScreen(s);
      expect(r.querySelector('main').getAttribute('data-view'), step).toBe('retired');
      expect(checkScreen(r, s), step).toEqual([]);
    }
  });

  it('what next carries A\'s figures — one action each, the address with no figure in it', () => {
    const { root, actions } = draw(load('answer-A1'));
    one(root, 'a.next.b').click();
    one(root, 'a.next.c').click();
    expect(actions).toEqual([{ type: 'draft/carry', from: 'a', to: 'b' }, { type: 'draft/carry', from: 'a', to: 'c' }]);
    expect(one(root, 'a.next.b').getAttribute('href')).toBe(`#/${CARRY_OPENS['a→b'].q}/${CARRY_OPENS['a→b'].step}?focus=${CARRY_OPENS['a→b'].focus}`);
    expect(one(root, 'a.next.c').getAttribute('href')).toBe(`#/${CARRY_OPENS['a→c'].q}/${CARRY_OPENS['a→c'].step}`);
  });
});

describe('A, try a change', () => {
  const press = (state, id) => { const { root, actions } = draw(state); one(root, id).click(); return actions; };

  it('the stop age moves a year at a time, stops at today\'s age and at 75', () => {
    // the figure first, then the choice it belongs to: no step in between is a draft that does not parse
    expect(press(load('answer-A1'), 'a.try.stop.up')).toEqual([set('stop.age', '61'), set('stop.kind', 'age')]);
    expect(press(load('answer-A1'), 'a.try.stop.down')).toEqual([set('stop.age', '59'), set('stop.kind', 'age')]);
    expect(one(renderScreen(load('answer-stop-now')), 'a.try.stop.down').disabled).toBe(true);
    const s = load('answer-A1');
    s.draft.a.values['stop.age'] = '75';
    s.answers.a.inputsKey = null;
    s.answers.a.status = 'final';
    expect(one(renderScreen(s), 'a.try.stop.up').disabled).toBe(true);
  });
  it('the pot by £25,000 from £100,000, the spending by £100', () => {
    expect(press(load('answer-A1'), 'a.try.pot.up')).toEqual([set('you.pot', '275,000')]);
    expect(press(load('answer-A1'), 'a.try.spend.down')).toEqual([set('spend.amount', '1,800'), set('spend.kind', 'amount')]);
  });
  it('part-time years: from none, one year at £12,000; back to none', () => {
    expect(press(load('answer-A1'), 'a.try.partTime.up')).toEqual([set('partTime.yearly', '12,000'), set('partTime.years', '1'), set('partTime.has', true)]);
    expect(press(load('answer-A3-part-time'), 'a.try.partTime.up')).toEqual([set('partTime.years', '4'), set('partTime.has', true)]);
    expect(press(load('answer-A3-part-time'), 'a.try.partTime.down')).toEqual([set('partTime.years', '2')]);
    expect(one(renderScreen(load('answer-A1')), 'a.try.partTime.down').disabled).toBe(true);
    const { root, actions } = draw(load('answer-A1'));
    type(one(root, 'a.try.partTime.yearly'), '15,000');
    expect(actions).toEqual([set('partTime.yearly', '15,000')]);
  });
  it('the two risk levels: three buttons each, the chosen one marked', () => {
    const root = renderScreen(load('answer-A1'));
    expect(one(root, 'a.try.savingRisk.balanced').getAttribute('aria-pressed')).toBe('true');
    expect(one(root, 'a.try.risk.cautious').getAttribute('aria-pressed')).toBe('false');
    expect(press(load('answer-A1'), 'a.try.savingRisk.adventurous')).toEqual([set('savingRisk', 'adventurous')]);
    expect(press(load('answer-A1'), 'a.try.risk.cautious')).toEqual([set('risk', 'cautious')]);
  });
  it('before / now: the answer\'s own sentence for now; nothing yet before the first change', () => {
    const state = load('answer-A1');
    const root = renderScreen(state);
    const line = root.querySelector('.before-now');
    expect(line.textContent).toContain(`${A.answer.before} ${A.answer.noBefore}.`);
    expect(line.textContent).toContain(state.answers.a.result.sentences.change.text);
    state.answers.a.before = { change: { id: 'a.change', text: 'Now: close at 59, 7 futures out of 10.', parts: [] } };
    expect(renderScreen(state).querySelector('.before-now .before').textContent).toBe('Before: close at 59, 7 futures out of 10.');
  });
});

describe('A, step 3: every age', () => {
  it('every age from 50 to 75 in a table; each row its own figures; each age a link to it in full', () => {
    const state = load('ages-A1');
    const r = state.answers.a.result;
    const { root, actions } = draw(state);
    expect(root.querySelector('h1').textContent).toBe(A.steps.ages.label);
    const table = root.querySelector('[data-table="ages"]');
    expect(table.querySelectorAll('tbody tr').length).toBe(r.ages.length);
    expect(table.querySelector('[aria-current="true"]').getAttribute('data-age')).toBe('60');
    expect(table.querySelector('[data-age="70"] [data-key="ages.20.potAtStop.middling"]')).not.toBe(null);
    one(root, 'a.ages.pick.63').click();
    expect(actions).toEqual([set('stop.age', '63'), set('stop.kind', 'age')]);
    expect(root.textContent).not.toContain(A.answer.chartWorking);
  });
  it('arriving (partial): the answer step\'s ages, and the others being worked out — never a blank table', () => {
    const root = renderScreen(load('answer-partial'));
    expect(root.querySelector('[data-table="ages"]')).toBe(null);
    expect(root.querySelector('[data-chart="ages"]')).not.toBe(null);
    expect(root.textContent).toContain(A.answer.chartWorking);
  });
  it('opened with nothing typed: the short form, with the step\'s own heading', () => {
    const s = load('answer-nothing-entered');
    s.route.step = 'ages';
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    expect(root.querySelector('h1').textContent).toBe(A.steps.ages.label);
    expect(root.textContent).toContain(A.answer.needFour);
  });
});

describe('A: "Save this as a plan?" before there is an answer', () => {
  it('says there is nothing to save yet, offers no box, and leads back to the answer', () => {
    const root = renderScreen(load('keep-no-answer'));
    expect(root.querySelector('[data-screen]').getAttribute('data-screen')).toBe('a.keep');
    expect(root.querySelector('h1').textContent).toBe(A.steps.keep.label);
    expect(one(root, 'a.keep.why').textContent).toBe(KEEP.why.noAnswer);
    expect(one(root, 'a.keep.name')).toBe(null);
    expect(root.textContent).not.toContain(NOT_BUILT.line);
    expect([...root.querySelector('main').querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['#/a/answer']);
  });
});

describe('A: the words and the input list agree', () => {
  it('every field path has a label; every choice has words for each option', () => {
    for (const f of SCHEMA_A.fields) {
      expect(A.fields[f.path]?.label, f.path).toBeTruthy();
      for (const o of f.options || []) expect(A.fields[f.path].options[o], `${f.path}: ${o}`).toBeTruthy();
      if (f.type === 'yesNo') expect(A.fields[f.path].options.yes && A.fields[f.path].options.no, f.path).toBeTruthy();
    }
    expect(Object.keys(A.fields).sort()).toEqual(SCHEMA_A.fields.map((f) => f.path).sort());
  });
  it('every message a field can get has a sentence — its own, or the one for its kind; every rule its own', () => {
    for (const f of SCHEMA_A.fields.filter((x) => ['money', 'age', 'percent', 'count'].includes(x.type))) {
      for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(A.fields[f.path].errors?.[id] || A.errors[f.type][id], `${f.path} ${id}`).toBeTruthy();
    }
    for (const rule of SCHEMA_A.rules) expect(A.fields[rule.fields[0]].errors[rule.id], rule.id).toBeTruthy();
  });
  it('every step and every next sentence of the rail has its words', async () => {
    const { QUESTION_A, NEXT_A } = await import('../../../src/v7/rail/a.js');
    for (const s of QUESTION_A.steps) { expect(A.steps[s.id].label, s.id).toBeTruthy(); expect(A.steps[s.id].short, s.id).toBeTruthy(); }
    for (const id of NEXT_A) expect(A.next[id], id).toBeTruthy();
  });
});

/**
 * The spending shape's screens (research/v7/spending-shape.md 4, 7; the owner's rule of 2 Oct 2026: "We MUST offer as many
 * steps and tapers as V6! … We must have Gogo, goslow and nogo years."), drawn in jsdom and held to checkScreen's rules:
 *
 *   the states of 9.7: a/spend-shape-closed, -open, -suggested, -errors; a couple; C's more detail in shares; the short
 *   form with a problem in a step; an answer whose spending changes with age ("Try it the same every year", the start
 *   and the later steps moving together by £100);
 *   today's planner's capabilities, one by one (T1–T14, T19 of section 1): any number of steps, a fall on every step up to
 *   10% a year, "moves evenly" on every step but the last, add and remove, the go-go / go-slow / no-go suggestion with its
 *   words and Undo, "Slowly less", the picture of every year with its bands and the essentials, each step's share of the
 *   start, the table of every year;
 *   the keyboard: every box labelled, its error under it and named by aria-describedby, "Remove the step from 75", a new
 *   step's age box takes the keyboard, the reading order;
 *   every word passes the banned list in the scope it is shown in.
 * The states are made by the reducer from a fresh start (the screens draw what the state says).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import { readFileSync } from 'node:fs';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { join } from 'node:path';
import { renderScreen } from '../c/_c.js';
import { checkScreen, draw, visibleText, expectedInputs, bannedHits, scopesFor, shapeDrawnOpen } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { shapeView, currentKey, parsedDraft } from '../../../src/v7/state/select.js';
import { money } from '../../../src/answers/shared/format.js';
import { starterSheet } from '../../../src/answers/keep/budgetSheet.js';
import { SHAPE } from '../../../src/v7/copy/shape.js';
import { fresh, run, set, route, typedA, typedB, typedC } from '../shell/_open.js';

const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const go = (state, q, step) => reduce(state, { type: ACT.ROUTE_SET, route: route('step', q, step) });
const toggle = (state, id = 'shape') => reduce(state, { type: ACT.UI_TOGGLE, id });
const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });

/** A on the spend step: 50 today, stopping at 62, £2,500 a month. */
const spendA = (o = {}) => go(typedA(fresh(), { stop: '62', spend: '2,500', ...o }), 'a', 'spend');
const suggested = () => run(toggle(spendA()), { type: ACT.SHAPE_SUGGEST, q: 'a' });

describe('closed: one line, and a first answer still takes one figure', () => {
  it('"Does what you spend change as you get older?" — "No: the same every year, going up with prices." and "Change it with age"', () => {
    const s = spendA();
    const root = renderScreen(s);
    clean(root, s);
    const block = one(root, 'a.shape');
    expect(block.getAttribute('data-region')).toBe('shape');
    expect(block.querySelector('h2').textContent).toBe(SHAPE.legend);
    expect(one(root, 'a.shape.summary').textContent).toBe(SHAPE.closed.level);
    const open = one(root, 'a.shape.open');
    expect(open.textContent).toBe(SHAPE.open);
    expect(open.getAttribute('aria-expanded')).toBe('false');
    expect(block.querySelectorAll('input, select').length).toBe(0);                  // no box until it is opened
    expect(shapeDrawnOpen(s, 'a')).toBe(false);
    // it sits under the figure and the guide levels, before "Show"
    const order = [...root.querySelectorAll('[data-testid]')].map((el) => el.getAttribute('data-testid'));
    expect(order.indexOf('a.spend.amount')).toBeLessThan(order.indexOf('a.shape'));
    expect(order.indexOf('a.spend.levels')).toBeLessThan(order.indexOf('a.shape'));
    expect(order.indexOf('a.shape')).toBeLessThan(order.indexOf('a.action.show'));
  });
  it('"Change it with age" opens it (ui/toggle "shape"); with a shape typed, the closed line says what it holds', () => {
    const { root, actions } = draw(spendA());
    one(root, 'a.shape.open').click();
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'shape' }]);
    const closedWithShape = toggle(suggested());
    const r = renderScreen(closedWithShape);
    clean(r, closedWithShape);
    expect(one(r, 'a.shape.summary').textContent).toBe('Yes, as you set it: £2,500 a month from 62, £2,130 from 75 and £1,750 from 85.');
  });
});

describe('open: everything today\'s planner offers on its income shape', () => {
  it('the lead with go-go, go-slow and no-go; Suggest; the presets; the first row; "+ Add a step"; the picture', () => {
    const s = toggle(spendA());
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.shape.open').getAttribute('aria-expanded')).toBe('true');
    const text = visibleText(one(root, 'a.shape'));
    expect(text).toContain(SHAPE.lead);
    for (const w of ['go-go', 'go-slow', 'no-go']) expect(text).toContain(w);
    expect(one(root, 'a.shape.suggest').textContent).toBe(SHAPE.suggest);
    expect(one(root, 'a.shape.preset.level').textContent).toBe(SHAPE.presetLevel);
    expect(one(root, 'a.shape.preset.slowly').textContent).toBe(SHAPE.presetSlowly);
    expect(text).toContain(SHAPE.presetSlowlyHelp);
    expect(one(root, 'a.shape.first').textContent).toBe('From when you stop at 62: £2,500 a month (the figure above)');
    const then = one(root, 'a.spend.then');
    expect(then.tagName).toBe('SELECT');
    expect(then.value).toBe('level');
    expect([...then.options].map((o) => o.value)).toEqual(['level', 'falls']);        // nothing to move evenly towards yet
    expect(one(root, 'a.spend.fallsPct')).toBe(null);
    expect(one(root, 'a.shape.add').textContent).toBe(SHAPE.add);
    // the picture: a bar a year from the stop at 62 to the end at 95, all at £2,500
    const chart = one(root, 'a.shape.chart');
    expect(chart.getAttribute('data-unit')).toBe('perMonth');
    const bars = chart.querySelectorAll('g.year');
    expect(bars.length).toBe(33);
    expect([...bars].every((g) => Number(g.getAttribute('data-figure')) === 2500)).toBe(true);
    expect(chart.querySelector('[role="img"]').getAttribute('aria-label')).toBe('A bar for each year from 62 to 94: £2,500 a month from 62.');
    expect([...chart.querySelectorAll('.shape-band')].map((b) => b.textContent)).toEqual(['go-go', 'go-slow', 'no-go']);
    expect(chart.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
    expect(expectedInputs(s)).toContain('a.spend.then');
  });

  it('Suggest: £2,130 from 75 and £1,750 from 85, each "stays the same", with 85% and 70% of the start; the line; Undo', () => {
    const s = suggested();
    const { root, actions } = draw(s);
    clean(root, s);
    expect(one(root, 'a.spend.steps.0.fromAge').value).toBe('75');
    expect(one(root, 'a.spend.steps.0.perMonth').value).toBe('2,130');
    expect(one(root, 'a.spend.steps.1.fromAge').value).toBe('85');
    expect(one(root, 'a.spend.steps.1.perMonth').value).toBe('1,750');
    expect(root.querySelector('[id="a.spend.steps.0.perMonth.help"]').textContent).toBe('85% of the start');
    expect(root.querySelector('[id="a.spend.steps.1.perMonth.help"]').textContent).toBe('70% of the start');
    expect(one(root, 'a.spend.steps.0.then').value).toBe('level');
    expect(one(root, 'a.shape.note').textContent).toContain('Filled in: 15% less from 75 and 30% less from 85. A typical pattern from research on how people spend, not a figure for you: change any of it.');
    expect(one(root, 'a.shape.note').getAttribute('role')).toBe('status');
    one(root, 'a.shape.undo').click();
    expect(actions).toEqual([{ type: 'shape/undo', q: 'a' }]);
    // the bars follow the steps: £2,500 to 74, £2,130 from 75 to 84, £1,750 from 85
    const value = (age) => Number(root.querySelector(`[data-testid="a.shape.chart"] g[data-age="${age}"]`).getAttribute('data-figure'));
    expect([value(62), value(74), value(75), value(84), value(85), value(94)]).toEqual([2500, 2500, 2130, 2130, 1750, 1750]);
  });

  it('each step: falls by …% a year (a box on the same line), or moves evenly to the next — not on the last', () => {
    const s = run(suggested(), { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'then', value: 'falls' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fallsPct', value: '2' },
      set('a', 'spend.then', 'glides'));
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.spend.steps.0.fallsPct').value).toBe('2');
    expect(root.querySelector('label[for="a.spend.steps.0.fallsPct"]').textContent).toBe(SHAPE.then.fallsBox);
    expect([...one(root, 'a.spend.steps.0.then').options].map((o) => o.value)).toEqual(['level', 'falls', 'glides']);
    expect([...one(root, 'a.spend.steps.1.then').options].map((o) => o.value)).toEqual(['level', 'falls']);
    expect([...one(root, 'a.spend.then').options].map((o) => o.textContent)).toEqual([SHAPE.then.level, SHAPE.then.falls, SHAPE.then.glides]);
    // the picture: moving evenly from £2,500 at 62 to £2,130 at 75; falling 2% a year from 75; £1,750 from 85
    const value = (age) => Number(root.querySelector(`[data-testid="a.shape.chart"] g[data-age="${age}"]`).getAttribute('data-figure'));
    expect(value(62)).toBe(2500);
    expect(value(75)).toBe(2130);
    expect(value(76)).toBeCloseTo(2130 * 0.98, 6);
    expect(value(85)).toBe(1750);
    expect(value(68)).toBeCloseTo(2500 + (2130 - 2500) * 6 / 13, 6);
  });

  it('a fall up to 10% a year (today\'s slider stops at 5%), in quarter steps; any number of steps', () => {
    let s = toggle(spendA());
    for (let k = 0; k < 8; k++) s = reduce(s, { type: ACT.SHAPE_ADD, q: 'a' });
    s = run(s, { type: ACT.SHAPE_STEP, q: 'a', i: 7, field: 'then', value: 'falls' }, { type: ACT.SHAPE_STEP, q: 'a', i: 7, field: 'fallsPct', value: '9.75' });
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelectorAll('li.shape-step[data-step]').length).toBe(9);                 // the first, and eight later steps
    expect(one(root, 'a.spend.steps.7.fallsPct').getAttribute('aria-invalid')).toBe(null);
  });

  it('editing sends shape actions; Remove is named for its step; the new step\'s age box takes the keyboard', () => {
    const s = suggested();
    const { root, actions } = draw(s);
    const age = one(root, 'a.spend.steps.0.fromAge');
    age.value = '76'; fire(age, 'input'); fire(age, 'blur');
    const then = one(root, 'a.spend.steps.1.then');
    then.value = 'falls'; fire(then, 'change');
    const first = one(root, 'a.spend.then');
    first.value = 'glides'; fire(first, 'change');
    one(root, 'a.shape.suggest').click();
    one(root, 'a.shape.preset.slowly').click();
    one(root, 'a.shape.preset.level').click();
    expect(one(root, 'a.shape.remove.0').getAttribute('aria-label')).toBe('Remove the step from 75');
    expect(one(root, 'a.shape.remove.0').textContent).toBe('Remove');
    one(root, 'a.shape.remove.1').click();
    expect(actions).toEqual([
      { type: 'shape/step', q: 'a', i: 0, field: 'fromAge', value: '76' },
      { type: 'shape/touch', q: 'a', i: 0, field: 'fromAge' },
      { type: 'shape/step', q: 'a', i: 1, field: 'then', value: 'falls' },
      { type: 'draft/set', q: 'a', path: 'spend.then', value: 'glides' },
      { type: 'shape/suggest', q: 'a' },
      { type: 'shape/preset', q: 'a', id: 'slowly' },
      { type: 'shape/preset', q: 'a', id: 'level' },
      { type: 'shape/remove', q: 'a', i: 1 }
    ]);
    // with the real reducer: "+ Add a step" puts the keyboard in the new step's age box
    let state = suggested();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const paint = () => render(h(App, { state, dispatch }), host);
    function dispatch(a) { state = reduce(state, a); paint(); }
    paint();
    host.querySelector('[data-testid="a.shape.add"]').click();
    expect(document.activeElement.getAttribute('data-testid')).toBe('a.spend.steps.2.fromAge');
    expect(document.activeElement.value).toBe('94');                               // 85 + 10 is the end: the last year before it
    host.querySelector('[data-testid="a.shape.remove.2"]').click();
    expect(document.activeElement.getAttribute('data-testid')).toBe('a.shape.add');
    host.remove();
  });

  it('the steps are put in order of age once the keyboard leaves them, never while it moves through a row', () => {
    const s = suggested();
    const { root, actions } = draw(s);
    const list = root.querySelector('.shape-steps');
    const inside = one(root, 'a.spend.steps.0.perMonth');
    const out = new window.FocusEvent('focusout', { bubbles: true, relatedTarget: inside });
    one(root, 'a.spend.steps.0.fromAge').dispatchEvent(out);
    expect(actions).toEqual([]);
    one(root, 'a.spend.steps.0.fromAge').dispatchEvent(new window.FocusEvent('focusout', { bubbles: true, relatedTarget: one(root, 'a.shape.add') }));
    expect(actions).toEqual([{ type: 'shape/sort', q: 'a' }]);
    expect(list).toBeTruthy();
  });
});

describe('problems: the sentence under its box', () => {
  it('a step before the stop, ages out of order, a step at the end, a fall missing, "moves evenly" on the last: each in words', () => {
    let s = toggle(spendA());
    for (let k = 0; k < 3; k++) s = reduce(s, { type: ACT.SHAPE_ADD, q: 'a' });
    s = run(s,
      { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fromAge', value: '60' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'fromAge', value: '96' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 2, field: 'then', value: 'falls' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 2, field: 'perMonth', value: '0' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 2, field: 'then', value: 'glides' },
      { type: ACT.DRAFT_ASK, q: 'a' });
    expect(s.route.step).toBe('spend');                                      // a problem in a step: the answer does not open
    expect(s.ui.open).toContain('shape');
    const root = renderScreen(s);
    clean(root, s);
    const err = (id) => root.querySelector(`[data-error-for="${id}"]`)?.textContent;
    expect(err('a.spend.steps.0.fromAge')).toBe('This is not later than when you stop, at 62. Make it later, or change the figure above instead.');
    expect(err('a.spend.steps.1.fromAge')).toBe('This is after the end of the plan, at 95. Make it earlier, or remove it.');
    expect(err('a.spend.steps.2.perMonth')).toBe(SHAPE.errors.perMonth.tooLow);
    expect(err('a.spend.steps.2.then')).toBe(SHAPE.errors.then.glidesLast);
    const box = one(root, 'a.spend.steps.0.fromAge');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.getAttribute('aria-describedby')).toBe('a.spend.steps.0.fromAge.error');
  });
  it('a fall that is not a quarter step from 0.25 to 10, on the first amount: under its box', () => {
    const s = run(toggle(spendA()), set('a', 'spend.then', 'falls'), set('a', 'spend.fallsPct', '10.5'), { type: ACT.DRAFT_TOUCH, q: 'a', path: 'spend.fallsPct' });
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('[data-error-for="a.spend.fallsPct"]').textContent).toBe(SHAPE.errors.fallsPct.range);
  });
  it('a problem in a step on the answer step: the short form draws the block, open, with the sentence', () => {
    const typed = run(suggested(), { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'fromAge', value: '70' }, { type: ACT.SHAPE_TOUCH, q: 'a', i: 1, field: 'fromAge' });
    const s = go(typed, 'a', 'answer');
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('form.short-form [data-region="shape"]')).not.toBe(null);
    expect(one(root, 'a.shape.open')).toBe(null);
    expect(root.querySelector('[data-error-for="a.spend.steps.1.fromAge"]').textContent).toBe('Each step starts later than the one before: make this later than 75.');
  });
});

describe('C: a step that needs another look', () => {
  it('on "Show" the block opens under more detail; on the answer step the short form draws it, open, with the sentence', () => {
    const typed = run(typedC(fresh(), '250,000', '67'), { type: ACT.ROUTE_SET, route: route('step', 'c', 'numbers') }, { type: ACT.UI_TOGGLE, id: 'shape' },
      { type: ACT.SHAPE_ADD, q: 'c' }, { type: ACT.SHAPE_STEP, q: 'c', i: 0, field: 'fromAge', value: '66' });
    const asked = reduce(reduce(typed, { type: ACT.UI_TOGGLE, id: 'shape' }), { type: ACT.DRAFT_ASK, q: 'c' });
    expect(asked.route.step).toBe('numbers');
    expect(asked.ui.open).toEqual(expect.arrayContaining(['more', 'shape']));
    const root = renderScreen(asked);
    clean(root, asked);
    expect(root.querySelector('[data-error-for="c.shape.steps.0.fromAge"]').textContent).toBe('This is not later than your age today, 67. Make it later.');
    const onAnswer = go(asked, 'c', 'answer');
    const r = renderScreen(onAnswer);
    clean(r, onAnswer);
    expect(r.querySelector('form.short-form [data-region="shape"]')).not.toBe(null);
    expect(r.querySelector('[data-error-for="c.shape.steps.0.fromAge"]')).not.toBe(null);
  });
});

describe('two of you; question C; the budget\'s essentials', () => {
  it('a couple: "From when you are" your age, your partner\'s beside it; the suggestion from when the younger of you is 75 and 85', () => {
    const couple = run(typedA(fresh(), { age: '60', stop: '66', spend: '3,000' }), set('a', 'household', 'couple'), set('a', 'partner.age', '54'), set('a', 'partner.pot', '0'));
    const s = run(toggle(go(couple, 'a', 'spend')), { type: ACT.SHAPE_SUGGEST, q: 'a' });
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('label[for="a.spend.steps.0.fromAge"]').textContent).toBe(SHAPE.step.ageCouple);
    expect(one(root, 'a.spend.steps.0.fromAge').value).toBe('81');
    expect(one(root, 'a.shape.partner.0').textContent).toBe('(your partner 75)');
    expect(one(root, 'a.shape.note').textContent).toContain('Filled in: 15% less from 81 and 30% less from 91.');
    expect(one(root, 'a.shape.note').textContent).toContain(SHAPE.suggestCouple);
    expect(root.querySelector('.shape-axis').textContent).toBe('Your age (your partner is 6 years younger)');
    // one year apart: "1 year"; your partner older: "older"
    const older = run(toggle(go(run(typedA(fresh(), { age: '60', stop: '66', spend: '3,000' }), set('a', 'household', 'couple'), set('a', 'partner.age', '61'), set('a', 'partner.pot', '0')), 'a', 'spend')));
    expect(renderScreen(older).querySelector('.shape-axis').textContent).toBe('Your age (your partner is 1 year older)');
  });

  it('the ages under the picture never run into each other: a multiple of 5 less than 3 years after the first age is left out', () => {
    const at63 = toggle(spendA({ stop: '63' }));
    const ages = [...renderScreen(at63).querySelectorAll('[data-testid="a.shape.chart"] .shape-age')].map((x) => Number(x.textContent));
    expect(ages).toEqual([63, 70, 75, 80, 85, 90]);
    const at62 = toggle(spendA());
    expect([...renderScreen(at62).querySelectorAll('[data-testid="a.shape.chart"] .shape-age')].map((x) => Number(x.textContent))).toEqual([62, 65, 70, 75, 80, 85, 90]);
  });

  it('a couple whose stops are their own, your partner first: the first row says the household\'s money starts then', () => {
    const apart = run(typedA(fresh(), { age: '55', stop: '60', spend: '3,000' }), set('a', 'household', 'couple'), set('a', 'partner.age', '53'), set('a', 'partner.pot', '0'),
      set('a', 'partner.stop.kind', 'age'), set('a', 'partner.stop.age', '55'));
    const s = toggle(go(apart, 'a', 'spend'));
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.shape.first').textContent).toBe('From when the first of you stops, when you are 57: £3,000 a month (the figure above)');
  });

  it('C: under "Add more detail", each later age a share of what you start on; the picture in shares', () => {
    const c = run(typedC(fresh(), '250,000', '67'), { type: ACT.ROUTE_SET, route: route('step', 'c', 'numbers') }, { type: ACT.UI_TOGGLE, id: 'more' }, { type: ACT.UI_TOGGLE, id: 'shape' },
      { type: ACT.SHAPE_SUGGEST, q: 'c' });
    const root = renderScreen(c);
    clean(root, c);
    const block = one(root, 'c.shape');
    expect(block.closest('#more-detail')).not.toBe(null);
    expect(block.querySelector('h3').textContent).toBe(SHAPE.legend);
    expect(visibleText(block)).toContain(SHAPE.leadC);
    expect(one(root, 'c.shape.first').textContent).toBe('From the start: 100% of what you start on');
    expect(one(root, 'c.shape.steps.0.share').value).toBe('85');
    expect(root.querySelector('label[for="c.shape.steps.0.share"]').textContent).toBe(SHAPE.step.share);
    expect(one(root, 'c.shape.chart').getAttribute('data-unit')).toBe('share');
    expect(one(root, 'c.shape.note').textContent).toContain('Filled in: 85% of what you start on from 75 and 70% from 85.');
    // a shape typed keeps more detail open
    const closedMore = reduce(c, { type: ACT.UI_TOGGLE, id: 'more' });
    expect(renderScreen(closedMore).querySelector('#more-detail')).not.toBe(null);
  });

  it('the budget\'s essentials: a dashed guide on the picture, a year under them in words, and the suggestion never below them', () => {
    const sheet = starterSheet();
    Object.assign(sheet.lines.find((l) => l.essential), { amount: '1,800', period: 'mo' });
    const s0 = { ...toggle(spendA()), budget: sheet };
    const s = run(s0, { type: ACT.SHAPE_SUGGEST, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'perMonth', value: '1,500' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.shape.chart.essentials')).not.toBe(null);
    expect(one(root, 'a.shape.below').textContent).toBe('From 85 this is less than your budget’s essentials (£1,800 a month). That is allowed: it is your figure.');
    expect(root.querySelector('[data-testid="a.shape.chart"] g[data-age="85"]').getAttribute('class')).toContain('is-below');
    expect(visibleText(one(root, 'a.shape.chart'))).toContain(SHAPE.chart.keyEssentials);
    const fresh2 = run(s0, { type: ACT.SHAPE_SUGGEST, q: 'a' });
    expect(one(renderScreen(fresh2), 'a.shape.note').textContent).toContain(', not below your budget’s essentials of £1,800 a month.');
  });
});

describe('the picture: every year, in words too', () => {
  it('"Show each year" opens a table a screen reader reads row by row; the line under the picture names a year', () => {
    const s = toggle(suggested(), 'shapeYears');
    const { root, actions } = draw(s);
    clean(root, s);
    const table = root.querySelector('table[data-table="shape"]');
    expect(table.querySelectorAll('tbody tr').length).toBe(33);
    expect([...table.querySelectorAll('thead th')].map((th) => th.textContent)).toEqual([SHAPE.chart.tableAge, SHAPE.chart.tableAmount]);
    expect(table.querySelector('tbody tr[data-age="75"] td').textContent).toBe('£2,130');
    expect(one(root, 'a.shape.years').getAttribute('aria-expanded')).toBe('true');
    one(root, 'a.shape.years').click();
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'shapeYears' }]);
    expect(one(root, 'a.shape.chart.year').textContent).toBe(SHAPE.chart.pick);
    expect(one(root, 'a.shape.chart.year').getAttribute('aria-live')).toBe('polite');
  });
  it('at 390 px nothing is wider than the page: the picture is the box\'s width (no fixed width anywhere in it)', () => {
    const root = renderScreen(suggested());
    const svg = root.querySelector('[data-testid="a.shape.chart"] svg');
    expect(svg.getAttribute('width')).toBe(null);
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none');
    expect(svg.getAttribute('viewBox')).toBe('0 0 33 100');
  });
});

describe('an answer whose spending changes with age: "Try a change"', () => {
  /** A1's answer, its spending given steps by age, and held as the answer for what is typed now (nothing is being worked out). */
  const answered = () => {
    const s = run(replaced(load('a', 'answer-A1')), { type: ACT.SHAPE_SUGGEST, q: 'a' });
    return { ...s, answers: { ...s.answers, a: { ...s.answers.a, inputsKey: currentKey(s, 'a') } } };
  };
  it('the spending row is the start; −/+ £100 moves the start and the later steps with it; "Try it the same every year"', () => {
    const s = answered();
    const { root, actions } = draw(s);
    clean(root, s);
    expect(root.querySelector('#try-spend').textContent).toBe(SHAPE.try.spendStart);
    one(root, 'a.try.spend.down').click();
    one(root, 'a.try.shapeLevel').click();
    expect(actions).toEqual([
      { type: 'draft/set', q: 'a', path: 'spend.amount', value: '1,800' },
      { type: 'draft/set', q: 'a', path: 'spend.kind', value: 'amount' },
      { type: 'shape/rescale', q: 'a', from: 1900 },
      { type: 'shape/preset', q: 'a', id: 'level' }
    ]);
    expect(one(root, 'a.try.shapeLevel').textContent).toBe(SHAPE.try.level);
    // tried the same every year: the way back
    const flat = reduce(s, { type: ACT.SHAPE_PRESET, q: 'a', id: 'level' });
    const r = renderScreen(flat);
    expect(one(r, 'a.try.shapeBack').textContent).toBe(SHAPE.try.back);
    expect(one(r, 'a.try.shapeLevel')).toBe(null);
    const back = reduce(flat, { type: ACT.SHAPE_UNDO, q: 'a' });
    expect(shapeView(back, 'a').steps.length).toBe(2);
  });
  it('a flat answer is as it was: no shape row in "Try a change"', () => {
    const s = replaced(load('a', 'answer-A1'));
    const root = renderScreen(s);
    expect(one(root, 'a.try.shapeLevel')).toBe(null);
    expect(one(root, 'a.try.shapeBack')).toBe(null);
    expect(root.querySelector('#try-spend').textContent).toBe('Spending');
  });
});

describe('the words', () => {
  it('every drawn state passes the banned list in its scopes (A and B: saver, and retired when stopping now; C: retired)', () => {
    const now = run(toggle(go(typedA(fresh(), { age: '62', stop: '62', spend: '2,500' }), 'a', 'spend')), { type: ACT.SHAPE_SUGGEST, q: 'a' });
    const c = run(typedC(fresh(), '250,000', '67'), { type: ACT.ROUTE_SET, route: route('step', 'c', 'numbers') }, { type: ACT.UI_TOGGLE, id: 'more' }, { type: ACT.UI_TOGGLE, id: 'shape' },
      { type: ACT.SHAPE_PRESET, q: 'c', id: 'slowly' }, { type: ACT.UI_TOGGLE, id: 'shapeYears' });
    for (const s of [spendA(), suggested(), toggle(suggested(), 'shapeYears'), now, c]) {
      const root = renderScreen(s);
      expect(bannedHits(visibleText(root), scopesFor(s)), JSON.stringify(s.route)).toEqual([]);
      clean(root, s);
    }
    // stopping now: "From now", never "when you stop"
    expect(one(renderScreen(now), 'a.shape.first').textContent).toBe('From now, at 62: £2,500 a month (the figure above)');
  });
});

describe('answers whose spending changes with age (the answer functions\' own results, drawn)', () => {
  const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false };
  /** The question's answer for what is typed now, worked out in Node and held as the final answer. */
  const answeredNow = async (state, q, detail) => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    const parsed = parsedDraft(state, q);
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    const result = ANSWERS[q].answer(parsed.inputs, detail ? { ...ENV, detail } : ENV);
    const key = currentKey(state, q);
    return run(state, { type: ACT.ANSWER_WORKING, q, inputsKey: key }, { type: ACT.ANSWER_FINAL, q, inputsKey: key, result });
  };
  /** A: 55 today, £400,000, stopping at 62; go-go £3,000 a month to 75, go-slow falling 2% a year to 85, no-go £2,000. */
  const shapedA = () => run(typedA(fresh(), { age: '55', pot: '400,000', stop: '62', spend: '3,000' }),
    { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_ADD, q: 'a' },
    { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fromAge', value: '75' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '3,000' },
    { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'then', value: 'falls' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fallsPct', value: '2' },
    { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'fromAge', value: '85' }, { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'perMonth', value: '2,000' });

  it('A: the steps in words and a bar for every year, at the spending as you set it; "Could spend at the start"', async () => {
    const s = await answeredNow(go(shapedA(), 'a', 'answer'), 'a', 'chart');
    const r = s.answers.a.result;
    expect(r.spendShape.map((x) => x.fromAge)).toEqual([62, 75, 85]);
    const root = renderScreen(s);
    clean(root, s);
    const block = one(root, 'a.shape.answer');
    expect(block.closest('[data-region="answer"]')).toBe(null);                     // beside the answer, never inside it
    expect(one(root, 'a.shape.answer.list').textContent).toBe(
      `After tax, at today’s prices: £3,000 a month from 62; £3,000 from 75, falling 2% a year to ${money(r.spendShape[1].endPerMonth)} at 84; and £2,000 from 85.`);
    const bars = block.querySelectorAll('g.year');
    expect(bars.length).toBe(r.byYear.length);
    expect([...bars].map((g) => Number(g.getAttribute('data-figure')))).toEqual(r.byYear.map((row) => row.takeHome));
    expect(root.querySelector('[data-chart="ages"] thead th:nth-child(2)').textContent).toBe(SHAPE.answer.agesColumn);
    expect(root.textContent).toContain(SHAPE.answer.spendingShaped);
    expect(one(root, 'a.try.shapeLevel')).not.toBe(null);
    // the verdict's own words say the figure is the start, and what follows: under the band, before the verdict's sentence
    const shapeLine = one(root, 'a.answer.shape');
    expect(shapeLine.textContent).toBe(r.sentences.shape.text);
    expect(shapeLine.closest('[data-headline="verdict"]')).not.toBe(null);
    expect(shapeLine.compareDocumentPosition(root.querySelector('[data-sentence="verdict"]')) & window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // "What you could spend": the careful amount at the start, and the later steps moved with it
    if (r.sentences.couldShape) {
      const could = one(root, 'a.answer.couldShape');
      expect(could.textContent).toBe(r.sentences.couldShape.text);
      expect(could.closest('[data-pots]')).not.toBe(null);
    }
  }, 60_000);

  it('B: the number and the pay-in say the figure is the start, and the steps follow, in the answer\'s own words', async () => {
    const b = run(typedB(fresh(), { age: '45', pot: '120,000', payIn: '800', stop: '60', spend: '2,500' }), { type: ACT.SHAPE_SUGGEST, q: 'b' });
    const s = await answeredNow(go(b, 'b', 'answer'), 'b', 'answer');
    const r = s.answers.b.result;
    expect(r.sentences.shape.text).toMatch(/^That is at the start\. Then, as you set it: /);
    const root = renderScreen(s);
    clean(root, s);
    const lines = root.querySelectorAll('[data-testid="b.answer.shape"]');
    expect(lines.length).toBe(1);                                                    // said once, under the first headline
    expect(lines[0].textContent).toBe(r.sentences.shape.text);
    expect(lines[0].closest('section.headline')).not.toBe(null);
  }, 60_000);

  it('C: the picture at the careful amount; its line from the answer when it has one', async () => {
    const c = run(typedC(fresh(), '300,000', '66'), { type: ACT.ROUTE_SET, route: route('step', 'c', 'answer') }, { type: ACT.SHAPE_SUGGEST, q: 'c' });
    const s = await answeredNow(c, 'c');
    const r = s.answers.c.result;
    const root = renderScreen(s);
    clean(root, s);
    expect(r.shapeAt.careful.map((x) => x.fromAge)).toEqual([66, 75, 85]);
    expect(one(root, 'c.shape.answer').querySelector('h2').textContent).toBe(SHAPE.answer.titleC);
    expect(one(root, 'c.shape.answer.list').textContent).toContain(`${money(r.shapeAt.careful[0].perMonth)} a month from 66`);
    expect(one(root, 'c.shape.answer').querySelectorAll('g.year').length).toBe(r.byYear.length);
    if (r.sentences.shape) expect(one(root, 'c.answer.shape').textContent).toBe(r.sentences.shape.text);
    expect(one(root, 'c.try.shapeLevel')).not.toBe(null);
  }, 60_000);

  it('a flat answer draws no shape block at all (today\'s screen)', async () => {
    const s = await answeredNow(go(typedA(fresh(), { age: '55', pot: '400,000', stop: '62', spend: '3,000' }), 'a', 'answer'), 'a', 'chart');
    expect(s.answers.a.result.byYear).toBeUndefined();
    const root = renderScreen(s);
    expect(root.querySelector('[data-region="shape"]')).toBe(null);
    expect(root.querySelector('[data-chart="ages"] thead th:nth-child(2)').textContent).toBe('Could spend');
  }, 60_000);
});

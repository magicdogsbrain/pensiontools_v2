/**
 * "Save this as a plan" on screen (research/v7/save-as-plan.md "What the person sees"; Contract C.2, C.4): at the foot
 * of every answer of C, A and B and on each question's own step — the name box filled with the suggestion, "Save as a
 * plan", the line under it; the plain sentences for a name that will not do and a browser that will not keep it; why
 * saving is not offered; and on coming back, "Saved as '…'. Try something else and save that too." Every state is
 * held to checkScreen's rules.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen } from '../c/_c.js';
import { checkScreen, draw, visibleText, bannedHits, scopesFor } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';
import { C } from '../../../src/v7/copy/c.js';

vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const at = (state, step) => ({ ...state, route: { ...state.route, step } });
const WORDS = { a: A, b: B, c: C };

const ANSWERS = [['c', 'answer-F1', 'From 58 · £1,380 a month'], ['c', 'answer-F2', 'From 62 and 60 · £3,580 a month'], ['a', 'answer-A1', 'Stop at 60 · £1,900 a month'],
  ['a', 'answer-A2-couple', 'Stop at 56 and 54 · £3,590 a month'], ['b', 'answer-B1', 'Stop at 60 · £2,000 a month · paying £700'], ['b', 'answer-B2-on-course', 'Stop at 60 · £2,000 a month · paying £1,400']];

describe('at the foot of every answer', () => {
  it.each(ANSWERS)('%s %s: the name box holds "%s"; "Save as a plan"; the line under it', (q, name, suggested) => {
    const s = replaced(load(q, name));
    const root = renderScreen(s);
    clean(root, s);
    const panel = root.querySelector('[data-region="keep"]');
    expect(panel.querySelector('h2').textContent).toBe(KEEP.title);
    const box = one(root, `${q}.keep.name`);
    expect(box.value).toBe(suggested);
    expect(box.value).not.toMatch(/my plan/i);
    expect(root.querySelector(`label[for="${q}.keep.name"]`).textContent).toBe(KEEP.nameLabel);
    expect(box.getAttribute('aria-describedby')).toBe(`${q}.keep.name.help`);
    const save = one(root, `${q}.action.save`);
    expect(save.textContent).toBe(KEEP.save);
    expect(save.getAttribute('type')).toBe('submit');
    expect(save.disabled).toBe(false);
    expect(panel.textContent).toContain(KEEP.note);
    expect(panel.textContent).toContain(KEEP.privacy);
    expect(panel.textContent).not.toMatch(/guest/i);
    // after "What next?", outside the answer's own region
    expect(panel.closest('[data-region="answer"]')).toBe(null);
    const next = root.querySelector('[data-region="next"]');
    expect(next.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it('typing sends keep/name; "Save as a plan" (the button or Enter) sends keep/save — and nothing else', () => {
    const { root, actions } = draw(replaced(load('a', 'answer-A1')));
    const box = one(root, 'a.keep.name');
    box.value = 'The early one';
    fire(box, 'input');
    fire(one(root, 'a.action.save').closest('form'), 'submit');
    expect(actions).toEqual([{ type: 'keep/name', q: 'a', value: 'The early one' }, { type: 'keep/save', q: 'a' }]);
  });
  it('a name that will not do: the plain sentence under the box, joined to it', () => {
    for (const [value, problem] of [['  ', 'empty'], ['x'.repeat(61), 'tooLong']]) {
      const s = run(replaced(load('c', 'answer-F1')), { type: ACT.KEEP_NAME, q: 'c', value }, { type: ACT.KEEP_SAVE, q: 'c' });
      const root = renderScreen(s);
      clean(root, s);
      const error = root.querySelector('[data-error-for="c.keep.name"]');
      expect(error.textContent).toBe(KEEP.problems[problem]);
      expect(one(root, 'c.keep.name').getAttribute('aria-invalid')).toBe('true');
      expect(one(root, 'c.keep.name').getAttribute('aria-describedby')).toBe(error.id);
      expect(one(root, 'c.keep.name').value).toBe(value);
    }
  });
  it('a browser that would not keep the figures: the plain sentence; the box and the button stay', () => {
    const s = reduce(replaced(load('b', 'answer-B1')), { type: ACT.KEEP_FAILED, q: 'b', problem: 'storage' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'b.keep.problem').textContent).toBe(KEEP.problems.storage);
    expect(one(root, 'b.keep.name')).not.toBe(null);
  });
  it('coming back: "Saved as \'…\'. Try something else and save that too." — and the box is there for the next one', () => {
    const s = run(replaced(load('a', 'answer-A1')), { type: ACT.KEEP_SENT, q: 'a', name: 'Stop at 60 · £1,900 a month', createdAt: '2026-09-30T14:00:00.000Z' },
      { type: ACT.KEEP_BACK, q: 'a', outcome: 'taken' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.keep.saved').textContent).toBe('Saved as ‘Stop at 60 · £1,900 a month’. Try something else and save that too.');
    expect(one(root, 'a.keep.name').value).toBe('Stop at 60 · £1,900 a month');            // the box follows the answer again
    // and the rail says the step is done
    const step = root.querySelector('[data-testid="rail.a.keep"]').closest('li');
    expect(step.className).toContain('is-done');
  });
  it('coming back with the planner\'s final name (changed there, or given " (2)"): "Saved as" says that name', () => {
    const s = run(replaced(load('a', 'answer-A1')), { type: ACT.KEEP_SENT, q: 'a', name: 'Stop at 60 · £1,900 a month', createdAt: '2026-09-30T14:00:00.000Z' },
      { type: ACT.KEEP_BACK, q: 'a', outcome: 'taken', name: 'Stop at 60 · £1,900 a month (2)' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.keep.saved').textContent).toBe('Saved as ‘Stop at 60 · £1,900 a month (2)’. Try something else and save that too.');
  });
  it.each([['declined', 'Not saved: you chose not to make ‘Both at 60 – thinking’ in the planner. Your figures are still here; save again whenever you like.'],
    ['notMade', '‘Both at 60 – thinking’ was not saved as a plan. Your figures are still here; save again if you want it.']])(
    'coming back when no plan was made (%s): it says so — never "Saved as" — and the step is not done (review, 1 Oct 2026)', (outcome, words) => {
      const s = run(replaced(load('c', 'answer-F2')), { type: ACT.KEEP_SENT, q: 'c', name: 'Both at 60 – thinking', createdAt: '2026-09-30T14:00:00.000Z' },
        { type: ACT.KEEP_BACK, q: 'c', outcome });
      const root = renderScreen(s);
      clean(root, s);
      expect(one(root, 'c.keep.notSaved').textContent).toBe(words);
      expect(one(root, 'c.keep.saved')).toBe(null);
      expect(root.textContent).not.toContain('Saved as');
      expect(root.querySelector('[data-testid="rail.c.keep"]').closest('li').className).not.toContain('is-done');
      expect(one(root, 'c.keep.name')).not.toBe(null);                                      // the box is there to save again
    });
  it('coming back before the planner has taken it: the figures are waiting there, with the way to it — no figure in the address', () => {
    const s = run(replaced(load('c', 'answer-F1')), { type: ACT.KEEP_SENT, q: 'c', name: 'From 58', createdAt: '2026-09-30T14:00:00.000Z' },
      { type: ACT.KEEP_BACK, q: 'c', outcome: 'waiting' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'c.keep.waiting').textContent).toContain(fill(KEEP.waiting, { name: 'From 58' }));
    expect(one(root, 'c.keep.open').getAttribute('href')).toBe('../#new-plan');
  });
});

describe('where saving is not offered, it says why — and offers no box', () => {
  it.each([
    ['c', 'answer-pensions-only', 'notOk'], ['c', 'answer-closed-years', 'closedYears'], ['b', 'answer-out-of-reach', 'notOk'],
    ['a', 'answer-first', 'notFinal'], ['a', 'answer-updating', 'notCurrent'], ['b', 'answer-first', 'notFinal'], ['c', 'answer-updating', 'notCurrent']
  ])('%s %s: %s', (q, name, why) => {
    const s = replaced(load(q, name));
    const root = renderScreen(s);
    clean(root, s);
    const panel = root.querySelector('[data-region="keep"]');
    expect(panel).not.toBe(null);
    expect(panel.getAttribute('data-keep')).toBe(why);
    expect(one(root, `${q}.keep.why`).textContent).toBe(KEEP.why[why]);
    expect(one(root, `${q}.keep.name`)).toBe(null);
    expect(one(root, `${q}.action.save`)).toBe(null);
  });
});

describe('each question\'s own "Save this as a plan?" step', () => {
  it.each([['c', 'answer-F1'], ['a', 'answer-A1'], ['b', 'answer-B1']])('%s: the answer\'s own sentence, the panel without a second heading, and the way back', (q, name) => {
    const s = replaced(at(load(q, name), 'keep'));
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe(`${q}.keep`);
    expect(root.querySelector('h1').textContent).toBe(WORDS[q].steps.keep.label);
    expect(root.textContent).toContain(KEEP.stepLead);
    expect(one(root, `${q}.keep.summary`).textContent.length).toBeGreaterThan(20);
    expect(root.querySelector('[data-region="keep"] h2')).toBe(null);
    expect(one(root, `${q}.keep.name`)).not.toBe(null);
    expect(one(root, `${q}.keep.back`).getAttribute('href')).toBe(`#/${q}/answer`);
  });
  it('with nothing to save yet: says so, and leads back', () => {
    const s = replaced(load('a', 'keep-no-answer'));
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.keep.why').textContent).toBe(KEEP.why.noAnswer);
  });
  it('someone who has stopped: the retired view', () => {
    const s = replaced(at(load('b', 'answer-retired'), 'keep'));
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('main').getAttribute('data-view')).toBe('retired');
  });
  it('every word passes the banned list, by scope', () => {
    for (const [q, name] of [['c', 'answer-F1'], ['a', 'answer-A1'], ['b', 'answer-B1']]) {
      for (const step of ['answer', 'keep']) {
        const s = replaced(at(load(q, name), step));
        expect(bannedHits(visibleText(renderScreen(s)), scopesFor(s)), `${q} ${step}`).toEqual([]);
      }
    }
  });
});

function run(state, ...actions) { return actions.reduce((s, a) => reduce(s, a), state); }

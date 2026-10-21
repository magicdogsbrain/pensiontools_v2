/**
 * "Keep this as a plan" on screen (research/v7/save-as-plan.md "What the person sees"; road-to-7.md step 7: the preview
 * makes the plan itself): at the foot of every answer of C, A, B and D and on each question's own step — the name box
 * filled with the suggestion, "Keep as a plan", the line under it; the plain sentences for a name that will not do and for
 * a keep refused (the window full, the free time used up, the email not confirmed, storage, a failure, a couple half made);
 * why keeping is not offered; and after a keep, "Kept as ‘…’ in your account." with "Lock this plan?" and "Your plans". Every
 * state is held to checkScreen's rules.
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
import { D } from '../../../src/v7/copy/d.js';

vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const at = (state, step) => ({ ...state, route: { ...state.route, step } });
const WORDS = { a: A, b: B, c: C, d: D };
const MADE = { id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'Stop at 60 · £1,900 a month', where: 'account' };

const ANSWERS = [['c', 'answer-F1', 'From 58 · £1,350 a month'], ['c', 'answer-F2', 'From 62 and 60 · £3,500 a month'], ['a', 'answer-A1', 'Stop at 60 · £1,900 a month'],
  ['a', 'answer-A2-couple', 'Stop at 56 and 54 · £3,590 a month'], ['b', 'answer-B1', 'Stop at 60 · £2,000 a month · paying £700'], ['b', 'answer-B2-on-course', 'Stop at 60 · £2,000 a month · paying £1,400'],
  ['d', 'answer-D1', 'From 68 · £2,100 a month'], ['d', 'answer-D2-couple', 'From 72 and 70 · £2,800 a month']];

describe('at the foot of every answer', () => {
  it.each(ANSWERS)('%s %s: the name box holds "%s"; "Keep as a plan"; the line under it', (q, name, suggested) => {
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
    expect(save.textContent).toMatch(/^Keep/);
    expect(save.getAttribute('type')).toBe('submit');
    expect(save.disabled).toBe(false);
    expect(panel.textContent).toContain(KEEP.note);
    expect(panel.textContent).toContain(KEEP.privacy);
    expect(panel.textContent).not.toMatch(/guest/i);
    expect(panel.textContent).not.toMatch(/\bsave\b/i);
    // after "What next?", outside the answer's own region
    expect(panel.closest('[data-region="answer"]')).toBe(null);
    const next = root.querySelector('[data-region="next"]');
    expect(next.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it('typing sends keep/name; "Keep as a plan" (the button or Enter) sends keep/save — and nothing else', () => {
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
  it.each(['storage', 'full', 'usedUp', 'unverified', 'failed', 'notReady'])('a keep refused (%s): the plain sentence; the box and the button stay', (problem) => {
    const s = reduce(replaced(load('b', 'answer-B1')), { type: ACT.KEEP_FAILED, q: 'b', problem });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'b.keep.problem').textContent).toBe(KEEP.problems[problem]);
    expect(one(root, 'b.keep.problem').getAttribute('data-problem')).toBe(problem);
    expect(one(root, 'b.keep.name')).not.toBe(null);
    expect(root.textContent).not.toContain('Kept as');
  });
  it('a couple half made (the partner\'s plan kept, yours not): the sentence names the partner\'s plan; nothing claims yours', () => {
    const s = reduce(replaced(load('a', 'answer-A2-couple')), { type: ACT.KEEP_FAILED, q: 'a', problem: 'partial', name: 'Stop at 56 and 54 · £3,590 a month · partner' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.keep.problem').textContent).toBe(fill(KEEP.problems.partial, { name: 'Stop at 56 and 54 · £3,590 a month · partner' }));
    expect(one(root, 'a.keep.made')).toBe(null);
  });
  it('"Keep as a plan" while keeping: "Keeping…" on the button', () => {
    const s = reduce(replaced(load('a', 'answer-A1')), { type: ACT.KEEP_SAVE, q: 'a' });
    const root = renderScreen(s);
    expect(one(root, 'a.action.save').textContent).toBe(KEEP.saving);
    expect(one(root, 'a.action.save').getAttribute('aria-busy')).toBe('true');
  });
});

describe('after keeping (road-to-7.md step 7): "Kept as ‘…’", the lock step offered, "Your plans"', () => {
  it('in the account: "Kept as ‘…’ in your account. Try something else and keep that too."; "Lock this plan?" leads to the new plan\'s lock step; the box follows the answer again; the rail says Kept', () => {
    const s = reduce(replaced(load('a', 'answer-A1')), { type: ACT.KEEP_MADE, q: 'a', ...MADE });
    const root = renderScreen(s);
    clean(root, s);
    const made = one(root, 'a.keep.made');
    expect(made.querySelector('p').textContent).toBe('Kept as ‘Stop at 60 · £1,900 a month’ in your account. Try something else and keep that too.');
    expect(made.getAttribute('data-plan-id')).toBe(MADE.id);
    expect(one(root, 'a.keep.lock').textContent).toBe(KEEP.lockThis);
    expect(one(root, 'a.keep.lock').getAttribute('href')).toBe(`#/plan/${MADE.id}/lock`);
    expect(one(root, 'a.keep.plans').getAttribute('href')).toBe('#/plans');
    expect(one(root, 'a.keep.name').value).toBe('Stop at 60 · £1,900 a month');
    const step = root.querySelector('[data-testid="rail.a.keep"]').closest('li');
    expect(step.className).toContain('is-done');
    expect(step.textContent).toContain('Kept');
    expect(root.textContent).not.toMatch(/Saved as|new-plan|Undo/);
  });
  it('in this browser window: "in this browser window."; a couple: the partner\'s plan named', () => {
    const s = reduce(replaced(load('b', 'answer-B5-couple')), { type: ACT.KEEP_MADE, q: 'b', id: 'guest-a1b2c3d4', name: 'Ours', where: 'window', partnerId: 'guest-e5f6g7h8', partnerName: 'Ours · partner' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'b.keep.made').querySelector('p').textContent).toBe('Kept as ‘Ours’ in this browser window. Your partner’s part is in ‘Ours · partner’. Try something else and keep that too.');
    expect(one(root, 'b.keep.lock').getAttribute('href')).toBe('#/plan/guest-a1b2c3d4/lock');
  });
  it('D with a locked plan in the account: a separate plan, "Your locked plan is still the one you follow", and no lock offered', () => {
    const s = reduce(replaced(load('d', 'answer-D1')), { type: ACT.KEEP_MADE, q: 'd', id: 'NewPlanAbc123', name: 'From 68 · £2,100 a month', where: 'account', separate: true });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'd.keep.made').textContent).toContain(KEEP.madeSeparate);
    expect(one(root, 'd.keep.lock')).toBe(null);
    expect(one(root, 'd.keep.plans')).not.toBe(null);
  });
  it('the words of the panel pass the banned list in every scope the questions are shown in', () => {
    const all = Object.values(KEEP.made).concat(Object.values(KEEP.problems), Object.values(KEEP.why), [KEEP.title, KEEP.titleSeparate, KEEP.stepLead, KEEP.note, KEEP.privacy, KEEP.separate, KEEP.madePartner, KEEP.madeSeparate, KEEP.lockThis, KEEP.tryAnother]);
    for (const text of all) expect(bannedHits(fill(text, { name: 'Stop later' }), ['all', 'first', 'planner', 'retired', 'saver']), text).toEqual([]);
  });
});

describe('where keeping is not offered, it says why — and offers no box', () => {
  it.each([
    ['c', 'answer-pensions-only', 'notOk'], ['c', 'answer-closed-years', 'closedYears'], ['b', 'answer-out-of-reach', 'notOk'],
    ['a', 'answer-first', 'notFinal'], ['a', 'answer-updating', 'notCurrent'], ['b', 'answer-first', 'notFinal'], ['c', 'answer-updating', 'notCurrent'],
    ['d', 'answer-first', 'notFinal'], ['d', 'answer-updating', 'notCurrent'], ['d', 'answer-pensions-only', 'notOk']
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

describe('each question\'s own "Keep this as a plan?" step', () => {
  it.each([['c', 'answer-F1'], ['a', 'answer-A1'], ['b', 'answer-B1'], ['d', 'answer-D1']])('%s: the answer\'s own sentence, the panel without a second heading, and the way back', (q, name) => {
    const s = replaced(at(load(q, name), 'keep'));
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe(`${q}.keep`);
    expect(root.querySelector('h1').textContent).toBe(WORDS[q].steps.keep.label);
    expect(WORDS[q].steps.keep.label).toBe('Keep this as a plan?');
    expect(root.textContent).toContain(KEEP.stepLead);
    expect(one(root, `${q}.keep.summary`).textContent.length).toBeGreaterThan(20);
    expect(root.querySelector('[data-region="keep"] h2')).toBe(null);
    expect(one(root, `${q}.keep.name`)).not.toBe(null);
    expect(one(root, `${q}.keep.back`).getAttribute('href')).toBe(`#/${q}/answer`);
  });
  it('with nothing to keep yet: says so, and leads back', () => {
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
    for (const [q, name] of [['c', 'answer-F1'], ['a', 'answer-A1'], ['b', 'answer-B1'], ['d', 'answer-D1']]) {
      for (const step of ['answer', 'keep']) {
        const s = replaced(at(load(q, name), step));
        expect(bannedHits(visibleText(renderScreen(s)), scopesFor(s)), `${q} ${step}`).toEqual([]);
      }
    }
  });
});

function run(state, ...actions) { return actions.reduce((s, a) => reduce(s, a), state); }

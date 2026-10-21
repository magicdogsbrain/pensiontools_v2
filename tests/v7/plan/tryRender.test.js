/**
 * Try a change of your own on "Does it last?" drawn from its named states (research/v7/way-and-mix.md 4, 7):
 * tests/v7/states/plan/lasts-try-*.json, written by `node tests/v7/states/build-states.mjs --question plan` with the real
 * runs. The section sits under the three levers once the plan's own test is held; closed until asked (no box on a locked
 * plan until then); opened, every box of the planner's Try in V7's words at the plan's own figures; "Try it" sends the
 * boxes as checked; the tried verdict is the plan's own band; "What's different" one line per box that differs, or "This is
 * your plan as saved"; "Use this" with its confirm on an unlocked plan only; "Keep as a separate plan" on both; the copy
 * kept said with "Open it" and "Lock this plan?"; a box with a problem; a failure; the cost said. No banned word in any
 * scope a plan page is shown in; the states carry this version.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { VERSION } from '../../../src/constants.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { TRY_FIELDS } from '../../../src/answers/plan/schema.js';
import { tryDifferences } from '../../../src/answers/plan/lasts.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('lasts-try-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver'];

function draw(stored) {
  const state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return { state, root, actions, text: visibleText(root), words: visibleText(copy) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const T = LASTS.try;

describe('the named states of Try a change', () => {
  it('are the set the builder writes, each on #/plan/<id>/lasts with one plan and the plan\'s own test held, made with this version', () => {
    expect(NAMES.length).toBeGreaterThanOrEqual(10);
    for (const name of NAMES) {
      const s = load(name);
      expect(s.env.appVersion, name).toBe(VERSION);
      expect(s.route, name).toMatchObject({ screen: 'plan', step: 'lasts' });
      expect(s.plans.list, name).toHaveLength(1);
      expect(s.lasts.status, name).toBe('done');
      expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    }
  });
  it.each(NAMES)('%s: drawn, the try held as stored, no banned word in any scope a plan page is shown in, no rubbish', (name) => {
    const s = load(name);
    const { root, state, text, words } = draw(s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.lasts');
    expect(JSON.parse(JSON.stringify(state.lasts.tried))).toEqual(s.lasts.tried);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £|around £/i);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\bstrategy\b|\ballocation\b|Monte Carlo|\bMC\b|\bp10\b/);
  });
});

describe('the section', () => {
  it('lasts-try-closed: under the three levers, one button and no box; the button opens the boxes', () => {
    const { root, actions } = draw(load('lasts-try-closed'));
    const sec = one(root, 'plan.lasts.try');
    expect(sec).not.toBe(null);
    expect(sec.getAttribute('data-open')).toBe('0');
    expect(sec.querySelector('input, select')).toBe(null);
    expect(one(root, 'plan.lasts.levers').contains(sec)).toBe(true);
    one(root, 'plan.lasts.try.open').click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'tryOpen' });
  });
  it('lasts-try-open: every box of the planner\'s Try at the plan\'s own figures — the nine ways, the pot, the ISA and its policy, the income as shaped (the flat box hidden), the years, the cuts, the depth and the months blank; "Try it" sends the boxes as checked', () => {
    const s = load('lasts-try-open');
    const { root, actions } = draw(s);
    for (const f of TRY_FIELDS) {
      if (f.path === 'try.income') { expect(one(root, 'plan.lasts.try.income'), 'the flat box hidden while the income is as shaped').toBe(null); continue; }
      const el = f.type === 'choice' ? root.querySelector(`[data-field="${f.path}"] legend`) : root.querySelector(`label[for="plan.lasts.${f.path}"]`);
      expect(el, f.path).not.toBe(null);
    }
    expect(all(root, '[name="plan.lasts.try.way"]')).toHaveLength(9);
    expect(one(root, 'plan.lasts.try.way.pots-and-valves').checked).toBe(true);
    const pot = one(root, 'plan.lasts.try.pot').value;
    expect(pot).toMatch(/^\d+$/);
    expect(one(root, 'plan.lasts.try.isaPolicy.saved').checked).toBe(true);
    expect(one(root, 'plan.lasts.try.incomeMode.shape').checked).toBe(true);
    expect(one(root, 'plan.lasts.try.cuts.saved').checked).toBe(true);
    expect(one(root, 'plan.lasts.try.cutPct').value).toBe('');
    expect(one(root, 'plan.lasts.try.cutEsc').value).toBe('');
    one(root, 'plan.lasts.try.run').click();
    const sent = actions.pop();
    expect(sent.type).toBe('lasts/tryRun');
    expect(sent.boxes).toEqual(s.plans.view.page.lasts.try.run);
    expect(sent.boxes).toMatchObject({ way: 'pots-and-valves', pot: Number(pot), isaPolicy: 'saved', incomeMode: 'shape', cuts: 'saved', cutPct: '', cutEsc: '' });
    // a box typed sends plan/edit with the text as typed
    const years = one(root, 'plan.lasts.try.years');
    years.value = '30';
    years.dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: 'AlexWay01', path: 'try.years', value: '30' });
  });
  it('lasts-try-tried: the tried verdict as the plan\'s own band with the figures as data, "Tried in 1 run", "What\'s different" one line per box moved (the way, the ISA policy, the years), "Use this" and "Keep as a separate plan"', () => {
    const s = load('lasts-try-tried');
    const { root, actions } = draw(s);
    const band = one(root, 'plan.lasts.try.band');
    expect(band).not.toBe(null);
    expect(band.getAttribute('data-chance')).toBe(String(s.lasts.tried.result.a.chancePct));
    expect(band.getAttribute('data-typical')).toBe(String(Math.round(s.lasts.tried.result.a.typicalLeft)));
    expect(one(root, 'plan.lasts.try.ran').textContent).toBe('Tried in 1 run (0.5 s).');
    const diffs = all(root, '[data-testid="plan.lasts.try.diffs"] li').map((li) => li.getAttribute('data-diff'));
    expect(diffs).toEqual(tryDifferences(s.plans.list[0].plan, s.lasts.tried.boxes, s.env.today).map((d) => d.id));
    expect(diffs).toEqual(['way', 'isaPolicy', 'years']);
    expect(root.querySelector('[data-diff="way"]').textContent).toBe('The way the money is taken: Floor to an age, then decide (the plan: Pots & Valves).');
    expect(root.querySelector('[data-diff="years"]').textContent).toBe('30 years (the plan: 33).');
    expect(root.querySelector('[data-diff="isaPolicy"]').textContent).toBe('The ISA: held back, never drawn for income (the plan: used to keep early tax down).');
    one(root, 'plan.lasts.try.use').click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'tryConfirm' });
    one(root, 'plan.lasts.try.keep').click();
    expect(actions.pop()).toEqual({ type: 'lasts/tryKeep', planId: 'AlexWay01' });
    expect(one(root, 'plan.lasts.try.stale')).toBe(null);
  });
  it('lasts-try-none: tried as saved — "This is your plan as saved, run through Pots & Valves.", no "Use this", the keep still offered', () => {
    const { root } = draw(load('lasts-try-none'));
    expect(one(root, 'plan.lasts.try.none').textContent).toBe('This is your plan as saved, run through Pots & Valves.');
    expect(one(root, 'plan.lasts.try.use')).toBe(null);
    expect(one(root, 'plan.lasts.try.keep')).not.toBe(null);
  });
  it('lasts-try-confirm: the confirm counts the differences; "Use it" sends plan/useTry; "Not now" closes it', () => {
    const { root, actions } = draw(load('lasts-try-confirm'));
    const box = one(root, 'plan.lasts.try.confirmBox');
    expect(box.textContent).toContain('Your plan changes in 3 ways, as listed under “What’s different”; the rest stays as saved.');
    expect(one(root, 'plan.lasts.try.use')).toBe(null);
    one(root, 'plan.lasts.try.confirm').click();
    expect(actions.pop()).toEqual({ type: 'plan/useTry', planId: 'AlexWay01' });
    one(root, 'plan.lasts.try.notNow').click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'tryConfirm' });
  });
  it('lasts-try-kept: "Kept as ‘…’ in your account" with "Open it" to the copy\'s page and "Lock this plan?" to its lock step; the copy is said to be unlocked', () => {
    const { root } = draw(load('lasts-try-kept'));
    const note = one(root, 'plan.lasts.try.kept');
    expect(note.textContent).toContain('Kept as ‘Alex’s plan · tried’ in your account.');
    expect(note.textContent).toContain(T.kept.unlocked);
    expect(one(root, 'plan.lasts.try.openKept').getAttribute('href')).toBe('#/plan/Kq8LwT2mJv5PzYc9BnRd/plan');
    expect(one(root, 'plan.lasts.try.lock').getAttribute('href')).toBe('#/plan/Kq8LwT2mJv5PzYc9BnRd/lock');
  });
  it('lasts-try-working, lasts-try-failed, lasts-try-problem: "Trying it…"; the failure said; a box with a problem marked once "Try it" was pressed, nothing sent', () => {
    expect(one(draw(load('lasts-try-working')).root, 'plan.lasts.try.working')).not.toBe(null);
    expect(one(draw(load('lasts-try-failed')).root, 'plan.lasts.try.failed').textContent).toContain(T.failed);
    const { root } = draw(load('lasts-try-problem'));
    expect(root.querySelector('[data-error-for="plan.lasts.try.years"]').textContent).toBe(T.errors['try.years'].notANumber);
    expect(root.querySelector('[data-error-for="plan.lasts.try.pot"]').textContent).toBe(T.errors['try.pot'].required);
    expect(one(root, 'plan.lasts.try.problems')).not.toBe(null);
    expect(one(root, 'plan.lasts.try.result')).toBe(null);
  });
  it('lasts-try-locked (Buckets in order, locked): the boxes open once tried, the verdict and "What\'s different", never "Use this", the keep offered; "Fixed when…" once', () => {
    const { root, text } = draw(load('lasts-try-locked'));
    expect(one(root, 'plan.lasts.try.band')).not.toBe(null);
    expect(one(root, 'plan.lasts.try.use')).toBe(null);
    expect(one(root, 'plan.lasts.try.confirmBox')).toBe(null);
    expect(one(root, 'plan.lasts.try.keep')).not.toBe(null);
    expect(all(root, '[data-testid="plan.lasts.try.diffs"] li').map((li) => li.getAttribute('data-diff'))).toEqual(['way', 'years']);
    expect((text.match(/Fixed when you locked the plan on /g) || []).length).toBe(1);
    expect(all(root, '[data-testid="plan.lasts.try"] .plan-source')).toHaveLength(1);
  });
});

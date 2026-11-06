/**
 * A plan's home, drawn from its named states (7.3.0; research/v7/one-product-design.md "The plan home"; the mock-up
 * research/v7/mockups/first-visit.html, screen 4): tests/v7/states/plan/home-*.json, written by
 * `node tests/v7/states/build-states.mjs --question plan --only home-…` — the reading left out of the files and refreshed
 * here through viewFor, as the plan source does on load.
 *
 * Every state is held to the words' rules (the banned list in every scope its stage is shown in, no countdown, no unfilled
 * slot) and to the screen's contract: the sections in order (the plan's line and stage, the strip, To do, the year and where
 * you are, the tools, then the three folds); no rail and no box; at most three to-dos, the first the one thing to press;
 * a "Not now" that slides the to-do away and asks the window to put it off; no "Not done yet" anywhere on a locked plan;
 * every figure through Money; the stage a word as well as a colour.
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
import { parse } from '../../../src/v7/router/routes.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { ADVICE_SHORT } from '../../../src/v7/copy/common.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('home-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const T = 'plan.home';

function draw(stored, ...actions) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  for (const a of actions) state = reduce(state, a);
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state, dispatch: (a) => out.push(a) }), root);
  const words = (() => { const c = root.cloneNode(true); for (const el of c.querySelectorAll('.plan-name')) el.remove(); return visibleText(c); })();
  return { state, root, actions: out, text: visibleText(root), words };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const scopes = (stage) => ['all', 'record', ...(stage === 'saving' ? ['saver'] : ['retired'])];

describe('the named home states', () => {
  it('are the six the design names', () => {
    expect(NAMES).toEqual(['home-closed', 'home-draft-retired', 'home-drawing', 'home-locked-saver', 'home-moving', 'home-saving']);
  });
  it.each(NAMES)('%s: the contract — sections in order, no rail, no box, the words\' rules, figures through Money', (name) => {
    const { root, words } = draw(load(name));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan');
    const home = one(root, T);
    expect(home).not.toBe(null);
    expect(root.querySelector('[data-region="rail"]')).toBe(null);
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect(root.querySelectorAll('h1')).toHaveLength(1);
    const stage = home.getAttribute('data-stage');
    // the order of the page: what is due, where you are, then everything else
    const order = [...home.querySelectorAll(':scope > [data-testid], :scope > .home-row2 > [data-testid]')].map((el) => el.getAttribute('data-testid'));
    const want = [`${T}.strip`, `${T}.todo`, `${T}.year`, `${T}.where`, `${T}.tools`, `${T}.steps`, `${T}.change`, `${T}.ask`].filter((id) => order.includes(id));
    expect(order.filter((id) => want.includes(id))).toEqual(want);
    expect(order.indexOf(`${T}.todo`)).toBeLessThan(order.indexOf(`${T}.where`));
    // everything below the tools is folded away
    for (const id of [`${T}.steps`, `${T}.change`, `${T}.ask`]) { const d = one(root, id); if (d) { expect(d.tagName).toBe('DETAILS'); expect(d.hasAttribute('open')).toBe(false); } }
    // the words
    expect(bannedHits(words, scopes(stage))).toEqual([]);
    expect(COUNTDOWN.test(words)).toBe(false);
    expect(words).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).toContain(ADVICE_SHORT);
    // never "Not done yet" on a plan being carried out
    if (home.getAttribute('data-locked') === '1') expect(words).not.toContain(PLAN.page.marks.open);
    // every money figure is Money's: a whole number in data-value
    for (const el of root.querySelectorAll('[data-kind="money"]')) expect(el.getAttribute('data-value')).toMatch(/^-?\d+$/);
    // at most three to-dos, the first the one thing to press
    const items = [...one(root, `${T}.todo`).querySelectorAll(':scope > .home-items > .home-item')];
    expect(items.length).toBeLessThanOrEqual(3);
    if (items.length) {
      expect(items[0].classList.contains('is-first')).toBe(true);
      const pop = items[0].querySelector('.btn-pop');
      if (pop) expect(root.querySelectorAll('.btn-pop')).toHaveLength(1);
    } else if (!one(root, 'plan.readonly')) expect(one(root, `${T}.quiet`)).not.toBe(null);
    // the stage is a word as well as a colour
    if (stage !== 'none') expect(one(root, `${T}.headline`).textContent).toContain(HOME.stages[stage]);
  });
});

describe('each stage\'s home', () => {
  it('home-drawing: the strip on Drawing, "Update what you hold" with "Not now", the year\'s twelve months drawn to scale, where you are', () => {
    const { root, actions } = draw(load('home-drawing'));
    expect(one(root, `${T}.headline`).textContent).toBe('Drawing.');
    const now = one(root, `${T}.strip`).querySelector('[aria-current="step"]');
    expect(now.getAttribute('data-stage')).toBe('drawing');
    expect(now.textContent).toBe('Drawing · you are here');
    const items = [...root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)].map((li) => li.getAttribute('data-todo'));
    expect(items).toEqual(['hold.stale']);
    expect(one(root, `${T}.todo.hold.stale`).getAttribute('href')).toBe('#/plan/SamBuckets04/hold');
    const cells = [...root.querySelectorAll(`[data-testid="${T}.year"] .year-cell`)];
    expect(cells).toHaveLength(12);
    expect(cells.map((c) => c.getAttribute('data-month'))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03']);
    expect(cells.slice(0, 6).every((c) => c.getAttribute('data-state') === 'recorded')).toBe(true);
    expect(cells[0].querySelector('.year-bar').getAttribute('style')).toMatch(/^height: ?\d+%/);
    expect(cells[0].querySelector('.sr-only').textContent).toMatch(/^April 2026: recorded, £[\d,]+ taken before tax; the plan said £[\d,]+$/);
    expect(one(root, `${T}.where`).textContent).toContain('6 months recorded in 2026/27');
    // "Not now": the to-do slides away, then the window is asked to put it off — the plan is never written
    one(root, `${T}.notNow.hold.stale`).click();
    return new Promise((done) => setTimeout(() => {
      expect(actions).toEqual([{ type: 'todo/notNow', key: 'SamBuckets04|hold.stale' }]);
      done();
    }, 500));
  });
  it('home-drawing, put off: nothing due — the dated line, "September is recorded. Nothing is due until 1 October."', () => {
    const { root } = draw(load('home-drawing'), { type: A.TODO_NOT_NOW, key: 'SamBuckets04|hold.stale' });
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('September is recorded. Nothing is due until 1 October.');
  });
  it('home-moving: "Moving. 0 of n moves done.", the next order to place, the strip on Moving', () => {
    const { root } = draw(load('home-moving'));
    expect(one(root, `${T}.headline`).textContent).toMatch(/^Moving\./);
    const items = [...root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)].map((li) => li.getAttribute('data-todo'));
    expect(items[0]).toBe('move.next');
    expect(one(root, `${T}.todo.move.next`).getAttribute('href')).toBe('#/plan/SamLadder03/move');
    expect(one(root, `${T}.strip`).querySelector('[aria-current="step"]').getAttribute('data-stage')).toBe('moving');
    expect(one(root, `${T}.tool.move`)).not.toBe(null);
  });
  it('home-locked-saver: nothing due once this month\'s pot is recorded, said with its date; the check-in, not the form', () => {
    const { root, text } = draw(load('home-locked-saver'));
    expect(one(root, `${T}.headline`).textContent).toBe('Saving. You stop work in February 2038.');
    expect(one(root, `${T}.quiet`).textContent).toBe('September’s pot is recorded. Nothing is due until 1 October.');
    expect(one(root, `${T}.later`)).toBe(null);   // no "For later" marks on a locked saver's home: every step listed plainly
    expect(text).not.toContain('For later');
    expect(root.querySelector('form')).toBe(null);
    expect(one(root, `${T}.tool.checkin`).getAttribute('href')).toBe('#/plan/SamSaver02/checkin');
  });
  it('home-saving: the first check-in first; B and A offered with the plan\'s figures, folded away', () => {
    const { root } = draw(load('home-saving'));
    expect(root.querySelector(`[data-testid="${T}.todo"] .home-item`).getAttribute('data-todo')).toBe('checkin.first');
    expect([...one(root, `${T}.ask`).querySelectorAll('a')].map((a) => a.getAttribute('data-testid'))).toEqual([`${T}.ask.b`, `${T}.ask.a`]);
    expect(one(root, `${T}.year`)).toBe(null);
  });
  it('home-draft-retired: the lock first; "Change the plan" lists the plan\'s own pages', () => {
    const { root } = draw(load('home-draft-retired'));
    expect(one(root, `${T}.headline`).textContent).toBe('Drawing. Not locked yet.');
    expect(root.querySelector(`[data-testid="${T}.todo"] .home-item`).getAttribute('data-todo')).toBe('lock.first');
    expect([...one(root, `${T}.change`).querySelectorAll('a')].map((a) => a.textContent)).toContain(HOME.change.about);
  });
  it('home-closed: kept to read — the way to the plan that carries it on, its year frozen, no try and no question', () => {
    const { root } = draw(load('home-closed'));
    expect(one(root, `${T}.headline`).textContent).toBe('Closed.');
    expect(one(root, 'plan.closed')).not.toBe(null);
    expect(one(root, `${T}.todo.closed.next`).getAttribute('href')).toMatch(/^#\/plan\/[A-Za-z0-9]+$/);
    expect(one(root, `${T}.change`)).toBe(null);
    expect(one(root, `${T}.ask`)).toBe(null);
    expect(one(root, `${T}.strip`)).toBe(null);
  });
  it('a step page of the same plan: the rail\'s first link goes back to the home, its Next is the home\'s first to-do, and it asks no question', () => {
    const stored = load('home-moving');
    const step = { ...stored, route: parse('#/plan/SamLadder03/plan') };
    const { root } = draw(step);
    const rail = root.querySelector('[data-region="rail"]');
    expect(one(rail, 'rail.home').getAttribute('href')).toBe('#/plan/SamLadder03');
    expect(one(rail, 'rail.next').textContent).toMatch(/^Next: move 1 of \d+ to your plan’s mix: /);
    expect(rail.querySelector('[data-testid^="rail.ask."]')).toBe(null);
    // a locked plan's steps not done carry no "Not done yet" mark
    expect(rail.textContent).not.toContain(PLAN.page.marks.open);
  });
});

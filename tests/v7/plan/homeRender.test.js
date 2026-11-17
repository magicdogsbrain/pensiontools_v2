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
// someone still working is a saver, whatever the stage word: 7.10.0's Moving is a saver inside the move window
const SAVER_PLACINGS = ['saving', 'approaching', 'committed-saving'];
const scopes = (stage, placing = null) => ['all', 'record', ...(stage === 'saving' || SAVER_PLACINGS.includes(placing) ? ['saver'] : ['retired'])];

describe('the named home states', () => {
  it('are the six the design names, and the drawing plan short of its mix (7.3.1)', () => {
    expect(NAMES).toEqual(['home-closed', 'home-draft-retired', 'home-drawing', 'home-drawing-held', 'home-locked-saver', 'home-moving', 'home-saving']);
  });
  it.each(NAMES)('%s: the contract — sections in order, no rail, no box, the words\' rules, figures through Money', (name) => {
    const { root, words, state } = draw(load(name));
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
    expect(bannedHits(words, scopes(stage, state.plans.view && state.plans.view.page ? state.plans.view.page.stageKey : null))).toEqual([]);
    expect(COUNTDOWN.test(words)).toBe(false);
    expect(words).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).toContain(ADVICE_SHORT);
    // never "Not done yet" on a plan being carried out
    if (home.getAttribute('data-locked') === '1') expect(words).not.toContain(PLAN.page.marks.open);
    // every money figure is Money's: a whole number in data-value
    for (const el of root.querySelectorAll('[data-kind="money"]')) expect(el.getAttribute('data-value')).toMatch(/^-?\d+$/);
    // at most three to-dos, the first the one thing to press
    const items = [...one(root, `${T}.todo`).querySelectorAll(':scope > .home-items > .home-item')];
    // 7.10.0: at most one thing due shown (the rest "and N more")
    expect(items.length).toBeLessThanOrEqual(1);
    if (items.length) {
      expect(items[0].classList.contains('is-first')).toBe(true);
      const pop = items[0].querySelector('.btn-pop');
      if (pop) expect(root.querySelectorAll('.btn-pop')).toHaveLength(1);
    } else if (!one(root, 'plan.readonly')) expect(one(root, `${T}.quiet`)).not.toBe(null);
    // the stage is a word as well as a colour
    if (stage !== 'none') expect(one(root, `${T}.headline`).textContent).toContain(HOME.stages[stage]);
    // the questions promise the plan's figures only when a question really opens with them
    const ask = one(root, `${T}.ask`);
    if (ask) {
      const filled = [...ask.querySelectorAll('a[data-filled="plan"]')];
      const lead = one(root, `${T}.askLead`).textContent;
      if (filled.length) { expect(lead).toContain('opens with this plan’s figures'); expect(ask.querySelector('summary').textContent).toBe(HOME.askTitle); }
      else { expect(lead).toBe(HOME.askLeadPlain); expect(ask.querySelector('summary').textContent).toBe(HOME.askTitlePlain); }
    }
    // where you are: the headline only, its lines without their sources; alone on its row when there is no year view
    const where = one(root, `${T}.where`);
    expect(where.querySelectorAll('.plan-line').length).toBeLessThanOrEqual(3);
    expect(where.querySelector('.plan-source')).toBe(null);
    expect(root.querySelector('.home-row2').classList.contains('is-one')).toBe(!one(root, `${T}.year`));
  });
});

describe('each stage\'s home', () => {
  // retaken in 7.10.0 (spec-7100 §5, §8): "Living on it."; what you hold out of date is no longer a to-do, so a plan with this
  // month recorded has nothing due; with it not recorded, the month is the one thing due, with "Not now" stored on the plan
  /** home-drawing with September not recorded: the month is due. */
  const septemberMissing = () => { const s0 = load('home-drawing'); const p = s0.plans.list[0].plan; p.decisionTool.history = p.decisionTool.history.filter((h) => String(h.date).slice(0, 7) !== '2026-09'); return s0; };
  it('home-drawing: "Living on it.", the strip, nothing due with this month recorded, the year\'s twelve months drawn to scale, where you are', () => {
    const { root } = draw(load('home-drawing'));
    expect(one(root, `${T}.headline`).textContent).toBe('Living on it.');
    const now = one(root, `${T}.strip`).querySelector('[aria-current="step"]');
    expect(now.getAttribute('data-stage')).toBe('drawing');
    expect(now.textContent).toBe('Living on it · you are here');
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('September is recorded. Nothing is due until 1 October.');
    // the next review, said once beside the quiet line (it does not say it), with the way to it
    expect(one(root, `${T}.review`).textContent).toBe('Your next review: April 2027. Review now');
    expect(one(root, `${T}.review.now`).getAttribute('href')).toBe('#/plan/SamBuckets04/review');
    const cells = [...root.querySelectorAll(`[data-testid="${T}.year"] .year-cell`)];
    expect(cells).toHaveLength(12);
    expect(cells.map((c) => c.getAttribute('data-month'))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03']);
    expect(cells.slice(0, 6).every((c) => c.getAttribute('data-state') === 'recorded')).toBe(true);
    expect(cells[0].querySelector('.year-bar').getAttribute('style')).toMatch(/^height: ?\d+%/);
    // 7.12.0: "the plan said" only when the month differs from what it told the person to take
    expect(cells[0].querySelector('.sr-only').textContent).toMatch(/^April 2026: recorded, £[\d,]+ taken before tax$/);
    expect(one(root, `${T}.where`).textContent).toContain('6 months recorded in 2026/27');
  });
  it('home-drawing with September not recorded: the month is the one thing due; "Not now" asks the plan write to store it on the plan', () => {
    const { root, actions } = draw(septemberMissing());
    const items = [...root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)].map((li) => li.getAttribute('data-todo'));
    expect(items).toEqual(['month.record']);
    expect(one(root, `${T}.todo.month.record`).getAttribute('href')).toBe('#/plan/SamBuckets04/month');
    one(root, `${T}.notNow.month.record`).click();
    return new Promise((done, failed) => setTimeout(() => {
      try { expect(actions).toEqual([{ type: 'plan/task', planId: 'SamBuckets04', key: 'month.record@2026-09', how: 'notNow' }]); done(); } catch (e) { failed(e); }
    }, 500));
  });
  it('home-drawing, September put off: nothing due — the review\'s date said, and until when it is put off', () => {
    // stored on the plan (7.10.0): the plan as read back after the write, and the write's own toast
    const stored = septemberMissing();
    stored.plans.list[0].plan.tasks = { dismissed: { 'month.record@2026-09': { at: '2026-09-30T12:00:00.000Z', until: '2026-10' } } };
    const { root } = draw(stored, { type: A.PLAN_SAVED, planId: 'SamBuckets04', previous: null, line: { id: 'putOff', slots: { month: 'October 2026' }, key: 'month.record@2026-09' }, op: 'task' });
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. Your next review is April 2027.');
    // said once: the quiet line says the review's date, so no second review line — and "Review now" is still offered
    expect(one(root, `${T}.review`)).toBe(null);
    expect(one(root, `${T}.review.now`).textContent).toBe('Review now');
    expect(one(root, `${T}.review.now`).getAttribute('href')).toBe('#/plan/SamBuckets04/review');
    expect(one(root, `${T}.notNowDone`).textContent).toBe('Put off until October 2026.');
    expect(one(draw(load('home-drawing')).root, `${T}.notNowDone`)).toBe(null);
    // while the write is under way the to-do is already gone from the list
    const pending = draw(septemberMissing(), { type: A.PLAN_TASK, planId: 'SamBuckets04', key: 'month.record@2026-09', how: 'notNow' });
    expect(pending.root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
  });
  it('home-moving: a saver inside the move window reads "Moving." — what is held never decides it; the strip on Moving, no move to-do', () => {
    // retaken in 7.10.0 (spec-7100 §2): the Moving home was a ladder short of its rungs before its first month — read from what
    // it held. Its stop has passed, so it is Living on it now; Moving is a saver inside the window (Alex, a four-year window)
    const { root } = draw(load('home-moving'));
    expect(one(root, `${T}.headline`).textContent).toMatch(/^Moving\.$/);
    // 7.10.0: the window line, no to-do (the first check-in is not one), the review whenever they like
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.moveWindow`).textContent).toBe('In your move window: 40 months left, to January 2030. You can record what you hold when you like.');
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. You can review your plan whenever you like.');
    expect(one(root, `${T}.review`)).toBe(null);
    expect(one(root, `${T}.review.now`).getAttribute('href')).toBe('#/plan/AlexMoving03/review');
    expect(one(root, `${T}.drift`)).toBe(null);
    // someone in the move window still pays in: the check-in is the first tool
    expect(one(root, `${T}.tools`).querySelector('a').getAttribute('data-testid')).toBe(`${T}.tool.checkin`);
    expect(one(root, `${T}.strip`).querySelector('[aria-current="step"]').getAttribute('data-stage')).toBe('moving');
    expect(one(root, `${T}.tool.move`)).not.toBe(null);
    expect(one(root, `${T}.headline`).textContent).not.toMatch(/moves done/);
    // a Moving plan keeps the step's long name, on the home, the rail and the move page alike
    expect(one(root, `${T}.step.move`).textContent).toBe(PLAN.steps.move.label);
    expect(one(root, `${T}.tool.move`).textContent).toMatch(/^Moving to your plan’s mix · /);
    const { root: move } = draw({ ...load('home-moving'), route: parse('#/plan/AlexMoving03/move') });
    expect(one(move, 'plan.step.move').textContent).toBe(PLAN.steps.move.label);
    expect(one(move.querySelector('[data-region="rail"]'), 'rail.plan.move').textContent).toContain(PLAN.steps.move.label);
  });
  // retaken in 7.10.0 (spec-7100 §3.2, §5): what is held never decides the stage and is never a to-do — the drift line says it
  // when a bucket is more than a tenth of the pension from the mix, or a ladder's gilt for this year or next is not held
  it('home-drawing-held: a ladder recording months while short of its rungs reads "Living on it."; no move to-do, the strip done, no line while no gilt is due soon', () => {
    const { root, words } = draw(load('home-drawing-held'));
    expect(one(root, `${T}.headline`).textContent).toBe('Living on it.');
    expect(one(root, `${T}.strip`).querySelector('[aria-current="step"]').getAttribute('data-stage')).toBe('drawing');
    const items = [...root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)].map((li) => li.getAttribute('data-todo'));
    expect(items).not.toContain('move.next');
    expect(items).not.toContain('move.finish');
    expect(one(root, `${T}.drift`)).toBe(null);
    expect(one(root, `${T}.heldMix`)).toBe(null);
    const seg = one(root, `${T}.strip`).querySelector('[data-stage="moving"]');
    expect(seg.getAttribute('data-state')).toBe('done');
    // the move tool goes by the mix and says its own state, never a share beside the stage
    expect(one(root, `${T}.tool.move`).textContent).toMatch(/^Your plan’s mix · /);
    expect(words).not.toMatch(/moves done|% held/);
    // "Moving" is said nowhere on a Living-on-it home but the strip's own word for the stage behind it
    const rest = one(root, T).cloneNode(true);
    rest.querySelector(`[data-testid="${T}.strip"]`).remove();
    expect(rest.textContent).not.toMatch(/\bMoving\b/);
    // the rail on a step page: its Next is never a move; its move step by the mix's name
    const { root: step } = draw({ ...load('home-drawing-held'), route: parse('#/plan/SamLadder07/plan') });
    const rail = step.querySelector('[data-region="rail"]');
    expect(one(rail, 'rail.next').textContent).not.toMatch(/to your plan’s mix/);
    expect(one(rail, 'rail.plan.move').textContent).toContain(PLAN.steps.move.short);
    expect(rail.textContent).not.toMatch(/\bMoving\b/);
    const { root: move } = draw({ ...load('home-drawing-held'), route: parse('#/plan/SamLadder07/move') });
    expect(one(move, 'plan.step.move').textContent).toBe(PLAN.steps.move.short);
  });
  it('home-drawing-held with nothing it holds recorded: no move to-do and no line about what it holds', () => {
    const s = load('home-drawing-held');
    s.plans.list[0].plan.holdings = null;
    const { root } = draw(s);
    expect(one(root, `${T}.headline`).textContent).toBe('Living on it.');
    expect(one(root, `${T}.drift`)).toBe(null);
    expect(root.querySelector('[data-todo="move.next"]')).toBe(null);
    expect(one(root, `${T}.tool.move`).textContent).toMatch(/^Your plan’s mix · /);
  });
  it('home-drawing: a record that shows the plan\'s mix says nothing; a third of the shares in cash says the drift line, with the way to test it', () => {
    const { root } = draw(load('home-drawing'));
    expect(one(root, `${T}.drift`)).toBe(null);
    expect(one(root, `${T}.tool.move`).textContent).toBe('Your plan’s mix · Done');
    const s = load('home-drawing');
    const lines = s.plans.list[0].plan.holdings.lines;
    const sh = lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'HMWO');
    const cash = lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'CSH2');
    const moved = Math.round(sh.value / 3); sh.value -= moved; cash.value += moved;
    const { root: off } = draw(s);
    const d = one(off, `${T}.drift`);
    expect(d.closest(`[data-testid="${T}.where"]`)).not.toBe(null);
    expect(d.getAttribute('data-bucket')).toBe('shares');
    expect(d.querySelector('p.note').textContent).toMatch(/^Shares are \d+% of your pension; the plan’s mix has \d+% in shares\.$/);
    const link = one(off, `${T}.drift.test`);
    expect(link.textContent).toBe(HOME.drift.link);
    expect(link.closest('p.note')).toBe(null);
    expect(link.getAttribute('href')).toBe('#/plan/SamBuckets04/review');
    // never a to-do
    expect([...off.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)]).toHaveLength(0);
  });
  it('home-locked-saver: nothing due once this month\'s pot is recorded, said with its date; the check-in, not the form', () => {
    const { root, text } = draw(load('home-locked-saver'));
    expect(one(root, `${T}.headline`).textContent).toBe('Saving. You stop work in February 2038.');
    // retaken in 7.10.0 (spec-7100 §4.3): once a year from its last pot record, said with its date; and when its window opens
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. Your next review is September 2027.');
    // the month the move window opens, however far off: 36 months before the stop, February 2038 → February 2035
    expect(one(root, `${T}.moveWindow`).textContent).toBe('Your move window opens in February 2035.');
    expect(one(root, `${T}.later`)).toBe(null);   // no "For later" marks on a locked saver's home: every step listed plainly
    expect(text).not.toContain('For later');
    expect(root.querySelector('form')).toBe(null);
    expect(one(root, `${T}.tool.checkin`).getAttribute('href')).toBe('#/plan/SamSaver02/checkin');
  });
  // retaken in 7.10.0 (spec-7100 §5): the first check-in is no longer a to-do — the review whenever they like
  it('home-saving: nothing due, a review whenever they like and the window\'s month; B and A offered with the plan\'s figures, folded away', () => {
    const { root } = draw(load('home-saving'));
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. You can review your plan whenever you like.');
    expect(one(root, `${T}.moveWindow`).textContent).toBe('Your move window opens in January 2027.');
    expect([...one(root, `${T}.ask`).querySelectorAll('a')].map((a) => a.getAttribute('data-testid'))).toEqual([`${T}.ask.b`, `${T}.ask.a`]);
    expect(one(root, `${T}.year`)).toBe(null);
  });
  // retaken in 7.10.0 (spec-7100 §5): the lock is no longer a to-do; retaken again (nothing due is nothing in To do): the
  // nothing-due line says the review, and that its months wait for the lock is said on the Month by month tool only
  it('home-draft-retired: "Living on it. Not locked yet.", nothing due; "Change the plan" lists the plan\'s own pages', () => {
    const { root } = draw(load('home-draft-retired'));
    expect(one(root, `${T}.headline`).textContent).toBe('Living on it. Not locked yet.');
    expect(root.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(one(root, `${T}.quiet`).textContent).toBe('Nothing due. You can review your plan whenever you like.');
    expect(one(root, `${T}.review`)).toBe(null);
    expect(one(root, `${T}.review.now`).textContent).toBe('Review now');
    expect(one(root, `${T}.tool.month`).textContent).toContain('Months are recorded once the plan is locked');
    expect([...one(root, `${T}.change`).querySelectorAll('a')].map((a) => a.textContent)).toContain(HOME.change.about);
  });
  it('home-closed: kept to read — the way to the plan that carries it on, its year frozen, no try and no question', () => {
    const { root } = draw(load('home-closed'));
    expect(one(root, `${T}.headline`).textContent).toBe('Closed.');
    expect(one(root, 'plan.closed')).not.toBe(null);
    // the way on is offered once: its to-do, not a second button in the notice above it
    expect(one(root, 'plan.closed.open')).toBe(null);
    expect([...root.querySelectorAll('a')].filter((a) => a.textContent.startsWith('Open ‘'))).toHaveLength(1);
    expect(one(root, `${T}.todo.closed.next`).getAttribute('href')).toMatch(/^#\/plan\/[A-Za-z0-9]+$/);
    expect(one(root, `${T}.change`)).toBe(null);
    expect(one(root, `${T}.ask`)).toBe(null);
    expect(one(root, `${T}.strip`)).toBe(null);
  });
  it('a step page of the same plan: the rail\'s first link goes back to the home, its Next is the home\'s first to-do, and it asks no question', () => {
    // retaken in 7.10.0: home-moving is a saver inside the move window (Alex, not locked) with nothing due: the rail says the
    // window, as the home does (the locked ladder this used to be is Living on it now: home-drawing-held below)
    const stored = load('home-moving');
    const step = { ...stored, route: parse('#/plan/AlexMoving03/plan') };
    const { root } = draw(step);
    const rail = root.querySelector('[data-region="rail"]');
    expect(one(rail, 'rail.home').getAttribute('href')).toBe('#/plan/AlexMoving03');
    expect(one(rail, 'rail.next').textContent).toContain('In your move window: 40 months left, to January 2030.');
    const { root: home } = draw(stored);
    expect(home.querySelectorAll(`[data-testid="${T}.todo"] .home-item`)).toHaveLength(0);
    expect(rail.querySelector('[data-testid^="rail.ask."]')).toBe(null);
    // a locked plan's steps not done carry no "Not done yet" mark
    const { root: ladder } = draw({ ...load('home-drawing-held'), route: parse('#/plan/SamLadder07/plan') });
    expect(ladder.querySelector('[data-region="rail"]').textContent).not.toContain(PLAN.page.marks.open);
  });
});

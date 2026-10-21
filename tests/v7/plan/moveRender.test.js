/**
 * "Moving to your plan's mix" drawn from its named states (research/v7/holdings-and-move.md §3, §7; road-to-7.md step 10):
 * tests/v7/states/plan/move-*.json (the locked ladder in its run-up, the locked Buckets plan with its shares line cut by a
 * third and the one run on the held mix held), written by `node tests/v7/states/build-states.mjs --question plan` — the
 * reading left out and refreshed here through viewFor. The saver's move, the unlocked plan's, the done move, the rotation
 * watch (the ladder read as the rotation), the State Pension gate, the working, failed, confirm, shown-as-saved and window
 * states are made here from these by the reducer. Every state is held to the words' rules (the banned list in every scope a
 * plan page is shown in; never "transition", "run-up", "nominal", "wrapper") and to the screen's contract: "Optional…" on its
 * face and the status; what skipping it costs; the saver's rule; the cash to hold now; Buy and Sell with a Done tick each;
 * Already held; Left alone; the totals; When; "How to read this"; the order sheet with "Show the sheet anyway" behind the
 * gate; "Gilt ladders explained" with the plan's own first rung; the watch, the ticket and the switch handed to the planner;
 * the last line always "Illustration, not advice. Nothing here places an order."
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
import { VERSION } from '../../../src/constants.js';
import { MOVE } from '../../../src/v7/copy/move.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { corpus, entryOf } from './_plans.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('move-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const T = 'plan.move';
const C = corpus();

function draw(stored, ...actions) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  for (const a of actions) state = reduce(state, typeof a === 'function' ? a(state) : a);
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const actionsOut = [];
  render(h(App, { state, dispatch: (a) => actionsOut.push(a) }), root);
  return { state, root, actions: actionsOut, text: visibleText(root), words: wordsOf(root), view: state.plans.view.page.move };
}
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const planOf = (s) => s.plans.list[0].plan;
/** The plan replaced in page memory (a plan read again), the id kept. */
const replaced = (fn) => (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => ({ ...e, plan: fn(JSON.parse(JSON.stringify(e.plan))) })), source: st.plans.source, readAt: '14:04' });
const checkWords = (text, words) => {
  expect(bannedHits(words, SCOPES)).toEqual([]);
  expect(text).not.toMatch(/about £|around £/i);
  expect(COUNTDOWN.test(words)).toBe(false);
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(words).not.toMatch(/\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\btransition\b|\bportfolio\b|\bnominal\b|run-?up|\bapprox/i);
  expect(text.trim().endsWith(MOVE.footer) || text.includes(MOVE.footer)).toBe(true);
};

describe('the named states of "Moving to your plan\'s mix"', () => {
  it('are the two the builder writes, made with this version; each holds one locked plan and no reading; the mix state holds the one run on the held mix', () => {
    expect(NAMES).toEqual(['move-ladder', 'move-mix']);
    expect(MADE.version).toBe(VERSION);
    expect(MADE.futures).toBe(1000);
    for (const name of NAMES) { const s = load(name); expect(s.plans.list, name).toHaveLength(1); expect(s.plans.view, name).toBeUndefined(); expect(planOf(s).decisionTool.settings.locked).toBe(true); }
    const m = load('move-mix').move;
    expect(m.status).toBe('done');
    expect(m.result.basis).toEqual({ today: load('move-mix').env.today, engine: 'one-test', runs: 1 });
    expect(m.index).toMatchObject({ level: 7690.73, ath: 7818.93, asOf: '2026-10-19' });
  });
  it.each(NAMES)('%s survives JSON, carries this version and is drawn on #/plan/<id>/move as its own screen, the move step current on the rail; the words pass', (name) => {
    const s = load(name);
    expect(s.env.appVersion).toBe(VERSION);
    expect(s.route).toMatchObject({ screen: 'plan', step: 'move' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const { root, text, words } = draw(s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.move');
    expect(one(root, 'plan.step.move').textContent).toBe(MOVE.title);
    expect(one(root, `${T}.optional`).textContent).toBe(MOVE.optional);
    expect(one(root, `${T}.footer`).textContent).toBe(MOVE.footer);
    expect(root.querySelector('[data-testid="rail.plan.move"]').getAttribute('aria-current')).toBe('step');
    checkWords(text, words);
  });
});

describe('a ladder plan in its run-up (03): the lists, the cash, the sheet, gilt ladders explained', () => {
  it('move-ladder: the status in gilts bought, what skipping it costs in tax years, the cash to hold now row by row, Buy with a Done tick each, Sell, Already held with the spare, Left alone, the totals, When, "How to read this" closed; a tick sends one tick-off', () => {
    const s = load('move-ladder');
    const plan = planOf(s);
    const { root, text, actions, view } = draw(s);
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-kind')).toBe('ladder');
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-waiting')).toBe('0');
    expect(one(root, `${T}.status.line`).textContent).toBe(`${view.rungs.bought} of 23 gilts bought; ${view.progressPct}% of the plan’s mix held.`);
    expect(one(root, `${T}.next`).textContent).toMatch(/^Next: (buy|sell) /);
    expect(one(root, `${T}.runUp`).textContent).toMatch(/^Until your plan pays you draw £[\d,]+ a month from your pension cash, for \d+ more months: £[\d,]+ of the cash to hold now\.$/);
    expect(one(root, `${T}.cost.ladder`).textContent).toBe(`${view.cost.uncovered.length} tax years (${view.cost.uncovered[0]} to ${view.cost.uncovered[view.cost.uncovered.length - 1]}) have no gilt bought yet.`);
    expect(one(root, `${T}.cost.button`), 'a ladder plan has no run to offer').toBe(null);
    // the cash to hold now: the months before the plan pays, the cash years, the total, what is held, the spare
    const cashRows = all(root, `[data-testid="${T}.cash.table"] tbody tr`).map((tr) => tr.getAttribute('data-row'));
    expect(cashRows).toEqual(['runUp', 'cashYear', 'cashYear', 'total', 'held', 'spare']);
    expect(root.querySelector(`[data-testid="${T}.cash.table"] tr[data-row="runUp"]`).textContent).toMatch(/^The months before your plan pays: \d+ months at £[\d,]+£[\d,]+$/);
    expect(root.querySelector(`[data-testid="${T}.cash.table"] tr[data-row="cashYear"]`).textContent).toContain('Cash year 2027/28');
    // Buy and Sell, each line with a Done tick
    const buy = all(root, `[data-testid="${T}.buy"] tbody tr`);
    expect(buy.length).toBe(view.buy.length);
    expect(buy.length).toBe(23);
    expect(buy[0].getAttribute('data-key')).toBe('gilt:T29');
    expect(buy[0].textContent).toContain('the rung for 2029/30, 2030/31, 2031/32');
    expect(all(root, `[data-testid="${T}.sell"] tbody tr`).length).toBe(view.sell.length);
    expect(all(root, `[data-testid="${T}.sell"] tbody tr`).some((tr) => tr.textContent.includes('not in the plan — the proceeds pay for the ladder'))).toBe(true);
    expect(all(root, `[data-testid="${T}.held"] tbody tr`).length).toBe(view.hold.length);
    expect(one(root, `${T}.held`).textContent).toContain('spare — kept, not a sale');
    expect(all(root, `[data-testid="${T}.keep"] li`).length).toBe(2);
    expect(one(root, `${T}.keep`).textContent).toContain('ISA — kept as it is');
    expect(one(root, `${T}.keep`).textContent).toContain('cash in the bank — outside the pension, kept as it is');
    expect(one(root, `${T}.totals`).textContent).toBe(`Totals: buy ${view.totals.buy}, sell ${view.totals.sell}.`);
    const tick = one(root, `${T}.tick.gilt:T29`);
    expect(tick.checked).toBe(false);
    tick.checked = true;
    tick.dispatchEvent(new Event('change', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/tick', planId: plan.id, key: 'gilt:T29', done: true });
    // When: the schedule as "By {month year}: {action}" lines
    const steps = all(root, `[data-testid="${T}.schedule.steps"] li`);
    expect(steps.length).toBe(view.schedule.steps.length);
    expect(steps[0].textContent).toMatch(/^By [A-Z][a-z]+ \d{4}: (buy|sell) .+ \(£[\d,]+\)\.$/);
    expect(text).toContain('sales spread over');
    // How to read this, closed; the four rules open
    expect(one(root, `${T}.how.items`)).toBe(null);
    one(root, `${T}.how.open`).click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'moveHow' });
    const how = draw(s, { type: A.UI_TOGGLE, id: 'moveHow' });
    expect(all(how.root, `[data-testid="${T}.how.items"] li`).length).toBe(4);
    expect(how.text).toContain('Order gilts by units (the face value), not by amount');
    expect(one(root, `${T}.watch`), 'the full ladder has no rotation').toBe(null);
  });
  it('move-ladder: the order sheet — the document\'s 23 rungs numbered from 1 with the units to order, the price and cost at lock and whether each is bought, never re-priced; no gate on a plan with its own State Pension; "Gilt ladders explained" open with the plan\'s own first rung', () => {
    const s = load('move-ladder');
    const { root, text, view } = draw(s);
    const sheet = one(root, `${T}.sheet`);
    expect(sheet.getAttribute('data-gated')).toBe('0');
    expect(one(root, `${T}.sheet.gate`)).toBe(null);
    const rows = all(root, `[data-testid="${T}.sheet.table"] tbody tr`);
    expect(rows.length).toBe(23);
    expect(rows[0].getAttribute('data-rung')).toBe('1');
    expect(rows[0].getAttribute('data-bought')).toBe('part');
    expect(rows[0].textContent).toContain('T29');
    expect(rows[0].textContent).toContain('B3Y1JG8');
    expect(rows[0].textContent).toContain('22 March 2029');
    expect(rows[0].textContent).toContain('£156,000');
    expect(rows[0].textContent).toContain('88,600');
    expect(rows[0].textContent).toContain('(886 if the screen counts £100 lots)');
    expect(rows[0].textContent).toContain('98.22');
    expect(rows[0].textContent).toContain('£153,473');
    expect(rows[0].textContent).toContain('part bought');
    expect(text).toContain('The rungs as your plan was locked on 1 July 2026');
    expect(text).toContain(MOVE.sheet.order);
    expect(view.sheet.map((r) => r.bought).every((b) => ['bought', 'part', 'not yet', 'paid', 'sold'].includes(b))).toBe(true);
    // gilt ladders explained, open in this state: the four lines and the worked example from this plan's first rung
    expect(one(root, `${T}.explained.open`).textContent).toBe(MOVE.explained.close);
    expect(all(root, `[data-testid="${T}.explained.body"] ol li`).length).toBe(4);
    expect(one(root, `${T}.explained.example`).textContent).toBe('From this plan: its first rung is 0 1/8% Index-linked Treasury Gilt 2029 (T29) — 88,600 units cost £153,473 at lock and pay £156,000 in 2029/30, 2030/31, 2031/32, when the gilt matures on 22 March 2029.');
    const closed = draw(s, { type: A.UI_TOGGLE, id: 'moveExplained' });
    expect(one(closed.root, `${T}.explained.body`)).toBe(null);
    expect(one(closed.root, `${T}.explained.open`).textContent).toBe(MOVE.explained.open);
  });
  it('the State Pension gate (decision 6): sized on an assumed State Pension, the sheet opens with the warning, the units and the cost held back behind "Show the sheet anyway"; the rungs, codes and maturities always shown; nothing written', () => {
    const s = load('move-ladder');
    const gated = draw(s, replaced((p) => { p.planDocument.strategy.p = { ...p.planDocument.strategy.p, spAssumed: true, spAnnual: 11976, startAge: 58, spStartYear: 9 }; return p; }));
    expect(one(gated.root, `${T}.sheet`).getAttribute('data-gated')).toBe('1');
    expect(one(gated.root, `${T}.sheet.gate`).textContent).toContain('This sheet is sized on an assumed State Pension of £11,976 a year from 67. Enter your State Pension forecast — the figure and the date — under About you and when, and lock the plan again before buying.');
    expect(gated.root.querySelector(`[data-testid="${T}.sheet.gate"] a`).getAttribute('href')).toBe('#/plan/' + planOf(s).id + '/about');
    const row = gated.root.querySelector(`[data-testid="${T}.sheet.table"] tbody tr`);
    expect(row.textContent).toContain('T29');
    expect(row.textContent).toContain('22 March 2029');
    expect(row.textContent).not.toContain('88,600');
    expect(row.textContent).not.toContain('£153,473');
    expect(one(gated.root, `${T}.sheet.anyway`).textContent).toBe(MOVE.sheet.showAnyway);
    one(gated.root, `${T}.sheet.anyway`).click();
    expect(gated.actions.pop()).toEqual({ type: 'ui/toggle', id: 'moveSheet' });
    const shown = draw(s, replaced((p) => { p.planDocument.strategy.p = { ...p.planDocument.strategy.p, spAssumed: true, spAnnual: 11976, startAge: 58, spStartYear: 9 }; return p; }), { type: A.UI_TOGGLE, id: 'moveSheet' });
    expect(one(shown.root, `${T}.sheet`).getAttribute('data-gated')).toBe('open');
    expect(shown.root.querySelector(`[data-testid="${T}.sheet.table"] tbody tr`).textContent).toContain('88,600');
    expect(one(shown.root, `${T}.sheet.anyway`).textContent).toBe(MOVE.sheet.hideAnyway);
    checkWords(gated.text, gated.words);
  });
  it('the rotation watch and the ticket (the ladder read as the ladder + rotation, decision 7): armed with the block, the market against the trigger with the index\'s date; the trigger live when the index falls: the ticket and the switch handed to the planner', () => {
    const s = load('move-ladder');
    const asRotation = replaced((p) => { p.planDocument.strategy.id = 'gilt-rotation'; p.stressTool.settings.strategyId = 'gilt-rotation'; return p; });
    const { root, text, words, actions } = draw(s, asRotation);
    const watch = one(root, `${T}.watch`);
    expect(watch.getAttribute('data-state')).toBe('armed');
    expect(watch.getAttribute('data-live')).toBe('0');
    expect(one(root, `${T}.watch.state`).textContent).toBe('Armed: if world shares close 30% below their all-time high while you are 67 or younger, the rungs funding ages above 75 are sold and buy the share fund. Nothing to do until then.');
    expect(one(root, `${T}.watch.block`).textContent).toBe('The block: 11 rungs funding ages 76 to 90, worth £222,370 at the prices at lock, paying £349,329 of income across 2045/46 to 2059/60. It earns its yield while you wait.');
    expect(one(root, `${T}.watch.market`).textContent).toBe('S&P 500 (price index): 1.6% below its all-time high — 7,691 on 19 October 2026, against a high of 7,819 on 6 October 2026. The trigger fires at 5,473.');
    expect(one(root, `${T}.watch.asOf`).textContent).toBe('Index as of 19 October 2026.');
    expect(one(root, `${T}.watch.quiet`).textContent).toBe('No action: the market is 1.6% below its high.');
    expect(one(root, `${T}.watch.ticket`)).toBe(null);
    checkWords(text, words);
    // the index falls: the trigger is live, the ticket as the planner prints it, the switch hands over to the planner
    const live = draw(s, asRotation, { type: A.MOVE_INDEX, index: { level: 5000, ath: 7818.93, asOf: '2026-10-19', symbol: 'S&P 500 (price index)', athDate: '2026-10-06' } });
    expect(one(live.root, `${T}.watch`).getAttribute('data-live')).toBe('1');
    expect(one(live.root, `${T}.watch.live`).textContent).toContain('The trigger is live: 36.1% below the high.');
    const ticket = all(live.root, `[data-testid="${T}.watch.ticket.table"] tbody tr`);
    expect(ticket.length).toBe(12);
    expect(ticket[0].textContent).toContain('TR45');
    expect(ticket[0].textContent).toContain('27,900');
    expect(ticket[0].textContent).toContain('£23,566');
    expect(ticket[11].textContent).toContain('Total (11 gilts)');
    expect(one(live.root, `${T}.watch.switch`).textContent).toBe(MOVE.watch.switchButton);
    one(live.root, `${T}.watch.switch`).click();
    expect(live.actions.pop()).toEqual({ type: 'plan/change', planId: planOf(s).id, place: 'rotation', back: '#/plan/' + planOf(s).id + '/move' });
    checkWords(live.text, live.words);
    // no index read: the watch says so
    const none = draw(s, asRotation, { type: A.MOVE_INDEX, index: null });
    expect(one(none.root, `${T}.watch.noIndex`).textContent).toBe(MOVE.watch.noIndex);
    void actions;
  });
});

describe('a pot plan (04): the mix held, the one run on the held mix, done', () => {
  it('move-mix: the status in moves, the cost\'s one run held — "Tested on the mix you hold today…" beside the plan\'s own, "Tried in 1 run"; Buy and Sell one each with their why; Already held; Left alone; a tick', () => {
    const s = load('move-mix');
    const plan = planOf(s);
    const { root, text, actions, view } = draw(s);
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-kind')).toBe('buckets');
    expect(one(root, `${T}.status.line`).textContent).toBe(`${view.progressPct}% of the plan’s mix held; 0 of ${view.moves} moves ticked off.`);
    expect(view.moves).toBe('2');
    expect(text).toContain(MOVE.target.buckets);
    expect(one(root, `${T}.cost.headline`).textContent).toBe(`Tested on the mix you hold today (shares ${view.heldRun.result.pcts.shares}%, bonds ${view.heldRun.result.pcts.bonds}%, gold and trend 0%, cash ${view.heldRun.result.pcts.cash}%), the plan lasts ${view.heldRun.result.words}; on its own mix, ${view.own.words}.`);
    expect(one(root, `${T}.cost.ran`).textContent).toBe('Tried in 1 run (0.6 s).');
    expect(one(root, `${T}.cost.button`).textContent).toBe(MOVE.cost.again);
    expect(text).toContain('in a bad case (the worst 1 in 10)');
    const buy = all(root, `[data-testid="${T}.buy"] tbody tr`);
    expect(buy.map((tr) => tr.getAttribute('data-key'))).toEqual(['bucket:shares']);
    expect(buy[0].textContent).toContain('bring shares up to');
    const sell = all(root, `[data-testid="${T}.sell"] tbody tr`);
    expect(sell.map((tr) => tr.getAttribute('data-key'))).toEqual(['bucket:cash']);
    expect(sell[0].textContent).toContain('bring cash down to');
    expect(all(root, `[data-testid="${T}.held"] tbody tr`).map((tr) => tr.getAttribute('data-key'))).toEqual(['bucket:bonds']);
    expect(one(root, `${T}.keep`).textContent).toContain('HMWO (ISA, £25,040): ISA — kept as it is.');
    expect(one(root, `${T}.cash`), 'a pot plan has no cash years').toBe(null);
    const tick = one(root, `${T}.tick.bucket:cash`);
    tick.checked = true;
    tick.dispatchEvent(new Event('change', { bubbles: true }));
    expect(actions.find((a) => a.type === 'plan/tick')).toEqual({ type: 'plan/tick', planId: plan.id, key: 'bucket:cash', done: true });
    expect(one(root, `${T}.sheet`)).toBe(null);
    expect(one(root, `${T}.explained`)).toBe(null);
  });
  it('the run\'s working, failed and no-worker states, from the mix state by the reducer; the button asks the runner with the plan\'s key', () => {
    const s = load('move-mix');
    const key = s.move.key;
    const idle = draw(s, { type: A.MOVE_RUN, key: 'another' }, { type: A.MOVE_FAILED, key: 'another' }, { type: A.PLANS_SET, list: s.plans.list, source: 'account', readAt: '14:05' });
    expect(one(idle.root, `${T}.cost.result`), 'a result for another key is not shown').toBe(null);
    const fresh = draw(s, { type: A.MOVE_INDEX, index: s.move.index });
    one(fresh.root, `${T}.cost.button`).click();
    expect(fresh.actions.pop()).toEqual({ type: 'move/run', key });
    const working = draw(s, { type: A.MOVE_RUN, key });
    expect(one(working.root, `${T}.cost.working`).textContent).toBe(MOVE.cost.working);
    expect(one(working.root, `${T}.cost.button`)).toBe(null);
    const failed = draw(s, { type: A.MOVE_RUN, key }, { type: A.MOVE_FAILED, key });
    expect(one(failed.root, `${T}.cost.failed`).textContent).toBe(MOVE.cost.failed);
    const none = draw(s, { type: A.MOVE_RUN, key }, { type: A.MOVE_FAILED, key, reason: 'noWorker' });
    expect(one(none.root, `${T}.cost.failed`).textContent).toBe(MOVE.cost.noWorker);
  });
  it('done (04 as the fixture has it: the record already holds the mix): "Done — what you hold matches the plan’s mix.", no Buy or Sell, no totals, the run still offered', () => {
    const s = load('move-mix');
    const fixture = entryOf({ ...JSON.parse(JSON.stringify(C['04-buckets-running'])), id: planOf(s).id, planDetails: planOf(s).planDetails, isActive: false }, s.env.today).plan;
    const { root, text, words } = draw(s, (st) => ({ type: A.PLANS_SET, list: [{ plan: fixture, newer: false, failed: false }], source: st.plans.source, readAt: '14:04' }));
    expect(one(root, `${T}.status`).getAttribute('data-status')).toBe('done');
    expect(one(root, `${T}.status.line`).textContent).toBe(MOVE.status.done);
    expect(one(root, `${T}.buy`)).toBe(null);
    expect(one(root, `${T}.sell`)).toBe(null);
    expect(one(root, `${T}.totals`)).toBe(null);
    expect(all(root, `[data-testid="${T}.held"] tbody tr`).length).toBe(3);
    expect([MOVE.cost.button, MOVE.cost.again]).toContain(one(root, `${T}.cost.button`).textContent);
    checkWords(text, words);
  });
});

describe('the saver\'s rule, a plan not locked, nothing recorded, shown as saved, the toast', () => {
  it('the saver (05, from the record state): no lists and no schedule — "You stop work in about N years…", where new money goes, the plan\'s mix beside the held mix, when the move itself starts', () => {
    const s = load('hold-typed');
    const plan = planOf(s);
    const { root, text, words } = draw(s, { type: A.ROUTE_SET, route: parse('#/plan/' + plan.id + '/move') });
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.move');
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-waiting')).toBe('1');
    expect(one(root, `${T}.waiting.line`).textContent).toBe('You stop work in about 11 years. Until about five years before, the move is just where new money goes.');
    expect(one(root, `${T}.waiting.newMoney`).textContent).toBe('New money goes: £1,150 a month to shares, £300 a month to bonds — £1,450 a month in all.');
    expect(one(root, `${T}.waiting.planMix`).textContent).toMatch(/^The plan’s mix: shares \d+%, bonds \d+%, cash \d+%\.$/);
    expect(one(root, `${T}.waiting.heldMix`).textContent).toMatch(/^What you hold, in your pension: shares \d+%, bonds \d+%, gold and trend \d+%, cash \d+%\.$/);
    expect(one(root, `${T}.waiting.starts`).textContent).toBe('The move itself starts around February 2038.');
    expect(one(root, `${T}.buy`)).toBe(null);
    expect(one(root, `${T}.schedule`)).toBe(null);
    expect(one(root, `${T}.how`)).toBe(null);
    expect(one(root, `${T}.cost.button`), 'the one run is still offered').not.toBe(null);
    checkWords(text, words);
  });
  it('a plan not locked (12, from the paste state): "Set when the plan is locked…" with the link to the lock step, and nothing else drawn', () => {
    const s = load('hold-paste');
    const plan = planOf(s);
    const { root, text, words } = draw(s, { type: A.ROUTE_SET, route: parse('#/plan/' + plan.id + '/move') });
    expect(one(root, `${T}.notLocked`).textContent).toContain(MOVE.notLocked);
    expect(root.querySelector(`[data-testid="${T}.notLocked"] a`).getAttribute('href')).toBe('#/plan/' + plan.id + '/lock');
    expect(root.querySelector('[data-region="plan-move"]')).toBe(null);
    expect(one(root, `${T}.footer`)).not.toBe(null);
    checkWords(text, words);
  });
  it('nothing recorded on a locked pot plan: "Nothing recorded yet — record what you hold first", no run; the lists read as to buy', () => {
    const s = load('move-mix');
    const plan = planOf(s);
    const { root, text } = draw(s, replaced((p) => { delete p.holdings; return p; }));
    expect(one(root, `${T}.noRecord`).textContent).toContain('Nothing recorded yet — record what you hold first.');
    expect(root.querySelector(`[data-testid="${T}.noRecord"] a`).getAttribute('href')).toBe('#/plan/' + plan.id + '/hold');
    expect(one(root, `${T}.cost.nothing`)).not.toBe(null);
    expect(one(root, `${T}.cost.button`)).toBe(null);
    expect(all(root, `[data-testid="${T}.buy"] tbody tr`).length).toBe(3);
    expect(text).not.toMatch(/about £/);
  });
  it('shown as saved: the ticks disabled, no run; without an account: the warning, the ticks live; the toast after a tick with Undo, "Put back as it was."; the problems', () => {
    const s = load('move-mix');
    const plan = planOf(s);
    const readonly = draw(s, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => ({ ...e, newer: true })), source: 'account', readAt: '14:04' }));
    expect(one(readonly.root, `${T}.readonly`)).not.toBe(null);
    expect(all(readonly.root, 'input[type="checkbox"]').every((c) => c.disabled)).toBe(true);
    expect(one(readonly.root, `${T}.cost.button`)).toBe(null);
    const win = draw(s, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } }, { type: A.PLANS_SET, list: s.plans.list, source: 'window', readAt: '14:04' });
    expect(one(win.root, 'plan.windowWarning')).not.toBe(null);
    expect(all(win.root, 'input[type="checkbox"]').some((c) => !c.disabled)).toBe(true);
    const ticked = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { transition: undefined }, line: { id: 'ticked', slots: { label: 'Shares (world tracker)' } }, op: 'tick' });
    expect(one(ticked.root, `${T}.toast`).textContent).toContain('Saved. ‘Shares (world tracker)’ ticked as placed.');
    one(ticked.root, `${T}.undo`).click();
    expect(ticked.actions.pop()).toEqual({ type: 'plan/undo', planId: plan.id });
    const undone = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { transition: { done: {} } }, line: { id: 'unticked', slots: { label: 'X' } }, op: 'tick' }, { type: A.PLAN_UNDO, planId: plan.id }, { type: A.PLAN_UNDO_DONE, planId: plan.id });
    expect(one(undone.root, `${T}.toast`).textContent).toContain(MOVE.toast.undone);
    const problem = draw(s, { type: A.PLAN_SAVE_FAILED, planId: plan.id, problem: 'notLocked' });
    expect(one(problem.root, `${T}.problem`).textContent).toBe(MOVE.problems.notLocked);
    expect(one(problem.root, `${T}.hold`).getAttribute('href')).toBe('#/plan/' + plan.id + '/hold');
  });
});

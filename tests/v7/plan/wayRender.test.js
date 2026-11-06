/**
 * "How the money is taken" drawn from its named states (research/v7/way-and-mix.md 7): tests/v7/states/plan/way-*.json, written by
 * `node tests/v7/states/build-states.mjs --question plan` with the real nine-way run. Every state is held to the words'
 * rules (the banned list in every scope a plan page is shown in — a record screen: no "About £"), and to the screen's
 * contract: nine cards, the plan's own first, one open at a time, the other eight ranked; the open card's dials with their
 * words; "Open" on a closed card; "Use this way of drawing" on an open card of an unlocked plan and never on a locked one;
 * the locked plan's one comparison line; the cost said where the figures are; working, slow, failed, no-worker, a try that
 * failed, a dial with a problem, the confirm, the toast, "More columns" with its orders and the score's sentence; a plan
 * shown as saved is not run. The states carry the version they were made with, read from src/constants.js, never a literal.
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
import { WAY } from '../../../src/v7/copy/way.js';
import { WAY_IDS, WAY_DIALS } from '../../../src/answers/plan/schema.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('way-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner', 'result'];

function draw(stored) {
  const state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { state, root, actions, text: visibleText(root) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const cards = (root) => all(root, '[data-way].way-card');

describe('the named states of "How the money is taken"', () => {
  it('are the set the builder writes, made with this version at the engine\'s 1,000 futures, nothing hand-made', () => {
    expect(NAMES.length).toBeGreaterThanOrEqual(18);
    expect(MADE.version).toBe(VERSION);
    expect(MADE.futures).toBe(1000);
    expect(MADE.patched).toEqual([]);
    expect(MADE.run).toBe('src/answers/plan/waysRun.js');
  });
  it.each(NAMES)('%s survives JSON, carries this version and is drawn on #/plan/<id>/way', (name) => {
    const s = load(name);
    expect(s.env.appVersion).toBe(VERSION);
    expect(s.route).toMatchObject({ screen: 'plan', step: 'way' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const { root, state } = draw(s);
    expect(JSON.parse(JSON.stringify(state.ways))).toEqual(s.ways);
    expect(root.querySelector('[data-testid="plan.step.way"]').textContent).toBe(WAY.title);
  });
  it.each(NAMES)('%s: no banned word in any scope a plan page is shown in, no exact-figure hedge, no rubbish', (name) => {
    const { text } = draw(load(name));
    expect(bannedHits(text, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £|around £/i);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(text).not.toMatch(/\bstrategy\b|\ballocation\b|Monte Carlo|\bMC\b|\bp10\b|\bequit(y|ies)\b/);
  });
});

describe('the cards', () => {
  it('way-first: nine cards, the plan\'s own first and open with its dials at the plan\'s values, the other eight ranked and closed with "Open", the cost said', () => {
    const { root, text, actions } = draw(load('way-first'));
    const cs = cards(root);
    expect(cs.map((c) => c.getAttribute('data-way'))).toHaveLength(9);
    expect(new Set(cs.map((c) => c.getAttribute('data-way'))).size).toBe(9);
    expect(cs[0].getAttribute('data-way')).toBe('pots-and-valves');
    expect(cs[0].getAttribute('data-current')).toBe('1');
    expect(cs.filter((c) => c.getAttribute('data-open') === '1').map((c) => c.getAttribute('data-way'))).toEqual(['pots-and-valves']);
    // the other eight ranked: their ranks rise down the list, every one has "Open" and no dial
    const others = cs.slice(1);
    const ranks = others.map((c) => Number(c.getAttribute('data-rank')));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    for (const c of others) {
      expect(c.querySelector(`[data-testid="plan.way.open.${c.getAttribute('data-way')}"]`)).not.toBe(null);
      expect(c.querySelector('input')).toBe(null);
      expect(c.querySelector('[data-line="way.lasts"], [data-line="way.cannot"], [data-line="way.cannotGilt"]')).not.toBe(null);
    }
    // the plan's own card: its promise, its verdict word and bar, its cut dials at the plan's values (yes, 20%, 3 months)
    expect(cs[0].textContent).toContain(WAY.promise['pots-and-valves']);
    expect(cs[0].querySelector('[data-verdict]')).not.toBe(null);
    expect(cs[0].querySelector('[data-line="way.lastsYours"]').textContent).toMatch(/^Your plan lasts in /);
    expect(one(root, 'plan.way.pots-and-valves.protectionOn.yes').checked).toBe(true);
    expect(one(root, 'plan.way.pots-and-valves.cutPct').value).toBe('20');
    expect(one(root, 'plan.way.pots-and-valves.consecutiveLimit').value).toBe('3');
    expect(cs[0].querySelector('[data-line="way.mix"]').textContent).toBe(WAY.card.mix);
    expect(cs[0].querySelector(`[data-testid="plan.way.pots-and-valves.wrong"]`).textContent).toBe(WAY.wrong['pots-and-valves']);
    // the cost of the run, where the figures are; the bad case explained on the same screen
    expect(one(root, 'plan.way.ran').textContent).toBe('Ran the nine ways in 4.6 s.');
    expect(text).toContain('a bad case (the worst 1 in 10)');
    // the plan's own way untouched: no "Use this" (nothing to write); "Open" sends ways/open
    expect(one(root, 'plan.way.use.pots-and-valves')).toBe(null);
    one(root, 'plan.way.open.floor-to-age').click();
    expect(actions.pop()).toEqual({ type: 'ways/open', id: 'floor-to-age' });
    // the section titles
    expect(text).toContain(WAY.yours);
    expect(text).toContain(WAY.others);
  });
  it('way-open-ladder: the opened card shows its dials with their words, the cost line, what can go wrong, "Use this way of drawing"; the plan\'s own card is closed', () => {
    const { root, actions } = draw(load('way-open-ladder'));
    const cs = cards(root);
    expect(cs.filter((c) => c.getAttribute('data-open') === '1').map((c) => c.getAttribute('data-way'))).toEqual(['full-il-gilt']);
    expect(one(root, 'plan.way.open.pots-and-valves')).not.toBe(null);
    for (const d of WAY_DIALS['full-il-gilt']) {
      const el = root.querySelector(`[data-field="${d.key}"]`);
      expect(el, d.key).not.toBe(null);
      expect(el.textContent).toContain(WAY.dials.labels[d.key]);
    }
    expect(one(root, 'plan.way.full-il-gilt.cashYears').value).toBe('2');
    expect(one(root, 'plan.way.full-il-gilt.spareGrowth.kept').checked).toBe(true);
    const open = cs.find((c) => c.getAttribute('data-way') === 'full-il-gilt');
    expect(open.querySelector('[data-line="way.cost"], [data-line="way.costAll"]')).not.toBe(null);
    expect(open.querySelector('[data-line="way.bundled"]')).not.toBe(null);
    expect(open.textContent).toContain(WAY.card.wrongTitle);
    expect(one(root, 'plan.way.full-il-gilt.wrong').textContent).toBe(WAY.wrong['full-il-gilt']);
    one(root, 'plan.way.use.full-il-gilt').click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'wayConfirm' });
    // a dial typed sends ways/dial as typed
    const box = one(root, 'plan.way.full-il-gilt.cashYears');
    box.value = '3';
    box.dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'ways/dial', id: 'full-il-gilt', key: 'cashYears', value: '3' });
  });
  it('way-open-flex: every Floor & Flex dial, the ratchet with its note, "Buckets" words absent', () => {
    const { root } = draw(load('way-open-flex'));
    for (const d of WAY_DIALS['floor-and-flex']) expect(root.querySelector(`[data-field="${d.key}"]`), d.key).not.toBe(null);
    expect(one(root, 'plan.way.floor-and-flex.sleeveRatePct').value).toBe('4');
    expect(one(root, 'plan.way.floor-and-flex.ratchet.off').checked).toBe(true);
    expect(root.querySelector('[data-field="ratchet"]').textContent).toContain(WAY.dials.help.ratchet);
    expect(root.querySelector('[data-line="way.noTent"]')).toBe(null);
  });
  it('way-trying, way-tried, way-try-failed: the dial moved shows; "Trying it…", then "Tried in 1 run" with the tried figures, or the failure said', () => {
    const trying = draw(load('way-trying'));
    expect(one(trying.root, 'plan.way.floor-to-age.floorToAge').value).toBe('82');
    expect(one(trying.root, 'plan.way.floor-to-age.trying')).not.toBe(null);
    expect(one(trying.root, 'plan.way.floor-to-age.figures').getAttribute('data-stale')).toBe('1');
    expect(one(trying.root, 'plan.way.use.floor-to-age'), 'no "Use this" while the try is under way').toBe(null);
    const tried = draw(load('way-tried'));
    expect(one(tried.root, 'plan.way.floor-to-age.tried').textContent).toBe('Tried in 1 run (0.2 s).');
    expect(one(tried.root, 'plan.way.floor-to-age.figures').getAttribute('data-stale')).toBe('0');
    expect(one(tried.root, 'plan.way.use.floor-to-age')).not.toBe(null);
    // the tried figures are the try's, not the nine-way run's
    const s = load('way-tried');
    const t = s.ways.tried['floor-to-age'].result;
    expect(one(tried.root, 'plan.way.floor-to-age.figures').getAttribute('data-chance')).toBe(String(t.a.chancePct));
    const failed = draw(load('way-try-failed'));
    expect(one(failed.root, 'plan.way.floor-to-age.tryFailed').textContent).toBe(WAY.failed.one);
  });
  it('way-cuts-tried: a cut dial moved on the plan\'s own card tries it again, and "Use this" is offered', () => {
    const { root } = draw(load('way-cuts-tried'));
    expect(one(root, 'plan.way.pots-and-valves.cutPct').value).toBe('30');
    expect(one(root, 'plan.way.pots-and-valves.tried')).not.toBe(null);
    expect(one(root, 'plan.way.use.pots-and-valves')).not.toBe(null);
  });
  it('way-dial-problem: the problem said beside the dial, no try, no "Use this"', () => {
    const { root } = draw(load('way-dial-problem'));
    expect(root.querySelector('[data-error-for="plan.way.floor-to-age.floorToAge"]').textContent).toBe(WAY.dials.errors.notANumber);
    expect(one(root, 'plan.way.floor-to-age.floorToAge').getAttribute('aria-invalid')).toBe('true');
    expect(one(root, 'plan.way.use.floor-to-age')).toBe(null);
    expect(one(root, 'plan.way.floor-to-age.trying')).toBe(null);
  });
  it('way-confirm: the confirm on the same screen with the design\'s words; "Use it" sends plan/useWay, "Not now" closes it', () => {
    const { root, actions } = draw(load('way-confirm'));
    const box = one(root, 'plan.way.confirmBox');
    expect(box).not.toBe(null);
    expect(box.textContent).toContain('Your plan will be drawn as Floor to an age, then decide. Its dials as shown are kept with it; Pots & Valves’s own settings are put away and come back if you return to it. The pots, the income and the mix do not change.');
    expect(one(root, 'plan.way.use.floor-to-age')).toBe(null);
    one(root, 'plan.way.confirm').click();
    expect(actions.pop()).toEqual({ type: 'plan/useWay', planId: 'AlexWay01', id: 'floor-to-age' });
    one(root, 'plan.way.notNow').click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'wayConfirm' });
  });
  it('way-more: the table with the planner\'s other columns in V7\'s names, the order chosen, the score\'s sentence; the cards\' order is still by futures out of 10', () => {
    const { root, text, actions } = draw(load('way-more'));
    const table = one(root, 'plan.way.table');
    expect(table).not.toBe(null);
    const heads = all(table, 'thead th').map((th) => th.textContent);
    for (const k of ['worst12', 'covered', 'coverage', 'spent', 'bumpiness', 'score']) expect(heads).toContain(WAY.table.columns[k]);
    expect(all(table, 'tbody tr')).toHaveLength(9);
    expect(one(root, 'plan.way.rankBy.left').checked).toBe(true);
    expect(one(root, 'plan.way.score').textContent).toBe(WAY.table.score);
    expect(one(root, 'plan.way.more').textContent).toBe(WAY.buttons.fewer);
    // "Rank by" what is left: the table's first row is the way with the most typically left
    const s = load('way-more');
    const rows = all(table, 'tbody tr').map((tr) => tr.getAttribute('data-way'));
    const best = [...s.ways.result.ways].filter((w) => w.affordable).sort((a, b) => b.terminal.p50 - a.terminal.p50)[0].id;
    expect(rows[0]).toBe(best);
    one(root, 'plan.way.rankBy.score').click();
    expect(actions.pop()).toEqual({ type: 'ways/rankBy', by: 'score' });
    expect(text).toContain(WAY.table.lead);
  });
  it('way-saved: the toast after a switch, with Undo (a stored state carries no toast — state/replace drops it — so the save is reduced here)', () => {
    const stored = load('way-saved');
    const base = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
    const state = reduce(base, { type: A.PLAN_SAVED, planId: 'AlexWay01', previous: { 'stressTool.settings.strategyId': 'pots-and-valves' }, line: { id: 'way', slots: { way: 'floor-to-age' } }, op: 'way' });
    const root = document.createElement('div');
    root.id = 'app';
    const actions = [];
    render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
    expect(state.lasts.key, 'the one test\'s result goes with the way').toBe(null);
    const toast = one(root, 'plan.way.toast');
    expect(toast).not.toBe(null);
    expect(toast.textContent).toContain('Saved. The plan is now drawn as Floor to an age, then decide.');
    one(root, 'plan.way.undo').click();
    expect(actions.pop()).toEqual({ type: 'plan/undo', planId: 'AlexWay01' });
  });
  it('way-working, way-slow, way-failed, way-no-worker: the working block with the progress, the slow sentence, "Try again", the planner offered without a worker', () => {
    const working = draw(load('way-working'));
    expect(one(working.root, 'plan.way.working')).not.toBe(null);
    expect(working.root.querySelector('progress').getAttribute('value')).toBe('3');
    expect(cards(working.root)).toHaveLength(9);
    expect(working.root.querySelector('[data-way] input')).toBe(null);
    expect(one(working.root, 'plan.way.ran')).toBe(null);
    expect(draw(load('way-slow')).text).toContain(WAY.working.slow);
    const failed = draw(load('way-failed'));
    expect(one(failed.root, 'plan.way.failed')).not.toBe(null);
    one(failed.root, 'plan.way.retry').click();
    expect(failed.actions.pop()).toEqual({ type: 'ways/retry' });
    const none = draw(load('way-no-worker'));
    expect(one(none.root, 'plan.way.noWorker').textContent).toContain(WAY.failed.noWorker);
    expect(one(none.root, 'plan.way.noWorkerPlanner')).not.toBe(null);
  });
  it('way-locked and way-locked-tried: every card runs, no "Use this" anywhere, the dials still movable, ONE comparison line once another way is tried, never a word of unlocking on the cards', () => {
    const locked = draw(load('way-locked'));
    expect(one(locked.root, 'plan.way.locked').textContent).toContain(WAY.locked.lead);
    expect(cards(locked.root)).toHaveLength(9);
    expect(cards(locked.root)[0].getAttribute('data-way')).toBe('full-il-gilt');
    expect(locked.root.querySelector('[data-testid^="plan.way.use."]')).toBe(null);
    expect(one(locked.root, 'plan.way.compare')).toBe(null);
    const tried = draw(load('way-locked-tried'));
    expect(tried.root.querySelector('[data-testid^="plan.way.use."]')).toBe(null);
    const compare = one(tried.root, 'plan.way.compare');
    expect(compare).not.toBe(null);
    expect(compare.textContent).toMatch(/^Your plan as locked lasts in .* on Full index-linked gilt ladder; Floor to an age, then decide would have lasted in /);
    expect(all(tried.root, '[data-testid="plan.way.compare"]')).toHaveLength(1);
    expect(one(tried.root, 'plan.way.floor-to-age.floorToAge').value).toBe('82');
    for (const c of cards(tried.root)) expect(c.textContent).not.toMatch(/unlock/i);
  });
  it('way-unaffordable: a way the pot cannot buy says so with the figures and sits last; its card has no verdict bar; the table says "cannot be bought"', () => {
    const { root } = draw(load('way-unaffordable'));
    const cs = cards(root);
    const cannot = cs.filter((c) => c.querySelector('[data-line="way.cannot"], [data-line="way.cannotGilt"]'));
    expect(cannot.length).toBeGreaterThan(0);
    expect(cs.slice(cs.length - cannot.length).every((c) => cannot.includes(c)), 'the ways that cannot be bought are last').toBe(true);
    for (const c of cannot) expect(c.querySelector('[data-verdict]')).toBe(null);
    const open = cs.find((c) => c.getAttribute('data-way') === 'full-il-gilt');
    expect(open.getAttribute('data-open')).toBe('1');
    expect(open.querySelector('[data-line="way.cannot"]').textContent).toMatch(/^Your pot cannot buy this: it would cost £[\d,]+, £[\d,]+ more than the pot\./);
    expect(one(root, 'plan.way.table').textContent).toContain(WAY.table.cannot);
  });
  it('way-shown-as-saved: a plan newer than this code is not run; nothing to open', () => {
    const { root } = draw(load('way-shown-as-saved'));
    expect(one(root, 'plan.way.notRun').textContent).toBe(WAY.notRun);
    expect(one(root, 'plan.readonly')).not.toBe(null);
    expect(root.querySelector('[data-testid^="plan.way.use."]')).toBe(null);
    expect(one(root, 'plan.way.working')).toBe(null);
  });
  it('the nine names on the cards are the planner\'s, every way once', () => {
    const { root } = draw(load('way-first'));
    expect(cards(root).map((c) => c.querySelector('.way-name').textContent).sort()).toEqual(WAY_IDS.map((id) => WAY.names[id]).sort());
  });
});

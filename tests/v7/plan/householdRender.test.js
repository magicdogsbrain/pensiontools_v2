/**
 * "Your household" drawn from its named states (research/v7/road-to-7.md step 9): tests/v7/states/plan/household-*.json,
 * written by `node tests/v7/states/build-states.mjs --question plan` with the real runs (the couple fixtures as Alex's and
 * Sam's plans). Every state is held to the words' rules (the banned list in every scope a plan page is shown in; never
 * "about £"; never the planner's words — survivor spends, DB, years from now, today's money) and to the screen's contract:
 * the partner's plan with its line, Open and Unlink; "Check the two plans together" and the pooled verdict first with each
 * plan alone under it; "Who draws what" in exact pounds with its baseline (the couple's take-home, both ways), its table, what
 * the smaller pension's figure is made of, the fast split's line, the need box and the limit (household-draw-split.md 9) and
 * "Use this split" (copies when a plan is locked, with the note); the survivor and care questions in ages with their results; one budget for the household with
 * "Keeping money separate?"; the budget's who-pays block; a plan with no link and the other plans to choose; the working,
 * failed, confirm and single-question states made here from the pinned ones. The states carry the version they were made
 * with, read from src/constants.js, never a literal.
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
import { HOUSEHOLD } from '../../../src/v7/copy/household.js';
import { HOUSEHOLD_FIELDS } from '../../../src/answers/plan/schema.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { pounds } from '../../../src/answers/plan/income.js';
import { fill } from '../../../src/v7/components/index.js';
import { splitFingerprint } from '../../../src/services/HouseholdDraw.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('household-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner', 'result', 'household'];   // the household's own scope over the whole page (9.1: whose money is never the point)
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;

function draw(stored) {
  const state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  return drawState(state);
}
function drawState(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { state, root, actions, text: visibleText(root), words: wordsOf(root) };
}
/** The screen's words less the plans' names (a name is the person's own text, never checked). */
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
/** A pinned state taken further by the reducer, the reading refreshed as the plan source does. */
function further(stored, ...actions) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  for (const a of actions) { state = reduce(state, typeof a === 'function' ? a(state) : a); state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) }); }
  return drawState(state);
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const T = 'plan.household';

describe('the named states of "Your household"', () => {
  it('are the set the builder writes, made with this version at the engine\'s 1,000 futures with the household run, nothing hand-made; each holds a pair', () => {
    expect(NAMES).toEqual(['household-first', 'household-locked', 'household-questions', 'household-ran', 'household-split', 'household-unlinked', 'household-who-pays']);
    expect(MADE.version).toBe(VERSION);
    expect(MADE.futures).toBe(1000);
    expect(MADE.patched).toEqual([]);
    expect(MADE.runs).toContain('src/answers/plan/householdRun.js');
    for (const name of NAMES) expect(load(name).plans.list, name).toHaveLength(2);
  });
  it.each(NAMES)('%s survives JSON, carries this version and is drawn on #/plan/<id>/household as its own screen', (name) => {
    const s = load(name);
    expect(s.env.appVersion).toBe(VERSION);
    expect(s.route).toMatchObject({ screen: 'plan', step: 'household' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const { root, state } = draw(s);
    expect(JSON.parse(JSON.stringify(state.household))).toEqual(s.household);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.household');
    expect(one(root, 'plan.step.household').textContent).toBe(HOUSEHOLD.title);
    // the rail: the household step is the current one, a link per listed step
    expect(root.querySelectorAll('[data-region="rail"] [aria-current="step"]').length).toBe(1);
    expect(root.querySelector('[data-testid="rail.plan.household"]').getAttribute('aria-current')).toBe('step');
  });
  it.each(NAMES)('%s: no banned word in any scope a plan page is shown in, no "about £", no countdown, no rubbish, never the planner\'s words', (name) => {
    const { text, words } = draw(load(name));
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £|around £/i);
    expect(COUNTDOWN.test(words)).toBe(false);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\bstrategy\b|\bscenario\b|Monte Carlo|\bMC\b|\bp10\b|\bDB\b|years from now|today's money|survivor spends|\bmedian\b/i);
  });
});

describe('the partner\'s plan (6) and the link', () => {
  it('household-first: Sam\'s plan with its line, linked each way, Open and Unlink; "Check the two plans together" with nothing run; the questions\' boxes at the planner\'s defaults said as ages; no figure yet', () => {
    const { root, text, actions } = draw(load('household-first'));
    expect(one(root, `${T}.with`).textContent).toBe('With ‘Sam’s plan’: stopping work within five years.');
    expect(one(root, `${T}.linkedBy`).textContent).toBe(HOUSEHOLD.partner.linkedBoth);
    expect(one(root, `${T}.openPartner`).getAttribute('href')).toBe('#/plan/SamCouple07');
    expect(one(root, `${T}.unlink`)).not.toBe(null);
    expect(one(root, `${T}.check`).textContent).toBe(HOUSEHOLD.verdict.button);
    expect(one(root, `${T}.result`)).toBe(null);
    expect(one(root, `${T}.split`)).toBe(null);
    // the boxes: who (Alex's plan / Sam's plan), the ages from the planner's "years from now" (10 and 15 on from today's age), 70%, 50%, 3 years, £90,000
    expect(one(root, 'plan.household.survivor.who.a')).not.toBe(null);
    expect(root.querySelector('label[for="plan.household.survivor.who.a"]').textContent).toBe('Alex’s plan');
    expect(one(root, 'plan.household.survivor.who.a').checked).toBe(true);
    expect(one(root, 'plan.household.survivor.atAge').value).toBe('74');
    expect(one(root, 'plan.household.survivor.spendPct').value).toBe('70');
    expect(one(root, 'plan.household.survivor.dbPct').value).toBe('50');
    expect(one(root, 'plan.household.care.fromAge').value).toBe('79');
    expect(one(root, 'plan.household.care.years').value).toBe('3');
    expect(one(root, 'plan.household.care.cost').value).toBe('90000');
    expect(one(root, `${T}.survivor.button`).textContent).toBe(HOUSEHOLD.survivor.button);
    expect(one(root, `${T}.care.button`).textContent).toBe(HOUSEHOLD.care.button);
    // one budget for the household: each has its own; the offer to share; the who-pays block closed
    expect(one(root, `${T}.budget.line`).textContent).toBe(HOUSEHOLD.budget.none);
    expect(one(root, `${T}.budget.share`).textContent).toBe('Share this plan’s budget with ‘Sam’s plan’');
    expect(one(root, `${T}.whoPays.open`).textContent).toBe(HOUSEHOLD.whoPays.open);
    expect(one(root, 'plan.household.budget.shared.yes')).toBe(null);
    expect(one(root, `${T}.budget.question`).textContent).toBe(HOUSEHOLD.budget.separateQuestion);
    // the check asks the runner, with no limit chosen (the default, household-draw-split.md 9.2) and no need typed
    one(root, `${T}.check`).click();
    expect(actions.pop()).toMatchObject({ type: 'household/run', limit: null, need: null });
    // no figure of the household's yet: the only pounds on the page are the care guide's words and the rail's own lines
    expect(one(root, `${T}.ran`)).toBe(null);
    expect(root.querySelector('[data-section="verdict"] .figure')).toBe(null);
    // Unlink asks first, on the screen
    const unlink = further(load('household-first'), { type: A.HH_PICK, what: 'unlink' });
    expect(one(unlink.root, `${T}.unlinkConfirm`)).not.toBe(null);
    one(unlink.root, `${T}.unlinkConfirm.yes`).click();
    expect(unlink.actions.pop()).toEqual({ type: 'plan/linkPartner', planId: 'AlexCouple06', partnerId: null });
  });
  it('household-unlinked: no partner linked; the other plan here to choose, chosen, "Link ‘…’" sends the link; nothing else is drawn', () => {
    const { root, text, actions } = draw(load('household-unlinked'));
    expect(one(root, `${T}.none`).textContent).toBe(HOUSEHOLD.partner.none);
    expect(one(root, `${T}.link.choice`).value).toBe('AlexOther09');
    expect(one(root, `${T}.link`).textContent).toBe('Link ‘Alex’s other plan’');
    one(root, `${T}.link`).click();
    expect(actions.pop()).toEqual({ type: 'plan/linkPartner', planId: 'AlexAlone08', partnerId: 'AlexOther09' });
    expect(one(root, `${T}.check`)).toBe(null);
    expect(one(root, `${T}.survivor`)).toBe(null);
    expect(one(root, `${T}.budget`)).toBe(null);
    expect(visibleText(root.querySelector('[data-region="plan-household"]'))).not.toMatch(/£\d/);
  });
});

describe('the pooled verdict first (2.10), each plan alone second', () => {
  it('household-ran: on course together, the household\'s words, when one pays for the other, the four rows, the ways, "Tried in 2 runs (s)"; the years open with the two tables; the split does not apply on these pots', () => {
    const s = load('household-ran');
    const { root, text } = draw(s);
    const r = s.household.result;
    const share = r.own.combined.pooled.success;
    expect(one(root, `${T}.result`).getAttribute('data-head')).toBe(share >= 0.9 ? 'yes' : share >= 0.7 ? 'close' : 'no');
    expect(one(root, `${T}.headline`).textContent).toMatch(/^(On course together|Not on course yet, together|At risk, together): The household’s money lasts in .* futures out of 10\.$/);
    expect(one(root, `${T}.pooled`).textContent).toBe(HOUSEHOLD.verdict.pooled);
    expect(all(root, `[data-testid="${T}.rows"] tr`).map((tr) => tr.getAttribute('data-row'))).toEqual(['household', 'a', 'b', 'both']);
    expect(root.querySelector(`[data-testid="${T}.rows"] tr[data-row="a"] th`).textContent).toBe('Alex’s plan’s plan on its own');
    expect(root.querySelector(`[data-testid="${T}.rows"] tr[data-row="a"]`).getAttribute('data-pct')).toBe(String(Math.round((1 - r.own.rA.ruin.mc / 100) * 100)));
    expect(text).toContain('Pots & Valves for Alex’s plan, Pots & Valves for Sam’s plan');
    expect(one(root, `${T}.ran`).textContent).toBe('Tried in 2 runs (1.4 s).');
    expect(one(root, `${T}.check`).textContent).toBe(HOUSEHOLD.verdict.again);
    // the years: the two tables, every fifth year, at today's prices
    expect(one(root, `${T}.detail`).textContent).toBe(HOUSEHOLD.detail.close);
    expect(all(root, `[data-testid="${T}.timeline"] tbody tr`).length).toBeGreaterThan(3);
    expect(all(root, `[data-testid="${T}.left"] tbody tr`).length).toBe(Math.ceil(r.own.combined.potFan.length / 5));
    const first = r.own.combined.potFan[0];
    expect(root.querySelector(`[data-testid="${T}.left"] tbody tr`).textContent).toContain(pounds(first.p50));
    // who draws what does not apply here
    expect(one(root, `${T}.split`).getAttribute('data-applies')).toBe('0');
    expect(one(root, `${T}.split.none`).textContent).toBe(s.household.result.split.unchanged ? HOUSEHOLD.split.unchanged : HOUSEHOLD.split.none);
    expect(one(root, `${T}.use`)).toBe(null);
    expect(one(root, 'plan.household.limit.kind.none')).not.toBe(null);
    // no baseline line when the split does not apply (it could be a year only one plan draws, and "the only question" is moot); no fast line when the fast count saves nothing
    expect(one(root, `${T}.split.baseline`)).toBe(null);
    expect(one(root, `${T}.split.fast`)).toBe(null);
    expect(one(root, `${T}.split`).getAttribute('data-limit-kind')).toBe('untilAge');
  });
  it('household-ran with a fast split that would save (the paced count moved nothing, household-draw-split.md 9.2): the section says keeping the pension leaves nothing to move, and the fast split\'s line and button stand in place of the comparison', () => {
    const s = load('household-ran');
    const fast = JSON.parse(JSON.stringify(s));
    const split = fast.household.result.split;
    split.fast = { saving: { year: split.saving.year + 10769, until: -119743, whole: -140000 }, goneAt: 60 };
    const { root, actions } = further(fast, { type: A.UI_RAIL, open: false });
    expect(one(root, `${T}.split`).getAttribute('data-applies')).toBe('0');
    expect(one(root, `${T}.split.none`).textContent).toBe(fill(HOUSEHOLD.split.unchangedKept, { small: 'Sam’s plan' }));
    expect(root.querySelector(`[data-testid="${T}.split.fast"] p`).textContent).toBe(`Draw Sam’s plan’s pension faster: saves another £10,769 a year in tax at first, but ${pounds(119743 + split.saving.until)} less by the time Sam’s plan is 67; Sam’s plan’s pension gone at about 60.`);
    one(root, `${T}.fast`).click();
    expect(actions.pop()).toMatchObject({ type: 'household/run', key: s.household.key, limit: { kind: 'none' }, need: null });
    expect(one(root, 'plan.household.limit.kind.fast')).not.toBe(null);
    expect(bannedHits(visibleText(root.querySelector('[data-section="split"]')), ['household'])).toEqual([]);
    // the paced count moved a little (under £1,000): "little to move", the fast line still there
    const little = JSON.parse(JSON.stringify(fast));
    little.household.result.split.unchanged = false;
    expect(one(further(little, { type: A.UI_RAIL, open: false }).root, `${T}.split.none`).textContent).toBe(fill(HOUSEHOLD.split.noneKept, { small: 'Sam’s plan' }));
  });
  it('the working, failed and no-worker states, made from the first by the reducer; a stale limit says "Check again with this limit"', () => {
    const base = load('household-first');
    const key = viewFor(reduce(initialState({ today: base.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: base })).page.household.runKey;
    const working = further(base, { type: A.HH_RUN, key, limit: null }, { type: A.HH_PROGRESS, key, done: 1, total: 2 });
    expect(one(working.root, `${T}.working`)).not.toBe(null);
    expect(working.root.querySelector(`[data-testid="${T}.working"] progress`).getAttribute('value')).toBe('1');
    expect(one(working.root, `${T}.check`)).toBe(null);
    const failed = further(base, { type: A.HH_RUN, key, limit: null }, { type: A.HH_FAILED, key, limit: null });
    expect(one(failed.root, `${T}.failed`).textContent).toBe(HOUSEHOLD.verdict.failed);
    expect(one(failed.root, `${T}.check`).textContent).toBe(HOUSEHOLD.verdict.again);
    const none = further(base, { type: A.HH_RUN, key, limit: null }, { type: A.HH_FAILED, key, limit: null, reason: 'noWorker' });
    expect(one(none.root, `${T}.failed`).textContent).toBe(HOUSEHOLD.verdict.noWorker);
    const ran = load('household-ran');
    const stale = further(ran, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'limit.kind', value: 'untilAge' });
    expect(one(stale.root, `${T}.stale`).textContent).toBe(HOUSEHOLD.verdict.stale);
    expect(one(stale.root, `${T}.rerun`).textContent).toBe(HOUSEHOLD.verdict.rerun);
    one(stale.root, `${T}.rerun`).click();
    expect(stale.actions.pop()).toMatchObject({ type: 'household/run', limit: { kind: 'untilAge', who: 'b', age: 67 }, need: null });
    // the need box (household-draw-split.md 9.3): a sum typed makes the result stale and goes with the next check; "Draw it faster" is a limit of its own
    const typed = further(ran, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'need.amount', value: '40,000' });
    expect(one(typed.root, 'plan.household.need.amount').value).toBe('40,000');
    expect(typed.root.querySelector('label[for="plan.household.need.amount"]').textContent).toBe(HOUSEHOLD.fields['need.amount'].label);
    expect(typed.root.querySelector('[id="plan.household.need.amount.help"]').textContent).toBe(HOUSEHOLD.fields['need.amount'].help);
    expect(one(typed.root, `${T}.stale`)).not.toBe(null);
    one(typed.root, `${T}.rerun`).click();
    expect(typed.actions.pop()).toMatchObject({ type: 'household/run', limit: null, need: 40000 });
    const fast = further(ran, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'limit.kind', value: 'fast' });
    expect(one(fast.root, 'plan.household.limit.kind.fast').checked).toBe(true);
    one(fast.root, `${T}.rerun`).click();
    expect(fast.actions.pop()).toMatchObject({ type: 'household/run', limit: { kind: 'none' }, need: null });
    expect(fast.root.querySelector('label[for="plan.household.limit.kind.none"]').textContent).toBe('Keep it until the State Pension starts (the usual)');
    expect(fast.root.querySelector('label[for="plan.household.limit.kind.fast"]').textContent).toBe('Draw it faster: no limit');
    const wrong = further(ran, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'need.amount', value: 'lots' }, { type: A.PLAN_TOUCH, planId: 'AlexCouple06', path: 'need.amount' });
    expect(wrong.root.querySelector('[data-error-for="plan.household.need.amount"]').textContent).toBe(HOUSEHOLD.errors['need.amount'].notANumber);
  });
});

describe('who draws what (household-draw-split.md 4), in exact pounds', () => {
  it('household-split: the baseline, the headline, the why, the cost, the two-column table ("As the two plans are written" / "Paid as a couple, tax first"), what the smaller pension\'s figure is made of, the closing with the choice, what each would draw, the need box and the limit, "Use this split" and "Keep things as they are"; the confirm lists each plan\'s shape; never whose money (banned.js scope household)', () => {
    const s = load('household-split');
    const { root, text, actions } = draw(s);
    const split = s.household.result.split;
    expect(one(root, `${T}.split`).getAttribute('data-applies')).toBe('1');
    expect(one(root, `${T}.split`).getAttribute('data-mode')).toBe('write');
    expect(one(root, `${T}.split`).getAttribute('data-limit-kind')).toBe('untilAge');
    expect(split.limitDefaulted).toBe(true);
    expect(one(root, `${T}.split.baseline`).textContent).toBe(`Between you, after tax: ${pounds(split.baseline.net)} a year, both ways. The only question is which pension pays how much of it.`);
    expect(one(root, `${T}.split.headline`).textContent).toBe(`Drawing together saves ${pounds(split.saving.year)} a year in tax — ${pounds(split.saving.until)} by the time Sam’s plan is ${split.untilAge}.`);
    expect(one(root, `${T}.split.why`).textContent).toContain(`The two pensions are unequal (${pounds(split.pots.a)} and ${pounds(split.pots.b)}). As the two plans are written, Alex’s plan’s pension pays 40% tax on`);
    expect(one(root, `${T}.split.cost`).textContent).toMatch(/^The cost: Sam’s plan’s pension is spent/);
    expect(all(root, `[data-testid="${T}.split.table"] thead th`).map((th) => th.textContent)).toEqual(['', 'As the two plans are written', 'Paid as a couple, tax first']);
    expect(split.madeOf.moved).toBeGreaterThan(0);
    expect(split.madeOf.own).toBeGreaterThan(0);
    expect(split.madeOf.stops).toBeGreaterThan(split.madeOf.moved);   // fewer pounds move in than out: Sam's are taxed less
    expect(one(root, `${T}.split.madeOf`).textContent).toBe(`Sam’s plan’s pension pays ${pounds(split.madeOf.pays)} a year: the ${pounds(split.madeOf.own)} its plan pays plus ${pounds(split.madeOf.moved)} more. Alex’s plan’s pension pays ${pounds(split.madeOf.stops)} a year less than its plan is written to.`);
    // a smaller plan drawing nothing of its own: "none of it as its plan is written", never "the £0 its plan pays"
    const none = JSON.parse(JSON.stringify(s));
    none.household.result.split.madeOf = { ...split.madeOf, own: 0, moved: split.madeOf.pays };
    expect(one(further(none, { type: A.UI_RAIL, open: false }).root, `${T}.split.madeOf`).textContent).toBe(`Sam’s plan’s pension pays ${pounds(split.madeOf.pays)} a year, none of it as its plan is written. Alex’s plan’s pension pays ${pounds(split.madeOf.stops)} a year less than its plan is written to.`);
    expect(one(root, 'plan.household.need.amount')).not.toBe(null);
    expect(one(root, 'plan.household.limit.kind.none').checked).toBe(true);
    expect(one(root, 'plan.household.limit.kind.fast')).not.toBe(null);
    // the fast split's line shows only when it saves at least a pound a year more than the default (on this pair the cap does not bind)
    expect(split.fast.saving.year - split.saving.year).toBeLessThan(1);
    expect(one(root, `${T}.split.fast`)).toBe(null);
    const region = root.querySelector('[data-section="split"]');
    expect(bannedHits(visibleText(region), ['household'])).toEqual([]);
    expect(visibleText(region)).not.toMatch(/Each for their own|Drawing together\s*$/m);
    expect(all(root, `[data-testid="${T}.split.table"] tbody tr`).map((tr) => tr.getAttribute('data-row'))).toEqual(['taxYear', 'taxUntil', 'potA', 'potB', 'lasts', 'left']);
    expect(root.querySelector(`[data-testid="${T}.split.table"] tr[data-row="taxYear"]`).textContent).toContain(pounds(split.tax.firstYear.own));
    expect(root.querySelector(`[data-testid="${T}.split.table"] tr[data-row="lasts"]`).textContent).toMatch(/futures out of 10/);
    expect(one(root, `${T}.split.closing`).textContent).toContain(HOUSEHOLD.split.choice);
    expect(root.querySelector('[data-line="split.a"]').textContent).toBe('Alex’s plan: ' + split.steps.a.map((x) => `${pounds(x.amount)} a year before tax from ${x.fromAge}`).join(', ') + '.');
    expect(one(root, `${T}.use`).textContent).toBe(HOUSEHOLD.split.use);
    expect(one(root, `${T}.keepAsIs`).textContent).toBe(HOUSEHOLD.split.keep);
    expect(one(root, `${T}.split.lockedNote`)).toBe(null);
    expect(text).not.toMatch(/about £/);
    one(root, `${T}.keepAsIs`).click();
    expect(actions.pop()).toEqual({ type: 'plan/keepAsIs', planId: 'AlexCouple06', dismiss: true });
    one(root, `${T}.use`).click();
    expect(actions.pop()).toEqual({ type: 'household/pick', what: 'split' });
    const confirm = further(s, { type: A.HH_PICK, what: 'split' });
    expect(one(confirm.root, `${T}.useConfirm`)).not.toBe(null);
    expect(confirm.text).toContain(HOUSEHOLD.split.confirm.write);
    expect(all(confirm.root, `[data-testid="${T}.useConfirm"] li`).length).toBe(2);
    expect(all(confirm.root, `[data-testid="${T}.useConfirm"] li`)[0].textContent).toMatch(/^Alex’s plan: £[\d,]+ a year → £[\d,]+ a year from \d+/);
    one(confirm.root, `${T}.useConfirm.yes`).click();
    expect(confirm.actions.pop()).toEqual({ type: 'plan/useSplit', planId: 'AlexCouple06' });
    expect(one(confirm.root, `${T}.use`)).toBe(null);
  });
  it('the fast split\'s line (household-draw-split.md 9.2), from the count alone: "Draw Sam’s plan’s pension faster: saves another … a year in tax at first, but … less by the time …; … gone at about …" with its button, which sets the limit to no limit and checks the two plans again; a typed need says so in the baseline', () => {
    const s = load('household-split');
    const faster = JSON.parse(JSON.stringify(s));
    const until = faster.household.result.split.saving.until;
    faster.household.result.split.fast = { saving: { year: faster.household.result.split.saving.year + 2131, until: 0, whole: 0 }, goneAt: 60 };
    const { root, actions } = further(faster, { type: A.UI_RAIL, open: false });   // the reading refreshed over the patched result
    // what it does by the State Pension age is said too (9.5: the years after the pension is empty are what make "saves more" honest)
    expect(root.querySelector(`[data-testid="${T}.split.fast"] p`).textContent).toBe(`Draw Sam’s plan’s pension faster: saves another £2,131 a year in tax at first, but ${pounds(Math.abs(Math.round(0 - until)))} less by the time Sam’s plan is 67; Sam’s plan’s pension gone at about 60.`);
    one(root, `${T}.fast`).click();
    const run = actions.pop(), edit = actions.pop();
    expect(edit).toEqual({ type: 'plan/edit', planId: 'AlexCouple06', path: 'limit.kind', value: 'fast' });
    expect(run).toMatchObject({ type: 'household/run', key: s.household.key, limit: { kind: 'none' }, need: null });
    const noAge = JSON.parse(JSON.stringify(faster));
    noAge.household.result.split.fast.goneAt = null;
    noAge.household.result.split.fast.saving.until = until + 5000;
    expect(further(noAge, { type: A.UI_RAIL, open: false }).root.querySelector(`[data-testid="${T}.split.fast"] p`).textContent).toBe('Draw Sam’s plan’s pension faster: saves another £2,131 a year in tax at first, and £5,000 more by the time Sam’s plan is 67.');
    const same = JSON.parse(JSON.stringify(faster));
    same.household.result.split.fast.saving.until = until;
    expect(further(same, { type: A.UI_RAIL, open: false }).root.querySelector(`[data-testid="${T}.split.fast"] p`).textContent).toBe('Draw Sam’s plan’s pension faster: saves another £2,131 a year in tax at first, and the same by the time Sam’s plan is 67; Sam’s plan’s pension gone at about 60.');
    // the fast split chosen: no line (there is nothing faster), the section says which limit applied
    const chosen = JSON.parse(JSON.stringify(s));
    chosen.household.limit = { kind: 'none' };
    chosen.household.result.split.limit = { kind: 'none' }; chosen.household.result.split.limitDefaulted = false; chosen.household.result.split.fast = null;
    const c = further(chosen, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'limit.kind', value: 'fast' });
    expect(one(c.root, `${T}.split.fast`)).toBe(null);
    expect(one(c.root, `${T}.split`).getAttribute('data-limit-kind')).toBe('none');
    expect(one(c.root, `${T}.stale`)).toBe(null);
    // a need typed and run: the baseline says what was typed and what the two plans as written pay
    const typed = JSON.parse(JSON.stringify(s));
    typed.household.need = 40000;
    typed.household.result.split.baseline = { ...typed.household.result.split.baseline, net: 40000, typed: 40000 };
    typed.household.result.split.need = 40000;
    const t = further(typed, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'need.amount', value: '40000' });
    expect(one(t.root, `${T}.split.baseline`).textContent).toBe(`Between you, after tax: £40,000 a year (you typed it; the two plans as written pay ${pounds(s.household.result.split.baseline.written)}).`);
    expect(one(t.root, `${T}.stale`)).toBe(null);
  });
  it('household-locked: Sam\'s plan locked — "Make copies of both plans with this split", the note that a locked plan is never changed, the confirm for copies; dismissed and kept states from the split by the reducer', () => {
    const s = load('household-locked');
    const { root, text } = draw(s);
    expect(one(root, `${T}.linkedBy`).textContent).toContain('‘Sam’s plan’ is locked too.');
    expect(one(root, `${T}.split`).getAttribute('data-mode')).toBe('copies');
    expect(one(root, `${T}.use`).textContent).toBe(HOUSEHOLD.split.useCopies);
    expect(one(root, `${T}.split.lockedNote`).textContent).toBe('Sam’s plan is a locked plan: a locked plan is never changed. The copies are unlocked, linked to each other; your plans stay exactly as they are.');
    expect(text).not.toMatch(/unlock the plan to|should unlock/i);
    const confirm = further(s, { type: A.HH_PICK, what: 'split' });
    expect(confirm.text).toContain(HOUSEHOLD.split.confirm.copies);
    expect(one(confirm.root, `${T}.useConfirm.yes`).textContent).toBe(HOUSEHOLD.split.confirm.yesCopies);
    const kept = further(s, { type: A.SPLIT_KEPT, planId: 'AlexCouple06', ids: { a: 'NewA1', b: 'NewB2' }, names: { a: 'Alex’s plan — drawing together', b: 'Sam’s plan — drawing together' }, where: 'account' });
    expect(one(kept.root, `${T}.kept`).textContent).toContain('Kept as ‘Alex’s plan — drawing together’ and ‘Sam’s plan — drawing together’ in your account');
    expect(one(kept.root, `${T}.openCopy.a`).getAttribute('href')).toBe('#/plan/NewA1');
    expect(one(kept.root, `${T}.use`)).toBe(null);
    // "Keep things as they are" written: the dismissed line and "Show the comparison again"
    const split = load('household-split');
    // the fingerprint of the two plans as they read today (7.4.0: Alex's draft, saved with next April, reads from this tax year)
    const byId = Object.fromEntries(split.plans.list.map((e) => [e.plan.id, e.plan]));
    const dayOf = new Date(split.env.today + 'T12:00:00');
    const fp = splitFingerprint(effectiveStressSettings(byId.AlexCouple06, { now: dayOf }), effectiveStressSettings(byId.SamCouple07, { now: dayOf }));
    const dismissed = further(split, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => (e.plan.id === 'AlexCouple06' ? { ...e, plan: { ...e.plan, household: { ...e.plan.household, splitDismissed: { partnerScenarioId: 'SamCouple07', fingerprint: fp, at: '2026-09-30T08:00:00.000Z' } } } } : e)), source: 'account', readAt: '14:04' }));
    expect(one(dismissed.root, `${T}.split.dismissed`).textContent).toBe(HOUSEHOLD.split.dismissed);
    expect(one(dismissed.root, `${T}.showAgain`)).not.toBe(null);
    expect(one(dismissed.root, `${T}.use`)).toBe(null);
    one(dismissed.root, `${T}.showAgain`).click();
    expect(dismissed.actions.pop()).toEqual({ type: 'plan/keepAsIs', planId: 'AlexCouple06', dismiss: false });
  });
});

describe('the survivor and care questions in ages (2.10)', () => {
  it('household-questions: "If Alex’s plan died at 74, Sam’s plan’s plan lasts …", the inheritance in a middling and a bad case, the spending after tax, the way; care from 79 for 3 years at £90,000, the household with and without; both "Tried in 3 runs"; put away; a box moved marks the result stale', () => {
    const s = load('household-questions');
    const { root, text, actions } = draw(s);
    const sv = s.household.survivor.result, ca = s.household.care.result;
    expect(one(root, `${T}.survivor.headline`).textContent).toMatch(/^If Alex’s plan died at 74, Sam’s plan’s plan lasts in .* with a middling inheritance, and in .* with a bad-case one \(the worst 1 in 10\)\.$/);
    expect(root.querySelector('[data-line="survivor.inherit"]').textContent).toContain(`Sam’s plan inherits ${pounds(sv.inherited.middling.total)} in a middling case, ${pounds(sv.inherited.bad.total)} in a bad case (the worst 1 in 10), at today’s prices — what Alex’s plan’s plan (Pots & Valves) has left then.`);
    expect(root.querySelector('[data-line="survivor.spend"]').textContent).toBe(`Sam’s plan then spends ${pounds(sv.spending.gross)} a year before tax (${pounds(sv.spending.net)} after tax), at today’s prices — 70% of what you both spend after tax.`);
    expect(one(root, `${T}.survivor.ran`).textContent).toBe('Tried in 3 runs (2.1 s).');
    expect(one(root, `${T}.care.headline`).textContent).toBe(`With Alex’s plan needing care from 79 for 3 years (£90,000 a year after tax, ${pounds(ca.totalCareCost)} in all, at today’s prices): the household’s money lasts ${s.plans.view.page.household.care.result.withWords} — ${s.plans.view.page.household.care.result.withoutWords} without care.`);
    expect(root.querySelector('[data-line="care.both"]').textContent).toContain('Both plans each lasting on its own:');
    expect(one(root, `${T}.care.ran`).textContent).toBe('Tried in 3 runs (2.3 s).');
    expect(text).toContain('the worst 1 in 10');
    expect(text).not.toMatch(/years from now|today's money|DB/);
    one(root, `${T}.survivor.close`).click();
    expect(actions.pop()).toEqual({ type: 'household/close', what: 'survivor' });
    const moved = further(s, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'survivor.atAge', value: '80' });
    expect(one(moved.root, `${T}.survivor.stale`).textContent).toBe(HOUSEHOLD.survivor.stale);
    expect(one(moved.root, `${T}.care.stale`)).toBe(null);
    one(moved.root, `${T}.survivor.button`).click();
    expect(moved.actions.pop()).toMatchObject({ type: 'household/survivor', boxes: { who: 'a', atAge: 80, spendPct: 70, dbPct: 50 } });
    // working and failed, from the ran state by the reducer; a wrong age said beside its box
    const ran = load('household-ran');
    const key = ran.household.key;
    const working = further(ran, { type: A.HH_CARE, key, boxes: { who: 'a', fromAge: 79, years: 3, cost: 90000 } });
    expect(one(working.root, `${T}.care.working`)).not.toBe(null);
    const failed = further(ran, { type: A.HH_SURVIVOR, key, boxes: { who: 'a', atAge: 74, spendPct: 70, dbPct: 50 } }, { type: A.HH_SURVIVOR_FAILED, key, boxes: { who: 'a', atAge: 74, spendPct: 70, dbPct: 50 }, reason: 'noWorker' });
    expect(one(failed.root, `${T}.survivor.failed`).textContent).toContain(HOUSEHOLD.survivor.noWorker);
    const wrong = further(ran, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'care.years', value: 'many' }, { type: A.PLAN_TOUCH, planId: 'AlexCouple06', path: 'care.years' });
    expect(wrong.root.querySelector('[data-error-for="plan.household.care.years"]').textContent).toBe(HOUSEHOLD.errors['care.years'].notANumber);
    expect(one(wrong.root, `${T}.care.button`).disabled).toBe(true);
  });
});

describe('one budget for the household, and who pays', () => {
  it('household-who-pays: the block open — "Some of these costs are paid by a partner" yes with the share box, the lines (none on these fixtures), Save and Cancel; the share\'s problem said; the budget offer and its confirm', () => {
    const s = load('household-who-pays');
    const { root, text, actions } = draw(s);
    expect(one(root, `${T}.whoPays.open`).textContent).toBe(HOUSEHOLD.whoPays.close);
    expect(one(root, 'plan.household.budget.shared.yes').checked).toBe(true);
    expect(one(root, 'plan.household.budget.mySharePct').value).toBe('60');
    expect(text).toContain(HOUSEHOLD.whoPays.noLines);
    expect(one(root, `${T}.whoPays.save`).textContent).toBe(HOUSEHOLD.whoPays.save);
    one(root, `${T}.whoPays.cancel`).click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: 'AlexCouple06' });
    const wrong = further(s, { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'budget.mySharePct', value: '140' }, { type: A.PLAN_SAVE, planId: 'AlexCouple06' });
    expect(wrong.root.querySelector('[data-error-for="plan.household.budget.mySharePct"]').textContent).toBe(HOUSEHOLD.whoPays.errors.mySharePct.tooHigh);
    // a line with who pays: me / partner / shared, the share box only when shared
    const withLine = further(s, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => (e.plan.id === 'AlexCouple06' ? { ...e, plan: { ...e.plan, budgetTool: { ...e.plan.budgetTool, settings: { ...e.plan.budgetTool.settings, lines: [{ id: 'l1', label: 'Food', amount: 400, period: 'mo', tier: 'essential' }] } } } } : e)), source: 'account', readAt: '14:04' }),
      { type: A.PLAN_EDIT, planId: 'AlexCouple06', path: 'budget.lines.l1.paidBy', value: 'shared' });
    expect(one(withLine.root, 'plan.household.budget.lines.l1.paidBy').value).toBe('shared');
    expect(one(withLine.root, 'plan.household.budget.lines.l1.mySharePct')).not.toBe(null);
    expect(withLine.root.querySelector('[data-card="lines.l1"] legend').textContent).toBe('Food');
    // one budget: share, then the confirm
    const first = load('household-first');
    const share = further(first, { type: A.HH_PICK, what: 'share' });
    expect(one(share.root, `${T}.budgetConfirm`)).not.toBe(null);
    expect(share.text).toContain('Share this plan’s budget? ‘Sam’s plan’ then reads this plan’s budget lines');
    one(share.root, `${T}.budgetConfirm.yes`).click();
    expect(share.actions.pop()).toEqual({ type: 'plan/shareBudget', planId: 'AlexCouple06', share: true });
    // shared: the line says whose budget it is, and the way back to separate budgets
    const shared = further(first, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => (e.plan.id === 'SamCouple07' ? { ...e, plan: { ...e.plan, budgetTool: { ...e.plan.budgetTool, sharedFrom: 'AlexCouple06' } } } : e)), source: 'account', readAt: '14:04' }));
    expect(one(shared.root, `${T}.budget`).getAttribute('data-shared')).toBe('1');
    expect(one(shared.root, `${T}.budget.line`).textContent).toBe('This plan’s budget is the household’s: ‘Sam’s plan’ reads the same lines, with its own share of who pays.');
    expect(one(shared.root, `${T}.budget.separate`).textContent).toBe('Give ‘Sam’s plan’ a separate budget');
  });
  it('the toast with Undo after a write, from the first state by the reducer; the problem line; a plan shown as saved offers nothing; without an account the window warning and every button', () => {
    const first = load('household-first');
    const saved = further(first, { type: A.PLAN_SAVED, planId: 'AlexCouple06', previous: { 'household.partnerScenarioId': null }, line: { id: 'linked', slots: {} }, op: 'link' });
    expect(one(saved.root, `${T}.toast`).textContent).toContain(HOUSEHOLD.toast.linked);
    one(saved.root, `${T}.undo`).click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: 'AlexCouple06' });
    const problem = further(first, { type: A.PLAN_SAVE_FAILED, planId: 'AlexCouple06', problem: 'noPartner' });
    expect(one(problem.root, `${T}.problem`).textContent).toBe(HOUSEHOLD.problems.noPartner);
    const readonly = further(first, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => (e.plan.id === 'AlexCouple06' ? { ...e, newer: true } : e)), source: 'account', readAt: '14:04' }));
    expect(one(readonly.root, `${T}.readonly`)).not.toBe(null);
    expect(one(readonly.root, `${T}.check`)).toBe(null);
    expect(one(readonly.root, `${T}.unlink`)).toBe(null);
    expect(one(readonly.root, `${T}.whoPays`)).toBe(null);
    const win = further(first, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } }, { type: A.PLANS_SET, list: first.plans.list, source: 'window', readAt: '14:04' });
    expect(one(win.root, 'plan.windowWarning')).not.toBe(null);
    expect(one(win.root, `${T}.check`)).not.toBe(null);
    expect(one(win.root, `${T}.budget.share`)).not.toBe(null);
  });
  it('every box of the step has words and a sentence for every problem', () => {
    for (const f of HOUSEHOLD_FIELDS) {
      if (f.path === 'link.choice') continue;
      const words = f.path.startsWith('budget.') ? HOUSEHOLD.whoPays.fields[f.path.split('.')[1]] : HOUSEHOLD.fields[f.path];
      expect(words && words.label, f.path).toBeTruthy();
      const errors = f.path.startsWith('budget.') ? HOUSEHOLD.whoPays.errors[f.path.split('.')[1]] : HOUSEHOLD.errors[f.path];
      expect(errors, f.path).toBeTruthy();
      for (const id of f.type === 'choice' ? ['notAnOption'] : ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(errors[id], `${f.path}.${id}`).toBeTypeOf('string');
    }
  });
});

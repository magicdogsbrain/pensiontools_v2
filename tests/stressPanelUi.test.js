/**
 * 7.9.0 "Try the bad years" on the classic planner's Scenarios page (the build spec's §2.3): the same rows, the same words and
 * the same agreements as V7's panel (answers/plan/stressPanel.js stressPanelView, src/v7/copy/stressPanel.js), drawn by
 * src/ui/stressPanelUi.js. Opening the page runs nothing and writes nothing; the button asks the engine worker for one row at
 * a time, As planned first, and draws the named stresses below with the rows shown; "I accept this risk" is ONE save of the
 * whole list after a confirm; Withdraw and Undo the same; a closed plan writes nothing; the held rows never write. The card's
 * static words are STRESS's; the named stresses below drop their own figure for the hint. Fictional plans, made-up results
 * (the real runs are tests/v7/plan/stressPanelRun.slow.test.js).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { h, render } from 'preact';
import { App } from '../src/v7/App.jsx';
import { reduce } from '../src/v7/state/reduce.js';
import { A } from '../src/v7/state/actions.js';
import { viewFor } from '../src/v7/effects/planSource.js';
import { stressPanelHtml, installStressPanel, resetStressPanelMemory, PANEL_OFF } from '../src/ui/stressPanelUi.js';
import { stressKeyOf, stressAmendPatch } from '../src/answers/plan/stressPanel.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { scenariosTabHtml } from '../src/ui/oneAnswerView.js';
import { STRESS } from '../src/v7/copy/stressPanel.js';
import { STRESS as STRESS_ON } from '../src/answers/shared/rules.js';
import { bannedHits } from './v7/render/checkScreen.js';
import { corpus, entryOf, stateWith, TODAY } from './v7/plan/_plans.js';

const C = corpus();
const plan0 = (name) => entryOf(JSON.parse(JSON.stringify(C[name]))).plan;
const single = { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } };
const AT = '2026-10-02T12:00:00.000Z';
const plain = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };

const WORDS = (twentieths, fixedOf20, age = 97) => ({
  headline: `Counting how long people your age live, the money lasts as long as you do ${twentieths} times in 20.`,
  fixed: `If you live to ${age}, the money lasts that long in ${fixedOf20} of 20 futures we tried.`,
  floor: 'If the money ran out at 88, you would still have £12,500 a year after tax from the income you get anyway.',
  left: `If you live to ${age}, what is typically left then is £180,000 at today's prices. In the best 1 in 10 futures it is £640,000 or more.`,
  assumed: [], why: null
});
/** A made-up row result (runStressRow's shape) for `key`. */
const row = (key, id, { w = 0.9, f = 0.85, words = WORDS(18, 17), na = null } = {}) => (na ? { id, key, na, runs: 0, basis: { today: TODAY } } : {
  id, key, na: null, runs: 2, shortfall: { when: { typical: 88, worst: 84, worstLasts: false }, howLong: { paid: 22, of: 31 }, howMuch: 0.9 }, ran: { family: true, cutsOn: false, cutPct: 20, months: 3 }, basis: { today: TODAY, strategyId: 'pots-and-valves' },
  a: { weighted: w, sumW: Math.round((1 - w) * 1000 * 1073741824), n: 1000, fixedAge: f, share: f, chancePct: f * 100, futures: 1000, planToAge: 97, weightToAge: 103, typicalLeft: 180000, badCaseLeft: 40000, goodCaseLeft: 640000,
    floor: { age: 88, yearly: 12500 }, cuts: null, level: 'balanced', verdict: w >= 0.85 ? 'yes' : 'no', lasts: w >= 0.85, failKind: 'ran-out', reason: null, words }
});
const RESULTS = {
  asPlanned: (key) => row(key, 'asPlanned'),
  fall: (key) => row(key, 'fall', { w: 0.75, f: 0.6, words: WORDS(15, 12) }),
  lower: (key) => row(key, 'lower', { w: 0.8, f: 0.7, words: WORDS(16, 14) }),
  spend: (key) => row(key, 'spend', { w: 0.7, f: 0.55, words: WORDS(14, 11) }),
  prices: (key) => row(key, 'prices'),
  asHeld: (key) => row(key, 'asHeld'),
  heldHalf: (key) => row(key, 'heldHalf', { w: 0.8, f: 0.7, words: WORDS(16, 14) }),
  heldNothing: (key) => row(key, 'heldNothing', { w: 0.7, f: 0.6, words: WORDS(14, 12) })
};

/** A page with the Scenarios card's ids, the module installed on a fake store; the worker a stub that files made-up rows. */
function harness(plan, { canRun = () => true } = {}) {
  let stored = JSON.parse(JSON.stringify(plan));
  document.body.innerHTML = '<button class="sub-tab" data-stresstab="scenarios">Scenarios</button><button class="sub-tab" data-stresstab="historical">History</button>'
    + '<span id="stressPanelTitle">x</span><p id="stressPanelLead">x</p><button id="stressPanelRun">x</button><div id="stressPanelRows"></div>';
  const w = { document }; const toasts = []; const writes = []; const asked = []; const named = [];
  installStressPanel(w, {
    scenario: async () => JSON.parse(JSON.stringify(stored)),
    persist: async (list) => { writes.push(JSON.parse(JSON.stringify(list))); stored = { ...stored, planAmendments: JSON.parse(JSON.stringify(list)), lastModified: '2026-11-09T12:0' + writes.length + ':00.000Z' }; },
    toast: (t, kind) => toasts.push([kind, t]),
    named: async (shown) => { named.push(shown); },
    run: async (type, payload) => { asked.push([type, payload.row, payload.today]); return RESULTS[payload.row](stressKeyOf(payload.plan, payload.today)); },
    canRun,
    today: () => TODAY
  });
  const box = () => document.getElementById('stressPanelRows');
  return { w, toasts, writes, asked, named, box, text: () => box().textContent.replace(/\s+/g, ' ').trim(), get: () => stored, set: (p) => { stored = JSON.parse(JSON.stringify(p)); } };
}

/** V7's panel drawn from the same rows (its text, row by row), as tests/v7/plan/stressPanelRender.test.js draws it. */
function v7Rows(plan) {
  let s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
  const key = stressKeyOf(plan, TODAY);
  const order = s.plans.view.page.lasts.stressPanel.order;
  s = reduce(s, { type: A.STRESS_RUN, key, planId: String(plan.id), rows: order });
  for (const id of order) s = reduce(s, { type: A.STRESS_ROW_DONE, key, row: id, result: RESULTS[id](key) });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  const root = document.createElement('div');
  render(h(App, { state: s, dispatch: () => {} }), root);
  return Object.fromEntries([...root.querySelectorAll('[data-testid="plan.lasts.stress"] li.stress-row')].map((li) => [li.getAttribute('data-row'),
    [...li.querySelectorAll('.stress-line')].map((x) => x.textContent)]));
}

beforeEach(() => resetStressPanelMemory());

describe('the card and opening the page', () => {
  it('the static card says STRESS\'s words, and the rows go above the named stresses', () => {
    const html = readFileSync('index.html', 'utf8');
    const card = html.slice(html.indexOf('<div id="stress-scenarios"'), html.indexOf('<!-- Drawdown Schedule Sub-tab -->'));
    expect(card).toContain('<span id="stressPanelTitle">' + STRESS.title + '</span>');
    expect(card).toContain('>' + STRESS.lead + '</p>');
    expect(card).toContain('data-on-click="runStressPanel()">' + STRESS.run + '</button>');
    expect(card.indexOf('id="stressPanelRows"')).toBeLessThan(card.indexOf('id="scenResults"'));
    expect(card).not.toMatch(/No second figure/);
  });
  it('installing sets the card\'s words; opening the page draws the panel and asks for nothing', async () => {
    const plan = plan0('02-pnv-draft');
    const H = harness(plan);
    expect(document.getElementById('stressPanelTitle').textContent).toBe(STRESS.title);
    expect(document.getElementById('stressPanelLead').textContent).toBe(STRESS.lead);
    document.querySelector('[data-stresstab="scenarios"]').click();
    await new Promise((r) => setTimeout(r, 0));
    expect(H.box().querySelector('#stressPanel').getAttribute('data-status')).toBe('idle');
    expect(H.box().querySelector('#stressRows')).toBe(null);
    expect(H.asked).toEqual([]);
    expect(H.writes).toEqual([]);
  });
  it('what is accepted shows with its date and figures before any run, with Withdraw — one save of the list', async () => {
    let plan = plan0('02-pnv-draft');
    const p = stressAmendPatch(plan, { id: 'fall', result: RESULTS.fall(stressKeyOf(plan, TODAY)) }, { at: AT, today: TODAY });
    plan = applyPatch(plan, p.patch);
    const H = harness(plan);
    await H.w.drawStressPanel();
    const g = H.box().querySelector('#stressAgreement-fall');
    expect(g.textContent).toContain('You accepted this on 2 October 2026, when the money lasted as long as you do 15 times in 20 (if you live to 97, it lasted that long in 12 of 20 futures we tried).');
    expect(g.querySelector('[data-weighted]')).toBeTruthy();
    expect(g.querySelector('[data-fixed="age"]')).toBeTruthy();
    expect(H.asked).toEqual([]);
    await H.w.withdrawStressRisk('fall');
    expect(H.writes).toEqual([[]]);
    expect(H.toasts.at(-1)).toEqual(['success', 'Withdrawn: what you accepted on 2 October 2026 is no longer on this plan.']);
    expect(H.box().querySelector('#stressAgreement-fall')).toBe(null);
  });
  it('the panel switched off (rules.js STRESS.panel false, the rollback): the card says the page as before 7.9.0, the button draws the named stresses only', async () => {
    expect(PANEL_OFF).toMatchObject({ title: 'Stress Scenarios', run: 'Show the named stresses' });
    STRESS_ON.panel = false;
    try {
      const H = harness(plan0('02-pnv-draft'));
      expect(document.getElementById('stressPanelTitle').textContent).toBe(PANEL_OFF.title);
      expect(document.getElementById('stressPanelLead').textContent).toBe(PANEL_OFF.lead);
      await H.w.runStressPanel();
      expect(H.named).toEqual([false]);
      expect(H.asked).toEqual([]);
      expect(stressPanelHtml(plan0('02-pnv-draft'), { today: TODAY })).toBe('');
    } finally { STRESS_ON.panel = true; }
  });
});

describe('the press', () => {
  it('the rows one at a time in the worker, As planned first; the named stresses below told the rows are shown; nothing written', async () => {
    const plan = plan0('02-pnv-draft');
    const H = harness(plan);
    await H.w.runStressPanel();
    expect(H.asked.map((x) => x[1])).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices']);
    expect(H.asked.every((x) => x[0] === 'stressRow' && x[2] === TODAY)).toBe(true);
    expect(H.named).toEqual([true]);
    expect(H.writes).toEqual([]);
    const panel = H.box().querySelector('#stressPanel');
    expect(panel.getAttribute('data-status')).toBe('done');
    expect([...panel.querySelectorAll('li.stress-row')].map((li) => li.getAttribute('data-row'))).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices']);
    const fall = panel.querySelector('[data-row="fall"]');
    expect(fall.querySelector('[data-weighted]').textContent).toBe('Counting how long people your age live, the money lasts as long as you do 15 times in 20 (as planned: 18).');
    expect(fall.querySelector('[data-fixed="age"]').textContent).toBe('If you live to 97, the money lasts that long in 12 of 20 futures we tried (as planned: 17).');
    expect(fall.textContent).toContain(STRESS.handOver);
    expect(document.getElementById('stressPanelRun').textContent).toBe(STRESS.again);
    const t = H.text();
    expect(t).not.toMatch(/NaN|undefined|null|\{\w+\}/);
    expect(t).not.toMatch(/one every [\d,]+ months/);
    expect(bannedHits(t, ['all', 'result', 'record'])).toEqual([]);
  });
  it('classic and V7 give the same row text, line for line', async () => {
    const plan = plan0('04-buckets-running');
    plan.holdings.lines.push(single);
    const H = harness(plan);
    await H.w.runStressPanel();
    const classic = Object.fromEntries([...H.box().querySelectorAll('li.stress-row')].map((li) => [li.getAttribute('data-row'), [...li.querySelectorAll('.stress-line')].map((x) => x.textContent)]));
    expect(Object.keys(classic)).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices', 'asHeld', 'heldHalf', 'heldNothing']);
    expect(classic).toEqual(v7Rows(plan));
  });
  it('no worker: nothing tried and the page says why', async () => {
    const H = harness(plan0('02-pnv-draft'), { canRun: () => false });
    await H.w.runStressPanel();
    expect(H.asked).toEqual([]);
    expect(H.box().querySelector('#stressFailed').textContent).toBe(STRESS.noWorker);
  });
  it('the hand-over under the fall row opens the real starts, one at a time (the History page)', async () => {
    const H = harness(plan0('02-pnv-draft'));
    let opened = false;
    document.querySelector('[data-stresstab="historical"]').addEventListener('click', () => { opened = true; });
    H.w.showBadStarts();
    expect(opened).toBe(true);
  });
});

describe('"I accept this risk"', () => {
  it('asks on the page, then ONE save of the whole list; the accepted line; Undo is one save back', async () => {
    const plan = plan0('02-pnv-draft');
    const H = harness(plan);
    await H.w.runStressPanel();
    H.w.askStressRisk('spend');
    await new Promise((r) => setTimeout(r, 0));
    const confirm = H.box().querySelector('#stressRow-spend-confirm');
    expect(confirm.textContent).toContain('You are saying you have seen what this does to the plan: counting how long people your age live, the money lasts as long as you do 14 times in 20; if you live to 97, it lasts that long in 11 of 20 futures we tried.');
    expect(confirm.textContent).toContain(STRESS.agreement.no);
    await H.w.acceptStressRisk('spend');
    expect(H.writes).toHaveLength(1);
    expect(H.writes[0]).toHaveLength(1);
    expect(H.writes[0][0]).toMatchObject({ kind: 'stress', test: { id: 'spend' }, result: { chance: 0.7, fixedAge: 0.55, planToAge: 97 } });
    expect(Object.keys(H.writes[0][0].test.inputs).sort()).toEqual(['firstTaxYear', 'shock', 'startAge', 'strategyId', 'years']);
    // the rows stay (accepting moves no key); the accepted line and Withdraw on the row
    expect(H.box().querySelector('#stressRow-spend-accepted').getAttribute('data-status')).toBe('agreed');
    expect(H.box().querySelector('#stressRow-spend-withdraw')).toBeTruthy();
    await H.w.undoStressRisk();
    expect(H.writes).toHaveLength(2);
    expect(H.writes[1]).toEqual([]);
  });
  it('the held rows show the keep agreement\'s state and the way to What you hold, never an accept', async () => {
    const plan = plan0('04-buckets-running');
    plan.holdings.lines.push(single);
    const H = harness(plan);
    await H.w.runStressPanel();
    for (const id of ['asHeld', 'heldHalf', 'heldNothing']) {
      const li = H.box().querySelector('[data-row="' + id + '"]');
      expect(li.querySelector('[data-keep]').getAttribute('data-keep')).toBe('untested');
      expect(li.textContent).toContain(STRESS.held.onHold);
      expect(li.querySelector('[id$="-accept"]')).toBe(null);
    }
  });
  it('a result for the plan as it was is refused, nothing written; a closed plan writes nothing', async () => {
    const plan = plan0('02-pnv-draft');
    const H = harness(plan);
    await H.w.runStressPanel();
    // the plan's settings changed since the rows were tried: the old rows are not read, accepting is refused
    const changed = JSON.parse(JSON.stringify(H.get()));
    changed.stressTool.settings.duration = (+changed.stressTool.settings.duration || 30) + 1;
    H.set(changed);
    await H.w.acceptStressRisk('fall');
    expect(H.writes).toEqual([]);
    expect(H.box().querySelector('#stressRows')).toBe(null);
    H.set({ ...plan, closedAt: '2026-09' });
    await H.w.withdrawStressRisk('fall');
    await H.w.runStressPanel();
    expect(H.writes).toEqual([]);
  });
});

describe('the named stresses below the rows', () => {
  const a = { histories: 1200, chancePct: 85, outOfTen: { words: 'in 8 or 9 futures out of 10' } };
  it('with the rows shown: no figure of their own, and the hint says what each part is', () => {
    const t = plain(scenariosTabHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', a, r: {}, p: {}, rows: [], scenarios: {}, startYears: {}, worst: [], rowsShown: true }));
    expect(t).toContain('is one of the 1,200 real starts behind this plan\'s figure above.');
    expect(t).not.toMatch(/\d%/);
    expect(t).toContain(STRESS.classicHint);
    expect(t).not.toMatch(/Until 6\.24/);
  });
  it('without them: as before', () => {
    const t = plain(scenariosTabHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', a, r: {}, p: {}, rows: [], scenarios: {}, startYears: {}, worst: [] }));
    expect(t).toMatch(/behind your figure of 85%/);
    expect(t).toMatch(/Until 6\.24/);
  });
});

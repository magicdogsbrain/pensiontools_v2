/**
 * 7.9.0 "Try the bad years" on a plan's "Does it last?" (the build spec's §2.1, §6), drawn from states with made-up row results
 * (runStressRow's shape; the real runs are stressPanelRun.slow.test.js): before the press — the button, what is accepted with
 * Withdraw, the keep agreement's state and its link, no run; the press asks for the rows As planned first; the rows drawn in
 * short — each title and what it changes, ONE chance line (the weighted chance beside its fixed-age count) and ONE "runs out"
 * line, each beside the reference; when, how long and how much closed under "More about this line"; what still comes in
 * said once above the rows; no history figure, no banned word, nothing unfilled; "I accept this risk" asks on the screen, then ONE plan/amend with the row;
 * a locked ladder's rows not tried and said so; the held rows the keep agreement's state, never an accept. Fictional plans.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { stressKeyOf, stressAmendPatch, sayStress } from '../../../src/answers/plan/stressPanel.js';
import { runKeyOf } from '../../../src/answers/plan/lasts.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { STRESS } from '../../../src/v7/copy/stressPanel.js';
import { corpus, entryOf, stateWith, TODAY } from './_plans.js';

const C = corpus();
const plan0 = (name, id) => { const p = JSON.parse(JSON.stringify(C[name])); if (id) p.id = id; return entryOf(p).plan; };
const single = { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } };
const AT = '2026-10-02T12:00:00.000Z';

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const panelOf = (root) => root.querySelector('[data-testid="plan.lasts.stress"]');

/** The 7.8.0 render rule on a drawn panel (tests/v7/render/lastsRule.test.js, held here on the rows). */
const BLOCK = 'section, .block, .headline, .band, .plan-section, details';
const AGE = /\b(live to|is still alive when|is) \d{2,3}\b/;
function ruleProblems(root) {
  const out = [];
  for (const el of root.querySelectorAll('[data-weighted]')) {
    const block = (el.parentElement && el.parentElement.closest(BLOCK)) || root;
    const fixed = [...block.querySelectorAll('[data-fixed="age"]')].filter((f) => f !== el && AGE.test(f.textContent));
    if (!fixed.length) out.push('no fixed-age line beside: ' + el.textContent.slice(0, 80));
    if (/of 20 futures we tried|futures out of/.test(el.textContent) && !el.classList.contains('level-strip')) out.push('a weighted sentence counts futures: ' + el.textContent.slice(0, 80));
  }
  for (const f of root.querySelectorAll('[data-fixed="age"]')) if (!AGE.test(f.textContent)) out.push('a fixed-age line names no age: ' + f.textContent.slice(0, 80));
  return out;
}

const WORDS = (twentieths, fixedOf20, age = 97) => ({
  headline: `Counting how long people your age live, the money lasts as long as you do ${twentieths} times in 20.`,
  fixed: `If you live to ${age}, the money lasts that long in ${fixedOf20} of 20 futures we tried.`,
  floor: 'If the money ran out at 88, you would still have £12,500 a year after tax from the income you get anyway.',
  left: `If you live to ${age}, what is typically left then is £180,000 at today's prices. In the best 1 in 10 futures it is £640,000 or more.`,
  assumed: [], why: null
});
/** A made-up row result (runStressRow's shape) for `key`. */
const row = (key, id, { w = 0.9, f = 0.85, words = WORDS(18, 17), shortfall = { when: { typical: 88, worst: 84, worstLasts: false, count: 150, n: 1000, to: 103 }, howLong: { paid: 22, of: 31, count: 120 }, howMuch: 0.9 }, cuts = null, cutsOn = false, na = null } = {}) => (na ? { id, key, na, runs: 0, basis: { today: TODAY } } : {
  id, key, na: null, runs: 2, shortfall, ran: { family: true, cutsOn, cutPct: 20, months: 3 }, basis: { today: TODAY, strategyId: 'pots-and-valves' },
  a: { weighted: w, sumW: Math.round((1 - w) * 1000 * 1073741824), n: 1000, fixedAge: f, share: f, chancePct: f * 100, futures: 1000, planToAge: 97, weightToAge: 103, typicalLeft: 180000, badCaseLeft: 40000, goodCaseLeft: 640000,
    floor: { age: 88, yearly: 12500 }, cuts, level: 'balanced', verdict: w >= 0.85 ? 'yes' : 'no', lasts: w >= 0.85, failKind: 'ran-out', reason: null, words }
});

/** A state on #/plan/<id>/lasts with these rows held (as the effect files them), the reading refreshed as the plan source does. */
function withRows(plan, rows, { open = [] } = {}) {
  let s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
  const key = stressKeyOf(plan, TODAY);
  const order = s.plans.view.page.lasts.stressPanel.order;
  s = reduce(s, { type: A.STRESS_RUN, key, planId: String(plan.id), rows: order });
  for (const [id, r] of Object.entries(rows(key))) if (order.includes(id)) s = reduce(s, { type: A.STRESS_ROW_DONE, key, row: id, result: r });
  for (const x of open) s = reduce(s, { type: A.UI_TOGGLE, id: x });
  return reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
}
const MARKET = (key) => ({
  asPlanned: row(key, 'asPlanned'),
  fall: row(key, 'fall', { w: 0.75, f: 0.6, words: WORDS(15, 12), shortfall: { when: { typical: 90, worst: 82, worstLasts: false, count: 211, n: 1000, to: 103 }, howLong: { paid: 21, of: 31, count: 180 }, howMuch: 0.8 } }),
  lower: row(key, 'lower', { w: 0.8, f: 0.7, words: WORDS(16, 14) }),
  spend: row(key, 'spend', { w: 0.7, f: 0.55, words: WORDS(14, 11) }),
  prices: row(key, 'prices')
});

describe('before the press', () => {
  it('switched off (rules.js STRESS.panel false, the rollback): no panel on the page, nothing to press', async () => {
    const { STRESS: ON } = await import('../../../src/answers/shared/rules.js');
    const plan = plan0('02-pnv-draft');
    ON.panel = false;
    try {
      const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
      expect(s.plans.view.page.lasts.stressPanel).toBe(null);
      expect(panelOf(draw(s).root)).toBe(null);
    } finally { ON.panel = true; }
  });
  it('the button and the lead; no rows, no run, nothing asked of the worker; the press asks for the rows As planned first', () => {
    const plan = plan0('02-pnv-draft');
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
    const { root, actions } = draw(s);
    const panel = panelOf(root);
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('data-status')).toBe('idle');
    expect(panel.querySelector('h2').textContent).toBe(STRESS.title);
    expect(panel.textContent).toContain(STRESS.lead);
    expect(panel.querySelector('[data-testid="plan.lasts.stress.rows"]')).toBe(null);
    expect(actions).toEqual([]);
    panel.querySelector('[data-testid="plan.lasts.stress.run"]').click();
    expect(actions).toEqual([{ type: 'stress/run', key: stressKeyOf(plan, TODAY), planId: String(plan.id), rows: ['asPlanned', 'fall', 'lower', 'spend', 'prices'] }]);
  });
  it('what is accepted shows with its date and figures, each with Withdraw, before any run; Withdraw is one plan/amend for that row', () => {
    let plan = plan0('02-pnv-draft');
    const key = stressKeyOf(plan, TODAY);
    const p = stressAmendPatch(plan, { id: 'fall', result: row(key, 'fall', { w: 0.75, f: 0.6 }) }, { at: AT, today: TODAY });
    expect(p.ok).toBe(true);
    plan = applyPatch(plan, p.patch);
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
    const { root, actions } = draw(s);
    const g = root.querySelector('[data-testid="plan.lasts.stress.agreement.fall"]');
    expect(g).toBeTruthy();
    expect(g.textContent).toContain('A fall at the start');
    // before any run, no figures sit above it: the agreement says the figures it was accepted on
    expect(g.textContent).toContain('You accepted this on 2 October 2026, when the money lasted as long as you do, 15 times in 20 (if you live to 97, it lasted that long in 12 of 20 futures we tried).');
    expect(ruleProblems(root)).toEqual([]);
    g.querySelector('[data-testid="plan.lasts.stress.agreement.fall.withdraw"]').click();
    expect(actions).toEqual([{ type: 'plan/amend', planId: String(plan.id), op: 'withdraw', kind: 'stress', testId: 'fall' }]);
  });
  it('a plan that keeps a line by choice: the keep agreement\'s state and the way to What you hold; the held rows join the order after As planned', () => {
    const plan = plan0('04-buckets-running');
    plan.holdings.lines.push(single);
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts');
    const { root } = draw(s);
    const k = root.querySelector('[data-testid="plan.lasts.stress.keep"]');
    expect(k).toBeTruthy();
    expect(k.getAttribute('data-status')).toBe('untested');
    expect(root.querySelector('[data-testid="plan.lasts.stress.keepHold"]').getAttribute('href')).toBe('#/plan/' + plan.id + '/hold');
    expect(root.querySelector('[data-testid="plan.lasts.stress.keepHold"]').textContent).toBe(STRESS.held.accept);
    expect(s.plans.view.page.lasts.stressPanel.order).toEqual(['asPlanned', 'asHeld', 'fall', 'lower', 'spend', 'prices', 'heldHalf', 'heldNothing']);
  });
});

describe('the rows drawn', () => {
  it('each row in short: its title and change, ONE chance line (the weighted chance beside its fixed-age count), ONE "runs out" line, each beside the reference; the rest closed under "More about this line"; what still comes in once, above the rows; no history figure, no banned word, nothing unfilled', () => {
    const plan = plan0('02-pnv-draft');
    const s = withRows(plan, MARKET);
    const { root } = draw(s);
    const panel = panelOf(root);
    expect(panel.getAttribute('data-status')).toBe('done');
    const rows = [...panel.querySelectorAll('li.stress-row')];
    expect(rows.map((r) => r.getAttribute('data-row'))).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices']);
    const fall = panel.querySelector('[data-row="fall"]');
    const chance = fall.querySelector('[data-line="chance"]');
    // each clause has its verb ("it lasts that long"); the no-break spaces keep a bracket's last words on one line
    expect(chance.textContent).toBe('The money lasts as long as you do, 15 times in 20 (as\u00a0planned 18); if you live to 97, it lasts that long in 12 of 20 futures we tried (as\u00a0planned 17).');
    expect(chance.querySelector('[data-weighted]').textContent).toBe('The money lasts as long as you do, 15 times in 20 (as\u00a0planned 18)');
    expect(chance.querySelector('[data-fixed="age"]').textContent).toBe('if you live to 97, it lasts that long in 12 of 20 futures we tried (as\u00a0planned 17).');
    expect(fall.querySelector('[data-line="runsOut"]').textContent).toBe('Where it runs out: typically at 90, the worst 1 in 10 by 82 (as\u00a0planned 88 and\u00a084).');
    // a figure As planned says too is said once: "(the same as planned)", never "16 (as planned 16)"
    const lower = panel.querySelector('[data-row="lower"]');
    expect(lower.querySelector('[data-line="runsOut"]').textContent).toBe('Where it runs out: typically at 88, the worst 1 in 10 by 84 (both the same as\u00a0planned).');
    // shown: the title, what it changes, the two lines; the rest closed under "More about this line"
    expect([...fall.querySelectorAll(':scope > p.stress-line')].map((x) => x.getAttribute('data-line'))).toEqual(['chance', 'runsOut']);
    const more = fall.querySelector('details.stress-more');
    expect(more.open).toBe(false);
    expect(more.querySelector('summary').textContent).toBe(STRESS.short.more);
    // when, how long and how much name the futures each counts, how many there are, and As planned's figure beside it: a
    // later "typically" over more futures never reads as a better year — the words as they were, inside
    expect(more.textContent).toContain('In the futures where the money runs out before 103 (211 of the 1,000; as planned: 150), it typically runs out at 90 (as planned: 88). In the worst 1 in 10 of all the futures, by 82 (as planned: by 84).');
    expect(more.textContent).toContain('In the futures where it runs out before 97 (180 of the 1,000; as planned: 120), it still pays for 21 of the 31 years to 97 (as planned: 22).');
    expect(more.textContent).toContain('Across those futures, £8 of every £10 of income the plan pays is still paid (as planned: £9).');
    expect(more.textContent).toContain('what is typically left then is £180,000');
    expect(fall.textContent).toContain(STRESS.handOver);
    // this draft draws from this tax year: the fall is said in the coming year
    expect(fall.textContent).toContain(STRESS.rows.fall.whatDrawing);
    // what still comes in: once, above the rows, from As planned, with no age; no row says it again (each row's is the same)
    const floor = panel.querySelector('[data-testid="plan.lasts.stress.floor"]');
    expect(floor.textContent).toBe('If the money runs out, you would still have £12,500 a year after tax from the income you get anyway.');
    expect(floor.closest('li')).toBe(null);
    expect(panel.textContent).not.toContain('If the money ran out at 88');
    const planned = panel.querySelector('[data-row="asPlanned"]');
    expect(planned.querySelector('[data-line="chance"]').textContent).toBe('The money lasts as long as you do, 18 times in 20; if you live to 97, it lasts that long in 17 of 20 futures we tried.');
    expect(planned.querySelector('[data-line="runsOut"]').textContent).toBe('Where it runs out: typically at 88, the worst 1 in 10 by 84.');
    expect(planned.textContent).toContain('In the futures where the money runs out before 103, it typically runs out at 88. In the worst 1 in 10 of all the futures, by 84.');
    expect(planned.textContent).toContain('In the futures where it runs out before 97, it still pays for 22 of the 31 years to 97.');
    expect(planned.textContent).toContain('Across those futures, £9 of every £10 of income the plan pays is still paid.');
    expect(planned.textContent).toContain('In the worst 1 in 10 futures, what is left at 97 is £40,000.');
    expect(planned.textContent).not.toContain('as planned');
    // prices made nothing worse here: "this changes nothing", no figures, no accept
    const prices = panel.querySelector('[data-row="prices"]');
    expect(prices.getAttribute('data-same')).toBe('1');
    expect(prices.textContent).toContain(STRESS.na.same);
    expect(prices.querySelector('[data-testid="plan.lasts.stress.prices.accept"]')).toBe(null);
    expect(ruleProblems(root)).toEqual([]);
    const text = visibleText(panel);
    expect(text).not.toMatch(/\bNaN\b|\bundefined\b|\bnull\b|\{\w+\}/);
    expect(text).not.toMatch(/real starts? (that )?ran out|every 1,000,000,000|histor/i);
    expect(bannedHits(text, ['all', 'result', 'record'], { context: text })).toEqual([]);
    expect(root.querySelector('[data-testid="plan.lasts.stress.run"]').textContent).toBe(STRESS.again);
  });
  it('rows stream: while working, the line being tried is said and the rows so far are drawn', () => {
    const plan = plan0('02-pnv-draft');
    const s = withRows(plan, (key) => ({ asPlanned: row(key, 'asPlanned'), fall: row(key, 'fall', { w: 0.75, f: 0.6, words: WORDS(15, 12) }) }));
    const { root } = draw(s);
    expect(root.querySelector('[data-testid="plan.lasts.stress.working"]').textContent).toBe('Trying line 3 of 5…');
    expect(panelOf(root).querySelector('[data-row="fall"]').getAttribute('data-status')).toBe('done');
    expect(panelOf(root).querySelector('[data-row="lower"]').getAttribute('data-status')).toBe('idle');
    expect(root.querySelector('[data-testid="plan.lasts.stress.run"]').disabled).toBe(true);
  });
  it('"I accept this risk" asks on the screen with the figures said back; "Yes, I accept it" is ONE plan/amend with the row; "Go back" closes it', () => {
    const plan = plan0('02-pnv-draft');
    const closed = draw(withRows(plan, MARKET));
    closed.root.querySelector('[data-testid="plan.lasts.stress.fall.accept"]').click();
    expect(closed.actions).toEqual([{ type: 'ui/toggle', id: 'stressConfirm.fall' }]);
    const { root, actions } = draw(withRows(plan, MARKET, { open: ['stressConfirm.fall'] }));
    const c = root.querySelector('[data-testid="plan.lasts.stress.fall.confirm"]');
    expect(c.textContent).toContain('You are saying you have seen what this does to the plan: counting how long people your age live, the money lasts as long as you do 15 times in 20; if you live to 97, it lasts that long in 12 of 20 futures we tried. Nothing about the plan changes, and you can withdraw this at any time.');
    expect(c.textContent).toContain('It is not advice, and we have not judged whether the plan suits you.');
    expect(ruleProblems(root)).toEqual([]);
    c.querySelector('[data-testid="plan.lasts.stress.fall.confirm.yes"]').click();
    expect(actions).toEqual([{ type: 'plan/amend', planId: String(plan.id), op: 'accept', kind: 'stress', testId: 'fall' }]);
    actions.length = 0;
    c.querySelector('[data-testid="plan.lasts.stress.fall.confirm.no"]').click();
    expect(c.querySelector('[data-testid="plan.lasts.stress.fall.confirm.no"]').textContent).toBe('Go back');
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'stressConfirm.fall' }]);
    // As planned is accepted as the plan's own figure ('confidence')
    const planned = draw(withRows(plan, MARKET, { open: ['stressConfirm.asPlanned'] }));
    planned.root.querySelector('[data-testid="plan.lasts.stress.asPlanned.confirm.yes"]').click();
    expect(planned.actions).toEqual([{ type: 'plan/amend', planId: String(plan.id), op: 'accept', kind: 'confidence', testId: 'asPlanned' }]);
  });
  it('an accepted row says when and on what figures, with Withdraw; out of date when the plan\'s figures change, said so', () => {
    let plan = plan0('02-pnv-draft');
    const p = stressAmendPatch(plan, { id: 'spend', result: row(stressKeyOf(plan, TODAY), 'spend', { w: 0.7, f: 0.55 }) }, { at: AT, today: TODAY });
    plan = applyPatch(plan, p.patch);
    const { root } = draw(withRows(plan, MARKET));
    const spend = panelOf(root).querySelector('[data-row="spend"]');
    expect(spend.querySelector('[data-testid="plan.lasts.stress.spend.accepted"]').getAttribute('data-status')).toBe('agreed');
    // still standing, its figures are the row's own, just above: only the date is said
    expect(spend.querySelector('[data-testid="plan.lasts.stress.spend.accepted"]').textContent).toBe('You accepted this on 2 October 2026.');
    expect(spend.querySelector('[data-testid="plan.lasts.stress.spend.withdraw"]')).toBeTruthy();
    // agreed and still standing: Withdraw is its one button, never a second "I accept this risk"
    expect(spend.querySelector('[data-testid="plan.lasts.stress.spend.accept"]')).toBe(null);
    // the other rows' accept is a quiet button: nothing on the panel presses for it
    expect(panelOf(root).querySelector('[data-testid="plan.lasts.stress.fall.accept"]').className).toBe('btn btn-quiet');
    const stale = applyPatch(plan, { 'stressTool.settings.statePension': 9000 });
    const s2 = draw(withRows(stale, MARKET));
    const line = panelOf(s2.root).querySelector('[data-testid="plan.lasts.stress.spend.accepted"]');
    expect(line.getAttribute('data-status')).toBe('stale');
    // out of date: it can be accepted again
    expect(panelOf(s2.root).querySelector('[data-testid="plan.lasts.stress.spend.accept"]')).toBeTruthy();
    expect(line.textContent).toContain(STRESS.agreement.stale);
    // out of date: the figures it was accepted on, beside the row's new ones
    expect(line.textContent).toContain('You accepted this on 2 October 2026, when the money lasted as long as you do, ');
    expect(ruleProblems(s2.root)).toEqual([]);
  });
  it('a row where nothing runs out offers no accept; the worst 1 in 10 is said to last', () => {
    const plan = plan0('02-pnv-draft');
    const lasts = { when: null, howLong: null, howMuch: 1 };
    const s = withRows(plan, (key) => ({ ...MARKET(key), lower: row(key, 'lower', { w: 1, f: 1, words: { ...WORDS(20, 20), headline: 'Counting how long people your age live, the money lasts as long as you do in every future we tried.', fixed: 'If you live to 97, the money lasts that long in every future we tried.' }, shortfall: lasts }) }));
    const lower = panelOf(draw(s).root).querySelector('[data-row="lower"]');
    expect(lower.querySelector('[data-line="runsOut"]').textContent).toBe('In the worst 1 in 10 it still lasts to 97 (as\u00a0planned by\u00a084).');
    expect(lower.querySelector('[data-testid="plan.lasts.stress.lower.accept"]')).toBe(null);
  });
});

describe('what still comes in', () => {
  it('a row whose floor says something else says its own under "More about this line"; As planned\'s is said once above the rows', () => {
    const plan = plan0('02-pnv-draft');
    const other = { ...WORDS(14, 11), floor: 'If the money ran out at 70, nothing would come in until your State Pension starts at 67.' };
    const s = withRows(plan, (key) => {
      const m = MARKET(key);
      const spend = row(key, 'spend', { w: 0.7, f: 0.55, words: other });
      spend.a.floor = { age: 70, yearly: 0, spAge: 67 };
      return { ...m, spend };
    });
    const panel = panelOf(draw(s).root);
    expect(panel.querySelectorAll('.stress-floor').length).toBe(1);
    expect(panel.querySelector('[data-row="spend"] details.stress-more').textContent).toContain(other.floor);
    for (const id of ['asPlanned', 'fall', 'lower']) expect(panel.querySelector(`[data-row="${id}"]`).textContent).not.toContain('If the money ran out');
  });
  it('a plan whose money runs out before anything comes in says As planned\'s own sentence above the rows, with its age', () => {
    const plan = plan0('02-pnv-draft');
    const own = { ...WORDS(18, 17), floor: 'If the money ran out at 64, nothing would come in until your State Pension starts at 67.' };
    const s = withRows(plan, (key) => {
      const m = MARKET(key);
      const asPlanned = row(key, 'asPlanned', { words: own });
      asPlanned.a.floor = { age: 64, yearly: 0, spAge: 67 };
      return { ...m, asPlanned };
    });
    const panel = panelOf(draw(s).root);
    expect(panel.querySelector('[data-testid="plan.lasts.stress.floor"]').textContent).toBe(own.floor);
    // the other rows' floor is £12,500 a year: each says its own, with its age
    expect(panel.querySelector('[data-row="fall"] details.stress-more').textContent).toContain('If the money ran out at 88, you would still have £12,500 a year after tax');
  });
});

describe('the address that names the panel (#/plan/<id>/lasts?focus=stress)', () => {
  /** The page as "Does it last?" runs (the panel drawn under an answer still to come), then with its answer settled. */
  const working = (s, key) => reduce(s, { type: A.LASTS_WORKING, key });
  const settledOf = (s, key) => reduce(working(s, key), { type: A.LASTS_FAILED, key });
  const mount = () => { const root = document.createElement('div'); root.id = 'app'; document.body.appendChild(root); return root; };
  const drawIn = (root, state) => act(() => { render(h(App, { state, dispatch: () => {} }), root); });
  it('the panel\'s heading takes the keyboard once the answer above it has settled, never while it is still to come and would push the panel down', () => {
    const plan = plan0('02-pnv-draft');
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts?focus=stress');
    expect(s.route.focus).toBe('stress');
    const key = runKeyOf(plan);
    const root = mount();
    try {
      drawIn(root, working(s, key));
      const head0 = root.querySelector('[data-testid="plan.lasts.stress"] h2');
      expect(head0).toBeTruthy();
      expect(head0.hasAttribute('data-focus-for')).toBe(false);
      expect(document.activeElement).not.toBe(head0);
      drawIn(root, settledOf(s, key));
      const head = root.querySelector('[data-focus-for="plan.stress"]');
      expect(head).toBeTruthy();
      expect(document.activeElement).toBe(head);
      // once there, a later draw does not take it again
      head.blur();
      drawIn(root, { ...settledOf(s, key) });
      expect(document.activeElement).not.toBe(head);
    } finally { render(null, root); root.remove(); }
  });
  it('a keyboard moved elsewhere while the answer was coming is left where the person put it', () => {
    const plan = plan0('02-pnv-draft');
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts?focus=stress');
    const key = runKeyOf(plan);
    const root = mount();
    const box = document.createElement('input');
    document.body.appendChild(box);
    try {
      drawIn(root, working(s, key));
      box.focus();
      drawIn(root, settledOf(s, key));
      expect(document.activeElement).toBe(box);
    } finally { render(null, root); root.remove(); box.remove(); }
  });
});

describe('a saver\'s plan', () => {
  it('the fall is said in the first year the money is drawn on; lower returns says the years until then are as the plan has them', () => {
    const plan = plan0('05-saver-committed');
    const v = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts').plans.view.page.lasts.stressPanel;
    expect(v.drawing).toBe(false);
    const by = Object.fromEntries(v.rows.map((r) => [r.id, r.parts.what.map((w) => sayStress(w, STRESS))]));
    expect(by.fall).toEqual([STRESS.rows.fall.what]);
    expect(by.lower).toEqual([STRESS.rows.lower.what, STRESS.rows.lower.saver]);
  });
});

describe('a locked ladder and the held rows', () => {
  it('a locked ladder: why the four market rows are not tried is said once, above the rows; they are never sent; nothing to accept on them', () => {
    const plan = plan0('03-gilt-ladder-locked');
    const lasts = { when: null, howLong: null, howMuch: 1 };
    const s = withRows(plan, (key) => ({ asPlanned: row(key, 'asPlanned', { w: 1, f: 1, words: { ...WORDS(20, 20), headline: 'Counting how long people your age live, the money lasts as long as you do in every future we tried.', fixed: 'If you live to 97, the money lasts that long in every future we tried.' }, shortfall: lasts }) }));
    expect(s.stressPanel.order).toEqual(['asPlanned']);
    const { root } = draw(s);
    const panel = panelOf(root);
    const once = panel.querySelector('[data-testid="plan.lasts.stress.notTried"]');
    expect(once.getAttribute('data-na')).toBe('lockedLadder');
    expect(once.closest('li')).toBe(null);
    expect(once.textContent).toMatch(/^A locked ladder’s income is fixed on the day it is locked, by the gilts and their prices that day, so these four are not tried on it: a fall at the start, lower returns, spending a tenth more and prices rising faster\.( What you chose to keep is tried below\.)?$/);
    // ... and said nowhere else: each row keeps its title and what it changes
    expect(visibleText(panel).split('not tried on it').length - 1).toBe(1);
    for (const id of ['fall', 'lower', 'spend', 'prices']) {
      const r = panel.querySelector(`[data-row="${id}"]`);
      expect(r.getAttribute('data-status')).toBe('na');
      expect(r.querySelector(`[data-testid="plan.lasts.stress.${id}.na"]`)).toBe(null);
      expect(r.querySelector('.stress-title')).toBeTruthy();
      expect(r.querySelector(`[data-testid="plan.lasts.stress.${id}.accept"]`)).toBe(null);
    }
    // As planned lasts in every future: its chance line says so, and nothing repeats it ("still lasts to 97")
    expect(panel.querySelector('[data-row="asPlanned"] [data-line="runsOut"]')).toBe(null);
    expect(visibleText(panel)).not.toContain('still lasts to');
    // the fall row was not tried: no walk through real bad starts offered under it
    expect(root.querySelector('[data-testid="plan.lasts.stress.badStarts"]')).toBe(null);
    expect(ruleProblems(root)).toEqual([]);
  });
  it('a locked ladder held with years not covered: As you hold it says how much of the income what is held leaves not covered, once it lasts less often than As planned', () => {
    // a fictional locked ladder (corpus 20) with two rungs not held and a world fund kept by choice
    const raw = JSON.parse(JSON.stringify(C['20-locked-start-after-stop']));
    raw.holdings.lines = raw.holdings.lines.filter((l) => !/^(T29|T30I)$/.test(l.ticker || '')).map((l) => (l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: false } } : l));
    const plan = entryOf(raw).plan;
    const lasts = { when: null, howLong: null, howMuch: 1 };
    const planned = (key) => row(key, 'asPlanned', { w: 1, f: 1, words: { ...WORDS(20, 20), headline: 'Counting how long people your age live, the money lasts as long as you do in every future we tried.', fixed: 'If you live to 97, the money lasts that long in every future we tried.' }, shortfall: lasts });
    const held = (f) => (key) => ({ asPlanned: planned(key), asHeld: row(key, 'asHeld', { w: f, f, words: WORDS(Math.round(f * 20), Math.round(f * 20)), shortfall: { when: { typical: 71, worst: 71, worstLasts: false, count: 1000, n: 1000, to: 97 }, howLong: null, howMuch: null } }) });
    const { root } = draw(withRows(plan, held(0)));
    const gap = panelOf(root).querySelector('[data-testid="plan.lasts.stress.asHeld.gap"]');
    // (no year or age of its own: the row's figures say when it runs out)
    expect(gap.textContent).toMatch(/^What you hold for the plan leaves £[\d,]+ of the income it pays not covered at today’s prices\.$/);
    expect(gap.closest('li').getAttribute('data-row')).toBe('asHeld');
    // As held lasting as often as As planned: nothing to explain
    expect(panelOf(draw(withRows(plan, held(1))).root).querySelector('[data-testid="plan.lasts.stress.asHeld.gap"]')).toBe(null);
  });
  it('the held rows: the keep agreement\'s state and "Accept or withdraw this on What you hold", never an accept of their own', () => {
    const plan = plan0('04-buckets-running');
    plan.holdings.lines.push(single);
    const s = withRows(plan, (key) => ({ ...MARKET(key), asHeld: row(key, 'asHeld', { w: 0.85, f: 0.8 }), heldHalf: row(key, 'heldHalf', { w: 0.8, f: 0.75, words: WORDS(16, 15) }), heldNothing: row(key, 'heldNothing', { w: 0.7, f: 0.6, words: WORDS(14, 12) }) }));
    const { root } = draw(s);
    // the keep agreement's state said once, on "As you hold it", as information (never the boxed notice), in the panel's
    // words — never "not yet tested", the row above is that test — and the one thing What you hold can do now
    const k = panelOf(root).querySelector('[data-testid="plan.lasts.stress.asHeld.keep"]');
    expect(k.getAttribute('data-status')).toBe('untested');
    expect(k.className).toBe('note');
    expect(k.textContent).toBe(STRESS.held.untested);
    // the link stands on its own line, so a phone's tap target never stretches the sentence above it
    const hold = panelOf(root).querySelector('[data-testid="plan.lasts.stress.asHeld.hold"]');
    expect(hold.textContent).toBe(STRESS.held.accept);
    expect(hold.parentElement.tagName).toBe('P');
    expect(hold.parentElement.textContent).toBe(STRESS.held.accept);
    // (a pot plan has no years to read: no gap line)
    expect(panelOf(root).querySelector('[data-testid="plan.lasts.stress.asHeld.gap"]')).toBe(null);
    for (const id of ['asHeld', 'heldHalf', 'heldNothing']) {
      const r = panelOf(root).querySelector(`[data-row="${id}"]`);
      if (id !== 'asHeld') expect(r.querySelector(`[data-testid="plan.lasts.stress.${id}.keep"]`)).toBe(null);
      expect(r.textContent).not.toContain('not yet tested against your plan');
      expect(r.querySelector('.notice')).toBe(null);
      expect(r.querySelector(`[data-testid="plan.lasts.stress.${id}.accept"]`)).toBe(null);
    }
    const half = panelOf(root).querySelector('[data-row="heldHalf"]');
    expect(half.querySelector('[data-weighted]').textContent).toContain('(as\u00a0held ');
    // where it runs out is As held's own: said once, "the same as held"
    expect(half.querySelector('[data-line="runsOut"]').textContent).toBe('Where it runs out: typically at 88, the worst 1 in 10 by 84 (both the same as\u00a0held).');
    const nothing = panelOf(root).querySelector('[data-row="heldNothing"]');
    expect(nothing.querySelector('.stress-title').textContent).toMatch(/^A holding we cannot match goes to nothing/);
    expect(nothing.textContent).toContain('Example Shares plc matches no fund we know, so it may be one company’s shares. Here it is worth nothing.');
    expect(ruleProblems(root)).toEqual([]);
  });
});

describe('the words: classic and V7 say the same', () => {
  it('the pure filler and the screen fill every part the same way', () => {
    const plan = plan0('02-pnv-draft');
    const s = withRows(plan, MARKET);
    const v = s.plans.view.page.lasts.stressPanel;
    const { root } = draw(s);
    for (const r of v.rows) {
      const el = panelOf(root).querySelector(`[data-row="${r.id}"]`);
      const p = r.parts;
      for (const l of [p.chance && p.chance.weighted, p.chance && p.chance.fixed, p.runsOut, ...p.more].filter(Boolean)) expect(el.textContent).toContain(sayStress(l, STRESS));
    }
  });
});

describe('the keep test folds into the bad years: information, never a to-do (replan §3, §6.4)', () => {
  const kept = () => {
    const raw = JSON.parse(JSON.stringify(C['20-locked-start-after-stop']));
    raw.holdings.lines.push({ asOf: '2026-09-01', contribution: null, kind: null, name: 'Example Shares plc', ocf: null, sedol: null, subClass: null, ticker: 'EXMPL', units: 100, value: 15000, wrapper: 'SIPP', keep: { as: 'mine', fundsGaps: true } });
    raw.id = 'SamKeeps20';
    return entryOf(raw).plan;
  };
  it('What you hold says where the keep agreement stands and links to the bad years; the home shows its line but never a to-do for it', () => {
    const plan = kept();
    const hold = draw(stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/hold'));
    expect(hold.root.querySelector('[data-testid="plan.hold.keepTest.line"]').getAttribute('data-status')).toBe('untested');
    const link = hold.root.querySelector('[data-testid="plan.hold.keepTest.badYears"]');
    expect(link.textContent).toBe(STRESS.keepLink);
    expect(link.getAttribute('href')).toBe('#/plan/SamKeeps20/lasts?focus=stress');
    const s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id);
    const home = draw(s);
    expect(home.root.querySelector('[data-testid="plan.home.keepTest.line"]').getAttribute('data-status')).toBe('untested');
    expect(home.root.querySelector('[data-todo="hold.keepTest"]')).toBe(null);
    expect(s.plans.view.page.due.map((d) => d.pid)).not.toContain('P.keepTest');
    expect(s.plans.view.page.home.todo.items.map((x) => x.id)).not.toContain('hold.keepTest');
    // the link lands on "Does it last?" with the panel named
    const lasts = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/lasts?focus=stress');
    expect(lasts.route).toMatchObject({ screen: 'plan', step: 'lasts', focus: 'stress' });
    expect(draw(lasts).root.querySelector('[data-testid="plan.lasts.stress"] h2')).toBeTruthy();
  });
  it('the keep confirm\'s second button says "Go back"', async () => {
    const { KEEPTEST } = await import('../../../src/v7/copy/keepTest.js');
    expect(KEEPTEST.acceptNo).toBe('Go back');
  });
});

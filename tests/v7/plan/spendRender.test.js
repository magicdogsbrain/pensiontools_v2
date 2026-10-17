/**
 * S2 (research/v7/editing-in-v7.md 8.5): the "What you spend" page drawn from states. Every unlocked corpus plan at three
 * dates: the first row with its saved value and source, the before-tax figure under every amount, the later steps and the
 * one-off costs as cards with real labels, the "then" box, Add, Remove and Suggest, the picture with one bar a year, the
 * budget guide, the derived lines, Save and Cancel, no banned word (the retired rules on retired stages, the saver rules on
 * saving ones), no countdown. A locked plan: no box, "Fixed when…" once, the unlock sentence once. A plan shown as saved:
 * no box. A plan not found. The toast with Undo. The plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { SPEND_LISTS } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { savedSpend, suggestion } from '../../../src/answers/plan/spend.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { ADVICE_SHORT } from '../../../src/v7/copy/common.js';
import { corpus, entriesAt, entryOf, household, stateWith, DATES, TODAY } from './_plans.js';

const C = corpus();
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root), words: wordsOf(root) };
}
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const scopesOf = (stageKey) => ['all', 'record', ...(RETIRED_STAGES.includes(stageKey) ? ['retired'] : []), ...(SAVER_STAGES.includes(stageKey) ? ['saver'] : [])];
/** A state on the spend step, with what was typed (plan/edit) and the reading refreshed as the plan source would. */
function spendState(entries, id, { today = TODAY, typed = {}, touched = [], asked = false, source = 'account', session = 'in', ui = {}, open = [] } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/spend', { today, source, session, open });
  for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
  for (const path of touched) s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path });
  if (asked) s = reduce(s, { type: A.PLAN_SAVE, planId: id });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  if (asked) s = { ...s, ui: { ...s.ui, saving: null } };
  return { ...s, ui: { ...s.ui, ...ui } };
}
const LUMPY = C['12-lumpy-db-gia'];
const money = (n) => '£' + Math.round(n).toLocaleString('en-GB');

describe('every corpus plan at three dates: the first row, the cards, the picture, the sources, the words', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        const state = spendState(entries, e.plan.id, { today });
        const { root, text, words } = draw(state);
        const pg = planPage(entries, e.plan.id, 'spend', { today });
        const saved = savedSpend(e.plan, { today });
        expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.spend');
        expect(root.querySelector('h1').textContent).toBe('What you spend');
        const locked = !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked);
        const region = root.querySelector('[data-region="plan-spend"]');
        if (!region) problems.push(`${e.plan.id}: no region`);
        else if (locked) {
          if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box on a locked plan`);
          if ((text.match(/Fixed when you locked the plan on /g) || []).length !== 1) problems.push(`${e.plan.id}: "Fixed when" not once`);
          if (root.querySelectorAll('[data-testid="plan.unlock"]').length !== 1) problems.push(`${e.plan.id}: the unlock sentence not once`);
          if (root.querySelector('[data-testid="plan.spend.save"]')) problems.push(`${e.plan.id}: Save on a locked plan`);
          if (!root.querySelector('[data-line="spend.first.level"], [data-line="spend.first.falls"], [data-line="spend.first.glides"]')) problems.push(`${e.plan.id}: no first line`);
          if (!root.querySelector('[data-testid="plan.spend.shape.chart"]')) problems.push(`${e.plan.id}: no picture`);
        } else {
          // the first row: a label, the saved value and its source, the before-tax figure under it, its "then" box
          if (!root.querySelector('label[for="plan.spend.first.amount"]')) problems.push(`${e.plan.id}: no label for the first amount`);
          const src = root.querySelector('[data-saved-for="first.amount"]');
          if (!src || !/From your plan|As saved in the plan/.test(src.textContent)) problems.push(`${e.plan.id}: no source beside the first amount`);
          if (!root.querySelector('#plan\\.spend\\.first\\.amount\\.help') || !/a year before tax, as the plan saves it/.test(root.querySelector('#plan\\.spend\\.first\\.amount\\.help').textContent)) problems.push(`${e.plan.id}: no before-tax figure under the first amount`);
          if (!root.querySelector('[id="plan.spend.first.then"]')) problems.push(`${e.plan.id}: no "then" box on the first row`);
          if (!root.querySelector('[data-testid="plan.spend.first.legend"]')) problems.push(`${e.plan.id}: no legend on the first row`);
          // every card: a legend, a label for each box, the saved value beside each, Remove; every list: Add; the steps: Suggest
          for (const [L, spec] of Object.entries(SPEND_LISTS)) {
            if (!root.querySelector(`[data-testid="plan.spend.${L}.add"]`)) problems.push(`${e.plan.id}: no Add for ${L}`);
            const cards = root.querySelectorAll(`[data-card^="${L}."]`);
            if (cards.length !== saved[L].length) problems.push(`${e.plan.id}: ${cards.length} ${L} cards for ${saved[L].length} saved`);
            for (const card of cards) {
              if (!card.querySelector('legend')) problems.push(`${e.plan.id}: a ${L} card without a legend`);
              const id = card.getAttribute('data-card').split('.')[1];
              for (const f of spec.fields) {
                const path = `${L}.${id}.${f.path}`;
                if (f.path === 'then' || f.path === 'fallsPct') { if (f.path === 'then' && !card.querySelector(`[id="plan.spend.${path}"]`)) problems.push(`${e.plan.id}: no "then" on ${path}`); continue; }
                if (f.type === 'choice' ? !card.querySelector(`[data-field="${path}"] legend`) : !card.querySelector(`label[for="plan.spend.${path}"]`)) problems.push(`${e.plan.id}: no label for ${path}`);
                const savedCard = saved[L].find((c) => c.id === id);
                if (savedCard && savedCard[f.path] != null && savedCard[f.path] !== '' && !card.querySelector(`[data-saved-for="${path}"]`)) problems.push(`${e.plan.id}: no saved value beside ${path}`);
              }
              if (!card.querySelector(`[data-testid="plan.spend.${L}.remove.${id}"]`)) problems.push(`${e.plan.id}: no Remove on ${L}.${id}`);
              if (L === 'steps' && !/a year before tax, as the plan saves it/.test(card.textContent)) problems.push(`${e.plan.id}: no before-tax figure on ${L}.${id}`);
            }
          }
          if (!root.querySelector('[data-testid="plan.spend.steps.suggest"]')) problems.push(`${e.plan.id}: no Suggest`);
          if (!root.querySelector('[data-testid="plan.spend.save"]') || !root.querySelector('[data-testid="plan.spend.cancel"]')) problems.push(`${e.plan.id}: Save or Cancel missing`);
          if (root.querySelector('.error')) problems.push(`${e.plan.id}: a problem shown before anything was touched`);
          // the picture: one bar a year from the start
          const bars = root.querySelectorAll('[data-testid="plan.spend.shape.chart"] g.year');
          if (bars.length !== saved.duration) problems.push(`${e.plan.id}: ${bars.length} bars for ${saved.duration} years`);
          if (bars.length && bars[0].getAttribute('data-age') !== String(saved.ageNow)) problems.push(`${e.plan.id}: the first bar is not the start age`);
          // the budget guide: a guide only, with the planner's button
          if (!root.querySelector('[data-section="budget"]')) problems.push(`${e.plan.id}: no budget guide`);
          if (!root.querySelector('[data-testid="plan.spend.budget.change"]')) problems.push(`${e.plan.id}: no budget button`);
        }
        if (!text.includes(ADVICE_SHORT)) problems.push(`${e.plan.id}: no ADVICE_SHORT`);
        if (COUNTDOWN.test(words)) problems.push(`${e.plan.id}: a countdown: ${COUNTDOWN.exec(words)[0]}`);
        for (const hit of bannedHits(words, scopesOf(pg.stageKey))) problems.push(`${e.plan.id} [${pg.stageKey}]: ${hit}`);
        if (/undefined|NaN|\[object|\{\w+\}/.test(words)) problems.push(`${e.plan.id}: junk`);
        const rail = root.querySelector('[data-region="rail"]');
        if (!rail) problems.push(`${e.plan.id}: no rail`);
        else if (!rail.querySelector('[data-testid="rail.next"] [data-next]').textContent.trim()) problems.push(`${e.plan.id}: empty next sentence`);
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('the lumpy plan (12): what the page says, and what typing does', () => {
  const entries = entriesAt(TODAY);
  const id = LUMPY.id;
  const s = savedSpend(entryOf(LUMPY).plan, { today: TODAY });
  it('the first row, two later steps (the first moving evenly), two one-off costs, each with its saved value and before-tax figure; the derived lines; the budget not worked out', () => {
    const { root, text } = draw(spendState(entries, id));
    expect(root.querySelector('[data-testid="plan.spend.first.legend"]').textContent).toBe('From age 60, the plan’s first year');
    expect(root.querySelector('[data-testid="plan.spend.first.amount"]').value).toBe(String(s.first.monthly));
    expect(root.querySelector('[data-saved-for="first.amount"]').textContent).toBe(`From your plan, saved 11 September 2026 (${s.first.monthly})`);
    expect(root.querySelector('#plan\\.spend\\.first\\.amount\\.help').textContent).toBe('£48,000 a year before tax, as the plan saves it.');
    expect(root.querySelector('[id="plan.spend.first.then"]').value).toBe('level');
    expect(root.querySelector('[data-testid="plan.spend.steps.0.fromAge"]').value).toBe('66');
    expect(root.querySelector('[data-testid="plan.spend.steps.0.amount"]').value).toBe(String(s.steps[0].monthly));
    expect(root.querySelector('[id="plan.spend.steps.0.then"]').value).toBe('glides');
    expect(root.querySelector('[id="plan.spend.steps.1.then"]').value).toBe('level');
    expect([...root.querySelector('[id="plan.spend.steps.1.then"]').options].map((o) => o.value)).toEqual(['level', 'falls']);   // the last step cannot move evenly
    expect(root.querySelector('#plan\\.spend\\.steps\\.0\\.amount\\.help').textContent).toContain('£42,000 a year before tax, as the plan saves it.');
    expect(root.querySelector('#plan\\.spend\\.steps\\.0\\.amount\\.help').textContent).toContain('% of the start.');
    expect(root.querySelector('[data-saved-for="steps.0.fromAge"]').textContent).toBe('From your plan, saved 11 September 2026 (66)');
    expect(root.querySelector('[data-testid="plan.spend.costs.0.label"]').value).toBe('New roof');
    expect(root.querySelector('[data-testid="plan.spend.costs.0.amount"]').value).toBe(String(s.costs[0].amount));
    expect(root.querySelector('#plan\\.spend\\.costs\\.0\\.amount\\.help').textContent).toBe('£25,000 a year before tax on top of that year’s figure, as the plan saves it.');
    expect(root.querySelector('[data-testid="plan.spend.costs.1.years"]').value).toBe('3');
    expect(root.querySelector('[data-testid="plan.spend.costs.1.prices.rise"]').checked).toBe(true);
    expect(root.querySelector('[data-card="costs.0"] legend').textContent).toBe('One-off cost 1');
    expect(text).toContain(`From age 60: ${money(s.first.monthly)} a month after tax (£48,000 a year before tax).`);
    expect(text).toContain(`From age 66: ${money(s.steps[0].monthly)} a month after tax (£42,000 a year before tax), moving evenly to ${money(s.steps[1].monthly)} at 76.`);
    expect(text).toContain(`New roof: ${money(s.costs[0].amount)} after tax at age 62 (tax year 2029/30), once — £25,000 before tax on top of that year’s figure, going up with prices.`);
    expect(text).toContain(`Camper van: ${money(s.costs[1].amount)} a year after tax from age 66 (tax year 2033/34) for 3 years — £36,000 a year before tax on top of each year’s figure, going up with prices.`);
    expect(root.querySelector('[data-testid="plan.spend.budget.none"]').textContent).toContain('Your budget is not worked out, so you are choosing by one figure.');
    expect(root.querySelector('[data-testid="plan.spend.budget.change"]').textContent).toBe('Work it out (in the planner)');
    expect(root.querySelector('[data-testid="plan.spend.budget.use"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.spend.shape.chart"] .shape-chart-title').textContent).toBe('What the plan pays each year, after tax, at today’s prices');
    expect(root.querySelector('[data-testid="plan.spend.steps.suggestWords"]').textContent).toContain('Fills in 15% less from 75 and 30% less from 85');
  });
  it('typing dispatches plan/edit with the text as typed; the "then" box too; Add appends a new card id; Remove drops one; Suggest dispatches the planner\'s own steps; Save dispatches plan/save; the budget button leaves for the planner', () => {
    const { root, actions } = draw(spendState(entries, id));
    const box = root.querySelector('[data-testid="plan.spend.first.amount"]');
    box.value = '3000';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'first.amount', value: '3000' });
    box.dispatchEvent(new Event('blur'));
    expect(actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'first.amount' });
    const then = root.querySelector('[id="plan.spend.steps.1.then"]');
    then.value = 'falls';
    then.dispatchEvent(new Event('change', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'steps.1.then', value: 'falls' });
    root.querySelector('[data-testid="plan.spend.steps.add"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'steps.ids', value: '0,1,n1' });
    root.querySelector('[data-testid="plan.spend.costs.remove.0"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'costs.ids', value: '1' });
    root.querySelector('[data-testid="plan.spend.steps.suggest"]').click();
    const sug = suggestion(48000, s).edits.map((e) => ({ type: 'plan/edit', planId: id, path: e.path, value: e.value }));
    expect(actions.slice(-sug.length)).toEqual(sug);
    root.querySelector('form.spend-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.pop()).toEqual({ type: 'plan/save', planId: id });
    root.querySelector('[data-testid="plan.spend.cancel"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: id });
    root.querySelector('[data-testid="plan.spend.budget.change"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/change', planId: id, place: 'budget', back: '#/plan/' + id + '/spend' });
  });
  it('a new step card is drawn empty with no saved value; a fall shows its box; the derived lines and the picture follow what is typed; problems show once a box is left or Save is pressed', () => {
    const added = draw(spendState(entries, id, { typed: { 'steps.ids': '0,1,n1', 'steps.n1.fromAge': '85', 'steps.n1.amount': '1,500', 'steps.n1.then': 'falls', 'steps.n1.fallsPct': '2' } }));
    const card = added.root.querySelector('[data-card="steps.n1"]');
    expect(card.getAttribute('data-new')).toBe('1');
    expect(card.querySelector('legend').textContent).toBe('Step 3');
    expect(card.querySelector('[data-saved-for="steps.n1.amount"]')).toBe(null);
    expect(card.querySelector('[data-testid="plan.spend.steps.n1.fallsPct"]').value).toBe('2');
    expect(added.text).toMatch(/From age 85: £1,500 a month after tax \(£[\d,]+ a year before tax\), falling 2% a year to £[\d,]+ at 91\./);
    // at 85 the State Pension and the final-salary pension pay more than £1,500 a month: the bar is what they pay (T12), and a line says so
    expect(+added.root.querySelector('[data-testid="plan.spend.shape.chart"] g.year[data-age="85"]').getAttribute('data-figure')).toBeGreaterThan(1500);
    expect(added.root.querySelector('[data-line="spend.floor.from"]').textContent).toMatch(/^From age \d+ your State Pension and other pensions pay more than this \(£[\d,]+ a month after tax\): the plan pays that, and nothing is taken from your pension or savings\.$/);
    expect(+added.root.querySelector('[data-testid="plan.spend.shape.chart"] g.year[data-age="84"]').getAttribute('data-figure')).toBeGreaterThan(1696);
    const left = draw(spendState(entries, id, { typed: { 'steps.0.fromAge': '60', 'costs.0.atAge': '59' }, touched: ['costs.0.atAge'] }));
    expect(left.root.querySelector('[data-error-for="plan.spend.costs.0.atAge"]').textContent).toBe('The plan’s first year is at age 60. An age of 60 or more, please.');
    expect(left.root.querySelector('[data-error-for="plan.spend.steps.0.fromAge"]')).toBe(null);
    const asked = draw(spendState(entries, id, { typed: { 'steps.0.fromAge': '60', 'steps.1.then': 'glides' }, asked: true }));
    expect(asked.root.querySelector('[data-error-for="plan.spend.steps.0.fromAge"]').textContent).toBe('This is not later than the plan’s first year, at 60. Make it later, or change the figure above instead.');
    expect(asked.root.querySelector('[data-error-for="plan.spend.steps.1.then"]').textContent).toBe('There is no later step to move towards. Add one, or choose another.');
    // the first row's own fall
    const falls = draw(spendState(entries, id, { typed: { 'first.then': 'falls', 'first.fallsPct': '1' } }));
    expect(falls.root.querySelector('[data-testid="plan.spend.first.fallsPct"]').value).toBe('1');
    expect(falls.text).toMatch(/From age 60: £[\d,]+ a month after tax \(£48,000 a year before tax\), falling 1% a year to £[\d,]+ at 65\./);
  });
  it('the budget worked out: the totals with their source, the guide line, "Use" fills the first row, the essentials dashed on the picture and the below line', () => {
    const plan = JSON.parse(JSON.stringify(entryOf(LUMPY).plan));
    plan.budgetTool.settings.lines = [{ label: 'Home', amount: 500 }];
    plan.budgetTool.settings.derived = { ...plan.budgetTool.settings.derived, allInComfortableMonthly: 2264, essentialMonthlyNet: 1610, essentialAnnualNet: 19320 };
    const es = entries.map((e) => (e.plan.id === id ? { ...e, plan } : e));
    const { root, actions } = draw(spendState(es, id));
    expect(root.querySelector('[data-testid="plan.spend.budget.total"]').textContent).toBe('All in: £2,264 a month after tax; essentials £1,610. From your budget (a guide), saved 11 September 2026.');
    expect(root.querySelector('[data-testid="plan.spend.budget.guide"]').textContent).toBe('A guide only: the plan uses the figures in the boxes below, never the budget. Working it out line by line is the better way to choose them.');
    root.querySelector('[data-testid="plan.spend.budget.use"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'first.amount', value: '2264' });
    expect(root.querySelector('[data-testid="plan.spend.shape.chart.essentials"]')).not.toBe(null);
    const low = draw(spendState(es, id, { typed: { 'first.amount': '1500' } }));
    expect(low.root.querySelector('[data-testid="plan.spend.below"]').textContent).toBe('From 60 this is less than your budget’s essentials (£1,610 a month). That is allowed: it is your figure.');
  });
  it('the toast after a save, with Undo; "Saving…" while a write is under way; a problem from the write in plain words', () => {
    const line = { id: 'spend', slots: { age: 60, monthly: '£3,000', steps: 2, costs: 1 } };
    const saved = draw(spendState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.baseSalary': 48000 }, line } } }));
    const toast = saved.root.querySelector('[data-testid="plan.spend.toast"]');
    expect(toast.textContent).toContain('Saved. From age 60: £3,000 a month after tax. Later steps: 2. One-off costs: 1.');
    expect(toast.getAttribute('role')).toBe('status');
    toast.querySelector('[data-testid="plan.spend.undo"]').click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const undone = draw(spendState(entries, id, { ui: { toast: { planId: id, kind: 'undone', previous: null, line: null } } }));
    expect(undone.root.querySelector('[data-testid="plan.spend.toast"]').textContent).toContain('Put back as it was.');
    const saving = draw(spendState(entries, id, { ui: { saving: { planId: id, kind: 'save' } } }));
    expect(saving.root.querySelector('[data-testid="plan.spend.save"]').textContent).toBe('Saving…');
    for (const [problem, words] of [['locked', 'This plan is locked, so nothing was changed.'], ['usedUp', 'Your free time without an account is used up.'], ['problems', 'Have a look at the boxes marked above.']]) {
      const p = draw(spendState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      expect(p.root.querySelector('[data-testid="plan.spend.problem"]').textContent).toContain(words);
    }
  });
  it('the plan page: "What the plan pays" links here with "Change this here"', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const section = root.querySelector('[data-section="pays"]');
    expect(section.querySelector('h3').textContent).toBe('What the plan pays');
    expect(section.textContent).toContain('£48,000 a year before tax');
    expect(root.querySelector('[data-testid="plan.plan.edit.pays"]').getAttribute('href')).toBe('#/plan/' + id + '/spend');
    expect(root.querySelector('[data-testid="plan.plan.edit.pays"]').textContent).toBe('Change this here');
    expect(root.querySelector('[data-testid="plan.plan.change.pays"]')).toBe(null);
    expect(text).not.toMatch(/undefined|NaN/);
  });
});

describe('the locked ladder, a plan shown as saved, the household pair, a plan not found', () => {
  const entries = entriesAt(TODAY);
  it('03 locked: the figures and the picture, "Fixed when you locked the plan on 1 July 2026." once, the unlock sentence once, the budget guide still there, "See these" on the plan page, no box', () => {
    const { root, text } = draw(spendState(entries, C['03-gilt-ladder-runup'].id));
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(text).toMatch(/From age 58: £[\d,]+ a month after tax \(£52,000 a year before tax\)\./);
    expect(text).toMatch(/From age 78: £[\d,]+ a month after tax \(£36,000 a year before tax\), falling 1% a year to £[\d,]+ at 90\./);
    expect(root.querySelector('[data-testid="plan.spend.shape.chart"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.spend.budget.change"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.spend.budget.use"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.spend.back"]').getAttribute('href')).toBe('#/plan/' + C['03-gilt-ladder-runup'].id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + C['03-gilt-ladder-runup'].id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.edit.pays"]').textContent).toBe('See these');
  });
  it('a plan shown as saved: no box, the sentence', () => {
    const newer = entries.map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    const { root, text } = draw(spendState(newer, LUMPY.id));
    expect(root.querySelector('input')).toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
  });
  it('the household pair: each page names the other\'s plan for their spending, with a link to it', () => {
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    const { root } = draw(spendState(es, saver.id));
    const partner = root.querySelector('[data-testid="plan.spend.partner"]');
    expect(partner.textContent).toContain('Ladder plan’s spending is on Ladder plan’s plan.');
    expect(partner.querySelector('a').getAttribute('href')).toBe('#/plan/HouseLadder01/spend');
    expect(draw(spendState(es, ladder.id)).root.querySelector('[data-testid="plan.spend.partner"] a').getAttribute('href')).toBe('#/plan/HouseSaver02/spend');
  });
  it('a plan not in the account, and the window warning without an account', () => {
    const unknown = draw(spendState(entries, 'NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(draw(stateWith(null, '#/plan/abc/spend', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const win = draw(spendState(entries.slice(11, 12), entries[11].plan.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.spend.save"]')).not.toBe(null);
  });
});

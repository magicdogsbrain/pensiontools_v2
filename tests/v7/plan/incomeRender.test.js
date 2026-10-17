/**
 * I2 (research/v7/editing-in-v7.md 7.5): the "Money that comes in anyway" page drawn from states. Every unlocked corpus
 * plan at three dates: the State Pension choice with the saved value and its source, the cards with real labels and the
 * saved value beside each box, Add and Remove, the derived lines, Save and Cancel, no banned word (the retired rules on
 * retired stages, the saver rules on saving ones), no countdown. A locked plan: no box, "Fixed when…" once, the unlock
 * sentence once. A plan shown as saved: no box. A plan not found. The toast with Undo. The plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { INCOME_FIELDS, INCOME_LISTS } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { savedIncome } from '../../../src/answers/plan/income.js';
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
/** A state on the income step, with what was typed (plan/edit) and the reading refreshed as the plan source would. */
function incomeState(entries, id, { today = TODAY, typed = {}, touched = [], asked = false, source = 'account', session = 'in', ui = {} } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/income', { today, source, session });
  for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
  for (const path of touched) s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path });
  if (asked) s = reduce(s, { type: A.PLAN_SAVE, planId: id });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  if (asked) s = { ...s, ui: { ...s.ui, saving: null } };
  return { ...s, ui: { ...s.ui, ...ui } };
}
const LUMPY = C['12-lumpy-db-gia'];

describe('every corpus plan at three dates: the boxes, the cards, the sources, the derived lines, the words', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        const state = incomeState(entries, e.plan.id, { today });
        const { root, text, words } = draw(state);
        const pg = planPage(entries, e.plan.id, 'income', { today });
        const saved = savedIncome(e.plan, { today });
        expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.income');
        expect(root.querySelector('h1').textContent).toBe('Money that comes in anyway');
        const locked = !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked);
        const region = root.querySelector('[data-region="plan-income"]');
        if (!region) problems.push(`${e.plan.id}: no region`);
        else if (locked) {
          if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box on a locked plan`);
          if ((text.match(/Fixed when you locked the plan on /g) || []).length !== 1) problems.push(`${e.plan.id}: "Fixed when" not once`);
          if (root.querySelectorAll('[data-testid="plan.unlock"]').length !== 1) problems.push(`${e.plan.id}: the unlock sentence not once`);
          if (root.querySelector('[data-testid="plan.income.save"]')) problems.push(`${e.plan.id}: Save on a locked plan`);
          if (!root.querySelector('[data-line^="income.sp."]')) problems.push(`${e.plan.id}: no State Pension line`);
        } else {
          // the single boxes: a real label or legend; the saved value and its source beside the State Pension choice
          for (const f of INCOME_FIELDS) {
            const el = root.querySelector(`[data-field="${f.path}"]`);
            const applies = f.path !== 'spWeekly' || saved.sp.kind === 'forecast';
            if (applies && !el) problems.push(`${e.plan.id}: no field ${f.path}`);
            if (el && f.type !== 'choice' && !root.querySelector(`label[for="plan.income.${f.path}"]`)) problems.push(`${e.plan.id}: no label for ${f.path}`);
            if (el && f.type === 'choice' && !el.querySelector('legend')) problems.push(`${e.plan.id}: no legend for ${f.path}`);
          }
          const spSource = root.querySelector('[data-saved-for="spKind"]');
          if (!spSource || !/From your plan|As saved in the plan/.test(spSource.textContent)) problems.push(`${e.plan.id}: no source beside the State Pension`);
          // every card: a legend, a label for each box, the saved value beside each, Remove; every list: Add
          for (const [L, spec] of Object.entries(INCOME_LISTS)) {
            if (!root.querySelector(`[data-testid="plan.income.${L}.add"]`)) problems.push(`${e.plan.id}: no Add for ${L}`);
            const cards = root.querySelectorAll(`[data-card^="${L}."]`);
            if (cards.length !== saved[L].length) problems.push(`${e.plan.id}: ${cards.length} ${L} cards for ${saved[L].length} saved`);
            for (const card of cards) {
              if (!card.querySelector('legend')) problems.push(`${e.plan.id}: a ${L} card without a legend`);
              const id = card.getAttribute('data-card').split('.')[1];
              for (const f of spec.fields) {
                const path = `${L}.${id}.${f.path}`;
                if (f.type === 'choice' ? !card.querySelector(`[data-field="${path}"] legend`) : !card.querySelector(`label[for="plan.income.${path}"]`)) problems.push(`${e.plan.id}: no label for ${path}`);
                const savedCard = saved[L].find((c) => c.id === id);
                if (savedCard && savedCard[f.path] != null && savedCard[f.path] !== '' && !card.querySelector(`[data-saved-for="${path}"]`)) problems.push(`${e.plan.id}: no saved value beside ${path}`);
              }
              if (!card.querySelector(`[data-testid="plan.income.${L}.remove.${id}"]`)) problems.push(`${e.plan.id}: no Remove on ${L}.${id}`);
            }
          }
          if (!root.querySelector('[data-testid="plan.income.save"]') || !root.querySelector('[data-testid="plan.income.cancel"]')) problems.push(`${e.plan.id}: Save or Cancel missing`);
          if (!root.querySelector('[data-line^="income.sp."]')) problems.push(`${e.plan.id}: no State Pension line`);
          if (root.querySelector('.error')) problems.push(`${e.plan.id}: a problem shown before anything was touched`);
          // a plan with no State Pension figure says what the planner assumes, in its own words, and offers to leave it
          if (saved.sp.kind === 'assumed') {
            if (!root.querySelector('[data-testid="plan.income.assumed"]')) problems.push(`${e.plan.id}: no assumed note`);
            if (!root.querySelector('[data-testid="plan.income.spKind.assumed"]')) problems.push(`${e.plan.id}: no "leave it" choice`);
          } else if (root.querySelector('[data-testid="plan.income.spKind.assumed"]')) problems.push(`${e.plan.id}: "leave it" offered on a plan with a figure`);
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
  it('the State Pension forecast, the final-salary card, other income, two incomes for some years, two lump sums, each with its saved value; the derived lines', () => {
    const { root, text } = draw(incomeState(entries, id));
    expect(root.querySelector('[data-testid="plan.income.spKind.forecast"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.income.spWeekly"]').value).toBe('224.9');
    expect(root.querySelector('[data-saved-for="spKind"]').textContent).toBe('From your plan, saved 11 September 2026 (My forecast, £224.90 a week)');
    expect(root.querySelector('label[for="plan.income.spKind.full"]').textContent).toBe('The full amount, £12,548 a year');
    expect(root.querySelector('[data-testid="plan.income.fs.0.amount"]').value).toBe('9400');
    expect(root.querySelector('[data-testid="plan.income.fs.0.fromAge"]').value).toBe('65');
    expect(root.querySelector('[data-testid="plan.income.fs.0.rises.lpi5"]').checked).toBe(true);
    expect(root.querySelector('[data-saved-for="fs.0.fromAge"]').textContent).toBe('From your plan, saved 11 September 2026 (65)');
    expect(root.querySelector('[data-testid="plan.income.other"]').value).toBe('1200');
    expect(root.querySelector('[data-testid="plan.income.streams.0.label"]').value).toBe('Rental flat');
    expect(root.querySelector('[data-testid="plan.income.streams.0.toAge"]').value).toBe('74');
    expect(root.querySelector('[data-testid="plan.income.lumps.1.atAge"]').value).toBe('69');
    expect(root.querySelector('[data-testid="plan.income.lumps.0.wrapper.pension"]').checked).toBe(true);
    expect(root.querySelector('[data-card="fs.0"] legend').textContent).toBe('Final-salary pension 1');
    expect(text).toContain('State Pension: £11,695 a year before tax from age 67 (tax year 2034/35).');
    expect(text).toContain('Final-salary pension 1: £9,400 a year before tax from age 65 (tax year 2032/33), going up with prices, capped at 5% a year.');
    expect(text).toContain('Other income: £1,200 a year before tax from the plan’s first year on, going up with prices capped at 4% a year.');
    expect(text).toContain('Rental flat: £7,200 a year before tax from age 60 to age 74 (15 years), going up with prices.');
    expect(text).toContain('Part-time consulting: £12,000 a year before tax from age 60 to age 63 (4 years), not going up.');
    expect(text).toContain('Inherited pension: £120,000 at age 64 (tax year 2031/32), an inherited pension.');
    expect(text).toContain('Downsizing: £90,000 at age 69 (tax year 2036/37), a cash lump sum.');
    expect(text).not.toContain('Move into drawdown');
  });
  it('typing dispatches plan/edit with the text as typed; Add appends a new card id; Remove drops one; Save dispatches plan/save and focuses the first problem', () => {
    const { root, actions } = draw(incomeState(entries, id));
    const box = root.querySelector('[data-testid="plan.income.fs.0.fromAge"]');
    box.value = '66';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'fs.0.fromAge', value: '66' });
    box.dispatchEvent(new Event('blur'));
    expect(actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'fs.0.fromAge' });
    root.querySelector('[data-testid="plan.income.spKind.none"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'spKind', value: 'none' });
    root.querySelector('[data-testid="plan.income.lumps.add"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'lumps.ids', value: '0,1,n1' });
    root.querySelector('[data-testid="plan.income.streams.remove.0"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'streams.ids', value: '1' });
    root.querySelector('form.income-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.pop()).toEqual({ type: 'plan/save', planId: id });
    root.querySelector('[data-testid="plan.income.cancel"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: id });
  });
  it('a new card is drawn empty with no saved value; a second Add takes the next id; the derived lines follow what is typed; problems show once a box is left or Save is pressed', () => {
    const added = draw(incomeState(entries, id, { typed: { 'fs.ids': '0,n1', 'fs.n1.amount': '3,000', 'fs.n1.fromAge': '66' } }));
    const card = added.root.querySelector('[data-card="fs.n1"]');
    expect(card.getAttribute('data-new')).toBe('1');
    expect(card.querySelector('legend').textContent).toBe('Final-salary pension 2');
    expect(card.querySelector('[data-saved-for="fs.n1.amount"]')).toBe(null);
    expect(card.querySelector('[data-testid="plan.income.fs.n1.rises.lpi5"]').checked).toBe(true);   // the default
    expect(added.text).toContain('Final-salary pension 2: £3,000 a year before tax from age 66 (tax year 2033/34), going up with prices, capped at 5% a year.');
    added.root.querySelector('[data-testid="plan.income.fs.add"]').click();
    expect(added.actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'fs.ids', value: '0,n1,n2' });
    const none = draw(incomeState(entries, id, { typed: { spKind: 'none', 'lumps.ids': '', 'streams.ids': '' } }));
    expect(none.text).toContain('No State Pension: the plan counts none.');
    expect(none.root.querySelector('[data-testid="plan.income.lumps.none"]').textContent).toBe('No lump sum in this plan.');
    expect(none.root.querySelector('[data-testid="plan.income.spWeekly"]')).toBe(null);
    const left = draw(incomeState(entries, id, { typed: { 'lumps.1.atAge': '59', 'fs.0.fromAge': '99' }, touched: ['lumps.1.atAge'] }));
    expect(left.root.querySelector('[data-error-for="plan.income.lumps.1.atAge"]').textContent).toBe('The plan’s first year is at age 60: money arriving before then counts as part of your pots today. An age of 60 or more, please.');
    expect(left.root.querySelector('[data-error-for="plan.income.fs.0.fromAge"]')).toBe(null);
    const asked = draw(incomeState(entries, id, { typed: { 'lumps.1.atAge': '59', 'fs.0.fromAge': '99' }, asked: true }));
    expect(asked.root.querySelector('[data-error-for="plan.income.fs.0.fromAge"]').textContent).toBe('That is after the plan ends at age 91 — the pension would never pay. An age up to 91, or lengthen the plan.');
    expect(asked.root.querySelector('[data-testid="plan.income.fs.0.fromAge"]').getAttribute('aria-invalid')).toBe('true');
  });
  it('the toast after a save, with Undo; "Saving…" while a write is under way; a problem from the write in plain words', () => {
    const line = { id: 'income', slots: { sp: 'paid', yearly: '£11,695', age: 67, fs: 2, streams: 2, lumps: 1 } };
    const saved = draw(incomeState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.other': 1200 }, line } } }));
    const toast = saved.root.querySelector('[data-testid="plan.income.toast"]');
    expect(toast.textContent).toContain('Saved. State Pension: £11,695 a year from age 67. Final-salary pensions: 2. Income for some years: 2. Lump sums: 1.');
    expect(toast.getAttribute('role')).toBe('status');
    toast.querySelector('[data-testid="plan.income.undo"]').click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const none = draw(incomeState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.statePension': 12000 }, line: { id: 'income', slots: { sp: 'none', fs: 0, streams: 0, lumps: 0 } } } } }));
    expect(none.root.querySelector('[data-testid="plan.income.toast"]').textContent).toContain('Saved. State Pension: none. Final-salary pensions: 0.');
    const undone = draw(incomeState(entries, id, { ui: { toast: { planId: id, kind: 'undone', previous: null, line: null } } }));
    expect(undone.root.querySelector('[data-testid="plan.income.toast"]').textContent).toContain('Put back as it was.');
    const saving = draw(incomeState(entries, id, { ui: { saving: { planId: id, kind: 'save' } } }));
    expect(saving.root.querySelector('[data-testid="plan.income.save"]').textContent).toBe('Saving…');
    for (const [problem, words] of [['locked', 'This plan is locked, so nothing was changed.'], ['usedUp', 'Your free time without an account is used up.'], ['problems', 'Have a look at the boxes marked above.']]) {
      const p = draw(incomeState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      expect(p.root.querySelector('[data-testid="plan.income.problem"]').textContent).toContain(words);
    }
  });
  it('the plan page: "Money that comes in anyway" as its own section with "Change this here"; "Pots" keeps the planner\'s button', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const section = root.querySelector('[data-section="income"]');
    expect(section.querySelector('h3').textContent).toBe('Money that comes in anyway');
    expect(section.textContent).toContain('State Pension');
    expect(section.textContent).toContain('Final-salary pension');
    expect(section.textContent).toContain('Rental flat');
    expect(section.textContent).toContain('from age 60 to age 74');
    expect(section.textContent).toContain('Downsizing');
    expect(section.textContent).toContain('at age 69, a cash lump sum');
    expect(root.querySelector('[data-testid="plan.plan.edit.income"]').getAttribute('href')).toBe('#/plan/' + id + '/income');
    expect(root.querySelector('[data-testid="plan.plan.edit.income"]').textContent).toBe('Change this here');
    expect(root.querySelector('[data-section="pots"] h3').textContent).toBe('Pots');
    expect(root.querySelector('[data-testid="plan.plan.change.pots"]')).not.toBe(null);
    expect(text).not.toMatch(/undefined|NaN/);
  });
});

describe('a plan with no State Pension figure, the locked ladder, a plan shown as saved, the household pair, a plan not found', () => {
  const entries = entriesAt(TODAY);
  it('01 (no age, nothing entered): the planner\'s assumed figure in its own words; "Leave it as assumed" offered; choosing none works', () => {
    const { root, text } = draw(incomeState(entries, C['01-fresh-default'].id));
    expect(root.querySelector('[data-testid="plan.income.assumed"]').textContent).toBe('Nothing entered: every run assumes £12,000 a year before tax from age 67, and every figure that uses the State Pension says so. Choose the full amount, your forecast, or none.');
    expect(root.querySelector('[data-testid="plan.income.spKind.assumed"]').checked).toBe(true);
    expect(text).toContain('State Pension: nothing entered, so every run assumes £12,000 a year before tax from age 67.');
    const none = draw(incomeState(entries, C['01-fresh-default'].id, { typed: { spKind: 'none' } }));
    expect(none.text).toContain('No State Pension: the plan counts none.');
  });
  it('03 locked: the figures, "Fixed when you locked the plan on 1 July 2026." once, the unlock sentence once, "See these" on the plan page, no box', () => {
    const { root, text } = draw(incomeState(entries, C['03-gilt-ladder-runup'].id));
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(text).toContain('State Pension: £11,973 a year before tax from age 67 (tax year 2036/37).');
    expect(root.querySelector('[data-testid="plan.income.back"]').getAttribute('href')).toBe('#/plan/' + C['03-gilt-ladder-runup'].id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + C['03-gilt-ladder-runup'].id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.edit.income"]').textContent).toBe('See these');
  });
  it('a plan shown as saved: no box, the sentence', () => {
    const newer = entries.map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    const { root, text } = draw(incomeState(newer, LUMPY.id));
    expect(root.querySelector('input')).toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
  });
  it('the household pair: each page names the other\'s plan for their State Pension and pensions, with a link to it', () => {
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    const { root } = draw(incomeState(es, saver.id));
    const partner = root.querySelector('[data-testid="plan.income.partner"]');
    expect(partner.textContent).toContain('Ladder plan’s State Pension and pensions are on Ladder plan’s plan.');
    expect(partner.querySelector('a').getAttribute('href')).toBe('#/plan/HouseLadder01/income');
    expect(draw(incomeState(es, ladder.id)).root.querySelector('[data-testid="plan.income.partner"] a').getAttribute('href')).toBe('#/plan/HouseSaver02/income');
  });
  it('a plan not in the account, and the window warning without an account', () => {
    const unknown = draw(incomeState(entries, 'NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(draw(stateWith(null, '#/plan/abc/income', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const win = draw(incomeState(entries.slice(11, 12), entries[11].plan.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.income.save"]')).not.toBe(null);
  });
});

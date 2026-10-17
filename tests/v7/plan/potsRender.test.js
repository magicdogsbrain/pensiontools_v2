/**
 * T2 (research/v7/editing-in-v7.md 9.5): the "Your pots and tax" page drawn from states. Every unlocked corpus plan at
 * three dates: a box with a real label for every fact that applies, the saved value and its source beside each, the
 * "not used by this way of drawing" and the planner's own notes where they belong, the derived lines, Save and Cancel,
 * no banned word (the retired rules on retired stages, the saver rules on saving ones), no countdown. A locked plan: no
 * box, "Fixed when…" once, the unlock sentence once. A plan shown as saved: no box. A plan not found. The toast with
 * Undo. The plan page's section and link.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { POTS_FIELDS } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { potsOf, savedPots } from '../../../src/answers/plan/pots.js';
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
/** A state on the pots step, with what was typed (plan/edit) and the reading refreshed as the plan source would. */
function potsState(entries, id, { today = TODAY, typed = {}, touched = [], asked = false, source = 'account', session = 'in', ui = {} } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/pots', { today, source, session });
  for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
  for (const path of touched) s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path });
  if (asked) s = reduce(s, { type: A.PLAN_SAVE, planId: id });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  if (asked) s = { ...s, ui: { ...s.ui, saving: null } };
  return { ...s, ui: { ...s.ui, ...ui } };
}
const LUMPY = C['12-lumpy-db-gia'];
const SAVER = C['10-couple-b'];

describe('every corpus plan at three dates: the boxes, the sources, the notes, the words', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        const state = potsState(entries, e.plan.id, { today });
        const { root, text, words } = draw(state);
        const pg = planPage(entries, e.plan.id, 'pots', { today });
        const v = potsOf(entries, e.plan.id, { today });
        expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.pots');
        expect(root.querySelector('h1').textContent).toBe('Your pots and tax');
        const locked = !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked);
        const region = root.querySelector('[data-region="plan-pots"]');
        if (!region) problems.push(`${e.plan.id}: no region`);
        else if (locked) {
          if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box on a locked plan`);
          if ((text.match(/Fixed when you locked the plan on /g) || []).length !== 1) problems.push(`${e.plan.id}: "Fixed when" not once`);
          if (root.querySelectorAll('[data-testid="plan.unlock"]').length !== 1) problems.push(`${e.plan.id}: the unlock sentence not once`);
          if (root.querySelector('[data-testid="plan.pots.save"]')) problems.push(`${e.plan.id}: Save on a locked plan`);
          if (!root.querySelector('[data-line="pots.pots.today"], [data-line="pots.pots.todayTaxable"]')) problems.push(`${e.plan.id}: no pots line`);
          if (!root.querySelector('[data-line^="pots.tax.bands"]')) problems.push(`${e.plan.id}: no bands line`);
        } else {
          for (const f of POTS_FIELDS) {
            const vf = v.fields.find((x) => x.path === f.path);
            const drawn = f.type === 'choice' ? root.querySelector(`[data-field="${f.path}"] legend`) : root.querySelector(`label[for="plan.pots.${f.path}"]`);
            if (vf.applies && !drawn) problems.push(`${e.plan.id}: no label for ${f.path}`);
            if (!vf.applies && drawn) problems.push(`${e.plan.id}: ${f.path} drawn though it does not apply`);
            if (vf.applies && vf.saved !== null && !root.querySelector(`[data-saved-for="${f.path}"]`)) problems.push(`${e.plan.id}: no saved value beside ${f.path}`);
            const src = root.querySelector(`[data-saved-for="${f.path}"]`);
            if (src && !/From your plan|As saved in the plan/.test(src.textContent)) problems.push(`${e.plan.id}: no source beside ${f.path}`);
          }
          for (const path of v.notUsed) if (v.fields.find((x) => x.path === path).applies && !root.querySelector(`[data-not-used="${path}"]`)) problems.push(`${e.plan.id}: no "not used" under ${path}`);
          for (const path of Object.keys(v.useNotes)) if (!root.querySelector(`[data-use-note="${path}"]`)) problems.push(`${e.plan.id}: no note under ${path}`);
          if (!root.querySelector('[data-testid="plan.pots.save"]') || !root.querySelector('[data-testid="plan.pots.cancel"]')) problems.push(`${e.plan.id}: Save or Cancel missing`);
          if (root.querySelector('.error')) problems.push(`${e.plan.id}: a problem shown before anything was touched`);
          if (!root.querySelector('[data-testid="plan.pots.saves"]')) problems.push(`${e.plan.id}: no "saves … later" line`);
          // the pots at the stop are asked only of someone stopping later
          const s = savedPots(e.plan, { today });
          if (!!root.querySelector('label[for="plan.pots.stopSipp"]') !== s.later) problems.push(`${e.plan.id}: the stop boxes do not follow the plan`);
        }
        for (const d of v.derived) if (!root.querySelector(`[data-line="pots.${d.id}"]`)) problems.push(`${e.plan.id}: derived line ${d.id} not drawn`);
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
  it('the pension total, the ISA, its growth and use, the ordinary account with its mix and band, earnings, bed-and-ISA, the charge, the bands, the tax-free part; the derived lines', () => {
    const { root, text } = draw(potsState(entries, id));
    expect(root.querySelector('[data-testid="plan.pots.pension"]').value).toBe('440000');
    expect(root.querySelector('[data-saved-for="pension"]').textContent).toBe('From your plan, saved 11 September 2026 (440000)');
    expect(root.querySelector('[data-testid="plan.pots.isa"]').value).toBe('60000');
    expect(root.querySelector('[data-testid="plan.pots.isaGrowth.cash"]').checked).toBe(true);
    expect(root.querySelector('[data-saved-for="isaGrowth"]').textContent).toContain('(Mostly cash');
    expect(root.querySelector('[data-testid="plan.pots.isaUse.minimiseEarlyTax"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.taxable"]').value).toBe('85000');
    expect(root.querySelector('[data-testid="plan.pots.taxableMix.balanced"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.giaBand.higher"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.earnings"]').value).toBe('12000');
    expect(root.querySelector('[data-testid="plan.pots.bedAndIsa.yes"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.charges"]').value).toBe('0.5');
    expect(root.querySelector('[data-testid="plan.pots.pa"]').value).toBe('12570');
    expect(root.querySelector('[data-testid="plan.pots.taxMode.inflates"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.taxFree.drawdown"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.pots.ufplsYears"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.pots.bandFill.no"]').checked).toBe(true);
    expect(root.querySelector('label[for="plan.pots.stopSipp"]')).toBe(null);
    expect(text).toContain('Pension £440,000 and ISAs and savings £60,000 today; £85,000 in your ordinary account.');
    expect(text).toContain('Split as saved: £280,000 shares, £120,000 bonds, £40,000 cash. The split, the risk level and the funds to test are set with the way of drawing and mix (in the planner).');
    expect(text).toContain('Charges of 0.5% a year come off your funds and cash every month');
    expect(text).toContain('Tax-free allowance £12,570; basic rate up to £50,270; higher rate up to £125,140; the thresholds rise with prices.');
    expect(text).toContain('Every draw from your pension is taxed in full: the tax-free part is kept separate, or already taken.');
    expect(text).toContain('What each choice saves in tax over the plan comes from ‘Does it last?’, later.');
    expect(root.querySelector('[data-not-used]')).toBe(null);
  });
  it('typing dispatches plan/edit with the text as typed; a choice too; Save dispatches plan/save; Cancel plan/cancel; the tax-free part opens its boxes; the derived lines follow', () => {
    const { root, actions } = draw(potsState(entries, id));
    const box = root.querySelector('[data-testid="plan.pots.pension"]');
    box.value = '500,000';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'pension', value: '500,000' });
    box.dispatchEvent(new Event('blur'));
    expect(actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'pension' });
    root.querySelector('[data-testid="plan.pots.isaGrowth.invested"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'isaGrowth', value: 'invested' });
    root.querySelector('form.pots-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.pop()).toEqual({ type: 'plan/save', planId: id });
    root.querySelector('[data-testid="plan.pots.cancel"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: id });
    const typed = draw(potsState(entries, id, { typed: { pension: '500,000', taxFree: 'ufpls', ufplsYears: '10', ufplsThenIsa: 'yes', charges: '0.25', isaUse: 'hold' } }));
    expect(typed.root.querySelector('[data-testid="plan.pots.ufplsYears"]').value).toBe('10');
    expect(typed.root.querySelector('[data-testid="plan.pots.bedAndIsa.yes"]')).toBe(null);   // the ISA held: bed-and-ISA is not asked
    expect(typed.text).toContain('Split as saved: £318,182 shares, £136,364 bonds, £45,454 cash.');
    expect(typed.text).toContain('A quarter of every draw from your pension is tax-free for 10 years, then the remaining quarter goes into your ISA tax-free.');
    expect(typed.text).toContain('Charges of 0.25% a year');
    expect(typed.text).toContain('The ISA is held, never drawn for income');
    // problems show once a box is left or Save is pressed
    const left = draw(potsState(entries, id, { typed: { pension: '', brl: '12,000' }, touched: ['brl'] }));
    expect(left.root.querySelector('[data-error-for="plan.pots.brl"]').textContent).toBe('The basic rate must end above the tax-free allowance.');
    expect(left.root.querySelector('[data-error-for="plan.pots.pension"]')).toBe(null);
    const asked = draw(potsState(entries, id, { typed: { pension: '', charges: '4' }, asked: true }));
    expect(asked.root.querySelector('[data-error-for="plan.pots.pension"]').textContent).toBe('Type what is in your pension pots today, for example 250,000.');
    expect(asked.root.querySelector('[data-error-for="plan.pots.charges"]').textContent).toBe('A charge from 0 to 3% a year, please.');
  });
  it('the saver (10): the pots at the stop are asked, blank, with the planner\'s projection beside them; the typed figure is said back', () => {
    const { root, text } = draw(potsState(entries, SAVER.id));
    expect(root.querySelector('[data-testid="plan.pots.stopSipp"]').value).toBe('');
    expect(text).toContain('The planner works out £278,542 pension and £9,955 ISAs and savings at the day you stop, from what you pay in. Type your own above to use it instead.');
    const typed = draw(potsState(entries, SAVER.id, { typed: { stopSipp: '300,000' } }));
    expect(typed.text).toContain('At the day you stop, as you typed it: £300,000 pension and none typed ISAs and savings.');
  });
  it('the toast after a save, with Undo; "Saving…" while a write is under way; a problem from the write in plain words', () => {
    const line = { id: 'pots', slots: { pension: '£500,000', isa: '£60,000', charges: '0.5' } };
    const saved = draw(potsState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.equityMin': 280000 }, line } } }));
    const toast = saved.root.querySelector('[data-testid="plan.pots.toast"]');
    expect(toast.textContent).toContain('Saved. Pension £500,000, ISAs and savings £60,000. Charges 0.5% a year.');
    expect(toast.getAttribute('role')).toBe('status');
    toast.querySelector('[data-testid="plan.pots.undo"]').click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const undone = draw(potsState(entries, id, { ui: { toast: { planId: id, kind: 'undone', previous: null, line: null } } }));
    expect(undone.root.querySelector('[data-testid="plan.pots.toast"]').textContent).toContain('Put back as it was.');
    const saving = draw(potsState(entries, id, { ui: { saving: { planId: id, kind: 'save' } } }));
    expect(saving.root.querySelector('[data-testid="plan.pots.save"]').textContent).toBe('Saving…');
    for (const [problem, words] of [['locked', 'This plan is locked, so nothing was changed.'], ['usedUp', 'Your free time without an account is used up.'], ['problems', 'Have a look at the boxes marked above.']]) {
      const p = draw(potsState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      expect(p.root.querySelector('[data-testid="plan.pots.problem"]').textContent).toContain(words);
    }
  });
  it('the plan page: "Pots" links here with "Change this here"', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const section = root.querySelector('[data-section="pots"]');
    expect(section.querySelector('h3').textContent).toBe('Pots');
    expect(root.querySelector('[data-testid="plan.plan.edit.pots"]').getAttribute('href')).toBe('#/plan/' + id + '/pots');
    expect(root.querySelector('[data-testid="plan.plan.edit.pots"]').textContent).toBe('Change this here');
    expect(root.querySelector('[data-testid="plan.plan.change.pots"]')).toBe(null);
    expect(text).not.toMatch(/undefined|NaN/);
  });
});

describe('the locked plans, a plan shown as saved, the household pair, a plan not found', () => {
  const entries = entriesAt(TODAY);
  it('03 locked (a gilt ladder): the figures, "Fixed when you locked the plan on 1 July 2026." once, the unlock sentence once, "See these" on the plan page, no box; 06 (locked before charges and the ISA choice) says so', () => {
    const { root, text } = draw(potsState(entries, C['03-gilt-ladder-runup'].id));
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(text).toContain('Pension £1,050,000 and ISAs and savings £80,000 today.');
    expect(text).toContain('This way of drawing is sized on its own figures: £1,050,000 pension and £80,000 ISAs, set with the way of drawing (in the planner).');
    expect(text).toContain('The ISA is held, never drawn for income');
    expect(root.querySelector('[data-testid="plan.pots.back"]').getAttribute('href')).toBe('#/plan/' + C['03-gilt-ladder-runup'].id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + C['03-gilt-ladder-runup'].id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.edit.pots"]').textContent).toBe('See these');
    const old = draw(potsState(entries, C['06-pre-6.4-no-timing'].id));
    expect(old.text).toContain('No charges come off: this plan was locked before charges were added.');
    expect(old.text).toContain('Your ISAs and savings grow at a fixed 3% a year: this plan was locked before the choice was added.');
  });
  it('a plan shown as saved: no box, the sentence', () => {
    const newer = entries.map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    const { root, text } = draw(potsState(newer, LUMPY.id));
    expect(root.querySelector('input')).toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
  });
  it('the household pair: each page names the other\'s plan for their pots, with a link to it', () => {
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    const { root } = draw(potsState(es, saver.id));
    const partner = root.querySelector('[data-testid="plan.pots.partner"]');
    expect(partner.textContent).toContain('Ladder plan’s pots and tax are on Ladder plan’s plan.');
    expect(partner.querySelector('a').getAttribute('href')).toBe('#/plan/HouseLadder01/pots');
    expect(draw(potsState(es, ladder.id)).root.querySelector('[data-testid="plan.pots.partner"] a').getAttribute('href')).toBe('#/plan/HouseSaver02/pots');
  });
  it('a plan not in the account, and the window warning without an account', () => {
    const unknown = draw(potsState(entries, 'NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(draw(stateWith(null, '#/plan/abc/pots', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const win = draw(potsState(entries.slice(11, 12), entries[11].plan.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.pots.save"]')).not.toBe(null);
  });
});

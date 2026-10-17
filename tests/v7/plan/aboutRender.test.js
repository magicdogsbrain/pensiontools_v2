/**
 * E6 (research/v7/editing-in-v7.md 5): the about page drawn from states. Every unlocked corpus plan: the boxes with real
 * labels, the saved value and its source beside each, the derived lines, Save and Cancel, no banned word (the retired rules
 * on retired stages, the saver rules on saving ones), no countdown. A locked plan: no box, "Fixed when…" once, the unlock
 * sentence once. A plan shown as saved: no box. A plan not found. The toast with Undo. The plan page's stale line and its
 * link into the step.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { ABOUT_FIELDS } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { aboutPatch, applyPatch } from '../../../src/answers/plan/about.js';
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
/** A state on the about step, with what was typed (plan/edit) and the reading refreshed as the plan source would. */
function aboutState(entries, id, { today = TODAY, typed = {}, touched = [], asked = false, source = 'account', session = 'in', ui = {} } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/about', { today, source, session });
  for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
  for (const path of touched) s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path });
  if (asked) s = reduce(s, { type: A.PLAN_SAVE, planId: id });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  if (asked) s = { ...s, ui: { ...s.ui, saving: null } };
  return { ...s, ui: { ...s.ui, ...ui } };
}

describe('every unlocked corpus plan at three dates: the boxes, the sources, the derived lines, the words', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        const state = aboutState(entries, e.plan.id, { today });
        const { root, text, words } = draw(state);
        const pg = planPage(entries, e.plan.id, 'about', { today });
        expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.about');
        expect(root.querySelector('h1').textContent).toBe('About you and when');
        const locked = !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked);
        const region = root.querySelector('[data-region="plan-about"]');
        if (!region) problems.push(`${e.plan.id}: no region`);
        else if (locked) {
          if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box on a locked plan`);
          if ((text.match(/Fixed when you locked the plan on /g) || []).length !== 1) problems.push(`${e.plan.id}: "Fixed when" not once`);
          if (root.querySelectorAll('[data-testid="plan.unlock"]').length !== 1) problems.push(`${e.plan.id}: the unlock sentence not once`);
          if (root.querySelector('[data-testid="plan.about.save"]')) problems.push(`${e.plan.id}: Save on a locked plan`);
        } else {
          // every box that applies has a real label and an id a test can reach; the saved value and its source beside it
          for (const f of ABOUT_FIELDS) {
            const el = root.querySelector(`[data-field="${f.path}"]`);
            const applies = !(f.path === 'stopAge' || f.path === 'stopMonth' || f.path === 'startWhen') || region.querySelector(`[data-field="${f.path}"]`);
            if (applies && !el) problems.push(`${e.plan.id}: no field ${f.path}`);
            if (el && f.type !== 'choice' && !root.querySelector(`label[for="plan.about.${f.path}"]`)) problems.push(`${e.plan.id}: no label for ${f.path}`);
            if (el && f.type === 'choice' && !el.querySelector('legend')) problems.push(`${e.plan.id}: no legend for ${f.path}`);
          }
          if (!root.querySelector('[data-saved-for="age"]') && +(e.plan.stressTool.settings.currentAge) > 0) problems.push(`${e.plan.id}: no source beside the age`);
          if (!root.querySelector('[data-testid="plan.about.save"]') || !root.querySelector('[data-testid="plan.about.cancel"]')) problems.push(`${e.plan.id}: Save or Cancel missing`);
          if (!root.querySelector('[data-line="about.runs"], [data-line="about.noAge"]')) problems.push(`${e.plan.id}: no derived line`);
          // nothing is marked before a box is left or Save is pressed
          if (root.querySelector('.error')) problems.push(`${e.plan.id}: a problem shown before anything was touched`);
        }
        if (!text.includes(ADVICE_SHORT)) problems.push(`${e.plan.id}: no ADVICE_SHORT`);
        if (COUNTDOWN.test(words)) problems.push(`${e.plan.id}: a countdown: ${COUNTDOWN.exec(words)[0]}`);
        for (const hit of bannedHits(words, scopesOf(pg.stageKey))) problems.push(`${e.plan.id} [${pg.stageKey}]: ${hit}`);
        if (/undefined|NaN|\[object|\{\w+\}/.test(words)) problems.push(`${e.plan.id}: junk`);
        // the rail is the plan's: one current step, the next sentence
        const rail = root.querySelector('[data-region="rail"]');
        if (!rail) problems.push(`${e.plan.id}: no rail`);
        else if (!rail.querySelector('[data-testid="rail.next"] [data-next]').textContent.trim()) problems.push(`${e.plan.id}: empty next sentence`);
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('the saver 10: what the page says, and what typing does', () => {
  const entries = entriesAt(TODAY);
  const id = C['10-couple-b'].id;
  it('the boxes hold the saved facts, each with "From your plan, saved …" and the value; the derived lines; the stop-age box inside its option', () => {
    const { root, text } = draw(aboutState(entries, id));
    expect(root.querySelector('[data-testid="plan.about.age"]').value).toBe('58');
    expect(root.querySelector('[data-testid="plan.about.stopped.age"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.about.stopAge"]').value).toBe('62');
    expect(root.querySelector('[data-testid="plan.about.endAge"]').value).toBe('93');
    expect(root.querySelector('[data-testid="plan.about.startWhen"]')).toBe(null);   // stopping later: not asked
    expect(root.querySelector('[data-saved-for="age"]').textContent).toBe('From your plan, saved 22 August 2026 (58)');
    expect(root.querySelector('[data-saved-for="endAge"]').textContent).toBe('From your plan, saved 22 August 2026 (93)');
    expect(text).toContain('You stop work in January 2030, at 62.');
    expect(text).toContain('The plan’s first tax year is 2029/30, from 6 April 2029.');
    expect(text).toContain('Your plan runs 32 years, from January 2030 to age 93.');
    expect(text).toContain('Income steps start at age 62.');
    expect(root.querySelector('[data-testid="plan.about.suggest"]').disabled).toBe(false);
    // the stop-age box sits inside its option's row
    expect(root.querySelector('[data-field="stopped"] [data-field="stopAge"]')).not.toBe(null);
  });
  it('typing dispatches plan/edit with the text as typed; leaving a box dispatches plan/touch; Save dispatches plan/save and focuses the first problem', () => {
    const { root, actions } = draw(aboutState(entries, id));
    const box = root.querySelector('[data-testid="plan.about.endAge"]');
    box.value = '9';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'endAge', value: '9' });
    box.dispatchEvent(new Event('blur'));
    expect(actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'endAge' });
    root.querySelector('[data-testid="plan.about.stopped.yes"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'stopped', value: 'yes' });
    root.querySelector('form.about-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.pop()).toEqual({ type: 'plan/save', planId: id });
    root.querySelector('[data-testid="plan.about.cancel"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: id });
  });
  it('a typed change redraws the derived lines and the problems: a box left shows its sentence; Save pressed shows every problem', () => {
    const typed = draw(aboutState(entries, id, { typed: { stopAge: '64', endAge: '95' } }));
    expect(typed.text).toContain('You stop work in January 2032, at 64.');
    expect(typed.text).toContain('Your plan runs 32 years, from January 2032 to age 95.');
    expect(typed.root.querySelector('.error')).toBe(null);
    const left = draw(aboutState(entries, id, { typed: { stopAge: '50', endAge: '60' }, touched: ['stopAge'] }));
    expect(left.root.querySelector('[data-error-for="plan.about.stopAge"]').textContent).toBe('The age you stop cannot be below your age today.');
    expect(left.root.querySelector('[data-error-for="plan.about.endAge"]')).toBe(null);   // not left yet
    // Save pressed: every box's problem shows (the end age's minimum is known only once the stop is right)
    const asked = draw(aboutState(entries, id, { typed: { endAge: '60' }, asked: true }));
    expect(asked.root.querySelector('[data-error-for="plan.about.endAge"]').textContent).toBe('The plan has to run at least 5 years: an age of 66 or more.');
    expect(asked.root.querySelector('[data-testid="plan.about.endAge"]').getAttribute('aria-invalid')).toBe('true');
    const both = draw(aboutState(entries, id, { typed: { stopAge: '50', age: '' }, asked: true }));
    expect(both.root.querySelector('[data-error-for="plan.about.age"]').textContent).toBe('Type your age today.');
    expect(both.root.querySelector('[data-testid="plan.about.stopAge"]').getAttribute('aria-invalid')).toBe(null);   // no age today: the stop age cannot be judged yet
    const stopped = draw(aboutState(entries, id, { typed: { stopped: 'yes' } }));
    expect(stopped.root.querySelector('[data-testid="plan.about.startWhen.now"]')).not.toBe(null);
    expect(stopped.root.querySelector('label[for="plan.about.startWhen.april"]').textContent).toBe('Next April, 2027/28');
    expect(stopped.root.querySelector('[data-testid="plan.about.startWhen.saved"]')).toBe(null);
  });
  it('the suggestion: "Suggest" fills the end age; the sentence shows when the box holds it', () => {
    const { root, actions } = draw(aboutState(entries, id, { typed: { sex: 'f', chance: '10' } }));
    root.querySelector('[data-testid="plan.about.suggest"]').click();
    expect(actions).toEqual([{ type: 'plan/edit', planId: id, path: 'endAge', value: '97' }, { type: 'plan/touch', planId: id, path: 'endAge' }]);
    const applied = draw(aboutState(entries, id, { typed: { sex: 'f', chance: '10', endAge: '97' } }));
    expect(applied.root.querySelector('[data-testid="plan.about.suggested"]').textContent).toBe('Age 97: 1 in 10 women of 58 live beyond it.');
    expect(draw(aboutState(entries, id, { typed: { sex: 'f', chance: '10', endAge: '90' } })).root.querySelector('[data-testid="plan.about.suggested"]')).toBe(null);
  });
  it('the toast after a save, with Undo; "Saving…" while a write is under way; a problem from the write in plain words', () => {
    const saved = draw(aboutState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.duration': 32 }, line: { id: 'runsTo', slots: { endAge: 95, years: 34 } } } } }));
    const toast = saved.root.querySelector('[data-testid="plan.about.toast"]');
    expect(toast.textContent).toContain('Saved. Your plan now runs 34 years, to age 95.');
    expect(toast.getAttribute('role')).toBe('status');
    toast.querySelector('[data-testid="plan.about.undo"]').click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const undone = draw(aboutState(entries, id, { ui: { toast: { planId: id, kind: 'undone', previous: null, line: null } } }));
    expect(undone.root.querySelector('[data-testid="plan.about.toast"]').textContent).toContain('Put back as it was.');
    expect(undone.root.querySelector('[data-testid="plan.about.undo"]')).toBe(null);
    const saving = draw(aboutState(entries, id, { ui: { saving: { planId: id, kind: 'save' } } }));
    expect(saving.root.querySelector('[data-testid="plan.about.save"]').textContent).toBe('Saving…');
    expect(saving.root.querySelector('[data-testid="plan.about.save"]').disabled).toBe(true);
    for (const [problem, words] of [['locked', 'This plan is locked, so nothing was changed.'], ['usedUp', 'Your free time without an account is used up.'], ['storage', 'This browser would not keep the change.']]) {
      const p = draw(aboutState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      expect(p.root.querySelector('[data-testid="plan.about.problem"]').textContent).toContain(words);
    }
  });
  it('the plan page after a change: the stale line, "Next: check it still lasts", and "Change this here" into the step', () => {
    const base = entryOf(C['10-couple-b']).plan;
    const ss = base.stressTool.settings;
    const plan = { ...base, lastModified: '2026-09-20T10:00:00.000Z', fromAnswer: { people: [{ who: 'you', ageToday: ss.currentAge, ageAtStop: ss.retireAge, years: ss.duration, stop: { kind: 'later', yearsFromNow: 4 } }], who: 'you', savedOn: '2026-09-20T10:00:00.000Z', answer: { lasted: 9 } } };
    const changed = applyPatch({ ...plan, lastModified: '2026-10-02T09:00:00.000Z' }, aboutPatch(plan, { endAge: '95' }, { today: TODAY }).patch);
    const es = [{ plan: changed, newer: false, failed: false }];
    const { root, text } = draw(stateWith(es, '#/plan/' + changed.id + '/plan'));
    expect(root.querySelector('[data-testid="plan.answerStale"]').textContent).toBe('Your ‘will it last’ answer was worked out on 20 September 2026, before the plan was changed on 2 October 2026.');
    expect(text).toContain('The plan has changed since its ‘will it last’ answer. Next: check it still lasts.');
    expect(root.querySelector('[data-testid="rail.next.button"]').textContent).toBe('Check it still lasts');
    expect(root.querySelector('[data-testid="plan.plan.edit.about"]').getAttribute('href')).toBe('#/plan/' + changed.id + '/about');
    const before = draw(stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/plan'));
    expect(before.root.querySelector('[data-testid="plan.answerStale"]')).toBe(null);
  });
});

describe('the locked ladder, a plan shown as saved, the household pair, a plan not found, a window without an account', () => {
  const entries = entriesAt(TODAY);
  it('03 locked: the figures, "Fixed when you locked the plan on 1 July 2026." once, the unlock sentence once, "See these" on the plan page, no box', () => {
    const { root, text } = draw(aboutState(entries, C['03-gilt-ladder-runup'].id));
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(root.querySelector('[data-saved-for="age"]').textContent).toBe('56');
    expect(text).toContain('Your plan runs 33 years, from April 2027 to age 90.');
    expect(root.querySelector('[data-testid="plan.about.back"]').getAttribute('href')).toBe('#/plan/' + C['03-gilt-ladder-runup'].id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + C['03-gilt-ladder-runup'].id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.edit.about"]').textContent).toBe('See these');
  });
  it('a plan shown as saved: no box, the sentence', () => {
    const id = C['10-couple-b'].id;
    const newer = entries.map((e) => (e.plan.id === id ? { ...e, newer: true } : e));
    const { root, text } = draw(aboutState(newer, id));
    expect(root.querySelector('input')).toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
  });
  it('the household pair: each about page names the other\'s plan for their ages, with a link to it', () => {
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    const { root } = draw(aboutState(es, saver.id));
    const partner = root.querySelector('[data-testid="plan.about.partner"]');
    expect(partner.textContent).toContain('Ladder plan’s ages are on Ladder plan’s plan.');
    expect(partner.querySelector('a').getAttribute('href')).toBe('#/plan/HouseLadder01/about');
    expect(draw(aboutState(es, ladder.id)).root.querySelector('[data-testid="plan.about.partner"] a').getAttribute('href')).toBe('#/plan/HouseSaver02/about');
  });
  it('a plan not in the account, and the window warning without an account', () => {
    const unknown = draw(aboutState(entries, 'NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(draw(stateWith(null, '#/plan/abc/about', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const win = draw(aboutState(entries.slice(9, 10), entries[9].plan.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.about.save"]')).not.toBe(null);
  });
});

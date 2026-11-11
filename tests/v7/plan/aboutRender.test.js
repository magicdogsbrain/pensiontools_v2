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
          // the one box a locked plan has (6.53.0): "When did you stop work?", while the plan does not say it, or, once it
          // does, the same month put right (folded, under "Change the month you stopped work")
          if ([...root.querySelectorAll('input, select, textarea')].some((b) => !b.closest('[data-testid="plan.about.stopAsk"], [data-testid="plan.about.stopChange"], [data-testid="plan.about.stopLater"]'))) problems.push(`${e.plan.id}: a box on a locked plan`);
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
    expect(stopped.root.querySelector('[data-testid="plan.about.startWhen.april"]')).toBe(null);   // 7.3.3: never next April
    expect(stopped.root.querySelector('[data-testid="plan.about.startWhen.saved"]')).toBe(null);
    expect(stopped.root.querySelector('label[for="plan.about.startWhen.now"]').textContent).toBe('This tax year, 2026/27');
    // work stopped this tax year (6.51.0, a review): this tax year IS the year work stopped, said as the planner says it
    const thisYear = draw(aboutState(entries, id, { typed: { stopped: 'yes', stopMonth: 'August 2026' } }));
    expect(thisYear.root.querySelector('label[for="plan.about.startWhen.now"]').textContent).toBe('This tax year, 2026/27, the tax year you stopped work');
    expect(thisYear.root.querySelector('[data-testid="plan.about.startWhen.stop"]')).toBe(null);
    // stopped long ago (a review of 6.51.0: 22 radios, about 1,000px on a phone): the stop's year, "Another tax year" with
    // a list of the years between, this tax year and next April; the values sent are the same
    const longAgo = aboutState(entries, id, { typed: { age: '63', stopped: 'yes', stopMonth: 'June 2006' } });
    const far = draw(longAgo);
    const radios = [...far.root.querySelectorAll('[data-field="startWhen"] input[type="radio"]')].map((r) => r.value);
    expect(radios).toEqual(['stop', 'other', 'now']);
    expect(far.root.querySelector('label[for="plan.about.startWhen.other"]').textContent).toBe('Another tax year');
    const list = far.root.querySelector('[data-testid="plan.about.startWhen.otherYear"]');
    const years = [...list.querySelectorAll('option')].filter((o) => o.value).map((o) => o.textContent);
    expect([years[0], years[years.length - 1], years.length]).toEqual(['2007/08', '2025/26', 19]);
    expect(list.getAttribute('aria-label')).toBe('The tax year');
    far.root.querySelector('[data-testid="plan.about.startWhen.other"]').click();
    expect(far.actions[far.actions.length - 1]).toMatchObject({ type: 'plan/edit', path: 'startWhen', value: 'y2007' });
    const chosen = draw(aboutState(entries, id, { typed: { age: '63', stopped: 'yes', stopMonth: 'June 2006', startWhen: 'y2015' } }));
    expect(chosen.root.querySelector('[data-testid="plan.about.startWhen.other"]').checked).toBe(true);
    expect(chosen.root.querySelector('[data-testid="plan.about.startWhen.otherYear"]').value).toBe('y2015');
    expect(chosen.root.querySelector('[data-error-for="plan.about.startWhen"]')).toBe(null);
  });
  it('the suggestion: "Suggest" fills the end age; the sentence shows when the box holds it', () => {
    // retaken 11 Nov 2026 (7.8.0): the suggestion reads the ONS 2024-based cohort tables at today's date, rounded up
    const { root, actions } = draw(aboutState(entries, id, { typed: { sex: 'f', chance: '10' } }));
    root.querySelector('[data-testid="plan.about.suggest"]').click();
    expect(actions).toEqual([{ type: 'plan/edit', planId: id, path: 'endAge', value: '99' }, { type: 'plan/touch', planId: id, path: 'endAge' }]);
    const applied = draw(aboutState(entries, id, { typed: { sex: 'f', chance: '10', endAge: '99' } }));
    expect(applied.root.querySelector('[data-testid="plan.about.suggested"]').textContent).toBe('Age 99: 1 in 10 women of 58 live beyond it.');
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
    // 7.3.0: the rail's next is the first thing due — the saver's first check-in — and "check it still lasts" is due on the
    // plan's home with it
    expect(root.querySelector('[data-testid="rail.next.button"]').textContent).toBe('Check in');
    const home = draw(stateWith(es, '#/plan/' + changed.id));
    expect(home.root.querySelector('[data-todo="answer.stale"]').textContent).toContain('Check it still lasts');
    expect(root.querySelector('[data-testid="plan.plan.edit.about"]').getAttribute('href')).toBe('#/plan/' + changed.id + '/about');
    const before = draw(stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/plan'));
    expect(before.root.querySelector('[data-testid="plan.answerStale"]')).toBe(null);
  });
});

describe('the locked ladder, a plan shown as saved, the household pair, a plan not found, a window without an account', () => {
  const entries = entriesAt(TODAY);
  /** The entries with plan `id` changed by `f`. */
  const withPlan = (id, f) => entries.map((e) => (e.plan.id === id ? { ...e, plan: f(e.plan) } : e));
  /** 03 with no month recorded: the question is a plan's with none (7.4.3: one with months moves to their tax year). */
  const noMonths = (p) => ({ ...p, decisionTool: { ...p.decisionTool, history: [] } });
  /** 03 having recorded October 2023 too (a copy of its first month, dated then): its months begin with the stop's tax year. */
  const fromOct2023 = (p) => ({ ...p, decisionTool: { ...p.decisionTool, history: [{ ...p.decisionTool.history[0], date: '2023-10', taxYear: '23/24' }, ...p.decisionTool.history] } });
  it('03 locked: the figures, "Fixed when you locked the plan on 1 July 2026." once, the unlock sentence once, "See these" on the plan page, no box: the move to where its months begin (7.4.3)', () => {
    const { root, text, actions } = draw(aboutState(entries, C['20-locked-start-after-stop'].id));
    // the plan does not say when work stopped, but its months are recorded from July 2026: the move to 2026/27, no question
    expect([...root.querySelectorAll('input, select, textarea')].map((b) => b.id)).toEqual([]);
    expect(root.querySelector('[data-testid="plan.about.stopAsk"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.about.moveStart"]').textContent).toContain('Your plan is set to start in April 2027, but your recorded months begin in July 2026. Start it from 2026/27: your recorded months are kept and read against it.');
    // beside the saved first tax year: where it belongs, and the move's button
    expect(root.querySelector('[data-line="about.saved.startWhen"]').textContent).toBe('Your plan’s first tax year: 2027/28, as saved. Move it to 2026/27, when your recorded months begin. Move the start…');
    root.querySelector('[data-testid="plan.about.startPointer.open"]').click();
    expect(actions.at(-1)).toEqual({ type: 'ui/toggle', id: 'moveStartConfirm' });
    const shown = draw(aboutState(entries, C['20-locked-start-after-stop'].id, { ui: { open: ['moveStartConfirm'] } }));
    expect(shown.root.querySelector('[data-testid="plan.about.moveConfirm"]').textContent).toContain('The plan’s first tax year becomes 2026/27, the tax year your recorded months begin (July 2026); it was 2027/28. Your recorded months are kept and read against 2026/27.');
    expect(shown.root.querySelector('[data-testid="plan.about.startPointer"]')).toBe(null);   // the confirm open: said once
    expect(bannedHits(shown.words, ['all', 'record', 'retired'])).toEqual([]);
    expect(shown.text).not.toMatch(/\{\w+\}|undefined|NaN/);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(root.querySelector('[data-saved-for="age"]').textContent).toBe('64');
    expect(text).toContain('Your plan runs 20 years, from April 2027 to age 85.');
    expect(root.querySelector('[data-testid="plan.about.back"]').getAttribute('href')).toBe('#/plan/' + C['20-locked-start-after-stop'].id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + C['20-locked-start-after-stop'].id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.edit.about"]').textContent).toBe('See these');
  });
  it('03 locked, no month recorded: the month box has its own help and errors, never the unlocked step\'s (which speak of choices this page does not have)', () => {
    const id = C['20-locked-start-after-stop'].id;
    const entries = withPlan(id, noMonths);
    expect(draw(aboutState(entries, id)).root.querySelector('[data-testid="plan.about.stopAsk"]').textContent).toContain('When did you stop work?');
    const help = draw(aboutState(entries, id)).root.querySelector('[data-field="lockedStopMonth"] .help').textContent;
    expect(help).toBe('Like 2023-10, or October 2023.');
    expect(help).not.toMatch(/choose a later one below/);
    const ahead = draw(aboutState(entries, id, { typed: { stopMonth: '2027-02' } })).root.querySelector('[data-field="lockedStopMonth"] .error').textContent;
    expect(ahead).toBe('That month is still ahead: type the month you stopped, this one or an earlier one.');
    expect(ahead).not.toMatch(/I will stop in a month/);
    const unread = draw(aboutState(entries, id, { typed: { stopMonth: 'xyz' } })).root.querySelector('[data-field="lockedStopMonth"] .error').textContent;
    expect(unread).toBe('That is not a month we can read: try 2023-10 or October 2023.');
  });
  it('03 locked, after "Leave it": still asked while its start is later than this tax year (7.4.0), with "I\'m already drawing" beside it and no "Leave it"', () => {
    const id = C['20-locked-start-after-stop'].id;
    const left = withPlan(id, (p) => noMonths({ ...p, stressTool: { ...p.stressTool, settings: { ...p.stressTool.settings, stopMonthLeft: true } } }));   // no month recorded (7.4.3)
    const { root, actions } = draw(aboutState(left, id));
    expect(root.querySelector('[data-testid="plan.about.stopAsk"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.about.stopAsk.leave"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.about.stopLater"]')).toBe(null);
    const now = root.querySelector('[data-testid="plan.about.moveNow"]');
    expect(now.textContent).toContain('Your plan is set to start in 2027/28. It can start this tax year, 2026/27, from where it stands today.');
    const open = root.querySelector('[data-testid="plan.about.moveNow.open"]');
    expect(open.textContent).toBe('I’m already drawing: start it this tax year…');
    open.click();
    expect(actions.at(-1)).toEqual({ type: 'ui/toggle', id: 'moveStartConfirm' });
    expect([...root.querySelectorAll('input, select, textarea')].map((b) => b.id)).toEqual(['plan.about.lockedStopMonth']);
  });
  it('03 locked, the month said: the move is offered here; its confirm on the page, line by line; "Move the start to 2023/24" sends it; no Undo after (6.55.0)', () => {
    const id = C['20-locked-start-after-stop'].id;
    // its months recorded from October 2023, the month work stopped (7.4.3: the move goes to the tax year they begin in)
    const said = withPlan(id, (p) => fromOct2023({ ...p, stressTool: { ...p.stressTool, settings: { ...p.stressTool.settings, stoppedWork: '2023-10' } } }));
    const closed = draw(aboutState(said, id));
    const offer = closed.root.querySelector('[data-testid="plan.about.moveStart"]');
    expect(offer.textContent).toContain('and your plan is set to start in 2027/28. It can start from 2023/24, the tax year you stopped');   // 7.3.3
    expect(offer.textContent).not.toMatch(/before (your|the) plan/);
    expect(offer.textContent).toContain('Before anything is written, this page says exactly what changes');
    expect(closed.root.querySelector('[data-testid="plan.about.moveConfirm"]')).toBe(null);
    const open = closed.root.querySelector('[data-testid="plan.about.moveStart.open"]');
    expect(open.textContent).toBe('Move the plan’s start…');
    open.click();
    expect(closed.actions.at(-1)).toEqual({ type: 'ui/toggle', id: 'moveStartConfirm' });
    // the confirm, open: what changes, the plan staying locked, the two buttons; no box but the month's (folded)
    const shown = draw(aboutState(said, id, { ui: { open: ['moveStartConfirm'] } }));
    const confirm = shown.root.querySelector('[data-testid="plan.about.moveConfirm"]');
    expect(confirm.querySelector('h3').textContent).toBe('Move the plan’s start to 2023/24?');
    expect(confirm.textContent).toContain('Here is exactly what changes:');
    expect(confirm.textContent).toContain('The plan stays locked: nothing is unlocked and no setting is added.');
    expect(confirm.textContent).toContain('the first step keeps its amount (£34,000 a year) and now runs from 2023/24, at 62; your later steps keep their ages.');
    expect(confirm.textContent).toContain('Not affected: what you hold, what you spend, and the tax years you set up.');
    expect(shown.root.querySelector('[data-testid="plan.about.moveStart.open"]')).toBe(null);
    expect(bannedHits(shown.words, ['all', 'record', 'retired'])).toEqual([]);
    expect(shown.text).not.toMatch(/\{\w+\}|undefined|NaN/);
    const yes = confirm.querySelector('[data-testid="plan.about.moveConfirm.yes"]');
    expect(yes.textContent).toBe('Move the start to 2023/24');
    yes.click();
    expect(shown.actions.at(-1)).toEqual({ type: 'plan/moveStart', how: {}, planId: id });
    confirm.querySelector('[data-testid="plan.about.moveConfirm.no"]').click();
    expect(shown.actions.at(-1)).toEqual({ type: 'ui/toggle', id: 'moveStartConfirm' });
    // the press: the confirm closes and the write is under way
    const pressed = reduce(aboutState(said, id, { ui: { open: ['moveStartConfirm'] } }), { type: A.PLAN_MOVE_START, planId: id });
    expect(pressed.ui.saving).toEqual({ planId: id, kind: 'moveStart' });
    expect(pressed.ui.open).not.toContain('moveStartConfirm');
    const moving = draw(pressed);
    expect(moving.root.querySelector('[data-testid="plan.about.moving"]').textContent).toContain('Moving the plan’s start and writing the plan document again…');
    expect(moving.root.querySelector('[data-testid="plan.about.moveConfirm"]')).toBe(null);
    // written: the toast says so, with no Undo (the planner offers none)
    const done = reduce(pressed, { type: A.PLAN_SAVED, planId: id, previous: {}, line: { id: 'moved', slots: { year: '2023/24' } }, op: 'moveStart' });
    expect(done.ui.toast).toEqual({ planId: id, kind: 'done', previous: null, line: { id: 'moved', slots: { year: '2023/24' } }, op: 'moveStart' });
    const after = draw(done);
    const toast = after.root.querySelector('[data-testid="plan.about.toast"]');
    expect(toast.textContent).toContain('The plan’s start is now 2023/24, the tax year you stopped work.');
    expect(after.root.querySelector('[data-testid="plan.about.undo"]')).toBe(null);
    // a problem from the write, in plain words
    const refused = draw(reduce(pressed, { type: A.PLAN_SAVE_FAILED, planId: id, problem: 'noWorker' }));
    expect(refused.root.querySelector('[data-testid="plan.about.problem"]').textContent).toContain('This browser cannot run the plan’s test in the background');
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

/**
 * "Lock the plan" drawn from states (research/v7/road-to-7.md step 6). Every unlocked corpus plan at three dates: the title,
 * the three lists (what the lock fixes, what stays changeable, what you get), a saver's line on a saving stage, the one
 * button, no box, no banned word (the retired rules on retired stages, the saver rules on saving ones), no countdown. Then
 * the confirm step open ("Lock it" / "Not now" dispatch), the lock under way (the working block, no button), the toast
 * after the lock on "Your plan as locked" with Undo, a locked plan reached by its address ("Locked {date}" and the link),
 * a plan shown as saved, and without an account with the free time used up (the problem in plain words). On "Your plan as
 * locked": the unlock button and its confirm, the new-version button and its confirm, "Unlocking…", the problems.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { ADVICE_SHORT } from '../../../src/v7/copy/common.js';
import { LOCK } from '../../../src/v7/copy/lock.js';
import { corpus, entriesAt, stateWith, DATES, TODAY } from './_plans.js';

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
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);

/** A state on the lock step (or another), with the ui laid over it, the reading refreshed. */
function lockState(entries, id, { today = TODAY, step = 'lock', source = 'account', session = 'in', open = [], ui = {} } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/' + step, { today, source, session, open });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  return { ...s, ui: { ...s.ui, ...ui } };
}
const DRAFT = C['02-pnv-draft'];
const SAVER = C['10-couple-b'];
const LADDER = C['03-gilt-ladder-runup'];
const BUCKETS = C['04-buckets-running'];
const OLD = C['06-pre-6.4-no-timing'];

describe('every unlocked corpus plan at three dates: the lock screen', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        if (isLocked(e.plan)) continue;
        const { root, text, words } = draw(lockState(entries, e.plan.id, { today }));
        const pg = planPage(entries, e.plan.id, 'lock', { today });
        if (root.querySelector('main').getAttribute('data-screen') !== 'plan.lock') problems.push(`${e.plan.id}: data-screen`);
        if (root.querySelector('h1').textContent !== 'Lock the plan' && !root.querySelector('h1').textContent.startsWith('Lock the plan')) problems.push(`${e.plan.id}: title "${root.querySelector('h1').textContent}"`);
        if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box`);
        if (!text.includes(ADVICE_SHORT)) problems.push(`${e.plan.id}: no ADVICE_SHORT`);
        const panel = root.querySelector('[data-region="plan-step"]');
        if (!panel || panel.getAttribute('data-locked') !== '0') problems.push(`${e.plan.id}: no unlocked panel`);
        for (const sec of ['fixes', 'stays', 'gets']) if (!root.querySelector(`[data-section="${sec}"]`)) problems.push(`${e.plan.id}: no ${sec} list`);
        if (root.querySelectorAll('[data-section="fixes"] li').length !== Object.keys(LOCK.fixes.items).length) problems.push(`${e.plan.id}: the fixes list`);
        if (root.querySelectorAll('[data-section="stays"] li').length !== Object.keys(LOCK.stays.items).length) problems.push(`${e.plan.id}: the stays list`);
        if (root.querySelectorAll('[data-section="gets"] li').length !== Object.keys(LOCK.gets.items).length) problems.push(`${e.plan.id}: the gets list`);
        if (!root.querySelector('[data-testid="plan.lock.lock"]')) problems.push(`${e.plan.id}: no Lock button`);
        if (root.querySelector('[data-testid="plan.lock.confirmBox"]')) problems.push(`${e.plan.id}: the confirm is open`);
        if (!!root.querySelector('[data-testid="plan.lock.saver"]') !== pg.saver) problems.push(`${e.plan.id}: the saver line`);
        if (/\{\w+\}/.test(text)) problems.push(`${e.plan.id}: an unfilled slot`);
        if (COUNTDOWN.test(words)) problems.push(`${e.plan.id}: a countdown: ${COUNTDOWN.exec(words)[0]}`);
        for (const hit of bannedHits(words, scopesOf(pg.stageKey), { skip: ['bridge'] })) problems.push(`${e.plan.id} [${pg.stageKey}]: ${hit}`);
        if (/undefined|NaN|\[object/.test(words)) problems.push(`${e.plan.id}: junk`);
        // the rail: the lock step is current, listed on its stage's rail
        const rail = root.querySelector('[data-region="rail"]');
        if (!rail || !rail.querySelector('[data-testid="rail.plan.lock"][aria-current="step"]')) problems.push(`${e.plan.id}: the rail's lock step`);
        if (pg.stageKey !== 'unknown' && root.querySelector('[data-testid="plan.notListed"]')) problems.push(`${e.plan.id}: "not listed" on a listed step`);
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('the draft (02): what the screen says and what pressing does', () => {
  const entries = entriesAt(TODAY);
  const id = DRAFT.id;
  it('the three lists in words, the way of drawing named, the test and the way back; "Lock this plan" opens the confirm; "Lock it" dispatches plan/lock; "Not now" closes it', () => {
    const { root, text, actions } = draw(lockState(entries, id));
    expect(text).toContain('Locking fixes the plan and writes the plan document, so you can follow it month by month.');
    expect(text).toContain('What the lock fixes');
    expect(text).toContain('the way of drawing (Pots and valves) and its dials;');
    expect(text).toContain('What stays changeable');
    expect(text).toContain('your monthly records and each tax year’s set-up;');
    expect(text).toContain('What you get');
    expect(text).toContain('the plan document: the plan as committed, at the prices of the day you lock it');
    expect(text).toContain('To change a locked plan later, unlock it from “Your plan as locked”');
    expect(root.querySelector('[data-testid="plan.lock.saver"]')).toBe(null);   // retired, designing the plan
    expect(root.querySelector('[data-testid="plan.lock.back"]').getAttribute('href')).toBe('#/plan/' + id + '/plan');
    root.querySelector('[data-testid="plan.lock.lock"]').click();
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'lockConfirm' }]);
    const open = draw(lockState(entries, id, { open: ['lockConfirm'] }));
    const confirm = open.root.querySelector('[data-testid="plan.lock.confirmBox"]');
    expect(confirm).toBeTruthy();
    expect(confirm.textContent).toContain('Lock this plan?');
    expect(confirm.textContent).toContain('Its settings are fixed for both tools from now on');
    expect(confirm.textContent).toContain('You can undo this straight away');
    expect(open.root.querySelector('[data-testid="plan.lock.lock"]')).toBe(null);
    confirm.querySelector('[data-testid="plan.lock.confirm"]').click();
    expect(open.actions).toEqual([{ type: 'plan/lock', planId: id }]);
    confirm.querySelector('[data-testid="plan.lock.notNow"]').click();
    expect(open.actions[1]).toEqual({ type: 'ui/toggle', id: 'lockConfirm' });
  });
  it('the saver (10): the saver line', () => {
    const { root } = draw(lockState(entries, SAVER.id));
    expect(root.querySelector('[data-testid="plan.lock.saver"]').textContent).toBe('You can lock it while you are still saving: the plan then follows your pot each month until you stop.');
  });
  it('the lock under way: the working block, no button, no confirm; a problem from the write in plain words', () => {
    const working = draw(lockState(entries, id, { ui: { saving: { planId: id, kind: 'lock' } } }));
    expect(working.root.querySelector('[data-testid="plan.lock.working"]').textContent).toContain('Locking the plan and writing the plan document…');
    expect(working.root.querySelector('[data-region="plan-step"]').getAttribute('data-saving')).toBe('1');
    expect(working.root.querySelector('[data-testid="plan.lock.lock"]')).toBe(null);
    expect(working.root.querySelector('progress')).toBeTruthy();
    for (const [problem, words] of [['usedUp', 'Your free time without an account is used up. Sign in to keep and lock this plan.'], ['noWorker', 'This browser cannot run the plan’s test in the background'], ['locked', 'This plan is already locked. Nothing was changed.'], ['failed', 'Sorry, the plan could not be locked. Nothing was changed.'], ['nobody', 'Sign in to lock this plan. Nothing was changed.']]) {
      const { root } = draw(lockState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      const el = root.querySelector('[data-testid="plan.lock.problem"]');
      expect(el, problem).toBeTruthy();
      expect(el.textContent).toContain(words);
      expect(el.getAttribute('data-problem')).toBe(problem);
      expect(root.querySelector('[data-testid="plan.lock.lock"]'), problem).toBeTruthy();   // the button is back
    }
  });
  it('without an account: the window warning; the free time used up shows the problem after the press, as every step', () => {
    const win = draw(lockState(entries.slice(1, 2), DRAFT.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).toBeTruthy();
    expect(win.root.querySelector('[data-testid="plan.lock.lock"]')).toBeTruthy();
    const used = draw(lockState(entries.slice(1, 2), DRAFT.id, { source: 'window', session: 'nobody', ui: { saveProblem: { planId: DRAFT.id, problem: 'usedUp' } } }));
    expect(used.root.querySelector('[data-testid="plan.lock.problem"]').textContent).toBe(LOCK.problems.usedUp);
  });
  it('a plan shown as saved: no button, the sentence', () => {
    const newer = entries.map((e) => (e.plan.id === id ? { ...e, newer: true } : e));
    const { root } = draw(lockState(newer, id));
    expect(root.querySelector('[data-testid="plan.lock.lock"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.lock.readonly"]').textContent).toBe(LOCK.readonly);
    expect(root.querySelector('[data-testid="plan.readonly"]')).toBeTruthy();
  });
  it('the toast after the lock lands on "Your plan as locked" with Undo (the page moves there); Undo dispatches plan/undo', () => {
    // the plan as written: locked, with a document, as the plan source would read it again
    const locked = entriesAt(TODAY).map((e) => (e.plan.id === id ? { ...e, plan: { ...e.plan, decisionTool: { ...e.plan.decisionTool, settings: { ...e.plan.decisionTool.settings, locked: true, lockedAt: '2026-10-02T14:03:00.000Z', lockedBy: 'locked in the preview' } }, planDocument: LADDER.planDocument } } : e));
    const toast = { planId: id, kind: 'saved', previous: { 'decisionTool.settings.locked': false }, line: { id: 'locked', slots: { date: '2 October 2026' } }, op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' };
    const { root, actions } = draw(lockState(locked, id, { step: 'plan', ui: { toast } }));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan');
    expect(root.querySelector('h1').textContent).toBe('Your plan as locked');
    const t = root.querySelector('[data-testid="plan.plan.toast"]');
    expect(t).toBeTruthy();
    expect(t.textContent).toContain('Locked 2 October 2026. The plan document is written.');
    expect(t.getAttribute('role')).toBe('status');
    t.querySelector('[data-testid="plan.plan.undo"]').click();
    expect(actions).toEqual([{ type: 'plan/undo', planId: id }]);
    const undone = draw(lockState(locked, id, { step: 'plan', ui: { toast: { planId: id, kind: 'undone', previous: null, line: null, op: 'lock' } } }));
    expect(undone.root.querySelector('[data-testid="plan.plan.toast"]').textContent).toContain('Put back as it was.');
    // an editing step's toast never shows on "Your plan as locked" (it has no op)
    const plain = draw(lockState(locked, id, { step: 'plan', ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.duration': 30 }, line: null } } }));
    expect(plain.root.querySelector('[data-testid="plan.plan.toast"]')).toBe(null);
  });
});

describe('a locked plan by its address, and "Your plan as locked"', () => {
  const entries = entriesAt(TODAY);
  it('03 at #/plan/<id>/lock: "This plan is locked", the date, the link to "Your plan as locked", no button, not on the rail\'s list', () => {
    const { root, text } = draw(lockState(entries, LADDER.id));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.lock');
    expect(root.querySelector('h1').textContent).toBe('This plan is locked');
    expect(text).toContain('Locked 1 July 2026');
    expect(root.querySelector('[data-testid="plan.lock.lockedLine"]').textContent).toBe('Locked 1 July 2026. Its settings are fixed for both tools; the plan document records what you committed to.');
    expect(root.querySelector('[data-testid="plan.lock.seeLocked"]').getAttribute('href')).toBe('#/plan/' + LADDER.id + '/plan');
    expect(root.querySelector('[data-testid="plan.lock.lock"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.notListed"]')).toBeTruthy();
    expect(root.querySelector('[data-region="plan-step"]').getAttribute('data-locked')).toBe('1');
  });
  it('"Your plan as locked" (04): the four sentences first, the unlock line once with its button, the new-version button; the confirms dispatch plan/unlock and plan/newVersion', () => {
    const { root, text, actions } = draw(lockState(entries, BUCKETS.id, { step: 'plan' }));
    const lines = [...root.querySelectorAll('[data-region="plan-step"] > ul.plan-lines > li.plan-line')].map((li) => li.getAttribute('data-line'));
    expect(lines.slice(0, BUCKETS.planDocument.steps.length)).toEqual(Array(BUCKETS.planDocument.steps.length).fill('says.pays'));
    expect(lines).toContain('says.sp');
    expect(lines).toContain('says.bad');
    expect(lines).toContain('says.cuts');
    expect(text).toMatch(/From age \d+: £[\d,]+ a year before tax, £[\d,]+ a month after tax \(tax year \d{4}\/\d{2}\)/);
    expect(text).toMatch(/Your plan lasts in .+ out of 10\. Left at the end, at today’s prices: typically £[\d,]+; in a bad case \(the worst 1 in 10\) £[\d,]+/);
    expect(text).toMatch(/Income cuts: in a slump, after \d+ months? in a row below the plan’s line/);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(root.querySelector('[data-testid="plan.unlock"]').textContent).toBe('To change a locked plan, unlock it first from ‘Your plan as locked’. Unlocking keeps this plan document as a past version, and your records stay.');
    expect(root.querySelector('[data-testid="plan.plan.unlock"]').textContent).toBe('Unlock this plan');
    expect(root.querySelector('[data-testid="plan.plan.newVersion"]').textContent).toBe('Write a new version from today’s settings');
    root.querySelector('[data-testid="plan.plan.unlock"]').click();
    root.querySelector('[data-testid="plan.plan.newVersion"]').click();
    expect(actions).toEqual([{ type: 'ui/toggle', id: 'unlockConfirm' }, { type: 'ui/toggle', id: 'documentConfirm' }]);
    // the unlock's confirm: what it keeps, what it means; the defaults a plan locked before a setting existed gets
    const u = draw(lockState(entries, BUCKETS.id, { step: 'plan', open: ['unlockConfirm'] }));
    const uc = u.root.querySelector('[data-testid="plan.plan.unlockConfirm"]');
    expect(uc.textContent).toContain('Unlock this plan?');
    expect(uc.textContent).toContain('The plan document is kept as a past version (10 kept at most).');
    expect(uc.textContent).toContain('The settings can then change again.');
    expect(uc.textContent).toContain('fund and platform charges of 0.5% a year');
    expect(u.root.querySelector('[data-testid="plan.plan.unlock"]')).toBe(null);
    uc.querySelector('[data-testid="plan.plan.unlockConfirm.yes"]').click();
    expect(u.actions).toEqual([{ type: 'plan/unlock', planId: BUCKETS.id }]);
    uc.querySelector('[data-testid="plan.plan.unlockConfirm.no"]').click();
    expect(u.actions[1]).toEqual({ type: 'ui/toggle', id: 'unlockConfirm' });
    // the new version's confirm
    const d = draw(lockState(entries, BUCKETS.id, { step: 'plan', open: ['documentConfirm'] }));
    const dc = d.root.querySelector('[data-testid="plan.plan.documentConfirm"]');
    expect(dc.textContent).toContain('Write a new version of the plan document?');
    expect(dc.textContent).toContain('becomes a past version');
    expect(dc.textContent).toContain('Nothing else changes: the plan stays locked, and your recorded months are kept.');
    dc.querySelector('[data-testid="plan.plan.documentConfirm.yes"]').click();
    expect(d.actions).toEqual([{ type: 'plan/newVersion', planId: BUCKETS.id }]);
    // under way, and a problem
    const w = draw(lockState(entries, BUCKETS.id, { step: 'plan', ui: { saving: { planId: BUCKETS.id, kind: 'unlock' } } }));
    expect(w.root.querySelector('[data-testid="plan.plan.unlocking"]').textContent).toBe('Unlocking…');
    expect(w.root.querySelector('[data-testid="plan.plan.unlock"]')).toBe(null);
    const w2 = draw(lockState(entries, BUCKETS.id, { step: 'plan', ui: { saving: { planId: BUCKETS.id, kind: 'document' } } }));
    expect(w2.root.querySelector('[data-testid="plan.plan.writing"]').textContent).toContain('Running the plan’s test and writing the plan document…');
    const p = draw(lockState(entries, BUCKETS.id, { step: 'plan', ui: { saveProblem: { planId: BUCKETS.id, problem: 'noWorker' } } }));
    expect(p.root.querySelector('[data-testid="plan.plan.problem"]').textContent).toContain('This browser cannot run the plan’s test in the background');
    // the toasts of the unlock and the new version
    const ut = draw(lockState(entries, BUCKETS.id, { step: 'plan', ui: { toast: { planId: BUCKETS.id, kind: 'saved', previous: { planDocument: null }, line: { id: 'unlocked', slots: { date: '2 October 2026', versions: '1' } }, op: 'unlock' } } }));
    expect(ut.root.querySelector('[data-testid="plan.plan.toast"]').textContent).toContain('Unlocked. The plan document is kept as a past version (1 kept).');
    const dt = draw(lockState(entries, BUCKETS.id, { step: 'plan', ui: { toast: { planId: BUCKETS.id, kind: 'saved', previous: { planDocument: null }, line: { id: 'newVersion', slots: { date: '2 October 2026', versions: '1' } }, op: 'document' } } }));
    expect(dt.root.querySelector('[data-testid="plan.plan.toast"]').textContent).toContain('A new version of the plan document is written; the previous one is kept (1 kept).');
  });
  it('a plan locked before documents existed (06): "Write the plan document" and its own confirm', () => {
    const { root } = draw(lockState(entries, OLD.id, { step: 'plan', open: ['documentConfirm'] }));
    expect(root.querySelector('[data-testid="plan.plan.newVersion"]')).toBe(null);   // the confirm is open
    const dc = root.querySelector('[data-testid="plan.plan.documentConfirm"]');
    expect(dc.textContent).toContain('Write the plan document?');
    expect(dc.textContent).toContain('This plan was locked before plan documents existed, so it has none yet.');
    const closed = draw(lockState(entries, OLD.id, { step: 'plan' }));
    expect(closed.root.querySelector('[data-testid="plan.plan.newVersion"]').textContent).toBe('Write the plan document');
  });
  it('a locked plan shown as saved: no unlock button, no new version, the unlock line still once', () => {
    const newer = entries.map((e) => (e.plan.id === BUCKETS.id ? { ...e, newer: true } : e));
    const { root } = draw(lockState(newer, BUCKETS.id, { step: 'plan' }));
    expect(root.querySelector('[data-testid="plan.plan.unlock"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.plan.newVersion"]')).toBe(null);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
  });
  it('the lasts step still says the unlock line once, pointing to "Your plan as locked", and offers no unlock', () => {
    const { root } = draw(lockState(entries, BUCKETS.id, { step: 'lasts' }));
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(root.querySelector('[data-testid="plan.plan.unlock"]')).toBe(null);
  });
});

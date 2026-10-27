/**
 * "What you hold" drawn from its named states (research/v7/holdings-and-move.md §2, §7; road-to-7.md step 10):
 * tests/v7/states/plan/hold-*.json, written by `node tests/v7/states/build-states.mjs --question plan` — the reading left out
 * of the files and refreshed here through viewFor, as the plan source does on load. Every state is held to the words' rules
 * (the banned list in every scope a plan page is shown in, the record scope first: never "about £", never "wrapper",
 * "holdings", "transition" or "portfolio") and to the screen's contract: the headline the plan page says and the ruling under
 * it; the lines grouped Pension, ISA, Other account, Cash with their boxes, "Counted as", "as of" and Remove with its confirm
 * (never automatic); a line added by code or name through the bundled list, or as typed; a table pasted with "What is this?"
 * on every line the page cannot place, "Left out, and why" and "Not in what you pasted — sold?" with its own Remove; what you
 * hold as a mix with where new money goes; a locked plan fully editable with its snapshot named once; a plan shown as saved
 * with no box; without an account; the toast with Undo. No "test on what I hold", no copy from the funds to test. The
 * states carry the version they were made with, read from src/constants.js, never a literal.
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
import { parse } from '../../../src/v7/router/routes.js';
import { VERSION } from '../../../src/constants.js';
import { HOLD } from '../../../src/v7/copy/hold.js';
import { HOLD_FIELDS, HOLD_WRAPPERS } from '../../../src/answers/plan/schema.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('hold-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner', 'result'];
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const T = 'plan.hold';

/** A stored state with the reading refreshed (the files leave it out), then drawn. */
function draw(stored, ...actions) {
  let state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  for (const a of actions) state = reduce(state, typeof a === 'function' ? a(state) : a);
  state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const actionsOut = [];
  render(h(App, { state, dispatch: (a) => actionsOut.push(a) }), root);
  return { state, root, actions: actionsOut, text: visibleText(root), words: wordsOf(root) };
}
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const planOf = (s) => s.plans.list[0].plan;
/** Every box on the screen has a real label (a <label for>, or its own aria-label). */
function labelled(root) {
  return all(root, 'input, select, textarea').filter((el) => !(el.id && root.querySelector(`label[for="${el.id}"]`)) && !el.getAttribute('aria-label')).map((el) => el.id || el.name || el.tagName);
}

describe('the named states of "What you hold"', () => {
  it('are the set the builder writes (few and small: the locked record is made from the move\'s ladder state here), made with this version; each holds one plan and no reading', () => {
    expect(NAMES).toEqual(['hold-empty', 'hold-paste', 'hold-typed']);
    expect(MADE.version).toBe(VERSION);
    expect(MADE.patched).toEqual([]);
    for (const name of NAMES) { const s = load(name); expect(s.plans.list, name).toHaveLength(1); expect(s.plans.view, name).toBeUndefined(); expect(s.move.status).toBe('idle'); }
  });
  it.each(NAMES)('%s survives JSON, carries this version and is drawn on #/plan/<id>/hold as its own screen, the hold step current on the rail', (name) => {
    const s = load(name);
    expect(s.env.appVersion).toBe(VERSION);
    expect(s.route).toMatchObject({ screen: 'plan', step: 'hold' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const { root } = draw(s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.hold');
    expect(one(root, 'plan.step.hold').textContent).toBe(HOLD.title);
    expect(root.querySelectorAll('[data-region="rail"] [aria-current="step"]').length).toBe(1);
    expect(root.querySelector('[data-testid="rail.plan.hold"]').getAttribute('aria-current')).toBe('step');
    expect(labelled(root)).toEqual([]);
  });
  it.each(NAMES)('%s: no banned word in any scope a plan page is shown in (the record scope first), no "about £", no countdown, no rubbish, never the planner\'s words, never a copy from the funds to test', (name) => {
    const { text, words } = draw(load(name));
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £|around £/i);
    expect(COUNTDOWN.test(words)).toBe(false);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\bledger\b|\btransition\b|\bportfolio\b|\bnominal\b|Monte Carlo|\bMC\b|\bp10\b/i);
    expect(words).not.toMatch(/test (it )?on what (I|you) hold|copy (from|the funds)|funds to test/i);
    expect(text).toContain(HOLD.lead);
  });
});

describe('the record, line by line (§2.1)', () => {
  it('hold-empty: "Not recorded yet", the ruling, nothing on the record, the add box with the bundled list\'s matches and "as typed", the paste closed, the mix empty; a match pressed sends one add', () => {
    const { root, text, actions } = draw(load('hold-empty'));
    expect(one(root, `${T}.headline`).textContent).toBe(HOLD.headline.none);
    expect(one(root, `${T}.none`).textContent).toBe(HOLD.none);
    expect(all(root, '.hold-line').length).toBe(0);
    expect(one(root, `${T}.locked`)).toBe(null);
    expect(one(root, `${T}.atLock`)).toBe(null);
    // the add box: what was typed ("vanguard all-world") against the bundled list
    expect(one(root, 'plan.hold.add.text').value).toBe('vanguard all-world');
    expect(one(root, 'plan.hold.add.wrapper.SIPP').checked).toBe(true);
    const matches = all(root, `[data-testid^="${T}.add.match."]`);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((b) => /VWRP|VWRL/.test(b.textContent))).toBe(true);
    expect(one(root, `${T}.add.asTyped`).textContent).toBe('Add ‘vanguard all-world’ as typed');
    const vwrp = matches.find((b) => b.getAttribute('data-testid') === `${T}.add.match.fund:VWRP`) || matches[0];
    vwrp.click();
    const sent = actions.pop();
    expect(sent.type).toBe('plan/hold');
    expect(sent.change.kind).toBe('add');
    expect(sent.change.line).toMatchObject({ wrapper: 'SIPP', kind: 'fund' });
    expect(sent.change.line.ticker).toMatch(/^[A-Z0-9]+$/);
    // the paste is closed until opened; the mix has nothing to say
    expect(one(root, `${T}.paste.box`)).toBe(null);
    expect(one(root, `${T}.paste.open`).textContent).toBe(HOLD.paste.open);
    expect(one(root, `${T}.mix.none`).textContent).toBe(HOLD.mix.none);
    expect(text).toContain(HOLD.mix.note);
    one(root, `${T}.paste.open`).click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'holdPaste' });
  });
  it('hold-typed: the saver\'s record — the headline with its date, Pension and ISA groups with their totals, each line\'s boxes (new money and the charge for a saver), "Counted as", the mix and where new money goes, the lock\'s snapshot named once; a box left changed sends one edit; Remove asks first', () => {
    const s = load('hold-typed');
    const { root, text, actions } = draw(s);
    const plan = planOf(s);
    expect(one(root, `${T}.headline`).textContent).toBe('Pension £310,000, ISA £40,030. Updated 18 May 2026.');
    expect(one(root, `${T}.source`).textContent).toBe(HOLD.recordSource.typed);
    expect(all(root, '.hold-group').map((g) => g.getAttribute('data-wrapper'))).toEqual(['SIPP', 'ISA']);
    expect(one(root, `${T}.group.SIPP`).querySelector('h3').textContent).toBe('Pension £310,000 in all');
    expect(all(root, '.hold-line').length).toBe(plan.holdings.lines.length);
    const first = one(root, `${T}.line.0`);
    expect(first.querySelector('legend').textContent).toContain('Vanguard FTSE All-World (Acc)');
    expect(first.querySelector('legend').textContent).toContain('Code VWRP');
    expect(one(root, `${T}.line.0.counted`).textContent).toBe('Counted as: shares · as of 15 May 2026');
    expect(one(root, 'plan.hold.line.0.units').value).toBe('2080');
    expect(one(root, 'plan.hold.line.0.value').value).toBe('252300');
    expect(one(root, 'plan.hold.line.0.contribution').value).toBe('900');
    expect(one(root, 'plan.hold.line.0.ocf').value).toBe('0.19');
    expect(one(root, `${T}.line.1.counted`).textContent).toContain('Counted as: bonds');
    expect(one(root, `${T}.mix.line`).textContent).toBe('Shares 84%, bonds 16%, gold and trend 0%, cash 0% — on £350,030 across your accounts.');
    expect(one(root, `${T}.mix.charge`).textContent).toBe('Yearly charge, weighted: 0.18%.');
    expect(one(root, `${T}.mix.newMoney`).textContent).toBe('New money goes: £1,150 a month to shares, £300 a month to bonds — £1,450 a month in all.');
    expect(one(root, `${T}.locked`).textContent).toBe(HOLD.locked);
    expect(one(root, `${T}.atLock`).textContent).toBe('Your plan was locked on 15 July 2026 with Pension £310,000, ISA £40,030 recorded on 18 May 2026.');
    expect(text).toContain(HOLD.line.saveNote);
    // Remove asks first, on the screen; nothing is removed by itself
    one(root, `${T}.line.0.remove`).click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: plan.id, path: 'remove.index', value: '0' });
    const asked = draw(s, { type: A.PLAN_EDIT, planId: plan.id, path: 'remove.index', value: '0' });
    const confirm = one(asked.root, `${T}.line.0.removeConfirm`);
    expect(confirm.textContent).toContain('Remove ‘Vanguard FTSE All-World (Acc)’ from your pension? Nothing is sold; this only changes the record.');
    one(asked.root, `${T}.line.0.removeConfirm.yes`).click();
    expect(asked.actions.pop()).toEqual({ type: 'plan/hold', planId: plan.id, change: { kind: 'remove', index: 0 } });
    one(asked.root, `${T}.line.0.removeConfirm.no`).click();
    expect(asked.actions.pop()).toEqual({ type: 'plan/edit', planId: plan.id, path: 'remove.index', value: '' });
    // a box changed and left: one write of that field (the reading says the change; the screen sends it on leaving the box)
    const typed = draw(s, { type: A.PLAN_EDIT, planId: plan.id, path: 'line.0.value', value: '300,000' });
    const box = one(typed.root, 'plan.hold.line.0.value');
    expect(box.value).toBe('300,000');
    box.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(typed.actions.some((a) => a.type === 'plan/hold' && a.change.kind === 'edit' && a.change.index === 0 && a.change.field === 'value' && a.change.value === 300000)).toBe(true);
    // a wrong figure is said beside its box once left, and sends nothing
    const wrong = draw(s, { type: A.PLAN_EDIT, planId: plan.id, path: 'line.0.units', value: 'many' }, { type: A.PLAN_TOUCH, planId: plan.id, path: 'line.0.units' });
    expect(wrong.root.querySelector('[data-error-for="plan.hold.line.0.units"]').textContent).toBe(HOLD.errors.notANumber);
    one(wrong.root, 'plan.hold.line.0.units').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(wrong.actions.some((a) => a.type === 'plan/hold')).toBe(false);
  });
  it('the locked ladder\'s record (from the move\'s ladder state): four accounts\' lines incl. the gilts by their codes and the bank cash, "Not counted in the mix" naming them, Remove on the cash line asks in that account\'s words, the snapshot named once', () => {
    const s = load('move-ladder');
    const plan = planOf(s);
    const { root, text, words } = draw(s, { type: A.ROUTE_SET, route: parse('#/plan/' + plan.id + '/hold') }, { type: A.PLAN_EDIT, planId: plan.id, path: 'remove.index', value: '7' });
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.hold');
    expect(one(root, `${T}.headline`).textContent).toBe('Pension £1,050,008, ISA £79,962, cash £12,500. Updated 20 June 2026.');
    expect(all(root, '.hold-group').map((g) => g.getAttribute('data-wrapper'))).toEqual(['SIPP', 'ISA', 'CASH']);
    expect(one(root, `${T}.line.0.counted`).textContent).toContain('Counted as: a gilt (T27)');
    expect(one(root, `${T}.line.4.counted`).textContent).toContain('Counted as: cash');
    expect(one(root, `${T}.line.7.counted`).textContent).toContain('Counted as: cash in the bank');
    // the gilts by their codes count as bonds since 6.45.0 (Holdings.giltsAsBonds, a correction of road step 11b); the bank cash alone is outside the mix
    expect(one(root, `${T}.mix.notCounted`).textContent).toBe('Not counted in the mix: Easy-access savings.');
    expect(one(root, `${T}.line.7.removeConfirm`).textContent).toContain('Remove ‘Easy-access savings’ from your cash? Nothing is sold; this only changes the record.');
    expect(one(root, `${T}.locked`)).not.toBe(null);
    expect(one(root, `${T}.atLock`).textContent).toBe('Your plan was locked on 1 July 2026 with Pension £1,050,008, ISA £79,962, cash £12,500 recorded on 20 June 2026.');
    expect(one(root, 'plan.hold.line.0.contribution'), 'a retired person is not asked for new money a month').toBe(null);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £/);
  });
});

describe('the paste, where every line counts (§2.1)', () => {
  it('hold-paste: the box open with the table, every line read — one recognised, one answered "bonds" under "What is this?" —, the total line under "Left out, and why", the lines of that account not in the paste under "sold?" each with its own Remove, "Add these lines to your pension" sending one paste with the answers', () => {
    const s = load('hold-paste');
    const plan = planOf(s);
    const { root, text, actions } = draw(s);
    expect(one(root, `${T}.source`).textContent).toBe(HOLD.recordSource.paste);
    expect(one(root, `${T}.paste.box`)).not.toBe(null);
    expect(one(root, 'plan.hold.paste.wrapper').value).toBe('SIPP');
    expect(all(root, '#plan\\.hold\\.paste\\.wrapper option').map((o) => o.value)).toEqual([...HOLD_WRAPPERS]);
    const rows = all(root, `[data-testid="${T}.paste.rows"] tbody tr`);
    expect(rows.length).toBe(2);
    expect(rows[0].getAttribute('data-unrecognised')).toBe('0');
    expect(rows[0].textContent).toContain('Read as iShares Core MSCI World');
    expect(rows[1].getAttribute('data-unrecognised')).toBe('0');
    expect(one(root, `${T}.paste.2.what`).value).toBe('bonds');
    expect(rows[1].textContent).toContain(HOLD.paste.answered);
    expect(one(root, `${T}.paste.summary`).textContent).toContain('2 lines read, £285,000 in all.');
    expect(one(root, `${T}.paste.summary`).textContent).toContain('updates 1 you already have and adds 1');
    expect(one(root, `${T}.paste.leftOut`).textContent).toContain('Line 3 “Total”: a total line, not something you hold.');
    // the lines of the pension not in the paste are listed as "sold?", never removed by themselves
    const unseen = all(root, `[data-testid="${T}.paste.unseen"] li`);
    expect(unseen.map((li) => li.getAttribute('data-index'))).toEqual(['1', '2']);
    expect(text).toContain(HOLD.paste.unseenTitle);
    one(root, `${T}.paste.unseen.1.remove`).click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: plan.id, path: 'remove.index', value: '1' });
    expect(one(root, `${T}.paste.add`).textContent).toBe('Add these lines to your pension');
    one(root, `${T}.paste.add`).click();
    const sent = actions.pop();
    expect(sent).toMatchObject({ type: 'plan/hold', planId: plan.id, change: { kind: 'paste', wrapper: 'SIPP', answers: { 2: 'bonds' } } });
    expect(sent.change.text).toContain('iShares Core MSCI World');
    // the answer changed: one edit of the paste's own box
    one(root, `${T}.paste.2.what`).value = 'unknown';
    one(root, `${T}.paste.2.what`).dispatchEvent(new Event('change', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: plan.id, path: 'paste.2.what', value: 'unknown' });
    one(root, `${T}.paste.clear`).click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: plan.id, path: 'paste.text', value: '' });
  });
  it('a paste nothing can be read from says so; an unanswered line stays "not recognised" and the paste can still be added (it counts, unplaced)', () => {
    const s = load('hold-empty');
    const plan = planOf(s);
    const junk = draw(s, { type: A.UI_TOGGLE, id: 'holdPaste' }, { type: A.PLAN_EDIT, planId: plan.id, path: 'paste.text', value: '  \n' });
    expect(one(junk.root, `${T}.paste.rows`)).toBe(null);
    expect(one(junk.root, `${T}.paste.add`)).toBe(null);
    const odd = draw(s, { type: A.UI_TOGGLE, id: 'holdPaste' }, { type: A.PLAN_EDIT, planId: plan.id, path: 'paste.text', value: 'Investment,Units,Value\nA fund of my own,10,£1,000' });
    const row = odd.root.querySelector(`[data-testid="${T}.paste.rows"] tbody tr`);
    expect(row.getAttribute('data-unrecognised')).toBe('1');
    expect(row.textContent).toContain(HOLD.paste.unrecognised);
    expect(one(odd.root, `${T}.paste.summary`).textContent).toContain('1 not recognised (£1,000): say what each is under “What is this?” and they count.');
    expect(one(odd.root, `${T}.paste.add`)).not.toBe(null);
  });
});

describe('the states a person meets: shown as saved, without an account, the toast with Undo, a problem', () => {
  it('a plan shown as saved: the lines read-only, no box, no add, no paste, no Remove', () => {
    const s = load('hold-typed');
    const { root } = draw(s, (st) => ({ type: A.PLANS_SET, list: st.plans.list.map((e) => ({ ...e, newer: true })), source: 'account', readAt: '14:04' }));
    expect(one(root, `${T}.readonly`).textContent).toBe(HOLD.readonly);
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect(one(root, `${T}.add`)).toBe(null);
    expect(one(root, `${T}.paste`)).toBe(null);
    expect(all(root, `[data-testid$=".remove"]`).length).toBe(0);
    expect(all(root, '.hold-line').length).toBe(3);
  });
  it('without an account: the window warning, and everything still editable', () => {
    const s = load('hold-typed');
    const { root } = draw(s, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } }, { type: A.PLANS_SET, list: s.plans.list, source: 'window', readAt: '14:04' });
    expect(one(root, 'plan.windowWarning')).not.toBe(null);
    expect(one(root, `${T}.add`)).not.toBe(null);
    expect(one(root, `${T}.line.0.remove`)).not.toBe(null);
  });
  it('the toast after each kind of write, with Undo; "Put back as it was."; the problem line; the move step linked', () => {
    const s = load('hold-typed');
    const plan = planOf(s);
    const added = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { holdings: plan.holdings }, line: { id: 'added', slots: { name: 'Vanguard FTSE All-World (Acc)', wrapper: 'ISA' } }, op: 'hold' });
    expect(one(added.root, `${T}.toast`).textContent).toContain('Saved. ‘Vanguard FTSE All-World (Acc)’ added to your ISA.');
    one(added.root, `${T}.undo`).click();
    expect(added.actions.pop()).toEqual({ type: 'plan/undo', planId: plan.id });
    const pasted = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { holdings: plan.holdings }, line: { id: 'pasted', slots: { updated: '2', added: '1', wrapper: 'SIPP' } }, op: 'hold' });
    expect(one(pasted.root, `${T}.toast`).textContent).toContain('Saved. 2 lines updated, 1 added to your pension.');
    const removed = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { holdings: plan.holdings }, line: { id: 'removed', slots: { name: 'X', wrapper: 'CASH' } }, op: 'hold' });
    expect(one(removed.root, `${T}.toast`).textContent).toContain('Saved. ‘X’ removed from your cash.');
    const undone = draw(s, { type: A.PLAN_SAVED, planId: plan.id, previous: { holdings: plan.holdings }, line: { id: 'edited', slots: { name: 'X' } }, op: 'hold' }, { type: A.PLAN_UNDO, planId: plan.id }, { type: A.PLAN_UNDO_DONE, planId: plan.id });
    expect(one(undone.root, `${T}.toast`).textContent).toContain(HOLD.toast.undone);
    const problem = draw(s, { type: A.PLAN_SAVE_FAILED, planId: plan.id, problem: 'problems' });
    expect(one(problem.root, `${T}.problem`).textContent).toBe(HOLD.problems.problems);
    expect(one(problem.root, `${T}.move`).getAttribute('href')).toBe('#/plan/' + plan.id + '/move');
    expect(one(problem.root, `${T}.back`).getAttribute('href')).toBe('#/plan/' + plan.id + '/plan');
  });
  it('every box of the step has words and a sentence for every problem', () => {
    for (const f of HOLD_FIELDS) {
      if (f.path === 'remove.index') continue;
      const [block, name] = f.path.split('.');
      const words = block === 'add' ? HOLD.add.fields[name] : HOLD.paste[name === 'text' ? 'label' : 'wrapper'];
      expect(words, f.path).toBeTruthy();
    }
    for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption']) expect(HOLD.errors[id]).toBeTypeOf('string');
    for (const w of HOLD_WRAPPERS) { expect(HOLD.wrappers[w]).toBeTypeOf('string'); expect(HOLD.wrapperOf[w]).toBeTypeOf('string'); }
  });
});

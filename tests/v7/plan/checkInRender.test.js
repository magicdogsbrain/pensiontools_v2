/**
 * "Check in", drawn (research/saving-enough-and-check-in.md 5.4–5.7; release step R3): on #/plan/<id>/checkin and on the
 * pot step's old address, its own screen with the step current on the rail. The first check-in of an unlocked saver (the
 * boxes, the pots never filled in, how often asked); the result just after a check-in in B's own sentences, the pot
 * against the path, what changed, the next date and "Add to my calendar"; the same check-in read again later from what
 * it kept; "Your check-ins"; a locked saver who never chose ("Each month" kept); a drawing plan (no boxes); "Check-in
 * due" on the plans list; the second button of Keep. Every box labelled; no banned word, no countdown, nothing broken.
 * Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { checkInPatch, checkInDraft } from '../../../src/answers/plan/checkIn.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { CHECKIN as W } from '../../../src/v7/copy/checkin.js';
import { fill } from '../../../src/v7/components/index.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { corpus, entryOf, stateWith, noon } from './_plans.js';
import { planPage } from '../../../src/answers/plan/read.js';

const C = corpus();
const SCOPES = ['all', 'record', 'saver', 'planner', 'result'];
const T = 'plan.checkin';
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const copy = (v) => JSON.parse(JSON.stringify(v));

function draw(state) {
  const s = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state: s, dispatch: (a) => out.push(a) }), root);
  const words = root.cloneNode(true);
  for (const el of words.querySelectorAll('.plan-name, .checkin-note')) el.remove();
  return { state: s, root, actions: out, text: visibleText(root), words: visibleText(words) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const labelled = (root) => [...root.querySelectorAll('input, select, textarea')].filter((el) => !(el.id && root.querySelector(`label[for="${el.id}"]`)) && !el.closest('fieldset')).map((el) => el.id || el.name);
const clean = (words) => { expect(bannedHits(words, SCOPES)).toEqual([]); expect(words).not.toMatch(COUNTDOWN); expect(words).not.toMatch(/undefined|NaN|\[object|\{\w+\}/); };

/** Sam, 41 (fictional), kept from "Am I saving enough?": an unlocked saver. */
function samPlan(today) {
  const inputs = { household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95 };
  const result = answerB(inputs, { today: '2026-11-04', futures: 100, seed: 0, trace: false, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: '2026-11-04', appVersion: 'test' }, name: 'Sam saving', createdAt: '2026-11-04T10:00:00.000Z', payIn: 'now' });
  const made = seedToScenario(seed, '2026-11-04').yours;
  made.id = 'SamSaving01';
  return upgradeScenario(copy(made), { now: noon(today) }).scenario;
}
/** A check-in on `today` with B's own answer (1,000 futures: the words count out of 1,000), the plan after it and the answer. */
function checkedIn(plan, today, typed) {
  const d = checkInDraft(plan, typed, { today });
  const result = d.read.ok ? answerB(d.read.inputs, { today, futures: 1000, seed: 0, trace: false, detail: 'answer', ...d.read.env }) : null;
  const p = checkInPatch(plan, typed, { today, now: noon(today), result });
  return { plan: applyPatch(plan, { ...p.patch, lastModified: today + 'T12:00:00.000Z' }), result, record: p.record };
}

describe('"Check in", drawn', () => {
  it('an unlocked saver\'s first check-in: its own screen, current on the rail; the pots typed, never filled in; what goes in as a share; how often asked; every box labelled; no banned word', () => {
    const today = '2026-11-20';
    const plan = samPlan(today);
    const { root, words } = draw(stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/checkin', { today, source: 'window', session: 'nobody' }));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.checkin');
    expect(one(root, 'plan.step.checkin').textContent).toBe(W.title);
    expect(root.querySelector('[data-testid="rail.plan.checkin"]').getAttribute('aria-current')).toBe('step');
    expect(words).toContain(W.firstLead);
    expect(one(root, `${T}.ci.pension`).value).toBe('');
    expect(one(root, `${T}.ci.isa`).value).toBe('');
    expect(words, 'a blank ISA box at the first check-in leaves them out of the path, and says so').toContain(W.fields['ci.isa'].helpFirst);
    expect(one(root, `${T}.ci.kind.share`).checked).toBe(true);
    expect(one(root, `${T}.ci.pay`).value).toBe('38000');
    expect(one(root, `${T}.ci.ownPct`).value).toBe('6');
    expect(one(root, `${T}.ci.employerPct`).value).toBe('4');
    expect(one(root, `${T}.ci.own`)).toBe(null);
    expect(one(root, `${T}.ci.since`), 'no "since" before a first check-in').toBe(null);
    expect(one(root, `${T}.ci.every.year`).checked).toBe(true);
    expect(words).toContain(W.fields['ci.every'].label);
    expect(words).toContain(W.fields['ci.note'].help);
    expect(one(root, `${T}.submit`).textContent).toBe(W.button);
    expect(one(root, `${T}.history.none`)).not.toBe(null);
    expect(one(root, `${T}.again`)).toBe(null);
    expect(labelled(root)).toEqual([]);
    clean(words);
  });
  it('just after a check-in: the verdict and what would be enough in B\'s own sentences, the path starting here, the next date and the calendar; the history row', () => {
    const today = '2026-11-20';
    const { plan, result } = checkedIn(samPlan(today), today, { 'ci.pension': '64500', 'ci.isa': '3200', 'ci.note': 'A note for me.' });
    let s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/checkin', { today, source: 'window', session: 'nobody' });
    s = reduce(s, { type: A.CHECKIN_SHOWN, planId: plan.id, date: today, result });
    const { root, words } = draw(s);
    const box = one(root, `${T}.result`);
    expect(box.getAttribute('data-live')).toBe('1');
    expect(box.querySelector('h2').textContent).toBe('Checked in for November 2026');
    expect(box.textContent).toContain(result.sentences.verdictHead.text);
    expect(box.textContent).toContain(result.sentences.verdictLine.text);
    if (result.sentences.enoughHead) expect(one(root, `${T}.result.enough`).textContent).toContain(result.sentences.enoughHead.text);
    expect(one(root, `${T}.result.path`).getAttribute('data-band')).toBe('start');
    expect(one(root, `${T}.result.path`).textContent).toContain(W.result.path.start);
    expect(one(root, `${T}.next`).textContent).toBe('Next check-in: November 2027.');
    expect(one(root, `${T}.calendar`).textContent).toBe(W.result.calendar);
    // 7.3.0: nothing is due now, so the boxes wait for "Check in now anyway"; asked for, they come back under the result, and
    // another check-in this month replaces this one, as the form says
    expect(one(root, `${T}.again`)).toBe(null);
    expect(one(root, `${T}.anyway`).textContent).toBe(W.anyway);
    const anyway = draw(reduce(s, { type: A.UI_TOGGLE, id: 'checkInAnyway' }));
    expect(one(anyway.root, `${T}.again`).textContent).toBe(W.again);
    const rows = root.querySelectorAll(`[data-testid="${T}.history.table"] tbody tr[data-date]`);
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('£64,500 pension, £3,200 ISAs and savings');
    expect(rows[0].textContent).toContain('10% of your pay in all (£317 a month)');
    expect(rows[0].textContent).toContain('A note for me.');
    expect(root.textContent).toContain('Read against the path from November 2026 (your first check-in)');
    // "Add to my calendar" asks the download effect for the file; nothing else
    const r = draw(s);
    one(r.root, `${T}.calendar`).click();
    expect(r.actions).toEqual([{ type: 'plan/calendar', planId: plan.id }]);
    clean(words);
  }, 60000);
  it('a year on: read again from what it kept, then checked in again — against the path, what changed, then and now; "Use these in my plan"', () => {
    const first = checkedIn(samPlan('2026-11-20'), '2026-11-20', { 'ci.pension': '64500' }).plan;
    const today = '2027-11-22';
    const aged = upgradeScenario(copy(first), { now: noon(today) }).scenario;
    // due: the rail, the next sentence and the plans list say so
    const due = draw(stateWith([{ plan: aged, newer: false, failed: false }], '#/plan/' + aged.id + '/checkin', { today, source: 'window', session: 'nobody' }));
    expect(one(due.root, `${T}.result`).getAttribute('data-live')).toBe('0');
    expect(one(due.root, `${T}.result.kept`)).not.toBe(null);
    expect(due.text).toContain('Due: your yearly check-in (the last was November 2026)');
    expect(one(due.root, `${T}.again`), 'the last check-in is from another month').toBe(null);
    expect(due.text).toContain('Next: your yearly check-in (the last was November 2026).');
    const list = draw(stateWith([{ plan: aged, newer: false, failed: false }], '#/plans', { today, source: 'window', session: 'nobody' }));
    // (7.3.0, retaken on purpose: the row's to-do count covers the check-in due, so the old "Check-in due." mark is said only
    // on a row with no count) — the row says "1 to do", and its home lists the check-in first
    expect(one(list.root, `plans.checkInDue.${aged.id}`)).toBe(null);
    const dueNow = planPage([{ plan: aged, newer: false, failed: false }], aged.id, null, { today, source: 'window' }).due;
    expect(dueNow.map((d) => d.id)).toContain('checkin.due');
    expect(one(list.root, `plans.todo.${aged.id}`).getAttribute('data-count')).toBe(String(dueNow.length));
    clean(due.words);
    // the second check-in: pay-in raised from December
    const { plan, result } = checkedIn(aged, today, { 'ci.pension': '74600', 'ci.ownPct': '16', 'ci.since': '2026-12', 'ci.paused': 'no' });
    let s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/checkin', { today, source: 'window', session: 'nobody' });
    s = reduce(s, { type: A.CHECKIN_SHOWN, planId: plan.id, date: today, result });
    const { root, words } = draw(s);
    expect(one(root, `${T}.result.path`).getAttribute('data-band')).not.toBe('start');
    expect(one(root, `${T}.result.path`).textContent).toMatch(/^Against your saving path(Your pension of £74,600 is (below|between|above) )/);
    expect(one(root, `${T}.result.path`).textContent).toContain('the worst 1 in 10');
    const changed = one(root, `${T}.result.changed`).textContent;
    expect(changed).toContain('Since your last check-in (November 2026)');
    expect(changed).toContain('Your pension went from £64,500 to £74,600.');
    expect(changed).toContain('£317 a month for 1 month and £633 a month for 11 months, £7,280 in all.');
    expect(one(root, `${T}.result.rest`).textContent).toMatch(/^Markets, charges and anything not recorded: [+−]£[\d,]+\.$/);
    // (7.8.0: readings of the level, said as chances)
    expect(one(root, `${T}.result.thenNow`).textContent).toMatch(/^Then: lasted .+ times in 20\. Now: .+ times in 20\./);
    expect(one(root, `${T}.useInPlan`).textContent).toContain('You now pay in 20% in all; your plan says 10%.');
    expect(one(root, `${T}.use`).textContent).toBe('Use 20% in my plan');
    expect(one(root, `${T}.result.pathDiffers`).textContent).toBe('The path was drawn paying in £317 a month; you now pay in £633.');
    expect(one(root, `${T}.restart`).textContent).toBe(W.result.restart);
    expect(root.querySelectorAll(`[data-testid="${T}.history.table"] tbody tr[data-date]`)).toHaveLength(2);
    // the boxes again, asked for ("Check in now anyway", 7.3.0): "since" now there is a check-in before
    const anyway = draw(reduce(s, { type: A.UI_TOGGLE, id: 'checkInAnyway' })).root;
    expect(one(anyway, `${T}.ci.since`)).not.toBe(null);
    expect(one(anyway, `${T}.ci.every.year`).checked).toBe(true);
    clean(words);
  }, 120000);
  it('a plan locked while saving that never chose: the step reads as its pot step did, the lock\'s note, "Each month" kept; the pot step\'s address opens it', () => {
    const e = entryOf(C['05-saver-committed'], '2026-10-02');
    for (const hash of ['#/plan/' + e.plan.id + '/checkin', '#/plan/' + e.plan.id + '/pot']) {
      const { root, words, text } = draw(stateWith([e], hash, { today: '2026-10-02' }));
      expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.checkin');
      expect(root.querySelector('[data-testid="rail.plan.checkin"]').getAttribute('aria-current')).toBe('step');
      expect(text).toContain('October’s pot is not recorded yet');
      expect(text).toContain('Your plan is locked and you stop work in February 2038. Next: record this month’s pot.');
      expect(one(root, `${T}.locked`).textContent).toBe(W.locked);
      expect(one(root, `${T}.ci.every.month`).checked).toBe(true);
      expect(one(root, `${T}.ci.kind.split`).checked).toBe(true);
      expect(one(root, 'plan.notListed')).toBe(null);
      expect(labelled(root)).toEqual([]);
      clean(words);
    }
  });
  it('a couple\'s plan: the verdict says it reads this plan on its own, and that the plan keeps what goes in level in pounds — as What you pay in says', () => {
    const today = '2026-11-20';
    const e = entryOf(C['10-couple-b'], today);
    expect(e.plan.household.partnerScenarioId).toBeTruthy();
    const { plan, result } = checkedIn(e.plan, today, { 'ci.pension': '230000' });
    expect(result && result.verdict).toBeTruthy();
    // read again later (the kept verdict), and just after (B's own sentences): the notes either way
    for (const live of [false, true]) {
      let s = stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/checkin', { today });
      if (live) s = reduce(s, { type: A.CHECKIN_SHOWN, planId: plan.id, date: today, result });
      const { root, words } = draw(s);
      expect(one(root, `${T}.result`).getAttribute('data-live')).toBe(live ? '1' : '0');
      expect(one(root, `${T}.result.couple`).textContent).toBe(W.result.couple);
      expect(one(root, `${T}.result.rise`).textContent).toBe(W.result.riseNone);
      clean(words);
    }
    // a single person's plan whose pay-in rises with prices: neither note
    const sam = checkedIn(samPlan(today), today, { 'ci.pension': '64500' });
    const { root } = draw(reduce(stateWith([{ plan: sam.plan, newer: false, failed: false }], '#/plan/' + sam.plan.id + '/checkin', { today }), { type: A.CHECKIN_SHOWN, planId: sam.plan.id, date: today, result: sam.result }));
    expect(one(root, `${T}.result.couple`)).toBe(null);
    expect(one(root, `${T}.result.rise`)).toBe(null);
  }, 120000);
  it('a plan locked before 6.22.0, a year after its lock: the pot is said beside lines in its own pounds, and the words say so', () => {
    const today = '2027-07-10';
    const e = entryOf(C['05-saver-committed'], today);
    const p = checkInPatch(e.plan, { 'ci.pension': '340575', 'ci.isa': '42000' }, { today, now: noon(today), result: null });
    const plan = applyPatch(e.plan, { ...p.patch, lastModified: today + 'T12:00:00.000Z' });
    const { root, words } = draw(stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/checkin', { today }));
    const path = one(root, `${T}.result.path`);
    expect(path.getAttribute('data-band')).toBe('lower');
    const m = /Your pension of £340,575 is between the bad-case line \(£([\d,]+)\) and the middle \(£([\d,]+)\)/.exec(path.textContent);
    expect(m, path.textContent).not.toBe(null);
    const n = (t) => +t.replace(/,/g, '');
    expect(n(m[1])).toBeLessThan(340575);
    expect(n(m[2])).toBeGreaterThan(340575);
    expect(one(root, `${T}.result.prices`).textContent).toBe(fill(W.result.path.prices, { from: 'July 2026', month: 'July 2027' }));
    clean(words);
  });
  it('a drawing plan: no boxes, the words say why; at the pot step\'s old address, the step is not on its list', () => {
    const e = entryOf(C['04-buckets-running'], '2026-10-02');
    const { root, words } = draw(stateWith([e], '#/plan/' + e.plan.id + '/pot', { today: '2026-10-02' }));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.checkin');
    expect(one(root, `${T}.notSaving`).textContent).toBe(W.notSaving);
    expect(root.querySelector('h1').textContent, 'the page is the plan\'s saving years, read only').toBe(W.savingYearsTitle);
    expect(root.querySelector(`[data-testid="${T}.submit"]`)).toBe(null);
    expect(root.querySelector('input')).toBe(null);
    expect(one(root, 'plan.notListed')).not.toBe(null);
    expect(bannedHits(words, ['all', 'record', 'retired'])).toEqual([]);
  });
  it('a plan with no age yet: no boxes, and the way to add the ages', () => {
    const e = entryOf(C['01-fresh-default'], '2026-10-02');
    const { root, words } = draw(stateWith([e], '#/plan/' + e.plan.id + '/checkin', { today: '2026-10-02' }));
    expect(one(root, `${T}.noAge`).textContent).toBe(W.noAge + ' ' + W.aboutLink);
    expect(one(root, `${T}.noAge`).querySelector('a').getAttribute('href')).toBe('#/plan/' + e.plan.id + '/about');
    expect(root.querySelector('input')).toBe(null);
    clean(words);
  });
  it('Keep\'s second button for a saver: the plan\'s first check-in', () => {
    expect(KEEP.firstCheckIn).toBe('Start your first check-in');
  });
});

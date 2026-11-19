/**
 * A plan's home (7.3.0; research/v7/one-product-design.md, "The plan home", "The to-do reader", "The stage model" — the
 * derived part only). Reads only: nothing new is written to any plan.
 *
 *   - the three words: stageOf over the eight placings, with nothing stored (no stage, no agreement, no finished move);
 *   - every committed plan at the three dates the stage tests use → the stage word, the to-dos in order, the nothing-due line;
 *   - one engine: on every plan, every address, the rail's "Next" is the first thing due (read.js dueFor), and the home's
 *     first to-do is the rail's "Next";
 *   - the nothing-due line is only ever a true, dated sentence; a drawing plan with nothing due always has one;
 *   - "Not now" (7.10.0: stored on the plan, answers/plan/tasks.js) leaves a to-do out of the home and the rail alike;
 *   - the plans list says the stage word and "N to do"; a partner's plan adds its due lines by name, never its figures;
 *   - landing: a remembered place on a locked plan is its home; a sign-in on the account page goes to the last plan;
 *   - reads only: ALL_WRITES is the list main has, byte for byte, and a stored plan is byte-identical after its home and
 *     every step are opened and browsed (gate 2), with not one write sent;
 *   - the words of copy/home.js pass the banned list in every scope a plan page is shown in.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { planPage, planRows } from '../../../src/answers/plan/read.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { NEXT_ORDER, NEXT_INFO, DUE_IDS, ALL_STEPS } from '../../../src/answers/plan/steps.js';
import { ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { stageOf, deriveStage } from '../../../src/services/LifeStage.js';
import { planStage } from '../../../src/services/PlanReading.js';
import { HOME, WORKING } from '../../../src/v7/copy/home.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { bannedHits } from '../render/checkScreen.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse, format, PLAN_SUB_STEPS } from '../../../src/v7/router/routes.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { startPlace, landingFor, afterSignInFor } from '../../../src/v7/effects/place.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { WHERE_LINES } from '../../../src/answers/plan/home.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { corpus, entriesAt, entryOf, household, noon, withTasks, DATES, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };

describe('the three words (stageOf): derived from the facts, nothing stored', () => {
  const placing = (key, more = {}) => ({ key, locked: false, timingMode: 'future', startMonth: '2030-06', monthsToStart: 40, stoppedWork: null, firstTaxYear: 2030, closedAt: null, ...more });
  // retaken in 7.10.0 (spec-7100 §2): what is held never decides the stage — the `move` option is gone; a running plan's stop
  // has passed (or it has none), so it reads Drawing whatever it holds; the window places a saver (tests/v7/plan/phases.test.js
  // holds the whole truth table)
  it('maps the seven placings to Saving, Moving, Drawing and Closed (and none for an unknown age)', () => {
    const at = new Date(2026, 9, 15, 12);
    const w = (p, plan = {}) => stageOf(plan, at, { placing: p }).key;
    expect(w(placing('unknown'))).toBe(null);
    for (const k of ['saving', 'approaching', 'committed-saving']) expect(w(placing(k))).toBe('saving');   // stop June 2030: before its window
    expect(w(placing('draft-retired', { timingMode: 'retired' }))).toBe('drawing');
    expect(w(placing('closed', { closedAt: '2026-03' }))).toBe('closed');
    for (const k of ['running']) {   // 7.4.2: the placing kept for a later start is gone; such a plan is running
      expect(w(placing(k, { locked: true, timingMode: 'retired' }))).toBe('drawing');
      // a month recorded, or none, a tax year set up or none: Drawing — what is held is said on the home, never the stage
      expect(w(placing(k, { locked: true, timingMode: 'retired' }), { decisionTool: { history: [{ date: '2026-09', monthlyNet: 2000 }] } })).toBe('drawing');
      expect(w(placing(k, { locked: true, timingMode: 'retired' }), { decisionTool: { history: [], taxYears: { '26/27': { yearSetupComplete: true } } } })).toBe('drawing');
      expect(w(placing(k, { locked: true, timingMode: 'future', startMonth: '2026-03' }), { holdings: { lines: [{ ticker: 'VWRP', wrapper: 'SIPP', value: 100000 }] } })).toBe('drawing');
    }
  });
  it('the window: before it Saving, inside it Moving, after the stop Living on it — an unlocked plan in future timing asks first', () => {
    const at = new Date(2026, 9, 15, 12);
    const st = (p) => stageOf({}, at, { placing: p });
    expect(st(placing('saving', { startMonth: '2030-06' }))).toMatchObject({ key: 'saving', window: { from: '2027-06', to: '2030-06', state: 'before' }, confirmStop: false });
    expect(st(placing('approaching', { startMonth: '2028-06' }))).toMatchObject({ key: 'moving', since: '2025-06', window: { from: '2025-06', to: '2028-06', monthsLeft: 20, state: 'inside' } });
    expect(st(placing('committed-saving', { locked: true, startMonth: '2027-10' }))).toMatchObject({ key: 'moving', window: { monthsLeft: 12, state: 'inside' } });
    expect(st(placing('approaching', { startMonth: '2026-09' }))).toMatchObject({ key: 'moving', confirmStop: true, window: { state: 'after', monthsLeft: 0 } });
    expect(st(placing('running', { locked: true, startMonth: '2026-09' }))).toMatchObject({ key: 'drawing', confirmStop: false, window: { state: 'after' } });
    // ages from the Accumulation tab (no date): Saving, with no window said
    expect(st(placing('approaching', { timingMode: 'legacy', startMonth: '2027-04', fromAccumulation: true }))).toMatchObject({ key: 'saving', window: null });
    // the invitation is gone: the window opening is the invitation
    expect('invite' in st(placing('committed-saving', { locked: true, monthsToStart: 12, startMonth: '2027-10' }))).toBe(false);
  });
  it('reads a plan and writes nothing: deriveStage unchanged, the plan the same before and after, on every committed plan', () => {
    for (const today of DATES) for (const e of entriesAt(today)) {
      const before = JSON.stringify(e.plan);
      const st = stageOf(e.plan, noon(today), { placing: planStage(e.plan, { now: noon(today) }) });
      expect(['saving', 'moving', 'drawing', 'closed', null]).toContain(st.key);
      expect(st.by).toBe('facts');
      expect(JSON.stringify(e.plan)).toBe(before);
      expect(deriveStage(e.plan, noon(today)).key).toBe(deriveStage(JSON.parse(before), noon(today)).key);
    }
  });
});

describe('every committed plan at three dates: the stage word, the to-dos in order, the nothing-due line', () => {
  // [stage, to-do ids in order (the first is the rail's Next), the nothing-due line] — a line only when it is true.
  // Retaken on purpose in 7.3.1 for 03 and 13: both record months while what they hold is short of the ladder, so they read
  // Drawing (they read Moving in 7.3.0) and their move is no longer a to-do — it is said under "Where you are" instead
  // Retaken on purpose in 7.10.0 (one clock, the move window): 10 in 2027 (stop January 2030) and 19-saving (stop March 2029)
  // are inside their three-year windows, so they read Moving; their to-dos and lines are a saver's, as before
  // Retaken on purpose in 7.10.0 (spec-7100 §5, research/v7/replan-nov-2026.md §6.4): the home's whole list of things to do is
  // closed, age, "did you stop work?", the tax year, the month (only when months are wanted: each plan here has months
  // recorded), the review due, off course and a partner's plan — so the lock, what you hold out of date, the first check-in
  // and the start to-dos are gone. A Living-on-it review falls due from 6 April once the plan was locked six months before
  // (03 and 20 locked July 2026, 04 March, 06 April, 13 November 2024), and never before 6 April 2027 (13 in 2026/27 too). 05's
  // monthly pot step is yearly: its last pot record (September 2026) and 12 months. 10 (2027) and 19-saving are inside their
  // windows with no review chosen: whenever they like.
  // Retaken on purpose in 7.10.0 (nothing due is nothing in To do): a plan living on its money and not locked yet says the
  // review's line, as every other phase does — its months waiting for the lock are said on the Month by month tool
  const TABLE = {
    '2026-10-02': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '20-locked-start-after-stop': ['drawing', 'month.record', null],
      '03-gilt-ladder-locked': ['drawing', 'month.record', null],
      '04-buckets-running': ['drawing', 'month.record', null],
      '05-saver-committed': ['saving', '', 'Nothing due. Your next review is September 2027.'],
      '06-pre-6.4-no-timing': ['drawing', 'month.gap', null],
      '07-pre-6.13-flat-params': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '10-couple-b': ['saving', '', 'Nothing due. You can review your plan whenever you like.'],
      '11-guest-demo': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '12-lumpy-db-gia': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '13-stopped-drawing-since': ['drawing', 'month.gap', null],
      '18-moved-to-new-plan-next': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', '', 'Nothing due. You can review your plan whenever you like.'],
      '19-back-to-work': ['closed', 'closed.next', 'Closed June 2025; carried on in ‘Saving again from July 2025’.']
    },
    '2027-04-05': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '20-locked-start-after-stop': ['drawing', 'month.gap', null],
      '03-gilt-ladder-locked': ['drawing', 'month.gap', null],
      '04-buckets-running': ['drawing', 'month.gap', null],
      '05-saver-committed': ['saving', '', 'Nothing due. Your next review is September 2027.'],
      '06-pre-6.4-no-timing': ['drawing', 'month.gap', null],
      '07-pre-6.13-flat-params': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '10-couple-b': ['moving', '', 'Nothing due. You can review your plan whenever you like.'],
      '11-guest-demo': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '12-lumpy-db-gia': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '13-stopped-drawing-since': ['drawing', 'month.gap', null],
      '18-moved-to-new-plan-next': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', '', 'Nothing due. You can review your plan whenever you like.'],
      '19-back-to-work': ['closed', 'closed.next', 'Closed June 2025; carried on in ‘Saving again from July 2025’.']
    },
    '2027-04-06': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '20-locked-start-after-stop': ['drawing', 'month.taxYear month.gap review.due', null],
      '03-gilt-ladder-locked': ['drawing', 'month.taxYear month.gap review.due', null],
      '04-buckets-running': ['drawing', 'month.taxYear month.gap review.due', null],
      '05-saver-committed': ['saving', '', 'Nothing due. Your next review is September 2027.'],
      '06-pre-6.4-no-timing': ['drawing', 'month.taxYear month.gap review.due', null],
      '07-pre-6.13-flat-params': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '10-couple-b': ['moving', '', 'Nothing due. You can review your plan whenever you like.'],
      '11-guest-demo': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '12-lumpy-db-gia': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '13-stopped-drawing-since': ['drawing', 'month.taxYear month.gap review.due', null],
      '18-moved-to-new-plan-next': ['drawing', '', 'Nothing due. You can review your plan whenever you like.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', '', 'Nothing due. You can review your plan whenever you like.'],
      '19-back-to-work': ['closed', 'closed.next', 'Closed June 2025; carried on in ‘Saving again from July 2025’.']
    }
  };
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const got = {};
      for (const [name, raw] of Object.entries(C)) {
        const h = homeOf(entries, entryOf(raw, today).plan.id, { today });
        got[name] = [h.stage.key, [...h.todo.items, ...h.todo.more].map((x) => x.id).join(' '), h.quiet ? fill(HOME.quiet[h.quiet.id], h.quiet.slots) : null];
      }
      expect(got).toEqual(TABLE[today]);
    });
  }
});

describe('one engine: the rail\'s Next is the first thing due, and the home\'s first to-do', () => {
  it('every due item carries the design\'s id and a P.* id with words; the info sentences are never to-dos', () => {
    for (const pid of NEXT_ORDER) expect(PLAN.next[pid], pid).toBeTruthy();
    for (const pid of Object.keys(DUE_IDS)) { expect(NEXT_ORDER).toContain(pid); expect(NEXT_INFO).not.toContain(pid); expect(HOME.items[DUE_IDS[pid]], DUE_IDS[pid]).toBeTruthy(); }
    for (const pid of NEXT_INFO) expect(DUE_IDS[pid]).toBeUndefined();
    // retaken in 7.10.0 (spec-7100 §5): the seven rules, the tax year before the month (a month cannot be recorded before its
    // year is set up) — then the sentences that say where things stand, the review's always last
    const due = NEXT_ORDER.filter((x) => DUE_IDS[x]);
    expect(due).toEqual(['P.closed', 'P.noAge', 'P.agesFromSaving', 'P.confirmStop', 'P.taxyear', 'P.arrive', 'P.month', 'P.review', 'P.offCourse', 'P.householdPending', 'P.move']);
    expect(NEXT_ORDER.slice(-5)).toEqual(['P.idle', 'P.window', 'P.onCourse', 'P.nextReview', 'P.reviewAny']);
  });
  for (const today of DATES) {
    it(`on every committed plan, at every address, at ${today}: nextFor === dueFor[0] (or a sentence that is not a to-do); the home agrees`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        for (const step of [null, ...ALL_STEPS]) {
          const pg = planPage(entries, e.plan.id, step, { today });
          if (pg.due.length) {
            expect(pg.next.id, `${e.plan.id} ${step}`).toBe(pg.due[0].pid);
            expect(pg.next.button).toEqual(pg.readonly ? null : pg.due[0].button);
          } else expect(NEXT_INFO, `${e.plan.id} ${step}: ${pg.next.id}`).toContain(pg.next.id);
          // the rail reads a to-do's own words where it has them (`words`, 7.4.3), as PlanRail does
          expect(fill(PLAN.next[pg.next.words || pg.next.id], pg.next.slots)).not.toMatch(/\{\w+\}/);
        }
        const h = homeOf(entries, e.plan.id, { today });
        const pg = planPage(entries, e.plan.id, null, { today });
        if (pg.due.length) expect(h.todo.items[0].pid).toBe(pg.next.id);
        else expect(h.todo.items).toEqual([]);
        // 7.10.0: at most one thing shown, the plan's own and a partner's in one list (the rest "and N more")
        expect(h.todo.items.length).toBeLessThanOrEqual(1);
        expect(h.todo.items.length + h.todo.more.length).toBe(h.todo.count);
        for (const it of [...h.todo.items, ...h.todo.more]) expect(fill(HOME.items[it.id].title, it.slots), it.id).not.toMatch(/\{\w+\}/);
      }
    });
  }
  it('a plan shown as saved has nothing to do (nothing can be changed there) and says so on the rail as before', () => {
    const es = entriesAt(TODAY).map((e) => (e.plan.id === C['04-buckets-running'].id ? { ...e, newer: true } : e));
    const pg = planPage(es, C['04-buckets-running'].id, null, { today: TODAY });
    expect(pg.due).toEqual([]);
    expect(pg.next.id).toBe('P.readonly');
    expect(homeOf(es, C['04-buckets-running'].id, { today: TODAY }).todo.count).toBe(0);
  });
});

describe('nothing due: a dated line, only ever true', () => {
  /**
   * A plan with every month up to this one recorded (copies of its latest record, one a month) and this tax year set up
   * (its last year's set-up, copied): no month is due.
   */
  const recordedThisMonth = (raw, month) => {
    const p = copy(raw);
    const h = p.decisionTool.history;
    const last = h.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).pop();
    for (let m = last.date.slice(0, 7); m < month;) { const [y, mm] = m.split('-').map(Number); m = mm === 12 ? (y + 1) + '-01' : y + '-' + String(mm + 1).padStart(2, '0'); h.push({ ...last, date: m }); }
    const [y, mm] = month.split('-').map(Number);
    const ty = mm >= 4 ? y : y - 1;
    const key = String(ty % 100).padStart(2, '0') + '/' + String((ty + 1) % 100).padStart(2, '0');
    const years = p.decisionTool.taxYears || {};
    if (!years[key]) { const any = Object.values(years).find((t) => t && t.yearSetupComplete); if (any) p.decisionTool.taxYears = { ...years, [key]: { ...any } }; }
    return p;
  };
  it('a drawing plan with nothing due says the month recorded and the 1st of the next; a month put off leaves the review\'s date', () => {
    const raw = recordedThisMonth(C['04-buckets-running'], '2026-10');
    const e = entryOf(raw, TODAY);
    const id = e.plan.id;
    const h = homeOf([e], id, { today: TODAY });
    expect(h.todo.items).toEqual([]);
    expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toBe('October is recorded. Nothing is due until 1 November.');
    // the rail agrees, word for word as before
    const pg = planPage([e], id, 'plan', { today: TODAY });
    expect(pg.next.id).toBe('P.idle');
    expect(fill(PLAN.next['P.idle'], pg.next.slots)).toBe('October 2026 is recorded. Nothing to do until November.');
    // October not recorded and put off until November (7.10.0, stored on the plan): nothing due, and the review's date said
    const off = entryOf(withTasks(C['04-buckets-running'], ['month.gap@2026-07', 'month.record@2026-10'], { until: '2026-11' }), TODAY);
    const hOff = homeOf([off], id, { today: TODAY });
    expect([...hOff.todo.items, ...hOff.todo.more].map((x) => x.id)).toEqual([]);
    expect(fill(HOME.quiet[hOff.quiet.id], hOff.quiet.slots)).toBe('Nothing due. Your next review is April 2027.');
    // a plan that keeps no monthly record here: no month asked, the review's date said
    const no = copy(C['04-buckets-running']); no.decisionTool.recordMonths = false;
    const hNo = homeOf([entryOf(no, TODAY)], id, { today: TODAY });
    expect(hNo.todo.count).toBe(0);
    expect(fill(HOME.quiet[hNo.quiet.id], hNo.quiet.slots)).toBe('Nothing due. Your next review is April 2027.');
  });
  it('the plan\'s cadence: three months recorded at once reach ahead, so nothing is due until the 1st after the last of them', () => {
    const raw = copy(C['04-buckets-running']);
    raw.decisionTool.cadence = 'quarterly';
    const h0 = raw.decisionTool.history;
    for (const m of ['2026-10', '2026-11', '2026-12']) h0.push({ ...h0[h0.length - 1], date: m });
    const e = entryOf(raw, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.todo.items).toEqual([]);
    expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toBe('December is recorded. Nothing is due until 1 January.');
  });
  for (const today of DATES) {
    it(`every locked drawing plan with nothing due has the dated line, at ${today}`, () => {
      let seen = 0;
      for (const raw of Object.values(C)) {
        const month = today.slice(0, 7);
        if (!raw.decisionTool || !Array.isArray(raw.decisionTool.history) || !raw.decisionTool.history.length) continue;
        const e = entryOf(recordedThisMonth(raw, month), today);
        const pg = planPage([e], e.plan.id, null, { today });
        if (!pg.life || pg.life.key !== 'drawing' || !pg.locked) continue;
        const h = homeOf([e], e.plan.id, { today });
        if (h.todo.count) continue;
        seen++;
        expect(h.quiet, e.plan.id).not.toBe(null);
        expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toMatch(/ is recorded\. Nothing is due until 1 [A-Z][a-z]+\.$/);
      }
      // (at 6 April 2027 every one of them has its yearly review due: nothing is quiet then)
      if (today !== '2027-04-06') expect(seen).toBeGreaterThan(0);
    });
  }
  // retaken in 7.10.0: a plan locked while saving that never chose is read once a year (its monthly pot step is gone)
  it('a saver with a cadence chosen: the next check-in\'s month; locked and never chose: once a year from its last pot record', () => {
    const raw = copy(C['05-saver-committed']);
    raw.accumulationTool.history = [...(raw.accumulationTool.history || []), { date: '2026-10', sipp: 330000, isa: 42000, gia: 0, total: 372000, recordedAt: '2026-10-02T12:00:00.000Z' }];
    const e = entryOf(raw, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.todo.items).toEqual([]);
    expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toBe('Nothing due. Your next review is October 2027.');
    // with "every three months" chosen and a check-in in October: January
    const chose = copy(raw);
    chose.accumulationTool.checkInEvery = 'quarter';
    chose.accumulationTool.checkIns = [{ date: '2026-10-02', pot: { pension: 330000, isa: 42000 }, reading: { band: 'yes' } }];
    const hc = homeOf([entryOf(chose, TODAY)], e.plan.id, { today: TODAY });
    expect(fill(HOME.quiet[hc.quiet.id], hc.quiet.slots)).toBe('Nothing due. Your next review is January 2027.');
  });
});

describe('the plans list, a partner\'s due lines, the soon item', () => {
  it('each row: the stage word and how many things are due (the same reading as the home)', () => {
    const entries = entriesAt(TODAY);
    const rows = planRows(entries, { today: TODAY }).groups.flatMap((g) => g.rows);
    const row = (name) => rows.find((r) => r.id === String(C[name].id));
    // retaken in 7.10.0: what you hold out of date, the start's move and a saver's monthly pot are no longer things to do
    expect([row('04-buckets-running').life, row('04-buckets-running').todo]).toEqual(['drawing', 1]);
    expect([row('20-locked-start-after-stop').life, row('20-locked-start-after-stop').todo]).toEqual(['drawing', 1]);
    expect([row('05-saver-committed').life, row('05-saver-committed').todo]).toEqual(['saving', 0]);
    // a closed plan's way on is not counted on its row (retaken on purpose: it was 1, "Closed · 1 to do")
    expect([row('18-moved-to-new-plan').life, row('18-moved-to-new-plan').todo]).toEqual(['closed', 0]);
    const put = planRows(entries.map((e) => (e.plan.id === C['04-buckets-running'].id ? { ...e, plan: withTasks(e.plan, ['month.record@2026-10'], { until: '2026-11' }) } : e)), { today: TODAY }).groups.flatMap((g) => g.rows);
    expect(put.find((r) => r.id === String(C['04-buckets-running'].id)).todo).toBe(0);
  });
  it('a partner\'s plan adds its month and its move, named by its plan, never its figures; not to the rail', () => {
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    const h = homeOf(entries, 'HouseSaver02', { today: TODAY });
    // retaken in 7.10.0: one list — the partner's month after the plan's own, never put away here
    const partner = (x) => [...x.todo.items, ...x.todo.more].filter((it) => it.planId);
    expect(partner(h).map((x) => [x.name, x.id])).toEqual([['Ladder plan', 'month.record']]);
    for (const x of partner(h)) { expect(JSON.stringify(x)).not.toMatch(/£/); expect(x.dismiss).toBeUndefined(); }
    expect(h.todo.items.length).toBe(1);
    expect(planPage(entries, 'HouseSaver02', null, { today: TODAY }).due.map((d) => d.id)).not.toContain('month.record');
    // put off on the partner's own plan: gone here too (their reading reads their dismissals)
    const putOff = homeOf([entryOf(withTasks(ladder, ['month.record@2026-10'], { until: '2026-11' })), entryOf(saver)], 'HouseSaver02', { today: TODAY });
    expect(partner(putOff)).toEqual([]);
    // the same ladder before its first month: its stop has passed, so it is Living on it, but with no month recorded and no
    // cadence chosen it does not ask for months (7.10.0: months are the person's choice) — on its home or its partner's
    const early = copy(ladder); early.decisionTool.history = [];
    expect(partner(homeOf([entryOf(early), entryOf(saver)], 'HouseSaver02', { today: TODAY }))).toEqual([]);
    early.decisionTool.recordMonths = true;
    expect(partner(homeOf([entryOf(early), entryOf(saver)], 'HouseSaver02', { today: TODAY })).map((x) => [x.name, x.id])).toEqual([['Ladder plan', 'month.record']]);
  });
  it('the next tax year\'s set-up is "soon" from 1 March: listed apart, never counted, never the rail\'s Next; its button chooses April', () => {
    const today = '2027-03-05';
    const raw = copy(C['04-buckets-running']);
    const h0 = raw.decisionTool.history;
    for (const m of ['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03']) h0.push({ ...h0[h0.length - 1], date: m });
    const e = entryOf(raw, today);
    const h = homeOf([e], e.plan.id, { today });
    expect(h.todo.count).toBe(0);
    expect(h.todo.soon.map((x) => [x.id, x.soon, x.slots.year, x.button.choose])).toEqual([['month.taxYear', true, '2027/28', '2027-04']]);
    expect(planPage([e], e.plan.id, null, { today }).next.id).toBe('P.idle');
    expect(homeOf([e], e.plan.id, { today: '2027-02-10' }).todo.soon).toEqual([]);
  });
});

describe('"Not now": stored on the plan (7.10.0), never the window', () => {
  it('the reducer asks the plan write for it, with a to-do\'s key and how it is put away only; the window keeps nothing', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    expect('notNow' in s.ui).toBe(false);
    const ok = reduce(s, { type: A.PLAN_TASK, planId: 'Td4', key: 'hold.stale', how: 'notNow' });
    expect(ok.ui.saving).toEqual({ planId: 'Td4', kind: 'task', key: 'hold.stale', how: 'notNow' });
    expect(reduce(s, { type: A.PLAN_TASK, planId: 'Td4', key: 'review.due@2027/28', how: 'notThisTime' }).ui.saving.key).toBe('review.due@2027/28');
    for (const bad of ['', 'no-dot', 'a|b', 'hold.stale £1', 'hold.stale@ 1', 5, null]) expect(() => reduce(s, { type: A.PLAN_TASK, planId: 'Td4', key: bad, how: 'notNow' })).toThrow(/plan\/task/);
    expect(() => reduce(s, { type: A.PLAN_TASK, planId: 'Td4', key: 'hold.stale', how: 'later' })).toThrow(/plan\/task/);
    expect(() => reduce(s, { type: A.PLAN_TASK, planId: '', key: 'hold.stale', how: 'notNow' })).toThrow(/plan\/task/);
  });
  it('one write of `tasks` and nothing else — no stamp — hidden until next month on every device, said; refused on a closed plan', async () => {
    const raw = copy(C['04-buckets-running']);
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(TODAY)), source: 'account', readAt: '14:03' });
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(TODAY + 'T14:03:00.000Z'), fb, client: null, handles });
    const key = homeOf([entryOf(raw, TODAY)], raw.id, { today: TODAY }).todo.items[0].key;
    expect(key).toBe('month.record@2026-10');
    store.dispatch({ type: A.PLAN_TASK, planId: String(raw.id), key, how: 'notNow' });
    await tick();
    expect(writes).toHaveLength(1);
    expect(writes[0].ref.path).toBe('users/u1/scenarios/' + raw.id);
    expect(Object.keys(writes[0].data)).toEqual(['tasks']);
    expect(writes[0].data.tasks).toEqual({ ...(raw.createdAt ? { of: raw.createdAt } : {}), dismissed: { [key]: { at: TODAY + 'T14:03:00.000Z', until: '2026-11' } } });
    expect(store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'task', previous: null, line: { id: 'putOff', slots: { month: 'November 2026' }, key } });
    stop();
    // read back (another device): October's to-do gone this month; in November, November is the month to record
    const stored = { ...raw, tasks: writes[0].data.tasks };
    expect(homeOf([entryOf(stored, TODAY)], raw.id, { today: TODAY }).todo.count).toBe(0);
    expect([...homeOf([entryOf(stored, '2026-11-02')], raw.id, { today: '2026-11-02' }).todo.items].map((x) => x.key)).toEqual(['month.gap@2026-10']);
    // a closed plan whose close has passed: nothing is written
    const closed = copy(C['18-moved-to-new-plan']);
    const w2 = [];
    const store2 = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store2.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store2.dispatch({ type: A.PLANS_SET, list: upgradedList([closed], noon(TODAY)), source: 'account', readAt: '14:03' });
    const stop2 = startPlanWrite(store2, { session: null, local: null, now: () => new Date(TODAY + 'T14:03:00.000Z'), fb: { ...fb, updateDoc: (ref, data) => { w2.push(data); return Promise.resolve(); } }, client: null, handles });
    store2.dispatch({ type: A.PLAN_TASK, planId: String(closed.id), key: 'closed.next', how: 'done' });
    await tick();
    expect(w2).toEqual([]);
    expect(store2.getState().ui.saveProblem).toMatchObject({ problem: 'locked' });
    stop2();
  });
});

describe('landing on the home', () => {
  const state = (plans, profile) => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: null } });
    // view 'simple' (7.11.1): someone signed in who never chose opens in the full view; these are the simple view's landings
    s = reduce(s, { type: A.PROFILE_SET, profile: { view: 'simple', ...profile } });
    s = reduce(s, { type: A.PLANS_SET, list: upgradedList(plans, noon(TODAY)), source: 'account', readAt: '14:03' });
    return s;
  };
  it('a remembered place on a LOCKED plan lands on its home, whatever step was open; on any other plan, on the step', () => {
    const locked = copy(C['04-buckets-running']);
    const draft = copy(C['02-pnv-draft']);
    expect(landingFor(state([locked, draft], { lastSeenVersion: null, lastLocation: { planId: locked.id, step: 'month' } }), null)).toBe('#/plan/' + locked.id);
    expect(landingFor(state([locked, draft], { lastSeenVersion: null }), { planId: locked.id, step: 'plan' })).toBe('#/plan/' + locked.id);
    expect(landingFor(state([locked, draft], { lastSeenVersion: null }), { planId: draft.id, step: 'about' })).toBe('#/plan/' + draft.id + '/about');
  });
  it('signed in on the account page with no way back (a new device): to the last plan\'s home, not "Your account"; with no plan remembered, it stays', () => {
    const locked = copy(C['04-buckets-running']);
    expect(afterSignInFor(state([locked], { lastSeenVersion: null, lastLocation: { planId: locked.id, step: null } }))).toBe('#/plan/' + locked.id);
    expect(afterSignInFor(state([locked], { lastSeenVersion: null }))).toBe(null);
    // a plan not locked too: its home, not the step it was left on elsewhere (the design's "Landing")
    const draft = copy(C['02-pnv-draft']);
    expect(afterSignInFor(state([draft], { lastSeenVersion: null, lastLocation: { planId: draft.id, step: 'about' } }))).toBe('#/plan/' + draft.id);
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/account') });
    const stop = startPlace(store, { session: null, local: null });
    // 7.12.0: a sign-in sent from the page (a session restored as it opens is no sign-in: tests/v7/shell/place.test.js)
    store.dispatch({ type: A.ACCOUNT_ASK, what: 'signIn', email: 'alex@example.test', password: 'x' });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
    expect(format(store.getState().route)).toBe('#/account');                                // waits for the plans and the settings
    store.dispatch({ type: A.PROFILE_SET, profile: { lastSeenVersion: null, lastLocation: { planId: locked.id, step: 'month' } } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([locked], noon(TODAY)), source: 'account', readAt: '14:03' });
    expect(format(store.getState().route)).toBe('#/plan/' + locked.id);
    stop();
  });
});

describe('reads only: nothing new is written to any plan', () => {
  it('ALL_WRITES is the list main has at 7.2.1, byte for byte (no new allow-list, no new write kind)', () => {
    // 7.4.0 adds one path, on purpose: a draft with no age, pinned the old way to next year, is written from this tax year by
    // its next Save (moveStart.js laterDraftPatch). Opening a plan still writes nothing (below).
    // 7.7.0 adds one more, on purpose: "I accept this risk" writes the whole list of agreements (planAmendments), beside the
    // settings and the document, never in them. Opening a plan still writes nothing (below).
    // 7.10.0 adds three: the phases and the dismissals (whole roots) and how often months are recorded
    // (decisionTool.recordMonths). Opening a plan still writes nothing (below).
    // 7.10.0 also takes six away: the move of a locked plan's start under its lock is gone (its MOVE_START_WRITES declared the
    // Decision copy's spendingMigratedFrom, dbStartYear, strategyState, extraIncomes and extraWithdrawals, and strategy.params,
    // which no other write declares); a locked plan's start changes by unlock and a new lock.
    // step F1 (lead4.md D4) takes one away: the pots at the stop are worked out from the plan and never written
    // (stressTool.settings.potAtRetirement); "Your pots and tax" writes the pension today for a saver as "What you pay in"
    // does (accumulationTool.settings and .history, already on the list), so the order moves and the hash with it.
    expect(ALL_WRITES.length).toBe(155);
    expect(ALL_WRITES).not.toContain('stressTool.settings.potAtRetirement');
    expect(ALL_WRITES).toContain('stressTool.settings.legacyFirstTaxYear');
    expect(ALL_WRITES).toContain('planAmendments');
    for (const k of ['decisionTool.settings.spendingMigratedFrom', 'decisionTool.settings.dbStartYear', 'decisionTool.settings.strategyState', 'decisionTool.settings.extraIncomes', 'decisionTool.settings.extraWithdrawals', 'strategy.params']) expect(ALL_WRITES).not.toContain(k);
    expect(createHash('sha256').update(JSON.stringify(ALL_WRITES)).digest('hex')).toBe('4d77b7aa4105ed95618d615a083db34caeaacceecca60f74475ee04ce1969332');
  });
  /** The one write file with a fake firestore that records every call, on an account's plans. */
  function browse(raws, planId) {
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => { writes.push('add'); return Promise.resolve({ id: 'x' }); }, deleteDoc: () => { writes.push('delete'); return Promise.resolve(); }, collection: () => ({}) };
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, noon(TODAY)), source: 'account', readAt: '14:03' });
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(TODAY + 'T14:03:00.000Z'), fb, client: null, handles });
    const go = (hash) => { store.dispatch({ type: A.ROUTE_SET, route: parse(hash) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
    return { store, writes, go, stop };
  }
  // 7.10.0: "Not now" is a write of its own now (stored on the plan, below), so the browse no longer presses it
  it('gate 2: every committed plan, its home and every step opened and browsed (the folds, the tools) — byte-identical, not one write', async () => {
    const raws = Object.values(C).map(copy);
    const before = JSON.stringify(upgradedList(raws, noon(TODAY)).map((e) => e.plan));
    const b = browse(raws, null);
    for (const raw of raws) {
      b.go('#/plan/' + raw.id);
      const home = b.store.getState().plans.view.page.home;
      expect(home && home.found, raw.id).toBe(true);
      for (const step of [...ALL_STEPS, ...PLAN_SUB_STEPS]) b.go('#/plan/' + raw.id + '/' + step);
      for (const id of ['monthOther', 'checkInAnyway']) b.store.dispatch({ type: A.UI_TOGGLE, id });
      b.go('#/plan/' + raw.id);
    }
    await tick();
    expect(b.writes).toEqual([]);
    expect(JSON.stringify(b.store.getState().plans.list.map((e) => e.plan))).toBe(before);
    b.stop();
  });
});

describe('the words of the home (copy/home.js)', () => {
  const strings = (obj, path = '', out = []) => {
    if (typeof obj === 'string') out.push([path, obj]);
    else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
    return out;
  };
  const slot = (s) => s.replace(/\{(month|stop|nextCheck|last)\}/g, 'April 2027').replace(/\{(monthName|next)\}/g, 'October').replace(/\{date\}/g, '20 March 2026')
    .replace(/\{(year|savedYear)\}/g, '2027/28').replace(/\{(n|of|done)\}/g, '3').replace(/\{total\}/g, '1,000').replace(/\{(name|closed)\}/g, 'Ladder plan').replace(/\{label\}/g, 'Index-linked gilt 2031')
    .replace(/\{pct\}/g, '94').replace(/\{start\}/g, 'April 2027').replace(/\{stopped\}/g, 'May 2026').replace(/\{records\}/g, 'July 2026').replace(/\{moveTo\}/g, '2026/27').replace(/\{title\}/g, 'Record October').replace(/\{question\}/g, 'Am I saving enough?').replace(/\{drawn\}/g, '£1,200').replace(/\{age\}/g, '57').replace(/\{plan\}/g, '£1,100').replace(/\{gapYear\}/g, '2027/28').replace(/\{gap\}/g, '£9,000')
    .replace(/\{amount\}/g, '£12,300').replace(/\{years\}/g, '2027/28 to 2029/30')
    // 7.10.0: the review, off course, the move window and the drift line
    .replace(/\{reviewOften\}/g, 'once a tax year').replace(/\{(a|b)\}/g, '15').replace(/\{line\}/g, '17').replace(/\{left\}/g, '24 months').replace(/\{from\}/g, 'January 2027').replace(/\{windowLeft\}/g, '24 months').replace(/\{toBuy\}/g, '£102,400')
    .replace(/\{(held|mix)\}/g, '40');
  it('pass the banned list in every scope a plan page is shown in — records, retired and saver alike; no slot left unfilled', () => {
    const all = [...strings(HOME), ...strings({ WORKING })];
    const context = all.map(([, s]) => slot(s)).join('\n');
    const hits = [];
    for (const [where, s] of all) for (const h of bannedHits(slot(s), ['all', 'record', 'retired', 'saver'], { context })) hits.push(`home.js ${where} — ${h}`);
    expect(hits).toEqual([]);
    for (const [where, s] of all) expect(slot(s), where).not.toMatch(/\{\w+\}/);
    for (const [where, s] of all) expect(s, where).not.toMatch(/\b(error|failed|invalid|submit|calculate|simulate|dashboard|wizard|onboarding|transition)\b/i);
  });
});

describe('what the reviews found (7.3.0): the invitation, the move on a drawing plan, one count, the partner, where you are', () => {
  // retaken in 7.10.0: the 12-month invitation is gone (the window opening is the invitation, spec-7100 §2): a locked saver
  // near the stop is in its window, Moving, with nothing coming said; an unlocked saver past the stop is asked on About
  it('a locked saver near the stop is Moving inside its window, with no invitation; an unlocked saver past the stop is asked first', () => {
    for (const today of ['2037-03-10', '2038-01-10']) {
      const e = entryOf(C['05-saver-committed'], today);
      const pg = planPage([e], e.plan.id, null, { today });
      expect(pg.life, today).toMatchObject({ key: 'moving', by: 'facts', window: { to: '2038-02', state: 'inside' } });
      expect('invite' in pg.life, today).toBe(false);
      expect(pg.due.map((d) => d.id), today).not.toContain('move.invite');
      expect(homeOf([e], e.plan.id, { today }).todo.soon.map((x) => x.id), today).not.toContain('move.invite');
    }
    const today = '2030-10-02';
    const e = entryOf(C['10-couple-b'], today);
    const pg = planPage([e], e.plan.id, null, { today });
    expect(pg.life).toMatchObject({ key: 'moving', confirmStop: true, window: { to: '2030-01', state: 'after' } });
    expect(pg.due.map((d) => d.id)).not.toContain('move.invite');
  });
  // retaken in 7.10.0: the move is never a to-do (research/v7/replan-nov-2026.md §6.4) — a plan with no record of what it holds
  // has nothing said about it at all, and one that holds something different gets one information line (the drift line)
  it('a locked plan read as Living on it with nothing it holds recorded: no move to-do and no line about what it holds', () => {
    const raw = copy(C['20-locked-start-after-stop']);
    raw.holdings = null;
    const e = entryOf(raw, TODAY);
    const pg = planPage([e], e.plan.id, null, { today: TODAY });
    expect(pg.life.key).toBe('drawing');
    expect(pg.due.map((d) => [d.id, d.pid, d.dismiss || null])).toEqual([['month.record', 'P.month', ['notNow']]]);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.drift).toBeUndefined();
    // a plan whose holdings show the plan's mix (04) has nothing to move: nothing said
    expect(homeOf(entriesAt(TODAY), C['04-buckets-running'].id, { today: TODAY }).drift).toBeUndefined();
  });
  it('a locked plan past its stop with nothing recorded yet is Living on it: no move to-do, the strip done to Living on it (7.10.0)', () => {
    for (const name of ['20-locked-start-after-stop', '13-stopped-drawing-since']) {
      const raw = copy(C[name]); raw.decisionTool.history = [];
      const entries = [entryOf(raw, TODAY)];
      const id = entries[0].plan.id;
      const h = homeOf(entries, id, { today: TODAY });
      expect(h.stage.key, name).toBe('drawing');
      expect('moves' in h.stage, name).toBe(false);
      expect(h.stage.strip.map((x) => x.state), name).toEqual(['done', 'done', 'now']);
      expect([...h.todo.items, ...h.todo.more].map((x) => x.id), name).not.toContain('move.next');
    }
  });
  for (const today of DATES) {
    it(`"Where you are" on every home is a headline, at ${today}: the result and at most ${WHERE_LINES} lines, the full reading one link away`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const h = homeOf(entries, e.plan.id, { today });
        const lines = h.where.reduce((n, b) => n + b.lines.length, 0);
        expect(lines, e.plan.id).toBeLessThanOrEqual(WHERE_LINES);
        // never the year's totals twice: the result says them, the lines are like with like and the pot
        for (const b of h.where) expect(b.lines.map((l) => l.id), e.plan.id).not.toContain('where.taken');
        const full = planPage(entries, e.plan.id, 'where', { today }).steps.find((s) => s.id === 'where');
        if (full && full.lines.length > lines) expect(h.whereFull, e.plan.id).toBe('#/plan/' + e.plan.id + '/where');
      }
    });
  }
  it('a month missed in an earlier tax year is named with its year, title and button alike', () => {
    const entries = entriesAt(TODAY);
    const id = entryOf(C['13-stopped-drawing-since'], TODAY).plan.id;
    const gap = homeOf(entries, id, { today: TODAY }).todo.items.find((x) => x.id === 'month.gap');
    expect(gap).toBeTruthy();
    expect(fill(HOME.items['month.gap'].title, gap.slots)).toMatch(/^Record [A-Z][a-z]+ \d{4}$/);
    expect(gap.slots.month).toMatch(/ \d{4}$/);
  });
  it('a partner\'s plan adds only its month and tax year: never its age, review or link, whose words speak to its owner', () => {
    for (const today of DATES) {
      const entries = entriesAt(today);
      for (const e of entries) for (const x of [...homeOf(entries, e.plan.id, { today }).todo.items, ...homeOf(entries, e.plan.id, { today }).todo.more].filter((it) => it.planId)) {
        expect(['month.taxYear', 'month.arrive', 'month.record', 'month.gap']).toContain(x.id);
      }
    }
    // a partner's review due is theirs: at 6 April 2027 the ladder's review is due on its own home, never on the saver's
    const { ladder, saver } = household();
    const entries = [entryOf(ladder, '2027-04-06'), entryOf(saver, '2027-04-06')];
    expect(planPage(entries, 'HouseLadder01', null, { today: '2027-04-06' }).due.map((d) => d.id)).toContain('review.due');
    expect([...homeOf(entries, 'HouseSaver02', { today: '2027-04-06' }).todo.items, ...homeOf(entries, 'HouseSaver02', { today: '2027-04-06' }).todo.more].map((x) => x.id)).not.toContain('review.due');
  });
});

// retaken in 7.10.0 (spec-7100 §3.2; research/v7/replan-nov-2026.md §6.4): what is held differently from the plan's mix is one
// information line on a plan living on its money — the bucket furthest from the mix when it is more than 10% of the pension
// away, or a ladder's gilt needed this tax year or next not held — never a to-do, never the stage, never a sale
describe('the drift line (7.10.0): what is held differently is said once, as information', () => {
  const MOVE_PIDS = ['P.moveNext', 'P.moveLater', 'P.moveFinish'];
  for (const name of ['20-locked-start-after-stop', '13-stopped-drawing-since']) {
    it(`${name}: months recorded and short of the ladder → Living on it, no move to-do, the rail's Next not a move; the strip done`, () => {
      for (const today of DATES) {
        const entries = entriesAt(today);
        const id = entryOf(C[name], today).plan.id;
        const plan = entries.find((e) => e.plan.id === id).plan;
        const before = JSON.stringify(plan);
        expect(moveInputs(plan, { now: noon(today) }).diff.complete, today).toBe(false);
        const pg = planPage(entries, id, null, { today });
        expect(pg.life.key, today).toBe('drawing');
        for (const pid of MOVE_PIDS) expect(NEXT_ORDER, today).not.toContain(pid);
        const h = homeOf(entries, id, { today });
        expect([...h.todo.items, ...h.todo.more].map((x) => x.id), today).not.toContain('move.next');
        expect(h.stage.strip.map((x) => x.state), today).toEqual(['done', 'done', 'now']);
        // no gilt needed this tax year or next is missing (the early years are its cash), so nothing is said
        expect(h.drift, today).toBeUndefined();
        expect(JSON.stringify(plan), today).toBe(before);
      }
    });
  }
  it('a plan whose record shows the plan\'s mix (04) says nothing, and nor does 1% of drift; a third of the shares in cash is said, once', () => {
    for (const today of DATES) {
      const entries = entriesAt(today);
      const id = entryOf(C['04-buckets-running'], today).plan.id;
      expect(moveInputs(entries.find((e) => e.plan.id === id).plan, { now: noon(today) }).diff.complete, today).toBe(true);
      const h = homeOf(entries, id, { today });
      expect(h.stage.key, today).toBe('drawing');
      expect(h.drift, today).toBeUndefined();
    }
    // the shares line one per cent over its target: inside the band, so still the plan's mix
    const one = copy(C['04-buckets-running']);
    one.holdings.lines[0].value = Math.round(one.holdings.lines[0].value * 1.01);
    expect(homeOf([entryOf(one, TODAY)], one.id, { today: TODAY }).drift).toBeUndefined();
    // a third of the pension's shares moved into cash: the shares said against the plan's mix, with the way to test it
    const third = copy(C['04-buckets-running']);
    const sh = third.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'HMWO');
    const cash = third.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'CSH2');
    const moved = Math.round(sh.value / 3); sh.value -= moved; cash.value += moved;
    const e = entryOf(third, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    const mv = moveInputs(e.plan, { now: noon(TODAY), fromSettings: true });
    const pct = (x) => Math.round(100 * x / mv.diff.inPlay);
    expect(h.drift).toEqual({ kind: 'buckets', bucket: 'shares', held: pct(mv.diff.buckets.shares.held), plan: pct(mv.diff.buckets.shares.target), href: '#/plan/' + e.plan.id + '/review' });
    expect(h.drift.plan - h.drift.held).toBeGreaterThan(10);
    expect([...h.todo.items, ...h.todo.more].map((x) => x.id)).toEqual(['month.record']);
    expect(fill(HOME.drift.shares, { held: String(h.drift.held), mix: String(h.drift.plan) })).toBe('Shares are ' + h.drift.held + '% of your pension; the plan’s mix has ' + h.drift.plan + '% in shares.');
  });
  it('a plan not locked yet, living on its money, reads its drift against its settings in memory — nothing is written', () => {
    const raw = copy(C['04-buckets-running']);
    raw.decisionTool.settings = { ...raw.decisionTool.settings, locked: false };
    delete raw.planDocument;
    const sh = raw.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'HMWO');
    const cash = raw.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'CSH2');
    const moved = Math.round(sh.value / 3); sh.value -= moved; cash.value += moved;
    const e = entryOf(raw, TODAY);
    const before = JSON.stringify(e.plan);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.locked).toBe(false);
    expect(h.stage.key).toBe('drawing');
    if (h.drift) expect(h.drift).toMatchObject({ kind: 'buckets', href: '#/plan/' + e.plan.id + '/review' });
    expect(h.todo.count).toBe(0);
    expect(JSON.stringify(e.plan)).toBe(before);
  });
  it('the words: each bucket by its plain name, a share of the pension; the ladder\'s gilt by its year; never a sale', () => {
    const W = HOME.drift;
    expect(fill(W.cash, { held: '30', mix: '10' })).toBe('Cash is 30% of your pension; the plan’s mix has 10% in cash.');
    expect(fill(W.diversifiers, { held: '0', mix: '12' })).toBe('Other investments are 0% of your pension; the plan’s mix has 12% in other investments.');
    expect(fill(W.ladder, { year: '2027/28' })).toBe('Your ladder does not yet hold the gilt for 2027/28.');
    expect(W.link).toBe('Test with what I hold');
    // Moving: against the mix the plan moves to, inside the window
    expect(fill(W.moving.shares, { held: '70', mix: '50' })).toBe('Shares are 70% of your pension; your plan moves to 50% in shares.');
    expect(W.moving.close).toBe('What you hold is within 5% of your pension of the mix your plan moves to.');
    const all = (o) => Object.values(o).flatMap((v) => (typeof v === 'string' ? [v] : all(v)));
    for (const t of all(W)) expect(t).not.toMatch(/\b(sell|buy|should|transition)\b/i);
  });
  it('Moving, inside the window with a record: the window line, then where what is held stands — never a to-do; gone once accepted', () => {
    const C2 = corpus();
    const day = '2026-10-02';
    const p = C2['19-back-to-work-saving'];
    const h = homeOf([entryOf(p, day)], p.id, { today: day });
    expect(h.stage.key).toBe('moving');
    expect(h.moveWindow).toMatchObject({ id: 'moving' });
    expect(h.drift).toEqual({ kind: 'buckets', phase: 'moving', close: true, href: '#/plan/' + p.id + '/review' });
    expect(h.todo.count).toBe(0);
    // a third of the shares in cash: the bucket furthest from the mix the plan moves to
    const far = JSON.parse(JSON.stringify(p));
    const lines = far.holdings.lines.filter((l) => l.wrapper === 'SIPP');
    const cash = { wrapper: 'SIPP', ticker: 'CSH2', name: 'Cash fund', value: Math.round(lines.reduce((t, l) => t + (+l.value || 0), 0) / 2) };
    far.holdings.lines = [...far.holdings.lines, cash];
    const hf = homeOf([entryOf(far, day)], far.id, { today: day });
    expect(hf.drift).toMatchObject({ kind: 'buckets', phase: 'moving', bucket: expect.any(String) });
    expect(hf.drift.close).toBeUndefined();
    // nothing recorded: the window line says it can be recorded, and no held line
    const bare = JSON.parse(JSON.stringify(p)); delete bare.holdings;
    const hb = homeOf([entryOf(bare, day)], bare.id, { today: day });
    expect(hb.moveWindow).toMatchObject({ id: 'movingNoRecord' });
    expect(hb.drift).toBeUndefined();
  });
});

describe('the stage strip reads the move window (7.10.0)', () => {
  // Moved on purpose (the walk): the strip's saving month was the move window's opening, so a person whose window opened
  // years before they stopped read "Saving · to June 2023". Saving's month is now the stop, while it is still to come.
  it('Saving runs to the stop while it is still to come; once the stop is past, saving is done with no month', () => {
    const C2 = corpus();
    const p = C2['10-couple-b'];
    const h = homeOf([entryOf(p, '2026-10-02')], p.id, { today: '2026-10-02' });
    // stop January 2030, a three-year window: Saving to January 2030 (the stop), Moving after the window opens
    expect(h.stage.strip.map((s) => [s.key, s.state, s.month])).toEqual([['saving', 'now', 'January 2030'], ['moving', 'later', null], ['drawing', 'later', null]]);
    // inside the window, before the stop: saving is done, and still runs to the stop
    const m = homeOf([entryOf(p, '2028-06-02')], p.id, { today: '2028-06-02' });
    if (m.stage.strip[0].state === 'done') expect(m.stage.strip[0].month).toBe('January 2030');
    // after the stop: saving done, with no month (never a month long past, like the window's opening)
    const d = homeOf([entryOf(p, '2031-06-02')], p.id, { today: '2031-06-02' });
    expect(d.stage.strip[0]).toMatchObject({ key: 'saving', state: 'done', month: null });
    const q = C2['05-saver-committed'];
    const s = homeOf([entryOf(q, '2026-10-02')], q.id, { today: '2026-10-02' }).stage.strip[0];
    expect(s).toMatchObject({ key: 'saving', state: 'now' });
    expect(s.month).toMatch(/^[A-Z][a-z]+ \d{4}$/);
  });
});

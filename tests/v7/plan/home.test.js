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
  const TABLE = {
    '2026-10-02': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      // 7.3.3: stored with its start later; 7.4.3: its recorded months begin in July 2026, so the move goes to 2026/27, no question
      '20-locked-start-after-stop': ['drawing', 'start.moveRecords month.record hold.stale', null],
      '03-gilt-ladder-locked': ['drawing', 'month.record hold.stale', null],   // 7.4.2: a ladder running from the tax year work stopped
      '04-buckets-running': ['drawing', 'month.record hold.stale', null],
      '05-saver-committed': ['saving', 'checkin.due', null],
      '06-pre-6.4-no-timing': ['drawing', 'month.gap', null],
      '07-pre-6.13-flat-params': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '10-couple-b': ['saving', 'checkin.first', null],
      '11-guest-demo': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '12-lumpy-db-gia': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '13-stopped-drawing-since': ['drawing', 'month.gap hold.stale', null],
      '18-moved-to-new-plan-next': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', 'checkin.first', null],
      '19-back-to-work': ['closed', 'closed.next', 'Closed June 2025; carried on in ‘Saving again from July 2025’.']
    },
    '2027-04-05': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '20-locked-start-after-stop': ['drawing', 'start.moveRecords month.gap hold.stale', null],
      '03-gilt-ladder-locked': ['drawing', 'month.gap hold.stale', null],
      '04-buckets-running': ['drawing', 'month.gap hold.stale', null],
      '05-saver-committed': ['saving', 'checkin.due', null],
      '06-pre-6.4-no-timing': ['drawing', 'month.gap', null],
      '07-pre-6.13-flat-params': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '10-couple-b': ['moving', 'checkin.first', null],
      '11-guest-demo': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '12-lumpy-db-gia': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '13-stopped-drawing-since': ['drawing', 'month.gap hold.stale', null],
      '18-moved-to-new-plan-next': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', 'checkin.first', null],
      '19-back-to-work': ['closed', 'closed.next', 'Closed June 2025; carried on in ‘Saving again from July 2025’.']
    },
    '2027-04-06': {
      '01-fresh-default': [null, 'plan.noAge', null],
      '02-pnv-draft': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      // its start (April 2027) is this tax year by now, but its recorded months begin in 2026/27: still the move there (7.4.3)
      '20-locked-start-after-stop': ['drawing', 'start.moveRecords month.taxYear month.gap hold.stale', null],
      '03-gilt-ladder-locked': ['drawing', 'month.taxYear month.gap hold.stale', null],
      '04-buckets-running': ['drawing', 'month.taxYear month.gap hold.stale', null],
      '05-saver-committed': ['saving', 'checkin.due', null],
      '06-pre-6.4-no-timing': ['drawing', 'month.taxYear month.gap', null],
      '07-pre-6.13-flat-params': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '08-dotted-keys': [null, 'plan.noAge', null],
      '09-couple-a': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '10-couple-b': ['moving', 'checkin.first', null],
      '11-guest-demo': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '12-lumpy-db-gia': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '13-stopped-drawing-since': ['drawing', 'month.taxYear month.gap hold.stale', null],
      '18-moved-to-new-plan-next': ['drawing', 'lock.first', 'Months are recorded once the plan is locked.'],
      '18-moved-to-new-plan': ['closed', 'closed.next', 'Closed March 2025; carried on in ‘Pots and valves from April 2025’.'],
      '19-back-to-work-saving': ['moving', 'checkin.first', null],
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
    // the design's rank table: the invitation, the lock, the tax year, the arrival, the month, the move, the check-ins, the
    // aim, what you hold, the out-of-date answer and draft, the household — then the sentences that say where things stand
    const due = NEXT_ORDER.filter((x) => DUE_IDS[x]);
    // (P.moveLater: the move on a drawing plan that records nothing it holds, the design's "move.next: drawing (lower)")
    // (P.startMove / P.startAsk, 7.3.3: a locked plan stored with its start later than it should be, ranked just after the lock)
    expect(due).toEqual(['P.closed', 'P.noAge', 'P.agesFromSaving', 'P.invite', 'P.startDraft', 'P.draft', 'P.startMove', 'P.startAsk', 'P.startBlocked', 'P.taxyear', 'P.arrive', 'P.month', 'P.moveNext', 'P.moveFinish', 'P.gapSoon', 'P.firstCheckIn', 'P.pot', 'P.checkinDue', 'P.behind', 'P.noAim', 'P.holdStale', 'P.moveLater', 'P.recheck', 'P.stale', 'P.householdPending']);
    expect(NEXT_ORDER.slice(-6)).toEqual(['P.idle', 'P.working', 'P.approaching', 'P.onCourse', 'P.nextCheckIn', 'P.saving']);
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
        expect(h.todo.items.length).toBeLessThanOrEqual(3);
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
  it('a drawing plan with nothing due says the month recorded and the 1st of the next; "Not now" put what you hold off', () => {
    const raw = recordedThisMonth(C['04-buckets-running'], '2026-10');
    const e = entryOf(raw, TODAY);
    const id = e.plan.id;
    const before = homeOf([e], id, { today: TODAY });
    expect(before.todo.items.map((x) => x.id)).toEqual(['hold.stale']);
    expect(before.todo.items[0].dismiss).toEqual(['notNow']);
    expect(before.todo.items[0].key).toBe('hold.stale');
    const put = entryOf(withTasks(raw, ['hold.stale'], { until: '2026-11' }), TODAY);
    const h = homeOf([put], id, { today: TODAY });
    expect(h.todo.items).toEqual([]);
    expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toBe('October is recorded. Nothing is due until 1 November.');
    // the rail agrees, word for word as before
    const pg = planPage([put], id, 'plan', { today: TODAY });
    expect(pg.next.id).toBe('P.idle');
    expect(fill(PLAN.next['P.idle'], pg.next.slots)).toBe('October 2026 is recorded. Nothing to do until November.');
  });
  it('the plan\'s cadence: three months recorded at once reach ahead, so nothing is due until the 1st after the last of them', () => {
    const raw = copy(C['04-buckets-running']);
    raw.decisionTool.cadence = 'quarterly';
    const h0 = raw.decisionTool.history;
    for (const m of ['2026-10', '2026-11', '2026-12']) h0.push({ ...h0[h0.length - 1], date: m });
    const e = entryOf(withTasks(raw, ['hold.stale']), TODAY);
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
        const e = entryOf(withTasks(recordedThisMonth(raw, month), ['hold.stale']), today);
        const pg = planPage([e], e.plan.id, null, { today });
        if (!pg.life || pg.life.key !== 'drawing' || !pg.locked) continue;
        const h = homeOf([e], e.plan.id, { today });
        if (h.todo.count) continue;
        seen++;
        expect(h.quiet, e.plan.id).not.toBe(null);
        expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toMatch(/ is recorded\. Nothing is due until 1 [A-Z][a-z]+\.$/);
      }
      expect(seen).toBeGreaterThan(0);
    });
  }
  it('a saver with a cadence chosen: the next check-in\'s month; the legacy monthly pot: the 1st of next month once it is recorded', () => {
    const raw = copy(C['05-saver-committed']);
    raw.accumulationTool.history = [...(raw.accumulationTool.history || []), { date: '2026-10', sipp: 330000, isa: 42000, gia: 0, total: 372000, recordedAt: '2026-10-02T12:00:00.000Z' }];
    const e = entryOf(raw, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.todo.items).toEqual([]);
    expect(fill(HOME.quiet[h.quiet.id], h.quiet.slots)).toBe('October’s pot is recorded. Nothing is due until 1 November.');
  });
});

describe('the plans list, a partner\'s due lines, the soon item', () => {
  it('each row: the stage word and how many things are due (the same reading as the home)', () => {
    const entries = entriesAt(TODAY);
    const rows = planRows(entries, { today: TODAY }).groups.flatMap((g) => g.rows);
    const row = (name) => rows.find((r) => r.id === String(C[name].id));
    expect([row('04-buckets-running').life, row('04-buckets-running').todo]).toEqual(['drawing', 2]);
    // retaken on purpose (7.3.1): 03 records months, so it is Drawing and its move is not counted (it was ['moving', 3])
    expect([row('20-locked-start-after-stop').life, row('20-locked-start-after-stop').todo]).toEqual(['drawing', 3]);   // 7.3.3: and "When did you stop work?"
    expect([row('05-saver-committed').life, row('05-saver-committed').todo]).toEqual(['saving', 1]);
    // a closed plan's way on is not counted on its row (retaken on purpose: it was 1, "Closed · 1 to do")
    expect([row('18-moved-to-new-plan').life, row('18-moved-to-new-plan').todo]).toEqual(['closed', 0]);
    const put = planRows(entries.map((e) => (e.plan.id === C['04-buckets-running'].id ? { ...e, plan: withTasks(e.plan, ['hold.stale']) } : e)), { today: TODAY }).groups.flatMap((g) => g.rows);
    expect(put.find((r) => r.id === String(C['04-buckets-running'].id)).todo).toBe(1);
  });
  it('a partner\'s plan adds its month and its move, named by its plan, never its figures; not to the rail', () => {
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    const h = homeOf(entries, 'HouseSaver02', { today: TODAY });
    // retaken on purpose (7.3.1): the ladder records its months, so it is Drawing and its move is no longer a to-do
    expect(h.todo.partner.map((x) => [x.name, x.id])).toEqual([['Ladder plan', 'month.record']]);
    for (const x of h.todo.partner) expect(JSON.stringify(x)).not.toMatch(/£/);
    expect(planPage(entries, 'HouseSaver02', null, { today: TODAY }).due.map((d) => d.id)).not.toContain('month.record');
    // the same ladder before its first month: retaken in 7.10.0 — its stop has passed, so it is Living on it, and its move is
    // never a to-do (on its home or its partner's): what it holds differently is said as information
    const early = copy(ladder); early.decisionTool.history = [];
    const h2 = homeOf([entryOf(early), entryOf(saver)], 'HouseSaver02', { today: TODAY });
    expect(h2.todo.partner.map((x) => [x.name, x.id])).toEqual([['Ladder plan', 'month.record']]);
  });
  it('the next tax year\'s set-up is "soon" from 1 March: listed apart, never counted, never the rail\'s Next; its button chooses April', () => {
    const today = '2027-03-05';
    const raw = copy(C['04-buckets-running']);
    const h0 = raw.decisionTool.history;
    for (const m of ['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03']) h0.push({ ...h0[h0.length - 1], date: m });
    const e = entryOf(withTasks(raw, ['hold.stale']), today);
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
    store.dispatch({ type: A.PLAN_TASK, planId: String(raw.id), key: 'hold.stale', how: 'notNow' });
    await tick();
    expect(writes).toHaveLength(1);
    expect(writes[0].ref.path).toBe('users/u1/scenarios/' + raw.id);
    expect(Object.keys(writes[0].data)).toEqual(['tasks']);
    expect(writes[0].data.tasks).toEqual({ ...(raw.createdAt ? { of: raw.createdAt } : {}), dismissed: { 'hold.stale': { at: TODAY + 'T14:03:00.000Z', until: '2026-11' } } });
    expect(store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'task', previous: null, line: { id: 'putOff', slots: { month: 'November 2026' }, key: 'hold.stale' } });
    stop();
    // read back (another device): gone this month, back in November
    const stored = { ...raw, tasks: writes[0].data.tasks };
    expect(homeOf([entryOf(stored, TODAY)], raw.id, { today: TODAY }).todo.items.map((x) => x.id)).not.toContain('hold.stale');
    expect(homeOf([entryOf(stored, '2026-11-02')], raw.id, { today: '2026-11-02' }).todo.items.map((x) => x.id)).toContain('hold.stale');
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
    s = reduce(s, { type: A.PROFILE_SET, profile });
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
    expect(ALL_WRITES.length).toBe(162);
    expect(ALL_WRITES).toContain('stressTool.settings.legacyFirstTaxYear');
    expect(ALL_WRITES).toContain('planAmendments');
    expect(createHash('sha256').update(JSON.stringify(ALL_WRITES)).digest('hex')).toBe('f614a0757c31fe062f877a9538b2abac0037336a5e636fbe577f7264df387c28');
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
    .replace(/\{amount\}/g, '£12,300').replace(/\{years\}/g, '2027/28 to 2029/30');
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
  it('a locked plan read as Drawing with nothing it holds recorded: its move is still said, below the month, and can be put off', () => {
    const raw = copy(C['20-locked-start-after-stop']);
    raw.holdings = null;
    const e = entryOf(raw, TODAY);
    const pg = planPage([e], e.plan.id, null, { today: TODAY });
    expect(pg.life.key).toBe('drawing');
    expect(pg.due.map((d) => [d.id, d.pid, d.dismiss || null])).toEqual([['start.moveRecords', 'P.startMove', null], ['month.record', 'P.month', null], ['move.next', 'P.moveLater', ['notNow']]]);   // 7.4.3
    expect(planPage([entryOf(withTasks(raw, ['move.next'], { until: '2026-11' }), TODAY)], e.plan.id, null, { today: TODAY }).due.map((d) => d.id)).toEqual(['start.moveRecords', 'month.record']);
    // a plan whose holdings show the plan's mix (04) has nothing to move: no move to-do
    expect(planPage(entriesAt(TODAY), C['04-buckets-running'].id, null, { today: TODAY }).due.map((d) => d.id)).not.toContain('move.next');
  });
  it('a locked plan past its stop with nothing recorded yet is Living on it: the share of the mix it holds is said, never a count of moves to make (7.10.0)', () => {
    // retaken in 7.10.0: 03 and 13 before their first month read Moving from what they held; their stops have passed, so they
    // are Living on it, and the move is information
    for (const name of ['20-locked-start-after-stop', '13-stopped-drawing-since']) {
      const raw = copy(C[name]); raw.decisionTool.history = [];
      const entries = [entryOf(raw, TODAY)];
      const id = entries[0].plan.id;
      const h = homeOf(entries, id, { today: TODAY });
      expect(h.stage.key, name).toBe('drawing');
      expect(h.stage.moves, name).toBe(null);
      expect(h.heldMix, name).toMatchObject({ pct: moveInputs(entries[0].plan, { now: noon(TODAY) }).diff.progressPct });
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
  it('a partner\'s plan adds only its month, tax year and move: never its age, lock or invitation, whose words speak to its owner', () => {
    const entries = entriesAt(TODAY);
    const a = entryOf(C['09-couple-a'], TODAY).plan.id;
    const b = entryOf(C['10-couple-b'], TODAY).plan.id;
    expect(planPage(entries, a, null, { today: TODAY }).due.map((d) => d.id)).toContain('lock.first');
    expect(homeOf(entries, b, { today: TODAY }).todo.partner.map((x) => x.id)).not.toContain('lock.first');
    for (const e of entries) for (const x of homeOf(entries, e.plan.id, { today: TODAY }).todo.partner) {
      expect(['month.taxYear', 'month.arrive', 'month.record', 'month.gap', 'move.next', 'move.finish']).toContain(x.id);
    }
  });
});

describe('drawing while the holdings are not exact (7.3.1): a plan recording months reads Drawing; what it holds differently is said', () => {
  const MOVE_PIDS = ['P.moveNext', 'P.moveLater', 'P.moveFinish'];
  const noMonths = (name) => { const raw = copy(C[name]); raw.decisionTool.history = []; return raw; };
  for (const name of ['20-locked-start-after-stop', '13-stopped-drawing-since']) {
    it(`${name}: months recorded and short of the mix → Drawing, the share held under "Where you are", no move to-do, the rail's Next not a move`, () => {
      for (const today of DATES) {
        const entries = entriesAt(today);
        const id = entryOf(C[name], today).plan.id;
        const plan = entries.find((e) => e.plan.id === id).plan;
        const before = JSON.stringify(plan);
        expect(plan.decisionTool.history.length, today).toBeGreaterThan(0);
        const mv = moveInputs(plan, { now: noon(today) });
        expect(mv.diff.complete, today).toBe(false);
        const pg = planPage(entries, id, null, { today });
        expect(pg.life.key, today).toBe('drawing');
        for (const pid of MOVE_PIDS) expect(pg.due.map((d) => d.pid), today).not.toContain(pid);
        expect(MOVE_PIDS, today).not.toContain(pg.next.id);
        expect(MOVE_PIDS, today).not.toContain(planPage(entries, id, 'plan', { today }).next.id);
        const h = homeOf(entries, id, { today });
        // one source: the move page's own reading — the share of the mix held, the next order still open and how many after it
        expect(h.heldMix, today).toEqual({ pct: mv.diff.progressPct, label: String(mv.prog.next.label || mv.prog.next.ticker), more: mv.prog.total - mv.prog.doneCount - 1, ticked: false, href: '#/plan/' + id + '/move' });
        expect(planPage(entries, id, 'move', { today }).steps.find((s) => s.id === 'move').figures.heldPct, today).toBe(h.heldMix.pct);
        expect([...h.todo.items, ...h.todo.more].map((x) => x.id), today).not.toContain('move.next');
        expect([...h.todo.items, ...h.todo.more].map((x) => x.id), today).not.toContain('move.finish');
        // the move tool says the same share, never a count of moves to make; nothing on the stage says Moving
        const tool = h.tools.find((t) => t.id === 'move');
        expect(tool.held, today).toBe(h.heldMix.pct);
        expect(tool.moves, today).toBeUndefined();
        expect(h.stage.moves, today).toBe(null);
        expect(h.stage.strip.find((x) => x.state === 'now').key, today).toBe('drawing');
        // the strip never calls the move done beside the note saying how much of the mix is held: 'part', filled to that share
        expect(h.stage.strip.find((x) => x.key === 'moving'), today).toMatchObject({ state: 'part', held: h.heldMix.pct });
        expect(h.stage.strip.find((x) => x.key === 'saving').state, today).toBe('done');
        // and the move step, in "Your plan's steps", says that one share too (never its gilts bought beside it)
        expect(h.steps.find((s) => s.id === 'move').held, today).toBe(h.heldMix.pct);
        expect(JSON.stringify(plan), today).toBe(before);
      }
    });
    // retaken in 7.10.0: what is held never decides the stage — the same plan before its first month has passed its stop, so it
    // is Living on it too, its move said as information and never a to-do
    it(`${name}: the same plan before its first month → Living on it as well, no move to-do, the share held said`, () => {
      for (const today of DATES) {
        const e = entryOf(noMonths(name), today);
        const pg = planPage([e], e.plan.id, null, { today });
        expect(pg.life.key, today).toBe('drawing');
        for (const pid of MOVE_PIDS) expect(pg.due.map((d) => d.pid), today).not.toContain(pid);
        const h = homeOf([e], e.plan.id, { today });
        expect(h.heldMix, today).not.toBe(null);
        expect(h.where[0], today).toMatchObject({ step: 'where' });
      }
    });
  }
  it('a Drawing plan whose record shows the plan\'s mix (04, complete) says nothing, and nor does drift inside the plan\'s tolerance', () => {
    for (const today of DATES) {
      const entries = entriesAt(today);
      const id = entryOf(C['04-buckets-running'], today).plan.id;
      expect(moveInputs(entries.find((e) => e.plan.id === id).plan, { now: noon(today) }).diff.complete, today).toBe(true);
      const h = homeOf(entries, id, { today });
      expect(h.stage.key, today).toBe('drawing');
      expect(h.heldMix, today).toBe(null);
      expect(h.tools.find((t) => t.id === 'move').held, today).toBeUndefined();
      // nothing short: the move behind it is done, as 7.3.0 said it
      expect(h.stage.strip.find((x) => x.key === 'moving'), today).toEqual(expect.objectContaining({ state: 'done' }));
      expect(h.stage.strip.find((x) => x.key === 'moving').held, today).toBeUndefined();
      expect(h.steps.find((s) => s.id === 'move').held, today).toBeUndefined();
    }
    // the shares line one per cent over its target: inside the plan's own tolerance, so still the plan's mix
    const raw = copy(C['04-buckets-running']);
    raw.holdings.lines[0].value = Math.round(raw.holdings.lines[0].value * 1.01);
    const e = entryOf(raw, TODAY);
    expect(moveInputs(e.plan, { now: noon(TODAY) }).diff.complete).toBe(true);
    expect(homeOf([e], e.plan.id, { today: TODAY }).heldMix).toBe(null);
  });
  it('every order ticked while the record still falls short: said as that, never as a count; still no to-do', () => {
    const raw = copy(C['13-stopped-drawing-since']);
    const mv0 = moveInputs(entryOf(raw, TODAY).plan, { now: noon(TODAY) });
    raw.transition = { ...(raw.transition || {}), done: Object.fromEntries([...mv0.diff.buy, ...mv0.diff.sell].map((b) => [b.key, '2026-10-01'])) };
    const e = entryOf(raw, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.stage.key).toBe('drawing');
    expect(h.heldMix).toMatchObject({ pct: mv0.diff.progressPct, label: null, more: 0, ticked: true });
    expect([...h.todo.items, ...h.todo.more].map((x) => x.id)).not.toContain('move.finish');
  });
  it('a Drawing plan with no record of what it holds keeps 7.3.0\'s lower "next move" to-do with "Not now", and says no share', () => {
    const raw = copy(C['20-locked-start-after-stop']);
    raw.holdings = null;
    const e = entryOf(raw, TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    expect(h.stage.key).toBe('drawing');
    expect(h.heldMix).toBe(null);
    expect([...h.todo.items, ...h.todo.more].map((x) => [x.id, x.pid, x.dismiss || null])).toEqual([['start.moveRecords', 'P.startMove', null], ['month.record', 'P.month', null], ['move.next', 'P.moveLater', ['notNow']]]);   // 7.4.3
  });
  it('the words: the share and what is different, filled; the rail\'s move sentences word for word as 7.3.0 had them', () => {
    const W = HOME.heldMix;
    expect(fill(W.held, { pct: '94' })).toBe('You hold about 94% of your plan’s mix.');
    expect(fill(W.differentMany, { label: 'Index-linked gilt 2031', n: '3' })).toBe('Different from the plan: Index-linked gilt 2031 and 3 more.');
    expect(fill(W.differentOne, { label: 'Index-linked gilt 2031' })).toBe('Different from the plan: Index-linked gilt 2031.');
    expect(W.link).toBe('See the move');
    expect(PLAN.next['P.moveNext']).toBe('Next: move {n} of {of} to your plan’s mix: {label}.');
    expect(PLAN.next['P.moveLater']).toBe('Next: move {n} of {of} to your plan’s mix: {label}.');
    expect(PLAN.next['P.moveFinish']).toBe('Every move is ticked. Next: update what you hold, so it shows the plan’s mix.');
    for (const s of [W.held, W.differentOne, W.differentMany, W.ticked, W.link, PLAN.steps.move.short, HOME.toolHeld, HOME.items['move.later'].title, HOME.items['move.later'].detail]) expect(s).not.toMatch(/\bmoving\b|transition/i);
    // the Drawing plan's move to-do points at the step by the name it goes by there; the Moving plan's keeps the long name
    expect(HOME.items['move.later'].detail).toBe('Tick it on ‘Your plan’s mix’ when the order is placed.');
    expect(HOME.items['move.next'].detail).toBe('Tick it on Moving to your plan’s mix when the order is placed.');
  });
});

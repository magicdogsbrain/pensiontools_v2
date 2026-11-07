/**
 * A saver's check-in (research/saving-enough-and-check-in.md 5, the R3 part of section 8; release step R3). Fictional
 * people only (Alex, Sam), made here or from the committed corpus, never a real plan:
 *   - due dates for each cadence, across month ends, leap years and the turn of a year; never due before the first
 *     check-in; a plan locked while saving that never chose how often reads exactly as before (its pot step, its plans row);
 *   - the write: only the accumulationTool keys of 5.8, every other byte of the plan the same; the month's pot record
 *     written or replaced; on a locked plan three keys, past the lock guard, the plan still locked; never on a drawing plan;
 *   - the path: an unlocked plan's first check-in draws it from the check-in's own pot (year 0's middle line is that pot,
 *     with holdings recorded or not); the reading is saverReading's for the same pot; the frozen reading survives a path
 *     drawn again; the archive's budget;
 *   - the verdict is question B's own answer on saverInputsOf with the check-in: one test;
 *   - what changed adds up to the change in the pot the path counts, to the pound (pay-in changed, a pause, ISAs counted
 *     or not); the history; "Use these in my plan";
 *   - the calendar file holds the date and the words only; the note is capped at 280 characters, kept inside the plan
 *     (deleted with it) and in its download; the size budget of 5.11; the 121st check-in drops the oldest and keeps its
 *     pot record; every word of the check-in passes the banned list.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import {
  checkInOf, checkInPatch, checkInDraft, checkCheckIn, checkInDueOf, checkInState, cadenceOf, addMonths, whatChanged, calendarText,
  restartPathPatch, useInPlanPatch, archiveWith, pathDocOf, checkInsOf, readingOf,
  CHECKINS_KEPT, CHECKINS_WARN_FROM, NOTE_MAX, PATH_ARCHIVE_KEPT, PATH_ARCHIVE_BYTES, CHECKIN_FUTURES
} from '../../../src/answers/plan/checkIn.js';
import { CHECKIN_WRITES, SAVING_WRITES, CHECKIN_FIELDS, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { savedSaving, savingPatch } from '../../../src/answers/plan/saving.js';
import { planPage, planRows } from '../../../src/answers/plan/read.js';
import { saverReading, potRecordOf } from '../../../src/services/SaverReading.js';
import { checkInAllowed, SAVER_STAGE_KEYS } from '../../../src/services/LifeStage.js';
import { lockedPlanWriteRefusal, checkInWriteRefusal, CHECK_IN_KEYS, isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { planStage } from '../../../src/services/PlanReading.js';
import { planExportJson } from '../../../src/services/PlanExport.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { CHECKIN } from '../../../src/v7/copy/checkin.js';
import { BANNED } from '../../../src/v7/copy/banned.js';
import { corpus, entryOf, noon } from './_plans.js';

const C = corpus();
const KEPT_ON = '2026-11-04';
const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const at = (day, h = 12) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, h); };
const ENV = (today, futures = 100) => ({ today, futures, seed: 0, trace: false, detail: 'answer' });

/** Sam, 41, still saving (fictional, the design's own): B's inputs, a share of pay. */
const SAM = { household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95 };

/** Sam's answer kept as a plan, unlocked and still saving, as "Keep this as a plan" makes it. */
function samPlan(inputs = SAM) {
  const result = answerB(inputs, ENV(KEPT_ON));
  const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn: 'now' });
  const made = seedToScenario(seed, KEPT_ON).yours;
  made.id = 'SamSaving01';
  return upgradeScenario(copy(made), { now: noon(KEPT_ON) }).scenario;
}
/** One check-in on `today`, written as the one write file writes it; the plan after it. */
function checkIn(plan, today, typed, { result = null } = {}) {
  const now = at(today, 10);
  const p = checkInPatch(plan, typed, { today, now, result });
  expect(p.ok, JSON.stringify(p.errors)).toBe(true);
  return { plan: applyPatch(plan, { ...p.patch, lastModified: now.toISOString() }), patch: p.patch, record: p.record, previous: p.previous };
}
const SHARE = (pension, more = {}) => ({ 'ci.pension': String(pension), 'ci.kind': 'share', 'ci.pay': '38000', 'ci.ownPct': '6', 'ci.employerPct': '4', 'ci.savingsIn': '0', ...more });
const withEvery = (plan, every, list) => { const p = copy(plan); p.accumulationTool = { ...(p.accumulationTool || {}), checkInEvery: every, checkIns: list }; return p; };
const stub = (date, pension = 70000, more = {}) => ({ date, pot: { pension, isa: null, other: null }, pay: 38000, payIn: { kind: 'share', ownPct: 6, employerPct: 4, total: 316.67, savingsIn: 0 }, paused: null, reading: { path: null, pathBand: null, expected: null, band: null, fails: null }, recordedAt: date + 'T10:00:00.000Z', ...more });
/** Firestore's own count of a document's size: field names and strings in UTF-8 plus one, numbers eight, maps and lists their parts. */
function firestoreSize(v) {
  if (v === null || v === undefined) return 1;
  if (typeof v === 'boolean') return 1;
  if (typeof v === 'number') return 8;
  if (typeof v === 'string') return new TextEncoder().encode(v).length + 1;
  if (Array.isArray(v)) return v.reduce((t, x) => t + firestoreSize(x), 0);
  return Object.entries(v).reduce((t, [k, x]) => t + new TextEncoder().encode(k).length + 1 + firestoreSize(x), 0);
}

describe('how often, and when the next check-in is due (5.2)', () => {
  const plan = samPlan();
  const stageKey = 'saving';
  it('due once this month is at least the last check-in\'s month plus 12, 3 or 1 — by month, across month ends, leap years and the turn of a year', () => {
    const cases = [
      // [cadence, last check-in, first month due, the day before it]
      ['year', '2026-11-05', '2027-11-01', '2027-10-31'],
      ['quarter', '2026-11-05', '2027-02-01', '2027-01-31'],
      ['month', '2026-11-30', '2026-12-01', '2026-11-30'],
      ['month', '2027-01-31', '2027-02-01', '2027-01-31'],            // a month end: February is due from its first day
      ['quarter', '2026-12-15', '2027-03-01', '2027-02-28'],          // the turn of a year
      ['year', '2028-02-29', '2029-02-01', '2029-01-31'],             // a leap day: due the February after
      ['month', '2028-02-29', '2028-03-01', '2028-02-29'],
      ['quarter', '2028-02-29', '2028-05-01', '2028-04-30']
    ];
    for (const [every, last, dueOn, before] of cases) {
      const p = withEvery(plan, every, [stub(last)]);
      expect(checkInDueOf(p, { today: dueOn, stageKey }), `${every} ${last} on ${dueOn}`).toMatchObject({ every, chosen: true, last: last.slice(0, 7), next: dueOn.slice(0, 7), due: true });
      expect(checkInDueOf(p, { today: before, stageKey }).due, `${every} ${last} on ${before}`).toBe(false);
    }
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2028-02', 12)).toBe('2029-02');
    expect(addMonths('2026-11', 3)).toBe('2027-02');
  });
  it('a chosen cadence is never due before the first check-in; a saver who never chose is never reminded', () => {
    expect(checkInDueOf(withEvery(plan, 'year', []), { today: '2030-01-01', stageKey })).toMatchObject({ chosen: true, due: false, next: null });
    expect(checkInDueOf(withEvery(plan, 'month', undefined), { today: '2030-01-01', stageKey })).toMatchObject({ chosen: true, due: false });
    expect(checkInDueOf(plan, { today: '2030-01-01', stageKey })).toMatchObject({ every: null, chosen: false, legacy: false, due: false });
    expect(cadenceOf(withEvery(plan, 'fortnight', []), 'saving')).toEqual({ every: null, chosen: false, legacy: false });
  });
  it('a plan locked while saving that never chose: due exactly while this month\'s pot is not recorded, from its records (the pot step\'s own rule)', () => {
    const raw = C['05-saver-committed'];
    for (const today of ['2026-10-02', '2026-11-15', '2026-12-31', '2027-01-01']) {
      const e = entryOf(raw, today);
      const d = checkInDueOf(e.plan, { today, stageKey: 'committed-saving' });
      expect(d).toMatchObject({ every: 'month', chosen: false, legacy: true, due: true });
      const mon = today.slice(0, 7);
      const withPot = copy(raw);
      withPot.accumulationTool.history = [...withPot.accumulationTool.history.filter((r) => r.date !== mon), { date: mon, sipp: 330000, isa: 42000, gia: 0, total: 372000, recordedAt: today + 'T12:00:00.000Z' }];
      expect(checkInDueOf(entryOf(withPot, today).plan, { today, stageKey: 'committed-saving' }).due).toBe(false);
    }
  });
  it('the locked saver who never chose reads exactly as today: the step says what the pot step said, the next sentence is P.pot, the plans list says nothing', () => {
    const raw = C['05-saver-committed'];
    for (const today of ['2026-10-02', '2026-11-15', '2027-03-31']) {
      const e = entryOf(raw, today);
      const pg = planPage([e], e.plan.id, null, { today });
      const step = pg.steps.find((s) => s.id === 'checkin');
      const pot = planPage([e], e.plan.id, 'where', { today });
      void pot;
      expect(step.result.text).toMatch(/^[A-Z][a-z]+’s pot is not recorded yet$/);
      expect(step.result.id).toBe('pot.notYet');
      expect(pg.next.id).toBe('P.pot');
      expect(fill(PLAN.next[pg.next.id], pg.next.slots)).toBe('Your plan is locked and you stop work in February 2038. Next: record this month’s pot.');
      // 7.3.0 (retaken on purpose): ONE check-in rule — the plans list says "Check-in due" while this month's pot is not
      // recorded, as the rail and the home do
      const row = planRows([e], { today }).groups.flatMap((g) => g.rows)[0];
      expect(row.checkInDue).toBe(true);
    }
  });
  it('once a check-in has said how often: "Due" on the rail, the next sentence, "Check-in due" in the plans list; then on course or behind from the stored reading', () => {
    const p0 = withEvery(plan, 'year', [stub('2026-11-05', 70000, { reading: { band: 'no', fails: 700 } })]);
    const entries = (p, today) => [{ plan: p, newer: false, failed: false }].map((x) => ({ ...x, plan: upgradeScenario(copy(x.plan), { now: noon(today) }).scenario }));
    // due a year on
    let es = entries(p0, '2027-11-02');
    let pg = planPage(es, p0.id, null, { today: '2027-11-02' });
    expect(pg.next.id).toBe('P.checkinDue');
    expect(fill(PLAN.next[pg.next.id], pg.next.slots)).toBe('Next: your yearly check-in (the last was November 2026).');
    expect(pg.next.button).toEqual({ id: 'checkIn', href: '#/plan/' + p0.id + '/checkin', slots: {} });
    expect(pg.steps.find((s) => s.id === 'checkin').result.text).toBe('Due: your yearly check-in (the last was November 2026)');
    expect(planRows(es, { today: '2027-11-02' }).groups.flatMap((g) => g.rows)[0].checkInDue).toBe(true);
    // not due: behind at the last check-in
    es = entries(p0, '2027-03-02');
    pg = planPage(es, p0.id, null, { today: '2027-03-02' });
    expect(pg.next.id).toBe('P.behind');
    expect(fill(PLAN.next[pg.next.id], pg.next.slots)).toBe('At your last check-in (November 2026) you were not on course yet. Next: see what would put you on course.');
    expect(pg.next.button.href).toBe('#/plan/' + p0.id + '/saving');
    expect(planRows(es, { today: '2027-03-02' }).groups.flatMap((g) => g.rows)[0].checkInDue).toBe(false);
    // on course at the last check-in
    const p1 = withEvery(plan, 'quarter', [stub('2026-11-05', 70000, { reading: { band: 'yes', fails: 40 } })]);
    es = entries(p1, '2027-01-10');
    pg = planPage(es, p1.id, null, { today: '2027-01-10' });
    expect(pg.next.id).toBe('P.onCourse');
    expect(fill(PLAN.next[pg.next.id], pg.next.slots)).toBe('On course at your last check-in (November 2026). Next check-in: February 2027.');
    expect(pg.next.button).toBe(null);
    expect(pg.steps.find((s) => s.id === 'checkin').result.text).toBe('Checked in for November 2026: on course');
    // never checked in: the first step is What you pay in; since 7.3.0 the first check-in is due (the design's rank 10)
    pg = planPage(entries(plan, '2027-01-10'), plan.id, null, { today: '2027-01-10' });
    expect(pg.next.id).toBe('P.firstCheckIn');
    expect(pg.steps.find((s) => s.id === 'checkin').result.text).toBe('Not checked in yet');
  });
  it('the rail: check-in on every saver\'s rail in the pot step\'s place, never optional; the pot step\'s address opens it; checkInAllowed is the saver stages', () => {
    const pg = planPage([{ plan }], plan.id, 'pot', { today: KEPT_ON });
    expect(pg.current).toBe('checkin');
    expect(pg.steps.map((s) => s.id)).not.toContain('pot');
    expect(pg.steps.find((s) => s.id === 'checkin').optional).toBe(false);
    expect([...SAVER_STAGE_KEYS]).toEqual([...SAVER_STAGES]);
    for (const key of ['saving', 'approaching', 'committed-saving']) expect(checkInAllowed({ key })).toEqual({ ok: true, reason: null });
    for (const key of ['running', 'bridge', 'draft-retired', 'unknown']) expect(checkInAllowed({ key })).toEqual({ ok: false, reason: 'notSaving' });
    expect(checkInAllowed(null).ok).toBe(false);
  });
});

describe('the write: the check-in, the month\'s pot record, how often, an unlocked plan\'s path (5.1, 5.3, 5.8)', () => {
  const plan = samPlan();
  it('an unlocked saver\'s first check-in: only the accumulationTool keys of 5.8, every other byte the same; the path drawn from its own pot', () => {
    const typed = SHARE(64500, { 'ci.isa': '3200', 'ci.note': 'A new job in the spring.' });
    const { plan: after, patch, record } = checkIn(plan, '2026-11-20', typed);
    expect(Object.keys(patch).sort()).toEqual(['accumulationTool.checkInEvery', 'accumulationTool.checkIns', 'accumulationTool.history', 'accumulationTool.path']);
    for (const k of Object.keys(patch)) { expect(CHECKIN_WRITES).toContain(k); expect(ALL_WRITES).toContain(k); }
    // every other byte of the plan as it was
    const rest = (p) => { const o = copy(p); delete o.lastModified; for (const k of ['checkIns', 'history', 'checkInEvery', 'path', 'pathArchive']) delete o.accumulationTool[k]; return JSON.stringify(o); };
    expect(rest(after)).toBe(rest(plan));
    expect(after.accumulationTool.checkInEvery).toBe('year');
    expect(record).toMatchObject({ date: '2026-11-20', pot: { pension: 64500, isa: 3200, other: null }, pay: 38000, payIn: { kind: 'share', ownPct: 6, employerPct: 4, total: 316.67, savingsIn: 0 }, paused: null, note: 'A new job in the spring.' });
    // the path starts at the check-in's own pot: year 0's middle line is the pension and the ISA, drawn from them
    const path = after.accumulationTool.path;
    expect(path.version).toBe(3);
    expect(path.potSource).toBe('check-in');
    expect(path.isaSource).toBe('check-in');
    expect(path.asOf).toBe('2026-11');
    expect(path.path[0].nominal.middling).toBe(64500 + 3200);
    expect(path.totalMonthly).toBe(317);
    // the month's pot record: one ledger for pot values
    expect(after.accumulationTool.history).toEqual([{ date: '2026-11', sipp: 64500, isa: 3200, gia: 0, total: 67700, recordedAt: at('2026-11-20', 10).toISOString(), isaEntered: true }]);
    // the reading is saverReading's own for the same pot, against the path drawn
    expect(record.reading.path).toEqual({ source: 'saving', asOf: '2026-11', version: 3 });
    const sr = saverReading({ accumulation: path }, { at: '2026-11', pension: 64500, isa: 3200 });
    expect(record.reading.pathBand).toBe(sr.band);
    expect(record.reading.expected).toBe(sr.expected);
    expect(record.reading.pathBand).toBe('start');
  });
  it('the path starts at the check-in\'s pot with holdings recorded too: the holdings decide only the saving mix', () => {
    const held = copy(plan);
    held.holdings = { version: 1, updatedAt: '2026-11-01T09:00:00.000Z', source: 'typed', lines: [{ wrapper: 'SIPP', ticker: 'VWRP', name: 'All-world shares', value: 90000 }] };
    const { plan: after } = checkIn(held, '2026-11-20', SHARE(64500));
    expect(after.accumulationTool.path.path[0].nominal.middling).toBe(64500);
    expect(after.accumulationTool.path.potSource).toBe('check-in');
    expect(after.accumulationTool.path.mixes.fromHoldings).toBe(true);
  });
  it('a second check-in in the same month corrects the first: one check-in and one pot record for the month, the path drawn again from it', () => {
    const one = checkIn(plan, '2026-11-20', SHARE(64500)).plan;
    const two = checkIn(one, '2026-11-28', SHARE(64900)).plan;
    expect(checkInsOf(two).map((c) => c.date)).toEqual(['2026-11-28']);
    // correcting a later check-in: the month what goes in changed is read against the check-in before it
    const later = checkIn(upgradeScenario(copy(two), { now: noon('2027-11-10') }).scenario, '2027-11-10', SHARE(74600, { 'ci.ownPct': '16', 'ci.since': '2027-03' })).plan;
    expect(checkCheckIn(later, SHARE(74800, { 'ci.ownPct': '16', 'ci.since': '2027-03' }), { today: '2027-11-25' }).errors['ci.since']).toBeUndefined();
    const fixed = checkIn(later, '2027-11-25', SHARE(74800, { 'ci.ownPct': '16', 'ci.since': '2027-03' }));
    expect(fixed.record.payIn.since).toBe('2027-03');
    expect(checkInsOf(fixed.plan).map((c) => c.date)).toEqual(['2026-11-28', '2027-11-25']);
    expect(two.accumulationTool.history.filter((r) => r.date === '2026-11')).toHaveLength(1);
    expect(two.accumulationTool.history.find((r) => r.date === '2026-11').sipp).toBe(64900);
    expect(two.accumulationTool.path.path[0].nominal.middling).toBe(64900);
  });
  it('a later check-in never draws the path again, and never changes a setting; the pot record of its month is written beside the others', () => {
    const one = checkIn(plan, '2026-11-20', SHARE(64500)).plan;
    const later = checkIn(upgradeScenario(copy(one), { now: noon('2027-11-10') }).scenario, '2027-11-10', SHARE(74600, { 'ci.ownPct': '16', 'ci.since': '2026-12' }));
    expect(Object.keys(later.patch).sort()).toEqual(['accumulationTool.checkIns', 'accumulationTool.history']);
    expect(JSON.stringify(later.plan.accumulationTool.path)).toBe(JSON.stringify(one.accumulationTool.path));
    expect(JSON.stringify(later.plan.accumulationTool.settings)).toBe(JSON.stringify(one.accumulationTool.settings));
    expect(later.plan.accumulationTool.history.map((r) => r.date)).toEqual(['2026-11', '2027-11']);
    expect(later.record.payIn).toMatchObject({ kind: 'share', ownPct: 16, employerPct: 4, since: '2026-12' });
    expect(later.record.reading.path).toEqual({ source: 'saving', asOf: '2026-11', version: 3 });
    expect(['below', 'p10–p50', 'p50–p90', 'above p90', 'below p10']).toContain(later.record.reading.pathBand);
  });
  it('a locked saver: exactly three keys, past the lock guard and the check-in\'s own; the plan stays locked; read against the document\'s path', () => {
    const e = entryOf(C['05-saver-committed'], '2026-11-05');
    const locked = e.plan;
    expect(isLockedSettings(locked.decisionTool.settings)).toBe(true);
    const p = checkInPatch(locked, { 'ci.pension': '330000', 'ci.isa': '42000' }, { today: '2026-11-05', now: at('2026-11-05'), result: null });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual([...CHECK_IN_KEYS.locked].sort());
    const data = { ...p.patch, lastModified: '2026-11-05T12:00:00.000Z' };
    expect(lockedPlanWriteRefusal(locked, data, getDefaultStressSettings())).toBe(null);
    expect(checkInWriteRefusal(locked, data)).toBe(null);
    const after = applyPatch(locked, data);
    expect(isLockedSettings(after.decisionTool.settings)).toBe(true);
    expect(JSON.stringify(after.planDocument)).toBe(JSON.stringify(locked.planDocument));
    expect(JSON.stringify(after.stressTool)).toBe(JSON.stringify(locked.stressTool));
    expect(JSON.stringify(after.decisionTool)).toBe(JSON.stringify(locked.decisionTool));
    expect(p.record.reading.path).toMatchObject({ source: 'document' });
    // the middle figure in the pot's own pounds: this document's version-2 path is in the prices of its lock (July 2026)
    const sr0 = saverReading(locked.planDocument, { at: '2026-11', pension: 330000, isa: 42000 });
    expect(p.record.reading.expected).toBe(Math.round(sr0.expected * sr0.prices.factor));
    // any write beyond the allowance on a locked plan is refused: a setting, the plan document, the path an unlocked plan keeps
    for (const extra of [{ 'stressTool.settings.baseSalary': 1 }, { planDocument: {} }, { 'accumulationTool.path': {} }, { 'accumulationTool.settings': {} }]) {
      expect(checkInWriteRefusal(locked, { ...data, ...extra }), JSON.stringify(extra)).toEqual(Object.keys(extra));
    }
    expect(lockedPlanWriteRefusal(locked, { ...data, 'stressTool.settings.baseSalary': 1 }, getDefaultStressSettings())).toEqual(['stress.baseSalary']);
  });
  it('never on a drawing plan: refused before anything is worked out (the stop month makes a saver\'s plan running)', () => {
    for (const name of ['04-buckets-running', '12-lumpy-db-gia', '20-locked-start-after-stop']) {
      const e = entryOf(C[name], '2026-11-05');
      expect(checkInDraft(e.plan, { 'ci.pension': '100000' }, { today: '2026-11-05' })).toEqual({ ok: false, problem: 'notSaving' });
      expect(checkInPatch(e.plan, { 'ci.pension': '100000' }, { today: '2026-11-05', now: at('2026-11-05') }).ok).toBe(false);
      expect(checkInOf([e], e.plan.id, { today: '2026-11-05' })).toMatchObject({ found: true, allowed: false, editable: false });
    }
    // nor the check-in's own buttons: a drawing plan that kept check-ins from its saving years writes nothing from them
    const ran = copy(entryOf(C['04-buckets-running'], '2026-11-05').plan);
    ran.accumulationTool = { ...(ran.accumulationTool || {}), checkIns: [{ date: '2026-11-02', pot: { pension: 100000, isa: null, other: null }, pay: 30000, payIn: { kind: 'total', total: 500, savingsIn: 0 }, paused: null }], path: { version: 3, asOf: '2026-11', path: [{ year: 0, nominal: { careful: 1, middling: 1, good: 1 } }] } };
    expect(useInPlanPatch(ran, { today: '2026-11-05' })).toMatchObject({ ok: false, problem: 'notSaving', patch: {} });
    expect(restartPathPatch(ran, { today: '2026-11-05', now: at('2026-11-05') })).toMatchObject({ ok: false, problem: 'notSaving', patch: {} });
    // the plan locked while saving, from its stop month: running, so no check-in
    const raw = C['05-saver-committed'];
    const stop = entryOf(raw, '2038-02-15');
    expect(planStage(stop.plan, { now: noon('2038-02-15') }).key).toBe('running');
    expect(checkInDraft(stop.plan, { 'ci.pension': '100000' }, { today: '2038-02-15' }).problem).toBe('notSaving');
    expect(checkInDraft(entryOf(raw, '2038-01-15').plan, { 'ci.pension': '100000' }, { today: '2038-01-15' }).ok).toBe(true);
  });
  it('the boxes: the pension needed, a share needs its pay, the month a pay-in changed after the last check-in, a pause in order, the note at most 280 characters', () => {
    const one = checkIn(plan, '2026-11-20', SHARE(64500)).plan;
    const today = '2027-11-10';
    const err = (typed, p = one) => checkCheckIn(p, typed, { today }).errors;
    expect(err({})['ci.pension']).toBe('required');
    expect(err({ 'ci.pension': 'lots' })['ci.pension']).toBe('notANumber');
    expect(err({ 'ci.pension': '70000', 'ci.pay': '' })['ci.pay']).toBe('required');
    expect(err({ 'ci.pension': '70000', 'ci.since': '2026-11' })['ci.since']).toBe('beforeLast');
    expect(err({ 'ci.pension': '70000', 'ci.since': '2027-12' })['ci.since']).toBe('inFuture');
    expect(err({ 'ci.pension': '70000', 'ci.since': 'March' })['ci.since']).toBe('notAMonth');
    // a month in words, as "About you and when" takes one: read as the month
    for (const t of ['March 2027', 'Mar 2027', '2027-3', '03/2027']) {
      const c = checkCheckIn(one, { 'ci.pension': '70000', 'ci.since': t, 'ci.paused': 'yes', 'ci.pausedFrom': 'January 2027', 'ci.pausedTo': 'Feb 2027' }, { today });
      expect(c.errors, t).toEqual({});
      expect(c.values, t).toMatchObject({ 'ci.since': '2027-03', 'ci.pausedFrom': '2027-01', 'ci.pausedTo': '2027-02' });
    }
    expect(CHECKIN.fields['ci.since'].help).toMatch(/or March 2027/);
    expect(err({ 'ci.pension': '70000', 'ci.paused': 'yes' })['ci.pausedFrom']).toBe('required');
    expect(err({ 'ci.pension': '70000', 'ci.paused': 'yes', 'ci.pausedFrom': '2027-05', 'ci.pausedTo': '2027-04' })['ci.pausedTo']).toBe('beforeFrom');
    expect(err({ 'ci.pension': '70000', 'ci.kind': 'split', 'ci.own': '9000', 'ci.employer': '2000' })['ci.employer']).toBe('overLimit');
    // the note: 280 characters kept; 281 refused; the screen asks people to leave out health details
    expect(NOTE_MAX).toBe(280);
    expect(CHECKIN_FIELDS.find((f) => f.path === 'ci.note').max).toBe(NOTE_MAX);
    expect(err({ 'ci.pension': '70000', 'ci.note': 'é'.repeat(280) })['ci.note']).toBeUndefined();
    expect(err({ 'ci.pension': '70000', 'ci.note': 'a'.repeat(281) })['ci.note']).toBe('tooLong');
    expect(CHECKIN.fields['ci.note'].help).toMatch(/leave out anything about your health/);
    expect(CHECKIN.fields['ci.note'].help).toMatch(/280 characters/);
    // the ISA is needed once the path counts ISAs and savings
    const withIsa = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.isa': '3200' })).plan;
    expect(err({ 'ci.pension': '70000' }, withIsa)['ci.isa']).toBe('required');
    expect(err({ 'ci.pension': '70000' }, one)['ci.isa']).toBeUndefined();
  });
  it('a blank ISA box at the first check-in leaves ISAs and savings out of the path, even with money going into them', () => {
    // money goes into ISAs and savings (prefilled from the plan, or typed); the ISA box is left blank
    const plan = samPlan();
    const first = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.savingsIn': '150' }));
    expect(first.record.pot.isa).toBe(null);
    expect(first.record.payIn.savingsIn).toBe(150);
    const path = first.plan.accumulationTool.path;
    expect(path).toMatchObject({ isaNow: 0, isaMonthly: 0, potSource: 'check-in' });
    expect(path.path[0].nominal.middling).toBe(64500);
    // so the next check-in does not ask for it, and reads the pension against a pension-only path
    const later = upgradeScenario(copy(first.plan), { now: noon('2027-11-10') }).scenario;
    expect(checkCheckIn(later, SHARE(70000, { 'ci.savingsIn': '150' }), { today: '2027-11-10' }).errors['ci.isa']).toBeUndefined();
    expect(checkInOf([{ plan: later }], later.id, { today: '2027-11-10' })).toMatchObject({ isaNeeded: false, path: { isa: false } });
    const two = checkIn(later, '2027-11-10', SHARE(70000, { 'ci.savingsIn': '150', 'ci.isa': '2000' }));
    const v = checkInOf([{ plan: two.plan }], two.plan.id, { today: '2027-11-10' });
    expect(v.latest.path.pension).toBe(true);
    expect(v.latest.changed).toMatchObject({ isaCounted: false, from: '£64,500', to: '£70,000', savings: null });
    // typed at the first check-in, the ISA and what goes into it are counted, as before
    const typed = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.savingsIn': '150', 'ci.isa': '3200' })).plan.accumulationTool.path;
    expect(typed).toMatchObject({ isaNow: 3200, isaMonthly: 150, isaSource: 'check-in' });
  });
  it('the boxes start from the last check-in, else the plan, in the person\'s own kind; the pots never; how often as chosen, else once a year (a locked saver who never chose: each month)', () => {
    const v0 = checkInOf([{ plan }], plan.id, { today: KEPT_ON });
    const shown = Object.fromEntries(v0.fields.map((f) => [f.path, f.shown]));
    expect(shown).toMatchObject({ 'ci.pension': '', 'ci.isa': '', 'ci.kind': 'share', 'ci.pay': '38000', 'ci.ownPct': '6', 'ci.employerPct': '4', 'ci.every': 'year', 'ci.paused': 'no' });
    expect(v0.first).toBe(true);
    const one = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.ownPct': '8', 'ci.every': 'quarter' })).plan;
    const v1 = Object.fromEntries(checkInOf([{ plan: one }], one.id, { today: '2027-02-10' }).fields.map((f) => [f.path, f.shown]));
    expect(v1).toMatchObject({ 'ci.pension': '', 'ci.ownPct': '8', 'ci.every': 'quarter' });
    const locked = entryOf(C['05-saver-committed'], '2026-11-05');
    const v2 = Object.fromEntries(checkInOf([locked], locked.plan.id, { today: '2026-11-05' }).fields.map((f) => [f.path, f.shown]));
    expect(v2).toMatchObject({ 'ci.kind': 'split', 'ci.every': 'month', 'ci.pension': '' });
  });
});

describe('the verdict from here is B\'s own answer on the check-in\'s figures (5.5): one test, no second model', () => {
  it('the frozen reading is the run\'s band, count, aim, incomes, gap and what would be enough; the run is B on saverInputsOf with the check-in', () => {
    const plan = samPlan();
    const today = '2026-11-20';
    const typed = SHARE(64500, { 'ci.ownPct': '6' });
    const d = checkInDraft(plan, typed, { today });
    expect(d.ok).toBe(true);
    expect(d.read.ok).toBe(true);
    expect(d.read.inputs.you.pot).toBe(64500);
    expect(d.read.inputs.you.payIn).toEqual({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 });
    expect(d.read.notes.potFrom).toBe('checkIn');
    const same = saverInputsOf(plan, { today, checkIn: d.record });
    expect(same.inputs).toEqual(d.read.inputs);
    const result = answerB(d.read.inputs, { ...ENV(today, CHECKIN_FUTURES), ...d.read.env });
    const { record } = checkIn(plan, today, typed, { result });
    expect(record.reading).toMatchObject({ band: result.verdict.band, fails: result.chance.fails, aim: result.spend.perMonth, bad: result.income.bad, middling: result.income.middling, gap: result.gap.year, engineVersion: result.basis.engineVersion });
    if (result.enough && result.enough.nineInTen) expect(record.reading.enough).toMatchObject({ nine: result.enough.nineInTen.payIn, nineTotalPct: result.enough.nineInTen.totalPct });
    // the frozen reading is small: no futures, no lines, no repeated aim object
    expect(JSON.stringify(record.reading).length).toBeLessThan(500);
    // a pause still running: the verdict at £0 now, in the same kind
    const paused = checkInDraft(plan, SHARE(64500, { 'ci.paused': 'yes', 'ci.pausedFrom': '2026-09' }), { today });
    expect(paused.read.inputs.you.payIn).toEqual({ kind: 'share', pay: 38000, ownPct: 0, employerPct: 0 });
    // no aim: the check-in is still written, with no verdict
    const noAim = copy(plan);
    noAim.stressTool.settings = { ...noAim.stressTool.settings, incomeShape: 'level', baseSalary: 0, incomeSteps: [], targetSchedule: null };
    const n = checkInDraft(noAim, typed, { today });
    expect(n.ok).toBe(true);
    expect(n.read).toMatchObject({ ok: false, why: 'noAim' });
    expect(checkIn(noAim, today, typed).record.reading.band).toBe(null);
  }, 60000);
});

describe('the answer\'s own chance for what would be enough holds at a check-in too', () => {
  it('a plan kept from B at 3 in 4: a check-in on the same figures leads with the same pay-in as What you pay in', () => {
    const plan = samPlan({ ...SAM, confidence: 'threeInFour' });
    const today = KEPT_ON;
    const own = saverInputsOf(plan, { today });
    expect(own.inputs.confidence).toBe('threeInFour');
    // the check-in types the plan's own pot and pay-in
    const d = checkInDraft(plan, SHARE(62000), { today });
    expect(d.read.inputs.confidence).toBe('threeInFour');
    const env = (r) => ({ ...ENV(today, CHECKIN_FUTURES), ...r.env });
    const a = answerB(own.inputs, env(own));
    const b = answerB(d.read.inputs, env(d.read));
    expect(b.chance.fails).toBe(a.chance.fails);
    expect(a.payIn.needed).toBeGreaterThan(0);
    expect(b.payIn.needed).toBe(a.payIn.needed);
    expect(b.sentences.enoughHead.text).toBe(a.sentences.enoughHead.text);
    // kept at 9 in 10, or with no record of the answer: 9 in 10, check-in or not
    expect(checkInDraft(samPlan(), SHARE(62000), { today }).read.inputs.confidence).toBe('nineInTen');
    const bare = copy(plan); delete bare.fromAnswer;
    expect(checkInDraft(bare, SHARE(62000), { today }).read.inputs.confidence).toBe('nineInTen');
  }, 60000);
});

describe('what changed (5.5, 5.6): the parts add up to the change in the pot the path counts, to the pound', () => {
  it('a pay-in raised from a month after the last check-in: the earlier rate until then, this one\'s after; the rest is markets, charges and anything not recorded', () => {
    const prev = stub('2026-11-05', 62000, { pay: 38000, payIn: { kind: 'share', ownPct: 6, employerPct: 4, total: 316.67, savingsIn: 0 } });
    const cur = stub('2027-11-08', 74600, { pay: 38000, payIn: { kind: 'share', ownPct: 16, employerPct: 4, total: 633.33, savingsIn: 0, since: '2026-12' } });
    const c = whatChanged(prev, cur);
    expect(c.months).toBe(12);
    // each pay-in in whole pounds, so the sentence multiplies out to the pound: £317 × 1 + £633 × 11 = £7,280
    expect(c.pension).toEqual([{ perMonth: 317, months: 1 }, { perMonth: 633, months: 11 }]);
    expect(c.paidPension).toBe(317 + 633 * 11);
    expect(c.paidPension).toBe(7280);
    expect(c.from + c.paidPension + c.rest).toBe(c.to);
    expect(c.to - c.from).toBe(12600);
    // no month given: the earlier rate for the whole time; the change not recorded falls in the rest
    const blank = whatChanged(prev, { ...cur, payIn: { ...cur.payIn, since: undefined } });
    expect(blank.pension).toEqual([{ perMonth: 317, months: 12 }]);
    expect(blank.from + blank.paidPension + blank.rest).toBe(blank.to);
  });
  it('a pause: months at £0; ISAs and savings counted when the path counts them, with what goes into them', () => {
    const prev = stub('2027-01-15', 50000, { pot: { pension: 50000, isa: 8000, other: null }, payIn: { kind: 'total', total: 400, savingsIn: 150 } });
    const cur = stub('2028-01-20', 55000, { pot: { pension: 55000, isa: 9900, other: 1000 }, payIn: { kind: 'total', total: 400, savingsIn: 150 }, paused: { from: '2027-06', to: '2027-09' } });
    const c = whatChanged(prev, cur, { isaCounted: true });
    expect(c.months).toBe(12);
    // January to May, then September to December (paused June to August): the same rate, said once; the pause on its own line
    expect(c.pension).toEqual([{ perMonth: 400, months: 9 }]);
    expect(c.savings).toEqual([{ perMonth: 150, months: 9 }]);
    expect(c.paidPension).toBe(400 * 9);
    expect(c.paidSavings).toBe(150 * 9);
    expect(c.from).toBe(58000);
    expect(c.to).toBe(64900);   // the other account is not in the pot the path counts
    expect(c.from + c.paidPension + c.paidSavings + c.rest).toBe(c.to);
    const pensionOnly = whatChanged(prev, cur, { isaCounted: false });
    expect(pensionOnly.savings).toBe(null);
    expect(pensionOnly.from + pensionOnly.paidPension + pensionOnly.rest).toBe(pensionOnly.to);
    // still paused at the check-in: nothing from the month it stopped
    const still = whatChanged(prev, { ...cur, paused: { from: '2027-10', to: null } });
    expect(still.paidPension).toBe(400 * 9);
    // a path that counts ISAs, but the earlier check-in left the ISA box blank (a lock drawn after it): no figure is never
    // £0, so the change is the pension's alone and still adds up
    const blankBefore = whatChanged({ ...prev, pot: { pension: 50000, isa: null, other: null } }, cur, { isaCounted: true });
    expect(blankBefore).toMatchObject({ isaCounted: false, from: 50000, to: 55000, savings: null, paidSavings: null });
    expect(blankBefore.from + blankBefore.paidPension + blankBefore.rest).toBe(blankBefore.to);
  });
  it('a pause still running at the last check-in runs on until this one says it ended — never the earlier rate', () => {
    const base = (date, pension, more = {}) => stub(date, pension, { pay: null, payIn: { kind: 'total', total: 400, savingsIn: 0 }, ...more });
    const prev = base('2026-11-05', 50000, { paused: { from: '2026-10', to: null } });
    // answered "No" with no month: starting again is not recorded, so nothing is counted as paid in
    const none = whatChanged(prev, base('2027-11-05', 54000));
    expect(none).toMatchObject({ months: 12, paidPension: 0, rest: 4000, pausedBefore: { from: '2026-10', to: null } });
    expect(none.pension).toEqual([]);
    // the month it started again, given as when what goes in changed: paid from then
    const since = whatChanged(prev, base('2027-11-05', 54000, { payIn: { kind: 'total', total: 400, savingsIn: 0, since: '2027-05' } }));
    expect(since).toMatchObject({ paidPension: 400 * 6, rest: 4000 - 2400, pausedBefore: { from: '2026-10', to: '2027-05' } });
    // the same pause given its end: the same months, said as this check-in's own pause
    const ended = whatChanged(prev, base('2027-11-05', 54000, { paused: { from: '2026-10', to: '2027-05' } }));
    expect(ended).toMatchObject({ paidPension: 400 * 6, pausedBefore: null });
    for (const c of [none, since, ended]) expect(c.from + c.paidPension + c.rest).toBe(c.to);
    // a pause between two stretches at one rate, then a new rate: "£400 a month for 5 months and £500 a month for 5 months"
    const between = whatChanged(base('2026-11-05', 50000), base('2027-11-05', 56000, { payIn: { kind: 'total', total: 500, savingsIn: 0, since: '2027-06' }, paused: { from: '2027-02', to: '2027-04' } }));
    expect(between.pension).toEqual([{ perMonth: 400, months: 5 }, { perMonth: 500, months: 5 }]);
    expect(between.paidPension).toBe(400 * 5 + 500 * 5);
    // the record keeps the month it started again, even at the same rate as before
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.paused': 'yes', 'ci.pausedFrom': '2026-10' })).plan;
    const aged = upgradeScenario(copy(one), { now: noon('2027-11-10') }).scenario;
    const v0 = checkInOf([{ plan: aged }], aged.id, { today: '2027-11-10' });
    expect(v0.pausedBefore).toBe(true);
    expect(Object.fromEntries(v0.fields.map((f) => [f.path, f.shown]))).toMatchObject({ 'ci.paused': 'yes', 'ci.pausedFrom': '2026-10' });
    const two = checkIn(aged, '2027-11-10', SHARE(70000, { 'ci.paused': 'no', 'ci.since': '2027-04' }));
    expect(two.record.payIn.since).toBe('2027-04');
    const v = checkInOf([{ plan: two.plan }], two.plan.id, { today: '2027-11-10' });
    expect(v.latest.changed.pension).toEqual([{ perMonth: '£317', months: 7 }]);
    expect(v.latest.changed.pausedBefore).toEqual({ from: 'October 2026', to: 'April 2027' });
    expect(v.pausedBefore, 'a check-in of this month corrects itself: the box asks again only from the one before').toBe(true);
  });
  it('on the screen, the last check-in\'s result says it: what changed, then and now, the next check-in', () => {
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500), { result: { status: 'ok', verdict: { band: 'no' }, chance: { fails: 700 }, spend: { perMonth: 1810 }, income: { bad: 1310, middling: 1630 }, gap: { year: 6000 }, enough: { nineInTen: { payIn: 982, ownPct: 27, totalPct: 31 }, threeInFour: { payIn: 697, ownPct: 18, totalPct: 22 } }, basis: { engineVersion: 'test' } } }).plan;
    const twoP = upgradeScenario(copy(one), { now: noon('2027-11-10') }).scenario;
    const two = checkIn(twoP, '2027-11-10', SHARE(74600, { 'ci.ownPct': '16', 'ci.since': '2026-12', 'ci.note': 'Raised what goes in.' }), { result: { status: 'ok', verdict: { band: 'no' }, chance: { fails: 300 }, spend: { perMonth: 1810 }, income: { bad: 1500, middling: 1800 }, gap: { year: 3720 }, enough: { nineInTen: { payIn: 918, ownPct: 25, totalPct: 29 }, threeInFour: null }, basis: { engineVersion: 'test' } } }).plan;
    const v = checkInOf([{ plan: two }], two.id, { today: '2027-11-10' });
    expect(v.latest.month).toBe('November 2027');
    expect(v.latest.verdict).toMatchObject({ band: 'no', words: 'in only 7 futures out of 10', aim: '£1,810', bad: '£1,500', gap: '£3,720' });
    expect(v.latest.enough).toEqual({ id: 'share', slots: { pct: '29', amount: '£918' } });
    expect(v.latest.changed).toMatchObject({ since: 'November 2026', from: '£64,500', to: '£74,600', pension: [{ perMonth: '£317', months: 1 }, { perMonth: '£633', months: 11 }] });
    expect(v.latest.thenNow).toMatchObject({ then: 'in only 3 futures out of 10', now: 'in only 7 futures out of 10', enoughThen: { id: 'share', slots: { pct: '31', amount: '£982' } } });
    expect(v.cadence).toMatchObject({ chosen: true, every: 'year', next: 'November 2028', due: false });
    expect(v.calendar).toMatchObject({ month: '2028-11', words: 'November 2028', name: 'pensiontools-check-in-2028-11.ics' });
    // the history: newest first, exact figures, the note, the path each was read against when it changed
    expect(v.rows.map((r) => r.month)).toEqual(['November 2027', 'November 2026']);
    expect(v.rows[0]).toMatchObject({ pension: '£74,600', pay: '£38,000', payIn: { id: 'share', slots: { pct: '20', amount: '£633' } }, verdict: { band: 'no', words: 'in only 7 futures out of 10' }, enough: { id: 'share', slots: { pct: '29' } }, note: 'Raised what goes in.', pathChanged: null });
    expect(v.rows[1].pathChanged).toEqual({ month: 'November 2026', why: 'first' });
    // "Use these in my plan": the check-in pays in 20% in all, the plan says 10%
    expect(v.useInPlan).toEqual({ id: 'share', slots: { now: '20', plan: '10' } });
    expect(v.pathDiffers).toEqual({ drawn: '£317', now: '£633' });
  });
});

describe('"Use these in my plan" (5.6), "Start the path again" (5.3) and the archive (5.11)', () => {
  it('Use these in my plan: What you pay in\'s settings from the last check-in, ONE write; a share as the share and the pounds it lands', () => {
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.ownPct': '8', 'ci.savingsIn': '50' })).plan;
    const p = useInPlanPatch(one, { today: '2026-11-20' });
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.settings']);
    for (const k of Object.keys(p.patch)) expect(SAVING_WRITES).toContain(k);
    const s = p.patch['accumulationTool.settings'];
    expect(s).toMatchObject({ payInKind: 'share', ownPct: 8, employerPct: 4, salary: 38000, isaMonthly: 50, schemeType: 'ras' });
    const after = applyPatch(one, p.patch);
    expect(checkInOf([{ plan: after }], after.id, { today: '2026-11-20' }).useInPlan).toBe(null);
    expect(useInPlanPatch(after, { today: '2026-11-20' }).patch).toEqual({});
  });
  it('Use these in my plan keeps the ages What you pay in\'s own Save keeps: a saver with no Accumulation settings of their own reads the Timing block\'s', () => {
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.ownPct': '8' })).plan;
    const bare = copy(one);
    delete bare.accumulationTool.settings;
    expect(planStage(bare, { now: noon('2026-11-20') }).key).toBe('saving');
    const saved = savedSaving(bare, { today: '2026-11-20' });
    expect(saved.currentAge).toBe(41);
    expect(saved.retirementAge).toBe(63);
    const s = useInPlanPatch(bare, { today: '2026-11-20' }).patch['accumulationTool.settings'];
    expect(s).toMatchObject({ currentAge: 41, retirementAge: 63, payInKind: 'share', ownPct: 8, employerPct: 4 });
    // the same ages the step's own Save writes
    const own = savingPatch(bare, {}, { today: '2026-11-20' }).patch['accumulationTool.settings'];
    expect([s.currentAge, s.retirementAge, s.potNow, s.escalationPct]).toEqual([own.currentAge, own.retirementAge, own.potNow, own.escalationPct]);
    const after = applyPatch(bare, { 'accumulationTool.settings': s });
    expect(savedSaving(after, { today: '2026-11-20' })).toMatchObject({ currentAge: 41, retirementAge: 63 });
  });
  it('pounds: what leaves take-home pay under the plan\'s scheme lands what the check-in said', () => {
    const plan = samPlan({ ...SAM, you: { ...SAM.you, payIn: { kind: 'split', own: 400, employer: 200 } } });
    const one = checkIn(plan, '2026-11-20', { 'ci.pension': '64500', 'ci.kind': 'split', 'ci.own': '500', 'ci.employer': '250' }).plan;
    const after = applyPatch(one, useInPlanPatch(one, { today: '2026-11-20' }).patch);
    const read = saverInputsOf(after, { today: '2026-11-20' });
    expect(read.inputs.you.payIn).toEqual({ kind: 'split', own: 500, employer: 250 });
  });
  it('Start the path again: an unlocked plan\'s path drawn from its last check-in, the old one archived; the frozen readings stay as they were', () => {
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500)).plan;
    const later = checkIn(upgradeScenario(copy(one), { now: noon('2027-11-10') }).scenario, '2027-11-10', SHARE(74600)).plan;
    const before = copy(checkInsOf(later).map((c) => c.reading));
    const r = restartPathPatch(later, { today: '2027-11-10', now: at('2027-11-10') });
    expect(r.ok).toBe(true);
    expect(Object.keys(r.patch).sort()).toEqual(['accumulationTool.path', 'accumulationTool.pathArchive']);
    const after = applyPatch(later, r.patch);
    expect(after.accumulationTool.path.asOf).toBe('2027-11');
    expect(after.accumulationTool.path.path[0].nominal.middling).toBe(74600);
    expect(after.accumulationTool.pathArchive.map((p) => p.asOf)).toEqual(['2026-11']);
    expect(checkInsOf(after).map((c) => c.reading)).toEqual(before);
    // the history says where the path changed, and the next check-in is read against the new one
    const next = checkIn(upgradeScenario(copy(after), { now: noon('2028-11-10') }).scenario, '2028-11-10', SHARE(86000)).record;
    expect(next.reading.path).toMatchObject({ source: 'saving', asOf: '2027-11' });
    expect(checkInOf([{ plan: applyPatch(after, {}) }], after.id, { today: '2027-11-10' }).restartable).toBe(true);
    // only from a check-in of this month: a year on with no new check-in, the path would place last year's pot at today
    const yearOn = upgradeScenario(copy(later), { now: noon('2028-11-12') }).scenario;
    expect(checkInOf([{ plan: yearOn }], yearOn.id, { today: '2028-11-12' }).restartable).toBe(false);
    expect(restartPathPatch(yearOn, { today: '2028-11-12', now: at('2028-11-12') })).toMatchObject({ ok: false, problem: 'restartOld', patch: {} });
    expect(checkInOf([{ plan: later }], later.id, { today: '2027-12-01' }).restartable, 'the month after the check-in').toBe(false);
    // a locked plan's path is its document's: never started again here
    expect(restartPathPatch(entryOf(C['05-saver-committed'], '2026-11-05').plan, { today: '2026-11-05', now: at('2026-11-05') })).toMatchObject({ ok: false, problem: 'locked' });
  });
  it('the archive: at most 5 paths and 40 KB in all, the oldest out first', () => {
    const path = (asOf, rows) => ({ version: 3, asOf, path: Array.from({ length: rows }, (_, y) => ({ year: y, nominal: { careful: 1, middling: 2, good: 3 } })) });
    let a = [];
    for (let i = 0; i < 8; i++) a = archiveWith(a, path('2027-0' + (i + 1), 10));
    expect(a.map((p) => p.asOf)).toEqual(['2027-04', '2027-05', '2027-06', '2027-07', '2027-08']);
    expect(PATH_ARCHIVE_KEPT).toBe(5);
    let big = [];
    for (let i = 0; i < 5; i++) big = archiveWith(big, path('2030-0' + (i + 1), 300));
    expect(new TextEncoder().encode(JSON.stringify(big)).length).toBeLessThanOrEqual(PATH_ARCHIVE_BYTES);
    expect(big.length).toBeLessThan(5);
    expect(big[big.length - 1].asOf).toBe('2030-05');
  });
});

describe('the calendar file, the note and the plan\'s download (5.2, 5.10)', () => {
  it('the calendar file holds the date and the words "PensionTools check-in", no figure', () => {
    const text = calendarText({ month: '2027-11', today: '2026-11-20' });
    expect(text).toContain('SUMMARY:PensionTools check-in');
    expect(text).toContain('DTSTART;VALUE=DATE:20271101');
    expect(text.split('\r\n').filter(Boolean)).toHaveLength(12);
    // take out the dates and the format's own version: nothing numeric is left, and no pound sign at all
    const rest = text.replace(/VERSION:2\.0/, '').replace(/\b\d{8}(T\d{6}Z)?\b/g, '');
    expect(rest).not.toMatch(/\d/);
    expect(text).not.toMatch(/£|pension pot|pay in/i);
    expect(text).not.toMatch(/@(?!pensiontools\.uk)/);
    // two plans due in the same month (yours and your partner's): two events, never one taken as an update to the other;
    // the plan's id itself is not in the file, and the tag holds no digit
    const uid = (t) => /^UID:(.+)$/m.exec(t)[1];
    const yours = calendarText({ month: '2027-11', today: '2026-11-20', planId: 'SamSaving01' });
    const theirs = calendarText({ month: '2027-11', today: '2026-11-20', planId: 'AlexSaving02' });
    expect(uid(yours)).not.toBe(uid(theirs));
    expect(uid(yours)).toMatch(/^check-in-20271101-[a-p]{8}@pensiontools\.uk$/);
    expect(uid(yours)).toBe(uid(calendarText({ month: '2027-11', today: '2027-01-02', planId: 'SamSaving01' })));
    expect(yours).not.toContain('SamSaving01');
    // the help says what the file holds and claims no more: the date and the words, no figures
    expect(CHECKIN.result.calendarHelp).toMatch(/holds the date of your next check-in and the words “PensionTools check-in”: no figures, no email\./);
    expect(CHECKIN.result.calendarHelp).not.toMatch(/nothing else/);
    expect(yours.replace(/VERSION:2\.0/, '').replace(/\b\d{8}(T\d{6}Z)?\b/g, '')).not.toMatch(/\d/);
  });
  it('the note lives only inside the check-in (deleted with the plan and the account) and goes in the plan\'s download', () => {
    const plan = samPlan();
    const { plan: after } = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.note': 'Started a new role.' }));
    const where = [];
    const walk = (v, path) => { if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path + '.' + k); else if (v === 'Started a new role.') where.push(path); };
    walk(after, '');
    expect(where).toEqual(['.accumulationTool.checkIns.0.note']);
    expect(planExportJson(after)).toContain('Started a new role.');
    expect(JSON.parse(planExportJson(after)).accumulationTool.checkIns[0].note).toBe('Started a new role.');
  });
});

describe('the privacy policy names the check-in, in both its copies (5.10)', () => {
  it('the financial data row names pay, what is paid in, the check-ins and the note; the two copies carry one "Last updated" day', () => {
    const md = readFileSync(join(process.cwd(), 'compliance', 'PRIVACY_POLICY.md'), 'utf8');
    const html = readFileSync(join(process.cwd(), 'public', 'privacy.html'), 'utf8');
    for (const text of [md, html]) {
      expect(text).toContain('pay and what you pay into pensions, your saving check-ins and any note you write');
      expect(text).toContain('run your drawdown plan and your saving plan');
    }
    const day = (text) => (/Last updated:\s*([0-9]{1,2} [A-Z][a-z]+ [0-9]{4})/.exec(text) || [])[1];
    expect(day(md)).toBeTruthy();
    expect(day(html)).toBe(day(md));
  });
});

describe('the size budget (5.11)', () => {
  it('a plan with 120 check-ins with full notes, 600 pot records, a path, a full archive, a plan document and an archive of ten stays under 600 KB; the check-in\'s own parts under 250 KB', () => {
    const plan = samPlan();
    const one = checkIn(plan, '2026-11-20', SHARE(64500, { 'ci.isa': '3200' }), { result: { status: 'ok', verdict: { band: 'close' }, chance: { fails: 180 }, spend: { perMonth: 1810 }, income: { bad: 1700, middling: 2100 }, gap: { year: 1320 }, enough: { nineInTen: { payIn: 412.5, ownPct: 9.5, totalPct: 13.5 }, threeInFour: { payIn: 300, ownPct: 6, totalPct: 10 }, threeInFourNow: false }, basis: { engineVersion: '6.54.0' } } });
    const ci = one.record;
    const note = '€'.repeat(NOTE_MAX);   // three bytes each
    const big = copy(one.plan);
    big.accumulationTool.checkIns = Array.from({ length: CHECKINS_KEPT }, (_, i) => ({ ...copy(ci), date: addMonths('2026-11', i) + '-20', note, payIn: { ...ci.payIn, since: '2026-12' }, paused: { from: '2027-01', to: '2027-03' } }));
    big.accumulationTool.history = Array.from({ length: 600 }, (_, i) => potRecordOf({ date: addMonths('1990-01', i), sipp: 123456.78, isa: 23456.78, gia: 3456.78 }, at('2026-11-20')));
    const path = big.accumulationTool.path;
    big.accumulationTool.pathArchive = archiveWith(archiveWith(archiveWith(archiveWith(archiveWith([], path), path), path), path), path);
    const doc = copy(entryOf(C['05-saver-committed']).plan.planDocument);
    big.planDocument = doc;
    big.planDocumentArchive = Array.from({ length: 10 }, () => copy(doc));
    const total = firestoreSize(big) + new TextEncoder().encode('projects/x/databases/(default)/documents/users/u/scenarios/' + big.id).length + 16;
    const own = firestoreSize({ checkIns: big.accumulationTool.checkIns, path: big.accumulationTool.path, pathArchive: big.accumulationTool.pathArchive, checkInEvery: 'year' });
    expect(total).toBeLessThan(600 * 1024);
    expect(own).toBeLessThan(250 * 1024);
    // one check-in: about half a KB without a note, about 1.3 KB with a full note in characters of three bytes
    const bare = { ...copy(ci) }; delete bare.note;
    expect(firestoreSize(bare)).toBeLessThan(700);
    expect(firestoreSize({ ...bare, note })).toBeLessThan(1500);
  });
  it('the 121st check-in drops the oldest and keeps its pot record; from the 110th the screen says so', () => {
    const plan = samPlan();
    const base = checkIn(plan, '2016-11-20', SHARE(10000)).plan;
    const list = Array.from({ length: CHECKINS_KEPT }, (_, i) => stub(addMonths('2016-11', i) + '-20', 10000 + i));
    const full = copy(base);
    full.accumulationTool.checkIns = list;
    full.accumulationTool.history = list.map((c) => potRecordOf({ date: c.date.slice(0, 7), sipp: c.pot.pension, isa: '', gia: 0 }, at('2016-11-20')));
    full.accumulationTool.checkInEvery = 'month';
    const today = addMonths('2016-11', CHECKINS_KEPT) + '-20';
    const v = checkInOf([{ plan: full }], full.id, { today });
    expect(v.dropWarning).toBe(true);
    expect(CHECKINS_WARN_FROM).toBe(110);
    const after = checkIn(full, today, SHARE(99000)).plan;
    const kept = checkInsOf(after);
    expect(kept).toHaveLength(CHECKINS_KEPT);
    expect(kept[0].date).toBe(list[1].date);
    expect(kept[kept.length - 1].date).toBe(today);
    expect(after.accumulationTool.history.some((r) => r.date === list[0].date.slice(0, 7))).toBe(true);
    expect(after.accumulationTool.history).toHaveLength(CHECKINS_KEPT + 1);
    const fewer = copy(full); fewer.accumulationTool.checkIns = list.slice(0, 109);
    expect(checkInOf([{ plan: fewer }], fewer.id, { today }).dropWarning).toBe(false);
  });
});

describe('the words of the check-in pass the banned list (5.4–5.7, section 8 "Words")', () => {
  const strings = [];
  const walk = (v) => { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') for (const x of Object.values(v)) walk(x); };
  walk(CHECKIN);
  for (const id of ['P.checkinDue', 'P.behind', 'P.onCourse', 'P.nextCheckIn', 'P.saving']) strings.push(PLAN.next[id]);
  strings.push(PLAN.steps.checkin.label, PLAN.buttons.checkIn, PLAN.list.checkInDue);
  it('no word banned anywhere (all), and none of the saver\'s, the planner\'s or the record\'s', () => {
    const hits = [];
    for (const s of strings) {
      const text = s.replace(/\{\w+\}/g, '1');
      for (const b of BANNED) {
        if (b.kind === 'explain') continue;
        if (!['all', 'saver', 'planner', 'record', 'result'].includes(b.scope)) continue;
        if (b.re.test(text) && !(b.allow || []).some((a) => a.test(text))) hits.push(`${b.id}: ${s}`);
      }
    }
    expect(hits).toEqual([]);
  });
  it('a share of pay that is yours and your employer\'s together says "in all" wherever it is written', () => {
    const shares = [CHECKIN.result.enough.share, CHECKIN.result.four.share, CHECKIN.result.enoughShort.share, CHECKIN.history.payIn.share, CHECKIN.history.enough.share];
    for (const s of shares) expect(s).toMatch(/\{pct\}% of your pay in all/);
  });
  it('a bad case and a good case are explained wherever the lines are named', () => {
    expect(CHECKIN.result.path.lines).toMatch(/the worst 1 in 10/);
    expect(CHECKIN.result.path.lines).toMatch(/the best 1 in 10/);
  });
});

describe('the reading against a path as SaverReading reads it, frozen', () => {
  it('readingOf: the band and middle figure of saverReading; no path, no reading against one', () => {
    const e = entryOf(C['05-saver-committed'], '2026-11-05');
    const rec = { date: '2026-11-05', pot: { pension: 300000, isa: 40000 } };
    const doc = pathDocOf(e.plan);
    const r = readingOf(rec, doc, null);
    const sr = saverReading(e.plan.planDocument, { at: '2026-11', pension: 300000, isa: 40000 });
    expect(r.pathBand).toBe(sr.band);
    expect(sr.version).toBe(2);
    expect(r.expected).toBe(Math.round(sr.expected * sr.prices.factor));
    expect(r.band).toBe(null);
    expect(readingOf(rec, null, null)).toMatchObject({ path: null, pathBand: null, expected: null });
    expect(checkInState(e.plan, { today: '2026-11-05', stageKey: 'committed-saving' }).legacy).toBe(true);
  });
  it('a version-2 path (locked before 6.22.0) a year after its lock: the words set the pot beside lines in its own pounds, so they agree with the band', () => {
    // corpus 05's path starts July 2026 in the prices of then; a year on the pot is put back 2.5% to be placed (`compared`),
    // so the lines it is said beside are raised by the same 2.5%: £340,575 is below the middle the plan expected by now
    const today = '2027-07-10';
    const e = entryOf(C['05-saver-committed'], today);
    const { plan: after, record } = checkIn(e.plan, today, { 'ci.pension': '340575', 'ci.isa': '42000' });
    const sr = saverReading(e.plan.planDocument, { at: '2027-07', pension: 340575, isa: 42000 });
    expect(sr).toMatchObject({ version: 2, band: 'below the locked path' });
    expect(sr.prices.factor).toBeCloseTo(1.025, 10);
    const n = (t) => +String(t).replace(/[£,]/g, '');
    const v = checkInOf([{ plan: after }], after.id, { today });
    expect(v.latest.path).toMatchObject({ band: 'lower', actual: '£340,575', pension: true, prices: { from: 'July 2026', month: 'July 2027' } });
    expect(n(v.latest.path.low)).toBe(Math.round(sr.low * sr.prices.factor));
    expect(n(v.latest.path.expected)).toBe(Math.round(sr.expected * sr.prices.factor));
    expect(n(v.latest.path.high)).toBe(Math.round(sr.high * sr.prices.factor));
    // "between the bad-case line and the middle": the figures say the same as the band
    expect(n(v.latest.path.low)).toBeLessThan(340575);
    expect(n(v.latest.path.expected)).toBeGreaterThan(340575);
    expect(record.reading.expected).toBe(n(v.latest.path.expected));
    expect(v.rows[0].path).toEqual({ band: 'lower', expected: v.latest.path.expected });
    // a version-3 path is in pounds of the day already: no note, the figures as SaverReading gives them
    const sam = checkIn(samPlan(), '2026-11-20', SHARE(64500)).plan;
    const later = checkIn(upgradeScenario(copy(sam), { now: noon('2027-11-10') }).scenario, '2027-11-10', SHARE(74600)).plan;
    const v3 = checkInOf([{ plan: later }], later.id, { today: '2027-11-10' });
    const sr3 = saverReading({ accumulation: later.accumulationTool.path }, { at: '2027-11', pension: 74600, isa: null });
    expect(v3.latest.path.prices).toBe(null);
    expect(n(v3.latest.path.low)).toBe(sr3.low);
    expect(n(v3.latest.path.expected)).toBe(sr3.expected);
  });
});

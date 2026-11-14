/**
 * The one review (7.10.0; research/v7/replan-nov-2026.md §6.3, §6.4; services/Phases.js): when it is next — read from the
 * review log, the check-ins, the records and the rule, never stored — and off course by the person's own rule, only on two
 * readings in a row that worked out the chance. Pure: no clock of its own; nothing is written. Fictional plans only.
 *
 *   - reviewDueOf per phase at three dates; no release-day reminder (REVIEW_FROM); a plan locked while saving that never chose,
 *     once a year from its pot records; Living on it from 6 April, locked six months before; every three months / every month;
 *     none on a plan that closes, on an unlocked Living-on-it plan, or on a plan Moving by its agreement before its stop;
 *   - belowLine for a review's reading and a check-in's (7.8.0 and before); the guardrails rule;
 *   - offCourseOf: two counting readings below the line, never one, never across phases or document versions; a Bold plan at
 *     15 in 20 twice is not off course; document readings and readings saved as null never count and never break a pair;
 *   - DrawCadence.monthsWanted, the home's rule for asking for months.
 */
import { describe, it, expect } from 'vitest';
import { reviewDueOf, offCourseOf, belowLine, reviewRuleOf, reviewEveryOf, defaultFloorOf, REVIEW_FROM, OFF_COURSE, LIVING_REVIEW_AFTER } from '../../../src/services/Phases.js';
import { monthsWanted } from '../../../src/services/DrawCadence.js';
import { checkInDueOf, checkInsOf } from '../../../src/answers/plan/checkInDue.js';
import { WEIGHT_ONE } from '../../../src/answers/shared/rules.js';
import { monthOf } from '../../../src/answers/plan/month.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList } from '../../../src/v7/effects/planSource.js';
import { isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { corpus, entryOf, noon } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const at = (day) => noon(day);
const CREATED = '2026-05-01T09:00:00.000Z';
/** Alex's plan, locked on the day given, living on it, with the review log and choices given. */
const alex = ({ lockedAt = '2026-07-01T09:00:00.000Z', locked = true, log = [], every, rule, closedAt } = {}) => ({
  id: 'AlexReview01', createdAt: CREATED,
  decisionTool: { settings: { locked, ...(locked ? { lockedAt } : {}) }, history: [] },
  phases: { of: CREATED, review: { ...(every ? { every } : {}), ...(rule ? { rule } : {}), log } },
  ...(closedAt ? { closedAt } : {})
});
const run = (day, { phase = 'drawing', weighted = 0.9, sumW = null, n = 1000, documentAt = '2026-07-01' } = {}) => ({
  at: day + 'T10:00:00.000Z', phase, documentAt, pots: null, entered: { pots: false, took: false }, took: null, choice: null,
  reading: { source: 'run', key: 'k', weighted, sumW: sumW == null ? Math.round((1 - weighted) * n * WEIGHT_ONE) : sumW, n, fixedAge: { lasts: Math.round(weighted * n), n, age: 95 }, typicalLeft: null },
  guardrail: null, drift: null, maxDrift: null
});

describe('when the review is next: never stored, and never on release day', () => {
  it('REVIEW_FROM is 6 April 2027 and Living on it waits six months from the lock', () => {
    expect(REVIEW_FROM).toBe('2027-04-06');
    expect(LIVING_REVIEW_AFTER).toBe(6);
  });
  it('Living on it, once a tax year: from 6 April with no review in it, once the plan was locked six months before; three dates', () => {
    const plan = alex();
    const due = (day) => reviewDueOf(plan, { now: at(day), phase: 'drawing', locked: true });
    expect(due('2026-10-02')).toEqual({ next: '2027-04-06', due: false, occurrence: '2027/28', every: 'year' });
    expect(due('2027-04-05')).toEqual({ next: '2027-04-06', due: false, occurrence: '2027/28', every: 'year' });
    expect(due('2027-04-06')).toEqual({ next: '2027-04-06', due: true, occurrence: '2027/28', every: 'year' });
    // locked in December 2026: less than six months before 6 April 2027, so its first is April 2028
    expect(reviewDueOf(alex({ lockedAt: '2026-12-01T09:00:00.000Z' }), { now: at('2027-04-06'), phase: 'drawing', locked: true })).toMatchObject({ next: '2028-04-06', due: false, occurrence: '2028/29' });
    // locked long ago, no review yet: never before 6 April 2027 (no release-day reminder)
    expect(reviewDueOf(alex({ lockedAt: '2024-11-12T09:00:00.000Z' }), { now: at('2026-10-02'), phase: 'drawing', locked: true })).toMatchObject({ next: '2027-04-06', due: false });
    // reviewed in 2027/28: next April 2028; a review in 2026/27 (before the floor) counts too
    const done = alex({ log: [run('2027-04-07')] });
    expect(reviewDueOf(done, { now: at('2027-10-01'), phase: 'drawing', locked: true })).toMatchObject({ next: '2028-04-06', due: false, occurrence: '2028/29' });
    expect(reviewDueOf(done, { now: at('2028-04-06'), phase: 'drawing', locked: true })).toMatchObject({ due: true, occurrence: '2028/29' });
    const early = alex({ lockedAt: '2025-01-01T09:00:00.000Z', log: [run('2026-06-01')] });
    expect(reviewDueOf(early, { now: at('2026-10-02'), phase: 'drawing', locked: true })).toMatchObject({ next: '2027-04-06', due: false });
  });
  it('every three months or every month: from the last review, else from the lock — never before REVIEW_FROM', () => {
    expect(reviewEveryOf(alex({ every: 'quarter' }))).toBe('quarter');
    expect(reviewDueOf(alex({ every: 'quarter', log: [run('2027-05-10')] }), { now: at('2027-08-01'), phase: 'drawing', locked: true })).toEqual({ next: '2027-08-01', due: true, occurrence: '2027-08', every: 'quarter' });
    expect(reviewDueOf(alex({ every: 'month', log: [run('2027-05-10')] }), { now: at('2027-05-31'), phase: 'drawing', locked: true })).toMatchObject({ next: '2027-06-01', due: false });
    expect(reviewDueOf(alex({ every: 'quarter' }), { now: at('2026-10-02'), phase: 'drawing', locked: true })).toMatchObject({ next: REVIEW_FROM, due: false });
  });
  it('none on a plan not locked, a plan that closes, or one Moving by its agreement before its stop; Moving from its last review or its lock', () => {
    expect(reviewDueOf(alex({ locked: false }), { now: at('2027-04-06'), phase: 'drawing', locked: false })).toMatchObject({ next: null, due: false });
    expect(reviewDueOf(alex(), { now: at('2027-04-06'), phase: 'drawing', locked: true, closing: true })).toMatchObject({ next: null, due: false });
    expect(reviewDueOf(alex(), { now: at('2027-04-06'), phase: 'moving', locked: true, agreed: true })).toMatchObject({ next: null, due: false });
    expect(reviewDueOf(alex(), { now: at('2027-04-06'), phase: 'moving', locked: true })).toMatchObject({ next: '2027-07-01', due: false, occurrence: '2027-07' });
    expect(reviewDueOf(alex({ log: [run('2027-01-10', { phase: 'moving' })] }), { now: at('2028-01-02'), phase: 'moving', locked: true })).toMatchObject({ next: '2028-01-01', due: true });
    expect(reviewDueOf(alex({ locked: false }), { now: at('2027-04-06'), phase: 'moving', locked: false })).toMatchObject({ next: null });
    // a plan with no phase (no age) and a closed one: none
    for (const phase of [null, 'closed']) expect(reviewDueOf(alex(), { now: at('2027-04-06'), phase, locked: true }).next).toBe(null);
  });
  it('Saving is the check-in\'s own: as chosen; a plan locked while saving that never chose, once a year from its pot records', () => {
    const raw = C['05-saver-committed'];
    for (const day of ['2026-10-02', '2027-04-05', '2027-04-06']) {
      const e = entryOf(raw, day);
      const checkIn = checkInDueOf(e.plan, { today: day, stageKey: 'committed-saving' });
      expect(reviewDueOf(e.plan, { now: at(day), phase: 'saving', locked: true, checkIn }), day).toEqual({ next: '2027-09-01', due: false, occurrence: '2027-09', every: 'year' });
    }
    // a saver who never chose and is not locked: whenever they like
    const free = copy(raw); free.decisionTool.settings.locked = false;
    const e = entryOf(free, '2026-10-02');
    expect(reviewDueOf(e.plan, { now: at('2026-10-02'), phase: 'saving', checkIn: checkInDueOf(e.plan, { today: '2026-10-02', stageKey: 'saving' }) })).toMatchObject({ next: null, due: false });
    // nothing is written by any of it
    const before = JSON.stringify(raw);
    reviewDueOf(raw, { now: at('2027-04-06'), phase: 'saving', checkIn: checkInDueOf(raw, { today: '2027-04-06', stageKey: 'committed-saving' }) });
    expect(JSON.stringify(raw)).toBe(before);
  });
});

describe('below the line, one reading at a time', () => {
  it('the default line follows the plan\'s level: one twentieth below it', () => {
    expect([defaultFloorOf('careful'), defaultFloorOf('balanced'), defaultFloorOf('bold')]).toEqual([0.90, 0.85, 0.65]);
    expect(reviewRuleOf({})).toEqual({ kind: 'success', floor: 0.85 });
    expect(OFF_COURSE.readings).toBe(2);
  });
  it('a review\'s reading: its weighted failures within the line (rules.js passes), else its fixed-age count', () => {
    const rule = { kind: 'success', floor: 0.80 };
    expect(belowLine(run('2027-04-07', { weighted: 0.85 }).reading, rule)).toBe(false);
    expect(belowLine(run('2027-04-07', { weighted: 0.75 }).reading, rule)).toBe(true);
    expect(belowLine(run('2027-04-07', { weighted: 0.80 }).reading, rule)).toBe(false);   // on the line is not below it
    expect(belowLine({ fixedAge: { lasts: 700, n: 1000 } }, rule)).toBe(true);
    expect(belowLine({ fixedAge: { lasts: 900, n: 1000 } }, rule)).toBe(false);
    expect(belowLine({}, rule)).toBe(null);
    expect(belowLine(null, rule)).toBe(null);
  });
  it('a check-in\'s reading: since 7.8.0 its weighted chance, in twentieths; before, its band — only "no" is below', () => {
    const rule = { kind: 'success', floor: 0.85 };
    expect(belowLine({ band: 'close', weighted: 0.82 }, rule, { kind: 'checkin' })).toBe(true);
    expect(belowLine({ band: 'yes', weighted: 0.85 }, rule, { kind: 'checkin' })).toBe(false);
    expect(belowLine({ band: 'no', fails: 700 }, rule, { kind: 'checkin' })).toBe(true);
    expect(belowLine({ band: 'close', fails: 120 }, rule, { kind: 'checkin' })).toBe(false);
    expect(belowLine({ band: null }, rule, { kind: 'checkin' })).toBe(null);
  });
  it('the guardrails rule: "above" only; "below" is information; never a check-in', () => {
    const rule = { kind: 'guardrails' };
    expect(belowLine(null, rule, { guardrail: 'above' })).toBe(true);
    expect(belowLine(null, rule, { guardrail: 'below' })).toBe(false);
    expect(belowLine(null, rule, { guardrail: 'within' })).toBe(false);
    expect(belowLine(null, rule, { guardrail: null })).toBe(null);
    expect(belowLine({ band: 'no' }, rule, { kind: 'checkin' })).toBe(null);
  });
});

describe('off course: two readings in a row that worked out the chance, never one bad year', () => {
  const rule = { kind: 'success', floor: 0.80 };
  it('two below: off, at the second reading\'s date, with both figures and the line; one below, or a newer one above: not', () => {
    const two = alex({ rule, log: [run('2027-04-07', { weighted: 0.70 }), run('2028-04-07', { weighted: 0.65 })] });
    expect(offCourseOf(two, { phase: 'drawing' })).toEqual({ off: true, occurrence: '2028-04-07', rule: { kind: 'success', floor: 0.80 }, a: 14, b: 13, line: 16 });
    expect(offCourseOf(alex({ rule, log: [run('2027-04-07', { weighted: 0.70 })] }), { phase: 'drawing' }).off).toBe(false);
    expect(offCourseOf(alex({ rule, log: [run('2027-04-07', { weighted: 0.70 }), run('2028-04-07', { weighted: 0.70 }), run('2029-04-07', { weighted: 0.90 })] }), { phase: 'drawing' }).off).toBe(false);
    expect(offCourseOf(two, { phase: 'drawing', closing: true }).off).toBe(false);
  });
  it('never across phases or plan document versions; a review saved with no reading, or a document\'s, never counts or breaks a pair', () => {
    const across = alex({ rule, log: [run('2027-01-07', { weighted: 0.70, phase: 'moving' }), run('2028-04-07', { weighted: 0.70 })] });
    expect(offCourseOf(across, { phase: 'drawing' }).off).toBe(false);
    const versions = alex({ rule, log: [run('2027-04-07', { weighted: 0.70, documentAt: '2026-07-01' }), run('2028-04-07', { weighted: 0.70, documentAt: '2027-11-01' })] });
    expect(offCourseOf(versions, { phase: 'drawing' }).off).toBe(false);
    const nulls = alex({ rule, log: [run('2027-04-07', { weighted: 0.70 }), { ...run('2027-10-07'), reading: null }, { ...run('2028-01-07'), reading: { ...run('2028-01-07').reading, source: 'document' } }, run('2028-04-07', { weighted: 0.70 })] });
    expect(offCourseOf(nulls, { phase: 'drawing' })).toMatchObject({ off: true, occurrence: '2028-04-07' });
  });
  it('a Bold plan at 15 in 20 twice is not off course (its line is 13 in 20)', () => {
    const bold = { ...alex({ log: [run('2027-04-07', { weighted: 0.75 }), run('2028-04-07', { weighted: 0.75 })] }), fromAnswer: { answer: { level: 'bold', levelChosen: true } } };
    expect(reviewRuleOf(bold)).toEqual({ kind: 'success', floor: 0.65 });
    expect(offCourseOf(bold, { phase: 'drawing' }).off).toBe(false);
  });
  it('Saving reads the check-ins: a 7.8.0 reading and one kept before it each count', () => {
    const plan = { createdAt: CREATED, accumulationTool: { checkIns: [
      { date: '2026-11-05', pot: { pension: 60000 }, reading: { band: 'no', fails: 700 } },
      { date: '2027-11-05', pot: { pension: 70000 }, reading: { band: 'close', level: 'balanced', weighted: 0.80, fixedAge: 0.8 } }
    ] } };
    expect(offCourseOf(plan, { phase: 'saving', checkIns: checkInsOf(plan) })).toMatchObject({ off: true, occurrence: '2027-11-05', a: null, b: 16, line: 17 });
    // the guardrails rule never reads a check-in
    const g = { ...plan, phases: { of: CREATED, review: { rule: { kind: 'guardrails' } } } };
    expect(offCourseOf(g, { phase: 'saving', checkIns: checkInsOf(g) }).off).toBe(false);
  });
  it('the guardrails rule reads each review\'s guardrail: two "above" in a row', () => {
    const g = alex({ rule: { kind: 'guardrails' }, log: [{ ...run('2027-04-07'), guardrail: 'above' }, { ...run('2028-04-07'), guardrail: 'above' }] });
    expect(offCourseOf(g, { phase: 'drawing' })).toMatchObject({ off: true, rule: { kind: 'guardrails' }, line: null });
    const below = alex({ rule: { kind: 'guardrails' }, log: [{ ...run('2027-04-07'), guardrail: 'above' }, { ...run('2028-04-07'), guardrail: 'below' }] });
    expect(offCourseOf(below, { phase: 'drawing' }).off).toBe(false);
  });
  it('a closed plan\'s close, or a copy\'s cloned log: never off course', () => {
    const cloned = { ...alex({ rule, log: [run('2027-04-07', { weighted: 0.70 }), run('2028-04-07', { weighted: 0.65 })] }), createdAt: '2028-05-01T09:00:00.000Z' };
    expect(offCourseOf(cloned, { phase: 'drawing' }).off).toBe(false);
  });
});

describe('months wanted (DrawCadence.monthsWanted): monthly logging is the person\'s choice', () => {
  it('said no; said yes; a cadence chosen (the preference or the old settings key); any month recorded; else no', () => {
    expect(monthsWanted({ recordMonths: false, cadence: 'monthly', history: [{ date: '2026-09' }] })).toBe(false);
    expect(monthsWanted({ recordMonths: true })).toBe(true);
    expect(monthsWanted({ cadence: 'annual' })).toBe(true);
    expect(monthsWanted({ settings: { cadence: 'quarterly' } })).toBe(true);
    expect(monthsWanted({ history: [{ date: '2026-09' }] })).toBe(true);
    expect(monthsWanted({ history: [] })).toBe(false);
    expect(monthsWanted({ cadence: 'fortnightly' })).toBe(false);
    expect(monthsWanted(null)).toBe(false);
    expect(monthsWanted(undefined)).toBe(false);
  });
});

describe('"Keep a record of each month here" (Month by month): one write of decisionTool.recordMonths, on a locked plan too', () => {
  const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
  it('the page says the answer and whether the home asks; "No" is one write of the one field and the stamp, and the month to-dos go', async () => {
    const today = '2026-10-02';
    const raw = copy(C['04-buckets-running']);
    expect(isLockedSettings(raw.decisionTool.settings)).toBe(true);
    const view = monthOf([entryOf(raw, today)], raw.id, { today });
    expect(view).toMatchObject({ recordMonths: null, monthsWanted: true, recordChoice: true });
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
    const store = createStore(initialState({ today, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(today)), source: 'account', readAt: '14:03' });
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(today + 'T14:03:00.000Z'), fb, client: null, handles });
    store.dispatch({ type: A.PLAN_RECORD_MONTHS, planId: String(raw.id), value: false });
    await tick();
    stop();
    expect(writes).toHaveLength(1);
    expect(writes[0].data).toEqual({ 'decisionTool.recordMonths': false, lastModified: today + 'T14:03:00.000Z' });
    expect(store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'recordMonths', line: { id: 'recordNo' } });
    const after = { ...raw, decisionTool: { ...raw.decisionTool, recordMonths: false } };
    expect(isLockedSettings(after.decisionTool.settings)).toBe(true);
    expect(after.decisionTool.settings).toEqual(raw.decisionTool.settings);
    expect(monthOf([entryOf(after, today)], raw.id, { today })).toMatchObject({ recordMonths: 'no', monthsWanted: false });
    const h = homeOf([entryOf(after, today)], raw.id, { today });
    expect([...h.todo.items, ...h.todo.more].map((x) => x.id).filter((x) => x.startsWith('month.'))).toEqual([]);
    expect(h.quiet).toMatchObject({ id: 'review', slots: { month: 'April 2027' } });
    // the reducer takes yes or no only
    expect(() => reduce(initialState({ today, build: 'test' }), { type: A.PLAN_RECORD_MONTHS, planId: 'x', value: 'no' })).toThrow(/plan\/recordMonths/);
  });
});

describe('the privacy policy names the reviews, the phases\' choices and the to-dos put off, in both its copies (spec-7100 §10)', () => {
  it('the financial data row names the reviews and the risk accepted for what is held; the saved plans row the to-dos and the monthly record', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const md = readFileSync(join(process.cwd(), 'compliance', 'PRIVACY_POLICY.md'), 'utf8');
    const html = readFileSync(join(process.cwd(), 'public', 'privacy.html'), 'utf8');
    for (const text of [md, html]) {
      expect(text).toContain('your reviews: the date, the figures you entered and what they showed, and the risk you accepted for what you hold');
      expect(text).toContain('how often, when we say you are off course, how long your move window is and how your pension is invested while you save');
      expect(text).toContain('the to-dos you have put off or marked done, and whether you keep a record of each month');
    }
  });
});

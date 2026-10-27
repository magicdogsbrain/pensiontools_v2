/**
 * "What you pay in" on a saved plan (research/v7/road-to-7.md step 11b: save.relief, save.escalation, save.own-mix, save.pot-record).
 *   1. The reading on every corpus plan at three dates: found, every box has words, the relief lines are ids with words, what
 *      the pot could be equals AccumulationEngine.projectAccumulation on the planner's own inputs (the saver 05: with "Your
 *      mix" from Holdings.proportions, the plan's charge in place of the funds' own), the ISA line equals PlanTiming.projectedIsaRows.
 *   2. The write: the whole accumulationTool.settings as the planner's Save writes it (readAccumulationInputs's nine keys, every
 *      number `+value || 0`); unchanged boxes write nothing; a rise typed (escalationPct) moves the rows.
 *   3. "Record this month's pot": the list with this month's record added, line for line as recordAccumulationMonth
 *      (SaverReading.potRecordOf, the same month replaced, sorted, the last 600 kept); nothing deleted; a blank ISA box is no figure.
 *   4. Pinned once into saving.pins.json (numbers to a millionth); delete the file to pin again.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import fc from 'fast-check';
import { savingOf, savingPatch, recordPatch, checkSaving, savedSaving, SETTINGS_KEYS, RECORDS_KEPT } from '../../../src/answers/plan/saving.js';
import { contributionBreakdown, projectAccumulation } from '../../../src/services/AccumulationEngine.js';
import { proportions } from '../../../src/services/Holdings.js';
import { chargesPctOf } from '../../../src/services/Charges.js';
import { potRecordOf } from '../../../src/services/SaverReading.js';
import { SAVING_FIELDS, SAVING_WRITES, isSavingPath } from '../../../src/answers/plan/schema.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { SAVING } from '../../../src/v7/copy/saving.js';
import { corpus, entryOf, entriesAt, TODAY, DATES, noon } from './_plans.js';

const C = corpus();
const PINS = join(process.cwd(), 'tests', 'v7', 'plan', 'saving.pins.json');
const sha = (v) => createHash('sha1').update(JSON.stringify(v, (k, x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x))).digest('hex').slice(0, 16);
const pinned = existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const made = {};
const SAVER = C['05-saver-committed'];

describe('"What you pay in" — the reading', () => {
  for (const today of DATES) {
    it(`at ${today}: every corpus plan is found, every box has words, the lines have words, no rubbish`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const v = savingOf(entries, e.plan.id, { today });
        expect(v.found, e.plan.id).toBe(true);
        for (const f of v.fields) { expect(SAVING.fields[f.path], f.path).toBeTruthy(); expect(SAVING.errors[f.path], f.path).toBeTruthy(); }
        for (const l of v.relief) expect(SAVING.relief[l.id], l.id).toBeTypeOf('string');
        for (const w of v.warnings) expect(SAVING.pot.warnings[w], w).toBeTypeOf('string');
        expect(JSON.stringify(v)).not.toMatch(/NaN|undefined/);
        expect(v.rows.every((r) => /^£[\d,]+$/.test(r.mid))).toBe(true);
      }
      expect(savingOf(entries, 'NoSuchPlan', { today }).found).toBe(false);
    });
  }

  it('the saver (05): the boxes hold the planner\'s settings; the relief sum is contributionBreakdown\'s; the rows equal projectAccumulation with "Your mix" from what is held and the plan\'s charge; the records are the fixture\'s, newest first', () => {
    const entries = entriesAt(TODAY);
    const plan = entries.find((e) => e.plan.id === SAVER.id).plan;
    const v = savingOf(entries, SAVER.id, { today: TODAY });
    const s = SAVER.accumulationTool.settings;
    const f = (p) => v.fields.find((x) => x.path === p);
    expect(f('netMonthly').saved).toBe(String(s.netMonthly));
    expect(f('employerMonthly').saved).toBe(String(s.employerMonthly));
    expect(f('escalationPct').saved).toBe(String(s.escalationPct));
    expect(f('schemeType').shown).toBe(s.schemeType);
    expect(f('salary').saved).toBe(String(s.salary));
    expect(v.ages).toMatchObject({ currentAge: s.currentAge, retirementAge: s.retirementAge, years: s.retirementAge - s.currentAge, stillSaving: true, known: true });
    const b = contributionBreakdown({ netMonthly: s.netMonthly, salary: s.salary, schemeType: s.schemeType, employerMonthly: s.employerMonthly });
    expect(v.relief.find((l) => l.id === 'relief.total').slots.total).toBe('£' + Math.round(b.totalMonthly).toLocaleString('en-GB'));
    expect(v.relief.some((l) => l.id === 'relief.claim')).toBe(b.hrClaimMonthly > 0.5);
    const hp = proportions(plan.holdings);
    expect(hp.total).toBeGreaterThan(0);
    expect(v.mix).not.toBe(null);
    const rows = projectAccumulation({ currentAge: s.currentAge, retirementAge: s.retirementAge, potNow: s.potNow, totalMonthly: b.totalMonthly, escalationPct: s.escalationPct, mixRealReturn: hp.expectedReal, chargesPct: chargesPctOf(savedSaving(plan, { today: TODAY }).ss), mixOcf: hp.weightedOcf });
    const last = rows[rows.length - 1];
    const shownLast = v.rows[v.rows.length - 1];
    expect(shownLast.age).toBe(last.age);
    expect(shownLast.raw).toEqual({ low: Math.round(last.potLow), mid: Math.round(last.potMid), high: Math.round(last.potHigh), mix: Math.round(last.potMix) });
    expect(v.records.map((r) => r.date)).toEqual(SAVER.accumulationTool.history.map((r) => r.date).slice().reverse());
    expect(v.records[0].isa).toBe('£41,450');
    made['05-reading'] = sha({ rows: v.rows.map((r) => r.raw), relief: v.relief, warnings: v.warnings, isa: v.isaLine });
  });

  it('a retired plan (12): no saving years to work out, the boxes still there; a plan with no ages (01): says so', () => {
    const entries = entriesAt(TODAY);
    const retired = savingOf(entries, C['12-lumpy-db-gia'].id, { today: TODAY });
    expect(retired.ages.stillSaving).toBe(false);
    expect(retired.rows).toEqual([]);
    expect(retired.fields.length).toBe(SAVING_FIELDS.length);
    const fresh = savingOf(entries, C['01-fresh-default'].id, { today: TODAY });
    expect(fresh.ages.known).toBe(false);
  });
});

describe('"What you pay in" — the writes', () => {
  const entries = entriesAt(TODAY);
  const plan = entries.find((e) => e.plan.id === SAVER.id).plan;

  it('nothing typed writes nothing; a rise typed writes the whole settings object as the planner\'s Save would, the other eight keys as stored; Undo the stored object', () => {
    expect(savingPatch(plan, {}, { today: TODAY }).patch).toEqual({});
    const p = savingPatch(plan, { escalationPct: '2.5' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.settings']);
    for (const k of Object.keys(p.patch)) expect(SAVING_WRITES).toContain(k);
    const next = p.patch['accumulationTool.settings'];
    expect(Object.keys(next).sort()).toEqual([...SETTINGS_KEYS].sort());
    expect(next).toEqual({ ...SAVER.accumulationTool.settings, escalationPct: 2.5, isaMonthly: 0 });
    expect(p.previous['accumulationTool.settings']).toEqual(SAVER.accumulationTool.settings);
    // the rows move with the rise
    const after = applyPatch(plan, p.patch);
    const before = savingOf([{ plan }], SAVER.id, { today: TODAY }).rows;
    const then = savingOf([{ plan: after }], SAVER.id, { today: TODAY }).rows;
    expect(then[then.length - 1].raw.mid).toBeGreaterThan(before[before.length - 1].raw.mid);
    // blank boxes are the planner's `+value || 0`; the scheme its own word
    const blanked = savingPatch(plan, { netMonthly: '', employerMonthly: '', schemeType: 'salsac' }, { today: TODAY }).patch['accumulationTool.settings'];
    expect(blanked.netMonthly).toBe(0); expect(blanked.employerMonthly).toBe(0); expect(blanked.schemeType).toBe('salsac');
    made['05-rise'] = sha(next);
    if (pinned) expect(sha(next)).toBe(pinned['05-rise']);
  });

  it('a wrong figure writes nothing and is said by path; the record\'s boxes never reach the settings write', () => {
    const p = savingPatch(plan, { salary: 'lots' }, { today: TODAY });
    expect(p.ok).toBe(false);
    expect(p.errors).toEqual({ salary: 'notANumber' });
    const q = savingPatch(plan, { 'record.pension': 'lots' }, { today: TODAY });
    expect(q.ok).toBe(true);
    expect(q.patch).toEqual({});
    for (const f of SAVING_FIELDS) expect(isSavingPath(f.path), f.path).toBe(true);
    expect(isSavingPath('record')).toBe(false);
  });

  it('"Record this month\'s pot": potRecordOf\'s record added, the same month replaced, sorted, nothing deleted; a blank ISA is no figure; pinned', () => {
    const typed = { 'record.month': '2026-10', 'record.pension': '325,000', 'record.isa': '', 'record.gia': '0' };
    const p = recordPatch(plan, typed, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.history']);
    const list = p.patch['accumulationTool.history'];
    expect(list.length).toBe(SAVER.accumulationTool.history.length + 1);
    expect(list.slice(0, -1)).toEqual(SAVER.accumulationTool.history);
    const want = potRecordOf({ date: '2026-10', sipp: 325000, isa: '', gia: 0 }, noon(TODAY));
    expect(list[list.length - 1]).toEqual(want);
    // the stamp is the moment of the record when the one write file hands it in (the planner's new Date()); noon of today only when none is
    expect(recordPatch(plan, typed, { today: TODAY, now: new Date('2026-10-02T14:03:00.000Z') }).patch['accumulationTool.history'].slice(-1)[0].recordedAt).toBe('2026-10-02T14:03:00.000Z');
    expect(recordPatch(plan, typed, { today: TODAY, now: 'not a date' }).patch['accumulationTool.history'].slice(-1)[0].recordedAt).toBe(want.recordedAt);
    expect(list[list.length - 1].isa).toBe(null);
    expect('isaEntered' in list[list.length - 1]).toBe(false);
    expect(p.line).toEqual({ id: 'recorded', slots: { month: 'October 2026', total: '£325,000' } });
    expect(p.previous['accumulationTool.history']).toEqual(SAVER.accumulationTool.history);
    // the same month again replaces, never doubles; a typed £0 ISA is a figure
    const again = recordPatch(applyPatch(plan, p.patch), { 'record.month': '2026-10', 'record.pension': '326,000', 'record.isa': '0' }, { today: TODAY }).patch['accumulationTool.history'];
    expect(again.length).toBe(list.length);
    expect(again[again.length - 1].sipp).toBe(326000);
    expect(again[again.length - 1].isa).toBe(0);
    expect(again[again.length - 1].isaEntered).toBe(true);
    // nothing to record, no month
    expect(recordPatch(plan, { 'record.month': '2026-10' }, { today: TODAY }).errors).toEqual({ 'record.pension': 'nothingToRecord' });
    expect(recordPatch(plan, { 'record.pension': '1' }, { today: TODAY }).errors).toEqual({ 'record.month': 'required' });
    expect(recordPatch(plan, { 'record.month': 'October', 'record.pension': '1' }, { today: TODAY }).errors).toEqual({ 'record.month': 'notAMonth' });
    made['05-record'] = sha(list);
    if (pinned) expect(sha(list)).toBe(pinned['05-record']);
  });

  it('property: whatever is typed, every path written is declared; the settings object always has the nine keys; the record list never shrinks and is never longer than 600', () => {
    const box = fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 90000 }).map(String), fc.constant('x'));
    fc.assert(fc.property(fc.record({ netMonthly: box, employerMonthly: box, isaMonthly: box, salary: box, potNow: box, escalationPct: fc.constantFrom('', '1', '2.5', '30', 'x'), schemeType: fc.constantFrom('ras', 'netpay', 'salsac', 'odd'), 'record.month': fc.constantFrom('', '2026-10', '2026-13', 'now'), 'record.pension': box, 'record.isa': box, 'record.gia': box }), (typed) => {
      const t = Object.fromEntries(Object.entries(typed).filter(([, v]) => v !== ''));
      const p = savingPatch(plan, t, { today: TODAY });
      for (const k of Object.keys(p.patch)) expect(SAVING_WRITES).toContain(k);
      if (p.patch['accumulationTool.settings']) expect(Object.keys(p.patch['accumulationTool.settings']).sort()).toEqual([...SETTINGS_KEYS].sort());
      const r = recordPatch(plan, t, { today: TODAY });
      for (const k of Object.keys(r.patch)) expect(SAVING_WRITES).toContain(k);
      if (r.patch['accumulationTool.history']) { const l = r.patch['accumulationTool.history']; expect(l.length).toBeGreaterThanOrEqual(SAVER.accumulationTool.history.length); expect(l.length).toBeLessThanOrEqual(RECORDS_KEPT); }
      const c = checkSaving(plan, t, { today: TODAY });
      expect(Object.keys(c.values).every((k) => isSavingPath(k))).toBe(true);
    }), { numRuns: 80 });
  });

  it('pins written once', () => {
    if (!pinned) writeFileSync(PINS, JSON.stringify(made, null, 1) + '\n');
    expect(Object.keys(pinned || made).sort()).toEqual(['05-reading', '05-record', '05-rise']);
    if (pinned) expect(made['05-reading']).toBe(pinned['05-reading']);
  });
});

/**
 * 7.9.0 "I accept this risk" on the rows of "Try the bad years" (the build spec's §3): the agreement list carries every
 * kind through every write, the keep agreement reads and withdraws its own entries only, and a row's agreement is one live
 * entry per row, out of date on a new fingerprint (the stored settings, never the date) or a new document. Rows' results here
 * are made up in runStressRow's shape (the runs are stressPanelRun.js's tests); the plans are the test corpus, fictional.
 */
import { describe, it, expect } from 'vitest';
import { AMENDMENT_KINDS, normaliseAmendments, amendmentsOf, amendmentsWith, amendmentsWithout, amendmentsWithoutLast, amendmentState, documentAtOf } from '../../../src/services/PlanAmendments.js';
import { stressKeyOf, stressInputsOf, fingerprintOf, FINGERPRINT_SKIP, stressAgreementOf, stressAgreementsOf, stressAmendPatch, stressWithdrawPatch, kindOfRow, ROW_IDS, canonical } from '../../../src/answers/plan/stressPanel.js';
import { withdrawPatch } from '../../../src/answers/plan/keepTest.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { AMEND_WRITES } from '../../../src/answers/plan/schema.js';
import { copyOf } from '../../../src/services/PlanCopy.js';
import { closedPlanRefusal } from '../../../src/services/PlanClosed.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const AT = '2026-10-02T12:00:00.000Z';
const AT2 = '2026-10-03T09:30:00.000Z';
const plan0 = (name) => JSON.parse(JSON.stringify(entryOf(C[name]).plan));
const stressSet = (plan, path, v) => applyPatch(plan, { ['stressTool.settings.' + path]: v });
const KEEP = { at: '2026-09-01T10:00:00.000Z', kind: 'keep', lines: [], expected: [], retest: {}, engineVersion: '6.39.0', othersValue: 0, fingerprint: 'k1', documentAt: null };

/** A row's result as runStressRow gives it: the key, the figures, the when / how long / how much. */
const resultOf = (plan, { weighted = 0.87, fixedAge = 0.8, failing = true, today = TODAY, na = null } = {}) => (na ? { key: stressKeyOf(plan, today), na } : {
  key: stressKeyOf(plan, today), na: null,
  a: { weighted, sumW: weighted === null ? null : 123, n: weighted === null ? null : 1000, fixedAge, share: fixedAge, planToAge: 97, coverage: 96.5, floor: failing ? { age: 88, yearly: 12500, spAge: null } : null, typicalLeft: 150123.4, badCaseLeft: 0, goodCaseLeft: 600000, cuts: null, level: 'balanced' },
  shortfall: failing ? { when: { typical: 88, worst: 84, worstLasts: false }, howLong: { paid: 22, of: 31 }, howMuch: 0.9 } : { when: null, howLong: null, howMuch: 1 },
  ran: { family: true, cutsOn: false }
});
const accept = (plan, id, o = {}) => stressAmendPatch(plan, { id, result: resultOf(plan, o) }, { at: o.at || AT, today: o.today || TODAY });

describe('the list carries every kind; the keep agreement reads its own', () => {
  it('the kinds; an unread kind is kept by normalise, left out on read, carried by every write byte for byte', () => {
    expect(AMENDMENT_KINDS).toEqual(['keep', 'stress', 'confidence', 'asHeld']);
    const odd = { at: AT, kind: 'later', fingerprint: 'z', extra: { a: 1 } };
    const raw = [KEEP, odd, { at: 'x' }, null];
    expect(normaliseAmendments(raw)).toEqual([KEEP, odd]);
    const plan = { planAmendments: raw };
    expect(amendmentsOf(plan)).toEqual([KEEP]);
    expect(amendmentsOf(plan, ['keep'])).toEqual([KEEP]);
    expect(amendmentsWith(plan, { ...KEEP, at: AT2 })).toEqual([KEEP, odd, { ...KEEP, at: AT2 }]);
    expect(amendmentsWithout(plan, (e) => e.kind === 'keep')).toEqual([odd]);
  });
  it('the rollback (AMENDMENT_KINDS = [\'keep\']): a reader asking for keep only sees no stress entry, and a keep write carries it', () => {
    const stress = { at: AT, kind: 'stress', test: { id: 'fall' }, fingerprint: 'f' };
    const plan = { planAmendments: [KEEP, stress] };
    expect(amendmentsOf(plan, ['keep'])).toEqual([KEEP]);
    expect(amendmentsWith(plan, { ...KEEP, at: AT2 })[1]).toEqual(stress);
  });
  it('withdraw takes the last KEEP entry, never a stress entry after it; the keep state ignores later stress entries', () => {
    const locked = plan0('04-buckets-running');
    const k = { ...KEEP, documentAt: documentAtOf(locked) };
    const s1 = { at: AT, kind: 'stress', test: { id: 'fall', inputs: {} }, result: {}, fingerprint: 'f', engineVersion: '7.9.0', documentAt: null };
    const plan = { ...locked, planAmendments: [k, s1] };
    expect(amendmentState(plan).last).toEqual(k);
    expect(amendmentState(plan).count).toBe(1);
    expect(amendmentsWithoutLast(plan)).toEqual([s1]);
    const w = withdrawPatch(plan);
    expect(w.ok).toBe(true);
    expect(JSON.stringify(w.patch.planAmendments)).toBe(JSON.stringify([s1]));   // the stress entry, byte for byte
  });
  it('a 7.7.0 list (keep entries only) reads and writes exactly as before', () => {
    const list = [KEEP, { ...KEEP, at: AT, fingerprint: 'k2' }];
    const plan = { planAmendments: list };
    expect(amendmentsOf(plan)).toEqual(list);
    expect(amendmentsWithoutLast(plan)).toEqual([KEEP]);
    expect(amendmentsWith(plan, KEEP)).toEqual([...list, KEEP]);
  });
});

describe('a row\'s agreement', () => {
  it('the inputs an entry keeps: the strategy, the start age, the years, the first tax year — no pots, no income, no sex, no level', () => {
    const plan = plan0('02-pnv-draft');
    const s = effectiveStressSettings(plan, { now: noon(TODAY) });
    expect(Object.keys(stressInputsOf(s))).toEqual(['strategyId', 'startAge', 'years', 'firstTaxYear']);
    const p = accept(plan, 'spend');
    expect(p.ok).toBe(true);
    const e = p.entry;
    expect(e).toMatchObject({ at: AT, kind: 'stress', test: { id: 'spend', inputs: { ...stressInputsOf(s), shock: { kind: 'spend', factor: 1.1 } } }, engineVersion: expect.any(String), ageRule: 'birthday' });
    expect(e.result).toEqual({ chance: 0.87, fixedAge: 0.8, planToAge: 97, runOutAge: 84, typicalRunOutAge: 88, coverage: 96.5, floor: { age: 88, yearly: 12500 }, leftMedian: 150123 });
    const text = JSON.stringify(e);
    expect(text).not.toMatch(/undefined|"sex"|"level"|equityMin|bondMin|cashTarget|isaBalance|baseSalary|incomeSteps|"female"|"male"/);
    expect(JSON.parse(text)).toEqual(e);   // plain data
    expect(Object.keys(p.patch)).toEqual(['planAmendments']);
    for (const k of Object.keys(p.patch)) expect(AMEND_WRITES).toContain(k);
    expect(kindOfRow('asPlanned')).toBe('confidence');
    expect(accept(plan, 'asPlanned').entry.kind).toBe('confidence');
  });
  it('one live entry per row: accepting twice leaves one; accepting over an out-of-date one is allowed; withdraw takes only its own', () => {
    let plan = plan0('02-pnv-draft');
    plan = applyPatch(plan, accept(plan, 'fall').patch);
    plan = applyPatch(plan, accept(plan, 'lower').patch);
    plan = applyPatch(plan, accept(plan, 'fall', { at: AT2 }).patch);
    expect(plan.planAmendments.map((e) => [e.test.id, e.at])).toEqual([['lower', AT], ['fall', AT2]]);
    // out of date, then accepted again
    const changed = stressSet(plan, 'chargesPct', 0.75);
    expect(stressAgreementOf(changed, 'fall').status).toBe('stale');
    const again = applyPatch(changed, accept(changed, 'fall', { at: AT2 }).patch);
    expect(stressAgreementOf(again, 'fall').status).toBe('agreed');
    expect(again.planAmendments.filter((e) => e.test.id === 'fall').length).toBe(1);
    // withdraw: that row's entry only
    const w = stressWithdrawPatch(again, 'fall');
    expect(w.ok).toBe(true);
    expect(w.line).toEqual({ id: 'withdrawn', slots: { date: '3 October 2026' } });
    const after = applyPatch(again, w.patch);
    expect(after.planAmendments.map((e) => e.test.id)).toEqual(['lower']);
    expect(stressWithdrawPatch(after, 'fall')).toMatchObject({ ok: false, problem: 'none' });
  });
  it('a stress entry survives a keep accept and a keep withdraw byte for byte', () => {
    const locked = plan0('04-buckets-running');
    let plan = applyPatch(locked, accept(locked, 'prices').patch);
    const before = JSON.stringify(plan.planAmendments[0]);
    plan = { ...plan, planAmendments: amendmentsWith(plan, { ...KEEP, documentAt: documentAtOf(plan) }) };
    expect(JSON.stringify(plan.planAmendments[0])).toBe(before);
    plan = applyPatch(plan, withdrawPatch(plan).patch);
    expect(plan.planAmendments.map((e) => JSON.stringify(e))).toEqual([before]);
  });
  it('out of date on what moves a figure — the same total moved from bonds to shares, the State Pension, the charge — never on a screen\'s state or a month passing', () => {
    const base = plan0('02-pnv-draft');
    const plan = applyPatch(base, accept(base, 'fall').patch);
    expect(stressAgreementOf(plan, 'fall').status).toBe('agreed');
    const ss = plan.stressTool.settings;
    const moved = applyPatch(plan, { 'stressTool.settings.equityMin': ss.equityMin + 10000, 'stressTool.settings.bondMin': ss.bondMin - 10000 });
    expect(stressAgreementOf(moved, 'fall').status).toBe('stale');
    expect(stressAgreementOf(stressSet(plan, 'spWeeklyAmount', (+ss.spWeeklyAmount || 200) + 5), 'fall').status).toBe('stale');
    expect(stressAgreementOf(stressSet(plan, 'chargesPct', 1), 'fall').status).toBe('stale');
    for (const k of FINGERPRINT_SKIP) expect(stressAgreementOf(stressSet(plan, k, k === 'configured' ? !ss.configured : 'something else'), 'fall').status, k).toBe('agreed');
    // a month passing: the key the rows are filed under moves, the agreement does not
    expect(stressKeyOf(plan, '2026-11-02')).not.toBe(stressKeyOf(plan, TODAY));
    expect(stressAgreementOf(plan, 'fall').status).toBe('agreed');
    // the same settings read back in another key order: the same fingerprint
    const reordered = { ...plan, stressTool: { ...plan.stressTool, settings: Object.fromEntries(Object.entries(ss).reverse()) } };
    expect(fingerprintOf(reordered, 'stress', 'fall')).toBe(fingerprintOf(plan, 'stress', 'fall'));
    expect(canonical({ b: 1, a: [2, { d: 3, c: 4 }] })).toBe(canonical({ a: [2, { c: 4, d: 3 }], b: 1 }));
  });
  it('a locked plan stays agreed until a new document', () => {
    const locked = plan0('04-buckets-running');
    const plan = applyPatch(locked, accept(locked, 'lower').patch);
    expect(stressAgreementOf(plan, 'lower').status).toBe('agreed');
    const newDoc = { ...plan, planDocument: { ...plan.planDocument, createdAt: '2026-12-01T10:00:00.000Z' } };
    expect(stressAgreementOf(newDoc, 'lower').status).toBe('stale');
  });
  it('a locked plan: a month recorded or deleted — the first one included — leaves its agreements agreed (nothing the rows read moved)', () => {
    for (const name of ['04-buckets-running', '20-locked-start-after-stop']) {
      const locked = plan0(name);
      const plan = applyPatch(locked, accept(locked, 'fall').patch);
      const h = plan.decisionTool.history || [];
      const withHistory = (list) => ({ ...plan, decisionTool: { ...plan.decisionTool, history: list } });
      const variants = [withHistory(h.slice(1)), withHistory(h.slice(0, -1)), withHistory([]), withHistory([{ date: '2026-09-01', month: '2026-09', bridgeYear: false }, ...h])];
      for (const v of variants) {
        expect(effectiveStressSettings(v, { now: noon(TODAY) })).toEqual(effectiveStressSettings(plan, { now: noon(TODAY) }));
        expect(stressAgreementOf(v, 'fall').status, name).toBe('agreed');
      }
    }
  });
  it('an unlocked plan: deleting its earliest month while others stay leaves an agreement agreed; its settings changed still make it out of date', () => {
    const base = plan0('02-pnv-draft');
    const months = [{ date: '2026-08-01', month: '2026-08' }, { date: '2026-09-01', month: '2026-09' }];
    const withMonths = { ...base, decisionTool: { ...(base.decisionTool || {}), history: months } };
    const plan = applyPatch(withMonths, accept(withMonths, 'fall').patch);
    expect(stressAgreementOf(plan, 'fall').status).toBe('agreed');
    expect(stressAgreementOf({ ...plan, decisionTool: { ...plan.decisionTool, history: months.slice(1) } }, 'fall').status).toBe('agreed');
    expect(stressAgreementOf(stressSet(plan, 'chargesPct', 1), 'fall').status).toBe('stale');
  });
  it('a couple\'s plan and a locked ladder, with no weighted figure, accept on the fixed-age count (chance null) and withdraw', () => {
    for (const name of ['09-couple-a', '03-gilt-ladder-locked']) {
      const plan = plan0(name);
      const id = name.startsWith('03') ? 'asPlanned' : 'fall';
      const p = accept(plan, id, { weighted: null, fixedAge: 0.85 });
      expect(p.ok, name).toBe(true);
      expect(p.entry.result.chance).toBe(null);
      expect(p.entry.result.fixedAge).toBe(0.85);
      const after = applyPatch(plan, p.patch);
      expect(stressAgreementOf(after, id).status).toBe('agreed');
      expect(stressWithdrawPatch(after, id).ok).toBe(true);
    }
  });
  it('refused: a closed plan, a held row, a row not tried, no result, a result for another key, a row that changes nothing, one where nothing runs out', () => {
    const plan = plan0('02-pnv-draft');
    const closed = { ...plan, closedAt: '2026-09', nextPlanId: 'NextPlan01' };
    expect(accept(closed, 'fall').problem).toBe('closed');
    expect(stressWithdrawPatch(closed, 'fall').problem).toBe('closed');
    expect(closedPlanRefusal(closed, accept(plan, 'fall').patch)).toContain('planAmendments');
    for (const id of ['asHeld', 'heldHalf', 'heldNothing']) { expect(accept(plan, id).problem).toBe('held'); expect(stressWithdrawPatch(plan, id).problem).toBe('held'); }
    expect(accept(plan, 'prices', { na: 'todaysPrices' }).problem).toBe('na');
    expect(stressAmendPatch(plan, { id: 'fall', result: null }, { at: AT, today: TODAY }).problem).toBe('noResult');
    expect(stressAmendPatch(plan, { id: 'fall', result: resultOf(plan) }, { at: 'yesterday', today: TODAY }).problem).toBe('noResult');
    expect(stressAmendPatch(plan, { id: 'fall', result: resultOf(plan, { today: '2026-10-01' }) }, { at: AT, today: TODAY }).problem).toBe('oldResult');
    expect(stressAmendPatch(plan, { id: 'fall', result: resultOf(plan), same: true }, { at: AT, today: TODAY }).problem).toBe('same');
    expect(accept(plan, 'fall', { failing: false }).problem).toBe('nothingFails');
    expect(accept(plan, 'fall').ok).toBe(true);   // an unlocked plan accepts
  });
  it('before anything is run: the agreements listed, each withdrawable without a run; a copy drops them', () => {
    let plan = plan0('02-pnv-draft');
    plan = applyPatch(plan, accept(plan, 'asPlanned').patch);
    plan = applyPatch(plan, accept(plan, 'spend').patch);
    const stale = stressSet(plan, 'baseSalary', (+plan.stressTool.settings.baseSalary || 30000) + 1000);
    const list = stressAgreementsOf(stale);
    expect(list.map((x) => [x.id, x.kind, x.status, x.on])).toEqual([['asPlanned', 'confidence', 'stale', '2 October 2026'], ['spend', 'stress', 'stale', '2 October 2026']]);
    for (const x of list) expect(stressWithdrawPatch(stale, x.id).ok).toBe(true);
    expect(copyOf(plan, 'Copy', { now: noon(TODAY) })).not.toHaveProperty('planAmendments');
    expect(ROW_IDS).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices', 'asHeld', 'heldHalf', 'heldNothing']);
  });
  it('the key: a classic settings save, a new day, a budget age, a partner link each move it; the level and an agreement do not', () => {
    const plan = plan0('02-pnv-draft');
    const k = stressKeyOf(plan, TODAY);
    expect(stressKeyOf(plan, TODAY)).toBe(k);
    expect(stressKeyOf(stressSet(plan, 'baseSalary', (+plan.stressTool.settings.baseSalary || 0) + 500), TODAY)).not.toBe(k);
    expect(stressKeyOf(plan, '2026-10-03')).not.toBe(k);
    const b = plan.budgetTool && plan.budgetTool.settings ? plan.budgetTool.settings : {};
    expect(stressKeyOf(applyPatch(plan, { 'budgetTool.settings.currentAge': (+b.currentAge || 60) + 1, 'budgetTool.settings.currentAgeAsOf': '2026-09-30', 'budgetTool.settings.agesSetByUser': true }), TODAY)).not.toBe(k);
    expect(stressKeyOf({ ...plan, household: { partnerScenarioId: 'OtherPlan1' } }, TODAY)).not.toBe(k);
    expect(stressKeyOf({ ...plan, lastModified: '2027-01-01T00:00:00.000Z', planAmendments: [KEEP] }, TODAY)).toBe(k);
    expect(stressKeyOf({ ...plan, fromAnswer: { ...(plan.fromAnswer || {}), answer: { level: 'careful', levelChosen: true } } }, TODAY)).toBe(k);
  });
});

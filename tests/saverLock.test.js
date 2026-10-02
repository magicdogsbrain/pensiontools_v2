/**
 * A saver's locked plan that reads true (6.22.0; research/saver-lock-and-savings-growth.md §4, tests 14–17; the owner's
 * decision (A) of 2 Oct 2026; square-one audit §3 "Locking a plan before retiring, while still saving").
 *
 * The faults the audit found, each held here:
 *  - "Price rises are lost": the old path is in the prices of the day it was drawn, the recorded pot in pounds of its
 *    month; after ten years at 2.5% a pot exactly on course read about 28% ahead. Now the pot is put into the path's
 *    prices at the 2.5% the path was drawn with, and read at the month it was recorded.
 *  - "'Refresh' breaks the reading": the clock ran from the first lock. Now it runs from the path's own start.
 *  - "Pension only": a plan locked from 6.22.0 draws its path on V7's saving-years engine with the ISA and what goes into
 *    it, and the reading counts both, in pounds of the day.
 *  - The arrival check uses the same measure.
 * Documents already locked are read differently, never rewritten.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildPlanDocument, whereAmI, PLAN_DOCUMENT_VERSION } from '../src/services/PlanDocument.js';
import { saverReading, saverPrices, pathStart, savingPathVersion, pathCountsIsa, saverPotOf, OLD_PATH_CPI, monthOf, potRecordOf, figureOrNull, recordIsaOf } from '../src/services/SaverReading.js';
import { buildSavingPath, savingPathMixes, SAVING_PATH_LIVES } from '../src/services/SavingPath.js';
import { savingPathForLock } from '../src/ui/savingPathForLock.js';
import { whereAmIHtml, saverReadingText, planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { deriveTiming } from '../src/services/PlanTiming.js';
import { deriveStage, arrivalCheck } from '../src/services/LifeStage.js';
import { contributionBreakdown, projectAccumulation } from '../src/services/AccumulationEngine.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';
import { savingPlan, potsByPerson } from '../src/answers/shared/saving.js';
import { livesList } from '../src/answers/shared/lives.js';
import { bandIndexes } from '../src/answers/shared/band.js';

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
const NOW = new Date(2026, 6, 15, 12, 0);   // the lock: 15 July 2026
const saver = { currentAge: 48, currentAgeAsOf: '2026-07-15', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 40000, baseSalary: 36000, duration: 35, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 36000 }], chargesPct: 0.5, isaGrowth: 'cash' };
const accumulation = { netMonthly: 600, salary: 68000, schemeType: 'ras', employerMonthly: 450, escalationPct: 1, potNow: 310000, isaMonthly: 300 };
const bytes = (v) => JSON.stringify(v);
/** A document as a 6.7–6.21 lock wrote it: the FCA path, pension only, version 2, no ISA choice in the assumptions. */
const oldDoc = (over = {}) => {
  const d = buildPlanDocument({ planName: 'Old saver', settings: { ...saver, isaGrowth: undefined }, accumulation: { ...accumulation, isaMonthly: undefined }, lockedAt: NOW.toISOString(), now: NOW });
  d.version = 2; delete d.assumptions.isaGrowth;
  return { ...d, ...over };
};
const nominalOnPath = (doc, months, key = 'potMid') => {   // the FCA path's line at `months`, in pounds of that month
  const path = doc.accumulation.path; const y = months / 12; const i = Math.floor(y), f = y - i;
  const real = path[i][key] + ((path[Math.min(path.length - 1, i + 1)][key]) - path[i][key]) * f;
  return real * Math.pow(1 + OLD_PATH_CPI, y);
};

describe('documents locked before 6.22.0 (version 2 and older): read like with like, never rewritten', () => {
  it('the old path is still drawn when no saving path is handed in; its clock starts at the document\'s own day', () => {
    const d = oldDoc();
    expect(savingPathVersion(d)).toBe(2);
    expect(d.accumulation.version).toBeUndefined();
    expect(d.accumulation.path.length).toBe(13);
    expect(pathStart(d)).toEqual({ at: { y: 2026, m: 7 }, from: 'createdAt' });
    expect(pathCountsIsa(d)).toBe(false);
  });
  it('a pot exactly on the projection after ten years of prices rising 2.5% a year reads "on or above the locked path"', () => {
    const d = oldDoc();
    const pot = nominalOnPath(d, 120);   // July 2036, in the pounds of July 2036
    const w = whereAmI(d, { today: new Date(2036, 6, 20), accHistory: [{ date: '2036-07', sipp: pot, isa: 90000, total: pot + 90000 }] });
    expect(w.saving.band).toBe('on or above the locked path');
    expect(w.saving.compared).toBe(Math.round(d.accumulation.path[10].potMid));
    expect(w.saving.prices.factor).toBeCloseTo(Math.pow(1.025, 10), 12);
    // Before 6.22.0 the same pot, in the pounds of 2036, was set against the path in the prices of 2026: 28% ahead of the
    // middle line, though it was exactly on it.
    expect(pot / d.accumulation.path[10].potMid).toBeGreaterThan(1.27);
  });
  it('the path is read at the month of the pot record, not today', () => {
    const d = oldDoc();
    const pot = nominalOnPath(d, 24);   // July 2028
    const later = whereAmI(d, { today: new Date(2031, 2, 1), accHistory: [{ date: '2028-07', sipp: pot, isa: 0, total: pot }] });
    expect(later.saving.at).toBe('2028-07');
    expect(later.saving.expected).toBe(Math.round(d.accumulation.path[2].potMid));
    expect(later.saving.band).toBe('on or above the locked path');
  });
  it('"Refresh" restarts the clock: a document written later reads from its own day, not from the first lock', () => {
    const d = oldDoc({ lockedAt: '2022-01-10T09:00:00.000Z' });   // locked 4½ years before this document was written
    expect(pathStart(d).from).toBe('createdAt');
    const pot = nominalOnPath(d, 2);
    const w = whereAmI(d, { today: new Date(2026, 8, 30), accHistory: [{ date: '2026-09', sipp: pot, isa: 0, total: pot }] });
    expect(w.saving.band).toBe('on or above the locked path');
    expect(saverPrices(d, '2026-09').months).toBe(2);
    // a document with no createdAt falls back to the lock
    const noCreated = { ...d }; delete noCreated.createdAt;
    expect(pathStart(noCreated)).toEqual({ at: { y: 2022, m: 1 }, from: 'lockedAt' });
  });
  it('the words carry the prices, the month the path was drawn, and that it is the pension only', () => {
    const d = oldDoc();
    const w = whereAmI(d, { today: new Date(2029, 2, 20), accHistory: [{ date: '2029-03', sipp: 340000, isa: 50000, total: 390000 }] });
    const t = plain(saverReadingText(w.saving));
    expect(t).toMatch(/^Pension pot £340,000 \(recorded 2029-03\), which is £3\d\d,\d{3} in the prices of July 2026, when this path was drawn \(prices assumed to rise 2\.5% a year, as the path does\), against £3\d\d,\d{3} on the locked path for then — /);
    expect(t).toMatch(/This path was drawn before ISAs were counted: it follows your pension only\.$/);
    expect(plain(whereAmIHtml(w))).toContain(t);
  });
  it('the stored document is byte-identical after reading', () => {
    const d = oldDoc(); const before = bytes(d);
    whereAmI(d, { today: new Date(2030, 0, 1), accHistory: [{ date: '2029-12', sipp: 400000, isa: 1, total: 400001 }] });
    arrivalCheck({ timingMode: 'future', beforeStart: false }, d, { sipp: 1, isa: 1 }, { at: '2038-03' });
    expect(bytes(d)).toBe(before);
  });
  it('corpus fixture 05 (locked July 2026, records July to September): read at September, in the path\'s prices; its band is kept', () => {
    const f = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/plans/05-saver-committed.json'), 'utf8'));
    const w = whereAmI(f.planDocument, { today: new Date('2026-09-30T08:00:00.000Z'), accHistory: f.accumulationTool.history, holdings: f.holdings });
    expect(w.saving.at).toBe('2026-09');
    expect(w.saving.actual).toBe(319800);
    expect(w.saving.compared).toBe(Math.round(319800 / Math.pow(1.025, 2 / 12)));
    expect(w.saving.band).toBe('above the strong line');   // the snapshot's band
  });
});

describe('new locks (plan document version 3): the saving path on V7\'s saving-years engine', () => {
  const timing = deriveTiming(saver, NOW);
  const path = buildSavingPath({ settings: saver, timing, accumulation, now: NOW, lives: 200 });
  it('the document is version 3 and holds the path handed to it, untouched', () => {
    expect(PLAN_DOCUMENT_VERSION).toBe(3);
    const d = buildPlanDocument({ settings: saver, accumulation, lockedAt: NOW.toISOString(), now: NOW, savingPath: path });
    expect(d.version).toBe(3);
    expect(d.accumulation).toEqual(path);
    expect(d.assumptions.isaGrowth).toBe('cash');
    expect(savingPathVersion(d)).toBe(3);
    expect(pathStart(d)).toEqual({ at: { y: 2026, m: 7 }, from: 'asOf' });
  });
  it('what it records: the pension and the ISA with what goes into each, the choice, the charge, the mixes, the lives', () => {
    const gross = contributionBreakdown({ netMonthly: 600, salary: 68000, schemeType: 'ras', employerMonthly: 450 }).totalMonthly;
    expect(path).toMatchObject({ version: 3, asOf: '2026-07', lives: 200, seed: 0, startAge: 48, retireAge: 60, years: 12, potNow: 310000, potSource: 'accumulation',
      isaNow: 40000, isaSource: 'settings', totalMonthly: Math.round(gross), isaMonthly: 300, escalationPct: 1, chargesPct: 0.5, isaGrowth: 'cash' });
    expect(path.mixes.drawing).toEqual({ equity: 0.6, bond: 0.3, cash: 0.1 });
    expect(path.mixes.saving).toEqual(path.mixes.drawing);   // nothing held on record: the plan's allocation
    expect(path.path.length).toBe(13);
    expect(path.path[0]).toMatchObject({ year: 0, age: 48, nominal: { careful: 350000, middling: 350000, good: 350000 }, paidIn: 0 });
    expect(path.path[0].isa).toEqual({ middling: 40000, real: 40000 });
  });
  it('the same inputs give the same path; only plain numbers are stored, and a long one is small', () => {
    expect(bytes(buildSavingPath({ settings: saver, timing, accumulation, now: NOW, lives: 200 }))).toBe(bytes(path));
    expect(JSON.parse(bytes(path))).toEqual(path);
    expect(bytes(path)).not.toMatch(/Float64Array|function/);
    const young = { ...saver, currentAge: 22, retireAge: 67 };
    const long = buildSavingPath({ settings: young, timing: deriveTiming(young, NOW), accumulation, now: NOW });
    expect(long.lives).toBe(SAVING_PATH_LIVES);
    expect(long.path.length).toBe(46);
    expect(bytes(long).length).toBeLessThan(20000);
  });
  it('each year: the 1-in-10 bad line ≤ the middle ≤ the 1-in-10 good line, in pounds of the day and in today\'s money', () => {
    for (const r of path.path) {
      expect(r.nominal.careful).toBeLessThanOrEqual(r.nominal.middling);
      expect(r.nominal.middling).toBeLessThanOrEqual(r.nominal.good);
      expect(r.real.careful).toBeLessThanOrEqual(r.real.middling);
      expect(r.real.middling).toBeLessThanOrEqual(r.real.good);
    }
    expect(path.path[12].nominal.good).toBeGreaterThan(path.path[12].nominal.careful);
  });
  it('with no pay-ins, the lines at the stop are V7\'s own pots at the stop (potsByPerson), today\'s money', () => {
    const acc0 = { potNow: 310000 };
    const p0 = buildSavingPath({ settings: saver, timing, accumulation: acc0, now: NOW, lives: 200 });
    const hh = { people: [{ who: 'you', age: 0, pots: { pension: 310000, isa: 40000 }, saving: { payIn: { total: 0 }, savingsIn: 0 } }], chargesPct: 0.5, isaGrowth: 'cash', portfolio: { kind: 'risk', level: 'balanced' } };
    const mixes = savingPathMixes(saver, null);
    const plan = savingPlan(hh, 12, { mix: mixes.drawing, savingMix: mixes.saving });
    const pots = potsByPerson(plan, livesList(200, 13, { seed: 0 }))[0];
    const totals = Array.from(pots.pension, (v, i) => v + pots.savings[i]).sort((a, b) => a - b);
    const at = bandIndexes(200);
    expect(Math.abs(p0.path[12].real.middling - totals[at.middling])).toBeLessThanOrEqual(1);
    expect(Math.abs(p0.path[12].real.careful - totals[at.careful])).toBeLessThanOrEqual(1);
    expect(Math.abs(p0.path[12].real.good - totals[at.good])).toBeLessThanOrEqual(1);
  });
  it('a made-up flat future: the lines are the closed form (shares only, so no bond draw)', () => {
    const r = 0.06, inf = 0.02;
    const env = { futureReturns: (i, years) => ({ equity: Object.fromEntries(Array.from({ length: years }, (_, y) => [y, r])), inflation: Object.fromEntries(Array.from({ length: years }, (_, y) => [y, inf])) }) };
    const s = { ...saver, equityMin: 500000, bondMin: 0, cashTarget: 0, isaGrowth: 'invested' };
    const acc = { potNow: 100000, netMonthly: 400, salary: 40000, schemeType: 'ras', employerMonthly: 0, escalationPct: 2, isaMonthly: 200 };
    const p = buildSavingPath({ settings: s, timing: deriveTiming(s, NOW), accumulation: acc, now: NOW, lives: 20, env });
    const g = Math.pow(1 + r, 1 / 12), c = monthlyChargeFactor(0.5);
    let pen = 100000, isa = 40000, paid = 0;
    const pay = contributionBreakdown({ netMonthly: 400, salary: 40000, schemeType: 'ras', employerMonthly: 0 }).totalMonthly;
    for (let y = 0; y < 12; y++) {
      const f = Math.pow(1.02, y);
      for (let m = 0; m < 12; m++) { pen = (pen + pay * f) * g * c; isa = (isa + 200 * f) * g * c; paid += (pay + 200) * f; }
      const row = p.path[y + 1];
      expect(row.nominal.careful).toBe(row.nominal.good);   // every life the same
      expect(Math.abs(row.nominal.middling - (pen + isa))).toBeLessThanOrEqual(1);
      expect(Math.abs(row.pension.middling - pen)).toBeLessThanOrEqual(1);
      expect(Math.abs(row.real.middling - (pen + isa) / Math.pow(1 + inf, y + 1))).toBeLessThanOrEqual(1);
      expect(Math.abs(row.paidIn - paid)).toBeLessThanOrEqual(1);
    }
  });
  it('the ISA follows the plan\'s choice; with none, the fixed 3% a year (the same in every future, in pounds of the day)', () => {
    const cash = path, inv = buildSavingPath({ settings: { ...saver, isaGrowth: 'invested' }, timing, accumulation, now: NOW, lives: 200 });
    expect(inv.path[12].isa.middling).toBeGreaterThan(cash.path[12].isa.middling);
    expect(inv.path[12].pension).toEqual(cash.path[12].pension);   // the pension never depends on it
    const none = buildSavingPath({ settings: { ...saver, isaGrowth: undefined }, timing, accumulation, now: NOW, lives: 200 });
    expect(none.isaGrowth).toBeNull();
    expect(none.isaReturn).toBe(0.03);
    let sav = 40000; const q = Math.pow(1.03, 1 / 12), c = monthlyChargeFactor(0.5);
    for (let y = 0; y < 12; y++) { const pay = 300 * Math.pow(1.01, y); for (let m = 0; m < 12; m++) sav = (sav + pay) * q * c; }
    expect(Math.abs(none.path[12].isa.middling - sav)).toBeLessThanOrEqual(1);
  });
  it('what goes into the ISA counts; a plan with no ISA and nothing going in has an ISA line of nothing', () => {
    const noPay = buildSavingPath({ settings: saver, timing, accumulation: { ...accumulation, isaMonthly: 0 }, now: NOW, lives: 200 });
    expect(path.path[12].isa.middling).toBeGreaterThan(noPay.path[12].isa.middling);
    const noIsa = buildSavingPath({ settings: { ...saver, isaBalance: 0 }, timing, accumulation: { ...accumulation, isaMonthly: 0 }, now: NOW, lives: 200 });
    expect(noIsa.path.every((r) => r.isa.middling === 0)).toBe(true);
    expect(pathCountsIsa({ accumulation: noIsa })).toBe(false);
    expect(pathCountsIsa({ accumulation: path })).toBe(true);
  });
  it('what you hold, when recorded, is the pension (SIPP lines), the ISA (ISA lines) and the saving mix', () => {
    const holdings = { version: 1, updatedAt: '2026-07-10', source: 'typed', lines: [{ ticker: 'VWRP', value: 260000, wrapper: 'SIPP' }, { ticker: 'VAGP', value: 50000, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 41000, wrapper: 'ISA' }] };
    const p = buildSavingPath({ settings: saver, timing, accumulation, holdings, now: NOW, lives: 50 });
    expect(p).toMatchObject({ potNow: 310000, potSource: 'holdings', isaNow: 41000, isaSource: 'holdings' });
    expect(p.mixes.fromHoldings).toBe(true);
    expect(p.mixes.saving.equity).toBeGreaterThan(0.8);
  });
  it('locked with no pension pot on record: the gap is recorded, never a path from the tested pots', () => {
    const p = buildSavingPath({ settings: saver, timing, accumulation: { netMonthly: 600, salary: 68000 }, now: NOW, lives: 50 });
    expect(p.potNow).toBeNull();
    expect(p.path).toEqual([]);
    const d = buildPlanDocument({ settings: saver, now: NOW, savingPath: p });
    expect(plain(planDocumentHtml(d))).toMatch(/locked without a pension pot on record/);
  });
  it('nothing for someone already retired; the lock loads the engine on demand and falls back to the old path if it cannot', async () => {
    const retired = { ...saver, retired: true, retireAge: null, firstTaxYear: 2026 };
    expect(buildSavingPath({ settings: retired, timing: deriveTiming(retired, NOW), accumulation, now: NOW })).toBeNull();
    expect(await savingPathForLock({ settings: retired, accumulation, now: NOW })).toBeUndefined();
    const viaLock = await savingPathForLock({ settings: saver, accumulation, now: NOW });
    expect(viaLock.version).toBe(3);
    expect(viaLock.lives).toBe(SAVING_PATH_LIVES);
    const src = readFileSync(resolve(process.cwd(), 'src/ui/savingPathForLock.js'), 'utf8');
    expect(src).toMatch(/await import\('\.\.\/services\/SavingPath\.js'\)/);   // its own chunk: the main bundle does not grow
    expect(readFileSync(resolve(process.cwd(), 'src/services/PlanDocument.js'), 'utf8')).not.toMatch(/answers\//);
  });
  it('the document shows the path in today\'s money with the 1-in-10 lines, both figures it was locked with, and the charge', () => {
    const d = buildPlanDocument({ settings: { ...saver, potAtRetirement: { sipp: 603941, isa: 54126, source: 'accumulation' } }, accumulation, lockedAt: NOW.toISOString(), now: NOW, savingPath: path });
    const t = plain(planDocumentHtml(d));
    expect(t).toMatch(/4b\. Getting there — the locked saving path/);
    expect(t).toMatch(/AgeMiddle|1-in-10 bad/);
    expect(t).toMatch(/Pension \(middle\)ISA \(middle\)/);
    expect(t).toMatch(/The ISA grows mostly as cash/);
    expect(t).toMatch(/Drawn on 200 possible futures/);
    expect(t).toMatch(/The plan was priced on pots at 60 of £603,941 and ISA £54,126 \(the Timing block, in today's money\)\. On the futures this path was drawn on, the middle pot at 60 is £/);
    expect(t).toMatch(/After fund and platform charges of 0\.5% a year/);
    expect(t).toMatch(/How the ISA and savings growmostly cash/);
  });
});

describe('reading a version-3 document: pension + ISA on both sides, in pounds of the day', () => {
  const timing = deriveTiming(saver, NOW);
  const path = buildSavingPath({ settings: saver, timing, accumulation, now: NOW, lives: 200 });
  const doc = buildPlanDocument({ settings: saver, accumulation, lockedAt: NOW.toISOString(), now: NOW, savingPath: path });
  const at2 = path.path[2].nominal;
  it('a pot exactly on the middle line two years on reads "between the middle and the 1-in-10 good line"', () => {
    const r = saverReading(doc, { at: '2028-07', pension: at2.middling - 50000, isa: 50000 });
    expect(r).toMatchObject({ version: 3, at: '2028-07', months: 24, isaCounted: true, actual: at2.middling, compared: at2.middling, expected: at2.middling, low: at2.careful, high: at2.good, band: 'p50–p90' });
    expect(r.prices.factor).toBe(1);
    const w = whereAmI(doc, { today: new Date(2028, 7, 1), accHistory: [{ date: '2028-07', sipp: at2.middling - 50000, isa: 50000, total: at2.middling }] });
    expect(w.saving.band).toBe('p50–p90');
    const t = plain(whereAmIHtml(w));
    expect(t).toContain('Pension and ISA £' + at2.middling.toLocaleString('en-GB') + ' (recorded 2028-07: pension £' + (at2.middling - 50000).toLocaleString('en-GB') + ', ISA £50,000), in pounds of the day, against £' + at2.middling.toLocaleString('en-GB') + ', the middle of the locked path for then — between the middle');
    expect(t).toMatch(/Going in on the locked plan: £\d[\d,]* a month gross into your pension and £300 a month into ISAs and savings\./);
  });
  it('in the month the path was drawn its lines are one figure: no band yet, and the words say the lines open later', () => {
    const r = saverReading(doc, { at: '2026-07', pension: 360000, isa: 41000 });
    expect(r.band).toBe('start');
    const t = plain(saverReadingText({ ...r, actualSource: 'record', recordedAt: '2026-07' }));
    expect(t).toBe('Pension and ISA £401,000 (recorded 2026-07: pension £360,000, ISA £41,000), in pounds of the day, against £' + path.path[0].nominal.middling.toLocaleString('en-GB') + ' the locked path starts from; its lines open as the months go on.');
    expect(saverReading(doc, { at: '2026-06', pension: 1, isa: 1 }).band).toBe('start');   // a record from before the path: read at its start
  });
  it('the bands are named as the retired strip names them', () => {
    const band = (total) => saverReading(doc, { at: '2028-07', pension: total, isa: 0 }).band;
    expect(band(at2.careful - 1)).toBe('below p10');
    expect(band(at2.careful + 1)).toBe('p10–p50');
    expect(band(at2.good + 1)).toBe('above p90');
    const low = saverReading(doc, { at: '2028-07', pension: at2.careful - 1, isa: 0 });
    expect(plain(saverReadingText({ ...low, version: 3, actualSource: 'record', recordedAt: '2028-07' }))).toMatch(/below the locked path's 1-in-10 bad line/);
  });
  it('no ISA figure when the path counts one: no verdict, and it says what to add', () => {
    const w = whereAmI(doc, { today: new Date(2028, 7, 1), accHistory: [{ date: '2028-07', sipp: 400000, total: 400000 }] });
    expect(w.saving.missing).toEqual(['isa']);
    expect(w.saving.band).toBeNull();
    expect(plain(whereAmIHtml(w))).toMatch(/The locked path counts your ISA as well, and there is no ISA figure with it, so the pot is not set against the path\. Add your ISA to the monthly record on the Accumulation tab to compare\./);
    // from What you hold, when nothing is recorded: the SIPP and ISA lines
    const h = { updatedAt: '2028-07-02', lines: [{ ticker: 'VWRP', value: 400000, wrapper: 'SIPP' }, { ticker: 'VWRP', value: 60000, wrapper: 'ISA' }] };
    const w2 = whereAmI(doc, { today: new Date(2028, 7, 1), holdings: h });
    expect(w2.saving).toMatchObject({ actualSource: 'holdings', pension: 400000, isa: 60000, actual: 460000, at: '2028-07' });
  });
  it('a path that counts no ISA is read on the pension alone', () => {
    const s0 = { ...saver, isaBalance: 0 };
    const p0 = buildSavingPath({ settings: s0, timing, accumulation: { ...accumulation, isaMonthly: 0 }, now: NOW, lives: 100 });
    const d0 = buildPlanDocument({ settings: s0, accumulation, now: NOW, savingPath: p0 });
    const r = saverReading(d0, { at: '2027-07', pension: 350000, isa: 80000 });
    expect(r.isaCounted).toBe(false);
    expect(r.actual).toBe(350000);
  });
  it('the reading never changes the stored document', () => {
    const before = bytes(doc);
    whereAmI(doc, { today: new Date(2030, 0, 1), accHistory: [{ date: '2029-12', sipp: 400000, isa: 70000, total: 470000 }] });
    expect(bytes(doc)).toBe(before);
  });
});

describe('the arrival check uses the reading\'s own measure', () => {
  const after = deriveStage({ stressTool: { settings: { ...saver, currentAgeAsOf: '2026-07-15' } }, decisionTool: { settings: { locked: true }, history: [], taxYears: {} } }, new Date(2038, 9, 10));
  it('the stage is past the stop', () => {
    expect(after.timingMode).toBe('future');
    expect(after.beforeStart).toBe(false);
  });
  it('version 3: pension + ISA exactly on the middle line at the stop is within; the ISA counts', () => {
    const timing = deriveTiming(saver, NOW);
    const path = buildSavingPath({ settings: saver, timing, accumulation, now: NOW, lives: 200 });
    const doc = buildPlanDocument({ settings: saver, accumulation, now: NOW, savingPath: path });
    const stop = path.path[12].nominal.middling, isa = path.path[12].isa.middling;
    const a = arrivalCheck(after, doc, { sipp: stop - isa, isa }, { at: '2038-10' });
    expect(a).toMatchObject({ measure: 'path-v3', within: true, expected: stop, actual: stop });
    expect(a.message).toMatch(/^Your pension and ISA come to £[\d,]+ against £[\d,]+ the locked path expects at the stop \(its middle line, in pounds of the day\) — within 10%\. The locked plan runs as it is\.$/);
    const noIsa = arrivalCheck(after, doc, { sipp: stop - isa }, { at: '2038-10' });
    expect(noIsa.actual).toBe(Math.round(stop - isa));
  });
  it('version 2: the pension in the path\'s prices against the path\'s line at the stop — on course is within, where it used to be 29% off', () => {
    const doc = oldDoc({ pots: { ...oldDoc().pots, potAtRetirement: { sipp: 600000, isa: 54000 } } });
    const months = (2038 * 12 + 10) - (2026 * 12 + 7);
    const pot = doc.accumulation.path[12].potMid * Math.pow(1.025, months / 12);
    const a = arrivalCheck(after, doc, { sipp: pot, isa: 60000 }, { at: '2038-10' });
    expect(a.measure).toBe('path-v2');
    expect(a.within).toBe(true);
    expect(a.ratio).toBeCloseTo(1, 6);
    expect(pot / 600000).toBeGreaterThan(1.25);   // the old check: the pot in the pounds of 2038 against a figure in 2026's — "+29%", unlock and re-plan
    expect(a.message).toMatch(/^Your pension pot is £[\d,]+, which is £[\d,]+ in the prices of July 2026, when the locked path was drawn \(prices assumed to rise 2\.5% a year, as the path does\), against £[\d,]+ the locked path expects at the stop — within 10%/);
  });
  it('no path: the pension at retirement the plan was priced on, the pot put into the prices of the day the document was written', () => {
    const doc = { createdAt: '2026-07-15T12:00:00.000Z', pots: { sipp: 500000, potAtRetirement: { sipp: 620000 } } };
    const months = (2038 * 12 + 10) - (2026 * 12 + 7);
    const a = arrivalCheck(after, doc, { sipp: 620000 * Math.pow(1.025, months / 12) }, { at: '2038-10' });
    expect(a).toMatchObject({ measure: 'priced', within: true });
    expect(a.message).toMatch(/when the plan document was written/);
    const off = arrivalCheck(after, doc, { sipp: 620000 }, { at: '2038-10' });
    expect(off.within).toBe(false);
    expect(off.message).toMatch(/unlock and re-plan/);
  });
  it('index.html passes the ISA box as it stands (a blank box is no figure) and the entry\'s month on the same line', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(src).toContain("arrivalCheck(stage, doc, { sipp: equity + bond + cash, isa: document.getElementById('entryIsa')?.value }, { at: dateStr })");
  });
});

describe('the lock and the refresh draw the new path; the reading helpers', () => {
  it('buildPlanDocumentNow hands the path in (index.html), so a refresh draws it again from that day', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const at = src.indexOf('async function buildPlanDocumentNow');
    expect(src.slice(at, at + 2500)).toContain('savingPath: await savingPathForLock({ settings, accumulation, holdings })');
  });
  it('saverPotOf: the latest record, else the pot for today, else What you hold', () => {
    expect(saverPotOf({ accHistory: [{ date: '2027-01', sipp: 1, isa: 2 }, { date: '2027-03', sipp: 3, isa: 4 }] })).toMatchObject({ source: 'record', at: '2027-03', pension: 3, isa: 4 });
    expect(saverPotOf({ accHistory: [{ date: '2027-03', total: 9 }] })).toMatchObject({ pension: 9, isa: null });
    expect(saverPotOf({ potsToday: 5, today: new Date(2027, 4, 2) })).toMatchObject({ source: 'today', at: '2027-05', pension: 5 });
    expect(saverPotOf({ holdingsPension: 7, holdingsIsa: 8, holdingsAsOf: '2027-02-03' })).toMatchObject({ source: 'holdings', at: '2027-02', pension: 7, isa: 8 });
    expect(saverPotOf({ today: new Date(2027, 4, 2) })).toMatchObject({ source: null, pension: null });
    expect(monthOf('2027-13')).toBeNull();
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Review of 6.22.0 (2 Oct 2026): a blank ISA box was saved as £0, so on a path that counts an ISA a saver whose pension was
// exactly on course read "below the locked path's 1-in-10 bad line", and the arrival check could offer to unlock and
// re-plan — the failure part (A) was meant to remove.
describe('a blank ISA box is no figure, not £0', () => {
  // the reviewers' plan: a £400,000 pension and an £80,000 ISA with £500 a month into it, "Mostly cash"
  const now = new Date('2026-10-02T10:00:00Z');
  const settings = { currentAge: 50, currentAgeAsOf: '2026-10-02', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 80000, isaGrowth: 'cash', chargesPct: 0.5, duration: 30 };
  const acc = { potNow: 400000, netMonthly: 800, employerMonthly: 300, salary: 60000, schemeType: 'ras', isaMonthly: 500, escalationPct: 0 };
  const timing = deriveTiming(settings, now);
  const path = buildSavingPath({ settings, timing, accumulation: acc, now, lives: 200 });
  const doc = buildPlanDocument({ settings, accumulation: acc, lockedAt: now.toISOString(), now, savingPath: path });
  const y1 = path.path[1];
  const recorded = new Date('2027-10-05T09:00:00Z');

  it('a box\'s figure: blank (or not a number) is null; a typed figure, £0 included, is the figure', () => {
    for (const v of [undefined, null, '', '  ', 'abc', NaN]) expect(figureOrNull(v), String(v)).toBeNull();
    expect([figureOrNull('0'), figureOrNull(0), figureOrNull(' 12000 '), figureOrNull(1.5)]).toEqual([0, 0, 12000, 1.5]);
  });
  it('the monthly record keeps a blank ISA box as no figure, and a typed £0 as £0 (marked as typed)', () => {
    expect(potRecordOf({ date: '2027-10', sipp: '442562', isa: '', gia: '' }, recorded)).toEqual({ date: '2027-10', sipp: 442562, isa: null, gia: 0, total: 442562, recordedAt: recorded.toISOString() });
    expect(potRecordOf({ date: '2027-10', sipp: '400000', isa: '0', gia: '' }, recorded)).toMatchObject({ isa: 0, isaEntered: true, total: 400000 });
    expect(potRecordOf({ date: '2027-10', sipp: '400000', isa: ' 12000 ', gia: '500' }, recorded)).toMatchObject({ isa: 12000, isaEntered: true, gia: 500, total: 412500 });
    expect(potRecordOf({ date: '2027-10', sipp: '', isa: '', gia: '' }, recorded)).toBeNull();
    expect(potRecordOf({ date: '2027-10', sipp: '0', isa: '0', gia: '0' }, recorded)).toBeNull();   // as before: one figure above £0 at least
  });
  it('a pension exactly on its middle line with the ISA box left blank: no verdict, it asks for the ISA — never "below the 1-in-10 bad line"', () => {
    const rec = potRecordOf({ date: '2027-10', sipp: String(y1.pension.middling), isa: '' }, recorded);
    const w = whereAmI(doc, { today: new Date(2027, 9, 20), accHistory: [rec] });
    expect(w.saving.missing).toEqual(['isa']);
    expect(w.saving.band).toBeNull();
    const t = plain(whereAmIHtml(w));
    expect(t).toMatch(/Add your ISA to the monthly record on the Accumulation tab to compare\./);
    expect(t).not.toMatch(/1-in-10 bad line/);
  });
  it('a record saved before 6.22.0 cannot tell a blank box from £0: its £0 is read as no ISA figure; a £0 typed from 6.22.0 is £0', () => {
    const old = { date: '2027-10', sipp: y1.pension.middling, isa: 0, gia: 0, total: y1.pension.middling, recordedAt: recorded.toISOString() };
    expect(saverPotOf({ accHistory: [old] })).toMatchObject({ source: 'record', pension: y1.pension.middling, isa: null });
    expect(whereAmI(doc, { today: new Date(2027, 9, 20), accHistory: [old] }).saving.missing).toEqual(['isa']);
    const typed = { ...old, isaEntered: true };
    expect(saverPotOf({ accHistory: [typed] }).isa).toBe(0);
    const w = whereAmI(doc, { today: new Date(2027, 9, 20), accHistory: [typed] });
    expect(w.saving.missing).toEqual([]);
    expect(w.saving.band).toBe('below p10');   // the ISA really is empty: the reading says so
    expect(saverPotOf({ accHistory: [{ ...old, isa: 25000 }] }).isa).toBe(25000);   // an older record's figure above £0 was typed
  });
  it('index.html records through potRecordOf, and its table shows no ISA figure (a blank box, or £0 saved before 6.22.0) as a dash', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const at = src.indexOf('window.recordAccumulationMonth = async function');
    const body = src.slice(at, at + 1400);
    expect(body).toContain("potRecordOf({ date, sipp: g('acRecSipp')?.value, isa: g('acRecIsa')?.value, gia: g('acRecGia')?.value })");
    expect(body).toContain('hist.push(rec)');
    expect(body).not.toMatch(/isa = \+g\('acRecIsa'\)/);
    expect(src).toContain("'</td><td>' + (recordIsaOf(r) == null ? '—' : gbp(r.isa)) + '</td><td>'");
    expect([recordIsaOf({ isa: null }), recordIsaOf({ isa: 0 }), recordIsaOf({ isa: 0, isaEntered: true }), recordIsaOf({ isa: 25000 }), recordIsaOf({})]).toEqual([null, null, 0, 25000, null]);
  });
  it('the arrival check with no ISA figure (a blank box, or the Decision box left at £0) on a path that counts one: the pension against the path\'s own pension line', () => {
    const after = deriveStage({ stressTool: { settings }, decisionTool: { settings: { locked: true }, history: [], taxYears: {} } }, new Date(2036, 11, 10));
    expect(after.beforeStart).toBe(false);
    const stop = path.path[path.path.length - 1];
    for (const isa of [undefined, null, '', '0', 0]) {
      const a = arrivalCheck(after, doc, { sipp: stop.pension.middling, isa }, { at: '2036-10' });
      expect(a, String(isa)).toMatchObject({ measure: 'path-v3-pension', within: true, expected: stop.pension.middling, actual: stop.pension.middling });
      expect(a.message).toBe('Your pension pot is £' + stop.pension.middling.toLocaleString('en-GB') + ' against £' + stop.pension.middling.toLocaleString('en-GB')
        + ' the locked path expects in your pension at the stop (its middle line, in pounds of the day). No ISA figure was entered with this month, so your ISA is left out — within 10%. The locked plan runs as it is.');
    }
    // an ISA entered: pension and ISA against the whole path, as before
    const both = arrivalCheck(after, doc, { sipp: stop.nominal.middling - stop.isa.middling, isa: String(stop.isa.middling) }, { at: '2036-10' });
    expect(both).toMatchObject({ measure: 'path-v3', within: true, expected: stop.nominal.middling });
    // a pension well short is still caught
    expect(arrivalCheck(after, doc, { sipp: stop.pension.middling * 0.7, isa: '' }, { at: '2036-10' }).within).toBe(false);
  });
});

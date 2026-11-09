/**
 * 7.6.0 review fixes for "This is what I hold, and I'm keeping it". Fictional plans only (the corpus' "Sam's plan", with
 * made-up lines; the gilts named are from the bundled public gilt list, never anyone's holdings).
 *   - a conventional gilt pasted or typed with a guessed code (T27/T28/T29 are index-linked codes) is read by its own name
 *   - a running year's stand-in is charged only the months still to come
 *   - typed index-linked names without the word "index" match their rung as before
 *   - a fixed pay is set against the need in today's money; two lines with one name are read apart
 *   - "covered" is never said while money is still to buy; the record's date is not moved by a keep
 *   - the move's cash table and its share held agree with the keeps; "Keep this" suggests the year a gilt matures in
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { targetHoldings, diffHoldings, standInPays, yearNeedsOf, giltOfLine, conventionalEvidence, inTodaysMoney, standInYearOf, monthsLeftInTaxYear } from '../src/services/TransitionPlanner.js';
import { giltOfName, couponOfName, maturityOfName, ilWords } from '../src/services/GiltName.js';
import { normaliseHoldings, holdingsWith } from '../src/services/HoldingsRecord.js';
import { parsePaste, applyPaste } from '../src/services/HoldingsPaste.js';
import { gapsOf, gapSentences, sayGapLine } from '../src/answers/plan/gaps.js';
import { holdOf } from '../src/answers/plan/hold.js';
import { moveOf } from '../src/answers/plan/move.js';
import { keepOfChoice } from '../src/ui/keepHoldingsUi.js';
import { transitionHtml } from '../src/ui/components/TransitionView.js';
import { moveInputs } from '../src/services/PlanReading.js';
import { GAPS } from '../src/v7/copy/gaps.js';

const FIX = join(import.meta.dirname, 'fixtures', 'plans');
const sam = () => { const p = JSON.parse(readFileSync(join(FIX, '20-locked-start-after-stop.json'), 'utf8')); p.id = 'SamKeeps02'; return p; };
const noon = (iso) => new Date(iso + 'T12:00:00');
const BEFORE = '2026-11-09';
const RUNNING = '2027-11-09';
const conv = (year, units, keep) => ({ wrapper: 'SIPP', ticker: null, name: 'Example Treasury Gilt ' + year, kind: 'gilt', units, value: units * 0.98, ...(keep ? { keep } : {}) });
const cash = (value) => ({ wrapper: 'SIPP', ticker: 'XSTR', name: 'Money-market fund', units: null, value });
const withLines = (plan, lines, expected) => ({ ...plan, holdings: { ...normaliseHoldings({ lines, updatedAt: '2026-11-01', source: 'typed' }), ...(expected ? { expected } : {}) } });
const words = (g) => gapSentences(g).map((l) => sayGapLine(l, GAPS));

describe('a gilt read by its own name', () => {
  it('reads coupons and maturity dates as platforms write them', () => {
    expect(couponOfName('Treasury 4.25% 07/12/2027')).toBe(4.25);
    expect(couponOfName('4 1/8% Treasury Gilt 2029')).toBe(4.125);
    expect(couponOfName('0 1/8% Index-linked Treasury Gilt 2029')).toBe(0.125);
    expect(couponOfName('4¼% Treasury Gilt 2027')).toBe(4.25);
    expect(couponOfName('Example Treasury Gilt 2027')).toBe(null);
    expect(maturityOfName('Treasury 4.25% 07/12/2027')).toBe('2027-12-07');
    expect(maturityOfName('UK Treasury 4.5% 7 Jun 2028')).toBe('2028-06-07');
    expect(maturityOfName('Gilt 2029-07-22')).toBe('2029-07-22');
    expect(ilWords('Treasury 0.125% 2029 Idx-Lkd')).toBe(true);
    expect(ilWords('TREASURY 0 1/8% I-L GILT 2029')).toBe(true);
    expect(ilWords('Treasury 4.25% 07/12/2027')).toBe(false);
  });
  it('names the bundled gilt only when exactly one fits', () => {
    expect(giltOfName('Treasury 4.25% 07/12/2027')).toMatchObject({ tidm: 'TR27', type: 'conventional' });
    expect(giltOfName('UK Treasury Gilt 0.125% 22/03/2029')).toMatchObject({ tidm: 'T29' });
    expect(giltOfName('4% Treasury Gilt 2029')).toMatchObject({ tidm: 'T29K', type: 'conventional' });
    // two gilts of 2027 pay 1¼%: one conventional, one index-linked — the name alone cannot tell, unless it says IL
    expect(giltOfName('Treasury 1.25% 2027')).toBe(null);
    expect(giltOfName('Treasury 1.25% IL 2027')).toMatchObject({ tidm: 'T27' });
  });
  it('a guessed code its name contradicts is not the line\'s gilt: a conventional gilt under "T29" is still conventional', () => {
    const line = { wrapper: 'SIPP', ticker: 'T29', name: 'Treasury 4.125% 22/07/2029', kind: 'gilt', subClass: 'longGilts', units: 20000, value: 19700 };
    expect(giltOfLine(line)).toMatchObject({ tidm: 'TS29', type: 'conventional' });
    expect(conventionalEvidence(line)).toBe(true);
    const p = standInPays(line, { today: noon(BEFORE) });
    expect(p).toMatchObject({ payKind: 'conventional', fixed: true, matures: '2029-07-22', nominal: 20000 });
    expect(p.amount).toBeLessThan(20000 * 1.15);   // its nominal and coupons, never 20,000 × an index ratio
  });
});

describe('pasting conventional gilts whose year an index-linked rung shares', () => {
  const plan = sam();
  const orders = plan.planDocument.strategy.r.plan.orders;
  const text = 'Name,Units,Value\nTreasury 4.25% 07/12/2027,20000,19950\nTreasury 4.5% 07/06/2028,20000,19930\nTreasury 4.125% 22/07/2029,15000,14760\n';
  const rec = applyPaste(normaliseHoldings({ lines: [], source: 'none' }), parsePaste(text).rows, {}, 'SIPP', { today: BEFORE, orders }).record;

  it('takes each gilt\'s own code and name, never the plan\'s index-linked gilt of that year', () => {
    expect(rec.lines.map((l) => [l.ticker, l.name, l.subClass])).toEqual([
      ['TR27', 'Treasury 4.25% 07/12/2027', 'longGilts'],
      ['TS28', 'Treasury 4.5% 07/06/2028', 'longGilts'],
      ['TS29', 'Treasury 4.125% 22/07/2029', 'longGilts']
    ]);
  });
  it('kept for their years, each pays a fixed amount and is said so', () => {
    let r = rec;
    [2027, 2028, 2029].forEach((Y, i) => { r = holdingsWith(r, { kind: 'keep', index: i, keep: { as: 'rung', taxYears: [Y] } }, { today: BEFORE }); });
    const g = gapsOf({ ...plan, holdings: r }, { today: BEFORE });
    expect(g.standIns.map((s) => [s.payKind, s.fixed])).toEqual([['conventional', true], ['conventional', true], ['conventional', true]]);
    for (const s of g.standIns) expect(s.real).toBeLessThan(s.pays);
    expect(words(g).filter((t) => /pays a fixed .*does not rise with prices/.test(t))).toHaveLength(3);
    expect(g.totalGap).toBeGreaterThan(25000);
  });
  it('not kept, the 2029 one never takes the index-linked rung\'s units', () => {
    const target = targetHoldings(plan.planDocument, { today: noon(BEFORE) });
    const d = diffHoldings(rec.lines, target);
    expect(d.hold.filter((h) => h.ticker === 'T29')).toEqual([]);
    expect(d.buy.find((b) => b.ticker === 'T29').heldUnits).toBe(0);
    // even under the guessed code an older paste gave it
    const guessed = diffHoldings([{ wrapper: 'SIPP', ticker: 'T29', name: 'Treasury 4.125% 22/07/2029', kind: 'gilt', subClass: 'longGilts', units: 20000, value: 19700 }], target);
    expect(guessed.buy.find((b) => b.ticker === 'T29').heldUnits).toBe(0);
    expect(guessed.sell.map((s) => s.label)).toEqual(['Treasury 4.125% 22/07/2029']);
  });
});

describe('identity: typed index-linked names without the word "index" still match their rung', () => {
  const target = targetHoldings(sam().planDocument, { today: noon(BEFORE) });
  it.each(['Treasury 0.125% 2029 Idx-Lkd', 'UK Treasury Gilt 0.125% 22/03/2029', 'TREASURY 0 1/8% I-L GILT 2029', 'Treasury 0.125% Index-Linked 2029', 'Treasury Gilt 2029'])('%s', (name) => {
    const d = diffHoldings([{ wrapper: 'SIPP', ticker: '', name, kind: 'gilt', units: 37500, value: 66000 }], target);
    expect(d.sell).toEqual([]);
    expect(d.hold.map((h) => h.key)).toContain('gilt:T29');
  });
});

describe('a running year, and two lines with one name', () => {
  it('while the plan runs, a stand-in covering this year is charged only the months still to come; the rest carries on', () => {
    const p = withLines(sam(), [conv(2028, 50000, { as: 'rung', taxYears: [2027, 2028] })]);
    const needs = yearNeedsOf(p.planDocument);
    const m = moveInputs(p, { now: noon(RUNNING) });
    const s = m.diff.standIn[0];
    expect(monthsLeftInTaxYear(noon(RUNNING))).toBe(5);
    expect(s.perYear[0]).toMatchObject({ Y: 2027, need: Math.round(needs[2027].need * 5 / 12), gap: 0 });
    expect(s.perYear[1]).toMatchObject({ Y: 2028, gap: 0 });
    const g = gapsOf(p, { today: RUNNING });
    expect(g.totalGap).toBe(0);
    expect(g.firstGap).toBe(null);
  });
  it('two kept lines named alike are each read for their own years', () => {
    const line = (units, Y) => ({ wrapper: 'SIPP', ticker: null, name: 'Example Treasury Gilt', kind: 'gilt', units, value: units, keep: { as: 'rung', taxYears: [Y] } });
    const p = withLines(sam(), [line(30000, 2027), line(10000, 2028)]);
    const g = gapsOf(p, { today: BEFORE });
    const r27 = g.rows.find((r) => r.Y === 2027), r28 = g.rows.find((r) => r.Y === 2028);
    expect(r27.standIns).toHaveLength(1);
    expect(r27.held).toBe(standInPays(line(30000, 2027), { today: noon(BEFORE), from: 2027 }).real);
    expect(r28.held).toBe(standInPays(line(10000, 2028), { today: noon(BEFORE), from: 2028 }).real);
  });
});

describe('a fixed pay in today\'s money', () => {
  it('is less the further off it is paid; today it is itself', () => {
    const today = noon(BEFORE);
    expect(inTodaysMoney(10000, today, today)).toBe(10000);
    const one = inTodaysMoney(10000, noon('2027-11-09'), today), three = inTodaysMoney(10000, noon('2029-11-09'), today);
    expect(one).toBeLessThan(10000);
    expect(three).toBeLessThan(one);
    expect(three).toBeGreaterThan(8000);
  });
  it('what a stand-in pays beyond its years is said, and counted as cash for the years after', () => {
    const p = withLines(sam(), [conv(2027, 50000, { as: 'rung', taxYears: [2027] })]);
    const g = gapsOf(p, { today: BEFORE });
    expect(g.standIns[0].spare).toBeGreaterThan(0);
    expect(words(g).some((t) => t.startsWith('Example Treasury Gilt 2027 pays £') && t.includes('more than the years it stands in for need'))).toBe(true);
    expect(g.rows.find((r) => r.Y === 2028).cash).toBe(Math.min(g.standIns[0].spare, Math.round(yearNeedsOf(p.planDocument)[2028].need)));
  });
});

describe('the words', () => {
  it('"covered" is never said while money is still to buy', () => {
    const p = withLines(sam(), [conv(2027, 36000, { as: 'rung', taxYears: [2027] }), cash(1000)]);
    const g = gapsOf(p, { today: BEFORE });
    expect(g.firstGap).toBe(null);
    expect(g.toBuy).toBeGreaterThan(0);
    const w = words(g);
    expect(w.some((t) => t.startsWith('Every year to 2028/29 is covered once the plan’s buys are made: £'))).toBe(true);
    expect(w).not.toContain('Every year to 2028/29 is covered by what you hold.');
  });
  it('the strategy line leaves out a clause with nothing in it', () => {
    const one = words(gapsOf(withLines(sam(), [conv(2027, 20000, { as: 'rung', taxYears: [2027] })]), { today: BEFORE }));
    expect(one[0]).toBe('Your ladder, with 1 year held another way.');
    const kept = words(gapsOf(withLines(sam(), [{ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', value: 9000, keep: { as: 'mine', fundsGaps: false } }, { wrapper: 'SIPP', ticker: 'EXMP2', name: 'Example Fund', value: 4000, keep: { as: 'mine', fundsGaps: false } }]), { today: BEFORE }));
    expect(kept[0]).toBe('Your ladder, with 2 investments you keep by choice.');
  });
  it('a keep or money expected leaves the record\'s "as of" date where it was', () => {
    const rec = normaliseHoldings({ lines: [conv(2027, 20000)], updatedAt: '2026-01-01', source: 'typed' });
    expect(holdingsWith(rec, { kind: 'keep', index: 0, keep: { as: 'mine' } }, { today: BEFORE }).updatedAt).toBe('2026-01-01');
    expect(holdingsWith(rec, { kind: 'keep', index: 0, keep: null }, { today: BEFORE }).updatedAt).toBe('2026-01-01');
    expect(holdingsWith(rec, { kind: 'expected', op: 'add', item: { amount: 5000 } }, { today: BEFORE }).updatedAt).toBe('2026-01-01');
    // a value typed still moves it
    expect(holdingsWith(rec, { kind: 'edit', index: 0, field: 'value', value: '19000' }, { today: BEFORE }).updatedAt).toBe(BEFORE);
  });
});

describe('the move with keeps', () => {
  const lines = [conv(2027, 20000, { as: 'rung', taxYears: [2027] }), conv(2028, 20000, { as: 'rung', taxYears: [2028] }), conv(2029, 20000, { as: 'rung', taxYears: [2029] }), cash(40000)];
  it('the cash to hold leaves out the cash years kept lines stand in for, and says them as held another way', () => {
    const p = withLines(sam(), lines);
    const m = moveOf([{ plan: p }], p.id, { today: BEFORE });
    expect(m.cash.rows.map((r) => r.id)).toEqual(['cashYearCovered', 'cashYearCovered']);
    expect(m.cash.target).toBe('£0');
    expect(m.cash.short).toBe(null);
    expect(m.cash.spare).toBe('£40,000');
    // the pension's cash is still listed as held, all of it spare
    expect(m.hold.find((h) => h.key === 'cash:SIPP')).toMatchObject({ spare: '£40,000' });
    const mi = moveInputs(p, { now: noon(BEFORE) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings });
    expect(html).toContain('Cash year 2027/28: held another way, by what you keep');
  });
  it('keeping lines never lowers the share of the plan\'s mix held', () => {
    const before = withLines(sam(), lines.map(({ keep, ...l }) => l));
    const after = withLines(sam(), lines);
    const a = moveInputs(before, { now: noon(BEFORE) }).diff.progressPct, b = moveInputs(after, { now: noon(BEFORE) }).diff.progressPct;
    expect(b).toBeGreaterThanOrEqual(a);
    expect(b).toBeGreaterThan(0);
  });
});

describe('"Keep this" suggests the year a gilt matures in', () => {
  it('V7: a gilt is "stands in" with its year ticked, ready to keep; nothing is said wrong before anything is touched', () => {
    const p = withLines(sam(), [{ wrapper: 'SIPP', ticker: 'TS28', name: 'Treasury 4.5% 07/06/2028', kind: 'gilt', units: 20000, value: 19930 }, { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', value: 9000 }]);
    const v = holdOf([{ plan: p }], p.id, { today: BEFORE, typed: { 'keep.index': '0' } });
    const l0 = v.groups[0].lines.find((l) => l.index === 0), l1 = v.groups[0].lines.find((l) => l.index === 1);
    expect(l0.keep).toMatchObject({ as: 'rung', error: null, change: { kind: 'keep', index: 0, keep: { as: 'rung', taxYears: [2028] } } });
    expect(l1.keep).toMatchObject({ as: 'mine', error: null, change: { kind: 'keep', index: 1, keep: { as: 'mine', fundsGaps: false } } });
    expect(standInYearOf({ name: 'Example Fund 2040', value: 1 }, [2040])).toBe(null);
  });
  it('the classic planner saves a year the plan has, never this tax year by default', () => {
    expect(keepOfChoice('rung', null, 2028)).toEqual({ as: 'rung', taxYears: [2028] });
    expect(keepOfChoice('rung', { as: 'rung', taxYears: [2029] }, 2028)).toEqual({ as: 'rung', taxYears: [2029] });
    expect(keepOfChoice('rung', null, 0)).toEqual({ wait: true });
    const p = withLines(sam(), [{ wrapper: 'SIPP', ticker: 'TR27', name: 'Treasury 4.25% 07/12/2027', kind: 'gilt', units: 20000, value: 19950 }]);
    const mi = moveInputs(p, { now: noon(BEFORE) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings });
    expect(html).toContain('keepHolding(0,this.value,2027)');
    expect(html).toContain('aria-label="Keep this"');
  });
});

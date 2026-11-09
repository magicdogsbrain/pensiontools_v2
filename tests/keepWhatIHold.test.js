/**
 * 7.6.0 — "This is what I hold, and I'm keeping it": a line kept to stand in for some tax years (a conventional gilt in place
 * of a rung or a cash year), a line kept by choice (never a sell), and money expected later; the gaps reader that says what
 * that means year by year; and the identity of every plan that keeps nothing. Fictional plans only (the corpus' "Sam's plan",
 * with made-up lines).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { targetHoldings, diffHoldings, sequence, standInPays, yearNeedsOf, giltOfLine } from '../src/services/TransitionPlanner.js';
import { normaliseHoldings, normaliseKeep, normaliseExpected, holdingsWith, hasKeeps, stampHoldings } from '../src/services/HoldingsRecord.js';
import { moveInputs } from '../src/services/PlanReading.js';
import { gapsOf, gapSentences, sayGapLine, gapsView, monthsLeftInTaxYear, gapHeadline } from '../src/answers/plan/gaps.js';
import { holdPatch, holdOf } from '../src/answers/plan/hold.js';
import { moveOf } from '../src/answers/plan/move.js';
import { orderSheetRows } from '../src/strategies/GiltLadderPlan.js';
import { GAPS } from '../src/v7/copy/gaps.js';
import { BANNED } from '../src/v7/copy/banned.js';
import { transitionHtml } from '../src/ui/components/TransitionView.js';

const REPO = join(import.meta.dirname, '..');
const FIX = join(REPO, 'tests', 'fixtures', 'plans');
const fixture = (name) => JSON.parse(readFileSync(join(FIX, name), 'utf8'));
/** "Sam's plan": a locked index-linked ladder starting 2027/28, cash years 2027/28 and 2028/29, rung T29 for 2029/30–2031/32. */
const sam = () => { const p = fixture('20-locked-start-after-stop.json'); p.id = 'SamKeeps01'; return p; };
const noon = (iso) => new Date(iso + 'T12:00:00');
const BEFORE = '2026-11-09';   // the plan starts in April 2027
const RUNNING = '2027-11-09';  // November of the plan's first year: five months to come

// made-up conventional gilts, named so they are not in the bundled list: they pay their nominal, nothing more
const conv = (year, units) => ({ wrapper: 'SIPP', ticker: null, name: 'Example Treasury Gilt ' + year, kind: 'gilt', units, value: units * 0.98 });
const shares = { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 15000 };
const cash = (value) => ({ wrapper: 'SIPP', ticker: 'XSTR', name: 'Money-market fund', units: null, value });
const withLines = (plan, lines, expected) => ({ ...plan, holdings: { ...normaliseHoldings({ lines, updatedAt: '2026-11-01', source: 'typed' }), ...(expected ? { expected } : {}) } });

describe('the record: keep and expected', () => {
  it('normalises a keep: stand-in years sorted and unique, by choice with its gaps box; anything else is no keep', () => {
    expect(normaliseKeep({ as: 'rung', taxYears: [2029, '2027', 2027, 'x', 1999] })).toEqual({ as: 'rung', taxYears: [2027, 2029] });
    expect(normaliseKeep({ as: 'rung', taxYears: [] })).toBe(null);
    expect(normaliseKeep({ as: 'mine' })).toEqual({ as: 'mine', fundsGaps: false });
    expect(normaliseKeep({ as: 'mine', fundsGaps: true })).toEqual({ as: 'mine', fundsGaps: true });
    expect(normaliseKeep({ as: 'sell' })).toBe(null);
    expect(normaliseKeep(null)).toBe(null);
  });
  it('normalises money expected: an amount above nothing, a month or none, an id each; no amount is dropped', () => {
    expect(normaliseExpected([{ label: ' Pension elsewhere ', amount: '£40,000', by: '2027-03-15', wrapper: 'pension' }, { amount: 0 }, { id: 'x', amount: 5, by: 'soon' }]))
      .toEqual([{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 40000, by: '2027-03' }, { id: 'x', label: null, wrapper: 'SIPP', amount: 5, by: null }]);
  });
  it('a record with no keeps and nothing expected is exactly what it was before (no new keys)', () => {
    for (const f of readdirSync(FIX).filter((x) => x.endsWith('.json'))) {
      const p = fixture(f);
      const rec = normaliseHoldings(p.holdings);
      expect(Object.keys(rec), f).toEqual(['version', 'updatedAt', 'source', 'offerDismissed', 'lines']);
      for (const l of rec.lines) expect(Object.keys(l), f).not.toContain('keep');
      expect(hasKeeps(rec), f).toBe(false);
    }
  });
  it('holdingsWith keeps, changes and clears a keep, and adds, edits and removes money expected — the lines and the rest untouched', () => {
    const rec = normaliseHoldings({ lines: [conv(2027, 20000), shares], source: 'paste', updatedAt: '2026-10-01' });
    const a = holdingsWith(rec, { kind: 'keep', index: 0, keep: { as: 'rung', taxYears: [2027] } }, { today: '2026-11-09' });
    expect(a.lines[0].keep).toEqual({ as: 'rung', taxYears: [2027] });
    expect(a.source).toBe('paste');
    expect(a.updatedAt).toBe('2026-11-09');
    const b = holdingsWith(a, { kind: 'keep', index: 0, keep: null }, { today: '2026-11-09' });
    expect(b.lines[0]).toEqual(normaliseHoldings(rec).lines[0]);
    expect(() => holdingsWith(a, { kind: 'keep', index: 0, keep: { as: 'nonsense' } }, { today: '2026-11-09' })).toThrow();
    const c = holdingsWith(a, { kind: 'expected', op: 'add', item: { label: 'Pension elsewhere', amount: 40000, by: '2027-03' } }, { today: '2026-11-09' });
    expect(c.expected).toEqual([{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 40000, by: '2027-03' }]);
    const d = holdingsWith(c, { kind: 'expected', op: 'edit', id: 'e1', item: { by: '2027-06' } }, { today: '2026-11-09' });
    expect(d.expected[0]).toMatchObject({ amount: 40000, by: '2027-06' });
    const e = holdingsWith(d, { kind: 'expected', op: 'remove', id: 'e1' }, { today: '2026-11-09' });
    expect(e).not.toHaveProperty('expected');
    expect(e.lines).toEqual(a.lines);
    // a paste keeps the keep: the line it updates is the same line
    expect(stampHoldings(a, '2026-11-09').lines[0].keep).toEqual({ as: 'rung', taxYears: [2027] });
  });
});

describe('what a stand-in pays', () => {
  it('a conventional gilt pays its nominal (plus coupons from the bundled list): fixed, never priced as index-linked', () => {
    const p = standInPays({ name: 'Example Treasury Gilt 2028', kind: 'gilt', units: 20000, value: 19600 }, { today: noon(BEFORE) });
    expect(p).toMatchObject({ amount: 20000, payKind: 'conventional', fixed: true, nominal: 20000 });
    const listed = { ticker: 'TS28', name: '', kind: 'gilt', units: 10000, value: 9964 };
    const g = giltOfLine(listed);
    if (g && g.type === 'conventional') {
      const q = standInPays(listed, { today: noon(BEFORE) });
      expect(q.fixed).toBe(true);
      expect(q.amount).toBeGreaterThanOrEqual(10000);
      expect(q.amount).toBeLessThan(10000 * (1 + g.coupon / 100 * 3));   // a few coupons at most, never an index ratio
    }
  });
  it('an index-linked gilt pays its nominal times its index ratio; anything else its value', () => {
    expect(standInPays({ name: 'Example fund', value: 12345 }, {})).toMatchObject({ amount: 12345, payKind: 'value', fixed: false });
    expect(standInPays({ name: 'Index-linked Treasury 2099 (example)', kind: 'gilt', units: 1000, value: 1500 }, {})).toMatchObject({ amount: 1500, fixed: false });
  });
});

describe('the diff with keeps', () => {
  const plan = sam();
  const doc = plan.planDocument;
  const target = targetHoldings(doc, { today: noon(BEFORE) });
  const needs = yearNeedsOf(doc);
  const lines0 = [conv(2027, 20000), conv(2028, 20000), conv(2029, 20000), cash(5000)];

  it('three conventional gilts standing in for three near years at less than they need: no buy, no sell for those years, a gap per year', () => {
    const lines = lines0.map((l, i) => (i < 3 ? { ...l, keep: { as: 'rung', taxYears: [2027 + i] } } : l));
    const d = diffHoldings(lines, target, { needs, today: noon(BEFORE) });
    expect(d.sell.map((s) => s.label)).toEqual([]);
    expect(d.standIn.map((s) => s.taxYears)).toEqual([[2027], [2028], [2029]]);
    for (const s of d.standIn) {
      expect(s.fixed).toBe(true);
      expect(s.perYear).toHaveLength(1);
      const y = s.perYear[0];
      expect(y.need).toBe(Math.round(needs[y.Y].need));
      expect(y.pays).toBe(20000);
      expect(y.gap).toBe(Math.round(needs[y.Y].need) - 20000);
    }
    // the cash years are stood in for: no cash to buy for them; the 2029 rung keeps only its other years
    expect(d.covered.find((c) => c.kind === 'cash').taxYears).toEqual([2027, 2028]);
    expect(d.buy.find((b) => b.kind === 'cash')).toBeUndefined();
    const t29 = d.buy.find((b) => b.ticker === 'T29');
    expect(t29.taxYears).toEqual([2030, 2031]);
    const full = target.lines.find((t) => t.ticker === 'T29');
    expect(t29.units).toBeLessThan(full.units);
    expect(d.covered.find((c) => c.key === full.key + ':part').taxYears).toEqual([2029]);
  });

  it('a line kept by choice is never a sell; it is listed as kept by you with its value', () => {
    const d0 = diffHoldings([shares], target, { needs, today: noon(BEFORE) });
    expect(d0.sell.map((s) => s.label)).toContain('Example Shares plc');
    const d = diffHoldings([{ ...shares, keep: { as: 'mine', fundsGaps: true } }], target, { needs, today: noon(BEFORE) });
    expect(d.sell).toEqual([]);
    expect(d.kept).toEqual([expect.objectContaining({ label: 'Example Shares plc', value: 15000, fundsGaps: true, why: 'kept by you' })]);
    expect(d.standIn).toEqual([]);
  });

  it('both together, every rung covered or held: complete, and the reason says what was kept', () => {
    const rungs = target.lines.map((t) => ({ wrapper: 'SIPP', ticker: t.ticker, name: t.label, units: t.units, value: t.cost }));
    const lines = [...rungs, { ...conv(2027, 34000), keep: { as: 'rung', taxYears: [2027] } }, { ...conv(2028, 34000), keep: { as: 'rung', taxYears: [2028] } }, { ...shares, keep: { as: 'mine', fundsGaps: false } }];
    const d = diffHoldings(lines, target, { needs, today: noon(BEFORE) });
    expect(d.buy).toEqual([]);
    expect(d.sell).toEqual([]);
    expect(d.complete).toBe(true);
    expect(d.reason).toMatch(/^every rung is held or covered by what you chose to keep/);
    expect(d.progressPct).toBe(100);
  });

  it('a keep cleared again diffs exactly as a record that never kept it', () => {
    const rec = normaliseHoldings({ lines: [...lines0, shares] });
    const kept = holdingsWith(rec, { kind: 'keep', index: 4, keep: { as: 'mine' } }, { today: BEFORE });
    const cleared = holdingsWith(kept, { kind: 'keep', index: 4, keep: null }, { today: BEFORE });
    expect(diffHoldings(cleared.lines, target, { needs, today: noon(BEFORE) })).toEqual(diffHoldings(rec.lines, target));
  });

  it('a conventional gilt is never matched to an index-linked rung by its year alone', () => {
    const d = diffHoldings([{ wrapper: 'SIPP', ticker: null, name: '4% Treasury Gilt 2029', kind: 'gilt', units: 50000, value: 49000 }], target);
    expect(d.hold.filter((h) => h.ticker === 'T29')).toEqual([]);
    expect(d.sell.map((s) => s.label)).toEqual(['4% Treasury Gilt 2029']);
  });

  it('the order sheet says a rung held another way', () => {
    const lines = [{ ...conv(2029, 20000), keep: { as: 'rung', taxYears: [2029, 2030, 2031] } }];
    const rows = orderSheetRows(doc, lines, { today: noon(BEFORE) });
    expect(rows.find((r) => r.tidm === 'T29').bought).toBe('covered');
  });
});

describe('the gaps reader', () => {
  const base = sam();
  const keptLines = [{ ...conv(2027, 20000), keep: { as: 'rung', taxYears: [2027] } }, { ...conv(2028, 20000), keep: { as: 'rung', taxYears: [2028] } }, cash(5000), { ...shares, keep: { as: 'mine', fundsGaps: true } }];

  it('months still to come in a tax year, this one included', () => {
    expect(monthsLeftInTaxYear('2027-11-09')).toBe(5);
    expect(monthsLeftInTaxYear('2027-04-06')).toBe(12);
    expect(monthsLeftInTaxYear('2027-04-05')).toBe(1);
    expect(monthsLeftInTaxYear('2028-01-15')).toBe(3);
    expect(monthsLeftInTaxYear('2028-03-31')).toBe(1);
  });

  it('nothing kept, nothing expected: no reading at all', () => {
    expect(gapsOf(base, { today: BEFORE })).toBe(null);
  });

  it('before the plan starts: each stood-in year needs, holds (the stand-in, then the pension\'s cash) and its gap; the first year\'s money lasts until about the month it covers', () => {
    const p = withLines(base, keptLines);
    const g = gapsOf(p, { today: BEFORE });
    const needs = yearNeedsOf(p.planDocument);
    expect(g.rows.map((r) => r.Y)).toEqual([2027, 2028]);
    const [r27, r28] = g.rows;
    expect(r27).toMatchObject({ source: 'standIn', need: Math.round(needs[2027].need), cash: 5000, held: 25000, gap: Math.round(needs[2027].need) - 25000 });
    expect(r28).toMatchObject({ source: 'standIn', held: 20000, gap: Math.round(needs[2028].need) - 20000 });
    const monthly = needs[2027].need / 12;
    const months = Math.floor((25000 + 0.5) / monthly);
    const last = new Date(Date.UTC(2027, 3 + months - 1, 1));
    expect(g.firstGap).toMatchObject({ Y: 2027, lastMonth: last.getUTCFullYear() + '-' + String(last.getUTCMonth() + 1).padStart(2, '0') });
    expect(g.totalGap).toBe(r27.gap + r28.gap);
    expect(g.fundsGaps.total).toBe(15000);
    expect(g.withAll).toEqual({ covered: false, short: g.totalGap - 15000 });
    expect(gapHeadline(g)).toMatchObject({ Y: 2027, year: '2027/28' });
  });

  it('money expected later: covered with it, or short; said late when it is expected after the money runs short', () => {
    const early = withLines(base, keptLines, [{ id: 'e1', label: 'Pension elsewhere', amount: 60000, by: '2027-05' }]);
    const g1 = gapsOf(early, { today: BEFORE });
    expect(g1.withExpected).toEqual({ covered: true, short: 0 });
    expect(g1.expected.late).toEqual([]);
    const late = withLines(base, keptLines, [{ id: 'e1', label: 'Pension elsewhere', amount: 10000, by: '2028-06' }]);
    const g2 = gapsOf(late, { today: BEFORE });
    expect(g2.withExpected).toEqual({ covered: false, short: g2.totalGap - 10000 });
    expect(g2.expected.late).toEqual(['e1']);
    const words = gapSentences(g2).map((l) => sayGapLine(l, GAPS));
    expect(words.some((t) => t.startsWith('Without the money you expect, 2027/28’s money lasts until about '))).toBe(true);
    expect(words).toContain('Pension elsewhere is expected by June 2028, after the money runs short in ' + words.find((t) => t.includes('runs short in')).split('runs short in ')[1].replace(/\.$/, '') + '.');
    expect(words).toContain('Example Treasury Gilt 2027 pays a fixed £20,000; it does not rise with prices.');
    expect(words).toContain(GAPS.canFall);
    expect(words[0]).toBe('Your ladder, with 2 years held another way and 1 line you keep by choice.');
  });

  it('while the plan runs: this year counts the months still to come at the plan\'s monthly figure, less what is held', () => {
    const p = withLines(base, [cash(10000), { ...shares, keep: { as: 'mine', fundsGaps: true } }], [{ id: 'e1', label: 'Pension elsewhere', amount: 50000, by: '2028-02' }]);
    const g = gapsOf(p, { today: RUNNING });
    const needs = yearNeedsOf(p.planDocument);
    const r = g.rows[0];
    expect(r).toMatchObject({ Y: 2027, thisYear: true, monthsLeft: 5, need: Math.round(needs[2027].need * 5 / 12), cash: 10000 });
    expect(r.gap).toBe(Math.round(needs[2027].need * 5 / 12) - 10000);
    const months = Math.floor((10000 + 0.5) / (needs[2027].need / 12));
    const lastM = 11 + months - 1;
    expect(g.firstGap.lastMonth).toBe(lastM <= 12 ? '2027-' + String(lastM).padStart(2, '0') : '2028-' + String(lastM - 12).padStart(2, '0'));
  });

  it('every sentence and every word of the gaps is free of advice and of the banned words', () => {
    const p = withLines(base, keptLines, [{ id: 'e1', label: 'Pension elsewhere', amount: 10000, by: '2028-06' }]);
    const words = [...gapSentences(gapsOf(p, { today: BEFORE })).map((l) => sayGapLine(l, GAPS))];
    const flat = (o) => (typeof o === 'string' ? [o] : Object.values(o).flatMap(flat));
    for (const t of [...words, ...flat(GAPS).map((x) => x.replace(/\{\w+\}/g, 'two'))]) for (const b of BANNED.filter((x) => ['all', 'planner', 'record', 'result'].includes(x.scope))) {
      if (b.kind === 'explain') continue;
      const hit = b.re.test(t) && !(b.allow || []).some((a) => a.test(t));
      expect(hit, `"${t}" uses ${b.id}`).toBe(false);
    }
  });
});

describe('both apps: the writes and the views', () => {
  const entriesOf = (p) => [{ plan: p }];
  it('a keep is one write of the record on a locked plan; the settings and the plan document are untouched', () => {
    const p = withLines(sam(), [conv(2027, 20000), shares]);
    const w = holdPatch(p, { kind: 'keep', index: 1, keep: { as: 'mine', fundsGaps: true } }, { today: BEFORE });
    expect(w.ok).toBe(true);
    expect(Object.keys(w.patch)).toEqual(['holdings']);
    expect(w.patch.holdings.lines[1].keep).toEqual({ as: 'mine', fundsGaps: true });
    expect(w.line).toEqual({ id: 'kept', slots: { name: 'Example Shares plc' } });
    expect(holdPatch(p, { kind: 'keep', index: 9, keep: { as: 'mine' } }, { today: BEFORE }).ok).toBe(false);
    expect(holdPatch(p, { kind: 'expected', op: 'add', item: { amount: 0 } }, { today: BEFORE }).ok).toBe(false);
    const x = holdPatch(p, { kind: 'expected', op: 'add', item: { label: 'Pension elsewhere', amount: 30000, by: '2027-06' } }, { today: BEFORE });
    expect(x.patch.holdings.expected).toHaveLength(1);
  });
  it('"What you hold" offers Keep this on a locked plan, reads the typed choice, and makes the one change', () => {
    const p = withLines(sam(), [conv(2027, 20000), shares]);
    const v = holdOf(entriesOf(p), p.id, { today: BEFORE, typed: { 'keep.index': '0', 'line.0.keepAs': 'rung', 'line.0.keepYears': '2027,2028' } });
    expect(v.canKeep).toBe(true);
    expect(v.keepIndex).toBe(0);
    const l0 = v.groups[0].lines.find((l) => l.index === 0);
    expect(l0.keep.change).toEqual({ kind: 'keep', index: 0, keep: { as: 'rung', taxYears: [2027, 2028] } });
    expect(l0.keep.years.filter((y) => y.on).map((y) => y.label)).toEqual(['2027/28', '2028/29']);
    const none = holdOf(entriesOf(p), p.id, { today: BEFORE, typed: { 'line.0.keepAs': 'rung', 'line.0.keepYears': '' } }).groups[0].lines.find((l) => l.index === 0);
    expect(none.keep).toMatchObject({ change: null, error: 'noYears' });
  });
  it('the move lists what is kept and no longer sells it; the classic page says the same sentences', () => {
    const p = withLines(sam(), [{ ...conv(2027, 20000), keep: { as: 'rung', taxYears: [2027] } }, { ...shares, keep: { as: 'mine', fundsGaps: true } }]);
    const m = moveOf(entriesOf(p), p.id, { today: BEFORE });
    expect(m.sell.map((s) => s.label)).not.toContain('Example Shares plc');
    expect(m.kept).toEqual([expect.objectContaining({ label: 'Example Shares plc', value: '£15,000', fundsGaps: true })]);
    expect(m.standIn[0]).toMatchObject({ label: 'Example Treasury Gilt 2027', pays: '£20,000', fixed: true, years: ['2027/28'] });
    const now = noon(BEFORE);
    const mi = moveInputs(p, { now });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: gapsView(gapsOf(p, { today: BEFORE })) });
    for (const l of m.gaps.lines) expect(html).toContain(sayGapLine(l, GAPS).replace(/’/g, '’'));
    expect(html).toContain('Kept by you');
    expect(html).toContain('keepHolding(1,this.value)');
  });
});

describe('identity: a plan that keeps nothing reads exactly as before', () => {
  const files = readdirSync(FIX).filter((x) => x.endsWith('.json'));
  it.each(files)('%s — the diff with the document\'s needs equals the diff without; the schedule and the views carry nothing new', (f) => {
    const p = fixture(f);
    if (!p.planDocument) return;
    for (const today of ['2026-09-30', '2027-11-09']) {
      const now = noon(today);
      const m = moveInputs(p, { now });
      if (!m) continue;
      const lines = normaliseHoldings(p.holdings).lines;
      const plain = diffHoldings(lines, m.target);
      expect(m.diff).toEqual(plain);
      expect(m.diff).not.toHaveProperty('standIn');
      expect(sequence(m.diff, { today: now, startYear: 2027 })).toEqual(sequence(plain, { today: now, startYear: 2027 }));
      expect(gapsOf(p, { today })).toBe(null);
      const mv = moveOf([{ plan: { ...p, id: p.id || 'X' } }], p.id || 'X', { today });
      if (mv.found) for (const k of ['standIn', 'kept', 'covered', 'gaps']) expect(mv, k).not.toHaveProperty(k);
    }
  });
});

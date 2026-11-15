/**
 * 7.11.1 — "What is covered, year by year" reads what the person actually holds, and a rung part bought is never a sale.
 *
 * Alex's plan (fictional from scratch, built in memory on the corpus's locked ladder, 03): locked, living on it, months
 * recorded. The ladder's first rung pays from 2029/30; the three tax years before it (this one, 2026/27, then 2027/28 and
 * 2028/29) are paid from cash, and 2027/28 needs nothing from the pension because a lump sum the plan counts pays it. In the
 * pension: every rung but two in full (the 2031 and 2041 linkers part bought), three conventional gilts known by their SEDOL
 * and no code, maturing one in each cash year, some company shares and a world share fund, £50 of cash; and one sum of money
 * expected later. Nothing is marked "Keep this".
 *
 * Before 7.11.1 the reading counted only the rungs, the pension's cash and lines marked "Keep this", so every cash year read
 * as not covered while three gilts maturing in exactly those years sat in the pension; a rung the order sheet called "not yet"
 * bought could be listed to sell as "more than the rung needs"; and a year the plan needs nothing for read "£0" unexplained.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { gapsOf, gapsView, gapSentences, sayGapLine, gapHeadline, heldOf } from '../../../src/answers/plan/gaps.js';
import { GAPS } from '../../../src/v7/copy/gaps.js';
import { BANNED } from '../../../src/v7/copy/banned.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { holdOf } from '../../../src/answers/plan/hold.js';
import { ladderGapsOf } from '../../../src/answers/plan/keepTest.js';
import { standInPays, yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionGaps } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { entryOf, noon } from './_plans.js';
import { ALEX_TODAY as TODAY, RAW, L, CONV, SHARES, FUND, PART, alexRaw, alex } from './_alex.js';

const words = (g) => gapSentences(g).map((l) => sayGapLine(l, GAPS));

describe('Alex: living on the plan', () => {
  it('reads Living on it: locked, running, months recorded', () => {
    const h = homeOf([{ plan: alex() }], 'AlexLiving01', { today: TODAY });
    expect(h.found).toBe(true);
    expect(h.locked).toBe(true);
    expect(h.stage.key).toBe('drawing');
    expect(alex().decisionTool.history.length).toBeGreaterThan(0);
  });
});

describe('what is covered reads what Alex holds, with no "Keep this"', () => {
  const p = alex();
  const g = gapsOf(p, { today: TODAY });
  const needs = yearNeedsOf(p.planDocument);

  it('each conventional gilt counts toward the tax year it matures in, at what it pays at today\'s prices; every cash year is covered', () => {
    expect(g).not.toBe(null);
    expect(g.fromHeld).toBe(true);
    expect(g.rows.map((r) => r.Y)).toEqual([2026, 2027, 2028]);
    const [r26, r27, r28] = g.rows;
    const real = CONV.map((l, i) => standInPays(l, { today: noon(TODAY), from: 2026 + i }).real);
    // this year: five months to come, all of them paid by the gilt maturing in January; the rest is cash for the years after
    expect(r26).toMatchObject({ thisYear: true, monthsLeft: 5, need: Math.round(34000 * 5 / 12), source: 'thisYear', gap: 0 });
    expect(r26.gilts).toEqual([{ label: '4 1/8% Treasury Gilt 2027', pays: Math.round(34000 * 5 / 12), fixed: true }]);
    // 2027/28: the plan needs nothing from the pension (a lump sum it counts pays it): the gilt maturing then is all cash after
    expect(r27).toMatchObject({ need: 0, held: 0, gap: 0, paidBy: 'lump' });
    // 2028/29: its own gilt, then the pension's cash — what the earlier gilts paid beyond their years
    expect(r28.gilts[0]).toEqual({ label: '1 5/8% Treasury Gilt 2028', pays: real[2], fixed: true });
    expect(r28).toMatchObject({ need: 33000, held: 33000, cash: 33000 - real[2], gap: 0 });
    expect(g.totalGap).toBe(0);
    expect(g.firstGap).toBe(null);
    expect(gapHeadline(g)).toBe(null);
    // what each pays beyond its year is said, never lost
    expect(g.gilts.map((x) => [x.state, x.Y, x.spare])).toEqual([['counted', 2026, real[0] - Math.round(34000 * 5 / 12)], ['counted', 2027, real[1]], ['counted', 2028, 0]]);
    expect(needs[2027].need).toBe(0);
  });

  it('shares and funds outside the plan\'s mix are never held for a year, never ignored: worth today, and that they can fall', () => {
    expect(g.outside).toEqual({ lines: [{ at: expect.any(Number), label: 'Example Shares plc', value: 12000 }, { at: expect.any(Number), label: 'Vanguard FTSE All-World (Acc)', value: 40000 }], total: 52000 });
    expect(g.rows.every((r) => !r.standIns.length && r.gilts.every((x) => !/Shares|Vanguard/.test(x.label)))).toBe(true);
    const w = words(g);
    expect(w).toContain('Also in your pension, outside the plan’s mix: Example Shares plc and Vanguard FTSE All-World (Acc), £52,000 at today’s value.');
    expect(w).toContain(GAPS.outsideCanFall);
  });

  it('says it in words: each gilt, the year that needs nothing and why, every year covered, the lump sum the plan already counts', () => {
    const w = words(g);
    expect(w[0]).toBe('Your ladder, as locked.');
    expect(w).toContain('2027/28 needs nothing from your pension: a lump sum the plan counts that year pays it.');
    expect(w.some((t) => /^4 1\/8% Treasury Gilt 2027 matures in January 2027, so it counts toward 2026\/27\. It pays a fixed £30,619; it does not rise with prices, so when it is paid it is worth £[\d,]+ at today’s prices\.$/.test(t))).toBe(true);
    expect(w.some((t) => t.startsWith('4¼% Treasury Gilt 2027 matures in December 2027, so it counts toward 2027/28.'))).toBe(true);
    expect(w.some((t) => t.startsWith('1 5/8% Treasury Gilt 2028 matures in October 2028, so it counts toward 2028/29.'))).toBe(true);
    expect(w).toContain('Every year to 2028/29 is covered by what you hold.');
    expect(w).toContain('The plan already counts a lump sum of £40,000 in 2027/28; if the money you expect is that money, it is not extra.');
    // free of advice and of every banned word a plan page may show
    for (const t of [...w, ...Object.values(GAPS).filter((x) => typeof x === 'string').map((x) => x.replace(/\{\w+\}/g, 'two'))]) for (const b of BANNED.filter((x) => ['all', 'planner', 'record', 'result', 'retired'].includes(x.scope))) {
      if (b.kind === 'explain') continue;
      expect(b.re.test(t) && !(b.allow || []).some((a) => a.test(t)), `"${t}" uses ${b.id}`).toBe(false);
    }
  });

  it('every line of the record says the part it plays: the rungs, the two part bought, each gilt with its tax year, outside the mix, cash', () => {
    const roles = heldOf(p, { today: TODAY });
    const by = (label) => roles.find((r) => r.label === label);
    const lines = p.holdings.lines;
    expect(roles.map((r) => r.at)).toEqual(lines.map((_, i) => i));
    for (const o of p.planDocument.strategy.r.plan.orders) {
      const r = by(o.name);
      expect(r.role, o.tidm).toBe(PART[o.tidm] ? 'partRung' : 'rung');
      if (PART[o.tidm]) expect(r.rung).toMatchObject({ heldUnits: PART[o.tidm], units: o.nominal - PART[o.tidm], taxYears: o.taxYears });
    }
    expect(CONV.map((l) => [by(l.name).role, by(l.name).state, by(l.name).countsToward])).toEqual([['gilt', 'counted', 2026], ['gilt', 'counted', 2027], ['gilt', 'counted', 2028]]);
    expect([by('Example Shares plc').role, by('Vanguard FTSE All-World (Acc)').role, by('Xtrackers II Sterling Overnight Rate').role]).toEqual(['outside', 'outside', 'cash']);
    // as drawn: the gilt's month and the tax year it counts toward
    const v = gapsView(g);
    expect(v.lead).toBe('leadHeld');
    expect(v.held.find((r) => r.label === '4¼% Treasury Gilt 2027')).toMatchObject({ role: 'gilt', state: 'counted', matures: 'December 2027', year: '2027/28' });
    expect(v.held.find((r) => r.label === '0 1/8% Index-linked Treasury Gilt 2031')).toMatchObject({ role: 'partRung', rung: { heldUnits: '2000', units: '13500', years: ['2032/33'] } });
    expect(v.rows[0].parts).toEqual([{ kind: 'gilt', label: '4 1/8% Treasury Gilt 2027', amount: '£' + Math.round(34000 * 5 / 12).toLocaleString('en-GB') }]);
  });

  it('one reader for every view: What you hold, the move, the home and the full view say the same', () => {
    const v = gapsView(g);
    const entries = [{ plan: p }];
    expect(holdOf(entries, p.id, { today: TODAY }).gaps).toEqual(v);
    expect(moveOf(entries, p.id, { today: TODAY }).gaps).toEqual(v);
    expect(homeOf(entries, p.id, { today: TODAY })).not.toHaveProperty('gap');
    expect(transitionGaps(p, p.holdings, noon(TODAY))).toEqual(v);
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: v });
    expect(html).toContain(GAPS.leadHeld);
    for (const l of v.lines) expect(html).toContain(sayGapLine(l, GAPS).replace(/&/g, '&amp;'));
    expect(html).toContain('4 1/8% Treasury Gilt 2027 £');
  });

  it('with less held, the gap is said, and what the shares and the fund would cover at today\'s value', () => {
    const q = alex({ lines: alexRaw().holdings.lines.filter((l) => l.sedol !== 'BFX0ZL7' && l.sedol !== 'B16NNR7') });
    const h = gapsOf(q, { today: TODAY });
    expect(h.rows.find((r) => r.Y === 2028).gap).toBeGreaterThan(0);
    expect(h.withHeld).toEqual(h.totalGap <= 25000 + 52000 ? { covered: true, short: 0 } : { covered: false, short: h.totalGap - 77000 });
    expect(words(h)).toContain('With the money you expect, and these at today’s value, every year to 2028/29 is covered.');
    expect(gapHeadline(h)).toMatchObject({ year: '2028/29' });
    expect(homeOf([{ plan: q }], q.id, { today: TODAY }).gap).toMatchObject({ year: '2028/29' });
  });

  it('a gilt whose maturity cannot be told is never guessed: one line says so and it counts toward no year', () => {
    const lines = [...alexRaw().holdings.lines, L({ name: 'Treasury Gilt 2029', units: 10000, value: 9500, kind: 'gilt' })];
    const h = gapsOf(alex({ lines }), { today: TODAY });
    expect(h.gilts.find((x) => x.label === 'Treasury Gilt 2029')).toMatchObject({ state: 'unknown', Y: null });
    expect(h.rows.every((r) => r.gilts.every((x) => x.label !== 'Treasury Gilt 2029'))).toBe(true);
    expect(words(h)).toContain('We cannot tell when Treasury Gilt 2029 matures, so it is not counted toward any year.');
  });

  it('the person\'s own "stands in for" wins over the maturity: the line is read as kept, never twice', () => {
    const lines = alexRaw().holdings.lines.map((l) => (l.sedol === 'B16NNR7' ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l));
    const h = gapsOf(alex({ lines }), { today: TODAY });
    expect(h.gilts.map((x) => x.label)).not.toContain('4¼% Treasury Gilt 2027');
    expect(h.standIns.map((s) => [s.label, s.taxYears])).toEqual([['4¼% Treasury Gilt 2027', [2028]]]);
    expect(h.rows.find((r) => r.Y === 2028).source).toBe('standIn');
  });

  it('nothing read when the pension holds only the plan\'s rungs and cash, keeps nothing and expects nothing — as before', () => {
    const rungsOnly = alexRaw().holdings.lines.filter((l) => !l.sedol || !CONV.some((c) => c.sedol === l.sedol)).filter((l) => l !== SHARES && l !== FUND && l.ticker !== 'EXMPL' && l.ticker !== 'VWRP');
    const q = alex({ lines: rungsOnly, expected: [] });
    expect(gapsOf(q, { today: TODAY })).toBe(null);
    expect(moveOf([{ plan: q }], q.id, { today: TODAY })).not.toHaveProperty('gaps');
  });

  // Moved on purpose (7.11.1, "Your plan's mix" by phase): a gilt maturing in a cash year is that year's cash and the move
  // never sells it, so the keep test's own reading counts it too (it read 2028/29 as £33,000 short, while the move sold the
  // gilt paying it). Shares and funds outside the plan's mix are still the move's to sell there, never counted twice.
  it('the keep test reads what is kept, and the gilts maturing in the cash years (the move never sells them); never the lines the move sells there', () => {
    const k = gapsOf(p, { today: TODAY, asKept: true });
    expect(k.fromHeld).toBe(false);
    expect(k.outside.total).toBe(0);
    expect(k.gilts.map((x) => [x.label, x.Y])).toEqual(CONV.map((l, i) => [l.name, 2026 + i]));
    expect(k.rows.find((r) => r.Y === 2028).gap).toBe(0);
    const G = ladderGapsOf(p, { today: TODAY }).gaps;
    for (const Y of [2026, 2027, 2028]) expect(G[Y], String(Y)).toBeUndefined();
  });
});

describe('a rung held below its target is never a sale', () => {
  const p = alex();
  it('Alex\'s two rungs part bought are to buy, and the order sheet says part bought', () => {
    const m = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(m.sell.map((s) => s.label)).not.toContain('0 1/8% Index-linked Treasury Gilt 2031');
    expect(m.sell.map((s) => s.label)).not.toContain('0 1/8% Index-linked Treasury Gilt 2041');
    expect(m.buy.map((b) => [b.ticker, b.units])).toEqual([['TR31', '13500'], ['T41', '7300']]);
    expect(m.sheet.filter((r) => r.bought === 'part').map((r) => r.tidm)).toEqual(['TR31', 'T41']);
  });

  it('a rung held above its target is held for its years in the reading (the excess is the move\'s), never a year of cash missing', () => {
    // the corpus ladder holds 25,000 of the 2027 linker, whose rung (2028/29) needs 15,500
    const g = gapsOf(entryOf(RAW, TODAY).plan, { today: TODAY });
    expect(g.rows.find((r) => r.Y === 2028)).toMatchObject({ source: 'rung', gap: 0, toBuy: 0 });
  });
});

describe('a year the plan needs nothing from the pension for says what pays it', () => {
  const read = (patch, o) => { const raw = alexRaw(o); raw.planDocument.timeline = raw.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, ...patch } : r)); return gapsOf(entryOf(raw, TODAY).plan, { today: TODAY }); };
  it('a lump sum the plan counts, other income, or other money it counts — never "£0" alone', () => {
    expect(gapsOf(alex(), { today: TODAY }).rows.find((r) => r.Y === 2027).paidBy).toBe('lump');
    const other = read({ lump: 0, lumpIn: [], other: 34000 });
    expect(other.rows.find((r) => r.Y === 2027).paidBy).toBe('other');
    expect(words(other)).toContain('2027/28 needs nothing from your pension: other income the plan counts pays it.');
    const neither = read({ lump: 0, lumpIn: [], other: 0 });
    expect(words(neither)).toContain('2027/28 needs nothing from your pension: other money the plan counts pays it.');
    // a year that needs something says nothing more
    expect(gapsOf(alex(), { today: TODAY }).rows.filter((r) => r.Y !== 2027).map((r) => r.paidBy)).toEqual([null, null]);
  });
  it('the lump sum the plan already counts is said beside money expected later, which may be that money — and only then', () => {
    expect(words(gapsOf(alex(), { today: TODAY }))).toContain('The plan already counts a lump sum of £40,000 in 2027/28; if the money you expect is that money, it is not extra.');
    expect(words(gapsOf(alex({ expected: [] }), { today: TODAY })).some((t) => t.startsWith('The plan already counts a lump sum'))).toBe(false);
  });
});

/**
 * 7.11.1 — "What is covered, year by year" reads what the person actually holds, and a rung part bought is never a sale.
 * No holding is set against a year by the reading: only the plan's rungs, the pension's cash and what the person sets against
 * tax years count for a year; every other line in the pension is money available, said in one line.
 *
 * Alex's plan (fictional from scratch, built in memory on the corpus's locked ladder, 03): locked, living on it, months
 * recorded. The ladder's first rung pays from 2029/30; the three tax years before it (this one, 2026/27, then 2027/28 and
 * 2028/29) are paid from cash, and 2027/28 needs nothing from the pension because a lump sum the plan counts pays it. In the
 * pension: every rung but two in full (the 2031 and 2041 linkers part bought), three conventional gilts known by their SEDOL
 * and no code, maturing one in each cash year, some company shares and a world share fund, £50 of cash; and one sum of money
 * expected later. Nothing is marked "Keep this".
 *
 * Before 7.11.1 the reading said nothing of what was held beyond the rungs, the pension's cash and lines marked "Keep this";
 * a rung the order sheet called "not yet" bought could be listed to sell as "more than the rung needs"; and a year the plan
 * needs nothing for read "£0" unexplained.
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
import { yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
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

  // Moved on purpose (7.11.1, the gilt-year guess removed): a gilt is never set against the tax year it matures in — gilts are
  // often bought to mature before the year their money is for. Only the rungs, the pension's cash and what the person sets
  // against tax years count for a year; Alex's three gilts are money available, said in one line.
  it('no gilt is set against a year by when it matures: the cash years are held by the pension\'s cash alone', () => {
    expect(g).not.toBe(null);
    expect(g.fromHeld).toBe(true);
    expect(g.rows.map((r) => r.Y)).toEqual([2026, 2027, 2028]);
    const [r26, r27, r28] = g.rows;
    expect(r26).toMatchObject({ thisYear: true, monthsLeft: 5, need: Math.round(34000 * 5 / 12), source: 'thisYear', cash: 50, held: 50, gap: Math.round(34000 * 5 / 12) - 50 });
    // 2027/28: the plan needs nothing from the pension (a lump sum it counts pays it)
    expect(r27).toMatchObject({ need: 0, held: 0, gap: 0, paidBy: 'lump' });
    expect(r28).toMatchObject({ need: 33000, held: 0, cash: 0, gap: 33000 });
    for (const r of g.rows) expect(r).not.toHaveProperty('gilts');
    expect(g.totalGap).toBe(Math.round(34000 * 5 / 12) - 50 + 33000);
    expect(g.firstGap).toEqual({ Y: 2026, year: '2026/27', gap: Math.round(34000 * 5 / 12) - 50, lastMonth: null, shortFrom: '2026-11' });
    expect(gapHeadline(g)).toMatchObject({ year: '2026/27' });
    // each gilt is available, with when it matures as a fact
    expect(g.gilts.map((x) => [x.label, x.state, x.matures])).toEqual([['4 1/8% Treasury Gilt 2027', 'available', '2027-01-29'], ['4¼% Treasury Gilt 2027', 'available', '2027-12-07'], ['1 5/8% Treasury Gilt 2028', 'available', '2028-10-22']]);
    expect(needs[2027].need).toBe(0);
  });

  it('every other line in the pension is money available: never ignored, never assigned — gilts, and shares and funds, apart', () => {
    const giltsValue = CONV.reduce((s, l) => s + l.value, 0);
    expect(g.outside).toEqual({ lines: [...CONV.map((l) => ({ at: expect.any(Number), label: l.name, value: l.value, gilt: true })), { at: expect.any(Number), label: 'Example Shares plc', value: 12000 }, { at: expect.any(Number), label: 'Vanguard FTSE All-World (Acc)', value: 40000 }],
      total: giltsValue + 52000, gilts: giltsValue, funds: 52000 });
    expect(g.rows.every((r) => !r.standIns.length)).toBe(true);
    const w = words(g);
    expect(w).toContain('Also in your pension, at today’s value: gilts £88,230, shares and funds £52,000, not set against any year.');
    // Moved on purpose (the walk): what Alex holds covers every year not covered on its own, so the sentence never leans on the
    // money expected, which the page itself says may not arrive
    expect(g.withHeld).toEqual({ covered: true, short: 0, cover: g.totalGap, expected: false });
    expect(w).toContain('At today’s value, that would cover every year to 2028/29.');
    expect(w.some((t) => t.startsWith('With the money you expect'))).toBe(false);
    expect(w).toContain(GAPS.outsideCanFallGilts);
  });

  it('says it in words: the year that needs nothing and why, the first year short, the lump sum the plan already counts — no year "counted toward" by a gilt', () => {
    const w = words(g);
    // read with what is held and nothing kept, the lead says it all: no "Your ladder, as locked."
    expect(w).not.toContain(GAPS.strategyNone);
    expect(w[0]).toBe('2027/28 needs nothing from your pension: a lump sum the plan counts that year pays it.');
    expect(w.some((t) => /counts? toward|matures in/.test(t))).toBe(false);
    expect(w).toContain('Without the money you expect, 2026/27’s money is not covered from November 2026.');
    expect(w).toContain('Not yet covered to 2028/29: £47,117 in all.');
    expect(w).toContain('The plan already counts a lump sum of £40,000 in 2027/28; if the money you expect is that money, it is not extra.');
    // free of advice and of every banned word a plan page may show
    for (const t of [...w, ...Object.values(GAPS).filter((x) => typeof x === 'string').map((x) => x.replace(/\{\w+\}/g, 'two'))]) for (const b of BANNED.filter((x) => ['all', 'planner', 'record', 'result', 'retired'].includes(x.scope))) {
      if (b.kind === 'explain') continue;
      expect(b.re.test(t) && !(b.allow || []).some((a) => a.test(t)), `"${t}" uses ${b.id}`).toBe(false);
    }
  });

  it('every line of the record says the part it plays: the rungs, the two part bought, each gilt and when it matures, outside the mix, cash', () => {
    const roles = heldOf(p, { today: TODAY });
    const by = (label) => roles.find((r) => r.label === label);
    const lines = p.holdings.lines;
    expect(roles.map((r) => r.at)).toEqual(lines.map((_, i) => i));
    for (const o of p.planDocument.strategy.r.plan.orders) {
      const r = by(o.name);
      expect(r.role, o.tidm).toBe(PART[o.tidm] ? 'partRung' : 'rung');
      if (PART[o.tidm]) expect(r.rung).toMatchObject({ heldUnits: PART[o.tidm], units: o.nominal - PART[o.tidm], taxYears: o.taxYears });
    }
    expect(CONV.map((l) => [by(l.name).role, by(l.name).state, by(l.name).matures])).toEqual([['gilt', 'available', '2027-01-29'], ['gilt', 'available', '2027-12-07'], ['gilt', 'available', '2028-10-22']]);
    for (const l of CONV) { expect(by(l.name)).not.toHaveProperty('Y'); expect(by(l.name)).not.toHaveProperty('countsToward'); }
    expect([by('Example Shares plc').role, by('Vanguard FTSE All-World (Acc)').role, by('Xtrackers II Sterling Overnight Rate').role]).toEqual(['outside', 'outside', 'cash']);
    // as drawn: the gilt's month, a fact; no tax year beside it
    const v = gapsView(g);
    expect(v.lead).toBe('leadHeld');
    const drawn = v.held.find((r) => r.label === '4¼% Treasury Gilt 2027');
    expect(drawn).toMatchObject({ role: 'gilt', state: 'available', matures: 'December 2027' });
    expect(drawn).not.toHaveProperty('year');
    expect(v.held.find((r) => r.label === '0 1/8% Index-linked Treasury Gilt 2031')).toMatchObject({ role: 'partRung', rung: { heldUnits: '2000', units: '13500', years: ['2032/33'] } });
    expect(v.rows[0].parts).toEqual([{ kind: 'cash', amount: '£50' }]);
  });

  it('one reader for every view: What you hold, the move, the home and the full view say the same', () => {
    const v = gapsView(g);
    const entries = [{ plan: p }];
    expect(holdOf(entries, p.id, { today: TODAY }).gaps).toEqual(v);
    expect(moveOf(entries, p.id, { today: TODAY }).gaps).toEqual(v);
    expect(homeOf(entries, p.id, { today: TODAY }).gap).toMatchObject({ year: '2026/27', gap: gapHeadline(g).gap });
    expect(transitionGaps(p, p.holdings, noon(TODAY))).toEqual(v);
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: v });
    expect(html).toContain(GAPS.leadHeld);
    for (const l of v.lines) expect(html).toContain(sayGapLine(l, GAPS).replace(/&/g, '&amp;'));
  });

  it('with less money available, what it would cover is said, and what would still not be covered', () => {
    const q = alex({ lines: alexRaw().holdings.lines.filter((l) => l.sedol !== 'BFX0ZL7' && l.sedol !== 'B16NNR7' && l !== FUND), expected: [] });
    const h = gapsOf(q, { today: TODAY });
    expect(h.outside).toMatchObject({ gilts: 29990, funds: 12000, total: 41990 });
    // Moved on purpose (the walk): the reading says whether it leant on the money expected; here nothing is expected
    expect(h.withHeld).toEqual({ covered: false, short: h.totalGap - 41990, cover: 41990, expected: false });
    const w = words(h);
    expect(w).toContain('Also in your pension, at today’s value: gilts £29,990, shares and funds £12,000, not set against any year.');
    expect(w).toContain(`At today’s value, that would cover £41,990 of it, leaving £${(h.totalGap - 41990).toLocaleString('en-GB')} not covered to 2028/29.`);
    expect(gapHeadline(h)).toMatchObject({ year: '2026/27' });
    expect(homeOf([{ plan: q }], q.id, { today: TODAY }).gap).toMatchObject({ year: '2026/27' });
    // gilts alone: no word that their value can fall as shares do — only the line and what it would cover
    const r = gapsOf(alex({ lines: alexRaw().holdings.lines.filter((l) => l !== FUND && l !== SHARES), expected: [] }), { today: TODAY });
    expect(words(r)).toContain('Also in your pension, at today’s value: gilts £88,230, not set against any year.');
    expect(words(r).some((t) => t === GAPS.outsideCanFall || t === GAPS.outsideCanFallGilts)).toBe(false);
  });

  it('the money expected is leant on only when what is held alone falls short, and the sentence says so', () => {
    const q = alex({ lines: alexRaw().holdings.lines.filter((l) => l.sedol !== 'BFX0ZL7' && l.sedol !== 'B16NNR7' && l !== FUND) });
    const h = gapsOf(q, { today: TODAY });
    expect(h.expected.total).toBeGreaterThan(0);
    expect(h.outside.total).toBeLessThan(h.totalGap);
    expect(h.withHeld.expected).toBe(true);
    const w = words(h);
    expect(w.some((t) => t.startsWith('With the money you expect, and that at today’s value'))).toBe(true);
    expect(w.some((t) => t.startsWith('At today’s value, that would cover'))).toBe(false);
  });

  it('a gilt whose maturity cannot be told is never guessed: it is money available like the others', () => {
    const lines = [...alexRaw().holdings.lines, L({ name: 'Treasury Gilt 2029', units: 10000, value: 9500, kind: 'gilt' })];
    const h = gapsOf(alex({ lines }), { today: TODAY });
    expect(h.gilts.find((x) => x.label === 'Treasury Gilt 2029')).toMatchObject({ state: 'available', matures: null });
    expect(h.outside.gilts).toBe(88230 + 9500);
    expect(words(h)).toContain('Also in your pension, at today’s value: gilts £97,730, shares and funds £52,000, not set against any year.');
  });

  it('only the person sets a line against tax years: a line that "stands in for" 2028/29 is held for it; the others stay available', () => {
    const lines = alexRaw().holdings.lines.map((l) => (l.sedol === 'B16NNR7' ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l));
    const h = gapsOf(alex({ lines }), { today: TODAY });
    expect(h.gilts.map((x) => x.label)).not.toContain('4¼% Treasury Gilt 2027');
    expect(h.standIns.map((s) => [s.label, s.taxYears])).toEqual([['4¼% Treasury Gilt 2027', [2028]]]);
    expect(h.rows.find((r) => r.Y === 2028).source).toBe('standIn');
    expect(h.outside.gilts).toBe(29990 + 26380);
  });

  it('nothing read when the pension holds only the plan\'s rungs and cash, keeps nothing and expects nothing — as before', () => {
    const rungsOnly = alexRaw().holdings.lines.filter((l) => !l.sedol || !CONV.some((c) => c.sedol === l.sedol)).filter((l) => l !== SHARES && l !== FUND && l.ticker !== 'EXMPL' && l.ticker !== 'VWRP');
    const q = alex({ lines: rungsOnly, expected: [] });
    expect(gapsOf(q, { today: TODAY })).toBe(null);
    expect(moveOf([{ plan: q }], q.id, { today: TODAY })).not.toHaveProperty('gaps');
  });

  // Moved on purpose (7.11.1, the gilt-year guess removed): the keep test reads what is kept alone again, as 7.10.0 did — no
  // gilt is that year's cash by when it matures, so the move sells them and they are never counted here as well.
  it('the keep test reads what is kept alone; never a line the move sells there', () => {
    const k = gapsOf(p, { today: TODAY, asKept: true });
    expect(k.fromHeld).toBe(false);
    expect(k.outside.total).toBe(0);
    expect(k.gilts).toEqual([]);
    expect(k.rows.find((r) => r.Y === 2028).gap).toBe(33000);
    const G = ladderGapsOf(p, { today: TODAY }).gaps;
    expect(Math.round(G[2026])).toBe(Math.round(34000 * 5 / 12) - 50);
    expect(Math.round(G[2028])).toBe(33000);
    expect(G[2027]).toBeUndefined();
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
    // the corpus ladder holds 25,000 of the 2027 linker, whose rung (2028/29) needs 15,500. Moved on purpose (7.11.1, the
    // gilt-year guess removed): no gilt reaches the reading past the cash years by its maturity now, so the share fund is set
    // against 2029/30 by the person's own choice, which reads the years to it
    const raw = JSON.parse(JSON.stringify(RAW));
    raw.holdings.lines[5] = { ...raw.holdings.lines[5], keep: { as: 'rung', taxYears: [2029] } };
    const g = gapsOf(entryOf(raw, TODAY).plan, { today: TODAY });
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

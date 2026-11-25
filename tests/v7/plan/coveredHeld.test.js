/**
 * Living on a ladder, what the cash years need and what the pension holds for them (7.11.1; rewritten for 7.12.0 against the one
 * reading, answers/plan/held.js heldLadder). No holding is set against a year by the reading: the cash years' need is said once,
 * and everything the pension holds beside the plan's gilts — cash, other gilts, shares and funds — is money it holds, at
 * today's value, set beside that need. A rung part bought is never a sale.
 *
 * Alex's plan (fictional from scratch, built in memory on the corpus's locked ladder, 03): locked, living on it, months
 * recorded. The ladder's first rung pays from 2029/30; the three tax years before it (this one, 2026/27, then 2027/28 and
 * 2028/29) are paid from cash, and 2027/28 needs nothing from the pension because a lump sum the plan counts pays it. In the
 * pension: every rung but two in full (the 2031 and 2041 linkers part bought), three conventional gilts known by their SEDOL
 * and no code, maturing one in each cash year, some company shares and a world share fund, £50 of cash; and one sum of money
 * expected later. Nothing is marked "Keep this".
 *
 * Moved on purpose (7.12.0): before, "What is covered" filled each cash year from the pension's cash alone and called the rest
 * "not covered", then said in another line that what was held would cover it. Now the need is set against all the money held,
 * once; Moving and the keep test still read what is kept (the last cases).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { gapsOf, gapSentences, sayGapLine } from '../../../src/answers/plan/gaps.js';
import { heldLadder, heldLadderView, sayHeld } from '../../../src/answers/plan/held.js';
import { HELD } from '../../../src/v7/copy/held.js';
import { GAPS } from '../../../src/v7/copy/gaps.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { ladderGapsOf } from '../../../src/answers/plan/keepTest.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { unmarked } from '../../../src/reading/mark.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { entryOf, noon } from './_plans.js';
import { ALEX_TODAY as TODAY, RAW, L, CONV, SHARES, FUND, PART, alexRaw, alex } from './_alex.js';

// the cash years still ahead: 2026/27's five months to come of 34,000, 2027/28 nothing (a lump sum the plan counts), 2028/29 33,000
const NEED_EXACT = 34000 * 5 / 12 + 0 + 33000;
const GILTS = 29990 + 31860 + 26380;   // the three conventional gilts at today's value
const FUNDS = 12000 + 40000;           // the company shares and the world fund
// what each conventional gilt pays on the day it matures, with the half-coupons still to come after 16 November 2026 (round 3):
//   4 1/8% 2027, 30,000 units, 29 Jan 2027: one, 30,000 × 4.125% ÷ 2 = 618.75 → 30,618.75 → £30,619
//   4¼% 2027, 32,000 units, 7 Dec 2027: three (Dec 2026, Jun 2027, Dec 2027), 3 × 680 = 2,040 → £34,040
//   1 5/8% 2028, 28,000 units, 22 Oct 2028: four (Apr/Oct 2027, Apr/Oct 2028), 4 × 227.50 = 910 → £28,910
const PAYS = [30619, 34040, 28910];
const ARRIVES = 50 + PAYS[0] + PAYS[1] + PAYS[2];   // 93,619
const pageText = (h) => { const v = heldLadderView(h); const out = []; const walk = (x) => { if (!x) return; if (Array.isArray(x)) x.forEach(walk); else if (x.key) out.push(sayHeld(x, HELD)); else if (typeof x === 'object') Object.values(x).forEach(walk); }; walk(v); return out; };

describe('Alex: living on the plan', () => {
  it('reads Living on it: locked, running, months recorded', () => {
    const h = homeOf([{ plan: alex() }], 'AlexLiving01', { today: TODAY });
    expect(h.found).toBe(true);
    expect(h.locked).toBe(true);
    expect(h.stage.key).toBe('drawing');
    expect(alex().decisionTool.history.length).toBeGreaterThan(0);
  });
});

describe('what the cash years need, and what Alex\'s pension holds for them', () => {
  const p = alex();
  const h = heldLadder(p, { today: TODAY });

  it('no gilt is set against a year by when it matures: the cash years\' need is said once, against all the money held', () => {
    expect(gapsOf(p, { today: TODAY })).toBe(null);
    expect(h.cashYears.rows.map((r) => [r.Y, r.need, r.paidBy])).toEqual([[2026, Math.round(34000 * 5 / 12), null], [2027, 0, 'lump'], [2028, 33000, null]]);
    expect(h.cashYears.need).toBe(Math.round(NEED_EXACT));
    expect(h.money).toEqual({ cash: 50, gilts: GILTS, funds: FUNDS, available: 50 + GILTS + FUNDS });
    expect(h.state).toBe('cashGilts');
    expect(ARRIVES).toBe(93619);
    expect(h.more).toBe(Math.round(ARRIVES - NEED_EXACT));
    expect(h.more).toBe(46452);
    // each gilt says when it matures, as a fact: no tax year beside it
    expect(CONV.map((l) => h.lines.find((x) => x.label === l.name).matures)).toEqual(['2027-01-29', '2027-12-07', '2028-10-22']);
    for (const l of h.lines) expect(l).not.toHaveProperty('Y');
  });

  it('says it in words, with no year "not covered" and no gilt "counted toward" a year', () => {
    const w = pageText(h);
    expect(w).toContain('Your plan pays 2026/27 to 2028/29 from cash: £47,167 still to come.');
    expect(w).toContain('£0: a lump sum the plan counts pays it');
    expect(w).toContain('Held until the day they pay, the cash and these gilts come to £93,619: £46,452 more than these years need.');
    // November and December, 2 × 34,000 ÷ 12 = 5,666.67, fall before the first of them pays
    expect(w).toContain('One difference from the plan is the timing: £5,667 is due November to December 2026, before 4 1/8% Treasury Gilt 2027 pays on 29 January 2027, and your pension holds £50 in cash. To pay those months you can sell part of something you hold, or wait for that gilt to pay. Anything sold before it matures goes at that day’s price, which can be lower.');
    expect(w).toContain('Your plan already counts a lump sum of £40,000 in 2027/28. If the money you expect is that money, it is not extra.');
    expect(w).toContain('Pension elsewhere: £25,000, expected by June 2027. It is not counted, because it may not arrive.');
    expect(w.some((t) => /not (yet )?covered|counts? toward|runs short/.test(t))).toBe(false);
  });

  it('the plan\'s gilts beside what is held: the two part bought say how many units fewer', () => {
    const tr31 = h.gilts.rows.find((r) => r.code === 'TR31'), t41 = h.gilts.rows.find((r) => r.code === 'T41');
    expect(tr31).toMatchObject({ planUnits: 15500, heldUnits: PART.TR31, diff: PART.TR31 - 15500, state: 'under', years: [2032] });
    expect(t41).toMatchObject({ planUnits: 7800, heldUnits: PART.T41, diff: PART.T41 - 7800, state: 'under', years: [2042] });
    // restated by ruling Z3 (25 Nov 2026): a gilt held in part is held (was 12 of 14, the gilts held in full only)
    expect([h.gilts.held, h.gilts.total]).toEqual([14, 14]);
  });

  it('one reader for every view: the move, the home and the full view say the same; "What is covered" says nothing', () => {
    const entries = [{ plan: p }];
    const m = moveOf(entries, p.id, { today: TODAY });
    expect(m.heldInfo).toEqual(h);
    expect(m.gaps).toBe(undefined);
    expect(homeOf(entries, p.id, { today: TODAY }).gap).toBe(undefined);
    expect(((transitionHeld(p, p.holdings, noon(TODAY)) || {}).gaps || null)).toBe(null);
    const mi = moveInputs(p, { now: noon(TODAY) });
    // the count is marked (gilts.held, step F6): the words are read without their marks
    const html = unmarked(transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: null, held: transitionHeld(p, p.holdings, noon(TODAY)) }));
    for (const t of pageText(h)) expect(html).toContain(t.replace(/&/g, '&amp;'));
    expect(html).not.toContain(GAPS.title);
  });

  it('with less money held than the cash years need, it says how much less, once, and the home says it too', () => {
    const q = alex({ lines: alexRaw().holdings.lines.filter((l) => l.sedol !== 'BFX0ZL7' && l.sedol !== 'B16NNR7' && l !== FUND), expected: [] });
    const k = heldLadder(q, { today: TODAY });
    expect(k.money).toEqual({ cash: 50, gilts: 29990, funds: 12000, available: 50 + 29990 + 12000 });
    expect(k.state).toBe('less');
    // what arrives in time (50 + 30,619) and the shares at today's value (12,000) come to 42,669: 47,166.67 − 42,669 = 4,497.67
    expect(k.less).toBe(Math.round(NEED_EXACT - (50 + PAYS[0] + 12000)));
    expect(k.less).toBe(4498);
    expect(pageText(k)).toContain('What you hold, at today’s value, is £4,498 less than these years need.');
    expect(homeOf([{ plan: q }], q.id, { today: TODAY }).heldLess).toMatchObject({ less: '£4,498' });
  });

  it('the money expected is never counted: it may not arrive', () => {
    const q = alex({ lines: alexRaw().holdings.lines.filter((l) => l.sedol !== 'BFX0ZL7' && l.sedol !== 'B16NNR7' && l !== FUND) });
    const k = heldLadder(q, { today: TODAY });
    expect(k.expected.map((e) => e.amount)).toEqual([25000]);
    expect(k.money.available).toBe(50 + 29990 + 12000);
    expect(k.state).toBe('less');
  });

  it('a gilt whose maturity cannot be told is never guessed: it is counted at its value, and we say so', () => {
    const lines = [...alexRaw().holdings.lines, L({ name: 'Treasury Gilt 2029', units: 10000, value: 9500, kind: 'gilt' })];
    const k = heldLadder(alex({ lines }), { today: TODAY });
    expect(k.lines.find((x) => x.label === 'Treasury Gilt 2029')).toMatchObject({ matures: null, note: 'unknown' });
    expect(k.money.gilts).toBe(GILTS + 9500);
    expect(pageText(k)).toContain('Treasury Gilt 2029: we cannot tell when it matures from its name. Its code or SEDOL on What you hold would tell us.');
  });

  it('only the person sets a line against tax years, and it is their label: no figure changes', () => {
    const lines = alexRaw().holdings.lines.map((l) => (l.sedol === 'B16NNR7' ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l));
    const k = heldLadder(alex({ lines }), { today: TODAY });
    expect([k.cashYears, k.money, k.state, k.more]).toEqual([h.cashYears, h.money, h.state, h.more]);
    expect(k.setYears).toEqual([{ label: '4¼% Treasury Gilt 2027', years: [2028] }]);
    // said in the gilt's own row of the dated table, not echoed on a line of its own
    expect(pageText(k)).toContain('£34,040 on 7 December 2027: 4¼% Treasury Gilt 2027 (you set it against 2028/29)');
    expect(pageText(k).some((t) => t.startsWith('You set '))).toBe(false);
  });

  it('holding only the plan\'s gilts and its cash, the page still reads: the cash years against the cash', () => {
    const rungsOnly = alexRaw().holdings.lines.filter((l) => !CONV.includes(l) && l !== SHARES && l !== FUND);
    const q = alex({ lines: rungsOnly, expected: [] });
    expect(gapsOf(q, { today: TODAY })).toBe(null);
    expect(moveOf([{ plan: q }], q.id, { today: TODAY })).not.toHaveProperty('gaps');
    const k = heldLadder(q, { today: TODAY });
    expect(k.lines).toEqual([]);
    expect(k.money).toEqual({ cash: 50, gilts: 0, funds: 0, available: 50 });
    // 47,166.67 − 50 = 47,116.67
    expect(pageText(k)).toContain('What you hold, at today’s value, is £47,117 less than these years need.');
  });

  // the keep test reads what is kept alone, as 7.10.0 did: no gilt is that year's cash by when it matures
  it('the keep test reads what is kept alone; never a line the move sells there', () => {
    const k = gapsOf(p, { today: TODAY, asKept: true });
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
    expect(m.buy.map((b) => [b.ticker, b.units])).toEqual([['TR31', '13,500'], ['T41', '7,300']]);
    expect(m.sheet.filter((r) => r.bought === 'part').map((r) => r.tidm)).toEqual(['TR31', 'T41']);
  });

  it('a rung held above its target is held for its years in the keep test\'s reading (the excess is the move\'s), never a year of cash missing', () => {
    // the corpus ladder holds 25,000 of the 2027 linker, whose rung (2028/29) needs 15,500; the share fund is set against
    // 2029/30 by the person's own choice, which reads the years to it
    const raw = JSON.parse(JSON.stringify(RAW));
    raw.holdings.lines[5] = { ...raw.holdings.lines[5], keep: { as: 'rung', taxYears: [2029] } };
    const g = gapsOf(entryOf(raw, TODAY).plan, { today: TODAY, asKept: true });
    expect(g.rows.find((r) => r.Y === 2028)).toMatchObject({ source: 'rung', gap: 0, toBuy: 0 });
  });
});

describe('a year the plan needs nothing from the pension for says what pays it', () => {
  const read = (patch, o) => { const raw = alexRaw(o); raw.planDocument.timeline = raw.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, ...patch } : r)); return heldLadder(entryOf(raw, TODAY).plan, { today: TODAY }); };
  it('a lump sum the plan counts, other income, or other money it counts — never "£0" alone', () => {
    expect(heldLadder(alex(), { today: TODAY }).cashYears.rows.find((r) => r.Y === 2027).paidBy).toBe('lump');
    const other = read({ lump: 0, lumpIn: [], other: 34000 });
    expect(other.cashYears.rows.find((r) => r.Y === 2027).paidBy).toBe('other');
    expect(pageText(other)).toContain('£0: other income the plan counts pays it');
    const neither = read({ lump: 0, lumpIn: [], other: 0 });
    expect(pageText(neither)).toContain('£0: other money the plan counts pays it');
    // a year that needs something says nothing more
    expect(heldLadder(alex(), { today: TODAY }).cashYears.rows.filter((r) => r.Y !== 2027).map((r) => r.paidBy)).toEqual([null, null]);
  });
  it('the lump sum the plan already counts is said beside money expected later, which may be that money — and only then', () => {
    expect(pageText(heldLadder(alex(), { today: TODAY }))).toContain('Your plan already counts a lump sum of £40,000 in 2027/28. If the money you expect is that money, it is not extra.');
    expect(pageText(heldLadder(alex({ expected: [] }), { today: TODAY })).some((t) => t.startsWith('Your plan already counts a lump sum'))).toBe(false);
  });
  it('in a move, the reading of what is kept still says what pays a year that needs nothing', () => {
    const words = (g) => gapSentences(g).map((l) => sayGapLine(l, GAPS));
    expect(words(gapsOf(alex(), { today: TODAY, asKept: true }))).toContain('2027/28 needs nothing from your pension: a lump sum the plan counts that year pays it.');
  });
});

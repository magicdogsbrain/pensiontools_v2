/**
 * 7.11.1 — the review of "What is covered" read with what is held, and of "Your plan's mix" by phase. Each block is one
 * finding, and each fails on the code before its fix.
 *
 *   (1) moved on purpose (7.11.1, the gilt-year guess removed): in a move, a gilt outside the rungs funds the ladder as 7.10.0
 *       had it — no gilt is a cash year's cash by when it matures, so no cash is "freed" by one;
 *   (2) moved on purpose, as (1): no gilt pays a year by when it matures; the months not paid by the pension's cash are said;
 *   (3) in a move (Moving, nothing accepted) What is covered never counts a line the move sells;
 *   (4) a gilt that matured after the record was taken is the pension's cash now, never money that vanishes;
 *   (5) living on the plan, a rung not fully bought is never "still to buy": what is not held is not covered;
 *   (6) (tests/holdingsPasteRung.test.js) a pasted conventional gilt never takes an index-linked rung's identity;
 *   (7) the cash line and What is covered give one figure for the cash years;
 *   (8) every gilt outside the rungs is money available, whatever its maturity: its value today is counted beside the shares;
 *   (9) a year that needs nothing says what pays it: the State Pension, or a lump sum carried from an earlier year;
 *  (10) the full view's lines point to the order sheet where it is (the plan document), and the simple view's sheet, living on
 *       the plan, is read as what the plan holds;
 *  (11) the full view's tab is named by the phase; lines outside the pension are outside it, not "left alone".
 *
 * Fictional plans only (tests/v7/plan/_alex.js: Alex, living on a locked ladder; Sam, Moving).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { fill } from '../../../src/v7/components/index.js';
import { gapsOf, gapSentences, sayGapLine, gapHeadline } from '../../../src/answers/plan/gaps.js';
import { GAPS } from '../../../src/v7/copy/gaps.js';
import { MOVE } from '../../../src/v7/copy/move.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { holdOf } from '../../../src/answers/plan/hold.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { sequence, yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld, transitionGaps, transitionTabName, nameTransitionTab } from '../../../src/ui/keepHoldingsUi.js';
import { moreSheetHtml } from '../../../src/ui/mobileMenu.js';
import { stateWith, entryOf, noon } from './_plans.js';
import { ALEX_TODAY as TODAY, L, CONV, SHARES, FUND, alexRaw, alex, samRaw, asMoving } from './_alex.js';

const words = (g) => gapSentences(g).map((l) => sayGapLine(l, GAPS));
const plan = (raw, today = TODAY) => entryOf(raw, today).plan;
const sam = (raw = samRaw()) => plan(raw);
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  return { root, text: visibleText(root) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
/** Alex read as Moving (work stops in April 2027), £50 of cash, the three cash-year gilts — one of them larger — and no shares. */
function alexMovingLean() {
  const raw = asMoving(alexRaw({ expected: [] }), { stop: '2027-04' });
  const big = L({ name: '4 1/8% Treasury Gilt 2027', sedol: 'BL6C772', units: 60000, value: 59980, kind: 'gilt' });
  raw.holdings.lines = raw.holdings.lines.filter((l) => !CONV.includes(l) && l !== SHARES && l !== FUND).concat([big, CONV[1], CONV[2]]);
  return plan(raw);
}

describe('(1) in a move, a gilt outside the rungs funds the ladder, as 7.10.0 had it', () => {
  it('£50 of cash and three gilts maturing in the cash years: the gilts are for sale, no cash is freed by them', () => {
    const p = alexMovingLean();
    const m = moveInputs(p, { now: noon(TODAY) });
    const t = m.diff.totals;
    expect(t.cashHeld).toBe(50);
    expect(m.diff).not.toHaveProperty('cashGilts');
    expect(t).not.toHaveProperty('cashFreed');
    expect(m.diff.sell.filter((x) => x.kind === 'gilt' && !x.taxYears).map((x) => [x.label, x.why])).toEqual(
      ['4 1/8% Treasury Gilt 2027', '4¼% Treasury Gilt 2027', '1 5/8% Treasury Gilt 2028'].map((l) => [l, 'not in the plan — proceeds fund the ladder']));
    expect(t.shortfall).toBe(Math.max(0, t.buyCost - t.sellValue));
    const seq = sequence(m.diff, { today: noon(TODAY), startYear: 2027 });
    expect(seq.totals).not.toHaveProperty('cashFreed');
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.mode).toBe('move');
    expect(V.schedule).not.toHaveProperty('cashFreed');
  });

  it('Sam: the cash to hold is the cash years\' money, and the spare or short is the pension\'s cash against it', () => {
    const p = sam();
    const m = moveInputs(p, { now: noon(TODAY) });
    const t = m.diff.totals;
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const pounds = (v) => '£' + Math.round(v).toLocaleString('en-GB');
    expect(V.cash).toEqual({ rows: expect.any(Array), target: pounds(t.cashTarget), held: pounds(t.cashHeld), spare: t.cashHeld >= t.cashTarget ? pounds(t.cashHeld - t.cashTarget) : null, short: t.cashHeld < t.cashTarget ? pounds(t.cashTarget - t.cashHeld) : null });
    const html = transitionHtml({ doc: p.planDocument, target: m.target, diff: m.diff, seq: null, prog: m.prog, holdings: p.holdings });
    expect(html).not.toContain('mature in those years');
    expect(html).not.toContain('before those gilts pay');
  });
});

describe('(2) no gilt pays a year by when it matures', () => {
  const p = alex();
  const g = gapsOf(p, { today: TODAY });

  it('Alex\'s 2026/27: the £50 of the pension\'s cash, then not covered from November — no gilt said to end it', () => {
    const r = g.rows[0];
    expect(r).toMatchObject({ Y: 2026, thisYear: true, monthsLeft: 5, need: Math.round(34000 * 5 / 12), cash: 50, gap: Math.round(34000 * 5 / 12) - 50 });
    expect(g.firstGap).toEqual({ Y: 2026, year: '2026/27', gap: r.gap, shortFrom: '2026-11', lastMonth: null });
    expect(words(g)).toContain('Without the money you expect, 2026/27’s money is not covered from November 2026.');
    expect(gapHeadline(g)).toMatchObject({ year: '2026/27' });
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).gap).toMatchObject({ year: '2026/27' });
  });

  it('2028/29: nothing held for it by the reading; the gilt maturing that October is money available', () => {
    const r = g.rows[2];
    expect(r).toMatchObject({ Y: 2028, held: 0, cash: 0, gap: 33000 });
    expect(g.gilts.find((x) => x.label === '1 5/8% Treasury Gilt 2028')).toMatchObject({ state: 'available', matures: '2028-10-22' });
  });

  it('with the money expected and the money available at today\'s value, every year is covered; no cash is left to say', () => {
    expect(g.withExpected).toEqual({ covered: false, short: g.totalGap - 25000 });
    expect(g.withHeld).toMatchObject({ covered: true });
    expect(words(g).some((w) => w.startsWith('After 2028/29, '))).toBe(false);
  });
});

describe('(3) in a move, What is covered never counts a line the move sells', () => {
  /** Sam, Moving, with money expected (so there is a reading), a gilt maturing before the first cash year and the 2030 gilt. */
  const samWith = () => {
    const raw = samRaw();
    raw.holdings.lines.push(L({ name: '4 1/8% Treasury Gilt 2027', sedol: 'BL6C772', units: 20000, value: 19990, kind: 'gilt' }));
    raw.holdings.expected = [{ id: 'e1', label: 'Pension elsewhere', amount: 10000, by: '2027-09' }];
    return sam(raw);
  };

  // Moved on purpose (7.11.1, the gilt-year guess removed): a gilt maturing before the first cash year is sold, as 7.10.0 had it
  it('the gilt maturing before the first cash year is the move\'s to sell, as 7.10.0 had it — never counted toward a year', () => {
    const p = samWith();
    const m = moveInputs(p, { now: noon(TODAY) });
    expect(m.target.running).toBe(false);
    expect(m.diff.sell.find((x) => x.label === '4 1/8% Treasury Gilt 2027')).toMatchObject({ why: 'not in the plan — proceeds fund the ladder' });
    expect(gapsOf(p, { today: TODAY }).gilts).toEqual([]);
  });

  it('no line is both in the move\'s Sell list and counted toward a year — on the move page, What you hold and the home', () => {
    const p = samWith();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.phase).toBe('moving');
    expect(V.mode).toBe('move');
    const sold = new Set(V.sell.map((x) => x.label));
    expect(sold.has('4 3/8% Treasury Gilt 2030')).toBe(true);
    const g = gapsOf(p, { today: TODAY });
    expect(g.held).toBe(false);
    expect(g.fromHeld).toBe(false);
    expect(g.gilts).toEqual([]);
    expect(g.outside.total).toBe(0);
    expect(V.gaps.lead).toBeUndefined();
    const hv = holdOf([{ plan: p }], p.id, { today: TODAY });
    for (const r of (hv.gaps ? hv.gaps.rows : [])) for (const part of r.parts) expect(sold.has(part.label)).toBe(false);
  });

  it('Sam as stored (nothing kept, nothing expected): no reading, as 7.10.0 had it', () => {
    const p = sam();
    expect(gapsOf(p, { today: TODAY })).toBe(null);
    expect(moveOf([{ plan: p }], p.id, { today: TODAY }).gaps).toBeUndefined();
    expect(transitionGaps(p, p.holdings, noon(TODAY))).toBe(null);
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).gap).toBeUndefined();
  });
});

describe('(4) a gilt that matured after the record was taken is the pension\'s cash now', () => {
  it('the day after the January gilt matures, its money is still there: the pension\'s cash, never lost', () => {
    const before = alex({ expected: [] }, '2027-01-28');
    const after = alex({ expected: [] }, '2027-01-30');
    const gb = gapsOf(before, { today: '2027-01-28' }), ga = gapsOf(after, { today: '2027-01-30' });
    // before it pays it is money available, set against no year; once paid it is the pension's cash, which pays the years
    expect(gb.gilts.find((y) => y.label === '4 1/8% Treasury Gilt 2027').state).toBe('available');
    expect(ga.totalGap).toBeLessThan(gb.totalGap);
    expect(ga.outside.gilts).toBe(gb.outside.gilts - 29990);
    const x = ga.gilts.find((y) => y.label === '4 1/8% Treasury Gilt 2027');
    expect(x.state).toBe('cashNow');
    const m = moveInputs(after, { now: noon('2027-01-30') });
    expect(m.diff.totals.cashHeld).toBe(50 + x.pays);
    expect(m.diff.sell.map((y) => y.label)).not.toContain('4 1/8% Treasury Gilt 2027');
    expect(words(ga)).toContain('4 1/8% Treasury Gilt 2027 matured in January 2027, after your record was taken, so the ' + '£' + x.pays.toLocaleString('en-GB') + ' it paid is counted as your pension’s cash.');
  });

  it('a record taken after the maturity: the pension\'s cash already holds it, so it is not counted again', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.updatedAt = '2027-02-01';
    for (const l of raw.holdings.lines) l.asOf = '2027-02-01';
    const p = plan(raw, '2027-02-05');
    const g = gapsOf(p, { today: '2027-02-05' });
    expect(g.gilts.find((y) => y.label === '4 1/8% Treasury Gilt 2027').state).toBe('paid');
    expect(moveInputs(p, { now: noon('2027-02-05') }).diff.totals.cashHeld).toBe(50);
  });
});

describe('(5) living on the plan, a rung not fully bought is never "still to buy"', () => {
  // Moved on purpose (7.11.1, the gilt-year guess removed): a gilt maturing in the rung's year no longer pays it; the share
  // fund is set against 2033/34 by the person's own choice, so the years to it are read
  it('a part-bought rung\'s year: the rung, then the pension\'s cash; what is left is not covered, never "to buy"', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ name: '4¼% Treasury Gilt 2032', units: 5000, value: 5000, kind: 'gilt' }));
    raw.holdings.lines = raw.holdings.lines.map((l) => (l === FUND || l.ticker === 'VWRP' ? { ...l, keep: { as: 'rung', taxYears: [2033] } } : l));
    const p = plan(raw);
    const g = gapsOf(p, { today: TODAY });
    expect(g.held).toBe(true);
    expect(g.toBuy).toBe(0);
    for (const r of g.rows) expect(r.toBuy).toBe(0);
    const r32 = g.rows.find((r) => r.Y === 2032);
    expect(r32.source).toBe('rung');
    expect(r32.rungs).toBeGreaterThan(0);
    expect(r32.held + r32.gap).toBe(r32.need);
    expect(r32.gap).toBeGreaterThan(0);
    expect(g.gilts.find((x) => x.label === '4¼% Treasury Gilt 2032')).toMatchObject({ state: 'available' });
    expect(words(g).some((x) => x.includes('once the plan’s buys are made'))).toBe(false);
  });

  it('Moving once what is held was accepted reads the same way: a cash year not held is not covered, never a buy', () => {
    const raw = samRaw();
    raw.phases = { moving: { agreed: { at: '2026-11-01T10:00:00.000Z', strategyId: raw.stressTool.settings.strategyId, how: 'asHeld', heldPct: 80, entryAt: '2026-11-01T10:00:00.000Z' } } };
    const p = sam(raw);
    const g = gapsOf(p, { today: TODAY });
    expect(g.held).toBe(true);
    for (const r of g.rows) expect(r.toBuy).toBe(0);
  });
});

describe('(7) one figure for the cash years', () => {
  it('the held page\'s cash line is what What is covered\'s cash years need, this year\'s months to come only', () => {
    const p = alex();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const g = gapsOf(p, { today: TODAY });
    const need = g.rows.filter((r) => r.source === 'cash' || r.source === 'thisYear').reduce((s, r) => s + r.need, 0);
    expect(V.heldInfo.cash.id).toBe('cashThisYear');
    expect(V.heldInfo.cash.target).toBe('£' + need.toLocaleString('en-GB'));
    expect(yearNeedsOf(p.planDocument)[2026].need).toBe(34000);
  });
});

describe('(8) every gilt outside the rungs is money available, whatever its maturity', () => {
  it('a gilt maturing after the plan\'s last year, and one whose maturity cannot be told: their value today is counted with the gilts', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ name: 'Treasury 2027', units: 30000, value: 29900, kind: 'gilt' }));
    raw.holdings.lines.push(L({ ticker: 'T73', name: '0 1/8% Index-linked Treasury Gilt 2073', units: 6000, value: 3000, kind: 'gilt' }));
    const p = plan(raw);
    const g = gapsOf(p, { today: TODAY });
    const states = Object.fromEntries(g.gilts.map((x) => [x.label, x.state]));
    expect(states['Treasury 2027']).toBe('available');
    expect(states['0 1/8% Index-linked Treasury Gilt 2073']).toBe('available');
    expect(g.outside).toMatchObject({ total: 88230 + 29900 + 3000 + 12000 + 40000, gilts: 88230 + 29900 + 3000, funds: 52000 });
    expect(words(g)).toContain(GAPS.outsideCanFallGilts);
  });
});

describe('(9) a year that needs nothing says what pays it', () => {
  it('the State Pension, and a lump sum carried from an earlier year', () => {
    const raw = alexRaw({ expected: [] });
    raw.planDocument.timeline = raw.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, lump: 0, lumpIn: [], sp: 34000, other: 0 } : r));
    let g = gapsOf(plan(raw), { today: TODAY });
    expect(g.rows.find((r) => r.Y === 2027).paidBy).toBe('sp');
    expect(words(g)).toContain('2027/28 needs nothing from your pension: your State Pension pays it.');
    const raw2 = alexRaw({ expected: [] });
    raw2.planDocument.timeline = raw2.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, lump: 34000, lumpIn: [] } : r));
    g = gapsOf(plan(raw2), { today: TODAY });
    expect(g.rows.find((r) => r.Y === 2027).paidBy).toBe('lumpEarlier');
    expect(words(g)).toContain('2027/28 needs nothing from your pension: a lump sum the plan counts, carried from an earlier year, pays it.');
  });
});

describe('(10) the order sheet, where it is', () => {
  const p = alex();

  it('the full view has no order sheet on its tab: a rung\'s line points to the plan document', () => {
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: transitionGaps(p, p.holdings, noon(TODAY)), held });
    expect(html).not.toContain('on the order sheet below');
    expect(html).toContain('of the order sheet in your plan document.');
    // the reading of what is held opens with its lead, not "Your ladder, as locked."
    expect(html).not.toContain(GAPS.strategyNone);
  });

  it('the simple view, living on the plan: the sheet is what the plan holds — no "Buy" column, Bought beside each gilt', () => {
    const { root, text } = draw(stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }));
    const sheet = one(root, 'plan.move.sheet');
    expect(sheet).not.toBe(null);
    const heads = [...sheet.querySelectorAll('thead th')].map((x) => x.textContent);
    expect(heads.slice(0, 3)).toEqual(['#', MOVE.sheet.gilt, MOVE.sheet.columns.bought]);
    expect(heads).not.toContain(MOVE.sheet.columns.buy);
    expect(text).toContain('Bought says which you hold.');
    // two rungs are part bought, so how to give an order is still said
    expect(text).toContain(MOVE.sheet.order);
  });

  it('every rung held: how to give an order is not said', () => {
    const raw = alexRaw({ expected: [] });
    for (const l of raw.holdings.lines) if (l.ticker === 'TR31' || l.ticker === 'T41') { const o = raw.planDocument.strategy.r.plan.orders.find((x) => x.tidm === l.ticker); l.units = o.nominal; }
    const q = plan(raw);
    const { text } = draw(stateWith([{ plan: q }], '#/plan/' + q.id + '/move', { today: TODAY }));
    expect(text).not.toContain(MOVE.sheet.order);
  });
});

describe('(11) the full view says it plainly', () => {
  it('the Transition tab is named by the phase the home reads', () => {
    expect(transitionTabName(alex(), noon(TODAY))).toBe(PLAN.steps.move.short);
    expect(transitionTabName(sam(), noon(TODAY))).toBe('Transition');
    expect(moreSheetHtml({ version: '7.11.1', householdVisible: false, transitionName: PLAN.steps.move.short })).toContain(PLAN.steps.move.short + ': what you hold');
    expect(moreSheetHtml({ version: '7.11.1', householdVisible: false })).toContain('Transition: what you hold, and the move');
  });

  it('the page names its tab from the stored plan, and keeps "Transition" when it cannot read one', async () => {
    const doc = document.implementation.createHTMLDocument('tabs');
    doc.body.innerHTML = '<button class="tab" data-tab="transition">Transition</button>';
    expect(await nameTransitionTab(doc, async () => alex(), null, noon(TODAY))).toBe(PLAN.steps.move.short);
    expect(doc.querySelector('.tab').textContent).toBe(PLAN.steps.move.short);
    expect(await nameTransitionTab(doc, async () => { throw new Error('no plan'); }, null, noon(TODAY))).toBe('Transition');
    expect(doc.querySelector('.tab').textContent).toBe('Transition');
  });

  it('living on the plan, an ISA line is outside the pension — never "left alone" by a move — in both views', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 100, value: 13000, kind: 'fund', subClass: 'worldGrowth' }));
    const p = plan(raw);
    const { root } = draw(stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }));
    const keep = one(root, 'plan.move.keep');
    expect(keep.textContent).toContain('outside your pension, so not part of the plan’s mix');
    expect(keep.textContent).not.toMatch(/kept as it is/);
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, held });
    expect(html).toContain(MOVE.held.outsideTitle);
    expect(html).not.toContain('Left alone:');
  });

  // Moved on purpose (7.11.1, the gilt-year guess removed): a gilt's line says when it matures, a fact, and no year
  it('a gilt outside the rungs says its value and when it matures — never a year it is "counted toward"', () => {
    const p = alex();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const line = V.heldInfo.lines.find((x) => x.label === '4¼% Treasury Gilt 2027');
    expect(line.id).toBe('gilt');
    expect(fill(MOVE.held[line.id], line)).toBe('4¼% Treasury Gilt 2027 (£31,860 today): matures in December 2027.');
    for (const x of V.heldInfo.lines) expect(fill(MOVE.held[x.id], x)).not.toMatch(/counted toward|counts toward/);
  });
});

describe('(12) the moving view reads a rung part bought as Living on it does (the walk)', () => {
  it('Sam: a part-bought rung is said with its units held, and its years are never "no gilt bought yet"', () => {
    const p = sam();
    const m = moveInputs(p, { now: noon(TODAY) });
    const part = m.diff.buy.filter((b) => b.kind === 'gilt' && +b.heldUnits > 0);
    expect(part.length).toBeGreaterThan(0);
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const partYears = part.flatMap((b) => b.taxYears.map((y) => y + '/' + String(y + 1).slice(2)));
    for (const y of partYears) expect(V.cost.uncovered).not.toContain(y);
    expect(V.cost.parts).toHaveLength(part.length);
    expect(V.cost.parts[0]).toMatchObject({ held: Math.round(part[0].heldUnits).toLocaleString('en-GB'), units: Math.round(part[0].units + part[0].heldUnits).toLocaleString('en-GB') });
    expect(V.status).toMatchObject({ id: 'giltsPart', slots: { part: String(part.length) } });
    const { root } = draw(stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }));
    const lines = [...root.querySelectorAll('[data-testid="plan.move.cost.part"]')].map((e) => e.textContent);
    expect(lines[0]).toBe(fill(MOVE.cost.part, V.cost.parts[0]));
    expect(one(root, 'plan.move.status.line').textContent).toContain('part bought');
  });
});

/**
 * 7.11.1 — the review of "What is covered" read with what is held, and of "Your plan's mix" by phase. Each block is one
 * finding, and each fails on the code before its fix.
 *
 *   (1) the cash the gilts maturing in the cash years free for the buys is cash that is held — never what a gilt pays later;
 *   (2) a gilt pays in the month it matures: the months of its year before then are paid from the pension's cash;
 *   (3) in a move (Moving, nothing accepted) What is covered never counts a line the move sells; a gilt maturing before the
 *       first cash year is that year's cash, never a sale;
 *   (4) a gilt that matured after the record was taken is the pension's cash now, never money that vanishes;
 *   (5) living on the plan, a rung not fully bought is never "still to buy": what is not held is not covered;
 *   (6) (tests/holdingsPasteRung.test.js) a pasted conventional gilt never takes an index-linked rung's identity;
 *   (7) the cash line and What is covered give one figure for the cash years;
 *   (8) a gilt counted toward no year is not ignored: its value today is counted beside the shares and funds;
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
import { gapsOf, gapSentences, sayGapLine, gapHeadline } from '../../../src/answers/plan/gaps.js';
import { GAPS } from '../../../src/v7/copy/gaps.js';
import { MOVE } from '../../../src/v7/copy/move.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { holdOf } from '../../../src/answers/plan/hold.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { cashBeforeGilts, sequence, yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld, transitionGaps, transitionTabName } from '../../../src/ui/keepHoldingsUi.js';
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

describe('(1) the cash the gilts free is cash that is held', () => {
  it('£50 of cash and gilts that cover the cash years: nothing freed beyond the £50, and the buys stay short', () => {
    const p = alexMovingLean();
    const m = moveInputs(p, { now: noon(TODAY) });
    const t = m.diff.totals;
    expect(t.cashHeld).toBe(50);
    expect(m.diff.cashGilts.length).toBe(3);
    expect(t.cashFreed || 0).toBeLessThanOrEqual(t.cashHeld);
    expect(t.buyCost).toBeGreaterThan(0);
    expect(t.sellValue).toBe(0);
    expect(t.shortfall).toBe(t.buyCost - (t.cashFreed || 0));
    const seq = sequence(m.diff, { today: noon(TODAY), startYear: 2027 });
    expect(seq.funded).toBe(false);
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.mode).toBe('move');
    expect(V.schedule.funded).toBe(false);
  });

  it('Sam: the spare is never more than the cash held, and the freed cash is what the gilts make spare of it', () => {
    const p = sam();
    const m = moveInputs(p, { now: noon(TODAY) });
    const t = m.diff.totals;
    const cash = m.diff.hold.find((x) => x.kind === 'cash');
    expect(cash.spare).toBeLessThanOrEqual(t.cashHeld);
    expect(t.cashFreed).toBeLessThanOrEqual(Math.min(t.cashHeld, t.cashTarget));
    // the cash the years need with those gilts, and what is left of the pension's cash beyond it
    expect(cash.spare).toBe(Math.max(0, t.cashHeld - cash.fromCash));
    expect(t.cashFreed).toBe(Math.min(t.cashHeld, t.cashTarget) - Math.min(t.cashHeld, cash.fromCash));
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const num = (s) => +String(s).replace(/[£,]/g, '');
    expect(num(V.cash.spare)).toBeLessThanOrEqual(num(V.cash.held));
    const html = transitionHtml({ doc: p.planDocument, target: m.target, diff: m.diff, seq: null, prog: m.prog, holdings: p.holdings });
    const spare = /<td>Spare<\/td><td>£([\d,]+)<\/td>/.exec(html);
    expect(spare).not.toBe(null);
    expect(+spare[1].replace(/,/g, '')).toBeLessThanOrEqual(t.cashHeld);
  });

  it('cashBeforeGilts: the months before a gilt pays come from cash; with no gilts, the years\' money', () => {
    const years = [{ Y: 2027, money: 12000 }, { Y: 2028, money: 12000 }];
    expect(cashBeforeGilts(years, [])).toBe(24000);
    // a gilt paying 24,000 in April of the first year: nothing from cash
    expect(cashBeforeGilts(years, [{ matures: '2027-04-20', real: 24000 }])).toBe(0);
    // the same gilt paying in January 2028: April to December 2027 from cash (9 months of 1,000)
    expect(cashBeforeGilts(years, [{ matures: '2028-01-20', real: 24000 }])).toBe(9000);
    // a gilt paying before the years start is there from their first month
    expect(cashBeforeGilts(years, [{ matures: '2027-01-29', real: 30000 }])).toBe(0);
  });
});

describe('(2) a gilt pays in the month it matures', () => {
  const p = alex();
  const g = gapsOf(p, { today: TODAY });

  it('Alex\'s 2026/27: November and December have £50 from the pension\'s cash; the January gilt pays from January', () => {
    const r = g.rows[0];
    expect(r).toMatchObject({ Y: 2026, thisYear: true, monthsLeft: 5, need: Math.round(34000 * 5 / 12), cash: 50 });
    // three months (January to March) from the gilt; two (November and December) from cash, of which £50 is held
    expect(r.gilts[0].pays).toBe(Math.round(34000 / 12 * 3));
    expect(r.gap).toBe(Math.round(34000 / 12 * 2) - 50);
    expect(g.firstGap).toMatchObject({ Y: 2026, shortFrom: '2026-11', lastMonth: null, until: { label: '4 1/8% Treasury Gilt 2027', month: '2027-01' } });
    expect(words(g)).toContain('Without the money you expect, 2026/27’s money is not covered from November 2026 until 4 1/8% Treasury Gilt 2027 pays in January 2027.');
    expect(gapHeadline(g)).toMatchObject({ year: '2026/27' });
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).gap).toMatchObject({ year: '2026/27' });
  });

  it('2028/29: April to September from cash (the earlier gilts\' spare), the October gilt from October', () => {
    const r = g.rows[2];
    expect(r.Y).toBe(2028);
    expect(r.gilts[0].pays).toBe(Math.round(33000 / 12 * 6));
    expect(r.cash).toBe(Math.round(33000 / 12 * 6));
    expect(r.gap).toBe(0);
  });

  it('with the money expected and the shares at today\'s value, every year is covered; the cash left after is said', () => {
    expect(g.withExpected).toEqual({ covered: true, short: 0 });
    expect(words(g).some((w) => /^After 2028\/29, £[\d,]+ of your pension’s cash is left\.$/.test(w))).toBe(true);
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

  it('the gilt maturing before the first cash year is that year\'s cash, never a sale', () => {
    const p = samWith();
    const m = moveInputs(p, { now: noon(TODAY) });
    expect(m.target.running).toBe(false);
    const g27 = m.diff.cashGilts.find((x) => x.label === '4 1/8% Treasury Gilt 2027');
    expect(g27).toMatchObject({ taxYear: 2027 });
    expect(m.diff.sell.map((x) => x.label)).not.toContain('4 1/8% Treasury Gilt 2027');
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
    for (const x of g.gilts) expect(sold.has(x.label)).toBe(false);
    for (const r of g.rows) for (const x of r.gilts) expect(sold.has(x.label)).toBe(false);
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
  it('the day after the January gilt matures, its money is still there: no gap appears that nobody caused', () => {
    const before = alex({ expected: [] }, '2027-01-28');
    const after = alex({ expected: [] }, '2027-01-30');
    const gb = gapsOf(before, { today: '2027-01-28' }), ga = gapsOf(after, { today: '2027-01-30' });
    expect(gb.totalGap).toBe(0);
    expect(ga.totalGap).toBe(0);
    expect(homeOf([{ plan: after }], after.id, { today: '2027-01-30' }).gap).toBeUndefined();
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
  it('a gilt counted in a part-bought rung\'s year: the rung, the gilt, then the pension\'s cash; what is left is not covered', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ name: '4¼% Treasury Gilt 2032', units: 5000, value: 5000, kind: 'gilt' }));
    const p = plan(raw);
    const g = gapsOf(p, { today: TODAY });
    expect(g.held).toBe(true);
    expect(g.toBuy).toBe(0);
    for (const r of g.rows) expect(r.toBuy).toBe(0);
    const r32 = g.rows.find((r) => r.Y === 2032);
    expect(r32.source).toBe('rung');
    expect(r32.gilts[0].pays).toBeGreaterThan(0);
    // the pension's cash the earlier gilts left pays the rest of the part-bought rung's year
    expect(r32.held + r32.gap).toBe(r32.need);
    expect(r32.cash).toBeGreaterThan(0);
    const w = words(g);
    expect(w.some((x) => x.includes('once the plan’s buys are made'))).toBe(false);
    expect(w.some((x) => x.startsWith('After 2032/33, '))).toBe(true);
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

describe('(8) a gilt counted toward no year is not ignored', () => {
  it('a gilt maturing after the plan\'s last year, and one whose maturity cannot be told: their value today is counted beside the shares', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ name: 'Treasury 2027', units: 30000, value: 29900, kind: 'gilt' }));
    raw.holdings.lines.push(L({ ticker: 'T73', name: '0 1/8% Index-linked Treasury Gilt 2073', units: 6000, value: 3000, kind: 'gilt' }));
    const p = plan(raw);
    const g = gapsOf(p, { today: TODAY });
    const states = Object.fromEntries(g.gilts.map((x) => [x.label, x.state]));
    expect(states['Treasury 2027']).toBe('unknown');
    expect(states['0 1/8% Index-linked Treasury Gilt 2073']).toBe('after');
    expect(g.outside.total).toBe(12000 + 40000 + 29900 + 3000);
    expect(g.outside.gilts).toBe(true);
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

  it('a gilt counted toward a year that needs none of it says so, beside a row that shows nothing held', () => {
    const p = alex();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    const line = V.heldInfo.lines.find((x) => x.label === '4¼% Treasury Gilt 2027');
    expect(line.id).toBe('giltAllCash');
  });
});

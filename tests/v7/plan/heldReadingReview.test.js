/**
 * 7.11.1 — the review of "What is covered" read with what is held, and of "Your plan's mix" by phase. Each block is one
 * finding, and each fails on the code before its fix.
 *
 *   (1) moved on purpose (7.11.1, the gilt-year guess removed): in a move, a gilt outside the rungs funds the ladder as 7.10.0
 *       had it — no gilt is a cash year's cash by when it matures, so no cash is "freed" by one;
 *   (2) moved on purpose, as (1): no gilt pays a year by when it matures (7.12.0: the cash years' need is said once, against
 *       all the money the pension holds — "Your plan's mix", answers/plan/held.js);
 *   (3) in a move (Moving, nothing accepted) What is covered never counts a line the move sells;
 *   (4) a gilt that matured after the record was taken is the pension's cash now, never money that vanishes;
 *   (5) living on the plan, a rung not fully bought is never "still to buy": it is held below the plan's units;
 *   (6) (tests/holdingsPasteRung.test.js) a pasted conventional gilt never takes an index-linked rung's identity;
 *   (7) the cash line and What is covered give one figure for the cash years;
 *   (8) every gilt outside the rungs is money available, whatever its maturity: its value today is counted beside the shares;
 *   (9) a year that needs nothing says what pays it: the State Pension, or a lump sum carried from an earlier year;
 *  (10) moved on purpose (7.12.0): living on the plan, neither view prints an order sheet — one table, the plan's gilts beside
 *       what is held, in both; the sheet as locked is in the plan document;
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
import { heldLadder, heldLadderView, sayHeld } from '../../../src/answers/plan/held.js';
import { HELD } from '../../../src/v7/copy/held.js';

const words = (g) => gapSentences(g).map((l) => sayGapLine(l, GAPS));
/** Every sentence "Your plan's mix" says, in words (7.12.0). */
const page = (h) => { const out = []; const walk = (x) => { if (!x) return; if (Array.isArray(x)) x.forEach(walk); else if (x.key) out.push(sayHeld(x, HELD)); else if (typeof x === 'object') Object.values(x).forEach(walk); }; walk(heldLadderView(h)); return out; };
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

// retaken in 7.12.0: a line outside the ladder is money the plan does not use — the buys take what they need of it, never a sale each
describe('(1) in a move, a gilt outside the rungs is money the plan does not use', () => {
  it('£50 of cash and three gilts maturing in the cash years: the gilts are outside the plan, no cash is freed by them', () => {
    const p = alexMovingLean();
    const m = moveInputs(p, { now: noon(TODAY) });
    const t = m.diff.totals;
    expect(t.cashHeld).toBe(50);
    expect(m.diff).not.toHaveProperty('cashGilts');
    expect(t).not.toHaveProperty('cashFreed');
    expect(m.diff.outside.filter((x) => x.kind === 'gilt').map((x) => x.label)).toEqual(['4 1/8% Treasury Gilt 2027', '4¼% Treasury Gilt 2027', '1 5/8% Treasury Gilt 2028']);
    expect(t.shortfall).toBe(m.diff.funding.short);
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
    expect(V.cash).toMatchObject({ rows: expect.any(Array), target: pounds(t.cashTarget), held: pounds(t.cashHeld), spare: t.cashHeld >= t.cashTarget ? pounds(t.cashHeld - t.cashTarget) : null, short: t.cashHeld < t.cashTarget ? pounds(t.cashTarget - t.cashHeld) : null });
    const html = transitionHtml({ doc: p.planDocument, target: m.target, diff: m.diff, seq: null, prog: m.prog, holdings: p.holdings });
    expect(html).not.toContain('mature in those years');
    expect(html).not.toContain('before those gilts pay');
  });
});

describe('(2) no gilt pays a year by when it matures', () => {
  // Moved on purpose (7.12.0): the cash years' need is said once, against all the money the pension holds at today's value —
  // never filled from the cash alone and the rest called "not covered"
  const p = alex();
  const h = heldLadder(p, { today: TODAY });

  it('Alex\'s 2026/27: the five months to come, said once; no year "not covered", no gilt said to pay it', () => {
    expect(h.cashYears.rows[0]).toMatchObject({ Y: 2026, thisYear: true, monthsLeft: 5, need: Math.round(34000 * 5 / 12) });
    expect(gapsOf(p, { today: TODAY })).toBe(null);
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).gap).toBeUndefined();
    expect(page(h).some((t) => /not (yet )?covered/.test(t))).toBe(false);
  });

  it('2028/29: its need is the plan\'s; the gilt maturing that October is a line with its day, set against no year', () => {
    expect(h.cashYears.rows[2]).toMatchObject({ Y: 2028, need: 33000 });
    expect(h.lines.find((x) => x.label === '1 5/8% Treasury Gilt 2028')).toMatchObject({ matures: '2028-10-22', note: null });
  });

  it('the money expected is never counted; the money held is', () => {
    expect(h.money.available).toBe(50 + 88230 + 52000);
    expect(page(h)).toContain('Pension elsewhere: £25,000, expected by June 2027. It is not counted, because it may not arrive.');
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
  // retaken in 7.12.0: outside the plan, with the day it matures as a fact — never a year it is for
  it('the gilt maturing before the first cash year is outside the plan — never counted toward a year', () => {
    const p = samWith();
    const m = moveInputs(p, { now: noon(TODAY) });
    expect(m.target.running).toBe(false);
    expect(m.diff.outside.find((x) => x.label === '4 1/8% Treasury Gilt 2027')).toMatchObject({ kind: 'gilt', matures: '2027-01-29' });
    expect(m.diff.outside.find((x) => x.label === '4 1/8% Treasury Gilt 2027')).not.toHaveProperty('cashYear');
    // 7.12.0: the reading of what is kept has no list of gilts at all now
    expect(gapsOf(p, { today: TODAY })).not.toHaveProperty('gilts');
  });

  it('no line is both in the move\'s Sell list and counted toward a year — on the move page, What you hold and the home', () => {
    const p = samWith();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.phase).toBe('moving');
    expect(V.mode).toBe('move');
    const sold = new Set(V.outside.map((x) => x.label));   // retaken in 7.12.0: what the plan does not use
    expect(sold.has('4 3/8% Treasury Gilt 2030')).toBe(true);
    // 7.12.0: the reading of what is kept carries nothing of what is held beside it
    const g = gapsOf(p, { today: TODAY });
    for (const k of ['held', 'fromHeld', 'gilts', 'outside']) expect(g).not.toHaveProperty(k);
    expect(V.gaps).not.toHaveProperty('lead');
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
    const hb = heldLadder(before, { today: '2027-01-28' }), ha = heldLadder(after, { today: '2027-01-30' });
    // before it pays it is a gilt the pension holds; once paid it is the pension's cash
    expect(hb.lines.find((y) => y.label === '4 1/8% Treasury Gilt 2027')).toMatchObject({ note: null, value: 29990 });
    const x = ha.lines.find((y) => y.label === '4 1/8% Treasury Gilt 2027');
    expect(x.note).toBe('cashNow');
    expect(ha.money.gilts).toBe(hb.money.gilts - 29990);
    expect(ha.money.cash).toBe(50 + x.pays);
    const m = moveInputs(after, { now: noon('2027-01-30') });
    expect(m.diff.totals.cashHeld).toBe(50 + x.pays);
    expect(m.diff.sell.map((y) => y.label)).not.toContain('4 1/8% Treasury Gilt 2027');
    expect(page(ha)).toContain('4 1/8% Treasury Gilt 2027 matured in January 2027, after your record was taken, so the ' + '£' + x.pays.toLocaleString('en-GB') + ' it paid counts as your pension’s cash.');
  });

  it('a record taken after the maturity: the pension\'s cash already holds it, so it is not counted again', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.updatedAt = '2027-02-01';
    for (const l of raw.holdings.lines) l.asOf = '2027-02-01';
    const p = plan(raw, '2027-02-05');
    const h = heldLadder(p, { today: '2027-02-05' });
    expect(h.lines.find((y) => y.label === '4 1/8% Treasury Gilt 2027').note).toBe('paid');
    expect(h.money.cash).toBe(50);
    expect(moveInputs(p, { now: noon('2027-02-05') }).diff.totals.cashHeld).toBe(50);
  });
});

describe('(5) living on the plan, a rung not fully bought is never "still to buy"', () => {
  // Moved on purpose (7.12.0): a part-bought gilt is held below the plan's units, and the page says what that changes
  it('a part-bought rung: held below the plan\'s units, with what its year pays less; never "to buy"', () => {
    const h = heldLadder(alex({ expected: [] }), { today: TODAY });
    expect(h.gilts.rows.find((r) => r.code === 'TR31')).toMatchObject({ state: 'under', heldUnits: 2000, planUnits: 15500 });
    const w = page(h);
    expect(w).toContain('Where you hold fewer units than the plan has, those years pay less than the plan says.');
    expect(w.some((x) => /to buy|buys are made|Buy\b/.test(x))).toBe(false);
  });

  it('Moving once what is held was accepted reads the same way, each cash year in full and no timing line', () => {
    const raw = samRaw();
    raw.phases = { moving: { agreed: { at: '2026-11-01T10:00:00.000Z', strategyId: raw.stressTool.settings.strategyId, how: 'asHeld', heldPct: 80, entryAt: '2026-11-01T10:00:00.000Z' } } };
    const p = sam(raw);
    expect(gapsOf(p, { today: TODAY })).toBe(null);
    const h = heldLadder(p, { today: TODAY });
    expect(h.agreed).toBe('2026-11-01T10:00:00.000Z');
    expect(page(h)[0]).toBe('You accepted what you hold as your plan on 1 November 2026.');
    const needs = yearNeedsOf(p.planDocument);
    for (const r of h.cashYears.rows) { expect(r.thisYear).toBe(false); expect(r.need).toBe(Math.round(needs[r.Y].need)); }
    expect(h.timing).toBe(null);
  });
});

describe('(7) one figure for the cash years', () => {
  it('the move page and "Your plan\'s mix" give one figure: this year\'s months to come, then each later cash year', () => {
    const p = alex();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.heldInfo.cashYears.need).toBe(Math.round(34000 * 5 / 12 + 0 + 33000));
    expect(V.heldInfo.cash).toBeUndefined();
    expect(yearNeedsOf(p.planDocument)[2026].need).toBe(34000);
  });
});

describe('(8) every gilt outside the rungs is money available, whatever its maturity', () => {
  it('a gilt maturing after the plan\'s last year, and one whose maturity cannot be told: their value today is counted with the gilts', () => {
    const raw = alexRaw({ expected: [] });
    raw.holdings.lines.push(L({ name: 'Treasury 2027', units: 30000, value: 29900, kind: 'gilt' }));
    raw.holdings.lines.push(L({ ticker: 'T73', name: '0 1/8% Index-linked Treasury Gilt 2073', units: 6000, value: 3000, kind: 'gilt' }));
    const h = heldLadder(plan(raw), { today: TODAY });
    expect(h.lines.find((x) => x.label === 'Treasury 2027').note).toBe('unknown');
    expect(h.lines.find((x) => x.label === '0 1/8% Index-linked Treasury Gilt 2073')).toMatchObject({ note: null, indexLinked: true });
    expect(h.money).toMatchObject({ gilts: 88230 + 29900 + 3000, funds: 52000 });
    expect(page(h)).toContain(HELD.riskGilts);
    expect(page(h)).toContain(HELD.riskFunds);
  });
});

describe('(9) a year that needs nothing says what pays it', () => {
  it('the State Pension, and a lump sum carried from an earlier year', () => {
    const raw = alexRaw({ expected: [] });
    raw.planDocument.timeline = raw.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, lump: 0, lumpIn: [], sp: 34000, other: 0 } : r));
    let h = heldLadder(plan(raw), { today: TODAY });
    expect(h.cashYears.rows.find((r) => r.Y === 2027).paidBy).toBe('sp');
    expect(page(h)).toContain('£0: your State Pension pays it');
    const raw2 = alexRaw({ expected: [] });
    raw2.planDocument.timeline = raw2.planDocument.timeline.map((r) => (r.taxYear === '2027/28' ? { ...r, lump: 34000, lumpIn: [] } : r));
    h = heldLadder(plan(raw2), { today: TODAY });
    expect(h.cashYears.rows.find((r) => r.Y === 2027).paidBy).toBe('lumpEarlier');
    expect(page(h)).toContain('£0: a lump sum the plan counts, carried from an earlier year, pays it');
  });
});

describe('(10) the order sheet, where it is', () => {
  // Moved on purpose (7.12.0): living on the plan, neither view prints an order sheet; one table — the plan's gilts beside what
  // is held of each — is on both, and the sheet as locked is in the plan document
  const p = alex();

  it('the full view: the plan\'s gilts beside what is held, no order sheet and no line pointing to one', () => {
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: transitionGaps(p, p.holdings, noon(TODAY)), held });
    expect(html).not.toContain('order sheet');
    expect(html).toContain(HELD.giltColumns.plan);
    expect(html).not.toContain(GAPS.strategyNone);
  });

  it('the simple view, living on the plan: no sheet, the same table', () => {
    const { root, text } = draw(stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }));
    expect(one(root, 'plan.move.sheet')).toBe(null);
    const heads = [...one(root, 'plan.move.heldLadder.gilts').querySelectorAll('thead th')].map((x) => x.textContent);
    expect(heads).toEqual(Object.values(HELD.giltColumns));
    expect(text).not.toContain(MOVE.sheet.order);
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
    // retaken in 7.12.0: an ISA is outside the plan's money when the plan holds it aside (otherwise the plan counts it)
    raw.planDocument.pots = { ...raw.planDocument.pots, isaPolicy: 'hold' };
    const p = plan(raw);
    const { root } = draw(stateWith([{ plan: p }], '#/plan/' + p.id + '/move', { today: TODAY }));
    // 7.12.0: on "Your plan's mix" itself
    const keep = one(root, 'plan.move.heldLadder.outside');
    expect(keep.textContent).toContain('outside your pension, so not part of the plan’s mix');
    expect(keep.textContent).not.toMatch(/kept as it is/);
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, held });
    expect(html).toContain(MOVE.held.outsideTitle);
    expect(html).not.toContain('Left alone:');
  });

  // Moved on purpose (7.11.1, the gilt-year guess removed; 7.12.0 a table row): a gilt's line says when it matures, a fact, and no year
  it('a gilt outside the rungs says its value and when it matures — never a year it is "counted toward"', () => {
    const p = alex();
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    // round 3: it pays inside the cash years, so it is a row of the dated table — the day it pays and what it pays then
    // (32,000 + three half-coupons of 680 = 34,040), in 2027/28's row — and not a second time in the also table
    expect(V.heldView.lines.find((x) => x.what === '4¼% Treasury Gilt 2027')).toBe(undefined);
    const row = V.heldView.cash.rows.find((r) => r.id === '2027');
    expect(sayHeld(row.arrives, HELD)).toBe('£34,040 on 7 December 2027: 4¼% Treasury Gilt 2027');
    for (const t of page(V.heldInfo)) expect(t).not.toMatch(/counted toward|counts toward/);
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

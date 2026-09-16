import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { transitionHtml, holdingsCardHtml, HOLDING_WRAPPERS } from '../src/ui/components/TransitionView.js';
import { targetHoldings, diffHoldings, sequence, progress } from '../src/services/TransitionPlanner.js';
import { rotationStatus } from '../src/services/RotationStatus.js';
import { parse } from '../src/ui/inlineHandlers.js';

// The three-rung ladder from the planner tests, anchored on 2027/28 (cash years 2027, 2028; rungs 2029, 2030, 2031-32)
const ladderDoc = {
  timing: { firstTaxYear: 2027, shapeAgeNow: 57, startMonth: '2027-04', mode: 'retired' },
  strategy: { id: 'full-il-gilt', contract: true, params: {}, r: { plan: {
    firstTaxYear: 2027, cash: 60000, cashYears: [{ Y: 2027 }, { Y: 2028 }],
    orders: [
      { name: 'IL Treasury 2029', tidm: 'TR29', sedol: 'B3D4RD5', matures: '2029-03-22', pays: 40000, nominal: 36000, cleanPrice: 105, indexRatio: 1.05, cost: 39690, taxYears: [2029] },
      { name: 'IL Treasury 2030', tidm: 'TR30', sedol: 'B4PTCY7', matures: '2030-03-22', pays: 40000, nominal: 35000, cleanPrice: 104, indexRatio: 1.06, cost: 38584, taxYears: [2030] },
      { name: 'IL Treasury 2032', tidm: 'TR32', sedol: 'B7Z5M15', matures: '2032-03-22', pays: 40000, nominal: 33000, cleanPrice: 103, indexRatio: 1.10, cost: 37389, taxYears: [2031, 2032] }
    ] } } },
  pots: { sipp: 200000, isaPolicy: 'hold' }
};
const rotDoc = { ...ladderDoc, strategy: { ...ladderDoc.strategy, id: 'gilt-rotation', params: { rotateCutAge: 75, rotateTrigger: 30 } } };
const potDoc = { timing: { firstTaxYear: 2027, shapeAgeNow: 60 }, strategy: { id: 'pots-and-valves', contract: false, params: {} }, targetMix: [{ y: 0, equity: 50, bond: 40, cash: 10 }], pots: { sipp: 400000 } };
const emptyRecord = { version: 1, updatedAt: null, source: 'none', offerDismissed: false, lines: [] };
const line = (o) => ({ wrapper: 'SIPP', ticker: null, name: null, sedol: null, units: null, value: null, ocf: null, contribution: null, subClass: null, kind: null, asOf: null, ...o });
const stageBefore = { key: 'draft-retired', startLabel: '2027/28', firstTaxYear: 2027, startMonth: '2027-04' };

/** Build the page the way the shell does. */
function page(doc, holdings, { today = new Date(2026, 8, 10), offer = null, stage = stageBefore, rotation = null } = {}) {
  const target = targetHoldings(doc, { today });
  const lines = holdings && Array.isArray(holdings.lines) ? holdings.lines : [];
  const diff = diffHoldings(lines, target);
  const seq = target.kind === 'none' ? null : sequence(diff, { today, startYear: 2027, startMonth: stage && stage.startMonth, contributionsMonthly: 0 });
  const prog = progress(diff, {});
  return { html: transitionHtml({ stage, doc, target, diff, seq, prog, done: {}, holdings, offer, rotation, startLabel: stage ? stage.startLabel : '' }), diff, target };
}
const handlers = (html) => [...html.matchAll(/data-on-(?:click|input|change)="([^"]*)"/g)].map((m) => m[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"'));

describe('What you hold — the holdings record card', () => {
  it('offers the Stress tester\'s fund list once when the record is empty, with the two handlers', () => {
    const offer = { taggedFunds: [{ ticker: 'TR29', value: 39690, wrapper: 'SIPP' }, { ticker: 'TR30', value: 38584, wrapper: 'SIPP' }, { ticker: 'CSH2', value: 60000, wrapper: 'SIPP' }] };
    const { html } = page(ladderDoc, emptyRecord, { offer });
    expect(html).toContain('Your Stress tester\'s fund list has 3 lines (TR29, TR30, CSH2). Is that what you actually hold?');
    expect(html).toContain('data-on-click="importHoldingsFromStress()"');
    expect(html).toContain('data-on-click="dismissHoldingsOffer()"');
    expect(html).not.toContain('Nothing recorded yet');
  });
  it('no offer once dismissed, or once the record has lines', () => {
    const offer = { taggedFunds: [{ ticker: 'TR29', value: 39690 }] };
    expect(page(ladderDoc, { ...emptyRecord, offerDismissed: true }, { offer }).html).not.toContain('importHoldingsFromStress');
    expect(page(ladderDoc, { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 })] }, { offer }).html).not.toContain('importHoldingsFromStress');
  });
  it('empty and no offer: says so, and the transition warns that everything reads as "to buy"', () => {
    const { html } = page(ladderDoc, emptyRecord);
    expect(html).toContain('Nothing recorded yet — paste from your platform or add lines.');
    expect(html).toContain('everything below reads as "to buy"');
    expect(html).not.toContain('My funds');
    expect(html).not.toContain('openMyFunds');
    expect(html).not.toContain('pasteHoldingsFromTransition');
  });
  it('renders each line as an editable row with the exact handlers, plus the add row and the buttons', () => {
    const rec = { version: 1, updatedAt: '2026-09-16', source: 'paste', offerDismissed: false, lines: [line({ wrapper: 'SIPP', ticker: 'TR29', name: 'IL Treasury 2029', units: 36000, value: 39690 }), line({ wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard <FTSE> "All-World"', value: 60000 })] };
    const html = holdingsCardHtml({ holdings: rec });
    expect(html).toContain('Recorded 16 September 2026, pasted from your platform');
    for (const f of ['wrapper', 'ticker', 'name', 'units', 'value']) { expect(html).toContain('data-on-change="updHolding(0,\'' + f + '\',this.value)"'); expect(html).toContain('data-on-change="updHolding(1,\'' + f + '\',this.value)"'); }
    expect(html).toContain('data-on-click="removeHolding(0)"');
    expect(html).toContain('data-on-click="removeHolding(1)"');
    expect(html).toContain('data-on-click="addHoldingLine()"');
    expect(html).toContain('data-on-click="pasteHoldings()"');
    expect(html).toContain('data-on-click="saveHoldingsUI()"');
    for (const id of ['hlTicker', 'hlName', 'hlWrapper', 'hlValue', 'hlUnits']) expect(html).toContain('id="' + id + '"');
    expect(html).toContain('value="36000"');
    expect(html).toContain('value="39690"');
    expect(html).toContain('<option value="ISA" selected>');
    expect(html).toContain('Vanguard &lt;FTSE&gt; &quot;All-World&quot;');   // escaped, not injected
    expect(html).not.toContain('<FTSE>');
    expect(html).toContain('Total £99,690 — SIPP £39,690 · ISA £60,000');
    expect(HOLDING_WRAPPERS).toEqual(['SIPP', 'ISA', 'GIA', 'CASH']);
  });
  it('every inline handler parses under the no-eval grammar — no arrows, no optional chaining', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ wrapper: 'GIA', ticker: 'VWRP', value: 1000 })] };
    const offerHtml = page(ladderDoc, emptyRecord, { offer: { taggedFunds: [{ ticker: 'X', value: 1 }] } }).html;
    const all = [...handlers(page(ladderDoc, rec).html), ...handlers(offerHtml)];
    expect(all.length).toBeGreaterThan(12);
    for (const e of all) { expect(e).not.toMatch(/=>|\?\./); expect(() => parse(e)).not.toThrow(); }
  });
  it('the holdings card is shown even before there is a plan document', () => {
    const { html } = page(null, emptyRecord);
    expect(html).toContain('What you hold');
    expect(html).toContain('data-on-click="saveHoldingsUI()"');
    expect(html).toContain('Lock the plan');
  });
});

describe('status — complete, run-up, rotation', () => {
  it('a fully held ladder mid-run reads complete: the paid rung is not a target, cash is information', () => {
    // September 2030: 2027/28 and 2028/29 (cash) and 2029/30 (TR29) have all passed; TR30 pays this year, TR32 later
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR30', units: 35000, value: 38584 }), line({ ticker: 'TR32', units: 33000, value: 37389 }), line({ ticker: 'CSH2', value: 8000 }), line({ wrapper: 'ISA', ticker: 'VWRP', value: 70000 })] };
    const stage = { key: 'running', startLabel: '2027/28', firstTaxYear: 2027, startMonth: '2027-04' };
    const { html, diff, target } = page(ladderDoc, rec, { today: new Date(2030, 8, 10), stage });
    expect(target.running).toBe(true);
    expect(target.paid.map((p) => p.ticker)).toEqual(['TR29', 'TR30']);   // TR30 redeemed 22 March 2030: paid, whatever the tax year (6.13)
    expect(diff.complete).toBe(true);
    expect(diff.buy).toEqual([]);
    expect(diff.sell).toEqual([]);
    expect(diff.matured.map((m) => m.ticker)).toEqual(['TR30']);
    expect(html).toContain('Complete — nothing to do.</strong> Every rung the plan still needs is held.');
    expect(html).toContain('Cash: <strong>£8,000</strong> held; no cash years left');
    expect(html).toContain('Already paid: IL Treasury 2029 (TR29), IL Treasury 2030 (TR30)');
    expect(html).not.toContain('% of the target is held');
    expect(html).not.toContain('Totals: buy');
    expect(html).toContain('Left alone: VWRP (ISA, £70,000)');
  });
  it('a pot strategy whose mix is held reads complete with its own wording', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'VWRP', value: 200000 }), line({ ticker: 'IGLT', value: 160000 }), line({ ticker: 'CSH2', value: 40000 })] };
    const { html, diff } = page(potDoc, rec);
    expect(diff.complete).toBe(true);
    expect(html).toContain('Complete — the target mix is held.');
  });
  it('an incomplete ladder shows progress, the moves and the totals; the run-up note survives for a retiree in the bridge', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'VWRP', value: 150000 })] };
    const { html, diff } = page(ladderDoc, rec, { stage: { key: 'bridge', startLabel: '2027/28', firstTaxYear: 2027, startMonth: '2027-04' } });
    expect(diff.complete).toBe(false);
    expect(html).toContain('% of the target is held');
    expect(html).toContain('You are already retired: the months until 2027/28 are the run-up');
    expect(html).toContain('>Buy<');
    expect(html).toContain('>Sell<');
    expect(html).toContain('Totals: buy');
    expect(html).toContain('When — a schedule to the start');
    expect(html).toContain('toggleTransitionDone(');
  });
  it('the rotation line appears only when the strategy has a rotation, in the complete state too', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'TR30', units: 35000, value: 38584 }), line({ ticker: 'TR32', units: 33000, value: 37389 }), line({ ticker: 'CSH2', value: 60000 })] };
    const rotation = rotationStatus(rotDoc, { today: new Date(2026, 8, 10), ageToday: 57 });
    const { html, diff } = page(rotDoc, rec, { rotation });
    expect(diff.complete).toBe(true);
    expect(html).toContain('Only the rotation watch below remains.');
    expect(html).toContain('<strong>Rotation watch</strong> · Rotation watch armed: if world equities close 30% below their all-time high while you are 67 or younger, the rungs above 75 are sold and buy the equity fund. Nothing to do until then.');
    const plain = page(ladderDoc, rec, { rotation: rotationStatus(ladderDoc, { ageToday: 57 }) }).html;
    expect(plain).not.toContain('Rotation watch');
    const fired = page(rotDoc, rec, { rotation: rotationStatus(rotDoc, { ageToday: 61, params: { borrowedFloor: { soldAt: '2030-11-01' } } }) }).html;
    expect(fired).toContain('alert-warning" style="margin-top:8px;"><strong>Rotation watch</strong> · Rotation fired on 1 November 2030');
  });
  it('a stale line for a rung that has matured is flagged, not sold', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'TR30', units: 35000, value: 38584 }), line({ ticker: 'TR32', units: 33000, value: 37389 })] };
    const { html, diff } = page(ladderDoc, rec, { today: new Date(2030, 8, 10), stage: { key: 'running', startLabel: '2027/28' } });
    expect(diff.sell).toEqual([]);
    expect(diff.matured.map((m) => m.ticker)).toEqual(['TR29', 'TR30']);
    expect(diff.complete).toBe(true);
    expect(html).toContain('Still on your record but matured: TR29 — matured and paid in 2029/30 — remove it from your record; TR30 — matured and paid in 2030/31 — remove it from your record.');
  });
  it('spare SIPP cash before the start is shown as held and kept, never as a sale', () => {
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'TR30', units: 35000, value: 38584 }), line({ ticker: 'TR32', units: 33000, value: 37389 }), line({ ticker: 'CSH2', value: 90000 })] };
    const { html, diff } = page(ladderDoc, rec);
    expect(diff.sell).toEqual([]);
    expect(diff.complete).toBe(true);
    expect(html).toContain('£90,000 <span class="hint">(£30,000 spare — kept, not a sale)</span>');
    expect(html).not.toContain('>Sell<');
  });
  it('a fired rotation (live params): sold rungs are off the target, the equity fund is left alone, a stale sold line is flagged', () => {
    const doc = { ...rotDoc, strategy: { ...rotDoc.strategy, r: { plan: { ...rotDoc.strategy.r.plan, orders: [...rotDoc.strategy.r.plan.orders, { name: 'IL Treasury 2046', tidm: 'TR46', matures: '2046-03-22', pays: 40000, nominal: 30000, cleanPrice: 90, indexRatio: 1.2, cost: 32400, taxYears: [2046] }] } } } };
    const bf = { soldAt: '2031-03-02', tidms: ['TR46'], years: [{ Y: 2046, age: 76, need: 40000 }], proceeds: 32400 };
    const rec = { ...emptyRecord, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ ticker: 'TR30', units: 35000, value: 38584 }), line({ ticker: 'TR32', units: 33000, value: 37389 }), line({ ticker: 'CSH2', value: 60000 }), line({ ticker: 'VWRP', name: 'FTSE All-World', value: 32400 }), line({ ticker: 'TR46', units: 30000, value: 32400 })] };
    const today = new Date(2026, 8, 10);
    const target = targetHoldings(doc, { today, params: { floorToAge: 75, borrowedFloor: bf } });
    const diff = diffHoldings(rec.lines, target);
    const html = transitionHtml({ stage: stageBefore, doc, target, diff, seq: sequence(diff, { today, startYear: 2027 }), prog: progress(diff, {}), holdings: rec, rotation: rotationStatus(doc, { today, params: { borrowedFloor: bf } }), startLabel: '2027/28' });
    expect(diff.complete).toBe(true);
    expect(html).toContain('Sold by the rotation: IL Treasury 2046 (TR46) — no longer targets; the fund the proceeds bought is kept.');
    expect(html).toContain('Still on your record but sold: TR46 — sold by the rotation — remove it from your record.');
    expect(html).toContain('Left alone: VWRP (SIPP, £32,400)');
    expect(html).not.toContain('>Sell<');
    expect(html).toContain('Rotation fired on 2 March 2031');
  });
});

describe('What you hold — the shell\'s hooks (6.13.0)', () => {
  const rec = { version: 1, updatedAt: '2026-09-16', source: 'typed', offerDismissed: false, lines: [line({ ticker: 'TR29', units: 36000, value: 39690 }), line({ wrapper: 'CASH', name: 'Bank savings', value: 5000 })] };
  it('the card carries id="holdingsCard" so other pages can scroll to it, with or without a document', () => {
    expect(holdingsCardHtml({ holdings: rec })).toContain('<div class="card" id="holdingsCard">');
    expect(page(null, emptyRecord).html).toContain('id="holdingsCard"');
    expect((page(ladderDoc, rec).html.match(/id="holdingsCard"/g) || []).length).toBe(1);
  });
  it('row edits commit on CHANGE, never on input — the shell persists each commit without re-rendering per keystroke', () => {
    const html = holdingsCardHtml({ holdings: rec });
    expect(html).not.toContain('data-on-input=');
    expect((html.match(/data-on-change="updHolding\(/g) || []).length).toBe(2 * 5);   // two rows × five fields
    expect(html).toContain('Edits save when you leave the box; Remove and Paste save at once.');
    expect(holdingsCardHtml({ holdings: emptyRecord })).not.toContain('Edits save when you leave the box');   // no table, no hint
  });
  it('a CASH-wrapper line is left alone as bank money, not counted as the SIPP\'s cash', () => {
    const { html, diff } = page(ladderDoc, rec);
    expect(diff.keep.map((k) => k.why)).toEqual(['bank / savings cash — outside the pension, kept as it is']);
    expect(html).toContain('Left alone: Bank savings (CASH, £5,000)');
    expect(diff.totals.cashHeld).toBe(0);
  });
});

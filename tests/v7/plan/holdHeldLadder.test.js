/**
 * 7.12.0 — What you hold while living on a locked ladder. Everything held counts as it is: no "Keep this", no keep test, no
 * "What is covered". The page says the gilts held and what the cash years need against what the pension holds, in the words
 * "Your plan's mix" uses, and links there. One optional field, on a pension line that is neither one of the plan's gilts nor
 * cash, lets the person set the line against tax years — a label only, never pre-filled, changing no figure. In the full view
 * several such changes made quickly all land: each is applied to the record as the previous save left it.
 * Moving (nothing accepted) shows "Keep this" as before. Fictional plans only (_alexLiving.js).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { holdOf, holdPatch } from '../../../src/answers/plan/hold.js';
import { heldLadder, heldLadderView, sayHeld } from '../../../src/answers/plan/held.js';
import { keepTestOf } from '../../../src/answers/plan/keepTest.js';
import { HELD } from '../../../src/v7/copy/held.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { normaliseHoldings } from '../../../src/services/HoldingsRecord.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld, installKeepHandlers } from '../../../src/ui/keepHoldingsUi.js';
import { noon, stateWith } from './_plans.js';
import { asMoving } from './_alex.js';
import { TODAY, ORDERS, alexLivingRaw, living } from './_alexLiving.js';

const flat = (t) => t.replace(/\s+/g, ' ').trim();
const simple = (plan) => { const root = document.createElement('div'); render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/hold', { today: TODAY }), dispatch: () => {} }), root); return root; };
const full = (plan) => {
  const mi = moveInputs(plan, { now: noon(TODAY) });
  const div = document.createElement('div');
  div.innerHTML = transitionHtml({ doc: plan.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: plan.holdings, held: transitionHeld(plan, plan.holdings, noon(TODAY)) });
  return div;
};
const holdCard = (div) => div.querySelector('#holdingsCard');
const page = (hl) => { const out = []; const walk = (x) => { if (!x) return; if (Array.isArray(x)) x.forEach(walk); else if (x.key) out.push(sayHeld(x, HELD)); else if (typeof x === 'object') Object.values(x).forEach(walk); }; walk(heldLadderView(hl)); return out; };
const PLAN_TICKERS = new Set(ORDERS.map((o) => o.tidm));
// the pension lines that are neither one of the plan's gilts nor cash: three ordinary gilts, the 2026 gilt, four shares and a fund
const OTHER = ['TS27', 'TN28', 'TG29', 'TN26', 'ULVR', 'AZN', 'LGEN', 'NG.', 'VWRP'];

describe('the full view says the cash years once on its tab', () => {
  // What you hold and "Your plan's mix" share the full view's tab: the need (34,000 × 5/12 + 0 + 33,000 = £47,167) is said
  // once there, by the mix; the What you hold card points to it
  const plan = living(alexLivingRaw());
  it('one £47,167 on the tab, and the card points to the mix', () => {
    const div = full(plan);
    expect(flat(visibleText(div)).split('£47,167').length - 1).toBe(1);
    const card = flat(visibleText(holdCard(div)));
    expect(card).not.toContain('Your cash years need');
    expect(card).not.toContain('All 14 of your plan’s gilts are held.');
    expect(card).toContain('Everything here counts as yours, as it is.');
    expect(holdCard(div).querySelector('a[href="#heldLadder"]')).toBeTruthy();
  });
});

describe('(a) both views: three lines and a link, and nothing about keeping', () => {
  const plan = living(alexLivingRaw());
  it('the simple view', () => {
    const text = flat(visibleText(simple(plan)));
    // the cash years need 34,000 × 5/12 + 0 + 33,000 = £47,167; the pension holds 12 + 103,930 + 23,300 = £127,242
    expect(text).toContain('All 14 of your plan’s gilts are held.');
    expect(text).toContain('Your cash years need £47,167. Beside the plan’s gilts your pension holds £127,242 at today’s value.');
    expect(text).toContain('Everything here counts as yours, as it is.');
    expect(text).toContain(HELD.holdLinkMix);
    for (const w of ['Keep this', 'Not kept', 'Kept by choice', 'What is covered', 'not yet tested', 'I accept this risk']) expect(text.includes(w), w).toBe(false);
  });
  it('the full view', () => {
    // retaken in 7.12.0: the card shares its tab with "Your plan's mix", which says the gilts held and the cash years' need
    // (£47,167); the card no longer says them a second time, only that everything counts and where to read it
    const text = flat(visibleText(holdCard(full(plan))));
    expect(text).not.toContain('Your cash years need');
    expect(text).toContain('Everything here counts as yours, as it is.');
    expect(text).toContain(HELD.holdLinkMix);
    for (const w of ['Keep this', 'Not kept', 'Kept by choice', 'What is covered', 'not yet tested']) expect(text.includes(w), w).toBe(false);
  });
  it('no keep test is read for a ladder in the held phase', () => {
    const lines = plan.holdings.lines.map((l) => (l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: true } } : l));
    const marked = { ...plan, holdings: { ...plan.holdings, lines } };
    expect(keepTestOf(marked, {})).not.toBe(null);
    expect(keepTestOf(marked, { today: TODAY })).toBe(null);
  });
});

describe('(b) the year field: only on a pension line that is neither one of the plan\'s gilts nor cash, and empty', () => {
  const plan = living(alexLivingRaw());
  const lines = normaliseHoldings(plan.holdings).lines;
  it('the simple view', () => {
    const v = holdOf([{ plan }], plan.id, { today: TODAY });
    const all = v.groups.flatMap((g) => g.lines);
    const withField = all.filter((l) => l.forYears).map((l) => l.ticker);
    expect(withField.sort()).toEqual(OTHER.slice().sort());
    for (const l of all.filter((x) => x.forYears)) expect(l.forYears.shown).toBe('');
    for (const l of all) expect(l).not.toHaveProperty('keep');
    const root = simple(plan);
    for (const [i, l] of lines.entries()) {
      const box = root.querySelector(`[data-testid="plan.hold.line.${i}.forYears"]`);
      if (OTHER.includes(l.ticker)) { expect(box, l.ticker).not.toBe(null); expect(box.value).toBe(''); expect(box.getAttribute('placeholder')).toBe(HELD.forYearsPlaceholder); }
      else expect(box, l.ticker).toBe(null);
    }
    expect(flat(visibleText(root))).toContain(HELD.forYearsHelp);
  });
  it('the full view', () => {
    const card = holdCard(full(plan));
    for (const [i, l] of lines.entries()) {
      const box = card.querySelector(`input[data-on-change="keepHoldingFor(${i},this.value)"]`);
      if (OTHER.includes(l.ticker)) { expect(box, l.ticker).not.toBe(null); expect(box.getAttribute('value')).toBe(''); }
      else expect(box, l.ticker).toBe(null);
      expect(PLAN_TICKERS.has(l.ticker) || l.ticker === 'XSTR' || OTHER.includes(l.ticker)).toBe(true);
    }
    expect(card.querySelector('select[aria-label="Keep this"]')).toBe(null);
  });
});

describe('(c) setting the 2029 gilt against 2028/29 saves the shape that exists and changes no figure', () => {
  const plan = living(alexLivingRaw());
  const i = normaliseHoldings(plan.holdings).lines.findIndex((l) => l.ticker === 'TG29');
  const before = heldLadder(plan, { today: TODAY });
  it('typed, saved, read: a label only', () => {
    const v = holdOf([{ plan }], plan.id, { today: TODAY, typed: { [`line.${i}.forYears`]: '2028/29' } });
    const l = v.groups.flatMap((g) => g.lines).find((x) => x.index === i);
    expect(l.forYears.change).toEqual({ kind: 'keep', index: i, keep: { as: 'rung', taxYears: [2028] } });
    const w = holdPatch(plan, l.forYears.change, { today: TODAY });
    expect(w.ok).toBe(true);
    expect(w.patch.holdings.lines[i].keep).toEqual({ as: 'rung', taxYears: [2028] });
    const after = { ...plan, holdings: w.patch.holdings };
    const h2 = heldLadder(after, { today: TODAY });
    for (const k of ['cashYears', 'money', 'state', 'more', 'less', 'timing', 'gilts']) expect(h2[k]).toEqual(before[k]);
    expect(page(h2)).toContain('You set 0½% Treasury Gilt 2029 against 2028/29.');
    // shown on What you hold as the person's choice
    const v2 = holdOf([{ plan: after }], plan.id, { today: TODAY });
    const l2 = v2.groups.flatMap((g) => g.lines).find((x) => x.index === i);
    expect(l2.forYears).toMatchObject({ shown: '2028/29', saved: { years: '2028/29' } });
    expect(flat(visibleText(simple(after)))).toContain('For 2028/29 (your choice)');
    // emptied: keep null
    const v3 = holdOf([{ plan: after }], plan.id, { today: TODAY, typed: { [`line.${i}.forYears`]: '' } });
    const l3 = v3.groups.flatMap((g) => g.lines).find((x) => x.index === i);
    expect(l3.forYears.change).toEqual({ kind: 'keep', index: i, keep: null });
  });
  it('the full view saves the same', async () => {
    const saved = [];
    const w = {};
    // the record on screen is the one last saved, as the page has it once a save lands
    installKeepHandlers(w, { draft: () => saved[saved.length - 1] || plan.holdings, persist: async (rec) => { saved.push(rec); }, toast: () => {} });
    w.keepHoldingFor(i, '2028/29');
    await new Promise((r) => setTimeout(r, 0));
    expect(saved[saved.length - 1].lines[i].keep).toEqual({ as: 'rung', taxYears: [2028] });
    const after = { ...plan, holdings: saved[saved.length - 1] };
    w.keepHoldingFor(i, '');
    await new Promise((r) => setTimeout(r, 0));
    expect(saved[saved.length - 1].lines[i].keep == null).toBe(true);
    expect(flat(visibleText(holdCard(full(after))))).toContain('For 2028/29 (your choice)');
  });
});

describe('(d) several quick changes in the full view all land', () => {
  it('three changes made before the first save lands leave all three lines marked', async () => {
    const plan = living(alexLivingRaw());
    const lines = normaliseHoldings(plan.holdings).lines;
    const idx = ['TS27', 'TN28', 'TG29'].map((t) => lines.findIndex((l) => l.ticker === t));
    const saved = [];
    let release;
    const gate = new Promise((r) => { release = r; });
    const w = {};
    // the record on screen stays as it was until a save lands; the first save resolves late
    installKeepHandlers(w, { draft: () => plan.holdings, persist: async (rec) => { if (!saved.length) await gate; saved.push(rec); }, toast: () => {} });
    w.keepHoldingYears(idx[0], '2026/27');
    w.keepHoldingYears(idx[1], '2027/28');
    w.keepHoldingYears(idx[2], '2028/29');
    release();
    for (let k = 0; k < 10; k++) await new Promise((r) => setTimeout(r, 0));
    const last = saved[saved.length - 1];
    expect(idx.map((i) => last.lines[i].keep)).toEqual([{ as: 'rung', taxYears: [2026] }, { as: 'rung', taxYears: [2027] }, { as: 'rung', taxYears: [2028] }]);
  });
});

describe('(e) Moving, nothing accepted: "Keep this" as before', () => {
  const plan = living(asMoving(alexLivingRaw()));
  it('the simple view offers it, and no year field', () => {
    const v = holdOf([{ plan }], plan.id, { today: TODAY });
    expect(v.canKeep).toBe(true);
    expect(v.heldLadder).toBeUndefined();
    const all = v.groups.flatMap((g) => g.lines);
    for (const l of all) { expect(l.keep).toBeTruthy(); expect(l).not.toHaveProperty('forYears'); }
    expect(flat(visibleText(simple(plan)))).toContain('Keep this');
  });
  it('the full view offers it', () => {
    const card = holdCard(full(plan));
    expect(card.querySelectorAll('select[aria-label="Keep this"]').length).toBe(normaliseHoldings(plan.holdings).lines.length);
    expect(card.querySelector('input[data-on-change^="keepHoldingFor("]')).toBe(null);
  });
});

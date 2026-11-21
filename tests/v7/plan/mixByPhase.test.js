/**
 * 7.11.1 — "Your plan's mix" by phase. The phase is the one the home reads (answers/plan/read.js planPage `life`,
 * LifeStage.stageOf: agreements first, then facts). Living on it, or Moving once what is held was accepted, the page is not a
 * move: no Buy or Sell to place, no "When", no "Next", no "What skipping it costs", no totals, no lead about buying and
 * selling. On a ladder (7.12.0) it is the one reading of answers/plan/held.js: the plan's gilts beside what is held of each,
 * the cash years and the money the pension holds for them, and what else it holds (a gilt with the day it matures, a fact
 * only: it is set against no year). No order sheet; the rotation watch stays. Moving (inside the window, nothing accepted) the
 * move is as 7.10.0 built it: a gilt outside the rungs funds the ladder, whatever year it matures in (7.11.1 first made one
 * maturing in a cash year that year's cash, then took that back — gilts are often bought to mature before the year their money
 * is for). Both views read the one module (move.js).
 *
 * Alex (fictional, tests/v7/plan/_alex.js): locked ladder, living on it, months recorded, three cash years ahead, three
 * conventional gilts maturing one in each of them, two rungs part bought, shares and a fund outside the mix, £50 of cash, one sum
 * expected. Sam (fictional): a locked ladder, Moving — work stops in April 2027 — with linkers and a conventional gilt
 * maturing in its two cash years, another gilt maturing later, and a world share fund.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { MOVE } from '../../../src/v7/copy/move.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { unmarked } from '../../../src/reading/mark.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { diffHoldings, targetHoldings, yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
import { stateWith, entryOf, noon, corpus } from './_plans.js';
import { ALEX_TODAY as TODAY, alex, alexRaw, CONV, samRaw, SAM_CONV, asMoving } from './_alex.js';
import { heldLadder } from '../../../src/answers/plan/held.js';
import { HELD } from '../../../src/v7/copy/held.js';

const T = 'plan.move';
const SCOPES = ['all', 'record', 'retired', 'planner', 'result'];
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return { root, text: visibleText(root), words: visibleText(copy) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const onPage = (plan, today = TODAY) => draw(stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today }));
const sam = (today = TODAY) => entryOf(samRaw(), today).plan;
/** Sam once what is held was accepted (7.10.0's agreement), before the month work stops: Moving by agreement. */
const samAgreed = () => {
  const raw = samRaw();
  raw.phases = { moving: { agreed: { at: '2026-11-01T10:00:00.000Z', strategyId: raw.stressTool.settings.strategyId, how: 'asHeld', heldPct: 80, entryAt: '2026-11-01T10:00:00.000Z' } } };
  return entryOf(raw, TODAY).plan;
};

describe('Living on it: "Your plan\'s mix" is what is held, never a move', () => {
  const p = alex();
  const V = moveOf([{ plan: p }], p.id, { today: TODAY });

  // Moved on purpose (7.12.0): the page is "Your plan's mix", the one reading (held.js) — the plan's gilts beside what is held,
  // the cash years against the money the pension holds, and what else it holds — and no order sheet
  it('reads the phase the home reads, and says what is held as information', () => {
    expect(planPage([{ plan: p }], p.id, 'move', { today: TODAY }).life.key).toBe('drawing');
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).stage.key).toBe('drawing');
    expect(V.phase).toBe('drawing');
    expect(V.mode).toBe('held');
    const I = V.heldInfo;
    expect(I).toEqual(heldLadder(p, { today: TODAY }));
    expect(I.kind).toBe('ladder');
    // the plan's gilts: two held below the plan's units
    expect(I.gilts.rows.filter((r) => r.state !== 'same').map((r) => [r.code, r.state, r.heldUnits, r.planUnits])).toEqual([['TR31', 'under', 2000, 15500], ['T41', 'under', 500, 7800]]);
    expect(I.gilts.held).toBe(I.gilts.total - 2);
    // every line beside the plan's gilts, with the day a gilt matures and no tax year
    expect(I.lines.map((x) => [x.label, x.kind, x.matures])).toEqual([
      ['4 1/8% Treasury Gilt 2027', 'gilt', '2027-01-29'], ['4¼% Treasury Gilt 2027', 'gilt', '2027-12-07'], ['1 5/8% Treasury Gilt 2028', 'gilt', '2028-10-22'],
      ['Example Shares plc', 'fund', null], ['Vanguard FTSE All-World (Acc)', 'fund', null]]);
    for (const x of I.lines) expect(x).not.toHaveProperty('year');
    expect(I.money.cash).toBe(50);
  });

  it('the page draws no Buy, Sell, When, Next, totals, "What skipping it costs" or order sheet — and says what is held', () => {
    const { root, text, words } = onPage(p);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.move');
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-mode')).toBe('held');
    expect(one(root, 'plan.step.move').textContent).toBe(PLAN.steps.move.short);
    for (const id of ['buy', 'sell', 'held', 'next', 'totals', 'schedule', 'cost', 'how', 'optional', 'start', 'cash', 'cashInfo', 'sheet', 'gaps', 'heldInfo']) expect(one(root, `${T}.${id}`), id).toBe(null);
    expect(root.querySelectorAll('input[type="checkbox"]').length).toBe(0);
    expect(text).not.toMatch(/what to buy and sell|Next: (buy|sell)|Totals: buy|What skipping it costs|By [A-Z][a-z]+ \d{4}: (buy|sell)|proceeds pay for the ladder|more than the rung needs/);
    expect(text).toContain(HELD.lead);
    expect(text).not.toContain(MOVE.held.lead);
    expect(one(root, `${T}.heldLadder.figure`).textContent).toBe('12 of 14 of your plan’s gilts are held.');
    const tr31 = one(root, `${T}.heldLadder.gilts`).querySelector('tr[data-key="gilt:TR31"]');
    expect([...tr31.querySelectorAll('td')].map((td) => td.textContent).slice(0, 4)).toEqual(['0 1/8% Index-linked Treasury Gilt 2031 (TR31)', '2032/33', '15,500', '2,000']);
    const also = one(root, `${T}.heldLadder.also`).textContent;
    // round 3: a gilt that pays inside the cash years is a row of the dated table, on its day, with what it pays then
    // (30,000 + one half-coupon of 618.75 = £30,619), and not a second time in the also table
    expect(also).not.toContain('4 1/8% Treasury Gilt 2027');
    const row = one(root, `${T}.heldLadder.cashYears`).querySelector('tr[data-when="2027-01-29"]');
    expect([...row.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['29 January 2027', '—', '£30,619: 4 1/8% Treasury Gilt 2027']);
    expect(also).toContain('Example Shares plc£12,000');
    expect(also).not.toMatch(/counted toward/);
    expect(one(root, `${T}.heldLadder.footer`).textContent).toBe(HELD.footer);
    expect(one(root, `${T}.footer`)).toBe(null);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\btransition\b|\bnominal\b|\bwrappers?\b|run-?up|\byou should\b/i);
  });

  it('the full view reads the same module and draws the same, with no Buy, Sell, totals or schedule', () => {
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    // retaken in 7.12.0: transitionHeld also carries the move's readings both views word the same way
    expect(held).toMatchObject({ mode: 'held', heldInfo: V.heldInfo, heldView: V.heldView, phase: 'drawing' });
    const mi = moveInputs(p, { now: noon(TODAY) });
    // the count is marked (gilts.held, step F6): the words are read without their marks
    const html = unmarked(transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: ((transitionHeld(p, p.holdings, noon(TODAY)) || {}).gaps || null), held }));
    expect(html).not.toMatch(/>Sell<|>Buy<|Totals: buy|When — a schedule|toggleTransitionDone|Next: <strong>|Things the schedule assumes/);
    expect(html).toContain(HELD.lead);
    expect(html).toContain('12 of 14 of your plan’s gilts are held.');
    expect(html).toContain('<td data-label="When">29 January 2027</td>');
    expect(html).not.toMatch(/counted toward \d{4}|mature in those years/);
  });

  it('the home names it "Your plan\'s mix" with what is held, never moves to make', () => {
    const home = homeOf([{ plan: p }], p.id, { today: TODAY });
    const tool = home.tools.find((t) => t.id === 'move');
    expect(tool).toBeTruthy();
    expect(JSON.stringify(tool.result)).not.toMatch(/moves done|ticked/);
    // the gilts held as the page counts them; no "Optional…" (that is the move's) on the step
    expect(tool.figures).toMatchObject({ bought: V.heldInfo.gilts.held, rungs: V.heldInfo.gilts.total });
    expect(tool.result.text).toBe('12 of 14 gilts held');
    expect(planPage([{ plan: p }], p.id, 'move', { today: TODAY }).steps.find((x) => x.id === 'move').notes).toEqual([]);
  });
  it('a pot plan living on it: the home says how much of the plan\'s mix is held, never moves done', () => {
    const raw = JSON.parse(JSON.stringify(corpus()['04-buckets-running']));
    const shares = raw.holdings.lines[0].value;
    raw.holdings.lines[0].value = Math.round(shares * 2 / 3);
    raw.holdings.lines[2].value = Math.round(raw.holdings.lines[2].value + shares / 3);
    const q = entryOf(raw, TODAY).plan;
    const tool = homeOf([{ plan: q }], q.id, { today: TODAY }).tools.find((t) => t.id === 'move');
    expect(tool.result.id).toBe('move.heldShare');
    expect(tool.result.text).toMatch(/^\d+% of the plan’s mix held$/);
    // read as Moving, it is the move's count, as before
    const m = entryOf(asMoving(JSON.parse(JSON.stringify(raw))), TODAY).plan;
    expect(homeOf([{ plan: m }], m.id, { today: TODAY }).tools.find((t) => t.id === 'move').result.id).toBe('move.moves');
  });
});

describe('Moving once what is held was accepted: not a move either', () => {
  it('Sam, agreed before the month work stops: the phase is Moving by agreement, the page is what is held', () => {
    const p = samAgreed();
    const pg = planPage([{ plan: p }], p.id, 'move', { today: TODAY });
    expect(pg.life).toMatchObject({ key: 'moving', by: 'agreement' });
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.mode).toBe('held');
    // 7.12.0: the one reading (held.js), its agreement first
    expect(V.heldInfo.agreed).toBe('2026-11-01T10:00:00.000Z');
    const { root, text } = onPage(p);
    expect(one(root, 'plan.step.move').textContent).toBe(PLAN.steps.move.short);
    for (const id of ['buy', 'sell', 'next', 'totals', 'schedule', 'cost']) expect(one(root, `${T}.${id}`), id).toBe(null);
    expect(one(root, `${T}.heldLadder.agreed`).textContent).toBe('You accepted what you hold as your plan on 1 November 2026.');
    expect(text).toContain(HELD.lead);
  });
});

// Moved on purpose (7.11.1, the gilt-year guess removed): Moving, a gilt outside the rungs is sold whatever year it matures in,
// as 7.10.0 built it — never set against a cash year by its maturity
describe('Moving, nothing accepted: the move as 7.10.0 built it', () => {
  const p = sam();
  const V = moveOf([{ plan: p }], p.id, { today: TODAY });
  // retaken in 7.12.0: a line outside the ladder is money the plan does not use — no Sell list, no "Next:"; "Paying for it" instead
  it('Sam reads Moving; the buys, what pays for them and the schedule are there', () => {
    expect(V.phase).toBe('moving');
    expect(V.mode).toBe('move');
    expect(V.heldInfo).toBe(null);
    expect(V.buy.length).toBeGreaterThan(0);
    expect(V.schedule.steps.length).toBeGreaterThan(0);
    const { root } = onPage(p);
    expect(one(root, `${T}.sell`)).toBe(null);
    expect(one(root, `${T}.next`)).toBe(null);
    expect(one(root, `${T}.paying`)).not.toBe(null);
    expect(one(root, `${T}.schedule`)).not.toBe(null);
  });
  it('every gilt outside the rungs, and the share fund, are money the plan does not use — whatever year the gilt matures in', () => {
    const sold = V.outside.map((s) => s.label);
    for (const l of ['1 5/8% Treasury Gilt 2028', '1¼% Index-linked Treasury Gilt 2027', '0 1/8% Index-linked Treasury Gilt 2028', '4 3/8% Treasury Gilt 2030', 'Vanguard FTSE All-World (Acc)']) expect(sold).toContain(l);
  });
  it('the cash to hold is the pension\'s cash against the cash years\' money: no row for gilts, nothing "freed"', () => {
    const diff = moveInputs(p, { now: noon(TODAY) }).diff;
    expect(diff).not.toHaveProperty('cashGilts');
    expect(diff.totals).not.toHaveProperty('cashFreed');
    expect(V.cash).not.toHaveProperty('gilts');
    const { root } = onPage(p);
    const rows = [...root.querySelectorAll(`[data-testid="${T}.cash.table"] tbody tr`)].map((tr) => tr.getAttribute('data-row'));
    expect(rows.slice(-3, -1)).toEqual(['total', 'held']);
    expect(['spare', 'short']).toContain(rows[rows.length - 1]);
    const mi = moveInputs(p, { now: noon(TODAY) });
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    expect(held.mode).toBe('move');
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, held });
    const title = MOVE.outside.title;
    const outsideTable = html.slice(html.indexOf(title), html.indexOf('</table>', html.indexOf(title)));
    expect(outsideTable).toContain('4 3/8% Treasury Gilt 2030');
    expect(outsideTable).toContain('1 5/8% Treasury Gilt 2028');
  });
  it('the rule is the diff\'s, for both views: each gilt outside the rungs is one more line the plan does not use', () => {
    const doc = p.planDocument;
    const target = targetHoldings(doc, { today: noon(TODAY) });
    const without = diffHoldings(p.holdings.lines.filter((l) => !SAM_CONV.some((c) => c.name === l.name)), target, { today: noon(TODAY), needs: yearNeedsOf(doc) });
    const withThem = diffHoldings(p.holdings.lines, target, { today: noon(TODAY), needs: yearNeedsOf(doc) });
    expect(withThem.outside.length).toBe(without.outside.length + SAM_CONV.length);
    expect(withThem.totals.cashHeld).toBe(without.totals.cashHeld);
  });
});

describe('Living on it: what the cash years\' lines say with the gilts and without', () => {
  // Moved on purpose (7.12.0): the cash years' need is set once against all the money the pension holds
  it('Alex without the three gilts: the cash, the shares and the fund are what the pension holds beside the plan\'s gilts', () => {
    const lines = alexRaw().holdings.lines.filter((l) => !CONV.some((c) => c.sedol === l.sedol));
    const p = alex({ lines });
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.heldInfo.money).toEqual({ cash: 50, gilts: 0, funds: 52000, available: 52050 });
    const { root } = onPage(p);
    const state = [...root.querySelectorAll(`[data-testid="${T}.heldLadder.state"]`)].map((e) => e.textContent);
    // 50 + 52,000 = 52,050 against 47,166.67: 4,883 more, part of it in shares and funds; no gilt pays in the cash years
    expect(state[0]).toBe('Your pension holds £50 in cash. With what else you hold, at today’s value, that is £4,883 more than these years need. Part of it is in shares and funds.');
  });
});

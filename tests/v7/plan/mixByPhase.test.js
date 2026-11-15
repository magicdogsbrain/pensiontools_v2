/**
 * 7.11.1 — "Your plan's mix" by phase. The phase is the one the home reads (answers/plan/read.js planPage `life`,
 * LifeStage.stageOf: agreements first, then facts). Living on it, or Moving once what is held was accepted, the page is not a
 * move: no Buy or Sell to place, no "When", no "Next", no "What skipping it costs", no totals, no lead about buying and
 * selling. It says, as information, the rungs held against the plan (a rung not fully bought with its order-sheet line), what
 * else the pension holds and what each line is doing, and the cash with the gilts that mature in the cash years. The order sheet
 * and the rotation watch stay. Moving (inside the window, nothing accepted) the move is as 7.10.0 built it, except that a gilt
 * maturing in a year the plan pays from cash is that year's cash, never a sale. Both views read the one module (move.js).
 *
 * Alex (fictional, tests/v7/plan/_alex.js): locked ladder, living on it, months recorded, three cash years ahead held as three
 * conventional gilts maturing one in each, two rungs part bought, shares and a fund outside the mix, £50 of cash, one sum
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
import { transitionHeld, transitionGaps } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { diffHoldings, targetHoldings, yearNeedsOf } from '../../../src/services/TransitionPlanner.js';
import { stateWith, entryOf, noon, corpus } from './_plans.js';
import { ALEX_TODAY as TODAY, alex, alexRaw, CONV, samRaw, SAM_CONV, asMoving } from './_alex.js';

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

  it('reads the phase the home reads, and says what is held as information', () => {
    expect(planPage([{ plan: p }], p.id, 'move', { today: TODAY }).life.key).toBe('drawing');
    expect(homeOf([{ plan: p }], p.id, { today: TODAY }).stage.key).toBe('drawing');
    expect(V.phase).toBe('drawing');
    expect(V.mode).toBe('held');
    const I = V.heldInfo;
    expect(I.kind).toBe('ladder');
    // the rungs: two part bought, each with its line of the order sheet
    const sheetN = (tidm) => String(V.sheet.find((r) => r.tidm === tidm).n);
    expect(I.rungs.rows.map((r) => [r.code, r.state, r.held, r.units, r.n])).toEqual([['TR31', 'part', '2,000', '15,500', sheetN('TR31')], ['T41', 'part', '500', '7,800', sheetN('T41')]]);
    expect(+I.rungs.held).toBe(+I.rungs.total - 2);
    // every line beside the rungs, with what it is doing
    expect(I.lines.map((x) => [x.label, x.role, x.state || null, x.year || null])).toEqual([
      ['4 1/8% Treasury Gilt 2027', 'gilt', 'counted', '2026/27'], ['4¼% Treasury Gilt 2027', 'gilt', 'counted', '2027/28'], ['1 5/8% Treasury Gilt 2028', 'gilt', 'counted', '2028/29'],
      ['Example Shares plc', 'outside', null, null], ['Vanguard FTSE All-World (Acc)', 'outside', null, null]]);
    // the cash line counts the gilts maturing in the cash years
    expect(I.cash.held).toBe('£50');
    expect(I.cash.years).toBe('2026/27, 2027/28, 2028/29');
    expect(I.cash.gilts).toMatch(/^£[\d,]+$/);
    expect(+I.cash.gilts.replace(/[£,]/g, '')).toBeGreaterThan(80000);
  });

  it('the page draws no Buy, Sell, When, Next, totals or "What skipping it costs" — and says what each line is doing', () => {
    const { root, text, words } = onPage(p);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.move');
    expect(root.querySelector('[data-region="plan-move"]').getAttribute('data-mode')).toBe('held');
    expect(one(root, 'plan.step.move').textContent).toBe(PLAN.steps.move.short);
    for (const id of ['buy', 'sell', 'held', 'next', 'totals', 'schedule', 'cost', 'how', 'optional', 'start', 'cash', 'cashInfo']) expect(one(root, `${T}.${id}`), id).toBe(null);
    expect(root.querySelectorAll('input[type="checkbox"]').length).toBe(0);
    expect(text).not.toMatch(/what to buy and sell|Next: (buy|sell)|Totals: buy|What skipping it costs|By [A-Z][a-z]+ \d{4}: (buy|sell)|proceeds pay for the ladder|more than the rung needs/);
    expect(text).toContain(MOVE.held.lead);
    expect(one(root, `${T}.heldInfo.rungs`).textContent).toBe(`${V.heldInfo.rungs.held} of the ${V.heldInfo.rungs.total} rungs your plan still needs are held.`);
    const lines = [...root.querySelectorAll(`[data-testid="${T}.heldInfo.rungRows"] li`)].map((li) => li.textContent);
    expect(lines[0]).toBe(`0 1/8% Index-linked Treasury Gilt 2031 (TR31), for 2032/33: 2,000 of 15,500 units held. The rest is rung ${V.heldInfo.rungs.rows[0].n} on the order sheet below.`);
    const also = one(root, `${T}.heldInfo.lines`).textContent;
    expect(also).toContain('4 1/8% Treasury Gilt 2027 (£29,990 today): matures in January 2027 — counted toward 2026/27 in What is covered, year by year.');
    expect(also).toContain('1 5/8% Treasury Gilt 2028 (£26,380 today): matures in October 2028 — counted toward 2028/29 in What is covered, year by year.');
    expect(also).toContain('Example Shares plc (£12,000 today): outside the plan’s mix; its value can fall.');
    expect(also).toContain('Vanguard FTSE All-World (Acc) (£40,000 today): outside the plan’s mix; its value can fall.');
    // this year's months still to come only (the review of 7.11.1): the same figure as What is covered's cash years
    expect(one(root, `${T}.heldInfo.cash`).textContent).toBe(`The cash years still ahead (2026/27, 2027/28, 2028/29; this one’s months still to come) need ${V.heldInfo.cash.target}. Held for them: £50 in your pension’s cash, and ${V.heldInfo.cash.gilts} at today’s prices from the gilts that mature in those years.`);
    // the order sheet stays, with the two rungs part bought
    expect([...root.querySelectorAll(`[data-testid="${T}.sheet.table"] tbody tr[data-bought="part"]`)].map((tr) => tr.textContent.includes('TR31') || tr.textContent.includes('T41'))).toEqual([true, true]);
    // What is covered, year by year, is read with what is held
    expect(one(root, `${T}.gaps`)).not.toBe(null);
    expect(one(root, `${T}.footer`).textContent).toBe(MOVE.footer);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\btransition\b|\bnominal\b|\bwrappers?\b|run-?up|\byou should\b/i);
  });

  it('the full view reads the same module and draws the same, with no Buy, Sell, totals or schedule', () => {
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    expect(held).toEqual({ mode: 'held', heldInfo: V.heldInfo, phase: 'drawing' });
    const mi = moveInputs(p, { now: noon(TODAY) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, gaps: transitionGaps(p, p.holdings, noon(TODAY)), held });
    expect(html).not.toMatch(/>Sell<|>Buy<|Totals: buy|When — a schedule|toggleTransitionDone|Next: <strong>|Things the schedule assumes/);
    expect(html).toContain(MOVE.held.lead);
    expect(html).toContain('matures in January 2027 — counted toward 2026/27 in What is covered, year by year.');
    expect(html).toContain('Example Shares plc (£12,000 today): outside the plan’s mix; its value can fall.');
    expect(html).toContain('2,000 of 15,500 units held.');
    expect(html).toContain('from the gilts that mature in those years');
  });

  it('the home names it "Your plan\'s mix" with what is held, never moves to make', () => {
    const home = homeOf([{ plan: p }], p.id, { today: TODAY });
    const tool = home.tools.find((t) => t.id === 'move');
    expect(tool).toBeTruthy();
    expect(JSON.stringify(tool.result)).not.toMatch(/moves done|ticked/);
    // the rungs bought as the page and the order sheet count them; no "Optional…" (that is the move's) on the step
    expect(tool.figures).toMatchObject({ bought: +V.heldInfo.rungs.held, rungs: +V.heldInfo.rungs.total });
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
    expect(V.heldInfo.agreed).toEqual({ date: '1 November 2026' });
    const { root, text } = onPage(p);
    expect(one(root, 'plan.step.move').textContent).toBe(PLAN.steps.move.short);
    for (const id of ['buy', 'sell', 'next', 'totals', 'schedule', 'cost']) expect(one(root, `${T}.${id}`), id).toBe(null);
    expect(one(root, `${T}.heldInfo.agreed`).textContent).toBe('You accepted what you hold as your plan on 1 November 2026.');
    expect(text).toContain(MOVE.held.lead);
  });
});

describe('Moving, nothing accepted: the move as 7.10.0 built it, but a gilt maturing in a cash year is that year\'s cash', () => {
  const p = sam();
  const V = moveOf([{ plan: p }], p.id, { today: TODAY });
  it('Sam reads Moving; the lists, the schedule and the next move are there', () => {
    expect(V.phase).toBe('moving');
    expect(V.mode).toBe('move');
    expect(V.heldInfo).toBe(null);
    expect(V.buy.length).toBeGreaterThan(0);
    expect(V.schedule.steps.length).toBeGreaterThan(0);
    const { root } = onPage(p);
    expect(one(root, `${T}.sell`)).not.toBe(null);
    expect(one(root, `${T}.next`)).not.toBe(null);
    expect(one(root, `${T}.schedule`)).not.toBe(null);
  });
  it('the gilts maturing in 2027/28 and 2028/29 (the cash years) are never for sale; a gilt maturing later and the share fund still are', () => {
    const sold = V.sell.map((s) => s.label);
    expect(sold).not.toContain('1 5/8% Treasury Gilt 2028');
    expect(sold).not.toContain('1¼% Index-linked Treasury Gilt 2027');
    expect(sold).not.toContain('0 1/8% Index-linked Treasury Gilt 2028');
    expect(sold).toContain('4 3/8% Treasury Gilt 2030');
    expect(sold).toContain('Vanguard FTSE All-World (Acc)');
  });
  it('the cash to hold counts them: a row for the gilts maturing in the cash years, and the spare or short with them', () => {
    const diff = moveInputs(p, { now: noon(TODAY) }).diff;
    expect(diff.cashGilts.map((g) => [g.label, g.taxYear])).toEqual([['1¼% Index-linked Treasury Gilt 2027', 2027], ['0 1/8% Index-linked Treasury Gilt 2028', 2028], ['1 5/8% Treasury Gilt 2028', 2028]]);
    const gilts = diff.cashGilts.reduce((s, g) => s + g.real, 0);
    expect(V.cash.gilts).toBe('£' + Math.round(gilts).toLocaleString('en-GB'));
    const { root } = onPage(p);
    const rows = [...root.querySelectorAll(`[data-testid="${T}.cash.table"] tbody tr`)].map((tr) => tr.getAttribute('data-row'));
    // 7.11.1 (the review): and what those years need from the pension's cash before the gilts pay; the spare is beyond it
    expect(rows).toEqual(['cashYear', 'cashYear', 'total', 'held', 'gilts', 'fromCash', 'spare']);
    expect(root.querySelector(`[data-testid="${T}.cash.table"] tr[data-row="gilts"]`).textContent).toContain(MOVE.cash.gilts);
    // the cash they leave spare pays for the buys, as their sale did: the schedule is paid for
    expect(diff.totals.cashFreed).toBeGreaterThan(0);
    expect(V.schedule.funded).toBe(true);
    expect(one(root, `${T}.schedule`).textContent).toContain(MOVE.schedule.fundedCash);
    // the full view: the same row, and the Sell table without them
    const mi = moveInputs(p, { now: noon(TODAY) });
    const held = transitionHeld(p, p.holdings, noon(TODAY));
    expect(held.mode).toBe('move');
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, held });
    expect(html).toContain('>Sell<');
    expect(html).toContain(MOVE.cash.gilts);
    const sellTable = html.slice(html.indexOf('>Sell<'), html.indexOf('</table>', html.indexOf('>Sell<')));
    expect(sellTable).toContain('4 3/8% Treasury Gilt 2030');
    expect(sellTable).not.toMatch(/1 5\/8% Treasury Gilt 2028|Index-linked Treasury Gilt 202[78]/);
  });
  it('the rule is the diff\'s, for both views: never a sale, counted toward the cash years', () => {
    const doc = p.planDocument;
    const target = targetHoldings(doc, { today: noon(TODAY) });
    const without = diffHoldings(p.holdings.lines.filter((l) => !SAM_CONV.some((c) => c.name === l.name) && !/Index-linked Treasury Gilt 202[78]/.test(l.name || '')), target, { today: noon(TODAY), needs: yearNeedsOf(doc) });
    const withThem = diffHoldings(p.holdings.lines, target, { today: noon(TODAY), needs: yearNeedsOf(doc) });
    expect(withThem.sell.length).toBe(without.sell.length + 1);   // only the gilt maturing in 2029/30
    expect(withThem.progressPct).toBeGreaterThanOrEqual(without.progressPct);
    expect(withThem.totals.cashHeld).toBe(without.totals.cashHeld);
  });
});

describe('Living on it: what the cash line says with the gilts and without', () => {
  it('Alex without the three gilts: the cash years are held as the pension\'s cash alone', () => {
    const lines = alexRaw().holdings.lines.filter((l) => !CONV.some((c) => c.sedol === l.sedol));
    const p = alex({ lines });
    const V = moveOf([{ plan: p }], p.id, { today: TODAY });
    expect(V.heldInfo.cash.gilts).toBe(null);
    const { root } = onPage(p);
    expect(one(root, `${T}.heldInfo.cash`).textContent).toBe(`The cash years still ahead (2026/27, 2027/28, 2028/29; this one’s months still to come) need ${V.heldInfo.cash.target}. Held for them: £50 in your pension’s cash.`);
  });
});

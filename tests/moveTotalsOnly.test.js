/**
 * A plan with totals only (7.12.0, the moving brief D3, joined at integration with the saver brief's one pension-today
 * reader, services/PensionToday.js): nothing listed under What you hold, so the move reads the plan's own pension as the
 * money that pays for the buys, says where that figure came from, and the Saving page starts from it, never from nothing.
 *
 * Fictional Alex (no real person's figures), today 16 November 2026, on the hand-built ladder of tests/helpers/samMove.js:
 *   the buys: TA30 40,000 units cost £60,000; TB31 20,000 units cost £30,000; cash years £26,000 + £26,400 = £52,400.
 *   need = 60,000 + 30,000 + 52,400 = £142,400 (nothing held, so no spare cash).
 *   The plan's pension total: 250,000 + 100,000 + 50,000 = £400,000; ISA £40,000.
 *   ISA counted (isaPolicy 'draw'): available = 400,000 + 40,000 = £440,000; toRaise = £142,400;
 *     leftOver = 440,000 − 142,400 = £297,600.
 *   ISA held aside: available = £400,000; leftOver = 400,000 − 142,400 = £257,600.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { moveInputs } from '../src/services/PlanReading.js';
import { payingOf } from '../src/answers/plan/moveWords.js';
import { fillMove } from '../src/answers/plan/moveWords.js';
import { MOVE } from '../src/v7/copy/move.js';
import { samDoc, SAM_TODAY as TODAY } from './helpers/samMove.js';

function alex({ isaPolicy = 'draw', holdings = null, history = [] } = {}) {
  return {
    id: 'AlexPlan01', planDetails: { name: 'Alex' },
    planDocument: samDoc({ pots: { sipp: 400000, isa: 40000, isaPolicy } }),
    stressTool: { settings: { configured: true, equityMin: 250000, bondMin: 100000, cashTarget: 50000, diversifierStart: 0, isaBalance: 40000, strategyId: 'gilt-ladder', strategyParams: {} } },
    decisionTool: { settings: { locked: true, lockedAt: '2026-10-01T09:00:00.000Z' }, history: [] },
    accumulationTool: { settings: { potNow: null }, history },
    ...(holdings ? { holdings } : {})
  };
}
const words = (p) => p.ids.map((id) => fillMove(MOVE.paying[id], { ...p.slots, from: MOVE.paying.from[p.slots.from] || p.slots.from })).join(' ');

describe('a plan with totals only pays for the move from its own pension', () => {
  it('nothing listed, the ISA counted: the plan\'s £400,000 and £40,000 pay for £142,400 of buys', () => {
    const m = moveInputs(alex(), { now: TODAY });
    expect(m.diff.funding).toMatchObject({ need: 142400, available: 440000, toRaise: 142400, leftOver: 297600, short: 0, fromPlan: true, listed: false });
    expect(words(payingOf(m.diff))).toBe('You have not listed what your pension holds, and you do not need to. Your plan has £400,000 in your pension and £40,000 in your ISA (from your plan). The buys come to £142,400. £142,400 of it pays for the buys; you choose which to sell. The other £297,600 is not needed for the ladder.');
  });
  it('the ISA held aside: only the pension pays, and the ISA is not said', () => {
    const m = moveInputs(alex({ isaPolicy: 'hold' }), { now: TODAY });
    expect(m.diff.funding).toMatchObject({ available: 400000, leftOver: 257600, fromPlan: true });
    expect(words(payingOf(m.diff))).toContain('Your plan has £400,000 in your pension (from your plan).');
  });
  it('a pot record wins over the plan\'s total, and is named as the record', () => {
    // by hand: the record's pension £410,000 + its ISA £40,000 = £450,000 available
    const m = moveInputs(alex({ history: [{ date: '2026-10', sipp: 410000, isa: 40000, gia: 0, total: 450000 }] }), { now: TODAY });
    expect(m.diff.funding).toMatchObject({ available: 450000, fromPlan: true });
    expect(words(payingOf(m.diff))).toContain('Your plan has £410,000 in your pension and £40,000 in your ISA (from your last record).');
  });
  it('a line listed in the pension: the listed money, as before', () => {
    const m = moveInputs(alex({ holdings: { lines: [{ wrapper: 'SIPP', ticker: 'WSHR', name: 'World share fund', value: 300000, subClass: 'globalEquity' }] } }), { now: TODAY });
    expect(m.diff.funding).toMatchObject({ available: 300000, fromPlan: false, listed: true });
  });
});

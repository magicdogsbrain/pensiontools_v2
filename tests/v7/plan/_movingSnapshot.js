/**
 * The readings 7.12.0 must leave exactly as they were (heldOneReader.test.js): a locked ladder read as Moving, nothing
 * accepted, with and without lines marked "Keep this"; and a pot plan living on it with a line kept. Not a test file. The JSON beside it was written from main (v7.11.1)
 * before the held-phase readers were changed.
 */
import { gapsOf, gapsView } from '../../../src/answers/plan/gaps.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { asMoving, samRaw, alexRaw } from './_alex.js';
import { entryOf, corpus } from './_plans.js';
import { TODAY, alexLines } from './_alexLiving.js';

const marked = (lines) => lines.map((l) => (l.ticker === 'TG29' ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: true } } : l));
export const MOVING = {
  alexMovingPlain: () => asMoving(alexRaw({ lines: alexLines() })),
  alexMovingMarked: () => asMoving(alexRaw({ lines: marked(alexLines()) })),
  samMoving: () => samRaw(),
  samMovingMarked: () => { const p = samRaw(); p.holdings.lines = p.holdings.lines.map((l, i) => (i === p.holdings.lines.length - 1 ? { ...l, keep: { as: 'rung', taxYears: [2028] } } : l)); return p; },
  // a pot plan living on it, a line kept by choice: pot plans read as before in every phase
  potLivingMarked: () => { const p = JSON.parse(JSON.stringify(corpus()['04-buckets-running'])); p.holdings.lines = p.holdings.lines.map((l, i) => (i === 0 ? { ...l, keep: { as: 'mine', fundsGaps: true } } : l)); return p; }
};
const pick = (v) => (v && v.found ? { mode: v.mode, heldInfo: v.heldInfo, status: v.status, buy: v.buy, sell: v.sell, hold: v.hold, keep: v.keep, cash: v.cash, cashInfo: v.cashInfo, standIn: v.standIn, kept: v.kept, covered: v.covered, gaps: v.gaps } : v);
export function movingReadings() {
  const out = {};
  for (const [name, make] of Object.entries(MOVING)) {
    const plan = entryOf(make(), TODAY).plan;
    out[name] = JSON.parse(JSON.stringify({ gaps: gapsView(gapsOf(plan, { today: TODAY })), move: pick(moveOf([{ plan }], plan.id, { today: TODAY })) }));
  }
  return out;
}

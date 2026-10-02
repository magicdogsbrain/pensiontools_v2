/**
 * The words of how ISAs and savings grow (6.22.0; research/saver-lock-and-savings-growth.md 3.6), the same in C, A and
 * B: the line under what was assumed (`savings-growth`, with Change to the choice) and, in A and B, the note when most of
 * the money at the stop is savings held mostly as cash (`savings-mostly-cash`).
 *
 * Before 6.22.0 every answer grew savings at a fixed 3% a year whatever prices did, and said so ("isa-fixed-growth",
 * "savings-as-isa", the important "savings-fixed-growth"). The owner's decision of 2 Oct 2026 replaced that with one
 * choice: "Mostly cash" (the default) — the pension's own cash rule, last year's rise in prices less 1%, never below
 * nothing (services/IsaGrowth.js) — or "Invested like my pension".
 *
 * Parts only (sentence parts: text, and { fixed } figures); pure.
 */
import { ISA_CASH_SPREAD, ISA_GROWTH } from '../../services/IsaGrowth.js';

const F = (fixed) => ({ fixed: String(fixed) });

/** How far below the rise in prices "Mostly cash" grows, in whole percent: 1. */
export const CASH_BELOW_PRICES_PCT = Math.round(-ISA_CASH_SPREAD * 100);

/**
 * The line under what was assumed, for the household's choice ('cash' | 'invested'; anything else reads as the default,
 * "Mostly cash").
 */
export function savingsGrowthParts(choice) {
  const isa = 'Your savings are treated as ISA money: tax-free to take. ';
  if (choice === ISA_GROWTH.INVESTED) return [isa, 'They are invested like your pension: the same mix of shares, bonds and cash, in the same futures.'];
  return [isa, 'They grow like cash: by last year\'s rise in prices less ', F(CASH_BELOW_PRICES_PCT), '%, or not at all if prices rose by less than ',
    F(CASH_BELOW_PRICES_PCT), '%.'];
}

/** A's and B's note when most of the money at the stop is savings, held mostly as cash: how to say they are invested. */
export function mostlyCashParts() {
  return ['Most of the money when you stop is in savings, treated as mostly cash, which grows a little more slowly than prices rise. ',
    'If yours are invested, choose "Invested like my pension" under the savings box.'];
}

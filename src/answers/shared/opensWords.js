/**
 * A pension still closed when the plan starts, said as the kept plan takes it (the lead's ruling G, 20 Nov 2026), as a
 * sentence's parts for the answers' warnings: the law's age and the plan's own first tax year, both facts
 * (PensionAge.pensionOpensPieces, the one builder), then what pays meanwhile only when there is other money to pay it.
 * "You can take money from your pension from 57. This plan takes it from April 2034, the first tax year you start at 57 or
 * over; until then your ISA and savings pay."
 */
import { pensionOpensPieces } from '../../services/PensionAge.js';

const F = (fixed) => ({ fixed: String(fixed) });

/** @param {{ accessAge: number, opensTaxYear: number }} opens  @param {{ meanwhile: boolean }} opts */
export function pensionOpensParts(opens, { meanwhile }) {
  const w = pensionOpensPieces(opens);
  const map = (list) => list.map((x) => (typeof x === 'string' ? x : x.date ? F(x.date) : F(x.age)));
  return [...map(w.law), ' ', ...map(w.plan), ...(meanwhile ? map(w.meanwhile) : ['.'])];
}

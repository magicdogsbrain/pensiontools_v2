/**
 * UK income tax, written out by hand from the published 2026/27 rules (England, Wales and Northern Ireland),
 * so the tests do not mark their own homework. Imports nothing from src/.
 *
 *   allowance £12,570; 20% on the next £37,700 of taxable income; 40% up to £125,140 of taxable income; 45% above;
 *   the allowance falls by £1 for every £2 of income over £100,000.
 *
 * The bands rise with prices inside the answer, so every function takes them as arguments (today's figures by default).
 */
export const TODAY = { pa: 12570, brl: 50270, hrl: 125140, taperFrom: 100000, taperRate: 0.5 };

/**
 * Tax on a gross taxable income in a year. The bands given may have risen with prices; the £100,000 point where
 * the allowance starts to shrink is a fixed figure in pounds of the day (as it is in law, frozen since 2010, and
 * as the app's engine has it), unless `taperFrom` says otherwise.
 */
export function ukTax(gross, bands = TODAY, { taperFrom = TODAY.taperFrom } = {}) {
  if (!(gross > 0)) return 0;
  const { pa, brl, hrl } = bands;
  const allowance = gross > taperFrom ? Math.max(0, pa - (gross - taperFrom) * TODAY.taperRate) : pa;
  const taxable = Math.max(0, gross - allowance);
  const basicBand = brl - pa;                                  // £37,700 of TAXABLE income
  const higherTo = hrl;                                        // 40% up to £125,140 of taxable income
  let tax = Math.min(taxable, basicBand) * 0.2;
  if (taxable > basicBand) tax += (Math.min(taxable, higherTo) - basicBand) * 0.4;
  if (taxable > higherTo) tax += (taxable - higherTo) * 0.45;
  return tax;
}

/**
 * From the pot to the pocket: `taken` from a pension in a year, a quarter tax-free unless the tax-free cash is
 * used up, on top of `other` taxable income.
 * @returns {{ taxed: number, tax: number, pocket: number }}   tax is the tax on everything (other income included)
 */
export function pocketFromPot(taken, other = 0, { taxFreeUsedUp = false, bands = TODAY } = {}) {
  const taxedPart = taxFreeUsedUp ? taken : taken * 0.75;
  const tax = ukTax(other + taxedPart, bands);
  return { taxed: other + taxedPart, tax, pocket: other + taken - tax };
}

/** Backwards: what must be taken from the pot for a given pocket (bisection on pocketFromPot; to well under a penny). */
export function potForPocket(pocket, other = 0, opts = {}) {
  const base = pocketFromPot(0, other, opts).pocket;
  if (pocket <= base) return 0;
  let lo = 0;
  let hi = (pocket - base) * 2 + 1000;
  while (pocketFromPot(hi, other, opts).pocket < pocket) hi *= 2;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (pocketFromPot(mid, other, opts).pocket < pocket) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The gross income that leaves `net` after tax (bisection; the inverse of gross − ukTax(gross)). */
export function grossFor(net, bands = TODAY, opts = {}) {
  if (!(net > 0)) return 0;
  let lo = net;
  let hi = net * 2 + 1000;
  while (hi - ukTax(hi, bands, opts) < net) hi *= 2;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (mid - ukTax(mid, bands, opts) < net) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

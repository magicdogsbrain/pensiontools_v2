/**
 * A pot at the stop, bracketed by hand, in today's prices. What the engine draws from 1,000 futures cannot be worked
 * by hand, so the middling pot is checked to sit between two sums anyone can do:
 *
 *   low  = pot + yearly pay-in × years                              (no growth above prices)
 *   high = pot × 1.05^years + yearly pay-in × ((1.05^years − 1) ÷ 0.05)   (5% a year above prices, every year)
 */
export function potBracket({ pot, yearlyIn, years, rate = 0.05 }) {
  const g = (1 + rate) ** years;
  return { low: pot + yearlyIn * years, high: pot * g + yearlyIn * ((g - 1) / rate) };
}

/** The least a pot at the stop must rise for n more years of paying in: n × yearly pay-in (no growth counted). */
export const leastMove = (n, yearlyIn) => n * yearlyIn;

/** "N in 20" for a chance of p %: round(p ÷ 5). */
export const nIn20 = (p) => Math.round(p / 5);

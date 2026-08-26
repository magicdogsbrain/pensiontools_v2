/**
 * Mathematical and Statistical Utilities
 */

/**
 * Generates a seeded random number generator
 * Uses sine-based algorithm matching PWA for consistency
 * @param {number} seed - Seed value
 * @returns {function} Random number generator (returns 0-1)
 */
export function seededRng(seed) {
  // sin(0) = 0 would make a zero seed return 0 forever (run #0 of every Monte Carlo drew the same
  // 1928 block for 35 years and produced a £1bn "future"). Nudge it off the fixed point.
  let s = seed === 0 ? 0.5 : seed;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

/**
 * Generates a normally distributed random number using Box-Muller transform
 * @param {number} mean - Mean of distribution
 * @param {number} stdDev - Standard deviation
 * @param {function} rng - Random number generator
 * @returns {number} Random number from normal distribution
 */
export function gaussianRandom(mean, stdDev, rng) {
  // Box–Muller with a truncated-normal tail. Two reasons to bound z:
  //  1. u1 must be > 0 — if rng() returns exactly 0, Math.log(0) = -Infinity → the draw
  //     becomes Infinity/NaN, corrupting a whole simulation run.
  //  2. Untruncated Box–Muller can emit absurd multi-sigma outliers (a single ~7-sigma
  //     draw ballooned one run's final value to £94bn). Truncating at ±4σ is standard
  //     practice for financial Monte Carlo and keeps tails economically sane.
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  z = Math.max(-4, Math.min(4, z));
  return mean + stdDev * z;
}

/**
 * Generates a simple hash for data integrity checking
 * @param {object} data - Object to hash
 * @returns {string} Hash string
 */
export function simpleHash(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

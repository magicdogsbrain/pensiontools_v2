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
  let s = seed;
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
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
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

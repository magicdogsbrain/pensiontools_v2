/**
 * Mathematical and Statistical Utilities
 */

// One 8-byte scratch buffer for reading a seed's IEEE-754 bits. DataView with an explicit byte order, so the
// two 32-bit words come out the same on little- and big-endian machines.
const SEED_VIEW = new DataView(new ArrayBuffer(8));

/** murmur3's 32-bit finaliser: integer multiply, shift and xor only — every bit of the input reaches every bit of the output. */
function mix32(h) {
  h ^= h >>> 16; h = Math.imul(h, 0x85EBCA6B);
  h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Seeded random number generator: sfc32 (Chris Doty-Humphrey's "Small Fast Chaotic", 32-bit), a well-known
 * generator that passes PractRand and BigCrush.
 *
 * WHY NOT Math.sin: until v6.13.4 this was `s = Math.sin(s) * 10000; return s - Math.floor(s)`. The language
 * does not fix Math.sin's last bit — it differs between JS engines, engine versions and CPU architectures —
 * and ×10000 promoted that last bit into a visibly different number, so after a few draws the "same" seed
 * was a different random stream: one plan, different Monte Carlo answers on different devices (0.5–3% on the
 * cones between an Apple-silicon Mac and a Linux x64 runner).
 *
 * Everything here is 32-bit INTEGER arithmetic (add, xor, shift, rotate, Math.imul), which the language
 * defines exactly, so a seed gives the same stream, bit for bit, on every engine and architecture.
 *
 * The seed is any number. Its 64 IEEE-754 bits are hashed into the generator's state, so whole numbers,
 * fractions and negatives all work, neighbouring seeds (run 0, 1, 2…) give unrelated streams, and a zero
 * seed is as good as any other (the old generator had to special-case it: sin(0) = 0 for ever). A seed that
 * is not a finite number is treated as 0.
 *
 * @param {number} seed - Seed value
 * @returns {function} Random number generator (returns a number in [0, 1))
 */
export function seededRng(seed) {
  let x = Number(seed);
  if (!Number.isFinite(x)) x = 0;   // NaN's bit pattern is not fixed by the language either
  SEED_VIEW.setFloat64(0, x + 0, false);   // + 0 folds -0 into 0
  const hi = SEED_VIEW.getUint32(0, false), lo = SEED_VIEW.getUint32(4, false);
  let a = mix32(hi ^ 0x9E3779B9);
  let b = mix32(lo ^ a);
  let c = mix32(a ^ b ^ 0x85EBCA6B);
  let d = 1;
  const next = function() {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
  for (let i = 0; i < 15; i++) next();   // the usual sfc32 warm-up: let the seed diffuse through the state
  return next;
}

/**
 * Generates a normally distributed random number using Box-Muller transform
 * @param {number} mean - Mean of distribution
 * @param {number} stdDev - Standard deviation
 * @param {function} rng - Random number generator
 * @returns {number} Random number from normal distribution
 *
 * Portability: the random STREAM (rng) is bit-identical everywhere; Math.log and Math.cos below are not
 * guaranteed to the last bit across engines. That difference is one part in 10^16 on a draw and is not
 * amplified (nothing branches on it), so results agree to far less than a penny — unlike the old sine
 * generator, where the same last bit chose a different random number.
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

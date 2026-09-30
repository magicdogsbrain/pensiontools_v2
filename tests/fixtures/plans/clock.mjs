/**
 * Pinned process environment for the plan corpus — import this FIRST, before any app module.
 *
 * The engines read `new Date()` and compute tax years, birthdays and the State Pension's first-year share from
 * LOCAL dates, so an answer depends on today's date and — until 6.13.4 — on the machine's time zone (a plan
 * evaluated under UTC differed from Europe/London by a few pounds on a multi-million cone: day counts taken
 * from milliseconds across a clock change; fixed, and tests/planCorpus.test.js holds the zones equal). The zone
 * is still pinned, because "today" is a local date. The corpus is always evaluated in a plain Node process with:
 *   - TZ = Europe/London (a UK product; set here, at runtime, which Node honours on the main thread — it does
 *     NOT inside vitest's worker threads, which is why the tests spawn run.mjs instead of evaluating in-process);
 *   - Date pinned to whatever `at()` was last given;
 *   - Math.random seeded (guest scenario ids);
 *   - a sessionStorage for the guest store; console.log/warn silenced (the repositories log every save).
 */
process.env.TZ = process.env.CORPUS_TZ || 'Europe/London';   // CORPUS_TZ: only for the test that proves the zone no longer matters

const RealDate = Date;
let nowMs = RealDate.parse('2026-01-01T09:00:00.000Z');
class PinnedDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(nowMs); }
  static now() { return nowMs; }
}
globalThis.Date = PinnedDate;

/** Move the clock to an ISO instant. */
export function at(iso) {
  const ms = RealDate.parse(iso);
  if (!Number.isFinite(ms)) throw new Error('clock: not a date: ' + iso);
  nowMs = ms;
}
/** The real wall clock (for stamping when a pin was taken). */
export const realNowIso = () => new RealDate(RealDate.now()).toISOString();

let seed = 0x5eed1234;
Math.random = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

{ const m = new Map(); globalThis.sessionStorage = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } }; }
for (const k of ['log', 'warn']) console[k] = () => {};

export const say = (...a) => process.stdout.write(a.join(' ') + '\n');

/**
 * What a saver pays in, as a share of pay and with the mix it grows at (research/saving-enough-and-check-in.md 4.4, 4.5,
 * release step R2). The planner's Accumulation settings hold pounds — what leaves take-home pay, the employer's part, the
 * salary — and the classic page reads only those. V7 can also say the pay-in as a share of pay, and keep the saving mix an
 * answer was worked out at; both ride on the same settings object as optional keys:
 *
 *   payInKind: 'share', ownPct, employerPct   the share of pay, beside the pounds it lands (written in ONE write)
 *   savingMix: { equity, bond, cash }         the mix while saving, when it differs from the drawing mix
 *
 * Absent means the old behaviour: pounds, and the saving mix the path has always used. A share is read only while the
 * pounds are exactly the ones it lands — the pounds V7 writes for it, to the penny. If the classic page changes the pounds,
 * the share no longer agrees and the pounds are read: the last edit wins and nothing is guessed.
 *
 *   ACCUMULATION_V7_KEYS                the optional keys (the classic page's Save keeps them as they are: withV7Keys)
 *   PRICE_RISE_PCT                      the planner's price assumption, 2.5% a year (what a kept plan raises its pay-in by)
 *   shareSettings({ pay, ownPct, employerPct })   → the settings keys a share is written as (pounds and share together)
 *   payInShareOf(settings)              → { pay, ownPct, employerPct, own, employer } while the share agrees; else null
 *   savingMixOf(settings)               → the kept saving mix as shares of 1, or null
 *
 * Pure: no storage, no clock.
 */
export const ACCUMULATION_V7_KEYS = Object.freeze(['payInKind', 'ownPct', 'employerPct', 'savingMix']);

/** The planner's own price assumption (CPI 2.5%): a kept plan's pay-in rises with prices (decision D6). */
export const PRICE_RISE_PCT = 2.5;

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const round2 = (n) => Math.round(n * 100) / 100;

/** What a share of pay lands a month, each part to the penny (answers/shared/payIn.js payInParts, the one rule). */
function landed(pay, pct) { return round2(pay * pct / 100 / 12); }

/**
 * The keys a share is written as: the pounds the planner reads (relief at source, so the person's own part is entered as
 * × 0.8 and what lands is the share's figure) and the share itself.
 */
export function shareSettings({ pay, ownPct, employerPct }) {
  const own = landed(pay, ownPct);
  const employer = landed(pay, employerPct);
  return { salary: pay, schemeType: 'ras', netMonthly: round2(own * 0.8), employerMonthly: employer, payInKind: 'share', ownPct, employerPct };
}

/** The share of pay the settings hold, while the pounds are still exactly what it lands; else null (read the pounds). */
export function payInShareOf(settings) {
  const s = settings && typeof settings === 'object' ? settings : null;
  if (!s || s.payInKind !== 'share' || !isNum(s.ownPct) || !isNum(s.employerPct) || !isNum(s.salary) || !(s.salary > 0)) return null;
  if (s.ownPct < 0 || s.ownPct > 100 || s.employerPct < 0 || s.employerPct > 100) return null;
  const want = shareSettings({ pay: s.salary, ownPct: s.ownPct, employerPct: s.employerPct });
  const scheme = s.schemeType || 'ras';
  if (scheme !== want.schemeType || +s.netMonthly !== want.netMonthly || +(s.employerMonthly || 0) !== want.employerMonthly) return null;
  return { pay: s.salary, ownPct: s.ownPct, employerPct: s.employerPct, own: landed(s.salary, s.ownPct), employer: landed(s.salary, s.employerPct) };
}

/**
 * The planner's Save (index.html saveAccumulationUI): its nine keys, with the keys only V7 writes kept as they were saved.
 * When the pounds change, the share no longer agrees and is read as pounds; nothing is guessed and nothing is lost.
 */
export function withV7Keys(inputs, saved) {
  const keep = {};
  if (saved && typeof saved === 'object') for (const k of ACCUMULATION_V7_KEYS) if (saved[k] !== undefined) keep[k] = saved[k];
  return { ...inputs, ...keep };
}

/** The saving mix kept on the plan, as shares of 1 (shares, bonds, cash); null when there is none or nothing in it. */
export function savingMixOf(settings) {
  const m = settings && settings.savingMix;
  if (!m || typeof m !== 'object') return null;
  const e = isNum(m.equity) && m.equity > 0 ? m.equity : 0;
  const b = isNum(m.bond) && m.bond > 0 ? m.bond : 0;
  const c = isNum(m.cash) && m.cash > 0 ? m.cash : 0;
  const t = e + b + c;
  return t > 0 ? { equity: e / t, bond: b / t, cash: c / t } : null;
}

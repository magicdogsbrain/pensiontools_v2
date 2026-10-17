/**
 * "What if you had retired into …?" — the one test's own real start years, replayed one at a time for the History
 * and Scenarios tabs (usability audit decision 2: History and Scenarios explain the one test, with no rival figure).
 *
 * A row is the SAME arithmetic the one test counted that window with: the Pots & Valves family replays the window
 * through pnvDecadeSeries (stressTest pnvRun, on the plan the family's own test ran); Ladder & Ratchet and Floor & Flex
 * read their window from the same window set their test used (runLadderWindows / runFlexWindows); a contract strategy
 * has nothing to replay — every year is bought. The other strategies have no per-start record yet (kind 'none').
 */
import { pnvDecadeSeries, pnvFamilyPlan } from '../strategies/stressTest.js';
import { deriveCompareConfigs } from '../strategies/compareRunner.js';
import { runLadderWindows } from '../strategies/LadderAndRatchet.js';
import { runFlexWindows } from '../strategies/FloorAndFlex.js';
import { getRtr } from '../strategies/ladderEngine.js';
import { NAMED_STARTS } from './OneAnswer.js';

export const PNV_FAMILY = ['pots-and-valves', 'buckets-in-order'];
export const CONTRACT = ['full-il-gilt', 'floor-the-schedule'];

/** The last January a plan of `years` years can start in and still be real history to its end. */
export function lastFullStartYear(years) {
  const months = getRtr().length;
  return 1871 + Math.floor((months - 1 - Math.max(1, years) * 12) / 12);
}

/**
 * @param {string} strategyId   the plan's strategy
 * @param {object} p            the plan (planFromSettings) — the P&V family needs only its plain data (a worker's copy will do)
 * @param {Array<{year:number,label:string}>} starts
 * @returns {Array<object>} one row per start: { year, label, kind, available, tooShort?, failed?, failAge?, terminal?, worst12?, protMonths?, secured?, worstYearFlex? }
 */
export function namedStartRows(strategyId, p, starts = NAMED_STARTS) {
  const years = Math.max(1, +p.durationYears || 35);
  const lastStart = lastFullStartYear(years);
  const base = (st) => ({ year: st.year, label: st.label, available: false });
  if (CONTRACT.includes(strategyId)) return starts.map((st) => ({ ...base(st), kind: 'contract', available: true }));
  if (PNV_FAMILY.includes(strategyId)) {
    const q = pnvFamilyPlan(strategyId, p);
    return starts.map((st) => {
      if (st.year > lastStart) return { ...base(st), kind: 'pnv', tooShort: true, lastStart };
      const w = pnvDecadeSeries(q, st.year, 1);
      if (!w) return { ...base(st), kind: 'pnv', tooShort: true, lastStart };
      return { ...base(st), kind: 'pnv', available: true, failed: !!w.failed, failAge: w.failAge, terminal: w.terminal, worst12: w.worst12, protMonths: w.protMonths, cutYears: w.cutYears, cutReal: w.cutReal };
    });
  }
  if (strategyId === 'ladder-and-ratchet' || strategyId === 'floor-and-flex') {
    let configs = null; try { configs = deriveCompareConfigs(p); } catch (e) { configs = null; }
    const c = configs && (strategyId === 'ladder-and-ratchet' ? configs.lr : configs.ff);
    if (!c) return starts.map((st) => ({ ...base(st), kind: 'none', reason: 'not affordable' }));
    const windows = (strategyId === 'ladder-and-ratchet' ? runLadderWindows(c) : runFlexWindows(c)).windows || [];
    return starts.map((st) => {
      if (st.year > lastStart) return { ...base(st), kind: strategyId === 'ladder-and-ratchet' ? 'ladder' : 'flex', tooShort: true, lastStart };
      const w = windows[(st.year - 1871) * 12];
      if (!w) return { ...base(st), kind: strategyId === 'ladder-and-ratchet' ? 'ladder' : 'flex', tooShort: true, lastStart };
      return strategyId === 'ladder-and-ratchet'
        ? { ...base(st), kind: 'ladder', available: true, failed: w.survived === false, failAge: w.failAge ?? null, terminal: w.terminal ?? 0, secured: w.secured ?? 0 }
        : { ...base(st), kind: 'flex', available: true, failed: false, terminal: w.terminal ?? 0, worstYearFlex: w.worstYearD ?? 0 };
    });
  }
  return starts.map((st) => ({ ...base(st), kind: 'none' }));
}

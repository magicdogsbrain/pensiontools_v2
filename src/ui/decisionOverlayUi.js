/**
 * The full view's Decision tool: where a month is paid from (7.12.0 round 3, lifted from index.html decisionStrategyOverlay so
 * it can read the plan). The words and figures are services/DecisionOverlay.js; the next money into the pension, when the
 * cash entered is less than the month, is "Your plan's mix"'s one dated reading (answers/plan/held.js nextMoneyIn), as Month
 * by month reads it. The shell hands in its own readers; nothing here writes.
 *   d.strategy()            the plan's strategy block        d.settings()  its effective Stress settings
 *   d.ladderPos(settings, dateStr)  the month's place in the ladder (or null)    d.firstRung()  the ladder's first gilt
 *   d.scenario()            the active plan                  d.name(id)    a strategy's name
 */
import { strategyOverlayOf, CONTRACT_IDS, monthDayOf } from '../services/DecisionOverlay.js';
import { nextMoneyIn } from '../answers/plan/held.js';

export async function decisionOverlayFor(decision, dateStr, d) {
  const st = await d.strategy();
  if (!st.id || st.id === 'pots-and-valves') return null;
  const settings = await d.settings();
  const lp = CONTRACT_IDS.includes(st.id) ? await d.ladderPos(settings, dateStr) : null;
  let nextIn = null;
  if (lp) { try { nextIn = nextMoneyIn(await d.scenario(), { today: monthDayOf(dateStr) }); } catch { nextIn = null; } }
  return strategyOverlayOf(decision, dateStr, { strategy: st, stressSettings: settings, name: d.name(st.id), ladder: { lp, firstRung: lp ? d.firstRung() : null }, nextIn });
}

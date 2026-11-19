/**
 * The one context of a run (lead4.md R1, R5): everything a reading of a plan needs beside the plan itself, built in ONE
 * place for both views. Every run — "does it last", the ways, the stress rows, the saver's verdict, the household checks —
 * is handed this, so the two views see a plan from the same day, on the same prices, at the same level.
 *
 *   contextFor(plan, { today, now, plans, market }) → {
 *     now          the plan's day (src/reading/clock.js todayOf: local noon), from `today` ('YYYY-MM-DD', the simple view's
 *                  date) or `now` (a Date, the full view's todayOf()); the real date when neither is given
 *     today        the same day as 'YYYY-MM-DD' (what the simple view's runs and the workers are handed)
 *     market       what the runs are priced on (src/reading/market.js marketStamp(): the day's file or the copy built in)
 *     budget       the plan's own budget settings, or null (PlanReading folds its age from here: never another plan's)
 *     partnerPlan  the plan linked with this one (HouseholdLink.partnerOf over `plans`), or null
 *     level        the level the plan is judged at (Phases.planLevelOf): the plan's own, never a page's
 *   }
 *
 * Pure but for the market stamp (what this JS context has loaded) and the real date when no day is given.
 */
import { todayOf, dayKeyOf } from './clock.js';
import { marketStamp } from './market.js';
import { planLevelOf } from '../services/Phases.js';
import { partnerOf } from '../services/HouseholdLink.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The plan's day from either view's way of holding it: 'YYYY-MM-DD' or a Date (or nothing: today). */
export function dayOfContext({ today = null, now = null } = {}) {
  const m = DAY.exec(String(today || ''));
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0, 0);
  return todayOf(now instanceof Date ? now : now ? new Date(now) : undefined);
}

export function contextFor(plan, { today = null, now = null, plans = null, market = null } = {}) {
  const day = dayOfContext({ today, now });
  const partner = Array.isArray(plans) && plan ? partnerOf(plans, plan) : null;
  return {
    now: day,
    today: dayKeyOf(day),
    market: market || marketStamp(),
    budget: plan && isObj(plan.budgetTool) && isObj(plan.budgetTool.settings) ? plan.budgetTool.settings : null,
    partnerPlan: partner ? (isObj(partner.plan) ? partner.plan : partner) : null,
    level: planLevelOf(plan)
  };
}

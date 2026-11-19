/**
 * THE ONE ADAPTER from a question's answer to the plan test (7.12.0, one answer for the same household): the plan keeping
 * the answer would write, made by the keep's own two pure steps — buildPlanSeed (what V7's Keep hands over) and
 * PlanFromSeed.seedToScenario (what the planner makes of it) — so an answer read through this and the plan the person keeps
 * cannot differ. The plan test then reads it as it reads any saved plan (answers/plan/lastsRun.js lastsOf: the effective
 * settings, planFromSettings, the plan's own way of drawing).
 *
 *   keptPlansOf(source, result, env, opts?) → { yours, partner } | null
 *     source  'a' | 'b' | 'c' | 'd'
 *     result  the answer, final, for the inputs as they stand
 *     env     { today } (the answer's own date)
 *     opts    { payIn: 'now'|'enough' (B), take: 'level'|'tried' (C) }: what Keep would keep, as the Keep buttons say it
 *   null when the answer cannot be kept (planSeed.keepable).
 *
 * Pure: the date is the answer's; the stamp the seed carries is that day's midnight (the seed's age is the planner's check,
 * not a figure). The name is the one Keep suggests; no figure reads it.
 */
import { buildPlanSeed, keepable } from './planSeed.js';
import { seedToScenario } from '../../services/PlanFromSeed.js';

export function keptPlansOf(source, result, env, { payIn = 'now', take = 'level' } = {}) {
  if (!env || typeof env.today !== 'string' || !keepable(source, result).ok) return null;
  const seed = buildPlanSeed({ source, result, env: { today: env.today, appVersion: '' }, name: null, createdAt: env.today + 'T00:00:00.000Z', payIn, take });
  if (!seed) return null;
  return seedToScenario(seed, env.today);
}

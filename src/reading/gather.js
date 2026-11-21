/**
 * The one gatherer per question (lead4.md R6): what the engine is handed for a plan, built in ONE place from (plan, ctx)
 * (ctx: src/reading/context.js contextFor), so the full view's worker and the simple view's worker run the same input.
 * Each input is plain data — it crosses a worker boundary as it is — and the engine's plan is rebuilt from it on the far
 * side by the one builder (enginePlanOf), which no view repeats.
 *
 *   lastsInputOf(plan, ctx)        "does it last": { settings, strategyId, essentialsAnnual, now } — the plan's effective
 *                                  settings (PlanReading.effectiveStressSettings) on the context's day; no essentials (the
 *                                  one test runs without the budget's: only a plan document's run carries them)
 *   waysInputOf(plan, ctx)         the ways list: { settings, essentialsAnnual, now } — the same plan, every way run on it
 *   stressRowInputOf(plan, ctx, row)  a row of "Try the bad years": { plan, today, row } (answers/plan/stressPanelRun.js)
 *   enginePlanOf(input, { maxYears })  the plan every way is judged on: planFromSettings on the input's settings, the engine
 *                                  config made from them on the input's day, the real-yield curve of the one market
 */
import { effectiveStressSettings } from '../services/PlanReading.js';
import { simulationConfigFromSettings } from '../services/SimulationConfig.js';
import { planFromSettings } from '../strategies/stressTest.js';
import { realYieldForYear } from '../services/LinkerUniverse.js';

const iso = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now.toISOString() : null);

export function lastsInputOf(plan, ctx) {
  const settings = effectiveStressSettings(plan, { now: ctx.now });
  return { settings, strategyId: settings.strategyId || 'pots-and-valves', essentialsAnnual: undefined, now: iso(ctx) };
}

export function waysInputOf(plan, ctx) {
  const settings = effectiveStressSettings(plan, { now: ctx.now });
  return { settings, essentialsAnnual: undefined, now: iso(ctx) };
}

export function stressRowInputOf(plan, ctx, row) {
  return { plan, today: ctx.today, row };
}

export function enginePlanOf(input, { maxYears } = {}) {
  const settings = input.settings;
  const now = input.now ? new Date(input.now) : undefined;
  return planFromSettings(settings, simulationConfigFromSettings({}, settings, now), {
    yieldForYear: realYieldForYear, essentialsAnnual: input.essentialsAnnual, startAge: +settings.shapeAgeNow || 57, now,
    ...(maxYears > 0 ? { maxYears } : {})
  });
}

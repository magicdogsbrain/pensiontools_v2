/**
 * Pure income-schedule helpers shared by the engines and the Web Worker. No storage, no Firebase,
 * no DOM — anything here must be safe to import from a worker.
 */

/**
 * Stepped income ("£60k until 72, £50k until 80, then £40k") compiled to the per-year targetSchedule
 * every engine reads. The saved schedule wins; steps are the fallback for plans saved before the
 * schedule was persisted correctly. Returns null when the plan is flat.
 */
export function scheduleFromSteps(settings, startAge = 57) {
  if (Array.isArray(settings.targetSchedule) && settings.targetSchedule.length) return settings.targetSchedule;
  if (settings.incomeShape !== 'phases' || !Array.isArray(settings.incomeSteps) || !settings.incomeSteps.length) return null;
  const ageNow = settings.shapeAgeNow || startAge;
  const steps = settings.incomeSteps.filter((x) => Number.isFinite(+x.fromAge) && +x.amount > 0).sort((a, b) => +a.fromAge - +b.fromAge);
  if (!steps.length) return null;
  const years = Math.max(1, settings.duration || 35);
  return Array.from({ length: years + 1 }, (_, y) => {
    const st = steps.filter((x) => +x.fromAge <= ageNow + y).pop();
    return st ? +st.amount : (settings.baseSalary || 0);
  });
}

/**
 * Legacy SP start year when no SP date is set. If the plan knows the income-start age, assume
 * the State Pension arrives at 67 (plan year = 67 − start age) rather than the historic
 * "year 12" default — a 60-year-old retiree would otherwise see SP arrive at 72.
 */
export function defaultSpYear(settings) {
  if (settings.statePensionYear != null && settings.statePensionYear !== 12) return settings.statePensionYear;
  const start = +settings.shapeAgeNow || 0;
  if (start > 0) return Math.max(0, 67 - start);
  return settings.statePensionYear ?? 999;
}


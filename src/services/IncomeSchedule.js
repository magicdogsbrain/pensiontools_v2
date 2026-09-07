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
  return compileSteps(settings, startAge);
}

/** Sorted, valid steps only. */
export function cleanSteps(steps) {
  return (Array.isArray(steps) ? steps : []).filter((x) => x && Number.isFinite(+x.fromAge) && +x.amount > 0).sort((a, b) => +a.fromAge - +b.fromAge);
}

/**
 * £/yr (today's money) the shape wants at `age`. Each step is "from age X take £Y", and within a
 * step the amount can fall: `decline` is a real % per year, compounding (£60k at 1%/yr pays £59,400
 * the next year, £58,806 the one after); `glideToNext` instead walks in a straight line of pounds
 * from this step's amount to the next step's amount, arriving as that step starts (no cliff). The
 * last step has no next step, so it can only decline. This replaced the separate "spending profile"
 * (the Blanchett smile applied on top of the steps) — see smileToSteps for the migration.
 */
export function amountAtAge(steps, age, fallback = 0) {
  const st = cleanSteps(steps);
  if (!st.length) return fallback;
  let i = -1;
  for (let k = 0; k < st.length; k++) if (+st[k].fromAge <= age) i = k;
  if (i < 0) return fallback;
  const cur = st[i], next = st[i + 1];
  const k = Math.max(0, age - (+cur.fromAge));
  if (cur.glideToNext && next) {
    const span = Math.max(1, (+next.fromAge) - (+cur.fromAge));
    return +cur.amount + ((+next.amount) - (+cur.amount)) * Math.min(k, span) / span;
  }
  const d = Math.max(0, Math.min(50, +cur.decline || 0)) / 100;
  return (+cur.amount) * Math.pow(1 - d, k);
}

/** The per-year schedule from the steps alone (ignores any saved schedule). Null when flat. */
export function compileSteps(settings, startAge = 57) {
  if (settings.incomeShape !== 'phases' || !cleanSteps(settings.incomeSteps).length) return null;
  const ageNow = settings.shapeAgeNow || startAge;
  const years = Math.max(1, settings.duration || 35);
  return Array.from({ length: years + 1 }, (_, y) => amountAtAge(settings.incomeSteps, ageNow + y, settings.baseSalary || 0));
}

/**
 * Migration: the old "Declining with age" spending profile (level for plan years 0-4, −1%/yr for
 * years 5-24, level after — the Blanchett smile) was a multiplier applied ON TOP of the steps. Bake
 * it into the steps so the compiled schedule is identical and the separate control can go: a
 * boundary step at year 5 (decline 1) and at year 25 (decline 0), every existing step inside the
 * window scaled by the smile reached at its start and declining 1%/yr from there.
 */
export function smileToSteps(steps, ageNow, { declineStart = 5, declineYears = 20, rate = 0.01 } = {}) {
  const st = cleanSteps(steps);
  if (!st.length) return st;
  const endYear = declineStart + declineYears;
  const factorAt = (y) => Math.pow(1 - rate, Math.min(Math.max(0, Math.floor(y) - declineStart + 1), declineYears));
  const ages = new Set(st.map((x) => +x.fromAge));
  ages.add(ageNow + declineStart); ages.add(ageNow + endYear);
  return [...ages].filter((a) => a >= +st[0].fromAge).sort((a, b) => a - b).map((a) => {
    const y = a - ageNow;
    const base = amountAtAge(st.map((x) => ({ fromAge: x.fromAge, amount: x.amount })), a, +st[0].amount);
    // Steps inside the window take the smile's value at their own start; the year-5 boundary is the
    // first year WITH a drop, so it starts one step down and the step before it stays level.
    const inWindow = y >= declineStart && y < endYear;
    return { fromAge: a, amount: Math.round(base * factorAt(y)), decline: inWindow ? rate * 100 : 0 };
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


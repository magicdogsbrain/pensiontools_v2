/**
 * Budget Model — pure math for the Stage 0 net-first budgeting tool.
 *
 * The plan's spending need is expressed as:
 *   • age-banded expenditure LINES (today's money, £/yr), each tagged essential | discretionary
 *   • lumpy ONE-OFF items (today's money), single or recurring every N years
 *
 * Headline figures are reported at the START of retirement (retirementAge) — a user's "opening" spend;
 * the full picture is the per-year schedule (spendingScheduleByAge / oneOffSchedule).
 *
 * Everything here is pure and framework-free so it can be unit-tested and reused by the Stage 1 cashflow
 * engine. No engine is touched in Stage 0.
 */

// PLSA "Retirement Living Standards" 2024 — annual spend (home owned outright, excludes care). Shown as
// benchmark chips so a user can sanity-check their own number. Source: retirementlivingstandards.org.uk.
export const PLSA_2024 = {
  single: { minimum: 14400, moderate: 31300, comfortable: 43100 },
  couple: { minimum: 22400, moderate: 43100, comfortable: 59000 }
};

// Curated starter categories so a user isn't left guessing what a one-word label means. Each carries a
// one-line "what goes here" hint listing the specific things that belong, plus a sensible default entry
// period (mo/yr — some bills you think of monthly, some annually). Users can rename / add / remove any.
// The boundary with lumpy one-offs is spelled out (routine here; big replacements in the One-off list).
export const BUDGET_CATEGORIES = {
  essential: [
    { label: 'Rent / mortgage', period: 'mo', hint: 'Your regular housing payment' },
    { label: 'Council tax', period: 'mo', hint: '' },
    { label: 'Gas', period: 'mo', hint: '' },
    { label: 'Electricity', period: 'mo', hint: '' },
    { label: 'Water', period: 'mo', hint: '' },
    { label: 'Broadband', period: 'mo', hint: 'Broadband tariff' },
    { label: 'Mobile phones', period: 'mo', hint: 'Mobile phone tariffs' },
    { label: 'TV licence', period: 'yr', hint: '' },
    { label: 'Groceries & household', period: 'mo', hint: 'Food and everyday household items' },
    { label: 'Home insurance', period: 'yr', hint: 'Buildings & contents' },
    { label: 'Car insurance', period: 'yr', hint: '' },
    { label: 'Car tax', period: 'yr', hint: 'DVLA vehicle tax' },
    { label: 'Petrol / fuel', period: 'mo', hint: '' },
    { label: 'Car servicing & maintenance', period: 'yr', hint: 'Servicing, MOT, repairs — a big replacement is a One-off cost' },
    { label: 'Boiler service', period: 'yr', hint: '' },
    { label: 'Personal health', period: 'mo', hint: 'Prescriptions, dental, optical, health cover' },
    { label: 'Kids / dependents', period: 'mo', hint: 'Supporting children or other dependents' },
    { label: 'Premier banking / account fees', period: 'mo', hint: 'Packaged or premier account fees' },
    { label: 'Home upkeep', period: 'mo', hint: 'Routine maintenance & small repairs — big jobs go in One-off costs' }
  ],
  discretionary: [
    { label: 'Main holiday', period: 'yr', hint: 'Your big annual holiday' },
    { label: 'UK breaks', period: 'yr', hint: 'Weekends & short breaks' },
    { label: 'Day trips', period: 'mo', hint: '' },
    { label: 'Eating out & takeaways', period: 'mo', hint: '' },
    { label: 'Streaming & entertainment', period: 'mo', hint: 'Netflix, Amazon Prime, etc.' },
    { label: 'Digital subscriptions', period: 'mo', hint: 'Cloud storage, AI tools, credit-file, TradingView, broker subscriptions' },
    { label: 'Gym & fitness', period: 'mo', hint: 'Membership & classes' },
    { label: 'Sports & equipment', period: 'yr', hint: 'Kit and gear' },
    { label: 'Clothes', period: 'mo', hint: 'Everyday clothing' },
    { label: 'Sports clothes', period: 'yr', hint: '' },
    { label: 'Hobbies & leisure', period: 'mo', hint: '' },
    { label: 'Gifts & family', period: 'mo', hint: 'Presents, helping family' },
    { label: 'Charity', period: 'mo', hint: '' },
    { label: 'Pets', period: 'mo', hint: 'Food, insurance, vet (pet health)' },
    { label: 'Personal spending money', period: 'mo', hint: "Day-to-day 'spends'" },
    { label: 'Home furnishings & décor', period: 'yr', hint: 'Soft furnishings, decorating, furniture refresh' },
    { label: 'Home technology', period: 'yr', hint: 'Phones, laptops, gadgets' },
    { label: 'Emergency buffer', period: 'mo', hint: 'A monthly set-aside for the unexpected' }
  ]
};

// A few starter LUMPY items (blank amounts) so the "save up for big periodic costs" idea is visible.
export const STARTER_ONEOFFS = [
  { label: 'New car', tier: 'essential', hint: 'Replacement vehicle', everyYears: 8 },
  { label: 'Major home work', tier: 'essential', hint: 'Kitchen, bathroom, roof, windows', everyYears: null },
  { label: 'White goods', tier: 'essential', hint: 'Fridge, washer, cooker', everyYears: 10 }
];

/** Starter expenditure lines (blank amounts) seeded into a fresh budget so categories are self-explanatory. */
export function starterLines() {
  const mk = (tier) =>
    BUDGET_CATEGORIES[tier].map((c) => ({
      label: c.label, tier, annual: null, fromAge: null, toAge: null, hint: c.hint, period: c.period || 'yr'
    }));
  return [...mk('essential'), ...mk('discretionary')];
}

/** Starter one-off / periodic items (blank amounts) for a fresh budget. */
export function starterOneOffs() {
  return STARTER_ONEOFFS.map((o) => ({ label: o.label, tier: o.tier, hint: o.hint, amount: null, atAge: null, everyYears: o.everyYears }));
}

// UK tax bands used only for the interim, clearly-approximate net→gross hand-off (Stage 0). The real,
// per-year, multi-source solve is Stage 1. Ignores the PA taper and assumes the top-up is taxable income.
export const DEFAULT_TAX_BANDS = { pa: 12570, brl: 50270, hrl: 125140 };

const num = (v) => (Number.isFinite(+v) ? +v : 0);

/** Resolve a line's effective age band, using the budget's retirement/end ages for open (null) ends. */
export function lineBand(line, budget) {
  const from = line.fromAge ?? budget.retirementAge;
  const to = line.toAge ?? budget.endAge;
  return { from: num(from), to: num(to) };
}

/** Is an expenditure line active at a given age? */
export function lineActiveAtAge(line, budget, age) {
  const { from, to } = lineBand(line, budget);
  return age >= from && age <= to;
}

/**
 * Total annual expenditure (today's money) active at an age.
 * @param {'essential'|'discretionary'|'all'} tier - which lines to include ('all' = comfortable)
 */
export function annualNetAtAge(budget, age, tier = 'all') {
  return (budget.lines || [])
    .filter((l) => tier === 'all' || l.tier === tier)
    .filter((l) => lineActiveAtAge(l, budget, age))
    .reduce((sum, l) => sum + num(l.annual), 0);
}

/** Essential (floor) annual spend at the start of retirement. */
export function essentialAnnualNet(budget) {
  return annualNetAtAge(budget, num(budget.retirementAge), 'essential');
}

/** Comfortable (essential + discretionary) annual spend at the start of retirement. */
export function comfortableAnnualNet(budget) {
  return annualNetAtAge(budget, num(budget.retirementAge), 'all');
}

/**
 * Expand one-off / lumpy items into dated events across a horizon (retirementAge..endAge by default,
 * but accepts an explicit range). A recurring item repeats every `everyYears` until it passes `toAge`.
 * @returns {Array<{age:number,label:string,tier:string,amount:number}>} sorted by age
 */
export function oneOffSchedule(budget, fromAge = budget.currentAge, toAge = budget.endAge) {
  const out = [];
  for (const item of budget.oneOffs || []) {
    const amount = num(item.amount);
    if (amount === 0) continue;
    const step = num(item.everyYears);
    let age = num(item.atAge);
    if (step > 0) {
      for (; age <= toAge; age += step) {
        if (age >= fromAge) out.push({ age, label: item.label, tier: item.tier, amount });
      }
    } else if (age >= fromAge && age <= toAge) {
      out.push({ age, label: item.label, tier: item.tier, amount });
    }
  }
  return out.sort((a, b) => a.age - b.age);
}

/**
 * Interim net→gross uplift for the hand-off to the (still gross-anchored) plan target. Finds the gross
 * income whose take-home equals `netAnnual`, assuming it is all taxable income under the given bands.
 * APPROXIMATE by design (no PA taper, no ISA / State Pension offset) — Stage 1 replaces it with the real
 * per-year, multi-source solve.
 */
export function grossUpAnnual(netAnnual, bands = DEFAULT_TAX_BANDS) {
  const net = num(netAnnual);
  const { pa, brl, hrl } = bands;
  if (net <= pa) return net; // within the personal allowance → no tax
  const netAtBrl = brl - 0.2 * (brl - pa); // take-home at the basic-rate ceiling
  if (net <= netAtBrl) return pa + (net - pa) / 0.8;
  const netAtHrl = netAtBrl + 0.6 * (hrl - brl); // take-home at the higher-rate ceiling
  if (net <= netAtHrl) return brl + (net - netAtBrl) / 0.6;
  return hrl + (net - netAtHrl) / 0.55; // additional rate
}

/**
 * Average yearly cost of RECURRING lumpy items (amount ÷ everyYears) — the sensible "set aside £X/yr for
 * the car" figure. Single one-offs are excluded: they're discrete events, not an ongoing set-aside.
 * This lets us fold periodic costs into the monthly spending need without hiding the real lumpy timing
 * (the actual dated amounts are still available via oneOffSchedule for the cashflow engine).
 */
export function periodicAnnualAverage(budget) {
  return (budget.oneOffs || []).reduce((sum, o) => {
    const amt = num(o.amount);
    const every = num(o.everyYears);
    return every > 0 && amt ? sum + amt / every : sum;
  }, 0);
}

/** Cached summary written on save + shown in the UI / used by the hand-off. */
export function summariseBudget(budget) {
  const essentialAnnual = essentialAnnualNet(budget);
  const comfortableAnnual = comfortableAnnualNet(budget);
  const periodicAnnual = periodicAnnualAverage(budget);
  const allInComfortableAnnual = comfortableAnnual + periodicAnnual; // recurring + averaged periodic
  return {
    essentialAnnualNet: essentialAnnual,
    comfortableAnnualNet: comfortableAnnual,
    essentialMonthlyNet: essentialAnnual / 12,
    comfortableMonthlyNet: comfortableAnnual / 12,
    periodicAnnualAverage: periodicAnnual,
    periodicMonthlyAverage: periodicAnnual / 12,
    allInComfortableAnnual,
    allInComfortableMonthly: allInComfortableAnnual / 12,
    // The plan's income target should fund the all-in need (recurring + set-aside for periodic costs).
    suggestedGrossAnnual: grossUpAnnual(allInComfortableAnnual)
  };
}

/** A blank budget for a new plan. */
export function defaultBudget(currentAge = 45, retirementAge = 60, endAge = 100) {
  return {
    version: 1,
    currentAge: num(currentAge),
    retirementAge: num(retirementAge),
    endAge: num(endAge),
    lines: [],
    oneOffs: []
  };
}

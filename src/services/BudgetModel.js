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

// Commonly-FORGOTTEN categories — NOT seeded, offered by the completeness nudge ("are you sure you don't
// want X?"). The single biggest budgeting failure is leaving things out; these are the usual suspects
// (healthcare/dental, insurance renewals, seasonal/Christmas, personal care, family, long-term care,
// per-person spends). Sources: PLSA basket + retirement-budget "overlooked costs" research (2026).
export const SUGGESTED_EXTRAS = [
  { label: 'Eating out & takeaways', tier: 'discretionary', period: 'mo', hint: 'Meals out, takeaways, coffees' },
  { label: 'Life insurance / income protection', tier: 'essential', period: 'mo', hint: 'Protection premiums' },
  { label: 'Health / dental insurance', tier: 'essential', period: 'mo', hint: 'Private medical, dental plan, cash plan' },
  { label: 'Dental & optical', tier: 'essential', period: 'yr', hint: 'Check-ups, glasses, treatment not on the NHS' },
  { label: 'Hearing', tier: 'essential', period: 'yr', hint: 'Hearing tests & aids' },
  { label: 'Breakdown cover', tier: 'essential', period: 'yr', hint: 'AA / RAC vehicle breakdown' },
  { label: 'Parking & permits', tier: 'essential', period: 'yr', hint: 'Residents permit, ULEZ / congestion' },
  { label: 'Public transport', tier: 'essential', period: 'mo', hint: 'Bus, rail, rail card' },
  { label: 'Cleaner / gardener', tier: 'essential', period: 'mo', hint: 'Cleaner, window cleaner, gardener' },
  { label: 'Long-term care set-aside', tier: 'essential', period: 'mo', hint: 'A monthly reserve toward possible later-life care (easily forgotten)' },
  { label: 'Christmas & birthdays', tier: 'discretionary', period: 'yr', hint: 'Seasonal gifts & celebrations' },
  { label: 'Alcohol', tier: 'discretionary', period: 'mo', hint: 'Beer, wine, spirits' },
  { label: 'Hairdressing & grooming', tier: 'discretionary', period: 'mo', hint: 'Haircuts, beauty, barber' },
  { label: 'Newspapers, books & media', tier: 'discretionary', period: 'mo', hint: 'Papers, magazines, books' },
  { label: 'Grandchildren', tier: 'discretionary', period: 'mo', hint: 'Treats, days out, help with costs' },
  { label: 'Professional memberships', tier: 'discretionary', period: 'yr', hint: 'Institutes, unions, clubs' },
  { label: 'Second / holiday home', tier: 'discretionary', period: 'mo', hint: 'Running costs of a second property' },
  { label: 'Storage / lock-up', tier: 'discretionary', period: 'mo', hint: 'Self-storage, garage rental' },
  { label: 'My personal spending', tier: 'discretionary', period: 'mo', hint: "Your own day-to-day 'spends'", paidBy: 'me' },
  { label: "Partner's personal spending", tier: 'discretionary', period: 'mo', hint: "Your partner's day-to-day 'spends'", paidBy: 'partner' }
];

/**
 * Catalogue items the user hasn't added yet — powers the completeness nudge. Sources: the seeded defaults
 * (so a REMOVED category is re-offered — e.g. you delete "Eating out", it reappears as a suggestion) plus
 * the commonly-forgotten extras. Compared case-insensitively on label.
 */
export function missingSuggestions(budget) {
  const present = new Set((budget.lines || []).map((l) => (l.label || '').trim().toLowerCase()).filter(Boolean));
  const defaults = [
    ...BUDGET_CATEGORIES.essential.map((c) => ({ ...c, tier: 'essential' })),
    ...BUDGET_CATEGORIES.discretionary.map((c) => ({ ...c, tier: 'discretionary' }))
  ];
  const seen = new Set();
  const out = [];
  for (const item of [...SUGGESTED_EXTRAS, ...defaults]) {
    const key = item.label.trim().toLowerCase();
    if (present.has(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

// A few starter LUMPY items (blank amounts) so the "save up for big periodic costs" idea is visible.
export const STARTER_ONEOFFS = [
  { label: 'New car', tier: 'essential', hint: 'Replacement vehicle', everyYears: 8 },
  { label: 'Redecorating', tier: 'essential', hint: 'Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY', everyYears: 7 },
  { label: 'Major home work', tier: 'essential', hint: 'Kitchen, bathroom, roof, windows', everyYears: null },
  { label: 'White goods', tier: 'essential', hint: 'Fridge, washer, cooker', everyYears: 10 }
];

// Typical MONTHLY spend per category (today's money, £), TIERED to the PLSA Retirement Living
// Standards (retirementlivingstandards.org.uk). The user picks the standard they're aiming for
// (budget.plsaTier: 'minimum' | 'moderate' | 'comfortable'), and every chip/placeholder shows that
// tier's figure. Values are per-category central estimates consistent with each tier's published
// basket (2024/25 standards, uplifted to 2026 prices), with judgement where PLSA doesn't itemise
// 1:1 — they deliberately do NOT force-sum to the tier totals, since few users fill every category.
// Construction notes: Minimum assumes NO car (public transport instead) and a UK holiday only;
// Moderate ≈ one car + 2 weeks Europe; Comfortable ≈ newer car(s) + 2 weeks Med 4* + long weekends.
// { tier: { s: one person, c: couple } }. Shown as editable suggestions, never silently assumed.
export const TYPICAL_TIERS = {
  'Council tax':                { minimum: { s: 95, c: 150 },  moderate: { s: 115, c: 170 }, comfortable: { s: 125, c: 185 } },
  'Gas':                        { minimum: { s: 45, c: 60 },   moderate: { s: 58, c: 75 },   comfortable: { s: 68, c: 90 } },
  'Electricity':                { minimum: { s: 55, c: 70 },   moderate: { s: 68, c: 85 },   comfortable: { s: 80, c: 100 } },
  'Water':                      { minimum: { s: 28, c: 38 },   moderate: { s: 33, c: 44 },   comfortable: { s: 38, c: 50 } },
  'Broadband':                  { minimum: { s: 27, c: 27 },   moderate: { s: 32, c: 32 },   comfortable: { s: 38, c: 38 } },
  'Mobile phones':              { minimum: { s: 8, c: 16 },    moderate: { s: 14, c: 28 },   comfortable: { s: 20, c: 40 } },
  'TV licence':                 { minimum: { s: 15, c: 15 },   moderate: { s: 15, c: 15 },   comfortable: { s: 15, c: 15 } },
  'Groceries & household':      { minimum: { s: 230, c: 350 }, moderate: { s: 300, c: 470 }, comfortable: { s: 360, c: 580 } },
  'Home insurance':             { minimum: { s: 16, c: 22 },   moderate: { s: 22, c: 30 },   comfortable: { s: 28, c: 38 } },
  'Car insurance':              { minimum: { s: 0, c: 0 },     moderate: { s: 38, c: 50 },   comfortable: { s: 48, c: 80 } },
  'Car tax':                    { minimum: { s: 0, c: 0 },     moderate: { s: 16, c: 16 },   comfortable: { s: 16, c: 32 } },
  'Petrol / fuel':              { minimum: { s: 0, c: 0 },     moderate: { s: 95, c: 130 },  comfortable: { s: 115, c: 190 } },
  'Car servicing & maintenance':{ minimum: { s: 0, c: 0 },     moderate: { s: 48, c: 65 },   comfortable: { s: 65, c: 105 } },
  'Boiler service':             { minimum: { s: 9, c: 9 },     moderate: { s: 11, c: 11 },   comfortable: { s: 13, c: 13 } },
  'Personal health':            { minimum: { s: 15, c: 25 },   moderate: { s: 32, c: 55 },   comfortable: { s: 58, c: 95 } },
  'Home upkeep':                { minimum: { s: 30, c: 42 },   moderate: { s: 52, c: 75 },   comfortable: { s: 85, c: 120 } },
  'Main holiday':               { minimum: { s: 42, c: 65 },   moderate: { s: 130, c: 200 }, comfortable: { s: 220, c: 350 } },
  'UK breaks':                  { minimum: { s: 0, c: 0 },     moderate: { s: 38, c: 60 },   comfortable: { s: 75, c: 115 } },
  'Day trips':                  { minimum: { s: 15, c: 25 },   moderate: { s: 32, c: 48 },   comfortable: { s: 52, c: 80 } },
  'Eating out & takeaways':     { minimum: { s: 42, c: 70 },   moderate: { s: 100, c: 170 }, comfortable: { s: 170, c: 285 } },
  'Streaming & entertainment':  { minimum: { s: 12, c: 12 },   moderate: { s: 26, c: 32 },   comfortable: { s: 42, c: 48 } },
  'Digital subscriptions':      { minimum: { s: 5, c: 8 },     moderate: { s: 13, c: 20 },   comfortable: { s: 26, c: 38 } },
  'Gym & fitness':              { minimum: { s: 15, c: 26 },   moderate: { s: 32, c: 55 },   comfortable: { s: 48, c: 85 } },
  'Sports & equipment':         { minimum: { s: 5, c: 8 },     moderate: { s: 13, c: 22 },   comfortable: { s: 26, c: 42 } },
  'Clothes':                    { minimum: { s: 48, c: 80 },   moderate: { s: 65, c: 115 },  comfortable: { s: 105, c: 190 } },
  'Sports clothes':             { minimum: { s: 3, c: 5 },     moderate: { s: 8, c: 13 },    comfortable: { s: 13, c: 22 } },
  'Hobbies & leisure':          { minimum: { s: 16, c: 26 },   moderate: { s: 37, c: 58 },   comfortable: { s: 62, c: 100 } },
  'Gifts & family':             { minimum: { s: 22, c: 32 },   moderate: { s: 58, c: 90 },   comfortable: { s: 95, c: 150 } },
  'Charity':                    { minimum: { s: 5, c: 10 },    moderate: { s: 16, c: 27 },   comfortable: { s: 32, c: 55 } },
  'Pets':                       { minimum: { s: 32, c: 32 },   moderate: { s: 42, c: 42 },   comfortable: { s: 58, c: 58 } },
  'Personal spending money':    { minimum: { s: 26, c: 48 },   moderate: { s: 52, c: 95 },   comfortable: { s: 95, c: 170 } },
  'Home furnishings & décor':   { minimum: { s: 16, c: 26 },   moderate: { s: 37, c: 58 },   comfortable: { s: 68, c: 105 } },
  'Home technology':            { minimum: { s: 10, c: 16 },   moderate: { s: 26, c: 37 },   comfortable: { s: 48, c: 68 } },
  // Suggested-extra categories
  'Alcohol':                    { minimum: { s: 16, c: 42 },   moderate: { s: 32, c: 80 },   comfortable: { s: 52, c: 115 } },
  'Hairdressing & grooming':    { minimum: { s: 13, c: 19 },   moderate: { s: 26, c: 42 },   comfortable: { s: 48, c: 80 } },
  'Newspapers, books & media':  { minimum: { s: 8, c: 13 },    moderate: { s: 19, c: 30 },   comfortable: { s: 32, c: 48 } },
  'Life insurance / income protection': { minimum: { s: 20, c: 24 }, moderate: { s: 20, c: 24 }, comfortable: { s: 20, c: 24 } },
  'Health / dental insurance':  { minimum: { s: 0, c: 0 },     moderate: { s: 16, c: 27 },   comfortable: { s: 42, c: 75 } },
  'Dental & optical':           { minimum: { s: 10, c: 16 },   moderate: { s: 19, c: 32 },   comfortable: { s: 32, c: 55 } },
  'Public transport':           { minimum: { s: 42, c: 75 },   moderate: { s: 26, c: 48 },   comfortable: { s: 26, c: 48 } },
  'Christmas & birthdays':      { minimum: { s: 22, c: 37 },   moderate: { s: 48, c: 75 },   comfortable: { s: 85, c: 125 } },
  'My personal spending':       { minimum: { s: 26, c: 26 },   moderate: { s: 48, c: 48 },   comfortable: { s: 85, c: 85 } },
  "Partner's personal spending":{ minimum: { s: 0, c: 26 },    moderate: { s: 0, c: 48 },    comfortable: { s: 0, c: 85 } }
};

export const PLSA_TIER_LABELS = Object.freeze({
  minimum: 'PLSA Minimum', moderate: 'PLSA Moderate', comfortable: 'PLSA Comfortable'
});

// Optional runtime override of the tier table (Firestore admin/typicalAmounts). Null = code table.
let _tiersOverride = null;
export function setTypicalTiersOverride(tiers) { _tiersOverride = tiers || null; }

/** The budget's chosen PLSA tier ('minimum' | 'moderate' | 'comfortable'; default moderate). */
export function plsaTierOf(budget) {
  const t = budget && budget.plsaTier;
  return (t === 'minimum' || t === 'comfortable') ? t : 'moderate';
}

/**
 * Typical MONTHLY spend for a category at the budget's chosen PLSA tier, single vs couple by the
 * sharing flag. Returns null when no figure exists; 0 is meaningful (e.g. Minimum assumes no car).
 */
export function typicalMonthlyFor(label, budget) {
  const table = _tiersOverride || TYPICAL_TIERS;
  const entry = table[(label || '').trim()];
  if (!entry) return null;
  const tier = entry[plsaTierOf(budget)];
  if (!tier) return null;
  return (budget && budget.sharedWithPartner) ? tier.c : tier.s;
}

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
 * Total annual expenditure (today's money) active at an age — the whole HOUSEHOLD cost, ignoring who pays.
 * @param {'essential'|'discretionary'|'all'} tier - which lines to include ('all' = comfortable)
 */
export function annualNetAtAge(budget, age, tier = 'all') {
  return (budget.lines || [])
    .filter((l) => tier === 'all' || l.tier === tier)
    .filter((l) => lineActiveAtAge(l, budget, age))
    .reduce((sum, l) => sum + num(l.annual), 0);
}

/**
 * The fraction of a line/one-off the PLAN OWNER funds. Only applies when the budget opts into partner
 * sharing (`sharedWithPartner`); otherwise everything is theirs. paidBy: 'me' → 1, 'partner' → 0,
 * 'shared' → the item's own `mySharePct` if set, else the budget-wide `mySharePct` (default 50%).
 * This keeps the plan single-person while letting a couple split who-pays-what: each person models
 * their own plan against their share of the household budget.
 */
export function myShareFactor(item, budget) {
  if (!budget || !budget.sharedWithPartner) return 1;
  const who = (item && item.paidBy) || 'me';
  if (who === 'partner') return 0;
  if (who === 'shared') {
    const own = item && item.mySharePct;
    const pct = (own != null && own !== '' && Number.isFinite(+own)) ? +own
      : (Number.isFinite(+budget.mySharePct) ? +budget.mySharePct : 50);
    return Math.max(0, Math.min(1, pct / 100));
  }
  return 1;
}

/** Annual expenditure the PLAN OWNER funds (household cost × their share of each line). */
export function myAnnualNetAtAge(budget, age, tier = 'all') {
  return (budget.lines || [])
    .filter((l) => tier === 'all' || l.tier === tier)
    .filter((l) => lineActiveAtAge(l, budget, age))
    .reduce((sum, l) => sum + num(l.annual) * myShareFactor(l, budget), 0);
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
export function periodicAnnualAverage(budget, mineOnly = false) {
  return (budget.oneOffs || []).reduce((sum, o) => {
    const amt = num(o.amount);
    const every = num(o.everyYears);
    if (!(every > 0 && amt)) return sum;
    return sum + (amt / every) * (mineOnly ? myShareFactor(o, budget) : 1);
  }, 0);
}

/**
 * Cached summary written on save + shown in the UI / used by the hand-off.
 * The headline plan need is the OWNER'S share (partner-paid costs excluded); household totals are also
 * returned so the UI can show the whole picture. With no partner sharing, mine == household.
 */
export function summariseBudget(budget) {
  const retire = num(budget.retirementAge);
  // Owner's share (what the plan must fund)
  const essentialAnnual = myAnnualNetAtAge(budget, retire, 'essential');
  const comfortableAnnual = myAnnualNetAtAge(budget, retire, 'all');
  const periodicAnnual = periodicAnnualAverage(budget, true);
  const allInComfortableAnnual = comfortableAnnual + periodicAnnual;
  // Whole household (ignores who pays)
  const householdComfortableAnnual = comfortableAnnualNet(budget) + periodicAnnualAverage(budget, false);
  // Partner's side of the same budget: everything the owner doesn't fund. Their target if they
  // run their own plan.
  const partnerAllInAnnual = Math.max(0, householdComfortableAnnual - allInComfortableAnnual);
  return {
    partnerAllInAnnual,
    partnerAllInMonthly: partnerAllInAnnual / 12,
    essentialAnnualNet: essentialAnnual,
    comfortableAnnualNet: comfortableAnnual,
    essentialMonthlyNet: essentialAnnual / 12,
    comfortableMonthlyNet: comfortableAnnual / 12,
    periodicAnnualAverage: periodicAnnual,
    periodicMonthlyAverage: periodicAnnual / 12,
    allInComfortableAnnual,
    allInComfortableMonthly: allInComfortableAnnual / 12,
    householdComfortableAnnual,
    householdComfortableMonthly: householdComfortableAnnual / 12,
    sharedWithPartner: !!budget.sharedWithPartner,
    // The plan's income target funds the owner's all-in need (recurring + set-aside for periodic costs).
    suggestedGrossAnnual: grossUpAnnual(allInComfortableAnnual)
  };
}

/**
 * Evaluate a simple arithmetic amount expression ("11.99+8.99+5.99", "4×52/12"). Lets wizard amount
 * fields double as a calculator. Returns a finite number (rounded to pennies) or null if the input
 * isn't plain arithmetic. Only digits, . + - * / × x ( ) and whitespace are permitted.
 */
export function evalAmountExpr(str) {
  if (str == null) return null;
  // A leading '=' is spreadsheet muscle memory — accept and strip it.
  const src = String(str).trim().replace(/^=/, '').replace(/[×x]/gi, '*').replace(/,/g, '');
  if (!src || !/^[\d+\-*/().\s]+$/.test(src) || !/\d/.test(src)) return null;
  try {
    const val = Function('"use strict"; return (' + src + ');')();
    return Number.isFinite(val) ? Math.round(val * 100) / 100 : null;
  } catch {
    return null;
  }
}

/**
 * Sum a line's breakdown sub-items ("sub sheet") into an ANNUAL figure. Rows carry their own
 * period, so a car line can mix insurance £450/yr with fuel £80/mo. Rows without a numeric
 * amount are ignored (they can still hold a label as a checklist entry).
 * @param {Array<{label?:string, amount?:number|null, period?:'mo'|'yr'}>} breakdown
 */
export function breakdownAnnual(breakdown) {
  return (breakdown || []).reduce((sum, r) => {
    const amt = num(r && r.amount);
    if (!amt) return sum;
    return sum + ((r.period || 'yr') === 'mo' ? amt * 12 : amt);
  }, 0);
}

/**
 * Gentle sanity check of an entered amount against the ONS typical figure for the category.
 * Returns 'low' | 'high' | null (null = no typical known, no amount, or within the plausible band).
 * Thresholds are deliberately wide (≤35% / ≥300% of typical) — a nudge, never a nag.
 */
export function typicalSanityFlag(label, annual, budget) {
  const typ = typicalMonthlyFor(label, budget);
  const amt = num(annual);
  if (typ == null || typ <= 0 || amt <= 0) return null;
  const typAnnual = typ * 12;
  if (amt <= typAnnual * 0.35) return 'low';
  if (amt >= typAnnual * 3) return 'high';
  return null;
}

/** A blank budget for a new plan. */
export function defaultBudget(currentAge = 45, retirementAge = 60, endAge = 100) {
  return {
    version: 1,
    currentAge: num(currentAge),
    retirementAge: num(retirementAge),
    endAge: num(endAge),
    // Optional partner cost-sharing (single-person plan; partner-paid lines drop out of the owner's need).
    sharedWithPartner: false,
    mySharePct: 50,
    // Which PLSA Retirement Living Standard the typical-amount chips aim at.
    plsaTier: 'moderate',
    lines: [],
    oneOffs: []
  };
}

/**
 * The fact ids (lead4.md section 2, G1): one id per figure a person reads about a kept plan, the same id in both views.
 * Every place either view draws one of these figures carries `data-fact="<id>"` on the element that holds exactly the
 * figure as shown (src/reading/mark.js for the full view's HTML strings, src/reading/Mark.jsx for the simple view), so
 * the parity sweep (e2e/parity/) can hold each fact to one value across every place.
 *
 * Ids are the reading's keys. A fact with an index (an income step, a final-salary pension, a lump sum, a mix bucket, a
 * wrapper, a way of drawing) is written with `#` in its pattern and made by `factId(pattern, n)`: `income.step.#.beforeTax` → the first step
 * is `income.step.0.beforeTax`.
 *
 * Tables carry `data-fact-table="<id>"` with `data-row`/`data-col` keys on their cells (TABLES).
 */

/** Every fact id, by name. The value is the id written on the page. */
export const FACT = Object.freeze({
  // the plan and its clock
  STAGE: 'stage',
  PLAN_NAME: 'plan.name',
  STOP_MONTH: 'stop.month',
  YEARS_TO_GO: 'yearsToGo',
  AGE_TODAY: 'age.today',
  END_AGE: 'plan.endAge',
  LOCKED: 'lock.state',
  LOCK_DATE: 'lock.date',
  DUE_NEXT: 'due.next',
  // money today, by pot
  POT_TODAY: 'pot.today',
  ISA_TODAY: 'isa.today',
  GIA_TODAY: 'gia.today',
  CASH_TODAY: 'cash.today',
  // the pot Where you are sets against the plan's band: its accounts, in the prices the plan's figures are in
  POT_AGAINST_PLAN: 'pot.againstPlan',
  // the plan's middle line for the pot by now (the band's median at this month, in the same prices)
  POT_PLAN_MIDDLE: 'pot.planMiddle',
  // the plan's 1-in-10 bad line by now, where the pot is near it (below it, or between it and the middle): both views say it
  POT_PLAN_LOW: 'pot.planLow',
  // the pot at the stop, with its low and high where shown
  POT_AT_STOP: 'pot.atStop',
  POT_AT_STOP_LOW: 'pot.atStop.low',
  POT_AT_STOP_HIGH: 'pot.atStop.high',
  // pay and what goes in
  PAY: 'pay.salary',
  PAY_IN_TAKE_HOME: 'payIn.fromTakeHome',
  PAY_IN_EMPLOYER: 'payIn.employer',
  PAY_IN_TOTAL: 'payIn.total',
  PAY_IN_PCT: 'payIn.pctOfPay',
  // what the person wants
  WANT_INCOME: 'want.income',
  WANT_STOP_AGE: 'want.stopAge',
  // the saver's verdict
  SAVER_VERDICT: 'saver.verdict',
  SAVER_CHANCE: 'saver.chance',
  SAVER_ENOUGH: 'saver.enough.pounds',
  SAVER_ENOUGH_PCT: 'saver.enough.pct',
  SAVER_INCOME_AT_STOP: 'saver.incomeAtStop',
  // does it last
  LASTS_CHANCE: 'lasts.chance',
  LASTS_FIXED: 'lasts.fixedChance',
  RUN_OUT_AGE: 'lasts.runOutAge',
  LEFT: 'left.typically',
  LEFT_BAD: 'left.badCase',
  LEFT_GOOD: 'left.goodCase',
  WORST_12: 'lasts.worst12',
  // the share of the plan's years the money paid, averaged over every future (OneAnswer coverage)
  COVERAGE: 'lasts.coverage',
  LEVEL: 'lasts.level',
  LASTS_VERDICT: 'lasts.verdict',
  FLOOR_INCOME: 'lasts.floorIncome',
  LIVE_LONGER: 'lasts.liveLonger',
  // the prices a year the year tables assume (src/reading/yearTable.js: the plan's own, 2.5 for 2.5%), said over both views' tables
  YEAR_PRICES: 'years.prices',
  FOLLOW_TO: 'lasts.followTo',
  // income
  STEP_BEFORE_TAX: 'income.step.#.beforeTax',
  STEP_MONTH_AFTER_TAX: 'income.step.#.monthAfterTax',
  MONTH_AFTER_TAX: 'income.perMonth.afterTax',
  SP_WEEK: 'statePension.week',
  SP_YEAR: 'statePension.amount',
  SP_AGE: 'statePension.age',
  SP_START: 'statePension.start',
  DB_AMOUNT: 'finalSalary.#.amount',
  DB_AGE: 'finalSalary.#.age',
  LUMP_AMOUNT: 'lump.#.amount',
  LUMP_AGE: 'lump.#.age',
  // spending
  SPEND_ESSENTIALS: 'spend.essentials',
  SPEND_TOTAL: 'spend.total',
  // this tax year and this month
  YEAR_SET_UP: 'income.thisYear.beforeTax',
  YEAR_PLAN_SAYS: 'income.thisYear.planSays',
  YEAR_PER_MONTH: 'income.thisYear.perMonth',
  YEAR_TOTAL: 'income.thisYear.total',
  YEAR_FROM: 'income.thisYear.from',
  MONTH_TAKE: 'month.take.afterTax',
  MONTH_TAKE_PENSION: 'month.take.pension',
  MONTH_FROM: 'month.take.from',
  TAKEN_YEAR: 'taken.againstPlan',
  // the way of drawing
  WAY_NAME: 'way.name',
  // what a bought way costs (compareRunner.wayCostOf), one fact per way: the way's id is the key (way.full-il-gilt.cost)
  WAY_COST: 'way.#.cost',
  // the ways list (src/reading/ways.js; step F3): each way's name and how many futures out of 10 it lasts, keyed by its id;
  // and when a bought way is bought (today, or when a plan still saving stops, at today's prices)
  WAY_EACH_NAME: 'way.#.name',
  WAY_VERDICT: 'way.#.verdict',
  // and, per way, what is typically left, the bad case (the worst 1 in 10) and the worst 12 months lived (wayFiguresOf)
  WAY_LEFT: 'way.#.left',
  WAY_BAD_LEFT: 'way.#.badLeft',
  WAY_WORST_12: 'way.#.worst12',
  WAY_BOUGHT: 'way.bought',
  // what a bought way was priced on (src/reading/market.js marketLabel): the prices' date and source
  MARKET_GILTS: 'market.gilts',
  WITHDRAWAL_RATE: 'withdrawal.rate',
  // what is held
  GILTS_HELD: 'gilts.held',
  MIX_PLAN: 'mix.plan.#',
  MIX_HELD: 'mix.held.#',
  HOLDINGS_TOTAL: 'holdings.total',
  HOLDINGS_WRAPPER: 'holdings.#',
  // "Try the bad years" (lead4.md R6; step F3): each row's figures, keyed by the row's id (stressPanel.js ROW_IDS) — its weighted
  // chance and its count to one age (each sentence as said, with the reference beside it), where it runs out, its verdict word,
  // the size of the change it makes; and what still comes in, said once above the rows
  STRESS_CHANCE: 'stress.#.chance',
  STRESS_FIXED: 'stress.#.fixedChance',
  STRESS_RUNS_OUT: 'stress.#.runsOut',
  STRESS_VERDICT: 'stress.#.verdict',
  STRESS_CHANGE: 'stress.#.change',
  STRESS_FLOOR: 'stress.floorIncome',
  // the mix grid's best cell, said under it: its chance in hundredths (the grid's own cells are the table 'mix')
  MIX_BEST: 'mix.best',
  // the household
  PARTNER_CHANCE: 'partner.chance',
  HOUSEHOLD_CHANCE: 'household.chance'
});

/** The tables, by name: `data-fact-table` values; their cells carry `data-row` and `data-col`. */
export const TABLES = Object.freeze({
  YEARS: 'years',
  // the pots' floors year by year (src/reading/yearTable.js): the simple view's second table, the full view's Glidepath page
  FLOORS: 'floors',
  // the mix grid ("Which mix lasts best?" / Compare allocations, answers/plan/mixRun.js runMixCompare): a row per mix (own,
  // cautious, balanced, adventurous), a column per tent (flat, tent) for its words and (flat.sub, tent.sub) for the line under
  MIX: 'mix',
  LADDER: 'ladder'
});

/** The keys an indexed fact takes: the mix buckets as the held mix names them (Holdings.proportions), the wrappers by their
 * stored names; steps, pensions and lumps by number. */
export const BUCKETS = Object.freeze(['shares', 'bonds', 'diversifiers', 'cash']);
export const WRAPPERS = Object.freeze(['sipp', 'isa', 'gia', 'cash']);

const PATTERNS = Object.freeze(Object.values(FACT));
const TABLE_IDS = Object.freeze(Object.values(TABLES));

/** An indexed fact's id: factId('income.step.#.beforeTax', 0) → 'income.step.0.beforeTax'. */
export function factId(pattern, key) {
  if (!String(pattern).includes('#')) return pattern;
  return String(pattern).replace('#', String(key));
}

/** The pattern an id was made from ('income.step.2.beforeTax' → 'income.step.#.beforeTax'), or null when it is not a fact id. */
export function patternOf(id) {
  const s = String(id || '');
  if (PATTERNS.includes(s)) return s;
  for (const p of PATTERNS) {
    if (!p.includes('#')) continue;
    const [a, b] = p.split('#');
    if (s.startsWith(a) && s.endsWith(b)) {
      const key = s.slice(a.length, s.length - b.length);
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(key)) return p;   // a number, a bucket, a wrapper, or a way's id (full-il-gilt)
    }
  }
  return null;
}

/** True for an id in the register (a plain id, or an indexed one made from a pattern). */
export const isFactId = (id) => patternOf(id) !== null;
/** True for a table id. */
export const isTableId = (id) => TABLE_IDS.includes(String(id));

/** Every plain id and every pattern: the register the sweep reads. */
export const FACT_PATTERNS = PATTERNS;
export const TABLE_PATTERNS = TABLE_IDS;

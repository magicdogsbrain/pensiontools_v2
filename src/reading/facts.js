/**
 * The fact ids (lead4.md section 2, G1): one id per figure a person reads about a kept plan, the same id in both views.
 * Every place either view draws one of these figures carries `data-fact="<id>"` on the element that holds exactly the
 * figure as shown (src/reading/mark.js for the full view's HTML strings, src/reading/Mark.jsx for the simple view), so
 * the parity sweep (e2e/parity/) can hold each fact to one value across every place.
 *
 * Ids are the reading's keys. A fact with an index (an income step, a final-salary pension, a lump sum, a mix bucket, a
 * wrapper) is written with `#` in its pattern and made by `factId(pattern, n)`: `income.step.#.beforeTax` → the first step
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
  WORST_12: 'lasts.worst12',
  LEVEL: 'lasts.level',
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
  MONTH_TAKE: 'month.take.afterTax',
  MONTH_TAKE_PENSION: 'month.take.pension',
  MONTH_FROM: 'month.take.from',
  TAKEN_YEAR: 'taken.againstPlan',
  // the way of drawing
  WAY_NAME: 'way.name',
  WAY_COST: 'way.cost',
  WITHDRAWAL_RATE: 'withdrawal.rate',
  // what is held
  GILTS_HELD: 'gilts.held',
  MIX_PLAN: 'mix.plan.#',
  MIX_HELD: 'mix.held.#',
  HOLDINGS_TOTAL: 'holdings.total',
  HOLDINGS_WRAPPER: 'holdings.#',
  // the household
  PARTNER_CHANCE: 'partner.chance',
  HOUSEHOLD_CHANCE: 'household.chance'
});

/** The tables, by name: `data-fact-table` values; their cells carry `data-row` and `data-col`. */
export const TABLES = Object.freeze({
  YEARS: 'years',
  LADDER: 'ladder'
});

/** The keys an indexed fact takes: the mix buckets and the wrappers by their stored names; steps, pensions and lumps by number. */
export const BUCKETS = Object.freeze(['equity', 'bond', 'cash', 'diversifier', 'gilts']);
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
      if (/^[a-z0-9]+$/i.test(key)) return p;
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

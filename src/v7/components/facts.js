/**
 * Which figure on a plan page is which fact of the register (src/reading/facts.js; lead4.md G1). Markup only: the
 * figure itself is drawn inside a span carrying `data-fact`, so the parity sweep and the scenario tests read exactly the
 * figure as shown, never a sentence around it.
 *
 *   figureFactOf(lineId, key)   a figure of a sentence read.js wrote (a line's part { key, kind }): its fact, or null
 *   slotFactsOf(lineId, slots)  the slots of a filled line ({ slot: factId }) for fillMarked (PlanFigures.jsx)
 *
 * Until 7.12.0 a mark sat on the whole line (LINE_FACTS); it now sits on the figure.
 */

/** `${lineId}:${figureKey}` → fact id, for the sentences read.js writes (src/answers/plan/read.js). */
const FIGURES = Object.freeze({
  'about.age:ageToday': 'age.today',
  'about.runs:ageEnd': 'plan.endAge',
  'where.pot:pot': 'pot.today',
  'where.saverPot:actual': 'pot.today',
  'where.taken:drawn': 'taken.againstPlan',
  'pots.pension:sipp': 'pot.today',
  'pots.isa:isa': 'isa.today',
  'pots.gia:gia': 'gia.today',
  'pots.atStop:parSipp': 'pot.atStop',
  'pots.statePension:spWeekly': 'statePension.week',
  'pots.finalSalary:db': 'finalSalary.0.amount',
  'says.sp:saysSp': 'statePension.amount',
  'says.sp:saysSpAge': 'statePension.age',
  'says.spAssumed:saysSp': 'statePension.amount',
  'says.spAssumed:saysSpAge': 'statePension.age',
  'saving.you:you': 'payIn.fromTakeHome',
  'saving.payIn:you': 'payIn.fromTakeHome',
  'saving.employer:employer': 'payIn.employer',
  'saving.payIn:employer': 'payIn.employer',
  'budget.totalLine:total': 'spend.total',
  'budget.essentialsLine:essentials': 'spend.essentials'
});

/** Figures numbered by their place in a list: `${lineId}:${prefix}` → the fact pattern with `#` for the number. */
const NUMBERED = Object.freeze({
  'income.lump:lump': 'lump.#.amount',
  'pays.step:step': 'income.step.#.beforeTax'
});

export function figureFactOf(lineId, key) {
  const k = String(key || '');
  const plain = FIGURES[`${lineId}:${k}`];
  if (plain) return plain;
  const m = /^([a-zA-Z]+)(\d+)$/.exec(k);
  if (m) {
    const pattern = NUMBERED[`${lineId}:${m[1]}`];
    if (pattern) return pattern.replace('#', m[2]);
  }
  return null;
}

/** The filled lines of the plan pages (their copy's templates): which slot holds which fact. */
const SLOTS = Object.freeze({
  'about.stopIn': { month: 'stop.month' },
  'about.stoppedIn': { month: 'stop.month' },
  'about.monthAs': { month: 'stop.month' },
  'about.runs': { endAge: 'plan.endAge' },
  'lasts.left': { pounds: 'left.typically', typical: 'left.typically' },
  'pots.pots.today': { pension: 'pot.today', isa: 'isa.today' },
  'pots.pots.todayTaxable': { pension: 'pot.today', isa: 'isa.today', taxable: 'gia.today' },
  'pots.stop.typed': { sipp: 'pot.atStop' },
  'pots.stop.projection': { sipp: 'pot.atStop' },
  'pots.stop.answer': { sipp: 'pot.atStop' },
  'income.sp.assumed': { yearly: 'statePension.amount', age: 'statePension.age' },
  'income.sp.assumedNoAge': { yearly: 'statePension.amount' },
  'income.sp.paid': { yearly: 'statePension.amount', age: 'statePension.age' },
  'income.sp.noDate': { yearly: 'statePension.amount', age: 'statePension.age' },
  'income.sp.noDateNoAge': { yearly: 'statePension.amount' },
  'income.sp.before': { yearly: 'statePension.amount' },
  'home.headline.savingStop': { month: 'stop.month' },
  'home.saver.want': { amount: 'want.income', age: 'want.stopAge' },
  'home.saver.nowShare': { pct: 'payIn.pctOfPay' },
  'home.saver.enoughShare': { pct: 'saver.enough.pct' },
  'home.moveWindow': { stop: 'stop.month' },
  'saving.ages': { month: 'stop.month', span: 'yearsToGo', from: 'age.today' },
  'saving.agesNoMonth': { span: 'yearsToGo', from: 'age.today' },
  'saving.potNow': { value: 'pot.today' },
  'saving.atStop': { value: 'pot.atStop' }
});

/** Numbered lines: the slot `n` (1-based) names the pension the line is about. */
const SLOTS_NUMBERED = Object.freeze({
  'income.fs.line': { amount: 'finalSalary.#.amount', age: 'finalSalary.#.age' },
  'income.fs.before': { amount: 'finalSalary.#.amount', age: 'finalSalary.#.age' }
});

export function slotFactsOf(lineId, slots = null) {
  if (SLOTS[lineId]) return SLOTS[lineId];
  const numbered = SLOTS_NUMBERED[lineId];
  if (numbered && slots && slots.n != null && /^\d+$/.test(String(slots.n))) {
    const i = String(Number(slots.n) - 1);
    return Object.fromEntries(Object.entries(numbered).map(([k, v]) => [k, v.replace('#', i)]));
  }
  return {};
}

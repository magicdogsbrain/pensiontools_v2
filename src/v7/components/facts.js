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

import { GILTS_HELD_FIND, LASTS_FINDS } from '../../reading/sentenceMarks.js';

/** The words under "Does it last?" (OneAnswer's weighted words), marked as the full view marks them: a row id → its finds. */
const LASTS_ROW_FINDS = Object.freeze({ floorW: LASTS_FINDS.floor, leftW: LASTS_FINDS.left, assumedW: LASTS_FINDS.assumed, fixedW: LASTS_FINDS.fixed });
/** The fixed-age line where a band leads with it or states it under the weighted chance. */
export const FIXED_FINDS = LASTS_FINDS.fixed;
export const lastsRowFindsOf = (id) => LASTS_ROW_FINDS[id] || null;

/** `${lineId}:${figureKey}` → fact id, for the sentences read.js writes (src/answers/plan/read.js). */
const FIGURES = Object.freeze({
  'about.age:ageToday': 'age.today',
  'about.runs:ageEnd': 'plan.endAge',
  'where.pot:pot': 'pot.today',
  'where.saverPot:actual': 'pot.today',
  'where.taken:drawn': 'taken.againstPlan',
  'where.retired:drawn': 'taken.againstPlan',
  'hold.summary:pension': 'holdings.sipp',
  'hold.summary:isa': 'holdings.isa',
  'hold.summary:gia': 'holdings.gia',
  'hold.summary:cash': 'holdings.cash',
  'hold.total:total': 'holdings.total',
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

/** Phrases of a sentence read.js wrote that are one fact ("3 of 22" gilts held; the lock and its date): [[RegExp, factId]]. */
const FINDS = Object.freeze({
  'move.giltsHeld': [[GILTS_HELD_FIND, 'gilts.held']],
  'move.gilts': [[GILTS_HELD_FIND, 'gilts.held']],
  'move.giltsPart': [[GILTS_HELD_FIND, 'gilts.held']],
  'lock.locked': [[/^(Locked)\b/, 'lock.state'], [/^Locked (.+)$/, 'lock.date']],
  'lock.notLocked': [[/^(Not locked)/, 'lock.state']]
});
export const sentenceFindsOf = (id) => FINDS[id] || [];

/** The filled lines of the plan pages (their copy's templates): which slot holds which fact. */
const SLOTS = Object.freeze({
  'way.strategy': { strategy: 'way.name' },
  'about.stopIn': { month: 'stop.month' },
  'about.stoppedIn': { month: 'stop.month' },
  'about.monthAs': { month: 'stop.month' },
  'about.runs': { endAge: 'plan.endAge' },
  'lasts.left': { pounds: 'left.typically', typical: 'left.typically', bad: 'left.badCase', good: 'left.goodCase' },
  'lasts.ran.market': { label: 'market.gilts' },
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

/** The stage line's "Locked {date}." on every plan page: the date is the lock's. */
export const LOCK_DATE = Object.freeze({ date: 'lock.date' });

/**
 * The words after a line's figure (PLAN.lineAfter): which slot holds which fact. A lump sum's age is numbered by its figure's
 * key (lump0 → lump.0.age), as its amount is.
 */
const AFTER = Object.freeze({
  'pots.statePension': { from: 'statePension.start' },
  'income.lump': { age: 'lump.#.age' }
});
export function afterFactsOf(line) {
  const m = line && AFTER[line.id];
  if (!m) return {};
  const parts = (line.sentence && Array.isArray(line.sentence.parts)) ? line.sentence.parts : [];
  const keyed = parts.find((p) => p && typeof p === 'object' && 'key' in p);
  const n = keyed ? /(\d+)$/.exec(String(keyed.key)) : null;
  const out = {};
  for (const [slot, id] of Object.entries(m)) {
    if (!id.includes('#')) out[slot] = id;
    else if (n) out[slot] = id.replace('#', n[1]);
  }
  return out;
}

/**
 * The spending page's worked-out lines (answers/plan/spend.js derivedLines): each income step's line ("From age 60: £X a
 * month after tax (£Y a year before tax)") marks its two figures as that step's facts, numbered in the order the steps come.
 */
export function spendDerivedFactsOf(lines) {
  let n = -1;
  return (lines || []).map((d) => (d && /^(first|step)\./.test(d.id) ? (n += 1, { monthly: `income.step.${n}.monthAfterTax`, yearly: `income.step.${n}.beforeTax` }) : {}));
}

/** A lump sum's line on the spending page, by its place in the list: its amount and age. */
export const spendLumpFactsOf = (i) => ({ amount: `lump.${i}.amount`, age: `lump.${i}.age` });

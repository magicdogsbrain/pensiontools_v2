/**
 * Ladder position — "what do I do this month" for the contract strategies (full-il-gilt,
 * floor-the-schedule). Pure: (buildGiltLadder plan, date, balances) -> position. No DOM, no
 * Firebase, no engine. The Decision tool renders this instead of P&V pot advice.
 *
 * The ladder's unit of account is the UK TAX year (6 April). Every rung funds one or more tax
 * years. This module answers, for any date:
 *   - which tax year we are in, which income step, and what the ladder owes this year
 *   - the monthly amount to instruct the broker to pay
 *   - what the cash years still need (this year's payments to come, and the later cash years), against the cash held
 *     (7.12.0: the need "Your plan's mix" reads; a gilt matured for a later year is cash held, not "parked")
 *   - the next maturity, what it is for, and how long it sits before it is needed
 */

/** UK tax year containing `d`: 6 Apr Y – 5 Apr Y+1 returns Y. */
export function taxYearOf(d) {
  const m = d.getMonth(), day = d.getDate();
  return (m > 3 || (m === 3 && day >= 6)) ? d.getFullYear() : d.getFullYear() - 1;
}

/**
 * Months remaining in tax year `Y` from date `d` (1..12, counting the current month): calendar months, from this one to
 * March (7.12.0: late in a month still counts that month, as "Your plan's mix" counts them; 1–5 April is the last, 1).
 */
export function monthsLeftInTaxYear(Y, d) {
  if (d >= new Date(Y + 1, 3, 6)) return 0;
  if (d < new Date(Y, 3, 6)) return 12;
  return Math.max(1, Math.min(12, (Y + 1) * 12 + 3 - (d.getFullYear() * 12 + d.getMonth())));
}

const ymOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
const inYear = (Y, month) => (h) => {
  const m = String((h && h.date) || '').slice(0, 7);
  const a = /^(\d{4})-(\d{2})$/.exec(m);
  return !!a && m < month && (+a[2] >= 4 ? +a[1] : +a[1] - 1) === Y;
};
/** How many months of tax year `Y` before `month` are recorded (each month once). */
export function recordedMonthsBefore(records, Y, month) {
  return new Set((Array.isArray(records) ? records : []).filter(inYear(Y, month)).map((h) => String(h.date).slice(0, 7))).size;
}
/**
 * What the recorded months of tax year `Y` before `month` ('YYYY-MM') took from the pension, before tax: the records'
 * `sipp`, summed in pence and rounded once. The month itself and later months are not counted.
 */
export function drawnFromRecords(records, Y, month) {
  const p = (Array.isArray(records) ? records : []).filter(inYear(Y, month)).reduce((t, h) => t + Math.round((Number.isFinite(+h.sipp) ? +h.sipp : 0) * 100), 0);
  return Math.round(p / 100);
}

/**
 * @param {object} plan  buildGiltLadder() output: { years[], orders[], cash, firstTaxYear, ... }
 * @param {object} [o]
 * @param {Date}   [o.today]
 * @param {number} [o.cashBalance]  actual SIPP cash + money-market balance, if known
 * @param {number} [o.drawnThisYear] amount already withdrawn in this tax year, if known (typed: it wins over the records)
 * @param {Array}  [o.records]  the Decision history: with no drawnThisYear, what its months of this tax year before today's
 *   month took (drawnFromRecords), so the month's figure is what is still to pay over the months still to come
 * @param {Date|string} [o.potsDay]  the day the run's pots belong to, when they belong to a plan year already begun
 *   (PlanFromToday.potsDayOf). The engines run the year that day falls in as the twelve months from it, at that year's
 *   figures (PlanFromToday.js, "The run's years"), so the ladder's first year, begun before it, is paid at its need over
 *   twelve months from that day — not squeezed into the months left to 5 April (6.51.0: someone who stopped work this tax
 *   year or earlier). Absent: every year over the months left to its 5 April, as always.
 * @param {Date|string} [o.startsOn]  the month the plan's first payment is due ('YYYY-MM'): the month work stops, when it
 *   falls after April in the ladder's first tax year (the plan's timing.startMonth, mode 'future'). That year pays for the
 *   months it has, at the year's monthly rate (its need ÷ 12, or ÷ the months a ladder built for a part year holds): nothing
 *   before that month (phase 'before', said with the month it starts), then a twelfth a month to March. Absent or April:
 *   as always.
 * @returns {object|null} null when the plan has no years
 */
export function ladderPosition(plan, o = {}) {
  if (!plan || !Array.isArray(plan.years) || !plan.years.length) return null;
  const today = o.today || new Date();
  const Y = taxYearOf(today);
  const years = plan.years;
  const first = years[0].Y, last = years[years.length - 1].Y;
  const cur = years.find((y) => y.Y === Y) || null;
  let phase = Y < first ? 'before' : Y > last ? 'after' : 'running';

  // What the ladder owes this tax year, and the monthly instruction. A first year built for part of the year (its `months`)
  // owes that share; its gross and need are said as a year's (perYear), its month at the year's rate (rateOf below).
  const perYear = (y, v) => (y && y.months > 0 ? v * 12 / y.months : v);
  const need = cur ? cur.need : 0;
  const gross = cur ? perYear(cur, cur.gross) : 0;
  const sp = Math.max(0, gross - perYear(cur, need));
  const monthsLeft = monthsLeftInTaxYear(Y, today);
  // What is still to pay: a figure typed for what was drawn, taken off the need; else the months recorded this tax year
  // before this one, each counted as a month the plan paid (the records are in pounds of their day and the need in today's
  // money, so the count, not their sum, says what share of the year is paid); with neither, the whole need.
  const typed = o.drawnThisYear != null && Number.isFinite(+o.drawnThisYear) ? +o.drawnThisYear : null;
  const drawn = typed != null ? typed : drawnFromRecords(o.records, Y, ymOf(today));
  const paidMonths = typed != null ? 0 : recordedMonthsBefore(o.records, Y, ymOf(today));
  const remaining = typed != null ? Math.max(0, need - typed) : need * monthsLeft / Math.max(monthsLeft, Math.min(12, monthsLeft + paidMonths));
  const potsDay = o.potsDay ? new Date(o.potsDay) : null;
  const spread = !!cur && Y === first && !!potsDay && Number.isFinite(potsDay.getTime()) && taxYearOf(potsDay) === Y;
  // Year 0 pays for the months it has (7.12.0): a first tax year that starts in the month work stops pays nothing before
  // that month and a month at the year's rate from it; a year begun before the pots' day likewise from that day's month.
  const startDay = monthStartOf(o.startsOn);
  const startsLate = !!startDay && taxYearOf(startDay) === first && startDay > new Date(first, 3, 6);
  const notYet = startsLate && Y === first && ymOf(today) < ymOf(startDay);
  const rateOf = (y) => (y ? (+y.need || 0) / (y.months > 0 ? y.months : 12) : 0);
  const partYear = !!cur && Y === first && (spread || startsLate) && !notYet;
  const monthly = notYet ? 0 : partYear ? rateOf(cur) : monthsLeft > 0 ? remaining / monthsLeft : 0;
  // the month this tax year's payments began (part year): the later of the stop month and the pots' month
  const paidFrom = partYear ? [startsLate ? startDay : null, spread ? new Date(potsDay.getFullYear(), potsDay.getMonth(), 15) : null].filter(Boolean).sort((a, b) => b - a)[0] : null;
  const paymentsOf = (d) => monthsLeftInTaxYear(first, new Date(d.getFullYear(), d.getMonth(), 15));

  // What the cash years still need (7.12.0, as "Your plan's mix" reads it, answers/plan/held.js): this year's payments still
  // to come (the month's payment times the months left), and every later year the plan pays from cash. A gilt that has
  // matured for a later year is cash the person holds, not a need of its own.
  const dueThisYear = cur ? monthly * monthsLeft : 0;
  const laterCashYears = years.filter((y) => y.Y > Y && y.from === 'cash').reduce((s, y) => s + (+y.need || 0), 0);

  // Next maturity ahead of us.
  const future = (plan.orders || []).filter((r) => new Date(r.matures) > today).sort((a, b) => a.matures.localeCompare(b.matures));
  const next = future.length ? future[0] : null;
  const nextInfo = next ? {
    tidm: next.tidm, name: next.name, matures: next.matures, nominal: next.nominal, pays: next.pays,
    taxYears: next.taxYears || [], monthsAway: Math.round((new Date(next.matures) - today) / (30.44 * 24 * 3600 * 1000)),
    sitsMonths: next.taxYears && next.taxYears.length
      ? Math.max(0, Math.round((new Date(next.taxYears[0], 3, 6) - new Date(next.matures)) / (30.44 * 24 * 3600 * 1000))) : 0
  } : null;

  // Cash check: the cash held against what the cash years still need — a fact, never an instruction
  const bal = (o.cashBalance == null) ? null : o.cashBalance;
  const cashCheck = bal == null ? null : { balance: bal, dueThisYear, laterCashYears, need: dueThisYear + laterCashYears, diff: bal - (dueThisYear + laterCashYears) };

  // The first year of the ladder, for a plan that has not started drawing yet.
  if (notYet) phase = 'before';
  const firstYear = years[0];
  const firstPayments = startsLate ? paymentsOf(startDay) : 12;
  const upcoming = phase === 'before' ? {
    Y: firstYear.Y, label: `${firstYear.Y}/${String(firstYear.Y + 1).slice(2)}`, age: firstYear.age,
    gross: perYear(firstYear, firstYear.gross), fromLadder: perYear(firstYear, firstYear.need), statePension: Math.max(0, perYear(firstYear, firstYear.gross - firstYear.need)),
    monthly: rateOf(firstYear), source: firstYear.from, startsOn: startsLate ? startDay : new Date(firstYear.Y, 3, 6),
    startsLabel: startsLate ? MONTHS[startDay.getMonth()] + ' ' + startDay.getFullYear() : '6 April ' + firstYear.Y,
    payments: firstPayments, yearPays: rateOf(firstYear) * firstPayments, startsLate,
    cashBucket: plan.cash || 0,
    cashYears: years.filter((y) => y.from === 'cash').length
  } : null;
  const toMarch = 'March ' + (Y + 1);

  return {
    taxYear: Y, taxYearLabel: `${Y}/${String(Y + 1).slice(2)}`, phase, upcoming,
    age: cur ? cur.age : null, gross, statePension: sp, fromLadder: perYear(cur, need),
    source: cur ? cur.from : null, sourceHeld: cur ? !!cur.held : false,
    monthsLeft, drawnThisYear: drawn, remaining, monthly,
    next: nextInfo, cashCheck,
    yearsLeft: Math.max(0, last - Y),
    spread,
    instruction: phase === 'before' && startsLate
      ? `The plan starts paying in ${upcoming.startsLabel}: ${fmt(upcoming.monthly)} a month, ${firstPayments} payment${firstPayments === 1 ? '' : 's'} to March ${first + 1}, ${fmt(upcoming.yearPays)}.`
      : cur
      // what the plan's rule does this month, never an order to give (7.12.0 round 3, decision 6)
      ? (partYear ? `The plan pays ${fmt(monthly)} a month: in ${Y}/${String(Y + 1).slice(2)} that is ${paymentsOf(paidFrom)} payment${paymentsOf(paidFrom) === 1 ? '' : 's'}, ${paymentsOf(paidFrom) === 1 ? toMarch : MONTHS[paidFrom.getMonth()] + ' ' + paidFrom.getFullYear() + ' to ' + toMarch}, ${fmt(monthly * paymentsOf(paidFrom))}.`
        : `The plan pays ${fmt(monthly)} a month for the ${monthsLeft} month${monthsLeft === 1 ? '' : 's'} to 5 April ${Y + 1}.`)
      : (phase === 'before' ? `The ladder starts in ${first}/${String(first + 1).slice(2)}.` : 'The ladder has paid its last year.')
  };
}

function fmt(v) { return '£' + Math.round(v).toLocaleString('en-GB'); }
/**
 * The month a plan's first payment is due, from its timing (deriveTiming, or a plan document's copy of it): the month work
 * stops for a plan still to start (mode 'future'), else null (a plan already running: its year began as it always did).
 */
export function startsOnOf(timing) {
  return timing && timing.mode === 'future' && /^\d{4}-\d{2}$/.test(String(timing.startMonth || '')) ? timing.startMonth : null;
}
/** The first day of a month given as 'YYYY-MM', a date string or a Date (6 April for April); null when unreadable. */
function monthStartOf(v) {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})$/.exec(String(v));
  const d = m ? new Date(+m[1], +m[2] - 1, 1) : new Date(v);
  if (!Number.isFinite(d.getTime())) return null;
  return d.getMonth() === 3 ? new Date(d.getFullYear(), 3, 6) : new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * The ladder box's check in words (7.12.0), one sentence a line: this year's payments still to come, then — with a cash
 * figure — the cash held against what the cash years still need, then where the rest of the pension is read. Facts only:
 * nothing about parking money or where to keep it.
 * @param {object} lp  ladderPosition()
 * @returns {string[]}
 */
export function ladderCheckWords(lp) {
  if (!lp) return [];
  const to = '5 April ' + (lp.taxYear + 1);
  const due = lp.cashCheck ? lp.cashCheck.dueThisYear : lp.monthly * lp.monthsLeft;
  const out = [fmt(lp.monthly) + ' a month for the ' + lp.monthsLeft + ' month' + (lp.monthsLeft === 1 ? '' : 's') + ' to ' + to + ': ' + fmt(due) + '.'];
  const c = lp.cashCheck;
  if (c) {
    const parts = fmt(c.dueThisYear) + ' to ' + to + (Math.round(c.laterCashYears) > 0 ? ' and ' + fmt(c.laterCashYears) + ' for later cash years' : '');
    const gap = Math.round(c.need) - Math.round(c.balance);
    out.push('Cash: you hold ' + fmt(c.balance) + '. The plan’s cash years still ahead need ' + fmt(c.need) + ' (' + parts + '): '
      + (gap > 0 ? fmt(gap) + ' more than your cash.' : gap < 0 ? fmt(-gap) + ' less than your cash.' : 'the same as your cash.'));
  }
  out.push('What else your pension holds is on Your plan’s mix.');
  return out;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * A gilt ladder's month in the Decision tool (index.html decisionStrategyOverlay): what pays, the label stamped on the
 * record, and the note. Placed by the LADDER's own years (6.51.0, research/plan-start.md §2 E, §4), never by the plan year
 * alone: before the ladder's first year — a running plan whose ladder, bought again from today, has no gilt paying yet (or a
 * month of a plan stored the old way, with a later start) — the month comes from cash; in a cash year, the cash years pay
 * until the first gilt. The label
 * names no year (models/Decision.js stamps it on the record, and the year moves when the plan's start does).
 * @param {object|null} lp  ladderPosition(), or null when the ladder cannot be built (the month's own draw is used then)
 * @param {{ Y: number, label: string }|null} rung  firstRungOf(the ladder)
 * @param {number} total  the month's SIPP draw
 * @param {number} planYearSigned  the month's plan year, for when there is no ladder to read
 */
export function ladderMonthAdvice(lp, rung, total, planYearSigned) {
  if (lp ? lp.phase === 'before' : planYearSigned < 0) {
    return { floorMonthly: total, floorLabel: 'cash, until the first gilt pays',
      note: 'Until the ladder\'s first gilt pays' + (lp && lp.upcoming ? ' (' + lp.upcoming.label + ')' : '') + ': this month comes from your cash. Nothing is sold' + (rung ? '; your ladder\'s first gilt pays from ' + rung.label + '.' : '.') };
  }
  // (7.12.0: the note never says the money is already in cash — only the month's own cash figure can say that, DecisionOverlay)
  if (!lp) return { floorMonthly: total, floorLabel: 'this year\'s matured rung', note: 'Every year is bought by contract. Nothing is sold.' };
  return { floorMonthly: lp.monthly, floorLabel: lp.source === 'cash' ? 'the cash years bucket' : 'rung ' + lp.source + ' (already cash)',
    note: 'Tax year ' + lp.taxYearLabel + ', age ' + lp.age + '. ' + lp.instruction + (lp.source === 'cash' && rung ? ' The plan\'s cash years pay until the ladder\'s first gilt, from ' + rung.label + '.' : '') + ' Nothing is sold.' };
}

/**
 * The ladder's first gilt: the first tax year a rung (not the cash years) pays, as { Y, label: '2028/29' }; null when
 * every year is cash or the ladder has none. The ladder's own timing — never the plan's start (research/plan-start.md §2 E).
 */
export function firstRungOf(plan) {
  const y = plan && Array.isArray(plan.years) ? plan.years.find((x) => x && x.from && x.from !== 'cash') : null;
  return y ? { Y: y.Y, label: `${y.Y}/${String(y.Y + 1).slice(2)}` } : null;
}

/**
 * The ladder stored in a plan document — the orders, units and costs fixed when the plan was locked. Null when
 * there is no document, it holds no ladder, or it was written for a different strategy than `strategyId`.
 */
export function documentLadder(doc, strategyId = null) {
  const plan = doc && doc.strategy && doc.strategy.r ? doc.strategy.r.plan : null;
  if (!plan || !Array.isArray(plan.years) || !plan.years.length || !Array.isArray(plan.orders)) return null;
  if (strategyId && doc.strategy.id && doc.strategy.id !== strategyId) return null;
  return plan;
}

/**
 * The ladder to show as "your plan" (6.13.5): for a LOCKED plan the one in its plan document, never a rebuild —
 * `rebuild` is not even called. Rebuilding from the live settings and today's gilt prices (what every screen did
 * before) moved the order sheet, the costs and the spare away from the document a little every day. A draft has
 * no document, so it keeps live pricing: `rebuild()` is the ladder.
 * @param {object|null} doc        the active plan document (null = a draft)
 * @param {string|null} strategyId the plan's strategy; a document written for another strategy is ignored
 * @param {function}    rebuild    () => buildGiltLadder() output at today's prices
 * @returns {{ plan: object|null, source: 'document'|'live', pricedOn: string|null }}
 */
export function ladderForDisplay(doc, strategyId, rebuild) {
  const locked = documentLadder(doc, strategyId);
  if (locked) return { plan: locked, source: 'document', pricedOn: (doc.assumptions && doc.assumptions.giltPricesAsOf) || String(doc.lockedAt || doc.createdAt || '').slice(0, 10) || null };
  const live = typeof rebuild === 'function' ? rebuild() : null;
  return { plan: live && Array.isArray(live.years) && live.years.length ? live : null, source: 'live', pricedOn: null };
}

/**
 * The one sentence allowed to mention today's prices next to a locked ladder — labelled as a comparison.
 * `cmp` is GiltLadderPlan.repriceLadder(); `pricedOn` the day the document's ladder was priced. '' when there
 * is nothing left to compare (every rung paid).
 */
export function repriceComparisonText(cmp, pricedOn = null) {
  if (!cmp || !(cmp.rungs > 0)) return '';
  const day = (iso) => { const d = new Date(iso + 'T12:00:00'); return Number.isFinite(d.getTime()) ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : iso; };
  const diff = Math.round(cmp.difference);
  const n = cmp.rungs + ' gilt' + (cmp.rungs === 1 ? '' : 's') + (cmp.paid > 0 ? ' still to be paid' : '');
  return 'Comparison only: at today\'s prices (' + day(cmp.asOf) + ') the ' + n + ' on this ladder would cost ' + fmt(cmp.todayCost) + ' to buy — '
    + (Math.abs(diff) < 1 ? 'the same as' : fmt(Math.abs(diff)) + (diff > 0 ? ' more than' : ' less than')) + ' the ' + fmt(cmp.lockedCost) + ' they were priced at'
    + (pricedOn ? ' on ' + day(pricedOn) : ' when the plan was locked') + '.'
    + (cmp.unpriced.length ? ' ' + cmp.unpriced.join(', ') + ' could not be priced today and ' + (cmp.unpriced.length === 1 ? 'is' : 'are') + ' left out of both figures.' : '')
    + ' Your plan is the locked one: its orders, units and amounts do not change with the market.';
}

/**
 * Borrowed-floor status — after a rotation, what it would cost TODAY to put the sold income
 * back. Pure: (borrowedFloor record, yieldForYear) → status. The record is written by the
 * guided switch (index.html executeRotation) into strategyParams.borrowedFloor.
 */
export function borrowedFloorStatus(borrowedFloor, yieldForYear, now = new Date()) {
  if (!borrowedFloor || !Array.isArray(borrowedFloor.years) || !borrowedFloor.years.length) return null;
  const yf = (k) => (yieldForYear ? yieldForYear(k) : 0.023);
  let cost = 0;
  const nowY = taxYearOf(now);
  const future = borrowedFloor.years.filter((y) => y.Y >= nowY);
  for (const y of future) { const k = Math.max(0.5, y.Y - nowY + 1); cost += y.need / Math.pow(1 + yf(k), k); }
  const ages = future.map((y) => y.age);
  return {
    since: borrowedFloor.soldAt,
    proceeds: borrowedFloor.proceeds || 0,
    incomePerYear: future.length ? future[0].need : 0,
    totalIncome: future.reduce((s, y) => s + y.need, 0),
    ages: ages.length ? [Math.min(...ages), Math.max(...ages)] : null,
    yearsLeft: future.length,
    rebuyCostToday: cost
  };
}

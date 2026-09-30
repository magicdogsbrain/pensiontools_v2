/**
 * Ladder position — "what do I do this month" for the contract strategies (full-il-gilt,
 * floor-the-schedule). Pure: (buildGiltLadder plan, date, balances) -> position. No DOM, no
 * Firebase, no engine. The Decision tool renders this instead of P&V pot advice.
 *
 * The ladder's unit of account is the UK TAX year (6 April). Every rung funds one or more tax
 * years; money that has matured but belongs to a later tax year is "parked" (CSH2) and must not
 * be spent. This module answers, for any date:
 *   - which tax year we are in, which income step, and what the ladder owes this year
 *   - the monthly amount to instruct the broker to pay
 *   - what should be sitting in cash now, and what should be parked for later years
 *   - the next maturity, what it is for, and how long it sits before it is needed
 */

/** UK tax year containing `d`: 6 Apr Y – 5 Apr Y+1 returns Y. */
export function taxYearOf(d) {
  const m = d.getMonth(), day = d.getDate();
  return (m > 3 || (m === 3 && day >= 6)) ? d.getFullYear() : d.getFullYear() - 1;
}

/** Months remaining in tax year `Y` from date `d` (1..12, counting the current month). */
export function monthsLeftInTaxYear(Y, d) {
  const end = new Date(Y + 1, 3, 6);
  if (d >= end) return 0;
  const start = new Date(Y, 3, 6);
  const from = d < start ? start : d;
  return Math.max(1, Math.min(12, Math.round((end - from) / (30.44 * 24 * 3600 * 1000))));
}

/**
 * @param {object} plan  buildGiltLadder() output: { years[], orders[], cash, firstTaxYear, ... }
 * @param {object} [o]
 * @param {Date}   [o.today]
 * @param {number} [o.cashBalance]  actual SIPP cash + money-market balance, if known
 * @param {number} [o.drawnThisYear] amount already withdrawn in this tax year, if known
 * @returns {object|null} null when the plan has no years
 */
export function ladderPosition(plan, o = {}) {
  if (!plan || !Array.isArray(plan.years) || !plan.years.length) return null;
  const today = o.today || new Date();
  const Y = taxYearOf(today);
  const years = plan.years;
  const first = years[0].Y, last = years[years.length - 1].Y;
  const cur = years.find((y) => y.Y === Y) || null;
  const phase = Y < first ? 'before' : Y > last ? 'after' : 'running';

  // What the ladder owes this tax year, and the monthly instruction.
  const need = cur ? cur.need : 0;
  const gross = cur ? cur.gross : 0;
  const sp = Math.max(0, gross - need);
  const monthsLeft = monthsLeftInTaxYear(Y, today);
  const drawn = o.drawnThisYear || 0;
  const remaining = Math.max(0, need - drawn);
  const monthly = monthsLeft > 0 ? remaining / monthsLeft : 0;

  // Everything that has already matured (or is cash) but belongs to a LATER tax year is parked.
  const parked = [];
  for (const y of years) {
    if (y.Y <= Y) continue;
    const matured = y.from === 'cash' ? true : (y.matures ? new Date(y.matures) <= today : false);
    if (matured) parked.push({ Y: y.Y, age: y.age, amount: y.need, from: y.from, until: new Date(y.Y, 3, 6) });
  }
  const parkedTotal = parked.reduce((s, p) => s + p.amount, 0);

  // Next maturity ahead of us.
  const future = (plan.orders || []).filter((r) => new Date(r.matures) > today).sort((a, b) => a.matures.localeCompare(b.matures));
  const next = future.length ? future[0] : null;
  const nextInfo = next ? {
    tidm: next.tidm, name: next.name, matures: next.matures, nominal: next.nominal, pays: next.pays,
    taxYears: next.taxYears || [], monthsAway: Math.round((new Date(next.matures) - today) / (30.44 * 24 * 3600 * 1000)),
    sitsMonths: next.taxYears && next.taxYears.length
      ? Math.max(0, Math.round((new Date(next.taxYears[0], 3, 6) - new Date(next.matures)) / (30.44 * 24 * 3600 * 1000))) : 0
  } : null;

  // Cash check: what should be liquid now is this year's remaining draw; the rest should be parked.
  const shouldBeLiquid = remaining;
  const expectedTotal = shouldBeLiquid + parkedTotal;
  const bal = (o.cashBalance == null) ? null : o.cashBalance;
  const cashCheck = bal == null ? null : {
    balance: bal, shouldBeLiquid, parkedTotal, expectedTotal,
    diff: bal - expectedTotal,
    verdict: Math.abs(bal - expectedTotal) < Math.max(500, expectedTotal * 0.02) ? 'as expected'
      : bal > expectedTotal ? 'more cash than the plan needs — park the surplus'
      : 'less cash than the plan needs — check the last maturity landed'
  };

  // The first year of the ladder, for a plan that has not started drawing yet.
  const firstYear = years[0];
  const upcoming = phase === 'before' ? {
    Y: firstYear.Y, label: `${firstYear.Y}/${String(firstYear.Y + 1).slice(2)}`, age: firstYear.age,
    gross: firstYear.gross, fromLadder: firstYear.need, statePension: Math.max(0, firstYear.gross - firstYear.need),
    monthly: firstYear.need / 12, source: firstYear.from, startsOn: new Date(firstYear.Y, 3, 6),
    cashBucket: plan.cash || 0,
    cashYears: years.filter((y) => y.from === 'cash').length
  } : null;

  return {
    taxYear: Y, taxYearLabel: `${Y}/${String(Y + 1).slice(2)}`, phase, upcoming,
    age: cur ? cur.age : null, gross, statePension: sp, fromLadder: need,
    source: cur ? cur.from : null, sourceHeld: cur ? !!cur.held : false,
    monthsLeft, drawnThisYear: drawn, remaining, monthly,
    parked, parkedTotal, next: nextInfo, cashCheck,
    yearsLeft: Math.max(0, last - Y),
    instruction: cur
      ? `Instruct the broker to pay ${fmt(monthly)} a month for the ${monthsLeft} month${monthsLeft === 1 ? '' : 's'} to 5 April ${Y + 1}.`
      : (phase === 'before' ? `The ladder starts in ${first}/${String(first + 1).slice(2)}.` : 'The ladder has paid its last year.')
  };
}

function fmt(v) { return '£' + Math.round(v).toLocaleString('en-GB'); }

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

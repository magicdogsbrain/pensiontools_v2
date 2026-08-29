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

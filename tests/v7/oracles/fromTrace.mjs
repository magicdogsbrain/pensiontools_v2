/**
 * The headline worked out again from the month-by-month trace (test plan 3.1). Imports NOTHING from src/:
 * it takes answer.trace, answer.basis, answer.phases and answer.inputs and returns its own figures and a list
 * of disagreements. "Screen equals engine" proves the wiring; this proves the headline means what its sentence says.
 *
 * Every row is one month for one person in pounds of that month, with priceIndex to turn them into today's prices.
 */
import { ukTax, grossFor } from './ukTax.mjs';

const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const TAX_FREE_LIMIT = 268275;

/** Rows grouped by person, in month order. */
export function byPerson(rows) {
  const out = {};
  for (const r of rows) (out[r.who] ??= []).push(r);
  for (const who of Object.keys(out)) out[who].sort((a, b) => a.m - b.m);
  return out;
}

/** The household's take-home each month at today's prices (rows of every person for that month added). */
export function householdByMonth(rows) {
  const out = new Map();
  for (const r of rows) out.set(r.m, (out.get(r.m) || 0) + r.afterTax / r.priceIndex);
  return [...out.entries()].sort((a, b) => a[0] - b[0]).map(([m, v]) => ({ m, takeHome: v }));
}

/** The figures a trace at one amount gives back. */
export function recompute(traceAt, answer) {
  const people = byPerson(traceAt.rows);
  const problems = [];
  const say = (s) => { problems.push(`${traceAt.futureId}: ${s}`); };
  const pots = { you: (answer.inputs.you.pot || 0), partner: ((answer.inputs.partner && answer.inputs.partner.pot) || 0) };
  const savings = answer.inputs.savings || 0;
  const share = answer.inputs.household === 'couple' ? savings / 2 : savings;

  for (const [who, rows] of Object.entries(people)) {
    // each month: what was there, plus growth, less the charges (6.19.0), less what was taken, is what is left; and it is
    // next month's start
    rows.forEach((r, i) => {
      if (typeof r.charge !== 'number' || r.charge < -1e-9) say(`${who} m${r.m}: the charge ${r.charge} is not a figure of 0 or more`);
      if (Math.abs(r.potStart + r.growth - (r.charge || 0) - r.draw - r.potEnd) > 0.01) say(`${who} m${r.m}: potStart + growth − charge − draw ≠ potEnd`);
      if (i + 1 < rows.length && Math.abs(r.potEnd - rows[i + 1].potStart) > 0.01) say(`${who} m${r.m}: potEnd ≠ next potStart`);
      if (Math.abs(r.draw - r.fromPension - r.fromSavings) > 0.01) say(`${who} m${r.m}: draw ≠ fromPension + fromSavings`);
      if (Math.abs(r.fromPension - r.taxFree - r.taxable) > 0.01) say(`${who} m${r.m}: pension draw ≠ tax-free + taxable`);
      if (Math.abs(r.afterTax - (r.statePension + r.finalSalary + r.draw - r.tax)) > 0.01) say(`${who} m${r.m}: afterTax ≠ incomes + draw − tax`);
    });
    // the first month starts with the pot typed in (plus this person's share of the savings)
    const first = rows[0];
    const expected = pots[who] + (who === 'you' || answer.inputs.household === 'couple' ? share : 0);
    if (Math.abs(first.potStart - expected) > 0.01) say(`${who}: first potStart ${first.potStart} ≠ ${expected}`);
    // tax each month, by the hand-written sum on that month's income annualised, on bands risen with prices
    for (const r of rows) {
      const bands = { pa: BANDS.pa * r.priceIndex, brl: BANDS.brl * r.priceIndex, hrl: BANDS.hrl * r.priceIndex };
      const want = ukTax(12 * (r.taxable + r.statePension + r.finalSalary), bands) / 12;
      if (Math.abs(want - r.tax) > 0.01) say(`${who} m${r.m}: tax ${r.tax.toFixed(2)} ≠ hand sum ${want.toFixed(2)}`);
    }
    // tax-free cash never over the limit (in pounds of the day, as the limit is), never over a quarter of the draw
    const taxFree = rows.reduce((s, r) => s + r.taxFree, 0);
    const oneMonth = Math.max(0, ...rows.map((r) => r.taxFree));
    if (taxFree > TAX_FREE_LIMIT + oneMonth + 0.01) say(`${who}: tax-free cash ${taxFree.toFixed(2)} over the limit`);
    for (const r of rows) if (r.taxFree > 0.25 * r.fromPension + 0.005) say(`${who} m${r.m}: tax-free over a quarter`);
    // the State Pension: the yearly amount ÷ 12, risen with prices, from its start; none before
    const person = answer.inputs[who];
    if (person) {
      const spRows = rows.filter((r) => r.statePension > 0);
      if (spRows.length) {
        const yearly = person.statePension.kind === 'forecast' ? person.statePension.yearly : person.statePension.kind === 'none' ? 0 : 241.3 * 52;
        for (const r of spRows) if (Math.abs(r.statePension - (yearly / 12) * r.priceIndex) > 0.01) say(`${who} m${r.m}: State Pension ${r.statePension.toFixed(2)} ≠ ${((yearly / 12) * r.priceIndex).toFixed(2)}`);
        const firstSp = spRows[0].m;
        for (const r of rows) if (r.m >= firstSp && r.statePension <= 0) say(`${who} m${r.m}: State Pension stops`);
      }
    }
  }

  // The household's take-home each month, at today's prices, against the phases. The engine keeps the £100,000
  // point where the allowance shrinks in pounds of the day while the bands rise with prices, and it aims at a
  // before-tax target (the gross equivalent of the person's share) whose after-tax value it works out in the
  // pounds of the day: once that target passes £100,000 in a future's pounds, the take-home falls short by the
  // allowance withdrawn. That shortfall is worked out here by hand and allowed for; a person with nothing to draw
  // is taxed on their actual income the same way.
  const phaseAt = (m) => answer.phases.find((p) => m >= (p.fromAge - answer.basis.startAge) * 12 && m < (p.toAge - answer.basis.startAge) * 12);
  const months = householdByMonth(traceAt.rows);
  const taperShort = new Map();
  for (const r of traceAt.rows) {
    const bands = { pa: BANDS.pa * r.priceIndex, brl: BANDS.brl * r.priceIndex, hrl: BANDS.hrl * r.priceIndex };
    const risen = { taperFrom: 100000 * r.priceIndex };
    const ph = phaseAt(r.m);
    const person = ph && ph.byPerson.find((b) => b.who === r.who);
    const hasPot = r.potStart > 0 || r.draw > 0;
    let short;
    if (person && hasPot) {
      const target = grossFor(person.takeHome * 12) * r.priceIndex;              // the engine's before-tax target, in the pounds of the day
      short = (ukTax(target, bands) - ukTax(target, bands, risen)) / 12 / r.priceIndex;
    } else {
      const income = 12 * (r.taxable + r.statePension + r.finalSalary);
      short = (ukTax(income, bands) - ukTax(income, bands, risen)) / 12 / r.priceIndex;
    }
    // A final-salary pension rises with prices only up to 5% a year, and nothing makes the difference up (the pot's job
    // is its own share: tests/v7/c/exceptions.md), so in a future where prices rise faster the take-home is short by
    // the erosion.
    // The erosion is after tax: a smaller pension is taxed less.
    const typed = answer.inputs[r.who];
    if (typed && typed.finalSalary && typed.finalSalary.has && r.finalSalary > 0) {
      const keptUp = (typed.finalSalary.yearly / 12) * r.priceIndex;                 // pounds of the day, had it risen in full
      const erosion = Math.max(0, keptUp - r.finalSalary);
      if (erosion > 0) {
        const taxKeptUp = ukTax(12 * (r.taxable + r.statePension + keptUp), bands) / 12;
        const taxNow = ukTax(12 * (r.taxable + r.statePension + r.finalSalary), bands) / 12;
        short += (erosion - (taxKeptUp - taxNow)) / r.priceIndex;
      }
    }
    taperShort.set(r.m, (taperShort.get(r.m) || 0) + short);
  }
  const ranOut = traceAt.runOutMonth;
  const rescuedMonths = new Set(traceAt.rows.filter((r) => r.rescued).map((r) => r.m));
  let lowest = Infinity;
  let firstPhaseLowest = Infinity;     // over the months of the first phase that are not rescued months (a savings draw is a rescue)
  let taperMonths = 0;
  for (const { m, takeHome } of months) {
    if (ranOut !== null && m >= ranOut) break;
    const ph = phaseAt(m);
    if (!ph) { say(`m${m}: no phase`); continue; }
    const short = taperShort.get(m) || 0;
    if (short > 0.005) taperMonths++;
    if (!rescuedMonths.has(m) && Math.abs(takeHome + short - ph.takeHome) > 1) say(`m${m}: household take-home ${takeHome.toFixed(2)} (+ ${short.toFixed(2)} allowance withdrawn) ≠ phase ${ph.takeHome}`);
    if (rescuedMonths.has(m) && takeHome > ph.takeHome + 1) say(`m${m}: rescued month pays more than the phase`);
    if (!rescuedMonths.has(m)) { lowest = Math.min(lowest, takeHome + short); if (ph === answer.phases[0]) firstPhaseLowest = Math.min(firstPhaseLowest, takeHome + short); }
  }
  // the month the pots ran out: the person who ran out has nothing left (a couple's other pot may not be empty:
  // the pots drain in a fixed ratio, and the household is short the moment one of them cannot pay)
  let runOutAge = null;
  if (ranOut !== null) {
    runOutAge = answer.basis.startAge + Math.floor(ranOut / 12);
    const last = traceAt.rows.filter((r) => r.m === ranOut);
    if (!last.some((r) => r.ranOut && r.potEnd <= 0.01)) say('nobody is empty in the month the household ran out');
    for (const r of traceAt.rows) if (r.m > ranOut) say(`${r.who} m${r.m}: a month after the household ran out`);
  }
  return { problems, lowest: Number.isFinite(lowest) ? lowest : null, firstPhaseLowest: Number.isFinite(firstPhaseLowest) ? firstPhaseLowest : null, runOutAge, months: months.length, rescuedMonths: rescuedMonths.size, taperMonths };
}

/**
 * The saving years worked out again from their month-by-month rows (step 4 brief 6, P2; test-plan-A-B.md 4.3).
 * Imports nothing from src/. `rows` are SaveRows (pounds of that month, one person per row); `given` says what
 * the rows must show:
 *   { stopAge?: number | { you, partner? }, payIn?: { you: £ a month, partner?: … }, savingsIn?: { you, partner? }, priceAtStop?, potAtStop?, S? }
 * The pay-in is at today's prices and rises with prices, so a month's payment is payIn × priceIndex. It goes in at the
 * start of the month, before that month's growth: growth is earned on potStart + paidIn.
 *
 * Returns { problems, byPerson: { [who]: { months, potEnd, savingsEnd, paidIn } }, potAtStop } — potAtStop is the
 * household's pension + savings at the stop in today's prices (÷ priceAtStop), when priceAtStop is given.
 */
export function recomputeSaving(rows, given = {}) {
  const problems = [];
  const say = (s) => { problems.push(s); };
  const people = byPerson(rows || []);
  const out = {};
  for (const [who, list] of Object.entries(people)) {
    let paid = 0;
    list.forEach((r, i) => {
      if (r.m !== i) say(`${who}: row ${i} is month ${r.m}`);
      const pay = (r.paidIn && r.paidIn.total) || 0;
      paid += pay / (r.priceIndex || 1);
      if (Math.abs(r.potStart + pay + r.growth - r.charge - r.potEnd) > 0.01) say(`${who} m${r.m}: potStart + paidIn + growth − charge ≠ potEnd`);
      if (i + 1 < list.length && Math.abs(r.potEnd - list[i + 1].potStart) > 0.01) say(`${who} m${r.m}: potEnd ≠ next potStart`);
      if (i + 1 < list.length && Math.abs(r.savingsEnd - list[i + 1].savingsStart) > 0.01) say(`${who} m${r.m}: savingsEnd ≠ next savingsStart`);
      if (r.charge < -1e-9) say(`${who} m${r.m}: a negative charge`);
      if (r.potEnd < -0.01 || r.savingsEnd < -0.01) say(`${who} m${r.m}: a pot below nothing`);
      // at the start of the month, before growth: the growth is what the month did to potStart + paidIn (it can be negative)
      if (given.payIn && who in given.payIn) {
        const want = given.payIn[who] * (r.priceIndex || 1);
        if (Math.abs(pay - want) > 0.01) say(`${who} m${r.m}: paid in ${pay.toFixed(2)}, want ${want.toFixed(2)} (the pay-in rising with prices)`);
      }
      if (given.savingsIn && who in given.savingsIn) {
        const want = given.savingsIn[who] * (r.priceIndex || 1);
        if (Math.abs((r.savingsIn || 0) - want) > 0.01) say(`${who} m${r.m}: into savings ${r.savingsIn}, want ${want.toFixed(2)}`);
      }
      // nothing goes in once work has stopped (stopAge: a number, or { you, partner } — each person's own age at the stop)
      const stop = given.stopAge && typeof given.stopAge === 'object' ? given.stopAge[who] : given.stopAge;
      if (typeof stop === 'number' && r.age >= stop) say(`${who} m${r.m}: a saving month at ${r.age}, at or after the stop`);
    });
    if (typeof given.S === 'number' && list.length !== 12 * given.S) say(`${who}: ${list.length} saving months, want ${12 * given.S}`);
    const last = list[list.length - 1];
    out[who] = { months: list.length, potEnd: last ? last.potEnd : 0, savingsEnd: last ? last.savingsEnd : 0, paidIn: paid };
  }
  let potAtStop = null;
  if (typeof given.priceAtStop === 'number' && given.priceAtStop > 0 && Object.keys(out).length) {
    potAtStop = Object.values(out).reduce((t, x) => t + x.potEnd + x.savingsEnd, 0) / given.priceAtStop;
    if (typeof given.potAtStop === 'number' && Math.abs(potAtStop - given.potAtStop) > 1) say(`the pot at the stop ${potAtStop.toFixed(2)} ≠ the life's ${given.potAtStop}`);
  }
  return { problems, byPerson: out, potAtStop };
}

/** The whole check on one answer with a trace. Returns the disagreements; [] means the trace and the headline agree. */
export function checkTrace(answer) {
  const out = [];
  if (!answer.trace) return ['no trace'];
  const n = answer.basis.futures;
  const tenth = Math.floor(n / 10);
  // C on the lives (a start at an age: step 4 brief section 10, J8) traces the saving months and every future's most and
  // run-out months, not the drawing months (the fast path's run keeps no record of them): the saving months are worked
  // out again here, and the band from the futures list below.
  if (!answer.trace.atCareful && answer.trace.saving) {
    const sv = answer.trace.saving.atCareful;
    const payIn = Object.fromEntries((answer.saving || []).map((s) => [s.who, s.payIn.total]));
    const stopAge = Object.fromEntries((answer.saving || []).map((s) => [s.who, s.stopAge]));
    const S = answer.basis.yearsSaving;
    const r = recomputeSaving(sv.rows, { payIn, stopAge, S, priceAtStop: sv.priceAtStop, potAtStop: S > 0 ? sv.potAtStart : undefined });
    out.push(...r.problems);
    if (S > 0 && answer.potAtStart && Math.abs(sv.potAtStart - answer.potAtStart.careful) > 0.5 + 1e-9) out.push(`the traced life's pot at the start ${sv.potAtStart} is not the bad-case pot ${answer.potAtStart.careful}`);
    return [...out, ...futuresChecks(answer, n, tenth, false)];
  }

  // at the careful amount: the household gets the careful amount, to the pound, every month of the bad-case future.
  // When the pots add nothing to what the household has anyway at the start, the careful amount is that take-home
  // rounded down to £10, and the first phase (what is actually paid) is less than £10 above it.
  const careful = recompute(answer.trace.atCareful, answer);
  out.push(...careful.problems);
  if (answer.trace.atCareful.runOutMonth !== null) out.push('the bad-case future runs out at the careful amount');
  const paid = answer.phases[0].takeHome;
  if (careful.firstPhaseLowest !== null) {
    if (Math.abs(careful.firstPhaseLowest - paid) > 1) out.push(`the lowest household take-home ${careful.firstPhaseLowest.toFixed(2)} ≠ the first phase ${paid}`);
  } else if (careful.lowest !== null && careful.lowest < paid - 1) {
    // every month of the first phase was paid by savings (a rescue, checked only from above): the later months must not fall below it
    out.push(`the lowest household take-home ${careful.lowest.toFixed(2)} is below the first phase ${paid}`);
  }
  if (paid - answer.monthly.careful < -0.005 || paid - answer.monthly.careful >= 10) out.push(`the first phase ${paid} is not the careful amount ${answer.monthly.careful} rounded down to £10`);
  if (paid - answer.monthly.careful > 0.005 && answer.phases[0].fromPots > 0.005) out.push(`the first phase ${paid} is above the careful amount ${answer.monthly.careful} although the pots pay`);
  if (careful.months !== answer.basis.years * 12) out.push(`${careful.months} months traced, not ${answer.basis.years * 12}`);

  // at the middling amount: the bad-case future runs out at the run-out age the answer gives
  const middling = recompute(answer.trace.atMiddling, answer);
  out.push(...middling.problems.filter((p) => !/household take-home|no phase|rescued month/.test(p)));   // the phases are the careful amount's
  if (answer.monthly.middling > answer.monthly.careful || answer.runOutAge.middling < answer.basis.endAge) {
    if (middling.runOutAge !== null && middling.runOutAge !== answer.runOutAge.middling) out.push(`atMiddling runs out at ${middling.runOutAge}, the answer says ${answer.runOutAge.middling}`);
    if (middling.runOutAge === null && answer.runOutAge.middling !== answer.basis.endAge) out.push('atMiddling never runs out but the answer gives a run-out age');
  }

  return [...out, ...futuresChecks(answer, n, tenth, true)];
}

/** The band read again from every future's most and run-out months. `traced`: the month rows name the bad-case futures. */
function futuresChecks(answer, n, tenth, traced) {
  const out = [];
  // the list of futures: the bad case is the one at position floor(n/10), and the careful amount fails in at most floor(n/10)
  const futures = answer.trace.futures;
  if (futures.length !== n) out.push(`${futures.length} futures listed, not ${n}`);
  const failsCareful = futures.filter((f) => f.runOutMonth.careful !== null).length;
  if (failsCareful > tenth) out.push(`the careful amount ran out in ${failsCareful} futures; ${tenth} allowed`);
  const byMost = [...futures].sort((a, b) => a.most - b.most || a.id - b.id);
  if (traced && byMost[tenth].id !== answer.trace.atCareful.futureId) out.push(`the bad case at the careful amount is future ${byMost[tenth].id}, the trace shows ${answer.trace.atCareful.futureId}`);
  const byMid = [...futures].sort((a, b) => (a.runOutMonth.middling ?? Infinity) - (b.runOutMonth.middling ?? Infinity) || a.id - b.id);
  if (traced && byMid[tenth].id !== answer.trace.atMiddling.futureId) out.push(`the bad case at the middling amount is future ${byMid[tenth].id}, the trace shows ${answer.trace.atMiddling.futureId}`);
  // sorting every future's most gives the same three amounts
  const most = byMost.map((f) => f.most);
  const down = (v) => Math.floor(v / 10 + 1e-9) * 10;
  const expect = { careful: down(most[tenth]), middling: down(most[Math.floor(n / 2)]), good: down(most[n - Math.ceil(n / 10)]) };
  for (const k of ['careful', 'middling', 'good']) {
    if (expect[k] !== answer.monthly[k]) out.push(`sorting every future's most gives ${k} ${expect[k]}, the answer says ${answer.monthly[k]}`);
  }
  // the run-out months agree with the futures list
  for (const k of ['careful', 'middling', 'good']) {
    const ages = futures.map((f) => (f.runOutMonth[k] === null ? answer.basis.endAge : answer.basis.startAge + Math.floor(f.runOutMonth[k] / 12))).sort((a, b) => a - b);
    if (ages[tenth] !== answer.runOutAge[k]) out.push(`runOutAge.${k}: the futures give ${ages[tenth]}, the answer ${answer.runOutAge[k]}`);
    const fails = futures.filter((f) => f.runOutMonth[k] !== null).length;
    if (Math.abs((n - fails) / n - answer.lasted[k]) > 1e-9) out.push(`lasted.${k}: the futures give ${(n - fails) / n}, the answer ${answer.lasted[k]}`);
  }
  return out;
}

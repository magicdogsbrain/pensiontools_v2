/**
 * The Accumulation planner's projection table and its "Am I on course?" answer, as HTML (moved out of index.html's
 * recalcAccumulation and runOnTrackCheck in 6.22.0, so the shell's script shrinks while the table gains a line).
 *
 * The table: the pension at the FCA's three rates (and "your mix" when holdings are tagged), and — new in 6.22.0 — the
 * ISA and savings, with what goes into them each month ("Into ISAs and savings"), grown as the plan says
 * (services/IsaGrowth.js): "Mostly cash" at the cash rule, "Invested like my pension" at the middle rate; a plan locked
 * before the choice as the Timing block projects it (the middle rate, nothing paid in); an ISA of ISA funds in the list of
 * funds to test at the middle rate too, with what goes in (PlanTiming.isaProjectionOf). The ISA line is the same rule the
 * Timing block's pots at retirement use (PlanTiming.projectedIsaRows), so the two agree.
 *
 * Pure: figures in, HTML out (figures only — no text the person typed).
 */
import { accumulationChargesNoteHtml } from './chargesSetting.js';
import { accumulationIsaNote } from './isaGrowthSetting.js';
import { isaGrowthOf } from '../services/IsaGrowth.js';
import { projectedIsaRows, isaProjectionOf } from '../services/PlanTiming.js';
import { onCourseVerdictHtml } from '../services/OnCourse.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/**
 * The ISA and savings line for the planner's years: one row a year, today's money (`potMid`), or null when the plan has
 * no ISA and nothing goes into one.
 * @param {object} stress   the plan's Stress settings (isaBalance, isaGrowth, chargesPct)
 * @param {object} inputs   the planner's inputs (currentAge, retirementAge, isaMonthly, escalationPct)
 */
export function isaLineRows(stress, inputs) {
  const a = inputs || {};
  const years = Math.max(0, Math.round((+a.retirementAge || 0) - (+a.currentAge || 0)));
  const isaToday = Math.max(0, +(stress && stress.isaBalance) || 0);
  if (!(isaToday > 0) && !(isaProjectionOf(stress).payIns && (+a.isaMonthly || 0) > 0)) return null;   // nothing today and nothing paid in
  return projectedIsaRows(stress || {}, a, years, isaToday);
}

/**
 * The projection table.
 * @param {{ rows: Array, mixOn: boolean, mixRealReturn: number|null, chargesPct: number, stress: object, inputs: object }} o
 */
export function accumulationTableHtml({ rows, mixOn = false, mixRealReturn = null, chargesPct = 0, stress = {}, inputs = {} }) {
  const isa = isaLineRows(stress, inputs);
  let html = '<table><thead><tr><th>Age</th><th>Cautious (2%)</th><th>Middle (5%)</th>'
    + (mixOn ? '<th>Your mix <span class="hint" title="Your holdings\' expected real return after costs, at long-run assumptions">(' + ((mixRealReturn + 0.025) * 100).toFixed(1) + '%)</span></th>' : '')
    + '<th>Strong (8%)</th><th>Paid in</th>' + (isa ? '<th>ISA and savings</th>' : '') + '</tr></thead><tbody>';
  const step = rows.length > 12 ? 5 : 1;
  for (let i = 0; i < rows.length; i += (i === 0 || i >= rows.length - step ? 1 : step)) {
    const r = rows[i];
    const ir = isa ? isa[Math.min(isa.length - 1, i)] : null;
    html += '<tr' + (i === rows.length - 1 ? ' style="font-weight:600;"' : '') + '><td>' + r.age + '</td><td>' + gbp(r.potLow) + '</td><td>' + gbp(r.potMid) + '</td>'
      + (mixOn ? '<td>' + gbp(r.potMix || 0) + '</td>' : '') + '<td>' + gbp(r.potHigh) + '</td><td>' + gbp(r.contributedToDate) + '</td>'
      + (isa ? '<td>' + gbp(ir ? ir.potMid : 0) + '</td>' : '') + '</tr>';
  }
  html += '</tbody></table>' + accumulationChargesNoteHtml(chargesPct, mixOn);
  const how = isa ? isaProjectionOf(stress) : null;
  if (isa) html += '<p class="hint" style="margin:6px 0 0;">' + accumulationIsaNote(how.fromFunds && how.payIns ? 'funds' : isaGrowthOf(stress), how.payIns ? +inputs.isaMonthly || 0 : 0) + ' "Paid in" is the pension only.</p>';
  return html;
}

/**
 * "Am I on course?": the pot the plan needs at retirement (it lasts in 9 futures out of 10 — services/OnCourse.js), and
 * the pension at each of the three rates against it.
 * @param {{ requiredPot: number, basis: string (HTML), rows: Array }} o
 */
export function onCourseCheckHtml({ requiredPot, basis, rows }) {
  const last = rows[rows.length - 1];
  return '<div class="alert alert-info">Your plan needs about <strong>' + gbp(requiredPot) + '</strong> at retirement (today\'s money) ' + basis + '.</div>'
    + '<table><tbody>'
    + '<tr><td>Cautious growth (2%)</td><td>' + gbp(last.potLow) + '</td><td>' + onCourseVerdictHtml(last.potLow, requiredPot) + '</td></tr>'
    + '<tr><td>Middle growth (5%)</td><td>' + gbp(last.potMid) + '</td><td>' + onCourseVerdictHtml(last.potMid, requiredPot) + '</td></tr>'
    + '<tr><td>Strong growth (8%)</td><td>' + gbp(last.potHigh) + '</td><td>' + onCourseVerdictHtml(last.potHigh, requiredPot) + '</td></tr>'
    + '</tbody></table>'
    + '<p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Uses your current Stress-Tester settings (target, allocation, State Pension, access method) with the pot scaled. Set your budget and stress settings first for a meaningful answer.</p>';
}

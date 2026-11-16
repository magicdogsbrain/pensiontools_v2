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
 * The page's limit on what goes in once money has been taken from a pension flexibly (services/FlexibleAccess.js mpaaOf,
 * re-exported here for the page's one import of this module): the person's own fact carried from a plan they drew on and
 * closed, else the plan's own records, as before.
 *
 * Pure: figures in, HTML out (figures only — no text the person typed).
 */
import { accumulationChargesNoteHtml } from './chargesSetting.js';
import { accumulationIsaNote } from './isaGrowthSetting.js';
import { isaGrowthOf } from '../services/IsaGrowth.js';
import { projectedIsaRows, isaProjectionOf } from '../services/PlanTiming.js';

import { saverFacts } from '../services/SaverFacts.js';
import { budgetAgeToday, budgetRetirementAge } from '../services/BudgetModel.js';
import { safeSettings } from '../answers/plan/about.js';
import { potLineOf } from '../answers/plan/saving.js';
import { SAVING } from '../v7/copy/saving.js';

export { mpaaOf } from '../services/FlexibleAccess.js';

const fillWords = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));

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
 * The Accumulation tab's boxes as it opens (7.12.0): the saver's facts (services/SaverFacts.js), so the tab says the same
 * age and pot today as "What you pay in" — the age rolled forward from the Timing block, the pot as read (the newest
 * record, What you hold, the pot saved, the plan's own pension total) — and the line under the pot box that says where the
 * pot comes from. With no ages in the plan, the tab's own, else the Budget's. `values` maps each box's id to its figure
 * (null leaves the box empty).
 * @param {object} scenario  the plan (upgraded)
 * @param {object|null} settings  its Stress settings as read (PlanReading.effectiveStressSettings); read here when null
 * @param {Date} now
 * @returns {{ values: object, potLine: string }}
 */
export function accumulationBoxes(scenario, settings = null, now = new Date()) {
  const ss = settings || safeSettings(scenario, now);
  const acc = (scenario && scenario.accumulationTool && scenario.accumulationTool.settings) || {};
  const budget = (scenario && scenario.budgetTool && scenario.budgetTool.settings) || null;
  const f = saverFacts(scenario, ss, { now });
  const n = (v) => (v == null || v === '' || !Number.isFinite(+v) || +v === 0 ? null : +v);
  const values = {
    acAge: f.age ?? n(acc.currentAge) ?? budgetAgeToday(budget),
    acRetireAge: f.stopAge ?? n(acc.retirementAge) ?? budgetRetirementAge(budget),
    acSalary: n(acc.salary), acPotNow: f.pot.from !== 'none' && f.pot.pension > 0 ? f.pot.pension : null,
    acNetMonthly: n(acc.netMonthly), acScheme: acc.schemeType || null, acEmployerMonthly: n(acc.employerMonthly),
    acEscalation: n(acc.escalationPct), acIsaMonthly: n(acc.isaMonthly)
  };
  const line = potLineOf(f.pot);
  return { values, potLine: fillWords(SAVING.pot.potNow[line.id] || '', line.slots) };
}


/**
 * The Accumulation planner's projection table and its "Am I on course?" answer, as HTML (moved out of index.html's
 * recalcAccumulation and runOnTrackCheck in 6.22.0, so the shell's script shrinks while the table gains a line).
 *
 * The table (step F1): the one pot at the stop both views draw — the saving lives every test uses (src/reading/atStop.js),
 * the middle with its bad and good cases, year by year, the ISA and savings beside it.
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
import { isaProjectionOf } from '../services/PlanTiming.js';
import { markFact } from '../reading/mark.js';
import { money, moneyK } from '../reading/format.js';

import { saverFacts } from '../services/SaverFacts.js';
import { budgetAgeToday, budgetRetirementAge } from '../services/BudgetModel.js';
import { safeSettings } from '../answers/plan/about.js';
import { potLineOf } from '../answers/plan/saving.js';
import { SAVING } from '../v7/copy/saving.js';

export { mpaaOf } from '../services/FlexibleAccess.js';

const fillWords = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));

/**
 * What the pot could be by the stop (step F1, lead4.md D4): the one model both views draw — the reading's pot at the stop
 * (src/reading/atStop.js potAtStop: the saving lives every test uses), its middle with the bad and good cases, then year by
 * year, in the simple view's words (src/v7/copy/saving.js) and the one formatter. The regulator's fixed 2/5/8% table is gone.
 * @param {object|null} band  potAtStop(plan, ctx)
 * @param {{ chargesPct: number, stress: object, isaMonthly: number }} o
 */
export function accumulationBandHtml(band, { chargesPct = 0, stress = {}, isaMonthly = 0 } = {}) {
  const P = SAVING.pot;
  if (!band) return '';
  const head = band.source === 'locked'
    ? fillWords(P.atStopLocked, { value: markFact('pot.atStop', moneyK(band.middle)), age: String(band.age) })
    : fillWords(P.atStop, { value: markFact('pot.atStop', moneyK(band.middle)), low: markFact('pot.atStop.low', moneyK(band.low)), high: markFact('pot.atStop.high', moneyK(band.high)), age: String(band.age) });
  let html = '<p class="hint" style="margin:0 0 6px;">' + P.lead + '</p><p style="margin:0 0 6px;">' + head + '</p>';
  const rows = Array.isArray(band.rows) ? band.rows : [];
  if (!rows.length) return html;
  const isa = rows.some((r) => r.isa > 0);
  const C = P.columns;
  html += '<table><thead><tr><th>' + C.age + '</th><th>' + C.low + '</th><th>' + C.mid + '</th><th>' + C.high + '</th><th>' + C.paidIn + '</th>' + (isa ? '<th>' + C.isa + '</th>' : '') + '</tr></thead><tbody>';
  const step = rows.length > 12 ? 5 : 1;
  for (let i = 0; i < rows.length; i += (i === 0 || i >= rows.length - step ? 1 : step)) {
    const r = rows[i];
    html += '<tr' + (i === rows.length - 1 ? ' style="font-weight:600;"' : '') + '><td>' + r.age + '</td><td>' + moneyK(r.low) + '</td><td>' + moneyK(r.middle) + '</td><td>' + moneyK(r.high) + '</td><td>' + money(r.paidIn) + '</td>'
      + (isa ? '<td>' + moneyK(r.isa) + '</td>' : '') + '</tr>';
  }
  html += '</tbody></table>' + accumulationChargesNoteHtml(chargesPct, false);
  const how = isa ? isaProjectionOf(stress) : null;
  if (isa) html += '<p class="hint" style="margin:6px 0 0;">' + accumulationIsaNote(how.fromFunds && how.payIns ? 'funds' : isaGrowthOf(stress), how.payIns ? +isaMonthly || 0 : 0) + ' "Paid in" is the pension only.</p>';
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
  // the line as HTML, its pension today marked as the simple view marks it (step F1; src/v7/components/facts.js saving.potNow)
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const slots = Object.fromEntries(Object.entries(line.slots || {}).map(([k, v]) => [k, k === 'value' ? markFact('pot.today', esc(v)) : esc(v)]));
  return { values, potLine: fillWords(esc(SAVING.pot.potNow[line.id] || ''), slots) };
}


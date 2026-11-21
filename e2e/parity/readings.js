/**
 * The reading's own value of a fact, formatted as the page should show it (lead4.md G3 (c)): held against every place
 * that shows the fact. One entry per fact the shared reading layer (src/reading/) gives today; each later step that moves a
 * figure onto the reading adds its fact here. Step F1: the money today, the pot at the stop with its bad and good cases, the
 * age today, the time to go, the stage, through the one formatter (src/reading/format.js).
 */
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { pensionToday, isaToday } from '../../src/reading/money.js';
import { potAtStop } from '../../src/reading/atStop.js';
import { ageToday, yearsToGo, stage, planName } from '../../src/reading/timing.js';
import { formatFact } from '../../src/reading/format.js';
import { incomeStepsOf } from '../../src/reading/income.js';
import { statePensionOf } from '../../src/reading/statePension.js';
import { thisTaxYearOf } from '../../src/reading/thisYear.js';

/** [{ fact, want }] for a plan on the day both views run on. */
export function readingsFor(raw, { now }) {
  const out = [];
  const put = (fact, value) => { if (value != null && value !== '') out.push({ fact, want: formatFact(fact, value) }); };
  const name = planName(raw, { now });
  if (typeof name === 'string' && name) out.push({ fact: 'plan.name', want: name });
  let plan = raw;
  try { plan = upgradeScenario(JSON.parse(JSON.stringify(raw)), { now }).scenario; } catch { plan = raw; }
  const ctx = { now };
  put('pot.today', pensionToday(plan, ctx).value);
  // step F5 (R4): the month of the record, check-in or list the pension today is from, where the words say it
  { const t = pensionToday(plan, ctx); if (['record', 'checkIn', 'holdings'].includes(t.from) && t.asOf) put('pot.today.asOf', String(t.asOf).slice(0, 7)); }
  put('isa.today', isaToday(plan, ctx).value);
  const a = potAtStop(plan, ctx);
  if (a) { put('pot.atStop', a.middle); put('pot.atStop.low', a.low); put('pot.atStop.high', a.high); }
  put('age.today', ageToday(plan, ctx));
  put('yearsToGo', yearsToGo(plan, ctx));
  put('stage', stage(plan, ctx));
  // step F2: each income step's two figures, and the State Pension's start (the person's own day)
  try { incomeStepsOf(plan, ctx).steps.forEach((st, i) => { put('income.step.' + i + '.beforeTax', st.beforeTax); put('income.step.' + i + '.monthAfterTax', st.monthAfterTax); }); } catch { /* no steps */ }
  try { const sp = statePensionOf(plan, ctx); if (sp.startWords) put('statePension.start', sp.startWords); } catch { /* none */ }
  // step F2 (D7): this tax year as set up, and the plan's own figure for it where the two differ (the only place it is said)
  try {
    const t = thisTaxYearOf(plan, ctx);
    if (t.setUp && t.setUp.perYear != null) put('income.thisYear.beforeTax', t.setUp.perYear);
    if (t.setUp) { put('income.thisYear.from', t.setUp.from); put('income.thisYear.perMonth', Math.round(t.setUp.perMonth)); if (!(t.setUp.from.slice(5) === '04' && t.setUp.payments === 12)) put('income.thisYear.total', t.setUp.total); }
    if (t.differs && t.planSays) put('income.thisYear.planSays', t.planSays.perYear);
    if (t.setUp && t.setUp.on) put('income.thisYear.setUpOn', t.setUp.on);   // step F5 (R4): the set-up's day
  } catch { /* not set up */ }
  return out;
}

/**
 * Step F2 (lead4.md D7): this tax year, ONE reader (src/reading/thisYear.js) — the year as set up (a dated record), the plan's
 * own figure for the year now, and the payments left; one sentence when the two differ. Hand-worked part-year figures.
 */
import { describe, it, expect } from 'vitest';
import { thisTaxYearOf, thisYearSentences, setUpAgainConfig } from '../../src/reading/thisYear.js';
import { sentenceText } from '../../src/services/YearPlan.js';
import { FIXTURES } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';

const NOW = new Date(2026, 10, 16, 12);   // 16 November 2026: tax year 2026/27
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;

/** A plan set up part-way through 2026/27, from September: £1,800 a month from the pension, £200 other income. */
function partYear({ history = [], planSaid } = {}) {
  return {
    id: 'AlexPartYear',
    decisionTool: {
      settings: { locked: true },
      history,
      taxYears: {
        '26/27': {
          yearSetupComplete: true, startMonth: 9, remainingMonths: 7, confirmedSalary: 24000, pa: 12570, brl: 50270, hrl: 125140,
          other: 2400, statePension: 0, cpi: 0.03, setUpOn: '2026-09-10', ...(planSaid != null ? { planSaid } : {}),
          expectedMonthly: { sipp: { gross: 1800 }, other: { gross: 200 }, statePension: { gross: 0 } }
        }
      }
    }
  };
}

describe('this tax year, by hand', () => {
  it('set up from September: 7 payments of £2,000 a month before tax, £14,000 in the year', () => {
    const t = thisTaxYearOf(partYear(), { now: NOW });
    expect(t.key).toBe('26/27');
    expect(t.year).toBe('2026/27');
    expect(t.setUp).toMatchObject({ on: '2026-09-10', from: '2026-09', payments: 7, perMonth: 2000, total: 14000, stored: 24000 });
    // 16 November, nothing recorded: November to March, 5 payments left
    expect(t.paymentsLeft).toBe(5);
    const [s] = thisYearSentences(t);
    expect(s.id).toBe('where.yearPlan');
    expect(sentenceText(s)).toBe('In 2026/27 your plan takes £2,000 a month before tax, from September 2026: 7 payments, £14,000.');
  });
  it('a recorded month is not left to pay; its own figure is what the year takes a month', () => {
    const history = [{ date: '2026-11-05', taxYear: '26/27', sipp: 1900, stdSipp: 1900, other: 200, state: 0 }];
    const t = thisTaxYearOf(partYear({ history }), { now: NOW });
    expect(t.paymentsLeft).toBe(4);   // December to March
    expect(t.setUp.perMonth).toBe(2100);
    expect(t.setUp.total).toBe(14700);
  });
  it('a year set up in April says the month and nothing more', () => {
    const p = partYear();
    Object.assign(p.decisionTool.taxYears['26/27'], { startMonth: 4, remainingMonths: 12 });
    const t = thisTaxYearOf(p, { now: NOW });
    expect(t.setUp.payments).toBe(12);
    expect(sentenceText(thisYearSentences(t)[0])).toBe('In 2026/27 your plan takes £2,000 a month before tax.');
  });
  it('a year not set up says nothing', () => {
    const p = partYear();
    p.decisionTool.taxYears['26/27'].yearSetupComplete = false;
    const t = thisTaxYearOf(p, { now: NOW });
    expect(t.setUp).toBeNull();
    expect(thisYearSentences(t)).toEqual([]);
  });
  it('"Set this year up again" opens the set-up and keeps everything else', () => {
    const cfg = partYear().decisionTool.taxYears['26/27'];
    const again = setUpAgainConfig(cfg);
    expect(again.yearSetupComplete).toBe(false);
    expect(again.confirmedSalary).toBe(24000);
    expect(again.setUpOn).toBe('2026-09-10');
  });
});

describe('the plan changed after the year was set up: one line, both figures, nothing rewritten', () => {
  const f = FIXTURES.find((x) => x.key === 'retired-locked-pots');
  const plan = up(f.plans().find((p) => p.id === f.subject));

  it('as set up, the plan and the year agree: no line', () => {
    const t = thisTaxYearOf(plan, { now: NOW });
    expect(t.setUp.on).toBe('2026-09-10');
    expect(t.setUp.from).toBe('2026-09');
    expect(t.planSays.stored).toBe(t.setUp.stored);
    expect(t.differs).toBe(false);
    expect(thisYearSentences(t).map((s) => s.id)).toEqual(['where.yearPlan']);
  });

  it('an older set-up (no figure kept of what the plan said then) made when a first year was grown by a year of prices: no line', () => {
    // the set-up rule before 7.12.0 grew a plan's first year by the year's prices (cpi) before it had passed; a set-up kept
    // from then holds that grown figure, and with nothing else kept it is read as the plan as it was, not as a change
    const t0 = thisTaxYearOf(plan, { now: NOW });
    const grown = JSON.parse(JSON.stringify(plan));
    const cfg = grown.decisionTool.taxYears['26/27'];
    delete cfg.planSaid;   // made before the set-up kept it
    cfg.confirmedSalary = Math.round(t0.planSays.stored * (1 + (+cfg.cpi || 0.04)));
    const t = thisTaxYearOf(grown, { now: NOW });
    expect(t.setUp.stored).toBe(cfg.confirmedSalary);
    expect(t.planSays.stored).toBe(t0.planSays.stored);
    expect(t.differs).toBe(false);
    // set up at any other figure, it is a change and said so
    cfg.confirmedSalary = Math.round(t0.planSays.stored * 1.2);
    expect(thisTaxYearOf(grown, { now: NOW }).differs).toBe(true);
  });

  it('a raise in spending after the set-up: the plan\'s new figure and the year as set up, with its date', () => {
    const raised = JSON.parse(JSON.stringify(plan));
    const ss = raised.stressTool.settings;
    const bump = (v) => Math.round(+v * 1.2);
    if (Array.isArray(ss.incomeSteps)) ss.incomeSteps = ss.incomeSteps.map((s) => ({ ...s, amount: bump(s.amount) }));
    if (Array.isArray(ss.targetSchedule)) ss.targetSchedule = ss.targetSchedule.map(bump);
    if (ss.baseSalary) ss.baseSalary = bump(ss.baseSalary);
    const t = thisTaxYearOf(raised, { now: NOW });
    expect(t.differs).toBe(true);
    expect(t.planSays.stored).toBeGreaterThan(t.setUp.stored);
    // the set-up is a record: unchanged by the raise
    expect(t.setUp).toEqual(thisTaxYearOf(plan, { now: NOW }).setUp);
    const changed = thisYearSentences(t).find((s) => s.id === 'where.yearChanged');
    const text = sentenceText(changed);
    expect(text).toContain('This tax year was set up on 10 September 2026 at ');
    expect(text).toContain('£' + t.planSays.perYear.toLocaleString('en-GB') + ' a year before tax');
    expect(text).toContain('until you set this year up again');
  });
});

describe('both views say it the same way, and one write opens the set-up again', async () => {
  const { yearChangedHtml, yearPlanHtml, yearIncomeHtml } = await import('../../src/ui/thisYearHtml.js');
  const { setUpAgainPatch } = await import('../../src/answers/plan/month.js');
  const { unmarked } = await import('../../src/reading/mark.js');
  const f = FIXTURES.find((x) => x.key === 'retired-locked-pots');
  const plan = up(f.plans().find((p) => p.id === f.subject));

  it('the full view draws the simple view\'s sentence, its figure marked', () => {
    const t = thisTaxYearOf(plan, { now: NOW });
    const html = yearPlanHtml(t);
    expect(unmarked(html)).toBe(sentenceText(thisYearSentences(t)[0]));
    expect(yearIncomeHtml(t)).toContain('data-fact="income.thisYear.beforeTax"');
    expect(yearChangedHtml(t, { button: 'x()' })).toBe('');   // they agree: no line
  });
  it('"Set this year up again" writes the tax years only, the year opened again', () => {
    const p = setUpAgainPatch(plan, { today: '2026-11-16' });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['decisionTool.taxYears']);
    const after = p.patch['decisionTool.taxYears']['26/27'];
    expect(after.yearSetupComplete).toBe(false);
    expect(after.confirmedSalary).toBe(plan.decisionTool.taxYears['26/27'].confirmedSalary);
    expect(setUpAgainPatch({ ...plan, decisionTool: { ...plan.decisionTool, settings: { ...plan.decisionTool.settings, locked: false } } }, { today: '2026-11-16' }).problem).toBe('notLocked');
  });
});

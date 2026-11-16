/**
 * A saver's plan read by real people's questions (7.12.0). Fictional people only, made here from fictional answers:
 *   - Sam, 44 when the plan was kept on 12 November 2025: £120,000 in a pension, £375 a month going in with the tax added
 *     back and £250 from the employer, stopping at 67;
 *   - Alex, a plan made in the full view: a pension total of £410,000 in the plan's own pots, nothing on the saving page;
 *   - Jo, 33: no pension yet, £300 a month going in.
 * Every figure expected is worked out by hand in the test.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { savingOf, savingPatch, applyPatch } from '../../../src/answers/plan/saving.js';
import { accumulationBoxes } from '../../../src/ui/accumulationProjection.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { noon } from './_plans.js';

const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const READ_ON = '2026-11-16';

/** A B answer kept as a plan on `on`, brought up to date as the plan source reads it on `readOn`. */
function keptPlan(inputs, { on, readOn = on, id = 'Plan01', name = 'A plan' }) {
  const result = answerB(inputs, { today: on, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: on, appVersion: 'test' }, name, createdAt: on + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, on).yours;
  made.id = id;
  return upgradeScenario(copy(made), { now: noon(readOn) }).scenario;
}

const samInputs = () => ({ household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } },
  stop: { age: 67 }, spend: { kind: 'amount', amount: 2200 }, endAge: 95 });
const SAM_RECORD = { date: '2026-11', sipp: 131000, isa: null, gia: 0, total: 131000, recordedAt: '2026-11-10T12:00:00.000Z' };
function samPlan() {
  const plan = keptPlan(samInputs(), { on: '2025-11-12', readOn: READ_ON, id: 'Sam01', name: 'Sam saving' });
  plan.accumulationTool.history = [copy(SAM_RECORD)];
  return plan;
}
const entry = (plan) => ({ plan, newer: false, failed: false });

describe('step 1: one reader of a saver\'s facts', () => {
  it('Sam, a year after keeping: the ages roll forward and the pot is the one recorded, on every line of the page', () => {
    const plan = samPlan();
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    // kept at 44 a year ago: 44 + 1 = 45 today; stopping at 67: 67 − 45 = 22 years
    expect(v.ages.currentAge).toBe(45);
    expect(v.ages.retirementAge).toBe(67);
    const ages = fill(W.ages[v.ages.line.id], v.ages.line.slots);
    expect(ages).toMatch(/^You stop work in \w+ \d{4}, at 67: 22 years of saving from age 45\. /);
    expect(fill(W.pot.potNow[v.potNow.line.id], v.potNow.line.slots)).toBe('From your pension of £131,000, recorded November 2026.');
    expect(v.rows[0].age).toBe(45);
    expect(v.rows[0].raw.mid).toBe(131000);
    // the box opens on the same figure
    expect(v.fields.find((f) => f.path === 'potNow').shown).toBe('131000');
    // and the verdict tests the same pot
    expect(saverInputsOf(plan, { today: READ_ON }).inputs.you.pot).toBe(131000);
  }, 30000);

  it('Alex, made in the full view with £410,000 in the plan\'s pots and nothing on the saving page: the pension is £410,000, the plan\'s own total', () => {
    const plan = samPlan();
    delete plan.accumulationTool;
    delete plan.fromAnswer;
    Object.assign(plan.stressTool.settings, { equityMin: 205000, bondMin: 164000, cashTarget: 41000, diversifierStart: 0, configured: true });
    const read = saverInputsOf(plan, { today: READ_ON });
    expect(read.ok).toBe(true);
    // 205,000 + 164,000 + 41,000 = 410,000
    expect(read.inputs.you.pot).toBe(410000);
    expect(read.notes.potFrom).toBe('plan');
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(fill(W.pot.potNow[v.potNow.line.id], v.potNow.line.slots)).toBe('From your pension of £410,000, the pension total in your plan.');
  }, 30000);

  it('Jo, kept with no pension yet and £300 a month going in: the pension today is £0, never the pot at the stop the plan\'s pots hold', () => {
    const jo = { household: 'single', you: { pot: 0, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 300 } },
      stop: { age: 60 }, spend: { kind: 'amount', amount: 1500 }, endAge: 95 };
    const plan = keptPlan(jo, { on: '2025-11-12', readOn: READ_ON, id: 'Jo01' });
    // the plan's pots hold the pot at the stop (more than £0), the answer said £0 today
    expect(plan.stressTool.settings.equityMin + plan.stressTool.settings.bondMin + plan.stressTool.settings.cashTarget).toBeGreaterThan(0);
    expect(saverInputsOf(plan, { today: READ_ON }).inputs.you.pot).toBe(0);
    const old = copy(plan); delete old.accumulationTool;
    expect(saverInputsOf(old, { today: READ_ON }).inputs.you.pot).toBe(0);
  }, 30000);

  it('a new pot today typed on What you pay in is written with this month\'s record in the same write, and read back', () => {
    const plan = samPlan();
    const p = savingPatch(plan, { potNow: '140000' }, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual(['accumulationTool.history', 'accumulationTool.settings']);
    expect(p.patch['accumulationTool.settings'].potNow).toBe(140000);
    const rec = p.patch['accumulationTool.history'].find((r) => r.date === '2026-11');
    expect(rec.sipp).toBe(140000);
    expect(p.patch['accumulationTool.history']).toHaveLength(1);
    const after = applyPatch(plan, p.patch);
    expect(saverInputsOf(after, { today: READ_ON }).inputs.you.pot).toBe(140000);
    // the box left as it opened writes nothing
    expect(savingPatch(plan, {}, { today: READ_ON }).patch).toEqual({});
  }, 30000);

  it('the full view\'s Accumulation tab opens on the same age and pot', () => {
    const plan = samPlan();
    const box = accumulationBoxes(plan, null, noon(READ_ON));
    expect(box.values.acAge).toBe(45);
    expect(box.values.acRetireAge).toBe(67);
    expect(box.values.acPotNow).toBe(131000);
    expect(box.potLine).toBe('From your pension of £131,000, recorded November 2026.');
  }, 30000);
});

/**
 * The full view's Accumulation tab keeps what is typed (7.12.0, lead decision 1; the second walk: a stop age typed as 62
 * moved only the projection table, the answer on the same card still said 60, and nothing was saved). Its boxes are saved
 * as they change through ONE write built by the simple view's own builders, so the boxes ARE what is stored: read back,
 * they show what was typed. Fictional: Jo, 33, earns £38,000, £22,000 in a workplace pension, paying 5% with 3% from the
 * employer, stopping at 60 on £2,000 a month.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { accumulationTabPatch } from '../../../src/answers/plan/accumulationTab.js';
import { accumulationBoxes } from '../../../src/ui/accumulationProjection.js';
import { noon } from './_plans.js';

const READ_ON = '2026-11-16';
const JO = { household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 };

let made = null;
function joPlan() {
  if (!made) {
    const result = answerB(JO, { today: READ_ON, futures: 100, seed: 0, detail: 'answer' });
    const seed = buildPlanSeed({ source: 'b', result, env: { today: READ_ON, appVersion: 'test' }, name: 'Jo', createdAt: READ_ON + 'T10:00:00.000Z' });
    const s = seedToScenario(seed, READ_ON).yours;
    s.id = 'JoAccTab1';
    made = upgradeScenario(JSON.parse(JSON.stringify(s)), { now: noon(READ_ON) }).scenario;
  }
  return JSON.parse(JSON.stringify(made));
}
/** The boxes as the tab shows them (index.html loadAccumulationUI), as text. */
const shown = (plan) => Object.fromEntries(Object.entries(accumulationBoxes(plan, null, noon(READ_ON)).values).map(([k, v]) => [k, v == null ? '' : String(v)]));

describe('the Accumulation tab, saved as typed', () => {
  it('the boxes as they open write nothing', () => {
    const plan = joPlan();
    const r = accumulationTabPatch(plan, shown(plan), { today: READ_ON });
    expect(r.ok).toBe(true);
    expect(r.patch).toEqual({});
  }, 60000);

  it('the age you stop, typed as 62: the plan stops at 62 everywhere, and the box reads 62 back', () => {
    const plan = joPlan();
    expect(shown(plan).acRetireAge).toBe('60');
    const r = accumulationTabPatch(plan, { ...shown(plan), acRetireAge: '62' }, { today: READ_ON });
    expect(r.ok).toBe(true);
    expect(r.patch['stressTool.settings.retireAge']).toBe(62);   // the plan's own stop (the Timing block every screen reads)
    const after = applyPatch(plan, r.patch);
    expect(after.accumulationTool.settings.retirementAge).toBe(62);   // the tab's own copy kept in step
    expect(shown(after).acRetireAge).toBe('62');                      // what the box shows after a reload
    // nothing else moved: the pay-in and the pot as they were
    expect(shown(after).acPotNow).toBe(shown(plan).acPotNow);
    expect(shown(after).acSalary).toBe('38000');
  }, 60000);

  it('the pension today, typed as £30,000: stored, recorded for this month, and read back', () => {
    const plan = joPlan();
    const r = accumulationTabPatch(plan, { ...shown(plan), acPotNow: '30000' }, { today: READ_ON });
    expect(r.ok).toBe(true);
    expect(r.patch['accumulationTool.settings'].potNow).toBe(30000);
    const hist = r.patch['accumulationTool.history'];
    expect(Array.isArray(hist) && hist.some((h) => h.date === '2026-11' && Math.round(h.total) === 30000)).toBe(true);
    expect(shown(applyPatch(plan, r.patch)).acPotNow).toBe('30000');
  }, 60000);

  it('a stop before the age you are now is refused beside its own box, and nothing is written', () => {
    const plan = joPlan();
    const r = accumulationTabPatch(plan, { ...shown(plan), acRetireAge: '30' }, { today: READ_ON });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors)).toEqual(['acRetireAge']);
    expect(r.patch).toEqual({});
  }, 60000);

  it('a pay-in below nothing is refused beside its own box', () => {
    const plan = joPlan();
    const r = accumulationTabPatch(plan, { ...shown(plan), acNetMonthly: '-50' }, { today: READ_ON });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors)).toEqual(['acNetMonthly']);
  }, 60000);
});

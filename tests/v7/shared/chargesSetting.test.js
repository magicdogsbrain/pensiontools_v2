/**
 * The charge as V7 asks it (6.19.0; the owner, 1 Oct 2026: "Yes half a percent. But put it as a config parameter
 * somewhere - like in the various plan settings"; research/charges-setting.md 2d, T12).
 *
 * ONE setting, `charge` (percent a year, 0 to 3 in steps of 0.05, 0.5 unless changed), under "Add more detail" in C, A
 * and B alike. It is the household's `chargesPct` and is taken while saving AND while drawing: the saving years
 * (saving.js) and every drawing run (toEngine.js → the engine config) read the same figure. What was assumed says so in
 * one line, with Change; it travels into a plan made from the answer (the seed's inputs → today's planner).
 *
 * The engine side (the replica is today's engine at every charge, closed forms, more charge never gives more) is
 * tests/v7/shared/charges.test.js; the hand-overs at several charges are tests/v7/cross/handOver.test.js and
 * oneTest.test.js.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkInputs, parseDraft } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { toHousehold as toHouseholdA } from '../../../src/answers/a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { saverInputsOf } from '../../../src/answers/c/onLives.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { savingPlan } from '../../../src/answers/shared/saving.js';
import { handOverToC } from '../../../src/answers/shared/schemaParts.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario, checkSeed } from '../../../src/services/PlanSeed.js';
import { monthlyChargeFactor, DEFAULT_CHARGES_PCT } from '../../../src/services/Charges.js';
import { C as COPY_C } from '../../../src/v7/copy/c.js';
import { A as COPY_A } from '../../../src/v7/copy/a.js';
import { B as COPY_B } from '../../../src/v7/copy/b.js';
import { bannedHits } from '../render/checkScreen.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const SCHEMA = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B };
const TO_HOUSEHOLD = { c: toHouseholdC, a: toHouseholdA, b: toHouseholdB };
const ANSWER = { c: answerC, a: answerA, b: answerB };
const DETAIL = { c: undefined, a: 'chart', b: 'answer' };
/** One household as each question takes it: 50, £250,000, £600 a month going in, £40,000 savings, money from 60. */
const INPUTS = {
  c: { you: { age: 50, pot: 250000, payIn: { has: 'yes', kind: 'total', total: 600 } }, savings: 40000, start: { kind: 'age', age: 60 } },
  a: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1900 } },
  b: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, savings: 40000, stop: { age: 60 }, spend: { kind: 'amount', amount: 1900 } }
};
const LINE = (pct) => `Charges of ${pct}% a year come off the money in funds and cash, while saving and while drawing; not off State Pension or final-salary pension.`;
const checked = (q, extra = {}) => {
  const r = checkInputs(SCHEMA[q], { ...INPUTS[q], ...extra }, ENV);
  expect(r.ok, JSON.stringify(r.errors)).toBe(true);
  return r;
};

describe('one field, the same in C, A and B', () => {
  it.each(['c', 'a', 'b'])('%s: "charge" under more detail, 0 to 3 in steps of 0.05, 0.5 unless changed (listed as a default)', (q) => {
    const f = SCHEMA[q].fields.find((x) => x.path === 'charge');
    expect(f).toEqual(SCHEMA_C.fields.find((x) => x.path === 'charge'));
    expect(f).toMatchObject({ type: 'percent', min: 0, max: 3, step: 0.05, default: DEFAULT_CHARGES_PCT, group: 'more' });
    const r = checked(q);
    expect(r.inputs.charge).toBe(0.5);
    expect(r.usedDefault).toContain('charge');
    expect(checked(q, { charge: 1.35 }).inputs.charge).toBe(1.35);
    expect(checkInputs(SCHEMA[q], { ...INPUTS[q], charge: 0.07 }, ENV).errors).toEqual({ charge: 'notANumber' });
    expect(checkInputs(SCHEMA[q], { ...INPUTS[q], charge: 3.05 }, ENV).errors).toEqual({ charge: 'tooHigh' });
  });

  it.each([['c', COPY_C], ['a', COPY_A], ['b', COPY_B]])('%s: the words — label, help (what is not charged, and why), the percent errors', (q, copy) => {
    const w = copy.fields.charge;
    expect(w.label).toBe('Charges (funds and platform), a year');
    // Review of 6.19.0: "any fee on those" read as a fee on a State Pension or a final-salary pension; they have none.
    expect(w.help).toBe('What your funds and your platform take each year, as a share of what you hold, while you save and while you draw. Not taken off State Pension or final-salary pensions: there is no such charge on those.');
    expect(w.help).not.toMatch(/\bfees?\b/i);
    for (const id of ['required', 'notANumber', 'tooLow', 'tooHigh']) expect(typeof copy.errors.percent[id], `${q} percent ${id}`).toBe('string');
    expect(copy.errors.percent.notANumber).toBe('Type a figure in steps of 0.05, such as 0.5 or 0.45.');
    for (const text of [w.label, w.help, ...Object.values(copy.errors.percent).map((t) => t.replace(/\{(min|max)\}/g, '1%')), LINE('0.5')]) {
      expect(bannedHits(text, ['all', 'first', 'planner', 'retired', 'result', 'saver']), text).toEqual([]);
    }
  });

  it('A\'s and B\'s "C differs" note no longer names the charge (C asks it too)', () => {
    for (const copy of [COPY_A, COPY_B]) expect(copy.answer.toCDiffers).not.toMatch(/charge/i);
  });
});

describe('the household carries the one charge, and both phases read it', () => {
  it.each(['c', 'a', 'b'])('%s: inputs.charge → household.chargesPct, as typed (0.05 stays 0.05)', (q) => {
    for (const charge of [0, 0.05, 0.5, 1.35, 3]) {
      const { household } = TO_HOUSEHOLD[q](checked(q, { charge }).inputs, ENV);
      expect(household.chargesPct, `${q} ${charge}`).toBe(charge);
      if (household.saving) expect('charge' in household.saving, q).toBe(false);
    }
  });

  it.each(['a', 'b'])('%s: the saving years and every drawing run take the same charge', (q) => {
    for (const charge of [0, 0.05, 1.5]) {
      const { household } = TO_HOUSEHOLD[q](checked(q, { charge }).inputs, ENV);
      const plan = savingPlan(household, 60, ENV);
      expect(plan.chargesPct).toBe(charge);
      expect(plan.chargeM).toBe(monthlyChargeFactor(charge));
      const runs = configsAt(enginePlan(household, ENV, { start: 'asGiven' }), 24000);
      expect(runs.length).toBeGreaterThan(0);
      for (const { config } of runs) expect(config.chargesPct, `${q} ${charge}`).toBe(charge);
    }
  });

  it('C from now: every drawing run takes the charge; C later (on the lives) hands it to the saving years as A would', () => {
    for (const charge of [0, 0.05, 1.5]) {
      const now = checkInputs(SCHEMA_C, { you: { age: 62, pot: 300000 }, charge }, ENV).inputs;
      const { household } = toHouseholdC(now, ENV);
      for (const { config } of configsAt(enginePlan(household, ENV), 20000)) expect(config.chargesPct).toBe(charge);
      const later = checked('c', { charge }).inputs;
      expect(saverInputsOf(later).charge).toBe(charge);
      const sh = toHouseholdA(saverInputsOf(later), ENV, 60).household;
      expect(sh.chargesPct).toBe(charge);
      expect(savingPlan(sh, 60, ENV).chargeM).toBe(monthlyChargeFactor(charge));
    }
  });

  it('the answers echo the charge, and A\'s and B\'s saving outcome says it as a share a year', () => {
    for (const charge of [0.05, 1.25]) {
      for (const q of ['c', 'a', 'b']) {
        const r = ANSWER[q]({ ...INPUTS[q], charge }, { ...ENV, detail: DETAIL[q] });
        expect(r.status, q).toBe('ok');
        expect(r.inputs.charge, q).toBe(charge);
        for (const s of r.saving || []) expect(Math.abs(s.chargeAYear - charge / 100), q).toBeLessThan(1e-12);
      }
    }
  });
});

describe('what was assumed: one line, with Change, in all three', () => {
  it.each(['c', 'a', 'b'])('%s: the 0.5% default, then a typed 1.25%', (q) => {
    const def = ANSWER[q](INPUTS[q], { ...ENV, detail: DETAIL[q] });
    const line = def.assumed.find((a) => a.id === 'charges');
    expect(line).toMatchObject({ field: 'charge', source: 'default', value: 0.5, text: LINE('0.5') });
    const ids = def.assumed.map((a) => a.id);
    for (const old of ['charge-saving', 'no-charges']) expect(ids, `${q} ${old}`).not.toContain(old);
    const typed = ANSWER[q]({ ...INPUTS[q], charge: 1.25 }, { ...ENV, detail: DETAIL[q] });
    expect(typed.assumed.find((a) => a.id === 'charges')).toMatchObject({ field: 'charge', source: 'entered', value: 1.25, text: LINE('1.25') });
  });

  it('C from now says it too (the money is drawn on, so it is charged); with nothing to draw on there is no line', () => {
    const now = answerC({ you: { age: 62, pot: 300000 } }, ENV);
    expect(now.assumed.find((a) => a.id === 'charges').text).toBe(LINE('0.5'));
    const none = answerC({ you: { age: 70, pot: 0 } }, ENV);
    expect(none.status).not.toBe('ok');
    expect(none.assumed.map((a) => a.id)).not.toContain('charges');
  });

  it('A stopping now says it too: the charge is taken while drawing', () => {
    const r = answerA({ you: { age: 60, pot: 250000 }, savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1500 }, charge: 0.75 }, { ...ENV, detail: 'chart' });
    expect(r.assumed.find((a) => a.id === 'charges')).toMatchObject({ field: 'charge', source: 'entered', text: LINE('0.75') });
  });
});

describe('the hand-over to C: the charge no longer makes C differ', () => {
  it('handOverToC.same with a charge other than 0.5% (C asks it, and it is carried)', () => {
    const inputs = checked('a', { charge: 1.25 }).inputs;
    expect(handOverToC(inputs, 60, TODAY)).toEqual({ ok: true, same: true });
    expect(handOverToC({ ...inputs, charge: 0 }, 60, TODAY)).toEqual({ ok: true, same: true });
    expect(handOverToC({ ...inputs, savingsIn: 200 }, 60, TODAY)).toEqual({ ok: true, same: false });
  });
});

describe('a plan made from an answer carries its charge (save-as-plan: the seed\'s inputs)', () => {
  const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8')).answers[q].result;
  const seedOf = (q, result) => buildPlanSeed({ source: q, result, env: { today: TODAY, appVersion: '6.18.0' }, name: { chosen: 'My try' }, createdAt: '2026-09-30T14:03:22.511Z' });
  const planCharge = (seed) => {
    expect(checkSeed(seed, Date.parse(seed.createdAt))).toEqual({ ok: true });
    const made = seedToScenario(seed, new Date(2026, 8, 30, 15, 0));
    if (made.partner) expect(made.partner.stressTool.settings.chargesPct).toBe(made.yours.stressTool.settings.chargesPct);
    expect(made.yours.decisionTool.settings).not.toHaveProperty('chargesPct');
    return made.yours.stressTool.settings.chargesPct;
  };

  it.each([['c', 'answer-F1'], ['c', 'answer-paying-in'], ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['b', 'answer-B1'], ['b', 'answer-B5-couple']])('%s %s: the pinned answer\'s charge, 0.5', (q, name) => {
    const r = load(q, name);
    expect(r.inputs.charge).toBe(0.5);
    const seed = seedOf(q, r);
    expect(seed.inputs.charge).toBe(0.5);
    expect(planCharge(seed)).toBe(0.5);
  });

  it.each(['c', 'a', 'b'])('%s: a typed charge (0.05, 1.25) is the plan\'s', (q) => {
    for (const charge of [0.05, 1.25]) {
      const r = ANSWER[q]({ ...INPUTS[q], charge }, { ...ENV, detail: DETAIL[q] });
      const seed = seedOf(q, r);
      expect(seed.inputs.charge).toBe(charge);
      expect(planCharge(seed)).toBe(charge);
    }
  });
});

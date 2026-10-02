/**
 * How ISAs and savings grow, as V7 asks it (6.22.0; the owner, 2 Oct 2026: savings growth "Mostly cash" (default) or
 * "Invested like my pension" in both apps; research/saver-lock-and-savings-growth.md 3.6, tests 6 and 12).
 *
 * ONE choice, `isaGrowth` — 'cash' ("Mostly cash": last year's rise in prices less 1%, never below nothing, as the
 * pension's own cash grows) or 'invested' ("Invested like my pension": the pension's mix, in the same futures) — in C, A
 * and B alike, straight under the savings box (A: on the first form; B and C: under "Add more detail"). It is asked, and
 * defaulted to "Mostly cash", only once there is money in savings (the savings box above £0, or — A and B — money going
 * into savings each month): a household with no savings has today's checked inputs, key for key, and today's answer.
 * It is the household's `isaGrowth`, read by the saving years (saving.js) and every drawing run (toEngine.js); what was
 * assumed says so in one line, with Change; it is carried C ↔ A ↔ B and travels into a plan made from the answer.
 *
 * The engine side (the replica is today's engine at each choice; closed forms; the saving-years kernels) is
 * tests/v7/shared/isaGrowth.test.js.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

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
import { expandHousehold, validateHousehold } from '../../../src/answers/shared/household.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { savingPlan } from '../../../src/answers/shared/saving.js';
import { handOverToC, isaGrowthField, savingsGrowthAsked, savingsGrowthDefault } from '../../../src/answers/shared/schemaParts.js';
import { RULES } from '../../../src/answers/shared/rules.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { checkSeed, seedToScenario } from '../../../src/services/PlanSeed.js';
import { DEFAULT_ISA_GROWTH, ISA_GROWTH_VALUES } from '../../../src/services/IsaGrowth.js';
import { C as COPY_C } from '../../../src/v7/copy/c.js';
import { A as COPY_A } from '../../../src/v7/copy/a.js';
import { B as COPY_B } from '../../../src/v7/copy/b.js';
import { LAYOUT_A } from '../../../src/v7/screens/a/NumbersScreen.jsx';
import { LAYOUT_B } from '../../../src/v7/screens/b/NumbersScreen.jsx';
import { CARRY } from '../../../src/v7/state/carry.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { choiceAsked, offeredOptions } from '../../../src/v7/state/select.js';
import { bannedHits, checkScreen, draw } from '../render/checkScreen.js';
import fc from 'fast-check';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { checkAnswer as checkC } from '../c/invariants.js';
import { checkAnswerA, payInsFit } from '../a/invariants.js';
import { checkAnswerB, withinCeiling, asksB } from '../b/invariants.js';
import { fresh, run, set, at, typedA, typedB, typedC } from '../shell/_open.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const SCHEMA = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B };
const TO_HOUSEHOLD = { c: toHouseholdC, a: toHouseholdA, b: toHouseholdB };
const ANSWER = { c: answerC, a: answerA, b: answerB };
const DETAIL = { c: undefined, a: 'chart', b: 'answer' };
const COPY = { c: COPY_C, a: COPY_A, b: COPY_B };
/** One household as each question takes it: 50, £250,000, £600 a month going in, £40,000 savings, money from 60. */
const INPUTS = {
  c: { you: { age: 50, pot: 250000, payIn: { has: 'yes', kind: 'total', total: 600 } }, savings: 40000, start: { kind: 'age', age: 60 } },
  a: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1900 } },
  b: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, savings: 40000, stop: { age: 60 }, spend: { kind: 'amount', amount: 1900 } }
};
const without = (o, key) => { const { [key]: gone, ...rest } = o; void gone; return rest; };
const checked = (q, inputs) => {
  const r = checkInputs(SCHEMA[q], inputs, ENV);
  expect(r.ok, JSON.stringify(r.errors)).toBe(true);
  return r;
};
/** The words of the line under what was assumed (the same in C, A and B). */
const LINE = {
  cash: 'Your savings are treated as ISA money: tax-free to take. They grow like cash: by last year\'s rise in prices less 1%, or not at all if prices rose by less than 1%.',
  invested: 'Your savings are treated as ISA money: tax-free to take. They are invested like your pension: the same mix of shares, bonds and cash, in the same futures.'
};
const MOSTLY_CASH = 'Most of the money when you stop is in savings, treated as mostly cash, which grows a little more slowly than prices rise. If yours are invested, choose "Invested like my pension" under the savings box.';
const allWords = (r) => [...Object.values(r.sentences || {}).map((s) => s && s.text), ...(r.assumed || []).map((a) => a.text), ...(r.warnings || []).map((w) => w.text)].filter(Boolean);

describe('one choice, the same in C, A and B, straight after the savings box', () => {
  it.each([['c', 'more'], ['a', 'you'], ['b', 'more']])('%s: "isaGrowth", "Mostly cash" or "Invested like my pension", in the savings box\'s group (%s)', (q, group) => {
    const f = SCHEMA[q].fields.find((x) => x.path === 'isaGrowth');
    expect(f).toEqual(isaGrowthField(group));
    expect(f).toEqual({ path: 'isaGrowth', type: 'choice', options: ['cash', 'invested'], default: { rule: 'isaGrowth' }, group });
    expect(f.options).toEqual([...ISA_GROWTH_VALUES]);
    expect(SCHEMA[q].fields.find((x) => x.path === 'savings').group).toBe(group);
    expect(SCHEMA[q].defaultRules.isaGrowth).toBe(savingsGrowthDefault);
    // declared after every box its default reads (the checks walk the list in order)
    const paths = SCHEMA[q].fields.map((x) => x.path);
    for (const p of ['savings', ...(q === 'c' ? [] : ['savingsIn'])]) expect(paths.indexOf('isaGrowth'), p).toBeGreaterThan(paths.indexOf(p));
  });

  it('drawn straight under the savings box: A on the first form, B under more detail (C: its numbers screen, in the same place)', () => {
    expect(LAYOUT_A.you.indexOf('isaGrowth')).toBe(LAYOUT_A.you.indexOf('savings') + 1);
    expect(LAYOUT_B.more.indexOf('isaGrowth')).toBe(LAYOUT_B.more.indexOf('savings') + 1);
    const c = readFileSync(join(process.cwd(), 'src/v7/screens/c/NumbersScreen.jsx'), 'utf8');
    expect(c).toMatch(/path="savings"[^\n]*\/>\s*\n\s*<FieldGroup form=\{form\} path="isaGrowth"/);
  });

  it('the default: "Mostly cash" once there is money in savings (RULES.isaGrowthDefault, today\'s planner\'s default); none without', () => {
    expect(RULES.isaGrowthDefault).toBe(DEFAULT_ISA_GROWTH);
    expect(savingsGrowthDefault({ savings: 1 })).toBe('cash');
    expect(savingsGrowthDefault({ savings: 0, savingsIn: 300 })).toBe('cash');
    expect(savingsGrowthDefault({ savings: 0, savingsIn: 0 })).toBeUndefined();
    expect(savingsGrowthDefault({})).toBeUndefined();
    expect(savingsGrowthAsked({ savings: '40,000' })).toBe(false);          // a number, as checked: never text as typed
  });

  it.each(['c', 'a', 'b'])('%s: with savings it is "Mostly cash" unless chosen (listed as a default); a choice is kept; anything else is refused', (q) => {
    const r = checked(q, INPUTS[q]);
    expect(r.inputs.isaGrowth).toBe('cash');
    expect(r.usedDefault).toContain('isaGrowth');
    const inv = checked(q, { ...INPUTS[q], isaGrowth: 'invested' });
    expect(inv.inputs.isaGrowth).toBe('invested');
    expect(inv.usedDefault).not.toContain('isaGrowth');
    for (const bad of ['Cash', 'shares', 0.03, true]) expect(checkInputs(SCHEMA[q], { ...INPUTS[q], isaGrowth: bad }, ENV).errors, String(bad)).toEqual({ isaGrowth: 'notAnOption' });
    // as typed on the form
    const draft = { 'you.age': '50', 'you.pot': '250,000', savings: '40,000' };
    expect(parseDraft(SCHEMA[q], draft, ENV).values.isaGrowth).toBe('cash');
    expect(parseDraft(SCHEMA[q], { ...draft, isaGrowth: 'invested' }, ENV).values.isaGrowth).toBe('invested');
  });

  it.each(['c', 'a', 'b'])('%s: with nothing in savings the checked inputs are today\'s, key for key — no "isaGrowth"', (q) => {
    const r = checked(q, { ...INPUTS[q], savings: 0 });
    expect('isaGrowth' in r.inputs).toBe(false);
    expect(r.usedDefault).not.toContain('isaGrowth');
    expect('isaGrowth' in checked(q, without(INPUTS[q], 'savings')).inputs).toBe(false);
  });

  it.each(['a', 'b'])('%s: money going into savings each month is money in savings too ("Mostly cash" with £0 saved and £300 a month)', (q) => {
    expect(checked(q, { ...INPUTS[q], savings: 0, savingsIn: 300 }).inputs.isaGrowth).toBe('cash');
  });

  it.each(['c', 'a', 'b'])('%s: the words — label, the two options and what each means; nothing on the banned list', (q) => {
    const w = COPY[q].fields.isaGrowth;
    expect(w).toEqual(COPY_C.fields.isaGrowth);
    expect(w.label).toBe('How your savings grow');
    expect(w.options).toEqual({ cash: 'Mostly cash', invested: 'Invested like my pension' });
    expect(w.optionHelp).toEqual({ cash: 'they grow by about last year\'s rise in prices, less 1%', invested: 'the same mix as your pension, in the same futures' });
    for (const text of [w.label, ...Object.values(w.options), ...Object.values(w.optionHelp), LINE.cash, LINE.invested, MOSTLY_CASH]) {
      expect(bannedHits(text, ['all', 'first', 'planner', 'retired', 'result', 'saver']), text).toEqual([]);
    }
  });
});

describe('the household carries the choice, and both phases read it', () => {
  it.each(['c', 'a', 'b'])('%s: inputs.isaGrowth → household.isaGrowth', (q) => {
    for (const isaGrowth of ['cash', 'invested']) {
      const { household } = TO_HOUSEHOLD[q](checked(q, { ...INPUTS[q], isaGrowth }).inputs, ENV);
      expect(household.isaGrowth, `${q} ${isaGrowth}`).toBe(isaGrowth);
    }
  });

  it('the household model keeps a choice as given, and only then (a household without one is today\'s, key for key); a wrong one is a problem', () => {
    const short = { people: [{ age: 60, pots: { pension: 100000 } }], jointSavings: 20000 };
    const plain = expandHousehold(short, TODAY);
    expect('isaGrowth' in plain.household).toBe(false);                   // made by hand: the engines' fixed rate, as before
    expect(plain.assumed.map((a) => a.id)).not.toContain('savings-growth');
    for (const isaGrowth of ['cash', 'invested']) {
      const { household, assumed } = expandHousehold({ ...short, isaGrowth }, TODAY);
      expect(household.isaGrowth).toBe(isaGrowth);
      expect(assumed).toEqual(plain.assumed);
      expect(validateHousehold(household, TODAY)).toEqual([]);
    }
    expect('isaGrowth' in expandHousehold({ ...short, isaGrowth: 'shares' }, TODAY).household).toBe(false);
    expect(validateHousehold({ ...plain.household, isaGrowth: 'shares' }, TODAY)).toEqual([{ field: 'isaGrowth', problem: 'notAnOption' }]);
    expect(validateHousehold(plain.household, TODAY)).toEqual([]);
    // every form's household has one: "Mostly cash" unless chosen — with no savings today too, so savings an answer works
    // with (B's set aside for the years before a pension opens) grow as the form would grow them
    for (const q of ['c', 'a', 'b']) {
      expect(TO_HOUSEHOLD[q](checked(q, INPUTS[q]).inputs, ENV).household.isaGrowth, q).toBe('cash');
      const none = checked(q, { ...INPUTS[q], savings: 0 }).inputs;
      expect('isaGrowth' in none, q).toBe(false);
      expect(TO_HOUSEHOLD[q](none, ENV).household.isaGrowth, q).toBe('cash');
    }
  });

  it.each(['a', 'b'])('%s: the saving years and every drawing run take the same choice', (q) => {
    for (const isaGrowth of ['cash', 'invested']) {
      const { household } = TO_HOUSEHOLD[q](checked(q, { ...INPUTS[q], isaGrowth }).inputs, ENV);
      expect(savingPlan(household, 60, ENV).isaGrowth).toBe(isaGrowth);
      const runs = configsAt(enginePlan(household, ENV, { start: 'asGiven' }), 24000);
      expect(runs.length).toBeGreaterThan(0);
      for (const { config } of runs) expect(config.isaGrowth, `${q} ${isaGrowth}`).toBe(isaGrowth);
    }
  });

  it('C from now: every drawing run takes the choice; C later (on the lives) hands it to the saving years as A would', () => {
    for (const isaGrowth of ['cash', 'invested']) {
      const now = checked('c', { you: { age: 62, pot: 300000 }, savings: 30000, isaGrowth }).inputs;
      for (const { config } of configsAt(enginePlan(toHouseholdC(now, ENV).household, ENV), 20000)) expect(config.isaGrowth).toBe(isaGrowth);
      const later = checked('c', { ...INPUTS.c, isaGrowth }).inputs;
      expect(saverInputsOf(later).isaGrowth).toBe(isaGrowth);
      expect(savingPlan(toHouseholdA(saverInputsOf(later), ENV, 60).household, 60, ENV).isaGrowth).toBe(isaGrowth);
    }
    // C with nothing in savings: none in its inputs, none handed on — A's mapping then says "Mostly cash", as C's own does
    const none = checked('c', { ...INPUTS.c, savings: 0 }).inputs;
    expect('isaGrowth' in saverInputsOf(none)).toBe(false);
    expect(toHouseholdA(saverInputsOf(none), ENV, 60).household.isaGrowth).toBe('cash');
  });
});

describe('the answers', () => {
  it.each(['c', 'a', 'b'])('%s: "Mostly cash" and "Invested like my pension" give different figures for a household with savings', (q) => {
    const cash = ANSWER[q](INPUTS[q], { ...ENV, detail: DETAIL[q] });
    const inv = ANSWER[q]({ ...INPUTS[q], isaGrowth: 'invested' }, { ...ENV, detail: DETAIL[q] });
    expect([cash.status, inv.status]).toEqual(['ok', 'ok']);
    expect(cash.inputs.isaGrowth).toBe('cash');
    expect(inv.inputs.isaGrowth).toBe('invested');
    const figures = (r) => JSON.stringify({ ...r, inputs: null, assumed: null, warnings: null });
    expect(figures(inv)).not.toBe(figures(cash));
  });

  it.each(['c', 'a', 'b'])('%s: with nothing in savings the choice changes nothing but the inputs it echoes', (q) => {
    const base = { ...INPUTS[q], savings: 0 };
    const plain = ANSWER[q](base, { ...ENV, detail: DETAIL[q] });
    expect('isaGrowth' in plain.inputs).toBe(false);
    for (const isaGrowth of ['cash', 'invested']) {
      const r = ANSWER[q]({ ...base, isaGrowth }, { ...ENV, detail: DETAIL[q] });
      expect(r.inputs.isaGrowth).toBe(isaGrowth);
      expect(JSON.stringify({ ...r, inputs: without(r.inputs, 'isaGrowth') })).toBe(JSON.stringify(plain));
    }
  });

  it.each(['c', 'a', 'b'])('%s: what was assumed — one line, "savings-growth", with Change; the default first, then a choice', (q) => {
    const def = ANSWER[q](INPUTS[q], { ...ENV, detail: DETAIL[q] });
    expect(def.assumed.find((a) => a.id === 'savings-growth')).toMatchObject({ field: 'isaGrowth', source: 'default', value: 'cash', text: LINE.cash });
    const inv = ANSWER[q]({ ...INPUTS[q], isaGrowth: 'invested' }, { ...ENV, detail: DETAIL[q] });
    expect(inv.assumed.find((a) => a.id === 'savings-growth')).toMatchObject({ field: 'isaGrowth', source: 'entered', value: 'invested', text: LINE.invested });
    // "Mostly cash" chosen is the default's value, and what was assumed is decided by value (as for every field)
    const chosenCash = ANSWER[q]({ ...INPUTS[q], isaGrowth: 'cash' }, { ...ENV, detail: DETAIL[q] });
    expect(chosenCash.assumed.find((a) => a.id === 'savings-growth')).toMatchObject({ source: 'default', text: LINE.cash });
    for (const r of [def, inv]) {
      const ids = r.assumed.map((a) => a.id);
      for (const old of ['isa-fixed-growth', 'savings-as-isa']) expect(ids, `${q} ${old}`).not.toContain(old);
      for (const text of allWords(r)) expect(text, q).not.toMatch(/fixed 3%|at a fixed/);
    }
    const none = ANSWER[q]({ ...INPUTS[q], savings: 0 }, { ...ENV, detail: DETAIL[q] });
    expect(none.assumed.map((a) => a.id)).not.toContain('savings-growth');
  });

  it.each(['a', 'b'])('%s: £0 saved and £300 a month going in: the line is there (the money going in grows too)', (q) => {
    const r = ANSWER[q]({ ...INPUTS[q], savings: 0, savingsIn: 300 }, { ...ENV, detail: DETAIL[q] });
    expect(r.assumed.find((a) => a.id === 'savings-growth')).toMatchObject({ field: 'isaGrowth', source: 'default', text: LINE.cash });
  });

  it.each(['a', 'b'])('%s: when most of the money at the stop is savings held mostly as cash, a note says how to choose; never when invested', (q) => {
    const given = q === 'a'
      ? { you: { age: 47, pot: 60000, payIn: { kind: 'total', total: 500 } }, savings: 360000, stop: { kind: 'age', age: 57 }, spend: { kind: 'amount', amount: 2000 } }
      : { you: { age: 47, pot: 60000, payIn: { total: 500 } }, savings: 360000, stop: { age: 57 }, spend: { amount: 2000 } };
    const cash = ANSWER[q](given, { ...ENV, detail: DETAIL[q] });
    expect(cash.status).toBe('ok');
    expect(cash.warnings.find((w) => w.id === 'savings-mostly-cash')).toMatchObject({ severity: 'note', text: MOSTLY_CASH });
    expect(cash.warnings.map((w) => w.id)).not.toContain('savings-fixed-growth');
    const inv = ANSWER[q]({ ...given, isaGrowth: 'invested' }, { ...ENV, detail: DETAIL[q] });
    expect(inv.warnings.map((w) => w.id)).not.toContain('savings-mostly-cash');
    // savings that are not most of the money: no note
    expect(ANSWER[q](INPUTS[q], { ...ENV, detail: DETAIL[q] }).warnings.map((w) => w.id)).not.toContain('savings-mostly-cash');
  });
});

describe('every rule of each question holds at either choice (random households, the choice drawn too)', () => {
  // the random generators leave the choice out unless asked (gen/arbitrary.mjs), so the other properties draw the
  // households they always drew; here it is drawn — "Invested like my pension" on about half the households with savings
  const PROP_ENV = { today: TODAY, futures: 20, seed: 0, trace: false };
  const sample = (schema, keep, n) => fc.sample(arbitraryInputs(schema, PROP_ENV, { isaGrowth: true }).filter(keep), { seed: 20261002, numRuns: n });
  it('C', () => {
    let invested = 0;
    for (const inputs of sample(SCHEMA_C, () => true, 30)) {
      const r = answerC(inputs, PROP_ENV);
      expect(checkC(r, inputs), JSON.stringify(inputs)).toEqual([]);
      if (r.inputs && r.inputs.isaGrowth === 'invested' && r.inputs.savings > 0) invested++;
    }
    expect(invested).toBeGreaterThan(0);
  }, 120_000);
  it('A', () => {
    let invested = 0;
    for (const inputs of sample(SCHEMA_A, (i) => i.stop.kind === 'age' && payInsFit(i), 16)) {
      const env = { ...PROP_ENV, detail: 'chart', ages: [inputs.stop.age] };
      const r = answerA(inputs, env);
      expect(checkAnswerA(r, inputs, env), JSON.stringify(inputs)).toEqual([]);
      if (r.inputs && r.inputs.isaGrowth === 'invested' && (r.inputs.savings > 0 || r.inputs.savingsIn > 0)) invested++;
    }
    expect(invested).toBeGreaterThan(0);
  }, 120_000);
  it('B', () => {
    let invested = 0;
    for (const inputs of sample(SCHEMA_B, (i) => withinCeiling(i) && asksB(i), 16)) {
      const r = answerB(inputs, { ...PROP_ENV, detail: 'answer' });
      expect(checkAnswerB(r, inputs), JSON.stringify(inputs)).toEqual([]);
      if (r.inputs && r.inputs.isaGrowth === 'invested' && (r.inputs.savings > 0 || r.inputs.savingsIn > 0)) invested++;
    }
    expect(invested).toBeGreaterThan(0);
  }, 120_000);
});

describe('carried between the questions, and into a plan', () => {
  it('every carry between C, A and B takes the choice as it is typed (nothing typed: nothing carried, the default stands)', () => {
    for (const [key, map] of Object.entries(CARRY)) expect(map.some(([from, to]) => from === 'isaGrowth' && to === 'isaGrowth'), key).toBe(true);
    const c = run(typedC(fresh()), set('c', 'savings', '40,000'), set('c', 'isaGrowth', 'invested'));
    for (const to of ['a', 'b']) expect(reduce(c, { type: 'draft/carry', from: 'c', to }).draft[to].values.isaGrowth, to).toBe('invested');
    const plain = run(typedC(fresh()), set('c', 'savings', '40,000'));
    expect('isaGrowth' in reduce(plain, { type: 'draft/carry', from: 'c', to: 'a' }).draft.a.values).toBe(false);
    const a = run(typedA(fresh()), set('a', 'savings', '40,000'), set('a', 'isaGrowth', 'invested'));
    expect(reduce(a, { type: 'draft/carry', from: 'a', to: 'b' }).draft.b.values.isaGrowth).toBe('invested');
    const b = run(typedB(fresh()), set('b', 'savings', '40,000'), set('b', 'isaGrowth', 'invested'));
    expect(reduce(b, { type: 'draft/carry', from: 'b', to: 'a' }).draft.a.values.isaGrowth).toBe('invested');
  });

  it('the hand-over to C: C asks it too, so the choice never makes C differ', () => {
    const inputs = checked('a', { ...INPUTS.a, isaGrowth: 'invested' }).inputs;
    expect(handOverToC(inputs, 60, TODAY)).toEqual({ ok: true, same: true });
  });

  it.each(['c', 'a', 'b'])('%s: the plan seed carries the choice in its checked inputs, and the plan made from it has it (no savings: "Mostly cash")', (q) => {
    const seedOf = (r) => buildPlanSeed({ source: q, result: r, env: { today: TODAY, appVersion: '6.22.0' }, name: { chosen: 'My try' }, createdAt: '2026-10-02T14:03:22.511Z' });
    const planOf = (seed) => {
      expect(checkSeed(seed, Date.parse(seed.createdAt))).toEqual({ ok: true });
      const made = seedToScenario(seed, new Date(2026, 9, 2, 15, 0));
      if (made.partner) expect(made.partner.stressTool.settings.isaGrowth).toBe(made.yours.stressTool.settings.isaGrowth);
      expect(made.yours.decisionTool.settings).not.toHaveProperty('isaGrowth');
      return made.yours.stressTool.settings.isaGrowth;
    };
    for (const isaGrowth of ['cash', 'invested']) {
      const seed = seedOf(ANSWER[q]({ ...INPUTS[q], isaGrowth }, { ...ENV, detail: DETAIL[q] }));
      expect(seed.inputs.isaGrowth).toBe(isaGrowth);
      expect(planOf(seed)).toBe(isaGrowth);
    }
    const none = seedOf(ANSWER[q]({ ...INPUTS[q], savings: 0 }, { ...ENV, detail: DETAIL[q] }));
    expect('isaGrowth' in none.inputs).toBe(false);
    expect(planOf(none)).toBe(DEFAULT_ISA_GROWTH);
  });
});

describe('on the screen: asked under the savings box once there is money in savings', () => {
  const field = (q) => SCHEMA[q].fields.find((x) => x.path === 'isaGrowth');

  it('select.js: the choice is asked with money in savings (as checked), never without; both options are always offered', () => {
    for (const q of ['c', 'a', 'b']) {
      expect(choiceAsked(q, field(q), {}, { savings: 0 }), q).toBe(false);
      expect(choiceAsked(q, field(q), {}, { savings: 40000 }), q).toBe(true);
      expect(choiceAsked(q, field(q), {}, { savings: 0, savingsIn: 300 }), q).toBe(true);
      expect(offeredOptions(q, field(q), {})).toEqual(['cash', 'invested']);
    }
  });

  const drawn = (state, q) => {
    const { root } = draw(state);
    return { root, has: Boolean(root.querySelector(`[data-testid="${q}.isaGrowth.cash"]`)), ticked: root.querySelector(`[name="${q}.isaGrowth"]:checked`) };
  };

  it('A\'s first form: hidden with no savings; under the savings box, "Mostly cash" ticked, once savings are typed', () => {
    const blank = at(typedA(fresh()), 'a', 'numbers');
    expect(drawn(blank, 'a').has).toBe(false);
    expect(checkScreen(draw(blank).root, blank)).toEqual([]);
    const saved = at(run(typedA(fresh()), set('a', 'savings', '40,000')), 'a', 'numbers');
    const d = drawn(saved, 'a');
    expect(d.has).toBe(true);
    expect(d.ticked && d.ticked.value).toBe('cash');
    const order = [...d.root.querySelectorAll('[data-field]')].map((el) => el.getAttribute('data-field'));
    expect(order.indexOf('isaGrowth')).toBe(order.indexOf('savings') + 1);
    expect(checkScreen(d.root, saved)).toEqual([]);
    const inv = at(run(typedA(fresh()), set('a', 'savings', '40,000'), set('a', 'isaGrowth', 'invested')), 'a', 'numbers');
    expect(drawn(inv, 'a').ticked.value).toBe('invested');
    expect(checkScreen(draw(inv).root, inv)).toEqual([]);
  });

  it('B and C: under "Add more detail", straight after the savings box, once savings are typed', () => {
    for (const [q, typed] of [['b', typedB], ['c', typedC]]) {
      const open = (s) => reduce(at(s, q, 'numbers'), { type: 'ui/toggle', id: 'more' });
      const none = open(typed(fresh()));
      expect(drawn(none, q).has, q).toBe(false);
      expect(checkScreen(draw(none).root, none), q).toEqual([]);
      const saved = open(run(typed(fresh()), set(q, 'savings', '40,000')));
      const d = drawn(saved, q);
      expect(d.has, q).toBe(true);
      expect(d.ticked.value, q).toBe('cash');
      const order = [...d.root.querySelectorAll('[data-field]')].map((el) => el.getAttribute('data-field'));
      expect(order.indexOf('isaGrowth'), q).toBe(order.indexOf('savings') + 1);
      expect(checkScreen(d.root, saved), q).toEqual([]);
    }
  });
});

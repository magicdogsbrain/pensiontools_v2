/**
 * The saver rail's "Ask a question" link to B opens B with the plan's figures in its boxes (research/saving-enough-and-check-in.md
 * 4.1, 4.4; 6.55.0), instead of B's empty numbers step: the plan read as B (saverInputs.js saverInputsOf) is written as the
 * text of B's boxes (saverDraftOf; validate.js draftTextOf, the way back of parseDraft) and loaded whole (draft/load).
 * Fictional people only (Alex, Sam), made here.
 *   - the text reads back: parseDraft gives exactly the inputs it was written from, for every kind of pay-in and a spending
 *     shape with steps;
 *   - the round trip: a plan kept from a B answer, opened back into B from its rail, gives B's same answer — the count, the
 *     verdict and the pay-in that would be enough; any other saver's plan, whose mixes B's boxes can name only by the
 *     nearest level, gives the plan's own answer too: B runs on the plan's mixes while those boxes stay as loaded;
 *   - draft/load: the values replace the draft, every box marked left, the old answer gone, B's numbers step opened; nothing
 *     that is not one of B's boxes is taken;
 *   - the rail: a saver's B link loads the plan's figures, its A link opens A as before; a retired plan's rail fills nothing.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { answerB } from '../../../src/answers/b/answer.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { parseDraft, checkInputs, draftTextOf } from '../../../src/answers/shared/validate.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf, saverDraftOf } from '../../../src/answers/plan/saverInputs.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { askFillOf } from '../../../src/answers/plan/saving.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parsedDraft, planMixOf, currentKey } from '../../../src/v7/state/select.js';
import { saveDraft, loadDraft, draftOf } from '../../../src/v7/effects/draftStore.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { corpus, entryOf, entriesAt, stateWith, noon, TODAY } from './_plans.js';

const KEPT_ON = '2026-11-04';
const ENV = { today: KEPT_ON, futures: 100, seed: 0, detail: 'answer' };
const copy = (v) => JSON.parse(JSON.stringify(v));

/** Sam, 41, still saving (fictional): question B's inputs, with the pay-in as given. */
const sam = (payIn, more = {}) => ({ household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95, ...more });
/** Alex, 38 (fictional): £2,200 a month from 64, 1.5% less each year, then £1,800 from 75; a final-salary pension too. */
const alex = () => ({ household: 'single', you: { pot: 48000.5, age: 38, statePension: { kind: 'forecast', yearly: 10400.4 }, finalSalary: { has: true, yearly: 9000, fromAge: 65 }, payIn: { kind: 'total', total: 417.07 } },
  stop: { age: 64 }, spend: { kind: 'amount', amount: 2200, then: 'falls', fallsPct: 1.5, steps: [{ fromAge: 75, perMonth: 1800, then: 'level' }] }, savings: 12000, savingsIn: 150, charge: 0.45, endAge: 95 });

/** B's answer kept as a plan, as "Keep this as a plan" makes it, brought up to date as the plan source reads it. */
function kept(inputs, payIn = 'now') {
  const result = answerB(inputs, ENV);
  const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn });
  const made = seedToScenario(seed, KEPT_ON).yours;
  made.id = 'SamSaving01';
  return { result, plan: upgradeScenario(copy(made), { now: noon(KEPT_ON) }).scenario };
}
/** A page on the plan's own step, with the plan read. */
const onPlan = (plan, today = KEPT_ON) => stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id + '/saving', { today });
/** The plan's home (7.3.0): "Ask a question with this plan's figures" lives there now, folded away, never on the rail. */
const onHome = (plan, today = KEPT_ON) => stateWith([{ plan, newer: false, failed: false }], '#/plan/' + plan.id, { today });
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions };
}

describe('the text of B\'s boxes reads back to the inputs it was written from (validate.js draftTextOf)', () => {
  const cases = {
    'a share of pay': sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4.5 }, { savingRisk: 'adventurous', risk: 'balanced', confidence: 'bold' }),
    'your part and your employer\'s in pounds, to the penny': sam({ kind: 'split', own: 333.33, employer: 211.17 }),
    'one figure, a forecast, a final-salary pension, savings, a charge and a spending shape with a step': alex()
  };
  for (const [name, inputs] of Object.entries(cases)) {
    it(name, () => {
      const checked = checkInputs(SCHEMA_B, inputs, { today: KEPT_ON });
      expect(checked.ok, JSON.stringify(checked.errors)).toBe(true);
      const text = draftTextOf(SCHEMA_B, checked.inputs);
      for (const [path, v] of Object.entries(text)) {
        if (path === 'spend.steps') { for (const s of v) for (const x of Object.values(s)) expect(typeof x).toBe('string'); continue; }
        expect(typeof v === 'string' || typeof v === 'boolean', path).toBe(true);
      }
      const back = parseDraft(SCHEMA_B, text, { today: KEPT_ON });
      expect(back.ok, JSON.stringify(back.errors)).toBe(true);
      expect(back.inputs).toEqual(checked.inputs);
    });
  }
  it('money as a box shows it: whole pounds with commas, pence only when there are any', () => {
    const text = draftTextOf(SCHEMA_B, checkInputs(SCHEMA_B, alex(), { today: KEPT_ON }).inputs);
    expect(text['you.pot']).toBe('48,000.50');
    expect(text['you.payIn.total']).toBe('417.07');
    expect(text['spend.amount']).toBe('2,200');
    expect(text['spend.steps']).toEqual([{ fromAge: '75', perMonth: '1,800', then: 'level', fallsPct: '' }]);
    expect(text['you.finalSalary.has']).toBe(true);
    expect(text['charge']).toBe('0.45');
  });
});

describe('the round trip: a plan kept from B, opened back into B from its rail, gives B\'s same answer', () => {
  const cases = {
    'a share of pay, saving more boldly than drawing': sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }, { savingRisk: 'adventurous', risk: 'balanced' }),
    'your part and your employer\'s in pounds': sam({ kind: 'split', own: 333.33, employer: 211.17 }),
    'one figure, with savings, a final-salary pension and a spending shape': alex()
  };
  for (const [name, inputs] of Object.entries(cases)) {
    it(name, () => {
      const { result, plan } = kept(inputs);
      const filled = saverDraftOf(plan, { today: KEPT_ON });
      expect(filled.ok).toBe(true);
      expect(filled.exactMix).toBe(true);                       // as kept: the answer's own levels
      // the rail's link, loaded as the page loads it (the plan source puts the fill on the page reading)
      const onPage = onPlan(plan);
      expect(askFillOf([{ plan, newer: false, failed: false }], plan.id, { today: KEPT_ON })).toEqual({ b: { values: filled.values, mixes: null } });
      expect(onPage.plans.view.page.askFill.b.values).toEqual(filled.values);
      const s = reduce(onPage, { type: A.DRAFT_LOAD, q: 'b', values: onPage.plans.view.page.askFill.b.values });
      const parsed = parsedDraft(s, 'b');
      expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
      expect(parsed.inputs).toEqual(saverInputsOf(plan, { today: KEPT_ON }).inputs);
      // B, asked with what the boxes now hold: the answer the plan was kept from
      const again = answerB(parsed.inputs, ENV);
      expect(again.chance.fails).toBe(result.chance.fails);
      expect(again.verdict).toEqual(result.verdict);
      expect(again.payIn.needed).toBe(result.payIn.needed);
      expect(again.enough && again.enough.atLevel && again.enough.atLevel.payIn).toBe(result.enough && result.enough.atLevel && result.enough.atLevel.payIn);
    }, 30000);
  }
});

describe('draft/load: a whole draft, as text', () => {
  const { plan } = kept(sam({ kind: 'split', own: 333.33, employer: 211.17 }));
  const values = saverDraftOf(plan, { today: KEPT_ON }).values;
  it('replaces the draft, marks every box left, drops the old answer and the keep box\'s name, and opens B\'s numbers step', () => {
    let s = onPlan(plan);
    s = reduce(s, { type: A.DRAFT_SET, q: 'b', path: 'you.age', value: '29' });
    s = reduce(s, { type: A.DRAFT_SET, q: 'b', path: 'endAge', value: '99' });
    s = reduce(s, { type: A.KEEP_NAME, q: 'b', value: 'Old name' });
    s = { ...s, answers: { ...s.answers, b: { ...s.answers.b, status: 'final', inputsKey: 'old', result: { old: true } } } };
    const next = reduce(s, { type: A.DRAFT_LOAD, q: 'b', values });
    expect(next.draft.b.values).toEqual(values);
    expect(next.draft.b.touched.slice().sort()).toEqual(Object.keys(values).sort());
    expect(next.answers.b.status).toBe('idle');
    expect(next.answers.b.result).toBe(null);
    expect(next.keep.b.name).toBe(null);
    expect(next.route).toMatchObject({ screen: 'step', q: 'b', step: 'numbers', planId: null });
    // the other questions' drafts are untouched
    expect(next.draft.a).toBe(s.draft.a);
    expect(next.draft.c).toBe(s.draft.c);
  });
  it('the later steps are cleaned to their boxes, each box marked', () => {
    const shaped = { ...values, 'spend.steps': [{ fromAge: '75', perMonth: '1,500', then: 'falls', fallsPct: '1', extra: 'x' }] };
    const next = reduce(onPlan(plan), { type: A.DRAFT_LOAD, q: 'b', values: shaped });
    expect(next.draft.b.values['spend.steps']).toEqual([{ fromAge: '75', perMonth: '1,500', then: 'falls', fallsPct: '1' }]);
    for (const f of ['fromAge', 'perMonth', 'then', 'fallsPct']) expect(next.draft.b.touched).toContain('spend.steps.0.' + f);
  });
  it('takes nothing that is not one of the question\'s boxes, as text or yes/no', () => {
    const s = onPlan(plan);
    const tries = [{ ...values, 'you.notABox': '1' }, { ...values, 'you.age': 41 }, null, ['x'], { 'spend.steps': 'nope' }];
    for (const v of tries) expect(() => reduce(s, { type: A.DRAFT_LOAD, q: 'b', values: v })).toThrow();
    expect(() => reduce(s, { type: A.DRAFT_LOAD, q: 'zz', values })).toThrow();
  });
});

describe('the home (the rail until 7.3.0): a saver\'s B link opens B with the plan\'s figures; A as before; a retired plan fills nothing', () => {
  it('a plan kept from B: the B link is marked filled and loads its figures; the A link opens A empty, as before', () => {
    const { plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }));
    const { root, actions } = draw(onHome(plan));
    const b = root.querySelector('[data-testid="plan.home.ask.b"]');
    expect(b.getAttribute('href')).toBe('#/b/numbers');
    expect(b.getAttribute('data-filled')).toBe('plan');
    b.click();
    // ... and the plan's id (6.59.0): "Use these in ‘…’" writes back onto this plan, only when pressed
    expect(actions.at(-1)).toEqual({ type: 'draft/load', q: 'b', values: saverDraftOf(plan, { today: KEPT_ON }).values, planId: plan.id });
    const a = root.querySelector('[data-testid="plan.home.ask.a"]');
    expect(a.getAttribute('data-filled')).toBe(null);
    const before = actions.length;
    a.click();
    expect(actions.length).toBe(before);                       // A: the link alone, as before
  });
  it('every saver plan in the corpus that B can read is filled with what saverInputsOf reads; a retired plan\'s rail asks C, unfilled', () => {
    const entries = entriesAt(TODAY);
    let filled = 0;
    for (const e of entries) {
      const page = planPage(entries, e.plan.id, null, { today: TODAY });
      if (!page.found) continue;
      const fill = askFillOf(entries, e.plan.id, { today: TODAY });
      if (page.retired) { expect(fill).toEqual({}); continue; }
      const read = saverInputsOf(e.plan, { today: TODAY });
      if (!page.saver || !read.ok) { expect(fill.b).toBeUndefined(); continue; }
      filled++;
      expect(parseDraft(SCHEMA_B, fill.b.values, { today: TODAY }).inputs).toEqual(read.inputs);
    }
    expect(filled).toBeGreaterThan(0);
    const retired = corpus()['04-buckets-running'];
    const { root } = draw(stateWith([entryOf(retired)], '#/plan/' + retired.id));
    expect(root.querySelector('[data-testid="plan.home.ask.d"]').getAttribute('data-filled')).toBe(null);
    // no question is pushed on a page of the plan (7.3.0): the rail asks none
    expect(draw(stateWith([entryOf(retired)], '#/plan/' + retired.id + '/plan')).root.querySelector('[data-testid^="rail.ask."]')).toBe(null);
  });
});

describe('a saver\'s plan whose mixes are not a level\'s: B opened from its rail runs on the plan\'s own mixes', () => {
  // B's risk boxes hold a level (cautious, balanced, adventurous). A plan made in the planner, or changed since it was kept,
  // holds its own mix, which those boxes can name only by the nearest level; before 6.55.0's fix B then ran at that level's
  // mix and gave other figures than the plan's own (the count of futures that fail, the pay-in that would be enough).
  const DAY = '2026-11-04';
  const RUN = { today: DAY, futures: 200, seed: 0, detail: 'answer' };
  const entries = entriesAt(DAY);
  const mixed = entries.filter((e) => { const f = askFillOf(entries, e.plan.id, { today: DAY }); return f.b && f.b.mixes; });
  const opened = (e) => reduce(stateWith(entries, '#/plan/' + e.plan.id + '/saving', { today: DAY }), { type: A.DRAFT_LOAD, q: 'b', ...((f) => ({ values: f.values, mixes: f.mixes }))(askFillOf(entries, e.plan.id, { today: DAY }).b) });
  it('there are such plans in the corpus (a planner-made saver, a couple\'s)', () => {
    expect(mixed.length).toBeGreaterThanOrEqual(2);
  });
  it('B gives the plan\'s own answer: the same count, verdict and pay-in that would be enough', () => {
    for (const e of mixed) {
      const read = saverInputsOf(e.plan, { today: DAY });
      const own = answerB(read.inputs, { ...RUN, ...read.env });
      const s = opened(e);
      const parsed = parsedDraft(s, 'b');
      expect(parsed.ok).toBe(true);
      expect(planMixOf(s, 'b')).toEqual(read.env);
      const inB = answerB(parsed.inputs, { ...RUN, ...planMixOf(s, 'b') });
      expect(inB.chance.fails, e.plan.id).toBe(own.chance.fails);
      expect(inB.verdict, e.plan.id).toEqual(own.verdict);
      expect(inB.payIn.needed, e.plan.id).toBe(own.payIn.needed);
    }
  }, 60000);
  it('a risk box changed: B runs at its boxes\' levels, and the answer\'s key says so; started again, the plan\'s mixes go', () => {
    const s = opened(mixed[0]);
    const pm = s.draft.b.planMix;
    const other = ['cautious', 'balanced', 'adventurous'].find((l) => l !== pm.risk);
    const changed = reduce(s, { type: A.DRAFT_SET, q: 'b', path: 'risk', value: other });
    expect(planMixOf(changed, 'b')).toBe(null);
    expect(currentKey(changed, 'b')).not.toBe(currentKey(s, 'b'));
    const back = reduce(changed, { type: A.DRAFT_SET, q: 'b', path: 'risk', value: pm.risk });
    expect(planMixOf(back, 'b')).toEqual({ mix: pm.mix, savingMix: pm.savingMix });
    expect(currentKey(back, 'b')).toBe(currentKey(s, 'b'));
    expect(reduce(s, { type: A.DRAFT_RESET, q: 'b' }).draft.b.planMix).toBeUndefined();
  });
  it('kept across a reload of the tab, cleaned; refused when they are not mixes, or for another question', () => {
    const s = opened(mixed[0]);
    const store = new Map();
    const storage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
    expect(saveDraft(storage, draftOf(s))).toBe(true);
    const again = initialState({ today: DAY, build: 'test', draft: loadDraft(storage) });
    expect(again.draft.b.planMix).toEqual(s.draft.b.planMix);
    const values = s.draft.b.values, mixes = s.draft.b.planMix;
    for (const bad of [{ ...mixes, risk: 'wild' }, { ...mixes, mix: { equity: 2, bond: 0, cash: 0 } }, { ...mixes, savingMix: null }, 'x']) {
      expect(() => reduce(s, { type: A.DRAFT_LOAD, q: 'b', values, mixes: bad })).toThrow();
    }
    expect(() => reduce(s, { type: A.DRAFT_LOAD, q: 'a', values: {}, mixes })).toThrow();
  });
  it('the home\'s B link (the rail\'s until 7.3.0) loads the figures with the plan\'s mixes', () => {
    const e = mixed[0];
    const { root, actions } = draw(stateWith(entries, '#/plan/' + e.plan.id, { today: DAY }));
    root.querySelector('[data-testid="plan.home.ask.b"]').click();
    const fill = askFillOf(entries, e.plan.id, { today: DAY }).b;
    expect(actions.at(-1)).toEqual({ type: 'draft/load', q: 'b', values: fill.values, mixes: fill.mixes, planId: String(e.plan.id) });
  });
});

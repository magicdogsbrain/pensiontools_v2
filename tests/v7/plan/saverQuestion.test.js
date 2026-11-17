/**
 * The saver's one question, everywhere (7.12.0): "I want £X a month after tax from age Y; I am A, I earn S, I have a pot of
 * B: what do I pay in, as a share of my pay and in pounds, and how sure is it?" — asked and changed on What you pay in,
 * read on the home, and followed when X, Y, the pay-in or a lump change. Fictional people only, made here from fictional
 * answers:
 *   - Jo, 33: £38,000 a year, £22,000 in a pension, 5% of pay going in and 3% from the employer; wants £2,000 a month from 60;
 *   - Pat, 52: £31,000 a year, £45,000 in a pension, 4% and 3%; wants more than paying in can reach.
 * Every figure expected is worked out by hand in the test, from the share or the pounds the answer gives.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { savingOf, savingPatch, applyPatch } from '../../../src/answers/plan/saving.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { noon } from './_plans.js';

const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const READ_ON = '2026-11-16';
const entry = (plan) => ({ plan, newer: false, failed: false });

/** A B answer kept as a plan on `on`, brought up to date as the plan source reads it on `readOn`. */
export function keptPlan(inputs, { on = READ_ON, readOn = on, id = 'Plan01', name = 'A plan' } = {}) {
  const result = answerB(inputs, { today: on, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: on, appVersion: 'test' }, name, createdAt: on + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, on).yours;
  made.id = id;
  return upgradeScenario(copy(made), { now: noon(readOn) }).scenario;
}

export const JO = () => ({ household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 });

const linesOf = (page) => { const out = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (x.sentence && x.id) out.push(x); Object.values(x).forEach(walk); } }; walk(page); return out; };

describe('"What you want" on What you pay in: the amount and the stop age beside what goes in, one Save', () => {
  it('Jo opens the page: the first section holds £2,000 and 60, as her plan has them', () => {
    const plan = keptPlan(JO(), { id: 'JoW1' });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(v.want).not.toBe(null);
    expect(v.want.locked).toBe(false);
    expect(v.want.fields.map((f) => [f.path, f.shown])).toEqual([['want.monthly', '2000'], ['want.stopAge', '60']]);
    // nothing typed: the answer is the plan's as saved
    expect(v.verdict.ok).toBe(true);
    expect(v.verdict.ifSaved).toBeUndefined();
  }, 30000);

  it('Jo types £2,500 from 65: the answer follows before Save ("if you save this"), Save makes ONE write, and the answer then is that same one', () => {
    const plan = keptPlan(JO(), { id: 'JoW2' });
    const typed = { 'want.monthly': '2,500', 'want.stopAge': '65' };
    const before = savingOf([entry(plan)], plan.id, { today: READ_ON });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON, typed });
    expect(v.ok).toBe(true);
    expect(v.verdict.ifSaved).toBe(true);
    expect(v.verdict.key).not.toBe(before.verdict.key);
    expect(v.verdict.notes.stopAge).toBe('65');
    // ONE patch: the stop age (About's paths), the amount (What you spend's) together; Undo has every one of them
    const p = savingPatch(plan, typed, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(p.patch['stressTool.settings.retireAge']).toBe(65);
    expect(p.patch['stressTool.settings.incomeSteps']).toBeDefined();
    expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
    // never a path and a path inside it in the one write
    for (const k of Object.keys(p.patch)) for (const j of Object.keys(p.patch)) if (k !== j) expect(j.startsWith(k + '.')).toBe(false);
    // the toast says what was saved: the amount and the age first
    const t = v.savedLine;
    expect(fill(W.toast[t.id], t.slots)).toMatch(/^Saved\. £2,500 a month from 65\. You pay in 5% of your pay and your employer 3%: /);
    const after = applyPatch(plan, p.patch);
    const read = saverInputsOf(after, { today: READ_ON });
    expect(read.ok).toBe(true);
    expect(read.inputs.stop.age).toBe(65);
    // £2,500 a month after tax, grossed up for the tax year and read back after tax: within £1 of what was typed
    expect(Math.abs(read.notes.aimMonthly - 2500)).toBeLessThanOrEqual(1);
    const saved = savingOf([entry(after)], after.id, { today: READ_ON });
    expect(saved.verdict.ifSaved).toBeUndefined();
    // the answer shown before Save is the answer after it: one key
    expect(saved.verdict.key).toBe(v.verdict.key);
    expect(saved.want.fields.map((f) => f.shown)).toEqual(['2500', '65']);
    // "Your plan" says what it pays from the new stop
    const first = linesOf(planPage([entry(after)], after.id, 'plan', { today: READ_ON })).find((x) => x.id === 'pays.step');
    expect(first.sentence.text).toMatch(/^From age 65: /);
  }, 60000);

  it('a stop age at or before the age today, or an amount that is not a figure, is a problem and writes nothing', () => {
    const plan = keptPlan(JO(), { id: 'JoW3' });
    expect(savingPatch(plan, { 'want.stopAge': '33' }, { today: READ_ON })).toMatchObject({ ok: false, errors: { 'want.stopAge': 'notAhead' } });
    expect(savingPatch(plan, { 'want.monthly': 'lots' }, { today: READ_ON })).toMatchObject({ ok: false, errors: { 'want.monthly': 'notANumber' } });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON, typed: { 'want.stopAge': '33' } });
    expect(v.verdict.ifSaved).toBeUndefined();
  }, 30000);

  it('a locked plan says the amount and the age, and how to change them; Save writes only what goes in', () => {
    const plan = keptPlan(JO(), { id: 'JoW4' });
    plan.decisionTool.settings.locked = true;
    plan.decisionTool.settings.lockedAt = '2026-11-01T10:00:00.000Z';
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(v.want.locked).toBe(true);
    const said = fill(W.want.locked, v.want.saved);
    expect(said).toBe('£2,000 a month after tax from 60. These are part of your locked plan. To change them, unlock it from “Your plan as locked”, change them here and lock it again. What you pay in can still be changed below.');
    const p = savingPatch(plan, { 'want.monthly': '2500', 'want.stopAge': '65', salary: '40000' }, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.settings']);
  }, 30000);
});

describe('"What you want" saved through the one write file', () => {
  const tick = async (n = 12) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
  const STAMP = '2026-11-16T14:03:00.000Z';
  it('Jo types £2,500 from 65 and presses Save: ONE updateDoc of the want\'s paths and the stamp; Undo puts every one back', async () => {
    const { startPlanWrite } = await import('../../../src/v7/effects/planWrite.js');
    const { upgradedList, viewFor } = await import('../../../src/v7/effects/planSource.js');
    const { createStore } = await import('../../../src/v7/effects/store.js');
    const { initialState } = await import('../../../src/v7/state/initial.js');
    const { reduce } = await import('../../../src/v7/state/reduce.js');
    const { A } = await import('../../../src/v7/state/actions.js');
    const { parse } = await import('../../../src/v7/router/routes.js');
    const raw = keptPlan(JO(), { id: 'JoW5' });
    const writes = [];
    const fb = { doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc: (ref, data) => { writes.push(copy(data)); return Promise.resolve(); } };
    const store = createStore(initialState({ today: READ_ON, build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + raw.id + '/saving') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(READ_ON)), source: 'account', readAt: '14:03' });
    store.dispatch({ type: A.PLAN_EDIT, planId: raw.id, path: 'want.monthly', value: '2500' });
    store.dispatch({ type: A.PLAN_EDIT, planId: raw.id, path: 'want.stopAge', value: '65' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    const mem = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const stop = startPlanWrite(store, { win: null, session: mem, local: mem, now: () => new Date(STAMP), fb, handles: () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() }) });
    store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && !state.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
    const plan = store.getState().plans.list[0].plan;
    store.dispatch({ type: A.PLAN_SAVE, planId: raw.id });
    await tick();
    expect(store.getState().ui.saveProblem).toBe(null);
    expect(writes.length).toBe(1);
    const want = savingPatch(plan, { 'want.monthly': '2500', 'want.stopAge': '65' }, { today: READ_ON });
    // (a plan that is not locked: the move of the start a stop age makes is written with it, as About's own Save does)
    expect(writes[0]).toMatchObject({ ...want.patch, lastModified: STAMP });
    expect(store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'saving', line: { id: 'savingWant.share' } });
    store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(plan, writes[0]), newer: false, failed: false }], source: 'account', readAt: '14:04' });
    store.dispatch({ type: A.PLAN_UNDO, planId: raw.id });
    await tick();
    expect(writes.length).toBe(2);
    const back = applyPatch(applyPatch(plan, writes[0]), Object.fromEntries(Object.entries(writes[1]).map(([k, v]) => [k, v === null ? undefined : v])));
    expect(back.stressTool).toEqual(plan.stressTool);
    expect(back.decisionTool).toEqual(plan.decisionTool);
    expect(back.accumulationTool).toEqual(plan.accumulationTool);
    stop();
  }, 60000);
});

describe('the home says the answer in the person\'s own terms, and follows every change', async () => {
  const { h, render } = await import('preact');
  const { App } = await import('../../../src/v7/App.jsx');
  const { reduce } = await import('../../../src/v7/state/reduce.js');
  const { A } = await import('../../../src/v7/state/actions.js');
  const { wanted } = await import('../../../src/v7/effects/saver.js');
  const { viewFor } = await import('../../../src/v7/effects/planSource.js');
  const { stateWith } = await import('./_plans.js');
  const pageState = (plan, hash) => { const s = stateWith([entry(plan)], hash, { today: READ_ON, source: 'window', session: 'nobody' }); return { ...s, plans: { ...s.plans, view: viewFor(s) } }; };
  /** The home of a plan with its answer worked out (the run the page asks for, done here at 1,000 futures), as drawn. */
  const home = (plan) => {
    const st = pageState(plan, '#/plan/' + plan.id);
    const v = wanted(st);
    expect(v, 'the home asks for the answer').not.toBe(null);
    // the same run as What you pay in: one key
    expect(v.key).toBe(wanted(pageState(plan, '#/plan/' + plan.id + '/saving')).key);
    const result = answerB(v.inputs, { today: READ_ON, futures: 1000, seed: 0, detail: 'answer', ...v.env });
    const held = reduce(reduce(st, { type: A.SAVER_WORKING, key: v.key }), { type: A.SAVER_FINAL, key: v.key, result });
    const el = document.createElement('div');
    render(h(App, { state: held, dispatch: () => {} }), el);
    const block = el.querySelector('[data-testid="plan.home.saver"]');
    expect(block, 'the block is drawn').not.toBe(null);
    const first = el.querySelector('[data-region="plan-home"] > section, [data-region="plan-home"] > .block');
    return { text: block.textContent, lines: [...block.querySelectorAll('[data-line]')].map((x) => [x.getAttribute('data-line'), x.textContent]), result, key: v.key, first };
  };
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const save = (plan, typed) => { const p = savingPatch(plan, typed, { today: READ_ON }); expect(p.ok, JSON.stringify(p.errors)).toBe(true); return applyPatch(plan, p.patch); };

  it('Jo: what she wants, what she pays now, whether it is enough and how sure, and what would be — the share and the pounds agree', () => {
    const plan = keptPlan(JO(), { id: 'JoH1' });
    const H = home(plan);
    const line = (id) => (H.lines.find((x) => x[0] === id) || [null, null])[1];
    expect(line('want')).toBe('You want £2,000 a month after tax, at today’s prices, from age 60.');
    // 5% of £38,000 lands 38,000 × 0.05 ÷ 12 = £158.33 a month; relief at source: × 0.8 = £126.67 from take-home pay;
    // with the employer's 3%: 38,000 × 0.08 ÷ 12 = £253.33 a month in all
    expect(line('now.share')).toBe('You pay in 5% of your pay and your employer 3%: £127 a month from your take-home pay, £253 a month into your pension in all.');
    const band = H.result.verdict.band;
    expect(line('head')).toBe((band === 'yes' ? 'On course for ' : band === 'close' ? 'Close — ' : 'Not enough for ') + '£2,000 a month from 60' + (band === 'close' ? ' is tight' : ''));
    // how sure: the chance, in the answer's own first sentence
    expect(line('line')).toMatch(/your money lasts as long as you do \d+ times in 20/);
    expect(band).not.toBe('yes');
    // what would be enough: a share of pay, and what leaves take-home pay — worked here from the share the answer gives
    const fig = H.result.enough.atLevel;
    expect(line('enoughHead')).toContain(`${fig.totalPct}% of your pay in all`);
    const ownLanded = 38000 * fig.ownPct / 100 / 12;
    const all = 38000 * fig.totalPct / 100 / 12;
    expect(line('enoughLine')).toContain(`You ${fig.ownPct}% (${gbp(ownLanded * 0.8)} a month from your take-home pay) and your employer 3% as now: ${gbp(all)} a month in all`);
    // and the two agree: own share + employer's 3% is the whole share; the pounds in all are the whole share of £38,000
    expect(fig.ownPct + 3).toBeCloseTo(fig.totalPct, 6);
    expect(Math.abs(ownLanded + 38000 * 0.03 / 12 - all)).toBeLessThan(0.01);
    // the block is the first thing under the plan's headline
    expect(H.first && H.first.getAttribute('data-testid')).toBe('plan.home.saver');
  }, 90000);

  it('Jo changes what she wants and what goes in: £2,500, then stopping at 58, then at 65 — the home follows each, and says the same as What you pay in', () => {
    let plan = keptPlan(JO(), { id: 'JoH2' });
    const before = home(plan);
    plan = save(plan, { 'want.monthly': '2500' });
    const a = home(plan);
    expect(a.lines.find((x) => x[0] === 'want')[1]).toBe('You want £2,500 a month after tax, at today’s prices, from age 60.');
    expect(a.lines.find((x) => x[0] === 'head')[1]).toContain('£2,500 a month from 60');
    expect(a.key).not.toBe(before.key);
    // wanting more from the same pay-in needs at least as much going in
    expect(a.result.enough.atLevel.totalPct).toBeGreaterThanOrEqual(before.result.enough.atLevel.totalPct);
    plan = save(plan, { 'want.stopAge': '58' });
    const b = home(plan);
    expect(b.lines.find((x) => x[0] === 'want')[1]).toBe('You want £2,500 a month after tax, at today’s prices, from age 58.');
    expect(b.lines.find((x) => x[0] === 'head')[1]).toContain('£2,500 a month from 58');
    plan = save(plan, { 'want.stopAge': '65' });
    const c = home(plan);
    expect(c.lines.find((x) => x[0] === 'want')[1]).toBe('You want £2,500 a month after tax, at today’s prices, from age 65.');
    expect(c.lines.find((x) => x[0] === 'head')[1]).toContain('£2,500 a month from 65');
    // stopping seven years later than at 58 needs less going in (or is on course)
    const need = (H) => (H.result.verdict.band === 'yes' ? 0 : H.result.enough.atLevel ? H.result.enough.atLevel.totalPct : Infinity);
    expect(need(c)).toBeLessThan(need(b));
    // What you pay in reads the same: the want boxes and the verdict's own figures
    const page = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(page.want.fields.map((f) => f.shown)).toEqual(['2500', '65']);
    expect(page.verdict.key).toBe(c.key);
  }, 180000);
});

describe('one reach rule: when paying in alone cannot do it, every card says so the same way, and offers what can', () => {
  const PAT = () => ({ household: 'single', you: { pot: 45000, age: 52, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 31000, ownPct: 4, employerPct: 3 } },
    stop: { age: 60 }, spend: { kind: 'amount', amount: 2608 }, endAge: 95 });
  const allText = (r) => { const out = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (typeof x.text === 'string') out.push(x.text); else Object.values(x).forEach(walk); } }; walk(r.sentences); return out.join('\n'); };
  /** Every "£X a month" the words say, as numbers. */
  const monthlies = (t) => [...t.matchAll(/£([\d,]+) a month/g)].map((m) => +m[1].replace(/,/g, ''));

  it('Pat (52, £31,000, £45,000, 4% and 3%, £2,608 a month from 60): no card names a pay-in nobody could pay or a lump past the allowance; the ways that work are said in pounds', async () => {
    const r = answerB(PAT(), { today: READ_ON, futures: 1000, seed: 0, detail: 'answer' });
    expect(r.verdict.band).toBe('no');
    expect(r.reach.payIn).toBe(false);
    const t = allText(r);
    // Pat's whole pay a month: 31,000 ÷ 12 = £2,583.33; the yearly allowance a month: 60,000 ÷ 12 = £5,000. No pay-in said
    // is above either but what goes in now (7% of £31,000: 31,000 × 0.07 ÷ 12 = £180.83, said £181) and the amounts to spend
    for (const x of monthlies(t)) expect(x <= 2608 || x === 1046, `£${x} a month in: ${t}`).toBe(true);
    // four years' allowance: 4 × 60,000 = £240,000; no lump above it is offered
    expect(r.levers.oneOff === null || r.levers.oneOff.amount <= 240000).toBe(true);
    expect(t).not.toMatch(/£6,720|£6,670|£603,000/);
    expect(r.sentences.verdictLine.text).toMatch(/; paying in more on its own cannot get there\.$/);
    expect(r.sentences.enoughHead.text).toBe('Paying in more on its own cannot get there for £2,608 a month from 60.');
    // the way that works on its own, in pounds: spending less, at the amount the answer found lasts
    expect(r.levers.spendLess).not.toBe(null);
    const spend = r.levers.spendLess.spend;
    expect(spend).toBeLessThan(2608);
    expect(r.sentences.enoughLine.text).toMatch(new RegExp('^Spending less could: £' + spend.toLocaleString('en-GB').replace(/,/g, ',') + ' a month from 60, paying in as now, and your money lasts as long as you do \\d+ times in 20\\.'));
    expect(r.sentences.enoughLine.text).not.toMatch(/below|one-off/);
    // the figures under the answer: what goes in now, never the pay-in past the reach
    const { answerTiles } = await import('../../../src/v7/state/pictures.js');
    const st = { answers: { b: { status: 'final', result: r } } };
    const tiles = answerTiles(st, 'b').map((x) => x.id);
    expect(tiles).not.toContain('enough');
    expect(tiles).not.toContain('enoughShare');
  }, 90000);

  it('Pat\'s plan: the home and What you pay in say the same reach words, with no "below" to point at', () => {
    const plan = keptPlan(PAT(), { id: 'PatR1' });
    const page = savingOf([entry(plan)], plan.id, { today: READ_ON });
    const v = page.verdict;
    expect(v.ok).toBe(true);
    const r = answerB(v.inputs, { today: READ_ON, futures: 1000, seed: 0, detail: 'answer', ...v.env });
    expect(r.reach.payIn).toBe(false);
    expect(r.sentences.enoughHead.text).toBe('Paying in more on its own cannot get there for £2,608 a month from 60.');
    expect(r.sentences.enoughLine.text).toMatch(/^Spending less could: £[\d,]+ a month from 60, /);
    expect(allText(r)).not.toMatch(/ways below|£6,720|£603,000/);
  }, 90000);
});

describe('the full view\'s "Am I on course?" says the same as the plan\'s home, from the same reader', async () => {
  const { h, render } = await import('preact');
  const { App } = await import('../../../src/v7/App.jsx');
  const { reduce } = await import('../../../src/v7/state/reduce.js');
  const { A } = await import('../../../src/v7/state/actions.js');
  const { wanted } = await import('../../../src/v7/effects/saver.js');
  const { viewFor } = await import('../../../src/v7/effects/planSource.js');
  const { stateWith } = await import('./_plans.js');
  const { paintSaverAnswer } = await import('../../../src/ui/saverAnswerUi.js');
  /** The home block's lines as drawn, its answer run as the simple view's runner runs it. */
  const homeLines = (plan) => {
    const s = stateWith([entry(plan)], '#/plan/' + plan.id, { today: READ_ON, source: 'window', session: 'nobody' });
    const st = { ...s, plans: { ...s.plans, view: viewFor(s) } };
    const v = wanted(st);
    const result = answerB(v.inputs, { today: READ_ON, futures: 1000, seed: 0, trace: false, detail: 'answer', ...v.env });
    const held = reduce(reduce(st, { type: A.SAVER_WORKING, key: v.key }), { type: A.SAVER_FINAL, key: v.key, result });
    const el = document.createElement('div');
    render(h(App, { state: held, dispatch: () => {} }), el);
    return [...el.querySelectorAll('[data-testid="plan.home.saver"] [data-line]')].map((x) => [x.getAttribute('data-line'), x.textContent]);
  };
  /** The full view's Accumulation tab after "Work it out", as index.html calls it. */
  const fullLines = async (plan) => {
    document.body.innerHTML = '<div id="acOnTrack"></div>';
    const block = await paintSaverAnswer(document, { listScenariosAsync: async () => [copy(plan)], getActiveScenarioId: async () => plan.id, now: () => noon(READ_ON) });
    expect(block && block.state).toBe('answer');
    const out = [...document.querySelectorAll('#acOnTrack [data-line]')].map((x) => [x.getAttribute('data-line'), x.textContent]);
    expect(document.querySelector('[data-testid="ac.saver.change"]').getAttribute('href')).toMatch(new RegExp('#/plan/' + plan.id + '/saving$'));
    document.body.innerHTML = '';
    return out;
  };
  const save = (plan, typed) => { const p = savingPatch(plan, typed, { today: READ_ON }); expect(p.ok).toBe(true); return applyPatch(plan, p.patch); };

  it('Jo, then £2,500, then stopping at 65, then a £10,000 pot recorded on top: the two views say every line the same', async () => {
    let plan = keptPlan(JO(), { id: 'JoF1' });
    const steps = [
      (p) => p,
      (p) => save(p, { 'want.monthly': '2500' }),
      (p) => save(p, { 'want.stopAge': '65' }),
      // £10,000 more in the pension today: 22,000 + 10,000 = £32,000 typed as the pot today
      (p) => save(p, { potNow: '32000' })
    ];
    let before = null;
    for (const step of steps) {
      plan = step(plan);
      const home = homeLines(plan);
      const full = await fullLines(plan);
      expect(full).toEqual(home);
      expect(home.length).toBeGreaterThanOrEqual(4);
      if (before) expect(home).not.toEqual(before);
      before = home;
    }
    // the last: £2,500 from 65, and the pot the plan reads is the £32,000 typed
    expect(before.find((x) => x[0] === 'want')[1]).toBe('You want £2,500 a month after tax, at today’s prices, from age 65.');
    expect(saverInputsOf(plan, { today: READ_ON }).inputs.you.pot).toBe(32000);
  }, 240000);
});

describe('keeping from "What is my pot worth a month?" when reached from a saver\'s answer', async () => {
  const { fresh, run, set, answered } = await import('../shell/_open.js');
  const { reduce } = await import('../../../src/v7/state/reduce.js');
  const { A } = await import('../../../src/v7/state/actions.js');
  const { parsedDraft, keepView } = await import('../../../src/v7/state/select.js');
  const { answerC } = await import('../../../src/answers/c/answer.js');
  const { KEEP } = await import('../../../src/v7/copy/keep.js');
  const { h, render } = await import('preact');
  const { KeepPanel } = await import('../../../src/v7/components/KeepPanel.jsx');
  const jo = (spend) => run(fresh({ today: READ_ON }), set('b', 'you.age', '33'), set('b', 'you.pot', '22,000'), set('b', 'you.payIn.kind', 'share'), set('b', 'you.payIn.pay', '38,000'),
    set('b', 'you.payIn.ownPct', '5'), set('b', 'you.payIn.employerPct', '3'), set('b', 'stop.age', '60'), set('b', 'spend.amount', spend));

  it('Jo wants £2,500 from 60 and opens the pot-worth question from her answer: Keep names what she wants and what paying in as now supports; either kept plan says what to pay in', () => {
    let st = answered(jo('2,500'), 'b', { status: 'ok', saving: [{ who: 'you', payIn: { total: 253.33 } }] });
    st = reduce(st, { type: A.DRAFT_CARRY, from: 'b', to: 'c' });
    const parsed = parsedDraft(st, 'c');
    expect(parsed.ok).toBe(true);
    const result = answerC(parsed.inputs, { today: READ_ON, futures: 100, seed: 0, detail: 'answer' });
    st = answered(st, 'c', result);
    const v = keepView(st, 'c');
    expect(v.take).toMatchObject({ wanted: 'b' });
    const el = document.createElement('div');
    render(h(KeepPanel, { state: st, q: 'c', dispatch: () => {} }), el);
    const tried = el.querySelector('[data-testid="c.action.save.tried"]').textContent;
    const level = el.querySelector('[data-testid="c.action.save.level"]').textContent;
    expect(tried).toBe('Keep: £2,500 a month (what you want)');
    expect(level).toMatch(/^Keep: £[\d,]+ a month \(what paying in as now supports, at Balanced\)$/);
    expect(el.textContent).toContain(KEEP.take.wantedNote);
    // the plan kept with what Jo wants: its own "What you pay in" tests £2,500 from 60, on her share as typed
    const seed = buildPlanSeed({ source: 'c', result, env: { today: READ_ON, appVersion: 'test' }, name: 'Jo', createdAt: READ_ON + 'T10:00:00.000Z', take: 'tried' });
    const plan = upgradeScenario(copy(seedToScenario(seed, READ_ON).yours), { now: noon(READ_ON) }).scenario;
    plan.id = 'JoK1';
    const page = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(page.verdict.ok).toBe(true);
    expect(page.verdict.notes.stopAge).toBe('60');
    expect(Math.abs(saverInputsOf(plan, { today: READ_ON }).notes.aimMonthly - 2500)).toBeLessThanOrEqual(1);
    // 38,000 × 3% ÷ 12 = £95 from the employer, kept as typed
    expect(plan.accumulationTool.settings.employerMonthly).toBe(95);
  }, 90000);

  it('back from the pot-worth question to "Am I saving enough?" or "When can I stop?": the pay-in goes as typed, a share with its three boxes', () => {
    let st = answered(jo('2,000'), 'b', { status: 'ok', saving: [{ who: 'you', payIn: { total: 253.33 } }] });
    st = reduce(st, { type: A.DRAFT_CARRY, from: 'b', to: 'c' });
    st = answered(st, 'c', { status: 'ok', payIn: { byPerson: [{ total: 253.33 }] } });
    for (const to of ['a', 'b']) {
      const back = reduce(st, { type: A.DRAFT_CARRY, from: 'c', to });
      expect(back.draft[to].values).toMatchObject({ 'you.payIn.kind': 'share', 'you.payIn.pay': '38,000', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3' });
    }
  }, 30000);
});

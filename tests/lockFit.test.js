/**
 * The lock asks one question first (7.12.0, the moving brief D5/S5): a way of drawing that cannot be paid for is not locked.
 * One reading, PlanCommit.lockFitOf, from the run the lock already makes; both views say the same sentence. A plan locked that
 * way before says so at the top of its document.
 *
 * Fictional Alex: a gilt ladder that costs £540,000 against pots of £480,000 when work stops. By hand: 540,000 − 480,000 =
 * £60,000 short (the ladder's `spare` is −60,000).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { lockFitOf } from '../src/services/PlanCommit.js';
import { lockPatch } from '../src/answers/plan/lock.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { lockFitWords } from '../src/ui/plannerWords.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { App } from '../src/v7/App.jsx';
import { visibleText } from './v7/render/checkScreen.js';
import { corpus, entryOf, TODAY, noon, stateWith } from './v7/plan/_plans.js';
import { samMovePlan, SAM_MOVE_TODAY } from './v7/plan/_samMove.js';

const LADDER_SHORT = { affordable: false, plan: { total: 540000, spare: -60000 } };
const SENTENCE = 'This plan cannot be locked as it is. Its gilt ladder costs £540,000. Your pension and ISA when you stop come to £480,000: £60,000 short. You can lower the income, or choose another way of drawing, and lock it then.';

describe('lockFitOf: one reading of whether the way of drawing can be paid for', () => {
  it('a ladder that costs more than the pots: the cost, the pots and the short, worked from the run', () => {
    expect(lockFitOf({ p: { isa: 40000, isaHold: false }, r: LADDER_SHORT })).toEqual({ ladder: true, cost: 540000, pots: 480000, short: 60000, isa: true, reason: null });
    expect(lockFitOf({ p: {}, r: { affordable: true, plan: { total: 1, spare: 1 } } })).toBe(null);
    expect(lockFitOf({ p: {}, r: { affordable: false, shortfall: 12000, reason: 'the pot runs out at 80' } })).toMatchObject({ ladder: false, short: 12000, reason: 'the pot runs out at 80' });
  });
  it('the full view says the same sentence the simple view does', () => {
    expect(lockFitWords(lockFitOf({ p: { isa: 40000 }, r: LADDER_SHORT }))).toBe(SENTENCE);
  });
});

describe('the lock refuses a way of drawing that cannot be paid for, and writes nothing', () => {
  const raw = Object.values(corpus()).find((p) => !(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked));
  const plan = entryOf(raw, TODAY).plan;
  const now = noon(TODAY);
  const run = runForDocument(plan, { today: TODAY });

  it('at an income that fits, it locks as before', () => {
    expect(lockPatch(plan, { now, run, entries: [{ plan }] }).ok).toBe(true);
  });
  it('the simple view\'s lock page says the one sentence, with the ways on', () => {
    const st = stateWith([{ plan }], '#/plan/' + plan.id + '/lock', { today: TODAY });
    const state = { ...st, ui: { ...st.ui, saveProblem: { planId: String(plan.id), problem: 'unaffordable', detail: { fit: lockFitOf({ p: { isa: 40000 }, r: LADDER_SHORT }) } } } };
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state, dispatch: () => {} }), root);
    const box = root.querySelector('[data-testid="plan.lock.problem"]');
    expect(box.textContent).toContain(SENTENCE);
    expect(root.querySelector('[data-testid="plan.lock.unaffordable.income"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.lock.unaffordable.ways"]')).not.toBe(null);
  });
  it('a ladder £60,000 short is refused, with the fit carried for the words', () => {
    const P = lockPatch(plan, { now, run: { ...run, p: { ...run.p, isa: 40000, isaHold: false }, r: { ...run.r, ...LADDER_SHORT } }, entries: [{ plan }] });
    expect(P).toMatchObject({ ok: false, errors: { plan: 'unaffordable' }, patch: {} });
    expect(P.fit).toMatchObject({ cost: 540000, pots: 480000, short: 60000 });
  });
});

describe('a plan locked that way before says so at the top of its document', () => {
  const plan = samMovePlan();
  const doc = { ...plan.planDocument, strategy: { ...plan.planDocument.strategy, r: { ...plan.planDocument.strategy.r, affordable: false, plan: { ...plan.planDocument.strategy.r.plan, total: 540000, spare: -60000 } } } };
  const BANNER = 'This plan was locked when its gilt ladder cost £60,000 more than its pots. So not every year below is bought. You can unlock it, lower the income, and lock it again.';
  it('the full view\'s plan document', () => {
    const el = document.createElement('div');
    el.innerHTML = planDocumentHtml(doc, {});
    expect(el.textContent).toContain(BANNER);
    el.innerHTML = planDocumentHtml(plan.planDocument, {});
    expect(el.textContent).not.toContain('This plan was locked when');
  });
  it('"Your plan as locked" in the simple view', () => {
    const p = { ...plan, planDocument: doc };
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state: stateWith([{ plan: p }], '#/plan/' + p.id + '/plan', { today: SAM_MOVE_TODAY }), dispatch: () => {} }), root);
    expect(visibleText(root).replace(/\s+/g, ' ')).toContain(BANNER);
  });
});

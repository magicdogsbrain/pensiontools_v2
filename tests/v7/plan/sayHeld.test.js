/**
 * "This is how I want to hold it" (7.12.0, the moving brief D4/S3/S4): one press and a confirm on the move page, with no test
 * run first. It writes only `phases` (the agreement Phases.js already reads), never `planAmendments`; the page then says what
 * is held beside the plan, with no list to buy and no pace. "Take this back" puts the move back. The tested agreement on
 * "Your review" is unchanged.
 *
 * Fictional Sam (tests/v7/plan/_samMove.js), Moving, with nothing tested. By hand: TA30 is part bought (10,000 of 40,000
 * units) and TB31 is not held, so 2 of the 2 gilts the plan uses are not bought in full.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { sayHeldPatch, agreeWithdrawPatch, agreePatch } from '../../../src/answers/plan/agree.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { stateWith, entryOf, corpus, noon } from './_plans.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { samMovePlan, SAM_MOVE_TODAY as TODAY } from './_samMove.js';

const AT = '2026-11-16T10:00:00.000Z';
const pageText = (plan) => { const root = document.createElement('div'); root.id = 'app'; render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: TODAY }), dispatch: () => {} }), root); return visibleText(root).replace(/\s+/g, ' '); };

describe('"This is how I want to hold it": one press, no test first', () => {
  const plan = samMovePlan();

  it('is offered on the move page while Moving', () => {
    expect(moveOf([{ plan }], plan.id, { today: TODAY }).sayHeld).toMatchObject({ can: true });
    const t = pageText(plan);
    expect(t).toContain('Want to hold it your own way? You can say that what you hold now is how you want it. This page then shows what you hold beside your plan, with no list to buy.');
  });

  it('writes only the agreement in phases; no amendment, no test run', () => {
    const p = sayHeldPatch(plan, { today: TODAY, at: AT });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['phases']);
    expect(p.patch.phases.moving.agreed).toMatchObject({ at: AT, entryAt: AT });
    expect(plan.planAmendments == null || Array.isArray(plan.planAmendments)).toBe(true);
  });

  it('then the page is what is held: no pace, and the gilts not bought in full said once', () => {
    const p = sayHeldPatch(plan, { today: TODAY, at: AT });
    const after = { ...plan, ...p.patch };
    const V = moveOf([{ plan: after }], after.id, { today: TODAY });
    expect(V.mode).toBe('held');
    expect(V.pace).toBe(null);
    const t = pageText(after);
    expect(t).toContain('On 16 November 2026 you said this is how you want to hold it.');
    expect(t).toContain('2 of the 2 gilts your plan uses are not bought in full. Those years are paid from what you hold instead, and its value can fall.');
    expect(homeOf([{ plan: after }], after.id, { today: TODAY }).tools.find((x) => x.id === 'move').result.text).toBe('You hold it your own way (said 16 November 2026).');
    // and taking it back puts the move back
    const w = agreeWithdrawPatch(after, { at: '2026-11-16T11:00:00.000Z' });
    expect(w.ok).toBe(true);
    const back = { ...after, phases: w.patch.phases };
    expect(moveOf([{ plan: back }], back.id, { today: TODAY }).mode).toBe('move');
  });

  it('a saver outside the window is refused, and the tested route still needs its test', () => {
    const saver = entryOf(corpus()['05-saver-committed'], TODAY).plan;
    expect(sayHeldPatch(saver, { today: TODAY, at: AT })).toMatchObject({ ok: false, problem: 'notNow' });
    expect(agreePatch(plan, { today: TODAY, at: AT, held: null })).toMatchObject({ ok: false, problem: 'noResult' });
  });

  it('a gilt-ladder plan is never offered "Try another mix" on its home', () => {
    expect(homeOf([{ plan }], plan.id, { today: TODAY }).change.map((c) => c.id)).not.toContain('tryMix');
  });

  it('a gilt-ladder plan\'s own page offers no "Try another mix" either; a locked pot plan still does', () => {
    // the home and the plan page give one list of tries: a ladder's way of drawing is gilts and cash years, it has no mix
    const planPage = (p) => { const root = document.createElement('div'); root.id = 'app'; render(h(App, { state: stateWith([{ plan: p }], '#/plan/' + p.id + '/plan', { today: TODAY }), dispatch: () => {} }), root); return visibleText(root).replace(/\s+/g, ' '); };
    const t = planPage(plan);
    expect(t).toContain('Try another way (nothing changes)');
    expect(t).not.toContain('Try another mix');
    const pots = entryOf(corpus()['04-buckets-running'], TODAY).plan;
    expect(pots.planDocument.strategy.id).toBe('buckets-in-order');
    expect(planPage(pots)).toContain('Try another mix (nothing changes)');
  });

  it('the full view offers the same press, and says the same once it is said', () => {
    const full = (p) => { const mi = moveInputs(p, { now: noon(TODAY) }); return transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings, held: transitionHeld(p, p.holdings, noon(TODAY)) }); };
    expect(full(plan)).toContain('data-on-click="askSayHeld()">This is how I want to hold it</button>');
    const after = { ...plan, ...sayHeldPatch(plan, { today: TODAY, at: AT }).patch };
    const html = full(after);
    expect(html).toContain('On 16 November 2026 you said this is how you want to hold it.');
    expect(html).toContain('data-on-click="takeBackSayHeld()"');
  });
});

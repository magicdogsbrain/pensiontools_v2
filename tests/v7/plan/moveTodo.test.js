/**
 * The move as a thing to do (7.12.0, the moving brief S4): while Moving, inside the move window, with what is held listed and
 * the move not done, the home's To do says what is still to buy and how long is left — never "Nothing due" alone. Once the
 * person said this is how they want to hold it, or with nothing listed, there is no such to-do. The full view's banner says
 * the same thing, from the same list.
 *
 * Fictional Sam (tests/helpers/samMove.js), Moving: work stops in October 2027; today 16 November 2026.
 *   By hand: the buys come to £45,000 (TA30: 40,000 units at £60,000, 10,000 held, so 30,000 units, £45,000)
 *   + £30,000 (TB31, none held) + £27,400 (the two cash years, £26,000 + £26,400, less the £25,000 cash fund held)
 *   = £102,400. November 2026 to October 2027: 11 months.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { sayHeldPatch } from '../../../src/answers/plan/agree.js';
import { homeBannerOf } from '../../../src/ui/homeBannerUi.js';
import { stateWith } from './_plans.js';
import { samMovePlan, SAM_MOVE_TODAY as TODAY } from './_samMove.js';

const homeText = (plan) => { const root = document.createElement('div'); root.id = 'app'; render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id, { today: TODAY }), dispatch: () => {} }), root); return visibleText(root).replace(/\s+/g, ' '); };
const itemsOf = (plan) => homeOf([{ plan }], plan.id, { today: TODAY }).todo.items;

describe('Moving: the move is on the home\'s To do', () => {
  it('says what is still to buy and the months left, with the way to the move page', () => {
    const plan = samMovePlan();
    const it0 = itemsOf(plan)[0];
    expect(it0).toMatchObject({ id: 'move.toBuy', pid: 'P.move', slots: expect.objectContaining({ toBuy: '£102,400', windowLeft: '11 months' }) });
    expect(it0.button).toMatchObject({ id: 'openMove', href: '#/plan/' + plan.id + '/move' });
    const t = homeText(plan);
    expect(t).toContain('Moving to your plan’s mix: £102,400 still to buy, 11 months left');
  });

  it('the full view\'s banner says the same', () => {
    const plan = samMovePlan();
    const b = homeBannerOf([{ plan }], plan.id, { today: TODAY });
    expect(b.html).toContain('Moving to your plan’s mix: £102,400 still to buy, 11 months left.');
  });

  it('is not a to-do once the person said this is how they want to hold it', () => {
    const plan = samMovePlan();
    const after = { ...plan, ...sayHeldPatch(plan, { today: TODAY, at: '2026-11-16T10:00:00.000Z' }).patch };
    expect(itemsOf(after).map((x) => x.id)).not.toContain('move.toBuy');
  });

  it('is not a to-do with nothing listed under What you hold', () => {
    const plan = samMovePlan({ lines: [] });
    expect(itemsOf(plan).map((x) => x.id)).not.toContain('move.toBuy');
  });
});

/**
 * "This is how I want to hold it" opens its confirm (7.12.0): the press asked to open "sayHeldConfirm", which the shell did
 * not know it could open, so it refused and nothing happened on the screen. Fictional Sam (tests/v7/plan/_samMove.js).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { OPENABLE } from '../../../src/v7/state/actions.js';
import { stateWith } from './_plans.js';
import { samMovePlan, SAM_MOVE_TODAY } from './_samMove.js';

describe('"This is how I want to hold it"', () => {
  it('its confirm is one of the things that open', () => {
    expect(OPENABLE).toContain('sayHeldConfirm');
  });
  it('the press opens the confirm, with Yes and No', () => {
    const plan = samMovePlan();
    let state = stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: SAM_MOVE_TODAY });
    const root = document.createElement('div'); root.id = 'app';
    const draw = () => render(h(App, { state, dispatch: (a) => { state = reduce(state, a); } }), root);
    draw();
    root.querySelector('[data-testid="plan.move.sayHeld.button"]').click();
    draw();
    expect(root.querySelector('[data-testid="plan.move.sayHeld.confirm"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.move.sayHeld.yes"]')).not.toBe(null);
  });
});

/**
 * 7.12.0 — living on a locked ladder, "Your plan's mix", What you hold's reading and the home read ONE reading
 * (answers/plan/held.js heldLadder). The second readers go: "What is covered, year by year" says nothing in the held phase,
 * the move's own sentences about rungs, lines and cash are gone, and the home never says a year is "not yet covered".
 * Moving (nothing accepted) reads exactly as it did on main: the snapshot beside this file was written from main before the
 * change (_movingSnapshot.js).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { heldLadder } from '../../../src/answers/plan/held.js';
import { gapsOf } from '../../../src/answers/plan/gaps.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { visibleText } from '../render/checkScreen.js';
import { noon, stateWith } from './_plans.js';
import { TODAY, alexLivingRaw, joLivingRaw, living } from './_alexLiving.js';
import { movingReadings } from './_movingSnapshot.js';

const flat = (t) => t.replace(/\s+/g, ' ').trim();
const simplePage = (plan) => {
  const s = stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: TODAY });
  const root = document.createElement('div');
  render(h(App, { state: s, dispatch: () => {} }), root);
  return root;
};
const fullTab = (plan) => {
  const mi = moveInputs(plan, { now: noon(TODAY) });
  const div = document.createElement('div');
  div.innerHTML = transitionHtml({ doc: plan.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: plan.holdings,
    gaps: ((transitionHeld(plan, plan.holdings, noon(TODAY)) || {}).gaps || null), held: transitionHeld(plan, plan.holdings, noon(TODAY)) });
  return div;
};

describe('Alex, living on the ladder: one reading', () => {
  const plan = living(alexLivingRaw());
  const h0 = heldLadder(plan, { today: TODAY });
  const v = moveOf([{ plan }], plan.id, { today: TODAY });

  it('the move page\'s held information is the one reading, and it carries no second reading of what is covered', () => {
    expect(v.mode).toBe('held');
    expect(v.heldInfo).toEqual(h0);
    expect(v.gaps).toBe(undefined);
    expect(v.standIn).toBe(undefined);
    expect(v.kept).toBe(undefined);
    expect(v.covered).toBe(undefined);
    expect(gapsOf(plan, { today: TODAY })).toBe(null);
  });

  it('the home says no year is "not yet covered", and its mix tile says 14 of 14 gilts held', () => {
    const home = homeOf([{ plan }], plan.id, { today: TODAY });
    expect(home.gap).toBe(undefined);
    expect(home.heldLess).toBe(undefined);
    const tile = home.tools.find((t) => t.id === 'move') || home.steps.find((t) => t.id === 'move');
    expect(tile.result.text).toBe('14 of 14 gilts held');
  });

  it('the full view\'s tab and the simple view\'s page say the page alike', () => {
    const simple = simplePage(plan).querySelector('[data-section="heldLadder"]');
    const full = fullTab(plan).querySelector('#heldLadder');
    expect(simple).not.toBe(null);
    expect(full).not.toBe(null);
    expect(flat(visibleText(full))).toBe(flat(visibleText(simple)));
  });

  it('neither view draws the old lists, the gaps, the order sheet or the keep test while living', () => {
    const simple = flat(visibleText(simplePage(plan)));
    const full = flat(visibleText(fullTab(plan)));
    for (const t of [simple, full]) for (const w of ['What is covered, year by year', 'not yet covered', 'Held for them', 'Already held', 'Order sheet', 'Gilts to buy', 'not yet tested', 'I accept this risk']) expect(t.includes(w), w).toBe(false);
  });
});

describe('Jo, living on the ladder with less than the cash years need', () => {
  it('the home says it once, with the figure the page says', () => {
    const plan = living(joLivingRaw());
    const home = homeOf([{ plan }], plan.id, { today: TODAY });
    expect(home.gap).toBe(undefined);
    // the cash years need 34,000 × 5/12 + 0 + 33,000 = 47,167; Jo's pension holds £5,000
    expect(home.heldLess).toMatchObject({ less: '£42,167' });
    expect(home.heldLess.href).toBe('#/plan/' + plan.id + '/move');
  });
});

describe('Moving, nothing accepted: exactly as on main', () => {
  const want = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/plan/heldOneReader.moving.json'), 'utf8'));
  const got = movingReadings();
  it.each(Object.keys(want))('%s', (name) => {
    expect(got[name]).toEqual(want[name]);
  });
});

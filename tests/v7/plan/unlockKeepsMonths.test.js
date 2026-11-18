/**
 * 7.12.0 round 3 (walker 6, decision 10) — unlocking keeps the months recorded, and the pages say so. Kim unlocked to raise
 * her spending, as the site told her to; the unlock dialog said her recorded months were kept, then the simple home said
 * "Nothing recorded to read against the plan yet" and Month by month "Months are recorded once the plan is locked". Now the
 * home says the months are kept, with what they took, and Month by month says the last month recorded. Fictional plan: the
 * corpus's pots retiree (04), six months recorded, April to September 2026, £2,600 a month before tax.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { unlockPatch } from '../../../src/answers/plan/lock.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { visibleText } from '../render/checkScreen.js';
import { corpus, entryOf, stateWith } from './_plans.js';
import { deriveStage } from '../../../src/services/LifeStage.js';

const TODAY = '2026-10-02';
const setPath = (o, path, v) => { const ks = path.split('.'); let x = o; for (const k of ks.slice(0, -1)) { x[k] = x[k] && typeof x[k] === 'object' ? { ...x[k] } : {}; x = x[k]; } x[ks[ks.length - 1]] = v; };
function unlocked() {
  const raw = JSON.parse(JSON.stringify(Object.values(corpus()).find((p) => p.id === 'Td4VyS7nHg2McXe8WuFa')));
  const plan = entryOf(raw, TODAY).plan;
  const U = unlockPatch(plan, { now: new Date(2026, 9, 2, 12) });
  expect(U.ok).toBe(true);
  const after = JSON.parse(JSON.stringify(raw));
  for (const [k, v] of Object.entries(U.patch)) { const top = k.split('.')[0]; after[top] = after[top] && typeof after[top] === 'object' ? JSON.parse(JSON.stringify(after[top])) : after[top]; setPath(after, k, v); }
  return entryOf(after, TODAY).plan;
}

describe('a plan unlocked to change, with six months recorded', () => {
  const plan = unlocked();
  // 6 × 2,600 = 15,600 taken before tax, April to September 2026
  const KEPT = 'Unlocked to change. Your 6 recorded months are kept: £15,600 taken before tax (April to September 2026). Lock the plan again to carry on recording.';
  it('the home says the months are kept, with what they took, never "Nothing recorded"', () => {
    const H = homeOf([{ plan }], plan.id, { today: TODAY });
    expect(H.where.map((b) => b.result && b.result.text)).toContain(KEPT);
    const root = document.createElement('div');
    render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id, { today: TODAY }), dispatch: () => {} }), root);
    const t = visibleText(root).replace(/\s+/g, ' ');
    expect(t).toContain(KEPT);
    expect(t).not.toContain('Nothing recorded to read against the plan yet');
  });
  it('Month by month says the last month recorded and the way on, never "Months are recorded once the plan is locked"', () => {
    const pg = planPage([{ plan }], plan.id, 'month', { today: TODAY });
    const m = pg.steps.find((s) => s.id === 'month');
    expect(m.result.text).toBe('September 2026 recorded. Lock the plan again to record more.');
  });
  it('the full view\'s banner says the months are kept, never "still a draft … start recording months"', () => {
    const st = deriveStage(plan, new Date(2026, 9, 2, 12));
    expect(st.banner.text).toBe('Your plan is unlocked to change, and the months you recorded are kept. Lock it again from the Stress tester\'s Settings page to carry on recording.');
  });
});

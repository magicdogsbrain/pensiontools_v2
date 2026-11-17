/**
 * A plan of your own kept while you are still saving is not offered a lock as it is kept (7.12.0; the second walk, walker 1:
 * Jo, 33, was offered "Lock this plan?" beside "Sign in", before settling what she wants or pays). What you want and what
 * goes in stay easy to change; the lock is on its own page. A plan kept for someone who has stopped keeps its lock link.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen } from '../c/_c.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);

describe('kept from "Am I saving enough?"', () => {
  const base = replaced(load('b', 'answer-B5-couple'));
  const made = { type: ACT.KEEP_MADE, q: 'b', id: 'guest-a1b2c3d4', name: 'Ours', where: 'window', partnerId: 'guest-e5f6g7h8', partnerName: 'Ours · partner' };
  it('your own plan still saving: "What you pay in" and the check-in, no lock', () => {
    const root = renderScreen(reduce(base, { ...made, saverId: 'guest-a1b2c3d4' }));
    expect(one(root, 'b.keep.saving')).not.toBe(null);
    expect(one(root, 'b.keep.lock')).toBe(null);
  });
  it('you have stopped and your partner saves: your drawing plan keeps its lock link', () => {
    const root = renderScreen(reduce(base, { ...made, saverId: 'guest-e5f6g7h8' }));
    expect(one(root, 'b.keep.lock').getAttribute('href')).toBe('#/plan/guest-a1b2c3d4/lock');
  });
});

/**
 * 7.12.0 round 3 (walker 7) — a figure from the plan as locked is never "Check this figure: it is from 1 July 2026". Alex's
 * plan (fictional, _alexLiving.js) was locked on 1 July 2026; on 16 November its income step is read from the plan as locked.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { planPage } from '../../../src/answers/plan/read.js';
import { TODAY, alexLivingRaw, living } from './_alexLiving.js';

describe('Where you are on a locked plan', () => {
  it('a line from the plan as locked is not stale; a record older than three months still would be', () => {
    const plan = living(alexLivingRaw());
    const pg = planPage([{ plan }], plan.id, 'where', { today: TODAY });
    const lines = pg.steps.find((s) => s.id === 'where').lines;
    const locked = lines.filter((l) => l.source && l.source.kind === 'locked');
    expect(locked.length).toBeGreaterThan(0);
    for (const l of locked) expect(l.source.stale, l.id).toBe(false);
  });
});

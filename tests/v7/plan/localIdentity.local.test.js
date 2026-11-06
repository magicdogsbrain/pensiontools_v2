/**
 * Gate 1's local half (research/v7/switch-readiness.md §1, gate 1 (a)): a plan kept locally — never committed, the
 * repository is public — gives the same figures through V7's run as through the planner's. The committed corpus has this
 * check (L2, lastsRun.test.js); this runs the same check (_l2.js) over every plan in tests/fixtures/local/ (git-ignored;
 * see tests/localPlans.local.test.js and scripts/export-plan-snippet.md for how a plan gets there).
 *
 *   npx vitest run tests/v7/plan/localIdentity.local.test.js                         on today's date
 *   LOCAL_PLAN_DAY=2026-10-02 npx vitest run tests/v7/plan/localIdentity.local.test.js on a chosen day
 *
 * Each *.json there (one scenario document, or an array of them; *.pinned.json are localPlans' pins and are left alone) is
 * brought up to date in memory as the plan source brings it (entryOf: upgradeScenario) and run both ways on the same day,
 * so the only thing that can differ is the code. Nothing is written and nothing is printed of the plan but its file name.
 *
 * With no local files this file reports one skipped test and passes, so it is safe in every run and in CI.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { entryOf } from './_plans.js';
import { isLocked, expectLastsAsPlanner } from './_l2.js';

const LOCAL_DIR = resolve(process.cwd(), 'tests', 'fixtures', 'local');
const files = existsSync(LOCAL_DIR) ? readdirSync(LOCAL_DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.pinned.json')).sort() : [];

/** The day both runs are read on: LOCAL_PLAN_DAY, or today's local date. */
function day() {
  const chosen = process.env.LOCAL_PLAN_DAY;
  if (chosen) { if (!/^\d{4}-\d{2}-\d{2}$/.test(chosen)) throw new Error('LOCAL_PLAN_DAY must be YYYY-MM-DD'); return chosen; }
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

if (!files.length) {
  describe('local plan, V7 against the planner (local only)', () => {
    it.skip('no plan in tests/fixtures/local/ — export one (scripts/export-plan-snippet.md) to run gate 1 on it', () => {});
  });
} else {
  const today = day();
  describe.each(files)('local plan, V7 against the planner (local only) — %s', (file) => {
    const raw = JSON.parse(readFileSync(join(LOCAL_DIR, file), 'utf8'));
    const docs = (Array.isArray(raw) ? raw : [raw]).filter((d) => d && typeof d === 'object');
    it('holds at least one scenario document', () => {
      expect(docs.length).toBeGreaterThan(0);
    });
    docs.forEach((doc, i) => {
      it(`plan ${i + 1} of ${docs.length}${isLocked(doc) ? ' (locked)' : ''}: "Does it last?" is the planner's, to the pound, on ${today}`, () => {
        const entry = entryOf(doc, today);
        expect(entry.failed, 'the plan could not be brought up to date').toBe(false);
        expectLastsAsPlanner(entry.plan, { today });
      }, 120_000);
    });
  });
}

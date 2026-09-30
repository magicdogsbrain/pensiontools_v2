/**
 * The owner's REAL plan as the main safety fixture — local only, never committed (the repository is public).
 *
 * Put an export of the plan in tests/fixtures/local/ (git-ignored; see scripts/export-plan-snippet.md). Each
 * *.json there (one scenario document, or an array of them) gets the same four checks as the synthetic corpus
 * (tests/planCorpus.test.js), plus PINNED ANSWERS: its checksums, stage, where-am-I reading and strategy
 * headline, written next to it as <name>.pinned.json the first time and compared on every run after.
 *
 *   PIN_OWNER_PLAN=1 npx vitest run tests/ownerPlan.local.test.js     write (or deliberately re-write) the pins
 *   npx vitest run tests/ownerPlan.local.test.js                      compare against them
 *
 * The pin stores the instant it was taken and every later run evaluates the plan AT THAT INSTANT, on the
 * corpus's frozen market data — so the only thing that can move an answer is the code. Re-export and re-pin
 * when the plan itself changes (a new month recorded, an unlock), not to make a red test green.
 *
 * With no local files this file reports one skipped test and passes, so it is safe in every run and in CI.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const LOCAL_DIR = resolve(__dirname, 'fixtures', 'local');
const RUNNER = resolve(__dirname, 'fixtures', 'plans', 'run.mjs');
const PIN = process.env.PIN_OWNER_PLAN === '1';
const files = existsSync(LOCAL_DIR) ? readdirSync(LOCAL_DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.pinned.json')).sort() : [];

/** Evaluate one local file in the pinned child process (clock, zone and market data fixed — see fixtures/plans/clock.mjs). */
function evaluate(file, now) {
  const dir = mkdtempSync(join(tmpdir(), 'owner-plan-'));
  try {
    const out = join(dir, 'out.json');
    execFileSync(process.execPath, [RUNNER, '--now', now, '--out', out, join(LOCAL_DIR, file)], { stdio: ['ignore', 'ignore', 'inherit'] });
    return JSON.parse(readFileSync(out, 'utf8'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

if (!files.length) {
  describe('owner plan (local only)', () => {
    it.skip('no plan in tests/fixtures/local/ — export one with scripts/export-plan-snippet.md to switch this net on', () => {});
  });
} else {
  describe.each(files)('owner plan (local only) — %s', (file) => {
    const pinPath = join(LOCAL_DIR, file.replace(/\.json$/, '.pinned.json'));
    const pinned = existsSync(pinPath) ? JSON.parse(readFileSync(pinPath, 'utf8')) : null;
    // Pinning takes the answers as of now; comparing replays the instant the pin was taken.
    const now = PIN || !pinned ? new Date().toISOString() : pinned.now;
    let run = null;

    beforeAll(() => { run = evaluate(file, now); }, 180000);

    const problems = (check) => Object.entries(run.plans).flatMap(([key, p]) => p.problems.filter((x) => x.check === check || x.check === 0).map((x) => key + ': ' + x.msg));

    it('holds at least one scenario document', () => {
      expect(Object.keys(run.plans).length).toBeGreaterThan(0);
    });
    it('(1) survives normalizeScenario and a second pass changes nothing', () => {
      expect(problems(1)).toEqual([]);
    });
    it('(2) builds a sim config and one strategy evaluation runs clean (no NaN / undefined in the headline)', () => {
      expect(problems(2)).toEqual([]);
    });
    it('(3) a locked plan keeps its checksum, its records and a byte-identical plan document across normalise + load migrations', () => {
      expect(problems(3)).toEqual([]);
    });
    it('(4) holdings normalise without loss', () => {
      expect(problems(4)).toEqual([]);
    });
    it(PIN ? 'pinned answers: WRITTEN now (PIN_OWNER_PLAN=1)' : 'pinned answers: unchanged since they were pinned', () => {
      const answers = { now: run.now, market: run.market, plans: Object.fromEntries(Object.entries(run.plans).map(([k, p]) => [k, p.record])) };
      if (PIN) {
        writeFileSync(pinPath, JSON.stringify(answers, null, 1) + '\n');
        return;
      }
      // No pin yet and not asked to write one: fail rather than pass silently — an unpinned plan is no net.
      expect(pinned, 'no pinned answers for ' + file + ' — run once with PIN_OWNER_PLAN=1 to write ' + pinPath).not.toBeNull();
      expect(answers.market, 'the corpus market data (tests/fixtures/plans/market) was re-pinned after these answers were taken — re-pin with PIN_OWNER_PLAN=1 and review the diff').toEqual(pinned.market);
      expect(answers.plans).toEqual(pinned.plans);
    });
  });
}

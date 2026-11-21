/**
 * Step F3, fix round 2 (lead4.md D11, R6): "When could I stop?" has ONE function, answer A's whole-life function, and ONE
 * input gatherer (src/reading/whenStop.js whenStopOf), used by both views.
 *   - every parity fixture still saving: the simple view's "When can I afford to stop work?" link opens A with the plan's
 *     figures (saving.js askFillOf → draft/load), and the inputs and env A then runs on are exactly the ones the full view's
 *     "When could I retire?" hands its worker (whenStopOf);
 *   - a plan that has stopped, or has no income, is not asked;
 *   - the full view's own spin is gone: no RetireSweep, no 'sweep' job; the page and the worker run answer A.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { whenStopOf } from '../../src/reading/whenStop.js';
import { WHEN_STOP_RUN } from '../../src/reading/runs.js';
import { askFillOf } from '../../src/answers/plan/saving.js';
import { reduce } from '../../src/v7/state/reduce.js';
import { A } from '../../src/v7/state/actions.js';
import { parsedDraft, planMixOf } from '../../src/v7/state/select.js';
import { stateWith } from '../v7/plan/_plans.js';
import { answerA } from '../../src/answers/a/answer.js';
import { whenStopHtml, whenStopNotAsked } from '../../src/ui/whenStopHtml.js';
import { A as COPY_A } from '../../src/v7/copy/a.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const root = process.cwd();

describe('when could I stop: one gatherer, both views', () => {
  const asked = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      const entries = plans.map((p) => ({ plan: p, newer: false, failed: false }));
      const w = whenStopOf(plan, { today: PARITY_DAY, plans: entries });
      const fill = askFillOf(entries, plan.id, { today: PARITY_DAY });
      if (!w.ok) { expect(fill.a, 'not asked in either view').toBeUndefined(); return; }
      asked.push(f.key);
      expect(w.inputs.stop).toEqual({ kind: 'ages' });
      // the simple view: A opened from the plan's home
      expect(fill.a).toBeTruthy();
      const s = reduce(stateWith(entries, '#/plan/' + plan.id, { today: PARITY_DAY }), { type: A.DRAFT_LOAD, q: 'a', values: fill.a.values, ...(fill.a.mixes ? { mixes: fill.a.mixes } : {}) });
      const parsed = parsedDraft(s, 'a');
      expect(parsed.ok).toBe(true);
      expect(parsed.inputs, 'the same inputs in both views').toEqual(w.inputs);
      // the env the simple view's run hands A at its ages step (effects/run.js envFor + planMixOf) is the full view's
      const simpleEnv = { today: PARITY_DAY, futures: WHEN_STOP_RUN.futures, seed: WHEN_STOP_RUN.seed, trace: false, detail: 'all', ...(planMixOf(s, 'a') || {}) };
      expect(w.env, 'the same env in both views').toEqual(simpleEnv);
    });
  }
  it('the savers among the fixtures are asked', () => {
    expect(asked).toEqual(expect.arrayContaining(['saver-draft', 'saver-payin', 'saver-locked-pots', 'saver-locked-ladder', 'mover-holdings']));
  });

  it('the full view runs answer A on whenStopOf, never its own spin', () => {
    expect(existsSync(join(root, 'src', 'services', 'RetireSweep.js'))).toBe(false);
    const page = readFileSync(join(root, 'index.html'), 'utf8');
    expect(page).not.toMatch(/RetireSweep/);
    const at = page.indexOf('window.runWhenStop = async function');
    expect(at).toBeGreaterThan(0);
    const body = page.slice(at, page.indexOf('\n    };', at));
    expect(body).toMatch(/whenStopOf\(/);
    expect(body).toMatch(/runInWorker\('whenStop'/);
    expect(body).not.toMatch(/acSweepIncome|acSweepTarget|getStressSettingsAsync/);
    const worker = readFileSync(join(root, 'src', 'workers', 'engineWorker.js'), 'utf8');
    expect(worker).not.toMatch(/'sweep'|RetireSweep/);
    expect(worker).toMatch(/type === 'whenStop'[\s\S]{0,400}answerA\(payload\.inputs, \{ \.\.\.payload\.env/);
  });

  it('the full view draws A\'s every-age rows with the simple view\'s columns and words', () => {
    const f = FIXTURES.find((x) => x.key === 'saver-draft');
    const plans = f.plans().map(up);
    const plan = plans.find((p) => p.id === f.subject);
    const w = whenStopOf(plan, { today: PARITY_DAY, plans: plans.map((p) => ({ plan: p })) });
    const out = answerA(w.inputs, { ...w.env, futures: 40 });   // fewer futures: the drawing, not the figures
    expect(out.status).not.toBe('invalid');
    const html = whenStopHtml(out);
    expect((html.match(/<tr data-age=/g) || []).length).toBe(out.ages.length);
    for (const label of [COPY_A.answer.chartAge, COPY_A.answer.tablePot]) expect(html).toContain(label);
    expect(whenStopHtml({ ages: [] })).toBe('');
    expect(whenStopNotAsked('noAim')).toMatch(/No income set yet/);
  }, 120000);
});

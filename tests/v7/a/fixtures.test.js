/**
 * The four worked fixtures of question A (step 4 brief 3 and 6, P2): A1 stopping soon, A2 a couple before 57, A3 forced
 * out with part-time work, A4 stopping at 55 from ISA money. Each file holds the inputs, the env, the sentence drafts,
 * what it must carry, the pinned answer (filled by the first green run) and an `approved` line for the owner. The test
 * fails if a sentence or a displayed figure changes, and if the file has no `approved` block. Set V7_PIN=1 to re-pin
 * after a change the owner has accepted.
 *
 * Each runs through checkAnswerA, and in a child process under TZ=UTC and TZ=Europe/London: the same answer.
 * The inputs themselves are checked today (they must be valid A inputs); the answers need the real engine.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { answerA, SCHEMA_A, TEST_ENV, checkAnswerA, ENGINE_READY, allSentences, scopesForA, COUNTDOWN, FIXTURE_FILES } from './invariants.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { bannedHits } from '../render/checkScreen.js';

const DIR = resolve(process.cwd(), 'tests/v7/fixtures/a');
const fixtures = FIXTURE_FILES.map((f) => ({ file: f, path: resolve(DIR, f), data: JSON.parse(readFileSync(resolve(DIR, f), 'utf8')) }));

/** What is pinned: everything but the trace and the engine version (which moves with every release). */
function pinnable(answer) {
  const { trace, ...rest } = answer;
  return JSON.parse(JSON.stringify({ ...rest, basis: { ...rest.basis, engineVersion: '(any)' } }));
}

/** Differences: exact on everything except raw simulated money, which may move by a penny between machines. */
function diffs(actual, pinned, path = '', out = []) {
  const RAW = /(^|\.)(fromPension|fromSavings|fromPots|fromWork|tax|takeHome|statePension|finalSalary|monthlyAfterTax)$|guaranteed\./;
  if (typeof actual === 'number' && typeof pinned === 'number') {
    const tol = RAW.test(path) && !/shown|monthly\.|yearly\./.test(path) ? 0.02 : 0;
    if (Math.abs(actual - pinned) > tol + 1e-9) out.push(`${path}: ${actual} (pinned ${pinned})`);
  } else if (Array.isArray(actual) && Array.isArray(pinned)) {
    if (actual.length !== pinned.length) out.push(`${path}: ${actual.length} items (pinned ${pinned.length})`);
    else actual.forEach((x, i) => diffs(x, pinned[i], `${path}[${i}]`, out));
  } else if (actual && pinned && typeof actual === 'object' && typeof pinned === 'object') {
    for (const k of [...new Set([...Object.keys(actual), ...Object.keys(pinned)])].sort()) diffs(actual[k], pinned[k], path ? `${path}.${k}` : k, out);
  } else if (actual !== pinned) out.push(`${path || '(answer)'}: ${JSON.stringify(actual)} (pinned ${JSON.stringify(pinned)})`);
  return out;
}

describe('the four fixtures of question A: the inputs', () => {
  it('exist, name what they are, and are valid inputs of SCHEMA_A', () => {
    for (const fx of fixtures) {
      expect(existsSync(fx.path)).toBe(true);
      expect(fx.data.id).toMatch(/^A[1-4]$/);
      expect(fx.data.approved).toBeTypeOf('object');
      const r = checkInputs(SCHEMA_A, fx.data.inputs, { ...TEST_ENV, ...fx.data.env });
      expect(r.ok, `${fx.file}: ${JSON.stringify(r.errors)}`).toBe(true);
    }
    expect(fixtures[1].data.inputs.household).toBe('couple');
    expect(fixtures[2].data.inputs.stop.age).toBe(fixtures[2].data.inputs.you.age);        // A3 stops today
    expect(fixtures[2].data.inputs.partTime.has).toBe(true);
    expect(fixtures[3].data.inputs.stop.age).toBeLessThan(57);                              // A4 stops before the pension opens
  });

  it('the drafts and expected texts carry no banned word and no countdown', () => {
    for (const fx of fixtures) {
      const scopes = scopesForA(fx.data.inputs);
      // a draft's {…} is a figure still to come, or " | " between the forms it may take
      const filled = (t) => t.replace(/\{([^}]*)\}/g, (_m, inner) => (inner.includes(' | ') ? inner.split(' | ').join('. ') : '9'));
      for (const t of [...(fx.data.drafts || []).map(filled), ...(fx.data.expect.texts || [])]) {
        expect(COUNTDOWN.test(t), `${fx.file}: ${t}`).toBe(false);
        expect(bannedHits(t, scopes, { context: 'the worst 1 in 10 the best 1 in 10' }), `${fx.file}: ${t}`).toEqual([]);
      }
    }
  });
});

describe.skipIf(!ENGINE_READY)('the four fixtures of question A: the answers', () => {
  for (const fx of fixtures) {
    describe(`${fx.data.id} — ${fx.data.name}`, () => {
      const env = { ...TEST_ENV, ...fx.data.env, trace: false };
      const answer = answerA(fx.data.inputs, env);

      it('passes every rule', () => {
        expect(answer.status).toBe(fx.data.expect.status);
        const f = checkAnswerA(answer, fx.data.inputs, env);
        expect(f, f.join('\n')).toEqual([]);
      });

      it('matches the pinned answer: sentences letter for letter, displayed figures exactly', () => {
        const now = pinnable(answer);
        if (process.env.V7_PIN === '1' || !fx.data.pinned) {
          writeFileSync(fx.path, JSON.stringify({ ...fx.data, pinned: now }, null, 2) + '\n');
          fx.data.pinned = now;
        }
        const d = diffs(now, fx.data.pinned);
        expect(d, d.join('\n')).toEqual([]);
      });

      it('carries the figures and words the fixture expects, and none it must not', () => {
        for (const [key, value] of Object.entries(fx.data.expect.values || {})) {
          const got = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);
          expect(got, key).toEqual(value);
        }
        const all = allSentences(answer).map((s) => s.text).join('\n');
        for (const text of fx.data.expect.texts || []) expect(all, text).toContain(text);
        for (const text of fx.data.expect.never || []) expect(all.toLowerCase(), text).not.toContain(text.toLowerCase());
      });

      it('is the same answer in a child process under TZ=UTC and TZ=Europe/London', () => {
        const code = `import { answerA } from '${resolve(process.cwd(), 'src/answers/a/answer.js')}';
          const r = answerA(${JSON.stringify(fx.data.inputs)}, ${JSON.stringify(env)});
          process.stdout.write(JSON.stringify(r));`;
        for (const TZ of ['UTC', 'Europe/London']) {
          const out = execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ }, maxBuffer: 64 * 1024 * 1024 }).toString();
          expect(pinnable(JSON.parse(out))).toEqual(pinnable(answer));
        }
      }, 60000);
    });
  }
});

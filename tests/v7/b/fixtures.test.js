/**
 * The five B fixtures (step 4 brief 3 and 6, P3): B1 my number, B2 can I ease off (on course), B3 a late start,
 * B4 young and stopping before 57, B5 a couple. Each file holds the inputs, the env, what the fixture is for (`expect`),
 * the pinned answer (filled by the first green run) and an `approved` block for the owner. The test fails if a sentence
 * or a displayed figure changes, and if the file has no `approved` block. Set V7_PIN=1 to re-pin after a change the
 * owner has accepted.
 *
 * Each runs through checkAnswerB, and in a child process under TZ=UTC and TZ=Europe/London: the same answer.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { TEST_ENV, answerB, checkAnswerB, sentencesOf, COUNTDOWN } from './invariants.js';
import { pot as potText } from '../../../src/answers/shared/format.js';

const DIR = resolve(process.cwd(), 'tests/v7/fixtures/b');
const FILES = ['B1-my-number.json', 'B2-coast.json', 'B3-late-start.json', 'B4-young.json', 'B5-couple.json'];
const fixtures = FILES.map((f) => ({ file: f, path: resolve(DIR, f), data: JSON.parse(readFileSync(resolve(DIR, f), 'utf8')) }));

/** What is pinned: everything but the trace and the engine version (which moves with every release). */
function pinnable(answer) {
  const { trace, ...rest } = answer;
  return JSON.parse(JSON.stringify({ ...rest, basis: { ...rest.basis, engineVersion: '(any)' } }));
}

/** Differences: exact on everything except raw simulated money, which may move by a penny between machines. */
function diffs(actual, pinned, path = '', out = []) {
  const RAW = /(^|\.)(fromPension|fromSavings|fromPots|fromWork|tax|takeHome|statePension|finalSalary|monthlyAfterTax)$|guaranteed\./;
  if (typeof actual === 'number' && typeof pinned === 'number') {
    const tol = RAW.test(path) && !/shown/.test(path) ? 0.02 : 0;
    if (Math.abs(actual - pinned) > tol + 1e-9) out.push(`${path}: ${actual} (pinned ${pinned})`);
  } else if (Array.isArray(actual) && Array.isArray(pinned)) {
    if (actual.length !== pinned.length) out.push(`${path}: ${actual.length} items (pinned ${pinned.length})`);
    else actual.forEach((x, i) => diffs(x, pinned[i], `${path}[${i}]`, out));
  } else if (actual && pinned && typeof actual === 'object' && typeof pinned === 'object') {
    for (const k of [...new Set([...Object.keys(actual), ...Object.keys(pinned)])].sort()) diffs(actual[k], pinned[k], path ? `${path}.${k}` : k, out);
  } else if (actual !== pinned) out.push(`${path || '(answer)'}: ${JSON.stringify(actual)} (pinned ${JSON.stringify(pinned)})`);
  return out;
}

describe('the five B fixtures', () => {
  for (const fx of fixtures) {
    describe(`${fx.data.id} — ${fx.data.name}`, () => {
      const env = { ...TEST_ENV, ...fx.data.env, trace: true };
      const answer = answerB(fx.data.inputs, env);

      it('passes every rule', () => {
        expect(answer.status).toBe(fx.data.expect.status);
        const f = checkAnswerB(answer, fx.data.inputs);
        expect(f, f.join('\n')).toEqual([]);
      });

      it('has an approved block for the owner', () => {
        expect(fx.data.approved).toBeTypeOf('object');
        expect(fx.data.approved).not.toBeNull();
        if (process.env.REQUIRE_APPROVAL) expect(fx.data.approved.by).toBeTypeOf('string');
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

      it('carries what the fixture is for', () => {
        for (const [key, value] of Object.entries(fx.data.expect.values || {})) {
          const got = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);
          expect(got, key).toEqual(value);
        }
        const all = sentencesOf(answer).map((s) => s.text).join('\n');
        for (const text of fx.data.expect.texts || []) expect(all, text).toContain(text);
        if (answer.number && !answer.onCourse) expect(answer.sentences.head.text).toContain(potText(answer.number.careful));
      });

      it('never counts down: ages, never a length of time to wait', () => {
        for (const s of sentencesOf(answer)) expect(s.text, s.id).not.toMatch(COUNTDOWN);
      });

      it('is the same answer in a child process under TZ=UTC and TZ=Europe/London', () => {
        const code = `import { answerB } from '${resolve(process.cwd(), 'src/answers/b/answer.js')}';
          const r = answerB(${JSON.stringify(fx.data.inputs)}, ${JSON.stringify({ ...env, trace: false })});
          process.stdout.write(JSON.stringify(r));`;
        for (const TZ of ['UTC', 'Europe/London']) {
          const out = execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ }, maxBuffer: 64 * 1024 * 1024 }).toString();
          expect(pinnable(JSON.parse(out))).toEqual(pinnable({ ...answer, trace: undefined }));
        }
      });
    });
  }

  it('the fixture files exist and are the five people of the brief', () => {
    for (const f of FILES) expect(existsSync(resolve(DIR, f))).toBe(true);
    expect(fixtures.map((f) => f.data.id)).toEqual(['B1', 'B2', 'B3', 'B4', 'B5']);
    expect(fixtures[4].data.inputs.household).toBe('couple');
    expect(fixtures[3].data.inputs.stop.age).toBeLessThan(57);
  });
});

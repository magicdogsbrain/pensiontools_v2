/**
 * The three worked fixtures (test plan 4; build brief 6, P2): F1 the forum guest, F2 a couple, F3 already retired.
 * Each file holds the inputs, the env, the pinned answer (numbers filled by the first green run) and an
 * `approved` line for the owner. The test fails if a sentence or a displayed figure changes, and if the file
 * has no `approved` block. Set V7_PIN=1 to re-pin after a change the owner has accepted.
 *
 * The three run through checkAnswer, and in a child process under TZ=UTC and TZ=Europe/London: the same answer.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { money } from '../../../src/answers/shared/format.js';

const DIR = resolve(process.cwd(), 'tests/v7/fixtures/c');
const FILES = ['F1-forum-guest.json', 'F2-couple.json', 'F3-retired.json'];
const fixtures = FILES.map((f) => ({ file: f, path: resolve(DIR, f), data: JSON.parse(readFileSync(resolve(DIR, f), 'utf8')) }));

/** What is pinned: everything but the trace and the engine version (which moves with every release). */
function pinnable(answer) {
  const { trace, ...rest } = answer;
  return JSON.parse(JSON.stringify({ ...rest, basis: { ...rest.basis, engineVersion: '(any)' } }));
}

/** Differences: exact on everything except raw simulated money, which may move by a penny between machines. */
function diffs(actual, pinned, path = '', out = []) {
  const RAW = /(^|\.)(fromPension|fromSavings|fromPots|tax|takeHome|statePension|finalSalary|monthlyAfterTax)$|guaranteed\./;
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

const RETIRED_BANNED = [/when you retire/i, /until you retire/i, /when you stop work/i, /years to go/i, /months to go/i, /plan starts/i, /countdown/i, /to retirement/i, /\bin \d+ (years|months)\b/i, /stop work/i];

describe('the three worked fixtures', () => {
  for (const fx of fixtures) {
    describe(`${fx.data.id} — ${fx.data.name}`, () => {
      const env = { ...TEST_ENV, ...fx.data.env, trace: true };
      const answer = answerC(fx.data.inputs, env);

      it('passes every rule', () => {
        expect(answer.status).toBe(fx.data.expect.status);
        expect(checkAnswer(answer, fx.data.inputs)).toEqual([]);
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

      it('carries the figures the fixture expects', () => {
        for (const [key, value] of Object.entries(fx.data.expect.values || {})) {
          const got = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);
          expect(got, key).toBe(value);
        }
        for (const text of fx.data.expect.texts || []) {
          const all = [...Object.values(answer.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...answer.assumed, ...answer.warnings].map((s) => s.text).join('\n');
          expect(all, text).toContain(text);
        }
        expect(answer.sentences.head.text).toContain(money(answer.monthly.careful));
      });

      it('says nothing about stopping work or waiting, in any sentence', () => {
        const all = [...Object.values(answer.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...answer.assumed, ...answer.warnings].map((s) => s.text);
        for (const t of all) for (const re of RETIRED_BANNED) expect(t, `${re}`).not.toMatch(re);
      });

      it('is the same answer in a child process under TZ=UTC and TZ=Europe/London', () => {
        const code = `import { answerCReal } from '${resolve(process.cwd(), 'src/answers/c/answer.js')}';
          const r = answerCReal(${JSON.stringify(fx.data.inputs)}, ${JSON.stringify({ ...env, trace: false })});
          process.stdout.write(JSON.stringify(r));`;
        for (const TZ of ['UTC', 'Europe/London']) {
          const out = execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ }, maxBuffer: 64 * 1024 * 1024 }).toString();
          expect(pinnable(JSON.parse(out))).toEqual(pinnable(answer));
        }
      });
    });
  }

  it('the fixture files exist and name their inputs', () => {
    for (const f of FILES) expect(existsSync(resolve(DIR, f))).toBe(true);
    expect(fixtures[0].data.inputs).toEqual({ you: { pot: 250000, age: 58 } });
    expect(fixtures[1].data.inputs.household).toBe('couple');
    expect(fixtures[2].data.inputs.you.age).toBe(68);
  });
});

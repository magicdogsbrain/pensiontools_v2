/**
 * The worked fixtures of couples who stop work in different years (research/v7/couples-different-years.md 9.1, 9.3 P2,
 * 9.7 B1), across the three questions:
 *
 *   C  F5 — one of you stopped and drawing, the other stopping next year at 56 (the case the design must answer well);
 *      F6 — the one who has stopped has a pension that cannot be touched yet and little cash: the pay covers the gap, and
 *      the answer says from what age in a bad case.
 *   A  A5 — "I've already stopped": the answer is about your partner ("Yes — your partner could stop at 56").
 *   B  B6 — the same, "Am I saving enough?" about your partner.
 *
 * Each file holds the inputs, the env, what it must carry, the pinned answer (filled by the first green run), an
 * `approved` line for the owner and — where it has one — `swap`: the same household with the other of you at the keyboard,
 * which must give the same figures (`swap.same`). The test fails if a sentence or a displayed figure changes. Set
 * V7_PIN=1 to re-pin after a change the owner has accepted. Each runs through its question's own rules (the invariants
 * of C, A and B, the banned list among them), and in a child process under TZ=UTC and TZ=Europe/London: the same answer.
 *
 * The figures are made up, round and generic: nobody's own.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { answerC, checkAnswer } from '../c/invariants.js';
import { SCHEMA_C } from '../c/_c.js';
import { answerA, SCHEMA_A, checkAnswerA, allSentences, COUNTDOWN } from '../a/invariants.js';
import { answerB, checkAnswerB, sentencesOf } from '../b/invariants.js';
import { SCHEMA_B } from '../b/_b.js';

const ROOT = resolve(process.cwd(), 'tests/v7/fixtures');
const QUESTIONS = {
  c: { files: ['F5-couple-apart.json', 'F6-couple-apart-closed.json'], schema: SCHEMA_C, answer: answerC, file: 'src/answers/c/answer.js', fn: 'answerC',
    env: {}, rules: (r, inputs) => checkAnswer(r, inputs), sentences: allSentences },
  a: { files: ['A5-couple-already-stopped.json'], schema: SCHEMA_A, answer: answerA, file: 'src/answers/a/answer.js', fn: 'answerA',
    env: { detail: 'chart' }, rules: (r, inputs, env) => checkAnswerA(r, inputs, env), sentences: allSentences },
  b: { files: ['B6-couple-already-stopped.json'], schema: SCHEMA_B, answer: answerB, file: 'src/answers/b/answer.js', fn: 'answerB',
    env: { detail: 'answer' }, rules: (r, inputs) => checkAnswerB(r, inputs), sentences: sentencesOf }
};
const get = (o, key) => key.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);

/** What is pinned: everything but the trace and the engine version (which moves with every release). */
function pinnable(answer) {
  const { trace, ...rest } = answer;
  return JSON.parse(JSON.stringify({ ...rest, basis: { ...rest.basis, engineVersion: '(any)' } }));
}

/** Differences: exact on everything except raw simulated money, which may move by a penny between machines. */
function diffs(actual, pinned, path = '', out = []) {
  const RAW = /(^|\.)(fromPension|fromSavings|fromPots|fromWork|fromPay|tax|takeHome|statePension|finalSalary|monthlyAfterTax)$|guaranteed\./;
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

for (const [q, Q] of Object.entries(QUESTIONS)) {
  for (const file of Q.files) {
    const path = resolve(ROOT, q, file);
    const fx = JSON.parse(readFileSync(path, 'utf8'));
    describe(`${fx.id} — ${fx.name}`, () => {
      const env = { today: '2026-09-30', futures: 40, seed: 0, trace: false, ...Q.env, ...fx.env };
      const answer = Q.answer(fx.inputs, env);

      it('is a valid set of inputs, stops apart, and has an approved block for the owner', () => {
        const r = checkInputs(Q.schema, fx.inputs, env);
        expect(r.ok, JSON.stringify(r.errors)).toBe(true);
        expect(fx.approved).toBeTypeOf('object');
        expect(fx.approved).not.toBeNull();
        if (process.env.REQUIRE_APPROVAL) expect(fx.approved.by).toBeTypeOf('string');
        expect(answer.apart, 'each of you at your own stop').toBeTruthy();
      });

      it('passes every rule of its question', () => {
        expect(answer.status).toBe(fx.expect.status);
        const f = Q.rules(answer, fx.inputs, env);
        expect(f, Array.isArray(f) ? f.join('\n') : JSON.stringify(f)).toEqual([]);
      });

      it('matches the pinned answer: sentences letter for letter, displayed figures exactly', () => {
        const now = pinnable(answer);
        if (process.env.V7_PIN === '1' || !fx.pinned) {
          writeFileSync(path, JSON.stringify({ ...fx, pinned: now }, null, 2) + '\n');
          fx.pinned = now;
        }
        const d = diffs(now, fx.pinned);
        expect(d, d.join('\n')).toEqual([]);
      });

      it('carries the figures and words the fixture expects, and none it must not; never counts down', () => {
        for (const [key, value] of Object.entries(fx.expect.values || {})) expect(get(answer, key), key).toEqual(value);
        const all = Q.sentences(answer).map((s) => s.text).join('\n');
        for (const text of fx.expect.texts || []) expect(all, text).toContain(text);
        for (const text of fx.expect.never || []) expect(all.toLowerCase(), text).not.toContain(text.toLowerCase());
        for (const s of Q.sentences(answer)) expect(s.text, s.id).not.toMatch(COUNTDOWN);
      });

      if (fx.swap) {
        it(`either of you can be "you": ${fx.swap.note}`, () => {
          const other = Q.answer(fx.swap.inputs, env);
          expect(other.status).toBe(answer.status);
          for (const key of fx.swap.same) expect(get(other, key), key).toEqual(get(answer, key));
          // the first to stop is the other person, seen from the other chair
          expect(other.apart.first).toBe(answer.apart.first === 'you' ? 'partner' : 'you');
        });
      }

      it('is the same answer in a child process under TZ=UTC and TZ=Europe/London', () => {
        const code = `import { ${Q.fn} } from '${resolve(process.cwd(), Q.file)}';
          const r = ${Q.fn}(${JSON.stringify(fx.inputs)}, ${JSON.stringify(env)});
          process.stdout.write(JSON.stringify(r));`;
        for (const TZ of ['UTC', 'Europe/London']) {
          const out = execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ }, maxBuffer: 64 * 1024 * 1024 }).toString();
          expect(pinnable(JSON.parse(out))).toEqual(pinnable(answer));
        }
      }, 60_000);
    });
  }
}

/**
 * The answer worked out in Node, for "screen equals engine" and for the sameness run.
 *
 * It runs in a child process of plain Node, not inside Playwright's own module loader, so the answer code is
 * loaded exactly as the ordinary test suite loads it. Results are kept by their inputs for the length of the
 * worker process (in memory only, so a change to the answer code is never served from an old run).
 *
 *   answerInNode(inputs, env)            checked inputs (brief 4.1) → AnswerC
 *   answerFromDraft(values, env)         what was typed, by field path → AnswerC (through parseDraft, as the page does)
 *   answersInNode([{ inputs | draft, env }])   many at once, one child process
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

/** The date every browser test is pinned to (the corpus date), and the published run settings. */
export const TODAY = '2026-09-30';
export const FINAL_ENV = Object.freeze({ today: TODAY, futures: 1000, seed: 0, trace: false });
export const FIRST_ENV = Object.freeze({ today: TODAY, futures: 100, seed: 0, trace: false });

const CHILD = `
import { readFileSync } from 'node:fs';
const { answerC } = await import(${JSON.stringify(src('src/answers/c/answer.js'))});
const { SCHEMA_C } = await import(${JSON.stringify(src('src/answers/c/schema.js'))});
const { parseDraft } = await import(${JSON.stringify(src('src/answers/shared/validate.js'))});
const cases = JSON.parse(readFileSync(0, 'utf8'));
const out = cases.map((c) => {
  let inputs = c.inputs;
  if (c.draft) {
    const parsed = parseDraft(SCHEMA_C, c.draft, c.env);
    if (!parsed.ok) return { status: 'invalid', problems: Object.entries(parsed.errors).map(([field, messageId]) => ({ field, messageId })) };
    inputs = parsed.inputs;
  }
  return answerC(inputs, c.env);
});
process.stdout.write(JSON.stringify(out));
`;

const memory = new Map();
const keyOf = (c) => createHash('sha1').update(JSON.stringify(c)).digest('hex');
const kept = (key) => memory.get(key);
const keep = (key, value) => memory.set(key, value);

export function answersInNode(cases) {
  const list = cases.map((c) => ({ ...(c.draft ? { draft: c.draft } : { inputs: c.inputs }), env: { ...FINAL_ENV, ...(c.env || {}) } }));
  const keys = list.map(keyOf);
  const missing = list.map((c, i) => ({ c, i })).filter(({ i }) => kept(keys[i]) === undefined);
  if (missing.length) {
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
      cwd: REPO, input: JSON.stringify(missing.map((m) => m.c)), encoding: 'utf8', maxBuffer: 512 * 1024 * 1024,
      env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
    });
    if (run.status !== 0) throw new Error(`answerInNode: the answer could not be run in Node\n${run.stderr || run.error}`);
    const results = JSON.parse(run.stdout);
    missing.forEach((m, n) => keep(keys[m.i], results[n]));
  }
  return keys.map((k) => kept(k));
}

export const answerInNode = (inputs, env) => answersInNode([{ inputs, env }])[0];
export const answerFromDraft = (draft, env) => answersInNode([{ draft, env }])[0];

/** A value of the answer by its dotted key ('monthly.careful', 'phases.1.shown.fromPots'). */
export const get = (answer, key) => String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);

/** Raw money agrees within 1p, or one part in a thousand million, whichever is larger (test plan 9). */
export const near = (a, b) => Math.abs(a - b) <= Math.max(0.01, 1e-9 * Math.max(Math.abs(a), Math.abs(b)));

// Raw, unrounded money: the only figures allowed a tolerance. Everything else — every decision, every
// displayed figure, every sentence — must be exactly equal.
const RAW_MONEY = [
  /^phases\.\d+\.(takeHome|fromPension|fromSavings|fromPots|statePension|finalSalary|tax)$/,
  /^phases\.\d+\.byPerson\.\d+\.(statePension|finalSalary|fromPension|fromSavings|tax|takeHome)$/,
  /^guaranteed\.monthlyAfterTax$/,
  /^assumed\.\d+\.value$/,
  /^trace\./
];

/** Every difference between two answers, as text; an empty list means "the same answer". */
export function differences(a, b, path = '') {
  if (a === b) return [];
  if (typeof a === 'number' && typeof b === 'number') {
    if (RAW_MONEY.some((re) => re.test(path)) && near(a, b)) return [];
    return [`${path}: ${a} against ${b}`];
  }
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    const out = [];
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out.push(...differences(a[k], b[k], path ? `${path}.${k}` : k));
    return out;
  }
  return [`${path}: ${JSON.stringify(a)} against ${JSON.stringify(b)}`];
}

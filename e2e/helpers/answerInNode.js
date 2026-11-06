/**
 * The answer worked out in Node, for "screen equals engine" and for the sameness run.
 *
 * It runs in a child process of plain Node, not inside Playwright's own module loader, so the answer code is
 * loaded exactly as the ordinary test suite loads it. Results are kept by their inputs for the length of the
 * worker process (in memory only, so a change to the answer code is never served from an old run).
 *
 *   answerInNode(inputs, env, q)         checked inputs (brief 4.1) → the answer to question q ('c' by default)
 *   answerFromDraft(values, env, q)      what was typed, by field path → the answer (through parseDraft, as the page does)
 *   answersInNode([{ q?, inputs | draft, env }])   many at once, one child process
 *
 * A made-up market (step 4 closed forms, CF-S1–S3) cannot cross into a page or a worker as a function, so a case
 * names it as data — `env.market: { equity, inflation }`, the same yearly figures every year — and each side turns it
 * into `env.futureReturns` with `marketFrom` (Node here; the page in its own evaluate, by the same few lines).
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

/**
 * `env.market` → `env.futureReturns`: every year the same `equity` return and `inflation` (0 = flat prices, as the
 * closed forms have it; either may be a list by future). Kept as source text too, so the page can make the same function inside its own evaluate.
 */
export function marketFrom(env) {
  if (!env || !env.market) return env;
  const { market, ...rest } = env;
  // A figure, or a list read by future (future i takes entry i modulo its length): BF3's five flat and five falling.
  const at = (v, i) => (Array.isArray(v) ? v[i % v.length] : v);
  return {
    ...rest,
    futureReturns: (i, years) => {
      const equity = {};
      const inflation = {};
      for (let y = 0; y < years; y++) { equity[y] = Number(at(market.equity, i)) || 0; inflation[y] = Number(at(market.inflation, i)) || 0; }
      return { equity, inflation };
    }
  };
}
export const MARKET_FROM_SOURCE = marketFrom.toString();

const CHILD = `
import { readFileSync } from 'node:fs';
const { ANSWERS } = await import(${JSON.stringify(src('src/answers/index.js'))});
const { parseDraft } = await import(${JSON.stringify(src('src/answers/shared/validate.js'))});
const marketFrom = ${MARKET_FROM_SOURCE};
const cases = JSON.parse(readFileSync(0, 'utf8'));
const out = cases.map((c) => {
  const q = c.q || 'c';
  const env = marketFrom(c.env);
  let inputs = c.inputs;
  if (c.draft) {
    const parsed = parseDraft(ANSWERS[q].schema, c.draft, env);
    if (!parsed.ok) return { status: 'invalid', problems: Object.entries(parsed.errors).map(([field, messageId]) => ({ field, messageId })) };
    inputs = parsed.inputs;
  }
  return ANSWERS[q].answer(inputs, env);
});
process.stdout.write(JSON.stringify(out));
`;

const memory = new Map();
const keyOf = (c) => createHash('sha1').update(JSON.stringify(c)).digest('hex');
const kept = (key) => memory.get(key);
const keep = (key, value) => memory.set(key, value);

export function answersInNode(cases) {
  const list = cases.map((c) => ({ q: c.q || 'c', ...(c.draft ? { draft: c.draft } : { inputs: c.inputs }), env: { ...FINAL_ENV, ...(c.env || {}) } }));
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

export const answerInNode = (inputs, env, q = 'c') => answersInNode([{ q, inputs, env }])[0];
export const answerFromDraft = (draft, env, q = 'c') => answersInNode([{ q, draft, env }])[0];

/** A value of the answer by its dotted key ('monthly.careful', 'phases.1.shown.fromPots'). */
export const get = (answer, key) => String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);

/** Raw money agrees within 1p, or one part in a thousand million, whichever is larger (test plan 9). */
export const near = (a, b) => Math.abs(a - b) <= Math.max(0.01, 1e-9 * Math.max(Math.abs(a), Math.abs(b)));

// Raw, unrounded money: the only figures allowed a tolerance. Everything else — every decision, every
// displayed figure, every sentence — must be exactly equal. A's and B's phases sit under a row (`shown.phases`,
// `ages.3.phases`) as well as at the top (B's `phases`); the saving years' pots are held to the pound in the
// answer but are sums of many products, so they are compared as raw money too — while every sentence that
// shows one (rounded to £1,000) must still be letter for letter the same: a flipped rounding is caught there.
const RAW_MONEY = [
  /(^|\.)phases\.\d+\.(takeHome|fromPension|fromSavings|fromPots|statePension|finalSalary|tax|fromWork)$/,
  /(^|\.)phases\.\d+\.byPerson\.\d+\.(statePension|finalSalary|fromPension|fromSavings|tax|takeHome|fromWork)$/,
  /^guaranteed\.monthlyAfterTax$/,
  /^assumed\.\d+\.value$/,
  /^(savingsNeeded|outside)\.amount$/,
  /^saving\.\d+\.(potAtStop|paidIn)\./,
  /^trace\./
];

// Raw ratios worked out from such pots (a couple's share of the household, from the middling pots at the stop):
// never shown, and equal to one part in a thousand million — WebKit's Math.pow differs from V8's in the last digit.
const RAW_RATIO = [/^basis\.split\.\d+\.share$/];
const nearRatio = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-12);

/** Every difference between two answers, as text; an empty list means "the same answer". */
export function differences(a, b, path = '') {
  if (a === b) return [];
  if (typeof a === 'number' && typeof b === 'number') {
    if (RAW_MONEY.some((re) => re.test(path)) && near(a, b)) return [];
    if (RAW_RATIO.some((re) => re.test(path)) && nearRatio(a, b)) return [];
    return [`${path}: ${a} against ${b}`];
  }
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    const out = [];
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out.push(...differences(a[k], b[k], path ? `${path}.${k}` : k));
    return out;
  }
  return [`${path}: ${JSON.stringify(a)} against ${JSON.stringify(b)}`];
}

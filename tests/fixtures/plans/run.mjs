/**
 * Evaluate saved-plan JSON files with the four corpus checks, in the pinned environment (clock.mjs).
 *
 *   node tests/fixtures/plans/run.mjs --now <ISO instant> --out <result.json> <plan.json> [<plan.json> …]
 *
 * The tests spawn this rather than evaluating inside vitest: the answers depend on the time zone, and a
 * vitest worker thread cannot change its own. A file may hold one scenario document or an array of them
 * (an export of every plan in an account); each is reported under `<file name>` or `<file name>#<index>`.
 * Output: { now, market, plans: { key: { record, problems } } }.
 */
import { at } from './clock.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const args = process.argv.slice(2);
const take = (flag) => { const i = args.indexOf(flag); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const now = take('--now'), outFile = take('--out');
if (!now || !outFile || !args.length) { process.stderr.write('usage: run.mjs --now <ISO> --out <file> <plan.json>…\n'); process.exit(2); }

const { evaluatePlan, pinMarket } = await import('./checks.mjs');
at(now);
const out = { now, market: pinMarket(), plans: {} };
for (const file of args) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const base = basename(file).replace(/\.json$/, '');
  const docs = Array.isArray(data) ? data.map((d, i) => [base + '#' + i, d]) : [[base, data]];
  for (const [key, raw] of docs) {
    try { const { record, problems } = await evaluatePlan(raw, { name: key }); out.plans[key] = { record, problems }; }
    catch (e) { out.plans[key] = { record: null, problems: [{ check: 0, msg: 'evaluatePlan threw: ' + (e && e.stack ? e.stack : e) }] }; }
  }
}
writeFileSync(outFile, JSON.stringify(out));
process.exit(0);   // firebase keeps handles open

/**
 * Month by month worked out in Node, for "screen equals engine" (research/v7/months-in-v7.md §2; 7.2.0): the same pure reading
 * and writers the page and the one write file use (answers/plan/month.js monthOf, monthRecordPatch, taxYearPatch) on a plan
 * brought up to date in memory exactly as the plan source does it, in a child process of plain Node (the zone pinned, as the
 * plan corpus is).
 *
 *   monthInNode(rawPlan, today, typed, nowIso) → { view, record, taxYear }
 *     view      what the page says: the month, its tax year set up or not, the advice's figures, the fill's words and count
 *     record    monthRecordPatch's { ok, problem, patch, line }
 *     taxYear   taxYearPatch's { ok, problem, patch, line }
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { monthOf, monthRecordPatch, taxYearPatch } = await import(${JSON.stringify(src('src/answers/plan/month.js'))});
const { plan, today, typed, nowIso } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const v = monthOf([{ plan: up }], up.id, { today, typed });
const view = { month: v.month, monthWords: v.monthWords, setUpDone: v.setUpDone, year: v.year, advice: v.advice ? { pension: v.advice.pension, tax: v.advice.tax, afterTax: v.advice.afterTax } : null,
  offer: v.offer ? { words: v.offer.words, count: v.offer.count } : null, gap: v.gap, bankAfter: v.setUp ? v.setUp.bankTotal.after : null, prefilled: v.pots ? v.pots.prefillFrom : null };
const r = monthRecordPatch(up, typed, { today, nowIso });
const t = taxYearPatch(up, typed, { today });
process.stdout.write(JSON.stringify({ view, record: { ok: r.ok, problem: r.problem || null, patch: r.patch, line: r.line || null }, taxYear: { ok: t.ok, problem: t.problem || null, patch: t.patch, line: t.line || null } }));
`;

export function monthInNode(plan, today, typed = {}, nowIso = null) {
  const out = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], { input: JSON.stringify({ plan, today, typed, nowIso }), encoding: 'utf8', env: { ...process.env, TZ: 'Europe/London' }, maxBuffer: 64 * 1024 * 1024 });
  if (out.status !== 0) throw new Error('monthInNode: ' + out.stderr);
  return JSON.parse(out.stdout);
}

/**
 * Road step 11b's rows on the existing steps, worked out in Node for "screen equals engine" (research/v7/road-to-7.md step
 * 11b): the same pure readers and writers the pages and the one write file use — about.js staleOf, stalePatch and aboutPatch
 * (the out-of-date draft), income.js incomePatch and the lump sums' landing, spend.js spendOf's lumps and spendPatch — on a
 * plan brought up to date in memory exactly as the plan source does it, in a child process of plain Node.
 *
 *   rows11bInNode(rawPlan, today, { spDate, lump })   → { stale, income, spend }
 *     stale    staleOf's offer and stalePatch's { ok, patch, previous }; `update`: aboutPatch for the boxes the offer sets
 *     income   for spDate = text: incomePatch's { ok, patch, previous } and the landing of each lump sum card
 *     spend    for lump = index: the lump line's figures, its edits, and spendPatch's { ok, patch, previous } once they are typed
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { staleOf, stalePatch, aboutPatch } = await import(${JSON.stringify(src('src/answers/plan/about.js'))});
const { incomeOf, incomePatch } = await import(${JSON.stringify(src('src/answers/plan/income.js'))});
const { spendOf, spendPatch } = await import(${JSON.stringify(src('src/answers/plan/spend.js'))});
const { plan, today, spDate, lump } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const entries = [{ plan: up }];
const pick = ({ ok, patch, previous, line }) => ({ ok, patch, previous, line: line || null });
const out = { stale: null, income: null, spend: null };
const sd = staleOf(up, { today });
if (sd) {
  const typed = Object.fromEntries(sd.edits.map((e) => [e.path, e.value]));
  out.stale = { offer: sd, leave: pick(stalePatch(up, { today })), update: pick(aboutPatch(up, typed, { today })) };
}
if (typeof spDate === 'string') {
  const v = incomeOf(entries, up.id, { today });
  out.income = { write: pick(incomePatch(up, { spDate }, { today })), landings: v.lists.lumps.cards.map((c) => c.landing), dateShown: (v.fields.find((f) => f.path === 'spDate') || {}).shown || '' };
}
if (typeof lump === 'number') {
  const v = spendOf(entries, up.id, { today });
  const l = v.lumps[lump] || null;
  out.spend = l ? { line: { id: l.id, label: l.label, amount: l.amount, age: l.age, years: l.years, perYear: l.perYear, perYearValue: l.perYearValue }, edits: l.edits, write: l.edits ? pick(spendPatch(up, Object.fromEntries(l.edits.map((e) => [e.path, e.value])), { today })) : null, count: v.lumps.length } : { count: v.lumps.length };
}
process.stdout.write(JSON.stringify(out));
`;

export function rows11bInNode(plan, today, { spDate = null, lump = null } = {}) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, spDate, lump }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (r.status !== 0) throw new Error('rows11bInNode failed: ' + r.stderr);
  return JSON.parse(r.stdout);
}

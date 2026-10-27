/**
 * The budget on a saved plan and "What you pay in" worked out in Node, for "screen equals engine" (research/v7/road-to-7.md
 * step 11b): the same pure readers and writers the page and the one write file use (budget.js budgetOf, budgetPatch;
 * saving.js savingOf, savingPatch, recordPatch), on a plan brought up to date in memory exactly as the plan source does it,
 * in a child process of plain Node.
 *
 *   budgetInNode(rawPlan, today, { changes })   → { budget, changes }
 *     budget    budgetOf's totals, count, locked and the file text (BudgetModel.budgetToCsv, the planner's own)
 *     changes   for each change given (budget.js's change objects), budgetPatch's { ok, writes, line } on the plan as planted
 *   savingInNode(rawPlan, today, { typed, record })   → { saving, save, record }
 *     saving    savingOf's boxes (path → shown), ages, the last row of what the pot could be, the records count, the relief total
 *     save      for typed = { path: text }: savingPatch's { ok, patch, previous, line }
 *     record    for record = { 'record.month', 'record.pension', … }: recordPatch's { ok, patch, previous, line }
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { budgetOf, budgetPatch } = await import(${JSON.stringify(src('src/answers/plan/budget.js'))});
const { savingOf, savingPatch, recordPatch } = await import(${JSON.stringify(src('src/answers/plan/saving.js'))});
const { plan, today, changes, typed, record, what } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const entries = [{ plan: up }];
const out = {};
if (what === 'budget') {
  const b = budgetOf(entries, up.id, { today });
  out.budget = { totals: b.totals, count: b.count, locked: b.locked, csvText: b.csvText, groups: b.groups.map((g) => ({ tier: g.tier, lines: g.lines.map((l) => ({ id: l.id, label: l.label, amount: l.fields.amount.shown, period: l.period, typical: l.typical, sanity: l.sanity })) })) };
  out.changes = (changes || []).map((c) => { const p = budgetPatch(up, entries, c, { today }); return { ok: p.ok, writes: p.writes, line: p.line }; });
} else {
  const s = savingOf(entries, up.id, { today });
  const last = s.rows.length ? s.rows[s.rows.length - 1] : null;
  out.saving = { fields: Object.fromEntries(s.fields.map((f) => [f.path, f.shown])), ages: s.ages, last, recordsCount: s.recordsCount, locked: s.locked, relief: s.relief, mix: s.mix, rows: s.rows.length };
  out.save = typed ? (({ ok, patch, previous, line }) => ({ ok, patch, previous, line }))(savingPatch(up, typed, { today })) : null;
  out.record = record ? (({ ok, patch, previous, line }) => ({ ok, patch, previous, line }))(recordPatch(up, record, { today })) : null;
}
process.stdout.write(JSON.stringify(out));
`;

function inNode(input) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify(input), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (r.status !== 0) throw new Error('budgetInNode failed: ' + r.stderr);
  return JSON.parse(r.stdout);
}

export function budgetInNode(plan, today, { changes = [] } = {}) {
  return inNode({ what: 'budget', plan, today, changes });
}

export function savingInNode(plan, today, { typed = null, record = null } = {}) {
  return inNode({ what: 'saving', plan, today, typed, record });
}

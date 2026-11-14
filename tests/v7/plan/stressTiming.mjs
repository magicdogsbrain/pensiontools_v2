/**
 * The time each row of "Try the bad years" takes, in plain Node (the engine's own speed; a test runner's module
 * transform slows it by more than half again): the slowest corpus plan, with a line kept by choice so all eight rows run,
 * the faster of two tries of each row. Prints JSON { rows: { id: ms }, panel }. Run by stressPanelRun.slow.test.js;
 * also by hand: node tests/v7/plan/stressTiming.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { runStressRow } = await import(join(ROOT, 'src/answers/plan/stressPanelRun.js'));
const { rowsFor } = await import(join(ROOT, 'src/answers/plan/stressPanel.js'));
const { upgradeScenario } = await import(join(ROOT, 'src/firebase/scenarioMigration.js'));
const TODAY = '2026-10-02';
const now = new Date(2026, 9, 2, 12);
const plan = upgradeScenario(JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/plans/12-lumpy-db-gia.json'), 'utf8')), { now }).scenario;
plan.holdings = plan.holdings || { lines: [] };
plan.holdings.lines = [...(plan.holdings.lines || []), { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } }];
const rows = {};
for (const { id } of rowsFor(plan, { today: TODAY })) {
  const once = () => { const t = performance.now(); runStressRow(plan, { today: TODAY, row: id }); return performance.now() - t; };
  rows[id] = Math.round(Math.min(once(), once()));
}
console.log(JSON.stringify({ rows, panel: Object.values(rows).reduce((t, v) => t + v, 0) }));

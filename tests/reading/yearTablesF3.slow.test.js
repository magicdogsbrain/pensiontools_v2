/**
 * Step F3 (lead4.md D9): the year tables are ONE function's, for EVERY parity fixture. The simple view's "The years, one by
 * one" (runLasts → extrasView) and the full view's Drawdown and Glidepath pages (index.html planYearTables: the one test's
 * settings, plan and result — a locked ladder its document's — through yearTablesOf, drawn by src/ui/yearTableHtml.js) show
 * the same rows, the same columns and the same text in every cell: the plan's own length and its own price assumption,
 * whatever the full view's what-if boxes hold.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { runLasts } from '../../src/answers/plan/lastsRun.js';
import { extrasView } from '../../src/answers/plan/lasts.js';
import { contextFor } from '../../src/reading/context.js';
import { lastsInputOf, enginePlanOf } from '../../src/reading/gather.js';
import { stressTestStrategy } from '../../src/strategies/stressTest.js';
import { oneAnswer } from '../../src/services/OneAnswer.js';
import { documentLadder } from '../../src/services/LadderPosition.js';
import { yearTablesOf, yearTablesText, ASSUMED_PRICES } from '../../src/reading/yearTable.js';
import { yearTableHtml } from '../../src/ui/yearTableHtml.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;

/** The cells of a drawn table as { 'row|col': text }, read off the marks (data-row, data-col), as the parity sweep reads them. */
function cellsOf(html) {
  const out = {};
  for (const m of String(html).matchAll(/<td data-row="([^"]*)" data-col="([^"]*)">([^<]*)<\/td>/g)) out[m[1] + '|' + m[2]] = m[3].replace(/&amp;/g, '&');
  return out;
}
const simpleCells = (t) => Object.fromEntries((t ? t.rows : []).flatMap((r) => Object.entries(r.cells).map(([c, v]) => [r.key + '|' + c, v])));

/** The full view's way to the tables (index.html planYearTables after oneTestFor), with the page's own what-if boxes ignored. */
function fullTables(plan) {
  const ctx = contextFor(plan, { today: PARITY_DAY });
  const input = lastsInputOf(plan, ctx);
  const sid = input.strategyId;
  const locked = !!(plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
  const doc = locked ? plan.planDocument : null;
  const ladder = doc && documentLadder(doc, sid);
  let p, r;
  if (ladder && doc.strategy.p) { p = doc.strategy.p; r = doc.strategy.r; } else { p = enginePlanOf(input); r = stressTestStrategy(sid, p); }
  if (!oneAnswer(r, p)) return null;
  return yearTablesOf({ settings: input.settings, strategyId: sid, p, r, now: ctx.now });
}

describe('one year table, both views, every parity fixture', () => {
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      const out = runLasts(plan, { today: PARITY_DAY });
      const simple = extrasView(out.extras);
      const full = fullTables(plan);
      if (!simple || !simple.table) { expect(full ? yearTablesText(full).rows.length : 0, 'no table in the simple view: none in the full').toBe(0); return; }
      const text = yearTablesText(full);
      // the same columns, rows and cells: the full view's marked table read as the sweep reads it
      expect(text.cols).toEqual(simple.table.cols.map((c) => c.id));
      expect(cellsOf(yearTableHtml(text))).toEqual(simpleCells(simple.table));
      if (simple.floors) expect(cellsOf(yearTableHtml(text, { which: 'floors' }))).toEqual(simpleCells(simple.floors));
      // the plan's own length and price assumption
      expect(full.prices).toBe(ASSUMED_PRICES);
      if (text.kind === 'schedule') expect(text.rows.length).toBe(Math.max(1, Math.round(+out.extras.duration)) + 1);
    });
  }
});

describe('the full view draws its tables from the one function, never from its boxes', () => {
  const src = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  it('no table of its own: the schedule services are not called on the page', () => {
    expect(src).not.toMatch(/generateDrawdownSchedule\(|generateGlidepathSchedule\(/);
    expect(src).toMatch(/yearTablesOf\(\{ settings: t\.settings/);
  });
  it('the inflation and length boxes are read only for the what-if, which is drawn unmarked', () => {
    expect(src).not.toMatch(/getElementById\('(dd|gp)(Inflation|Duration)'\)\.value/);
    expect(src).toMatch(/yearTableHtml\(text, \{ marked: false \}\)/);
  });
});

/**
 * The parity ledger as a gate (square-one audit §5 item 3; the owner, 2 Oct 2026: "We NEED to have the same or better
 * optionally than V6 … In general - optional it must be at least v6. We must have Gogo, goslow and nogo years.").
 *
 * tests/v7/parity/ledger.json has a row for every thing a person can do or set in today's app and every key it saves.
 * This file fails when:
 *  - a key today's app saves (found from the code itself: harvest.js) has no row;
 *  - a strategy, or one of a strategy's dials, has no row;
 *  - a row says built but names no file (or a file that does not exist);
 *  - a row is retired without a release-note reason (and, for something a person sees or sets, without the owner);
 *  - a row names a key today's app does not have;
 *  - an income-shape option today's planner offers has no row, or is retired;
 *  - research/v7/parity-ledger.md is not the page ledger.json makes (run `node tests/v7/parity/write-md.mjs`).
 * The checks themselves are tested on broken copies of the ledger, so a check that stopped biting would be seen.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false,
  isLoggedIn: () => false
}));

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { harvestV6Keys, whereFound, fileExists, ROOT } from './harvest.js';
import { shapeProblems, coverage, rowsByKey, STATUSES, incomeShapeProblems, incomeShapeNotYet, waitsOf } from './check.js';
import { renderLedgerMarkdown, LEDGER_JSON, LEDGER_MD } from './render.js';
import { STRATEGY_IDS, listStrategies } from '../../../src/strategies/registry.js';
import { OWNED_KEYS, allowedKeys } from '../../../src/services/StrategyState.js';

const ledgerPath = join(ROOT, LEDGER_JSON);
const load = () => JSON.parse(readFileSync(ledgerPath, 'utf8'));
const copy = (v) => JSON.parse(JSON.stringify(v));
const env = { fileExists };

/**
 * The income shape today's planner offers (index.html "Your income shape", src/services/IncomeSchedule.js,
 * src/ui/incomeShapeGraphic.js). Each must have its own row, and none may be retired: the owner's rule of 2 Oct 2026.
 */
const INCOME_SHAPE_ROWS = [
  'income.steps',                // "from age X take £Y a year", as many steps as wanted
  'income.add-remove',           // + Add a step / remove one
  'income.decline',              // each step can fall by a real % a year, compounding
  'income.glide',                // or glide in a straight line to the next step's amount
  'income.phases',               // go-go, go-slow and no-go years, named and coloured
  'income.suggest',              // "Suggest go-slow & no-go steps": −15% from 75, −30% from 85, never below essentials
  'income.start-from-budget',    // "Start from my budget"
  'income.start-from-number',    // "or a number"
  'income.spending-figure',      // the spending figure itself, take-home
  'income.staircase',            // the staircase picture by age, a bar a year
  'income.staircase-motion',     // … easing from the old shape to the new one as the steps change
  'income.layers',               // State Pension and other income drawn as layers inside each year (the answer's picture)
  'income.layers-editing',       // … and while the steps are set, in the editor
  'income.budget-mark',          // the budget's total marked on the picture
  'income.markers',              // ▲ lump sums and ▼ one-off spends marked at their ages
  'income.essentials-line',      // a step below the budget's essentials turns orange
  'income.guaranteed-floor',     // a year below the guaranteed income is held at it (and the answer's note)
  'income.below-income-live',    // … said in the editor while the steps are set
  'income.budget-share',         // each later step as a % of the budget
  'income.first-step-net',       // the first step's take-home a month
  'income.lump-to-steps',        // a lump sum: "Add £X/yr to my income from age N"
  'inc.extra-spends',            // "+ Extra spend": a dated amount on top of the shape, for N years (review, 2 Oct 2026)
  'income.schedule',             // the year-by-year figure every tool reads
  'income.gross-today'           // amounts are £ a year before tax, in today's money
];

describe('the parity ledger: its shape', () => {
  const ledger = load();

  it('exists, says what it was checked against, and quotes the owner\'s rule', () => {
    expect(existsSync(ledgerPath)).toBe(true);
    expect(ledger.against).toMatch(/^\d+\.\d+\.\d+$/);
    expect(ledger.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(ledger.rule.words).toMatch(/at least v6/i);
    expect(ledger.rule.words).toMatch(/Gogo, goslow and nogo/);
  });

  it('every row has an id, an area, plain words, a place in v6, who needs it, a V7 status and a step; built names files, designed a section, retired a reason', () => {
    expect(shapeProblems(ledger, env)).toEqual([]);
  });

  it('every status is used as the ledger defines it', () => {
    for (const r of ledger.rows) expect(Object.keys(STATUSES), r.id).toContain(r.status);
  });
});

describe('the parity ledger: the checks bite (broken copies)', () => {
  const ledger = load();
  const firstBuilt = ledger.rows.find((r) => r.status === 'built');
  const firstWithKey = ledger.rows.find((r) => r.keys.length);

  it('a row that says built but names no file is refused', () => {
    const bad = copy(ledger);
    const r = bad.rows.find((x) => x.id === firstBuilt.id);
    r.files = [];
    expect(shapeProblems(bad, env).join('\n')).toMatch(new RegExp(`row "${r.id}": says built but names no file`));
    r.files = ['src/v7/no-such-file.jsx'];
    expect(shapeProblems(bad, env).join('\n')).toMatch(/does not exist/);
  });

  it('a row that is retired without a reason is refused; an option retired without the owner is refused', () => {
    const bad = copy(ledger);
    const r = bad.rows.find((x) => x.kind === 'option');
    Object.assign(r, { status: 'retired', reason: '' });
    delete r.owner;
    const p = shapeProblems(bad, env).join('\n');
    expect(p).toMatch(new RegExp(`row "${r.id}": says retired but gives no release-note reason`));
    expect(p).toMatch(new RegExp(`row "${r.id}": retires something a person can see or set`));
  });

  it('a row that says designed must name a document section that exists', () => {
    const bad = copy(ledger);
    const r = bad.rows.find((x) => x.status === 'designed') || bad.rows[0];
    Object.assign(r, { status: 'designed', doc: 'research/v7/no-such.md §1' });
    expect(shapeProblems(bad, env).join('\n')).toMatch(/whose document does not exist/);
  });

  it('the income-shape gate refuses: a row waiting on a gap, a planned or retired option, a missing row, and a row of the area left off the list', () => {
    const ids = ['income.steps', 'income.lump-to-steps'];
    const base = copy(ledger);
    base.rows = base.rows.filter((r) => r.area !== 'income-shape' || ids.includes(r.id));
    expect(incomeShapeProblems(base, ids)).toEqual([]);
    const gap = copy(base);
    Object.assign(gap.rows.find((r) => r.id === 'inc.lump-sums'), { status: 'planned', gap: true });
    expect(incomeShapeProblems(gap, ids).join('\n')).toMatch(/row "income.lump-to-steps": waits for "inc.lump-sums", which has no V7 design yet \(gap\)/);
    const planned = copy(base);
    Object.assign(planned.rows.find((r) => r.id === 'income.steps'), { status: 'planned' });
    expect(incomeShapeProblems(planned, ids).join('\n')).toMatch(/row "income.steps": is planned, but an income-shape option not built must be designed/);
    const retired = copy(base);
    Object.assign(retired.rows.find((r) => r.id === 'income.steps'), { status: 'retired' });
    expect(incomeShapeProblems(retired, ids).join('\n')).toMatch(/row "income.steps": is retired/);
    expect(incomeShapeProblems(base, [...ids, 'income.no-such']).join('\n')).toMatch(/"income.no-such" has no row/);
    const extra = copy(base);
    extra.rows.push({ ...copy(base.rows.find((r) => r.id === 'income.steps')), id: 'income.split-off' });
    expect(incomeShapeProblems(extra, ids).join('\n')).toMatch(/row "income.split-off": is in the spending shape's area but not in the gate's list/);
  });

  it('a key with no row is caught, and so is a row naming a key today\'s app does not have', () => {
    const bad = copy(ledger);
    const key = firstWithKey.keys[0];
    for (const r of bad.rows) r.keys = r.keys.filter((k) => k !== key);
    expect(coverage(bad, [key]).missing).toEqual([key]);
    expect(coverage(ledger, ['stress.noSuchKey', ...rowsByKey(ledger).keys()]).missing).toEqual(['stress.noSuchKey']);
    expect(coverage(ledger, [...rowsByKey(ledger).keys()].filter((k) => k !== key)).stale).toEqual([key]);
  });
});

describe('the parity ledger: the gate — every key today\'s app saves has a row', () => {
  const ledger = load();
  const found = harvestV6Keys();
  const { missing, stale } = coverage(ledger, found.keys());

  it('the harvest finds the keys it must (so an empty harvest cannot pass)', () => {
    for (const k of [
      'stress.incomeSteps', 'stress.incomeShape', 'stress.targetSchedule', 'stress.dbAmount', 'stress.extraIncomes', 'stress.windfalls',
      'stress.extraWithdrawals', 'stress.chargesPct', 'stress.hodlEnabled', 'stress.bandFillRecycle', 'stress.strategyState',
      'decision.cadence', 'decision.locked', 'decision.protectionFactor', 'incomeSteps[].decline', 'incomeSteps[].glideToNext',
      'budget.lines[].paidBy', 'budget.splitPhases[].mySharePct', 'budget.oneOffs[].everyYears', 'accumulation.escalationPct',
      'holdings.lines[].sedol', 'household.partnerScenarioId', 'taxYear.confirmedSalary', 'plan.planDocument', 'plan.fromAnswer',
      'strategyParams.gilt-rotation.rotateCutAge', 'strategies.floor-to-age'
    ]) expect(found.has(k), k).toBe(true);
    expect(found.size).toBeGreaterThan(250);
  });

  it('every key today\'s app saves has a row', () => {
    const report = missing.map((k) => k + '  (found in: ' + whereFound(found, k) + ')');
    expect(report, 'keys with no row in ' + LEDGER_JSON).toEqual([]);
  });

  it('no row names a key today\'s app does not have (a typo, or a key removed: mark it retired or drop it)', () => {
    expect(stale).toEqual([]);
  });

  it('every one of the nine strategies, and each of its dials, has a row', () => {
    const named = rowsByKey(ledger);
    const ids = Object.values(STRATEGY_IDS);
    expect(ids.length).toBe(9);
    expect(listStrategies().map((s) => s.id).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      expect(named.has('strategies.' + id), 'strategies.' + id).toBe(true);
      expect(Object.keys(OWNED_KEYS), id).toContain(id);
      for (const k of allowedKeys(id)) expect(named.has('strategyParams.' + id + '.' + k), 'strategyParams.' + id + '.' + k).toBe(true);
    }
  });
});

describe('the parity ledger: the owner\'s rules', () => {
  const ledger = load();
  const byId = new Map(ledger.rows.map((r) => [r.id, r]));

  it('every income-shape option today\'s planner offers has its own row, built or designed (a V7 section), none retired; a row it waits for has a V7 design of its own (as many steps and tapers as v6)', () => {
    expect(incomeShapeProblems(ledger, INCOME_SHAPE_ROWS)).toEqual([]);
    for (const r of ledger.rows.filter((x) => x.area === 'income-shape')) expect(r.status, r.id).not.toBe('retired');
  });

  it('the parts of a row V7 does not have yet are rows of their own (review, 2 Oct 2026): the answer\'s layers are built, the editor\'s are not; the bars are built, the motion is not', () => {
    expect(byId.get('income.layers').status).toBe('built');
    expect(byId.get('income.staircase').status).toBe('built');
    for (const id of ['income.layers-editing', 'income.below-income-live', 'income.markers', 'income.staircase-motion', 'income.budget-mark']) {
      expect(byId.get(id).status, id).toBe('designed');
      expect(byId.get(id).doc, id).toMatch(/^research\/v7\/spending-shape\.md §15/);
    }
    // a built row's "what" no longer claims the parts split off it
    expect(byId.get('income.layers').what).not.toMatch(/marked at their ages|one-off spends/);
    expect(byId.get('income.staircase').what).not.toMatch(/easing/);
    expect(waitsOf(byId.get('income.markers')).sort()).toEqual(['inc.extra-spends', 'inc.lump-sums']);
  });

  it('dated extra spends are a spending-shape option with a V7 design, and so are the lump sums "Turn a lump sum into income" waits for: neither is a gap', () => {
    const extra = byId.get('inc.extra-spends');
    expect(extra.area).toBe('income-shape');
    expect(extra.status).toBe('designed');
    expect(extra.doc).toMatch(/^research\/v7\/spending-shape\.md §16/);
    expect(extra.gap).toBeFalsy();
    const lumps = byId.get('inc.lump-sums');
    expect(lumps.status).toBe('designed');
    expect(lumps.doc).toMatch(/^research\/v7\/spending-shape\.md §17/);
    expect(lumps.gap).toBeFalsy();
    expect(waitsOf(byId.get('income.lump-to-steps'))).toEqual(['inc.lump-sums']);
  });

  it('the readable page counts every spending-shape row not built as "not yet", with what it waits for', () => {
    const md = renderLedgerMarkdown(ledger);
    const notYet = incomeShapeNotYet(ledger);
    expect(notYet.map((r) => r.id).sort()).toEqual(['inc.extra-spends', 'income.below-income-live', 'income.budget-mark', 'income.layers-editing', 'income.lump-to-steps',
      'income.markers', 'income.staircase-motion']);
    const section = md.slice(md.indexOf('## The spending shape: not yet in V7'));
    expect(section).toMatch(new RegExp(`^## The spending shape: not yet in V7 \\(${notYet.length} of ${ledger.rows.filter((r) => r.area === 'income-shape').length}\\)`));
    for (const r of notYet) expect(section, r.id).toContain('**' + r.name + '**');
  });

  it('go-go, go-slow and no-go years are named', () => {
    const r = byId.get('income.phases');
    expect(r.name + ' ' + r.what).toMatch(/go-go/);
    expect(r.name + ' ' + r.what).toMatch(/go-slow/);
    expect(r.name + ' ' + r.what).toMatch(/no-go/);
  });

  it('the income shape\'s saved keys are all on income-shape rows: every step, every taper', () => {
    const named = rowsByKey(ledger);
    for (const k of ['stress.incomeSteps', 'stress.incomeShape', 'stress.targetSchedule', 'stress.shapeAgeNow', 'incomeSteps[].fromAge',
      'incomeSteps[].amount', 'incomeSteps[].decline', 'incomeSteps[].glideToNext']) {
      expect((named.get(k) || []).some((id) => byId.get(id).area === 'income-shape'), k).toBe(true);
    }
  });

  it('nothing a person can see or set is retired without the owner (to confirm, or agreed)', () => {
    for (const r of ledger.rows.filter((x) => x.status === 'retired' && x.kind === 'option')) expect(r.owner, r.id).toMatch(/\S{3,}/);
  });
});

describe('the parity ledger: the readable page', () => {
  it('research/v7/parity-ledger.md is the page ledger.json makes (run: node tests/v7/parity/write-md.mjs)', () => {
    const want = renderLedgerMarkdown(load());
    const have = existsSync(join(ROOT, LEDGER_MD)) ? readFileSync(join(ROOT, LEDGER_MD), 'utf8') : '';
    expect(have === want, LEDGER_MD + ' is out of date: run node tests/v7/parity/write-md.mjs').toBe(true);
  });
});

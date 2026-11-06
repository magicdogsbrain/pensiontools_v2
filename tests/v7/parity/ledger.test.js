/**
 * The parity ledger as a gate (square-one audit §5 item 3; decided 2 Oct 2026: "We NEED to have the same or better
 * optionally than V6 … In general - optional it must be at least v6. We must have Gogo, goslow and nogo years.").
 *
 * tests/v7/parity/ledger.json has a row for every thing a person can do or set in today's app and every key it saves.
 * This file fails when:
 *  - a key today's app saves (found from the code itself: harvest.js) has no row;
 *  - a strategy, or one of a strategy's dials, has no row;
 *  - a row says built but names no file (or a file that does not exist);
 *  - a row is retired without a release-note reason (and, for something a person sees, sets or records, without our
 *    agreement);
 *  - the 7.0 gate (research/v7/switch-readiness.md gate 4): a row is planned, designed or being built, or something a
 *    person sees, sets or records is retired without our agreement in the agreed form, "approved (agreed <date>,
 *    <where>)" — "to confirm" no longer passes;
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
import { shapeProblems, coverage, rowsByKey, STATUSES, incomeShapeProblems, incomeShapeNotYet, waitsOf, gateProblems, AGREED, NOT_DONE, needsAgreement } from './check.js';
import { renderLedgerMarkdown, LEDGER_JSON, LEDGER_MD } from './render.js';
import { STRATEGY_IDS, listStrategies } from '../../../src/strategies/registry.js';
import { OWNED_KEYS, allowedKeys } from '../../../src/services/StrategyState.js';

const ledgerPath = join(ROOT, LEDGER_JSON);
const load = () => JSON.parse(readFileSync(ledgerPath, 'utf8'));
const copy = (v) => JSON.parse(JSON.stringify(v));
const env = { fileExists };

/**
 * The income shape today's planner offers (index.html "Your income shape", src/services/IncomeSchedule.js,
 * src/ui/incomeShapeGraphic.js). Each must have its own row, and none may be retired: our rule of 2 Oct 2026.
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

  it('exists, says what it was checked against, and quotes our rule', () => {
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

  it('a row that is retired without a reason is refused; an option, a setting or a record retired without our agreement is refused', () => {
    const bad = copy(ledger);
    const r = bad.rows.find((x) => x.kind === 'option');
    Object.assign(r, { status: 'retired', reason: '' });
    delete r.agreed;
    const p = shapeProblems(bad, env).join('\n');
    expect(p).toMatch(new RegExp(`row "${r.id}": says retired but gives no release-note reason`));
    expect(p).toMatch(new RegExp(`row "${r.id}": retires something a person can see, set or record`));
    for (const kind of ['setting', 'record']) {
      const k = bad.rows.find((x) => x.kind === kind && x.status === 'built');
      Object.assign(k, { status: 'retired', reason: 'A reason long enough for the release note.' });
      delete k.agreed;
      expect(shapeProblems(bad, env).join('\n'), kind).toMatch(new RegExp(`row "${k.id}": retires something a person can see, set or record`));
    }
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
    Object.assign(gap.rows.find((r) => r.id === 'income.lump-to-steps'), { status: 'designed', doc: 'research/v7/spending-shape.md §17.3', waitsFor: 'inc.lump-sums' });   // as the rows stood before 6.45.0
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
      'plan.decisionTool.cadence', 'decision.locked', 'decision.protectionFactor', 'incomeSteps[].decline', 'incomeSteps[].glideToNext',
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

describe('the parity ledger: our rules', () => {
  const ledger = load();
  const byId = new Map(ledger.rows.map((r) => [r.id, r]));

  it('every income-shape option today\'s planner offers has its own row, built or designed (a V7 section), none retired; a row it waits for has a V7 design of its own (as many steps and tapers as v6)', () => {
    expect(incomeShapeProblems(ledger, INCOME_SHAPE_ROWS)).toEqual([]);
    for (const r of ledger.rows.filter((x) => x.area === 'income-shape')) expect(r.status, r.id).not.toBe('retired');
  });

  it('the parts of a row V7 does not have yet are rows of their own (review, 2 Oct 2026): the answer\'s layers are built, and since 6.41.0 the editor\'s rows, the budget mark, the marks and the floor sentence on a saved plan (way-and-mix.md 5); the bars are built, the motion is not', () => {
    expect(byId.get('income.layers').status).toBe('built');
    expect(byId.get('income.staircase').status).toBe('built');
    for (const id of ['income.layers-editing', 'income.below-income-live', 'income.markers', 'income.budget-mark']) {
      expect(byId.get(id).status, id).toBe('built');
      expect(byId.get(id).step, id).toBe('s8-mix');
      expect(byId.get(id).files, id).toContain('src/v7/components/ShapeChart.jsx');
    }
    // the motion was built in 6.45.0 (road-to-7.md step 11b): a transition on the picture's bars, off for anyone who asked their device for less motion
    expect(byId.get('income.staircase-motion').status).toBe('built');
    expect(byId.get('income.staircase-motion').doc).toMatch(/^research\/v7\/spending-shape\.md §15/);
    expect(byId.get('income.staircase-motion').files).toContain('src/v7/styles/components.css');
    // a built row's "what" no longer claims the parts split off it
    expect(byId.get('income.layers').what).not.toMatch(/marked at their ages|one-off spends/);
    expect(byId.get('income.staircase').what).not.toMatch(/easing/);
    expect(waitsOf(byId.get('income.markers')), 'built: waits for nothing').toEqual([]);
  });

  it('dated extra spends are a spending-shape option built on the plan\'s "What you spend" step (editing-in-v7.md 8) and still designed for the questions, and the lump sums "Turn a lump sum into income" waits for are designed: neither is a gap', () => {
    const extra = byId.get('inc.extra-spends');
    expect(extra.area).toBe('income-shape');
    expect(extra.status).toBe('built');
    expect(extra.editV7).toBe('src/v7/screens/plan/SpendScreen.jsx');
    expect(extra.doc).toMatch(/^research\/v7\/spending-shape\.md §16/);
    expect(extra.gap).toBeFalsy();
    // the lump sums were built on the saved plan's income step (6.41.0 the cards, 6.45.0 where each lands) and "Turn a lump sum into income" on its spend step (6.45.0): nothing waits any more
    const lumps = byId.get('inc.lump-sums');
    expect(lumps.status).toBe('built');
    expect(lumps.doc).toMatch(/^research\/v7\/spending-shape\.md §17/);
    expect(lumps.gap).toBeFalsy();
    expect(byId.get('income.lump-to-steps').status).toBe('built');
    expect(waitsOf(byId.get('income.lump-to-steps'))).toEqual([]);
  });

  it('the readable page counts every spending-shape row not built as "not yet", with what it waits for — none since 6.45.0', () => {
    const md = renderLedgerMarkdown(ledger);
    const notYet = incomeShapeNotYet(ledger);
    expect(notYet.map((r) => r.id).sort()).toEqual([]);
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

  it('nothing a person can see, set or record is retired without our agreement, in the agreed form — no "to confirm" left (the 7.0 gate)', () => {
    const retired = ledger.rows.filter((x) => x.status === 'retired' && needsAgreement(x));
    expect(retired.length).toBeGreaterThan(0);
    for (const r of retired) {
      expect(r.agreed, r.id).toMatch(AGREED);
      expect(r.agreed, r.id).not.toMatch(/to confirm/i);
    }
    // the four agreed for 7.0: each names its record, the audit's R13, which says they are agreed and stay on the
    // classic page (nothing is removed from it); the audit no longer says they wait
    const note = readFileSync(join(ROOT, 'research/v7/switch-readiness.md'), 'utf8');
    const r13 = note.split('\n').find((l) => l.startsWith('| R13 |')) || '';
    expect(r13).toMatch(/Agreed 4 Nov 2026/);
    for (const id of ['budget.walkthrough', 'acct.reset-settings', 'acct.tools', 'acct.admin']) {
      const r = byId.get(id);
      expect(r.status, id).toBe('retired');
      expect(r.agreed, id).toBe('approved (agreed 4 Nov 2026, switch-readiness.md R13: it stays on the classic page)');
      expect(r13, id).toContain('`' + id + '`');
    }
    expect(note).not.toMatch(/retirements? awaits? our agreement/);
  });
});

describe('the parity ledger: the 7.0 gate holds itself (research/v7/switch-readiness.md gate 4)', () => {
  const ledger = load();

  it('no row is planned, designed or being built, and everything retired that a person sees, sets or records has our agreement', () => {
    expect(gateProblems(ledger)).toEqual([]);
    for (const s of NOT_DONE) expect(ledger.rows.filter((r) => r.status === s).map((r) => r.id), s).toEqual([]);
    expect(Object.keys(STATUSES).filter((s) => s !== 'built' && s !== 'retired').sort()).toEqual([...NOT_DONE].sort());   // a new status would have to say which side it is on
  });

  it('the gate bites: a planned, a designed and a building row; an option retired "to confirm", or with no agreement at all; a setting or a record retired with none', () => {
    const ids = ledger.rows.filter((r) => r.status === 'built').slice(0, 3).map((r) => r.id);
    const bad = copy(ledger);
    NOT_DONE.forEach((s, i) => { bad.rows.find((r) => r.id === ids[i]).status = s; });
    const p = gateProblems(bad).join('\n');
    for (const [i, s] of NOT_DONE.entries()) expect(p).toMatch(new RegExp(`row "${ids[i]}": is ${s}, but 7.0 needs every row built or retired`));
    const unagreed = copy(ledger);
    const r = unagreed.rows.find((x) => x.status === 'retired' && x.kind === 'option');
    r.agreed = 'to confirm';
    expect(gateProblems(unagreed).join('\n')).toMatch(new RegExp(`row "${r.id}": retires something a person can see, set or record without our agreement \\("to confirm"\\)`));
    delete r.agreed;
    expect(gateProblems(unagreed).join('\n')).toMatch(new RegExp(`row "${r.id}": retires something`));
    // a saved setting and a record need our agreement too: retiring them drops what a person set or recorded
    for (const kind of ['setting', 'record']) {
      const dropped = copy(ledger);
      const k = dropped.rows.find((x) => x.kind === kind && x.status === 'built');
      Object.assign(k, { status: 'retired', reason: 'A reason long enough for the release note.' });
      expect(gateProblems(dropped).join('\n'), kind).toMatch(new RegExp(`row "${k.id}": retires something a person can see, set or record without our agreement \\(""\\)`));
    }
    // machinery (a key no person sees) needs a reason, not our agreement: no problem names it, whatever the rest of
    // the ledger holds (so a real row that breaks the gate fails the test above, not this one)
    const machinery = copy(ledger);
    const m = machinery.rows.find((x) => x.status === 'retired' && x.kind === 'machinery');
    delete m.agreed;
    expect(gateProblems(machinery).filter((p) => p.includes(`"${m.id}"`))).toEqual([]);
  });

  it('gate 3\'s rows say what 7.0 did, no more: E is built; C\'s "ways" step, never built, is retired with our agreement; F\'s row is only its "not yet" page', () => {
    const row = (id) => ledger.rows.find((r) => r.id === id);
    expect(row('ways.question-e').status).toBe('built');
    const cWays = row('ways.c-ways');
    expect(cWays.status).toBe('retired');
    expect(cWays.agreed).toMatch(AGREED);
    expect(cWays.reason).toMatch(/never built/);
    // F is answered nowhere, in today's planner or in V7: what is built is the page that says so, and its name says that
    const f = row('ways.question-f');
    expect(f.status).toBe('built');
    expect(f.name).toMatch(/^The "not answered here yet" page for /);
    expect(f.what).toMatch(/Only that page exists/);
  });

  it('the agreed form is read strictly', () => {
    expect(AGREED.test('approved (agreed 17 Oct 2026, usability audit decision 9)')).toBe(true);
    expect(AGREED.test('approved (agreed 4 Nov 2026, switch-readiness.md R13: it stays on the classic page)')).toBe(true);
    for (const no of ['to confirm', 'approved', 'approved (to confirm)', 'approved (agreed soon, later)', 'agreed 4 Nov 2026', 'approved (agreed 4 Nov 2026)']) expect(AGREED.test(no), no).toBe(false);
  });
});

describe('the parity ledger: the readable page', () => {
  it('research/v7/parity-ledger.md is the page ledger.json makes (run: node tests/v7/parity/write-md.mjs)', () => {
    const want = renderLedgerMarkdown(load());
    const have = existsSync(join(ROOT, LEDGER_MD)) ? readFileSync(join(ROOT, LEDGER_MD), 'utf8') : '';
    expect(have === want, LEDGER_MD + ' is out of date: run node tests/v7/parity/write-md.mjs').toBe(true);
  });
});

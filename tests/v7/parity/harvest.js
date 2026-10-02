/**
 * Every key today's app (v6) saves, found from the code itself: the parity ledger's gate (ledger.test.js) holds the
 * ledger to this list. Nothing here is typed in by hand: a key added to today's app tomorrow shows up here, and the gate
 * fails until the ledger has a row for it.
 *
 * Where the keys come from (each key carries the places it was found, for the failure message):
 *  - the default and copy functions, run (getDefaultStressSettings, getDefaultScenario, seedStressFromDecision …);
 *  - the code, read as text (scan.js): the object literals given to saveStressSettings / saveDecisionSettings, the
 *    settings forms' read functions, the plan seed V7 hands over (PlanSeed.js), the store's root writes, the field names
 *    the editors pass to their setters (updIncomeStep(i, 'decline', …));
 *  - the twelve committed test plans (tests/fixtures/plans/NN-*.json), which are saved plans as Firestore holds them.
 *
 * Key names: '<namespace>.<key>', e.g. 'stress.dbAmount', 'budget.lines[].paidBy', 'strategyParams.floor-to-age.floorToAge',
 * 'strategies.gilt-rotation'. NAMESPACES lists them, with where each lives in a saved plan.
 *
 * Needs src/firebase/index.js mocked by the test file (the repositories import it).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  getDefaultStressSettings, getDefaultDecisionSettings, getDefaultScenario, seedStressFromDecision, seedDecisionFromStress,
  defaultStrategyBlock
} from '../../../src/storage/ScenarioRepository.js';
import { defaultBudget, starterLines, starterOneOffs, budgetToCsv, parseBudgetCsv, markBudgetAgesSet } from '../../../src/services/BudgetModel.js';
import { emptyHoldings, normaliseLine } from '../../../src/services/HoldingsRecord.js';
import { OWNED_KEYS, allowedKeys, stashStrategy } from '../../../src/services/StrategyState.js';
import { listStrategies } from '../../../src/strategies/registry.js';
import { TIMING_PIN_KEYS } from '../../../src/services/PlanTiming.js';
import { buildTaxYearConfig } from '../../../src/services/TaxYearWizardService.js';
import { smileToSteps } from '../../../src/services/IncomeSchedule.js';
import { NAMESPACES } from './namespaces.js';
import { callLiteralKeys, returnLiteralKeys, literalKeysAfter, assignedProps, functionBody, literalKeys } from './scan.js';

/** The repository root: vitest runs from it (as every other test here assumes). */
export const ROOT = resolve(process.cwd());

export { NAMESPACES };

// ---- reading the code --------------------------------------------------------------------------------------------

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** index.html's inline module script(s), as one text: the HTML around them is not JavaScript. */
export function indexScript() {
  const html = read('index.html');
  const out = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out.join('\n;\n');
}

/** Today's app's own source files: src/ less V7 (src/answers, src/v7) and less the engines' data tables. */
export function appSourceFiles() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const rel = dir + '/' + name;
      if (rel === 'src/answers' || rel === 'src/v7' || rel === 'src/data') continue;
      const st = statSync(join(ROOT, rel));
      if (st.isDirectory()) walk(rel);
      else if (/\.js$/.test(name)) out.push(rel);
    }
  };
  walk('src');
  return out.sort();
}

/** The committed test plans (saved plans as stored), by file name. snapshot.json is the figures, not a plan. */
export function fixturePlans() {
  const dir = 'tests/fixtures/plans';
  return readdirSync(join(ROOT, dir)).filter((f) => /^\d\d-.*\.json$/.test(f)).sort()
    .map((f) => ({ file: dir + '/' + f, plan: JSON.parse(read(dir + '/' + f)) }));
}

// ---- the harvest ---------------------------------------------------------------------------------------------------

/**
 * Every key, with where it was found.
 * @returns {Map<string, Set<string>>}  'stress.dbAmount' → { 'index.html: saveStressSettings({…})', … }
 */
export function harvestV6Keys() {
  const found = new Map();
  const add = (ns, keys, src) => {
    if (!NAMESPACES[ns.split('.')[0].replace(/\[\]$/, '')]) throw new Error('harvest: unknown namespace ' + ns);
    for (const k of keys) {
      if (typeof k !== 'string' || !k) continue;
      const id = ns + '.' + k;
      if (!found.has(id)) found.set(id, new Set());
      found.get(id).add(src);
    }
  };
  const keysOf = (o) => (o && typeof o === 'object' ? Object.keys(o) : []);

  const script = indexScript();
  const files = appSourceFiles().map((rel) => ({ rel, src: read(rel) }));
  const inFile = (rel) => files.find((f) => f.rel === rel)?.src ?? '';
  /** The file (index.html's script or a src file) that defines function `name`, or null. */
  const definer = (name) => {
    const re = new RegExp('(?:function\\s+' + name + '\\s*\\(|\\b' + name + '\\s*=\\s*(?:async\\s+)?(?:function|\\())');
    if (re.test(script)) return { rel: 'index.html', src: script };
    return files.find((f) => re.test(f.src)) || null;
  };
  const everywhere = [{ rel: 'index.html', src: script }, ...files];
  /**
   * The source (index.html's script first, then src/) that holds `re`. Code moves out of index.html over time (the
   * script may only shrink), so an anchor is looked for everywhere; one found nowhere fails loudly, never quietly.
   */
  const sourceWith = (re, what) => {
    const f = everywhere.find((x) => re.test(x.src));
    if (!f) throw new Error('harvest: ' + what + ' is no longer in today\'s code; update tests/v7/parity/harvest.js');
    return f;
  };

  // -- the plan's root, details, strategy block (run) --
  const scenario = getDefaultScenario('x', '', ['stress', 'decision']);
  add('plan', keysOf(scenario), 'getDefaultScenario()');
  add('planDetails', keysOf(scenario.planDetails), 'getDefaultScenario().planDetails');
  add('strategy', keysOf(defaultStrategyBlock('2026-01-01T00:00:00.000Z')), 'defaultStrategyBlock()');

  // -- Stress settings (run) --
  add('stress', keysOf(getDefaultStressSettings()), 'getDefaultStressSettings()');
  add('stress', keysOf(scenario.stressTool.settings), 'getDefaultScenario().stressTool.settings');
  add('stress', keysOf(seedStressFromDecision({}, {}, '2026-01-01T00:00:00.000Z')), 'seedStressFromDecision() (Copy from Decision)');
  add('stress', TIMING_PIN_KEYS, 'PlanTiming.TIMING_PIN_KEYS (the plan-start pin)');

  // -- Decision settings (run) --
  add('decision', keysOf(getDefaultDecisionSettings()), 'getDefaultDecisionSettings()');
  add('decision', keysOf(scenario.decisionTool.settings), 'getDefaultScenario().decisionTool.settings');
  add('decision', keysOf(seedDecisionFromStress({}, {})), 'seedDecisionFromStress() (Use ALL Stress settings)');

  // -- settings writes in the code (read) --
  for (const f of everywhere) {
    const s = callLiteralKeys(f.src, 'saveStressSettings');
    add('stress', s.keys, f.rel + ': saveStressSettings({…})');
    const d = callLiteralKeys(f.src, 'saveDecisionSettings');
    add('decision', d.keys, f.rel + ': saveDecisionSettings({…})');
    const p = callLiteralKeys(f.src, 'saveUserProfile');
    add('profile', p.keys, f.rel + ': saveUserProfile({…})');
    // the plan's root: saveScenario(id, { 'stressTool.settings': …, holdings, … }) — a dotted key's first part is the field
    const r = callLiteralKeys(f.src, 'saveScenario', { argIndex: 1 });
    for (const k of r.keys) {
      const [head, ...rest] = k.split('.');
      const sub = rest.join('.');
      add('plan', [head], f.rel + ': saveScenario(id, {…})');
      if (!sub) continue;
      if (head === 'household') add('household', [sub], f.rel + ': saveScenario(id, {…})');
      else if (head === 'planDetails') add('planDetails', [sub], f.rel + ': saveScenario(id, {…})');
      else add('plan', [k], f.rel + ': saveScenario(id, {…}) (a field inside ' + head + ')');
    }
    // a write to a field inside a part of the plan, whatever function makes it: { 'stressTool.settings': … }
    for (const m of f.src.matchAll(/['"]((?:stressTool|decisionTool|budgetTool|accumulationTool)\.[A-Za-z]\w*)['"]\s*:/g)) {
      add('plan', [m[1].split('.')[0], m[1]], f.rel + ': a write to ' + m[1]);
    }
    // browser storage keys
    for (const m of f.src.matchAll(/['"](pt_[A-Za-z0-9_]+|nextStepDismissed:)['"]/g)) add('browser', [m[1]], f.rel);
  }
  // the Stress settings form's helpers that the save spreads in
  for (const fn of ['timingFieldsForSave', 'readGiaFields']) {
    const def = definer(fn);
    if (!def) throw new Error('harvest: ' + fn + ' not found');
    add('stress', returnLiteralKeys(def.src, fn), def.rel + ': ' + fn + '()');
  }
  add('decision', returnLiteralKeys(definer('readGiaFields').src, 'readGiaFields'), 'readGiaFields() (the Decision form uses it too)');
  // the setup wizard's first settings
  for (const [ns, re] of [['stress', /const stressSettings\s*=\s*(?=\{)/], ['decision', /const decisionSettings\s*=\s*(?=\{)/]]) {
    const w = sourceWith(re, 'the set-up wizard\'s ' + ns + 'Settings');
    add(ns, literalKeysAfter(w.src, re), w.rel + ': set-up wizard ' + ns + 'Settings');
  }
  // the guest and demo plans' Stress settings
  for (const m of script.matchAll(/\bstress:\s*(?=\{)/g)) add('stress', literalKeys(script, m.index + m[0].length), 'index.html: demo / guest plan stress: {…}');
  // the stored defaults merged under every plan on load, and the load-time migrations
  {
    const sdb = /function getDefaultStressDB\(\)[\s\S]*?settings:\s*/;
    const sr = sourceWith(sdb, 'getDefaultStressDB');
    add('stress', literalKeysAfter(sr.src, sdb), sr.rel + ': getDefaultStressDB()');
    // the load-time migrations: the Stress copy is `ms`, the Decision copy `settingsIn` (the 6.2.1 rewrite)
    add('stress', assignedProps(inFile('src/storage/StressRepository.js'), 'ms'), 'StressRepository: load-time migration');
    add('decision', assignedProps(inFile('src/storage/DecisionRepository.js'), 'settingsIn'), 'DecisionRepository: load-time migration');
    // the renamed keys an old plan still carries beside the new ones (storage/migrations.js toV1)
    const renames = /\[\s*\[\s*'pacwMin'[\s\S]*?\]\s*\]/;
    const mg = sourceWith(renames, 'the renamed Stress keys (pacwMin …)');
    for (const m of mg.src.match(renames)[0].matchAll(/\[\s*'([A-Za-z]\w*)'\s*,\s*'([A-Za-z]\w*)'\s*\]/g)) add('stress', [m[1]], mg.rel + ': a renamed Stress key');
    const ddb = /function getDefaultDecisionDB\(\)[\s\S]*?settings:\s*/;
    const dr = sourceWith(ddb, 'getDefaultDecisionDB');
    add('decision', literalKeysAfter(dr.src, ddb), dr.rel + ': getDefaultDecisionDB()');
    const ty = sourceWith(/function getDefaultTaxYearConfig\s*\(/, 'getDefaultTaxYearConfig');
    add('taxYear', returnLiteralKeys(ty.src, 'getDefaultTaxYearConfig'), ty.rel + ': getDefaultTaxYearConfig()');
  }
  // the Budget's "Use as the start of my income shape" patch (index.html or its own module)
  {
    const def = definer('budgetIncomeShapePatch') || definer('applyBudgetToPlan');
    if (def && /function budgetIncomeShapePatch/.test(def.src)) {
      add('stress', literalKeysAfter(def.src, /function budgetIncomeShapePatch[\s\S]*?\bpatch:\s*/), def.rel + ': budgetIncomeShapePatch()');
    }
  }

  // -- V7's plan seed → a plan (PlanSeed.js): what a plan made from a V7 answer carries --
  {
    const ps = sourceWith(/function planFor\s*\(/, 'PlanSeed planFor').src;
    const [pf, pt] = functionBody(ps, 'planFor');
    const body = ps.slice(pf, pt);
    add('stress', callLiteralKeys(body, 'Object.assign', { argIndex: 1, firstArg: 'S' }).keys, 'PlanSeed.planFor: Object.assign(S, …)');
    add('stress', assignedProps(body, 'S'), 'PlanSeed.planFor: S.x = …');
    add('plan', assignedProps(body, 'plan'), 'PlanSeed.planFor: plan.x = …');
    add('decision', literalKeysAfter(body, /plan\.decisionTool\s*=\s*\{\s*settings:\s*/), 'PlanSeed.planFor: decisionTool.settings');
    add('accumulation', literalKeysAfter(body, /plan\.accumulationTool\s*=\s*\{\s*settings:\s*/), 'PlanSeed.planFor: accumulationTool.settings');
    add('extraIncomes[]', literalKeysAfter(body, /S\.extraIncomes\s*=[^[]*\[\s*/), 'PlanSeed.planFor: extraIncomes');
    add('potAtRetirement', literalKeysAfter(body, /potAtRetirement:\s*later\s*\?\s*/), 'PlanSeed.planFor: potAtRetirement');
    const [bf, bt] = functionBody(ps, 'budgetFor');
    const bud = ps.slice(bf, bt);
    add('budget', literalKeysAfter(bud, /const b\s*=\s*(?=\{)/), 'PlanSeed.budgetFor');
    add('budget', callLiteralKeys(bud, 'Object.assign', { argIndex: 1, firstArg: 'b' }).keys, 'PlanSeed.budgetFor: Object.assign(b, …)');
    add('budget', assignedProps(bud, 'b'), 'PlanSeed.budgetFor: b.x = …');
    add('budget.lines[]', literalKeysAfter(bud, /b\.lines\s*=[\s\S]*?\.map\(\(l\)\s*=>\s*\(/), 'PlanSeed.budgetFor: lines');
    add('budget.oneOffs[]', literalKeysAfter(bud, /b\.oneOffs\s*=[\s\S]*?\.map\(\(o\)\s*=>\s*\(/), 'PlanSeed.budgetFor: oneOffs');
  }

  // -- Budget (run, and the page's writes) --
  {
    const b = defaultBudget(50, 60);
    add('budget', keysOf(b), 'defaultBudget()');
    add('budget', keysOf(scenario.budgetTool.settings), 'getDefaultScenario().budgetTool.settings');
    add('budget', keysOf(markBudgetAgesSet({ currentAge: 50 })), 'markBudgetAgesSet()');
    add('budget.lines[]', keysOf(starterLines()[0]), 'starterLines()');
    add('budget.oneOffs[]', keysOf(starterOneOffs()[0]), 'starterOneOffs()');
    // a full budget through the spreadsheet export and back: every field the sheet carries
    const full = {
      ...b, targetHeadroomMonthly: 100, splitPhases: [{ fromAge: 63, mySharePct: 50 }],
      lines: [{ label: 'Food', tier: 'essential', annual: 1200, period: 'mo', paidBy: 'shared', mySharePct: 40, fromAge: 60, toAge: 80, hint: 'x',
        breakdown: [{ label: 'a', amount: 50, period: 'mo' }] }],
      oneOffs: [{ label: 'Car', tier: 'essential', amount: 9000, atAge: 70, everyYears: 8, paidBy: 'me', mySharePct: null, hint: '' }]
    };
    const back = parseBudgetCsv(budgetToCsv(full), new Date(2026, 9, 2));
    add('budget', keysOf(back.settings), 'budget spreadsheet (export → import)');
    add('budget.splitPhases[]', keysOf(back.settings.splitPhases && back.settings.splitPhases[0]), 'budget spreadsheet (export → import)');
    add('budget.lines[]', keysOf(back.lines[0]), 'budget spreadsheet (export → import)');
    add('budget.lines[].breakdown[]', keysOf(back.lines[0] && back.lines[0].breakdown && back.lines[0].breakdown[0]), 'budget spreadsheet (export → import)');
    add('budget.oneOffs[]', keysOf(back.oneOffs[0]), 'budget spreadsheet (export → import)');
    for (const f of everywhere) {
      add('budget', assignedProps(f.src, 'window._budget'), f.rel + ': window._budget.x = …');
      add('budget.lines[]', callLiteralKeys(f.src, 'window._budget.lines.push').keys, f.rel + ': a new budget line');
      add('budget.oneOffs[]', callLiteralKeys(f.src, 'window._budget.oneOffs.push').keys, f.rel + ': a new one-off cost');
    }
    add('budget.lines[]', assignedProps(script, 'line'), 'index.html: line.x = … (a budget line)');
    // `X.y = …` in the lines before each saveBudget(X)
    for (const f of everywhere) {
      for (const m of f.src.matchAll(/\bsaveBudget\(\s*([A-Za-z_$][\w$]*)\s*\)/g)) {
        if (m[1] === 'budget') continue;   // the repository's own parameter
        add('budget', assignedProps(f.src, m[1], Math.max(0, m.index - 3000), m.index), f.rel + ': ' + m[1] + '.x = … before saveBudget(' + m[1] + ')');
      }
    }
    const ts = /const toSave\s*=\s*(?=\{)/;
    const br = sourceWith(ts, 'saveBudget\'s stored summary');
    add('budget', literalKeysAfter(br.src, ts), br.rel + ': saveBudget (the summary it stores)');
  }

  // -- the editors' generic setters: the field names they are called with (index.html) --
  const SETTERS = {
    updIncomeStep: 'incomeSteps[]', updExtraIncome: 'extraIncomes[]', updWindfall: 'windfalls[]', updExtraWithdrawal: 'extraWithdrawals[]',
    updateBudgetLine: 'budget.lines[]', updateBudgetOneOff: 'budget.oneOffs[]', updateSplitPhase: 'budget.splitPhases[]',
    budWizField: 'budget.lines[]', budWizOneOff: 'budget.oneOffs[]', budBreakField: 'budget.lines[].breakdown[]', updHolding: 'holdings.lines[]', updateFundField: 'taggedFunds[]'
  };
  for (const [fn, ns] of Object.entries(SETTERS)) {
    const re = new RegExp('\\b' + fn + '\\([^\\n]*?,\\s*\\\\?[\'"]([A-Za-z_][\\w]*)\\\\?[\'"]\\s*,', 'g');
    for (const m of script.matchAll(re)) add(ns, [m[1]], 'index.html: ' + fn + '(…, \'' + m[1] + '\', …)');
  }
  // the editors' "add a row" literals
  for (const [arr, ns] of [['_ssExtraIncomes', 'extraIncomes[]'], ['_ssExtraWithdrawals', 'extraWithdrawals[]'], ['_ssWindfalls', 'windfalls[]']]) {
    for (const m of script.matchAll(new RegExp('window\\.' + arr + '\\s*=\\s*window\\.' + arr + '\\s*\\|\\|\\s*\\[\\]\\)\\.push\\(\\s*(?=\\{)', 'g'))) {
      add(ns, literalKeys(script, m.index + m[0].length), 'index.html: add a row');
    }
  }
  // a fund added to the "funds to test" list
  add('taggedFunds[]', callLiteralKeys(script, 'funds(p).push').keys, 'index.html: a fund added to the list to test');
  // a step of the income shape: what the engines' compiler reads of it
  {
    const isrc = sourceWith(/export function amountAtAge\s*\(/, 'IncomeSchedule amountAtAge').src;
    const [af, at] = functionBody(isrc, 'amountAtAge');
    for (const m of isrc.slice(af, at).matchAll(/\b(?:cur|next)\.([A-Za-z_]\w*)/g)) add('incomeSteps[]', [m[1]], 'IncomeSchedule.amountAtAge');
    add('incomeSteps[]', keysOf(smileToSteps([{ fromAge: 60, amount: 1000 }], 60)[0]), 'IncomeSchedule.smileToSteps');
  }

  // -- Accumulation, holdings, strategies, tax years (run and read) --
  add('accumulation', returnLiteralKeys(definer('readAccumulationInputs').src, 'readAccumulationInputs'), 'index.html: readAccumulationInputs()');
  add('holdings', keysOf(emptyHoldings()), 'emptyHoldings()');
  add('holdings.lines[]', keysOf(normaliseLine({ ticker: 'VWRL' })), 'HoldingsRecord.normaliseLine()');
  const stash = stashStrategy({}, 'pots-and-valves', { savedAt: '2026-01-01' }).strategyState['pots-and-valves'];
  add('strategyState', keysOf(stash), 'StrategyState.stashStrategy()');
  for (const id of Object.keys(OWNED_KEYS)) add('strategyParams.' + id, allowedKeys(id), 'StrategyState.allowedKeys(\'' + id + '\')');
  add('strategies', listStrategies().map((s) => s.id), 'strategies/registry.js listStrategies()');
  add('taxYear', keysOf(buildTaxYearConfig({})), 'TaxYearWizardService.buildTaxYearConfig()');

  // -- the committed test plans (saved plans, as stored) --
  for (const { file, plan } of fixturePlans()) {
    // A top-level name with a dot in it is not a field inside another: it is a copy an old storage fault wrote under
    // that literal name (fixture 08). Named 'plan.dotted:<the name>' so it cannot be mistaken for the field.
    add('plan', keysOf(plan).map((k) => (k.includes('.') ? 'dotted:' + k : k)), file);
    add('planDetails', keysOf(plan.planDetails), file);
    add('strategy', keysOf(plan.strategy), file);
    add('household', keysOf(plan.household), file);
    add('holdings', keysOf(plan.holdings), file);
    for (const l of (plan.holdings && plan.holdings.lines) || []) add('holdings.lines[]', keysOf(l), file);
    const S = plan.stressTool && plan.stressTool.settings;
    add('stress', keysOf(S), file);
    for (const [arr, ns] of [['incomeSteps', 'incomeSteps[]'], ['extraIncomes', 'extraIncomes[]'], ['windfalls', 'windfalls[]'],
      ['extraWithdrawals', 'extraWithdrawals[]'], ['taggedFunds', 'taggedFunds[]']]) {
      for (const r of (S && Array.isArray(S[arr]) ? S[arr] : [])) add(ns, keysOf(r), file);
    }
    if (S && S.potAtRetirement && typeof S.potAtRetirement === 'object') add('potAtRetirement', keysOf(S.potAtRetirement), file);
    for (const st of Object.values((S && S.strategyState) || {})) add('strategyState', keysOf(st), file);
    const D = plan.decisionTool && plan.decisionTool.settings;
    add('decision', keysOf(D), file);
    for (const ty of Object.values((plan.decisionTool && plan.decisionTool.taxYears) || {})) add('taxYear', keysOf(ty), file);
    const B = plan.budgetTool && plan.budgetTool.settings;
    add('budget', keysOf(B), file);
    for (const l of (B && B.lines) || []) { add('budget.lines[]', keysOf(l), file); for (const r of l.breakdown || []) add('budget.lines[].breakdown[]', keysOf(r), file); }
    for (const o of (B && B.oneOffs) || []) add('budget.oneOffs[]', keysOf(o), file);
    for (const p of (B && B.splitPhases) || []) add('budget.splitPhases[]', keysOf(p), file);
    add('accumulation', keysOf(plan.accumulationTool && plan.accumulationTool.settings), file);
  }

  return found;
}

/** The harvest as a sorted list of key names. */
export function harvestedKeyList() {
  return [...harvestV6Keys().keys()].sort();
}

/** Where a key was found, for a failure message: "a, b (and 3 more)". */
export function whereFound(found, key) {
  const s = [...(found.get(key) || [])];
  return s.slice(0, 3).join('; ') + (s.length > 3 ? ' (and ' + (s.length - 3) + ' more)' : '');
}

/** True when `rel` (a path from the repository root) is a file that exists. */
export function fileExists(rel) {
  const clean = String(rel).replace(/[#:].*$/, '').trim();
  return !!clean && !clean.includes('..') && existsSync(join(ROOT, clean)) && statSync(join(ROOT, clean)).isFile();
}


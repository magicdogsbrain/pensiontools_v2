/**
 * Step F1, fix round 1 (lead4.md D3, D4, D5, D10, R7): the readers the check found still drawn beside the one reading.
 *
 *  1. The line above "Will it last?", History and Scenarios (startingPotsWords.startSummaryHtml): on a plan still saving it
 *     says the pot at the stop and the pension today from the reading (src/reading/atStop.js), marked, to the formatter's
 *     rounding — never its own sum of the pots to the pound.
 *  2. "Try a strategy"'s pension and ISA boxes start from ONE function in both views (tryStartOf): a plan still saving its
 *     pension and ISA today, a locked plan its last record, any other plan the pension its runs start from (a diversifiers
 *     sleeve included). An untouched try on a plan not locked differs from the plan in nothing.
 *  3. The line under the try's pension box says the pot at the stop as the reading has it (to £1,000, marked).
 *  4. A plan's name, wherever either view prints it (the close question, the closed and closing lines, D's plan list, the
 *     download's file name), is PlanName.shownPlanName.
 *  5. The full view's leading tab says the stage in the three words.
 * Fictional people only (the parity fixtures: Alex, Sam, Jo, Pat, Kim).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { pensionToday, isaToday, settingsOf } from '../../src/reading/money.js';
import { potAtStop } from '../../src/reading/atStop.js';
import { tryStartOf } from '../../src/reading/tryStart.js';
import { money, moneyK, formatFact } from '../../src/reading/format.js';
import { startSummaryHtml, startsScaled } from '../../src/ui/startingPotsWords.js';
import { tryPotWordsOf } from '../../src/ui/tryBoxes.js';
import { tryBoxesOf, checkTry, tryDifferences, tryPotFromRecord } from '../../src/answers/plan/lasts.js';
import { sippTodayOf } from '../../src/services/PotsAtRetirement.js';
import { shownPlanName, storedPlanName } from '../../src/services/PlanName.js';
import { closeQuestionOf } from '../../src/services/PlanClose.js';
import { closedReading, beforeReading } from '../../src/services/PlanClosedReading.js';
import { dWayIn } from '../../src/v7/state/select.js';
import { startDownloads } from '../../src/v7/effects/download.js';
import { A } from '../../src/v7/state/actions.js';
import { planRows } from '../../src/answers/plan/read.js';
import { planExportFileName } from '../../src/services/PlanExport.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const isLockedPlan = (p) => !!(p && p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const marked = (html, fact) => [...String(html).matchAll(new RegExp('data-fact="' + fact.replace(/\./g, '\\.') + '">([^<]*)<', 'g'))].map((m) => m[1]);
const withoutMarks = (html) => String(html).replace(/<span data-fact="[^"]*">[^<]*<\/span>/g, '');
const plain = (html) => String(html).replace(/<[^>]+>/g, '');
const SRC = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const fnBody = (marker, len = 4000) => { const i = SRC.indexOf(marker); expect(i, marker).toBeGreaterThan(-1); return SRC.slice(i, i + len); };

const plansOf = (f) => f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario);

describe('1. the line above the runs says the reading\'s pot at the stop', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', (key, f) => {
    const plan = plansOf(f).find((p) => p.id === f.subject);
    const ctx = { now: NOW };
    const ss = settingsOf(plan, ctx);
    if (!startsScaled(ss)) return;
    const at = potAtStop(plan, ctx);
    expect(at, 'a plan whose runs start at the stop has a pot at the stop').toBeTruthy();
    const html = startSummaryHtml(ss, { atStop: at });
    expect(marked(html, 'pot.atStop')).toEqual([moneyK(at.middle)]);
    if (at.source === 'worked') expect(marked(html, 'pot.today')).toEqual([formatFact('pot.today', pensionToday(plan, ctx).value)]);
    // no pension figure of its own: neither the pots' sum to the pound nor the pension today unmarked
    const rest = plain(withoutMarks(html));
    const sum = Math.round(sippTodayOf(ss) * (at.middle / Math.max(1, sippTodayOf(ss))));
    expect(rest).not.toContain(money(sum));
    expect(rest).not.toMatch(/\(pension £/);
    // before the reading is in, no pension figure at all
    expect(plain(startSummaryHtml(ss))).not.toMatch(/pension £/);
  });
});

describe('2. "Try a strategy" starts from one function in both views', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', (key, f) => {
    const plans = plansOf(f);
    const plan = plans.find((p) => p.id === f.subject);
    const ctx = { now: NOW };
    const ss = settingsOf(plan, ctx);
    const start = tryStartOf(plan, { today: PARITY_DAY });
    const boxes = tryBoxesOf(plan, { today: PARITY_DAY });
    expect(boxes['try.pot']).toBe(start.pot == null ? '' : String(start.pot));
    expect(boxes['try.isa']).toBe(String(start.isa));
    const rec = tryPotFromRecord(plan, { today: PARITY_DAY });
    if (rec) expect(start.pot).toBe(rec.pension.value);
    else if (ss.potsNotSet) expect(start.pot).toBe(null);
    else if (ss.retired === false) {
      expect(start.pot, 'a plan still saving: the pension today').toBe(Math.round(pensionToday(plan, ctx).value));
      expect(start.isa, 'a plan still saving: the ISA today').toBe(Math.round(isaToday(plan, ctx).value));
    } else {
      const pinned = ss.strategyParams && +ss.strategyParams.sippTotal > 0 ? +ss.strategyParams.sippTotal : null;
      expect(start.pot, 'the pension its runs start from, a sleeve included').toBe(Math.round(pinned || sippTodayOf(ss)));
    }
    // untouched, on a plan not locked: nothing differs from the plan
    if (!isLockedPlan(plan) && start.pot != null) {
      const c = checkTry(plan, boxes, { today: PARITY_DAY });
      expect(c.ok, JSON.stringify(c.errors)).toBe(true);
      const ids = tryDifferences(plan, c.run, PARITY_DAY).map((d) => d.id);
      expect(ids).not.toContain('pot');
      expect(ids).not.toContain('isa');
    }
  });
  it('a diversifiers sleeve is part of the pension the box starts from, and an untouched try keeps every pot', () => {
    const f = FIXTURES.find((x) => x.key === 'retired-draft');
    const plan = plansOf(f).find((p) => p.id === f.subject);
    plan.stressTool.settings = { ...plan.stressTool.settings, diversifierStart: 40000 };
    const ss = settingsOf(plan, { now: NOW });
    const start = tryStartOf(plan, { today: PARITY_DAY });
    expect(start.pot).toBe(Math.round(sippTodayOf(ss)));
    expect(+ss.diversifierStart).toBe(40000);
    const c = checkTry(plan, tryBoxesOf(plan, { today: PARITY_DAY }), { today: PARITY_DAY });
    expect(tryDifferences(plan, c.run, PARITY_DAY).map((d) => d.id)).not.toContain('pot');
  });
  it('the full view fills its boxes from the same function, and says what differs against the same start', () => {
    const reset = fnBody('window.resetTryStrategyUI = async function');
    expect(reset).toContain('tryStartOf(');
    expect(reset.slice(0, reset.indexOf('tryIsaPolicy'))).not.toMatch(/equityMin|isaTotal|isaBalance/);
    expect(fnBody('window.runTryStrategyUI = async function')).toMatch(/tryDifferencesOf\(s, c, [^)]+\)/);
  });
});

describe('3. the line under the try\'s pension box', () => {
  it('says the pot at the stop to £1,000, marked, from the reading', () => {
    const f = FIXTURES.find((x) => x.key === 'saver-draft');
    const plan = plansOf(f).find((p) => p.id === f.subject);
    const ss = settingsOf(plan, { now: NOW });
    const at = potAtStop(plan, { now: NOW });
    const w = tryPotWordsOf(ss, at);
    expect(w.label).toBe('Your pension today (£)');
    expect(marked(w.hint, 'pot.atStop')).toEqual([moneyK(at.middle)]);
    expect(plain(w.hint)).not.toContain(money(at.middle) === moneyK(at.middle) ? '£never' : money(at.middle));
    expect(tryPotWordsOf(ss, null).hint).toBe('');
  });
});

describe('4. a plan\'s name is the shown name wherever either view prints it', () => {
  // a name the answer suggested and nobody typed follows the plan: its shown name differs from the stored one
  const renamed = (p, suggested) => { p.planDetails = { ...(p.planDetails || {}), name: suggested }; p.fromAnswer = { ...(p.fromAnswer || {}), household: 'single', name: { suggested, chosen: suggested } }; return p; };
  it('the close question and the closed and before lines', () => {
    const f = FIXTURES.find((x) => x.key === 'closed-successor');
    const plans = plansOf(f);
    const next = renamed(plans.find((p) => p.id === 'ParNext'), 'From 50 · £9,990 a month');
    const old = renamed(plans.find((p) => p.id === 'ParClosed'), 'From 49 · £9,990 a month');
    expect(shownPlanName(next, { now: NOW })).not.toBe(storedPlanName(next));
    expect(shownPlanName(old, { now: NOW })).not.toBe(storedPlanName(old));
    expect(closedReading(old, plans, NOW).next.name).toBe(shownPlanName(next, { now: NOW }));
    expect(beforeReading(next, plans, NOW).previous.name).toBe(shownPlanName(old, { now: NOW }));
    const g = FIXTURES.find((x) => x.key === 'retired-locked-months');
    const gp = plansOf(g);
    const plan = renamed(gp.find((p) => p.id === g.subject), 'From 49 · £9,990 a month');
    const q = closeQuestionOf(plan, { now: NOW, plans: gp });
    expect(q, 'the plan is offered the close').toBeTruthy();
    expect(shownPlanName(plan, { now: NOW })).not.toBe(storedPlanName(plan));
    expect(q.name).toBe(shownPlanName(plan, { now: NOW }));
  });
  it('D\'s plan list and the simple view\'s download name the plan as the full view does', () => {
    const f = FIXTURES.find((x) => x.key === 'retired-draft');
    const plans = plansOf(f);
    const plan = renamed(plans.find((p) => p.id === f.subject), 'From 49 · £9,990 a month');
    const shown = shownPlanName(plan, { now: NOW });
    expect(shown).not.toBe(storedPlanName(plan));
    const list = plans.map((p) => ({ plan: p, newer: false, failed: false }));
    const state = { env: { today: PARITY_DAY }, plans: { status: 'read', source: 'account', list, view: { today: PARITY_DAY, rows: planRows(list, { today: PARITY_DAY, source: 'account' }).groups } } };
    expect(dWayIn(state).plans.find((x) => x.id === plan.id).name).toBe(shown);
    // before the plans are read for the screen, nothing is claimed
    expect(dWayIn({ ...state, plans: { ...state.plans, view: null } })).toEqual({ known: false, plans: [] });
    // the download: the file named by the shown name, as the full view's exportActivePlan names it
    let named = null, sub = null;
    const a = { click() {}, remove() {} };
    const win = { Blob: class { constructor() {} }, URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} }, document: { createElement: () => a, body: { appendChild() {} } }, setTimeout() {} };
    Object.defineProperty(a, 'download', { set(v) { named = v; }, get() { return named; } });
    const store = { subscribe: (fn) => { sub = fn; return () => {}; }, dispatch() {}, getState: () => state };
    startDownloads(store, { win, now: () => NOW });
    sub({ ...state, ui: { download: { planId: plan.id } } }, { type: A.PLAN_DOWNLOAD });
    expect(named).toBe(planExportFileName(shown, NOW));
    expect(SRC).toMatch(/planExportFileName\(readingPlanName\(/);
  });
  it('nothing prints a plan\'s stored name through a second reader', () => {
    expect(SRC).not.toMatch(/planNameOf/);
    const ui = readFileSync(resolve(process.cwd(), 'src/ui/planCloseUi.js'), 'utf8');
    expect(ui).not.toMatch(/planNameOf/);
    const closed = readFileSync(resolve(process.cwd(), 'src/services/PlanClosed.js'), 'utf8');
    expect(closed).not.toMatch(/export const planNameOf/);
  });
});

describe('5. the full view\'s leading tab says the stage in the three words', () => {
  it('never the placing label', () => {
    const body = fnBody('function applyStageToTabs(stage)', 1600);
    expect(body).not.toMatch(/stage\.label/);
    expect(body).toMatch(/Where your plan is now: ' \+ window\._stageWord/);
  });
});

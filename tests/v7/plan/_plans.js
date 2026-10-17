/**
 * Helpers for the saved-plan tests (research/v7/your-plan.md 9). Not a test file.
 *
 *   corpus()                    the 12 committed test plans, raw, by file name
 *   entriesAt(today)            the corpus brought up to date in memory, as the plan source hands it in
 *   household()                 the two plans shaped like the owner's household: the locked ladder in its run-up (03, linked
 *                               one way to the saver) and the saver (05, no link back) — built from the corpus, never a
 *                               new file (the corpus's snapshot would have to move)
 *   stateWith(entries, route, o) a V7 state on a plan page with those plans read
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';

export const PLANS_DIR = join(process.cwd(), 'tests', 'fixtures', 'plans');
export const TODAY = '2026-10-02';
export const DATES = ['2026-10-02', '2027-04-05', '2027-04-06'];

export function corpus() {
  return Object.fromEntries(readdirSync(PLANS_DIR).filter((f) => /^\d\d-.*\.json$/.test(f)).sort().map((f) => [f.replace(/\.json$/, ''), JSON.parse(readFileSync(join(PLANS_DIR, f), 'utf8'))]));
}

export const noon = (today) => { const [y, m, d] = today.split('-').map(Number); return new Date(y, m - 1, d, 12); };

export function entryOf(raw, today = TODAY) {
  const u = upgradeScenario(raw, { now: noon(today) });
  return { plan: u.scenario, newer: !!u.newer, failed: !!u.error };
}

export function entriesAt(today = TODAY, raws = Object.values(corpus())) {
  return raws.map((r) => entryOf(r, today));
}

/** The owner-shaped pair: the locked ladder (03) points at the saver (05); the saver has no link back. */
export function household() {
  const c = corpus();
  const ladder = JSON.parse(JSON.stringify(c['03-gilt-ladder-runup']));
  const saver = JSON.parse(JSON.stringify(c['05-saver-committed']));
  ladder.id = 'HouseLadder01'; ladder.planDetails.name = 'Ladder plan'; ladder.isActive = true;
  ladder.household = { partnerScenarioId: 'HouseSaver02' };
  saver.id = 'HouseSaver02'; saver.planDetails.name = 'Saving plan'; saver.isActive = false;
  // the saver is NOT locked here (the design's 14: not locked, saving, no link back) — the lock, document and records go
  delete saver.planDocument; delete saver.journey;
  saver.decisionTool.settings = { ...saver.decisionTool.settings, locked: false }; delete saver.decisionTool.settings.lockedAt; delete saver.decisionTool.settings.lockedBy;
  saver.accumulationTool.settings.retirementAge = 60;
  return { ladder, saver };
}

export function stateWith(entries, hash = '#/plans', { today = TODAY, source = 'account', session = 'in', readAt = '14:03', open = [] } = {}) {
  let s = initialState({ today, build: 'test' });
  s = reduce(s, { type: A.ROUTE_SET, route: parse(hash) });
  s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
  if (entries) s = reduce(s, { type: A.PLANS_SET, list: entries, source, readAt });
  if (entries) s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });   // as the plan source does on the page
  for (const id of open) s = reduce(s, { type: A.UI_TOGGLE, id });
  return s;
}

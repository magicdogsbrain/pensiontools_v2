/**
 * Step F6, fix round 1 (lead4.md D19, D20, D2): the problems the check found.
 *  - "n of m gilts held" after "This is how I want to hold it" is the one count on the review too (giltsCountOf with the
 *    agreement, from the page's one diff), and the review's line is marked gilts.held.
 *  - what is held in the pension, as a mix (the waiting saver's line, the held-mix test's headline), is read by the one
 *    reader in src/reading (heldMixOf with `pension`), marked, and the run is made on the very same split.
 *  - a partner's plan made in the full view: a stop age already past is "already stopped", never a stop month in the past;
 *    no stop age and not stopped is asked for, never a stop age nobody gave.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradedList } from '../../src/v7/effects/planSource.js';
import { planPage } from '../../src/answers/plan/read.js';
import { reviewOf } from '../../src/answers/plan/review.js';
import { heldLadder } from '../../src/answers/plan/held.js';
import { heldMixSettings } from '../../src/answers/plan/move.js';
import { heldMixOf, moveReadingOf, giltsCountOf } from '../../src/reading/holdings.js';
import { REVIEW } from '../../src/v7/copy/review.js';
import { GILTS_HELD_FIND, HELD_PENSION_MIX_SLOTS } from '../../src/reading/sentenceMarks.js';
import { waitingHtml } from '../../src/ui/components/TransitionView.js';
import { MOVE } from '../../src/v7/copy/move.js';
import { partnerPlanSettingsOf } from '../../src/ui/planStartUi.js';
import { deriveTiming, taxYearStartOf } from '../../src/services/PlanTiming.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const entriesOf = (key) => upgradedList(FIXTURES.find((f) => f.key === key).plans(), NOW);
const subjectOf = (key) => FIXTURES.find((f) => f.key === key).subject;

describe('the review\'s "n of m" is the one count (problem 2)', () => {
  it('Moving on a ladder, once what is held was accepted, the review says what the move page says', () => {
    const key = 'retired-locked-ladder';
    const entries = entriesOf(key), id = subjectOf(key);
    const plan = entries.find((e) => e.plan.id === id).plan;
    // and a second of the plan's gilts held in part (half its units): fictional, made for this test
    plan.holdings = { ...plan.holdings, lines: [...plan.holdings.lines, { wrapper: 'SIPP', ticker: 'T29', name: '0 1/8% Index-linked Treasury Gilt 2029', units: 16500, value: 21000, kind: 'gilt' }] };
    const pg = planPage(entries, id, null, { today: PARITY_DAY });
    for (const agreed of [null, { at: '2026-11-10T09:00:00.000Z' }]) {
      const life = { ...(pg.life || {}), key: 'moving', agreed };
      const R = reviewOf(entries, id, { today: PARITY_DAY, page: { ...pg, life } });
      const { m } = moveReadingOf(plan, { now: NOW, life });
      const gc = giltsCountOf(m.target, m.diff, { agreed: !!agreed });
      expect(R.moving.ladder, String(!!agreed)).toBeTruthy();
      expect(R.moving.ladder.held, String(!!agreed)).toBe(gc.counted);
      expect(R.moving.ladder.needed).toBe(gc.total);
      if (agreed) {
        const h = heldLadder(plan, { today: PARITY_DAY, life });
        expect(R.moving.ladder.held).toBe(h.gilts.held);
        // the fixture holds a gilt in part, so the agreement is what tells the two counts apart
        expect(gc.part).toBeGreaterThan(0);
        expect(gc.counted).toBeGreaterThan(gc.held);
      }
    }
  });
  it('the review\'s words carry the count where the one mark finds it', () => {
    const text = REVIEW.moving.ladder.replace('{held}', '2').replace('{needed}', '12');
    expect(GILTS_HELD_FIND.exec(text)[1]).toBe('2 of 12');
    const src = readFileSync('src/v7/screens/plan/ReviewScreen.jsx', 'utf8');
    expect(src).toMatch(/markIn\(fill\(W\.moving\.ladder[^)]*\)[^\n]*GILTS_HELD_FIND, 'gilts\.held'/);
  });
});

describe('what is held in the pension, as a mix: one reader (problem 3)', () => {
  it('the test\'s split and its words are the reader\'s, pension lines alone', () => {
    const plan = entriesOf('retired-everything').find((e) => e.plan.id === subjectOf('retired-everything')).plan;
    const pension = heldMixOf(plan, { pension: true });
    const all = heldMixOf(plan);
    expect(pension).toBeTruthy();
    const h = heldMixSettings(plan, { today: PARITY_DAY });
    expect(h.pcts).toEqual({ shares: pension.shares, bonds: pension.bonds, diversifiers: pension.diversifiers, cash: pension.cash });
    expect(h.fromPension).toBe(true);
    // across every account is a different figure, read by the same reader with its own mark
    expect(all).not.toEqual(pension);
    // move.js works out no proportions of its own any more
    const src = readFileSync('src/answers/plan/move.js', 'utf8');
    const body = src.slice(src.indexOf('export function heldMixSettings'), src.indexOf('// ---- the writes'));
    expect(body).not.toContain('proportions(');
    expect(body).toContain('heldMixPartsOf(');
  });
  it('the waiting saver\'s line is marked in both views, each figure once', () => {
    const w = { yearsToStart: '3', opens: 'May 2029', held: { pcts: { shares: 64, bonds: 27, diversifiers: 0, cash: 9 } } };
    const html = waitingHtml(w);
    for (const b of ['shares', 'bonds', 'diversifiers', 'cash']) expect(html).toContain('data-fact="' + HELD_PENSION_MIX_SLOTS[b] + '">' + w.held.pcts[b] + '<');
    expect(MOVE.waiting.heldMix).toContain('{shares}');
    const screen = readFileSync('src/v7/screens/plan/MoveScreen.jsx', 'utf8');
    expect(screen).toMatch(/fillMarked\(S\.heldMix, V\.held\.pcts, HELD_PENSION_MIX_SLOTS\)/);
    expect(screen).toMatch(/fillMarked\(C\.result, [^\n]*HELD_PENSION_MIX_SLOTS\)/);
  });
});

describe('a partner\'s plan made in the full view never stops in the past (problem 1)', () => {
  const thisTY = taxYearStartOf(NOW);
  it('a stop age given above the age today: stopping in a month ahead', () => {
    const r = partnerPlanSettingsOf({ ageToday: 52, stopAge: 60, stopped: false }, NOW);
    expect(r.ok).toBe(true);
    expect(r.stressSettings).toMatchObject({ currentAge: 52, currentAgeAsOf: PARITY_DAY, retired: false, retireAge: 60 });
    expect(r.stressSettings.configured).toBeUndefined();
    expect(deriveTiming(r.stressSettings, NOW).startMonth > PARITY_DAY.slice(0, 7)).toBe(true);
    expect(r.ages).toEqual({ currentAge: 52, currentAgeAsOf: PARITY_DAY, retired: false, retirementAge: 60 });
  });
  it('a stop age at or below the age today, not ticked: already stopped, the plan starts this tax year', () => {
    const r = partnerPlanSettingsOf({ ageToday: 63, stopAge: 60, stopped: false }, NOW);
    expect(r.ok).toBe(true);
    expect(r.stressSettings).toMatchObject({ currentAge: 63, retired: true, retireAge: null, firstTaxYear: thisTY });
    const t = deriveTiming(r.stressSettings, NOW);
    expect(t.mode).toBe('retired');
    expect(r.ages.retired).toBe(true);
  });
  it('ticked as stopped: already stopped', () => {
    const r = partnerPlanSettingsOf({ ageToday: 68, stopAge: null, stopped: true }, NOW);
    expect(r.stressSettings).toMatchObject({ currentAge: 68, retired: true, retireAge: null, firstTaxYear: thisTY });
  });
  it('an age with no stop age and not stopped is asked for: no stop age nobody gave', () => {
    expect(partnerPlanSettingsOf({ ageToday: 45, stopAge: null, stopped: false }, NOW)).toEqual({ ok: false, problem: 'noStop' });
  });
  it('no age given: nothing about when is stored', () => {
    expect(partnerPlanSettingsOf({ ageToday: null, stopAge: 60, stopped: false }, NOW)).toEqual({ ok: true, stressSettings: {}, ages: null });
  });
  it('the Household tab makes the plan through it, and writes no budget age nobody gave', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('window.createPartnerPlanReal = async function');
    const body = src.slice(at, src.indexOf('location.reload()', at));
    expect(body).toContain('partnerPlanSettingsOf(');
    expect(body).not.toContain('theirs.retirementAge = mine.partnerRetirementAge || theirs.retirementAge');
    expect(body).not.toContain('{ currentAge: ageGiven, currentAgeAsOf: dayKeyOf(todayOf()) }');
  });
});

describe('the Household tab\'s "Create their plan" boxes (problem 1)', () => {
  it('start from what this plan\'s Budget knows about the partner, empty where it knows nothing, and are read as typed', async () => {
    const { JSDOM } = await import('jsdom');
    const { installHouseholdTab, newPartnerPlanTyped } = await import('../../src/ui/householdTabUi.js');
    const dom = new JSDOM('<body><input id="hhOwnPlan"><select id="hhPartnerSelect"></select><p id="hhLinkedBy"></p><p id="hhTheirLine"></p>'
      + '<input id="hhNewPlanName"><input id="hhNewPlanAge" type="number"><input id="hhNewPlanStopAge" type="number"><input id="hhNewPlanStopped" type="checkbox"></body>');
    const doc = dom.window.document, win = {};
    let budget = { partnerAge: 52, partnerRetirementAge: 60, partnerRetired: false };
    installHouseholdTab(win, doc, { listScenariosAsync: async () => [], getActiveScenarioId: async () => 'p1', setHouseholdPartnerId: async () => {}, showToast: () => {}, now: () => NOW, getBudgetAsync: async () => budget });
    await win.loadHouseholdUI();
    expect([doc.getElementById('hhNewPlanAge').value, doc.getElementById('hhNewPlanStopAge').value, doc.getElementById('hhNewPlanStopped').checked]).toEqual(['52', '60', false]);
    doc.getElementById('hhNewPlanName').value = '  Sam ';
    expect(newPartnerPlanTyped(doc)).toEqual({ name: 'Sam', age: 52, stopAge: 60, stopped: false });
    // a plan whose Budget knows nothing of them: the boxes are emptied, never left with another plan's figures (R2)
    budget = { partnerAge: null, partnerRetirementAge: null, partnerRetired: false };
    await win.loadHouseholdUI();
    expect([doc.getElementById('hhNewPlanAge').value, doc.getElementById('hhNewPlanStopAge').value]).toEqual(['', '']);
    expect(newPartnerPlanTyped(doc)).toEqual({ name: 'Sam', age: null, stopAge: null, stopped: false });
  });
});

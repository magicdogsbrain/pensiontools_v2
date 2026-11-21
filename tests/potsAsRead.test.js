/**
 * Pots as read (7.12.0): a default is never a figure, and a new stop age says what it does to the pension then.
 * src/services/PlanReading.js withPensionToday / withDerivedPots, src/ui/draftPlanLine.js blankUnsetPots,
 * src/answers/plan/about.js (the toast's line). Every person and figure here is made up.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { withoutPotsAsOf } from '../src/services/PlanFromToday.js';
import { getDefaultScenario } from '../src/storage/ScenarioRepository.js';
import { blankUnsetPots } from '../src/ui/draftPlanLine.js';
import { seedToScenario } from '../src/services/PlanSeed.js';
import { aboutOf } from '../src/answers/plan/about.js';
import { tryBoxesOf, checkTry, tryDifferencesOf } from '../src/answers/plan/lasts.js';
import { LASTS } from '../src/v7/copy/lasts.js';
const fill = (t, s) => String(t).replace(/\{(\w+)\}/g, (m, k) => (k in s ? s[k] : m));
import { ABOUT } from '../src/v7/copy/about.js';
import { seedA } from './integration/fixtures/planSeeds.js';

const NOW = new Date(2026, 10, 16, 12);
const potsOf = (s) => (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0);

/** Sam: a plan straight from the full view's wizard (its Stress pots the defaults), £150,000 typed on the Accumulation tab. */
function sam(potNow = 150000) {
  const plan = getDefaultScenario('Sam');
  plan.id = 'sam';
  plan.accumulationTool = { settings: potNow == null ? {} : { potNow }, history: [] };
  return plan;
}

describe('a plan with no figures reads no default as a figure', () => {
  it('Sam: the pots are the pension typed on the Accumulation tab, split as stored (before: the defaults, £500,000)', () => {
    const stored = sam().stressTool.settings;
    expect(stored.configured).not.toBe(true);
    // the stored split is 250,000 / 200,000 / 50,000: a half, two fifths and a tenth
    expect([stored.equityMin, stored.bondMin, stored.cashTarget]).toEqual([250000, 200000, 50000]);
    const s = effectiveStressSettings(sam(), { now: NOW });
    expect(potsOf(s)).toBe(150000);
    expect([s.equityMin, s.bondMin, s.cashTarget]).toEqual([150000 / 2, 150000 * 2 / 5, 150000 / 10]);
    expect(s.potsNotSet).toBeUndefined();
  });

  it('nothing known anywhere: the pots are marked not set, and the plan is not changed', () => {
    const plan = sam(null);
    const before = JSON.parse(JSON.stringify(plan));
    const s = effectiveStressSettings(plan, { now: NOW });
    expect(s.potsNotSet).toBe(true);
    expect(plan).toEqual(before);
    // never saved: the mark is stripped wherever potsAsOf is
    expect('potsNotSet' in withoutPotsAsOf(s)).toBe(false);
  });

  it('the full view shows the pot box empty, "Not set yet", and puts it back once a pot is known', () => {
    const box = { value: '500000', placeholder: '' };
    const doc = { getElementById: (id) => (id === 'ssPot' ? box : null) };
    blankUnsetPots(doc, { potsNotSet: true });
    expect(box).toEqual({ value: '', placeholder: 'Not set yet' });
    box.value = '150000';
    blankUnsetPots(doc, { equityMin: 75000 });
    expect(box).toEqual({ value: '150000', placeholder: '' });
  });

  it('the full view: the shares, bonds and cash under the empty pot box are not the defaults either', () => {
    // 7.12.0: before, the amounts under the box still read the stored £250,000 / £200,000 / £50,000 until a pot was typed
    const box = { value: '500000', placeholder: '' };
    const amounts = { innerHTML: '<div>Shares £250,000 · Bonds £200,000 · Cash £50,000</div>', textContent: '' };
    const doc = { getElementById: (id) => (id === 'ssPot' ? box : id === 'ssAllocAmounts' ? amounts : null) };
    blankUnsetPots(doc, { potsNotSet: true });
    expect(amounts.innerHTML).not.toMatch(/£/);
    expect(amounts.innerHTML).toContain('Not set yet');
  });

  it('"Try a change of your own" starts with the pot box empty when no pension is known, and says the plan has none', () => {
    // 7.12.0: the box read the stored £500,000 default as the plan's pot, and "What's different" said "(the plan: £500,000)"
    const plan = sam(null);
    expect(tryBoxesOf(plan, { today: '2026-11-16' })['try.pot']).toBe('');
    expect(checkTry(plan, {}, { today: '2026-11-16' }).errors['try.pot']).toBe('required');
    const ss = effectiveStressSettings(plan, { now: NOW });
    const d = tryDifferencesOf(ss, { ...ss, strategyParams: { sippTotal: 300000 }, isaBalance: ss.isaBalance || 0 });
    expect(d.find((x) => x.id === 'pot')).toEqual({ id: 'pot', slots: { pot: 300000, old: null } });
    expect(fill(LASTS.try.diffs.potNotSet, { pot: '£300,000' })).toBe('The pension pot: £300,000 (the plan has none set yet).');
    // a plan with a pension known keeps its figure in the box
    expect(tryBoxesOf(sam(), { today: '2026-11-16' })['try.pot']).toBe('150000');
  });

  it('a plan with figures is read as stored', () => {
    const plan = sam();
    plan.stressTool.settings = { ...plan.stressTool.settings, configured: true };
    expect(potsOf(effectiveStressSettings(plan, { now: NOW }))).toBe(500000);
  });
});

describe('a new stop age says what it does to the pension then', () => {
  const TODAY = '2026-10-02';
  const kept = () => { const p = seedToScenario(seedA(), new Date(2026, 9, 2)).yours; p.id = 'alex'; return p; };

  it('Alex stops a year sooner: the toast says the pension then, before and after, from the plan as read', () => {
    const plan = kept();
    const at60 = effectiveStressSettings(plan, { now: new Date(2026, 9, 2) }).potAtRetirement;
    const v = aboutOf([{ plan }], 'alex', { today: TODAY, typed: { stopAge: '59' } });
    expect(v.patch['stressTool.settings.retireAge']).toBe(59);
    const at59 = effectiveStressSettings({ ...plan, stressTool: { ...plan.stressTool, settings: { ...plan.stressTool.settings, retireAge: 59, shapeAgeNow: 59, firstTaxYear: v.patch['stressTool.settings.firstTaxYear'] } } }, { now: new Date(2026, 9, 2) }).potAtRetirement;
    expect(at59.sipp).toBeLessThan(at60.sipp);   // a year less of growth and paying in
    const k = (n) => '£' + (Math.round(n / 1000) * 1000).toLocaleString('en-GB');
    expect(v.savedLine).toEqual({ id: 'runsToPot', slots: { endAge: 95, years: v.savedLine.slots.years, stopAge: 59, potAfter: k(at59.sipp), potBefore: k(at60.sipp), stopBefore: 60 } });
    const words = ABOUT.toast.runsToPot.replace(/\{(\w+)\}/g, (m, key) => String(v.savedLine.slots[key]));
    expect(words).toBe(`Saved. Your plan now runs ${v.savedLine.slots.years} years, to age 95. Stopping at 59, your pension then could be ${k(at59.sipp)} (${k(at60.sipp)} stopping at 60).`);
  });

  it('a figure once typed for the day they stop is not read (step F1, lead4.md D4): the new stop\'s pension is said all the same', () => {
    const plan = kept();
    plan.stressTool.settings.potAtRetirement = { sipp: 400000, isa: 30000, source: 'override' };
    const v = aboutOf([{ plan }], 'alex', { today: TODAY, typed: { stopAge: '59' } });
    expect(v.savedLine.id).toBe('runsToPot');
    expect(v.savedLine).toEqual(aboutOf([{ plan: kept() }], 'alex', { today: TODAY, typed: { stopAge: '59' } }).savedLine);
  });

  it('no change of stop age: the line is as before', () => {
    const plan = kept();
    const v = aboutOf([{ plan }], 'alex', { today: TODAY, typed: { endAge: '96' } });
    expect(v.savedLine).toEqual({ id: 'runsTo', slots: { endAge: 96, years: v.savedLine.slots.years } });
  });
});

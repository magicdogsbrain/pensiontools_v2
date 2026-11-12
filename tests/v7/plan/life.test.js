/**
 * 7.8.0 on a saved plan (the build spec's sections 1, 6 and 8; research/v7/replan-nov-2026.md 5): the chance the money lasts
 * as long as you do, beside the fixed-age count.
 *  - every way of drawing in the registry is classed; the ones the weighted run follows on give every future the same first
 *    failed year within the plan's years as the plan's own run;
 *  - headYear is taken before the closed years' cut rewrites failYear;
 *  - lifeOf writes nothing and reads the kept answer's sex, household and level;
 *  - the weighted part: a run with no failure is 1; one sentence per failKind; duration-shaped, linked or couple and stored
 *    results have no weighted figure and lead with the fixed-age line, with its age;
 *  - "Does it last?" weighing: the extra run, the level, the band's words; not weighing, the result it always was;
 *  - a new document stores `success` with its lines and no functions, both apps' way; an old one reads as written;
 *  - the weighted on-course pot is no more than the 9-in-10 count's; the check-in's reading of the level;
 *  - both apps suggest the same plan-to age, not said reading the women's figures.
 * All fictional (the test corpus; Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { STRATEGY_LIFE, DURATION_SHAPED, lifeOf, lifeOfSettings, planLevelOf, weightedReasonOf, weightedYearsOf } from '../../../src/answers/plan/life.js';
import { runLasts, runForDocument, planFor, weightedPlanFor, onCourseOptsOf, weighing, documentSuccessOf, successOf } from '../../../src/answers/plan/lastsRun.js';
import { verdictOf, verdictWord, boldConsequenceOf } from '../../../src/answers/plan/lasts.js';
import { lockedLastsWords } from '../../../src/answers/plan/read.js';
import { lockPatch } from '../../../src/answers/plan/lock.js';
import { aboutOf } from '../../../src/answers/plan/about.js';
import { oneAnswer, weightedFailsOf, headYearsOf } from '../../../src/services/OneAnswer.js';
import { LEGACY_DEFINITION, definitionOf } from '../../../src/services/PlanDocument.js';
import { longevityAge } from '../../../src/services/LongevityModel.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { stressTestStrategy, STRATEGY_NAMES, requiredPotForStrategy } from '../../../src/strategies/stressTest.js';
import { ON_COURSE_SHARE } from '../../../src/services/OnCourse.js';
import { SUCCESS, RULES, WEIGHT_ONE } from '../../../src/answers/shared/rules.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const plain = (v) => JSON.parse(JSON.stringify(v));
const settingsOf = (name, over = {}) => ({ ...effectiveStressSettings(entryOf(C[name]).plan, { now }), ...over });

describe('every way of drawing is classed, and the ones followed on keep the plan\'s own futures', { timeout: 120_000 }, () => {
  it('the registry and the classes are the same list; the gilt ladders are shaped by the plan\'s length', () => {
    expect(Object.keys(STRATEGY_LIFE).sort()).toEqual(Object.keys(STRATEGY_NAMES).sort());
    for (const v of Object.values(STRATEGY_LIFE)) expect(['extends', 'durationShaped']).toContain(v);
    for (const id of ['full-il-gilt', 'gilt-rotation']) expect(DURATION_SHAPED).toContain(id);
    expect(SUCCESS.weighted).toBe(false);   // the switch is step 8's
  });
  for (const id of Object.keys(STRATEGY_LIFE).filter((k) => STRATEGY_LIFE[k] === 'extends')) {
    it(`${id}: followed on 12 more years, every future fails in the same year within the plan's years (and runs on after)`, () => {
      const s = settingsOf('02-pnv-draft', { strategyId: id });
      const p = planFor(s, now);
      const r = stressTestStrategy(id, p);
      const pW = weightedPlanFor(s, p, p.durationYears + 12, now);
      expect(pW.durationYears).toBe(p.durationYears + 12);
      expect(pW.pnvCfg.duration).toBe(p.pnvCfg.duration);
      const rW = stressTestStrategy(id, pW);
      const N = p.durationYears;
      expect('headYear' in r.futuresMc).toBe(false);   // nothing cut: the result is the object it always was
      const first = (run, i) => (run.survivedMc[i] === false ? headYearsOf(run)[i] : null);
      let late = 0;
      for (let i = 0; i < r.survivedMc.length; i++) {
        const own = first(r, i), w = first(rW, i);
        expect(w !== null && w < N ? w : null, `future ${i}`).toBe(own);
        if (w !== null && w >= N) late++;
      }
      expect(late).toBeGreaterThan(0);   // the longer run sees failures the plan's own cannot
    });
  }
  it('the run years reach the weighting age, never past 60 years (the cap said)', () => {
    const life = lifeOfSettings({ currentAge: 30, currentAgeAsOf: '2026-01-01' }, now, { startAge: 30 });
    const w = weightedYearsOf(life, { startAge: 30, durationYears: 40 });
    expect(w).toEqual({ years: RULES.maxDrawYears, capped: true, extend: true });
    const old = lifeOfSettings({ currentAge: 70, currentAgeAsOf: '2026-01-01' }, now, { startAge: 70 });
    expect(weightedYearsOf(old, { startAge: 70, durationYears: 40 })).toEqual({ years: 40, capped: false, extend: false });
  });
});

describe('headYear is the strategy\'s own failed year, taken before the closed years\' cut', { timeout: 120_000 }, () => {
  it('a plan whose holder cannot draw yet and has nothing else: the cut marks every future, headYear only the ones that failed', () => {
    const s = settingsOf('02-pnv-draft', { currentAge: 50, currentAgeAsOf: '2026-06-01', retired: true, stoppedWork: '2026-06', firstTaxYear: 2026, shapeAgeNow: 51,
      spStartDate: '1 June 2044', spWeeklyAmount: 230, incomeShape: 'level', incomeSteps: [], targetSchedule: null, baseSalary: 30000,
      equityMin: 600000, bondMin: 250000, cashTarget: 50000, isaBalance: 0, duration: 40, strategyParams: {}, strategyId: 'ladder-and-ratchet' });
    const p = { ...planFor(s, now), mcRuns: 60 };
    expect(p.pensionLock && p.pensionLock.years).toBeGreaterThan(0);
    const r = stressTestStrategy('ladder-and-ratchet', p);
    expect(r.affordable).toBe(true);
    const f = r.futuresMc;
    expect(f.failYear.every((fy) => fy === 0)).toBe(true);   // the cut: every future first short in year 0
    expect(headYearsOf(r)).toBe(f.headYear);
    f.headYear.forEach((hy, i) => {
      if (r.survivedMc[i] === false) expect(hy, `future ${i}`).not.toBe(null);
      else expect(hy, `future ${i}`).toBe(null);
    });
  });
});

describe('lifeOf: the person on a saved plan, read, never written', () => {
  it('writes nothing; the age is exact, the year of birth a fraction, not said reads the women\'s figures', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const before = JSON.stringify(plan);
    const s = effectiveStressSettings(plan, { now });
    const life = lifeOf(plan, now, { settings: s, startAge: 62 });
    expect(JSON.stringify(plan)).toBe(before);
    expect(life.sex).toBe('f');
    expect(life.sexGiven).toBe(false);
    expect(life.people[0].by % 1).not.toBe(0);
    expect(life.weightToAge).toBeGreaterThan(life.planToAge);
    expect(life.reason).toBe(null);
  });
  it('the kept answer\'s sex for its person, and why a couple\'s or a linked plan has no weighted figure yet', () => {
    const base = entryOf(C['02-pnv-draft']).plan;
    const s = effectiveStressSettings(base, { now });
    const man = { ...base, fromAnswer: { who: 'you', inputs: { household: 'single', you: { sex: 'male' } }, answer: { level: 'bold', levelChosen: true } } };
    expect(lifeOf(man, now, { settings: s }).sex).toBe('m');
    expect(lifeOf(man, now, { settings: s }).sexGiven).toBe(true);
    expect(planLevelOf(man)).toBe('bold');
    expect(planLevelOf({ ...man, fromAnswer: { ...man.fromAnswer, answer: { level: 'bold', levelChosen: false } } })).toBe('balanced');
    expect(planLevelOf(base)).toBe('balanced');
    const partner = { ...base, fromAnswer: { who: 'partner', household: 'couple', inputs: { household: 'couple', you: { sex: 'male' }, partner: { sex: 'female' } } } };
    expect(lifeOf(partner, now, { settings: s }).sex).toBe('f');
    expect(lifeOf(partner, now, { settings: s }).reason).toBe('couple');
    expect(lifeOf({ ...base, household: { partnerScenarioId: 'Other01' } }, now, { settings: s }).reason).toBe('linked');
  });
});

/** A result as stressTestStrategy returns it, made up: `lost` the futures that failed, by run year. */
const fake = (strategyId, lost, n = 20, more = {}) => {
  const survivedMc = Array.from({ length: n }, (_, i) => !(i in lost));
  const headYear = survivedMc.map((ok, i) => (ok ? null : lost[i]));
  return { strategyId, affordable: true, ruin: { mc: 100 * Object.keys(lost).length / n, hist: 0 }, n: { mc: n, hist: 10 }, terminal: { p10: 0, p50: 150000, p90: 600000 }, survivedMc, futuresMc: { headYear, failYear: headYear.slice() }, ...more };
};
const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1 };

describe('the weighted part of one answer', () => {
  it('no future fails (a contract): weighted is 1, the words say every future, no floor line', () => {
    const a = oneAnswer(fake('full-il-gilt', {}), P, { life: LIFE });
    expect(a.weighted).toBe(1);
    expect(a.sumW).toBe(0);
    expect(a.verdict).toBe('yes');
    expect(a.floor).toBe(null);
    expect(a.words.headline).toMatch(/in every future we tried\.$/);
    expect(a.words.fixed).toBe('If you live to 96, the money lasts that long in every future we tried.');
  });
  it('each failure counts by the chance someone is alive in the year it failed: late ones count for less; weights are whole', () => {
    const early = oneAnswer(fake('pots-and-valves', { 3: 10, 7: 12 }), P, { life: LIFE });
    const late = oneAnswer(fake('pots-and-valves', { 3: 28, 7: 30 }), P, { life: LIFE });
    expect(early.fixedAge).toBe(late.fixedAge);
    expect(late.weighted).toBeGreaterThan(early.weighted);
    expect(Number.isInteger(early.sumW)).toBe(true);
    expect(early.sumW).toBeLessThanOrEqual(2 * WEIGHT_ONE);
    const f = weightedFailsOf(fake('pots-and-valves', { 3: 28, 7: 30 }), LIFE, 66, 30);
    expect(f.sumW).toBe(late.sumW);
  });
  it('one sentence per failKind; the floor, what is left and what we assumed', () => {
    const ran = oneAnswer(fake('pots-and-valves', { 1: 22, 2: 25 }), P, { life: LIFE, floorAt: () => 12500 });
    expect(ran.failKind).toBe('ran-out');
    expect(ran.words.headline).toMatch(/^Counting how long people your age live, the money lasts as long as you do .+ in 20\.$/);
    expect(ran.words.floor).toBe('If the money ran out at 88, you would still have £12,500 a year after tax from the income you get anyway.');
    expect(ran.words.left).toBe('If you live to 96, what is typically left then is £150,000 at today\'s prices. In the best 1 in 10 futures it is £600,000 or more.');
    expect(ran.words.assumed.join(' ')).toMatch(/We tested to 96, the age your plan runs to\./);
    expect(ran.words.assumed.join(' ')).toMatch(/figures for women/);
    const cut = oneAnswer(fake('gilt-rotation', { 1: 22 }, 20, { ruinLabel: 'chance the rotated years are cut' }), P, { life: LIFE });
    expect(cut.failKind).toBe('cut');
    expect(cut.words.headline).toMatch(/your income is paid in full as long as you live/);
    expect(cut.words.fixed).toMatch(/your income is paid in full that long/);
    const lean = oneAnswer(fake('floor-and-flex', { 1: 22 }, 20, { ruinLabel: 'chance of a lean year' }), P, { life: LIFE });
    expect(lean.failKind).toBe('lean');
    expect(lean.words.headline).toMatch(/you have no lean year while you are alive/);
    for (const a of [ran, cut, lean]) for (const w of [a.words.headline, a.words.fixed, a.words.left, ...a.words.assumed]) {
      expect(w).not.toMatch(/NaN|undefined|null/);
      if (w === a.words.headline) expect(w).not.toMatch(/futures we tried/);
    }
    // before the State Pension starts, nothing comes in until it does
    const sp = oneAnswer(fake('pots-and-valves', { 1: 0 }), { ...P, spStartYear: 3 }, { life: LIFE, floorAt: () => 0 });
    expect(sp.words.floor).toBe('If the money ran out at 66, nothing would come in until your State Pension starts at 69.');
  });
  it('duration-shaped, linked or couple, and stored results: no weighted figure, the fixed-age line leads with its age, and why', () => {
    for (const reason of ['durationShaped', 'linked', 'couple']) {
      const a = oneAnswer(fake('full-il-gilt', { 1: 5 }), P, { life: { ...LIFE, reason } });
      expect(a.weighted, reason).toBe(null);
      expect(a.words.headline).toBe(null);
      // (the age the plan runs to as the plan says it, 66 + 31 − 1; a couple's plan counts while one of you is alive)
      expect(a.words.fixed).toMatch(reason === 'couple' ? /^If one of you is still alive when you are 96, / : /^If you live to 96, /);
      expect(a.words.why).toMatch(/96/);
    }
    const stored = oneAnswer(fake('full-il-gilt', {}), P, { life: LIFE, stored: { chance: null } });
    expect(stored.weighted).toBe(null);
    expect(stored.reason).toBe('stored');
    expect(oneAnswer(fake('full-il-gilt', {}), P, { life: LIFE, stored: { chance: 0.97 } }).weighted).toBe(0.97);
    // the class decides only when the plan ends before the weighting age
    expect(weightedReasonOf(LIFE, 'full-il-gilt', { startAge: 66, durationYears: 31 })).toBe('durationShaped');
    expect(weightedReasonOf(LIFE, 'full-il-gilt', { startAge: 66, durationYears: 40 })).toBe(null);
    expect(weightedReasonOf(LIFE, 'pots-and-valves', { startAge: 66, durationYears: 31 })).toBe(null);
  });
  it('without `life` the answer is the object it always was', () => {
    const r = fake('pots-and-valves', { 1: 22 });
    expect(Object.keys(oneAnswer(r, P))).not.toContain('weighted');
    expect(oneAnswer(r, P, null)).toEqual(oneAnswer(r, P));
  });
  it('the verdict word at the level; Bold carries its consequence in the band', () => {
    const a = oneAnswer(fake('pots-and-valves', { 1: 22, 2: 25, 3: 27 }), P, { life: LIFE, level: 'bold', floorAt: () => 12500 });
    expect(a.level).toBe('bold');
    expect(verdictWord(a.share, a)).toBe(a.verdict);
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: { family: true, cutsOn: true, cutPct: 20, months: 3 } }, { endAge: 97 });
    expect(v.id).toBe('lasts.headlineW');
    // (Bold's consequence from the plan's own weighted chance, never a fixed "3 in 10")
    expect(v.slots.bold).toBe(' ' + boldConsequenceOf(a));
    expect(v.sub.id).toBe('lasts.subFixed');
    // what is left is said once, by the weighted band (to the nearest £1,000)
    expect(v.rows.map((r) => r.id)).toEqual(expect.arrayContaining(['floorW', 'leftW', 'assumedW']));
    expect(v.rows.map((r) => r.id)).not.toContain('left');
    expect(verdictWord(0.95)).toBe('yes');   // without a weighted part, the count as before
  });
});

describe('"Does it last?" weighing, and the rollback', { timeout: 240_000 }, () => {
  it('weighing: the run to the weighting age, the level, the weighted and fixed-age figures; the band reads them', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const progress = [];
    const out = runLasts(plan, { today: TODAY, weighted: true, onProgress: (d, t) => progress.push([d, t]) });
    expect(progress).toEqual([[0, 3], [1, 3], [2, 3]]);
    expect(out.level).toBe('balanced');
    const a = out.a;
    expect(a.weighted).toBeGreaterThan(0);
    expect(a.fixedAge).toBe(a.share);
    expect(a.weightToAge).toBeGreaterThan(a.planToAge);
    expect(plain(out)).toEqual(out);
    const v = verdictOf(out, { endAge: a.planToAge });
    expect(v.id).toBe('lasts.headlineW');
    expect(v.sub.slots.words).toMatch(new RegExp('^If you live to ' + a.planToAge + ', '));
    // not weighing (SUCCESS.weighted false): the result it always was
    const off = runLasts(plan, { today: TODAY });
    expect('level' in off).toBe(false);
    expect('weighted' in off.a).toBe(false);
    expect(off.a.chancePct).toBe(a.chancePct);
  });
  it('a linked plan, a way shaped by the plan\'s length and a locked ladder: no weighted figure, each with its reason', () => {
    expect(runLasts(entryOf(C['09-couple-a']).plan, { today: TODAY, weighted: true }).a.reason).toBe('linked');
    expect(runLasts(entryOf(C['07-pre-6.13-flat-params']).plan, { today: TODAY, weighted: true }).a.reason).toBe('durationShaped');
    const locked = runLasts(entryOf(C['03-gilt-ladder-locked']).plan, { today: TODAY, weighted: true });
    expect(locked.a.reason).toBe('stored');
    expect(locked.a.weighted).toBe(null);
  });
  it('the weighing switch: a test\'s own, else SUCCESS.weighted', () => {
    expect(weighing({})).toBe(SUCCESS.weighted);
    expect(weighing({ weighted: true })).toBe(true);
  });
});

describe('the plan document records its definition; an old one reads as written', { timeout: 240_000 }, () => {
  it('a new document (weighing) stores success with its lines and no functions; not weighing, none', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const run = runForDocument(plan, { today: TODAY, weighted: true });
    expect(run.success).toMatchObject({ level: 'balanced', levelFails20: 2, lines: { yes: 0.9, close: 0.85 }, planTo: { rule: 'plan' }, weighted: { joint: false, sex: 'f', sexGiven: false } });
    expect(run.success.weighted.chance).toBeGreaterThan(0);
    expect(plain(run.success)).toEqual(run.success);
    const P1 = lockPatch(plan, { now, run, entries: [{ plan }] });
    expect(P1.patch.planDocument.assumptions.success).toEqual(run.success);
    expect(definitionOf(P1.patch.planDocument)).toEqual(run.success);
    const off = runForDocument(plan, { today: TODAY });
    expect('success' in off).toBe(false);
    const P0 = lockPatch(plan, { now, run: off, entries: [{ plan }] });
    expect('success' in P0.patch.planDocument.assumptions).toBe(false);
    expect(definitionOf(P0.patch.planDocument)).toBe(LEGACY_DEFINITION);
    // both apps lock through the same block
    const s = effectiveStressSettings(plan, { now });
    const p = planFor(s, now);
    const r = stressTestStrategy(s.strategyId, p);
    expect(documentSuccessOf(plan, { settings: s, strategyId: s.strategyId, p, r, now, weighted: true })).toEqual(run.success);
    expect(documentSuccessOf(plan, { settings: s, strategyId: s.strategyId, p, r, now })).toBe(null);
    expect(successOf(null)).toBe(null);
  });
  it('an old document: lastsRun\'s stored figure and read.js\'s words as it was locked, the counting said once weighing', () => {
    const plan = entryOf(C['03-gilt-ladder-locked']).plan;
    const doc = plan.planDocument;
    expect(definitionOf(doc)).toBe(LEGACY_DEFINITION);
    const before = JSON.stringify(plan);
    const off = runLasts(plan, { today: TODAY });
    const on = runLasts(plan, { today: TODAY, weighted: true });
    expect(JSON.stringify(plan)).toBe(before);   // opening writes nothing
    expect(on.stored.a).toEqual(off.stored.a);
    expect(on.stored.note).toBe(off.stored.note);
    expect(on.stored.success).toBe(null);
    const a = oneAnswer(doc.strategy.r, doc.strategy.p);
    expect(lockedLastsWords(doc, a, doc.strategy.p, false)).toBe('Your plan lasts ' + a.outOfTen.words);
    expect(lockedLastsWords(doc, a, doc.strategy.p, true)).toMatch(/; when it was locked, counted to \d+; not by how long you might live$/);
  });
});

describe('"Am I on course?" at the level', { timeout: 240_000 }, () => {
  it('not weighing: 9 futures in 10, as before; weighing: the level on the run to the weighting age, a pot no bigger than the count\'s', () => {
    const s = settingsOf('02-pnv-draft');
    const p = planFor(s, now);
    expect(onCourseOptsOf(s, p, 'pots-and-valves', now)).toBe(ON_COURSE_SHARE);
    const how = onCourseOptsOf(s, p, 'pots-and-valves', now, { weighted: true });
    expect(how.level).toBe('balanced');
    expect(how.planW.durationYears).toBeGreaterThan(p.durationYears);
    const count = requiredPotForStrategy('pots-and-valves', p, ON_COURSE_SHARE);
    const weighted = requiredPotForStrategy('pots-and-valves', p, how);
    expect(weighted.weighted).toBe(true);
    expect(weighted.requiredPot).toBeLessThanOrEqual(count.requiredPot);
    // a way shaped by the plan's length: the count to the plan's own age, said
    const g = onCourseOptsOf({ ...s, strategyId: 'full-il-gilt' }, p, 'full-il-gilt', now, { weighted: true });
    expect(g.planW).toBe(null);
  });
});

describe('both apps suggest the same plan-to age; not said reads the women\'s figures', () => {
  it('V7\'s About and the classic\'s helper', () => {
    const plan = entryOf(C['10-couple-b']).plan;
    for (const [sex, key] of [['notSaid', 'f'], ['f', 'f'], ['m', 'm']]) {
      const a = aboutOf([{ plan }], plan.id, { today: TODAY, typed: { sex, chance: '10' } });
      expect(a.suggestion.endAge, sex).toBe(longevityAge(58, sex, 10, TODAY));
      expect(a.suggestion.endAge, sex).toBe(longevityAge(58, key, 10, TODAY));
      expect(a.suggestion.notSaid).toBe(sex === 'notSaid');
    }
    expect(aboutOf([{ plan }], plan.id, { today: TODAY, typed: { chance: '50' } }).errors.chance).toBe('notAnOption');
  });
});

describe('the check-in\'s reading of the level (weighing); old readings keep their words', { timeout: 120_000 }, () => {
  it('the new reading names its level, keeps both figures and the age; the screen\'s rows say them; an old reading is untouched', async () => {
    const { answerB } = await import('../../../src/answers/b/answer.js');
    const { readingOf, checkInOf } = await import('../../../src/answers/plan/checkIn.js');
    const { buildPlanSeed } = await import('../../../src/answers/keep/planSeed.js');
    const { seedToScenario } = await import('../../../src/services/PlanFromSeed.js');
    const { upgradeScenario } = await import('../../../src/firebase/scenarioMigration.js');
    const KEPT = '2026-11-04';
    // Sam, 41, still saving (fictional)
    const SAM = { household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95 };
    const result = answerB(SAM, { today: KEPT, futures: 100, seed: 0, trace: false, detail: 'answer' });
    const record = { date: KEPT, pot: { pension: 62000, isa: null, other: null } };
    const fresh = readingOf(record, null, result, { weighted: true });
    expect(fresh).toMatchObject({ band: result.verdict.band, level: 'balanced', fixedAge: result.chance.fixedAge, planToAge: result.chance.planToAge, fails: result.chance.fails });
    expect('nine' in (fresh.enough || {})).toBe(false);
    expect('bad' in fresh).toBe(false);
    const old = readingOf(record, null, result, { weighted: false });
    expect('level' in old).toBe(false);
    expect('bad' in old).toBe(true);
    // the screen's reading of a plan with one of each
    const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT + 'T10:00:00.000Z', payIn: 'now' });
    const made = seedToScenario(seed, KEPT).yours; made.id = 'SamSaving01';
    const plan = upgradeScenario(plain(made), { now: noon(KEPT) }).scenario;
    const stub = (date, reading) => ({ date, pot: { pension: 62000, isa: null, other: null }, pay: 38000, payIn: { kind: 'share', ownPct: 6, employerPct: 4, total: 316.67, savingsIn: 0 }, paused: null, reading: { path: null, pathBand: null, expected: null, ...reading }, recordedAt: date + 'T10:00:00.000Z' });
    plan.accumulationTool = { ...(plan.accumulationTool || {}), checkInEvery: 'quarter', checkIns: [stub('2026-11-05', { band: 'yes', fails: 40 }), stub('2027-02-05', { ...fresh, band: 'yes' })] };
    const v = checkInOf([{ plan }], plan.id, { today: '2027-02-10' });
    expect(v.latest.verdict.level).toBe('Balanced');
    expect(v.latest.verdict.fixed).toMatch(new RegExp('^If you live to ' + fresh.planToAge + ', '));
    const rows = v.rows || v.list;
    expect(rows.find((x) => x.date === '2026-11-05').verdict.words).toMatch(/futures out of 10/);
    expect(rows.find((x) => x.date === '2027-02-05').verdict.level).toBe('Balanced');
  });
});

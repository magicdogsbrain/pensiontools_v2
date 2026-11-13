/**
 * 7.9.0 — one convention for the age a plan runs to, on every page of both apps: "to 97" is to the 97th birthday, the
 * birthday the plan's last year ends on, as the answers have always read their plan-to age. Until 7.9.0 a plan's pages
 * named the age in its last year, one below the answers' figure for the same run. The runs are unchanged; only the age said.
 *  - rules.js planToAgeOf is the one sum (start age + years); every plan page, the classic card and the on-course pot read it;
 *  - what is stored says which rule its age is under (`ageRule`): a 7.8.0 document's success.planTo.age and an agreement made
 *    before 7.9.0 kept the age in the last year, and are read one on, so an old document and a new one of the same plan
 *    say the same age, and nothing stored is rewritten;
 *  - an accepted keep agreement made before 7.9.0 says "lasts to" the same age as one made now.
 * Fictional plans only (the test corpus).
 */
import { describe, it, expect } from 'vitest';
import { planToAgeOf, toAgeAsWritten, TO_AGE_RULE } from '../../../src/answers/shared/rules.js';
import { planToAgeOfDefinition, LEGACY_DEFINITION } from '../../../src/services/PlanDocument.js';
import { lockedLastsWords } from '../../../src/answers/plan/read.js';
import { verdictBlockView, successLineHtml, countAgeHtml } from '../../../src/ui/oneAnswerView.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';
import { amendmentEntry, keepFingerprint, holdingsKeyOf, keptLinesOf, othersValueOf, documentAtOf } from '../../../src/services/PlanAmendments.js';
import { keepTestOf, sayKeep } from '../../../src/answers/plan/keepTest.js';
import { KEEPTEST } from '../../../src/v7/copy/keepTest.js';
import { normaliseHoldings } from '../../../src/services/HoldingsRecord.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1 };
const fake = (fails) => {
  const survivedMc = Array.from({ length: 20 }, (_, i) => i >= fails);
  return { strategyId: 'pots-and-valves', affordable: true, ruin: { mc: fails * 5, hist: 3 }, n: { mc: 20, hist: 600 }, coverage: 98, worst12: { min: 31000, median: 40000 },
    terminal: { p10: 0, p50: 200000, p90: 700000 }, failAges: [], survivedMc, futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] } };
};

describe('one sum for the age a plan runs to', () => {
  it('start age + years: a plan from 66 for 31 years runs to 97, its last year the year at 96', () => {
    expect(planToAgeOf(66, 31)).toBe(97);
    expect(planToAgeOf(65.4, 31)).toBe(96);
    expect(planToAgeOf(undefined, 31)).toBe(31);
    const a = oneAnswer(fake(2), P, { life: LIFE });
    expect(a.planToAge).toBe(97);
    expect(a.words.fixed).toBe('If you live to 97, the money lasts that long in 18 of 20 futures we tried.');
    expect(countAgeHtml(fake(2), P)).toContain('If you live to 97,');
  });
  it('a stored age is read through its rule: as written under TO_AGE_RULE, one on without it', () => {
    expect(TO_AGE_RULE).toBe('birthday');
    expect(toAgeAsWritten(97, 'birthday')).toBe(97);
    expect(toAgeAsWritten(96, undefined)).toBe(97);
    expect(toAgeAsWritten(null, 'birthday')).toBe(null);
    expect(toAgeAsWritten('96', undefined)).toBe(null);
  });
});

describe('a plan document says the age its definition was written under', { timeout: 120_000 }, () => {
  it('a new document records the rule; a 7.8.0 document of the same plan reads the same age, on every surface, and is never rewritten', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const run = runForDocument(plan, { today: TODAY, weighted: true });
    const def79 = run.success;
    const age = Math.round(run.p.startAge + run.p.durationYears);
    expect(def79.planTo).toMatchObject({ age, ageRule: 'birthday' });
    // the same document as 7.8.0 wrote it: the age in its last year, no rule
    const def78 = JSON.parse(JSON.stringify(def79));
    def78.planTo = { age: age - 1, rule: def79.planTo.rule };
    const frozen = JSON.stringify(def78);
    for (const def of [def78, def79]) {
      expect(planToAgeOfDefinition(def)).toBe(age);
      const doc = { assumptions: { success: def }, strategy: { p: run.p, r: run.r } };
      expect(successLineHtml(doc)).toContain('tested to ' + age);
      expect(lockedLastsWords(doc, oneAnswer(run.r, run.p), run.p, true)).toContain('If you live to ' + age + ',');
      expect(verdictBlockView(run.r, run.p, { definition: def })).toContain('If you live to ' + age + ',');
    }
    expect(JSON.stringify(def78)).toBe(frozen);
    // a document before 7.8.0 has no definition of its own: its count is said to the same age from its plan
    expect(planToAgeOfDefinition(LEGACY_DEFINITION)).toBe(null);
    expect(lockedLastsWords({ assumptions: {} }, oneAnswer(run.r, run.p), run.p, true)).toContain('counted to ' + age + ';');
  });
});

describe('an accepted keep agreement says the age it was made under', () => {
  /** "Alex's plan": the locked buckets plan, drawing, keeping a fictional share line. */
  const alex = () => {
    const p = entryOf(JSON.parse(JSON.stringify(C['04-buckets-running']))).plan;
    p.holdings.lines.push({ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } });
    return p;
  };
  const side = (endAge) => ({ affordable: true, share: 0.9, chancePct: 90, badCase: { lasts: true, age: endAge, year: null }, endAge });
  it('the entry written now carries the rule; one written before reads one on; both say the same "lasts to"', () => {
    const plan = alex();
    const rec = normaliseHoldings(plan.holdings);
    const result = { fingerprint: keepFingerprint(rec), recordKey: holdingsKeyOf(rec), engineVersion: '6.39.0', asLocked: side(90), asHeld: side(90), withoutExpected: null, shock: null };
    const now79 = amendmentEntry(plan, result, { at: '2026-11-09T12:00:00.000Z' });
    expect(now79.ageRule).toBe('birthday');
    // the same agreement as 7.7.0 or 7.8.0 wrote it: the end age in the plan's last year, no rule
    const was = { at: '2026-11-09T12:00:00.000Z', kind: 'keep', lines: keptLinesOf(rec), expected: [], retest: { asLocked: { ...side(89), chancePct: undefined }, asHeld: { ...side(89), chancePct: undefined }, withoutExpected: null, shock: null },
      engineVersion: '6.39.0', othersValue: othersValueOf(rec), fingerprint: keepFingerprint(rec), documentAt: documentAtOf(plan) };
    for (const entry of [now79, was]) {
      const k = keepTestOf({ ...plan, planAmendments: [entry] }, {});
      expect(k.status).toBe('agreed');
      expect(k.line).toMatchObject({ id: 'line.agreedLasts', slots: { age: '90', was: '90' } });
      expect(sayKeep(k.line, KEEPTEST)).toContain('lasts to 90 in a bad case');
    }
    // nothing stored is rewritten by reading it
    expect(was.retest.asHeld.endAge).toBe(89);
  });
});

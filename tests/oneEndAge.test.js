/**
 * One end age (7.12.0, the lead's rule): the age the plan runs to is the age reached in the last tax year it pays, "to 93"
 * = to the 93rd birthday: the start age plus the years (AgeConvention.planToAgeOf). One helper says it for a plan's settings
 * (PlanTiming.planEndAgeOf); the household's "tested until", the Stress settings' timing line, About and the plan document
 * all say that one age. A document locked under the old rule ("Plan runs to age 92" for a plan from 63 for 30 years) is
 * re-worded on read; nothing stored changes.
 *
 * Fictional figures only. By hand: from 63 for 30 years: 63 + 30 = 93.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { planEndAgeOf, describeTiming, deriveTiming } from '../src/services/PlanTiming.js';
import { timingWords } from '../src/services/PlanDocument.js';
import { planDocumentHtml } from '../src/ui/components/PlanDocumentView.js';
import { householdVerdictHtml } from '../src/ui/householdView.js';

const NOW = new Date(2026, 10, 16, 12);
const corpus = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));

describe('the plan document says the one end age, whatever rule it was written under', () => {
  const doc = (text) => ({ timing: { shapeAgeNow: 63, text }, timeline: Array.from({ length: 30 }, (_, i) => ({ year: i })), assumptions: { duration: 30 } });
  it('an old document\'s "to age 92" for a plan from 63 for 30 years reads "to age 93", and 92 is not said', () => {
    const w = timingWords(doc('Plan starts 6 April 2026 (tax year 2026/27), now. Income steps start at age 63. Plan runs to age 92.'));
    expect(w).toBe('Plan starts 6 April 2026 (tax year 2026/27), now. Income steps start at age 63. Plan runs to age 93.');
    expect(w).not.toContain('92');
  });
  it('a document written under the rule already says 93, once', () => {
    const w = timingWords(doc('Income steps start at age 63. Plan runs to age 93.'));
    expect(w).toBe('Income steps start at age 63. Plan runs to age 93.');
    expect(w.match(/93/g).length).toBe(1);
  });
  it('the committed running plan (locked from 63 for 30 years) shows 93 on its document, and the stored text is untouched', () => {
    const raw = corpus('04-buckets-running');
    const stored = raw.planDocument.timing.text;
    expect(stored).toContain('Plan runs to age 92.');   // written under the old rule
    const html = planDocumentHtml(raw.planDocument, {});
    expect(html).toContain('Plan runs to age 93.');
    expect(html).not.toContain('Plan runs to age 92.');
    expect(raw.planDocument.timing.text).toBe(stored);
  });
});

describe('one helper for a plan\'s settings', () => {
  it('the start age as the timing derives it, plus the years', () => {
    const ss = corpus('04-buckets-running').stressTool.settings;
    expect(deriveTiming(ss, NOW).shapeAgeNow).toBe(63);
    expect(ss.duration).toBe(30);
    expect(planEndAgeOf(ss, NOW)).toBe(93);   // by hand: 63 + 30
    expect(planEndAgeOf({ ...ss, duration: 0 }, NOW)).toBe(null);
  });
  it('the Stress settings\' timing line says the same age', () => {
    const ss = corpus('04-buckets-running').stressTool.settings;
    expect(describeTiming(deriveTiming(ss, NOW), ss, NOW)).toContain('Plan runs to age ' + planEndAgeOf(ss, NOW) + '.');
  });
  it('the full view\'s household verdict says each plan is tested until that age, not one read from a stale start age', () => {
    // a plan whose stored start age is out of date: the timing derives the start age from the age and the year 0
    const a = corpus('04-buckets-running').stressTool.settings, b = corpus('09-couple-a').stressTool.settings;
    const stale = { ...a, shapeAgeNow: a.shapeAgeNow + 5 };
    const html = householdVerdictHtml({ jointSuccess: 0.9, successA: 0.9, successB: 0.9 }, { ownName: 'Alex', pName: 'Sam', setA: stale, setB: b, now: NOW });
    const ageA = planEndAgeOf(stale, NOW), ageB = planEndAgeOf(b, NOW);
    // by hand: the plan's own start, 63, plus its 30 years: 93 (the stale start would say 68 + 30 = 98)
    expect(ageA).toBe(93);
    expect(ageB).not.toBe(93);
    expect(html).toContain('Alex is 93');
    expect(html).not.toContain('98');
  });
});

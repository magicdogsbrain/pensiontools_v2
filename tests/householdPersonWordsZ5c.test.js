/**
 * Ruling Z5c: household sentences never use a plan's name as a person's name. A plan named as a person ("Sam") is said by
 * that name; a plan named any other way ("Stop at 60 · £1,800 a month") is "you" (the plan open) and "your partner" (the
 * plan linked to it). Both views fill the sentence from the one reader (householdVerdictOf: its `key`).
 */
import { describe, it, expect } from 'vitest';
import { householdVerdictOf, personNameOf } from '../src/answers/plan/household.js';
import { HOUSEHOLD } from '../src/v7/copy/household.js';
import { householdVerdictHtml } from '../src/ui/householdView.js';

const C = HOUSEHOLD.verdict;
const fillWords = (t, s) => t.replace(/\{(\w+)\}/g, (m, k) => (s[k] != null ? s[k] : m));
const combined = { runs: 1000, successA: 0.3, successB: 0.8, jointSuccess: 0.25, pooled: { success: 0.6, shortA: { n: 120, median: 84, earliest: 79 }, shortB: null } };

describe('a person\'s name, or you and your partner', () => {
  it('reads a name as a person\'s only when it is one', () => {
    expect(personNameOf('Sam')).toBe('Sam');
    expect(personNameOf('Mary Ann')).toBe('Mary Ann');
    for (const n of ['Stop at 60 · £1,800 a month', 'Pat retired', 'You', 'Partner', 'This plan', 'My Plan', '', null]) expect(personNameOf(n), String(n)).toBe(null);
  });
  it('plans named otherwise: "Your plan is tested until you are 101; your partner’s until your partner is 97."', () => {
    const v = householdVerdictOf({ combined }, { a: 'Stop at 60 · £1,800 a month', b: 'Sam at 62 plan' }, null, { a: 101, b: 97 });
    expect(fillWords(C[v.tested.key], v.tested)).toBe('Your plan is tested until you are 101; your partner’s until your partner is 97.');
    const x = v.covered[0];
    expect(fillWords(C[x.key], x)).toBe('In 120 of 1,000 futures your plan fell short and your partner’s paid, typically from when you are 84 (79 at the earliest).');
  });
  it('plans named as people keep the names (as before)', () => {
    const v = householdVerdictOf({ combined }, { a: 'Jo', b: 'Sam' }, null, { a: 101, b: 97 });
    expect(fillWords(C[v.tested.key], v.tested)).toBe('Jo’s plan is tested until Jo is 101; Sam’s until Sam is 97.');
    expect(fillWords(C[v.covered[0].key], v.covered[0])).toBe('In 120 of 1,000 futures Jo’s plan fell short and Sam’s paid, typically from when Jo is 84 (79 at the earliest).');
  });
  it('the full view says the same words', () => {
    const setA = null, setB = null;
    const html = householdVerdictHtml(combined, { ownName: 'Stop at 60 · £1,800 a month', pName: 'Sam at 62 plan', setA, setB });
    expect(html).not.toContain('until Stop at 60');
    expect(html.replace(/<[^>]+>/g, '')).toContain('your plan fell short and your partner’s paid, typically from when you are 84');
  });
});

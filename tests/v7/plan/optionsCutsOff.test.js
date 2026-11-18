/**
 * "Everything else this plan uses": cuts in a slump, switched off (the second walk: walkers 9, 1 and 4). A plan kept from
 * "Am I saving enough?" runs with the automatic cut off, and the row said "Cuts in a slump. Switched off: yes; After this
 * many draws from cash: 3; Income cut to: 80%; A deeper cut after this many months: 0; Buffer before the cut ends:
 * £15,000": a double negative, then the dials of a rule that never runs. The row now says "On: no" and nothing else;
 * switched on, it says "On: yes" and its dials, as before.
 */
import { describe, it, expect } from 'vitest';
import { optionsFor } from '../../../src/answers/plan/options.js';
import { PLAN } from '../../../src/v7/copy/plan.js';

const row = (ss) => optionsFor(ss, {}, {}, { all: true }).find((r) => r.id === 'prot.cuts');

describe('cuts in a slump, as "Everything else" lists them', () => {
  it('switched off: one fact, "On: no", and no dials', () => {
    const r = row({ disableProtection: true });
    expect(r.set).toBe(true);
    expect(r.facts).toEqual([{ k: 'on', v: false, kind: 'yesNo' }]);
  });
  it('switched on, as the planner starts: "On: yes", then its dials (3 draws, 80%, 0 months, £15,000)', () => {
    const r = row({});
    expect(r.facts.map((f) => [f.k, f.v])).toEqual([['on', true], ['after', 3], ['cutTo', 80], ['deeperAfter', 0], ['buffer', 15000]]);
  });
  it('the words: "On", never "Switched off"', () => {
    expect(PLAN.options['prot.cuts'].facts.on).toBe('On');
    expect(JSON.stringify(PLAN.options['prot.cuts'])).not.toMatch(/Switched off/);
  });
});

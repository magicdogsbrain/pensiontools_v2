/**
 * Step F5, pass 3 (lead4.md R4): a pension today read from a record says the record's month wherever it is said — "from your
 * last record, September 2026", never "from your last record" alone — through ONE function (src/reading/money.js
 * pensionFromWords) in both views: the move's status and its "Paying for it" (moveWords), the saver's Where you are (read.js)
 * and the full view's saver strip (PlanDocumentView). The month is its own fact (pot.today.asOf), marked by one find in both
 * views, and the pension and ISA in those sentences are the pension today and ISA today every page reads.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { planMoneyOf } from '../../src/services/PlanReading.js';
import { pensionToday, isaToday, pensionFromWords } from '../../src/reading/money.js';
import { unlistedStatusOf } from '../../src/answers/plan/moveWords.js';
import { MOVE_MONEY_FINDS, POT_FROM_FIND } from '../../src/reading/sentenceMarks.js';
import { markWithin } from '../../src/reading/mark.js';
import { FACT } from '../../src/reading/facts.js';
import { LABELS } from '../../src/reading/labels.js';
import { MOVE } from '../../src/v7/copy/move.js';

const NOW = new Date(PARITY_DAY + 'T12:00:00');
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const plan = (fixture, id) => up(FIXTURES.find((f) => f.key === fixture).plans().find((p) => p.id === id));
const src = (f) => readFileSync(f, 'utf8');

describe('one wording of where the pension today is from, dated', () => {
  it('a record and a check-in say their month; the plan and What you hold say where', () => {
    expect(pensionFromWords({ from: 'record', asOf: '2026-09' })).toBe('from your last record, September 2026');
    expect(pensionFromWords({ from: 'checkIn', asOf: '2026-10' })).toBe('from your check-in, October 2026');
    expect(pensionFromWords({ from: 'record', asOf: null })).toBe('from your last record');
    expect(pensionFromWords({ from: 'holdings', asOf: null })).toBe('from What you hold');
    expect(pensionFromWords({ from: 'plan' })).toBe('from your plan');
    expect(pensionFromWords(null)).toBe('from your plan');
    expect(LABELS[FACT.POT_TODAY_AS_OF].label).toBeTruthy();
  });
  it('the plan\'s own money keeps the record\'s month, and is the pension today and ISA today every page reads', () => {
    for (const f of FIXTURES) for (const p0 of f.plans()) {
      const p = up(p0);
      const pm = planMoneyOf(p, { now: NOW });
      if (!pm) continue;
      expect(pm.pension, p.id).toBe(pensionToday(p, { now: NOW }).value);
      expect(pm.isa, p.id).toBe(isaToday(p, { now: NOW }).value);
      if (pm.from === 'record') expect(pm.asOf, p.id).toMatch(/^\d{4}-\d{2}/);
    }
  });
  it('the move\'s status on a plan with a record says the record\'s month, marked', () => {
    const s = unlistedStatusOf(plan('retired-locked-pots', 'ParRetiredPots'), { now: NOW });
    expect(s.slots.from).toBe('from your last record, October 2026');
    const text = MOVE.status[s.id].replace(/\{(\w+)\}/g, (m, k) => s.slots[k]);
    const html = markWithin(text, MOVE_MONEY_FINDS);
    expect(html).toContain('data-fact="pot.today.asOf">October 2026<');
    expect(html).toContain('data-fact="pot.today">' + s.slots.pension + '<');
    expect(html).toContain('data-fact="isa.today">' + s.slots.isa + '<');
    expect(POT_FROM_FIND.exec('(from your plan)')).toBeNull();
  });
});

describe('the superseded wordings are gone', () => {
  it('no view keeps its own map of where a pension figure is from', () => {
    expect(src('src/answers/plan/moveWords.js')).not.toMatch(/FROM_WORDS/);
    expect(src('src/ui/components/PlanDocumentView.js')).not.toMatch(/PATH_FROM/);
    expect(src('src/answers/plan/read.js')).not.toMatch(/'from your last record'/);
    expect(MOVE.paying.from).toBeUndefined();
    expect(src('src/v7/screens/plan/MoveScreen.jsx')).not.toMatch(/P\.from\[/);
    expect(src('src/ui/components/TransitionView.js')).not.toMatch(/P\.from\[/);
  });
  it('both views mark the move\'s money sentences by the one find', () => {
    expect(src('src/v7/screens/plan/MoveScreen.jsx')).toMatch(/MOVE_MONEY_FINDS/);
    expect(src('src/ui/components/TransitionView.js')).toMatch(/MOVE_MONEY_FINDS/);
  });
});

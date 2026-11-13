/**
 * 7.8.0 review fixes, the answers side, while weighing (env.weighted; the shipped flag is still off):
 *   - B: the chance a level stands behind is the weighted chance at the pay-in that gets there, and "what would be enough",
 *     the "Pay in more" way, the one-off sum and the grid are all solved on the same weighted test, so one page says one
 *     pay-in; every chance B says is said as a chance, each beside its own count to a named age
 *   - a run the 60-year cap stops short: no age past its end, the warning names 60 years, no "1 in 10" claim for an end the
 *     cap set
 *   - Bold's consequence from the answer's own chance, with no floor of "1 in 10"
 *   - what is left at the plan-to age on every answer; the cost of the other levels on D
 *   - "What we assumed" links to no box the answer does not have, and shows the plan-to age and the couple's rule at once
 * Fictional households only (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { LEVELS, RULES } from '../../../src/answers/shared/rules.js';
import { boldParts } from '../../../src/answers/shared/lastsWords.js';
import { leftOf } from '../../../src/answers/shared/shortfall.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { atEnough } from '../../../src/answers/keep/planSeed.js';

const ENV = { today: '2026-09-30', futures: 40, seed: 0, weighted: true };
const OFF = { ...ENV, weighted: false };
const SAM_B = { you: { age: 45, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 } };
const LEVEL_IDS = ['careful', 'balanced', 'bold'];
const AGE = /\b(live to|is still alive when|is) \d{2,3}\b/;

describe('B while weighing: one test for every figure of what would be enough', () => {
  it.each(LEVEL_IDS)('%s: the level stands behind the weighted chance at the pay-in that gets there; enough, the way and the grid say the same pay-in', (level) => {
    const r = answerB({ ...SAM_B, confidence: level }, { ...ENV, detail: 'grid' });
    expect(r.status).toBe('ok');
    const need = r.payIn.needed;
    const lv = r.levels[level];
    // the chance of the figure shown passes its level, and it is the one "what would be enough" says
    expect(lv.weighted).toBeGreaterThanOrEqual(LEVELS[level] - 1e-12);
    expect(r.enough.atLevel.payIn).toBe(need);
    expect(r.enough.atLevel.weighted).toBe(lv.weighted);
    expect(r.enough.atLevel.lasted).toBe(lv.fixedAge);
    expect(r.levers.payMore.payIn).toBe(need);
    expect(r.levers.payMore.weighted).toBe(lv.weighted);
    // the grid's cell at the stop and that pay-in (when it is a column) is on course at the level
    const row = r.grid.ages.find((x) => x.age === r.stop.age);
    const cell = row && row.cells.find((c) => c.payIn === need);
    if (cell) expect(cell.verdict).toBe('yes');
    for (const c of row ? row.cells : []) expect(typeof c.weighted).toBe('number');
    // Bold's consequence reads Bold's own chance at the pay-in
    if (level === 'bold') expect(r.sentences.boldLine.text).toBe(partsText(boldParts(lv.weighted, { couple: false }), r));
  }, 60000);

  it('every chance B says is a chance, never a count of futures or "only"; each beside its own count to a named age', () => {
    const r = answerB(SAM_B, ENV);
    const s = r.sentences;
    for (const k of ['verdictLine', 'enoughLine']) {
      expect(s[k].mark, k).toBe('weighted');
      expect(s[k].text, k).not.toMatch(/futures out of|\bonly\b/);
      expect(s[k].text, k).toMatch(/times? in 20|every future we tried|none of the futures we tried/);
    }
    expect(s.enoughFixed.mark).toBe('fixed');
    expect(s.enoughFixed.text).toMatch(AGE);
    expect(s.guideFixed.mark).toBe('fixed');
    expect(s.wholeLife.mark).toBe('fixed');
    expect(s.wholeLife.text).not.toMatch(/\bonly\b/);
    for (const [id, line] of Object.entries(s.lever)) {
      if (id.endsWith('Fixed') || line.mark !== 'weighted') continue;
      expect(line.text, id).not.toMatch(/futures out of|\bonly\b/);
      expect(s.lever[`${id}Fixed`].mark, id).toBe('fixed');
      expect(s.lever[`${id}Fixed`].text, id).toMatch(AGE);
    }
    // the try-a-change row names the level, the verdict block says what happens if the money runs out
    expect(s.change.text).toMatch(/, at Balanced\.$/);
    expect(s.floor && s.floor.text).toMatch(/^If the money ran out/);
  }, 60000);

  it('kept paying in what would be enough: on course at the level, at the chance B asked there', () => {
    for (const level of LEVEL_IDS) {
      const r = answerB({ ...SAM_B, confidence: level }, ENV);
      const k = atEnough(r);
      expect(k.onCourse, level).toBe(true);
      expect(k.chance.weighted, level).toBe(r.levels[level].weighted);
      expect(k.wholeLife.weighted, level).toBe(r.levels[level].weighted);
    }
  }, 60000);

  it('the rollback is the answer before: no weighted chance on the ways, the grid or the counts', () => {
    const r = answerB(SAM_B, { ...OFF, detail: 'grid' });
    expect(r.levers.payMore && 'weighted' in r.levers.payMore).toBe(false);
    expect(r.grid.ages.every((x) => x.cells.every((c) => !('weighted' in c)))).toBe(true);
    expect('weighted' in r.verdict).toBe(false);
    expect(r.sentences.enoughFixed).toBeUndefined();
  }, 60000);
});

describe('a run the 60-year cap stops short', () => {
  it('C at 30 from now: the age followed on to is the run\'s end; the warning names 60 years; no 1-in-10 claim for the end the cap set', () => {
    const r = answerC({ you: { pot: 0, age: 30 }, savings: 900000, start: { kind: 'now' } }, ENV);
    expect(r.chance.horizonRule).toBe('capped');
    expect(r.chance.weightToAge).toBeLessThanOrEqual(30 + RULES.maxDrawYears);
    expect(r.basis.weightToAge).toBeLessThanOrEqual(30 + RULES.maxDrawYears);
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    if (warn) expect(warn.text).toMatch(new RegExp(`^We can only test ${RULES.maxDrawYears} years ahead`));
    const said = r.assumed.map((a) => a.text).join(' ');
    expect(said).toMatch(/We could test only to \d+: 60 years is the most we run\./);
    expect(said).not.toMatch(/fewer than 1 in 10/);
  });

  it('A at 25 stopping at 35: the age followed on to never passes the stop + 60', () => {
    const r = answerA({ you: { age: 25, pot: 50000, payIn: { kind: 'total', total: 500 } }, savings: 300000, stop: { kind: 'age', age: 35 }, spend: { kind: 'amount', amount: 1000 } }, ENV);
    expect(r.chance.horizonRule).toBe('capped');
    expect(r.chance.weightToAge).toBeLessThanOrEqual(35 + RULES.maxDrawYears);
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    if (warn) expect(warn.text).toMatch(new RegExp(`^We can only test ${RULES.maxDrawYears} years ahead`));
  });
});

describe('Bold\'s consequence from the answer\'s own chance', () => {
  const lf = { couple: false };
  it('in the twentieths the chance is said in, never rounded the kinder way: less than one, and none at all', () => {
    expect(partsText(boldParts(0.7, lf), {})).toBe('About 6 times in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(partsText(boldParts(0.96, lf), {})).toBe('About once in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(partsText(boldParts(0.99, lf), {})).toBe('Less than once in 20 the money runs out while you are alive, and you would spend less from then on.');
    expect(partsText(boldParts(1, lf), {})).toBe('In none of the futures we tried does the money run out while you are alive.');
    expect(partsText(boldParts(0.99, { couple: true }), {})).toMatch(/^Less than once in 20 the money runs out while one of you is alive/);
  });
});

describe('what is left at the plan-to age, and what the other levels ask for', () => {
  it('leftOf: the middle and the best 1 in 10 to the nearest £1,000; more than half with nothing', () => {
    expect(leftOf([0, 0, 0, 1000, 120400, 130600, 140000, 150000, 600000, 700400])).toEqual({ typical: 120000, best: 700000, mostNone: false });
    expect(leftOf([0, 0, 0, 0, 0, 0, 1, 2, 3, 4]).mostNone).toBe(true);
    expect(leftOf(null)).toBe(null);
  });

  it.each([
    ['C', () => answerC({ you: { pot: 400000, age: 66 } }, ENV)],
    ['D', () => answerD({ you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1900 } }, ENV)],
    ['A', () => answerA({ you: { age: 55, pot: 250000, payIn: { kind: 'total', total: 500 } }, savings: 30000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1700 } }, ENV)],
    ['B', () => answerB(SAM_B, ENV)]
  ])('%s says what is left at its plan-to age, at today\'s prices, rounded', (_q, run) => {
    const r = run();
    const t = r.sentences.left.text;
    expect(t).toMatch(/^(If you live to \d+, what is typically left then is £[\d,]*000 at today's prices\. In the best 1 in 10 futures it is £[\d,]*000 or more\.|In more than half the futures nothing is left at \d+\.)$/);
    expect(t).toContain(String(r.chance.planToAge));
  }, 60000);

  it('the rollback says nothing of it', () => {
    expect(answerC({ you: { pot: 400000, age: 66 } }, OFF).sentences.left).toBeUndefined();
  });

  it('D says what the other levels ask for, as C does', () => {
    const r = answerD({ you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1900 } }, ENV);
    expect(r.sentences.cost.text).toMatch(/^Careful asks for £[\d,]+ a month less than Balanced\. Bold would let you take £[\d,]+ a month more\.$/);
    const bold = answerD({ you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1900 }, confidence: 'bold' }, ENV);
    expect(bold.sentences.cost.text).toMatch(/^Balanced asks for £[\d,]+ a month less than Bold; Careful £[\d,]+ less\.$/);
  });
});

describe('what we assumed while weighing', () => {
  it('a typed end age says how many live past it, shown at once', () => {
    const r = answerC({ you: { pot: 400000, age: 66 }, endAge: 85 }, ENV);
    const line = r.assumed.find((a) => a.id === 'life-plan-to');
    expect(line.always).toBe(true);
    expect(line.text).toMatch(/^Your plan runs to 85, the age you chose\. About \d+ in 10 women your age live longer than that, so we still follow each future on to \d+\.$/);
  });
  it('the figures used link to the box that changes them (step 8: every answer asks), and say "because you did not say" only when not said', () => {
    const r = answerD({ household: 'couple', you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, partner: { age: 66, pot: 50000, taxFreeTaken: 'no', sex: 'male' }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    const you = r.assumed.find((x) => x.id === 'life-sex');
    expect(you).toMatchObject({ field: 'you.sex', source: 'default' });
    expect(you.text).toMatch(/because you did not say/);
    const partner = r.assumed.find((x) => x.id === 'life-sex-partner');
    expect(partner).toMatchObject({ field: 'partner.sex', source: 'entered', value: 'male' });
    expect(partner.text).not.toMatch(/because you did not say/);
    expect(partner.text).toBe('For your partner we used the figures for men, as you said.');
    expect(r.assumed.find((a) => a.id === 'life-couple').always).toBe(true);
  });
});

describe('A\'s counts while weighing name the age they are counted to', () => {
  const ALEX_A = { you: { age: 52, pot: 240000 }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1900 } };
  it('one more year and part-time work: in twentieths to the plan-to age, never "only" or "out of 10"; the rollback as before', () => {
    for (const inputs of [ALEX_A, { ...ALEX_A, partTime: { has: true, years: 3, yearly: 12000 } }]) {
      const r = answerA(inputs, ENV);
      const said = ['oneMoreMoves', 'partTime', 'partTimeOneMore'].map((k) => r.sentences[k]).filter(Boolean);
      expect(said.length).toBeGreaterThan(0);
      for (const s of said) {
        expect(s.text, s.id).not.toMatch(/futures out of|\bonly\b/);
        expect(s.text, s.id).toMatch(new RegExp(`if you live to ${r.chance.planToAge}, `, 'i'));
      }
      const off = answerA(inputs, OFF);
      for (const k of ['oneMoreMoves', 'partTime']) if (off.sentences[k]) expect(off.sentences[k].text, k).toMatch(/futures out of 10/);
    }
  });
});

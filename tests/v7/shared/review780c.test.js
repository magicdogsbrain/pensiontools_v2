/**
 * 7.8.0 second review, the answers side, while weighing (env.weighted):
 *   - D's long-plan warning names the cap the run used (60 years while weighing), as A, B and C do
 * Fictional households only (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { answerD } from '../../../src/answers/d/answer.js';
import { RULES, drawYearsCap } from '../../../src/answers/shared/rules.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, weighted: true };
const OFF = { ...ENV, weighted: false };

describe('D: a run the cap stops short names the cap it used', () => {
  const ALEX = { stopped: 'yes', you: { pot: 0, age: 40, taxFreeTaken: 'yes' }, savings: 900000, spend: { kind: 'amount', amount: 2000 } };
  it('weighing: the long-plan warning and the capped line both say 60 years', () => {
    const r = answerD(ALEX, ENV);
    expect(r.chance.horizonRule).toBe('capped');
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    expect(warn).toBeTruthy();
    expect(warn.text).toMatch(new RegExp(`^We can only test ${drawYearsCap(ENV)} years ahead`));
    expect(drawYearsCap(ENV)).toBe(RULES.maxDrawYears);
    const said = [...r.assumed, ...r.warnings].map((a) => a.text).join(' ');
    expect(said).not.toMatch(new RegExp(`only test ${RULES.maxYears} years`));
  });

  it('on the count (the rollback): 45 years, as before', () => {
    const r = answerD({ ...ALEX, endAge: 100 }, OFF);
    const warn = r.warnings.find((w) => w.id === 'long-plan');
    expect(warn).toBeTruthy();
    expect(warn.text).toMatch(new RegExp(`^We can only test ${RULES.maxYears} years ahead`));
  });
});

describe('B: "More risk while saving" and the verdict at Bold', () => {
  const SAM = { you: { age: 41, pot: 62000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 63 }, spend: { kind: 'amount', amount: 1800 } };
  for (const level of ['balanced', 'bold']) {
    it(level + ': the way says its chance at the pay-in it names, in the present, with its own count to an age beside it', async () => {
      const { answerB } = await import('../../../src/answers/b/answer.js');
      const r = answerB({ ...SAM, confidence: level }, { ...ENV, futures: 40 });
      const mr = r.levers.moreRisk;
      expect(mr && mr.helps).toBe(true);
      const s = r.sentences.lever;
      expect(s.moreRisk.mark).toBe('weighted');
      expect(s.moreRisk.text).toMatch(/: paying in £[\d,]+ a month, your money lasts as long as you do (\d+ times|once) in 20\.$/);
      expect(s.moreRisk.text).not.toMatch(/made it last/);
      expect(s.moreRiskFixed.mark).toBe('fixed');
      expect(s.moreRiskFixed.text).toMatch(/^With more risk, paying in £[\d,]+ a month: if you live to \d+, the money lasts that long /);
      // its chance is the level's, at the pay-in it names
      expect(mr.weighted).toBeGreaterThanOrEqual(1 - ({ balanced: 2, bold: 6 })[level] / 20 - 1e-9);
      expect(r.sentences.verdictHead.text.startsWith('At Bold: ')).toBe(level === 'bold');
    });
  }
  it('on the count (the rollback): the words before 7.8.0', async () => {
    const { answerB } = await import('../../../src/answers/b/answer.js');
    const r = answerB({ ...SAM, confidence: 'bold' }, { ...OFF, futures: 40 });
    expect(r.sentences.verdictHead.text).not.toMatch(/^At Bold/);
    expect(r.sentences.lever.moreRiskFixed).toBeUndefined();
  });
});

describe('a couple\'s answer says the couple\'s words', () => {
  it('A\'s "One more year" counts while one of you is alive, by the younger person\'s age, and says the bad-case ages are theirs', async () => {
    const { answerA } = await import('../../../src/answers/a/answer.js');
    const r = answerA({ household: 'couple', you: { age: 52, pot: 220000, payIn: { kind: 'total', total: 600 } }, partner: { age: 50, pot: 90000, payIn: { kind: 'total', total: 300 } },
      stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2800 } }, { ...ENV, futures: 40 });
    const s = r.sentences.oneMoreMoves;
    expect(s).toBeTruthy();
    expect(s.text).not.toMatch(/If you live to/);
    expect(s.text).toMatch(/^If one of you is still alive when the younger of you is \d+, /);
    expect(s.text).toMatch(/from running out when the younger of you is \d+ to /);
    expect(s.text).not.toMatch(/running out at \d/);
  });

  it('C\'s figure tiles: "as long as one of you is alive" for a couple, "as long as you live" for one person', async () => {
    const { answerC } = await import('../../../src/answers/c/answer.js');
    const { answerTiles } = await import('../../../src/v7/state/pictures.js');
    const { PICTURE } = await import('../../../src/v7/copy/picture.js');
    const words = (inputs) => answerTiles({ answers: { c: { result: answerC(inputs, ENV) } } }, 'c').map((t) => PICTURE.tiles[t.words]);
    const two = words({ household: 'couple', you: { age: 66, pot: 300000 }, partner: { age: 64, pot: 100000 }, savings: 40000 });
    expect(two.length).toBe(3);
    for (const w of two) expect(w).toMatch(/as long as one of you is alive/);
    const one = words({ you: { age: 66, pot: 300000 }, savings: 40000 });
    for (const w of one) expect(w).toMatch(/as long as you live/);
  });
});

describe('D\'s picture: the guide line\'s key says what it is at every level', () => {
  it('weighing: the key names the boldest level as a guide to middling years, never "at Bold" as if Bold were chosen', async () => {
    const { answerD } = await import('../../../src/answers/d/answer.js');
    const { potPicture } = await import('../../../src/v7/state/pictures.js');
    const { PICTURE } = await import('../../../src/v7/copy/picture.js');
    for (const level of ['careful', 'balanced', 'bold']) {
      const r = answerD({ you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, savings: 40000, spend: { kind: 'amount', amount: 2100 }, confidence: level }, ENV);
      const P = potPicture({ answers: { d: { result: r } } }, 'd');
      expect(P).toBeTruthy();
      const line = P.lines.find((l) => l.id === 'middling');
      expect(PICTURE.pot.legend[line.legend || line.id]).toBe(PICTURE.pot.legend.middlingW);
      const row = P.rows.find((x) => x.id === 'dMiddling');
      expect(PICTURE.pot.rows[row.words]).toMatch(/whatever level you choose/);
    }
  });
});

describe('the failure lines say what still comes in, and which futures they count', () => {
  it('a couple whose State Pensions meet the spending after the pot runs out: "how long" counts those years as met', async () => {
    const { answerC } = await import('../../../src/answers/c/answer.js');
    const r = answerC({ household: 'couple', you: { age: 58, pot: 180000 }, partner: { age: 57, pot: 60000 } }, { ...ENV, futures: 40 });
    const s = r.sentences;
    expect(s.howLong.text).toMatch(/what you planned to spend is still met in \d+ of the \d+ years to \d+, with what comes in anyway\.$/);
    // never "£0 at least" for the one left
    expect(s.floor.text).not.toMatch(/£0\b/);
    expect(s.floor.text).toMatch(/if one of you has died by then, the one left could have nothing coming in from a pension\.$/);
    // the "when" line names the age its futures are followed on to; "how long" names the plan-to age
    expect(s.bad.text).toMatch(new RegExp(`^In the futures where the money runs out before the younger of you is ${r.chance.weightToAge}, `));
  });

  it('the pieces: the words before, when nothing comes in anyway; a survivor with something says it', async () => {
    const { howLongParts, floorParts, whenParts } = await import('../../../src/answers/shared/lastsWords.js');
    const { partsText } = await import('../../../src/answers/shared/format.js');
    const lf = { couple: false, planToAge: 97, weightToAge: 103 };
    expect(howLongParts({ howLong: { paid: 22, of: 31 } }, lf).map((p) => (typeof p === 'string' ? p : p.fixed)).join('')).toBe('In the futures where it runs out before 97, it still pays for 22 of the 31 years to 97.');
    expect(partsText(whenParts({ when: { typical: 88, worst: 84, worstLasts: false } }, lf), {})).toBe('In the futures where the money runs out before 103, it typically runs out at 88. In the worst 1 in 10 of all the futures, by 84.');
    const two = { couple: true, planToAge: 100, weightToAge: 103 };
    expect(partsText(floorParts({ floor: { age: 88, yearly: 24100, survivor: 13900, sp: 2, fs: false } }, two), {})).toMatch(/; if one of you has died by then, about £13,900 at least\.$/);
  });
});

describe('a kept plan\'s last age: the answer\'s plan-to age, or said on Keep when the 45-year limit cuts it', () => {
  const env = { today: '2026-09-30', futures: 20, seed: 0, weighted: true };
  const keep = async (q, r) => {
    const { buildPlanSeed, keptLengthOf } = await import('../../../src/answers/keep/planSeed.js');
    const PF = await import('../../../src/services/PlanFromSeed.js');
    const seed = buildPlanSeed({ source: q, result: r, env: { today: env.today, appVersion: 'x' }, name: 'Alex plan', createdAt: '2026-09-30T10:00:00.000Z' });
    const made = PF.seedToScenario(seed, env.today).yours;
    const ss = made.stressTool.settings;
    // (7.9.0: the age the kept plan runs to, as its pages say it — to the birthday its last year ends on)
    return { len: keptLengthOf(q, r, env.today), endAge: ss.shapeAgeNow + ss.duration };
  };
  it('A stopping at 52, counted to 100: kept for 45 years, to 97, and Keep says so', async () => {
    const { answerA } = await import('../../../src/answers/a/answer.js');
    const r = answerA({ you: { pot: 150000, age: 45, sex: 'female', payIn: { kind: 'total', total: 900 } }, savings: 200000, stop: { kind: 'age', age: 52 }, spend: { kind: 'amount', amount: 2000 } }, env);
    const { len, endAge } = await keep('a', r);
    expect(len.cut).toBe(true);
    expect(len.planToAge).toBe(r.chance.planToAge);
    expect(len.keptToAge).toBe(endAge);
    expect(len.years).toBe(45);
    const { KEEP } = await import('../../../src/v7/copy/keep.js');
    expect(KEEP.cut).toMatch(/\{kept\}.*\{years\} years.*\{age\}/);
  });
  it('D at 66, counted to its plan-to age: not cut; the plan covers the same years the answer tested', async () => {
    const { answerD } = await import('../../../src/answers/d/answer.js');
    const r = answerD({ stopped: 'yes', you: { age: 66, pot: 400000, taxFreeTaken: 'no', sex: 'male' }, spend: { kind: 'amount', amount: 2000 } }, env);
    const { len, endAge } = await keep('d', r);
    expect(len.cut).toBe(false);
    // (7.9.0: the answer and the plan both name the birthday the same years end on)
    expect(endAge).toBe(r.chance.planToAge);
    expect(len.keptToAge).toBe(endAge);
  });
});

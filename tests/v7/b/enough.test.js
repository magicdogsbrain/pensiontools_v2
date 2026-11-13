/**
 * "Am I saving enough?" said straight, and what would be enough (research/saving-enough-and-check-in.md 2–3, section 8's
 * tests for release step R1). Every person here is fictional (Sam and Alex, as in the note's own sections 1–3).
 *
 *  - The words, state by state (2.2, 3.5): on course, close, not on course, no employer part, a fixed payer, a pay of £0,
 *    stopping before a pension can be touched (both parts, and the savings alone), out of reach by paying in — measured
 *    at 1,000 futures, seed 0, on 4 Nov 2026, the note's own figures.
 *  - The solver's properties (3.3), on random inputs of B's own list: the share said lasts in its full count, the step
 *    below it does not (to one life, as PB1 allows), never past all of the pay, 3 in 4 never above 9 in 10, the employer's
 *    share as entered, shares and pounds agree, the count claimed is the one test's; no pay, no share; the one-off sum.
 *  - The band and the gap agree (2.1), and the Close band's 3-in-4 line is decided by the count.
 *  - Keeping "on course" (3.6): the seed is the answer at that figure, in the person's own kind.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { fcOptions } from '../oracles/fcOptions.mjs';
import { SCHEMA_B, answerB, checkAnswerB, withinCeiling, asksB } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { payInParts } from '../../../src/answers/shared/schemaParts.js';
import { legacyVerdictOf as verdictOf, RULES } from '../../../src/answers/shared/rules.js';
import { buildPlanSeed, atEnough } from '../../../src/answers/keep/planSeed.js';
import { oneLife } from '../oracles/oneStep.mjs';

const RUNS = Number(process.env.FC_RUNS || 8);
const SEED = process.env.NIGHTLY ? undefined : 20261104;
// 7.8.0: these are R1's words and solver as measured on the count ("verdictOf on the count", "lasted until you are 95 in
// only 3 futures out of 10", the 3-in-4 line): they are held on the count, env.weighted false — the rollback, one switch away.
// The weighted words of what would be enough are pinned by the B states and fixtures and by tests/v7/shared/review780.test.js
const ENV = { today: '2026-09-30', futures: Number(process.env.V7_PROP_FUTURES || 20), seed: 0, trace: false, detail: 'answer', weighted: false };
const MEASURED = { today: '2026-11-04', futures: 1000, seed: 0, trace: false, detail: 'answer', weighted: false };
const opts = (n = RUNS) => fcOptions({ seed: SEED, runs: n });
const ok = (a, inputs) => { const f = checkAnswerB(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const text = (a) => JSON.stringify(Object.fromEntries(Object.entries(a.sentences).filter(([, s]) => s && s.text).map(([k, s]) => [k, s.text])));

/** Sam (the note's row B): 41, £62,000 saved, £38,000 pay, the employer 4%, stopping at 63, £1,810 a month. */
const sam = (ownPct, more = {}) => ({ household: 'single', you: { age: 41, pot: 62000, payIn: { kind: 'share', pay: 38000, ownPct, employerPct: 4 } },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, ...more });
/** A share of pay with the person's part `own`%, the employer's `employer`%. */
const withShare = (inputs, ownPct) => ({ ...inputs, you: { ...inputs.you, payIn: { ...inputs.you.payIn, ownPct } } });

describe('the words, state by state (saving-enough-and-check-in.md 2.2 and 3.5; measured, 1,000 futures)', () => {
  it('not on course (Sam paying 10% in all): the band, what would be on course in the first sentence, both chances, the incomes and the gap a year', () => {
    const a = ok(answerB(sam(6), MEASURED), sam(6));
    const s = a.sentences;
    expect(a.verdict.band).toBe('no');
    expect(s.verdictHead.text).toBe('Not on course for £1,810 a month from 63');
    expect(s.verdictLine.text).toBe('Paying in 10% of your pay as now (£317 a month, your employer\'s 4% included), your money lasted until you are 95 in only 3 futures out of 10. '
      + '31% of your pay in all (you 27%, £982 a month) would put you on course, which is 9 in 10.');
    expect(s.income.text).toBe('To last in 9 futures out of 10 paying in as now, you could spend £1,310 a month from 63, '
      + 'with your State Pension from 68 (the full amount, as assumed): £500 a month (£6,000 a year) less than you want.');
    expect(s.atAim.text).toMatch(/^Spending £1,810 a month, in a bad case \(the worst 1 in 10\) your money runs out at \d+\.$/);
    expect(s.enoughHead.text).toBe('To be on course: 31% of your pay in all');
    expect(s.enoughLine.text).toBe('You 27% and your employer 4% as now: £982 a month going into your pension from now until you are 63, going up with prices. '
      + 'Your money lasted until you are 95 in 9 futures out of 10.');
    expect(s.enoughFour).toBeUndefined();                              // (7.8.0: one figure, at the level)
    expect(s.enoughMatch.text).toContain('If your employer adds more when you pay more, you would need less');
    expect(s.verdictFour).toBeUndefined();
    // the ways beside it: "Pay in more" is what would be enough, tried as a share; a one-off sum, said with the allowance
    expect(a.levers.payMore).toMatchObject({ totalPct: 31, ownPct: 27, payIn: a.enough.atLevel.payIn });
    expect(s.lever.oneOff.text).toMatch(/^Put £[\d,]+ into your pension now \(what lands, with the tax the government adds back\) and keep paying in as now: your money lasted in 9 futures out of 10\./);
    if (a.levers.oneOff.amount > RULES.annualAllowance) expect(s.lever.oneOff.text).toContain('is not counted here');
  }, 60_000);

  it('close (Sam paying 22% in all): "Close — … is tight", and for 3 futures out of 4 what goes in now is already enough — said by the count, no figure', () => {
    const a = ok(answerB(sam(18), MEASURED), sam(18));
    const s = a.sentences;
    expect(a.verdict.band).toBe('close');
    expect(s.verdictHead.text).toBe('Close — £1,810 a month from 63 is tight');
    expect(s.verdictLine.text).toBe('Paying in 22% of your pay as now (£697 a month, your employer\'s 4% included), your money lasted until you are 95 in only 8 futures out of 10. '
      + '31% of your pay in all (you 27%, £982 a month) would put you on course, which is 9 in 10.');
    // (7.8.0: the "3 in 4" line and the middling income left with the 3-in-4 figure and the count's middling amount)
    expect(s.verdictFour).toBeUndefined();
    expect(s.income.text).toContain('you could spend £1,600 a month from 63, with');
    expect(s.income.text).toContain(': £210 a month (£2,520 a year) less than you want.');
    expect(s.atAim.text).toBe('Spending £1,810 a month, in a bad case (the worst 1 in 10) your money runs out at 84.');
    expect(a.enough.closeNow).toBe(true);
    // said once, in the verdict: the block under it leads with what would be on course and does not say it again
    expect(s.enoughFour).toBeUndefined();
    expect(s.enoughHead.text).toBe('To be on course: 31% of your pay in all');
    // asked at Bold (7.8.0): today's pay-in is already enough there — on course, nothing more to pay in
    const four = { ...sam(18), confidence: 'bold' };
    const f = answerB(four, MEASURED);
    expect(f.level).toBe('bold');
    expect(f.verdict.band).toBe('yes');
    expect(f.sentences.enoughHead).toBeUndefined();
  }, 60_000);

  it('on course (Alex, a fixed £400 a month, no employer part): no employer clause; how little would still be on course; no gap', () => {
    const alex = { household: 'single', you: { age: 38, pot: 30000, payIn: { kind: 'total', total: 400 } }, stop: { age: 66 }, spend: { kind: 'amount', amount: 1500 } };
    const a = ok(answerB(alex, MEASURED), alex);
    const s = a.sentences;
    expect(a.verdict.band).toBe('yes');
    expect(s.verdictHead.text).toBe('On course for £1,500 a month from 66');
    expect(s.verdictLine.text).toBe('Paying in £400 a month as now, your money lasted until you are 95 in 9 futures out of 10. You could pay in as little as £380 a month and still be on course.');
    expect(s.income.text).toBe('To last in 9 futures out of 10, you could spend £1,520 a month from 66, with your State Pension from 68 (the full amount, as assumed).');
    expect(a.gap.month).toBe(0);
    expect(s.enoughHead).toBeUndefined();
    expect(a.levers.oneOff).toBeNull();
  }, 60_000);

  it('a fixed payer with an employer part (Alex, £250 and £150 a month): pounds, your part the rest over the employer\'s as entered', () => {
    const alex = { household: 'single', you: { age: 40, pot: 50000, payIn: { kind: 'split', own: 250, employer: 150 } }, stop: { age: 64 }, spend: { kind: 'amount', amount: 2100 } };
    const a = ok(answerB(alex, ENV), alex);
    const nine = a.enough.atLevel;
    expect(a.enough.how).toBe('pounds');
    expect(nine.employer).toBe(150);
    expect(nine.own).toBe(nine.payIn - 150);
    expect(a.sentences.verdictLine.text).toContain('(your employer\'s £150 included)');
    expect(a.sentences.verdictLine.text).toContain(`(you £${nine.own.toLocaleString('en-GB')}, your employer's £150 as now) would put you on course`);
    expect(a.sentences.enoughHead.text).toMatch(/^To be on course: £[\d,]+ a month into your pension$/);
    expect(a.sentences.enoughLine.text).toMatch(/^You £[\d,]+ and your employer £150 as now, from now until you are 64, going up with prices\. /);
    expect(text(a)).not.toMatch(/% of your pay/);
  });

  it('a pay of £0 (Sam on a break, the employer\'s 3% as given): pounds a month, never a share of £0, never "all of your pay"', () => {
    const away = { household: 'single', you: { age: 36, pot: 30000, payIn: { kind: 'share', pay: 0, ownPct: 0, employerPct: 3 } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2000 } };
    const a = ok(answerB(away, ENV), away);
    expect(a.enough.how).toBe('pounds');
    expect(a.enough.paused && a.enough.pausedEmployer).toBe(true);
    expect(text(a)).not.toMatch(/% of your pay|all of your pay/);
    expect(a.sentences.enoughHead.text).toMatch(/^To be on course: £[\d,]+ a month into your pension$/);
    expect(a.sentences.enoughPaused.text).toBe('Your employer\'s part is as you gave it (nothing while you are not paying in). This is from now: if you start again later, you would need more.');
  });

  it('stopping before a pension can be touched (Sam, 45, stopping at 55): the share into the pension and the savings a month, both stated; at them the test holds', () => {
    const early = sam(8, { you: { age: 45, pot: 80000, payIn: { kind: 'share', pay: 52000, ownPct: 8, employerPct: 5 } }, stop: { age: 55 }, spend: { kind: 'amount', amount: 2200 }, savings: 20000, savingsIn: 200 });
    const a = ok(answerB(early, ENV), early);
    const nine = a.enough.atLevel;
    expect(a.outside).not.toBeNull();
    expect(nine.savingsIn).toBe(a.payIn.outside);
    expect(a.sentences.enoughHead.text).toMatch(/^To be on course: [\d.]+% of your pay in all into your pension, and £[\d,]+ a month into ISAs or savings until you are 55$/);
    expect(a.sentences.enoughLine.text).toContain('The savings carry the years from 55 to 57, before you can take money from a pension; the pension carries the rest.');
    // asked again at both figures: on course, the count the answer said
    const at = { ...withShare(early, nine.ownPct), savingsIn: nine.savingsIn };
    const b = ok(answerB(at, ENV), at);
    expect(b.chance.fails).toBe(nine.fails);
    expect(b.onCourse).toBe(true);
  });

  it('only the savings fall short: what goes into the pension is enough — no share is searched, the savings a month alone', () => {
    // a good pension, no savings and nothing going into them: the years from 52 to 57 are all the savings' to carry
    const inputs = { household: 'single', you: { age: 40, pot: 200000, payIn: { kind: 'share', pay: 40000, ownPct: 2, employerPct: 3 } }, stop: { age: 52 }, spend: { kind: 'amount', amount: 1200 }, savings: 0, savingsIn: 0 };
    const a = ok(answerB(inputs, ENV), inputs);
    expect(a.enough.savingsOnly).toBe(true);
    expect(a.enough.atLevel.totalPct).toBeUndefined();
    expect(a.enough.atLevel.payIn).toBe(a.payIn.now);
    expect(a.sentences.enoughHead.text).toMatch(/^What goes into your pension is enough\. The years from 52 to 57 need £[\d,]+ a month into ISAs or savings until you are 52\.$/);
    expect(a.sentences.verdictLine.text).toMatch(/What goes into your pension is enough; £[\d,]+ a month into ISAs or savings until you are 52 would put you on course, which is 9 in 10\.$/);
    // at the savings a month said, paying into the pension as now: on course, the count said
    const at = { ...inputs, savingsIn: a.enough.atLevel.savingsIn };
    expect(ok(answerB(at, ENV), at).chance.fails).toBe(a.enough.atLevel.fails);
  });

  it('out of reach by paying in (Alex, 52, little saved, a high aim): "even all of your pay going in would not be on course", and the other ways lead', () => {
    const alex = { household: 'single', you: { age: 52, pot: 20000, payIn: { kind: 'share', pay: 25000, ownPct: 4, employerPct: 2 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 4500 } };
    const a = ok(answerB(alex, ENV), alex);
    expect(a.enough.atLevel).toBeNull();
    expect(a.enough.outOfReach).toBe('pay');
    expect(a.sentences.verdictLine.text).toContain('; even all of your pay going in would not be on course');
    expect(a.sentences.enoughHead.text).toBe('Even all of your pay going in would not be on course for £4,500 a month from 62.');
    expect(a.levers.payMore).toBeNull();
  });

  it('a couple: between you, each part in that person\'s own kind', () => {
    const couple = { household: 'couple', you: { age: 45, pot: 90000, payIn: { kind: 'share', pay: 52000, ownPct: 5, employerPct: 5 } },
      partner: { age: 43, pot: 40000, payIn: { kind: 'total', total: 250 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 3000 } };
    const a = ok(answerB(couple, ENV), couple);
    expect(a.enough.how).toBe('couple');
    expect(a.sentences.verdictHead.text).toMatch(/ a month between you from when you are 62$/);
    const nine = a.enough.atLevel;
    expect(nine.parts.map((x) => x.who)).toEqual(['you', 'partner']);
    expect(nine.parts[0].employerPct).toBe(5);
    expect(nine.parts[1].totalPct).toBeUndefined();
    // each person's OWN part, as "you 27%" is for one person; the employer's part named after them
    expect(a.sentences.verdictLine.text).toContain(`a month between you (you ${nine.parts[0].ownPct}% of your pay, your partner £`);
    expect(a.sentences.verdictLine.text).toMatch(/your partner £[\d,]+ a month, with your employer's part as now\) would put you on course/);
    expect(a.sentences.verdictLine.text).toContain("between you as now (your employer's part included)");
  });

  it('a couple both giving a share: each own part, the employers\' parts named as now — never a total read as your own', () => {
    const both = { household: 'couple', you: { age: 40, pot: 30000, payIn: { kind: 'share', pay: 52000, ownPct: 5, employerPct: 5 } },
      partner: { age: 38, pot: 20000, payIn: { kind: 'share', pay: 31000, ownPct: 4, employerPct: 3 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 3200 } };
    const a = ok(answerB(both, ENV), both);
    const [you, partner] = a.enough.atLevel.parts;
    const s = a.sentences;
    expect(s.verdictLine.text).toContain(`(you ${you.ownPct}% of your pay, your partner ${partner.ownPct}% of their pay, with your employers' parts as now)`);
    expect(s.verdictLine.text).toContain("between you as now (your employers' parts included)");
    expect(s.enoughLine.text).toMatch(new RegExp(`^You ${you.ownPct}% of your pay and your employer 5% \\(£[\\d,]+ a month\\), and your partner ${partner.ownPct}% of their pay and their employer 3% \\(£[\\d,]+ a month\\), from now until you are 62`));
    expect(s.enoughMatch.text).toBe('If your employers add more when you pay more, you would need less: these keep your employers\' parts as they are now.');
  });

  it('a couple whose split as now would put one share past all of a pay: that part is held at all of the pay and the rest goes to the other — a figure, its own count, and "Pay in more"', () => {
    // Alex gives a share of a small pay, Sam a fixed £40 a month: split as now, Alex's part would be more than all of Alex's pay
    const couple = { household: 'couple', you: { age: 45, pot: 20000, payIn: { kind: 'share', pay: 24000, ownPct: 6, employerPct: 3 } },
      partner: { age: 44, pot: 15000, payIn: { kind: 'total', total: 40 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 3400 } };
    const a = ok(answerB(couple, ENV), couple);
    const nine = a.enough.atLevel;
    expect(a.enough.outOfReach).toBeNull();
    expect(nine.parts[0].ownPct).toBe(100);
    // Sam takes the rest: more than Sam's part split as now
    expect(nine.parts[1].payIn).toBeGreaterThan(nine.payIn * 40 / a.payIn.now);
    expect(a.levers.payMore).toMatchObject({ payIn: nine.payIn, lasted: nine.lasted });
    expect(text(a)).not.toMatch(/no pay-in up to/);
    expect(a.sentences.verdictLine.text).toContain('(you 100% of your pay, your partner £');
    // asked again at exactly the parts said: the count said
    const at = { ...couple, you: { ...couple.you, payIn: { ...couple.you.payIn, ownPct: nine.parts[0].ownPct } }, partner: { ...couple.partner, payIn: { kind: 'total', total: nine.parts[1].payIn } } };
    const b = ok(answerB(at, ENV), at);
    expect(b.chance.fails).toBe(nine.fails);
  });

  it('a couple each at their most: "even all of your pay and all of your partner\'s pay going in" — whose most, never the £10,000 a month neither could pay', () => {
    const couple = { household: 'couple', you: { age: 45, pot: 20000, payIn: { kind: 'share', pay: 24000, ownPct: 6, employerPct: 3 } },
      partner: { age: 44, pot: 15000, payIn: { kind: 'share', pay: 20000, ownPct: 4, employerPct: 3 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 4600 } };
    const a = ok(answerB(couple, ENV), couple);
    expect(a.levels[a.level].payIn).not.toBeNull();
    expect(a.enough.outOfReach).toBe('pay');
    expect(a.enough.caps).toEqual([{ who: 'you', by: 'pay' }, { who: 'partner', by: 'pay' }]);
    expect(a.sentences.verdictLine.text).toContain("; even all of your pay and all of your partner's pay going in would not be on course");
    expect(a.sentences.enoughHead.text).toBe("Even all of your pay and all of your partner's pay going in would not be on course for £4,600 a month between you from when you are 62.");
    expect(text(a)).not.toMatch(/£10,000 a month each/);
  });

  it('your partner the one saving ("I\'ve already stopped") with a share of pay: their pay, their employer, their pension — never yours', () => {
    const already = (ownPct, amount) => ({ household: 'couple', you: { age: 58, pot: 250000, payIn: { kind: 'total', total: 0 } }, stop: { kind: 'already' },
      partner: { age: 52, pot: 60000, payIn: { kind: 'share', pay: 38000, ownPct, employerPct: 4 }, stop: { kind: 'age', age: 62 } }, spend: { kind: 'amount', amount } });
    const a = ok(answerB(already(5, 3000), ENV), already(5, 3000));
    const s = a.sentences;
    expect(a.enough.how).toBe('share');
    expect(a.enough.who).toBe('partner');
    expect(a.verdict.band).not.toBe('yes');
    const nine = a.enough.atLevel;
    expect(s.verdictLine.text).toMatch(/^With your partner paying in 9% of their pay as now \(£[\d,]+ a month, their employer's 4% included\), /);
    expect(s.verdictLine.text).toContain(`${nine.totalPct}% of your partner's pay in all (your partner ${nine.ownPct}%, £`);
    expect(s.enoughHead.text).toBe(`To be on course: ${nine.totalPct}% of your partner's pay in all`);
    expect(s.enoughLine.text).toMatch(new RegExp(`^Your partner ${nine.ownPct}% and their employer 4% as now: £[\\d,]+ a month going into your partner's pension from now until your partner stops at 62`));
    expect(s.enoughMatch.text).toContain("If your partner's employer adds more when they pay more");
    const verdict = [s.verdictLine, s.enoughHead, s.enoughLine, s.enoughFour].filter(Boolean).map((x) => x.text).join(' ');
    expect(verdict).not.toMatch(/\byour pay\b|\byou \d|your employer|into your pension\b/);
    if (a.levers.payMore) expect(s.lever.payMore.text).toMatch(/^Your partner pays in [\d.]+% of their pay in all \(your partner [\d.]+%, /);
    // on course: they could stop paying in themselves, with their employer's part going in
    const easy = already(20, 1200);
    const b = ok(answerB(easy, ENV), easy);
    if (b.verdict.band === 'yes' && b.enough.atLevel && b.enough.atLevel.ownPct === 0) {
      expect(b.sentences.verdictLine.text).toContain("Your partner could stop paying in themselves, with their employer's 4% going in, and still be on course.");
    }
    expect(b.sentences.verdictLine.text).toMatch(/^With your partner paying in 24% of their pay as now/);
  });

  it('your partner the one saving in pounds: "With your partner paying in …", not "between you"', () => {
    const already = { household: 'couple', you: { age: 58, pot: 250000, payIn: { kind: 'total', total: 0 } }, stop: { kind: 'already' },
      partner: { age: 52, pot: 60000, payIn: { kind: 'split', own: 300, employer: 150 }, stop: { kind: 'age', age: 62 } }, spend: { kind: 'amount', amount: 3000 } };
    const a = ok(answerB(already, ENV), already);
    expect(a.enough.how).toBe('pounds');
    expect(a.sentences.verdictLine.text).toMatch(/^With your partner paying in £450 a month as now \(their employer's £150 included\), /);
    expect(a.sentences.verdictLine.text).not.toContain('between you as now');
    if (a.enough.atLevel) expect(a.sentences.verdictLine.text).toMatch(/\(your partner £[\d,]+, their employer's £150 as now\)/);
  });

  it('on course, your employer\'s part alone enough: "You could stop paying in yourself", in pounds as in shares', () => {
    const alex = { household: 'single', you: { age: 48, pot: 600000, payIn: { kind: 'split', own: 500, employer: 300 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } };
    const a = ok(answerB(alex, ENV), alex);
    expect(a.verdict.band).toBe('yes');
    expect(a.enough.atLevel).toMatchObject({ own: 0, employer: 300 });
    expect(a.sentences.verdictLine.text).toMatch(/You could stop paying in yourself, with your employer's £300 going in, and still be on course\.$/);
  });
});

describe('the warnings and the ways are about what the words state', () => {
  const AT = (futures) => ({ ...MEASURED, futures });
  it('the allowances are checked at the share said, not B\'s whole £10: a share a grid step above £60,000 or £10,000 a year is warned of', () => {
    // Alex on a high pay: B's £10 figure is £5,000 a month (£60,000 a year), the share said lands a little more
    const high = { household: 'single', you: { age: 45, pot: 100000, payIn: { kind: 'share', pay: 170000, ownPct: 5, employerPct: 5 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 3410 } };
    const a = ok(answerB(high, AT(100)), high);
    expect(a.enough.atLevel.payIn * 12).toBeGreaterThan(RULES.annualAllowance);
    expect(a.warnings.map((w) => w.id)).toContain('annual-allowance');
    // Sam, already drawing: B's figure £830 a month (£9,960 a year), the share said £850 (£10,200)
    const drawing = { household: 'single', you: { age: 57, pot: 200000, payIn: { kind: 'share', pay: 60000, ownPct: 6, employerPct: 3 }, alreadyDrawing: true }, stop: { age: 67 }, spend: { kind: 'amount', amount: 2000 } };
    const b = ok(answerB(drawing, AT(100)), drawing);
    expect(b.enough.atLevel.payIn * 12).toBeGreaterThan(RULES.moneyPurchaseAllowance);
    expect(b.warnings.map((w) => w.id)).toContain('mpaa');
  }, 60_000);

  it('the one-off sum is checked with a year of what goes in now, and against the pay of someone who gave it', () => {
    // Alex: £1,000 a month going in (15% and 5% of £60,000); a sum under £60,000 with a year of that is over it
    const alex = { household: 'single', you: { age: 50, pot: 610000, payIn: { kind: 'share', pay: 60000, ownPct: 15, employerPct: 5 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 3000 } };
    const a = ok(answerB(alex, AT(200)), alex);
    const o = a.levers.oneOff;
    expect(o.amount).toBeLessThanOrEqual(RULES.annualAllowance);
    expect(o.amount + a.payIn.now * 12).toBeGreaterThan(RULES.annualAllowance);
    expect(o).toMatchObject({ overAllowance: true, over: ['you'] });
    expect(a.sentences.lever.oneOff.text).toContain('With what goes in now, that is more than £60,000 in one year: the most that gets the tax the government adds back');
    // £58,000 or so and a year of Alex's own 15% (£9,000) is more than Alex's pay of £60,000
    expect(o.overPay).toEqual(['you']);
    expect(a.sentences.lever.oneOff.text).toContain('The tax is added back only on what you pay in up to your pay in a year');
  }, 60_000);

  it('out of reach by paying in: the line under it names only the ways below that were found, and none when none was', () => {
    const singles = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter(asksB).filter((i) => i.household === 'single');
    fc.assert(fc.property(singles, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      const s = a.sentences;
      fc.pre(Boolean(a.enough && a.enough.outOfReach));
      const lv = a.levers;
      const line = s.enoughLine && s.enoughLine.id === 'b.enough.line.outOfReach' ? s.enoughLine.text : '';
      expect(line.includes('stopping later'), 'stopping later').toBe(Boolean(lv.stopLater));
      expect(line.includes('spending less'), 'spending less').toBe(Boolean(lv.spendLess));
      expect(line.includes('a one-off sum now'), 'a one-off sum').toBe(Boolean(lv.oneOff));
      if (!lv.stopLater && !lv.spendLess && !lv.oneOff) expect(s.enoughLine).toBeUndefined();
    }), opts(12));
    // Alex, 30, aiming far beyond any pot: no other way was found, so none is pointed to
    const far = { household: 'single', you: { age: 30, pot: 10000, payIn: { kind: 'total', total: 500 } }, stop: { age: 40 }, spend: { kind: 'amount', amount: 20000 } };
    const b = ok(answerB(far, ENV), far);
    expect(b.enough.outOfReach).toBe('pot');
    expect(b.sentences.enoughLine).toBeUndefined();
  }, 240_000);
});

describe('the solver: shares of pay on the 0.5% grid, every count the one test\'s (3.3)', () => {
  const singles = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter(asksB).filter((i) => i.household === 'single');
  const shares = singles.map((i) => ({ ...i, you: { ...i.you, payIn: { kind: 'share', pay: [18000, 31000, 52000, 90000][i.you.age % 4], ownPct: (i.you.age % 9), employerPct: [0, 3, 4.5, 6][i.you.age % 4] } } }));

  it('the share said is on course, and B asked again at it gives exactly its count; one grid step less does not last (to one life); 3 in 4 the same at its bar', () => {
    fc.assert(fc.property(shares, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      fc.pre(a.status !== 'guaranteed-only' && a.enough && !a.enough.savingsOnly);
      for (const [k, bar] of [['atLevel', Math.floor(ENV.futures / 10)]]) {
        const fig = a.enough[k];
        if (!fig) continue;
        const at = { ...withShare(inputs, fig.ownPct), ...(fig.savingsIn !== null ? { savingsIn: fig.savingsIn } : {}) };
        const b = ok(answerB(at, ENV), at);
        // the count it claims is the one test's, at exactly the pay-in it names
        expect(b.chance.fails, k).toBe(fig.fails);
        expect(b.chance.fails, k).toBeLessThanOrEqual(bar);
        expect(b.payIn.now).toBe(fig.payIn);
        if (fig.ownPct >= 0.5) {
          const less = { ...withShare(inputs, fig.ownPct - 0.5), ...(fig.savingsIn !== null ? { savingsIn: fig.savingsIn } : {}) };
          const c = ok(answerB(less, ENV), less);
          expect(c.chance.fails + 1, `${k}: one step less`).toBeGreaterThan(bar);
        }
      }
    }), opts());
  }, 240_000);

  it('never past all of the pay; 3 in 4 never above 9 in 10; the employer\'s share as entered; the pounds within one grid step of B\'s own £10', () => {
    fc.assert(fc.property(shares, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      fc.pre(a.enough && a.enough.how === 'share' && !a.enough.savingsOnly);
      const p = inputs.you.payIn;
      const step = p.pay * 0.5 / 100 / 12;
      for (const k of ['atLevel']) {
        const fig = a.enough[k];
        if (!fig) continue;
        expect(fig.ownPct).toBeGreaterThanOrEqual(0);
        expect(fig.ownPct).toBeLessThanOrEqual(100);
        expect(fig.employerPct).toBe(p.employerPct);
        expect(fig.payIn).toBe(payInParts({ kind: 'share', pay: p.pay, ownPct: fig.ownPct, employerPct: p.employerPct }).total);
        // B's least whole £10 did and £10 less did not; the share found is between, but never below the employer's part
        // alone (a share of nothing from you, the employer's as entered, can land more than B's figure)
        const pounds = a.levels[a.level].payIn;
        if (pounds !== null) {
          expect(fig.payIn, k).toBeGreaterThan(pounds - 10 - 0.01);
          if (fig.ownPct > 0) expect(fig.payIn, k).toBeLessThan(pounds + step + 0.01);
        }
      }
      if (a.enough.outOfReach === 'pay') expect(a.levels[a.level].payIn === null || a.levels[a.level].payIn > payInParts({ ...p, ownPct: 100 }).total - 10).toBe(true);
    }), opts());
  }, 240_000);

  it('more paid in, in shares, lasts in no fewer futures — to one life (PB1 in shares)', () => {
    fc.assert(fc.property(shares, fc.integer({ min: 1, max: 20 }), (inputs, more) => {
      const a = ok(answerB(inputs, ENV), inputs);
      const higher = withShare(inputs, Math.min(100, inputs.you.payIn.ownPct + more));
      const b = ok(answerB(higher, ENV), higher);
      expect(b.chance.fixedAge).toBeGreaterThanOrEqual(a.chance.fixedAge - oneLife(ENV.futures));
    }), opts());
  }, 240_000);

  it('the band is verdictOf on the count; on course and a gap of nothing agree, to B\'s £10 step; the Close band says its 3-in-4 line from the count; below it, the 3-in-4 figure is above today\'s', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      expect(a.verdict.band).toBe(verdictOf(a.chance.fails, ENV.futures));
      if (a.status === 'guaranteed-only') return;
      if (a.verdict.band === 'yes') expect(a.gap.month, 'on course: the bad case reaches the aim, to £10').toBeLessThan(10);
      if (a.gap.month === 0 && a.status === 'ok') expect(a.chance.fails, 'the bad case reaches the aim: on course, to one life').toBeLessThanOrEqual(Math.floor(ENV.futures / 10) + 1);
      if (a.verdict.band === 'close') expect(a.enough.closeNow).toBe(true);
    }), opts(12));
  }, 240_000);

  it('the one-off sum: on course at it, in B asked again with the pot that much larger; £1,000 less is not', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      fc.pre(a.levers.oneOff !== null);
      const L = a.levers.oneOff.amount;
      const bar = Math.floor(ENV.futures * a.basis.levelFails20 / 20);          // the level's count (7.8.0)
      const more = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + L } };
      expect(ok(answerB(more, ENV), more).chance.fails).toBeLessThanOrEqual(bar);
      if (L > 1000) {
        const less = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + L - 1000 } };
        expect(ok(answerB(less, ENV), less).chance.fails).toBeGreaterThan(bar);
      }
    }), opts());
  }, 240_000);

  it('a couple: never "no pay-in up to £10,000 a month each" when B found a figure — a part past its person\'s pay goes to the other, and when nothing would do, the words say whose most was reached', () => {
    const couples = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter(asksB).filter((i) => i.household === 'couple' && i.partner)
      .map((i) => ({ ...i, you: { ...i.you, payIn: { kind: 'share', pay: [14000, 24000, 31000, 52000][i.you.age % 4], ownPct: i.you.age % 9, employerPct: [0, 3, 4, 6][i.you.age % 4] } } }));
    fc.assert(fc.property(couples, (inputs) => {
      const a = ok(answerB(inputs, ENV), inputs);
      fc.pre(Boolean(a.enough) && a.enough.how === 'couple' && a.verdict.band !== 'yes');
      if (a.levels[a.level].payIn !== null) expect(a.enough.outOfReach, 'B found a figure').not.toBe('ceiling');
      if (a.enough.outOfReach === 'pay') {
        expect(a.enough.caps.length).toBe(2);
        expect(a.sentences.verdictLine.text).toMatch(/; even all of (your|your partner's) pay( and .*)? going in would not be on course/);
      }
      for (const part of (a.enough.atLevel || { parts: [] }).parts) if (typeof part.ownPct === 'number') expect(part.ownPct).toBeLessThanOrEqual(100);
    }), opts(12));
  }, 240_000);

  it('no pay, no share: with a pay of £0 the answer is in pounds, never a share and never "all of your pay"', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const away = { ...inputs, you: { ...inputs.you, payIn: { kind: 'share', pay: 0, ownPct: 0, employerPct: inputs.you.age % 7 } } };
      const a = ok(answerB(away, ENV), away);
      if (!a.enough) return;
      expect(a.enough.how).toBe('pounds');
      expect(a.enough.outOfReach).not.toBe('pay');
      expect(text(a)).not.toMatch(/% of your pay|all of your pay/);
    }), opts());
  }, 240_000);
});

describe('keeping "on course" (3.6): the seed is the answer at that figure, in the person\'s own kind; "as now" is as before', () => {
  const name = { suggested: 'x', chosen: 'Sam on course' };
  const env = { today: MEASURED.today, appVersion: 'test' };
  it('a share of pay keeps its kind, at the share that would be on course; the count and the bad case are the ones B said', () => {
    const a = answerB(sam(6), ENV);
    const now = buildPlanSeed({ source: 'b', result: a, env, name, createdAt: '2026-11-04T10:00:00.000Z' });
    expect(buildPlanSeed({ source: 'b', result: a, env, name, createdAt: '2026-11-04T10:00:00.000Z', payIn: 'now' })).toEqual(now);
    const kept = buildPlanSeed({ source: 'b', result: a, env, name, createdAt: '2026-11-04T10:00:00.000Z', payIn: 'enough' });
    const nine = a.enough.atLevel;
    expect(kept.inputs.you.payIn).toEqual({ ...sam(6).you.payIn, ownPct: nine.ownPct });
    expect(kept.people[0].payIn).toMatchObject({ total: nine.payIn, own: nine.own, employer: nine.employer, pay: 38000 });
    expect(kept.people[0].pension.atStop).toEqual({ careful: nine.parts[0].atStop.pension.careful, middling: nine.parts[0].atStop.pension.middling });
    // (seed version 4, 7.8.0: the level's answer row — the figure at the level, and the count at it)
    expect(kept.answer).toMatchObject({ level: 'balanced', levelChosen: false, shown: { payIn: a.payIn.needed }, chance: { fixedAge: nine.lasted } });
    // nothing new is stored: the same keys as the seed kept paying in as now
    expect(Object.keys(kept)).toEqual(Object.keys(now));
    expect(Object.keys(kept.people[0])).toEqual(Object.keys(now.people[0]));
    // a name left as suggested follows what is kept; one the person typed stays theirs
    const followed = buildPlanSeed({ source: 'b', result: a, env, name: { suggested: now.name.suggested, chosen: now.name.suggested }, createdAt: '2026-11-04T10:00:00.000Z', payIn: 'enough' });
    expect(followed.name.chosen).toBe(followed.name.suggested);
    expect(followed.name.chosen).not.toBe(now.name.suggested);
    expect(kept.name.chosen).toBe('Sam on course');
  });
  it('on course already, or nothing would be enough: nothing to choose (atEnough is null, the seed refused)', () => {
    const alex = { household: 'single', you: { age: 38, pot: 30000, payIn: { kind: 'total', total: 400 } }, stop: { age: 66 }, spend: { kind: 'amount', amount: 1500 } };
    const a = answerB(alex, { ...ENV, futures: 100 });
    if (a.verdict.band === 'yes') {
      expect(atEnough(a)).toBeNull();
      expect(buildPlanSeed({ source: 'b', result: a, env, name, createdAt: '2026-11-04T10:00:00.000Z', payIn: 'enough' })).toBeNull();
    }
  });
});

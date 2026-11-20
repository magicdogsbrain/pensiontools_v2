/**
 * The words of "Will it last?" and "How much can I take?" (one person, from now) are the kept plan's (step P2, fix round 1):
 * the split of each stretch (from the pension, from savings, tax), the months the pots alone pay before the first income
 * that comes anyway, the ages and incomes the sentences name, a pension still closed, and what the page says when a level
 * is lifted to what comes in anyway (the lead's ruling D).
 *
 * The people are made up (Alex, Pat, Kim, Jo; round figures). 40 futures, 30 September 2026.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerD } from '../d/_d.js';
import { answerC } from '../c/_c.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { planFor } from '../../../src/answers/plan/lastsRun.js';
import { dateOf } from '../../../src/answers/plan/dates.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { livesList, sliceReturns } from '../../../src/answers/shared/lives.js';
import * as planPath from '../../../src/answers/keep/planPath.js';
import { breakdownAt } from '../../../src/answers/shared/toEngine.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const pounds = (v) => '£' + Math.round(v).toLocaleString('en-GB');

describe('ruling D on "Will it last?": a level lifted to what comes in anyway is said as that, never as headroom', () => {
  // Alex (made up), 66, the full State Pension (£12,547.60 a year) and a final-salary pension of £15,000 a year being paid,
  // its rises capped at 5%; £1,000 in a pension; spends £1,800 a month. What comes in anyway: £27,547.60 a year before tax,
  // £14,977.60 of it above the £12,570 allowance at 20% = £2,995.52 tax, £24,552.08 after = £2,046.01 a month, said in whole
  // £10s: £2,040. Every level is lifted to £2,040, with its own chance (about 3 in 20 at 40 futures), while £1,800 is "Not"
  // (the capped rises fall behind prices in some futures and £1,000 cannot make up the gap). Before: "What you spend is
  // about what Balanced allows: 3 times in 20, as long as you do." (£240 more than a spend that already fails), and no
  // sentence said why. The lead's ruling I (20 Nov 2026): where the floor lifted the level, the sentence says so plainly —
  // what comes in anyway and its own chance — instead of offering it as headroom.
  const ALEX = { you: { age: 66, pot: 1000, taxFreeTaken: 'no', finalSalary: { has: true, yearly: 15000, fromAge: 60 } }, spend: { kind: 'amount', amount: 1800 } };
  it('Alex at £1,800: the headroom says what comes in anyway and its own chance, and the capped-rise note is there', () => {
    const d = answerD(ALEX, ENV);
    expect(d.verdict).not.toBe('yes');
    expect(d.levels.balanced.monthly).toBe(2040);
    expect(d.headroom.kind).toBe('anyway');
    const text = d.sentences.headroom.text;
    expect(text).not.toMatch(/about what/);
    expect(text).toBe('About £2,040 a month comes in anyway; it keeps its buying power as long as you do 3 times in 20.');
    expect(d.warnings.find((w) => w.id === 'final-salary-capped').text).toBe('Your pension from your final-salary scheme rises by at most 5% a year; in years when prices rise faster it buys less.');
  }, 60000);
});

describe('the bridge counts the months the kept plan pays from the pots alone', () => {
  // Pat (made up), 60, £200,000 in a pension, £20,000 of savings, a final-salary pension of £9,000 a year from 63. The kept
  // plan's year 0 is the tax year's months from the pots' day: October 2026 to March 2027 and September's own, 7 months
  // (year0Months 7); the final-salary pension pays from run year 3 (April 2029). So the pots alone pay 7 + 12 + 12 = 31
  // months, not 36: at Balanced's £1,820 a month (100 futures, the check) that is £56,420, about £56,000 (was 36 × £1,820 =
  // £65,520, said £66,000). Said: "2 years and 7 months".
  it('Pat, How much can I take, from now: 31 months of the first stretch\'s draw', () => {
    const c = answerC({ you: { age: 60, pot: 200000, finalSalary: { has: true, yearly: 9000, fromAge: 63 } }, savings: 20000 }, ENV);
    expect(c.phases[0].months).toBe(31);
    const total = Math.round((c.phases[0].shown.fromPots * 31) / 1000) * 1000;
    expect(c.sentences.bridge.text).toContain(`From 60 to 63 all of it comes from your pot and savings: 2 years and 7 months, about ${pounds(total)} at today's prices.`);
  }, 60000);
});

describe('what a stretch is made of is the kept plan\'s own draw', () => {
  // Kim (made up), 68, the full State Pension being paid (£12,547.60 a year), £150,000 in a pension, a quarter of each
  // withdrawal tax-free, spends £1,500 a month. The keep grosses £18,000 a year as if all taxed: £12,570 + £5,430 / 0.8 =
  // £19,357.50 (and stores it as £19,358, whole pounds). The kept plan draws D from the pension with a quarter tax-free
  // (planDrawdown, its bands, its access method): £12,547.60 + D − 20% × (£12,547.60 + 0.75 D − £12,570) = £18,000, so
  // £12,552.08 + 0.85 D = £18,000, D = £6,409.32 a year = £534.11 a month; tax 20% × (0.75 × £6,409.32 − £22.40) = £956.92
  // a year = £79.74 a month. The plan's own run at the stored £19,358 asks £18,000.40 of it: D = £534.15 a month, the
  // keep's whole-pound rounding and nothing else.
  it('Kim at £1,500: from the pension £534.11 a month, tax £79.74, by the kept plan\'s own draw', () => {
    const d = answerD({ you: { age: 68, pot: 150000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1500 } }, ENV);
    expect(d.phases).toHaveLength(1);
    expect(d.phases[0].fromPension).toBe(534.11);
    expect(d.phases[0].tax).toBe(79.74);
    expect(d.phases[0].takeHome).toBe(1500);
    expect(d.phases[0].statePension).toBe(1045.63);
    // the split is the words plan's own (planPath splitAt), which the household's reader hands such a plan to
    const pc = planPath.planCaseOf('d', d.inputs, { ...ENV, planPath }, { fromAge: 68 });
    expect(breakdownAt(pc.wordsPlan, 18000)).toEqual(pc.wordsPlan.breakdownAt(18000));
    // the kept plan's own month (its first paid month, at today's prices): the same draw at its stored £19,358
    const kept = keptPlansOf('d', d, ENV).yours;
    const now = dateOf(TODAY);
    const p = planFor(effectiveStressSettings(kept, { now }), now);
    expect(p.pnvCfg.baseSalary).toBe(19358);
    const L = livesList(1, p.durationYears, ENV);
    const r = simulate({ ...p.pnvCfg, years: p.durationYears, trace: true }, sliceReturns(L[0], 0, p.durationYears), L[0].seed);
    const paid = r.trace.find((t) => t.year === 0 && t.sippMonthly > 0);
    expect(Math.round(paid.sippMonthly * 100) / 100).toBe(534.15);
  }, 60000);
});

describe('a pension still closed is said as the kept plan takes it (the lead\'s rulings G and H)', () => {
  // Jo (made up), 53 on 30 September 2026 (the plan counts the birthday as that day), £250,000 in a pension, £60,000 of
  // savings, spends £1,500 a month. The law: the pension can be touched from 57 (Jo is 55 after 6 April 2028). The kept plan
  // takes from it from the first tax year that STARTS with Jo 57 or over: Jo is 57 on 30 September 2030, so 2030/31 starts
  // with Jo 56 and 2031/32 (6 April 2031) with Jo 57: April 2031, run year 5 (the phases: 53 until 58, savings only). Ruling
  // G: both facts in one sentence, from one builder (PensionAge.pensionOpensSentence), in the warning, the assumption and the
  // closed stretch. Before: "You can't take money from your pension until you are 57. Until then your ISA and savings pay."
  // against phases that say 58.
  // Ruling H: the kept plan runs 45 years (53 + 45 = 98, short of the end age 100): "We can only test 45 years ahead". Before:
  // "60" (the answer's own constant, drawYearsCap while weighing), which is not the plan's limit.
  const SAID = 'You can take money from your pension from 57. This plan takes it from April 2031, the first tax year you start at 57 or over';
  it('Jo at £1,500: the warning, the assumption and the closed stretch say the law\'s age and the plan\'s April 2031', () => {
    const d = answerD({ you: { age: 53, pot: 250000, taxFreeTaken: 'no' }, savings: 60000, spend: { kind: 'amount', amount: 1500 } }, ENV);
    const closed = d.phases.filter((ph) => ph.pensionOpen === false);
    expect(closed[closed.length - 1].toAge).toBe(58);
    expect(d.warnings.find((w) => w.id === 'pension-closed').text).toBe(SAID + '; until then your ISA and savings pay.');
    expect(d.assumed.find((a) => a.id === 'pension-closed-until').text).toBe(SAID + '; until then your ISA and savings pay.');
    expect(d.sentences.madeOf[0].text).toBe('From 53 until 58: £1,500 a month, all from your savings. ' + SAID + '.');
    expect(d.warnings.find((w) => w.id === 'long-plan').text).toBe('We can only test 45 years ahead, so this runs to age 98, not 100.');
  }, 60000);
});

describe('How much can I take: "We can only test N years ahead" names the kept plan\'s own limit (ruling H)', () => {
  // Sam (made up), 55 on 30 September 2026 (55 before 6 April 2028: the pension is open), £300,000 in a pension, asks to
  // plan to 102. The plan keeping writes runs at most 45 years: 55 + 45 = 100, short of 102. Before: "We can only test 60
  // years ahead" (the answer's drawYearsCap while weighing), which is not the limit the kept plan stopped at.
  it('Sam to 102: 45 years, to age 100', () => {
    const c = answerC({ you: { age: 55, pot: 300000 }, endAge: 102 }, ENV);
    expect(c.warnings.find((w) => w.id === 'long-plan').text).toBe('We can only test 45 years ahead, so this runs to age 100, not 102.');
  }, 60000);
});

describe('"Will it last?" from now (one person) reads the full State Pension as the kept plan does, not from the household', () => {
  it('answerD takes fullStatePensionAYear from the rules the plan reads, never from toHousehold', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/answers/d/answer.js'), 'utf8');
    expect(src).not.toMatch(/named\.fullStatePensionAYear/);
  });
});

describe('How much can I take from now (one person) reads its facts from the kept plan, not the household', () => {
  // The facts the sentences, the assumed lines and the warnings read (State Pension age, final-salary start, the age the
  // pension opens, the plan's start, the split) come from the words plan (keep/planPath.js wordsPlan) on the plan path.
  it('answerOnPlanPath hands the words plan, never the household plan, to factsOf and basisOf', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/answers/c/answer.js'), 'utf8');
    const body = src.slice(src.indexOf('function answerOnPlanPath'), src.indexOf('export function answerCReal'));
    expect(body).not.toMatch(/factsOf\(plan\b/);
    expect(body).not.toMatch(/basisOf\(plan\b/);
    expect(body).not.toMatch(/fullStatePensionAYear\b(?!\(\))/);
  });
  it('Pat: the State Pension and final-salary ages the words say are the kept plan\'s', () => {
    const c = answerC({ you: { age: 60, pot: 200000, finalSalary: { has: true, yearly: 9000, fromAge: 63 } }, savings: 20000 }, ENV);
    const said = [...c.assumed, ...c.warnings].map((x) => x.text).join(' ');
    expect(said).toContain('67');
    expect(c.basis.startAge).toBe(60);
    expect(c.basis.split).toEqual([{ who: 'you', share: 1 }]);
  }, 60000);
});

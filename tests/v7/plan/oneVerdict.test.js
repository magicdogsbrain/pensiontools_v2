/**
 * One verdict per plan, one figure per fact (7.12.0, round 3: lead decisions 3 and 5). Each expectation here is worked by
 * hand from the walkers' reports (s7120/walks2.md), not copied from the code's output.
 */
import { describe, it, expect } from 'vitest';
import { verdictOf } from '../../../src/answers/plan/lasts.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { oneAnswer, cutsSettingWords } from '../../../src/services/OneAnswer.js';

/** A stored Buckets-in-order result as a plan document keeps it: trimmed, with no count of cuts (fixture 04's shape). */
const storedBuckets = {
  affordable: true, strategyId: 'buckets-in-order', ruin: { mc: 1.7, hist: 0 }, n: { mc: 1000, hist: 705 },
  terminal: { p10: 200000, p50: 968682, p90: 2000000 }, worst12: { min: 24000, median: 30000 },
  signature: { protection: { enabled: true, cutPct: 20, limit: 3 } }
};
const P = { durationYears: 30, startAge: 63 };

describe('income cuts on a stored result that never counted them (walker 10 high 3, walker 4 medium)', () => {
  it('a Pots & Valves-family document with no count of cuts says they were not counted, never "none"', () => {
    const a = oneAnswer(storedBuckets, P);
    expect(a.cuts).toBe(null);
    const v = verdictOf({ a, strategyId: 'buckets-in-order', ran: { family: true, cutsOn: true, cutPct: 20, months: 3 }, history: null }, { endAge: 93 });
    const ids = v.rows.map((r) => r.id);
    expect(ids).not.toContain('cuts.bought');
    expect(ids).toContain('cuts.notCounted');
    const words = LASTS.rows['cuts.notCounted'];
    expect(words).toBeTypeOf('string');
    // by hand: the plan does cut (up to 20% after 3 months), so the line may not say "none"
    expect(words).not.toMatch(/\bnone\b/);
    expect(words).toMatch(/not counted/);
  });

  it('a bought way of drawing with no count of cuts still says it pays in full (that is true of it)', () => {
    const a = oneAnswer({ ...storedBuckets, strategyId: 'full-il-gilt' }, P);
    const v = verdictOf({ a, strategyId: 'full-il-gilt', ran: { family: false }, history: null }, { endAge: 93 });
    expect(v.rows.map((r) => r.id)).toContain('cuts.bought');
  });
});

describe('the cuts a stored result ran with (walker 6 high 6: "never cut" beside "the spending cuts you set")', () => {
  it('reads the run’s own record when the settings carried none (a plan document keeps no engine config)', () => {
    const off = cutsSettingWords(undefined, 'pots-and-valves', { signature: { protection: { enabled: false, cutPct: 20, limit: 3 } } });
    expect(off).toMatch(/switched off/i);
    expect(off).not.toMatch(/up to 20%/);
    const on = cutsSettingWords(undefined, 'buckets-in-order', { signature: { protection: { enabled: true, cutPct: 25, limit: 6 } } });
    // by hand: 25% after 6 months, from the run's record, never the 20% / 3 months default
    expect(on).toMatch(/up to 25% after 6 months/);
  });

  it('never tells someone the setting is "as you set it" (it may be the starting setting nobody chose)', () => {
    expect(cutsSettingWords({ disableProtection: true }, 'pots-and-valves')).not.toMatch(/as you set it/);
    expect(LASTS.rows['ran.cutsOff']).not.toMatch(/as you set it/);
  });
});

// ---- one chance for a plan still saving (walker 10 high 2, walker 1 high 2, walker 2 highs 1 and 2) ----------------------
import { verdictBlockView, chanceVerdictOf, chanceOptsOf } from '../../../src/ui/oneAnswerView.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';
import { startSummaryHtml } from '../../../src/ui/startingPotsWords.js';

const LIFE = lifeOfSettings({ currentAge: 60, currentAgeAsOf: '2026-05-01' }, new Date(2026, 10, 17, 12), { startAge: 60 });
const PS = { startAge: 60, durationYears: 35, spAnnual: 11973, spStartYear: 8, pot: 743920 };
/** A made-up run from the middling pot at the stop: 1 of 20 futures failed, at run years 20 on (more than 19 in 20, weighted). */
const run = (() => {
  const survivedMc = Array.from({ length: 20 }, (_, i) => i >= 1);
  return { strategyId: 'pots-and-valves', affordable: true, ruin: { mc: 5, hist: 0 }, n: { mc: 20, hist: 705 }, coverage: 99.7, worst12: { min: 25082, median: 28992 },
    terminal: { p10: 0, p50: 1047000, p90: 4158000 }, failAges: [], survivedMc, futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] } };
})();

describe('the full view leads a saving plan with the saving chance', () => {
  // by hand: the saver run (question B) gives 0.85 = 17 in 20; Balanced asks for 18 in 20 (fails 2 of 20), close is 17
  const o = { life: LIFE, level: 'balanced', savingChance: 0.85 };
  it('the title, the hero and the tone say Close, 17 times in 20 — never On course, more than 19', () => {
    const html = verdictBlockView(run, PS, o);
    expect(html).toContain('Will your money last? — Close at Balanced');
    expect(html).toContain('17 times in 20');
    expect(html).not.toContain('more than 19 times in 20');
    expect(html).toContain('verdict-warning');
    expect(chanceVerdictOf(run, PS, o)).toBe('close');
  });
  it('says everything under it starts from the middling pension when work stops (£743,920), and puts no second figure beside the chance', () => {
    const html = verdictBlockView(run, PS, o).replace(/<[^>]+>/g, ' ');
    expect(html).toContain('Everything below starts from £743,920 in your pension on the day work stops');
    expect(html).not.toContain('worst 12 months lived');
  });
  it('without a saving chance the block is the run\'s own, as before', () => {
    expect(verdictBlockView(run, PS, { life: LIFE, level: 'balanced' })).not.toContain('Everything below starts from');
  });
  it('another way of drawing on the same plan is judged for the same person at the same level (never the block before 7.8.0)', () => {
    const oneTest = { r: run, chance: { life: LIFE, level: 'balanced' } };
    const other = { ...run, strategyId: 'buckets-in-order' };
    expect(chanceOptsOf(other, {}, oneTest)).toEqual({ life: LIFE, level: 'balanced' });
    expect(verdictBlockView(other, PS, chanceOptsOf(other, {}, oneTest))).not.toMatch(/Likely to last|Very likely to last/);
  });
});

describe('the simple view\'s "Does it last?" labels what is not the saving chance', () => {
  it('a saving chance in the headline puts the from-the-stop line under it, with the pot', async () => {
    const { oneAnswer } = await import('../../../src/services/OneAnswer.js');
    const a = oneAnswer(run, PS, { life: LIFE, level: 'balanced' });
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: { family: true, cutsOn: true, cutPct: 20, months: 3 } }, { endAge: 95, atStop: 743920 }, { chance: 0.85 });
    expect(v.verdict).toBe('close');
    expect(v.slots.words).toContain('17 times in 20');
    expect(v.sub.id).toBe('lasts.subFromStop');
    expect(v.sub.slots.pot).toBe('£743,920');
    expect(LASTS.verdict['lasts.subFromStop']).toContain('{pot}');
  });
  it('the lead no longer claims to be what every screen of the full view shows', () => {
    expect(LASTS.lead).not.toMatch(/every screen of the full view/);
  });
});

describe('the kept answer\'s chance is not said beside a saving plan\'s own (walker 1 high 2: "(2%)" never refreshed)', () => {
  it('a plan still saving: no "made from a quick answer, where the money lasted …"; a plan already drawing keeps it', async () => {
    const { seedToScenario } = await import('../../../src/services/PlanSeed.js');
    const { seedA, seedCNow } = await import('../../integration/fixtures/planSeeds.js');
    const saving = seedToScenario(seedA(), new Date(2026, 9, 1, 15)).yours;
    expect(saving.stressTool.settings.retired).toBe(false);
    expect(startSummaryHtml(saving.stressTool.settings, { fromAnswer: saving.fromAnswer })).not.toMatch(/made from a quick answer/);
    const drawing = seedToScenario(seedCNow(), new Date(2026, 9, 1, 15)).yours;
    expect(startSummaryHtml({ ...drawing.stressTool.settings, spWeeklyAmount: 241.3, spStartDate: '2031-10-01' }, { fromAnswer: drawing.fromAnswer })).toMatch(/made from a quick answer/);
  });
});

// ---- the State Pension's year when only the yearly figure is known (walker 4 high 4: "from tax year 2041/42") ------------
import { planPage } from '../../../src/answers/plan/read.js';
import { corpus, entryOf } from './_plans.js';

describe('the State Pension with no date: from the age the runs use, never the stored default year', () => {
  it('62 in the plan\'s first tax year 2026/27, State Pension at 67: tax year 2031/32 (2026 + 5), never 2038/39 (2026 + the stored 12)', () => {
    const raw = JSON.parse(JSON.stringify(corpus()['02-pnv-draft']));
    delete raw.stressTool.settings.spWeeklyAmount; delete raw.stressTool.settings.spStartDate;
    expect(raw.stressTool.settings.statePensionYear).toBe(12);
    const entries = [entryOf(raw, '2026-11-17')];
    const pg = planPage(entries, raw.id, 'plan', { today: '2026-11-17' });
    const all = JSON.stringify(pg);
    const m = /"id":"pots\.statePensionOld","slots":(\{[^}]*\})/.exec(all);
    expect(m, 'the State Pension line').not.toBe(null);
    const slots = JSON.parse(m[1]);
    expect(slots.year).toBe('2031/32');
    expect(slots.age).toBe('67');
    // "Everything else this plan uses" lists the year the runs use, 67 − 62 = 5, never the stored 12
    const f = /"id":"inc\.state-pension-old","set":true,"facts":(\[[^\]]*\])/.exec(all);
    expect(f, 'the listing').not.toBe(null);
    expect(JSON.parse(f[1]).find((x) => x.k === 'fromYear').v).toBe(5);
  });
});

// ---- the pots when you stop on a locked saver (walker 10 high 5: £784,574 "priced on these" against £604,000 tested) ------
import { timingPotsAtStop } from '../../../src/services/PotsAtStop.js';
import { potsAtRetirementLine } from '../../../src/ui/startingPotsWords.js';

describe('a locked saver\'s Stress settings name the pots the plan was locked with', () => {
  it('fixture 05 was locked with £603,941 in the pension and £54,126 in ISAs when work stops: those, never a figure worked out today, are "priced on"', () => {
    const plan = entryOf(corpus()['05-saver-committed'], '2026-11-17').plan;
    const lockedWith = plan.planDocument.pots.potAtRetirement;   // what the lock stored: 603,941 and 54,126
    const t = timingPotsAtStop(plan, plan.stressTool.settings, new Date(2026, 10, 17, 12));
    expect(t.source).toBe('locked');
    expect(t.sipp).toBe(603941);
    expect(t.isa).toBe(54126);
    const words = potsAtRetirementLine(t).replace(/<[^>]+>/g, '');
    expect(words).toContain('locked with £603,941 in your pension and £54,126 in ISAs');
    // today's middling case is said as that, a second figure labelled, never "priced on"
    if (t.today) expect(words).toMatch(/Today’s middling case/);
    expect(words).not.toMatch(/Every strategy is priced on these; type your own/);
    expect(lockedWith.sipp).toBe(603941);
  });
});

// ---- the year before tax with a quarter of each payment tax-free (walker 6 high 4, walker 9 high 6, walker 1 low) ---------
import { takenOfTarget } from '../../../src/services/BeforeTax.js';
import { derivedLines, savedSpend } from '../../../src/answers/plan/spend.js';
import { tryDifferencesOf } from '../../../src/answers/plan/lasts.js';

/**
 * By hand, at the 2026/27 bands (£12,570 allowance, 20% to £50,270), with a quarter of each payment tax-free a year taken t
 * leaves 0.25t + 12,570 + 0.8 × (0.75t − 12,570) = 0.85t + 2,514 after tax.
 *   £2,400 a month (£28,800): t = (28,800 − 2,514) ÷ 0.85 = £30,925 (all of it taxed: 12,570 + 16,230 ÷ 0.8 = £32,858)
 *   £2,700 a month (£32,400): t = 29,886 ÷ 0.85 = £35,160 (all taxed: £37,358)
 *   £2,000 a month (£24,000): t = 21,486 ÷ 0.85 = £25,278 (all taxed: £26,858)
 */
describe('one figure for "a year before tax": what is taken, a quarter tax-free counted', () => {
  const UFPLS = { accessMethod: 'ufpls' };
  it('the rule, both ways round the walkers worked it', () => {
    expect(takenOfTarget(32858, UFPLS)).toBe(30925);
    expect(takenOfTarget(37358, UFPLS)).toBe(35160);
    expect(takenOfTarget(26858, UFPLS)).toBe(25278);
    expect(takenOfTarget(32858, { accessMethod: 'drawdown' })).toBe(32858);   // every pound taxed: the figure as held
  });

  it('"Your plan as locked": from 63, a step held as £30,000 is £28,235 taken (0.85t + 2,514 = 26,514)', () => {
    const raw = JSON.parse(JSON.stringify(corpus()['04-buckets-running']));
    raw.stressTool.settings.accessMethod = 'ufpls';
    const pg = planPage([entryOf(raw, '2026-11-17')], raw.id, 'plan', { today: '2026-11-17' });
    const all = JSON.stringify(pg);
    expect(/"saysGross0":(\d+)/.exec(all)[1]).toBe('28235');
  });

  it('"What you spend": from 62, a step held as £38,000 says £35,765 a year before tax (0.85t + 2,514 = 32,914)', () => {
    const raw = JSON.parse(JSON.stringify(corpus()['02-pnv-draft']));
    raw.stressTool.settings.accessMethod = 'ufpls';
    const plan = entryOf(raw, '2026-11-17').plan;
    const saved = savedSpend(plan, { today: '2026-11-17' });
    const lines = derivedLines(saved.plainSteps, saved.schedule, saved.costs, saved);
    const first = lines.find((l) => l.id.startsWith('first.'));
    expect(first.slots.yearly).toBe('£35,765');
  });

  it('a try at £2,700 a month after tax says £35,160 a year before tax, never £37,358', () => {
    const d = tryDifferencesOf({ ...UFPLS, strategyId: 'pots-and-valves', incomeShape: 'level', baseSalary: 32858, duration: 35 }, { ...UFPLS, strategyId: 'pots-and-valves', incomeShape: 'level', baseSalary: 37358, duration: 35 });
    expect(d.find((x) => x.id === 'income').slots.income).toBe(35160);
  });
});

// ---- a locked plan's own figure is a record, never a second verdict (walker 6 high 3: "Not yet" above "Close") -------------
describe('"Does it last?" on a locked plan: the figure it was locked with is said as a record, with no verdict word of its own', () => {
  const stored = { ...storedBuckets, strategyId: 'pots-and-valves', ruin: { mc: 30, hist: 5 } };   // 7 futures in 10 to a fixed age
  it('locked with a weighted figure (0.85, 17 in 20): "When it was locked … 17 times in 20", a record', () => {
    const a = oneAnswer(stored, P);
    const success = { level: 'balanced', lines: { yes: 0.9, close: 0.85 }, planTo: { age: 99 }, weighted: { chance: 0.85, fixedAge: 0.7 } };
    const v = verdictOf({ a, strategyId: 'pots-and-valves', ran: { family: true, cutsOn: false }, history: null, document: true, success }, { endAge: 99 });
    expect(v.record).toBe(true);
    expect(v.id).toBe('lasts.headlineDocW');
    expect(v.slots.words).toContain('17 times in 20');
    expect(LASTS.verdict['lasts.headlineDocW']).toMatch(/When it was locked/);
  });
  it('locked before the weighted figure (a count to 99): said with its age, as a record — never "Not yet" beside today\'s "Close"', () => {
    const a = oneAnswer(stored, P);
    const v = verdictOf({ a, strategyId: 'pots-and-valves', ran: { family: true, cutsOn: false }, history: null, document: true }, { endAge: 99 });
    expect(v.record).toBe(true);
    expect(v.id).toBe('lasts.headlineDoc');
    expect(v.slots.toAge).toBe('99');
    expect(LASTS.verdict['lasts.headlineDoc']).toMatch(/not by how long you might live/);
  });
});

// ---- "Your plan" on a plan still saving: the pension today, and no year-old note (walker 2 high 5) -------------------------
describe('"Your plan" for a plan still saving says the pension today the home says, and no kept answer is called stale', () => {
  /** Fixture 05 unlocked, as a person still saving would have it: the newest pot record is September 2026, £319,800. */
  const open = () => {
    const raw = JSON.parse(JSON.stringify(corpus()['05-saver-committed']));
    delete raw.planDocument;
    raw.decisionTool.settings = { ...raw.decisionTool.settings, locked: false };
    delete raw.decisionTool.settings.lockedAt; delete raw.decisionTool.settings.lockedBy;
    raw.journey = [raw.journey[0]];
    return raw;
  };
  it('Pots: "Pension pot: £319,800" (the September record), never the £310,000 the settings were saved with', () => {
    const raw = open();
    const pg = planPage([entryOf(raw, '2026-11-17')], raw.id, 'plan', { today: '2026-11-17' });
    const all = JSON.stringify(pg);
    expect(/"sipp":(\d+)/.exec(all)[1]).toBe('319800');
  });
  it('no "Your ‘will it last’ answer was worked out on …" on a saving plan: its chance is worked out now on every page', async () => {
    const { seedToScenario } = await import('../../../src/services/PlanSeed.js');
    const { seedA } = await import('../../integration/fixtures/planSeeds.js');
    const plan = seedToScenario(seedA(), new Date(2026, 9, 1, 15)).yours;
    plan.id = 'SaverKept01';
    plan.stressTool.settings.retireAge = (plan.stressTool.settings.retireAge || 60) + 2;   // the stop moved since it was kept
    const pg = planPage([entryOf(plan, '2026-11-17')], plan.id, 'plan', { today: '2026-11-17' });
    expect(JSON.stringify(pg)).not.toMatch(/"answerStale":\{/);
  });
});

// ---- what you hold never changes a saving plan's answer unless accepted (walker 2 high 3; lead decision 4) ---------------
import { savingPathMixes } from '../../../src/services/SavingPath.js';
import { derivedLevelFrom } from '../../../src/services/Phases.js';

describe('the saving mix is the plan\'s own unless what is held was accepted as the plan', () => {
  // the plan's own allocation: £60,000 shares, £30,000 bonds, £10,000 cash = 60% / 30% / 10%
  const settings = { equityMin: 60000, bondMin: 30000, cashTarget: 10000 };
  // what is held: all of it in shares (a "default fund" marked Shares)
  const prop = { total: 131000, buckets: { shares: 131000, bonds: 0, diversifiers: 0, cash: 0 } };
  it('not accepted: 60% shares, the plan\'s own; marking a holding as shares changes nothing', () => {
    const m = savingPathMixes(settings, prop, null, null);
    expect(m.fromHoldings).toBe(false);
    expect(Math.round(m.saving.equity * 100)).toBe(60);
  });
  it('accepted ("This is how I want to hold it"): what is held, 100% shares, and it says so', () => {
    const m = savingPathMixes(settings, prop, null, { moving: { agreed: { at: '2026-11-17T12:00:00.000Z' } } });
    expect(m.fromHoldings).toBe(true);
    expect(Math.round(m.saving.equity * 100)).toBe(100);
  });
  it('the review\'s "while you save" level is read from the plan, not from what is held, until accepted', () => {
    const plan = { holdings: { version: 1, lines: [{ wrapper: 'SIPP', ticker: 'VWRP', name: 'All-world shares', value: 131000 }] }, stressTool: { settings } };
    expect(derivedLevelFrom(plan, { settings }).from).not.toBe('held');
  });
});

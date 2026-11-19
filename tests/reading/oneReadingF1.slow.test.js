/**
 * Step F1 (lead4.md D3, D4, D5, R7): for every parity fixture, each of these facts has ONE value whoever asks — the reading's
 * own function (src/reading/money.js, atStop.js, timing.js) formatted by the one formatter (src/reading/format.js), and
 * every builder either view draws the fact from:
 *
 *   pot.today    the simple plan page, "Your pots and tax", "What you pay in"; the full view's Timing line
 *   isa.today    the simple plan page and "Your pots and tax"
 *   pot.atStop   (with its bad and good cases) the simple plan page, "Your pots and tax", "What you pay in"; the full view's
 *                Timing line and its Accumulation table
 *   age.today    the simple plan page; the saver's facts both views read
 *   yearsToGo    "What you pay in"; the full view's chip and its Timing summary
 *   stage        the plan's home words; the full view's chip (the same reader)
 *   plan.name    PlanName.shownPlanName
 * Fictional people only (the parity fixtures: Alex, Sam, Jo, Pat, Kim).
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { pensionToday, isaToday, settingsOf, pensionBoxOf } from '../../src/reading/money.js';
import { potAtStop } from '../../src/reading/atStop.js';
import { ageToday, yearsToGo, stage, planName, stopMonth, planEndAge } from '../../src/reading/timing.js';
import { formatFact, money, moneyK } from '../../src/reading/format.js';
import { LABELS } from '../../src/reading/labels.js';
import { FACT_PATTERNS } from '../../src/reading/facts.js';
import { planPage } from '../../src/answers/plan/read.js';
import { potsOf, boxesOf as potsBoxesOf } from '../../src/answers/plan/pots.js';
import { savingOf } from '../../src/answers/plan/saving.js';
import { potsAtRetirementLine } from '../../src/ui/startingPotsWords.js';
import { accumulationBandHtml } from '../../src/ui/accumulationProjection.js';
import { deriveStage, stageOf } from '../../src/services/LifeStage.js';
import { describeTiming, deriveTiming } from '../../src/services/PlanTiming.js';
import { shownPlanName } from '../../src/services/PlanName.js';
import { saverFacts } from '../../src/services/SaverFacts.js';
import { HOME } from '../../src/v7/copy/home.js';
import { unmarked } from '../../src/reading/mark.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const isLockedPlan = (p) => !!(p && p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);

/** Every line of a plan page by id (its sentence's text). */
function linesOf(view) {
  const out = {};
  const walk = (o, d) => {
    if (!o || typeof o !== 'object' || d > 8) return;
    if (typeof o.id === 'string' && o.sentence && typeof o.sentence.text === 'string') (out[o.id] = out[o.id] || []).push(o.sentence.text);
    for (const k of Object.keys(o)) walk(o[k], d + 1);
  };
  walk(view, 0);
  return out;
}
/** The figures marked with `fact` in an HTML string. */
const marked = (html, fact) => [...String(html).matchAll(new RegExp('data-fact="' + fact.replace(/\./g, '\\.') + '">([^<]*)<', 'g'))].map((m) => m[1]);

describe('one label per fact (lead4.md R7)', () => {
  it('every fact of the register has one short label and a basis', () => {
    for (const p of FACT_PATTERNS) {
      expect(LABELS[p], p).toBeTruthy();
      expect(LABELS[p].label.length, p).toBeGreaterThan(1);
      expect(LABELS[p].label).not.toMatch(/should|recommend/i);
    }
  });
});

describe('one formatter (src/reading/format.js): one rounding rule per fact', () => {
  it('money whole pounds, pots at the stop to £1,000, months to go in one wording', () => {
    expect(formatFact('pot.today', 296087.6)).toBe('£296,088');
    expect(formatFact('pot.atStop', 296087)).toBe('£296,000');
    expect(formatFact('yearsToGo', 19)).toBe('1 year 7 months');
    expect(formatFact('yearsToGo', 131)).toBe('10 years');
    expect(formatFact('yearsToGo', 7)).toBe('7 months');
    expect(formatFact('stop.month', '2028-06')).toBe('June 2028');
    expect(formatFact('age.today', 45.9)).toBe('45');
    expect(() => formatFact('lasts.chance', 0.9)).toThrow();
  });
});

describe('each F1 fact has one value whoever asks, for every parity fixture', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', (key, f) => {
    const plans = f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario);
    const plan = plans.find((p) => p.id === f.subject);
    const entries = plans.map((p) => ({ plan: p }));
    const ctx = { now: NOW };
    const ss = settingsOf(plan, ctx);
    const R = {
      pot: formatFact('pot.today', pensionToday(plan, ctx).value),
      isa: formatFact('isa.today', isaToday(plan, ctx).value),
      atStop: potAtStop(plan, ctx),
      age: ageToday(plan, ctx),
      togo: yearsToGo(plan, ctx),
      stage: stage(plan, ctx),
      name: planName(plan, ctx)
    };

    // the simple plan page
    const L = linesOf(planPage(entries, f.subject, 'plan', { today: PARITY_DAY }));
    expect(L['pots.pension'], 'plan page pension').toEqual([R.pot]);
    expect(L['pots.isa'], 'plan page ISA').toEqual([R.isa]);
    if (L['about.age']) expect(L['about.age']).toEqual([String(R.age)]);
    if (R.atStop && (R.atStop.middle > 0 || R.atStop.isa > 0)) expect(L['pots.atStop'][0], 'plan page pot at the stop').toMatch(new RegExp('^' + moneyK(R.atStop.middle) + ' pension'));
    else expect(L['pots.atStop']).toBeUndefined();

    // "Your pots and tax"
    const P = potsOf(entries, f.subject, { today: PARITY_DAY });
    const today = P.derived.find((d) => d.id === 'pots.today' || d.id === 'pots.todayTaxable');
    if (today) { expect(today.slots.pension, 'pots page pension').toBe(R.pot); expect(today.slots.isa, 'pots page ISA').toBe(R.isa); }
    // the pension box (field pots.pension) says what the line beside it says: a saver's plan not locked shows the pension
    // today (a newer record or What you hold included), nothing known shows an empty box — never a default pot
    const box = pensionBoxOf(plan, ctx);
    const boxes = potsBoxesOf(plan, { today: PARITY_DAY });
    if (box) expect(boxes.pension, 'pots page pension box').toBe(box.value == null ? '' : String(box.value));
    if (box && box.today) expect(formatFact('pot.today', box.value)).toBe(R.pot);
    if (ss.potsNotSet && !isLockedPlan(plan)) expect(boxes.pension, 'no pension known: the box empty').toBe('');
    const proj = P.derived.find((d) => d.id === 'stop.projection' || d.id === 'stop.locked');
    if (proj) expect(proj.slots.sipp).toBe(moneyK(R.atStop.middle));
    const band = P.derived.find((d) => d.id === 'stop.band');
    if (band) expect([band.slots.low, band.slots.sipp, band.slots.high]).toEqual([moneyK(R.atStop.low), moneyK(R.atStop.middle), moneyK(R.atStop.high)]);

    // "What you pay in"
    const S = savingOf(entries, f.subject, { today: PARITY_DAY });
    if (S.found && S.ages.stillSaving) {
      if (S.potNow.line.id !== 'none') expect(S.potNow.value, 'saving page pension today').toBe(R.pot);
      if (R.atStop) expect(S.atStop.value, 'saving page pot at the stop').toBe(moneyK(R.atStop.middle));
      if (R.togo != null && S.ages.line) expect(S.ages.line.slots.span).toBe(formatFact('yearsToGo', R.togo));
    }

    // the saver's facts both views read (age today)
    const facts = saverFacts(plan, ss, { now: NOW });
    if (facts.age != null) expect(facts.age).toBe(R.age);

    // the full view: the Timing line and the Accumulation table draw the reading's pot at the stop, and its pension today
    if (R.atStop) {
      const line = potsAtRetirementLine(R.atStop);
      expect(marked(line, 'pot.atStop')).toEqual([moneyK(R.atStop.middle)]);
      if (R.atStop.source === 'worked') {
        expect(marked(line, 'pot.today')).toEqual([money(R.atStop.from.pot)]);
        expect(money(R.atStop.from.pot)).toBe(R.pot);
        const table = accumulationBandHtml(R.atStop, { stress: ss });
        expect(marked(table, 'pot.atStop')).toEqual([moneyK(R.atStop.middle)]);
        expect(marked(table, 'pot.atStop.low')).toEqual([moneyK(R.atStop.low)]);
        expect(unmarked(table)).not.toMatch(/\((?:2|5|8)%\)/);   // the regulator's fixed rates are gone
      }
    }

    // the time to go: the chip and the Timing summary say the one formatter's words
    if (R.togo != null) {
      const placing = deriveStage({ ...plan, stressTool: { ...(plan.stressTool || {}), settings: ss } }, NOW);
      if (/to go/.test(placing.chip || '')) expect(placing.chip).toBe(formatFact('yearsToGo', R.togo) + ' to go');
      const t = deriveTiming(ss, NOW);
      expect(describeTiming(t, ss, NOW)).toContain(formatFact('yearsToGo', R.togo) + ' away');
    }
    expect(stopMonth(plan, ctx) == null || /^\d{4}-\d{2}$/.test(stopMonth(plan, ctx))).toBe(true);
    if (planEndAge(plan, ctx) != null && L['about.runs'] && /to age/.test(L['about.runs'][0])) expect(L['about.runs'][0]).toContain('to age ' + planEndAge(plan, ctx));

    // the stage: three words, the home's
    const st = stageOf(plan, NOW, { settings: ss });
    expect(R.stage).toBe(st.key ? HOME.stages[st.key] : null);
    if (R.stage) expect(['Saving', 'Moving', 'Living on it', 'Closed']).toContain(R.stage);

    // the name
    expect(R.name).toBe(shownPlanName(plan, { now: NOW }));
  }, 300_000);
});

// The boxes of F1's facts (step F1, pass 3): the plan's end age and the ISA, as each view fills its box, for every fixture.
import { boxesOf as aboutBoxesOf } from '../../src/answers/plan/about.js';
import { paintEndAge } from '../../src/ui/endAgeBox.js';
import { isaBoxOf } from '../../src/reading/money.js';

/** A stand-in for the full view's Settings form: just the boxes paintEndAge reads and writes. */
function fullForm(duration, startAge) {
  const els = { ssDuration: { value: String(duration) }, ssEndAge: { value: '' }, shapeAgeNow: { value: String(startAge ?? '') }, ssDurationAgeHint: { textContent: '' } };
  return { getElementById: (id) => els[id] || null, activeElement: null, els };
}

describe('the end age and the ISA boxes hold one value in both views, for every parity fixture', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', (key, f) => {
    const plan = f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario).find((p) => p.id === f.subject);
    if (plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked) return;   // a locked plan's boxes are the lock's
    const ctx = { now: NOW };
    const ss = settingsOf(plan, ctx);
    const simple = aboutBoxesOf(plan, { today: PARITY_DAY });
    // the full view fills the length from the plan's settings, then paints the end age on the plan's start age
    const t = deriveTiming(ss, NOW);
    const doc = fullForm(ss.duration, t && t.shapeAgeNow);
    paintEndAge(doc, t);
    expect(doc.els.ssEndAge.value, 'end age: full box = simple box').toBe(String(simple.endAge ?? ''));
    const end = planEndAge(plan, ctx);
    if (end != null) expect(doc.els.ssEndAge.value, 'end age: the reading').toBe(String(end));
    // the ISA box: the simple view's (pots page) and the full view's fill (isaBoxOf when it says the ISA today, else the plan's)
    const ib = isaBoxOf(plan, ctx);
    const fullIsa = ib && ib.today ? ib.value : Math.round(+ss.isaBalance || 0);
    expect(String(potsBoxesOf(plan, { today: PARITY_DAY }).isa), 'ISA: simple box = full box').toBe(String(fullIsa));
  }, 120_000);
});

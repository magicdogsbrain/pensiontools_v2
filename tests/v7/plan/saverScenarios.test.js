/**
 * A saver's plan read by real people's questions (7.12.0). Fictional people only, made here from fictional answers:
 *   - Sam, 44 when the plan was kept on 12 November 2025: £120,000 in a pension, £375 a month going in with the tax added
 *     back and £250 from the employer, stopping at 67;
 *   - Alex, a plan made in the full view: a pension total of £410,000 in the plan's own pots, nothing on the saving page;
 *   - Jo, 33: no pension yet, £300 a month going in.
 * Every figure expected is worked out by hand in the test.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { savingOf, savingPatch, applyPatch } from '../../../src/answers/plan/saving.js';
import { accumulationBoxes } from '../../../src/ui/accumulationProjection.js';
import { takeHomeOf, payInSaid } from '../../../src/services/SaverPayIn.js';
import { contributionBreakdown } from '../../../src/services/AccumulationEngine.js';
import { payInNowOf } from '../../../src/answers/plan/saving.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { potsAtStopBuilds } from '../../../src/services/PotsAtStop.js';
import { boxesOf as aboutBoxes, aboutPatch } from '../../../src/answers/plan/about.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { checkInPatch, checkInOf } from '../../../src/answers/plan/checkIn.js';
import { CHECKIN as CW } from '../../../src/v7/copy/checkin.js';
import { checkInDraft } from '../../../src/answers/plan/checkIn.js';
import { saverVerdictOf } from '../../../src/answers/plan/saving.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { wanted } from '../../../src/v7/effects/saver.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { stateWith, corpus, entryOf as entryOfAt } from './_plans.js';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { shownPlanName } from '../../../src/services/PlanName.js';
import { fresh, run, set, answered } from '../shell/_open.js';
import { parsedDraft } from '../../../src/v7/state/select.js';
import { answerC } from '../c/_c.js';
import { boxesOf as spendBoxes, spendPatch } from '../../../src/answers/plan/spend.js';
import { WINDOW_SUFFIX } from '../../../src/v7/effects/planWrite.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { noon } from './_plans.js';

const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const READ_ON = '2026-11-16';

/** A B answer kept as a plan on `on`, brought up to date as the plan source reads it on `readOn`. */
function keptPlan(inputs, { on, readOn = on, id = 'Plan01', name = 'A plan' }) {
  const result = answerB(inputs, { today: on, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: on, appVersion: 'test' }, name, createdAt: on + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, on).yours;
  made.id = id;
  return upgradeScenario(copy(made), { now: noon(readOn) }).scenario;
}

const samInputs = () => ({ household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } },
  stop: { age: 67 }, spend: { kind: 'amount', amount: 2200 }, endAge: 95 });
const SAM_RECORD = { date: '2026-11', sipp: 131000, isa: null, gia: 0, total: 131000, recordedAt: '2026-11-10T12:00:00.000Z' };
function samPlan() {
  const plan = keptPlan(samInputs(), { on: '2025-11-12', readOn: READ_ON, id: 'Sam01', name: 'Sam saving' });
  plan.accumulationTool.history = [copy(SAM_RECORD)];
  return plan;
}
const entry = (plan) => ({ plan, newer: false, failed: false });

describe('step 1: one reader of a saver\'s facts', () => {
  it('Sam, a year after keeping: the ages roll forward and the pot is the one recorded, on every line of the page', () => {
    const plan = samPlan();
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    // kept at 44 a year ago: 44 + 1 = 45 today; stopping at 67: 67 − 45 = 22 years
    expect(v.ages.currentAge).toBe(45);
    expect(v.ages.retirementAge).toBe(67);
    const ages = fill(W.ages[v.ages.line.id], v.ages.line.slots);
    expect(ages).toMatch(/^You stop work in \w+ \d{4}, at 67: 22 years of saving from age 45\. /);
    expect(fill(W.pot.potNow[v.potNow.line.id], v.potNow.line.slots)).toBe('From your pension of £131,000, recorded November 2026.');
    expect(v.rows[0].age).toBe(45);
    expect(v.rows[0].raw.mid).toBe(131000);
    // the box opens on the same figure
    expect(v.fields.find((f) => f.path === 'potNow').shown).toBe('131000');
    // and the verdict tests the same pot
    expect(saverInputsOf(plan, { today: READ_ON }).inputs.you.pot).toBe(131000);
  }, 30000);

  it('Alex, made in the full view with £410,000 in the plan\'s pots and nothing on the saving page: the pension is £410,000, the plan\'s own total', () => {
    const plan = samPlan();
    delete plan.accumulationTool;
    delete plan.fromAnswer;
    Object.assign(plan.stressTool.settings, { equityMin: 205000, bondMin: 164000, cashTarget: 41000, diversifierStart: 0, configured: true });
    const read = saverInputsOf(plan, { today: READ_ON });
    expect(read.ok).toBe(true);
    // 205,000 + 164,000 + 41,000 = 410,000
    expect(read.inputs.you.pot).toBe(410000);
    expect(read.notes.potFrom).toBe('plan');
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(fill(W.pot.potNow[v.potNow.line.id], v.potNow.line.slots)).toBe('From your pension of £410,000, the pension total in your plan.');
  }, 30000);

  it('Jo, kept with no pension yet and £300 a month going in: the pension today is £0, never the pot at the stop the plan\'s pots hold', () => {
    const jo = { household: 'single', you: { pot: 0, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 300 } },
      stop: { age: 60 }, spend: { kind: 'amount', amount: 1500 }, endAge: 95 };
    const plan = keptPlan(jo, { on: '2025-11-12', readOn: READ_ON, id: 'Jo01' });
    // the plan's pots hold the pot at the stop (more than £0), the answer said £0 today
    expect(plan.stressTool.settings.equityMin + plan.stressTool.settings.bondMin + plan.stressTool.settings.cashTarget).toBeGreaterThan(0);
    expect(saverInputsOf(plan, { today: READ_ON }).inputs.you.pot).toBe(0);
    const old = copy(plan); delete old.accumulationTool;
    expect(saverInputsOf(old, { today: READ_ON }).inputs.you.pot).toBe(0);
  }, 30000);

  it('a new pot today typed on What you pay in is written with this month\'s record in the same write, and read back', () => {
    const plan = samPlan();
    const p = savingPatch(plan, { potNow: '140000' }, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual(['accumulationTool.history', 'accumulationTool.settings']);
    expect(p.patch['accumulationTool.settings'].potNow).toBe(140000);
    const rec = p.patch['accumulationTool.history'].find((r) => r.date === '2026-11');
    expect(rec.sipp).toBe(140000);
    expect(p.patch['accumulationTool.history']).toHaveLength(1);
    const after = applyPatch(plan, p.patch);
    expect(saverInputsOf(after, { today: READ_ON }).inputs.you.pot).toBe(140000);
    // the box left as it opened writes nothing
    expect(savingPatch(plan, {}, { today: READ_ON }).patch).toEqual({});
  }, 30000);

  it('the full view\'s Accumulation tab opens on the same age and pot', () => {
    const plan = samPlan();
    const box = accumulationBoxes(plan, null, noon(READ_ON));
    expect(box.values.acAge).toBe(45);
    expect(box.values.acRetireAge).toBe(67);
    expect(box.values.acPotNow).toBe(131000);
    expect(box.potLine).toBe('From your pension of £131,000, recorded November 2026.');
  }, 30000);
});

describe('step 2: one way to say a pay-in', () => {
  const B_ENV = { today: READ_ON, futures: 1000, seed: 0, detail: 'answer' };
  const textOf = (result) => Object.values(result.sentences || {}).filter((x) => x && typeof x.text === 'string').map((x) => x.text).join(' ');
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');

  it('what leaves take-home pay is the exact inverse of what lands, for the three schemes, at £38,000 and £55,000', () => {
    for (const salary of [38000, 55000]) {
      for (const scheme of ['ras', 'netpay', 'salsac']) {
        const landed = contributionBreakdown({ netMonthly: 300, salary, schemeType: scheme, employerMonthly: 0 }).grossMonthly;
        expect(Math.round(takeHomeOf(landed, { scheme, salary }) * 100) / 100).toBe(300);
      }
    }
    // relief at source: £375 landing is £300 from take-home pay (375 × 0.8); a guest's answer has no scheme, so "about"
    expect(payInSaid({ ownLanded: 375, employer: 250 })).toMatchObject({ takeHome: 300, total: 625, about: true });
    expect(payInSaid({ ownLanded: 375, employer: 250, scheme: 'ras' }).about).toBe(false);
  });

  it('Jo (33, £38,000, 5% and 3%, wants £2,000 from 60): what would be enough says her own share and what leaves her take-home pay', () => {
    const jo = { household: 'single', you: { pot: 0, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
      stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 };
    const r = answerB(jo, B_ENV);
    const fig = r.enough.atLevel;
    expect(fig).not.toBe(null);
    const text = textOf(r);
    // the pounds worked from the share the engine returns: own share × pay ÷ 12 lands; × 0.8 leaves take-home pay
    const ownLanded = 38000 * fig.ownPct / 100 / 12;
    const all = 38000 * fig.totalPct / 100 / 12;
    expect(text).toContain(`${fig.totalPct}% of your pay in all`);
    expect(text).toMatch(new RegExp(`you ${fig.ownPct}% \\(about ${gbp(ownLanded * 0.8).replace(/[£,]/g, (c) => '\\' + c)} a month from your take-home pay\\)`, 'i'));
    expect(text).toContain(`${gbp(all)} a month in all`);
    expect(text).not.toMatch(/\byou £[\d,]+[,)]/i);
  }, 60000);

  it('Sam (£375 and £250 a month): what would be enough says what comes from Sam with the tax added back and from take-home pay', () => {
    const sam = { ...samInputs(), spend: { kind: 'amount', amount: 3200 } };
    const r = answerB(sam, B_ENV);
    const fig = r.enough.atLevel;
    expect(r.verdict.band).not.toBe('yes');
    // what comes from Sam is the whole less the employer's £250 as now; × 0.8 leaves take-home pay
    const own = fig.payIn - 250;
    expect(fig.own).toBeCloseTo(own, 2);
    const text = textOf(r);
    expect(text).toContain(`${gbp(own)} from you with the tax added back (about ${gbp(own * 0.8)} from your take-home pay)`);
    expect(text).not.toMatch(/\byou £[\d,]+[,)]/i);
  }, 60000);

  it('the plan says what goes in now the same way, and never "you £…"', () => {
    const fill2 = (id, slots) => fill(W.payInNow[id], slots);
    // £300 from take-home pay lands as £375 (300 ÷ 0.8); with the employer's £250: £625
    const n = payInNowOf({ netMonthly: 300, employerMonthly: 250, schemeType: 'ras', salary: 0 });
    expect(fill2(n.id, n.slots)).toBe('You pay in £300 a month from your take-home pay. With the tax added back that is £375 in your pension. Your employer adds £250: £625 a month in all.');
    // 5% and 3% of £38,000: own lands 158.33, × 0.8 = 126.67 → £127; in all 253.33 → £253
    const sh = payInNowOf({ salary: 38000, schemeType: 'ras', netMonthly: 126.66, employerMonthly: 95, payInKind: 'share', ownPct: 5, employerPct: 3 });
    expect(fill2(sh.id, sh.slots)).toBe('You pay in 5% of your pay and your employer 3%: £127 a month from your take-home pay, £253 a month into your pension in all.');
    const before = payInNowOf({ netMonthly: 300, employerMonthly: 0, schemeType: 'netpay', salary: 38000 });
    // pay before tax at 20%: 300 ÷ 0.8 = 375 goes in
    expect(fill2(before.id, before.slots)).toBe('£375 a month goes into your pension from your pay before tax; your take-home pay is about £300 less.');
    for (const v of Object.values(W.payInNow)) expect(v).not.toMatch(/\byou \{/i);
    const plan = samPlan();
    const toast = savingOf([entry(plan)], plan.id, { today: READ_ON, typed: {} }).savedLine;
    expect(fill(W.toast[toast.id], toast.slots)).not.toMatch(/\byou £[\d,]+[,)]/i);
  }, 30000);

  it('the claim back from HMRC is on the pay above the higher-rate line only', () => {
    // £300 from take-home pay lands £375. At £52,000: 52,000 − 50,270 = 1,730 a year above the line, × 20% = £346
    expect(Math.round(contributionBreakdown({ netMonthly: 300, salary: 52000, schemeType: 'ras' }).hrClaimMonthly * 12)).toBe(346);
    // at £55,000: 4,730 a year above the line, more than the 375 × 12 = 4,500 paid in; 4,500 × 20% = £900
    expect(Math.round(contributionBreakdown({ netMonthly: 300, salary: 55000, schemeType: 'ras' }).hrClaimMonthly * 12)).toBe(900);
  });
});

describe('step 3: the pots when you stop are worked out, never frozen', () => {
  const NOW = noon(READ_ON);
  const flat = { futureReturns: (i, years) => ({ equity: Object.fromEntries(Array.from({ length: years }, (_, y) => [y, 0])), inflation: Object.fromEntries(Array.from({ length: years }, (_, y) => [y, 0])) }) };
  /** Every line of "Your plan" with its id, as drawn. */
  const linesOf = (page) => { const out = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (x.sentence && x.id) out.push(x); Object.values(x).forEach(walk); } }; walk(page); return out; };
  const atStopText = (plan) => { const l = linesOf(planPage([entry(plan)], plan.id, 'plan', { today: READ_ON })).find((x) => x.id === 'pots.atStop'); return l ? l.sentence.text : null; };
  const keepAt = (inputs, id) => keptPlan(inputs, { on: '2025-11-12', readOn: READ_ON, id });
  const moveStop = (plan, age) => { const p = aboutPatch(plan, { ...aboutBoxes(plan, { today: READ_ON }), stopAge: String(age) }, { today: READ_ON }); expect(p.ok).toBe(true); return applyPatch(plan, p.patch); };

  it('Sam on flat futures (no growth, no price rises, no charge, all in shares): £131,000 and £625 a month for 22 years', () => {
    const plan = samPlan();
    Object.assign(plan.stressTool.settings, { chargesPct: 0, equityMin: 120000, bondMin: 0, cashTarget: 0, diversifierStart: 0 });
    if (plan.accumulationTool.settings.savingMix) delete plan.accumulationTool.settings.savingMix;
    // 131,000 + 625 × 12 × 22 = 296,000
    expect(effectiveStressSettings(plan, { now: NOW, env: flat }).potAtRetirement.sipp).toBe(131000 + 625 * 12 * 22);
  }, 30000);

  const fixtures = {
    Sam: { household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2200 }, endAge: 95 },
    Jo: { household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 },
    Pat: { household: 'single', you: { pot: 45000, age: 52, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 31000, ownPct: 4, employerPct: 3 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 1800 }, endAge: 95 }
  };
  for (const [who, inputs] of Object.entries(fixtures)) {
    it(`${who}: the stop moved two years later and a pot recorded — "Your plan", the runs and the answer for the same plan say one pot at the stop`, () => {
      const kept = keepAt(inputs, who + '01');
      const before = effectiveStressSettings(kept, { now: NOW }).potAtRetirement.sipp;
      let plan = moveStop(kept, inputs.stop.age + 2);
      plan.accumulationTool.history = [{ date: '2026-11', sipp: Math.round(inputs.you.pot * 1.09), isa: null, gia: 0, total: Math.round(inputs.you.pot * 1.09), recordedAt: '2026-11-10T12:00:00.000Z' }];
      const after = effectiveStressSettings(plan, { now: NOW }).potAtRetirement;
      expect(after.source).toBe('worked');
      expect(after.sipp).toBeGreaterThan(before);
      const read = saverInputsOf(plan, { today: READ_ON });
      const answer = answerB(read.inputs, { today: READ_ON, futures: 1000, seed: 0, detail: 'answer', ...read.env });
      const k = (v) => Math.round(v / 1000) * 1000;
      expect(k(after.sipp)).toBe(k(answer.saving[0].potAtStop.pension.middling));
      const text = atStopText(plan);
      expect(text).toContain('£' + k(after.sipp).toLocaleString('en-GB') + ' pension');
      expect(text).toContain('in a middling case');
      expect(text).toContain('Worked out from the pension you have now, £' + Math.round(inputs.you.pot * 1.09).toLocaleString('en-GB') + ',');   // (7.12.0 wording)
    }, 60000);
  }

  it('the answer\'s own figure stored as typed is read as worked out; a figure the person changed is their own and stays', () => {
    const plan = samPlan();
    const fa = plan.fromAnswer.people[0];
    plan.stressTool.settings.potAtRetirement = { sipp: fa.pension.atStop.middling, isa: fa.savings.atStop.middling || null, source: 'override' };
    expect(effectiveStressSettings(plan, { now: NOW }).potAtRetirement.source).toBe('worked');
    plan.stressTool.settings.potAtRetirement = { sipp: fa.pension.atStop.middling + 1, isa: fa.savings.atStop.middling || null, source: 'override' };
    const typed = effectiveStressSettings(plan, { now: NOW }).potAtRetirement;
    expect(typed).toEqual({ sipp: fa.pension.atStop.middling + 1, isa: fa.savings.atStop.middling || null, source: 'override' });
    expect(atStopText(plan)).toContain('your own figure. It does not follow your pot or what you pay in.');
  }, 30000);

  it('a locked plan reads the figure its plan document was locked with, whatever is recorded since', () => {
    const plan = samPlan();
    plan.decisionTool.settings.locked = true;
    plan.decisionTool.settings.lockedAt = '2026-07-01T10:00:00.000Z';
    plan.planDocument = { lockedAt: '2026-07-01T10:00:00.000Z', pots: { sipp: 120000, isa: 0, gia: 0, potAtRetirement: { sipp: 422772, isa: 0, source: 'accumulation' } } };
    plan.accumulationTool.history.push({ date: '2026-12', sipp: 200000, isa: null, gia: 0, total: 200000, recordedAt: '2026-12-01T12:00:00.000Z' });
    expect(effectiveStressSettings(plan, { now: NOW }).potAtRetirement.sipp).toBe(422772);
  }, 30000);

  it('Jo\'s stop moved from 60 to 65: what the plan pays starts from 65', () => {
    const jo = { ...fixtures.Jo, spend: { kind: 'amount', amount: 2000, then: 'falls', fallsPct: 1 }, endAge: 95 };
    const plan = moveStop(keepAt(jo, 'Jo02'), 65);
    const first = linesOf(planPage([entry(plan)], plan.id, 'plan', { today: READ_ON })).find((x) => x.id === 'pays.step');
    expect(first.sentence.text).toMatch(/^From age 65: /);
  }, 30000);

  it('a page that reads the plan 50 times works the path out once', () => {
    const plan = samPlan();
    plan.stressTool.settings.chargesPct = 0.37;   // a plan no other test has read
    const before = potsAtStopBuilds();
    for (let i = 0; i < 50; i++) effectiveStressSettings(plan, { now: NOW });
    expect(potsAtStopBuilds() - before).toBe(1);
  }, 30000);
});

describe('step 4: a check-in is you telling the plan', () => {
  const at = (d) => new Date(d + 'T12:00:00.000Z');
  const samIn = { 'ci.pension': '131000', 'ci.pay': '55000', 'ci.kind': 'split', 'ci.own': '375', 'ci.employer': '250' };

  it('Sam checks in with a pay rise to £55,000: one write, and the plan uses the new pay and what goes in', () => {
    const plan = samPlan();
    plan.accumulationTool.history = [];
    const p = checkInPatch(plan, samIn, { today: READ_ON, now: at(READ_ON), result: null });
    expect(p.ok).toBe(true);
    expect(p.patch['accumulationTool.settings']).toBeDefined();
    const after = applyPatch(plan, p.patch);
    const v = savingOf([entry(after)], after.id, { today: READ_ON });
    expect(v.fields.find((f) => f.path === 'salary').shown).toBe('55000');
    // £375 landing is £300 from take-home pay (× 0.8); 55,000 − 50,270 = 4,730 a year above the line, more than the
    // 375 × 12 = 4,500 paid in, so the claim is 4,500 × 20% = £900 a year
    const claim = v.relief.find((l) => l.id === 'relief.claim');
    expect(fill(W.relief['relief.claim'], claim.slots)).toBe('At £55,000 you pay higher-rate tax on £4,730 of your pay. On what you pay in you can claim £900 a year back from HMRC, through a tax return or by asking HMRC. It is not added by itself.');
    expect(saverInputsOf(after, { today: READ_ON }).inputs.you.pot).toBe(131000);
    const ci = checkInOf([entry(after)], after.id, { today: READ_ON });
    expect(fill(CW.result.uses[ci.uses.id], ci.uses.slots)).toBe('Your plan now uses these: pay £55,000, £300 a month from your take-home pay, £250 from your employer.');
  }, 30000);

  it('a check-in while not paying in leaves what goes in as the plan has it', () => {
    const plan = samPlan();
    const p = checkInPatch(plan, { ...samIn, 'ci.paused': 'yes', 'ci.pausedFrom': '2026-09' }, { today: READ_ON, now: at(READ_ON), result: null });
    expect(p.ok).toBe(true);
    expect(p.patch['accumulationTool.settings']).toBeUndefined();
    const ci = checkInOf([entry(applyPatch(plan, p.patch))], plan.id, { today: READ_ON });
    expect(fill(CW.result.uses[ci.uses.id], ci.uses.slots)).toBe('Your plan’s pay-in is unchanged while you are not paying in.');
  }, 30000);

  it('no "Use these in my plan" is offered any more', () => {
    const plan = samPlan();
    const after = applyPatch(plan, checkInPatch(plan, samIn, { today: READ_ON, now: at(READ_ON), result: null }).patch);
    const ci = checkInOf([entry(after)], after.id, { today: READ_ON });
    expect(ci.useInPlan).toBeUndefined();
    expect(JSON.stringify(CW)).not.toMatch(/Use .* in my plan/);
  }, 30000);
});

describe('step 5: the home says the answer', () => {
  const jo = { household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 };
  const at = (d) => new Date(d + 'T12:00:00.000Z');
  /** The state the app holds for a plan's page, its reading done as the plan source does it. */
  const pageState = (plan, hash, today = READ_ON) => { const s = stateWith([entry(plan)], hash, { today, source: 'window', session: 'nobody' }); return { ...s, plans: { ...s.plans, view: viewFor(s) } }; };
  const drawn = (state) => { const el = document.createElement('div'); render(h(App, { state, dispatch: () => {} }), el); return el; };

  it('Jo\'s plan (from "Am I saving enough?", £2,000 a month from 60): the home runs the same answer as What you pay in and draws it', () => {
    const plan = keptPlan(jo, { on: '2025-11-12', readOn: READ_ON, id: 'Jo05' });
    const home = pageState(plan, '#/plan/' + plan.id);
    const saving = pageState(plan, '#/plan/' + plan.id + '/saving');
    const v = wanted(home);
    expect(v).not.toBe(null);
    expect(v.key).toBe(wanted(saving).key);
    const result = answerB(v.inputs, { today: READ_ON, futures: 1000, seed: 0, detail: 'answer', ...v.env });
    expect(result.verdict.band).not.toBe('yes');
    const held = reduce(reduce(home, { type: A.SAVER_WORKING, key: v.key }), { type: A.SAVER_FINAL, key: v.key, result });
    const text = drawn(held).querySelector('[data-testid="plan.home.saver"]').textContent;
    expect(text).toContain('Are you paying in enough?');
    expect(text).toContain('Not enough for £2,000 a month from 60');
    // what would be enough, said with what leaves take-home pay: the share's own part of £38,000 a year, × 0.8, a month
    const fig = result.enough.atLevel;
    expect(text).toContain(`${fig.totalPct}% of your pay in all`);
    expect(text).toContain(`£${Math.round(38000 * fig.ownPct / 100 / 12 * 0.8).toLocaleString('en-GB')} a month from your take-home pay`);
    expect(text).toContain('Change what you want or what you pay in');
  }, 60000);

  it('a retired plan\'s home runs nothing', () => {
    const retired = entryOfAt(corpus()['04-buckets-running'], READ_ON).plan;
    expect(saverVerdictOf([entry(retired)], retired.id, { today: READ_ON })).toBe(null);
    expect(wanted(pageState(retired, '#/plan/' + retired.id))).toBe(null);
  }, 30000);

  it('the month the move window opens is said to a saver however far from stopping (7.12.0), and within five years', () => {
    const far = keptPlan(jo, { on: READ_ON, id: 'Jo06' });
    expect(homeOf([entry(far)], far.id, { today: READ_ON }).moveWindow).toMatchObject({ id: 'saving' });
    const near = keptPlan({ ...jo, you: { ...jo.you, age: 56 } }, { on: READ_ON, id: 'Jo07' });
    const w = homeOf([entry(near)], near.id, { today: READ_ON }).moveWindow;
    expect(w && w.id).toBe('saving');
  }, 30000);

  it('"past your line" is said only while the stop and the aim the check-ins tested still stand', () => {
    let plan = keptPlan(jo, { on: '2025-11-12', readOn: '2025-11-12', id: 'Jo08' });
    const checkInOn = (p, day, pension) => {
      const typed = { 'ci.pension': String(pension), 'ci.every': 'year' };
      const d = checkInDraft(p, typed, { today: day });
      expect(d.ok).toBe(true);
      const result = answerB(d.read.inputs, { today: day, futures: 1000, seed: 0, detail: 'answer', ...d.read.env });
      return applyPatch(p, checkInPatch(p, typed, { today: day, now: at(day), result }).patch);
    };
    plan = checkInOn(plan, '2025-11-12', 22000);
    plan = upgradeScenario(copy(plan), { now: noon(READ_ON) }).scenario;
    plan = checkInOn(plan, READ_ON, 23000);
    const ids = (p) => (planPage([entry(p)], p.id, null, { today: READ_ON }).due || []).map((x) => x.id);
    expect(ids(plan).some((x) => /offCourse/.test(x))).toBe(true);
    const spend = (p, amount) => { const q = copy(p); q.stressTool.settings.baseSalary = amount; q.stressTool.settings.incomeSteps = [{ fromAge: 60, amount }]; q.stressTool.settings.targetSchedule = null; return q; };
    const changed = spend(plan, 18000);
    expect(ids(changed).some((x) => /offCourse/.test(x))).toBe(false);
  }, 90000);
});

describe('step 7: a name the person did not type follows the plan', () => {
  const sam65 = () => {
    const plan = keptPlan({ ...samInputs(), stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } }, { on: '2025-11-12', readOn: READ_ON, id: 'Sam07' });
    plan.planDetails.name = plan.fromAnswer.name.suggested;
    return plan;
  };
  const changed = (plan) => {
    const a = aboutPatch(plan, { ...aboutBoxes(plan, { today: READ_ON }), stopAge: '67' }, { today: READ_ON });
    let p = applyPatch(plan, a.patch);
    const sp = spendPatch(p, { ...spendBoxes(p, { today: READ_ON }), 'first.amount': '2200' }, { today: READ_ON });
    expect(sp.ok).toBe(true);
    p = applyPatch(p, sp.patch);
    return p;
  };
  it('Sam\'s plan kept under the suggested name, then the stop moved to 67 and £2,200 a month: "Stop at 67 · £2,200 a month"', () => {
    const plan = sam65();
    expect(plan.planDetails.name).toBe('Stop at 65 · £2,400 a month');   // 7.12.0: a name kept from B carries no pay-in
    const after = changed(plan);
    expect(shownPlanName(after, { now: noon(READ_ON) })).toBe('Stop at 67 · £2,200 a month');
    // brought in from a window before 7.12.0, with the old mark: the same
    after.planDetails.name = plan.planDetails.name + ' (from this window)';
    expect(shownPlanName(after, { now: noon(READ_ON) })).toBe('Stop at 67 · £2,200 a month');
    expect(savingOf([entry(after)], after.id, { today: READ_ON }).name).toBe('Stop at 67 · £2,200 a month');
  }, 30000);
  it('a plan the person named keeps its name; so does one not kept from an answer', () => {
    const named = changed(sam65());
    named.planDetails.name = 'Sam’s plan';
    expect(shownPlanName(named, { now: noon(READ_ON) })).toBe('Sam’s plan');
    const plain = changed(sam65());
    delete plain.fromAnswer;
    expect(shownPlanName(plain, { now: noon(READ_ON) })).toBe(plain.planDetails.name);
  }, 30000);
  it('plans brought in after a sign-in keep their names: no "(from this window)"', () => {
    expect(WINDOW_SUFFIX).toBe('');
  });
});

describe('step 6: figures passed to "What is my pot worth?" keep their shape', () => {
  it('Jo\'s answer (5% and 3% of £38,000) carried into the pot-worth question and kept: the employer\'s part reaches the plan', () => {
    let st = run(fresh({ today: READ_ON }), set('b', 'you.age', '33'), set('b', 'you.pot', '22,000'), set('b', 'you.payIn.kind', 'share'), set('b', 'you.payIn.pay', '38,000'),
      set('b', 'you.payIn.ownPct', '5'), set('b', 'you.payIn.employerPct', '3'), set('b', 'stop.age', '60'), set('b', 'spend.amount', '2,000'));
    st = answered(st, 'b', { status: 'ok', saving: [{ who: 'you', payIn: { total: 253.33 } }] });
    st = reduce(st, { type: A.DRAFT_CARRY, from: 'b', to: 'c' });
    expect(st.draft.c.values).toMatchObject({ 'you.payIn.has': 'yes', 'you.payIn.kind': 'share', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3' });
    const parsed = parsedDraft(st, 'c');
    expect(parsed.ok).toBe(true);
    const result = answerC(parsed.inputs, { today: READ_ON, futures: 100, seed: 0, detail: 'answer' });
    const seed = buildPlanSeed({ source: 'c', result, env: { today: READ_ON, appVersion: 'test' }, name: 'Jo', createdAt: READ_ON + 'T10:00:00.000Z' });
    const plan = seedToScenario(seed, READ_ON).yours;
    // 38,000 × 3% ÷ 12 = 95 from the employer; 38,000 × 5% ÷ 12 = 158.33 lands from Jo, × 0.8 = 126.67 from take-home pay
    expect(plan.accumulationTool.settings.employerMonthly).toBe(95);
    expect(plan.accumulationTool.settings.netMonthly).toBeCloseTo(126.67, 1);
  }, 60000);
});

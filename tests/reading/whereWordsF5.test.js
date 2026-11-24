/**
 * Step F5 (lead4.md D17, R8): "Where you are" has ONE sentence builder (src/reading/where.js) for the plan year and the
 * income step, drawn by both views: the full view's strip (PlanDocumentView.whereAmIHtml) and the simple view's Where you
 * are (answers/plan/read.js). The plan year is said without "plan year N" (the simple view's wording rule) and its two
 * figures are marked (plan.year, plan.years) in both views. Every person and figure here is made up.
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { planYearSentence, stepSentence, ladderSentence, potSentence, WHERE_KEYS } from '../../src/reading/where.js';
import { yearPlanHtml, thisYearOfPlan } from '../../src/ui/thisYearHtml.js';
import { whereAmIFor } from '../../src/services/PlanReading.js';
import { incomeStepsOf } from '../../src/reading/income.js';
import { whereAmIHtml } from '../../src/ui/components/PlanDocumentView.js';
import { planPage } from '../../src/answers/plan/read.js';
import { partText } from '../../src/answers/shared/format.js';
import { formatFact } from '../../src/reading/format.js';
import { LABELS } from '../../src/reading/labels.js';
import { FACT } from '../../src/reading/facts.js';
import { BANNED } from '../../src/v7/copy/banned.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const text = (s) => s.parts.map((p) => partText(p, s.figures)).join('');
const plain = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&#39;|&rsquo;/g, '’').replace(/\s+/g, ' ');
const marks = (h) => [...String(h).matchAll(/data-fact="([^"]+)"[^>]*>([^<]*)</g)].map((m) => m[1] + '=' + m[2]);

describe('the plan year, in words both views may say', () => {
  const w = (planYear, planYears) => ({ planYear, planYears, taxYear: '2026/27', beforeStart: false });
  it('its first year, a later year, after its last', () => {
    expect(text(planYearSentence(w(0, 30)))).toBe('Tax year 2026/27 is the first of your plan’s 30 tax years.');
    expect(text(planYearSentence(w(1, 30)))).toBe('Tax year 2026/27 is 1 year into your plan, which runs 30 tax years.');
    expect(text(planYearSentence(w(3, 30)))).toBe('Tax year 2026/27 is 3 years into your plan, which runs 30 tax years.');
    expect(text(planYearSentence(w(30, 30)))).toBe('Tax year 2026/27 is after the last of your plan’s 30 tax years.');
    expect(planYearSentence({ ...w(-1, 30), beforeStart: true })).toBe(null);
  });
  it('the simple view\'s wording rules pass it', () => {
    for (const y of [0, 1, 3, 30]) {
      const t = text(planYearSentence(w(y, 30)));
      for (const b of BANNED) if (b.re && b.scope === 'all') expect(b.re.test(t), b.id + ': ' + t).toBe(false);
    }
  });
  it('one label and one rule each', () => {
    expect(LABELS[FACT.PLAN_YEAR].label).toBe('Years into the plan');
    expect(LABELS[FACT.PLAN_YEARS].label).toBe('Tax years in the plan');
    expect(formatFact(FACT.PLAN_YEAR, 3)).toBe('3');
    expect(formatFact(FACT.PLAN_YEARS, 30)).toBe('30');
    expect(WHERE_KEYS['where.planYear']).toEqual({ planYear: FACT.PLAN_YEAR, planYears: FACT.PLAN_YEARS });
  });
});

describe('the ladder\'s month', () => {
  const w = (ladder) => ({ planYear: 2, planYears: 30, taxYear: '2026/27', ladder });
  it('the plan\'s rule for the month, its figure marked; nothing beside a year set up that says the month', () => {
    const s = ladderSentence(w({ phase: 'running', monthly: 2833.4, instruction: 'The plan pays £2,833 a month for the 5 months to 5 April 2027.' }));
    expect(text(s)).toBe('The plan pays £2,833 a month for the 5 months to 5 April 2027.');
    expect(s.parts.filter((p) => typeof p !== 'string')).toEqual([{ key: 'ladderMonthly', kind: 'money' }]);
    expect(WHERE_KEYS['where.ladder']).toEqual({ ladderMonthly: FACT.LADDER_MONTHLY, ladderFirstMonthly: FACT.LADDER_FIRST_MONTHLY });
    expect(ladderSentence(w({ phase: 'running', monthly: 2833.4, instruction: 'The plan pays £2,833 a month.' }), { yearSaid: true })).toBe(null);
    expect(text(ladderSentence(w({ phase: 'before', monthly: 0, instruction: 'The ladder starts in 2029/30.' }), { yearSaid: true }))).toBe('The ladder starts in 2029/30.');
    expect(ladderSentence(w(null))).toBe(null);
  });
});

describe('both views draw the one builder\'s sentences', () => {
  const tried = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      if (!plan.planDocument) return;
      let w = null; try { w = whereAmIFor(plan, { now: NOW }); } catch { w = null; }
      if (!w || w.saving || w.beforeStart) return;
      const steps = incomeStepsOf(plan, { now: NOW }).steps;
      const full = whereAmIHtml(w, null, { steps });
      const entries = plans.map((p) => ({ plan: p }));
      const pg = planPage(entries, plan.id, 'where', { today: PARITY_DAY });
      const where = (pg.steps || []).find((x) => x.id === 'where');
      if (!where || !where.done) return;
      const said = (where.lines || []).map((l) => l.sentence.text);
      tried.push(f.key);
      const py = planYearSentence(w);
      expect(plain(full), 'the full view says the plan year').toContain(text(py));
      expect(said, 'the simple view says the plan year').toContain(text(py));
      // the first year and a year past the last say no count of years into the plan
      if (w.planYear > 0 && w.planYear < w.planYears) expect(marks(full)).toContain('plan.year=' + w.planYear);
      expect(marks(full)).toContain('plan.years=' + w.planYears);
      // the ladder's month, said once: not beside the year as set up, which says the month's figure (7.12.0), in both views
      const t = thisYearOfPlan(plan, NOW);
      const yearPlan = t && t.setUp ? yearPlanHtml(t) : '';
      const lad = ladderSentence(w, { yearSaid: !!yearPlan });
      const fullWith = whereAmIHtml(w, null, { steps, year: yearPlan ? { plan: yearPlan, changed: '' } : null });
      if (lad) {
        expect(plain(fullWith), 'the full view says the ladder').toContain(text(lad));
        expect(said, 'the simple view says the ladder').toContain(text(lad));
      } else expect(said.some((x) => /^The ladder|^The plan pays/.test(x)), 'nor does the simple view').toBe(false);
      const st = stepSentence(w, steps);
      if (st) {
        expect(plain(full), 'the full view says the step').toContain(text(st));
        expect(said, 'the simple view says the step').toContain(text(st));
      }
    });
  }
  it('the locked plans past their start are tried', () => {
    expect(tried.length).toBeGreaterThan(0);
  });
});

// Step F5, pass 3 (D17): the pot set against the band is one builder (where.js potSentence) in both views, marked the same
describe('the pot against the plan, one sentence in both views', () => {
  const tried = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      if (!plan.planDocument) return;
      let w = null; try { w = whereAmIFor(plan, { now: NOW }); } catch { w = null; }
      if (!w || w.saving || w.beforeStart) return;
      const ps = potSentence(w);
      if (!ps) return;
      const full = whereAmIHtml(w, null, { steps: incomeStepsOf(plan, { now: NOW }).steps });
      const pg = planPage(plans.map((p) => ({ plan: p })), plan.id, 'where', { today: PARITY_DAY });
      const where = (pg.steps || []).find((x) => x.id === 'where');
      const pot = (where.lines || []).find((l) => l.id === 'where.pot');
      tried.push(f.key);
      expect(pot.sentence.text, 'the simple view').toBe(text(ps.pot) + '.');
      expect(plain(full), 'the full view').toContain('Your pot: ' + text(ps.pot));
      // a record says its date (R4): the full view after the band, the simple view on the line's source
      if (!ps.parts && ps.source.at) expect(plain(full)).toMatch(/From (your record|What you hold), [A-Z]/);
      for (const [k, id] of Object.entries(WHERE_KEYS['where.pot'])) if (ps.pot.parts.some((p) => p && p.key === k)) expect(marks(full).some((m) => m.startsWith(id + '=')), id).toBe(true);
    });
  }
  it('was tried on a locked drawing plan', () => { expect(tried.length).toBeGreaterThan(0); });
});

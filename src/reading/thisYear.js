/**
 * This tax year (lead4.md D7; step F2): ONE reader, given (plan, ctx), for every place either view says what the plan takes
 * this tax year — the home and its month cells, Month by month, "Where you are", Your plan as locked, the plan document's
 * strip and the full view's Tax Years tab.
 *
 *   thisTaxYearOf(plan, ctx, { key }) → {
 *     key: '26/27', year: '2026/27',
 *     setUp: null | {                 the year as it was set up: a dated RECORD (R4), never rewritten by a later change
 *       on:       'YYYY-MM-DD' | null   the day it was set up (null for a set-up made before the day was kept)
 *       from:     'YYYY-MM'             the month it pays from (April, or the month it was set up part-way from)
 *       payments: number                the months it pays (12 from April)
 *       perMonth: number                what it takes a month before tax (YearPlan.yearPlanOf: pension, other income, State Pension)
 *       total:    number                perMonth × payments, rounded once
 *       perYear:  number                the year's income before tax as it is taken (BeforeTax.takenBeforeTax on the set-up's
 *                                       own bands and tax-free share): the figure Month by month and Tax Years both say
 *       stored:   number                the year as the engines keep it (`confirmedSalary`)
 *     },
 *     planSays: null | { perYear, stored }   the plan's own figure for this tax year NOW: the set-up's own suggestion
 *                                       (TaxYearSetUp.suggestedIncomeFor on the plan as it is), in the same two measures
 *     paymentsLeft: number | null       the months from this month (or the year's first payment, if later) to March with no record
 *     differs: boolean                  the plan was changed after the set-up: what it says for the year is not what the
 *                                       year was set up on (the suggestion then, kept as `planSaid`; for an older set-up
 *                                       with none kept, the year as set up, or that grown by the year's prices: the
 *                                       first-year rule before 7.12.0)
 *   }
 *   thisYearSentences(t) → [{ id, parts, figures }]  the words both views say: 'where.yearPlan' (the year as set up) and,
 *                                       when the plan differs, 'where.yearChanged' — both figures with their dates and
 *                                       "You can set this year up again". Nothing is rewritten: the set-up stays the year's
 *                                       record until the person sets it up again.
 *   setUpAgainConfig(cfg) → cfg         "Set this year up again", the one rule both views write: the set-up is opened again
 *                                       (`yearSetupComplete` false), everything else as it was
 *
 * Pure: the day arrives in ctx.now.
 */
import { yearPlanOf, addMonths } from '../services/YearPlan.js';
import { monthInputsOf } from '../services/MonthDecision.js';
import { wizardDataFrom, suggestedIncomeFor } from '../services/TaxYearSetUp.js';
import { statePensionInfoFor } from '../utils/StatePensionUtils.js';
import { storedStressSettings } from '../services/PlanReading.js';
import { takenBeforeTax } from '../services/BeforeTax.js';
import { taxFreeFractionOf } from '../services/FlexibleAccess.js';
import { getTaxYearFromDate } from '../services/legacyDecision.js';
import { DECISION_ASSUMED_CPI } from '../services/InflationModel.js';
import { monthWords, dayWords } from '../answers/plan/dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());
const monthOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
/** '26/27' → '2026/27'. */
const yearLabel = (key) => { const a = parseInt(String(key).split('/')[0], 10); return Number.isFinite(a) ? (a < 100 ? 2000 + a : a) + '/' + String(key).split('/')[1] : String(key); };
const aprilOf = (key) => { const a = parseInt(String(key).split('/')[0], 10); return (a < 100 ? 2000 + a : a) + '-04'; };

/** The year as the engines keep it, as it is taken before tax: the set-up's own bands and the plan's tax-free share. */
function asTaken(stored, cfg, I) {
  if (!(stored > 0)) return null;
  return Math.round(takenBeforeTax(stored, { taxFreeFraction: taxFreeFractionOf(I.settings, I.history, 0), fixed: (+cfg.other || 0) + (+cfg.statePension || 0), pa: cfg.pa, brl: cfg.brl, hrl: cfg.hrl }));
}

/** The plan's figure for the year now, as the set-up would suggest it (the same call the set-up kept as `planSaid`). */
function planStoredFor(plan, key, cfg, I, now) {
  const ctx = wizardDataFrom(aprilOf(key), {
    settings: I.settings, stressSettings: storedStressSettings(plan), existingConfig: cfg, allTaxYears: I.taxYears,
    statePensionInfo: statePensionInfoFor(I.settings, I.taxYears, key, now), now, history: I.history
  });
  const v = suggestedIncomeFor(ctx, num(cfg.cpi));
  return Number.isFinite(v) && v > 0 ? v : null;
}

export function thisTaxYearOf(plan, ctx = {}, { key: k = null } = {}) {
  const now = nowOf(ctx);
  const key = k || getTaxYearFromDate(monthOf(now));
  const out = { key, year: yearLabel(key), setUp: null, planSays: null, paymentsLeft: null, differs: false };
  const dt = plan && isObj(plan.decisionTool) ? plan.decisionTool : null;
  const cfg = dt && isObj(dt.taxYears) ? dt.taxYears[key] : null;
  let yp = null; try { yp = yearPlanOf(plan, key); } catch { yp = null; }
  if (!yp || !cfg) return out;
  let I = null; try { I = monthInputsOf(plan, { now }); } catch { I = null; }
  const stored = num(cfg.confirmedSalary);
  out.setUp = {
    on: typeof cfg.setUpOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cfg.setUpOn) ? cfg.setUpOn : null,
    from: yp.from, payments: yp.payments, perMonth: yp.perMonth, total: yp.total,
    perYear: I && stored != null ? asTaken(stored, cfg, I) : null, stored
  };
  // the payments still to come: from this month (or the year's first, if later) to March, each with no record
  const hist = Array.isArray(dt.history) ? dt.history : [];
  const recorded = new Set(hist.filter((h) => h && h.taxYear === key && typeof h.date === 'string').map((h) => h.date.slice(0, 7)));
  const end = addMonths(aprilOf(key), 11);
  let left = 0;
  for (let m = yp.from > monthOf(now) ? yp.from : monthOf(now); m && m <= end; m = addMonths(m, 1)) if (!recorded.has(m)) left++;
  out.paymentsLeft = left;
  if (I) {
    let planStored = null; try { planStored = planStoredFor(plan, key, cfg, I, now); } catch { planStored = null; }
    if (planStored != null) {
      out.planSays = { perYear: asTaken(planStored, cfg, I), stored: planStored };
      if (num(cfg.planSaid) != null) out.differs = Math.abs(planStored - +cfg.planSaid) >= 1;
      else if (stored != null) {
        // an older set-up, made before it kept what the plan said: the year as set up, or that figure grown by the year's
        // prices (the rule before 7.12.0 grew a first year so), is the plan as it was then — anything else is a change
        const grown = Math.round(planStored * (1 + (num(cfg.cpi) != null ? +cfg.cpi : DECISION_ASSUMED_CPI)));
        out.differs = Math.abs(planStored - stored) >= 1 && Math.abs(grown - stored) >= 1;
      }
    }
  }
  return out;
}

/** "Set this year up again": the year's set-up opened again, nothing else changed (both views write this). */
export function setUpAgainConfig(cfg) {
  return { ...(isObj(cfg) ? cfg : {}), yearSetupComplete: false };
}

const money = (key) => ({ key, kind: 'money' });

/** The words both views say for this tax year: the year as set up and, when the plan has changed since, both figures. */
export function thisYearSentences(t) {
  if (!t || !t.setUp) return [];
  const S = t.setUp;
  const figures = { yearMonthly: Math.round(S.perMonth), yearTotal: S.total };
  const april = S.from && S.from.slice(5) === '04' && S.payments === 12;
  const out = [{
    id: 'where.yearPlan', figures,
    parts: april
      ? ['In ' + t.year + ' your plan takes ', money('yearMonthly'), ' a month before tax.']
      : ['In ' + t.year + ' your plan takes ', money('yearMonthly'), ' a month before tax, from ' + monthWords(S.from) + ': ' + S.payments + ' payment' + (S.payments === 1 ? '' : 's') + ', ', money('yearTotal'), '.']
  }];
  // the set-up is a dated record (lead4.md R4; step F5): its day said wherever the year is shown, in both views, and
  // marked as one fact (income.thisYear.setUpOn); the line said when the plan differs carries the day itself
  if (S.on && !(t.differs && t.planSays && t.planSays.perYear != null && S.perYear != null)) out[0].parts = [...out[0].parts, ' This tax year was set up on ' + dayWords(S.on) + '.'];
  if (t.differs && t.planSays && t.planSays.perYear != null && S.perYear != null) {
    const f = { planYear: t.planSays.perYear, setUpYear: S.perYear, yearMonthly: Math.round(S.perMonth) };
    out.push({
      id: 'where.yearChanged', figures: f,
      parts: ['Your plan takes ', money('planYear'), ' a year before tax. This tax year was set up' + (S.on ? ' on ' + dayWords(S.on) : '') + ' at ', money('setUpYear'), ', so each month still takes ', money('yearMonthly'), ' before tax until you set this year up again.']
    });
  }
  return out;
}


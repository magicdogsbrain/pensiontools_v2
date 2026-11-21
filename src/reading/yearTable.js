/**
 * The year tables (lead4.md D9, R1; step F3): ONE function gives a plan's year-by-year tables, and both views draw them —
 * the simple view's "The years, one by one" (answers/plan/lastsRun.js extrasOf → lasts.js extrasView) and the full view's
 * Drawdown and Glidepath pages (index.html showDrawdownScheduleUI, showGlidepathUI, strategyScheduleNotice). The same rows,
 * the same columns, the same run: the plan's own length and the plan's own price assumption (ASSUMED_PRICES), and for a way
 * of drawing that buys its income, the one test's own result (a locked ladder: its document's, never a fresh run).
 *
 *   yearTablesOf({ settings, strategyId, p, r, now, prices, duration }) → { prices, startAge, duration, schedule, glidepath, own }
 *     settings   the plan's effective settings (the one recipe: src/reading/gather.js lastsInputOf)
 *     p, r       the one test's plan and result (a locked ladder: the document's)
 *     prices     ASSUMED_PRICES unless a what-if says otherwise (the full view's "what if" boxes: never the plan's table)
 *     duration   the plan's own length (settings.duration) unless a what-if says otherwise
 *       schedule   Pots & Valves: year by year (every income in the after-tax figure has its column: the pension, the State
 *                  Pension, other income when there is some, so a row adds up both ways), from DrawdownService.generateDrawdownSchedule (raw pounds, numbers)
 *       glidepath  Pots & Valves: the pots' floors, from GlidepathService.generateGlidepathSchedule, with the ISA left
 *       own        any other way, when it can be bought: the run's cones (income middle and 1 in 10 bad, left middle)
 *   yearColumnsOf(tables) → { years: [col…], floors: [col…] }   the columns both views draw, in order
 *   yearCellText(col, v)  the one way every cell is written (src/reading/format.js money for pounds)
 *   yearTablesText(tables) → { prices, kind, cols, rows: [{ key, age, cells: { col: text } }], floorCols, floorRows, flags }
 *
 * Pure but for the services' own arithmetic. The labels of the columns are src/reading/labels.js YEAR_COLUMNS.
 */
import { generateDrawdownSchedule } from '../services/DrawdownService.js';
import { generateGlidepathSchedule } from '../services/GlidepathService.js';
import { money } from './format.js';

/** The prices the year tables assume (a year): the plan's own assumption, in both views. */
export const ASSUMED_PRICES = 0.025;
const r0 = (v) => Math.round(+v || 0);

export function yearTablesOf({ settings, strategyId, p = null, r = null, now, prices = ASSUMED_PRICES, duration: len = null } = {}) {
  const s0 = settings || {};
  const duration = Math.max(1, r0(len) || r0(s0.duration) || 35);
  const startAge = r0(s0.shapeAgeNow) || r0(p && p.startAge) || 57;
  const pnv = (strategyId || 'pots-and-valves') === 'pots-and-valves';
  let schedule = null, glidepath = null, own = null;
  if (pnv) {
    const s = { ...s0, duration };
    try {
      schedule = generateDrawdownSchedule(s, duration, prices, now).map((x) => ({ year: x.year, age: startAge + x.year, pension: r0(x.sippDraw), state: r0(x.statePension), ...(x.otherIncome > 0 ? { otherIncome: r0(x.otherIncome) } : {}), tax: r0(x.tax), net: r0(x.netIncome), isa: r0(x.isaDraw), ...(x.giaDraw > 0 ? { gia: r0(x.giaDraw) } : {}), spendable: r0(x.spendable), isaLeft: r0(x.isaBalance) }));
    } catch { schedule = null; }
    try {
      const isaByYear = {};
      for (const x of schedule || []) isaByYear[x.year] = x.isaLeft;
      glidepath = { tent: !!s.equityGlideEnabled, diversifiers: (+s.diversifierStart || 0) > 0, reserve: !!s.hodlEnabled && (+s.hodlValue || 0) > 0,
        rows: generateGlidepathSchedule(s, prices).map((x) => ({ year: x.year, age: startAge + x.year, shares: r0(x.equityMin), bonds: r0(x.bondMin), cash: r0(x.cashTarget), diversifiers: r0(x.diversifier), reserve: r0(x.hodl), sharesPct: Math.round((x.equityShareOfPot || 0) * 100), isa: isaByYear[x.year] != null ? isaByYear[x.year] : null, total: r0(x.totalMin) })) };
    } catch { glidepath = null; }
  } else if (r && r.affordable && r.cones && r.cones.income && r.cones.wealth) {
    const inc = r.cones.income, w = r.cones.wealth;
    const years = Math.max(0, r0(p && p.durationYears) || duration);
    const sa = r0(p && p.startAge) || startAge;
    own = [];
    for (let y = 0; y < years; y++) own.push({ year: y + 1, age: sa + y, incomeMid: r0(inc.p50 && inc.p50[y]), incomeBad: r0(inc.p10 && inc.p10[y]), leftMid: r0(w.p50 && w.p50[y]) });
  }
  return { prices, startAge, duration, schedule, glidepath, own };
}

/** The columns both views draw, in order: the year table's (a schedule's, or a bought way's own) and the floors'. */
export function yearColumnsOf(t) {
  const x = t || {};
  const gia = Array.isArray(x.schedule) && x.schedule.some((r) => r.gia > 0) ? ['gia'] : [];
  const other = Array.isArray(x.schedule) && x.schedule.some((r) => r.otherIncome > 0) ? ['otherIncome'] : [];
  const years = Array.isArray(x.schedule) ? ['year', 'age', 'pension', 'state', ...other, 'tax', 'net', 'isa', ...gia, 'spendable', 'isaLeft']
    : Array.isArray(x.own) ? ['year', 'age', 'incomeMid', 'incomeBad', 'leftMid'] : [];
  const g = x.glidepath;
  const floors = g && Array.isArray(g.rows) ? ['year', 'age', 'shares', 'bonds', 'cash', ...(g.diversifiers ? ['diversifiers'] : []), ...(g.reserve ? ['reserve'] : []), 'sharesPct', 'isa', 'total'] : [];
  return { years, floors };
}

/** A cell as both views write it: the year and the age as numbers, the shares' part as a percentage, every other cell in pounds. */
export function yearCellText(col, v) {
  if (v == null || v === '') return '';
  if (col === 'year' || col === 'age') return String(r0(v));
  if (col === 'sharesPct') return String(r0(v)) + '%';
  return money(v);
}

/** The tables as text, cell by cell, keyed as the marks key them (row: the year; column: the column's id). */
export function yearTablesText(t) {
  const x = t || {};
  const { years, floors } = yearColumnsOf(x);
  const rowsOf = (list, cols) => (Array.isArray(list) ? list.map((r) => ({ key: String(r.year), age: r.age, raw: { ...r }, cells: Object.fromEntries(cols.map((c) => [c, (c === 'gia' || c === 'otherIncome') ? yearCellText(c, r[c] || 0) : yearCellText(c, r[c])])) })) : []);
  const g = x.glidepath;
  return {
    prices: String(Math.round((+x.prices || 0) * 1000) / 10),
    kind: Array.isArray(x.schedule) ? 'schedule' : Array.isArray(x.own) ? 'own' : null,
    cols: years,
    rows: rowsOf(Array.isArray(x.schedule) ? x.schedule : x.own, years),
    floorCols: floors,
    floorRows: g ? rowsOf(g.rows, floors) : [],
    flags: { tent: !!(g && g.tent), diversifiers: !!(g && g.diversifiers), reserve: !!(g && g.reserve) }
  };
}

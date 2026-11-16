/**
 * A sweep: open every page of a plan that the register (facts.js) names, in one view or both, read every fact each
 * page states, and look each page over for the never-list. Returns the readings by fact, so a scenario can hold one fact
 * to one value across pages (SAME), and the never-list findings by page.
 */
import { FACTS } from './facts.js';
import { fact, neverOnAnyPage } from './read.js';
import { planPage, fullPage, settled } from './routes.js';

/** The pages of a view the register names for these facts (all facts by default), in the register's order. */
export function pagesFor(view, ids = Object.keys(FACTS)) {
  const out = [];
  for (const id of ids) for (const p of FACTS[id][view] || []) if (!out.includes(p.page)) out.push(p.page);
  return out;
}

/**
 * Reads `ids` on every page of `views` for the plan. A simple page is read once it has settled; a full-view page is
 * given `fullWait` for its figures to appear. Readings: { [id]: [{ where, value, raw }] } (a page that does not state
 * the fact is left out); never: [{ where, found }].
 */
export async function sweep(page, planId, { views = ['simple', 'full'], ids = Object.keys(FACTS), simpleWait = 2_500, fullWait = 8_000, pages = null } = {}) {
  const readings = Object.fromEntries(ids.map((id) => [id, []]));
  const never = [];
  for (const view of views) {
    for (const name of pages?.[view] || pagesFor(view, ids)) {
      const where = `${view === 'simple' ? 'simple' : 'full view'} ${name}`;
      if (view === 'simple') {
        await planPage(page, planId, name);
        await settled(page).catch(() => {});
      } else {
        if (!(await fullPage(page, name))) continue;     // a tab this plan's stage does not show
      }
      for (const id of ids) {
        if (!(FACTS[id][view] || []).some((p) => p.page === name)) continue;
        const got = await fact(page, id, { view, page: name, timeout: view === 'simple' ? simpleWait : fullWait });
        if (got && got.value !== null) readings[id].push({ where, value: got.value, raw: got.raw });
      }
      const found = await neverOnAnyPage(page, { view });
      if (found.length) never.push({ where, found });
    }
  }
  return { readings, never };
}

/** Whole years of a duration in months (a page that says "11 years" and one that says "11 years 3 months" agree). */
export const sameYears = (a, b) => Math.floor(a / 12) === Math.floor(b / 12) && (a % 12 === 0 || b % 12 === 0 || a === b);

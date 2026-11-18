/**
 * The sweep (lead4.md section 2, G3): for every fixture, in each view, every page and tab opened, the page let finish
 * (no busy mark, its text still), and every mark read. Nothing here judges wording or holds an expected figure: the run's
 * results are compared with each other by e2e/parity/gate.js, totalled by scripts/e2e-parity.mjs.
 *
 * Each fixture writes test-results/parity/fixtures/<key>.json. A page a stage does not offer (the simple view sends the
 * address elsewhere; the full view hides the tab) is recorded as not opened.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES, PARITY_TODAY } from './fixtures/plans.js';
import { seedFixture } from './fixtures/seed.js';
import { collectMarks, waitQuiet } from './collect.js';
import { readingsFor } from './readings.js';
import { FIELD_IDS } from '../../src/reading/fields.js';
import { at, signIn, openSimple, openFull, closeNews } from '../scenarios/routes.js';

export const OUT_DIR = join(process.cwd(), 'test-results', 'parity', 'fixtures');

/** Every step of a plan in the simple view ('' is its home). */
export const SIMPLE_PAGES = Object.freeze(['', 'plan', 'about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix', 'saving', 'checkin', 'review', 'month', 'where', 'lock', 'hold', 'move', 'budget', 'household']);

/** A press on a simple page that opens a figure drawn closed (the year table on "Does it last?"). */
export const SIMPLE_PRESS = Object.freeze({ lasts: '[data-testid="plan.lasts.schedule"]' });

/** Every tab and sub-tab of the full view. */
export const FULL_PAGES = Object.freeze([
  { name: 'budget', tab: 'budget' },
  // the full view works the one test out on a press ("Run the test"); the simple view without one — the sweep presses it, as a
  // person reading the figure does, so the figures can be compared (that a press is needed is said in the handover, lead4.md D24)
  { name: 'will it last', tab: 'stress', sub: 'montecarlo', press: 'button[data-on-click="runMonteCarloUI()"]' },
  { name: 'stress history', tab: 'stress', sub: 'historical' },
  { name: 'scenarios', tab: 'stress', sub: 'scenarios' },
  // the year table is drawn on a press in the full view ("Show Schedule") and opened on a press in the simple view
  { name: 'drawdown', tab: 'stress', sub: 'drawdown', press: 'button[data-on-click="showDrawdownScheduleUI()"]' },
  { name: 'glidepath', tab: 'stress', sub: 'glidepath' },
  { name: 'stress settings', tab: 'stress', sub: 'stresssettings' },
  { name: 'strategies', tab: 'strategies' },
  { name: 'monthly entry', tab: 'decision', sub: 'entry' },
  { name: 'history', tab: 'decision', sub: 'history' },
  { name: 'plan document', tab: 'decision', sub: 'plandoc' },
  { name: 'tax years', tab: 'decision', sub: 'taxyears' },
  { name: 'decision settings', tab: 'decision', sub: 'decisionsettings' },
  // "Am I on course?" is worked out on a press in the full view ("Work it out"), on open in the simple view (lead4.md D24)
  { name: 'accumulation', tab: 'accumulation', press: 'button[data-on-click="runOnTrackCheck()"]' },
  { name: 'transition', tab: 'transition' },
  { name: 'household', tab: 'household' }
]);

const only = process.env.PARITY_FIXTURE ? process.env.PARITY_FIXTURE.split(',').map((s) => s.trim()).filter(Boolean) : null;
const noon = (iso) => { const d = new Date(iso); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); };

async function readPage(page, out, view, name, opened) {
  const key = `${view}:${name || 'home'}`;
  const quiet = opened ? await waitQuiet(page) : true;
  out.pages.push({ view, page: name || 'home', opened, quiet });
  if (!opened) return;
  const got = await page.evaluate(collectMarks);
  for (const p of got.places) out.places.push({ view, page: name || 'home', ...p });
  for (const c of got.cells) out.cells.push({ view, page: name || 'home', ...c });
  // only boxes bound through the field table count (src/reading/fields.js)
  for (const f of got.fields) if (FIELD_IDS.includes(f.field)) out.fields.push({ view, page: name || 'home', ...f });
  out.unmarked[key] = got.unmarked;
  out.samples[key] = got.samples;
}

/** Opens a tab (and sub-tab) of the full view as a person does; false when the stage does not offer it. */
async function fullTab(page, { tab, sub }) {
  await closeNews(page);
  const t = page.locator(`.tab[data-tab="${tab}"]`);
  if (!(await t.isVisible().catch(() => false))) return false;
  await t.click();
  if (!sub) return true;
  const s = page.locator(`.sub-tab[data-${tab}tab="${sub}"]`);
  const shows = () => expect(s).toBeVisible({ timeout: 5_000 }).then(() => true, () => false);
  if (!(await shows())) { await t.click(); if (!(await shows())) return false; }
  await s.click();
  return true;
}

test.describe('parity sweep', () => {
  for (const fx of FIXTURES.filter((f) => !only || only.includes(f.key))) {
    test(`${fx.key}: every page of both views read`, async ({ page }) => {
      test.setTimeout(25 * 60_000);
      const who = await seedFixture(fx, { tag: test.info().project.name.replace(/[^a-z0-9]+/gi, '-') + '-' + test.info().repeatEachIndex });
      const subject = who.plans.find((p) => p.id === fx.subject);
      const out = {
        fixture: fx.key, subject: fx.subject, at: PARITY_TODAY,
        pages: [], places: [], cells: [], fields: [], unmarked: {}, samples: {},
        readings: readingsFor(subject, { now: noon(PARITY_TODAY) })
      };
      await at(page, PARITY_TODAY);
      await signIn(page, who);

      for (const step of SIMPLE_PAGES) {
        await openSimple(page, `#/plan/${fx.subject}${step ? '/' + step : ''}`);
        await closeNews(page);
        const screen = (await page.locator('#app [data-screen]').getAttribute('data-screen')) || '';
        const route = new URL(page.url()).hash;
        // the page is this plan's step when the address held and the screen is a plan's
        const opened = /^plan/.test(screen) && route.startsWith(`#/plan/${fx.subject}`) && (step === '' ? !/#\/plan\/[^/]+\/./.test(route) : route.includes('/' + step));
        // the year table opens on a press, as a person opens it (both views' year tables are compared cell by cell)
        const press = SIMPLE_PRESS[step];
        if (opened && press) {
          await waitQuiet(page);   // the button is drawn once the run has landed
          const b = page.locator(press).first();
          if (await b.isVisible().catch(() => false) && (await b.getAttribute('aria-expanded')) !== 'true') await b.click();
        }
        await readPage(page, out, 'simple', step, opened);
      }

      await openFull(page);
      // the full view opens on its stage's tab once the plan is read (under the busy mark): a press before then is undone by it
      await waitQuiet(page);
      for (const p of FULL_PAGES) {
        const opened = await fullTab(page, p);
        if (opened && p.press) {
          const run = page.locator(p.press).first();
          if (await run.isVisible().catch(() => false)) await run.click();
        }
        await readPage(page, out, 'full', p.name, opened);
      }

      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(join(OUT_DIR, `${fx.key}.json`), JSON.stringify(out, null, 1) + '\n');
      expect(out.pages.some((p) => p.view === 'simple' && p.opened), 'the simple view opened the plan').toBe(true);
      expect(out.pages.some((p) => p.view === 'full' && p.opened), 'the full view opened the plan').toBe(true);
    });
  }
});

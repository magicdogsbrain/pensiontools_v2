/**
 * The sweep (lead4.md section 2, G3): for every fixture, in each view, every page and tab opened, the page let finish
 * (no busy mark, its text still), and every mark read. Nothing here judges wording or holds an expected figure: the run's
 * results are compared with each other by e2e/parity/gate.js, totalled by scripts/e2e-parity.mjs.
 *
 * Each fixture writes test-results/parity/fixtures/<key>.json. A page a stage does not offer (the simple view sends the
 * address elsewhere; the full view hides the tab) is recorded as not opened, a press whose button is not there as not
 * pressed, a page that did not settle as not quiet: the gate holds every page that opened before (e2e/parity/coverage.json)
 * and fails on a page read before it settled, so a page that stops opening cannot quietly lower the counts.
 *
 * PARITY_TEXT=1 also writes each page's text to test-results/parity/text/<fixture>/<view>-<page>.txt (to find figures).
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES, PARITY_TODAY } from './fixtures/plans.js';
import { seedFixture } from './fixtures/seed.js';
import { collectMarks, waitQuiet } from './collect.js';
import { readingsFor } from './readings.js';
import { entryOf, canonOf } from './fields.js';
import { at, signIn, openSimple, openFull, closeNews } from '../scenarios/routes.js';
import { wordsOf, SIMPLE_PAGES, SIMPLE_PRESS, FULL_PAGES, fullTab, fullLocked, pressesOf } from './pages.js';

export { SIMPLE_PAGES, SIMPLE_PRESS, FULL_PAGES };

export const OUT_DIR = join(process.cwd(), 'test-results', 'parity', 'fixtures');
const TEXT_DIR = join(process.cwd(), 'test-results', 'parity', 'text');

const only = process.env.PARITY_FIXTURE ? process.env.PARITY_FIXTURE.split(',').map((s) => s.trim()).filter(Boolean) : null;
const noon = (iso) => { const d = new Date(iso); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); };

async function readPage(page, out, view, name, opened, { pressed, words } = {}) {
  const key = `${view}:${name || 'home'}`;
  const quiet = opened ? await waitQuiet(page) : true;
  out.pages.push({ view, page: name || 'home', opened, quiet, ...(pressed === undefined ? {} : { pressed }) });
  if (!opened) return;
  const got = await page.evaluate(collectMarks, words);
  if (process.env.PARITY_TEXT) {
    const dir = join(TEXT_DIR, out.fixture);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${view}-${(name || 'home').replace(/[^a-z0-9]+/gi, '-')}.txt`), await page.evaluate(() => document.body.innerText));
  }
  for (const p of got.places) out.places.push({ view, page: name || 'home', ...p });
  for (const c of got.cells) out.cells.push({ view, page: name || 'home', ...c });
  // only boxes of the field table count (src/reading/fields.js, e2e/parity/fields.js), each as one quantity both views compare
  for (const f of got.fields) if (entryOf(f.field)?.kind === 'box') out.fields.push({ view, page: name || 'home', field: f.field, value: canonOf(f.field, view, f.value), shown: f.value });
  out.unmarked[key] = got.unmarked;
  out.samples[key] = got.samples;
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
      const words = wordsOf(subject, noon(PARITY_TODAY));
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
        const presses = SIMPLE_PRESS[step] ? [].concat(SIMPLE_PRESS[step]) : [];
        let pressed;
        for (const [i, press] of (opened ? presses : []).entries()) {
          await waitQuiet(page);   // the button is drawn once the run has landed
          const b = page.locator(press).first();
          const shown = await b.isVisible().catch(() => false);
          if (i === 0) pressed = shown;   // the page's press, as the floor counts it: the first
          if (shown && (await b.getAttribute('aria-expanded')) !== 'true') await b.click();
        }
        await readPage(page, out, 'simple', step, opened, { pressed, words });
      }

      await openFull(page);
      // the full view opens on its stage's tab once the plan is read (under the busy mark): a press before then is undone by it
      out.pages.push({ view: 'full', page: '(opening)', opened: true, quiet: await waitQuiet(page) });
      for (const p of FULL_PAGES) {
        const opened = await fullTab(page, p);
        let pressed;
        if (opened && p.press && (!p.onlyLocked || await fullLocked(page))) {
          for (const [i, press] of pressesOf(p.press).entries()) {
            if (i > 0) await waitQuiet(page);   // the next button is drawn once the run before has landed
            const run = page.locator(press).first();
            const shown = await run.isVisible().catch(() => false);
            if (i === 0) pressed = shown;   // the page's press, as the floor counts it: the first
            if (shown) await run.click();
          }
        }
        if (opened && p.openFolds) { await waitQuiet(page); await page.evaluate((sel) => { for (const d of document.querySelectorAll(sel + ' details')) d.open = true; }, p.openFolds); }
        await readPage(page, out, 'full', p.name, opened, { pressed, words });
      }

      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(join(OUT_DIR, `${fx.key}.json`), JSON.stringify(out, null, 1) + '\n');
      expect(out.pages.some((p) => p.view === 'simple' && p.opened), 'the simple view opened the plan').toBe(true);
      expect(out.pages.some((p) => p.view === 'full' && p.opened), 'the full view opened the plan').toBe(true);
    });
  }
});

/**
 * The pictures (test plan 8.1, 8.2). 25 in all, full page, at the sizes of the table below, in Chromium only.
 *
 * Until the owner has seen the screens on a real phone and approved a first set, the pictures are MADE and
 * attached to the run (test-results/screens/ — the run's output folder — and the HTML report), never compared: the gate is off. Switching it
 * on is SCREENS_GATE=1 in the environment of a run that has approved baselines beside this file
 * (e2e/screens.spec.js-snapshots/, made by the "Approve screenshots" workflow — never on a Mac, whose
 * typefaces differ from the CI machine's). `npm run e2e:approve` (--update-snapshots) writes baselines and
 * so compares too.
 *
 * Every picture is of a NAMED STATE, drawn through window.__pt with the date pinned: the same figures every
 * time, nothing typed, nothing waited for. The two states that are only an address (the front door and the
 * blank numbers screen) are drawn from the address while the named states are not there yet.
 */
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, drawState, readState, namedStates, BUILT } from './helpers/app.js';

const GATE = process.env.SCREENS_GATE === '1';

// Which named state, at which widths (test plan 8.1). `rail-open` is answer-F1 with the phone rail list pulled up.
const PICTURES = [
  { name: 'front-door',                widths: [390, 744, 1024, 1440], hash: '#/' },
  { name: 'numbers-blank',             widths: [390, 744, 1024, 1440], hash: '#/c/numbers' },
  { name: 'numbers-couple-open',       widths: [390, 744, 1440] },
  { name: 'answer-F1',                 widths: [390, 744, 1024, 1440] },
  { name: 'answer-F2',                 widths: [390, 744, 1440] },
  { name: 'answer-F3',                 widths: [390, 744, 1440] },
  { name: 'answer-assumed-open',       widths: [390, 1440] },
  { name: 'answer-nothing',            widths: [390] },
  { name: 'rail-open',                 widths: [390], from: 'answer-F1', change: (s) => ({ ...s, ui: { ...s.ui, railOpen: true } }) }
];
const TOTAL = PICTURES.reduce((n, p) => n + p.widths.length, 0);

test('there are 25 pictures in the plan', () => { expect(TOTAL).toBe(25); });

test.describe('pictures', () => {
  for (const picture of PICTURES) {
    test(picture.name, async ({ page }, testInfo) => {
      const width = page.viewportSize().width;
      test.skip(!picture.widths.includes(width), `not taken at ${width}`);
      const COMPARE = GATE || ['all', 'changed'].includes(testInfo.config.updateSnapshots);
      const app = v7(page, 'test');
      const source = picture.from || picture.name;
      const named = namedStates().includes(source);

      if (named) {
        waitsFor('hooks', 'screens');
        await app.open('#/');
        const state = picture.change ? picture.change(readState(source)) : readState(source);
        await drawState(page, state);
      } else if (picture.hash) {
        await app.open(picture.hash);
        await app.ready();
        testInfo.annotations.push({ type: 'drawn from the address', description: `the named state ${source} is not there yet (package 4)` });
      } else {
        waitsFor('states', 'hooks', 'screens');
      }
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      // The shell puts the cursor on the main heading after a move; a picture is of the screen, not of the cursor.
      await page.evaluate(() => { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); });

      const file = `${picture.name}-${width}.png`;
      const shot = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
      const out = join(testInfo.project.outputDir, 'screens');
      mkdirSync(out, { recursive: true });
      const path = testInfo.outputPath(file);
      await testInfo.attach(file, { body: shot, contentType: 'image/png' });
      writeFileSync(path, shot);
      copyFileSync(path, join(out, file));

      if (COMPARE) await expect(page).toHaveScreenshot(file, { fullPage: true });
      else testInfo.annotations.push({ type: 'picture made, not compared', description: 'SCREENS_GATE is off until the owner approves a first set' });
      expect(BUILT).toBeTruthy();
    });
  }
});

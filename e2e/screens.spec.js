/**
 * The pictures (test plan 8.1, 8.2; step 4: test plan A–B 11.4). C's 25 (and 4 of still paying in, 1 Oct 2026) and
 * A's and B's 36 — 65 in all, full
 * page, at the sizes of the tables below, in Chromium only. A's and B's are of their named states
 * (tests/v7/states/a, b — step 4 P5); until those exist the pictures are skipped with the reason.
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
import { test, expect, v7, waitsFor, drawState, readState, namedStates, NEEDS, BUILT } from './helpers/app.js';

const GATE = process.env.SCREENS_GATE === '1';

/**
 * Take one picture: attached to the run and copied to test-results/screens/; compared with its approved baseline
 * only when the gate is on (or baselines are being written). The ONE place a picture is compared.
 */
async function shoot(page, testInfo, file, COMPARE) {
  const shot = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
  const out = join(testInfo.project.outputDir, 'screens');
  mkdirSync(out, { recursive: true });
  const path = testInfo.outputPath(file);
  await testInfo.attach(file, { body: shot, contentType: 'image/png' });
  writeFileSync(path, shot);
  copyFileSync(path, join(out, file));
  if (COMPARE) await expect(page).toHaveScreenshot(file, { fullPage: true });
  else testInfo.annotations.push({ type: 'picture made, not compared', description: 'SCREENS_GATE is off until the owner approves a first set' });
}

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
  { name: 'rail-open',                 widths: [390], from: 'answer-F1', change: (s) => ({ ...s, ui: { ...s.ui, railOpen: true } }) },
  // Still paying in (the owner's 55-year-old, 1 Oct 2026): C's first form with "Yes" open, and the answer from 67.
  { name: 'numbers-paying-in',         widths: [390, 1440] },
  { name: 'answer-paying-in',          widths: [390, 1440] }
];

// Step 4: A's and B's pictures (test plan A–B 11.4 with the brief's state names, 4.13). Taken from the named states
// only. "A before the State Pension" is part of A's answer step now (brief conflict 41): the A2 couple's answer shows
// it, so that row of the plan's table is the A2 picture — 36 pictures, as the brief counts them.
const PICTURES_AB = [
  { q: 'a', name: 'numbers-blank',          widths: [390, 744, 1440] },
  { q: 'a', name: 'numbers-couple-open',    widths: [390, 1440] },
  { q: 'a', name: 'answer-A1',              widths: [390, 744, 1024, 1440] },
  { q: 'a', name: 'answer-A2-couple',       widths: [390, 744, 1440] },
  { q: 'a', name: 'answer-A4',              widths: [390, 1440] },
  { q: 'a', name: 'answer-stop-now',        widths: [390] },
  { q: 'a', name: 'ages-A1',                widths: [390, 744, 1440] },
  { q: 'a', name: 'answer-yes',             widths: [390, 1440] },
  { q: 'a', name: 'answer-A3-part-time',    widths: [390, 1440] },
  { q: 'a', name: 'answer-partial',         widths: [390] },
  { q: 'b', name: 'numbers-level',          widths: [390, 1440] },
  { q: 'b', name: 'answer-B1',              widths: [390, 744, 1024, 1440] },
  { q: 'b', name: 'answer-have',            widths: [390] },
  { q: 'b', name: 'answer-B5-couple',       widths: [390, 1440] },
  { q: 'b', name: 'choices-B1',             widths: [390, 744, 1440] },
  { q: 'b', name: 'choices-on-course',      widths: [390] }
];
const TOTAL = PICTURES.reduce((n, p) => n + p.widths.length, 0);
const TOTAL_AB = PICTURES_AB.reduce((n, p) => n + p.widths.length, 0);

test('there are 29 pictures of C in the plan (25, and 4 of still paying in), and 36 of A and B (65 in all)', () => {
  expect(TOTAL).toBe(29);
  expect(TOTAL_AB).toBe(36);
  expect(TOTAL + TOTAL_AB).toBe(65);
});

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

      await shoot(page, testInfo, `${picture.name}-${width}.png`, COMPARE);
      expect(BUILT).toBeTruthy();
    });
  }
});

test.describe('pictures of A and B', () => {
  for (const picture of PICTURES_AB) {
    test(`${picture.q}/${picture.name}`, async ({ page }, testInfo) => {
      const width = page.viewportSize().width;
      test.skip(!picture.widths.includes(width), `not taken at ${width}`);
      waitsFor('hooks', ...NEEDS[picture.q], `${picture.q}States`);
      test.skip(!namedStates(picture.q).includes(picture.name), `Not run yet — waits for the named state tests/v7/states/${picture.q}/${picture.name}.json (step 4 P5)`);
      const COMPARE = GATE || ['all', 'changed'].includes(testInfo.config.updateSnapshots);
      const app = v7(page, 'test', picture.q);
      await app.open('#/');
      await drawState(page, readState(picture.name, picture.q));
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.evaluate(() => { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); });

      await shoot(page, testInfo, `${picture.q}-${picture.name}-${width}.png`, COMPARE);
    });
  }
});

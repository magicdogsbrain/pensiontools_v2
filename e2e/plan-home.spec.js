/**
 * A plan's home (7.3.0; research/v7/one-product-design.md "The plan home"; research/v7/mockups/first-visit.html screen 4),
 * in the PUBLISHED build, without an account: fictional plans from the corpus (Sam's locked Buckets plan, Sam's plan locked
 * while saving, Alex's retired draft) planted in this window, at the fixed clock (30 September 2026).
 *
 *  - the sections in order: the plan's line and stage, the strip, To do, the year and where you are (side by side on a wide
 *    screen, stacked on a phone), the tools, then the steps, "Change the plan · Try something" and the questions, folded;
 *  - no rail and no box on the home; no "Not done yet" anywhere on a locked plan, its rail included;
 *  - the folds open when asked; the year's twelve months; "Not now" slides the to-do away and the nothing-due line says when;
 *  - with less motion asked for, the page ends on the very same frame (the figures, the bars, the dot);
 *  - "Does it last?": the working spinner shows, then the verdict;
 *  - the plans stored in the window are byte-identical afterwards: the home writes nothing.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH } from './helpers/app.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const T = 'plan.home';
const v7 = (hash) => PROD + V7_PATH + hash;
const load = (f) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', f), 'utf8'));
const planted = (f, id, name) => { const p = load(f); p.id = id; p.planDetails = { ...(p.planDetails || {}), name }; delete p.household; p.isActive = false; return p; };

const DRAWING = 'HomeBuckets04';
const SAVER = 'HomeSaver05';
const DRAFT = 'HomeDraft02';

async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const plans = () => [planted('04-buckets-running.json', DRAWING, 'Sam’s plan'), planted('05-saver-committed.json', SAVER, 'Sam saving'), planted('02-pnv-draft.json', DRAFT, 'Alex’s plan')];
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);

test.describe('a plan\'s home', () => {
  test('a locked drawing plan: the sections in order, no rail or box, no "Not done yet", the folds, the year, "Not now"; nothing written', async ({ page }, testInfo) => {
    const before = await plant(page, plans());
    await page.goto(v7('#/plan/' + DRAWING));
    const home = page.getByTestId(T);
    await expect(home).toBeVisible();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan');
    await expect(page.locator('[data-region="rail"]')).toHaveCount(0);
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId(`${T}.headline`)).toHaveText('Drawing.');
    await expect(page.getByTestId('plan.stageLine')).toContainText('Retired. Living on the plan.');

    await test.step('the sections, top to bottom', async () => {
      const ids = [`${T}.strip`, `${T}.todo`, `${T}.year`, `${T}.where`, `${T}.tools`, `${T}.steps`, `${T}.change`, `${T}.ask`];
      const tops = [];
      for (const id of ids) { const b = await page.getByTestId(id).boundingBox(); tops.push([id, b]); }
      const at = Object.fromEntries(tops);
      expect(at[`${T}.strip`].y).toBeLessThan(at[`${T}.todo`].y);
      expect(at[`${T}.todo`].y).toBeLessThan(at[`${T}.year`].y);
      expect(at[`${T}.year`].y).toBeLessThan(at[`${T}.tools`].y);
      expect(at[`${T}.where`].y).toBeLessThan(at[`${T}.tools`].y);
      expect(at[`${T}.tools`].y).toBeLessThan(at[`${T}.steps`].y);
      expect(at[`${T}.steps`].y).toBeLessThan(at[`${T}.change`].y);
      expect(at[`${T}.change`].y).toBeLessThan(at[`${T}.ask`].y);
      // the year and where you are side by side on a wide screen, stacked on a phone
      if (testInfo.project.name === 'desktop-1440') {
        expect(at[`${T}.where`].x).toBeGreaterThan(at[`${T}.year`].x + at[`${T}.year`].width - 1);
        expect(Math.abs(at[`${T}.where`].y - at[`${T}.year`].y)).toBeLessThan(4);
      } else expect(at[`${T}.where`].y).toBeGreaterThanOrEqual(at[`${T}.year`].y + at[`${T}.year`].height - 1);
      // no page wider than the screen
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    await test.step('no "Not done yet" on a locked plan, here or on its rail', async () => {
      await expect(home).not.toContainText('Not done yet');
      await page.goto(v7('#/plan/' + DRAWING + '/plan'));
      await expect(page.locator('[data-region="rail"]')).toBeVisible();
      expect(await page.locator('[data-region="rail"]').textContent()).not.toContain('Not done yet');
      await expect(page.getByTestId('rail.home')).toHaveAttribute('href', '#/plan/' + DRAWING);
      await expect(page.locator('[data-testid^="rail.ask."]')).toHaveCount(0);
      await page.goto(v7('#/plan/' + DRAWING));
      await expect(page.getByTestId(T)).toBeVisible();
    });

    await test.step('the folds are closed until asked; the year has twelve months, the six recorded drawn', async () => {
      for (const id of [`${T}.steps`, `${T}.change`, `${T}.ask`]) await expect(page.getByTestId(id)).not.toHaveAttribute('open', /.*/);
      await expect(page.getByTestId(`${T}.step.plan`)).toBeHidden();
      await page.getByTestId(`${T}.steps`).locator('summary').click();
      await expect(page.getByTestId(`${T}.step.plan`)).toBeVisible();
      await page.getByTestId(`${T}.change`).locator('summary').click();
      await expect(page.getByTestId(`${T}.change.tryChange`)).toBeVisible();
      const cells = page.getByTestId(`${T}.year`).locator('.year-cell');
      await expect(cells).toHaveCount(12);
      await expect(page.getByTestId(`${T}.year`).locator('.year-cell[data-state="recorded"]')).toHaveCount(6);
      await expect(page.getByTestId(`${T}.year`).locator('.year-cell[data-state="recorded"] .year-bar')).toHaveCount(6);
    });

    await test.step('"Not now" slides the to-do away; nothing is due, and the line says until when', async () => {
      await expect(page.getByTestId(`${T}.todo`).locator('.home-item')).toHaveCount(1);
      await page.getByTestId(`${T}.notNow.hold.stale`).click();
      await expect(page.getByTestId(`${T}.todo`).locator('.home-item')).toHaveCount(0);
      await expect(page.getByTestId(`${T}.quiet`)).toHaveText('September is recorded. Nothing is due until 1 October.');
      // kept for the window: a reload reads the same
      await page.reload();
      await expect(page.getByTestId(`${T}.quiet`)).toHaveText('September is recorded. Nothing is due until 1 October.');
    });

    expect(await stored(page), 'the home writes nothing').toBe(before);
  });

  test('a plan locked while saving: the home, not the check-in form; its to-do first; no "For later" marks', async ({ page }) => {
    const before = await plant(page, plans());
    await page.goto(v7('#/plan/' + SAVER));
    await expect(page.getByTestId(T)).toBeVisible();
    await expect(page.locator('#app form')).toHaveCount(0);
    await expect(page.getByTestId(`${T}.headline`)).toHaveText('Saving. You stop work in February 2038.');
    await expect(page.getByTestId(`${T}.quiet`)).toHaveText('September’s pot is recorded. Nothing is due until 1 October.');
    await page.getByTestId(`${T}.steps`).locator('summary').click();
    await expect(page.getByTestId(`${T}.steps`)).not.toContainText('For later');
    await expect(page.getByTestId(`${T}.steps`)).not.toContainText('Not done yet');
    expect(await stored(page)).toBe(before);
  });

  test('a ladder recording its months while short of its rungs (7.3.1): Drawing; the share held said under "Where you are", the move one link away, no move to-do; nothing written', async ({ page }, testInfo) => {
    const LADDER = 'HomeLadder03';
    const before = await plant(page, [planted('20-locked-start-after-stop.json', LADDER, 'Sam’s ladder'), ...plans()]);
    await page.goto(v7('#/plan/' + LADDER));
    await expect(page.getByTestId(T)).toBeVisible();
    await expect(page.getByTestId(`${T}.headline`)).toHaveText('Drawing.');
    await expect(page.getByTestId(`${T}.strip`).locator('[aria-current="step"]')).toHaveAttribute('data-stage', 'drawing');
    await expect(page.locator('[data-todo="move.next"], [data-todo="move.finish"]')).toHaveCount(0);
    const note = page.getByTestId(`${T}.heldMix`);
    await expect(note).toBeVisible();
    const pct = await note.getAttribute('data-pct');
    await expect(note.locator('p.note')).toHaveText(new RegExp(`^You hold about ${pct}% of your plan’s mix\\. Different from the plan: .+ and \\d+ more\\.$`));
    // inside "Where you are", under its lines; the move tool says the same share, by the mix's name
    await expect(page.getByTestId(`${T}.where`).getByTestId(`${T}.heldMix`)).toHaveCount(1);
    await expect(page.getByTestId(`${T}.tool.move`)).toHaveText(`Your plan’s mix · about ${pct}% held`);
    // the link on a line of its own, below the whole sentence (at 390 a link is a full-height target: inside the sentence it
    // pushed its own line apart from the rest)
    const sentence = await note.locator('p.note').boundingBox();
    const link = await page.getByTestId(`${T}.heldMix.move`).boundingBox();
    expect(link.y).toBeGreaterThanOrEqual(sentence.y + sentence.height - 1);
    // the strip never says "Moving · done" beside that note; "Moving" is said nowhere else on a Drawing home
    await expect(page.getByTestId(`${T}.strip`).locator('[data-stage="moving"]')).toHaveAttribute('data-state', 'part');
    await expect(page.getByTestId(`${T}.strip`).locator('[data-stage="moving"]')).toHaveText('Moving');
    for (const id of [`${T}.todo`, `${T}.where`, `${T}.tools`, `${T}.steps`]) await expect(page.getByTestId(id)).not.toContainText('Moving');
    await expect(page.getByTestId(`${T}.step.move`)).toHaveText('Your plan’s mix');
    // no page wider than the screen, at either width; on a wide screen the year and where you are still sit side by side
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (testInfo.project.name === 'desktop-1440') {
      const y = await page.getByTestId(`${T}.year`).boundingBox();
      const w = await page.getByTestId(`${T}.where`).boundingBox();
      expect(w.x).toBeGreaterThan(y.x + y.width - 1);
    }
    // the rail on a step page never names a move as Next on a Drawing plan
    await page.goto(v7('#/plan/' + LADDER + '/plan'));
    await expect(page.getByTestId('rail.next')).toBeAttached();
    await expect(page.getByTestId('rail.next')).not.toContainText('to your plan’s mix');
    // the link opens the move, whose own status says the very same share
    await page.goto(v7('#/plan/' + LADDER));
    await page.getByTestId(`${T}.heldMix.move`).click();
    await expect(page.getByTestId('plan.move.status.line')).toContainText(`${pct}% of the plan’s mix held`);
    // headed by the name the home gave it
    await expect(page.getByTestId('plan.step.move')).toHaveText('Your plan’s mix');
    expect(await stored(page), 'the home writes nothing').toBe(before);
  });

  test('less motion asked for: the very same final frame — the figures, the bars and the dot', async ({ browser }, testInfo) => {
    const open = async (reducedMotion) => {
      const context = await browser.newContext({ viewport: testInfo.project.use.viewport, reducedMotion });
      const page = await context.newPage();
      await page.route(/^(?!http:\/\/127\.0\.0\.1)/, (r) => r.abort());
      await plant(page, plans());
      await page.goto(v7('#/plan/' + DRAWING));
      await expect(page.getByTestId(T)).toBeVisible();
      return { context, page };
    };
    // every movement is CSS (done when its animations are) or the figures' count (done when the text stands at its value)
    const frame = (page) => page.evaluate(async () => {
      await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => null)));
      return {
        text: document.querySelector('[data-testid="plan.home"]').innerText,
        // the identity matrix (an animation ended at scale 1) and no transform draw the same picture
        bars: [...document.querySelectorAll('.year-bar')].map((b) => { const t = getComputedStyle(b).transform; return t === 'matrix(1, 0, 0, 1, 0, 0)' ? 'none' : t; }),
        dot: (() => { const d = document.querySelector('.strip-dot'); return d ? getComputedStyle(d).left : null; })()
      };
    });
    const a = await open('reduce');
    const still = await frame(a.page);
    await a.context.close();
    const b = await open('no-preference');
    await expect.poll(async () => (await frame(b.page)).text, { timeout: 5_000 }).toBe(still.text);
    const moving = await frame(b.page);
    await b.context.close();
    expect(moving.dot).toBe(still.dot);
    expect(moving.bars).toEqual(still.bars);
    for (const t of still.bars) expect(t).toBe('none');
  });

  test('"Does it last?": the working spinner shows, then the verdict', async ({ page }) => {
    test.setTimeout(180_000);
    await plant(page, plans());
    await page.goto(v7('#/plan/' + DRAFT + '/lasts'));
    const ring = page.getByTestId('plan.lasts.working').locator('.run-ring');
    await expect(ring).toBeVisible({ timeout: 30_000 });
    await expect(ring.locator('.run-ring-bar')).toHaveCount(24);
    await expect(page.getByTestId('plan.lasts.result')).toBeVisible({ timeout: 150_000 });
    await expect(page.getByTestId('plan.lasts.working')).toHaveCount(0);
  });
});

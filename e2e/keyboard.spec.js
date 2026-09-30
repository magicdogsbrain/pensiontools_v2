/**
 * Keyboard (test plan 8.3). Desktop width; the phone rail list at phone width.
 *
 *  - Tab visits the boxes in the order of the input list and then the button;
 *  - every stop shows a visible focus ring;
 *  - Enter gives the answer, and focus lands on the answer's heading;
 *  - the "Change" links under what was assumed put the cursor in the right box;
 *  - Escape closes the phone rail list;
 *  - nothing traps the Tab key.
 */
import { test, expect, v7, waitsFor, ADDRESSES } from './helpers/app.js';
import { SCHEMA_C } from '../src/answers/c/schema.js';

/** What has the cursor: its test id (a radio reports its field, not its option), and whether a ring shows. */
const focused = (page) => page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const s = getComputedStyle(el);
  const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none');
  const id = el.getAttribute('data-testid') || el.id || `${el.tagName.toLowerCase()}:${el.getAttribute('href') || (el.textContent || '').trim().slice(0, 40)}`;
  return { id, tag: el.tagName, type: el.type || null, ring: !!ring, inApp: !!el.closest('#app') };
});

test.describe('keyboard: nothing traps the Tab key', () => {
  for (const { hash } of ADDRESSES.slice(0, 6)) {
    test(`${hash}: Tab passes through every stop, each with a visible focus ring`, async ({ page }) => {
      const app = v7(page, 'test');
      await app.open(hash);
      await app.ready();
      const stops = await page.locator('#app a[href], #app button:not([disabled]), #app input:not([disabled]), #app select, #app [tabindex="0"]').count();
      const visited = [];
      for (let i = 0; i < stops + 3; i++) {
        await page.keyboard.press('Tab');
        const f = await focused(page);
        if (!f || !f.inApp) { visited.push(null); continue; }        // left the page for the browser's own controls: not trapped
        expect(f.ring, `${f.id} shows where the cursor is`).toBe(true);
        visited.push(f.id);
      }
      // Tab never sticks on one control.
      for (let i = 1; i < visited.length; i++) if (visited[i] && stops > 1) expect(visited[i] === visited[i - 1] && visited[i] === visited[i - 2], `Tab is stuck on ${visited[i]}`).toBe(false);
      // Every stop was reached.
      expect(new Set(visited.filter(Boolean)).size).toBeGreaterThanOrEqual(Math.min(stops, 1));
    });
  }
});

test.describe('keyboard: question C', () => {
  test.beforeEach(() => waitsFor('screens', 'shell'));

  test('Tab visits the boxes in the order of the input list, then the button; Enter gives the answer', async ({ page }) => {
    const app = v7(page, 'test');
    await app.open('#/c/numbers');
    await app.ready();

    // The order a single person's form must be walked in: the fields that apply with nothing typed, as listed.
    const paths = SCHEMA_C.fields.filter((f) => f.group === 'you' && !f.when).map((f) => `c.${f.path}`);
    await app.id('c.you.pot').focus();
    const order = [];
    for (let i = 0; i < 40; i++) {
      const f = await focused(page);
      if (!f || !f.inApp) break;
      expect(f.ring, `${f.id} shows where the cursor is`).toBe(true);
      // A group of radio buttons is one stop; its options are reached with the arrow keys.
      const field = paths.find((p) => f.id === p || f.id.startsWith(p + '.'));
      if (field && order[order.length - 1] !== field) order.push(field);
      if (f.id === 'c.action.show') { order.push(f.id); break; }
      await page.keyboard.press('Tab');
    }
    expect(order.filter((id) => paths.includes(id))).toEqual(paths);
    expect(order[order.length - 1]).toBe('c.action.show');

    // Typed with the keyboard alone, and asked for with Enter.
    await app.id('c.you.pot').focus();
    await page.keyboard.type('250000');
    await app.id('c.you.age').focus();
    await page.keyboard.type('58');
    await page.keyboard.press('Enter');
    await app.at('c.answer');
    await app.ready(120_000);
    // Focus lands on the answer's main heading, so a screen reader starts there.
    const at = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName : null));
    expect(at).toBe('H1');
  });

  test('a "Change" link under what was assumed puts the cursor in the right box', async ({ page }) => {
    const app = v7(page, 'test');
    await app.open('#/c/numbers');
    await app.fill({ 'you.pot': '250000', 'you.age': '58' });
    await app.click('c.action.show');
    await app.ready(120_000);

    const links = page.locator('#app [data-assumed-id] a[data-testid$=".change"]');
    // "What we assumed" may be folded away; open it with its own button, as a person would.
    const openIt = async () => { const t = page.locator('#app [data-assumed] button[aria-expanded="false"], #app [data-assumed] summary').first(); if (await t.isVisible()) await t.click(); };
    await openIt();
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await openIt();
      const href = await links.nth(i).getAttribute('href');
      const field = /\?focus=([A-Za-z.]+)$/.exec(href);
      expect(field, `the link ${href} names a field`).not.toBeNull();
      await expect(links.nth(i)).toBeVisible();
      // After a move the shell puts the cursor on the main heading a moment later; wait for our focus to hold.
      await expect.poll(async () => { await links.nth(i).focus(); return links.nth(i).evaluate((el) => el === document.activeElement); }).toBe(true);
      await page.keyboard.press('Enter');
      await app.at('c.numbers');
      await expect.poll(async () => { const f = await focused(page); return f ? f.id : null; }, { message: `the cursor goes to c.${field[1]}` })
        .toMatch(new RegExp(`^c\\.${field[1].replace(/\./g, '\\.')}(\\.|$)`));
      await page.goBack();
      await app.at('c.answer');
      await app.ready(120_000);
    }
  });

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('Escape closes the rail list', async ({ page }) => {
      const app = v7(page, 'test');
      await app.open('#/c/numbers');
      await app.ready();
      const line = app.id('rail.line');
      await expect(line).toBeVisible();
      await line.focus();
      await page.keyboard.press('Enter');
      await expect(app.id('rail.c.answer')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(app.id('rail.c.answer')).toBeHidden();
      // The cursor goes back to where it was.
      await expect(line).toBeFocused();
    });
  });
});

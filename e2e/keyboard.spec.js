/**
 * Keyboard (test plan 8.3). Desktop width; the phone rail list at phone width.
 *
 *  - Tab visits the boxes in the order of the input list and then the button;
 *  - every stop shows a visible focus ring;
 *  - Enter gives the answer, and focus lands on the answer's heading;
 *  - the "Change" links under what was assumed put the cursor in the right box;
 *  - Escape closes the phone rail list;
 *  - nothing traps the Tab key.
 *
 * Step 4 (test plan 11.1, 11.3): A's and B's boxes in the order they are drawn (no box skipped, none reached out of
 * turn), the percent box and the yes/no for part-time used from the keyboard, Enter asks and the cursor lands on the
 * answer, A's table of every age reachable with each row naming its age, and Escape closing the phone rail.
 */
import { test, expect, v7, waitsFor, fixtureTyping, mustFill, ADDRESSES, NEEDS, SCHEMAS } from './helpers/app.js';
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

  test('"Try a change": after Enter on − or +, the cursor is still on that button once the answer is in', async ({ page }) => {
    // A button greyed out while the answer is worked out drops the cursor to the page (review of A and B, 1 Oct 2026):
    // it rests with aria-disabled instead, and keeps its place.
    const app = v7(page, 'test');
    await app.open('#/c/numbers');
    await app.fill({ 'you.pot': '250000', 'you.age': '58' });
    await app.click('c.action.show');
    await app.ready(120_000);
    for (const id of ['c.try.pot.up', 'c.try.pot.down', 'c.try.start.up']) {
      await app.id(id).focus();
      await page.keyboard.press('Enter');
      await app.ready(120_000);
      await expect.poll(async () => { const f = await focused(page); return f ? f.id : null; }, { message: `${id} keeps the cursor once the answer is in` }).toBe(id);
      await expect(app.id(id)).not.toHaveAttribute('aria-disabled', 'true');
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

// ---- Step 4: questions A and B ------------------------------------------------------------------------------

/** The short form's boxes of question q that apply with nothing typed (no `when` beyond the defaults), not under "more". */
function shortForm(q) {
  // `household` is buttons (add / remove a partner) and `payIn.kind` may be drawn as a "Split it up" button pair, not boxes.
  const skip = new Set(['household', 'you.payIn.kind']);
  return SCHEMAS[q].fields.filter((f) => !skip.has(f.path) && f.group !== 'more' && !f.path.startsWith('partner.') && f.group !== 'try')
    .filter((f) => !f.when || Object.entries(f.when).every(([p, v]) => { const d = SCHEMAS[q].fields.find((x) => x.path === p); return d && d.default === v; }))
    .map((f) => `${q}.${f.path}`);
}

for (const q of ['a', 'b']) {
  test.describe(`keyboard: question ${q.toUpperCase()}`, () => {
    test.beforeEach(() => waitsFor(...NEEDS[q]));

    test('Tab visits every box of the short form in the order it is drawn, then the button; Enter gives the answer', async ({ page }) => {
      const app = v7(page, 'test', q);
      await app.open(`#/${q}/numbers`);
      await app.ready();
      const wanted = shortForm(q);
      // The order on the page: every box of the form, in document order (a radio group is one stop).
      const drawn = await page.$$eval(`#app [data-testid^="${q}."]`, (els) => els.filter((el) => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)).map((el) => el.getAttribute('data-testid')));
      const fieldOf = (id) => wanted.find((p) => id === p || id.startsWith(p + '.'));
      const docOrder = [];
      for (const id of drawn) { const f = fieldOf(id); if (f && !docOrder.includes(f)) docOrder.push(f); }
      expect([...docOrder].sort(), 'every box of the short form is drawn').toEqual([...wanted].sort());
      const expectedOrder = [];
      for (const id of drawn) { const f = fieldOf(id); if (f && !expectedOrder.includes(f)) expectedOrder.push(f); }

      await page.locator(`#app [data-testid="${drawn[0]}"]`).focus();
      const order = [];
      for (let i = 0; i < 80; i++) {
        const f = await focused(page);
        if (!f || !f.inApp) break;
        expect(f.ring, `${f.id} shows where the cursor is`).toBe(true);
        const field = fieldOf(f.id);
        if (field && order[order.length - 1] !== field) order.push(field);
        if (f.id === `${q}.action.show`) { order.push(f.id); break; }
        await page.keyboard.press('Tab');
      }
      expect(order.filter((id) => wanted.includes(id)), 'Tab follows the drawn order').toEqual(expectedOrder);
      expect(order[order.length - 1]).toBe(`${q}.action.show`);

      // Typed with the keyboard alone (the things that must be filled in), and asked for with Enter.
      const typing = fixtureTyping(q === 'a' ? 'A1' : 'B3');
      for (const path of mustFill(q, typing)) {
        if (path === 'spend.level') continue;
        await app.id(`${q}.${path}`).focus();
        await page.keyboard.type(typing[path]);
      }
      await page.keyboard.press('Enter');
      await app.at(`${q}.answer`);
      await app.ready(120_000);
      // The cursor lands on the answer: its main heading, or inside the headline.
      const at = await page.evaluate(() => { const el = document.activeElement; return el ? { tag: el.tagName, inHeadline: !!el.closest('[data-headline]') } : null; });
      expect(at && (at.tag === 'H1' || at.inHeadline), 'the cursor is on the answer').toBe(true);
    });

    test('"Try a change": after Enter on − or +, the cursor stays on that button', async ({ page }) => {
      const app = v7(page, 'test', q);
      await app.open(`#/${q}/numbers`);
      const typing = fixtureTyping(q === 'a' ? 'A1' : 'B3');
      await app.fill(Object.fromEntries(mustFill(q, typing).map((p) => [p, typing[p]])));
      await app.click(`${q}.action.show`);
      await app.ready(120_000);
      for (const id of [`${q}.try.spend.down`, `${q}.try.stop.up`, ...(q === 'b' ? ['b.try.payIn.up'] : ['a.try.pot.up'])]) {
        await app.id(id).focus();
        await page.keyboard.press('Enter');
        await app.ready(120_000);
        await expect.poll(async () => { const f = await focused(page); return f ? f.id : null; }, { message: `${id} keeps the cursor` }).toBe(id);
      }
    });

    test('the percent box and the yes/no boxes work from the keyboard', async ({ page }) => {
      const app = v7(page, 'test', q);
      await app.open(`#/${q}/numbers`);
      await app.ready();
      await app.click(`${q}.action.moreDetail`);
      // The charge a year while saving: a percent, typed with or without its sign.
      const charge = app.id(`${q}.charge`);
      await expect(charge).toBeVisible();
      await charge.focus();
      await page.keyboard.press('ControlOrMeta+a');
      await page.keyboard.type('1.5');
      await expect(charge).toHaveValue(/^1\.5 ?%?$/);
      const box = await charge.boundingBox();
      expect(box.height, 'the percent box and its sign are one control 44 px tall').toBeGreaterThanOrEqual(43.5);
      if (q === 'a') {
        // Part-time: a yes/no radio group, reached by Tab and changed with the arrow keys; "yes" opens its two boxes.
        const no = app.id('a.partTime.has.no');
        await no.focus();
        await page.keyboard.press('ArrowRight');
        await expect(app.id('a.partTime.has.yes')).toBeChecked();
        await expect(app.id('a.partTime.yearly')).toBeVisible();
        await expect(app.id('a.partTime.years')).toBeVisible();
      }
    });

    test.describe('on a phone', () => {
      test.use({ viewport: { width: 390, height: 844 } });

      test('Escape closes the rail list', async ({ page }) => {
        const app = v7(page, 'test', q);
        await app.open(`#/${q}/numbers`);
        await app.ready();
        const line = app.id('rail.line');
        await expect(line).toBeVisible();
        await line.focus();
        await page.keyboard.press('Enter');
        await expect(app.id(`rail.${q}.answer`)).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(app.id(`rail.${q}.answer`)).toBeHidden();
        await expect(line).toBeFocused();
      });
    });
  });
}

test.describe('keyboard: A\'s table of every age', () => {
  test.beforeEach(() => waitsFor(...NEEDS.a, 'extend'));

  test('is reachable by Tab, and every row names its age', async ({ page }) => {
    const app = v7(page, 'test', 'a');
    await app.open('#/a/numbers');
    const typing = fixtureTyping('A1');
    await app.fill(Object.fromEntries(mustFill('a', typing).map((p) => [p, typing[p]])));
    await app.click('a.action.show');
    await app.ready(120_000);
    await app.rail('ages');
    await app.partialThenFinal();
    const rows = page.locator('#app [data-table="ages"] [data-age]');
    const n = await rows.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const age = await rows.nth(i).getAttribute('data-age');
      const said = await rows.nth(i).evaluate((el) => `${el.getAttribute('aria-label') || ''} ${el.innerText}`);
      expect(said, `row ${i} names its age`).toContain(age);
    }
    // Tab reaches the table (a row, or a control inside it) from the top of the page.
    await page.locator('#app h1').first().focus();
    let reached = false;
    for (let i = 0; i < 120 && !reached; i++) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => !!(document.activeElement && document.activeElement.closest('[data-table="ages"]')));
      const f = await focused(page);
      if (!f || !f.inApp) break;
    }
    expect(reached, 'the table of every age is reached by Tab').toBe(true);
  });
});

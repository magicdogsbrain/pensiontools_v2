/**
 * The crawl (test plan 7.4, 8.3; brief 2.4 line 57, section 7 line 8). The test build, at all four sizes.
 *
 *  1. Every address, opened directly as a first-time visitor: ready, the screen it should be, looked over
 *     (no rubbish, geometry, targets on a phone), and the accessibility rules with zero violations.
 *  2. Every named state at its own address (with the accessibility rules), and then at every address.
 *  3. V7 cannot change a plan: a LOCKED plan from the corpus is put where today's app keeps guest plans,
 *     every V7 address is visited and every link followed, and the stored text is byte-identical afterwards.
 *     The only thing V7 itself may store is its own draft, `pt_v7_draft`, in this tab.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, lookOver, axeProblems, checkScreenOnPage, notIgnored, namedStates, readState, drawState, ADDRESSES, BUILT, REPO } from './helpers/app.js';
import { parse, screenName } from '../src/v7/router/routes.js';

test.describe('every address, as a first-time visitor', () => {
  for (const { hash, screen } of ADDRESSES) {
    test(`${hash} opens, is sound and is accessible`, async ({ page }) => {
      const app = v7(page, 'test');
      await app.open(hash);
      await app.ready();
      expect(await app.screen()).toBe(screen);
      // Nothing demands another tool first: an address that needs figures asks for them in place.
      await app.check();
      expect(await axeProblems(page), 'accessibility (WCAG 2.1 A and AA)').toEqual([]);
      // The address is kept as given (or becomes the one for "not found"); no figure is ever put in it.
      expect(new URL(page.url()).hash).not.toMatch(/\d/);
    });
  }

  test('every link on every screen leads somewhere', async ({ page }) => {
    const app = v7(page, 'test');
    await app.open('#/');
    await app.ready();
    const seen = new Set();
    const queue = ADDRESSES.map((a) => a.hash);
    let followed = 0;
    while (queue.length && followed < 80) {
      const hash = queue.shift();
      if (seen.has(hash)) continue;
      seen.add(hash);
      followed += 1;
      await app.go(hash);
      await app.ready();
      const links = await page.locator('#app a[href]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      for (const href of links) {
        if (href.startsWith('#')) queue.push(href);
        else expect(href, `a link out of V7 on ${hash}`).toMatch(/^(\.\.\/|\/)(index\.html|privacy\.html)?(#.*)?$/);   // only ever to the current version
      }
    }
    // The front door offers every question; none is a dead link (L6).
    if (BUILT.screens) for (const q of ['a', 'b', 'd', 'e', 'f']) expect([...seen]).toContain(`#/soon/${q}`);
  });
});

test.describe('every named state', () => {
  test.beforeEach(() => waitsFor('hooks', 'states', 'screens'));

  for (const name of namedStates()) {
    test(`${name}: drawn at its own address — sound and accessible`, async ({ page }) => {
      const state = readState(name);
      const app = v7(page, 'test');
      await app.open('#/');
      await drawState(page, state);
      expect(await app.screen()).toBe(screenName(state.route));
      const problems = [...(await lookOver(page)), ...(await checkScreenOnPage(page))];
      expect(problems.filter(notIgnored), name).toEqual([]);
      expect(await axeProblems(page), `accessibility of ${name}`).toEqual([]);
    });

    test(`${name}: every address opens over it`, async ({ page }) => {
      const state = readState(name);
      const app = v7(page, 'test');
      await app.open('#/');
      for (const { hash, screen } of ADDRESSES) {
        await drawState(page, { ...state, route: parse(hash) });
        expect(await app.screen(), `${name} at ${hash}`).toBe(screen);
        const problems = [...(await lookOver(page)), ...(await checkScreenOnPage(page))];
        expect(problems.filter(notIgnored), `${name} at ${hash}`).toEqual([]);
      }
    });
  }
});

test.describe('V7 cannot change a plan', () => {
  // Where today's app keeps a guest's plans (src/firebase/FirestoreService.js GUEST_KEY) and the hand-off copy
  // (src/services/GuestMeter.js KEY_HANDOFF). V7 is on the same site, so the same tab sees both.
  const GUEST_KEY = 'pt_guest_scenarios';
  const HANDOFF_KEY = 'pt_guest_handoff';
  const OWN_KEY = 'pt_v7_draft';

  test('a locked plan in guest storage is byte-identical after every address is visited', async ({ page }) => {
    const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
    expect(plan.decisionTool, 'corpus plan 03 is the locked fixture').toBeTruthy();
    expect(plan.planDocument, 'corpus plan 03 carries a plan document').toBeTruthy();
    const stored = JSON.stringify([plan]);
    const handoff = JSON.stringify({ scenarios: [plan], at: '2026-09-30T08:00:00.000Z' });

    const app = v7(page, 'test');
    await app.open('#/');
    await app.ready();
    await page.evaluate(([gk, g, hk, h]) => { sessionStorage.setItem(gk, g); localStorage.setItem(hk, h); }, [GUEST_KEY, stored, HANDOFF_KEY, handoff]);
    // A fresh load: from here on, every storage write is V7's own (the test build counts them since load).
    await page.reload();
    await app.drawn();
    await app.ready();
    const before = await page.evaluate(() => ({ session: { ...sessionStorage }, local: { ...localStorage } }));
    expect(before.session[GUEST_KEY]).toBe(stored);

    // Every address, moved to inside the tab…
    for (const { hash } of ADDRESSES) { await app.go(hash); await app.ready(); }
    // …every address opened cold (a fresh load runs the start-up code again)…
    for (const { hash } of ADDRESSES) { await app.open(hash); await app.ready(); }
    // …and, once there are screens, the question used as a person would: figures typed, the answer asked for,
    // every rail link followed. This is where a draft is written.
    if (BUILT.screens && BUILT.shell) {
      await app.open('#/');
      await app.type('front.c.pot', '250000', { path: 'you.pot' });
      await app.click('front.c.show');
      await app.type('c.you.age', '58', { path: 'you.age' });
      await app.click('c.action.show');
      await app.ready(120_000);
      for (const step of ['numbers', 'answer', 'ways', 'keep']) { await app.rail(step); await page.goBack(); await app.drawn(); }
      await page.reload();
      await app.drawn();
      await app.ready(120_000);
    }

    const after = await page.evaluate(() => ({ session: { ...sessionStorage }, local: { ...localStorage } }));
    // Byte for byte.
    expect(after.session[GUEST_KEY] === stored, 'the guest plan text is byte-identical').toBe(true);
    expect(after.local[HANDOFF_KEY] === handoff, 'the hand-off copy is byte-identical').toBe(true);
    // Nothing else appeared or changed, except V7's own draft in this tab.
    const { [OWN_KEY]: own, ...sessionRest } = after.session;
    expect(sessionRest).toEqual(before.session);
    expect(after.local).toEqual(before.local);
    if (BUILT.screens && BUILT.shell) expect(typeof own, 'the draft is kept in this tab').toBe('string');
    // The draft holds what was typed and nothing of the plan.
    if (own) { expect(own).not.toContain('planDocument'); expect(own).not.toContain('decisionTool'); }

    // The test build counts every storage write since load: only V7's own key.
    if (BUILT.hooks) {
      const writes = await page.evaluate(() => window.__pt.writes());
      expect(Object.keys(writes).filter((k) => k !== OWN_KEY), 'storage keys written by V7').toEqual([]);
    }
  });
});

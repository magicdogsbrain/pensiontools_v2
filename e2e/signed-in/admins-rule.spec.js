/**
 * Who the administrator is (firestore.rules): an account is the administrator while a document admins/{its uid} exists.
 * The rules name no account, and no client may read or write admins/*, so nobody can make themselves an administrator;
 * a developer adds the document by hand in the Firebase console (compliance/GDPR_TODO.md, "Admin").
 *   - a signed-in, confirmed account that is not listed: refused the admin probe, the admin datasets' writes and the
 *     queue of fund suggestions, and refused writing (or reading) its own admins/ document;
 *   - the same account once listed: allowed all three; another account is still refused;
 *   - what every account may do is unchanged: its own plans, reading the admin datasets, filing its own suggestion.
 * Asked straight of the local Firestore emulator as each account (the real firestore.rules, a demo- project), so it needs
 * no page; it runs once, at desktop-1440.
 */
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, idTokenOf, makeAdmin, askAs, ALEX, SAM } from './emulator.js';

test.beforeEach(async ({}, testInfo) => {
  test.skip(!/desktop/.test(testInfo.project.name), 'the rules do not depend on the screen: one run is enough');
  await clearEmulators();
});

const SUGGESTION = (uid) => ({ ticker: 'VWRP', name: 'A world tracker', subClass: 'worldGrowth', uid, createdAt: '2026-09-30' });

test('an account is the administrator only while admins/{its uid} exists, and cannot list itself', async () => {
  const alex = await makeAccount(ALEX);
  const sam = await makeAccount(SAM);
  const alexToken = await idTokenOf(ALEX);
  const samToken = await idTokenOf(SAM);

  // not listed: no admin probe, no admin writes, no queue — and no way to list itself
  expect(await askAs(alexToken, 'GET', 'adminPrivate/access')).toBe(403);
  expect(await askAs(alexToken, 'PATCH', 'admin/fundCatalogue', { updatedAt: '2026-09-30' })).toBe(403);
  expect(await askAs(alexToken, 'GET', 'fundSuggestions')).toBe(403);
  expect(await askAs(alexToken, 'PATCH', `admins/${alex.uid}`, {})).toBe(403);
  expect(await askAs(alexToken, 'GET', `admins/${alex.uid}`)).toBe(403);

  // what every confirmed account may do is unchanged
  expect(await askAs(alexToken, 'PATCH', `users/${alex.uid}/scenarios/AlexPlanOne1`, { planDetails: { name: 'Alex’s plan' } })).toBe(200);
  expect(await askAs(alexToken, 'GET', `users/${sam.uid}/scenarios/AlexPlanOne1`)).toBe(403);
  expect(await askAs(alexToken, 'GET', 'admin/fundCatalogue')).toBe(404);   // allowed: nothing published yet
  expect(await askAs(samToken, 'PATCH', 'fundSuggestions/samSuggestion1', SUGGESTION(sam.uid))).toBe(200);

  // listed by hand (as in the console): Alex is the administrator; Sam is still not
  await makeAdmin(alex.uid);
  expect(await askAs(alexToken, 'GET', 'adminPrivate/access')).toBe(404);   // allowed: the probe succeeds, nothing set
  expect(await askAs(alexToken, 'PATCH', 'admin/fundCatalogue', { updatedAt: '2026-09-30' })).toBe(200);
  expect(await askAs(alexToken, 'GET', 'fundSuggestions')).toBe(200);
  expect(await askAs(alexToken, 'GET', `admins/${alex.uid}`)).toBe(403);     // even an administrator cannot read or change the list
  expect(await askAs(alexToken, 'PATCH', `admins/${sam.uid}`, {})).toBe(403);
  expect(await askAs(samToken, 'GET', 'adminPrivate/access')).toBe(403);
  expect(await askAs(samToken, 'PATCH', 'admin/fundCatalogue', { updatedAt: '2026-09-30' })).toBe(403);
});

/**
 * s00 · the harness checks itself (brief step 4). A fictional person asks a question that must fail, and the failure
 * reads as the brief's layout; a failed ask() fails its test; and two accounts made side by side never see each other,
 * on the page or through the emulator under the real rules.
 */
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { ask, failureText } from './ask.js';
import { accountFor, made, putPlan, idTokenOf, askAs, allAccounts } from './account.js';
import { at, openSimple, signIn } from './routes.js';
import { pence, shareOfPay, fromTakeHome } from './hand/money.js';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const PAT = { name: 'Pat', age: 52 };

test('a question that must fail reads as a person\'s sentence, in the brief\'s layout', async () => {
  let message = '';
  try {
    await ask(PAT, 'H0', { path: 'nowhere > a page that does not exist', who: 'guest', asked: 'what leaves Pat\'s pay' }, async (q) => {
      // Pat's 4% of £31,000, from take-home pay: 4% × 31,000 ÷ 12 = 103.33 going in; × 0.8 = 82.67
      const want = pence(fromTakeHome(shareOfPay(4, 31000)));
      q.exact('what leaves Pat\'s take-home pay', null, want, { byHand: '4% × 31,000 ÷ 12 = 103.33 going in; × 0.8 = 82.67 from take-home pay', owner: 'SAVER' });
      q.same('the end age', [{ where: 'About', value: 93 }, { where: 'plan document', value: 92 }]);
    });
  } catch (e) { message = e.message; }
  const lines = message.split('\n');
  expect(lines[0]).toBe('Pat, 52, asked what leaves Pat\'s pay and was not told what leaves Pat\'s take-home pay.');
  expect(lines[1]).toBe('');
  expect(lines[2]).toMatch(/^ {2}Question {3}H0 {2}"Does the harness say plainly what went wrong\?"$/);
  expect(lines[3]).toMatch(/^ {2}Route {6}nowhere > a page that does not exist {3}\(simple view, guest, 16 Nov 2026\)$/);
  expect(lines[4]).toBe('  Must read  what leaves Pat\'s take-home pay: 82.67');
  expect(lines[5]).toBe('  Did read   not stated on the page');
  expect(lines[6]).toBe('  By hand    4% × 31,000 ÷ 12 = 103.33 going in; × 0.8 = 82.67 from take-home pay');
  expect(lines[7]).toBe('  Owner      SAVER');
  expect(lines[9]).toBe('  …and was told 2 different values for the end age.');
  expect(message).toContain('  Did read   About: 93; plan document: 92');
  // the same layout from the function the report uses
  expect(failureText({ person: PAT, question: 'H0', route: { path: 'a', view: 'full', who: 'signed in', today: '1 Jan 2027' }, failures: [{ must: 'x', did: 'y', says: 'was not told x' }], seeded: true }))
    .toMatch(/^Pat, 52, asked whether the harness says plainly what went wrong and was not told x\.\n\n {2}Question {3}H0[\s\S]*\(full view, signed in, 1 Jan 2027\)[\s\S]*seeded: true/);
});

test('a failed ask fails its test, with the person\'s sentence as the error', async () => {
  test.fail(true, 'this test exists to fail: an ask with a wrong figure');
  await ask(PAT, 'H0', { path: 'the harness' }, async (q) => { q.exact('a figure', 1, 2); });
});

for (const name of ['Alex', 'Sam']) {
  test(`${name}'s account sees only ${name}'s plan, on the page and under the rules, while another account is made beside it`, async ({ page }) => {
    const me = await made(accountFor({ name }), { lastSeenVersion: VERSION, view: 'simple' });
    const plan = JSON.parse(readFileSync(new URL('../../tests/fixtures/plans/01-fresh-default.json', import.meta.url), 'utf8'));
    const planName = `${name}'s harness plan`;
    await putPlan(me.uid, { ...plan, id: `Harness${name}`, planDetails: { ...plan.planDetails, name: planName } });
    await ask({ name }, 'H0', { path: 'Your account > sign in > Your plans', who: 'signed in', asked: 'to see only their own plans' }, async (q) => {
      await q.step('sign in', async () => { await at(page); await signIn(page, me); });
      await q.step('Your plans', async () => { await openSimple(page, '#/plans'); await expect(page.locator('#app')).toContainText(planName, { timeout: 30_000 }).catch(() => {}); });
      const text = await page.locator('#app').innerText();
      q.reach(`"${planName}" on Your plans`, text.includes(planName), { did: text.slice(0, 200) });
      const other = name === 'Alex' ? 'Sam' : 'Alex';
      q.never('Your plans', text.includes(`${other}'s harness plan`) ? [`${other}'s harness plan`] : []);
      // under the real rules: every other account's plans are refused to this one
      const token = await idTokenOf(me);
      const others = (await allAccounts()).filter((a) => a.uid !== me.uid);
      for (const o of others) {
        const status = await askAs(token, 'GET', `users/${o.uid}/scenarios/Harness${other}`);
        q.exact(`the store's answer to ${name} asking for ${o.email}'s plan`, status, 403, { says: `could read another account's plan (${o.email})` });
      }
    });
  });
}

/**
 * The steps the signed-in journeys share (research/v7/after-7.md §2), as a person takes them on the page: answer a
 * question, keep the answer, sign in or make an account on "Your account". Every figure typed is a fixture's (fictional).
 */
import { expect, v7, fixtureTyping, mustFill, PROD, V7_PATH, FIXED_NOW } from '../helpers/app.js';
import { confirmEmail } from './emulator.js';

/** What a person types for each question: the fixtures the ordinary journeys use (A1, B4, F1), and D's own five things. */
const TYPED_D = { 'you.age': '68', 'you.pot': '300000', 'you.taxFreeTaken': 'no', savings: '40000', 'spend.amount': '2100' };
const FIXTURE = { a: 'A1', b: 'B4', c: 'F1' };

/** The page at the test's fixed moment, before anything is opened (the clock is the corpus date, as every browser test's). */
export async function atFixedTime(page) { await page.clock.setFixedTime(new Date(FIXED_NOW)); }

/** Question q answered from its first step, as typed by a person; on its answer step with the final answer. */
export async function answer(page, q) {
  const app = v7(page, 'prod', q);
  await app.open(`#/${q}/numbers`);
  await app.ready();
  if (q === 'd') await app.fill(TYPED_D);
  else {
    const typing = fixtureTyping(FIXTURE[q]);
    const paths = [...mustFill(q, typing), ...(typing['spend.kind'] ? ['spend.kind'] : [])];
    await app.fill(Object.fromEntries(paths.map((p) => [p, typing[p]]).filter(([, v]) => v !== undefined)));
  }
  await app.click(`${q}.action.show`);
  await app.at(`${q}.answer`);
  await app.ready(120_000);
  return app;
}

/** "Keep as a plan" at the foot of the answer (B not on course: "paying in as now"); the note that it was kept. */
export async function keep(page, q) {
  const now = page.getByTestId(`${q}.action.save.now`);
  if (await now.isVisible()) await now.click();
  else await page.getByTestId(`${q}.action.save`).click();
  const made = page.getByTestId(`${q}.keep.made`);
  await expect(made).toBeVisible({ timeout: 30_000 });
  return made;
}

/** On "Your account": the sign-in form filled and sent. */
export async function signIn(page, who) {
  await expect(page.getByTestId('account.signIn')).toBeVisible();
  await page.getByTestId('account.email').fill(who.email);
  await page.getByTestId('account.password').fill(who.password);
  await page.getByTestId('account.signIn.submit').click();
}

/** On "Your account": a new account made, its email confirmed (the emulator's link), and "I've confirmed" pressed. */
export async function signUp(page, who) {
  await expect(page.getByTestId('account.signIn')).toBeVisible();
  await page.getByTestId('account.toSignUp').click();
  await page.getByTestId('account.email').fill(who.email);
  await page.getByTestId('account.password').fill(who.password);
  await page.getByTestId('account.signUp.submit').click();
  await expect(page.getByTestId('account.verify')).toBeVisible();
  await confirmEmail(who.email);
  await page.getByTestId('account.verify.check').click();
}

/** Opens an address of the new app (the emulator build, served at the PROD address). */
export const openAt = (page, hash = '') => page.goto(PROD + V7_PATH + hash);

/** The plan id and step of the address the page is on, or null when it is not a plan's. */
export function planAddress(page) {
  const m = /#\/plan\/([^/]+)(?:\/([a-z]+))?$/.exec(new URL(page.url()).hash);
  return m ? { planId: m[1], step: m[2] || null } : null;
}

/** This window's plans kept without an account (the planner's own store). */
export const windowPlans = (page) => page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]'));

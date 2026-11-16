/**
 * Plans made on the screen, as a person makes them (rule 4): the routes several scenarios start from. Each returns the
 * plan's id and leaves the person signed in on the page it ends on.
 */
import { expect } from '@playwright/test';
import { confirmEmail } from './account.js';
import { at, openSimple, answer, keep, signUp, editAndSave, planAddress, settled } from './routes.js';
import { SAM_B } from './typed.js';
import { SAM45 } from './people.js';

/** A question answered as a guest, kept, and carried into a new account made from the kept panel. */
export async function keptIntoNewAccount(page, q, typed, me) {
  await openSimple(page, `#/${q}/numbers`);
  await answer(page, q, typed);
  await keep(page, q);
  await page.getByTestId(`${q}.keep.toAccount`).click();
  await signUp(page, me, confirmEmail);
  await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 });
  await settled(page).catch(() => {});
  return planAddress(page).planId;
}

/**
 * Sam, 44, on 12 November 2025: "Am I saving enough?" with £120,000 and the pay-in as two amounts, kept into a new
 * account; then the pay, £52,000, on What you pay in.
 */
export async function samAYearAgo(page, me) {
  await at(page, '2025-11-12T10:00:00.000Z');
  const typed = { numbers: { ...SAM_B.numbers, 'you.age': SAM45.age - 1 }, spend: SAM_B.spend };
  const planId = await keptIntoNewAccount(page, 'b', typed, me);
  await editAndSave(page, planId, 'saving', 'salary', SAM45.pay);
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  return planId;
}

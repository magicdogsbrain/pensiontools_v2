/**
 * One account per worker for the round trips (lead4.md G5): made once, signed in once, and emptied and seeded again with a
 * fixture's plans before each test (straight into the local emulators, never by pressing; never the live project).
 *
 *   resetTo(uid, plans, settings)   every plan and the settings document removed, then `plans` and `settings` written
 *   subjectOf(uid, id)              the plan as stored now (a plain object), or null
 *   waitChange(uid, id, before, ms) polls until the stored plan differs from `before` (JSON): true, or false after `ms`
 */
import { expect } from '@playwright/test';
import { PROJECT, putPlan, putSettings, plansOf } from '../signed-in/emulator.js';

const DOCS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const OWNER = { Authorization: 'Bearer owner' };

async function remove(path) {
  const r = await fetch(`${DOCS}/${path}`, { method: 'DELETE', headers: OWNER });
  await r.text();
  if (!r.ok && r.status !== 404) throw new Error(`emulator: DELETE ${path} → ${r.status}`);
}

export async function resetTo(uid, plans, settings) {
  for (const p of await plansOf(uid)) await remove(`users/${uid}/scenarios/${encodeURIComponent(p.id)}`);
  await remove(`users/${uid}/profile/settings`);
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, settings);
}

export async function subjectOf(uid, id) {
  return (await plansOf(uid)).find((p) => p.id === id) || null;
}

export async function waitChange(uid, id, before, ms = 6_000) {
  return expect.poll(async () => JSON.stringify(await subjectOf(uid, id)), { timeout: ms, intervals: [250] }).not.toBe(before).then(() => true, () => false);
}

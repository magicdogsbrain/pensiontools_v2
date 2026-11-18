/**
 * The seeder (lead4.md G2): a fixture's plans written straight into a fresh account of the local emulators (never by
 * pressing, never the live project). The account is fictional (example.test) and its own, so fixtures run side by side.
 * The account's settings say the release notes were read and the simple view was chosen, so neither view opens on a pop-up.
 */
import { readFileSync } from 'node:fs';
import { makeAccount, putPlan, putSettings } from '../../signed-in/emulator.js';

const VERSION = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')).version;

/** The account a fixture's plans live in, for one run: `parity-<key>-<tag>@example.test`. */
export function accountOf(fixture, tag = 'run') {
  const slug = String(fixture.key).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return { email: `parity-${slug}-${tag}@example.test`, password: `parity-${slug}-pass-1` };
}

/** Writes the fixture's plans into a new account: { email, password, uid, subject, plans }. */
export async function seedFixture(fixture, { tag = 'run' } = {}) {
  const who = accountOf(fixture, tag);
  const { uid } = await makeAccount(who);
  const plans = fixture.plans();
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'simple' });
  return { ...who, uid, subject: fixture.subject, plans };
}

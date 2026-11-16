/**
 * One account per scenario and per project (screen size), so scenarios run side by side without seeing each other and
 * the emulators are never cleared between them (the global set-up clears them once per run). Addresses are fictional
 * (example.test) and only ever reach the local emulators.
 */
import { test } from '@playwright/test';
import { makeAccount, confirmEmail, uidOf, plansOf, settingsOf, putPlan, putSettings, askAs, idTokenOf } from '../signed-in/emulator.js';

export { confirmEmail, uidOf, plansOf, settingsOf, putPlan, putSettings, askAs, idTokenOf };

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * The account a scenario's person uses: `s07-kim-desktop-1440@example.test`. `tag` tells two accounts of one scenario
 * apart (a couple). Not made yet: a scenario that signs up on the page uses it as typed; one that needs it made first
 * calls made().
 */
export function accountFor(person, tag = '') {
  const info = test.info();
  const file = info.file.split('/').pop().replace(/\.spec\.js$/, '');
  const scenario = /^s\d\d/.exec(file)?.[0] || slug(file);
  const project = slug(info.project.name.replace(/^scenarios-/, ''));
  const email = `${scenario}-${slug(person.name)}${tag ? `-${slug(tag)}` : ''}-${project}-${info.repeatEachIndex}@example.test`;
  return { email, password: `${scenario}-${slug(person.name)}-pass-1` };
}

/** The account made through the emulator (its email confirmed, as someone who signed up some time ago): { email, password, uid }. */
export async function made(who, settings = {}) {
  const { uid } = await makeAccount(who);
  if (Object.keys(settings).length) await putSettings(uid, settings);
  return { ...who, uid };
}

/** Every account in the emulators: [{ uid, email }] (the emulator's own listing, as the project's owner). */
export async function allAccounts() {
  const r = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-pensiontools/accounts:query', {
    method: 'POST', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ returnUserInfo: true })
  });
  const { userInfo = [] } = await r.json();
  return userInfo.map((u) => ({ uid: u.localId, email: u.email }));
}

/**
 * The local Firebase emulators, from the signed-in specs (research/v7/after-7.md §3): a demo- project that cannot reach
 * any live service. Everything here talks to 127.0.0.1 only, through the emulators' own REST endpoints:
 *
 *   clearEmulators()                         every account and every document gone (each spec starts with this)
 *   makeAccount(email, password)             a new account, its email confirmed: { uid }
 *   confirmEmail(email)                      confirms the email of an account made on the page (the emulator's oobCodes)
 *   putPlan(uid, plan)                       a plan document written as the app would hold it (rules bypassed: the emulator's owner)
 *   plansOf(uid), settingsOf(uid)            what is in the account, read back as plain objects
 *   idTokenOf(account)                       the account's ID token, signed in by password (for asking as that account)
 *   makeAdmin(uid)                           admins/{uid} created as a developer does in the console (rules bypassed)
 *   askAs(token, method, path, body)         one Firestore REST call as that account, under the real rules: its status
 *
 * The accounts are fictional (alex@example.test, sam@example.test); nothing here is ever pointed at the live project.
 */
export const PROJECT = 'demo-pensiontools';
export const API_KEY = 'demo-api-key';
const AUTH = 'http://127.0.0.1:9099';
const STORE = 'http://127.0.0.1:8080';
const DOCS = `${STORE}/v1/projects/${PROJECT}/databases/(default)/documents`;
const OWNER = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };

export const ALEX = Object.freeze({ email: 'alex@example.test', password: 'alex-test-password-1' });
export const SAM = Object.freeze({ email: 'sam@example.test', password: 'sam-test-password-1' });

async function call(url, init = {}) {
  const r = await fetch(url, init);
  const text = await r.text();
  if (!r.ok) throw new Error(`emulator: ${init.method || 'GET'} ${url} → ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

export async function clearEmulators() {
  await call(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
  await call(`${STORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });
}

/** Confirms an account's email as the link in the email would: the emulator keeps every code it "sent". */
export async function confirmEmail(email) {
  const { oobCodes = [] } = await call(`${AUTH}/emulator/v1/projects/${PROJECT}/oobCodes`);
  const codes = oobCodes.filter((c) => c.email === email && c.requestType === 'VERIFY_EMAIL');
  if (!codes.length) throw new Error(`emulator: no confirmation email was sent to ${email}`);
  await call(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oobCode: codes[codes.length - 1].oobCode })
  });
}

/** A new account with its email confirmed, as a person who signed up some time ago has. */
export async function makeAccount({ email, password }) {
  const made = await call(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  await call(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken: made.idToken })
  });
  await confirmEmail(email);
  return { uid: made.localId };
}

// ---- Firestore's REST values -------------------------------------------------------------------------------------

export function toValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, toValue(x)])) } };
}

export function fromValue(v) {
  if (!v || 'nullValue' in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('stringValue' in v) return v.stringValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromValue(x)]));
  return null;
}

/** A plan document in the account, as the app keeps it (its id is the document's name, not a field). */
export async function putPlan(uid, plan) {
  const { id, ...fields } = plan;
  await call(`${DOCS}/users/${uid}/scenarios?documentId=${encodeURIComponent(id)}`, {
    method: 'POST', headers: OWNER, body: JSON.stringify({ fields: toValue(fields).mapValue.fields })
  });
}

/** The account's settings document (users/{uid}/profile/settings), as the classic planner keeps it: e.g. { lastSeenVersion }. */
export async function putSettings(uid, settings) {
  await call(`${DOCS}/users/${uid}/profile?documentId=settings`, {
    method: 'POST', headers: OWNER, body: JSON.stringify({ fields: toValue(settings).mapValue.fields })
  });
}

const docs = async (path) => {
  const { documents = [] } = await call(`${DOCS}/${path}?pageSize=300`, { headers: OWNER });
  return documents.map((d) => ({ id: d.name.split('/').pop(), ...fromValue({ mapValue: { fields: d.fields || {} } }) }));
};

export const plansOf = (uid) => docs(`users/${uid}/scenarios`);
export async function settingsOf(uid) {
  const all = await docs(`users/${uid}/profile`);
  return all.find((d) => d.id === 'settings') || null;
}

/** The uid of an account by its email (an account made on the page). */
export async function uidOf(email) {
  const { userInfo = [] } = await call(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:query`, {
    method: 'POST', headers: OWNER, body: JSON.stringify({ returnUserInfo: true })
  });
  const u = userInfo.find((x) => x.email === email);
  if (!u) throw new Error(`emulator: no account for ${email}`);
  return u.localId;
}

// ---- Asking as an account (the real rules apply) -------------------------------------------------------------------

/** The account's ID token, as the page holds it once signed in by email and password. */
export async function idTokenOf({ email, password }) {
  const r = await call(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  return r.idToken;
}

/** An administrator: the empty document admins/{uid}, written as a developer writes it in the Firebase console. */
export async function makeAdmin(uid) {
  await call(`${DOCS}/admins?documentId=${encodeURIComponent(uid)}`, { method: 'POST', headers: OWNER, body: JSON.stringify({ fields: {} }) });
}

/**
 * One Firestore REST call as an account, so firestore.rules decide it: GET/DELETE `path`, or PATCH it with `body` (plain
 * values). Returns the HTTP status (200 allowed, 403 refused by the rules, 404 allowed but nothing there).
 */
export async function askAs(token, method, path, body) {
  const init = { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify({ fields: toValue(body).mapValue.fields });
  const r = await fetch(`${DOCS}/${path}`, init);
  await r.text();
  return r.status;
}

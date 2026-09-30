/**
 * Plan export (6.15.0): the active plan as a JSON file on the user's own machine. Pure helpers — the
 * browser part (reading the plan, the download link) is `window.exportActivePlan` in index.html.
 *
 * A scenario document holds no account identity (the uid is only in its Firestore PATH), but the export
 * strips any such field anyway so a file that is later shared or used as a test fixture cannot carry one.
 */
const IDENTITY_KEYS = new Set(['uid', 'userid', 'useruid', 'owneruid', 'ownerid', 'email', 'useremail', 'owneremail']);

/** A deep copy of `value` without account-identity fields (uid / email), at any depth. */
export function stripIdentity(value) {
  if (Array.isArray(value)) return value.map(stripIdentity);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (IDENTITY_KEYS.has(k.toLowerCase())) continue;
      out[k] = stripIdentity(v);
    }
    return out;
  }
  return value;
}

/** '<plan-name>-<YYYY-MM-DD>.json' — the name made safe for a file, the date the LOCAL day. */
export function planExportFileName(planName, now = new Date()) {
  const safe = String(planName || '').trim().replace(/[^A-Za-z0-9 _-]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'plan';
  const day = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  return safe + '-' + day + '.json';
}

/** The file's text: the document as stored, identity fields removed. */
export function planExportJson(scenario) {
  return JSON.stringify(stripIdentity(scenario), null, 1);
}

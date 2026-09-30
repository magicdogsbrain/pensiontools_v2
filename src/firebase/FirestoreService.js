/**
 * Firestore Data Service
 *
 * Handles all database operations with Firebase Firestore
 * Data structure:
 *   users/{userId}/
 *     - profile (document)
 *     - scenarios/{scenarioId} (documents) - named scenarios with all tool data
 *       Each scenario contains:
 *         planDetails: { name, description }
 *         enabledTools: ["stress", "decision"]
 *         decisionTool: { settings, history, taxYears }
 *         stressTool: { settings }
 */

import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc, writeBatch, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import { getCurrentUser , isGuest } from './AuthService.js';
import { normalizeScenario, upgradeScenario } from './scenarioMigration.js';
import { isNewerSchema, PlanNewerThanAppError, PLAN_NEWER_EVENT } from '../storage/schema.js';

/**
 * Get current user's document path
 * @param {string} subCollection - Subcollection name under user
 * @param {string} docId - Document ID within the subcollection
 * @returns {DocumentReference|null}
 */
function getUserDoc(subCollection, docId = 'settings') {
  const user = getCurrentUser();
  if (!user || !db) return null;
  return doc(db, 'users', user.uid, subCollection, docId);
}

/**
 * Get current user's subcollection reference
 * @param {string} collectionName - Collection name
 * @returns {CollectionReference|null}
 */
function getUserCollection(collectionName) {
  const user = getCurrentUser();
  if (!user || !db) return null;
  return collection(db, 'users', user.uid, collectionName);
}

// ============================================================================
// SCENARIOS
// ============================================================================

// ---- Schema version bookkeeping (6.15.0) -------------------------------------------------------------
// Which plans this session has seen to be NEWER than this code (a tab left open across a deploy), and which
// could not be upgraded. Kept here, by id, and never on the plan object: a flag on the object could be copied
// into a duplicate and saved.
const newerPlanIds = new Set();
const upgradeErrors = new Map();

function flagNewer(scenarioId) {
  const first = !newerPlanIds.has(scenarioId);
  newerPlanIds.add(scenarioId);
  if (first) {
    try { if (typeof window !== 'undefined' && typeof CustomEvent === 'function') window.dispatchEvent(new CustomEvent(PLAN_NEWER_EVENT, { detail: { scenarioId } })); }
    catch (e) { /* no window (tests, node): the flag is still readable */ }
  }
}
/** Record what an upgrade found out about a plan; returns the plan the app should use. */
function noteUpgrade(id, u) {
  if (u.newer) flagNewer(id); else newerPlanIds.delete(id);
  if (u.error) { upgradeErrors.set(id, u.error); console.error('Plan ' + id + ' could not be upgraded (schema ' + u.from + '); it is left as saved and opened as it is:', u.error); }
  else upgradeErrors.delete(id);
  return u.scenario;
}

/** True when this plan was saved by a newer version of the app than this code: every save of it is refused. */
export function isScenarioNewerThanApp(scenarioId) { return newerPlanIds.has(scenarioId); }
/** The error from this plan's last upgrade attempt, or null. The plan was left as saved and opened as it is. */
export function scenarioUpgradeError(scenarioId) { return upgradeErrors.get(scenarioId) || null; }
/** Switching the active plan touches one root flag that no schema change moves; it is the one write still allowed. */
const onlyActiveFlag = (data) => { const k = Object.keys(data || {}); return k.length === 1 && k[0] === 'isActive'; };

/**
 * Upgrade a raw scenario doc — normalise it (phantom dot-notation / legacy fields) and move it up the schema
 * chain (src/storage/migrations.js) — and, if anything changed, rewrite the document once.
 *
 * The rewrite is a FULL replace (no merge): that is what purges phantom top-level fields. Nothing is dropped
 * by it because both normalizeScenario and the chain keep every key they do not know (tested).
 *
 * No write at all when a migration step failed (the stored plan stays exactly as it is and opens as it is;
 * the next load tries again) or when the plan is newer than this code.
 * @param {object} raw - Raw scenario data including `id`
 * @returns {Promise<object>} The scenario the app should use (with id)
 */
async function migrateAndPersistScenario(raw) {
  const u = upgradeScenario(raw);
  const scenario = noteUpgrade(raw.id, u);
  if (u.write) {
    const user = getCurrentUser();
    if (user && db) {
      try {
        const { id, ...clean } = scenario;
        await setDoc(doc(db, 'users', user.uid, 'scenarios', id), clean);
      } catch (error) {
        // The write is best-effort; the upgraded data is still returned so the app works, and the next
        // load upgrades and writes again (every step is idempotent).
        console.error('Scenario migration write failed:', error);
      }
    }
  }
  return scenario;
}

/**
 * The guest store, upgraded: the same normalise + chain as a signed-in read (until 6.15.0 guest reads skipped
 * both), written back to the tab's store when something changed.
 */
function guestUpgraded() {
  const list = guestList();
  let dirty = false;
  const out = list.map((raw) => {
    if (!raw || typeof raw !== 'object') return raw;
    const u = upgradeScenario(raw);
    noteUpgrade(raw.id, u);
    if (u.write) dirty = true;
    return u.write ? u.scenario : raw;
  });
  if (dirty) guestSave(out);
  return dirty ? out : list;
}

/**
 * A plan about to be CREATED (a new plan, a duplicate, a guest plan handed into an account, a demo import)
 * is written in today's shape: a hand-off stash has no expiry, so a plan stashed under an old version can
 * arrive here long after. If it cannot be upgraded it is created as it is and upgraded on a later load.
 */
function readyToCreate(data) {
  if (!data || typeof data !== 'object') return data;
  return upgradeScenario(data).scenario;
}

/**
 * Load all scenarios for current user
 * @returns {Promise<object[]>} Array of scenario objects with id
 */

// ---- Guest store: scenarios for a guest session live in sessionStorage (this tab only) ----
const GUEST_KEY = 'pt_guest_scenarios';
function guestRead() { try { return JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]'); } catch (e) { return []; } }
function guestWrite(list) { try { sessionStorage.setItem(GUEST_KEY, JSON.stringify(list)); } catch (e) { /* quota / private mode: keep in memory only */ guestMem = list; } }
let guestMem = null;
function guestList() { return guestMem || guestRead(); }
function guestSave(list) { guestMem = list; guestWrite(list); }
export function clearGuestData() { guestMem = null; try { sessionStorage.removeItem(GUEST_KEY); } catch (e) { /* ignore */ } }
export function guestHasData() { return guestList().length > 0; }
/** A deep copy of the guest's plans — for the hand-off into an account when they sign in. */
export function guestSnapshot() { try { return JSON.parse(JSON.stringify(guestList())); } catch (e) { return []; } }

export async function loadAllScenarios() {
  if (isGuest()) return guestUpgraded().map((x) => ({ ...x }));
  if (!isFirebaseConfigured()) return [];

  const collRef = getUserCollection('scenarios');
  if (!collRef) return [];

  try {
    const querySnapshot = await getDocs(collRef);
    const rawScenarios = [];
    querySnapshot.forEach((docSnap) => {
      rawScenarios.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Normalise (and repair in Firestore) any phantom/legacy documents.
    return Promise.all(rawScenarios.map((raw) => migrateAndPersistScenario(raw)));
  } catch (error) {
    console.error('Error loading scenarios:', error);
    return [];
  }
}

/**
 * Load a single scenario by ID
 * @param {string} scenarioId - Scenario document ID
 * @returns {Promise<object|null>}
 */
export async function loadScenario(scenarioId) {
  if (isGuest()) { const x = guestUpgraded().find((y) => y.id === scenarioId); return x ? { ...x } : null; }
  if (!isFirebaseConfigured()) return null;

  const docRef = getUserDoc('scenarios', scenarioId);
  if (!docRef) return null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return migrateAndPersistScenario({ id: docSnap.id, ...docSnap.data() });
    }
    return null;
  } catch (error) {
    console.error('Error loading scenario:', error);
    return null;
  }
}

/**
 * Save/update a scenario.
 *
 * Uses updateDoc so that dot-notation keys (e.g. 'decisionTool.settings') are
 * correctly interpreted as NESTED field paths. Firestore's setDoc(..., {merge})
 * does NOT split dotted keys — it would create literal top-level fields named
 * "decisionTool.settings", which is the bug this replaces. The scenario document
 * always exists before this is called (created via createScenario/addDoc).
 *
 * Newer-than-code guard (6.15.0): a tab left open across a deploy still runs the OLD code, and would write
 * old-shape settings over a plan a newer version has already upgraded. So before every write the STORED
 * plan's schemaVersion is read; if it is greater than this code's, nothing is written and a
 * PlanNewerThanAppError is thrown (code 'plan-newer-than-app'; isScenarioNewerThanApp(id) is true from then
 * on, and the window event 'pt:plan-newer-than-app' fires once). The one exception is a write of the
 * `isActive` flag alone, so the person can still switch to another plan.
 *
 * @param {string} scenarioId - Scenario document ID
 * @param {object} data - Scenario data (may use dot-notation keys for nested updates)
 * @returns {Promise<void>}
 */
export async function saveScenario(scenarioId, data) {
  const guarded = !onlyActiveFlag(data);
  if (guarded && newerPlanIds.has(scenarioId)) throw new PlanNewerThanAppError(scenarioId);
  // Guest: the same dot-notation keys updateDoc would read as NESTED paths are folded onto them (normalizeScenario), so a
  // guest plan never grows literal "decisionTool.settings" fields that hide the real edits (6.13.0).
  if (isGuest()) { const list = guestList(); const i = list.findIndex((y) => y.id === scenarioId); if (i >= 0) { if (guarded && isNewerSchema(list[i])) { flagNewer(scenarioId); throw new PlanNewerThanAppError(scenarioId); } list[i] = normalizeScenario({ ...list[i], ...data, lastModified: new Date().toISOString() }).scenario; guestSave(list); } return; }
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('scenarios', scenarioId);
  if (!docRef) return;

  // A write that never settles (a stalled WebChannel) used to leave every Save / wizard Confirm on
  // "Saving…" for ever. Bound it, retry once, then fail loudly so the caller can show an error.
  const write = async () => {
    if (guarded) {
      // A failed version READ (offline, a stalled channel) must not block the save: treat it as "not newer" and
      // let the write go ahead as it did before 6.15.0. Only a plan actually seen to be newer is refused.
      let stored = null; try { stored = await getDoc(docRef); } catch (e) { stored = null; }
      if (stored && stored.exists() && isNewerSchema(stored.data())) { flagNewer(scenarioId); throw new PlanNewerThanAppError(scenarioId); }
    }
    return updateDoc(docRef, { ...data, lastModified: new Date().toISOString() });
  };
  try {
    await withTimeout(write(), WRITE_TIMEOUT_MS, 'Saving took too long');
  } catch (first) {
    if (first instanceof PlanNewerThanAppError) throw first;   // not a connection problem: never retried
    console.error('Error saving scenario (first attempt):', first);
    try { await withTimeout(write(), WRITE_TIMEOUT_MS, 'Saving took too long'); }
    catch (error) { console.error('Error saving scenario:', error); throw error; }
  }
}

const WRITE_TIMEOUT_MS = 20000;
function withTimeout(promise, ms, message) {
  let t;
  const timer = new Promise((_, reject) => { t = setTimeout(() => reject(new Error(message + ' (' + Math.round(ms / 1000) + 's) — check your connection and try again')), ms); });
  return Promise.race([promise, timer]).finally(() => clearTimeout(t));
}

/**
 * Create a new scenario
 * @param {object} data - Scenario data (name, description, enabledTools, settings)
 * @returns {Promise<string>} New scenario document ID
 */
export async function createScenario(data) {
  data = readyToCreate(data);
  if (isGuest()) { const id = 'guest-' + Math.random().toString(36).slice(2, 10); const list = guestList(); list.push({ ...data, id, createdAt: new Date().toISOString(), lastModified: new Date().toISOString() }); guestSave(list); return id; }
  if (!isFirebaseConfigured()) return null;

  const collRef = getUserCollection('scenarios');
  if (!collRef) return null;

  try {
    const docRef = await addDoc(collRef, {
      ...data,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating scenario:', error);
    throw error;
  }
}

/**
 * Delete a scenario
 * @param {string} scenarioId - Scenario document ID
 * @returns {Promise<void>}
 */
export async function deleteScenarioDoc(scenarioId) {
  if (isGuest()) { guestSave(guestList().filter((y) => y.id !== scenarioId)); return; }
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('scenarios', scenarioId);
  if (!docRef) return;

  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting scenario:', error);
    throw error;
  }
}

/**
 * Set a scenario as active (and unset all others)
 * @param {string} scenarioId - Scenario to make active
 * @returns {Promise<void>}
 */
export async function setActiveScenarioDoc(scenarioId) {
  if (isGuest()) { guestSave(guestList().map((y) => ({ ...y, isActive: y.id === scenarioId }))); return; }
  if (!isFirebaseConfigured()) return;

  const user = getCurrentUser();
  if (!user || !db) return;

  try {
    // Load all scenarios to find which ones need updating
    const scenarios = await loadAllScenarios();
    const batch = writeBatch(db);

    for (const scenario of scenarios) {
      const ref = doc(db, 'users', user.uid, 'scenarios', scenario.id);
      if (scenario.id === scenarioId) {
        batch.update(ref, { isActive: true });
      } else if (scenario.isActive) {
        batch.update(ref, { isActive: false });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error setting active scenario:', error);
    throw error;
  }
}

// ============================================================================
// USER PROFILE
// ============================================================================

/**
 * Load user profile from Firestore
 * @returns {Promise<object|null>}
 */
export async function loadUserProfile() {
  if (isGuest()) return null;
  if (!isFirebaseConfigured()) return null;

  const docRef = getUserDoc('profile');
  if (!docRef) return null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}

/**
 * Save user profile to Firestore
 * @param {object} data - Profile data
 * @returns {Promise<void>}
 */
export async function saveUserProfile(data) {
  if (isGuest()) return;
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('profile');
  if (!docRef) return;

  try {
    await setDoc(docRef, {
      ...data,
      lastModified: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    // Preferences only (e.g. the last release note seen): never let a failed write take the app down.
    console.error('Error saving user profile:', error);
  }
}

// ============================================================================
// COMPLETE DATA WIPE
// ============================================================================

/**
 * Wipe ALL user data (nuclear option)
 * History is inside scenario documents, so deleting scenarios removes everything.
 * @returns {Promise<void>}
 */
export async function wipeAllUserData() {
  if (isGuest()) { clearGuestData(); return; }
  if (!isFirebaseConfigured()) return;

  const user = getCurrentUser();
  if (!user || !db) return;

  try {
    // Delete all scenarios (history lives inside them)
    const scenarios = await loadAllScenarios();
    const batch = writeBatch(db);

    for (const scenario of scenarios) {
      batch.delete(doc(db, 'users', user.uid, 'scenarios', scenario.id));
    }

    // Delete profile
    batch.delete(doc(db, 'users', user.uid, 'profile', 'settings'));

    // The only personal data outside users/{uid}: the fund-suggestion queue rows this user filed
    // (they carry the uid). Right to erasure means they go too (security audit H2).
    try {
      const q = query(collection(db, 'fundSuggestions'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      snap.forEach((d) => batch.delete(d.ref));
    } catch (e) { /* older rules may not permit the read; the account deletion still proceeds */ }

    await batch.commit();

    console.log('All user data wiped successfully');
  } catch (error) {
    console.error('Error wiping user data:', error);
    throw error;
  }
}

// ============================================================================
// DATA SYNC UTILITIES
// ============================================================================

/**
 * Check if user has any data in Firestore
 * @returns {Promise<boolean>}
 */
export async function hasCloudData() {
  if (isGuest()) return guestHasData();
  if (!isFirebaseConfigured()) return false;

  const scenarios = await loadAllScenarios();
  return scenarios.length > 0;
}

/**
 * Get last sync timestamp from the active scenario
 * @returns {Promise<string|null>}
 */
export async function getLastSyncTime() {
  if (!isFirebaseConfigured()) return null;

  const scenarios = await loadAllScenarios();
  const active = scenarios.find(s => s.isActive);
  return active?.lastModified || null;
}

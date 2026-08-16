/**
 * Admin Config Service — Firestore-backed overrides for curated datasets, with code fallbacks.
 *
 * Layout (see firestore.rules):
 *   admin/fundCatalogue     { updatedAt, sources, funds: [{ticker,name,subClass}, …] }
 *   admin/subAssetProfiles  { updatedAt, overrides: { profileKey: { field: number } } }
 *   admin/typicalAmounts    { updatedAt, sources, tiers: { <label>: {minimum:{s,c},…} } }
 *   adminPrivate/access     { passphrase? }   — readable ONLY by the administrator
 *   fundSuggestions/{id}    { ticker, name, subClass, uid, createdAt }
 *
 * SECURITY MODEL: there is no admin identifier anywhere in shipped JavaScript. Admin-ness is
 * determined by PROBING a read of adminPrivate/access — firestore.rules (server-side, never
 * served to clients) restricts that read to the administrator's Firebase Auth uid, which cannot
 * be spoofed. Every admin write is likewise enforced by the rules; the client UI is convenience,
 * not the boundary. The optional `passphrase` on adminPrivate/access is a soft lock for
 * shared-computer scenarios (prompted before the panel opens), not a cryptographic control.
 */

import { doc, getDoc, setDoc, deleteDoc, addDoc, deleteDoc as delDoc, collection, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import { getCurrentUser } from './AuthService.js';
import { DEFAULT_FUND_CATALOGUE } from '../services/FundCatalogue.js';
import { setTypicalTiersOverride } from '../services/BudgetModel.js';
import { applySubAssetOverrides } from '../services/SubAssetModel.js';

let _catalogue = DEFAULT_FUND_CATALOGUE;
let _profileOverrides = null;
let _loaded = false;
let _isAdmin = false;
let _passphrase = null;

/** The live fund catalogue: the Firestore override when present, else the code default. */
export function activeFundCatalogue() {
  return _catalogue;
}

/** Catalogue entry for a ticker (case-insensitive) from the LIVE catalogue, or null. */
export function liveCatalogueEntry(ticker) {
  const t = (ticker || '').toUpperCase().trim();
  return _catalogue.find((f) => f.ticker === t) || null;
}

/** True once the adminPrivate probe has succeeded this session (rules-enforced, no uid in JS). */
export function isAdminUser() {
  return _isAdmin;
}

/** The soft-lock passphrase from adminPrivate/access, if the admin has set one (else null). */
export function adminPassphrase() {
  return _passphrase;
}

/** The currently-active sub-asset profile overrides (for the admin editor), or null. */
export function activeProfileOverrides() {
  return _profileOverrides;
}

/**
 * Fetch overrides once per session (call after sign-in). Silent on any failure —
 * the code defaults are always a working configuration.
 */
export async function initAdminConfig() {
  if (_loaded || !isFirebaseConfigured() || !db) return;
  _loaded = true;
  // Admin probe: only the administrator's uid can read adminPrivate/access (firestore.rules).
  try {
    const probe = await getDoc(doc(db, 'adminPrivate', 'access'));
    _isAdmin = true; // read permitted → this IS the admin (even if the doc doesn't exist yet)
    _passphrase = probe.exists() ? (probe.data().passphrase || null) : null;
  } catch (e) {
    _isAdmin = false;
  }
  try {
    const [fundsSnap, profSnap, typSnap] = await Promise.all([
      getDoc(doc(db, 'admin', 'fundCatalogue')),
      getDoc(doc(db, 'admin', 'subAssetProfiles')),
      getDoc(doc(db, 'admin', 'typicalAmounts'))
    ]);
    if (fundsSnap.exists()) {
      const funds = fundsSnap.data().funds;
      if (Array.isArray(funds) && funds.length && funds.every((f) => f.ticker && f.subClass)) {
        _catalogue = Object.freeze([...funds].sort((a, b) => a.ticker.localeCompare(b.ticker)));
        console.log('AdminConfig: fund catalogue override active (' + _catalogue.length + ' funds)');
      }
    }
    if (profSnap.exists()) {
      _profileOverrides = profSnap.data().overrides || null;
      if (_profileOverrides) {
        applySubAssetOverrides(_profileOverrides);
        console.log('AdminConfig: sub-asset profile overrides active');
      }
    }
    if (typSnap.exists()) {
      const tiers = typSnap.data().tiers;
      if (tiers && typeof tiers === 'object') {
        setTypicalTiersOverride(tiers);
        console.log('AdminConfig: typical-amounts override active');
      }
    }
  } catch (e) {
    console.warn('AdminConfig: using code defaults (' + e.message + ')');
  }
}

// ---- Admin write APIs (all rules-enforced server-side) --------------------------------------

/** Save the full fund catalogue as the cloud override and make it live immediately. */
export async function saveFundCatalogueOverride(funds) {
  const clean = (funds || [])
    .filter((f) => f.ticker && f.subClass)
    .map((f) => ({ ticker: String(f.ticker).toUpperCase().trim(), name: String(f.name || ''), subClass: f.subClass }));
  await setDoc(doc(db, 'admin', 'fundCatalogue'), { funds: clean, updatedAt: serverTimestamp() });
  _catalogue = Object.freeze([...clean].sort((a, b) => a.ticker.localeCompare(b.ticker)));
  return _catalogue.length;
}

/** Remove the catalogue override; the shipped default list becomes live again. */
export async function clearFundCatalogueOverride() {
  await deleteDoc(doc(db, 'admin', 'fundCatalogue'));
  _catalogue = DEFAULT_FUND_CATALOGUE;
}

/** Save sub-asset profile overrides ({key:{field:value}}) and apply them live. */
export async function saveProfileOverrides(overrides) {
  const clean = overrides && Object.keys(overrides).length ? overrides : null;
  if (clean) await setDoc(doc(db, 'admin', 'subAssetProfiles'), { overrides: clean, updatedAt: serverTimestamp() });
  else await deleteDoc(doc(db, 'admin', 'subAssetProfiles'));
  _profileOverrides = clean;
  applySubAssetOverrides(clean);
}

/**
 * Log an unknown-ticker categorisation to the admin queue. Fire-and-forget: never blocks
 * or surfaces errors to the user — it's curation telemetry, not a feature they asked for.
 */
export function submitFundSuggestion({ ticker, name, subClass }) {
  try {
    const u = getCurrentUser();
    if (!u || !isFirebaseConfigured() || !db || !ticker) return;
    addDoc(collection(db, 'fundSuggestions'), {
      ticker: String(ticker).toUpperCase().trim().slice(0, 12),
      name: String(name || '').slice(0, 80),
      subClass: String(subClass || '').slice(0, 40),
      uid: u.uid,
      createdAt: serverTimestamp()
    }).catch(() => {});
  } catch (e) { /* never disturb the user for this */ }
}

/** Admin-only (rules-enforced): list pending fund suggestions, newest first (capped). */
export async function listFundSuggestions(max = 100) {
  const snap = await getDocs(query(collection(db, 'fundSuggestions'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Admin-only (rules-enforced): remove a handled suggestion. */
export async function deleteFundSuggestion(id) {
  await delDoc(doc(db, 'fundSuggestions', id));
}

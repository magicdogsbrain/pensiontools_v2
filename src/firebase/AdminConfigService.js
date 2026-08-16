/**
 * Admin Config Service — Firestore-backed overrides for curated datasets, with code fallbacks.
 *
 * Layout (see firestore.rules):
 *   admin/fundCatalogue   { updatedAt, sources: [urls], funds: [{ticker,name,subClass}, …] }
 *   admin/typicalAmounts  { updatedAt, sources: [urls], tiers: { <label>: {minimum:{s,c},…} } }
 *   fundSuggestions/{id}  { ticker, name, subClass, uid, createdAt }  — user-submitted queue
 *
 * All docs are readable by any signed-in verified user and writable only by the admin UID.
 * The app works fully without them (code defaults); overrides supersede silently when present.
 */

import { doc, getDoc, addDoc, collection, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import { getCurrentUser } from './AuthService.js';
import { DEFAULT_FUND_CATALOGUE } from '../services/FundCatalogue.js';
import { setTypicalTiersOverride } from '../services/BudgetModel.js';

// The owner/administrator account (cpbooth@gmail.com in project pensiontools-4b237).
export const ADMIN_UID = 'K5BLVvYKtzWTzqWqT5qUH7EqrwU2';

let _catalogue = DEFAULT_FUND_CATALOGUE;
let _loaded = false;

/** The live fund catalogue: the Firestore override when present, else the code default. */
export function activeFundCatalogue() {
  return _catalogue;
}

/** Catalogue entry for a ticker (case-insensitive) from the LIVE catalogue, or null. */
export function liveCatalogueEntry(ticker) {
  const t = (ticker || '').toUpperCase().trim();
  return _catalogue.find((f) => f.ticker === t) || null;
}

export function isAdminUser() {
  const u = getCurrentUser();
  return !!u && u.uid === ADMIN_UID;
}

/**
 * Fetch overrides once per session (call after sign-in). Silent on any failure —
 * the code defaults are always a working configuration.
 */
export async function initAdminConfig() {
  if (_loaded || !isFirebaseConfigured() || !db) return;
  _loaded = true;
  try {
    const [fundsSnap, typSnap] = await Promise.all([
      getDoc(doc(db, 'admin', 'fundCatalogue')),
      getDoc(doc(db, 'admin', 'typicalAmounts'))
    ]);
    if (fundsSnap.exists()) {
      const funds = fundsSnap.data().funds;
      if (Array.isArray(funds) && funds.length && funds.every((f) => f.ticker && f.subClass)) {
        _catalogue = Object.freeze([...funds].sort((a, b) => a.ticker.localeCompare(b.ticker)));
        console.log('AdminConfig: fund catalogue override active (' + _catalogue.length + ' funds)');
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

/** Admin-only: list pending fund suggestions, newest first (capped). */
export async function listFundSuggestions(max = 100) {
  if (!isAdminUser()) return [];
  const snap = await getDocs(query(collection(db, 'fundSuggestions'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

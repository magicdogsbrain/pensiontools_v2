/**
 * Firestore Data Service
 *
 * Handles all database operations with Firebase Firestore
 * Data structure:
 *   users/{userId}/
 *     - profile (document)
 *     - decision (document) - settings, taxYears
 *     - stress (document) - settings
 *     - history (subcollection) - monthly decision records
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import { getCurrentUser } from './AuthService.js';

/**
 * Get current user's document path
 * @param {string} subCollection - Subcollection name under user
 * @param {string} docId - Document ID within the subcollection
 * @returns {DocumentReference|null}
 */
function getUserDoc(subCollection, docId = 'settings') {
  const user = getCurrentUser();
  if (!user || !db) return null;
  // Path: users/{userId}/{subCollection}/{docId}
  // e.g., users/abc123/decision/settings
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
// DECISION DATA
// ============================================================================

/**
 * Load decision data from Firestore
 * @returns {Promise<object|null>}
 */
export async function loadDecisionData() {
  if (!isFirebaseConfigured()) return null;

  const docRef = getUserDoc('decision');
  if (!docRef) return null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading decision data:', error);
    return null;
  }
}

/**
 * Save decision data to Firestore
 * @param {object} data - Decision data (settings, taxYears)
 * @returns {Promise<void>}
 */
export async function saveDecisionData(data) {
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('decision');
  if (!docRef) return;

  try {
    await setDoc(docRef, {
      ...data,
      lastModified: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving decision data:', error);
    throw error;
  }
}

/**
 * Load decision history from Firestore
 * @param {object} options - Query options
 * @returns {Promise<object[]>}
 */
export async function loadDecisionHistory(options = {}) {
  if (!isFirebaseConfigured()) return [];

  const collRef = getUserCollection('history');
  if (!collRef) return [];

  try {
    let q = query(collRef, orderBy('date', options.sortDesc ? 'desc' : 'asc'));

    if (options.taxYear) {
      q = query(collRef,
        where('taxYear', '==', options.taxYear),
        orderBy('date', options.sortDesc ? 'desc' : 'asc')
      );
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });

    return history;
  } catch (error) {
    console.error('Error loading decision history:', error);
    return [];
  }
}

/**
 * Add a history record
 * @param {object} record - History record
 * @returns {Promise<string>} Document ID
 */
export async function addDecisionHistoryRecord(record) {
  if (!isFirebaseConfigured()) return null;

  const collRef = getUserCollection('history');
  if (!collRef) return null;

  try {
    // Check for existing record with same date
    const existingQuery = query(collRef, where('date', '==', record.date));
    const existing = await getDocs(existingQuery);

    if (!existing.empty) {
      // Update existing
      const docId = existing.docs[0].id;
      await setDoc(doc(db, 'users', getCurrentUser().uid, 'history', docId), {
        ...record,
        updatedAt: new Date().toISOString()
      });
      return docId;
    }

    // Add new record
    const docRef = await addDoc(collRef, {
      ...record,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding history record:', error);
    throw error;
  }
}

/**
 * Delete a history record
 * @param {string} date - Date of record to delete
 * @returns {Promise<void>}
 */
export async function deleteDecisionHistoryRecord(date) {
  if (!isFirebaseConfigured()) return;

  const collRef = getUserCollection('history');
  if (!collRef) return;

  try {
    const q = query(collRef, where('date', '==', date));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting history record:', error);
    throw error;
  }
}

/**
 * Clear all history (WIPE)
 * @returns {Promise<void>}
 */
export async function clearAllHistory() {
  if (!isFirebaseConfigured()) return;

  const collRef = getUserCollection('history');
  if (!collRef) return;

  try {
    const querySnapshot = await getDocs(collRef);

    // Firestore batch delete (max 500 at a time)
    const batchSize = 500;
    const batches = [];
    let currentBatch = writeBatch(db);
    let operationCount = 0;

    querySnapshot.forEach((docSnap) => {
      currentBatch.delete(docSnap.ref);
      operationCount++;

      if (operationCount >= batchSize) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    });

    if (operationCount > 0) {
      batches.push(currentBatch);
    }

    // Execute all batches
    await Promise.all(batches.map(batch => batch.commit()));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}

// ============================================================================
// STRESS DATA
// ============================================================================

/**
 * Load stress data from Firestore
 * @returns {Promise<object|null>}
 */
export async function loadStressData() {
  if (!isFirebaseConfigured()) return null;

  const docRef = getUserDoc('stress');
  if (!docRef) return null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading stress data:', error);
    return null;
  }
}

/**
 * Save stress data to Firestore
 * @param {object} data - Stress data
 * @returns {Promise<void>}
 */
export async function saveStressData(data) {
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('stress');
  if (!docRef) return;

  try {
    await setDoc(docRef, {
      ...data,
      lastModified: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving stress data:', error);
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
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('profile');
  if (!docRef) return;

  try {
    await setDoc(docRef, {
      ...data,
      lastModified: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// ============================================================================
// COMPLETE DATA WIPE
// ============================================================================

/**
 * Wipe ALL user data (nuclear option)
 * @returns {Promise<void>}
 */
export async function wipeAllUserData() {
  if (!isFirebaseConfigured()) return;

  const user = getCurrentUser();
  if (!user || !db) return;

  try {
    // Clear history collection
    await clearAllHistory();

    // Delete main documents (path: users/{uid}/{collection}/settings)
    const batch = writeBatch(db);
    batch.delete(doc(db, 'users', user.uid, 'decision', 'settings'));
    batch.delete(doc(db, 'users', user.uid, 'stress', 'settings'));
    batch.delete(doc(db, 'users', user.uid, 'profile', 'settings'));
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
  if (!isFirebaseConfigured()) return false;

  const decisionData = await loadDecisionData();
  const historyData = await loadDecisionHistory({ limit: 1 });

  return decisionData !== null || historyData.length > 0;
}

/**
 * Get last sync timestamp
 * @returns {Promise<string|null>}
 */
export async function getLastSyncTime() {
  if (!isFirebaseConfigured()) return null;

  const decisionData = await loadDecisionData();
  return decisionData?.lastModified || null;
}

/**
 * Firestore Data Service
 *
 * Handles all database operations with Firebase Firestore
 * Data structure:
 *   users/{userId}/
 *     - profile (document)
 *     - scenarios/{scenarioId} (documents) - named scenario with stress + decision settings
 *     - history (subcollection) - monthly decision records (global, not per-scenario)
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

/**
 * Load all scenarios for current user
 * @returns {Promise<object[]>} Array of scenario objects with id
 */
export async function loadAllScenarios() {
  if (!isFirebaseConfigured()) return [];

  const collRef = getUserCollection('scenarios');
  if (!collRef) return [];

  try {
    const querySnapshot = await getDocs(collRef);
    const scenarios = [];
    querySnapshot.forEach((docSnap) => {
      scenarios.push({ id: docSnap.id, ...docSnap.data() });
    });
    return scenarios;
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
  if (!isFirebaseConfigured()) return null;

  const docRef = getUserDoc('scenarios', scenarioId);
  if (!docRef) return null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error loading scenario:', error);
    return null;
  }
}

/**
 * Save/update a scenario
 * @param {string} scenarioId - Scenario document ID
 * @param {object} data - Scenario data
 * @returns {Promise<void>}
 */
export async function saveScenario(scenarioId, data) {
  if (!isFirebaseConfigured()) return;

  const docRef = getUserDoc('scenarios', scenarioId);
  if (!docRef) return;

  try {
    await setDoc(docRef, {
      ...data,
      lastModified: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving scenario:', error);
    throw error;
  }
}

/**
 * Create a new scenario
 * @param {object} data - Scenario data (name, description, enabledTools, settings)
 * @returns {Promise<string>} New scenario document ID
 */
export async function createScenario(data) {
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
// DECISION HISTORY (global, not per-scenario)
// ============================================================================

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
    querySnapshot.forEach((docSnap) => {
      history.push({ id: docSnap.id, ...docSnap.data() });
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

    // Delete all scenarios
    const scenarios = await loadAllScenarios();
    if (scenarios.length > 0) {
      const batch = writeBatch(db);
      for (const scenario of scenarios) {
        batch.delete(doc(db, 'users', user.uid, 'scenarios', scenario.id));
      }
      batch.delete(doc(db, 'users', user.uid, 'profile', 'settings'));
      await batch.commit();
    } else {
      // Just delete profile
      await deleteDoc(doc(db, 'users', user.uid, 'profile', 'settings'));
    }

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

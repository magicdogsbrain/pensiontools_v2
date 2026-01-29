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

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
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
 * Supports dot-notation keys for nested field updates (e.g. 'decisionTool.history')
 * @param {string} scenarioId - Scenario document ID
 * @param {object} data - Scenario data (can use dot-notation keys)
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
 * History is inside scenario documents, so deleting scenarios removes everything.
 * @returns {Promise<void>}
 */
export async function wipeAllUserData() {
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

/**
 * Firebase Authentication Service
 *
 * Handles user authentication with Firebase
 * Supports email/password and Google sign-in
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config.js';

// Google auth provider
const googleProvider = new GoogleAuthProvider();

// Current user state
let currentUser = null;
let authStateListeners = [];

/**
 * Initialize auth state listener
 */
export function initAuthStateListener() {
  if (!isFirebaseConfigured() || !auth) {
    console.warn('Firebase not configured - auth disabled');
    return;
  }

  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged fired:', user ? user.email : 'null');
    currentUser = user;
    // Notify all listeners
    console.log('Notifying', authStateListeners.length, 'listeners');
    authStateListeners.forEach(listener => listener(user));
  });
}

/**
 * Subscribe to auth state changes
 * @param {function} listener - Callback function
 * @returns {function} Unsubscribe function
 */
export function onAuthStateChange(listener) {
  console.log('onAuthStateChange: adding listener, currentUser is:', currentUser ? currentUser.email : currentUser);
  authStateListeners.push(listener);
  // Immediately call with current state if we have a user
  // (Don't call with null - wait for Firebase to initialize)
  if (currentUser) {
    console.log('onAuthStateChange: immediately calling listener with user');
    listener(currentUser);
  }
  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== listener);
  };
}

/**
 * Get current user
 * @returns {object|null} Current user or null
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return currentUser !== null;
}

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName - Optional display name
 * @returns {Promise<object>} User credential
 */
export async function signUpWithEmail(email, password, displayName = null) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase not configured');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  return userCredential;
}

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} User credential
 */
export async function signInWithEmail(email, password) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase not configured');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in with Google
 * Uses popup method for more reliable auth flow
 * @returns {Promise<object>} User credential
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase not configured');
  }

  console.log('Initiating Google sign-in popup...');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', result.user.email);
    return result;
  } catch (error) {
    console.error('signInWithPopup error:', error.code, error.message);
    throw error;
  }
}

/**
 * Sign out
 * @returns {Promise<void>}
 */
export async function logOut() {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase not configured');
  }

  return signOut(auth);
}

/**
 * Send password reset email
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase not configured');
  }

  return sendPasswordResetEmail(auth, email);
}

/**
 * Delete user account and all data
 * @returns {Promise<void>}
 */
export async function deleteAccount() {
  if (!isFirebaseConfigured() || !auth || !currentUser) {
    throw new Error('Not logged in');
  }

  // Note: User data in Firestore should be deleted separately
  // This only deletes the authentication account
  return deleteUser(currentUser);
}

/**
 * Update user profile
 * @param {object} profileData - { displayName, photoURL }
 * @returns {Promise<void>}
 */
export async function updateUserProfile(profileData) {
  if (!isFirebaseConfigured() || !auth || !currentUser) {
    throw new Error('Not logged in');
  }

  return updateProfile(currentUser, profileData);
}

/**
 * Get user display info
 * @returns {object|null} User info
 */
export function getUserInfo() {
  if (!currentUser) return null;

  return {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
    photoURL: currentUser.photoURL,
    emailVerified: currentUser.emailVerified
  };
}

// Auto-initialize auth state listener when module loads
initAuthStateListener();

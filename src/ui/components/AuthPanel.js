/**
 * Authentication Panel Component
 *
 * Provides login/signup UI for Firebase authentication
 */

import {
  isFirebaseConfigured,
  isLoggedIn,
  getCurrentUser,
  getUserInfo,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
  onAuthStateChange,
  initAuthStateListener
} from '../../firebase/index.js';
import { wipeAllDecisionData } from '../../storage/DecisionRepository.js';
import { resetStressSettings } from '../../storage/StressRepository.js';
import { wipeAllUserData } from '../../firebase/FirestoreService.js';

// Auth state
let authPanelElement = null;
let authStateCallback = null;

/**
 * Initialize the auth panel
 * @param {HTMLElement} container - Container element
 * @param {function} onAuthChange - Callback when auth state changes
 */
export function initAuthPanel(container, onAuthChange = null) {
  authPanelElement = container;
  authStateCallback = onAuthChange;

  // Initialize Firebase auth listener
  initAuthStateListener();

  // Subscribe to auth changes
  onAuthStateChange((user) => {
    renderAuthPanel();
    if (authStateCallback) {
      authStateCallback(user);
    }
  });

  // Initial render
  renderAuthPanel();
}

/**
 * Render the auth panel based on current state
 */
export function renderAuthPanel() {
  if (!authPanelElement) return;

  if (!isFirebaseConfigured()) {
    authPanelElement.innerHTML = `
      <div class="auth-panel auth-not-configured">
        <p class="text-muted">Cloud sync not configured</p>
        <small>Sign in required to save data</small>
      </div>
    `;
    return;
  }

  if (isLoggedIn()) {
    renderLoggedInState();
  } else {
    renderLoggedOutState();
  }
}

/**
 * Render logged-in state
 */
function renderLoggedInState() {
  const userInfo = getUserInfo();

  authPanelElement.innerHTML = `
    <div class="auth-panel auth-logged-in">
      <div class="user-info">
        ${userInfo.photoURL
          ? `<img src="${userInfo.photoURL}" alt="Profile" class="user-avatar" />`
          : `<div class="user-avatar-placeholder">${userInfo.displayName?.charAt(0)?.toUpperCase() || 'U'}</div>`
        }
        <div class="user-details">
          <span class="user-name">${userInfo.displayName}</span>
          <span class="user-email">${userInfo.email}</span>
        </div>
      </div>
      <div class="auth-actions">
        <button type="button" class="btn btn-sm btn-outline-secondary" id="auth-logout">
          Sign Out
        </button>
        <button type="button" class="btn btn-sm btn-outline-danger" id="auth-wipe" title="Reset all data">
          Reset Data
        </button>
      </div>
      <div class="sync-status">
        <span class="sync-indicator sync-connected"></span>
        <small>Synced to cloud</small>
      </div>
    </div>
  `;

  // Attach event listeners
  document.getElementById('auth-logout')?.addEventListener('click', handleLogout);
  document.getElementById('auth-wipe')?.addEventListener('click', handleWipeData);
}

/**
 * Render logged-out state (login/signup form)
 */
function renderLoggedOutState() {
  authPanelElement.innerHTML = `
    <div class="auth-panel auth-logged-out">
      <div class="auth-tabs">
        <button type="button" class="auth-tab active" data-tab="login">Sign In</button>
        <button type="button" class="auth-tab" data-tab="signup">Sign Up</button>
      </div>

      <div id="auth-tab-content">
        <!-- Login form (default) -->
        <form id="auth-login-form" class="auth-form">
          <div class="form-group">
            <input type="email" id="login-email" class="form-control" placeholder="Email" required />
          </div>
          <div class="form-group">
            <input type="password" id="login-password" class="form-control" placeholder="Password" required />
          </div>
          <div id="login-error" class="auth-error"></div>
          <button type="submit" class="btn btn-primary btn-block">Sign In</button>
          <button type="button" id="forgot-password" class="btn btn-link btn-sm">Forgot password?</button>
        </form>
      </div>

      <div class="auth-divider">
        <span>or</span>
      </div>

      <button type="button" id="google-signin" class="btn btn-outline-secondary btn-block google-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" class="google-icon">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>

      <p class="auth-note">
        <small>Sign in to sync your data across devices</small>
      </p>
    </div>
  `;

  // Attach event listeners
  attachAuthEventListeners();
}

/**
 * Attach event listeners to auth forms
 */
function attachAuthEventListeners() {
  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Login form
  document.getElementById('auth-login-form')?.addEventListener('submit', handleLogin);

  // Forgot password
  document.getElementById('forgot-password')?.addEventListener('click', handleForgotPassword);

  // Google sign-in
  document.getElementById('google-signin')?.addEventListener('click', handleGoogleSignIn);
}

/**
 * Switch between login and signup tabs
 */
function switchAuthTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update content
  const content = document.getElementById('auth-tab-content');
  if (!content) return;

  if (tabName === 'signup') {
    content.innerHTML = `
      <form id="auth-signup-form" class="auth-form">
        <div class="form-group">
          <input type="text" id="signup-name" class="form-control" placeholder="Display Name" required />
        </div>
        <div class="form-group">
          <input type="email" id="signup-email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" id="signup-password" class="form-control" placeholder="Password (min 6 chars)" required minlength="6" />
        </div>
        <div id="signup-error" class="auth-error"></div>
        <button type="submit" class="btn btn-primary btn-block">Create Account</button>
      </form>
    `;
    document.getElementById('auth-signup-form')?.addEventListener('submit', handleSignup);
  } else {
    content.innerHTML = `
      <form id="auth-login-form" class="auth-form">
        <div class="form-group">
          <input type="email" id="login-email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" id="login-password" class="form-control" placeholder="Password" required />
        </div>
        <div id="login-error" class="auth-error"></div>
        <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        <button type="button" id="forgot-password" class="btn btn-link btn-sm">Forgot password?</button>
      </form>
    `;
    document.getElementById('auth-login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('forgot-password')?.addEventListener('click', handleForgotPassword);
  }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  const errorEl = document.getElementById('login-error');

  if (!email || !password) return;

  try {
    errorEl.textContent = '';
    errorEl.style.display = 'none';

    await signInWithEmail(email, password);
    // Auth state listener will update UI
  } catch (error) {
    console.error('Login error:', error);
    errorEl.textContent = getAuthErrorMessage(error.code);
    errorEl.style.display = 'block';
  }
}

/**
 * Handle signup form submission
 */
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name')?.value;
  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const errorEl = document.getElementById('signup-error');

  if (!name || !email || !password) return;

  try {
    errorEl.textContent = '';
    errorEl.style.display = 'none';

    await signUpWithEmail(email, password, name);
    // Auth state listener will update UI
  } catch (error) {
    console.error('Signup error:', error);
    errorEl.textContent = getAuthErrorMessage(error.code);
    errorEl.style.display = 'block';
  }
}

/**
 * Handle Google sign-in
 */
async function handleGoogleSignIn() {
  try {
    await signInWithGoogle();
    // Auth state listener will update UI
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert(getAuthErrorMessage(error.code));
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await logOut();
    // Auth state listener will update UI
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to sign out. Please try again.');
  }
}

/**
 * Handle forgot password
 */
async function handleForgotPassword() {
  const email = document.getElementById('login-email')?.value;

  if (!email) {
    alert('Please enter your email address first.');
    return;
  }

  try {
    await resetPassword(email);
    alert('Password reset email sent. Check your inbox.');
  } catch (error) {
    console.error('Password reset error:', error);
    alert(getAuthErrorMessage(error.code));
  }
}

/**
 * Handle wipe/reset all data
 */
async function handleWipeData() {
  const confirmed = confirm(
    'Are you sure you want to RESET ALL DATA?\n\n' +
    'This will permanently delete:\n' +
    '- All your decision history\n' +
    '- All settings\n' +
    '- All tax year configurations\n\n' +
    'This action CANNOT be undone!'
  );

  if (!confirmed) return;

  // Double confirm for safety
  const doubleConfirmed = confirm(
    'FINAL WARNING!\n\n' +
    'All your pension planning data will be permanently deleted.\n\n' +
    'Are you absolutely sure?'
  );

  if (!doubleConfirmed) return;

  try {
    // Wipe from Firebase (requires login)
    if (isLoggedIn()) {
      await wipeAllUserData();
      await wipeAllDecisionData();
      await resetStressSettings();
    }

    alert('All data has been reset to defaults.');

    // Reload the page to reflect changes
    window.location.reload();
  } catch (error) {
    console.error('Wipe data error:', error);
    alert('Failed to reset data. Please try again.');
  }
}

/**
 * Get user-friendly error message from Firebase error code
 */
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/popup-blocked': 'Pop-up blocked. Please allow pop-ups and try again.'
  };

  return messages[code] || 'An error occurred. Please try again.';
}

/**
 * Get CSS styles for the auth panel
 */
export function getAuthPanelStyles() {
  return `
    .auth-panel {
      padding: 1rem;
      border-radius: 8px;
      background: var(--bg-secondary, #1e1e2e);
    }

    .auth-not-configured {
      text-align: center;
      opacity: 0.7;
    }

    .auth-logged-in .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .user-avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color, #7c3aed);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
    }

    .user-email {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .auth-actions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .sync-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sync-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .sync-connected {
      background: #2ea043;
    }

    .auth-tabs {
      display: flex;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-color, #333);
    }

    .auth-tab {
      flex: 1;
      padding: 0.5rem;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .auth-tab.active {
      opacity: 1;
      border-bottom: 2px solid var(--primary-color, #7c3aed);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .auth-error {
      color: #f85149;
      font-size: 0.85rem;
      display: none;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border-color, #333);
    }

    .auth-divider span {
      padding: 0 0.5rem;
      font-size: 0.85rem;
      opacity: 0.6;
    }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .google-icon {
      flex-shrink: 0;
    }

    .auth-note {
      text-align: center;
      margin-top: 1rem;
      opacity: 0.6;
    }
  `;
}

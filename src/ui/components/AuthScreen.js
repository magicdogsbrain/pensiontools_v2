/**
 * Full-page authentication screen component
 * Displays login/signup form and blocks app access until authenticated
 */

import {
  isFirebaseConfigured,
  isLoggedIn,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  resetPassword,
  onAuthStateChange
} from '../../firebase/index.js';

// Auth screen state
let authScreenElement = null;
let onAuthSuccessCallback = null;
let authProcessed = false; // Prevent duplicate callback firing

/**
 * Initialize the auth screen
 * @param {HTMLElement} container - Container element for the auth screen
 * @param {Function} onSuccess - Callback when auth succeeds
 */
export function initAuthScreen(container, onSuccess) {
  console.log('initAuthScreen: initializing');
  authScreenElement = container;
  onAuthSuccessCallback = onSuccess;
  authProcessed = false; // Reset on init

  // Listen for auth state changes
  onAuthStateChange((user) => {
    console.log('AuthScreen: auth state change received:', user ? user.email : 'null', 'processed:', authProcessed);
    if (user && onAuthSuccessCallback && !authProcessed) {
      console.log('AuthScreen: calling onAuthSuccessCallback');
      authProcessed = true; // Mark as processed to prevent duplicate calls
      onAuthSuccessCallback(user);
    } else if (!user) {
      // Reset when user signs out
      authProcessed = false;
      console.log('AuthScreen: user signed out, reset authProcessed');
    } else {
      console.log('AuthScreen: skipping callback, already processed or no callback');
    }
  });

  renderAuthScreen();
  console.log('initAuthScreen: complete');
}

/**
 * Render the auth screen
 */
export function renderAuthScreen() {
  if (!authScreenElement) return;

  if (!isFirebaseConfigured()) {
    authScreenElement.innerHTML = `
      <div class="auth-screen">
        <div class="auth-screen-box">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Firebase not configured</p>
          </div>
          <div class="auth-screen-error">
            <p>This app requires Firebase authentication to save your data.</p>
            <p>Please contact the administrator to configure Firebase.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  authScreenElement.innerHTML = `
    <div class="auth-screen">
      <div class="auth-screen-box">
        <div class="auth-screen-header">
          <h1>Pension Planner</h1>
          <p>A tool to help you plan and manage your SIPP pension drawdown</p>
        </div>

        <div class="auth-screen-tabs">
          <button class="auth-screen-tab active" data-tab="signin">Sign In</button>
          <button class="auth-screen-tab" data-tab="signup">Sign Up</button>
        </div>

        <div id="authScreenError" class="auth-screen-error" style="display: none;"></div>

        <!-- Sign In Form -->
        <form id="signinForm" class="auth-screen-form">
          <div class="auth-screen-field">
            <label>Email</label>
            <input type="email" id="signinEmail" placeholder="your@email.com" required>
          </div>
          <div class="auth-screen-field">
            <label>Password</label>
            <input type="password" id="signinPassword" placeholder="Enter password" required>
          </div>
          <button type="submit" class="auth-screen-btn primary">Sign In</button>
          <button type="button" class="auth-screen-btn secondary" id="forgotPasswordBtn">Forgot Password?</button>
        </form>

        <!-- Sign Up Form -->
        <form id="signupForm" class="auth-screen-form" style="display: none;">
          <div class="auth-screen-field">
            <label>Name</label>
            <input type="text" id="signupName" placeholder="Your name" required>
          </div>
          <div class="auth-screen-field">
            <label>Email</label>
            <input type="email" id="signupEmail" placeholder="your@email.com" required>
          </div>
          <div class="auth-screen-field">
            <label>Password</label>
            <input type="password" id="signupPassword" placeholder="Create password (6+ chars)" required minlength="6">
          </div>
          <button type="submit" class="auth-screen-btn primary">Create Account</button>
        </form>

        <div class="auth-screen-divider">
          <span>or</span>
        </div>

        <button class="auth-screen-btn google" id="googleSigninBtn">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign in with Google
        </button>

        <div class="auth-screen-footer">
          <p>Your data is stored securely in the cloud and synced across devices.</p>
        </div>
      </div>
    </div>
  `;

  // Set up event listeners
  setupAuthScreenListeners();
}

/**
 * Set up event listeners for auth screen
 */
function setupAuthScreenListeners() {
  // Tab switching
  const tabs = authScreenElement.querySelectorAll('.auth-screen-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const signinForm = document.getElementById('signinForm');
      const signupForm = document.getElementById('signupForm');

      if (tab.dataset.tab === 'signin') {
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
      } else {
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
      }

      hideError();
    });
  });

  // Sign in form
  const signinForm = document.getElementById('signinForm');
  signinForm.addEventListener('submit', handleSignIn);

  // Sign up form
  const signupForm = document.getElementById('signupForm');
  signupForm.addEventListener('submit', handleSignUp);

  // Forgot password
  const forgotBtn = document.getElementById('forgotPasswordBtn');
  forgotBtn.addEventListener('click', handleForgotPassword);

  // Google sign in
  const googleBtn = document.getElementById('googleSigninBtn');
  googleBtn.addEventListener('click', handleGoogleSignIn);
}

/**
 * Show error message
 */
function showError(message) {
  const errorEl = document.getElementById('authScreenError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

/**
 * Hide error message
 */
function hideError() {
  const errorEl = document.getElementById('authScreenError');
  if (errorEl) {
    errorEl.style.display = 'none';
  }
}

/**
 * Handle sign in form submission
 */
async function handleSignIn(event) {
  event.preventDefault();
  hideError();

  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;

  if (!email || !password) {
    showError('Please enter email and password');
    return;
  }

  try {
    await signInWithEmail(email, password);
    // Auth state listener will handle redirect
  } catch (error) {
    console.error('Sign in error:', error);
    showError(getAuthErrorMessage(error.code));
  }
}

/**
 * Handle sign up form submission
 */
async function handleSignUp(event) {
  event.preventDefault();
  hideError();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    showError('Please fill in all fields');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }

  try {
    await signUpWithEmail(email, password, name);
    // Auth state listener will handle redirect
  } catch (error) {
    console.error('Sign up error:', error);
    showError(getAuthErrorMessage(error.code));
  }
}

/**
 * Handle forgot password
 */
async function handleForgotPassword() {
  hideError();

  const email = document.getElementById('signinEmail').value.trim();

  if (!email) {
    showError('Please enter your email address first');
    return;
  }

  try {
    await resetPassword(email);
    alert('Password reset email sent. Check your inbox.');
  } catch (error) {
    console.error('Reset password error:', error);
    showError(getAuthErrorMessage(error.code));
  }
}

/**
 * Handle Google sign in
 */
async function handleGoogleSignIn() {
  hideError();

  try {
    await signInWithGoogle();
    // Auth state listener will handle redirect
  } catch (error) {
    console.error('Google sign in error:', error);
    showError(getAuthErrorMessage(error.code));
  }
}

/**
 * Get user-friendly error message
 */
function getAuthErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/weak-password': 'Password is too weak',
    'auth/operation-not-allowed': 'Sign in method not enabled',
    'auth/popup-closed-by-user': 'Sign in cancelled',
    'auth/popup-blocked': 'Sign in popup was blocked',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password'
  };

  return messages[code] || 'An error occurred. Please try again.';
}

/**
 * Hide the auth screen
 */
export function hideAuthScreen() {
  console.log('hideAuthScreen: hiding auth screen, element=', !!authScreenElement);
  if (authScreenElement) {
    authScreenElement.style.display = 'none';
    console.log('hideAuthScreen: set display to none');
  }
}

/**
 * Show the auth screen
 */
export function showAuthScreen() {
  authProcessed = false; // Reset so callback can fire on next sign-in
  if (authScreenElement) {
    authScreenElement.style.display = 'block';
    renderAuthScreen();
  }
}

/**
 * Get auth screen styles
 */
export function getAuthScreenStyles() {
  return `
    .auth-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .auth-screen-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 100%;
    }

    .auth-screen-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-screen-header h1 {
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .auth-screen-header p {
      color: var(--text-muted);
      font-size: 14px;
    }

    .auth-screen-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      background: var(--card-alt);
      padding: 4px;
      border-radius: 8px;
    }

    .auth-screen-tab {
      flex: 1;
      padding: 12px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .auth-screen-tab:hover {
      color: var(--text);
    }

    .auth-screen-tab.active {
      background: var(--primary);
      color: var(--bg);
    }

    .auth-screen-error {
      background: rgba(248, 81, 73, 0.15);
      border: 1px solid rgba(248, 81, 73, 0.3);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      color: var(--danger);
      font-size: 14px;
    }

    .auth-screen-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .auth-screen-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .auth-screen-field label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .auth-screen-field input {
      padding: 12px 14px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
      width: 100%;
    }

    .auth-screen-field input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .auth-screen-btn {
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }

    .auth-screen-btn.primary {
      background: var(--primary);
      color: var(--bg);
    }

    .auth-screen-btn.primary:hover {
      opacity: 0.9;
    }

    .auth-screen-btn.secondary {
      background: transparent;
      color: var(--text-muted);
      padding: 10px;
    }

    .auth-screen-btn.secondary:hover {
      color: var(--text);
    }

    .auth-screen-btn.google {
      background: white;
      color: #333;
      margin-top: 8px;
    }

    .auth-screen-btn.google:hover {
      background: #f5f5f5;
    }

    .auth-screen-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 24px 0;
    }

    .auth-screen-divider::before,
    .auth-screen-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .auth-screen-divider span {
      color: var(--text-muted);
      font-size: 12px;
    }

    .auth-screen-footer {
      margin-top: 24px;
      text-align: center;
    }

    .auth-screen-footer p {
      color: var(--text-muted);
      font-size: 12px;
    }

    @media (max-width: 480px) {
      .auth-screen-box {
        padding: 24px;
      }

      .auth-screen-header h1 {
        font-size: 24px;
      }
    }
  `;
}

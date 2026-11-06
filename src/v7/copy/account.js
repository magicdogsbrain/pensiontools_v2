/**
 * The words of "Your account" (research/v7/road-to-7.md step 11): the account page for someone signed in (the email, the
 * password-reset email, "Download everything", "Delete my account", "Sign out", the privacy policy), and for someone who is
 * not: the sign-in, sign-up and forgotten-password forms, and the "Confirm your email" gate — the planner's own screens
 * (src/ui/components/AuthScreen.js) in plain words. Data only — this file imports nothing. Placeholders are written
 * {likeThis} and filled by the screen. The deletion names what goes, as compliance/PRIVACY_POLICY.md says it.
 */
export const ACCOUNT = {
  title: 'Your account',
  opening: 'Checking who is signed in…',
  signedInAs: 'Signed in as {email}.',
  confirmed: 'Email confirmed.',
  /** The sections of the signed-in page. */
  password: {
    title: 'Your password',
    note: 'To change your password, use the reset email: it has a link to choose a new one. There is no password box here.',
    button: 'Send me a password-reset email',
    sent: 'A password-reset email is on its way to {email}. Follow its link to choose a new password.'
  },
  download: {
    title: 'A copy of everything',
    note: 'One file with every plan in your account and your settings, saved on your own computer. Nothing is sent anywhere.',
    button: 'Download everything',
    done: 'Downloaded: {file}.'
  },
  remove: {
    title: 'Delete my account',
    note: 'This deletes your sign-in and everything kept under it. There is no way back.',
    button: 'Delete my account',
    ask1: 'Delete your account? This deletes every plan, every monthly record and every budget in it, and the sign-in itself. This cannot be undone.',
    ask2: 'Last check. Your account and every plan in it will be gone for good. Delete everything?',
    yes1: 'Delete my account',
    yes2: 'Yes, delete everything',
    no: 'Keep my account',
    working: 'Deleting…',
    done: 'Your account and everything in it have been deleted.',
    /** The planner's auth/requires-recent-login case: the data is already gone; the sign-in needs a fresh sign-in to go. */
    needsSignIn: 'Your plans and settings have been deleted. The sign-in itself can only be removed soon after you sign in, so sign in again below and press “Delete my account” once more to finish.'
  },
  signOut: 'Sign out',
  privacy: 'Privacy policy',
  /** Nobody signed in: the forms. */
  forms: {
    lead: 'An account keeps your plans for good, on every device you sign in on. Without one you can keep up to three plans in this browser window.',
    signIn: 'Sign in',
    signUp: 'Create a free account',
    reset: 'Forgotten your password?',
    email: 'Email',
    password: 'Password',
    newPassword: 'Choose a password (at least 6 characters)',
    google: 'Continue with Google',
    or: 'or',
    submitSignIn: 'Sign in',
    submitSignUp: 'Create the account',
    submitReset: 'Send the reset email',
    toSignUp: 'No account? Create one',
    toSignIn: 'I have an account — sign in',
    toReset: 'Forgotten your password?',
    back: 'Back to signing in',
    working: 'One moment…',
    resetSent: 'If there is an account for {email}, a password-reset email is on its way. Follow its link to choose a new password.',
    signedUp: 'Your account is made. We have sent a confirmation email to {email}: follow its link, then press “I’ve confirmed”.'
  },
  /** Signed in, the email not confirmed yet (the same gate as the planner: the server refuses an unconfirmed account). */
  verify: {
    title: 'Confirm your email',
    line: 'We have sent a confirmation link to {email}. Follow it, then come back here.',
    note: 'Your plans stay closed until the email is confirmed.',
    check: 'I’ve confirmed',
    send: 'Send it again',
    sent: 'Sent again. Check your inbox, and the junk folder.',
    notYet: 'Not confirmed yet. Follow the link in the email first, then try again.'
  },
  /** The sign-in service's reasons, in plain words (the planner's AuthScreen.getAuthErrorMessage), and ours. */
  problems: {
    'auth/invalid-email': 'That is not an email address.',
    'auth/user-disabled': 'This account has been closed.',
    'auth/user-not-found': 'There is no account with that email.',
    'auth/wrong-password': 'That password is not right.',
    'auth/invalid-credential': 'That email and password do not match.',
    'auth/email-already-in-use': 'There is already an account with that email. Sign in instead.',
    'auth/weak-password': 'Choose a longer password: at least 6 characters.',
    'auth/operation-not-allowed': 'That way of signing in is switched off.',
    'auth/popup-closed-by-user': 'The sign-in window was closed before it finished.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-up windows for this site and try again.',
    'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
    'auth/network-request-failed': 'We could not reach the sign-in service. Check your connection and try again.',
    'auth/requires-recent-login': 'For safety this needs a fresh sign-in. Sign out, sign in again, then try once more.',
    empty: 'Type your email and your password.',
    emptyEmail: 'Type your email address.',
    notSignedIn: 'You are not signed in.',
    deleteFailed: 'Some of your data could not be deleted. Nothing more was changed: try again, or email privacy@usefulish.uk.',
    failed: 'Sorry, that did not work. Try again.'
  }
};

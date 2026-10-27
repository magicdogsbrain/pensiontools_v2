/**
 * The words for a visitor without an account (research/v7/road-to-7.md step 11; v6-usability-audit.md 2.1 and decision 7):
 * the one rule said the same way everywhere (services/GuestMeter.js GUEST_RULE, letter for letter — tests/visitors.test.js
 * holds the two together), the banner line on "Your plans", the four reminders of the three free hours, the stop when
 * they are used up, and "Bring in what you built without an account?" after a sign-in. Data only — this file imports
 * nothing. Placeholders are written {likeThis} and filled by the screen. Never "guest" (the banned list): "without an account".
 */
export const GUEST = {
  /** The one rule (GuestMeter.js GUEST_RULE). */
  rule: 'Kept in this browser window until you close it. Make a free account to keep it for good.',
  /** The banner on "Your plans" while the window holds plans and nobody is signed in. {used} is "12 min" or "1.5 h". */
  banner: 'Without an account: kept in this browser window until you close it. Make a free account to keep it for good. {used} of your 3 free hours used.',
  usedMinutes: '{n} min',
  usedHours: '{n} h',
  /** The reminders, by level (GuestMeter.js GUEST_NAG_MINUTES: 15, 45, 90, 150 minutes). {left} is "2.2 hours" or "30 minutes". */
  reminders: {
    1: 'You have been trying things for a quarter of an hour. Kept in this browser window until you close it. Make a free account to keep it for good.',
    2: 'Your plans are kept in this browser window only. You have {left} of free time left without an account; make a free account now and everything you have built is kept for good.',
    3: 'Sign in soon: {left} of free time left without an account. Your plans are copied into your account when you do.',
    4: 'Last reminder before the free time stops: {left} left. Sign in and keep your work.'
  },
  leftHours: '{n} hours',
  leftMinutes: '{n} minutes',
  /** The firm reminders (levels 3 and 4) as a box with buttons; the gentle ones as a line. */
  remind: {
    title: 'Keep what you have built',
    line: 'Signing in copies your plans into your account — nothing is lost, and nothing is sent anywhere until you do.',
    signUp: 'Create a free account and keep this work',
    signIn: 'I have an account — sign in',
    notYet: 'Not yet',
    gotIt: 'Got it'
  },
  /** The stop: the three hours are used up (GuestMeter.js GUEST_ALLOWANCE_MINUTES). On every page but the account page. */
  stop: {
    title: 'Your 3 free hours are used up — sign in to keep going',
    line: 'Without an account the preview is for trying things. To carry on, and to keep what you have built here, sign in or create a free account: your plans are copied into your account the moment you do. Nothing is lost.',
    signIn: 'Sign in or create a free account',
    ask: 'Or ask a question: an answer needs no account.'
  },
  /** After a sign-in with plans in this window (the planner's importGuestHandoff). */
  bringIn: {
    title: 'Bring in what you built without an account?',
    one: 'One plan made in this window without an account is waiting here. Copy it into this account? It will be named “… (from this window)”.',
    many: '{n} plans made in this window without an account are waiting here. Copy them into this account? They will be named “… (from this window)”.',
    yesOne: 'Yes, bring it in',
    yesMany: 'Yes, bring them in',
    no: 'No, leave them here',
    noNote: 'A plan left here stays in this window until you close it.',
    working: 'Bringing in…',
    failed: 'Sorry, the plans could not be copied. They are still in this window: try again.',
    /** The mark on each name brought in (the planner marks its own "(from guest)"). */
    suffix: ' (from this window)'
  }
};

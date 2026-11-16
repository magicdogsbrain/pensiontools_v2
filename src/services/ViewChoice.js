/**
 * The view PensionTools opens in for someone signed in (7.11.1): the full view, unless the account holds the choice of the
 * simple view. The account's settings document (users/{uid}/profile/settings `view`) stores a choice only when one was made
 * on Your account; nothing is ever written for someone who never chose. One rule for both views: the simple view's landing,
 * its copy of the choice in this browser and Your account (src/v7/effects/place.js, src/v7/effects/view.js,
 * src/v7/state/select.js), and the full view's sign-in (src/ui/viewNotes.js).
 *
 *   openingView(profile)   'simple' when the settings say so; else 'full' (no choice stored, or the full view chosen).
 *                          The settings as read: a caller asks only once they were read (a failed read is not a choice).
 */
export const openingView = (profile) => (profile && typeof profile === 'object' && profile.view === 'simple' ? 'simple' : 'full');

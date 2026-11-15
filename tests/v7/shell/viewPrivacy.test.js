/**
 * The privacy policy names the view the site opens in (7.11.0), in both copies, the same words: the choice kept with the
 * account's settings (App preferences), this browser's copy of it and the strip's "Not now" (Storage in your browser),
 * and the move from the simple view to the full view. Signing out in either view clears the browser's notes, so the
 * policy's "Signing out … clear these items" is true of them, and nothing says a sign-out leaves them. A sign-in that ends
 * somewhere else (a password changed on another device) does leave them until the simple view is next opened here, and
 * the policy says so. Neither copy speaks of a "new version" or a "previous version" (7.11.0: no words call a view a
 * version; the policy's own updates are "the updated policy").
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
/** A copy's words as one line: tags and line breaks out, so the two copies read alike. */
const words = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/\s+/g, ' ');
const COPIES = ['compliance/PRIVACY_POLICY.md', 'public/privacy.html'];

describe.each(COPIES)('%s', (rel) => {
  const text = words(rel);
  it('App preferences: which view the site opens in, kept so it opens there', () => {
    expect(text).toContain('the plan and page you were last on (which plan and which step, no figures); which view the site opens in (simple or full)');
    expect(text).toContain('show release notes once, not every visit; open where you left off, in the view you chose');
  });
  it('Storage in your browser: this browser\'s copy of the choice, and the strip\'s "Not now"', () => {
    expect(text).toContain('a note that you are signed in on this browser, whether you chose the full view as the one the site opens in (so it can open there at once), whether you said “Not now” when asked which view to open in, and, for each browser window, the plan and page you were last on');
    expect(text).toContain('When you move from the simple view to the full view, this browser tab notes which plan and page to open');
    expect(text).toContain('Signing out, "Reset" and "Delete Account" clear these items.');
  });
  it('no word of the classic planner, and nothing left behind by a sign-out in the full view', () => {
    expect(text).not.toMatch(/classic planner/i);
    expect(text).not.toMatch(/If you sign out in the full view/);
    expect(text).not.toMatch(/may stay in this browser/);
  });
  it('a sign-in ended somewhere else leaves the notes until the simple view is next opened here, and the policy says so', () => {
    expect(text).toContain('Signing out, "Reset" and "Delete Account" clear these items. If you are signed out from somewhere else instead (for example, when your password is changed on another device), the notes about signing in and about the view stay in this browser until the simple view is next opened in it; until then, if you chose the full view, the site\'s address opens the full view.');
  });
  it('no "new version" or "previous version" anywhere in it', () => {
    expect(text).not.toMatch(/\bnew version\b|\bprevious version\b/i);
    expect(text).toContain('We will update this policy as the app changes and post the updated policy here.');
  });
});

describe('the two copies', () => {
  it('say the same about the view', () => {
    const pick = (t) => t.match(/which view the site opens in \(simple or full\)|in the view you chose|whether you chose the full view[^,]*|whether you said “Not now”[^,]*|When you move from the simple view to the full view|If you are signed out from somewhere else[^.]*\./g);
    expect(pick(words(COPIES[0]))).toEqual(pick(words(COPIES[1])));
    expect(pick(words(COPIES[0])).length).toBe(6);   // 7.11.0's review: a sign-in ended elsewhere, the sixth
  });
});

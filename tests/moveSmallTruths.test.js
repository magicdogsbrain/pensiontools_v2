/**
 * Small truths about the move (7.12.0, the moving brief S6/S7), each read once:
 *   - the full view opens on Transition for a Moving plan only when What you hold has a line;
 *   - "What you hold" never says a ladder's line is "not placed in the mix" (the move counts it either way); on a pot plan it says
 *     plainly what is left out;
 *   - a line the person said holds shares is never tested as one company's shares;
 *   - an old document with no saving path says why, without asking to record what you hold.
 * Fictional figures only.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { openingTab } from '../src/services/LifeStage.js';
import { holdingsCardHtml } from '../src/ui/components/TransitionView.js';
import { keptAssetsOf } from '../src/answers/plan/keepTest.js';
import { saverReadingText } from '../src/ui/components/PlanDocumentView.js';

describe('the full view\'s opening tab', () => {
  it('Moving with nothing recorded opens as any other stage; with a line recorded, on Transition', () => {
    const stage = { key: 'retired-locked', leads: [] };
    expect(openingTab(stage, 'moving', { recorded: false })).toBe(openingTab(stage, null));
    expect(openingTab(stage, 'moving', { recorded: true })).toBe('transition');
  });
});

describe('What you hold: a line nothing places', () => {
  const lines = [{ wrapper: 'SIPP', ticker: 'ZZQQ', name: 'Unknown Fund A', value: 30000 }, { wrapper: 'SIPP', ticker: 'ZZQR', name: 'Unknown Fund B', value: 12000 }];
  it('a ladder never says "not placed in the mix" (the move counts the money either way)', () => {
    const html = holdingsCardHtml({ holdings: { lines }, keep: { ladder: true, years: [] } });
    expect(html).not.toContain('not placed in the mix');
    expect(html).not.toContain('We could not tell what');
  });
  it('a pot plan says what is left out of the mix figures, and why', () => {
    // by hand: 30,000 + 12,000 = £42,000 in 2 lines
    expect(holdingsCardHtml({ holdings: { lines }, keep: { ladder: false, years: [] } })).toContain('We could not tell what 2 lines hold (£42,000), so they are left out of the mix figures until you say what each is.');
    expect(holdingsCardHtml({ holdings: { lines: lines.slice(0, 1) }, keep: { ladder: false, years: [] } })).toContain('We could not tell what 1 line holds (£30,000), so it is left out of the mix figures until you say what it is.');
  });
});

describe('the keep test\'s one-company sentence', () => {
  it('a line the person said holds shares is not one company\'s shares; an unsaid one still is', () => {
    const said = keptAssetsOf({ lines: [{ wrapper: 'SIPP', ticker: 'ZZQQ', name: 'Some Fund', value: 20000, subClass: 'worldGrowth', keep: { as: 'mine' } }] });
    expect(said[0].single).toBe(false);
    const unsaid = keptAssetsOf({ lines: [{ wrapper: 'SIPP', ticker: 'ZZQQ', name: 'Example Shares plc', value: 20000, keep: { as: 'mine' } }] });
    expect(unsaid[0].single).toBe(true);
  });
});

describe('an old document locked with no pension figure', () => {
  it('says why there is no path, and never asks to record what you hold', () => {
    const t = saverReadingText({ pathMissing: true, actual: 400000, actualSource: 'holdings' });
    expect(t).toBe('This plan was locked before it had a pension figure to draw a saving path from. Your pension today is £400,000 (from what you hold). A new version of the plan document adds the path.');
    expect(saverReadingText({ pathMissing: true, actual: null })).toBe('This plan was locked before it had a pension figure to draw a saving path from. A new version of the plan document adds the path.');
  });
});

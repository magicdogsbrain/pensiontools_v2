/**
 * The full view's Transition tab reads gilts (what you hold, the gaps, a gilt matured since) only once the day's prices are
 * in (lead4.md R5: one market for both views). The simple view's holdings page already waits (step M); the full view drew
 * from the built-in gilt list first when the tab was drawn before the day's file arrived.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('loadTransitionUI waits for the day\'s prices', () => {
  it('awaits window._marketReady before any gilt is read', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('window.loadTransitionUI = async function');
    const body = src.slice(at, src.indexOf('window._transitionLast = { diff, seq };', at));
    const wait = body.indexOf('await window._marketReady');
    expect(wait).toBeGreaterThan(-1);
    for (const reader of ['diffHoldings(', 'transitionGaps(', 'transitionHeld(', 'targetHoldings(']) expect(wait, reader).toBeLessThan(body.indexOf(reader));
  });
});

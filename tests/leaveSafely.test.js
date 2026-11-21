/**
 * Sign Out, closing and reloading send what was typed first (lead4.md R3; the lead's ruling on step S): a Settings,
 * Accumulation or Budget save still waiting is flushed before the person signs out, and on close or reload the flush starts
 * at once; while a save is still on its way the browser asks before leaving, so typing is never lost without a word.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { installLeaveSafely, signOutSafely } from '../src/ui/leaveSafely.js';
import { createAutosave } from '../src/ui/settingsAutosave.js';

describe('installLeaveSafely', () => {
  let flush, waiting;
  beforeEach(() => { flush = vi.fn(async () => {}); waiting = false; });
  const leave = () => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e; };
  it('a save on its way: the flush starts and the browser is asked to hold the page', () => {
    installLeaveSafely(window, document, { flush, waiting: () => waiting });
    waiting = true;
    const e = leave();
    expect(flush).toHaveBeenCalled();
    expect(e.defaultPrevented).toBe(true);
  });
  it('nothing waiting: the page leaves without a question', () => {
    installLeaveSafely(window, document, { flush, waiting: () => waiting });
    const e = leave();
    expect(e.defaultPrevented).toBe(false);
  });
  it('the page hidden or put away starts the flush', () => {
    installLeaveSafely(window, document, { flush, waiting: () => waiting });
    window.dispatchEvent(new Event('pagehide'));
    expect(flush).toHaveBeenCalledTimes(1);
  });
});

describe('signOutSafely', () => {
  it('flushes before signing out, and signs out even when the flush fails', async () => {
    const order = [];
    await signOutSafely(async () => { order.push('flush'); }, async () => { order.push('out'); });
    expect(order).toEqual(['flush', 'out']);
    order.length = 0;
    await signOutSafely(async () => { order.push('flush'); throw new Error('x'); }, async () => { order.push('out'); });
    expect(order).toEqual(['flush', 'out']);
  });
  it('index.html: Sign Out and the sign-out after an idle hour both go through it', () => {
    const src = readFileSync('index.html', 'utf8');
    expect(src.match(/await signOutSafely\(flushSettings, logOut\)/g) || []).toHaveLength(2);
    expect(src).not.toMatch(/^\s*await logOut\(\);/m);
    expect(src).toMatch(/installLeaveSafely\(window, document, \{ flush: flushSettings, waiting: savesWaiting \}\)/);
  });
});

describe('the autosave says when a save is on its way', () => {
  it('waiting(): true while one is scheduled, false once it has gone', async () => {
    document.body.innerHTML = '<div id="f"><h2>S</h2><input id="a" value="1"></div>';
    const save = vi.fn(async () => true);
    const a = createAutosave(window, document, { root: () => document.getElementById('f'), heading: () => document.querySelector('h2'), canSave: async () => true, planId: async () => 'p', save, visible: () => true });
    await a.loaded();
    expect(a.waiting()).toBe(false);
    document.getElementById('a').value = '2';
    a.schedule(5);
    expect(a.waiting()).toBe(true);
    await a.flush();
    expect(save).toHaveBeenCalled();
    expect(a.waiting()).toBe(false);
  });
});

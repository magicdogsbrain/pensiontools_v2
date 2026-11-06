/**
 * The planner's guest hand-off (index.html importGuestHandoff) with two planner tabs open at a sign-in: both ask "Bring in
 * what you built as a guest?". Answered Yes in one tab, the plans are brought in and the stash cleared; answered Yes later
 * in the other, it read the stash again before copying, so nothing is copied twice. The function's own text is run here,
 * with the real GuestMeter stash and fakes for the store. Fictional: "Sam".
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { stashHandoff, readHandoff, clearHandoff } from '../src/services/GuestMeter.js';

/** The function's text, by brace matching from its head. */
function extract(html, head) {
  const start = html.indexOf(head);
  if (start < 0) throw new Error('not found: ' + head);
  let i = html.indexOf('{', start), depth = 0;
  for (; i < html.length; i++) { if (html[i] === '{') depth++; else if (html[i] === '}' && --depth === 0) break; }
  return html.slice(start, i + 1);
}
const SOURCE = extract(readFileSync('index.html', 'utf8'), 'async function importGuestHandoff()');

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const held = () => { let resolve; const p = new Promise((a) => { resolve = a; }); return { p, resolve }; };

/** One planner tab: the hand-off over the shared browser storage and the shared account. */
function tab(localStorage, account) {
  const asked = held();
  const deps = {
    localStorage,
    guestReadHandoff: readHandoff,
    guestClearHandoff: clearHandoff,
    appConfirm: vi.fn(() => asked.p),
    hasCloudData: async () => account.length > 0,
    createScenarioDoc: async (data) => { account.push(data.planDetails ? data.planDetails.name : data.name); return 'id' + account.length; },
    invalidateScenarioCache: () => {}, invalidateCache: () => {}, invalidateStressCache: () => {},
    showToast: vi.fn(),
    console: { error: () => {} }
  };
  const names = Object.keys(deps);
  const run = new Function(...names, SOURCE + '\nreturn importGuestHandoff();');
  return { start: () => run(...names.map((k) => deps[k])), answer: (yes) => asked.resolve(yes), deps };
}

describe('the planner\'s guest hand-off in two tabs', () => {
  it('Yes in one tab, then Yes in the other: the plans are copied once', async () => {
    const storage = memoryStorage();
    const plan = { id: 'guest-1', planDetails: { name: 'Sam' }, stressTool: { settings: {} } };
    stashHandoff(storage, [plan]);
    const account = [];
    const a = tab(storage, account), b = tab(storage, account);
    const doneA = a.start(), doneB = b.start();
    a.answer(true);
    expect(await doneA).toBe(true);
    expect(readHandoff(storage)).toBe(null);
    b.answer(true);
    expect(await doneB).toBe(false);
    expect(account).toEqual(['Sam (from guest)']);
  });

  it('one tab: Yes copies, No clears and copies nothing (as before)', async () => {
    const storage = memoryStorage();
    stashHandoff(storage, [{ id: 'guest-2', planDetails: { name: 'Sam' } }]);
    const account = [];
    const one = tab(storage, account);
    const done = one.start();
    one.answer(true);
    expect(await done).toBe(true);
    expect(account).toEqual(['Sam (from guest)']);
    stashHandoff(storage, [{ id: 'guest-3', planDetails: { name: 'Sam' } }]);
    const two = tab(storage, account);
    const no = two.start();
    two.answer(false);
    expect(await no).toBe(false);
    expect(readHandoff(storage)).toBe(null);
    expect(account).toEqual(['Sam (from guest)']);
  });
});

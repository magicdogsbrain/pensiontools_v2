// @vitest-environment node
/**
 * The kill switch (public/sw.js; research/v7/switch-readiness.md §3), run in a stand-in for a service worker's scope.
 * The browser test (e2e/old-worker.spec.js) clears a real old worker; this pins the steps and their order:
 *   - install: skipWaiting, so it takes over at once;
 *   - activate: the windows the old worker was serving are read BEFORE the claim (the loop guard), the old caches are
 *     deleted (those named pension-planner…, nothing else), the clients claimed, the registration unregistered, and each
 *     served window navigated once to its own address; a window that refuses, or a browser with no navigate, is let be;
 *   - unregister comes before the reloads (a reload waits for the activation, which would wait for the reload);
 *   - no fetch handler: it never answers a request;
 *   - registered afresh with no window controlled: nothing is reloaded.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const SOURCE = readFileSync(join(process.cwd(), 'public', 'sw.js'), 'utf8');

/** A service worker's scope with the given windows (those its predecessor controlled) and caches; every call is logged in order. */
function scope({ served = [], cacheNames = [] } = {}) {
  const log = [];
  const listeners = {};
  const names = new Set(cacheNames);
  const self = {
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: () => { log.push('skipWaiting'); return Promise.resolve(); },
    clients: {
      // a window at an address with "refuses" rejects the reload; "throws" throws at once; "no-navigate" has no navigate
      // method at all (a browser without WindowClient.navigate)
      matchAll: async (o) => {
        log.push('matchAll ' + JSON.stringify(o));
        return served.map((url) => (url.includes('no-navigate') ? { url } : {
          url,
          navigate: url.includes('throws')
            ? (to) => { log.push('navigate ' + to); throw new TypeError('not a function of this window'); }
            : async (to) => { log.push('navigate ' + to); if (url.includes('refuses')) throw new TypeError('not controlled'); return null; }
        }));
      },
      claim: async () => { log.push('claim'); }
    },
    registration: { unregister: async () => { log.push('unregister'); return true; } }
  };
  const caches = {
    keys: async () => { log.push('keys'); return [...names]; },
    delete: async (n) => { log.push('delete ' + n); return names.delete(n); }
  };
  runInNewContext(SOURCE, { self, caches, Promise });
  async function fire(type) {
    const waits = [];
    listeners[type]({ waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
  }
  return { log, listeners, names, fire };
}

describe('the kill switch', () => {
  it('install: takes over at once', async () => {
    const s = scope();
    await s.fire('install');
    expect(s.log).toEqual(['skipWaiting']);
  });
  it('activate: reads the served windows first, deletes the old caches only, claims, unregisters, then reloads each served window once at its own address', async () => {
    const s = scope({ served: ['https://example.test/', 'https://example.test/v7/#/plans'], cacheNames: ['pension-planner-v17', 'pension-planner-D9NrS-eI', 'someone-else'] });
    await s.fire('activate');
    expect(s.log).toEqual([
      'matchAll {"type":"window"}',
      'keys', 'delete pension-planner-v17', 'delete pension-planner-D9NrS-eI',
      'claim', 'unregister',
      'navigate https://example.test/', 'navigate https://example.test/v7/#/plans'
    ]);
    expect([...s.names]).toEqual(['someone-else']);
  });
  it('no window served (registered afresh, nothing controlled): nothing is reloaded, so it cannot loop', async () => {
    const s = scope({ served: [], cacheNames: [] });
    await s.fire('activate');
    expect(s.log.filter((l) => l.startsWith('navigate'))).toEqual([]);
    expect(s.log).toEqual(['matchAll {"type":"window"}', 'keys', 'claim', 'unregister']);
  });
  it('a window that refuses to move does not stop the others', async () => {
    const s = scope({ served: ['https://example.test/refuses', 'https://example.test/'] });
    await s.fire('activate');
    expect(s.log.filter((l) => l.startsWith('navigate'))).toEqual(['navigate https://example.test/refuses', 'navigate https://example.test/']);
  });
  it('a browser with no WindowClient.navigate, or one that throws at once: the activation still completes, after the caches and the unregister, and the other windows reload', async () => {
    const s = scope({ served: ['https://example.test/no-navigate', 'https://example.test/throws', 'https://example.test/v7/'], cacheNames: ['pension-planner-v17'] });
    await s.fire('activate');   // resolves: a rejected activation would throw here
    expect(s.log).toEqual([
      'matchAll {"type":"window"}',
      'keys', 'delete pension-planner-v17',
      'claim', 'unregister',
      'navigate https://example.test/throws', 'navigate https://example.test/v7/'
    ]);
    expect([...s.names]).toEqual([]);
  });
  it('unregisters before any reload: the order the reloads depend on', async () => {
    const s = scope({ served: ['https://example.test/', 'https://example.test/v7/'] });
    await s.fire('activate');
    const firstReload = s.log.findIndex((l) => l.startsWith('navigate'));
    expect(s.log.indexOf('unregister')).toBeGreaterThan(-1);
    expect(s.log.indexOf('unregister')).toBeLessThan(firstReload);
  });
  it('has no fetch handler and keeps nothing: it never answers a request', () => {
    const s = scope();
    expect(Object.keys(s.listeners).sort()).toEqual(['activate', 'install']);
    expect(SOURCE).not.toMatch(/addEventListener\(\s*['"]fetch|caches\.open|\.put\(/);
  });
});

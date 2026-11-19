/**
 * The one market (lead4.md R5): the gilt prices and the share index every run in both views is priced on. One loader, used
 * by the full view's page and engine worker and by the simple view's worker, so a ladder, a bought way or the rotation
 * watch costs the same in both views on the same day.
 *
 * Each JS context (a page or a worker) asks once for the site's ONE data folder (`/data/`, which the nightly job keeps
 * fresh): the page works the folder out from its own layout address (marketFolderOf) and hands it to its worker, so a worker
 * never resolves an address from where its own script happens to sit. The file is used when it loads and is no older than
 * the copy built into the site; else the built-in copy (LinkerUniverse BUNDLED_LINKERS, EquityIndex's snapshot). A load
 * that fails is never an error: the built-in copy stands, and the stamp says so.
 *
 *   marketFolderOf(pageUrl, dataPath)   the data folder as an absolute address ('https://site/data/'), from the page's own
 *                                       address and its layout's data path (src/appLayout.js); null when either is missing
 *   loadMarket({ folder, fetchImpl })   → Promise<stamp>: fetches gilts.json and equity.json from `folder` once per folder in
 *                                       this context (a second call waits on the first); no folder: the built-in copy
 *   marketStamp()                       → { gilts: { source, asOf }, equity: { source, asOf } } — what the next run is
 *                                       priced on: source 'file' (the day's file) or 'builtIn' (the copy in the site)
 *   marketLabel(stamp)                  the ONE label both views draw beside a figure priced on gilts
 *   forgetMarket()                      for the tests: this context back to the built-in copy, nothing asked
 */
import { setLiveGilts, activeLinkers, BUNDLED_LINKERS } from '../services/LinkerUniverse.js';
import { setLiveEquity, activeEquity, BUNDLED_EQUITY } from '../services/EquityIndex.js';

export const MARKET_FILES = Object.freeze({ gilts: 'gilts.json', equity: 'equity.json' });

export { marketFolderOf, marketLabel } from './marketPlain.js';

const asked = new Map();   // folder → the load under way or done

const newerOrSame = (data, built) => !!data && Date.parse(data.generated_at || 0) >= Date.parse((built && built.generated_at) || 0);

async function fetchJson(url, fetchImpl) {
  try {
    const r = await fetchImpl(url, { cache: 'no-cache' });
    if (!r || !r.ok) return null;
    const data = await r.json();
    return data && typeof data === 'object' ? data : null;
  } catch { return null; }
}

export function loadMarket({ folder = null, fetchImpl = globalThis.fetch } = {}) {
  if (!folder || typeof fetchImpl !== 'function') return Promise.resolve(marketStamp());
  if (!asked.has(folder)) {
    asked.set(folder, (async () => {
      const [gilts, equity] = await Promise.all([fetchJson(folder + MARKET_FILES.gilts, fetchImpl), fetchJson(folder + MARKET_FILES.equity, fetchImpl)]);
      if (gilts && Array.isArray(gilts.gilts) && newerOrSame(gilts, BUNDLED_LINKERS)) setLiveGilts(gilts);
      if (equity && Number.isFinite(equity.level) && Number.isFinite(equity.ath) && newerOrSame(equity, BUNDLED_EQUITY)) setLiveEquity(equity);
    })());
  }
  return asked.get(folder).then(() => marketStamp());
}

/** What a run is priced on now, in this context. */
export function marketStamp() {
  const g = activeLinkers();
  const e = activeEquity();
  return {
    gilts: { source: g === BUNDLED_LINKERS ? 'builtIn' : 'file', asOf: (g && (g.curve_as_of || g.as_of)) || null },
    equity: { source: e === BUNDLED_EQUITY ? 'builtIn' : 'file', asOf: (e && e.date) || null }
  };
}

export function forgetMarket() {
  asked.clear();
  setLiveGilts(null);
  setLiveEquity(null);
}

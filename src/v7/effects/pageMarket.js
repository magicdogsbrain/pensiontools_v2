/**
 * The one market on the simple view's own page (lead4.md R5; src/reading/market.js): the folder its worker is told, and the
 * one loader run on the page itself for the pages that read prices there (the move step's share index, "Assumptions and
 * data"). Loaded with import() the first time a page asks, so the shell never carries the gilt list.
 *
 *   pageMarketFolder()                     the site's one data folder from this page (null with no page: the copy built in)
 *   loadPageMarket({ folder, fetchImpl })  → Promise<{ stamp, equity }>: loadMarket's stamp and the share index the market
 *                                            now holds (EquityIndex.activeEquity: the day's file, else the copy built in)
 */
import { marketFolderOf } from '../../reading/marketPlain.js';
import { LAYOUT } from '../../appLayout.js';

export const pageMarketFolder = () => (typeof document !== 'undefined' ? marketFolderOf(document.baseURI, LAYOUT.v7.data) : null);

export async function loadPageMarket({ folder = pageMarketFolder(), fetchImpl } = {}) {
  const m = await import('../../reading/market.js');
  const stamp = await m.loadMarket(fetchImpl ? { folder, fetchImpl } : { folder });
  return { stamp, equity: m.equityNow() };
}

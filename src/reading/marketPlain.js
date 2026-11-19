/**
 * The plain half of the one market (src/reading/market.js): the folder and the one label. Imports nothing, so the simple
 * view's shell can hand the folder to its worker and draw the label without carrying the market data itself.
 *
 *   marketFolderOf(pageUrl, dataPath)   the site's one data folder as an absolute address, from the page's own address and
 *                                       its layout's data path (src/appLayout.js); null when either is missing
 *   marketLabel(stamp)                  the ONE label both views draw beside a figure priced on gilts (stamp: marketStamp)
 */
export function marketFolderOf(pageUrl, dataPath) {
  if (!pageUrl || !dataPath) return null;
  try { return new URL(dataPath, pageUrl).href; } catch { return null; }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayWords = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  return m ? (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : null;
};

/** "Gilts priced at the prices of 12 November 2026 (the day’s file)." — where those prices came from, said the same way in both views. */
export function marketLabel(stamp) {
  const g = stamp && stamp.gilts;
  if (!g) return '';
  const day = dayWords(g.asOf);
  const at = day ? 'Gilts priced at the prices of ' + day : 'Gilts priced at the latest prices we have';
  return at + (g.source === 'file' ? ' (the day’s file).' : ' (the copy built into the site: the day’s file could not be read).');
}

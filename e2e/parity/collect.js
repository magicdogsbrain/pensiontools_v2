/**
 * Reading the marks off a page (lead4.md G3): every visible `data-fact` with the text it shows (a box: its value), every
 * cell of a marked table by its row and column keys, every bound box (`data-field`) with its value, and the count of
 * figure-like text — money, ages, chances, months, percentages, durations — visible outside any mark (G4's unmarked
 * ratchet), with a few samples so a reader can find them.
 *
 * `collectMarks` runs IN the page (page.evaluate): it may use only what a browser has, and nothing from this file's scope.
 */
export function collectMarks() {
  const vis = (el) => {
    if (!el || !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const shown = (el) => (el.matches('input, select, textarea') ? String(el.value ?? '') : String(el.innerText ?? el.textContent ?? ''));
  const clean = (t) => String(t).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  // a mark that shows nothing (its figure not there) is no place of the fact
  const places = [...document.querySelectorAll('[data-fact]')].filter(vis).map((el) => ({ fact: el.getAttribute('data-fact'), text: clean(shown(el)) })).filter((p) => p.text !== '');
  const cells = [];
  for (const t of [...document.querySelectorAll('[data-fact-table]')].filter(vis)) {
    for (const c of t.querySelectorAll('[data-row][data-col]')) {
      if (vis(c)) cells.push({ table: t.getAttribute('data-fact-table'), row: c.getAttribute('data-row'), col: c.getAttribute('data-col'), text: clean(shown(c)) });
    }
  }
  const fields = [...document.querySelectorAll('[data-field]')].filter(vis).map((el) => ({ field: el.getAttribute('data-field'), value: clean(shown(el)) }));
  const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
  const FIG = new RegExp([
    '£\\s?\\d[\\d,]*(?:\\.\\d+)?k?',                         // money
    '\\b\\d{1,3}(?:\\.\\d+)?\\s?%',                           // a percentage
    '\\b(?:' + MONTHS + ') \\d{4}\\b',                       // a month
    '\\b\\d{1,2} (?:times )?(?:in|out of) (?:20|10)\\b',      // a chance
    '\\b(?:age|aged|to|at|from) \\d{2,3}\\b',                  // an age
    '\\b\\d{1,3} years?(?: \\d{1,2} months?)?\\b'              // a duration
  ].join('|'), 'gi');
  let unmarked = 0;
  const samples = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || el.closest('[data-fact], [data-fact-table], script, style, noscript, template, [hidden]')) continue;
    const m = String(n.nodeValue || '').match(FIG);
    if (!m || !vis(el)) continue;
    unmarked += m.length;
    for (const x of m) if (samples.length < 25) samples.push(clean(x));
  }
  return { places, cells, fields, unmarked, samples };
}

/** True while the page is still working out a figure: the busy mark (src/reading/busy.js), or a spinner on screen. */
export function stillWorking() {
  if (document.documentElement.hasAttribute('data-busy')) return true;
  const spin = [...document.querySelectorAll('.spinner, [aria-busy="true"]')];
  return spin.some((el) => !!(el.offsetWidth || el.offsetHeight));
}

/**
 * Waits until nothing is working and the page's text has stopped changing for `quietPolls` looks in a row, 250 ms apart
 * (a run started a moment after a press is caught by the later looks). Gives up after `timeout` and says so: false (the
 * page is then read as it stands).
 */
export async function waitQuiet(page, { timeout = 90_000, quietPolls = 3 } = {}) {
  await page.evaluate(() => { window.__parityLen = -1; window.__parityQuiet = 0; }).catch(() => {});
  return page.waitForFunction((need) => {
    const w = window;
    let busy = document.documentElement.hasAttribute('data-busy');
    if (!busy) busy = [...document.querySelectorAll('.spinner, [aria-busy="true"]')].some((el) => !!(el.offsetWidth || el.offsetHeight));
    const len = document.body ? document.body.innerText.length : 0;
    if (busy || len !== w.__parityLen) { w.__parityLen = len; w.__parityQuiet = 0; return false; }
    w.__parityQuiet = (w.__parityQuiet || 0) + 1;
    return w.__parityQuiet >= need;
  }, quietPolls, { timeout, polling: 250 }).then(() => true, () => false);
}

/**
 * Reading the marks off a page (lead4.md G3): every visible `data-fact` with the text it shows (a box: its value), every
 * cell of a marked table by its row and column keys, every bound box (a form control carrying `data-field`) with its value
 * (a tick as yes/no, a group of radios as the one ticked), and the count of
 * figure-like text — money, ages, chances, months, percentages, durations — visible outside any mark (G4's unmarked
 * ratchet), with a few samples so a reader can find them.
 *
 * `words` names the facts a page shows as words, for the same count: `exact` (a stage, a lock state, a way's name) counts a
 * piece of text outside any mark that is exactly one of them, as a chip or a label shows it; `anywhere` (the plan's own
 * name) counts every time it is written outside a mark.
 *
 * `words.figures` true also returns `figures`: every such figure outside a mark, not only the first samples.
 *
 * `collectMarks` runs IN the page (page.evaluate): it may use only what a browser has, and nothing from this file's scope.
 */
export function collectMarks(words = {}) {
  // inside a closed <details> (its summary aside) nothing is shown, though the browser may still lay it out
  // (content-visibility: hidden keeps boxes with no text): such a place is not on screen
  const folded = (el) => { const d = el.closest('details:not([open])'); return !!d && !(el.closest('summary') && d.contains(el.closest('summary'))); };
  const vis = (el) => {
    if (!el || folded(el) || !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const shown = (el) => (el.matches('input, select, textarea') ? String(el.value ?? '') : String(el.innerText ?? el.textContent ?? ''));
  const clean = (t) => String(t).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  // a mark showing nothing is still a place: blank here and a figure elsewhere is a disagreement
  const places = [...document.querySelectorAll('[data-fact]')].filter(vis).map((el) => ({ fact: el.getAttribute('data-fact'), text: clean(shown(el)) }));
  const cells = [];
  for (const t of [...document.querySelectorAll('[data-fact-table]')].filter(vis)) {
    for (const c of t.querySelectorAll('[data-row][data-col]')) {
      if (vis(c)) cells.push({ table: t.getAttribute('data-fact-table'), row: c.getAttribute('data-row'), col: c.getAttribute('data-col'), text: clean(shown(c)) });
    }
  }
  // a bound box is a form control carrying data-field (the simple view's form wrappers carry their own paths: not read):
  // a text box or a list by its value, a tick as yes/no, a group of radios once, by the one ticked ('' when none is)
  const fields = [];
  const groups = new Map();
  for (const el of document.querySelectorAll('input[data-field], select[data-field], textarea[data-field]')) {
    if (el.type === 'hidden' || !vis(el)) continue;
    const field = el.getAttribute('data-field');
    if (el.type === 'radio') {
      if (!groups.has(field)) { groups.set(field, { field, value: '' }); fields.push(groups.get(field)); }
      if (el.checked) groups.get(field).value = clean(el.value);
      continue;
    }
    fields.push({ field, value: el.type === 'checkbox' ? (el.checked ? 'yes' : 'no') : clean(el.value) });
  }
  const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
  const FIG = new RegExp([
    '£\\s?\\d[\\d,]*(?:\\.\\d+)?k?',                         // money
    '\\b\\d{1,3}(?:\\.\\d+)?\\s?%',                           // a percentage
    '\\b(?:' + MONTHS + ') \\d{4}\\b',                       // a month
    '\\b\\d{1,2} (?:times )?(?:in|out of) (?:20|10)\\b',      // a chance
    '\\b(?:age|aged|to|at|from) \\d{2,3}\\b',                  // an age
    '\\b\\d{1,3} years?(?: \\d{1,2} months?)?\\b',             // a duration
    '\\b\\d{1,3} months?\\b'                                  // a duration in months
  ].join('|'), 'gi');
  const exact = new Set((words.exact || []).map(clean));
  const anywhere = (words.anywhere || []).map(clean).filter(Boolean);
  const timesIn = (t, w) => t.split(w).length - 1;
  let unmarked = 0;
  const samples = [];
  const figures = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || el.closest('[data-fact], [data-fact-table], script, style, noscript, template, [hidden]')) continue;
    const text = String(n.nodeValue || '');
    const m = [...(text.match(FIG) || [])];
    if (exact.has(clean(text))) m.push(clean(text));
    for (const w of anywhere) for (let i = timesIn(clean(text), w); i > 0; i--) m.push(w);
    if (!m.length || !vis(el)) continue;
    unmarked += m.length;
    for (const x of m) if (samples.length < 25) samples.push(clean(x));
    if (words.figures) for (const x of m) figures.push(clean(x));
  }
  return { places, cells, fields, unmarked, samples, ...(words.figures ? { figures } : {}) };
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

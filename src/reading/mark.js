/**
 * The marks (lead4.md section 2, G1): one helper for each kind of mark, so a figure drawn through the reading cannot leave
 * it off. Markup only: nothing a person sees changes. The full view builds HTML strings, so these return strings; the
 * simple view uses src/reading/Mark.jsx (the same attributes, as props).
 *
 *   markFact(id, html)             '<span data-fact="id">html</span>' — html is written as given (already escaped)
 *   factAttr(id)                   ' data-fact="id"' for an element the caller writes itself
 *   factProps(id)                  { 'data-fact': id } for an element made in code (Preact props or setAttribute)
 *   tableAttr(id), cellAttr(r, c)  ' data-fact-table="id"', ' data-row="r" data-col="c"'
 *   fieldAttr(id)                  ' data-field="id"' on a box bound to one field of the plan
 *   setFact(el, id)                the attribute set on a DOM element
 *   markWithin(html, finds)        words already written, with group 1 of the first match of each [RegExp, id] marked
 *   unmarked(html)                 the same HTML with the fact marks taken off (for tests that read the words)
 *
 * An id outside the register (src/reading/facts.js) throws: a mark the sweep cannot read is a mistake to catch at once.
 */
import { isFactId, isTableId } from './facts.js';

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function checked(id) {
  if (!isFactId(id)) throw new Error('mark: "' + id + '" is not a fact id (src/reading/facts.js)');
  return id;
}

export const factAttr = (id) => ' data-fact="' + attr(checked(id)) + '"';

export const factProps = (id) => ({ 'data-fact': checked(id) });

export function markFact(id, html, { tag = 'span', cls = '' } = {}) {
  return '<' + tag + factAttr(id) + (cls ? ' class="' + attr(cls) + '"' : '') + '>' + (html == null ? '' : html) + '</' + tag + '>';
}

export function tableAttr(id) {
  if (!isTableId(id)) throw new Error('mark: "' + id + '" is not a table id (src/reading/facts.js)');
  return ' data-fact-table="' + attr(id) + '"';
}

export const cellAttr = (row, col) => ' data-row="' + attr(row) + '" data-col="' + attr(col) + '"';

export const fieldAttr = (id) => ' data-field="' + attr(id) + '"';

export function setFact(el, id) {
  if (el && el.setAttribute) el.setAttribute('data-fact', checked(id));
  return el;
}

/** Words already written (escaped HTML with no tags inside the figures), with the figures found in them marked. */
export function markWithin(html, finds = []) {
  const t = String(html == null ? '' : html);
  const hits = [];
  for (const [re, id] of finds) {
    checked(id);
    const m = new RegExp(re.source, re.flags.replace('g', '')).exec(t);
    if (!m || m[1] == null) continue;
    const start = m.index + m[0].indexOf(m[1]);
    const end = start + m[1].length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, id });
  }
  hits.sort((a, b) => b.start - a.start);
  let out = t;
  for (const h of hits) out = out.slice(0, h.start) + markFact(h.id, out.slice(h.start, h.end)) + out.slice(h.end);
  return out;
}

/** The chance words of the register ("about 17 times in 20", "less than once in 20"). */
export const CHANCE_WORDS = /((?:more than |less than |about )?(?:\d+ times|once) in 20)/;

/** The fixed-age chance as the words say it (answers/shared/format.js twentiethsOfFutures): "in 14 of 20 futures we tried". */
export const FIXED_CHANCE_WORDS = /(in (?:every future|none of the futures|(?:more than |fewer than )?\d+ of 20 futures) we tried)/;

/** The HTML with every fact mark taken off, its figure left as it was: what a test of the words compares. */
export function unmarked(html) {
  return String(html == null ? '' : html).replace(/<span data-fact="[^"]*">([^<]*)<\/span>/g, '$1');
}

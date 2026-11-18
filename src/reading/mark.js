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

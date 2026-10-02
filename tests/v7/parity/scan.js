/**
 * A small source scanner for the parity ledger's gate (tests/v7/parity/ledger.test.js). It reads JavaScript as text and
 * finds the keys of object literals: the first argument of a call (`saveStressSettings({ … })`), every literal a
 * function returns, the literal after an anchor. Strings, template literals, comments and regular expressions are
 * skipped, so a brace inside them never counts.
 *
 * It is a scanner, not a parser: good enough for the shapes today's app writes, and it fails loudly (an anchor not
 * found throws) rather than quietly finding nothing.
 *
 * Pure: text in, keys out. No files, no clock.
 */

const IDENT = /[A-Za-z_$][\w$]*/y;
const REGEX_BEFORE = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^', '\n']);
const REGEX_WORDS = new Set(['return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new', 'else', 'do']);

/** Index just past a string or template literal opening at `i` (src[i] is the quote). */
function skipString(src, i) {
  const q = src[i];
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') { j += 2; continue; }
    if (q === '`' && c === '$' && src[j + 1] === '{') { j = skipBalanced(src, j + 1, '{', '}'); continue; }
    if (c === q) return j + 1;
    j++;
  }
  return j;
}

/** Index just past a regular expression literal opening at `i` (src[i] is '/'). */
function skipRegex(src, i) {
  let j = i + 1, inClass = false;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') { j += 2; continue; }
    if (c === '\n') return j;                       // not a regex after all; give up at the line's end
    if (inClass) { if (c === ']') inClass = false; } else if (c === '[') inClass = true; else if (c === '/') { j++; break; }
    j++;
  }
  while (j < src.length && /[a-z]/i.test(src[j])) j++;   // flags
  return j;
}

/** The last significant character (or word) before `i`, to tell a regex from a division. */
function regexCanStart(src, i) {
  let k = i - 1;
  while (k >= 0 && (src[k] === ' ' || src[k] === '\t' || src[k] === '\r')) k--;
  if (k < 0) return true;
  const c = src[k];
  if (REGEX_BEFORE.has(c)) return true;
  if (/[\w$]/.test(c)) {
    let s = k;
    while (s > 0 && /[\w$]/.test(src[s - 1])) s--;
    return REGEX_WORDS.has(src.slice(s, k + 1));
  }
  return false;
}

/**
 * Skip anything that is not code at `i`: a string, a template, a comment or a regex. Returns the index past it, or `i`
 * when src[i] starts ordinary code.
 */
function skipNonCode(src, i) {
  const c = src[i];
  if (c === '"' || c === "'" || c === '`') return skipString(src, i);
  if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); return e < 0 ? src.length : e; }
  if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); return e < 0 ? src.length : e + 2; }
  if (c === '/' && regexCanStart(src, i)) return skipRegex(src, i);
  return i;
}

/** Index just past the bracket that closes the one at `i` (src[i] === open). */
export function skipBalanced(src, i, open, close) {
  let depth = 0, j = i;
  while (j < src.length) {
    const k = skipNonCode(src, j);
    if (k !== j) { j = k; continue; }
    const c = src[j];
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return j + 1; }
    j++;
  }
  throw new Error('scan: unbalanced ' + open + ' at ' + i);
}

const OPENERS = { '(': ')', '[': ']', '{': '}' };

/** Text for use inside a RegExp, every special character escaped. */
const escapeRe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Index past whitespace and comments. */
function skipSpace(src, i) {
  let j = i;
  for (;;) {
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] === '/' && (src[j + 1] === '/' || src[j + 1] === '*')) { j = skipNonCode(src, j); continue; }
    return j;
  }
}

/** End of the member that starts at `j` inside a literal ending at `end`: the next comma at depth 0. */
function memberEnd(src, j, end) {
  let k = j;
  while (k < end && src[k] !== ',') {
    const s = skipNonCode(src, k);
    if (s !== k) { k = s; continue; }
    if (OPENERS[src[k]]) { k = skipBalanced(src, k, src[k], OPENERS[src[k]]); continue; }
    k++;
  }
  return k;
}

/**
 * The top-level keys of the object literal whose '{' is at `i`. Shorthand, quoted and method keys count; computed keys
 * (`[key]: v`) are left out. A spread of a literal (`...(cond ? { firstTaxYear } : {})`) gives that literal's keys: they
 * end up in the object too. A spread of anything else (`...getDefaults()`) gives nothing.
 * @returns {string[]}
 */
export function literalKeys(src, i) {
  if (src[i] !== '{') throw new Error('scan: no object literal at ' + i);
  const end = skipBalanced(src, i, '{', '}') - 1;
  const keys = [];
  let j = i + 1;
  while (j < end) {
    j = skipSpace(src, j);
    if (j >= end) break;
    let key = null;
    if (src.startsWith('...', j)) {
      const to = memberEnd(src, j + 3, end);
      let a = skipSpace(src, j + 3), b = to;
      while (b > a && /\s/.test(src[b - 1])) b--;
      while (src[a] === '(' && skipBalanced(src, a, '(', ')') === b) { a = skipSpace(src, a + 1); b--; while (b > a && /\s/.test(src[b - 1])) b--; }
      keys.push(...spanLiteralKeys(src, a, b));
      j = to + 1;
      continue;
    } else if (src[j] === '"' || src[j] === "'") {
      const e = skipString(src, j);
      key = src.slice(j + 1, e - 1);
      j = e;
    } else if (src[j] === '[') {
      j = skipBalanced(src, j, '[', ']');      // computed key: not a name we can know
    } else {
      IDENT.lastIndex = j;
      const m = IDENT.exec(src);
      if (m) {
        let name = m[0];
        j += name.length;
        // `async foo()`, `get foo()`: the name is the next identifier
        if ((name === 'async' || name === 'get' || name === 'set') && /\s/.test(src[j])) {
          const k = skipSpace(src, j);
          IDENT.lastIndex = k;
          const m2 = IDENT.exec(src);
          if (m2 && src[skipSpace(src, k + m2[0].length)] === '(') { name = m2[0]; j = k + m2[0].length; }
        }
        key = name;
      } else {
        j++;
      }
    }
    // the rest of this member, to the next top-level comma
    let sawKey = false;
    const after = skipSpace(src, j);
    if (key !== null && (src[after] === ':' || src[after] === ',' || src[after] === '(' || after >= end)) sawKey = true;
    j = after;
    while (j < end && src[j] !== ',') {
      const k = skipNonCode(src, j);
      if (k !== j) { j = k; continue; }
      if (OPENERS[src[j]]) { j = skipBalanced(src, j, src[j], OPENERS[src[j]]); continue; }
      j++;
    }
    if (sawKey) keys.push(key);
    j++;
  }
  return keys;
}

/**
 * Keys of every object literal that is a whole expression of its own inside [from, to): a literal at bracket depth 0 of
 * the span (so `cond ? { a } : { b }` gives a and b, while `{ a: { b } }` gives a only).
 */
export function spanLiteralKeys(src, from, to) {
  const keys = [];
  let j = from;
  while (j < to) {
    const k = skipNonCode(src, j);
    if (k !== j) { j = k; continue; }
    const c = src[j];
    if (c === '{') { keys.push(...literalKeys(src, j)); j = skipBalanced(src, j, '{', '}'); continue; }
    if (c === '(' || c === '[') { j = skipBalanced(src, j, c, OPENERS[c]); continue; }
    j++;
  }
  return keys;
}

/** The argument spans [from, to) of the call whose '(' is at `i`. */
function argSpans(src, i) {
  const end = skipBalanced(src, i, '(', ')') - 1;
  const spans = [];
  let start = i + 1, j = i + 1;
  while (j < end) {
    const k = skipNonCode(src, j);
    if (k !== j) { j = k; continue; }
    const c = src[j];
    if (OPENERS[c]) { j = skipBalanced(src, j, c, OPENERS[c]); continue; }
    if (c === ',') { spans.push([start, j]); start = j + 1; }
    j++;
  }
  spans.push([start, end]);
  return spans;
}

/** Which positions are code (not in a string, template, comment or regex). Remembered for the last few texts. */
const codeMaps = new Map();
function codePositions(src) {
  if (codeMaps.has(src)) return codeMaps.get(src);
  const inCode = new Uint8Array(src.length);
  let j = 0;
  while (j < src.length) {
    const k = skipNonCode(src, j);
    if (k !== j) { j = k; continue; }
    inCode[j] = 1;
    j++;
  }
  if (codeMaps.size > 8) codeMaps.clear();
  codeMaps.set(src, inCode);
  return inCode;
}

/**
 * The keys of the object literals in argument `argIndex` of every call to `name` (a plain or dotted callee, e.g.
 * 'saveStressSettings' or 'Object.assign'). With `firstArg`, only the calls whose first argument is exactly that text.
 * A call whose argument holds no literal (`saveStressSettings(patch)`) adds nothing; `calls` counts every call seen.
 */
export function callLiteralKeys(src, name, { argIndex = 0, firstArg = null } = {}) {
  const re = new RegExp('(?<![\\w$.])' + escapeRe(name) + '\\s*\\(', 'g');
  const inCode = codePositions(src);
  const keys = new Set();
  let calls = 0, m;
  while ((m = re.exec(src))) {
    if (!inCode[m.index]) continue;
    const before = src.slice(Math.max(0, m.index - 30), m.index);
    if (/function\s*\*?\s*$/.test(before) || /(?:^|[\s;])(?:async\s+)?function\s+$/.test(before)) continue;   // a definition
    const open = m.index + m[0].length - 1;
    const spans = argSpans(src, open);
    if (firstArg !== null && src.slice(spans[0][0], spans[0][1]).trim() !== firstArg) continue;
    calls++;
    const span = spans[argIndex];
    if (span) for (const k of spanLiteralKeys(src, span[0], span[1])) keys.add(k);
  }
  return { keys: [...keys], calls };
}

/** The body span [from, to) of `function name(` (or `name = function (` / `name = (…) =>` with a braced body). */
export function functionBody(src, name) {
  const re = new RegExp('(?:function\\s+' + name + '\\s*\\(|\\b' + name + '\\s*=\\s*(?:async\\s+)?(?:function\\s*)?\\()', 'g');
  const inCode = codePositions(src);
  let m;
  while ((m = re.exec(src))) {
    if (!inCode[m.index]) continue;
    const paren = m.index + m[0].length - 1;
    const afterParams = skipBalanced(src, paren, '(', ')');
    let j = skipSpace(src, afterParams);
    if (src.startsWith('=>', j)) j = skipSpace(src, j + 2);
    if (src[j] !== '{') continue;
    return [j + 1, skipBalanced(src, j, '{', '}') - 1];
  }
  throw new Error('scan: function ' + name + ' not found');
}

/** Keys of every object literal returned directly (`return {` or `return cond ? { … } : { … }`) in function `name`. */
export function returnLiteralKeys(src, name) {
  const [from, to] = functionBody(src, name);
  const inCode = codePositions(src);
  const keys = new Set();
  const re = /\breturn\b/g;
  re.lastIndex = from;
  let m;
  while ((m = re.exec(src)) && m.index < to) {
    if (!inCode[m.index]) continue;
    // the returned expression runs to the next ';' or '}' at depth 0
    let j = m.index + 6, end = j;
    while (end < to) {
      const k = skipNonCode(src, end);
      if (k !== end) { end = k; continue; }
      const c = src[end];
      if (OPENERS[c]) { end = skipBalanced(src, end, c, OPENERS[c]); continue; }
      if (c === ';' || c === '}' || c === '\n') break;
      end++;
    }
    for (const k of spanLiteralKeys(src, j, end)) keys.add(k);
  }
  return [...keys];
}

/** Keys of the object literal that follows the first match of `anchor` (a RegExp ending just before the '{'). */
export function literalKeysAfter(src, anchor) {
  const m = anchor.exec(src);
  if (!m) throw new Error('scan: anchor ' + anchor + ' not found');
  const j = skipSpace(src, m.index + m[0].length);
  return literalKeys(src, j);
}

/**
 * Property names assigned on `variable` (`b.partnerAge = …`, not `==`) inside [from, to). Compound and chained writes
 * (`b.x.y = …`) give the first name only.
 */
export function assignedProps(src, variable, from = 0, to = src.length) {
  const re = new RegExp('(?<![\\w$.])' + escapeRe(variable) + '\\.([A-Za-z_$][\\w$]*)(?:\\.[A-Za-z_$][\\w$]*)*\\s*=(?![=>])', 'g');
  const inCode = codePositions(src);
  re.lastIndex = from;
  const keys = new Set();
  let m;
  while ((m = re.exec(src)) && m.index < to) if (inCode[m.index]) keys.add(m[1]);
  return [...keys];
}

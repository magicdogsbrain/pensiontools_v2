/**
 * Inline event handlers WITHOUT inline script.
 *
 * The app's markup used `onclick="fn('a', 1, this.value)"` everywhere — which forces the
 * Content-Security-Policy to allow 'unsafe-inline' scripts, defeating the point of a CSP. The
 * markup now carries the same expression in `data-on-click="…"` (and data-on-input, -change,
 * -mousedown, -keydown, -keyup, -focus, -blur, -toggle, -submit). A single delegated listener
 * per event type parses that expression with the tiny grammar below and runs it. There is NO
 * eval / Function(): only calls to existing functions with literal, `this.*` or `event` args.
 *
 * Grammar:  program := stmt (';' stmt)* ;   stmt := 'return false' | expr
 *           expr    := primary ( '.' IDENT | '(' args ')' )*
 *           primary := STRING | NUMBER | true | false | null | this | event | IDENT
 *                    | '(' ')' '=>' stmt            (arrow, only as a setTimeout argument)
 *                    | 'function' '(' ')' '{' program '}'
 * Identifiers resolve on window (functions, document, setTimeout …); `this` is the element.
 */
const EVENTS = ['click', 'input', 'change', 'mousedown', 'keydown', 'keyup', 'focus', 'blur', 'toggle', 'submit'];

function tokenize(src) {
  const t = []; let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "'" || c === '"') { let j = i + 1, s = ''; while (j < src.length && src[j] !== c) { if (src[j] === '\\' && j + 1 < src.length) { s += src[j + 1]; j += 2; } else { s += src[j]; j++; } } t.push({ k: 'str', v: s }); i = j + 1; continue; }
    if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(src[i + 1] || '') && (t.length === 0 || ['(', ','].includes(t[t.length - 1].v)))) { let j = i + 1; while (j < src.length && /[0-9.]/.test(src[j])) j++; t.push({ k: 'num', v: parseFloat(src.slice(i, j)) }); i = j; continue; }
    if (/[A-Za-z_$]/.test(c)) { let j = i + 1; while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++; t.push({ k: 'id', v: src.slice(i, j) }); i = j; continue; }
    if (src.startsWith('=>', i)) { t.push({ k: 'op', v: '=>' }); i += 2; continue; }
    if ('().,;{}'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
    throw new Error('inline handler: unexpected "' + c + '" in ' + src);
  }
  return t;
}

export function parse(src) {
  const t = tokenize(src); let i = 0;
  const peek = () => t[i]; const next = () => t[i++];
  const expect = (v) => { const x = next(); if (!x || x.v !== v) throw new Error('inline handler: expected ' + v + ' in ' + src); };
  function program() { const stmts = []; while (i < t.length) { stmts.push(stmt()); if (peek() && peek().v === ';') next(); } return { type: 'program', stmts }; }
  function stmt() { if (peek() && peek().k === 'id' && peek().v === 'return') { next(); const x = next(); if (!x || x.v !== 'false') throw new Error('inline handler: only "return false" is supported'); return { type: 'preventDefault' }; } return expr(); }
  function expr() {
    let node = primary();
    for (;;) {
      const p = peek();
      if (p && p.v === '.') { next(); const id = next(); if (!id || id.k !== 'id') throw new Error('inline handler: property expected'); node = { type: 'member', obj: node, name: id.v }; }
      else if (p && p.v === '(') { next(); const args = []; while (peek() && peek().v !== ')') { args.push(expr()); if (peek() && peek().v === ',') next(); } expect(')'); node = { type: 'call', callee: node, args }; }
      else return node;
    }
  }
  function primary() {
    const x = next(); if (!x) throw new Error('inline handler: unexpected end in ' + src);
    if (x.k === 'str') return { type: 'lit', v: x.v };
    if (x.k === 'num') return { type: 'lit', v: x.v };
    if (x.k === 'id') {
      if (x.v === 'true') return { type: 'lit', v: true }; if (x.v === 'false') return { type: 'lit', v: false }; if (x.v === 'null') return { type: 'lit', v: null };
      if (x.v === 'this') return { type: 'this' }; if (x.v === 'event') return { type: 'event' };
      if (x.v === 'function') { expect('('); expect(')'); expect('{'); const body = []; while (peek() && peek().v !== '}') { body.push(stmt()); if (peek() && peek().v === ';') next(); } expect('}'); return { type: 'fn', body: { type: 'program', stmts: body } }; }
      return { type: 'ident', name: x.v };
    }
    if (x.v === '(') { expect(')'); expect('=>'); const s = stmt(); return { type: 'fn', body: { type: 'program', stmts: [s] } }; }
    throw new Error('inline handler: unexpected token ' + x.v + ' in ' + src);
  }
  return program();
}

function evaluate(node, ctx) {
  switch (node.type) {
    case 'program': { let r; for (const s of node.stmts) r = evaluate(s, ctx); return r; }
    case 'preventDefault': ctx.event && ctx.event.preventDefault(); return false;
    case 'lit': return node.v;
    case 'this': return ctx.el;
    case 'event': return ctx.event;
    case 'ident': return window[node.name];
    case 'fn': return () => evaluate(node.body, ctx);
    case 'member': { const o = evaluate(node.obj, ctx); return o == null ? undefined : o[node.name]; }
    case 'call': {
      let thisArg = window, fn;
      if (node.callee.type === 'member') { thisArg = evaluate(node.callee.obj, ctx); fn = thisArg == null ? undefined : thisArg[node.callee.name]; }
      else fn = evaluate(node.callee, ctx);
      if (typeof fn !== 'function') throw new Error('inline handler: not a function: ' + (node.callee.name || node.callee.type));
      return fn.apply(thisArg, node.args.map((a) => evaluate(a, ctx)));
    }
    default: throw new Error('inline handler: bad node ' + node.type);
  }
}

const cache = new Map();
export function run(src, el, event) {
  let ast = cache.get(src);
  if (!ast) { ast = parse(src); cache.set(src, ast); }
  return evaluate(ast, { el, event });
}

/** Install the delegated listeners once. */
export function installInlineHandlers(root = document) {
  for (const ev of EVENTS) {
    const attr = 'data-on-' + ev;
    const capture = ev === 'focus' || ev === 'blur' || ev === 'toggle';   // these do not bubble
    root.addEventListener(ev, (event) => {
      // Walk up from the target so nested clickable children still trigger the handler.
      let el = event.target instanceof Element ? event.target : null;
      while (el) {
        if (el.hasAttribute && el.hasAttribute(attr)) {
          try { run(el.getAttribute(attr), el, event); } catch (e) { console.error(e); }
          return;
        }
        if (ev === 'input' || ev === 'change' || ev === 'focus' || ev === 'blur' || ev === 'toggle') return;   // only the element itself
        el = el.parentElement;
      }
    }, capture);
  }
}

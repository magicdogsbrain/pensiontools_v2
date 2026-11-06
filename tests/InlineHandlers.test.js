/**
 * Every data-on-* expression in the markup must parse and run through the no-eval interpreter.
 * This test extracts them from the source files so a new inline expression that the grammar cannot
 * handle fails here, not in a user's browser.
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import { parse, run } from '../src/ui/inlineHandlers.js';

const files = ['index.html', 'src/ui/components/SetupWizard.js', 'src/ui/components/TaxYearSetupWizard.js'];
const exprs = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/data-on-(?:click|input|change|mousedown|keydown|keyup|focus|blur|toggle|submit)="([^"]*)"/g)) exprs.add(m[1]);
}
// JS-built attributes contain template splices ("' + x + '"); reduce them to a representative literal
const concrete = (e) => e.replace(/\\'/g, "'").replace(/' \+ [^+]+? \+ '/g, 'X').replace(/' \+ [^)]+?\)\s*\+ '/g, 'X').replace(/\$\{[^}]*\}/g, 'X').replace(/&quot;/g, '"');

describe('inline handler grammar covers the markup', () => {
  it('parses every expression in the source', () => {
    const bad = [];
    for (const e of exprs) { try { parse(concrete(e)); } catch (err) { bad.push(e + ' → ' + err.message); } }
    expect(bad).toEqual([]);
    expect(exprs.size).toBeGreaterThan(250);
  });
  it('runs calls with literal, this.* and event args; member chains; return false; setTimeout bodies', () => {
    const calls = [];
    globalThis.window = globalThis;
    globalThis.f = (...a) => calls.push(['f', ...a]);
    globalThis.g = (...a) => calls.push(['g', ...a]);
    globalThis.document = { getElementById: (id) => ({ id, click: () => calls.push(['click', id]), remove: () => calls.push(['remove', id]) }) };
    const el = { value: 'v', checked: true, dataset: { p: 'ss', ticker: 'VWRL' }, selectedIndex: 2 };
    const ev = { preventDefault: () => calls.push(['pd']), stopPropagation: () => calls.push(['sp']) };
    run("f('a', 1, this.value, this.checked, this.dataset.ticker, true, null, this.selectedIndex)", el, ev);
    run("g('x'); document.getElementById('resetBtn').click(); document.getElementById('z').remove()", el, ev);
    run("event.stopPropagation(); f(this, event)", el, ev);
    run("f('k'); return false;", el, ev);
    globalThis.addFundFromSearch = (...a) => calls.push(['addFundFromSearch', ...a]); run("addFundFromSearch(this.dataset.p, this.dataset.ticker)", el, ev);
    expect(calls).toEqual([['f', 'a', 1, 'v', true, 'VWRL', true, null, 2], ['g', 'x'], ['click', 'resetBtn'], ['remove', 'z'], ['sp'], ['f', el, ev], ['f', 'k'], ['pd'], ['addFundFromSearch', 'ss', 'VWRL']]);
    const st = []; globalThis.setTimeout = (fn, ms) => { st.push(ms); fn(); };
    run("setTimeout(() => f('later'), 300)", el, ev);
    run("setTimeout(function(){ g('l2') }, 150)", el, ev);
    expect(st).toEqual([300, 150]);
    expect(calls.slice(-2)).toEqual([['f', 'later'], ['g', 'l2']]);
  });
  it('refuses anything that is not a call/member/literal (no eval)', () => {
    for (const bad of ["alert(1)+1", "x = 1", "a ? b : c", "this.constructor.constructor('x')()", "f(`t`)", "new F()", "f(1 + 2)"]) {
      expect(() => { parse(bad); run(bad, {}, {}); }).toThrow();
    }
  });
});

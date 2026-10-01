/**
 * J6 — the owner's 55-year-old still paying in (e2e/c-paying-in.spec.js) — is wired in: it exists, runs on the
 * published build at 390 and 1280 wide, and when it skips it says what it waits for. Read from the files, as
 * tests/v7/e2eRules.test.js reads the other journeys.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (f) => readFileSync(join(ROOT, f), 'utf8');
/** The text without comments, so a rule is never met by a line that only talks about it. */
const code = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');

describe('J6 — the journey of the owner\'s report', () => {
  const cfg = code(read('playwright.config.js'));
  const lists = {};
  for (const m of cfg.matchAll(/const (\w+) = \[([^\]]*)\]/g)) lists[m[1]] = m[2];
  const resolve = (body, seen = new Set()) => {
    const out = [...body.matchAll(/'([\w-]+)'/g)].map((x) => x[1]);
    for (const [, v] of body.matchAll(/\.\.\.(\w+)/g)) if (lists[v] !== undefined && !seen.has(v)) out.push(...resolve(lists[v], new Set([...seen, v])));
    return out;
  };
  const project = (name) => {
    const m = new RegExp(`name: '${name}'[^\\n]*testMatch: only\\((\\w+|\\[[^\\]]*\\])\\)`).exec(cfg);
    if (!m) return null;
    return m[1].startsWith('[') ? resolve(m[1]) : resolve(lists[m[1]] || '');
  };

  it('the spec exists, uses the published build, and says what it waits for when it skips', () => {
    expect(existsSync(join(ROOT, 'e2e/c-paying-in.spec.js'))).toBe(true);
    const spec = code(read('e2e/c-paying-in.spec.js'));
    expect(spec).toMatch(/v7\(page, 'prod'/);
    expect(spec).toMatch(/waitsFor\(/);
    expect(spec).not.toMatch(/\btest\.(?:skip|fixme)\(\s*\)/);
    expect(spec).toMatch(/'you\.payIn\.own': '500'/);
    expect(spec).toMatch(/'you\.payIn\.employer': '300'/);
    expect(spec).toMatch(/'start\.age': '67'/);
    expect(spec).toMatch(/'you\.pot': '275000'/);
  });

  it('runs at 390 and at 1280 wide', () => {
    expect(project('phone-390')).toContain('c-paying-in');
    expect(project('desktop-1280')).toEqual(['c-paying-in']);
    expect(cfg).toMatch(/name: 'desktop-1280', use: chromium\(1280, \d+\)/);
  });
});

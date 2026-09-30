// @vitest-environment node
/**
 * The current app's build is not disturbed by V7 (research/v7/architecture.md 2.5): vite.config.js still has
 * exactly one page and the same output names, and the V7 build is a separate one that writes only under docs/v7/.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import live from '../../vite.config.js';
import v7 from '../../vite.v7.config.js';

const NAMES = {
  entryFileNames: 'assets/[name]-[hash].js',
  chunkFileNames: 'assets/[name]-[hash].js',
  assetFileNames: 'assets/[name]-[hash].[ext]'
};

describe('the current app\'s build', () => {
  it('has exactly one page, index.html', () => {
    expect(live.build.rollupOptions.input).toEqual({ main: './index.html' });
  });
  it('writes the same names to the same place', () => {
    expect(live.build.outDir).toBe('docs');
    expect(live.build.emptyOutDir).toBe(true);
    expect(live.build.rollupOptions.output).toEqual(NAMES);
    expect(live.root).toBe('.');
    expect(live.base).toBe('./');
    expect(live.publicDir).toBe('public');
  });
  it('still never ships console output', () => {
    expect(live.esbuild.drop).toEqual(['console', 'debugger']);
  });
  it('index.html does not mention V7', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toMatch(/src\/v7|\/v7\/|pt_shell/);
  });
});

describe('the V7 build', () => {
  const at = (mode, out) => {
    const before = process.env.V7_OUT;
    if (out === undefined) delete process.env.V7_OUT; else process.env.V7_OUT = out;
    try { return v7({ mode, command: 'build' }); } finally { if (before === undefined) delete process.env.V7_OUT; else process.env.V7_OUT = before; }
  };
  const fromRoot = (p) => relative(process.cwd(), p).split(sep).join('/');

  it('is its own page, written under docs/v7 and nowhere else', () => {
    const c = at('production');
    expect(fromRoot(c.root)).toBe('v7');
    expect(fromRoot(c.build.outDir)).toBe('docs/v7');
    expect(c.publicDir).toBe(false);
    expect(c.base).toBe('./');
    expect(c.build.rollupOptions.output).toEqual(NAMES);
  });
  it('V7_OUT sends it elsewhere for the browser tests', () => {
    expect(fromRoot(at('test', 'dist/test/v7').build.outDir)).toBe('dist/test/v7');
  });
  it('drops console output when published and keeps it in the test build', () => {
    expect(at('production').esbuild.drop).toEqual(['console', 'debugger']);
    expect(at('test').esbuild.drop).toEqual([]);
  });
  it('the page is marked "do not index", has one module script and nothing inline', () => {
    const html = readFileSync(resolve(process.cwd(), 'v7/index.html'), 'utf8');
    expect(html).toMatch(/<meta name="robots" content="noindex">/);
    expect(html).toMatch(/<div id="app" data-ready="0"/);
    const scripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/g) || [];
    expect(scripts).toEqual(['<script type="module" src="../src/v7/main.jsx"></script>']);
    expect(html).not.toMatch(/<style\b|\sstyle=|\son[a-z]+=/);
  });
  it('/v7/* is served with X-Robots-Tag: noindex, and the rest of the headers are as they were', () => {
    const headers = readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8');
    expect(headers).toMatch(/^\/v7\/\*\n {2}X-Robots-Tag: noindex$/m);
    expect(headers).toMatch(/^\/\*\n {2}Content-Security-Policy: default-src 'self'; script-src 'self' /m);
  });
  it('the build order empties docs/ first, then adds V7', () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts.build).toBe('vite build && node scripts/stamp-sw.mjs && vite build --config vite.v7.config.js');
  });
});

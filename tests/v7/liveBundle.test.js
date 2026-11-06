// @vitest-environment node
/**
 * The two builds and where they write (research/v7/architecture.md 2.5; switch-readiness.md §2 steps 3, 5, 6 and 8;
 * vite.layout.js). At 7.0 (the switch layout, the default) V7 is the site's root, with the public folder, and the classic
 * page is at classic/; LAYOUT=preview builds the layout before 7.0 (the classic page at the root, V7 at v7/) from the
 * same commit, as the rollback. Each build empties its own folder only, so the two run in either order; the classic page's
 * build keeps exactly one page and the same output names.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import classicConfig from '../../vite.config.js';
import v7Config from '../../vite.v7.config.js';
import { layoutNamed } from '../../src/appLayout.js';

const NAMES = {
  entryFileNames: 'assets/[name]-[hash].js',
  chunkFileNames: 'assets/[name]-[hash].js',
  assetFileNames: 'assets/[name]-[hash].[ext]'
};

/** A configuration as Vite makes it, with LAYOUT and SITE_OUT set as given (undefined: unset) and put back after. */
function made(config, { command = 'build', mode = 'production', layout, site, emulators } = {}) {
  const before = { LAYOUT: process.env.LAYOUT, SITE_OUT: process.env.SITE_OUT, VITE_EMULATORS: process.env.VITE_EMULATORS };
  const set = (k, v) => { if (v === undefined) delete process.env[k]; else process.env[k] = v; };
  set('LAYOUT', layout); set('SITE_OUT', site); set('VITE_EMULATORS', emulators);
  try { return config({ command, mode }); } finally { set('LAYOUT', before.LAYOUT); set('SITE_OUT', before.SITE_OUT); set('VITE_EMULATORS', before.VITE_EMULATORS); }
}
const fromRoot = (p) => relative(process.cwd(), p).split(sep).join('/');
const pluginNames = (c) => c.plugins.flat().map((p) => p.name);
const emptying = (c) => c.plugins.flat().find((p) => p.name === 'pt:empty-own-folder');

describe('the classic page\'s build', () => {
  const live = made(classicConfig);

  it('has exactly one page, index.html', () => {
    expect(live.build.rollupOptions.input).toEqual({ main: './index.html' });
  });
  it('writes the same names, at 7.0 to docs/classic, copying no public folder (the site\'s root has it)', () => {
    expect(fromRoot(live.build.outDir)).toBe('docs/classic');
    expect(live.build.emptyOutDir).toBe(false);
    expect(live.build.copyPublicDir).toBe(false);
    expect(live.build.rollupOptions.output).toEqual(NAMES);
    expect(live.root).toBe('.');
    expect(live.base).toBe('./');
    expect(live.publicDir).toBe('public');
    expect(pluginNames(live)).toEqual(['pt:empty-own-folder', 'pt:classic-head-before', 'pt:classic-head-after', 'pt:classic-data']);
  });
  it('the rollback (LAYOUT=preview) writes docs/ as before 7.0, with the public folder, and leaves V7\'s docs/v7 alone', () => {
    const back = made(classicConfig, { layout: 'preview' });
    expect(fromRoot(back.build.outDir)).toBe('docs');
    expect(back.build.copyPublicDir).toBe(true);
    expect(pluginNames(back)).toEqual(['pt:empty-own-folder']);
    expect(back.define).toEqual({ __PT_LAYOUT__: '"preview"', __PT_EMULATORS__: 'false' });
  });
  it('SITE_OUT moves the site for the browser tests', () => {
    expect(fromRoot(made(classicConfig, { site: 'dist/prod' }).build.outDir)).toBe('dist/prod/classic');
    expect(fromRoot(made(classicConfig, { site: 'dist/prod', layout: 'preview' }).build.outDir)).toBe('dist/prod');
  });
  it('still never ships console output', () => {
    expect(live.esbuild.drop).toEqual(['console', 'debugger']);
  });
  it('carries the layout the build flag names (src/appLayout.js): the switch unless LAYOUT says otherwise', () => {
    expect(live.define).toEqual({ __PT_LAYOUT__: JSON.stringify(layoutNamed(undefined)), __PT_EMULATORS__: 'false' });
    expect(made(classicConfig, { layout: undefined }).define.__PT_LAYOUT__).toBe('"switch"');
    expect(made(classicConfig, { layout: 'switch' }).define.__PT_LAYOUT__).toBe('"switch"');
    expect(() => made(classicConfig, { layout: 'classic' })).toThrow(/LAYOUT must be "preview" or "switch"/);
  });
  it('the dev server serves the source folders as they are (the classic page at /, V7 at /v7/): the preview layout unless LAYOUT names one', () => {
    expect(made(classicConfig, { command: 'serve', layout: undefined }).define.__PT_LAYOUT__).toBe('"preview"');
    expect(made(classicConfig, { command: 'serve', layout: 'switch' }).define.__PT_LAYOUT__).toBe('"switch"');
  });
  it('index.html does not mention V7', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toMatch(/src\/v7|\/v7\/|pt_shell/);
  });
});

describe('the V7 build', () => {
  const live = made(v7Config);

  it('is its own page, at 7.0 the site\'s root (docs/) with the public folder; it leaves the classic page\'s docs/classic alone', () => {
    expect(fromRoot(live.root)).toBe('v7');
    expect(fromRoot(live.build.outDir)).toBe('docs');
    expect(live.build.emptyOutDir).toBe(false);
    expect(live.build.copyPublicDir).toBe(true);
    expect(fromRoot(live.publicDir)).toBe('public');
    expect(live.base).toBe('./');
    expect(live.build.rollupOptions.output).toEqual(NAMES);
    expect(pluginNames(live)).toEqual(['pt:empty-own-folder', 'pt:v7-head', 'pt:old-v7-forward']);
  });
  it('the rollback (LAYOUT=preview) writes docs/v7 as before 7.0, with no public folder and no forward', () => {
    const back = made(v7Config, { layout: 'preview' });
    expect(fromRoot(back.build.outDir)).toBe('docs/v7');
    expect(back.build.copyPublicDir).toBe(false);
    expect(pluginNames(back)).toEqual(['pt:empty-own-folder', 'pt:v7-head']);
  });
  it('SITE_OUT moves the site for the browser tests (the published build and the test build)', () => {
    expect(fromRoot(made(v7Config, { site: 'dist/prod' }).build.outDir)).toBe('dist/prod');
    expect(fromRoot(made(v7Config, { site: 'dist/test', mode: 'test' }).build.outDir)).toBe('dist/test');
    expect(fromRoot(made(v7Config, { site: 'dist/test', mode: 'test', layout: 'preview' }).build.outDir)).toBe('dist/test/v7');
  });
  it('carries the layout the build flag names, the same as the classic page\'s; a misspelt flag stops the build', () => {
    expect(made(v7Config, { layout: undefined }).define).toEqual({ __PT_LAYOUT__: '"switch"', __PT_EMULATORS__: 'false' });
    expect(made(v7Config, { layout: 'preview' }).define).toEqual({ __PT_LAYOUT__: '"preview"', __PT_EMULATORS__: 'false' });
    expect(made(v7Config, { layout: 'switch' }).define).toEqual({ __PT_LAYOUT__: '"switch"', __PT_EMULATORS__: 'false' });
    expect(() => made(v7Config, { layout: 'classic' })).toThrow(/LAYOUT must be "preview" or "switch"/);
    expect(live.define).toEqual(made(classicConfig).define);
  });
  it('the signed-in tests\' build (VITE_EMULATORS=1) is the only one with the emulators, and never into docs/ (vite.layout.js emulatorsWanted)', () => {
    for (const config of [v7Config, classicConfig]) {
      expect(made(config, { emulators: '1', site: 'dist/emu' }).define.__PT_EMULATORS__).toBe('true');
      expect(made(config, { emulators: '0', site: 'dist/emu' }).define.__PT_EMULATORS__).toBe('false');
      expect(() => made(config, { emulators: '1' })).toThrow(/never docs\//);
    }
  });
  it('drops console output when published and keeps it in the test build', () => {
    expect(live.esbuild.drop).toEqual(['console', 'debugger']);
    expect(made(v7Config, { mode: 'test' }).esbuild.drop).toEqual([]);
  });
  it('the page has one module script and nothing inline; its head\'s layout lines are the build\'s (vite.layout.js)', () => {
    const html = readFileSync(resolve(process.cwd(), 'v7/index.html'), 'utf8');
    expect(html).toMatch(/<div id="app" data-ready="0"/);
    const scripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/g) || [];
    expect(scripts).toEqual(['<script type="module" src="../src/v7/main.jsx"></script>']);
    expect(html).not.toMatch(/<style\b|\sstyle=|\son[a-z]+=/);
    // neither "do not index", nor an icon or manifest: which of them the page carries is the layout's
    expect(html).not.toMatch(/name="robots"|rel="icon"|rel="manifest"|rel="apple-touch-icon"|name="theme-color"/);
  });
  it('the classic page is served with X-Robots-Tag: noindex, the old /v7/ forward too, and the rest of the headers are as they were', () => {
    const headers = readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8');
    expect(headers).toMatch(/^\/classic\/\*\n {2}X-Robots-Tag: noindex$/m);
    expect(headers).toMatch(/^\/v7\/\*\n {2}X-Robots-Tag: noindex$/m);
    expect(headers).toMatch(/^\/\*\n {2}Content-Security-Policy: default-src 'self'; script-src 'self' /m);
  });
  it('the two builds run in either order (each empties its own folder only); the browser tests\' builds name the site by SITE_OUT', () => {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
    // no stamp step since the kill switch (public/sw.js): it is published as it is and never changes
    expect(pkg.scripts.build).toBe('vite build && vite build --config vite.v7.config.js');
    expect(pkg.scripts['e2e:build']).toBe('SITE_OUT=dist/prod vite build && SITE_OUT=dist/prod vite build --config vite.v7.config.js && SITE_OUT=dist/test vite build --config vite.v7.config.js --mode test');
    expect(emptying(live)).toBeTruthy();
    expect(emptying(made(classicConfig))).toBeTruthy();
  });
});

// @vitest-environment node
/**
 * index.html's inline script parses (7.12.0). It is the whole full view: one syntax error and nothing on the page works. The
 * unit tests read the file as text, so a stray quote inside a quoted string (a "month's" in '…') passed every one of them.
 * esbuild (Vite's own parser) reads it here as the module the browser loads.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { transformSync } from 'esbuild';

describe('index.html\'s inline script', () => {
  it('is JavaScript the browser can parse', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]));
    expect(scripts.length).toBe(1);
    let error = null;
    try { transformSync(scripts[0][2], { loader: 'js', format: 'esm' }); } catch (e) { error = e.message.split('\n').slice(0, 3).join(' '); }
    expect(error).toBe(null);
  });
});

// @vitest-environment node
/**
 * The signed-in browser tests' build talks to the local Firebase emulators of a demo- project; every other build talks to
 * the live project and to nothing else (research/v7/after-7.md §3; src/firebase/projectConfig.js).
 *
 *   - projectConfig.js built with each value of the define: the emulator settings and the live ones are never in the
 *     same bundle (the define makes the choice a constant, and the bundler drops the other);
 *   - the published site (docs/, and dist/prod when the browser tests' build is there) holds no emulator address and no
 *     demo- project; the emulator build (dist/emu, when built by scripts/e2e-signed-in.mjs) holds no live project id or key;
 *   - the served security policy lets the emulators through only for the emulator build (e2e/helpers/serve.mjs --emulators).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';
import { parseHeaders, headersFor, withEmulators, EMULATOR_ORIGINS } from '../e2e/helpers/serve.mjs';

const ROOT = process.cwd();
const LIVE = [/pensiontools-4b237/, /AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0/];
const EMULATOR = [/127\.0\.0\.1:9099/, /localhost:9099/, /demo-pensiontools/, /demo-api-key/, /['"]?127\.0\.0\.1['"]?,\s*8080/];

function filesUnder(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) filesUnder(p, out);
    else if (/\.(js|html)$/.test(name)) out.push(p);
  }
  return out;
}
const holding = (dir, patterns) => filesUnder(join(ROOT, dir)).filter((f) => { const t = readFileSync(f, 'utf8'); return patterns.some((re) => re.test(t)); }).map((f) => f.slice(ROOT.length + 1));

async function configBuiltWith(emulators) {
  const made = await build({
    entryPoints: [join(ROOT, 'src/firebase/projectConfig.js')], bundle: true, write: false, format: 'esm', minify: true,
    define: { __PT_EMULATORS__: JSON.stringify(emulators) }, logLevel: 'silent'
  });
  return made.outputFiles[0].text;
}

describe('the emulators are in the signed-in tests\' build and nowhere else', () => {
  it('projectConfig.js built for the published site carries the live project and no emulator; built for the tests, the reverse', async () => {
    const live = await configBuiltWith(false);
    for (const re of LIVE) expect(live).toMatch(re);
    for (const re of EMULATOR) expect(live).not.toMatch(re);
    const emu = await configBuiltWith(true);
    for (const re of LIVE) expect(emu).not.toMatch(re);
    expect(emu).toMatch(/demo-pensiontools/);
    expect(emu).toMatch(/127\.0\.0\.1:9099/);
  });

  it('the published folder (docs/) holds no emulator address and no demo- project', () => {
    expect(filesUnder(join(ROOT, 'docs')).length).toBeGreaterThan(0);
    expect(holding('docs', EMULATOR)).toEqual([]);
  });

  it.skipIf(!existsSync(join(ROOT, 'dist/prod')))('the browser tests\' copy of the published build (dist/prod) holds none either', () => {
    expect(holding('dist/prod', EMULATOR)).toEqual([]);
  });

  it.skipIf(!existsSync(join(ROOT, 'dist/emu')))('the emulator build (dist/emu) holds no live project id or key, and does name the emulators', () => {
    expect(holding('dist/emu', LIVE)).toEqual([]);
    expect(holding('dist/emu', [/demo-pensiontools/]).length).toBeGreaterThan(0);
  });

  it('the served policy names the emulators only when asked (serve.mjs --emulators); the published policy is untouched', () => {
    const rules = parseHeaders(readFileSync(join(ROOT, 'public/_headers'), 'utf8'));
    const plain = headersFor(rules, '/index.html')['Content-Security-Policy'];
    for (const o of EMULATOR_ORIGINS) expect(plain).not.toContain(o);
    const emu = headersFor(withEmulators(rules), '/index.html')['Content-Security-Policy'];
    for (const o of EMULATOR_ORIGINS) expect(emu).toMatch(new RegExp(`connect-src [^;]*${o.replace(/[.:/]/g, '\\$&')}`));
    expect(emu.replace(` ${EMULATOR_ORIGINS.join(' ')}`, '')).toBe(plain);
  });
});

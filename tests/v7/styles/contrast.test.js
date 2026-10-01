// @vitest-environment node
/**
 * Colour (build brief section 6, P4; architecture B section 8): every text token on every surface token meets
 * 4.5 to 1, the lines that mark a box or the focus ring meet 3 to 1, and no colour is written anywhere but
 * tokens.css. This is the check that would have caught the white-on-grey boxes.
 *
 * Naming in src/v7/styles/tokens.css decides what is checked:
 *   --surface-*            a background text can sit on
 *   --text-*               text; must meet 4.5:1 on every --surface-*
 *   --line-strong, --focus the edge of a box and the focus ring; must meet 3:1 on every --surface-*
 *   --fill-X / --on-X      a filled control and the text on it; each pair must meet 4.5:1, and the fill 3:1 on surfaces
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'src/v7/styles');
const read = (f) => readFileSync(join(DIR, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tokensCss = read('tokens.css');

const TOKENS = Object.fromEntries([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const isColour = (v) => /^#[0-9a-f]{6}$/i.test(v);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const named = (prefix) => Object.keys(TOKENS).filter((k) => k.startsWith(prefix) && isColour(TOKENS[k]));
const surfaces = named('--surface-');
const texts = named('--text');
const fills = named('--fill-');

describe('the colour tokens', () => {
  it('the sum is right (white on black is 21 to 1; the same colour is 1 to 1)', () => {
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#777777')).toBe(1);
  });

  it('there are surfaces, texts and fills to check, and every colour is a full six-figure one', () => {
    expect(surfaces.length).toBeGreaterThanOrEqual(3);
    expect(texts.length).toBeGreaterThanOrEqual(4);
    expect(fills.length).toBeGreaterThanOrEqual(1);
    for (const [k, v] of Object.entries(TOKENS)) if (v.startsWith('#')) expect(isColour(v), `${k}: ${v}`).toBe(true);
  });

  it('is today\'s dark palette: the page, card and text colours of the current app', () => {
    expect(TOKENS['--surface-page'].toLowerCase()).toBe('#0f0f1a');
    expect(TOKENS['--surface-card'].toLowerCase()).toBe('#1a1a2e');
    expect(TOKENS['--surface-raised'].toLowerCase()).toBe('#252540');
    expect(TOKENS['--text'].toLowerCase()).toBe('#e0e0e0');
    expect(TOKENS['--text-link'].toLowerCase()).toBe('#7eb8da');
  });

  const pairs = texts.flatMap((t) => surfaces.map((s) => [t, s]));
  it.each(pairs)('%s on %s meets 4.5 to 1', (t, s) => {
    expect(contrast(TOKENS[t], TOKENS[s])).toBeGreaterThanOrEqual(4.5);
  });

  it.each(fills)('%s: the words on it meet 4.5 to 1, and it stands out from every surface at 3 to 1', (fill) => {
    const on = fill.replace('--fill-', '--on-');
    expect(TOKENS[on], `${on} is missing`).toBeTruthy();
    expect(contrast(TOKENS[on], TOKENS[fill])).toBeGreaterThanOrEqual(4.5);
    for (const s of surfaces) expect(contrast(TOKENS[fill], TOKENS[s]), `${fill} on ${s}`).toBeGreaterThanOrEqual(3);
  });

  it.each(['--text-verdict-yes', '--text-verdict-close', '--text-verdict-no'])('A\'s verdict token %s exists and meets 4.5 to 1 on the band and every surface', (token) => {
    expect(isColour(TOKENS[token] || ''), `${token} is missing`).toBe(true);
    for (const s of surfaces) expect(contrast(TOKENS[token], TOKENS[s]), `${token} on ${s}`).toBeGreaterThanOrEqual(4.5);
  });

  it('the three verdicts are three different colours, and the style sheet gives each its own (a word goes with each: R14)', () => {
    const v = ['yes', 'close', 'no'].map((k) => TOKENS[`--text-verdict-${k}`].toLowerCase());
    expect(new Set(v).size).toBe(3);
    const css = read('components.css');
    for (const k of ['yes', 'close', 'no']) expect(css).toMatch(new RegExp(`\\.is-${k}[^{]*\\{[^}]*var\\(--text-verdict-${k}\\)`));
  });

  it('the bar of ten: a filled cell stands out from the card at 3 to 1, and an empty one has an edge that does', () => {
    const css = read('components.css');
    expect(css).toMatch(/\.bar-cell\s*\{[^}]*border:[^;}]*var\(--line-strong\)/);
    expect(css).toMatch(/\.bar-cell\.is-on\s*\{[^}]*background:\s*var\(--fill-primary\)/);
    expect(contrast(TOKENS['--fill-primary'], TOKENS['--surface-card'])).toBeGreaterThanOrEqual(3);
  });

  it.each(['--line-strong', '--focus'])('%s (the edge of a box, the focus ring) meets 3 to 1 on every surface', (line) => {
    expect(isColour(TOKENS[line] || ''), `${line} is missing`).toBe(true);
    for (const s of surfaces) expect(contrast(TOKENS[line], TOKENS[s]), `${line} on ${s}`).toBeGreaterThanOrEqual(3);
  });
});

describe('the style sheets', () => {
  const sheets = ['base.css', 'components.css'].map((f) => [f, read(f)]);

  it.each(sheets)('%s takes every colour from a token', (_f, css) => {
    expect(css.match(/#[0-9a-f]{3,8}\b/gi) || []).toEqual([]);
    expect(css.match(/\b(rgb|rgba|hsl|hsla)\(/gi) || []).toEqual([]);
    const names = /(?:color|background|background-color|border(?:-[a-z]+)?-color|outline-color|fill|stroke)\s*:\s*(white|black|red|green|blue|gr[ae]y|silver|yellow|orange)\b/gi;
    expect(css.match(names) || []).toEqual([]);
  });

  it.each(sheets)('%s uses only tokens that exist', (_f, css) => {
    for (const m of css.matchAll(/var\((--[a-z0-9-]+)/g)) expect(TOKENS[m[1]], m[1]).toBeTruthy();
  });

  it('greys nothing by making it see-through (that would break the contrast the tokens promise)', () => {
    for (const [f, css] of sheets) expect(css.match(/opacity\s*:\s*0?\.\d+/g) || [], f).toEqual([]);
  });

  it('has the three widths: phone first, 700 and up, 1024 and up', () => {
    const css = sheets.map(([, c]) => c).join('\n');
    expect(css).toMatch(/@media\s*\(min-width:\s*700px\)/);
    expect(css).toMatch(/@media\s*\(min-width:\s*1024px\)/);
    expect(css).toMatch(/@media\s*\(max-width:\s*699px\)/);
  });

  it('shows where the keyboard is, keeps 44 pixel targets, and stops movement when asked', () => {
    const css = sheets.map(([, c]) => c).join('\n');
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus\)/);
    expect(css).toMatch(/min-height:\s*var\(--target\)/);
    expect(TOKENS['--target']).toBe('44px');
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(css).not.toMatch(/outline:\s*(none|0)\b/);
  });

  it('v7/index.html links the three sheets and carries no style of its own', () => {
    const html = readFileSync(join(process.cwd(), 'v7/index.html'), 'utf8');
    for (const f of ['tokens.css', 'base.css', 'components.css']) expect(html).toContain(`styles/${f}`);
    expect(html).not.toMatch(/<style|style="/);
  });
});

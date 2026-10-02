/**
 * The layer rules of V7, enforced by reading the code (research/v7/architecture.md 3.1; build brief section 1).
 *
 *  1. src/answers/** never imports src/v7, src/ui, src/storage or src/firebase, and contains no Math.random,
 *     Date.now or bare new Date().
 *  2. Screens and components never import an answer function or an engine: they import only preact, components,
 *     words, the address functions, the pure readers, the formatter and a question's input list. No hooks in
 *     screens; hooks only in components.
 *  3. Nothing in src/v7/ imports src/storage, src/firebase, src/workers or src/ui/inlineHandlers.js.
 *     So V7 cannot change a saved plan: it cannot import the code that does.
 *  4. Only src/v7/effects/, src/v7/testing/ and src/v7/main.jsx use window, location, storage, Worker or the clock.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname, sep } from 'node:path';

const ROOT = process.cwd();
const rel = (p) => relative(ROOT, p).split(sep).join('/');

function filesUnder(dir, out = []) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) filesUnder(rel(p), out);
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(rel(p));
  }
  return out;
}

/** The code with comments removed; with `keepStrings: false` the contents of string literals go too. */
function strip(src, { keepStrings }) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i = src.indexOf('*/', i + 2); i = i === -1 ? src.length : i + 2; out += ' '; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      out += keepStrings ? src.slice(i, j + 1) : c + c;
      i = j + 1;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Every module a file pulls in: import … from, export … from, import '…', import('…'), new URL('…', import.meta.url). */
function importsOf(src) {
  const code = strip(src, { keepStrings: true });
  const found = [];
  const patterns = [
    /\b(?:import|export)\b[^'"`;()]*?\bfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /\bnew\s+URL\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*import\.meta\.url/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]/g
  ];
  for (const re of patterns) for (const m of code.matchAll(re)) found.push(m[1]);
  return [...new Set(found)];
}

/** A specifier as a path from the repository root ('src/v7/router/routes.js'), or the package name as written. */
function target(file, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return spec;
  return rel(resolve(join(ROOT, dirname(file)), spec.split('?')[0]));
}
const targetsOf = (file) => importsOf(readFileSync(join(ROOT, file), 'utf8')).map((s) => target(file, s));
const codeOf = (file) => strip(readFileSync(join(ROOT, file), 'utf8'), { keepStrings: false });
const under = (path, dir) => path === dir || path.startsWith(dir + '/');

const ANSWERS = filesUnder('src/answers');
const V7 = filesUnder('src/v7');
const isScreenLayer = (f) => under(f, 'src/v7/screens') || under(f, 'src/v7/components') || f === 'src/v7/App.jsx';
const mayTouchOutside = (f) => under(f, 'src/v7/effects') || under(f, 'src/v7/testing') || f === 'src/v7/main.jsx';

describe('the checker itself', () => {
  it('finds every form of import, and ignores comments', () => {
    const src = `
      import a from './a.js';
      import { b,
        c } from "../b.js";
      import './side.css';
      export { d } from './d.js';
      export * from './e.js';
      // import z from './commented.js';
      /* import y from './blocked.js'; */
      const w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
      const lazy = () => import('./lazy.js');
      import json from './x.json' with { type: 'json' };
    `;
    expect(importsOf(src).sort()).toEqual(['../b.js', './a.js', './d.js', './e.js', './lazy.js', './side.css', './worker.js', './x.json']);
  });
  it('strips strings and comments before looking for the clock', () => {
    const code = strip(`const s = "Date.now() in a string"; // new Date()\nconst t = \`window\`; const u = 'don\\'t';`, { keepStrings: false });
    expect(code).not.toMatch(/Date|window/);
    expect(CLOCK.some((re) => re.test(strip('const d = new Date();', { keepStrings: false })))).toBe(true);
    expect(CLOCK.some((re) => re.test(strip('const d = new Date(env.today);', { keepStrings: false })))).toBe(false);
    expect(OUTSIDE.some((re) => re.test('root = window.document'))).toBe(true);
    expect(OUTSIDE.some((re) => re.test('const allocation = relocation + windowed'))).toBe(false);
  });
  it('found the files it is meant to read', () => {
    expect(ANSWERS).toContain('src/answers/c/answer.js');
    expect(ANSWERS).toContain('src/answers/c/schema.js');
    expect(V7).toContain('src/v7/App.jsx');
    expect(V7).toContain('src/v7/main.jsx');
  });
});

const CLOCK = [/\bMath\s*\.\s*random\b/, /\bDate\s*\.\s*now\b/, /\bnew\s+Date\s*\(\s*\)/, /\bnew\s+Date\s*(?![\s(])/, /\bperformance\s*\.\s*now\b/];
const OUTSIDE = [/\bwindow\b/, /\blocation\b/, /\bsessionStorage\b/, /\blocalStorage\b/, /\bWorker\b/, /\bnavigator\b/, /\bfetch\s*\(/];

describe('rule 1 — the answers are pure and know nothing of the screen or of saving', () => {
  const BANNED = ['src/v7', 'src/ui', 'src/storage', 'src/firebase', 'src/workers'];
  it.each(ANSWERS)('%s', (file) => {
    for (const t of targetsOf(file)) for (const dir of BANNED) expect(under(t, dir), `${file} imports ${t}`).toBe(false);
    const code = codeOf(file);
    for (const re of [...CLOCK, ...OUTSIDE]) expect(re.test(code), `${file} uses ${re}`).toBe(false);
  });
});

describe('rule 2 — screens and components work out nothing', () => {
  const allowed = (t) =>
    t === 'preact' || t.startsWith('preact/') ||
    under(t, 'src/v7/components') || under(t, 'src/v7/screens') || under(t, 'src/v7/copy') || under(t, 'src/v7/styles') ||
    t === 'src/v7/router/routes.js' || t === 'src/v7/state/select.js' || t === 'src/v7/rail/index.js' ||
    t === 'src/answers/shared/format.js' || /^src\/answers\/[a-z]+\/schema\.js$/.test(t);
  const files = V7.filter(isScreenLayer);
  it.each(files)('%s', (file) => {
    for (const t of targetsOf(file)) {
      expect(allowed(t), `${file} imports ${t}`).toBe(true);
      if (!under(file, 'src/v7/components')) expect(t, `${file}: no hooks in a screen`).not.toBe('preact/hooks');
      if (!under(file, 'src/v7/components')) expect(t, `${file}: no hooks in a screen`).not.toBe('preact/compat');
    }
  });
});

describe('rule 3 — V7 cannot import the code that saves a plan', () => {
  const BANNED = ['src/storage', 'src/firebase', 'src/workers', 'src/ui/inlineHandlers.js'];
  it.each(V7)('%s', (file) => {
    for (const t of targetsOf(file)) {
      for (const dir of BANNED) expect(under(t, dir), `${file} imports ${t}`).toBe(false);
      expect(t === 'firebase' || t.startsWith('firebase/'), `${file} imports ${t}`).toBe(false);
    }
  });
  it('the answers do not import them either, so nothing reaches V7 that way', () => {
    for (const file of ANSWERS) for (const t of targetsOf(file)) {
      expect(under(t, 'src/storage') || under(t, 'src/firebase') || t === 'firebase' || t.startsWith('firebase/'), `${file} imports ${t}`).toBe(false);
    }
  });
});

describe('rule 4 — only the effects touch the outside', () => {
  const files = V7.filter((f) => !mayTouchOutside(f));
  it.each(files)('%s', (file) => {
    const code = codeOf(file);
    for (const re of [...OUTSIDE, ...CLOCK]) expect(re.test(code), `${file} uses ${re}`).toBe(false);
  });
});

describe('the words stay out of the code that calculates, and the other way round', () => {
  it('src/v7/copy imports nothing', () => {
    for (const file of filesUnder('src/v7/copy').filter((f) => f !== 'src/v7/copy/banned.js')) expect(targetsOf(file), file).toEqual([]);
  });
  it('the state, address and rail layers import only each other, input lists, validate.js and the version', () => {
    const files = V7.filter((f) => under(f, 'src/v7/state') || under(f, 'src/v7/router') || under(f, 'src/v7/rail'));
    const allowed = (t) => under(t, 'src/v7/state') || under(t, 'src/v7/router') || under(t, 'src/v7/rail') ||
      /^src\/answers\/[a-z]+\/schema\.js$/.test(t) || t === 'src/answers/shared/validate.js' || t === 'src/constants.js';
    // Step 4 brief 4.11: select.js alone may also read schemaParts.js (alreadyStopped, for the retired view) and format.js.
    // The budget step and "Save this as a plan" (budget-step.md; save-as-plan.md C.4, C.5): select.js also reads the pure
    // name rules (planName.js), the budget sheet's check and whether an answer can be saved (src/answers/keep/); the
    // sheet's own reducer (state/budget.js) reads the sheet's catalogue. Nothing in the state calculates an answer.
    const selectMay = (file, t) => file === 'src/v7/state/select.js' && (t === 'src/answers/shared/schemaParts.js' || t === 'src/answers/shared/format.js' ||
      t === 'src/answers/shared/planName.js' || t === 'src/answers/keep/budgetSheet.js' || t === 'src/answers/keep/planSeed.js');
    const budgetMay = (file, t) => file === 'src/v7/state/budget.js' && t === 'src/answers/keep/budgetSheet.js';
    // The spending shape (research/v7/spending-shape.md 4.3): the reducer's suggestion, presets and "in proportion", and the
    // spend step's picture, are the shape model's own — read through one file, state/shapeModel.js, which reads nothing else.
    const shapeMay = (file, t) => file === 'src/v7/state/shapeModel.js' && t === 'src/answers/shared/shape.js';
    for (const file of files) for (const t of targetsOf(file)) expect(allowed(t) || selectMay(file, t) || budgetMay(file, t) || shapeMay(file, t), `${file} imports ${t}`).toBe(true);
  });
});

describe('the budget is a guide, never an input (research/v7/budget-step.md "The rule")', () => {
  const ANSWER_CODE = ANSWERS.filter((f) => ['a', 'b', 'c', 'shared'].some((d) => under(f, `src/answers/${d}`)));
  it('found the answer code it is meant to read', () => {
    expect(ANSWER_CODE).toContain('src/answers/a/answer.js');
    expect(ANSWER_CODE).toContain('src/answers/shared/toEngine.js');
    expect(ANSWER_CODE).not.toContain('src/answers/keep/budgetSheet.js');
  });
  it.each(ANSWER_CODE)('%s neither imports src/answers/keep/ nor names a budget, outside comments', (file) => {
    for (const t of targetsOf(file)) expect(under(t, 'src/answers/keep'), `${file} imports ${t}`).toBe(false);
    const code = strip(readFileSync(join(ROOT, file), 'utf8'), { keepStrings: true });
    expect(/budget/i.test(code), `${file} names "budget" outside a comment`).toBe(false);
  });
  it('the answers and the runner see only the checked inputs: the input lists hold no budget field', async () => {
    const { SCHEMAS } = await import('../../src/v7/state/select.js');
    for (const q of Object.keys(SCHEMAS)) for (const f of SCHEMAS[q].fields) expect(f.path, `${q}.${f.path}`).not.toMatch(/budget|spendHow|skipNoted/i);
    const run = codeOf('src/v7/effects/run.js');
    expect(run, 'the runner never reads state.budget').not.toMatch(/\.budget\b/);
  });
  it('only effects/planSeed.js writes the plan seed, and only it (in V7) names localStorage', () => {
    const naming = V7.filter((f) => /\blocalStorage\b/.test(codeOf(f)));
    expect(naming).toEqual(['src/v7/effects/planSeed.js']);
  });
  it('the plan seed\'s key appears in V7 only through the seed module', () => {
    for (const file of V7) expect(strip(readFileSync(join(ROOT, file), 'utf8'), { keepStrings: true }), file).not.toMatch(/pt_v7_plan_seed/);
  });
});

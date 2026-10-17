/**
 * The layer rules of V7, enforced by reading the code (research/v7/architecture.md 3.1; build brief section 1;
 * research/v7/your-plan.md 4.1 — rule 3 made stricter, of a different kind, on 17 Oct 2026).
 *
 *  1. src/answers/** never imports src/v7, src/ui, src/storage or src/firebase, and contains no Math.random,
 *     Date.now or bare new Date().
 *  2. Screens and components never import an answer function or an engine: they import only preact, components,
 *     words, the address functions, the pure readers, the formatter and a question's input list. No hooks in
 *     screens; hooks only in components.
 *  3. V7 writes a plan only through ONE file, by declared field paths, past the lock guard (research/v7/editing-in-v7.md 1 —
 *     the rule changed on 17 Oct 2026 from "V7 can reach no write" when "About you and when" became editable in V7):
 *     3a. Reach: every import reachable from V7's entry points — static, dynamic, `export from`, worker URLs — is
 *         walked. No file reached is under src/storage, src/firebase or src/workers, nor is src/ui/inlineHandlers.js,
 *         with five named pure exceptions (the project's public settings, the upgrade, the migrations, the schema, the
 *         stress defaults), each of which may import only the others, src/constants.js, src/services, src/utils,
 *         src/strategies and src/data.
 *     3b. Firebase: exactly two V7 files import a `firebase` package, each by its own names — src/v7/effects/planSource.js
 *         (reads: firebase/app, firebase/auth, firebase/firestore/lite, read-only names) and src/v7/effects/planWrite.js
 *         (writes: firebase/firestore/lite, `doc` and `updateDoc` only). Every other name fails.
 *     3c. Write words: `updateDoc` appears in planWrite.js only (once, in its one write); setDoc, addDoc, deleteDoc,
 *         writeBatch and runTransaction appear nowhere V7 can reach. V7 can update fields of a plan that exists; it cannot
 *         create, delete or replace one.
 *     3d. Browser storage: only named effects files touch it, each only the keys its row allows; the window's plans
 *         (pt_guest_scenarios) are read by planSource.js with getItem only and written by planWrite.js only.
 *     3e. Field paths: planWrite.js checks every patch against the declared list (src/answers/plan/schema.js ALL_WRITES)
 *         before its one write; the effect's own test drives it with random boxes and plans (tests/v7/plan/planWrite.test.js).
 *     3f. The lock: planWrite.js imports the guard (services/LockedPlanGuard.js) and calls it before its one write.
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

/** The names imported from a package: import { a, b as c } from 'x' → ['a', 'b']; a default or namespace import → ['*']. */
function namesImportedFrom(src, pkg) {
  const code = strip(src, { keepStrings: true });
  const names = [];
  const re = new RegExp(`\\bimport\\s+([^;]*?)\\s+from\\s*['"]${pkg.replace(/[/.]/g, '\\$&')}['"]`, 'g');
  for (const m of code.matchAll(re)) {
    const clause = m[1].trim();
    const braces = /\{([^}]*)\}/.exec(clause);
    if (braces) for (const part of braces[1].split(',')) { const n = part.trim().split(/\s+as\s+/)[0].trim(); if (n) names.push(n); }
    if (!braces || /^\w|\*/.test(clause.replace(/\{[^}]*\}/, '').trim())) names.push('*');
  }
  return names;
}

/** A specifier as a path from the repository root ('src/v7/router/routes.js'), or the package name as written. */
function target(file, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return spec;
  return rel(resolve(join(ROOT, dirname(file)), spec.split('?')[0]));
}
const read = (file) => readFileSync(join(ROOT, file), 'utf8');
const targetsOf = (file) => importsOf(read(file)).map((s) => target(file, s));
const codeOf = (file) => strip(read(file), { keepStrings: false });
const under = (path, dir) => path === dir || path.startsWith(dir + '/');
const isPackage = (t) => !t.startsWith('src/') && !t.startsWith('v7/') && !t.startsWith('tests/');

const ANSWERS = filesUnder('src/answers');
const V7 = filesUnder('src/v7');
const isScreenLayer = (f) => under(f, 'src/v7/screens') || under(f, 'src/v7/components') || f === 'src/v7/App.jsx';
const mayTouchOutside = (f) => under(f, 'src/v7/effects') || under(f, 'src/v7/testing') || f === 'src/v7/main.jsx';

/** Every file reachable from the entry points, by every form of import. */
function reach(entries) {
  const seen = new Set();
  const queue = [...entries];
  while (queue.length) {
    const f = queue.shift();
    if (seen.has(f) || isPackage(f) || !existsSync(join(ROOT, f)) || !/\.(js|jsx|mjs)$/.test(f)) continue;
    seen.add(f);
    for (const t of targetsOf(f)) if (!isPackage(t)) queue.push(t);
  }
  return [...seen].sort();
}

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
  it('reads the names imported from a package', () => {
    expect(namesImportedFrom(`import { getAuth, signOut as out } from 'firebase/auth';\nimport { x } from 'firebase/app';`, 'firebase/auth')).toEqual(['getAuth', 'signOut']);
    expect(namesImportedFrom(`import * as fs from 'firebase/firestore';`, 'firebase/firestore')).toEqual(['*']);
    expect(namesImportedFrom(`import app from 'firebase/app';`, 'firebase/app')).toEqual(['*']);
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
    expect(ANSWERS).toContain('src/answers/plan/read.js');
    expect(V7).toContain('src/v7/App.jsx');
    expect(V7).toContain('src/v7/main.jsx');
    expect(V7).toContain('src/v7/effects/planSource.js');
  });
  it('the walk follows a dynamic import', () => {
    expect(reach(['src/v7/effects/index.js'])).toContain('src/v7/effects/planSource.js');
    expect(reach(['src/v7/effects/index.js'])).toContain('src/firebase/scenarioMigration.js');
  });
  it('the plan reading loads with the plan source only (your-plan.md 4.5): nothing the shell imports statically reaches it', () => {
    // the walk without the dynamic import: planSource.js is left out, and with it read.js, PlanReading.js and LifeStage.js
    const staticReach = (entries) => {
      const seen = new Set(); const queue = [...entries];
      while (queue.length) {
        const f = queue.shift();
        if (seen.has(f) || isPackage(f) || !existsSync(join(ROOT, f))) continue;
        seen.add(f);
        const code = strip(read(f), { keepStrings: true });
        for (const m of code.matchAll(/\b(?:import|export)\b[^'"`;()]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g)) { const t = target(f, m[1] || m[2]); if (!isPackage(t)) queue.push(t); }
      }
      return seen;
    };
    const shell = staticReach(['src/v7/main.jsx']);
    for (const f of ['src/v7/effects/planSource.js', 'src/answers/plan/read.js', 'src/services/PlanReading.js', 'src/services/LifeStage.js', 'src/firebase/scenarioMigration.js']) expect(shell.has(f), f).toBe(false);
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

// ---- rule 3 (research/v7/your-plan.md 4.1): nothing V7 can reach can write a plan ----------------------------------------

const ENTRIES = ['src/v7/main.jsx', 'src/v7/effects/answerWorker.js'];
const REACHED = reach(ENTRIES);
/** The five pure files of today's code the walk may reach (3a). */
const PURE_EXCEPTIONS = ['src/firebase/projectConfig.js', 'src/firebase/scenarioMigration.js', 'src/storage/migrations.js', 'src/storage/schema.js', 'src/storage/stressDefaults.js'];
const FORBIDDEN_DIRS = ['src/storage', 'src/firebase', 'src/workers'];
const FORBIDDEN_FILES = ['src/ui/inlineHandlers.js'];
/** The two Firebase files (3b): the reader and the writer, each with its packages and the names it may import from each. */
const FIREBASE_FILE = 'src/v7/effects/planSource.js';
const WRITE_FILE = 'src/v7/effects/planWrite.js';
const FIREBASE_FILES = {
  [FIREBASE_FILE]: {
    'firebase/app': ['initializeApp'],
    'firebase/auth': ['getAuth', 'setPersistence', 'browserLocalPersistence', 'onAuthStateChanged', 'signOut'],
    'firebase/firestore/lite': ['getFirestore', 'collection', 'getDocs']
  },
  [WRITE_FILE]: {
    'firebase/firestore/lite': ['doc', 'updateDoc']
  }
};
/** Never, anywhere V7 can reach: V7 cannot create, delete or replace a plan, nor write two at once. */
const NEVER_WORDS = /\b(setDoc|addDoc|deleteDoc|writeBatch|runTransaction)\b/;
/** The one write word, in the one write file only. */
const WRITE_WORD = /\bupdateDoc\b/g;
/** The effects that may touch browser storage (3d), and the keys each may name. */
const STORAGE_FILES = {
  'src/v7/effects/planSeed.js':   { keys: ['pt_v7_plan_seed', 'pt_v7_plan_receipt'], names: ['localStorage'] },
  'src/v7/effects/draftStore.js': { keys: ['pt_v7_draft'], names: ['sessionStorage'] },
  'src/v7/effects/activity.js':   { keys: ['pt_lastActivity'], names: [] },
  'src/v7/effects/planSource.js': { keys: ['pt_guest_scenarios'], names: [] },
  'src/v7/effects/planWrite.js':  { keys: ['pt_guest_scenarios'], names: [] },
  'src/v7/effects/openPlace.js':  { keys: [], names: [] }
};

describe('rule 3a — reach: every import from V7\'s entry points, walked', () => {
  it('reaches V7 and the answers, and nothing under src/storage, src/firebase or src/workers but the five pure files', () => {
    expect(REACHED.length).toBeGreaterThan(100);
    expect(REACHED).toContain('src/v7/App.jsx');
    expect(REACHED).toContain('src/answers/plan/read.js');
    const bad = REACHED.filter((f) => (FORBIDDEN_DIRS.some((d) => under(f, d)) || FORBIDDEN_FILES.includes(f)) && !PURE_EXCEPTIONS.includes(f));
    expect(bad).toEqual([]);
  });
  it.each(PURE_EXCEPTIONS)('%s is pure: it imports only the others, constants, services, utils, strategies and data', (file) => {
    expect(existsSync(join(ROOT, file)), file).toBe(true);
    for (const t of targetsOf(file)) {
      const ok = PURE_EXCEPTIONS.includes(t) || t === 'src/constants.js' || under(t, 'src/services') || under(t, 'src/utils') || under(t, 'src/strategies') || under(t, 'src/data') || under(t, 'src/models');
      expect(ok, `${file} imports ${t}`).toBe(true);
    }
    const code = codeOf(file);
    for (const re of OUTSIDE) expect(re.test(code), `${file} uses ${re}`).toBe(false);
  });
  it('the services the walk reaches never import the repositories or Firebase', () => {
    for (const f of REACHED.filter((x) => under(x, 'src/services') || under(x, 'src/utils') || under(x, 'src/strategies'))) {
      for (const t of targetsOf(f)) {
        expect(FORBIDDEN_DIRS.some((d) => under(t, d)) && !PURE_EXCEPTIONS.includes(t), `${f} imports ${t}`).toBe(false);
        expect(t === 'firebase' || t.startsWith('firebase/'), `${f} imports ${t}`).toBe(false);
      }
    }
  });
});

describe('rule 3b — exactly two V7 files talk to Firebase: the reader and the writer, each by its own names', () => {
  it('only planSource.js and planWrite.js import a firebase package, and nothing in src/answers does', () => {
    const naming = [...V7, ...ANSWERS].filter((f) => targetsOf(f).some((t) => t === 'firebase' || t.startsWith('firebase/')));
    expect(naming.sort()).toEqual(Object.keys(FIREBASE_FILES).sort());
  });
  it.each(Object.entries(FIREBASE_FILES))('%s imports only its packages, by its allowed names', (file, allowedByPkg) => {
    const src = read(file);
    const pkgs = targetsOf(file).filter((t) => t === 'firebase' || t.startsWith('firebase/'));
    expect(pkgs.sort()).toEqual(Object.keys(allowedByPkg).sort());
    for (const [pkg, allowed] of Object.entries(allowedByPkg)) {
      const names = namesImportedFrom(src, pkg);
      expect(names.length, pkg).toBeGreaterThan(0);
      for (const n of names) expect(allowed, `${file} imports ${n} from ${pkg}`).toContain(n);
    }
  });
  it('the writer imports exactly doc and updateDoc; the reader imports neither', () => {
    expect(namesImportedFrom(read(WRITE_FILE), 'firebase/firestore/lite').sort()).toEqual(['doc', 'updateDoc']);
    expect(namesImportedFrom(read(FIREBASE_FILE), 'firebase/firestore/lite')).not.toContain('updateDoc');
    expect(namesImportedFrom(read(FIREBASE_FILE), 'firebase/firestore/lite')).not.toContain('doc');
  });
  it('the full firestore package (with its cache and its writes) is never reached', () => {
    for (const f of REACHED) for (const t of targetsOf(f)) expect(t, `${f} imports ${t}`).not.toBe('firebase/firestore');
  });
  it('the writer makes no Firebase app of its own: it takes the reader\'s handle', () => {
    const code = codeOf(WRITE_FILE);
    expect(code).not.toMatch(/\b(initializeApp|getFirestore|getAuth)\b/);
    expect(strip(read(WRITE_FILE), { keepStrings: true })).toMatch(/handles\(\)/);
  });
});

describe('rule 3c — the one write word in the one write file; never a create, delete or replace', () => {
  it.each(REACHED)('%s', (file) => {
    const code = codeOf(file);
    const never = NEVER_WORDS.exec(code);
    expect(never && never[0], `${file} contains ${never && never[0]}`).toBeFalsy();
    const writes = code.match(WRITE_WORD) || [];
    if (file === WRITE_FILE) expect(writes.length, 'the import, the default and the one call').toBe(3);
    else expect(writes.length, `${file} contains updateDoc`).toBe(0);
  });
  it('3e, 3f: the writer checks every patch against the declared paths and the lock guard before its one write', () => {
    const code = strip(read(WRITE_FILE), { keepStrings: true });
    expect(targetsOf(WRITE_FILE)).toContain('src/answers/plan/schema.js');
    expect(targetsOf(WRITE_FILE)).toContain('src/services/LockedPlanGuard.js');
    expect(namesImportedFrom(read(WRITE_FILE), '../../answers/plan/schema.js')).toContain('ALL_WRITES');
    for (const n of ['isLockedSettings', 'lockedPlanWriteRefusal']) expect(namesImportedFrom(read(WRITE_FILE), '../../services/LockedPlanGuard.js')).toContain(n);
    // the save and the undo each pass through declaredOnly(...) and lockedRefusal(...) before write(...)
    expect((code.match(/declaredOnly\(/g) || []).length).toBeGreaterThanOrEqual(3);   // the definition, the save, the undo
    expect((code.match(/lockedRefusal\(/g) || []).length).toBeGreaterThanOrEqual(3);
    expect((code.match(/F\.updateDoc\(/g) || []).length).toBe(1);
  });
});

describe('rule 3d — browser storage: only the named effects, only their keys', () => {
  const KEY = /['"](pt_[A-Za-z0-9_]+|nextStepDismissed:)['"]/g;
  /** The keys a file names outside comments. */
  const keysNamed = (file) => [...strip(read(file), { keepStrings: true }).matchAll(KEY)].map((m) => m[1]);
  it('only the named files name a storage key or a storage object', () => {
    const naming = V7.filter((f) => keysNamed(f).length || /\b(localStorage|sessionStorage)\b/.test(codeOf(f)));
    for (const f of naming) expect(Object.keys(STORAGE_FILES), `${f} names a storage key or object`).toContain(f);
    expect(naming).toContain('src/v7/effects/planSource.js');
    expect(naming).toContain('src/v7/effects/activity.js');
  });
  it.each(Object.entries(STORAGE_FILES))('%s names only its own keys', (file, rule) => {
    for (const k of keysNamed(file)) expect(rule.keys, `${file} names ${k}`).toContain(k);
  });
  it('effects/index.js names no key', () => {
    expect(keysNamed('src/v7/effects/index.js')).toEqual([]);
  });
  it('the window\'s plans are read with getItem only by planSource.js, and written (setItem, never removed) by planWrite.js alone', () => {
    const code = strip(read(FIREBASE_FILE), { keepStrings: true });
    expect(code).toMatch(/getItem\(\s*GUEST_PLANS_KEY\s*\)/);
    expect(code).not.toMatch(/setItem\(\s*GUEST_PLANS_KEY/);
    expect(code).not.toMatch(/removeItem\(\s*GUEST_PLANS_KEY/);
    expect(code.match(/GUEST_PLANS_KEY/g).length).toBeGreaterThanOrEqual(2);
    const writer = strip(read(WRITE_FILE), { keepStrings: true });
    expect(writer).toMatch(/setItem\(\s*GUEST_PLANS_KEY/);
    expect(writer).not.toMatch(/removeItem\(\s*GUEST_PLANS_KEY/);
    for (const f of V7.filter((x) => x !== WRITE_FILE)) expect(strip(read(f), { keepStrings: true }), f).not.toMatch(/setItem\(\s*GUEST_PLANS_KEY|setItem\(\s*['"]pt_guest_scenarios/);
  });
  it('the plan seed\'s key appears in V7 only through the seed module', () => {
    for (const file of V7) expect(strip(read(file), { keepStrings: true }), file).not.toMatch(/pt_v7_plan_seed/);
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
    const code = strip(read(file), { keepStrings: true });
    expect(/budget/i.test(code), `${file} names "budget" outside a comment`).toBe(false);
  });
  it('the answers and the runner see only the checked inputs: the input lists hold no budget field', async () => {
    const { SCHEMAS } = await import('../../src/v7/state/select.js');
    for (const q of Object.keys(SCHEMAS)) for (const f of SCHEMAS[q].fields) expect(f.path, `${q}.${f.path}`).not.toMatch(/budget|spendHow|skipNoted/i);
    const run = codeOf('src/v7/effects/run.js');
    expect(run, 'the runner never reads state.budget').not.toMatch(/\.budget\b/);
  });
  it('only effects/planSeed.js writes the plan seed; localStorage is named by it and by the activity effect alone', () => {
    const naming = V7.filter((f) => /\blocalStorage\b/.test(codeOf(f)));
    expect(naming).toEqual(['src/v7/effects/planSeed.js']);
  });
});

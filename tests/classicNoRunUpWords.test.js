/**
 * The classic planner's words (7.3.3): no screen says the months "before the plan", and none says "bridge".
 *
 * Until 6.51.0 a retired person's plan started at the next April by default, and the months until then were given names —
 * the run-up, the bridge months, "before the plan's income starts". Nobody retired has months before their plan, so those
 * words are gone from both apps; a plan stored that way shows one thing to do instead (PlanMove.startLaterOf). The V7 words
 * are guarded by src/v7/copy/banned.js; this is the classic planner's guard, so the words cannot come back.
 *
 * It reads the code as text, with its comments taken out:
 *  - the phrases, in every file that draws the planner (index.html, src/ui) and in the services whose sentences it shows;
 *  - "bridge" as a word, inside the string literals and the page's markup of the same files — a strategy's id
 *    ('bridge-and-engine'), its dial (`bridgeAge`) and stored values ('bridge', a stage key and an ISA setting) are
 *    names in code, never words on screen, and are let through.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

/** Every .js file under a folder. */
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(f)) out.push(p);
  }
  return out;
}

/** The services and strategies whose sentences the planner shows as they are. */
const SHOWN = [
  'src/services/PlanTiming.js', 'src/services/LifeStage.js', 'src/services/StrategyWords.js', 'src/services/TransitionPlanner.js',
  'src/services/legacyDecision.js', 'src/services/HouseholdDraw.js', 'src/services/DecisionOverlay.js', 'src/services/NextStep.js',
  'src/services/LadderPosition.js', 'src/services/PlanMove.js', 'src/services/PlanDocument.js', 'src/services/TaxYearSetUp.js',
  'src/strategies/registry.js', 'src/strategies/stressTest.js', 'src/services/MonthDecision.js'
];
const FILES = ['index.html', ...walk(join(ROOT, 'src/ui')).map((p) => p.slice(ROOT.length + 1)), ...SHOWN];

/** The code without its comments: block comments, and line comments that are not inside a string (a URL's // is kept). */
function withoutComments(text) {
  let s = text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.split('\n').map((line) => {
    let q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
      if (c === '\'' || c === '"' || c === '`') q = c;
      else if (c === '/' && line[i + 1] === '/' && !/[:\w]$/.test(line.slice(0, i))) return line.slice(0, i);
    }
    return line;
  }).join('\n');
  return s;
}

/** The words that are gone: the months before the plan, by any of the names they had. */
const GONE = [
  /\brun[\s-]up\b/i,
  /\bbridge (years?|months?|cash)\b/i,
  /before (your|the) plan\\?('|’)?s? (income )?starts?/i,
  /before the plan\\?['’]s income/i,
  /next 6 April/i,
  /set aside until (then|the plan)/i,
  /money set aside until/i
];

/** "bridge" as a word inside a string literal or the markup: not a name in code. */
function bridgeWords(code, html = false) {
  const hits = [];
  const literals = code.match(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || [];
  const markup = html ? [code.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]*>/g, ' ')] : [];
  for (const lit of [...literals, ...markup]) {
    const inner = lit.replace(/^['"`]|['"`]$/g, '');
    if (/^bridge$/.test(inner)) continue;                        // a stored value: the stage key, an ISA setting
    if (/^[a-z]+(-[a-z]+)+$/.test(inner)) continue;             // a code in kebab case (an alert's type), never shown
    if (/\bbridge\b(?!-and-engine)/i.test(inner.replace(/\bbridge(Age|Cash|Cost|Months|Year|Records|Note)\b/g, ''))) hits.push(inner.slice(0, 120));
  }
  return hits;
}

describe('the classic planner never names months before the plan', () => {
  it('the guard catches the words it is there to catch, and not the names in code', () => {
    const say = (t) => GONE.some((re) => re.test(t));
    for (const t of ['the run-up to your plan', 'Run up', 'bridge years', 'the bridge months', 'cash set aside before the plan\'s income starts',
      'before your plan starts', 'next 6 April — 2027/28', 'paid from the money set aside until then']) expect(say(t), t).toBe(true);
    for (const t of ['runUpMonthly', 'bridgeYear', 'bridgeCash', 'The plan’s first tax year', 'this tax year — 2026/27']) expect(say(t), t).toBe(false);
    expect(bridgeWords("const a = 'Retired, the bridge to 67';")).toHaveLength(1);
    expect(bridgeWords("x === 'bridge' || id === 'bridge-and-engine' || p.bridgeAge")).toEqual([]);
    expect(withoutComments("const u = 'https://x.y/z'; // the run-up\nf(); /* bridge years */")).not.toMatch(/run-up|bridge years/);
  });

  for (const f of FILES) {
    it(f, () => {
      const code = withoutComments(readFileSync(join(ROOT, f), 'utf8'));
      const found = [];
      // a reader of the words stored on old records (PlanMove: which notes name an old start) matches them, never shows them
      code.split('\n').forEach((line, i) => { if (/startsWith\(/.test(line)) return; for (const re of GONE) if (re.test(line)) found.push((i + 1) + ': ' + line.trim().slice(0, 160)); });
      expect(found, 'months "before the plan" named on screen').toEqual([]);
      expect(bridgeWords(code, /\.html$/.test(f)), '"bridge" said on screen').toEqual([]);
    });
  }
});

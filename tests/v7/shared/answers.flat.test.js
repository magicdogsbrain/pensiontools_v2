/**
 * I-SS1 — a spend that is the same every year is today's answer, byte for byte (research/v7/spending-shape.md 9.1).
 *
 * answers.flat.json was written on 2 Oct 2026 from the answers as committed in 6.20.2 (ce0903a), BEFORE the spending shape
 * reached them: the cases of tests/v7/shared/flatCorpus.mjs (the 6.19.0 same-year corpus, every fixture and its swap,
 * couples who stop in different years, people of 54 to 57 around the 2028 rise), each with a hash of its WHOLE result —
 * every figure, every word of every sentence, what was assumed and the warnings, every key in its order — under Node 24,
 * and under Node 20 (what CI runs) where that Node works a last bit differently (`byNode`).
 *
 * The ONE change allowed: the 2028 drawdown note now shows for everyone it applies to (owner, 2 Oct 2026: "the 2028
 * drawdown warning for everyone it applies to"), where before only a couple who stop in different years had it. A case
 * whose pinned answer had no such note may gain it — the warning `drawdown-2028`, and nothing else: the test takes that one
 * warning out and the rest must hash as pinned. The cases that gain it are listed in the file (`gains2028`, by index), so
 * a case starting or stopping to gain it fails too; tests/v7/shared/drawdown2028.test.js holds who it is said to.
 *
 * The SECOND change allowed (6.22.0, the owner, 2 Oct 2026): how savings grow. A case with money in savings (or B's
 * savings set aside for the years before a pension opens) moves — its savings grow as "Mostly cash" unless chosen, where
 * the pinned code grew them at a fixed 3% a year, and its words say so; it is listed in answers.savingsGrowth.json with
 * the hash it gives now (savingsGrowthMoves.mjs; V7_PIN_SAVINGS=1). Every other case hashes as pinned.
 *
 * V7_PIN=1 re-pins (only ever from the code the file names); V7_PIN_NODE=1 adds this Node's hashes where they differ.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { flatCases, hashOf, whoIn2028, whoNamed2028 } from './flatCorpus.mjs';
import { movesOf, holdsSavings, PIN_SAVINGS } from './savingsGrowthMoves.mjs';

const FILE = resolve(process.cwd(), 'tests/v7/shared/answers.flat.json');
const ANSWER = { a: answerA, b: answerB, c: answerC };
const NODE = process.versions.node.split('.')[0];
const NOTE = 'drawdown-2028';

/** The result with the 2028 note taken out (the one change a pinned case may show). */
function without2028(r) {
  if (!Array.isArray(r.warnings) || !r.warnings.some((w) => w.id === NOTE)) return r;
  return { ...r, warnings: r.warnings.filter((w) => w.id !== NOTE) };
}
const has2028 = (r) => Array.isArray(r.warnings) && r.warnings.some((w) => w.id === NOTE);

if (process.env.V7_PIN === '1' || process.env.V7_PIN_NODE === '1') {
  const old = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : null;
  const cases = flatCases().map((x, k) => {
    const r = ANSWER[x.q](x.inputs, x.env);
    if (process.env.V7_PIN === '1') return { ...x, hash: hashOf(r), had2028: has2028(r) };
    const was = old.cases[k];
    const h = hashOf(old.gains2028 && old.gains2028.includes(k) ? without2028(r) : r);
    return h === was.hash ? was : { ...was, byNode: { ...(was.byNode || {}), [NODE]: h } };
  });
  writeFileSync(FILE, JSON.stringify({
    pinnedFrom: '6.20.2 (ce0903a), before the spending shape', node: process.env.V7_PIN === '1' ? NODE : old.node,
    gains2028: old ? old.gains2028 || [] : [], cases
  }, null, 0).replace(/\{"q":/g, '\n{"q":') + '\n');
}

const CORPUS = JSON.parse(readFileSync(FILE, 'utf8'));
const wanted = (x) => (x.byNode && x.byNode[NODE]) || x.hash;

describe('I-SS1: a flat spend is today\'s answer, byte for byte (the 2028 note the one change allowed)', () => {
  it('the corpus is what it says: every question, singles and couples, apart and together, nothing of the shape answered', () => {
    expect(CORPUS.cases.length).toBe(flatCases().length);
    for (const q of ['a', 'b', 'c']) expect(CORPUS.cases.filter((x) => x.q === q).length, q).toBeGreaterThan(40);
    expect(CORPUS.cases.filter((x) => x.inputs.household === 'couple' && x.inputs.partner && x.inputs.partner.stop).length).toBeGreaterThan(15);
    for (const x of CORPUS.cases) expect(JSON.stringify(x.inputs)).not.toMatch(/"then"|fallsPct|"steps"|"shape"/);
    // the cases are the generator's, in its order (a case moved would hash against another's pin)
    flatCases().forEach((x, k) => expect(JSON.stringify([x.q, x.inputs, x.env]), `case ${k}`).toBe(JSON.stringify([CORPUS.cases[k].q, CORPUS.cases[k].inputs, CORPUS.cases[k].env])));
  });

  const MOVES = movesOf('flat');
  for (const q of ['a', 'b', 'c']) {
    it(`question ${q.toUpperCase()}: every case hashes as pinned, the 2028 note aside, and only the listed cases gain it; how savings grow on the cases with savings`, () => {
      const moved = [];
      const gained = [];
      const named = [];
      const savings = [];
      CORPUS.cases.forEach((x, k) => {
        if (x.q !== q) return;
        const r = ANSWER[q](x.inputs, x.env);
        const gains = has2028(r) && !x.had2028;
        if (gains) gained.push(k);
        const h = hashOf(gains ? without2028(r) : r);
        if (holdsSavings(q, r) && h !== wanted(x)) {
          // how savings grow (6.22.0): money in savings, so the answer moved — away from its pin, to its new one
          savings.push(k);
          if (PIN_SAVINGS) MOVES.record(k, h);
          if (!MOVES.has(k) || h !== MOVES.wanted(k)) moved.push(`case ${k} (${x.from}, savings): ${JSON.stringify(x.inputs)}`);
        } else if (h !== wanted(x)) moved.push(`case ${k} (${x.from}): ${JSON.stringify(x.inputs)}`);
        else if (MOVES.has(k)) moved.push(`case ${k} is listed as moved, and hashes as pinned`);
        // the note names exactly the people the dates say it applies to (worked out on its own: flatCorpus.mjs whoIn2028)
        const want = whoIn2028(q, x.inputs, r);
        const got = whoNamed2028(r);
        if (JSON.stringify(want) !== JSON.stringify(got)) named.push(`case ${k} (${x.from}): named ${JSON.stringify(got)}, the dates say ${JSON.stringify(want)}`);
      });
      if (PIN_SAVINGS) MOVES.save();
      expect(moved).toEqual([]);
      // a case that moved with how savings grow may gain the note with it — its shown stop moved before 6 April 2028 (case
      // 237: "show me ages" at 54, £80,000 of savings, now 55); its new pin holds the rest, and `named` checks the note
      expect(gained.filter((k) => CORPUS.gains2028.includes(k) || !savings.includes(k))).toEqual(CORPUS.gains2028.filter((k) => CORPUS.cases[k].q === q));
      expect(named).toEqual([]);
      for (const k of MOVES.keys().filter((i) => CORPUS.cases[i] && CORPUS.cases[i].q === q)) expect(savings, `case ${k} is listed as moved without savings`).toContain(k);
    }, 240_000);
  }
});

/**
 * Same-year couples and single people get today's answers, byte for byte (research/v7/couples-different-years.md 4.4,
 * 9.1 I1 and 9.3 P4) — the three answers this time, not the engine (that is apart.identity.test.js).
 *
 * answers.sameYear.json was written on 1 Oct 2026 by the 6.19.0 answers (src/answers/a, b and c as committed in 6.19.0),
 * BEFORE couples who stop in different years reached them: the fixtures of A, B and C, and random inputs from each
 * question's own input list with the new questions never answered (the partner's stop, the pay line, the tax-free part,
 * "I've already stopped") — singles and couples stopping in the same year, "show me ages", the every-age table, B's
 * grid, C with a take. Each case holds its inputs, its env (20 futures) and a hash of the WHOLE result: every figure,
 * every word of every sentence, what was assumed and the warnings, every key in its order.
 *
 * `hash` was taken under Node 24. Node 20 (what CI runs) works a handful of these out a last bit differently — the 6.19.0
 * answers themselves, unchanged: a share of the pots such as 0.4183657540143565 against …567 — so a case whose hash
 * differs there carries `byNode["20"]`, taken under Node 20 from the 6.19.0 answers as committed (2 Oct 2026). Each Node
 * is held to 6.19.0 on that Node, byte for byte.
 *
 * The ONE change allowed since (owner, 2 Oct 2026): the 2028 drawdown note now shows for everyone it applies to, where in
 * 6.19.0 nobody here had it. The cases that gain it are listed below (GAINS_2028, by index); for those the test takes that
 * one warning (`drawdown-2028`) out and the rest must hash as 6.19.0 did. answers.flat.test.js holds who it names.
 *
 * The SECOND change allowed (6.22.0, the owner, 2 Oct 2026): how savings grow. A case with money in savings (or B's
 * savings set aside for the years before a pension opens) moves — its savings grow as "Mostly cash" unless chosen, where
 * 6.19.0 grew them at a fixed 3% a year, and its words say so; it is listed in answers.savingsGrowth.json with the hash it
 * gives now (savingsGrowthMoves.mjs). Every other case hashes as 6.19.0 did.
 *
 * Delete one release after 6.20.0, with sameYear.v1/.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { VERSION } from '../../../src/constants.js';
import { movesOf, holdsSavings, PIN_SAVINGS } from './savingsGrowthMoves.mjs';

const CASES = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/shared/answers.sameYear.json'), 'utf8'));
const ANSWER = { a: answerA, b: answerB, c: answerC };
// The result carries the app's version (basis.engineVersion); the pins were taken at 6.19.0, so that one stamp is read
// as 6.19.0 and everything else is compared byte for byte.
const PINNED_AT = '6.19.0';
const stamped = (text) => text.split(`"engineVersion":"${VERSION}"`).join(`"engineVersion":"${PINNED_AT}"`);
const hash = (r) => createHash('sha256').update(stamped(JSON.stringify(r))).digest('hex').slice(0, 24);
const NODE = process.versions.node.split('.')[0];
/** The hash 6.19.0 gave for a case on this Node (see the head of this file). */
const wanted = (x) => (x.byNode && x.byNode[NODE]) || x.hash;
/**
 * The cases that gain the 2028 note (people of 54 or 55 today who first draw before 6 April 2028), by index — the same
 * indices as answers.flat.json's first 171 cases, which are these. Nothing else of theirs may move.
 */
const GAINS_2028 = [24, 32, 38, 42, 43, 50, 58, 99, 102, 112, 116, 120, 121, 124, 138, 155, 157, 163];
const without2028 = (r) => ({ ...r, warnings: r.warnings.filter((w) => w.id !== 'drawdown-2028') });

describe('same-year couples and single people: today\'s answers, byte for byte', () => {
  it('the corpus is what it says: every question, couples and singles, nothing of the new questions answered', () => {
    for (const q of ['a', 'b', 'c']) expect(CASES.filter((x) => x.q === q).length, q).toBeGreaterThan(20);
    expect(CASES.filter((x) => x.inputs.household === 'couple').length).toBeGreaterThan(40);
    for (const x of CASES) {
      const text = JSON.stringify(x.inputs);
      expect(text).not.toMatch(/taxFreeTaken|untilBothStop|"already"/);
      expect(x.inputs.partner && x.inputs.partner.stop).toBeFalsy();
    }
  });

  const MOVES = movesOf('sameYear');
  for (const q of ['a', 'b', 'c']) {
    it(`question ${q.toUpperCase()}: every case hashes as it did in 6.19.0, the 2028 note aside on the listed cases, and how savings grow on the cases with savings`, () => {
      const moved = [];
      const gained = [];
      const savings = [];
      CASES.forEach((x, k) => {
        if (x.q !== q) return;
        const r = ANSWER[q](x.inputs, x.env);
        const gains = (r.warnings || []).some((w) => w.id === 'drawdown-2028');
        if (gains) gained.push(k);
        const got = hash(gains ? without2028(r) : r);
        if (holdsSavings(q, r) && got !== wanted(x)) {
          // how savings grow (6.22.0): money in savings, so the answer moved — away from 6.19.0, to its new pin
          savings.push(k);
          if (PIN_SAVINGS) MOVES.record(k, got);
          if (!MOVES.has(k) || got !== MOVES.wanted(k)) moved.push(`case ${k} (savings): ${JSON.stringify(x.inputs)}`);
        } else if (got !== wanted(x)) moved.push(`case ${k}: ${JSON.stringify(x.inputs)}`);
        else if (MOVES.has(k)) moved.push(`case ${k} is listed as moved, and hashes as 6.19.0 did`);
      });
      if (PIN_SAVINGS) MOVES.save();
      expect(moved).toEqual([]);
      expect(gained).toEqual(GAINS_2028.filter((k) => CASES[k].q === q));
      // every case listed as moved for this question holds savings
      for (const k of MOVES.keys().filter((i) => CASES[i] && CASES[i].q === q)) expect(savings, `case ${k} is listed as moved without savings`).toContain(k);
      expect(savings.length, q).toBeGreaterThan(0);
    }, 120_000);
  }
});

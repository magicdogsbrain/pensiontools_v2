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

  for (const q of ['a', 'b', 'c']) {
    it(`question ${q.toUpperCase()}: every case hashes as it did in 6.19.0`, () => {
      const moved = [];
      CASES.forEach((x, k) => {
        if (x.q !== q) return;
        const got = hash(ANSWER[q](x.inputs, x.env));
        if (got !== wanted(x)) moved.push(`case ${k}: ${JSON.stringify(x.inputs)}`);
      });
      expect(moved).toEqual([]);
    }, 120_000);
  }
});

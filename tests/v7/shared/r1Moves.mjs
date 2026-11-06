/**
 * The third change the pinned answer corpora allow (answers.sameYear.test.js, answers.flat.test.js): "Am I saving enough?"
 * said straight (research/saving-enough-and-check-in.md, release step R1, 4 Nov 2026). Every answer of question B moves on
 * purpose: it gains the verdict's band, what you could spend from the stop and the gap (`verdict`, `income`, `gap`), what
 * would be enough (`enough`) and the one-off sum (`levers.oneOff`); "Pay in more" becomes what would be enough; the number's
 * own block always says the number (the verdict says whether it is on course); a share of pay reads its grid in shares.
 * None of the figures of the one test moves (B's own suite holds them: tests/v7/b/enough.test.js and the invariants).
 *
 * answers.r1.json holds, for each corpus, every B case (by index) with the hash it gives since R1 — Node 24 as `hash`,
 * Node 20 (what CI runs) in `byNode` where it works a last bit differently, as the corpora themselves do. A B case must
 * equal its R1 pin; A and C are untouched by R1 and still hash as their own pins say.
 *
 *   V7_PIN_R1=1       re-pins the B cases of the corpus run, on this Node (as `hash` under Node 24, else in byNode)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve(process.cwd(), 'tests/v7/shared/answers.r1.json');
const NODE = process.versions.node.split('.')[0];
export const PIN_R1 = process.env.V7_PIN_R1 === '1';
const WHY = 'Am I saving enough? said straight (R1, research/saving-enough-and-check-in.md): every B answer gains its verdict, the two incomes and the gap, what would be enough and the one-off sum, so every B case of each corpus is pinned again here, by index — Node 24 as `hash`, Node 20 in byNode where it differs. Written by V7_PIN_R1=1 (tests/v7/shared/r1Moves.mjs).';

/** The R1 pins of one corpus ('sameYear' | 'flat'): { wanted(k), has(k), keys(), record(k, hash), save() }. */
export function r1MovesOf(corpus) {
  const all = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { why: WHY, sameYear: {}, flat: {} };
  const moves = all[corpus] || (all[corpus] = {});
  return {
    has: (k) => Object.prototype.hasOwnProperty.call(moves, String(k)),
    keys: () => Object.keys(moves).map(Number),
    wanted: (k) => { const x = moves[String(k)]; return x && ((x.byNode && x.byNode[NODE]) || x.hash); },
    record: (k, hash) => {
      const key = String(k);
      const x = moves[key] || {};
      if (NODE === '24' || !x.hash) moves[key] = { ...x, hash: NODE === '24' ? hash : x.hash || hash };
      if (NODE !== '24' && moves[key].hash !== hash) moves[key] = { ...moves[key], byNode: { ...(moves[key].byNode || {}), [NODE]: hash } };
      else if (NODE !== '24' && moves[key].byNode) { const { [NODE]: _gone, ...rest } = moves[key].byNode; void _gone; moves[key] = { ...moves[key], byNode: rest }; }
    },
    save: () => {
      // read again: the other corpus may have written its own pins since (only this corpus's are written here)
      const fresh = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { sameYear: {}, flat: {} };
      Object.assign(all, { ...fresh, why: WHY, [corpus]: Object.fromEntries(Object.entries(moves).sort((a, b) => Number(a[0]) - Number(b[0]))) });
      writeFileSync(FILE, JSON.stringify(all, null, 1) + '\n');
    }
  };
}

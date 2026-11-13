/**
 * The fourth change the pinned answer corpora allow (answers.sameYear.test.js, answers.flat.test.js): the levels (7.8.0
 * step 4a, research/v7/replan-nov-2026.md 5). Every answer of A, B and C moves on purpose, by its keys only: the figure it
 * stands behind is read at `levels[level]` (Balanced unless chosen; with SUCCESS.weighted false Balanced is the careful
 * figure before 7.8.0, to the pound), it gains `level`, `levels`, `chance` and the basis's level block, and the count's
 * middling and best-1-in-10 amounts leave it (the words that named them change with them). A stored `confidence` ("9 in 10"
 * or "3 in 4", B's default and choice before 7.8.0) reads as Balanced. Every carried figure is held unchanged by the script
 * in the 7.8.0 pins notes (pins780.mjs: 251 cases, every carried value equal).
 *
 * answers.levels780.json holds, for each corpus, every case (by index) with the hash it gives since — Node 24 as `hash`,
 * Node 20 (what CI runs) in `byNode` where it works a last bit differently, as the corpora themselves do. A case listed here
 * must equal this pin; the older layers (R1, how savings grow, the 2028 note) are what it moved from.
 *
 *   V7_PIN_LEVELS=1   re-pins every case of the corpus run, on this Node (as `hash` under Node 24, else in byNode)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve(process.cwd(), 'tests/v7/shared/answers.levels780.json');
const NODE = process.versions.node.split('.')[0];
export const PIN_LEVELS = process.env.V7_PIN_LEVELS === '1';
const WHY = 'The levels (7.8.0): every answer reads the figure it stands behind at levels[level] and gains level, levels, chance and the basis\'s level block; the count\'s middling and best-1-in-10 amounts leave it; with SUCCESS.weighted true each level is weighted by how long people live (Balanced 18 times in 20), the runs follow each future on to the 1-in-50 age and the plan-to age is the 1-in-10 age. Every case of each corpus is pinned again here, by index — Node 24 as `hash`, Node 20 in byNode where it differs. Written by V7_PIN_LEVELS=1 (tests/v7/shared/levelMoves.mjs).';

/** The level pins of one corpus ('sameYear' | 'flat'): { wanted(k), has(k), keys(), record(k, hash), save() }. */
export function levelMovesOf(corpus) {
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

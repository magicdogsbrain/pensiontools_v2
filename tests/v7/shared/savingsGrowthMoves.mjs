/**
 * The second change the pinned answer corpora allow (answers.sameYear.test.js, answers.flat.test.js): how savings grow
 * (6.22.0; the owner, 2 Oct 2026). Every answer grew savings at a fixed 3% a year whatever prices did; they now grow as the
 * household chooses, "Mostly cash" (last year's rise in prices less 1%, never below nothing) unless chosen, while saving
 * and once stopped, and the words say so. So a case MOVES when, and only when, money is in savings for that choice to
 * grow:
 *   - the household holds savings, or puts money into them each month (its checked inputs then carry `isaGrowth`); or
 *   - B sets savings aside for the years before a pension can be touched (`outside`): those savings grow as cash too.
 * Every other case must still hash as its pin says (the code the corpus names), byte for byte.
 *
 * answers.savingsGrowth.json holds, for each corpus, the cases that moved (by index) and the hash each gives now, under
 * Node 24 (`hash`) and, where Node 20 (what CI runs) works a last bit differently, under Node 20 (`byNode`), as the corpora
 * themselves do. A moved case must differ from its old pin and equal its new one.
 *
 *   V7_PIN_SAVINGS=1       re-pins the moved cases of the corpus run, on this Node (as `hash` under Node 24, else in byNode)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve(process.cwd(), 'tests/v7/shared/answers.savingsGrowth.json');
const NODE = process.versions.node.split('.')[0];
export const PIN_SAVINGS = process.env.V7_PIN_SAVINGS === '1';

/** Whether money is in savings for the choice to grow, in this answer (the one reason a pinned case may move). */
export function holdsSavings(q, r) {
  const i = (r && r.inputs) || {};
  return i.savings > 0 || i.savingsIn > 0 || (q === 'b' && Boolean(r.outside));
}

/** The moves of one corpus ('sameYear' | 'flat'): { wanted(k), has(k), record(k, hash), save() }. */
export function movesOf(corpus) {
  const all = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { why: '', sameYear: {}, flat: {} };
  const moves = all[corpus] || (all[corpus] = {});
  return {
    has: (k) => Object.prototype.hasOwnProperty.call(moves, String(k)),
    /** The indices listed as moved. */
    keys: () => Object.keys(moves).map(Number),
    /** The hash a moved case gives now, on this Node. */
    wanted: (k) => { const x = moves[String(k)]; return x && ((x.byNode && x.byNode[NODE]) || x.hash); },
    /** Re-pin (V7_PIN_SAVINGS=1): the case's hash now, on this Node. */
    record: (k, hash) => {
      const key = String(k);
      const x = moves[key] || {};
      if (NODE === '24' || !x.hash) moves[key] = { ...x, hash: NODE === '24' ? hash : x.hash || hash };
      if (NODE !== '24' && moves[key].hash !== hash) moves[key] = { ...moves[key], byNode: { ...(moves[key].byNode || {}), [NODE]: hash } };
    },
    save: () => {
      // read again: the other corpus may have written its own moves since (only this corpus's are written here)
      const fresh = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { sameYear: {}, flat: {} };
      Object.assign(all, { ...fresh, [corpus]: moves });
      all.why = 'How savings grow (6.22.0): the cases whose answers moved because money is in savings ("Mostly cash" unless chosen, where every answer grew savings at a fixed 3% a year), by index, with the hash each gives now — Node 24 as `hash`, Node 20 in byNode where it differs. Written by V7_PIN_SAVINGS=1 (tests/v7/shared/savingsGrowthMoves.mjs).';
      all[corpus] = Object.fromEntries(Object.entries(moves).sort((a, b) => Number(a[0]) - Number(b[0])));
      writeFileSync(FILE, JSON.stringify(all, null, 1) + '\n');
    }
  };
}

/**
 * A saver whose plan draws by a way other than pots and valves or buckets (7.10.0; spec-7100 §6, §8): the verdict on "What
 * you pay in" and the check-in is worked out as if the money were drawn from pots, and says so with the way the plan draws.
 * Every other plan's notes are as they were (no new key), so no saver figure or pinned reading moves. Fictional corpus plans.
 */
import { describe, it, expect } from 'vitest';
import { saverInputsOf, POTS_WAYS } from '../../../src/answers/plan/saverInputs.js';
import { checkInOf } from '../../../src/answers/plan/checkIn.js';
import { SAVING } from '../../../src/v7/copy/saving.js';
import { CHECKIN } from '../../../src/v7/copy/checkin.js';
import { corpus, entryOf, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const drawingBy = (plan, id) => { const p = copy(plan); p.stressTool.settings.strategyId = id; return p; };

describe('the verdict says it is worked out as if drawn from pots, only when the plan draws another way', () => {
  it('pots and valves and buckets: no `way` note, the notes exactly as before', () => {
    expect(POTS_WAYS).toEqual(['pots-and-valves', 'buckets-in-order']);
    for (const name of ['05-saver-committed', '10-couple-b', '19-back-to-work-saving']) {
      const plain = saverInputsOf(entryOf(C[name]).plan, { today: TODAY });
      expect(plain.ok, name).toBe(true);
      expect('way' in plain.notes, name).toBe(false);
      const buckets = saverInputsOf(entryOf(drawingBy(C[name], 'buckets-in-order')).plan, { today: TODAY });
      expect('way' in buckets.notes, name).toBe(false);
    }
  });

  it('a gilt ladder or a floor: the way named, and the inputs and figures the verdict runs on unchanged', () => {
    const base = entryOf(C['05-saver-committed']).plan;
    const plain = saverInputsOf(base, { today: TODAY });
    for (const id of ['full-il-gilt', 'floor-and-flex', 'bridge-and-engine']) {
      const other = saverInputsOf(entryOf(drawingBy(C['05-saver-committed'], id)).plan, { today: TODAY });
      expect(other.ok).toBe(true);
      expect(other.notes.way).toBe(id);
      const { way, ...rest } = other.notes;
      expect(rest).toEqual(plain.notes);
      expect(other.inputs).toEqual(plain.inputs);
      expect(other.env).toEqual(plain.env);
    }
  });

  it('the check-in carries the same note; the words name the way, never advise', () => {
    const p = drawingBy(C['05-saver-committed'], 'full-il-gilt');
    const v = checkInOf([entryOf(p)], p.id, { today: TODAY });
    expect(v.found).toBe(true);
    expect(v.notes.way).toBe('full-il-gilt');
    const plainView = checkInOf([entryOf(C['05-saver-committed'])], C['05-saver-committed'].id, { today: TODAY });
    expect('way' in plainView.notes).toBe(false);
    for (const t of [SAVING.verdict.way, CHECKIN.result.way]) {
      expect(t).toBe('Worked out as if the money were drawn from pots; your plan draws by {way}.');
      expect(t).not.toMatch(/should|recommend/i);
    }
  });
});

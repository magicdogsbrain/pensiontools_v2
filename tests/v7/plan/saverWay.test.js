/**
 * A saver whose plan draws by a way other than pots and valves (7.10.0; spec-7100 §6, §8; the lead's ruling 7): the verdict
 * on "What you pay in" and the check-in is worked out in the plan's own way of drawing (the plan itself, env.fromPlan,
 * keep/planPath.js), so it no longer says "worked out as if the money were drawn from pots": no plan's notes carry a `way`.
 * Fictional corpus plans.
 */
import { describe, it, expect } from 'vitest';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { checkInOf } from '../../../src/answers/plan/checkIn.js';
import { corpus, entryOf, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const drawingBy = (plan, id) => { const p = copy(plan); p.stressTool.settings.strategyId = id; return p; };

describe('the verdict is worked out in the plan\'s own way of drawing', () => {
  it('every way: no `way` note, the plan itself carried, and the inputs as for pots and valves', () => {
    const base = entryOf(C['05-saver-committed']).plan;
    const plain = saverInputsOf(base, { today: TODAY });
    expect(plain.ok).toBe(true);
    expect(plain.env.fromPlan.plan).toBe(base);
    for (const id of ['buckets-in-order', 'full-il-gilt', 'floor-and-flex', 'bridge-and-engine']) {
      const plan = entryOf(drawingBy(C['05-saver-committed'], id)).plan;
      const other = saverInputsOf(plan, { today: TODAY });
      expect(other.ok, id).toBe(true);
      expect('way' in other.notes, id).toBe(false);
      expect(other.notes).toEqual(plain.notes);
      expect(other.inputs).toEqual(plain.inputs);
      expect(other.env.fromPlan.plan).toBe(plan);
    }
  });

  it('the check-in carries no `way` note either', () => {
    const p = drawingBy(C['05-saver-committed'], 'full-il-gilt');
    const v = checkInOf([entryOf(p)], p.id, { today: TODAY });
    expect(v.found).toBe(true);
    expect('way' in v.notes).toBe(false);
  });
});

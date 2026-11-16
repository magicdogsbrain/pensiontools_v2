/** Fictional Sam's stored plan for the move's tests (7.12.0): see tests/helpers/samMove.js. No real person's figures. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { entryOf } from './_plans.js';
import { asMoving } from './_alex.js';
import { samDoc, samLines } from '../../helpers/samMove.js';

export const SAM_MOVE_TODAY = '2026-11-16';

/** Sam's stored plan: the corpus's locked ladder, read as Moving to October 2027, with Sam's document and record. */
export function samMovePlan({ lines = samLines(), docOver = {} } = {}) {
  const raw = asMoving(JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8')), { stop: '2027-10' });
  raw.id = 'SamMove01';
  raw.planDetails = { ...raw.planDetails, name: 'Sam plan' };
  delete raw.household;
  const d = samDoc(docOver), was = raw.planDocument;
  raw.planDocument = { ...was, timing: { ...was.timing, firstTaxYear: 2027, startMonth: '2027-10' }, pots: { ...was.pots, ...d.pots },
    strategy: { ...was.strategy, contract: true, params: { ...was.strategy.params, ...d.strategy.params }, r: { ...was.strategy.r, ...d.strategy.r } } };
  raw.holdings = { version: 1, updatedAt: '2026-11-01', source: 'typed', offerDismissed: false, lines };
  return entryOf(raw, SAM_MOVE_TODAY).plan;
}


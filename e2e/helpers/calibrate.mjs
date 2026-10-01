/**
 * How fast is this machine, against the one the answer budgets were set on?
 *
 * The journeys' waits are measured at full speed and multiplied by SLOWDOWN to stand for a phone four times slower
 * than the reference machine (the owner's Mac, where the budgets were measured). A GitHub runner is itself several
 * times slower than that Mac, so multiplying its waits by four counted the slowness twice and failed answers that a
 * real phone gets in time. This times one fixed piece of work — question C for one person at 1,000 futures, the best
 * of three — and scales the multiplier by how much slower this machine is: SLOWDOWN = 4 × reference ÷ measured,
 * never above 4 (a faster machine is not let off) and never below 1 (a wait is never shrunk).
 */
import { answerC } from '../../src/answers/c/answer.js';

/** Best of three on the reference machine (MacBook, Node 24, 1 Oct 2026). Re-measure with `node e2e/helpers/calibrate.mjs`. */
export const REFERENCE_MS = 205;

const INPUTS = { household: 'single', you: { pot: 250_000, age: 58, statePension: { kind: 'full' }, finalSalary: { has: false } }, start: { kind: 'now' } };
const ENV = { today: '2026-10-01', futures: 1000 };

export function measureMs(runs = 3) {
  answerC(INPUTS, { ...ENV, futures: 50 });                 // warm the code
  let best = Infinity;
  for (let i = 0; i < runs; i++) {
    const t = performance.now();
    answerC(INPUTS, ENV);
    best = Math.min(best, performance.now() - t);
  }
  return best;
}

export function slowdownFor(measured, reference = REFERENCE_MS) {
  return Math.min(4, Math.max(1, 4 * reference / measured));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ms = measureMs(5);
  console.log(`best of 5: ${ms.toFixed(1)} ms; slowdown here ${slowdownFor(ms).toFixed(2)}`);
}

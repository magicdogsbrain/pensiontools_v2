// Runs once before the browser tests: sets E2E_SLOWDOWN for every worker from this machine's measured speed
// (e2e/helpers/calibrate.mjs). An E2E_SLOWDOWN already set (e.g. 4 by hand) is kept.
import { measureMs, slowdownFor, REFERENCE_MS } from './helpers/calibrate.mjs';

export default async function globalSetup() {
  if (process.env.E2E_SLOWDOWN) return;
  const ms = measureMs();
  const s = slowdownFor(ms);
  process.env.E2E_SLOWDOWN = String(s);
  console.log(`[calibrate] fixed work ${ms.toFixed(0)} ms here, ${REFERENCE_MS} ms on the reference machine: waits × ${s.toFixed(2)}`);
}

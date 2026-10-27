/**
 * fast-check's options for every V7 property file: the push run, the night run, and the night's replay by name.
 *
 * Every push: the file's own fixed seed and small count (`seed` and `runs` exactly as the file passes them), so a red
 * run is the code's fault and can be repeated exactly. Nightly (NIGHTLY=1 FC_RUNS=2000, .github/workflows/nightly.yml):
 * a fresh seed — the file passes `undefined` — which fast-check prints with the path to the counterexample when a
 * property fails.
 *
 * REPLAYING A NIGHT FAILURE BY NAME. The failure block prints `{ seed: S, path: "P", endOnFailure: true }` under the
 * test's name. Hand both to the file through the environment and run that one test:
 *
 *   NIGHTLY=1 FC_SEED=S FC_PATH="P" npx vitest run tests/v7/a/properties.test.js -t "PA3"
 *
 * FC_SEED sets the seed (a number; the night's, or any other). FC_PATH sets the path and turns endOnFailure on, so
 * fast-check goes straight to the recorded counterexample (its shrunk form, by the path) and stops at the first failure;
 * with the fault fixed it runs on through the rest of that shrink level's candidates (a finite list) and ends green.
 * NIGHTLY=1 is what the night set, so the files read their night-time settings as they did. FC_SEED alone runs the
 * night's whole sequence from that seed, FC_RUNS deep. Neither is read on a push: without them the options are the file's
 * own, byte for byte.
 */
export function fcOptions({ seed, runs }) {
  const out = { seed, numRuns: runs, verbose: 1 };
  const s = process.env.FC_SEED;
  if (s !== undefined && s !== '') out.seed = Number(s);
  if (process.env.FC_PATH) { out.path = process.env.FC_PATH; out.endOnFailure = true; }
  return out;
}

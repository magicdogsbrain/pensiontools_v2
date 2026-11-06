/**
 * Who holds a copy of the open plan, so all of them can be dropped at once (6.20.2).
 *
 * When the store refuses a write because the plan was locked after this tab loaded it (FirestoreService.saveScenario:
 * locked on another device, or in another tab), every copy this tab holds is out of date. ScenarioRepository, the
 * Stress repository and the Decision repository each register the function that drops theirs; ScenarioRepository calls
 * dropStalePlanCopies on that refusal, and the next read loads the plan as stored (locked).
 *
 * A module of its own, so the repositories can register without importing one another for it (and a test that stands
 * in for one repository does not stop the others loading).
 */
const holders = new Set();

/** Register a function that drops a copy of the open plan. */
export function onPlanCopyStale(drop) { holders.add(drop); }

/** Drop every registered copy. A holder that throws does not stop the others. */
export function dropStalePlanCopies() {
  for (const drop of holders) { try { drop(); } catch (e) { /* not a reason to fail the caller */ } }
}

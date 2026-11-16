/**
 * The ratchet (brief 2.5): a scenario whose question an area chose not to answer this release is listed in
 * known-unanswered.json with its owner and reason, and runs under test.fail(): it must still fail, and the day it passes
 * the run says so. The list may only shrink from one release to the next (tests/scenarioRules.test.js).
 */
import { readFileSync } from 'node:fs';
import { test } from '@playwright/test';

const LIST = JSON.parse(readFileSync(new URL('./known-unanswered.json', import.meta.url), 'utf8')).unanswered;

/** Call first in a scenario: marks it as expected to fail when it is on the list. */
export function knownUnanswered(scenario) {
  const known = LIST.find((x) => x.scenario === scenario);
  if (known) test.fail(true, `not answered yet (${known.owner}): ${known.reason}`);
  return known || null;
}

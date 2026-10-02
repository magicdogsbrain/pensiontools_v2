/**
 * One bar for "on course" (6.22.0; research/saver-lock-and-savings-growth.md §6, test 18; the owner, 2 Oct 2026:
 * "'on course' = 9 in 10 everywhere").
 *
 * Until 6.22.0 "Am I on track?" searched for the pot that lasted in 85% of futures, the age spin cleared 90%, the couples
 * checks were "solid" from 85%, and V7 said 9 in 10. Now every one of them is the one number in services/OnCourse.js,
 * and V7's own bar is asserted equal to it.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

import {
  ON_COURSE_SHARE, ON_COURSE_PCT, ON_COURSE_WORDS, isOnCourse, onCourseAlertClass, jointVerdictHtml, onCourseBasisHtml,
  onCourseVerdictHtml, ON_COURSE_SEARCHING, confidenceWords
} from '../src/services/OnCourse.js';
import { BAND, VERDICT } from '../src/answers/shared/rules.js';
import { requiredPotForSuccess } from '../src/services/AccumulationEngine.js';
import { requiredPotForStrategy } from '../src/strategies/stressTest.js';
import { earliestAt, sweepHeadline } from '../src/services/RetireSweep.js';
import { answerLastedWords } from '../src/services/PlanSeed.js';
import { STAGES } from '../src/services/LifeStage.js';
import { NEXT_STEP_WORDS } from '../src/services/NextStep.js';

const SRC = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const doc = new JSDOM(SRC.replace(/<script[\s\S]*?<\/script>/g, '')).window.document;
const script = [...SRC.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1])).map((m) => m[2]).join('\n');
const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const defaultIn = (file, fn) => { const m = new RegExp('export function ' + fn + '\\([^)]*successTarget\\s*=\\s*([A-Za-z_][A-Za-z_0-9.]*)').exec(read(file)); return m ? m[1] : null; };

describe('the one number', () => {
  it('is 9 in 10, in every form', () => {
    expect(ON_COURSE_SHARE).toBe(0.9);
    expect(ON_COURSE_PCT).toBe(90);
    expect(ON_COURSE_WORDS).toBe('lasts in 9 futures out of 10');
  });
  it('V7\'s careful line and its "yes" verdict are the same bar', () => {
    expect(BAND.careful).toBe(ON_COURSE_SHARE);
    expect(1 - VERDICT.yes).toBeCloseTo(ON_COURSE_SHARE, 12);
  });
  it('isOnCourse: 90% and above; not 89.9%, not a non-number', () => {
    expect(isOnCourse(0.9)).toBe(true);
    expect(isOnCourse(0.95)).toBe(true);
    expect(isOnCourse(1)).toBe(true);
    expect(isOnCourse(0.899)).toBe(false);
    expect(isOnCourse(0.85)).toBe(false);
    for (const v of [null, undefined, NaN, '0.95']) expect(isOnCourse(v)).toBe(false);
  });
  it('both required-pot searches default to it', () => {
    expect(typeof requiredPotForSuccess).toBe('function');
    expect(typeof requiredPotForStrategy).toBe('function');
    expect(defaultIn('src/services/AccumulationEngine.js', 'requiredPotForSuccess')).toBe('ON_COURSE_SHARE');
    expect(defaultIn('src/strategies/stressTest.js', 'requiredPotForStrategy')).toBe('ON_COURSE_SHARE');
  });
});

describe('"Am I on course?" on the Accumulation planner', () => {
  it('the heading and its words say 9 in 10; 85% is gone', () => {
    const titles = [...doc.querySelectorAll('#accumulation-content .section-title')].map((e) => e.textContent.trim());
    expect(titles).toContain('Am I on course?');
    expect(titles).not.toContain('Am I on track?');
    const acc = doc.querySelector('#accumulation-content').textContent.replace(/\s+/g, ' ');
    expect(acc).toContain('lasts in 9 futures out of 10');
    expect(acc).not.toMatch(/85% success/);
    expect(SRC).not.toMatch(/85% success/);
    expect(SRC).not.toMatch(/85% Monte-Carlo success/);
  });
  it('the search runs at the one bar, for Pots & Valves and for every other strategy', () => {
    const at = script.indexOf('window.runOnTrackCheck');
    expect(at).toBeGreaterThan(-1);
    const body = script.slice(at, script.indexOf('\n    };', at));
    expect(body).toMatch(/requiredPotForSuccess\(createSimulationConfigFromSettings\(\{\}, sSet\), ON_COURSE_SHARE, 300\)/);
    expect(body).toMatch(/requiredPotForStrategy\(stratId, strategyPlanFor\(sSet\), ON_COURSE_SHARE\)/);
    expect(body).not.toMatch(/0\.85/);
    expect(body).not.toMatch(/on track/);
  });
  it('the words: searching, the basis and each row\'s verdict', () => {
    expect(ON_COURSE_SEARCHING).toMatch(/the pot that lasts in 9 futures out of 10/);
    expect(onCourseBasisHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves' })).toMatch(/^to last in 9 futures out of 10 with <strong>Pots &amp; Valves<\/strong>/);
    expect(onCourseBasisHtml({ strategyId: 'buckets-in-order', name: 'Buckets in order' })).toMatch(/to last in 9 futures out of 10 with <strong>Buckets in order<\/strong>/);
    expect(onCourseBasisHtml({ strategyId: 'full-il-gilt', name: 'Full ladder' })).toMatch(/to buy every year of your income shape by contract/);
    expect(onCourseVerdictHtml(500000, 400000)).toMatch(/on course ✓/);
    expect(onCourseVerdictHtml(300000, 400000)).toMatch(/short by £100,000/);
    expect(onCourseVerdictHtml(300000, 400000)).not.toMatch(/on track/);
  });
});

describe('the age spin', () => {
  it('its title asks which age is on course; its picker offers 9 in 10 first and by default, and keeps the other choices (parity)', () => {
    const title = doc.querySelector('#acSweepSection .section-title').textContent.replace(/\s+/g, ' ');
    expect(title).toMatch(/on course/);
    expect(title).toMatch(/9 futures out of 10/);
    expect(title).not.toMatch(/clears 90%/);
    const opts = [...doc.querySelectorAll('#acSweepTarget option')];
    expect(opts[0].value).toBe(String(ON_COURSE_PCT));
    expect(opts[0].selected).toBe(true);
    expect(opts[0].textContent).toMatch(/9 in 10 \(on course\)/);
    expect(opts.map((o) => o.value).sort()).toEqual(['75', '85', '90', '95']);
  });
  it('the defaults are the one bar', () => {
    const rows = [{ age: 60, success: 89 }, { age: 61, success: 90 }];
    expect(earliestAt(rows)).toMatchObject({ age: 61, met: true });
    expect(script).toMatch(/acSweepTarget'\)\?\.value \|\| ON_COURSE_PCT/);
  });
  it('the headline says "on course" and counts in futures', () => {
    const result = { income: 40000, basis: 'your mix', rows: [{ age: 58, success: 77 }, { age: 60, success: 86 }, { age: 61, success: 92 }] };
    const h = sweepHeadline(result);
    expect(h).toMatch(/^At £40,000 a year you could retire at 61 and be on course: the money lasted in 92% of futures/);
    expect(h).toMatch(/or at 58 if lasting in 3 futures out of 4 is enough \(77%\)/);
    expect(h).not.toMatch(/confidence/);
    const none = sweepHeadline({ ...result, rows: [{ age: 58, success: 60 }, { age: 61, success: 84 }] });
    expect(none).toMatch(/no age in the range is on course \(the money lasting in 9 futures out of 10\) — the best is 61 at 84%/);
    expect(sweepHeadline(result, 85)).toMatch(/you could retire at 60: the money lasted in 86% of futures \(you asked for 85%\)/);
    expect(confidenceWords(90)).toBe('in 9 futures out of 10');
    expect(confidenceWords(75)).toBe('in 3 futures out of 4');
    expect(confidenceWords(85)).toBe('in 85% of futures');
  });
});

describe('the couples, survivor and care checks', () => {
  it('green from 9 in 10 (it was 85%), amber from 70%', () => {
    expect(onCourseAlertClass(0.9)).toBe('alert-success');
    expect(onCourseAlertClass(0.89)).toBe('alert-warning');
    expect(onCourseAlertClass(0.85)).toBe('alert-warning');
    expect(onCourseAlertClass(0.7)).toBe('alert-warning');
    expect(onCourseAlertClass(0.69)).toBe('alert-danger');
  });
  it('the joint headline says on course at 9 in 10, and never "Looking solid" below it', () => {
    expect(jointVerdictHtml(0.93)).toMatch(/^On course: in 93% of 1,000 possible market futures the money lasted the whole way for <strong>both<\/strong> of you \(9 in 10 or more\)\./);
    expect(jointVerdictHtml(0.87)).toMatch(/^Not on course yet: .* only 87% /);
    expect(jointVerdictHtml(0.5)).toMatch(/^At risk: .* just 50% /);
  });
  it('index.html takes every threshold from the module: no 0.85 bar is left in the checks', () => {
    for (const marker of ['r.jointSuccess', 'r.survivorSuccess', 'r.careJoint']) {
      for (const m of script.matchAll(new RegExp(marker.replace('.', '\\.') + '\\s*(>=|<)\\s*0\\.85', 'g'))) throw new Error('still 85%: ' + m[0]);
    }
    expect(script).toMatch(/onCourseAlertClass\(r\.jointSuccess\)/);
    expect(script).toMatch(/onCourseAlertClass\(r\.survivorSuccess\)/);
    expect(script).toMatch(/onCourseAlertClass\(r\.careJoint\)/);
    expect(script).toMatch(/!isOnCourse\(r\.jointSuccess\)/);
    expect(SRC).not.toMatch(/Looking solid/);
  });
});

describe('words elsewhere say "on course", not "on track"', () => {
  it('the life stage, the next step, the landing page and the tour', () => {
    expect(STAGES.saving.banner.text).toMatch(/on course/);
    expect(STAGES.saving.banner.text).not.toMatch(/on track/);
    expect(NEXT_STEP_WORDS.savingFromAnswer).toMatch(/on course/);
    expect(NEXT_STEP_WORDS.savingFromAnswer).not.toMatch(/on track/);
    for (const f of ['src/ui/components/LandingPage.js', 'src/ui/components/OnboardingPage.js']) {
      const t = read(f);
      expect(t, f).not.toMatch(/on track/);
      expect(t, f).not.toMatch(/85% Monte-Carlo/);
    }
    expect(read('src/ui/components/OnboardingPage.js')).toMatch(/lasts in 9 futures out of 10/);
  });
  it('a quick answer that lasted in 85–90% of futures reads "just under 9 in 10", not "9 in 10"', () => {
    const seed = (lasted) => ({ answer: { lasted }, household: 'single', endAge: 95 });
    expect(answerLastedWords(seed(0.87))).toBe('the money lasted to 95 in just under 9 futures out of 10 (87%)');
    expect(answerLastedWords(seed(0.9))).toBe('the money lasted to 95 in 9 futures out of 10 (90%)');
    expect(answerLastedWords(seed(0.93))).toBe('the money lasted to 95 in 9 futures out of 10 (93%)');
    expect(answerLastedWords(seed(0.96))).toBe('the money lasted to 95 in more than 9 futures out of 10 (96%)');
    expect(answerLastedWords(seed(0.84))).toBe('the money lasted to 95 in 8 futures out of 10 (84%)');
  });
});

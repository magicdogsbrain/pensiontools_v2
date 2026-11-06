/**
 * The classic page's name in its own headings. From 7.0 the page lives at /classic/ beside the new app (PensionTools), and its tab
 * title and every link to it from the new app call it "the classic planner" (vite.layout.js classicHead; research/v7/
 * switch-readiness.md §8), so its headings say the same. The rollback layout (LAYOUT=preview, src/appLayout.js) builds
 * the page as it was before 7.0, under the name it had then. The header's own heading is in index.html's markup, so
 * classicHead renames it in the 7.0 build; the headings drawn by the page's modules read these.
 */
import { LAYOUT } from '../appLayout.js';

const SWITCHED = LAYOUT.name === 'switch';

/** At the start of a heading or sentence. */
export const CLASSIC_NAME = SWITCHED ? 'The classic planner' : 'Pension Planner';
/** In the middle of a sentence ("Welcome to the classic planner"). */
export const CLASSIC_NAME_MID = SWITCHED ? 'the classic planner' : 'Pension Planner';

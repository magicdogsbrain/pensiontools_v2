/**
 * The classic page's name in its own headings. From 7.0 the page lives at /classic/ beside V7 (PensionTools); from 7.11.0
 * it is PensionTools' full view, its tab title says so, and every link to it from V7 calls it "the full view"
 * (vite.layout.js classicHead; research/v7/replan-nov-2026.md §8), so its headings say the same. The rollback layout
 * (LAYOUT=preview, src/appLayout.js) builds the page as it was before 7.0, under the name it had then. The header's own
 * heading is in index.html's markup, so classicHead renames it in the 7.0 build; the headings drawn by the page's modules
 * read these.
 */
import { LAYOUT } from '../appLayout.js';

const SWITCHED = LAYOUT.name === 'switch';

/** At the start of a heading or sentence. */
export const CLASSIC_NAME = SWITCHED ? 'PensionTools (full view)' : 'Pension Planner';
/** In the middle of a sentence ("Welcome to PensionTools (full view)"). */
export const CLASSIC_NAME_MID = SWITCHED ? 'PensionTools (full view)' : 'Pension Planner';

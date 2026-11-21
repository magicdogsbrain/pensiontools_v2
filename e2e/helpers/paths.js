/**
 * The browser tests' two addresses: where V7 and the classic page are served on the test server
 * (research/v7/switch-readiness.md §2 step 2). They are the layout's own (src/appLayout.js), named by the same LAYOUT
 * flag the build reads, so a run of the browser suite and the build it walks agree: at 7.0 (the default) `/` and
 * `/classic/`; in the rollback layout (LAYOUT=preview) `/v7/` and `/`, as before 7.0.
 *
 * A file of its own so playwright.config.js can read the two addresses without loading the whole helper (app.js
 * re-exports them for the specs).
 */
import { LAYOUTS, layoutNamed } from '../../src/appLayout.js';

/** The layout of the build under test: every address the two apps hand each other (src/appLayout.js). */
export const LAYOUT_UNDER_TEST = LAYOUTS[layoutNamed(process.env.LAYOUT)];

/** V7's page, from the site's root. */
export const V7_PATH = LAYOUT_UNDER_TEST.v7.at;
/** The classic page, from the site's root. */
export const CLASSIC_PATH = LAYOUT_UNDER_TEST.classic.at;
/** V7's address before 7.0 (the preview's), where old links and bookmarks point: at 7.0 a forward to V7_PATH. */
export const OLD_V7_PATH = LAYOUTS.preview.v7.at;
/** The classic page's address before 7.0 (the site's root), where links shared before 7.0 point (`?demo=1m`, `?signin=1`): at 7.0 V7's page, which passes those on to CLASSIC_PATH. */
export const OLD_CLASSIC_PATH = LAYOUTS.preview.classic.at;
/** The classic page's title: at 7.0 it names itself (vite.layout.js classicHead; the full view from 7.11.0); in the rollback layout, as before 7.0. */
export const CLASSIC_TITLE = LAYOUT_UNDER_TEST.name === 'switch' ? /^PensionTools \(full view\)$/ : /^Pension Planner v6$/;

/** True when an address is the classic page (its folder, or its index.html): where a hand-over from V7 lands. */
export const atClassic = (u) => { const p = new URL(u).pathname; return p === CLASSIC_PATH || p === CLASSIC_PATH + 'index.html'; };


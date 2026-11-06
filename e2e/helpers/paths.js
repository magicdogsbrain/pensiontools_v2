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
/** The classic page's title: at 7.0 it names itself (vite.layout.js classicHead); in the rollback layout, as before 7.0. */
export const CLASSIC_TITLE = LAYOUT_UNDER_TEST.name === 'switch' ? /^The classic planner$/ : /^Pension Planner v6$/;

/** True when an address is the classic page (its folder, or its index.html): where a hand-over from V7 lands. */
export const atClassic = (u) => { const p = new URL(u).pathname; return p === CLASSIC_PATH || p === CLASSIC_PATH + 'index.html'; };

/**
 * Where the classic page's engine worker asks for the market files (src/workers/engineWorker.js): the classic page's
 * data address, which the worker resolves from its own script in assets/, not from the page. At 7.0 ('../data/' from
 * /classic/assets/) it is /classic/data/, a copy the classic page's build makes (vite.layout.js); in the rollback layout
 * it is /assets/data/, where there is no file, so the worker keeps its bundled figures, as before 7.0.
 */
export const CLASSIC_WORKER_DATA = new URL(LAYOUT_UNDER_TEST.classic.data, 'http://site.test' + CLASSIC_PATH + 'assets/').pathname;
/** The watch's line for either market file missing there: what the rollback layout's worker asks for and never finds. */
export const WORKER_DATA_LINE = new RegExp(`^asked for a file that is not there: ${CLASSIC_WORKER_DATA.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(gilts|equity)\\.json$`);
/**
 * What every spec that runs the classic page's engine lets the watch (helpers/app.js) pass. In the rollback layout, that
 * line: the files are not there, as before 7.0, and any OTHER missing file still fails. At 7.0 the build makes the copy,
 * so nothing is let pass (a pattern that matches no text): a build that dropped the copy fails every one of those specs.
 */
export const WORKER_DATA_MISSING = LAYOUT_UNDER_TEST.name === 'switch' ? /(?!)/ : WORKER_DATA_LINE;

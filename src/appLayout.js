/* global __PT_LAYOUT__ */
/**
 * Where each app lives (research/v7/switch-readiness.md §2 steps 1 and 4). The two apps link to each other with
 * relative addresses baked into their bundles, and each reads the market data the nightly job keeps fresh. Every one of
 * those addresses is here, for both layouts, so the same commit can build either:
 *
 *   switch    7.0, and the default: V7 at /, the classic page at /classic/, one data folder at the root (/data/) for both
 *   preview   before 7.0, and the rollback: the classic page at /, V7 at /v7/
 *
 * The layout is chosen when the bundles are built, by the LAYOUT environment variable (`LAYOUT=preview npm run build`
 * builds the rollback): vite.config.js and vite.v7.config.js hand its name to Vite's `define`, which writes it in place of
 * __PT_LAYOUT__, so a bundle carries its own layout's addresses and no other. Anything that runs without Vite's define
 * (the unit tests, Node scripts) gets the switch layout, the published one. Rolling back after the switch is building the
 * same commit with LAYOUT=preview: swapping the output folders alone would leave each bundle pointing at the other app's
 * old place. Where each build writes its files, and the heads of the two pages, are vite.layout.js's.
 *
 * Every address is relative to the page that uses it, as the bundles' own `base: './'` is: V7's from V7's page, the
 * classic page's from the classic page. `at` is where the app is served from the site's root (the browser tests' two
 * addresses, e2e/helpers/paths.js). A path cannot climb above the root, so `../data/` from the root (the classic page in
 * development) is /data/ too.
 *
 * Data only: this file imports nothing, so V7's words (src/v7/copy/common.js) can read it.
 *
 * Each bundle carries its own layout whole, both apps' halves: the classic page's bundle holds V7's addresses too, unused,
 * and V7's the classic page's. They are a few short strings and change nothing a person sees; splitting the halves into
 * exports of their own would let each bundle drop the other's, at the cost of every reader naming its half. The other
 * layout is never carried: the define makes the choice below a constant, and the build drops the layout it does not name.
 */

const PREVIEW = Object.freeze({
  name: 'preview',
  v7: Object.freeze({
    at: '/v7/',
    classic: '../',                      // the classic page, from V7's page: "Change this", "Record a month", the banner's link
    privacy: '../privacy.html',          // the published privacy policy
    equity: '../data/equity.json'        // the nightly equity index, for the rotation watch on "Moving to your plan's mix"
  }),
  classic: Object.freeze({
    at: '/',
    v7: 'v7/',                           // V7, from the classic page: the landing page's line and every way back
    privacy: 'privacy.html',             // the published privacy policy: the landing page's and the sign-in screen's footers
    data: './data/'                      // the nightly market data folder (gilts.json, equity.json)
  })
});

const SWITCH = Object.freeze({
  name: 'switch',
  v7: Object.freeze({
    at: '/',
    classic: './classic/',
    privacy: './privacy.html',
    equity: './data/equity.json'
  }),
  classic: Object.freeze({
    at: '/classic/',
    v7: '../',
    privacy: '../privacy.html',          // the policy's one published address, /privacy.html (compliance/GDPR_TODO.md P5)
    data: '../data/'                     // the page reads the root's data/, which the nightly job keeps fresh; its engine worker, resolving this from /classic/assets/, reads the classic/data/ copy the release makes (vite.layout.js)
  })
});

/** Both layouts, by name: for the tests and the build configuration. The page reads LAYOUT. */
export const LAYOUTS = Object.freeze({ preview: PREVIEW, switch: SWITCH });

/** The layout a LAYOUT environment value names: none (or empty) is the switch, 7.0's; a name that is neither is refused, so a misspelt flag cannot quietly build the published layout when the rollback was meant. */
export function layoutNamed(value) {
  if (value === undefined || value === null || value === '') return 'switch';
  if (value === 'preview' || value === 'switch') return value;
  throw new Error(`LAYOUT must be "preview" or "switch", not "${value}"`);
}

const BUILT = typeof __PT_LAYOUT__ === 'string' ? __PT_LAYOUT__ : 'switch';

/** The layout this bundle was built for. */
export const LAYOUT = BUILT === 'preview' ? PREVIEW : SWITCH;

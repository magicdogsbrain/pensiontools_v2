/**
 * What's new in V7 (research/v7/road-to-7.md step 11): the once-only pop-up and the page, from src/releases.js and
 * src/releases-history.js (loaded with import() when first needed, so the shell carries none of the notes), following the
 * planner's rules (index.html "Release notes") exactly:
 *   - "seen" is the highest version the person has dismissed or read: localStorage['pt_lastSeenVersion'] (this file is the
 *     ONE V7 file that may name the key), and for someone signed in the account's settings document too (profile
 *     lastSeenVersion, read by effects/account.js into ui.profile), so it is once across devices — the higher of the two
 *     wins; a local mark higher than the account's is carried over (a visitor who made an account);
 *   - announced: the releases newer than that, x.y.0 only unless a note says `announce` (releases.js releasesSince);
 *   - the pop-up is offered once per page life, on a sign-in (the account's plans read, the profile read) or a visitor's
 *     start (plans of their own read from this window) — never again from a later read; a new account (no plans) and a
 *     first-visit visitor (nothing seen) are marked seen silently, with no pop-up (the planner's ANNOUNCE_TO_FIRST_VISIT_GUESTS);
 *   - "Got it" marks the current version seen (local, and the profile through news/seen: the account effect's one
 *     updateDoc); reading the page #/whats-new marks it seen too, when there was something new.
 *
 *   SEEN_KEY                                  'pt_lastSeenVersion'
 *   plainRelease(r)                           a release note as plain data (no function: `affects` is left out)
 *   startWhatsNew(store, { local, load, version }) → stop()
 */
import { A } from '../state/actions.js';
import { VERSION } from '../../constants.js';
import { guestOwnPlans } from '../../services/GuestPlans.js';

export const SEEN_KEY = 'pt_lastSeenVersion';
export const ANNOUNCE_TO_FIRST_VISIT_GUESTS = false;

/** The planner's own loaders, replaced by the tests. */
async function loadReleases() {
  const [r, h] = await Promise.all([import('../../releases.js'), import('../../releases-history.js')]);
  return { RELEASES: r.RELEASES, RELEASE_HISTORY: h.RELEASE_HISTORY, releasesSince: r.releasesSince, isAnnounced: r.isAnnounced, compareVersions: r.compareVersions };
}

/** A release note as plain data the state can hold: the fields the page draws; never a function. */
export function plainRelease(r) {
  const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
  const effects = r.effects && typeof r.effects === 'object' ? Object.fromEntries(Object.entries(r.effects).map(([k, v]) => [k, list(v)])) : null;
  return {
    version: String(r.version), date: typeof r.date === 'string' ? r.date : '', engineVersion: typeof r.engineVersion === 'string' ? r.engineVersion : null,
    title: typeof r.title === 'string' ? r.title : '', summary: typeof r.summary === 'string' ? r.summary : '',
    changes: list(r.changes), corrections: list(r.corrections), effects, actions: list(r.actions), notes: list(r.notes),
    announced: r.announce === true || (r.announce !== false && /^\d+\.\d+\.0$/.test(String(r.version))), reconstructed: r.reconstructed === true
  };
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Storage|null} [o.local]    localStorage (the seen mark)
 * @param {() => Promise<object>} [o.load]   the releases and the helpers (the tests hand in their own)
 * @param {string} [o.version]        the version this page is
 */
export function startWhatsNew(store, { local = null, load = loadReleases, version = VERSION } = {}) {
  let stopped = false;
  let announced = false;
  let loading = null;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const data = () => { if (!loading) loading = load().catch(() => null); return loading; };

  const localSeen = () => { try { return (local && local.getItem(SEEN_KEY)) || ''; } catch { return ''; } };
  const setLocalSeen = (v) => { try { if (local) local.setItem(SEEN_KEY, v); } catch { /* private mode */ } };
  const signedIn = (state) => state.session && state.session.kind === 'in';
  const markSeen = (state, v) => { setLocalSeen(v); if (signedIn(state)) dispatch({ type: A.NEWS_SEEN, version: v }); };

  /** The planner's effectiveSeen: the higher of the local mark and the account's; a higher local mark carried over. */
  const effectiveSeen = (state, D) => {
    let seen = localSeen();
    if (signedIn(state)) {
      const remote = (state.ui.profile && state.ui.profile.lastSeenVersion) || '';
      if (D.compareVersions(remote, seen) > 0) { seen = remote; setLocalSeen(seen); }
      else if (seen && D.compareVersions(seen, remote) > 0) dispatch({ type: A.NEWS_SEEN, version: seen });
    }
    return seen;
  };

  /** A sign-in (the account's plans and the profile read) or a visitor's start (plans of their own in this window): once. */
  const readyToAnnounce = (state) => {
    const p = state.plans;
    if (!p || p.status !== 'read') return null;
    if (signedIn(state) && p.source === 'account' && state.ui.profile !== null) return { guest: false, hasData: p.list.length > 0 };
    if (state.session.kind === 'nobody' && p.source === 'window' && guestOwnPlans(p.list.map((e) => e.plan)).length > 0) return { guest: true, hasData: true };
    return null;
  };

  async function announce(state, who) {
    const D = await data();
    if (stopped || !D) return;
    const seen = effectiveSeen(store.getState(), D);
    if (!seen && (who.guest ? !ANNOUNCE_TO_FIRST_VISIT_GUESTS : !who.hasData)) { markSeen(store.getState(), version); return; }
    const rels = D.releasesSince(seen);
    if (!rels.length) return;
    dispatch({ type: A.NEWS_SHOW, entries: rels.map(plainRelease) });
  }

  async function page() {
    const D = await data();
    if (stopped) return;
    if (!D) { dispatch({ type: A.NEWS_PAGE, releases: [], history: [] }); return; }
    const state = store.getState();
    if (!state.route || state.route.screen !== 'news') return;
    dispatch({ type: A.NEWS_PAGE, releases: D.RELEASES.map(plainRelease), history: D.RELEASE_HISTORY.map(plainRelease) });
    // reading the page counts as seen (the planner's whatsNewPageHtml)
    if (D.releasesSince(localSeen()).length) markSeen(state, version);
  }

  const check = (state) => {
    if (!announced) { const who = readyToAnnounce(state); if (who) { announced = true; announce(state, who); } }
  };
  check(store.getState());
  if (store.getState().route && store.getState().route.screen === 'news') page();

  const off = store.subscribe((state, action, previous) => {
    check(state);
    if (action.type === A.NEWS_DISMISS) markSeen(state, version);
    if (action.type === A.ROUTE_SET) {
      const onNews = state.route.screen === 'news';
      const wasNews = previous.route && previous.route.screen === 'news';
      if (onNews && !wasNews) page();
      else if (!onNews && wasNews && state.ui.news.page) dispatch({ type: A.NEWS_PAGE, page: null });
    }
  });
  return () => { stopped = true; off(); };
}

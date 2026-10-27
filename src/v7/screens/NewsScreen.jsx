/**
 * "What's new" (research/v7/road-to-7.md step 11): every release in src/releases.js, newest first and open, then the
 * reconstructed history (src/releases-history.js) — each from the data the effect loaded (effects/whatsNew.js), rendered in
 * Preact (components/ReleaseNotes.jsx): the title, the date, the summary, what changed, the corrections, how it affects
 * the plans part by part, what you may need to do, the notes, the engine version. Reading the page marks it seen (the
 * effect). Draws only.
 */
import { Release } from '../components/ReleaseNotes.jsx';
import { fill } from '../components/index.js';
import { newsView } from '../state/select.js';
import { NEWS } from '../copy/news.js';

export function NewsScreen(state) {
  const N = newsView(state);
  const page = N.page;
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{NEWS.title}</h1>
        <p class="lead" data-testid="news.current">{fill(NEWS.youAreOn, { version: N.current })}</p>
        <p class="note">{NEWS.intro}</p>
        {!page && <p class="lead" role="status" data-testid="news.opening">{NEWS.opening}</p>}
        {page && (
          <div class="rn-page" data-testid="news.page" data-count={page.releases.length}>
            {page.releases.map((r, i) => <Release key={r.version} r={r} words={NEWS} open={i === 0} />)}
            {page.history.length > 0 && (
              <section class="rn-history" data-testid="news.history">
                <h2>{NEWS.historyTitle}</h2>
                <p class="note">{NEWS.historyLead}</p>
                {page.history.map((r) => <Release key={r.version} r={r} words={NEWS} level={3} />)}
              </section>
            )}
          </div>
        )}
      </>
    )
  };
}

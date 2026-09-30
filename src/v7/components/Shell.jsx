/**
 * The page frame: header, the preview line, the offline line, the rail, one <main>, the footer. The <main> is the
 * screen root and carries data-screen and data-question (build brief 4.9; as package 1's stub drew it). One h1 per screen; after a move the keyboard goes to
 * it, or to the box the address names (?focus=<field>). The only hooks in V7 are here, and only for focus.
 */
import { useEffect, useRef } from 'preact/hooks';
import { Rail } from './Rail.jsx';
import { format } from '../router/routes.js';
import { focusField } from './Field.jsx';
import { COMMON, ADVICE_SHORT, ADVICE_FULL } from '../copy/common.js';

export function Shell({ state, dispatch, name, question = null, rail = false, full = false, children }) {
  const ref = useRef(null);
  const mounted = useRef(false);
  const address = format(state.route);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (state.route.focus && focusField(root, state.route.focus)) return;
    if (!mounted.current) { mounted.current = true; return; }       // never steal the keyboard on first load
    const h1 = root.querySelector('h1');
    if (h1) h1.focus();
  }, [address]);

  const focusMain = () => { const main = ref.current && ref.current.querySelector('main'); if (main) main.focus(); };
  const front = name === 'front';

  return (
    <div class={`pt pt-${name.replace('.', '-')}`} ref={ref}>
      <button type="button" class="skip" onClick={focusMain}>{COMMON.skip}</button>
      <header class="top">
        <a class="brand" href="#/">{COMMON.product}</a>
        <nav class="top-nav" aria-label={COMMON.product}>
          <a href="#/">{COMMON.allQuestions}</a>
        </nav>
      </header>
      {/* One line on a phone (the short words), the full sentence where there is room: components.css picks one. */}
      <p class="preview-line">
        <span class="preview-long">{COMMON.preview.text} <a href={COMMON.links.current}>{COMMON.preview.link}</a></span>
        <span class="preview-short">{COMMON.preview.shortText} <a href={COMMON.links.current}>{COMMON.preview.shortLink}</a></span>
      </p>
      {state.ui.online === false && <p class="offline" role="status">{COMMON.offline}</p>}
      {rail && <Rail state={state} dispatch={dispatch} />}
      <main id="main" tabIndex={-1} data-screen={name} data-question={question || undefined}>{children}</main>
      <footer class="foot" data-region="footer">
        {full && <p class="advice-full">{ADVICE_FULL}</p>}
        <p class="advice">{front ? `${COMMON.footer.worksOut} ${ADVICE_SHORT}` : ADVICE_SHORT}</p>
        <p class="run-by">{COMMON.footer.runBy} <a href={COMMON.links.privacy}>{COMMON.footer.privacy}</a></p>
      </footer>
    </div>
  );
}

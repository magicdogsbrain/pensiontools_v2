/**
 * "Your plan's mix" while living on a locked gilt ladder (7.12.0), the simple view's drawing: the reading's view
 * (answers/plan/held.js heldLadderView, handed in by the move reading as `heldView`) filled with src/v7/copy/held.js. The full
 * view draws the same view with the same words (src/ui/components/HeldLadderView.js). Draws only; no figure is worked out here.
 * Each table stacks one row per card under 600px wide (components.css .held-table), so nothing is cut off on a phone.
 */
import { fill } from '../../components/index.js';
import { HELD as H } from '../../copy/held.js';
import { markIn } from '../../components/PlanFigures.jsx';
import { GILTS_HELD_FIND } from '../../../reading/sentenceMarks.js';

// the one count of the plan's gilts held (gilts.held), marked where the page says it, as the full view marks it
const COUNT = [[GILTS_HELD_FIND, 'gilts.held']];

/** One sentence (the same rule as held.js sayHeld): a slot that is a sentence is filled too; a list is "a, b and c". */
export function heldText(s) {
  if (s == null) return '';
  if (typeof s === 'string') return s;
  if (Array.isArray(s)) { const xs = s.map(heldText); return xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]; }
  const slots = {};
  for (const [k, v] of Object.entries(s.slots || {})) slots[k] = k === 'why' && typeof v === 'string' && H[v] ? H[v] : typeof v === 'object' ? heldText(v) : v;
  const main = fill(H[s.key], slots);
  return s.bracket ? main + ' ' + heldText(s.bracket) : main;
}

const Lines = ({ items, testid }) => (items.length ? <>{items.map((x, i) => <p class="line" key={i} data-testid={testid} data-key={x.key}>{heldText(x)}</p>)}</> : null);

export function HeldLadder({ v, prefix, holdHref }) {
  if (!v) return null;
  const T = `${prefix}.heldLadder`;
  const C = H.giltColumns, K = H.cashColumns, A = H.alsoColumns;
  return (
    <section class="plan-section held-ladder" data-section="heldLadder" data-testid={T}>
      {v.head.map((x, i) => <p class={x.key === 'agreed' ? 'lead' : 'note'} key={i} data-testid={`${T}.${x.key}`}>{heldText(x)}{x.key === 'noRecord' && holdHref ? <> <a href={holdHref}>{H.holdLink}</a></> : null}</p>)}
      {v.summary && <p class="lead" data-testid={`${T}.summary`}>{markIn(heldText(v.summary), COUNT)}</p>}
      {holdHref && !v.head.some((x) => x.key === 'noRecord') && <p class="line"><a href={holdHref} data-testid={`${T}.change`}>{H.changeLink}</a></p>}
      <h2>{H.giltsTitle}</h2>
      {v.figure.map((x, i) => <p class="line" key={i} data-testid={`${T}.figure`}>{markIn(heldText(x), COUNT)}</p>)}
      <div class="table-wrap">
        <table class="way-table held-table" data-testid={`${T}.gilts`}>
          <thead><tr><th>{C.gilt}</th><th>{C.years}</th><th>{C.plan}</th><th>{C.held}</th><th>{C.difference}</th></tr></thead>
          <tbody>{v.gilts.map((r) => (
            <tr key={r.key} data-key={r.key} data-state={r.state}>
              <td data-label={C.gilt}>{r.gilt}</td><td data-label={C.years}>{r.years}</td><td data-label={C.plan}>{r.plan}</td><td data-label={C.held}>{r.held}</td><td data-label={C.difference}>{heldText(r.difference)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <Lines items={v.under} testid={`${T}.under`} />
      {v.cash && (
        <>
          <h2>{H.cashTitle}</h2>
          <p class="line" data-testid={`${T}.need`}>{heldText(v.cash.need)}</p>
          <div class="table-wrap">
            <table class="way-table held-table" data-testid={`${T}.cashYears`}>
              <thead><tr><th>{K.when}</th><th>{K.due}</th><th>{K.arrives}</th></tr></thead>
              <tbody>
                {v.cash.rows.map((r) => <tr key={r.id} data-when={r.id}><td data-label={K.when}>{heldText(r.when)}</td><td data-label={K.due}>{heldText(r.due)}</td><td data-label={K.arrives}>{heldText(r.arrives)}</td></tr>)}
                <tr data-when="total"><td data-label={K.when}><strong>{heldText(v.cash.total.when)}</strong></td><td data-label={K.due}><strong>{v.cash.total.due}</strong></td><td data-label={K.arrives}><strong>{v.cash.total.arrives}</strong></td></tr>
              </tbody>
            </table>
          </div>
          <Lines items={v.cash.lines} testid={`${T}.state`} />
        </>
      )}
      {(v.noCash || v.lines.length > 0 || v.set.length > 0) && (
        <>
          <h2>{H.alsoTitle}</h2>
          {v.noCash && <p class="line" data-testid={`${T}.noCash`}>{heldText(v.noCash)}</p>}
          {v.lines.length > 0 && (
            <div class="table-wrap">
              <table class="way-table held-table" data-testid={`${T}.also`}>
                <thead><tr><th>{A.what}</th><th>{A.value}</th><th>{A.matures}</th><th>{A.pays}</th></tr></thead>
                <tbody>{v.lines.map((l) => <tr key={l.at} data-at={l.at}><td data-label={A.what}>{l.what}</td><td data-label={A.value}>{l.value}</td><td data-label={A.matures}>{heldText(l.matures)}</td><td data-label={A.pays}>{heldText(l.pays)}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          <Lines items={v.set} testid={`${T}.set`} />
          <Lines items={v.notes} testid={`${T}.note`} />
        </>
      )}
      {v.outside.length > 0 && <><h2>{H.outsideTitle}</h2><Lines items={v.outside} testid={`${T}.outside`} /></>}
      {v.expected.length > 0 && <><h2>{H.expectedTitle}</h2><Lines items={v.expected} testid={`${T}.expected`} /></>}
      <p class="plan-source" data-testid={`${T}.footer`}>{heldText(v.footer)}</p>
    </section>
  );
}

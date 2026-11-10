/**
 * "Test what you keep against your plan" and "I accept this risk" (7.7.0), drawn on "What you hold" (the whole section), and
 * as one line on the plan's home, "About you and when" and the move: the reading of answers/plan/keepTest.js keepTestOf (the
 * plan source puts it on the page: state/select.js planKeepTestView). Draws only; no figure is worked out here. The test runs
 * only when the button is pressed (keepTest/run, the worker's lane); the agreement is ONE write after a confirm on the screen
 * (plan/amend), with Undo.
 */
import { Button, fill } from '../../components/index.js';
import { KEEPTEST as K } from '../../copy/keepTest.js';

const keepFocus = { onMouseDown: (e) => e.preventDefault() };

/** One sentence of KEEPTEST: `id` a key (dotted for a nested one), its slots; a slot may itself be a part { id, slots }. */
export function sayKeep(part) {
  if (!part) return '';
  const t = String(part.id || '').split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), K);
  const slots = Object.fromEntries(Object.entries(part.slots || {}).map(([k, v]) => [k, v && typeof v === 'object' ? sayKeep(v) : v]));
  return fill(t, slots);
}

/** The one line on the home, About and the move: where the agreement stands. Nothing on a plan that keeps nothing. */
export function KeepTestLine({ K: v, prefix }) {
  if (!v || !v.line) return null;
  return <p class={v.status === 'agreed' ? 'line' : 'notice'} data-testid={`${prefix}.keepTest.line`} data-status={v.status}>{sayKeep(v.line)}</p>;
}

/** One column of the side-by-side table: the chance and the bad case. */
const cell = (side, row) => (!side ? '—' : row === 'lasts' ? fill(K.lasts, { words: side.words }) : sayKeep(side.bad));

/** The whole section on "What you hold". */
export function KeepTestSection({ v, dispatch, prefix, editable }) {
  if (!v) return null;
  const T = `${prefix}.keepTest`;
  const run = v.run || { status: 'idle' };
  const r = v.result;
  const can = editable && !v.readonly && !v.closed;
  return (
    <section class="plan-section" data-section="keepTest" id="keep-test" data-testid={T} data-status={v.status}>
      <h2>{K.title}</h2>
      <p class="note">{K.lead}</p>
      {v.line && <p class={v.status === 'agreed' ? 'line' : 'notice'} data-testid={`${T}.line`} data-status={v.status}>{sayKeep(v.line)}</p>}
      {v.keeps && <p class="note">{K.how}</p>}
      {can && v.keeps && (
        <div class="actions-row">
          <Button testid={`${T}.run`} kind={r ? 'quiet' : 'primary'} disabled={run.status === 'working'} onClick={() => dispatch({ type: 'keepTest/run', key: v.runKey, planId: v.planId })} {...keepFocus}>{r ? K.again : K.run}</Button>
        </div>
      )}
      {run.status === 'working' && <p class="note" role="status" data-testid={`${T}.working`}>{K.running}</p>}
      {run.status === 'failed' && <p class="notice" role="alert" data-testid={`${T}.failed`}>{run.reason === 'noWorker' ? K.noWorker : K.failed}</p>}
      {r && (
        <div data-testid={`${T}.result`}>
          <div class="table-wrap">
            {/* at phone width each row stacks as label and value (components.css .gaps-table), so nothing is off-screen */}
            <table class="way-table gaps-table" data-testid={`${T}.table`}>
              <thead><tr><th>{K.columns.what}</th><th>{K.columns.locked}</th><th>{K.columns.held}</th>{r.without && <th>{K.columns.without}</th>}</tr></thead>
              <tbody>
                {['lasts', 'bad'].map((row) => (
                  <tr key={row} data-row={row}>
                    <td data-label={K.columns.what}>{K.rows[row]}</td>
                    <td data-label={K.columns.locked} data-testid={`${T}.locked.${row}`}>{cell(r.locked, row)}</td>
                    <td data-label={K.columns.held} data-testid={`${T}.held.${row}`}>{cell(r.held, row)}</td>
                    {r.without && <td data-label={K.columns.without} data-testid={`${T}.without.${row}`}>{cell(r.without, row)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {r.firstShort && <p class="line" data-testid={`${T}.firstShort`}>{sayKeep(r.firstShort)}</p>}
          {r.shock.length > 0 && <h3 class="plan-subhead" data-testid={`${T}.shockTitle`}>{K.shockTitle}</h3>}
          {r.shock.map((x, i) => <p key={i} class="line" data-testid={`${T}.shock.${x.id}`}>{sayKeep(x)}</p>)}
          {r.single && <p class="notice" data-testid={`${T}.single`}>{sayKeep(r.single)}</p>}
        </div>
      )}
      {can && v.canAccept && !v.confirmOpen && (
        <div class="actions-row"><Button testid={`${T}.accept`} kind="primary" disabled={!!v.saving} onClick={() => dispatch({ type: 'ui/toggle', id: 'amendConfirm' })} {...keepFocus}>{K.accept}</Button></div>
      )}
      {can && v.canAccept && v.confirmOpen && (
        <div class="notice lock-confirm" role="region" aria-label={K.accept} data-testid={`${T}.confirm`}>
          <p>{K.acceptLead}</p>
          <div class="actions-row">
            <Button testid={`${T}.confirm.yes`} kind="primary" disabled={!!v.saving} onClick={() => dispatch({ type: 'plan/amend', planId: v.planId, op: 'accept' })} {...keepFocus}>{K.acceptYes}</Button>
            <Button testid={`${T}.confirm.no`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'amendConfirm' })} {...keepFocus}>{K.acceptNo}</Button>
          </div>
        </div>
      )}
      {v.agreed && <p class="note" data-testid={`${T}.agreedOn`}>{fill(K.agreedOn, { date: v.agreed.on })}</p>}
      {can && v.canWithdraw && <div class="actions-row"><Button testid={`${T}.withdraw`} kind="quiet" disabled={!!v.saving} onClick={() => dispatch({ type: 'plan/amend', planId: v.planId, op: 'withdraw' })} {...keepFocus}>{K.withdraw}</Button></div>}
    </section>
  );
}

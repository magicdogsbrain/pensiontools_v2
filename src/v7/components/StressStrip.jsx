/**
 * "Try the bad years" under C's and D's answers (7.9.0; the build spec's §2.2): a strip that works the answer out again on its
 * own futures with one thing made worse, at the amount it stands behind. The button shows only on a final answer and runs
 * only on a press (strip/run; effects/stressStrip.js, the worker's own lane), so the first and final figures are untouched.
 * Draws only: every figure and sentence is shared/stressStrip.js runStressStrip's (state/select.js stressStripView); the
 * row titles and what each changes are src/v7/copy/stressPanel.js's. A row shows its chance and where it runs out; the rest
 * is under "More about this line"; what still comes in is said once above the rows. The 1-in-10 is a reading on every row;
 * the answer above keeps its own bad-case sentence.
 */
import { Button } from './Button.jsx';
import { Sentence } from './Sentence.jsx';
import { stressStripView } from '../state/select.js';
import { money } from '../../answers/shared/format.js';
import { STRESS } from '../copy/stressPanel.js';
import { LASTS } from '../copy/lasts.js';

const VERDICTS = ['yes', 'close', 'no'];

const keepFocus = { onMouseDown: (e) => e.preventDefault() };

/** One sentence of STRESS: `id` a dotted key, its slots; a slot may itself be a part { id, slots } (both apps fill it so). */
export function sayStress(part) {
  if (!part) return '';
  const t = String(part.id || '').split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), STRESS);
  return String(typeof t === 'string' ? t : '').replace(/\{(\w+)\}/g, (m, k) => { const v = part.slots ? part.slots[k] : undefined; return v == null ? m : typeof v === 'object' ? sayStress(v) : String(v); });
}

const MORE = ['when', 'howLong', 'howMuch', 'floor'];

/**
 * A row's chance line (both screens: the plan panel draws it too): the weighted chance as [data-weighted] with its count to
 * one named age beside it as [data-fixed="age"], in one line (the render rule: never one without the other in its block);
 * with no weighted figure, the fixed-age sentence alone.
 */
export function StressChance({ c }) {
  if (!c || !c.fixed) return null;
  return (
    <p class="line stress-line stress-chance" data-line="chance">
      {c.weighted ? <><span data-weighted="1">{sayStress(c.weighted)}</span>{STRESS.short.join}<span data-fixed="age">{sayStress(c.fixed)}</span></> : sayStress(c.fixed)}
    </p>
  );
}

/** The rest of a row, closed until opened: "More about this line" (both screens). */
export function StressMore({ testid, children }) {
  return (
    <details class="stress-more" data-testid={testid}>
      <summary>{STRESS.short.more}</summary>
      {children}
    </details>
  );
}

function Row({ row, q }) {
  const s = row.sentences || {};
  const sh = row.short || {};
  const more = MORE.filter((k) => s[k]);
  return (
    <li class="block stress-row" data-row={row.id} data-same={row.same ? '1' : '0'} data-testid={`${q}.stress.${row.id}`}>
      {/* the verdict at the answer's level as a word and its colour, as the plan's rows say it (never a colour alone) */}
      <h3 class="stress-title">{sayStress(row.words.title)}{VERDICTS.includes(row.verdict) && !(row.same && row.id !== 'asPlanned') && <> <span class={`verdict-word is-${row.verdict}`} data-verdict={row.verdict}>{LASTS.verdict.word[row.verdict]}</span></>}</h3>
      {row.words.what.map((w, i) => <p key={i} class="note">{sayStress(w)}</p>)}
      {row.same && row.id !== 'asPlanned'
        ? <p class="note" data-testid={`${q}.stress.${row.id}.same`}>{STRESS.na.sameAnswer}</p>
        : (
          <>
            <StressChance c={sh.chance} />
            {sh.runsOut && <p class="line stress-line" data-line="runsOut">{sayStress(sh.runsOut)}</p>}
            {more.length > 0 && (
              <StressMore testid={`${q}.stress.${row.id}.more`}>
                {more.map((k) => <Sentence key={k} s={s[k]} source={row} class="stress-line" data-line={k} />)}
              </StressMore>
            )}
          </>
        )}
    </li>
  );
}

export function StressStrip({ state, q, dispatch }) {
  const v = stressStripView(state, q);
  if (!v) return null;
  const r = v.result;
  const press = () => dispatch({ type: 'strip/run', q, inputsKey: v.inputsKey });
  return (
    <section class="answer-stress" data-stress-strip={q} data-status={v.status} aria-labelledby={`${q}-stress-title`}>
      <h2 id={`${q}-stress-title`}>{STRESS.strip.title}</h2>
      <p class="note">{sayStress({ id: 'strip.lead', slots: { amount: money(v.perMonth) } })}</p>
      <div class="actions-row">
        <Button testid={`${q}.stress.run`} kind={r ? 'quiet' : 'primary'} disabled={v.status === 'working'} onClick={press} {...keepFocus}>{r ? STRESS.strip.again : STRESS.strip.button}</Button>
      </div>
      {v.status === 'working' && <p class="note" role="status" data-testid={`${q}.stress.working`}>{STRESS.strip.working}</p>}
      {v.status === 'failed' && <p class="notice" role="alert" data-testid={`${q}.stress.failed`}>{v.reason === 'noWorker' ? STRESS.noWorker : STRESS.strip.failed}</p>}
      {r && r.status === 'ok' && r.floor && <p class="line stress-floor" data-testid={`${q}.stress.floor`}>{sayStress(r.floor)}</p>}
      {r && r.status === 'ok' && (
        <ul class="stress-rows" data-testid={`${q}.stress.rows`}>
          {r.rows.map((row) => <Row key={row.id} row={row} q={q} />)}
        </ul>
      )}
    </section>
  );
}

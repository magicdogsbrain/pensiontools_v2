/**
 * "The mix" (research/v7/way-and-mix.md 3; road-to-7.md step 8b): the sixth editing step of a saved plan in V7. How the
 * pension is held — a risk level (with the £ each gives on this pot), your own split (four boxes kept to 100, shown in £), or
 * the funds to test (typed with the bundled search, or pasted from a platform with "What is this?" on every line the page
 * cannot recognise and "Left out, and why") — the slice of gold and trend funds and the bond tent, each with "What it does in
 * a bad case" (one extra run of the one test the other way), and "Which mix lasts best?" (eight runs: your mix with the tent
 * off and on, then the three levels) with "Use this mix" on any cell. Save, Cancel and after a save the Undo toast. The
 * seven bought ways see one paragraph with the link to the way step. A locked plan: the lines from the document, the tries
 * and the comparison still run, nothing is written. Draws only: everything is the reading's (state/select.js planMixView:
 * answers/plan/mix.js through the plan source) and the runs' status is the state's (effects/mix.js). No figure is worked
 * out here. The writes are the one write file's (effects/planWrite.js: the step's save, and kind 'mix' on plan/useMix).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planMixView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { MIX } from '../../copy/mix.js';
import { WAY } from '../../copy/way.js';
import { MIX_LEVELS, MIX_SPLIT } from '../../../answers/plan/schema.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const seconds = (ms) => (Math.round((ms || 0) / 100) / 10).toFixed(1);

function Head({ view }) {
  return (
    <div class="plan-head">
      <p class="plan-kicker">{w.title} <span class="plan-name">‘{view.name}’</span></p>
      <p class="plan-stage-line" data-testid="plan.stageLine">{view.line ? fill(PLAN.stageLines[view.line.id], view.line.slots) : ''}{view.lockedOn ? ' ' + fill(w.lockedOn, { date: view.lockedOn }) : ''}</p>
      {view.readonly && <p class="notice" role="status" data-testid="plan.readonly">{w.shownAsSaved}</p>}
      {view.source === 'window' && <p class="note" data-testid="plan.windowWarning">{w.windowWarning}</p>}
    </div>
  );
}

/** The derived lines (3.2): shown, never asked. */
function Derived({ V }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{MIX.derivedTitle}</h3>
      <ul class="plan-lines">
        {V.derived.map((d, i) => <li key={i} class="plan-line" data-line={'mix.' + d.id}>{fill(MIX.derived[d.id] || '', d.slots)}</li>)}
      </ul>
    </section>
  );
}

/** "What it does in a bad case" (3.2b, 3.2d): one try, its lines, the cost; on a locked plan the document's figure beside. */
function Try({ kind, V, dispatch }) {
  const T = MIX.tries;
  const t = kind === 'sleeve' ? V.sleeve.try : V.tent.try;
  const base = `plan.mix.try.${kind}`;
  const ask = () => dispatch({ type: 'mix/try', key: V.runKey, kind });
  const close = () => dispatch({ type: 'mix/tryClose', kind });
  if (!V.runKey) return null;
  return (
    <div class="mix-try" data-try={kind} data-try-status={t.status} data-testid={base}>
      <h4>{T.title}</h4>
      <p class="note">{T[kind].lead}</p>
      {t.status === 'off' && <div class="actions-row"><Button testid={`${base}.button`} kind="quiet" onClick={ask} {...keepFocus}>{T[kind].button}</Button></div>}
      {t.status === 'working' && <p class="working-note" role="status" data-testid={`${base}.working`}>{T.working}</p>}
      {t.status === 'failed' && (
        <div class="notice" role="alert" data-testid={`${base}.failed`}>
          <p>{t.reason === 'noWorker' ? T.noWorker : T.failed}</p>
          <div class="actions-row">{t.reason !== 'noWorker' && <Button testid={`${base}.again`} kind="quiet" onClick={ask}>{MIX.buttons.tryAgain}</Button>}<Button testid={`${base}.close`} kind="quiet" onClick={close}>{T.close}</Button></div>
        </div>
      )}
      {t.status === 'done' && (
        <div class="lever-result" data-testid={`${base}.result`}>
          <ul class="plan-lines">{t.lines.map((l, i) => <li key={i} class="plan-line" data-line={'mixTry.' + l.id}>{fill(T.lines[l.id] || '', l.slots)}</li>)}</ul>
          <p class="plan-source" data-testid={`${base}.ran`}>{t.ms != null ? fill(T.ran.timed, { runs: String(t.runs), s: t.runs === 1 ? '' : 's', ms: seconds(t.ms) }) : t.runs === 2 ? T.ran.two : T.ran.one}</p>
          <div class="actions-row"><Button testid={`${base}.close`} kind="quiet" onClick={close}>{T.close}</Button></div>
        </div>
      )}
    </div>
  );
}

/** A risk level (3.2a): the three, each with the £ it gives on this pot. */
function Levels({ V, f, planId, dispatch }) {
  const words = MIX.fields.level;
  const set = (value) => dispatch({ type: 'plan/edit', planId, path: 'level', value });
  const error = f.error ? (MIX.errors.level[f.error] || f.error) : null;
  return (
    <fieldset class={`field field-choice mix-levels${error ? ' has-error' : ''}`} data-field="level">
      <legend>{words.label}</legend>
      {V.levels.map((lv) => (
        <div class="option" key={lv.key}>
          <div class="option-row">
            <input type="radio" id={`plan.mix.level.${lv.key}`} data-testid={`plan.mix.level.${lv.key}`} name="plan.mix.level" value={lv.key} checked={f.shown === lv.key} onClick={() => { if (f.shown !== lv.key) set(lv.key); }} onChange={() => {}} />
            <label for={`plan.mix.level.${lv.key}`}>{words.options[lv.key]}</label>
          </div>
          <p class="help mix-level-amounts" data-testid={`plan.mix.level.${lv.key}.amounts`}>{fill(V.sleeve.on ? MIX.levelAmountsSleeve : MIX.levelAmounts, lv.amounts)}</p>
        </div>
      ))}
      {error && <p class="error" data-error-for="plan.mix.level">{error}</p>}
    </fieldset>
  );
}

/** One fund on the list (3.2c): its boxes, "Counted as", the catalogue's word, Remove. */
function FundCard({ card, n, V, planId, dispatch, sourceText }) {
  const F = MIX.funds;
  const f = (p) => card.fields.find((x) => x.path.endsWith('.' + p));
  const id = `plan.mix.funds.${card.id}.category`;
  const cat = f('category');
  const setCat = (value) => dispatch({ type: 'plan/edit', planId, path: cat.path, value });
  const catError = cat.error ? (F.errors.category[cat.error] || cat.error) : null;
  return (
    <fieldset class="income-card mix-fund" data-card={`funds.${card.id}`} data-new={card.saved ? '0' : '1'} data-bucket={card.bucket || ''}>
      <legend>{fill(F.one, { n })}</legend>
      <EditField step="mix" f={f('ticker')} words={F.fields.ticker} errors={F.errors.ticker} source={card.saved ? sourceText : null} savedWords={MIX.savedValue} planId={planId} dispatch={dispatch} />
      <EditField step="mix" f={f('name')} words={F.fields.name} errors={F.errors.name} source={null} planId={planId} dispatch={dispatch} />
      <EditField step="mix" f={f('value')} words={F.fields.value} errors={F.errors.value} source={card.saved ? sourceText : null} savedWords={MIX.savedValue} planId={planId} dispatch={dispatch} />
      <EditField step="mix" f={f('wrapper')} words={F.fields.wrapper} errors={F.errors.wrapper} source={card.saved ? sourceText : null} savedWords={MIX.savedValue} planId={planId} dispatch={dispatch} />
      <div class={`field field-choice${catError ? ' has-error' : ''}`} data-field={cat.path}>
        <label for={id}>{F.fields.category.label}</label>
        <div class="box">
          <select id={id} data-testid={id} name={id} value={cat.shown || card.category || ''} aria-invalid={catError ? 'true' : undefined} onChange={(e) => setCat(e.currentTarget.value)} onBlur={() => dispatch({ type: 'plan/touch', planId, path: cat.path })}>
            <option value="">{F.categoryNone}</option>
            {Object.entries(V.categories).map(([bucket, opts]) => (
              <optgroup key={bucket} label={F.buckets[bucket] || bucket}>
                {opts.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <p class="help">{card.recognised ? fill(F.recognised, { category: (Object.values(V.categories).flat().find((o) => o.key === card.category) || {}).label || card.category }) : F.notRecognised}</p>
        {catError && <p class="error" data-error-for={id}>{catError}</p>}
      </div>
      <div class="actions-row income-card-actions">
        <Button testid={`plan.mix.funds.remove.${card.id}`} kind="quiet" onClick={() => dispatch({ type: 'plan/edit', planId, path: 'funds.ids', value: V.lists.funds.ids.filter((x) => x !== card.id).join(',') })} {...keepFocus}>{F.remove}</Button>
      </div>
    </fieldset>
  );
}

const nextNewId = (ids) => { const used = ids.filter((x) => /^n\d+$/.test(x)).map((x) => +x.slice(1)); return 'n' + ((used.length ? Math.max(...used) : 0) + 1); };

/** The funds to test (3.2c): the search, the cards, the roll-up, the paste, the example list. */
function Funds({ V, planId, dispatch, sourceText, editable }) {
  const F = MIX.funds;
  const list = V.lists.funds;
  const edit = (path, value) => dispatch({ type: 'plan/edit', planId, path, value });
  const addFrom = (m) => {
    const id = nextNewId(list.ids);
    edit('funds.ids', [...list.ids, id].join(','));
    edit(`funds.${id}.ticker`, m.ticker); edit(`funds.${id}.name`, m.name); edit(`funds.${id}.category`, m.category || ''); edit('search', '');
  };
  const addLine = () => { const id = nextNewId(list.ids); edit('funds.ids', [...list.ids, id].join(',')); };
  const P = V.paste;
  return (
    <div class="mix-funds" data-testid="plan.mix.funds">
      {editable && (
        <div class="field field-text mix-search" data-field="search">
          <label for="plan.mix.search">{F.search.label}</label>
          <div class="box"><input type="text" autocomplete="off" id="plan.mix.search" data-testid="plan.mix.search" name="plan.mix.search" value={V.search.text} onInput={(e) => edit('search', e.currentTarget.value)} /></div>
          <p class="help">{F.search.help}</p>
          {V.search.text.trim() && (
            V.search.matches.length
              ? <ul class="mix-matches" data-testid="plan.mix.search.matches">{V.search.matches.map((m) => <li key={m.ticker}><Button testid={`plan.mix.search.add.${m.ticker}`} kind="plain" onClick={() => addFrom(m)} {...keepFocus}>{fill(F.search.add, { ticker: m.ticker })}</Button> <span class="note">{m.name}</span></li>)}</ul>
              : <p class="note" data-testid="plan.mix.search.none">{F.search.none}</p>
          )}
        </div>
      )}
      {list.cards.length === 0 && <p class="note income-none" data-testid="plan.mix.funds.none">{F.none}</p>}
      {list.cards.map((card, i) => <FundCard key={card.id} card={card} n={i + 1} V={V} planId={planId} dispatch={dispatch} sourceText={sourceText} />)}
      {V.errors['funds.ids'] && <p class="error" data-error-for="plan.mix.funds">{F.noFunds}</p>}
      {editable && (
        <div class="actions-row income-add-row">
          <Button testid="plan.mix.funds.add" kind="plain" onClick={addLine} {...keepFocus}>{F.add}</Button>
          <Button testid="plan.mix.paste.open" kind="plain" onClick={() => dispatch({ type: 'ui/toggle', id: 'mixPaste' })} aria-expanded={V.pasteOpen ? 'true' : 'false'} {...keepFocus}>{F.paste.title}</Button>
        </div>
      )}
      {V.summary && <p class="note" data-testid="plan.mix.funds.summary">{fill(F.summary, { pot: V.summary.pot, isa: V.summary.isa, ...V.summary.buckets })}{V.summary.untagged.length ? ' ' + fill(F.untagged, { list: V.summary.untagged.join(', ') }) : ''}</p>}
      {editable && V.pasteOpen && (
        <div class="mix-paste" data-testid="plan.mix.paste">
          <h4>{F.paste.title}</h4>
          <p class="note">{F.paste.lead}</p>
          <div class="field field-choice" data-field="paste.wrapper">
            <label for="plan.mix.paste.wrapper">{F.paste.wrapper}</label>
            <div class="box"><select id="plan.mix.paste.wrapper" data-testid="plan.mix.paste.wrapper" value={P.wrapper} onChange={(e) => edit('paste.wrapper', e.currentTarget.value)}>{['SIPP', 'ISA', 'GIA'].map((k) => <option key={k} value={k}>{F.fields.wrapper.options[k]}</option>)}</select></div>
          </div>
          <div class="field field-text" data-field="paste.text">
            <label for="plan.mix.paste.text">{F.paste.label}</label>
            <textarea id="plan.mix.paste.text" data-testid="plan.mix.paste.text" rows={6} value={P.text} onInput={(e) => edit('paste.text', e.currentTarget.value)} />
          </div>
          {P.rows.length > 0 && (
            <div class="table-wrap">
              <table class="way-table mix-paste-rows" data-testid="plan.mix.paste.rows">
                <thead><tr><th>{F.fields.name.label}</th><th>{F.fields.value.label}</th><th>{F.paste.whatIsThis}</th></tr></thead>
                <tbody>
                  {P.rows.map((r) => (
                    <tr key={r.line} data-line={r.line} data-unrecognised={r.unrecognised ? '1' : '0'}>
                      <td>{r.name || r.ticker}{r.match ? <><br /><span class="note">{fill(F.paste.readAs, { name: r.match.name || r.match.ticker })}</span></> : null}</td>
                      <td>{r.value != null ? '£' + String(Math.round(r.value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '—'}</td>
                      <td>
                        {(r.unrecognised || r.what) ? (
                          <>
                            <select data-testid={`plan.mix.paste.${r.line}.what`} value={r.what} onChange={(e) => edit(`paste.${r.line}.what`, e.currentTarget.value)} aria-label={F.paste.whatIsThis}>
                              <option value="">{F.paste.whatIsThis}</option>
                              {V.whats.map((k) => <option key={k} value={k}>{F.paste.whats[k]}</option>)}
                            </select>
                            <br /><span class="note">{r.what === 'unknown' ? F.paste.unknown : r.what ? F.paste.answered : F.paste.unrecognised}</span>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {P.rows.length > 0 && (
            <p class="note" data-testid="plan.mix.paste.summary">
              {fill(F.paste.summary, { read: String(P.counts.read), s: P.counts.read === 1 ? '' : 's', total: P.counts.total })}
              {P.counts.unrecognised > 0 || P.counts.unknown > 0 ? ' ' + fill(F.paste.summaryRecognised, { recognised: String(P.counts.recognised), recognisedTotal: P.counts.recognisedTotal }) : ''}
              {P.counts.unrecognised > 0 ? ' ' + fill(F.paste.summaryUnrecognised, { unrecognised: String(P.counts.unrecognised), unrecognisedTotal: P.counts.unrecognisedTotal }) : ''}
              {P.counts.unknown > 0 ? ' ' + fill(F.paste.summaryUnknown, { unknown: String(P.counts.unknown), unknownTotal: P.counts.unknownTotal }) : ''}
            </p>
          )}
          {P.leftOut.length > 0 && (
            <div data-testid="plan.mix.paste.leftOut">
              <h5>{F.paste.leftOutTitle}</h5>
              <ul class="plan-lines">{P.leftOut.map((x) => <li key={x.line} class="plan-line">{fill(F.paste.leftOut, { line: String(x.line), text: x.text || '', why: F.paste.whys[x.why] || F.paste.whys.other })}</li>)}</ul>
            </div>
          )}
          {P.text && !P.rows.length && P.warnings.length > 0 && <p class="notice" role="status" data-testid="plan.mix.paste.warnings">{P.warnings.join(' ')}</p>}
          <div class="actions-row">
            {P.canAdd && <Button testid="plan.mix.paste.add" kind="primary" onClick={() => { for (const e of P.edits) edit(e.path, e.value); }} {...keepFocus}>{F.paste.add}</Button>}
            {P.text && <Button testid="plan.mix.paste.clear" kind="quiet" onClick={() => edit('paste.text', '')} {...keepFocus}>{F.paste.cancel}</Button>}
          </div>
        </div>
      )}
    </div>
  );
}

/** "Show an example list for this level (not advice)" (3.2c): the model list for the level, filling nothing in. */
function Example({ V, dispatch }) {
  const F = MIX.funds;
  return (
    <>
      <div class="actions-row">
        <Button testid="plan.mix.example" kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'mixExample' })} aria-expanded={V.exampleOpen ? 'true' : 'false'} {...keepFocus}>{V.exampleOpen ? F.example.hide : F.example.button}</Button>
      </div>
      {V.exampleOpen && (
        <div class="mix-example" data-testid="plan.mix.example.table">
          <h4>{fill(F.example.title, { level: MIX.fields.level.options[V.example.level] })}</h4>
          <p class="note">{F.example.lead}</p>
          <div class="table-wrap">
            <table class="way-table">
              <thead><tr><th>{F.example.columns.fund}</th><th>{F.example.columns.job}</th><th>{F.example.columns.pct}</th></tr></thead>
              <tbody>{V.example.rows.map((r) => <tr key={r.ticker}><td>{r.ticker} <span class="note">{r.name}</span></td><td>{r.job}</td><td>{r.pct}%</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/** "Which mix lasts best?" (3.2e): the eight cells, the best marked, "Use this mix" and its confirm. */
function Compare({ V, planId, dispatch, editable }) {
  const C = MIX.compare;
  const c = V.compare;
  const key = V.runKey;
  const run = () => dispatch({ type: 'mix/compare', key });
  if (!key) return null;
  const cell = (k, tent) => c.cells.find((x) => x.key === k && x.tent === tent) || null;
  const tentWord = (tent) => MIX.tentOnOff[tent ? 'on' : 'off'];
  return (
    <section class="plan-section mix-compare" data-section="compare" data-status={c.status} data-testid="plan.mix.compare">
      <h2>{MIX.sections.compare}</h2>
      <p class="note">{MIX.notes.compare}</p>
      {(c.status === 'idle' || c.status === 'done') && <div class="actions-row"><Button testid="plan.mix.compare.run" kind={c.status === 'done' ? 'quiet' : 'primary'} onClick={run} {...keepFocus}>{c.status === 'done' ? C.again : C.button}</Button></div>}
      {c.status === 'working' && (
        <div class="working" role="status" data-testid="plan.mix.compare.working">
          <p class="working-title">{C.working}</p>
          {c.progress && c.progress.total > 0 ? <progress value={c.progress.done} max={c.progress.total} aria-label={C.progress} /> : <progress aria-label={C.progress} />}
        </div>
      )}
      {c.status === 'failed' && (
        <div class="notice" role="alert" data-testid="plan.mix.compare.failed">
          <p>{c.reason === 'noWorker' ? C.noWorker : C.failed}</p>
          {c.reason !== 'noWorker' && <Button testid="plan.mix.compare.again" kind="quiet" onClick={run}>{MIX.buttons.tryAgain}</Button>}
        </div>
      )}
      {c.status === 'done' && (
        <>
          <div class="table-wrap">
            <table class="way-table mix-grid" data-testid="plan.mix.compare.table">
              <thead><tr><th>{C.columns.mix}</th><th>{C.columns.flat}</th><th>{C.columns.tent}</th></tr></thead>
              <tbody>
                {['own', ...MIX_LEVELS].map((k) => (
                  <tr key={k} data-row={k}>
                    <th scope="row">{C.rows[k]}</th>
                    {[false, true].map((tent) => {
                      const x = cell(k, tent);
                      const id = `plan.mix.compare.${k}.${tent ? 'tent' : 'flat'}`;
                      if (!x) return <td key={String(tent)} data-testid={id}>{C.cannot}</td>;
                      return (
                        <td key={String(tent)} class={`mix-cell${x.best ? ' is-best' : ''}${x.current ? ' is-current' : ''}`} data-testid={id} data-best={x.best ? '1' : '0'} data-affordable={x.affordable ? '1' : '0'} data-chance={x.affordable ? x.pct : undefined} data-typical={x.affordable ? x.typical.replace(/[£,]/g, '') : undefined} data-bad={x.affordable ? x.bad.replace(/[£,]/g, '') : undefined}>
                          {x.affordable ? (
                            <>
                              <p class="figure mix-cell-words">{fill(C.cell, { words: x.words })}</p>
                              <p class="note">{fill(C.cellSub, { pct: x.pct, typical: x.typical, bad: x.bad })}</p>
                              <p class="note">{fill(C.cellAmounts, x.amounts)}</p>
                              {x.current ? <p class="note">{C.thisIs}</p> : editable && V.runKey ? <Button testid={`plan.mix.use.${k}.${tent ? 'tent' : 'flat'}`} kind="quiet" onClick={() => dispatch({ type: 'mix/pick', cell: { key: k, tent } })} {...keepFocus}>{C.use}</Button> : null}
                            </>
                          ) : <p class="note">{C.cannot}</p>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {c.best && <p class="note" data-testid="plan.mix.compare.best">{fill(C.best, { row: C.rows[c.best.key], tent: tentWord(c.best.tent), words: c.best.words, pct: c.best.pct })}</p>}
          <p class="plan-source" data-testid="plan.mix.compare.ran">{c.ms != null ? fill(C.ran, { ms: seconds(c.ms) }) : C.ranUntimed}</p>
          {V.pick && editable && (
            <div class="notice lock-confirm" role="region" aria-label={C.confirm.title} data-testid="plan.mix.useConfirm">
              <h3>{C.confirm.title}</h3>
              <p>{fill(C.confirm.body, { row: C.rows[V.pick.key], tent: tentWord(V.pick.tent), shares: V.pick.shares, bonds: V.pick.bonds, cash: V.pick.cash })}{V.pick.hasFunds ? ' ' + C.confirm.funds : ''}</p>
              <p>{C.confirm.undo}</p>
              <div class="actions-row">
                <Button testid="plan.mix.useConfirm.yes" kind="primary" onClick={() => dispatch({ type: 'plan/useMix', planId, cell: { key: V.pick.key, tent: V.pick.tent } })} {...keepFocus}>{C.confirm.yes}</Button>
                <Button testid="plan.mix.useConfirm.no" kind="quiet" onClick={() => dispatch({ type: 'mix/pick', cell: null })} {...keepFocus}>{C.confirm.notNow}</Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return MIX.toast.undone;
  if (toast.kind === 'unchanged') return MIX.toast.unchanged;
  const line = toast.line;
  if (line && line.id === 'use') return fill(MIX.toast.use, { row: MIX.compare.rows[line.slots.key] || line.slots.key, tent: line.slots.tent });
  if (line && line.id === 'mix') return fill(MIX.toast.mix, { ...line.slots, held: MIX.heldWords[line.slots.held] || line.slots.held });
  return MIX.toast.savedShort;
};

export function MixScreen(state, dispatch) {
  const view = planView(state);
  const V = planMixView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !V.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !V.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{MIX.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = V.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'mix') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const field = (path) => V.fields.find((f) => f.path === path);
  const sourceText = V.locked ? fill(MIX.source.locked, { date: V.lockedOn }) : V.source && V.source.at ? fill(MIX.source.saved, { date: V.source.at }) : MIX.source.savedUndated;
  const F = (path, more = {}) => <EditField step="mix" f={field(path)} words={MIX.fields[path]} errors={MIX.errors[path]} source={sourceText} savedWords={MIX.savedValue} planId={planId} dispatch={dispatch} {...more} />;
  const problem = V.problem ? (MIX.problems[V.problem] || MIX.problems.failed) : null;
  const headAndTitle = (
    <>
      <Head view={view} />
      <h1 tabIndex={-1} data-testid="plan.step.mix">{MIX.title}</h1>
    </>
  );

  // the seven bought ways (3.1): one paragraph, the link to the way step
  if (V.bought) {
    return {
      question: null, rail, full: false,
      content: (
        <>
          {headAndTitle}
          <section class="plan-panel" data-region="plan-mix" data-editable="0">
            <p class="lead" data-testid="plan.mix.bought">{fill(MIX.bought.body, { name: WAY.names[V.strategyId] || V.strategyId })} <a href={href.plan(view.id, 'way')} data-testid="plan.mix.toWay">{MIX.bought.link}</a></p>
          </section>
          <div class="actions-row"><LinkButton testid="plan.mix.back" kind="quiet" href={back}>{MIX.buttons.back}</LinkButton></div>
        </>
      )
    };
  }

  const tries = (
    <>
      <section class="income-section" data-section="sleeve">
        <h2>{MIX.sections.sleeve}</h2>
        <p class="note">{MIX.notes.sleeve}</p>
        {V.editable && V.sleeve.applies && F('sleeve')}
        <Try kind="sleeve" V={V} dispatch={dispatch} />
      </section>
      <section class="income-section" data-section="tent">
        <h2>{MIX.sections.tent}</h2>
        <p class="note" data-testid="plan.mix.tent.note">{V.tent.ignored ? MIX.notes.tentBuckets : fill(MIX.notes.tent, { years: V.tent.years })}</p>
        {V.editable && F('tent', { nested: { yes: V.tent.endgameApplies ? <>{<p class="note">{MIX.notes.tentFunds}</p>}{F('endgame')}</> : null } })}
        {!V.tent.ignored && <Try kind="tent" V={V} dispatch={dispatch} />}
      </section>
    </>
  );
  const lockedLines = (
    <>
      {V.locked && <p class="note" data-testid="plan.mix.locked">{MIX.locked.lead}</p>}
      {V.locked && V.document && <p class="note" data-testid="plan.mix.document">{fill(MIX.locked.document, { date: V.document.lockedOn, words: V.document.words, bad: V.document.badCaseLeft })}</p>}
      {V.readonly && <p class="notice" role="status" data-testid="plan.mix.readonly">{MIX.readonly}</p>}
      {!V.runKey && <p class="notice" role="status" data-testid="plan.mix.notRun">{MIX.notRun}</p>}
    </>
  );

  // A locked plan, or one shown as saved: the lines from the document, the tries and the comparison try-only, nothing written.
  if (!V.editable) {
    return {
      question: null, rail, full: false,
      content: (
        <>
          {headAndTitle}
          <p class="lead">{MIX.lead}</p>
          {lockedLines}
          <section class="plan-panel" data-region="plan-mix" data-editable="0">
            <Derived V={V} />
            {V.held === 'funds' && <section class="income-section" data-section="funds"><h2>{MIX.sections.funds}</h2><Funds V={V} planId={planId} dispatch={dispatch} sourceText={sourceText} editable={false} /></section>}
            {V.locked ? <p class="note plan-fixed" data-testid="plan.mix.fixed">{fill(w.fixed, { date: V.lockedOn })}</p> : null}
            {V.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            {tries}
          </section>
          <Compare V={V} planId={planId} dispatch={dispatch} editable={false} />
          <div class="actions-row"><LinkButton testid="plan.mix.back" kind="quiet" href={back}>{MIX.buttons.back}</LinkButton></div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(V.errors)[0];
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.mix.${firstPath}"]`) || root.querySelector(`[name="plan.mix.${firstPath}"]:checked`) || root.querySelector(`[name="plan.mix.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const split = (
    <div class="mix-split" data-testid="plan.mix.split">
      {MIX_SPLIT.map((p) => F(p))}
      {V.split && <p class="note" data-testid="plan.mix.split.amounts">{fill(MIX.splitAmounts, V.split)}</p>}
    </div>
  );

  return {
    question: null, rail, full: false,
    content: (
      <>
        {headAndTitle}
        <p class="lead">{MIX.lead}</p>
        {lockedLines}
        <form class="ask about-form income-form mix-form" noValidate onSubmit={onSubmit} data-region="plan-mix" data-editable="1">
          <section class="income-section" data-section="held">
            <h2>{MIX.sections.held}</h2>
            <p class="note">{MIX.notes.held} {fill(MIX.notes.pot, { pot: V.pot })}</p>
            {F('held', { nested: {
              level: V.held === 'level' ? <Levels V={V} f={field('level')} planId={planId} dispatch={dispatch} /> : null,
              split: V.held === 'split' ? split : null,
              funds: V.held === 'funds' ? <section class="mix-funds-section" data-section="funds"><h3>{MIX.sections.funds}</h3><p class="note">{MIX.notes.funds}</p><Funds V={V} planId={planId} dispatch={dispatch} sourceText={sourceText} editable /></section> : null
            } })}
            <Example V={V} dispatch={dispatch} />
          </section>
          {tries}
          <Derived V={V} />
          {problem && <p class="notice" role="alert" data-testid="plan.mix.problem" data-problem={V.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.mix.save" kind="primary" type="submit" disabled={!!V.saving} {...keepFocus}>{V.saving ? MIX.saving : MIX.buttons.save}</Button>
            <Button testid="plan.mix.cancel" kind="quiet" onClick={onCancel} {...keepFocus}>{MIX.buttons.cancel}</Button>
            <LinkButton testid="plan.mix.back" kind="quiet" href={back}>{MIX.buttons.back}</LinkButton>
          </div>
        </form>
        <Compare V={V} planId={planId} dispatch={dispatch} editable />
        <UndoToast prefix="plan.mix" toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={MIX.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}

/**
 * "What you hold" (research/v7/holdings-and-move.md §2; road-to-7.md step 10): the hold rail step made real. The headline the
 * plan page says, the ruling in the person's words, the lines grouped by account (edit in place, Remove with a confirm), a
 * line added by code, name, gilt or cash through the bundled list, a table pasted from a platform with "What is this?" on
 * every line the page cannot place and "Left out, and why", and what you hold as a mix with where new money goes. Every
 * change is its own write of the whole record (effects/planWrite.js, kind 'hold'), with Undo. A locked plan is fully
 * editable: the record is what is true today, not the plan. Draws only: everything is the reading's (state/select.js
 * planHoldView: answers/plan/hold.js through the plan source). No figure is worked out here; nothing runs here.
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planHoldView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { HOLD as W } from '../../copy/hold.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.hold';

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

const headlineText = (h) => (h ? fill(W.headline.main, h) + (h.gia ? fill(W.headline.gia, h) : '') + (h.cash ? fill(W.headline.cash, h) : '') + (h.date ? fill(W.headline.updated, h) : W.headline.undated) : W.headline.none);
const countedText = (c) => (c.kind === 'bucket' ? W.counted[c.bucket] || c.bucket : c.kind === 'gilt' ? (c.code ? fill(W.counted.gilt, { code: c.code }) : W.counted.giltNoCode) : W.counted[c.kind] || c.kind);

/** One line of the record: its name and codes, the boxes that save on leaving, "Counted as", Remove. */
function Line({ l, group, V, dispatch, planId }) {
  const base = `${T}.line.${l.index}`;
  const field = (f, words) => <EditField step="hold" f={{ path: f.path, type: 'money', applies: true, shown: f.shown, saved: null, error: f.error }} words={words} errors={W.errors} source={null} planId={planId} dispatch={dispatch} />;
  const onBlur = (f) => () => { dispatch({ type: 'plan/touch', planId, path: f.path }); if (f.change) dispatch({ type: 'plan/hold', planId, change: f.change }); };
  const ask = l.counted.kind === 'ask';
  const removing = V.remove && V.remove.index === l.index;
  return (
    <fieldset class="income-card hold-line" data-card={`line.${l.index}`} data-index={l.index} data-testid={base}>
      <legend>{l.name || l.ticker || l.sedol}{l.ticker ? <> <span class="note">{fill(W.line.code, { code: l.ticker })}</span></> : null}{l.sedol ? <> <span class="note">{fill(W.line.sedol, { sedol: l.sedol })}</span></> : null}</legend>
      <p class="note" data-testid={`${base}.counted`}>{W.line.counted}: {ask ? W.counted.ask : countedText(l.counted)}{l.asOf ? ' · ' + fill(W.line.asOf, { date: l.asOf }) : ''}</p>
      {ask && V.editable && (
        <div class="field field-choice" data-field={`line.${l.index}.subClass`}>
          <label for={`${base}.what`}>{W.paste.whatIsThis}</label>
          <div class="box">
            <select id={`${base}.what`} data-testid={`${base}.what`} value={l.fields.subClass.shown} onChange={(e) => { const value = e.currentTarget.value; dispatch({ type: 'plan/edit', planId, path: l.fields.subClass.path, value }); const c = V.whats.includes(value) ? { kind: 'edit', index: l.index, field: 'subClass', value: value === 'shares' ? 'worldGrowth' : value === 'bonds' ? 'globalAggHedged' : value === 'cash' ? 'moneyMarket' : value === 'diversifiers' ? 'gold' : '' } : null; if (c) dispatch({ type: 'plan/hold', planId, change: c }); }}>
              <option value="">{W.paste.whatIsThis}</option>
              {V.whats.map((k) => <option key={k} value={k}>{W.whats[k]}</option>)}
            </select>
          </div>
        </div>
      )}
      {V.editable ? (
        <div class="hold-boxes">
          <div onfocusout={onBlur(l.fields.units)}>{field(l.fields.units, W.line.fields.units)}</div>
          <div onfocusout={onBlur(l.fields.value)}>{field(l.fields.value, W.line.fields.value)}</div>
          {V.saver && <div onfocusout={onBlur(l.fields.contribution)}>{field(l.fields.contribution, W.line.fields.contribution)}</div>}
          {V.saver && <div onfocusout={onBlur(l.fields.ocf)}>{field(l.fields.ocf, W.line.fields.ocf)}</div>}
        </div>
      ) : (
        <p class="line">{l.units ? fill(W.line.fields.units.label, {}) + ' ' + l.units + ' · ' : ''}{W.line.fields.value.label}: {l.value || '—'}</p>
      )}
      {V.editable && !removing && (
        <div class="actions-row income-card-actions">
          <Button testid={`${base}.remove`} kind="quiet" onClick={() => dispatch({ type: 'plan/edit', planId, path: 'remove.index', value: String(l.index) })} {...keepFocus}>{W.line.remove}</Button>
        </div>
      )}
      {V.editable && removing && (
        <div class="notice lock-confirm" role="region" aria-label={W.line.remove} data-testid={`${base}.removeConfirm`}>
          <p>{fill(W.line.removeConfirm, { name: V.remove.name, wrapper: W.wrapperOf[group.wrapper] })}</p>
          <div class="actions-row">
            <Button testid={`${base}.removeConfirm.yes`} kind="primary" onClick={() => dispatch({ type: 'plan/hold', planId, change: { kind: 'remove', index: l.index } })} {...keepFocus}>{W.line.removeYes}</Button>
            <Button testid={`${base}.removeConfirm.no`} kind="quiet" onClick={() => dispatch({ type: 'plan/edit', planId, path: 'remove.index', value: '' })} {...keepFocus}>{W.line.removeNo}</Button>
          </div>
        </div>
      )}
    </fieldset>
  );
}

/** Add a line (§2.1): the box, the matches from the bundled list and the order sheet, "Add as typed". */
function Add({ V, dispatch, planId, F }) {
  const A = W.add;
  const add = (line) => dispatch({ type: 'plan/hold', planId, change: { kind: 'add', line } });
  const a = V.add;
  return (
    <section class="plan-section" data-section="add" data-testid={`${T}.add`}>
      <h2>{W.sections.add}</h2>
      <p class="note">{A.lead}</p>
      {F('add.wrapper', { words: A.fields.wrapper })}
      {F('add.text', { words: A.fields.text })}
      {F('add.value', { words: A.fields.value })}
      {F('add.units', { words: A.fields.units })}
      {a.text && a.ok && (
        <div class="hold-matches" data-testid={`${T}.add.matches`}>
          {a.matches.length === 0 && !a.asTyped && <p class="note" data-testid={`${T}.add.none`}>{A.none}</p>}
          {a.matches.length > 0 && <ul class="mix-matches">{a.matches.map((m) => <li key={m.id}><Button testid={`${T}.add.match.${m.id}`} kind="plain" onClick={() => add(m.line)} {...keepFocus}>{m.kind === 'gilt' ? fill(A.matchGilt, m) : m.kind === 'cash' ? A.matchCash : fill(A.match, m)}</Button></li>)}</ul>}
          {a.asTyped && <div class="actions-row"><Button testid={`${T}.add.asTyped`} kind={a.matches.length ? 'quiet' : 'primary'} onClick={() => add(a.asTyped.line)} {...keepFocus}>{fill(A.asTyped, { text: a.text })}</Button></div>}
          {a.asTyped && a.matches.length === 0 && <p class="note">{A.asTypedNote}</p>}
        </div>
      )}
    </section>
  );
}

/** Paste a table (§2.1): the mix step's paste block, re-pointed at the record; every line counts; "sold?" with its own Remove. */
function Paste({ V, dispatch, planId }) {
  const P = W.paste;
  const Ps = V.paste;
  const edit = (path, value) => dispatch({ type: 'plan/edit', planId, path, value });
  return (
    <section class="plan-section" data-section="paste" data-testid={`${T}.paste`}>
      <h2>{W.sections.paste}</h2>
      <div class="actions-row"><Button testid={`${T}.paste.open`} kind="plain" onClick={() => dispatch({ type: 'ui/toggle', id: 'holdPaste' })} aria-expanded={V.pasteOpen ? 'true' : 'false'} {...keepFocus}>{V.pasteOpen ? P.close : P.open}</Button></div>
      {V.pasteOpen && (
        <div class="mix-paste" data-testid={`${T}.paste.box`}>
          <p class="note">{P.lead}</p>
          <div class="field field-choice" data-field="paste.wrapper">
            <label for={`${T}.paste.wrapper`}>{P.wrapper}</label>
            <div class="box"><select id={`${T}.paste.wrapper`} data-testid={`${T}.paste.wrapper`} value={Ps.wrapper} onChange={(e) => edit('paste.wrapper', e.currentTarget.value)}>{V.wrappers.map((k) => <option key={k} value={k}>{W.wrappers[k]}</option>)}</select></div>
          </div>
          <div class="field field-text" data-field="paste.text">
            <label for={`${T}.paste.text`}>{P.label}</label>
            <textarea id={`${T}.paste.text`} data-testid={`${T}.paste.text`} rows={6} value={Ps.text} onInput={(e) => edit('paste.text', e.currentTarget.value)} />
          </div>
          {Ps.rows.length > 0 && (
            <div class="table-wrap">
              <table class="way-table mix-paste-rows" data-testid={`${T}.paste.rows`}>
                <thead><tr><th>{P.columns.pasted}</th><th>{P.columns.value}</th><th>{P.columns.what}</th></tr></thead>
                <tbody>
                  {Ps.rows.map((r) => (
                    <tr key={r.line} data-line={r.line} data-unrecognised={r.unrecognised ? '1' : '0'}>
                      <td>{r.name || r.ticker}{r.match ? <><br /><span class="note">{fill(P.readAs, { name: r.match.name || r.match.ticker })}</span></> : null}</td>
                      <td>{r.value != null ? '£' + String(Math.round(r.value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '—'}</td>
                      <td>
                        {(r.unrecognised || r.what) ? (
                          <>
                            <select data-testid={`${T}.paste.${r.line}.what`} value={r.what} onChange={(e) => edit(`paste.${r.line}.what`, e.currentTarget.value)} aria-label={P.whatIsThis}>
                              <option value="">{P.whatIsThis}</option>
                              {V.whats.map((k) => <option key={k} value={k}>{W.whats[k]}</option>)}
                            </select>
                            <br /><span class="note">{r.what === 'unknown' ? P.unknown : r.what ? P.answered : P.unrecognised}</span>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {Ps.rows.length > 0 && Ps.counts && (
            <p class="note" data-testid={`${T}.paste.summary`}>
              {fill(P.summary, { read: String(Ps.counts.read), s: Ps.counts.read === 1 ? '' : 's', total: Ps.counts.total })}
              {Ps.counts.unrecognised > 0 || Ps.counts.unknown > 0 ? ' ' + fill(P.summaryRecognised, { recognised: String(Ps.counts.recognised), recognisedTotal: Ps.counts.recognisedTotal }) : ''}
              {Ps.counts.unrecognised > 0 ? ' ' + fill(P.summaryUnrecognised, { unrecognised: String(Ps.counts.unrecognised), unrecognisedTotal: Ps.counts.unrecognisedTotal }) : ''}
              {Ps.counts.unknown > 0 ? ' ' + fill(P.summaryUnknown, { unknown: String(Ps.counts.unknown), unknownTotal: Ps.counts.unknownTotal }) : ''}
              {Ps.merged ? ' ' + fill(P.merge, { updated: String(Ps.merged.updated), added: String(Ps.merged.added) }) : ''}
            </p>
          )}
          {Ps.leftOut.length > 0 && (
            <div data-testid={`${T}.paste.leftOut`}>
              <h5>{P.leftOutTitle}</h5>
              <ul class="plan-lines">{Ps.leftOut.map((x) => <li key={x.line} class="plan-line">{fill(P.leftOut, { line: String(x.line), text: x.text || '', why: P.whys[x.why] || P.whys.other })}</li>)}</ul>
            </div>
          )}
          {Ps.unseen.length > 0 && (
            <div data-testid={`${T}.paste.unseen`}>
              <h5>{P.unseenTitle}</h5>
              <p class="note">{fill(P.unseenLead, { wrapper: W.wrapperOf[Ps.wrapper] })}</p>
              <ul class="plan-lines">{Ps.unseen.map((u) => <li key={u.index} class="plan-line" data-index={u.index}>{u.name || u.ticker}{u.ticker ? ' (' + u.ticker + ')' : ''} <Button testid={`${T}.paste.unseen.${u.index}.remove`} kind="quiet" onClick={() => edit('remove.index', String(u.index))} {...keepFocus}>{W.line.remove}</Button></li>)}</ul>
            </div>
          )}
          {Ps.text && !Ps.rows.length && Ps.warnings.length > 0 && <p class="notice" role="status" data-testid={`${T}.paste.warnings`}>{Ps.warnings.join(' ')}</p>}
          <div class="actions-row">
            {Ps.canAdd && <Button testid={`${T}.paste.add`} kind="primary" onClick={() => dispatch({ type: 'plan/hold', planId, change: Ps.change })} {...keepFocus}>{fill(P.add, { wrapper: W.wrapperOf[Ps.wrapper] })}</Button>}
            {Ps.text && <Button testid={`${T}.paste.clear`} kind="quiet" onClick={() => edit('paste.text', '')} {...keepFocus}>{P.clear}</Button>}
          </div>
        </div>
      )}
    </section>
  );
}

/** What you hold, as a mix (§2.1): the four shares on the total, the charge, what is not counted, where new money goes. */
function Mix({ V }) {
  const M = W.mix;
  return (
    <section class="plan-section" data-section="mix" data-testid={`${T}.mix`}>
      <h2>{W.sections.mix}</h2>
      {V.mix ? (
        <>
          <p class="line" data-testid={`${T}.mix.line`}>{fill(M.line, V.mix)}</p>
          <p class="note" data-testid={`${T}.mix.charge`}>{fill(M.charge, V.mix)}</p>
          {V.mix.untagged.length > 0 && <p class="note" data-testid={`${T}.mix.notCounted`}>{fill(M.notCounted, { list: V.mix.untagged.join(', ') })}</p>}
        </>
      ) : <p class="note" data-testid={`${T}.mix.none`}>{M.none}</p>}
      {V.newMoney && <p class="line" data-testid={`${T}.mix.newMoney`}>{fill(M.newMoney, { parts: V.newMoney.parts.map((p) => fill(M.newMoneyPart, p)).join(', '), monthly: V.newMoney.monthly })}</p>}
      <p class="note">{M.note}</p>
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (line && W.toast[line.id]) return fill(W.toast[line.id], { ...(line.slots || {}), wrapper: W.wrapperOf[(line.slots || {}).wrapper] || (line.slots || {}).wrapper || '', s: (line.slots || {}).updated === '1' ? '' : 's' });
  return W.toast.savedShort;
};

export function HoldScreen(state, dispatch) {
  const view = planView(state);
  const V = planHoldView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !V.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !V.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{W.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = V.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'hold') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const field = (path) => V.fields.find((f) => f.path === path);
  const F = (path, more = {}) => <EditField step="hold" f={field(path)} words={more.words || {}} errors={W.errors} source={null} planId={planId} dispatch={dispatch} {...more} />;
  const problem = V.problem ? fill(W.problems[V.problem] || W.problems.failed, { store: W.problems.store[V.source] || 'account' }) : null;
  const atLockText = V.atLock ? (V.atLock.lines ? fill(W.atLock, { lockedOn: V.atLock.lockedOn, summary: headlineText({ ...V.atLock, date: null }).replace(/\.$/, ''), date: V.atLock.date ? fill(W.atLockDate, { date: V.atLock.date }) : '' }) : fill(W.atLockNone, { lockedOn: V.atLock.lockedOn })) : null;
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.hold">{W.title}</h1>
        <p class="figure" data-testid={`${T}.headline`}>{headlineText(V.headline)}</p>
        <p class="lead">{W.lead}</p>
        {V.recordSource && W.recordSource[V.recordSource] && <p class="plan-source" data-testid={`${T}.source`}>{W.recordSource[V.recordSource]}</p>}
        {V.locked && <p class="note" data-testid={`${T}.locked`}>{W.locked}</p>}
        {atLockText && <p class="note" data-testid={`${T}.atLock`}>{atLockText}</p>}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}
        <form class="ask about-form income-form hold-form" noValidate onSubmit={(e) => e.preventDefault()} data-region="plan-hold" data-editable={V.editable ? '1' : '0'}>
          <section class="plan-section" data-section="lines" data-testid={`${T}.lines`}>
            <h2>{W.sections.lines}</h2>
            {V.count === 0 && <p class="note" data-testid={`${T}.none`}>{W.none}</p>}
            {V.groups.map((g) => (
              <div class="hold-group" key={g.wrapper} data-wrapper={g.wrapper} data-testid={`${T}.group.${g.wrapper}`}>
                <h3>{W.wrappers[g.wrapper]} <span class="note">{fill(W.groupTotal, { total: g.total })}</span></h3>
                {g.lines.map((l) => <Line key={l.index} l={l} group={g} V={V} dispatch={dispatch} planId={planId} />)}
              </div>
            ))}
            {V.editable && V.count > 0 && <p class="note">{W.line.saveNote}</p>}
          </section>
          {V.editable && <Add V={V} dispatch={dispatch} planId={planId} F={F} />}
          {V.editable && <Paste V={V} dispatch={dispatch} planId={planId} />}
          <Mix V={V} />
          {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
        </form>
        <div class="actions-row">
          <LinkButton testid={`${T}.move`} kind="plain" href={href.plan(view.id, 'move')}>{W.buttons.move}</LinkButton>
          <LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}

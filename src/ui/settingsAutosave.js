/**
 * Settings that save as they change (7.12.0, lead decision 1). The full view's Stress tester → Settings and Accumulation tab
 * used to keep what was typed only on screen until a button far below was pressed; leaving the tab, switching plan or
 * reloading lost it, with nothing said. Now, on a plan not locked, a box saves when it changes and is valid (a person's own
 * change or press, a moment later, through the page's existing save), with a quiet "Saved" by the heading. A box with a
 * problem says what is wrong beside it, and the heading says "Not saved yet" until it is put right. A locked plan is
 * unchanged (its boxes are frozen and nothing is saved here).
 *
 * Nothing is written by opening, by the page's own redraws or by a press that changes nothing: only a change a person made
 * (a trusted change or press) starts a save, and only when the form differs from what was last loaded or saved. A save is
 * bound to the plan the form was loaded from, so it never lands on another plan opened meanwhile; `flush()` (awaited before a
 * tab, sub-tab or plan changes, and when the page is hidden) sends anything waiting first.
 *
 *   fingerprintOf(root, { include, state })   the form's own values (boxes with an id) and its state, as one string
 *   boxNameOf(el)                             the box's own label, for "Not saved yet: “…” needs a change"
 *   createAutosave(win, doc, o)               → { schedule, flush, loaded, markSaved, checkNow, problems, run, pending }
 *     o.root()          the element holding the boxes        o.heading()   where "Saved" is said
 *     o.include(el)     which boxes are the form's           o.state()     what the form holds outside its boxes
 *     o.kindOf(el)      'age' | 'money' | 'spDate' | null    o.extraProblems()   [{ el, words, blocks }] the page's own checks
 *     o.canSave()       async: signed in and the plan not locked   o.refusal()  optional async: null, 'signedOut' or 'locked'
 *     o.planId()        async: the plan open now             o.save({ onFault })   async: true when saved
 *     o.afterSave()     optional                             o.visible(el) optional (default: drawn on screen)
 *     o.delay           ms after a change (default 300)      o.testid      the status line's data-testid
 *     o.byPerson(e)     optional: is the event a person's own (default: trusted)
 *   installStressSettingsAutosave(win, doc, deps) / installAccumulationAutosave(win, doc, deps)   the two forms
 */
import { FIELD_WORDS, ageProblem, moneyProblem, spDateProblem, problemsLine } from '../services/FieldChecks.js';
import { ACCUMULATION_BOXES } from '../answers/plan/accumulationTab.js';
import { ABOUT } from '../v7/copy/about.js';
import { SAVING } from '../v7/copy/saving.js';

export const SAVE_WORDS = Object.freeze({ ...FIELD_WORDS, fixBox: 'A box needs a change first: it says what, beside it.' });

/**
 * What a press of a Save button says, by what happened (lead4.md R3): "Saved" only when something was written; a write
 * refused says why in plain words. `run()` gives the outcome.
 */
export const SAVE_OUTCOME_WORDS = Object.freeze({
  saved: 'Saved.',
  nothing: 'Nothing to save: nothing has changed since it was last saved.',
  signedOut: 'Nothing was saved: sign in to keep a plan.',
  locked: 'Nothing was saved: this plan is locked, so its figures stay as they were locked. Unlock it to change them.',
  otherPlan: 'Nothing was saved: another plan is open now. What was typed belonged to the plan open before.',
  opening: 'Nothing was saved: the plan was still opening. The boxes show what it holds now; type the change again.',
  problem: 'Nothing was saved yet: a box needs a change first. It says what, beside it.',
  notSaved: 'Nothing was saved.'
});

/**
 * The outcome as a toast: { words, kind }. `what` names the form ('Settings', 'Accumulation plan'): "Settings saved." when
 * written, "Settings saved already: nothing has changed since." when there was nothing to write.
 */
export const saveOutcomeToast = (outcome, what = null) => {
  const kind = outcome === 'saved' ? 'success' : outcome === 'nothing' ? 'info' : 'error';
  if (what && outcome === 'saved') return { words: what + ' saved.', kind };
  if (what && outcome === 'nothing') return { words: what + ' saved already: nothing has changed since.', kind };
  return { words: SAVE_OUTCOME_WORDS[outcome] || SAVE_OUTCOME_WORDS.notSaved, kind };
};

const NOT_A_PRESS = 'summary, .hlp, [data-no-autosave]';

/** The form's values (boxes with an id, as `include` says) and its state outside the boxes, as one string. */
export function fingerprintOf(root, { include = () => true, state = () => null } = {}) {
  const parts = [];
  if (root) {
    root.querySelectorAll('input[id], select[id], textarea[id]').forEach((el) => {
      if (!include(el)) return;
      const t = (el.type || '').toLowerCase();
      if (t === 'button' || t === 'submit' || t === 'file') return;
      parts.push(el.id + (t === 'checkbox' || t === 'radio' ? ':' + (el.checked ? 1 : 0) : '=' + el.value));
    });
  }
  let st = null;
  try { st = state(); } catch (e) { st = null; }
  return parts.join('\u0001') + '\u0002' + JSON.stringify(st === undefined ? null : st);
}

/** The box's own label: a data-box-name, its <label>'s words, or its form group's label. */
export function boxNameOf(el) {
  if (!el) return '';
  if (el.dataset && el.dataset.boxName) return el.dataset.boxName;
  const words = (node) => {
    if (!node) return '';
    const c = node.cloneNode(true);
    c.querySelectorAll('input, select, textarea, .hlp, .field-problem, button').forEach((x) => x.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  };
  const own = el.closest && el.closest('label');
  const ownWords = words(own);
  if (ownWords) return ownWords;
  const group = el.closest && el.closest('.form-group');
  const lab = group && group.querySelector('label');
  return words(lab) || el.id || '';
}

function problemOf(kind, el, confirmed) {
  const raw = el.value;
  const badInput = !!(el.validity && el.validity.badInput);
  if (kind === 'age') return ageProblem(raw, { badInput });
  if (kind === 'money') return moneyProblem(raw, { badInput, confirmed: confirmed.has(el.id + '=' + raw) });
  if (kind === 'spDate') return spDateProblem(raw);
  return null;
}

export function createAutosave(win, doc, o) {
  const delay = o.delay == null ? 300 : o.delay;
  const visible = o.visible || ((el) => !!(el && (el.offsetParent || (el.getClientRects && el.getClientRects().length))));
  const confirmed = new Set();
  let timer = null, running = null, dirty = false, base = null, boundId = null;

  const root = () => { try { return o.root(); } catch (e) { return null; } };
  const fp = () => fingerprintOf(root(), { include: o.include, state: o.state });

  let statusEl = null;
  function status(text, kind) {
    const h = o.heading && o.heading();
    if (!h) return;
    if (!statusEl || !statusEl.isConnected) {
      statusEl = doc.createElement('span');
      statusEl.className = 'save-state';
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
      if (o.testid) statusEl.setAttribute('data-testid', o.testid);
      statusEl.style.cssText = 'margin-left:12px; font-size:13px; font-weight:normal; color:var(--text-muted);';
      h.appendChild(statusEl);
    }
    statusEl.textContent = text || '';
    statusEl.style.color = kind === 'warn' ? 'var(--warning, #d97706)' : 'var(--text-muted)';
  }

  /** Every box's problem, as it stands: [{ el, box, words, blocks, ask }]. */
  function problems() {
    const r = root();
    const out = [];
    if (r && o.kindOf) {
      r.querySelectorAll('input, select, textarea').forEach((el) => {
        if (o.include && !o.include(el)) return;
        if (el.disabled || !visible(el)) return;
        const kind = o.kindOf(el);
        if (!kind) return;
        const p = problemOf(kind, el, confirmed);
        if (p) out.push({ el, box: boxNameOf(el), ...p });
      });
    }
    let extra = [];
    try { extra = (o.extraProblems && o.extraProblems()) || []; } catch (e) { extra = []; }
    for (const p of extra) if (p && p.el) out.push({ box: boxNameOf(p.el), blocks: true, ...p });
    return out;
  }

  function paint(list) {
    const r = root();
    const marked = new Set(list.map((p) => p.el));
    if (r) r.querySelectorAll('[aria-invalid="true"]').forEach((el) => { if (!marked.has(el)) { el.removeAttribute('aria-invalid'); const n = el.nextElementSibling; if (n && n.classList.contains('field-problem')) n.remove(); } });
    if (r) r.querySelectorAll('.field-problem').forEach((n) => { const el = n.previousElementSibling; if (!el || !marked.has(el)) n.remove(); });
    for (const p of list) {
      const el = p.el;
      let n = el.nextElementSibling;
      if (!n || !n.classList.contains('field-problem')) {
        n = doc.createElement('span');
        n.className = 'field-problem';
        n.setAttribute('data-testid', 'field.problem');
        n.style.cssText = 'display:block; font-size:12px; margin-top:4px; color:var(--warning, #d97706);';
        el.insertAdjacentElement('afterend', n);
      }
      if (p.blocks) {
        el.setAttribute('aria-invalid', 'true'); n.setAttribute('role', 'alert');
        const closed = el.closest && el.closest('details:not([open])');   // a box under "More detail" with a problem is shown
        if (closed) closed.open = true;
      } else { el.removeAttribute('aria-invalid'); n.removeAttribute('role'); }
      n.textContent = p.words + (p.blocks ? ' ' + FIELD_WORDS.notSaved : '');
      if (p.ask) {
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = 'risk-btn';
        b.style.cssText = 'margin-left:8px; padding:2px 10px; font-size:12px;';
        b.textContent = FIELD_WORDS.bigYes;
        b.setAttribute('data-no-autosave', '');
        b.addEventListener('click', () => { confirmed.add(el.id + '=' + el.value); schedule(0); });
        n.appendChild(b);
      }
    }
  }

  /** Paints every problem now; true when nothing blocks a save. */
  function checkNow() {
    const list = problems();
    paint(list);
    const line = problemsLine(list);
    if (line) status(line, 'warn');
    return !line;
  }

  /** One save: its outcome, 'saved' | 'nothing' | 'signedOut' | 'locked' | 'otherPlan' | 'problem' | 'notSaved' (SAVE_OUTCOME_WORDS). */
  async function runOnce() {
    const refused = o.refusal ? await o.refusal() : ((await o.canSave()) ? null : 'notSaved');
    if (refused) return refused;
    const list = problems();
    paint(list);
    const line = problemsLine(list);
    if (line) { status(line, 'warn'); return 'problem'; }
    const before = fp();
    if (before === base) { status(FIELD_WORDS.saved); return 'nothing'; }
    const id = await o.planId();
    if (boundId && id && id !== boundId) return 'otherPlan';   // another plan is open now: this form is never written into it
    dirty = false;
    status(FIELD_WORDS.saving);
    let why = null;
    let ok = false;
    try { ok = (await o.save({ onFault: (m) => { why = m; } })) === true; } catch (e) { why = e && e.message; }
    if (ok) {
      base = dirty ? before : fp();   // typed during the save: what was typed is still to go
      status(FIELD_WORDS.saved);
      if (o.afterSave) { try { await o.afterSave(); } catch (e) { /* the save stands */ } }
      return 'saved';
    }
    status(why ? FIELD_WORDS.fault.replace('{why}', why) : (problemsLine(problems()) || FIELD_WORDS.notSaved), 'warn');
    return 'notSaved';
  }

  async function run() {
    timer = null;
    if (running) { dirty = true; return running; }
    running = runOnce().finally(() => { running = null; });
    const out = await running;
    if (dirty) { dirty = false; return run(); }
    return out;
  }

  function schedule(ms) {
    if (timer) win.clearTimeout(timer);
    if (running) dirty = true;
    if (statusEl && statusEl.textContent === FIELD_WORDS.saved) status(FIELD_WORDS.saving);   // a change waiting: never "Saved" beside it
    timer = win.setTimeout(() => { run(); }, ms == null ? delay : ms);
  }

  /** Sends a change waiting to go (and waits for one going); nothing when nothing was changed. */
  async function flush() {
    // a box still being typed in (no change yet) counts as changed: a tab, a sub-tab or another plan never draws over it
    const r = root(), ae = doc.activeElement;
    const typing = !!(r && ae && r.contains(ae) && /^(INPUT|SELECT|TEXTAREA)$/.test(ae.tagName) && (!o.include || o.include(ae)));
    if (timer || typing) { if (timer) win.clearTimeout(timer); timer = null; await run(); return; }
    if (running) await running;
  }

  /** The form was just drawn from the plan as stored: what it shows now is what is saved. */
  async function loaded() {
    if (timer) { win.clearTimeout(timer); timer = null; }
    base = fp();
    const was = boundId;
    try { boundId = await o.planId(); } catch (e) { boundId = null; }
    paint([]);
    if (boundId !== was) status('');   // the same plan drawn again keeps its "Saved"
  }

  /** Saved by the page's own button: what the form shows now is what is stored. */
  function markSaved() {
    if (timer) { win.clearTimeout(timer); timer = null; }
    base = fp();
    paint([]);
    status(FIELD_WORDS.saved);
  }

  const r0 = root();
  if (r0) {
    const byPerson = o.byPerson || ((e) => e.isTrusted !== false);   // the page's own events never start a save
    r0.addEventListener('change', (e) => { if (byPerson(e)) schedule(); }, true);
    r0.addEventListener('click', (e) => {
      if (!byPerson(e)) return;
      const b = e.target && e.target.closest && e.target.closest('button, [role="button"]');
      if (!b || !r0.contains(b) || b.closest(NOT_A_PRESS) || (o.notAPress && b.closest(o.notAPress))) return;
      schedule();
    }, true);
  }
  /** Whether the form holds typing not yet saved (since it was filled from the plan or last saved). */
  const pending = () => base != null && fp() !== base;
  return { schedule, flush, loaded, markSaved, checkNow, problems, run, pending };
}

// ---- the two forms ----------------------------------------------------------------------------------------------------

const STRESS_AGES = ['tmAge', 'tmRetireAge', 'miniFloorToAge', 'miniBridgeAge', 'ssDbStartAge', 'ssLongevityAge'];
const STRESS_MONEY = ['ssPot', 'ssIsaBalance', 'miniSipp', 'miniIsa', 'tmPotSipp', 'tmPotIsa', 'ssDbAmount', 'ssOther', 'ssTaxableStart', 'ssRelevantEarnings',
  'ssRecoveryBuffer', 'ssHodlValue', 'stratSipp', 'stratIsa', 'stratSippFf', 'stratIsaFf', 'lrDraw', 'ffEssentials', 'ssSpWeeklyAmount'];
/** Boxes on Settings that are not the plan's: a helper typed into and then used, a search box. */
const STRESS_NOT_FORM = ['shapeStartNumber', 'ssFundSearch'];

/** The kind of check a Stress settings box gets (an income step's amount and its age included). */
export function stressKindOf(el) {
  if (!el || !el.id) {
    if (el && el.closest && el.closest('#incomeStepsEditor') && el.type === 'number') return el.getAttribute('step') === '1000' ? 'money' : 'age';
    return null;
  }
  if (STRESS_AGES.includes(el.id)) return 'age';
  if (STRESS_MONEY.includes(el.id)) return 'money';
  if (el.id === 'ssSpStartDate') return 'spDate';
  return null;
}

/**
 * Stress tester → Settings. deps: save(opts) (index.html saveStressSettingsUI), planIsLocked, isLoggedIn, getActiveScenarioId,
 * dbStartError() (the final-salary start's own check: words or null), activeButtons(): the pressed buttons' keys.
 */
export function installStressSettingsAutosave(win, doc, deps) {
  const root = () => doc.getElementById('stress-stresssettings');
  return createAutosave(win, doc, {
    root,
    heading: () => root() && root().querySelector('h2'),
    testid: 'settings.saveState',
    include: (el) => !STRESS_NOT_FORM.includes(el.id) && !(el.closest && el.closest('#ssLockBanner, #tmLockedStart, #ssFundSearchResults')),
    state: () => ({
      strategy: win._ssStrategy || null, shape: win._ssIncomeShape || null, steps: win._ssIncomeSteps || null,
      extra: win._ssExtraIncomes || null, windfalls: win._ssWindfalls || null, withdrawals: win._ssExtraWithdrawals || null,
      funds: (win._taggedFunds && win._taggedFunds.ss) || null,
      pressed: [...(root() ? root().querySelectorAll('button.active') : [])].map((b) => b.id || b.dataset.strat || b.dataset.access || b.dataset.risk || b.textContent.trim()).sort()
    }),
    kindOf: stressKindOf,
    extraProblems: () => {
      const words = deps.dbStartError ? deps.dbStartError() : null;
      const el = doc.getElementById('ssDbStartAge');
      return words && el ? [{ el, words, blocks: true }] : [];
    },
    notAPress: '#ssSaveBtn, #ssLockBtn, #ssLockBanner, #tmLockedStart',
    canSave: async () => !!deps.isLoggedIn() && !(await deps.planIsLocked()),
    refusal: async () => (!deps.isLoggedIn() ? 'signedOut' : (await deps.planIsLocked()) ? 'locked' : null),
    planId: () => deps.getActiveScenarioId(),
    save: (opts) => deps.save({ quiet: true, onFault: opts.onFault }),
    afterSave: deps.afterSave
  });
}

/** The Accumulation tab's own boxes (the plan's ages, pay, pot today and what goes in); not the quick spin's, not a record's. */
export const ACCUMULATION_BOX_IDS = Object.freeze(['acAge', 'acRetireAge', 'acSalary', 'acPotNow', 'acNetMonthly', 'acScheme', 'acEmployerMonthly', 'acEscalation', 'acIsaMonthly']);
const AC_AGES = ['acAge', 'acRetireAge'];
const AC_MONEY = ['acSalary', 'acPotNow', 'acNetMonthly', 'acEmployerMonthly', 'acIsaMonthly'];

/** The words for a box the plan's own rules refused (the simple view's words for the same field). */
export function accumulationErrorWords(id, err) {
  const set = id === 'acAge' ? ABOUT.errors.age : id === 'acRetireAge' ? ABOUT.errors.stopAge : SAVING.errors[ACCUMULATION_BOXES[id]];
  return (set && set[err]) || (err === 'locked' ? '' : 'This figure cannot be saved as it is.');
}

/** The tab's nine figures as the planner reads them (moved from index.html readAccumulationInputs): numbers, blank as 0. */
export function accumulationInputsOf(doc) {
  const n = (id) => { const el = doc.getElementById(id); return el ? +el.value || 0 : 0; };
  const scheme = doc.getElementById('acScheme');
  return { currentAge: n('acAge'), retirementAge: n('acRetireAge'), salary: n('acSalary'), potNow: n('acPotNow'), netMonthly: n('acNetMonthly'),
    schemeType: (scheme && scheme.value) || 'ras', employerMonthly: n('acEmployerMonthly'), escalationPct: n('acEscalation'), isaMonthly: n('acIsaMonthly') };
}

/** The boxes as typed, by id (text). */
export function accumulationBoxesTyped(doc) {
  const out = {};
  for (const id of ACCUMULATION_BOX_IDS) { const el = doc.getElementById(id); if (el) out[id] = el.value; }
  return out;
}

/**
 * The Accumulation tab. deps: saveTab(boxes) (ScenarioRepository.saveActiveAccumulationTab → { ok, errors }), planIsLocked,
 * isLoggedIn, getActiveScenarioId, errorWords(id, error) → the words for a refused box, afterSave.
 */
export function installAccumulationAutosave(win, doc, deps) {
  const root = () => doc.getElementById('accumulation-content');
  let refused = [];
  const auto = createAutosave(win, doc, {
    root,
    heading: () => root() && root().querySelector('h2'),
    testid: 'accumulation.saveState',
    include: (el) => ACCUMULATION_BOX_IDS.includes(el.id),
    state: () => null,
    kindOf: (el) => (AC_AGES.includes(el.id) ? 'age' : AC_MONEY.includes(el.id) ? 'money' : null),
    extraProblems: () => refused,
    notAPress: 'button',   // only the boxes save here; the tab's buttons do their own work
    canSave: async () => !!deps.isLoggedIn() && !(await deps.planIsLocked()),
    refusal: async () => (!deps.isLoggedIn() ? 'signedOut' : (await deps.planIsLocked()) ? 'locked' : null),
    planId: () => deps.getActiveScenarioId(),
    save: async (opts) => {
      const r = await deps.saveTab(accumulationBoxesTyped(doc));
      if (r && r.ok) { refused = []; return true; }
      // refused by the plan's own rules (a stop before today's age …): said beside each box, and the line by the heading
      refused = Object.entries((r && r.errors) || {}).map(([id, err]) => ({ el: doc.getElementById(id), words: (deps.errorWords || accumulationErrorWords)(id, err), blocks: true })).filter((p) => p.el);
      auto.checkNow();
      refused = refused.map((p) => ({ ...p }));
      if (opts.onFault && !refused.length) opts.onFault(String(Object.values((r && r.errors) || {})[0] || ''));
      return false;
    },
    afterSave: deps.afterSave
  });
  // a refused box is said until that box changes again
  const r0 = root();
  if (r0) r0.addEventListener('input', (e) => { refused = refused.filter((p) => p.el !== e.target); }, true);
  return auto;
}

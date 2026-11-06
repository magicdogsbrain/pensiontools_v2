/**
 * Month by month, the entry form's side of three things (3 November 2026):
 *   - why Save is off: the line under the Calculate / Save row, and the button with it — on only while a calculation
 *     still matches the boxes (nothing calculated, a change since, a failed Calculate, a fill that stopped or a month
 *     just saved all leave it off, and the line says which);
 *   - a failed Calculate that stays on the page: the engine's own words (never reworded here) as an alert in the output
 *     panel until the next Calculate replaces them — the toast alone was gone in three seconds;
 *   - the months not recorded, filled in: the offer box, its tick and its "Start from" chooser, and the Save flow — with the
 *     tick on, the months with no record from the chooser's month to this month are recorded FIRST, in date order, each
 *     worked out by the same calculation as a normal month on the same figures (so each sees the records before it: tax
 *     to date, ISA used, protection) and marked as filled in later; a month before its tax year's set-up takes its share
 *     of what that set-up was given as received instead (MonthFill.setUpShareDecision); then this month, worked out again
 *     now the months before it are on record — and when that moves the recommendation, the saved line and the toast say
 *     what moved. The batch (quarterly / annual) is as it was. The offer is read afresh from the history at Save, so a
 *     tick left on for a month that no longer has a gap writes nothing extra. The chooser starts where 6.48.0's offer did
 *     (the months after the latest record before this month) and reaches back to the April of the earliest tax year set
 *     up (MonthFill.fillOffer). When that default offers nothing, the box holds one quiet line ("Fill in earlier months
 *     you did not record…") that opens the chooser at its earliest month, never a ready tick; after a Save the next entry
 *     starts from the default again. A month in the box month's own tax year while that year is not set up is not
 *     offered, since the Calculate sets it up from the month in the box. A tax year not set up among the months chosen
 *     stops the fill before it, and this month is then not recorded either: the label and the help said so beforehand.
 *
 * The rules and the words are src/services/MonthFill.js (pure). This module reads and writes the form's own elements
 * (IDS) and calls what index.html passes in — its engine call, saveDecision (the one write path), the wizard check, the
 * history and tax-year reads, the panel — so nothing here reads storage or the engine itself, and a jsdom test can drive
 * it whole (tests/monthFillEntry.test.js).
 */
import { fillOffer, fillMarks, savingProgress, fillStoppedWords, saveStateWords, recalcWords, monthLabel, setUpShareDecision } from '../services/MonthFill.js';
import { monthWordsOf, monthAfter } from '../services/PlanClosed.js';

/** Why a batch on a closed plan stopped: its last month (6.56.0). */
export const closedBatchWords = (ceiling) => 'this plan is closed after ' + monthWordsOf(ceiling) + ': record ' + monthWordsOf(monthAfter(ceiling)) + ' and later on the plan that carries it on.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The ids on the entry form this module reads and writes (index.html's Monthly Entry card). */
export const IDS = Object.freeze({
  form: 'decisionForm', month: 'entryMonth', paid: 'entryPaidThisMonth', cadence: 'entryCadence',
  save: 'saveBtn', progress: 'saveBtnProgress', note: 'saveStateNote',
  box: 'monthFillBox', tick: 'monthFillTick', label: 'monthFillLabel', help: 'monthFillHelp', from: 'monthFillFrom', fromRow: 'monthFillFromRow', more: 'monthFillMore',
  output: 'decisionOutput', error: 'decisionCalcError'
});

/**
 * @param {object} deps
 *   doc                 the document (window.document by default)
 *   getHistory()        the plan's records, any order (getHistoryAsync)
 *   getTaxYears()       the tax-year settings, keyed as taxYearOf names a year (getAllTaxYearsAsync): a month before its
 *                       year's set-up takes its share of that set-up's figures (MonthFill.setUpShares), and the chooser
 *                       reaches back to the earliest year set up; absent, every month is worked out afresh and the
 *                       chooser reaches back to the first record
 *   calc(date, equity, bond, cash)   the month worked out by the Decision tool's own calculation (index.html calcDecisionWithDeps)
 *   save(decision)      DecisionService.saveDecision — the one write path; a filled-in month carries fillMarks
 *   wizardNeeded(date)  → { showWizard }: whether the month's tax year still needs setting up (TaxYearSetupWizard.checkWizardNeeded)
 *   renderPanel(decision)   draws the recommendation panel (after a fill, this month is worked out again and redrawn)
 *   showToast(message, type, ms)
 *   addMonths(ym, k)    the shell's month arithmetic, for the batch as before
 *   taxYearOf(ym)       getTaxYearFromDate, for the batch's stop at a tax year not set up
 *   now()               the instant a filled-in record is marked with (new Date().toISOString() by default)
 *   planStart()         the first month of the plan the months can be filled in from (MonthFill.planFillStart: the plan's
 *                       first April, or the month work stopped when later), so a plan whose start is earlier than anything
 *                       recorded or set up — one whose start moved back to the tax year work stopped (6.53.0) — reaches its
 *                       lived months; absent, the chooser reaches back as it did
 *   planBounds()        { floor, ceiling }: the first and last months the plan may record (6.56.0, services/PlanClosed.js —
 *                       the plan that carries a closed one on, from its first month; a closed plan, to its last), so the
 *                       chooser offers nothing outside them and a batch stops at the last; absent, no bounds
 */
export function createMonthEntry(deps) {
  const doc = deps.doc || document;
  const el = (id) => doc.getElementById(id);
  const now = deps.now || (() => new Date().toISOString());
  let state = 'none';
  let offerNow = null;
  let fromChoice = null;   // the month picked in the "Start from" chooser; null until one is picked (the offer's own default then)

  /** The line under Calculate / Save, and the button with it. */
  function setState(next, o = {}) {
    state = next;
    const month = o.month || (el(IDS.month) && el(IDS.month).value) || '';
    const note = el(IDS.note); if (note) note.textContent = saveStateWords(next, { ...o, month });
    const btn = el(IDS.save); if (btn) btn.disabled = next !== 'calculated';
  }

  /** A failed Calculate: the engine's own words in the output panel, until the next Calculate replaces them. */
  function showError(dateStr, error) {
    const out = el(IDS.output);
    if (out) out.innerHTML = '<div class="card"><div class="alert alert-danger" role="alert" id="' + IDS.error + '"><strong>' + esc(monthLabel(dateStr) || 'This month') + ' could not be worked out.</strong> ' + esc(error && error.message ? error.message : error) + '</div></div>';
  }

  /** The first and last months the open plan may record (deps.planBounds; none without it): 6.56.0, services/PlanClosed.js. */
  async function boundsNow() {
    try { const b = deps.planBounds ? await deps.planBounds() : null; return { floor: (b && b.floor) || null, ceiling: (b && b.ceiling) || null }; } catch (e) { return { floor: null, ceiling: null }; }
  }

  /**
   * The offer for a month against the records and the tax-year settings now (null when no month is missed, or the records
   * cannot be read). Tax-year settings that cannot be read leave every missed month in; a plan with none yet has no year set up.
   */
  async function offerFor(month) {
    try {
      const [history, taxYears, planStart, bounds] = await Promise.all([deps.getHistory(), deps.getTaxYears ? deps.getTaxYears().then((t) => t || {}, () => null) : null, deps.planStart ? deps.planStart().catch(() => null) : null, boundsNow()]);
      return fillOffer(history, month || '', { taxYears, taxYearOf: deps.taxYearOf, from: fromChoice, planStart, floor: bounds.floor, ceiling: bounds.ceiling });
    } catch (e) { return null; }
  }

  /**
   * The offer against the records now: shown or hidden; the tick comes off whenever the offer goes, its months change, or
   * which of them take a share of a set-up's figures, or how much, changes (a Calculate that set a year up part-way): what
   * was ticked is always what the label and the help said at the time.
   * An offer with no month to fill now (only months not offered yet) shows its help alone, without the tick, so the reason is still on the page.
   * A closed offer (the default offers nothing, earlier months can be filled in) shows the quiet line that opens the chooser, and no tick.
   * The "Start from" chooser lists the months it can start from, and shows only when the offer is open and there is more than one.
   * Reads can overlap (the month box sends input and change together): only the latest one is drawn.
   */
  let reads = 0;
  async function refreshOffer() {
    const box = el(IDS.box), tick = el(IDS.tick), label = el(IDS.label), help = el(IDS.help);
    if (!box || !tick) return null;
    const read = ++reads;
    const offer = await offerFor(el(IDS.month) && el(IDS.month).value);
    if (read !== reads) return offerNow;
    const fillable = !!(offer && offer.months.length);
    const sig = (o) => o.months.join() + '|' + JSON.stringify(o.shares || {});   // the months, and each one's share of a set-up's figures
    if (!fillable || !offerNow || sig(offer) !== sig(offerNow)) tick.checked = false;
    offerNow = offer;
    box.style.display = offer ? '' : 'none';
    (tick.closest('label') || tick).style.display = fillable ? '' : 'none';
    if (label) label.textContent = offer ? offer.words : '';
    if (help) { help.textContent = offer ? offer.help : ''; help.style.display = offer && offer.help ? '' : 'none'; }
    const more = el(IDS.more); if (more) more.style.display = offer && offer.closed ? '' : 'none';
    const from = el(IDS.from), row = el(IDS.fromRow);
    if (from) {
      const choices = offer ? offer.choices : [];
      from.innerHTML = choices.map((m) => '<option value="' + esc(m) + '">' + esc(monthLabel(m)) + '</option>').join('');
      from.value = offer && offer.chosenFrom ? offer.chosenFrom : '';
      if (row) row.style.display = offer && !offer.closed && choices.length > 1 ? '' : 'none';
    }
    return offer;
  }

  /** The quiet line pressed: the chooser opens at its earliest month, the tick unticked, the label and the help with it. */
  async function openChooser() {
    const first = offerNow && offerNow.choices && offerNow.choices[0];
    if (!first) return offerNow;
    fromChoice = first;
    const offer = await refreshOffer();
    const from = el(IDS.from); if (from && typeof from.focus === 'function') from.focus();
    return offer;
  }

  /**
   * Anything typed or changed on the form after a Calculate means the panel no longer matches the boxes: Save goes off and
   * the line says so. The cadence picker redraws the panel itself, and the fill tick is an instruction to Save, not a figure.
   * Before anything is calculated the line follows the month in the box. Listened to in the capture phase, on input and
   * change alike, so a month set by script with an event that does not bubble (the Tax Years page's "Set up" sets it so)
   * is seen too. The month box, and the "already been made" tick that moves it on, read the offer again once the tick's own
   * handler has moved the month (the page's handlers run on the document, after the form's): hence the timer. The "Start from"
   * chooser is, like the tick, an instruction to Save: it widens or narrows the offer and leaves the calculation alone.
   */
  function watchForm() {
    const form = el(IDS.form); if (!form) return;
    const later = (f) => setTimeout(f, 0);
    const onEdit = (e) => {
      const id = e.target && e.target.id;
      if (id === IDS.from) { fromChoice = e.target.value || null; refreshOffer(); return; }
      if (id === IDS.cadence || id === IDS.tick) return;
      if (id === IDS.month || id === IDS.paid) later(refreshOffer);
      if (state === 'calculated' || state === 'saved' || state === 'stopped') setState('changed');
      else if (state === 'none' || state === 'failed') later(() => { if (state === 'none' || state === 'failed') setState('none'); });   // after a failed Calculate too: the line names the month now in the box (the alert stays until the next Calculate)
    };
    form.addEventListener('input', onEdit, true);
    form.addEventListener('change', onEdit, true);
    const more = el(IDS.more); if (more) more.addEventListener('click', (e) => { e.preventDefault(); openChooser(); });
  }

  /** After a Calculate that worked: Save on, the line blank; the offer read again (a tax year set up just now can leave months out). */
  function calculated(dateStr) { setState('calculated', { month: dateStr }); refreshOffer(); }
  /** After a Calculate that failed: the reason on the page, Save off, the line says so. */
  function failed(dateStr, error) { showError(dateStr, error); setState('failed', { month: dateStr }); }

  /**
   * Save: the fill first (with the tick on), then this month — or its batch. The spinner counts the records ("Saving 3 of 5…").
   * @returns {Promise<{ ok: boolean, decision: object }>}  ok false when a write failed (Save is on again when the panel
   *   still matches the boxes and the records; off, with the line saying why, when filled-in months went in before the
   *   failure and this month was not worked out again with them); decision: this month as saved — worked out again after
   *   a fill — or as given
   */
  async function save(decision) {
    const btn = el(IDS.save), progress = el(IDS.progress), tick = el(IDS.tick);
    const offer = tick && tick.checked ? await offerFor(decision.date) : null;
    const n = decision.cadenceMonths || 1;
    const total = (offer ? offer.months.length : 0) + n;
    let k = 0;
    const step = () => { if (progress && total > 1) progress.textContent = savingProgress(++k, total); };
    const { equity, bond, cash, entered } = decision;   // the figures this month was worked out on, and what was typed (paidAhead rides on the decision)
    if (btn) { btn.classList.add('loading'); btn.disabled = true; }
    let current = decision;
    const filled = [];
    try {
      let stopped = null;   // the month the fill stopped at (its tax year not set up)
      if (offer) {
        const on = now();
        for (const date of offer.months) {
          // A missed month in a tax year not set up stops the fill here, as the batch does; this month is then not recorded either.
          if ((await deps.wizardNeeded(date)).showWizard) { stopped = date; break; }
          step();
          let d = await deps.calc(date, equity, bond, cash); d.entered = entered;
          // a month before its tax year's set-up: its share of what the set-up was given as received, not the calculation's draw
          if (offer.shares && offer.shares[date]) d = setUpShareDecision(d, offer.shares[date]);
          // never paidAhead: a filled-in month is one that was missed, recorded afterwards with a later entry's figures, not a
          // month whose payment was made before its entry; the "already been made" tick belongs to the month in the box alone
          await deps.save({ ...d, ...fillMarks(on), paidAhead: false });
          filled.push(date);
        }
        // a tax year not set up after the months written: the fill stops before it, and this month is not recorded
        // either (the label counted only the months written, and the help said so before the tick)
        if (!stopped && offer.notSetUp && offer.months.length) stopped = offer.notSetUp.month;
      }
      if (stopped) {
        const words = fillStoppedWords(filled.length, decision.date, stopped, deps.taxYearOf ? deps.taxYearOf(stopped) : null);
        deps.showToast(words, 'warning', 8000);
        setState('stopped', { words });
        return { ok: true, decision: current };
      }
      let recalc = '';
      if (filled.length) {
        // this month again, now the months before it are on record; the panel is redrawn so what is shown is what is saved,
        // and what moved since the Calculate the person read is said in the line and the toast (recalcWords)
        current = await deps.calc(decision.date, equity, bond, cash); current.entered = entered; current.paidAhead = decision.paidAhead;
        recalc = recalcWords(decision, current);
        if (deps.renderPanel) deps.renderPanel(current);
      }
      let written = 0, through = current.date;
      if (n === 1) { step(); await deps.save(current); written = 1; }
      else {
        // A batch: the same recommendation for each month it covers, one record per month, stopping at a tax year that
        // has not been set up yet (its wizard sets its own figures).
        // A closed plan stops at its last month (6.56.0): the months after it are the plan's that carries it on.
        const ty0 = current.taxYear, { ceiling } = await boundsNow();
        for (let j = 0; j < n; j++) {
          const date = deps.addMonths(current.date, j);
          if (ceiling && String(date).slice(0, 7) > ceiling) { deps.showToast('Recorded ' + written + ' month' + (written === 1 ? '' : 's') + ' — ' + closedBatchWords(ceiling), 'warning', 6000); break; }
          if (deps.taxYearOf(date) !== ty0) { deps.showToast('Recorded ' + written + ' month' + (written === 1 ? '' : 's') + ' — the next tax year needs setting up first (enter its first month).', 'warning', 6000); break; }
          step();
          await deps.save({ ...current, date, month: date, paidAhead: j === 0 && !!current.paidAhead });   // the tick marks the batch's first record alone: the months after it have the record before them
          written++; through = date;
        }
      }
      // the success toast only when every month went in: a batch that stopped keeps its own warning on screen
      if (written === n) {
        const done = n === 1 ? (filled.length ? 'Saved, with ' + filled.length + ' month' + (filled.length === 1 ? '' : 's') + ' filled in' : 'Decision saved to history') : 'Batch saved — ' + n + ' months recorded';
        if (recalc) deps.showToast(done + '. ' + recalc, 'success', 10000); else deps.showToast(done, 'success');
      }
      setState('saved', { month: current.date, through, filled, recalc });
      fromChoice = null;   // the next entry starts from the default view again
      return { ok: true, decision: current };
    } catch (error) {
      console.error('Save error:', error);
      deps.showToast('Error saving: ' + (error && error.message ? error.message : error), 'error');
      // Filled-in months went in but this month's calculation did not see them (the write or the second working-out
      // failed): Save stays off until a Calculate works the month out again with them on record, or a retry would save
      // it on figures (tax to date, ISA used, protection) that ignore the records before it. Otherwise the panel still
      // matches the boxes and the records: Save on again.
      if (filled.length && current === decision) setState('interrupted', { month: decision.date, filled });
      else setState('calculated', { month: current.date });
      return { ok: false, decision: current };
    } finally {
      if (btn) btn.classList.remove('loading');
      if (progress) progress.textContent = 'Saving...';
    }
  }

  return { setState, showError, refreshOffer, openChooser, watchForm, calculated, failed, save, state: () => state, offer: () => offerNow };
}

/**
 * When a plan cannot be read (lead4.md D1): both views say the same plain words, and neither falls back to the settings as
 * stored or to the factory settings as if they were the person's. Pure.
 *
 *   READ_FAULT_WORDS              the words both views show
 *   PlanReadError                 what the full view's settings reader throws (code 'plan-read-fault')
 *   settingsOrFault(read)         runs a reading: { settings, fault } — on a throw, empty settings marked `readFault`
 */
export const READ_FAULT_WORDS = 'We could not read this plan’s figures just now, so none are shown. Reload the page to try again.';

export class PlanReadError extends Error {
  constructor(cause = null) {
    super(READ_FAULT_WORDS);
    this.name = 'PlanReadError';
    this.code = 'plan-read-fault';
    if (cause) this.cause = cause;
  }
}

export const isPlanReadError = (e) => !!e && e.code === 'plan-read-fault';

/** A reading of the settings, or, when it throws, nothing: an empty object that says so, never the stored or default copy. */
export function settingsOrFault(read) {
  try { return { settings: read(), fault: null }; }
  catch (e) { return { settings: { readFault: true }, fault: READ_FAULT_WORDS }; }
}

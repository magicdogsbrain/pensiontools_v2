/**
 * The key of a set of checked inputs (V7 build brief 4.5): a stable text of the inputs (sorted keys) + the date +
 * the app version. An answer carries the key of the inputs it was worked out from; a screen shows a figure as
 * current only while that key matches what is typed now.
 *
 * It does NOT include the number of futures: the first pass (100) and the final pass (1,000) share a key.
 * Pure.
 */

/** A value as text, the same whatever order its keys were written in. Entries that are undefined are left out. */
export function stableText(v) {
  if (v === undefined) return 'null';
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableText).join(',') + ']';
  return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stableText(v[k])).join(',') + '}';
}

/**
 * @param {object} inputs   checked inputs (brief 4.1)
 * @param {{ today: string, appVersion: string }} env
 * @returns {string}
 */
export function inputsKey(inputs, env) {
  return `${stableText(inputs)}|${env.today}|${env.appVersion}`;
}

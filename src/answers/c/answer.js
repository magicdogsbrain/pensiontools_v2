/**
 * STUB (V7 package 1) — replaced by package 2's real function at joining up.
 *
 * Checks the inputs, then returns the hand-made answer in tests/v7/stubs/c-result.json (the figures of worked
 * example 1: careful £1,380, middling £1,590, run-out age 76; `good` is made up) with `inputs` and the `basis`
 * fields that come from `env` filled in. The figures do NOT follow the inputs — only the shape is real.
 * Every sentence's text is rebuilt from its parts, so text === parts joined still holds for any inputs.
 *
 * Pure. Same inputs and env → the same result. Never throws for a bad value: returns status 'invalid'.
 * @param {object} inputs  checked inputs (brief 4.1). Unchecked inputs are checked here again.
 * @param {import('../shared/contract.js').Env} env
 * @returns {import('../shared/contract.js').AnswerC}
 */
import { SCHEMA_C } from './schema.js';
import { checkInputs } from '../shared/validate.js';
import { partsText, money } from '../shared/format.js';
import { VERSION } from '../../constants.js';
import STUB from '../../../tests/v7/stubs/c-result.json' with { type: 'json' };

export function answerC(inputs, env) {
  const problems = [];
  if (!env || typeof env.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(env.today)) problems.push({ field: 'env.today', messageId: 'required' });
  if (!env || !Number.isInteger(env.futures) || env.futures < 1) problems.push({ field: 'env.futures', messageId: 'required' });
  if (problems.length) return { status: 'invalid', problems };

  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) {
    return { status: 'invalid', problems: Object.entries(checked.errors).map(([field, messageId]) => ({ field, messageId })) };
  }

  const result = JSON.parse(JSON.stringify(STUB));
  result.inputs = checked.inputs;
  result.basis.today = env.today;
  result.basis.start = env.today.slice(0, 7);
  result.basis.futures = env.futures;
  result.basis.failuresAllowed = Math.floor(env.futures / 10);
  result.basis.seed = env.seed ?? 0;
  result.basis.engineVersion = VERSION;

  const futuresLine = result.assumed.find((a) => a.id === 'futures');
  if (futuresLine) {
    futuresLine.value = env.futures;
    futuresLine.parts = ['Tested against ', { fixed: money(env.futures).slice(1) }, ' possible futures built from market history since ', { fixed: '1871' }, '.'];
  }
  const retext = (s) => { s.text = partsText(s.parts, result); };
  for (const s of Object.values(result.sentences)) (Array.isArray(s) ? s : [s]).forEach(retext);
  result.assumed.forEach(retext);
  result.warnings.forEach(retext);

  if (typeof env.onProgress === 'function') env.onProgress(env.futures, env.futures);
  return result;
}

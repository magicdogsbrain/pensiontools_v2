/**
 * Deep-copies a value dropping anything structured-clone cannot carry across a Worker boundary
 * (functions, DOM nodes). Typed arrays, plain objects and arrays pass through as copies.
 */
export function cloneSafe(v, depth = 0) {
  if (v == null || typeof v !== 'object') return typeof v === 'function' ? undefined : v;
  if (depth > 40) return undefined;
  if (ArrayBuffer.isView(v)) return v;
  if (Array.isArray(v)) return v.map((x) => cloneSafe(x, depth + 1));
  const out = {};
  for (const k of Object.keys(v)) {
    const c = cloneSafe(v[k], depth + 1);
    if (c !== undefined) out[k] = c;
  }
  return out;
}

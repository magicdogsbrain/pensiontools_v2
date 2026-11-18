/**
 * The field table (lead4.md R3): one entry per box a person can type into, bound in both views by `data-field="<id>"`
 * (src/reading/mark.js fieldAttr). Each entry: { id, read(plan), patch(plan, value), check(value, plan), lock }.
 *
 * Empty until the step that builds one writer per box (lead4.md section 4, step W). The parity sweep counts and compares
 * only the boxes whose id is in this table ("fields bound"): the simple view's form wrappers carry `data-field` with their
 * own schema paths today, and those are not bound to the plan through this table.
 */
export const FIELDS = Object.freeze([]);

/** The ids of the bound fields. */
export const FIELD_IDS = Object.freeze(FIELDS.map((f) => f.id));

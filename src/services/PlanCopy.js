/**
 * A copy of a plan — the planner's duplicateScenario rules, lifted pure (research/v7/road-to-7.md step 11: "Your plans"
 * makes the copy itself, through V7's one create). The planner's ScenarioRepository.duplicateScenario is re-pointed at
 * this, so both apps make the same copy from the same plan.
 *
 *   copyOf(plan, name, { carryHistory, now }) → the plan document to create
 *     - the stored id and stamps left off (the store gives new ones); the name as given; never the open plan (isActive false);
 *     - the record of what is held travels with it (the copy is the same person), normalised to today's shape;
 *     - the copy starts as a draft: not locked, no plan of record, no plan document, no archives (the copy writes its own
 *       when it locks); without the records (`carryHistory: false`) the monthly history is emptied;
 *     - with records carried (a recorded month, or a tax year set up) the copy is depended on from the moment it exists:
 *       locked, dated `now`, lockedBy 'copied with records';
 *     - an UNLOCKED copy of a plan with no charges setting gets the original's effective charge written (0 for a plan
 *       locked before charges existed: 6.19.0 D7), and a plan with no "how the ISA grows" setting starts "Mostly cash"
 *       (6.22.0 D3); a locked copy is left as the original was;
 *     - a copy is the person's own plan: the example plan's read-only flag is never carried (the planner's Duplicate of
 *       the example used to make another read-only example — a correction in 6.44.0's note), and its description goes.
 *
 * Pure: no storage, no clock of its own (`now` comes in), the source never changed.
 */
import { normaliseHoldings } from './HoldingsRecord.js';
import { isChargesPct, chargesPctOf } from './Charges.js';
import { DEFAULT_ISA_GROWTH, isIsaGrowth } from './IsaGrowth.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

/** Does the plan carry records: a recorded month, or a tax year set up? */
export function hasRecords(plan) {
  const d = plan && plan.decisionTool;
  if (!isObj(d)) return false;
  return (Array.isArray(d.history) && d.history.length > 0) || Object.values(isObj(d.taxYears) ? d.taxYears : {}).some((t) => t && t.yearSetupComplete);
}

/**
 * @param {object} source   the plan as read (normalised and upgraded)
 * @param {string} name     the copy's name (made unique by the caller)
 * @param {{ carryHistory?: boolean, now?: Date }} [o]
 * @returns {object} the plan document to create (no id, no createdAt, no lastModified)
 */
export function copyOf(source, name, { carryHistory = true, now = new Date() } = {}) {
  const { id, createdAt, lastModified, ...data } = JSON.parse(JSON.stringify(source));
  void id; void createdAt; void lastModified;
  const wasExample = data.example === true;
  delete data.example;
  data.planDetails = { ...(isObj(data.planDetails) ? data.planDetails : {}), name, ...(wasExample ? { description: '' } : {}) };
  data.isActive = false;
  if (data.holdings) data.holdings = normaliseHoldings(data.holdings);
  if (isObj(data.decisionTool)) {
    data.decisionTool = { ...data.decisionTool };
    data.decisionTool.settings = { ...(isObj(data.decisionTool.settings) ? data.decisionTool.settings : {}), locked: false };
    delete data.decisionTool.settings.lockedAt; delete data.decisionTool.settings.lockedBy;
    delete data.decisionTool.planOfRecord; delete data.decisionTool.planOfRecordArchive;
    delete data.planDocument; delete data.planDocumentArchive;
    if (!carryHistory) data.decisionTool.history = [];
    if (hasRecords(data)) {
      data.decisionTool.settings.locked = true;
      data.decisionTool.settings.lockedAt = now.toISOString();
      data.decisionTool.settings.lockedBy = 'copied with records';
    }
  }
  const copySt = isObj(data.stressTool) && isObj(data.stressTool.settings) ? data.stressTool.settings : null;
  if (copySt && !isLocked(data)) {
    const patch = { ...(isChargesPct(copySt.chargesPct) ? {} : { chargesPct: chargesPctOf(copySt) }), ...(isIsaGrowth(copySt.isaGrowth) ? {} : { isaGrowth: DEFAULT_ISA_GROWTH }) };
    if (Object.keys(patch).length) data.stressTool = { ...data.stressTool, settings: { ...copySt, ...patch } };
  }
  return data;
}

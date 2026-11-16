/**
 * The phone's "More" sheet: the tabs that do not fit the bottom bar (Budget, Stress, Strategies, Decide). Moved out of
 * index.html's openMobileMore in 6.20.2, when Transition — what you hold, and the move into the plan — got its place:
 * until then a phone could not reach it at all (research/v7/square-one-audit.md §1).
 */

/** The tabs the More sheet holds: the bottom bar's More button lights up while one of them is open. */
export const MORE_TABS = Object.freeze(['accumulation', 'transition', 'household']);

/**
 * @param {{ version: string, householdVisible: boolean, accumulationVisible?: boolean, transitionName?: string|null }} o  the
 *   app's version; whether the Household tab is shown; whether the Accumulation tab is shown (the stage hides it from
 *   someone retired, on the desktop and here alike); the Transition tab's name now (7.11.1)
 * @returns {string} the sheet's buttons
 */
export function moreSheetHtml({ version, householdVisible, accumulationVisible = true, transitionName = null }) {
  return '<button type="button" data-on-click="closeMobileSheet(); openWhatsNew();">&#127381; What\'s new (v' + version + ')</button>'
    + (accumulationVisible ? '<button type="button" data-on-click="mobileGo(\'accumulation\')">&#128176; Accumulation planner</button>' : '')
    // living on the plan (7.11.1, keepHoldingsUi.transitionTabName): the tab by its name then, never "the move"
    + '<button type="button" data-on-click="mobileGo(\'transition\')">&#128260; ' + (transitionName && transitionName !== 'Transition' ? transitionName + ': what you hold' : 'Transition: what you hold, and the move') + '</button>'
    + (householdVisible ? '<button type="button" data-on-click="mobileGo(\'household\')">&#128106; Household (couples)</button>' : '')
    + '<button type="button" data-on-click="closeMobileSheet(); switchToTab(\'strategies\'); setTimeout(() => showStrategyPage(\'assumptions\'), 300);">&#128203; Assumptions &amp; data</button>';
}

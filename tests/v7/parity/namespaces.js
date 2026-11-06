/**
 * The namespaces of the parity ledger's key names ('<namespace>.<key>'), and where each lives. Pure data: the ledger's
 * checks (check.js) and the harvest (harvest.js) share it.
 */
export const NAMESPACES = Object.freeze({
  plan: 'the plan document itself (its top-level fields)',
  planDetails: 'planDetails: the plan\'s name and description',
  stress: 'stressTool.settings: the Stress tester (Drawdown Planner) settings',
  decision: 'decisionTool.settings: the Decision tool (Month by month) settings',
  taxYear: 'decisionTool.taxYears[year]: one tax year\'s set-up',
  budget: 'budgetTool.settings: the Budget',
  accumulation: 'accumulationTool.settings (and .history): the Accumulation planner',
  holdings: 'holdings: what you hold (the one ledger)',
  household: 'household: the partner\'s plan link',
  strategy: 'strategy: the plan\'s strategy block',
  strategyState: 'stressTool.settings.strategyState[id]: one strategy\'s put-away inputs',
  strategyParams: 'stressTool.settings.strategyParams: the active strategy\'s dials, by strategy',
  strategies: 'the nine strategies a plan can run (one key per strategy)',
  incomeSteps: 'stressTool.settings.incomeSteps[]: one step of the income shape',
  extraIncomes: 'stressTool.settings.extraIncomes[]: income for some years',
  windfalls: 'stressTool.settings.windfalls[]: a one-off lump sum',
  extraWithdrawals: 'stressTool.settings.extraWithdrawals[]: an extra spend',
  taggedFunds: 'stressTool.settings.taggedFunds[]: one fund on the "funds to test" list',
  potAtRetirement: 'stressTool.settings.potAtRetirement: the pots at the stop, typed in',
  profile: 'users/{uid}/profile/settings: per-person preferences',
  browser: 'the browser\'s own storage (this device only)'
});

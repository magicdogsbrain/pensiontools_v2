/** Fictional Sam (7.12.0, the moving brief): a hand-built ladder document and a pension record. No real person's figures. */
export const SAM_TODAY = new Date(2026, 10, 16, 12);

export const samDoc = (over = {}) => ({
  timing: { firstTaxYear: 2027, startMonth: '2027-10' },
  strategy: { id: 'gilt-ladder', contract: true, params: { spareGrowth: true }, r: { affordable: true, plan: {
    firstTaxYear: 2027,
    cashYears: [{ Y: 2027, cost: 26000 }, { Y: 2028, cost: 26400 }],
    years: [
      { Y: 2027, need: 26000, cost: 26000, from: 'cash' }, { Y: 2028, need: 26000, cost: 26400, from: 'cash' },
      { Y: 2029, need: 26000, from: 'TA30' }, { Y: 2030, need: 26000, from: 'TB31' }
    ],
    orders: [
      { name: 'Fictional Linker 2029', tidm: 'TA30', nominal: 40000, cost: 60000, pays: 60000, taxYears: [2029] },
      { name: 'Fictional Linker 2030', tidm: 'TB31', nominal: 20000, cost: 30000, pays: 30000, taxYears: [2030] }
    ] } } },
  pots: { sipp: 500000, isa: 0, isaPolicy: 'draw' },
  ...over
});
export const samLines = () => ([
  { wrapper: 'SIPP', ticker: 'WSHR', name: 'World share fund', value: 300000, subClass: 'globalEquity' },
  { wrapper: 'SIPP', ticker: 'BNDF', name: 'Bond fund', value: 90000, subClass: 'globalBonds' },
  { wrapper: 'SIPP', ticker: 'TA30', name: 'Fictional Linker 2029', kind: 'gilt', units: 10000, value: 15000 },
  { wrapper: 'SIPP', ticker: 'CSH2', name: 'Cash fund', value: 25000 },
  { wrapper: 'SIPP', ticker: 'TG28', name: '1 5/8% Treasury Gilt 2028', kind: 'gilt', value: 20000 }
]);

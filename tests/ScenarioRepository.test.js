
describe('seedDecisionFromStress carries the strategy (audit D1)', () => {
  it('copies strategyId, params and the income shape into Decision settings', async () => {
    const { seedDecisionFromStress } = await import('../src/storage/ScenarioRepository.js');
    const out = seedDecisionFromStress({
      equityMin: 1000, bondMin: 0, cashTarget: 0, duration: 34, baseSalary: 80000,
      strategyId: 'full-il-gilt', strategyParams: { cashYears: 3, bridgeCash: 35000 },
      incomeShape: 'phases', incomeSteps: [{ fromAge: 57, amount: 80000 }], shapeAgeNow: 57, firstTaxYear: 2027
    }, {});
    expect(out.strategyId).toBe('full-il-gilt');
    expect(out.strategyParams.cashYears).toBe(3);
    expect(out.incomeSteps[0].amount).toBe(80000);
    expect(out.shapeAgeNow).toBe(57);
    expect(out.firstTaxYear).toBe(2027);
  });

  it('defaults to pots-and-valves when the plan has no strategy', async () => {
    const { seedDecisionFromStress } = await import('../src/storage/ScenarioRepository.js');
    expect(seedDecisionFromStress({ equityMin: 1 }, {}).strategyId).toBe('pots-and-valves');
  });
});


describe('seedDecisionFromStress carries the strategy (audit D1)', () => {
  it('copies strategyId, params and the income shape into Decision settings', async () => {
    const { seedDecisionFromStress } = await import('../src/storage/ScenarioRepository.js');
    const out = seedDecisionFromStress({
      equityMin: 1000, bondMin: 0, cashTarget: 0, duration: 30, baseSalary: 44000,
      strategyId: 'full-il-gilt', strategyParams: { cashYears: 2, bridgeCash: 15000 },
      incomeShape: 'phases', incomeSteps: [{ fromAge: 63, amount: 44000 }], shapeAgeNow: 63, firstTaxYear: 2029
    }, {});
    expect(out.strategyId).toBe('full-il-gilt');
    expect(out.strategyParams.cashYears).toBe(2);
    expect(out.incomeSteps[0].amount).toBe(44000);
    expect(out.shapeAgeNow).toBe(63);
    expect(out.firstTaxYear).toBe(2029);
  });

  it('defaults to pots-and-valves when the plan has no strategy', async () => {
    const { seedDecisionFromStress } = await import('../src/storage/ScenarioRepository.js');
    expect(seedDecisionFromStress({ equityMin: 1 }, {}).strategyId).toBe('pots-and-valves');
  });
});

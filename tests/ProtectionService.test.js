/**
 * Protection Service Tests
 *
 * Tests market downturn protection mode:
 * - Entry conditions (growth below minimums + consecutive cash draws)
 * - Exit conditions (recovery buffer achieved)
 * - Withdrawal source determination
 * - Rebalancing recommendations
 */

import { describe, it, expect } from 'vitest';
import {
  checkProtectionStatus,
  determineWithdrawalSource,
  recommendRebalancing
} from '../src/services/ProtectionService.js';

describe('ProtectionService', () => {
  describe('checkProtectionStatus', () => {
    const baseParams = {
      equity: 300000,
      bond: 200000,
      cash: 50000,
      adjEquityMin: 250000,
      adjBondMin: 200000,
      adjCashTarget: 50000,
      priorHistory: [],
      consecutiveLimit: 3,
      recoveryBuffer: 50000
    };

    it('should return healthy status when growth above minimums', () => {
      const result = checkProtectionStatus(baseParams);

      expect(result.inProtection).toBe(false);
      expect(result.reason).toContain('healthy');
      expect(result.growthSurplus).toBe(50000); // 500k - 450k
    });

    it('should NOT enter protection with growth below minimum but insufficient consecutive draws', () => {
      const params = {
        ...baseParams,
        equity: 200000,  // Below minimum
        bond: 150000,
        priorHistory: [
          { source: 'Cash' }  // Only 1 consecutive (this + 1 = 2, < limit of 3)
        ]
      };

      const result = checkProtectionStatus(params);

      expect(result.inProtection).toBe(false);
      expect(result.consecutiveCashDraws).toBe(1);
    });

    it('should enter protection when growth below minimum AND consecutive limit reached', () => {
      const params = {
        ...baseParams,
        equity: 200000,  // Below minimum
        bond: 150000,
        priorHistory: [
          { source: 'Cash' },
          { source: 'Cash' },
          { source: 'Cash' }  // 3 consecutive, this is next draw
        ]
      };

      const result = checkProtectionStatus(params);

      // 3 prior cash draws + this would be 4th
      expect(result.inProtection).toBe(true);
      expect(result.reason).toContain('protection');
    });

    it('should continue protection until recovery buffer achieved', () => {
      const params = {
        ...baseParams,
        equity: 270000,  // Recovered above min but below buffer
        bond: 200000,
        priorHistory: [
          { source: 'Cash', inProtection: true }  // Was in protection
        ],
        recoveryBuffer: 50000
      };

      const result = checkProtectionStatus(params);

      // Need 450k + 50k = 500k to exit, have 470k
      expect(result.inProtection).toBe(true);
      expect(result.amountToRecover).toBe(30000);
    });

    it('should exit protection when recovery buffer achieved', () => {
      const params = {
        ...baseParams,
        equity: 300000,  // Fully recovered + buffer
        bond: 250000,
        priorHistory: [
          { source: 'Cash', inProtection: true }
        ],
        recoveryBuffer: 50000
      };

      const result = checkProtectionStatus(params);

      // Have 550k, need 500k (450k + 50k buffer)
      expect(result.inProtection).toBe(false);
      expect(result.canExitProtection).toBe(true);
    });

    it('should respect disableProtection flag', () => {
      const params = {
        ...baseParams,
        equity: 100000,  // Severely below minimum
        bond: 100000,
        priorHistory: [
          { source: 'Cash' },
          { source: 'Cash' },
          { source: 'Cash' }
        ],
        disableProtection: true
      };

      const result = checkProtectionStatus(params);

      expect(result.inProtection).toBe(false);
      expect(result.reason).toContain('disabled');
    });

    it('should break consecutive count on non-cash draw', () => {
      const params = {
        ...baseParams,
        equity: 200000,
        bond: 150000,
        priorHistory: [
          { source: 'Cash' },
          { source: 'Cash' },
          { source: 'Growth' },  // Break the streak
          { source: 'Cash' }
        ]
      };

      const result = checkProtectionStatus(params);

      expect(result.consecutiveCashDraws).toBe(1);
    });
  });

  describe('determineWithdrawalSource', () => {
    const baseParams = {
      drawAmount: 2000,
      equity: 300000,
      bond: 200000,
      cash: 50000,
      adjEquityMin: 250000,
      adjBondMin: 150000,
      adjCashTarget: 40000
    };

    it('should draw from growth proportionally when in surplus', () => {
      const params = {
        ...baseParams,
        inProtection: false
      };

      const result = determineWithdrawalSource(params);

      expect(result.source).toBe('Growth');
      // Equity surplus = 50000, Bond surplus = 50000
      // Should be 50/50 split
      expect(result.fromEquity).toBe(1000);
      expect(result.fromBond).toBe(1000);
      expect(result.fromCash).toBe(0);
      expect(result.shortfall).toBe(0);
    });

    it('should draw proportionally based on unequal surpluses', () => {
      const params = {
        ...baseParams,
        adjEquityMin: 220000,  // Equity surplus = 80000
        adjBondMin: 180000,    // Bond surplus = 20000
        inProtection: false
      };

      const result = determineWithdrawalSource(params);

      // 80000 / 100000 = 80% from equity
      expect(result.fromEquity).toBe(1600);
      expect(result.fromBond).toBe(400);
    });

    it('should draw from cash when in protection mode', () => {
      const params = {
        ...baseParams,
        inProtection: true
      };

      const result = determineWithdrawalSource(params);

      expect(result.source).toBe('Cash');
      expect(result.fromEquity).toBe(0);
      expect(result.fromBond).toBe(0);
      expect(result.fromCash).toBe(2000);
    });

    it('should use mixed source when growth surplus insufficient', () => {
      const params = {
        ...baseParams,
        drawAmount: 5000,
        adjEquityMin: 299000,  // Equity surplus = 1000
        adjBondMin: 199000,    // Bond surplus = 1000
        inProtection: false
      };

      const result = determineWithdrawalSource(params);

      expect(result.source).toBe('Mixed');
      expect(result.fromEquity).toBe(1000);
      expect(result.fromBond).toBe(1000);
      expect(result.fromCash).toBeGreaterThan(0);
    });

    it('should calculate shortfall when funds insufficient', () => {
      const params = {
        ...baseParams,
        drawAmount: 100000,  // More than available
        equity: 50000,
        bond: 30000,
        cash: 10000,
        adjEquityMin: 50000,
        adjBondMin: 30000,
        inProtection: true
      };

      const result = determineWithdrawalSource(params);

      expect(result.shortfall).toBe(90000); // 100k - 10k cash
    });
  });

  describe('recommendRebalancing', () => {
    it('should recommend topping up cash when below target', () => {
      const params = {
        equity: 300000,
        bond: 200000,
        cash: 30000,  // Below target
        adjEquityMin: 250000,
        adjBondMin: 200000,
        adjCashTarget: 50000,
        inProtection: false
      };

      const actions = recommendRebalancing(params);

      expect(actions).toHaveLength(1);
      expect(actions[0].action).toContain('Top up cash');
      expect(actions[0].amount).toBe(20000);
      expect(actions[0].priority).toBe('high');
    });

    it('should recommend investing excess cash', () => {
      const params = {
        equity: 300000,
        bond: 200000,
        cash: 100000,  // Well above target
        adjEquityMin: 250000,
        adjBondMin: 200000,
        adjCashTarget: 50000,
        inProtection: false
      };

      const actions = recommendRebalancing(params);

      const cashAction = actions.find(a => a.action.includes('excess cash'));
      expect(cashAction).toBeDefined();
      expect(cashAction.priority).toBe('low');
    });

    it('should recommend equity/bond rebalancing when significantly off target', () => {
      const params = {
        equity: 400000,  // 80% of growth
        bond: 100000,    // 20% of growth
        cash: 50000,
        adjEquityMin: 200000,  // Target 67%
        adjBondMin: 100000,    // Target 33%
        adjCashTarget: 50000,
        inProtection: false
      };

      const actions = recommendRebalancing(params);

      const rebalanceAction = actions.find(a => a.action.includes('rebalancing'));
      expect(rebalanceAction).toBeDefined();
    });

    it('should NOT recommend rebalancing when in protection', () => {
      const params = {
        equity: 400000,
        bond: 100000,
        cash: 50000,
        adjEquityMin: 200000,
        adjBondMin: 100000,
        adjCashTarget: 50000,
        inProtection: true  // In protection
      };

      const actions = recommendRebalancing(params);

      const rebalanceAction = actions.find(a => a.action.includes('rebalancing'));
      expect(rebalanceAction).toBeUndefined();
    });

    it('should return empty array when everything balanced', () => {
      const params = {
        equity: 260000,
        bond: 210000,
        cash: 55000,
        adjEquityMin: 250000,
        adjBondMin: 200000,
        adjCashTarget: 50000,
        inProtection: false
      };

      const actions = recommendRebalancing(params);

      // Small surplus, balanced - should have no urgent actions
      const highPriority = actions.filter(a => a.priority === 'high');
      expect(highPriority).toHaveLength(0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  giltYieldLevel, realYieldLevel, subAssetReturn, bondBucketReturn,
  goldReturn, trendReturn, diversifierBucketReturn,
  updateTrendMomentum, trendSignalFromMomentum,
  commoditiesReturn
} from '../src/services/SubAssetReturns.js';
import { tagPortfolio } from '../src/services/PortfolioTagger.js';
import { SUB_ASSET_PROFILES } from '../src/services/SubAssetModel.js';
import { marketRegime, subAssetEquityRho } from '../src/services/SubAssetReturns.js';
import { runMonteCarlo } from '../src/services/SimulationEngine.js';
import { createSimulationConfig } from '../src/models/SimulationConfig.js';
import { seededRng, gaussianRandom } from '../src/utils/MathUtils.js';

// A deterministic RNG that ZEROES the idiosyncratic Box–Muller draw (u2=0.25 → cos(π/2)=0),
// so these tests exercise the DRIVER decomposition with no noise.
const flatRng = () => 0.25;

const NORMAL = { inf: 0.025, prevInf: 0.025, eqReturn: 0.10, prevEqReturn: 0.10 };
// 2022-style: high inflation + falling equities. Inflation jumps from 2.5% to 9%.
const Y2022 = { inf: 0.09, prevInf: 0.025, eqReturn: -0.088, prevEqReturn: 0.10 };
// 2008/2020-style: equity crash, LOW inflation (flight-to-quality / rate cuts).
const CRASH = { inf: 0.02, prevInf: 0.025, eqReturn: -0.34, prevEqReturn: 0.10 };

describe('gilt-yield path (derived from inflation)', () => {
  it('nominal yield ≈ 4.5% at ~2.5% inflation (current regime)', () => {
    expect(giltYieldLevel(0.025)).toBeCloseTo(0.046, 2);
  });

  it('yield RISES with inflation', () => {
    expect(giltYieldLevel(0.09)).toBeGreaterThan(giltYieldLevel(0.025));
  });

  it('a low-inflation equity crash CUTS the yield (flight-to-quality); a high-inflation crash does not', () => {
    expect(giltYieldLevel(0.02, -0.34)).toBeLessThan(giltYieldLevel(0.02, 0.10)); // rate cut fires
    expect(giltYieldLevel(0.09, -0.34)).toBeCloseTo(giltYieldLevel(0.09, 0.10), 6); // 2022: no cut
  });
});

describe('bond-family sub-classes in the 2022 inflation spike', () => {
  const longGilts = SUB_ASSET_PROFILES.longGilts;
  const shortGilts = SUB_ASSET_PROFILES.shortGilts;

  it('LONG gilts crash (large negative) — duration × the yield spike', () => {
    const r = subAssetReturn(longGilts, Y2022, flatRng);
    expect(r).toBeLessThan(-0.20);       // deep drawdown
    expect(r).toBeGreaterThan(-0.60);    // but bounded / realistic
  });

  it('SHORT gilts barely move — low duration absorbs the same yield spike', () => {
    const r = subAssetReturn(shortGilts, Y2022, flatRng);
    expect(Math.abs(r)).toBeLessThan(0.08);
  });

  it('short gilts are FAR more stable than long gilts in 2022', () => {
    const rShort = subAssetReturn(shortGilts, Y2022, flatRng);
    const rLong = subAssetReturn(longGilts, Y2022, flatRng);
    expect(rShort).toBeGreaterThan(rLong + 0.15);
  });
});

describe('flight-to-quality: gilts RALLY in a low-inflation equity crash', () => {
  it('long gilts post a POSITIVE return when equities crash with low inflation', () => {
    const r = subAssetReturn(SUB_ASSET_PROFILES.longGilts, CRASH, flatRng);
    expect(r).toBeGreaterThan(0.05);     // rate-cut driven capital gain on top of carry
  });

  it('the SAME asset crashes in 2022 but rallies in 2008 — regime-dependent, not hard-coded', () => {
    const r2022 = subAssetReturn(SUB_ASSET_PROFILES.longGilts, Y2022, flatRng);
    const r2008 = subAssetReturn(SUB_ASSET_PROFILES.longGilts, CRASH, flatRng);
    expect(r2008).toBeGreaterThan(r2022 + 0.30);
  });
});

describe('index-linked gilts', () => {
  it('accrete inflation but still fall in 2022 (real yields spiked) — fell hardest is allowed', () => {
    const linker = subAssetReturn(SUB_ASSET_PROFILES.indexLinked, Y2022, flatRng);
    const nominalLong = subAssetReturn(SUB_ASSET_PROFILES.longGilts, Y2022, flatRng);
    // linker gets +inflation accretion, so it is NOT more negative than the nominal long gilt
    expect(linker).toBeGreaterThan(nominalLong);
  });

  it('protect in steady moderate inflation (positive nominal return)', () => {
    const linker = subAssetReturn(SUB_ASSET_PROFILES.indexLinked, { inf: 0.04, prevInf: 0.04, eqReturn: 0.08, prevEqReturn: 0.08 }, flatRng);
    expect(linker).toBeGreaterThan(0);
  });
});

describe('corporate IG credit co-moves with equities', () => {
  it('worse in an equity selloff than in a rally (spread widens as equities fall)', () => {
    // Use a moderate selloff (above the crash rate-cut threshold) to isolate the credit mechanic
    // from the flight-to-quality rate rally that also lifts nominal bonds.
    const sell = subAssetReturn(SUB_ASSET_PROFILES.corporateIG, { inf: 0.025, prevInf: 0.025, eqReturn: -0.12, prevEqReturn: 0.10 }, flatRng);
    const rally = subAssetReturn(SUB_ASSET_PROFILES.corporateIG, { inf: 0.025, prevInf: 0.025, eqReturn: 0.25, prevEqReturn: 0.10 }, flatRng);
    expect(sell).toBeLessThan(rally);
  });
});

describe('bondBucketReturn (weighted blend)', () => {
  it('normal year: sensible positive carry-driven return', () => {
    const r = bondBucketReturn(NORMAL, flatRng);
    expect(r).toBeGreaterThan(0.02);
    expect(r).toBeLessThan(0.08);
  });

  it('is less negative in 2022 than a 100% long-gilt sleeve (the short-gilt buffer helps)', () => {
    const blend = bondBucketReturn(Y2022, flatRng);
    const allLong = bondBucketReturn(Y2022, flatRng, { longGilts: 1.0 });
    expect(blend).toBeGreaterThan(allLong);
  });

  it('respects custom weights', () => {
    const buffer = bondBucketReturn(Y2022, flatRng, { shortGilts: 1.0 });
    const duration = bondBucketReturn(Y2022, flatRng, { longGilts: 1.0 });
    expect(buffer).toBeGreaterThan(duration);
  });
});

describe('gold (diversifier)', () => {
  it('a modest positive drift in a normal year', () => {
    const r = goldReturn(NORMAL, flatRng);
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(0.05);
  });

  it('RISES in an equity crash (flight to safety) — well above a normal year', () => {
    const crash = goldReturn(CRASH, flatRng);
    expect(crash).toBeGreaterThan(goldReturn(NORMAL, flatRng) + 0.04);
  });

  it('partial inflation hedge — higher in a high-inflation year', () => {
    const hi = goldReturn({ inf: 0.09, eqReturn: 0.10 }, flatRng);
    expect(hi).toBeGreaterThan(goldReturn(NORMAL, flatRng));
  });
});

describe('trend / macro (path-dependent)', () => {
  it('PROFITS when a downtrend persists (short position + continued fall)', () => {
    const shortPos = -1; // built up from a prior falling market
    const r = trendReturn({ eqReturn: -0.20 }, flatRng, shortPos);
    expect(r).toBeGreaterThan(0.05);
  });

  it('is WHIPSAWED on a sharp reversal (short position + V-shaped rebound = loss)', () => {
    const shortPos = -1; // still short after last year's crash
    const r = trendReturn({ eqReturn: 0.30 }, flatRng, shortPos);
    expect(r).toBeLessThan(0);
  });

  it('rides a sustained uptrend (long position + rising market)', () => {
    const longPos = 1;
    const r = trendReturn({ eqReturn: 0.20 }, flatRng, longPos);
    expect(r).toBeGreaterThan(0.05);
  });

  it('the momentum state goes short after a run of falling years', () => {
    let mom = 0;
    for (let i = 0; i < 4; i++) mom = updateTrendMomentum(mom, -0.15);
    expect(trendSignalFromMomentum(mom)).toBeLessThan(-0.5);
  });
});

describe('regime-aware correlation (generalising equityBondRho)', () => {
  it('classifies the three regimes', () => {
    expect(marketRegime({ inf: 0.09, eqReturn: -0.05 })).toBe('inflation'); // inflation dominates
    expect(marketRegime({ inf: 0.02, eqReturn: -0.34 })).toBe('crash');     // low-inflation crash
    expect(marketRegime({ inf: 0.025, eqReturn: 0.10 })).toBe('normal');
  });

  it('gilts flip from POSITIVE correlation in an inflation shock to NEGATIVE in a crash', () => {
    expect(subAssetEquityRho('longGilts', { inf: 0.09, eqReturn: -0.05 })).toBeGreaterThan(0);
    expect(subAssetEquityRho('longGilts', { inf: 0.02, eqReturn: -0.34 })).toBeLessThan(0);
  });

  it('corporate credit stays POSITIVE (blows out with equities) even in a crash; gold ~0', () => {
    expect(subAssetEquityRho('corporateIG', { inf: 0.02, eqReturn: -0.34 })).toBeGreaterThan(0.3);
    expect(Math.abs(subAssetEquityRho('gold', { inf: 0.025, eqReturn: 0.10 }))).toBeLessThan(0.1);
  });

  // Measure the REALISED correlation the model actually produces over many simulated normal years.
  const measureCorr = (profile, rng, ctxFn, n = 4000) => {
    const xs = [], ys = [];
    for (let i = 0; i < n; i++) {
      const eq = 0.10 + gaussianRandom(0, 0.17, rng);
      if (eq < -0.15) continue;                       // keep the sample inside the 'normal' regime
      const ctx = ctxFn(eq);
      xs.push(eq);
      ys.push(subAssetReturn(profile, ctx, rng));
    }
    const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
    const mx = mean(xs), my = mean(ys);
    let cov = 0, vx = 0, vy = 0;
    for (let i = 0; i < xs.length; i++) { const dx = xs[i]-mx, dy = ys[i]-my; cov += dx*dy; vx += dx*dx; vy += dy*dy; }
    return cov / Math.sqrt(vx * vy);
  };

  it('realised corporate-vs-equity correlation lands near its target (~0.35)', () => {
    const rho = measureCorr(SUB_ASSET_PROFILES.corporateIG, seededRng(7), eq => ({ inf: 0.025, prevInf: 0.025, eqReturn: eq, prevEqReturn: 0.10 }));
    expect(rho).toBeGreaterThan(0.20);
    expect(rho).toBeLessThan(0.50);
  });

  it('realised gold-vs-equity correlation is near zero (a genuine diversifier)', () => {
    const rho = measureCorr(SUB_ASSET_PROFILES.gold, seededRng(7), eq => ({ inf: 0.025, prevInf: 0.025, eqReturn: eq, prevEqReturn: 0.10 }));
    expect(Math.abs(rho)).toBeLessThan(0.12);
  });
});

describe('diversifier pot wired into the engine', () => {
  const base = { equityStart: 500000, bondStart: 250000, cashStart: 50000, baseSalary: 38000, years: 30, duration: 30 };

  it('funding a Diversifiers pot produces finite pot values counted in the total', () => {
    const cfg = createSimulationConfig({ ...base, subAsset: {}, diversifierStart: 150000 });
    const runs = runMonteCarlo(cfg, 100);
    expect(runs.every(r => Number.isFinite(r.finalDiversifier))).toBe(true);
    // in at least some paths the crisis reserve is actually tapped
    expect(runs.some(r => r.divUsed > 0)).toBe(true);
  });

  it('a diversifier sleeve is drawn as a crisis reserve, sparing equity (helps or holds resilience)', () => {
    // Same total starting capital; one version carves a diversifier sleeve out of equity.
    const noDiv = createSimulationConfig({ ...base, equityStart: 650000, subAsset: {} });
    const withDiv = createSimulationConfig({ ...base, equityStart: 500000, subAsset: {}, diversifierStart: 150000 });
    const succ = (cfg) => runMonteCarlo(cfg, 400).filter(r => !r.failed).length / 400;
    // the sleeve should not WORSEN outcomes materially (tail hedge, not a drag)
    expect(succ(withDiv)).toBeGreaterThan(succ(noDiv) - 0.05);
  });
});

describe('new sub-classes (REITs, EM, small-cap, high-yield, commodities)', () => {
  const expectBucket = { reit: 'shares', emEquity: 'shares', globalSmallCap: 'shares', highYield: 'bonds', commodities: 'diversifiers' };

  it('all five profiles are complete and in the right buckets', () => {
    for (const [key, bucket] of Object.entries(expectBucket)) {
      const p = SUB_ASSET_PROFILES[key];
      expect(p, key).toBeTruthy();
      expect(p.bucket, key).toBe(bucket);
      for (const f of ['nominalReturn', 'vol', 'eqCorr', 'idioVol', 'label']) {
        expect(p[f], key + '.' + f).toBeDefined();
      }
    }
  });

  it('high-yield: carry-positive in a normal year, hit harder than IG in a crash', () => {
    const hyNormal = subAssetReturn(SUB_ASSET_PROFILES.highYield, NORMAL, flatRng);
    expect(hyNormal).toBeGreaterThan(0.03);          // ~6.5% carry, small duration drag
    const hyCrash = subAssetReturn(SUB_ASSET_PROFILES.highYield, CRASH, flatRng);
    const igCrash = subAssetReturn(SUB_ASSET_PROFILES.corporateIG, CRASH, flatRng);
    expect(hyCrash).toBeLessThan(igCrash);           // bigger credit hit than IG
  });

  it('commodities: strong 2022 inflation hedge; falls WITH equities in a 2008-style crash', () => {
    const c2022 = commoditiesReturn(Y2022, flatRng);
    expect(c2022).toBeGreaterThan(0.05);             // 0.8 × (9% − 2.5%) hedge dominates
    const cCrash = commoditiesReturn(CRASH, flatRng);
    expect(cCrash).toBeLessThan(0);                  // demand shock: down with equities
    expect(c2022).toBeGreaterThan(cCrash + 0.15);    // the regimes are meaningfully different
  });

  it('diversifierBucketReturn blends a commodities weight', () => {
    const withC = diversifierBucketReturn(Y2022, flatRng, 0, { gold: 0.4, trendMacro: 0.3, commodities: 0.3 });
    const withoutC = diversifierBucketReturn(Y2022, flatRng, 0, { gold: 0.4, trendMacro: 0.3 });
    expect(Number.isFinite(withC)).toBe(true);
    expect(withC).toBeGreaterThan(withoutC);         // 2022: the commodities sleeve adds hedge return
  });

  it('a REIT holding tags to the shares bucket with its own label', () => {
    const t = tagPortfolio([{ ticker: 'XYZ', subClass: 'reit', value: 100000, wrapper: 'SIPP' }]);
    expect(t.buckets.shares).toBe(100000);
    expect(t.tagged[0].label).toBe('Property / REITs');
  });
});

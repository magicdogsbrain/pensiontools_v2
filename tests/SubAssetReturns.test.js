import { describe, it, expect } from 'vitest';
import {
  giltYieldLevel, realYieldLevel, subAssetReturn, bondBucketReturn
} from '../src/services/SubAssetReturns.js';
import { SUB_ASSET_PROFILES } from '../src/services/SubAssetModel.js';

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

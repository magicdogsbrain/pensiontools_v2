/**
 * One reader for the household link (7.12.0, services/HouseholdLink.js): read either way, written on one plan only. Kim and
 * Sam (fictional) with the link on Sam's plan only: each plan finds the other; which plan holds the link is said; a closed
 * plan is never a partner; a plan's own link beats another plan pointing at it. The simple view's three readers (the
 * household page, the plan's steps and "Your plans", the home's to-dos) read through it.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData } from '../src/firebase/FirestoreService.js';
import { getHouseholdPartnerId, invalidateScenarioCache } from '../src/storage/ScenarioRepository.js';
import { partnerIdOf, partnersOf, partnerOf, linkedByOf } from '../src/services/HouseholdLink.js';
import { partnerOf as householdPartnerOf } from '../src/answers/plan/household.js';
import { kimAndSam, KIM_ID, SAM_ID, KIM_AND_SAM_TODAY } from './fixtures/kimAndSam.js';
import { aboutOf } from '../src/answers/plan/about.js';
import { potsOf } from '../src/answers/plan/pots.js';
import { spendOf } from '../src/answers/plan/spend.js';
import { incomeOf } from '../src/answers/plan/income.js';
import { lastsOf } from '../src/answers/plan/lasts.js';
import { upgradedList } from '../src/v7/effects/planSource.js';

const entries = (...plans) => plans.map((plan) => ({ plan }));

describe('the household link, read either way', () => {
  it('Kim\'s plan has no link, yet finds Sam\'s; Sam\'s finds Kim\'s; the link is Sam\'s', () => {
    const { kim, sam } = kimAndSam();
    const list = entries(kim, sam);
    expect(partnerIdOf(kim)).toBe(null);
    expect(partnerIdOf(sam)).toBe(KIM_ID);
    expect(partnerOf(list, kim).plan.id).toBe(SAM_ID);
    expect(partnerOf(list, sam).plan.id).toBe(KIM_ID);
    expect(linkedByOf(kim, sam)).toBe('theirs');
    expect(linkedByOf(sam, kim)).toBe('mine');
    const both = kimAndSam({ link: 'both' });
    expect(linkedByOf(both.kim, both.sam)).toBe('both');
    expect(linkedByOf(kim, kimAndSam({ link: 'none' }).sam)).toBe(null);
  });

  it('takes plans or { plan } entries, and gives back the list\'s own items', () => {
    const { kim, sam } = kimAndSam();
    expect(partnerOf([kim, sam], kim)).toBe(sam);
    const list = entries(kim, sam);
    expect(partnerOf(list, kim)).toBe(list[1]);
  });

  it('a closed plan is never a partner, either way', () => {
    const { kim, sam } = kimAndSam({ link: 'both' });
    sam.closedAt = '2026-03';
    expect(partnerOf(entries(kim, sam), kim)).toBe(null);
    expect(partnersOf(entries(kim, sam), kim)).toEqual([]);
  });

  it('a plan\'s own link comes first, before another plan that points at it', () => {
    const { kim, sam } = kimAndSam();                      // Sam points at Kim
    const jo = { ...JSON.parse(JSON.stringify(sam)), id: 'JoPlan0003', planDetails: { name: 'Jo' }, household: null };
    kim.household = { partnerScenarioId: 'JoPlan0003' };   // Kim points at Jo
    const list = entries(sam, kim, jo);
    expect(partnersOf(list, kim).map((e) => e.plan.id)).toEqual(['JoPlan0003', SAM_ID]);
    expect(partnerOf(list, kim).plan.id).toBe('JoPlan0003');
  });

  it('nothing for a plan with no link either way, or for nothing at all', () => {
    const { kim, sam } = kimAndSam({ link: 'none' });
    expect(partnerOf(entries(kim, sam), kim)).toBe(null);
    expect(partnersOf(null, kim)).toEqual([]);
    expect(partnersOf(entries(kim, sam), null)).toEqual([]);
  });

  it('the simple household page reads the same partner', () => {
    const { kim, sam } = kimAndSam();
    const list = entries(kim, sam);
    expect(householdPartnerOf(list, kim)).toBe(partnerOf(list, kim));
    expect(householdPartnerOf(list, sam)).toBe(partnerOf(list, sam));
  });
});

// Joined at integration (7.12.0): the five plan pages that offer "the same for my partner's plan" (About you and when, Your
// pots and tax, What you spend, Income that comes anyway, Will it last?) read the partner through the one reader too, so a
// closed plan is never offered there either, and the plan's own link comes first.
describe('the plan pages\' partner lists read the one link reader', () => {
  const pages = { aboutOf, potsOf, spendOf, incomeOf, lastsOf };
  const listOf = (...plans) => upgradedList(plans, new Date(2026, 10, 16, 12));
  for (const [name, read] of Object.entries(pages)) {
    it(name + ': the partner either way; never a closed plan', () => {
      const { kim, sam } = kimAndSam();                  // the link is on Sam's plan only
      const open = read(listOf(kim, sam), KIM_ID, { today: KIM_AND_SAM_TODAY });
      expect(open.partners.map((p) => p.id)).toEqual([SAM_ID]);
      const closed = kimAndSam({ link: 'both' });
      closed.sam.closedAt = '2026-03';
      expect(read(listOf(closed.kim, closed.sam), KIM_ID, { today: KIM_AND_SAM_TODAY }).partners).toEqual([]);
    });
  }
});

// The full view's own reader of the link (ScenarioRepository.getHouseholdPartnerId) reads it either way too (7.12.0, joined
// at integration): with the link on Sam's plan only, Kim's plan open, it gives Sam's plan; a closed plan, nothing.
describe('the full view\'s getHouseholdPartnerId reads the link either way', () => {
  afterEach(() => { leaveGuestMode(); clearGuestData(); invalidateScenarioCache(); });
  const open = (plans) => { enterGuestMode(); clearGuestData(); sessionStorage.setItem('pt_guest_scenarios', JSON.stringify(plans)); invalidateScenarioCache(); };
  it('Kim\'s plan open, the link on Sam\'s: Sam\'s plan; Sam\'s closed: none', async () => {
    const { kim, sam } = kimAndSam();
    open([{ ...kim, isActive: true }, { ...sam, isActive: false }]);
    expect(await getHouseholdPartnerId()).toBe(SAM_ID);
    const both = kimAndSam({ link: 'both' });
    open([{ ...both.kim, isActive: true }, { ...both.sam, isActive: false, closedAt: '2026-03' }]);
    expect(await getHouseholdPartnerId()).toBe(null);
  });
});

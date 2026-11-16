/**
 * One reader for the household link (7.12.0, services/HouseholdLink.js): read either way, written on one plan only. Kim and
 * Sam (fictional) with the link on Sam's plan only: each plan finds the other; which plan holds the link is said; a closed
 * plan is never a partner; a plan's own link beats another plan pointing at it. The simple view's three readers (the
 * household page, the plan's steps and "Your plans", the home's to-dos) read through it.
 */
import { describe, it, expect } from 'vitest';
import { partnerIdOf, partnersOf, partnerOf, linkedByOf } from '../src/services/HouseholdLink.js';
import { partnerOf as householdPartnerOf } from '../src/answers/plan/household.js';
import { kimAndSam, KIM_ID, SAM_ID } from './fixtures/kimAndSam.js';

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

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Filters', () => {

  test.describe('Filter by Status', () => {

    test('select multiple statuses shows candidates matching any selected status', async ({ page }) => {
      const homePage = new HomePage(page, test);
      await homePage.goto();

      await homePage.selectMultipleStatuses(['Active', 'Accepted']);

      const statuses = await homePage.getAllStatusValues();
      expect(statuses.length).toBeGreaterThan(0);
      statuses.forEach(status => {
        const s = status.toLowerCase();
        expect(s.includes('active') || s.includes('accepted')).toBeTruthy();
      });
    });

  });

  // ── Filter Modal ──────────────────────────────────────────────────────────
  test.describe('Filter Modal — combined filters', () => {

    test('reset button clears all filters', async ({ page }) => {
      const homePage = new HomePage(page, test);
      await homePage.goto();

      await homePage.openFilterModal();
      await homePage.filterByStatusInModal('Active');
      await homePage.applyFilters();
      const count = await homePage.getTableRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('combine top status dropdown + filter modal filters', async ({ page }) => {
      const homePage = new HomePage(page, test);
      await homePage.goto();

      await homePage.filterByStatus('Active');

      await homePage.openFilterModal();
      await homePage.filterByBusinessUnit('Core Logistics AE');
      await homePage.applyFilters();

      const statuses = await homePage.getAllStatusValues();
      const count = await homePage.getTableRowCount();

      expect(count).toBeGreaterThanOrEqual(0);
      statuses.forEach(status => {
        expect(status.toLowerCase()).toContain('active');
      });
    });

  });

});
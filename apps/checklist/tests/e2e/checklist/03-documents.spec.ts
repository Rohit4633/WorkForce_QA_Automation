import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';
import { DocumentPage } from '../../pages/DocumentPage';

test.describe('Documents', () => {

  // CHK-DOC-01 ──────────────────────────────────────────────────────────────
  test('CHK-DOC-01: clicking Passport navigates to document page with upload options', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const docPage = new DocumentPage(page, test);

    await homePage.goto();
    await homePage.clickDocument('Passport');

    await expect(page).toHaveURL(/\/en\/document\/passport/);
    await expect(page.getByRole('heading', { level: 3, name: 'Passport' })).toBeVisible();

    expect(await docPage.isTakePhotoVisible()).toBe(true);
    expect(await docPage.isChooseFromGalleryVisible()).toBe(true);
  });

  // CHK-DOC-02 ──────────────────────────────────────────────────────────────
  test('CHK-DOC-02: Passport document has 2 steps — Front Page and Review', async ({ page }) => {
    const docPage = new DocumentPage(page, test);

    await docPage.navigateTo('passport');

    const steps = await docPage.getStepNames();
    expect(steps).toHaveLength(2);
    expect(steps[0]).toBe('Front Page');
    expect(steps[1]).toBe('Review');
  });

  // CHK-DOC-03 ──────────────────────────────────────────────────────────────
  test('CHK-DOC-03: Emirates ID has 3 steps — Front Page, Back Page, and Review', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const docPage = new DocumentPage(page, test);

    await homePage.goto();
    await homePage.clickDocument('Emirates ID');

    await expect(page).toHaveURL(/\/en\/document\/ae_emirates_id/);

    const steps = await docPage.getStepNames();
    expect(steps).toHaveLength(3);
    expect(steps[0]).toBe('Front Page');
    expect(steps[1]).toBe('Back Page');
    expect(steps[2]).toBe('Review');
  });

  // CHK-DOC-04 ──────────────────────────────────────────────────────────────
  test('CHK-DOC-04: document page shows upload guidelines', async ({ page }) => {
    const docPage = new DocumentPage(page, test);

    await docPage.navigateTo('passport');

    await expect(page.getByText('Please follow the guidelines below:')).toBeVisible();
    await expect(page.getByText('Clearly visible and easy to read')).toBeVisible();
    await expect(page.getByText('Fully captured without cropping')).toBeVisible();
  });

  // CHK-DOC-05 ──────────────────────────────────────────────────────────────
  test('CHK-DOC-05: back button on document page returns to homepage', async ({ page }) => {
    const docPage = new DocumentPage(page, test);

    await docPage.navigateTo('passport');
    await expect(page).toHaveURL(/\/en\/document\/passport/);

    await docPage.goBack();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByText('IMPORTANT DOCUMENTS')).toBeVisible();
  });

});

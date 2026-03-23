import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { BusinessSettingsPage } from '../../pages/BusinessSettingsPage';
import {
  randomContactTitle,
  randomContactName,
  randomContactPhone,
  randomContactEmail
} from '../../helpers/business-data-helpers';

test.describe('Business Settings', () => {

  // ── Test 1: Navigate and verify page loads ────────────────────────────────
  test('business settings page loads with company info and contacts table', async ({ page }) => {
    const settingsPage = new BusinessSettingsPage(page, test);

    await page.goto('/');
    await settingsPage.ensureCorrectProject();
    await settingsPage.goToBusinessSettings();
    console.log('✅ Navigated to Business Settings');

    const isLoaded = await settingsPage.isPageLoaded();
    expect(isLoaded).toBe(true);
    console.log('✅ Business Settings page loaded');

    await expect(page.getByText('1455 Noon Test AE')).toBeVisible();
    console.log('✅ Company name visible');

    await expect(page.getByText('United Arab Emirates')).toBeVisible();
    console.log('✅ Country visible');

    await expect(page.getByRole('columnheader', { name: 'Contact Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Phone Number' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    console.log('✅ Contacts table columns verified');
  });

  // ── Test 2: Add Finance Contact and verify in table ───────────────────────
  test('add finance contact with all fields and verify in contacts table', async ({ page }) => {
    const settingsPage = new BusinessSettingsPage(page, test);

    const title = randomContactTitle();
    const name = randomContactName();
    const phone = randomContactPhone();
    const email = randomContactEmail();

    console.log(`Adding contact — Title: ${title}, Name: ${name}, Phone: +971${phone}, Email: ${email}`);

    await page.goto('/');
    await settingsPage.ensureCorrectProject();
    await settingsPage.goToBusinessSettings();
    await settingsPage.clickAddContact();
    console.log('✅ Add contact modal opened');

    await settingsPage.selectContactType('Finance Contact');
    console.log('✅ Finance Contact selected');

    await settingsPage.fillTitle(title);
    console.log(`✅ Title filled: ${title}`);

    await settingsPage.fillName(name);
    console.log(`✅ Name filled: ${name}`);

    await settingsPage.fillPhoneNumber(phone);
    console.log(`✅ Phone filled: +971${phone}`);

    await settingsPage.fillEmail(email);
    console.log(`✅ Email filled: ${email}`);

    await settingsPage.clickApply();
    console.log('✅ Apply clicked');

    const contactExists = await settingsPage.verifyContactExists(name);
    expect(contactExists).toBe(true);
    console.log(`✅ Contact ${name} found in table`);
  });

  // ── Test 3: Verify contact details in table ───────────────────────────────
  test('verify newly added contact shows correct details in table', async ({ page }) => {
    const settingsPage = new BusinessSettingsPage(page, test);

    const title = randomContactTitle();
    const name = randomContactName();
    const phone = randomContactPhone();
    const email = randomContactEmail();

    console.log(`Adding contact — Title: ${title}, Name: ${name}, Phone: +971${phone}, Email: ${email}`);

    await page.goto('/');
    await settingsPage.ensureCorrectProject();
    await settingsPage.goToBusinessSettings();
    await settingsPage.clickAddContact();
    await settingsPage.selectContactType('Business Contact');
    await settingsPage.fillTitle(title);
    await settingsPage.fillName(name);
    await settingsPage.fillPhoneNumber(phone);
    await settingsPage.fillEmail(email);
    await settingsPage.clickApply();

    const row = page.getByRole('row').filter({ hasText: name }).first();
    await expect(row).toBeVisible({ timeout: 10000 });

    await expect(row).toContainText('Business Contact');
    console.log('✅ Contact Type verified in table');

    await expect(row).toContainText(title);
    console.log(`✅ Title ${title} verified in table`);

    await expect(row).toContainText(name);
    console.log(`✅ Name ${name} verified in table`);

    await expect(row).toContainText(email);
    console.log(`✅ Email ${email} verified in table`);

    console.log('✅ All contact details verified in table');
  });

  // ── Test 4: Edit contact — change all fields ──────────────────────────────
  test('edit existing contact and verify all changes reflect in table', async ({ page }) => {
    const settingsPage = new BusinessSettingsPage(page, test);

    const title = randomContactTitle();
    const name = randomContactName();
    const phone = randomContactPhone();
    const email = randomContactEmail();

    const updatedTitle = randomContactTitle();
    const updatedName = randomContactName();
    const updatedPhone = randomContactPhone();
    const updatedEmail = randomContactEmail();

    console.log(`Initial: ${name} | Updated: ${updatedName}`);
    console.log(`Initial phone: +971${phone} | Updated phone: +971${updatedPhone}`);

    await page.goto('/');
    await settingsPage.ensureCorrectProject();
    await settingsPage.goToBusinessSettings();
    await settingsPage.clickAddContact();
    await settingsPage.selectContactType('Finance Contact');
    await settingsPage.fillTitle(title);
    await settingsPage.fillName(name);
    await settingsPage.fillPhoneNumber(phone);
    await settingsPage.fillEmail(email);
    await settingsPage.clickApply();
    console.log(`✅ Initial contact ${name} added`);

    await settingsPage.openContactMenu(name);
    await settingsPage.clickEdit();
    console.log('✅ Edit modal opened');

    await settingsPage.selectContactType('Business Contact');
    console.log('✅ Contact type updated to Business Contact');

    await page.getByRole('textbox', { name: 'Title' }).clear();
    await settingsPage.fillTitle(updatedTitle);
    console.log(`✅ Title updated to: ${updatedTitle}`);

    await page.getByRole('textbox', { name: 'Name' }).clear();
    await settingsPage.fillName(updatedName);
    console.log(`✅ Name updated to: ${updatedName}`);

    await page.getByRole('textbox', { name: 'Email' }).clear();
    await settingsPage.fillEmail(updatedEmail);
    console.log(`✅ Email updated to: ${updatedEmail}`);

    await settingsPage.clickApply();
    console.log('✅ Changes applied');

    const row = page.getByRole('row').filter({ hasText: updatedName }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText('Business Contact');
    await expect(row).toContainText(updatedTitle);
    await expect(row).toContainText(updatedName);
    await expect(row).toContainText(updatedEmail);
    console.log('✅ All updated contact details verified in table');
  });

  // ── Test 5: Submit empty form — verify all validation errors ──────────────
  test('submit add contact with empty fields shows all validation errors', async ({ page }) => {
    const settingsPage = new BusinessSettingsPage(page, test);

    await page.goto('/');
    await settingsPage.ensureCorrectProject();
    await settingsPage.goToBusinessSettings();
    await settingsPage.clickAddContact();
    console.log('✅ Add contact modal opened');

    await settingsPage.clickApply();
    await page.waitForTimeout(1000);

    await expect(page.getByText('Contact type is a required field')).toBeVisible();
    console.log('✅ Contact type validation error shown');

    await expect(page.getByText('Contact title is a required field')).toBeVisible();
    console.log('✅ Contact title validation error shown');

    await expect(page.getByText('Contact name is a required field')).toBeVisible();
    console.log('✅ Contact name validation error shown');

    await expect(page.getByText('Phone number is required')).toBeVisible();
    console.log('✅ Phone number validation error shown');

    await expect(page.getByText('Email address is a required field')).toBeVisible();
    console.log('✅ Email validation error shown');

    console.log('✅ All 5 validation errors verified for empty form');
  });
});
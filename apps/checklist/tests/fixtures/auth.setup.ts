import { test as setup } from '@playwright/test';
import { loadVendorCandidate } from '../helpers/data-helpers';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const candidate = loadVendorCandidate();
  const phone = candidate.phone;
  console.log(`🔐 Logging in with phone: ${phone}`);

  // Step 1 — Navigate to app
  await page.goto('https://checklist.noonstg.partners');
  await page.waitForTimeout(2000);

  // Step 2 — Enter phone number
  await page.getByRole('textbox', { name: 'Enter your phone number' }).fill(phone);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);

  // Step 3 — Enter OTP
  const otpInput = page.getByRole('textbox');
  await otpInput.waitFor({ state: 'visible', timeout: 10000 });
  await otpInput.fill(process.env.TEST_OTP || '123456');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(3000);

  // Step 4 — Handle language switcher (appears on first login)
  const confirmBtn = page.getByRole('button', { name: 'Confirm' });
  if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Language switcher visible — selecting English and confirming');
    await page.getByRole('button', { name: 'English' }).click();
    await confirmBtn.click();
    await page.waitForTimeout(2000);
  }

  // Step 5 — Verify we landed on the homepage (URL contains /en with optional query params)
  await page.waitForURL(/\/en(\?|$)/, { timeout: 15000 });
  console.log(`✅ Landed on homepage: ${page.url()}`);

  // Step 6 — Save auth session
  await page.context().storageState({ path: authFile });
  console.log('✅ Auth session saved successfully');
});

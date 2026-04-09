import { test as setup } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {

  // Step 1 — Navigate to app
  await page.goto(process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455');
  await page.waitForTimeout(3000);

  // Step 2 — Enter email
  await page.getByPlaceholder('Enter your phone number or email').fill(process.env.TEST_USER_EMAIL || 'rmangla@noon.com');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  // Step 3 — Conditionally click "Continue with email OTP" if visible
  const emailOtpButton = page.getByRole('button', { name: /continue with email otp/i });
  if (await emailOtpButton.isVisible()) {
    console.log('Email OTP button found — clicking it');
    await emailOtpButton.click();
    await page.waitForTimeout(1500);
  } else {
    console.log('Email OTP button not found — skipping');
  }

  // Step 4 — Enter OTP
  const otpInput = page.locator('input[maxlength="6"]');
  await otpInput.waitFor({ state: 'visible', timeout: 10000 });
  await otpInput.fill(process.env.TEST_OTP || '123456');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  // Step 5 — Conditionally dismiss passkey setup
  const maybeLaterBtn = page.getByText('Maybe Later');
  if (await maybeLaterBtn.isVisible()) {
    console.log('Passkey prompt found — dismissing');
    await maybeLaterBtn.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('Passkey prompt not found — skipping');
  }

  // Step 6 — Handle project selection if needed
  const basePage = new BasePage(page, setup);
  await basePage.ensureCorrectProject();

  // Step 7 — Save session
  await page.context().storageState({ path: authFile });
  console.log('✅ Auth session saved successfully');
});
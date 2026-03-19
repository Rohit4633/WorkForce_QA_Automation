import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['html'], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Auth setup — maximised only, no incognito
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },

    // Main tests — incognito + maximised
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: [
            '--start-maximized',
            '--incognito'
          ]
        }
      },
      dependencies: ['setup'],
    },
  ],
});
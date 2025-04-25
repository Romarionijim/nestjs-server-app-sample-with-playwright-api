import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 2 * 120 * 1000,
  globalTimeout: 2 * 60 * 60 * 1000,
  testDir: './api/tests/',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: './api/playwright-report/' }],
    ['list'],
    ['json', { outputFile: './api/results.json' }],
    ['junit', { outputFile: './api/results.xml' }]
  ],

  webServer: {
    command: 'npm run start:dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

});

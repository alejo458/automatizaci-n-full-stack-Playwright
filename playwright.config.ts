import { defineConfig } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: Number(process.env.WORKERS ?? 2), // mínimo 2 workers
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'artifacts/results.json' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testMatch: /tests\/api\/.*\.spec\.ts/ },
    { name: 'ui', testMatch: /tests\/e2e\/.*\.spec\.ts/, use: { browserName: 'chromium' } },
  ],
});

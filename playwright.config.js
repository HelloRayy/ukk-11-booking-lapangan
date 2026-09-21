import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  
  // Single worker to prevent GPU/rendering race conditions
  workers: 1,
  fullyParallel: false,

  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
      animations: 'disabled'
    }
  },

  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  },

  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 15000
  },
});

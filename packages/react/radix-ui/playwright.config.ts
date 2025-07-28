import { defineConfig, devices } from "@playwright/test"

/**
 * Read environment variables from file.
 */
// import { fileURLToPath } from "node:url"
//
// import dotenv from 'dotenv';
// const cwd = import.meta.dirname
// dotenv.config({ path: path.resolve(cwd, ".env") })

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:6006"

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    browserName: "chromium",
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm dev",
        url: BASE_URL,
        reuseExistingServer: true,
      },
})

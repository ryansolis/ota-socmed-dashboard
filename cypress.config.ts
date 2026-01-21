import { defineConfig } from "cypress"
import { config } from "dotenv"
import { resolve } from "path"
import { existsSync } from "fs"

// Load environment variables from .env.local if it exists
const envPath = resolve(__dirname, ".env.local")
if (existsSync(envPath)) {
  config({ path: envPath })
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Load environment variables and make them available to Cypress
      // Supports both CYPRESS_* prefix and direct TEST_* vars
      config.env = {
        ...config.env,
        TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL || process.env.TEST_EMAIL || config.env.TEST_EMAIL,
        TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || process.env.TEST_PASSWORD || config.env.TEST_PASSWORD,
      }
      return config
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },
})


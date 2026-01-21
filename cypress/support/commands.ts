/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via Supabase
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to wait for API requests to complete
       * @example cy.waitForApi()
       */
      waitForApi(): Chainable<void>
    }
  }
}

// Login helper command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  // Wait for redirect to dashboard
  cy.url().should('include', '/dashboard')
})

// Wait for API requests to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('GET', '/api/**').as('apiRequests')
  cy.wait('@apiRequests', { timeout: 10000 })
})

export {}


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
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>
      
      /**
       * Custom command to create a test user (if needed)
       * @example cy.createTestUser('test@example.com', 'password123')
       */
      createTestUser(email: string, password: string): Chainable<void>
    }
  }
}

// Login helper command with better error handling
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login')
  
  // Wait for form to be visible
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').clear().type(email)
  cy.get('input[type="password"]').should('be.visible').clear().type(password)
  
  // Click submit button
  cy.get('button[type="submit"]').should('be.visible').click()
  
  // Wait for either redirect to dashboard (success) or error message (failure)
  cy.url({ timeout: 15000 }).then((url) => {
    if (url.includes('/auth/login')) {
      // Still on login page - check for error
      cy.get('body').then(($body) => {
        if ($body.text().includes('Invalid login credentials') || 
            $body.find('.bg-destructive').length > 0) {
          throw new Error('Login failed: Invalid credentials')
        }
      })
    }
  })
  
  // Verify redirect to dashboard
  cy.url().should('include', '/dashboard')
  
  // Verify we're actually logged in by checking for dashboard content
  cy.contains('Analytics Dashboard', { timeout: 10000 }).should('be.visible')
})

// Wait for API requests to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('GET', '/api/**').as('apiRequests')
  cy.wait('@apiRequests', { timeout: 10000 })
})

// Logout helper command
Cypress.Commands.add('logout', () => {
  cy.visit('/dashboard')
  // Look for sign out button and click it
  cy.contains('Sign Out', { timeout: 10000 }).click()
  // Wait for redirect to login
  cy.url().should('include', '/auth/login')
})

// Create test user (signup) helper command
Cypress.Commands.add('createTestUser', (email: string, password: string) => {
  cy.visit('/auth/signup')
  
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').clear().type(email)
  cy.get('input[type="password"]').should('be.visible').clear().type(password)
  cy.get('button[type="submit"]').should('be.visible').click()
  
  // Wait for redirect to dashboard after successful signup
  cy.url({ timeout: 15000 }).should('include', '/dashboard')
})

export {}


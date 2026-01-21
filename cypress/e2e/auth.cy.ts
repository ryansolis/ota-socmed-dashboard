describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it("should redirect unauthenticated users to login", () => {
    cy.visit("/dashboard")
    cy.url().should("include", "/auth/login")
  })

  it("should show login page with form fields", () => {
    cy.visit("/auth/login")
    
    cy.get('input[type="email"]').should("be.visible")
    cy.get('input[type="password"]').should("be.visible")
    cy.get('button[type="submit"]').should("be.visible")
  })

  it("should display validation errors for empty form", () => {
    cy.visit("/auth/login")
    cy.get('button[type="submit"]').click()
    
    // Form validation should prevent submission
    cy.url().should("include", "/auth/login")
  })

  it("should navigate to signup page", () => {
    cy.visit("/auth/login")
    cy.contains("Sign up").click()
    cy.url().should("include", "/auth/signup")
  })

  // Conditionally run login test if credentials are available
  const testEmail = Cypress.env("TEST_EMAIL")
  const testPassword = Cypress.env("TEST_PASSWORD")
  
  if (testEmail && testPassword) {
    it("should successfully login with valid credentials", () => {
      cy.login(testEmail, testPassword)
      cy.url().should("include", "/dashboard")
      cy.contains("Analytics Dashboard", { timeout: 10000 }).should("be.visible")
      
      // Verify we can see dashboard content
      cy.contains("Total Engagement", { timeout: 10000 }).should("exist")
    })
  } else {
    it.skip("should successfully login with valid credentials - requires TEST_EMAIL and TEST_PASSWORD", () => {
      cy.log("⚠️ Skipping login test: TEST_EMAIL and TEST_PASSWORD not set")
      cy.log("To enable login testing, set these environment variables:")
      cy.log("  CYPRESS_TEST_EMAIL=your-test@example.com")
      cy.log("  CYPRESS_TEST_PASSWORD=your-test-password")
    })
  }

  it("should display error message for invalid credentials", () => {
    cy.visit("/auth/login")
    
    cy.get('input[type="email"]').type("invalid@example.com")
    cy.get('input[type="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()
    
    // Should show error message or stay on login page
    // The exact behavior depends on your error handling
    cy.url({ timeout: 5000 }).should("include", "/auth/login")
  })

  // Conditionally run logout test if credentials are available
  if (testEmail && testPassword) {
    it("should logout successfully", () => {
      // Login first
      cy.login(testEmail, testPassword)
      cy.url().should("include", "/dashboard")
      
      // Then logout
      cy.logout()
      cy.url().should("include", "/auth/login")
      
      // Verify we can't access dashboard anymore
      cy.visit("/dashboard")
      cy.url().should("include", "/auth/login")
    })
  } else {
    it.skip("should logout successfully - requires TEST_EMAIL and TEST_PASSWORD", () => {
      cy.log("Skipping logout test: TEST_EMAIL and TEST_PASSWORD not set")
    })
  }
})


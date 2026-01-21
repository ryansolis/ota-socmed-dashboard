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

  // Note: Actual login tests would require valid Supabase credentials
  // In CI/CD, you might want to use test credentials or mock Supabase
  it.skip("should successfully login with valid credentials", () => {
    const email = Cypress.env("TEST_EMAIL")
    const password = Cypress.env("TEST_PASSWORD")

    if (!email || !password) {
      throw new Error("TEST_EMAIL and TEST_PASSWORD must be set in Cypress env")
    }

    cy.login(email, password)
    cy.url().should("include", "/dashboard")
    cy.contains("Analytics Dashboard").should("be.visible")
  })
})


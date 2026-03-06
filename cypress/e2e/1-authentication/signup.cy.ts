describe("Signup", () => {
  it("should navigate to signup page", () => {
    cy.visit("/login");
    cy.get('a[href*="sign-up"]').click();
    cy.get('button[type="submit"]').contains("Sign up");
  });

  it("should not signup with an existing email", () => {
    cy.visit("/login");
    cy.get('a[href*="sign-up"]').click();

    cy.get('input[name="email"]').type(Cypress.env("TEST_USER_EMAIL"));
    cy.get('input[name="password"]').type(Cypress.env("TEST_USER_PASSWORD"));
    cy.get('button[type="submit"]').click();

    // Should show error - user already registered
    cy.get("span").should("exist");
  });
});

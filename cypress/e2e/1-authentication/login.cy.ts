describe("Login", () => {
  it("should login a user", () => {
    cy.visit("/");

    cy.get('input[name="email"]').type(Cypress.env("TEST_USER_EMAIL"));
    cy.get('input[name="password"]').type(Cypress.env("TEST_USER_PASSWORD"));
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
  });

  it("should not login a user with a wrong password", () => {
    cy.visit("/");

    cy.get('input[name="email"]').type(Cypress.env("TEST_USER_EMAIL"));
    cy.get('input[name="password"]').type("wrong_password_123");
    cy.get('button[type="submit"]').click();

    cy.get("span").contains("Invalid login credentials");
  });
});

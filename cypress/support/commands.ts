/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email?: string, password?: string) => {
  const userEmail = email || Cypress.env("TEST_USER_EMAIL");
  const userPassword = password || Cypress.env("TEST_USER_PASSWORD");

  cy.visit("/login");
  cy.get('input[name="email"]').type(userEmail);
  cy.get('input[name="password"]').type(userPassword);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});

export {};

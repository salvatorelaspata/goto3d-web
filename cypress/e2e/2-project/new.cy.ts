describe("New Project", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should navigate to new project page", () => {
    cy.get('a[href*="projects"]').click();
    cy.url().should("include", "/projects");
    cy.get('a[href*="projects/new"]').click();
    cy.url().should("include", "/projects/new");
  });

  it("should create a new project without image", () => {
    cy.visit("/projects/new");
    cy.get('input[name="name"]').type("e2e test project");
    cy.get('textarea[name="description"]').type("e2e test project description");
    cy.get('button[type="submit"]').click();
  });

  it("should create a new project with images", () => {
    cy.visit("/projects/new");
    cy.get('input[name="name"]').type("e2e test project with images");
    cy.get('textarea[name="description"]').type("e2e test project description");

    cy.get('input[type="file"]').selectFile(
      [
        "cypress/fixtures/test-image-1.jpg",
        "cypress/fixtures/test-image-2.jpg",
        "cypress/fixtures/test-image-3.jpg",
      ],
      { force: true }
    );

    cy.intercept("POST", "/api/image-upload").as("imageUpload");
    cy.get('button[type="submit"]').click();
  });
});

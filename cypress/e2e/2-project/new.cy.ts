// create test for new project
describe('New Project', () => {
  it('should create a new project', () => {
    // Sign in
    cy.visit('http://localhost:8080/')
    cy.wait(1000)
    // Fill out the form
    cy.get('input[name="email"]').type(`e2e.test.cy@gmail.com`)
    cy.get('input[name="password"]').type('e2e.test.cy')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    // navigate to new project page
    cy.get('a[href*="projects"]').click()
    cy.wait(500)
    cy.get('a[href*="projects/new"]').click()
    cy.wait(500)

    cy.get('input[name="name"]').type('e2e test project')
    cy.get('textarea[name="description"]').type('e2e test project description')

    cy.get('button[type="submit"]').click()
  })
})
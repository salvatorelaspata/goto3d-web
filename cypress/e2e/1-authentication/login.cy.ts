// create login test
describe('Login', () => {
  it('should login a user', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "login" and click it
    // cy.get('a[href*="sign-in"]').click()

    // The button should contain "Login"
    // cy.get('button[type="submit"]').contains('Login')

    // Fill out the form
    cy.get('input[name="email"]').type(`e2e.test.cy@gmail.com`)
    cy.get('input[name="password"]').type('e2e.test.cy')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // The new url should include "/dashboard"
    cy.url().should('include', 'dashboard')

    // Check the cookies
    cy.getCookie('supabase-auth-token').should('exist')
  })

  it('should not login a user with a wrong password', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "login" and click it
    // cy.get('a[href*="sign-in"]').click()

    // The button should contain "Login"
    // cy.get('button[type="submit"]').contains('Login')

    // Fill out the form
    cy.get('input[name="email"]').type(`e2e.test.cy@gmail.com`)
    cy.get('input[name="password"]').type('e2e.test.cy_wrong')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Check the cookies
    cy.getCookie('supabase-auth-token').should('not.exist')

    // The new page should contain an p with "Email already exists"
    cy.get('span').contains('Invalid login credentials')
  })
})
export {}

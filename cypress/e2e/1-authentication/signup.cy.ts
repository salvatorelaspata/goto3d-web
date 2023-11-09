// create signup test
describe('Signup', () => {
  it('should signup a new user', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "signup" and click it
    cy.get('a[href*="sign-up"]').click()

    // The button should contain "Sign up"
    cy.get('button[type="submit"]').contains('Sign up')

    // Fill out the form
    cy.get('input[name="email"]').type(
      `e2e.test.cy.${Math.round(Math.random() * 100)}@gmail.com`
    )
    cy.get('input[name="password"]').type('e2e.test.cy')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // The new url should include "/dashboard"
    cy.url().should('include', 'dashboard')

    // Check the cookies
    cy.getCookie('supabase-auth-token').should('exist')
  })

  it('should not signup a new user with an existing email', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "signup" and click it
    cy.get('a[href*="sign-up"]').click()

    // The button should contain "Sign up"
    cy.get('button[type="submit"]').contains('Sign up')

    // Fill out the form
    cy.get('input[name="email"]').type('salvatore.la.spata@gmail.com')
    cy.get('input[name="password"]').type('e2e.test.cy')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Check the cookies
    cy.getCookie('supabase-auth-token').should('not.exist')

    // The new page should contain an p with "Email already exists"
    cy.get('span').contains('User already registered')
  })
})
export {}

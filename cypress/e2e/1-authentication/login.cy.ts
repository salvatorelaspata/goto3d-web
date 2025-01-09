// create login test
describe('Login', () => {
  it('should login a user', () => {
    // cy.intercept('/').as('home')
    // Start from the index page
    cy.visit('http://localhost:8080/')

    cy.get('#login').click()

    cy.wait(1000)

    // Fill out the form
    cy.get('input[name="email"]').type(`asd@asd.asd`)
    cy.get('input[name="password"]').type('asdasd')

    // Submit the form
    cy.get('#login-submit').click()

    cy.wait(1000)

    // Check the cookies
    cy.getCookie('sb-hmulxbvwdgyogleepxmu-auth-token').should('exist')
  })

  // it('should register a user', () => {
  //   // Start from the index page
  //   cy.visit('http://localhost:8080/')

  //   cy.get('#login').click()

  //   cy.wait(1000)

  //   // Fill out the form
  //   cy.get('input[name="email"]').type(`
  //   ${Math.random().toString(36).substring(7)}@${Math.random().toString(36).substring(7)}.${Math.random().toString(36).substring(7)}
  //   `)
  //   cy.get('input[name="password"]').type('asdasd')

  //   // Submit the form
  //   cy.get('#register-submit').click()

  //   cy.wait(1000)

  //   // Check the cookies
  //   cy.getCookie('sb-hmulxbvwdgyogleepxmu-auth-token').should('exist')
  // })

  // it('should not login a user with a wrong password', () => {
  //   // Start from the index page
  //   cy.visit('http://localhost:8080/')
  //   cy.wait(1000)

  //   // Find a link with an href attribute containing "login" and click it
  //   // cy.get('a[href*="sign-in"]').click()

  //   // The button should contain "Login"
  //   // cy.get('button[type="submit"]').contains('Login')

  //   // Fill out the form
  //   cy.get('input[name="email"]').type(`e2e.test.cy@gmail.com`)
  //   cy.get('input[name="password"]').type('e2e.test.cy_wrong')

  //   // Submit the form
  //   cy.get('button[type="submit"]').click()

  //   // Check the cookies
  //   cy.getCookie('supabase-auth-token').should('not.exist')

  //   // The new page should contain an p with "Email already exists"
  //   cy.get('span').contains('Invalid login credentials')
  // })
})
export { }

// create test for new project

describe('New Project', () => {
  it('should create a new project without image', () => {
    // Sign in
    cy.visit('http://localhost:8080/')

    cy.get('#login').click()

    cy.wait(1000)

    // Fill out the form
    cy.get('input[name="email"]').type(`asd@asd.asd`)
    cy.get('input[name="password"]').type('asdasd')

    // Submit the form
    cy.get('#login-submit').click()
    cy.wait(500)
    // navigate to new project page
    cy.get('a[href*="projects"]').click()
    cy.wait(500)
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    // Fill out the project form

    cy.get('input[name="name"]').type(`e2e test project ${Date.now()}`)
    cy.get('textarea[name="description"]').type('e2e test project description')

    cy.get('#next-button-1').click()
    cy.wait(1000)
    cy.get('#next-button-2').click()

    // verify the project is created
  })

  it('should create a new project with image', () => {
    // Sign in
    cy.visit('http://localhost:8080/')
    cy.wait(1000)
    // Fill out the login form
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
    // Fill out the project form
    cy.get('input[name="name"]').type('e2e test project')
    cy.get('textarea[name="description"]').type('e2e test project description')
    // upload images
    const fileNames = [
      __dirname + '/files/1.jpg',
      __dirname + '/files/2.jpg',
      __dirname + '/files/3.jpg',
      __dirname + '/files/4.jpg',
      __dirname + '/files/5.jpg',
    ]
    cy.get('input[type="file"]').selectFile([...fileNames])
    cy.get('button[type="submit"]').click()

    cy.intercept('**').as('create')

    cy.wait('@create').then(interception => {
      console.log(interception)
    })
    // verify the project is created
  })
})

export { }

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'tester',
      username: 'testuser',
      password: 'testpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('[data-cy=username-input').type('testuser')
      cy.get('[data-cy=password-input').type('testpassword')
      cy.contains('login').click()

      cy.contains('tester is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('[data-cy=username-input').type('testuser')
      cy.get('[data-cy=password-input').type('wrongpassword')
      cy.contains('login').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('[data-cy=username-input').type('testuser')
      cy.get('[data-cy=password-input').type('testpassword')
      cy.contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('[data-cy=blog-title-input]').type('test blog')
      cy.get('[data-cy=blog-author-input]').type('test author')
      cy.get('[data-cy=blog-url-input]').type('www.testurl.com')
      cy.get('[data-cy=create-blog-button]').click()

      cy.contains('test blog')
      cy.contains('test author')
    })

    describe('When a blog has been created', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('[data-cy=blog-title-input]').type('test blog')
        cy.get('[data-cy=blog-author-input]').type('test author')
        cy.get('[data-cy=blog-url-input]').type('www.testurl.com')
        cy.get('[data-cy=create-blog-button]').click()
      })

      it('A user can like a blog', function() {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
        cy.contains('like').click()
        cy.contains('likes 2')
      })
    })
  })
})

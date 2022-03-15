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

      it('A user can delete their blog', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('.updateMsg')
          .should('contain', 'blog removed')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
      })

      it('A different user cannot delete the blog', function() {
        const user2 = {
          name: 'tester2',
          username: 'testuser2',
          password: 'testpassword'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user2)
        cy.contains('logout').click()
        cy.get('[data-cy=username-input').type('testuser2')
        cy.get('[data-cy=password-input').type('testpassword')
        cy.contains('login').click()
        cy.contains('view').click()

        cy.contains('remove').should('not.exist')
      })
    })

    describe('When multiple blog have been created', function() {
      beforeEach(function() {
        cy.get('[data-cy=togglable-button]').click()
        cy.get('[data-cy=blog-title-input]').type('test blog')
        cy.get('[data-cy=blog-author-input]').type('test author')
        cy.get('[data-cy=blog-url-input]').type('www.testurl.com')
        cy.get('[data-cy=create-blog-button]').click()
        cy.get('[data-cy=togglable-button]').click()
        cy.get('[data-cy=blog-title-input]').type('test blog2')
        cy.get('[data-cy=blog-author-input]').type('test author2')
        cy.get('[data-cy=blog-url-input]').type('www.testurl2.com')
        cy.get('[data-cy=create-blog-button]').click()
        cy.get('[data-cy=togglable-button]').click()
        cy.get('[data-cy=blog-title-input]').type('test blog3')
        cy.get('[data-cy=blog-author-input]').type('test author3')
        cy.get('[data-cy=blog-url-input]').type('www.testurl3.com')
        cy.get('[data-cy=create-blog-button]').click()
        cy.contains('test blog3 test author3')
      })

      it('test', function() {
        cy.get('[data-cy=blog-post]')
          .each(($el) => {
            cy.get($el).contains('view').click()
          })

        cy.get('[data-cy=like-button')
          .each(($el, index) => {
            for (let i = 0; i <= index; i++) {
              cy.get($el).click()
              cy.wait(200)
            }
          })

        cy.contains('likes 3')
          .then(() => {
            cy.get('[data-cy=blog-post]')
              .each(($el, index) => {
                cy.get($el).contains(`likes ${3 - index}`)
              })
          })
      })
    })
  })
})
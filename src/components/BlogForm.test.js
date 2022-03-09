import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('BlogForm sends the right details to submit handler', () => {
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)
  const inputTitle = container.querySelector('#blog-title-input')
  const inputAuthor = container.querySelector('#blog-author-input')
  const inputUrl = container.querySelector('#blog-url-input')
  const sendButton = screen.getByText('create')

  userEvent.type(inputTitle, 'testing title...')
  userEvent.type(inputAuthor, 'testing author...')
  userEvent.type(inputUrl, 'testing url...')
  userEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url...')
})
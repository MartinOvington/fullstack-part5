import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('initially renders only title and author', () => {
  const note = {
    title: 'test blog',
    author: 'test author',
    url: 'www.google.com',
    likes: 0
  }

  const { container } = render(<Blog blog={note} />)
  screen.debug()

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(/test blog/)
  expect(div).toHaveTextContent(/test author/)
  expect(div).not.toHaveTextContent(/www.google.com/)
  expect(div).not.toHaveTextContent(/likes:/)
})
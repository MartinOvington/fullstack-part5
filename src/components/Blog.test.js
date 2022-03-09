import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog element tests', () => {
  const note = {
    title: 'test blog',
    author: 'test author',
    url: 'www.google.com',
    likes: 0
  }

  test('initially renders only title and author', () => {
    const { container } = render(<Blog blog={note} />)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(/test blog/)
    expect(div).toHaveTextContent(/test author/)
    expect(div).not.toHaveTextContent(/www.google.com/)
    expect(div).not.toHaveTextContent(/likes/)
  })

  test('also renders url and likes when view is clicked', () => {
    const { container } = render(<Blog blog={note} />)
    const button = screen.getByText('view')
    userEvent.click(button)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(/test blog/)
    expect(div).toHaveTextContent(/test author/)
    expect(div).toHaveTextContent(/www.google.com/)
    expect(div).toHaveTextContent(/likes/)
  })

  test('clicking like button twice calls handler twice', () => {

    const mockHandler = jest.fn()

    render(<Blog blog={note} increaseLikes={mockHandler} />)
    const viewButton = screen.getByText('view')

    userEvent.click(viewButton)

    const likeButton = screen.getByText('like')

    userEvent.click(likeButton)
    userEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
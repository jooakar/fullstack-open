import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with the right details on submit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByPlaceholderText('title'), 'A new blog')
  await user.type(screen.getByPlaceholderText('author'), 'Jane Doe')
  await user.type(screen.getByPlaceholderText('url'), 'http://example.com/new')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'A new blog',
    author: 'Jane Doe',
    url: 'http://example.com/new',
  })
})

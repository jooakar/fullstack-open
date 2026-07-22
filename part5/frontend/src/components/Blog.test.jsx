import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'http://example.com/testing',
  likes: 7,
  user: { username: 'creator', name: 'Creator Name' },
}

describe('<Blog /> single view', () => {
  test('shows blog info and likes but no buttons to unauthenticated users', () => {
    render(<Blog blog={blog} user={null} onLike={vi.fn()} onRemove={vi.fn()} />)

    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()
    expect(screen.getByText('likes', { exact: false })).toHaveTextContent('likes 7')

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows only the like button to an authenticated non-creator', () => {
    render(
      <Blog
        blog={blog}
        user={{ username: 'someoneelse' }}
        onLike={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows the delete button to the creator', () => {
    render(
      <Blog
        blog={blog}
        user={{ username: 'creator' }}
        onLike={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
  })

  test('calls the like handler when the like button is clicked', async () => {
    const mockLike = vi.fn()
    render(
      <Blog
        blog={blog}
        user={{ username: 'creator' }}
        onLike={mockLike}
        onRemove={vi.fn()}
      />,
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'like' }))
    await user.click(screen.getByRole('button', { name: 'like' }))

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})

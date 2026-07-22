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

describe('<Blog />', () => {
  test('renders title and author but not url or likes by default', () => {
    const { container } = render(<Blog blog={blog} onLike={vi.fn()} onRemove={vi.fn()} />)

    const summary = container.querySelector('.blog-summary')
    expect(summary).toHaveTextContent(blog.title)
    expect(summary).toHaveTextContent(blog.author)

    expect(container.querySelector('.blog-details')).toBeNull()
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText('likes', { exact: false })).toBeNull()
  })

  test('shows url and likes after the view button is clicked', async () => {
    render(<Blog blog={blog} onLike={vi.fn()} onRemove={vi.fn()} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText('likes', { exact: false })).toHaveTextContent('likes 7')
  })

  test('calls the like handler once per click', async () => {
    const mockLike = vi.fn()
    render(<Blog blog={blog} onLike={mockLike} onRemove={vi.fn()} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})

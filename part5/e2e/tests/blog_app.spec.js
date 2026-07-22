import { test, expect } from '@playwright/test'
import { loginWith, createBlog, likeBlog } from './helper.js'

const user = { name: 'Main User', username: 'mainuser', password: 'sekret' }

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: user })
    await page.goto('/')
  })

  test('login form is shown by default', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)
      await expect(page.getByText(`${user.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText(`${user.name} logged in`)).not.toBeVisible()
    })
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'A blog created by Playwright',
        author: 'PW',
        url: 'http://pw.test/created',
      })
      await expect(
        page.locator('.blog-summary', { hasText: 'A blog created by Playwright' }),
      ).toBeVisible()
    })

    test.describe('and a blog exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'Likeable blog',
          author: 'PW',
          url: 'http://pw.test/like',
        })
      })

      test('it can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('its creator can delete it', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.locator('.blog', { hasText: 'Likeable blog' })).toHaveCount(0)
      })

      test('only the creator sees the delete button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: { name: 'Other User', username: 'other', password: 'sekret' },
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'other', 'sekret')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      await createBlog(page, { title: 'least liked', author: 'A', url: 'http://a' })
      await createBlog(page, { title: 'most liked', author: 'B', url: 'http://b' })
      await createBlog(page, { title: 'middle liked', author: 'C', url: 'http://c' })

      await likeBlog(page, 'most liked', 3)
      await likeBlog(page, 'middle liked', 2)
      await likeBlog(page, 'least liked', 1)

      const summaries = page.locator('.blog-summary')
      await expect(summaries.nth(0)).toContainText('most liked')
      await expect(summaries.nth(1)).toContainText('middle liked')
      await expect(summaries.nth(2)).toContainText('least liked')
    })
  })
})

import { expect } from '@playwright/test'

export const loginWith = async (page, username, password) => {
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.locator('.blog-summary', { hasText: title })).toBeVisible()
}

// Opens the blog's details and clicks like `times`, waiting for each increment.
export const likeBlog = async (page, title, times) => {
  const blog = page.locator('.blog', { hasText: title })
  await blog.getByRole('button', { name: 'view' }).click()
  const likeButton = blog.getByRole('button', { name: 'like' })
  for (let i = 1; i <= times; i++) {
    await likeButton.click()
    await expect(blog.getByText(`likes ${i}`)).toBeVisible()
  }
}

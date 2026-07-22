import { expect } from '@playwright/test'

export const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('link', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  // redirected to the blog list, where the new blog is linked
  await expect(page.getByRole('link', { name: title })).toBeVisible()
}

export const openBlog = async (page, title) => {
  await page.getByRole('link', { name: title }).click()
}

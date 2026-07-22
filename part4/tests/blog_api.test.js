import { after, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../app.js'
import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'
import { MONGODB_URI } from '../utils/config.js'
import {
  blogsInDb,
  createUser,
  initialBlogs,
  nonExistingId,
} from './test_helper.js'

await mongoose.connect(MONGODB_URI, { family: 4 })

const api = supertest(app)

const login = async (username, password) => {
  const response = await api.post('/api/login').send({ username, password })
  return response.body.token
}

const auth = (token) => ({ Authorization: `Bearer ${token}` })

let token
let user

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  user = await createUser('creator', 'sekret')
  token = await login('creator', 'sekret')

  const saved = await Blog.insertMany(
    initialBlogs.map((blog) => ({ ...blog, user: user._id })),
  )
  user.blogs = saved.map((blog) => blog._id)
  await user.save()
})

after(async () => {
  await mongoose.connection.close()
})

describe('GET /api/blogs', () => {
  test('returns blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs have an id field, not _id', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      assert.ok(blog.id, 'expected id to be defined')
      assert.strictEqual(blog._id, undefined)
    }
  })

  test('blogs include populated creator info', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      assert.strictEqual(blog.user.username, 'creator')
    }
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog and increases the count by one', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set(auth(token))
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    assert.strictEqual(blogs.length, initialBlogs.length + 1)
    const titles = blogs.map((b) => b.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('associates the created blog with the logged in user', async () => {
    const response = await api
      .post('/api/blogs')
      .set(auth(token))
      .send({ title: 'Owned', url: 'https://example.com/owned' })
      .expect(201)

    assert.strictEqual(response.body.user.username, 'creator')

    const usersBlogs = (await User.findById(user._id)).blogs
    assert.ok(usersBlogs.some((id) => id.toString() === response.body.id))
  })

  test('fails with 401 when no token is provided', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'No token', url: 'https://example.com/no-token' })
      .expect(401)

    const blogs = await blogsInDb()
    assert.strictEqual(blogs.length, initialBlogs.length)
  })

  test('defaults likes to 0 when missing', async () => {
    const newBlog = {
      title: 'No likes given',
      author: 'Nobody',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set(auth(token))
      .send(newBlog)
      .expect(201)
    assert.strictEqual(response.body.likes, 0)
  })

  test('responds with 400 when title is missing', async () => {
    await api
      .post('/api/blogs')
      .set(auth(token))
      .send({ author: 'X', url: 'https://example.com' })
      .expect(400)
  })

  test('responds with 400 when url is missing', async () => {
    await api
      .post('/api/blogs')
      .set(auth(token))
      .send({ title: 'No url', author: 'X' })
      .expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('removes the blog and responds with 204 for the creator', async () => {
    const [target] = await blogsInDb()

    await api.delete(`/api/blogs/${target.id}`).set(auth(token)).expect(204)

    const remaining = await blogsInDb()
    assert.strictEqual(remaining.length, initialBlogs.length - 1)
    assert.ok(!remaining.some((b) => b.id === target.id))
  })

  test('responds with 401 when no token is provided', async () => {
    const [target] = await blogsInDb()

    await api.delete(`/api/blogs/${target.id}`).expect(401)

    const remaining = await blogsInDb()
    assert.strictEqual(remaining.length, initialBlogs.length)
  })

  test('responds with 401 when a different user attempts deletion', async () => {
    await createUser('intruder', 'sekret')
    const otherToken = await login('intruder', 'sekret')
    const [target] = await blogsInDb()

    await api
      .delete(`/api/blogs/${target.id}`)
      .set(auth(otherToken))
      .expect(401)

    const remaining = await blogsInDb()
    assert.strictEqual(remaining.length, initialBlogs.length)
  })

  test('responds with 204 even when the id does not exist', async () => {
    const id = await nonExistingId()
    await api.delete(`/api/blogs/${id}`).set(auth(token)).expect(204)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates the likes count of an existing blog', async () => {
    const [target] = await blogsInDb()
    const newLikes = target.likes + 100

    const response = await api
      .put(`/api/blogs/${target.id}`)
      .send({ likes: newLikes })
      .expect(200)

    assert.strictEqual(response.body.likes, newLikes)

    const fromDb = (await blogsInDb()).find((b) => b.id === target.id)
    assert.strictEqual(fromDb.likes, newLikes)
  })

  test('responds with 404 when the id does not exist', async () => {
    const id = await nonExistingId()
    await api.put(`/api/blogs/${id}`).send({ likes: 1 }).expect(404)
  })
})

import { after, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../app.js'
import { User } from '../models/user.js'
import { MONGODB_URI } from '../utils/config.js'
import { createUser, usersInDb } from './test_helper.js'

await mongoose.connect(MONGODB_URI, { family: 4 })
await User.init()

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await createUser('root', 'sekret')
})

after(async () => {
  await mongoose.connection.close()
})

describe('POST /api/users', () => {
  test('creates a valid user', async () => {
    const usersAtStart = await usersInDb()

    const response = await api
      .post('/api/users')
      .send({ username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.passwordHash, undefined)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert.ok(usersAtEnd.map((u) => u.username).includes('mluukkai'))
  })

  const rejects = [
    {
      name: 'when username is taken',
      body: { username: 'root', password: 'sekret' },
      error: 'unique',
    },
    {
      name: 'when username is too short',
      body: { username: 'ab', password: 'sekret' },
      error: 'shorter than the minimum',
    },
    {
      name: 'when username is missing',
      body: { password: 'sekret' },
      error: 'required',
    },
    {
      name: 'when password is too short',
      body: { username: 'validname', password: 'ab' },
      error: 'at least 3 characters',
    },
    {
      name: 'when password is missing',
      body: { username: 'validname' },
      error: 'at least 3 characters',
    },
  ]

  for (const { name, body, error } of rejects) {
    test(`fails with 400 ${name}`, async () => {
      const usersAtStart = await usersInDb()

      const response = await api.post('/api/users').send(body).expect(400)
      assert.ok(response.body.error.includes(error))

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  }
})

describe('GET /api/users', () => {
  test('returns all users as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

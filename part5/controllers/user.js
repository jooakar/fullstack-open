import { Router } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/user.js'

const userRouter = Router()

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  const saved = await user.save()
  response.status(201).json(saved)
})

userRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  response.json(users)
})

export default userRouter

import express from 'express'
import blogRouter from './controllers/blog.js'
import userRouter from './controllers/user.js'
import loginRouter from './controllers/login.js'
import {
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
} from './utils/middleware.js'

const app = express()
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app

import express from 'express'
import blogRouter from './controllers/blog.js'

const app = express()
app.use(express.json())
app.use('/api/blogs', blogRouter)

export default app

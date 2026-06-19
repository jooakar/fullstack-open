import express from 'express'
import blogRouter from './controllers/blog.js'
import { PORT } from './utils/config.js'

const app = express()
app.use(express.json())
app.use('/api/blogs', blogRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

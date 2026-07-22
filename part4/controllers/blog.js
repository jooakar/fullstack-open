import { Router } from 'express'
import { Blog } from '../models/blog.js'

const blogRouter = Router()

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }
  const saved = await new Blog(request.body).save()
  response.status(201).json(saved)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { new: true, runValidators: true, context: 'query' },
  )
  if (!updated) return response.status(404).end()
  response.json(updated)
})

export default blogRouter

import { Router } from 'express'
import { Blog } from '../models/blog.js'
import { userExtractor } from '../utils/middleware.js'

const blogRouter = Router()

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, url, author, likes } = request.body
  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const user = request.user
  const saved = await new Blog({ title, url, author, likes, user: user._id }).save()

  user.blogs = user.blogs.concat(saved._id)
  await user.save()

  await saved.populate('user', { username: 1, name: 1 })
  response.status(201).json(saved)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(204).end()

  if (blog.user.toString() !== request.user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete this blog' })
  }

  await blog.deleteOne()
  request.user.blogs = request.user.blogs.filter(
    (id) => id.toString() !== blog._id.toString(),
  )
  await request.user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { returnDocument: 'after', runValidators: true, context: 'query' },
  ).populate('user', { username: 1, name: 1 })
  if (!updated) return response.status(404).end()
  response.json(updated)
})

export default blogRouter

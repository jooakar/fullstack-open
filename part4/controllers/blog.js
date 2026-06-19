import { Router } from 'express'
import { Blog } from '../models/blog.js'

const blogRouter = Router()

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  });
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

export default blogRouter

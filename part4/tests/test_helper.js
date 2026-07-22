import { Blog } from '../models/blog.js'

export const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

export const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

export const nonExistingId = async () => {
  const blog = new Blog({ title: 'tmp', url: 'tmp' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

import bcrypt from 'bcrypt'
import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'

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

export const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

export const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return new User({ username, name: username, passwordHash }).save()
}

export const nonExistingId = async () => {
  const blog = new Blog({ title: 'tmp', url: 'tmp' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

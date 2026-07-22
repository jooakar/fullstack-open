import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import { Container } from '@mui/material'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      notify(`welcome ${loggedUser.name || loggedUser.username}`)
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      setBlogs((prev) => prev.concat(created))
      notify(`a new blog ${created.title} by ${created.author} added`)
      navigate('/')
    } catch {
      notify('failed to add blog', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updated = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user?.id,
      })
      // preserve the populated creator so it does not disappear until reload
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...updated, user: blog.user } : b)),
      )
    } catch {
      notify('failed to update likes', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      notify(`removed ${blog.title}`)
      navigate('/')
    } catch {
      notify('failed to remove blog', 'error')
    }
  }

  const match = useMatch('/blogs/:id')
  const blogById = match ? blogs.find((b) => b.id === match.params.id) : null

  return (
    <Container>
      <NavBar user={user} onLogout={handleLogout} />
      <Notification notification={notification} />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blogById}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App

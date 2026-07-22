import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      notify(`welcome ${loggedUser.name || loggedUser.username}`)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      setBlogs(blogs.concat(created))
      blogFormRef.current.toggleVisibility()
      notify(`a new blog ${created.title} by ${created.author} added`)
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
      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...updated, user: blog.user } : b)),
      )
    } catch {
      notify('failed to update likes', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notify(`removed ${blog.title}`)
    } catch {
      notify('failed to remove blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogsByLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name || user.username} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogsByLikes.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={likeBlog}
          onRemove={removeBlog}
          canRemove={blog.user?.username === user.username}
        />
      ))}
    </div>
  )
}

export default App

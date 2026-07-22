import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const created = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(created))
      setTitle('')
      setAuthor('')
      setUrl('')
      notify(`a new blog ${created.title} by ${created.author} added`)
    } catch {
      notify('failed to add blog', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={handleCreate}>
      <h2>create new</h2>
      <div>
        title
        <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        author
        <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        url
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name || user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App

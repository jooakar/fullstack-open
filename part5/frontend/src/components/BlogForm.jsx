import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
          <TextField
            id="title"
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            id="author"
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            id="url"
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button variant="contained" type="submit">
            create
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default BlogForm

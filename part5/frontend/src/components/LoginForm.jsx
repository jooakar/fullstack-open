import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ username, password })
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
          <TextField
            id="username"
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            id="password"
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="contained" type="submit">
            login
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default LoginForm

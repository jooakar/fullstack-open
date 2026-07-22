import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NavBar = ({ user, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">
        blogs
      </Button>
      {user && (
        <Button color="inherit" component={Link} to="/create">
          create new blog
        </Button>
      )}
      <Box sx={{ flexGrow: 1 }} />
      {user ? (
        <>
          <Typography component="span" sx={{ mr: 1 }}>
            {user.name || user.username} logged in
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            logout
          </Button>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/login">
          login
        </Button>
      )}
    </Toolbar>
  </AppBar>
)

export default NavBar

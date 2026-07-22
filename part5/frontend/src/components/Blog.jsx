import { Card, CardContent, Typography, Button, Link, Stack } from '@mui/material'

const Blog = ({ blog, user, onLike, onRemove }) => {
  if (!blog) return null

  const canRemove = user && blog.user?.username === user.username

  return (
    <Card className="blog" sx={{ maxWidth: 500, mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {blog.author}
        </Typography>
        <Link href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </Link>
        <Typography className="likes" sx={{ mt: 1 }}>
          likes {blog.likes}
          {user && (
            <Button size="small" onClick={() => onLike(blog)} sx={{ ml: 1 }}>
              like
            </Button>
          )}
        </Typography>
        {blog.user && (
          <Typography sx={{ mt: 1 }}>
            added by {blog.user.name || blog.user.username}
          </Typography>
        )}
        {canRemove && (
          <Stack direction="row" sx={{ mt: 2 }}>
            <Button variant="outlined" color="error" onClick={() => onRemove(blog)}>
              remove
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog

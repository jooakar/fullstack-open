import { Link } from 'react-router-dom'
import { Table, TableBody, TableRow, TableCell } from '@mui/material'

const BlogList = ({ blogs }) => {
  const byLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Table>
        <TableBody>
          {byLikes.map((blog) => (
            <TableRow key={blog.id} className="blog">
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default BlogList

import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, onLike, onRemove, canRemove }) => {
  const [visible, setVisible] = useState(false)

  const creator = blog.user?.name || blog.user?.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          {creator && <div>{creator}</div>}
          {canRemove && <button onClick={() => onRemove(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog

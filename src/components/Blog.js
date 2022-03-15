import { useState } from 'react'
const Blog = ({ blog, increaseLikes, deleteBlog, username }) => {
  const [viewDetails, setViewDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleViewDetails = () => {
    setViewDetails(!viewDetails)
  }

  return (
    <div className='blog' data-cy='blog-post'>
      {viewDetails ?
        <div style={blogStyle}>
          <div>
            {blog.title} {blog.author}
            <button onClick={toggleViewDetails}>hide</button>
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button
              onClick={increaseLikes}
              data-cy='like-button'
            >
              like
            </button>
          </div>
          <div>
            {blog.user? blog.user.name : ''}
          </div>
          {(!blog.user || blog.user.username === username)?
            <button onClick={deleteBlog}>remove</button> :
            ''
          }
        </div> :
        <div style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleViewDetails}>view</button>
        </div>
      }
    </div>
  )
}

export default Blog
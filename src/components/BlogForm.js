import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  

  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        
          <h2>create new</h2>
            title:
            <input
              value={blogTitle}
              onChange={handleTitleChange}
            /><br></br>
            author:
            <input
              value={blogAuthor}
              onChange={handleAuthorChange}
            /><br></br>
            url:
            <input
              value={blogUrl}
              onChange={handleUrlChange}
            /><br></br>
          <button type='submit'>create</button>
        </form>
      </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
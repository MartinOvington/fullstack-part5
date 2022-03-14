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
        <div>
          title:
          <input
            value={blogTitle}
            onChange={handleTitleChange}
            id='blog-title-input'
            data-cy='blog-title-input'
          />
        </div>
        <div>
          author:
          <input
            value={blogAuthor}
            onChange={handleAuthorChange}
            id='blog-author-input'
            data-cy='blog-author-input'
          />
        </div>
        <div>
          url:
          <input
            value={blogUrl}
            onChange={handleUrlChange}
            id='blog-url-input'
            data-cy='blog-url-input'
          />
          <button
            type='submit'
            data-cy='create-blog-button'
          >create</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
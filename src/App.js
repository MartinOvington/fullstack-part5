import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState('error')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappuser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createNotification = (message, msgType) => {
    setMsgType(msgType)
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setMessage(null)
      setUser(user)
      setUsername('')
      setPassword('')
      createNotification('logged in', 'updateMsg')
    } catch (exception) {
      createNotification('wrong username or password', 'error')
    }
  }
  
  const handleLogout = (event) => {
    event.preventDefault()

    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    createNotification('logged out', 'updateMsg')
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        createNotification(`a new blog ${blogTitle} by ${blogAuthor}`, 'updateMsg')
        setBlogs(blogs.concat(returnedBlog))
        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
      })
      .catch(error => {
        createNotification('blog creation failed', 'error')
      })
  }

  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
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
      </div>
    </form>  
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} msgType={msgType} />
      { user === null ?
        loginForm() :
        <div>
          {user.name} is logged in
          <button onClick={handleLogout}>
            logout
          </button>
          {blogForm()}
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggleable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState('error')

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs( blogs )
      })
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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      createNotification(
        `a new blog 
        ${blogObject.title === undefined ? '' : blogObject.title} 
        by 
        ${blogObject.author === undefined ? '' : blogObject.author}`,
        'updateMsg')
      setBlogs(blogs.concat(returnedBlog))
    } catch(exception) {
      createNotification('blog creation failed', 'error')
    }
  }

  const increaseLikes = async id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const returnedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch(err) {
      createNotification('was already removed from server', 'error')
      setBlogs(blogs.filter(n => n.id !== id))
    }
  }

  const deleteBlog = async id => {
    const blog = blogs.find(b => b.id === id)
    try {
      if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(b => b.id !== id))
        createNotification('blog removed', 'updateMsg')
      }
    } catch(err) {
      createNotification('was already removed from server', 'error')
      setBlogs(blogs.filter(b => b.id !== id))
    }
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
          data-cy='username-input'
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          data-cy='password-input'
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogFormRef = useRef()

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
          <Togglable
            buttonLabel="new blog"
            ref={blogFormRef}
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.sort((b1, b2) => b2.likes - b1.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog}
                increaseLikes={() => increaseLikes(blog.id)}
                deleteBlog={() => deleteBlog(blog.id)}
                username={user.username}/>
            )}
        </div>
      }
    </div>
  )
}

export default App
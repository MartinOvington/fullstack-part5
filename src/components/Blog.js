import { useState } from 'react'
const Blog = ({blog, increaseLikes}) => {
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
    <div>
      {viewDetails ?
      <div style={blogStyle}>
        {blog.title} {blog.author} 
        <button onClick={toggleViewDetails}>hide</button><br></br>
        {blog.url} <br></br>
        likes {blog.likes}
        <button onClick={increaseLikes}>like</button><br></br>
        {blog.user? blog.user.name : ''} 
      </div> :
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleViewDetails}>view</button>
      </div>
    }
    </div>
)}

export default Blog
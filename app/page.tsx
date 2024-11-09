
'use client'
 
import { useState, useEffect } from 'react'
 
export default function Home() {
  const [posts, setPosts] = useState(null)
 
  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('http://localhost:3000/api/blogs?userId=672af3377664d04aaf053eb1&categoryid=672c4a55fc2840716a533edd&Keywords=Today&enddate=2025-05-17&page=1&limit=10')
      const data = await res.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])
 
  if (!posts) return <div>Loading...</div>
 
  return (
    <ul>
      {posts.map((post:[]) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
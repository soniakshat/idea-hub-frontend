import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPosts = () => {
  const [posts, setPosts] = useState([]); // Initialize posts as an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Assume the user ID is available via localStorage
  const userId = localStorage.getItem('userId'); // Replace with your actual method to get the user ID
  
  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // Make GET request to fetch the user's posts with userId as a query parameter
          const response = await axios.get('/api/posts/myposts', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
            },
            params: { userId } // Sending userId as a query parameter
          });
          
          console.log(response.data); // Log response to verify the format

          if (Array.isArray(response.data)) {
            setPosts(response.data); // Store the posts in state
          } else {
            setError('Unexpected response format');
          }
        } catch (error) {
          console.error(error);
          setError('Failed to load posts');
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    } else {
      setError('User not logged in');
    }
  }, [userId]);

  const handleEdit = (post) => {
    // Redirect to the edit post page
    window.location.href = `/edit-post/${post._id}`;
  };

  return (
    <div>
      <h2>My Posts</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {posts && posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button onClick={() => handleEdit(post)}>Edit</button>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No posts found</p>
      )}
    </div>
  );
};

export default MyPosts;

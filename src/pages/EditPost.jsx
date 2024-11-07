import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details for editing
    axios.get(`/api/posts/${postId}`)
      .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [postId]);

  const handleSave = () => {
    // Send updated post data to the server
    axios.put(`/api/posts/${postId}`, { title, content })
      .then(() => {
        navigate('/myposts'); // Redirect after save
      })
      .catch(error => console.error('Error updating post:', error));
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default EditPost;
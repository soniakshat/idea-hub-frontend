// src/pages/EditPost.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Ensure postId is a string
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details for editing
    axios
      .get(`/api/posts/${postId}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId]);

  const handleSave = () => {
    // Send updated post data to the server
    axios
      .put(`/api/posts/${postId}`, { title, content })
      .then(() => {
        navigate('/myposts'); // Redirect after save
      })
      .catch((error) => console.error('Error updating post:', error));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  return (
    <div>
      <h2>Edit Post</h2>
      <input type="text" value={title} onChange={handleTitleChange} />
      <textarea value={content} onChange={handleContentChange} />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditPost;

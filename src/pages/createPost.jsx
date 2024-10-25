// src/pages/createPost.jsx
import { useState } from 'react';
import { Button, Input, Form, message } from 'antd'; // Import Ant Design components
import API from '../api'; // Import Axios instance
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar component

function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token

      const postData = {
        post: {
          author: {
            id: 'T111', // Hardcoded author ID for now
            name: 'Tony', // Hardcoded author name for now
          },
          id: Date.now().toString(), // Generate unique ID for the post
          title: post.title,
          tags: post.tags.split(','), // Convert comma-separated tags to array
          business: [],
          status: post.status,
          content: post.content,
          timestamp: new Date().toISOString(), // Current timestamp
          upvotes: 0,
          downvotes: 0,
          comments: [],
        },
      };

      await API.post('/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to the request
        },
      });

      message.success('Post created successfully!');
      navigate('/'); // Redirect to home page after successful creation
    } catch (error) {
      console.error('Error creating post:', error.response || error);
      message.error('Failed to create post. Please try again.');
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar at the top */}
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Create a New Post</h1>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Title" required>
            <Input
              name="title"
              placeholder="Enter the post title"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Content" required>
            <Input.TextArea
              name="content"
              placeholder="Enter the post content"
              rows={4}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Tags (comma-separated)">
            <Input
              name="tags"
              placeholder="Enter tags (e.g., database, mongodb)"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Status">
            <Input
              name="status"
              placeholder="Enter status (e.g., draft or published)"
              onChange={handleChange}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Create Post
          </Button>
        </Form>
      </div>
    </>
  );
}

export default CreatePost;

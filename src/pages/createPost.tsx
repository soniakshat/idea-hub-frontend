// src/pages/CreatePost.tsx
import React from 'react';
import { useState, ChangeEvent } from 'react';
import { Button, Input, Form, message } from 'antd';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navBar';

interface Post {
  title: string;
  content: string;
  tags: string;
  business: string;
  status: string;
}

const CreatePost: React.FC = () => {
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    tags: '',
    business: '',
    status: 'draft',
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const user_name = localStorage.getItem('userName');
      const user_id = localStorage.getItem('userId');

      const postData = {
        post: {
          author: {
            id: user_id?.toString() || '', // Ensure id is a string
            name: user_name || '', // Ensure name is not null
          },
          id: Date.now().toString(),
          title: post.title,
          tags: post.tags.split(',').map((tag) => tag.trim()),
          business: post.business.split(',').map((business) => business.trim()),
          status: post.status,
          content: post.content,
          timestamp: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          comments: [],
        },
      };

      await API.post('/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Post created successfully!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error creating post:', error.response || error);
      message.error('Failed to create post. Please try again.');
    }
  };

  return (
    <>
      <Navbar/> {/* Navbar at the top */}
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Create a New Post</h1>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Title" required>
            <Input
              name="title"
              placeholder="Enter the post title"
              onChange={handleChange}
              value={post.title}
            />
          </Form.Item>

          <Form.Item label="Content" required>
            <Input.TextArea
              name="content"
              placeholder="Enter the post content"
              rows={4}
              onChange={handleChange}
              value={post.content}
            />
          </Form.Item>

          <Form.Item label="Tags (comma-separated)">
            <Input
              name="tags"
              placeholder="Enter tags (e.g., database, mongodb)"
              onChange={handleChange}
              value={post.tags}
            />
          </Form.Item>

          <Form.Item label="Business (comma-separated)">
            <Input
              name="business"
              placeholder="Enter business (e.g., innovations, amrock, mortgage)"
              onChange={handleChange}
              value={post.business}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Create Post
          </Button>
        </Form>
      </div>
    </>
  );
};

export default CreatePost;

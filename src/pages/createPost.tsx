import React from 'react';
import { message } from 'antd';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import PostForm from '../components/PostForm.tsx';
import { formatDate, generateUniqueId, parseCommaSeparatedValues, getLocalStorageItem } from '../utils/utils';

interface Post {
  title: string;
  content: string;
  tags: string;
  business: string;
  status: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (postData: Post) => {
    try {
      const token = getLocalStorageItem('authToken');
      const userName = getLocalStorageItem('userName');
      const userId = getLocalStorageItem('userId');

      const postPayload = {
        post: {
          author: {
            id: userId?.toString() || '',
            name: userName || '',
          },
          id: generateUniqueId(),
          title: postData.title,
          tags: parseCommaSeparatedValues(postData.tags),
          business: parseCommaSeparatedValues(postData.business),
          status: postData.status,
          content: postData.content,
          timestamp: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          comments: [],
        },
      };

      await API.post('/api/posts', postPayload, {
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
      <Navbar expandFilter={() => {}} />
      <PostForm
        initialPost={{
          title: '',
          content: '',
          tags: '',
          business: '',
          status: 'draft',
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CreatePost;

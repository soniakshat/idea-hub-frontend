// src/pages/Home.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { Skeleton, Row, Col } from 'antd';

interface Post {
  _id: string; // Added `_id` property
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  status: string;
  timestamp: string;
  author: {
    name: string;
  };
  tags?: string[];
  business?: string[];
  comments: { id: string; content: string; author: string; timestamp: string }[];
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const statusColors: Record<string, string> = {
    draft: "#A9A9A9",
    "in review": "#FFD700",
    approved: "#32CD32",
    "in development": "#1E90FF",
    testing: "#FF8C00",
    completed: "#4B0082",
    archived: "#808080",
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await API.get('/api/posts/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleUpvote = async (postId: string, isUpvoted: boolean, index: number) => {
    try {
      const increment = isUpvoted ? -1 : 1;
      const response = await API.put(`/api/posts/${postId}/upvote`, { increment });

      const updatedPosts = [...filteredPosts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        upvotes: response.data.upvotes,
        isUpvoted: !isUpvoted,
      };
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error updating upvote:', error);
    }
  };

  const handleDownvote = async (postId: string, isDownvoted: boolean, index: number) => {
    try {
      const increment = isDownvoted ? -1 : 1;
      const response = await API.put(`/api/posts/${postId}/downvote`, { increment });

      const updatedPosts = [...filteredPosts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        downvotes: response.data.downvotes,
        isDownvoted: !isDownvoted,
      };
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error updating downvote:', error);
    }
  };

 if (loading) {
  return (
     <>
       <Navbar/>
     <Row gutter={[16, 16]} style={{ padding: '20px' }}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Col>
      ))}
       </Row>
       </>
  );
}

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post._id} // Using `_id` as the unique key
              post={post}
              index={index}
              statusColors={statusColors}
              formatDate={formatDate}
              handleUpvote={handleUpvote}
              handleDownvote={handleDownvote}
            />
          ))}
        </Row>
      </div>
    </>
  );
}

export default Home;

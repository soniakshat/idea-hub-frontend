// src/pages/MyPosts.tsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/navBar';
import PostCard from '../components/PostCard';
import { Skeleton, Row, Col } from 'antd';

interface Post {
  _id: string;
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  tags?: string[];
  business?: string[];
  status: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  comments: { id: string; content: string }[];
}

const statusColors: Record<string, string> = {
  draft: "#FF5A5F",
  "in review": "#FFD700",
  approved: "#00FF7F",
  "in development": "#00BFFF",
  testing: "#FFA500",
  completed: "#8A2BE2",
  archived: "#D3D3D3",
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

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        
        const response = await API.get(`/api/posts/myposts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
        });

        // Add default values for fields if they are missing
        const postsWithDefaults = response.data.map((post: Partial<Post>) => ({
          _id: post._id || post.id, // Ensure `_id` is set, using `id` if available
          title: post.title || '',
          content: post.content || '',
          author: post.author || { name: 'Unknown' },
          tags: post.tags || [],
          business: post.business || [],
          status: post.status || 'draft',
          timestamp: post.timestamp || new Date().toISOString(),
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          isUpvoted: post.isUpvoted || false,
          isDownvoted: post.isDownvoted || false,
          comments: post.comments || [],
        })) as Post[];

        setPosts(postsWithDefaults);
        setFilteredPosts(postsWithDefaults);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
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
              key={post._id}
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
};

export default MyPosts;

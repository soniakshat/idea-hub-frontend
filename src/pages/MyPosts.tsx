// src/pages/MyPosts.tsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar.tsx';
import PostCard from '../components/PostCard.tsx';
import PostFilter from '../components/PostFilter.tsx'; // Import PostFilter component
import { Skeleton, Row, Col } from 'antd';
import { formatDate, getLocalStorageItem } from '../utils/utils';
import { handleSearch, handleUpvote, handleDownvote } from '../utils/postActions';
import { Post } from '../types/Post';

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableBusinesses, setAvailableBusinesses] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  const statusColors: Record<string, string> = {
    "draft": "#A9A9A9",
    "in review": "#FFD700",
    "approved": "#32CD32",
    "in development": "#1E90FF",
    "testing": "#FF8C00",
    "completed": "#4B0082",
    "archived": "#808080",
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = getLocalStorageItem('authToken');
        const userId = getLocalStorageItem('userId');

        const response = await API.get('/api/posts/myposts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
        });

        setPosts(response.data);
        setFilteredPosts(response.data);

        // Extract tags and businesses for filter options
        const tags = Array.from(new Set(response.data.flatMap((post: Post) => post.tags || []))) as string[];
        const businesses = Array.from(new Set(response.data.flatMap((post: Post) => post.business || []))) as string[];

        setAvailableTags(tags);
        setAvailableBusinesses(businesses);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleSearchPosts = (query: string) => {
    setFilteredPosts(handleSearch(posts, query));
  };

  const applyFilters = (selectedTags: string[], selectedBusinesses: string[]) => {
    const filtered = posts.filter((post) =>
      (selectedTags.length === 0 || (post.tags && post.tags.some((tag) => selectedTags.includes(tag)))) &&
      (selectedBusinesses.length === 0 || (post.business && post.business.some((business) => selectedBusinesses.includes(business))))
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return (
      <>
        <Navbar expandFilter={() => {}} />
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
      <Navbar
        onSearch={handleSearchPosts}
        expandFilter={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      {isFilterExpanded && (
        <PostFilter
          tags={availableTags}
          businesses={availableBusinesses}
          onApplyFilters={applyFilters}
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(false)}
        />
      )}

      <div style={{ padding: '20px', marginLeft: isFilterExpanded ? '300px' : '0', transition: 'margin-left 0.3s ease' }}>
        <Row gutter={[16, 16]}>
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              index={index}
              statusColors={statusColors}
              formatDate={formatDate}
              handleUpvote={() => handleUpvote(post._id, post.isUpvoted, index, filteredPosts, setFilteredPosts)}
              handleDownvote={() => handleDownvote(post._id, post.isDownvoted, index, filteredPosts, setFilteredPosts)}
            />
          ))}
        </Row>
      </div>
    </>
  );
};

export default MyPosts;

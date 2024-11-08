import { useEffect, useState } from 'react';
import { Row } from 'antd';
import API from '../api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    "draft": "#A9A9A9",
    "in review": "#FFD700",
    "approved": "#32CD32",
    "in development": "#1E90FF",
    "testing": "#FF8C00",
    "completed": "#4B0082",
    "archived": "#808080"
  };

  const formatDate = (timestamp) => {
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

        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleSearch = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleUpvote = async (postId, isUpvoted, index) => {
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

  const handleDownvote = async (postId, isDownvoted, index) => {
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
    return <h2>Loading your posts...</h2>;
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.id}
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

export default MyPosts;

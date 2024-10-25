// src/pages/home.jsx
import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import { Card, Row, Col } from 'antd';

const { Meta } = Card;

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from the API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await API.get('/api/posts/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data); // Store fetched posts
        setFilteredPosts(response.data); // Initialize filtered posts with all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle search input from the navbar
  const handleSearch = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered); // Update filtered posts based on query
  };

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  return (
    <>
      <Navbar onSearch={handleSearch} /> {/* Pass handleSearch to Navbar */}
      <div style={{ padding: '20px' }}>
        <h1>All Posts</h1>
        <Row gutter={[16, 16]}>
          {filteredPosts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            filteredPosts.map((post) => (
              <Col key={post.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable style={{ width: '100%' }}>
                  <Meta title={post.title} description={post.content} />
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </>
  );
}

export default Home;

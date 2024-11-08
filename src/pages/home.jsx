import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import API from '../api';
import Navbar from '../components/Navbar';

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility function to convert timestamp to a readable format
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

  // Handle upvote toggle
  const handleUpvote = async (postId, isUpvoted, index) => {
    try {
      const increment = isUpvoted ? -1 : 1;
      const response = await API.put(`/api/posts/${postId}/upvote`, { increment });

      const updatedPosts = [...filteredPosts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        upvotes: response.data.upvotes,
        isUpvoted: !isUpvoted, // Toggle isUpvoted state
      };
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error updating upvote:', error);
    }
  };

  // Handle downvote toggle
  const handleDownvote = async (postId, isDownvoted, index) => {
    try {
      const increment = isDownvoted ? -1 : 1;
      const response = await API.put(`/api/posts/${postId}/downvote`, { increment });

      const updatedPosts = [...filteredPosts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        downvotes: response.data.downvotes,
        isDownvoted: !isDownvoted, // Toggle isUpvoted state
      };
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error updating upvote:', error);
    }
  };

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {filteredPosts.map((post, index) => (
            <Col key={post.id} xs={24} sm={12} md={8} lg={6}>
              <article
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  padding: '20px',
                  transition: 'transform 0.2s ease',
                }}
              >
                <header
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '8px' }}>
                      {post.title}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>
                      <time dateTime={post.timestamp}>{formatDate(post.timestamp)}</time>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                    }}
                  >
                    {post.status}
                  </span>
                </header>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#666',
                    }}
                  >
                    {post.author.name[0]}
                  </div>
                  <span>{post.author.name}</span>
                </div>

                <div style={{ marginBottom: '16px', color: '#4a4a4a' }}>{post.content}</div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {post.tags && post.tags.length > 0
                    ? post.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: '#e9ecef',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            color: '#495057',
                          }}
                        >
                          {tag}
                        </span>
                      ))
                    : (
                        <span
                          style={{
                            backgroundColor: '#e9ecef',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            color: '#495057',
                          }}
                        >
                          No general tags available
                        </span>
                    )}

                  {post.business &&
                    post.business.map((businessTag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                        }}
                      >
                        {businessTag}
                      </span>
                    ))}
                </div>

                <footer
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #eee',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                      onClick={() => handleUpvote(post._id, post.isUpvoted, index)} 
                    >
                      <ArrowUpOutlined
                        style={{
                          color: post.isUpvoted ? '#4caf50' : '#666',
                          fontSize: '1.2rem',
                        }}
                      />
                      {post.upvotes}
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                      onClick={() => handleDownvote(post._id, post.isDownvoted, index)}
                    >
                      <ArrowDownOutlined
                        style={{
                          color: post.isDownvoted ? '#FF0000' : '#666',
                          fontSize: '1.2rem',
                        }}
                      />
                      {post.downvotes}
                    </button>
                  </div>
                  <div>{post.comments.length} comments</div>
                </footer>
              </article>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Home;

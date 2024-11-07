import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import API from '../api';
import Navbar from '../components/Navbar';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility function to format date
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

  // Fetch user's posts on component mount
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId'); // Adjust based on your storage strategy
        
        const response = await API.get(`/api/posts/myposts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId }, // Send userId as query parameter if needed
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

  // Search handler for filtering posts
  const handleSearch = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return <h2>Loading your posts...</h2>;
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {filteredPosts.map((post) => (
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
                      <time dateTime={post.timestamp}>
                        {formatDate(post.timestamp)}
                      </time>
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
                    >
                      ↑ {post.upvotes}
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
                    >
                      ↓ {post.downvotes}
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

export default MyPosts;
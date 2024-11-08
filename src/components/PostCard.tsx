// src/components/PostCard.tsx
import React from 'react';
import { Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

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

interface PostCardProps {
  post: Post;
  index: number;
  statusColors: Record<string, string>;
  formatDate: (timestamp: string) => string;
  handleUpvote: (postId: string, isUpvoted: boolean, index: number) => void;
  handleDownvote: (postId: string, isDownvoted: boolean, index: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  statusColors,
  formatDate,
  handleUpvote,
  handleDownvote,
}) => {
  return (
    <Col key={post.id || post._id} xs={24} sm={12} md={8} lg={6}>
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
              backgroundColor: statusColors[post.status.toLowerCase()] || '#000000',
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
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag, idx) => (
              <span
                key={idx}
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
          ) : (
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
            post.business.map((businessTag, idx) => (
              <span
                key={idx}
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
  );
};

export default PostCard;

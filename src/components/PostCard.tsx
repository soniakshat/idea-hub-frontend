// src/components/PostCard.tsx
import React from 'react';
import { Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined , CommentOutlined} from '@ant-design/icons';
import './PostCard.scss';
import { Post } from '../types/Post';

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
  const filteredTags = post.tags?.filter((tag) => tag.trim() !== '') || [];
  const filteredBusiness = post.business?.filter((businessTag) => businessTag.trim() !== '') || [];

  return (
    <Col key={post.id} xs={24} sm={12} md={8} lg={6}>
      <article className="post-card">
        <header className="post-card-header">
          <div>
            <h2 className="post-card-title">{post.title}</h2>
            <div className="post-card-date">
              <time dateTime={post.timestamp}>{formatDate(post.timestamp)}</time>
            </div>
          </div>
          <span
            className="post-card-status"
            style={{ backgroundColor: statusColors[post.status?.toLowerCase()] || '#000000' }}
          >
            {post.status}
          </span>
        </header>

        <div className="post-card-author">
          <div className="post-card-author-avatar">{post.author.name[0]}</div>
          <span>{post.author.name}</span>
        </div>

        <div className="post-card-content">{post.content}</div>

        <div className="post-card-tags">
          {filteredTags.map((tag, index) => (
                <span key={index} className="post-card-tag">
                  {tag}
                </span>
              ))}

          {filteredBusiness.map((businessTag, index) => (
            <span key={index} className="post-card-business">
              {businessTag}
            </span>
          ))}
        </div>

        <footer className="post-card-footer">
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              className="post-card-vote-btn"
              onClick={() => handleUpvote(post.id, post.isUpvoted, index)}
            >
              <ArrowUpOutlined
                className={`post-card-vote-icon ${post.isUpvoted ? 'post-card-vote-icon-upvoted' : ''}`}
              />
              {post.upvotes}
            </button>
            <button
              className="post-card-vote-btn"
              onClick={() => handleDownvote(post.id, post.isDownvoted, index)}
            >
              <ArrowDownOutlined
                className={`post-card-vote-icon ${post.isDownvoted ? 'post-card-vote-icon-downvoted' : ''}`}
              />
              {post.downvotes}
            </button>
          </div>
          <div><CommentOutlined/> {post.comments.length}</div>
        </footer>
      </article>
    </Col>
  );
};

export default PostCard;

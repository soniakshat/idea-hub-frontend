import React, { useState } from "react";
import { Col } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import "./PostCard.scss";
import { Post } from "../types/Post";
import PostDetailPopup from "./PostDetailPopup";

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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const handleCardClick = () => {
    setIsPopupVisible(true);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const handleCommentSubmit = (updatedPost: Post) => {
    setCurrentPost(updatedPost); // Update the post with the new comments
  };

  const filteredTags =
    currentPost.tags?.filter((tag) => tag.trim() !== "") || [];
  const filteredBusiness =
    currentPost.business?.filter((businessTag) => businessTag.trim() !== "") ||
    [];

  return (
    <>
      <Col key={currentPost.id} xs={24} sm={12} md={8} lg={6}>
        <article className="post-card" onClick={handleCardClick}>
          <header className="post-card-header">
            <div>
              <h2 className="post-card-title">{currentPost.title}</h2>
              <div className="post-card-date">
                <time dateTime={currentPost.timestamp}>
                  {formatDate(currentPost.timestamp)}
                </time>
              </div>
            </div>
            <span
              className="post-card-status"
              style={{
                backgroundColor:
                  statusColors[currentPost.status?.toLowerCase()] || "#000000",
              }}
            >
              {currentPost.status}
            </span>
          </header>

          <div className="post-card-author">
            <div className="post-card-author-avatar">
              {currentPost.author.name[0]}
            </div>
            <span>{currentPost.author.name}</span>
          </div>

          <div className="post-card-content">{currentPost.content}</div>

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
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                className="post-card-vote-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpvote(currentPost.id, currentPost.isUpvoted, index);
                }}
              >
                <ArrowUpOutlined
                  className={`post-card-vote-icon ${
                    currentPost.isUpvoted ? "post-card-vote-icon-upvoted" : ""
                  }`}
                />
                {currentPost.upvotes}
              </button>
              <button
                className="post-card-vote-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownvote(
                    currentPost.id,
                    currentPost.isDownvoted,
                    index
                  );
                }}
              >
                <ArrowDownOutlined
                  className={`post-card-vote-icon ${
                    currentPost.isDownvoted
                      ? "post-card-vote-icon-downvoted"
                      : ""
                  }`}
                />
                {currentPost.downvotes}
              </button>
            </div>
            <div>
              <CommentOutlined /> {currentPost.comments.length}
            </div>
          </footer>
        </article>
      </Col>

      <PostDetailPopup
        visible={isPopupVisible}
        post={currentPost}
        onClose={handlePopupClose}
        onCommentSubmit={handleCommentSubmit}
      />
    </>
  );
};

export default PostCard;

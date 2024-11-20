import React, { useState } from "react";
import { Col, message } from "antd";
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
  handleUpvote: () => Promise<void>; // Add this
  handleDownvote: () => Promise<void>; // Add this
  onDelete: (deletedPostId: string) => void; // Add delete callback
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  statusColors,
  formatDate,
  onDelete, // Receive delete callback
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

  const handleUpvote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Authentication required!");
        return;
      }

      const response = await fetch(
        `https://api.techqubits.com/api/posts/${currentPost._id}/upvote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ increment: 1 }), // Upvote by 1
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to upvote:", errorData);
        throw new Error("Failed to upvote");
      }

      const updatedPost = await response.json();
      setCurrentPost(updatedPost); // Update post with the new upvote count
      message.success("Successfully upvoted!");
    } catch (error) {
      console.error("Error during upvote:", error);
      message.error("Failed to upvote");
    }
  };

  const handleDownvote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Authentication required!");
        return;
      }

      const response = await fetch(
        `https://api.techqubits.com/api/posts/${currentPost._id}/downvote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ increment: 1 }), // Downvote by 1
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to downvote:", errorData);
        throw new Error("Failed to downvote");
      }

      const updatedPost = await response.json();
      setCurrentPost(updatedPost); // Update post with the new downvote count
      message.success("Successfully downvoted!");
    } catch (error) {
      console.error("Error during downvote:", error);
      message.error("Failed to downvote");
    }
  };

  const handleDelete = (deletedPostId: string) => {
    onDelete(deletedPostId); // Notify parent component about the deletion
    setIsPopupVisible(false); // Close the popup
    message.success("Post deleted successfully!");
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
                  handleUpvote();
                }}
              >
                <ArrowUpOutlined
                  className={`post-card-vote-icon ${
                    currentPost.isUpvoted
                      ? "post-card-vote-icon-upvoted"
                      : "post-card-vote-icon-upvoted"
                  }`}
                />
                {currentPost.upvotes}
              </button>
              <button
                className="post-card-vote-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownvote();
                }}
              >
                <ArrowDownOutlined
                  className={`post-card-vote-icon ${
                    currentPost.isDownvoted
                      ? "post-card-vote-icon-downvoted"
                      : "post-card-vote-icon-downvoted"
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
        onDelete={handleDelete} // Pass delete handler to popup
      />
    </>
  );
};

export default PostCard;

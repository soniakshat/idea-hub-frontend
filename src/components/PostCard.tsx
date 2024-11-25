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
  formatDate: (timestamp: string) => string;
  handleUpvote: () => Promise<void>; // Add this
  handleDownvote: () => Promise<void>; // Add this
  onDelete: (deletedPostId: string) => void; // Add delete callback
}

const statusColors: Record<string, { bg: string; font: string }> = {
  draft: { bg: "#FFC4C4", font: "#8B0000" }, // Light Red with Dark Red font
  review: { bg: "#FFD9A0", font: "#8B4500" }, // Light Orange with Burnt Orange font
  approved: { bg: "#C4FFC4", font: "#006400" }, // Light Green with Dark Green font
  dev: { bg: "#A0D9FF", font: "#003366" }, // Light Blue with Navy font
  testing: { bg: "#FFF4A0", font: "#8B7500" }, // Light Yellow with Golden Brown font
  completed: { bg: "#D9A0FF", font: "#5D0071" }, // Light Purple with Deep Purple font
  archived: { bg: "#C4C4FF", font: "#00008B" }, // Light Lavender with Dark Blue font
  published: { bg: "#FFC4E6", font: "#8B004B" }, // Light Pink with Deep Rose font
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
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
  };

  const filteredTags =
    currentPost.tags?.filter((tag) => tag.trim() !== "") || [];
  const filteredBusiness =
    currentPost.business?.filter((businessTag) => businessTag.trim() !== "") ||
    [];

  interface TruncateTextProps {
    text: string;
  }

  const TruncateText: React.FC<TruncateTextProps> = ({ text }) => {
    const maxCharToShow = 500; // Fixed limit
    const indicator = "...";
    const truncatedChars = maxCharToShow - indicator.length;

    const formattedText =
      text.length > maxCharToShow
        ? text.slice(0, truncatedChars) + indicator
        : text;

    return <div className="post-card-content">{formattedText}</div>;
  };

  return (
    <>
      <Col
        className="post-card-container"
        key={currentPost.id}
        xs={24}
        sm={12}
        md={8}
        lg={6}
      >
        <article className="post-card" onClick={handleCardClick}>
          <div className="post-card-author">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="post-card-author-avatar">
                {currentPost.author.name[0]}
              </div>
              <span>{currentPost.author.name}</span>
            </div>
            <span
              className="post-card-status"
              style={{
                backgroundColor:
                  statusColors[currentPost.status?.toLowerCase()]?.bg ||
                  "#000000",
                color:
                  statusColors[currentPost.status?.toLowerCase()]?.font ||
                  "#FFFFFF",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                // fontWeight: "bold", // Optional for emphasis
              }}
            >
              {currentPost.status}
            </span>
          </div>
          <header className="post-card-header">
            <div>
              <h2 className="post-card-title">{currentPost.title}</h2>
              <div className="post-card-date">
                <time dateTime={currentPost.timestamp}>
                  {formatDate(currentPost.timestamp)}
                </time>
              </div>
            </div>
          </header>

          <TruncateText text={currentPost.content} />

          <div className="post-card-tags">
            {filteredTags.map((tag, index) => (
              <span key={index} className="post-card-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="post-card-tags">
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

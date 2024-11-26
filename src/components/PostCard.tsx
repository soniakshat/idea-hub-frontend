import React, { useState, useEffect } from "react";
import { Col, message } from "antd";
import { CommentOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import "./PostCard.scss";
import { Post } from "../types/Post";
import PostDetailPopup from "./PostDetailPopup";
import API from "../api";

interface PostCardProps {
  post: Post;
  index: number;
  formatDate: (timestamp: string) => string;
  onDelete: (deletedPostId: string) => void;
}

const statusColors: Record<string, { bg: string; font: string }> = {
  draft: { bg: "#FFC4C4", font: "#8B0000" },
  review: { bg: "#FFD9A0", font: "#8B4500" },
  approved: { bg: "#C4FFC4", font: "#006400" },
  dev: { bg: "#A0D9FF", font: "#003366" },
  testing: { bg: "#FFF4A0", font: "#8B7500" },
  completed: { bg: "#D9A0FF", font: "#5D0071" },
  archived: { bg: "#C4C4FF", font: "#00008B" },
  published: { bg: "#FFC4E6", font: "#8B004B" },
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  formatDate,
  onDelete, // Receive delete callback
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);

  const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

  useEffect(() => {
    // Check if the current user has already liked this post
    if (currentPost.likes.includes(userId || "")) {
      setIsLiked(true);
    }
  }, [currentPost.likes, userId]);

  const handleCardClick = () => {
    setIsPopupVisible(true);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const handleCommentSubmit = (updatedPost: Post) => {
    setCurrentPost(updatedPost); // Update the post with the new comments
  };

  const handleToggleLike = async () => {
    try {
      if (!userId) {
        message.error("User ID missing!");
        return;
      }

      // Use the API instance for the request
      const response = await API.put(
        `/api/posts/like/${currentPost._id}/by/${userId}`
      );

      const result = response.data; // Extract data from the response
      setIsLiked(result.status === 1); // Update like status

      // Update likes in the current post
      if (result.status === 1) {
        setCurrentPost((prevPost) => ({
          ...prevPost,
          likes: [...prevPost.likes, userId],
        }));
      } else {
        setCurrentPost((prevPost) => ({
          ...prevPost,
          likes: prevPost.likes.filter((id) => id !== userId),
        }));
      }
    } catch (error) {
      console.error("Error during toggle like:", error);
      message.error("Failed to toggle like");
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
                  handleToggleLike();
                }}
              >
                {isLiked ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )}{" "}
                {currentPost.likes.length}
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

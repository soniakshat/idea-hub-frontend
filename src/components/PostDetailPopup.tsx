import React, { useState } from "react";
import { Modal, Input, Tag, message, Popconfirm, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Post } from "../types/Post";
import { formatDate, getLocalStorageItem } from "../utils/utils";
import "./PostDetailPopup.scss";
import { useNavigate } from "react-router-dom";
import API from "../api";

// Function to convert URLs in content to clickable links
const convertUrlsToLinks = (content: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

interface PostDetailPopupProps {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onCommentSubmit: (updatedPost: Post) => void;
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

const PostDetailPopup: React.FC<PostDetailPopupProps> = ({
  visible,
  post,
  onClose,
  onCommentSubmit,
  onDelete,
}) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState(post.comments);
  const [loading, setLoading] = useState(false); // State to manage button loading

  const showButton =
    getLocalStorageItem("is_moderator") === "true" ||
    post.author.id === getLocalStorageItem("userId");

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      setLoading(true); // Disable button while API call is in progress
      try {
        const userId = getLocalStorageItem("userId");
        const userName = getLocalStorageItem("userName");

        if (!userId || !userName) {
          message.error("User information is missing!");
          setLoading(false);
          return;
        }

        // API call to submit comment
        await API.put(`/api/posts/addComment/${post._id}`, {
          id: userId,
          author: userName,
          content: comment,
        });

        const newComment = {
          id: userId,
          author: userName,
          content: comment,
          timestamp: new Date().toISOString(),
        };

        // Update the comments locally
        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
        message.success("Comment added successfully!");

        // Notify parent or update state
        onCommentSubmit({
          ...post,
          comments: [...comments, newComment],
        });
      } catch (error) {
        console.error("Error adding comment:", error);
        message.error("Failed to add comment");
      } finally {
        setLoading(false); // Re-enable button after API call completes
      }
    }
  };

  const handleDelete = async () => {
    try {
      // API call to delete post
      await API.delete(`/api/posts/${post._id}`);
      message.success("Post deleted successfully!");
      onDelete(post._id); // Notify parent component
      onClose(); // Close popup
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post");
    }
  };

  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/edit/${post._id}`);
  };

  // Convert the post content to have clickable links
  const contentWithLinks = convertUrlsToLinks(post.content);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width="100%"
      style={{
        maxHeight: "100vh",
        overflow: "hidden",
        top: 20,
        maxWidth: "65%",
      }}
    >
      <div>
        <div className="post-card-author">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="post-card-author-avatar">{post.author.name[0]}</div>
            <span>{post.author.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "right" }}>
            <span
              className="post-card-status"
              style={{
                backgroundColor:
                  statusColors[post.status?.toLowerCase()]?.bg || "#000000",
                color:
                  statusColors[post.status?.toLowerCase()]?.font || "#FFFFFF",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              {post.status}
            </span>
            &nbsp;&nbsp;&nbsp;
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={onClose}
              >
                <CloseOutlined />
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
            paddingRight: "16px",
          }}
        >
          <header className="post-card-header">
            <div>
              <h2 className="post-card-title">{post.title}</h2>
              <p className="post-card-date">{formatDate(post.timestamp)}</p>
            </div>
          </header>

          <div
            className="post-card-content"
            dangerouslySetInnerHTML={{ __html: contentWithLinks }}
          ></div>
          
          <br />
          <div className="post-card-tags">
            {post.tags?.map((tag, index) => (
              <span key={index} className="post-card-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="post-card-tags">
            {post.business?.map((businessTag, index) => (
              <span key={index} className="post-card-business">
                {businessTag}
              </span>
            ))}
          </div>
          <h4>Comments</h4>
          <div className="post-detail-comments">
            {comments.length === 0 ? (
              <div>No comments yet..!!</div>
            ) : (
              <div className="comment-list">
                {comments.map((c, idx) => (
                  <div key={idx} className="comment-item">
                    <strong>{c.author}</strong>
                    {c.content}
                    <div className="comment-timestamp">
                      {formatDate(c.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <br />
          <div className="add-comment">
            <Input.TextArea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Tooltip title="Submit Comment">
              <Button
                type="primary"
                icon={<SendOutlined />}
                aria-label="Add comment to the post"
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || loading}
                loading={loading} // Show spinner while waiting for API response
              />
            </Tooltip>
          </div>
          <br />
          {showButton && (
            <footer className="post-card-footer">
              <Tooltip title="Edit Post">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  aria-label="Edit this post"
                  onClick={handleEdit}
                />
              </Tooltip>
              <Tooltip title="Delete Post">
                <Popconfirm
                  title="Are you sure you want to delete this post?"
                  aria-label="Delete the post"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </footer>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailPopup;

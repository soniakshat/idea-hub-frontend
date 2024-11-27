import React, { useState } from "react";
import { Modal, Input, Tag, message, Popconfirm, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { Post } from "../types/Post";
import { formatDate, getLocalStorageItem } from "../utils/utils";
import "./PostDetailPopup.scss";
import { useNavigate } from "react-router-dom";
import API from "../api";

interface PostDetailPopupProps {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onCommentSubmit: (updatedPost: Post) => void;
  onDelete: (deletedPostId: string) => void; // Added delete callback
}

const statusColors: Record<string, { bg: string; font: string }> = {
  draft: { bg: "#FFC4C4", font: "#8B0000" }, // Light Red with Dark Red font
  review: { bg: "#FFD9A0", font: "#8B4500" }, // Light Orange with Burnt Orange font
  approved: { bg: "#A4FFC4", font: "#006400" }, // Light Green with Dark Green font
  dev: { bg: "#A0D9FF", font: "#003366" }, // Light Blue with Navy Blue font
  testing: { bg: "#F4A0FF", font: "#5D0071" }, // Light Purple with Deep Purple font
  completed: { bg: "#FFF4A0", font: "#8B7500" }, // Light Yellow with Dark Yellow font
  archived: { bg: "#C4C4FF", font: "#00008B" }, // Light Lavender with Dark Blue font
  published: { bg: "#FFC4F4", font: "#8B005D" }, // Light Pink with Deep Rose font
};

const PostDetailPopup: React.FC<PostDetailPopupProps> = ({
  visible,
  post,
  onClose,
  onCommentSubmit,
  onDelete, // Added delete callback
}) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState(post.comments);

  const showButton =
    getLocalStorageItem("is_moderator") === "true" ||
    post.author.id === getLocalStorageItem("userId");

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const userId = getLocalStorageItem("userId");
        const userName = getLocalStorageItem("userName");

        if (!userId || !userName) {
          message.error("User information is missing!");
          return;
        }

        // Use the API instance for the request
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
      }
    }
  };

  const handleDelete = async () => {
    try {
      // Use the API instance for the DELETE request
      await API.delete(`/api/posts/${post._id}`);

      message.success("Post deleted successfully!");
      onDelete(post._id); // Notify parent component about the deletion
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post");
    }
  };

  const navigate = useNavigate();
  const handleEdit = () => {
    // message.info("Edit functionality coming soon!");
    navigate(`/edit/${post._id}`);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{
        maxHeight: "85vh",
        overflowY: "auto",
        padding: "16px",
        top: 20,
        maxWidth: "90%",
      }}
    >
      <div>
        <div className="post-card-author">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="post-card-author-avatar">{post.author.name[0]}</div>
            <span>{post.author.name}</span>
          </div>
          <span
            className="post-card-status"
            style={{
              backgroundColor:
                statusColors[post.status?.toLowerCase()]?.bg || "#000000",
              color:
                statusColors[post.status?.toLowerCase()]?.font || "#FFFFFF",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              // fontWeight: "bold", // Optional for emphasis
            }}
          >
            {post.status}
          </span>
        </div>
        <header className="post-card-header">
          <div>
            <h2 className="post-card-title">{post.title}</h2>
            <p className="post-card-date">{formatDate(post.timestamp)}</p>
          </div>
        </header>

        <div className="post-card-content">{post.content}</div>

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
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
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
                onClick={handleEdit}
              />
            </Tooltip>
            <Tooltip title="Delete Post">
              <Popconfirm
                title="Are you sure you want to delete this post?"
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
    </Modal>
  );
};

export default PostDetailPopup;

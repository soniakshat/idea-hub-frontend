import React, { useState } from "react";
import { Modal, Input, Tag, message, Popconfirm, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { Post } from "../types/Post";
import { formatDate, getLocalStorageItem } from "../utils/utils";
import "./PostDetailPopup.scss";
import { useNavigate } from "react-router-dom";

interface PostDetailPopupProps {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onCommentSubmit: (updatedPost: Post) => void;
  onDelete: (deletedPostId: string) => void; // Added delete callback
}

const statusColors: Record<string, string> = {
  draft: "#4D4D4D", // Dark gray: Represents unfinished, neutral state.
  "in review": "#B47300", // Amber: Caution, reflects evaluation or pending action.
  approved: "#1B5E20", // Dark green: Positivity, success, and approval.
  "in development": "#004B8D", // Navy blue: Progress, professional, and active work.
  testing: "#8B4500", // Brownish orange: Critical stage and focus on finding errors.
  completed: "#4A0072", // Deep purple: Finality and elegance for completed tasks.
  archived: "#5D4037", // Earthy brown: Historical, inactive, and stored items.
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
        const token = getLocalStorageItem("authToken");
        if (!token) {
          message.error("Authentication required!");
          return;
        }

        const userId = getLocalStorageItem("userId");
        const userName = getLocalStorageItem("userName");

        if (!userId || !userName) {
          message.error("User information is missing!");
          return;
        }

        const response = await fetch(
          `https://api.techqubits.com/api/posts/addComment/${post._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: userId,
              author: userName,
              content: comment,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const newComment = {
          id: userId,
          author: userName,
          content: comment,
          timestamp: new Date().toISOString(),
        };

        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
        message.success("Comment added successfully!");

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
      const token = getLocalStorageItem("authToken");
      if (!token) {
        message.error("Authentication required!");
        return;
      }

      const response = await fetch(
        `https://api.techqubits.com/api/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

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
      bodyStyle={{
        maxHeight: "85vh",
        overflowY: "auto",
        padding: "16px",
      }}
      style={{
        top: 20,
        maxWidth: "90%",
      }}
    >
      <div>
        <header className="post-card-header">
          <div>
            <h2 className="post-card-title">{post.title}</h2>
            <p className="post-card-date">{formatDate(post.timestamp)}</p>
            <Tag
              className="post-card-status"
              style={{
                backgroundColor:
                  statusColors[post.status.toLowerCase()] || "#4D4D4D",
                color: "#fff",
              }}
            >
              {post.status}
            </Tag>
          </div>
        </header>

        <div className="post-card-author">
          <div className="post-card-author-avatar">{post.author.name[0]}</div>
          <span>{post.author.name}</span>
        </div>

        <div className="post-card-content">{post.content}</div>

        <div className="post-card-tags">
          <div>
            {post.tags?.map((tag, index) => (
              <Tag color="blue" key={index}>
                {tag}
              </Tag>
            ))}
            {post.business?.map((business, index) => (
              <Tag color="green" key={index}>
                {business}
              </Tag>
            ))}
          </div>
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

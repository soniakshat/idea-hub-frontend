import React from "react";
import { Modal, Button, Input } from "antd";
import { Post } from "../types/Post";
import "./PostDetailPopup.scss";
import { getLocalStorageItem } from "../utils/utils";

interface PostDetailPopupProps {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onCommentSubmit: (comment: string) => void;
  showButton?: boolean; // New prop to control button visibility
}

const PostDetailPopup: React.FC<PostDetailPopupProps> = ({
  visible,
  post,
  onClose,
  onCommentSubmit,
  showButton = getLocalStorageItem("is_moderator") ||
    post.author.id == getLocalStorageItem("userId"),
}) => {
  // console.log(
  //   "Show Button: ",
  //   showButton,
  //   "   is post ",
  //   post.title,
  //   " by me? ",
  //   post.author.id == getLocalStorageItem("userId")
  // );
  const [comment, setComment] = React.useState("");
  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(comment);
      setComment(""); // Clear the comment input
    }
  };

  const handleEdit = () => {
    console.log("Edit Post:", post.id); // Placeholder for edit functionality
  };

  const handleDelete = () => {
    console.log("Delete Post:", post.id); // Placeholder for delete functionality
  };

  return (
    <Modal
      title={post.title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="post-detail-popup-content">
        <section>
          <h3>Details</h3>
          <p>{post.content}</p>
        </section>

        <section>
          <h4>Comments</h4>
          <div
            className="post-detail-comments"
            style={{
              marginBottom: "16px",
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "8px",
            }}
          >
            {post.comments.length === 0 ? (
              <div>No comments yet..!!</div>
            ) : (
              post.comments.map((c, idx) => (
                <div key={idx} className="comment-item">
                  <strong>{c.author}</strong>: {c.content}
                </div>
              ))
            )}
          </div>
          <div className="add-comment">
            <Input.TextArea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
          </div>
        </section>
        <div
          className="post-detail-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            {showButton && (
              <Button
                type="primary"
                onClick={handleEdit}
                style={{ marginRight: "8px" }}
              >
                Edit
              </Button>
            )}
            {showButton && (
              <Button type="primary" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <Button
            type="primary"
            onClick={handleCommentSubmit}
            style={{ marginLeft: "8px" }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailPopup;

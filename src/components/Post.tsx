// src/components/Post.tsx

import React, { useState, ChangeEvent } from 'react';
import API from '../api';
import { Button, Input, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import './Post.css';

interface PostData {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: string[]; // Assuming comments are strings; update if comments have a more complex structure
}

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [upvotes, setUpvotes] = useState<number>(post.upvotes);
  const [downvotes, setDownvotes] = useState<number>(post.downvotes);
  const [comments, setComments] = useState<string[]>(post.comments || []);
  const [newComment, setNewComment] = useState<string>('');

  const handleUpvote = () => setUpvotes(upvotes + 1);
  const handleDownvote = () => setDownvotes(downvotes + 1);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, newComment];
      await API.put(`/api/posts/${post.id}`, { comments: updatedComments });
      setComments(updatedComments);
      setNewComment('');
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value);

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div className="post-actions">
        <Tooltip title="Upvote">
          <Button icon={<ArrowUpOutlined />} onClick={handleUpvote} />
        </Tooltip>
        <span>{upvotes - downvotes}</span>
        <Tooltip title="Downvote">
          <Button icon={<ArrowDownOutlined />} onClick={handleDownvote} />
        </Tooltip>
        <Button icon={<CommentOutlined />}>{comments.length} Comments</Button>
        <Button icon={<ShareAltOutlined />}>Share</Button>
      </div>

      <div className="comments-section">
        <Input
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          onPressEnter={handleAddComment}
        />
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            {comment}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;

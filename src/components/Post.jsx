// src/components/Post.jsx

import React, { useState } from 'react';
import API from '../api';
import { Button, Input, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import './Post.css';

function Post({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

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
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          onPressEnter={handleAddComment}
        />
        {comments.map((comment, index) => (
          <Comment key={index} content={comment} />
        ))}
      </div>
    </div>
  );
}

export default Post;

// src/components/PostForm.tsx

import React, { ChangeEvent, useState } from "react";
import { Button, Input, Form } from "antd";
import "./PostForm.scss";

interface Post {
  title: string;
  content: string;
  tags: string;
  business: string;
  status: string;
}

interface PostFormProps {
  initialPost: Post;
  onSubmit: (postData: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialPost, onSubmit }) => {
  const [post, setPost] = useState<Post>(initialPost);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinish = () => {
    onSubmit(post);
  };

  return (
    <div className="post-form-container">
      <h1 className="post-form-title">Create a New Post</h1>
      <Form layout="vertical" onFinish={handleFinish} className="post-form">
        <Form.Item label="Title" required>
          <Input
            name="title"
            placeholder="Enter the post title"
            onChange={handleChange}
            value={post.title}
            className="post-form-input"
          />
        </Form.Item>

        <Form.Item label="Content" required>
          <Input.TextArea
            name="content"
            placeholder="Enter the post content"
            rows={4}
            onChange={handleChange}
            value={post.content}
            className="post-form-textarea"
          />
        </Form.Item>

        <Form.Item label="Tags (comma-separated)">
          <Input
            name="tags"
            placeholder="Enter tags (e.g., database, mongodb)"
            onChange={handleChange}
            value={post.tags}
            className="post-form-input"
          />
        </Form.Item>

        <Form.Item label="Business (comma-separated)">
          <Input
            name="business"
            placeholder="Enter business (e.g., innovations, amrock, mortgage)"
            onChange={handleChange}
            value={post.business}
            className="post-form-input"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit Post
        </Button>
      </Form>
    </div>
  );
};

export default PostForm;

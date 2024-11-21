import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tag, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getLocalStorageItem } from "../utils/utils";
const { Option } = Select;

const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Check if user is a moderator from local storage
  const isModerator = getLocalStorageItem("is_moderator") === "true";

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = getLocalStorageItem("authToken");
        if (!token) {
          message.error("Authentication required!");
          return;
        }

        const response = await fetch(
          `https://api.techqubits.com/api/posts/getPost/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }

        const postData = await response.json();
        form.setFieldsValue({
          ...postData,
          tags: postData.tags?.join(", "),
          business: postData.business?.join(", "),
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        message.error("Failed to fetch post data");
      }
    };

    fetchPost();
  }, [postId, form]);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
  
      const token = getLocalStorageItem("authToken");
      if (!token) {
        message.error("Authentication required!");
        return;
      }
  
      // Transform tags and business fields to arrays
      const transformedValues = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((tag: string) => tag.trim()) : [],
        business: values.business ? values.business.split(",").map((b: string) => b.trim()) : [],
      };
  
      const response = await fetch(
        `https://api.techqubits.com/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transformedValues),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
  
      message.success("Post updated successfully!");
      navigate("/myposts"); // Redirect to "My Posts" after successful update
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Edit Post</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          title: "",
          content: "",
          tags: [],
          business: [],
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter the title" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter the content" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter the content" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Input placeholder="Comma-separated tags (e.g., tag1, tag2)" />
        </Form.Item>

        <Form.Item label="Business" name="business">
          <Input placeholder="Comma-separated business units" />
        </Form.Item>

        {/* Status field for moderators */}
        {isModerator && (
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPost;

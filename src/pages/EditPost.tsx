import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tag, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar.tsx";
import { getLocalStorageItem } from "../utils/utils";
const { Option } = Select;
import API from "../api.js";

const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [businessInput, setBusinessInput] = useState<string>("");

  const isModerator = getLocalStorageItem("is_moderator") === "true";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/api/posts/getPost/${postId}`);
        const postData = response.data;

        setTags(postData.tags || []);
        setBusinessUnits(postData.business || []);

        form.setFieldsValue({
          ...postData,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        message.error("Failed to fetch post data");
      }
    };

    fetchPost();
  }, [postId, form]);

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const handleBusinessInput = (e) => {
    setBusinessInput(e.target.value);
  };

  const handleBusinessKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (
        businessInput.trim() &&
        !businessUnits.includes(businessInput.trim())
      ) {
        setBusinessUnits([...businessUnits, businessInput.trim()]);
        setBusinessInput("");
      }
    }
  };

  const handleBusinessRemove = (removedBusiness) => {
    setBusinessUnits(
      businessUnits.filter((business) => business !== removedBusiness)
    );
  };

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);

      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      if (
        businessInput.trim() &&
        !businessUnits.includes(businessInput.trim())
      ) {
        setBusinessUnits((prev) => [...prev, businessInput.trim()]);
      }

      const transformedValues = {
        ...values,
        tags: tags,
        business: businessUnits,
      };

      await API.put(`/api/posts/${postId}`, transformedValues);

      message.success("Post updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Edit Post
        </h1>
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
            rules={[
              { required: true, message: "Please enter the title" },
              { max: 150, message: "Title cannot be longer than 150 characters" }
            ]}
          >
            <Input 
              placeholder="Enter the title" 
              maxLength={150} 
            />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[
              { required: true, message: "Please enter the content" },
              { max: 1000, message: "Content cannot be longer than 1000 characters" }
            ]}
          >
          <Input.TextArea rows={4} placeholder="Enter the content" maxLength={1000} />
          </Form.Item>

          <Form.Item label="Tags">
            <div style={{ marginBottom: "10px" }}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  style={{
                    backgroundColor: "#e9ecef",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    marginBottom: "6px",
                  }}
                  onClose={() => handleTagRemove(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={handleTagInput}
              onKeyPress={handleTagKeyPress}
              placeholder="Press Enter or ',' to add tags (max 5)"
              onBlur={() => {
                if (
                  tagInput.trim() &&
                  !tags.includes(tagInput.trim()) &&
                  tags.length < 5 // Only allow adding maximum of 5 tags
                ) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }
              }}
              disabled={tags.length >= 5} // Disable input if there are 5 tags
            />
            {tags.length > 5 && <p style={{ color: 'red' }}>Maximum 5 tags allowed</p>}
          </Form.Item>

          <Form.Item label="Business">
            <div style={{ marginBottom: "10px" }}>
              {businessUnits.map((business) => (
                <Tag
                  key={business}
                  closable
                  style={{
                    color: "#1976d2",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    marginBottom: "6px",
                    backgroundColor: "#e3f2fd",
                    fontSize: "0.8rem",
                  }}
                  onClose={() => handleBusinessRemove(business)}
                >
                  {business}
                </Tag>
              ))}
            </div>
            <Input
              value={businessInput}
              onChange={handleBusinessInput}
              onKeyPress={handleBusinessKeyPress}
              placeholder="Press Enter or ',' to add business units (max 5)"
              onBlur={() => {
                if (
                  businessInput.trim() &&
                  !businessUnits.includes(businessInput.trim()) &&
                  businessUnits.length < 5 // Only allow adding maximum of 5 business units
                ) {
                  setBusinessUnits([...businessUnits, businessInput.trim()]);
                  setBusinessInput("");
                }
              }}
              disabled={businessUnits.length >= 5} // Disable input if there are 5 business units
            />
            {businessUnits.length > 5 && (
              <p style={{ color: 'red' }}>Maximum 5 business units allowed</p>
            )}
          </Form.Item>


          {isModerator && (
            <Form.Item label="Status" name="status">
              <Select>
                <Option value="draft">Draft</Option>
                <Option value="review">Review</Option>
                <Option value="approved">Approved</Option>
                <Option value="dev">Dev</Option>
                <Option value="testing">Testing</Option>
                <Option value="completed">Completed</Option>
                <Option value="archived">Archived</Option>
                <Option value="published">Published</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={tags.length > 5 || businessUnits.length > 5}>
              Update Post
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => navigate("/home")}>
              Cancel Edit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditPost;

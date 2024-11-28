import React, { useState } from "react";
import { Form, Input, Button, Tag, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar.tsx";
import API from "../api";
import { generateUniqueId, getLocalStorageItem } from "../utils/utils";

const { Option } = Select;

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [businessInput, setBusinessInput] = useState<string>("");

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",")) {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const handleBusinessInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessInput(e.target.value);
  };

  const handleBusinessKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleBusinessRemove = (removedBusiness: string) => {
    setBusinessUnits(
      businessUnits.filter((business) => business !== removedBusiness)
    );
  };

  const handleFormSubmit = async (values: any) => {
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

      const token = getLocalStorageItem("authToken");
      const userName = getLocalStorageItem("userName");
      const userId = getLocalStorageItem("userId");

      const postPayload = {
        post: {
          author: {
            id: userId?.toString() || "",
            name: userName || "",
          },
          id: generateUniqueId(),
          title: values.title,
          tags: tags,
          business: businessUnits,
          status: "draft",
          content: values.content,
          timestamp: new Date().toISOString(),
          upvotes: 0,
          downvotes: 0,
          comments: [],
        },
      };

      await API.post("/api/posts", postPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Post created successfully!");
      navigate("/home");
    } catch (error: any) {
      console.error("Error creating post:", error.response || error);
      message.error("Failed to create post. Please try again.");
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
          Create Post
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
            status: "draft",
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
              maxLength={151} 
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
          <Input.TextArea rows={4} placeholder="Enter the content" maxLength={1001} />
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


          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={tags.length > 5 || businessUnits.length > 5}>
              Create Post
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreatePost;

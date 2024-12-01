import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar.tsx";
import API from "../api";
import { generateUniqueId, getLocalStorageItem } from "../utils/utils";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const MAX_TAGS = 5;
  const suffixTags = (
    <>
      <span>
        {tags.length} / {MAX_TAGS}
      </span>
    </>
  );
  const suffixBusiness = (
    <>
      <span>
        {businessUnits.length} / {MAX_TAGS}
      </span>
    </>
  );
  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);

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
              {
                max: 150,
                message: "Title cannot be longer than 150 characters",
              },
            ]}
          >
            <Input.TextArea
              showCount
              autoSize={{ minRows: 1, maxRows: 5 }}
              placeholder="Enter the title"
              maxLength={150}
            />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[
              { required: true, message: "Please enter the content" },
              {
                max: 1000,
                message: "Content cannot be longer than 1000 characters",
              },
            ]}
          >
            <Input.TextArea
              showCount
              placeholder="Enter the content"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item label="Tags">
            <Select
              mode="tags"
              value={tags}
              suffixIcon={suffixTags}
              onChange={(selectedTags) => {
                if (selectedTags.length <= 5) {
                  setTags(selectedTags);
                }
              }}
              tokenSeparators={[",", " "]}
              placeholder={"Add up to " + MAX_TAGS + " tags"}
              open={false} // Disable dropdown options
            />
          </Form.Item>

          <Form.Item label="Business Units">
            <Select
              mode="tags"
              value={businessUnits}
              suffixIcon={suffixBusiness}
              onChange={(selectedBusiness) => {
                if (selectedBusiness.length <= 5) {
                  setBusinessUnits(selectedBusiness);
                }
              }}
              tokenSeparators={[",", " "]}
              placeholder={"Add up to " + MAX_TAGS + " tags"}
              open={false} // Disable dropdown options
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={tags.length > 5 || businessUnits.length > 5}
              >
                Create Post
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button color="danger" variant="solid" onClick={() => navigate("/home")}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreatePost;

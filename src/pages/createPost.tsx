import React, { useState } from "react";
import { Form, Input, Button, Select, message, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar.tsx";
import API from "../api";
import { generateUniqueId, getLocalStorageItem } from "../utils/utils";

const { Dragger } = Upload;

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [resource, setResource] = useState<File | null>(null);

  const MAX_TAGS = 5;

  const suffixTags = (
    <span>
      {tags.length} / {MAX_TAGS}
    </span>
  );

  const suffixBusiness = (
    <span>
      {businessUnits.length} / {MAX_TAGS}
    </span>
  );

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);

      const token = getLocalStorageItem("authToken");
      const userName = getLocalStorageItem("userName");
      const userId = getLocalStorageItem("userId");

      // Create a FormData object
      const postPayload = new FormData();

      // Construct the post object
      const postObject = {
        author: {
          id: userId?.toString() || "",
          name: userName || "",
        },
        id: generateUniqueId(),
        title: values.title,
        tags,
        business: businessUnits,
        status: "draft",
        content: values.content,
        timestamp: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        comments: [],
      };

      // Add the post object as a JSON string
      postPayload.append("post", JSON.stringify(postObject));

      // Append the resource file if it exists
      if (resource) {
        postPayload.append("resource", resource);
      }

      // Send the POST request with FormData
      await API.post("/api/posts", postPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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

  const handleFileChange = (info: any) => {
    const isValidSize = info.file.size / 1024 / 1024 < 5; // File size < 5 MB

    if (!isValidSize) {
      message.error("File must be smaller than 5MB.");
      return;
    }

    setResource(info.file); // Store the file
    message.success(`${info.file.name} selected successfully.`);
  };

  const handleFileRemove = () => {
    setResource(null); // Clear the selected file
    message.info("Resource removed.");
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
                max: 100,
                message: "Title cannot be longer than 100 characters",
              },
            ]}
          >
            <Input.TextArea
              showCount
              autoSize={{ minRows: 1, maxRows: 5 }}
              placeholder="Enter the title"
              maxLength={100}
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
              placeholder={`Add up to ${MAX_TAGS} tags`}
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
              placeholder={`Add up to ${MAX_TAGS} business units`}
              open={false} // Disable dropdown options
            />
          </Form.Item>

          <Form.Item label="Upload Resource">
            <Dragger
              name="resource"
              multiple={false} // Only allow one file
              beforeUpload={() => false} // Prevent automatic upload
              fileList={resource ? [{ uid: "-1", name: resource.name }] : []} // Show selected file
              onChange={handleFileChange}
              onRemove={handleFileRemove} // Allow removing the file
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Upload a single file (Max size: 5MB).
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={
                  tags.length > MAX_TAGS || businessUnits.length > MAX_TAGS
                }
              >
                Create Post
              </Button>
              <Button onClick={() => navigate("/home")}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreatePost;

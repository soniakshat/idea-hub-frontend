import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Upload,
  FloatButton,
} from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar.tsx";
import API from "../api";
import { getLocalStorageItem } from "../utils/utils";

const { Dragger } = Upload;

const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [resource, setResource] = useState<File | null>(null);
  const [currentResource, setCurrentResource] = useState<string | null>(null);
  const [removeResource, setRemoveResource] = useState<boolean>(false);

  const MAX_TAGS = 5;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/api/posts/getPost/${postId}`);
        const postData = response.data;

        setTags(postData.tags || []);
        setBusinessUnits(postData.business || []);
        setCurrentResource(postData.resource || null);

        form.setFieldsValue({
          title: postData.title,
          content: postData.content,
          status: postData.status,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        message.error("Failed to fetch post data.");
      }
    };

    fetchPost();
  }, [postId, form]);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);

      const token = getLocalStorageItem("authToken");

      const postPayload = new FormData();

      const postObject = {
        title: values.title,
        content: values.content,
        tags,
        business: businessUnits,
        status: values.status,
        removeResource,
      };

      postPayload.append("post", JSON.stringify(postObject));

      if (resource) {
        postPayload.append("resource", resource);
      }

      await API.put(`/api/posts/${postId}`, postPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Post updated successfully!");
      navigate("/home");
    } catch (error: any) {
      console.error("Error updating post:", error.response || error);
      message.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info: any) => {
    // If a file is being added (not removed)
    if (info.file && info.file.status !== "removed") {
      const isValidSize = info.file.size / 1024 / 1024 < 5; // File size < 5 MB

      if (!isValidSize) {
        message.error("File must be smaller than 5MB.");
        return;
      }

      setResource(info.file); // Store the file
      setRemoveResource(false); // Ensure the resource is not marked for removal
      message.success(`${info.file.name} selected successfully.`);
    }
  };

  const handleFileRemove = () => {
    setResource(null); // Clear the selected file
    setCurrentResource(null); // Update UI to reflect the removed resource
    setRemoveResource(true); // Mark resource for removal
    message.info("Resource will be removed.");
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
              onChange={(selectedTags) => {
                if (selectedTags.length <= MAX_TAGS) {
                  setTags(selectedTags);
                }
              }}
              tokenSeparators={[",", " "]}
              placeholder={`Add up to ${MAX_TAGS} tags`}
              open={false}
            />
          </Form.Item>

          <Form.Item label="Business Units">
            <Select
              mode="tags"
              value={businessUnits}
              onChange={(selectedBusiness) => {
                if (selectedBusiness.length <= MAX_TAGS) {
                  setBusinessUnits(selectedBusiness);
                }
              }}
              tokenSeparators={[",", " "]}
              placeholder={`Add up to ${MAX_TAGS} business units`}
              open={false}
            />
          </Form.Item>

          <Form.Item label="Upload New Resource (Optional; Max 5MB)">
            <Dragger
              name="resource"
              multiple={false}
              beforeUpload={() => false} // Prevent automatic upload
              fileList={
                resource
                  ? [{ uid: "-1", name: resource.name }]
                  : currentResource
                  ? [
                      {
                        uid: "-1",
                        name: currentResource.split("/").pop() || "",
                      },
                    ]
                  : []
              }
              onChange={handleFileChange} // Handle file selection or addition
              onRemove={handleFileRemove} // Handle file removal
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Drag or click to select a new resource file
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
                disabled={tags.length > 5 || businessUnits.length > 5}
              >
                Update Post
              </Button>
              <Button onClick={() => navigate("/home")}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default EditPost;

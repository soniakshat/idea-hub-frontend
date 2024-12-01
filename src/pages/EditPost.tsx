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
              placeholder="Add up to 5 business units"
              open={false} // Disable dropdown options
            />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={tags.length > 5 || businessUnits.length > 5}
              >
                Update Post
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

export default EditPost;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, FloatButton } from "antd";
import API from "../api";
import { getLocalStorageItem } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getLocalStorageItem("authToken");
        const userId = getLocalStorageItem("userId");

        const response = await API.get(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          form.setFieldsValue({
            username: response.data.name,
            department: response.data.department,
          });
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
        console.error(error);
      }
    };

    fetchUserData();
  }, [form]);

  const handleFormSubmit = async (values: {
    username: string;
    department: string;
    password?: string;
  }) => {
    try {
      setLoading(true);
      const token = getLocalStorageItem("authToken");
      const userId = getLocalStorageItem("userId");

      const response = await API.put(
        `/user/${userId}`,
        {
          name: values.username,
          department: values.department,
          ...(values.password ? { password: values.password } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("userName", values.username);
        message.success("Profile updated successfully!");
        navigate("/home");
      }
    } catch (error) {
      message.error("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
      }}
    >
      <Navbar />
      <h2 style={{ textAlign: "center" }}>Edit Profile</h2>
      <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
        <Form.Item
          label="Username"
          name="username"
          hasFeedback
          rules={[
            { required: true, message: "Please enter your username!" },
            { min: 3, message: "Username must be at least 3 characters long." },
          ]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          hasFeedback
          rules={[
            { required: true, message: "Please select your department!" },
          ]}
        >
          <Input placeholder="Enter your department" />
        </Form.Item>

        <Form.Item label="New Password" name="password" hasFeedback rules={[]}>
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !getFieldValue("password") ||
                  getFieldValue("password") === value
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your new password" />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>

            <Button danger onClick={() => navigate("/home")}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
      <FloatButton.BackTop />
    </div>
  );
};

export default EditProfile;

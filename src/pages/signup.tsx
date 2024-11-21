// src/pages/signup.tsx
import React from "react";
import { useState, ChangeEvent } from "react";
import API from "../api"; // Axios instance
import { Button, Input, Form, message, Typography, Card } from "antd";
import { useNavigate, Link } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./auth.scss";

const { Title, Text } = Typography;

// Define a type for user data
interface UserData {
  name: string;
  email: string;
  password: string;
  department: string;
}

const Signup: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes with type for event
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async () => {
    setLoading(true);

    try {
      console.log("Sending user data:", userData);

      const response = await API.post(
        "/user/register",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          department: userData.department,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        message.success("Signup successful! Please login.");
        navigate("/login");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <img
          src="/Idea-nexus.png"
          width="150"
          height="150"
          alt="Logo for Ideahub by Idea Nexus"
        />
        <Title level={2}>Signup</Title>
        <Form layout="vertical" onFinish={handleSignup}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              name="name"
              prefix={<UserOutlined />}
              placeholder="Name"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              name="email"
              prefix={<MailOutlined />}
              placeholder="Email"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              name="password"
              prefix={<LockOutlined />}
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            name="department"
            rules={[
              { required: true, message: "Please enter your department!" },
            ]}
          >
            <Input
              name="department"
              prefix={<TeamOutlined />}
              placeholder="Department"
              onChange={handleChange}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            loading={loading}
          >
            Signup
          </Button>
        </Form>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Text>Already have an account? </Text>
          <Link to="/login">Log in</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;

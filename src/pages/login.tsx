// src/pages/login.tsx
import React from 'react';
import { useState, ChangeEvent } from 'react';
import API from '../api';
import { Button, Input, Form, message, Typography, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import './auth.css';

const { Title, Text } = Typography;

interface Credentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      console.log('Sending credentials:', credentials);

      const response = await API.post(
        '/user/login',
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response);

      if (response.status === 200) {
        const { token, name, id } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
        message.success(`Welcome, ${name}! Redirecting to home page...`);
        navigate('/home');
      } else {
        throw new Error('Invalid response status: ' + response.status);
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || 'Invalid email or password. Please try again.';
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
        <Title level={2}>Login</Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
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
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              name="password"
              prefix={<LockOutlined />}
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            loading={loading}
          >
            Log In
          </Button>
        </Form>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Text>Don't have an account? </Text>
          <Link to="/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

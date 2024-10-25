// src/pages/login.jsx
import { useState } from 'react';
import API from '../api';
import { Button, Input, Form, message, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import './auth.css';

const { Title } = Typography;

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await API.post('/user/login', credentials);
      localStorage.setItem('authToken', response.data.token);
      message.success('Login successful! Redirecting to home page...');
      navigate('/home'); // Ensure this matches the route in App.jsx
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2}>Login</Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
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
          <Button type="primary" htmlType="submit" className="submit-btn">
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;

// src/pages/signup.jsx
import { useState } from 'react';
import API from '../api';
import { Button, Input, Form, message, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import './auth.css'; // Use a separate CSS file for styling

const { Title } = Typography;

function Signup() {
  const [userData, setUserData] = useState({ name: '', email: '', password: '', department: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      await API.post('/user/register', userData);
      message.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2}>Signup</Title>
        <Form layout="vertical" onFinish={handleSignup}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
            <Input
              name="name"
              prefix={<UserOutlined />}
              placeholder="Name"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
            <Input
              name="email"
              prefix={<MailOutlined />}
              placeholder="Email"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
            <Input.Password
              name="password"
              prefix={<LockOutlined />}
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item name="department" rules={[{ required: true, message: 'Please enter your department!' }]}>
            <Input
              name="department"
              prefix={<TeamOutlined />}
              placeholder="Department"
              onChange={handleChange}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="submit-btn">
            Signup
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Signup;

// src/pages/signup.jsx
import { useState } from 'react';
import API from '../api'; // Axios instance
import { Button, Input, Form, message, Typography, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import './auth.css'; // CSS styling

const { Title, Text } = Typography;

function Signup() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async () => {
    setLoading(true); // Start loading spinner

    try {
      console.log('Sending user data:', userData); // Log the payload

      const response = await API.post(
        '/user/register',
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          department: userData.department,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure correct content type
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        message.success('Signup successful! Please login.');
        navigate('/login'); // Redirect to login on success
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.';
      message.error(errorMessage); // Show error message
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2}>Signup</Title>
        <Form layout="vertical" onFinish={handleSignup}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
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
          <Form.Item
            name="department"
            rules={[{ required: true, message: 'Please enter your department!' }]}
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
            loading={loading} // Show loading indicator
          >
            Signup
          </Button>
        </Form>
        {/* Login Text and Link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Text>Already have an account? </Text>
          <Link to="/login">Log in</Link>
        </div>
      </Card>
    </div>
  );
}

export default Signup;

// src/pages/login.jsx
import { useState } from 'react';
import API from '../api'; // Axios instance
import { Button, Input, Form, message, Typography, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import './auth.css'; // CSS styling

const { Title, Text } = Typography;

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading spinner

    try {
      console.log('Sending credentials:', credentials); // Log the credentials

      const response = await API.post(
        '/user/login',
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure correct content type
          },
        }
      );

      console.log('API Response:', response); // Log the API response

      if (response.status === 200) {
        const { token, name, id } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
        message.success(`Welcome, ${name}! Redirecting to home page...`); // Personalized success message
        navigate('/home'); // Redirect to home
      } else {
        throw new Error('Invalid response status: ' + response.status);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || 'Invalid email or password. Please try again.';
      message.error(errorMessage); // Show error message from API
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
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
        {/* Signup Text and Link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Text>Don't have an account? </Text>
          <Link to="/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;

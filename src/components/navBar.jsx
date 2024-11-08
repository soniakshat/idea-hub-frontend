// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './Navbar.css';

function Navbar({ onSearch }) {
  return (
    <div className="navbar">
      {/* Left Section: Logo */}
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">
        <img  src="/public/Idea-nexus.png"></img>
          <span className="navbar-title">Ideahub</span>
        </Link>
      </div>

      {/* Center Section: Search */}
      <div className="navbar-center">
        <Input
          className="navbar-search"
          placeholder="Search Idea"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)} // Call onSearch when typing
          allowClear
        />
      </div>

      {/* Right Section: Buttons */}
      <div className="navbar-right">
        <Link to="/myposts">
          <Button type="primary" className="login-btn">
            My Posts
          </Button>
        </Link>
        <Link to="/create-post">
          <Button type="primary" className="login-btn">
            Create Post
          </Button>
        </Link>
        <Button type="primary" danger onClick={() => {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navbar;

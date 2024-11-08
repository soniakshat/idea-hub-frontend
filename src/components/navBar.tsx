// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './Navbar.css';

interface NavbarProps {
   onSearch?: (query: string) => void; // Make onSearch optional
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <div className="navbar">
      {/* Left Section: Logo */}
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">
          <img src="/Idea-nexus.png" alt="Ideahub Logo" />
          <span className="navbar-title">Ideahub</span>
        </Link>
      </div>

      {/* Center Section: Search */}
      <div className="navbar-center">
        <Input
          className="navbar-search"
          placeholder="Search Idea"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch && onSearch(e.target.value)} // Check if onSearch is defined
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
        <Button
          type="primary"
          danger
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;

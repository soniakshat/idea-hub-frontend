import React from "react";
import { Link } from "react-router-dom";
import { Input, Tooltip, Button } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  PlusOutlined,
  LogoutOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import "./Navbar.scss";

interface NavbarProps {
  onSearch?: (query: string) => void;
  expandFilter: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, expandFilter }) => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

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
          onChange={(e) => onSearch && onSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* Right Section: Buttons */}
      <div className="navbar-right">
        {/* Admin Panel Button */}
        {isAdmin && (
          <Tooltip title="Admin Panel">
            <Link to="/admin">
              <Button
                type="primary"
                icon={<CrownOutlined />}
                className="admin-btn"
              />
            </Link>
          </Tooltip>
        )}
        <Tooltip title="Filters">
          <Button
            type="link"
            icon={<FilterOutlined />}
            className="filter-btn"
            onClick={expandFilter}
          />
        </Tooltip>
        <Tooltip title="My Posts">
          <Link to="/myposts">
            <Button
              type="primary"
              icon={<UserOutlined />}
              className="my-posts-btn"
            />
          </Link>
        </Tooltip>
        <Tooltip title="Create Post">
          <Link to="/create-post">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-post-btn"
            />
          </Link>
        </Tooltip>
        <Tooltip title="Logout">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;

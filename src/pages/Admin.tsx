import React, { useEffect, useState } from "react";
import { Table, Switch, message, Popconfirm, Button, Result } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getLocalStorageItem } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import API from "../api";

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  is_moderator: boolean;
  is_admin?: boolean;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if the user is an admin
  const checkAdminStatus = () => {
    const isAdminValue = getLocalStorageItem("is_admin");
    setIsAdmin(isAdminValue === "true");
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Use the API instance for the GET request
      const response = await API.get("/user/getAll");

      const data = response.data; // Axios automatically parses the JSON
      // Exclude admin users
      const nonAdminUsers = data.users.filter((user) => !user.is_admin);
      setUsers(nonAdminUsers || []);
      message.success("Users fetched successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Toggle moderator status
  const toggleModeratorStatus = async (userId, isModerator) => {
    try {
      // Use the API instance for the PATCH request
      await API.patch(`/user/${userId}/moderator`);

      // Update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, is_moderator: !isModerator } : user
        )
      );
      message.success("Moderator status updated successfully");
    } catch (error) {
      console.error("Error toggling moderator status:", error);
      message.error("Failed to update moderator status");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      // Use the API instance for the DELETE request
      await API.delete(`/user/${userId}/`);

      // Update the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Is Moderator",
      dataIndex: "is_moderator",
      key: "is_moderator",
      render: (is_moderator: boolean, record: User) => (
        <Switch
          checked={is_moderator}
          onChange={() => toggleModeratorStatus(record._id, is_moderator)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => deleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Result
          status="403"
          title="Access Denied"
          subTitle="Sorry, you are not authorized to view this page."
          extra={
            <Button type="primary" onClick={() => navigate("/home")}>
              Go to Home
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Admin Panel</h1>
        <Button type="primary" onClick={() => navigate("/home")}>
          Go to Home
        </Button>
      </div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Admin;

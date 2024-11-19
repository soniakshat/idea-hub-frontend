import React, { useEffect, useState } from "react";
import { Table, Button, Switch, message } from "antd";
import { getLocalStorageItem } from "../utils/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  is_moderator: boolean;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if the user is an admin
  const checkAdminStatus = () => {
    const isAdminValue = getLocalStorageItem("is_admin");
    if (isAdminValue === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getLocalStorageItem("authToken");
      if (!token) {
        console.error("Authorization token is missing.");
        return;
      }
      const response = await fetch("https://api.techqubits.com/user/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      message.success("Users fetched successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Toggle moderator status
  const toggleModeratorStatus = async (
    userId: string,
    isModerator: boolean
  ) => {
    try {
      const token = getLocalStorageItem("authToken");
      if (!token) {
        console.error("Authorization token is missing.");
        return;
      }
      const response = await fetch(
        `https://api.techqubits.com/user/${userId}/moderator`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle moderator status");
      }

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
  ];

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>
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

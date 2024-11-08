// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode; // Define children as a ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Check if token exists

  if (!token) {
    // If no token, redirect to the 404 page
    return <Navigate to="/404" />;
  }

  // If token exists, render the child components (e.g., Home page)
  return <>{children}</>;
};

export default ProtectedRoute;

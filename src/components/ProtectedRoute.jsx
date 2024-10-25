// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken'); // Check if token exists

  if (!token) {
    // If no token, redirect to the 404 page
    return <Navigate to="/404" />;
  }

  // If token exists, render the child components (e.g., Home page)
  return children;
}

export default ProtectedRoute;

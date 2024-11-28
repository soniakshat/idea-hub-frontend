// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute"; // Ensure this is compatible with TS
import Navbar from "./components/Navbar.tsx";
import { Row, Col, Skeleton } from "antd";

// Lazy-loaded page components
const Admin = lazy(() => import("./pages/Admin"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const CreatePost = lazy(() => import("./pages/createPost"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const EditPost = lazy(() => import("./pages/EditPost"));
const Page404 = lazy(() => import("./pages/page404"));

// App component with type annotation
const App: React.FC = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <>
            <Navbar expandFilter={() => {}} />
            <Row gutter={[16, 16]} style={{ padding: "20px" }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Col>
              ))}
            </Row>
          </>
        }
      >
        <Routes>
          {/* Redirect "/" to "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Home Route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/edit/:postId" element={<EditPost />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/admin" element={<Admin />} />
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

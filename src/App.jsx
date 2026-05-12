import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// PROTECTED ROUTE
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin" || user.status !== "active") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// REDIRECT IF ALREADY LOGGED IN
function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.role === "admin" && user.status === "active") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

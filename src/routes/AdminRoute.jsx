import { Navigate, Outlet } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin" || user.status !== "active") {
    return <Navigate to="/" replace />;
  }

  return children;
}

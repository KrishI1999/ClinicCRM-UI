import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const expiry = localStorage.getItem("tokenExpiry");

  // Not logged in
  if (!token) return <Navigate to="/login" replace />;

  // Token expired
  if (!expiry || Date.now() > parseInt(expiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("tokenExpiry");
    return <Navigate to="/login" replace />;
  }

  // Role missing
  if (!role) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
}

export default ProtectedRoute;
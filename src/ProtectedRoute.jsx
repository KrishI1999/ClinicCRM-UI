import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Token exists but role missing → likely a stale session, force re-login
  if (!role) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Role doesn't match → access denied
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
}

export default ProtectedRoute;
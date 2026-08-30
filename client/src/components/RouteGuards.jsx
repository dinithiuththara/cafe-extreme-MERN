import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Wraps routes that require any logged-in user
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // could render a spinner here
  if (!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />;

  return <Outlet />;
};

// Wraps routes that require an admin account
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

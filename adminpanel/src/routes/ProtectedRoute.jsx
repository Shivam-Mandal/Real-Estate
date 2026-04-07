import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, bootstrapping } = useAdminAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <div className="admin-shell py-20 text-center text-slate-500">Checking admin session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

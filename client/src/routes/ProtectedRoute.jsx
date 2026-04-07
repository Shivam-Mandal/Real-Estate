import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <div className="shell py-20 text-center text-slate-500">Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

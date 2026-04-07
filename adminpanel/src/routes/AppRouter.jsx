import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { DashboardHomePage } from "../pages/DashboardHomePage";
import { InquiriesPage } from "../pages/InquiriesPage";
import { PropertyManagementPage } from "../pages/PropertyManagementPage";
import { UsersPage } from "../pages/UsersPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  const { isAuthenticated, bootstrapping } = useAdminAuth();

  if (bootstrapping) {
    return <div className="admin-shell py-20 text-center text-slate-500">Loading admin console...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/" element={isAuthenticated ? <ProtectedRoute><DashboardLayout /></ProtectedRoute> : <AdminLoginPage />}>
        <Route index element={<DashboardHomePage />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="properties" element={<PropertyManagementPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
};

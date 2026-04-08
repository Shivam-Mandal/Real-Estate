import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { AgentsPage } from "../pages/AgentsPage";
import { DashboardHomePage } from "../pages/DashboardHomePage";
import { FeaturedPropertiesPage } from "../pages/FeaturedPropertiesPage";
import { InquiriesPage } from "../pages/InquiriesPage";
import { PackageManagementPage } from "../pages/PackageManagementPage";
import { PaymentLogsPage } from "../pages/PaymentLogsPage";
import { PropertyManagementPage } from "../pages/PropertyManagementPage";
import { PropertySpecificationsPage } from "../pages/PropertySpecificationsPage";
import { UsersPage } from "../pages/UsersPage";
import { VendorsPage } from "../pages/VendorsPage";
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
        <Route path="property-specifications" element={<PropertySpecificationsPage />} />
        <Route path="properties" element={<PropertyManagementPage />} />
        <Route path="featured-properties" element={<FeaturedPropertiesPage />} />
        <Route path="property-messages" element={<InquiriesPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="package-management" element={<PackageManagementPage />} />
        <Route path="payment-logs" element={<PaymentLogsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="vendors" element={<VendorsPage />} />
      </Route>
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AccountPage } from "../pages/AccountPage";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";
import { PropertiesPage } from "../pages/PropertiesPage";
import { PropertyDetailsPage } from "../pages/PropertyDetailsPage";
import { StaticPage } from "../pages/StaticPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:slug" element={<PropertyDetailsPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/reset-password/:token" element={<AuthPage />} />
      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/about" element={<StaticPage eyebrow="About" title="Built with a premium product mindset, not just a property catalog." description="This experience combines luxury-facing presentation with practical listing operations, giving users and teams a cleaner way to discover, manage, and act on real estate opportunities." />} />
      <Route path="/contact" element={<StaticPage eyebrow="Contact" title="Talk with our property advisors and growth team." description="Use the platform inquiry flow for specific listings, or reach out directly if you need help with property sourcing, onboarding, or platform operations." />} />
    </Route>
  </Routes>
);

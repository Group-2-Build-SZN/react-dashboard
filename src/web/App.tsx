import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { CheckEmail } from "./pages/auth/CheckEmail";
import { ChooseUserType } from "./pages/auth/ChooseUserType";
import { KYCVerification } from "./pages/auth/KYCVerification";
import { VerificationSuccess } from "./pages/auth/VerificationSuccess";
import { MapPage } from "./pages/MapPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { AccountPage } from "./pages/dashboard/AccountPage";
import { SecurityPage } from "./pages/dashboard/SecurityPage";
import { NotificationsPage } from "./pages/dashboard/NotificationsPage";
import { SearchResultsPage } from "./pages/dashboard/SearchResultsPage";
import { InquiriesPage } from "./pages/dashboard/InquiriesPage";
import { SavedPropertiesPage } from "./pages/dashboard/SavedPropertiesPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { useAuth } from "./lib/AuthContext";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/check-email" element={<CheckEmail mode="login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/check-email" element={<CheckEmail mode="signup" />} />
      <Route path="/choose-user-type" element={<RequireAuth><ChooseUserType /></RequireAuth>} />
      <Route path="/kyc-verification" element={<RequireAuth><KYCVerification /></RequireAuth>} />
      <Route path="/verification-success" element={<RequireAuth><VerificationSuccess /></RequireAuth>} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/dashboard/settings/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/dashboard/settings/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
      <Route path="/dashboard/settings/security" element={<RequireAuth><SecurityPage /></RequireAuth>} />
      <Route path="/dashboard/settings/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
      <Route path="/dashboard/inquiries" element={<RequireAuth><InquiriesPage /></RequireAuth>} />
      <Route path="/dashboard/saved" element={<RequireAuth><SavedPropertiesPage /></RequireAuth>} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

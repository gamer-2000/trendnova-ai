import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardHome from "./pages/DashboardHome";
import Generate from "./pages/Generate";
import HistoryPage from "./pages/HistoryPage";
import Billing from "./pages/Billing";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPanel from "./pages/AdminPanel";
import GuestGenerate from "./pages/GuestGenerate";
import NotFound from "./pages/NotFound";
import ThumbnailPage from "./pages/ThumbnailPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DonationReminder from "./components/DonationReminder";
import CookieConsent from "./components/CookieConsent";
import ParticleBackground from "./components/ParticleBackground";
import AnnouncementBar from "./components/AnnouncementBar";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CustomCursor />
      <ParticleBackground />
      <AnnouncementBar />
      <Toaster />
      <Sonner />
      <DonationReminder />
      <CookieConsent />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/try" element={<GuestGenerate />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<DashboardRoute><DashboardHome /></DashboardRoute>} />
            <Route path="/dashboard/generate" element={<DashboardRoute><Generate /></DashboardRoute>} />
            <Route path="/dashboard/history" element={<DashboardRoute><HistoryPage /></DashboardRoute>} />
            <Route path="/dashboard/billing" element={<DashboardRoute><Billing /></DashboardRoute>} />
            <Route path="/dashboard/feedback" element={<DashboardRoute><FeedbackPage /></DashboardRoute>} />
            <Route path="/dashboard/thumbnails" element={<DashboardRoute><ThumbnailPage /></DashboardRoute>} />
            <Route path="/admin" element={<DashboardRoute><AdminPanel /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

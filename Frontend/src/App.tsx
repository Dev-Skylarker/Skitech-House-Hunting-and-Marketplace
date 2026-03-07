import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import HousesPage from "./pages/HousesPage";
import HouseDetailsPage from "./pages/HouseDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import SavedPage from "./pages/SavedPage";
import AccountPage from "./pages/AccountPage";
import PostHousePage from "./pages/PostHousePage";
import PostItemPage from "./pages/PostItemPage";
import NotificationsPage from "./pages/NotificationsPage";
import LandlordSettingsPage from "./pages/LandlordSettingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import LegalPage from "./pages/LegalPage";
import InquiryPage from "./pages/InquiryPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import FAQPage from "./pages/FAQPage";
import GuidePage from "./pages/GuidePage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { isAuthenticated, isChecking, user } = useAuth();
  const location = useLocation();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0F3D91] border-t-transparent rounded-full animate-spin" />
          <p className="font-heading font-bold text-[#0F3D91] animate-pulse uppercase tracking-[0.2em] text-[10px]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.userType === 'landlord' ? 'landlord' : (user.role === 'admin' ? 'admin' : 'tenant'))) {
    // Simplified role check for owner/admin
    if (roles.includes('landlord') && user.userType !== 'landlord' && user.role !== 'admin') {
      return <Navigate to="/account" replace />;
    }
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/houses" element={<HousesPage />} />
                  <Route path="/houses/:id" element={<HouseDetailsPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/marketplace/:id" element={<ItemDetailsPage />} />

                  {/* Protected Routes */}
                  <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  <Route path="/landlord-settings" element={<ProtectedRoute roles={['landlord']}><LandlordSettingsPage /></ProtectedRoute>} />
                  <Route path="/post-house" element={<ProtectedRoute roles={['landlord']}><PostHousePage /></ProtectedRoute>} />
                  <Route path="/post-item" element={<ProtectedRoute><PostItemPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

                  {/* Public Information */}
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/inquiry" element={<InquiryPage />} />
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

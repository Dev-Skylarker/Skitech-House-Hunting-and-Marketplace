import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FullPageLoading } from "@/components/LoadingSkeleton";

// Lazy load heavy components
const Index = lazy(() => import("./pages/Index"));
const HousesPage = lazy(() => import("./pages/HousesPage"));
const HouseDetailsPage = lazy(() => import("./pages/HouseDetailsPage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const ItemDetailsPage = lazy(() => import("./pages/ItemDetailsPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const PostHousePage = lazy(() => import("./pages/PostHousePage"));
const PostItemPage = lazy(() => import("./pages/PostItemPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const LandlordSettingsPage = lazy(() => import("./pages/LandlordSettingsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const InquiryPage = lazy(() => import("./pages/InquiryPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
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

  if (roles && user) {
    const effectiveRole = user.role === 'admin'
      ? 'admin'
      : user.userType === 'landlord' || user.role === 'landlord'
        ? 'landlord'
        : 'resident';

    const allowed = roles.includes(effectiveRole) || (effectiveRole === 'admin' && roles.includes('landlord'));
    if (!allowed) {
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <Index />
                    </Suspense>
                  } />
                  <Route path="/houses" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <HousesPage />
                    </Suspense>
                  } />
                  <Route path="/houses/:id" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <HouseDetailsPage />
                    </Suspense>
                  } />
                  <Route path="/marketplace" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <MarketplacePage />
                    </Suspense>
                  } />
                  <Route path="/marketplace/:id" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <ItemDetailsPage />
                    </Suspense>
                  } />
                  <Route path="/saved" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <SavedPage />
                    </Suspense>
                  } />
                  <Route path="/notifications" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <NotificationsPage />
                    </Suspense>
                  } />
                  <Route path="/landlord-settings" element={
                    <ProtectedRoute roles={['landlord']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <LandlordSettingsPage />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/post-house" element={
                    <ProtectedRoute roles={['landlord']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <PostHousePage />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/post-item" element={
                    <ProtectedRoute>
                      <Suspense fallback={<FullPageLoading />}>
                        <PostItemPage />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute roles={['admin']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute roles={['admin']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <ProtectedRoute roles={['admin']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute roles={['admin']}>
                      <Suspense fallback={<FullPageLoading />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <AccountPage />
                    </Suspense>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Suspense fallback={<FullPageLoading />}>
                        <ProfilePage />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/legal" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <LegalPage />
                    </Suspense>
                  } />
                  <Route path="/privacy" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <LegalPage />
                    </Suspense>
                  } />
                  <Route path="/terms" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <LegalPage />
                    </Suspense>
                  } />
                  <Route path="/inquiry" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <InquiryPage />
                    </Suspense>
                  } />
                  <Route path="/help" element={
                    <Suspense fallback={<FullPageLoading />}>
                      <HelpCenterPage />
                    </Suspense>
                  } />
                  <Route path="/faq" element={<Navigate to="/help?tab=faq" replace />} />
                  <Route path="/guide" element={<Navigate to="/help?tab=guide" replace />} />
                  <Route path="/contact" element={<Navigate to="/help?tab=contact" replace />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

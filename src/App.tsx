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
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import GuidePage from "./pages/GuidePage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";

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
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/landlord-settings" element={<LandlordSettingsPage />} />
                  <Route path="/post-house" element={<PostHousePage />} />
                  <Route path="/post-item" element={<PostItemPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/faq" element={<FAQPage />} />
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

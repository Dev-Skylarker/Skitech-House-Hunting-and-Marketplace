import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              <Route path="/post-house" element={<PostHousePage />} />
              <Route path="/post-item" element={<PostItemPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

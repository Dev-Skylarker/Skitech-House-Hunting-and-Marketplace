import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { BottomNav } from './BottomNav';
import { GlobalFooter } from './GlobalFooter';
import { InquiryBanner } from './InquiryBanner';
import { FeedbackPopup } from '../FeedbackPopup';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

import { DownloadBanner } from './DownloadBanner';

export function AppLayout() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isGlobalAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHelpCenter = location.pathname === '/help';
  const isInquiry = location.pathname === '/inquiry';
  const isHome = location.pathname === '/';

  const showFooter = !isAdminRoute && !isHelpCenter;
  const showBanner = showFooter && !isInquiry;
  const showDownload = showFooter && isHome; // Show download banner on home or as part of global stack

  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  useEffect(() => {
    // Show feedback popup once per session after some delay
    const hasSeenThisSession = sessionStorage.getItem('skitech_feedback_session');
    if (!hasSeenThisSession && !isAdminRoute && !isHelpCenter && isAuthenticated) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
        sessionStorage.setItem('skitech_feedback_session', 'true');
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdminRoute, isHelpCenter, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] selection:bg-[#0F3D91] selection:text-white flex flex-col">
      <div className={cn(
        "mx-auto w-full min-h-screen flex flex-col relative overflow-x-hidden pb-24 flex-1",
        isAdminRoute ? "max-w-[1600px]" : "max-w-[1200px]"
      )}>
        <TopNavbar />

        {/* 
          UNIFIED SHEET ARCHITECTURE:
          Bundling main and footer into a single rounded container so the footer 
          perfectly adapts to the width and roundness of the main body.
        */}
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 relative z-10 w-full">
            <Outlet />
          </main>

          {/* Safe Area Stack: Tiles (Footer) -> Download Banner -> Versioning */}
          <div className="flex flex-col gap-0 mt-8">
            {showBanner && <InquiryBanner />}
            {showFooter && <GlobalFooter />}
            {showDownload && <DownloadBanner />}
          </div>
        </div>

        <BottomNav />


        <FeedbackPopup
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </div>
    </div>
  );
}

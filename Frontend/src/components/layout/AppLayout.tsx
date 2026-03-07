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

export function AppLayout() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isGlobalAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHelpCenter = location.pathname === '/help';
  const isInquiry = location.pathname === '/inquiry';
  const showFooter = !isAdminRoute && !isHelpCenter;
  const showBanner = showFooter && !isInquiry;
  const [showFeedback, setShowFeedback] = useState(false);

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
  }, [location, isAdminRoute, isHelpCenter, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] selection:bg-[#0F3D91] selection:text-white flex flex-col md:flex-row">
      {isGlobalAdmin && <AdminSidebar />}
      {/*
        Global Content Buffer: pb-24 on mobile pushes the sheet bottom above the 
        fixed BottomNav (z-index 50) so GlobalFooter is never obscured.
      */}
      <div className={cn(
        "mx-auto w-full min-h-screen flex flex-col relative overflow-x-hidden md:pb-0 flex-1",
        !isGlobalAdmin && "pb-24 max-w-[1200px]",
        isGlobalAdmin && "md:ml-64 max-w-[1600px] pb-24"
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

          {/* Inquiry Banner + Global Footer - Integrated part of the sheet */}
          {showBanner && <InquiryBanner />}
          {showFooter && <GlobalFooter />}
        </div>

        {!isGlobalAdmin && <BottomNav />}

        <FeedbackPopup
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </div>
    </div>
  );
}

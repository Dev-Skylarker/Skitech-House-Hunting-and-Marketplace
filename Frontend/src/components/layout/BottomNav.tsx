import {
  Home, Building2, ShoppingBag, Heart, User,
  ShieldCheck, FileText, LayoutDashboard, LogOut,
  MessageSquare, Users, Flag, ImageIcon, Settings, Search
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const standardNavItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/houses', icon: Building2, label: 'Houses' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Market' },
  { to: '/saved', icon: Heart, label: 'Wishlist' },
  { to: '/account', icon: User, label: 'Account' },
];

const adminNavItems = [
  { to: '/admin?tab=home', icon: Search, label: 'Omni-search hub' },
  { to: '/admin?tab=gatekeeper', icon: ShieldCheck, label: 'Gatekeeper' },
  { to: '/admin?tab=properties', icon: Building2, label: 'Properties' },
  { to: '/admin?tab=marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/admin?tab=requests', icon: MessageSquare, label: 'Requests' },
  { to: '/admin?tab=membership', icon: Users, label: 'Membership' },
  { to: '/admin?tab=safety', icon: Flag, label: 'Trust & safety' },
  { to: '/admin?tab=vault', icon: ImageIcon, label: 'Media vault' },
  { to: '/admin?tab=logs', icon: FileText, label: 'System logs' },
  { to: '/admin?tab=settings', icon: Settings, label: 'UI studio' },
];

export function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentNavItems = isAdminRoute ? adminNavItems : standardNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl bg-white/90"
    >
      <div className={cn(
        "max-w-[1200px] mx-auto w-full flex items-center px-4 py-2 transition-all",
        isAdminRoute ? "overflow-x-auto scrollbar-hide justify-start gap-1" : "justify-around gap-2"
      )}>
        {currentNavItems.map(({ to, icon: Icon, label }) => {
          const searchParams = new URLSearchParams(to.split('?')[1]);
          const targetTab = searchParams.get('tab');
          const currentTab = new URLSearchParams(location.search).get('tab') || 'home';
          const isActive = isAdminRoute
            ? targetTab === currentTab
            : location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 min-w-[80px] shrink-0 group',
                isActive
                  ? 'bg-[#0F3D91] text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-[#0F3D91]'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 mb-1 transition-all duration-300',
                  isActive
                    ? 'text-[#FF7A00] scale-110'
                    : 'text-slate-400 group-hover:text-[#0F3D91]'
                )}
              />
              <span className={cn(
                "text-[9px] leading-tight font-black tracking-wide text-center",
                isActive ? "text-white" : "text-slate-400 group-hover:text-[#0F3D91]"
              )}>{label}</span>
            </NavLink>
          );
        })}

        {isAdminRoute && (
          <NavLink
            to="/"
            className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 min-w-[80px] shrink-0 text-red-400 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[9px] leading-tight font-black tracking-wide text-center">Exit</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}

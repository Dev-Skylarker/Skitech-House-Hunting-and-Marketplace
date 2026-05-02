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

export function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  const currentNavItems = standardNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl bg-white/90"
    >
      <div className="max-w-[1200px] mx-auto w-full flex items-center px-4 py-2 justify-around gap-2">
        {currentNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;

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
      </div>
    </nav>
  );
}

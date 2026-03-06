import { Home, Building2, ShoppingBag, Heart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/houses', icon: Building2, label: 'Houses' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Market' },
  { to: '/saved', icon: Heart, label: 'Wishlist' },
  { to: '/account', icon: User, label: 'Account' },
];

export function BottomNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 transition-colors border-border/70 bg-card/90 border-t backdrop-blur-xl shadow-[0_-6px_18px_rgba(15,61,145,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-around px-3 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-[#0F3D91]/10 text-[#0F3D91]'
                    : 'text-muted-foreground hover:bg-muted/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 mb-1',
                      isActive
                        ? 'text-[#FF7A00] fill-[#FF7A00]'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span className={cn(
                    "text-[11px] leading-tight font-bold",
                    isActive ? "text-[#FF7A00]" : "text-muted-foreground"
                  )}>{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

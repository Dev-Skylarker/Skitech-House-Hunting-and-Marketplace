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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      style={{ background: 'hsl(var(--card) / 0.92)' }}
    >
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-around px-3 py-1.5">
        {navItems.map(({ to, icon: Icon, label }) => {
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  /* Rounded rectangle active indicator — premium feel */
                  'flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 min-w-[52px]',
                  isActive
                    ? 'bg-[#0F3D91]/10 text-[#0F3D91] shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/40'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 mb-0.5 transition-all duration-200',
                      isActive
                        ? 'text-[#FF7A00] fill-[#FF7A00] scale-110'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span className={cn(
                    "text-[10px] leading-tight font-bold tracking-tight",
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

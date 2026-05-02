import { Search, Bell, ShieldCheck, X, Building2, ShieldAlert, Database, Settings, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function TopNavbar() {
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // --- Omni-Search State (Only used in Admin) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [adminData, setAdminData] = useState<{users: any[], houses: any[], items: any[]}>({ users: [], houses: [], items: [] });

  useEffect(() => {
    if (isAdminRoute && supabase) {
      const fetchAdminData = async () => {
        const { data: users } = await supabase.from('profiles').select('id, full_name, email').limit(10);
        const { data: houses } = await supabase.from('listings').select('id, title, location').eq('listing_type', 'house').limit(10);
        const { data: items } = await supabase.from('listings').select('id, title, category').eq('listing_type', 'item').limit(10);
        setAdminData({ 
          users: (users || []).map(u => ({ ...u, name: u.full_name })), 
          houses: houses || [], 
          items: items || [] 
        });
      };
      fetchAdminData();
    }
  }, [isAdminRoute]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return { profiles: [], listings: [], commands: [] };
    const q = searchQuery.toLowerCase();
    return {
      profiles: adminData.users.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)).slice(0, 5),
      listings: [...adminData.houses, ...adminData.items].filter(l => l.title?.toLowerCase().includes(q) || (l.location || l.category)?.toLowerCase().includes(q)).slice(0, 5),
      commands: [
        { id: 'c1', label: 'Verify Landlord', icon: ShieldCheck, tab: 'users' },
        { id: 'c2', label: 'View Audit Logs', icon: Database, tab: 'audit' },
        { id: 'c3', label: 'Platform Reports', icon: ShieldAlert, tab: 'reports' },
        { id: 'c4', label: 'System Settings', icon: Settings, tab: 'settings' },
      ].filter(c => c.label.toLowerCase().includes(q))
    };
  }, [searchQuery, adminData]);

  const handleSearchSelect = (type: string, data: any) => {
    if (type === 'tab') navigate(`/admin?tab=${data}`);
    else if (type === 'users') navigate(`/admin?tab=users`);
    else if (type === 'houses') navigate(`/admin?tab=houses`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 rounded-b-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-3 sm:py-4 flex items-center justify-between mx-0">
      <Link to={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-3 sm:gap-6">
        {/* Animated Skitech Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{
            scale: 1.1,
            rotate: 5
          }}
          className="relative cursor-pointer"
        >
          <img
            src="/icon-128.png"
            alt="Skitech Logo"
            className="w-12 h-12 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
          />
        </motion.div>

        <div className="flex flex-col leading-[1.1] select-none">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-col"
          >
            <span className="font-heading font-black text-[#0F3D91] text-[18px] sm:text-[32px] tracking-tighter leading-none mb-1">
              Skitech.
            </span>
            <span className="font-heading font-bold text-slate-400 text-[10px] sm:text-[15px] tracking-wide leading-tight">
              House-hunting <span className="text-[#FF7A00]">& marketplace</span>
            </span>
          </motion.div>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {isAdminRoute ? (
          <div className="relative hidden md:block w-[400px] lg:w-[600px]">
            <div className={cn(
              "relative flex items-center transition-all duration-300 rounded-2xl",
              isSearchOpen ? "bg-white shadow-2xl ring-2 ring-blue-500/20" : "bg-slate-100"
            )}>
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search profiles, listings, or commands..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-12 bg-transparent border-none h-11 focus-visible:ring-0 text-sm font-medium"
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="mr-2 h-8 w-8 rounded-xl">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <AnimatePresence>
              {isSearchOpen && searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-[100] max-h-[400px] overflow-y-auto"
                >
                  {searchResults.profiles.length > 0 && (
                    <div className="mb-4">
                      <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Profiles</p>
                      {searchResults.profiles.map((p: any) => (
                        <button key={p.id} onClick={() => handleSearchSelect('users', p)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100  flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100  flex items-center justify-center text-blue-600 font-bold text-[10px]">
                            {p.name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate ">{p.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{p.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.listings.length > 0 && (
                    <div className="mb-4">
                      <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Listings</p>
                      {searchResults.listings.map((l: any) => (
                        <button key={l.id} onClick={() => handleSearchSelect('houses', l)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100  flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100  flex items-center justify-center text-orange-600">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate ">{l.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">{l.location || l.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.commands.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">System Actions</p>
                      {searchResults.commands.map((c: any) => (
                        <button key={c.id} onClick={() => handleSearchSelect('tab', c.tab)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100  flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100  flex items-center justify-center text-slate-600">
                            <c.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate ">{c.label}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link to="/houses" className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search className="w-6 h-6 text-muted-foreground" />
          </Link>
        )}



        <Link to="/notifications" className="p-2 rounded-full hover:bg-muted transition-colors relative">
          <Bell className="w-6 h-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {isAdminRoute && (
          <Badge variant="outline" className="hidden lg:flex rounded-2xl px-4 py-1.5 border-slate-200 font-bold text-[10px] gap-2 items-center animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            LIVE OPS
          </Badge>
        )}
      </div>
    </header>
  );
}

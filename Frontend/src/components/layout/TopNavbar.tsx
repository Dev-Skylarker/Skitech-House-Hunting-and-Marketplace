import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { motion } from 'framer-motion';

export function TopNavbar() {
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 rounded-b-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-5 sm:py-7 flex items-center justify-between mx-0">
      <Link to="/" className="flex items-center gap-3 sm:gap-6">
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
              House-hunting <span className="text-[#FF7A00]">& Marketplace</span>
            </span>
          </motion.div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/houses" className="p-2 rounded-full hover:bg-muted transition-colors">
          <Search className="w-6 h-6 text-muted-foreground" />
        </Link>

        <Link to="/notifications" className="p-2 rounded-full hover:bg-muted transition-colors relative">
          <Bell className="w-6 h-6 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

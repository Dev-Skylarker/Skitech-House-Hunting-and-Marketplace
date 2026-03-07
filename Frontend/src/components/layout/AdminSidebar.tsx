import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const adminNavItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Listing Management' },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/reports', icon: Flag, label: 'Reports/Flags' },
    { to: '/admin/settings', icon: Settings, label: 'System Settings' },
];

export function AdminSidebar() {
    const { logout } = useAuth();

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0F3D91] text-white border-r border-[#00B4D8]/20 fixed left-0 top-0 z-50 shadow-2xl">
            <div className="p-6 border-b border-[#00B4D8]/20">
                <div className="flex items-center gap-2">
                    <span
                        className="font-black tracking-[-0.02em] text-xl text-white select-none uppercase"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        SKITECH.
                    </span>
                    <span className="text-[9px] font-extrabold text-[#0F3D91] uppercase tracking-[0.18em] bg-[#FF7A00] px-1.5 py-0.5 rounded-full">
                        ADMIN
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {adminNavItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/admin'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm tracking-wide',
                                isActive
                                    ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            )
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-[#00B4D8]/20">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 font-bold text-sm tracking-wide"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

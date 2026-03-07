import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShieldCheck, Building2, ShoppingBag,
    MessageSquare, Users, Flag, ImageIcon, FileText, Settings,
    LogOut, ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const adminNavItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Omni-Search Hub' },
    { id: 'gatekeeper', icon: ShieldCheck, label: 'Gatekeeper' },
    { id: 'properties', icon: Building2, label: 'Properties' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'requests', icon: MessageSquare, label: 'Requests' },
    { id: 'membership', icon: Users, label: 'Membership' },
    { id: 'safety', icon: Flag, label: 'Trust & Safety' },
    { id: 'vault', icon: ImageIcon, label: 'Media Vault' },
    { id: 'logs', icon: FileText, label: 'System Logs' },
    { id: 'settings', icon: Settings, label: 'UI Studio' },
];

export function AdminSidebar() {
    const { logout } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'home';

    return (
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white text-slate-900 border-r border-slate-100 fixed left-0 top-0 z-50 shadow-xl overflow-y-auto scrollbar-hide">
            <div className="p-8 border-b border-slate-50">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-2xl text-[#0F3D91] tracking-tighter">
                            Skitech.
                        </span>
                        <span className="text-[10px] font-black text-white px-2 py-0.5 bg-[#FF7A00] rounded-lg uppercase tracking-widest">
                            CORE
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1">
                {adminNavItems.map(({ id, icon: Icon, label }) => (
                    <NavLink
                        key={id}
                        to={`/admin?tab=${id}`}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest leading-none',
                            activeTab === id
                                ? 'bg-[#0F3D91] text-white shadow-lg shadow-blue-500/20 translate-x-1'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-[#0F3D91]'
                        )}
                    >
                        <Icon className={cn("w-4 h-4", activeTab === id ? "text-[#FF7A00]" : "")} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-50 space-y-2">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-slate-400 hover:bg-slate-50 hover:text-[#0F3D91] transition-all duration-200 font-bold text-[10px] uppercase tracking-widest"
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Exit Admin</span>
                </NavLink>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 font-bold text-[10px] uppercase tracking-widest"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}

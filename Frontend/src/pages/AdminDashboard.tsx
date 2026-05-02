import { useState, useEffect } from 'react';
import {
  Building2, Users, Clock, LayoutDashboard, Settings, LogOut,
  ShieldCheck, UserPlus, Bell, ShieldAlert, Star,
  BarChart3, Database, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { apiService } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Module imports
import { OverviewModule } from '@/components/admin/OverviewModule';
import { UsersModule } from '@/components/admin/UsersModule';
import { VerificationModule } from '@/components/admin/VerificationModule';
import { ListingsModule } from '@/components/admin/ListingsModule';
import { AddListingModule } from '@/components/admin/AddListingModule';
import { RequestsModule } from '@/components/admin/RequestsModule';
import { ReportsModule } from '@/components/admin/ReportsModule';
import { RatingsModule } from '@/components/admin/RatingsModule';
import { NotificationsModule } from '@/components/admin/NotificationsModule';
import { AnalyticsModule } from '@/components/admin/AnalyticsModule';
import { SettingsModule } from '@/components/admin/SettingsModule';
import { AuditLogsModule } from '@/components/admin/AuditLogsModule';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [houses, setHouses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/account');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await apiService.admin.getDashboard();
    if (res.success) {
      setHouses([...(res.houses || []), ...(res.items || [])]);
      setUsers(res.users || []);
      setReports(res.reports || []);
      setRequests(res.requests || []);
      if (supabase) {
        const { data: logData } = await supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
        if (logData) setLogs(logData);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    if (!supabase) return;

    const channels = [
      supabase.channel('admin-listings').on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => fetchData()),
      supabase.channel('admin-profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData()),
      supabase.channel('admin-reports').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => fetchData()),
      supabase.channel('admin-logs').on('postgres_changes', { event: '*', schema: 'public', table: 'admin_audit_logs' }, (payload) => {
        setLogs(prev => [payload.new, ...prev].slice(0, 50));
      })
    ];

    channels.forEach(channel => channel.subscribe());
    return () => { channels.forEach(channel => channel.unsubscribe()); };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out', description: 'Returning to homepage...' });
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'listings', label: 'Listings', icon: Building2 },
    { id: 'requests', label: 'Requests', icon: Clock },
    { id: 'reports', label: 'Reports', icon: ShieldAlert },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Database },
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewModule users={users} houses={houses} reports={reports} logs={logs} isLoading={isLoading} onNavigate={setActiveTab} />;
      case 'users':
        return <UsersModule users={users} onRefresh={fetchData} />;
      case 'verification':
        return <VerificationModule users={users} logs={logs} reports={reports} onRefresh={fetchData} />;
      case 'listings':
        return <ListingsModule houses={houses} users={users} reports={reports} logs={logs} onRefresh={fetchData} onNavigate={setActiveTab} />;
      case 'add-listing':
        return <AddListingModule onRefresh={fetchData} />;
      case 'requests':
        return <RequestsModule requests={requests} users={users} logs={logs} onRefresh={fetchData} />;
      case 'reports':
        return <ReportsModule reports={reports} users={users} houses={houses} logs={logs} onRefresh={fetchData} />;
      case 'ratings':
        return <RatingsModule users={users} houses={houses} logs={logs} onRefresh={fetchData} />;
      case 'notifications':
        return <NotificationsModule users={users} houses={houses} onRefresh={fetchData} />;
      case 'analytics':
        return <AnalyticsModule users={users} houses={houses} reports={reports} requests={requests} onRefresh={fetchData} />;
      case 'settings':
        return <SettingsModule onRefresh={fetchData} />;
      case 'audit':
        return <AuditLogsModule logs={logs} users={users} onRefresh={fetchData} />;
      default:
        return <OverviewModule users={users} houses={houses} reports={reports} logs={logs} isLoading={isLoading} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-transparent text-slate-900 overflow-hidden font-sans antialiased mt-6">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 relative z-50 rounded-tl-[2.5rem]",
        sidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <h1 className="font-heading font-black text-xl tracking-tight text-[#0F3D91] uppercase">Admin Panel</h1>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl hover:bg-slate-50">
            <Menu className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                activeTab === item.id ? "bg-[#0F3D91] text-white shadow-lg shadow-blue-900/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}>
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", activeTab === item.id ? "text-orange-400" : "group-hover:scale-110")} />
              {sidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {activeTab === item.id && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-orange-400 rounded-r-full" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-50 space-y-1">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-200 group">
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
          {sidebarOpen && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F3D91] flex items-center justify-center text-white font-black text-sm">{user?.name?.[0] || 'A'}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">Active Session</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-lg tracking-tight text-[#0F3D91] uppercase">Admin Panel</h1>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[#F8FAFC] rounded-tr-[2.5rem] border-t border-r border-slate-200">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {renderActiveModule()}
          </div>
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[300px] p-0 border-none">
            <div className="h-full flex flex-col bg-white">
              <div className="p-8 border-b border-slate-50"><h1 className="font-heading font-black text-2xl tracking-tight text-[#0F3D91] uppercase">Admin Panel</h1></div>
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all font-black text-[11px] uppercase tracking-widest",
                      activeTab === item.id ? "bg-[#0F3D91] text-white shadow-xl shadow-blue-900/20" : "text-slate-500 hover:bg-slate-50")}>
                    <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-orange-400" : "text-slate-400")} />{item.label}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-slate-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}

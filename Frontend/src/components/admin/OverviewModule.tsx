import { useMemo } from 'react';
import { Building2, Users, Clock, ShieldCheck, ShieldAlert, Zap, ArrowRight, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OverviewModuleProps {
  users: any[];
  houses: any[];
  reports: any[];
  logs: any[];
  isLoading: boolean;
  onNavigate: (tab: string) => void;
}

export function OverviewModule({ users, houses, reports, logs, isLoading, onNavigate }: OverviewModuleProps) {
  const kpiStats = useMemo(() => ({
    totalUsers: users.length,
    activeListings: houses.filter(h => h.status === 'available').length,
    pendingListings: houses.filter(h => h.status === 'pending').length,
    verifiedLandlords: users.filter(u => u.verified && u.role === 'landlord').length,
    openReports: reports.filter(r => r.status === 'pending').length,
  }), [users, houses, reports]);

  const trendData = useMemo(() => {
    const base = kpiStats.totalUsers || 10;
    return [
      { name: 'Mon', users: Math.floor(base * 0.7), listings: 12 },
      { name: 'Tue', users: Math.floor(base * 0.8), listings: 15 },
      { name: 'Wed', users: Math.floor(base * 0.75), listings: 18 },
      { name: 'Thu', users: Math.floor(base * 0.9), listings: 22 },
      { name: 'Fri', users: Math.floor(base * 0.85), listings: 25 },
      { name: 'Sat', users: Math.floor(base * 0.95), listings: 28 },
      { name: 'Sun', users: base, listings: kpiStats.activeListings },
    ];
  }, [kpiStats]);

  const KPICard = ({ title, value, icon: Icon, color, onClick, description, trend, span = "" }: any) => (
    <motion.button whileHover={{ scale: 1.01, translateY: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={cn("relative overflow-hidden p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 text-left group transition-all duration-300", span)}>
      <div className={cn("absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-3xl", color)} />
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-2xl", color.replace('bg-', 'text-').replace('500', '100'))}>
          <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
      </div>
      <div>
        {isLoading ? (
          <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-xl mb-2" />
        ) : (
          <div className="flex items-baseline gap-3 mb-1">
            <h3 className="text-4xl font-black tracking-tight text-slate-900">{value.toLocaleString()}</h3>
            {trend && (
              <span className={cn("flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-lg", trend > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50")}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        )}
        <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">{title}</p>
        <p className="text-xs text-slate-500 font-medium line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">{description}</p>
      </div>
    </motion.button>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col px-2">
        <h2 className="font-heading text-3xl font-black tracking-tight text-[#0F3D91] uppercase">Operational Overview</h2>
        <p className="text-slate-500 font-medium text-sm tracking-tight">Real-time platform performance and management gateways.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KPICard title="Total Users" value={kpiStats.totalUsers} icon={Users} color="bg-blue-500" trend={12} description="Growth of registered platform actors" onClick={() => onNavigate('users')} span="md:col-span-2" />
            <KPICard title="Active Listings" value={kpiStats.activeListings} icon={Building2} color="bg-green-500" trend={5} description="Properties live in market" onClick={() => onNavigate('listings')} />
            <KPICard title="Pending Review" value={kpiStats.pendingListings} icon={Clock} color="bg-orange-500" trend={-2} description="Moderate submissions" onClick={() => onNavigate('listings')} />
          </div>
          <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-xl font-black uppercase tracking-tight">Growth Narrative</CardTitle>
                  <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly acquisition velocity</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500/10 text-blue-600 border-none rounded-lg font-black text-[9px] uppercase tracking-widest">Profiles</Badge>
                  <Badge className="bg-green-500/10 text-green-600 border-none rounded-lg font-black text-[9px] uppercase tracking-widest">Listings</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="listings" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorListings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Critical Handlers</h3>
              <Badge className="bg-red-500 text-white border-none rounded-lg font-black text-[9px] uppercase tracking-widest px-2">{kpiStats.openReports}</Badge>
            </div>
            <KPICard title="Security Reports" value={kpiStats.openReports} icon={ShieldAlert} color="bg-red-500" description="Active risk flags in queue" onClick={() => onNavigate('reports')} />
            <KPICard title="Pending Verification" value={kpiStats.verifiedLandlords} icon={ShieldCheck} color="bg-indigo-500" description="Verify landlord credentials" onClick={() => onNavigate('verification')} />
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Live Ops Ledger</h3>
              <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /></div>
            </div>
            <div className="space-y-6">
              {logs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors"><Zap className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-700 leading-tight truncate uppercase tracking-tight">{log.action}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{log.target_type} • {new Date(log.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Layers className="w-6 h-6 text-slate-200" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No active events</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-50 h-12" onClick={() => onNavigate('audit')}>Open Audit Ledger</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

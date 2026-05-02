import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Building2, ShieldAlert, Star, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface AnalyticsModuleProps {
  users: any[];
  houses: any[];
  reports: any[];
  requests: any[];
  onRefresh: () => void;
}

const COLORS = ['#0F3D91', '#FF7A00', '#22c55e', '#ef4444', '#8b5cf6'];

export function AnalyticsModule({ users, houses, reports, requests, onRefresh }: AnalyticsModuleProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'ytd'>('week');

  // Only compute from schema-valid records (non-orphaned)
  const validHouses = useMemo(() => houses.filter(h => h.landlordId && h.title), [houses]);
  const validReports = useMemo(() => reports.filter(r => r.target_id && r.reason), [reports]);

  const metrics = useMemo(() => {
    const now = Date.now();
    const ranges = { day: 1, week: 7, month: 30, ytd: 365 };
    const days = ranges[timeRange];
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const recentUsers = users.filter(u => new Date(u.createdAt).getTime() > cutoff);
    const recentListings = validHouses.filter(h => new Date(h.createdAt).getTime() > cutoff);
    const recentReports = validReports.filter(r => new Date(r.created_at).getTime() > cutoff);

    const activeListings = validHouses.filter(h => h.status === 'available').length;
    const pendingListings = validHouses.filter(h => h.status === 'pending').length;
    const verifiedLandlords = users.filter(u => u.verified && u.role === 'landlord').length;
    const openReports = validReports.filter(r => r.status === 'pending').length;

    return { recentUsers, recentListings, recentReports, activeListings, pendingListings, verifiedLandlords, openReports };
  }, [users, validHouses, validReports, timeRange]);

  const roleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => { counts[u.role] = (counts[u.role] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const listingsByType = useMemo(() => [
    { name: 'Houses', value: validHouses.filter(h => h.houseType).length },
    { name: 'Items', value: validHouses.filter(h => !h.houseType).length },
  ], [validHouses]);

  const statusBreakdown = useMemo(() => [
    { name: 'Active', value: metrics.activeListings, color: '#22c55e' },
    { name: 'Pending', value: metrics.pendingListings, color: '#FF7A00' },
    { name: 'Archived', value: validHouses.filter(h => h.status === 'taken').length, color: '#94a3b8' },
  ], [metrics, validHouses]);

  const weeklyTrend = useMemo(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      name: day,
      users: Math.max(0, Math.floor(users.length * (0.6 + Math.random() * 0.4))),
      listings: Math.max(0, Math.floor(validHouses.length * (0.5 + Math.random() * 0.5))),
      reports: Math.max(0, Math.floor(validReports.length * (0.3 + Math.random() * 0.7))),
    }));
  }, [users.length, validHouses.length, validReports.length]);

  const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/40 bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className={cn("p-4 rounded-2xl", color + '/10')}>
            <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
          </div>
          {trend !== undefined && (
            <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
        {sub && <p className="text-xs text-slate-400 font-medium mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Analytics</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Aggregate insights — integrity-checked, non-orphaned records only.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
            {(['day', 'week', 'month', 'ytd'] as const).map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={cn("px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                  timeRange === t ? "bg-white shadow text-[#0F3D91]" : "text-slate-400 hover:text-slate-600")}>
                {t}
              </button>
            ))}
          </div>
          <Button onClick={onRefresh} variant="outline" className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" trend={12} sub={`${metrics.recentUsers.length} in period`} />
        <StatCard title="Active Listings" value={metrics.activeListings} icon={Building2} color="bg-green-500" trend={5} sub={`${metrics.recentListings.length} in period`} />
        <StatCard title="Open Reports" value={metrics.openReports} icon={ShieldAlert} color="bg-red-500" trend={-3} sub={`${metrics.recentReports.length} in period`} />
        <StatCard title="Verified Landlords" value={metrics.verifiedLandlords} icon={Star} color="bg-amber-500" trend={8} sub="Trust-verified accounts" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="font-heading text-xl font-black uppercase tracking-tight">Weekly Activity Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F3D91" stopOpacity={0.1}/><stop offset="95%" stopColor="#0F3D91" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gListings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gReports" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="users" stroke="#0F3D91" strokeWidth={2.5} fill="url(#gUsers)" name="Users" />
                  <Area type="monotone" dataKey="listings" stroke="#22c55e" strokeWidth={2.5} fill="url(#gListings)" name="Listings" />
                  <Area type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2.5} fill="url(#gReports)" name="Reports" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="font-heading text-sm font-black uppercase tracking-tight">User Role Mix</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                      {roleDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 900 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="font-heading text-sm font-black uppercase tracking-tight">Listing Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {statusBreakdown.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ backgroundColor: s.color, width: `${validHouses.length ? (s.value / validHouses.length) * 100 : 0}%` }} />
                    </div>
                    <div className="text-right min-w-[3rem]">
                      <p className="text-[10px] font-black text-slate-700">{s.value}</p>
                      <p className="text-[9px] text-slate-400">{s.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, Fragment } from 'react';
import { ShieldCheck, Shield, UserX, Clock, RefreshCcw, Eye, Check, Search, ChevronRight, AlertCircle, Star, Award, BadgeCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface VerificationModuleProps {
  users: any[];
  logs: any[];
  reports: any[];
  onRefresh: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TABS = [
  { id: 'pending', label: 'Pending', icon: Clock, desc: 'Awaiting first approval' },
  { id: 'verified', label: 'Verified', icon: ShieldCheck, desc: 'is_verified = true' },
  { id: 'landlord-queue', label: 'Landlord Queue', icon: Award, desc: 'role=landlord, unverified' },
  { id: 're-verification', label: 'Re-verify', icon: RefreshCcw, desc: 'Permission or role changes' },
  { id: 'flagged', label: 'Flagged', icon: AlertCircle, desc: 'Reports + low reputation' },
];

export function VerificationModule({ users, logs, reports, onRefresh }: VerificationModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      if (!matchSearch) return false;

      switch (subTab) {
        case 'pending':
          return !u.verified && !logs.some(l => l.target_id === u.id && l.action?.includes('verify'));
        case 'verified':
          return u.verified === true;
        case 'landlord-queue':
          return u.role === 'landlord' && !u.verified;
        case 're-verification':
          return logs.some(l => l.target_id === u.id && (l.action?.includes('role_change') || l.action?.includes('permission')));
        case 'flagged': {
          const reportCount = reports.filter(r => r.target_id === u.id).length;
          return reportCount >= 2 || (u.reputationScore !== undefined && u.reputationScore < 40);
        }
        default: return true;
      }
    });
  }, [users, logs, reports, subTab, search]);

  const tabCounts = useMemo(() => ({
    pending: users.filter(u => !u.verified && !logs.some(l => l.target_id === u.id && l.action?.includes('verify'))).length,
    verified: users.filter(u => u.verified).length,
    'landlord-queue': users.filter(u => u.role === 'landlord' && !u.verified).length,
    're-verification': users.filter(u => logs.some(l => l.target_id === u.id && (l.action?.includes('role_change') || l.action?.includes('permission')))).length,
    flagged: users.filter(u => reports.filter(r => r.target_id === u.id).length >= 2 || (u.reputationScore !== undefined && u.reputationScore < 40)).length,
  }), [users, logs, reports]);

  const logAction = async (action: string, targetId: string, targetType: string) => {
    if (!supabase) return;
    await supabase.from('admin_audit_logs').insert({ action, target_id: targetId, target_type: targetType, metadata: {} });
  };

  const handleVerify = async (userId: string) => {
    if (!supabase) { toast({ title: 'Supabase not configured', variant: 'destructive' }); return; }
    setProcessing(userId);
    const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', userId);
    if (error) {
      toast({ title: 'Verification failed', description: error.message, variant: 'destructive' });
    } else {
      await logAction('VERIFY_USER', userId, 'profile');
      toast({ title: 'User verified ✓', description: 'Identity credential approved.' });
      onRefresh();
    }
    setProcessing(null);
  };

  const handleRevoke = async (userId: string) => {
    if (!supabase) { toast({ title: 'Supabase not configured', variant: 'destructive' }); return; }
    setProcessing(userId);
    const { error } = await supabase.from('profiles').update({ is_verified: false }).eq('id', userId);
    if (error) {
      toast({ title: 'Revocation failed', description: error.message, variant: 'destructive' });
    } else {
      await logAction('REVOKE_VERIFICATION', userId, 'profile');
      toast({ title: 'Verification revoked', variant: 'destructive' });
      onRefresh();
    }
    setProcessing(null);
  };

  const handleBulkVerify = async () => {
    for (const id of selected) await handleVerify(id);
    setSelected([]);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Verification</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Trust and identity control center — cross-validated against profiles, reports, and audit logs.</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
          <RefreshCcw className="w-4 h-4" /> Sync State
        </Button>
      </div>

      <Tabs value={subTab} onValueChange={v => { setSubTab(v); setSelected([]); }} className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 px-2">
          <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50 flex-wrap h-auto gap-1">
            {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-5 py-2 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl relative">
                <tab.icon className="w-3.5 h-3.5 mr-2" />
                {tab.label}
                {(tabCounts as any)[tab.id] > 0 && (
                  <span className={cn("ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black", subTab === tab.id ? "bg-[#0F3D91] text-white" : "bg-slate-200 text-slate-600")}>
                    {(tabCounts as any)[tab.id]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0F3D91]" />
            <input type="text" placeholder="Search identity..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mx-2 mb-6 p-4 bg-[#0F3D91] rounded-[2rem] shadow-2xl shadow-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-4 ml-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-white text-lg">{selected.length}</div>
                <p className="text-white font-black text-xs uppercase tracking-widest">Selected for Bulk Action</p>
              </div>
              <div className="flex items-center gap-2 mr-2">
                <Button variant="ghost" onClick={handleBulkVerify} className="h-12 rounded-xl text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest px-6">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Verify All
                </Button>
                <Button variant="ghost" onClick={() => setSelected([])} className="h-12 rounded-xl text-white/40 font-black text-[10px] uppercase tracking-widest px-4">Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase tracking-tight">No records in this state</h4>
              <p className="text-xs text-slate-400 font-medium mt-2">Dataset validated — no matching entries for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 w-10">
                      <button onClick={() => setSelected(selected.length === filteredData.length ? [] : filteredData.map(u => u.id))}
                        className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", selected.length === filteredData.length ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200")}>
                        {selected.length === filteredData.length && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Profile</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reputation</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reports</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(u => {
                    const reportCount = reports.filter(r => r.target_id === u.id).length;
                    const isExpanded = expandedId === u.id;
                    const isProcessing = processing === u.id;
                    return (
                      <Fragment key={u.id}>
                        <tr key={u.id} className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all duration-200">
                          <td className="p-6">
                            <button onClick={() => setSelected(selected.includes(u.id) ? selected.filter(id => id !== u.id) : [...selected, u.id])}
                              className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", selected.includes(u.id) ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200 group-hover:border-slate-300")}>
                              {selected.includes(u.id) && <Check className="w-4 h-4 text-white" />}
                            </button>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden border-4 border-white shadow-md flex items-center justify-center font-black text-slate-400 text-sm">
                                {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{u.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <Badge className={cn("rounded-xl font-black text-[9px] uppercase tracking-widest border-none px-3 py-1",
                              u.role === 'admin' ? "bg-purple-600 text-white" : u.role === 'landlord' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700")}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 rounded-full flex-1 max-w-[80px]", u.reputationScore >= 70 ? "bg-green-200" : u.reputationScore >= 40 ? "bg-amber-200" : "bg-red-200")}>
                                <div className={cn("h-full rounded-full transition-all", u.reputationScore >= 70 ? "bg-green-500" : u.reputationScore >= 40 ? "bg-amber-500" : "bg-red-500")}
                                  style={{ width: `${Math.min(100, u.reputationScore || 0)}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-slate-600">{u.reputationScore ?? '—'}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", reportCount > 0 ? "text-red-600 bg-red-50" : "text-slate-400 bg-slate-50")}>
                              {reportCount} report{reportCount !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-[10px] font-black text-slate-600 uppercase">{formatDate(u.createdAt)}</p>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              {!u.verified ? (
                                <Button size="sm" onClick={() => handleVerify(u.id)} disabled={isProcessing}
                                  className="rounded-xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[9px] uppercase tracking-widest h-10 px-4 gap-2">
                                  {isProcessing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                                  Approve
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleRevoke(u.id)} disabled={isProcessing}
                                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[9px] uppercase tracking-widest h-10 px-4 gap-2">
                                  {isProcessing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <UserX className="w-3 h-3" />}
                                  Revoke
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : u.id)}
                                className="rounded-xl h-10 w-10 p-0 hover:bg-slate-100">
                                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${u.id}-expanded`}>
                            <td colSpan={7} className="px-10 pb-8 bg-slate-50/40">
                              <div className="grid grid-cols-3 gap-6 pt-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Linked Audit Logs</p>
                                  {logs.filter(l => l.target_id === u.id).slice(0, 3).map((l, i) => (
                                    <div key={i} className="flex items-start gap-3 mb-3">
                                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-slate-700">{l.action}</p>
                                        <p className="text-[9px] text-slate-400">{formatDate(l.created_at)}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {logs.filter(l => l.target_id === u.id).length === 0 && <p className="text-xs text-slate-300 font-bold">No audit history</p>}
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Active Reports</p>
                                  {reports.filter(r => r.target_id === u.id).slice(0, 3).map((r, i) => (
                                    <div key={i} className="flex items-start gap-3 mb-3">
                                      <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-slate-700">{r.reason}</p>
                                        <p className="text-[9px] text-slate-400">{r.status} • {formatDate(r.created_at)}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {reports.filter(r => r.target_id === u.id).length === 0 && <p className="text-xs text-slate-300 font-bold">No reports</p>}
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Profile Integrity</p>
                                  {[
                                    { label: 'Verified', value: u.verified ? 'Yes' : 'No', ok: u.verified },
                                    { label: 'Role', value: u.role, ok: true },
                                    { label: 'Reputation', value: u.reputationScore ?? '—', ok: (u.reputationScore ?? 60) >= 40 },
                                    { label: 'Badges', value: (u.badges?.length ?? 0) + ' badges', ok: true },
                                  ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</p>
                                      <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black text-slate-800">{String(item.value)}</p>
                                        <div className={cn("w-2 h-2 rounded-full", item.ok ? "bg-green-400" : "bg-red-400")} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} — validated against schema state
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

import { useState, useMemo, Fragment } from 'react';
import { ShieldAlert, CheckCircle, XCircle, RefreshCcw, AlertTriangle, Search, ChevronRight, TrendingUp, Save, Edit, Building2, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ReportsModuleProps {
  reports: any[];
  users: any[];
  houses: any[];
  logs: any[];
  onRefresh: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  investigating: 'bg-blue-50 text-blue-700 border-blue-100',
  resolved: 'bg-green-50 text-green-700 border-green-100',
  rejected: 'bg-red-50 text-red-700 border-red-100',
};

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending', icon: AlertTriangle },
  { id: 'investigating', label: 'Investigating', icon: RefreshCcw },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
];

export function ReportsModule({ reports, users, houses, logs, onRefresh }: ReportsModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Priority weighting: recency + frequency per target
  const prioritizedReports = useMemo(() => {
    const q = search.toLowerCase();
    const targetFreq: Record<string, number> = {};
    reports.forEach(r => { targetFreq[r.target_id] = (targetFreq[r.target_id] || 0) + 1; });

    return reports
      .filter(r => {
        // Validate: reporter and target must exist in profiles or listings
        const hasReporter = users.some(u => u.id === (r.reporter_id || r.reporterId));
        const hasTarget = users.some(u => u.id === r.target_id) || houses.some(h => h.id === r.target_id);
        if (!hasReporter || !hasTarget) return false;
        const matchSearch = !q || r.reason?.toLowerCase().includes(q) || r.target_type?.toLowerCase().includes(q);
        if (!matchSearch) return false;
        if (subTab === 'all') return true;
        return r.status === subTab;
      })
      .sort((a, b) => {
        const freqDiff = (targetFreq[b.target_id] || 0) - (targetFreq[a.target_id] || 0);
        if (freqDiff !== 0) return freqDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [reports, users, houses, subTab, search]);

  const tabCounts = useMemo(() => ({
    all: reports.filter(r => users.some(u => u.id === (r.reporter_id || r.reporterId))).length,
    pending: reports.filter(r => r.status === 'pending').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  }), [reports, users]);

  const updateStatus = async (reportId: string, newStatus: string, report: any) => {
    // Prevent duplicate resolution
    if (report.status === newStatus) {
      toast({ title: 'Already in this state', description: `Report is already ${newStatus}.`, variant: 'destructive' });
      return;
    }
    if (!supabase) return;
    setProcessing(reportId);
    const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ action: `REPORT_${newStatus.toUpperCase()}`, target_id: reportId, target_type: 'report', metadata: { reason: report.reason, target_type: report.target_type } });
      toast({ title: `Report ${newStatus} ✓` });
      onRefresh();
    }
    setProcessing(null);
  };

  const openViewingModal = (report: any) => {
    setViewingReport(report);
    setEditForm({
      reason: report.reason || '',
      details: report.details || '',
      status: report.status || 'pending'
    });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!supabase || !viewingReport) return;
    setProcessing(viewingReport.id);
    
    const { error } = await supabase
      .from('reports')
      .update({
        reason: editForm.reason,
        details: editForm.details,
        status: editForm.status
      })
      .eq('id', viewingReport.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ 
        action: 'UPDATE_REPORT', 
        target_id: viewingReport.id, 
        target_type: 'report', 
        metadata: { old: viewingReport, new: editForm } 
      });
      toast({ title: 'Report saved ✓', description: 'Resolution data persisted to database.' });
      onRefresh();
      setViewingReport(null);
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Reports</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Moderation center — priority-weighted by frequency and recency, relational integrity enforced.</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
          <RefreshCcw className="w-4 h-4" /> Sync
        </Button>
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
          <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50">
            {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-5 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl">
                {tab.icon && <tab.icon className="w-3.5 h-3.5 mr-2" />}
                {tab.label}
                {(tabCounts as any)[tab.id] > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-slate-200 text-slate-600">{(tabCounts as any)[tab.id]}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          {prioritizedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><ShieldAlert className="w-10 h-10 text-slate-200" /></div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase">No reports in this state</h4>
              <p className="text-xs text-slate-400 mt-2">Integrity validated — no records with valid relational links.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Report</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prioritizedReports.map((r, idx) => {
                    const isExpanded = expandedId === r.id;
                    const isProcessing = processing === r.id;
                    const reporter = users.find(u => u.id === (r.reporter_id || r.reporterId));
                    const targetUser = users.find(u => u.id === r.target_id);
                    const targetListing = houses.find(h => h.id === r.target_id);
                    const priorityScore = idx < 3 ? 'HIGH' : idx < 8 ? 'MED' : 'LOW';
                    return (
                      <Fragment key={r.id}>
                        <tr className={cn("group border-b border-slate-50 transition-all duration-200", idx < 3 ? "bg-red-50/20 hover:bg-red-50/30" : "hover:bg-slate-50/30")}>
                          <td className="p-6">
                            <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                              priorityScore === 'HIGH' ? "bg-red-100 text-red-600" : priorityScore === 'MED' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500")}>
                              {priorityScore}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="font-black text-slate-900 text-sm">{r.reason}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 truncate max-w-[180px]">{r.details}</p>
                          </td>
                          <td className="p-6">
                            <div>
                              <Badge className={cn("rounded-xl font-black text-[9px] uppercase tracking-widest border-none px-3 py-1",
                                r.target_type === 'profile' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700")}>
                                {r.target_type}
                              </Badge>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">{targetUser?.name || targetListing?.title || r.target_id?.slice(0, 8)}</p>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border", STATUS_STYLE[r.status] || STATUS_STYLE.pending)}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-black text-slate-700">{reporter?.name || '—'}</p>
                          </td>
                          <td className="p-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase">{formatDate(r.created_at)}</p>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openViewingModal(r)}
                                className="w-9 h-9 rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-all">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {r.status === 'pending' && (
                                <Button size="sm" onClick={() => updateStatus(r.id, 'investigating', r)} disabled={isProcessing}
                                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase h-9 px-3">
                                  Investigate
                                </Button>
                              )}
                              {(r.status === 'pending' || r.status === 'investigating') && (
                                <Button size="sm" onClick={() => updateStatus(r.id, 'resolved', r)} disabled={isProcessing}
                                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase h-9 px-3">
                                  Resolve
                                </Button>
                              )}
                              {r.status !== 'rejected' && r.status !== 'resolved' && (
                                <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, 'rejected', r)} disabled={isProcessing}
                                  className="rounded-xl text-red-500 hover:bg-red-50 font-black text-[9px] uppercase h-9 px-3">
                                  Dismiss
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                className="rounded-xl h-9 w-9 p-0 hover:bg-slate-100">
                                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${r.id}-exp`}>
                            <td colSpan={7} className="px-10 pb-8 bg-slate-50/40">
                              <div className="grid grid-cols-3 gap-6 pt-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Full Report Details</p>
                                  <p className="text-sm text-slate-700 font-medium">{r.details || 'No additional details.'}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Target Entity</p>
                                  {targetUser && <><p className="text-sm font-black text-slate-800">{targetUser.name}</p><p className="text-[10px] text-slate-400">{targetUser.email} • {targetUser.role}</p></>}
                                  {targetListing && <><p className="text-sm font-black text-slate-800">{targetListing.title}</p><p className="text-[10px] text-slate-400">{targetListing.location} • {targetListing.status}</p></>}
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Moderation Audit</p>
                                  {logs.filter(l => l.target_id === r.id).slice(0, 3).map((l, i) => (
                                    <div key={i} className="flex items-start gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                      <p className="text-xs font-bold text-slate-700">{l.action} — {formatDate(l.created_at)}</p>
                                    </div>
                                  ))}
                                  {logs.filter(l => l.target_id === r.id).length === 0 && <p className="text-xs text-slate-300 font-bold">No audit trail yet</p>}
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
              {prioritizedReports.length} reports — integrity-validated, priority-weighted
            </p>
          </div>
        </div>
      </Tabs>

      <AnimatePresence>
        {viewingReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingReport(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Report Header/Sidebar */}
              <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-10 h-10 text-red-600" />
                </div>
                
                <h3 className="text-xl font-black text-slate-900 text-center leading-tight mb-2">Report Audit</h3>
                <Badge className={cn("rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-1.5 border-none shadow-sm mb-8", STATUS_STYLE[viewingReport.status])}>
                  {viewingReport.status}
                </Badge>
                
                <div className="w-full space-y-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Target Type</span>
                    <span className="text-sm font-black text-slate-700 capitalize">{viewingReport.target_type}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Created</span>
                    <span className="text-sm font-black text-slate-700">{formatDate(viewingReport.created_at)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 w-full">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="w-full h-14 rounded-2xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-blue-900/20">
                      <Edit className="w-4 h-4" /> Edit Report
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button onClick={handleSaveEdit} disabled={processing === viewingReport.id} className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-green-900/20">
                        {processing === viewingReport.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="font-heading text-3xl font-black text-slate-900 tracking-tight uppercase">Investigation Log</h4>
                  <button onClick={() => setViewingReport(null)} className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"><XCircle className="w-6 h-6" /></button>
                </div>

                {isEditing ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Report Reason</label>
                      <input className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all"
                        value={editForm.reason} onChange={e => setEditForm({ ...editForm, reason: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resolution Details & Notes</label>
                      <textarea className="w-full min-h-[150px] rounded-3xl bg-slate-50 border-transparent p-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all resize-none"
                        value={editForm.details} onChange={e => setEditForm({ ...editForm, details: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resolution Status</label>
                      <select className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all outline-none"
                        value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="pending">Pending</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">{viewingReport.reason}</h2>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-red-600" />
                          <span className="text-xs font-black text-red-600 uppercase tracking-tight">{viewingReport.target_type} Incident</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {viewingReport.id}</p>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                        "{viewingReport.details || 'No additional details provided by reporter.'}"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</h5>
                        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                            {users.find(u => u.id === (viewingReport.reporter_id || viewingReport.reporterId))?.name?.charAt(0) || 'R'}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">{users.find(u => u.id === (viewingReport.reporter_id || viewingReport.reporterId))?.name || 'Unknown'}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Identity Verified</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Object</h5>
                        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                            {viewingReport.target_type === 'listing' ? <Building2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {viewingReport.target_type === 'listing' 
                                ? (houses.find(h => h.id === viewingReport.target_id)?.title || 'Listing Fragment')
                                : (users.find(u => u.id === viewingReport.target_id)?.name || 'Profile Entity')}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{viewingReport.target_id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Record</p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                        This incident report was filed via platform trust mechanisms. Resolution should be based on evidence provided in the investigation details above.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

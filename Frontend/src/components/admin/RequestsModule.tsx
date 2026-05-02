import { useState, useMemo, Fragment } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCcw, Eye, Search, ChevronRight, Check, AlertTriangle, Edit, Save } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface RequestsModuleProps {
  requests: any[];
  users: any[];
  logs: any[];
  onRefresh: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['in_progress', 'rejected'],
  in_progress: ['resolved', 'rejected'],
  resolved: [],
  rejected: [],
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
  resolved: 'bg-green-50 text-green-700 border-green-100',
  rejected: 'bg-red-50 text-red-700 border-red-100',
};

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'in_progress', label: 'In Progress', icon: RefreshCcw },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
];

export function RequestsModule({ requests, users, logs, onRefresh }: RequestsModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter(r => {
      // Validate relational integrity — must have linked user
      if (!r.user_id && !r.userId) return false;
      const matchSearch = !q || r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (subTab === 'all') return true;
      return r.status === subTab;
    });
  }, [requests, subTab, search]);

  const tabCounts = useMemo(() => ({
    all: requests.filter(r => r.user_id || r.userId).length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests]);

  const updateStatus = async (requestId: string, currentStatus: string, newStatus: string) => {
    const allowed = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      toast({ title: 'Invalid transition', description: `Cannot transition from ${currentStatus} → ${newStatus} without admin override.`, variant: 'destructive' });
      return;
    }
    if (!supabase) return;
    setProcessing(requestId);
    const { error } = await supabase.from('user_requests').update({ status: newStatus }).eq('id', requestId);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ action: `REQUEST_STATUS_${newStatus.toUpperCase()}`, target_id: requestId, target_type: 'request', metadata: { from: currentStatus, to: newStatus } });
      toast({ title: `Request ${newStatus.replace('_', ' ')} ✓` });
      onRefresh();
    }
    setProcessing(null);
  };

  const openViewingModal = (req: any) => {
    setViewingRequest(req);
    setEditForm({
      title: req.title || '',
      description: req.description || '',
      category: req.category || 'general',
      status: req.status || 'pending'
    });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!supabase || !viewingRequest) return;
    setProcessing(viewingRequest.id);
    
    const { error } = await supabase
      .from('user_requests')
      .update({
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        status: editForm.status
      })
      .eq('id', viewingRequest.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ 
        action: 'UPDATE_REQUEST', 
        target_id: viewingRequest.id, 
        target_type: 'request', 
        metadata: { old: viewingRequest, new: editForm } 
      });
      toast({ title: 'Request updated ✓', description: 'Changes persisted to database.' });
      onRefresh();
      setViewingRequest(null);
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Requests</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">User request management with enforced state transitions and audit tracking.</p>
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
            <input type="text" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><Clock className="w-10 h-10 text-slate-200" /></div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase">No requests in this state</h4>
              <p className="text-xs text-slate-400 mt-2">Relational integrity validated — no matching records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Request</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Requester</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(r => {
                    const isExpanded = expandedId === r.id;
                    const isProcessing = processing === r.id;
                    const transitions = STATUS_TRANSITIONS[r.status] || [];
                    const requester = users.find(u => u.id === (r.user_id || r.userId));
                    return (
                      <Fragment key={r.id}>
                        <tr className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all duration-200">
                          <td className="p-6">
                            <p className="font-black text-slate-900 text-sm truncate max-w-[200px] group-hover:text-[#0F3D91]">{r.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate max-w-[200px]">{r.description}</p>
                          </td>
                          <td className="p-6">
                            <Badge className="bg-slate-100 text-slate-700 border-none rounded-xl font-black text-[9px] uppercase px-3 py-1">{r.category || 'General'}</Badge>
                          </td>
                          <td className="p-6">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border", STATUS_STYLE[r.status] || STATUS_STYLE.pending)}>
                              {r.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-6">
                            {requester ? (
                              <p className="text-sm font-black text-slate-700">{requester.name}</p>
                            ) : (
                              <div className="flex items-center gap-2 text-amber-500">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase">Unlinked</span>
                              </div>
                            )}
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
                              {transitions.includes('in_progress') && (
                                <Button size="sm" onClick={() => updateStatus(r.id, r.status, 'in_progress')} disabled={isProcessing}
                                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase h-9 px-3">
                                  {isProcessing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : 'Start'}
                                </Button>
                              )}
                              {transitions.includes('resolved') && (
                                <Button size="sm" onClick={() => updateStatus(r.id, r.status, 'resolved')} disabled={isProcessing}
                                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase h-9 px-3">
                                  Resolve
                                </Button>
                              )}
                              {transitions.includes('rejected') && (
                                <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, r.status, 'rejected')} disabled={isProcessing}
                                  className="rounded-xl text-red-500 hover:bg-red-50 font-black text-[9px] uppercase h-9 px-3">
                                  Reject
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
                            <td colSpan={6} className="px-10 pb-8 bg-slate-50/40">
                              <div className="grid grid-cols-2 gap-6 pt-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Full Request</p>
                                  <p className="text-sm text-slate-700 font-medium">{r.description || 'No additional details provided.'}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Audit Trail</p>
                                  {logs.filter(l => l.target_id === r.id).slice(0, 4).map((l, i) => (
                                    <div key={i} className="flex items-start gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                      <p className="text-xs font-bold text-slate-700">{l.action} — {formatDate(l.created_at)}</p>
                                    </div>
                                  ))}
                                  {logs.filter(l => l.target_id === r.id).length === 0 && <p className="text-xs text-slate-300 font-bold">No audit history</p>}
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
              {filteredData.length} requests — relational integrity enforced
            </p>
          </div>
        </div>
      </Tabs>

      <AnimatePresence>
        {viewingRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingRequest(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Request Header/Sidebar */}
              <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-[#0F3D91]" />
                </div>
                
                <h3 className="text-xl font-black text-slate-900 text-center leading-tight mb-2">Request Overview</h3>
                <Badge className={cn("rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-1.5 border-none shadow-sm mb-8", STATUS_STYLE[viewingRequest.status])}>
                  {viewingRequest.status}
                </Badge>
                
                <div className="w-full space-y-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Category</span>
                    <span className="text-sm font-black text-slate-700 capitalize">{viewingRequest.category || 'General'}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Submitted</span>
                    <span className="text-sm font-black text-slate-700">{formatDate(viewingRequest.created_at)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 w-full">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="w-full h-14 rounded-2xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-blue-900/20">
                      <Edit className="w-4 h-4" /> Edit Request
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button onClick={handleSaveEdit} disabled={processing === viewingRequest.id} className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-green-900/20">
                        {processing === viewingRequest.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="font-heading text-3xl font-black text-slate-900 tracking-tight uppercase">Request Details</h4>
                  <button onClick={() => setViewingRequest(null)} className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"><XCircle className="w-6 h-6" /></button>
                </div>

                {isEditing ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Request Title</label>
                      <input className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all"
                        value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Description</label>
                      <textarea className="w-full min-h-[150px] rounded-3xl bg-slate-50 border-transparent p-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all resize-none"
                        value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                        <select className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all outline-none"
                          value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                          <option value="general">General</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="complaint">Complaint</option>
                          <option value="inquiry">Inquiry</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status Control</label>
                        <select className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all outline-none"
                          value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">{viewingRequest.title}</h2>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-[#0F3D91]" />
                          <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{viewingRequest.category || 'General Request'}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {viewingRequest.id}</p>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                        "{viewingRequest.description}"
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">User Context</h5>
                      <div className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                          {users.find(u => u.id === (viewingRequest.user_id || viewingRequest.userId))?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{users.find(u => u.id === (viewingRequest.user_id || viewingRequest.userId))?.name || 'Unknown Identity'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Verified Resident</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resolution Status</p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                        This request is currently in the <span className="font-black text-slate-900">{viewingRequest.status}</span> phase. Transitioning states will notify the requester and trigger an audit entry.
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

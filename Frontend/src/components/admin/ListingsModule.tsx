import { useState, useMemo, Fragment } from 'react';
import { Building2, Eye, Check, Search, ChevronLeft, ChevronRight, RefreshCcw, Filter, Star, Package, Home, MapPin, Shield, Archive, Flag, Zap, CheckCircle, XCircle, AlertTriangle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface ListingsModuleProps {
  houses: any[];
  users: any[];
  reports: any[];
  logs: any[];
  onRefresh: () => void;
  onNavigate?: (tab: string) => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  available: { label: 'Active', color: 'bg-green-50 text-green-700 border-green-100' },
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  taken: { label: 'Archived', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  flagged: { label: 'Flagged', color: 'bg-red-50 text-red-700 border-red-100' },
};

const TABS = [
  { id: 'all', label: 'All', icon: Building2 },
  { id: 'active', label: 'Active', icon: CheckCircle },
  { id: 'pending', label: 'Pending', icon: RefreshCcw },
  { id: 'flagged', label: 'Flagged', icon: Flag },
  { id: 'archived', label: 'Archived', icon: Archive },
  { id: 'sponsored', label: 'Sponsored', icon: Zap },
];

export function ListingsModule({ houses, users, reports, logs, onRefresh, onNavigate }: ListingsModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'house' | 'item'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewingListing, setViewingListing] = useState<any | null>(null);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [imgIdx, setImgIdx] = useState(0);

  const openViewingModal = (h: any) => {
    setViewingListing(h);
    setIsEditingModal(false);
    setImgIdx(0);
    setEditForm({});
  };

  const openEditingModal = (h: any) => {
    setViewingListing(h);
    setIsEditingModal(true);
    setImgIdx(0);
    setEditForm({...h});
  };

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    let filtered = houses.filter(h => {
      const matchSearch = !q || h.title?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || (typeFilter === 'house' && !!h.houseType) || (typeFilter === 'item' && !h.houseType);
      if (!matchSearch || !matchType) return false;

      const isFlagged = reports.some(r => r.target_id === h.id && r.status === 'pending');

      switch (subTab) {
        case 'active': return h.status === 'available';
        case 'pending': return h.status === 'pending';
        case 'flagged': return isFlagged || h.status === 'flagged';
        case 'archived': return h.status === 'taken';
        case 'sponsored': return h.isSponsored;
        default: return true;
      }
    });

    return filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'title') { valA = a.title?.toLowerCase() || ''; valB = b.title?.toLowerCase() || ''; }
      if (sortField === 'price') { valA = Number(a.price) || 0; valB = Number(b.price) || 0; }
      if (sortField === 'views') { valA = Number(a.views) || 0; valB = Number(b.views) || 0; }
      if (sortField === 'status') { valA = a.status || ''; valB = b.status || ''; }
      if (sortField === 'listing_type') { valA = a.houseType ? 'house' : 'item'; valB = b.houseType ? 'house' : 'item'; }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [houses, reports, subTab, search, typeFilter, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const tabCounts = useMemo(() => ({
    all: houses.length,
    active: houses.filter(h => h.status === 'available').length,
    pending: houses.filter(h => h.status === 'pending').length,
    flagged: houses.filter(h => reports.some(r => r.target_id === h.id && r.status === 'pending')).length,
    archived: houses.filter(h => h.status === 'taken').length,
    sponsored: houses.filter(h => h.isSponsored).length,
  }), [houses, reports]);

  const logAction = async (action: string, targetId: string) => {
    if (!supabase) return;
    await supabase.from('admin_audit_logs').insert({ action, target_id: targetId, target_type: 'listing', metadata: {} });
  };

  const handleSaveEdit = async () => {
    if (!supabase || !viewingListing) return;
    setProcessing(viewingListing.id);
    
    const { error } = await supabase.from('listings').update({
      title: editForm.title,
      location: editForm.location,
      price: Number(editForm.price),
      deposit: editForm.deposit ? Number(editForm.deposit) : null,
      description: editForm.description,
      status: editForm.status === 'active' ? 'active' : editForm.status === 'archived' ? 'archived' : editForm.status === 'available' ? 'active' : editForm.status === 'taken' ? 'archived' : editForm.status,
      house_type: editForm.houseType,
      category: editForm.category,
      condition: editForm.condition,
      amenities: Array.isArray(editForm.amenities) ? editForm.amenities : editForm.amenities?.split(',').map((s:string) => s.trim()).filter(Boolean) || [],
      images: Array.isArray(editForm.images) ? editForm.images : editForm.images?.split(',').map((s:string) => s.trim()).filter(Boolean) || []
    }).eq('id', viewingListing.id);

    if (error) {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Listing updated ✓' });
      await logAction('ADMIN_UPDATE_LISTING', viewingListing.id);
      setIsEditingModal(false);
      setViewingListing(null);
      onRefresh();
    }
    setProcessing(null);
  };

  const handleApprove = async (listingId: string) => {
    if (!supabase) return;
    setProcessing(listingId);
    const { error } = await supabase.from('listings').update({ status: 'available' }).eq('id', listingId);
    if (error) {
      toast({ title: 'Failed to approve', description: error.message, variant: 'destructive' });
    } else {
      await logAction('APPROVE_LISTING', listingId);
      toast({ title: 'Listing approved ✓' });
      onRefresh();
    }
    setProcessing(null);
  };

  const handleDelete = async (listingId: string) => {
    if (!supabase) return;
    if (!window.confirm("Are you sure you want to completely delete this listing? This action cannot be undone.")) return;
    setProcessing(listingId);
    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (!error) {
      toast({ title: 'Listing deleted' });
      await logAction('DELETE_LISTING', listingId);
      onRefresh();
    } else {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const handleFlag = async (listingId: string) => {
    if (!supabase) return;
    if (!window.confirm("Are you sure you want to flag this listing?")) return;
    setProcessing(listingId);
    const { error } = await supabase.from('listings').update({ status: 'flagged' }).eq('id', listingId);
    if (!error) {
      toast({ title: 'Listing flagged' });
      await logAction('FLAG_LISTING', listingId);
      onRefresh();
    } else {
      toast({ title: 'Flag failed', description: error.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const handleArchive = async (listingId: string, currentStatus: string) => {
    if (!supabase) return;
    if (currentStatus === 'taken') {
      toast({ title: 'Invalid transition', description: 'Archived → Active requires admin override.', variant: 'destructive' });
      return;
    }
    setProcessing(listingId);
    const { error } = await supabase.from('listings').update({ status: 'taken' }).eq('id', listingId);
    if (error) {
      toast({ title: 'Failed to archive', description: error.message, variant: 'destructive' });
    } else {
      await logAction('ARCHIVE_LISTING', listingId);
      toast({ title: 'Listing archived' });
      onRefresh();
    }
    setProcessing(null);
  };

  const handleSponsorToggle = async (listingId: string, current: boolean) => {
    if (!supabase) return;
    const { error } = await supabase.from('listings').update({ is_sponsored: !current }).eq('id', listingId);
    if (!error) {
      await logAction(current ? 'REMOVE_SPONSORSHIP' : 'ADD_SPONSORSHIP', listingId);
      toast({ title: current ? 'Sponsorship removed' : 'Listing sponsored ✓' });
      onRefresh();
    }
  };

  const handleBulkAction = async (action: 'approve' | 'archive' | 'sponsor' | 'delete') => {
    if (!supabase || selected.length === 0) return;
    setIsBulkProcessing(true);
    let error;

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to permanently delete ${selected.length} listings?`)) {
        setIsBulkProcessing(false);
        return;
      }
      const res = await supabase.from('listings').delete().in('id', selected);
      error = res.error;
    } else {
      let updateData = {};
      if (action === 'approve') updateData = { status: 'available' };
      if (action === 'archive') updateData = { status: 'taken' };
      if (action === 'sponsor') updateData = { is_sponsored: true };
      const res = await supabase.from('listings').update(updateData).in('id', selected);
      error = res.error;
    }

    if (!error) {
      toast({ title: `Bulk action successful`, description: `Processed ${selected.length} listings.` });
      setSelected([]);
      onRefresh();
    } else {
      toast({ title: `Bulk action failed`, description: error.message, variant: 'destructive' });
    }
    setIsBulkProcessing(false);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Listings</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Full listings management — status control, sponsorship, and moderation.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
            {(['all', 'house', 'item'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={cn("px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                  typeFilter === t ? "bg-white shadow text-[#0F3D91]" : "text-slate-400 hover:text-slate-600")}>
                {t === 'all' ? 'All Types' : t === 'house' ? '🏠 Houses' : '📦 Items'}
              </button>
            ))}
          </div>
          <Button onClick={() => onNavigate?.('add-listing')} className="rounded-2xl h-14 px-6 bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-900/10">
            <Building2 className="w-4 h-4" /> Add Listing
          </Button>
          <Button onClick={onRefresh} variant="outline" className="rounded-2xl h-14 px-6 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
            <RefreshCcw className="w-4 h-4" /> Sync
          </Button>
        </div>
      </div>

      <Tabs value={subTab} onValueChange={v => { setSubTab(v); setSelected([]); }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
          <div className="flex gap-4">
            <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50">
              {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-5 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl">
                <tab.icon className="w-3.5 h-3.5 mr-2" />{tab.label}
                {(tabCounts as any)[tab.id] > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-slate-200 text-slate-600">{(tabCounts as any)[tab.id]}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          </div>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2 transition-all">
          
          {selected.length > 0 && (
            <div className="bg-[#0F3D91] p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white animate-in fade-in slide-in-from-top-2 gap-4">
              <div className="flex items-center gap-4">
                <span className="font-black text-sm tracking-tight">{selected.length} Selected</span>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <button onClick={() => setSelected([])} className="text-xs font-bold text-blue-200 hover:text-white transition-colors uppercase tracking-widest">Deselect All</button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" onClick={() => handleBulkAction('approve')} disabled={isBulkProcessing} className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest h-9">
                  {isBulkProcessing ? <RefreshCcw className="w-3.5 h-3.5 mr-2 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-2" />} Approve
                </Button>
                <Button size="sm" onClick={() => handleBulkAction('archive')} disabled={isBulkProcessing} className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest h-9">
                  <Archive className="w-3.5 h-3.5 mr-2" /> Archive
                </Button>
                <Button size="sm" onClick={() => handleBulkAction('sponsor')} disabled={isBulkProcessing} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest h-9">
                  <Zap className="w-3.5 h-3.5 mr-2 text-amber-400" /> Sponsor
                </Button>
              </div>
            </div>
          )}

          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><Building2 className="w-10 h-10 text-slate-200" /></div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase">No listings in this state</h4>
              <p className="text-xs text-slate-400 mt-2">Schema-validated — no records match this filter combination.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 w-10">
                      <button onClick={() => setSelected(selected.length === filteredData.length ? [] : filteredData.map(h => h.id))}
                        className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center", selected.length === filteredData.length ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200")}>
                        {selected.length === filteredData.length && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('title')}>
                      Listing {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('listing_type')}>
                      Type {sortField === 'listing_type' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('status')}>
                      Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('price')}>
                      Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('views')}>
                      Views {sortField === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => handleSort('createdAt')}>
                      Created {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(h => {
                    const isProcessing = processing === h.id;
                    const status = STATUS_MAP[h.status] || { label: h.status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
                    const linkedReports = reports.filter(r => r.target_id === h.id);
                    const linkedLogs = logs.filter(l => l.target_id === h.id);
                    return (
                      <Fragment key={h.id}>
                        <tr key={h.id} onClick={() => openViewingModal(h)} className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all duration-200 cursor-pointer">
                          <td className="p-6" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setSelected(selected.includes(h.id) ? selected.filter(id => id !== h.id) : [...selected, h.id])}
                              className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center", selected.includes(h.id) ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200")}>
                              {selected.includes(h.id) && <Check className="w-4 h-4 text-white" />}
                            </button>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-md">
                                {h.images?.[0] ? <img src={h.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-5 h-5 text-slate-300" /></div>}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-900 text-sm truncate max-w-[180px] group-hover:text-[#0F3D91] transition-colors">{h.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{h.location}</p>
                                {h.isSponsored && <Badge className="bg-amber-50 text-amber-700 border-none text-[8px] font-black uppercase px-2 py-0 mt-1">⚡ Sponsored</Badge>}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <Badge className={cn("rounded-xl font-black text-[9px] uppercase tracking-widest border-none px-3 py-1",
                              h.houseType ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700")}>
                              {h.houseType ? `🏠 ${h.houseType}` : '📦 Item'}
                            </Badge>
                          </td>
                          <td className="p-6">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border", status.color)}>
                              {status.label}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-black text-slate-900">KES {h.price?.toLocaleString()}</p>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-black text-slate-600">{h.views ?? 0}</p>
                          </td>
                          <td className="p-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase">{formatDate(h.createdAt)}</p>
                          </td>
                          <td className="p-6" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1 justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 p-0 hover:bg-slate-100 text-slate-400">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-slate-100 shadow-xl">
                                    <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); openEditingModal(h); }}>
                                      <Edit className="w-4 h-4 mr-2 text-slate-400" /> Edit Listing
                                    </DropdownMenuItem>
                                    {h.status === 'pending' && (
                                      <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer text-green-600 focus:text-green-700" onClick={() => handleApprove(h.id)}>
                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer" onClick={() => handleSponsorToggle(h.id, h.isSponsored)}>
                                      <Zap className={cn("w-4 h-4 mr-2", h.isSponsored ? "text-amber-500" : "text-slate-400")} /> 
                                      {h.isSponsored ? 'Remove Sponsor' : 'Sponsor Listing'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                    {h.status !== 'taken' && (
                                      <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer" onClick={() => handleArchive(h.id, h.status)}>
                                        <Archive className="w-4 h-4 mr-2 text-slate-400" /> Archive
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer text-orange-600 focus:text-orange-700 focus:bg-orange-50" onClick={() => handleFlag(h.id)}>
                                      <Flag className="w-4 h-4 mr-2" /> Flag Listing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl text-xs font-bold py-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(h.id)}>
                                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">
              {filteredData.length} of {houses.length} listings — schema-filtered
            </p>
          </div>
        </div>
      </Tabs>

      <AnimatePresence>
        {viewingListing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col mt-10">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10 shrink-0">
                <h3 className="font-heading font-black text-xl text-[#0F3D91] uppercase">
                  {isEditingModal ? 'Edit Listing' : 'Listing Details'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => { setViewingListing(null); setIsEditingModal(false); }} className="rounded-xl hover:bg-slate-100 text-slate-400">
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {isEditingModal ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</label>
                        <input className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
                        <input className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.location || ''} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price (KES)</label>
                        <input type="number" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</label>
                        <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.status === 'active' ? 'active' : editForm.status === 'archived' ? 'archived' : editForm.status || ''} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                          <option value="pending">Pending</option>
                          <option value="active">Active (Available)</option>
                          <option value="archived">Archived (Taken)</option>
                          <option value="flagged">Flagged</option>
                        </select>
                      </div>
                      {viewingListing.houseType ? (
                        <>
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">House Type</label>
                            <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.houseType || ''} onChange={e => setEditForm({...editForm, houseType: e.target.value})}>
                              <option value="bedsitter">Bedsitter</option>
                              <option value="single">Single Room</option>
                              <option value="1br">1 Bedroom</option>
                              <option value="2br">2 Bedroom</option>
                              <option value="3br">3 Bedroom</option>
                            </select>
                          </div>
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deposit (KES)</label>
                            <input type="number" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.deposit || ''} onChange={e => setEditForm({...editForm, deposit: e.target.value})} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amenities (comma separated)</label>
                            <input className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={Array.isArray(editForm.amenities) ? editForm.amenities.join(', ') : editForm.amenities || ''} onChange={e => setEditForm({...editForm, amenities: e.target.value})} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                            <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                              <option value="electronics">Electronics</option>
                              <option value="furniture">Furniture</option>
                              <option value="books">Books</option>
                              <option value="clothing">Clothing</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Condition</label>
                            <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" value={editForm.condition || ''} onChange={e => setEditForm({...editForm, condition: e.target.value})}>
                              <option value="new">New</option>
                              <option value="like-new">Like New</option>
                              <option value="good">Good</option>
                              <option value="fair">Fair</option>
                            </select>
                          </div>
                        </>
                      )}
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                        <textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image URLs (comma separated)</label>
                        <textarea className="w-full h-24 p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" value={Array.isArray(editForm.images) ? editForm.images.join(', ') : editForm.images || ''} onChange={e => setEditForm({...editForm, images: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-slate-100 gap-4 mt-6">
                      <Button variant="outline" onClick={() => setIsEditingModal(false)} className="rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button onClick={handleSaveEdit} disabled={processing === viewingListing.id} className="rounded-xl h-12 px-8 bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest">
                        {processing === viewingListing.id ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />} Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 pb-10">
                    {/* Image Carousel (Smart) */}
                    <div className="relative group aspect-[16/9] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
                        {viewingListing.images?.length > 0 ? viewingListing.images.map((img: string, i: number) => (
                          <div key={i} className="min-w-full h-full">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          </div>
                        )) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">No images available</div>
                        )}
                      </div>

                      {viewingListing.images?.length > 1 && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => setImgIdx(i => (i - 1 + viewingListing.images.length) % viewingListing.images.length)}
                              className="p-3 rounded-full bg-white/90 shadow-xl text-[#0F3D91] hover:bg-white hover:scale-110 transition-all">
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={() => setImgIdx(i => (i + 1) % viewingListing.images.length)}
                              className="p-3 rounded-full bg-white/90 shadow-xl text-[#0F3D91] hover:bg-white hover:scale-110 transition-all">
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </div>
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10">
                            {viewingListing.images.map((_: any, i: number) => (
                              <button key={i} onClick={() => setImgIdx(i)}
                                className={cn("h-2 rounded-full transition-all duration-300", i === imgIdx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60")} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-8">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{viewingListing.title}</h2>
                            {viewingListing.verified && <Badge className="bg-blue-50 text-blue-700 border-none px-4 py-1.5 text-xs font-black uppercase tracking-widest shrink-0">✓ Verified</Badge>}
                          </div>
                          <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl"><MapPin className="w-4 h-4 text-[#0F3D91]" /> {viewingListing.location}</span>
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl"><Building2 className="w-4 h-4 text-[#0F3D91]" /> {viewingListing.houseType ? `🏠 ${viewingListing.houseType}` : `📦 ${viewingListing.category}`}</span>
                          </div>
                        </div>

                        <div className="flex gap-8 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price</p>
                            <p className="text-3xl font-black text-[#0F3D91]">KES {viewingListing.price?.toLocaleString()}</p>
                          </div>
                          {viewingListing.deposit > 0 && (
                            <>
                              <div className="w-px h-12 bg-slate-200" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deposit</p>
                                <p className="text-2xl font-black text-slate-600">KES {viewingListing.deposit?.toLocaleString()}</p>
                              </div>
                            </>
                          )}
                        </div>

                        {viewingListing.amenities?.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Amenities & Features</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {viewingListing.amenities.map((a: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Shield className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">{a}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Detailed Description</h4>
                          <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
                            {viewingListing.description || "No detailed description provided."}
                          </p>
                        </div>

                        {/* Ratings Placeholder */}
                        <div className="pt-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Public Ratings & Reviews</h4>
                          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
                            <Star className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                            <p className="text-sm font-bold text-slate-400">Public ratings will appear here after deployment.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white border-2 border-slate-100 shadow-2xl p-8 rounded-[2.5rem] sticky top-24">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F3D91] to-[#0A2560] flex items-center justify-center text-white font-black text-xl shadow-lg">
                              {(viewingListing.landlordName || viewingListing.sellerName || "U").charAt(0)}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Creator Profile</p>
                              <p className="text-lg font-black text-slate-900">{viewingListing.landlordName || viewingListing.sellerName}</p>
                              <p className="text-xs font-bold text-slate-500">{viewingListing.phone}</p>
                            </div>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-wider">Reputation</span>
                              <span className="text-[#0F3D91] font-black">85/100</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0F3D91] w-[85%] rounded-full shadow-sm" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase text-center tracking-widest">Highly Reliable Partner</p>
                          </div>

                          <div className="space-y-3 pt-6 border-t border-slate-100">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Administrative Actions</p>
                            <Button onClick={() => openEditingModal(viewingListing)} className="w-full rounded-2xl h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">
                              <Edit className="w-4 h-4 mr-2" /> Edit Information
                            </Button>
                            {viewingListing.status === 'pending' && (
                               <Button onClick={() => { handleApprove(viewingListing.id); setViewingListing({...viewingListing, status: 'available'}); }} className="w-full rounded-2xl h-14 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 transition-all">
                                 <CheckCircle className="w-4 h-4 mr-2" /> Approve Listing
                               </Button>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <Button onClick={() => handleFlag(viewingListing.id)} variant="outline" className="rounded-2xl h-12 text-orange-600 border-orange-200 hover:bg-orange-50 font-black text-[10px] uppercase tracking-widest transition-all">
                                <Flag className="w-4 h-4 mr-2" /> Flag
                              </Button>
                              <Button onClick={() => { handleDelete(viewingListing.id); setViewingListing(null); }} variant="outline" className="rounded-2xl h-12 text-red-600 border-red-200 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest transition-all">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>

                          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">System Record ID</p>
                             <p className="text-[9px] text-slate-300 font-mono mt-1 truncate">{viewingListing.id}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Posted on {formatDate(viewingListing.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

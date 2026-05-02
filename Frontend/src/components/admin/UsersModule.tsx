import { useState, useMemo } from 'react';
import { Users, Activity, Star, ShieldCheck, UserX, Shield, Tag, UserPlus, Download, Search, Check, Eye, UserCog, UserMinus, Calendar, RefreshCcw, Save, Edit, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface UsersModuleProps {
  users: any[];
  onRefresh: () => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Never';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const USER_TABS = [
  { id: 'all', label: 'All Users', icon: Users },
  { id: 'active', label: 'Active', icon: Activity },
  { id: 'new', label: 'New', icon: Star },
  { id: 'verified', label: 'Verified', icon: ShieldCheck },
  { id: 'suspended', label: 'Suspended', icon: UserX },
  { id: 'admins', label: 'Admins', icon: Shield },
  { id: 'segments', label: 'Segments', icon: Tag },
];

export function UsersModule({ users, onRefresh }: UsersModuleProps) {
  const { toast } = useToast();
  const [userSubTab, setUserSubTab] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.id?.toLowerCase().includes(userSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (userSubTab === 'active') return u.status !== 'suspended';
      if (userSubTab === 'new') {
        const joinDate = new Date(u.createdAt);
        const diffDays = Math.ceil(Math.abs(Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (userSubTab === 'verified') return u.verified;
      if (userSubTab === 'suspended') return u.status === 'suspended';
      if (userSubTab === 'admins') return u.role === 'admin';
      return true;
    });
  }, [users, userSearch, userSubTab]);

  const handleVerify = async (userId: string) => {
    if (!supabase) return;
    setProcessing(userId);
    const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', userId);
    if (!error) {
      await supabase.from('admin_audit_logs').insert({ action: 'VERIFY_USER', target_id: userId, target_type: 'profile', metadata: {} });
      toast({ title: 'User verified ✓' });
      onRefresh();
    } else {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const handleSuspend = async (userId: string) => {
    if (!supabase) return;
    setProcessing(userId);
    // Log suspension in audit since status is handled via reputation/verification in this schema
    await supabase.from('admin_audit_logs').insert({ action: 'SUSPEND_USER', target_id: userId, target_type: 'profile', metadata: {} });
    toast({ title: 'Suspension logged', description: 'User flagged in audit logs.' });
    onRefresh();
    setProcessing(null);
  };

  const openViewingModal = (user: any) => {
    setViewingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'resident',
      is_verified: user.verified || false
    });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!supabase || !viewingUser) return;
    setProcessing(viewingUser.id);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: editForm.name,
        phone: editForm.phone,
        role: editForm.role,
        is_verified: editForm.is_verified
      })
      .eq('id', viewingUser.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ 
        action: 'UPDATE_PROFILE', 
        target_id: viewingUser.id, 
        target_type: 'profile', 
        metadata: { old: viewingUser, new: editForm } 
      });
      toast({ title: 'Changes saved ✓', description: 'Identity profile synchronized with database.' });
      onRefresh();
      setViewingUser(null);
    }
    setProcessing(null);
  };

  const handleBulkVerify = async () => {
    for (const id of selectedUsers) await handleVerify(id);
    setSelectedUsers([]);
  };

  const handleBulkSuspend = async () => {
    for (const id of selectedUsers) await handleSuspend(id);
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex flex-col">
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">User Management</h2>
          <p className="text-slate-500 font-medium text-sm tracking-tight mt-2 italic opacity-75">Platform actors, audience segments, and behavioral moderation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 h-14 px-8 shadow-sm hover:shadow-md transition-all">
            <Download className="w-4 h-4" /> Export Assets
          </Button>
          <Button className="rounded-2xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-black text-[10px] uppercase tracking-widest gap-2 h-14 px-8 shadow-xl shadow-blue-900/10 transition-all">
            <UserPlus className="w-4 h-4" /> Provision Admin
          </Button>
        </div>
      </div>

      <Tabs value={userSubTab} onValueChange={v => { setUserSubTab(v); setSelectedUsers([]); }} className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
          <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50">
            {USER_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl data-[state=active]:shadow-slate-200/50">
                <tab.icon className="w-3.5 h-3.5 mr-2" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0F3D91] transition-colors" />
            <input type="text" placeholder="Locate identity..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedUsers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mx-2 mb-8 p-4 bg-[#0F3D91] rounded-[2rem] shadow-2xl shadow-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-6 ml-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-white text-lg">{selectedUsers.length}</div>
                <div className="flex flex-col">
                  <p className="text-white font-black text-xs uppercase tracking-widest">Identities Selected</p>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Perform bulk moderate action</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-2">
                <Button variant="ghost" onClick={handleBulkVerify} className="h-12 rounded-xl text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest px-6">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Verify
                </Button>
                <Button variant="ghost" onClick={handleBulkSuspend} className="h-12 rounded-xl text-red-300 hover:bg-red-500/20 font-black text-[10px] uppercase tracking-widest px-6">
                  <UserX className="w-4 h-4 mr-2" /> Suspend
                </Button>
                <Button variant="ghost" onClick={() => setSelectedUsers([])} className="h-12 rounded-xl text-white/40 font-black text-[10px] uppercase tracking-widest px-6">Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="p-8 w-10">
                    <button onClick={() => { if (selectedUsers.length === filteredUsers.length) setSelectedUsers([]); else setSelectedUsers(filteredUsers.map(u => u.id)); }}
                      className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", selectedUsers.length === filteredUsers.length ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200 bg-white")}>
                      {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Identity Structure</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Access Level</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Trust Matrix</th>
                  <th className="p-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Activity Timeline</th>
                  <th className="p-8"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all duration-300">
                    <td className="p-8">
                      <button onClick={() => { if (selectedUsers.includes(u.id)) setSelectedUsers(selectedUsers.filter(id => id !== u.id)); else setSelectedUsers([...selectedUsers, u.id]); }}
                        className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", selectedUsers.includes(u.id) ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200 bg-white group-hover:border-slate-300")}>
                        {selectedUsers.includes(u.id) && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                            {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-sm uppercase">{u.name?.charAt(0)}</div>}
                          </div>
                          {u.status !== 'suspended' && <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-base tracking-tight leading-none mb-1 group-hover:text-[#0F3D91] transition-colors">{u.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[120px]">{u.email}</p>
                            <span className="text-slate-300">•</span>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">ID: {u.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <Badge className={cn("rounded-xl font-black text-[10px] uppercase tracking-widest border-none px-4 py-1.5 shadow-sm",
                        u.role === 'admin' ? "bg-purple-600 text-white shadow-purple-200" :
                        u.role === 'landlord' ? "bg-blue-600 text-white shadow-blue-200" :
                        "bg-slate-200 text-slate-700 shadow-slate-100")}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-8">
                      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit font-black text-[9px] uppercase tracking-widest shadow-sm",
                        u.status === 'suspended' ? "bg-red-50 border-red-100 text-red-600 shadow-red-50" : "bg-green-50 border-green-100 text-green-600 shadow-green-50")}>
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", u.status === 'suspended' ? "bg-red-500" : "bg-green-500")} />
                        {u.status || 'active'}
                      </div>
                    </td>
                    <td className="p-8">
                      {u.verified ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold ml-7">Tier 1 Credential</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Shield className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                        </div>
                      )}
                    </td>
                    <td className="p-8">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <p className="text-[10px] text-slate-900 font-black uppercase tracking-tight">Joined {formatDate(u.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCcw className="w-3 h-3 text-slate-300" />
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Pulse: {formatTime(u.lastLogin)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button onClick={() => openViewingModal(u)} variant="ghost" size="icon" className="w-11 h-11 rounded-2xl hover:bg-white hover:shadow-xl hover:text-blue-600 transition-all" title="View Profile">
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => { openViewingModal(u); setIsEditing(true); }} variant="ghost" size="icon" className="w-11 h-11 rounded-2xl hover:bg-white hover:shadow-xl hover:text-orange-500 transition-all" title="Manage Access">
                          <UserCog className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => handleSuspend(u.id)} variant="ghost" size="icon" className="w-11 h-11 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all" title="Terminate Session">
                          <UserMinus className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
              <p className="text-[11px] font-black text-[#0F3D91] uppercase tracking-[0.2em]">Synchronized Platform Actors</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Showing {filteredUsers.length} of {users.length} identity shards</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-white transition-all disabled:opacity-20" disabled>Previous Phase</Button>
              <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-white transition-all disabled:opacity-20" disabled>Next Phase</Button>
            </div>
          </div>
        </div>
      </Tabs>

      <AnimatePresence>
        {viewingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingUser(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Profile Header/Sidebar */}
              <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center font-black text-slate-300 text-4xl">
                    {viewingUser.avatar ? <img src={viewingUser.avatar} alt="" className="w-full h-full object-cover" /> : viewingUser.name?.charAt(0)}
                  </div>
                  {viewingUser.verified && <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#0F3D91] rounded-2xl border-4 border-slate-50 flex items-center justify-center shadow-lg"><ShieldCheck className="w-5 h-5 text-white" /></div>}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 text-center leading-tight mb-2">{viewingUser.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{viewingUser.email}</p>
                
                <div className="w-full space-y-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Reputation</span>
                    <span className="text-sm font-black text-[#0F3D91]">{viewingUser.reputationScore ?? 0}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Joined</span>
                    <span className="text-sm font-black text-slate-700">{formatDate(viewingUser.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 w-full">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="w-full h-14 rounded-2xl bg-[#0F3D91] hover:bg-[#0A2560] text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-blue-900/20">
                      <Edit className="w-4 h-4" /> Edit Profile
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest">Cancel</Button>
                      <Button onClick={handleSaveEdit} disabled={processing === viewingUser.id} className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-green-900/20">
                        {processing === viewingUser.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="font-heading text-3xl font-black text-slate-900 tracking-tight uppercase">Identity Management</h4>
                  <button onClick={() => setViewingUser(null)} className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"><XCircle className="w-6 h-6" /></button>
                </div>

                {isEditing ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity Name</label>
                        <input className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all"
                          value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone</label>
                        <input className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all"
                          value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Role</label>
                        <select className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 font-bold text-sm focus:bg-white focus:border-slate-200 transition-all outline-none"
                          value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                          <option value="resident">Resident (Tenant)</option>
                          <option value="landlord">Landlord</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verification Status</label>
                        <button onClick={() => setEditForm({ ...editForm, is_verified: !editForm.is_verified })}
                          className={cn("w-full h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            editForm.is_verified ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-50 border-slate-100 text-slate-400")}>
                          {editForm.is_verified ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          {editForm.is_verified ? 'Identity Verified' : 'Unverified'}
                        </button>
                      </div>
                    </div>

                    <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                      <div className="flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Administrative Warning</p>
                          <p className="text-xs text-amber-700 font-medium leading-relaxed italic">Updating identity roles or verification status may grant or revoke sensitive permissions. This action is recorded in the permanent audit logs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: 'Platform ID', value: viewingUser.id?.slice(0, 16) + '...' },
                        { label: 'Role', value: viewingUser.role },
                        { label: 'Last Pulse', value: formatTime(viewingUser.lastLogin) },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                          <p className="text-sm font-black text-slate-900 uppercase truncate">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Security & Access</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckCircle className="w-5 h-5" /></div>
                            <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Active Session</p>
                              <p className="text-[10px] text-slate-400 font-medium italic">Identity is currently synchronized with auth server.</p>
                            </div>
                          </div>
                          <Badge className="bg-green-50 text-green-700 border-none rounded-lg text-[10px] font-black uppercase">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Shield className="w-5 h-5" /></div>
                            <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Access Control</p>
                              <p className="text-[10px] text-slate-400 font-medium italic">Role-based access {viewingUser.role === 'admin' ? 'unrestricted' : 'scoped'}.</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-50 text-blue-700 border-none rounded-lg text-[10px] font-black uppercase">Standard</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Records</p>
                        <code className="text-[9px] font-bold text-slate-400">{viewingUser.id}</code>
                      </div>
                      <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                        This identity record was initialized on {formatDate(viewingUser.createdAt)}. All modifications to this record are immutable and tracked for compliance.
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

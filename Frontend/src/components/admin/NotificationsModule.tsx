import { useState, useMemo } from 'react';
import { Bell, CheckCircle, Trash2, VolumeX, RefreshCcw, Search, AlertTriangle, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface NotificationsModuleProps {
  users: any[];
  houses: any[];
  onRefresh: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function NotificationsModule({ users, houses, onRefresh }: NotificationsModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('unread');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadNotifications = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (!error && data) setNotifications(data);
    setLoading(false);
  };

  useMemo(() => { loadNotifications(); }, []);

  const validNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Must have valid user_id
      const validUser = users.some(u => u.id === n.user_id);
      if (!validUser) return false;
      // Optional relational checks
      if (n.related_house_id && !houses.some(h => h.id === n.related_house_id)) return false;
      if (n.related_user_id && !users.some(u => u.id === n.related_user_id)) return false;
      return true;
    });
  }, [notifications, users, houses]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return validNotifications.filter(n => {
      const matchSearch = !q || n.title?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q);
      if (!matchSearch) return false;
      switch (subTab) {
        case 'unread': return !n.read;
        case 'read': return n.read;
        case 'system': return n.type === 'system';
        case 'user': return n.type === 'user' || n.type !== 'system';
        default: return true;
      }
    });
  }, [validNotifications, subTab, search]);

  const tabCounts = useMemo(() => ({
    all: validNotifications.length,
    unread: validNotifications.filter(n => !n.read).length,
    read: validNotifications.filter(n => n.read).length,
    system: validNotifications.filter(n => n.type === 'system').length,
    user: validNotifications.filter(n => n.type !== 'system').length,
  }), [validNotifications]);

  const markRead = async (ids: string[]) => {
    if (!supabase || ids.length === 0) return;
    const { error } = await supabase.from('notifications').update({ read: true }).in('id', ids);
    if (!error) { toast({ title: `${ids.length} marked as read` }); loadNotifications(); }
    setSelected([]);
  };

  const handleDelete = async (ids: string[]) => {
    if (!supabase || ids.length === 0) return;
    const { error } = await supabase.from('notifications').delete().in('id', ids);
    if (!error) {
      await supabase.from('admin_audit_logs').insert({ action: 'DELETE_NOTIFICATIONS', target_type: 'notification', metadata: { count: ids.length } });
      toast({ title: `${ids.length} notification(s) deleted` });
      loadNotifications();
    }
    setSelected([]);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Notifications</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Notifications ledger — validated relational links, type-safe tab segmentation.</p>
        </div>
        <Button onClick={() => { loadNotifications(); onRefresh(); }} variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
          <RefreshCcw className="w-4 h-4" /> Sync
        </Button>
      </div>

      <Tabs value={subTab} onValueChange={v => { setSubTab(v); setSelected([]); }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
          <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50">
            {[{ id: 'unread', label: 'Unread' }, { id: 'read', label: 'Read' }, { id: 'system', label: 'System' }, { id: 'user', label: 'User' }, { id: 'all', label: 'All' }].map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-5 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl">
                {tab.label}
                {(tabCounts as any)[tab.id] > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-slate-200 text-slate-600">{(tabCounts as any)[tab.id]}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => markRead(selected)} className="rounded-xl bg-[#0F3D91] text-white font-black text-[9px] uppercase h-10 px-4 gap-2">
                  <CheckCircle className="w-3 h-3" /> Mark Read ({selected.length})
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(selected)} className="rounded-xl text-red-500 hover:bg-red-50 font-black text-[9px] uppercase h-10 px-4 gap-2">
                  <Trash2 className="w-3 h-3" /> Delete ({selected.length})
                </Button>
              </div>
            )}
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          {loading ? (
            <div className="flex items-center justify-center py-32"><RefreshCcw className="w-8 h-8 text-slate-300 animate-spin" /></div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><Bell className="w-10 h-10 text-slate-200" /></div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase">No notifications in this state</h4>
              <p className="text-xs text-slate-400 mt-2">Relational links validated — no cross-type contamination.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredData.map(n => {
                const owner = users.find(u => u.id === n.user_id);
                const isSelected = selected.includes(n.id);
                return (
                  <div key={n.id} className={cn("group flex items-start gap-6 p-6 hover:bg-slate-50/30 transition-all", !n.read && "bg-blue-50/20")}>
                    <button onClick={() => setSelected(isSelected ? selected.filter(id => id !== n.id) : [...selected, n.id])}
                      className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-1", isSelected ? "bg-[#0F3D91] border-[#0F3D91]" : "border-slate-200 group-hover:border-slate-300")}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                      n.type === 'system' ? "bg-purple-100" : "bg-blue-100")}>
                      {n.type === 'system' ? <Bell className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={cn("font-black text-slate-900 text-sm", !n.read && "text-[#0F3D91]")}>{n.title}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{n.description}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                            → {owner?.name || '—'} • {n.type || 'notification'} • {formatDate(n.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {!n.read && (
                            <Button size="sm" variant="ghost" onClick={() => markRead([n.id])} className="rounded-xl h-9 w-9 p-0 hover:bg-blue-50 text-blue-500">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete([n.id])} className="rounded-xl h-9 w-9 p-0 text-red-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#0F3D91] mt-3 shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">
              {filteredData.length} notifications — {tabCounts.unread} unread
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

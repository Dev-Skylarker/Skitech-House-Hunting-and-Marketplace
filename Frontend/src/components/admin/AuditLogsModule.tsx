import { useState, useMemo } from 'react';
import { Database, Search, RefreshCcw, Filter, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface AuditLogsModuleProps {
  logs: any[];
  users: any[];
  onRefresh: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const TYPE_STYLE: Record<string, string> = {
  profile: 'bg-blue-50 text-blue-700',
  listing: 'bg-green-50 text-green-700',
  report: 'bg-red-50 text-red-700',
  request: 'bg-amber-50 text-amber-700',
  notification: 'bg-purple-50 text-purple-700',
  rating: 'bg-pink-50 text-pink-700',
  setting: 'bg-slate-100 text-slate-700',
};

const PAGE_SIZE = 25;

export function AuditLogsModule({ logs, users, onRefresh }: AuditLogsModuleProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);

  // Immutable dataset — no mutations allowed
  const validLogs = useMemo(() => {
    return logs.filter(l => {
      // Chronological integrity: no future-dated logs
      if (new Date(l.created_at).getTime() > Date.now() + 60_000) return false;
      // Must have action
      if (!l.action) return false;
      return true;
    });
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase();
    return validLogs.filter(l => {
      const matchSearch = !q || l.action?.toLowerCase().includes(q) || l.target_type?.toLowerCase().includes(q) || l.target_id?.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || l.target_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [validLogs, search, typeFilter]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  const targetTypes = useMemo(() => {
    const types = new Set(validLogs.map(l => l.target_type).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [validLogs]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    validLogs.forEach(l => { counts[l.target_type] = (counts[l.target_type] || 0) + 1; });
    return counts;
  }, [validLogs]);

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Audit Logs</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">Immutable system ledger — read-only, chronologically enforced, cross-linked to profiles and listings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-50 text-red-600 border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2">
            🔒 Read-Only Ledger
          </Badge>
          <Button onClick={onRefresh} variant="outline" className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
            <RefreshCcw className="w-4 h-4" /> Sync
          </Button>
        </div>
      </div>

      {/* Type summary chips */}
      <div className="flex flex-wrap gap-3 px-2">
        {targetTypes.map(t => (
          <button key={t} onClick={() => { setTypeFilter(t); setPage(0); }}
            className={cn("px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
              typeFilter === t ? "bg-[#0F3D91] text-white border-[#0F3D91]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
            {t === 'all' ? `All (${validLogs.length})` : `${t} (${typeCounts[t] || 0})`}
          </button>
        ))}
      </div>

      <div className="px-2">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search action, target type, or ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
        {paginatedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><Database className="w-10 h-10 text-slate-200" /></div>
            <h4 className="font-heading font-black text-[#0F3D91] uppercase">No log entries found</h4>
            <p className="text-xs text-slate-400 mt-2">Integrity checked — no future-dated or invalid entries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Type</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Admin</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log, idx) => {
                  const admin = users.find(u => u.id === log.admin_id);
                  const targetUser = users.find(u => u.id === log.target_id);
                  return (
                    <tr key={log.id || idx} className="border-b border-slate-50 hover:bg-slate-50/30 transition-all group">
                      <td className="p-6">
                        <p className="text-[10px] font-black text-slate-600 uppercase whitespace-nowrap">{formatDate(log.created_at)}</p>
                      </td>
                      <td className="p-6">
                        <code className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">{log.action}</code>
                      </td>
                      <td className="p-6">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl", TYPE_STYLE[log.target_type] || "bg-slate-100 text-slate-600")}>
                          {log.target_type || '—'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div>
                          <code className="text-[10px] font-black text-slate-500">{log.target_id?.slice(0, 12)}...</code>
                          {targetUser && <p className="text-[9px] text-slate-400 font-bold mt-0.5">→ {targetUser.name}</p>}
                        </div>
                      </td>
                      <td className="p-6">
                        {admin ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-[#0F3D91] flex items-center justify-center text-white font-black text-[10px]">{admin.name?.charAt(0)}</div>
                            <p className="text-xs font-black text-slate-700">{admin.name}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-300 font-black uppercase">System</p>
                        )}
                      </td>
                      <td className="p-6">
                        {log.metadata && Object.keys(log.metadata).length > 0 ? (
                          <code className="text-[9px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg block max-w-[150px] truncate">
                            {JSON.stringify(log.metadata)}
                          </code>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-black">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">
              Page {page + 1} of {Math.max(1, totalPages)} — {filteredLogs.length} entries
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Immutable ledger — no mutations permitted</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-200 disabled:opacity-30">
              Previous
            </Button>
            <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-200 disabled:opacity-30">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

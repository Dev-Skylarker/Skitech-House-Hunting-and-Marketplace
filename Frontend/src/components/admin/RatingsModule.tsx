import { useState, useMemo } from 'react';
import { Star, Trash2, RefreshCcw, Flag, Search, ChevronRight, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface RatingsModuleProps {
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

const StarRating = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={cn("w-3.5 h-3.5", s <= value ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
    ))}
    <span className="text-[10px] font-black text-slate-500 ml-1">{value}/5</span>
  </div>
);

export function RatingsModule({ users, houses, logs, onRefresh }: RatingsModuleProps) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState('all');
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadRatings = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('house_ratings').select('*').order('created_at', { ascending: false });
    if (!error && data) setRatings(data);
    setLoading(false);
  };

  useMemo(() => { loadRatings(); }, []);

  // Validate: only show ratings with valid house_id and user_id
  const validRatings = useMemo(() => {
    return ratings.filter(r => {
      const validHouse = houses.some(h => h.id === r.house_id);
      const validUser = users.some(u => u.id === r.user_id);
      return validHouse && validUser;
    });
  }, [ratings, users, houses]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return validRatings.filter(r => {
      const house = houses.find(h => h.id === r.house_id);
      const matchSearch = !q || house?.title?.toLowerCase().includes(q);
      if (!matchSearch) return false;
      switch (subTab) {
        case 'high': return r.rating >= 4;
        case 'low': return r.rating <= 2;
        case 'recent': {
          const diff = Date.now() - new Date(r.created_at).getTime();
          return diff < 7 * 24 * 60 * 60 * 1000;
        }
        default: return true;
      }
    });
  }, [validRatings, subTab, search, houses]);

  const stats = useMemo(() => {
    if (validRatings.length === 0) return { avg: 0, landlordAvg: 0 };
    const avg = validRatings.reduce((s, r) => s + (r.rating || 0), 0) / validRatings.length;
    const landlordRated = validRatings.filter(r => r.landlord_rating);
    const landlordAvg = landlordRated.length ? landlordRated.reduce((s, r) => s + r.landlord_rating, 0) / landlordRated.length : 0;
    return { avg: avg.toFixed(1), landlordAvg: landlordAvg.toFixed(1) };
  }, [validRatings]);

  const handleDelete = async (ratingId: string) => {
    if (!supabase) return;
    setProcessing(ratingId);
    const { error } = await supabase.from('house_ratings').delete().eq('id', ratingId);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('admin_audit_logs').insert({ action: 'DELETE_RATING', target_id: ratingId, target_type: 'rating', metadata: {} });
      toast({ title: 'Rating deleted' });
      loadRatings();
      onRefresh();
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="font-heading text-4xl font-black tracking-tight text-[#0F3D91] uppercase leading-none">Ratings</h2>
          <p className="text-slate-500 font-medium text-sm mt-2 italic opacity-75">house_ratings — relational validation enforced, aggregated only from verified records.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm text-center">
            <p className="text-2xl font-black text-[#0F3D91]">{stats.avg}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Avg Rating</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm text-center">
            <p className="text-2xl font-black text-amber-500">{stats.landlordAvg}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Landlord Avg</p>
          </div>
          <Button onClick={() => { loadRatings(); onRefresh(); }} variant="outline" className="rounded-2xl h-full px-6 font-black text-[10px] uppercase tracking-widest gap-2 border-slate-200">
            <RefreshCcw className="w-4 h-4" /> Sync
          </Button>
        </div>
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
          <TabsList className="bg-slate-100/50 p-1.5 h-14 rounded-3xl border border-slate-200/50">
            {[{ id: 'all', label: 'All' }, { id: 'high', label: 'High (4-5★)' }, { id: 'low', label: 'Low (1-2★)' }, { id: 'recent', label: 'Recent' }].map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}
                className="rounded-2xl px-5 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-xl">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by listing..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/30 overflow-hidden mx-2">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <RefreshCcw className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><Star className="w-10 h-10 text-slate-200" /></div>
              <h4 className="font-heading font-black text-[#0F3D91] uppercase">No ratings in this range</h4>
              <p className="text-xs text-slate-400 mt-2">Validated against house_id and user_id — no orphaned records shown.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Listing</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewer</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Landlord Rating</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Review</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(r => {
                    const house = houses.find(h => h.id === r.house_id);
                    const reviewer = users.find(u => u.id === r.user_id);
                    return (
                      <tr key={r.id} className="group border-b border-slate-50 hover:bg-slate-50/30 transition-all duration-200">
                        <td className="p-6">
                          <p className="font-black text-slate-900 text-sm truncate max-w-[160px] group-hover:text-[#0F3D91]">{house?.title || '—'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{house?.location}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-black text-slate-700">{reviewer?.name || '—'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{reviewer?.email}</p>
                        </td>
                        <td className="p-6"><StarRating value={r.rating || 0} /></td>
                        <td className="p-6"><StarRating value={r.landlord_rating || 0} /></td>
                        <td className="p-6">
                          <p className="text-xs text-slate-600 font-medium truncate max-w-[180px]">{r.review || 'No review text'}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-[10px] font-black text-slate-500 uppercase">{formatDate(r.created_at)}</p>
                        </td>
                        <td className="p-6">
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)} disabled={processing === r.id}
                            className="rounded-xl h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                            {processing === r.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">
              {filteredData.length} valid ratings — orphan-free, aggregation-ready
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

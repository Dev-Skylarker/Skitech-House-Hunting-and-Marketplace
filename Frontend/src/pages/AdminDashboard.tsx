import { useState, useEffect, useMemo } from 'react';
import {
  Building2, ShoppingBag, Users, Clock, Eye, AlertCircle, Search,
  MoreVertical, LayoutDashboard, Flag, Settings, ArrowLeft, LogOut,
  CheckCircle2, XCircle, Undo2, Bell, MessageSquare, Edit3,
  ShieldAlert, Zap, Send, ShieldCheck, UserPlus, Image as ImageIcon,
  FileText, Download, Trash2, Power, Pause, Play, RefreshCcw,
  Filter, ChevronRight, Check, X, Shield, Star, Briefcase,
  TrendingUp, Activity, Lock, Unlock, Mail, Phone, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { api, mockHouses, mockItems, mockUsers } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

// Mock data for new features
const systemLogs = [
  { id: 'log-1', admin: 'Admin Chief', action: 'Approved Landlord', target: '#USR-102', time: '2026-03-07T08:30:00Z', type: 'user', canUndo: true },
  { id: 'log-2', admin: 'Admin Chief', action: 'Suspended Listing', target: '#HS-9021', time: '2026-03-07T09:15:00Z', type: 'house', canUndo: true },
  { id: 'log-3', admin: 'Admin Chief', action: 'Cleared Logs', target: 'System', time: '2026-03-07T10:00:00Z', type: 'system', canUndo: false },
];

const reports = [
  { id: 'rep-1', user: 'Jane Doe', reason: 'Misleading price', target: '#HS-9005', status: 'pending', date: '2026-03-06' },
  { id: 'rep-2', user: 'John Smith', reason: 'Unresponsive seller', target: '#ITEM-042', status: 'resolved', date: '2026-03-05' },
];

const marketplaceItems = mockItems.map((item, i) => ({
  ...item,
  uuid: `#ITEM-${i + 100}`,
  internalStatus: item.status === 'sold' ? 'buffer' : 'active',
  soldAt: item.status === 'sold' ? '2026-03-05T12:00:00Z' : null
}));

const houseRequests = [
  { id: 'req-1', user: 'Alice Cooper', type: 'Single Room', budget: 'KSh 8,000', location: 'Near Gate B', matchedId: null },
  { id: 'req-2', user: 'Bob Marley', type: 'Bedsitter', budget: 'KSh 12,000', location: 'Town Center', matchedId: 'house-1' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Tab Management via URL
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMainTab = searchParams.get('tab') || 'home';
  const setActiveMainTab = (tab: string) => setSearchParams({ tab });

  const [activeGatekeeperTab, setActiveGatekeeperTab] = useState('landlords');

  // Core Data States
  const [housesList, setHousesList] = useState<any[]>(
    mockHouses.map((h, i) => ({ ...h, uuid: `#HS-${9000 + i}`, internalStatus: h.verified ? 'active' : 'pending' }))
  );
  const [usersList, setUsersList] = useState<any[]>(
    mockUsers.map((u, i) => ({ ...u, uuid: `#USR-2026-${String(i + 1).padStart(3, '0')}`, isSuperhost: false }))
  );
  const [itemsList, setItemsList] = useState<any[]>(marketplaceItems);
  const [logs, setLogs] = useState<any[]>(systemLogs);
  const [requests, setRequests] = useState<any[]>(houseRequests);

  // Search
  const [omniSearch, setOmniSearch] = useState('');

  // Modals / Details
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [entityType, setEntityType] = useState<string | null>(null);

  // System Settings
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [pauseUploads, setPauseUploads] = useState(false);
  const [sliderConfig, setSliderConfig] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb', message: 'Premium Housing for Students' },
    { id: 2, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', message: 'Verified Landlords Only' },
  ]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/account');
    }
  }, [user, navigate]);

  const addActionLog = (action: string, target: string, type: string, canUndo = true) => {
    const newLog = {
      id: `log-${Date.now()}`,
      admin: user?.name || 'Admin',
      action,
      target,
      time: new Date().toISOString(),
      type,
      canUndo
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUndo = (logId: string) => {
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, canUndo: false, action: l.action + ' (Reverted)' } : l));
    toast({ title: "Action Undone", description: "System state restored." });
  };

  const exportLogsAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Skitech Operational Logs", 10, 20);
    doc.setFontSize(10);
    logs.forEach((log, i) => {
      doc.text(`${log.time} - ${log.admin}: ${log.action} on ${log.target}`, 10, 30 + (i * 7));
    });
    doc.save(`skitech-logs-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Filtered Lists for Omni-Search
  const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(omniSearch.toLowerCase()) || u.uuid.toLowerCase().includes(omniSearch.toLowerCase()));
  const filteredHouses = housesList.filter(h => h.title.toLowerCase().includes(omniSearch.toLowerCase()) || h.uuid.toLowerCase().includes(omniSearch.toLowerCase()));
  const filteredItems = itemsList.filter(i => i.title.toLowerCase().includes(omniSearch.toLowerCase()) || i.uuid.toLowerCase().includes(omniSearch.toLowerCase()));

  // Component Helpers
  const StatCard = ({ title, value, icon: Icon, colorClass, desc }: any) => (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden relative">
      <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-8 -mt-8 opacity-20", colorClass)} />
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl text-white", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-heading font-black">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
          </div>
        </div>
        {desc && <p className="mt-4 text-xs text-slate-500 font-medium">{desc}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC] w-full flex flex-col">
      {/* Internal Admin Header removed to fix double-heading. Relying on Sidebar/TopNav */}

      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-8">
          {/* Internal Navigation Hub removed in favor of Sidebar/BottomNav for cleaner UI */}

          {/* ── HOME: OMNI-SEARCH HUB ───────────────────────────────── */}
          <TabsContent value="home" className="space-y-8 outline-none">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2 pt-4">
              <span className="text-[10px] font-black tracking-wide text-[#FF7A00]">Platform HQ</span>
              <h2 className="font-heading font-black text-4xl text-[#0F3D91] tracking-tighter italic">Command center</h2>
              <p className="text-slate-500 text-sm font-medium">Search ecosystem entities or execute administrative functions.</p>
              <div className="w-full relative">
                <Search className="absolute left-6 top-1/2 -track-y-1/2 -translate-y-1/2 w-6 h-6 text-[#0F3D91]" />
                <input
                  placeholder="Omni-Search Hub | UUID, Name, Entity..."
                  value={omniSearch}
                  onChange={(e) => setOmniSearch(e.target.value)}
                  className="w-full h-16 pl-16 pr-8 bg-white border-2 border-[#0F3D91]/10 focus:border-[#0F3D91] rounded-[28px] shadow-2xl shadow-blue-900/5 text-lg font-bold placeholder:text-slate-300 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Active Listings" value={housesList.length} icon={Building2} colorClass="bg-[#0F3D91]" desc="Live residential units" />
              <StatCard title="Platform Members" value={usersList.length} icon={Users} colorClass="bg-[#FF7A00]" desc="Total registered profiles" />
              <StatCard title="Market items" value={itemsList.length} icon={ShoppingBag} colorClass="bg-indigo-600" desc="Community second-hand items" />
              <StatCard title="Pending Review" value={housesList.filter(h => h.internalStatus === 'pending').length} icon={Clock} colorClass="bg-amber-500" desc="Awaiting Gatekeeper approval" />
            </div>

            {omniSearch && (
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                  <CardTitle className="font-heading font-black text-sm tracking-wide text-[#0F3D91]">Broad search results</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {/* Search Result Mapping */}
                    {filteredUsers.map(u => (
                      <div key={u.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center font-black">u</div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 capitalize">{u.uuid} • {u.role}</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="rounded-xl text-[#0F3D91]" onClick={() => { setSelectedEntity(u); setEntityType('user'); }}>Manage</Button>
                      </div>
                    ))}
                    {filteredHouses.map(h => (
                      <div key={h.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <img src={h.images[0]} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{h.title}</p>
                            <p className="text-[10px] font-mono text-slate-400">{h.uuid} • House</p>
                          </div>
                        </div>
                        <Button variant="ghost" className="rounded-xl text-[#0F3D91]" onClick={() => { setSelectedEntity(h); setEntityType('house'); }}>Manage</Button>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && filteredHouses.length === 0 && (
                      <div className="p-12 text-center text-slate-400 font-bold tracking-wide bg-white">No exact matches found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── GATEKEEPER: APPROVALS ───────────────────────────────── */}
          <TabsContent value="gatekeeper" className="space-y-6 outline-none">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 space-y-2">
                <Button variant={activeGatekeeperTab === 'landlords' ? 'default' : 'ghost'} onClick={() => setActiveGatekeeperTab('landlords')} className="w-full justify-start h-12 rounded-xl font-bold bg-[#0F3D91]/5 text-[#0F3D91] hover:bg-[#0F3D91]/10 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white">
                  <UserPlus className="w-4 h-4 mr-3" /> Landlord Requests
                </Button>
                <Button variant={activeGatekeeperTab === 'properties' ? 'default' : 'ghost'} onClick={() => setActiveGatekeeperTab('properties')} className="w-full justify-start h-12 rounded-xl font-bold hover:bg-[#0F3D91]/10" style={{ backgroundColor: activeGatekeeperTab === 'properties' ? '#0F3D91' : '', color: activeGatekeeperTab === 'properties' ? 'white' : '' }}>
                  <Building2 className="w-4 h-4 mr-3" /> Property Approvals
                </Button>
                <Button variant={activeGatekeeperTab === 'marketplace' ? 'default' : 'ghost'} onClick={() => setActiveGatekeeperTab('marketplace')} className="w-full justify-start h-12 rounded-xl font-bold hover:bg-[#0F3D91]/10" style={{ backgroundColor: activeGatekeeperTab === 'marketplace' ? '#0F3D91' : '', color: activeGatekeeperTab === 'marketplace' ? 'white' : '' }}>
                  <ShoppingBag className="w-4 h-4 mr-3" /> Market Moderation
                </Button>
              </div>

              <div className="flex-1">
                {activeGatekeeperTab === 'properties' && (
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-[10px] font-black tracking-wide text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-left">Property intel</th>
                          <th className="px-6 py-4 text-left">Landlord</th>
                          <th className="px-6 py-4 text-left">Evidence</th>
                          <th className="px-6 py-4 text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {housesList.filter(h => h.internalStatus === 'pending').map(h => (
                          <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={h.images[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                <div>
                                  <p className="font-bold text-slate-900">{h.title}</p>
                                  <p className="text-[10px] font-bold text-slate-400">{h.uuid} • {h.type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{h.landlordName}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1">
                                {h.images.slice(0, 3).map((img: string, idx: number) => (
                                  <div key={idx} className="w-6 h-6 rounded bg-slate-100 border border-slate-200 overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button size="sm" className="bg-[#0F3D91] hover:bg-blue-800 rounded-lg h-8 px-4 font-bold" onClick={() => {
                                  setHousesList(prev => prev.map(house => house.id === h.id ? { ...house, internalStatus: 'active' } : house));
                                  addActionLog('Approved Property', h.uuid, 'house');
                                  toast({ title: "Approved" });
                                }}>Approve</Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 rounded-lg h-8 px-4 font-bold">Reject</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}
                {/* Add other sub-tabs logic here if needed, showing placeholder for now */}
                {activeGatekeeperTab !== 'properties' && (
                  <div className="p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-3">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-400 tracking-wide text-xs">{activeGatekeeperTab} sub-module under nominal verification</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── PROPERTY MANAGEMENT: STATUS TOGGLES ───────────────────── */}
          <TabsContent value="properties" className="space-y-6 outline-none">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#0F3D91]">Operational Inventory</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl border-slate-200"><Filter className="w-4 h-4 mr-2" /> All Areas</Button>
                <Button className="rounded-xl bg-[#FF7A00] hover:bg-orange-600 font-bold"><Plus className="w-4 h-4 mr-2" /> NEW ADMIN LISTING</Button>
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-slate-100 bg-white">
                {housesList.map(h => (
                  <div key={h.id} className="p-6 hover:bg-slate-50 transition-all flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={h.images[0]} className="w-14 h-14 rounded-2xl object-cover" />
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{h.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.uuid}</p>
                        </div>
                      </div>
                      <Badge className={cn("rounded-lg h-6 px-3 border-none capitalize", h.internalStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-400')}>
                        {h.internalStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs py-3 border-y border-slate-50">
                      <span className="font-bold text-slate-500">Live Status Toggle</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Occupied</span>
                        <Switch
                          checked={h.internalStatus === 'active'}
                          onCheckedChange={(c) => {
                            setHousesList(prev => prev.map(house => house.id === h.id ? { ...house, internalStatus: c ? 'active' : 'archived' } : house));
                            addActionLog(c ? 'Toggled Visible' : 'Toggled Occupied', h.uuid, 'house');
                          }}
                        />
                        <span className="text-[10px] font-black uppercase text-slate-900">Vacant</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button size="sm" variant="outline" className="flex-1 rounded-xl h-9 font-bold text-[#0F3D91]" onClick={() => { setSelectedEntity(h); setEntityType('house'); }}>Details</Button>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ── LIVE MARKETPLACE: SOLD BUFFER ───────────────────────── */}
          <TabsContent value="marketplace" className="space-y-6 outline-none">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">7-Day Sold Buffer Active</h4>
                <p className="text-amber-700 text-[11px] font-medium leading-tight">Items marked as 'Sold' remain visible in this dashboard for 7 days before automated ecosystem purge.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {itemsList.map(item => (
                <Card key={item.id} className={cn("border-none shadow-sm rounded-2xl overflow-hidden group", item.status === 'sold' && 'opacity-60 grayscale-[0.5]')}>
                  <div className="aspect-square relative">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2">
                      {item.status === 'sold' ? (
                        <Badge className="bg-slate-900 text-white border-none rounded-lg font-black uppercase tracking-widest px-2 py-1 text-[8px]">SOLD: BUFFER</Badge>
                      ) : (
                        <Badge className="bg-emerald-500 text-white border-none rounded-lg font-black uppercase tracking-widest px-2 py-1 text-[8px]">ACTIVE</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                      <span>{item.category}</span>
                      <span className="text-[#FF7A00]">KSh {item.price.toLocaleString()}</span>
                    </div>
                    {item.status === 'sold' && (
                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-2 text-red-400">
                        <Trash2 className="w-3 h-3" />
                        <span className="text-[9px] font-black">Purge in 3 Days</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── REQUESTS & LEADS: MATCHING ENGINE ───────────────────── */}
          <TabsContent value="requests" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#0F3D91]">Member Requirements</h3>
                <div className="space-y-3">
                  {requests.map(req => (
                    <Card key={req.id} className="border-none shadow-sm rounded-2xl p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">R</div>
                        <div>
                          <p className="font-black text-slate-900">{req.user}</p>
                          <div className="flex gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            <span>{req.type}</span>
                            <span>•</span>
                            <span>{req.location}</span>
                            <span>•</span>
                            <span className="text-emerald-500">{req.budget}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {req.matchedId ? (
                          <Button variant="outline" className="rounded-xl h-10 border-emerald-100 text-emerald-600 font-bold px-6">
                            <Check className="w-4 h-4 mr-2" /> CONNECTED
                          </Button>
                        ) : (
                          <Button className="rounded-xl h-10 bg-[#0F3D91] hover:bg-blue-800 font-bold px-6 shadow-md shadow-blue-500/20">
                            <Zap className="w-4 h-4 mr-2" /> AUTO-MATCH
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/20 rounded-full -mr-8 -mt-8 blur-3xl" />
                <h4 className="font-heading font-black text-lg uppercase mb-4">Inventory Suggestion</h4>
                <div className="space-y-4 relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Matching 4 new requests for "Bedsitter" with current vacant units in Town Center.</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex justify-between items-center">
                      <span className="font-bold opacity-80">Elite Plaza #02</span>
                      <span className="text-emerald-400 font-black">98% Match</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex justify-between items-center">
                      <span className="font-bold opacity-80">Sunrise Hse #10</span>
                      <span className="text-amber-400 font-black">7 external leads</span>
                    </div>
                  </div>
                  <Button className="w-full h-11 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black text-[10px] tracking-widest uppercase">DISPATCH LEADS</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ── MEMBERSHIP: ROLES & SUSPENSION ──────────────────────── */}
          <TabsContent value="membership" className="space-y-6 outline-none">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#0F3D91] text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Identity</th>
                    <th className="px-6 py-4 text-left">Role Hierarchy</th>
                    <th className="px-6 py-4 text-left">Reputation Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-slate-900">{u.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.uuid} • {u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 uppercase font-black text-[10px]">
                        <Badge variant="outline" className={cn("rounded-lg px-2 border-slate-200", u.role === 'admin' ? 'text-red-600 bg-red-50' : 'text-[#0F3D91] bg-slate-50')}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF7A00]" style={{ width: `${u.reputationScore}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-[#FF7A00]">{u.reputationScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#0F3D91]">
                              Manage Member <MoreVertical className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                            <DropdownMenuItem className="rounded-xl font-bold h-10 px-4" onClick={() => {
                              setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: 'landlord' } : usr));
                              addActionLog('Promoted to Landlord', u.uuid, 'user');
                            }}>
                              <ShieldCheck className="w-4 h-4 mr-3 text-emerald-500" /> Promote to Landlord
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold h-10 px-4" onClick={() => {
                              setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: 'tenant' } : usr));
                              addActionLog('Demoted to Tenant', u.uuid, 'user');
                            }}>
                              <ArrowLeft className="w-4 h-4 mr-3 text-slate-400" /> Demote to Tenant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem className="rounded-xl font-bold h-10 px-4 text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => {
                              setUsersList(prev => prev.filter(usr => usr.id !== u.id));
                              addActionLog('Hard Suspended User', u.uuid, 'user');
                            }}>
                              <XCircle className="w-4 h-4 mr-3" /> Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          {/* ── TRUST & SAFETY: REPORTS & BADGES ────────────────────── */}
          <TabsContent value="safety" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col">
                <CardHeader className="bg-[#0F3D91] text-white">
                  <CardTitle className="font-heading font-black text-lg uppercase tracking-tighter">Active System Reports</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 bg-white">
                  <div className="divide-y divide-slate-100">
                    {reports.map((r, idx) => (
                      <div key={idx} className="p-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("rounded px-1.5 text-[8px] font-black uppercase", r.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500')}>{r.status}</Badge>
                            <span className="text-[10px] font-black text-slate-400">{r.date}</span>
                          </div>
                          <p className="font-bold text-slate-900 leading-tight">{r.reason}</p>
                          <p className="text-[10px] font-black text-[#0F3D91] uppercase tracking-widest">Target: {r.target} • Filed by {r.user}</p>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl font-bold text-[10px] uppercase border-slate-200">Review</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#FF7A00] text-white">
                  <CardTitle className="font-heading font-black text-lg uppercase tracking-widest">High-Trust Allocations</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 bg-white">
                  <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500">Auto-allocated badges based on platform behavior. Manual override available.</p>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F3D91]/10 flex items-center justify-center text-[#0F3D91]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Verified Listing</p>
                          <p className="text-[10px] font-medium text-slate-500">Passed structural audit</p>
                        </div>
                      </div>
                      <Badge className="bg-slate-200 text-slate-700 font-black">214 Live</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Superhost Status</p>
                          <p className="text-[10px] font-medium text-slate-500">Avg Rating {'>'} 4.8 & 20+ inquiries</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 font-black">42 Global</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── MEDIA VAULT: ASSET MANAGEMENT ───────────────────────── */}
          <TabsContent value="vault" className="space-y-6 outline-none">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#0F3D91]">Digital Assets Hub</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl border-slate-200 h-10"><RefreshCcw className="w-4 h-4 mr-2" /> REFRESH MAPPING</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {housesList.slice(0, 12).map((h, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-100 shadow-sm">
                  <img src={h.images[0]} className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" title={h.title} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-[8px] font-black text-white uppercase text-center line-clamp-1">{h.title}</p>
                    <div className="flex gap-1">
                      <button className="w-7 h-7 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-[#FF7A00] hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"><ArrowLeft className="w-3.5 h-3.5 rotate-90" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2 hover:border-[#0F3D91] hover:text-[#0F3D91] transition-all cursor-pointer">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px] font-black uppercase">Browse Storage</span>
              </div>
            </div>
          </TabsContent>

          {/* ── SYSTEM LOGS: ACTIVITY & UNDO ────────────────────────── */}
          <TabsContent value="logs" className="space-y-6 outline-none">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="font-heading font-black text-xl uppercase tracking-tighter text-[#0F3D91]">Security Ledger</CardTitle>
                  <CardDescription>Final trace for all administrative interactions.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportLogsAsPDF} className="rounded-xl h-10 bg-[#FF7A00] hover:bg-orange-600 font-bold px-6 shadow-lg shadow-orange-500/20">
                    <Download className="w-4 h-4 mr-2" /> EXPORT PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left">Timestamp</th>
                        <th className="px-6 py-4 text-left">Operator</th>
                        <th className="px-6 py-4 text-left">Logical Action</th>
                        <th className="px-6 py-4 text-left">Target Object</th>
                        <th className="px-6 py-4 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{new Date(log.time).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="rounded h-5 border-slate-200 text-[#0F3D91] font-bold text-[9px] uppercase tracking-wider">{log.admin}</Badge>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">{log.action}</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{log.target}</td>
                          <td className="px-6 py-4 text-right">
                            {log.canUndo ? (
                              <Button size="sm" variant="ghost" onClick={() => handleUndo(log.id)} className="text-red-600 font-black text-[10px] uppercase hover:bg-red-50 px-3 rounded-lg flex items-center gap-1.5 ml-auto">
                                <Undo2 className="w-3 h-3" /> Revert State
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 justify-end text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                                <Shield className="w-3 h-3" /> Immutable
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SYSTEM SETTINGS: UI STUDIO ──────────────────────────── */}
          <TabsContent value="settings" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Marketing Slider Control */}
              <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#0F3D91] text-white">
                  <CardTitle className="font-heading font-black text-lg uppercase tracking-widest">Marketing Slider Configuration</CardTitle>
                  <CardDescription className="text-white/60">Update home page visuals and core messages.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6 bg-white">
                  <div className="space-y-4">
                    {sliderConfig.map((slide, idx) => (
                      <div key={slide.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row gap-4 group">
                        <div className="w-full sm:w-40 h-24 rounded-xl overflow-hidden relative">
                          <img src={slide.image} className="w-full h-full object-cover" />
                          <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-[10px] uppercase tracking-widest">Update Image</button>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#0F3D91]">Slide {idx + 1} Headline</Label>
                            <Input value={slide.message} onChange={(e) => {
                              const newConfig = [...sliderConfig];
                              newConfig[idx].message = e.target.value;
                              setSliderConfig(newConfig);
                            }} className="h-10 rounded-xl" />
                          </div>
                        </div>
                        <Button variant="ghost" className="self-center h-10 w-10 p-0 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-widest hover:border-[#0F3D91] hover:text-[#0F3D91]">
                      <Plus className="w-4 h-4 mr-2" /> ADD NEW MARKETING SLIDE
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Gradient Overlay Opacity</Label>
                      <input type="range" className="w-32 accent-[#00B4D8]" min="10" max="90" defaultValue="40" />
                    </div>
                    <Button className="bg-[#0F3D91] rounded-xl font-bold px-8 h-10">SAVE UI CHANGES</Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Toggles */}
              <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white p-6">
                  <h4 className="font-heading font-black text-sm uppercase tracking-widest mb-6 text-slate-400">Environment Controls</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">Maintenance Mode</p>
                        <p className="text-[10px] text-slate-500 font-medium">Redirect all guests to holding page</p>
                      </div>
                      <Switch checked={isMaintenanceMode} onCheckedChange={setIsMaintenanceMode} className="data-[state=checked]:bg-amber-500" />
                    </div>
                    <div className="flex items-center justify-between px-3 py-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">Pause All Uploads</p>
                        <p className="text-[10px] text-slate-500 font-medium">Restrict new listing creation</p>
                      </div>
                      <Switch checked={pauseUploads} onCheckedChange={(c) => { setPauseUploads(c); addActionLog(c ? 'Paused Uploads' : 'Resumed Uploads', 'System', 'system'); }} />
                    </div>
                    <Button variant="outline" className="w-full h-11 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold tracking-widest uppercase text-[10px]" onClick={() => {
                      if (confirm("DANGER: This will permanently wipe all system logs. Proceed?")) {
                        setLogs([]);
                        toast({ title: "Ledger Wiped" });
                      }
                    }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Platform Logs
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>

      <Sheet open={!!selectedEntity} onOpenChange={(open) => !open && setSelectedEntity(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-slate-100">
            <SheetTitle className="font-heading font-black text-2xl tracking-tighter text-[#0F3D91]">Entity dossier</SheetTitle>
            <SheetDescription className="font-mono text-xs font-bold text-[#FF7A00]">{selectedEntity?.uuid}</SheetDescription>
          </SheetHeader>
          {selectedEntity && (
            <div className="py-6 space-y-8 animate-in fade-in slide-in-from-right-4">
              {entityType === 'house' && (
                <>
                  <div className="rounded-3xl overflow-hidden aspect-video shadow-xl">
                    <img src={selectedEntity.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-xl text-slate-900 leading-tight">{selectedEntity.title}</h3>
                        <p className="text-emerald-600 font-black text-lg mt-1">KSh {selectedEntity.price.toLocaleString()}</p>
                      </div>
                      <Badge className="bg-[#0F3D91] rounded-lg px-2 text-[10px]">{selectedEntity.internalStatus}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-slate-400">Type</p>
                        <p className="font-black text-[#0F3D91]">{selectedEntity.type}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-slate-400">Manager</p>
                        <p className="font-black text-[#0F3D91] truncate">{selectedEntity.landlordName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="h-12 bg-[#0F3D91] hover:bg-black rounded-xl font-bold">CONTACT OWNER</Button>
                    <Button variant="outline" className="h-12 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold">REVOKE STATUS</Button>
                  </div>
                </>
              )}
              {entityType === 'user' && (
                <>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#0F3D91] text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-500/20">
                      {selectedEntity.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-slate-900">{selectedEntity.name}</h3>
                      <p className="text-slate-500 font-medium">{selectedEntity.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                    {[
                      { label: 'Registered On', value: '2026-03-01', icon: Clock },
                      { label: 'Platform Role', value: selectedEntity.role, icon: Shield, highlight: true },
                      { label: 'Security Status', value: selectedEntity.verified ? 'Verified' : 'Unverified', icon: Lock },
                      { label: 'Trust Rating', value: `${selectedEntity.reputationScore}%`, icon: Star }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl mb-1 last:mb-0">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">{item.label}</span>
                        </div>
                        <span className={cn("text-xs font-black", item.highlight ? 'text-[#0F3D91]' : 'text-slate-900')}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Extra icons for the dashboard
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

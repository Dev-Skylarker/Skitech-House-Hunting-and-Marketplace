import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Building2, ShoppingBag, Users, Clock, Eye, AlertCircle, Search, MoreVertical, LayoutDashboard, Flag, Settings, ArrowLeft, LogOut, CheckCircle2, XCircle, Undo2, Bell, MessageSquare, Edit3, ShieldAlert, Zap, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api, mockHouses, mockItems, mockUsers } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const userGrowthData = [
  { day: 'Mon', users: 12 }, { day: 'Tue', users: 18 }, { day: 'Wed', users: 25 },
  { day: 'Thu', users: 20 }, { day: 'Fri', users: 31 }, { day: 'Sat', users: 28 }, { day: 'Sun', users: 40 },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);

  // Core Data Lists
  const [housesList, setHousesList] = useState<any[]>(
    mockHouses.map((h, i) => ({ ...h, uuid: `#HS-${9000 + i}`, internalStatus: h.verified ? 'active' : 'pending' }))
  );
  const [usersList, setUsersList] = useState<any[]>(
    mockUsers.map((u, i) => ({ ...u, uuid: `#USR-2026-${String(i + 1).padStart(3, '0')}`, isSuperhost: false }))
  );

  // Logs
  const [activityLogs, setActivityLogs] = useState<any[]>([
    { id: 'log-1', admin: 'Admin #1', action: 'System Init', target: 'N/A', time: new Date().toISOString(), canUndo: false }
  ]);

  // States for viewing details
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [quickEditHouse, setQuickEditHouse] = useState<any>(null);

  // Notification States
  const [notifyTarget, setNotifyTarget] = useState('all');
  const [notifyMessage, setNotifyMessage] = useState('');

  // Filtering
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/account');
      return;
    }
    api.getAnalyticsStats().then(setStats);
  }, [user, navigate]);

  const addLog = (action: string, target: string, entityBackup: any, type: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      admin: user?.name || 'Admin',
      action,
      target,
      time: new Date().toISOString(),
      canUndo: true,
      entityBackup,
      type
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const undoLog = (logId: string) => {
    const log = activityLogs.find(l => l.id === logId);
    if (!log || !log.canUndo) return;

    if (log.type === 'house') {
      setHousesList(prev => prev.map(h => h.id === log.entityBackup.id ? log.entityBackup : h));
    } else if (log.type === 'user') {
      setUsersList(prev => prev.map(u => u.id === log.entityBackup.id ? log.entityBackup : u));
    }

    setActivityLogs(prev => prev.map(l => l.id === logId ? { ...l, canUndo: false, action: l.action + ' (Undone)' } : l));
    toast({ title: "Action Reverted", description: `Reverted: ${log.action}` });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTabFromRoute = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    return 'listings';
  };

  const handleTabChange = (val: string) => {
    if (val === 'listings') navigate('/admin');
    else navigate(`/admin/${val}`);
  };

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#F7F9FC] w-full">
      {/* Admin Top Header (Takes over normal topbar context) */}
      <div className="bg-[#0F3D91] text-white px-6 py-4 flex items-center justify-between shadow-md relative z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black">
            A
          </div>
          <div>
            <h1 className="font-heading font-black tracking-widest uppercase text-sm">Skitech Control Center</h1>
            <p className="text-white/60 text-xs font-medium">Session ID: {user?.id.substring(0, 8)}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10 hover:text-white rounded-xl">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24 md:pb-8">
        {/* Desktop Quick Nav */}
        <div className="hidden md:flex gap-2 bg-white p-2 rounded-2xl shadow-sm w-fit border border-slate-100">
          <Button variant={getTabFromRoute() === 'listings' ? 'default' : 'ghost'} onClick={() => handleTabChange('listings')} className={getTabFromRoute() === 'listings' ? 'bg-[#0F3D91] rounded-xl' : 'rounded-xl'}>
            <LayoutDashboard className="w-4 h-4 mr-2" /> Inventory
          </Button>
          <Button variant={getTabFromRoute() === 'users' ? 'default' : 'ghost'} onClick={() => handleTabChange('users')} className={getTabFromRoute() === 'users' ? 'bg-[#0F3D91] rounded-xl' : 'rounded-xl'}>
            <Users className="w-4 h-4 mr-2" /> Members
          </Button>
          <Button variant={getTabFromRoute() === 'reports' ? 'default' : 'ghost'} onClick={() => handleTabChange('reports')} className={getTabFromRoute() === 'reports' ? 'bg-[#0F3D91] rounded-xl' : 'rounded-xl'}>
            <Flag className="w-4 h-4 mr-2" /> Logs & Comms
          </Button>
        </div>

        <div className="space-y-6">

          {/* INVENTORY CONTROL (HOUSES) */}
          {getTabFromRoute() === 'listings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm shadow-[#0F3D91]/5 rounded-2xl text-white bg-[#0F3D91]">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Building2 className="w-8 h-8 opacity-50" />
                    <div><p className="text-3xl font-heading font-black">{housesList.length}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Properties</p></div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm shadow-emerald-500/5 rounded-2xl bg-emerald-500 text-white">
                  <CardContent className="p-5 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 opacity-50" />
                    <div><p className="text-3xl font-heading font-black">{housesList.filter(h => h.verified).length}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Live & Approved</p></div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm shadow-amber-500/5 rounded-2xl bg-amber-500 text-white">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Clock className="w-8 h-8 opacity-50" />
                    <div><p className="text-3xl font-heading font-black">{housesList.filter(h => !h.verified && h.internalStatus === 'pending').length}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Pending Approval</p></div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm shadow-slate-500/5 rounded-2xl bg-slate-800 text-white">
                  <CardContent className="p-5 flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 opacity-50" />
                    <div><p className="text-3xl font-heading font-black">{housesList.filter(h => h.internalStatus === 'archived').length}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Archived (Purge Queue)</p></div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] text-slate-500 uppercase font-black tracking-widest bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-xl w-32">UUID</th>
                        <th className="px-6 py-4">Title & Details</th>
                        <th className="px-6 py-4">Landlord</th>
                        <th className="px-6 py-4">Status Buffer</th>
                        <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {housesList.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedHouse(h)} className="font-mono text-xs font-bold text-[#0F3D91] hover:underline bg-[#0F3D91]/10 px-2 py-1 rounded">
                              {h.uuid}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={h.images[0]} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                              <div>
                                <p className="font-bold text-slate-900">{h.title}</p>
                                <p className="text-xs text-slate-500">KSh {h.price.toLocaleString()} • {h.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-600">
                            {h.landlordName}
                          </td>
                          <td className="px-6 py-4">
                            {h.internalStatus === 'active' && <Badge className="bg-emerald-500 border-none text-white hover:bg-emerald-600">Approved Live</Badge>}
                            {h.internalStatus === 'pending' && <Badge className="bg-amber-500 border-none text-white hover:bg-amber-600">Pending</Badge>}
                            {h.internalStatus === 'archived' && <Badge className="bg-slate-700 border-none text-white hover:bg-slate-800">Archived (~7 days)</Badge>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {h.internalStatus === 'pending' && (
                                <Button size="sm" className="h-8 bg-[#10b981] hover:bg-emerald-600 font-bold" onClick={() => {
                                  const backup = { ...h };
                                  setHousesList(prev => prev.map(house => house.id === h.id ? { ...house, verified: true, internalStatus: 'active' } : house));
                                  addLog('Approved Listing', h.uuid, backup, 'house');
                                  toast({ title: "Approved & Live" });
                                }}>Approve</Button>
                              )}
                              {h.internalStatus === 'active' && (
                                <Button size="sm" variant="outline" className="h-8 border-slate-200" onClick={() => {
                                  const backup = { ...h };
                                  setHousesList(prev => prev.map(house => house.id === h.id ? { ...house, verified: false, internalStatus: 'archived' } : house));
                                  addLog('Sent to Archive Buffer', h.uuid, backup, 'house');
                                  toast({ title: "Listing Archived", description: "Will auto-purge in 7 days." });
                                }}>Archive</Button>
                              )}
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setQuickEditHouse(h)}>
                                <Edit3 className="w-4 h-4 text-slate-500" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem onClick={() => setSelectedHouse(h)}><Eye className="w-4 h-4 mr-2" /> Form Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 font-bold" onClick={() => {
                                    const backup = { ...h };
                                    setHousesList(prev => prev.filter(house => house.id !== h.id));
                                    addLog('Hard Deleted Listing', h.uuid, backup, 'house');
                                    toast({ title: "Hard Deleted" });
                                  }}><XCircle className="w-4 h-4 mr-2" /> Force Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* USER MANAGEMENT */}
          {getTabFromRoute() === 'users' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <Card className="border-none shadow-sm rounded-2xl h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="font-heading font-black text-lg">System Registrations</CardTitle>
                        <Badge className="bg-[#0F3D91] text-white hover:bg-[#0F3D91]">7 Day Graph</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={userGrowthData}>
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                          <Line type="monotone" dataKey="users" stroke="#FF7A00" strokeWidth={3} dot={{ r: 3, fill: '#FF7A00' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-1 space-y-4">
                  <Card className="border-none shadow-sm rounded-2xl h-full flex flex-col justify-center bg-slate-900 text-white">
                    <CardContent className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Accounts</p>
                      <p className="text-5xl font-heading font-black text-white mt-2">{usersList.length}</p>
                      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Landlords: {usersList.filter(u => u.role === 'landlord').length}</span>
                        <span className="text-emerald-400">Tenants: {usersList.filter(u => u.role === 'tenant').length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search UUID, name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9 h-10 rounded-xl bg-slate-50 border-none" />
                  </div>
                  <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold"><MoreVertical className="w-4 h-4 mr-2" /> Filters</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] text-slate-500 uppercase font-black tracking-widest bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 w-40">User ID</th>
                        <th className="px-6 py-4">Profile</th>
                        <th className="px-6 py-4">Role & Status</th>
                        <th className="px-6 py-4">Verification</th>
                        <th className="px-6 py-4 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.uuid.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedUser(u)} className="font-mono text-xs font-bold text-[#FF7A00] hover:underline bg-[#FF7A00]/10 px-2 py-1 rounded">
                              {u.uuid}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`uppercase tracking-wider text-[9px] ${u.role === 'admin' ? 'border-red-200 text-red-600 bg-red-50' : 'border-[#0F3D91]/20 text-[#0F3D91] bg-[#0F3D91]/5'}`}>{u.role}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={u.verified}
                                onCheckedChange={(c) => {
                                  const backup = { ...u };
                                  setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, verified: c } : usr));
                                  addLog(c ? 'Verified Identity' : 'Revoked Verification', u.uuid, backup, 'user');
                                }}
                              />
                              <span className="text-xs font-semibold text-slate-500">{u.verified ? 'Verified' : 'Unverified'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="ghost" className="h-8 text-red-600 font-bold hover:bg-red-50" onClick={() => {
                              const backup = { ...u };
                              setUsersList(prev => prev.filter(usr => usr.id !== u.id));
                              addLog('Suspended Account', u.uuid, backup, 'user');
                            }}>Suspend Drop</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* LOGS & COMMS */}
          {getTabFromRoute() === 'reports' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Notify Composer */}
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="font-heading font-black text-lg flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#FF7A00]" /> targeted broadcast
                    </CardTitle>
                    <CardDescription>Send push notifications or strict platform alerts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Destination Group</Label>
                      <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:outline-none"
                        value={notifyTarget} onChange={(e) => setNotifyTarget(e.target.value)}>
                        <option value="all">Global: All Platform Users</option>
                        <option value="landlords">All Verified Landlords</option>
                        <option value="tenants">All Tenants</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message Payload</Label>
                      <Textarea value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} className="min-h-[120px] bg-slate-50 rounded-xl resize-none" placeholder="Alert message here..." />
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-[#0F3D91] hover:bg-[#FF7A00] font-bold tracking-widest shadow-md transition-colors" onClick={() => {
                      if (notifyMessage.trim() === '') return;
                      toast({ title: "Broadcast Dispatched", description: `Sent to ${notifyTarget}` });
                      addLog('Broadcast Message', notifyTarget.toUpperCase(), null, 'system');
                      setNotifyMessage('');
                    }}>
                      <Send className="w-4 h-4 mr-2" /> DISPATCH ALERT
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Actions / Undo Log */}
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden flex flex-col h-[500px]">
                  <CardHeader className="bg-slate-900 text-white z-10 shadow-sm border-b border-slate-800">
                    <CardTitle className="font-heading font-black text-lg flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 opacity-80" /> Operational Activity Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1 bg-slate-50">
                    <div className="divide-y divide-slate-200">
                      {activityLogs.map(log => (
                        <div key={log.id} className="p-4 bg-white flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase text-slate-400">{new Date(log.time).toLocaleTimeString()}</span>
                              <Badge variant="outline" className="text-[9px] bg-slate-50 uppercase tracking-widest px-1.5">{log.admin}</Badge>
                            </div>
                            <p className="font-semibold text-sm text-slate-900">{log.action}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">Target: {log.target}</p>
                          </div>
                          {log.canUndo && (
                            <Button size="sm" variant="outline" className="h-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => undoLog(log.id)}>
                              <Undo2 className="w-4 h-4 mr-1" /> Revert
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Quick Edit Modal (Listing) */}
        <Dialog open={!!quickEditHouse} onOpenChange={(open) => !open && setQuickEditHouse(null)}>
          <DialogContent className="rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="font-heading font-black">Live Quick Edit</DialogTitle>
            </DialogHeader>
            {quickEditHouse && (
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Title</Label>
                  <Input value={quickEditHouse.title} className="rounded-xl h-11" onChange={(e) => setQuickEditHouse({ ...quickEditHouse, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image URL</Label>
                  <Input value={quickEditHouse.images[0]} className="rounded-xl h-11" onChange={(e) => {
                    const imgs = [...quickEditHouse.images];
                    imgs[0] = e.target.value;
                    setQuickEditHouse({ ...quickEditHouse, images: imgs });
                  }} />
                </div>
                <Button className="w-full h-12 bg-[#0F3D91] rounded-xl font-bold" onClick={() => {
                  const backup = housesList.find(h => h.id === quickEditHouse.id);
                  setHousesList(prev => prev.map(h => h.id === quickEditHouse.id ? quickEditHouse : h));
                  addLog('Quick Edit', quickEditHouse.uuid, backup, 'house');
                  setQuickEditHouse(null);
                  toast({ title: "Updated Successfully" });
                }}>Save Correction</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Deep Detail Modal: Listing */}
        <Sheet open={!!selectedHouse} onOpenChange={(open) => !open && setSelectedHouse(null)}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="font-heading font-black text-xl flex items-center justify-between">
                Listing Intel <Badge className="bg-[#0F3D91] font-mono">{selectedHouse?.uuid}</Badge>
              </SheetTitle>
            </SheetHeader>
            {selectedHouse && (
              <div className="space-y-6">
                <img src={selectedHouse.images[0]} className="w-full h-48 object-cover rounded-2xl" alt='Property' />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedHouse.title}</h3>
                    <p className="text-2xl font-black text-[#0F3D91] mt-1">KSh {selectedHouse.price.toLocaleString()} <span className="text-sm font-medium text-slate-500">/mo</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-sm leading-relaxed text-slate-600 font-medium">
                    {selectedHouse.description}
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* View Deep Detail Modal: User */}
        <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="font-heading font-black text-xl flex items-center justify-between">
                Member File <Badge className="bg-[#FF7A00] font-mono">{selectedUser?.uuid}</Badge>
              </SheetTitle>
            </SheetHeader>
            {selectedUser && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F3D91]/10 text-[#0F3D91] font-black text-2xl flex items-center justify-center">
                    {selectedUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{selectedUser.name}</h3>
                    <p className="text-slate-500 font-medium text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="font-semibold text-slate-500">Phone</span>
                    <span className="font-medium text-slate-900">{selectedUser.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-500">RepScore</span>
                    <span className="font-black text-[#FF7A00]">{selectedUser.reputationScore} / 100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-500">Superhost</span>
                    <Switch checked={selectedUser.isSuperhost} onCheckedChange={(c) => {
                      const backup = { ...selectedUser };
                      const updated = { ...selectedUser, isSuperhost: c };
                      setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
                      setSelectedUser(updated);
                      addLog(c ? 'Granted Superhost' : 'Revoked Superhost', updated.uuid, backup, 'user');
                    }} />
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import {
  Building2, ShoppingBag, Users, Clock, Eye, AlertCircle, Search,
  MoreVertical, LayoutDashboard, Flag, Settings, ArrowLeft, LogOut,
  CheckCircle2, XCircle, Undo2, Bell, MessageSquare, Edit3,
  ShieldAlert, Zap, Send, ShieldCheck, UserPlus, Image as ImageIcon,
  FileText, Download, Trash2, Power, Pause, Play, RefreshCcw,
  Filter, ChevronRight, Check, X, Shield, Star, Briefcase,
  TrendingUp, Activity, Lock, Unlock, Mail, Phone, MapPin, Sun, Moon,
  Menu, X as CloseIcon
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
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';

// Mock data
const mockHouses = [
  { id: '1', title: 'Modern Apartment near Campus', verified: true },
  { id: '2', title: 'Cozy Bedsitter in Town', verified: false },
  { id: '3', title: 'Spacious 2-Bedroom House', verified: true },
];

const mockUsers = [
  { id: '1', name: 'Alice Cooper', email: 'alice@example.com' },
  { id: '2', name: 'Bob Marley', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

const marketplaceItems = [
  { id: '1', title: 'Study Desk', category: 'Furniture' },
  { id: '2', title: 'Laptop Stand', category: 'Electronics' },
  { id: '3', title: 'Office Chair', category: 'Furniture' },
];

const systemLogs = [
  { id: '1', action: 'User Login', target: 'user-123', admin: 'System', time: new Date().toISOString(), type: 'user' },
  { id: '2', action: 'Property Added', target: 'house-456', admin: 'Admin', time: new Date().toISOString(), type: 'house' },
  { id: '3', action: 'Marketplace Item Created', target: 'item-789', admin: 'System', time: new Date().toISOString(), type: 'marketplace' },
  { id: '4', action: 'User Suspended', target: 'user-321', admin: 'Admin', time: new Date().toISOString(), type: 'user' },
  { id: '5', action: 'Property Verified', target: 'house-654', admin: 'System', time: new Date().toISOString(), type: 'house' },
];

const reports = [
  { id: '1', reason: 'Inappropriate Content', target: 'user-123', user: 'reporter-456', date: '2026-03-08', status: 'pending' },
  { id: '2', reason: 'Fake Listing', target: 'house-789', user: 'reporter-321', date: '2026-03-07', status: 'resolved' },
  { id: '3', reason: 'Harassment', target: 'user-654', user: 'reporter-987', date: '2026-03-06', status: 'pending' },
];

const houseRequests = [
  { id: 'req-1', user: 'Alice Cooper', type: 'Single Room', budget: 'KSh 8,000', location: 'Near Gate B', matchedId: null },
  { id: 'req-2', user: 'Bob Marley', type: 'Bedsitter', budget: 'KSh 12,000', location: 'Town Center', matchedId: 'house-1' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [omniSearch, setOmniSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState(systemLogs);

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'trust-safety', label: 'Trust & Safety', icon: ShieldAlert },
    { id: 'media-vault', label: 'Media Vault', icon: ImageIcon },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'system-logs', label: 'System Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/account');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle a theme context
  };

  // Initialize data
  const [housesList] = useState<any[]>(
    mockHouses.map((h, i) => ({ ...h, uuid: `#HS-${9000 + i}`, internalStatus: h.verified ? 'approved' : 'pending' }))
  );
  const [usersList] = useState<any[]>(
    mockUsers.map((u, i) => ({ ...u, uuid: `#USR-${100 + i}`, internalStatus: i % 3 === 0 ? 'pending' : i % 2 === 0 ? 'approved' : 'suspended' }))
  );
  const [itemsList] = useState<any[]>(marketplaceItems);

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
  const StatCard = ({ title, value, icon: Icon, colorClass, desc, trend }: any) => (
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
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Fixed 280px width */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300",
        sidebarOpen ? "w-72" : "w-0 overflow-hidden"
      )}>
        <div className="w-72 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F3D91] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">Admin Panel</h2>
                <p className="text-xs text-slate-500">System Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMainTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                    activeMainTab === item.id
                      ? "bg-[#0F3D91] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'trust-safety' && reports.filter(r => r.status === 'pending').length > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">
                      {reports.filter(r => r.status === 'pending').length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">Administrator</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start mt-2">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "ml-72" : "ml-0")}>
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search users, properties, items..."
                  value={omniSearch}
                  onChange={(e) => setOmniSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500">
                    {reports.filter(r => r.status === 'pending').length}
                  </Badge>
                )}
              </Button>

              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                      <UserPlus className="w-3 h-3 text-slate-600" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-6">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Dashboard</h1>
                <p className="text-slate-600">System overview and quick actions</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Users" value={usersList.length} icon={Users} colorClass="bg-[#0F3D91]" desc="Total registered" trend={12} />
                <StatCard title="Properties" value={housesList.length} icon={Building2} colorClass="bg-[#FF7A00]" desc="Live listings" trend={8} />
                <StatCard title="Marketplace Items" value={itemsList.length} icon={ShoppingBag} colorClass="bg-green-600" desc="Active items" trend={15} />
                <StatCard title="Pending Reports" value={reports.filter(r => r.status === 'pending').length} icon={Flag} colorClass="bg-red-600" desc="Need attention" trend={-5} />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              log.type === 'user' ? 'bg-blue-500' : log.type === 'house' ? 'bg-orange-500' : 'bg-slate-500'
                            )} />
                            <div>
                              <p className="text-sm font-medium">{log.action}</p>
                              <p className="text-xs text-slate-500">{log.target} • {log.admin}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(log.time).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Platform performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">API Response Time</span>
                        <Badge className="bg-green-100 text-green-800">Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Database Status</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Storage Usage</span>
                        <Badge className="bg-yellow-100 text-yellow-800">68%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Sessions</span>
                        <span className="text-sm text-slate-600">247</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">User Management</h1>
                <p className="text-slate-600">Manage platform users and permissions</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Users</CardTitle>
                      <CardDescription>Manage registered users</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left p-2 font-medium">User</th>
                          <th className="text-left p-2 font-medium">Role</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Joined</th>
                          <th className="text-left p-2 font-medium">Last Active</th>
                          <th className="text-left p-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.slice(0, 10).map((user) => (
                          <tr key={user.uuid} className="border-b hover:bg-slate-50">
                            <td className="p-2">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                  <UserPlus className="w-4 h-4 text-slate-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={cn(
                                user.internalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                user.internalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              )}>
                                {user.internalStatus}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">{user.joinDate}</td>
                            <td className="p-2 text-sm">{user.lastActive}</td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Suspend
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Property Management</h1>
                <p className="text-slate-600">Manage property listings and approvals</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Properties</CardTitle>
                      <CardDescription>Manage property listings</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm">
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Property
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left p-2 font-medium">Property</th>
                          <th className="text-left p-2 font-medium">Owner</th>
                          <th className="text-left p-2 font-medium">Price</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Views</th>
                          <th className="text-left p-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {housesList.slice(0, 10).map((house) => (
                          <tr key={house.uuid} className="border-b hover:bg-slate-50">
                            <td className="p-2">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{house.title}</p>
                                <p className="text-xs text-slate-500">{house.location}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                  <UserPlus className="w-3 h-3 text-slate-600" />
                                </div>
                                <span className="text-sm">{house.landlordName}</span>
                              </div>
                            </td>
                            <td className="p-2 font-medium">KSh {house.price.toLocaleString()}</td>
                            <td className="p-2">
                              <Badge className={cn(
                                house.internalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                house.internalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              )}>
                                {house.internalStatus}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">{house.views}</td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Marketplace Management</h1>
                <p className="text-slate-600">Manage marketplace items and categories</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Items</CardTitle>
                      <CardDescription>Manage marketplace listings</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="text-left p-2 font-medium">Item</th>
                          <th className="text-left p-2 font-medium">Seller</th>
                          <th className="text-left p-2 font-medium">Price</th>
                          <th className="text-left p-2 font-medium">Category</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsList.slice(0, 10).map((item) => (
                          <tr key={item.uuid} className="border-b hover:bg-slate-50">
                            <td className="p-2">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.condition}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                  <UserPlus className="w-3 h-3 text-slate-600" />
                                </div>
                                <span className="text-sm">{item.sellerName}</span>
                              </div>
                            </td>
                            <td className="p-2 font-medium">KSh {item.price.toLocaleString()}</td>
                            <td className="p-2">
                              <Badge variant="outline">{item.category}</Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={cn(
                                item.internalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                item.internalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              )}>
                                {item.internalStatus}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trust & Safety Tab */}
            <TabsContent value="trust-safety" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Trust & Safety</h1>
                <p className="text-slate-600">Manage reports, moderation, and safety policies</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reports</CardTitle>
                    <CardDescription>Reports submitted by users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div key={report.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{report.reason}</p>
                              <p className="text-sm text-slate-600">{report.target} • {report.user}</p>
                              <p className="text-xs text-slate-500">{report.date}</p>
                            </div>
                            <Badge className={cn(
                              report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            )}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm" variant="outline">Resolve</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Safety Metrics</CardTitle>
                    <CardDescription>Platform safety statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Reports</span>
                        <span className="text-sm font-bold">{reports.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pending Review</span>
                        <span className="text-sm font-bold text-yellow-600">
                          {reports.filter(r => r.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Resolved</span>
                        <span className="text-sm font-bold text-green-600">
                          {reports.filter(r => r.status === 'resolved').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Response Time</span>
                        <span className="text-sm font-bold">2.4 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Media Vault Tab */}
            <TabsContent value="media-vault" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Media Vault</h1>
                <p className="text-slate-600">Manage images, files, and media storage</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Media Library</CardTitle>
                      <CardDescription>Manage uploaded images and files</CardDescription>
                    </div>
                    <Button size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Media
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Reports</h1>
                <p className="text-slate-600">Generate and view system reports</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity Report</CardTitle>
                    <CardDescription>Monthly user engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Report</CardTitle>
                    <CardDescription>Revenue and transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Report</CardTitle>
                    <CardDescription>Listings and marketplace data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Logs Tab */}
            <TabsContent value="system-logs" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">System Logs</h1>
                <p className="text-slate-600">View system activity and audit logs</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Audit Logs</CardTitle>
                      <CardDescription>System administrator actions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            log.type === 'user' ? 'bg-blue-500' : log.type === 'house' ? 'bg-orange-500' : 'bg-slate-500'
                          )} />
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-slate-600">{log.target} • {log.admin}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            {new Date(log.time).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.time).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 outline-none">
              <div>
                <h1 className="font-heading font-bold text-2xl text-slate-900">Settings</h1>
                <p className="text-slate-600">Configure system settings and preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic system configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Maintenance Mode</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>User Registration</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Email Notifications</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Security and privacy options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Two-Factor Auth</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Session Timeout</Label>
                      <Input type="number" defaultValue="30" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Max Login Attempts</Label>
                      <Input type="number" defaultValue="5" className="w-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

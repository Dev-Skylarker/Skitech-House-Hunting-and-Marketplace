import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, ShoppingBag, Users, Clock, TrendingUp, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api, mockHouses, mockItems, mockUsers } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const viewsData = [
  { day: 'Mon', views: 120 }, { day: 'Tue', views: 180 }, { day: 'Wed', views: 250 },
  { day: 'Thu', views: 200 }, { day: 'Fri', views: 310 }, { day: 'Sat', views: 280 }, { day: 'Sun', views: 190 },
];

const categoryData = [
  { name: 'Bedsitter', count: 12 }, { name: 'Single', count: 8 }, { name: '1BR', count: 15 },
  { name: '2BR', count: 6 }, { name: '3BR', count: 3 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/account'); return; }
    api.getAnalyticsStats().then(setStats);
  }, [user, navigate]);

  if (!stats) return null;

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="font-heading font-bold text-xl">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Houses', value: stats.totalHouses, icon: Building2, color: 'text-primary' },
          { label: 'Items', value: stats.totalItems, icon: ShoppingBag, color: 'text-secondary' },
          { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-accent' },
          { label: 'Pending', value: stats.pendingApprovals, icon: Clock, color: 'text-destructive' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <Icon className={`w-8 h-8 ${color}`} />
              <div>
                <p className="text-2xl font-heading font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Views This Week</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={viewsData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="hsl(218, 82%, 31%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">House Categories</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(193, 100%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="houses">
        <TabsList className="w-full">
          <TabsTrigger value="houses" className="flex-1">Houses</TabsTrigger>
          <TabsTrigger value="items" className="flex-1">Items</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="houses" className="mt-3 space-y-2">
          {mockHouses.map(h => (
            <div key={h.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{h.title}</p>
                <p className="text-xs text-muted-foreground">KSh {h.price.toLocaleString()} · {h.location}</p>
              </div>
              <div className="flex gap-1">
                <Badge className={h.verified ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}>
                  {h.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="items" className="mt-3 space-y-2">
          {mockItems.map(i => (
            <div key={i.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{i.title}</p>
                <p className="text-xs text-muted-foreground">KSh {i.price.toLocaleString()} · {i.category}</p>
              </div>
              <Badge>{i.status}</Badge>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="users" className="mt-3 space-y-2">
          {mockUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant="outline">{u.role}</Badge>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Settings, Building2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);
    toast({ title: 'Welcome back!', description: 'You have logged in successfully.' });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(regName, regEmail, regPassword);
    toast({ title: 'Account created!', description: 'Welcome to Skitech House Hunting.' });
  };

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-4">
        <h1 className="font-heading font-bold text-xl mb-4">Account</h1>
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div><Label>Email</Label><Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required /></div>
                  <div><Label>Password</Label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required /></div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div><Label>Full Name</Label><Input value={regName} onChange={e => setRegName(e.target.value)} required /></div>
                  <div><Label>Email</Label><Input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required /></div>
                  <div><Label>Password</Label><Input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required /></div>
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-heading font-bold text-lg">{user?.name?.charAt(0)}</span>
        </div>
        <div>
          <h1 className="font-heading font-bold text-lg">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Link to="/post-house" className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:bg-muted transition-colors">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Post a House</span>
        </Link>
        <Link to="/post-item" className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:bg-muted transition-colors">
          <ShoppingBag className="w-5 h-5 text-secondary" />
          <span className="font-medium text-sm">Sell an Item</span>
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Admin Dashboard</span>
          </Link>
        )}
      </div>

      <Button variant="outline" onClick={logout} className="w-full mt-4">
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}

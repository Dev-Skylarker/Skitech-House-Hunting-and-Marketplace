import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, HelpCircle, LogOut, Mail, MapPin, Phone, Settings, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BackButton } from '@/components/ui/BackButton';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/account', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleLabel = user.userType === 'landlord' ? 'Landlord' : 'Resident';

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      <div className="bg-[#0F3D91] text-white pt-10 pb-16 px-6 md:pt-12 md:pb-20 rounded-b-[40px] shadow-2xl relative overflow-hidden mb-[-48px] z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <BackButton />
            <Link
              to="/account?tab=settings"
              className="text-[11px] font-bold uppercase tracking-widest text-white/90 hover:text-white flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Edit
            </Link>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-3xl font-heading font-bold shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl">{user.name}</h1>
              <p className="text-white/75 text-sm mt-1 font-medium">
                {roleLabel} · {user.verified ? 'Verified' : 'Unverified'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Badge className="bg-white/20 hover:bg-white/25 text-white border-none rounded-full">
                  {user.email}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10 space-y-6">
        <Card className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[24px] overflow-hidden bg-white/95 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0F3D91]" />
              About you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {user.bio ? (
              <p className="text-slate-600 text-sm leading-relaxed">{user.bio}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">No bio yet — add one in profile settings.</p>
            )}
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-slate-50/50">
                <Phone className="w-4 h-4 text-[#0F3D91] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{user.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50/50">
                <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{user.location || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50/50">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3">
          <Link to="/account?tab=settings">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F3D91]/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#0F3D91]" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900">Profile &amp; settings</p>
                    <p className="text-xs text-muted-foreground">Update name, phone, and bio</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/notifications">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#0F3D91]" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900">Notifications</p>
                    <p className="text-xs text-muted-foreground">Alerts and updates</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/help">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900">Help center</p>
                    <p className="text-xs text-muted-foreground">Guides and support</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/forgot-password">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900">Password &amp; sign-in</p>
                    <p className="text-xs text-muted-foreground">Reset via email</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

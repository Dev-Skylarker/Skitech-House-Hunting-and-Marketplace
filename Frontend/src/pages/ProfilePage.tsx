import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Shield, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { BackButton } from '../components/ui/BackButton';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/account');
      return;
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || ''
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-14 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
          <BackButton />
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0F3D91] to-[#FF7A00] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
              <Camera className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="font-heading font-black text-[#0F3D91] text-3xl md:text-4xl leading-tight uppercase tracking-tighter">
              {user.name}
            </h1>
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium leading-relaxed">
              {user.userType === 'landlord' ? 'Property Owner' : 'Tenant'} • Member since {new Date().getFullYear()}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge variant={user.verified ? "default" : "secondary"} className="bg-[#0F3D91] text-white">
                {user.verified ? 'Verified' : 'Unverified'}
              </Badge>
              {user.userType === 'landlord' && (
                <Badge variant="outline" className="border-[#FF7A00] text-[#FF7A00]">
                  Landlord
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white rounded-lg">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white rounded-lg">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white rounded-lg">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white rounded-lg">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#0F3D91]">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  className="rounded-xl"
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    disabled={!isEditing}
                    className="rounded-xl resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="bg-[#0F3D91] hover:bg-[#FF7A00] rounded-xl">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="rounded-xl">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-[#0F3D91]">Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="rounded-xl" />
                </div>
                <Button className="bg-[#0F3D91] hover:bg-[#FF7A00] rounded-xl">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-[#0F3D91]">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">Configure</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-slate-500">Browser push notifications</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">Configure</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-slate-500">Receive text messages</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-[#0F3D91]">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-slate-500">English (US)</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">Change</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-slate-500">Light Mode</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">Change</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-red-500">Permanently delete your account</p>
                  </div>
                  <Button variant="destructive" size="sm" className="rounded-xl">Delete</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

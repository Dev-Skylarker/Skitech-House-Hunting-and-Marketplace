import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft, Save, Shield, AlertCircle, Star, Award, CheckCircle2, Clock, Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BADGE_INFO: Record<string, { icon: any; color: string; description: string }> = {
  superhost: {
    icon: Award,
    color: 'text-yellow-600',
    description: 'Consistently high ratings and quick responses'
  },
  responsive: {
    icon: Zap,
    color: 'text-blue-600',
    description: 'Responds within 2 hours'
  },
  clean: {
    icon: Shield,
    color: 'text-green-600',
    description: '5-star cleanliness ratings'
  },
  communicative: {
    icon: CheckCircle2,
    color: 'text-cyan-600',
    description: 'Excellent communication skills'
  },
};

export default function LandlordSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect non-landlords
  if (!user || user.userType !== 'landlord') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] px-4 py-6">
        <div className="max-w-sm mx-auto">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
              <h2 className="font-bold text-lg">Access Denied</h2>
              <p className="text-sm text-muted-foreground">
                Only landlords can access these settings.
              </p>
              <Button onClick={() => navigate('/account')} className="w-full rounded-lg">
                Back to Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSaveBio = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setEditingBio(false);
    toast({ title: 'Profile updated', description: 'Your landlord profile has been saved.' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-6 pb-24">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/account')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-2xl font-bold">Landlord Settings</h1>
        </div>

        {/* Profile Preview Card */}
        <Card className="border-none shadow-sm rounded-2xl mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0F3D91] to-[#0A2560] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-bold text-base">{user?.name}</h2>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {user?.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reputation Score Section */}
        <div className="space-y-3 mb-6">
          <h3 className="font-heading font-semibold text-sm">Reputation & Ratings</h3>
          <Card className="border-none shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-4">
              {/* Score Display */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reputation Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F3D91]">{user?.reputationScore || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Reputation Score</p>
                  <div className="mt-2 w-full bg-muted rounded-full h-1">
                    <div
                      className="bg-[#0F3D91] h-1 rounded-full"
                      style={{ width: `${((user?.reputationScore || 0) / 100) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Average Rating */}
                <div className="text-center">
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-3xl font-bold text-yellow-500">{user?.averageRating || 0}</span>
                    <span className="text-sm text-muted-foreground">/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
                  <div className="flex justify-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(user?.averageRating || 0)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-muted-foreground'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Ratings */}
              <div className="pt-4 border-t border-border/50 text-center">
                <p className="text-sm font-medium">{user?.totalRatings || 0} reviews from tenants</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        {user?.badges && user.badges.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-heading font-semibold text-sm">Your Badges</h3>
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {user.badges.map(badge => {
                    const BadgeIcon = BADGE_INFO[badge]?.icon || Award;
                    const info = BADGE_INFO[badge];
                    return (
                      <div key={badge} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                        <BadgeIcon className={`w-5 h-5 flex-shrink-0 ${info?.color}`} />
                        <div>
                          <p className="font-semibold text-sm capitalize">{badge.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{info?.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Response Time */}
        {user?.responseTime && (
          <div className="space-y-3 mb-6">
            <h3 className="font-heading font-semibold text-sm">Response Time</h3>
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{user.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Average time to reply</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bio Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm">Bio</h3>
            {!editingBio && (
              <button
                onClick={() => setEditingBio(true)}
                className="text-[#0F3D91] text-xs font-semibold hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editingBio ? (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">About You</Label>
                  <Textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell tenants about yourself, your properties, and your experience..."
                    maxLength={300}
                    className="rounded-lg min-h-[100px] text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {bio.length}/300
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Phone</Label>
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+254712345678"
                    className="rounded-lg text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSaveBio}
                    disabled={saving}
                    className="flex-1 h-10 rounded-lg bg-[#0F3D91] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingBio(false);
                      setBio(user?.bio || '');
                      setPhone(user?.phone || '');
                    }}
                    variant="outline"
                    className="flex-1 h-10 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-4">
                {bio ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No bio yet</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Verification Section */}
        {!user?.verified && (
          <div className="space-y-3 mb-6">
            <h3 className="font-heading font-semibold text-sm">Verification</h3>
            <Card className="border-none shadow-sm rounded-xl bg-amber-50 border border-amber-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-amber-900">Not Verified</h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Upload your UoEM ID or business documents to become a verified landlord and increase tenant trust.
                    </p>
                    <Button className="mt-3 h-8 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white">
                      Upload Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Section */}
        <div className="space-y-3 mb-6">
          <h3 className="font-heading font-semibold text-sm">Preferences</h3>
          <Card className="border-none shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <button className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Notification Settings</p>
                    <p className="text-xs text-muted-foreground">Control alerts and messages</p>
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Privacy & Security</p>
                    <p className="text-xs text-muted-foreground">Manage your data</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Button
          onClick={logout}
          variant="outline"
          className="w-full h-10 rounded-lg text-sm font-semibold border-destructive/40 text-destructive hover:bg-destructive/5"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

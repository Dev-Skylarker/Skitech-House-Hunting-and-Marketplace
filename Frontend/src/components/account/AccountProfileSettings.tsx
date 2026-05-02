import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Loader2, Save, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

export function AccountProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    setBio(user.bio || '');
    setLocation(user.location || '');
  }, [user?.id, user?.name, user?.phone, user?.bio, user?.location]);

  const dirty = useMemo(() => {
    if (!user) return false;
    return (
      name !== (user.name || '') ||
      phone !== (user.phone || '') ||
      bio !== (user.bio || '') ||
      location !== (user.location || '')
    );
  }, [user, name, phone, bio, location]);

  const applySave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateProfile({ name, phone, bio, location });
    setSaving(false);
    setConfirmOpen(false);
    if (error) {
      toast({ title: 'Could not save', description: error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Profile updated', description: 'Your details were saved successfully.' });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-heading font-bold text-2xl text-slate-900">Profile &amp; account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Display name, contact details, and bio stay in sync with your account everywhere on Skitech.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="acct-name">Display name</Label>
          <Input
            id="acct-name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl h-11"
            placeholder="How you appear to others"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="acct-email">Email</Label>
          <Input id="acct-email" value={user.email} disabled className="rounded-xl h-11 bg-muted/30" />
          <p className="text-[11px] text-muted-foreground">Email sign-in is managed by your auth provider.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="acct-phone">Phone</Label>
          <Input
            id="acct-phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="rounded-xl h-11"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="acct-loc">Location (optional)</Label>
          <Input
            id="acct-loc"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="rounded-xl h-11"
            placeholder="e.g. Embu town, near campus"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="acct-bio">Bio (optional)</Label>
          <Textarea
            id="acct-bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="rounded-xl min-h-[100px] resize-none"
            placeholder="A short intro helps landlords and buyers trust you."
          />
        </div>

        <Button
          type="button"
          disabled={!dirty || saving}
          onClick={() => setConfirmOpen(true)}
          className="bg-[#0F3D91] hover:bg-[#FF7A00] rounded-xl h-11 font-heading font-bold gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-900">Shortcuts</h3>
        <div className="grid grid-cols-1 gap-3">
          <Link to="/notifications">
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#0F3D91]" />
                  <div>
                    <p className="text-sm font-bold">Notifications</p>
                    <p className="text-[11px] text-muted-foreground">View alerts and updates</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/help?tab=legal&open=privacy">
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#FF7A00]" />
                  <div>
                    <p className="text-sm font-bold">Privacy &amp; data</p>
                    <p className="text-[11px] text-muted-foreground">How we handle your information</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/forgot-password">
            <Card className="border-none shadow-sm bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-bold">Password &amp; sign-in</p>
                    <p className="text-[11px] text-muted-foreground">Reset password via email</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Save profile changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your display name, phone, location, and bio will be updated on your account immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={saving}>Cancel</AlertDialogCancel>
            <Button
              className="rounded-xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white"
              disabled={saving}
              onClick={() => {
                void applySave();
              }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm & save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

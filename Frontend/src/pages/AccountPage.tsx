import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Search, Filter, LayoutDashboard, History, CheckCircle, Eye, MapPin, Tag,
  ArrowLeft, Save, Star, Award, Zap, MessageSquare, Phone, Mail, HelpCircle,
  ShieldCheck, FileText, Info, Globe, Headphones, Shield, CheckCircle2, BarChart3,
  User, Edit, Trash2, Building2, ShoppingBag, Bell, Heart, LogOut, Settings, AlertCircle, PlayCircle, Menu, CheckSquare, ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { UserType, House, MarketplaceItem } from '@/types';
import { mockHouses, mockItems } from '@/services/api';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from 'lucide-react';
import { HouseCard } from '@/components/HouseCard';
import { ItemCard } from '@/components/ItemCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

// ============= GUEST USER VIEW =============
function GuestView() {
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserType>('tenant');
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };

  const passwordStrength = getPasswordStrength(regPassword);

  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast({ title: 'Welcome back!', description: 'You have logged in successfully.' });
      const from = (location.state as any)?.from?.pathname || '/account';
      navigate(from, { replace: true });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please ensure both password fields are identical.' });
      return;
    }
    if (regPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Password must be at least 8 characters long.' });
      return;
    }
    if (!agreesToTerms) {
      toast({ title: 'Please agree to terms', description: 'You must accept our Terms and Privacy Policy to continue.' });
      return;
    }
    const success = await register(regName, regEmail, regPassword, selectedRole);
    if (success) {
      setRegistrationSuccess(true);
      toast({
        title: 'Account created!',
        description: `Welcome to Skitech as a ${selectedRole}. Please sign in to continue.`
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F9FC] flex flex-col">
      {/* Premium Hero Header */}
      <div className="relative h-48 overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
          alt="Modern House"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Faded Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/40 to-secondary/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2 drop-shadow-md">
            Unlock More with Your Account
          </h1>
          <p className="text-sm text-white/95 max-w-[320px] leading-snug drop-shadow-sm">
            Sign in/signup to view verified houses, explore the marketplace, and access your dashboard
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-sm mx-auto">

          {/* Tab Selector */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-2 w-full bg-muted/60 rounded-lg p-1 h-11">
              <TabsTrigger
                value="login"
                className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md text-sm data-[state=active]:bg-white data-[state=active]:text-[#0F3D91] data-[state=active]:shadow-sm"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-4">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="pt-6 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Email</Label>
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                        className="h-12 text-sm rounded-2xl"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Password</Label>
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                        className="h-12 text-sm rounded-2xl"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg bg-[#0F3D91] text-white text-sm font-semibold hover:bg-[#FF7A00] transition-all duration-300 shadow-lg hover:shadow-[#FF7A00]/20"
                    >
                      Sign In
                    </Button>
                  </form>

                  {/* Login Footer Text */}
                  <div className="text-center pt-2">
                    <p className="text-[11px] text-muted-foreground">
                      Forgot password?{' '}
                      <button
                        type="button"
                        className="text-[#0F3D91] font-semibold underline hover:text-[#0A2560]"
                        onClick={() => navigate('/forgot-password')}
                      >
                        click here to reset password
                      </button>{' '}
                      or{' '}
                      <button
                        type="button"
                        className="text-[#0F3D91] font-semibold underline hover:text-[#0A2560]"
                        onClick={() => setActiveTab('register')}
                      >
                        sign up
                      </button>
                    </p>
                  </div>

                  {/* Google Sign-in */}
                  <div className="space-y-3 pt-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => console.log('Google sign-in placeholder')}
                      className="w-full h-11 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <p className="text-[11px] text-muted-foreground font-medium mb-2">
                      Dev Hints (Testing):
                    </p>
                    <div className="space-y-1 bg-muted/40 p-3 rounded-lg">
                      <p className="text-[11px] text-muted-foreground font-mono">
                        <strong>Tenant:</strong> alice@example.com
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        <strong>Landlord:</strong> john@example.com
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        <strong>Admin:</strong> admin@skitech.co.ke
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-4">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="pt-6 space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">I am a:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('tenant')}
                        className={`p-3 rounded-lg border-2 transition-all ${selectedRole === 'tenant'
                          ? 'border-[#0F3D91] bg-[#0F3D91]/5'
                          : 'border-border bg-card'
                          }`}
                      >
                        <div className="font-semibold text-sm">Tenant</div>
                        <div className="text-[11px] text-muted-foreground">Looking for housing</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('landlord')}
                        className={`p-3 rounded-lg border-2 transition-all ${selectedRole === 'landlord'
                          ? 'border-[#0F3D91] bg-[#0F3D91]/5'
                          : 'border-border bg-card'
                          }`}
                      >
                        <div className="font-semibold text-sm">Landlord</div>
                        <div className="text-[11px] text-muted-foreground">Renting properties</div>
                      </button>
                    </div>
                  </div>

                  {/* Registration Form */}
                  {registrationSuccess ? (
                    <div className="space-y-6 py-8 text-center animate-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Account Created!</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">
                          Your {selectedRole} account is ready. Please log in using your credentials.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setRegistrationSuccess(false);
                          setActiveTab('login');
                        }}
                        className="w-full h-12 rounded-xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-heading font-bold transition-all duration-300 shadow-lg shadow-blue-900/10 hover:shadow-orange-500/20 gap-2"
                      >
                        Sign In Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Full Name</Label>
                        <Input
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          required
                          className="h-12 text-sm rounded-2xl"
                          placeholder="John Kariuki"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Email</Label>
                        <Input
                          type="email"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          required
                          className="h-12 text-sm rounded-2xl"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Password</Label>
                        <Input
                          type="password"
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          required
                          className="h-12 text-sm rounded-2xl"
                          placeholder="Create a secure password"
                        />
                        {regPassword && (
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${getStrengthColor(passwordStrength)}`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {getStrengthLabel(passwordStrength)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Confirm Password</Label>
                        <Input
                          type="password"
                          value={regConfirmPassword}
                          onChange={e => setRegConfirmPassword(e.target.value)}
                          required
                          className={`h-12 text-sm rounded-2xl ${regConfirmPassword && regPassword !== regConfirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                            }`}
                          placeholder="Re-enter your password"
                        />
                        {regConfirmPassword && regPassword !== regConfirmPassword && (
                          <p className="text-[11px] text-red-500 font-medium">Passwords do not match</p>
                        )}
                        {regConfirmPassword && regPassword === regConfirmPassword && regPassword.length >= 8 && (
                          <p className="text-[11px] text-green-600 font-medium">✓ Passwords match</p>
                        )}
                      </div>

                      {selectedRole === 'landlord' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                          <div className="flex gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-amber-900">Identity Verification</p>
                              <p className="text-[11px] text-amber-800 mt-0.5 leading-tight">
                                Your identity needs to be verified. Personal documents may be required after account creation. Please wait for verification within 48h.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-center text-muted-foreground">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="text-[#0F3D91] font-medium hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-[#0F3D91] font-medium hover:underline">
                          Privacy Policy
                        </Link>
                      </p>

                      {/* Terms Checkbox */}
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms-agree"
                          checked={agreesToTerms}
                          onChange={(e) => setAgreesToTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded cursor-pointer accent-[#0F3D91]"
                        />
                        <label htmlFor="terms-agree" className="text-[11px] text-blue-900 cursor-pointer">
                          I agree to the{' '}
                          <Link to="/terms" className="font-semibold underline hover:text-blue-700">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="font-semibold underline hover:text-blue-700">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={!agreesToTerms}
                        className="w-full h-11 rounded-lg bg-[#0F3D91] text-white text-sm font-semibold hover:bg-[#FF7A00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-[#FF7A00]/20"
                      >
                        Create Account
                      </Button>
                    </form>
                  )}

                  {/* Google Sign-up */}
                  <div className="space-y-3 pt-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => console.log('Google sign-up with role:', selectedRole)}
                      className="w-full h-11 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Sign up with Google
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ============= LANDLORD PROFILE =============
function LandlordProfile({ user }: { user: any }) {
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const BADGE_INFO: Record<string, { icon: any; color: string; description: string }> = {
    superhost: { icon: Award, color: 'text-yellow-600', description: 'Consistently high ratings and quick responses' },
    responsive: { icon: Zap, color: 'text-blue-600', description: 'Responds within 2 hours' },
    clean: { icon: Shield, color: 'text-green-600', description: '5-star cleanliness ratings' },
    communicative: { icon: CheckCircle2, color: 'text-cyan-600', description: 'Excellent communication skills' },
  };

  const handleSaveBio = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setEditingBio(false);
    toast({ title: 'Profile updated', description: 'Your business profile has been saved.' });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-heading font-bold text-2xl">Business Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your landlord identity and reputation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0F3D91]" />
              Reputation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-heading font-bold text-[#0F3D91]">{user?.reputationScore || 92}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Score</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-3xl font-heading font-bold text-yellow-500">{user?.averageRating || 4.5}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Average Rating</p>
                <p className="text-[11px] text-[#0F3D91] font-bold mt-1">12 reviews from tenants</p>
              </div>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Response Time</p>
                  <p className="text-[11px] text-muted-foreground">Average time to reply</p>
                </div>
              </div>
              <span className="font-heading font-bold text-[#0F3D91]">&lt; 2 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF7A00]" />
              Active Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(user?.badges || ['superhost', 'responsive']).map((badge: string) => (
                <Badge key={badge} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1.5 rounded-full capitalize">
                  {badge.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading font-bold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-[#0F3D91]" />
            Landlord Bio
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingBio(!editingBio)}
            className="text-[#0F3D91] font-bold"
          >
            {editingBio ? 'Cancel' : 'Edit Bio'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingBio ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>About You / Business</Label>
                <Textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="rounded-xl min-h-[120px]"
                  placeholder="Describe your properties and experience..."
                />
              </div>
              <div className="space-y-2">
                <Label>Business Phone (Public)</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl h-11" placeholder="+2547..." />
              </div>
              <Button onClick={handleSaveBio} disabled={saving} className="bg-[#0F3D91] rounded-xl h-11 px-8 font-heading font-bold">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed italic">
                "{bio || 'No bio provided. Adding a bio helps tenants trust you more.'}"
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4" />
                <span>{phone || 'Not set'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!user?.verified && (
        <Card className="border-none shadow-lg bg-orange-50 border-orange-100 rounded-2xl overflow-hidden p-0">
          <div className="bg-[#FF7A00] px-6 py-2 text-white text-[10px] font-bold uppercase tracking-widest">Action Required</div>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#FF7A00]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-orange-900 text-lg">Identity Verification</h4>
                <p className="text-sm text-orange-800/80 mb-4">Complete your verification to get the "Verified Landlord" badge and unlock premium features.</p>

                <Label htmlFor="document-upload" className="cursor-pointer inline-flex items-center justify-center bg-[#FF7A00] hover:bg-orange-700 text-white rounded-xl font-heading font-bold h-10 px-6 transition-colors shadow-md">
                  Upload Documents
                </Label>
                <Input
                  id="document-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      toast({
                        title: "Document Received",
                        description: "Your verification document has been securely uploaded and is pending review.",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============= SUPPORT TAB =============
function SupportTab() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-heading font-bold text-2xl">Help & Support</h2>
        <p className="text-sm text-muted-foreground">Need assistance? Our team is here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: MessageSquare, title: 'WhatsApp Support', desc: 'Chat with us directly', action: 'Open WhatsApp', color: 'bg-green-500' },
          { icon: Phone, title: 'Call Center', desc: 'Daily 8AM - 8PM', action: 'Call +254 700...', color: 'bg-blue-600' },
          { icon: Mail, title: 'Email Us', desc: 'support@skitech.co.ke', action: 'Send Email', color: 'bg-indigo-600' },
          { icon: HelpCircle, title: 'Help Center', desc: 'Guides & Resources', action: 'Visit Help Hub', color: 'bg-purple-600', link: '/help' },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <Button
                variant="outline"
                className="w-full rounded-xl font-heading font-bold h-10 border-[#0F3D91] text-[#0F3D91] hover:bg-[#0F3D91]/5"
                onClick={() => item.link ? navigate(item.link) : null}
              >
                {item.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-[#0F3D91] text-white overflow-hidden p-0">
        <div className="p-8 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Headphones className="w-32 h-32" />
          </div>
          <div className="relative z-10 max-w-[400px]">
            <h3 className="font-heading font-bold text-xl mb-3">Community Safety</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">Found a suspicious listing or user? Reporting helps us keep the Embu community safe for everyone.</p>
            <Button className="bg-white text-[#0F3D91] hover:bg-white/90 rounded-xl font-heading font-bold h-11 px-8">Report an Issue</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============= MAIN ACCOUNT PAGE =============
// ============= LISTING MANAGEMENT =============
function ListingManagement({ user }: { user: any }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [houses, setHouses] = useState<House[]>(() =>
    mockHouses.filter(h => h.landlordId === user.id || h.landlordName === user.name)
  );
  const [items, setItems] = useState<MarketplaceItem[]>(() =>
    mockItems.filter(i => i.sellerName === user.name)
  );

  const activeSubTab = (searchParams.get('subtab') as 'houses' | 'items') ||
    (user.userType === 'landlord' ? 'houses' : 'items');

  const setActiveSubTab = (tab: 'houses' | 'items') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('subtab', tab);
    setSearchParams(newParams);
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = activeSubTab === 'houses' ? houses.map(h => h.id) : items.map(i => i.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'status') => {
    if (action === 'delete') {
      if (confirm(`Delete ${selectedIds.length} listings?`)) {
        if (activeSubTab === 'houses') setHouses(prev => prev.filter(h => !selectedIds.includes(h.id)));
        else setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
        setSelectedIds([]);
        toast({ title: 'Deleted', description: 'Selected listings removed.' });
      }
    } else {
      if (activeSubTab === 'houses') {
        setHouses(prev => prev.map(h => selectedIds.includes(h.id) ? { ...h, status: h.status === 'available' ? 'taken' : 'available' } : h));
      } else {
        setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: i.status === 'active' ? 'sold' : 'active' } : i));
      }
      setSelectedIds([]);
      toast({ title: 'Status Updated' });
    }
  };

  const handleDeleteHouse = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setHouses(prev => prev.filter(h => h.id !== id));
      toast({ title: 'Listing Deleted' });
    }
  };

  const handleToggleHouseStatus = (id: string) => {
    setHouses(prev => prev.map(h => {
      if (h.id === id) {
        const newStatus = h.status === 'available' ? 'taken' : 'available';
        return { ...h, status: newStatus as any };
      }
      return h;
    }));
    toast({ title: 'Status Updated' });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Item Deleted' });
    }
  };

  const handleToggleItemStatus = (id: string) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newStatus = i.status === 'active' ? 'sold' : 'active';
        return { ...i, status: newStatus as any };
      }
      return i;
    }));
    toast({ title: 'Status Updated' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl">
            {user.userType === 'landlord' ? 'Manage Content' : 'My Marketplace'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user.userType === 'landlord'
              ? 'Track and update your active posts'
              : 'Manage your items listed for sale'}
          </p>
        </div>
        <Link to={activeSubTab === 'houses' ? '/post-house' : '/post-item'}>
          <Button className="bg-[#0F3D91] hover:bg-[#FF7A00] font-heading font-bold rounded-xl gap-2 h-11 px-6 shadow-lg shadow-blue-900/10 hover:shadow-[#FF7A00]/20 transition-all duration-300">
            <Plus className="w-5 h-5" />
            New {activeSubTab === 'houses' ? 'Listing' : 'Item'}
          </Button>
        </Link>
      </div>

      <Tabs value={activeSubTab} onValueChange={(v) => { setActiveSubTab(v as any); setSelectedIds([]); }} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-6">
          {user.userType === 'landlord' && (
            <TabsTrigger value="houses" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
              <Building2 className="w-4 h-4 mr-2" />
              Houses
            </TabsTrigger>
          )}
          <TabsTrigger value="items" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        {/* Selection & Bulk Actions Bar */}
        {selectedIds.length > 0 ? (
          <div className="flex items-center justify-between bg-[#0F3D91] border-none rounded-2xl p-4 mb-4 shadow-xl shadow-blue-900/20 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4 text-white">
              <Checkbox
                id="select-all"
                checked={(activeSubTab === 'houses' ? houses.length : items.length) > 0 && selectedIds.length === (activeSubTab === 'houses' ? houses.length : items.length)}
                onCheckedChange={(c) => handleSelectAll(c as boolean)}
                className="w-5 h-5 rounded-md border-white/30 bg-white/10 data-[state=checked]:bg-[#FF7A00] data-[state=checked]:border-[#FF7A00]"
              />
              <div className="flex flex-col">
                <Label htmlFor="select-all" className="text-sm font-black tracking-tight leading-none cursor-pointer">
                  {selectedIds.length === (activeSubTab === 'houses' ? houses.length : items.length) ? 'All' : selectedIds.length} SELECTED
                </Label>
                <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest mt-1">Massive Actions Enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('status')}
                className="rounded-xl h-10 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/10"
              >
                Toggle Status
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="bg-[#FF7A00] hover:bg-orange-600 border-none rounded-xl h-10 px-6 text-xs font-black shadow-lg shadow-orange-950/20 gap-2"
              >
                <Trash2 className="w-4 h-4" /> DELETE PERMANENTLY
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all-empty"
                checked={false}
                onCheckedChange={(c) => handleSelectAll(c as boolean)}
                className="w-5 h-5 rounded-md border-slate-300"
              />
              <Label htmlFor="select-all-empty" className="text-sm font-bold text-slate-400">Select items to manage</Label>
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Management Mode</div>
          </div>
        )}

        <TabsContent value="houses" className="focus-visible:ring-0 outline-none">
          <div className="space-y-3">
            {houses.map(house => (
              <div
                key={house.id}
                className={cn(
                  "group bg-white border rounded-2xl p-3 flex items-center justify-between transition-all hover:shadow-md",
                  selectedIds.includes(house.id) ? "border-[#0F3D91] bg-blue-50/20" : "border-slate-100"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-3 shrink-0">
                    <Checkbox
                      checked={selectedIds.includes(house.id)}
                      onCheckedChange={(c) => handleSelectItem(house.id, c as boolean)}
                      className="w-5 h-5 rounded-md border-slate-300"
                    />
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shadow-inner relative">
                      <img src={house.images[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase tracking-tighter">Main</div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-heading font-bold text-[15px] truncate text-slate-900">{house.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D91]">
                        KSh {house.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" /> {house.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Eye className="w-3 h-3" /> {house.views} views
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none",
                    house.status === 'available' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {house.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-100">
                      <DropdownMenuItem
                        onClick={() => navigate(`/houses/${house.id}`)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5"
                      >
                        <Eye className="w-4 h-4" /> View full post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSelectItem(house.id, !selectedIds.includes(house.id))}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 font-bold text-[#0F3D91]"
                      >
                        <CheckSquare className="w-4 h-4" /> {selectedIds.includes(house.id) ? 'Deselect' : 'Select item'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toast({ title: 'Edit Mode Enabled' })}
                        className="rounded-lg gap-2 cursor-pointer py-2.5"
                      >
                        <Edit className="w-4 h-4" /> Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleHouseStatus(house.id)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 text-blue-600"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark as {house.status === 'available' ? 'Taken' : 'Available'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteHouse(house.id)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 text-destructive focus:bg-destructive focus:text-white"
                      >
                        <Trash2 className="w-4 h-4" /> Delete listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {houses.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-slate-200">
                <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg">No houses listed</h3>
                <p className="text-slate-400 text-sm mb-6">Your listed properties will appear here</p>
                <Link to="/post-house">
                  <Button variant="outline" className="rounded-xl px-10 h-11 border-slate-200 hover:bg-slate-50 font-bold gap-2">
                    <Plus className="w-4 h-4" /> List your first house
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="items" className="focus-visible:ring-0 outline-none">
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className={cn(
                  "group bg-white border rounded-2xl p-3 flex items-center justify-between transition-all hover:shadow-md",
                  selectedIds.includes(item.id) ? "border-orange-500 bg-orange-50/20" : "border-slate-100"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-3 shrink-0">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(c) => handleSelectItem(item.id, c as boolean)}
                      className="w-5 h-5 rounded-md border-slate-300"
                    />
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shadow-inner relative">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase tracking-tighter">Main</div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-heading font-bold text-[15px] truncate text-slate-900">{item.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                        KSh {item.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Tag className="w-3 h-3" /> {item.category}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Eye className="w-3 h-3" /> {item.views} views
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none",
                    item.status === 'active' ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {item.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-100">
                      <DropdownMenuItem
                        onClick={() => navigate(`/marketplace/${item.id}`)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5"
                      >
                        <Eye className="w-4 h-4" /> View full post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSelectItem(item.id, !selectedIds.includes(item.id))}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 font-bold text-[#0F3D91]"
                      >
                        <CheckSquare className="w-4 h-4" /> {selectedIds.includes(item.id) ? 'Deselect' : 'Select item'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toast({ title: 'Edit Mode Enabled' })}
                        className="rounded-lg gap-2 cursor-pointer py-2.5"
                      >
                        <Edit className="w-4 h-4" /> Edit item
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleItemStatus(item.id)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 text-orange-600"
                      >
                        <Zap className="w-4 h-4" /> Mark as {item.status === 'active' ? 'Sold' : 'Active'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded-lg gap-2 cursor-pointer py-2.5 text-destructive focus:bg-destructive focus:text-white"
                      >
                        <Trash2 className="w-4 h-4" /> Delete post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-slate-200">
                <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg">No items for sale</h3>
                <p className="text-slate-400 text-sm mb-6">Manage your marketplace posts here</p>
                <Link to="/post-item">
                  <Button variant="outline" className="rounded-xl px-10 h-11 border-slate-200 hover:bg-slate-50 font-bold gap-2 text-orange-600 border-orange-100 hover:bg-orange-50">
                    <Plus className="w-4 h-4" /> Sell something
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============= DASHBOARD OVERVIEW =============
function DashboardOverview({ user }: { user: any }) {
  const stats = [
    { label: 'Views', value: '1,284', icon: Eye, color: 'text-[#0F3D91]', bg: 'bg-blue-50' },
    { label: 'Inquiries', value: '28', icon: Bell, color: 'text-[#FF7A00]', bg: 'bg-orange-50' },
    { label: 'Favorites', value: '45', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Reputation', value: user.reputationScore || '92', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-heading font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg">Recent Engagement</CardTitle>
            <CardDescription>Activity on your listings this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2 px-2">
              {[65, 45, 75, 55, 90, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#0F3D91] rounded-t-lg transition-all hover:bg-[#FF7A00]"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {[
                { text: 'New favorite on your listing', time: '2h ago', icon: Heart },
                { text: 'Inquiry about modern 1BR', time: '5h ago', icon: Bell },
                { text: 'Listing approved by admin', time: '1d ago', icon: CheckCircle2 },
              ].map((item, i) => (
                <div key={i} className="px-4 py-3 flex gap-3">
                  <item.icon className="w-4 h-4 text-[#0F3D91] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium leading-tight">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============= MAIN DASHBOARD =============
function Dashboard({ user, logout }: { user: any; logout: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addNotification } = useNotifications();
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    // Welcome Trigger
    const welcomeKey = `welcome_sent_${user.id}`;
    if (!localStorage.getItem(welcomeKey)) {
      addNotification({
        userId: user.id,
        title: `Welcome to Skitech, ${user.name}!`,
        description: user.userType === 'landlord'
          ? "Start listing your properties today to reach thousands of students."
          : "Explore verified houses and marketplace items around campus.",
        type: 'system',
      });
      localStorage.setItem(welcomeKey, 'true');
    }
  }, [user.id, user.name, user.userType, addNotification]);

  const setActiveTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (tab === 'guide' || tab === 'help') {
      navigate('/help');
      return;
    }
    if (tab === 'admin') {
      navigate('/admin');
      return;
    }
    newParams.set('tab', tab);
    // When changing main tab, clear subtab unless we stay on listings
    if (tab !== 'listings') newParams.delete('subtab');
    setSearchParams(newParams);
  };

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'listings', label: 'My Listings', icon: ShoppingBag, roles: ['landlord', 'user'] },
    { id: 'landlord-profile', label: 'Business Profile', icon: Award, roles: ['landlord'] },
    { id: 'history', label: 'History', icon: History },
    { id: 'admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
    { id: 'support', label: 'Contact & Support', icon: Headphones },
    { id: 'guide', label: 'System Guide', icon: PlayCircle },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ].filter(tab => !tab.roles || tab.roles.includes(user.userType) || user.role === 'admin');

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Premium Dashboard Header */}
      <div className="bg-[#0F3D91] text-white pt-10 pb-20 px-6 md:pt-12 md:pb-24 rounded-b-[40px] shadow-2xl relative overflow-hidden mb-[-60px] md:mb-[-80px] z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-5">
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-none bg-white">
                  <SheetHeader className="p-6 text-left border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D91] to-[#0A2560] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">S</div>
                      <SheetTitle className="font-heading font-black tracking-tight text-[#0F3D91]">SKITECH</SheetTitle>
                    </div>
                  </SheetHeader>
                  <div className="px-4 py-6 flex flex-col gap-2">
                    {navItems.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-heading font-bold text-sm transition-all text-left",
                          activeTab === tab.id
                            ? "bg-slate-50 text-[#0F3D91] ring-1 ring-slate-100 shadow-sm"
                            : "text-muted-foreground hover:bg-slate-50/50"
                        )}
                      >
                        <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#FF7A00]" : "")} />
                        {tab.label}
                      </button>
                    ))}
                    <div className="mt-auto pt-6 border-t border-slate-100">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-heading font-bold text-sm text-destructive hover:bg-destructive/5 w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-2xl md:text-3xl font-heading font-bold shadow-2xl">
              {getInitial(user?.name || '')}
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl md:text-3xl mb-0.5 md:mb-1 truncate max-w-[180px] md:max-w-none">{user?.name}</h1>
              <div className="flex items-center gap-2 md:gap-3">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none rounded-full px-2 md:px-3 text-[10px] md:text-xs">
                  {user.userType === 'landlord' ? 'Verified Owner' : 'Verified Resident'}
                </Badge>
                <div className="flex items-center gap-1.5 text-white/70 text-[10px] md:text-sm font-medium">
                  <BarChart3 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  {user.reputationScore || 92}%
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 relative z-20">
            <Button
              onClick={logout}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 border rounded-xl font-heading font-bold gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <Card className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-[24px] md:rounded-[32px] overflow-hidden bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row h-full min-h-[500px] md:min-h-[600px]">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden md:block w-64 bg-slate-50 border-r border-slate-100 p-6">
              <nav className="flex flex-col gap-2">
                {navItems.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-heading font-bold text-sm transition-all text-left",
                      activeTab === tab.id
                        ? "bg-white shadow-sm text-[#0F3D91] ring-1 ring-slate-100"
                        : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                    )}
                  >
                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#FF7A00]" : "")} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 md:p-8 lg:p-10">
              {activeTab === 'overview' && <DashboardOverview user={user} />}
              {activeTab === 'listings' && <ListingManagement user={user} />}
              {activeTab === 'landlord-profile' && <LandlordProfile user={user} />}
              {activeTab === 'support' && <SupportTab />}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-8">
                  <h2 className="font-heading font-bold text-2xl">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={user.name} className="rounded-xl h-11" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email Address</Label>
                      <Input defaultValue={user.email} disabled className="rounded-xl h-11 bg-muted/30" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue="+254 700 000 000" className="rounded-xl h-11" />
                    </div>
                    <Button className="bg-[#0F3D91] rounded-xl h-11 font-heading font-bold px-8">Save Changes</Button>
                  </div>

                  <div className="pt-8 space-y-4">
                    <h3 className="font-heading font-bold text-lg">Preferences</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Card className="border-none shadow-sm bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-[#0F3D91]" />
                            <div>
                              <p className="text-sm font-bold">Notification Settings</p>
                              <p className="text-[11px] text-muted-foreground">Control alerts and messages</p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[#FF7A00]" />
                            <div>
                              <p className="text-sm font-bold">Privacy & Security</p>
                              <p className="text-[11px] text-muted-foreground">Manage your data and security</p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
              {/* Other tabs can be added similarly */}
            </div>
          </div>
        </Card>
        <div className="mt-8 mb-24 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F3D91]/30">V.1.1.1 Skitech. Ecosystem</p>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <GuestView />;
  }

  return <Dashboard user={user} logout={logout} />;
}

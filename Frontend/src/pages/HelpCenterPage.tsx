import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  Compass,
  Download,
  Flag,
  Headphones,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Search as SearchIcon,
  Send,
  ShieldAlert,
  ShieldCheck,
  Menu,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FeedbackPopup } from '@/components/FeedbackPopup';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/ui/BackButton';
import { guidePhases, faqCategories, legalArticles, type LegalArticleId } from '@/data/helpCenterContent';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { emailjsService } from '@/services/emailjsService';

const TAB_IDS = ['start', 'guide', 'faq', 'contact', 'safety', 'legal'] as const;
type HelpTab = (typeof TAB_IDS)[number];

function isHelpTab(v: string | null): v is HelpTab {
  return !!v && (TAB_IDS as readonly string[]).includes(v);
}

function HelpContactForm({ prefillSubject = '', prefillMessage = '' }: { prefillSubject?: string; prefillMessage?: string }) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: prefillSubject, message: prefillMessage });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: isAuthenticated && user ? user.name || '' : prev.name,
      email: isAuthenticated && user ? user.email || '' : prev.email,
      subject: prefillSubject || prev.subject,
      message: prefillMessage || prev.message,
    }));
  }, [isAuthenticated, user, prefillSubject, prefillMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: 'Missing information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: 'Invalid email', description: 'Please provide a valid email address.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await emailjsService.sendSupportTicketEmail(
        formData.name,
        formData.email,
        `Subject: ${formData.subject}\n\n${formData.message}`
      );
      if (response.success) {
        toast({ title: 'Message sent', description: 'Our team will get back to you soon.' });
        setFormData({
          name: isAuthenticated ? user?.name || '' : '',
          email: isAuthenticated ? user?.email || '' : '',
          subject: '',
          message: '',
        });
      } else {
        toast({ title: 'Failed to send', description: response.error || 'Please try again later.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-[28px] border-none shadow-lg shadow-blue-900/5 bg-white overflow-hidden">
      <CardContent className="p-6 md:p-10 space-y-6">
        <div>
          <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Send a message</h3>
          <p className="text-sm text-slate-500 mt-1">We typically reply within one business day.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your name"
                className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="you@example.com"
                className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
              placeholder="What is this about?"
              className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
              placeholder="Describe your question or issue in detail…"
              className="min-h-[140px] rounded-xl border-slate-100 bg-slate-50 focus:bg-white p-4"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-2xl font-heading font-bold shadow-lg shadow-blue-900/10"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" /> Send message
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const REPORT_TYPES = [
  { value: 'fraud', label: '🚨 Fraud / Scam' },
  { value: 'fake_listing', label: '🏠 Fake Listing' },
  { value: 'harassment', label: '⚠️ Harassment' },
  { value: 'wrong_info', label: '📋 Wrong Information' },
  { value: 'other', label: '💬 Other' },
];

function ReportForm({ onGoContact }: { onGoContact: () => void }) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [reportType, setReportType] = useState('fraud');
  const [name, setName] = useState(isAuthenticated && user ? user.name || '' : '');
  const [email, setEmail] = useState(isAuthenticated && user ? user.email || '' : '');
  const [listing, setListing] = useState(searchParams.get('listing') || '');
  const [landlord, setLandlord] = useState(searchParams.get('landlord') || '');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !details.trim()) {
      toast({ title: 'Missing fields', description: 'Name, email, and details are required.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const subject = `[REPORT] ${REPORT_TYPES.find(t => t.value === reportType)?.label || 'Report'}`;
    const body = [
      `Report Type: ${REPORT_TYPES.find(t => t.value === reportType)?.label}`,
      listing ? `Listing: ${listing}` : '',
      landlord ? `Landlord / Seller: ${landlord}` : '',
      `\nDetails:\n${details}`,
    ].filter(Boolean).join('\n');

    try {
      const res = await emailjsService.sendSupportTicketEmail(name, email, `${subject}\n\n${body}`);
      if (res.success) {
        toast({ title: 'Report submitted', description: 'Our team will review your report within 24 hours.' });
        setDetails(''); setListing(''); setLandlord('');
      } else {
        toast({ title: 'Failed to send', description: res.error || 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not send report. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-red-50/60 border border-red-100 rounded-2xl p-5">
      {/* Report type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Report Type</label>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setReportType(t.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                reportType === t.value
                  ? 'bg-red-600 text-white border-red-600 shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name"
            className="h-11 rounded-xl bg-white border-slate-200 focus:bg-white" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
            className="h-11 rounded-xl bg-white border-slate-200 focus:bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Listing / Item Name</label>
          <Input value={listing} onChange={e => setListing(e.target.value)} placeholder="eg. Modern 1BR Apartment"
            className="h-11 rounded-xl bg-white border-slate-200" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Landlord / Seller</label>
          <Input value={landlord} onChange={e => setLandlord(e.target.value)} placeholder="eg. John Mwangi"
            className="h-11 rounded-xl bg-white border-slate-200" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Describe the Problem *</label>
        <Textarea value={details} onChange={e => setDetails(e.target.value)} required
          placeholder="Provide as much detail as possible — what happened, when, screenshots etc."
          className="min-h-[110px] rounded-xl bg-white border-slate-200 p-4" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}
          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-sm">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            <span className="flex items-center gap-2"><Flag className="w-4 h-4" /> Submit Report</span>
          )}
        </Button>
        <Button type="button" variant="outline" className="rounded-xl" onClick={onGoContact}>
          Use full contact form
        </Button>
      </div>
    </form>
  );
}

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFeedback, setShowFeedback] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');

  // Report pre-fill from URL: ?report=1&subject=...&listing=...&landlord=...
  const reportParam = searchParams.get('report');
  const reportSubjectParam = searchParams.get('subject') || '';
  const reportListingParam = searchParams.get('listing') || '';
  const reportLandlordParam = searchParams.get('landlord') || '';

  const prefillSubject = reportSubjectParam || (reportParam ? 'Report: Fraudulent Listing / Suspicious Activity' : '');
  const prefillMessage = reportParam
    ? `I would like to report a problem on Skitech.\n\n${
        reportListingParam ? `Listing: ${reportListingParam}\n` : ''
      }${reportLandlordParam ? `Landlord / Seller: ${reportLandlordParam}\n` : ''}\nDetails:\n`
    : '';

  const [safetyOpen, setSafetyOpen] = useState(reportParam ? 'report' : 'basics');

  const tabParam = searchParams.get('tab');
  const activeTab: HelpTab = isHelpTab(tabParam) ? tabParam : 'start';

  const openParam = searchParams.get('open');
  const legalAccordionValue: LegalArticleId =
    openParam === 'terms' || openParam === 'privacy' || openParam === 'about' ? openParam : 'about';

  const setTab = useCallback(
    (tab: HelpTab, openLegal?: LegalArticleId) => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev);
          next.set('tab', tab);
          if (tab === 'legal' && openLegal) next.set('open', openLegal);
          else next.delete('open');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.slice(1).split('&')[0];
      if (raw === 'installation-guide') {
        setTab('legal');
        requestAnimationFrame(() =>
          document.getElementById('installation-guide')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
        return;
      }
      if (raw && isHelpTab(raw)) setTab(raw as HelpTab);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [setTab]);

  const supportHref = import.meta.env.VITE_SUPPORT_WHATSAPP_URL as string | undefined;
  const waLink = supportHref || 'https://wa.me/254700000000?text=Hi%20Skitech%20support';

  const filteredFaqs = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return faqCategories;
    return faqCategories
      .map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.questions.length > 0);
  }, [faqSearch]);

  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLandlord = user?.userType === 'landlord';
  const accentColor = isAuthenticated ? (isLandlord ? "bg-green-500" : "bg-orange-500") : "bg-[#0F3D91]";
  const accentText = isAuthenticated ? (isLandlord ? "text-green-500" : "text-orange-500") : "text-[#0F3D91]";
  const pillColor = isAuthenticated ? (isLandlord ? "bg-green-400" : "bg-orange-400") : "bg-blue-400";

  const navItems = [
    { id: 'start', label: 'Start', icon: BookOpen },
    { id: 'guide', label: 'Guide', icon: Compass },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Headphones },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'legal', label: 'Legal', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] bg-transparent text-slate-900 overflow-hidden font-sans antialiased mt-6 pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 relative z-50 rounded-tl-[2.5rem]",
        sidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          {sidebarOpen && (
            <div className="flex flex-col animate-in fade-in">
              <h1 className="font-heading font-black text-xl tracking-tight text-[#0F3D91] uppercase">
                Help Center
              </h1>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl hover:bg-slate-50">
            <Menu className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id as HelpTab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                activeTab === item.id ? "bg-[#0F3D91] text-white shadow-lg shadow-blue-900/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}>
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", activeTab === item.id ? accentText : "group-hover:scale-110")} />
              {sidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {activeTab === item.id && <div className={cn("absolute left-0 w-1 h-6 rounded-r-full", pillColor)} />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-50 space-y-1">
          <button onClick={() => navigate(-1)} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all duration-200 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm">Go Back</span>}
          </button>
          {isAuthenticated && sidebarOpen && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm", accentColor)}>{user?.name?.[0] || 'U'}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate text-slate-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{isLandlord ? 'Landlord' : 'Resident'}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-lg tracking-tight text-[#0F3D91] uppercase">
              Help Center
            </h1>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar bg-[#F8FAFC] md:rounded-tr-[2.5rem] md:border-t md:border-r border-slate-200 pb-24 md:pb-12">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={v => { if (isHelpTab(v)) setTab(v); }} className="w-full">

        <TabsContent value="start" className="space-y-4 mt-0">
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardContent className="p-5 space-y-4">
              <h2 className="font-heading font-bold text-lg text-slate-900">Welcome</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Skitech helps you find housing and marketplace deals around Embu. Use the tabs above for step-by-step
                guides, searchable answers, contact options, and full legal text.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col items-stretch text-left border-slate-200 hover:border-[#0F3D91]/30 hover:bg-blue-50/50" onClick={() => setTab('guide')}>
                  <span className="font-heading font-bold text-slate-900">System guide</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">Account → search → contact → move-in</span>
                </Button>
                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col items-stretch text-left border-slate-200 hover:border-[#0F3D91]/30 hover:bg-blue-50/50" onClick={() => setTab('faq')}>
                  <span className="font-heading font-bold text-slate-900">FAQ</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">Residents, landlords, marketplace</span>
                </Button>
                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col items-stretch text-left border-slate-200 hover:border-[#FF7A00]/25 hover:bg-orange-50/40" onClick={() => setTab('contact')}>
                  <span className="font-heading font-bold text-slate-900">Contact</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">WhatsApp, phone, email form</span>
                </Button>
                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col items-stretch text-left border-slate-200 hover:border-[#0F3D91]/30 hover:bg-blue-50/50" onClick={() => setTab('legal', 'terms')}>
                  <span className="font-heading font-bold text-slate-900">Terms &amp; privacy</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">Policies and about Skitech</span>
                </Button>
              </div>
              <Button variant="link" className="text-[#0F3D91] font-bold p-0 h-auto" onClick={() => navigate('/account?tab=settings')}>
                Profile &amp; account settings →
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4 mt-0">
          <p className="text-sm text-slate-600 px-1">
            Tap a phase to expand. Inside each phase, open individual steps for full detail.
          </p>
          <Accordion type="single" collapsible className="space-y-3">
            {guidePhases.map(phase => (
              <AccordionItem
                key={phase.id}
                value={phase.id}
                className="bg-white border border-slate-100 rounded-2xl px-4 md:px-5 shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-4 text-left gap-3">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', phase.colorClass)}>
                    <phase.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-heading font-bold text-slate-900 block">{phase.title}</span>
                    <span className="text-xs text-slate-500 font-medium leading-snug">{phase.summary}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0 border-t border-slate-50">
                  <div className="space-y-2 mt-3">
                    {phase.substeps.map((sub, idx) => (
                      <Collapsible key={idx} className="group rounded-xl border border-slate-100 bg-slate-50/80 overflow-hidden">
                        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-100/80 transition-colors">
                          <span className="flex items-center gap-2 min-w-0">
                            <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', phase.colorClass)}>
                              <sub.icon className="w-4 h-4" />
                            </span>
                            <span className="font-bold text-sm text-slate-800">{sub.title}</span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-3 pt-0">
                          <p className="text-sm text-slate-600 leading-relaxed pl-10 border-l-2 border-[#0F3D91]/20 ml-4">{sub.content}</p>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 mt-0">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search questions and answers…"
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
            />
          </div>
          {filteredFaqs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No matches — try another word or browse a category below.</p>
          ) : (
            filteredFaqs.map(cat => (
              <div key={cat.category} className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF7A00] ml-1">{cat.category}</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {cat.questions.map((item, qIdx) => (
                    <AccordionItem
                      key={`${cat.category}-${qIdx}`}
                      value={`${cat.category}-${qIdx}`}
                      className="bg-white border border-slate-100 rounded-2xl px-4 shadow-sm"
                    >
                      <AccordionTrigger className="hover:no-underline py-4 text-left font-heading font-bold text-slate-800 text-sm hover:text-[#0F3D91]">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4 pt-0">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
          <Card className="rounded-2xl bg-[#0F3D91] text-white border-none overflow-hidden">
            <CardContent className="p-6 text-center space-y-3">
              <p className="font-heading font-bold">Still stuck?</p>
              <p className="text-sm text-white/80">Open Contact and send us a message or WhatsApp.</p>
              <Button className="bg-[#FF7A00] hover:bg-orange-600 rounded-xl" onClick={() => setTab('contact')}>
                Go to contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900">WhatsApp</h3>
                <p className="text-sm text-slate-600 flex-1">Short questions and screenshots.</p>
                <Button className="rounded-xl bg-green-600 hover:bg-green-700 w-full" onClick={() => window.open(waLink, '_blank', 'noopener,noreferrer')}>
                  Open WhatsApp
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="w-11 h-11 rounded-xl bg-[#0F3D91] flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900">Phone</h3>
                <p className="text-sm text-slate-600 flex-1">Daily 8:00–20:00 EAT.</p>
                <Button variant="outline" className="rounded-xl border-[#0F3D91] text-[#0F3D91] w-full" onClick={() => (window.location.href = 'tel:+254700000000')}>
                  Call +254 700 000 000
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-slate-900">Quick feedback</h3>
                <p className="text-sm text-slate-600 flex-1">Rate your experience in a short flow.</p>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 w-full" onClick={() => setShowFeedback(true)}>
                  Open feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0F3D91] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">Email</p>
                  <p>support@skitech.ac.ke</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">WhatsApp desk</p>
                  <p>+254 756 789 012</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">Office</p>
                  <p>Embu, near UoEM main gate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <HelpContactForm prefillSubject={prefillSubject} prefillMessage={prefillMessage} />
        </TabsContent>

        <TabsContent value="safety" className="space-y-4 mt-0">
          <Accordion type="single" collapsible value={safetyOpen} onValueChange={setSafetyOpen} className="space-y-3">
            <AccordionItem value="basics" className="bg-white border border-slate-100 rounded-2xl px-4 shadow-sm">
              <AccordionTrigger className="hover:no-underline py-4 font-heading font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-orange-600" />
                  Core safety rules
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 space-y-2 pb-4">
                <p>Inspect houses in person before paying deposit or rent. Bring someone when possible.</p>
                <p>For marketplace, meet in public, verify the item, and avoid advance payments to strangers.</p>
                <p>Use official Skitech contact channels for support — not random “agent” numbers in DMs.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="red-flags" className="bg-white border border-slate-100 rounded-2xl px-4 shadow-sm">
              <AccordionTrigger className="hover:no-underline py-4 font-heading font-bold text-slate-900">
                Red flags
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 space-y-2 pb-4">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pressure to pay immediately without a viewing.</li>
                  <li>Listings with mismatched photos and description or copied text from elsewhere.</li>
                  <li>Requests for “registration fees” to Skitech staff personal accounts.</li>
                  <li>Seller or landlord refusing a voice or video call before meeting.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="report" className="bg-white border border-red-100 rounded-2xl px-4 shadow-sm">
              <AccordionTrigger className="hover:no-underline py-4 font-heading font-bold text-red-700">
                <span className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  Report a problem
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 pb-4 space-y-4">
                <p className="text-slate-500">
                  Fill in the form below to report fraud, a suspicious listing, or any safety concern.
                  Our team will review your case and follow up within 24 hours.
                </p>

                {/* Quick report type chips */}
                <ReportForm onGoContact={() => setTab('contact')} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4 mt-0">
          <Accordion
            type="single"
            collapsible
            value={legalAccordionValue}
            onValueChange={v => {
              if (v === 'about' || v === 'terms' || v === 'privacy') {
                setSearchParams(
                  prev => {
                    const next = new URLSearchParams(prev);
                    next.set('tab', 'legal');
                    next.set('open', v);
                    return next;
                  },
                  { replace: true }
                );
              }
            }}
            className="space-y-3"
          >
            {(Object.keys(legalArticles) as LegalArticleId[]).map(id => (
              <AccordionItem key={id} value={id} className="bg-white border border-slate-100 rounded-2xl px-4 md:px-5 shadow-sm overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-4 text-left font-heading font-bold text-[#0F3D91]">
                  {legalArticles[id].label}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0 border-t border-slate-50">
                  <div className="space-y-6 mt-4">
                    {legalArticles[id].sections.map(sec => (
                      <div key={sec.heading}>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">{sec.heading}</h4>
                        <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                          {sec.body.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Card id="installation-guide" className="rounded-2xl border-slate-100 shadow-sm bg-white scroll-mt-28">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#0F3D91]">
                <Download className="w-5 h-5" />
                <h3 className="font-heading font-bold text-slate-900">Install the web app (PWA)</h3>
              </div>
              <p className="text-sm text-slate-600">
                <strong className="text-slate-800">Chrome / Edge:</strong> menu → Install Skitech or Install app.{' '}
                <strong className="text-slate-800">Safari (iOS):</strong> Share → Add to Home Screen.
              </p>
              <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Managed by Skitech Solutions. For questions about these terms, use the Contact tab.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FeedbackPopup isOpen={showFeedback} onClose={() => setShowFeedback(false)} forceOpen={showFeedback} />
          </div>
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] p-0 border-none bg-white">
            <div className="p-6 flex items-center gap-3 border-b border-slate-50">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg", isAuthenticated ? accentColor : "bg-[#0F3D91]")}>S</div>
              <h1 className="font-heading font-black text-xl tracking-tight text-[#0F3D91] uppercase">SKITECH</h1>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setTab(tab.id as HelpTab); setIsMobileMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left",
                    activeTab === tab.id ? "bg-[#0F3D91] text-white shadow-lg shadow-blue-900/10" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? (isAuthenticated ? accentText : "text-white") : "")} />
                  <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                </button>
              ))}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button onClick={() => navigate(-1)} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-bold text-sm">Go Back</span>
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}

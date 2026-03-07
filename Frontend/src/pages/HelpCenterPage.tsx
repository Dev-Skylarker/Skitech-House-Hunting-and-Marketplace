import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, HelpCircle, BookOpen, UserCircle,
    ShieldAlert, Info, MessageSquare, Star, Flag,
    ChevronRight, ExternalLink, ShieldCheck, CheckCircle2, RotateCcw, Download,
    Smartphone, Laptop, Apple, Chrome, MoreVertical
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackPopup } from '../components/FeedbackPopup';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const resources = [
    {
        id: 'guide',
        title: 'System Guide',
        icon: BookOpen,
        items: [
            { title: 'Getting Started', desc: 'New to Skitech.? Learn the basics of finding your first home.' },
            { title: 'Listing Items', desc: 'How to post items on the community marketplace efficiently.' },
            { title: 'Safety Tips', desc: 'Secure your transactions and avoid common housing scams.' },
            { title: 'Payment Options', desc: 'Understanding deposit handling and monthly rent payments.' },
        ]
    },
    {
        id: 'account',
        title: 'Account Guide',
        icon: UserCircle,
        items: [
            { title: 'Verification', desc: 'How to get your user or property owner profile verified.' },
            { title: 'Profile Settings', desc: 'Managing your contacts, bio, and location details.' },
            { title: 'Notifications', desc: 'Configuring alerts for new house matches or messages.' },
        ]
    },
    {
        id: 'legal',
        title: 'Usage Policy',
        icon: ShieldCheck,
        items: [
            { title: 'Terms of Use', desc: 'The rules of engagement within our residential ecosystem.' },
            { title: 'Privacy Policy', desc: 'How we protect your personal and browsing data.' },
            { title: 'Listing Standards', desc: 'Minimum requirements for house images and descriptions.' },
        ]
    }
];

const testimonials = [
    { name: "Kevin W.", role: "Resident", comment: "Skitech. made my relocation to Embu so much easier. The verifications actually mean something!", rating: 5 },
    { name: "Sarah J.", role: "Local Resident", comment: "The marketplace is a lifesaver. Sold all my old electronics in two days!", rating: 5 },
    { name: "M. Maina", role: "Property Owner", comment: "Standardized forms help me present my units professionally to the right clients.", rating: 4 },
];

export default function HelpCenterPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('resources');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-32">
            {/* Header - Wishlist Style Arrangement */}
            <div className="bg-white px-6 py-8 border-b border-slate-100 mb-6">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 rounded-2xl bg-slate-50 hover:bg-white shadow-sm border border-slate-100 transition-all active:scale-95 text-[#0F3D91]"
                        >
                            <ArrowLeft className="w-5 h-5 font-bold" />
                        </button>
                        <div className="space-y-1">
                            <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900">Help Center</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7A00]">V.1.1.1 Hub</p>
                        </div>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="How can we help you today?"
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-[#0F3D91] transition-all text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center gap-4 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                        <TabsList className="bg-white/50 border border-slate-100 p-1.5 h-14 rounded-2xl shadow-sm">
                            <TabsTrigger value="resources" className="rounded-xl px-6 h-10 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white font-heading font-bold text-sm transition-all">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Resources
                            </TabsTrigger>
                            <TabsTrigger value="faqs" className="rounded-xl px-6 h-10 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white font-heading font-bold text-sm transition-all">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                FAQs
                            </TabsTrigger>
                            <TabsTrigger value="feedback" className="rounded-xl px-6 h-10 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white font-heading font-bold text-sm transition-all">
                                <Star className="w-4 h-4 mr-2" />
                                Testimonials
                            </TabsTrigger>
                            <TabsTrigger value="install" className="rounded-xl px-6 h-10 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white font-heading font-bold text-sm transition-all">
                                <Download className="w-4 h-4 mr-2" />
                                Installation
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="resources" className="m-0 space-y-12 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((res) => (
                                <div key={res.id} className="space-y-4">
                                    <div className="flex items-center gap-3 ml-2">
                                        <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
                                            <res.icon className="w-4 h-4" />
                                        </div>
                                        <h2 className="font-heading font-black text-lg tracking-tight">{res.title}</h2>
                                    </div>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                        {res.items.map((item, i) => (
                                            <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl group cursor-pointer">
                                                <CardContent className="p-4 flex items-start gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="font-heading font-bold text-sm mb-1 group-hover:text-[#0F3D91] transition-colors">{item.title}</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 mt-1 transition-transform group-hover:translate-x-1" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* About Us & Policies Grid - From Wishlist Page Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <Card className="rounded-[32px] border-none shadow-xl shadow-blue-900/5 bg-[#0F3D91] text-white overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-all duration-500" />
                                <CardContent className="p-8 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Company Info</span>
                                    <h3 className="font-heading font-black text-2xl mb-3">About Skitech.</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">
                                        We're building the infrastructure for the next generation of living in Embu, bridging the gap between housing demand and professional marketplace services.
                                    </p>
                                    <Button variant="outline" className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold h-11 px-6">
                                        Read Our Story
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate('/legal?tab=privacy')}>
                                    <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                                        <ShieldAlert className="w-8 h-8 text-[#FF7A00]" />
                                        <div>
                                            <h4 className="font-heading font-black text-slate-900">Privacy Policy</h4>
                                            <p className="text-[11px] text-slate-500 font-medium">How we manage your data</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate('/legal?tab=terms')}>
                                    <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                                        <CheckCircle2 className="w-8 h-8 text-[#0F3D91]" />
                                        <div>
                                            <h4 className="font-heading font-black text-slate-900">Terms of Service</h4>
                                            <p className="text-[11px] text-slate-500 font-medium">Platform usage rules</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="faqs" className="outline-none">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm text-center">
                            <Info className="w-12 h-12 text-[#FF7A00] mx-auto mb-4" />
                            <h3 className="text-xl font-heading font-black text-slate-900 mb-2">Detailed FAQs Coming Soon</h3>
                            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Our team is compiling the most common questions to serve you better. Check back in v1.1.2!</p>
                            <Button className="bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-xl h-11 font-bold">Contact Support Now</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="feedback" className="m-0 outline-none">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading font-black text-2xl tracking-tight text-slate-900">User & Owner Voice</h2>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verified Reviews
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {testimonials.map((t, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="rounded-3xl border-slate-100 shadow-sm h-full flex flex-col justify-between">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex gap-1">
                                                    {[...Array(t.rating)].map((_, j) => (
                                                        <Star key={j} className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
                                                    ))}
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{t.comment}"</p>
                                                <div className="pt-4 border-t border-slate-50">
                                                    <p className="font-heading font-bold text-sm text-[#0F3D91]">{t.name}</p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-[#FF7A00]">{t.role}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="install" className="m-0 outline-none">
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                                <div className="space-y-2 relative z-10">
                                    <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">App Installation Guide</h2>
                                    <p className="text-slate-500 text-sm font-medium max-w-lg">
                                        Transform Skitech. into a high-performance app on your home screen for faster access and offline browsing.
                                    </p>
                                </div>
                                <div className="flex gap-3 relative z-10">
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mobile Ready</span>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                        <Laptop className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Desktop Support</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* iOS Guide - High Detail */}
                                <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden group">
                                    <div className="bg-slate-50 p-6 flex flex-col items-center gap-4 text-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 border border-slate-100">
                                            <Apple className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-black text-slate-900">iPhone / iPad</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Official Safari Guide</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#0F3D91] flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    Open <strong>Safari</strong> — other browsers like Chrome won't show the install option on iOS.
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#0F3D91] flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    Tap the <strong>Share</strong> icon (the square with an upward arrow) at the bottom center.
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#0F3D91] flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    Scroll down through the list and tap <strong className="text-[#FF7A00]">"Add to Home Screen"</strong>.
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#0F3D91] flex items-center justify-center text-[10px] font-bold text-white shrink-0">4</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    Tap <strong>"Add"</strong> in the top right corner to confirm.
                                                </p>
                                            </div>
                                            <div className="flex gap-4 pt-2 border-t border-slate-50">
                                                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-normal">
                                                    Check: Skitech. will now appear as an app icon on your home screen.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Android Guide */}
                                <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden group">
                                    <div className="bg-slate-50 p-6 flex flex-col items-center gap-4 text-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#3DDC84]">
                                            <Chrome className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-black text-slate-900">Android</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chrome Browser</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">1</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Open this site in <strong>Google Chrome</strong>.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">2</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Tap the <strong>three dots</strong> in the upper-right corner.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">3</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Tap <strong>"Install App"</strong> or "Add to Home Screen".</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Desktop Guide */}
                                <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden group">
                                    <div className="bg-slate-50 p-6 flex flex-col items-center gap-4 text-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                            <Laptop className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-black text-slate-900">PC & Mac</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chrome / Edge</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">1</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Visit Skitech. on your <strong>PC or Mac</strong> browser.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">2</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Look for the <strong>Install icon</strong> in the address bar (far right).</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">3</div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">Click <strong>"Install"</strong> to add it to your desktop or dock.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ── Action Footer Strip ──────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
                className="mt-10 mb-4 mx-auto w-full"
            >
                <div className="
                    bg-white border border-slate-100/80
                    rounded-[28px] md:rounded-[36px]
                    px-6 md:px-8 py-5
                    shadow-[0_4px_24px_rgb(15,61,145,0.05)]
                    flex flex-col sm:flex-row items-center justify-between gap-4
                    relative overflow-hidden
                ">
                    {/* Ambient orb */}
                    <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#FF7A00]/6 rounded-full blur-3xl pointer-events-none" />

                    {/* Left: label + actions */}
                    <div className="flex flex-col gap-2 items-center sm:items-start">
                        <span
                            className="text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-slate-400"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Feedback & Support
                        </span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFeedbackModal(true)}
                                className="
                                    flex items-center gap-1.5 text-[11px] font-bold
                                    text-[#0F3D91] hover:text-[#FF7A00]
                                    transition-colors duration-200
                                "
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                <Star className="w-3.5 h-3.5" />
                                Leave a Review
                            </button>
                            <div className="h-3 w-px bg-slate-200" />
                            <button
                                onClick={() => {
                                    toast({
                                        title: "Issue Flagged",
                                        description: "Verification team has been notified. We will review this report within 2 hours.",
                                    });
                                }}
                                className="
                                    flex items-center gap-1.5 text-[11px] font-bold
                                    text-slate-400 hover:text-red-500
                                    transition-colors duration-200
                                "
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                <Flag className="w-3.5 h-3.5" />
                                Flag an Issue
                            </button>
                        </div>
                    </div>

                    {/* Right: version badge + CTA */}
                    <div className="flex items-center gap-3">
                        <span
                            className="
                                hidden sm:inline-flex items-center gap-1.5
                                text-[8.5px] font-extrabold uppercase tracking-[0.18em]
                                text-slate-400 bg-slate-50 border border-slate-100
                                px-3 py-1.5 rounded-full
                            "
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Build V.1.1.1
                        </span>
                        <Button
                            className="
                                h-10 px-6 rounded-2xl
                                bg-[#0F3D91] hover:bg-[#FF7A00]
                                text-white font-bold text-[11px] uppercase tracking-widest
                                shadow-md shadow-blue-900/10
                                border-none transition-all duration-200
                            "
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Live Support
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <FeedbackPopup
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    forceOpen={true}
                />
            )}
        </div>
    );
}

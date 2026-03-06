import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, Building2, ShoppingBag,
    HelpCircle, ShieldCheck, Heart, User,
    PlusCircle, CheckCircle2, AlertCircle, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContactDialog } from '@/components/layout/ContactDialog';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 260, damping: 20 }
    }
};

export default function GuidePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-24">
            {/* Header Area */}
            <div className="bg-[#0F3D91] pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <HelpCircle className="w-64 h-64 text-white rotate-12" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-8 group transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest font-heading">Go Back</span>
                    </motion.button>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] text-white/90 font-black uppercase tracking-widest">Interactive Tutorial</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                            MASTER THE <br />
                            <span className="text-[#FF7A00]">SKITECH ECOSYSTEM</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl leading-relaxed">
                            Unlock the full potential of your housing hunting experience. Whether you're a student, tenant, or landlord, we've got you covered.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <motion.nav
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-5xl mx-auto px-4 -mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <GuideCategory
                    title="Guest Users"
                    description="Explore listings and filter your dream home without an account."
                    icon={<EyeIcon />}
                    color="bg-blue-500"
                    steps={[
                        "Browse Houses & Marketplace",
                        "Use Location & Price Filters",
                        "View Popular Neighborhoods",
                        "Access Basic Contact Info"
                    ]}
                />
                <GuideCategory
                    title="Verified Tenants"
                    description="Unlock exclusive features by creating a student/tenant account."
                    icon={<TenantIcon />}
                    color="bg-[#FF7A00]"
                    steps={[
                        "Favorite Houses (Wishlist)",
                        "Get Instant Notifications",
                        "Track Application Status",
                        "Direct Secure Messaging"
                    ]}
                />
                <GuideCategory
                    title="Elite Landlords"
                    description="Manage your property portfolio with ease and reach verified leads."
                    icon={<LandlordIcon />}
                    color="bg-emerald-500"
                    steps={[
                        "Post Houses with Premium UI",
                        "Manage Marketplace Items",
                        "Verify Your Identity (Badge)",
                        "View Analytics & Leads"
                    ]}
                />
            </motion.nav>

            {/* Action Sections */}
            <div className="max-w-5xl mx-auto px-4 mt-20 space-y-24">
                <TutorialSection
                    title="How to Find a House"
                    image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
                    steps={[
                        { id: '01', title: 'Search & Filter', text: 'Use our deep-search tech to filter by distance from Campus, Price, and House Type.' },
                        { id: '02', title: 'Virtual Tour', text: 'Swipe through high-quality photos. Check distance markers and verified amenities.' },
                        { id: '03', title: 'Contact Landlord', text: 'Securely get the landlord\'s phone or WhatsApp directly from the dashboard.' }
                    ]}
                />

                <TutorialSection
                    reversed
                    title="Marketplace Trading"
                    image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
                    steps={[
                        { id: '01', title: 'List Your Items', text: 'Got old furniture or electronics? Post them in seconds for other students to see.' },
                        { id: '02', title: 'Negotiate Safe', text: 'Contact sellers directly. We recommend meeting in public spots around campus.' },
                        { id: '03', title: 'Mark as Sold', text: 'Keep your dashboard clean by marking items as sold once the deal is done.' }
                    ]}
                />
            </div>

            {/* Helpful FAQ Lead */}
            <div className="max-w-4xl mx-auto px-4 mt-32 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF7A00]/5 rounded-full -ml-16 -mt-16 blur-3xl" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-heading font-black text-slate-900">STILL HAVE QUESTIONS?</h2>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Check out our Frequently Asked Questions or reach out to our dedicated support team.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                onClick={() => navigate('/faq')}
                                className="bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
                            >
                                VISIT THE FAQ
                            </Button>
                            <ContactDialog>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest border-slate-200"
                                >
                                    TALK TO SUPPORT
                                </Button>
                            </ContactDialog>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function GuideCategory({ title, description, icon, color, steps }: any) {
    return (
        <motion.div variants={itemVariants}>
            <Card className="h-full border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 group overflow-hidden">
                <div className={`h-2 w-full ${color} opacity-80`} />
                <CardContent className="p-8 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                        {icon}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-heading font-black text-slate-900 uppercase">{title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                    <ul className="space-y-4 pt-4 border-t border-slate-100">
                        {steps.map((step: string) => (
                            <li key={step} className="flex items-start gap-2 group/item">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-[11px] font-bold text-slate-600 group-hover/item:text-[#0F3D91] transition-colors">{step}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function TutorialSection({ title, image, steps, reversed }: any) {
    return (
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
            <div className="flex-1 w-full relative group">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl"
                >
                    <img src={image} className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D91]/60 to-transparent" />
                    <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">Featured Tutorial</span>
                            <h4 className="text-2xl font-heading font-black text-white">{title}</h4>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer border border-white/30"
                        >
                            <Play className="w-5 h-5 fill-white" />
                        </motion.div>
                    </div>
                </motion.div>
                {/* Background glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0F3D91]/20 to-[#FF7A00]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>

            <div className="flex-1 space-y-8">
                <h3 className="text-3xl font-heading font-black text-slate-900 uppercase flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#0F3D91] hidden md:block" />
                    {title}
                </h3>
                <div className="space-y-6">
                    {steps.map((step: any) => (
                        <motion.div
                            key={step.id}
                            initial={{ x: reversed ? 30 : -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex gap-4 group/step"
                        >
                            <span className="text-3xl font-heading font-black text-slate-200 group-hover/step:text-[#FF7A00] transition-colors duration-300">{step.id}</span>
                            <div className="space-y-1">
                                <h5 className="font-heading font-bold text-slate-900 text-lg uppercase">{step.title}</h5>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EyeIcon() { return <Search className="w-6 h-6 text-blue-500" />; }
function TenantIcon() { return <ShieldCheck className="w-6 h-6 text-[#FF7A00]" />; }
function LandlordIcon() { return <Building2 className="w-6 h-6 text-emerald-500" />; }

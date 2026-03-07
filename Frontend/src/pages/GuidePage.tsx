import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ShieldCheck, ShoppingBag, MapPin, Search, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GuidePage = () => {
    const navigate = useNavigate();

    const steps = [
        {
            title: "1. Secure Your Account",
            desc: "Sign up as a User or Property Owner. Verification increases your trust score and visibility.",
            icon: ShieldCheck,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "2. Smart Searching",
            desc: "Use filters to find houses by type, price, or distance from Embu center. Save favorites to your wishlist.",
            icon: Search,
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "3. Direct Communication",
            desc: "Contact landlords or sellers directly via WhatsApp or Phone. No middlemen, no hidden fees.",
            icon: Info,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "4. Closing the Deal",
            desc: "Visit the property in person and verify everything before making any payments.",
            icon: MapPin,
            color: "bg-purple-50 text-purple-600"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-24">
            {/* Hero Header */}
            <div className="bg-[#0F3D91] text-white pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl" />
                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter">
                        System <span className="text-[#FF7A00]">Guide</span>
                    </h1>
                    <p className="text-white/70 max-w-lg mx-auto font-medium">
                        Learn how to navigate the Skitech. ecosystem like a pro and find your next home with ease.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="rounded-[32px] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden h-full">
                                <CardContent className="p-8 space-y-4">
                                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-heading font-black text-[#0F3D91] text-xl uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        {step.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-12 bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7A00]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="space-y-2">
                            <h3 className="font-heading font-black text-2xl text-slate-900">Still have questions?</h3>
                            <p className="text-slate-500 font-medium">Check our Frequently Asked Questions or contact support.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/faq')}
                                className="h-14 px-8 rounded-2xl bg-[#0F3D91] text-white font-heading font-bold hover:bg-[#FF7A00] transition-colors shadow-lg"
                            >
                                Go to FAQ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidePage;

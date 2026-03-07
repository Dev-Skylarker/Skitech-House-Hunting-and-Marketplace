import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, HelpCircle, ChevronRight,
    MessageSquare, ShieldCheck, UserPlus, Home
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ContactDialog } from '@/components/layout/ContactDialog';

const faqs = [
    {
        category: "General",
        questions: [
            {
                q: "How do I get started with Skitech?",
                a: "Simply click on the Account icon in the navigation bar and sign in. You can then choose your role as a Tenant or Landlord to customize your experience."
            },
            {
                q: "Is there a fee to use the platform?",
                a: "For students and tenants, browsing and contacting landlords is completely free. Basic marketplace listings are also free."
            }
        ]
    },
    {
        category: "For Tenants",
        questions: [
            {
                q: "Are the house listings verified?",
                a: "We have a dedicated verification team that checks the legitimacy of listings. Look for the 'Verified' badge on house cards for 100% confidence."
            },
            {
                q: "Can I save houses to view later?",
                a: "Yes! Use the heart icon on any house card to add it to your Wishlist. You can access your saved items from the 'Wishlist' tab in the navigation bar."
            }
        ]
    },
    {
        category: "For Landlords",
        questions: [
            {
                q: "How do I list my property?",
                a: "Once you create a Landlord account, go to your dashboard and select 'Post New House'. Follow the standardized form to ensure your listing looks professional."
            },
            {
                q: "How can I see who is interested in my houses?",
                a: "You will receive real-time notifications whenever someone favorites your house or views your listing multiple times."
            }
        ]
    }
];

export default function FAQPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-14 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
                <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0F3D91] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest font-heading">Go Back</span>
                    </motion.button>

                    <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 leading-tight uppercase tracking-tight">
                        Frequently Asked <br />
                        <span className="text-[#0F3D91]">Questions</span>
                    </h1>
                    <p className="text-slate-600 font-medium max-w-lg mx-auto leading-relaxed text-sm">
                        Everything you need to know about navigating the Skitech ecosystem. Can't find an answer? Talk to us.
                    </p>

                    <div className="relative max-w-md mx-auto mt-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search for an answer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="max-w-3xl mx-auto px-6 mt-12 space-y-12">
                {faqs.map((cat, idx) => (
                    <motion.div
                        key={cat.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#FF7A00] ml-2">
                            {cat.category}
                        </h3>

                        <Accordion type="single" collapsible className="space-y-3">
                            {cat.questions.map((q, qIdx) => (
                                <AccordionItem
                                    key={qIdx}
                                    value={`${idx}-${qIdx}`}
                                    className="bg-white border border-slate-100 rounded-[24px] px-6 shadow-sm overflow-hidden"
                                >
                                    <AccordionTrigger className="hover:no-underline py-5 text-left font-heading font-bold text-slate-800 hover:text-[#0F3D91] transition-colors">
                                        {q.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 leading-relaxed font-medium pb-6 pt-2">
                                        {q.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                ))}
            </div>

            {/* Support CTA */}
            <div className="max-w-3xl mx-auto px-6 mt-24">
                <div className="bg-[#0F3D91] rounded-[40px] p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <h2 className="text-2xl font-heading font-black text-white">STILL NEED HELP?</h2>
                    <p className="text-blue-100/70 text-sm max-w-sm mx-auto leading-relaxed">
                        Our support experts are available 24/7 to help you with any platform-related issues.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <ContactDialog>
                            <Button
                                className="w-full sm:w-auto bg-[#FF7A00] hover:bg-orange-600 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
                            >
                                CHAT WITH US
                            </Button>
                        </ContactDialog>
                        <ContactDialog>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                SEND AN EMAIL
                            </Button>
                        </ContactDialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

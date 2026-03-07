import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Home, MapPin, DollarSign, MessageSquare, Mail, Phone, ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BackButton } from '../components/ui/BackButton';

const InquiryPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'houses');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Request Sent!",
                description: `We've received your ${activeTab === 'houses' ? 'house' : 'item'} request and will notify you when a match is found.`,
            });
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
                    <BackButton />

                    <h1 className="font-heading font-black text-[#0F3D91] text-3xl md:text-4xl leading-tight uppercase tracking-tighter">
                        Tell us what <span className="text-[#FF7A00]">you need</span>
                    </h1>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                        Can't find exactly what you're looking for? Let our community know and we'll help you find it.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full max-w-[400px] mx-auto mb-8 bg-slate-100 p-1.5 rounded-2xl h-14">
                        <TabsTrigger value="houses" className="rounded-xl font-heading font-bold text-xs uppercase tracking-widest data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white">
                            <Home className="w-4 h-4 mr-2" />
                            Houses
                        </TabsTrigger>
                        <TabsTrigger value="items" className="rounded-xl font-heading font-bold text-xs uppercase tracking-widest data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Marketplace
                        </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit}>
                        <TabsContent value="houses">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required type="email" placeholder="eg. your@email.com" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required type="tel" placeholder="eg. 0712 345 678" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Preferred Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required placeholder="eg. Kangaru, Mutunduri" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">House Type</label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required placeholder="eg. Bedsitter, 1 Bedroom" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Price Range (Ksh)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input required placeholder="eg. 5,000 - 8,000" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Specific House Requirements</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                        <Textarea
                                            placeholder="eg. Need a room with constant water supply, secure gate, and near the stage..."
                                            className="pl-10 rounded-2xl min-h-[120px] bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 pt-3"
                                        />
                                    </div>
                                </div>

                                <Button disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-[#0F3D91] hover:bg-[#FF7A00] text-white font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                                    {isSubmitting ? "Sending Request..." : "Post House Request"}
                                </Button>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="items">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required type="email" placeholder="eg. your@email.com" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required type="tel" placeholder="eg. 0712 345 678" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Item Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required placeholder="eg. Electronics, Furniture" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Condition Basis</label>
                                        <div className="relative">
                                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input required placeholder="eg. New, Slightly Used" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Budget Range (Ksh)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input required placeholder="eg. 2,000 - 4,000" className="pl-10 rounded-2xl h-12 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Describe the Item</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                        <Textarea
                                            placeholder="eg. Looking for a study table with a drawer and a chair. Preferably around Main Gate..."
                                            className="pl-10 rounded-2xl min-h-[120px] bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 pt-3"
                                        />
                                    </div>
                                </div>

                                <Button disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-[#FF7A00] hover:bg-[#0F3D91] text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-500/10 transition-all active:scale-95">
                                    {isSubmitting ? "Sending Request..." : "Post Item Request"}
                                </Button>
                            </motion.div>
                        </TabsContent>
                    </form>
                </Tabs>

                <div className="mt-8 text-center bg-[#0F3D91]/5 p-6 rounded-[24px] border border-slate-100">
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Your request will be broadcasted to our sellers and landlords. <br />
                        We will notify you immediately when a match is available.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InquiryPage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Info, ChevronRight, Scale } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LegalPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'terms', label: 'Terms of Service', icon: Scale },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-slate-400 hover:text-[#0F3D91] transition-colors mx-auto text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <ArrowLeft className="w-3 h-3" /> Go Back
                    </button>

                    <h1 className="font-heading font-black text-[#0F3D91] text-3xl md:text-4xl leading-tight uppercase tracking-tighter">
                        Legal & <span className="text-[#FF7A00]">Information</span>
                    </h1>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                        Everything you need to know about Skitech.'s mission, policies, and our commitment to your safety.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex-1 min-w-[120px] h-14 rounded-2xl bg-white border border-slate-100 data-[state=active]:bg-[#0F3D91] data-[state=active]:text-white shadow-sm transition-all"
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                <span className="font-heading font-bold text-xs uppercase tracking-widest">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabsContent value="about" className="mt-0">
                                <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7A00] mb-2 block">Our goal</span>
                                        <h2 className="font-heading font-black text-[#0F3D91] text-2xl uppercase tracking-tight">Mission Statement</h2>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            The Skitech. ecosystem provides a unified platform for people to find perfect housing and trade marketplace items with ease.
                                            This system is designed to eliminate the friction in residential relocation and foster a trusted local trade community.
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium pt-4">
                                            Managed by <a href="#" className="text-[#FF7A00] font-bold hover:underline">Skitech solutions</a>.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        <div className="p-6 rounded-3xl bg-[#0F3D91]/5 border border-blue-100/50">
                                            <h3 className="font-heading font-bold text-[#0F3D91] mb-2 uppercase text-xs tracking-widest">For Seekers</h3>
                                            <p className="text-slate-500 text-sm font-medium">Verified listings, secure communication, and a community marketplace that understands your needs.</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-[#FF7A00]/5 border border-orange-100/50">
                                            <h3 className="font-heading font-bold text-[#FF7A00] mb-2 uppercase text-xs tracking-widest">For Providers</h3>
                                            <p className="text-slate-500 text-sm font-medium">Direct reach to thousands of users, professional dashboard tools, and verified identity systems.</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50">
                                        <div className="flex items-center justify-between p-6 rounded-[24px] bg-slate-50 group hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/contact')}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0F3D91]">
                                                    <Info className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-heading font-bold text-slate-900 text-sm">Have more questions?</h4>
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Contact our team</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </section>
                            </TabsContent>

                            <TabsContent value="terms" className="mt-0">
                                <article className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                                    <h2 className="font-heading font-black text-[#0F3D91] text-2xl uppercase tracking-tight mb-8">Terms of Service</h2>
                                    <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                                        <p>By using Skitech, you agree to abide by our community standards and service terms. This platform serves as a connector between users for residential relocation properties within Embu.</p>

                                        <h3 className="text-slate-900 font-bold uppercase text-sm tracking-widest">1. Residential Verification</h3>
                                        <p>All owners must provide accurate proof of property ownership or authorized estate management documentation before their listing is publicly visible.</p>

                                        <h3 className="text-slate-900 font-bold uppercase text-sm tracking-widest">2. Relocation Regulations</h3>
                                        <p>As per the standard residential relocation policies in Embu Municipality, a standard of 1-month rent deposit is acceptable. Skitech does not facilitate direct rental payments and cautions users against sending money prior to viewing the physical property and signing the official tenancy agreement.</p>

                                        <h3 className="text-slate-900 font-bold uppercase text-sm tracking-widest">3. Content Accuracy & Inspections</h3>
                                        <p>While we physically vet coordinates and listings, tenants must perform their own due diligence, inspect the plumbing, lighting, and security conditions before accepting the keys.</p>
                                    </div>
                                </article>
                            </TabsContent>

                            <TabsContent value="privacy" className="mt-0">
                                <article className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                                    <h2 className="font-heading font-black text-[#0F3D91] text-2xl uppercase tracking-tight mb-8">Privacy Policy</h2>
                                    <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                                        <p>Your privacy is paramount. Skitech adheres to strict data protection principles.</p>

                                        <h3 className="text-slate-900 font-bold uppercase text-sm tracking-widest">Data We Collect</h3>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Basic profile info (Name, Email, Contact)</li>
                                            <li>Listing data (Images, coordinates, descriptions)</li>
                                            <li>Interaction history for trust metrics</li>
                                        </ul>

                                        <h3 className="text-slate-900 font-bold uppercase text-sm tracking-widest">Security Measure</h3>
                                        <p>Your contact details are encrypted and only shared with verified parties during active inquiries.</p>
                                    </div>
                                </article>
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
};

export default LegalPage;

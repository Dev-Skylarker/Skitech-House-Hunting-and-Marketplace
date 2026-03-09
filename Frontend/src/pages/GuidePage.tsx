import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, ShieldCheck, ShoppingBag, MapPin, Search, CheckCircle2, Info, ChevronDown, ChevronUp, User, Home, Phone, Mail, Star, Filter, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GuidePage = () => {
    const navigate = useNavigate();
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    const steps = [
        {
            title: "1. Secure Your Account",
            desc: "Sign up as a User or Property Owner. Verification increases your trust score and visibility.",
            icon: ShieldCheck,
            color: "bg-blue-50 text-blue-600",
            detailedSteps: [
                {
                    title: "Creating Your Account",
                    icon: User,
                    content: "Visit the signup page and choose your role: Tenant for house hunting or Landlord for listing properties. Fill in your personal details including name, email, and phone number for verification."
                },
                {
                    title: "Email Verification",
                    icon: Mail,
                    content: "Check your email for a verification link. Click the link to verify your account and unlock full platform features. Verified accounts get priority in searches."
                },
                {
                    title: "Profile Setup",
                    icon: Star,
                    content: "Complete your profile with a profile picture, bio, and preferences. A complete profile builds trust with landlords and other users."
                },
                {
                    title: "Security Settings",
                    icon: ShieldCheck,
                    content: "Enable two-factor authentication and set a strong password. Review privacy settings to control who can see your information."
                }
            ]
        },
        {
            title: "2. Smart Searching",
            desc: "Use filters to find houses by type, price, or distance from Embu center. Save favorites to your wishlist.",
            icon: Search,
            color: "bg-orange-50 text-orange-600",
            detailedSteps: [
                {
                    title: "Using Search Filters",
                    icon: Filter,
                    content: "Navigate to the Houses page and use filters to narrow down options. Filter by house type (bedsitter, 1BR, 2BR), price range, location, and amenities."
                },
                {
                    title: "Understanding Listings",
                    icon: Home,
                    content: "Each listing shows photos, price, deposit, amenities, and landlord contact info. Look for verified badges and high ratings for trustworthy listings."
                },
                {
                    title: "Saving Favorites",
                    icon: Heart,
                    content: "Click the heart icon on listings you like to save them to your wishlist. Access your saved items anytime from the Saved page."
                },
                {
                    title: "Contacting Landlords",
                    icon: Phone,
                    content: "Use the provided WhatsApp or phone numbers to contact landlords directly. Ask about availability, viewing times, and specific requirements."
                }
            ]
        },
        {
            title: "3. Direct Communication",
            desc: "Contact landlords or sellers directly via WhatsApp or Phone. No middlemen, no hidden fees.",
            icon: Info,
            color: "bg-green-50 text-green-600",
            detailedSteps: [
                {
                    title: "Preparing Questions",
                    icon: MessageCircle,
                    content: "Prepare a list of questions about the property: availability, move-in date, utilities included, pet policies, and lease terms."
                },
                {
                    title: "Scheduling Viewings",
                    icon: Phone,
                    content: "Call or message landlords to schedule property viewings. Always visit properties in person before making any decisions or payments."
                },
                {
                    title: "Negotiation Tips",
                    icon: Star,
                    content: "Discuss rent amounts, payment schedules, and any additional fees. Be respectful but clear about your requirements and budget constraints."
                },
                {
                    title: "Safety First",
                    icon: ShieldCheck,
                    content: "Always meet landlords in public places first. Never send money without seeing the property and signing a proper lease agreement."
                }
            ]
        },
        {
            title: "4. Closing the Deal",
            desc: "Visit the property in person and verify everything before making any payments.",
            icon: MapPin,
            color: "bg-purple-50 text-purple-600",
            detailedSteps: [
                {
                    title: "Property Inspection",
                    icon: Home,
                    content: "Thoroughly inspect the property: check water pressure, electricity, security, and overall condition. Take photos for documentation."
                },
                {
                    title: "Understanding Lease Terms",
                    icon: Info,
                    content: "Read the lease agreement carefully. Understand rent amount, due date, deposit requirements, and house rules before signing."
                },
                {
                    title: "Payment Process",
                    icon: Star,
                    content: "Clarify payment methods and schedules. Usually requires first month's rent plus deposit. Get receipts for all payments made."
                },
                {
                    title: "Move-in Preparation",
                    icon: CheckCircle2,
                    content: "Plan your move-in date, arrange utilities transfer, and document property condition with photos before moving in."
                }
            ]
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
                            <Card 
                                className={`rounded-[32px] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 ${
                                    expandedStep === idx ? 'ring-2 ring-[#0F3D91]' : ''
                                }`}
                                onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                            >
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center`}>
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0F3D91]">
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                {expandedStep === idx ? 'Click to collapse' : 'Click to expand'}
                                            </span>
                                            {expandedStep === idx ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="font-heading font-black text-[#0F3D91] text-xl uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        {step.desc}
                                    </p>
                                    
                                    <AnimatePresence>
                                        {expandedStep === idx && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="pt-4 border-t border-slate-100"
                                            >
                                                <div className="space-y-4">
                                                    {step.detailedSteps.map((detailedStep, stepIdx) => (
                                                        <motion.div
                                                            key={stepIdx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: stepIdx * 0.1 }}
                                                            className="flex gap-3 p-3 bg-slate-50 rounded-xl"
                                                        >
                                                            <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                                                                <detailedStep.icon className="w-4 h-4" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="font-bold text-slate-900 text-sm">
                                                                    {detailedStep.title}
                                                                </h4>
                                                                <p className="text-slate-600 text-xs leading-relaxed">
                                                                    {detailedStep.content}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Simple Info Section - No Actions */}
                <div className="mt-12 bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7A00]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="text-center space-y-4 relative z-10">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                            <BookOpen className="w-8 h-8 text-[#0F3D91]" />
                        </div>
                        <h3 className="font-heading font-black text-2xl text-slate-900">Need More Help?</h3>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                            Browse through our comprehensive Help Center for detailed guides, FAQs, and support options. 
                            Our team is always ready to assist you in finding the perfect home.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-400 pt-4">
                            <span>Interactive Guide</span>
                            <span>•</span>
                            <span>Step-by-Step Instructions</span>
                            <span>•</span>
                            <span>Expert Tips</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidePage;

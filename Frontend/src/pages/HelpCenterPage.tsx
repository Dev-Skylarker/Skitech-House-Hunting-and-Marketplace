import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, HelpCircle, BookOpen, UserCircle,
    ShieldAlert, Info, MessageSquare, Star, Flag,
    ChevronRight, ExternalLink, ShieldCheck, CheckCircle2, RotateCcw, Download,
    Smartphone, Laptop, Apple, Chrome, Mail, Phone, Headphones, CheckSquare, Square
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackPopup } from '../components/FeedbackPopup';
import { emailjsService } from '@/services/emailjsService';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '../components/ui/BackButton';

const helpCategories = [
    {
        id: 'guide',
        title: 'System Guide',
        icon: BookOpen,
        items: [
            { 
                id: 'getting-started',
                title: 'Getting Started', 
                desc: 'New to Skitech? Learn the basics of finding your first home.',
                action: 'guide'
            },
            { 
                id: 'listing-items',
                title: 'Listing Items', 
                desc: 'How to post items on the community marketplace efficiently.',
                action: 'guide'
            },
            { 
                id: 'safety-tips',
                title: 'Safety Tips', 
                desc: 'Secure your transactions and avoid common housing scams.',
                action: 'guide'
            },
            { 
                id: 'payment-options',
                title: 'Payment Options', 
                desc: 'Understanding deposit handling and monthly rent payments.',
                action: 'guide'
            },
        ]
    },
    {
        id: 'account',
        title: 'Account Guide',
        icon: UserCircle,
        items: [
            { 
                id: 'verification',
                title: 'Verification', 
                desc: 'How to get your user or property owner profile verified.',
                action: 'guide'
            },
            { 
                id: 'profile-settings',
                title: 'Profile Settings', 
                desc: 'Managing your contacts, bio, and location details.',
                action: 'guide'
            },
            { 
                id: 'notifications',
                title: 'Notifications', 
                desc: 'Configuring alerts for new house matches or messages.',
                action: 'guide'
            },
        ]
    },
    {
        id: 'legal',
        title: 'Usage Policy',
        icon: ShieldCheck,
        items: [
            { 
                id: 'terms',
                title: 'Terms of Use', 
                desc: 'The rules of engagement within our residential ecosystem.',
                action: 'link',
                link: '/terms'
            },
            { 
                id: 'privacy',
                title: 'Privacy Policy', 
                desc: 'How we protect your personal and browsing data.',
                action: 'link',
                link: '/privacy'
            },
            { 
                id: 'listing-standards',
                title: 'Listing Standards', 
                desc: 'Minimum requirements for house images and descriptions.',
                action: 'guide'
            },
        ]
    }
];

const supportOptions = [
    {
        id: 'ask-question',
        title: 'Ask a Question',
        desc: 'Get personalized help from our support team',
        icon: MessageSquare,
        color: 'bg-[#0F3D91]',
        action: 'email'
    },
    {
        id: 'call-support',
        title: 'Call Support',
        desc: 'Speak directly with our customer service team',
        icon: Phone,
        color: 'bg-[#FF7A00]',
        action: 'phone'
    },
    {
        id: 'live-chat',
        title: 'Live Chat',
        desc: 'Chat with us in real-time for immediate assistance',
        icon: Headphones,
        color: 'bg-green-600',
        action: 'chat'
    }
];

const downloadOptions = [
    {
        id: 'android',
        title: 'Android App',
        desc: 'Download from Google Play Store',
        icon: Smartphone,
        color: 'bg-green-600'
    },
    {
        id: 'ios',
        title: 'iOS App',
        desc: 'Download from Apple App Store',
        icon: Apple,
        color: 'bg-gray-800'
    },
    {
        id: 'web',
        title: 'Web Version',
        desc: 'Access from any browser',
        icon: Laptop,
        color: 'bg-blue-600'
    }
];

export default function HelpCenterPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('guide');
    const [showFeedback, setShowFeedback] = useState(false);

    // Handle hash navigation for direct tab access
    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove the # symbol
        if (hash && ['guide', 'support', 'report', 'safety', 'policies', 'download'].includes(hash)) {
            setActiveTab(hash);
        }
    }, []);

    const handleAction = async (item: any) => {
        switch (item.action) {
            case 'email':
                setShowFeedback(true);
                break;
            case 'phone':
                // Phone action - could open dialer or show phone number
                toast({
                    title: "Support Phone",
                    description: "Call us at: +254 XXX XXX XXX",
                });
                break;
            case 'chat':
                toast({
                    title: "Live Chat",
                    description: "Chat feature coming soon!",
                });
                break;
            case 'link':
                if (item.link) {
                    navigate(item.link);
                }
                break;
            case 'guide':
                // Navigate to specific guide section
                navigate(`/help#${item.id}`);
                break;
            default:
                break;
        }
    };

    const handleSendEmail = async (data: { name: string; email: string; message: string }) => {
        try {
            const response = await emailjsService.sendSupportTicketEmail(
                data.name,
                data.email,
                data.message
            );
            if (response.success) {
                toast({
                    title: "Support Request Sent",
                    description: "We'll get back to you within 24 hours.",
                });
                setShowFeedback(false);
            } else {
                toast({
                    title: "Failed to Send",
                    description: response.error || "Please try again later.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send support request. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="px-4 py-6 bg-[#F7F9FC] min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <BackButton />
                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#0F3D91] rounded-full flex items-center justify-center mb-2 shadow-lg">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-heading font-semibold text-2xl">Help Center</h1>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); }}>
                <div className="flex items-center justify-between gap-2 mb-4">
                    <TabsList className="bg-muted/50 p-1 h-11 flex-1 overflow-x-auto">
                        <TabsTrigger value="guide" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Guides
                        </TabsTrigger>
                        <TabsTrigger value="support" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <Headphones className="w-4 h-4 mr-2" />
                            Support
                        </TabsTrigger>
                        <TabsTrigger value="report" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <Flag className="w-4 h-4 mr-2" />
                            Report Issue
                        </TabsTrigger>
                        <TabsTrigger value="safety" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Safety
                        </TabsTrigger>
                        <TabsTrigger value="policies" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Policies
                        </TabsTrigger>
                        <TabsTrigger value="download" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF7A00] whitespace-nowrap">
                            <Download className="w-4 h-4 mr-2" />
                            System Manual
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Guides Tab - Now Empty */}
                <TabsContent value="guide" className="mt-6">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2">Coming Soon</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Comprehensive guides are being moved to a better location. Check the Download tab for helpful resources.
                        </p>
                    </div>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {supportOptions.map((option) => (
                            <Card key={option.id} className="rounded-xl border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center text-white", option.color)}>
                                            <option.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-heading font-semibold text-lg text-slate-900">{option.title}</h3>
                                        <p className="text-sm text-slate-600">{option.desc}</p>
                                        <Button
                                            onClick={() => handleAction(option)}
                                            className={cn("w-full rounded-xl font-medium", option.color)}
                                        >
                                            {option.action === 'email' && 'Send Message'}
                                            {option.action === 'phone' && 'Call Now'}
                                            {option.action === 'chat' && 'Start Chat'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="rounded-xl border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-lg text-slate-900 mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-900 mb-2">How do I verify my account?</h4>
                                    <p className="text-sm text-slate-600">Go to Profile Settings and click "Verify Account" to start the verification process.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-900 mb-2">Is the marketplace safe?</h4>
                                    <p className="text-sm text-slate-600">Yes! We verify all users and listings. Always meet in safe public places for transactions.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-900 mb-2">How do I report an issue?</h4>
                                    <p className="text-sm text-slate-600">Use the "Ask a Question" button above or email support@skitech.com.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Report Issue Tab */}
                <TabsContent value="report" className="mt-6">
                    <Card className="rounded-xl border-slate-100 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-xl text-slate-900 mb-2">Report an Issue</h3>
                            <p className="text-slate-600 mb-6">Help us improve by reporting bugs, inappropriate content, or system issues.</p>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button 
                                        variant="outline" 
                                        className="h-auto p-4 flex-col items-start text-left"
                                        onClick={() => setShowFeedback(true)}
                                    >
                                        <Flag className="w-5 h-5 text-red-600 mb-2" />
                                        <div>
                                            <h4 className="font-medium text-slate-900">Report Bug</h4>
                                            <p className="text-sm text-slate-600">Technical issues or errors</p>
                                        </div>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="h-auto p-4 flex-col items-start text-left"
                                        onClick={() => setShowFeedback(true)}
                                    >
                                        <ShieldAlert className="w-5 h-5 text-orange-600 mb-2" />
                                        <div>
                                            <h4 className="font-medium text-slate-900">Report Content</h4>
                                            <p className="text-sm text-slate-600">Inappropriate listings or users</p>
                                        </div>
                                    </Button>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <h4 className="font-heading font-medium text-blue-900">Response Time</h4>
                                            <p className="text-sm text-blue-800">We review all reports within 24 hours and take appropriate action.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Safety Tab */}
                <TabsContent value="safety" className="mt-6">
                    <Card className="rounded-xl border-slate-100 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-xl text-slate-900 mb-2">Safety & Quality</h3>
                            <p className="text-slate-600 mb-6">Learn how to stay safe and maintain quality standards on our platform.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <ShieldCheck className="w-8 h-8 text-green-600 mb-3" />
                                        <h4 className="font-medium text-slate-900 mb-2">Verification Process</h4>
                                        <p className="text-sm text-slate-600 mb-3">How we verify property owners and ensure authenticity.</p>
                                        <Button variant="link" className="p-0 h-auto text-sm">Learn More →</Button>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <ShieldAlert className="w-8 h-8 text-orange-600 mb-3" />
                                        <h4 className="font-medium text-slate-900 mb-2">Scam Prevention</h4>
                                        <p className="text-sm text-slate-600 mb-3">Tips to avoid common housing and marketplace scams.</p>
                                        <Button variant="link" className="p-0 h-auto text-sm">View Tips →</Button>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <CheckCircle2 className="w-8 h-8 text-blue-600 mb-3" />
                                        <h4 className="font-medium text-slate-900 mb-2">Quality Standards</h4>
                                        <p className="text-sm text-slate-600 mb-3">Requirements for property listings and item descriptions.</p>
                                        <Button variant="link" className="p-0 h-auto text-sm">See Standards →</Button>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <MessageSquare className="w-8 h-8 text-purple-600 mb-3" />
                                        <h4 className="font-medium text-slate-900 mb-2">Safe Communication</h4>
                                        <p className="text-sm text-slate-600 mb-3">Best practices for communicating with landlords and sellers.</p>
                                        <Button variant="link" className="p-0 h-auto text-sm">Get Guidelines →</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Policies Tab */}
                <TabsContent value="policies" className="mt-6">
                    <Card className="rounded-xl border-slate-100 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-xl text-slate-900 mb-2">Policies & Guidelines</h3>
                            <p className="text-slate-600 mb-6">Review our platform policies and community guidelines.</p>
                            
                            <div className="space-y-4">
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <h4 className="font-medium text-slate-900">Terms of Service</h4>
                                                    <p className="text-sm text-slate-600">Rules and guidelines for using our platform</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigate('/terms')}>
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <h4 className="font-medium text-slate-900">Privacy Policy</h4>
                                                    <p className="text-sm text-slate-600">How we protect and handle your data</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigate('/privacy')}>
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="border-slate-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Star className="w-5 h-5 text-yellow-600" />
                                                <div>
                                                    <h4 className="font-medium text-slate-900">Community Guidelines</h4>
                                                    <p className="text-sm text-slate-600">Behavior expectations and community standards</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Download Tab */}
                <TabsContent value="download" className="mt-6">
                    {/* Original Download Content */}
                    <Card className="rounded-xl border-slate-100 shadow-sm mb-6">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-xl text-slate-900 mb-2">Download Skitech App</h3>
                            <p className="text-slate-600 mb-6">Get the full Skitech experience on your mobile device. Access houses, marketplace, and more on the go.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {downloadOptions.map((option) => (
                                    <div key={option.id} className="text-center p-4 border border-slate-200 rounded-xl">
                                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white mx-auto mb-3", option.color)}>
                                            <option.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-heading font-medium text-slate-900 mb-1">{option.title}</h4>
                                        <p className="text-xs text-slate-600 mb-3">{option.desc}</p>
                                        <Button variant="outline" size="sm" className="rounded-lg text-xs">
                                            Coming Soon
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    <h4 className="font-heading font-medium text-blue-900">Installation Guide</h4>
                                </div>
                                <p className="text-sm text-blue-800 mb-3">
                                    Need help installing the app? Check our comprehensive installation guide with step-by-step instructions for all devices.
                                </p>
                                <Button 
                                    variant="link" 
                                    className="text-blue-600 p-0 h-auto text-sm font-medium"
                                    onClick={() => navigate('/help#installation-guide')}
                                >
                                    View Installation Guide →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Moved Guide Content */}
                    <div className="space-y-6 pb-10">
                        <div className="text-center mb-8">
                            <h3 className="font-heading font-semibold text-2xl text-slate-900 mb-2">System Guide</h3>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Everything you need to know about using Skitech effectively
                            </p>
                        </div>
                        
                        {helpCategories.map((category) => (
                            <div key={category.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#0F3D91] flex items-center justify-center text-white">
                                            <category.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-heading font-semibold text-lg text-slate-900">{category.title}</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3"
                                            onClick={() => handleAction(item)}
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-heading font-medium text-slate-900 mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-600">{item.desc}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Feedback Popup */}
            <FeedbackPopup
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
                onSubmit={handleSendEmail}
                title="Contact Support"
                description="How can we help you today?"
            />
        </div>
    );
}

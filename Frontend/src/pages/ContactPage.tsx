import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MessageSquare, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { emailjsService } from '@/services/emailjsService';

import { BackButton } from '../components/ui/BackButton';

const ContactPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill user data if authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [isAuthenticated, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email",
                description: "Please provide a valid email address.",
                variant: "destructive",
            });
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
                toast({
                    title: "Support Ticket Sent!",
                    description: "Our support team will get back to you within 2-4 hours.",
                });
                setFormData({
                    name: isAuthenticated ? user?.name || '' : '',
                    email: isAuthenticated ? user?.email || '' : '',
                    subject: '',
                    message: ''
                });
                navigate('/');
            } else {
                toast({
                    title: "Failed to Send",
                    description: response.error || "Please try again later.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Support ticket error:', error);
            toast({
                title: "Error",
                description: "Failed to send support ticket. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-14 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F3D91]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                <div className="max-w-3xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
                    <BackButton />

                    <h1 className="font-heading font-black text-[#0F3D91] text-3xl md:text-4xl leading-tight uppercase tracking-tighter">
                        Contact <span className="text-[#FF7A00]">Support</span>
                    </h1>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                        Need help with your listing or finding a home? Our team is available 24/7 for all users and property owners.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0F3D91]">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-slate-900 text-sm tracking-tight uppercase">Email Us</h4>
                                    <p className="text-xs text-slate-500 font-medium">support@skitech.ac.ke</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-slate-900 text-sm tracking-tight uppercase">WhatsApp</h4>
                                    <p className="text-xs text-slate-500 font-medium">+254 756 789 012</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF7A00]">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-slate-900 text-sm tracking-tight uppercase">Call Line</h4>
                                    <p className="text-xs text-slate-500 font-medium">+254 798 123 456</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Embu, Near UoEM Main Gate</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="rounded-[40px] border-none shadow-xl shadow-blue-900/5 bg-white overflow-hidden">
                        <CardContent className="p-8 md:p-12 space-y-8">
                            <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Send a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <Input 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required 
                                            placeholder="eg. John Doe" 
                                            className="h-12 border-slate-100 rounded-xl bg-slate-50 transition-all focus:bg-white" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <Input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required 
                                            type="email" 
                                            placeholder="eg. john@student.uoem.ac.ke" 
                                            className="h-12 border-slate-100 rounded-xl bg-slate-50 transition-all focus:bg-white" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                    <Input 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required 
                                        placeholder="eg. Issue with my listing" 
                                        className="h-12 border-slate-100 rounded-xl bg-slate-50 transition-all focus:bg-white" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message Detail</label>
                                    <Textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required 
                                        placeholder="Describe your issue in detail..." 
                                        className="min-h-[150px] border-slate-100 rounded-xl bg-slate-50 transition-all focus:bg-white p-4" 
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-2xl font-heading font-black uppercase tracking-widest shadow-lg shadow-blue-900/10 transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" /> Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

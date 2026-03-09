import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Home, Users, Zap, Star, ArrowRight, Mail, Phone, MapPin, 
    Facebook, Twitter, Instagram, Linkedin, ChevronRight, Info, CheckCircle, Smartphone, Shield, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { usePWA } from '@/hooks/usePWA';
import { Typewriter } from '@/components/ui/Typewriter';

export function GlobalFooter() {
    const { isInstallable, isInstalled, install } = usePWA();
    const { toast } = useToast();

    // Detect iOS devices
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };

    const isIOSDevice = isIOS();

    const handleInstallClick = async () => {
        if (isInstalled) {
            toast({
                title: "Already Installed",
                description: "Skitech app is already installed on your device.",
            });
            return;
        }

        if (isIOSDevice) {
            // For iOS, always show installation guide since PWA install prompt is limited
            window.location.href = '/help#installation-guide';
            return;
        }

        if (isInstallable) {
            const success = await install();
            if (success) {
                toast({
                    title: "Installation Started!",
                    description: "Skitech app is being installed on your device.",
                });
            } else {
                toast({
                    title: "Installation Cancelled",
                    description: "You can install the app later from your browser menu.",
                });
            }
        } else {
            // Fallback to installation guide
            window.location.href = '/help#installation-guide';
        }
    };

    return (
        <footer id="global-footer" className="bg-gradient-to-br from-slate-50 to-blue-50 px-4 md:px-6 py-8 w-full relative z-10">
            <div className="max-w-[1200px] mx-auto w-full space-y-8">
                
                {/* Why Choose Us Section */}
                <div className="text-center mb-8">
                    <h2 className="font-heading font-semibold text-2xl md:text-3xl text-slate-900 mb-4">
                        Why Choose Skitech?
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
                        Experience the future of house hunting and marketplace interactions. 
                        Trusted by thousands of users across Embu with verified listings and secure transactions.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-heading font-medium text-slate-900 mb-2">Verified Listings</h3>
                        <p className="text-xs text-slate-600">All properties and items are verified for your safety</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-heading font-medium text-slate-900 mb-2">Trusted Community</h3>
                        <p className="text-xs text-slate-600">Join thousands of verified users in our ecosystem</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Zap className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-heading font-medium text-slate-900 mb-2">Fast Response & Approvals</h3>
                        <p className="text-xs text-slate-600">Quick processing and timely responses to your requests</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-heading font-medium text-slate-900 mb-2">Premium Support</h3>
                        <p className="text-xs text-slate-600">24/7 customer support for all your needs</p>
                    </div>
                </div>

                {/* App Download CTA Section - Hidden when app is installed */}
                {!isInstalled && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
                    
                    <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <Download className="w-8 h-8" />
                            </div>
                        </div>
                        
                        <h3 className="font-heading font-semibold text-2xl md:text-3xl mb-3">
                            Get the Skitech App
                        </h3>
                        <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">
                            Take your house hunting and marketplace experience anywhere. 
                            Install our app for exclusive features, offline access, and instant notifications.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            {!isIOSDevice && (
                                <Button 
                                    onClick={handleInstallClick}
                                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition-all duration-300"
                                >
                                    <Smartphone className="w-4 h-4 mr-2" />
                                    {isInstallable ? 'Install App' : 'Download App'}
                                </Button>
                            )}
                            <Button 
                                variant="link" 
                                className="text-blue-100 hover:text-white p-0 h-auto text-sm font-medium underline-offset-4"
                                onClick={() => {
                                    const helpSection = document.getElementById('help');
                                    if (helpSection) {
                                        helpSection.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.location.href = '/help#installation-guide';
                                    }
                                }}
                            >
                                View Installation Guide
                            </Button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-6 text-xs text-blue-200">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Safe & Free to download</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>iOS Android & desktop</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>4.8★ Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Mission & Links Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mission */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                <Info className="w-5 h-5" />
                            </div>
                            <h3 className="font-heading font-semibold text-lg text-slate-900">
                                Our Mission
                            </h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            Redefining house-hunting and marketplace interactions with transparency, safety, and verified listings. 
                            Skitech connects you to quality spaces and shared resources through a trusted digital ecosystem.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/terms" 
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <Link 
                                to="/privacy" 
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* Quick Help */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        
                        <div className="relative z-10">
                            <h3 className="font-heading font-semibold text-lg mb-3">
                                Need Help?
                            </h3>
                            <div className="text-white/90 font-medium mb-4 text-sm leading-relaxed">
                                <Typewriter
                                    texts={[
                                        "Check our system guide?",
                                        "Have safety concerns?",
                                        "Looking for verified houses?",
                                        "Need to sell something?"
                                    ]}
                                    delay={100}
                                />
                            </div>
                            <Link
                                to="/help"
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all duration-300 shadow-lg"
                            >
                                Visit Help Center <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                v.1.1.1
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-xs text-slate-500">
                            <span>© Skitech Solutions 2026</span>
                            <a 
                                href="https://skitechsolutions.vercel.app/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    forceOpen?: boolean;
}

export function FeedbackPopup({ isOpen: propIsOpen, onClose, forceOpen = false }: Props) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [step, setStep] = useState<'ask' | 'form' | 'success'>('ask');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Logic for auto-popup
        if (forceOpen) {
            setInternalOpen(true);
            return;
        }

        const hasSeenPopup = localStorage.getItem('skitech_feedback_seen');
        if (!hasSeenPopup && propIsOpen) {
            const timer = setTimeout(() => {
                setInternalOpen(true);
            }, 5000); // Popup after 5 seconds of browsing
            return () => clearTimeout(timer);
        }
    }, [propIsOpen, forceOpen]);

    const handleClose = () => {
        if (doNotShowAgain) {
            localStorage.setItem('skitech_feedback_seen', 'true');
        }
        setInternalOpen(false);
        onClose();
        // Reset after delay
        setTimeout(() => {
            setStep('ask');
            setRating(0);
            setFeedback('');
        }, 500);
    };

    const handleProceed = () => {
        setStep('form');
    };

    const handleSubmit = () => {
        // In a real app, send to API
        console.log('Feedback submitted:', {
            rating,
            feedback,
            doNotShowAgain,
            userId: user?.id,
            userName: user?.name,
            userRole: user?.userType === 'landlord' ? 'Landlord' : (user?.role === 'admin' ? 'Admin' : 'Resident')
        });
        setStep('success');
        if (doNotShowAgain) {
            localStorage.setItem('skitech_feedback_seen', 'true');
        }
        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {internalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 sm:p-10">
                            {step === 'ask' && (
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center mx-auto text-[#0F3D91]">
                                        <Heart className="w-10 h-10 fill-[#0F3D91]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-heading font-black text-slate-900 leading-tight">Help us build better</h2>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                            Would you wish to rate and give feedback about your experience with Skitech.?
                                        </p>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-3">
                                        <Button
                                            onClick={handleProceed}
                                            className="h-14 bg-[#0F3D91] hover:bg-[#FF7A00] text-white rounded-2xl font-heading font-bold text-base shadow-lg shadow-blue-900/10 transition-all duration-300"
                                        >
                                            Yes, I'd love to!
                                        </Button>
                                        <button
                                            onClick={handleClose}
                                            className="h-14 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
                                        >
                                            Not right now
                                        </button>

                                        <div className="flex items-center justify-center gap-2 pt-2">
                                            <Checkbox
                                                id="dontshow"
                                                checked={doNotShowAgain}
                                                onCheckedChange={(checked) => setDoNotShowAgain(!!checked)}
                                                className="rounded-md border-slate-200 data-[state=checked]:bg-[#0F3D91] data-[state=checked]:border-[#0F3D91]"
                                            />
                                            <Label htmlFor="dontshow" className="text-xs text-slate-400 font-bold uppercase tracking-widest cursor-pointer">Do not show again</Label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'form' && (
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-heading font-black text-slate-900">Your Opinion Matters</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Post a public testimonial</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Rate your experience</Label>
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setRating(s)}
                                                    className="p-1 px-2.5 "
                                                >
                                                    <Star
                                                        className={cn(
                                                            "w-8 h-8 transition-all duration-200",
                                                            rating >= s ? "fill-[#FF7A00] text-[#FF7A00] scale-110 shadow-sm" : "text-slate-200"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Share your thoughts</Label>
                                        <Textarea
                                            placeholder="What do you love most about Skitech.? Any suggestions?"
                                            className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus:bg-white resize-none font-medium text-sm transition-all"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        disabled={!rating || !feedback || !isAuthenticated}
                                        onClick={handleSubmit}
                                        className="w-full h-14 bg-[#FF7A00] hover:bg-orange-600 text-white rounded-2xl font-heading font-bold text-base shadow-xl shadow-orange-500/10 transition-all"
                                    >
                                        {isAuthenticated ? 'Post Feedback' : 'Login to Post Feedback'}
                                    </Button>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border-2 border-green-100">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-heading font-black text-slate-900 leading-tight tracking-tight">Post Received!</h2>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                            Thank you for helping us make Skitech. the best community platform in Embu.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
